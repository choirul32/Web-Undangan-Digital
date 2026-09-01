import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../lib/auth";
import { getReplicateClient } from "../../../../lib/ai/provider";
import { buildOrnamentPrompt, getStylePreset } from "../../../../lib/ai/ornamentStyles";
import { extractReplicateOutputUrl } from "../../../../lib/ai/replicateOutput";

// FLUX 1.1 Pro — text-to-image berkualitas tinggi, termasuk daftar "Try for Free" Replicate.
const DEFAULT_IMAGE_MODEL = "black-forest-labs/flux-1.1-pro";

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const styleId = String(payload.styleId || "wayang").trim();
  const subject = String(payload.subject || "").trim();
  const slot = String(payload.slot || "top-left").trim();

  if (!subject) {
    return NextResponse.json({ error: "Deskripsi subjek wajib diisi" }, { status: 400 });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const { client, provider } = await getReplicateClient();
  if (!client) {
    return NextResponse.json(
      {
        error:
          "Provider gambar (Replicate) belum dikonfigurasi. Tambahkan di Pengaturan → AI dengan tipe Image.",
      },
      { status: 503 },
    );
  }

  const model = provider?.model || DEFAULT_IMAGE_MODEL;
  const preset = getStylePreset(styleId);
  const prompt = buildOrnamentPrompt({ styleId, subject, slot });

  try {
    const prediction = await client.predictions.create({
      model,
      input: {
        prompt,
        aspect_ratio: "1:1",
        output_format: "png",
      },
    });

    return NextResponse.json({
      data: {
        predictionId: prediction.id,
        status: prediction.status,
        prompt,
        styleId,
        styleLabel: preset.label,
        model,
        // Output sementara (jika sudah selesai seketika) — biasanya kosong.
        output: extractReplicateOutputUrl(prediction.output),
        urls: prediction.urls || {},
      },
    });
  } catch (error) {
    console.error("[ornament-generate] error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal generate ornamen" },
      { status: 500 },
    );
  }
}
