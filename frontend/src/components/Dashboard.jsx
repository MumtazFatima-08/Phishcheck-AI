import { motion } from 'framer-motion';
import { Activity, BarChart3, ShieldCheck, TrendingUp } from 'lucide-react';

const Dashboard = ({ result, history }) => {
  const safeCount = history.filter((item) => item.threat_score < 35).length;
  const highRiskCount = history.filter((item) => item.threat_score >= 65).length;
  const averageScore = history.length ? Math.round(history.reduce((sum, item) => sum + item.threat_score, 0) / history.length) : 0;

  return (
    <section id="dashboard" className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full border border-cyanaccent/20 bg-cyanaccent/10 p-2 text-cyanaccent">
            <BarChart3 size={18} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyanaccent">Operations Dashboard</p>
            <h2 className="text-3xl font-semibold text-white">Threat intelligence overview</h2>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Current scan</p>
                <p className="text-2xl font-semibold text-white">{result ? `${result.threat_score}/100` : 'Awaiting input'}</p>
              </div>
              <div className="rounded-2xl border border-cyanaccent/20 bg-cyanaccent/10 p-3 text-cyanaccent">
                <Activity size={20} />
              </div>
            </div>
            <div className="mt-6 h-3 rounded-full bg-slate-800">
              <div className="h-3 rounded-full bg-gradient-to-r from-cyanaccent via-greenaccent to-redaccent" style={{ width: `${result ? result.threat_score : 0}%` }} />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Average risk</p>
                <p className="mt-2 text-xl font-semibold text-white">{averageScore}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">High risk alerts</p>
                <p className="mt-2 text-xl font-semibold text-white">{highRiskCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Historical coverage</p>
                <p className="text-2xl font-semibold text-white">{history.length} total analyses</p>
              </div>
              <div className="rounded-2xl border border-greenaccent/20 bg-greenaccent/10 p-3 text-greenaccent">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {[
                ['Safe observations', safeCount, 'text-greenaccent'],
                ['Critical patterns', highRiskCount, 'text-redaccent'],
                ['Protected by policy', history.length ? 'Enabled' : 'Awaiting scans', 'text-cyanaccent'],
              ].map(([label, value, color]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-slate-300">{label}</span>
                  <span className={`font-medium ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
