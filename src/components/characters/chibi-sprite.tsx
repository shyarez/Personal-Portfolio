"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { chibi } from "@/content/site";
import { cn } from "@/lib/utils";

const ALL = Array.from({ length: chibi.count }, (_, i) => i + 1);

/**
 * Frame-based chibi character.
 *
 * All frames are mounted once, stacked on the same square canvas, and only their
 * opacity changes: so there's no image reload, no layout shift and no flicker,
 * and the character stays anchored in exactly the same place for every pose.
 *
 * `sequence` is one frame (a held pose) or several (looped at `chibi.interval`).
 */
export function ChibiSprite({ sequence, className }: { sequence: number[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);
  const key = sequence.join(",");
  const current = sequence[tick % sequence.length] ?? 1;

  // Loop multi-frame steps (e.g. waving).
  useEffect(() => {
    setTick(0);
    if (sequence.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTick((t) => t + 1), chibi.interval);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // A small squash-and-stretch "pop" whenever the pose itself changes.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      root.current,
      { scaleX: 1.06, scaleY: 0.94 },
      { scaleX: 1, scaleY: 1, duration: 0.45, ease: "elastic.out(1, 0.5)", transformOrigin: "50% 100%", overwrite: true }
    );
  }, [key]);

  return (
    <div ref={root} className={cn("relative aspect-square", className)}>
      {ALL.map((n) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={n}
          src={chibi.path(n)}
          alt={n === current ? "Chibi character" : ""}
          aria-hidden={n !== current}
          draggable={false}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full select-none object-contain object-bottom"
          style={{ opacity: n === current ? 1 : 0 }}
        />
      ))}
    </div>
  );
}

/** Pick the frames for a section at a given scroll progress, with a little hysteresis. */
export function framesForProgress(sectionId: string, progress: number, currentStep: number) {
  const steps = chibi.sections[sectionId];
  if (!steps?.length) return null;
  let idx = 0;
  steps.forEach((s, i) => {
    if (progress >= s.from) idx = i;
  });
  // Don't flip-flop right on a boundary.
  if (idx !== currentStep && currentStep >= 0 && currentStep < steps.length) {
    const boundary = steps[Math.max(idx, currentStep)].from;
    if (Math.abs(progress - boundary) < 0.025) idx = currentStep;
  }
  return { step: idx, frames: steps[idx].frames };
}
