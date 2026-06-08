import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../lib/auth";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

async function getInvitation(supabase, slug) {
  const { data, error } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", slug)
    .single();

  return { data, error };
}

function mapGuest(guest) {
  return {
    id: guest.id,
    name: guest.name,
    slug: guest.slug,
    group: guest.guest_group,
    phone: guest.phone,
    rsvpStatus: guest.rsvp_status,
    pax: guest.pax,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const invitationSlug = searchParams.get("invitationSlug") || "";

  if (!invitationSlug) {
    return NextResponse.json({ error: "invitationSlug is required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "Production database is not configured" },
      { status: 503 },
    );
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data: invitation, error: invitationError } = await getInvitation(
    supabase,
    invitationSlug,
  );

  if (invitationError) {
    return NextResponse.json({ error: invitationError.message }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: data.map(mapGuest),
  });
}

export async function POST(request) {
  const payload = await request.json();

  if (!payload.slug || !payload.name || !payload.invitationSlug) {
    return NextResponse.json(
      { error: "invitationSlug, name, and slug are required" },
      { status: 400 },
    );
  }

  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "Production database is not configured" },
      { status: 503 },
    );
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data: invitation, error: invitationError } = await getInvitation(
    supabase,
    payload.invitationSlug,
  );

  if (invitationError) {
    return NextResponse.json({ error: invitationError.message }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("guests")
    .insert({
      invitation_id: invitation.id,
      name: payload.name,
      slug: payload.slug,
      guest_group: payload.group,
      phone: payload.phone || null,
      rsvp_status: "Belum RSVP",
      pax: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: mapGuest(data),
  });
}

export async function PUT(request) {
  const payload = await request.json();

  if (!payload.invitationSlug || !payload.originalSlug || !payload.name || !payload.slug) {
    return NextResponse.json(
      { error: "invitationSlug, originalSlug, name, and slug are required" },
      { status: 400 },
    );
  }

  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "Production database is not configured" },
      { status: 503 },
    );
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data: invitation, error: invitationError } = await getInvitation(
    supabase,
    payload.invitationSlug,
  );

  if (invitationError) {
    return NextResponse.json({ error: invitationError.message }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("guests")
    .update({
      name: payload.name,
      slug: payload.slug,
      guest_group: payload.group,
      phone: payload.phone || null,
    })
    .eq("invitation_id", invitation.id)
    .eq("slug", payload.originalSlug)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: mapGuest(data),
  });
}

export async function DELETE(request) {
  const payload = await request.json();

  if (!payload.invitationSlug || !payload.slug) {
    return NextResponse.json(
      { error: "invitationSlug and slug are required" },
      { status: 400 },
    );
  }

  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "Production database is not configured" },
      { status: 503 },
    );
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data: invitation, error: invitationError } = await getInvitation(
    supabase,
    payload.invitationSlug,
  );

  if (invitationError) {
    return NextResponse.json({ error: invitationError.message }, { status: 404 });
  }

  const { error } = await supabase
    .from("guests")
    .delete()
    .eq("invitation_id", invitation.id)
    .eq("slug", payload.slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: { slug: payload.slug },
  });
}
