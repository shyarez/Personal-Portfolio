"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * A skewed "panel border" marquee that separates sections.
 * Its speed and direction react to scroll velocity.
 */
export function KatakanaBand({
  words = ["ドン", "SOFTWARE", "ゴゴゴ", "DEVELOPER", "ズドン", "BUILD", "バーン", "SHIP"],
  tone = "momo",
  className,
  rotate = -3,
}: {
  words?: string[];
  tone?: "momo" | "volt" | "aura";
  className?: string;
  rotate?: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const track = root.current!.querySelector<HTMLDivElement>(".kb-track")!;
      const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 30, repeat: -1 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const dir = self.direction;
          gsap
            .timeline({ overwrite: true })
            .to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 300, 7)), duration: 0.2 })
            .to(loop, { timeScale: dir, duration: 1.2, ease: "power2.out" });
        },
      });
    },
    { scope: root }
  );

  const bg = { momo: "bg-momo text-ink", volt: "bg-volt text-ink", aura: "bg-aura text-ink" }[tone];

  return (
    <div
      ref={root}
      className={cn("relative z-20 -mx-8 overflow-hidden border-y-4 border-ink py-3", bg, className)}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <div className="kb-track flex w-max whitespace-nowrap font-display text-3xl md:text-5xl">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {[...words, ...words].map((w, i) => (
              <span key={i} className="flex items-center gap-8 pr-8">
                {w}
                <span className="inline-block size-3 rotate-45 bg-ink md:size-4" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
