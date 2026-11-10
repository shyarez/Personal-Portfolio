"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { LoaderCircle, Send, RefreshCw } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";
import { gsap } from "@/lib/gsap";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Momo } from "@/components/characters/momo";
import { ChibiSprite } from "@/components/characters/chibi-sprite";
import { chibi } from "@/content/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const confetti = useRef<HTMLDivElement>(null);
  const [startedAt] = useState(() => Date.now());

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", company: "", startedAt },
    mode: "onTouched",
  });

  const messageLen = watch("message")?.length ?? 0;

  const burst = () => {
    const host = confetti.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#ff3d8b", "#3ff2e3", "#e9ff3b", "#7a5cff", "#f6efe4"];
    for (let i = 0; i < 46; i++) {
      const s = document.createElement("span");
      const size = gsap.utils.random(6, 14);
      Object.assign(s.style, {
        position: "absolute",
        left: "50%",
        top: "45%",
        width: `${size}px`,
        height: `${size * gsap.utils.random(0.4, 1)}px`,
        background: colors[i % colors.length],
        borderRadius: i % 3 ? "2px" : "999px",
      });
      host.appendChild(s);
      gsap.to(s, {
        x: gsap.utils.random(-320, 320),
        y: gsap.utils.random(-300, 160),
        rotate: gsap.utils.random(-540, 540),
        opacity: 0,
        duration: gsap.utils.random(1, 1.8),
        ease: "power3.out",
        onComplete: () => s.remove(),
      });
    }
  };

  const onSubmit = async (data: ContactInput) => {
    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
      setStatus("sent");
      reset({ name: "", email: "", subject: "", message: "", company: "", startedAt });
      requestAnimationFrame(burst);
    } catch (e) {
      setStatus("error");
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  const field = "space-y-2";
  const err = (m?: string) =>
    m ? (
      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-momo-soft" role="alert">
        {m}
      </motion.p>
    ) : null;

  return (
    <div className="relative">
      <div ref={confetti} className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden />

      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border-2 border-aura/40 bg-ink-2 p-8 text-center"
            role="status"
          >
            {chibi.enabled ? (
              <ChibiSprite sequence={chibi.success} className="h-56 w-56" />
            ) : (
              <Momo pose="cheer" className="h-56 w-auto" />
            )}
            <h3 className="mt-4 font-display text-3xl">Message received!</h3>
            <p className="mt-2 max-w-sm text-foreground/70">Thanks for reaching out! I&apos;ll get back to you soon.</p>
            <Button variant="outline" className="mt-8" onClick={() => setStatus("idle")}>
              <RefreshCw /> Send another
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5 rounded-3xl border-2 border-white/10 bg-ink-2/80 p-6 backdrop-blur md:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className={field}>
                <Label htmlFor="name">Name</Label>
                <Input id="name" autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} {...register("name")} />
                {err(errors.name?.message)}
              </div>
              <div className={field}>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" aria-invalid={!!errors.email} {...register("email")} />
                {err(errors.email?.message)}
              </div>
            </div>
            <div className={field}>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Internship opportunity" aria-invalid={!!errors.subject} {...register("subject")} />
              {err(errors.subject?.message)}
            </div>
            <div className={field}>
              <div className="flex items-center justify-between">
                <Label htmlFor="message">Message</Label>
                <span className={cn("font-mono text-[10px]", messageLen > 5000 ? "text-momo" : "text-muted/60")}>
                  {messageLen}/5000
                </span>
              </div>
              <Textarea id="message" placeholder="Tell me about the role, team or idea…" aria-invalid={!!errors.message} {...register("message")} />
              {err(errors.message?.message)}
            </div>

            {/* Honeypot: hidden from humans and assistive tech */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
              <label htmlFor="company">Company</label>
              <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
            </div>
            <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />

            <AnimatePresence>
              {status === "error" && serverError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-momo/40 bg-momo/10 px-4 py-3 text-sm text-momo-soft"
                  role="alert"
                >
                  {serverError}
                </motion.p>
              )}
            </AnimatePresence>

            <Button type="submit" size="lg" className="w-full" disabled={status === "sending"} data-cursor="Send!">
              <AnimatePresence mode="wait" initial={false}>
                {status === "sending" ? (
                  <motion.span key="s" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="inline-flex items-center gap-2">
                    <LoaderCircle className="animate-spin" /> Sending…
                  </motion.span>
                ) : (
                  <motion.span key="i" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="inline-flex items-center gap-2">
                    <Send /> Send message
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted/60">
              Your details are only used to reply to you.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
