import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../lib/auth";
import { sampleInvitation } from "../../../data/sampleInvitation";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

async function getInvitation(supabase, slug) {
  const { data } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", slug)
    .single();

  return data;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const invitationSlug = searchParams.get("invitationSlug") || "dimas-salsa";

  if (!hasServiceEnv()) {
    return NextResponse.json({ source: "sample", data: sampleInvitation.events });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const invitation = await getInvitation(supabase, invitationSlug);

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("invitation_events")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", data });
}

export async function POST(request) {
  const payload = await request.json();

  if (!payload.invitationSlug || !payload.title) {
    return NextResponse.json({ error: "invitationSlug and title are required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: { ...payload, id: `local-${Date.now()}` },
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const invitation = await getInvitation(supabase, payload.invitationSlug);

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("invitation_events")
    .insert({
      invitation_id: invitation.id,
      title: payload.title,
      event_date: payload.eventDate || null,
      event_time: payload.eventTime,
      venue: payload.venue,
      address: payload.address,
      maps_url: payload.mapsUrl,
      sort_order: payload.sortOrder || Date.now(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", data });
}
