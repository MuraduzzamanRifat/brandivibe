export function Footer() {
  return (
    <footer className="relative border-t divider-line py-14 px-6 md:px-10 grain">
      <div className="mx-auto max-w-[1700px]">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <div className="font-display text-5xl md:text-7xl leading-none">VYCE</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40 mt-3">
              OCTANE — debut full-length · 06.21.26
            </div>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-8 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            <a href="#ascent" className="hover:text-[#ff5a1f] transition-colors">Tracklist</a>
            <a href="#world" className="hover:text-[#ff5a1f] transition-colors">The World</a>
            <a href="#tour" className="hover:text-[#ff5a1f] transition-colors">Tour</a>
            <a href="#drop" className="hover:text-[#ff5a1f] transition-colors">Pre-save</a>
            <a href="#" className="hover:text-[#ff5a1f] transition-colors">Merch</a>
            <a href="#" className="hover:text-[#ff5a1f] transition-colors">Press</a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t divider-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
          <span>© 2026 VYCE · Campaign destination built with craft by Brandivibe</span>
          <span className="flex gap-5">
            <a href="#" className="hover:text-white/60 transition-colors">Instagram</a>
            <a href="#" className="hover:text-white/60 transition-colors">TikTok</a>
            <a href="#" className="hover:text-white/60 transition-colors">X</a>
            <a href="#" className="hover:text-white/60 transition-colors">Discord</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
