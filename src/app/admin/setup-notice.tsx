export function SetupNotice() {
  return (
    <div className="max-w-lg rounded-3xl border-2 border-white/10 bg-ink-2 p-8">
      <h1 className="font-display text-2xl">Supabase isn&apos;t configured yet</h1>
      <p className="mt-3 text-sm text-foreground/70">
        Add <code className="text-aura">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="text-aura">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, run the SQL in{" "}
        <code>supabase/migrations</code>, and restart the dev server. See the README for the full setup.
      </p>
    </div>
  );
}
