"use client";

import React from "react";
import { sampleInvitation } from "../data/sampleInvitation";
import { getTemplateById } from "./templateRegistry";

export default function InvitationRenderer({
  data = sampleInvitation,
  guestName,
  guestSlug,
}) {
  const template = getTemplateById(data.templateId);
  const Template = template.component;

  return <Template data={data} guestName={guestName} guestSlug={guestSlug} />;
}
