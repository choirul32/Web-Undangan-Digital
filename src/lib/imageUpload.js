export const MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024;

const IMAGE_PRESETS = {
  default: { maxWidth: 1400, maxHeight: 1400, quality: 0.82 },
  cover: { maxWidth: 1600, maxHeight: 2200, quality: 0.82 },
  opening: { maxWidth: 1600, maxHeight: 2200, quality: 0.84 },
  gallery: { maxWidth: 1400, maxHeight: 1400, quality: 0.8 },
  portrait: { maxWidth: 900, maxHeight: 1200, quality: 0.82 },
  qris: { maxWidth: 1100, maxHeight: 1100, quality: 0.94 },
  logo: { maxWidth: 700, maxHeight: 700, quality: 0.9 },
  ornament: { maxWidth: 1600, maxHeight: 1600, quality: 0.9 },
  thumbnail: { maxWidth: 1200, maxHeight: 900, quality: 0.82 },
};

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

function isCompressibleImage(file) {
  return (
    file?.type?.startsWith("image/") &&
    !["image/svg+xml", "image/gif"].includes(file.type)
  );
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gambar tidak bisa dibaca."));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

function getTargetSize(width, height, preset) {
  const ratio = Math.min(1, preset.maxWidth / width, preset.maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

function withExtension(filename = "image", extension = "webp") {
  return `${filename.replace(/\.[^.]+$/, "") || "image"}.${extension}`;
}

export async function prepareImageForUpload(file, presetName = "default") {
  if (!file) {
    return { file, changed: false, message: "" };
  }

  if (!file.type?.startsWith("image/")) {
    return { file, changed: false, message: "" };
  }

  if (!isCompressibleImage(file)) {
    if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
      throw new Error(`Ukuran gambar maksimal 5MB. File saat ini ${formatMb(file.size)}.`);
    }

    return { file, changed: false, message: "" };
  }

  const preset = IMAGE_PRESETS[presetName] || IMAGE_PRESETS.default;
  const image = await loadImage(file);
  const target = getTargetSize(image.naturalWidth || image.width, image.naturalHeight || image.height, preset);
  const canvas = document.createElement("canvas");
  canvas.width = target.width;
  canvas.height = target.height;

  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, target.width, target.height);

  let quality = preset.quality;
  let blob = await canvasToBlob(canvas, "image/webp", quality);

  while (blob && blob.size > MAX_IMAGE_UPLOAD_SIZE && quality > 0.55) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, "image/webp", quality);
  }

  if (!blob) {
    throw new Error("Gagal mengoptimalkan gambar.");
  }

  if (blob.size > MAX_IMAGE_UPLOAD_SIZE) {
    throw new Error(`Gambar masih terlalu besar setelah dikompres (${formatMb(blob.size)}).`);
  }

  const optimizedFile = new File([blob], withExtension(file.name), {
    type: "image/webp",
    lastModified: Date.now(),
  });

  return {
    file: optimizedFile,
    changed:
      optimizedFile.size < file.size ||
      target.width !== (image.naturalWidth || image.width) ||
      target.height !== (image.naturalHeight || image.height),
    message:
      optimizedFile.size < file.size
        ? `Gambar dioptimalkan dari ${formatMb(file.size)} ke ${formatMb(optimizedFile.size)}.`
        : "",
  };
}
