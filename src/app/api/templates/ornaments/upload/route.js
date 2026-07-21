import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../../lib/auth";
import { createServiceSupabaseClient } from "../../../../../lib/supabase/server";
import { validateImageUpload } from "../../../../../lib/uploadValidation";

const BUCKET_NAME = "template-assets";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function sanitizeFilename(filename = "ornament") {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request) {
  const formData = await request.formData();
  const templateId = formData.get("templateId");
  const section = formData.get("section") || "home";
  const ornamentId = formData.get("ornamentId") || "ornament";
  const file = formData.get("file");

  if (!templateId || typeof templateId !== "string") {
    return NextResponse.json({ error: "templateId is required" }, { status: 400 });
  }

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const validationError = validateImageUpload(file, "Ornament");
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: {
        templateId,
        section,
        ornamentId,
        url: "/assets/blue-watercolor-frame.svg",
      },
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const safeName = sanitizeFilename(file.name);
  const extension = safeName.split(".").pop() || "png";
  const storagePath = `${templateId}/ornaments/${section}-${ornamentId}-${Date.now()}-${crypto.randomUUID()}.${extension}`;
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
    data: {
      templateId,
      section,
      ornamentId,
      url: publicUrlData.publicUrl,
      storagePath,
    },
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get("templateId");

  if (!templateId) {
    return NextResponse.json({ error: "templateId is required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: [],
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const directory = `${templateId}/ornaments`;
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(directory, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: (data || [])
      .filter((item) => item.name)
      .map((item) => {
        const storagePath = `${directory}/${item.name}`;
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(storagePath);

        return {
          id: storagePath,
          name: item.name.replace(/\.[^.]+$/, ""),
          src: publicUrlData.publicUrl,
          storagePath,
          source: "supabase",
        };
      }),
  });
}

export async function DELETE(request) {
  const payload = await request.json();

  if (!payload.storagePath) {
    return NextResponse.json({ error: "storagePath is required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: {
        storagePath: payload.storagePath,
      },
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([payload.storagePath]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: {
      storagePath: payload.storagePath,
    },
  });
}
