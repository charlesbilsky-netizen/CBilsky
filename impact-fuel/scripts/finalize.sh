#!/usr/bin/env bash
# Renders the picture (muted), lays the untouched soundtrack over it, and
# verifies the result. Usage:
#   scripts/finalize.sh            # final: all 25 shots required
#   scripts/finalize.sh --draft    # draft: missing shots shown as labelled slates
set -euo pipefail
cd "$(dirname "$0")/.."

MODE=final
[[ "${1:-}" == "--draft" ]] && MODE=draft

AUDIO=public/audio/Pitbull-Intro.opus
[[ -f "$AUDIO" ]] || { echo "Missing $AUDIO"; exit 1; }

node --no-warnings scripts/scan-shots.mjs
if [[ "$MODE" == final ]]; then
  node -e '
    const m = require("./impact_fuel_production_manifest.json");
    const bad = m.shots.filter((s) => s.status !== "QC_PASSED" && s.status !== "CONFORMED");
    if (bad.length) {
      console.error("Final export blocked. Not ready: " + bad.map((s) => s.id + " (" + s.status + ")").join(", "));
      process.exit(1);
    }'
fi

mkdir -p out
PROPS="{\"draft\": $([[ $MODE == draft ]] && echo true || echo false)}"
npx remotion render MiamiUnfiltered out/picture.mp4 --muted --props="$PROPS" --codec=h264 --crf=16

if [[ "$MODE" == draft ]]; then
  BASE=out/Impact_Fuel_Miami_Unfiltered_Draft
else
  BASE=out/Impact_Fuel_Miami_Unfiltered_Final
fi

# Master: original Opus packets copied bit-for-bit. Delivery: AAC 320k for
# players that do not decode Opus-in-MP4 (QuickTime, older iOS).
ffmpeg -v error -y -i out/picture.mp4 -i "$AUDIO" -map 0:v -map 1:a -c:v copy -c:a copy -movflags +faststart "${BASE}_OpusMaster.mp4"
ffmpeg -v error -y -i out/picture.mp4 -i "$AUDIO" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart "${BASE}.mp4"

scripts/verify.sh "${BASE}_OpusMaster.mp4" "$AUDIO"
scripts/verify.sh "${BASE}.mp4"

if [[ "$MODE" == final ]]; then
  node -e '
    const fs = require("fs");
    const p = "impact_fuel_production_manifest.json";
    const m = JSON.parse(fs.readFileSync(p, "utf8"));
    for (const s of m.shots) s.conformed = true;
    fs.writeFileSync(p, JSON.stringify(m, null, 2) + "\n");'
  node --no-warnings scripts/scan-shots.mjs
fi
