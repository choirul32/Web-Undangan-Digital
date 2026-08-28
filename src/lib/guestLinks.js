// ============================================================
// Guest Links — satu-satunya pemilik aturan identitas tamu.
// Dipakai oleh GuestManager (admin), LocalGuestManager (customer),
// dan halaman publik (slug + guestSlug).
//
// URL kanonik tamu: /{invitationSlug}/to/{guestSlug} (slug-based).
// Grammar ?to={name} tetap didukung untuk link lama yang sudah
// tersebar, tapi semua link BARU dibuat slug-based.
// ============================================================

/**
 * Ubah nama tamu jadi slug (aturan sama untuk UI dan validasi API).
 */
export function createGuestSlug(name = "") {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/&/g, "dan")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Bangun URL personal tamu (slug-based).
 * @param {string} invitationSlug
 * @param {string} guestSlug
 * @param {boolean} [includeOrigin] sertakan window.location.origin
 */
export function buildGuestUrl(invitationSlug, guestSlug, includeOrigin = false) {
  const path = `/${invitationSlug}/to/${encodeURIComponent(guestSlug)}`;
  return includeOrigin && typeof window !== "undefined"
    ? `${window.location.origin}${path}`
    : path;
}

/**
 * Decode nilai query ?to= menjadi nama tamu.
 * Dipakai halaman publik yang menerima grammar ?to={name} (link lama).
 */
export function guestNameFromQuery(value = "") {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const normalizedValue = String(rawValue || "").replace(/\+/g, " ");

  try {
    return decodeURIComponent(normalizedValue).replace(/\s+/g, " ").trim();
  } catch {
    return normalizedValue.replace(/\s+/g, " ").trim();
  }
}

/**
 * Fallback: decode guestSlug jadi nama (untuk link lama yang pakai slug
 * tapi tamunya tidak ada di database — tampilkan nama yang terbaca).
 */
export function fallbackGuestFromSlug(guestSlug = "") {
  const name = decodeURIComponent(String(guestSlug || ""))
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return name ? { name, slug: guestSlug } : null;
}
