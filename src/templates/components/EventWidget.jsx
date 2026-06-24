"use client";

import React from "react";
import { motion } from "framer-motion";

export const defaultEventWidgetConfig = {
  enabled: true,
  variant: "cards",
  showMaps: true,
  showIcon: true,
};

export function getEventWidgetConfig(designConfig = {}) {
  return {
    ...defaultEventWidgetConfig,
    ...(designConfig.widgets?.events || {}),
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function formatEventDate(value = "") {
  if (!value) {
    return "";
  }

  const isoDate = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = isoDate
    ? new Date(
        Number(isoDate[1]),
        Number(isoDate[2]) - 1,
        Number(isoDate[3]),
      )
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatEventTime(value = "") {
  const rawTime = String(value).trim();
  if (!rawTime) {
    return "";
  }

  const normalizedTime = rawTime
    .replace(/^pukul\s*:?\s*/i, "")
    .replace(/\b(\d{1,2}):(\d{2})\b/g, "$1.$2")
    .replace(/\s*[-–—]\s*/g, " - ");
  const timeWithZone = /\b(WIB|WITA|WIT)\b/i.test(normalizedTime)
    ? normalizedTime
    : `${normalizedTime} WIB`;

  return `Pukul : ${timeWithZone}`;
}

export default function EventWidget({
  events = [],
  config = defaultEventWidgetConfig,
  iconSrc,
  classes = {},
  mapsLabel = "Buka Maps",
}) {
  if (!config.enabled) {
    return null;
  }

  return (
    <>
      {config.showIcon && iconSrc ? (
        <img src={iconSrc} alt="" className={classes.icon || "mx-auto mt-7 w-16"} />
      ) : config.showIcon ? (
        <div className={classes.icon || "mx-auto mt-7 flex h-14 w-14 items-center justify-center rounded-full border border-current"}>
          <span className="h-5 w-5 rounded-full bg-current" />
        </div>
      ) : null}
      <div className={classes.container || "mt-8 space-y-5"}>
        {events.map((event) => (
          <motion.article
            key={`${event.title}-${event.time}-${event.venue}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            className={classes.item || ""}
          >
            <p className={classes.eyebrow || ""}>{event.title}</p>
            <h3 className={classes.title || ""}>{formatEventDate(event.date)}</h3>
            <p className={classes.time || ""}>{formatEventTime(event.time)}</p>
            <p className={classes.venue || ""}>{event.venue}</p>
            <p className={classes.address || ""}>{event.address}</p>
            {config.showMaps ? (
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={classes.button || ""}
              >
                {mapsLabel}
              </a>
            ) : null}
          </motion.article>
        ))}
      </div>
    </>
  );
}
