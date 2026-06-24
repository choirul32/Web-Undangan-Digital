/**
 * Default template thumbnail resolution.
 *
 * Admin can configure a default thumbnail in Settings (`defaultTemplateThumbnail`).
 * It is used as the fallback image whenever a template has no thumbnail of its own.
 * Settings are persisted client-side under the platform-settings localStorage key
 * (same source as `packagePrices` on the landing page), so this reader stays in sync
 * without needing the admin-only `/api/settings` endpoint.
 */

export const FALLBACK_TEMPLATE_THUMBNAIL = "/assets/CoverPasangan.png";

const SETTINGS_STORAGE_KEY = "nusa-invite:platform-settings";

export function readDefaultTemplateThumbnail() {
  if (typeof window === "undefined") {
    return FALLBACK_TEMPLATE_THUMBNAIL;
  }

  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) {
      return FALLBACK_TEMPLATE_THUMBNAIL;
    }

    const parsed = JSON.parse(stored);
    const value = parsed?.defaultTemplateThumbnail;
    return typeof value === "string" && value.trim()
      ? value.trim()
      : FALLBACK_TEMPLATE_THUMBNAIL;
  } catch {
    return FALLBACK_TEMPLATE_THUMBNAIL;
  }
}
