# Ripening — <feature>

> Owner: `ripeness-checker`. Mechanical only. No opinions on code quality.

## Coverage matrix

| Rn | Tasks | Evidence | Test exists | Test passes |
| --- | --- | --- | --- | --- |
| R1 | T1, T3 | `path/to/file.ts:42` | yes | PASS |
| R2 | T2 | `path/to/file.ts:10` | yes | SKIPPED (no runner) |

## Mechanical checks

- All Rn covered by ≥1 task: PASS/FAIL
- All Rn have implementation evidence: PASS/FAIL
- All marked tasks reflected in diff: PASS/FAIL
- Tests required by `design.md` exist: PASS/FAIL
- Tests pass (if runnable): PASS/FAIL/SKIPPED

## Verdict

RIPE | UNRIPE

## If UNRIPE — gap list

- R2: missing test referenced in design.md
- T4: marked complete but no evidence in diff
