import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "../../../../../lib/supabase/server";

// Wishes come from live RSVP submissions — never cache this response.
export const dynamic = "force-dynamic";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

// Public guestbook: returns visible (non-hidden) RSVP messages for a published
// invitation. Read via service role so moderation (hidden flag) is enforced
// server-side regardless of RLS.
export async function GET(_request, { params }) {
  if (!hasServiceEnv()) {
    return NextResponse.json({ source: "none", data: [] });
  }

  const supabase = createServiceSupabaseClient();

  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id, status")
    .eq("slug", params.slug)
    .single();

  if (invitationError || !invitation || invitation.status !== "published") {
    return NextResponse.json({ source: "supabase", data: [] });
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("id, guest_name, message, created_at")
    .eq("invitation_id", invitation.id)
    .eq("hidden", false)
    .not("message", "is", null)
    .neq("message", "")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ source: "supabase", data: [] });
  }

  const wishes = (data || []).map((row) => ({
    id: row.id,
    name: row.guest_name || "Tamu",
    message: row.message,
    createdAt: row.created_at,
  }));

  return NextResponse.json({ source: "supabase", data: wishes });
}
