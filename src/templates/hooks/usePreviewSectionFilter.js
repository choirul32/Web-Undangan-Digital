import { useEffect, useState } from "react";
import { getPreviewSectionIds } from "../templateSectionRegistry";

export default function usePreviewSectionFilter(templateId) {
  const [previewFocusSection, setPreviewFocusSection] = useState(null);
  const [previewSectionOnly, setPreviewSectionOnly] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawSection = params.get("focusSection");
    const sectionOnly = params.get("previewSectionOnly") === "1";
    setPreviewSectionOnly(sectionOnly);

    if (!rawSection) {
      setPreviewFocusSection(null);
      return;
    }

    const allowedSections = new Set(getPreviewSectionIds());
    const normalizedSection = allowedSections.has(rawSection) ? rawSection : "home";
    setPreviewFocusSection(normalizedSection);

    const targetElement = document.querySelector(`[data-preview-section="${normalizedSection}"]`);
    if (!targetElement) return;

    window.requestAnimationFrame(() => {
      targetElement.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }, [templateId]);

  const shouldRenderSection = (sectionId) => {
    if (!previewSectionOnly) return true;
    return previewFocusSection === sectionId;
  };

  return { previewFocusSection, previewSectionOnly, shouldRenderSection };
}

