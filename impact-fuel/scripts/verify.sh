#!/usr/bin/env bash
# Verifies an exported MP4: container, streams, dimensions, frame rate,
# duration, full decode, and (if a master is given) bit-exact audio.
# Extracts a frame either side of every shot boundary for visual review.
# Usage: scripts/verify.sh <video.mp4> [original-audio-master]
set -euo pipefail
cd "$(dirname "$0")/.."
F="$1"
MASTER="${2:-}"
fail() { echo "FAIL: $*"; exit 1; }

[[ -s "$F" ]] || fail "$F missing or empty"
FMT=$(ffprobe -v error -show_entries format=format_name,duration -of default=nw=1 "$F")
V=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames -of default=nw=1 "$F")
A=$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1 "$F")
echo "== $F"; echo "$FMT"; echo "$V"; echo "$A"

grep -q "format_name=mov,mp4" <<<"$FMT" || fail "not an MP4 container"
grep -Eq "width=(1920|3840)" <<<"$V" && grep -Eq "height=(1080|2160)" <<<"$V" || fail "not 1080p or 2160p 16:9"
grep -q "r_frame_rate=24/1" <<<"$V" || fail "frame rate is not 24 fps"
grep -q "nb_frames=2808" <<<"$V" || fail "picture is not 2808 frames"
grep -q "channels=2" <<<"$A" || fail "audio is not stereo"
grep -q "sample_rate=48000" <<<"$A" || fail "audio is not 48 kHz"
# Picture: exactly 2808 frames (checked above) = 117.000 s. Audio: count the
# decoded samples, because MP4 reports Opus duration net of its 6.5 ms
# pre-roll and AAC adds encoder priming.
SAMPLES=$(ffmpeg -v error -i "$F" -map 0:a -f s16le -ac 2 -ar 48000 - | wc -c | awk '{print $1/4}')
awk -v n="$SAMPLES" 'BEGIN { d = n / 48000; printf "decoded audio: %d samples = %.4fs\n", n, d; exit !(d > 116.99 && d < 117.03) }' || fail "decoded audio length off from 117.0075 s"
ffmpeg -v error -i "$F" -f null - || fail "decode errors"

if [[ -n "$MASTER" ]]; then
  H1=$(ffmpeg -v error -i "$MASTER" -map 0:a -c copy -f md5 -)
  H2=$(ffmpeg -v error -i "$F" -map 0:a -c copy -f md5 -)
  [[ "$H1" == "$H2" ]] || fail "audio packets differ from master"
  P1=$(ffmpeg -v error -i "$MASTER" -map 0:a -f md5 -)
  P2=$(ffmpeg -v error -i "$F" -map 0:a -f md5 -)
  [[ "$P1" == "$P2" ]] || fail "decoded audio differs from master"
  echo "audio: packets and decoded PCM bit-identical to master"
fi

mkdir -p out/qc
TIMES=$(node --no-warnings -e '
  import("./src/shots.ts").then(({ SHOTS, startFrame, endFrame, FPS }) => {
    const t = [0.5];
    for (const s of SHOTS) t.push(startFrame(s) / FPS + 0.1, endFrame(s) / FPS - 0.1);
    console.log(t.slice(0, -1).map((x) => x.toFixed(2)).join(" "), "116.90");
  });')
for t in $TIMES; do
  ffmpeg -v error -y -ss "$t" -i "$F" -frames:v 1 -q:v 3 "out/qc/frame_${t}s.jpg"
done
echo "PASS: $F (QC frames in out/qc/)"
