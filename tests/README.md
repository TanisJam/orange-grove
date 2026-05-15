# Orange Grove — Validator tests

Pure Node, zero dependencies. Uses the built-in `node:test` runner.

## Run

```bash
node --test tests/
```

To run a single file:

```bash
node --test tests/check-traceability.test.mjs
```

## Coverage

| File | What it exercises |
| --- | --- |
| `check-traceability.test.mjs` | PASS, uncovered Rn, orphan task refs, SKIP, --json |
| `check-spec-shape.test.mjs` | PASS, missing sections, missing Rn, missing Tn, MISSING file |
| `check-delta.test.mjs` | PASS, ADD collision, MODIFY mismatch, REMOVE missing, --json |
| `apply-delta.test.mjs` | ADD applied, MODIFY After-only, REMOVE drops Rn, numeric sort |
| `doctor.test.mjs` | HEALTHY, missing agent, missing folder, change-without-targets, --json |

## How tests work

Each test:
1. Writes a temporary harness fixture under `os.tmpdir()`.
2. Spawns the validator via `node:child_process` with the fixture as `cwd`.
3. Asserts on exit code and stdout (or parses `--json`).
4. Cleans up the fixture.

This means the tests verify the CLI contract, not internals. Refactor the validator implementation freely — tests stay green if the CLI behavior holds.
