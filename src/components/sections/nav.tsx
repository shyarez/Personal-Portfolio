"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { useScrollTo } from "@/components/providers/smooth-scroll";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { id: "about", label: "About", kana: "自己" },
  { id: "skills", label: "Skills", kana: "技" },
  { id: "projects", label: "Projects", kana: "作品" },
  { id: "experience", label: "Experience", kana: "経歴" },
  { id: "resume", label: "Resume", kana: "履歴" },
  { id: "contact", label: "Contact", kana: "連絡" },
];

export function Nav() {
  const scrollTo = useScrollTo();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400 && !open);
    setScrolled(y > 40);
  });

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollTo(`#${id}`), open ? 350 : 0);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed inset-x-0 top-0 z-[65] px-4 pt-4 md:px-8"
      >
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 md:px-4",
            scrolled ? "border-white/10 bg-ink/70 shadow-2xl shadow-black/40 backdrop-blur-xl" : "border-transparent"
          )}
          aria-label="Primary"
        >
          <button onClick={() => go("hero")} className="group flex items-center gap-2" aria-label="Back to top">
            <span className="relative grid size-10 place-items-center rounded-full bg-momo font-display text-sm text-white transition-transform duration-500 group-hover:rotate-[360deg]">
              {site.shortName}
              <span className="absolute inset-0 rounded-full border-2 border-dashed border-volt/70 animate-spin-slow" />
            </span>
            <span className="hidden font-display text-sm sm:block">{site.name}</span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {/* Contact is covered by the "Let's talk" button on desktop. */}
            {LINKS.filter((l) => l.id !== "contact").map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="group relative overflow-hidden rounded-full px-4 py-2 text-sm text-foreground/80 transition-colors hover:text-white"
                >
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">{l.label}</span>
                  <span className="absolute inset-x-0 top-full block py-2 text-center font-display text-momo transition-transform duration-300 group-hover:-translate-y-full">
                    {l.kana}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => go("contact")} className="hidden sm:inline-flex">
              Let&apos;s talk
            </Button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[64] flex flex-col justify-center bg-ink px-8 lg:hidden"
          >
            <div className="halftone pointer-events-none absolute inset-0 text-momo/10" />
            <ul className="relative space-y-2">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 260, damping: 22 }}
                >
                  <button onClick={() => go(l.id)} className="flex items-baseline gap-4 font-display text-5xl">
                    <span className="font-mono text-xs text-momo">0{i + 1}</span>
                    {l.label}
                    <span className="text-lg text-muted">{l.kana}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
