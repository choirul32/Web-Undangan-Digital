import { NextResponse } from "next/server";
import { defaultTemplateMetadata } from "../../../data/templateAdminDefaults";
import { requireAdminApiSession } from "../../../lib/auth";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function mapTemplateRow(row) {
  return {
    id: row.template_id,
    name: row.name,
    category: row.category,
    price: row.price || "",
    badge: row.badge || "",
    status: row.status || "active",
    description: row.description || "",
    image: row.thumbnail_url || "",
    previewUrl: row.preview_url || "/preview",
    supportedFeatures: row.supported_features || [],
    designConfig: row.design_config || {},
    sortOrder: row.sort_order || 0,
  };
}

function payloadToTemplateRow(payload) {
  return {
    template_id: payload.id,
    name: payload.name,
    category: payload.category,
    price: payload.price || null,
    badge: payload.badge || null,
    status: payload.status || "active",
    description: payload.description || null,
    thumbnail_url: payload.image || null,
    preview_url: payload.previewUrl || "/preview",
    supported_features: payload.supportedFeatures || [],
    design_config: payload.designConfig || {},
    sort_order: Number(payload.sortOrder || 0),
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") || "public";
  const isAdminScope = scope === "admin";

  if (!hasServiceEnv()) {
    const data = isAdminScope
      ? defaultTemplateMetadata
      : defaultTemplateMetadata.filter((template) => template.status === "active");

    return NextResponse.json({
      source: "sample",
      data,
    });
  }

  if (isAdminScope) {
    const admin = await requireAdminApiSession();
    if (admin.error) {
      return NextResponse.json(admin.error, { status: 401 });
    }
  }

  const supabase = createServiceSupabaseClient();
  let query = supabase
    .from("templates")
    .select("*")
    .order("sort_order", { ascending: true });

  if (!isAdminScope) {
    query = query.eq("status", "active");
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: data.map(mapTemplateRow),
  });
}

export async function POST(request) {
  const payload = await request.json();

  if (!payload.id || !payload.name || !payload.category) {
    return NextResponse.json(
      { error: "id, name, and category are required" },
      { status: 400 },
    );
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: payload,
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("templates")
    .upsert(payloadToTemplateRow(payload), { onConflict: "template_id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: mapTemplateRow(data),
  });
}

export async function DELETE(request) {
  const payload = await request.json();

  if (!payload.id) {
    return NextResponse.json(
      { error: "id is required" },
      { status: 400 },
    );
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: { id: payload.id },
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { error } = await supabase
    .from("templates")
    .delete()
    .eq("template_id", payload.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: { id: payload.id },
  });
}
