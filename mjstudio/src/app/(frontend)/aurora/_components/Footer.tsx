export function Footer() {
  return (
    <footer className="relative border-t border-[#d4a017]/10 py-14 px-8 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-[#d4a017]/50 grid place-items-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#fef3c7] to-[#d4a017]" />
            </div>
            <span className="font-serif text-xl tracking-wider">Aurora</span>
          </div>
          <div className="flex flex-wrap gap-8 text-[10px] tracking-[0.3em] uppercase text-white/40">
            <a href="#" className="hover:text-[#fde68a]">Geneva atelier</a>
            <a href="#" className="hover:text-[#fde68a]">London boutique</a>
            <a href="#" className="hover:text-[#fde68a]">Tokyo maison</a>
            <a href="#" className="hover:text-[#fde68a]">Service</a>
            <a href="#" className="hover:text-[#fde68a]">Heritage</a>
          </div>
        </div>
        <div className="pt-8 border-t border-[#d4a017]/8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[9px] tracking-[0.3em] uppercase text-white/30">
          <span>© MMXXVI Aurora Chronograph SA · Swiss Made</span>
          <span>Built with craft by Brandivibe</span>
        </div>
      </div>
    </footer>
  );
}
