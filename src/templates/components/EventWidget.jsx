"use client";

import React from "react";
import { motion } from "framer-motion";

export const defaultEventWidgetConfig = {
  enabled: true,
  variant: "cards",
  showMaps: true,
  showIcon: true,
  cardEnabled: true,
  cardBackgroundMode: "color",
  cardBackgroundColor: "",
  cardBackgroundImage: "",
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

function EventLineIcon({ type = "event", className = "h-6 w-6" }) {
  const commonProps = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "akad") {
    return (
      <svg {...commonProps}>
        <circle cx="9" cy="13" r="4.2" />
        <circle cx="15" cy="13" r="4.2" />
        <path d="M11.8 9.7 13 7.4l1.2 2.3" />
        <path d="M12 4.8 10.8 7.4h2.4L12 4.8Z" />
      </svg>
    );
  }

  if (type === "resepsi") {
    return (
      <svg {...commonProps}>
        <path d="m12 3 1.4 4.2L18 8.6l-4.6 1.4L12 14l-1.4-4L6 8.6l4.6-1.4L12 3Z" />
        <path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" />
        <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
      </svg>
    );
  }

  if (type === "venue") {
    return (
      <svg {...commonProps}>
        <path d="M4 21V9l8-5 8 5v12" />
        <path d="M9 21v-7h6v7" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg {...commonProps}>
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (type === "pin") {
    return (
      <svg {...commonProps}>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}

function getEventIconType(title = "") {
  const normalizedTitle = String(title).toLowerCase();
  if (/(akad|nikah|ijab|pemberkatan|holy|blessing)/i.test(normalizedTitle)) {
    return "akad";
  }
  if (/(resepsi|reception|party|wedding|pesta)/i.test(normalizedTitle)) {
    return "resepsi";
  }
  if (/(ngunduh|mantu|venue|rumah|home)/i.test(normalizedTitle)) {
    return "venue";
  }
  return "event";
}

function EventDetail({ type, children }) {
  if (!children) {
    return null;
  }

  return (
    <span className="mt-2 flex items-center justify-center gap-2 text-current">
      <EventLineIcon type={type} className="h-4 w-4 shrink-0 opacity-75" />
      <span>{children}</span>
    </span>
  );
}

function cardVisualProps(config = {}, fallbackClass = "") {
  if (config.cardEnabled === false) {
    return {
      className: `${fallbackClass} border-transparent bg-transparent shadow-none`,
      style: {
        backgroundColor: "transparent",
        backgroundImage: "none",
        borderColor: "transparent",
        boxShadow: "none",
      },
      hasOverlay: false,
    };
  }

  const hasImage = config.cardBackgroundMode === "image" && config.cardBackgroundImage;
  return {
    className: `${fallbackClass} relative overflow-hidden`,
    style: {
      backgroundColor: hasImage ? undefined : config.cardBackgroundColor || undefined,
      backgroundImage: hasImage ? `url(${config.cardBackgroundImage})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    hasOverlay: Boolean(hasImage),
  };
}

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
  const cardProps = cardVisualProps(config, classes.item || "");

  return (
    <>
      {config.showIcon && iconSrc ? (
        <img src={iconSrc} alt="" className={classes.icon || "mx-auto mt-7 w-16"} />
      ) : null}
      <div className={classes.container || "mt-8 space-y-5"}>
        {events.map((event) => (
          <motion.article
            key={`${event.title}-${event.time}-${event.venue}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            className={cardProps.className}
            style={cardProps.style}
          >
            {cardProps.hasOverlay ? <div className="absolute inset-0 bg-white/74" /> : null}
            <div className="relative z-10">
              {config.showIcon ? (
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-current text-[var(--color-accent)]">
                  <EventLineIcon type={getEventIconType(event.title)} />
                </div>
              ) : null}
              <p className={classes.eyebrow || ""}>{event.title}</p>
              <h3 className={classes.title || ""}>
                <EventDetail type="calendar">{formatEventDate(event.date)}</EventDetail>
              </h3>
              <p className={classes.time || ""}>
                <EventDetail type="clock">{formatEventTime(event.time)}</EventDetail>
              </p>
              <p className={classes.venue || ""}>{event.venue}</p>
              <p className={classes.address || ""}>
                <EventDetail type="pin">{event.address}</EventDetail>
              </p>
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
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}
