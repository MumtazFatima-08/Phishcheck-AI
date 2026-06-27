const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export async function scanUrl(url) {
  const response = await fetch(`${API_BASE_URL}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Unable to scan URL');
  }
  return data;
}

export async function getHistory(limit = 10, search = '') {
  const query = new URLSearchParams({ limit: String(limit), search });
  const response = await fetch(`${API_BASE_URL}/history?${query.toString()}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Unable to load history');
  }
  return data.results;
}

export async function deleteHistoryItem(id) {
  const response = await fetch(`${API_BASE_URL}/history/${id}`, { method: 'DELETE' });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Unable to delete history item');
  }
  return data;
}

export async function clearHistory() {
  const response = await fetch(`${API_BASE_URL}/history`, { method: 'DELETE' });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Unable to clear history');
  }
  return data;
}

export async function exportHistory() {
  const response = await fetch(`${API_BASE_URL}/export`);
  if (!response.ok) {
    throw new Error('Unable to export report');
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'phishcheck-report.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
