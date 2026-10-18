// Prints every sound-design cue as global frames (run via esbuild bundle).
import { TL } from "../src/film/tl";
import { shotsFor } from "../src/film/chapters";
import { allCues } from "../src/film/cues";
import fs from "node:fs";

for (const c of TL.chapters) shotsFor(c.n);
const out = allCues().map((q) => {
  const c = TL.chapters.find((x) => x.n === q.n)!;
  return { frame: c.start + c.title_len + q.f, kind: q.kind, gain: q.gain };
});
// Chapter transitions: an air whoosh under each title card.
for (const c of TL.chapters) if (c.title_len) out.push({ frame: c.start + 2, kind: "whoosh", gain: -8 });
out.push({ frame: TL.end_card.from + 4, kind: "impact", gain: -8 });
out.sort((a, b) => a.frame - b.frame);
fs.writeFileSync("src/generated/cues.json", JSON.stringify(out, null, 1));
console.log(`${out.length} cues`);
