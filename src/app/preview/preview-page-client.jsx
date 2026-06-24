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
import {
  InvitationErrorState,
  InvitationLoadingState,
} from "../../components/InvitationLoadingState";
import InvitationRenderer from "../../templates/InvitationRenderer";

const IMAGE_URL_PATTERN = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const PRELOAD_TIMEOUT_MS = 8000;

function collectImageUrls(value, urls = new Set()) {
  if (typeof value === "string") {
    if (value.startsWith("data:image/") || IMAGE_URL_PATTERN.test(value)) {
      urls.add(value);
    }
    return urls;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectImageUrls(item, urls));
    return urls;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectImageUrls(item, urls));
  }

  return urls;
}

async function preloadInvitationImages(invitation) {
  const urls = collectImageUrls({
    coverImage: invitation.coverImage,
    gallery: invitation.gallery,
    designConfig: invitation.designConfig,
    profileImages: [
      "/assets/CoverPasangan.png",
      "/assets/catin_wanita.jpg",
      "/assets/catin_pria.jpg",
    ],
  });

  if (urls.size === 0) {
    return;
  }

  const preload = Promise.allSettled(
    [...urls].map(
      (url) =>
        new Promise((resolve) => {
          const image = new window.Image();
          image.onload = resolve;
          image.onerror = resolve;
          image.src = url;
        }),
    ),
  );
  const timeout = new Promise((resolve) => {
    window.setTimeout(resolve, PRELOAD_TIMEOUT_MS);
  });

  await Promise.race([preload, timeout]);
}

function readEditorPreviewSnapshot(templateId) {
  if (typeof window === "undefined" || !templateId) {
    return null;
  }

  try {
    const rawSnapshot = window.sessionStorage.getItem("nusa-invite:editor-preview-template");
    const snapshot = rawSnapshot ? JSON.parse(rawSnapshot) : null;

    if (snapshot?.id === templateId) {
      return snapshot;
    }
  } catch {
    return null;
  }

  return null;
}

function applyEditorPreviewSnapshot(invitation, snapshot, templateId) {
  if (!snapshot) {
    return invitation;
  }

  return {
    ...invitation,
    templateId: snapshot.id || templateId || invitation.templateId,
    coverImage: snapshot.image || invitation.coverImage,
    designConfig: snapshot.designConfig || invitation.designConfig,
  };
}

export default function PreviewPageClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const templateId = searchParams.get("templateId");
  const editorPreview = searchParams.get("editorPreview") === "1";
  const embeddedEditorPreview = searchParams.get("embeddedEditorPreview") === "1";
  const previewSectionOnly = searchParams.get("previewSectionOnly") === "1";
  const previewFocusSection = searchParams.get("focusSection") || null;
  const disableOpeningOverlay =
    searchParams.get("disableOpeningOverlay") === "1" || previewSectionOnly;
  const previewOpening = searchParams.get("previewOpening") === "1";
  const previewGuest = searchParams.get("previewGuest") || "";
  const previewDataMode = searchParams.get("previewDataMode") || "filled";
  const framedDesktopPreview = !embeddedEditorPreview && !previewSectionOnly;
  const shouldLoadBeforeRender = Boolean(slug || (editorPreview && templateId));
  const [data, setData] = useState(() => (
    !slug && previewDataMode !== "empty" ? previewInvitation : emptyInvitation
  ));
  const [isLoading, setIsLoading] = useState(shouldLoadBeforeRender);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadPreviewData = async () => {
      if (shouldLoadBeforeRender) {
        setIsLoading(true);
        setLoadError("");
      }

      let draft = slug ? emptyInvitation : previewInvitation;
      let foundSlugData = !slug;

      if (slug) {
        try {
          const adminResponse = await fetch(
            `/api/invitations/${encodeURIComponent(slug)}`,
          );
          const adminResult = await adminResponse.json();

          if (adminResponse.ok && adminResult.data) {
            draft = adminResult.data;
            foundSlugData = true;
          } else {
            const publicResponse = await fetch(
              `/api/public/invitations/${encodeURIComponent(slug)}`,
            );
            const publicResult = await publicResponse.json();

            if (publicResponse.ok && publicResult.data) {
              draft = publicResult.data;
              foundSlugData = true;
            }
          }
        } catch (error) {
          if (isMounted) {
            setLoadError(error.message || "Gagal memuat data undangan.");
          }
        }
      }

      if (slug && !foundSlugData) {
        if (isMounted) {
          setLoadError("Data undangan tidak ditemukan atau belum dapat dimuat.");
          setIsLoading(false);
        }
        return;
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
        nextData = applyEditorPreviewSnapshot(
          nextData,
          readEditorPreviewSnapshot(templateId),
          templateId,
        );
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
        if (slug) {
          await preloadInvitationImages(nextData);
        }
      }

      if (isMounted) {
        setData(nextData);
        setIsLoading(false);
      }
    };

    loadPreviewData();

    return () => {
      isMounted = false;
    };
  }, [editorPreview, loadAttempt, previewDataMode, shouldLoadBeforeRender, slug, templateId]);

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

  if (isLoading) {
    return (
      <InvitationLoadingState description="Memuat data, desain, dan gambar undangan." />
    );
  }

  if (loadError) {
    return (
      <InvitationErrorState
        title="Preview belum bisa dimuat"
        description={loadError}
        actionLabel="Coba Lagi"
        onAction={() => setLoadAttempt((current) => current + 1)}
      />
    );
  }

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
            : previewSectionOnly
              ? "section-only-preview-mobile"
            : ""
        }
      >
        <InvitationRenderer
          key={replayKey}
          data={data}
          guestName={previewGuest || undefined}
          guestSlug={previewGuest ? "preview-guest" : undefined}
          framedPreview={framedDesktopPreview || previewOpening}
          previewOpening={previewOpening}
          previewMode={!slug && previewDataMode !== "empty"}
          previewSectionOnly={previewSectionOnly}
          previewFocusSection={previewFocusSection}
          disableOpeningOverlay={disableOpeningOverlay}
        />
      </div>
    </div>
  );
}
