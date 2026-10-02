// Scans public/shots and public/audio, probes every clip, and writes
// src/available-shots.json (read by the composition) and
// impact_fuel_production_manifest.json (the production record).
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  AUDIO_SECONDS,
  FPS,
  SHOTS,
  TOTAL_FRAMES,
  slotFrames,
  startFrame,
} from "../src/shots.ts";

const root = new URL("..", import.meta.url).pathname;
const audioPath = join(root, "public/audio/Pitbull-Intro.opus");
const manifestPath = join(root, "impact_fuel_production_manifest.json");

const probe = (file) =>
  JSON.parse(
    execFileSync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels",
      "-of", "json",
      file,
    ]).toString(),
  );

// Keep any notes, generation IDs and reference lists already recorded by hand.
const previous = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : { shots: [] };
const prevById = Object.fromEntries(previous.shots.map((s) => [s.id, s]));

let audio = null;
if (existsSync(audioPath)) {
  const p = probe(audioPath);
  const a = p.streams.find((s) => s.codec_type === "audio");
  audio = {
    file: "public/audio/Pitbull-Intro.opus",
    codec: a.codec_name,
    sample_rate: Number(a.sample_rate),
    channels: a.channels,
    duration: Number(p.format.duration),
    duration_ok: Math.abs(Number(p.format.duration) - AUDIO_SECONDS) < 0.001,
  };
}

const problems = [];
const files = [];
const shots = SHOTS.map((shot) => {
  const prev = prevById[shot.id] ?? {};
  const path = join(root, "public/shots", shot.file);
  const slotSec = slotFrames(shot) / FPS;
  const entry = {
    id: shot.id,
    label: shot.label,
    output_filename: shot.file,
    slot_start_sec: startFrame(shot) / FPS,
    slot_duration_sec: slotSec,
    references: prev.references ?? [],
    generator: prev.generator ?? null,
    generation_id: prev.generation_id ?? null,
    regenerations: prev.regenerations ?? 0,
    notes: prev.notes ?? "",
    audio_state: "muted in assembly",
    // Set by hand after visual review of the clip (face, wardrobe, hands, text, lip movement, physics).
    qc_passed: prev.qc_passed ?? false,
    qc_notes: prev.qc_notes ?? "",
    // Set by finalize.sh once a verified final export contains this clip.
    conformed: prev.conformed ?? false,
  };
  if (!existsSync(path)) {
    // Prompts for every shot live in PROMPTS.md, so an absent clip is PROMPTED.
    return { ...entry, status: "PROMPTED", qc_passed: false, conformed: false, error: null };
  }
  const p = probe(path);
  const v = p.streams.find((s) => s.codec_type === "video");
  const usable = Number(p.format.duration) - shot.trimBefore / FPS;
  const short = usable + 1 / FPS < slotSec;
  const error = short
    ? `${usable.toFixed(2)}s usable, slot needs ${slotSec.toFixed(2)}s`
    : null;
  if (error) problems.push(`shot ${shot.id}: ${error}`);
  // A replaced clip invalidates earlier QC and conform flags.
  const changed = prev.clip_mtime !== undefined && prev.clip_mtime !== statSync(path).mtimeMs;
  const qc = entry.qc_passed && !short && !changed;
  const conformed = entry.conformed && qc && !changed;
  const status = conformed ? "CONFORMED" : qc ? "QC_PASSED" : "RENDERED";
  files.push(shot.file);
  return {
    ...entry,
    status,
    qc_passed: qc,
    conformed,
    error,
    clip_mtime: statSync(path).mtimeMs,
    clip_duration_sec: Number(p.format.duration),
    clip_dimensions: `${v.width}x${v.height}`,
    clip_fps: v.r_frame_rate,
  };
});

writeFileSync(
  join(root, "src/available-shots.json"),
  JSON.stringify({ audio: audio !== null, files }, null, 2) + "\n",
);
writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      title: "Impact Fuel: Miami Unfiltered",
      timeline: { fps: FPS, frames: TOTAL_FRAMES, width: 1920, height: 1080 },
      audio,
      shots,
    },
    null,
    2,
  ) + "\n",
);

const order = ["PENDING", "PROMPTED", "RENDERED", "QC_PASSED", "CONFORMED"];
const at = (st) => shots.filter((s) => order.indexOf(s.status) >= order.indexOf(st)).length;
const pct = (n) => `${Math.round((n / shots.length) * 100)}%`.padStart(4);
console.log(
  `AUDIO     ${audio ? `${audio.codec} ${audio.sample_rate}Hz ${audio.channels}ch ${audio.duration}s ${audio.duration_ok ? "LOCKED" : "DURATION MISMATCH"}` : "MISSING"}`,
);
for (const st of order.slice(1)) {
  console.log(`${st.padEnd(10)}${pct(at(st))}  ${at(st)}/${shots.length}`);
}
console.log("");
for (const s of shots) {
  console.log(
    `${s.id}  ${s.status.padEnd(10)} ${String(s.slot_duration_sec.toFixed(3)).padStart(6)}s  ${s.output_filename}${s.error ? `  ERROR ${s.error}` : ""}`,
  );
}
if (problems.length) console.log(`\nBLOCKERS: ${problems.length} clip(s) too short. Regenerate longer, or set trimBefore lower in src/shots.ts.`);
