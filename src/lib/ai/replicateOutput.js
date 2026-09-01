// ============================================================
// Helper ekstrak URL gambar dari output Replicate.
// Bentuk output beda-beda per model:
//   - string URL            (flux-1.1-pro, flux-2-pro, remove-bg)
//   - array of URL          (flux-schnell: ["https://..."])
//   - nested array          (beberapa model: [["https://..."]])
//   - object { url }        (jarang)
// ============================================================

export function extractReplicateOutputUrl(output) {
  if (!output) return "";

  // String URL langsung
  if (typeof output === "string") {
    return output.trim();
  }

  // Array — cari elemen pertama yang berupa URL (bisa nested)
  if (Array.isArray(output)) {
    for (const item of output) {
      const url = extractReplicateOutputUrl(item);
      if (url) return url;
    }
    return "";
  }

  // Object dengan field url
  if (typeof output === "object" && typeof output.url === "string") {
    return output.url.trim();
  }

  return "";
}
