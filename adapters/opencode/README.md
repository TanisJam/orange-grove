# Orange SDD — opencode adapter

Installs the 8 Orange SDD agents and the `orange-sdd` skill into an opencode project.

## What it places where

| Source | Target |
| --- | --- |
| `core/agents/<name>.md` + opencode frontmatter | `.opencode/agents/<name>.md` |
| `core/skill/SKILL.md` | `.opencode/skills/orange-sdd/SKILL.md` |
| `adapters/opencode/opencode.json.tpl` | `opencode.json` (only if missing) |

Shared artifacts (templates, validator, docs, state) come from `core/manifest.json` and land in the project root.

## Frontmatter shape (opencode)

Each agent gets:

```yaml
---
description: <from core/manifest.json>
mode: primary | subagent
permission:
  edit: ask | allow | deny
  bash: ask | allow
  ...
---
```

See `adapters/opencode/manifest.json` for per-agent permission details. `ripeness-checker` and `harvest-inspector` have `edit: deny` because they must not modify code.
