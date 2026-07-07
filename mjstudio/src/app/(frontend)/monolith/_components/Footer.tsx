export function Footer() {
  return (
    <footer className="relative border-t border-[#1a1a1a]/10 py-14 px-6 md:px-12 bg-[#e7e3dc]">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[#1a1a1a]" />
              <span className="font-serif text-xl">Monolith</span>
            </div>
            <p className="text-xs text-[#5a5a5a] leading-relaxed max-w-xs">
              Architecture that stands. Independent studio since MCMXCII.
              Studios in Porto and Tokyo.
            </p>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a8a88] mb-4">Porto</div>
            <div className="text-xs text-[#5a5a5a] leading-relaxed">
              Rua do Passeio Alegre, 18
              <br />
              4150-570 Porto · Portugal
              <br />
              +351 22 617 0042
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#8a8a88] mb-4">Tokyo</div>
            <div className="text-xs text-[#5a5a5a] leading-relaxed">
              3-2-17 Honmachi, Naka
              <br />
              Aichi · Japan
              <br />
              +81 3 6412 9200
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-[#1a1a1a]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[9px] tracking-[0.3em] uppercase text-[#8a8a88]">
          <span>© MMXXVI Monolith Studio</span>
          <span>Built with craft by Brandivibe</span>
        </div>
      </div>
    </footer>
  );
}
