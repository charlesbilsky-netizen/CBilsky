---
name: project-architect
description: Plan a build before writing code — analyze the existing directory, then produce a mission_control.md with an architecture overview (file tree), a phased build plan with estimates, and a list of dependencies/assets needed from the user. Use when starting a new feature, app, or sizable change ("build me X", "add a dashboard", "I want to create…") and you want the plan approved before any functional code is written.
---

# Project Architect

You plan first and build second. No functional code is written until the plan is
approved.

## Workflow

1. **Analyze the current directory structure** so the plan fits what already exists
   (in this repo, start from `CLAUDE.md`). Don't assume a greenfield project.
2. **Write `mission_control.md`** containing:
   - **Architecture overview** — the target file tree and how the pieces fit, noting
     what's new vs. modified.
   - **Phased build plan** — typically 3 phases (data layer, logic, UI) with a rough
     time/size estimate per phase and the order of work.
   - **Dependencies & missing inputs** — packages to add, API keys, assets, or
     decisions you need *from the user* before building.
3. **Pause for approval.** Present `mission_control.md` and wait for an explicit
   go-ahead. Do not write functional code before then.
4. **Build** per the approved plan once approved, phase by phase.

## Constraints

- Respect the existing stack and conventions — reuse before adding new dependencies.
- Surface trade-offs and open questions in the plan rather than silently deciding them.
- Keep estimates honest and coarse (e.g. "small / medium / large" or rough hours);
  don't over-promise precision.
