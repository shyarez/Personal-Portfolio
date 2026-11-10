import { cn } from "@/lib/utils";

/**
 * Original chibi cameo of a nervous, glasses-wearing occult nerd peeking over an edge.
 * Gripping hands sit on the bottom edge of the SVG.
 */
export function OkarunPeek({ className }: { className?: string }) {
  const o = { stroke: "#1b1024", strokeWidth: 3, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 160 120" className={cn("overflow-visible", className)} aria-hidden>
      {/* hair back */}
      <path d="M26 92 C14 30 146 30 134 92 Z" fill="#1d1a2e" {...o} />
      {/* face */}
      <ellipse cx="80" cy="82" rx="46" ry="40" fill="#ffe8d8" {...o} />
      {/* bangs: heavy, shaggy */}
      <path d="M30 80 C28 34 132 34 130 80 L122 66 L114 82 L104 62 L94 80 L84 60 L74 80 L64 60 L54 80 L44 64 L38 82 Z" fill="#1d1a2e" {...o} />
      {/* glasses */}
      <g fill="#e6f7ff" fillOpacity="0.35" stroke="#1b1024" strokeWidth="3.5">
        <circle cx="62" cy="92" r="14" />
        <circle cx="98" cy="92" r="14" />
        <path d="M76 92 L84 92" />
      </g>
      <circle className="ok-eye" cx="62" cy="94" r="3.5" fill="#1b1024" />
      <circle className="ok-eye" cx="98" cy="94" r="3.5" fill="#1b1024" />
      <path d="M56 86 l6 -2 M92 84 l6 2" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      {/* sweat drop */}
      <path className="ok-sweat" d="M128 62 C122 72 124 80 130 80 C136 80 136 72 128 62 Z" fill="#7ad7ff" {...o} strokeWidth={2} />
      {/* hands gripping the edge */}
      <g fill="#ffe8d8" {...o}>
        <rect x="18" y="104" width="30" height="16" rx="8" />
        <rect x="112" y="104" width="30" height="16" rx="8" />
      </g>
      <path d="M26 108 v8 M33 108 v8 M40 108 v8 M120 108 v8 M127 108 v8 M134 108 v8" stroke="#1b1024" strokeWidth="2" />
    </svg>
  );
}
