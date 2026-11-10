"use client";

import { useRef } from "react";
import { Briefcase, MapPin } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience } from "@/content/site";
import { OkarunPeek } from "@/components/characters/okarun-peek";
import { SectionHeading, Sfx } from "@/components/fx/misc";
import { KatakanaBand } from "@/components/fx/katakana-band";
import { cn } from "@/lib/utils";

export function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      // Timeline spine draws itself and a spirit orb rides it.
      gsap.fromTo(
        ".ex-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".ex-list", start: "top 60%", end: "bottom 60%", scrub: 0.6 },
        }
      );
      gsap.fromTo(
        ".ex-orb",
        { top: "0%" },
        {
          top: "100%",
          ease: "none",
          scrollTrigger: { trigger: ".ex-list", start: "top 60%", end: "bottom 60%", scrub: 0.6 },
        }
      );

      gsap.utils.toArray<HTMLElement>(".ex-item").forEach((item, i) => {
        const fromLeft = i % 2 === 0;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: "top 78%", toggleActions: "play none none reverse" },
        });
        tl.from(item.querySelector(".ex-node"), { scale: 0, rotate: 180, duration: 0.6, ease: "back.out(3)" })
          .from(
            item.querySelector(".ex-card"),
            { x: fromLeft ? -120 : 120, rotate: fromLeft ? -4 : 4, opacity: 0, duration: 0.9, ease: "expo.out" },
            "<0.05"
          )
          .from(item.querySelectorAll(".ex-point"), { x: 20, opacity: 0, stagger: 0.07, duration: 0.5 }, "<0.3")
          .from(item.querySelector(".ex-date"), { y: 20, opacity: 0, duration: 0.5 }, "<");
      });

      // Cameo: nervous occult nerd peeks over the first card.
      gsap.fromTo(
        ".ex-peek",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.7,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".ex-item", start: "top 60%", toggleActions: "play reverse play reverse" },
        }
      );
      gsap.to(".ex-peek .ok-eye", { x: 3, duration: 0.6, yoyo: true, repeat: -1, ease: "steps(2)", repeatDelay: 1.2 });
      gsap.to(".ex-peek .ok-sweat", { y: 6, opacity: 0, duration: 1.2, repeat: -1, ease: "power1.in" });
    },
    { scope: root }
  );

  return (
    <section id="experience" ref={root} className="relative overflow-hidden bg-ink pb-36 pt-32 md:pt-44">
      <div className="absolute inset-x-0 top-0">
        <KatakanaBand tone="volt" rotate={2} words={["経験値", "EXPERIENCE", "ミッション", "INTERNSHIPS", "レベルアップ", "LEVEL UP"]} />
      </div>
      <Sfx text="ザッ" tone="momo" className="absolute right-[6%] top-[30%] hidden rotate-6 text-8xl md:block" />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeading index="04" kana="経歴" title="Experience" />

        <ol className="ex-list relative mt-20">
          {/* spine */}
          <div className="absolute bottom-0 left-[19px] top-0 w-[3px] bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <div className="ex-line h-full w-full origin-top bg-gradient-to-b from-momo via-violet to-aura" />
            <div className="ex-orb absolute left-1/2 size-5 -translate-1/2 rounded-full bg-aura shadow-[0_0_24px_8px_rgba(63,242,227,0.6)]" />
          </div>

          {experience.map((e, i) => {
            const right = i % 2 === 1;
            return (
              <li key={e.company + e.role} className="ex-item relative grid gap-6 pb-20 pl-14 md:grid-cols-2 md:gap-16 md:pl-0">
                <span className="ex-node absolute left-[7px] top-6 grid size-7 place-items-center rounded-full border-[3px] border-ink bg-momo md:left-1/2 md:-translate-x-1/2">
                  <span className="size-2 rounded-full bg-paper" />
                </span>

                <div className={cn("ex-date md:pt-5", right ? "md:order-2 md:text-left" : "md:text-right")}>
                  <span className="font-mono text-sm uppercase tracking-[0.2em] text-volt">{e.period}</span>
                </div>

                <div className={cn("relative", right ? "md:order-1" : "")}>
                  {i === 0 && (
                    <div className="pointer-events-none absolute -top-[76px] right-8 h-[80px] w-28 overflow-hidden">
                      <div className="ex-peek">
                        <OkarunPeek className="w-28" />
                      </div>
                    </div>
                  )}
                  <div className="ex-card relative rounded-3xl border-2 border-white/10 bg-ink-2 p-6 transition-colors hover:border-momo/50 md:p-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="size-4 text-momo" />
                        {e.company}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4 text-aura" />
                        {e.location}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-2xl md:text-3xl">{e.role}</h3>
                    <ul className="mt-5 space-y-3">
                      {e.points.map((p) => (
                        <li key={p} className="ex-point flex gap-3 text-foreground/75">
                          <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-momo" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {e.tech.map((t) => (
                        <li key={t} className="rounded-full bg-white/5 px-3 py-1 font-mono text-[11px] text-aura">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
