# Trunk delta — <change-id>

> Owner: `trunk-shaper`. Captures only what changes in design. Read together with the base `design.md`.

## What changes in the design

<short description of the structural shift relative to base>

## Decision (delta)

<technical decision for this change, referencing the new/modified Rn>

## Alternative considered

<what was rejected and the tradeoff that ruled it out>

## Test strategy (delta)

- ADD R<n> → unit test in `<file or module>`
- MODIFY R<n> → update existing test `<file>::<name>` to cover the new behavior
- REMOVE R<n> → delete or repurpose test that previously covered it

## Migration notes

<if the change requires data migration, breaking interface changes, or coordination, document it here. Otherwise: "None.">
