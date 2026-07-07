const logos = [
  "ACME CORP",
  "NORTHWIND",
  "VERTEX",
  "MONOLITH",
  "AURORA",
  "CIPHER",
];

export function LogoBar() {
  return (
    <section className="py-20 px-6 lg:px-8 border-t border-border-soft">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm text-foreground-soft mb-10 font-mono uppercase tracking-widest">
          Trusted by teams at
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-foreground-soft font-semibold tracking-[0.2em] text-sm hover:text-foreground transition-colors"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
