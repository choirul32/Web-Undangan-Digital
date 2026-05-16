import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../lib/auth";
import { sampleInvitation } from "../../../../data/sampleInvitation";
import { createServiceSupabaseClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

async function countRows(supabase, table, filters = []) {
  let query = supabase.from(table).select("id", { count: "exact", head: true });

  filters.forEach(([column, value, operator = "eq"]) => {
    query = query[operator](column, value);
  });

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count || 0;
}

export async function GET() {
  if (!hasServiceEnv()) {
    const published = sampleInvitation.status === "published" ? 1 : 0;
    const revision = sampleInvitation.status === "revision" ? 1 : 0;
    const totalPax = sampleInvitation.rsvps.reduce(
      (total, item) => total + Number(item.pax || 0),
      0,
    );

    return NextResponse.json({
      source: "sample",
      data: {
        invitations: 1,
        inquiry: 0,
        waitingPayment: 0,
        inProgress: 0,
        review: 0,
        activeThisMonth: published,
        rsvps: sampleInvitation.rsvps.length,
        rsvpPax: totalPax,
        published,
        revision,
        guests: sampleInvitation.guests.length,
      },
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  try {
    const [
      invitations,
      activeThisMonth,
      rsvps,
      published,
      revision,
      guests,
      inquiry,
      waitingPayment,
      inProgress,
      review,
      paxResult,
    ] = await Promise.all([
      countRows(supabase, "invitations"),
      countRows(supabase, "invitations", [
        ["created_at", startOfMonth.toISOString(), "gte"],
      ]),
      countRows(supabase, "rsvps"),
      countRows(supabase, "invitations", [["status", "published"]]),
      countRows(supabase, "invitations", [["status", "revision"]]),
      countRows(supabase, "guests"),
      countRows(supabase, "invitations", [["order_status", "inquiry"]]),
      countRows(supabase, "invitations", [["order_status", "waiting_payment"]]),
      countRows(supabase, "invitations", [["order_status", "in_progress"]]),
      countRows(supabase, "invitations", [["order_status", "review"]]),
      supabase.from("rsvps").select("pax").gte("created_at", startOfMonth.toISOString()),
    ]);

    if (paxResult.error) {
      throw paxResult.error;
    }

    return NextResponse.json({
      source: "supabase",
      data: {
        invitations,
        activeThisMonth,
        rsvps,
        rsvpPax: (paxResult.data || []).reduce(
          (total, item) => total + Number(item.pax || 0),
          0,
        ),
        published,
        revision,
        guests,
        inquiry,
        waitingPayment,
        inProgress,
        review,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
