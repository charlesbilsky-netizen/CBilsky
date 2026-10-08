import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { C, fontFamily } from "../theme";
import { prog } from "../ui/anim";
import { Cam, Stage, Callout } from "../ui/Stage";

// ---------------------------------------------------------------------------
// Shots. A chapter body is a list of shots; each runs from its `at` frame to
// the next shot's, and cross-dissolves in over XF frames. `node` receives the
// body-relative frame so cue times line up with the narration timeline.
export const XF = 12;
export type Shot = { at: number; node: (bf: number) => React.ReactNode; cut?: boolean };

const ShotFrame: React.FC<{ at: number; first: boolean; cut?: boolean; node: Shot["node"] }> = ({ at, first, cut, node }) => {
  const f = useCurrentFrame();
  const op = first || cut ? 1 : interpolate(f, [0, XF], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: op }}>{node(f + at)}</AbsoluteFill>;
};

export const Body: React.FC<{ shots: Shot[]; len: number }> = ({ shots, len }) => (
  <>
    {shots.map((s, i) => {
      const end = i < shots.length - 1 ? shots[i + 1].at + XF : len;
      return (
        <Sequence key={i} from={s.at} durationInFrames={Math.max(1, end - s.at)} layout="none">
          <ShotFrame at={s.at} first={i === 0} cut={s.cut} node={s.node} />
        </Sequence>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------
// A synthetic screen on the stage, with optional film-layer overlay (call-outs,
// cursor) in screen coordinates.
export const Scr: React.FC<{ cam?: Cam; children: React.ReactNode; over?: React.ReactNode }> = ({ cam, children, over }) => (
  <Stage cam={cam} overlay={over}>
    {children}
  </Stage>
);

export type CO = { a: number; b?: number; box: [number, number, number, number]; label: string; side?: "right" | "left" | "top" | "bottom"; n?: number; gold?: boolean };

// A run of call-outs, each drawing in at `a` and fading at `b`.
export const Callouts: React.FC<{ f: number; items: CO[] }> = ({ f, items }) => (
  <>
    {items.map((c, i) => {
      if (f < c.a) return null;
      const p = prog(f, c.a, 16);
      const out = c.b == null ? 1 : interpolate(f, [c.b - 8, c.b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      if (out <= 0) return null;
      return (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: out }}>
          <Callout box={c.box} label={c.label} side={c.side} n={c.n} gold={c.gold} p={p} />
        </div>
      );
    })}
  </>
);

// Soft spotlight: dims everything outside a box (screen coordinates).
export const Spot: React.FC<{ f: number; a: number; b?: number; box: [number, number, number, number]; dim?: number }> = ({ f, a, b, box, dim = 0.55 }) => {
  const p = Math.min(prog(f, a, 14), b == null ? 1 : 1 - prog(f, b - 12, 12));
  if (p <= 0) return null;
  const [x, y, w, h] = box;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 10,
        top: y - 10,
        width: w + 20,
        height: h + 20,
        borderRadius: 14,
        boxShadow: `0 0 0 4000px rgba(1,10,6,${dim * p})`,
        pointerEvents: "none",
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// One-line principle. Designed type on dark glass, lower third.
export const Principle: React.FC<{ f: number; a: number; b?: number; text: string; gold?: boolean; y?: number }> = ({ f, a, b, text, gold, y = 860 }) => {
  const p = prog(f, a, 20);
  const out = b == null ? 1 : 1 - prog(f, b - 14, 14);
  if (p <= 0 || out <= 0) return null;
  const col = gold ? C.gold : C.bright;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        opacity: p * out,
        transform: `translateY(${(1 - p) * 14}px)`,
        fontFamily,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "22px 36px 22px 30px",
          borderRadius: 16,
          background: "rgba(6,14,11,0.86)",
          border: `1px solid ${col}55`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.55), 0 0 40px ${col}1f`,
        }}
      >
        <div style={{ width: 4, height: 44, borderRadius: 4, background: col, boxShadow: `0 0 16px ${col}` }} />
        <div style={{ fontSize: 40, fontWeight: 600, color: C.off, letterSpacing: -0.6 }}>{text}</div>
      </div>
    </div>
  );
};

// Keyboard keys that press in turn.
export const Keys: React.FC<{ f: number; a: number; keys: string[]; at?: number[]; x?: number; y?: number; b?: number }> = ({ f, a, keys, at = [], x = 960, y = 940, b }) => {
  const p = prog(f, a, 14);
  const out = b == null ? 1 : 1 - prog(f, b - 12, 12);
  if (p <= 0 || out <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", display: "flex", gap: 14, opacity: p * out, fontFamily, zIndex: 20 }}>
      {keys.map((k, i) => {
        const t = at[i];
        const press = t != null && f >= t && f < t + 8 ? Math.sin(((f - t) / 8) * Math.PI) : 0;
        const lit = t != null && f >= t;
        return (
          <div
            key={k + i}
            style={{
              minWidth: 64,
              height: 64,
              padding: "0 18px",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 600,
              color: lit ? "#04160C" : C.off,
              background: lit ? C.bright : "rgba(23,30,32,0.95)",
              border: `1px solid ${lit ? C.bright : C.line}`,
              boxShadow: `0 ${6 - press * 4}px 0 ${lit ? C.deep : "#0A0F10"}, 0 12px 30px rgba(0,0,0,0.5)`,
              transform: `translateY(${press * 4}px)`,
            }}
          >
            {k}
          </div>
        );
      })}
    </div>
  );
};

// Small film-layer note (not product UI): a label on dark glass.
export const Note: React.FC<{ f: number; a: number; b?: number; x: number; y: number; text: string; sub?: string; gold?: boolean; w?: number }> = ({ f, a, b, x, y, text, sub, gold, w }) => {
  const p = prog(f, a, 14);
  const out = b == null ? 1 : 1 - prog(f, b - 10, 10);
  if (p <= 0 || out <= 0) return null;
  const col = gold ? C.gold : C.bright;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity: p * out,
        transform: `translateY(${(1 - p) * 10}px)`,
        padding: "14px 20px",
        borderRadius: 12,
        background: "rgba(6,14,11,0.92)",
        border: `1px solid ${col}77`,
        boxShadow: `0 16px 40px rgba(0,0,0,0.5)`,
        fontFamily,
        zIndex: 30,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 600, color: C.off }}>{text}</div>
      {sub ? <div style={{ fontSize: 17, color: C.muted, marginTop: 4 }}>{sub}</div> : null}
    </div>
  );
};

// Highlight box only, no label (screen coordinates).
export const Box: React.FC<{ f: number; a: number; b?: number; box: [number, number, number, number]; gold?: boolean }> = ({ f, a, b, box, gold }) => {
  const p = prog(f, a, 10);
  const out = b == null ? 1 : 1 - prog(f, b - 8, 8);
  if (p <= 0 || out <= 0) return null;
  const col = gold ? C.gold : C.bright;
  const [x, y, w, h] = box;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 6,
        top: y - 6,
        width: w + 12,
        height: h + 12,
        borderRadius: 12,
        border: `2px solid ${col}`,
        boxShadow: `0 0 24px ${col}55, inset 0 0 24px ${col}1a`,
        opacity: p * out,
        transform: `scale(${1.03 - 0.03 * p})`,
        pointerEvents: "none",
      }}
    />
  );
};

export const press = (f: number, t: number) => (f >= t && f < t + 8 ? Math.sin(((f - t) / 8) * Math.PI) : 0);
