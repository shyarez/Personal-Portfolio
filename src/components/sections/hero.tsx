"use client";

import { useRef } from "react";
import { ArrowDown, Download } from "lucide-react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { characterArt, chibi, site } from "@/content/site";
import { Momo } from "@/components/characters/momo";
import { ChibiSprite } from "@/components/characters/chibi-sprite";
import { PsychicHand } from "@/components/characters/psychic-hand";
import { Ufo } from "@/components/characters/ufo";
import { ImageSequence } from "@/components/characters/image-sequence";
import { onPreloaderDone } from "@/components/fx/preloader";
import { Magnetic } from "@/components/fx/misc";
import { Button } from "@/components/ui/button";
import { useScrollTo } from "@/components/providers/smooth-scroll";

const BURST =
  "50% 0%, 58% 30%, 85% 12%, 70% 40%, 100% 45%, 72% 58%, 92% 85%, 62% 70%, 55% 100%, 45% 72%, 18% 92%, 30% 62%, 0% 55%, 28% 42%, 10% 15%, 40% 30%";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();
  const seq = characterArt.momo.heroSequence;

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const split = SplitText.create(".hero-name", { type: "words,chars", mask: "chars" });

      // ---------- Intro (after preloader) ----------
      const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      intro
        .from(".hero-burst-wrap", { scale: 0, rotate: -90, duration: 1.1, ease: "back.out(1.6)" })
        .from(".hero-ring", { scale: 0.3, opacity: 0, duration: 1.2, stagger: 0.1 }, "<")
        .from(".hero-momo", { yPercent: 60, opacity: 0, scale: 0.7, duration: 1.1, ease: "back.out(1.5)" }, "<0.1")
        .from(".hero-hand-l", { x: -300, y: 120, rotate: -60, opacity: 0, duration: 1.2 }, "<0.2")
        .from(".hero-hand-r", { x: 300, y: 120, rotate: 60, opacity: 0, duration: 1.2 }, "<")
        .from(split.chars, { yPercent: 120, rotate: 12, stagger: 0.035, duration: 0.9, ease: "back.out(1.7)" }, 0.25)
        .from(".hero-fade", { y: 30, opacity: 0, stagger: 0.08, duration: 0.8 }, "<0.3")
        .from(".hero-role-bg", { scaleX: 0, transformOrigin: "left", duration: 0.8 }, "<0.1")
        .from(".hero-ufo", { x: "-60vw", y: -200, rotate: -30, duration: 1.6, ease: "power3.out" }, 0.3);

      const off = onPreloaderDone(() => intro.play());

      if (reduce) {
        intro.progress(1);
        return () => {
          off();
          split.revert();
        };
      }

      // ---------- Idle loops ----------
      gsap.to(".hero-ring-1", { rotate: 360, duration: 40, ease: "none", repeat: -1 });
      gsap.to(".hero-ring-2", { rotate: -360, duration: 60, ease: "none", repeat: -1 });
      gsap.to(".hero-burst", { rotate: "+=8", duration: 0.12, repeat: -1, yoyo: true, ease: "steps(1)" });
      // (Tailwind's rotate-* uses the CSS `rotate` property, so these compose on top of it.)
      gsap.to(".hero-hand-float-l", { y: -18, rotation: -5, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".hero-hand-float-r", { y: -22, rotation: 5, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".hero-ufo-inner", { y: -14, duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".hero-ufo .ufo-light", { opacity: 0.2, duration: 0.4, stagger: { each: 0.1, repeat: -1, yoyo: true } });
      gsap.utils.toArray<HTMLElement>(".hero-spirit").forEach((s) => {
        gsap.to(s, {
          y: gsap.utils.random(-80, -200),
          x: gsap.utils.random(-40, 40),
          opacity: 0,
          duration: gsap.utils.random(4, 9),
          repeat: -1,
          delay: gsap.utils.random(0, 5),
          ease: "sine.out",
        });
      });

      // ---------- Pointer parallax ----------
      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" }),
        d: Number(el.dataset.depth),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * l.d * 60);
          l.y(ny * l.d * 40);
        });
      };
      window.addEventListener("pointermove", onMove);

      // ---------- Scroll: pinned handoff ----------
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=110%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        // Explicit, immediately-rendered "from" (fully visible) values. Otherwise the scrubbed
        // timeline restores the intro's hidden pre-animation state when scrolled back to the top.
        // (The intro still plays: its from-tweens re-hide and reveal everything when it starts.)
        const shown = { immediateRender: true };
        tl.fromTo(
          split.chars,
          { yPercent: 0, rotate: 0, opacity: 1 },
          {
            ...shown,
            yPercent: () => gsap.utils.random(-260, -120),
            rotate: () => gsap.utils.random(-45, 45),
            opacity: 0,
            stagger: { each: 0.015, from: "random" },
            ease: "power2.in",
          }
        )
          .fromTo(".hero-copy .hero-fade", { y: 0, opacity: 1 }, { ...shown, y: -60, opacity: 0, stagger: 0.04 }, 0)
          .fromTo(".hero-hand-l", { x: 0, y: 0, rotate: 0, scale: 1 }, { ...shown, x: 180, y: -40, rotate: 25, scale: 1.3 }, 0)
          .fromTo(".hero-hand-r", { x: 0, y: 0, rotate: 0, scale: 1 }, { ...shown, x: -180, y: -60, rotate: -25, scale: 1.3 }, 0)
          .to(".hero-hands", { opacity: 0, duration: 0.3 }, 0.55)
          .to(".hero-momo-wrap", { xPercent: 55, yPercent: 40, scale: 0.35, ease: "power2.inOut" }, 0.15)
          .to(".hero-momo-wrap", { opacity: 0, duration: 0.2 }, 0.8)
          .to(".hero-burst", { scale: 2.4, opacity: 0, ease: "power1.in" }, 0)
          .to(".hero-speed", { scale: 1.6, opacity: 1 }, 0)
          .to(".hero-kana", { xPercent: -30 }, 0)
          .fromTo(".hero-ufo", { x: 0, y: 0, rotate: 0 }, { ...shown, x: "40vw", y: -220, rotate: 15 }, 0)
          .fromTo(
            ".hero-wipe",
            { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
            { clipPath: "polygon(0 18%, 100% 0%, 100% 100%, 0 100%)", ease: "power2.in" },
            0.55
          );
      });
      mm.add("(max-width: 767px)", () => {
        gsap.to(".hero-momo-wrap", {
          yPercent: 25,
          scale: 0.85,
          opacity: 0.4,
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      return () => {
        off();
        window.removeEventListener("pointermove", onMove);
        mm.revert();
        split.revert();
      };
    },
    { scope: root }
  );

  return (
    <section
      id="hero"
      ref={root}
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-ink pb-8 pt-20 md:pb-12 md:pt-28"
    >
      {/* ---------- Background ---------- */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[60%] top-[45%] size-[80vmax] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,61,139,0.35),transparent_60%)]" />
        <div className="absolute left-[15%] top-[80%] size-[60vmax] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(122,92,255,0.28),transparent_60%)]" />
        <div className="hero-speed speedlines absolute left-[62%] top-1/2 size-[180vmax] -translate-1/2 opacity-50" />
        <div className="halftone-fade absolute right-0 top-0 h-[60%] w-[45%] text-momo/25" />
        <div
          data-depth="0.3"
          className="hero-kana pointer-events-none absolute -bottom-6 left-0 whitespace-nowrap font-display text-[26vw] leading-none text-outline text-white/[0.06]"
          aria-hidden
        >
          ソフトウェア開発者
        </div>
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="hero-spirit absolute size-1.5 rounded-full bg-aura shadow-[0_0_12px_4px_rgba(63,242,227,0.6)]"
            style={{ left: `${(i * 53) % 100}%`, top: `${40 + ((i * 31) % 60)}%` }}
          />
        ))}
      </div>

      {/* UFO */}
      <div className="absolute left-[4%] top-[12%] z-0 w-24 md:left-[50%] md:top-[14%] md:w-32" data-depth="0.8">
        <div className="hero-ufo">
          <div className="hero-ufo-inner">
            <Ufo className="w-full" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 md:static items-center gap-4 px-6 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:px-10 lg:gap-16">
        {/* ---------- Copy ---------- */}
        <div className="hero-copy relative z-10 order-2 min-w-0 md:order-1">

          <p className="hero-fade mb-3 flex items-center gap-3 font-display text-base text-momo md:text-lg">
            <span className="h-px w-10 bg-momo/60" aria-hidden />
            {site.nameJp}
          </p>
          <h1 className="hero-name split-safe font-display text-[12vw] leading-[0.88] tracking-tight md:text-[min(6.2vw,12.5svh)] xl:text-[min(6.25rem,12.5svh)]">
            {site.name}
          </h1>

          <div className="hero-fade relative mt-5 inline-block md:mt-[min(1.75rem,3svh)]">
            <span className="hero-role-bg absolute inset-0 -skew-x-12 bg-volt" />
            <span className="relative block px-4 py-1 font-display text-xl text-ink md:text-2xl lg:text-3xl">{site.role}</span>
          </div>

          <p className="hero-fade mt-5 max-w-md text-base leading-relaxed text-foreground/75 md:mt-[min(1.5rem,3svh)] md:text-lg">{site.tagline}</p>

          <div className="hero-fade mt-7 flex flex-wrap items-center gap-4 pb-2 pr-2 md:mt-[min(2.25rem,4.5svh)]">
            <Magnetic>
              <Button size="lg" onClick={() => scrollTo("#projects")} data-cursor="Go!">
                See my work
              </Button>
            </Magnetic>
            <Magnetic>
              <Button size="lg" variant="outline" asChild>
                <a href={site.resume.file} download>
                  <Download /> Resume
                </a>
              </Button>
            </Magnetic>
          </div>
        </div>

        {/* ---------- Momo stage ---------- */}
        <div className="relative order-1 mx-auto aspect-[4/5] w-[min(62vw,32svh)] md:absolute md:bottom-0 md:right-[3%] md:order-none md:mx-0 md:h-[min(84svh,720px)] md:w-auto">
          <div data-depth="0.4" className="absolute inset-0 flex items-center justify-center">
            <div className="hero-burst-wrap absolute inset-0 flex items-center justify-center">
              <div className="hero-burst relative flex size-[95%] items-center justify-center">
                <div className="absolute inset-0 bg-momo" style={{ clipPath: `polygon(${BURST})` }} />
                <div className="absolute inset-[5%] bg-ink" style={{ clipPath: `polygon(${BURST})` }} />
              </div>
            </div>
            <div className="hero-ring hero-ring-1 absolute size-[92%] rounded-full border-2 border-dashed border-aura/40" />
            <div className="hero-ring hero-ring-2 absolute size-[70%] rounded-full border border-volt/30" />
            <span className="absolute right-[6%] top-[10%] rotate-12 font-display text-4xl text-volt [paint-order:stroke_fill] [-webkit-text-stroke:6px_var(--ink)] md:text-6xl">
              ドン!
            </span>
          </div>

          <div className="hero-hands pointer-events-none absolute inset-0">
            <div className="absolute -left-[12%] bottom-[8%] w-[34%]" data-depth="1.2">
              <div className="hero-hand-l">
                <div className="hero-hand-float-l -rotate-[28deg]">
                  <PsychicHand id="hl" tone="aura" className="w-full" />
                </div>
              </div>
            </div>
            <div className="absolute -right-[10%] bottom-[16%] w-[30%]" data-depth="1.4">
              <div className="hero-hand-r">
                <div className="hero-hand-float-r rotate-[24deg]">
                  <PsychicHand id="hr" tone="momo" className="w-full -scale-x-100" />
                </div>
              </div>
            </div>
          </div>

          <div className="hero-momo-wrap absolute inset-x-[10%] bottom-[2%] top-[4%] md:-bottom-[4%]" data-depth="0.35">
            <div className="hero-momo h-full w-full">
              {seq ? (
                <ImageSequence
                  frames={seq.frames}
                  path={seq.path}
                  trigger={root}
                  end="+=110%"
                  className="h-full w-full"
                />
              ) : chibi.enabled ? (
                // Bust-up chibi: on desktop her cut-off edge rests on the bottom of the screen; on mobile it fades.
                <ChibiSprite
                  sequence={chibi.sections.hero?.[0]?.frames ?? [2, 3]}
                  className="h-full w-full drop-shadow-[0_20px_60px_rgba(255,61,139,0.45)] [mask-image:linear-gradient(to_bottom,black_82%,transparent)] md:[mask-image:none]"
                />
              ) : (
                <Momo pose="wave" className="h-full w-full drop-shadow-[0_20px_60px_rgba(255,61,139,0.45)]" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={() => scrollTo("#about")}
        className="hero-fade absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted md:flex [@media(max-height:760px)]:!hidden"
      >
        Scroll
        <span className="grid size-10 place-items-center rounded-full border border-white/20">
          <ArrowDown className="size-4 animate-bounce" />
        </span>
      </button>

      {/* Paper wipe into the About "manga page" */}
      <div className="hero-wipe paper-section pointer-events-none absolute inset-0 z-30 [clip-path:polygon(0_100%,100%_100%,100%_100%,0_100%)]" />
    </section>
  );
}
