import { Easing, interpolate } from "remotion";

export const ease = Easing.bezier(0.65, 0, 0.35, 1); // cubic in-out

// 0 → 1 over `dur` frames starting at `start`, eased.
export const prog = (frame: number, start: number, dur = 12) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// Staggered reveal: item i appears `gap` frames after item i-1.
export const stagger = (frame: number, i: number, start = 0, gap = 1.2, dur = 10) =>
  prog(frame, start + i * gap, dur);

// Fade/slide-up style for a revealed element.
export const reveal = (p: number, dist = 14) => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dist}px)`,
});

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
