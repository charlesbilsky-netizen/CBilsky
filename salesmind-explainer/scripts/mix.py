#!/usr/bin/env python3
"""Mix the film's sound from the timeline: narration, score and sound design.

- Narration placed line by line from src/generated/timeline.json.
- Score: seven cues, one per chapter group, crossfaded under the title cards.
  Cues that run short are extended by repeating whole bars from their steady
  middle (splice found by cross-correlation), so nothing loops audibly.
- Music sits well under the voice: about -24 LUFS in the open (titles) and a
  further 10 dB down while the narrator speaks. Ducking follows the known line
  times, not a detector, so it never pumps.
- Sound design from src/generated/cues.json at restrained peak levels.
- Master: two-pass loudnorm to -16 LUFS integrated, -1.5 dBTP.

usage: python3 scripts/mix.py [out.wav]
"""
import json
import math
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
FPS = 30

# Score plan: cue, first chapter, first chapter of the next cue (None = end).
CUES = [("m1", 1, 4), ("m2", 4, 6), ("m3", 6, 7), ("m4", 7, 9), ("m5", 9, 12), ("m6", 12, 15), ("m7", 15, None)]
# Skip the near-silent intro some cues open with (seconds).
OFFSET = {"m1": 0.0, "m2": 9.0, "m3": 9.0, "m4": 0.0, "m5": 8.0, "m6": 3.0, "m7": 0.0}
XF_MUSIC = 4.0
BAR = 4 * 60 / 110.0

# Transparent peak control before loudness normalisation, so the gain stays linear.
LIM = "alimiter=limit=0.70:attack=4:release=60:level=0"
MUSIC_OPEN_LUFS = -24.0   # music level with no narration (approx, per cue)
DUCK_DB = -10.0           # extra cut under narration
VOICE_LUFS = -16.0

# Target peak (dBFS) per sound-design element before the cue's own offset.
SFX_PEAK = {
    "click": -22, "chip": -25, "toggle": -24, "drop": -25, "confirm": -21, "tick": -23, "alert": -23,
    "whoosh": -22, "riser": -21, "impact": -17, "keys": -25, "typing": -28, "shimmer": -24, "stamp": -23, "swipe": -25,
}
SFX_FILE = {"click": "click2", "keys": "keys"}


def load(path, start=0.0, dur=None):
    cmd = ["ffmpeg", "-v", "error", "-ss", f"{start:.3f}", "-i", str(path)]
    if dur:
        cmd += ["-t", f"{dur:.3f}"]
    cmd += ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def write_wav(path, x):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s24le", str(path)], stdin=subprocess.PIPE)
    p.communicate(x.astype(np.float32).tobytes())


def lufs(x):
    p = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "ebur128", "-f", "null", "-"],
        input=x.astype(np.float32).tobytes(),
        capture_output=True,
    )
    for line in p.stderr.decode().splitlines()[::-1]:
        if line.strip().startswith("I:"):
            return float(line.split()[1])
    return -70.0


def db(g):
    return 10 ** (g / 20)


def active_end(x, floor_db=-45):
    mono = np.abs(x).mean(axis=1)
    w = int(0.05 * SR)
    n = len(mono) // w
    rms = np.sqrt((mono[: n * w].reshape(n, w) ** 2).mean(axis=1))
    loud = np.where(20 * np.log10(rms + 1e-9) > floor_db)[0]
    return min(len(x), (loud[-1] + 1) * w + int(0.4 * SR)) if len(loud) else len(x)


def splice_once(y):
    """Repeat 4 or 8 bars from the steady middle of y with a seamless join.

    Searches splice points across the middle of the cue and lags around whole
    bars, at 12 kHz for speed, then refines at full rate.
    """
    mono = y.mean(axis=1)
    lo = mono[::4]
    sr = SR // 4
    W = int(1.0 * sr)
    best = (-2.0, 0, 0)
    for frac in np.linspace(0.32, 0.72, 41):
        t1 = int(len(lo) * frac)
        seg = lo[t1 : t1 + W]
        ns = np.linalg.norm(seg) + 1e-9
        for bars in (8, 4):
            g = int(bars * BAR * sr)
            for lag in range(g - 600, g + 601, 2):
                ref = lo[t1 - lag : t1 - lag + W]
                c = float(np.dot(seg, ref) / (ns * (np.linalg.norm(ref) + 1e-9)))
                if c > best[0]:
                    best = (c, t1 * 4, lag * 4)
    c, t1, lag = best
    W2 = int(0.5 * SR)
    seg = mono[t1 : t1 + W2]
    for l2 in range(lag - 8, lag + 9):
        ref = mono[t1 - l2 : t1 - l2 + W2]
        cc = float(np.dot(seg, ref) / (np.linalg.norm(seg) * np.linalg.norm(ref) + 1e-9))
        if cc > c:
            c, lag = cc, l2
    xf = int(0.08 * SR)
    a = y[: t1 + xf].copy()
    b = y[t1 - lag :].copy()
    ramp = np.linspace(0, 1, xf, dtype=np.float32)[:, None]
    a[-xf:] = a[-xf:] * np.sqrt(1 - ramp) + b[:xf] * np.sqrt(ramp)
    return np.concatenate([a, b[xf:]]), c


