import { NextResponse } from "next/server";
import { sampleInvitation } from "../../../data/sampleInvitation";
import { requireAdminApiSession } from "../../../lib/auth";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const invitationSlug = searchParams.get("invitationSlug") || "dimas-salsa";

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: sampleInvitation.slug === invitationSlug ? sampleInvitation.rsvps : [],
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", invitationSlug)
    .single();

  if (invitationError) {
    return NextResponse.json({ error: invitationError.message }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: data.map((item) => ({
      guestName: item.guest_name,
      attendance: item.attendance,
      pax: item.pax,
      message: item.message,
      createdAt: item.created_at,
    })),
  });
}

export async function POST(request) {
  const payload = await request.json();

  if (!payload.invitationSlug || !payload.guestName || !payload.attendance) {
    return NextResponse.json(
      { error: "invitationSlug, guestName, and attendance are required" },
      { status: 400 },
    );
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: {
        guestName: payload.guestName,
        attendance: payload.attendance,
        pax: payload.pax || 1,
        message: payload.message || "",
        createdAt: new Date().toISOString(),
      },
    });
  }

  const supabase = createServiceSupabaseClient();
  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", payload.invitationSlug)
    .single();

  if (invitationError) {
    return NextResponse.json({ error: invitationError.message }, { status: 404 });
  }

  let guestId = null;
  if (payload.guestSlug) {
    const { data: guest } = await supabase
      .from("guests")
      .select("id")
      .eq("invitation_id", invitation.id)
      .eq("slug", payload.guestSlug)
      .maybeSingle();

    guestId = guest?.id || null;
  }

  const { data, error } = await supabase
    .from("rsvps")
    .insert({
      invitation_id: invitation.id,
      guest_id: guestId,
      guest_name: payload.guestName,
      attendance: payload.attendance,
      pax: payload.pax || 1,
      message: payload.message || "",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (guestId) {
    await supabase
      .from("guests")
      .update({
        rsvp_status: payload.attendance === "hadir" ? "Hadir" : "Tidak Hadir",
        pax: payload.pax || 0,
      })
      .eq("id", guestId);
  }

  return NextResponse.json({
    source: "supabase",
    data,
  });
}
