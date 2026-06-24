import { useEffect, useState } from "react";
import { getPreviewSectionIds } from "../templateSectionRegistry";

function normalizePreviewSection(section) {
  if (!section) {
    return null;
  }

  const allowedSections = new Set(getPreviewSectionIds());
  return allowedSections.has(section) ? section : "home";
}

export default function usePreviewSectionFilter(
  templateId,
  initialPreviewSectionOnly = false,
  initialPreviewFocusSection = null,
) {
  const [previewFocusSection, setPreviewFocusSection] = useState(
    normalizePreviewSection(initialPreviewFocusSection),
  );
  const [previewSectionOnly, setPreviewSectionOnly] = useState(Boolean(initialPreviewSectionOnly));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawSection = params.get("focusSection") || initialPreviewFocusSection;
    const sectionOnly = params.get("previewSectionOnly") === "1" || Boolean(initialPreviewSectionOnly);
    setPreviewSectionOnly(sectionOnly);

    if (!rawSection) {
      setPreviewFocusSection(null);
      return;
    }

    const normalizedSection = normalizePreviewSection(rawSection);
    setPreviewFocusSection(normalizedSection);

    const targetElement = document.querySelector(`[data-preview-section="${normalizedSection}"]`);
    if (!targetElement) return;

    window.requestAnimationFrame(() => {
      targetElement.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }, [initialPreviewFocusSection, initialPreviewSectionOnly, templateId]);

  const shouldRenderSection = (sectionId) => {
    if (!previewSectionOnly) return true;
    return previewFocusSection === sectionId;
  };

  return { previewFocusSection, previewSectionOnly, shouldRenderSection };
}
