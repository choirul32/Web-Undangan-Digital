"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { emptyInvitation } from "../../data/emptyInvitation";
import { previewInvitation } from "../../data/previewInvitation";
import {
  applyStoredTemplateOverrideToInvitation,
  defaultTemplateMetadata,
  mergeTemplateOverrides,
} from "../../data/templateAdminDefaults";
import InvitationRenderer from "../../templates/InvitationRenderer";

export default function PreviewPageClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const templateId = searchParams.get("templateId");
  const editorPreview = searchParams.get("editorPreview") === "1";
  const embeddedEditorPreview = searchParams.get("embeddedEditorPreview") === "1";
  const previewSectionOnly = searchParams.get("previewSectionOnly") === "1";
  const previewGuest = searchParams.get("previewGuest") || "";
  const previewDataMode = searchParams.get("previewDataMode") || "filled";
  const framedDesktopPreview = !embeddedEditorPreview && !previewSectionOnly;
  const [data, setData] = useState(() => (
    !slug && previewDataMode !== "empty" ? previewInvitation : emptyInvitation
  ));
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadPreviewData = async () => {
      let draft = slug ? emptyInvitation : previewInvitation;

      if (slug) {
        try {
          const response = await fetch(`/api/invitations/${encodeURIComponent(slug)}`);
          const result = await response.json();
          if (response.ok && result.data) {
            draft = result.data;
          }
        } catch {
          // Keep the blank draft if slug preview API is unavailable.
        }
      }

      const previewData = templateId
        ? {
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
            groomParents: "",
            brideName: "",
            brideNickname: "",
            brideParents: "",
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
  }, [editorPreview, previewDataMode, slug, templateId]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      const message = event.data;
      if (!message || typeof message !== "object") {
        return;
      }
      if (message.type === "nusa-invite:editor-preview-replay") {
        window.scrollTo(0, 0);
        setReplayKey((current) => current + 1);
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
    <div
      className={
        framedDesktopPreview
          ? "min-h-screen bg-[#e8edf2] lg:px-8"
          : ""
      }
    >
      <div
        className={
          framedDesktopPreview
            ? "mx-auto min-h-screen w-full overflow-hidden bg-[var(--color-bg)] lg:min-h-[915px] lg:max-w-[412px] lg:border-x lg:border-black/10 lg:shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
            : ""
        }
      >
        <InvitationRenderer
          key={replayKey}
          data={data}
          guestName={previewGuest || undefined}
          guestSlug={previewGuest ? "preview-guest" : undefined}
          framedPreview={framedDesktopPreview}
        />
      </div>
    </div>
  );
}
