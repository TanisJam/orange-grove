# Orange SDD — Cursor adapter (BETA)

Cursor does not have a native sub-agent system equivalent to opencode or Claude Code. Orange SDD agents are installed as **rules** under `.cursor/rules/<name>.mdc`.

## Limitations

- **No edit:deny**. Cursor rules cannot enforce per-agent permissions. The read-only boundary for `ripeness-checker` and `harvest-inspector` is documented in the prompt body — the user must respect it.
- **No automatic delegation**. The orchestration flow (`orange-grove` → `soil-reader` → ...) becomes the user's responsibility: invoke each rule by referencing it in chat.
- **No explicit model override**. Use the model selected in the Cursor UI.

## What it places where

| Source | Target |
| --- | --- |
| `core/agents/<name>.md` + `.mdc` frontmatter | `.cursor/rules/<name>.mdc` |
| `core/skill/SKILL.md` | `.cursor/rules/orange-sdd/SKILL.mdc` |

Shared artifacts (templates, validator, docs, state) install at the project root just like for the other adapters.

## Frontmatter shape

```yaml
---
description: <from core/manifest.json>
globs:
  - specs/active/**/requirements.md
alwaysApply: false
---
```

`globs` are populated for spec-writing agents so Cursor surfaces the rule when the relevant file type is open.

## Status

Stub. Pattern is in place. End-to-end validation in Cursor pending.
