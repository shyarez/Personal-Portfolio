"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";
import { LuckyCat } from "@/components/characters/lucky-cat";
import { Magnetic, SectionHeading, Sfx } from "@/components/fx/misc";
import { Button } from "@/components/ui/button";

export function Resume() {
  const root = useRef<HTMLElement>(null);
  const [loadPdf, setLoadPdf] = useState(false);

  // Only load the PDF preview once the section is near the viewport.
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top 150%",
      once: true,
      onEnter: () => setLoadPdf(true),
    });
    return () => st.kill();
  }, []);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      // The document "unrolls" like a scroll as you approach it.
      gsap.fromTo(
        ".rs-doc",
        { clipPath: "inset(0 0 100% 0)", rotate: -8, y: 80 },
        {
          clipPath: "inset(0 0 0% 0)",
          rotate: 2,
          y: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: ".rs-stage", start: "top 85%", end: "center 55%", scrub: 1 },
        }
      );
      gsap.from(".rs-li", {
        x: -30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        scrollTrigger: { trigger: ".rs-list", start: "top 85%", toggleActions: "play none none reverse" },
      });
      gsap.fromTo(
        ".rs-cat",
        { y: 160, rotate: -20 },
        {
          y: 0,
          rotate: 0,
          duration: 0.9,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".rs-actions", start: "top 90%", toggleActions: "play none none reverse" },
        }
      );
      gsap.to(".rs-cat .cat-paw", {
        rotation: -18,
        svgOrigin: "128 116",
        duration: 0.35,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    },
    { scope: root }
  );

  return (
    <section id="resume" ref={root} className="paper-section relative overflow-hidden py-28 md:py-40">
      <div className="halftone pointer-events-none absolute -left-24 top-10 size-96 rounded-full text-aura/40" />
      <Sfx text="パッ!" tone="momo" className="absolute left-[46%] top-[12%] hidden -rotate-12 text-7xl md:block" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 md:px-10">
        <div>
          <SectionHeading index="05" kana="履歴書" title="Resume" dark={false} />
          <p className="mt-6 max-w-md text-lg text-ink/70">
            Everything a recruiter needs on one page. Preview it here or take a copy with you.
          </p>

          <ul className="rs-list mt-10 space-y-3">
            {site.resume.highlights.map((h) => (
              <li key={h} className="rs-li flex items-start gap-3 text-ink/85">
                <span className="mt-1.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-[10px] text-volt">✦</span>
                {h}
              </li>
            ))}
          </ul>

          <div className="rs-actions relative mt-12 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button variant="ink" size="lg" asChild>
                <a href={site.resume.file} download data-cursor="Save">
                  <Download /> Download PDF
                </a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button
                size="lg"
                asChild
                className="border-[3px] border-ink bg-transparent text-ink shadow-none hover:bg-ink hover:text-paper"
              >
                <a href={site.resume.file} target="_blank" rel="noreferrer" data-cursor="Open">
                  <Eye /> Open in new tab
                </a>
              </Button>
            </Magnetic>
            <div className="pointer-events-none absolute -right-2 -top-24 hidden h-32 w-28 overflow-hidden lg:block">
              <div className="rs-cat">
                <LuckyCat className="w-24" />
              </div>
            </div>
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-ink/50">Last updated · {site.resume.updated}</p>
        </div>

        {/* Document preview */}
        <div className="rs-stage relative mx-auto w-full max-w-md">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-sm bg-momo" />
          <div className="rs-doc relative overflow-hidden rounded-sm border-[4px] border-ink bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-2 text-paper">
              <span className="inline-flex items-center gap-2 font-mono text-xs">
                <FileText className="size-4 text-volt" /> resume.pdf
              </span>
              <span className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-momo" />
                <span className="size-2.5 rounded-full bg-volt" />
                <span className="size-2.5 rounded-full bg-aura" />
              </span>
            </div>
            <div className="relative aspect-[1/1.3] bg-white">
              {loadPdf ? (
                <object
                  data={`${site.resume.file}#toolbar=0&navpanes=0&view=FitH`}
                  type="application/pdf"
                  className="absolute inset-0 h-full w-full"
                  aria-label="Resume preview"
                >
                  <ResumeFallback />
                </object>
              ) : (
                <ResumeFallback />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResumeFallback() {
  return (
    <div className="absolute inset-0 space-y-3 p-8">
      <div className="h-6 w-1/2 rounded bg-ink/80" />
      <div className="h-3 w-1/3 rounded bg-momo/60" />
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-2.5 rounded bg-ink/10" style={{ width: `${60 + ((i * 37) % 40)}%` }} />
      ))}
      <a href={site.resume.file} className="absolute bottom-6 left-8 font-mono text-xs text-momo underline">
        Preview not supported here. Open the PDF
      </a>
    </div>
  );
}
