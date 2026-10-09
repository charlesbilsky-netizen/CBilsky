# Compliance checklist

Internal training film. Checked against the brief's rules and the MiFID II communication standards the brief names. Each item is verified, with the method given.

| # | Requirement | Result | How it was checked |
|---|---|---|---|
| 1 | No live SalesMind account used, opened, recorded or inspected | Pass | No browser session was used. Every screen is built in code from documented labels (`src/screens`). |
| 2 | No real client data: names, emails, phones, companies, domains, CRM or application IDs, deal values, NAV, bonus, rankings, tickets, calendar, email | Pass | All records come from `data/synthetic-data.json`. The privacy lint passes on data, code, subtitles and manifest (`05_privacy_qa_report.md`). |
| 3 | No real names from the source material, and no colleague names | Pass | The privacy lint runs against an external blocklist of names from the sources (kept outside the repo). |
| 4 | Training label visible, high contrast, persistent, in the final export | Pass | The label is on the composition's top layer, above every transition, on every frame. Frame sampling of the export: see `05_privacy_qa_report.md`. |
| 5 | Simulated permissions screen labelled as simulated | Pass | Second label "SIMULATED TRAINING SCREEN · NO LIVE CONNECTION" during chapter 14's Google screen, plus the narrated line. |
| 6 | Reassurance line spoken at the first synthetic screen and at key screens | Pass | Chapters 3, 8, 10, 13, 14 (×2) and 16. The label glows as it is spoken. |
| 7 | fal used only for abstract inserts; no real screens, readable labels, compliance text or factual-looking figures generated | Pass | 19 clips, visually reviewed and OCR-scanned for text (`05_privacy_qa_report.md`). |
| 8 | No live data sent to fal, even temporarily | Pass | fal received only abstract prompts, the film's narration script and music and sound prompts (`07_fal_manifest.md`). |
| 9 | No live URLs in the rendered video | Pass | No URL strings in any screen, subtitle or card (lint). Materials show "Open link →" only. The end card points to the Guidebook by name. |
| 10 | No internal EXANTE domains (run., jira., confluence.exante.eu) | Pass | Lint blocks `exante.(eu|com)` and `/rm/` paths. |
| 11 | No investment advice, no performance promises | Pass | The film describes workspace mechanics only. No returns, recommendations or product suitability are mentioned. NAV figures are labelled synthetic. |
| 12 | Figures cannot be mistaken for real | Pass | Round multiples of EUR 250,000 and "DEMO" tags on every company. "Synthetic" appears on NAV tiles. "Figures are synthetic" is narrated in chapter 12. |
| 13 | No third-party deposit guidance | Pass | Not referenced. |
| 14 | No logos or brand marks generated | Pass | The SalesMind mark is a plain green square drawn in code. No EXANTE logo file is used. |
| 15 | Voice: synthetic narration, no real person's voice cloned | Pass | ElevenLabs stock voice "Brian" via fal. |
| 16 | Music and sound effects original, generated for this film | Pass | Stable Audio 2.5 (score) and ElevenLabs sound effects v2 via fal. |
| 17 | Subtitles available | Pass | `SalesMind_The_RM_Operating_System.en.srt`, 208 cues, at most 2 lines of 42 characters. |
| 18 | Loudness suitable for intranet and laptop playback | Pass | −16.0 LUFS integrated, −2.4 dBTP. A −23 LUFS version can be made for a broadcast chain. |

Open point for the owner: the film says "SalesMind is EXANTE's RM workspace". If it will be shown outside the RM team, confirm with Compliance that naming the firm in an internal training film is fine.
