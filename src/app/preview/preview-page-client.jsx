"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { emptyInvitation } from "../../data/emptyInvitation";
import { previewInvitation } from "../../data/previewInvitation";
import { defaultTemplateMetadata } from "../../data/templateAdminDefaults";
import {
  InvitationErrorState,
} from "../../components/InvitationLoadingState";
import LoadingScreen from "../../templates/components/LoadingScreen";
import {
  buildReadyMessage,
  PREVIEW_MESSAGE,
  parsePreviewQuery,
  readPreviewSnapshot,
} from "../../templates/previewProtocol";
import InvitationRenderer from "../../templates/InvitationRenderer";

const IMAGE_URL_PATTERN = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const PRELOAD_TIMEOUT_MS = 8000;
const PUBLIC_PREVIEW_MIN_LOADING_MS = 700;
const DEFAULT_PREVIEW_GALLERY = [
  "/assets/CoverPasangan.png",
  "/assets/catin_wanita.jpg",
  "/assets/catin_pria.jpg",
];

// Cache template metadata (untuk preview editor) supaya reload iframe tidak
// menunggu /api/templates yang bisa lambat (Supabase). TTL pendek.
const TEMPLATE_METADATA_CACHE_KEY = "nusa-invite:preview-template-metadata";
const TEMPLATE_METADATA_CACHE_TTL_MS = 30000;

// Key cache dibedakan per scope — daftar public (active only) tidak boleh
// dipakai untuk editor preview yang butuh template hidden/draft.
function templateMetadataCacheKey(scope) {
  return `${TEMPLATE_METADATA_CACHE_KEY}:${scope || "public"}`;
}

function readTemplateMetadataCache(scope) {
  try {
    const raw = window.sessionStorage.getItem(templateMetadataCacheKey(scope));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) return null;
    return Array.isArray(parsed.data) ? parsed.data : null;
  } catch {
    return null;
  }
}

function writeTemplateMetadataCache(scope, data) {
  try {
    window.sessionStorage.setItem(
      templateMetadataCacheKey(scope),
      JSON.stringify({ data, expiresAt: Date.now() + TEMPLATE_METADATA_CACHE_TTL_MS }),
    );
  } catch {
    // ignore storage failures
  }
}

// fetch dengan timeout — API yang lambat tidak boleh menggantung preview.
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    window.clearTimeout(timer);
  }
}

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

function applyEditorPreviewSnapshot(invitation, snapshot, templateId) {
  if (!snapshot) {
    return invitation;
  }

  // Snapshot dianggap valid kalau membawa designConfig (bukan objek kosong).
  // Kalau kosong, biarkan fallback lain (override lokal / metadata) yang isi.
  const hasConfig = snapshot.designConfig && Object.keys(snapshot.designConfig).length > 0;
  if (!hasConfig) {
    return invitation;
  }

  return {
    ...invitation,
    templateId: snapshot.id || templateId || invitation.templateId,
    coverImage: snapshot.image || invitation.coverImage,
    designConfig: snapshot.designConfig || invitation.designConfig,
  };
}

