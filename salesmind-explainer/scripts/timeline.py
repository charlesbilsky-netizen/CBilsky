#!/usr/bin/env python3
"""Build the film timeline from the narration segments.

One source of truth for picture (Remotion reads src/generated/timeline.json)
and sound (scripts/mix.py reads the same file). Frames at 30 fps.
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FPS = 30

TITLE = 96          # chapter title card, 3.2 s
LEAD = 10           # breath between the title card and the first line
GAP = 6             # between lines; each voice file already ends on ~0.4 s of air
TAIL = 36           # resolution beat at the end of every chapter
OPEN_LEAD = 54      # cold open: the plate breathes before the first line
MAIN_TITLE = 132    # film title after the cold open
END_CARD = 210      # end card

# Extra hold after a line, in frames: peak moments and key screen states land.
PAD = {
    "c01p01": 12, "c01p02": 24,
    "c02p01": 10, "c02p02": 12,
    "c03p07": 10,
    "c04p01": 10, "c04p04": 18, "c04p05": 40,
    "c05p02": 10, "c05p06": 16,
    "c06p04": 18, "c06p05": 14, "c06p06": 18,
    "c07p02": 16, "c07p04": 10,
    "c08p03": 12, "c08p04": 36, "c08p05": 18, "c08p09": 24,
    "c09p03": 10,
    "c10p04": 24, "c10p06": 30,
    "c11p03": 20,
    "c12p01": 12,
    "c13p02": 14, "c13p04": 10,
    "c14p02": 14,
    "c15p03": 10,
    "c16p01": 20, "c16p02": 30, "c16p04": 50,
}


def main() -> None:
    segs = json.loads((ROOT / "src/generated/segments.json").read_text())
    chapters = json.loads((ROOT / "src/generated/chapters.json").read_text())
    out_ch = []
    t = 0
    for ch in chapters:
        n = int(ch["num"])
        mine = [s for s in segs if int(s["chapter"]) == n]
        start = t
        title = 0 if n == 1 else TITLE
        cursor = OPEN_LEAD if n == 1 else LEAD
        lines = []
        for s in mine:
            d = math.ceil(s["dur"] * FPS)
            lines.append({"id": s["id"], "from": cursor, "dur": d, "text": s["text"]})
            cursor += d + GAP + PAD.get(s["id"], 0)
        body = cursor - GAP + TAIL
        entry = {"n": n, "num": ch["num"], "title": ch["title"], "start": start, "title_len": title, "body_len": body, "lines": lines}
        t = start + title + body
        if n == 1:
            entry["main_title"] = {"from": t - start, "dur": MAIN_TITLE}
            t += MAIN_TITLE
        entry["len"] = t - start
        out_ch.append(entry)
    end = {"from": t, "dur": END_CARD}
    t += END_CARD
    tl = {"fps": FPS, "total": t, "chapters": out_ch, "end_card": end}
    (ROOT / "src/generated/timeline.json").write_text(json.dumps(tl, indent=1))
    for c in out_ch:
        print(f"{c['num']} {c['title']:<34} start {c['start']/FPS:7.1f}s  len {c['len']/FPS:6.1f}s")
    print(f"total {t} frames = {t/FPS/60:.2f} min")


if __name__ == "__main__":
    main()
