import { defaultDesignConfigs } from "../templates/designConfigs";

export const defaultTemplateMetadata = [
  {
    id: "blue-watercolor-muslim",
    name: "Blue Watercolor Muslim",
    category: "Muslim",
    price: "Rp 149.000",
    badge: "New",
    status: "active",
    description: "Template muslim watercolor biru dengan ilustrasi couple dan floral frame.",
    image: "/assets/blue-watercolor-frame.svg",
    previewUrl: "/demo/blue-watercolor-muslim",
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
    designConfig: defaultDesignConfigs["blue-watercolor-muslim"],
    sortOrder: 1,
  },
  {
    id: "watercolor-premium",
    name: "Watercolor Premium",
    category: "Premium",
    price: "Rp 129.000",
    badge: "Premium",
    status: "active",
    description: "Template watercolor premium dari blueprint Elementor dengan gallery dan gift.",
    image: "https://haribahagia.info/wp-content/uploads/2023/05/jfshfcj-3.png",
    previewUrl: "/demo/watercolor-premium",
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
    designConfig: {},
    sortOrder: 2,
  },
  {
    id: "adat-jawa-mobile",
    name: "Adat Jawa Mobile",
    category: "Adat",
    price: "Rp 149.000",
    badge: "Adat",
    status: "active",
    description: "Template adat Jawa mobile dengan frame batik, ivory gold, dan ornamen melati.",
    image: "/assets/template-adat-jawa-premium.png",
    previewUrl: "/demo/adat-jawa",
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
    designConfig: {},
    sortOrder: 3,
  },
  {
    id: "rana-kirana",
    name: "Rana Kirana",
    category: "Adat",
    price: "Rp 129.000",
    badge: "Best Seller",
    status: "active",
    description: "Template songket luxe untuk undangan adat dengan sentuhan premium.",
    image: "/assets/nusantara-songket.svg",
    previewUrl: "/preview",
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
    designConfig: {},
    sortOrder: 4,
  },
  {
    id: "sadajiwa",
    name: "Sadajiwa",
    category: "Muslim",
    price: "Rp 99.000",
    badge: "Favorit",
    status: "active",
    description: "Template muslim modern dengan aksen Nusantara dan layout bersih.",
    image: "/assets/nusantara-muslim.svg",
    previewUrl: "/preview",
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
    designConfig: {},
    sortOrder: 5,
  },
  {
    id: "sekar-arum",
    name: "Sekar Arum",
    category: "Modern",
    price: "Rp 90.000",
    badge: "Modern",
    status: "active",
    description: "Template modern Jawa dengan warna hangat dan komposisi ringan.",
    image: "/assets/nusantara-jawa.svg",
    previewUrl: "/preview",
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
    designConfig: {},
    sortOrder: 6,
  },
  {
    id: "kidung",
    name: "Kidung",
    category: "Non Foto",
    price: "Rp 89.000",
    badge: "Non Foto",
    status: "hidden",
    description: "Template non-foto dengan visual premium minimal dan fokus typography.",
    image: "/assets/nusantara-premium.svg",
    previewUrl: "/preview",
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "story"],
    designConfig: {},
    sortOrder: 7,
  },
];

export const templateOverridesStorageKey = "nusa-invite:template-overrides";
export const deletedTemplateIdsStorageKey = "nusa-invite:deleted-template-ids";

export function getStoredTemplateOverrides() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawOverrides = window.localStorage.getItem(templateOverridesStorageKey);
    return rawOverrides ? JSON.parse(rawOverrides) : [];
  } catch {
    return [];
  }
}

export function mergeTemplateOverrides(items = []) {
  const overrides = getStoredTemplateOverrides();
  const deletedIds = getStoredDeletedTemplateIds();
  const visibleItems = items.filter((item) => !deletedIds.includes(item.id));

  if (!overrides.length) {
    return visibleItems;
  }

  const mergedItems = visibleItems.map((item) => {
    const override = overrides.find((storedItem) => storedItem.id === item.id);
    return override ? { ...item, ...override } : item;
  });
  const customOverrides = overrides.filter(
    (override) =>
      !deletedIds.includes(override.id) &&
      !mergedItems.some((item) => item.id === override.id),
  );

  return [...customOverrides, ...mergedItems];
}

export function upsertStoredTemplateOverride(template) {
  if (typeof window === "undefined" || !template?.id) {
    return;
  }

  const currentOverrides = getStoredTemplateOverrides();
  const nextDeletedIds = getStoredDeletedTemplateIds().filter((id) => id !== template.id);
  const nextOverrides = [
    template,
    ...currentOverrides.filter((item) => item.id !== template.id),
  ];

  window.localStorage.setItem(deletedTemplateIdsStorageKey, JSON.stringify(nextDeletedIds));
  window.localStorage.setItem(templateOverridesStorageKey, JSON.stringify(nextOverrides));
}

export function getStoredTemplateOverride(templateId) {
  return getStoredTemplateOverrides().find((item) => item.id === templateId) || null;
}

export function getStoredDeletedTemplateIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawIds = window.localStorage.getItem(deletedTemplateIdsStorageKey);
    return rawIds ? JSON.parse(rawIds) : [];
  } catch {
    return [];
  }
}

export function addStoredDeletedTemplateId(templateId) {
  if (typeof window === "undefined" || !templateId) {
    return;
  }

  const deletedIds = getStoredDeletedTemplateIds();
  const nextIds = Array.from(new Set([templateId, ...deletedIds]));
  const nextOverrides = getStoredTemplateOverrides().filter((item) => item.id !== templateId);

  window.localStorage.setItem(deletedTemplateIdsStorageKey, JSON.stringify(nextIds));
  window.localStorage.setItem(templateOverridesStorageKey, JSON.stringify(nextOverrides));
}

export function applyStoredTemplateOverrideToInvitation(invitation) {
  const override = getStoredTemplateOverride(invitation?.templateId);

  if (!override) {
    return invitation;
  }

  return {
    ...invitation,
    templateId: override.id || invitation.templateId,
    designConfig: override.designConfig || invitation.designConfig,
    coverImage: override.image || invitation.coverImage,
  };
}
