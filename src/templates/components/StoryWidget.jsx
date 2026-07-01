"use client";

import React from "react";
import { motion } from "framer-motion";

export const defaultStoryWidgetConfig = {
  enabled: true,
  variant: "card",
  animation: "fade-up",
  cardEnabled: true,
  cardBackgroundMode: "color",
  cardBackgroundColor: "",
  cardBackgroundImage: "",
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
      initial: { opacity: 0, x: -30 },
      whileInView: { opacity: 1, x: 0 },
      transition: { delay: index * 0.15, duration: 0.5, ease: "easeOut" },
    };
  }

  if (animation === "heartbeat") {
    return {
      initial: { opacity: 0, scale: 0.85 },
      whileInView: { opacity: 1, scale: 1 },
      transition: { delay: index * 0.1, duration: 0.4, ease: "easeOut" },
    };
  }

  if (animation === "blur-to-clear") {
    return {
      initial: { opacity: 0, filter: "blur(12px)" },
      whileInView: { opacity: 1, filter: "blur(0px)" },
      transition: { delay: index * 0.08, duration: 0.6, ease: "easeOut" },
    };
  }

  if (animation === "scale-bounce") {
    return {
      initial: { opacity: 0, scale: 0.5 },
      whileInView: { opacity: 1, scale: 1 },
      transition: { delay: index * 0.1, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
    };
  }

  if (animation === "flip") {
    return {
      initial: { opacity: 0, rotateY: 90 },
      whileInView: { opacity: 1, rotateY: 0 },
      transition: { delay: index * 0.1, duration: 0.6, ease: "easeOut" },
    };
  }

  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
  };
}

function cardVisualProps(config = {}, fallbackClass = "") {
  if (config.cardEnabled === false) {
    return {
      className: `${fallbackClass} border-transparent bg-transparent shadow-none backdrop-blur-0`,
      style: {
        backgroundColor: "transparent",
        backgroundImage: "none",
        borderColor: "transparent",
        boxShadow: "none",
        backdropFilter: "none",
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

export default function StoryWidget({ stories = [], config = defaultStoryWidgetConfig, classes = {} }) {
  if (!config.enabled) {
    return null;
  }

  if (config.variant === "chapter-scroll") {
    return (
      <div className={classes.container || "mt-8 space-y-5"}>
        {stories.map((item, index) => {
          const animation = animationProps(config.animation, index);
          const cardProps = cardVisualProps(
            config,
            "group rounded-[26px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 p-6 text-left shadow-xl shadow-[var(--color-primary)]/8 backdrop-blur sm:p-8",
          );

          return (
            <motion.article
              key={`${item.year}-${item.title}-${index}`}
              {...animation}
              viewport={{ once: true, amount: 0.3 }}
              transition={animation.transition || { duration: 0.55, ease: "easeOut" }}
              className={cardProps.className}
              style={cardProps.style}
            >
              {cardProps.hasOverlay ? <div className="absolute inset-0 bg-white/74" /> : null}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--color-accent)]/12 transition-transform duration-500 group-hover:scale-125" />
              <div className="relative z-10 flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-bg)] text-lg font-black text-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/8">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  {item.year ? (
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--color-accent)]">
                      Chapter {item.year}
                    </p>
                  ) : null}
                  <h3 className="mt-2 font-serif text-2xl font-black leading-tight text-[var(--color-heading)]" style={{ fontFamily: "var(--font-heading)" }}>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base font-semibold leading-8 text-[var(--color-text)]">
                    {item.desc || item.description}
                  </p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    );
  }

  if (config.variant === "chat-style") {
    return (
      <div className={classes.container || "mt-8 space-y-4"}>
        {stories.map((item, index) => {
          const animation = animationProps(config.animation, index);
          const isRight = index % 2 === 1;
          const cardProps = cardVisualProps(
            config,
            `max-w-[82%] rounded-[24px] border border-[var(--color-accent-pale)] px-5 py-4 text-left shadow-lg shadow-[var(--color-primary)]/8 ${
              isRight
                ? "rounded-br-md bg-[var(--color-primary)] text-white"
                : "rounded-bl-md bg-[var(--color-surface)]/90 text-[var(--color-text)]"
            }`,
          );

          return (
            <motion.article
              key={`${item.year}-${item.title}-${index}`}
              {...animation}
              viewport={{ once: true, amount: 0.25 }}
              transition={animation.transition || { duration: 0.45, ease: "easeOut" }}
              className={`flex ${isRight ? "justify-end" : "justify-start"}`}
            >
              <div className={cardProps.className} style={cardProps.style}>
                {cardProps.hasOverlay ? <div className="absolute inset-0 bg-white/74" /> : null}
                <div className="relative z-10">
                {item.year ? (
                  <p className={`text-xs font-black uppercase tracking-[0.14em] ${isRight ? "text-white/70" : "text-[var(--color-accent)]"}`}>
                    {item.year}
                  </p>
                ) : null}
                <h3 className={`mt-1 text-lg font-black ${isRight ? "text-white" : "text-[var(--color-heading)]"}`}>
                  {item.title}
                </h3>
                <p className={`mt-2 text-sm font-semibold leading-6 ${isRight ? "text-white/82" : "text-[var(--color-text)]"}`}>
                  {item.desc || item.description}
                </p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    );
  }

  return (
    <div className={classes.container || "mt-8 space-y-4"}>
      {stories.map((item, index) => {
        const animation = animationProps(config.animation, index);
        const cardProps = cardVisualProps(config, classes.item || "");

        return (
          <motion.article
            key={`${item.year}-${item.title}-${index}`}
            {...animation}
            viewport={{ once: true, amount: 0.25 }}
            transition={animation.transition || { duration: 0.45, ease: "easeOut" }}
            className={cardProps.className}
            style={cardProps.style}
          >
            {cardProps.hasOverlay ? <div className="absolute inset-0 bg-white/74" /> : null}
            <div className="relative z-10">
            {classes.marker ? <span className={classes.marker} /> : null}
            {item.year ? <p className={classes.year || ""}>{item.year}</p> : null}
            <h3 className={classes.title || ""}>{item.title}</h3>
            <p className={classes.description || ""}>{item.desc || item.description}</p>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
