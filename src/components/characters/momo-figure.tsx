"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { MomoPose } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * An ORIGINAL, stylised chibi vector character in Momo's spirit:
 * honey-brown hair, oversized pink cardigan, red ribbon, loose socks, hoop earrings,
 * and a psychic aura. Every limb is a separate group so GSAP can pose it.
 *
 * Swap for your own artwork via `characterArt` in src/content/site.ts.
 */

const OUTLINE = "#1b1024";
const SKIN = "#ffe3d1";
const HAIR = "#c98a4b";
const HAIR_LIGHT = "#eab47a";
const CARDIGAN = "#ff7fb0";
const CARDIGAN_DARK = "#e85b94";
const SHIRT = "#fffaf3";
const SKIN_SHADE = "#f6c4ae";
const HAIR_DARK = "#9a5f2c";
/** Almond anime eye (viewer-left eye); the right eye is a mirror of this. */
const EYE_SHAPE =
  "M76 112 Q80 101 92 101 Q101 101 104 107 Q105 119 99 125 Q90 130 82 125 Q76 120 76 112 Z";
const SKIRT = "#2b2340";

type PoseDef = { l: number; r: number; head: number; mouth: "smile" | "open" | "grin"; aura: number };

const POSES: Record<MomoPose, PoseDef> = {
  idle: { l: 8, r: -8, head: 0, mouth: "smile", aura: 0.25 },
  wave: { l: 10, r: -150, head: 4, mouth: "open", aura: 0.35 },
  point: { l: 12, r: -98, head: -4, mouth: "grin", aura: 0.35 },
  psychic: { l: 118, r: -118, head: 0, mouth: "open", aura: 1 },
  cheer: { l: 158, r: -158, head: 0, mouth: "open", aura: 0.8 },
  peace: { l: 10, r: -168, head: 8, mouth: "grin", aura: 0.4 },
  run: { l: 40, r: -40, head: -6, mouth: "grin", aura: 0.5 },
};

