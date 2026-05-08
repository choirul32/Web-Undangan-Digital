import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../lib/auth";
import { createServiceSupabaseClient } from "../../../../lib/supabase/server";

const BUCKET_NAME = "template-assets";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function POST(request) {
  const formData = await request.formData();
  const templateId = formData.get("templateId");
  const file = formData.get("file");

  if (!templateId || typeof templateId !== "string") {
    return NextResponse.json({ error: "templateId is required" }, { status: 400 });
  }

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: {
        templateId,
        url: "/assets/nusantara-premium.svg",
      },
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const extension = file.name?.split(".").pop() || "bin";
  const storagePath = `${templateId}/thumbnail-${Date.now()}-${crypto.randomUUID()}.${extension}`;
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

  const publicUrl = publicUrlData.publicUrl;

  const { error } = await supabase
    .from("templates")
    .update({
      thumbnail_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("template_id", templateId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: {
      templateId,
      url: publicUrl,
      storagePath,
    },
  });
}
