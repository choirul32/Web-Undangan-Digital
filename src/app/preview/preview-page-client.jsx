"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getStoredInvitationDraft, sampleInvitation } from "../../data/sampleInvitation";
import { applyStoredTemplateOverrideToInvitation } from "../../data/templateAdminDefaults";
import InvitationRenderer from "../../templates/InvitationRenderer";

export default function PreviewPageClient() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(sampleInvitation);
  const templateId = searchParams.get("templateId");

  useEffect(() => {
    const draft = getStoredInvitationDraft() || sampleInvitation;
    const previewData = templateId
      ? {
          ...sampleInvitation,
          ...draft,
          templateId,
        }
      : draft;

    setData(applyStoredTemplateOverrideToInvitation(previewData));
  }, [templateId]);

  return <InvitationRenderer data={data} />;
}
