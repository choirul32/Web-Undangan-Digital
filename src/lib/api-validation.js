export function cleanString(value, { max = 255 } = {}) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, max);
}

export function cleanSlug(value) {
  return cleanString(value, { max: 120 })
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function cleanPax(value) {
  const parsed = Number(value || 1);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.min(Math.max(Math.floor(parsed), 1), 20);
}

export function validateRsvpPayload(payload = {}) {
  const invitationSlug = cleanSlug(payload.invitationSlug);
  const guestSlug = cleanSlug(payload.guestSlug);
  const guestName = cleanString(payload.guestName, { max: 120 });
  const attendance = cleanString(payload.attendance, { max: 20 });
  const message = cleanString(payload.message, { max: 500 });
  const pax = cleanPax(payload.pax);
  const errors = [];

  if (!invitationSlug) {
    errors.push("invitationSlug wajib diisi.");
  }

  if (!guestName) {
    errors.push("guestName wajib diisi.");
  }

  if (!["hadir", "tidak_hadir"].includes(attendance)) {
    errors.push("attendance harus bernilai hadir atau tidak_hadir.");
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      invitationSlug,
      guestSlug,
      guestName,
      attendance,
      pax,
      message,
    },
  };
}
