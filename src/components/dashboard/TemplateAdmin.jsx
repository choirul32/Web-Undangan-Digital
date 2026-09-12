"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import InvitationRenderer from "../../templates/InvitationRenderer";
import {
  buildPreviewSnapshot,
  buildPreviewUrl,
  buildSnapshotMessage,
  clearPreviewSnapshot,
  persistPreviewSnapshot,
  PREVIEW_MESSAGE,
} from "../../templates/previewProtocol";
import {
  defaultGiftWidgetConfig,
  defaultRsvpWidgetConfig,
  getCountdownWidgetConfig,
  getCoupleSectionConfig,
  getCoverSectionConfig,
  getEventWidgetConfig,
  getGalleryWidgetConfig,
  getMusicWidgetConfig,
  getOpeningRevealConfig,
  getOpeningSequenceConfig,
  getSectionStyleConfig,
  getStoryWidgetConfig,
  normalizeDesignConfig,
} from "../../templates/designConfigs";
import {
  templates,
  fadeUp,
  templateStylePresets,
  smartThemeConcepts,
  templatePreviewViewports,
  templateCategoryOptions,
  templateBadgeOptions,
  templateCategories,
  ornamentSlots,
  ornamentObjectFitOptions,
  ornamentAnimationOptions,
  ornamentLoopModeOptions,
  ornamentExitAnimationOptions,
  ornamentParallaxOptions,
  ornamentParallaxDirectionOptions,
  ornamentEntranceOptions,
  ornamentTimelineTrackOptions,
  ornamentMaxRasterFileSize,
  countdownVariantOptions,
  eventVariantOptions,
  storyVariantOptions,
  storyAnimationOptions,
  galleryVariantOptions,
  coverLayoutOptions,
  coverDateVariantOptions,
  coverOpeningAnimationOptions,
  openingRevealAnimationOptions,
  openingSequencePresetOptions,
  openingRevealBackgroundModeOptions,
  coverBackgroundModeOptions,
  couplePhotoStyleOptions,
  coupleFontPresetOptions,
  sectionFontPresetOptions,
  sectionSpacingPresetOptions,
  sectionEntranceOptions,
  sectionAnimationPresets,
  headingFontOptions,
  bodyFontOptions,
  colorPalettePresets,
  standardTemplateSections,
  templateSectionPresets,
  mapDesignSectionToPreviewSection,
  musicVariantOptions,
  musicPositionOptions,
  musicPulseIntensityOptions,
} from "./config";
import {
  ConfirmationModal,
  DashboardButton,
  Field,
  SelectInput,
  StatusToast,
  TextInput,
  ToggleField,
} from "./FormControls";
import {
  readFileAsDataUrl,
  parseOrnamentSize,
  slugifyTemplateId,
  slugifyTemplateIdLive,
} from "./WidgetPreviews";
import OrnamentLayerPanel from "./template-admin/OrnamentLayerPanel";
import OrnamentPropertiesPanel from "./template-admin/OrnamentPropertiesPanel";
import OrnamentTimelinePanel from "./template-admin/OrnamentTimelinePanel";
import OrnamentCanvasPanel from "./template-admin/OrnamentCanvasPanel";
import useDesignConfig from "./template-admin/useDesignConfig";
import StepNavigator from "./template-admin/StepNavigator";
import PublishStepPanel from "./template-admin/PublishStepPanel";
import TemplateSaveBar from "./template-admin/TemplateSaveBar";
import MetadataStep from "./template-admin/MetadataStep";
import CoverStep from "./template-admin/CoverStep";
import WidgetsStep from "./template-admin/WidgetsStep";
import TemplateCatalogGrid from "./template-admin/TemplateCatalogGrid";
import OpeningStep from "./template-admin/OpeningStep";
import GlobalStyleStep from "./template-admin/GlobalStyleStep";
import AiTemplateGenerator from "./template-admin/AiTemplateGenerator";
import useOrnamentTimelineInteractions from "../../hooks/dashboard/useOrnamentTimelineInteractions";
import { prepareImageForUpload } from "../../lib/imageUpload";
import { applyPaletteToDesignConfig, paletteToSectionColors } from "../../lib/applyPalette";
import { contrastRatio } from "../../lib/colorUtils";

function isMissingAssetPath(src = "") {
  if (!src) {
    return true;
  }

  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) {
    return false;
  }

  return !src.startsWith("/");
}

