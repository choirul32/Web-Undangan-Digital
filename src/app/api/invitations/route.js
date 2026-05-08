import { NextResponse } from "next/server";
import { sampleInvitation } from "../../../data/sampleInvitation";
import {
  formPayloadToInvitationRow,
  mapInvitationListItem,
} from "../../../lib/invitations";
import { requireAdminApiSession } from "../../../lib/auth";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function GET() {
  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: [
        {
          id: sampleInvitation.id,
          couple: `${sampleInvitation.couple.groomNickname} & ${sampleInvitation.couple.brideNickname}`,
          slug: sampleInvitation.slug,
          template: sampleInvitation.templateId,
          category: "Sample",
          status: "published",
          date: "12 Jun 2026",
          rsvp: sampleInvitation.guests?.length || 0,
          package: sampleInvitation.package,
        },
      ],
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: data.map(mapInvitationListItem),
  });
}

export async function POST(request) {
  const payload = await request.json();

  if (!payload.slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: {
        id: "LOCAL-DRAFT",
        slug: payload.slug,
      },
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const invitationRow = formPayloadToInvitationRow(payload);

  const { data: invitation, error } = await supabase
    .from("invitations")
    .upsert(invitationRow, { onConflict: "slug" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (payload.eventTitle) {
    await supabase.from("invitation_events").insert({
      invitation_id: invitation.id,
      title: payload.eventTitle,
      event_date: payload.eventDate || null,
      event_time: payload.eventTime,
      venue: payload.venue,
      address: payload.venue,
      maps_url: payload.mapsUrl,
      sort_order: 1,
    });
  }

  return NextResponse.json({
    source: "supabase",
    data: invitation,
  });
}
