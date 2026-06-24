"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug, guestSlug = "" }) {
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/invitations/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "track_view", guestSlug: guestSlug || undefined }),
    }).catch(() => {});
  }, [slug, guestSlug]);

  return null;
}
