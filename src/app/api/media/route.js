import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../lib/auth";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";
import { validateImageUpload } from "../../../lib/uploadValidation";

const BUCKET_NAME = "invitation-media";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

async function getInvitation(supabase, slug) {
  const { data, error } = await supabase
    .from("invitations")
    .select("id, slug")
    .eq("slug", slug)
    .single();

  if (error) {
    return null;
  }

  return data;
}

function mapMedia(item) {
  return {
    id: item.id,
    mediaType: item.media_type,
    title: item.title,
    url: item.url,
    storagePath: item.storage_path,
    fileSize: item.file_size || null,
    mimeType: item.mime_type || null,
  };
}

async function getStorageFileSize(supabase, storagePath = "") {
  if (!storagePath) return null;

  const parts = storagePath.split("/");
  const filename = parts.pop();
  const directory = parts.join("/");

  if (!filename || !directory) return null;

  const { data } = await supabase.storage
    .from(BUCKET_NAME)
    .list(directory, {
      limit: 1,
      search: filename,
    });
  const match = (data || []).find((item) => item.name === filename);
  const size = Number(match?.metadata?.size || match?.metadata?.contentLength || 0);

  return Number.isFinite(size) && size > 0 ? size : null;
}

async function mapMediaWithStorageDetails(supabase, item) {
  const mapped = mapMedia(item);
  if (mapped.fileSize) return mapped;

  return {
    ...mapped,
    fileSize: await getStorageFileSize(supabase, item.storage_path),
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
  const invitation = await getInvitation(supabase, invitationSlug);

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("invitation_media")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: await Promise.all(data.map((item) => mapMediaWithStorageDetails(supabase, item))),
  });
}

export async function POST(request) {
  const formData = await request.formData();
  const invitationSlug = formData.get("invitationSlug") || "";
  const mediaType = formData.get("mediaType") || "image";
  const title = formData.get("title") || "Media";
  const replaceId = formData.get("replaceId");
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (file.type?.startsWith("image/")) {
    const validationError = validateImageUpload(file, "Gambar media");
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
  }

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
  const invitation = await getInvitation(supabase, invitationSlug);

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const extension = file.name?.split(".").pop() || "bin";
  const storagePath = `${invitation.slug}/${mediaType}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  let existingMedia = null;

  if (replaceId) {
    const { data: existing } = await supabase
      .from("invitation_media")
      .select("id, storage_path")
      .eq("id", replaceId)
      .eq("invitation_id", invitation.id)
      .maybeSingle();

    existingMedia = existing;
  }

  const mediaRow = {
      invitation_id: invitation.id,
      media_type: mediaType,
      title,
      url: publicUrlData.publicUrl,
      storage_path: storagePath,
      sort_order: Math.floor(Date.now() / 1000),
  };

  const query = existingMedia?.id
    ? supabase
        .from("invitation_media")
        .update(mediaRow)
        .eq("id", existingMedia.id)
        .eq("invitation_id", invitation.id)
    : supabase.from("invitation_media").insert(mediaRow);

  const { data, error } = await query.select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (existingMedia?.storage_path) {
    await supabase.storage.from(BUCKET_NAME).remove([existingMedia.storage_path]);
  }

  return NextResponse.json({
    source: "supabase",
    data: {
      ...mapMedia(data),
      fileSize: file.size || null,
      mimeType: file.type || null,
    },
  });
}

export async function DELETE(request) {
  const payload = await request.json();

  if (!payload.invitationSlug || !payload.id) {
    return NextResponse.json({ error: "invitationSlug and id are required" }, { status: 400 });
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
  const invitation = await getInvitation(supabase, payload.invitationSlug);

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from("invitation_media")
    .select("id, storage_path")
    .eq("id", payload.id)
    .eq("invitation_id", invitation.id)
    .maybeSingle();

  const { error } = await supabase
    .from("invitation_media")
    .delete()
    .eq("id", payload.id)
    .eq("invitation_id", invitation.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (existing?.storage_path) {
    await supabase.storage.from(BUCKET_NAME).remove([existing.storage_path]);
  }

  return NextResponse.json({ source: "supabase", data: { id: payload.id } });
}