export function MomoFigure({
  pose = "idle",
  className,
  float = true,
}: {
  pose?: MomoPose;
  className?: string;
  float?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const root = useRef<SVGSVGElement>(null);
  const loops = useRef<gsap.core.Tween[]>([]);

  // Idle life: blinking + breathing float + hair sway.
  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      const blink = () => {
        gsap.to(".m-eyes", {
          scaleY: 0.08,
          svgOrigin: "110 114",
          duration: 0.07,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            gsap.delayedCall(gsap.utils.random(2, 5), blink);
          },
        });
      };
      gsap.delayedCall(1.5, blink);
      if (float) {
        gsap.to(".m-body", { y: -6, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }
      gsap.to(".m-hair-back", {
        rotation: 1.6,
        svgOrigin: "110 70",
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(".m-aura", { scale: 1.08, transformOrigin: "50% 50%", duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, svg);
    return () => ctx.revert();
  }, [float]);

  // Pose transitions.
  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const p = POSES[pose];
    loops.current.forEach((t) => t.kill());
    loops.current = [];
    const q = gsap.utils.selector(svg);
    const armL = q(".m-arm-l");
    const armR = q(".m-arm-r");

    gsap.to(armL, { rotation: p.l, svgOrigin: "82 172", duration: 0.55, ease: "back.out(1.8)" });
    gsap.to(armR, { rotation: p.r, svgOrigin: "138 172", duration: 0.55, ease: "back.out(1.8)" });
    gsap.to(q(".m-head, .m-head-back"), { rotation: p.head, svgOrigin: "110 152", duration: 0.6, ease: "back.out(2)" });
    gsap.to(q(".m-aura"), { opacity: p.aura, duration: 0.5 });
    gsap.to(q(".m-spark"), { opacity: p.aura > 0.7 ? 1 : 0, duration: 0.4 });

    q(".m-mouth").forEach((m) => {
      gsap.to(m, { opacity: m.getAttribute("data-mouth") === p.mouth ? 1 : 0, duration: 0.15 });
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    if (pose === "wave") {
      loops.current.push(
        gsap.fromTo(
          armR,
          { rotation: p.r - 14 },
          { rotation: p.r + 14, svgOrigin: "138 172", duration: 0.32, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.5 }
        )
      );
    }
    if (pose === "run") {
      loops.current.push(
        gsap.fromTo(armL, { rotation: -35 }, { rotation: 45, svgOrigin: "82 172", duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: -1 }),
        gsap.fromTo(armR, { rotation: 35 }, { rotation: -45, svgOrigin: "138 172", duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: -1 }),
        gsap.fromTo(q(".m-leg-l"), { rotation: -18 }, { rotation: 18, svgOrigin: "98 248", duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: -1 }),
        gsap.fromTo(q(".m-leg-r"), { rotation: 18 }, { rotation: -18, svgOrigin: "122 248", duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: -1 })
      );
    } else {
      gsap.to(q(".m-leg-l, .m-leg-r"), { rotation: 0, duration: 0.3 });
    }
    if (pose === "psychic" || pose === "cheer") {
      loops.current.push(
        gsap.to(q(".m-spark"), { rotation: 360, svgOrigin: "110 150", duration: 9, ease: "none", repeat: -1 })
      );
    }
    return () => {
      loops.current.forEach((t) => t.kill());
    };
  }, [pose]);

  const o = { stroke: OUTLINE, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

  return (
    <svg
      ref={root}
      viewBox="0 0 220 340"
      className={cn("overflow-visible", className)}
      role="img"
      aria-label="Animated illustrated character waving"
    >
      <defs>
        <radialGradient id={`aura-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff3d8b" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#ff3d8b" stopOpacity="0.28" />
          <stop offset="70%" stopColor="#3ff2e3" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3ff2e3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`hair-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={HAIR_LIGHT} />
          <stop offset="100%" stopColor={HAIR} />
        </linearGradient>
        <linearGradient id={`iris-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a0a1c" />
          <stop offset="45%" stopColor="#7a2350" />
          <stop offset="85%" stopColor="#e2588f" />
          <stop offset="100%" stopColor="#ffb1d0" />
        </linearGradient>
        <clipPath id={`eyeclip-${uid}`}>
          <path d={EYE_SHAPE} />
        </clipPath>
        <pattern id={`dots-${uid}`} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1" fill={CARDIGAN_DARK} />
        </pattern>
      </defs>

      {/* Psychic aura */}
      <ellipse className="m-aura" cx="110" cy="170" rx="118" ry="160" fill={`url(#aura-${uid})`} opacity="0.25" />
      <g className="m-spark" opacity="0">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path
            key={a}
            d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z"
            fill={a % 120 === 0 ? "#3ff2e3" : "#e9ff3b"}
            transform={`translate(${110 + Math.cos((a * Math.PI) / 180) * 120} ${150 + Math.sin((a * Math.PI) / 180) * 135})`}
          />
        ))}
      </g>

      {/* Ground shadow */}
      <ellipse cx="110" cy="330" rx="46" ry="6" fill="#000" opacity="0.35" />

      <g className="m-body">
        {/* Hair (back) */}
        <g className="m-head-back">
          <path
            className="m-hair-back"
            d="M48 106 C40 30 180 30 172 106 L182 188 L170 182 L166 202 L154 188 L146 198 L136 184 L84 184 L74 198 L66 188 L54 202 L50 182 L38 188 Z"
            fill={`url(#hair-${uid})`}
            {...o}
          />
        </g>

        {/* Legs */}
        <g className="m-leg-l">
          <rect x="92" y="246" width="13" height="52" rx="6" fill={SKIN} {...o} />
          <path d="M88 286 C86 300 88 314 90 318 L108 318 C110 312 110 300 108 286 C104 290 100 284 96 290 C93 285 90 290 88 286 Z" fill="#fff" {...o} />
          <path d="M84 326 C84 316 94 316 109 318 L110 326 Z" fill="#4a2a1a" {...o} />
        </g>
        <g className="m-leg-r">
          <rect x="115" y="246" width="13" height="52" rx="6" fill={SKIN} {...o} />
          <path d="M112 286 C110 300 112 314 114 318 L132 318 C134 312 134 300 132 286 C128 290 124 284 120 290 C117 285 114 290 112 286 Z" fill="#fff" {...o} />
          <path d="M111 326 L111 318 C126 316 136 316 136 326 Z" fill="#4a2a1a" {...o} />
        </g>

        {/* Skirt */}
        <path d="M80 226 L140 226 L154 262 L66 262 Z" fill={SKIRT} {...o} />
        <path d="M92 228 L86 260 M110 228 L110 261 M128 228 L134 260" stroke="#4b3f6b" strokeWidth="2" fill="none" />

        {/* Neck */}
        <rect x="102" y="140" width="16" height="26" rx="5" fill={SKIN} {...o} />

        {/* Shirt */}
        <path d="M88 162 L132 162 L140 232 L80 232 Z" fill={SHIRT} {...o} />
        {/* Cardigan halves */}
        <path d="M86 162 C70 170 66 210 72 240 L100 240 L102 166 Z" fill={CARDIGAN} {...o} />
        <path d="M134 162 C150 170 154 210 148 240 L120 240 L118 166 Z" fill={CARDIGAN} {...o} />
        <path d="M76 214 L98 214 L98 236 L76 236 Z" fill={`url(#dots-${uid})`} opacity="0.5" />
        <path d="M122 214 L144 214 L144 236 L122 236 Z" fill={`url(#dots-${uid})`} opacity="0.5" />
        {/* Ribbon */}
        <path d="M110 172 L94 164 L96 182 Z M110 172 L126 164 L124 182 Z" fill="#e5304f" {...o} strokeWidth={2.5} />
        <path d="M106 174 L102 194 L110 188 L118 194 L114 174 Z" fill="#c21d3c" {...o} strokeWidth={2.5} />
        <circle cx="110" cy="172" r="4.5" fill="#e5304f" {...o} strokeWidth={2.5} />

        {/* Left arm (viewer's left) */}
        <g className="m-arm-l">
          <path d="M72 168 L92 168 L96 220 L68 220 Z" fill={CARDIGAN} {...o} />
          <circle cx="82" cy="228" r="9" fill={SKIN} {...o} />
        </g>
        {/* Right arm */}
        <g className="m-arm-r">
          <path d="M128 168 L148 168 L152 220 L124 220 Z" fill={CARDIGAN} {...o} />
          <circle cx="138" cy="228" r="9" fill={SKIN} {...o} />
        </g>

        {/* Head: anime proportions: tapered jaw, big glossy eyes, tiny nose & mouth */}
        <g className="m-head">
          {/* Chin shadow on neck */}
          <path d="M98 146 Q110 162 122 146 L122 160 Q110 166 98 160 Z" fill={SKIN_SHADE} />

          {/* Face */}
          <path
            d="M62 94 C62 58 158 58 158 94 C158 120 150 136 132 148 Q118 156 110 157 Q102 156 88 148 C70 136 62 120 62 94 Z"
            fill={SKIN}
            {...o}
          />
          {/* Cel shadow cast by the bangs */}
          <path d="M64 98 Q110 88 156 98 L156 107 C140 101 124 99 110 101 C96 99 80 101 64 107 Z" fill={SKIN_SHADE} opacity="0.8" />

          {/* Blush with hatching */}
          <ellipse cx="80" cy="131" rx="10" ry="4.5" fill="#ff7fa8" opacity="0.45" />
          <ellipse cx="140" cy="131" rx="10" ry="4.5" fill="#ff7fa8" opacity="0.45" />
          <path d="M74 132 l3 -4 M79 132 l3 -4 M84 132 l3 -4 M134 132 l3 -4 M139 132 l3 -4 M144 132 l3 -4" stroke="#e85b94" strokeWidth="1.3" strokeLinecap="round" />

          {/* Eyes: viewer-left eye is drawn once and mirrored for the other */}
          <g className="m-eyes">
            {[false, true].map((mirror) => (
              <g key={String(mirror)} transform={mirror ? "translate(220 0) scale(-1 1)" : undefined}>
                {/* sclera */}
                <path d={EYE_SHAPE} fill="#fff" />
                {/* iris + pupil, clipped to the eye shape */}
                <g clipPath={`url(#eyeclip-${uid})`}>
                  <ellipse cx="89" cy="115" rx="9.5" ry="12.5" fill={`url(#iris-${uid})`} stroke="#3a0f24" strokeWidth="1.5" />
                  <ellipse cx="89" cy="116" rx="4.2" ry="6.8" fill="#1a0610" />
                  <path d="M81 121 Q89 128 97 121 Q89 125 81 121 Z" fill="#ffc2dc" opacity="0.8" />
                  {/* upper-lid shadow on the eyeball */}
                  <path d="M74 100 Q89 96 104 102 L104 108 Q89 102 74 108 Z" fill="#3a0f24" opacity="0.35" />
                </g>
                {/* upper lash line with winged outer corner */}
                <path
                  d="M104 109 Q101 100 90 100 Q80 100 76 105 L70 101 L74 109 Q75 111 76 113 Q80 104 90 103.5 Q99 103.5 103 110 Z"
                  fill={OUTLINE}
                />
                {/* lower lash */}
                <path d="M80 126 Q88 129.5 98 125" stroke={OUTLINE} strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </g>
            ))}
            {/* Highlights stay lit from the same side on both eyes */}
            {[89, 131].map((cx) => (
              <g key={cx}>
                <ellipse cx={cx - 3.5} cy="109" rx="3.4" ry="4.6" fill="#fff" />
                <circle cx={cx + 4} cy="120" r="1.7" fill="#fff" />
                <circle cx={cx + 1} cy="108" r="1" fill="#fff" opacity="0.9" />
              </g>
            ))}
          </g>

          {/* Brows: thin, expressive */}
          <path d="M77 91 Q86 86.5 97 90 M123 90 Q134 86.5 143 91" stroke="#8a5428" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Nose: a single soft tick */}
          <path d="M110.5 129 L109 132.5 L111 133" stroke="#d99a86" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Mouths (one visible per pose) */}
          <path className="m-mouth" data-mouth="smile" d="M104.5 140 Q110 144.5 115.5 140" stroke={OUTLINE} strokeWidth="2" fill="none" strokeLinecap="round" />
          <g className="m-mouth" data-mouth="open" opacity="0">
            <path d="M103 138 Q110 137 117 138 Q116 149 110 150 Q104 149 103 138 Z" fill="#9c1446" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
            <path d="M105.5 146 Q110 142.5 114.5 146 Q110 149.5 105.5 146 Z" fill="#ff7fa8" />
          </g>
          <g className="m-mouth" data-mouth="grin" opacity="0">
            <path d="M102.5 138 Q110 139 117.5 138 Q115 146 110 146.5 Q105 146 102.5 138 Z" fill="#9c1446" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
            <path d="M103.5 138.6 Q110 139.6 116.5 138.6 L115.8 141 Q110 141.8 104.2 141 Z" fill="#fff" />
          </g>

          {/* Ahoge (stray strand) */}
          <path d="M108 56 C102 36 120 28 128 38 C118 35 113 42 113 56 Z" fill={`url(#hair-${uid})`} {...o} strokeWidth={2.5} />

          {/* Bangs: curved, layered strands */}
          <path
            d="M56 112 C46 48 174 48 164 112 C161 101 157 94 151 89 C152 96 151 100 148 104 C144 96 137 88 128 82 C129 90 126 96 121 100 C118 92 112 85 103 79 C103 88 98 94 92 99 C91 91 86 85 78 83 C79 91 76 98 70 103 C68 98 64 94 58 91 Z"
            fill={`url(#hair-${uid})`}
            {...o}
          />
          {/* Strand shading */}
          <path d="M78 66 C76 78 78 86 80 90 M103 62 C104 72 104 78 103 84 M128 66 C129 76 129 82 128 86 M148 78 C150 86 151 92 151 96" stroke={HAIR_DARK} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />
          {/* Angel-ring shine */}
          <path
            d="M74 74 Q88 62 104 63 M116 63 Q132 64 144 74"
            stroke="#fff4e2"
            strokeWidth="3"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* Long side locks */}
          <path d="M60 96 C46 130 50 162 66 186 C63 164 66 140 71 114 Z" fill={`url(#hair-${uid})`} {...o} />
          <path d="M160 96 C174 130 170 162 154 186 C157 164 154 140 149 114 Z" fill={`url(#hair-${uid})`} {...o} />
          <path d="M61 120 C58 140 60 158 64 170 M159 120 C162 140 160 158 156 170" stroke={HAIR_DARK} strokeWidth="1.5" fill="none" opacity="0.7" />

          {/* Hoop earrings peeking below the locks */}
          <circle cx="70" cy="146" r="6" fill="none" stroke="#ffd23f" strokeWidth="2.5" />
          <circle cx="150" cy="146" r="6" fill="none" stroke="#ffd23f" strokeWidth="2.5" />
        </g>
      </g>
    </svg>
  );
}
