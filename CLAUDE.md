# CLAUDE.md

Guidance for Claude (Code / Cowork) when working in this repository.

## Project: Elite Resume AI™

A single-page web app that transforms a candidate's career history plus a target
Job Description into two outputs:

1. A **Strategic Briefing** (Markdown, rendered with collapsible sections).
2. A structured **JSON dossier** that drives a pixel-perfect, two-page PDF resume.

The model work is done by Google Gemini via `@google/genai`. The PDF is rendered
client-side from the JSON using `jspdf` + `html2canvas`.

## Tech stack

- **React 19** + **TypeScript**, no router — a single `App` component tree.
- **Vite 6** for dev/build (`vite.config.ts`).
- Dependencies are loaded two ways:
  - npm packages (`react`, `react-dom`, `@google/genai`, `showdown`) — see `package.json`.
  - CDN globals declared in `index.html` and referenced via `declare const` in
    `index.tsx`: `jspdf`, `html2canvas`, `Typo` (typo-js spellcheck), `showdown`.
- Path alias `@/*` maps to the repo root (see `tsconfig.json` / `vite.config.ts`).

## Layout

| File | Purpose |
|------|---------|
| `index.tsx` | The entire app (~2200 lines): `SYSTEM_PROMPT`, types, `App`, and all sub-components. |
| `index.html` | Entry HTML; importmap + CDN `<script>` tags for jspdf/html2canvas/typo/showdown. |
| `index.css` | All styling. |
| `vite.config.ts` | Injects `GEMINI_API_KEY` into `process.env.API_KEY` / `process.env.GEMINI_API_KEY`. |
| `metadata.json` | App name/description metadata. |

### Key symbols in `index.tsx`

- `SYSTEM_PROMPT` (line ~17) — the full Gemini instruction set. The model must emit
  the Markdown briefing, then the literal separator `===JSON_DOSSIER_START===`, then a
  single raw JSON object matching the dossier schema (no code fences).
- `interface ResumeData` (~114) — the dossier schema mirrored in TypeScript.
- `App` (~185) — top-level state, Gemini calls, parsing, and orchestration.
- Editing UI: `EditableField`, `EditableTextArea`, `SuggestionPopover`,
  `highlightMisspelledWords` (typo-js spellcheck).
- Presentation: `ThemeEditor`, `TemplateSelector`, `StrategicBriefing`, `BarChart`,
  `ResumePreview`, `CognitiveForgeAnimation`, `Typewriter`, `ResumeSkeletonLoader`.

## Commands

```bash
npm install      # install deps
npm run dev      # Vite dev server
npm run build    # production build to dist/
npm run preview  # preview the build
```

There is currently **no test suite and no linter configured**. If you add logic worth
guarding, add a test runner (e.g. Vitest) rather than relying on manual checks.

## Conventions & gotchas

- **API key**: read from `GEMINI_API_KEY` (in `.env.local`, gitignored). It is exposed
  to the client bundle by `vite.config.ts` — this is a client-side demo, so never commit
  a real key, and treat the key as public once built.
- **CDN globals** (`jspdf`, `html2canvas`, `Typo`) are not npm imports. Keep their
  `declare const` shims in sync with the `<script>` tags in `index.html`.
- **The separator token** `===JSON_DOSSIER_START===` is load-bearing: changing it
  requires updating both `SYSTEM_PROMPT` and the parsing logic in `App`.
- Match the existing style: functional components, hooks, inline event handlers, and the
  existing naming. There is no component-per-file split — new UI usually lives in
  `index.tsx` alongside its peers unless it grows large.
- Keep `ResumeData` and the JSON schema in `SYSTEM_PROMPT` in lockstep; they describe the
  same contract from two directions.

## Working autonomously here

- For non-trivial changes, sketch the plan before editing (the `project-architect` skill
  in `.claude/skills/` formalizes this).
- This is a single large file — prefer targeted edits over rewrites, and read the
  surrounding region before changing shared state in `App`.
- Verify a change by running `npm run dev` / `npm run build`; there are no automated tests
  to fall back on.
