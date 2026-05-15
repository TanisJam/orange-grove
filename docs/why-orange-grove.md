# Why Orange Grove

A short read on what Orange Grove is, what it is not, and why I made it.

## The core idea

**Tools change. Processes are fundamental.**

The AI coding tool you use today (Claude Code, opencode, Cursor, Codex) will probably be different in a year. The reasoning behind Spec Driven Development — concepts before code, traceability from intent to verification, human approval at the right gates — does not change.

Orange Grove is a personal SDD harness designed so that **you carry the process with you**, not the tool. The same 8 phases, the same 8 agents, the same artifacts, no matter which AI tool sits underneath.

## What Orange Grove is

- **Mine.** It is a personal product, written to fit how I think about software, with a citrus metaphor I happen to like. If you fork it, you are expected to make it yours too.
- **Lightweight.** Pure markdown specs, JSON for state, YAML for parseable state, zero-dependency Node validators. No npm install, no Docker, no SaaS. Read the code in an afternoon.
- **Portable.** A `core/` of artifacts plus `adapters/` per tool. One install script copies what each tool needs. Move between Claude Code and opencode without re-learning anything.
- **Opinionated.** No implementation before approved specs. No human review before mechanical verification. The agent that verifies cannot edit code. The agent that reviews cannot edit code. These are non-negotiable.
- **Teaches the process.** Every phase has a name, an owner, and a single deliverable. You finish the first feature and the entire SDD flow is in your head, not in a tool's UI.

## What Orange Grove is not

- **A framework for teams of 50.** It is built for one developer working with AI assistants. Teams can use it, but it is not designed around concurrent feature ownership, code review queues, or CI integrations.
- **A replacement for your IDE or AI tool.** Orange Grove rides on top of whatever you already use. Agents live in your tool's native format (`.claude/agents/`, `.opencode/agents/`, etc.).
- **A code generator.** It generates *specs*, not code. The `fruit-grower` agent writes code, but only after the human has approved a spec.
- **Battle-tested.** This is a personal project. Use it because it fits how you want to work, not because it has 10k stars and an enterprise SLA.

## Comparison with other SDD harnesses

| Concern | Orange Grove | Heavier SDD systems |
| --- | --- | --- |
| Setup cost | one `install.sh`, < 30s | dependency install, configuration files |
| Source of truth | markdown + JSON on disk | sometimes proprietary state |
| State persistence | survives compaction, git-trackable | sometimes ephemeral |
| Tool coupling | adapter layer, portable | usually tied to one tool |
| Phases | 8, fixed | often 5 or fewer, sometimes dynamic |
| Mechanical verification | required (`ripeness-checker` + validators) | usually optional |
| Delta specs | first-class (`changes/` folder + ADD/MODIFY/REMOVE syntax) | often missing, you edit base specs |
| Footprint | ~30 markdown files + 5 Node scripts | varies |

If you need more, take Orange Grove as a starting point and grow it. If you need less, delete what you do not use. That is the point of owning the harness.

## Why citrus

The metaphor is not for cute. It tracks the order operations: you cannot harvest fruit without growing it. You cannot grow fruit without branches. You cannot grow branches without a trunk. You cannot have a trunk without roots. You cannot have roots without soil. The metaphor enforces the dependency chain at a vocabulary level.

When someone says "let us just write some code real quick" you can answer with "there are no roots yet". That is a real benefit.

And: it is mine. The orange is on my profile, my products, my logo. Orange Grove is the natural home for an SDD harness named after my brand.

## When to use Orange Grove

- You work alone (or in a small team) with AI coding assistants.
- You have been burned by AI generating wrong code because the spec was unclear.
- You want a forcing function for "specs before code".
- You move between AI tools and you do not want to re-learn the process each time.
- You want to *understand* SDD, not just consume an SDD product.

## When not to use Orange Grove

- You have a working SDD process that fits your team and you are happy with it.
- You ship features in 30 minutes each and the overhead of specs is bigger than the feature.
- You hate citrus.

## Closing

You should understand every line of this harness. If anything in `core/`, `adapters/`, or `validator/` feels like a black box, that is a documentation bug — open an issue, or read the source, because it is only ~30 markdown files and ~5 Node scripts.

That is the whole point: own your process, not just consume one.
