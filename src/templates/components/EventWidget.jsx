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
            <h3 className={classes.title || ""}>{event.date}</h3>
            <p className={classes.time || ""}>{event.time}</p>
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
