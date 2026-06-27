import { motion } from 'framer-motion';
import { Download, Search, Trash2 } from 'lucide-react';

const HistoryPanel = ({ history, search, setSearch, onDelete, onClear, onExport }) => {
  return (
    <section id="history" className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyanaccent/10 backdrop-blur-xl lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyanaccent">Scan History</p>
            <h2 className="text-3xl font-semibold text-white">Review and manage your threat investigations</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={onExport} className="inline-flex items-center gap-2 rounded-full border border-cyanaccent/20 bg-cyanaccent/10 px-4 py-2 text-sm font-medium text-cyanaccent transition hover:border-cyanaccent/40">
              <Download size={16} /> Export PDF
            </button>
            <button onClick={onClear} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-redaccent/40 hover:text-redaccent">
              <Trash2 size={16} /> Clear history
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-3 py-2 text-slate-300">
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="bg-transparent text-sm outline-none" placeholder="Search URLs" />
          </div>
          <p className="text-sm text-slate-400">Stored locally for every scan performed through the platform.</p>
        </div>

        <div className="mt-6 space-y-3">
          {history.length ? history.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-medium text-white">{item.url}</p>
                <p className="mt-1 text-sm text-slate-400">{item.scanned_at}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className={`rounded-full px-3 py-1 text-sm ${item.threat_score >= 65 ? 'bg-redaccent/10 text-redaccent' : item.threat_score >= 35 ? 'bg-amber-400/10 text-amber-300' : 'bg-greenaccent/10 text-greenaccent'}`}>
                  {item.risk_level}
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">Score {item.threat_score}</div>
                <button onClick={() => onDelete(item.id)} className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-redaccent/40 hover:text-redaccent">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          )) : <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400">No scan history available yet.</div>}
        </div>
      </div>
    </section>
  );
};

export default HistoryPanel;
