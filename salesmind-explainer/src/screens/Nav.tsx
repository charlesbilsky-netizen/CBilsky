import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AppShell } from "../ui/AppShell";
import { Avatar, Button, Label, Panel } from "../ui/primitives";
import { C, fontFamily } from "../theme";
import { D } from "../data";
import { prog, reveal } from "../ui/anim";

// S01 · Simulated training sign-in. Deliberately not an imitation of any real
// login page: it says what it is.
export const SignIn: React.FC<{ press?: number }> = ({ press = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0C1214", fontFamily, alignItems: "center", justifyContent: "center" }}>
      <Panel style={{ width: 620, padding: 48, display: "flex", flexDirection: "column", gap: 22, ...reveal(prog(f, 0, 16)) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${C.bright}, ${C.deep})` }} />
          <div>
            <div style={{ fontSize: 26, fontWeight: 600, color: C.off }}>SalesMind</div>
            <div style={{ fontSize: 15, color: C.muted }}>Training sign-in · simulated</div>
          </div>
        </div>
        <div style={{ height: 1, background: C.line }} />
        <Label>Training identity</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar name={D.rm.name} size={52} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.off }}>{D.rm.name}</div>
            <div style={{ fontSize: 16, color: C.muted }}>
              {D.rm.role} · {D.rm.workspace}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.5 }}>
          No password, no live system. This screen exists only in the training film.
        </div>
        <Button primary pressed={press} style={{ justifyContent: "center", fontSize: 18, padding: "14px 0" }}>
          Enter the training workspace
        </Button>
      </Panel>
    </AbsoluteFill>
  );
};

// S02 · Shell tour: the four menu groups light up in turn, then the top controls.
export const NavTour: React.FC<{ glow: Record<string, number>; top?: "search" | "theme" | "account" | "collapse" | null }> = ({ glow, top = null }) => (
  <AppShell page="Dashboard" title="Dashboard" groupGlow={glow} highlightTop={top}>
    <div style={{ display: "flex", flexDirection: "column", gap: 20, opacity: 0.35 }}>
      {[0, 1, 2].map((i) => (
        <Panel key={i} style={{ height: i === 2 ? 420 : 150 }} />
      ))}
    </div>
  </AppShell>
);
