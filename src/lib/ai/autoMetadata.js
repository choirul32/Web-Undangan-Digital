// ============================================================
// Auto-metadata ornamen: tebak tema/slot/visualProps dari
// prompt + nama menggunakan provider chat (SumoPod).
// ============================================================

import { generateText } from "ai";
import { getTemplateAiModel } from "./provider";
import { ornamentThemeOptions } from "../../app/api/templates/ornaments/upload/route";
import { ornamentVisualPropOptions } from "../../app/api/templates/ornaments/upload/route";
import { ornamentSlots } from "../../templates/ornamentModel";

const AUTO_METADATA_SYSTEM = `Kamu adalah kurator aset undangan digital. Tugasmu menebak metadata untuk sebuah ornamen berdasarkan deskripsi prompt yang dipakai membuatnya.

Balas HANYA JSON valid tanpa markdown fence dengan bentuk:
{"theme": ["..."], "suggestedSlots": ["..."], "visualProps": ["..."], "name": "..."}

Aturan:
- theme: pilih dari: ${ornamentThemeOptions.join(", ")} (boleh lebih dari 1)
- suggestedSlots: pilih dari: ${ornamentSlots.join(", ")} (1-3 slot yang paling cocok)
- visualProps: pilih dari: ${ornamentVisualPropOptions.join(", ")} (1-3)
- name: nama singkat deskriptif (maks 40 karakter, huruf kecil, strip sebagai spasi)`;

function extractJsonLoose(text = "") {
  const trimmed = String(text).trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // cari blok json
  }
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    try {
      return JSON.parse(fence[1].trim());
    } catch {
      // lanjut
    }
  }
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch {
      // gagal
    }
  }
  return null;
}

function pickValid(values, validOptions) {
  return (values || [])
    .map((value) => String(value).trim().toLowerCase())
    .filter((value) => validOptions.includes(value));
}

/**
 * Tebak metadata ornamen dari prompt + subjek.
 * @param {object} params
 * @param {string} params.prompt prompt yang dipakai generate
 * @param {string} params.subject subjek dari admin
 * @param {string} params.styleId id preset gaya
 * @returns {Promise<{ theme: string[], suggestedSlots: string[], visualProps: string[], name: string }>}
 */
export async function generateOrnamentMetadata({ prompt, subject, styleId }) {
  const fallback = {
    theme: styleId ? [styleId] : [],
    suggestedSlots: [],
    visualProps: [],
    name: (subject || styleId || "ornament").toLowerCase().slice(0, 40),
  };

  try {
    const { model } = await getTemplateAiModel();
    if (!model) {
      return fallback;
    }

    const result = await generateText({
      model,
      system: AUTO_METADATA_SYSTEM,
      prompt: `Ornamen dibuat dengan prompt: "${prompt}". Subjek: "${subject}". Gaya: "${styleId}".`,
      temperature: 0.2,
    });

    const parsed = extractJsonLoose(result.text);
    if (!parsed) {
      return fallback;
    }

    const theme = pickValid(parsed.theme, ornamentThemeOptions);
    const suggestedSlots = pickValid(parsed.suggestedSlots, ornamentSlots);
    const visualProps = pickValid(parsed.visualProps, ornamentVisualPropOptions);
    const name = String(parsed.name || fallback.name).toLowerCase().slice(0, 40);

    return {
      theme: theme.length ? theme : fallback.theme,
      suggestedSlots,
      visualProps,
      name: name || fallback.name,
    };
  } catch (error) {
    console.error("[auto-metadata] error:", error?.message || error);
    return fallback;
  }
}
