"use client";

import "leaflet/dist/leaflet.css";

import React, { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

const DEFAULT_POSITION = { lat: -6.2, lng: 106.816666 };

function parseCoordinates(url = "") {
  const match = String(url).match(
    /(?:query=|q=|@)(-?\d+(?:\.\d+)?)[,%2C\s]+(-?\d+(?:\.\d+)?)/i,
  );

  if (!match) {
    return null;
  }

  return {
    lat: Number(match[1]),
    lng: Number(match[2]),
  };
}

function MapInteraction({ position, onChange }) {
  const map = useMap();

  useMapEvents({
    click(event) {
      onChange({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  useEffect(() => {
    map.flyTo([position.lat, position.lng], Math.max(map.getZoom(), 15), {
      duration: 0.7,
    });
  }, [map, position]);

  return null;
}

async function lookupAddress(position) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(position.lat),
    lon: String(position.lng),
    "accept-language": "id",
  });
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Alamat titik ini belum dapat ditemukan.");
  }

  const result = await response.json();
  return result.display_name || "";
}

export default function MapLocationPicker({
  open,
  initialAddress = "",
  initialUrl = "",
  onClose,
  onSelect,
}) {
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [address, setAddress] = useState(initialAddress);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setPosition(parseCoordinates(initialUrl) || DEFAULT_POSITION);
    setAddress(initialAddress);
    setQuery("");
    setSearchResults([]);
    setMessage("");
  }, [initialAddress, initialUrl, open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const choosePosition = async (nextPosition) => {
    setPosition(nextPosition);
    setIsResolving(true);
    setMessage("Mencari alamat titik yang dipilih...");

    try {
      const nextAddress = await lookupAddress(nextPosition);
      setAddress(nextAddress);
      setMessage("Lokasi ditemukan. Periksa alamat sebelum digunakan.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsResolving(false);
    }
  };

  const searchLocation = async (event) => {
    event.preventDefault();
    const searchQuery = query.trim();

    if (!searchQuery) {
      setMessage("Masukkan nama tempat atau alamat terlebih dahulu.");
      return;
    }

    setIsSearching(true);
    setMessage("Mencari lokasi...");

    try {
      const params = new URLSearchParams({
        format: "jsonv2",
        limit: "5",
        countrycodes: "id",
        "accept-language": "id",
        q: searchQuery,
      });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Pencarian lokasi sedang tidak tersedia.");
      }

      const results = await response.json();
      setSearchResults(results);
      setMessage(
        results.length
          ? "Pilih salah satu hasil pencarian."
          : "Lokasi tidak ditemukan. Coba kata kunci yang lebih spesifik.",
      );
    } catch (error) {
      setSearchResults([]);
      setMessage(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Browser ini tidak mendukung lokasi perangkat.");
      return;
    }

    setMessage("Meminta lokasi perangkat...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        choosePosition({
          lat: coords.latitude,
          lng: coords.longitude,
        }),
      () => setMessage("Lokasi perangkat tidak dapat diakses."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const confirmLocation = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`;
    onSelect({
      address: address.trim() || `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`,
      mapsUrl,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-location-title"
    >
      <div className="flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 id="map-location-title" className="text-xl font-semibold">
              Pilih lokasi acara
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Cari tempat atau klik langsung pada peta untuk menentukan titik.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Tutup pemilih lokasi"
          >
            x
          </button>
        </header>

        <div className="overflow-y-auto p-5">
          <form onSubmit={searchLocation} className="flex flex-col gap-2 sm:flex-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari gedung, masjid, hotel, atau alamat"
              className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="min-h-11 rounded-xl bg-slate-800 px-4 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
            >
              {isSearching ? "Mencari..." : "Cari Lokasi"}
            </button>
            <button
              type="button"
              onClick={useCurrentLocation}
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Lokasi Saya
            </button>
          </form>

          {searchResults.length ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  type="button"
                  onClick={() => {
                    setSearchResults([]);
                    setAddress(result.display_name);
                    choosePosition({
                      lat: Number(result.lat),
                      lng: Number(result.lon),
                    });
                  }}
                  className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm font-medium text-slate-700 last:border-b-0 hover:bg-slate-50"
                >
                  {result.display_name}
                </button>
              ))}
            </div>
          ) : null}

          <div className="relative z-0 mt-4 h-[360px] overflow-hidden rounded-2xl border border-slate-200">
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={13}
              scrollWheelZoom
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapInteraction position={position} onChange={choosePosition} />
              <CircleMarker
                center={[position.lat, position.lng]}
                radius={10}
                pathOptions={{
                  color: "#ffffff",
                  fillColor: "#dc2626",
                  fillOpacity: 1,
                  weight: 3,
                }}
              >
                <Popup>Titik lokasi acara</Popup>
              </CircleMarker>
            </MapContainer>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Alamat terpilih
            </label>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={2}
              className="mt-2 block w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm font-medium text-slate-900 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              placeholder="Alamat lokasi akan muncul di sini dan tetap bisa diedit."
            />
            <p className="mt-2 text-xs font-medium text-slate-500">
              {message || "Klik peta untuk memindahkan titik lokasi."}
            </p>
          </div>
        </div>

        <footer className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={confirmLocation}
            disabled={isResolving}
            className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
          >
            {isResolving ? "Memuat Alamat..." : "Gunakan Lokasi"}
          </button>
        </footer>
      </div>
    </div>
  );
}
