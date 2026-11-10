import { cn } from "@/lib/utils";

export function Ufo({ className, beam = true }: { className?: string; beam?: boolean }) {
  return (
    <svg viewBox="0 0 240 260" className={cn("overflow-visible", className)} aria-hidden>
      <defs>
        <linearGradient id="ufo-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ff2e3" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3ff2e3" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ufo-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9d3e8" />
          <stop offset="100%" stopColor="#7c7296" />
        </linearGradient>
      </defs>
      {beam && <path className="ufo-beam" d="M92 74 L148 74 L210 260 L30 260 Z" fill="url(#ufo-beam)" />}
      <ellipse cx="120" cy="40" rx="38" ry="30" fill="#3ff2e3" opacity="0.35" stroke="#1b1024" strokeWidth="3" />
      <ellipse cx="108" cy="30" rx="10" ry="6" fill="#fff" opacity="0.6" />
      <ellipse cx="120" cy="58" rx="100" ry="22" fill="url(#ufo-body)" stroke="#1b1024" strokeWidth="3" />
      <ellipse cx="120" cy="66" rx="58" ry="10" fill="#4b3f6b" stroke="#1b1024" strokeWidth="3" />
      {[40, 75, 120, 165, 200].map((x, i) => (
        <circle key={x} className="ufo-light" cx={x} cy={i === 2 ? 74 : 60} r="5" fill={i % 2 ? "#e9ff3b" : "#ff3d8b"} />
      ))}
    </svg>
  );
}
