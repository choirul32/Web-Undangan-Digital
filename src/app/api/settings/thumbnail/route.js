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
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  // Without Supabase storage we cannot persist the file server-side; the client
  // keeps the data URL it generated for instant preview/local use.
  if (!hasServiceEnv()) {
    return NextResponse.json({ source: "sample", data: { url: null } });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const extension = file.name?.split(".").pop() || "bin";
  const storagePath = `platform/default-thumbnail-${Date.now()}-${crypto.randomUUID()}.${extension}`;
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

  return NextResponse.json({
    source: "supabase",
    data: { url: publicUrlData.publicUrl, storagePath },
  });
}
