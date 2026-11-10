"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Scroll-scrubbed image sequence rendered to a canvas.
 * Use it for frame-by-frame character animation (export frames from your
 * animation tool as numbered WebP files).
 */
export function ImageSequence({
  frames,
  path,
  trigger,
  start = "top top",
  end = "bottom top",
  className,
}: {
  frames: number;
  path: (i: number) => string;
  trigger: React.RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const t = trigger.current;
    if (!c || !t) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    const state = { frame: 0 };

    const render = () => {
      const img = images[Math.round(state.frame)];
      if (!img || !img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = c.clientWidth * dpr;
      const h = c.clientHeight * dpr;
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
      const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    for (let i = 0; i < frames; i++) {
      const img = new Image();
      img.src = path(i + 1);
      if (i === 0) img.onload = render;
      images.push(img);
    }

    const tween = gsap.to(state, {
      frame: frames - 1,
      ease: "none",
      snap: "frame",
      onUpdate: render,
      scrollTrigger: { trigger: t, start, end, scrub: 0.5 },
    });
    window.addEventListener("resize", render);
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      window.removeEventListener("resize", render);
      ScrollTrigger.refresh();
    };
  }, [frames, path, trigger, start, end]);

  return <canvas ref={canvas} className={className} />;
}
