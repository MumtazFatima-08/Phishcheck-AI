import { motion } from 'framer-motion';
import { ArrowRight, Radar, ShieldAlert, Sparkles } from 'lucide-react';

const HeroSection = ({ onStart }) => {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(52,209,255,0.2),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(18,216,160,0.14),_transparent_25%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyanaccent/30 bg-cyanaccent/10 px-4 py-2 text-sm text-cyanaccent">
            <Sparkles size={16} />
            AI-Powered URL Threat Intelligence Platform
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Detect phishing attempts before they reach your users.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            PhishCheck AI gives security teams and developers a high-signal, real-time scanner for suspicious URLs with actionable recommendations and an exportable security report.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={onStart} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyanaccent to-greenaccent px-6 py-3 font-medium text-slate-950 transition hover:scale-[1.02]">
              Analyze a URL <ArrowRight size={18} />
            </button>
            <a href="#history" className="rounded-full border border-white/15 px-6 py-3 font-medium text-slate-200 transition hover:border-cyanaccent/40 hover:text-cyanaccent">
              View scan history
            </a>
          </div>
          <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
            {[
              { value: '0-100', label: 'Threat score' },
              { value: 'Real-time', label: 'Analysis engine' },
              { value: 'PDF', label: 'Exportable reports' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyanaccent/20 to-greenaccent/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyanaccent/10 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyanaccent">Live Threat Map</p>
                <p className="text-xl font-semibold text-white">Suspicious patterns detected</p>
              </div>
              <div className="rounded-full border border-redaccent/30 bg-redaccent/10 p-2 text-redaccent">
                <ShieldAlert size={18} />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                ['HTTPS check', 'Verified'],
                ['Keyword heuristics', 'Suspicious terms found'],
                ['Risk scoring', 'High confidence'],
              ].map(([title, value]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{title}</span>
                    <span className="font-medium text-cyanaccent">{value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center rounded-2xl border border-cyanaccent/20 bg-cyanaccent/10 p-5 text-cyanaccent">
              <Radar size={24} className="mr-3" />
              <span className="font-medium">Continuous signal monitoring for phishing infrastructure</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
