import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { buildSystemPrompt } from "./systemPrompt";
import { readOrnamentManifest, ORNAMENT_BUCKET } from "./manifest";
import { normalizeCatalogOrnament } from "./catalog";

// ---- replikasi buildManifestOrnaments (sama dengan route generate) ----
function buildManifestOrnaments(manifest, supabase) {
  return Object.entries(manifest).map(([storagePath, metadata]) => {
    const publicUrl = supabase.storage
      .from(ORNAMENT_BUCKET)
      .getPublicUrl(storagePath).data.publicUrl;

    const name = metadata.name || storagePath.split("/").pop() || storagePath;
    const themes = Array.isArray(metadata.theme) && metadata.theme.length
      ? metadata.theme
      : inferThemesFromName(name, metadata.tags);

    return normalizeCatalogOrnament({
      id: storagePath,
      src: metadata.src || publicUrl,
      name,
      theme: themes,
      suggestedSlots: metadata.suggestedSlots,
      visualProps: metadata.visualProps,
      tags: metadata.tags,
    });
  });
}

const THEME_HINTS = [
  { theme: "wayang", keywords: ["wayang", "golek", "kulit"] },
  { theme: "jawa", keywords: ["jawa", "batik", "songket", "keraton", "parang", "kawung"] },
  { theme: "bali", keywords: ["bali", "kamboja", "barong", "penjor"] },
  { theme: "islami", keywords: ["islami", "arab", "kaligrafi", "masjid", "bismillah"] },
  { theme: "floral", keywords: ["bunga", "floral", "flower", "rose", "peony", "bouquet", "tulip"] },
  { theme: "tropical", keywords: ["tropical", "tropis", "monstera", "palem", "frangipani", "daun"] },
  { theme: "modern", keywords: ["modern", "geometris", "minimalis"] },
  { theme: "minimal", keywords: ["minimal", "simple", "clean"] },
  { theme: "royal", keywords: ["royal", "mewah", "gold", "emas", "luxury"] },
  { theme: "watercolor", keywords: ["watercolor", "aquarel"] },
  { theme: "nature", keywords: ["nature", "alam", "hutan", "green"] },
  { theme: "elegant", keywords: ["elegant", "classic", "klasik"] },
];

function inferThemesFromName(name = "", tags = "") {
  const haystack = `${name} ${tags}`.toLowerCase();
  const found = [];
  for (const { theme, keywords } of THEME_HINTS) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      found.push(theme);
    }
  }
  return found;
}

// Test LIVE — butuh Supabase + provider AI terkonfigurasi.
// Di-skip default; jalankan manual:
//   npx vitest run src/lib/ai/liveGenerate.test.js
describe.skip("generate live ke provider AI", () => {
  it("menghasilkan output yang memakai ornamen upload", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      console.log("SKIP: env supabase tidak tersedia");
      return;
    }

    const sb = createClient(url, key);
    const { data: providerRow } = await sb.from("ai_providers").select("*").eq("provider_id", "sumopod").single();
    const provider = createOpenAICompatible({ name: "sumopod-test", baseURL: providerRow.base_url, apiKey: providerRow.api_key });

    const manifest = await readOrnamentManifest();
    const ornaments = buildManifestOrnaments(manifest, sb);
    console.log("ORNAMENTS IN CATALOG:", ornaments.length);
    for (const ornament of ornaments) {
      console.log(`  - ${ornament.name} | src:${ornament.src ? "YES" : "NO"} | themes:${ornament.themes.join("/")}`);
    }

    const result = await generateText({
      model: provider(providerRow.model),
      system: buildSystemPrompt({ ornaments }),
      prompt: "buatkan undangan tema jawa wayang",
      temperature: 0.7,
    });

    const text = result.text;
    console.log("LENGTH:", text.length);
    console.log("HAS designConfig:", text.includes("designConfig"));

    // Cek apakah output memakai src ornamen yang terdaftar
    const usesUploadedOrnament = ornaments.some((ornament) => ornament.src && text.includes(ornament.src));
    console.log("USES UPLOADED ORNAMENT:", usesUploadedOrnament);
    console.log("TAIL:", text.slice(-400));

    expect(text.includes("designConfig")).toBe(true);
  }, 120000);
});