async function loadPlatformPreviewSettings() {
  try {
    const response = await fetchWithTimeout("/api/settings", 10000);
    const result = await response.json();
    if (response.ok && result.data) {
      return result.data;
    }
  } catch {
    // Fall back to local settings below.
  }

  try {
    const raw = window.localStorage.getItem("nusa-invite:platform-settings");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function applyPreviewSettings(invitation, settings = {}) {
  const gallery =
    Array.isArray(settings.defaultGalleryImages) && settings.defaultGalleryImages.length > 0
      ? settings.defaultGalleryImages
      : invitation.gallery?.length
        ? invitation.gallery
        : DEFAULT_PREVIEW_GALLERY;

  const designConfig = invitation.designConfig || {};
  const sections = designConfig.sections || {};
  const widgets = designConfig.widgets || {};
  const homeSection = sections.home || {};
  const openingReveal = widgets.openingReveal || {};

  return {
    ...invitation,
    gallery,
    coverImage: settings.defaultTemplateThumbnail || invitation.coverImage,
    designConfig: {
      ...designConfig,
      sections: {
        ...sections,
        home: {
          ...homeSection,
          backgroundImage:
            homeSection.backgroundMode === "image"
              ? settings.defaultCoverBackgroundImage || homeSection.backgroundImage
              : homeSection.backgroundImage,
        },
      },
      widgets: {
        ...widgets,
        openingReveal: {
          ...openingReveal,
          coverImage:
            settings.defaultOpeningCoverImage || openingReveal.coverImage,
          backgroundImage:
            openingReveal.backgroundMode === "image"
              ? settings.defaultOpeningBackgroundImage || openingReveal.backgroundImage
              : openingReveal.backgroundImage,
        },
      },
    },
    couple: {
      ...invitation.couple,
      groomPhoto: settings.defaultGroomPhoto || invitation.couple?.groomPhoto,
      bridePhoto: settings.defaultBridePhoto || invitation.couple?.bridePhoto,
    },
  };
}

export default function PreviewPageClient() {
  const searchParams = useSearchParams();
  const previewQuery = parsePreviewQuery(searchParams);
  const {
    slug,
    templateId,
    editorPreview,
    embeddedEditorPreview,
    previewSectionOnly,
    previewFocusSection,
    mobileFramePreview,
    disableOpeningOverlay,
    previewOpening,
    previewGuest,
    previewDataMode,
  } = previewQuery;
  const framedDesktopPreview = !embeddedEditorPreview && !previewSectionOnly;
  const shouldLoadBeforeRender = Boolean(slug || templateId);
  const [data, setData] = useState(() => (
    !slug && previewDataMode !== "empty" ? previewInvitation : emptyInvitation
  ));
  const [isLoading, setIsLoading] = useState(shouldLoadBeforeRender);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  // Snapshot dari postMessage selalu lebih fresh daripada data hasil fetch —
  // dipakai untuk mencegah loadPreviewData menimpa update editor yang baru.
  const latestSnapshotRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadPreviewData = async () => {
      const loadStartedAt = Date.now();
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

      // 1) Snapshot editor (sessionStorage dulu, lalu localStorage) — paling
      //    fresh kalau ada. localStorage menangkal tab preview baru (noopener)
      //    yang tidak mewarisi sessionStorage dashboard.
      let nextData = editorPreview
        ? applyEditorPreviewSnapshot(
            previewData,
            readPreviewSnapshot(templateId),
            templateId,
          )
        : previewData;

      let templateMetadata = defaultTemplateMetadata.find(
        (template) => template.id === templateId,
      );

      if (templateId) {
        // Preview editor butuh bisa memuat template hidden/draft yang sedang
        // diedit, jadi pakai scope=admin (menyertakan hidden). Preview non-editor
        // tetap scope=public (hanya active) — template hidden tidak boleh tampil
        // publik. Kalau sesi admin tidak tersedia (401/403), fallback ke public.
        const metadataScope = editorPreview ? "admin" : "public";

        // Pakai cache sessionStorage dulu supaya reload iframe cepat; fallback
        // ke API kalau cache kosong/kedaluwarsa. Request pertama (cache kosong)
        // diberi timeout lebih panjang — Supabase bisa lambat/cold start —
        // sedangkan reload iframe berikutnya memakai cache (cepat).
        let apiTemplates = readTemplateMetadataCache(metadataScope);
        if (!apiTemplates) {
          try {
            const response = await fetchWithTimeout(
              `/api/templates?scope=${metadataScope}`,
              15000,
            );
            const result = await response.json();
            if (Array.isArray(result.data)) {
              apiTemplates = result.data;
              writeTemplateMetadataCache(metadataScope, apiTemplates);
            } else if (editorPreview) {
              // Sesi admin tidak tersedia — coba daftar aktif sebagai gantinya.
              const publicResponse = await fetchWithTimeout(
                "/api/templates?scope=public",
                15000,
              );
              const publicResult = await publicResponse.json();
              if (Array.isArray(publicResult.data)) {
                apiTemplates = publicResult.data;
                writeTemplateMetadataCache("public", apiTemplates);
              }
            }
          } catch {
            // Keep local/default metadata when API preview metadata is unavailable.
          }
        }

        if (Array.isArray(apiTemplates)) {
          templateMetadata =
            apiTemplates.find(
              (template) => template.id === templateId,
            ) || templateMetadata;
        }
      }

      // 3) Metadata API/default hanya dipakai kalau belum ada snapshot editor
      //    yang menyediakan designConfig.
      if (templateMetadata && !nextData.designConfig) {
        nextData = {
          ...nextData,
          templateId,
          coverImage: templateMetadata.image || nextData.coverImage,
          designConfig: templateMetadata.designConfig || nextData.designConfig,
        };
      }

      // Jangan pernah diam-diam render template default saat template yang
      // diminta tidak ditemukan — lebih baik tampilkan error yang jelas.
      const hasTemplateConfig =
        Boolean(templateMetadata?.designConfig) &&
        Object.keys(templateMetadata.designConfig || {}).length > 0;
      const hasSnapshotConfig =
        Boolean(nextData.designConfig) &&
        Object.keys(nextData.designConfig || {}).length > 0;

      if (templateId && !hasTemplateConfig && !hasSnapshotConfig) {
        if (isMounted) {
          setLoadError(
            editorPreview
              ? "Template tidak ditemukan. Kalau ini template baru, simpan dulu sebelum preview — datanya belum ada di server."
              : "Template tidak ditemukan atau belum aktif.",
          );
          setIsLoading(false);
        }
        return;
      }

      if (templateId && previewDataMode !== "empty") {
        nextData = applyPreviewSettings(nextData, await loadPlatformPreviewSettings());
      }

      if (previewDataMode === "empty") {
        nextData = {
          ...nextData,
          couple: {
            ...nextData.couple,
            groomName: "",
            groomNickname: "",
            groomParents: "",
            groomInstagram: "",
            brideName: "",
            brideNickname: "",
            brideParents: "",
            brideInstagram: "",
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

      if (isMounted && (slug || templateId)) {
        // Editor preview butuh responsif — lewati preload gambar & minimal
        // loading supaya hasil edit langsung nampil. Halaman publik tetap
        // pakai preload + minimal loading biar tidak kedip konten kosong.
        if (!editorPreview) {
          await preloadInvitationImages(nextData);
        }
      }

      if (isMounted) {
        const minimumLoadingMs = embeddedEditorPreview || editorPreview ? 0 : PUBLIC_PREVIEW_MIN_LOADING_MS;
        const remainingLoadingMs = minimumLoadingMs - (Date.now() - loadStartedAt);
        if (remainingLoadingMs > 0) {
          await new Promise((resolve) => {
            window.setTimeout(resolve, remainingLoadingMs);
          });
        }
      }

      if (isMounted) {
        // Snapshot postMessage (update editor real-time) lebih fresh daripada
        // hasil fetch — kalau sudah ada, jangan timpa dengan data load awal.
        const latestSnapshot = latestSnapshotRef.current;
        if (latestSnapshot && latestSnapshot.id === (templateId || nextData.templateId)) {
          setData((current) => ({
            ...current,
            templateId: latestSnapshot.id,
            coverImage: latestSnapshot.image || current.coverImage,
            designConfig: latestSnapshot.designConfig || current.designConfig,
          }));
        } else {
          setData(nextData);
        }
        setIsLoading(false);
      }
    };

    loadPreviewData();

    return () => {
      isMounted = false;
    };
  }, [editorPreview, embeddedEditorPreview, loadAttempt, previewDataMode, shouldLoadBeforeRender, slug, templateId]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      const message = event.data;
      if (!message || typeof message !== "object") {
        return;
      }
      if (message.type === PREVIEW_MESSAGE.replay) {
        window.scrollTo(0, 0);
        setReplayKey((current) => current + 1);
        return;
      }

      if (message.type !== PREVIEW_MESSAGE.update) {
        return;
      }

      const snapshot = message.payload;
      if (!snapshot || !snapshot.id) {
        return;
      }
      if (templateId && snapshot.id !== templateId) {
        return;
      }

      latestSnapshotRef.current = snapshot;
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

  useEffect(() => {
    if (isLoading || loadError || typeof window === "undefined") {
      return;
    }

    window.parent?.postMessage(
      buildReadyMessage(data.templateId),
      window.location.origin,
    );
  }, [data.templateId, isLoading, loadError, replayKey]);

  if (isLoading) {
    return (
      <LoadingScreen coverImage="" onDone={() => {}} minDuration={400} />
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
            : previewOpening
              ? "opening-only-preview-mobile"
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
          framedPreview={framedDesktopPreview || previewOpening || mobileFramePreview}
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
