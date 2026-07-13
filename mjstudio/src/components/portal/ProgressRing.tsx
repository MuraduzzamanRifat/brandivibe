/** A small SVG progress ring. Pure server component, no JS. */
export function ProgressRing({ percent, size = 56 }: { percent: number; size?: number }) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (p / 100) * c;
  return (
    <span
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${p}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(42,35,31,0.10)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary-strong)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute font-mono text-[0.7rem] font-semibold text-foreground">{p}%</span>
    </span>
  );
}
