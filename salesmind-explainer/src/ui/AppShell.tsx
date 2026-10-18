import React from "react";
import { C, fontFamily } from "../theme";
import { Avatar, Icon } from "./primitives";
import data from "../../data/synthetic-data.json";

export const NAV: { group: string; pages: { name: string; icon: string }[] }[] = [
  { group: "Workspace", pages: [{ name: "Dashboard", icon: "dashboard" }, { name: "Task management", icon: "tasks" }, { name: "Internal requests", icon: "requests" }] },
  { group: "Book", pages: [{ name: "Pipeline", icon: "pipeline" }, { name: "Clients", icon: "clients" }, { name: "Activity", icon: "activity" }] },
  { group: "Results", pages: [{ name: "Performance", icon: "performance" }, { name: "Bonus", icon: "bonus" }] },
  { group: "Support", pages: [{ name: "Guidebook", icon: "guide" }, { name: "Sales materials", icon: "materials" }, { name: "Changelog", icon: "changelog" }] },
];

export type ShellProps = {
  page: string;
  title?: string;
  // Optional emphasis for the navigation tour: 0..1 per group name.
  groupGlow?: Record<string, number>;
  highlightTop?: "search" | "theme" | "account" | "collapse" | null;
  children?: React.ReactNode;
};

export const SIDEBAR_W = 280;
export const TOPBAR_H = 72;

export const AppShell: React.FC<ShellProps> = ({ page, title, groupGlow = {}, highlightTop = null, children }) => {
  const ring = (k: string) =>
    highlightTop === k ? { boxShadow: `0 0 0 2px ${C.bright}, 0 0 18px ${C.bright}66`, borderRadius: 10 } : {};
  return (
    <div style={{ position: "absolute", inset: 0, background: "#11171A", fontFamily, color: C.text, display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: SIDEBAR_W, background: "#0D1214", borderRight: `1px solid ${C.line}`, padding: "22px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 10px 22px" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${C.bright}, ${C.deep})` }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 19, color: C.off }}>SalesMind</div>
            <div style={{ fontSize: 12, color: C.muted }}>RM Workspace · training build</div>
          </div>
        </div>
        {NAV.map((g) => (
          <div
            key={g.group}
            style={{
              marginBottom: 14,
              borderRadius: 12,
              padding: "6px 4px",
              background: groupGlow[g.group] ? `rgba(38,191,107,${0.1 * groupGlow[g.group]})` : undefined,
              boxShadow: groupGlow[g.group] ? `0 0 0 1px rgba(38,191,107,${0.6 * groupGlow[g.group]})` : undefined,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.3, textTransform: "uppercase", color: C.faint, padding: "4px 12px 8px" }}>{g.group}</div>
            {g.pages.map((p) => {
              const on = p.name === page;
              return (
                <div
                  key={p.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "9px 12px",
                    borderRadius: 8,
                    fontSize: 17,
                    fontWeight: on ? 600 : 500,
                    color: on ? C.off : C.muted,
                    background: on ? "rgba(38,191,107,0.12)" : undefined,
                    boxShadow: on ? `inset 3px 0 0 ${C.bright}` : undefined,
                  }}
                >
                  <Icon name={p.icon} size={19} color={on ? C.bright : C.muted} />
                  {p.name}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: C.muted, fontSize: 15, ...ring("collapse") }}>
          <Icon name="collapse" size={18} /> Collapse
        </div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ height: TOPBAR_H, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 28px", gap: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: C.off }}>{title ?? page}</div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, width: 420, height: 42, padding: "0 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.line}`, color: C.faint, fontSize: 16, ...ring("search") }}>
            <Icon name="search" size={18} /> Search pages, clients…
          </div>
          <div style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, ...ring("theme") }}>
            <Icon name="theme" size={20} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px", ...ring("account") }}>
            <Avatar name={data.rm.name} size={34} />
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.off }}>{data.rm.name}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{data.rm.region}</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, position: "relative", padding: 28, overflow: "hidden" }}>{children}</div>
      </div>
      {/* Floating coach button, label only (it is a write surface) */}
      <div style={{ position: "absolute", right: 28, bottom: 26, padding: "10px 16px", borderRadius: 999, background: C.panel2, border: `1px solid ${C.line}`, fontSize: 15, color: C.muted }}>
        ✦ Ask the coach
      </div>
    </div>
  );
};
