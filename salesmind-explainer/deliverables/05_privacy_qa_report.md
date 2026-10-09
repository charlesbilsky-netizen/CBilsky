# Final privacy QA report

Film: SalesMind: The RM Operating System · master 14:57.2 · 1920×1080 · 30 fps. Checked 9 Oct 2026 on the exported master.

## Result: pass

| Check | Method | Result |
|---|---|---|
| Training label on screen | One frame every 2 s (449 frames). Template match on the label region, plus OCR of the label text | Present on 449/449. OCR read "TRAINING … SYNTHETIC" on all 449. Template match min 0.849, median 0.993. No frame missing the label. |
| URLs and internal domains in picture | Full-frame OCR of the same 449 frames for `http(s)://`, `www.` and `exante.(eu|com)`, which covers run., jira. and the internal wiki host | 0 hits |
| Synthetic data only | `scripts/privacy-lint.mjs` on `data/synthetic-data.json`, all screen, film and graphics code, subtitles, the generated timeline and cues, and fal job files | Pass. Emails on example.com only; phones in fictional ranges; CRM-DEMO-### and TRAIN-### IDs; EUR in 250,000 steps; no URLs; no blocklisted names |
| Real names from the sources | Same lint against an external blocklist of every person and firm name in the source material (kept outside the repo) | Pass |
| fal inserts free of text, logos, people and UI | Visual review of a 6-frame contact sheet for each of the 19 clips; OCR of the same 114 frames | Clean. Two OCR reads were checked by eye and are false positives: light threads in F02, a dot grid in P_ORDER. |
| Data sent to fal | Review of `manifest/fal-manifest.json` (every request) | Abstract prompts, the film's own narration script, music and sound prompts. No client data, screenshots or recordings. |
| Live capture | Process review | No live SalesMind account, browser session or recording was used at any point. |
| Simulated permissions screen | Visual check, chapter 14 | Second label "SIMULATED TRAINING SCREEN · NO LIVE CONNECTION" present while the Google screen is on. |
| Reassurance line | Script and timeline | Spoken at chapters 3, 8, 10, 13, 14 (×2), 16; the label glows each time. |
| Subtitles | Lint and line check | No personal data or URLs; 208 cues, ≤ 2 lines × 42 characters. |
| Loudness | EBU R128 on the master | −16.0 LUFS integrated, −2.4 dBTP |

## Change after the scan

One correction was made after the label and text scan: 48 frames in chapter 6 (about 4:50), where a picked filter chip lit in two groups. The frames were re-rendered from the same code, with the label on the same top layer, and spliced in. That window lies between two sampled frames, and its label region is identical to the frames on either side.

## Residual risk

- Screens recreate documented behaviour. A viewer could take them for the live product. The persistent label, the "DEMO" tags on every company and the spoken reassurance address this.
- The film names the firm in one line ("SalesMind is EXANTE's RM workspace"). This is fine for an internal audience. Confirm with Compliance before any wider showing.
