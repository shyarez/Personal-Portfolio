"use client";

import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring } from "motion/react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Scroll progress bar                                                 */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-momo via-violet to-aura"
      style={{ scaleX }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic hover wrapper                                              */
/* ------------------------------------------------------------------ */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter-style section heading                                       */
/* ------------------------------------------------------------------ */
export function SectionHeading({
  index,
  kana,
  title,
  className,
  dark = true,
  size = "lg",
}: {
  index: string;
  kana: string;
  title: string;
  className?: string;
  dark?: boolean;
  /** "md" for narrow columns (e.g. the Projects intro panel). */
  size?: "md" | "lg";
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const split = SplitText.create(root.current!.querySelector(".sh-title"), { type: "chars,words", mask: "chars" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 85%", toggleActions: "play none none reverse" },
      });
      tl.from(".sh-line", { scaleX: 0, transformOrigin: "left", duration: 0.8, ease: "expo.out" })
        .from(".sh-meta > *", { y: 20, opacity: 0, stagger: 0.08, duration: 0.5 }, "<0.1")
        .from(split.chars, { yPercent: 115, rotate: 10, stagger: 0.022, duration: 0.75, ease: "back.out(1.6)" }, "<0.1");
      return () => split.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className={cn("relative", className)}>
      <div
        className={cn(
          "sh-meta mb-5 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em]",
          dark ? "text-muted" : "text-ink/60"
        )}
      >
        <span className="text-momo">CH.{index}</span>
        <span className={cn("sh-line h-px w-16", dark ? "bg-white/30" : "bg-ink/30")} />
        <span className="font-display tracking-normal">{kana}</span>
      </div>
      <h2
        className={cn(
          "sh-title split-safe font-display leading-[0.95]",
          size === "md" ? "text-5xl md:text-[clamp(2.75rem,4.4vw,4.75rem)]" : "text-5xl md:text-7xl lg:text-8xl",
          dark ? "text-foreground" : "text-ink"
        )}
      >
        {title}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Manga SFX text: bursts in, drifts with parallax                    */
/* ------------------------------------------------------------------ */
export function Sfx({
  text,
  className,
  tone = "momo",
  speed = 0.3,
}: {
  text: string;
  className?: string;
  tone?: "momo" | "volt" | "aura" | "ink";
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(ref.current, {
        scale: 0.2,
        rotate: -25,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(3)",
        scrollTrigger: { trigger: ref.current, start: "top 92%", toggleActions: "play none none reverse" },
      });
      gsap.to(ref.current, {
        yPercent: -100 * speed,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: ref }
  );
  const color = { momo: "text-momo", volt: "text-volt", aura: "text-aura", ink: "text-ink" }[tone];
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none select-none font-display leading-none [paint-order:stroke_fill] [-webkit-text-stroke:6px_var(--ink)]",
        color,
        className
      )}
    >
      {text}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Word-by-word scrubbed text reveal                                   */
/* ------------------------------------------------------------------ */
export function ScrubText({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const split = SplitText.create(ref.current, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
      return () => split.revert();
    },
    { scope: ref }
  );
  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}
