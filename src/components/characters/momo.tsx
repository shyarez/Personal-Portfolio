"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { characterArt, type MomoPose } from "@/content/site";
import { MomoFigure } from "./momo-figure";
import { cn } from "@/lib/utils";

/**
 * Renders the Momo character for a pose. If artwork is supplied for the pose in
 * `characterArt`, the image is used; otherwise the vector figure is drawn.
 */
export function Momo({ pose, className, float = true }: { pose: MomoPose; className?: string; float?: boolean }) {
  const src = characterArt.momo.poses[pose];
  if (src) return <MomoImage src={src} pose={pose} className={className} float={float} />;
  return <MomoFigure pose={pose} className={className} float={float} />;
}

/** Aura strength per pose (mirrors the vector figure's values). */
const AURA: Record<MomoPose, number> = {
  idle: 0.25,
  wave: 0.35,
  point: 0.35,
  psychic: 1,
  cheer: 0.8,
  peace: 0.4,
  run: 0.5,
};

/**
 * A single flat artwork can't move its limbs, so each pose is expressed by
 * animating the whole image (pivoting from the feet): never distorting the art.
 * The box keeps the vector figure's 220:340 footprint so every existing layout,
 * GSAP timeline and ScrollTrigger lines up exactly as before.
 */
function MomoImage({
  src,
  pose,
  className,
  float,
}: {
  src: string;
  pose: MomoPose;
  className?: string;
  float: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const aura = useRef<HTMLDivElement>(null);

  // Ambient breathing + aura pulse.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (float) gsap.to(root.current, { y: -6, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(aura.current, { scale: 1.08, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, root);
    return () => ctx.revert();
  }, [float]);

  // Pose changes.
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    gsap.to(aura.current, { opacity: AURA[pose], duration: 0.5 });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tweens: gsap.core.Animation[] = [];
    gsap.killTweensOf(el);
    gsap.set(el, { transformOrigin: "50% 100%" });
    // A little "pop" whenever the pose switches.
    tweens.push(gsap.fromTo(el, { scale: 1.06 }, { scale: 1, duration: 0.45, ease: "back.out(2.5)" }));

    switch (pose) {
      case "wave":
        tweens.push(gsap.fromTo(el, { rotation: -3 }, { rotation: 3, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: -1 }));
        break;
      case "point":
        tweens.push(gsap.to(el, { rotation: -4, x: -4, duration: 0.5, ease: "back.out(2)" }));
        break;
      case "peace":
        tweens.push(gsap.to(el, { rotation: 4, x: 0, duration: 0.5, ease: "back.out(2)" }));
        break;
      case "psychic":
        tweens.push(
          gsap.to(el, { rotation: 0, x: 0, duration: 0.3 }),
          gsap.fromTo(el, { y: 0 }, { y: -14, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: -1 })
        );
        break;
      case "cheer":
        tweens.push(
          gsap.to(el, { rotation: 0, x: 0, duration: 0.2 }),
          gsap
            .timeline({ repeat: -1, repeatDelay: 0.25 })
            .to(el, { scaleY: 0.95, scaleX: 1.03, duration: 0.12, ease: "power2.out" })
            .to(el, { y: -22, scaleY: 1.03, scaleX: 0.98, duration: 0.28, ease: "power2.out" })
            .to(el, { y: 0, scaleY: 1, scaleX: 1, duration: 0.3, ease: "bounce.out" })
        );
        break;
      case "run":
        tweens.push(
          gsap.fromTo(el, { y: 0 }, { y: -8, duration: 0.16, ease: "sine.inOut", yoyo: true, repeat: -1 }),
          gsap.fromTo(el, { rotation: -4 }, { rotation: 4, duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: -1 })
        );
        break;
      default:
        tweens.push(gsap.to(el, { rotation: 0, x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.4, ease: "power2.out" }));
    }
    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [pose]);

  return (
    <div ref={root} className={cn("relative aspect-[220/340]", className)}>
      <div
        ref={aura}
        aria-hidden
        className="pointer-events-none absolute inset-[-8%] rounded-[50%] opacity-25"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,61,139,0.6), rgba(255,61,139,0.22) 45%, rgba(63,242,227,0.14) 70%, transparent)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute bottom-[1%] left-1/2 h-[3%] w-[42%] -translate-x-1/2 rounded-[50%] bg-black/35 blur-[2px]" />
      <div ref={body} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Anime character illustration"
          draggable={false}
          decoding="async"
          className="h-full w-full select-none object-contain object-bottom"
        />
      </div>
    </div>
  );
}
