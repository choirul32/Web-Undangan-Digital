import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../../lib/auth";
import { createServiceSupabaseClient } from "../../../../../lib/supabase/server";
import {
  readOrnamentManifest,
  updateOrnamentManifest,
  ORNAMENT_BUCKET,
} from "../../../../../lib/ai/manifest";
import { generateOrnamentMetadata } from "../../../../../lib/ai/autoMetadata";

function sanitizeFilename(name = "ornament") {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "ornament";
}

async function downloadImage(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Gagal mengunduh gambar (${response.status})`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const imageUrl = String(payload.imageUrl || "").trim();
  const name = String(payload.name || "").trim();
  const templateId = String(payload.templateId || "ornament-library").trim();
  const prompt = String(payload.prompt || "").trim();
  const subject = String(payload.subject || "").trim();
  const styleId = String(payload.styleId || "").trim();

  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl wajib diisi" }, { status: 400 });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const hasService =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasService) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 503 },
    );
  }

  try {
    const supabase = createServiceSupabaseClient();
    const imageBuffer = await downloadImage(imageUrl);

    // Auto-metadata via provider chat (SumoPod)
    const metadata = await generateOrnamentMetadata({ prompt, subject, styleId });

    const safeName = sanitizeFilename(metadata.name || name || "ai-ornament");
    const storagePath = `${templateId}/ornaments/ai-${safeName}-${Date.now()}-${crypto.randomUUID()}.png`;

    const { error: uploadError } = await supabase.storage
      .from(ORNAMENT_BUCKET)
      .upload(storagePath, imageBuffer, {
        contentType: "image/png",
        metadata: {
          displayName: (name || metadata.name || safeName).slice(0, 120),
          category: "ai-generated",
          tags: metadata.theme.join(","),
          theme: metadata.theme.join(","),
          suggestedSlots: metadata.suggestedSlots.join(","),
          visualProps: metadata.visualProps.join(","),
          source: "ai",
        },
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from(ORNAMENT_BUCKET)
      .getPublicUrl(storagePath);

    const manifestError = await updateOrnamentManifest(supabase, storagePath, {
      name: (name || metadata.name || safeName).slice(0, 120),
      section: "ai-generated",
      tags: metadata.theme.join(","),
      theme: metadata.theme,
      suggestedSlots: metadata.suggestedSlots,
      visualProps: metadata.visualProps,
      source: "ai",
    });

    if (manifestError) {
      return NextResponse.json({ error: manifestError.message }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        storagePath,
        url: publicUrlData.publicUrl,
        name: (name || metadata.name || safeName).slice(0, 120),
        theme: metadata.theme,
        suggestedSlots: metadata.suggestedSlots,
        visualProps: metadata.visualProps,
        source: "ai",
      },
    });
  } catch (error) {
    console.error("[ornament-save] error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal menyimpan ornamen" },
      { status: 500 },
    );
  }
}
