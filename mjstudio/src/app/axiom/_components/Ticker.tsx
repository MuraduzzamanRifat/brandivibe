"use client";

const rows = [
  { pair: "USD → EUR", rate: "0.9214", volume: "$ 412M", delta: "+0.08%" },
  { pair: "USD → JPY", rate: "149.82", volume: "$ 287M", delta: "-0.12%" },
  { pair: "USD → GBP", rate: "0.7918", volume: "$ 198M", delta: "+0.05%" },
  { pair: "USD → BRL", rate: "5.1240", volume: "$ 142M", delta: "-0.34%" },
  { pair: "USD → INR", rate: "83.12", volume: "$ 118M", delta: "+0.02%" },
  { pair: "USD → NGN", rate: "1547.3", volume: "$ 94M", delta: "+0.71%" },
];

export function Ticker() {
  return (
    <section className="relative py-20 px-6 md:px-10 border-y border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(20,184,166,0.04),transparent_70%)] pointer-events-none" />
      <div className="mx-auto max-w-[1400px] relative">
        <div className="flex items-center justify-between mb-10">
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em]">
            — Live rates · 03
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#14b8a6]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14b8a6] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#14b8a6]" />
            </span>
            REAL-TIME
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {rows.map((r) => (
            <div
              key={r.pair}
              className="grid grid-cols-12 gap-4 py-5 items-center hover:bg-white/[0.02] transition-colors"
            >
              <div className="col-span-3 ticker text-sm text-white/80">{r.pair}</div>
              <div className="col-span-3 ticker text-xl md:text-2xl cream-text">{r.rate}</div>
              <div className="col-span-3 ticker text-sm text-white/60">{r.volume}</div>
              <div
                className={`col-span-3 ticker text-sm text-right ${
                  r.delta.startsWith("+") ? "text-[#2dd4bf]" : "text-[#f87171]"
                }`}
              >
                {r.delta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
