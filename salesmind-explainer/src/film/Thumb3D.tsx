import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily } from "../theme";
import { Ground } from "../ui/Stage";
import { Plate } from "../ui/TitleCard";
import { TrainingBadge } from "../ui/TrainingBadge";
import { Dashboard } from "../screens/Dashboard";

// Thumbnail v2: the same title, with the control surface set in real 3D
// perspective, rim-lit, casting a soft floor shadow. Text stays crisp because
// the screen is rendered, not generated.
export const Thumb3D: React.FC = () => (
  <AbsoluteFill style={{ background: C.ground }}>
    <Ground />
    <Plate src="fal/loop/p_paths.mp4" dim={0.78} blur={5} />
    <AbsoluteFill style={{ background: "radial-gradient(900px 520px at 72% 88%, rgba(38,191,107,0.16), transparent 70%)" }} />
    {/* floor shadow */}
    <div style={{ position: "absolute", left: 800, top: 850, width: 980, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(0,0,0,0.75), transparent 70%)", filter: "blur(12px)" }} />
    <AbsoluteFill style={{ perspective: 1900, perspectiveOrigin: "70% 45%" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transformOrigin: "50% 50%",
          transform: "translate(318px, 6px) scale(0.535) rotateY(-14deg) rotateX(5deg) rotateZ(0.5deg)",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: `0 0 0 2px rgba(38,191,107,0.55), 0 0 90px rgba(38,191,107,0.28), 40px 60px 140px rgba(0,0,0,0.85)`,
        }}
      >
        <Dashboard start={-240} tab={2} highlightRow={0} />
        {/* glass sheen */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(38,191,107,0.06) 100%)" }} />
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(1,14,7,0.97) 0%, rgba(1,14,7,0.88) 30%, rgba(1,14,7,0) 52%)" }} />
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 120, fontFamily }}>
      <div style={{ color: C.bright, fontSize: 26, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase" }}>Training film</div>
      <div style={{ height: 2, width: 420, background: `linear-gradient(90deg, ${C.bright}, transparent)`, margin: "26px 0 30px" }} />
      <div style={{ color: C.off, fontSize: 136, fontWeight: 600, letterSpacing: -4, lineHeight: 1, textShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>SalesMind</div>
      <div style={{ color: C.text, fontSize: 52, fontWeight: 500, marginTop: 18 }}>The RM Operating System</div>
      <div style={{ color: C.muted, fontSize: 26, marginTop: 34 }}>16 chapters · about 15 minutes</div>
    </AbsoluteFill>
    <TrainingBadge />
  </AbsoluteFill>
);
