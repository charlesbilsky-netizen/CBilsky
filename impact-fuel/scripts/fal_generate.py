#!/usr/bin/env python3
"""Generates reference images and shots on fal (queue.fal.run).

The environment proxy adds the fal auth header, so no key is read here.

  scripts/fal_generate.py refs                # all reference images
  scripts/fal_generate.py refs ref_guide      # one reference
  scripts/fal_generate.py shot 03             # one shot, primary model
  scripts/fal_generate.py shot 03 --model fal-ai/kling-video/o3/pro/reference-to-video
  scripts/fal_generate.py shot 04 --fallback  # use the shot's fallback line
  scripts/fal_generate.py still 04            # one STILL beat (hybrid cut)

Prompts are parsed from PROMPTS.md, unchanged. "(REF-01)" style mentions are
mapped to the model's reference syntax (@Image1 ...). Reference image URLs and
generation IDs are recorded in public/refs/refs.json and the manifest.
"""
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROMPTS = (ROOT / "PROMPTS.md").read_text()
REFS_DIR = ROOT / "public/refs"
REFS_JSON = REFS_DIR / "refs.json"
SHOTS_DIR = ROOT / "public/shots"
MANIFEST = ROOT / "impact_fuel_production_manifest.json"
LOG = ROOT / "public/refs/fal_log.jsonl"

IMAGE_MODEL = "bytedance/seedream/v5/pro/text-to-image"
IMAGE_EDIT_MODEL = "bytedance/seedream/v5/pro/edit"
# Hybrid cut: Kling first for cost; Seedance stays available via --model.
VIDEO_MODEL = "fal-ai/kling-video/o3/pro/reference-to-video"
KLING_MAX_REFS = 4
VIDEO_MODEL_T2V = "bytedance/seedance-2.5/text-to-video"
RESOLUTION = "1080p"


def code_blocks(text):
    return re.findall(r"```\n(.*?)\n```", text, re.S)


NEGATIVE = code_blocks(PROMPTS.split("**Universal negative prompt")[1])[0].strip()


def parse_refs():
    """Returns {filename: (ref_id, prompt)} for every reference image."""
    phase2 = PROMPTS.split("## Phase 2")[1].split("## Phase 3")[0]
    refs = {}
    for m in re.finditer(r"\*\*REF-(\d\d) [^*]+\*\* \(([^)]+)\)\n((?:```\n.*?\n```\n?)+)", phase2, re.S):
        ref_id, files, blocks = m.group(1), m.group(2), code_blocks(m.group(3))
        names = re.findall(r"`([^`]+\.png)`", files)
        for name, prompt in zip(names, blocks):
            refs[name] = (f"REF-{ref_id}", prompt.strip())
    # REF-07 to REF-14: shared header line, one line per location, shared suffix.
    block = code_blocks(phase2.split("**REF-07 to REF-14")[1])[0].splitlines()
    head, suffix = block[0].strip(), block[-1].strip()
    for line in block[1:-1]:
        m = re.match(r"(\d\d) (ref_\w+\.png): (.*)", line.strip())
        refs[m.group(2)] = (f"REF-{m.group(1)}", f"{head} {m.group(3)} {suffix}")
    return refs


def parse_shots():
    phase3 = PROMPTS.split("## Phase 3 — Shot prompts")[1].split("## Phase 3 audit")[0]
    shots = {}
    parts = re.split(r"\n(?=\*\*\d\d · )", phase3)
    for part in parts:
        m = re.match(r"\*\*(\d\d) · (STILL|VIDEO) · [^`]*`(shot_[^`]+\.(?:mp4|png))`\*\*(.*)", part)
        if not m:
            continue
        sid, kind, fname, tail = m.group(1), m.group(2), m.group(3), m.group(4).split("\n")[0]
        gen = re.search(r"generate (\d+)(?:–(\d+))? s", tail)
        refs = re.findall(r"REF-\d\d", tail)
        prompt = code_blocks(part)[0].strip()
        fb = re.search(r"\*Fallback:\* `([^`]+)`", part)
        shots[sid] = {
            "kind": kind.lower(),
            "file": fname,
            "duration": int(gen.group(2) or gen.group(1)) if gen else None,
            "refs": refs,
            "prompt": prompt,
            "fallback": fb.group(1) if fb else None,
        }
    return shots


