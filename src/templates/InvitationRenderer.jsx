"use client";

import React from "react";
import { sampleInvitation } from "../data/sampleInvitation";
import UniversalTemplate from "./UniversalTemplate";

export default function InvitationRenderer({
  data = sampleInvitation,
  guestName,
  guestSlug,
}) {
  return <UniversalTemplate data={data} guestName={guestName} guestSlug={guestSlug} />;
}
