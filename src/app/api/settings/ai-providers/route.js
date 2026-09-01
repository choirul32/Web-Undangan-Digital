import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../lib/auth";
import { createServiceSupabaseClient } from "../../../../lib/supabase/server";

function maskApiKey(key = "") {
  if (!key) return "";
  if (key.length <= 8) return "********";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

function serializeProvider(row, { reveal = false } = {}) {
  return {
    id: row.id,
    providerId: row.provider_id,
    name: row.name,
    baseUrl: row.base_url,
    model: row.model,
    providerType: row.provider_type || "chat",
    isActive: row.is_active,
    apiKey: reveal ? row.api_key : maskApiKey(row.api_key || ""),
    hasKey: Boolean(row.api_key),
    updatedAt: row.updated_at,
  };
}

export async function GET(request) {
  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const reveal = new URL(request.url).searchParams.get("reveal") === "1";

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("ai_providers")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: (data || []).map((row) => serializeProvider(row, { reveal })),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  try {
    const body = await request.json();
    const providerId = String(body.providerId || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const baseUrl = String(body.baseUrl || "").trim().replace(/\/+$/, "");
    const apiKey = String(body.apiKey || "").trim();
    const model = String(body.model || "").trim();
    const providerType = String(body.providerType || "chat").trim().toLowerCase();

    if (!providerId || !name || !baseUrl || !apiKey || !model) {
      return NextResponse.json(
        { error: "providerId, name, baseUrl, apiKey, dan model wajib diisi" },
        { status: 400 },
      );
    }

    if (!["chat", "image"].includes(providerType)) {
      return NextResponse.json(
        { error: "providerType harus 'chat' atau 'image'" },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9-]+$/.test(providerId)) {
      return NextResponse.json(
        { error: "providerId hanya huruf kecil, angka, dan strip" },
        { status: 400 },
      );
    }

    if (!/^https?:\/\//.test(baseUrl)) {
      return NextResponse.json(
        { error: "baseUrl harus URL valid (http/https)" },
        { status: 400 },
      );
    }

    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("ai_providers")
      .upsert(
        {
          provider_id: providerId,
          name,
          base_url: baseUrl,
          api_key: apiKey,
          model,
          provider_type: providerType,
          is_active: body.isActive !== false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "provider_id" },
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: serializeProvider(data) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  try {
    const body = await request.json();
    const providerId = String(body.providerId || "").trim().toLowerCase();

    if (!providerId) {
      return NextResponse.json({ error: "providerId wajib diisi" }, { status: 400 });
    }

    const updates = {};
    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.baseUrl !== undefined) updates.base_url = String(body.baseUrl).trim().replace(/\/+$/, "");
    if (body.model !== undefined) updates.model = String(body.model).trim();
    if (body.providerType !== undefined) {
      const nextType = String(body.providerType).trim().toLowerCase();
      if (!["chat", "image"].includes(nextType)) {
        return NextResponse.json({ error: "providerType harus 'chat' atau 'image'" }, { status: 400 });
      }
      updates.provider_type = nextType;
    }
    if (body.isActive !== undefined) updates.is_active = Boolean(body.isActive);
    if (body.apiKey !== undefined && String(body.apiKey).trim()) {
      updates.api_key = String(body.apiKey).trim();
    }
    updates.updated_at = new Date().toISOString();

    if (Object.keys(updates).length <= 1) {
      return NextResponse.json({ error: "Tidak ada field yang diubah" }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("ai_providers")
      .update(updates)
      .eq("provider_id", providerId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: serializeProvider(data) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  try {
    const body = await request.json();
    const providerId = String(body.providerId || "").trim().toLowerCase();

    if (!providerId) {
      return NextResponse.json({ error: "providerId wajib diisi" }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    const { error } = await supabase
      .from("ai_providers")
      .delete()
      .eq("provider_id", providerId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: { providerId } });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
