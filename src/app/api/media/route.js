import { NextResponse } from "next/server";
import { sampleInvitation } from "../../../data/sampleInvitation";
import { requireAdminApiSession } from "../../../lib/auth";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const invitationSlug = searchParams.get("invitationSlug") || "dimas-salsa";

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: sampleInvitation.gallery.map((url, index) => ({
        id: `sample-${index}`,
        mediaType: "image",
        title: `Gallery ${index + 1}`,
        url,
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
    .from("invitation_media")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: data.map((item) => ({
      id: item.id,
      mediaType: item.media_type,
      title: item.title,
      url: item.url,
      storagePath: item.storage_path,
    })),
  });
}

export async function POST(request) {
  const formData = await request.formData();
  const invitationSlug = formData.get("invitationSlug") || "dimas-salsa";
  const mediaType = formData.get("mediaType") || "image";
  const title = formData.get("title") || "Media";
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: {
        id: `local-${Date.now()}`,
        mediaType,
        title,
        url: "/assets/nusantara-premium.svg",
      },
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

  const { data, error } = await supabase
    .from("invitation_media")
    .insert({
      invitation_id: invitation.id,
      media_type: mediaType,
      title,
      url: publicUrlData.publicUrl,
      storage_path: storagePath,
      sort_order: Date.now(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: {
      id: data.id,
      mediaType: data.media_type,
      title: data.title,
      url: data.url,
      storagePath: data.storage_path,
    },
  });
}
