export const wishStickerOptions = [
  { id: "barakallah", label: "Barakallah", icon: "\uD83C\uDF3F" },
  { id: "aamiin", label: "Aamiin", icon: "\uD83E\uDD32" },
  { id: "happy-wedding", label: "Happy Wedding", icon: "\uD83D\uDC8D" },
  { id: "samawa", label: "Samawa", icon: "\u2728" },
  { id: "best-couple", label: "Best Couple", icon: "\uD83D\uDC95" },
];

export const wishReactionOptions = [
  { id: "like", label: "Suka", icon: "\uD83D\uDC4D" },
  { id: "love", label: "Cinta", icon: "\u2764\uFE0F" },
  { id: "hug", label: "Terharu", icon: "\uD83E\uDD70" },
  { id: "happy", label: "Bahagia", icon: "\uD83D\uDE04" },
  { id: "wow", label: "Wah", icon: "\uD83D\uDE2E" },
  { id: "sad", label: "Haru", icon: "\uD83E\uDD72" },
  { id: "aamiin", label: "Aamiin", icon: "\uD83E\uDD32" },
];

const stickerPattern = /^\[wish-sticker:([a-z0-9-]+)\]\s*/;

export function getWishSticker(stickerId = "") {
  return wishStickerOptions.find((sticker) => sticker.id === stickerId) || null;
}

export function encodeWishMessage(message = "", stickerId = "") {
  const cleanMessage = String(message || "").trim();
  const sticker = getWishSticker(stickerId);

  if (!sticker) {
    return cleanMessage;
  }

  return `[wish-sticker:${sticker.id}] ${cleanMessage}`.trim();
}

export function decodeWishMessage(message = "") {
  const rawMessage = String(message || "").trim();
  const match = rawMessage.match(stickerPattern);
  const sticker = match ? getWishSticker(match[1]) : null;

  return {
    sticker,
    message: sticker ? rawMessage.replace(stickerPattern, "").trim() : rawMessage,
  };
}
