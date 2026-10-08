# Production notes

## Deliverables

| File | What it is |
|---|---|
| `SalesMind_The_RM_Operating_System.mp4` | Master, 1920×1080, 30 fps, H.264, AAC 256 kb/s, about 14 min 57 s |
| `SalesMind_Ch01…Ch16_*.mp4` | One file per chapter, cut from the master, for sharing |
| `SalesMind_Trailer_30s.mp4` | 30-second trailer |
| `SalesMind_Onboarding_90s.mp4` | 90-second onboarding cut |
| `SalesMind_The_RM_Operating_System.en.srt` | English subtitles |
| `SalesMind_thumbnail_1920.jpg`, `_1280.jpg` | Thumbnail |
| `deliverables/*.md` | Storyboard, screen inventory, accuracy, compliance, privacy QA, fal manifest |

## How it was made

- **Picture:** Remotion 4.0.532 (React).
  - Every product-like screen is a synthetic recreation in code, using the documented labels and a single design system: Inter, an 8-point grid, 12 px cards and one shadow level.
  - Screens sit on a green ground at 82% scale, never full-bleed.
  - Camera moves are eased and framing-clamped, so a screen edge never enters the frame when pushed in.
  - Call-outs, a synthetic cursor with press feedback, highlight boxes, key caps and one-line principles are drawn on the film layer.
- **Abstract inserts:** Kling O3 Pro text-to-video via fal, 1080p.
  - 16 chapter plates and 3 extra plates: the icosahedron orbit, the data paths and settled order.
  - Each plate was made into a seamless 10 s boomerang loop. Behind graphics it sits back, dimmed and softly out of focus.
- **Narration:** ElevenLabs Multilingual v2, voice "Brian". 90 lines, stability 0.6, speed 0.95, each line read with its neighbours as context.
- **Score:** Stable Audio 2.5, option D, a pulsing modular sequence at 110 BPM in D minor.
  - Seven cues, one per chapter group, crossfaded under the title cards.
  - Cues that ran short were extended by repeating whole bars from their steady middle. Splice points were found by cross-correlation, with match 0.76–0.98.
- **Sound design:** 17 effects from ElevenLabs sound effects v2, placed on 138 cues from the same clock as the picture. These include clicks, chips, ticks, a two-note alert, a confirmation and a riser with impact for the title.
- **Mix:**
  - The voice leads at −16 LUFS. Music sits about −24 LUFS in the open and drops another 10 dB under speech, about 16 LU under the voice overall.
  - Ducking follows the known line times, so it never pumps.
  - A transparent master limiter, then linear loudness normalisation: −16.0 LUFS integrated, −2.4 dBTP.

## Timing

- 16 chapters, 14 min 57 s, inside the 12–18 minute brief.
- The narration alone runs 12 min 56 s. The rest is title cards (3.2 s each), holds on key states and resolution beats.
- Peak moments get longer holds: prioritisation, accepting the next action, the ownership verdicts and the end-of-day check.

## Cost

About $16.08 of the $20 cap across 143 completed fal jobs (see `07_fal_manifest.md`).

## Known limits

- Screens are faithful recreations of documented behaviour, not pixel copies of the live product. Labels follow the guide captured on 8 Oct 2026, platform v0.6.1. A later release can change labels.
- One optional plate (a macro "signal card") was not made: the fal balance ran out. Nothing in the film depends on it.
- In the stage graphic, Qualified is labelled "you move it". The guide adds that it also moves by itself once qualification is filled in.

## Rebuild

```
python3 scripts/timeline.py                      # timeline from narration
node node_modules/.cache/export-cues.mjs         # sound cues (after esbuild bundle)
npx remotion render Film out/film_video.mp4 --muted
python3 scripts/mix.py out/mix.wav --stems       # sound
python3 scripts/srt.py                           # subtitles
python3 scripts/cuts.py                          # trailer and 90 s cut
```
