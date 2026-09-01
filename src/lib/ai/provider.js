// ============================================================
// Provider AI untuk template generator — multi-provider
// OpenAI-compatible. Provider aktif dibaca dari tabel
// ai_providers (diisi via UI Pengaturan). Fallback: env
// SUMOPOD_* (SumoPod) bila tabel kosong / belum ada.
// ============================================================

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createServiceSupabaseClient } from "../supabase/server";

export const defaultSumopodBaseURL =
  process.env.SUMOPOD_BASE_URL || "https://api.sumopod.com/v1";

export function hasEnvFallback() {
  return Boolean(process.env.SUMOPOD_API_KEY);
}

export function getEnvFallbackModel() {
  return process.env.SUMOPOD_MODEL || "gpt-4o-mini";
}

// ---- Baca provider dari DB (by type) ----
async function findAiProvider({ providerType, activeOnly = true }) {
  const hasService =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasService) {
    return null;
  }

  try {
    const supabase = createServiceSupabaseClient();
    let query = supabase
      .from("ai_providers")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1);

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    if (providerType) {
      query = query.eq("provider_type", providerType);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      providerId: data.provider_id,
      name: data.name,
      baseUrl: data.base_url,
      apiKey: data.api_key,
      model: data.model,
      providerType: data.provider_type || "chat",
    };
  } catch {
    return null;
  }
}

// ---- Baca provider chat aktif dari DB ----
export async function getActiveAiProvider() {
  return findAiProvider({ providerType: "chat", activeOnly: true });
}

// ---- Baca provider image aktif dari DB ----
export async function getActiveImageProvider() {
  const provider = await findAiProvider({ providerType: "image", activeOnly: true });

  if (provider) {
    return provider;
  }

  // Fallback: provider tanpa provider_type (tabel lama) yang aktif
  const legacy = await findAiProvider({ providerType: "", activeOnly: true });
  return legacy;
}

export function buildOpenAICompatibleModel({ baseUrl, apiKey, model }) {
  const provider = createOpenAICompatible({
    name: "custom-ai",
    baseURL: baseUrl,
    apiKey,
  });

  return provider(model);
}

export function buildEnvFallbackModel() {
  const provider = createOpenAICompatible({
    name: "sumopod",
    baseURL: defaultSumopodBaseURL,
    apiKey: process.env.SUMOPOD_API_KEY || "",
  });

  return provider(getEnvFallbackModel());
}

/**
 * Ambil model LLM yang dipakai AI template generator.
 * Prioritas: provider aktif di DB → fallback env SUMOPOD_*.
 * @returns {Promise<{ model: object|null, provider: object|null }>}
 */
export async function getTemplateAiModel() {
  const provider = await getActiveAiProvider();

  if (provider) {
    return {
      model: buildOpenAICompatibleModel(provider),
      provider,
    };
  }

  if (hasEnvFallback()) {
    return {
      model: buildEnvFallbackModel(),
      provider: {
        providerId: "sumopod",
        name: "SumoPod (env)",
        baseUrl: defaultSumopodBaseURL,
        model: getEnvFallbackModel(),
      },
    };
  }

  return { model: null, provider: null };
}

// ---- Replicate (image generation) ----
export function createReplicateClient(provider) {
  // Replicate memakai apiKey (token r8_...). Dynamic import agar
  // package replicate tidak ke-bundle di client.
  return import("replicate").then(({ default: Replicate }) => {
    return new Replicate({
      auth: provider.apiKey,
    });
  });
}

/**
 * Ambil provider image aktif + client Replicate.
 * @returns {Promise<{ client: object|null, provider: object|null }>}
 */
export async function getReplicateClient() {
  const provider = await getActiveImageProvider();

  if (!provider || !provider.apiKey) {
    return { client: null, provider: null };
  }

  const client = await createReplicateClient(provider);
  return { client, provider };
}
