import { cn } from "@/lib/utils";

/**
 * A ghostly "psychic hand": the telekinesis motif used to grab, lift and
 * place content around the site. Purely decorative.
 */
export function PsychicHand({
  className,
  tone = "momo",
  id,
}: {
  className?: string;
  tone?: "momo" | "aura";
  id: string;
}) {
  const a = tone === "momo" ? "#ff3d8b" : "#3ff2e3";
  const b = tone === "momo" ? "#ff9cc6" : "#b6fff8";
  return (
    <svg viewBox="0 0 200 260" className={cn("overflow-visible", className)} aria-hidden>
      <defs>
        <linearGradient id={`ph-${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={a} stopOpacity="0.05" />
          <stop offset="60%" stopColor={a} stopOpacity="0.45" />
          <stop offset="100%" stopColor={b} stopOpacity="0.8" />
        </linearGradient>
        <filter id={`phg-${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#phg-${id})`} opacity="0.95">
        <g fill={`url(#ph-${id})`} stroke={b} strokeWidth="3" strokeLinejoin="round">
          {/* Palm + wrist as one silhouette so the outline reads cleanly */}
          <path d="M52 128
                   C50 100 60 96 66 98 L66 40 C66 26 86 26 86 40 L86 92
                   L90 92 L90 22 C90 8 112 8 112 22 L112 92
                   L116 92 L116 32 C116 18 138 18 138 32 L138 100
                   L142 100 L142 58 C142 44 162 44 162 58 L162 150
                   C162 190 146 210 128 220 L126 260 L70 260 L70 222
                   C58 210 44 186 30 160 L14 128 C8 116 22 104 34 114 L52 140 Z" />
        </g>
        {/* Knuckle creases */}
        <path d="M76 70 h0 M101 58 h0 M127 66 h0 M152 84 h0" stroke={b} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
      </g>
    </svg>
  );
}
