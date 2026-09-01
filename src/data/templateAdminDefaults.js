export const defaultTemplateMetadata = [
  {
    id: "basic",
    name: "Basic",
    category: "Basic",
    price: "Rp 45.000",
    badge: "Basic",
    status: "active",
    description: "Template dasar untuk undangan simpel, rapi, dan cepat dipakai.",
    image: "/assets/nusantara-premium.svg",
    previewUrl: "/preview?templateId=basic",
    supportedFeatures: ["guestName", "gallery"],
    rendererType: "config",
    sortOrder: 1,
    designConfig: {
      sections: {
        global: {
          backgroundColor: "#fbf7ef",
          textColor: "#3d2b20",
          accentColor: "#d8a44d",
          fontPreset: "sans",
          spacingPreset: "compact",
          entranceAnimation: "fade-up",
        },
        home: {
          backgroundMode: "image",
          backgroundImage: "/assets/nusantara-premium.svg",
          layout: "centered",
          guestBlockStyle: "minimal",
          photoEnabled: true,
        },
      },
      widgets: {
        openingReveal: {
          enabled: false,
          buttonText: "Buka Undangan",
          coverImageEnabled: true,
          coverImage: "/assets/CoverPasangan.png",
          backgroundMode: "color",
          backgroundImage: "",
          backgroundColor: "#fbf7ef",
          animation: "fade",
          autoPlayMusic: true,
        },
        countdown: { enabled: true, variant: "minimal" },
        events: { enabled: true, variant: "cards", showMaps: true, showIcon: false },
        story: { enabled: false, variant: "card", animation: "fade-up" },
        gallery: { enabled: true, variant: "grid", limit: 4, includeCover: false },
      },
      ornaments: {},
    },
  },
  {
    id: "standard",
    name: "Standard",
    category: "Standard",
    price: "Rp 90.000",
    badge: "Standard",
    status: "active",
    description: "Template standar dengan fitur lengkap untuk undangan digital umum.",
    image: "/assets/backgrounds/soft-watercolor-cream.jpg",
    previewUrl: "/preview?templateId=standard",
    supportedFeatures: ["rsvp", "gift", "guestName", "gallery", "story"],
    rendererType: "config",
    sortOrder: 2,
    designConfig: {
      sections: {
        global: {
          backgroundColor: "#fff9f2",
          textColor: "#334155",
          accentColor: "#d9897f",
          fontPreset: "serif",
          spacingPreset: "normal",
          entranceAnimation: "fade-up",
        },
        home: {
          backgroundMode: "image",
          backgroundImage: "/assets/backgrounds/soft-watercolor-cream.jpg",
          layout: "centered",
          guestBlockStyle: "card",
          photoEnabled: true,
        },
        gallery: {
          useGlobal: false,
          backgroundColor: "#ffffff",
          textColor: "#334155",
          accentColor: "#d9897f",
          spacingPreset: "normal",
        },
      },
      widgets: {
        openingReveal: {
          enabled: true,
          buttonText: "Buka Undangan",
          coverImageEnabled: true,
          coverImage: "/assets/CoverPasangan.png",
          backgroundMode: "image",
          backgroundImage: "/assets/backgrounds/soft-watercolor-cream.jpg",
          backgroundColor: "#fff9f2",
          animation: "paper",
          autoPlayMusic: true,
        },
        countdown: { enabled: true, variant: "cards" },
        events: { enabled: true, variant: "cards", showMaps: true, showIcon: false },
        story: { enabled: true, variant: "card", animation: "fade-up" },
        gallery: { enabled: true, variant: "grid", limit: 6, includeCover: true },
      },
      ornaments: {},
    },
  },
  {
    id: "premium",
    name: "Premium",
    category: "Premium",
    price: "Rp 149.000",
    badge: "Premium",
    status: "active",
    description: "Template premium dengan layout lebih mewah, animasi, gallery besar, dan section lengkap.",
    image: "/assets/backgrounds/paper-fan-blush.jpg",
    previewUrl: "/preview?templateId=premium",
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
    rendererType: "config",
    sortOrder: 3,
    designConfig: {
      sections: {
        global: {
          backgroundColor: "#fff7f4",
          textColor: "#3b2a2a",
          accentColor: "#c97b63",
          fontPreset: "serif",
          spacingPreset: "roomy",
          entranceAnimation: "zoom-in",
        },
        home: {
          backgroundMode: "image",
          backgroundImage: "/assets/backgrounds/paper-fan-blush.jpg",
          layout: "split",
          guestBlockStyle: "minimal",
          photoEnabled: true,
        },
        gallery: {
          useGlobal: false,
          backgroundColor: "#ffffff",
          textColor: "#3b2a2a",
          accentColor: "#c97b63",
          spacingPreset: "roomy",
        },
      },
      widgets: {
        openingReveal: {
          enabled: true,
          buttonText: "Buka Undangan",
          coverImageEnabled: true,
          coverImage: "/assets/CoverPasangan.png",
          backgroundMode: "image",
          backgroundImage: "/assets/backgrounds/paper-fan-blush.jpg",
          backgroundColor: "#fff7f4",
          animation: "zoom",
          autoPlayMusic: true,
        },
        countdown: { enabled: true, variant: "minimal" },
        events: { enabled: true, variant: "cards", showMaps: true, showIcon: false },
        story: { enabled: true, variant: "stacked", animation: "zoom-in" },
        gallery: { enabled: true, variant: "masonry", limit: 8, includeCover: true },
      },
      ornaments: {},
    },
  },
  {
    id: "adat",
    name: "Adat",
    category: "Adat",
    price: "Rp 129.000",
    badge: "Adat",
    status: "active",
    description: "Template bertema adat dengan tone hangat, ornamen lokal, dan susunan acara lengkap.",
    image: "/assets/template-adat-jawa-premium.png",
    previewUrl: "/preview?templateId=adat",
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
    rendererType: "config",
    sortOrder: 4,
    designConfig: {
      sections: {
        global: {
          backgroundColor: "#f7efe3",
          textColor: "#3b2417",
          accentColor: "#b7793f",
          fontPreset: "serif",
          spacingPreset: "normal",
          entranceAnimation: "fade-up",
        },
        home: {
          backgroundMode: "image",
          backgroundImage: "/assets/template-adat-jawa-premium.png",
          layout: "centered",
          guestBlockStyle: "card",
          photoEnabled: true,
        },
      },
      widgets: {
        openingReveal: {
          enabled: true,
          buttonText: "Buka Undangan",
          coverImageEnabled: true,
          coverImage: "/assets/CoverPasangan.png",
          backgroundMode: "image",
          backgroundImage: "/assets/template-adat-jawa-premium.png",
          backgroundColor: "#f7efe3",
          animation: "curtain",
          autoPlayMusic: true,
        },
        countdown: { enabled: true, variant: "cards" },
        events: { enabled: true, variant: "list", showMaps: true, showIcon: false },
        story: { enabled: true, variant: "timeline", animation: "stagger" },
        gallery: { enabled: true, variant: "carousel", limit: 6, includeCover: true },
      },
      ornaments: {
        home: [
          {
            id: "adat-cover-frame",
            src: "/assets/nusantara-songket.svg",
            slot: "fill",
            width: "100%",
            height: "100%",
            opacity: 0.16,
            zIndex: 0,
            objectFit: "cover",
          },
        ],
      },
    },
  },
];

