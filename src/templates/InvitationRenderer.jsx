"use client";

import React from "react";
import { emptyInvitation } from "../data/emptyInvitation";
import UniversalTemplate from "./UniversalTemplate";

export default function InvitationRenderer({
  data = emptyInvitation,
  guestName,
  guestSlug,
  framedPreview = false,
  previewOpening = false,
  previewMode = false,
}) {
  return (
    <UniversalTemplate
      data={data}
      guestName={guestName}
      guestSlug={guestSlug}
      framedPreview={framedPreview}
      previewOpening={previewOpening}
      previewMode={previewMode}
    />
  );
}
