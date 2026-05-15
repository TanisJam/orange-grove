---
name: orange-sdd
description: >
  Use when working with Orange SDD / Naranja SDD, citrus-themed Spec Driven
  Development, exploration, requirements, design docs, task breakdowns,
  implementation gates, verification, or review traceability. Trigger on SDD,
  specs, orange, naranja, seed, soil, roots, trunk, branches, fruit, ripening,
  harvest, or feature workflow.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "0.2.0"
---

# Orange SDD / Naranja SDD

## When to Use

Use this skill when the user wants to define, plan, implement, verify, or review a feature through a Spec Driven Development workflow.

## Core Principle

No se cosecha fruta sin raíces: **no implementation before approved specs**. And no harvest before ripeness: **no human review before mechanical verification passes**.

## Citrus Workflow (8 phases)

| Phase | Meaning | File |
| --- | --- | --- |
| Seed | Capture the change intent | `feature_list.json` |
| Soil | Explore the codebase before planning | `specs/<feature>/explore.md` |
| Roots | Requirements | `specs/<feature>/requirements.md` |
| Trunk | Technical design | `specs/<feature>/design.md` |
| Branches | Implementation tasks | `specs/<feature>/tasks.md` |
| Fruit | Code implementation | project files + `progress/impl_<feature>.md` |
| Ripening | Mechanical verification against spec | `progress/verify_<feature>.md` |
| Harvest | Human review + archive | `progress/harvest_<feature>.md` |

## Agent Roles

| Agent | Phase | Role |
| --- | --- | --- |
| `orange-grove` | all | Orchestrator / leader — never edits code |
| `soil-reader` | Soil | Explores the repo, produces `explore.md` |
| `root-gardener` | Roots | Writes requirements |
| `trunk-shaper` | Trunk | Writes design |
| `branch-pruner` | Branches | Writes tasks |
| `fruit-grower` | Fruit | Implements one task at a time |
| `ripeness-checker` | Ripening | Mechanical verification, edit: deny |
| `harvest-inspector` | Harvest | Human review + archive, edit: deny |

## Hard Rules

- Work on one active feature at a time per agent.
- Soil before Roots, Roots before Trunk, Trunk before Branches, Branches before Fruit.
- Stop for explicit human approval after specs are ready (`spec_ready`).
- The implementer follows `tasks.md` one task at a time.
- Ripening is mechanical: every `Rn` must map to a task and to verification evidence.
- Harvest is human: review code quality, then archive.
- The reviewer and the ripeness-checker never edit code.
- Progress belongs on disk, not only in chat.

## Feature States

Use these states in `feature_list.json`:

- `seed` — intent captured
- `exploring` — soil-reader is producing `explore.md`
- `rooting` — root-gardener is writing requirements
- `shaping` — trunk-shaper is writing design
- `pruning` — branch-pruner is writing tasks
- `spec_ready` — explore + requirements + design + tasks done, waiting for human approval
- `growing` — fruit-grower is implementing
- `ripening` — ripeness-checker is verifying
- `harvest_ready` — verification passed, waiting for harvest-inspector
- `done` — harvest passed, ready to archive
- `archived` — moved to `specs/archive/<feature>/`

## Minimal Spec Shape

`explore.md`:

```md
# Soil — <feature>

## Codebase context
<files, modules, patterns that matter for this feature>

## Constraints discovered
<what the repo already enforces — testing, lint, conventions>

## Open questions
<things requirements must resolve before Trunk can start>
```

`requirements.md`:

```md
# Roots — <feature>

## R1
WHEN <trigger>
THE SYSTEM SHALL <behavior>
```

`design.md`:

```md
# Trunk — <feature>

## Decision
<technical decision and why>

## Alternative considered
<what was rejected and why>

## Test strategy
<what kinds of tests verify which Rn>
```

`tasks.md`:

```md
# Branches — <feature>

- [ ] T1 — <small executable step> (covers R1)
```

`verify_<feature>.md`:

```md
# Ripening — <feature>

## Coverage
- R1 → T1, T3 → <evidence file or test>

## Mechanical checks
- All Rn covered by ≥1 task: PASS/FAIL
- All marked tasks reflected in diff: PASS/FAIL
- Tests required by design.md exist: PASS/FAIL
- Tests pass (if runnable): PASS/FAIL/SKIPPED

## Verdict
RIPE | UNRIPE
```

`harvest_<feature>.md`:

```md
# Harvest — <feature>

## Review
<code quality observations, NOT spec coverage — that's ripening>

## Verdict
PASS | FAIL
```

## Commands

```bash
python3 -m json.tool feature_list.json
```
