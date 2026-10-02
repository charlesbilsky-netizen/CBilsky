import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Motion } from "./shots";

// Camera move over the still: start and end transform for the slot.
const MOVES: Record<Motion["move"], [string, string]> = {
  push: ["scale(1.04)", "scale(1.16)"],
  pull: ["scale(1.18)", "scale(1.05)"],
  panL: ["scale(1.14) translateX(3%)", "scale(1.14) translateX(-3%)"],
  panR: ["scale(1.14) translateX(-3%)", "scale(1.14) translateX(3%)"],
  rise: ["scale(1.14) translateY(4%)", "scale(1.14) translateY(-4%)"],
  drift: ["scale(1.1) translate(-1%, 1%)", "scale(1.13) translate(1%, -1%)"],
};

const lerpTransform = (from: string, to: string, t: number) => {
  // Both ends share the same function list, so interpolate the numbers in order.
  const a = from.match(/-?\d*\.?\d+/g)!.map(Number);
  const b = to.match(/-?\d*\.?\d+/g)!.map(Number);
  let i = 0;
  return from.replace(/-?\d*\.?\d+/g, () => {
    const v = a[i] + (b[i] - a[i]) * t;
    i++;
    return v.toFixed(4);
  });
};

const Rain: React.FC<{ seed: string }> = ({ seed }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const drops = 220;
  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}
    >
      {Array.from({ length: drops }, (_, i) => {
        const x0 = random(`${seed}-x-${i}`) * (width + 200) - 100;
        const speed = 38 + random(`${seed}-s-${i}`) * 30;
        const len = 30 + random(`${seed}-l-${i}`) * 50;
        const y = ((random(`${seed}-y-${i}`) * height + frame * speed) % (height + len)) - len;
        const x = x0 - y * 0.12;
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x - len * 0.12}
            y2={y + len}
            stroke="rgba(205,220,235,0.38)"
            strokeWidth={1.8}
          />
        );
      })}
    </svg>
  );
};

const SweepLight: React.FC<{ kind: NonNullable<Motion["sweep"]>; progress: number }> = ({
  kind,
  progress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (kind === "green") {
    // Warm room light gives way to hard green fluorescent over the slot.
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "rgb(40,120,70)",
          mixBlendMode: "color",
          opacity: interpolate(progress, [0.35, 0.8], [0, 0.32], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    );
  }
  const color =
    kind === "redblue"
      ? Math.floor((frame / fps) * 2.5) % 2 === 0
        ? "rgba(230,40,40,0.55)"
        : "rgba(40,80,240,0.55)"
      : kind === "amber"
        ? "rgba(229,161,59,0.38)"
        : "rgba(235,240,255,0.5)";
  const x = interpolate(progress, [0, 1], [-30, 130]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 38% 70% at ${x}% 45%, ${color}, transparent 70%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

export const StillShot: React.FC<{
  src: string;
  motion: Motion;
  durationInFrames: number;
  seed: string;
}> = ({ src, motion, durationInFrames, seed }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Ease the move so it starts and settles without a jolt.
  const eased = 0.5 - Math.cos(Math.PI * t) / 2;
  const [from, to] = MOVES[motion.move];
  const flicker = motion.flicker
    ? 1 - (random(`${seed}-f-${Math.floor(frame / 2)}`) < 0.12 ? 0.18 : 0)
    : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: lerpTransform(from, to, eased),
          filter: `brightness(${flicker})`,
        }}
      />
      {motion.sweep ? <SweepLight kind={motion.sweep} progress={t} /> : null}
      {motion.rain ? <Rain seed={seed} /> : null}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45))",
        }}
      />
    </AbsoluteFill>
  );
};
