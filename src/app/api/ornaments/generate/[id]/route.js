import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../../lib/auth";
import { getReplicateClient } from "../../../../../lib/ai/provider";
import { extractReplicateOutputUrl } from "../../../../../lib/ai/replicateOutput";

export async function GET(request, context) {
  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const id = String(context?.params?.id || "").trim();
  if (!id) {
    return NextResponse.json({ error: "prediction id required" }, { status: 400 });
  }

  const { client } = await getReplicateClient();
  if (!client) {
    return NextResponse.json(
      { error: "Provider gambar (Replicate) belum dikonfigurasi." },
      { status: 503 },
    );
  }

  try {
    const prediction = await client.predictions.get(id);

    return NextResponse.json({
      data: {
        predictionId: prediction.id,
        status: prediction.status,
        output: extractReplicateOutputUrl(prediction.output),
        error: prediction.error || null,
      },
    });
  } catch (error) {
    console.error("[ornament-generate-status] error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengambil status generate" },
      { status: 500 },
    );
  }
}
