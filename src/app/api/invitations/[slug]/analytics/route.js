import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../../lib/auth";
import { createServiceSupabaseClient } from "../../../../../lib/supabase/server";
import { ok, fail } from "../../../../../lib/api-response";

// Aggregates are computed in WIB (UTC+7) so the Indonesian admin sees local
// dates/hours regardless of where the server runs (Vercel = UTC).
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function wibParts(iso) {
  const shifted = new Date(new Date(iso).getTime() + WIB_OFFSET_MS);
  return {
    dateKey: shifted.toISOString().slice(0, 10), // YYYY-MM-DD in WIB
    hour: shifted.getUTCHours(),
  };
}

export async function GET(request, { params }) {
  const slug = params.slug;
  const { searchParams } = new URL(request.url);
  const days = Math.min(Math.max(Number(searchParams.get("days")) || 30, 7), 90);

  if (!hasServiceEnv()) {
    return fail("Production database is not configured.", {
      status: 503,
      code: "service_unavailable",
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();

  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id, view_count, last_viewed_at")
    .eq("slug", slug)
    .single();

  if (invitationError) {
    return fail(invitationError.message, { status: 404, code: "not_found" });
  }

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: views, error: viewsError }, { data: guests, error: guestsError }] =
    await Promise.all([
      supabase
        .from("invitation_views")
        .select("guest_id, viewed_at")
        .eq("invitation_id", invitation.id)
        .gte("viewed_at", since)
        .order("viewed_at", { ascending: true }),
      supabase
        .from("guests")
        .select("id, name, guest_group, slug, rsvp_status")
        .eq("invitation_id", invitation.id),
    ]);

  if (viewsError) {
    return fail(viewsError.message, { status: 500, code: "database_error" });
  }
  if (guestsError) {
    return fail(guestsError.message, { status: 500, code: "database_error" });
  }

  const viewRows = views || [];
  const guestRows = guests || [];

  // Daily series: one bucket per day across the requested window (zero-filled).
  const dailyMap = new Map();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000 + WIB_OFFSET_MS);
    dailyMap.set(d.toISOString().slice(0, 10), 0);
  }

  const hourly = Array.from({ length: 24 }, () => 0);
  const openedGuestIds = new Set();

  viewRows.forEach((row) => {
    const { dateKey, hour } = wibParts(row.viewed_at);
    if (dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, dailyMap.get(dateKey) + 1);
    }
    hourly[hour] += 1;
    if (row.guest_id) {
      openedGuestIds.add(row.guest_id);
    }
  });

  const daily = Array.from(dailyMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  // Guest open status: which invited guests have opened their personal link.
  const guestOpens = guestRows.map((guest) => ({
    id: guest.id,
    name: guest.name,
    group: guest.guest_group || "-",
    rsvpStatus: guest.rsvp_status || "Belum RSVP",
    opened: openedGuestIds.has(guest.id),
  }));

  const openedCount = guestOpens.filter((g) => g.opened).length;

  // Peak hour across the window.
  const peakHour = hourly.reduce(
    (best, count, hour) => (count > best.count ? { hour, count } : best),
    { hour: 0, count: 0 },
  );

  return ok({
    windowDays: days,
    totalViews: invitation.view_count || 0,
    windowViews: viewRows.length,
    lastViewedAt: invitation.last_viewed_at || null,
    daily,
    hourly,
    peakHour,
    guests: {
      total: guestRows.length,
      opened: openedCount,
      notOpened: guestRows.length - openedCount,
      list: guestOpens,
    },
  });
}
