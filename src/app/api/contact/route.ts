import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { contactSchema } from "@/lib/validation/contact";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { sendEnquiryNotification } from "@/lib/email";

export const runtime = "nodejs";

const MIN_FILL_MS = 3_000; // humans take longer than 3s to write a message
const MAX_FORM_AGE_MS = 1000 * 60 * 60 * 24; // 24h
const MAX_BODY_BYTES = 16_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;

// Best-effort, per-instance burst limiter (the DB check below is the durable one).
const memoryHits = new Map<string, number[]>();

function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

const hashIp = (ip: string) =>
  createHash("sha256")
    .update(`${ip}:${process.env.RATE_LIMIT_SALT ?? "change-me"}`)
    .digest("hex");

const fail = (status: number, error: string) => NextResponse.json({ error }, { status });
// Bots get a fake success so they don't learn what tripped the filter.
const fakeOk = () => NextResponse.json({ ok: true }, { status: 201 });

export async function POST(req: NextRequest) {
  // 1) Same-origin only.
  const origin = req.headers.get("origin");
  if (origin) {
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      /* malformed / "null" origin */
    }
    if (originHost !== req.headers.get("host")) return fail(403, "Forbidden");
  }

  // 2) Size + JSON parsing.
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return fail(413, "Message is too large.");
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, "Invalid request.");
  }

  // 3) Honeypot check before validation (bots often fill every field).
  if (typeof body === "object" && body && "company" in body && (body as { company?: unknown }).company) {
    return fakeOk();
  }

  // 4) Schema validation.
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return fail(400, parsed.error.issues[0]?.message ?? "Please check the form and try again.");
  }
  const { name, email, subject, message, startedAt } = parsed.data;

  // 5) Timing trap.
  const elapsed = Date.now() - startedAt;
  if (elapsed < MIN_FILL_MS) return fakeOk();
  if (elapsed > MAX_FORM_AGE_MS) return fail(400, "This form expired. Please refresh the page and try again.");

  // 6) Lightweight content heuristics.
  const links = (message.match(/https?:\/\//gi) ?? []).length;
  if (links > 3) return fail(400, "Please include fewer links in your message.");

  // 7) Rate limiting.
  const ipHash = hashIp(clientIp(req));
  const now = Date.now();
  const recent = (memoryHits.get(ipHash) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return fail(429, "You've sent a few messages already. Please try again in a little while.");
  }
  recent.push(now);
  memoryHits.set(ipHash, recent);

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    console.error("[contact] Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
    return fail(503, `The contact form isn't set up yet. Please email me directly instead.`);
  }

  const since = new Date(now - WINDOW_MS).toISOString();
  const { count, error: countError } = await supabase
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (!countError && (count ?? 0) >= MAX_PER_WINDOW) {
    return fail(429, "You've sent a few messages already. Please try again in a little while.");
  }

  // 8) Store.
  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      name,
      email,
      subject,
      message,
      ip_hash: ipHash,
      user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[contact] insert failed", error);
    return fail(500, "Couldn't send your message right now. Please try again or email me directly.");
  }

  // 9) Notify (failure here doesn't lose the enquiry: it's already stored).
  await sendEnquiryNotification({ id: data.id, name, email, subject, message });

  return NextResponse.json({ ok: true }, { status: 201 });
}
