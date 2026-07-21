"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./config";
import ConfirmDialog from "./ConfirmDialog";
import {
  DashboardButton,
  DashboardCard,
  TextInput,
} from "./FormControls";
import { prepareImageForUpload } from "../../lib/imageUpload";

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "Ukuran tidak tersedia";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function readableMediaType(type = "") {
  if (!type) return "Tipe tidak tersedia";
  if (type === "image") return "Gallery";
  if (type === "qris") return "QRIS";
  if (type === "groom") return "Foto pria";
  if (type === "bride") return "Foto wanita";
  if (type === "cover") return "Cover";
  if (type === "music") return "Musik";
  if (type === "video") return "Video";
  return type;
}

function getImageFileDimensions(file) {
  return new Promise((resolve) => {
    if (!file?.type?.startsWith("image/") || file.type === "image/svg+xml") {
      resolve(null);
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.src = url;
  });
}

async function getRemoteFileSize(url) {
  if (!url || url.startsWith("data:")) {
    return null;
  }

  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) return null;

    const size = Number(response.headers.get("content-length"));
    return Number.isFinite(size) && size > 0 ? size : null;
  } catch {
    return null;
  }
}

export default function MediaManager({ invitationSlug = "" }) {
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaType, setMediaType] = useState("image");
  const [title, setTitle] = useState("Gallery");
  const [file, setFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [mediaDimensions, setMediaDimensions] = useState({});
  const [mediaFileSizes, setMediaFileSizes] = useState({});
  const [message, setMessage] = useState("");
  const [replaceId, setReplaceId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const mediaTabs = [
    { id: "cover", label: "Cover" },
    { id: "groom", label: "Foto Pria" },
    { id: "bride", label: "Foto Wanita" },
    { id: "image", label: "Gallery" },
    { id: "qris", label: "QRIS" },
    { id: "music", label: "Music" },
    { id: "video", label: "Video" },
  ];
  const singleSlotTypes = ["cover", "groom", "bride", "qris"];
  const filteredMediaItems = useMemo(
    () => mediaItems.filter((item) => item.mediaType === mediaType),
    [mediaItems, mediaType],
  );
  const getItemFileSize = (item) => {
    const key = item.id || item.url;
    if (item.fileSize) return item.fileSize;
    return key ? mediaFileSizes[key] : undefined;
  };

  const formatMediaFileSize = (item) => {
    const size = getItemFileSize(item);
    if (size === undefined) return "";
    if (size === null) return "Mengecek ukuran...";
    return formatFileSize(size);
  };

  const updateSelectedFile = async (selectedFile) => {
    setFile(selectedFile || null);

    if (!selectedFile) {
      setFileDetails(null);
      return;
    }

    const dimensions = await getImageFileDimensions(selectedFile);
    setFileDetails({
      name: selectedFile.name || "File tanpa nama",
      size: selectedFile.size || 0,
      type: selectedFile.type || "Tipe tidak terbaca",
      dimensions,
    });
  };

  useEffect(() => {
    if (!invitationSlug) {
      setMediaItems([]);
      return undefined;
    }

    let isMounted = true;

    fetch(`/api/media?invitationSlug=${encodeURIComponent(invitationSlug)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setMediaItems(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMediaItems([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invitationSlug]);

  useEffect(() => {
    let isMounted = true;

    filteredMediaItems.forEach((item) => {
      const key = item.id || item.url;
      if (!key || item.fileSize || mediaFileSizes[key] !== undefined) {
        return;
      }

      setMediaFileSizes((current) => ({ ...current, [key]: null }));
      getRemoteFileSize(item.url).then((size) => {
        if (!isMounted) return;
        setMediaFileSizes((current) => ({ ...current, [key]: size || 0 }));
      });
    });

    return () => {
      isMounted = false;
    };
  }, [filteredMediaItems, mediaFileSizes]);

  const uploadMedia = async () => {
    if (!file) {
      setMessage("Pilih file dulu.");
      return;
    }

    // Single-slot media (cover, couple portraits) should replace the existing
    // entry instead of stacking duplicates.
    let effectiveReplaceId = replaceId;
    if (!effectiveReplaceId && singleSlotTypes.includes(mediaType)) {
      const existing = mediaItems.find((item) => item.mediaType === mediaType);
      if (existing) {
        effectiveReplaceId = existing.id;
      }
    }

    try {
      const imagePresetByType = {
        cover: "cover",
        groom: "portrait",
        bride: "portrait",
        image: "gallery",
        qris: "qris",
      };
      const isImageMedia = ["cover", "groom", "bride", "image", "qris"].includes(mediaType);
      setMessage(isImageMedia ? "Mengoptimalkan gambar..." : "Menyiapkan upload...");
      const prepared = await prepareImageForUpload(file, imagePresetByType[mediaType] || "default");

      const formData = new FormData();
      formData.append("invitationSlug", invitationSlug);
      formData.append("mediaType", mediaType);
      formData.append("title", title);
      if (effectiveReplaceId) {
        formData.append("replaceId", effectiveReplaceId);
      }
      formData.append("file", prepared.file);

      setMessage(
        prepared.message ||
          (replaceId ? "Mengganti media..." : "Mengupload media..."),
      );

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload gagal");
      }

      setMediaItems((current) =>
        effectiveReplaceId
          ? current.map((item) =>
              item.id === effectiveReplaceId
                ? {
                    ...result.data,
                    fileSize: prepared.file.size,
                    mimeType: prepared.file.type,
                    originalFileSize: file.size,
                  }
                : item,
            )
          : [
              {
                ...result.data,
                fileSize: prepared.file.size,
                mimeType: prepared.file.type,
                originalFileSize: file.size,
              },
              ...current,
            ],
      );
      setFile(null);
      setFileDetails(null);
      setReplaceId("");
      setMessage(
        result.source === "supabase"
          ? effectiveReplaceId
            ? "Media berhasil diganti."
            : "Media berhasil diupload."
          : "Media berhasil diupload.",
      );
    } catch (error) {
      setMessage(error.message || "Upload gagal.");
    }
  };

  const startReplace = (item) => {
    setReplaceId(item.id);
    setMediaType(item.mediaType || "image");
    setTitle(item.title || "Media");
    setMessage(`Mode replace: ${item.title || item.mediaType}`);
  };

  const cancelReplace = () => {
    setReplaceId("");
    setFile(null);
    setFileDetails(null);
    setMessage("");
  };

  const deleteMedia = async (item) => {
    const previous = mediaItems;
    setMediaItems((current) => current.filter((media) => media.id !== item.id));
    setMessage(`Menghapus ${item.title || item.mediaType}...`);

    try {
      const response = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug, id: item.id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus media");
      }

      if (replaceId === item.id) {
        cancelReplace();
      }
      setMessage("Media berhasil dihapus.");
    } catch (error) {
      setMediaItems(previous);
      setMessage(error.message || "Hapus media dibatalkan.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] shadow-[var(--dash-shadow)]"
    >
      {!invitationSlug ? (
        <div className="border-b border-[var(--dash-border)] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Media Manager
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
            Pilih order aktif dulu
          </h2>
          <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
            Panel media hanya berjalan untuk satu invitation yang sedang dibuka.
          </p>
        </div>
      ) : null}
      {!invitationSlug ? null : (
        <>
      <div className="border-b border-[var(--dash-border)] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
          Media Manager
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
          Cover, gallery, dan backsound
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
          Media terikat ke order aktif: /{invitationSlug}
        </p>
      </div>

      <div className="border-b border-[var(--dash-border)] px-5 py-4">
        <div className="flex flex-wrap gap-2">
          {mediaTabs.map((tab) => (
            <DashboardButton
              key={tab.id}
              type="button"
              variant={mediaType === tab.id ? "primary" : "secondary"}
              size="sm"
              onClick={() => {
                setMediaType(tab.id);
                setTitle(tab.label);
              }}
            >
              {tab.label}
            </DashboardButton>
          ))}
        </div>
        {mediaType === "groom" || mediaType === "bride" ? (
          <p className="mt-3 text-xs font-medium text-[var(--dash-muted)]">
            Pas foto {mediaType === "groom" ? "mempelai pria" : "mempelai wanita"} yang tampil di atas nama pada section Mempelai.
            Satu foto saja — upload baru otomatis mengganti yang lama. Kalau dikosongkan, dipakai foto default dari Pengaturan.
          </p>
        ) : null}
        {mediaType === "qris" ? (
          <p className="mt-3 text-xs font-medium text-[var(--dash-muted)]">
            Upload gambar QRIS (screenshot/ekspor dari aplikasi bank/e-wallet) untuk section Amplop Digital.
            Satu gambar saja — upload baru otomatis mengganti yang lama. Pastikan kode QR terlihat jelas.
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 border-b border-[var(--dash-border)] p-5 lg:grid-cols-[1fr_1fr_auto_auto]">
        <TextInput
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Judul media"
        />
        <input
          type="file"
          accept={mediaType === "music" ? "audio/*" : mediaType === "video" ? "video/*" : "image/*"}
          onChange={(event) => updateSelectedFile(event.target.files?.[0] || null)}
          className="rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--dash-muted)]"
        />
        <DashboardButton
          type="button"
          onClick={uploadMedia}
        >
          {replaceId ? "Replace" : "Upload"}
        </DashboardButton>
        {replaceId ? (
          <DashboardButton
            type="button"
            onClick={cancelReplace}
            variant="secondary"
          >
            Batal
          </DashboardButton>
        ) : null}
      </div>

      {fileDetails ? (
        <div className="border-b border-[var(--dash-border)] px-5 py-4">
          <div className="rounded-[10px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                  Detail file terpilih
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-[var(--dash-ink)]">
                  {fileDetails.name}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--dash-muted)]">
                  {formatFileSize(fileDetails.size)}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--dash-muted)]">
                  {fileDetails.type}
                </span>
                {fileDetails.dimensions ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--dash-muted)]">
                    {fileDetails.dimensions.width} x {fileDetails.dimensions.height}px
                  </span>
                ) : null}
              </div>
            </div>
            {fileDetails.size > 5 * 1024 * 1024 ? (
              <p className="mt-3 text-xs font-semibold text-amber-700">
                File lebih dari 5MB, akan dicoba dikompres otomatis sebelum upload.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {message ? (
        <p className="px-5 pt-4 text-sm font-medium text-[var(--dash-muted)]">{message}</p>
      ) : null}

      <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredMediaItems.map((item) => (
          <DashboardCard
            key={item.id || item.url}
            className="overflow-hidden p-0"
          >
            {item.mediaType === "music" ? (
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                  Music
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--dash-ink)]">
                  {item.title}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[var(--dash-fog)] px-3 py-1 text-xs font-semibold text-[var(--dash-muted)]">
                    {readableMediaType(item.mediaType)}
                  </span>
                  {formatMediaFileSize(item) ? (
                    <span className="rounded-full bg-[var(--dash-fog)] px-3 py-1 text-xs font-semibold text-[var(--dash-muted)]">
                      {formatMediaFileSize(item)}
                    </span>
                  ) : null}
                  {item.mimeType ? (
                    <span className="rounded-full bg-[var(--dash-fog)] px-3 py-1 text-xs font-semibold text-[var(--dash-muted)]">
                      {item.mimeType}
                    </span>
                  ) : null}
                </div>
                <audio controls className="mt-4 w-full">
                  <source src={item.url} />
                </audio>
                <div className="mt-4 flex gap-2">
                  <DashboardButton type="button" size="sm" variant="secondary" onClick={() => startReplace(item)}>Replace</DashboardButton>
                  <DashboardButton type="button" size="sm" variant="danger" onClick={() => setConfirmDelete(item)}>Delete</DashboardButton>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={item.url}
                  alt={item.title || "Media undangan"}
                  onLoad={(event) => {
                    const key = item.id || item.url;
                    const width = event.currentTarget.naturalWidth;
                    const height = event.currentTarget.naturalHeight;
                    if (!key || !width || !height) return;

                    setMediaDimensions((current) => ({
                      ...current,
                      [key]: { width, height },
                    }));
                  }}
                  className="aspect-[4/3] w-full bg-[var(--dash-fog)] object-cover"
                />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                    {item.mediaType}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--dash-ink)]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[var(--dash-muted)]">
                    Dipakai sebagai: {item.mediaType === "image" ? "Gallery item" : item.mediaType}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[var(--dash-fog)] px-3 py-1 text-xs font-semibold text-[var(--dash-muted)]">
                      {readableMediaType(item.mediaType)}
                    </span>
                    {mediaDimensions[item.id || item.url] ? (
                      <span className="rounded-full bg-[var(--dash-fog)] px-3 py-1 text-xs font-semibold text-[var(--dash-muted)]">
                        {mediaDimensions[item.id || item.url].width} x {mediaDimensions[item.id || item.url].height}px
                      </span>
                    ) : null}
                    {formatMediaFileSize(item) ? (
                      <span className="rounded-full bg-[var(--dash-fog)] px-3 py-1 text-xs font-semibold text-[var(--dash-muted)]">
                        {formatMediaFileSize(item)}
                      </span>
                    ) : null}
                    {item.mimeType ? (
                      <span className="rounded-full bg-[var(--dash-fog)] px-3 py-1 text-xs font-semibold text-[var(--dash-muted)]">
                        {item.mimeType}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <DashboardButton type="button" size="sm" variant="secondary" onClick={() => startReplace(item)}>Replace</DashboardButton>
                    <DashboardButton type="button" size="sm" variant="danger" onClick={() => deleteMedia(item)}>Delete</DashboardButton>
                  </div>
                </div>
              </>
            )}
          </DashboardCard>
        ))}
        {filteredMediaItems.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-5 text-sm font-medium text-[var(--dash-muted)]">
            Belum ada media untuk tab ini.
          </div>
        ) : null}
      </div>

        <ConfirmDialog
          open={Boolean(confirmDelete)}
          title="Hapus Media?"
          message={`Media "${confirmDelete?.title || confirmDelete?.mediaType}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
          confirmLabel="Ya, Hapus"
          onConfirm={() => { deleteMedia(confirmDelete); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
        </>
      )}
    </motion.section>
  );
}
