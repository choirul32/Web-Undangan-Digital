export const templateSectionRegistry = [
  {
    id: "home",
    label: "Cover",
    required: true,
    previewSection: "home",
  },
  {
    id: "couple",
    label: "Mempelai",
    required: true,
    previewSection: "couple",
  },
  {
    id: "acara",
    label: "Acara",
    required: true,
    previewSection: "acara",
  },
  {
    id: "countdown",
    label: "Countdown",
    feature: "countdown",
    previewSection: "countdown",
  },
  {
    id: "story",
    label: "Love Story",
    feature: "story",
    previewSection: "story",
  },
  {
    id: "gallery",
    label: "Gallery",
    feature: "gallery",
    previewSection: "gallery",
  },
  {
    id: "gift",
    label: "Amplop Digital",
    feature: "gift",
    previewSection: "gift",
  },
  {
    id: "rsvp",
    label: "RSVP",
    feature: "rsvp",
    previewSection: "rsvp",
  },
  {
    id: "doa-ucapan",
    label: "Doa & Ucapan",
    previewSection: "doa-ucapan",
  },
];

export function getTemplateSection(sectionId) {
  return templateSectionRegistry.find((section) => section.id === sectionId) || null;
}

export function getPreviewSectionIds() {
  return templateSectionRegistry.map((section) => section.previewSection);
}
