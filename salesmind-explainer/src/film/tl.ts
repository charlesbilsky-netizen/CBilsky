import timeline from "../generated/timeline.json";
import { Easing, interpolate } from "remotion";
import type { Cam } from "../ui/Stage";
import { ease } from "../ui/anim";

export type Line = { id: string; from: number; dur: number; text: string };
export type ChapterTL = (typeof timeline.chapters)[number];
export const TL = timeline;

export const chapter = (n: number) => TL.chapters.find((c) => c.n === n)!;

// Each voice file ends on about 0.4 s of air; phrase timing uses the spoken part.
const AIR = 12;

// Frame (relative to the chapter body) at which a line starts.
export const lineFrom = (n: number, id: string) => {
  const l = chapter(n).lines.find((x) => x.id === id);
  if (!l) throw new Error(`no line ${id}`);
  return l.from;
};

// Frame (relative to the chapter body) at which `phrase` is spoken inside a
// line, estimated from its character position. Good to a few frames for a
// steady read; cues are placed a beat early so the picture leads the word.
export const phraseAt = (n: number, id: string, phrase: string, lead = 4) => {
  const l = chapter(n).lines.find((x) => x.id === id)!;
  const i = l.text.indexOf(phrase);
  if (i < 0) throw new Error(`phrase "${phrase}" not in ${id}`);
  const spoken = Math.max(1, l.dur - AIR);
  return Math.round(l.from + (i / l.text.length) * spoken) - lead;
};

export const lineEnd = (n: number, id: string) => {
  const l = chapter(n).lines.find((x) => x.id === id)!;
  return l.from + l.dur - AIR;
};

// Eased camera path through keyframes [frame, cam]. Holds outside the range.
export const camPath = (f: number, keys: [number, Cam][]): Cam => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, a] = keys[i];
    const [t1, b] = keys[i + 1];
    if (f <= t1) {
      const p = interpolate(f, [t0, t1], [0, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return { cx: a.cx + (b.cx - a.cx) * p, cy: a.cy + (b.cy - a.cy) * p, zoom: a.zoom + (b.zoom - a.zoom) * p };
    }
  }
  return keys[keys.length - 1][1];
};

// Pick the active value of a stepped property: [[frame, value], ...].
export const step = <T,>(f: number, steps: [number, T][]): T => {
  let v = steps[0][1];
  for (const [t, x] of steps) if (f >= t) v = x;
  return v;
};

// 0..1 window: fades in at a, out at b.
export const win = (f: number, a: number, b = Infinity, fade = 10) =>
  Math.min(
    interpolate(f, [a, a + fade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    b === Infinity ? 1 : interpolate(f, [b - fade, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
