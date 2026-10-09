import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, fontFamily } from "../theme";
import { ease, prog, mix } from "../ui/anim";
import { Icon } from "../ui/primitives";

// Film-layer motion graphics. Every frame value here is the chapter-body frame
// passed down from the shot, so cues line up with the narration timeline.

const glass: React.CSSProperties = {
  background: "rgba(10,20,17,0.82)",
  border: `1px solid rgba(38,191,107,0.28)`,
  borderRadius: 16,
  boxShadow: "0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
  fontFamily,
};

const Kicker: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.bright, style }) => (
  <div style={{ fontFamily, fontSize: 18, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color, ...style }}>{children}</div>
);

// ---------------------------------------------------------------------------
// Ch1 · six competing signals drift in, then settle into one ordered column.
const SIGNALS = [
  { t: "First contact coming due", i: "clock" },
  { t: "Next action overdue", i: "alert" },
  { t: "Follow-up to send", i: "mail" },
  { t: "Deal with no next step", i: "pipeline" },
  { t: "Internal request open", i: "requests" },
  { t: "Calendar tighter than it looks", i: "calendar" },
];
const SCATTER = [
  [300, 250, -6, 0.92],
  [1250, 190, 4, 1.04],
  [620, 610, 3, 1.0],
  [1380, 560, -4, 0.96],
  [180, 760, 5, 0.9],
  [1080, 820, -3, 0.94],
];
// Order once sorted: overdue action, first contact, no next step, follow-up, request, calendar.
const ORDER = [1, 0, 3, 2, 4, 5];

