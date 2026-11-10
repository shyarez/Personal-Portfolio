import { cn } from "@/lib/utils";

/** Original beckoning lucky-cat figurine: a mischievous cursed-doll cameo. */
export function LuckyCat({ className }: { className?: string }) {
  const o = { stroke: "#1b1024", strokeWidth: 3, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 160 200" className={cn("overflow-visible", className)} aria-hidden>
      <ellipse cx="80" cy="192" rx="50" ry="6" fill="#000" opacity="0.3" />
      {/* raised paw (animated via .cat-paw) */}
      <g className="cat-paw">
        <path d="M118 112 L128 62 C130 50 146 50 146 62 L138 116 Z" fill="#fff" {...o} />
        <path d="M130 62 l2 -6 M137 60 l0 -6 M144 62 l-1 -6" stroke="#1b1024" strokeWidth="2" />
      </g>
      {/* body */}
      <path d="M30 120 C26 180 40 190 80 190 C120 190 134 180 130 120 Z" fill="#fff" {...o} />
      {/* bib + bell */}
      <path d="M40 118 Q80 140 120 118 L120 128 Q80 150 40 128 Z" fill="#e5304f" {...o} />
      <circle cx="80" cy="142" r="10" fill="#ffd23f" {...o} />
      <path d="M72 142 h16" stroke="#1b1024" strokeWidth="2" />
      {/* coin */}
      <ellipse cx="80" cy="170" rx="26" ry="14" fill="#ffd23f" {...o} />
      <text x="80" y="176" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1b1024">福</text>
      {/* head */}
      <path d="M28 70 L34 26 L60 50 Q80 44 100 50 L126 26 L132 70 C140 110 120 122 80 122 C40 122 20 110 28 70 Z" fill="#fff" {...o} />
      <path d="M36 36 L40 54 L52 50 Z M124 36 L120 54 L108 50 Z" fill="#ff8fbd" />
      {/* face: sly */}
      <path d="M50 82 Q58 76 66 82 M94 82 Q102 76 110 82" stroke="#1b1024" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M72 96 Q80 104 88 96" stroke="#1b1024" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M78 90 h4" stroke="#ff3d8b" strokeWidth="5" strokeLinecap="round" />
      <path d="M30 92 h-14 M30 98 l-14 4 M130 92 h14 M130 98 l14 4" stroke="#1b1024" strokeWidth="2" />
      <ellipse cx="52" cy="96" rx="7" ry="3.5" fill="#ff7fa8" opacity="0.6" />
      <ellipse cx="108" cy="96" rx="7" ry="3.5" fill="#ff7fa8" opacity="0.6" />
    </svg>
  );
}
