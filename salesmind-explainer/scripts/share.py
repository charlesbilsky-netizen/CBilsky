#!/usr/bin/env python3
"""Share copies: one file per chapter, cut from the master, each sized to
fit a chat upload (target 22 MB) with two-pass H.264. Chapter 16 carries the
end card. Also makes share copies of any longer cut over the size limit.

usage: python3 scripts/share.py out/SalesMind_The_RM_Operating_System.mp4
"""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
TARGET_MB = 22.0
AUDIO_K = 128


def encode(src, dst, start=None, dur=None):
    if dur is None:
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(src)], capture_output=True, text=True).stdout)
    vk = int(min(6000, (TARGET_MB * 8 * 1024 / dur) - AUDIO_K - 40))
    cut = (["-ss", f"{start:.3f}"] if start is not None else []) + ["-i", str(src), "-t", f"{dur:.3f}"]
    log = Path(tempfile.mkdtemp()) / "pass"
    common = ["-c:v", "libx264", "-preset", "slow", "-b:v", f"{vk}k", "-maxrate", f"{int(vk * 1.6)}k", "-bufsize", f"{vk * 3}k", "-pix_fmt", "yuv420p", "-passlogfile", str(log)]
    subprocess.run(["ffmpeg", "-v", "error", "-y", *cut, *common, "-pass", "1", "-an", "-f", "mp4", "/dev/null"], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", *cut, *common, "-pass", "2", "-c:a", "aac", "-b:a", f"{AUDIO_K}k", "-movflags", "+faststart", str(dst)], check=True)
    return dst.stat().st_size / 1e6, vk


def main():
    master = Path(sys.argv[1])
    tl = json.loads((ROOT / "src/generated/timeline.json").read_text())
    outdir = ROOT / "out/share"
    outdir.mkdir(parents=True, exist_ok=True)
    for c in tl["chapters"]:
        a = c["start"] / FPS
        d = c["len"] / FPS
        if c["n"] == 16:
            d += tl["end_card"]["dur"] / FPS
        slug = re.sub(r"[^A-Za-z0-9]+", "_", c["title"]).strip("_")
        dst = outdir / f"SalesMind_Ch{c['num']}_{slug}.mp4"
        mb, vk = encode(master, dst, a, d)
        print(f"{dst.name}: {d:.1f}s, {vk} kb/s, {mb:.1f} MB")
    for name in ("SalesMind_Onboarding_90s", "SalesMind_Trailer_30s"):
        src = ROOT / f"out/{name}.mp4"
        if src.exists() and src.stat().st_size > TARGET_MB * 1e6:
            mb, vk = encode(src, outdir / f"{name}_share.mp4")
            print(f"{name}_share.mp4: {vk} kb/s, {mb:.1f} MB")


if __name__ == "__main__":
    main()
