# Final privacy QA report

Film: SalesMind: The RM Operating System · v2 master 15:56.9 · 1920×1080 · 30 fps · 17 chapters. Checked 16 Oct 2026 on the exported v2 master. (v1, 14:57.2, was checked 9 Oct 2026 with the same method and also passed.)

## Result: pass

| Check | Method | Result |
|---|---|---|
| Training label on screen | One frame every 2 s (478 frames). Template match on the label region, plus OCR of the label text | Present on 478/478. OCR read "TRAINING … SYNTHETIC" on 477; the one remaining frame passed the template match. Template match min 0.841, median 0.993. No frame missing the label. |
| URLs and internal domains in picture | Full-frame OCR of the same 478 frames for `http(s)://`, `www.` and `exante.(eu|com)`, which covers run., jira. and the internal wiki host | 0 hits |
| Synthetic data only | `scripts/privacy-lint.mjs` on `data/synthetic-data.json`, all screen, film and graphics code, subtitles, the generated timeline and cues, and fal job files | Pass. Emails on example.com only; phones in fictional ranges; CRM-DEMO-### and TRAIN-### IDs; EUR in 250,000 steps; no URLs; no blocklisted names |
| Real names from the sources | Same lint against an external blocklist of every person and firm name in the source material (kept outside the repo) | Pass |
| fal inserts free of text, logos, people and UI | Visual review of a 6-frame contact sheet for each of the 20 clips; OCR of the same frames | Clean. Three OCR reads were checked by eye and are false positives: light threads in F02 and P_OWL, a dot grid in P_ORDER. |
| Data sent to fal | Review of `manifest/fal-manifest.json` (every request) | Abstract prompts, the film's own narration script, music and sound prompts. No client data, screenshots or recordings. |
| Live capture | Process review | No live SalesMind account, browser session or recording was used at any point. |
| Simulated screens | Visual check, chapters 14 and 17 | Second label "SIMULATED TRAINING SCREEN · NO LIVE CONNECTION" present for the whole Google screen and the whole Ollie chat scene. |
| Reassurance line | Script and timeline | Spoken at chapters 3, 8, 10, 13, 14 (×2), 16, 17; the label glows each time. |
| Subtitles | Lint and line check | No personal data or URLs; 224 cues, ≤ 2 lines × 42 characters. |
| Loudness | EBU R128 on the master | −16.0 LUFS integrated, −2.4 dBTP |

## Ollie chapter (v2)

Chapter 17 shows a simulated chat workspace with Ollie, the review assistant. The screen is drawn in code; the owl mark is drawn in code; no frame, figure or wording from any real Ollie thread is used. The review message carries only synthetic figures (EUR multiples of 250,000, Day-number dates, DEMO deals from the film's dataset). The chapter is covered by both labels for its whole duration, the reassurance line is spoken as the screen appears, and the human line is shown verbatim and spoken: "Committee decisions, pay and employment are decided by people."

## Change after the scan

None for v2: the scan above ran on the final export and nothing was changed after it. (v1 had one spliced correction in chapter 6; v2 is a clean re-render of the whole film, so that splice no longer exists.)

## Residual risk

- Screens recreate documented behaviour. A viewer could take them for the live product. The persistent label, the "DEMO" tags on every company and the spoken reassurance address this.
- The film names the firm in two lines ("SalesMind is EXANTE's RM workspace"; "Ollie, EXANTE's review assistant"). This is fine for an internal audience. Confirm with Compliance before any wider showing.
- Chapter 17 describes Ollie as it stood in the 14 Oct 2026 snapshot, labelled beta. If Ollie's status or wording changes before wide use, re-check the chapter against the live About tab.
