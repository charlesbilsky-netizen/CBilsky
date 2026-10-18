# Handover — anyone in the company can finish this from here

This repo now contains everything needed to render and deliver the film: all code, the narration audio, the score, the sound effects and the generated background plates are committed. No fal credits and no external accounts are required to render; a fresh `npm install` plus the commands below reproduce the film exactly.

## What this is

"SalesMind: The RM Operating System" — an internal training film, 17 chapters, ~18:50, built entirely in code (Remotion 4 / React) on synthetic data. The branch `claude/festive-lovelace-vv0jt2` and PR #3 hold the full history. `deliverables/README.md` has the full output map and rebuild steps; `deliverables/production_manifest.json`, `shot_map.csv` and `style_bible.md` document the production.

## Current state (16 Oct 2026)

Done and verified:
- The full edit: cold open (a deal dies in the dark), 3D hero frame = thumbnail, 17 chapters including Ollie (ch17), the October 2026 pipeline-deck integration, the CRM entry material (ch10), the Onboarding monitoring-request material (ch15).
- Sound: mix and stems rebuilt for the current timeline (`scripts/mix.py out/mix.wav --stems`); subtitles (`scripts/srt.py`).
- Privacy lint green on all sources; thumbnails rendered (17 chapters wording).

In progress / remaining:
1. **4K render** in 6 chunks (each ≤2 h): `npx remotion render Film out/chunks4k/cN.mp4 --muted --concurrency=3 --frames=A-B --scale=2 --crf=15 --jpeg-quality=95` with ranges 0-5999, 6000-11999, 12000-17999, 18000-23999, 24000-29999, 30000-33919. (Chunk 1 may already exist.) Concat: `for f in c1..c6 → file list` then `ffmpeg -f concat -safe 0 -i list.txt -c copy out/film_video_4k.mp4`.
2. **Masters**: mux 4K with `out/mix.wav` (aac 256k, +faststart) → `SalesMind_The_RM_Operating_System_4K.mp4`; lanczos-downscale to 1080p crf 16 → `SalesMind_The_RM_Operating_System.mp4` (commands verbatim in `deliverables/README.md`).
3. **QA**: `python3 scripts/qa.py out/SalesMind_The_RM_Operating_System.mp4` (label on every sampled frame, 0 URL hits, −16 LUFS) → update `deliverables/final_qa_report.md` + `qa_scan.json`.
4. **Chapter files**: `python3 scripts/share.py out/SalesMind_The_RM_Operating_System.mp4` (17 files ≤22 MB; the end card rides ch17). No trailer — dropped by Charles.
5. **Join kit**: rebuild `out/joinkit/` (soundtrack matched to the real share frame counts, chapters.txt, retimed SRT — the method is in the session history; the previous working version of each file is a template). `joinkit/Join_SalesMind.bat` is committed and checks 17 chapters.
6. **Deliver**: send the 17 chapter files + kit files + thumbnails to Charles (chat upload ≈24 MB/file ceiling).
7. **Possibly pending**: Charles planned to supply a CRM video walkthrough recorded on his corporate account. Rule: analyze it for structure and labels only; no real client name, figure or ID may enter the film, the repo, notes or chat; no frame of it is used as footage; it never goes to fal; recreate everything in code with `data/synthetic-data.json`.

## Hard rules that bind any successor

- Synthetic data only, everywhere. The label "TRAINING ENVIRONMENT · SYNTHETIC DATA · NOT A LIVE ACCOUNT" stays on every frame, top layer; simulated third-party screens carry the second label.
- Never capture, process or expose real client data. No live SalesMind/CRM session as visual input.
- No live URLs on screen; no internal EXANTE hostnames in anything client-facing; no investment advice or performance language (MiFID II).
- Privacy gate before any export: `node scripts/privacy-lint.mjs <files>` with `BLOCKLIST=<path>` pointing to a local file (kept OUT of the repo) listing every real person and firm name from the source material — rebuild it from the SalesMind skill file and the four Confluence PDFs (ask Charles for them: lead adding, CRM pipeline, qualified lead tags, Onboarding requests AM guide).
- fal (via this environment's proxy): $17.05 of the $20 cap spent; every job must go through `scripts/fal.py` so the manifest stays complete. Nothing from a live account is ever sent to fal.

## Sources of truth

The SalesMind skill (Charles has the `.skill` file), the October 2026 RM Pipeline user guide deck, and the four CRM Confluence pages. The film's accuracy tracing is in `deliverables/03_product_accuracy_checklist.md`.
