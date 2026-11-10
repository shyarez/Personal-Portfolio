"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { LoaderCircle, Lock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password is too short"),
});
type Values = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: Values) => {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword(v);
    if (error) {
      setError("Invalid email or password.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-sm space-y-5 rounded-3xl border-2 border-white/10 bg-ink-2 p-8 shadow-[8px_8px_0_0_var(--momo)]"
    >
      <div className="grid size-12 place-items-center rounded-2xl bg-momo">
        <Lock className="size-5" />
      </div>
      <div>
        <h1 className="font-display text-3xl">Admin</h1>
        <p className="mt-1 text-sm text-muted">Sign in to manage portfolio enquiries.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        {errors.email && <p className="text-xs text-momo-soft">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} {...register("password")} />
        {errors.password && <p className="text-xs text-momo-soft">{errors.password.message}</p>}
      </div>
      {error && (
        <p role="alert" className="rounded-xl border border-momo/40 bg-momo/10 px-3 py-2 text-sm text-momo-soft">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="animate-spin" /> : null} Sign in
      </Button>
    </motion.form>
  );
}