def fade(x, n_in, n_out):
    if n_in:
        r = np.linspace(0, 1, n_in, dtype=np.float32)[:, None]
        x[:n_in] *= np.sin(r * math.pi / 2)
    if n_out:
        r = np.linspace(1, 0, n_out, dtype=np.float32)[:, None]
        x[-n_out:] *= np.sin(r * math.pi / 2)
    return x


def place(bus, x, t):
    i = int(round(t * SR))
    if i < 0:
        x, i = x[-i:], 0
    j = min(len(bus), i + len(x))
    bus[i:j] += x[: j - i]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    out = Path(args[0]) if args else ROOT / "out/mix.wav"
    out.parent.mkdir(parents=True, exist_ok=True)
    tl = json.loads((ROOT / "src/generated/timeline.json").read_text())
    total = tl["total"] / FPS
    N = int(total * SR) + SR
    chs = {c["n"]: c for c in tl["chapters"]}
    cstart = lambda n: chs[n]["start"] / FPS

    # Narration.
    voice = np.zeros((N, 2), np.float32)
    speech = []
    for c in tl["chapters"]:
        for l in c["lines"]:
            t = (c["start"] + c["title_len"] + l["from"]) / FPS
            v = load(ROOT / f"public/voice/{l['id']}.mp3")
            place(voice, v, t)
            speech.append((t, t + (l["dur"] - 12) / FPS))
    gv = VOICE_LUFS - lufs(voice)
    voice *= db(gv)
    print(f"voice gain {gv:+.1f} dB")

    # Score.
    music = np.zeros((N, 2), np.float32)
    report = []
    for k, (cue, n0, n1) in enumerate(CUES):
        a = 0.0 if k == 0 else cstart(n0) + 1.6 - XF_MUSIC / 2
        b = total if n1 is None else cstart(n1) + 1.6 + XF_MUSIC / 2
        need = int((b - a) * SR)
        x = load(ROOT / f"public/audio/score/{cue}.wav", start=OFFSET[cue])
        x = x[: active_end(x)]
        splices = []
        while len(x) < need:
            x, c = splice_once(x)
            splices.append(round(c, 3))
        x = x[:need].copy()
        x *= db(MUSIC_OPEN_LUFS - lufs(x))
        n_in = 0 if k == 0 else int(XF_MUSIC * SR)
        n_out = int((6.0 if n1 is None else XF_MUSIC) * SR)
        if k == 0:
            n_in = int(1.5 * SR)
        fade(x, n_in, n_out)
        place(music, x, a)
        report.append(f"{cue}: {a:6.1f}s -> {b:6.1f}s, splices {splices}")
    print("\n".join(report))

    # Ducking from the known narration times: merge gaps under 1.6 s.
    merged = []
    for s, e in sorted(speech):
        s, e = s - 0.3, e + 0.5
        if merged and s - merged[-1][1] < 1.6:
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    g = np.zeros(N, np.float32)
    for s, e in merged:
        g[int(max(0, s) * SR) : int(min(total, e) * SR)] = 1.0
    # Asymmetric smoothing: 0.35 s down, 0.9 s back up.
    env = np.zeros(N, np.float32)
    down, up = 1 / (0.35 * SR), 1 / (0.9 * SR)
    v = 0.0
    for i in range(0, N, 64):
        tgt = g[i]
        v = min(tgt, v + down * 64) if tgt > v else max(tgt, v - up * 64)
        env[i : i + 64] = v
    music *= (10 ** ((DUCK_DB * env) / 20))[:, None]

    # Sound design.
    sfx = np.zeros((N, 2), np.float32)
    cache = {}
    for q in json.loads((ROOT / "src/generated/cues.json").read_text()):
        kind = q["kind"]
        if kind not in cache:
            y = load(ROOT / f"public/audio/sfx/{SFX_FILE.get(kind, kind)}.mp3")
            pk = float(np.abs(y).max()) + 1e-9
            cache[kind] = y * (db(SFX_PEAK[kind]) / pk)
        place(sfx, cache[kind] * db(q["gain"]), q["frame"] / FPS)

    mix = voice + music + sfx
    mix = mix[: int(total * SR)]
    if "--stems" in sys.argv:
        for name, bus in (("voice", voice), ("music", music), ("sfx", sfx)):
            write_wav(out.with_name(f"stem_{name}.wav"), bus[: int(total * SR)])
    tmp = out.with_suffix(".pre.wav")
    write_wav(tmp, mix)
    # Two-pass loudness normalisation.
    p = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(tmp), "-af", LIM + ",loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
        capture_output=True,
    )
    js = p.stderr.decode()
    m = json.loads(js[js.rindex("{") : js.rindex("}") + 1])
    af = LIM + "," + (
        f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
        f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample={SR}"
    )
    p2 = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-y", "-i", str(tmp), "-af", af.replace("linear=true", "linear=true:print_format=summary"), "-c:a", "pcm_s24le", str(out)], capture_output=True)
    nt = [l for l in p2.stderr.decode().splitlines() if "Normalization Type" in l]
    print(nt[0].strip() if nt else "normalization: n/a")
    tmp.unlink()
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
