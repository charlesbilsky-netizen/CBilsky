import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, fontFamily } from "../theme";
import { prog } from "../ui/anim";
import { Ground } from "../ui/Stage";
import { Plate, TitleCard } from "../ui/TitleCard";
import { TrainingBadge } from "../ui/TrainingBadge";
import { TL, ChapterTL, lineFrom } from "./tl";
import { Body, XF } from "./kit";
import { shotsFor } from "./chapters";

const KICKER: Record<number, string> = {
  2: "One place for your book, your pipeline and your day",
  3: "Four groups. Eleven pages.",
  4: "The control surface",
  5: "Where a task and an hour become the same thing",
  6: "Your deals, and only yours",
  7: "Stages, cards and the review table",
  8: "Every active deal has exactly one next action",
  9: "New money from funded clients",
  10: "Check before you approach",
  11: "The full log of your book",
  12: "Six sections on one page",
  13: "Inside the Pipeline, on its own tab",
  14: "Your real day beside your tasks",
  15: "Guidebook, materials, changelog and requests",
  16: "Close the day the same way every day",
};

// Lines where the narrator says the reassurance; the label answers with a glow.
const REASSURE = ["c03p00", "c08p00", "c10p00", "c13p00", "c14p00", "c14p04", "c16p03"];

const MainTitle: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = prog(f, 8, 30);
  const rule = prog(f, 20, 36);
  const out = 1 - prog(f, durationInFrames - 18, 18);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, f / 10) }}>
      <Plate src="fal/loop/p_orbit.mp4" dim={0.4} scaleFrom={1.0} scaleTo={1.08} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily, opacity: out }}>
        <div style={{ fontSize: 136, fontWeight: 600, color: C.off, letterSpacing: -4, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>SalesMind</div>
        <div style={{ height: 2, width: 620 * rule, margin: "26px 0 30px", background: `linear-gradient(90deg, transparent, ${C.bright}, transparent)` }} />
        <div style={{ fontSize: 46, fontWeight: 500, color: C.text, letterSpacing: 0.5, opacity: prog(f, 26, 26) }}>The RM Operating System</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = prog(f, 10, 30);
  const out = 1 - prog(f, durationInFrames - 30, 30);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, f / 14) * out }}>
      <Plate src="fal/loop/p_orbit.mp4" dim={0.62} scaleFrom={1.08} scaleTo={1.0} blur={3} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 760px 380px at 50% 50%, rgba(1,14,7,0.82), rgba(1,14,7,0.35) 70%, transparent 100%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily }}>
        <div style={{ fontSize: 88, fontWeight: 600, color: C.off, letterSpacing: -2.5, opacity: p }}>SalesMind</div>
        <div style={{ fontSize: 34, fontWeight: 500, color: C.text, marginTop: 14, opacity: p }}>The RM Operating System</div>
        <div style={{ height: 1, width: 520, margin: "40px 0 30px", background: `linear-gradient(90deg, transparent, ${C.bright}88, transparent)`, opacity: prog(f, 24, 20) }} />
        <div style={{ fontSize: 22, color: C.muted, opacity: prog(f, 34, 20), textAlign: "center", lineHeight: 1.6 }}>
          A training film. Every name, number and screen in it is synthetic.
          <br />
          For detail, open the Guidebook in SalesMind.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [0, XF + 2], [0, 1], { extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
};

const ChapterView: React.FC<{ c: ChapterTL }> = ({ c }) => {
  const bodyLen = c.len - c.title_len;
  const shots = React.useMemo(() => shotsFor(c.n), [c.n]);
  return (
    <AbsoluteFill>
      <Sequence from={c.title_len} durationInFrames={bodyLen} layout="none">
        {c.title_len ? (
          <FadeIn>
            <Body shots={shots} len={bodyLen} />
          </FadeIn>
        ) : (
          <Body shots={shots} len={bodyLen} />
        )}
      </Sequence>
      {c.title_len ? (
        <Sequence from={0} durationInFrames={c.title_len + XF}>
          <TitleCard num={c.num} title={c.title} kicker={KICKER[c.n]} plate={`fal/loop/f${c.num}.mp4`} />
        </Sequence>
      ) : null}
      {"main_title" in c && c.main_title ? (
        <Sequence from={c.main_title.from} durationInFrames={c.main_title.dur}>
          <MainTitle />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

// Global frames of each reassurance line, for the label's glow.
const reassureAt = REASSURE.map((id) => {
  const n = parseInt(id.slice(1, 3), 10);
  const c = TL.chapters.find((x) => x.n === n)!;
  const l = c.lines.find((x) => x.id === id)!;
  return { a: c.start + c.title_len + l.from, b: c.start + c.title_len + l.from + l.dur };
});

const ch14 = TL.chapters.find((x) => x.n === 14)!;
const simFrom = ch14.start + ch14.title_len;
const simTo = ch14.start + ch14.title_len + lineFrom(14, "c14p02") - 8 + XF;

const BadgeLayer: React.FC = () => {
  const f = useCurrentFrame();
  let glow = 0;
  for (const r of reassureAt) {
    if (f >= r.a - 6 && f <= r.b + 10) glow = Math.max(glow, Math.min(prog(f, r.a - 6, 14), 1 - prog(f, r.b - 4, 14)));
  }
  const sim = Math.min(prog(f, simFrom, 10), 1 - prog(f, simTo - 10, 10));
  return (
    <>
      <TrainingBadge glow={glow} />
      {sim > 0 ? <TrainingBadge variant="simulated" top={96} opacity={sim} /> : null}
    </>
  );
};

export const Film: React.FC = () => (
  <AbsoluteFill style={{ background: C.ground }}>
    <Ground />
    {TL.chapters.map((c) => (
      <Sequence key={c.n} from={c.start} durationInFrames={c.len}>
        <ChapterView c={c} />
      </Sequence>
    ))}
    <Sequence from={TL.end_card.from} durationInFrames={TL.end_card.dur}>
      <EndCard />
    </Sequence>
    <BadgeLayer />
  </AbsoluteFill>
);
