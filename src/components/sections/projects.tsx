"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/content/site";
import { Ufo } from "@/components/characters/ufo";
import { GithubIcon } from "@/components/brand-icons";
import { SectionHeading } from "@/components/fx/misc";
import { cn } from "@/lib/utils";

const ACCENT: Record<Project["accent"], { bg: string; text: string; from: string }> = {
  momo: { bg: "bg-momo", text: "text-momo", from: "from-momo/60" },
  aura: { bg: "bg-aura", text: "text-aura", from: "from-aura/50" },
  volt: { bg: "bg-volt", text: "text-volt", from: "from-volt/50" },
  violet: { bg: "bg-violet", text: "text-violet", from: "from-violet/60" },
};

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const a = ACCENT[p.accent];
  return (
    <article className="pj-card group relative flex w-[86vw] shrink-0 flex-col overflow-hidden rounded-[28px] border-[3px] border-white/10 bg-ink-2 md:w-[min(62vw,820px)]">
      {/* Visual panel */}
      <div className="relative aspect-[16/9] overflow-hidden border-b-[3px] border-white/10">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={`${p.title} screenshot`} className="pj-img h-full w-full scale-110 object-cover transition-transform duration-700 group-hover:scale-100" />
        ) : (
          <div className={cn("pj-img absolute inset-0 scale-110 bg-gradient-to-br to-ink transition-transform duration-700 group-hover:scale-100", a.from)}>
            <div className="speedlines absolute inset-0 opacity-60" />
            <div className="halftone absolute -right-10 -top-10 size-80 rounded-full text-white/15" />
            <span className="absolute -bottom-8 -left-2 font-display text-[11rem] leading-none text-white/10">
              0{i + 1}
            </span>
            <span className="absolute right-6 top-6 font-display text-5xl text-white/90 [writing-mode:vertical-rl] md:text-6xl">
              {p.kana}
            </span>
            {/* Mock "app window" so the panel reads as software */}
            <div className="absolute bottom-6 left-6 right-24 rounded-xl border-2 border-white/15 bg-ink/70 p-3 backdrop-blur transition-transform duration-500 group-hover:-translate-y-2 md:left-10 md:right-40">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-momo" />
                <span className="size-2.5 rounded-full bg-volt" />
                <span className="size-2.5 rounded-full bg-aura" />
              </div>
              <div className="mt-3 space-y-2 font-mono text-[10px] text-white/60 md:text-xs">
                <div><span className={a.text}>const</span> project = &quot;{p.title.toLowerCase().replace(/\s/g, "-")}&quot;;</div>
                <div className="flex gap-2">
                  <span className="h-2 w-1/3 rounded bg-white/15" />
                  <span className={cn("h-2 w-1/5 rounded opacity-70", a.bg)} />
                </div>
                <div className="h-2 w-2/3 rounded bg-white/10" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Copy */}
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-muted">{p.year} · PROJECT 0{i + 1}</span>
            <h3 className="mt-1 font-display text-3xl md:text-4xl">{p.title}</h3>
          </div>
          <div className="flex shrink-0 gap-2">
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noreferrer" aria-label={`${p.title} source code`} data-cursor="Code" className="grid size-11 place-items-center rounded-full border-2 border-white/15 transition-colors hover:border-white hover:bg-white hover:text-ink">
                <GithubIcon className="size-5" />
              </a>
            )}
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" aria-label={`${p.title} live demo`} data-cursor="Live" className={cn("grid size-11 place-items-center rounded-full text-ink transition-transform hover:rotate-45", a.bg)}>
                <ArrowUpRight className="size-5" />
              </a>
            )}
          </div>
        </div>
        <p className="max-w-xl text-foreground/70">{p.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] text-foreground/80">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Projects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = root.current!.querySelector<HTMLElement>(".pj-track")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const skew = gsap.quickTo(".pj-card", "skewX", { duration: 0.4, ease: "power3.out" });
        let settle: gsap.core.Tween | null = null;

        const scroller = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".pj-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -400));
              settle?.kill();
              settle = gsap.delayedCall(0.12, () => skew(0));
              gsap.set(".pj-progress", { scaleX: self.progress });
              const idx = Math.min(projects.length, Math.floor(self.progress * projects.length) + 1);
              const el = root.current?.querySelector(".pj-count");
              if (el) el.textContent = String(idx).padStart(2, "0");
            },
          },
        });

        // UFO scans across while you scroll; its beam flickers.
        gsap.fromTo(
          ".pj-ufo",
          { x: "-10vw" },
          {
            x: "75vw",
            ease: "none",
            scrollTrigger: { trigger: ".pj-pin", start: "top top", end: () => `+=${distance()}`, scrub: 1.5 },
          }
        );
        gsap.to(".pj-ufo .ufo-beam", { opacity: 0.3, duration: 0.15, repeat: -1, yoyo: true, ease: "steps(2)" });
        gsap.to(".pj-ufo-bob", { y: -12, rotate: 4, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut" });

        // Each card pops as it enters the viewport horizontally.
        gsap.utils.toArray<HTMLElement>(".pj-card").forEach((card) => {
          gsap.from(card, {
            rotate: 6,
            yPercent: 12,
            scale: 0.88,
            opacity: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scroller,
              start: "left 95%",
              end: "left 45%",
              scrub: true,
            },
          });
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".pj-card").forEach((card) => {
          gsap.from(card, {
            y: 80,
            rotate: 3,
            opacity: 0,
            duration: 0.9,
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="projects" ref={root} className="relative bg-ink">
      <div className="pj-pin relative overflow-hidden md:h-svh">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,61,139,0.18),transparent_55%)]" />

        {/* UFO scanner */}
        <div className="pj-ufo pointer-events-none absolute left-0 top-6 z-10 hidden w-36 md:block">
          <div className="pj-ufo-bob">
            <Ufo className="w-full" />
          </div>
        </div>

        <div className="pj-track relative flex flex-col gap-10 px-6 py-28 md:h-full md:w-max md:flex-row md:items-center md:gap-10 md:px-[8vw] md:py-0">
          {/* Intro panel */}
          <div className="flex shrink-0 flex-col justify-center md:w-[38vw]">
            <SectionHeading index="03" kana="作品" title="Projects" size="md" />
            <p className="mt-6 max-w-sm text-lg text-foreground/70">
              A few things I&apos;ve designed, built and shipped. Keep scrolling, the panels move sideways.
            </p>
            <div className="mt-10 hidden items-center gap-4 md:flex">
              <span className="font-display text-5xl text-momo">
                <span className="pj-count">01</span>
              </span>
              <span className="font-mono text-sm text-muted">/ {String(projects.length).padStart(2, "0")}</span>
              <div className="h-[3px] w-40 overflow-hidden rounded-full bg-white/10">
                <div className="pj-progress h-full origin-left scale-x-0 bg-gradient-to-r from-momo to-aura" />
              </div>
            </div>
          </div>

          {projects.map((p, i) => (
            <ProjectCard key={p.title} p={p} i={i} />
          ))}

          {/* Outro panel */}
          <div className="flex shrink-0 flex-col items-start justify-center gap-4 md:w-[30vw] md:pr-[4vw]">
            <span className="font-display text-6xl text-volt [paint-order:stroke_fill] [-webkit-text-stroke:6px_var(--ink)] md:text-8xl">
              まだまだ!
            </span>
            <p className="max-w-xs text-foreground/70">More experiments live on my GitHub.</p>
            <a
              href={projects[0]?.repo?.split("/").slice(0, 4).join("/") ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 border-b-2 border-momo pb-1 font-semibold"
            >
              <GithubIcon className="size-5" /> See all repositories
              <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
