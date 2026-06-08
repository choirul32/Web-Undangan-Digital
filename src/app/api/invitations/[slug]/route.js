import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../lib/auth";
import { writeAuditLog } from "../../../../lib/audit-log";
import { mapSupabaseInvitation } from "../../../../lib/invitations";
import { createServiceSupabaseClient } from "../../../../lib/supabase/server";

const MEDIA_BUCKET_NAME = "invitation-media";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function getPublishGuardErrors(invitation) {
  const errors = [];
  const events = invitation?.events || [];
  const media = invitation?.gallery || [];
  const features = invitation?.features || {};

  if (!invitation?.slug) {
    errors.push("Slug public wajib diisi.");
  }

  if (!invitation?.templateId) {
    errors.push("Template wajib dipilih.");
  }

  if (!invitation?.couple?.groomName || !invitation?.couple?.brideName) {
    errors.push("Nama lengkap kedua mempelai wajib diisi.");
  }

  if (!invitation?.couple?.groomNickname || !invitation?.couple?.brideNickname) {
    errors.push("Nama panggilan kedua mempelai wajib diisi.");
  }

  if (events.length === 0) {
    errors.push("Minimal satu acara wajib diisi.");
  }

  if (features.gift && (invitation?.bankAccounts || []).length === 0) {
    errors.push("Amplop digital aktif, minimal satu rekening wajib diisi.");
  }

  if (features.music && !invitation?.musicUrl) {
    errors.push("Backsound aktif, file musik wajib diupload.");
  }

  if (!invitation?.coverImage && media.length === 0) {
    errors.push("Minimal cover atau satu gambar gallery wajib diupload.");
  }

  return errors;
}

async function getInvitationBySlug(supabase, slug) {
  const { data, error } = await supabase
    .from("invitations")
    .select(
      `
      *,
      invitation_events (*),
      invitation_stories (*),
      invitation_media (*),
      bank_accounts (*),
      guests (*)
    `,
    )
    .eq("slug", slug)
    .single();

  return { data, error };
}

async function getTemplateById(supabase, templateId) {
  if (!templateId) {
    return null;
  }

  const { data } = await supabase
    .from("templates")
    .select("template_id, design_config")
    .eq("template_id", templateId)
    .maybeSingle();

  return data || null;
}

export async function GET(_request, { params }) {
  const slug = params.slug;

  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "Production database is not configured" },
      { status: 503 },
    );
  }

  const adminResult = await requireAdminApiSession();
  if (adminResult.error) {
    return NextResponse.json(adminResult.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data, error } = await getInvitationBySlug(supabase, slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const template = await getTemplateById(supabase, data.template_id);

  return NextResponse.json({
    source: "supabase",
    data: mapSupabaseInvitation(data, template),
  });
}

export async function PATCH(request, { params }) {
  const slug = params.slug;
  const payload = await request.json();

  if (!["publish", "archive"].includes(payload.action)) {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
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
  const { data, error } = await getInvitationBySlug(supabase, slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (payload.action === "archive") {
    const now = new Date().toISOString();
    const { data: archived, error: archiveError } = await supabase
      .from("invitations")
      .update({
        status: "archived",
        updated_at: now,
      })
      .eq("slug", slug)
      .select()
      .single();

    if (archiveError) {
      return NextResponse.json({ error: archiveError.message }, { status: 500 });
    }

    await writeAuditLog(supabase, {
      actorUserId: admin.session?.userId,
      actorEmail: admin.session?.email,
      action: "invitation.archive",
      entityType: "invitation",
      entityId: archived.id,
      metadata: { slug },
    });

    return NextResponse.json({
      source: "supabase",
      data: archived,
    });
  }

  const template = await getTemplateById(supabase, data.template_id);
  const invitation = mapSupabaseInvitation(data, template);
  const guardErrors = getPublishGuardErrors(invitation);

  if (guardErrors.length > 0) {
    return NextResponse.json(
      {
        error: "Publish guard failed",
        details: guardErrors,
      },
      { status: 422 },
    );
  }

  const now = new Date().toISOString();
  const { data: updated, error: updateError } = await supabase
    .from("invitations")
    .update({
      status: "published",
      published_at: now,
      updated_at: now,
    })
    .eq("slug", slug)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await writeAuditLog(supabase, {
    actorUserId: admin.session?.userId,
    actorEmail: admin.session?.email,
    action: "invitation.publish",
    entityType: "invitation",
    entityId: updated.id,
    metadata: { slug },
  });

  return NextResponse.json({
    source: "supabase",
    data: updated,
  });
}

export async function DELETE(_request, { params }) {
  const slug = params.slug;

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
  const { data, error } = await getInvitationBySlug(supabase, slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const storagePaths = (data.invitation_media || [])
    .map((item) => item.storage_path)
    .filter(Boolean);

  const { error: deleteError } = await supabase
    .from("invitations")
    .delete()
    .eq("id", data.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  if (storagePaths.length > 0) {
    await supabase.storage.from(MEDIA_BUCKET_NAME).remove(storagePaths);
  }

  await writeAuditLog(supabase, {
    actorUserId: admin.session?.userId,
    actorEmail: admin.session?.email,
    action: "invitation.delete",
    entityType: "invitation",
    entityId: data.id,
    metadata: {
      slug,
      couple: {
        groomName: data.groom_name,
        brideName: data.bride_name,
      },
    },
  });

  return NextResponse.json({
    source: "supabase",
    data: { id: data.id, slug },
  });
}
