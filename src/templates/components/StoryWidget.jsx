"use client";

import React from "react";
import { motion } from "framer-motion";

export const defaultStoryWidgetConfig = {
  enabled: true,
  variant: "card",
  animation: "fade-up",
};

export function getStoryWidgetConfig(designConfig = {}) {
  return {
    ...defaultStoryWidgetConfig,
    ...(designConfig.widgets?.story || {}),
  };
}

function animationProps(animation, index) {
  if (animation === "zoom-in") {
    return {
      initial: { opacity: 0, scale: 0.94 },
      whileInView: { opacity: 1, scale: 1 },
    };
  }

  if (animation === "slide-left") {
    return {
      initial: { opacity: 0, x: 24 },
      whileInView: { opacity: 1, x: 0 },
    };
  }

  if (animation === "stagger") {
    return {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      transition: { delay: index * 0.08, duration: 0.45, ease: "easeOut" },
    };
  }

  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
  };
}

export default function StoryWidget({ stories = [], config = defaultStoryWidgetConfig, classes = {} }) {
  if (!config.enabled) {
    return null;
  }

  return (
    <div className={classes.container || "mt-8 space-y-4"}>
      {stories.map((item, index) => {
        const animation = animationProps(config.animation, index);

        return (
          <motion.article
            key={`${item.year}-${item.title}-${index}`}
            {...animation}
            viewport={{ once: true, amount: 0.25 }}
            transition={animation.transition || { duration: 0.45, ease: "easeOut" }}
            className={classes.item || ""}
          >
            {classes.marker ? <span className={classes.marker} /> : null}
            {item.year ? <p className={classes.year || ""}>{item.year}</p> : null}
            <h3 className={classes.title || ""}>{item.title}</h3>
            <p className={classes.description || ""}>{item.desc || item.description}</p>
          </motion.article>
        );
      })}
    </div>
  );
}
