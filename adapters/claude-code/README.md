# Orange SDD — Claude Code adapter

Installs the 8 Orange SDD agents and the `orange-sdd` skill into a Claude Code project.

## What it places where

| Source | Target |
| --- | --- |
| `core/agents/<name>.md` + Claude Code frontmatter | `.claude/agents/<name>.md` |
| `core/skill/SKILL.md` | `.claude/skills/orange-sdd/SKILL.md` |

Shared artifacts (templates, validator, docs, state) come from `core/manifest.json` and land in the project root.

## Frontmatter shape (Claude Code)

Each agent gets:

```yaml
---
name: <agent-name>
description: <from core/manifest.json>
tools: Read, Write, Edit, Bash, ...
model: opus | sonnet
---
```

## Read-only enforcement

Claude Code does not have explicit `edit: deny`. Instead, read-only agents (`ripeness-checker`, `harvest-inspector`) omit `Write` and `Edit` from their `tools` list. They can read code, run validators via Bash, but cannot modify files.

## Model assignments

| Agent | Model | Why |
| --- | --- | --- |
| `orange-grove` | opus | Orchestration + decisions |
| `trunk-shaper` | opus | Architectural decisions |
| Everything else | sonnet | Mechanical or structured work |

Override per-project by editing the installed `.claude/agents/<name>.md` frontmatter.

## Orchestration pattern

In Claude Code, the main session you talk to IS the orchestrator. To follow the Orange SDD flow:

1. Invoke `orange-grove` as the entry agent for any new feature: it owns delegation across phases.
2. Or have your main session read `AGENTS.md` and follow it directly — `orange-grove`'s instructions can be applied inline.
