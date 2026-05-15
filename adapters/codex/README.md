# Orange SDD — Codex adapter (STUB)

Status: not yet implemented.

## How to extend

To add a Codex adapter, create `adapters/codex/manifest.json` modelled on the existing adapters with:

- `tool`: `"codex"`
- `agentDir`: the directory Codex reads for agent prompts in the target project (research current Codex conventions).
- `agentExtension`: usually `.md`.
- `skillDir`: where Codex looks for skills, if applicable.
- `agents`: per-agent frontmatter the installer should emit. If Codex has no frontmatter system, leave it minimal and rely on the prompt body.

Then update `core/installer.mjs` if Codex needs a frontmatter renderer not already supported, and add this README's contents to track what differs.

Pull requests welcome.
