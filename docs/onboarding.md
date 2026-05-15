# Onboarding — Your first 30 minutes with Orange Grove

This walks you from zero to your first harvested feature. The whole thing is meant to be done in one sitting: install, plant, grow, harvest.

If anything in this doc is confusing, that is a bug. Open an issue.

---

## 0. Prerequisites

- Node.js ≥ 18 (`node --version`)
- `git` (for the remote install)
- A target project where you want Orange Grove to live, with one of the supported AI coding tools set up: opencode, Claude Code, Cursor, or Codex.

This walkthrough assumes you have Claude Code or opencode. The flow is identical for both.

---

## 1. Install (3 min)

From inside the project where you want to use Orange Grove:

```bash
cd ~/my-project

# Option A — remote one-liner
curl -sSL https://raw.githubusercontent.com/TanisJam/orange-grove/main/bootstrap.sh \
  | bash -s -- --tool claude-code

# Option B — from a local clone
git clone --depth 1 https://github.com/TanisJam/orange-grove ~/.orange-grove
~/.orange-grove/install.sh --tool claude-code --target .
```

Verify:

```bash
node validator/doctor.mjs
# expected: [HEALTHY] Orange Grove harness looks good.
```

If `doctor` reports `[UNHEALTHY]`, fix the listed issues before continuing. The most common one is forgetting `--tool` and not having the adapter installed.

---

## 2. Understand the layout (2 min)

After install, your project has:

```
my-project/
├── .claude/agents/         ← 8 agents (orange-grove, soil-reader, ...)
├── .claude/skills/orange-grove/SKILL.md
├── AGENTS.md               ← rules for the orchestrator
├── CHECKPOINTS.md          ← what "done" means
├── feature_list.json       ← feature registry
├── progress/
│   ├── state.yaml          ← machine-readable session state
│   ├── current.md          ← human prose
│   └── history.md          ← audit trail
├── specs/
│   ├── active/             ← live features
│   └── archive/            ← closed features
├── templates/              ← canonical artifact shapes
└── validator/              ← Node validators (zero deps)
```

The harness lives at the root of your project. Your actual code lives wherever it already does.

---

## 3. Plant your first Seed (5 min)

A "Seed" is just a registered intent. Edit `feature_list.json`:

```json
{
  "schema_version": 2,
  "features": [
    {
      "id": "hello-slugify",
      "kind": "feature",
      "status": "seed",
      "name": "slugify utility function",
      "summary": "Add a pure function that converts a string to a URL-safe slug."
    }
  ],
  "statuses": [...],
  "kinds": ["feature", "change"],
  "rules": {...}
}
```

And `progress/state.yaml`:

```yaml
schema_version: 1
active_feature: hello-slugify
features:
  hello-slugify:
    status: seed
    phase: seed
    last_updated: 2026-05-15
    artifacts:
      explore: null
      requirements: null
      design: null
      tasks: null
      impl: null
      verify: null
      harvest: null
```

Then in your AI tool, ask `orange-grove` (the orchestrator agent) to start working on `hello-slugify`. From this point the agent drives the flow.

---

## 4. Drive through the 8 phases (15 min)

The orchestrator delegates each phase to its specialist. You approve between phases.

| Phase | What happens | Where it lands |
| --- | --- | --- |
| Soil | `soil-reader` explores your repo | `specs/active/hello-slugify/explore.md` |
| Roots | `root-gardener` writes requirements | `specs/active/hello-slugify/requirements.md` |
| Trunk | `trunk-shaper` writes design | `specs/active/hello-slugify/design.md` |
| Branches | `branch-pruner` writes tasks | `specs/active/hello-slugify/tasks.md` |
| (gate) | **You** approve the specs | status → `spec_ready` then `growing` |
| Fruit | `fruit-grower` implements task-by-task | code + `progress/impl_hello-slugify.md` |
| Ripening | `ripeness-checker` runs validators | `progress/verify_hello-slugify.md` |
| Harvest | `harvest-inspector` reviews quality | `progress/harvest_hello-slugify.md` |

After Harvest PASS, status moves to `done`.

### Hard rules during the flow

- **Specs before code.** If the orchestrator tries to skip to Fruit, push back.
- **You approve, agent does not self-approve.** The gate at `spec_ready` requires explicit human go.
- **Ripening is mechanical.** The validators are the source of truth, not the agent's opinion.
- **Harvest does not re-do Ripening.** Harvest is human-style code quality only.

---

## 5. Verify with validators (3 min)

At any point you can run the validators yourself:

```bash
# Coverage: every Rn covered by ≥1 task
node validator/check-traceability.mjs hello-slugify

# Shape: every spec file has its required sections
node validator/check-spec-shape.mjs hello-slugify

# Health: harness drift, missing files, status mismatch
node validator/doctor.mjs
```

If any reports FAIL, fix the underlying spec or feature_list, do not "fix" the validator.

---

## 6. Archive when you are done (1 min)

A feature in `done` stays in `specs/active/<feature>/` until you archive it. When you no longer need it visible:

```bash
mv specs/active/hello-slugify specs/archive/hello-slugify
```

Then update `feature_list.json` and `state.yaml` to `status: archived`.

---

## 7. Plant a change against an existing feature (optional)

A "change" is a modification to a feature that is already `done` or `growing`. Add a new entry:

```json
{
  "id": "hello-slugify/add-unicode",
  "kind": "change",
  "targets": "hello-slugify",
  "status": "seed",
  "summary": "Extend slugify to handle Unicode accents."
}
```

The change folder lives at `specs/active/hello-slugify/changes/add-unicode/`. The flow goes through the same 8 phases but the change's `requirements.md` uses delta syntax (ADD/MODIFY/REMOVE blocks).

When Harvest passes on a change:

```bash
node validator/apply-delta.mjs hello-slugify add-unicode
# review specs/active/hello-slugify/requirements.merged.md
# if happy: replace the base with the merged file
mv specs/active/hello-slugify/requirements.merged.md specs/active/hello-slugify/requirements.md
```

---

## What to read next

- `docs/example-walkthrough.md` — a complete example feature with every artifact shown in full.
- `docs/why-orange-grove.md` — why this exists and how it differs from other SDD harnesses.
- `templates/README.md` — the canonical shape of every artifact.
- `validator/README.md` — what each validator enforces.

That is the whole flow. Plant. Grow. Verify. Harvest. Repeat.
