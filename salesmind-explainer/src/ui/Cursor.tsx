import React from "react";
import { interpolate } from "remotion";
import { C } from "../theme";
import { ease } from "./anim";

// Synthetic pointer in screen coordinates. `path` is [frame, x, y] keyframes
// (eased between them); `clicks` are frames where it presses. Drawn inside a
// Stage overlay so it moves with the camera.
export const Cursor: React.FC<{ f: number; path: [number, number, number][]; clicks?: number[]; show?: [number, number] }> = ({
  f,
  path,
  clicks = [],
  show,
}) => {
  let x = path[0][1];
  let y = path[0][2];
  for (let i = 0; i < path.length - 1; i++) {
    const [t0, x0, y0] = path[i];
    const [t1, x1, y1] = path[i + 1];
    if (f >= t0 && f <= t1) {
      const p = interpolate(f, [t0, t1], [0, 1], { easing: ease });
      x = x0 + (x1 - x0) * p;
      y = y0 + (y1 - y0) * p;
    } else if (f > t1) {
      x = x1;
      y = y1;
    }
  }
  const [a, b] = show ?? [path[0][0] - 8, Infinity];
  const op = Math.min(
    interpolate(f, [a, a + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    b === Infinity ? 1 : interpolate(f, [b - 8, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  if (op <= 0) return null;
  // Press: a 7-frame dip in scale and an expanding ring.
  let press = 0;
  let ring = -1;
  for (const c of clicks) {
    if (f >= c && f < c + 7) press = Math.sin(((f - c) / 7) * Math.PI);
    if (f >= c && f < c + 18) ring = (f - c) / 18;
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, pointerEvents: "none", zIndex: 50 }}>
      {ring >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: -22 - ring * 14,
            top: -22 - ring * 14,
            width: 44 + ring * 28,
            height: 44 + ring * 28,
            borderRadius: 999,
            border: `2px solid ${C.bright}`,
            opacity: 1 - ring,
          }}
        />
      ) : null}
      <svg width={30} height={36} viewBox="0 0 30 36" style={{ transform: `scale(${1 - press * 0.14})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.55))" }}>
        <path d="M2 2 L2 28 L9 21.5 L14 33 L19 31 L14 19.5 L24 19.5 Z" fill={C.off} stroke="#0B1210" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};
