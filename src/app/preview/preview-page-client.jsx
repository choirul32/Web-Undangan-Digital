"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sampleInvitation } from "../../data/sampleInvitation";
import {
  applyStoredTemplateOverrideToInvitation,
  defaultTemplateMetadata,
  mergeTemplateOverrides,
} from "../../data/templateAdminDefaults";
import InvitationRenderer from "../../templates/InvitationRenderer";

export default function PreviewPageClient() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(sampleInvitation);
  const slug = searchParams.get("slug");
  const templateId = searchParams.get("templateId");
  const editorPreview = searchParams.get("editorPreview") === "1";
  const previewGuest = searchParams.get("previewGuest") || "";
  const previewDataMode = searchParams.get("previewDataMode") || "filled";

  useEffect(() => {
    let isMounted = true;

    const loadPreviewData = async () => {
      let draft = sampleInvitation;

      if (slug) {
        try {
          const response = await fetch(`/api/invitations/${encodeURIComponent(slug)}`);
          const result = await response.json();
          if (response.ok && result.data) {
            draft = result.data;
          }
        } catch {
          // Keep sample data if slug preview API is unavailable.
        }
      }

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

      if (previewDataMode === "empty") {
        nextData = {
          ...nextData,
          couple: {
            ...nextData.couple,
            groomName: "",
            groomNickname: "",
            brideName: "",
            brideNickname: "",
          },
          events: [],
          story: [],
          gallery: [],
          bankAccounts: [],
          guests: [],
          rsvps: [],
          coverImage: "",
          musicUrl: "",
        };
      }

      if (isMounted) {
        setData(nextData);
      }
    };

    loadPreviewData();

    return () => {
      isMounted = false;
    };
  }, [editorPreview, slug, templateId]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      const message = event.data;
      if (!message || typeof message !== "object") {
        return;
      }
      if (message.type !== "nusa-invite:editor-preview-update") {
        return;
      }

      const snapshot = message.payload;
      if (!snapshot || !snapshot.id) {
        return;
      }
      if (templateId && snapshot.id !== templateId) {
        return;
      }

      setData((current) => ({
        ...current,
        templateId: snapshot.id,
        coverImage: snapshot.image || current.coverImage,
        designConfig: snapshot.designConfig || current.designConfig,
      }));
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [templateId]);

  return (
    <InvitationRenderer
      data={data}
      guestName={previewGuest || undefined}
      guestSlug={previewGuest ? "preview-guest" : undefined}
    />
  );
}
