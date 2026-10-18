import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily } from "../theme";
import { Ground, Stage } from "../ui/Stage";
import { Plate } from "../ui/TitleCard";
import { TrainingBadge } from "../ui/TrainingBadge";
import { Dashboard } from "../screens/Dashboard";

// Thumbnail: title on the left, the control surface on the right.
export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ background: C.ground }}>
    <Ground />
    <Plate src="fal/loop/p_orbit.mp4" dim={0.55} blur={4} />
    <AbsoluteFill style={{ transform: "translateX(430px) scale(0.78)", transformOrigin: "50% 50%" }}>
      <Stage cam={{ cx: 960, cy: 600, zoom: 1.05 }} tilt={4}>
        <Dashboard start={-240} tab={2} highlightRow={0} />
      </Stage>
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(1,14,7,0.96) 0%, rgba(1,14,7,0.85) 34%, rgba(1,14,7,0) 58%)" }} />
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 130, fontFamily }}>
      <div style={{ color: C.bright, fontSize: 26, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase" }}>Training film</div>
      <div style={{ height: 2, width: 420, background: `linear-gradient(90deg, ${C.bright}, transparent)`, margin: "26px 0 30px" }} />
      <div style={{ color: C.off, fontSize: 132, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>SalesMind</div>
      <div style={{ color: C.text, fontSize: 52, fontWeight: 500, marginTop: 18 }}>The RM Operating System</div>
      <div style={{ color: C.muted, fontSize: 26, marginTop: 34 }}>16 chapters · about 15 minutes</div>
    </AbsoluteFill>
    <TrainingBadge />
  </AbsoluteFill>
);
