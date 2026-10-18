import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Inter (SIL Open Font License), bundled locally as a variable font.
export const fontFamily = "Inter";
loadFont({ family: fontFamily, url: staticFile("fonts/inter-latin-wght-normal.woff2"), weight: "100 900" });

// Brand colours measured from the July 2026 deck (source guide, Part I), plus
// the film's neutral and accent tokens. Documented product colours (violet for
// suggestions, task priority spines) are kept as the source describes them.
export const C = {
  ground: "#010E07",
  deep: "#004D24",
  green: "#007F39",
  mid: "#209F59",
  bright: "#26BF6B",
  charcoal: "#222A2C",
  panel: "#171E20",
  panel2: "#1D2528",
  line: "#2C3639",
  off: "#F2F4F1",
  text: "#E6EAE7",
  muted: "#8F9C97",
  faint: "#5E6B66",
  gold: "#D9B26A",
  violet: "#9B8AFB",
  critical: "#E26D5A",
  warning: "#E0A53C",
  info: "#6FA8DC",
  rose: "#E5658A",
  slate: "#7B8794",
};

export const R = { card: 12, control: 8, pill: 999 };
export const FPS = 30;
export const W = 1920;
export const H = 1080;

export const type = {
  display: { fontFamily, fontWeight: 600, fontSize: 64, letterSpacing: -1.2 },
  h1: { fontFamily, fontWeight: 600, fontSize: 40, letterSpacing: -0.6 },
  h2: { fontFamily, fontWeight: 600, fontSize: 26, letterSpacing: -0.2 },
  body: { fontFamily, fontWeight: 400, fontSize: 20 },
  small: { fontFamily, fontWeight: 500, fontSize: 16 },
  label: { fontFamily, fontWeight: 600, fontSize: 13, letterSpacing: 1.4, textTransform: "uppercase" as const },
};

export const eur = (n: number | null | undefined) =>
  n == null ? "No amount" : `EUR ${n.toLocaleString("en-GB")}`;
