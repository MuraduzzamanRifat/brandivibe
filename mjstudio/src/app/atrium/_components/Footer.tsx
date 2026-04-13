export function Footer() {
  return (
    <footer className="relative border-t hairline-champagne py-14 px-8 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full border border-[#e8d49a]/50 grid place-items-center">
              <span className="font-serif champagne-text leading-none">A</span>
            </div>
            <span className="font-serif text-lg">Atrium</span>
          </div>
          <div className="flex flex-wrap gap-6 text-[10px] tracking-[0.28em] uppercase text-white/40">
            <a href="#" className="hover:champagne-text">Portfolio</a>
            <a href="#" className="hover:champagne-text">Thesis</a>
            <a href="#" className="hover:champagne-text">Letters</a>
            <a href="#" className="hover:champagne-text">Team</a>
            <a href="#" className="hover:champagne-text">Diversity report</a>
          </div>
        </div>
        <div className="pt-8 border-t hairline-champagne flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[9px] tracking-[0.3em] uppercase text-white/30">
          <span>© MMXXVI Atrium Ventures · $1.4B AUM</span>
          <span>Built with craft by Brandivibe</span>
        </div>
      </div>
    </footer>
  );
}
