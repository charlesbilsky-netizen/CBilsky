import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, eur, fontFamily } from "../theme";
import { prog, reveal } from "../ui/anim";

// Ch17 · A simulated chat-workspace DM with Ollie, the review assistant.
// Not a SalesMind page: it sits on its own dark-navy ground (the Ollie visual
// language), drawn entirely in code. Every figure is synthetic, every deal a
// DEMO record, and the film layer adds the SIMULATED TRAINING SCREEN badge.

const NAVY = "#141927";
const NAVY2 = "#1A2033";
const NAVY3 = "#222941";
const LINE = "#2E3650";

// The owl mark, drawn as a small geometric constellation. No logo file.
export const OwlMark: React.FC<{ size?: number; glow?: number }> = ({ size = 44, glow = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <g stroke={C.bright} strokeWidth={1.6} fill="none" opacity={0.95}>
      <path d="M8 14 L14 6 L18 13 L26 13 L30 6 L36 14 L34 28 L22 38 L10 28 Z" />
      <path d="M14 6 L22 11 L30 6" opacity={0.7} />
      <path d="M10 28 L22 24 L34 28" opacity={0.5} />
    </g>
    <circle cx={16.5} cy={19} r={3.2} fill={C.bright} opacity={0.9 * glow} />
    <circle cx={27.5} cy={19} r={3.2} fill={C.bright} opacity={0.9 * glow} />
    <path d="M20 25 L22 28 L24 25" stroke={C.gold} strokeWidth={1.4} fill="none" opacity={0.8} />
  </svg>
);

const Avatar: React.FC<{ size?: number }> = ({ size = 46 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 10,
      background: NAVY3,
      border: `1px solid ${C.bright}44`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 0 18px ${C.bright}22`,
      flexShrink: 0,
    }}
  >
    <OwlMark size={size * 0.72} />
  </div>
);

const Tag: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.gold }) => (
  <span
    style={{
      padding: "3px 10px",
      borderRadius: 6,
      background: `${color}1f`,
      border: `1px solid ${color}88`,
      color,
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: 1.2,
    }}
  >
    {children}
  </span>
);

const row = { display: "flex", gap: 16, alignItems: "flex-start" } as const;

// A line of the review message. Label on the left, value on the right.
const Fact: React.FC<{ k: string; v: React.ReactNode; hot?: boolean }> = ({ k, v, hot }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 24, padding: "7px 0", borderBottom: `1px solid ${LINE}55`, fontSize: 19 }}>
    <span style={{ color: "#8E99B8" }}>{k}</span>
    <span style={{ color: hot ? C.bright : "#E8ECF6", fontWeight: hot ? 650 : 500, textAlign: "right" }}>{v}</span>
  </div>
);

export const OllieDM: React.FC<{ start?: number; ask?: number; answer?: number; filed?: number; human?: number }> = ({
  start = 0,
  ask = 40,
  answer = 70,
  filed = 10000,
  human = 10000,
}) => {
  const f = useCurrentFrame() - start;
  const typed = "How am I tracking?";
  const nTyped = Math.max(0, Math.min(typed.length, Math.floor((f - ask) / 1.6)));
  const sent = f >= ask + typed.length * 1.6 + 10;
  const ans = (k: number) => reveal(prog(f, answer + k, 14));
  return (
    <AbsoluteFill style={{ background: NAVY, fontFamily, display: "flex", flexDirection: "row" }}>
      {/* Workspace rail */}
      <div style={{ width: 320, background: NAVY2, borderRight: `1px solid ${LINE}`, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#F0F3FA", display: "flex", alignItems: "center", gap: 10 }}>
          Training Workspace <span style={{ fontSize: 13, color: "#8E99B8", fontWeight: 500 }}>▾</span>
        </div>
        <div style={{ height: 1, background: LINE }} />
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: 1.2, color: "#7B86A6" }}>DIRECT MESSAGES</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: NAVY3, border: `1px solid ${C.bright}33` }}>
          <Avatar size={34} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 650, color: "#F0F3FA" }}>Ollie</div>
            <div style={{ fontSize: 13, color: "#8E99B8" }}>Review Assistant · AI</div>
          </div>
        </div>
        {["Demo teammate", "Demo teammate"].map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 12px", opacity: 0.45 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: NAVY3 }} />
            <div style={{ fontSize: 16, color: "#AAB4CE" }}>{n}</div>
          </div>
        ))}
      </div>

      {/* Conversation */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 34px", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: "#F0F3FA" }}>Ollie</span>
              <Tag>BETA · PILOT</Tag>
              <Tag color={C.info}>AI</Tag>
            </div>
            <div style={{ fontSize: 15, color: "#8E99B8", marginTop: 2 }}>Goes through your performance review with you · How does Ollie work?</div>
          </div>
          <div style={{ fontSize: 15, color: "#7B86A6" }}>Training dataset · Day 45</div>
        </div>

        <div style={{ flex: 1, padding: "26px 34px", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, transform: `translateY(${-(prog(f, filed - 6, 20) * 130 + prog(f, human - 6, 20) * 170)}px)` }}>
          {/* Starter buttons */}
          <div style={{ ...row, ...reveal(prog(f, 6, 14)) }}>
            <Avatar />
            <div>
              <div style={{ fontSize: 18, color: "#AAB4CE", marginBottom: 10 }}>
                <b style={{ color: "#F0F3FA" }}>Ollie</b> · Day 45 · 09:12
              </div>
              <div style={{ fontSize: 20, color: "#E8ECF6", marginBottom: 14 }}>Good morning, Alex. Ask me where you stand, any day.</div>
              <div style={{ display: "flex", gap: 12 }}>
                {["My current agreement", "My next review"].map((b) => (
                  <div key={b} style={{ padding: "10px 18px", borderRadius: 9, border: `1px solid ${C.bright}66`, color: C.bright, fontSize: 18, fontWeight: 600, background: `${C.bright}0d` }}>
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* The RM asks */}
          {f >= ask ? (
            <div style={{ ...row, flexDirection: "row-reverse" }}>
              <div style={{ width: 46, height: 46, borderRadius: 10, background: C.deep, border: `1px solid ${C.bright}44`, display: "flex", alignItems: "center", justifyContent: "center", color: C.off, fontWeight: 700, fontSize: 18 }}>
                AM
              </div>
              <div style={{ maxWidth: 560 }}>
                <div style={{ fontSize: 18, color: "#AAB4CE", marginBottom: 8, textAlign: "right" }}>
                  <b style={{ color: "#F0F3FA" }}>Alex Morgan</b> · 09:13
                </div>
                <div style={{ padding: "12px 18px", borderRadius: 12, background: sent ? C.deep : NAVY3, border: `1px solid ${sent ? C.bright + "55" : LINE}`, fontSize: 21, color: "#F0F3FA" }}>
                  {typed.slice(0, nTyped)}
                  {!sent && nTyped < typed.length ? <span style={{ color: C.bright }}>|</span> : null}
                </div>
              </div>
            </div>
          ) : null}

          {/* Ollie answers: the review message, shape from the framework */}
          {f >= answer ? (
            <div style={row}>
              <Avatar />
              <div style={{ flex: 1, maxWidth: 980 }}>
                <div style={{ fontSize: 18, color: "#AAB4CE", marginBottom: 8, ...ans(0) }}>
                  <b style={{ color: "#F0F3FA" }}>Ollie</b> · 09:13 <Tag color={C.info}>AI</Tag>
                </div>
                <div style={{ padding: "20px 24px", borderRadius: 14, background: NAVY2, border: `1px solid ${LINE}`, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8, ...ans(0) }}>
                    <span style={{ fontSize: 21, fontWeight: 650, color: "#F0F3FA" }}>Where you stand · training dataset</span>
                    <Tag color={C.bright}>ON TRACK</Tag>
                  </div>
                  <div style={{ ...ans(4) }}>
                    <Fact k="Active milestone" v={`${eur(500000)} liquid NAV · due Day 90`} hot />
                  </div>
                  <div style={{ ...ans(8) }}>
                    <Fact k="Current total liquid NAV" v={`${eur(1000000)} (synthetic)`} />
                  </div>
                  <div style={{ ...ans(12) }}>
                    <Fact k="Gap to milestone" v={`${eur(250000)} · 45 days left`} hot />
                  </div>
                  <div style={{ ...ans(16) }}>
                    <Fact k="Previous rung" v="Met, Day 30" />
                  </div>
                  <div style={{ ...ans(20) }}>
                    <Fact k="Recorded this week" v="6 calls · 4 follow-up emails · 2 meetings" />
                  </div>
                  <div style={{ ...ans(24) }}>
                    <Fact k="Atlas Quant Partners · DEMO" v={`Onboarding · ${eur(250000)} · KYC passed`} />
                  </div>
                  <div style={{ ...ans(28) }}>
                    <Fact k="Horizon Asset Practice · DEMO" v={`Funding Pending · ${eur(250000)} · expected Day 60`} />
                  </div>
                  <div style={{ fontSize: 19, color: "#C9D2E8", marginTop: 12, lineHeight: 1.5, ...ans(34) }}>
                    One question before your next review: does the Horizon funding date still hold? If it does, I would propose Day 60 as the delivery agreement.
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Filed, marked as filed by the AI */}
          {f >= filed ? (
            <div style={{ ...row, ...reveal(prog(f, filed, 14)) }}>
              <Avatar />
              <div>
                <div style={{ fontSize: 18, color: "#AAB4CE", marginBottom: 8 }}>
                  <b style={{ color: "#F0F3FA" }}>Ollie</b> · Day 46 · 10:02
                </div>
                <div style={{ padding: "14px 20px", borderRadius: 12, background: NAVY2, border: `1px solid ${LINE}`, fontSize: 20, color: "#E8ECF6", display: "flex", alignItems: "center", gap: 14 }}>
                  Review agreed and filed.
                  <Tag color={C.violet}>FILED BY THE AI</Tag>
                </div>
              </div>
            </div>
          ) : null}

          {/* The human line */}
          {f >= human ? (
            <div style={{ ...row, ...reveal(prog(f, human, 16)) }}>
              <Avatar />
              <div
                style={{
                  padding: "16px 24px",
                  borderRadius: 12,
                  background: `${C.gold}10`,
                  border: `1px solid ${C.gold}77`,
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#F2E9D8",
                  boxShadow: `0 0 30px ${C.gold}22`,
                }}
              >
                Committee decisions, pay and employment are decided by people.
              </div>
            </div>
          ) : null}
        </div>
        </div>

        {/* Composer */}
        <div style={{ margin: "0 34px 26px", padding: "14px 20px", borderRadius: 12, border: `1px solid ${LINE}`, background: NAVY2, color: "#5F6A8C", fontSize: 18 }}>
          Message Ollie — training environment, no live connection
        </div>
      </div>
    </AbsoluteFill>
  );
};
