import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, W, H, fontFamily } from "../theme";

export type Cam = { cx: number; cy: number; zoom: number };
export const CAM_HOME: Cam = { cx: W / 2, cy: H / 2, zoom: 1 };
export const BASE_SCALE = 0.82;

// Green environment the screens sit in: deep gradient, a slow drifting glow,
// a fine grid of light and a vignette. Never full-bleed UI.
export const Ground: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const f = useCurrentFrame();
  const gx = 50 + Math.sin(f / 240) * 12;
  const gy = 42 + Math.cos(f / 300) * 8;
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 800px at ${gx}% ${gy}%, rgba(0,127,57,${0.42 * intensity}), rgba(0,77,36,${0.18 * intensity}) 45%, transparent 75%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.06 * intensity,
          backgroundImage: `linear-gradient(${C.bright} 1px, transparent 1px), linear-gradient(90deg, ${C.bright} 1px, transparent 1px)`,
          backgroundSize: "96px 96px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

// Frames a 1920x1080 synthetic screen at 82% on the ground, with soft
// perspective and a breathing drift. `cam` pushes in on a region of the screen.
export const Stage: React.FC<{ cam?: Cam; children: React.ReactNode; overlay?: React.ReactNode; tilt?: number }> = ({
  cam = CAM_HOME,
  children,
  overlay,
  tilt = 1,
}) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const s = BASE_SCALE * cam.zoom;
  const drift = Math.sin((f / Math.max(durationInFrames, 1)) * Math.PI) * 6;
  const tx = W / 2 - s * cam.cx;
  const ty = H / 2 - s * cam.cy + drift * 0.4;
  return (
    <AbsoluteFill style={{ perspective: 2400 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          transformOrigin: "0 0",
          transform: `translate(${tx}px, ${ty}px) scale(${s}) rotateX(${1.2 * tilt}deg) rotateY(${-0.8 * tilt}deg)`,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(38,191,107,0.25), 0 0 80px rgba(38,191,107,0.12)`,
        }}
      >
        {children}
        {overlay}
      </div>
    </AbsoluteFill>
  );
};

// Numbered call-out in screen coordinates: a soft highlight box, a thin leader
// line drawn out to a marker and a short label.
export const Callout: React.FC<{
  n?: number;
  box: [number, number, number, number]; // x, y, w, h in screen px
  label: string;
  side?: "right" | "left" | "top" | "bottom";
  p: number; // 0..1 draw progress
  gold?: boolean;
}> = ({ n, box, label, side = "right", p, gold }) => {
  const [x, y, w, h] = box;
  const col = gold ? C.gold : C.bright;
  const len = 120;
  const ax = side === "right" ? x + w : side === "left" ? x : x + w / 2;
  const ay = side === "bottom" ? y + h : side === "top" ? y : y + h / 2;
  const dx = side === "right" ? len : side === "left" ? -len : 0;
  const dy = side === "bottom" ? len * 0.7 : side === "top" ? -len * 0.7 : 0;
  const lp = Math.min(1, p * 1.6);
  const tp = Math.max(0, (p - 0.45) / 0.55);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 6,
          top: y - 6,
          width: w + 12,
          height: h + 12,
          borderRadius: 12,
          border: `2px solid ${col}`,
          boxShadow: `0 0 24px ${col}55, inset 0 0 24px ${col}22`,
          opacity: Math.min(1, p * 2),
        }}
      />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        <line x1={ax} y1={ay} x2={ax + dx * lp} y2={ay + dy * lp} stroke={col} strokeWidth={2} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: ax + dx + (side === "left" ? -12 : 12),
          top: ay + dy,
          transform: `translate(${side === "left" ? "-100%" : "0"}, -50%)`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: tp,
          fontFamily,
        }}
      >
        {n != null ? (
          <span style={{ width: 34, height: 34, borderRadius: 34, background: col, color: "#04160C", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {n}
          </span>
        ) : null}
        <span style={{ padding: "8px 14px", borderRadius: 10, background: "rgba(8,14,12,0.92)", border: `1px solid ${col}88`, color: C.off, fontSize: 20, fontWeight: 600, whiteSpace: "nowrap" }}>
          {label}
        </span>
      </div>
    </>
  );
};
