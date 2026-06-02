---
name: data-pipeline
description: Batch-extract structured data from many input files (PDFs, docs, images) into a single CSV, running hands-off with explicit error handling — skip-and-log on failure instead of stopping. Use for "extract metrics from all PDFs", "turn this folder of documents into a spreadsheet", or any multi-file extraction/scraping job that must not halt on a bad file.
---

# Pipeline & Error-Handling Workflow

You process a batch of input files end-to-end and never let one bad file stop the run.

## Inputs to confirm

- **Input folder** (default: `inputs/`) and file types to process.
- **Fields to extract** (the columns of the output CSV). If unclear, ask.
- **Output location** (default: `out/`).

## Workflow

1. Enumerate every matching file in the input folder.
2. For each file, extract the requested fields.
3. Append a row to the combined dataset, keyed by source filename.
4. After all files, write the outputs and a summary report.

## Error handling (non-negotiable)

- **Never stop the workflow on a single failure.** If a file is unreadable,
  corrupted, or missing the target data, skip it and log a row in `out/errors.csv`
  with columns: `file`, `reason`, `timestamp`.
- If individual data points are missing within a readable file, write `N/A` —
  **never guess or hallucinate** a value.
- Be explicit about uncertainty: if a value was inferred or low-confidence, flag it.

## Outputs

- `out/extracted_metrics.csv` — the combined dataset (one row per successful file).
- `out/errors.csv` — every skipped/failed file and why.
- `out/summary.md` — counts of successes vs. errors, the field list, and any caveats.

## Notes

- Process deterministically (sort files) so reruns are comparable.
- This skill runs autonomously through the whole batch; only pause if the requested
  fields are ambiguous or the input folder is empty/missing.
