import json
import os
import re
import sqlite3
import urllib.parse
from datetime import datetime, timezone
from typing import Any, Dict, List

from flask import Flask, Response, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
app.config["DATABASE"] = os.getenv("DATABASE_URL", "sqlite:///phishcheck.db")
CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGINS", "*")}})


class Database:
    def __init__(self, path: str):
        self.path = path
        self._init_db()

    def _init_db(self) -> None:
        con = sqlite3.connect(self.path)
        con.execute(
            """
            CREATE TABLE IF NOT EXISTS scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                threat_score INTEGER NOT NULL,
                risk_level TEXT NOT NULL,
                recommendation TEXT NOT NULL,
                indicators TEXT NOT NULL,
                scanned_at TEXT NOT NULL
            )
            """
        )
        con.commit()
        con.close()

    def connect(self) -> sqlite3.Connection:
        con = sqlite3.connect(self.path)
        con.row_factory = sqlite3.Row
        return con


DB_PATH = os.path.join(os.path.dirname(__file__), "phishcheck.db")
db = Database(DB_PATH)

SUSPICIOUS_KEYWORDS = [
    "login",
    "verify",
    "secure",
    "bank",
    "paypal",
    "update",
    "signin",
    "password",
    "admin",
    "confirm",
    "support",
    "invoice",
    "account",
    "alert",
]


def _normalize_url(raw_url: str) -> str:
    value = raw_url.strip()
    if not value:
        raise ValueError("URL is required")
    if not re.match(r"^https?://", value, re.IGNORECASE):
        value = f"https://{value}"
    return value


def _looks_like_ip(host: str) -> bool:
    return bool(re.match(r"^\d{1,3}(?:\.\d{1,3}){3}$", host))


def _analyze_url(url: str) -> Dict[str, Any]:
    parsed = urllib.parse.urlparse(url)
    host = parsed.hostname or ""
    path = parsed.path or ""
    query = parsed.query or ""
    netloc = parsed.netloc or ""

    indicators = {
        "https": parsed.scheme.lower() == "https",
        "suspicious_keywords": [],
        "long_url": False,
        "contains_at": "@" in netloc,
        "ip_address": _looks_like_ip(host),
        "excessive_hyphens": False,
        "excessive_subdomains": False,
        "contains_numbers": False,
    }

    score = 0
    if not indicators["https"]:
        score += 20

    lowered = (host + path + query).lower()
    found_keywords = [keyword for keyword in SUSPICIOUS_KEYWORDS if keyword in lowered]
    indicators["suspicious_keywords"] = found_keywords
    score += min(20, len(found_keywords) * 5)

    url_length = len(url)
    if url_length > 70:
        indicators["long_url"] = True
        score += 10
    if url_length > 100:
        score += 10

    if indicators["contains_at"]:
        score += 20
    if indicators["ip_address"]:
        score += 25

    hyphen_count = host.count("-")
    if hyphen_count > 2:
        indicators["excessive_hyphens"] = True
        score += 10

    subdomain_count = host.count(".")
    if subdomain_count > 3:
        indicators["excessive_subdomains"] = True
        score += 10

    if re.search(r"\d", host):
        indicators["contains_numbers"] = True
        score += 8

    if "//" in url and url.count("//") > 1:
        score += 5

    score = min(100, max(0, score))

    if score >= 85:
        risk_level = "Critical"
        recommendation = "This URL exhibits multiple high-confidence phishing indicators. Avoid interacting with it and do not enter credentials."
    elif score >= 65:
        risk_level = "High Risk"
        recommendation = "This URL looks suspicious and should be treated with caution. Avoid entering personal data or downloading files."
    elif score >= 35:
        risk_level = "Medium Risk"
        recommendation = "Proceed with caution. Verify the destination through the official brand website before continuing."
    elif score >= 15:
        risk_level = "Low Risk"
        recommendation = "The URL appears mostly benign, but stay alert for unusual behavior or prompts."
    else:
        risk_level = "Safe"
        recommendation = "The URL appears safe based on the available indicators. Continue carefully and monitor for unexpected redirects."

    return {
        "url": url,
        "threat_score": score,
        "risk_level": risk_level,
        "recommendation": recommendation,
        "indicators": indicators,
    }


def _db_row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "url": row["url"],
        "threat_score": row["threat_score"],
        "risk_level": row["risk_level"],
        "recommendation": row["recommendation"],
        "indicators": json.loads(row["indicators"]),
        "scanned_at": row["scanned_at"],
    }


def _create_pdf_report(rows: List[Dict[str, Any]]) -> bytes:
    content = "PhishCheck AI Security Report\n\n"
    if not rows:
        content += "No scan history available."
    else:
        for row in rows:
            content += f"- URL: {row['url']}\n"
            content += f"  Date: {row['scanned_at']}\n"
            content += f"  Threat Score: {row['threat_score']}\n"
            content += f"  Risk: {row['risk_level']}\n"
            content += f"  Recommendation: {row['recommendation']}\n\n"
    return content.encode("utf-8")


@app.get("/health")
def health() -> Response:
    return jsonify({"status": "ok", "service": "PhishCheck AI", "timestamp": datetime.now(timezone.utc).isoformat()})


@app.post("/scan")
def scan_url() -> Response:
    payload = request.get_json(silent=True) or {}
    raw_url = payload.get("url", "")
    try:
        url = _normalize_url(raw_url)
        result = _analyze_url(url)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    con = db.connect()
    con.execute(
        """
        INSERT INTO scans (url, threat_score, risk_level, recommendation, indicators, scanned_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            result["url"],
            result["threat_score"],
            result["risk_level"],
            result["recommendation"],
            json.dumps(result["indicators"]),
            datetime.now(timezone.utc).isoformat(),
        ),
    )
    con.commit()
    scan_id = con.execute("SELECT last_insert_rowid() AS id").fetchone()["id"]
    con.close()

    result["id"] = scan_id
    return jsonify(result)


@app.get("/history")
def history() -> Response:
    limit = request.args.get("limit", default=20, type=int)
    search = request.args.get("search", "", type=str).strip()
    con = db.connect()
    if search:
        rows = con.execute("SELECT * FROM scans WHERE url LIKE ? ORDER BY id DESC LIMIT ?", (f"%{search}%", limit)).fetchall()
    else:
        rows = con.execute("SELECT * FROM scans ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    con.close()
    return jsonify({"results": [_db_row_to_dict(row) for row in rows]})


@app.delete("/history")
def clear_history() -> Response:
    con = db.connect()
    con.execute("DELETE FROM scans")
    con.commit()
    con.close()
    return jsonify({"message": "History cleared"})


@app.delete("/history/<int:scan_id>")
def delete_history_item(scan_id: int) -> Response:
    con = db.connect()
    con.execute("DELETE FROM scans WHERE id = ?", (scan_id,))
    con.commit()
    con.close()
    return jsonify({"message": f"Scan {scan_id} deleted"})


@app.get("/export")
def export_history() -> Response:
    con = db.connect()
    rows = con.execute("SELECT * FROM scans ORDER BY id DESC").fetchall()
    con.close()
    payload = [_db_row_to_dict(row) for row in rows]
    pdf_bytes = _create_pdf_report(payload)
    return Response(pdf_bytes, mimetype="application/pdf", headers={"Content-Disposition": "attachment; filename=phishcheck-report.pdf"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=False)
