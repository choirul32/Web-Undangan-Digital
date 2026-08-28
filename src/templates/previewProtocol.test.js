import { describe, expect, it } from "vitest";
import {
  buildPreviewSnapshot,
  buildPreviewUrl,
  buildReadyMessage,
  buildReplayMessage,
  buildSnapshotMessage,
  parsePreviewQuery,
  PREVIEW_MESSAGE,
  PREVIEW_QUERY,
  SNAPSHOT_STORAGE_KEY,
} from "./previewProtocol";

describe("previewProtocol URL builder", () => {
  it("mode editor menghasilkan URL yang sama dengan builder lama", () => {
    const url = buildPreviewUrl({
      templateId: "royal-emerald",
      mode: "editor",
      focusSection: "home",
      previewTick: "3",
      previewDataMode: "filled",
      withGuest: true,
    });
    expect(url).toBe(
      "/preview?templateId=royal-emerald&editorPreview=1&embeddedEditorPreview=1&focusSection=home&previewTick=3&previewDataMode=filled&previewGuest=Bapak%2FIbu%20Preview",
    );
  });

  it("mode cover menghasilkan URL dengan previewSectionOnly + disableOpeningOverlay + tick-version", () => {
    const url = buildPreviewUrl({
      templateId: "royal-emerald",
      mode: "cover",
      previewTick: "2",
      previewConfigVersion: "abc123",
      previewDataMode: "empty",
    });
    expect(url).toContain("editorPreview=1");
    expect(url).toContain("embeddedEditorPreview=1");
    expect(url).toContain("focusSection=home");
    expect(url).toContain("previewSectionOnly=1");
    expect(url).toContain("disableOpeningOverlay=1");
    expect(url).toContain("previewTick=2-abc123");
    expect(url).toContain("previewDataMode=empty");
  });

  it("mode opening menghasilkan URL dengan previewOpening", () => {
    const url = buildPreviewUrl({
      templateId: "royal-emerald",
      mode: "opening",
      previewTick: "1",
      previewConfigVersion: "v1",
    });
    expect(url).toContain("previewOpening=1");
    expect(url).toContain("focusSection=home");
    expect(url).toContain("previewSectionOnly=1");
    expect(url).toContain("previewTick=1-v1");
  });

  it("mode ornament menghasilkan URL dengan mobileFrame + disableOpeningOverlay", () => {
    const url = buildPreviewUrl({
      templateId: "royal-emerald",
      mode: "ornament",
      focusSection: "acara",
      previewTick: "5",
      previewConfigVersion: "v2",
      previewDataMode: "filled",
    });
    expect(url).toContain("mobileFrame=1");
    expect(url).toContain("focusSection=acara");
    expect(url).toContain("disableOpeningOverlay=1");
    expect(url).toContain("previewTick=5-v2");
  });

  it("default templateId adalah standard", () => {
    const url = buildPreviewUrl({ mode: "editor" });
    expect(url).toContain("templateId=standard");
  });
});

describe("previewProtocol message builders", () => {
  it("buildSnapshotMessage menghasilkan message update dengan payload", () => {
    const snapshot = buildPreviewSnapshot({
      id: "t1",
      image: "/img.png",
      designConfig: { widgets: {} },
    });
    expect(snapshot).toEqual({
      id: "t1",
      image: "/img.png",
      designConfig: { widgets: {} },
    });
    expect(buildSnapshotMessage(snapshot)).toEqual({
      type: PREVIEW_MESSAGE.update,
      payload: snapshot,
    });
  });

  it("buildReplayMessage dan buildReadyMessage memakai nama dari PREVIEW_MESSAGE", () => {
    expect(buildReplayMessage()).toEqual({ type: PREVIEW_MESSAGE.replay });
    expect(buildReadyMessage("t1")).toEqual({
      type: PREVIEW_MESSAGE.ready,
      templateId: "t1",
    });
  });

  it("SNAPSHOT_STORAGE_KEY konsisten dengan key lama", () => {
    expect(SNAPSHOT_STORAGE_KEY).toBe("nusa-invite:editor-preview-template");
  });
});

describe("previewProtocol query parser", () => {
  function fakeSearchParams(values) {
    return {
      get: (key) => values[key] || "",
    };
  }

  it("parsePreviewQuery membaca semua param", () => {
    const parsed = parsePreviewQuery(
      fakeSearchParams({
        templateId: "t1",
        editorPreview: "1",
        embeddedEditorPreview: "1",
        focusSection: "home",
        previewSectionOnly: "1",
        mobileFrame: "1",
        previewOpening: "1",
        previewGuest: "Budi",
        previewDataMode: "empty",
      }),
    );
    expect(parsed).toEqual({
      slug: null,
      templateId: "t1",
      editorPreview: true,
      embeddedEditorPreview: true,
      previewSectionOnly: true,
      previewFocusSection: "home",
      mobileFramePreview: true,
      disableOpeningOverlay: true,
      previewOpening: true,
      previewGuest: "Budi",
      previewDataMode: "empty",
    });
  });

  it("previewSectionOnly memaksa disableOpeningOverlay true", () => {
    const parsed = parsePreviewQuery(
      fakeSearchParams({ previewSectionOnly: "1" }),
    );
    expect(parsed.previewSectionOnly).toBe(true);
    expect(parsed.disableOpeningOverlay).toBe(true);
  });

  it("previewDataMode default filled", () => {
    const parsed = parsePreviewQuery(fakeSearchParams({}));
    expect(parsed.previewDataMode).toBe("filled");
  });

  it("PREVIEW_QUERY memetakan key param ke string", () => {
    expect(PREVIEW_QUERY.focusSection).toBe("focusSection");
    expect(PREVIEW_QUERY.previewTick).toBe("previewTick");
  });
});
