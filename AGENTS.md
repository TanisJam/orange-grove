# Orange Grove

This project uses the **Orange Grove** harness — Spec Driven Development with a citrus metaphor.

Core idea: **don't harvest before you plant**. Before implementing, we explore, grow requirements, shape the trunk, and prune tasks. Before approving as humans, we verify mechanically.

## Local agents

| Agent | Role |
| --- | --- |
| `orange-grove` | Orchestrator / leader. Tends the whole grove. Does not implement code directly. |
| `soil-reader` | Explores the repo and produces `explore.md` before any spec. |
| `root-gardener` | Requirements / spec author. Grows the roots before any code. |
| `trunk-shaper` | Technical design. Shapes the trunk. |
| `branch-pruner` | Task planner. Prunes the executable branches. |
| `fruit-grower` | Implementer. Grows the fruit by following approved tasks one at a time. |
| `ripeness-checker` | Mechanical verification against spec. Does not edit code. |
| `harvest-inspector` | Human review + archive. Does not edit code. |

## Validators

Pure-Node scripts in `validator/` that enforce mechanical rules:

- `validator/check-traceability.mjs` — every `Rn` covered by ≥1 task; no orphan refs.
- `validator/check-spec-shape.mjs` — required template sections per spec file.
- `validator/check-delta.mjs` — delta well-formedness for changes.
- `validator/apply-delta.mjs` — merged previews of base + change.
- `validator/doctor.mjs` — harness health (state.yaml ↔ feature_list ↔ folders ↔ agents).

`ripeness-checker` runs these as part of its verdict. `orange-grove` runs `doctor` at session start.

## Local skill

- `orange-grove`: holds the reusable process, the citrus metaphor, and the SDD rules.

## Flow

1. **Plant the Seed** — capture the intent in `feature_list.json`.
2. **Read the Soil** — `soil-reader` writes `specs/active/<feature>/explore.md`.
3. **Grow the Roots** — `root-gardener` writes `specs/active/<feature>/requirements.md`.
4. **Shape the Trunk** — `trunk-shaper` writes `specs/active/<feature>/design.md`.
5. **Prune the Branches** — `branch-pruner` writes `specs/active/<feature>/tasks.md`.
6. **Grow the Fruit** — `fruit-grower` implements following the approved tasks.
7. **Check Ripeness** — `ripeness-checker` validates mechanically (Rn → Tn → evidence).
8. **Harvest** — `harvest-inspector` reviews quality and archives.

## State on disk

| File | Purpose |
| --- | --- |
| `feature_list.json` | Feature registry and current status. |
| `progress/state.yaml` | Parseable state (canonical for machine reads). |
| `specs/active/<feature>/explore.md` | Soil notes (repo context). |
| `specs/active/<feature>/requirements.md` | Roots. |
| `specs/active/<feature>/design.md` | Trunk. |
| `specs/active/<feature>/tasks.md` | Branches. |
| `specs/archive/<feature>/` | Closed and archived features. |
| `templates/` | Canonical shapes for each artifact. |
| `progress/current.md` | Live session state (human prose). |
| `progress/impl_<feature>.md` | Implementer notes. |
| `progress/verify_<feature>.md` | Ripening result. |
| `progress/harvest_<feature>.md` | Harvest result. |
| `progress/history.md` | Append-only audit log. |
| `CHECKPOINTS.md` | Criteria for considering a feature done. |

## Hard rules

- The leader coordinates, does not implement.
- Soil before Roots. Roots before Trunk. Trunk before Branches. Branches before Fruit.
- Fruit before Ripening. Ripening before Harvest.
- No human review without a green Ripening.
- **CONCEPTS BEFORE CODE.**
