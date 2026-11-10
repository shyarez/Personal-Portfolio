"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/content/site";

export const PRELOADER_DONE = "preloader:done";

export function isPreloaderDone() {
  return typeof window !== "undefined" && !!(window as unknown as { __preloaderDone?: boolean }).__preloaderDone;
}

/** Run `cb` once the intro has finished (immediately if it already has). */
export function onPreloaderDone(cb: () => void) {
  if (isPreloaderDone()) {
    cb();
    return () => {};
  }
  window.addEventListener(PRELOADER_DONE, cb, { once: true });
  return () => window.removeEventListener(PRELOADER_DONE, cb);
}

/** Manga-style intro: count up, slam the kana in, then slash the panels apart. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = () => {
      (window as unknown as { __preloaderDone?: boolean }).__preloaderDone = true;
      window.dispatchEvent(new Event(PRELOADER_DONE));
      setGone(true);
    };
    if (reduce) {
      done();
      return;
    }
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          done();
        },
      });
      tl.to(counter, {
        v: 100,
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate: () => {
          const n = el.querySelector(".pl-count");
          if (n) n.textContent = String(Math.round(counter.v)).padStart(3, "0");
        },
      })
        .from(".pl-kana span", { yPercent: 120, stagger: 0.06, duration: 0.6, ease: "back.out(2)" }, 0.1)
        .from(".pl-ring", { scale: 0, rotate: -180, duration: 1.2, ease: "expo.out", stagger: 0.1 }, 0)
        .to(".pl-flash", { opacity: 0.9, duration: 0.06 }, ">-0.05")
        .to(".pl-flash", { opacity: 0, duration: 0.3 })
        .to(".pl-content", { scale: 1.3, opacity: 0, duration: 0.4, ease: "power2.in" }, "<")
        .to(".pl-panel-a", { xPercent: -110, duration: 0.85, ease: "expo.inOut" }, "<0.1")
        .to(".pl-panel-b", { xPercent: 110, duration: 0.85, ease: "expo.inOut" }, "<");
    }, el);
    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[90]" aria-hidden>
      <div className="pl-panel-a absolute inset-0 bg-ink" style={{ clipPath: "polygon(0 0, 62% 0, 38% 100%, 0 100%)" }} />
      <div className="pl-panel-b absolute inset-0 bg-ink-2" style={{ clipPath: "polygon(62% 0, 100% 0, 100% 100%, 38% 100%)" }} />
      <div className="pl-content absolute inset-0 flex flex-col items-center justify-center">
        <div className="pl-ring absolute size-[60vmin] rounded-full border-[3px] border-dashed border-momo/40" />
        <div className="pl-ring absolute size-[44vmin] rounded-full border-2 border-aura/30" />
        <div className="pl-kana flex overflow-hidden font-display text-[12vmin] leading-none text-momo">
          {"ドドドド".split("").map((c, i) => (
            <span key={i} className="inline-block">
              {c}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-baseline gap-3 font-mono text-sm tracking-[0.3em] text-muted">
          <span className="pl-count text-2xl text-volt">000</span>
          <span>LOADING {site.shortName}.EXE</span>
        </div>
      </div>
      <div className="pl-flash pointer-events-none absolute inset-0 bg-white opacity-0" />
    </div>
  );
}
