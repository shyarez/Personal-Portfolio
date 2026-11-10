"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { skills } from "@/content/site";
import { PsychicHand } from "@/components/characters/psychic-hand";
import { SectionHeading, Sfx } from "@/components/fx/misc";
import { cn } from "@/lib/utils";

const ACCENT = {
  momo: { text: "text-momo", bg: "bg-momo", glow: "rgba(255,61,139,0.35)" },
  aura: { text: "text-aura", bg: "bg-aura", glow: "rgba(63,242,227,0.3)" },
  volt: { text: "text-volt", bg: "bg-volt", glow: "rgba(233,255,59,0.25)" },
} as const;

function TiltCard({ children, glow }: { children: React.ReactNode; glow: string }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 200, damping: 18 });
  const bg = useTransform(
    [mx, my],
    ([x, y]: number[]) => `radial-gradient(400px circle at ${x * 100}% ${y * 100}%, ${glow}, transparent 60%)`
  );
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      className="group relative h-full overflow-hidden rounded-3xl border-2 border-white/10 bg-ink-2 p-7"
    >
      <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: bg }} />
      {children}
    </motion.div>
  );
}

export function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from(".sk-card", {
        y: 80,
        opacity: 0,
        rotateX: -30,
        stagger: 0.12,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".sk-cards", start: "top 85%", toggleActions: "play none none reverse" },
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        // Telekinesis: scattered chips get pulled into formation while pinned.
        const chips = gsap.utils.toArray<HTMLElement>(".sk-chip");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".sk-field",
            start: "center center",
            end: "+=120%",
            pin: true,
            scrub: 1,
          },
        });
        tl.from(chips, {
          x: () => gsap.utils.random(-600, 600),
          y: () => gsap.utils.random(-380, 380),
          rotate: () => gsap.utils.random(-120, 120),
          scale: () => gsap.utils.random(0.4, 1.6),
          opacity: 0.25,
          filter: "blur(6px)",
          stagger: { each: 0.02, from: "random" },
          ease: "power3.out",
        })
          .from(".sk-hand", { scale: 0.4, opacity: 0, rotate: -40, ease: "back.out(2)" }, 0)
          .to(".sk-hand", { scale: 1.15, ease: "sine.inOut" }, 0.5)
          .from(".sk-aura", { scale: 0.2, opacity: 0 }, 0)
          .to(".sk-field-title", { letterSpacing: "0.05em" }, 0)
          .to(".sk-hand", { y: -40, opacity: 0.25, ease: "power2.in" }, ">")
          .to(chips, { boxShadow: "0 0 0 2px rgba(63,242,227,0.4), 0 0 24px rgba(63,242,227,0.25)", stagger: 0.01 }, "<");
      });
      mm.add("(max-width: 767px)", () => {
        gsap.from(".sk-chip", {
          y: 30,
          opacity: 0,
          stagger: 0.04,
          scrollTrigger: { trigger: ".sk-field", start: "top 80%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="skills" ref={root} className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(122,92,255,0.18),transparent_60%)]" />
      <Sfx text="ズズズ" tone="aura" className="absolute left-[55%] top-24 hidden -rotate-6 text-7xl md:block lg:text-8xl" speed={0.5} />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading index="02" kana="技術" title={skills.heading} />
        <p className="mt-6 max-w-xl text-lg text-foreground/70">{skills.intro}</p>

        <div className="sk-cards mt-16 grid gap-5 [perspective:1200px] md:grid-cols-3">
          {skills.areas.map((a, i) => {
            const c = ACCENT[a.accent];
            return (
              <div key={a.title} className="sk-card"><TiltCard glow={c.glow}>
                <span className="pointer-events-none absolute -right-2 -top-4 font-display text-7xl text-white/[0.04]">{a.kana}</span>
                <span className={cn("font-mono text-xs", c.text)}>0{i + 1}</span>
                <div className={cn("mt-6 h-1.5 w-12 rounded-full", c.bg)} />
                <h3 className="mt-6 font-display text-2xl">{a.title}</h3>
                <p className="mt-3 text-foreground/65">{a.description}</p>
              </TiltCard></div>
            );
          })}
        </div>
      </div>

      {/* Telekinesis field */}
      <div className="sk-field relative mx-auto mt-24 flex min-h-[80vh] max-w-6xl flex-col items-center justify-center px-6 md:mt-32">
        <div className="sk-aura pointer-events-none absolute left-1/2 top-1/2 size-[70vmin] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,61,139,0.22),rgba(63,242,227,0.08)_45%,transparent_70%)]" />
        <div className="sk-hand pointer-events-none absolute left-1/2 top-1/2 w-48 -translate-1/2 opacity-60 md:w-72">
          <PsychicHand id="skills" tone="aura" className="w-full" />
        </div>
        <ul className="relative flex max-w-4xl flex-wrap justify-center gap-3 md:gap-4">
          {skills.stack.map((s, i) => (
            <li key={s} className="sk-chip rounded-full">
              <motion.span
                whileHover={{ y: -6, rotate: i % 2 ? 3 : -3, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 14 }}
                className="flex items-center rounded-full border-2 border-white/15 bg-ink-3/90 px-5 py-2.5 font-semibold backdrop-blur md:text-lg"
                data-cursor="✦"
              >
                {s}
              </motion.span>
            </li>
          ))}
        </ul>
        <p className="sk-field-title relative mt-10 font-mono text-xs uppercase tracking-[0.4em] text-aura">
          ✦ telekinetic stack ✦
        </p>
      </div>
    </section>
  );
}
