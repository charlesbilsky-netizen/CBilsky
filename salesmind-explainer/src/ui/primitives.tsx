import React from "react";
import { C, R, fontFamily } from "../theme";

export const Panel: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      background: C.panel,
      border: `1px solid ${C.line}`,
      borderRadius: R.card,
      boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = C.muted,
  style,
}) => (
  <div style={{ fontFamily, fontWeight: 600, fontSize: 13, letterSpacing: 1.3, textTransform: "uppercase", color, ...style }}>
    {children}
  </div>
);

export const Chip: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, active, color = C.bright, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 14px",
      borderRadius: R.pill,
      fontFamily,
      fontWeight: 500,
      fontSize: 16,
      color: active ? C.ground : C.text,
      background: active ? color : "rgba(255,255,255,0.04)",
      border: `1px solid ${active ? color : C.line}`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

export const Button: React.FC<{
  children: React.ReactNode;
  primary?: boolean;
  pressed?: number; // 0..1 press animation
  style?: React.CSSProperties;
}> = ({ children, primary, pressed = 0, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 16px",
      borderRadius: R.control,
      fontFamily,
      fontWeight: 600,
      fontSize: 16,
      color: primary ? "#04160C" : C.text,
      background: primary ? C.bright : "rgba(255,255,255,0.05)",
      border: `1px solid ${primary ? C.bright : C.line}`,
      transform: `scale(${1 - pressed * 0.04})`,
      boxShadow: primary ? `0 0 ${18 * pressed}px ${C.bright}` : undefined,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

export const Tabs: React.FC<{ items: string[]; active: number; counts?: (number | string | null)[]; style?: React.CSSProperties }> = ({
  items,
  active,
  counts,
  style,
}) => (
  <div style={{ display: "flex", gap: 28, borderBottom: `1px solid ${C.line}`, ...style }}>
    {items.map((t, i) => (
      <div
        key={t}
        style={{
          fontFamily,
          fontWeight: i === active ? 600 : 500,
          fontSize: 18,
          color: i === active ? C.off : C.muted,
          padding: "10px 0 12px",
          borderBottom: `2px solid ${i === active ? C.bright : "transparent"}`,
          marginBottom: -1,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        {t}
        {counts && counts[i] != null ? (
          <span style={{ fontSize: 13, color: C.muted, background: "rgba(255,255,255,0.06)", borderRadius: 999, padding: "2px 8px" }}>
            {counts[i]}
          </span>
        ) : null}
      </div>
    ))}
  </div>
);

export type AlertLevel = "critical" | "warning" | "info";
export const alertLevel = (a: string | null | undefined): AlertLevel | null => {
  if (!a) return null;
  if (["SLA breach", "Stopped responding to onboarding", "Funding not arriving", "Qualification missing"].includes(a)) return "critical";
  if (a === "Suspected duplicate") return "info";
  return "warning";
};
const levelColor = { critical: C.critical, warning: C.warning, info: C.info };

export const AlertBadge: React.FC<{ alert: string; glow?: number }> = ({ alert, glow = 0 }) => {
  const lvl = alertLevel(alert) ?? "info";
  const col = levelColor[lvl];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "4px 10px",
        borderRadius: 6,
        fontFamily,
        fontWeight: 600,
        fontSize: 13,
        color: col,
        background: `${col}1F`,
        border: `1px solid ${col}66`,
        boxShadow: glow ? `0 0 ${16 * glow}px ${C.gold}` : undefined,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: 7, background: col }} />
      {alert}
    </span>
  );
};

export const Suggested: React.FC<{ text: string; due?: string; accepted?: boolean }> = ({ text, due, accepted }) => (
  <span style={{ display: "inline-flex", flexDirection: "column", gap: 3 }}>
    <span style={{ fontFamily, fontWeight: 500, fontSize: 16, color: accepted ? C.text : C.violet }}>{text}</span>
    {due ? (
      <span style={{ fontFamily, fontSize: 13, color: accepted ? C.muted : `${C.violet}CC` }}>
        {accepted ? `Due ${due}` : `Suggested · ${due}`}
      </span>
    ) : null}
  </span>
);

export type Col = { key: string; label: string; w: number; align?: "left" | "right" };
export const Table: React.FC<{
  cols: Col[];
  rows: Record<string, React.ReactNode>[];
  reveal?: (i: number) => React.CSSProperties;
  highlight?: number | null;
  rowH?: number;
  footer?: Record<string, React.ReactNode>;
}> = ({ cols, rows, reveal, highlight, rowH = 64, footer }) => (
  <div style={{ fontFamily }}>
    <div style={{ display: "flex", padding: "0 20px", height: 44, alignItems: "center", borderBottom: `1px solid ${C.line}` }}>
      {cols.map((c) => (
        <div key={c.key} style={{ width: c.w, flexShrink: 0, fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: C.muted, textAlign: c.align ?? "left" }}>
          {c.label}
        </div>
      ))}
    </div>
    {rows.map((r, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          height: rowH,
          borderBottom: `1px solid ${C.line}`,
          background: highlight === i ? "rgba(38,191,107,0.08)" : undefined,
          boxShadow: highlight === i ? `inset 3px 0 0 ${C.bright}` : undefined,
          ...(reveal ? reveal(i) : {}),
        }}
      >
        {cols.map((c) => (
          <div key={c.key} style={{ width: c.w, flexShrink: 0, fontSize: 17, color: C.text, textAlign: c.align ?? "left", overflow: "hidden" }}>
            {r[c.key]}
          </div>
        ))}
      </div>
    ))}
    {footer ? (
      <div style={{ display: "flex", padding: "0 20px", height: 48, alignItems: "center" }}>
        {cols.map((c) => (
          <div key={c.key} style={{ width: c.w, flexShrink: 0, fontSize: 16, fontWeight: 600, color: C.off, textAlign: c.align ?? "left" }}>
            {footer[c.key]}
          </div>
        ))}
      </div>
    ) : null}
  </div>
);

