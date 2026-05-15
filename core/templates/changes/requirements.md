# Roots delta — <change-id>

> Owner: `root-gardener`. Each block declares an operation against the base requirements. The numbering `R<n>` follows the base feature — do NOT renumber.

## ADD R<n>

WHEN <trigger>
THE SYSTEM SHALL <behavior>

> Use ADD for brand-new requirements. Pick the next free `Rn` after the base's highest.

## MODIFY R<n>

### Before
WHEN <old trigger>
THE SYSTEM SHALL <old behavior>

### After
WHEN <new trigger>
THE SYSTEM SHALL <new behavior>

### Reason
<why this requirement is changing>

> Use MODIFY when an existing Rn changes shape. The `Before` block must match the base verbatim.

## REMOVE R<n>

### Was
WHEN <old trigger>
THE SYSTEM SHALL <old behavior>

### Reason
<why this requirement no longer applies — e.g., superseded by R<m>>

> Use REMOVE when an existing Rn is fully obsolete. The `Was` block must match the base verbatim.
