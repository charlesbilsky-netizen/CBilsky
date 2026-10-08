import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { C, fontFamily } from "../theme";
import { prog } from "./anim";

// Chapter title over its fal plate: number in green, title, a single rule
// drawing across. The plate is graded down to the film's green-on-black.
export const Plate: React.FC<{ src?: string; dim?: number; scaleFrom?: number; scaleTo?: number }> = ({
  src,
  dim = 0.45,
  scaleFrom = 1.04,
  scaleTo = 1.1,
}) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const sc = interpolate(f, [0, durationInFrames], [scaleFrom, scaleTo]);
  return (
    <AbsoluteFill style={{ background: C.ground, overflow: "hidden" }}>
      {src ? (
        <AbsoluteFill style={{ transform: `scale(${sc})`, filter: "saturate(0.85) contrast(1.12) brightness(0.8)" }}>
          <Video src={staticFile(src)} muted loop objectFit="cover" />
        </AbsoluteFill>
      ) : null}
      {/* Grade: crush the greys toward the film's ground, keep highlights luminous. */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(1,14,7,${dim}) 0%, rgba(1,14,7,${dim * 0.6}) 50%, rgba(1,14,7,${dim + 0.2}) 100%)`, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)" }} />
    </AbsoluteFill>
  );
};

export const TitleCard: React.FC<{ num: string; title: string; kicker?: string; plate?: string }> = ({ num, title, kicker, plate }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pIn = prog(f, 6, 22);
  const rule = prog(f, 14, 30);
  const out = 1 - prog(f, durationInFrames - 14, 14);
  return (
    <AbsoluteFill>
      <Plate src={plate} dim={0.5} />
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 180, fontFamily, opacity: out }}>
        <div style={{ color: C.bright, fontWeight: 600, fontSize: 26, letterSpacing: 4, opacity: pIn, transform: `translateY(${(1 - pIn) * 12}px)` }}>{num}</div>
        <div style={{ height: 2, width: 560 * rule, background: `linear-gradient(90deg, ${C.bright}, transparent)`, margin: "22px 0 26px" }} />
        <div style={{ color: C.off, fontWeight: 600, fontSize: 78, letterSpacing: -1.6, lineHeight: 1.05, maxWidth: 1300, opacity: pIn, transform: `translateY(${(1 - pIn) * 18}px)` }}>
          {title}
        </div>
        {kicker ? (
          <div style={{ marginTop: 22, color: C.muted, fontSize: 28, fontWeight: 500, opacity: prog(f, 20, 20) }}>{kicker}</div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
