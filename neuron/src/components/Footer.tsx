export function Footer() {
  return (
    <footer className="border-t border-border-soft py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2.5 mb-4">
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0369a1] to-[#0ea5e9]" />
                <div className="absolute inset-[3px] rounded-full bg-white grid place-items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0369a1]" />
                </div>
              </div>
              <span className="font-semibold tracking-tight">Neuron</span>
            </a>
            <p className="text-sm text-foreground-muted max-w-xs leading-relaxed">
              The developer-first platform for production-grade AI agents.
            </p>
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-foreground-soft mb-4">
              Product
            </div>
            <ul className="space-y-2 text-sm">
              {["Features", "Playground", "Pricing", "Changelog"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-foreground-muted hover:text-foreground transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-foreground-soft mb-4">
              Developers
            </div>
            <ul className="space-y-2 text-sm">
              {["Docs", "SDK", "API", "GitHub"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-foreground-muted hover:text-foreground transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-foreground-soft mb-4">
              Company
            </div>
            <ul className="space-y-2 text-sm">
              {["About", "Blog", "Careers", "Contact"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-foreground-muted hover:text-foreground transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-xs text-foreground-soft">
            © 2026 Neuron · Built with craft by MJ Studio
          </div>
          <div className="flex items-center gap-6 text-xs text-foreground-soft">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
