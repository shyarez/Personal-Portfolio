import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { statusSchema } from "@/lib/validation/contact";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const idSchema = z.string().uuid();

/** Update an enquiry's status. Runs as the signed-in user, so RLS enforces admin-only access. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const parsed = statusSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("enquiries")
    .update({ status: parsed.data.status })
    .eq("id", id)
    .select("id, status, updated_at")
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  // RLS hides rows from non-admins, so "no row" means not found OR not allowed.
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ enquiry: data });
}
