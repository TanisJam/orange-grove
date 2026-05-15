# History

Append-only session history.

## 2026-05-15 — Phase A + Phase B harness build

- Phase A: split the original `branch-planner` into `trunk-shaper` + `branch-pruner`, added `soil-reader` and `ripeness-checker`, narrowed `harvest-inspector` to human review.
- 8-phase flow: Seed, Soil, Roots, Trunk, Branches, Fruit, Ripening, Harvest.
- New statuses in `feature_list.json`: `exploring`, `shaping`, `pruning`, `ripening`, `archived`.
- Phase B: `specs/active/` + `specs/archive/`, parseable `progress/state.yaml`, normative `templates/` for every artifact.

## 2026-05-15 — Phase C validators

- Added `validator/check-traceability.mjs` (Rn→Tn coverage).
- Added `validator/check-spec-shape.mjs` (required template sections).
- Added `validator/doctor.mjs` (harness health).
- Pure Node, zero deps. Wired into `ripeness-checker` and `orange-grove`.

## 2026-05-15 — Phase D portability

- Split into `core/` (source of truth) and `adapters/` (tool-specific).
- `core/agents/` contains body-only prompts; adapters add tool-specific frontmatter.
- Adapters: opencode (full), claude-code (full), cursor (stub), codex (stub).
- `core/installer.mjs` assembles agents and copies shared artifacts.
- `install.sh` handles tool detection and dispatches to the installer.
- `doctor.mjs` is now adapter-aware (checks whichever `.{tool}/agents/` is installed).
- Verified end-to-end: opencode install regenerates this repo's `.opencode/`, claude-code install produces a clean `.claude/` in a fresh target, both pass doctor.

## 2026-05-15 — Phase E delta specs + remote install

- Added `kind: feature | change` and `targets` to `feature_list.json` (schema_version 2).
- Convention `specs/active/<base>/changes/<change-id>/` for change folders.
- Delta syntax for requirements: ADD/MODIFY/REMOVE blocks with verbatim `Before`/`Was` matching enforced.
- New templates under `core/templates/changes/`: intent.md, requirements.md, design.md, tasks.md, README.md.
- New validators: `check-delta.mjs` (enforces delta well-formedness) and `apply-delta.mjs` (produces merged previews without overwriting base).
- `doctor.mjs` now validates change kind: targets must exist, id format `<base>/<change-id>`, folder nesting under base.
- All 8 agents updated with "Working path" sections that distinguish feature vs change.
- Added `bootstrap.sh` for remote install: `curl -sSL .../bootstrap.sh | bash -s -- --tool claude-code`.
- README updated with three install paths (curl, local clone, in-repo).
- Lesson: `--force` overwrites state files. Default install preserves them; only use `--force` for explicit resets.

## 2026-05-15 — Phase F polish (Orange Grove v0.3.0)

- Decided product name: **Orange Grove** (technical identifier `orange-grove` for the skill).
- Added `docs/onboarding.md` (first 30 minutes walkthrough).
- Added `docs/example-walkthrough.md` (`slugify` feature end-to-end with every artifact).
- Added `docs/why-orange-grove.md` (positioning and philosophy — tools change, processes are fundamental).
- Added `CHANGELOG.md` following Keep a Changelog conventions.
- Polished README with Orange Grove branding and a doc map.
- Built `tests/` suite using `node:test` and `node:child_process`. 25 tests across 5 files. All pass.
- Pure zero-deps test discipline: each test writes a temp fixture, spawns the validator CLI, asserts on exit code and stdout. Tests the contract, not internals.
- Released v0.3.0 on GitHub.

## 2026-05-15 — Phase G — English translation and rule rewording (v0.3.1)

- All harness files translated to English for efficiency and to share publicly.
- Hard rule reworded from the original Spanish to **"don't harvest before you plant"** — punchier and language-portable.
- The `orange-grove` agent retains its language-matching instruction so it still uses Rioplatense Spanish with the user when the conversation is in Spanish.
- Released v0.3.1 on GitHub.

## 2026-05-15 — Cleanup pass (v0.3.2)

- Removed development scaffolding traces from docs, examples, and history.
- Replaced doc examples with neutral identifiers (`auth`, `add-mfa`) that match the test fixtures.
- No behavior change.
