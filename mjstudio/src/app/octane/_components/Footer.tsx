export function Footer() {
  return (
    <footer className="relative border-t divider-line py-14 px-6 md:px-10 grain">
      <div className="mx-auto max-w-[1800px]">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <div className="font-display text-5xl md:text-7xl leading-none">OCTANE</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#c4b49a]/40 mt-3">
              MOUNTAIN — VYCE · campaign destination · 06.21.26
            </div>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4b49a]/45">
            <a href="#ascent" className="hover:text-[#c4b49a] transition-colors">The Ascent</a>
            <a href="#world" className="hover:text-[#c4b49a] transition-colors">The World</a>
            <a href="#tour" className="hover:text-[#c4b49a] transition-colors">The Channel</a>
            <a href="#drop" className="hover:text-[#c4b49a] transition-colors">The Drop</a>
            <a href="#" className="hover:text-[#c4b49a] transition-colors">Merch</a>
            <a href="#" className="hover:text-[#c4b49a] transition-colors">Press</a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t divider-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.3em] text-[#c4b49a]/30">
          <span>© 2026 VYCE · Campaign destination — a concept study built by Brandivibe</span>
          <span className="flex gap-5">
            <a href="#" className="hover:text-[#ece6da]/60 transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#ece6da]/60 transition-colors">TikTok</a>
            <a href="#" className="hover:text-[#ece6da]/60 transition-colors">X</a>
            <a href="#" className="hover:text-[#ece6da]/60 transition-colors">Discord</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
