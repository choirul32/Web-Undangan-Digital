"use client";

import { useEffect, useState } from "react";
import { sampleInvitation } from "../../data/sampleInvitation";
import { applyStoredTemplateOverrideToInvitation } from "../../data/templateAdminDefaults";
import InvitationRenderer from "../../templates/InvitationRenderer";

export default function DemoTemplateClient({ templateId, guestName, coverImage }) {
  const [data, setData] = useState({
    ...sampleInvitation,
    templateId,
    coverImage,
  });

  useEffect(() => {
    setData(
      applyStoredTemplateOverrideToInvitation({
        ...sampleInvitation,
        templateId,
        coverImage,
      }),
    );
  }, [coverImage, templateId]);

  return <InvitationRenderer data={data} guestName={guestName} />;
}
