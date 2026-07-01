import { NextResponse } from "next/server";
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
  const [{ data, error }, { data: templatesData }] = await Promise.all([
    supabase
    .from("invitations")
    .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("templates")
      .select("template_id, name, category"),
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const templateLookup = new Map(
    (templatesData || []).map((template) => [
      template.template_id,
      {
        name: template.name,
        category: template.category,
      },
    ]),
  );

  return NextResponse.json({
    source: "supabase",
    data: data.map((row) => mapInvitationListItem(row, templateLookup)),
  });
}

export async function POST(request) {
  const payload = await request.json();

  if (!payload.slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
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
  const invitationRow = {
    ...formPayloadToInvitationRow(payload),
    updated_at: new Date().toISOString(),
  };
  const originalSlug = payload.originalSlug || "";

  if (originalSlug && originalSlug !== payload.slug) {
    const { data: existingSlug, error: existingSlugError } = await supabase
      .from("invitations")
      .select("id")
      .eq("slug", payload.slug)
      .maybeSingle();

    if (existingSlugError) {
      return NextResponse.json({ error: existingSlugError.message }, { status: 500 });
    }

    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug sudah dipakai order lain. Gunakan slug baru atau edit order yang sudah ada." },
        { status: 409 },
      );
    }

    const { data: invitation, error } = await supabase
      .from("invitations")
      .update(invitationRow)
      .eq("slug", originalSlug)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      source: "supabase",
      data: invitation,
    });
  }

  if (originalSlug) {
    const { data: invitation, error } = await supabase
      .from("invitations")
      .update(invitationRow)
      .eq("slug", originalSlug)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      source: "supabase",
      data: invitation,
    });
  }

  const { data: existingInvitation, error: existingError } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", payload.slug)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existingInvitation) {
    return NextResponse.json(
      { error: "Slug sudah dipakai order lama. Buat slug baru agar template/data lama tidak ikut menempel." },
      { status: 409 },
    );
  }

  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert(invitationRow)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: invitation,
  });
}