export const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 32 }) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: C.deep,
      color: C.off,
      fontFamily,
      fontWeight: 600,
      fontSize: size * 0.4,
      flexShrink: 0,
    }}
  >
    {name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)}
  </span>
);

export const Demo: React.FC = () => (
  <span style={{ fontFamily, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: C.gold, border: `1px solid ${C.gold}88`, borderRadius: 4, padding: "1px 5px", marginLeft: 8 }}>
    DEMO
  </span>
);

// Minimal line icons (24px grid).
export const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({ name, size = 20, color = "currentColor" }) => {
  const p: Record<string, React.ReactNode> = {
    dashboard: <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
    tasks: <path d="M4 6h3M4 12h3M4 18h3M10 6h10M10 12h10M10 18h10" />,
    requests: <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />,
    pipeline: <path d="M4 5h16M7 12h10M10 19h4" />,
    clients: <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M17 11a2.5 2.5 0 1 0 0-5M16 15c3 0 6 2 6 5" />,
    activity: <path d="M3 12h4l3-7 4 14 3-7h4" />,
    performance: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
    bonus: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />,
    guide: <path d="M4 5c3-1 5-1 8 1 3-2 5-2 8-1v14c-3-1-5-1-8 1-3-2-5-2-8-1zM12 6v14" />,
    materials: <path d="M6 3h9l4 4v14H6zM15 3v4h4" />,
    changelog: <path d="M12 7v5l3 2M21 12a9 9 0 1 1-9-9" />,
    search: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5" />,
    theme: <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z" />,
    collapse: <path d="M15 6l-6 6 6 6" />,
    filter: <path d="M4 5h16l-6 8v6l-4-2v-4z" />,
    check: <path d="M5 12l5 5 9-10" />,
    clock: <path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    lock: <path d="M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3" />,
    calendar: <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />,
    dots: <path d="M6 12h.01M12 12h.01M18 12h.01" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {p[name]}
    </svg>
  );
};
