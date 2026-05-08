"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export const defaultGalleryWidgetConfig = {
  enabled: true,
  variant: "grid",
  limit: 6,
  includeCover: false,
};

export function getGalleryWidgetConfig(designConfig = {}) {
  return {
    ...defaultGalleryWidgetConfig,
    ...(designConfig.widgets?.gallery || {}),
  };
}

export default function GalleryWidget({
  images = [],
  coverImage,
  config = defaultGalleryWidgetConfig,
  classes = {},
}) {
  const [activeImage, setActiveImage] = useState(null);

  if (!config.enabled) {
    return null;
  }

  const galleryImages = [
    ...(config.includeCover && coverImage ? [coverImage] : []),
    ...images,
  ].slice(0, Number(config.limit || images.length || 6));

  if (!galleryImages.length) {
    return null;
  }

  const isCarousel = config.variant === "carousel";

  return (
    <>
      <div className={classes.container || "mt-8 grid grid-cols-2 gap-3"}>
        {galleryImages.map((image, index) => (
          <motion.button
            key={`${image}-${index}`}
            type="button"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.04 }}
            onClick={() => setActiveImage(image)}
            className={`${classes.item || ""} ${
              isCarousel ? "snap-center" : ""
            }`}
          >
            <img src={image} alt="Wedding gallery" className={classes.image || ""} />
          </motion.button>
        ))}
      </div>

      {activeImage ? (
        <button
          type="button"
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/82 p-4"
        >
          <img
            src={activeImage}
            alt="Preview gallery"
            className="max-h-full max-w-full rounded-[8px] object-contain shadow-2xl"
          />
        </button>
      ) : null}
    </>
  );
}
