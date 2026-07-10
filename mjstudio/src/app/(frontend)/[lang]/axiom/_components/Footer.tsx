export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-6 md:px-10">
      <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full border border-[#14b8a6]/60 grid place-items-center">
            <span className="font-serif italic text-[#14b8a6] text-sm leading-none">A</span>
          </div>
          <span className="font-serif italic text-lg">Axiom</span>
          <span className="text-white/40 text-sm ml-2">© 2026 · Built with craft by Brandivibe</span>
        </div>
        <div className="flex gap-6 font-mono text-[10px] text-white/50 uppercase tracking-[0.25em]">
          <a href="#" className="hover:text-white">Product</a>
          <a href="#" className="hover:text-white">Security</a>
          <a href="#" className="hover:text-white">Docs</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