export const Signals: React.FC<{ f: number; at: number[]; orderAt: number; out?: number }> = ({ f, at, orderAt, out }) => {
  const o = prog(f, orderAt, 40);
  const fade = out == null ? 1 : 1 - prog(f, out, 16);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      {SIGNALS.map((s, i) => {
        const p = prog(f, at[i], 18);
        if (p <= 0) return null;
        const [sx, sy, rot, sc] = SCATTER[i];
        const rank = ORDER.indexOf(i);
        const tx = 960 - 230;
        const ty = 210 + rank * 104;
        const drift = Math.sin((f + i * 40) / 50) * 6 * (1 - o);
        const x = mix(sx, tx, o);
        const y = mix(sy, ty, o) + drift;
        const top = rank === 0 && o > 0.6;
        return (
          <div
            key={s.t}
            style={{
              ...glass,
              position: "absolute",
              left: x,
              top: y,
              width: 460,
              height: 84,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "0 24px",
              opacity: p,
              transform: `rotate(${mix(rot, 0, o)}deg) scale(${mix(sc, 1, o) * (0.94 + 0.06 * p)})`,
              border: `1px solid ${top ? C.bright : "rgba(38,191,107,0.28)"}`,
              boxShadow: top ? `0 0 0 1px ${C.bright}, 0 0 40px ${C.bright}44, 0 24px 60px rgba(0,0,0,0.5)` : glass.boxShadow,
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(38,191,107,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={s.i} size={22} color={C.bright} />
            </div>
            <div style={{ fontSize: 25, fontWeight: 600, color: C.off }}>{s.t}</div>
            {o > 0.5 ? (
              <div style={{ marginLeft: "auto", fontSize: 18, fontWeight: 600, color: top ? C.bright : C.faint, opacity: prog(f, orderAt + 24, 14) }}>{rank + 1}</div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Ch2 · one place: a calm hub, then the nine things it holds.
const HUB_ITEMS = [
  { t: "Deals", i: "pipeline" },
  { t: "Tasks", i: "tasks" },
  { t: "Client activity", i: "activity" },
  { t: "Performance", i: "performance" },
  { t: "Sales plan", i: "guide" },
  { t: "Internal requests", i: "requests" },
  { t: "Guidebook", i: "guide" },
  { t: "Sales materials", i: "materials" },
  { t: "Calendar", i: "calendar", dashed: true },
];

export const Hub: React.FC<{ f: number; a: number; trio: number[]; items: number[]; out?: number }> = ({ f, a, trio, items, out }) => {
  const p = prog(f, a, 24);
  const fade = out == null ? 1 : 1 - prog(f, out, 16);
  const cx = 960;
  const cy = 520;
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {HUB_ITEMS.map((_, i) => {
          const ang = -Math.PI / 2 + (i / HUB_ITEMS.length) * Math.PI * 2;
          const x = cx + Math.cos(ang) * 620;
          const y = cy + Math.sin(ang) * 330;
          const q = prog(f, items[i], 20);
          return <line key={i} x1={cx} y1={cy} x2={mix(cx, x, q)} y2={mix(cy, y, q)} stroke={C.bright} strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray={HUB_ITEMS[i].dashed ? "6 8" : undefined} />;
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: cx - 210,
          top: cy - 110,
          width: 420,
          height: 220,
          ...glass,
          borderRadius: 28,
          border: `1px solid ${C.bright}`,
          boxShadow: `0 0 80px ${C.bright}33, 0 24px 60px rgba(0,0,0,0.5)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          opacity: p,
          transform: `scale(${0.92 + 0.08 * p})`,
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 600, color: C.off, letterSpacing: -1 }}>SalesMind</div>
        <div style={{ display: "flex", gap: 10 }}>
          {["Book", "Pipeline", "Day"].map((w, i) => (
            <span key={w} style={{ fontSize: 20, fontWeight: 600, color: C.bright, padding: "6px 14px", borderRadius: 999, background: "rgba(38,191,107,0.12)", opacity: prog(f, trio[i], 12) }}>
              {w}
            </span>
          ))}
        </div>
      </div>
      {HUB_ITEMS.map((it, i) => {
        const q = prog(f, items[i], 18);
        if (q <= 0) return null;
        const ang = -Math.PI / 2 + (i / HUB_ITEMS.length) * Math.PI * 2;
        const x = cx + Math.cos(ang) * 620;
        const y = cy + Math.sin(ang) * 330;
        return (
          <div
            key={it.t}
            style={{
              position: "absolute",
              left: x - 130,
              top: y - 36,
              width: 260,
              height: 72,
              ...glass,
              border: `1px ${it.dashed ? "dashed" : "solid"} rgba(38,191,107,${it.dashed ? 0.6 : 0.3})`,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 20px",
              opacity: q,
              transform: `scale(${0.9 + 0.1 * q})`,
            }}
          >
            <Icon name={it.i} size={22} color={C.bright} />
            <div>
              <div style={{ fontSize: 21, fontWeight: 600, color: C.off }}>{it.t}</div>
              {it.dashed ? <div style={{ fontSize: 14, color: C.muted }}>once you connect it</div> : null}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Ch2 · reads from the CRM, writes back to it.
const Particle: React.FC<{ f: number; path: (t: number) => [number, number]; n: number; speed: number; color: string }> = ({ f, path, n, speed, color }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const t = (((f * speed) / 100 + i / n) % 1 + 1) % 1;
      const [x, y] = path(t);
      return <circle key={i} cx={x} cy={y} r={3.2} fill={color} opacity={Math.sin(t * Math.PI)} />;
    })}
  </>
);

export const CrmSync: React.FC<{ f: number; a: number; reads: number; writes: number; chips: [string, number][]; out?: number }> = ({ f, a, reads, writes, chips, out }) => {
  const p = prog(f, a, 22);
  const fade = out == null ? 1 : 1 - prog(f, out, 16);
  const L = [560, 470];
  const R = [1360, 470];
  const top = (t: number): [number, number] => {
    // CRM -> SalesMind, arcs above
    const x = mix(R[0] - 150, L[0] + 150, t);
    const y = 470 - Math.sin(t * Math.PI) * 170;
    return [x, y];
  };
  const bot = (t: number): [number, number] => {
    const x = mix(L[0] + 150, R[0] - 150, t);
    const y = 470 + Math.sin(t * Math.PI) * 170;
    return [x, y];
  };
  const pathD = (fn: (t: number) => [number, number]) =>
    Array.from({ length: 41 }, (_, i) => fn(i / 40))
      .map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`)
      .join(" ");
  const node = (x: number, label: string, sub: string, o: number) => (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: 470 - 80,
        width: 300,
        height: 160,
        ...glass,
        borderRadius: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: o,
      }}
    >
      <div style={{ fontSize: 38, fontWeight: 600, color: C.off }}>{label}</div>
      <div style={{ fontSize: 17, color: C.muted, marginTop: 6 }}>{sub}</div>
    </div>
  );
  const rp = prog(f, reads, 20);
  const wp = prog(f, writes, 20);
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <path d={pathD(top)} stroke={C.bright} strokeOpacity={0.5 * rp} strokeWidth={2} fill="none" strokeDasharray={`${1400 * rp} 1400`} />
        <path d={pathD(bot)} stroke={C.gold} strokeOpacity={0.6 * wp} strokeWidth={2} fill="none" strokeDasharray={`${1400 * wp} 1400`} />
        {rp > 0.5 ? <Particle f={f} path={top} n={7} speed={0.9} color={C.bright} /> : null}
        {wp > 0.5 ? <Particle f={f} path={bot} n={7} speed={0.9} color={C.gold} /> : null}
      </svg>
      {node(L[0], "SalesMind", "your workspace", p)}
      {node(R[0], "CRM", "the record", p)}
      <div style={{ position: "absolute", left: 960, top: 255, transform: "translateX(-50%)", opacity: rp }}>
        <Kicker>Reads</Kicker>
      </div>
      <div style={{ position: "absolute", left: 960, top: 668, transform: "translateX(-50%)", opacity: wp }}>
        <Kicker color={C.gold}>Writes back</Kicker>
      </div>
      {chips.map(([t, at], i) => {
        const q = interpolate(f, [at, at + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
        if (f < at) return null;
        const [x, y] = bot(0.15 + q * 0.7);
        const land = prog(f, at + 50, 12);
        return (
          <div
            key={t}
            style={{
              position: "absolute",
              left: x,
              top: y + 34 + i * 4,
              transform: "translate(-50%, -50%)",
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(217,178,106,0.14)",
              border: `1px solid ${C.gold}`,
              color: C.off,
              fontSize: 19,
              fontWeight: 600,
              opacity: 1 - land * 0.4,
            }}
          >
            {t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Ch4 peak · the order the Open deals list uses.
const RUNGS = ["Critical alerts", "Overdue next actions", "No next action", "Past the stage's time limit", "Blocked deals", "Everything else"];

export const Ladder: React.FC<{ f: number; a: number; at: number[]; out?: number }> = ({ f, a, at, out }) => {
  const p = prog(f, a, 20);
  const fade = out == null ? 1 : 1 - prog(f, out, 16);
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily, alignItems: "center" }}>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", opacity: p }}>
        <Kicker>Open deals · most urgent first</Kicker>
      </div>
      {RUNGS.map((r, i) => {
        const q = prog(f, at[i], 18);
        const w = 1040 - i * 70;
        const gold = i === 0;
        return (
          <div
            key={r}
            style={{
              position: "absolute",
              top: 200 + i * 112,
              left: 960 - w / 2,
              width: w,
              height: 88,
              ...glass,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "0 30px",
              opacity: q,
              transform: `translateY(${(1 - q) * 22}px)`,
              border: `1px solid ${gold ? C.gold : "rgba(38,191,107,0.28)"}`,
              boxShadow: gold ? `0 0 50px ${C.gold}33, 0 24px 60px rgba(0,0,0,0.5)` : glass.boxShadow,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                background: gold ? C.gold : "rgba(38,191,107,0.16)",
                color: gold ? "#1A1405" : C.bright,
                fontSize: 24,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontSize: 34, fontWeight: 600, color: C.off, letterSpacing: -0.4 }}>{r}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Ch6 · where to look first. Gold marks critical in the film's own graphics.
const ALERTS: { level: "Critical" | "Warning" | "Information"; items: string[] }[] = [
  { level: "Critical", items: ["SLA breach", "Stopped responding to onboarding", "Funding not arriving", "Qualification missing"] },
  { level: "Warning", items: ["Lead untouched", "Action overdue", "Rescheduled repeatedly", "Check contact details", "Back from Lost"] },
  { level: "Information", items: ["Suspected duplicate"] },
];

export const AlertsMap: React.FC<{ f: number; a: number; at: number[][]; clearAt: number; stayAt: number; out?: number }> = ({ f, a, at, clearAt, stayAt, out }) => {
  const p = prog(f, a, 20);
  const fade = out == null ? 1 : 1 - prog(f, out, 16);
  const col = { Critical: C.gold, Warning: C.warning, Information: C.info };
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily }}>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", opacity: p }}>
        <Kicker>Alerts · where to look first</Kicker>
      </div>
      {ALERTS.map((g, gi) => {
        const x = 170 + gi * 540;
        const gp = prog(f, at[gi][0] - 6, 14);
        return (
          <div key={g.level} style={{ position: "absolute", left: x, top: 190, width: 500, opacity: gp }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 20 }}>
              <span style={{ width: 12, height: 12, borderRadius: 12, background: col[g.level], boxShadow: `0 0 14px ${col[g.level]}` }} />
              <span style={{ fontSize: 30, fontWeight: 600, color: C.off }}>{g.level}</span>
              <span style={{ fontSize: 22, color: C.muted }}>{g.items.length}</span>
            </div>
            {g.items.map((it, ii) => {
              const q = prog(f, at[gi][ii], 14);
              const clearing = it === "Funding not arriving";
              const cleared = clearing ? prog(f, clearAt, 24) : 0;
              const stays = it === "Back from Lost" && f >= stayAt;
              return (
                <div
                  key={it}
                  style={{
                    ...glass,
                    marginBottom: 14,
                    height: 70,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "0 22px",
                    opacity: q * (1 - cleared * 0.75),
                    transform: `translateX(${(1 - q) * -16}px)`,
                    border: `1px solid ${stays ? C.warning : col[g.level] + "55"}`,
                    boxShadow: stays ? `0 0 30px ${C.warning}44` : glass.boxShadow,
                  }}
                >
                  <span style={{ width: 9, height: 9, borderRadius: 9, background: col[g.level] }} />
                  <span style={{ fontSize: 23, fontWeight: 600, color: C.off, textDecoration: cleared > 0.5 ? "line-through" : undefined }}>{it}</span>
                  {cleared > 0 ? <span style={{ marginLeft: "auto", fontSize: 18, fontWeight: 600, color: C.bright, opacity: cleared }}>✓ cleared</span> : null}
                  {stays ? <span style={{ marginLeft: "auto", fontSize: 18, fontWeight: 600, color: C.warning, opacity: prog(f, stayAt, 12) }}>stays</span> : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Ch6 · the first-contact clock.
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];

export const SlaClock: React.FC<{ f: number; a: number; inbound: number; example: number; outbound: number; late: number; out?: number }> = ({ f, a, inbound, example, outbound, late, out }) => {
  const p = prog(f, a, 20);
  const fade = out == null ? 1 : 1 - prog(f, out, 16);
  const cellW = 180;
  const x0 = 960 - (DAYS.length * cellW) / 2;
  const ex = prog(f, example, 40);
  // Fri 15:00 -> Mon 15:00, with Sat and Sun excluded.
  const fx = x0 + 4 * cellW + cellW * (15 / 24);
  const mx = x0 + 7 * cellW + cellW * (15 / 24);
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily }}>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", opacity: p }}>
        <Kicker>The clock that matters most · first contact</Kicker>
      </div>
      <div style={{ position: "absolute", left: x0, top: 210, opacity: prog(f, inbound, 16) }}>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.off }}>
          Inbound <span style={{ color: C.bright }}>· 24 hours, weekends excluded</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: x0, top: 280, display: "flex", opacity: prog(f, inbound + 6, 16) }}>
        {DAYS.map((d, i) => {
          const weekend = i === 5 || i === 6;
          return (
            <div
              key={i}
              style={{
                width: cellW - 8,
                marginRight: 8,
                height: 110,
                borderRadius: 12,
                background: weekend ? "rgba(255,255,255,0.025)" : "rgba(10,20,17,0.82)",
                border: `1px ${weekend ? "dashed" : "solid"} ${weekend ? C.line : "rgba(38,191,107,0.25)"}`,
                display: "flex",
                alignItems: "flex-end",
                padding: 14,
                fontSize: 20,
                fontWeight: 600,
                color: weekend ? C.faint : C.text,
              }}
            >
              {d}
              {weekend ? <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 500 }}>excluded</span> : null}
            </div>
          );
        })}
      </div>
      {f >= example ? (
        <>
          <div style={{ position: "absolute", left: fx, top: 270, width: 3, height: 130, background: C.bright, opacity: prog(f, example, 10) }} />
          <div style={{ position: "absolute", left: fx, top: 330, height: 8, width: Math.max(0, (mx - fx) * ex), borderRadius: 8, background: `linear-gradient(90deg, ${C.bright}, ${C.bright}88)` }} />
          <div style={{ position: "absolute", left: fx - 90, top: 408, width: 180, textAlign: "center", fontSize: 20, color: C.off, fontWeight: 600, opacity: prog(f, example, 12) }}>
            Assigned Fri 15:00
          </div>
          <div style={{ position: "absolute", left: mx, top: 270, width: 3, height: 130, background: C.gold, opacity: prog(f, example + 34, 10) }} />
          <div style={{ position: "absolute", left: mx - 150, top: 408, width: 180, textAlign: "center", fontSize: 20, color: C.gold, fontWeight: 600, opacity: prog(f, example + 34, 12) }}>
            Due Mon 15:00
          </div>
        </>
      ) : null}
      <div style={{ position: "absolute", left: x0, top: 520, opacity: prog(f, outbound, 16) }}>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.off }}>
          Outbound <span style={{ color: C.bright }}>· one calendar month</span>
        </div>
        <div style={{ marginTop: 22, width: DAYS.length * cellW - 8, height: 70, borderRadius: 12, ...glass, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${100 * prog(f, outbound + 8, 50)}%`, background: "linear-gradient(90deg, rgba(38,191,107,0.35), rgba(38,191,107,0.12))" }} />
          <div style={{ position: "absolute", left: 22, top: 20, fontSize: 22, color: C.off, fontWeight: 600 }}>Day 1 → same date next month</div>
        </div>
      </div>
      {f >= late ? (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 800,
            transform: `translateX(-50%) scale(${1.15 - 0.15 * prog(f, late, 10)})`,
            opacity: prog(f, late, 10),
            padding: "16px 30px",
            borderRadius: 14,
            border: `2px solid ${C.gold}`,
            color: C.gold,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 1,
            background: "rgba(217,178,106,0.08)",
          }}
        >
          Contact late → marked late for good
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Ch6 · no answer? Follow the schedule.
const STEPS = [
  { d: "Day 0", a: "Call + email" },
  { d: "Day 1", a: "Call" },
  { d: "Day 3", a: "Call + email" },
  { d: "Day 7", a: "Call", note: "last step · outbound" },
  { d: "Day 12", a: "Break-up email", note: "inbound" },
];

export const Cadence: React.FC<{ f: number; a: number; at: number[]; decide: number; out?: number }> = ({ f, a, at, decide, out }) => {
  const p = prog(f, a, 20);
  const fade = out == null ? 1 : 1 - prog(f, out, 16);
  const x0 = 210;
  const span = 1360;
  const pos = (i: number) => x0 + (i / (STEPS.length - 1)) * span;
  const last = at.reduce((m, t, i) => (f >= t ? i : m), -1);
  const lineP = last < 0 ? 0 : last / (STEPS.length - 1);
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily }}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", opacity: p }}>
        <Kicker>No answer · follow the schedule</Kicker>
      </div>
      <div style={{ position: "absolute", left: x0, top: 498, width: span, height: 3, background: C.line, opacity: p }} />
      <div style={{ position: "absolute", left: x0, top: 498, width: span * lineP, height: 3, background: C.bright, boxShadow: `0 0 12px ${C.bright}` }} />
      {STEPS.map((s, i) => {
        const q = prog(f, at[i], 16);
        const x = pos(i);
        return (
          <div key={s.d} style={{ position: "absolute", left: x - 110, top: 300, width: 220, display: "flex", flexDirection: "column", alignItems: "center", opacity: 0.25 + 0.75 * q }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: q > 0.5 ? C.off : C.faint }}>{s.d}</div>
            <div style={{ fontSize: 22, color: C.muted, marginTop: 8, height: 30 }}>{s.a}</div>
            <div
              style={{
                marginTop: 92,
                width: 30,
                height: 30,
                borderRadius: 30,
                background: q > 0.5 ? C.bright : C.panel,
                border: `2px solid ${C.bright}`,
                boxShadow: q > 0.5 ? `0 0 22px ${C.bright}` : undefined,
                transform: `scale(${1 + 0.3 * Math.sin(Math.min(1, q) * Math.PI)})`,
              }}
            />
            {s.note ? <div style={{ marginTop: 26, fontSize: 19, fontWeight: 600, color: C.gold, opacity: q }}>{s.note}</div> : null}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: x0 + span + 70,
          top: 455,
          ...glass,
          padding: "18px 24px",
          opacity: prog(f, decide, 16),
          border: `1px solid ${C.gold}88`,
          transform: `translateX(${(1 - prog(f, decide, 16)) * 16}px)`,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 600, color: C.off }}>Then decide</div>
        <div style={{ fontSize: 18, color: C.muted, marginTop: 4 }}>close as Lost?</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Ch7 / Ch9 · who moves each stage. Labels follow the guide's reference table.
export type Mover = { kind: "auto" | "you"; how?: string; lock?: boolean };

export const StageFlow: React.FC<{
  f: number;
  a: number;
  stages: string[];
  at: number[];
  movers?: (Mover | null)[];
  moverAt?: number[];
  side?: { labels: string[]; at: number };
  title: string;
  out?: number;
}> = ({ f, a, stages, at, movers, moverAt, side, title, out }) => {
  const p = prog(f, a, 20);
  const fade = out == null ? 1 : 1 - prog(f, out, 16);
  const n = stages.length;
  const gap = 20;
  const w = Math.min(206, (1740 - gap * (n - 1)) / n);
  const x0 = 960 - (n * w + (n - 1) * gap) / 2;
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily }}>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", opacity: p }}>
        <Kicker>{title}</Kicker>
      </div>
      {stages.map((s, i) => {
        const q = prog(f, at[i], 16);
        const m = movers?.[i] ?? null;
        const mq = m && moverAt ? prog(f, moverAt[i], 16) : 0;
        const x = x0 + i * (w + gap);
        const auto = m?.kind === "auto";
        const mc = auto ? C.bright : C.gold;
        return (
          <React.Fragment key={s}>
            {i > 0 ? <div style={{ position: "absolute", left: x - gap, top: 479, width: gap, height: 2, background: C.line, opacity: q }} /> : null}
            <div
              style={{
                position: "absolute",
                left: x,
                top: 430,
                width: w,
                height: 100,
                ...glass,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 10px",
                fontSize: 21,
                fontWeight: 600,
                lineHeight: 1.2,
                color: C.off,
                opacity: q,
                transform: `translateY(${(1 - q) * 14}px)`,
                border: `1px solid ${mq > 0.5 ? mc + "aa" : "rgba(38,191,107,0.28)"}`,
              }}
            >
              {s}
            </div>
            {m ? (
              <div style={{ position: "absolute", left: x, top: 548, width: w, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: mq, transform: `translateY(${(1 - mq) * 10}px)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, background: `${mc}22`, border: `1px solid ${mc}`, color: mc, fontSize: 17, fontWeight: 700, letterSpacing: 1 }}>
                  {auto ? "BY ITSELF" : "YOU MOVE IT"}
                </div>
                {m.how ? <div style={{ fontSize: 19, color: C.text, textAlign: "center", lineHeight: 1.35 }}>{m.how}</div> : null}
                {m.lock ? <div style={{ fontSize: 17, color: C.gold, fontWeight: 600 }}>never by hand</div> : null}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      {side ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", gap: 20, opacity: prog(f, side.at, 16) }}>
          {side.labels.map((l) => (
            <div key={l} style={{ ...glass, padding: "16px 30px", fontSize: 22, fontWeight: 600, color: C.muted, borderStyle: "dashed" }}>
              {l}
            </div>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Ch16 · the end-of-day check.
const CHECKS = [
  "Critical alerts cleared",
  "First contact deadlines protected",
  "Overdue actions worked",
  "Inbox triaged",
  "Today planned",
  "Activity recorded",
  "Ownership checked",
  "Client Growth reviewed",
  "Sales Plan reviewed",
  "Requests reviewed",
  "Calendar capacity checked",
  "Tomorrow planned",
];

export const Checklist: React.FC<{ f: number; a: number; at: number[]; finalAt: number; out?: number }> = ({ f, a, at, finalAt, out }) => {
  const p = prog(f, a, 20);
  const fade = out == null ? 1 : 1 - prog(f, out, 16);
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily }}>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", opacity: p }}>
        <Kicker>Close the day</Kicker>
      </div>
      {CHECKS.map((c, i) => {
        const col = i < 6 ? 0 : 1;
        const row = i % 6;
        const q = prog(f, at[i], 12);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: 300 + col * 680,
              top: 190 + row * 84,
              width: 640,
              height: 66,
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: 0.35 + 0.65 * p * (0.4 + 0.6 * q),
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                border: `2px solid ${q > 0 ? C.bright : C.faint}`,
                background: q > 0 ? `rgba(38,191,107,${0.9 * q})` : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#04160C",
                fontSize: 22,
                fontWeight: 800,
                transform: `scale(${1 + 0.25 * Math.sin(Math.min(1, q) * Math.PI)})`,
              }}
            >
              {q > 0.4 ? "✓" : ""}
            </div>
            <div style={{ fontSize: 28, fontWeight: 500, color: q > 0 ? C.off : C.muted }}>{c}</div>
          </div>
        );
      })}
      {f >= finalAt ? (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 735,
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "22px 34px",
            borderRadius: 16,
            background: "rgba(217,178,106,0.08)",
            border: `1px solid ${C.gold}`,
            boxShadow: `0 0 50px ${C.gold}33`,
            opacity: prog(f, finalAt, 16),
          }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 10, background: C.gold, color: "#1A1405", fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
          <div style={{ fontSize: 34, fontWeight: 600, color: C.off }}>Every important deal has a next action</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Small diagram: one thing leads to another (film layer, not product UI).
export const Link2: React.FC<{ f: number; a: number; left: [string, string]; right: [string, string]; label?: string; out?: number; y?: number }> = ({ f, a, left, right, label, out, y = 420 }) => {
  const p = prog(f, a, 18);
  const q = prog(f, a + 14, 26);
  const fade = out == null ? 1 : 1 - prog(f, out, 14);
  const box = (t: [string, string], x: number, o: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: 440, ...glass, padding: "26px 30px", opacity: o }}>
      <div style={{ fontSize: 30, fontWeight: 600, color: C.off }}>{t[0]}</div>
      <div style={{ fontSize: 19, color: C.muted, marginTop: 6 }}>{t[1]}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily }}>
      {box(left, 340, p)}
      <div style={{ position: "absolute", left: 800, top: y + 58, width: 320 * q, height: 2, background: C.bright, boxShadow: `0 0 10px ${C.bright}` }} />
      {label ? <div style={{ position: "absolute", left: 800, width: 320, top: y + 18, textAlign: "center", fontSize: 18, fontWeight: 600, color: C.bright, opacity: q }}>{label}</div> : null}
      {box(right, 1140, prog(f, a + 30, 16))}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Ch13 · new RMs finalise the plan within ten days.
export const TenDays: React.FC<{ f: number; a: number; mark: number; out?: number }> = ({ f, a, mark, out }) => {
  const fade = out == null ? 1 : 1 - prog(f, out, 14);
  const w = 132;
  const x0 = 960 - (10 * w) / 2;
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily }}>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", opacity: prog(f, a, 16) }}>
        <Kicker>New RMs · the first ten days</Kicker>
      </div>
      {Array.from({ length: 10 }).map((_, i) => {
        const q = prog(f, a + 6 + i * 3, 12);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + i * w,
              top: 330,
              width: w - 10,
              height: 120,
              ...glass,
              borderRadius: 12,
              display: "flex",
              alignItems: "flex-end",
              padding: 14,
              fontSize: 20,
              fontWeight: 600,
              color: C.text,
              opacity: q,
              border: `1px solid ${i === 9 && f >= mark ? C.gold : "rgba(38,191,107,0.25)"}`,
            }}
          >
            Day {i + 1}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: x0, top: 480, height: 6, borderRadius: 6, width: 10 * w * prog(f, a + 20, 50), background: `linear-gradient(90deg, ${C.bright}, ${C.gold})` }} />
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 560,
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: prog(f, mark, 16),
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 600, color: C.off }}>Sales plan finalised</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: C.gold, marginTop: 10, letterSpacing: 2, textTransform: "uppercase" }}>A compliance step</div>
      </div>
    </AbsoluteFill>
  );
};
