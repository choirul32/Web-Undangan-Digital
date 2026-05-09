"use client";

import React, { useEffect, useMemo, useState } from "react";

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

function parseTargetDate(event = {}) {
  const dateText = event.date || event.eventDate || event.event_date;
  const timeText = event.time || event.eventTime || event.event_time;

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

export default function CountdownTimer({
  event,
  containerClassName = "",
  itemClassName = "",
  valueClassName = "",
  labelClassName = "",
  completeText = "Acara sedang berlangsung",
}) {
  const targetDate = useMemo(() => parseTargetDate(event), [event]);
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

  useEffect(() => {
    setIsMounted(true);
    setTimeLeft(getTimeLeft(targetDate));

    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  return (
    <div>
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
