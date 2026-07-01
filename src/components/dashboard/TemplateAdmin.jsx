"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  addStoredDeletedTemplateId,
  getStoredDeletedTemplateIds,
  getStoredTemplateOverrides,
  mergeTemplateOverrides,
  upsertStoredTemplateOverride,
} from "../../data/templateAdminDefaults";
import InvitationRenderer from "../../templates/InvitationRenderer";
import {
  getCoupleSectionConfig,
  getCoverSectionConfig,
  getOpeningRevealConfig,
  getOpeningSequenceConfig,
  getSectionStyleConfig,
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
import StepNavigator from "./template-admin/StepNavigator";
import PublishStepPanel from "./template-admin/PublishStepPanel";
import TemplateSaveBar from "./template-admin/TemplateSaveBar";
import MetadataStep from "./template-admin/MetadataStep";
import CoverStep from "./template-admin/CoverStep";
import WidgetsStep from "./template-admin/WidgetsStep";
import TemplateCatalogGrid from "./template-admin/TemplateCatalogGrid";
import OpeningStep from "./template-admin/OpeningStep";
import GlobalStyleStep from "./template-admin/GlobalStyleStep";
import useOrnamentTimelineInteractions from "../../hooks/dashboard/useOrnamentTimelineInteractions";

function parseHexColor(color = "") {
  const normalized = color.replace("#", "").trim();

  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function colorLuminance(color) {
  const rgb = parseHexColor(color);

  if (!rgb) {
    return null;
  }

  const channels = [rgb.r, rgb.g, rgb.b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = colorLuminance(foreground);
  const backgroundLuminance = colorLuminance(background);

  if (foregroundLuminance === null || backgroundLuminance === null) {
    return null;
  }

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

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
  const [designConfigText, setDesignConfigText] = useState("");
  const [activeDesignSection, setActiveDesignSection] = useState("home");
  const [selectedOrnamentIndex, setSelectedOrnamentIndex] = useState(0);
  const [managerMessage, setManagerMessage] = useState("");
  const [templateSource, setTemplateSource] = useState("registry");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [deleteTemplateTarget, setDeleteTemplateTarget] = useState(null);
  const [isDeletingTemplate, setIsDeletingTemplate] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
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
  const editorStepIds = editorSteps.map((step) => step.id);
  const currentStepIndex = Math.max(0, editorStepIds.indexOf(editorStep));
  const totalEditorSteps = editorSteps.length;
  const currentStepNumber = currentStepIndex + 1;
  const previousStepId = currentStepIndex > 0 ? editorStepIds[currentStepIndex - 1] : null;
  const nextStepId =
    currentStepIndex < totalEditorSteps - 1 ? editorStepIds[currentStepIndex + 1] : null;

  useEffect(() => {
    let isMounted = true;
    setIsLoadingTemplates(true);

    fetch("/api/templates?scope=admin")
      .then((response) => response.json())
      .then((result) => {
        if (!isMounted) {
          return;
        }

        if (Array.isArray(result.data)) {
          setItems((currentItems) =>
            mergeTemplateOverrides(result.data.map((template) => {
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
            })),
          );
          setTemplateSource(result.source || "api");
          return;
        }

        setItems([]);
      })
      .catch(() => {
        if (isMounted) {
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
    };
  }, []);

  useEffect(() => {
    if (!templateDraft?.id) {
      setDynamicOrnamentAssets([]);
      return undefined;
    }

    let isMounted = true;
    setIsLoadingOrnamentAssets(true);

    fetch(`/api/templates/ornaments/upload?templateId=${encodeURIComponent(templateDraft.id)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setDynamicOrnamentAssets(result.data);
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

  const parsedDesignConfig = useMemo(() => {
    try {
      return normalizeDesignConfig(designConfigText.trim() ? JSON.parse(designConfigText) : {});
    } catch {
      return null;
    }
  }, [designConfigText]);

  const designSectionNames = useMemo(() => {
    const names = Array.from(
      new Set([
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
      enabled: false,
      animation: "fade",
      sequencePreset: parsedDesignConfig.widgets?.openingSequence?.preset,
      ...(parsedDesignConfig.widgets?.openingReveal || {}),
    };
    const openingAssetConfig = {
      type: "motion",
      duration: 4,
      delay: 0,
      loop: false,
      skippable: true,
      ...(parsedDesignConfig.widgets?.openingSequence?.asset || {}),
    };
    const galleryConfig = {
      enabled: true,
      limit: 6,
      ...(parsedDesignConfig.widgets?.gallery || {}),
    };
    const countdownConfig = {
      enabled: true,
      eventIndex: 0,
      ...(parsedDesignConfig.widgets?.countdown || {}),
    };

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
      enabled: true,
      hasFallbackAccounts: true,
      ...(parsedDesignConfig.widgets?.gift || {}),
    };
    const rsvpConfig = {
      enabled: true,
      hasInvitationSlug: true,
      ...(parsedDesignConfig.widgets?.rsvp || {}),
    };
    const musicConfig = {
      enabled: true,
      hasAudio: true,
      ...(parsedDesignConfig.widgets?.music || {}),
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
  const countdownWidgetConfig = {
    enabled: true,
    eventIndex: 0,
    variant: "cards",
    completeText: "Acara sedang berlangsung",
    ...(parsedDesignConfig?.widgets?.countdown || {}),
  };
  const eventWidgetConfig = {
    enabled: true,
    variant: "cards",
    showMaps: true,
    showIcon: true,
    ...(parsedDesignConfig?.widgets?.events || {}),
  };
  const storyWidgetConfig = {
    enabled: true,
    variant: "card",
    animation: "fade-up",
    ...(parsedDesignConfig?.widgets?.story || {}),
  };
  const galleryWidgetConfig = {
    enabled: true,
    variant: "grid",
    limit: 6,
    includeCover: false,
    ...(parsedDesignConfig?.widgets?.gallery || {}),
  };
  const musicWidgetConfig = {
    enabled: true,
    variant: "floating",
    position: "bottom-right",
    showTrackInfo: true,
    showProgress: true,
    pulseSync: false,
    pulseIntensity: "subtle",
    autoLoop: true,
    ...(parsedDesignConfig?.widgets?.music || {}),
  };
  const giftWidgetConfig = {
    enabled: true,
    variant: "cards",
    copyButton: true,
    showQr: false,
    hasFallbackAccounts: true,
    ...(parsedDesignConfig?.widgets?.gift || {}),
  };
  const rsvpWidgetConfig = {
    enabled: true,
    variant: "form",
    showPax: true,
    showMessage: true,
    requireGuestName: false,
    hasInvitationSlug: true,
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
  const previewFocusSection = useMemo(
    () => mapDesignSectionToPreviewSection(activeDesignSection),
    [activeDesignSection],
  );
  const templatePreviewSrc = useMemo(() => {
    const previewTemplateId = templateDraft?.id || "standard";
    const guestQuery =
      previewGuestMode === "withGuest"
        ? `&previewGuest=${encodeURIComponent("Bapak/Ibu Preview")}`
        : "";

    return `/preview?templateId=${encodeURIComponent(previewTemplateId)}&editorPreview=1&embeddedEditorPreview=1&focusSection=${encodeURIComponent(previewFocusSection)}&previewTick=${templatePreviewTick}&previewDataMode=${encodeURIComponent(previewDataMode)}${guestQuery}`;
  }, [
    previewDataMode,
    previewFocusSection,
    previewGuestMode,
    templateDraft?.id,
    templatePreviewTick,
  ]);
  const previewConfigVersion = useMemo(() => {
    let hash = 0;
    for (let index = 0; index < designConfigText.length; index += 1) {
      hash = (hash * 31 + designConfigText.charCodeAt(index)) >>> 0;
    }
    return hash.toString(36);
  }, [designConfigText]);
  const coverSectionPreviewSrc = useMemo(() => {
    const previewTemplateId = templateDraft?.id || "standard";
    const guestQuery =
      previewGuestMode === "withGuest"
        ? `&previewGuest=${encodeURIComponent("Bapak/Ibu Preview")}`
        : "";

    return `/preview?templateId=${encodeURIComponent(previewTemplateId)}&editorPreview=1&embeddedEditorPreview=1&focusSection=home&previewSectionOnly=1&disableOpeningOverlay=1&previewTick=${templatePreviewTick}-${previewConfigVersion}&previewDataMode=${encodeURIComponent(previewDataMode)}${guestQuery}`;
  }, [
    previewDataMode,
    previewConfigVersion,
    previewGuestMode,
    templateDraft?.id,
    templatePreviewTick,
  ]);
  const fullTemplatePreviewSrc = `${templatePreviewSrc.replace(
    "&embeddedEditorPreview=1",
    "",
  )}&viewport=${encodeURIComponent(previewViewport)}`;
  const openingSectionPreviewSrc = useMemo(() => {
    const previewTemplateId = templateDraft?.id || "standard";
    const guestQuery =
      previewGuestMode === "withGuest"
        ? `&previewGuest=${encodeURIComponent("Bapak/Ibu Preview")}`
        : "";
    return `/preview?templateId=${encodeURIComponent(previewTemplateId)}&editorPreview=1&embeddedEditorPreview=1&previewOpening=1&focusSection=home&previewSectionOnly=1&previewTick=${templatePreviewTick}-${previewConfigVersion}&previewDataMode=${encodeURIComponent(previewDataMode)}${guestQuery}`;
  }, [previewConfigVersion, previewDataMode, previewGuestMode, templateDraft?.id, templatePreviewTick]);
  const ornamentSectionPreviewSrc = useMemo(() => {
    const previewTemplateId = templateDraft?.id || "standard";
    const guestQuery =
      previewGuestMode === "withGuest"
        ? `&previewGuest=${encodeURIComponent("Bapak/Ibu Preview")}`
        : "";

    return `/preview?templateId=${encodeURIComponent(previewTemplateId)}&editorPreview=1&embeddedEditorPreview=1&mobileFrame=1&focusSection=${encodeURIComponent(previewFocusSection)}&disableOpeningOverlay=1&previewTick=${templatePreviewTick}-${previewConfigVersion}&previewDataMode=${encodeURIComponent(previewDataMode)}${guestQuery}`;
  }, [
    previewConfigVersion,
    previewDataMode,
    previewFocusSection,
    previewGuestMode,
    templateDraft?.id,
    templatePreviewTick,
  ]);
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
        ? {
            id: templateDraft.id,
            image: templateDraft.image,
            designConfig: parsedDesignConfig || {},
          }
        : null,
    [parsedDesignConfig, templateDraft],
  );

  const postFullPreviewSnapshot = () => {
    if (!editorPreviewSnapshot || !fullPreviewIframeRef.current?.contentWindow) {
      return;
    }

    fullPreviewIframeRef.current.contentWindow.postMessage(
      {
        type: "nusa-invite:editor-preview-update",
        payload: editorPreviewSnapshot,
      },
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

    try {
      const previewSnapshot = {
        id: templateDraft.id,
        image: templateDraft.image,
        designConfig: parsedDesignConfig || {},
      };
      window.sessionStorage.setItem(
        "nusa-invite:editor-preview-template",
        JSON.stringify(previewSnapshot),
      );
    } catch {
      return;
    }

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

    try {
      const previewSnapshot = {
        id: templateDraft.id,
        image: templateDraft.image,
        designConfig: nextConfig,
      };
      window.sessionStorage.setItem(
        "nusa-invite:editor-preview-template",
        JSON.stringify(previewSnapshot),
      );
    } catch {
      setManagerMessage("Gagal menyiapkan editor preview.");
      return;
    }

    const previewUrl = `/preview?templateId=${encodeURIComponent(templateDraft.id)}&editorPreview=1`;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const writeDesignConfig = (nextConfig) => {
    setDesignConfigText(JSON.stringify(nextConfig, null, 2));
    setManagerMessage("");
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

  const updateOrnament = (field, value) => {
    if (!parsedDesignConfig || !selectedOrnament) {
      return;
    }

    const ornaments = {
      ...(parsedDesignConfig.ornaments || {}),
      [activeDesignSection]: [...activeOrnaments],
    };
    const index = Math.min(selectedOrnamentIndex, ornaments[activeDesignSection].length - 1);
    ornaments[activeDesignSection][index] = {
      ...ornaments[activeDesignSection][index],
      [field]: value,
    };

    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments,
    });
  };

  const updateOrnamentAtIndex = (index, patch) => {
    if (!parsedDesignConfig) return;
    const sectionOrnaments = [...activeOrnaments];
    if (!sectionOrnaments[index]) return;
    sectionOrnaments[index] = { ...sectionOrnaments[index], ...patch };
    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [activeDesignSection]: sectionOrnaments,
      },
    });
  };

  const toggleGlobalOrnamentExclusion = (sectionName) => {
    if (!parsedDesignConfig || !sectionName) return;

    const currentExclusions = parsedDesignConfig.ornamentExclusions || {};
    const globalExclusions = Array.isArray(currentExclusions.global)
      ? currentExclusions.global
      : [];
    const nextGlobalExclusions = globalExclusions.includes(sectionName)
      ? globalExclusions.filter((item) => item !== sectionName)
      : [...globalExclusions, sectionName];

    writeDesignConfig({
      ...parsedDesignConfig,
      ornamentExclusions: {
        ...currentExclusions,
        global: nextGlobalExclusions,
      },
    });
  };

  useOrnamentTimelineInteractions({
    timelineInteraction,
    setTimelineInteraction,
    timelineSnapEnabled,
    timelineSnapUnit,
    updateOrnamentAtIndex,
    editorStep,
    selectedOrnament,
    selectedOrnamentIndex,
    activeOrnaments,
  });

  const updateCountdownWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        countdown: {
          ...countdownWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateEventWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        events: {
          ...eventWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateStoryWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        story: {
          ...storyWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateGalleryWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        gallery: {
          ...galleryWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateMusicWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        music: {
          ...musicWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateGiftWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        gift: {
          ...giftWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateRsvpWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        rsvp: {
          ...rsvpWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateOpeningRevealWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        openingReveal: {
          ...openingRevealWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateOpeningSequenceWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        openingSequence: {
          ...openingSequenceWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateOpeningSequenceAsset = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    updateOpeningSequenceAssetFields({ [field]: value });
  };

  const updateOpeningSequenceAssetFields = (fields) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        openingSequence: {
          ...openingSequenceWidgetConfig,
          asset: {
            ...(openingSequenceWidgetConfig.asset || {}),
            ...fields,
          },
        },
      },
    });
  };

  const updateOpeningSequenceAssetFile = async (field, file) => {
    if (!file || !parsedDesignConfig) {
      return;
    }

    const assetType = field === "poster" ? "poster" : openingSequenceWidgetConfig.asset?.type || "motion";
    const formData = new FormData();
    formData.append("templateId", templateDraft?.id || "template");
    formData.append("assetType", assetType);
    formData.append("assetRole", field);
    formData.append("file", file);

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

    const previewUrl = await readFileAsDataUrl(file);
    updateOpeningSequenceAsset(field, previewUrl);
  };

  const updateOpeningRevealImage = async (field, file) => {
    if (!file || !parsedDesignConfig) {
      return;
    }

    const previewUrl = await readFileAsDataUrl(file);
    updateOpeningRevealWidget(field, previewUrl);
  };

  const updateCoverBackgroundImage = async (file) => {
    if (!file || !parsedDesignConfig) {
      return;
    }

    const previewUrl = await readFileAsDataUrl(file);
    updateTemplateSectionConfig("home", "backgroundImage", previewUrl);
  };

  const updateTemplateSectionConfig = (section, field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      sections: {
        ...(parsedDesignConfig.sections || {}),
        [section]: {
          ...(parsedDesignConfig.sections?.[section] || {}),
          [field]: value,
        },
      },
    });
  };

  const updateGlobalSectionStyle = (field, value) => {
    updateTemplateSectionConfig("global", field, value);
  };

  const applyColorPalette = (palette) => {
    if (!parsedDesignConfig || !palette) {
      return;
    }

    const nextSections = { ...(parsedDesignConfig.sections || {}) };
    nextSections.global = {
      ...(nextSections.global || {}),
      backgroundColor: palette.colors.bg,
      primaryColor: palette.colors.primary,
      textColor: palette.colors.text,
      accentColor: palette.colors.accent,
    };

    Object.keys(nextSections)
      .filter((sectionKey) => sectionKey !== "global")
      .forEach((sectionKey) => {
        const prevSection = nextSections[sectionKey] || {};
        nextSections[sectionKey] = {
          ...prevSection,
          useGlobal: true,
          backgroundColor: palette.colors.bg,
          textColor: palette.colors.text,
          accentColor: palette.colors.accent,
        };
      });

    writeDesignConfig({
      ...parsedDesignConfig,
      sections: nextSections,
      palette: palette.id,
    });
    setManagerMessage(`Palette "${palette.label}" diterapkan.`);
  };

  const toggleSectionOverride = (section, enabled) => {
    updateTemplateSectionConfig(section, "useGlobal", !enabled);
  };

  const updateSectionAnimation = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      animations: {
        ...(parsedDesignConfig.animations || {}),
        sections: {
          ...(parsedDesignConfig.animations?.sections || {}),
          [activeDesignSection]: {
            ...sectionAnimationConfig,
            [field]: value,
          },
        },
      },
    });
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

    if (
      ["image/png", "image/webp"].includes(file.type) &&
      file.size > ornamentMaxRasterFileSize
    ) {
      setUploadValidationWarning(
        `${file.name} berukuran ${(file.size / 1024 / 1024).toFixed(2)} MB. Untuk ornament PNG/WebP, usahakan maksimal 1 MB atau pakai SVG/WebP terkompres.`,
      );
    } else {
      setUploadValidationWarning("");
    }

    const previewUrl = await readFileAsDataUrl(file);
    updateOrnament("src", previewUrl);
    setIsUploadingOrnament(true);
    setManagerMessage("");

    try {
      const formData = new FormData();
      formData.append("templateId", templateDraft.id);
      formData.append("section", activeDesignSection || "home");
      formData.append("ornamentId", selectedOrnament.id || "ornament");
      formData.append("file", file);

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
          name: file.name?.replace(/\.[^.]+$/, "") || `${selectedOrnament.id || "Ornament"} Upload`,
          src: assetUrl,
          storagePath: result.data.storagePath || "",
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
    const response = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(template),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Gagal menyimpan template");
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
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus template");
      }

      if (result.source !== "supabase") {
        addStoredDeletedTemplateId(template.id);
      }

      setTemplateSource(result.source || templateSource);
      setManagerMessage(
        result.source === "supabase"
          ? "Template berhasil dihapus dari Supabase."
          : "Template dihapus dari katalog lokal.",
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

    try {
      const result = await persistTemplate(nextTemplate);
      setTemplateSource(result.source || templateSource);
      setManagerMessage(
        result.source === "supabase"
          ? "Status template tersimpan ke Supabase."
          : "Status template tersimpan sementara. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setManagerMessage(error.message);
    }
  };

  const duplicateTemplate = async (template) => {
    if (!template?.id) {
      return;
    }

    const reservedIds = new Set([
      ...items.map((item) => item.id),
      ...getStoredTemplateOverrides().map((item) => item.id),
      ...getStoredDeletedTemplateIds(),
    ]);
    const baseId = `${template.id}-copy`;
    let nextId = baseId;
    let counter = 2;
    while (reservedIds.has(nextId)) {
      nextId = `${baseId}-${counter}`;
      counter += 1;
    }

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
    setManagerMessage("Menyalin template...");

    try {
      const result = await persistTemplate(duplicated);
      if (result.source !== "supabase") {
        upsertStoredTemplateOverride(duplicated);
      }
      const nextTemplate = { ...duplicated, ...result.data };
      setItems((currentItems) => [
        nextTemplate,
        ...currentItems.filter((item) => item.id !== nextTemplate.id),
      ]);
      setTemplateSource(result.source || templateSource);
      startEditTemplate(nextTemplate);
      setManagerMessage(
        result.source === "supabase"
          ? "Template berhasil diduplikat. Salinan dibuka untuk diedit."
          : "Template diduplikat ke katalog lokal. Supabase belum dikonfigurasi.",
      );
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
    const baseId = "template-baru";
    const reservedIds = new Set([
      ...items.map((template) => template.id),
      ...getStoredTemplateOverrides().map((template) => template.id),
      ...getStoredDeletedTemplateIds(),
    ]);
    let nextId = baseId;
    let counter = 2;

    while (reservedIds.has(nextId)) {
      nextId = `${baseId}-${counter}`;
      counter += 1;
    }

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
        const nextId = slugifyTemplateId(value);
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

    const previewUrl = await readFileAsDataUrl(file);
    updateTemplateDraft("image", previewUrl);

    if (!templateDraft?.id) {
      return;
    }

    setIsUploadingThumbnail(true);
    setManagerMessage("");

    try {
      const formData = new FormData();
      formData.append("templateId", templateDraft.id);
      formData.append("file", file);

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

    const normalizedId = slugifyTemplateId(templateDraft.id);

    if (!normalizedId || !templateDraft.name || !templateDraft.category) {
      setManagerMessage("Template ID, nama, dan kategori wajib diisi.");
      return;
    }

    const duplicateTemplate = items.find(
      (template) => template.id === normalizedId && template.id !== editingTemplateId,
    );
    if (duplicateTemplate) {
      setManagerMessage(`Template ID "${normalizedId}" sudah dipakai.`);
      return;
    }

    let parsedDesignConfig = {};
    try {
      parsedDesignConfig = normalizeDesignConfig(
        designConfigText.trim() ? JSON.parse(designConfigText) : {},
      );
    } catch {
      setManagerMessage("Design config JSON belum valid.");
      return;
    }

    const draftToSave = {
      ...templateDraft,
      id: normalizedId,
      previewUrl: `/preview?templateId=${encodeURIComponent(normalizedId)}`,
      designConfig: parsedDesignConfig,
    };

    const saveStartedAt = Date.now();
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
      const result = await persistTemplate(draftToSave);
      if (result.source !== "supabase") {
        upsertStoredTemplateOverride(draftToSave);
      }
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
      setManagerMessage(
        result.source === "supabase"
          ? "Template berhasil disimpan."
          : "Template tersimpan ke katalog lokal. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setManagerMessage(error.message);
    } finally {
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
        className="template-admin-editor rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-6 shadow-[var(--dash-shadow)]"
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
              <CoverStep
                visible={editorStep === 4}
                coverSectionConfig={coverSectionConfig}
                updateTemplateSectionConfig={updateTemplateSectionConfig}
                coverLayoutOptions={coverLayoutOptions}
                coverDateVariantOptions={coverDateVariantOptions}
                coverOpeningAnimationOptions={coverOpeningAnimationOptions}
                coverBackgroundModeOptions={coverBackgroundModeOptions}
                updateCoverBackgroundImage={updateCoverBackgroundImage}
                coverPreviewSrc={coverSectionPreviewSrc}
              />
              <GlobalStyleStep
                visible={editorStep === 3}
                colorPalettePresets={colorPalettePresets}
                parsedDesignConfig={parsedDesignConfig}
                applyColorPalette={applyColorPalette}
                globalSectionStyleConfig={globalSectionStyleConfig}
                updateGlobalSectionStyle={updateGlobalSectionStyle}
                updateTemplateSectionConfig={updateTemplateSectionConfig}
                headingFontOptions={headingFontOptions}
                bodyFontOptions={bodyFontOptions}
                sectionSpacingPresetOptions={sectionSpacingPresetOptions}
                sectionEntranceOptions={sectionEntranceOptions}
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
              <div id="template-ornaments" className={`scroll-mt-24 md:col-span-2 ${editorStep === 7 ? "" : "hidden"}`}>
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
                    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                      <div className="min-w-0 space-y-4">
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
                      />
                    </div>
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
      </motion.section>
  );
}






