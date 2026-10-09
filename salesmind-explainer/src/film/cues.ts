// Sound-design cue registry. Chapter builders register cues as they compute
// their timing, so picture and sound share one clock. scripts/export-cues
// reads this back for the mixer. Frames are chapter-body relative.
export type SfxKind = "click" | "chip" | "toggle" | "drop" | "confirm" | "tick" | "alert" | "whoosh" | "riser" | "impact" | "keys" | "typing" | "shimmer" | "stamp" | "swipe";
export type CueEntry = { n: number; f: number; kind: SfxKind; gain: number };

const reg = new Map<string, CueEntry>();
export const cue = (n: number, f: number, kind: SfxKind, gain = 0) => {
  reg.set(`${n}:${f}:${kind}`, { n, f, kind, gain });
  return f;
};
export const allCues = () => [...reg.values()].sort((a, b) => a.n - b.n || a.f - b.f);
