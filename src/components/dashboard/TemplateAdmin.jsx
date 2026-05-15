"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { sampleInvitation } from "../../data/sampleInvitation";
import {
  addStoredDeletedTemplateId,
  getStoredDeletedTemplateIds,
  getStoredTemplateOverrides,
  mergeTemplateOverrides,
  upsertStoredTemplateOverride,
} from "../../data/templateAdminDefaults";
import InvitationRenderer from "../../templates/InvitationRenderer";
import OrnamentLayer from "../../templates/components/OrnamentLayer";
import {
  getCoupleSectionConfig,
  getCoverSectionConfig,
  getOpeningRevealConfig,
  getSectionOrnaments,
  getSectionStyleConfig,
  normalizeDesignConfig,
} from "../../templates/designConfigs";
import {
  templates,
  fadeUp,
  templateStylePresets,
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
import { Field, TextInput, SelectInput, ToggleField } from "./FormControls";
import {
  countdownPreviewClasses,
  CountdownWidgetPreview,
  WidgetPreviewShell,
  StoryWidgetPreview,
  GalleryWidgetPreview,
  EventWidgetPreview,
  OpeningRevealPreview,
  coverPreviewMotionClass,
  CoverSectionPreview,
  couplePreviewImageClass,
  couplePreviewNameClass,
  CoupleSectionPreview,
  OrnamentSectionCanvasPreview,
  readFileAsDataUrl,
  parseOrnamentSize,
  slugifyTemplateId,
  MusicPlayerPreview,
} from "./WidgetPreviews";

function TemplateStatusPill({ status }) {
  const isActive = status === "active";
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.08em] ${
        isActive
          ? "bg-[var(--color-wa)] text-white"
          : "bg-[var(--color-section-soft)] text-[var(--color-text)]"
      }`}
    >
      {isActive ? "Active" : "Hidden"}
    </span>
  );
}

function MiniInput({ label, value, onChange, type = "text", step, disabled }) {
  const handleChange = (event) => {
    if (disabled) return;
    onChange(type === "number" ? Number(event.target.value) : event.target.value);
  };
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
        {label}
      </span>
      <input
        type={type}
        step={step}
        value={value ?? ""}
        disabled={disabled}
        readOnly={disabled}
        onChange={handleChange}
        className={`mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)] ${disabled ? 'bg-[var(--color-bg)] text-[var(--color-text)]/50 cursor-not-allowed' : ''}`}
      />
    </label>
  );
}

export default
function TemplateAdminPage() {
  const editorSteps = [
    { id: 1, label: "Basic" },
    { id: 2, label: "Style" },
    { id: 3, label: "Opening" },
    { id: 4, label: "Widgets" },
    { id: 5, label: "Ornaments" },
    { id: 6, label: "Preview" },
    { id: 7, label: "Publish" },
  ];
  const [items, setItems] = useState(templates);
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
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingOrnament, setIsUploadingOrnament] = useState(false);
  const [dynamicOrnamentAssets, setDynamicOrnamentAssets] = useState([]);
  const [isLoadingOrnamentAssets, setIsLoadingOrnamentAssets] = useState(false);
  const [previewViewport, setPreviewViewport] = useState("mobile");
  const [templatePreviewTick, setTemplatePreviewTick] = useState(0);
  const [uploadValidationWarning, setUploadValidationWarning] = useState("");
  const [selectedTemplatePreset, setSelectedTemplatePreset] = useState(templateStylePresets[0].id);
  const [editorStep, setEditorStep] = useState(1);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [previewEntranceKey, setPreviewEntranceKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/templates?scope=admin")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data) && result.data.length > 0) {
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
        } else if (isMounted) {
          setItems(mergeTemplateOverrides(templates));
        }
      })
      .catch(() => {
        if (isMounted) {
          setItems(mergeTemplateOverrides(templates));
          setTemplateSource("registry");
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
        ...Object.keys(parsedDesignConfig?.ornaments || {}),
        ...Object.keys(parsedDesignConfig?.sections || {}),
      ]),
    );
    return names.length > 0 ? names : ["home"];
  }, [parsedDesignConfig]);

  const activeOrnaments = parsedDesignConfig?.ornaments?.[activeDesignSection] || [];
  const previewOrnaments = useMemo(
    () => getSectionOrnaments(parsedDesignConfig || {}, activeDesignSection),
    [parsedDesignConfig, activeDesignSection],
  );
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

    if (!presetSections.includes(activeDesignSection) && activeDesignSection !== "section") {
      warnings.push(
        `Section "${activeDesignSection}" belum termasuk preset template ini. Ornament mungkin tidak tampil di template publik.`,
      );
    }

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
        warnings.push(`${label}: width ${width}px cukup besar untuk canvas mobile. Cek lagi di Mobile 430.`);
      }
    });

    if (uploadValidationWarning) {
      warnings.push(uploadValidationWarning);
    }

    return warnings;
  }, [
    activeDesignSection,
    activeOrnaments,
    parsedDesignConfig,
    templateDraft,
    uploadValidationWarning,
  ]);
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
  const coverSectionConfig = getCoverSectionConfig(parsedDesignConfig || {});
  const openingRevealWidgetConfig = getOpeningRevealConfig(parsedDesignConfig || {});
  const coupleSectionConfig = getCoupleSectionConfig(parsedDesignConfig || {});
  const globalSectionStyleConfig = getSectionStyleConfig(parsedDesignConfig || {}, "global");
  const activeSectionStyleConfig = getSectionStyleConfig(
    parsedDesignConfig || {},
    activeDesignSection,
  );
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
    const previewTemplateId = templateDraft?.id || sampleInvitation.templateId;
    return `/preview?templateId=${encodeURIComponent(previewTemplateId)}&editorPreview=1&focusSection=${encodeURIComponent(previewFocusSection)}&previewTick=${templatePreviewTick}`;
  }, [previewFocusSection, templateDraft?.id, templatePreviewTick]);

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

    const timeoutId = window.setTimeout(() => {
      setTemplatePreviewTick((current) => current + 1);
    }, 120);

    return () => window.clearTimeout(timeoutId);
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

    return {
      ...normalizedConfig,
      ornaments: presetSections.reduce(
        (ornaments, section) => ({
          ...ornaments,
          [section]: currentOrnaments[section] || [],
        }),
        {},
      ),
      sections: presetSections.reduce(
        (sections, section) => ({
          ...sections,
          [section]: currentSections[section] || {},
        }),
        {},
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
    
    // Trigger preview refresh for immediate visual feedback
    setPreviewEntranceKey(k => k + 1);
  };

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

  const applyTemplateStylePreset = (scope = "template") => {
    if (!parsedDesignConfig || !activeTemplatePreset) {
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

    if (scope === "template") {
      nextSections.global = {
        ...(nextSections.global || {}),
        ...activeTemplatePreset.sectionStyle,
      };
    }

    targetSections.forEach((section) => {
      nextSections[section] = {
        ...(nextSections[section] || {}),
        ...activeTemplatePreset.sectionStyle,
        useGlobal: false,
        ...(section === "home" ? activeTemplatePreset.cover : {}),
      };
      nextAnimations.sections[section] = {
        ...(nextAnimations.sections[section] || {}),
        ...activeTemplatePreset.animation,
      };
    });

    writeDesignConfig({
      ...parsedDesignConfig,
      preset: activeTemplatePreset.id,
      sections: nextSections,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        openingReveal: {
          ...openingRevealWidgetConfig,
          ...(activeTemplatePreset.widgets.openingReveal || {}),
        },
        countdown: {
          ...countdownWidgetConfig,
          ...(activeTemplatePreset.widgets.countdown || {}),
        },
        events: {
          ...eventWidgetConfig,
          ...(activeTemplatePreset.widgets.events || {}),
        },
        story: {
          ...storyWidgetConfig,
          ...(activeTemplatePreset.widgets.story || {}),
        },
        gallery: {
          ...galleryWidgetConfig,
          ...(activeTemplatePreset.widgets.gallery || {}),
        },
      },
      animations: nextAnimations,
    });
    setManagerMessage(
      scope === "section"
        ? `${activeTemplatePreset.label} diterapkan ke section ${activeDesignSection}.`
        : `${activeTemplatePreset.label} diterapkan ke template.`,
    );
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

    let nextIndex = currentIndex;
    if (mode === "up") {
      nextIndex = Math.min(activeOrnaments.length - 1, currentIndex + 1);
    }
    if (mode === "down") {
      nextIndex = Math.max(0, currentIndex - 1);
    }
    if (mode === "front") {
      nextIndex = activeOrnaments.length - 1;
    }
    if (mode === "back") {
      nextIndex = 0;
    }

    if (nextIndex === currentIndex) {
      return;
    }

    const nextOrnaments = [...activeOrnaments];
    const [movedOrnament] = nextOrnaments.splice(currentIndex, 1);
    nextOrnaments.splice(nextIndex, 0, movedOrnament);

    const normalizedOrnaments = nextOrnaments.map((ornament, index) => ({
      ...ornament,
      zIndex: index + 1,
    }));

    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [activeDesignSection]: normalizedOrnaments,
      },
    });
    setSelectedOrnamentIndex(nextIndex);
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

  const deleteTemplate = async (template) => {
    if (!template?.id) {
      return;
    }

    const confirmed = window.confirm(`Hapus template "${template.name}" dari katalog?`);
    if (!confirmed) {
      return;
    }

    const previousItems = items;

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
        const nextId = slugifyTemplateId(value);
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

    if (!templateDraft.id || !templateDraft.name || !templateDraft.category) {
      setManagerMessage("Template ID, nama, dan kategori wajib diisi.");
      return;
    }

    const duplicateTemplate = items.find(
      (template) => template.id === templateDraft.id && template.id !== editingTemplateId,
    );
    if (duplicateTemplate) {
      setManagerMessage(`Template ID "${templateDraft.id}" sudah dipakai.`);
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
      previewUrl:
        templateDraft.previewUrl ||
        `/preview?templateId=${encodeURIComponent(templateDraft.id)}`,
      designConfig: parsedDesignConfig,
    };

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
      setItems((currentItems) => {
        const nextTemplate = { ...draftToSave, ...result.data };

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
      setEditingTemplateId(null);
      setTemplateDraft(null);
      setDesignConfigText("");
      setActiveDesignSection("home");
      setSelectedOrnamentIndex(0);
      setEditorStep(1);
      setIsAdvancedOpen(false);
      setManagerMessage(
        result.source === "supabase"
          ? "Template tersimpan ke Supabase."
          : "Template tersimpan ke katalog lokal. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setManagerMessage(error.message);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  return (
    <motion.section
        variants={fadeUp}
        className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 shadow-xl shadow-[var(--color-primary)]/8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[var(--color-primary)]">Template Manager</h2>
            <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
              {templateDraft
                ? "Edit template dengan workflow terfokus."
                : "Kelola katalog template, status, preview, dan metadata penjualan."}
            </p>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Source: {templateSource}
            </p>
          </div>
          {templateDraft ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openEditorPreview}
                className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-5 py-3 text-base font-black text-[var(--color-primary)]"
              >
                Preview
              </button>
              <button
                type="button"
                onClick={saveTemplateDraft}
                disabled={isSavingTemplate}
                className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] disabled:opacity-60"
              >
                {isSavingTemplate ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={cancelEditTemplate}
                className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-5 py-3 text-base font-black text-[var(--color-primary)]"
              >
                Katalog
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={startCreateTemplate}
              className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)]"
            >
              Tambah Template
            </button>
          )}
        </div>

        {!templateDraft ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Total Template
            </p>
            <p className="mt-2 text-3xl font-black text-[var(--color-primary)]">{counts.total}</p>
          </div>
          <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Active
            </p>
            <p className="mt-2 text-3xl font-black text-[var(--color-primary)]">{counts.active}</p>
          </div>
          <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Hidden
            </p>
            <p className="mt-2 text-3xl font-black text-[var(--color-primary)]">{counts.hidden}</p>
          </div>
        </div>
        ) : null}

        {!templateDraft ? (
        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_220px_180px]">
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  Edit Metadata
                </p>
                <h3 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
                  {editingTemplateId ? templateDraft.name : "Template Baru"}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                  {templateDraft.id}
                </p>
              </div>
              <img
                src={templateDraft.image}
                alt={`Preview ${templateDraft.name}`}
                className="aspect-[4/5] w-28 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] object-cover"
              />
            </div>

            <div className="mt-5 rounded-[8px] border border-[var(--color-accent-pale)] bg-white/95 p-3 shadow-lg shadow-[var(--color-primary)]/8 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  Step {editorStep} / {editorSteps.length}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditorStep((current) => Math.max(1, current - 1))}
                    disabled={editorStep === 1}
                    className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-primary)] disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditorStep((current) => Math.min(editorSteps.length, current + 1))
                    }
                    disabled={editorStep === editorSteps.length}
                    className="rounded-xl bg-[var(--color-primary)] px-3 py-1.5 text-xs font-black text-white disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[var(--color-bg)]">
                <div
                  className="h-2 rounded-full bg-[var(--color-accent)] transition-all duration-300"
                  style={{ width: `${(editorStep / editorSteps.length) * 100}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {editorSteps.map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setEditorStep(step.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-black transition-colors ${
                      editorStep === step.id
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)]"
                    }`}
                  >
                    {step.label}
                  </button>
                ))}
              </div>
            </div>

            <div id="template-basic" className={`mt-5 scroll-mt-24 ${editorStep === 1 ? "" : "hidden"}`}>
              <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Basic
                  </p>
                  <h4 className="text-2xl font-black text-[var(--color-primary)]">
                    {editingTemplateId ? "Edit Template" : "Buat Template Baru"}
                  </h4>
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Template ID">
                      <TextInput
                        value={templateDraft.id}
                        onChange={(event) => updateTemplateDraft("id", event.target.value)}
                        disabled={Boolean(editingTemplateId)}
                      />
                    </Field>
                    <Field label="Nama Template">
                      <TextInput
                        value={templateDraft.name}
                        onChange={(event) => updateTemplateDraft("name", event.target.value)}
                      />
                    </Field>
                    <Field label="Kategori">
                      <SelectInput
                        value={templateDraft.category}
                        onChange={(event) => updateTemplateDraft("category", event.target.value)}
                      >
                        {templateCategoryOptions.map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </SelectInput>
                    </Field>
                    <Field label="Harga">
                      <TextInput
                        value={templateDraft.price}
                        onChange={(event) => updateTemplateDraft("price", event.target.value)}
                      />
                    </Field>
                    <Field label="Badge">
                      <SelectInput
                        value={selectedBadgeOption}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          updateTemplateDraft("badge", nextValue === "Custom" ? "" : nextValue);
                        }}
                      >
                        {templateBadgeOptions.map((badgeOption) => (
                          <option key={badgeOption} value={badgeOption}>
                            {badgeOption}
                          </option>
                        ))}
                      </SelectInput>
                    </Field>
                    <Field label="Status">
                      <SelectInput
                        value={templateDraft.status}
                        onChange={(event) => updateTemplateDraft("status", event.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="hidden">Hidden</option>
                      </SelectInput>
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Preview URL">
                        <TextInput
                          value={templateDraft.previewUrl || ""}
                          onChange={(event) => updateTemplateDraft("previewUrl", event.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Deskripsi">
                        <textarea
                          value={templateDraft.description}
                          onChange={(event) => updateTemplateDraft("description", event.target.value)}
                          rows={4}
                          className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold leading-7 text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        />
                      </Field>
                    </div>
                    {selectedBadgeOption === "Custom" ? (
                      <div className="md:col-span-2">
                        <Field label="Badge Custom">
                          <TextInput
                            value={templateDraft.badge || ""}
                            onChange={(event) => updateTemplateDraft("badge", event.target.value)}
                            placeholder="Contoh: Editor Pick"
                          />
                        </Field>
                      </div>
                    ) : null}
                  </div>
                  <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                      Thumbnail
                    </p>
                    <img
                      src={templateDraft.image}
                      alt={`Preview ${templateDraft.name}`}
                      className="mt-3 aspect-[4/5] w-full rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] object-cover"
                    />
                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => updateTemplateThumbnail(event.target.files?.[0])}
                        className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-sm font-bold text-[var(--color-primary)] outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-[var(--color-primary)] file:px-4 file:py-2 file:text-sm file:font-black file:text-white"
                      />
                      {isUploadingThumbnail ? (
                        <p className="mt-2 text-sm font-black text-[var(--color-accent)]">
                          Mengupload thumbnail...
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className={`scroll-mt-24 md:col-span-2 ${editorStep === 2 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Color Palette
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                    Pilih palette warna. 1 klik apply ke seluruh undangan.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {colorPalettePresets.map((palette) => (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => {
                          if (!parsedDesignConfig) return;
                          const nextSections = { ...(parsedDesignConfig.sections || {}) };
                          nextSections.global = {
                            ...(nextSections.global || {}),
                            backgroundColor: palette.colors.bg,
                            textColor: palette.colors.text,
                            accentColor: palette.colors.accent,
                          };
                          writeDesignConfig({ ...parsedDesignConfig, sections: nextSections, palette: palette.id });
                          setManagerMessage(`Palette "${palette.label}" diterapkan.`);
                        }}
                        className={`rounded-xl border-2 p-3 text-left transition-all hover:shadow-md ${
                          parsedDesignConfig?.palette === palette.id
                            ? "border-[var(--color-accent)] shadow-md"
                            : "border-[var(--color-accent-pale)]"
                        }`}
                      >
                        <div className="flex gap-1.5">
                          <span className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: palette.colors.primary }} />
                          <span className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: palette.colors.accent }} />
                          <span className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: palette.colors.bg }} />
                        </div>
                        <p className="mt-2 text-xs font-black text-[var(--color-primary)]">{palette.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`scroll-mt-24 md:col-span-2 ${editorStep === 2 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Typography
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                    Pilih font heading (nama, judul) dan body (paragraf, deskripsi).
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                        Heading Font
                      </span>
                      <select
                        value={globalSectionStyleConfig.headingFont || ""}
                        onChange={(event) => updateGlobalSectionStyle("headingFont", event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                      >
                        <option value="">Default</option>
                        {headingFontOptions.map((font) => (
                          <option key={font.id} value={font.id}>
                            {font.label} — {font.vibe}
                          </option>
                        ))}
                      </select>
                      {globalSectionStyleConfig.headingFont ? (
                        <p className="mt-2 text-lg text-[var(--color-primary)]" style={{ fontFamily: headingFontOptions.find((f) => f.id === globalSectionStyleConfig.headingFont)?.family }}>
                          Dimas & Salsa
                        </p>
                      ) : null}
                    </label>
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                        Body Font
                      </span>
                      <select
                        value={globalSectionStyleConfig.bodyFont || ""}
                        onChange={(event) => updateGlobalSectionStyle("bodyFont", event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                      >
                        <option value="">Default</option>
                        {bodyFontOptions.map((font) => (
                          <option key={font.id} value={font.id}>
                            {font.label} — {font.vibe}
                          </option>
                        ))}
                      </select>
                      {globalSectionStyleConfig.bodyFont ? (
                        <p className="mt-2 text-sm text-[var(--color-text)]" style={{ fontFamily: bodyFontOptions.find((f) => f.id === globalSectionStyleConfig.bodyFont)?.family }}>
                          Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup.
                        </p>
                      ) : null}
                    </label>
                  </div>
                </div>
              </div>
              <div className={`scroll-mt-24 md:col-span-2 ${editorStep === 2 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Layout & Animation
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                    Atur spacing, animasi masuk, dan style card untuk seluruh undangan.
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                        Spacing
                      </span>
                      <select
                        value={globalSectionStyleConfig.spacingPreset || "normal"}
                        onChange={(event) => updateGlobalSectionStyle("spacingPreset", event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                      >
                        {sectionSpacingPresetOptions.map((preset) => (
                          <option key={preset} value={preset}>{preset}</option>
                        ))}
                      </select>
                      <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                        {globalSectionStyleConfig.spacingPreset === "compact" ? "Padding kecil, konten rapat" : globalSectionStyleConfig.spacingPreset === "roomy" ? "Padding besar, lega dan premium" : "Padding standar, seimbang"}
                      </p>
                    </label>
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                        Entrance Animation
                      </span>
                      <select
                        value={globalSectionStyleConfig.entranceAnimation || "fade-up"}
                        onChange={(event) => updateGlobalSectionStyle("entranceAnimation", event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                      >
                        {sectionEntranceOptions.map((anim) => (
                          <option key={anim} value={anim}>{anim}</option>
                        ))}
                      </select>
                      <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                        Animasi saat section muncul di viewport
                      </p>
                    </label>
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                        Card Style
                      </span>
                      <select
                        value={globalSectionStyleConfig.cardStyle || "rounded"}
                        onChange={(event) => updateGlobalSectionStyle("cardStyle", event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                      >
                        <option value="rounded">Rounded</option>
                        <option value="sharp">Sharp</option>
                        <option value="pill">Pill</option>
                      </select>
                      <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                        {globalSectionStyleConfig.cardStyle === "sharp" ? "Sudut tajam, formal" : globalSectionStyleConfig.cardStyle === "pill" ? "Sangat bulat, playful" : "Sudut rounded, modern"}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
              <div className={`scroll-mt-24 md:col-span-2 ${editorStep === 2 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Live Preview
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Preview real undangan. Perubahan style langsung terlihat.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={openEditorPreview}
                      className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-2 text-sm font-black text-[var(--color-primary)] hover:bg-[var(--color-bg)]"
                    >
                      Fullscreen
                    </button>
                  </div>
                  <div className="mx-auto mt-4 max-w-[430px]">
                    <div
                      className="relative overflow-hidden rounded-[24px] border-[3px] border-[var(--color-primary)]/70 shadow-2xl"
                      style={{ height: "600px" }}
                    >
                      <div className="mx-auto h-5 w-20 rounded-b-xl bg-[var(--color-primary)]/70" />
                      <iframe
                        key={`style-preview-${templatePreviewTick}`}
                        src={templatePreviewSrc}
                        title="Style live preview"
                        className="h-full w-full border-0"
                        style={{ height: "calc(100% - 20px)" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div id="template-cover" className={`scroll-mt-24 md:col-span-2 ${editorStep === 2 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Cover Section
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                    Atur cover utama, foto, background, animasi konten, dan style nama tamu.
                  </p>
                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(coverSectionConfig.photoEnabled)}
                          onChange={(event) =>
                            updateTemplateSectionConfig("home", "photoEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Foto aktif
                        </span>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Layout
                        </span>
                        <select
                          value={coverSectionConfig.layout}
                          onChange={(event) =>
                            updateTemplateSectionConfig("home", "layout", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {coverLayoutOptions.map((layout) => (
                            <option key={layout} value={layout}>
                              {layout}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Date Style
                        </span>
                        <select
                          value={coverSectionConfig.dateVariant || "separator-dot"}
                          onChange={(event) =>
                            updateTemplateSectionConfig("home", "dateVariant", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {coverDateVariantOptions.map((variant) => (
                            <option key={variant} value={variant}>
                              {variant}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Opening Animation
                        </span>
                        <select
                          value={coverSectionConfig.openingAnimation}
                          onChange={(event) =>
                            updateTemplateSectionConfig("home", "openingAnimation", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {coverOpeningAnimationOptions.map((animation) => (
                            <option key={animation} value={animation}>
                              {animation}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Background
                        </span>
                        <select
                          value={coverSectionConfig.backgroundMode || "color"}
                          onChange={(event) =>
                            updateTemplateSectionConfig("home", "backgroundMode", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {coverBackgroundModeOptions.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </label>
                      {coverSectionConfig.backgroundMode === "image" ? (
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                            Background Image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => updateCoverBackgroundImage(event.target.files?.[0])}
                            className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-2 file:text-sm file:font-black file:text-white focus:border-[var(--color-accent)]"
                          />
                        </label>
                      ) : (
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                            Background Color
                          </span>
                          <input
                            type="color"
                            value={coverSectionConfig.backgroundColor || "#fbf7ef"}
                            onChange={(event) =>
                              updateTemplateSectionConfig("home", "backgroundColor", event.target.value)
                            }
                            className="mt-2 h-11 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
                          />
                        </label>
                      )}
                    </div>
                    <CoverSectionPreview config={coverSectionConfig} />
                  </div>
                </div>
              </div>
              <div id="template-couple" className={`scroll-mt-24 md:col-span-2 ${editorStep === 2 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Couple Section
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                    Atur foto mempelai, border foto, font, teks orang tua, dan tombol Instagram.
                  </p>
                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(coupleSectionConfig.photoEnabled)}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "photoEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Foto aktif
                        </span>
                      </label>
                      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(coupleSectionConfig.borderEnabled)}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "borderEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Border foto
                        </span>
                      </label>
                      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(coupleSectionConfig.parentTextEnabled)}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "parentTextEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Teks orang tua
                        </span>
                      </label>
                      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(coupleSectionConfig.instagramEnabled)}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "instagramEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Instagram
                        </span>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Photo Style
                        </span>
                        <select
                          value={coupleSectionConfig.photoStyle}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "photoStyle", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {couplePhotoStyleOptions.map((style) => (
                            <option key={style} value={style}>
                              {style}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Font Preset
                        </span>
                        <select
                          value={coupleSectionConfig.fontPreset}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "fontPreset", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {coupleFontPresetOptions.map((preset) => (
                            <option key={preset} value={preset}>
                              {preset}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <CoupleSectionPreview config={coupleSectionConfig} />
                  </div>
                </div>
              </div>
              <div id="template-opening-reveal" className={`scroll-mt-24 md:col-span-2 ${editorStep === 3 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Opening Reveal
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Overlay pembuka sebelum undangan tampil, berisi judul cover, nama tamu, dan tombol buka.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(openingRevealWidgetConfig.enabled)}
                        onChange={(event) => updateOpeningRevealWidget("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        Reveal aktif
                      </span>
                    </label>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Opening Animation
                        </span>
                        <select
                          value={openingRevealWidgetConfig.animation}
                          onChange={(event) => updateOpeningRevealWidget("animation", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {openingRevealAnimationOptions.map((animation) => (
                            <option key={animation} value={animation}>
                              {animation}
                            </option>
                          ))}
                        </select>
                      </label>
                      <MiniInput
                        label="Button Text"
                        value={openingRevealWidgetConfig.buttonText}
                        onChange={(value) => updateOpeningRevealWidget("buttonText", value)}
                      />
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={openingRevealWidgetConfig.coverImageEnabled !== false}
                          onChange={(event) =>
                            updateOpeningRevealWidget("coverImageEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Cover image aktif
                        </span>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Background
                        </span>
                        <select
                          value={openingRevealWidgetConfig.backgroundMode}
                          onChange={(event) =>
                            updateOpeningRevealWidget("backgroundMode", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {openingRevealBackgroundModeOptions.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </label>
                      {openingRevealWidgetConfig.backgroundMode === "image" ? (
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Background Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            updateOpeningRevealImage("backgroundImage", event.target.files?.[0])
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-2 file:text-sm file:font-black file:text-white focus:border-[var(--color-accent)]"
                        />
                      </label>
                      ) : (
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Background Color
                        </span>
                        <input
                          type="color"
                          value={openingRevealWidgetConfig.backgroundColor || "#fbf7ef"}
                          onChange={(event) =>
                            updateOpeningRevealWidget("backgroundColor", event.target.value)
                          }
                          className="mt-2 h-11 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
                        />
                      </label>
                      )}
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(openingRevealWidgetConfig.autoPlayMusic)}
                          onChange={(event) => updateOpeningRevealWidget("autoPlayMusic", event.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Auto play musik
                        </span>
                      </label>
                    </div>
                    <OpeningRevealPreview config={openingRevealWidgetConfig} />
                  </div>
                </div>
              </div>
              <div id="template-widgets" className={`scroll-mt-24 md:col-span-2 ${editorStep === 4 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Countdown Widget
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Atur countdown real-time yang dipakai template ini.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(countdownWidgetConfig.enabled)}
                        onChange={(event) => updateCountdownWidget("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        Countdown aktif
                      </span>
                    </label>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Target Event
                        </span>
                        <select
                          value={countdownWidgetConfig.eventIndex}
                          onChange={(event) =>
                            updateCountdownWidget("eventIndex", Number(event.target.value))
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {[0, 1, 2].map((eventIndex) => (
                            <option key={eventIndex} value={eventIndex}>
                              Event {eventIndex + 1}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Variant
                        </span>
                        <select
                          value={countdownWidgetConfig.variant}
                          onChange={(event) => updateCountdownWidget("variant", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {countdownVariantOptions.map((variant) => (
                            <option key={variant} value={variant}>
                              {variant}
                            </option>
                          ))}
                        </select>
                      </label>
                      <MiniInput
                        label="Complete Text"
                        value={countdownWidgetConfig.completeText}
                        onChange={(value) => updateCountdownWidget("completeText", value)}
                      />
                    </div>
                    <CountdownWidgetPreview
                      variant={countdownWidgetConfig.variant}
                      enabled={Boolean(countdownWidgetConfig.enabled)}
                    />
                  </div>
                </div>
              </div>
              <div className={`md:col-span-2 ${editorStep === 4 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Love Story Widget
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Atur style timeline dan animasi item love story.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(storyWidgetConfig.enabled)}
                        onChange={(event) => updateStoryWidget("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        Story aktif
                      </span>
                    </label>
                  </div>
                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Variant
                        </span>
                        <select
                          value={storyWidgetConfig.variant}
                          onChange={(event) => updateStoryWidget("variant", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {storyVariantOptions.map((variant) => (
                            <option key={variant} value={variant}>
                              {variant}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Animation
                        </span>
                        <select
                          value={storyWidgetConfig.animation}
                          onChange={(event) => updateStoryWidget("animation", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {storyAnimationOptions.map((animation) => (
                            <option key={animation} value={animation}>
                              {animation}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <StoryWidgetPreview
                      variant={storyWidgetConfig.variant}
                      animation={storyWidgetConfig.animation}
                      enabled={Boolean(storyWidgetConfig.enabled)}
                    />
                  </div>
                </div>
              </div>
              <div className={`md:col-span-2 ${editorStep === 4 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Gallery Widget
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Atur layout gallery, jumlah foto, cover ordering, dan fullscreen viewer.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(galleryWidgetConfig.enabled)}
                        onChange={(event) => updateGalleryWidget("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        Gallery aktif
                      </span>
                    </label>
                  </div>
                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Variant
                        </span>
                        <select
                          value={galleryWidgetConfig.variant}
                          onChange={(event) => updateGalleryWidget("variant", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {galleryVariantOptions.map((variant) => (
                            <option key={variant} value={variant}>
                              {variant}
                            </option>
                          ))}
                        </select>
                      </label>
                      <MiniInput
                        label="Limit"
                        type="number"
                        value={galleryWidgetConfig.limit}
                        onChange={(value) => updateGalleryWidget("limit", value)}
                      />
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(galleryWidgetConfig.includeCover)}
                          onChange={(event) => updateGalleryWidget("includeCover", event.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Cover di awal
                        </span>
                      </label>
                    </div>
                    <GalleryWidgetPreview
                      variant={galleryWidgetConfig.variant}
                      enabled={Boolean(galleryWidgetConfig.enabled)}
                    />
                  </div>
                </div>
              </div>
              <div className={`md:col-span-2 ${editorStep === 4 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Event Widget
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Atur tampilan multi-event, tombol maps, dan icon section acara.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(eventWidgetConfig.enabled)}
                        onChange={(event) => updateEventWidget("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        Event aktif
                      </span>
                    </label>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Variant
                        </span>
                        <select
                          value={eventWidgetConfig.variant}
                          onChange={(event) => updateEventWidget("variant", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {eventVariantOptions.map((variant) => (
                            <option key={variant} value={variant}>
                              {variant}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(eventWidgetConfig.showMaps)}
                          onChange={(event) => updateEventWidget("showMaps", event.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Tampilkan Maps
                        </span>
                      </label>
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(eventWidgetConfig.showIcon)}
                          onChange={(event) => updateEventWidget("showIcon", event.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Tampilkan Icon
                        </span>
                      </label>
                    </div>
                    <EventWidgetPreview
                      variant={eventWidgetConfig.variant}
                      enabled={Boolean(eventWidgetConfig.enabled)}
                      showMaps={Boolean(eventWidgetConfig.showMaps)}
                      showIcon={Boolean(eventWidgetConfig.showIcon)}
                    />
                  </div>
                </div>
              </div>
              <div className={`md:col-span-2 ${editorStep === 4 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Music Player
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Atur tampilan music player dan ornament pulse sync.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(musicWidgetConfig.enabled)}
                        onChange={(event) => updateMusicWidget("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        Aktif
                      </span>
                    </label>
                  </div>
                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                            Variant
                          </span>
                          <select
                            value={musicWidgetConfig.variant}
                            onChange={(event) => updateMusicWidget("variant", event.target.value)}
                            className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                          >
                            {musicVariantOptions.map((variant) => (
                              <option key={variant} value={variant}>
                                {variant}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                            Position
                          </span>
                          <select
                            value={musicWidgetConfig.position}
                            onChange={(event) => updateMusicWidget("position", event.target.value)}
                            className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                          >
                            {musicPositionOptions.map((pos) => (
                              <option key={pos} value={pos}>
                                {pos}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                            Pulse Intensity
                          </span>
                          <select
                            value={musicWidgetConfig.pulseIntensity}
                            onChange={(event) => updateMusicWidget("pulseIntensity", event.target.value)}
                            className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                          >
                            {musicPulseIntensityOptions.map((intensity) => (
                              <option key={intensity} value={intensity}>
                                {intensity}
                              </option>
                            ))}
                          </select>
                        </label>
                        <div className="flex flex-col gap-2 pt-5">
                          <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                            <input
                              type="checkbox"
                              checked={Boolean(musicWidgetConfig.showTrackInfo)}
                              onChange={(event) => updateMusicWidget("showTrackInfo", event.target.checked)}
                              className="h-4 w-4"
                            />
                            <span className="text-sm font-black text-[var(--color-primary)]">
                              Track Info
                            </span>
                          </label>
                          <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                            <input
                              type="checkbox"
                              checked={Boolean(musicWidgetConfig.showProgress)}
                              onChange={(event) => updateMusicWidget("showProgress", event.target.checked)}
                              className="h-4 w-4"
                            />
                            <span className="text-sm font-black text-[var(--color-primary)]">
                              Progress
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                          <input
                            type="checkbox"
                            checked={Boolean(musicWidgetConfig.pulseSync)}
                            onChange={(event) => updateMusicWidget("pulseSync", event.target.checked)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-black text-[var(--color-primary)]">
                            Ornament Pulse Sync
                          </span>
                        </label>
                        <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                          <input
                            type="checkbox"
                            checked={Boolean(musicWidgetConfig.autoLoop)}
                            onChange={(event) => updateMusicWidget("autoLoop", event.target.checked)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-black text-[var(--color-primary)]">
                            Auto Loop
                          </span>
                        </label>
                      </div>
                    </div>
                    <MusicPlayerPreview
                      variant={musicWidgetConfig.variant}
                      position={musicWidgetConfig.position}
                      enabled={Boolean(musicWidgetConfig.enabled)}
                      showTrackInfo={Boolean(musicWidgetConfig.showTrackInfo)}
                      showProgress={Boolean(musicWidgetConfig.showProgress)}
                      pulseSync={Boolean(musicWidgetConfig.pulseSync)}
                    />
                  </div>
                </div>
              </div>
              <div id="template-ornaments" className={`scroll-mt-24 md:col-span-2 ${editorStep === 5 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Ornament Editor
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Edit posisi ornament berdasarkan canvas 430px.
                      </p>
                    </div>
                  </div>

                  {/* Visual Timeline Track - Full Width at Top */}
                  <div className="mt-5 rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                          Timeline Track
                        </p>
                        <p className="mt-1 text-[10px] text-[var(--color-text)]/60">
                          Visual urutan animasi entrance · Blok pada track berbeda bisa bersamaan
                        </p>
                      </div>
                    </div>
                    {/* Calculate dynamic timeline based on max ornament position */}
                    {(() => {
                      const maxPos = activeOrnaments.reduce((max, o) => Math.max(max, o.timelinePosition ?? 0), 0);
                      const timelineEnd = Math.max(3, Math.ceil(maxPos + 1));
                      const timeSteps = [];
                      for (let t = 0; t <= timelineEnd; t += 0.5) {
                        timeSteps.push(parseFloat(t.toFixed(1)));
                      }
                      const triggerReplay = () => {
                        setPreviewEntranceKey(k => k + 1);
                        document.querySelectorAll('.timeline-replay-indicator').forEach(el => {
                          el.classList.remove('replaying');
                          void el.offsetWidth;
                          el.classList.add('replaying');
                        });
                      };
                      return (
                        <>
                          {/* Update replay button with dynamic duration */}
                          <button
                            onClick={triggerReplay}
                            className="rounded-lg bg-[var(--color-primary)] px-3 py-1 text-xs font-black text-white shadow hover:bg-[var(--color-accent)]"
                          >
                            ▶ Replay
                          </button>
                          <div className="mt-4 space-y-3">
                            {[0, 1, 2, 3].map((track) => {
                              const trackOrnaments = activeOrnaments.filter(
                                (o) => (o.timelineTrack ?? 0) === track
                              );
                              const trackColors = [
                                "bg-blue-500",
                                "bg-green-500",
                                "bg-yellow-500",
                                "bg-purple-500",
                              ];
                              const trackLabels = ["T1", "T2", "T3", "T4"];
                              return (
                                <div key={track} className="flex items-center gap-3">
                                  <span className="w-8 text-[11px] font-bold text-[var(--color-text)]">
                                    {trackLabels[track]}
                                  </span>
                                  <div className="relative h-8 flex-1 rounded bg-[var(--color-bg)]">
                                    {/* Time markers */}
                                    <div className="absolute inset-0 flex justify-between px-2">
                                      {timeSteps.map((t) => (
                                        <span key={t} className="text-[9px] text-[var(--color-text)]/40">
                                          {t}s
                                        </span>
                                      ))}
                                    </div>
                                    {/* Grid lines */}
                                    <div className="absolute inset-0 flex justify-between px-2">
                                      {timeSteps.map((t) => (
                                        <div key={t} className="h-full w-px bg-[var(--color-text)]/10" />
                                      ))}
                                    </div>
                                    {/* Replay indicator line */}
                                    <div className="timeline-replay-indicator" style={{
                                      '--replay-color': track === 0 ? '#3b82f6' : track === 1 ? '#22c55e' : track === 2 ? '#eab308' : '#a855f7',
                                      '--replay-duration': `${timelineEnd}s`,
                                    }} />
                                    {/* Ornament blocks on timeline */}
                                    {trackOrnaments.map((ornament, idx) => {
                                      const pos = ornament.timelinePosition ?? 0;
                                      const leftPercent = Math.min(95, (pos / timelineEnd) * 100);
                                      return (
                                        <button
                                          key={ornament.id || idx}
                                          onClick={() => {
                                            const realIndex = activeOrnaments.indexOf(ornament);
                                            if (realIndex !== -1) setSelectedOrnamentIndex(realIndex);
                                          }}
                                          title={`${ornament.id} @ ${pos}s`}
                                          className={`absolute top-1/2 -translate-y-1/2 h-6 rounded ${trackColors[track]} opacity-80 hover:opacity-100 transition-opacity shadow-sm`}
                                          style={{
                                            left: `${leftPercent}%`,
                                            width: "24px",
                                          }}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                    <style>{`
                      @keyframes timeline-replay {
                        0% { left: 0%; opacity: 1; }
                        100% { left: 100%; opacity: 1; }
                      }
                      .timeline-replay-indicator {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        width: 2px;
                        background: var(--replay-color, #ef4444);
                        opacity: 0;
                        pointer-events: none;
                        z-index: 10;
                      }
                      .timeline-replay-indicator.replaying {
                        opacity: 1;
                        animation: timeline-replay var(--replay-duration, 3s) ease-out forwards;
                      }
                    `}</style>
                  </div>

                  {parsedDesignConfig ? (
                    <div className="mt-5 grid gap-5 xl:grid-cols-[280px_minmax(320px,1fr)_360px]">
                      <div className="space-y-4">
                        <Field label="Section">
                          <SelectInput
                            value={activeDesignSection}
                            onChange={(event) => {
                              setActiveDesignSection(event.target.value);
                              setSelectedOrnamentIndex(0);
                            }}
                          >
                            {designSectionNames.map((sectionName) => (
                              <option key={sectionName}>{sectionName}</option>
                            ))}
                          </SelectInput>
                        </Field>
                        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                              Ornament
                            </p>
                            <button
                              type="button"
                              onClick={addOrnament}
                              title="Tambah Ornament"
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-black text-white hover:bg-[var(--color-accent)]"
                            >
                              +
                            </button>
                          </div>
                          <div className="mt-3 space-y-2">
                            {activeOrnaments.map((ornament, index) => {
                              const isSelected = selectedOrnamentIndex === index;
                              return (
                                <div
                                  key={ornament.id || index}
                                  className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-colors ${
                                    isSelected
                                      ? "bg-[var(--color-primary)] text-white"
                                      : "bg-[var(--color-bg)] text-[var(--color-primary)]"
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => setSelectedOrnamentIndex(index)}
                                    className="flex-1 text-left text-sm font-black"
                                  >
                                    {ornament.id || `Ornament ${index + 1}`}
                                  </button>
                                  {isSelected && (
                                    <div className="flex gap-1">
                                      <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); duplicateOrnament(); }}
                                        title="Duplicate"
                                        className="flex h-6 w-6 items-center justify-center rounded bg-white/20 text-xs hover:bg-white/30"
                                      >
                                        ⧉
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeOrnament(); }}
                                        title="Hapus"
                                        className="flex h-6 w-6 items-center justify-center rounded bg-white/20 text-xs hover:bg-white/30"
                                      >
                                        🗑
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {activeOrnaments.length === 0 ? (
                              <p className="text-sm font-semibold text-[var(--color-text)]">
                                Belum ada ornament di section ini.
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4 xl:sticky xl:top-24">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-3">
                                <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                                  Canvas Preview
                                </p>
                                <button
                                  onClick={() => setPreviewEntranceKey(k => k + 1)}
                                  className="rounded-lg bg-[var(--color-primary)] px-3 py-1 text-xs font-black text-white shadow hover:bg-[var(--color-accent)]"
                                >
                                  ▶ Replay
                                </button>
                              </div>
                              <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                                {activeDesignSection} section, {activeOrnaments.length} ornament
                              </p>
                            </div>
                            <span className="rounded-full bg-[var(--color-bg)] px-3 py-1 text-xs font-black text-[var(--color-primary)]">
                              430px
                            </span>
                          </div>
                            <div className="mt-4 flex justify-center">
                            <div className="relative aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] shadow-inner">
                              <OrnamentSectionCanvasPreview
                                section={activeDesignSection}
                                styleConfig={activeSectionStyleConfig}
                              />
                              <OrnamentLayer 
                                key={`ornament-preview-${activeDesignSection}-${previewEntranceKey}-${previewOrnaments.length}`}
                                ornaments={previewOrnaments} 
                              />
                              <div className="absolute inset-0 border border-dashed border-[var(--color-accent)]/50" />
                              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-[8px] bg-white/78 p-3 text-center text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                                {activeDesignSection} Section
                              </div>
                            </div>
                          </div>
                        </div>

                        {validationWarnings.length > 0 ? (
                          <div className="rounded-[8px] border border-[var(--color-accent)] bg-[var(--color-accent)]/10 p-4">
                            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-primary)]">
                              Validation Warnings
                            </p>
                            <ul className="mt-3 space-y-2">
                              {validationWarnings.map((warning) => (
                                <li
                                  key={warning}
                                  className="text-sm font-semibold leading-6 text-[var(--color-text)]"
                                >
                                  {warning}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
                            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                              Validation
                            </p>
                            <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                              Tidak ada warning untuk section ini.
                            </p>
                          </div>
                        )}
                      </div>

                      {selectedOrnament ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                          <div className="md:col-span-2 xl:col-span-1">
                            <MiniInput
                              label="ID"
                              value={selectedOrnament.id}
                              onChange={(value) => updateOrnament("id", value)}
                            />
                          </div>
                          <div className="md:col-span-2 xl:col-span-1">
                            <details className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)]">
                              <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)] hover:bg-[var(--color-accent-pale)]">
                                Layer Controls
                                <span className="text-[var(--color-text)]/40">▼</span>
                              </summary>
                              <div className="flex flex-wrap gap-2 px-3 pb-3">
                                <button
                                  type="button"
                                  onClick={() => reorderSelectedOrnament("down")}
                                  disabled={selectedOrnamentIndex <= 0}
                                  title="Move Down"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-accent-pale)] bg-white text-xs font-black text-[var(--color-primary)] disabled:opacity-45 hover:bg-[var(--color-accent-pale)]"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => reorderSelectedOrnament("up")}
                                  disabled={selectedOrnamentIndex >= activeOrnaments.length - 1}
                                  title="Move Up"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-accent-pale)] bg-white text-xs font-black text-[var(--color-primary)] disabled:opacity-45 hover:bg-[var(--color-accent-pale)]"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => reorderSelectedOrnament("back")}
                                  disabled={selectedOrnamentIndex <= 0}
                                  title="Send Back"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-accent-pale)] bg-white text-xs font-black text-[var(--color-primary)] disabled:opacity-45 hover:bg-[var(--color-accent-pale)]"
                                >
                                  ⎗
                                </button>
                                <button
                                  type="button"
                                  onClick={() => reorderSelectedOrnament("front")}
                                  disabled={selectedOrnamentIndex >= activeOrnaments.length - 1}
                                  title="Bring Front"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-accent-pale)] bg-white text-xs font-black text-[var(--color-primary)] disabled:opacity-45 hover:bg-[var(--color-accent-pale)]"
                                >
                                  ⎘
                                </button>
                              </div>
                            </details>
                          </div>
                          <div className="md:col-span-2 xl:col-span-1">
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) =>
                                  updateSelectedOrnamentFile(event.target.files?.[0])
                                }
                                className="w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-bold text-[var(--color-primary)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-2 file:text-xs file:font-black file:text-white"
                              />
                              {isUploadingOrnament ? (
                                <p className="mt-2 text-sm font-black text-[var(--color-accent)]">
                                  Mengupload ornament...
                                </p>
                              ) : null}
                            </div>
                            <div className="mt-4 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-3">
                              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                                Uploaded Ornament
                              </p>
                              {isLoadingOrnamentAssets ? (
                                <p className="mt-2 text-xs font-bold text-[var(--color-text)]">
                                  Memuat asset upload...
                                </p>
                              ) : null}
                              {dynamicOrnamentAssets.length > 0 ? (
                                <div className="mt-3">
                                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
                                    Uploaded
                                  </p>
                                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {dynamicOrnamentAssets.map((asset) => (
                                      <div
                                        key={asset.storagePath || asset.id}
                                        className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-2"
                                      >
                                        <button
                                          type="button"
                                          onClick={() => applyOrnamentAsset(asset)}
                                          className="block w-full text-left"
                                        >
                                          <span className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-[var(--color-bg)]">
                                            <img
                                              src={asset.src}
                                              alt=""
                                              className="h-full w-full object-contain"
                                            />
                                          </span>
                                          <span className="mt-2 block truncate text-xs font-black text-[var(--color-primary)]">
                                            {asset.name}
                                          </span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteDynamicOrnamentAsset(asset)}
                                          className="mt-2 w-full rounded-lg border border-[var(--color-accent-pale)] px-2 py-1 text-xs font-black text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                                        >
                                          Hapus
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                              {dynamicOrnamentAssets.length === 0 && !isLoadingOrnamentAssets ? (
                                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                                  Belum ada ornament upload untuk template ini.
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="block">
                            <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                              Slot
                            </span>
                            <div className={`mt-2 grid grid-cols-3 grid-rows-3 gap-1 ${selectedOrnament.useSlot === false ? 'opacity-50 pointer-events-none' : ''}`}>
                              <button
                                type="button"
                                onClick={() => updateOrnament("slot", "top-left")}
                                className={`h-8 rounded-lg border text-xs font-black transition-all ${
                                  selectedOrnament.slot === "top-left"
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                    : "border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-accent-pale)]"
                                }`}
                              >
                                TL
                              </button>
                              <button
                                type="button"
                                onClick={() => updateOrnament("slot", "center-top")}
                                className={`h-8 rounded-lg border text-xs font-black transition-all ${
                                  selectedOrnament.slot === "center-top"
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                    : "border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-accent-pale)]"
                                }`}
                              >
                                T
                              </button>
                              <button
                                type="button"
                                onClick={() => updateOrnament("slot", "top-right")}
                                className={`h-8 rounded-lg border text-xs font-black transition-all ${
                                  selectedOrnament.slot === "top-right"
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                    : "border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-accent-pale)]"
                                }`}
                              >
                                TR
                              </button>
                              <button
                                type="button"
                                onClick={() => updateOrnament("slot", "side-left")}
                                className={`h-8 rounded-lg border text-xs font-black transition-all ${
                                  selectedOrnament.slot === "side-left"
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                    : "border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-accent-pale)]"
                                }`}
                              >
                                L
                              </button>
                              <button
                                type="button"
                                onClick={() => updateOrnament("slot", "center")}
                                className={`h-8 rounded-lg border text-xs font-black transition-all ${
                                  selectedOrnament.slot === "center"
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                    : "border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-accent-pale)]"
                                }`}
                              >
                                C
                              </button>
                              <button
                                type="button"
                                onClick={() => updateOrnament("slot", "side-right")}
                                className={`h-8 rounded-lg border text-xs font-black transition-all ${
                                  selectedOrnament.slot === "side-right"
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                    : "border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-accent-pale)]"
                                }`}
                              >
                                R
                              </button>
                              <button
                                type="button"
                                onClick={() => updateOrnament("slot", "bottom-left")}
                                className={`h-8 rounded-lg border text-xs font-black transition-all ${
                                  selectedOrnament.slot === "bottom-left"
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                    : "border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-accent-pale)]"
                                }`}
                              >
                                BL
                              </button>
                              <button
                                type="button"
                                onClick={() => updateOrnament("slot", "center-bottom")}
                                className={`h-8 rounded-lg border text-xs font-black transition-all ${
                                  selectedOrnament.slot === "center-bottom"
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                    : "border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-accent-pale)]"
                                }`}
                              >
                                B
                              </button>
                              <button
                                type="button"
                                onClick={() => updateOrnament("slot", "bottom-right")}
                                className={`h-8 rounded-lg border text-xs font-black transition-all ${
                                  selectedOrnament.slot === "bottom-right"
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                    : "border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-accent-pale)]"
                                }`}
                              >
                                BR
                              </button>
                            </div>
                            <p className="mt-1 text-[10px] text-[var(--color-text)]/60">
                              TL=Top-Left, TR=Top-Right, BL=Bottom-Left, BR=Bottom-Right, C=Center, L/R=Side
                            </p>
                            <label className="mt-3 flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedOrnament.useSlot !== false}
                                onChange={(event) => {
                                  const useSlot = event.target.checked;
                                  if (!useSlot) {
                                    // When disabling Use Slot, reset slot to top-left so X/Y becomes absolute position
                                    // and ensure both updates happen together
                                    const currentOrnament = activeOrnaments[selectedOrnamentIndex];
                                    if (currentOrnament) {
                                      const updatedOrnament = {
                                        ...currentOrnament,
                                        useSlot: false,
                                        slot: "top-left",
                                      };
                                      const ornaments = {
                                        ...(parsedDesignConfig.ornaments || {}),
                                        [activeDesignSection]: activeOrnaments.map((o, i) =>
                                          i === selectedOrnamentIndex ? updatedOrnament : o
                                        ),
                                      };
                                      writeDesignConfig({
                                        ...parsedDesignConfig,
                                        ornaments,
                                      });
                                    }
                                  } else {
                                    updateOrnament("useSlot", true);
                                  }
                                }}
                                className="h-4 w-4"
                              />
                              <span className="text-xs font-black text-[var(--color-text)]">
                                Use Slot (X/Y auto dari slot)
                              </span>
                            </label>
                          </div>
                          <label className="block">
                            <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                              Animation
                            </span>
                            <select
                              value={selectedOrnament.animation || "none"}
                              onChange={(event) => updateOrnament("animation", event.target.value)}
                              className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                            >
                              {ornamentAnimationOptions.map((animation) => (
                                <option key={animation} value={animation}>
                                  {animation}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="block">
                            <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                              Entrance
                            </span>
                            <select
                              value={selectedOrnament.entrance || "none"}
                              onChange={(event) => updateOrnament("entrance", event.target.value)}
                              className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                            >
                              {ornamentEntranceOptions.map((entrance) => (
                                <option key={entrance} value={entrance}>
                                  {entrance}
                                </option>
                              ))}
                            </select>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <label className="block">
                              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                                Loop Mode
                              </span>
                              <select
                                value={selectedOrnament.loopMode || "infinite"}
                                onChange={(event) => updateOrnament("loopMode", event.target.value)}
                                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                              >
                                {ornamentLoopModeOptions.map((mode) => (
                                  <option key={mode} value={mode}>
                                    {mode}
                                  </option>
                                ))}
                              </select>
                            </label>
                            {(selectedOrnament.loopMode === "once-hide") ? (
                              <>
                                <label className="block">
                                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                                    Exit Anim
                                  </span>
                                  <select
                                    value={selectedOrnament.exitAnimation || "fade-out"}
                                    onChange={(event) => updateOrnament("exitAnimation", event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                                  >
                                    {ornamentExitAnimationOptions.map((anim) => (
                                      <option key={anim} value={anim}>
                                        {anim}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <MiniInput
                                  label="Visible (s)"
                                  type="number"
                                  step="0.5"
                                  value={selectedOrnament.visibleDuration ?? 3}
                                  onChange={(value) => updateOrnament("visibleDuration", value)}
                                />
                              </>
                            ) : null}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <label className="block">
                              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                                Width
                              </span>
                              <div className="mt-2 flex overflow-hidden rounded-xl border border-[var(--color-accent-pale)] bg-white">
                                <input
                                  type="number"
                                  value={parseInt(selectedOrnament.width) || ""}
                                  onChange={(event) => {
                                    const unit = String(selectedOrnament.width || "").includes("%") ? "%" : "px";
                                    updateOrnament("width", event.target.value ? `${event.target.value}${unit === "%" ? "%" : ""}` : "");
                                  }}
                                  className="w-full min-w-0 flex-1 px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none"
                                  placeholder="160"
                                />
                                <select
                                  value={String(selectedOrnament.width || "").includes("%") ? "%" : "px"}
                                  onChange={(event) => {
                                    const num = parseInt(selectedOrnament.width) || "";
                                    updateOrnament("width", num ? `${num}${event.target.value === "%" ? "%" : ""}` : "");
                                  }}
                                  className="border-l border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-2 text-xs font-black text-[var(--color-text)] outline-none"
                                >
                                  <option value="px">px</option>
                                  <option value="%">%</option>
                                </select>
                              </div>
                            </label>
                            <label className="block">
                              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                                Height
                              </span>
                              <div className="mt-2 flex overflow-hidden rounded-xl border border-[var(--color-accent-pale)] bg-white">
                                <input
                                  type="number"
                                  value={parseInt(selectedOrnament.height) || ""}
                                  onChange={(event) => {
                                    const unit = String(selectedOrnament.height || "").includes("%") ? "%" : "px";
                                    updateOrnament("height", event.target.value ? `${event.target.value}${unit === "%" ? "%" : ""}` : "");
                                  }}
                                  className="w-full min-w-0 flex-1 px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none"
                                  placeholder="auto"
                                />
                                <select
                                  value={String(selectedOrnament.height || "").includes("%") ? "%" : "px"}
                                  onChange={(event) => {
                                    const num = parseInt(selectedOrnament.height) || "";
                                    updateOrnament("height", num ? `${num}${event.target.value === "%" ? "%" : ""}` : "");
                                  }}
                                  className="border-l border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-2 text-xs font-black text-[var(--color-text)] outline-none"
                                >
                                  <option value="px">px</option>
                                  <option value="%">%</option>
                                </select>
                              </div>
                            </label>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <MiniInput label="X" type="number" value={selectedOrnament.useSlot !== false ? 0 : (selectedOrnament.x || 0)} onChange={(value) => updateOrnament("x", value)} disabled={selectedOrnament.useSlot !== false} />
                            <MiniInput label="Y" type="number" value={selectedOrnament.useSlot !== false ? 0 : (selectedOrnament.y || 0)} onChange={(value) => updateOrnament("y", value)} disabled={selectedOrnament.useSlot !== false} />
                            <MiniInput label="Rotate" type="number" value={selectedOrnament.rotate || 0} onChange={(value) => updateOrnament("rotate", value)} />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <MiniInput label="Opacity" type="number" step="0.05" value={selectedOrnament.opacity ?? 1} onChange={(value) => updateOrnament("opacity", value)} />
                            <MiniInput label="Z Index" type="number" value={selectedOrnament.zIndex || 0} onChange={(value) => updateOrnament("zIndex", value)} />
                            <MiniInput label="Entrance Dur" type="number" step="0.1" value={selectedOrnament.entranceDuration ?? 0.8} onChange={(value) => updateOrnament("entranceDuration", value)} />
                          </div>
                          <label className="block">
                            <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                              Timeline Track
                            </span>
                            <select
                              value={selectedOrnament.timelineTrack ?? 0}
                              onChange={(event) => updateOrnament("timelineTrack", Number(event.target.value))}
                              className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                            >
                              {ornamentTimelineTrackOptions.map((track) => (
                                <option key={track} value={track}>
                                  Track {track + 1}
                                </option>
                              ))}
                            </select>
                            <p className="mt-1 text-[10px] text-[var(--color-text)]/60">
                              Ornamen di track berbeda bisa animate bersamaan
                            </p>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <MiniInput label="Timeline Pos" type="number" step="0.1" value={selectedOrnament.timelinePosition ?? 0} onChange={(value) => updateOrnament("timelinePosition", value)} />
                            <MiniInput label="Duration" type="number" step="0.5" value={selectedOrnament.duration ?? 6} onChange={(value) => updateOrnament("duration", value)} />
                            <MiniInput label="Delay" type="number" step="0.25" value={selectedOrnament.delay ?? 0} onChange={(value) => updateOrnament("delay", value)} />
                          </div>
                          <div className="mt-6 grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                              <input
                                type="checkbox"
                                checked={Boolean(selectedOrnament.flip)}
                                onChange={(event) => updateOrnament("flip", event.target.checked)}
                                className="h-4 w-4"
                              />
                              <span className="text-sm font-black text-[var(--color-primary)]">
                                Flip
                              </span>
                            </label>
                            <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                              <input
                                type="checkbox"
                                checked={Boolean(selectedOrnament.mirrorDuplicate)}
                                onChange={(event) => updateOrnament("mirrorDuplicate", event.target.checked)}
                                className="h-4 w-4"
                              />
                              <span className="text-sm font-black text-[var(--color-primary)]">
                                Mirror
                              </span>
                            </label>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <label className="block">
                              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                                Parallax
                              </span>
                              <select
                                value={selectedOrnament.parallax || "none"}
                                onChange={(event) => updateOrnament("parallax", event.target.value)}
                                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                              >
                                {ornamentParallaxOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="block">
                              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                                Direction
                              </span>
                              <select
                                value={selectedOrnament.parallaxDirection || "vertical"}
                                onChange={(event) => updateOrnament("parallaxDirection", event.target.value)}
                                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                              >
                                {ornamentParallaxDirectionOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-6 text-center">
                          <p className="text-base font-black text-[var(--color-primary)]">
                            Pilih atau tambah ornament dulu.
                          </p>
                        </div>
                      )}
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
                className={`scroll-mt-24 md:col-span-2 ${editorStep === 6 ? "" : "hidden"}`}
              >
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-primary)] p-4 shadow-xl shadow-[var(--color-primary)]/12">
                  <div className="mb-3 flex flex-col gap-1 text-white sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent-soft)]">
                      Live Template Preview
                    </p>
                    <div className="flex flex-wrap gap-2">
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
                  <p className="mb-3 text-sm font-bold text-white/70">
                    {activeDesignSection} section draft (focus: {previewFocusSection})
                  </p>
                  <div className="overflow-x-auto">
                    <div
                      className={`mx-auto overflow-auto rounded-[8px] bg-white ${activePreviewViewport.frameClass}`}
                    >
                      <iframe
                        key={templatePreviewSrc}
                        src={templatePreviewSrc}
                        title="Template live preview"
                        className="origin-top-left border-0"
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
              </div>
              <div id="template-advanced" className={`scroll-mt-24 md:col-span-2 ${editorStep === 7 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Publish
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Final check sebelum publish. Advanced config opsional.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAdvancedOpen((current) => !current)}
                      className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-2 text-sm font-black text-[var(--color-primary)]"
                    >
                      {isAdvancedOpen ? "Sembunyikan Advanced" : "Tampilkan Advanced"}
                    </button>
                  </div>
                  {isAdvancedOpen ? (
                    <div className="mt-4">
                      <Field label="Design Config JSON">
                        <textarea
                          value={designConfigText}
                          onChange={(event) => {
                            setDesignConfigText(event.target.value);
                            setManagerMessage("");
                          }}
                          rows={10}
                          spellCheck={false}
                          className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-[#111827] px-4 py-3 font-mono text-sm leading-6 text-white outline-none focus:border-[var(--color-accent)]"
                        />
                      </Field>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className={`mt-5 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-4 py-3 text-sm font-black text-[var(--color-primary)] ${editorStep === 7 ? "" : "hidden"}`}>
              Gunakan tombol Simpan di header editor untuk menyimpan perubahan.
            </div>
          </div>
        ) : null}

        {!templateDraft ? (
        <div className="mt-6">
          <div className="hidden grid-cols-[82px_1.35fr_0.8fr_0.75fr_0.75fr_0.8fr] gap-4 border-b border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)] lg:hidden">
            <span>Preview</span>
            <span>Template</span>
            <span>Kategori</span>
            <span>Harga</span>
            <span>Status</span>
            <span className="text-right">Aksi</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <article
                key={template.id}
                className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4 shadow-lg shadow-[var(--color-primary)]/6"
              >
                <img
                  src={template.image}
                  alt={`Preview ${template.name}`}
                  className="aspect-[4/5] w-full rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] object-cover"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black text-[var(--color-primary)]">
                      {template.name}
                    </h3>
                    <span className="rounded-full bg-[var(--color-muted)] px-3 py-1 text-xs font-black text-[var(--color-primary)]">
                      {template.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                    {template.id}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[var(--color-text)]">
                    {template.description}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text)]/70">
                    {template.supportedFeatures.length} fitur support
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-black text-[var(--color-primary)]">
                      {template.category}
                    </p>
                    <p className="text-base font-black text-[var(--color-accent)]">
                      {template.price}
                    </p>
                  </div>
                  <TemplateStatusPill status={template.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={template.previewUrl}
                    className="flex-1 rounded-xl border border-[var(--color-accent-pale)] px-4 py-2 text-center text-sm font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg)]"
                  >
                    Preview
                  </a>
                  <button
                    type="button"
                    onClick={() => startEditTemplate(template)}
                    className="flex-1 rounded-xl border border-[var(--color-accent-pale)] px-4 py-2 text-sm font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg)]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTemplateStatus(template.id)}
                    className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                  >
                    {template.status === "active" ? "Hide" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTemplate(template)}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700 transition-colors hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </div>
              </article>
            ))}

            {filteredTemplates.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-xl font-black text-[var(--color-primary)]">
                  Template tidak ditemukan
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-text)]">
                  Coba ubah keyword, kategori, atau status filter.
                </p>
              </div>
            ) : null}
          </div>
        </div>
        ) : null}
      </motion.section>
  );
}


