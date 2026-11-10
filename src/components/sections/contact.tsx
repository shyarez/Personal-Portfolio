"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Check, Copy } from "lucide-react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";
import { ContactForm } from "@/components/contact/contact-form";
import { SocialIcon } from "@/components/brand-icons";
import { Magnetic, Sfx } from "@/components/fx/misc";
import { useScrollTo } from "@/components/providers/smooth-scroll";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const split = SplitText.create(".ct-title", { type: "words,chars", mask: "chars" });
      gsap.from(split.chars, {
        yPercent: 120,
        rotate: 15,
        stagger: 0.03,
        duration: 0.9,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: ".ct-title", start: "top 85%", toggleActions: "play none none reverse" },
      });
      // Section opens like a portal: circular reveal scrubbed on entry.
      gsap.fromTo(
        ".ct-portal",
        { clipPath: "circle(8% at 50% 0%)" },
        {
          clipPath: "circle(150% at 50% 0%)",
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 15%", scrub: 1 },
        }
      );
      gsap.from(".ct-social", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        scrollTrigger: { trigger: ".ct-socials", start: "top 90%" },
      });
      gsap.to(".ct-ring", { rotate: 360, duration: 30, ease: "none", repeat: -1 });
      return () => split.revert();
    },
    { scope: root }
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section id="contact" ref={root} className="relative bg-ink">
      <div className="ct-portal relative overflow-hidden bg-[radial-gradient(ellipse_at_top,#2a1240,var(--ink)_60%)] pb-10 pt-32 md:pt-44">
        <div className="speedlines pointer-events-none absolute left-1/2 top-0 size-[160vmax] -translate-x-1/2 -translate-y-1/2 opacity-60" />
        <div className="ct-ring pointer-events-none absolute -right-40 top-20 size-[520px] rounded-full border-2 border-dashed border-momo/25" />
        <Sfx text="ドキドキ" tone="volt" className="absolute left-[4%] top-24 hidden -rotate-12 text-6xl md:block lg:text-7xl" />

        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            <span className="text-momo">CH.06</span> · 連絡
          </p>
          <h2 className="ct-title split-safe mt-4 font-display text-[15vw] leading-[0.85] md:text-[9vw]">
            Let&apos;s <span className="text-momo">talk.</span>
          </h2>

          <div className="mt-16 grid gap-14 md:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-10">
              <p className="max-w-md text-lg text-foreground/75">
                Recruiting for an internship, have a project in mind, or just want to geek out about anime and
                interfaces? My inbox is open.
              </p>

              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Email</span>
                <button
                  onClick={copy}
                  data-cursor={copied ? "Copied" : "Copy"}
                  className="group mt-2 flex items-center gap-3 text-left font-display text-2xl transition-colors hover:text-aura md:text-3xl"
                >
                  <span className="break-all">{site.email}</span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20">
                    <AnimatePresence mode="wait" initial={false}>
                      {copied ? (
                        <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="size-4 text-aura" />
                        </motion.span>
                      ) : (
                        <motion.span key="p" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Copy className="size-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </div>

              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Elsewhere</span>
                <ul className="ct-socials mt-4 flex flex-wrap gap-3">
                  {site.socials.map((s) => (
                    <li key={s.label} className="ct-social">
                      <Magnetic strength={0.5}>
                        <a
                          href={s.href}
                          target={s.href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          aria-label={s.label}
                          className="grid size-14 place-items-center rounded-2xl border-2 border-white/10 bg-white/5 transition-all duration-300 hover:-rotate-6 hover:border-momo hover:bg-momo hover:text-white"
                        >
                          <SocialIcon name={s.icon} className="size-5" />
                        </a>
                      </Magnetic>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted md:flex-row md:px-10">
          <p>
            © {new Date().getFullYear()} {site.name}. Designed & built with Next.js, GSAP and a lot of psychic energy.
          </p>
          <p className="text-xs text-muted/60">Fan-inspired design. Characters belong to their respective creators.</p>
          <button
            onClick={() => scrollTo("#hero")}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 transition-colors hover:border-momo hover:text-momo"
          >
            Back to top <ArrowUp className="size-4" />
          </button>
        </div>
      </footer>
    </section>
  );
}
