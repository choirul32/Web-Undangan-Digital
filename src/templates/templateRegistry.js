import RanaKiranaTemplate from "./rana-kirana/RanaKiranaTemplate";
import AdatJawaMobileTemplate from "./adat-jawa-mobile/AdatJawaMobileTemplate";
import WatercolorPremiumTemplate from "./watercolor-premium/WatercolorPremiumTemplate";
import BlueWatercolorMuslimTemplate from "./blue-watercolor-muslim/BlueWatercolorMuslimTemplate";

export const templateRegistry = {
  "blue-watercolor-muslim": {
    id: "blue-watercolor-muslim",
    name: "Blue Watercolor Muslim",
    category: "Muslim",
    preview: "/assets/blue-watercolor-frame.svg",
    component: BlueWatercolorMuslimTemplate,
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
  },
  "watercolor-premium": {
    id: "watercolor-premium",
    name: "Watercolor Premium",
    category: "Premium",
    preview: "https://haribahagia.info/wp-content/uploads/2023/05/jfshfcj-3.png",
    component: WatercolorPremiumTemplate,
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
  },
  "adat-jawa-mobile": {
    id: "adat-jawa-mobile",
    name: "Adat Jawa Mobile",
    category: "Adat",
    preview: "/assets/template-adat-jawa-premium.png",
    component: AdatJawaMobileTemplate,
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
  },
  "rana-kirana": {
    id: "rana-kirana",
    name: "Rana Kirana",
    category: "Adat",
    preview: "/assets/nusantara-songket.svg",
    component: RanaKiranaTemplate,
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
  },
  "sadajiwa": {
    id: "sadajiwa",
    name: "Sadajiwa",
    category: "Muslim",
    preview: "/assets/nusantara-muslim.svg",
    component: RanaKiranaTemplate,
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
  },
  "sekar-arum": {
    id: "sekar-arum",
    name: "Sekar Arum",
    category: "Modern",
    preview: "/assets/nusantara-jawa.svg",
    component: RanaKiranaTemplate,
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
  },
  "kidung": {
    id: "kidung",
    name: "Kidung",
    category: "Non Foto",
    preview: "/assets/nusantara-premium.svg",
    component: RanaKiranaTemplate,
    supportedFeatures: ["rsvp", "gift", "music", "guestName", "story"],
  },
};

export const templateOptions = Object.values(templateRegistry);

export function getTemplateById(templateId) {
  return templateRegistry[templateId] || templateRegistry["rana-kirana"];
}
