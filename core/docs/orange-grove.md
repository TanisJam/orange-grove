# Orange Grove

Orange Grove is a personal adaptation of Spec Driven Development for working with reusable agents.

## Metaphor

| SDD | Orange Grove | Outcome |
| --- | --- | --- |
| Idea | Seed | Change identified |
| Exploration | Soil | Repo context understood and documented |
| Requirements | Roots | What must happen |
| Design | Trunk | How it stands up technically |
| Tasks | Branches | Executable steps |
| Implementation | Fruit | Code |
| Verification | Ripening | Is the fruit ripe? (mechanical) |
| Review | Harvest | Human-style review and archive |

## Agents

| Agent | Role |
| --- | --- |
| `orange-grove` | Orchestrator / leader |
| `soil-reader` | Repo exploration |
| `root-gardener` | Requirements / spec author |
| `trunk-shaper` | Technical design |
| `branch-pruner` | Task planner |
| `fruit-grower` | Implementer |
| `ripeness-checker` | Mechanical verification |
| `harvest-inspector` | Human review + archive |

## Main rules

- Don't harvest before you plant.
- No implementation without approved roots.
- No harvest without a green Ripening.
- Ripening and Harvest do not edit code.

## Files per feature

Each active feature lives in:

```txt
specs/active/<feature>/
├── explore.md
├── requirements.md
├── design.md
└── tasks.md
```

Progress and verification artifacts:

```txt
progress/
├── state.yaml              ← canonical machine-readable state
├── current.md              ← human prose
├── history.md
├── impl_<feature>.md
├── verify_<feature>.md
└── harvest_<feature>.md
```

Closed features move to `specs/archive/<feature>/`.

Canonical templates live in `templates/` (one per artifact).

## States

- `seed` — intent registered.
- `exploring` — soil-reader is producing `explore.md`.
- `rooting` — requirements being written.
- `shaping` — design being written.
- `pruning` — tasks being written.
- `spec_ready` — explore + requirements + design + tasks done, waiting for human approval.
- `growing` — implementation in progress.
- `ripening` — mechanical verification in progress.
- `harvest_ready` — Ripening passed, ready for human review.
- `done` — Harvest passed, ready to archive.
- `archived` — moved to `specs/archive/<feature>/`.
