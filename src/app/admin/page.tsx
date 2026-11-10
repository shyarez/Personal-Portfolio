import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Dashboard, type Enquiry } from "./dashboard";
import { SetupNotice } from "./setup-notice";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="flex min-h-svh items-center justify-center px-6">
        <SetupNotice />
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminRow } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();

  const signOut = (
    <form action="/api/auth/signout" method="post">
      <button className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-muted transition-colors hover:border-momo hover:text-momo">
        <LogOut className="size-4" /> Sign out
      </button>
    </form>
  );

  if (!adminRow) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-display text-3xl">Not authorised</h1>
        <p className="max-w-md text-sm text-muted">
          You&apos;re signed in as {user.email}, but this account isn&apos;t in the <code>admins</code> table.
        </p>
        {signOut}
      </main>
    );
  }

  const { data, error } = await supabase
    .from("enquiries")
    .select("id, name, email, subject, message, status, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-momo">Private · CRM</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Enquiries</h1>
          <p className="mt-1 text-sm text-muted">Signed in as {user.email}</p>
        </div>
        {signOut}
      </header>
      {error ? (
        <p className="rounded-xl border border-momo/40 bg-momo/10 p-4 text-sm">Couldn&apos;t load enquiries: {error.message}</p>
      ) : (
        <Dashboard initial={(data ?? []) as Enquiry[]} />
      )}
    </main>
  );
}
