# Example walkthrough — `slugify` end to end

A worked example of every artifact in the 8-phase flow. The feature is small on purpose so every phase fits on a screen.

**Feature:** add a pure function `slugify(input: string): string` that returns a URL-safe slug.

**`feature_list.json` entry:**

```json
{
  "id": "slugify",
  "kind": "feature",
  "status": "spec_ready",
  "name": "slugify utility",
  "summary": "Pure function string -> URL-safe slug."
}
```

---

## Phase 1 — Soil — `specs/active/slugify/explore.md`

```md
# Soil — slugify

## Codebase context

- `src/utils/` — existing utility module, no slug function yet.
- `vitest.config.ts` — tests run with `npm test`.
- `src/utils/index.ts` — barrel export, where slugify will be exported.

## Constraints discovered

- Tests run with `npm test` (vitest 1.x).
- Lint: `npm run lint` (eslint, no auto-fix on commit).
- Project convention: utilities are pure, no I/O, no `console.log` in source.
- TypeScript strict mode is on.

## Open questions

- Q1: should the function handle Unicode (accents like "é" → "e")? — answered in Roots: out of scope for v1, can be a future change.
- Q2: maximum length? — answered: no truncation; caller decides.
```

---

## Phase 2 — Roots — `specs/active/slugify/requirements.md`

```md
# Roots — slugify

## R1
WHEN slugify is called with a non-empty ASCII string
THE SYSTEM SHALL return a lowercase string with words separated by hyphens.

## R2
WHEN slugify is called with a string containing whitespace or punctuation
THE SYSTEM SHALL replace each run of non-alphanumeric ASCII characters with a single hyphen.

## R3
WHEN slugify is called with leading or trailing non-alphanumeric characters
THE SYSTEM SHALL strip them from the result.

## R4
WHEN slugify is called with an empty string
THE SYSTEM SHALL return an empty string.

## Open questions resolved from Soil

- Q1 → Unicode handling is out of scope for v1. A future change can extend it.
- Q2 → No truncation; callers manage length.
```

---

## Phase 3 — Trunk — `specs/active/slugify/design.md`

```md
# Trunk — slugify

## Decision

Implement `slugify` in `src/utils/slugify.ts` as a single pure function that
1. lowercases input,
2. replaces every run of `[^a-z0-9]+` with a single `-`,
3. trims leading and trailing `-`.

Export it from `src/utils/index.ts`.

This is the minimum implementation that covers R1–R4. No external dependencies.

## Alternative considered

A more elaborate implementation with Unicode normalization (`String.prototype.normalize('NFD')`) was rejected. R1–R4 are ASCII-only by Q1 in Soil. Unicode would expand scope and tests without serving the immediate need. A future change can add a Unicode mode (see `templates/changes/`).

## Test strategy

- R1, R2, R3, R4 → unit tests in `src/utils/slugify.test.ts` (vitest).
- One test per requirement minimum.
- One snapshot of a representative mix of cases for regression confidence.
```

---

## Phase 4 — Branches — `specs/active/slugify/tasks.md`

```md
# Branches — slugify

- [ ] T1 — Create `src/utils/slugify.ts` with the function (covers R1, R2, R3, R4)
- [ ] T2 — Export `slugify` from `src/utils/index.ts` (covers R1)
- [ ] T3 — Add `src/utils/slugify.test.ts` with one test per Rn (covers R1, R2, R3, R4)
- [ ] T4 — Run `npm test` and confirm all new tests pass (covers R1, R2, R3, R4)
```

At this point `status: spec_ready`. **You approve.** Status moves to `growing`.

---

## Phase 5 — Fruit — code + `progress/impl_slugify.md`

`fruit-grower` implements one task at a time and marks each `[x]` in `tasks.md`.

```md
# Fruit — slugify

## Files touched

- `src/utils/slugify.ts` — pure function implementation (T1).
- `src/utils/index.ts` — added `export { slugify } from './slugify'` (T2).
- `src/utils/slugify.test.ts` — four vitest tests, one per Rn (T3).

## Verification notes

- Manual: `npm test` passes, 4 new tests green (T4).
- No unrelated edits.

## Decisions during implementation

- None — followed the design as written.
```

---

## Phase 6 — Ripening — `progress/verify_slugify.md`

`ripeness-checker` runs validators and a manual diff review.

```md
# Ripening — slugify

## Coverage matrix

| Rn | Tasks | Evidence | Test exists | Test passes |
| --- | --- | --- | --- | --- |
| R1 | T1, T2, T3 | `src/utils/slugify.ts:1-8` | yes | PASS |
| R2 | T1, T3 | `src/utils/slugify.ts:3-5` | yes | PASS |
| R3 | T1, T3 | `src/utils/slugify.ts:6-7` | yes | PASS |
| R4 | T1, T3 | `src/utils/slugify.ts:1` (returns early) | yes | PASS |

## Mechanical checks

- All Rn covered by ≥1 task: PASS
- All Rn have implementation evidence: PASS
- All marked tasks reflected in diff: PASS
- Tests required by design.md exist: PASS
- Tests pass (if runnable): PASS

## Verdict

RIPE
```

Status moves to `harvest_ready`.

---

## Phase 7 — Harvest — `progress/harvest_slugify.md`

`harvest-inspector` reviews human-style quality. Trusts Ripening for coverage.

```md
# Harvest — slugify

## Quality review

- Function name and signature match project convention.
- Implementation is 8 lines, no accidental complexity.
- Tests use vitest's `describe`/`it` consistent with the rest of `src/utils/*.test.ts`.
- No debug logs, no commented-out code.

## Scope check

- Changes outside the feature scope: no.

## Verdict

PASS
```

Status moves to `done`. Entry appended to `progress/history.md`.

---

## What this example demonstrates

1. **Specs are short.** Four requirements, four tasks. Don't pad.
2. **Every Rn maps to a task** via `(covers Rn)`. The validator enforces this.
3. **Design states the decision AND the rejected alternative.** Future-you reads this and knows why.
4. **Test strategy is part of design**, not an afterthought. Ripening uses it to verify.
5. **Fruit phase is small.** Real implementation comes from clear tasks; clear tasks come from clear design; clear design comes from clear requirements.
6. **Ripening is mechanical.** It runs validators, fills a coverage matrix, gives a binary verdict. No taste.
7. **Harvest is human.** Code quality, conventions, scope. Trusts the mechanical layer.

If a feature does not benefit from this much structure, it probably should not be a feature in `feature_list.json`. Edit code directly and move on. Orange Grove is for changes that deserve specs.
