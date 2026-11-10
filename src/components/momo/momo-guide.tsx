"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { chibi, momoScript, type MomoPose } from "@/content/site";
import { Momo } from "@/components/characters/momo";
import { ChibiSprite, framesForProgress } from "@/components/characters/chibi-sprite";
import { PsychicHand } from "@/components/characters/psychic-hand";

const QUIPS = [
  "Hey! That tickles!",
  "Psychic power: ON ✦",
  "Have you checked the projects yet?",
  "Hire them already!",
  "I can lift a whole bus, you know.",
  "Ugh, aliens again?!",
];

type Side = "left" | "right";

/**
 * Momo, the scrolling companion.
 *  - Takes over from the big hero Momo once you scroll past the hero.
 *  - Runs across the screen to the side chosen for each section.
 *  - Changes pose + speech line per section (see `momoScript` in content).
 *  - Leans into your scroll velocity, and reacts when clicked.
 */
export function MomoGuide() {
  const wrap = useRef<HTMLDivElement>(null);
  const mover = useRef<HTMLDivElement>(null);
  const leaner = useRef<HTMLDivElement>(null);
  const facer = useRef<HTMLDivElement>(null);
  const burst = useRef<HTMLDivElement>(null);

  const [pose, setPose] = useState<MomoPose>("wave");
  const [line, setLine] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [side, setSide] = useState<Side>("right");
  const sideRef = useRef<Side>("right");
  const sectionPose = useRef<MomoPose>("wave");
  const lineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moving = useRef<gsap.core.Tween | null>(null);

  // Chibi frames: what's on screen now vs. what the current section wants.
  const [frames, setFrames] = useState<number[]>(chibi.sections.about?.[0]?.frames ?? [1]);
  const sectionFrames = useRef<number[]>(frames);
  const sectionStep = useRef(-1);
  const reacting = useRef(false);
  const clicks = useRef<number[]>([]);
  const showSectionFrames = useCallback(() => {
    if (!moving.current?.isActive() && !reacting.current) setFrames(sectionFrames.current);
  }, []);

  const say = useCallback((text: string, ms = 3800) => {
    setLine(text);
    if (lineTimer.current) clearTimeout(lineTimer.current);
    lineTimer.current = setTimeout(() => setLine(null), ms);
  }, []);

  const targetX = (s: Side) => {
    const w = mover.current?.offsetWidth ?? 160;
    const pad = window.innerWidth < 768 ? 8 : 28;
    return s === "left" ? pad : window.innerWidth - w - pad;
  };

  const face = (dir: "left" | "right", instant = false) => {
    gsap.to(facer.current, { scaleX: dir === "left" ? -1 : 1, duration: instant ? 0 : 0.25, ease: "power2.out" });
  };

  const travelTo = useCallback(
    (s: Side, finalPose: MomoPose) => {
      sectionPose.current = finalPose;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Face toward page content when standing on a side.
      const faceContent = () => face(s === "right" ? "left" : "right");

      if (s === sideRef.current) {
        setPose(finalPose);
        faceContent();
        return;
      }
      sideRef.current = s;
      setSide(s);
      if (reduce) {
        gsap.set(mover.current, { x: targetX(s) });
        setPose(finalPose);
        faceContent();
        return;
      }
      moving.current?.kill();
      setPose("run");
      setFrames(chibi.travel);
      face(s);
      moving.current = gsap.to(mover.current, {
        x: targetX(s),
        duration: 1.15,
        ease: "power2.inOut",
        onUpdate() {
          // little hop while running
          const p = this.progress();
          gsap.set(leaner.current, { y: -Math.abs(Math.sin(p * Math.PI * 4)) * 14 });
        },
        onComplete: () => {
          gsap.to(leaner.current, { y: 0, duration: 0.3, ease: "bounce.out" });
          setPose(finalPose);
          if (!reacting.current) setFrames(sectionFrames.current);
          faceContent();
        },
      });
    },
    []
  );

  /** Resolve the chibi frames for a section at a scroll progress (works both directions). */
  const updateSectionFrames = useCallback(
    (id: string, progress: number, entering: boolean) => {
      const res = framesForProgress(id, progress, entering ? -1 : sectionStep.current);
      if (!res) return;
      if (!entering && res.step === sectionStep.current) return;
      sectionStep.current = res.step;
      sectionFrames.current = res.frames;
      showSectionFrames();
    },
    [showSectionFrames]
  );

  // Section choreography.
  useEffect(() => {
    gsap.set(mover.current, { x: targetX("right") });
    face("left", true);

    const triggers: ScrollTrigger[] = [];
    Object.entries(momoScript).forEach(([id, cfg]) => {
      if (id === "hero") return;
      const el = document.getElementById(id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (!self.isActive) return;
            // Set the section's frames first so the arrival pose is right when she stops running.
            updateSectionFrames(id, self.progress, true);
            travelTo(cfg.side, cfg.pose);
            say(cfg.line);
          },
          onUpdate: (self) => {
            if (self.isActive) updateSectionFrames(id, self.progress, false);
          },
        })
      );
    });

    // Appear after the hero hands off.
    const about = document.getElementById("about");
    if (about) {
      triggers.push(
        ScrollTrigger.create({
          trigger: about,
          start: "top 75%",
          onEnter: () => setVisible(true),
          onLeaveBack: () => setVisible(false),
        })
      );
    }

    // Lean with scroll velocity.
    const lean = gsap.quickTo(leaner.current, "rotation", { duration: 0.5, ease: "power3.out" });
    const skew = gsap.quickTo(leaner.current, "skewX", { duration: 0.5, ease: "power3.out" });
    let settle: gsap.core.Tween | null = null;
    const vel = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-14, 14, self.getVelocity() / 180);
        lean(v * 0.6);
        skew(-v * 0.5);
        settle?.kill();
        settle = gsap.delayedCall(0.15, () => {
          lean(0);
          skew(0);
        });
      },
    });
    triggers.push(vel);

    const onResize = () => {
      if (!moving.current?.isActive()) gsap.set(mover.current, { x: targetX(sideRef.current) });
    };
    window.addEventListener("resize", onResize);
    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("resize", onResize);
      if (lineTimer.current) clearTimeout(lineTimer.current);
    };
  }, [travelTo, say, updateSectionFrames]);

  // Pop in / out.
  useEffect(() => {
    if (!wrap.current) return;
    gsap.to(wrap.current, {
      autoAlpha: visible ? 1 : 0,
      y: visible ? 0 : 120,
      scale: visible ? 1 : 0.6,
      duration: visible ? 0.7 : 0.4,
      ease: visible ? "back.out(1.8)" : "power2.in",
    });
    if (visible) say(momoScript.about.line);
  }, [visible, say]);

  const onClick = () => {
    // Surprised when poked; pouts if you keep poking (3 clicks within 2s).
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 2000), now];
    const pouting = clicks.current.length >= 3;
    reacting.current = true;
    setFrames(pouting ? chibi.pout : chibi.click);
    say(pouting ? "Hey! Stop poking me!" : QUIPS[Math.floor(Math.random() * QUIPS.length)], 2600);
    setPose("psychic");
    if (burst.current) {
      gsap.fromTo(
        burst.current.children,
        { scale: 0.2, opacity: 1 },
        { scale: 2.6, opacity: 0, duration: 0.9, stagger: 0.12, ease: "expo.out" }
      );
    }
    gsap.fromTo(leaner.current, { y: 0 }, { y: -40, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" });
    if (reactTimer.current) clearTimeout(reactTimer.current);
    reactTimer.current = setTimeout(() => {
      reacting.current = false;
      setPose(sectionPose.current);
      showSectionFrames();
    }, pouting ? 2000 : 1300);
  };
  const reactTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <div
      ref={wrap}
      className="pointer-events-none invisible fixed bottom-0 left-0 z-50 w-full opacity-0"
      aria-hidden
    >
      <div ref={mover} className="relative w-24 md:w-40 lg:w-44">
        {/* Speech bubble */}
        <AnimatePresence>
          {line && (
            <motion.div
              key={line}
              initial={{ opacity: 0, y: 10, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className={`absolute bottom-full mb-1 w-44 rounded-2xl border-[3px] border-ink bg-paper px-3 py-2 text-[11px] font-semibold leading-snug text-ink shadow-[4px_4px_0_0_var(--momo)] md:w-56 md:text-sm ${
                side === "right" ? "right-2 origin-bottom-right" : "left-2 origin-bottom-left"
              }`}
            >
              {line}
              <span
                className={`absolute -bottom-[11px] size-4 rotate-45 border-b-[3px] border-r-[3px] border-ink bg-paper ${
                  side === "right" ? "right-10" : "left-10"
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={leaner} className="origin-bottom">
          <div ref={burst} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="absolute size-24 rounded-full border-4 border-momo opacity-0" />
            <span className="absolute size-24 rounded-full border-4 border-aura opacity-0" />
          </div>
          {pose === "psychic" && (
            <div className="pointer-events-none absolute -top-10 left-1/2 w-20 -translate-x-1/2 animate-float md:w-28">
              <PsychicHand id="guide" tone="aura" className="w-full -rotate-12" />
            </div>
          )}
          <div ref={facer} className="relative">
            <button
              type="button"
              onClick={onClick}
              data-cursor="Boop!"
              tabIndex={-1}
              className="pointer-events-auto block w-full"
            >
              {chibi.enabled ? (
                <ChibiSprite sequence={frames} className="w-full drop-shadow-[0_10px_30px_rgba(255,61,139,0.35)]" />
              ) : (
                <Momo pose={pose} className="h-auto w-full drop-shadow-[0_10px_30px_rgba(255,61,139,0.35)]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
