"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const monthMap = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
};

const initialTimeLeft = {
  isComplete: false,
  items: [
    ["00", "Hari"],
    ["00", "Jam"],
    ["00", "Menit"],
    ["00", "Detik"],
  ],
};

const confettiColors = ["#c8a24a", "#0f1f3d", "#f5d76e", "#ffffff", "#b76e79"];

export const defaultCountdownWidgetConfig = {
  enabled: true,
  eventIndex: 0,
  variant: "cards",
  completeText: "Acara sedang berlangsung",
};

export function getCountdownWidgetConfig(designConfig = {}) {
  return {
    ...defaultCountdownWidgetConfig,
    ...(designConfig.widgets?.countdown || {}),
  };
}

export function getCountdownTargetEvent(events = [], config = defaultCountdownWidgetConfig) {
  const index = Number(config.eventIndex || 0);
  return events[index] || events[0] || null;
}

function parseTimeParts(timeText = "") {
  const match = String(timeText).match(/(\d{1,2})[.:](\d{2})/);

  if (!match) {
    return { hours: 0, minutes: 0 };
  }

  return {
    hours: Number(match[1] || 0),
    minutes: Number(match[2] || 0),
  };
}

function parseIndonesianDate(dateText = "", timeText = "") {
  const normalized = String(dateText).toLowerCase().replace(/,/g, " ");
  const match = normalized.match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = monthMap[match[2]];
  const year = Number(match[3]);
  const { hours, minutes } = parseTimeParts(timeText);

  if (!Number.isFinite(day) || month === undefined || !Number.isFinite(year)) {
    return null;
  }

  return new Date(year, month, day, hours, minutes, 0, 0);
}

export function parseCountdownTargetDate(event) {
  const safeEvent = event || {};
  const dateText = safeEvent.date || safeEvent.eventDate || safeEvent.event_date;
  const timeText = safeEvent.time || safeEvent.eventTime || safeEvent.event_time;

  if (!dateText) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(dateText)) {
    const { hours, minutes } = parseTimeParts(timeText);
    const [year, month, day] = dateText.split("-").map(Number);
    return new Date(year, month - 1, day, hours, minutes, 0, 0);
  }

  const indonesianDate = parseIndonesianDate(dateText, timeText);

  if (indonesianDate) {
    return indonesianDate;
  }

  const fallbackDate = new Date(`${dateText} ${timeText || ""}`.trim());
  return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
}

function getTimeLeft(targetDate) {
  if (!targetDate) {
    return initialTimeLeft;
  }

  const diff = Math.max(0, targetDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, "0");

  return {
    isComplete: diff <= 0,
    items: [
      [pad(days), "Hari"],
      [pad(hours), "Jam"],
      [pad(minutes), "Menit"],
      [pad(seconds), "Detik"],
    ],
  };
}

function createConfettiPiece(index) {
  const angle = -90 + (Math.random() - 0.5) * 110;
  const distance = 130 + Math.random() * 120;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;

  return {
    id: `${Date.now()}-${index}`,
    color: confettiColors[index % confettiColors.length],
    x,
    y,
    rotate: Math.round(Math.random() * 540),
    delay: Math.random() * 0.12,
    size: 6 + Math.round(Math.random() * 5),
    shape: index % 3 === 0 ? "rounded-full" : "rounded-[2px]",
  };
}

export default function CountdownTimer({
  event,
  containerClassName = "",
  itemClassName = "",
  valueClassName = "",
  labelClassName = "",
  completeText = "Acara sedang berlangsung",
}) {
  const targetDate = useMemo(() => parseCountdownTargetDate(event), [event]);
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const previousCompleteRef = useRef(null);
  const hasBurstRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    previousCompleteRef.current = null;
    hasBurstRef.current = false;
    setConfettiPieces([]);
    setTimeLeft(getTimeLeft(targetDate));

    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    if (!isMounted) return undefined;

    const wasComplete = previousCompleteRef.current;
    previousCompleteRef.current = timeLeft.isComplete;

    if (wasComplete === false && timeLeft.isComplete && !hasBurstRef.current) {
      hasBurstRef.current = true;
      setConfettiPieces(Array.from({ length: 34 }, (_, index) => createConfettiPiece(index)));

      const timeout = window.setTimeout(() => {
        setConfettiPieces([]);
      }, 1800);

      return () => window.clearTimeout(timeout);
    }

    return undefined;
  }, [isMounted, timeLeft.isComplete]);

  return (
    <div className="relative">
      {confettiPieces.length ? (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-20 mx-auto h-1 w-1 overflow-visible">
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className={`absolute left-0 top-0 block ${piece.shape}`}
              style={{
                width: piece.size,
                height: piece.size * 1.35,
                backgroundColor: piece.color,
                animation: `countdown-confetti-burst 1.45s ${piece.delay}s ease-out forwards`,
                "--confetti-x": `${piece.x}px`,
                "--confetti-y": `${piece.y}px`,
                "--confetti-rotate": `${piece.rotate}deg`,
              }}
            />
          ))}
        </div>
      ) : null}
      <div className={containerClassName}>
        {timeLeft.items.map(([value, label]) => (
          <div key={label} className={itemClassName}>
            <p className={valueClassName}>{value}</p>
            <p className={labelClassName}>{label}</p>
          </div>
        ))}
      </div>
      {isMounted && timeLeft.isComplete ? (
        <p className="mt-4 text-xs font-black uppercase tracking-[0.12em]">
          {completeText}
        </p>
      ) : null}
    </div>
  );
}
