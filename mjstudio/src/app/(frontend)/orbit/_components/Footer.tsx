export function Footer() {
  return (
    <footer className="relative border-t divider-line py-12 px-6 md:px-10">
      <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border border-[#84ff6b] grid place-items-center">
            <div className="w-2 h-2 bg-[#84ff6b]" />
          </div>
          <span className="font-bold text-lg tracking-tight">ORBIT</span>
          <span className="text-white/40 text-xs ml-3">© 2026 · Built with craft by Brandivibe</span>
        </div>
        <div className="flex flex-wrap gap-6 font-mono text-[10px] text-white/50 uppercase tracking-[0.25em]">
          <a href="#" className="hover:text-[#84ff6b]">Vehicle</a>
          <a href="#" className="hover:text-[#84ff6b]">Performance</a>
          <a href="#" className="hover:text-[#84ff6b]">Press</a>
          <a href="#" className="hover:text-[#84ff6b]">Careers</a>
        </div>
      </div>
    </footer>
  );
}