export const templateOverridesStorageKey = "nusa-invite:template-overrides";
export const deletedTemplateIdsStorageKey = "nusa-invite:deleted-template-ids";

function readStorageJson(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeStorageJson(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore localStorage access issues (private mode / quota)
  }
}

// Catatan: override lokal adalah FALLBACK saat Supabase belum dikonfigurasi.
// Begitu Supabase aktif, data disimpan di DB dan override lokal bisa dibersihkan
// lewat clearLegacyTemplateLocalCache() tanpa kehilangan template.
export function clearLegacyTemplateLocalCache() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(templateOverridesStorageKey);
    window.localStorage.removeItem(deletedTemplateIdsStorageKey);
  } catch {
    // ignore localStorage access issues
  }
}

export function getStoredTemplateOverrides() {
  return readStorageJson(templateOverridesStorageKey, []);
}

export function mergeTemplateOverrides(items = []) {
  const overrides = getStoredTemplateOverrides();
  if (overrides.length === 0) {
    return items;
  }

  const overrideById = new Map(overrides.map((item) => [item.id, item]));
  return items.map((item) => {
    const override = overrideById.get(item.id);
    if (!override) {
      return item;
    }
    return {
      ...item,
      ...override,
      image: override.image || item.image,
      previewUrl: override.previewUrl || item.previewUrl || "/preview",
      supportedFeatures: override.supportedFeatures || item.supportedFeatures || [],
    };
  });
}

export function upsertStoredTemplateOverride(template) {
  if (!template?.id) {
    return;
  }

  const overrides = getStoredTemplateOverrides();
  const nextOverrides = [
    template,
    ...overrides.filter((item) => item.id !== template.id),
  ];
  writeStorageJson(templateOverridesStorageKey, nextOverrides);
}

export function getStoredTemplateOverride(templateId) {
  return getStoredTemplateOverrides().find((item) => item.id === templateId) || null;
}

export function getStoredDeletedTemplateIds() {
  return readStorageJson(deletedTemplateIdsStorageKey, []);
}

export function addStoredDeletedTemplateId(templateId) {
  if (!templateId) {
    return;
  }

  const deletedIds = getStoredDeletedTemplateIds();
  if (deletedIds.includes(templateId)) {
    return;
  }
  writeStorageJson(deletedTemplateIdsStorageKey, [...deletedIds, templateId]);
}

export function applyStoredTemplateOverrideToInvitation(invitation) {
  // Kalau sudah ada designConfig dari sumber yang lebih fresh (snapshot
  // editor via sessionStorage), jangan timpa dengan override lama.
  if (invitation?.designConfig) {
    return invitation;
  }

  const override = invitation?.templateId
    ? getStoredTemplateOverride(invitation.templateId)
    : null;
  if (!override) {
    return invitation;
  }

  return {
    ...invitation,
    templateId: override.id,
    coverImage: override.image || invitation.coverImage,
    designConfig: override.designConfig || invitation.designConfig,
  };
}
