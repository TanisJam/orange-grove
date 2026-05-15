# Orange Grove — Validators

Pure Node, zero dependencies. Run from the repo root.

## Scripts

### `check-traceability.mjs`

Verifies every `Rn` in `requirements.md` is covered by at least one task in `tasks.md`, and that every `(covers Rn)` reference points to an existing requirement.

```bash
node validator/check-traceability.mjs                  # all active features
node validator/check-traceability.mjs <feature-id>     # single feature
node validator/check-traceability.mjs --json           # machine-readable
```

Used by `ripeness-checker` as part of the mechanical Ripening verdict.

### `check-spec-shape.mjs`

Verifies each spec file has the required H2 sections from `templates/`:

- `explore.md` → `## Codebase context`, `## Constraints discovered`, `## Open questions`
- `requirements.md` → at least one `## Rn`
- `design.md` → `## Decision`, `## Alternative considered`, `## Test strategy`
- `tasks.md` → at least one `- [ ] Tn` line

```bash
node validator/check-spec-shape.mjs
node validator/check-spec-shape.mjs <feature-id>
node validator/check-spec-shape.mjs --json
```

Used by `ripeness-checker` and recommended after each spec-writing phase.

### `doctor.mjs`

Validates harness health:

- `feature_list.json` parses and has a `features` array.
- `progress/state.yaml` exists with `schema_version` and `active_feature`.
- Feature ids in `feature_list.json` and `state.yaml` agree.
- Every active-status feature has a folder in `specs/active/`.
- Every archived feature has a folder in `specs/archive/`.
- All required templates exist in `templates/`.
- All 8 canonical agents exist in `.opencode/agents/` (warned, not failed, when adapter missing).
- Top-level docs exist: `AGENTS.md`, `CHECKPOINTS.md`, `docs/orange-sdd.md`.

```bash
node validator/doctor.mjs
node validator/doctor.mjs --json
```

Used by `orange-grove` at session start or on demand.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | All checks pass (or no features to check) |
| 1 | One or more FAIL findings |
| 2 | Script invoked from wrong directory or missing essentials |

## Design notes

- Pure ES modules. Node ≥ 18.
- No external dependencies. `state.yaml` parsing uses regex limited to the controlled shape Orange Grove writes; a full YAML parser is intentionally avoided.
- Output defaults to human-readable; `--json` switches to structured output for piping into agents or CI.
