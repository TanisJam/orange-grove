# Change templates

Delta specs for modifying an EXISTING feature without losing the base spec. A change is a small, focused modification (add a requirement, tweak a behavior, drop a deprecated feature).

## When to use a change vs a new feature

| Situation | Use |
| --- | --- |
| New behavior unrelated to existing features | new feature |
| Modify behavior of an existing feature | change |
| Extend an existing feature with new requirements | change |
| Deprecate part of an existing feature | change |
| Trivial typo or fix in the spec | edit the base directly |

## Layout

```
specs/active/<base-feature>/
├── requirements.md         ← base spec (untouched while change is open)
├── design.md
├── tasks.md
└── changes/
    └── <change-id>/
        ├── intent.md       ← why this change targets <base-feature>
        ├── requirements.md ← ADD/MODIFY/REMOVE blocks against the base
        ├── design.md       ← delta to base design
        └── tasks.md        ← tasks for the change only
```

## Feature_list entry

```json
{
  "id": "<base-feature>/<change-id>",
  "kind": "change",
  "targets": "<base-feature>",
  "status": "seed"
}
```

## Lifecycle

The change goes through the same 8 phases as a regular feature. Once Harvest passes:

1. `validator/apply-delta.mjs <base-feature> <change-id>` produces merged previews.
2. `harvest-inspector` reviews the previews.
3. On approval, the previews replace the base files and the change is marked `done`.
4. `harvest-inspector` may also archive the change folder under `specs/active/<base-feature>/changes/.archive/<change-id>/` for audit.

## Delta syntax

See `requirements.md` template in this folder. Three operations: `ADD Rn`, `MODIFY Rn`, `REMOVE Rn`. The `Before`/`Was` blocks must match the base verbatim or the validator fails.
