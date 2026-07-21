export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;

export function validateImageUpload(file, label = "Gambar") {
  if (!file || typeof file === "string") {
    return `${label} wajib dipilih.`;
  }

  if (!file.type?.startsWith("image/")) {
    return `${label} harus berupa file gambar.`;
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return `${label} maksimal 5MB.`;
  }

  return "";
}
