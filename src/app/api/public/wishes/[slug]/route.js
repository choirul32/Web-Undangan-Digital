import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "../../../../../lib/supabase/server";
import { decodeWishMessage } from "../../../../../templates/utils/wishes";

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
    .select("id, status, order_status, published_at")
    .eq("slug", params.slug)
    .single();

  const hasPublishedHistory =
    Boolean(invitation?.published_at) && invitation?.status !== "archived";
  const isPublicInvitation =
    invitation?.status === "published" ||
    invitation?.order_status === "published" ||
    hasPublishedHistory;

  if (invitationError || !invitation || !isPublicInvitation) {
    return NextResponse.json({ source: "supabase", data: [] });
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("id, guest_name, message, created_at")
    .eq("invitation_id", invitation.id)
    .or("hidden.eq.false,hidden.is.null")
    .not("message", "is", null)
    .neq("message", "")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ source: "supabase", data: [] });
  }

  const wishes = (data || [])
    .map((row) => {
      const decoded = decodeWishMessage(row.message);

      return {
        id: row.id,
        name: row.guest_name || "Tamu",
        message: decoded.message,
        sticker: decoded.sticker,
        createdAt: row.created_at,
      };
    })
    .filter((wish) => wish.message || wish.sticker);

  return NextResponse.json(
    { source: "supabase", data: wishes },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    },
  );
}
