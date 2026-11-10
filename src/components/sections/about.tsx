"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { about, site } from "@/content/site";
import { PsychicHand } from "@/components/characters/psychic-hand";
import { ScrubText, SectionHeading, Sfx } from "@/components/fx/misc";

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Stat counters
      gsap.utils.toArray<HTMLElement>(".ab-stat").forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: reduce ? target : 0 };
        el.textContent = String(obj.v);
        if (reduce) return;
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
      if (reduce) return;

      // A psychic hand carries the portrait panel in and lets go.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".ab-stage", start: "top 85%", end: "center 45%", scrub: 1 },
      });
      tl.fromTo(
        ".ab-card",
        { x: -260, y: -160, rotate: -28, scale: 0.8 },
        { x: 0, y: 0, rotate: -4, scale: 1, ease: "power2.out" }
      )
        .fromTo(
          ".ab-hand",
          { x: -260, y: -260, rotate: 150, opacity: 1 },
          { x: 0, y: -100, rotate: 170, ease: "power2.out" },
          0
        )
        .to(".ab-hand", { x: -120, y: -320, opacity: 0, rotate: 140, ease: "power2.in" }, ">-0.05");

      gsap.from(".ab-fact", {
        y: 40,
        opacity: 0,
        rotate: () => gsap.utils.random(-6, 6),
        stagger: 0.08,
        duration: 0.8,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".ab-facts", start: "top 85%", toggleActions: "play none none reverse" },
      });
      gsap.from(".ab-para", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        scrollTrigger: { trigger: ".ab-paras", start: "top 85%", toggleActions: "play none none reverse" },
      });
      gsap.to(".ab-tape", { rotate: "+=4", duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" });
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} className="paper-section relative overflow-hidden pb-32 pt-28 md:pt-40">
      <div className="halftone pointer-events-none absolute -right-20 top-20 size-96 rounded-full text-momo/20" />
      <div className="halftone pointer-events-none absolute -left-10 bottom-40 size-72 text-ink/10" />
      <Sfx text="ゴゴゴ" tone="momo" className="absolute right-[5%] top-[6%] hidden rotate-12 text-6xl md:block lg:text-8xl" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading index="01" kana="自己紹介" title="About me" dark={false} />

        <div className="mt-14 grid items-start gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16 lg:gap-24">
          {/* Portrait panel */}
          <div className="ab-stage relative mx-auto w-full max-w-xs md:sticky md:top-28 md:max-w-sm">
            <div className="ab-hand pointer-events-none absolute -left-10 top-0 z-20 w-40 opacity-0">
              <PsychicHand id="about" tone="momo" className="w-full" />
            </div>
            <div className="ab-card relative border-[4px] border-ink bg-paper p-3 shadow-[8px_8px_0_0_var(--ink)]">
              <span className="ab-tape absolute -top-4 left-1/2 z-10 h-7 w-28 -translate-x-1/2 -rotate-3 bg-momo/70" />
              <div className="relative aspect-[4/5] overflow-hidden border-[3px] border-ink bg-ink">
                {about.portrait ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={about.portrait} alt={`Portrait of ${site.name}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <div className="speedlines absolute inset-0 opacity-70" />
                    <div className="halftone absolute inset-0 text-momo/30" />
                    <span className="relative font-display text-8xl text-paper">{site.shortName}</span>
                    <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-paper/60">
                      add your photo → content/site.ts
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-1 pt-3 font-mono text-[11px] uppercase tracking-widest text-ink/70">
                <span>{site.name}</span>
                <span>{site.location}</span>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <ScrubText className="font-display text-2xl leading-[1.15] text-ink md:text-3xl lg:text-[2.5rem]">
              {about.heading}
            </ScrubText>
            <div className="ab-paras mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-ink/75 md:text-lg">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="ab-para">
                  {p}
                </p>
              ))}
            </div>

            <dl className="ab-facts mt-10 grid max-w-2xl grid-cols-2 gap-4">
              {about.facts.map((f) => (
                <div key={f.label} className="ab-fact border-[3px] border-ink bg-white px-4 py-3.5 shadow-[4px_4px_0_0_var(--ink)]">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-ink/50">{f.label}</dt>
                  <dd className="mt-1 font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 grid max-w-2xl grid-cols-3 divide-x-2 divide-ink/15 border-y-2 border-ink/15">
              {about.stats.map((s) => (
                <div key={s.label} className="px-2 py-5 text-center sm:px-4">
                  <div className="font-display text-4xl text-momo md:text-5xl">
                    <span className="ab-stat" data-value={s.value}>
                      {s.value}
                    </span>
                    {s.suffix}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink/60 md:text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
