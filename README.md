# Orange Grove

A personal, portable Spec Driven Development harness with a citrus metaphor and a hard rule: **no se cosecha fruta sin raíces** — no implementation before approved specs, no harvest before mechanical verification.

> Tools change. Processes are fundamental. Orange Grove makes the process portable.

## TL;DR

- 8 phases (Seed → Soil → Roots → Trunk → Branches → Fruit → Ripening → Harvest), 8 specialist agents with clear boundaries.
- Pure markdown specs, JSON state, YAML parseable state. Zero npm dependencies anywhere.
- Same harness in opencode, Claude Code, Cursor, or Codex via per-tool adapters.
- Dependency-free Node validators enforce `Rn → Tn → evidence` traceability and delta correctness.
- Delta specs (`changes/` folder with ADD/MODIFY/REMOVE syntax) for modifying existing features.

## What you read next

| If you want to... | Read |
| --- | --- |
| ...install and harvest your first feature in 30 minutes | [`docs/onboarding.md`](docs/onboarding.md) |
| ...see every artifact filled in for a small feature | [`docs/example-walkthrough.md`](docs/example-walkthrough.md) |
| ...understand why Orange Grove exists vs other SDD harnesses | [`docs/why-orange-grove.md`](docs/why-orange-grove.md) |
| ...read the canonical artifact shapes | [`templates/README.md`](templates/README.md) |
| ...understand the validators | [`validator/README.md`](validator/README.md) |
| ...track version history | [`CHANGELOG.md`](CHANGELOG.md) |

## Supported adapters

| Tool | Status | Notes |
| --- | --- | --- |
| opencode | full | Reference implementation |
| Claude Code | full | Read-only agents enforced via `tools:` restriction |
| Cursor | stub | Installs as `.cursor/rules/*.mdc`; no per-agent permissions |
| Codex | stub | Pattern documented; PRs welcome |

## Install

Two ways, same install.sh underneath.

### Option A — Remote one-liner (no clone needed)

```bash
# Install into the current directory
curl -sSL https://raw.githubusercontent.com/TanisJam/orange-grove/main/bootstrap.sh \
  | bash -s -- --tool claude-code

# Install into a specific target
curl -sSL https://raw.githubusercontent.com/TanisJam/orange-grove/main/bootstrap.sh \
  | bash -s -- --tool opencode --target ~/myapp

# Pin a release tag
ORANGE_GROVE_REF=v0.3.0 curl -sSL .../bootstrap.sh | bash -s -- --tool claude-code
```

The bootstrap clones the repo shallow to a temp dir, runs `install.sh`, and removes the temp clone. Requires `git` and Node.js ≥ 18.

> **Security note.** `curl | bash` runs remote code blindly. Before piping, you can inspect: `curl -sSL .../bootstrap.sh | less`. For production projects, prefer Option B and pin a tag.

### Option B — Local clone (best for repeated installs / updates)

```bash
# Clone once
git clone --depth 1 https://github.com/TanisJam/orange-grove ~/.orange-grove

# Install into a project (run from anywhere)
~/.orange-grove/install.sh --tool claude-code --target ~/myapp

# Auto-detect tool from current dir
cd ~/myapp && ~/.orange-grove/install.sh

# Update later
cd ~/.orange-grove && git pull
```

### Option C — From inside a clone

```bash
cd orange-grove
./install.sh --tool opencode --target /path/to/your/project
./install.sh                                                  # current dir + auto-detect
./install.sh --tool claude-code --target ~/myapp --dry-run    # preview
./install.sh --tool opencode --target . --force               # overwrite state files
```

### Requirements

- Node.js ≥ 18 (validators and installer are pure ES modules, zero dependencies).
- `git` for Options A and B.
- A target project that uses one of the supported adapters (`opencode`, `claude-code`, `cursor`, `codex`).

## What the install does

| Layer | Target | Behavior |
| --- | --- | --- |
| Agents | tool-native (e.g. `.opencode/agents/`) | always refreshed |
| Skill | tool-native skill dir | always refreshed |
| Templates | `templates/` | always refreshed |
| Validator | `validator/` | always refreshed |
| Docs | `AGENTS.md`, `CHECKPOINTS.md`, `docs/orange-grove.md` | always refreshed |
| State | `feature_list.json`, `progress/state.yaml`, `progress/current.md`, `progress/history.md` | **never overwritten** (use `--force` to override) |
| Directories | `specs/active/`, `specs/archive/` | created if missing |

## Repo layout

```
orange-grove/
├── core/                       ← source of truth (edit here)
│   ├── agents/                 ← agent prompts (body-only, no frontmatter)
│   ├── skill/SKILL.md
│   ├── templates/              ← canonical artifact shapes
│   ├── validator/              ← dependency-free Node validators
│   ├── docs/                   ← AGENTS.md.tpl, CHECKPOINTS.md, orange-grove.md
│   ├── state/                  ← empty initial state for fresh installs
│   ├── manifest.json           ← canonical agent registry + install plan
│   └── installer.mjs           ← assembly logic
├── adapters/
│   ├── opencode/               ← opencode frontmatter spec
│   ├── claude-code/            ← Claude Code frontmatter spec
│   ├── cursor/                 ← Cursor rules stub
│   └── codex/                  ← Codex stub
├── install.sh                  ← entry point
└── (installed instance below — output of install.sh against itself)
├── .opencode/                  ← this repo's own opencode install
├── feature_list.json
├── progress/
├── specs/
├── templates/
└── validator/
```

This repo is its own installed instance. Editing under `core/` and re-running `./install.sh --tool opencode --target .` regenerates the agent files at the root.

## The 8 phases

| Phase | Agent | Output |
| --- | --- | --- |
| Seed | (human) | entry in `feature_list.json` |
| Soil | `soil-reader` | `specs/active/<f>/explore.md` |
| Roots | `root-gardener` | `specs/active/<f>/requirements.md` |
| Trunk | `trunk-shaper` | `specs/active/<f>/design.md` |
| Branches | `branch-pruner` | `specs/active/<f>/tasks.md` |
| Fruit | `fruit-grower` | code + `progress/impl_<f>.md` |
| Ripening | `ripeness-checker` | `progress/verify_<f>.md` (mechanical) |
| Harvest | `harvest-inspector` | `progress/harvest_<f>.md` (human review) |

## Hard rules

- No implementation before `spec_ready` and explicit human approval.
- No human review before mechanical verification passes (`RIPE`).
- `ripeness-checker` and `harvest-inspector` cannot edit code.
- Progress lives on disk, not only in chat.

## License

Apache-2.0.
