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

function mapEvent(event) {
  return {
    id: event.id,
    title: event.title,
    eventDate: event.event_date,
    date: event.event_date,
    eventTime: event.event_time,
    time: event.event_time,
    venue: event.venue,
    address: event.address,
    mapsUrl: event.maps_url,
    sortOrder: event.sort_order,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const invitationSlug = searchParams.get("invitationSlug") || "dimas-salsa";

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: sampleInvitation.events.map((event, index) => ({
        ...event,
        id: event.id || `sample-event-${index}`,
        eventDate: event.eventDate || event.date,
        eventTime: event.eventTime || event.time,
      })),
    });
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

  return NextResponse.json({ source: "supabase", data: data.map(mapEvent) });
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

  return NextResponse.json({ source: "supabase", data: mapEvent(data) });
}

export async function PUT(request) {
  const payload = await request.json();

  if (!payload.invitationSlug || !payload.id || !payload.title) {
    return NextResponse.json({ error: "invitationSlug, id, and title are required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({ source: "sample", data: { ...payload } });
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
    .update({
      title: payload.title,
      event_date: payload.eventDate || null,
      event_time: payload.eventTime,
      venue: payload.venue,
      address: payload.address,
      maps_url: payload.mapsUrl,
      sort_order: payload.sortOrder || 0,
    })
    .eq("id", payload.id)
    .eq("invitation_id", invitation.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", data: mapEvent(data) });
}

export async function DELETE(request) {
  const payload = await request.json();

  if (!payload.invitationSlug || !payload.id) {
    return NextResponse.json({ error: "invitationSlug and id are required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({ source: "sample", data: { id: payload.id } });
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

  const { error } = await supabase
    .from("invitation_events")
    .delete()
    .eq("id", payload.id)
    .eq("invitation_id", invitation.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", data: { id: payload.id } });
}
