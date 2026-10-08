// Render QC stills of the Film at given frames with one bundle.
// usage: node scripts/stills.mjs <outdir> <frame,frame,...|samples>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const [outDir, spec] = process.argv.slice(2);
const frames =
  spec === "samples"
    ? JSON.parse(fs.readFileSync("src/generated/samples.json", "utf8")).map((s, i) => ({ f: s.f, name: `${String(i).padStart(3, "0")}` }))
    : spec.split(",").map((f) => ({ f: Number(f), name: `f${f}` }));
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Film" });
const queue = [...frames];
const worker = async () => {
  while (queue.length) {
    const { f, name } = queue.shift();
    await renderStill({ serveUrl, composition, frame: f, output: path.join(outDir, `${name}.jpg`), imageFormat: "jpeg", jpegQuality: 80 });
  }
};
await Promise.all([worker(), worker(), worker()]);
console.log(`rendered ${frames.length}`);
