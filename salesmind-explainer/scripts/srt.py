#!/usr/bin/env python3
"""Subtitles from the narration timeline: sentence-split, at most two lines of
42 characters and 6 seconds per cue, timed by character share of each line."""
import json
import re
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
AIR = 12 / FPS


def ts(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def chunks(text):
    # Sentences, then pack into cues of <= 76 chars (two lines of 42).
    sents = re.split(r"(?<=[.?!:])\s+", text.strip())
    out, cur = [], ""
    for s in sents:
        if len(s) > 76:
            parts = re.split(r"(?<=,)\s+", s)
        else:
            parts = [s]
        for p in parts:
            if cur and len(cur) + 1 + len(p) > 76:
                out.append(cur)
                cur = p
            else:
                cur = f"{cur} {p}".strip()
    if cur:
        out.append(cur)
    return out


def main():
    tl = json.loads((ROOT / "src/generated/timeline.json").read_text())
    cues = []
    for c in tl["chapters"]:
        for l in c["lines"]:
            t0 = (c["start"] + c["title_len"] + l["from"]) / FPS
            spoken = l["dur"] / FPS - AIR
            parts = chunks(l["text"])
            total = sum(len(p) for p in parts)
            t = t0
            for p in parts:
                d = spoken * len(p) / total
                cues.append((t, t + d, p))
                t += d
    lines = []
    for i, (a, b, text) in enumerate(cues, 1):
        wrapped = textwrap.wrap(text, 42)
        if len(wrapped) > 2:
            wrapped = textwrap.wrap(text, (len(text) + 1) // 2 + 2)
        lines += [str(i), f"{ts(a)} --> {ts(max(b, a + 1.0))}", *wrapped, ""]
    out = ROOT / "out/SalesMind_The_RM_Operating_System.en.srt"
    out.parent.mkdir(exist_ok=True)
    out.write_text("\n".join(lines))
    print(f"{len(cues)} cues -> {out}")
    longest = max(b - a for a, b, _ in cues)
    print(f"longest cue {longest:.1f}s")


if __name__ == "__main__":
    main()
