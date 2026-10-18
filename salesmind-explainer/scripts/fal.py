#!/usr/bin/env python3
"""fal queue client for the SalesMind training film.

The environment proxy authenticates queue.fal.run, so no key is read here.
Every job is recorded in manifest/fal-manifest.json with its model, request
ID, inputs, estimated cost and output file. A job is refused if the estimated
running total would pass the cap.

  scripts/fal.py run <job.json>...      submit, wait, download (jobs run in parallel)
  scripts/fal.py total                  estimated spend so far
  scripts/fal.py collect                fetch jobs left "submitted" (no resubmission, no new charge)

job.json: {"id": "voice-george", "model": "...", "input": {...}, "out": "public/voice/x.mp3",
           "cost": 0.05, "kind": "voice|insert|music|sfx"}
"""
import json
import sys
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "manifest/fal-manifest.json"
CAP_USD = 20.0
lock = threading.Lock()


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
            raise RuntimeError(f"HTTP {e.code} {url}: {msg[:600]}") from None
        except (urllib.error.URLError, TimeoutError):
            if attempt < 4:
                time.sleep(2 ** (attempt + 1))
                continue
            raise


def load():
    return json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {"cap_usd": CAP_USD, "jobs": []}


def save(m):
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(m, indent=2) + "\n")


def spent(m):
    return round(sum(j["cost"] for j in m["jobs"] if j.get("status") in ("done", "submitted")), 2)


def download(url, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=600) as r:
                data = r.read()
            dest.write_bytes(data)
            return
        except Exception:
            if attempt == 3:
                raise
            time.sleep(3)


def first_url(res):
    for key in ("video", "audio", "audio_file", "image"):
        v = res.get(key)
        if isinstance(v, dict) and v.get("url"):
            return v["url"]
    for key in ("images", "audios"):
        v = res.get(key)
        if isinstance(v, list) and v and v[0].get("url"):
            return v[0]["url"]
    raise RuntimeError(f"no media url in result keys {list(res)}")


def run(job):
    with lock:
        m = load()
        if spent(m) + job["cost"] > CAP_USD:
            print(f"[{job['id']}] REFUSED: would pass the ${CAP_USD:.0f} cap (spent ~${spent(m):.2f})", flush=True)
            return
        entry = {**{k: job[k] for k in ("id", "model", "kind", "cost", "out")}, "input": job["input"], "status": "submitted"}
        m["jobs"].append(entry)
        save(m)
    try:
        sub = http("POST", f"https://queue.fal.run/{job['model']}", job["input"])
        rid = sub["request_id"]
        base = "/".join(job["model"].split("/")[:2])
        with lock:
            m = load()
            next(j for j in m["jobs"] if j["id"] == job["id"])["request_id"] = rid
            save(m)
        print(f"[{job['id']}] {job['model']} request {rid}", flush=True)
        t0 = time.time()
        while http("GET", f"https://queue.fal.run/{base}/requests/{rid}/status").get("status") != "COMPLETED":
            if time.time() - t0 > 1800:
                raise RuntimeError("timeout")
            time.sleep(5)
        res = http("GET", f"https://queue.fal.run/{base}/requests/{rid}")
        download(first_url(res), ROOT / job["out"])
        status, err = "done", None
        print(f"[{job['id']}] saved {job['out']}", flush=True)
    except Exception as e:  # refusals and validation errors are not charged
        status, err = "failed", str(e)[:600]
        print(f"[{job['id']}] FAILED {err}", flush=True)
    with lock:
        m = load()
        for j in m["jobs"]:
            if j["id"] == job["id"] and j["status"] == "submitted":
                j["status"], j["error"] = status, err
        save(m)


if __name__ == "__main__":
    args = sys.argv[1:]
    if args and args[0] == "total":
        m = load()
        print(f"estimated spend ${spent(m):.2f} of ${CAP_USD:.2f} cap")
    elif args and args[0] == "collect":
        def fetch(j):
            base = "/".join(j["model"].split("/")[:2])
            t0 = time.time()
            try:
                while http("GET", f"https://queue.fal.run/{base}/requests/{j['request_id']}/status").get("status") != "COMPLETED":
                    if time.time() - t0 > 1800:
                        raise RuntimeError("timeout")
                    time.sleep(5)
                download(first_url(http("GET", f"https://queue.fal.run/{base}/requests/{j['request_id']}")), ROOT / j["out"])
                status, err = "done", None
                print(f"[{j['id']}] saved {j['out']}", flush=True)
            except Exception as e:
                status, err = "failed", str(e)[:600]
                print(f"[{j['id']}] FAILED {err}", flush=True)
            with lock:
                m = load()
                for x in m["jobs"]:
                    if x["id"] == j["id"]:
                        x["status"], x["error"] = status, err
                save(m)
        pending = [j for j in load()["jobs"] if j["status"] == "submitted" and j.get("request_id")]
        with ThreadPoolExecutor(12) as ex:
            list(ex.map(fetch, pending))
    elif args and args[0] == "run":
        jobs = [j for f in args[1:] for j in (lambda d: d if isinstance(d, list) else [d])(json.loads(Path(f).read_text()))]
        with ThreadPoolExecutor(12) as ex:
            list(ex.map(run, jobs))
        m = load()
        print(f"estimated spend ${spent(m):.2f} of ${CAP_USD:.2f} cap")
    else:
        raise SystemExit(__doc__)
