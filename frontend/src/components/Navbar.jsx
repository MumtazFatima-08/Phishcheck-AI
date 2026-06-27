import { ShieldCheck, Github, Linkedin, Mail } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-cyanaccent/30 bg-cyanaccent/10 p-2 text-cyanaccent shadow-glow">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">PhishCheck AI</p>
            <p className="text-xs uppercase tracking-[0.3em] text-cyanaccent/70">Threat Intelligence</p>
          </div>
        </div>
        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#scanner" className="transition hover:text-cyanaccent">Scanner</a>
          <a href="#dashboard" className="transition hover:text-cyanaccent">Dashboard</a>
          <a href="#history" className="transition hover:text-cyanaccent">History</a>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-cyanaccent/40 hover:text-cyanaccent">
            <Github size={16} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-cyanaccent/40 hover:text-cyanaccent">
            <Linkedin size={16} />
          </a>
          <a href="mailto:contact@phishcheck.ai" className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-cyanaccent/40 hover:text-cyanaccent">
            <Mail size={16} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