def http(method, url, body=None, timeout=120):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={"Content-Type": "application/json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")
            if e.code >= 500 and attempt < 4:
                time.sleep(2 ** (attempt + 1))
                continue
            raise RuntimeError(f"HTTP {e.code} {url}: {msg}") from None
        except (urllib.error.URLError, TimeoutError):
            if attempt < 4:
                time.sleep(2 ** (attempt + 1))
                continue
            raise


def run(model, payload, label):
    sub = http("POST", f"https://queue.fal.run/{model}", payload)
    rid = sub["request_id"]
    status_url = sub.get("status_url") or f"https://queue.fal.run/{model}/requests/{rid}/status"
    result_url = sub.get("response_url") or f"https://queue.fal.run/{model}/requests/{rid}"
    print(f"[{label}] {model} request {rid}", flush=True)
    t0 = time.time()
    while True:
        st = http("GET", status_url + "?logs=0")
        if st.get("status") == "COMPLETED":
            break
        if time.time() - t0 > 1800:
            raise RuntimeError(f"[{label}] timeout on {rid}")
        time.sleep(5)
    try:
        res = http("GET", result_url)
        err = None
    except RuntimeError as e:
        res, err = None, str(e)
    with LOG.open("a") as f:
        f.write(json.dumps({"label": label, "model": model, "request_id": rid, "error": err,
                            "seconds": round(time.time() - t0), "payload": payload, "result": res}) + "\n")
    if err:
        raise RuntimeError(f"[{label}] {err}")
    return rid, res


def download(url, dest):
    with urllib.request.urlopen(url, timeout=600) as r, open(dest, "wb") as f:
        f.write(r.read())


def gen_refs(only):
    REFS_DIR.mkdir(parents=True, exist_ok=True)
    known = json.loads(REFS_JSON.read_text()) if REFS_JSON.exists() else {}
    for name, (ref_id, prompt) in parse_refs().items():
        if only and name.removesuffix(".png") not in only and name not in only:
            continue
        rid, res = run(IMAGE_MODEL, {
            "prompt": prompt,
            "image_size": {"width": 1920, "height": 1080},
            "num_images": 1,
            "output_format": "png",
        }, name)
        url = res["images"][0]["url"]
        download(url, REFS_DIR / name)
        known[name] = {"ref": ref_id, "url": url, "model": IMAGE_MODEL, "request_id": rid,
                       "regenerations": known.get(name, {}).get("regenerations", -1) + 1}
        REFS_JSON.write_text(json.dumps(known, indent=2) + "\n")
        print(f"[{name}] saved", flush=True)


# Which reference files each REF id stands for.
REF_FILES = {
    "REF-01": ["ref_guide.png"], "REF-02": ["ref_crew.png"], "REF-03": ["ref_visitor.png"],
    "REF-04": ["ref_intermediary.png"], "REF-05": ["ref_enforcer.png"],
    "REF-06": ["ref_sedan_ext.png", "ref_sedan_int.png"],
    "REF-07": ["ref_rooftops.png"], "REF-08": ["ref_south_beach.png"], "REF-09": ["ref_overpass.png"],
    "REF-10": ["ref_little_havana.png"], "REF-11": ["ref_cemetery.png"], "REF-12": ["ref_little_haiti.png"],
    "REF-13": ["ref_opa_locka.png"], "REF-14": ["ref_carol_city.png"],
}


def tag_refs(shot, text, tag_fmt, max_refs=None):
    """Swaps "(REF-01)" mentions for the model's image tags; returns (text, urls)."""
    known = json.loads(REFS_JSON.read_text()) if REFS_JSON.exists() else {}
    urls, tags = [], {}
    for ref in shot["refs"]:
        names = REF_FILES[ref]
        if max_refs is not None:
            names = names[: max(0, max_refs - len(urls))]
        if not names:
            continue
        for name in names:
            urls.append(known[name]["url"])
        tags[ref] = " ".join(tag_fmt.format(len(urls) - len(names) + i + 1) for i in range(len(names)))
    for ref, tag in tags.items():
        text = text.replace(f"({ref})", f"({tag})")
    return text, urls


