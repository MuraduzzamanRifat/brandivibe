"use client";

const clients = [
  "HELIX",
  "NEURON",
  "AURORA",
  "NORTHWIND",
  "FLUX",
  "VERTEX",
  "CIPHER",
  "MONOLITH",
];

export function Marquee() {
  return (
    <section className="relative py-16 border-y border-white/5 overflow-hidden">
      <div className="mask-fade-r flex whitespace-nowrap">
        <div className="marquee flex shrink-0 gap-16 px-8">
          {[...clients, ...clients].map((c, i) => (
            <span
              key={i}
              className="font-mono text-2xl md:text-3xl text-white/30 tracking-widest"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
