"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getStoredInvitationDraft, sampleInvitation } from "../../data/sampleInvitation";
import {
  applyStoredTemplateOverrideToInvitation,
  defaultTemplateMetadata,
  mergeTemplateOverrides,
} from "../../data/templateAdminDefaults";
import InvitationRenderer from "../../templates/InvitationRenderer";

export default function PreviewPageClient() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(sampleInvitation);
  const templateId = searchParams.get("templateId");
  const editorPreview = searchParams.get("editorPreview") === "1";

  useEffect(() => {
    let isMounted = true;

    const loadPreviewData = async () => {
      const draft = getStoredInvitationDraft() || sampleInvitation;
      const previewData = templateId
        ? {
            ...sampleInvitation,
            ...draft,
            templateId,
          }
        : draft;
      let nextData = applyStoredTemplateOverrideToInvitation(previewData);
      let templateMetadata = mergeTemplateOverrides(defaultTemplateMetadata).find(
        (template) => template.id === templateId,
      );

      if (templateId) {
        try {
          const response = await fetch("/api/templates?scope=admin");
          const result = await response.json();
          if (Array.isArray(result.data)) {
            templateMetadata =
              mergeTemplateOverrides(result.data).find(
                (template) => template.id === templateId,
              ) || templateMetadata;
          }
        } catch {
          // Keep local/default metadata when API preview metadata is unavailable.
        }
      }

      if (templateMetadata) {
        nextData = {
          ...nextData,
          templateId,
          coverImage: templateMetadata.image || nextData.coverImage,
          designConfig: templateMetadata.designConfig || nextData.designConfig,
        };
      }

      if (editorPreview && templateId) {
        try {
          const rawSnapshot = window.sessionStorage.getItem("nusa-invite:editor-preview-template");
          const snapshot = rawSnapshot ? JSON.parse(rawSnapshot) : null;
          if (snapshot?.id === templateId) {
            nextData = {
              ...nextData,
              templateId,
              coverImage: snapshot.image || nextData.coverImage,
              designConfig: snapshot.designConfig || nextData.designConfig,
            };
          }
        } catch {
          // ignore session parse errors and use saved preview data
        }
      }

      if (isMounted) {
        setData(nextData);
      }
    };

    loadPreviewData();

    return () => {
      isMounted = false;
    };
  }, [editorPreview, templateId]);

  return <InvitationRenderer data={data} />;
}
