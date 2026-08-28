// ============================================================
// Preview Protocol — satu-satunya pemilik wire protocol antara
// dashboard editor (TemplateAdmin/OrnamentCanvasPanel) dan
// renderer preview (preview-page-client / UniversalTemplate).
//
// Protocol terdiri dari 3 transport:
//   1. Query params (URL iframe/preview) — buildPreviewUrl / parsePreviewQuery
//   2. postMessage — MESSAGE_* + buildSnapshotMessage / buildReadyMessage / buildReplayMessage
//   3. sessionStorage — SNAPSHOT_STORAGE_KEY (snapshot utk preview window terpisah)
//
// Semua konsumen WAJIB lewat modul ini, jangan menulis string param
// atau message name sendiri di komponen.
// ============================================================

// ---- Query params ----
export const PREVIEW_QUERY = {
  templateId: "templateId",
  slug: "slug",
  editorPreview: "editorPreview",
  embeddedEditorPreview: "embeddedEditorPreview",
  previewSectionOnly: "previewSectionOnly",
  focusSection: "focusSection",
  mobileFrame: "mobileFrame",
  disableOpeningOverlay: "disableOpeningOverlay",
  previewOpening: "previewOpening",
  previewGuest: "previewGuest",
  previewDataMode: "previewDataMode",
  previewTick: "previewTick",
  viewport: "viewport",
};

export const PREVIEW_GUEST_NAME = "Bapak/Ibu Preview";

// ---- postMessage message types ----
export const PREVIEW_MESSAGE = {
  update: "nusa-invite:editor-preview-update",
  replay: "nusa-invite:editor-preview-replay",
  ready: "nusa-invite:editor-preview-ready",
};

// ---- sessionStorage ----
export const SNAPSHOT_STORAGE_KEY = "nusa-invite:editor-preview-template";

// ---- Snapshot shape: { id, image, designConfig } ----
export function buildPreviewSnapshot({ id, image, designConfig }) {
  return {
    id,
    image,
    designConfig,
  };
}

// ---- postMessage builders ----
export function buildSnapshotMessage(snapshot) {
  return {
    type: PREVIEW_MESSAGE.update,
    payload: snapshot,
  };
}

export function buildReplayMessage() {
  return {
    type: PREVIEW_MESSAGE.replay,
  };
}

export function buildReadyMessage(templateId) {
  return {
    type: PREVIEW_MESSAGE.ready,
    templateId,
  };
}

// ---- URL builders ----
const DEFAULT_PREVIEW_TEMPLATE_ID = "standard";

function buildGuestQuery(includeGuest) {
  return includeGuest
    ? `&${PREVIEW_QUERY.previewGuest}=${encodeURIComponent(PREVIEW_GUEST_NAME)}`
    : "";
}

/**
 * Bangun URL preview editor. Semua mode preview editor lewat sini.
 * @param {object} options
 * @param {string} [options.templateId] id template (default "standard")
 * @param {object} [options.mode] mode preview: "editor", "cover", "opening", "ornament", "full"
 * @param {string} [options.focusSection] section yang di-focus (default dari mode)
 * @param {string} [options.previewTick] nilai tick (default "")
 * @param {string} [options.previewConfigVersion] hash versi config (opsional)
 * @param {string} [options.previewDataMode] mode data preview
 * @param {boolean} [options.withGuest] sertakan previewGuest
 * @param {string} [options.viewport] viewport untuk full preview (opsional)
 */
export function buildPreviewUrl({
  templateId = DEFAULT_PREVIEW_TEMPLATE_ID,
  mode = "editor",
  focusSection,
  previewTick = "",
  previewConfigVersion = "",
  previewDataMode = "filled",
  withGuest = false,
  viewport,
} = {}) {
  const params = [
    `${PREVIEW_QUERY.templateId}=${encodeURIComponent(templateId)}`,
    `${PREVIEW_QUERY.editorPreview}=1`,
  ];

  const section = focusSection || (mode === "cover" || mode === "opening" ? "home" : "");

  switch (mode) {
    case "cover":
      params.push(
        `${PREVIEW_QUERY.embeddedEditorPreview}=1`,
        `${PREVIEW_QUERY.focusSection}=home`,
        `${PREVIEW_QUERY.previewSectionOnly}=1`,
        `${PREVIEW_QUERY.disableOpeningOverlay}=1`,
      );
      break;
    case "opening":
      params.push(
        `${PREVIEW_QUERY.embeddedEditorPreview}=1`,
        `${PREVIEW_QUERY.previewOpening}=1`,
        `${PREVIEW_QUERY.focusSection}=home`,
        `${PREVIEW_QUERY.previewSectionOnly}=1`,
      );
      break;
    case "ornament":
      params.push(
        `${PREVIEW_QUERY.embeddedEditorPreview}=1`,
        `${PREVIEW_QUERY.mobileFrame}=1`,
        section ? `${PREVIEW_QUERY.focusSection}=${encodeURIComponent(section)}` : "",
        `${PREVIEW_QUERY.disableOpeningOverlay}=1`,
      );
      break;
    case "full":
      params.push(
        section ? `${PREVIEW_QUERY.focusSection}=${encodeURIComponent(section)}` : "",
        viewport ? `${PREVIEW_QUERY.viewport}=${encodeURIComponent(viewport)}` : "",
      );
      break;
    case "editor":
    default:
      params.push(
        `${PREVIEW_QUERY.embeddedEditorPreview}=1`,
        section ? `${PREVIEW_QUERY.focusSection}=${encodeURIComponent(section)}` : "",
      );
      break;
  }

  const tickValue = previewConfigVersion ? `${previewTick}-${previewConfigVersion}` : previewTick;
  if (tickValue) {
    params.push(`${PREVIEW_QUERY.previewTick}=${tickValue}`);
  }
  if (previewDataMode) {
    params.push(`${PREVIEW_QUERY.previewDataMode}=${encodeURIComponent(previewDataMode)}`);
  }

  return `/preview?${params.filter(Boolean).join("&")}${buildGuestQuery(withGuest)}`;
}

// ---- Query parser ----
export function parsePreviewQuery(searchParams) {
  const get = (key) => searchParams?.get(key) || "";

  const previewSectionOnly = get(PREVIEW_QUERY.previewSectionOnly) === "1";
  const disableOpeningOverlay =
    get(PREVIEW_QUERY.disableOpeningOverlay) === "1" || previewSectionOnly;

  return {
    slug: get(PREVIEW_QUERY.slug) || null,
    templateId: get(PREVIEW_QUERY.templateId) || null,
    editorPreview: get(PREVIEW_QUERY.editorPreview) === "1",
    embeddedEditorPreview: get(PREVIEW_QUERY.embeddedEditorPreview) === "1",
    previewSectionOnly,
    previewFocusSection: get(PREVIEW_QUERY.focusSection) || null,
    mobileFramePreview: get(PREVIEW_QUERY.mobileFrame) === "1",
    disableOpeningOverlay,
    previewOpening: get(PREVIEW_QUERY.previewOpening) === "1",
    previewGuest: get(PREVIEW_QUERY.previewGuest) || "",
    previewDataMode: get(PREVIEW_QUERY.previewDataMode) || "filled",
  };
}
