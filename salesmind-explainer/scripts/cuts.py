#!/usr/bin/env python3
"""Build the 30 s trailer and the 90 s onboarding cut from the master.

Edits on whole narration lines (picture and voice cut together), with short
dissolves. Sound design rides along from its stem. Music is a fresh,
continuous bed (never cut mid-phrase), ducked under the voice, then the cut
is normalised to -16 LUFS.

usage: python3 scripts/cuts.py   (needs out/film_video.mp4 and out/stem_*.wav)
"""
import json
import subprocess
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out"
FPS = 30
SR = 48000
XF = 0.3

CUTS = {
    "SalesMind_Trailer_30s": {
        "music": ("m4", 24.0),
        "segs": ["c01p02", "MAIN", "c03p00", "c04p05", "c08p04", "c10p06", "c16p02", "c16p04", "END"],
    },
    "SalesMind_Onboarding_90s": {
        "music": ("m2", 20.0),
        "segs": ["c01p02", "MAIN", "c02p00", "c02p02", "c03p00", "c04p00", "c04p04", "c04p05", "c05p00", "c08p03+c08p04", "c10p02", "c10p03", "c16p00", "c16p02", "c16p04", "END"],
    },
}


def tl_times():
    tl = json.loads((ROOT / "src/generated/timeline.json").read_text())
    lines = {}
    for c in tl["chapters"]:
        for l in c["lines"]:
            s = (c["start"] + c["title_len"] + l["from"]) / FPS
            lines[l["id"]] = (s, s + (l["dur"] - 12) / FPS)
        if "main_title" in c:
            mt = (c["start"] + c["main_title"]["from"]) / FPS
            lines["MAIN"] = (mt + 0.3, mt + 2.4)
    ec = tl["end_card"]["from"] / FPS
    lines["END"] = (ec + 0.2, ec + 2.6)
    return lines


def seg_range(lines, key):
    ids = key.split("+")
    a = lines[ids[0]][0]
    b = lines[ids[-1]][1]
    if key in ("MAIN", "END"):
        return a, b
    return a - 0.35, b + 0.55


def load(path, start, dur):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", f"{start:.3f}", "-t", f"{dur:.3f}", "-i", str(path), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True,
        check=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def write_wav(path, x):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s24le", str(path)], stdin=subprocess.PIPE)
    p.communicate(x.astype(np.float32).tobytes())


def build(name, spec, lines):
    ranges = [seg_range(lines, k) for k in spec["segs"]]
    # Picture: trim each range, chain dissolves.
    inputs, fc = [], []
    for i, (a, b) in enumerate(ranges):
        inputs += ["-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", str(OUT / "film_video.mp4")]
        fc.append(f"[{i}:v]settb=AVTB,setpts=PTS-STARTPTS,fps={FPS},format=yuv420p[v{i}]")
    last = "v0"
    t = ranges[0][1] - ranges[0][0]
    for i in range(1, len(ranges)):
        off = t - XF
        fc.append(f"[{last}][v{i}]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{i}]")
        last = f"x{i}"
        t = off + (ranges[i][1] - ranges[i][0])
    total = t
    vid = OUT / f"{name}.video.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", f"[{last}]", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", str(vid)], check=True)

    # Sound: voice and design follow the picture; music runs underneath.
    N = int(total * SR) + SR
    voice = np.zeros((N, 2), np.float32)
    sfx = np.zeros((N, 2), np.float32)
    pos = 0.0
    for i, (a, b) in enumerate(ranges):
        d = b - a
        for stem, bus in (("voice", voice), ("sfx", sfx)):
            x = load(OUT / f"stem_{stem}.wav", a, d)
            nf = int(XF * SR)
            r = np.linspace(0, 1, nf, dtype=np.float32)[:, None]
            if i > 0:
                x[:nf] *= r
            if i < len(ranges) - 1:
                x[-nf:] *= r[::-1]
            j = int(pos * SR)
            bus[j : j + len(x)] += x[: N - j]
        pos += d - XF
    cue, off = spec["music"]
    m = load(ROOT / f"public/audio/score/{cue}.wav", off, total + 1)
    m = m[: N] if len(m) >= N else np.pad(m, ((0, N - len(m)), (0, 0)))
    # Level: same open level as the film, ducked 10 dB where the voice speaks.
    mono = np.abs(voice).mean(axis=1)
    w = int(0.05 * SR)
    k = len(mono) // w
    act = (np.sqrt((mono[: k * w].reshape(k, w) ** 2).mean(axis=1)) > 0.003).astype(np.float32)
    act = np.repeat(act, w)
    act = np.pad(act, (0, N - len(act)))
    env = np.zeros(N, np.float32)
    v = 0.0
    for i in range(0, N, 64):
        tgt = act[i]
        v = min(tgt, v + 64 / (0.3 * SR)) if tgt > v else max(tgt, v - 64 / (1.0 * SR))
        env[i : i + 64] = v
    music_rms = np.sqrt((m ** 2).mean()) + 1e-9
    voice_rms = np.sqrt((voice[act > 0] ** 2).mean()) + 1e-9
    m *= (voice_rms / music_rms) * 10 ** (-9 / 20)
    m *= (10 ** (-10 * env / 20))[:, None]
    fi, fo = int(0.8 * SR), int(2.5 * SR)
    m[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
    end = int(total * SR)
    m[end - fo : end] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
    m[end:] = 0
    mix = (voice + sfx + m)[:end]
    pre = OUT / f"{name}.pre.wav"
    write_wav(pre, mix)
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(pre), "-af", "alimiter=limit=0.70:attack=4:release=60:level=0,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True)
    js = p.stderr.decode()
    q = json.loads(js[js.rindex("{") : js.rindex("}") + 1])
    af = f"alimiter=limit=0.70:attack=4:release=60:level=0,loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={q['input_i']}:measured_TP={q['input_tp']}:measured_LRA={q['input_lra']}:measured_thresh={q['input_thresh']}:offset={q['target_offset']}:linear=true"
    final = OUT / f"{name}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(vid), "-i", str(pre), "-af", af, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart", str(final)], check=True)
    pre.unlink()
    vid.unlink()
    print(f"{final.name}: {total:.1f}s")


def main():
    lines = tl_times()
    for name, spec in CUTS.items():
        build(name, spec, lines)


if __name__ == "__main__":
    main()
