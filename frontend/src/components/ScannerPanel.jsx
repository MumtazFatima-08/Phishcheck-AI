import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Loader2, Search, ShieldCheck } from 'lucide-react';

const ScannerPanel = ({ url, setUrl, loading, onScan, result, error }) => {
  return (
    <section id="scanner" className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyanaccent/10 backdrop-blur-xl lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyanaccent/20 bg-cyanaccent/10 px-3 py-1 text-sm text-cyanaccent">
              <Search size={16} />
              URL Scanner
            </div>
            <h2 className="text-3xl font-semibold text-white">Paste a link and receive a malware-aware threat assessment.</h2>
            <p className="mt-3 max-w-2xl text-slate-300">The scanner evaluates HTTPS use, suspicious keywords, URL structure, and other phishing indicators to produce a risk score and remediation guidance.</p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <label className="mb-2 block text-sm text-slate-400" htmlFor="url">Target URL</label>
              <input
                id="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none ring-0 transition focus:border-cyanaccent"
                placeholder="https://example.com/login"
              />
              <button
                onClick={onScan}
                disabled={loading || !url.trim()}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyanaccent to-greenaccent px-5 py-3 font-medium text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                {loading ? 'Analyzing...' : 'Scan URL'}
              </button>
            </div>
            {error ? <p className="mt-4 text-sm text-redaccent">{error}</p> : null}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-slate-950/90 to-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyanaccent">Result</p>
                <p className="text-xl font-semibold text-white">Threat assessment</p>
              </div>
              {result ? (
                <div className={`rounded-full px-3 py-1 text-sm ${result.threat_score >= 65 ? 'bg-redaccent/10 text-redaccent' : result.threat_score >= 35 ? 'bg-amber-400/10 text-amber-300' : 'bg-greenaccent/10 text-greenaccent'}`}>
                  {result.risk_level}
                </div>
              ) : null}
            </div>
            {result ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Threat score</span>
                    <span className="text-3xl font-semibold text-white">{result.threat_score}/100</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyanaccent via-greenaccent to-redaccent" style={{ width: `${result.threat_score}%` }} />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-2">
                    {result.threat_score >= 65 ? <AlertTriangle className="mt-0.5 text-redaccent" size={18} /> : <CheckCircle2 className="mt-0.5 text-greenaccent" size={18} />}
                    <div>
                      <p className="text-sm font-medium text-white">Recommendation</p>
                      <p className="mt-1 text-sm leading-7 text-slate-300">{result.recommendation}</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(result.indicators).map(([key, value]) => (
                    <div key={key} className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 text-sm">
                      <p className="text-slate-400">{key.replace(/_/g, ' ')}</p>
                      <p className="mt-1 font-medium text-white">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400">
                Your scan results will appear here after analysis.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScannerPanel;
