const Footer = () => {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">PhishCheck AI</p>
          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-400">A secure, modern platform for evaluating suspicious URLs and building confidence in digital interactions.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          <a href="#scanner" className="transition hover:text-cyanaccent">About</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="transition hover:text-cyanaccent">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="transition hover:text-cyanaccent">LinkedIn</a>
          <a href="mailto:contact@phishcheck.ai" className="transition hover:text-cyanaccent">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
