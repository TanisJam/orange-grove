---
name: orange-grove
description: >
  Use when working with Orange Grove, citrus-themed Spec Driven Development,
  exploration, requirements, design docs, task breakdowns, implementation
  gates, verification, review traceability, or delta changes to existing
  features. Trigger on Orange Grove, SDD, specs, orange, naranja, seed, soil,
  roots, trunk, branches, fruit, ripening, harvest, delta, change, or feature
  workflow.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "0.3.0"
---

# Orange Grove

## When to Use

Use this skill when the user wants to define, plan, implement, verify, or review a feature through a Spec Driven Development workflow.

## Core Principle

No se cosecha fruta sin raíces: **no implementation before approved specs**. And no harvest before ripeness: **no human review before mechanical verification passes**.

## Citrus Workflow (8 phases)

| Phase | Meaning | File |
| --- | --- | --- |
| Seed | Capture the change intent | `feature_list.json` |
| Soil | Explore the codebase before planning | `specs/active/<feature>/explore.md` |
| Roots | Requirements | `specs/active/<feature>/requirements.md` |
| Trunk | Technical design | `specs/active/<feature>/design.md` |
| Branches | Implementation tasks | `specs/active/<feature>/tasks.md` |
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

## Layout

```
orange-sdd/
├── specs/
│   ├── active/<feature>/       ← live specs
│   └── archive/<feature>/      ← closed features (archived)
├── progress/
│   ├── state.yaml              ← machine-readable session state (canonical)
│   ├── current.md              ← human-readable prose
│   ├── history.md              ← append-only log
│   ├── impl_<feature>.md       ← fruit-grower notes
│   ├── verify_<feature>.md     ← ripeness-checker output
│   └── harvest_<feature>.md    ← harvest-inspector output
├── templates/                  ← canonical artifact shapes
└── feature_list.json           ← feature registry
```

## Hard Rules

- Work on one active feature at a time per agent.
- Soil before Roots, Roots before Trunk, Trunk before Branches, Branches before Fruit.
- Stop for explicit human approval after specs are ready (`spec_ready`).
- The implementer follows `tasks.md` one task at a time.
- Ripening is mechanical: every `Rn` must map to a task and to verification evidence.
- Harvest is human: review code quality, then archive.
- The reviewer and the ripeness-checker never edit code.
- Progress belongs on disk, not only in chat.

## Features vs Changes

A **feature** is a new capability. It lives in `specs/active/<feature-id>/`.

A **change** is a modification to an existing feature (add/modify/remove requirements). It lives in `specs/active/<base-feature-id>/changes/<change-id>/` and goes through the same 8 phases.

Both register in `feature_list.json`:

```json
// Feature
{ "id": "comparador", "kind": "feature", "status": "done" }

// Change targeting the feature
{ "id": "comparador/add-mercadolibre", "kind": "change", "targets": "comparador", "status": "seed" }
```

`kind` defaults to `"feature"` if omitted (backward compatible).

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

## Delta Syntax (for changes)

A change's `requirements.md` uses three operations against the base feature's numbered requirements:

```md
## ADD R8
WHEN <trigger>
THE SYSTEM SHALL <behavior>

## MODIFY R3
### Before
WHEN <old> THE SYSTEM SHALL <old>
### After
WHEN <new> THE SYSTEM SHALL <new>
### Reason
<why>

## REMOVE R5
### Was
WHEN <old> THE SYSTEM SHALL <old>
### Reason
<superseded by R8>
```

Rules:
- `ADD Rn` picks an `n` higher than any used in the base. Validator rejects collisions.
- `MODIFY Rn` and `REMOVE Rn`: the `Before` / `Was` block must match the base verbatim.
- `validator/check-delta.mjs` enforces this on Ripening.
- `validator/apply-delta.mjs` produces merged previews for Harvest review before replacing base files.

Design and tasks deltas are looser: write only what changes, in the same shape as the base templates. See `templates/changes/` for canonical shapes.

## Validators

Pure-Node scripts at `validator/` (zero dependencies). All accept `--json` for machine output.

| Script | Purpose |
| --- | --- |
| `check-traceability.mjs` | Every `Rn` covered by ≥1 task. No orphan task refs. |
| `check-spec-shape.mjs` | Each spec file has required template sections. |
| `check-delta.mjs` | Delta blocks well-formed; MODIFY/REMOVE match base verbatim. |
| `apply-delta.mjs` | Produce merged preview of base + change. |
| `doctor.mjs` | Health check on the whole harness. |

`ripeness-checker` runs `check-traceability` + `check-spec-shape` (and `check-delta` if `kind=change`) before issuing its verdict.

## Commands

```bash
# Validate the active feature
node validator/check-traceability.mjs <feature-id>
node validator/check-spec-shape.mjs <feature-id>

# Validate a delta change
node validator/check-delta.mjs <base>/<change-id>

# Preview the merge before Harvest
node validator/apply-delta.mjs <base> <change-id>

# Health check
node validator/doctor.mjs
```
