# Impact Fuel: Miami Unfiltered

Audio-locked assembly for the 117.0075 s music video. The soundtrack is the master. Generated clips are dropped into fixed 24 fps slots, rendered muted, and the original Opus is muxed back bit-for-bit.

## Setup

```bash
npm i
cp /path/to/Pitbull-Intro.opus public/audio/Pitbull-Intro.opus   # never committed
```

## Workflow

1. Generate the reference images, then each beat from `PROMPTS.md`: `python3 scripts/fal_generate.py still 04` for STILL beats (animated in the edit), `python3 scripts/fal_generate.py shot 05` for VIDEO beats.
2. Outputs land in `public/shots/` as `shot_XX_<name>.png` (stills) or `.mp4` (video). Filenames are listed in `src/shots.ts` and by `npm run status`.
3. `npm run status` probes the clips, updates `impact_fuel_production_manifest.json` and prints the dashboard.
4. Review each clip and set `"qc_passed": true` in the manifest.
5. `npm run draft` renders whatever exists. Empty slots show as labelled slates.
6. `npm run final` refuses to run until all 25 shots are QC_PASSED. It then renders, muxes, verifies, and marks every shot CONFORMED.
7. `npx remotion studio` gives a live preview with the soundtrack.

## Outputs (`out/`)

- `Impact_Fuel_Miami_Unfiltered_Final_OpusMaster.mp4`: H.264 picture plus the original Opus packets, verified identical to the master.
- `Impact_Fuel_Miami_Unfiltered_Final.mp4`: same picture with AAC 320k audio, for players that can't decode Opus in MP4.
- `qc/`: a frame either side of every cut, for visual review.

## AgentOpus route

If AgentOpus project `10021228-30e` renders the whole film:

```bash
scripts/remux-agentopus.sh ~/Downloads/agentopus_export.mp4
```

This conforms its picture to 24 fps, 1080p and 2808 frames. It replaces the re-encoded audio with the original Opus master and runs the same verification.

## Timing

24 fps × 117.0075 s = 2808.18 frames. The picture is 2808 frames (117.000 s). The last 7.5 ms of audio plays over black, which is the frame-accurate cut to black. The container duration reads 117.0075 s.
