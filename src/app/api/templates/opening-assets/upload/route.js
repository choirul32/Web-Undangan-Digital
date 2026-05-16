import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../../lib/auth";
import { createServiceSupabaseClient } from "../../../../../lib/supabase/server";

const BUCKET_NAME = "template-assets";

const ASSET_RULES = {
  video: {
    maxSize: 8 * 1024 * 1024,
    allowedTypes: ["video/mp4", "video/webm"],
    fallbackUrl: "/assets/nusantara-premium.svg",
  },
  lottie: {
    maxSize: 500 * 1024,
    allowedTypes: ["application/json", "application/lottie+json"],
    fallbackUrl: "",
  },
  "image-sequence": {
    maxSize: 2 * 1024 * 1024,
    allowedTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    fallbackUrl: "/assets/nusantara-premium.svg",
  },
  poster: {
    maxSize: 2 * 1024 * 1024,
    allowedTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    fallbackUrl: "/assets/nusantara-premium.svg",
  },
};

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function sanitizeFilename(filename = "opening-asset") {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function validateUpload({ file, assetType, assetRole }) {
  const effectiveType = assetRole === "poster" ? "poster" : assetType;
  const rules = ASSET_RULES[effectiveType];

  if (!rules) {
    return `Unsupported opening asset type: ${assetType}`;
  }

  if (file.size > rules.maxSize) {
    return `File terlalu besar. Maksimal ${Math.round(rules.maxSize / 1024 / 1024 || 1)}MB untuk ${effectiveType}.`;
  }

  const fileType = file.type || "application/octet-stream";
  if (!rules.allowedTypes.includes(fileType)) {
    return `Tipe file ${fileType} tidak didukung untuk ${effectiveType}.`;
  }

  return "";
}

export async function POST(request) {
  const formData = await request.formData();
  const templateId = formData.get("templateId");
  const assetType = formData.get("assetType") || "video";
  const assetRole = formData.get("assetRole") || "src";
  const file = formData.get("file");

  if (!templateId || typeof templateId !== "string") {
    return NextResponse.json({ error: "templateId is required" }, { status: 400 });
  }

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const validationError = validateUpload({ file, assetType, assetRole });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const effectiveType = assetRole === "poster" ? "poster" : assetType;

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: {
        templateId,
        assetType,
        assetRole,
        url: ASSET_RULES[effectiveType]?.fallbackUrl || "",
        storagePath: "",
      },
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const safeName = sanitizeFilename(file.name);
  const extension = safeName.split(".").pop() || (assetType === "lottie" ? "json" : "bin");
  const storagePath = `${templateId}/opening/${effectiveType}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
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
      assetType,
      assetRole,
      url: publicUrlData.publicUrl,
      storagePath,
    },
  });
}
