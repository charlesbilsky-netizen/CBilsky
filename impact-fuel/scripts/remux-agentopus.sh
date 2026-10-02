#!/usr/bin/env bash
# For the AgentOpus route (project 10021228-30e). AgentOpus received a WAV
# conversion and re-encoded the audio. This keeps its picture, conforms it to
# 24 fps / 1080p / 2808 frames, and lays the original Opus master back on.
# Usage: scripts/remux-agentopus.sh <agentopus_download.mp4>
set -euo pipefail
cd "$(dirname "$0")/.."
IN="$1"
AUDIO=public/audio/Pitbull-Intro.opus
mkdir -p out

ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of default=nw=1 "$IN"

# Conform picture. Frames past 117 s are dropped; a short source is padded
# with black (reported below) rather than stretched.
ffmpeg -v error -y -i "$IN" -map 0:v:0 -an \
  -vf "fps=24,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,tpad=stop_mode=add:stop_duration=1:color=black" \
  -frames:v 2808 -c:v libx264 -crf 16 -pix_fmt yuv420p out/agentopus_picture.mp4

SRC=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
awk -v d="$SRC" 'BEGIN { if (d < 116.99) printf "WARN: AgentOpus picture is %.3fs, black-padded to 117.000s\n", d }'

BASE=out/Impact_Fuel_Miami_Unfiltered_AgentOpus
ffmpeg -v error -y -i out/agentopus_picture.mp4 -i "$AUDIO" -map 0:v -map 1:a -c:v copy -c:a copy -movflags +faststart "${BASE}_OpusMaster.mp4"
ffmpeg -v error -y -i out/agentopus_picture.mp4 -i "$AUDIO" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart "${BASE}.mp4"

scripts/verify.sh "${BASE}_OpusMaster.mp4" "$AUDIO"
scripts/verify.sh "${BASE}.mp4"
