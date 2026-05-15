# History

Append-only session history.

## 2026-05-14 — comparador-price-comparison harvested

- Harvest verdict: PASS.
- Verified requirements R1–R13 against tasks T1–T17 and `comparador/` implementation.
- Confirmed no production scraping, no bypass of unavailable sources, and no fake real-source pricing.
- Marked feature `done`.

## 2026-05-14 — comparador post-install verification

- Fixed Vitest alias resolution for `@/*` via `comparador/vitest.config.ts`.
- Verified `npm test`: 3 files / 6 tests passed.
- Verified `npm run typecheck`: passed.
- No build was run.

## 2026-05-14 — Mercado Libre integration specs paused

- Prepared `comparador-mercadolibre-source` requirements, design, and tasks.
- Feature is `spec_ready`; no production code implemented.
- User agreed with `MELI_ACCESS_TOKEN` env-var approach.
- Work paused until next session before fruit/implementation.

## 2026-05-15 — Orange SDD Fase A + Fase B harness upgrade

- Fase A: split branch-planner into trunk-shaper + branch-pruner, added soil-reader and ripeness-checker, narrowed harvest-inspector to human review.
- 8-phase flow: Seed, Soil, Roots, Trunk, Branches, Fruit, Ripening, Harvest.
- New statuses in `feature_list.json`: `exploring`, `shaping`, `pruning`, `ripening`, `archived`.
- Fase B: `specs/active/` + `specs/archive/`, parseable `progress/state.yaml`, normative `templates/` for every artifact.
- Existing features moved into `specs/active/`. No re-verification yet against new flow.

## 2026-05-15 — Naranjal reset before Fase C

- Deleted comparador/ app and both comparador-* feature folders.
- Removed legacy progress files (impl_, review_) that predate Soil and Ripening.
- Reset feature_list.json and state.yaml to empty state.
- Decision: start fresh against the 8-phase flow rather than retrofit. history.md kept as audit trail.

## 2026-05-15 — Fase C validators

- Added validator/check-traceability.mjs (Rn→Tn coverage).
- Added validator/check-spec-shape.mjs (required template sections).
- Added validator/doctor.mjs (harness health).
- Pure Node, zero deps. Wired into ripeness-checker and orange-grove.

## 2026-05-15 — Fase D portability

- Split into core/ (source of truth) and adapters/ (tool-specific).
- core/agents/ contains body-only prompts; adapters add tool-specific frontmatter.
- Adapters: opencode (full), claude-code (full), cursor (stub), codex (stub).
- core/installer.mjs assembles agents and copies shared artifacts.
- install.sh handles tool detection and dispatches to the installer.
- doctor.mjs is now adapter-aware (checks whichever .{tool}/agents/ is installed).
- Verified end-to-end: opencode install regenerates this repo's .opencode/, claude-code install produces clean .claude/ in fresh target, both pass doctor.

## 2026-05-15 — Fase E delta specs + remote install

- Added `kind: feature | change` and `targets` to feature_list.json (schema_version 2).
- Convention `specs/active/<base>/changes/<change-id>/` for change folders.
- Delta syntax for requirements: ADD/MODIFY/REMOVE blocks with verbatim `Before`/`Was` matching enforced.
- New templates under `core/templates/changes/`: intent.md, requirements.md, design.md, tasks.md, README.md.
- New validators: `check-delta.mjs` (enforces delta well-formedness) and `apply-delta.mjs` (produces merged previews without overwriting base).
- doctor.mjs now validates change kind: targets must exist, id format `<base>/<change-id>`, folder nesting under base.
- All 8 agents updated with "Working path" sections that distinguish feature vs change.
- Added `bootstrap.sh` for remote install: `curl -sSL .../bootstrap.sh | bash -s -- --tool claude-code`.
- README updated with three install paths (curl, local clone, in-repo).
- Lesson: `--force` overwrites state files. Default install preserves them; only use `--force` for explicit resets.

## 2026-05-15 — Fase F polish (Orange Grove v0.3.0)

- Decided product name: **Orange Grove** (technical identifier `orange-sdd` retained for the skill name).
- Added `docs/onboarding.md` (first 30 minutes walkthrough).
- Added `docs/example-walkthrough.md` (slugify feature end-to-end with every artifact).
- Added `docs/why-orange-grove.md` (positioning and philosophy — tools change, processes are fundamental).
- Added `CHANGELOG.md` following Keep a Changelog conventions, covering v0.1, v0.2, v0.3.
- Polished README with Orange Grove branding and a doc map.
- Built `tests/` suite using `node:test` and `node:child_process`. 25 tests across 5 files. All pass.
- Pure zero-deps test discipline: each test writes a temp fixture, spawns the validator CLI, asserts on exit code and stdout. Tests the contract, not internals.
- Fixed regression: one test fixture omitted the H1 title and tripped the minLines check in check-spec-shape. Lesson — fixtures should mirror real templates.
- Harness is ready to push to GitHub. Next: rename repo to `orange-grove` when publishing.
