import React from "react";
import { C, fontFamily } from "../theme";

// The training label. Rendered on the composition's top layer, outside every
// transition, so no fade or wipe can hide it while a product-like screen is up.
export const TrainingBadge: React.FC<{ variant?: "training" | "simulated" }> = ({ variant = "training" }) => (
  <div
    style={{
      position: "absolute",
      top: 44,
      right: 56,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 18px",
      borderRadius: 999,
      background: "rgba(15,20,21,0.92)",
      border: `1.5px solid ${C.bright}`,
      boxShadow: "0 6px 24px rgba(0,0,0,0.45)",
      fontFamily,
      fontWeight: 600,
      fontSize: 15,
      letterSpacing: 1.6,
      color: C.off,
      zIndex: 1000,
    }}
  >
    <span style={{ width: 9, height: 9, borderRadius: 9, background: C.bright }} />
    {variant === "simulated" ? (
      <span>SIMULATED TRAINING SCREEN · NO LIVE CONNECTION</span>
    ) : (
      <span>TRAINING ENVIRONMENT · SYNTHETIC DATA · NOT A LIVE ACCOUNT</span>
    )}
  </div>
);
