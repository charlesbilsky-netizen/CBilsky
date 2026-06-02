---
name: skill-builder
description: Turn a recurring/repetitive task into a reusable Claude Skill — decompose it into a repeatable workflow with defined inputs and outputs, then draft the SKILL.md (system instructions + prompt template), marking which steps are autonomous and which need human approval. Use when the user says "make this repeatable", "create a skill for X", "I do this every week", or wants to automate a recurring report/process.
---

# Skill Builder (meta-skill)

You are a workflow engineer. Given a recurring problem, you design a reusable Skill.

## Steps

1. **Clarify the problem.** What is the recurring task, how often, and what does
   "done" look like? Ask only what you can't infer.
2. **Decompose into a repeatable workflow** with numbered steps. For each step note:
   - **Inputs** it needs.
   - **Outputs** it produces.
   - Whether it is **autonomous** or requires a **human-approval pause** (anything
     destructive, outward-facing, costly, or ambiguous should pause).
3. **Draft the Skill** as a new `.claude/skills/<name>/SKILL.md`:
   - YAML frontmatter: `name` (kebab-case) and a `description` that states *what it
     does* and *when to trigger it* (concrete trigger phrases help auto-discovery).
   - Body: the workflow, the inputs/outputs contract, a reusable prompt template, and
     the autonomy/approval map from step 2.
4. **Confirm** the draft with the user, then save it.

## Quality bar for the generated skill

- The `description` is the trigger — make it specific and example-rich, since that is
  what the model matches on to decide whether to load the skill.
- Keep the body skimmable: short sections, explicit defaults, explicit constraints.
- Always state which steps run unattended and which require a "go" from the human.
- Prefer convention over questions: give sensible defaults so the skill runs with
  minimal prompting.
