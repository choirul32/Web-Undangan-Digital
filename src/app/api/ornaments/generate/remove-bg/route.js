import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../../lib/auth";
import { getReplicateClient } from "../../../../../lib/ai/provider";
import { extractReplicateOutputUrl } from "../../../../../lib/ai/replicateOutput";

// Model remove background → PNG transparan (murah, ~2 detik)
const REMOVE_BG_MODEL = "lucataco/remove-bg";

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const imageUrl = String(payload.imageUrl || "").trim();
  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl wajib diisi" }, { status: 400 });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const { client } = await getReplicateClient();
  if (!client) {
    return NextResponse.json(
      { error: "Provider gambar (Replicate) belum dikonfigurasi." },
      { status: 503 },
    );
  }

  try {
    const prediction = await client.predictions.create({
      model: REMOVE_BG_MODEL,
      input: {
        image: imageUrl,
      },
    });

    return NextResponse.json({
      data: {
        predictionId: prediction.id,
        status: prediction.status,
        output: extractReplicateOutputUrl(prediction.output),
        urls: prediction.urls || {},
      },
    });
  } catch (error) {
    console.error("[ornament-remove-bg] error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal remove background" },
      { status: 500 },
    );
  }
}