export default
function TemplateAdminPage() {
  const editorSteps = [
    { id: 1, label: "Metadata" },
    { id: 2, label: "AI Generator" },
    { id: 3, label: "Gaya Global" },
    { id: 4, label: "Cover" },
    { id: 5, label: "Pembuka" },
    { id: 6, label: "Widget" },
    { id: 7, label: "Ornamen" },
    { id: 8, label: "Pratinjau" },
    { id: 9, label: "Publikasi" },
  ];
  const [items, setItems] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [templateDraft, setTemplateDraft] = useState(null);
  const [activeDesignSection, setActiveDesignSection] = useState("home");
  const [selectedOrnamentIndex, setSelectedOrnamentIndex] = useState(0);
  const [managerMessage, setManagerMessage] = useState("");
  const [templateSource, setTemplateSource] = useState("registry");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [deleteTemplateTarget, setDeleteTemplateTarget] = useState(null);
  const [isDeletingTemplate, setIsDeletingTemplate] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  // Palet custom dari Supabase (hasil "Buat palet dengan AI" / simpan manual).
  const [customPalettes, setCustomPalettes] = useState([]);
  const [isAiGeneratingPalette, setIsAiGeneratingPalette] = useState(false);
  const [paletteGenerateError, setPaletteGenerateError] = useState("");

  // Muat palet custom dari Supabase sekali saat halaman editor dibuka.
  useEffect(() => {
    let isMounted = true;
    fetch("/api/palettes")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setCustomPalettes(result.data);
        }
      })
      .catch(() => {
        // ignore — daftar palet custom kosong, preset statis tetap tampil.
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Daftar palet yang ditampilkan = preset statis + custom dari DB.
  const allPalettes = useMemo(
    () => [
      ...colorPalettePresets.map((palette) => ({
        ...palette,
        source: "preset",
      })),
      ...customPalettes,
    ],
    [customPalettes],
  );

  const handleAiGeneratedPalette = async (prompt) => {
    setIsAiGeneratingPalette(true);
    setPaletteGenerateError("");
    try {
      const response = await fetch("/api/palettes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal membuat palet.");
      }
      const palette = result.data;
      setCustomPalettes((current) => [palette, ...current]);
      applyColorPalette(palette);
      setManagerMessage(`Palet "${palette.label}" dibuat AI & diterapkan.`);
      notifySave(`Palet "${palette.label}" dibuat AI & diterapkan.`, "success");
    } catch (error) {
      setPaletteGenerateError(error.message || "Gagal membuat palet.");
      setManagerMessage(error.message || "Gagal membuat palet.");
      notifySave(error.message || "Gagal membuat palet.", "error");
    } finally {
      setIsAiGeneratingPalette(false);
    }
  };

  const handleDeletePalette = async (palette) => {
    if (!palette?.id) return;
    try {
      const response = await fetch("/api/palettes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paletteId: palette.id }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus palet.");
      }
      setCustomPalettes((current) =>
        current.filter((item) => item.id !== palette.id),
      );
      setManagerMessage(`Palet "${palette.label}" dihapus.`);
    } catch (error) {
      setManagerMessage(error.message || "Gagal menghapus palet.");
    }
  };

  // Beri tahu fetch mount (yang bisa lambat) bahwa daftar template sudah
  // berubah lewat aksi user — supaya hasilnya tidak menimpa save/delete.
  const markItemsChanged = () => {
    window.dispatchEvent(new window.Event("template-admin-items-changed"));
    try {
      window.sessionStorage.removeItem("nusa-invite:admin-template-cache");
    } catch {
      // ignore storage failures
    }
  };

  // Notifikasi simpan yang selalu terlihat (toast pojok kanan bawah).
  const [saveFeedback, setSaveFeedback] = useState(null);
  const saveFeedbackTimerRef = useRef(null);
  const notifySave = (text, tone = "info") => {
    if (saveFeedbackTimerRef.current) {
      window.clearTimeout(saveFeedbackTimerRef.current);
    }
    setSaveFeedback({ text, tone });
    saveFeedbackTimerRef.current = window.setTimeout(() => {
      setSaveFeedback(null);
      saveFeedbackTimerRef.current = null;
    }, 4500);
  };
  const dismissSaveFeedback = () => {
    if (saveFeedbackTimerRef.current) {
      window.clearTimeout(saveFeedbackTimerRef.current);
      saveFeedbackTimerRef.current = null;
    }
    setSaveFeedback(null);
  };

  // Cek apakah id template sudah dipakai template lain di daftar lokal.
  // Dipakai untuk memastikan id template baru selalu unik meski fetch katalog
  // belum selesai (daftar dari Supabase satu-satunya sumber kebenaran).
  const isTemplateIdTaken = useCallback(
    (candidateId, excludeId = null) => {
      if (!candidateId) return true;
      return items.some((item) => item.id === candidateId && item.id !== excludeId);
    },
    [items],
  );

  const buildUniqueTemplateId = useCallback(
    (baseId, excludeId = null) => {
      const slugged = slugifyTemplateId(baseId) || "template-baru";
      if (!isTemplateIdTaken(slugged, excludeId)) {
        return slugged;
      }
      let counter = 2;
      let nextId = `${slugged}-${counter}`;
      while (isTemplateIdTaken(nextId, excludeId)) {
        counter += 1;
        nextId = `${slugged}-${counter}`;
      }
      return nextId;
    },
    [isTemplateIdTaken],
  );
  const [isUploadingOrnament, setIsUploadingOrnament] = useState(false);
  const [dynamicOrnamentAssets, setDynamicOrnamentAssets] = useState([]);
  const [isLoadingOrnamentAssets, setIsLoadingOrnamentAssets] = useState(false);
  const [previewViewport, setPreviewViewport] = useState("mobile");
  const [previewGuestMode, setPreviewGuestMode] = useState("withGuest");
  const [previewDataMode, setPreviewDataMode] = useState("filled");
  const [templatePreviewTick, setTemplatePreviewTick] = useState(0);
  const [uploadValidationWarning, setUploadValidationWarning] = useState("");
  const [selectedTemplatePreset, setSelectedTemplatePreset] = useState(templateStylePresets[0].id);
  const [selectedThemeConcept, setSelectedThemeConcept] = useState(smartThemeConcepts[0].id);
  const [editorStep, setEditorStep] = useState(1);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [previewEntranceKey, setPreviewEntranceKey] = useState(0);
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [timelineSnapEnabled, setTimelineSnapEnabled] = useState(true);
  const [timelineSnapUnit, setTimelineSnapUnit] = useState(0.5);
  const [timelineInteraction, setTimelineInteraction] = useState(null);
  const [ornamentSearchQuery, setOrnamentSearchQuery] = useState("");
  const timelineContainerRef = useRef(null);
  const fullPreviewIframeRef = useRef(null);
  const savingRef = useRef(false);
  const editorStepIds = editorSteps.map((step) => step.id);
  const currentStepIndex = Math.max(0, editorStepIds.indexOf(editorStep));
  const totalEditorSteps = editorSteps.length;
  const currentStepNumber = currentStepIndex + 1;
  const previousStepId = currentStepIndex > 0 ? editorStepIds[currentStepIndex - 1] : null;
  const nextStepId =
    currentStepIndex < totalEditorSteps - 1 ? editorStepIds[currentStepIndex + 1] : null;

  const {
    designConfigText,
    setDesignConfigText,
    parsedDesignConfig,
    writeDesignConfig,
    patchWidget,
    patchSection,
    patchGlobalSectionStyle,
    patchSectionAnimation,
    patchOrnament,
    patchOrnamentAtIndex,
    patchOrnaments,
    toggleGlobalOrnamentExclusion,
    patchOpeningSequenceAsset,
    writeDesignConfigPreset,
  } = useDesignConfig({
    activeDesignSection,
    selectedOrnamentIndex,
    setManagerMessage,
  });

  useEffect(() => {
    let isMounted = true;
    let isStale = false;
    // Kalau user sudah save/ubah daftar sebelum fetch mount selesai, jangan
    // timpa — fetch yang lambat bisa membawa data lama (tanpa template yang
    // baru disimpan) dan membuat hasil save "hilang" dari katalog.
    const markDirty = () => {
      isStale = true;
    };
    window.addEventListener("template-admin-items-changed", markDirty);
    setIsLoadingTemplates(true);

    // Bersihkan sisa override template lama dari localStorage (mekanisme sudah
    // dihapus — data template hanya dari Supabase). Ini mencegah "template
    // hantu" dari versi sebelumnya tetap muncul.
    try {
      window.localStorage.removeItem("nusa-invite:template-overrides");
      window.localStorage.removeItem("nusa-invite:deleted-template-ids");
    } catch {
      // ignore storage access issues
    }

    // Cache katalog di sessionStorage (TTL pendek) supaya halaman dashboard
    // langsung punya daftar template — penting agar "Tambah Template" tidak
    // memakai id yang sudah ada di Supabase saat fetch masih berjalan lambat.
    const ADMIN_TEMPLATES_CACHE_KEY = "nusa-invite:admin-template-cache";
    const loadFromCache = () => {
      try {
        const raw = window.sessionStorage.getItem(ADMIN_TEMPLATES_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) return null;
        return Array.isArray(parsed.data) ? parsed.data : null;
      } catch {
        return null;
      }
    };
    const writeCache = (data) => {
      try {
        window.sessionStorage.setItem(
          ADMIN_TEMPLATES_CACHE_KEY,
          JSON.stringify({ data, expiresAt: Date.now() + 30000 }),
        );
      } catch {
        // ignore storage failures
      }
    };

    const cachedData = loadFromCache();
    if (Array.isArray(cachedData) && cachedData.length > 0 && !isStale) {
      setItems((currentItems) =>
        cachedData.map((template) => {
          const registryTemplate =
            currentItems.find((item) => item.id === template.id) ||
            templates.find((item) => item.id === template.id) ||
            {};
          return {
            ...registryTemplate,
            ...template,
            image: template.image || registryTemplate.image,
            previewUrl: template.previewUrl || registryTemplate.previewUrl || "/preview",
            supportedFeatures:
              template.supportedFeatures || registryTemplate.supportedFeatures || [],
          };
        }),
      );
      setIsLoadingTemplates(false);
    }

    fetch("/api/templates?scope=admin")
      .then((response) => response.json())
      .then((result) => {
        if (!isMounted || isStale) {
          return;
        }

        if (Array.isArray(result.data)) {
          writeCache(result.data);
          setItems((currentItems) =>
            result.data.map((template) => {
              const registryTemplate =
                currentItems.find((item) => item.id === template.id) ||
                templates.find((item) => item.id === template.id) ||
                {};

              return {
                ...registryTemplate,
                ...template,
                image: template.image || registryTemplate.image,
                previewUrl: template.previewUrl || registryTemplate.previewUrl || "/preview",
                supportedFeatures:
                  template.supportedFeatures || registryTemplate.supportedFeatures || [],
              };
            }),
          );
          setTemplateSource(result.source || "api");
          return;
        }

        setItems([]);
      })
      .catch(() => {
        if (isMounted && !isStale) {
          setItems([]);
          setTemplateSource("api_error");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingTemplates(false);
        }
      });

    return () => {
      isMounted = false;
      window.removeEventListener("template-admin-items-changed", markDirty);
    };
  }, []);

  useEffect(() => {
    if (!templateDraft?.id) {
      setDynamicOrnamentAssets([]);
      return undefined;
    }

    let isMounted = true;
    setIsLoadingOrnamentAssets(true);

    fetch(`/api/templates/ornaments/upload?templateId=${encodeURIComponent(templateDraft.id)}&scope=all`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setDynamicOrnamentAssets(
            result.data.map((asset) => ({
              ...asset,
              isCurrentTemplate: !asset.templateId || asset.templateId === templateDraft.id,
            })),
          );
        }
      })
      .catch(() => {
        if (isMounted) {
          setDynamicOrnamentAssets([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingOrnamentAssets(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [templateDraft?.id]);

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((template) => {
      const matchesCategory =
        activeCategory === "Semua" || template.category === activeCategory;
      const matchesStatus = statusFilter === "all" || template.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        template.name.toLowerCase().includes(normalizedQuery) ||
        template.id.toLowerCase().includes(normalizedQuery) ||
        template.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesStatus && matchesQuery;
    });
  }, [activeCategory, items, query, statusFilter]);

  const counts = useMemo(
    () => ({
      total: items.length,
      active: items.filter((template) => template.status === "active").length,
      hidden: items.filter((template) => template.status === "hidden").length,
    }),
    [items],
  );

  const designSectionNames = useMemo(() => {
    const names = Array.from(
      new Set([
        ...standardTemplateSections,
        "opening",
        "global",
        ...Object.keys(parsedDesignConfig?.ornaments || {}),
        ...Object.keys(parsedDesignConfig?.sections || {}),
      ]),
    );
    return names.length > 0 ? names : ["home"];
  }, [parsedDesignConfig]);

  const activeOrnaments = parsedDesignConfig?.ornaments?.[activeDesignSection] || [];
  const selectedOrnament =
    activeOrnaments[selectedOrnamentIndex] || activeOrnaments[0] || null;
  const activePreviewViewport =
    templatePreviewViewports[previewViewport] || templatePreviewViewports.mobile;
  const validationWarnings = useMemo(() => {
    if (!templateDraft || !parsedDesignConfig) {
      return [];
    }

    const warnings = [];
    const presetSections = templateSectionPresets[templateDraft.id] || [];
    const animatedOrnaments = activeOrnaments.filter(
      (ornament) =>
        ornament.animation && ornament.animation !== "none" ||
        ornament.entrance && ornament.entrance !== "none",
    );

    if (activeOrnaments.length > 12) {
      warnings.push(
        `Section "${activeDesignSection}" punya ${activeOrnaments.length} ornament. Pertimbangkan kurangi ke 12 atau kurang agar mobile tetap ringan.`,
      );
    }

    if (animatedOrnaments.length > 5) {
      warnings.push(
        `Section "${activeDesignSection}" punya ${animatedOrnaments.length} ornament bergerak. Batasi sekitar 5 agar animasi tetap halus.`,
      );
    }

    activeOrnaments.forEach((ornament, index) => {
      const label = ornament.id || `Ornament ${index + 1}`;
      const opacity = Number(ornament.opacity ?? 1);
      const width = parseOrnamentSize(ornament.width);

      if (!ornament.src) {
        warnings.push(`${label}: SRC masih kosong, ornament tidak akan tampil.`);
      }

      if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
        warnings.push(`${label}: opacity sebaiknya di antara 0 dan 1.`);
      }

      if (width > 860) {
        warnings.push(`${label}: width ${width}px cukup besar untuk canvas mobile. Cek lagi di Samsung A54.`);
      }
    });

    if (uploadValidationWarning) {
      warnings.push(uploadValidationWarning);
    }

    const globalStyle = parsedDesignConfig.sections?.global || {};
    const ratio = contrastRatio(
      globalStyle.textColor || "#262626",
      globalStyle.backgroundColor || "#ffffff",
    );

    if (ratio !== null && ratio < 4.5) {
      warnings.push(
        `Contrast global rendah (${ratio.toFixed(1)}:1). Gunakan warna text/background yang lebih kontras.`,
      );
    }

    Object.entries(parsedDesignConfig.sections || {}).forEach(([section, config]) => {
      const width = parseOrnamentSize(config.maxWidth || config.contentWidth || "");

      if (width > 412) {
        warnings.push(
          `Section "${section}" punya width ${width}px. Cek Samsung A54 agar tidak overflow.`,
        );
      }

      if (config.backgroundImage && isMissingAssetPath(config.backgroundImage)) {
        warnings.push(`Section "${section}" memakai background asset yang tidak valid.`);
      }
    });

    const openingConfig = {
      ...getOpeningRevealConfig(parsedDesignConfig),
      sequencePreset: parsedDesignConfig.widgets?.openingSequence?.preset,
    };
    const openingAssetConfig = getOpeningSequenceConfig(parsedDesignConfig).asset;
    const galleryConfig = getGalleryWidgetConfig(parsedDesignConfig);
    const countdownConfig = getCountdownWidgetConfig(parsedDesignConfig);

    if (
      openingConfig.enabled &&
      openingConfig.backgroundMode === "image" &&
      isMissingAssetPath(openingConfig.backgroundImage)
    ) {
      warnings.push("Opening aktif dengan background image kosong/tidak valid.");
    }

    if (
      openingConfig.enabled &&
      (["gate", "curtain", "paper"].includes(openingConfig.animation) ||
        ["floral-bloom", "falling-petals", "royal-gate", "wayang-shadow"].includes(openingConfig.sequencePreset)) &&
      activeOrnaments.length > 8
    ) {
      warnings.push("Opening cinematic plus banyak ornament bisa berat di mobile. Kurangi ornament atau pakai animasi lebih ringan.");
    }

    if (openingConfig.enabled && openingAssetConfig.type === "video") {
      if (isMissingAssetPath(openingAssetConfig.src)) {
        warnings.push("Opening video aktif tetapi file video belum diisi.");
      }

      if (isMissingAssetPath(openingAssetConfig.poster)) {
        warnings.push("Opening video sebaiknya punya poster fallback untuk mobile/reduced-motion.");
      }

      if (Number(openingAssetConfig.duration || 0) > 8) {
        warnings.push("Durasi opening video terlalu panjang. Target production maksimal 8 detik.");
      }

      if (String(openingAssetConfig.src || "").length > 8_000_000) {
        warnings.push("Opening video data URL terlalu besar untuk template config. Pakai storage URL production.");
      }
    }

    if (openingConfig.enabled && openingAssetConfig.type === "lottie") {
      if (isMissingAssetPath(openingAssetConfig.src)) {
        warnings.push("Opening Lottie aktif tetapi file JSON belum diisi.");
      }

      if (isMissingAssetPath(openingAssetConfig.poster)) {
        warnings.push("Opening Lottie butuh poster fallback sebelum renderer Lottie production aktif.");
      }
    }

    if (
      openingConfig.enabled &&
      openingAssetConfig.type === "image-sequence" &&
      isMissingAssetPath(openingAssetConfig.src) &&
      !Array.isArray(openingAssetConfig.frames)
    ) {
      warnings.push("Opening image-sequence aktif tetapi frame/poster belum diisi.");
    }

    if (galleryConfig.enabled && Number(galleryConfig.limit || 0) <= 0) {
      warnings.push("Gallery aktif tetapi limit <= 0. Public renderer bisa terlihat kosong.");
    }

    if (countdownConfig.enabled && Number(countdownConfig.eventIndex || 0) < 0) {
      warnings.push("Countdown aktif tetapi event index tidak valid.");
    }

    const giftConfig = {
      ...defaultGiftWidgetConfig,
      ...(parsedDesignConfig.widgets?.gift || {}),
    };
    const rsvpConfig = {
      ...defaultRsvpWidgetConfig,
      ...(parsedDesignConfig.widgets?.rsvp || {}),
    };
    const musicConfig = {
      ...getMusicWidgetConfig(parsedDesignConfig),
      hasAudio: true,
    };

    if (giftConfig.enabled && giftConfig.hasFallbackAccounts === false) {
      warnings.push("Gift aktif tanpa fallback rekening. Public section harus hide atau tampil warning admin-only.");
    }

    if (rsvpConfig.enabled && rsvpConfig.hasInvitationSlug === false) {
      warnings.push("RSVP aktif tanpa invitation slug. Submit bisa gagal.");
    }

    if (musicConfig.enabled && musicConfig.hasAudio === false) {
      warnings.push("Music aktif tanpa file audio. Player harus hide agar public page tidak rusak.");
    }

    return warnings;
  }, [
    activeDesignSection,
    activeOrnaments,
    parsedDesignConfig,
    templateDraft,
    uploadValidationWarning,
  ]);
  const templateQualityWarnings = useMemo(() => {
    if (!templateDraft) {
      return [];
    }

    const warnings = [];
    if (!templateDraft.image) {
      warnings.push("Thumbnail template belum tersedia.");
    }
    if (!templateDraft.previewUrl) {
      warnings.push("Preview URL belum diisi, sistem akan memakai preview default.");
    }
    if (!parsedDesignConfig) {
      warnings.push("Design config belum valid.");
    }
    if ((templateDraft.supportedFeatures || []).length === 0) {
      warnings.push("Supported features kosong. Admin sulit tahu widget apa yang aman dipakai.");
    }
    if (validationWarnings.length > 0) {
      warnings.push(...validationWarnings);
    }

    return warnings;
  }, [parsedDesignConfig, templateDraft, validationWarnings]);
  const countdownWidgetConfig = getCountdownWidgetConfig(parsedDesignConfig || {});
  const eventWidgetConfig = getEventWidgetConfig(parsedDesignConfig || {});
  const storyWidgetConfig = getStoryWidgetConfig(parsedDesignConfig || {});
  const galleryWidgetConfig = getGalleryWidgetConfig(parsedDesignConfig || {});
  const musicWidgetConfig = getMusicWidgetConfig(parsedDesignConfig || {});
  const giftWidgetConfig = {
    ...defaultGiftWidgetConfig,
    ...(parsedDesignConfig?.widgets?.gift || {}),
  };
  const rsvpWidgetConfig = {
    ...defaultRsvpWidgetConfig,
    ...(parsedDesignConfig?.widgets?.rsvp || {}),
  };
  const coverSectionConfig = getCoverSectionConfig(parsedDesignConfig || {});
  const openingRevealWidgetConfig = getOpeningRevealConfig(parsedDesignConfig || {});
  const openingSequenceWidgetConfig = getOpeningSequenceConfig(parsedDesignConfig || {});
  const coupleSectionConfig = getCoupleSectionConfig(parsedDesignConfig || {});
  const globalSectionStyleConfig = getSectionStyleConfig(parsedDesignConfig || {}, "global");
  const sectionAnimationConfig = {
    enabled: false,
    preset: "fade-sequence",
    entrancePreset: "fade-in",
    loopPreset: "none",
    entranceDelay: 0,
    loopDelay: 0,
    staggerStep: 0.15,
    ...(parsedDesignConfig?.animations?.sections?.[activeDesignSection] || {}),
  };
  const activeTemplatePreset =
    templateStylePresets.find((preset) => preset.id === selectedTemplatePreset) ||
    templateStylePresets[0];
  const selectedBadgeOption = templateBadgeOptions.includes(templateDraft?.badge)
    ? templateDraft?.badge
    : "Custom";
  // Untuk section "global", preview diarahkan ke section pertama yang TIDAK
  // dikecualikan dari ornamen global — supaya ornamen global selalu terlihat
  // di canvas editor (kalau home dikecualikan, jangan fokus ke home).
  const previewFocusSection = useMemo(() => {
    const mapped = mapDesignSectionToPreviewSection(activeDesignSection);

    if (activeDesignSection === "global") {
      const excluded = new Set(parsedDesignConfig?.ornamentExclusions?.global || []);
      const candidate = designSectionNames.find(
        (sectionName) => sectionName !== "global" && !excluded.has(sectionName),
      );
      if (candidate) {
        return mapDesignSectionToPreviewSection(candidate);
      }
    }

    return mapped;
  }, [activeDesignSection, designSectionNames, parsedDesignConfig]);
  const templatePreviewSrc = useMemo(
    () =>
      buildPreviewUrl({
        templateId: templateDraft?.id,
        mode: "editor",
        focusSection: previewFocusSection,
        previewTick: templatePreviewTick,
        previewDataMode,
        withGuest: previewGuestMode === "withGuest",
      }),
    [previewDataMode, previewFocusSection, previewGuestMode, templateDraft?.id, templatePreviewTick],
  );
  const previewConfigVersion = useMemo(() => {
    let hash = 0;
    for (let index = 0; index < designConfigText.length; index += 1) {
      hash = (hash * 31 + designConfigText.charCodeAt(index)) >>> 0;
    }
    return hash.toString(36);
  }, [designConfigText]);
  const coverSectionPreviewSrc = useMemo(
    () =>
      buildPreviewUrl({
        templateId: templateDraft?.id,
        mode: "cover",
        previewTick: templatePreviewTick,
        previewConfigVersion,
        previewDataMode,
        withGuest: previewGuestMode === "withGuest",
      }),
    [previewDataMode, previewConfigVersion, previewGuestMode, templateDraft?.id, templatePreviewTick],
  );
  const fullTemplatePreviewSrc = `${templatePreviewSrc.replace(
    "&embeddedEditorPreview=1",
    "",
  )}&viewport=${encodeURIComponent(previewViewport)}`;
  const openingSectionPreviewSrc = useMemo(
    () =>
      buildPreviewUrl({
        templateId: templateDraft?.id,
        mode: "opening",
        previewTick: templatePreviewTick,
        previewConfigVersion,
        previewDataMode,
        withGuest: previewGuestMode === "withGuest",
      }),
    [previewConfigVersion, previewDataMode, previewGuestMode, templateDraft?.id, templatePreviewTick],
  );
  const ornamentSectionPreviewSrc = useMemo(
    () =>
      buildPreviewUrl({
        templateId: templateDraft?.id,
        mode: "ornament",
        focusSection: previewFocusSection,
        previewTick: templatePreviewTick,
        previewConfigVersion,
        previewDataMode,
        withGuest: previewGuestMode === "withGuest",
      }),
    [
      previewConfigVersion,
      previewDataMode,
      previewFocusSection,
      previewGuestMode,
      templateDraft?.id,
      templatePreviewTick,
    ],
  );
  const ornamentCanvasPreviewSrc =
    activeDesignSection === "opening"
      ? openingSectionPreviewSrc
      : ornamentSectionPreviewSrc;
  const imageGenerationPrompt = useMemo(() => {
    const selectedConcept =
      smartThemeConcepts.find((concept) => concept.id === selectedThemeConcept) ||
      smartThemeConcepts[0];
    const sectionStyle = parsedDesignConfig?.sections?.global || {};
    const palette = [
      sectionStyle.backgroundColor,
      sectionStyle.surfaceColor,
      sectionStyle.accentColor,
      sectionStyle.textColor,
    ].filter(Boolean);
    const enabledWidgets = Object.entries(parsedDesignConfig?.widgets || {})
      .filter(([, config]) => config?.enabled !== false)
      .map(([key]) => key);

    return [
      "Buat hero image undangan digital pernikahan.",
      `Tema utama: ${selectedConcept?.label || "Elegant Wedding"} (${selectedConcept?.description || "romantis, modern, clean"}).`,
      `Gaya visual: ${activeTemplatePreset?.label || "Elegant minimal"}; nuansa premium, soft light, detail floral halus.`,
      `Palet warna: ${palette.length ? palette.join(", ") : "ivory, blush, gold, sage"}.`,
      `Komponen visual: background dekoratif, frame untuk foto pasangan, area judul nama mempelai, aksen ornamen sudut, dan ruang tanggal acara.`,
      `Widget pendukung template: ${enabledWidgets.length ? enabledWidgets.join(", ") : "countdown, story, gallery, rsvp"}.`,
      "Rasio gambar portrait 4:5, high detail, cinematic, elegant typography placeholder, tanpa watermark, tanpa teks panjang.",
      "Pastikan hasil bersih, readable untuk mobile, dan cocok untuk landing page preview undangan.",
    ].join(" ");
  }, [activeTemplatePreset?.label, parsedDesignConfig?.sections?.global, parsedDesignConfig?.widgets, selectedThemeConcept]);
  const copyImageGenerationPrompt = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(imageGenerationPrompt);
        setManagerMessage("Prompt image berhasil dicopy. Tempel di ChatGPT Image.");
        return;
      }
    } catch {
      // Fallback alert if clipboard permission is blocked.
    }

    setManagerMessage("Clipboard browser tidak tersedia. Silakan copy manual dari textarea prompt.");
  };
  const editorPreviewSnapshot = useMemo(
    () =>
      templateDraft
        ? buildPreviewSnapshot({
            id: templateDraft.id,
            image: templateDraft.image,
            designConfig: parsedDesignConfig || {},
          })
        : null,
    [parsedDesignConfig, templateDraft],
  );

  const postFullPreviewSnapshot = () => {
    if (!editorPreviewSnapshot || !fullPreviewIframeRef.current?.contentWindow) {
      return;
    }

    fullPreviewIframeRef.current.contentWindow.postMessage(
      buildSnapshotMessage(editorPreviewSnapshot),
      window.location.origin,
    );
  };

  useEffect(() => {
    postFullPreviewSnapshot();
  }, [editorPreviewSnapshot]);

  useEffect(() => {
    if (!templateDraft) {
      return;
    }

    persistPreviewSnapshot(
      buildPreviewSnapshot({
        id: templateDraft.id,
        image: templateDraft.image,
        designConfig: parsedDesignConfig || {},
      }),
    );

    return undefined;
  }, [parsedDesignConfig, templateDraft]);

  const openEditorPreview = () => {
    if (!templateDraft) {
      return;
    }

    let nextConfig = {};
    try {
      nextConfig = normalizeDesignConfig(
        designConfigText.trim() ? JSON.parse(designConfigText) : {},
      );
    } catch {
      setManagerMessage("Design config JSON belum valid.");
      return;
    }

    persistPreviewSnapshot(
      buildPreviewSnapshot({
        id: templateDraft.id,
        image: templateDraft.image,
        designConfig: nextConfig,
      }),
    );

    const previewUrl = `/preview?templateId=${encodeURIComponent(templateDraft.id)}&editorPreview=1`;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const ensurePresetSections = (templateId, config = {}) => {
    const presetSections = templateSectionPresets[templateId] || standardTemplateSections;
    const normalizedConfig = normalizeDesignConfig(config);
    const currentOrnaments = normalizedConfig.ornaments || {};
    const currentSections = normalizedConfig.sections || {};
    const legacySectionOrnaments = currentOrnaments.section || [];
    const migratedOrnaments = {
      ...currentOrnaments,
      global: [
        ...(currentOrnaments.global || []),
        ...legacySectionOrnaments.filter(
          (legacyOrnament) =>
            !(currentOrnaments.global || []).some(
              (globalOrnament) =>
                globalOrnament.id && legacyOrnament.id && globalOrnament.id === legacyOrnament.id,
            ),
        ),
      ],
    };
    delete migratedOrnaments.section;

    return {
      ...normalizedConfig,
      ornaments: presetSections.reduce(
        (ornaments, section) => ({
          ...ornaments,
          [section]: migratedOrnaments[section] || [],
        }),
        { ...migratedOrnaments },
      ),
      sections: presetSections.reduce(
        (sections, section) => ({
          ...sections,
          [section]: currentSections[section] || {},
        }),
        { ...currentSections },
      ),
    };
  };

  const updateOrnament = patchOrnament;
  const updateOrnamentAtIndex = patchOrnamentAtIndex;

  useOrnamentTimelineInteractions({
    timelineInteraction,
    setTimelineInteraction,
    timelineSnapEnabled,
    timelineSnapUnit,
    updateOrnamentAtIndex: patchOrnamentAtIndex,
    editorStep,
    selectedOrnament,
    selectedOrnamentIndex,
    activeOrnaments,
  });

  const updateOpeningRevealWidget = (field, value) => patchWidget("openingReveal", { [field]: value });
  const updateCountdownWidget = (field, value) => patchWidget("countdown", { [field]: value });
  const updateEventWidget = (field, value) => patchWidget("events", { [field]: value });
  const updateStoryWidget = (field, value) => patchWidget("story", { [field]: value });
  const updateGalleryWidget = (field, value) => patchWidget("gallery", { [field]: value });
  const updateMusicWidget = (field, value) => patchWidget("music", { [field]: value });
  const updateGiftWidget = (field, value) => patchWidget("gift", { [field]: value });
  const updateRsvpWidget = (field, value) => patchWidget("rsvp", { [field]: value });

  const updateOpeningSequenceWidget = (field, value) => patchWidget("openingSequence", { [field]: value });

  const updateOpeningSequenceAsset = (field, value) => {
    patchOpeningSequenceAsset({ [field]: value });
  };

  const updateOpeningSequenceAssetFields = (fields) => {
    patchOpeningSequenceAsset(fields);
  };

  const updateOpeningSequenceAssetFile = async (field, file) => {
    if (!file || !parsedDesignConfig) {
      return;
    }

    const assetType = field === "poster" ? "poster" : openingSequenceWidgetConfig.asset?.type || "motion";
    const prepared = file.type?.startsWith("image/")
      ? await prepareImageForUpload(file, field === "poster" ? "thumbnail" : "opening")
      : { file };
    const formData = new FormData();
    formData.append("templateId", templateDraft?.id || "template");
    formData.append("assetType", assetType);
    formData.append("assetRole", field);
    formData.append("file", prepared.file);

    try {
      const response = await fetch("/api/templates/opening-assets/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (response.ok && result.data?.url) {
        updateOpeningSequenceAssetFields({
          [field]: result.data.url,
          [field === "poster" ? "posterStoragePath" : "storagePath"]:
            result.data.storagePath || "",
        });
        return;
      }
    } catch {
      // Fall back to local data URL preview if storage upload is not available.
    }

    const previewUrl = await readFileAsDataUrl(prepared.file);
    updateOpeningSequenceAsset(field, previewUrl);
  };

  const updateOpeningRevealImage = async (field, file) => {
    if (!file || !parsedDesignConfig) {
      return;
    }

    const prepared = await prepareImageForUpload(file, "opening");
    const previewUrl = await readFileAsDataUrl(prepared.file);
    updateOpeningRevealWidget(field, previewUrl);
  };

  const updateCoverBackgroundImage = async (file) => {
    if (!file || !parsedDesignConfig) {
      return;
    }

    const prepared = await prepareImageForUpload(file, "cover");
    const previewUrl = await readFileAsDataUrl(prepared.file);
    updateTemplateSectionConfig("home", "backgroundImage", previewUrl);
  };

  const updateTemplateSectionConfig = (section, field, value) => {
    patchSection(section, { [field]: value });
  };

  const updateGlobalSectionStyle = (field, value) => {
    patchGlobalSectionStyle({ [field]: value });
  };

  const applyColorPalette = (palette) => {
    if (!parsedDesignConfig || !palette) {
      return;
    }

    // Pemetaan warna terkonsentrasi di satu Seam (applyPalette.js) —
    // TemplateAdmin tinggal tulis hasilnya, tidak memetakan manual.
    const { warnings } = paletteToSectionColors(palette);
    writeDesignConfig(applyPaletteToDesignConfig(parsedDesignConfig, palette));
    setManagerMessage(
      warnings.length > 0
        ? `Palette "${palette.label}" diterapkan (teks dikoreksi agar kontras).`
        : `Palette "${palette.label}" diterapkan.`,
    );
  };

  const handleAiGenerated = ({ designConfig, description }) => {
    if (!designConfig) {
      return;
    }

    writeDesignConfig(designConfig);
    setManagerMessage(
      "Template hasil AI dimuat ke editor. Cek pratinjau, lalu simpan.",
    );

    // Isi deskripsi otomatis jika belum ada.
    if (description && !templateDraft?.description) {
      updateTemplateDraft("description", description);
    }

    // Arahkan ke step Pratinjau supaya admin langsung melihat hasil.
    setEditorStep(8);
  };

  // Generate AI → langsung simpan sebagai template BARU (status hidden) di
  // katalog lalu buka di editor. Template sumber/template aktif tidak berubah.
  const handleAiGeneratedAsNewTemplate = async ({ designConfig, description, name }) => {
    if (!designConfig) {
      return;
    }

    const baseName = String(name || description || "Template AI").trim();
    const baseId = slugifyTemplateId(baseName) || "template-ai";
    const nextId = buildUniqueTemplateId(baseId);

    const newTemplate = {
      id: nextId,
      name: baseName,
      category: "Standard",
      price: "Rp 99.000",
      badge: "New",
      status: "hidden",
      description: description || "Template dibuat AI.",
      image: "/assets/backgrounds/soft-watercolor-cream.jpg",
      previewUrl: `/preview?templateId=${encodeURIComponent(nextId)}`,
      supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
      designConfig: ensurePresetSections(nextId, designConfig),
      sortOrder: items.length + 1,
    };

    setItems((currentItems) => [
      newTemplate,
      ...currentItems.filter((item) => item.id !== newTemplate.id),
    ]);
    markItemsChanged();
    setManagerMessage("Menyimpan template hasil AI...");

    try {
      const result = await persistTemplate(newTemplate);
      const savedTemplate = { ...newTemplate, ...result.data };
      setItems((currentItems) => [
        savedTemplate,
        ...currentItems.filter((item) => item.id !== savedTemplate.id),
      ]);
      setTemplateSource(result.source || templateSource);
      startEditTemplate(savedTemplate);
      setManagerMessage("Template hasil AI disimpan sebagai template baru.");
      notifySave("Template hasil AI disimpan sebagai template baru.", "success");
      setEditorStep(8);
    } catch (error) {
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== newTemplate.id),
      );
      markItemsChanged();
      setManagerMessage(error.message || "Gagal menyimpan template hasil AI.");
      notifySave(error.message || "Gagal menyimpan template hasil AI.", "error");
    }
  };

  const toggleSectionOverride = (section, enabled) => {
    updateTemplateSectionConfig(section, "useGlobal", !enabled);
  };

  const updateSectionAnimation = (field, value) => {
    patchSectionAnimation({ [field]: value });
  };

  const applySectionAnimationPreset = (presetId) => {
    const preset =
      sectionAnimationPresets.find((item) => item.id === presetId) ||
      sectionAnimationPresets[0];

    if (!parsedDesignConfig || !preset) {
      return;
    }

    // Update all ornaments in the section with the preset's entrance animation
    const sectionOrnaments = parsedDesignConfig.ornaments?.[activeDesignSection] || [];
    const updatedOrnaments = sectionOrnaments.map((ornament) => ({
      ...ornament,
      entrance: preset.entrancePreset,
    }));

    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [activeDesignSection]: updatedOrnaments,
      },
      animations: {
        ...(parsedDesignConfig.animations || {}),
        sections: {
          ...(parsedDesignConfig.animations?.sections || {}),
          [activeDesignSection]: {
            ...sectionAnimationConfig,
            enabled: true,
            preset: preset.id,
            entrancePreset: preset.entrancePreset,
            loopPreset: preset.loopPreset,
            staggerStep: preset.staggerStep,
          },
        },
      },
    });
  };

  const applyTemplateStylePreset = (scope = "template", presetOverride = null) => {
    const presetToApply = presetOverride || activeTemplatePreset;

    if (!parsedDesignConfig || !presetToApply) {
      return;
    }

    const targetSections =
      scope === "section" ? [activeDesignSection] : standardTemplateSections;
    const nextSections = { ...(parsedDesignConfig.sections || {}) };
    const nextAnimations = {
      ...(parsedDesignConfig.animations || {}),
      sections: {
        ...(parsedDesignConfig.animations?.sections || {}),
      },
    };
    const nextOrnaments = { ...(parsedDesignConfig.ornaments || {}) };

    if (scope === "template") {
      nextSections.global = {
        ...(nextSections.global || {}),
        ...presetToApply.sectionStyle,
      };

      if (presetToApply.ornaments) {
        Object.entries(presetToApply.ornaments).forEach(([section, ornaments]) => {
          nextOrnaments[section] = ornaments.map((ornament, index) => ({
            objectFit: "contain",
            height: "",
            rotate: 0,
            opacity: 1,
            zIndex: 1,
            mirror: false,
            duration: 6,
            delay: 0,
            timelineTrack: 0,
            timelinePosition: index * 0.2,
            ...ornament,
          }));
        });
      }
    }

    targetSections.forEach((section) => {
      nextSections[section] = {
        ...(nextSections[section] || {}),
        ...presetToApply.sectionStyle,
        useGlobal: false,
        ...(section === "home" ? presetToApply.cover : {}),
      };
      nextAnimations.sections[section] = {
        ...(nextAnimations.sections[section] || {}),
        ...presetToApply.animation,
      };
    });

    writeDesignConfig({
      ...parsedDesignConfig,
      preset: presetToApply.id,
      sections: nextSections,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        openingReveal: {
          ...openingRevealWidgetConfig,
          ...(presetToApply.widgets.openingReveal || {}),
        },
        openingSequence: {
          ...openingSequenceWidgetConfig,
          ...(presetToApply.widgets.openingSequence || {}),
        },
        countdown: {
          ...countdownWidgetConfig,
          ...(presetToApply.widgets.countdown || {}),
        },
        events: {
          ...eventWidgetConfig,
          ...(presetToApply.widgets.events || {}),
        },
        story: {
          ...storyWidgetConfig,
          ...(presetToApply.widgets.story || {}),
        },
        gallery: {
          ...galleryWidgetConfig,
          ...(presetToApply.widgets.gallery || {}),
        },
      },
      animations: nextAnimations,
      ornaments: nextOrnaments,
    });
    setManagerMessage(
      scope === "section"
        ? `${presetToApply.label} diterapkan ke section ${activeDesignSection}.`
        : `${presetToApply.label} diterapkan ke template.`,
    );
  };

  const applySmartThemeConcept = () => {
    const concept =
      smartThemeConcepts.find((item) => item.id === selectedThemeConcept) ||
      smartThemeConcepts[0];
    const preset =
      templateStylePresets.find((item) => item.id === concept?.presetId) ||
      templateStylePresets[0];

    if (!concept || !preset) {
      return;
    }

    setSelectedTemplatePreset(preset.id);
    applyTemplateStylePreset("template", preset);
    setManagerMessage(`${concept.label} composer menghasilkan preset ${preset.label}. Hasil tetap bisa diedit manual.`);
  };

  const addOrnament = () => {
    const baseConfig = parsedDesignConfig || {};
    const section = activeDesignSection || "home";
    const nextOrnament = {
      id: `ornament-${Date.now()}`,
      src: "/assets/blue-watercolor-frame.svg",
      slot: "top-left",
      width: 160,
      height: "",
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      zIndex: 1,
      objectFit: "contain",
      mirror: false,
      entrance: "fade-in",
      entranceDuration: 0.8,
      animation: "none",
      duration: 6,
      delay: 0,
      timelineTrack: 0,
      timelinePosition: 0,
    };
    const sectionOrnaments = [...(baseConfig.ornaments?.[section] || []), nextOrnament];

    writeDesignConfig({
      ...baseConfig,
      ornaments: {
        ...(baseConfig.ornaments || {}),
        [section]: sectionOrnaments,
      },
    });
    setSelectedOrnamentIndex(sectionOrnaments.length - 1);
  };

  const removeOrnament = () => {
    if (!parsedDesignConfig || !activeOrnaments.length) {
      return;
    }

    const nextOrnaments = activeOrnaments.filter(
      (_, index) => index !== selectedOrnamentIndex,
    );

    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [activeDesignSection]: nextOrnaments,
      },
    });
    setSelectedOrnamentIndex(0);
  };

  const reorderSelectedOrnament = (mode) => {
    if (!parsedDesignConfig || !selectedOrnament || activeOrnaments.length < 2) {
      return;
    }

    const currentIndex = activeOrnaments.findIndex(
      (ornament, index) =>
        index === selectedOrnamentIndex || ornament.id === selectedOrnament.id,
    );

    if (currentIndex < 0) {
      return;
    }

    const isBackgroundLayer = (activeOrnaments[currentIndex].zIndex ?? 0) < 0;
    const sameLayerIndexes = activeOrnaments
      .map((ornament, index) => ({ ornament, index }))
      .filter(({ ornament }) => ((ornament.zIndex ?? 0) < 0) === isBackgroundLayer)
      .map(({ index }) => index);
    const currentLayerIndex = sameLayerIndexes.indexOf(currentIndex);

    if (currentLayerIndex < 0 || sameLayerIndexes.length < 2) {
      return;
    }

    let nextLayerIndex = currentLayerIndex;
    if (mode === "up") {
      nextLayerIndex = Math.min(sameLayerIndexes.length - 1, currentLayerIndex + 1);
    }
    if (mode === "down") {
      nextLayerIndex = Math.max(0, currentLayerIndex - 1);
    }
    if (mode === "front") {
      nextLayerIndex = sameLayerIndexes.length - 1;
    }
    if (mode === "back") {
      nextLayerIndex = 0;
    }

    if (nextLayerIndex === currentLayerIndex) {
      return;
    }

    const sameLayerOrnaments = sameLayerIndexes.map((index) => activeOrnaments[index]);
    const [movedOrnament] = sameLayerOrnaments.splice(currentLayerIndex, 1);
    sameLayerOrnaments.splice(nextLayerIndex, 0, movedOrnament);

    const nextOrnaments = [...activeOrnaments];
    sameLayerIndexes.forEach((ornamentIndex, orderIndex) => {
      const zIndex = isBackgroundLayer
        ? -(sameLayerIndexes.length - orderIndex)
        : orderIndex + 1;
      nextOrnaments[ornamentIndex] = {
        ...sameLayerOrnaments[orderIndex],
        zIndex,
      };
    });

    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [activeDesignSection]: nextOrnaments,
      },
    });
    setSelectedOrnamentIndex(sameLayerIndexes[nextLayerIndex]);
  };

  const duplicateOrnament = () => {
    if (!parsedDesignConfig || !selectedOrnament) {
      return;
    }

    const section = activeDesignSection || "home";
    const nextOrnament = {
      ...selectedOrnament,
      id: `${selectedOrnament.id || "ornament"}-copy-${Date.now()}`,
    };
    const nextOrnaments = [...activeOrnaments, nextOrnament];

    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [section]: nextOrnaments,
      },
    });
    setSelectedOrnamentIndex(nextOrnaments.length - 1);
  };

  const removeOrnamentAtIndex = (targetIndex) => {
    if (!parsedDesignConfig || !activeOrnaments[targetIndex]) return;
    const nextOrnaments = activeOrnaments.filter((_, index) => index !== targetIndex);
    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [activeDesignSection]: nextOrnaments,
      },
    });
    setSelectedOrnamentIndex((current) => {
      if (nextOrnaments.length === 0) return 0;
      if (current > targetIndex) return current - 1;
      return Math.min(current, nextOrnaments.length - 1);
    });
  };

  // Hapus ornamen dari section mana pun (dipakai panel "Ornamen Bermasalah"
  // untuk membersihkan ornamen yang src-nya rusak/kosong).
  const removeOrnamentFromSection = (section, targetIndex) => {
    if (!parsedDesignConfig) return;
    const sectionOrnaments = parsedDesignConfig.ornaments?.[section] || [];
    if (!sectionOrnaments[targetIndex]) return;
    const nextOrnaments = sectionOrnaments.filter((_, index) => index !== targetIndex);
    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [section]: nextOrnaments,
      },
    });
    if (section === activeDesignSection) {
      setSelectedOrnamentIndex(0);
    }
    setManagerMessage(`Ornamen bermasalah dihapus dari section ${section}.`);
  };

  const duplicateOrnamentAtIndex = (targetIndex) => {
    if (!parsedDesignConfig || !activeOrnaments[targetIndex]) return;
    const section = activeDesignSection || "home";
    const target = activeOrnaments[targetIndex];
    const nextOrnament = {
      ...target,
      id: `${target.id || "ornament"}-copy-${Date.now()}`,
    };
    const nextOrnaments = [...activeOrnaments];
    nextOrnaments.splice(targetIndex + 1, 0, nextOrnament);
    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [section]: nextOrnaments,
      },
    });
    setSelectedOrnamentIndex(targetIndex + 1);
  };

  const updateSelectedOrnamentFile = async (file) => {
    if (!file || !templateDraft?.id || !selectedOrnament) {
      return;
    }

    const prepared = await prepareImageForUpload(file, "ornament");

    if (
      ["image/png", "image/webp"].includes(prepared.file.type) &&
      prepared.file.size > ornamentMaxRasterFileSize
    ) {
      setUploadValidationWarning(
        `${prepared.file.name} berukuran ${(prepared.file.size / 1024 / 1024).toFixed(2)} MB. Untuk ornament PNG/WebP, usahakan maksimal 1 MB atau pakai SVG/WebP terkompres.`,
      );
    } else {
      setUploadValidationWarning("");
    }

    const previewUrl = await readFileAsDataUrl(prepared.file);
    updateOrnament("src", previewUrl);
    setIsUploadingOrnament(true);
    setManagerMessage("");

    try {
      const formData = new FormData();
      formData.append("templateId", templateDraft.id);
      formData.append("section", activeDesignSection || "home");
      formData.append("ornamentId", selectedOrnament.id || "ornament");
      formData.append("file", prepared.file);

      const response = await fetch("/api/templates/ornaments/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal upload ornament");
      }

      const assetUrl = result.source === "supabase" ? result.data.url : previewUrl;

      updateOrnament("src", assetUrl);
      setDynamicOrnamentAssets((currentAssets) => {
        const nextAsset = {
          id: result.data.storagePath || `local-${Date.now()}`,
          name: prepared.file.name?.replace(/\.[^.]+$/, "") || `${selectedOrnament.id || "Ornament"} Upload`,
          src: assetUrl,
          storagePath: result.data.storagePath || "",
          templateId: templateDraft.id,
          isCurrentTemplate: true,
          source: result.source,
        };

        return [
          nextAsset,
          ...currentAssets.filter((asset) => asset.id !== nextAsset.id),
        ];
      });
      setManagerMessage(
        result.source === "supabase"
          ? "Ornament berhasil diupload ke Supabase Storage."
          : "Ornament preview lokal aktif. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setManagerMessage(error.message || "Gagal upload ornament.");
    } finally {
      setIsUploadingOrnament(false);
    }
  };

  const applyOrnamentAsset = (asset) => {
    if (!selectedOrnament) {
      return;
    }

    updateOrnament("src", asset.src);
    setManagerMessage(`${asset.name} dipakai untuk ornament aktif.`);
  };

  const deleteDynamicOrnamentAsset = async (asset) => {
    if (!asset.storagePath) {
      setDynamicOrnamentAssets((currentAssets) =>
        currentAssets.filter((item) => item.id !== asset.id),
      );
      setManagerMessage("Asset lokal dihapus dari library sementara.");
      return;
    }

    setDynamicOrnamentAssets((currentAssets) =>
      currentAssets.filter((item) => item.storagePath !== asset.storagePath),
    );
    setManagerMessage("Menghapus asset ornament...");

    try {
      const response = await fetch("/api/templates/ornaments/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storagePath: asset.storagePath }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus asset");
      }

      setManagerMessage(
        result.source === "supabase"
          ? "Asset ornament berhasil dihapus dari Storage."
          : "Asset ornament dihapus dari library sementara.",
      );
    } catch (error) {
      setDynamicOrnamentAssets((currentAssets) => [asset, ...currentAssets]);
      setManagerMessage(error.message || "Gagal menghapus asset ornament.");
    }
  };

  const persistTemplate = async (template) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);
    let response;
    try {
      response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
        signal: controller.signal,
      });
    } finally {
      window.clearTimeout(timeoutId);
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || `Gagal menyimpan template (${response.status}).`);
    }

    return result;
  };

  const deleteTemplate = (template) => {
    if (!template?.id) {
      return;
    }

    setDeleteTemplateTarget(template);
  };

  const confirmDeleteTemplate = async () => {
    const template = deleteTemplateTarget;
    if (!template?.id) {
      return;
    }

    const previousItems = items;

    setIsDeletingTemplate(true);
    setItems((currentItems) => currentItems.filter((item) => item.id !== template.id));
    markItemsChanged();
    clearPreviewSnapshot(template.id);
    if (editingTemplateId === template.id) {
      cancelEditTemplate();
    }
    setManagerMessage("Menghapus template...");

    try {
      const response = await fetch("/api/templates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: template.id }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus template");
      }

      setTemplateSource(result.source || templateSource);
      setManagerMessage(
        result.source === "supabase"
          ? "Template berhasil dihapus dari Supabase."
          : "Template berhasil dihapus.",
      );
    } catch (error) {
      setItems(previousItems);
      setManagerMessage(error.message || "Gagal menghapus template.");
    } finally {
      setIsDeletingTemplate(false);
      setDeleteTemplateTarget(null);
    }
  };

  const toggleTemplateStatus = async (templateId) => {
    const targetTemplate = items.find((template) => template.id === templateId);
    if (!targetTemplate) {
      return;
    }

    const nextTemplate = {
      ...targetTemplate,
      status: targetTemplate.status === "active" ? "hidden" : "active",
    };

    setItems((currentItems) =>
      currentItems.map((template) =>
        template.id === templateId ? nextTemplate : template,
      ),
    );
    markItemsChanged();

    try {
      const result = await persistTemplate(nextTemplate);
      setTemplateSource(result.source || templateSource);
      setManagerMessage("Status template tersimpan.");
    } catch (error) {
      // Rollback status kalau gagal disimpan ke Supabase.
      setItems((currentItems) =>
        currentItems.map((template) =>
          template.id === templateId ? targetTemplate : template,
        ),
      );
      markItemsChanged();
      setManagerMessage(error.message || "Gagal menyimpan status template.");
    }
  };

  const duplicateTemplate = async (template) => {
    if (!template?.id) {
      return;
    }

    const nextId = buildUniqueTemplateId(`${template.id}-copy`);

    let clonedConfig = {};
    try {
      clonedConfig = JSON.parse(JSON.stringify(template.designConfig || {}));
    } catch {
      clonedConfig = {};
    }
    const designConfig = ensurePresetSections(nextId, clonedConfig);

    const duplicated = {
      ...template,
      id: nextId,
      name: `${template.name} (Salinan)`,
      status: "hidden",
      previewUrl: `/preview?templateId=${encodeURIComponent(nextId)}`,
      designConfig,
      sortOrder: items.length + 1,
    };

    setItems((currentItems) => [
      duplicated,
      ...currentItems.filter((item) => item.id !== duplicated.id),
    ]);
    markItemsChanged();
    setManagerMessage("Menyalin template...");

    try {
      const result = await persistTemplate(duplicated);
      const nextTemplate = { ...duplicated, ...result.data };
      setItems((currentItems) => [
        nextTemplate,
        ...currentItems.filter((item) => item.id !== nextTemplate.id),
      ]);
      setTemplateSource(result.source || templateSource);
      startEditTemplate(nextTemplate);
      setManagerMessage("Template berhasil diduplikat. Salinan dibuka untuk diedit.");
    } catch (error) {
      setItems((currentItems) => currentItems.filter((item) => item.id !== duplicated.id));
      setManagerMessage(error.message || "Gagal menduplikat template.");
    }
  };

  const startEditTemplate = (template) => {
    const designConfig = ensurePresetSections(template.id, template.designConfig || {});
    const firstSection = templateSectionPresets[template.id]?.[0] || Object.keys(designConfig.ornaments || {})[0] || "home";

    setEditingTemplateId(template.id);
    setTemplateDraft({ ...template, designConfig });
    setDesignConfigText(JSON.stringify(designConfig, null, 2));
    setActiveDesignSection(firstSection);
    setSelectedOrnamentIndex(0);
    setEditorStep(1);
    setIsAdvancedOpen(false);
    setManagerMessage("");
  };

  const startCreateTemplate = () => {
    // Id unik dari items + override lokal + id yang pernah dihapus. Kalau
    // fetch katalog masih berjalan (items belum memuat template dari DB),
    // "template-baru" yang sudah ada di Supabase tetap terdeteksi lewat
    // suffix counter — jadi tidak bentrok dan tidak menimpa.
    const nextId = buildUniqueTemplateId("template-baru");

    const designConfig = ensurePresetSections(nextId, {});
    const nextTemplate = {
      id: nextId,
      name: "Template Baru",
      category: "Standard",
      price: "Rp 99.000",
      badge: "New",
      status: "hidden",
      description: "Template custom baru.",
      image: "/assets/backgrounds/soft-watercolor-cream.jpg",
      previewUrl: `/preview?templateId=${encodeURIComponent(nextId)}`,
      supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
      designConfig,
      sortOrder: items.length + 1,
    };

    setEditingTemplateId(null);
    setTemplateDraft(nextTemplate);
    setDesignConfigText(JSON.stringify(designConfig, null, 2));
    setActiveDesignSection("home");
    setSelectedOrnamentIndex(0);
    setEditorStep(1);
    setIsAdvancedOpen(false);
    setManagerMessage("Template baru dibuat sebagai draft. Simpan metadata untuk masuk katalog.");
  };

  const updateTemplateDraft = (field, value) => {
    setTemplateDraft((current) => {
      if (!current) {
        return current;
      }

      if (
        field === "name" &&
        !editingTemplateId &&
        (!current.id || current.id.startsWith("template-baru"))
      ) {
        // Nama → ID otomatis, tapi jangan sampai bentrok dengan template lain
        // (termasuk "template-baru" yang sudah ada di katalog/DB). Kalau slug
        // nama sudah dipakai, beri suffix angka.
        const nextId = buildUniqueTemplateId(value);
        return {
          ...current,
          name: value,
          id: nextId,
          previewUrl: `/preview?templateId=${encodeURIComponent(nextId)}`,
        };
      }

      if (field === "id") {
        const nextId = slugifyTemplateIdLive(value);
        return {
          ...current,
          id: nextId,
          previewUrl: `/preview?templateId=${encodeURIComponent(nextId)}`,
        };
      }

      return { ...current, [field]: value };
    });
    setManagerMessage("");
  };

  const updateTemplateThumbnail = async (file) => {
    if (!file) {
      return;
    }

    const prepared = await prepareImageForUpload(file, "thumbnail");
    const previewUrl = await readFileAsDataUrl(prepared.file);
    updateTemplateDraft("image", previewUrl);

    if (!templateDraft?.id) {
      return;
    }

    setIsUploadingThumbnail(true);
    setManagerMessage("");

    try {
      const formData = new FormData();
      formData.append("templateId", templateDraft.id);
      formData.append("file", prepared.file);

      const response = await fetch("/api/templates/thumbnail", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal upload thumbnail");
      }

      if (result.source === "supabase" && result?.data?.url) {
        updateTemplateDraft("image", result.data.url);
      }
      setManagerMessage(
        result.source === "supabase"
          ? "Thumbnail berhasil diupload ke Supabase Storage."
          : "Thumbnail preview lokal aktif. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setManagerMessage(error.message);
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const cancelEditTemplate = () => {
    setEditingTemplateId(null);
    setTemplateDraft(null);
    setDesignConfigText("");
    setActiveDesignSection("home");
    setSelectedOrnamentIndex(0);
    setEditorStep(1);
    setIsAdvancedOpen(false);
    setManagerMessage("");
  };

  const saveTemplateDraft = async () => {
    if (!templateDraft) {
      return;
    }

    // Guard anti double-save: state isSavingTemplate baru berlaku setelah
    // re-render, jadi ref ini menahan klik ganda dalam batch yang sama.
    if (savingRef.current) {
      return;
    }

    const normalizedId = slugifyTemplateId(templateDraft.id);

    if (!normalizedId || !templateDraft.name || !templateDraft.category) {
      const message = "Template ID, nama, dan kategori wajib diisi.";
      setManagerMessage(message);
      notifySave(message, "error");
      return;
    }

    // Kalau user mengedit template yang SUDAH ADA (editingTemplateId), id tidak
    // bisa diubah (field disabled) — pakai id asli. Kalau template baru, pastikan
    // id-nya tidak dipakai template lain; kalau bentrok (misal karena fetch
    // katalog belum selesai saat "Tambah Template"), generate id unik otomatis
    // supaya save tidak gagal/menimpa template lain.
    let finalId = normalizedId;
    if (!editingTemplateId && isTemplateIdTaken(normalizedId)) {
      const currentDefaultId = buildUniqueTemplateId(
        normalizedId.startsWith("template-baru") ? "template-baru" : normalizedId,
      );
      finalId = currentDefaultId;
      const message = `Template ID "${normalizedId}" sudah dipakai — disimpan sebagai "${finalId}".`;
      setManagerMessage(message);
      notifySave(message, "info");
    }

    let parsedDesignConfig = {};
    try {
      parsedDesignConfig = normalizeDesignConfig(
        designConfigText.trim() ? JSON.parse(designConfigText) : {},
      );
    } catch {
      const message = "Design config JSON belum valid.";
      setManagerMessage(message);
      notifySave(message, "error");
      return;
    }

    const draftToSave = {
      ...templateDraft,
      id: finalId,
      previewUrl: `/preview?templateId=${encodeURIComponent(finalId)}`,
      designConfig: parsedDesignConfig,
    };

    const saveStartedAt = Date.now();
    savingRef.current = true;
    setIsSavingTemplate(true);

    setItems((currentItems) => {
      if (editingTemplateId) {
        return currentItems.map((template) =>
          template.id === editingTemplateId ? { ...template, ...draftToSave } : template,
        );
      }

      return [draftToSave, ...currentItems.filter((template) => template.id !== draftToSave.id)];
    });

    try {
      markItemsChanged();
      const result = await persistTemplate(draftToSave);
      const nextTemplate = { ...draftToSave, ...result.data };
      setItems((currentItems) => {
        if (editingTemplateId) {
          return currentItems.map((template) =>
            template.id === editingTemplateId ? { ...template, ...nextTemplate } : template,
          );
        }

        return [
          nextTemplate,
          ...currentItems.filter((template) => template.id !== nextTemplate.id),
        ];
      });
      setTemplateSource(result.source || templateSource);
      setEditingTemplateId(nextTemplate.id);
      setTemplateDraft(nextTemplate);
      if (nextTemplate.designConfig) {
        setDesignConfigText(JSON.stringify(nextTemplate.designConfig, null, 2));
      }
      setManagerMessage("Template berhasil disimpan.");
      notifySave("Template berhasil disimpan.", "success");
    } catch (error) {
      // Save gagal ke Supabase — kembalikan daftar ke kondisi sebelum simpan
      // supaya tidak ada template "palsu" yang tampil padahal tidak tersimpan.
      setItems((currentItems) => {
        if (editingTemplateId) {
          return currentItems.map((template) =>
            template.id === editingTemplateId ? { ...templateDraft, id: editingTemplateId } : template,
          );
        }
        return currentItems.filter((template) => template.id !== draftToSave.id);
      });
      markItemsChanged();
      const message = error.message || "Gagal menyimpan template.";
      setManagerMessage(message);
      notifySave(message, "error");
    } finally {
      savingRef.current = false;
      const elapsed = Date.now() - saveStartedAt;
      const minLoading = 900;
      if (elapsed < minLoading) {
        await new Promise((resolve) => setTimeout(resolve, minLoading - elapsed));
      }
      setIsSavingTemplate(false);
    }
  };

  return (
      <motion.section
        variants={fadeUp}
        className="template-admin-editor mx-auto max-w-[1100px] rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-6 shadow-[var(--dash-shadow)]"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[var(--dash-ink)]">Template</h2>
            {!templateDraft ? (
              <p className="mt-1 text-base font-semibold text-[var(--dash-muted)]">
                Kelola katalog template, status, preview, dan metadata penjualan.
              </p>
            ) : null}
            {!templateDraft ? (
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                <span>
                  Total Template: <span className="text-[var(--dash-ink)]">{counts.total}</span>
                </span>
                <span>
                  Aktif: <span className="text-[var(--dash-ink)]">{counts.active}</span>
                </span>
                <span>
                  Hidden: <span className="text-[var(--dash-ink)]">{counts.hidden}</span>
                </span>
              </div>
            ) : null}
          </div>
          {templateDraft ? null : (
            <DashboardButton
              type="button"
              onClick={startCreateTemplate}
            >
              Tambah Template
            </DashboardButton>
          )}
        </div>

        {!templateDraft ? (
        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_220px_180px_auto]">
          <Field label="Search Template">
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, kategori, atau template ID"
            />
          </Field>
          <Field label="Kategori">
            <SelectInput
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value)}
            >
              {templateCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Status">
            <SelectInput
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Semua</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </SelectInput>
          </Field>
        </div>
        ) : null}

        {managerMessage ? (
          <p className="mt-5 rounded-[8px] bg-[var(--color-section-soft)] px-4 py-3 text-sm font-black text-[var(--color-primary)]">
            {managerMessage}
          </p>
        ) : null}

        {templateDraft ? (
          <div className="mt-6 rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-5 shadow-lg shadow-[var(--color-primary)]/8">
            <StepNavigator
              currentStepNumber={currentStepNumber}
              totalEditorSteps={totalEditorSteps}
              previousStepId={previousStepId}
              nextStepId={nextStepId}
              editorSteps={editorSteps}
              editorStep={editorStep}
              onBack={() => {
                if (previousStepId) setEditorStep(previousStepId);
              }}
              onNext={() => {
                if (nextStepId) setEditorStep(nextStepId);
              }}
              onSelectStep={setEditorStep}
            />

            <div className="mt-4 grid gap-5">
              <div className="min-w-0">
            <MetadataStep
              visible={editorStep === 1}
              templateDraft={templateDraft}
              editingTemplateId={editingTemplateId}
              updateTemplateDraft={updateTemplateDraft}
              templateCategoryOptions={templateCategoryOptions}
              templateBadgeOptions={templateBadgeOptions}
              selectedBadgeOption={selectedBadgeOption}
              designConfig={parsedDesignConfig}
              isUploadingThumbnail={isUploadingThumbnail}
              updateTemplateThumbnail={updateTemplateThumbnail}
            />
            <div className={editorStep === 2 ? "" : "hidden"}>
              <AiTemplateGenerator
                templates={items}
                onGenerated={handleAiGenerated}
                onGeneratedAsNewTemplate={handleAiGeneratedAsNewTemplate}
              />
            </div>
            <CoverStep
                visible={editorStep === 4}
                coverSectionConfig={coverSectionConfig}
                updateTemplateSectionConfig={updateTemplateSectionConfig}
                coverBackgroundModeOptions={coverBackgroundModeOptions}
                updateCoverBackgroundImage={updateCoverBackgroundImage}
                coverPreviewSrc={coverSectionPreviewSrc}
                previewSnapshot={editorPreviewSnapshot}
              />
              <GlobalStyleStep
                visible={editorStep === 3}
                templateId={templateDraft?.id}
                palettes={allPalettes}
                onAiGeneratePalette={handleAiGeneratedPalette}
                onDeletePalette={handleDeletePalette}
                isAiGeneratingPalette={isAiGeneratingPalette}
                paletteGenerateError={paletteGenerateError}
                parsedDesignConfig={parsedDesignConfig}
                applyColorPalette={applyColorPalette}
                globalSectionStyleConfig={globalSectionStyleConfig}
                updateGlobalSectionStyle={updateGlobalSectionStyle}
                updateTemplateSectionConfig={updateTemplateSectionConfig}
                headingFontOptions={headingFontOptions}
                bodyFontOptions={bodyFontOptions}
                coupleSectionConfig={coupleSectionConfig}
                couplePhotoStyleOptions={couplePhotoStyleOptions}
                coupleFontPresetOptions={coupleFontPresetOptions}
              />
              <OpeningStep
                visible={editorStep === 5}
                openingRevealWidgetConfig={openingRevealWidgetConfig}
                openingSequenceWidgetConfig={openingSequenceWidgetConfig}
                openingRevealAnimationOptions={openingRevealAnimationOptions}
                openingSequencePresetOptions={openingSequencePresetOptions}
                openingRevealBackgroundModeOptions={openingRevealBackgroundModeOptions}
                updateOpeningRevealWidget={updateOpeningRevealWidget}
                updateOpeningSequenceWidget={updateOpeningSequenceWidget}
                updateOpeningRevealImage={updateOpeningRevealImage}
                updateOpeningSequenceAsset={updateOpeningSequenceAsset}
                updateOpeningSequenceAssetFile={updateOpeningSequenceAssetFile}
                openingSectionPreviewSrc={openingSectionPreviewSrc}
                previewSnapshot={editorPreviewSnapshot}
                onReplayPreview={() => setTemplatePreviewTick((current) => current + 1)}
              />
              <WidgetsStep
                visible={editorStep === 6}
                countdownWidgetConfig={countdownWidgetConfig}
                storyWidgetConfig={storyWidgetConfig}
                galleryWidgetConfig={galleryWidgetConfig}
                eventWidgetConfig={eventWidgetConfig}
                musicWidgetConfig={musicWidgetConfig}
                giftWidgetConfig={giftWidgetConfig}
                rsvpWidgetConfig={rsvpWidgetConfig}
                countdownVariantOptions={countdownVariantOptions}
                storyVariantOptions={storyVariantOptions}
                storyAnimationOptions={storyAnimationOptions}
                galleryVariantOptions={galleryVariantOptions}
                eventVariantOptions={eventVariantOptions}
                musicVariantOptions={musicVariantOptions}
                musicPositionOptions={musicPositionOptions}
                musicPulseIntensityOptions={musicPulseIntensityOptions}
                updateCountdownWidget={updateCountdownWidget}
                updateStoryWidget={updateStoryWidget}
                updateGalleryWidget={updateGalleryWidget}
                updateEventWidget={updateEventWidget}
                updateMusicWidget={updateMusicWidget}
                updateGiftWidget={updateGiftWidget}
                updateRsvpWidget={updateRsvpWidget}
              />
              <div id="template-ornaments" className={`scroll-mt-24 ${editorStep === 7 ? "" : "hidden"}`}>
                <div className="overflow-anchor-none rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-3 pb-24">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Ornament Editor
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                        Edit posisi ornament berdasarkan canvas 412px.
                      </p>
                    </div>
                  </div>

                  {parsedDesignConfig ? (
                    <>
                      <div className="mt-4">
                        <OrnamentTimelinePanel
                          activeOrnaments={activeOrnaments}
                          previewEntranceKey={previewEntranceKey}
                          setPreviewEntranceKey={setPreviewEntranceKey}
                          timelineZoom={timelineZoom}
                          setTimelineZoom={setTimelineZoom}
                          timelineSnapEnabled={timelineSnapEnabled}
                          setTimelineSnapEnabled={setTimelineSnapEnabled}
                          timelineSnapUnit={timelineSnapUnit}
                          setTimelineSnapUnit={setTimelineSnapUnit}
                          timelineContainerRef={timelineContainerRef}
                          setSelectedOrnamentIndex={setSelectedOrnamentIndex}
                          setTimelineInteraction={setTimelineInteraction}
                          selectedOrnamentIndex={selectedOrnamentIndex}
                        />
                      </div>
                      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                        <div className="min-w-0 space-y-4">
                        <div className="grid gap-4 lg:grid-cols-[280px_minmax(300px,1fr)] lg:items-start">
                          <OrnamentLayerPanel
                            activeDesignSection={activeDesignSection}
                            setActiveDesignSection={setActiveDesignSection}
                            setSelectedOrnamentIndex={setSelectedOrnamentIndex}
                            designSectionNames={designSectionNames}
                            ornamentSearchQuery={ornamentSearchQuery}
                            setOrnamentSearchQuery={setOrnamentSearchQuery}
                            addOrnament={addOrnament}
                            activeOrnaments={activeOrnaments}
                            selectedOrnamentIndex={selectedOrnamentIndex}
                            updateOrnamentAtIndex={updateOrnamentAtIndex}
                            duplicateOrnamentAtIndex={duplicateOrnamentAtIndex}
                            removeOrnamentAtIndex={removeOrnamentAtIndex}
                            reorderSelectedOrnament={reorderSelectedOrnament}
                            globalExcludedSections={parsedDesignConfig.ornamentExclusions?.global || []}
                            toggleGlobalOrnamentExclusion={toggleGlobalOrnamentExclusion}
                            allOrnamentsBySection={parsedDesignConfig?.ornaments || {}}
                            removeOrnamentFromSection={removeOrnamentFromSection}
                          />
                          {selectedOrnament ? (
                            <OrnamentPropertiesPanel
                              selectedOrnament={selectedOrnament}
                              updateOrnament={updateOrnament}
                              reorderSelectedOrnament={reorderSelectedOrnament}
                              updateSelectedOrnamentFile={updateSelectedOrnamentFile}
                              dynamicOrnamentAssets={dynamicOrnamentAssets}
                              applyOrnamentAsset={applyOrnamentAsset}
                              ornamentEntranceOptions={ornamentEntranceOptions}
                              ornamentLoopModeOptions={ornamentLoopModeOptions}
                              ornamentExitAnimationOptions={ornamentExitAnimationOptions}
                              ornamentParallaxDirectionOptions={ornamentParallaxDirectionOptions}
                            />
                          ) : (
                            <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-6 text-center">
                              <p className="text-base font-black text-[var(--color-primary)]">
                                Pilih atau tambah ornament dulu.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <OrnamentCanvasPanel
                        activeDesignSection={activeDesignSection}
                        activeOrnaments={activeOrnaments}
                        previewEntranceKey={previewEntranceKey}
                        setPreviewEntranceKey={setPreviewEntranceKey}
                        validationWarnings={validationWarnings}
                        templatePreviewSrc={ornamentCanvasPreviewSrc}
                        previewSnapshot={editorPreviewSnapshot}
                        selectedOrnamentIndex={selectedOrnamentIndex}
                        setSelectedOrnamentIndex={setSelectedOrnamentIndex}
                        updateOrnamentAtIndex={patchOrnamentAtIndex}
                        setManagerMessage={setManagerMessage}
                      />
                    </div>
                    </>
                  ) : (
                    <p className="mt-5 rounded-[8px] bg-white px-4 py-3 text-sm font-black text-[var(--color-primary)]">
                      Design config JSON belum valid, editor visual dinonaktifkan sementara.
                    </p>
                  )}
                </div>
              </div>
              <div
                id="template-preview"
                className={`scroll-mt-24 md:col-span-2 ${editorStep === 8 ? "" : "hidden"}`}
              >
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-primary)] p-4 shadow-xl shadow-[var(--color-primary)]/12">
                  <div className="mb-3 flex flex-col gap-1 text-white sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent-soft)]">
                      Pratinjau Template
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <DashboardButton
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setTemplatePreviewTick((current) => current + 1)}
                      >
                        Putar ulang pembuka
                      </DashboardButton>
                      <a
                        href={fullTemplatePreviewSrc}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-black text-white/72 transition-colors hover:bg-white/18 hover:text-white"
                      >
                        Buka pratinjau penuh
                      </a>
                      {Object.entries(templatePreviewViewports).map(([key, viewport]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPreviewViewport(key)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-black transition-colors ${
                            previewViewport === key
                              ? "bg-[var(--color-accent)] text-[var(--color-primary)]"
                              : "bg-white/10 text-white/72 hover:bg-white/18 hover:text-white"
                          }`}
                        >
                          {viewport.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {[
                      { id: "withGuest", label: "Dengan nama tamu" },
                      { id: "noGuest", label: "Tanpa nama tamu" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setPreviewGuestMode(mode.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-black transition-colors ${
                          previewGuestMode === mode.id
                            ? "bg-[var(--color-accent)] text-[var(--color-primary)]"
                            : "bg-white/10 text-white/72 hover:bg-white/18 hover:text-white"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                    {[
                      { id: "filled", label: "Data terisi" },
                      { id: "empty", label: "Data kosong" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setPreviewDataMode(mode.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-black transition-colors ${
                          previewDataMode === mode.id
                            ? "bg-[var(--color-accent)] text-[var(--color-primary)]"
                            : "bg-white/10 text-white/72 hover:bg-white/18 hover:text-white"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                  <p className="mb-3 text-sm font-bold text-white/70">
                    Draft section {activeDesignSection} (fokus: {previewFocusSection}) - {activePreviewViewport.label}{" "}
                    {activePreviewViewport.viewportWidth}x{activePreviewViewport.viewportHeight}
                    {activePreviewViewport.scale !== 1 ? ` skala ${activePreviewViewport.scale}x` : ""}
                  </p>
                  <div className="mb-4 rounded-[8px] border border-white/20 bg-white/10 p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-white/72">
                        Prompt Gambar
                      </p>
                      <button
                        type="button"
                        onClick={copyImageGenerationPrompt}
                        className="rounded-lg bg-white/14 px-3 py-1.5 text-[11px] font-black text-white transition-colors hover:bg-white/22"
                      >
                        Salin prompt
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={imageGenerationPrompt}
                      className="min-h-[128px] w-full rounded-[8px] border border-white/18 bg-white/8 px-3 py-2 text-xs font-semibold leading-5 text-white/88 outline-none"
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <div
                      className={`mx-auto overflow-auto rounded-[8px] bg-white ${activePreviewViewport.frameClass}`}
                    >
	                      <iframe
	                        ref={fullPreviewIframeRef}
	                        key={templatePreviewSrc}
	                        src={templatePreviewSrc}
	                        title="Template live preview"
	                        className="origin-top-left border-0"
	                        onLoad={postFullPreviewSnapshot}
	                        style={{
	                          width: `${activePreviewViewport.viewportWidth}px`,
                          height: `${activePreviewViewport.viewportHeight}px`,
                          transform: `scale(${activePreviewViewport.scale})`,
                          transformOrigin: "top left",
                        }}
                      />
                    </div>
                  </div>
                </div>
              <PublishStepPanel
                visible={editorStep === 9}
                templateDraft={templateDraft}
                isAdvancedOpen={isAdvancedOpen}
                onToggleAdvanced={() => setIsAdvancedOpen((current) => !current)}
                onChangeStatus={(status) => updateTemplateDraft("status", status)}
                templateQualityWarnings={templateQualityWarnings}
                designConfigText={designConfigText}
                onDesignConfigChange={setDesignConfigText}
                onResetMessage={() => setManagerMessage("")}
              />
              </div>
            </div>
            </div>

            <div className={`mt-5 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-4 py-3 text-sm font-black text-[var(--color-primary)] ${editorStep === 9 ? "" : "hidden"}`}>
              Gunakan tombol Simpan di bar bawah untuk menyimpan perubahan.
            </div>

            <TemplateSaveBar
              onPreview={openEditorPreview}
              onSave={saveTemplateDraft}
              isSaving={isSavingTemplate}
            />
          </div>
        ) : null}

        <TemplateCatalogGrid
          visible={!templateDraft}
          filteredTemplates={filteredTemplates}
          isLoadingTemplates={isLoadingTemplates}
          startEditTemplate={startEditTemplate}
          duplicateTemplate={duplicateTemplate}
          toggleTemplateStatus={toggleTemplateStatus}
          deleteTemplate={deleteTemplate}
        />
        <ConfirmationModal
          show={Boolean(deleteTemplateTarget)}
          title="Hapus template ini?"
          description={
            deleteTemplateTarget ? (
              <p>
                Template{" "}
                <span className="font-black text-slate-900">
                  {deleteTemplateTarget.name}
                </span>{" "}
                dengan ID{" "}
                <span className="font-black text-slate-900">
                  {deleteTemplateTarget.id}
                </span>{" "}
                akan dihapus dari katalog. Tindakan ini tidak dapat dibatalkan.
              </p>
            ) : null
          }
          confirmLabel="Ya, Hapus"
          loading={isDeletingTemplate}
          danger
          onClose={() => setDeleteTemplateTarget(null)}
          onConfirm={confirmDeleteTemplate}
        />

        {saveFeedback ? (
          <div className="fixed bottom-20 right-4 z-[120] w-[calc(100%-2rem)] max-w-sm sm:right-6">
            <StatusToast
              tone={saveFeedback.tone}
              message={saveFeedback.text}
              onDismiss={dismissSaveFeedback}
            />
          </div>
        ) : null}
      </motion.section>
  );
}






