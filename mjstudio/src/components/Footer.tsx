export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#84e1ff] to-[#a78bfa] grid place-items-center">
            <span className="text-black font-bold text-sm">B</span>
          </div>
          <span className="font-semibold">Brandivibe</span>
          <span className="text-white/40 text-sm ml-2">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-sm text-white/60">
          <a href="#work" className="hover:text-white transition-colors">Work</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          <a href="mailto:hello@brandivibe.com" className="hover:text-white transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
}
