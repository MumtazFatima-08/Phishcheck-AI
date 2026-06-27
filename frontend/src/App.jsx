import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ScannerPanel from './components/ScannerPanel';
import Dashboard from './components/Dashboard';
import HistoryPanel from './components/HistoryPanel';
import Footer from './components/Footer';
import { clearHistory, deleteHistoryItem, exportHistory, getHistory, scanUrl } from './services/api';

const App = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadHistory = async (searchTerm = '') => {
    try {
      const data = await getHistory(20, searchTerm);
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHistory(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await scanUrl(url);
      setResult(data);
      await loadHistory();
    } catch (err) {
      setError(err.message || 'Unable to complete scan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      await loadHistory(search);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    try {
      await clearHistory();
      setHistory([]);
      setResult(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async () => {
    try {
      await exportHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const heroStats = useMemo(() => [
    { label: 'Risk categories', value: '5' },
    { label: 'Detection heuristics', value: '8' },
    { label: 'Secure export', value: 'PDF' },
  ], []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main>
        <HeroSection onStart={() => document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' })} />
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 grid max-w-7xl gap-4 md:grid-cols-3">
            {heroStats.map((item) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-slate-400">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
        <ScannerPanel url={url} setUrl={setUrl} loading={loading} onScan={handleScan} result={result} error={error} />
        <Dashboard result={result} history={history} />
        <HistoryPanel history={history} search={search} setSearch={setSearch} onDelete={handleDelete} onClear={handleClear} onExport={handleExport} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
