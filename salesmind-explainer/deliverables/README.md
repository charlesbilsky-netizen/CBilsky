# SalesMind: The RM Operating System — production README

An internal training film, 17 chapters, about 17 minutes, built entirely on synthetic data. Every screen is a deterministic recreation in code (Remotion 4 / React): no live capture, no AI-generated UI, no real client data anywhere in the pipeline. Sources of truth: the October 2026 RM Pipeline user guide deck (33 slides), the system reference snapshot of 6–8 Oct 2026 (v0.6.1) and the Ollie snapshot of 14 Oct 2026.

## Where everything is

| Output | Path |
|---|---|
| 4K master (archival + delivery) | `out/SalesMind_The_RM_Operating_System_4K.mp4` |
| 1080p compatibility master (supersampled from 4K) | `out/SalesMind_The_RM_Operating_System.mp4` |
| Style proof (first 50 s at 4K) | `out/preview_styleproof_v01.mp4` |
| Chapter share files (≤22 MB each) | `out/share/SalesMind_Ch01…Ch17_*.mp4` |
| Trailer / 90 s cut | `out/SalesMind_Trailer_30s.mp4`, `out/SalesMind_Onboarding_90s.mp4` |
| Stems | `out/stem_voice.wav`, `out/stem_music.wav`, `out/stem_sfx.wav` |
| Subtitles (master timing) | `out/SalesMind_The_RM_Operating_System.en.srt` |
| One-click join kit (Windows) | `out/joinkit/` — 17 chapters + soundtrack + chapters.txt + cover + retimed SRT |
| Thumbnail (4K, 1920, 1280) | `out/SalesMind_thumbnail_3D_*.jpg/png` |
| QA | `deliverables/final_qa_report.md`, `deliverables/qa_scan.json` |
| Docs | `production_manifest.json`, `shot_map.csv`, `style_bible.md`, storyboard, screen inventory, accuracy, compliance, privacy QA, fal manifest |

## Rebuild from source

```
python3 scripts/timeline.py                      # timeline from narration segments
npx esbuild scripts/export-cues.tsx --bundle --platform=node --format=esm \
  --outfile=node_modules/.cache/export-cues.mjs --external:remotion --external:react \
  --external:react/jsx-runtime --external:@remotion/*
node node_modules/.cache/export-cues.mjs         # sound cues from the edit
npx remotion render Film out/film_video_4k.mp4 --muted --scale=2 --crf=14 --jpeg-quality=95
python3 scripts/mix.py out/mix.wav --stems       # mix + stems
# mux, then derive the 1080p master:
ffmpeg -i out/film_video_4k.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k \
  -movflags +faststart out/SalesMind_The_RM_Operating_System_4K.mp4
ffmpeg -i out/SalesMind_The_RM_Operating_System_4K.mp4 -vf scale=1920:1080:flags=lanczos \
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -c:a copy -movflags +faststart \
  out/SalesMind_The_RM_Operating_System.mp4
python3 scripts/srt.py && python3 scripts/cuts.py
python3 scripts/share.py out/SalesMind_The_RM_Operating_System.mp4
python3 scripts/qa.py  out/SalesMind_The_RM_Operating_System.mp4
```

fal assets (plates, narration, score, SFX) are already on disk under `public/`; regenerating them is governed by `scripts/fal.py` with a $20 cap and the manifest in `manifest/fal-manifest.json` (~$16.99 spent).

## What changed in v2.1

- The film opens on the hero frame: the 3D dashboard that is also the thumbnail, so the first frame of the file is the cover image.
- Full integration of the October 2026 deck: first-session cleanup, the reach-them move dialog with the CRM rule, the expected-deposit panel, several-open-deals housekeeping with the White Label exception, table totals with potential AUM and stage progress, loss-reason chips, keyboard moves, SLA exceptions, blocked history, #salesmind.
- Chapter 17: Ollie, with the owl mark redrawn in code after the product's real mark.
- Deeper 3D everywhere and a higher-fidelity render path (4K supersampled, jpeg-quality 95 frame capture).

## Known limitations

- A ProRes/DNxHR mezzanine at 4K exceeds this workstation's disk allowance; the 4K H.264 CRF-14 file is the archival master. The render is fully reproducible from code, which is stronger than any mezzanine.
- Chat delivery caps each shared file at ~22 MB, so the join kit assembles a 1080p film. The 4K master exists alongside it.
- One optional macro plate (a "signal card") was never generated: the fal balance ran out in v1 and nothing depends on it.
