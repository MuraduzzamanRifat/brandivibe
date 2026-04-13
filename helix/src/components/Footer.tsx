export function Footer() {
  return (
    <footer className="relative border-t border-[#fbbf24]/10 py-12 px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">Protocol</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-[#fbbf24]">Stake</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">Unstake</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">Rewards</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">Validators</a></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">Resources</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-[#fbbf24]">Docs</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">Audits</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">Analytics</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">Governance</a></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">Community</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-[#fbbf24]">Discord</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">Twitter / X</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">GitHub</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">Mirror</a></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">Legal</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-[#fbbf24]">Terms</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">Privacy</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">Risks</a></li>
              <li><a href="#" className="hover:text-[#fbbf24]">Bug bounty</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-[#fbbf24]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border border-[#fbbf24]/60 grid place-items-center">
              <span className="font-heading font-bold text-[#fbbf24] text-xs">H</span>
            </div>
            <span className="font-heading font-semibold tracking-widest">HELIX</span>
            <span className="text-white/40 text-sm ml-2">© 2026 · Built with craft by MJ Studio</span>
          </div>
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
            Contract: 0xHe11x...9F2a
          </div>
        </div>
      </div>
    </footer>
  );
}