def build_still(sid, use_fallback):
    shot = parse_shots()[sid]
    if shot["kind"] != "still":
        raise SystemExit(f"shot {sid} is a VIDEO beat; use: shot {sid}")
    text = shot["fallback"] if use_fallback else shot["prompt"]
    if use_fallback and not text:
        raise SystemExit(f"shot {sid} has no fallback line")
    text, urls = tag_refs(shot, text, "Image {}")
    prompt = (
        "Single photoreal cinematic film still, 16:9, the decisive frozen moment of this shot, "
        "tack sharp, no motion blur, one frame, no collage, no split screen. "
        f"{text}\n\nAvoid: {NEGATIVE}"
    )
    payload = {"prompt": prompt, "image_size": {"width": 1920, "height": 1080},
               "num_images": 1, "output_format": "png"}
    if urls:
        payload["image_urls"] = urls
    return shot, (IMAGE_EDIT_MODEL if urls else IMAGE_MODEL), payload


def gen_still(sid, use_fallback):
    shot, model, payload = build_still(sid, use_fallback)
    rid, res = run(model, payload, f"still {sid}")
    SHOTS_DIR.mkdir(parents=True, exist_ok=True)
    download(res["images"][0]["url"], SHOTS_DIR / shot["file"])
    record(sid, shot, model, rid, use_fallback, res)
    print(f"[still {sid}] saved {shot['file']}", flush=True)


def record(sid, shot, model, rid, use_fallback, res):
    m = json.loads(MANIFEST.read_text())
    for s in m["shots"]:
        if s["id"] == sid:
            first = s["generator"] is None
            s["generator"] = model
            s["generation_id"] = rid
            s["regenerations"] = s["regenerations"] if first else s["regenerations"] + 1
            s["references"] = [n for r in shot["refs"] for n in REF_FILES[r]]
            s["notes"] = ("fallback line" if use_fallback else "prompt as written") + f", seed {res.get('seed')}"
            s["qc_passed"] = False
    MANIFEST.write_text(json.dumps(m, indent=2) + "\n")


def build_shot(sid, model, use_fallback):
    shot = parse_shots()[sid]
    if shot["kind"] != "video":
        raise SystemExit(f"shot {sid} is a STILL beat; use: still {sid}")
    text = shot["fallback"] if use_fallback else shot["prompt"]
    if use_fallback and not text:
        raise SystemExit(f"shot {sid} has no fallback line")
    if model is None:
        model = VIDEO_MODEL if shot["refs"] else VIDEO_MODEL_T2V
    text, urls = tag_refs(shot, text, "@Image{}", KLING_MAX_REFS if "kling" in model else None)
    prompt = f"{text}\n\nAvoid: {NEGATIVE}"
    payload = {"prompt": prompt, "aspect_ratio": "16:9", "duration": str(shot["duration"]),
               "generate_audio": False}
    if "seedance" in model or "veo" in model:
        payload["resolution"] = RESOLUTION
    if "veo" in model:
        payload["duration"] = f"{shot['duration']}s"
    if urls:
        payload["image_urls"] = urls
    return shot, model, payload


def gen_shot(sid, model, use_fallback):
    shot, model, payload = build_shot(sid, model, use_fallback)
    rid, res = run(model, payload, f"shot {sid}")
    SHOTS_DIR.mkdir(parents=True, exist_ok=True)
    download(res["video"]["url"], SHOTS_DIR / shot["file"])
    record(sid, shot, model, rid, use_fallback, res)
    print(f"[shot {sid}] saved {shot['file']}", flush=True)


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        raise SystemExit(__doc__)
    if args[0] == "refs":
        gen_refs(set(args[1:]))
    elif args[0] == "shot":
        model = args[args.index("--model") + 1] if "--model" in args else None
        gen_shot(args[1], model, "--fallback" in args)
    elif args[0] == "still":
        gen_still(args[1], "--fallback" in args)
    elif args[0] == "show":
        kind = parse_shots()[args[1]]["kind"]
        built = (build_still(args[1], "--fallback" in args) if kind == "still"
                 else build_shot(args[1], None, "--fallback" in args))
        print(json.dumps(built[1:], indent=2))
    else:
        raise SystemExit(__doc__)
