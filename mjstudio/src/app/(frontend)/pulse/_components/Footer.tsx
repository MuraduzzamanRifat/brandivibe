export function Footer() {
  return (
    <footer className="border-t border-pulse-faint py-14 px-6 bg-white">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0d9488] to-[#14b8a6] grid place-items-center">
            <span className="font-serif italic text-white text-sm leading-none">p</span>
          </div>
          <span className="font-serif text-lg text-pulse-fg">Pulse</span>
          <span className="text-pulse-soft text-xs ml-2">
            © 2026 · Built with craft by Brandivibe
          </span>
        </div>
        <div className="flex gap-6 text-xs text-pulse-muted uppercase tracking-[0.15em]">
          <a href="#" className="hover:text-pulse-fg">For providers</a>
          <a href="#" className="hover:text-pulse-fg">Science</a>
          <a href="#" className="hover:text-pulse-fg">Privacy</a>
          <a href="#" className="hover:text-pulse-fg">HIPAA</a>
        </div>
      </div>
    </footer>
  );
}
