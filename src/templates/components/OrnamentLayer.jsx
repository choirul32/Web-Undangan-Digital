"use client";

import React from "react";

const slotClasses = {
  fill: "inset-0",
  "top-left": "left-0 top-0",
  "top-right": "right-0 top-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
  "center-top": "left-1/2 top-0",
  "center-bottom": "bottom-0 left-1/2",
  "side-left": "left-0 top-1/2",
  "side-right": "right-0 top-1/2",
  center: "left-1/2 top-1/2",
};

const slotTransforms = {
  "center-top": "translateX(-50%)",
  "center-bottom": "translateX(-50%)",
  "side-left": "translateY(-50%)",
  "side-right": "translateY(-50%)",
  center: "translate(-50%, -50%)",
};

function sizeValue(value) {
  if (typeof value === "number") {
    return `${value}px`;
  }

  return value || undefined;
}

function secondsValue(value, fallback) {
  const number = Number(value);
  return `${Number.isFinite(number) ? number : fallback}s`;
}

function animationName(value) {
  if (!value || value === "none") {
    return "none";
  }

  return `ornament-${value}`;
}

function entranceName(value) {
  if (!value || value === "none") {
    return "none";
  }

  return `ornament-entrance-${value}`;
}

export default function OrnamentLayer({ ornaments = [], className = "" }) {
  if (!ornaments.length) {
    return null;
  }

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <style>{`
        @keyframes ornament-fade {
          0%, 100% { opacity: var(--ornament-opacity); }
          50% { opacity: calc(var(--ornament-opacity) * 0.46); }
        }
        @keyframes ornament-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -8px; }
        }
        @keyframes ornament-sway {
          0%, 100% { rotate: 0deg; }
          50% { rotate: 4deg; }
        }
        @keyframes ornament-pulse {
          0%, 100% { scale: 1; }
          50% { scale: 1.045; }
        }
        @keyframes ornament-slow-rotate {
          from { rotate: 0deg; }
          to { rotate: 360deg; }
        }
        @keyframes ornament-entrance-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ornament-entrance-fade-up {
          from { opacity: 0; translate: 0 18px; }
          to { opacity: 1; translate: 0 0; }
        }
        @keyframes ornament-entrance-zoom-in {
          from { opacity: 0; scale: 0.88; }
          to { opacity: 1; scale: 1; }
        }
        @keyframes ornament-entrance-pop-up {
          0% { opacity: 0; scale: 0.7; }
          72% { opacity: 1; scale: 1.08; }
          100% { opacity: 1; scale: 1; }
        }
        @keyframes ornament-entrance-slide-left {
          from { opacity: 0; translate: 24px 0; }
          to { opacity: 1; translate: 0 0; }
        }
        @keyframes ornament-entrance-slide-right {
          from { opacity: 0; translate: -24px 0; }
          to { opacity: 1; translate: 0 0; }
        }
        @keyframes ornament-entrance-drop-in {
          from { opacity: 0; translate: 0 -28px; }
          to { opacity: 1; translate: 0 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nusa-ornament-animated,
          .nusa-ornament-entrance {
            animation: none !important;
          }
        }
      `}</style>
      {ornaments.map((ornament) => {
        const sequence = ornament.sequence || {};
        const slot = ornament.slot || "top-left";
        const mirrorScale = ornament.mirror ? -1 : 1;
        const anchorTransform = slotTransforms[slot] || "";
        const entrance =
          ornament.entrance && ornament.entrance !== "none"
            ? ornament.entrance
            : sequence.entrance || "none";
        const animation =
          ornament.animation && ornament.animation !== "none"
            ? ornament.animation
            : sequence.animation || "none";
        const entranceDelay = ornament.entranceDelay ?? sequence.entranceDelay ?? 0;
        const animationDelay = ornament.delay ?? sequence.animationDelay ?? 0;
        const transform = `${anchorTransform} translate(${sizeValue(ornament.x) || "0px"}, ${
          sizeValue(ornament.y) || "0px"
        }) rotate(${ornament.rotate || 0}deg) scaleX(${mirrorScale})`;

        return (
          <span
            key={ornament.id}
            className={`absolute nusa-ornament-entrance ${slotClasses[slot] || slotClasses["top-left"]}`}
            style={{
              "--ornament-opacity": ornament.opacity ?? 1,
              width: sizeValue(ornament.width),
              height: sizeValue(ornament.height),
              opacity: ornament.opacity ?? 1,
              zIndex: ornament.zIndex ?? 0,
              transform,
              animationName: entranceName(entrance),
              animationDuration: secondsValue(ornament.entranceDuration, 0.8),
              animationDelay: secondsValue(entranceDelay, 0),
              animationTimingFunction: entrance === "pop-up" ? "cubic-bezier(.2,.8,.2,1)" : "ease-out",
              animationFillMode: "both",
            }}
          >
            <img
              src={ornament.src}
              alt=""
              className="nusa-ornament-animated block h-full w-full"
              style={{
                objectFit: ornament.objectFit || "contain",
                animationName: animationName(animation),
                animationDuration: secondsValue(ornament.duration, 6),
                animationDelay: secondsValue(animationDelay, 0),
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
              }}
            />
          </span>
        );
      })}
    </div>
  );
}
