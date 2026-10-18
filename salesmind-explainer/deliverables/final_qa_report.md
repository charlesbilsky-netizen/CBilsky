# Final QA report — v2.1 masters

Film: SalesMind: The RM Operating System · 17 chapters · 18:50.7 (33,920 frames, 30 fps).
Masters checked 16 Oct 2026: `SalesMind_The_RM_Operating_System_4K.mp4` (3840×2160, 1.59 GB) and the 1080p compatibility master (lanczos-downscaled from the 4K render, 443 MB, ~3.1 Mb/s, AAC 48 kHz stereo). All checks ran on the exported files, not the project.

Scope note: this QC was executed by the production agent following the studio protocol below; it is not human sign-off. The report is structured for a human reviewer (Marketing or a video vendor) to audit before wide screening.

## 1 · Media integrity — PASS

| Check | Result |
|---|---|
| Frame count | 6 render chunks of 6000/6000/6000/6000/6000/3920 frames concatenated = 33,920, matching the timeline exactly |
| Duration / framing | 1130.67 s · 16:9 · 30 fps · yuv420p at both resolutions |
| Streams | One H.264 video + one AAC 48 kHz stereo stream in each master; faststart set |
| Dead frames | Mean luma sampled inside every chapter title card: min 13.5/255 — no black or frozen frame at any boundary |
| Players | Master probed clean with ffprobe; chapter joins verified on the assembled kit output |

## 2 · Visual QA — PASS

| Check | Result |
|---|---|
| Training label | Template match + OCR on 565 frames sampled every 2 s: present and OCR-confirmed on 565/565, template min 0.83, median 0.995, none missing (`qa_scan.json`) |
| URLs / internal domains | Full-frame OCR of the same 565 frames: 0 hits |
| Simulated screens | Second label verified on the ch10 and ch15 CRM scenes, the ch14 Google screen and the ch17 Ollie chat |
| Scene-boundary stills | Every new scene QC'd from rendered stills during the build: cold open (clock, alert stack, stamp, beat line), hero frame, deck-integration shots (reach dialog, deposit panel, several-open-deals, table totals), CRM screens, Ollie chapter, title cards |
| 4K sharpness | Native-pixel crop of the hero frame inspected: type razor-sharp, no ringing or compression artefacts |
| Camera / crop | Framing clamp verified in stills; no 3D move crops essential UI; label layer never transformed |

## 3 · Audio QA — PASS

| Check | Result |
|---|---|
| Loudness / peak | −16.0 LUFS integrated · −2.3 dBTP on the final master (EBU R128) |
| First / last 30 s | Peak −2.7 dBFS, 0 clipped samples in both windows |
| Narration | All 103 lines placed from the same timeline as the picture; voice leads the mix, music ducks 10 dB under speech from known line times |
| Stems | `stem_voice.wav`, `stem_music.wav`, `stem_sfx.wav` delivered for future re-versioning |
| Sound-event mapping | All 175 cues map to visible events (registry-driven); no unmotivated effects |

## 4 · Editorial QA — PASS

| Check | Result |
|---|---|
| Narration vs picture | Phrase-timed: every call-out, chip and camera move keyed to its spoken phrase (see `shot_map.csv`) |
| Narration vs sources | Accuracy traced line-by-line in `03_product_accuracy_checklist.md` against the system guide, the Oct 2026 deck, the Ollie snapshot and the four CRM pages |
| Duplicates / gaps | 103 unique lines; the deck's learning outcomes (NB vs CG, who moves stages, deal-card urgency, one next action, alerts, accept/complete rhythm, hold/lost/blockers/duplicates) each land in at least one chapter |
| Subtitles | 240 cues, ≤ 2 lines × 42 chars, no collisions with lower-third cards; retimed copy ships in the join kit |
| Pause test | Key frames (board, card, alerts, verdicts, review message) each read as a complete slide when paused |

## Known limitations

- No human crew has reviewed the film; this report is the audit trail for that review.
- A ProRes/DNxHR mezzanine exceeds the workstation's disk allowance; the 4K H.264 CRF-15 master is the archival copy, and the render is exactly reproducible from the repo.
- Chat delivery caps shared files at ~22 MB, so the assembled film for distribution is the 1080p build; the 4K master exists in `out/` and in the reproducible pipeline.
- Runtime (18:50) sits just above the original 12–18 minute brief after the commissioned additions (Ollie, deck integration, CRM entry, Onboarding requests, cold open); accepted by the owner in exchange for completeness.
