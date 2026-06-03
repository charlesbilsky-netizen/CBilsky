# Advanced Cowork Prompts & Skills

This repo is set up so Claude Cowork can operate like an autonomous teammate rather
than a chat assistant. Two things make that work:

1. **`CLAUDE.md`** at the repo root — persistent project context Claude reads every
   session, so it doesn't re-discover the codebase each time.
2. **Reusable Skills** in `.claude/skills/` — invoke them with `/<skill-name>` or just
   describe the task and Claude will load the matching one.

## The shift: delegate, don't chat

Get the most out of Cowork by defining **constraints**, setting **repeatable
workflows**, and structuring **outputs** so you never copy-paste or babysit. Point
Claude at a folder, state the rules and the error handling, and let it run.

## Installed Skills

| Skill | Use it for | Approval gate |
|-------|-----------|---------------|
| `file-architect` | Organize / rename / archive a directory by type + date. | Writes `audit_plan.md`, waits for "go" before moving files. Never deletes. |
| `data-pipeline` | Batch-extract data from many files into one CSV. | Runs hands-off; skips-and-logs bad files to `out/errors.csv`. |
| `skill-builder` | Turn a recurring task into a new reusable Skill. | Confirms the drafted `SKILL.md` before saving. |
| `project-architect` | Plan a build (`mission_control.md`) before any code. | Waits for plan approval before writing functional code. |

## The source frameworks (prompt templates)

### 1. File & Folder Master
> You are my Lead File Architect. Point at `[folder]`. Organize into subfolders by file
> type and date (YYYY-MM-DD); rename to `[ProjectName]_[YYYY-MM-DD]_[Description].[ext]`;
> move files older than 6 months to `Archive/`. Constraints: never delete; on name
> collision append `-v2`. First output `audit_plan.md` and wait for my "go", then execute.

### 2. Pipeline & Error Handling
> Analyze all PDFs in `inputs/` and extract the primary metrics into one CSV. Rules: if a
> file is unreadable/corrupted/missing data, don't stop — skip it and log to
> `out/errors.csv`. If data points are missing, use `N/A`, never guess. When done, write
> `out/summary.md` (successes vs. errors) and `out/extracted_metrics.csv`.

### 3. Custom Skill / Sub-Agent
> You are a workflow engineer. Problem: `[e.g. weekly marketing stats]`. Break it into a
> repeatable workflow with clear inputs/outputs, then draft a reusable Skill (prompt
> template + system instructions). Specify which steps run autonomously and when to pause
> for human approval.

### 4. Coding & Project Architecture
> I want to build `[idea]`. First analyze the current directory. Before building, generate
> `mission_control.md`: (1) architecture overview / file tree, (2) a 3-step build plan with
> estimates for data, logic, and UI, (3) dependencies/files you need from me. Write no
> functional code until I approve the plan.

## Writing your own Skill

Run `skill-builder`, or create `.claude/skills/<name>/SKILL.md` with YAML frontmatter:

```markdown
---
name: my-skill
description: What it does and WHEN to trigger it — include concrete trigger phrases.
---

# Title
Workflow steps, inputs/outputs, constraints, and which steps need human approval.
```

The `description` is what Claude matches on to auto-load the skill, so make it specific.
