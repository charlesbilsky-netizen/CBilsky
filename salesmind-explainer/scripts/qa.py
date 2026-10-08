#!/usr/bin/env python3
"""Final privacy QA on the exported film.

1. Label: samples one frame every 2 s and checks the training label is
   present (template match on the label region + OCR of its text).
2. Text scan: OCRs every sampled frame for URLs and internal domains.
3. Audio: integrated loudness and true peak of the master.

usage: python3 scripts/qa.py out/SalesMind_The_RM_Operating_System.mp4
"""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

BOX = (1180, 36, 700, 60)  # x, y, w, h around the label pill
STEP = 2.0
BAD = re.compile(r"(https?://|www\.|exante\.(eu|com)|run\.exante|jira\.exante|confluence)", re.I)


def frame(video, t, path):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", str(video), "-frames:v", "1", str(path)], check=True)


def gray_crop(path):
    x, y, w, h = BOX
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vf", f"crop={w}:{h}:{x}:{y},format=gray", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.uint8).reshape(h, w).astype(np.float32)


def ocr(path, crop=None):
    src = path
    if crop:
        x, y, w, h = crop
        src = Path(str(path) + ".crop.png")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(path), "-vf", f"crop={w}:{h}:{x}:{y},scale=iw*2:ih*2", str(src)], check=True)
    return subprocess.run(["tesseract", str(src), "-", "--psm", "6" if crop else "11"], capture_output=True, text=True).stdout


def main():
    video = Path(sys.argv[1])
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(video)], capture_output=True, text=True).stdout)
    tmp = Path(tempfile.mkdtemp())
    ref = None
    scores, missing, ocr_ok, hits = [], [], 0, []
    times = list(np.arange(0.5, dur - 0.5, STEP))
    for i, t in enumerate(times):
        p = tmp / f"{i:04d}.png"
        frame(video, t, p)
        g = gray_crop(p)
        if ref is None:
            ref = g
        a = (g - g.mean()).ravel()
        b = (ref - ref.mean()).ravel()
        s = float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-9))
        scores.append(s)
        txt = ocr(p, BOX).upper().replace("0", "O")
        has = "TRAINING" in txt and "SYNTHETIC" in txt
        ocr_ok += has
        if s < 0.6 and not has:
            missing.append(round(t, 1))
        full = ocr(p)
        for m in BAD.finditer(full):
            hits.append((round(t, 1), m.group(0)))
        p.unlink(missing_ok=True)
    loud = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(video), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    I = re.findall(r"I:\s+(-?[\d.]+) LUFS", loud)[-1]
    TP = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", loud)[-1]
    rep = {
        "frames_sampled": len(times),
        "label_template_min": round(min(scores), 3),
        "label_template_median": round(float(np.median(scores)), 3),
        "label_ocr_confirmed": ocr_ok,
        "label_missing_at": missing,
        "url_or_domain_hits": hits,
        "integrated_lufs": float(I),
        "true_peak_dbtp": float(TP),
    }
    print(json.dumps(rep, indent=1))
    Path(video.with_suffix(".qa.json")).write_text(json.dumps(rep, indent=1))


if __name__ == "__main__":
    main()
