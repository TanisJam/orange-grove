# Changelog

All notable changes to Orange Grove follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.

## [0.3.0] — 2026-05-15

### Added
- **Delta specs.** A new `kind: change` in `feature_list.json` lets you modify an existing feature without losing the base spec. Changes live in `specs/active/<base>/changes/<change-id>/`.
- **Delta syntax** for change requirements: `ADD R<n>` / `MODIFY R<n>` / `REMOVE R<n>` blocks. The `Before` / `Was` block must match the base verbatim — the validator enforces this.
- **`validator/check-delta.mjs`** — validates delta well-formedness.
- **`validator/apply-delta.mjs`** — produces a merged preview of base + change for harvest review. Does not overwrite the base.
- **`templates/changes/`** — canonical shapes for intent, requirements (delta), design (delta), tasks, and a README.
- **`bootstrap.sh`** — remote installer. One-liner: `curl -sSL .../bootstrap.sh | bash -s -- --tool claude-code`.
- **`ORANGE_SDD_REF` / `ORANGE_SDD_REPO`** env vars for pinning a tag or using a fork.
- **`docs/onboarding.md`** — first 30 minutes walkthrough.
- **`docs/example-walkthrough.md`** — end-to-end worked example.
- **`docs/why-orange-grove.md`** — positioning and philosophy.

### Changed
- `feature_list.json` schema bumped to **schema_version 2**: added `kind`, `targets`, `kinds` array, and `_schema_docs`.
- All 8 agent prompts updated with a "Working path" section that distinguishes feature vs change.
- `doctor.mjs` validates the feature ↔ change graph: `targets` must exist, id format `<base>/<change-id>`, change folders nest under base.
- SKILL.md bumped to v0.3.0 with delta syntax documentation.

### Fixed
- Validator regex no longer used `\Z` (not supported in JavaScript). Replaced with `String.split(/(?=^##\s)/m)` for robust H2 boundary parsing in both `check-delta.mjs` and `apply-delta.mjs`.

### Renamed (breaking for in-progress installs)
- Skill: `orange-sdd` → `orange-grove`. Affects every agent prompt ("Use the `orange-grove` skill") and the skill directory under each adapter (`.{tool}/skills/orange-grove/`).
- Doc: `docs/orange-sdd.md` → `docs/orange-grove.md`.
- Bootstrap env vars: `ORANGE_SDD_REPO` → `ORANGE_GROVE_REPO`, `ORANGE_SDD_REF` → `ORANGE_GROVE_REF`.
- Product references in headings and prose updated from "Orange SDD / Naranja SDD" to "Orange Grove".
- Repo URL convention: `TanisJam/orange-grove`.

## [0.2.0] — 2026-05-15

### Added
- **8 phases** (was 7): Seed, Soil, Roots, Trunk, Branches, Fruit, Ripening, Harvest.
- **Two new agents:** `soil-reader` (exploration → `explore.md`) and `ripeness-checker` (mechanical verification → `verify_<feature>.md`).
- **Split:** previous `branch-planner` became `trunk-shaper` (design) + `branch-pruner` (tasks) to enable per-phase model assignment.
- **`specs/active/` and `specs/archive/`** layout. `specs/` no longer holds features at root.
- **`progress/state.yaml`** — machine-readable canonical state. `current.md` is human prose only.
- **`templates/`** with normative shapes for every artifact. Each agent's output must follow its template.
- **`validator/check-traceability.mjs`** — every `Rn` covered by ≥1 task.
- **`validator/check-spec-shape.mjs`** — every spec file has required template sections.
- **`validator/doctor.mjs`** — harness health (state.yaml ↔ feature_list ↔ folders ↔ agents).
- **`core/` and `adapters/`** structure: `core/` is the source of truth, adapters are tool-specific frontmatter overlays.
- **`core/installer.mjs`** + **`install.sh`** — portable install across opencode, Claude Code, Cursor (stub), Codex (stub).
- **`harvest-inspector` narrowed** to human review; mechanical coverage moved to `ripeness-checker`.

### Changed
- Feature states expanded: `seed`, `exploring`, `rooting`, `shaping`, `pruning`, `spec_ready`, `growing`, `ripening`, `harvest_ready`, `done`, `archived`.
- Top-level docs (`AGENTS.md`, `CHECKPOINTS.md`, `docs/orange-sdd.md`) updated to reflect the 8-phase flow.

### Removed
- Original 7-phase `branch-planner` agent (replaced by `trunk-shaper` + `branch-pruner`).

## [0.1.0] — 2026-05-14

### Added
- Initial citrus-themed SDD harness on top of opencode.
- 5 agents: `orange-grove`, `root-gardener`, `branch-planner`, `fruit-grower`, `harvest-inspector`.
- Disk-first state: `feature_list.json`, `progress/current.md`, `progress/history.md`, `specs/<feature>/`.
- 6 feature states: `seed`, `rooting`, `spec_ready`, `growing`, `harvest_ready`, `done`.
- First worked feature: `comparador-price-comparison` (Argentina price-comparison MVP).
