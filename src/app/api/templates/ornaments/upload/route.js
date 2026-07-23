import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../../lib/auth";
import { createServiceSupabaseClient } from "../../../../../lib/supabase/server";
import { validateImageUpload } from "../../../../../lib/uploadValidation";

const BUCKET_NAME = "template-assets";
const ORNAMENT_MANIFEST_PATH = "_ornament_manifest.json";

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

async function readOrnamentManifest(supabase) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(ORNAMENT_MANIFEST_PATH);

  if (error || !data) {
    return {};
  }

  try {
    return JSON.parse(await data.text());
  } catch {
    return {};
  }
}

async function writeOrnamentManifest(supabase, manifest) {
  const body = JSON.stringify(manifest, null, 2);
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(ORNAMENT_MANIFEST_PATH, body, {
      contentType: "application/json",
      upsert: true,
    });

  return error;
}

async function updateOrnamentManifest(supabase, storagePath, data) {
  const manifest = await readOrnamentManifest(supabase);
  manifest[storagePath] = {
    ...(manifest[storagePath] || {}),
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return writeOrnamentManifest(supabase, manifest);
}

export async function POST(request) {
  const formData = await request.formData();
  const templateId = formData.get("templateId");
  const section = formData.get("section") || "home";
  const ornamentId = formData.get("ornamentId") || "ornament";
  const displayName = formData.get("name") || ornamentId;
  const tags = formData.get("tags") || "";
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
        name: displayName,
        tags,
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
      metadata: {
        displayName: String(displayName).slice(0, 120),
        category: String(section).slice(0, 40),
        tags: String(tags).slice(0, 240),
      },
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  const manifestError = await updateOrnamentManifest(supabase, storagePath, {
    name: String(displayName).slice(0, 120),
    section: String(section).slice(0, 40),
    tags: String(tags).slice(0, 240),
  });

  if (manifestError) {
    return NextResponse.json({ error: manifestError.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: {
      templateId,
      section,
      ornamentId,
      name: displayName,
      tags,
      url: publicUrlData.publicUrl,
      storagePath,
    },
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get("templateId");
  const scope = searchParams.get("scope") || "template";

  if (!templateId && scope !== "all") {
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
  const manifest = await readOrnamentManifest(supabase);
  const directory = scope === "all" ? "" : `${templateId}/ornaments`;
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(directory, {
      limit: scope === "all" ? 1000 : 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const templateDirectories =
    scope === "all"
      ? (data || []).filter((item) => item.name && !item.name.includes("."))
      : [{ name: templateId }];

  const ornamentFiles =
    scope === "all"
      ? (
          await Promise.all(
            templateDirectories.map(async (templateDirectory) => {
              const ornamentDirectory = `${templateDirectory.name}/ornaments`;
              const { data: files } = await supabase.storage
                .from(BUCKET_NAME)
                .list(ornamentDirectory, {
                  limit: 100,
                  offset: 0,
                  sortBy: { column: "created_at", order: "desc" },
                });

              return (files || [])
                .filter((item) => item.name)
                .map((item) => ({
                  ...item,
                  templateId: templateDirectory.name,
                  directory: ornamentDirectory,
                }));
            }),
          )
        ).flat()
      : (data || [])
          .filter((item) => item.name)
          .map((item) => ({ ...item, templateId, directory }));

  return NextResponse.json({
    source: "supabase",
    data: ornamentFiles.map((item) => {
      const storagePath = `${item.directory}/${item.name}`;
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);
      const nameWithoutExtension = item.name.replace(/\.[^.]+$/, "");
      const section = nameWithoutExtension.split("-")[0] || "general";
      const manifestItem = manifest[storagePath] || {};

      return {
        id: storagePath,
        name: manifestItem.name || item.metadata?.displayName || nameWithoutExtension,
        src: publicUrlData.publicUrl,
        storagePath,
        templateId: item.templateId,
        section: manifestItem.section || item.metadata?.category || section,
        fileSize: item.metadata?.size || null,
        mimeType: item.metadata?.mimetype || item.metadata?.contentType || null,
        tags: manifestItem.tags || item.metadata?.tags || "",
        createdAt: item.created_at || item.updated_at || null,
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

  const manifest = await readOrnamentManifest(supabase);
  delete manifest[payload.storagePath];
  const manifestError = await writeOrnamentManifest(supabase, manifest);

  if (manifestError) {
    return NextResponse.json({ error: manifestError.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: {
      storagePath: payload.storagePath,
    },
  });
}

export async function PATCH(request) {
  const contentType = request.headers.get("content-type") || "";
  let payload = {};
  let replacementFile = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    payload = {
      storagePath: formData.get("storagePath"),
      name: formData.get("name"),
      category: formData.get("category"),
      tags: formData.get("tags"),
      mimeType: formData.get("mimeType"),
    };
    const file = formData.get("file");
    replacementFile = file && typeof file !== "string" ? file : null;
  } else {
    payload = await request.json();
  }

  if (!payload.storagePath) {
    return NextResponse.json({ error: "storagePath is required" }, { status: 400 });
  }

  const displayName = String(payload.name || "").trim();
  const category = String(payload.category || "custom").trim();
  const tags = String(payload.tags || "").trim();

  if (!displayName) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  if (replacementFile) {
    const validationError = validateImageUpload(replacementFile, "Ornament pengganti");
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: {
        storagePath: payload.storagePath,
        name: displayName,
        section: category,
        tags,
        replaced: Boolean(replacementFile),
        fileSize: replacementFile?.size || null,
        mimeType: replacementFile?.type || null,
      },
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  let fileData = replacementFile;

  if (!fileData) {
    const { data: downloadedFile, error: downloadError } = await supabase.storage
      .from(BUCKET_NAME)
      .download(payload.storagePath);

    if (downloadError) {
      return NextResponse.json({ error: downloadError.message }, { status: 500 });
    }

    fileData = downloadedFile;
  }

  const fileBuffer = Buffer.from(await fileData.arrayBuffer());
  const { error: updateError } = await supabase.storage
    .from(BUCKET_NAME)
    .update(payload.storagePath, fileBuffer, {
      contentType: payload.mimeType || fileData.type || "application/octet-stream",
      upsert: true,
      metadata: {
        displayName: displayName.slice(0, 120),
        category: category.slice(0, 40),
        tags: tags.slice(0, 240),
      },
    });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const manifestError = await updateOrnamentManifest(supabase, payload.storagePath, {
    name: displayName.slice(0, 120),
    section: category.slice(0, 40),
    tags: tags.slice(0, 240),
  });

  if (manifestError) {
    return NextResponse.json({ error: manifestError.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: {
      storagePath: payload.storagePath,
      name: displayName,
      section: category,
      tags,
      replaced: Boolean(replacementFile),
      fileSize: fileData.size || null,
      mimeType: fileData.type || payload.mimeType || null,
    },
  });
}
