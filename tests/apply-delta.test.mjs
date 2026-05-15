import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeFixture, cleanup, runValidator, readFile } from './_helpers.mjs';

const BASE = `# Roots — auth

## R1
WHEN a user submits valid credentials
THE SYSTEM SHALL issue a session token

## R2
WHEN the token is invalid
THE SYSTEM SHALL return 401

## R3
WHEN a user logs out
THE SYSTEM SHALL invalidate the token
`;

test('apply-delta: writes a merged preview with ADD applied', () => {
  const dir = makeFixture({
    'specs/active/auth/requirements.md': BASE,
    'specs/active/auth/changes/c/requirements.md': `## ADD R4
WHEN MFA is enabled
THE SYSTEM SHALL require TOTP
`,
  });
  try {
    const r = runValidator('apply-delta', ['auth/c'], dir);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    const merged = readFile(dir, 'specs/active/auth/requirements.merged.md');
    assert.match(merged, /AUTO-GENERATED PREVIEW/);
    assert.match(merged, /## R1/);
    assert.match(merged, /## R2/);
    assert.match(merged, /## R3/);
    assert.match(merged, /## R4/);
    assert.match(merged, /WHEN MFA is enabled/);
  } finally {
    cleanup(dir);
  }
});

test('apply-delta: MODIFY replaces only the After block', () => {
  const dir = makeFixture({
    'specs/active/auth/requirements.md': BASE,
    'specs/active/auth/changes/c/requirements.md': `## MODIFY R1
### Before
WHEN a user submits valid credentials
THE SYSTEM SHALL issue a session token
### After
WHEN a user submits valid credentials AND MFA is satisfied
THE SYSTEM SHALL issue a session token
### Reason
MFA integration.
`,
  });
  try {
    const r = runValidator('apply-delta', ['auth/c'], dir);
    assert.equal(r.status, 0);
    const merged = readFile(dir, 'specs/active/auth/requirements.merged.md');
    assert.match(merged, /AND MFA is satisfied/);
    // R1 body should NOT contain the "Before" wording verbatim alone
    assert.doesNotMatch(merged, /### Before/);
  } finally {
    cleanup(dir);
  }
});

test('apply-delta: REMOVE drops the Rn from output', () => {
  const dir = makeFixture({
    'specs/active/auth/requirements.md': BASE,
    'specs/active/auth/changes/c/requirements.md': `## REMOVE R3
### Was
WHEN a user logs out
THE SYSTEM SHALL invalidate the token
### Reason
Moved out.
`,
  });
  try {
    const r = runValidator('apply-delta', ['auth/c'], dir);
    assert.equal(r.status, 0);
    const merged = readFile(dir, 'specs/active/auth/requirements.merged.md');
    assert.doesNotMatch(merged, /^## R3\b/m);
    assert.match(merged, /## R1/);
    assert.match(merged, /## R2/);
  } finally {
    cleanup(dir);
  }
});

test('apply-delta: requirements are sorted numerically in output', () => {
  const dir = makeFixture({
    'specs/active/auth/requirements.md': BASE,
    'specs/active/auth/changes/c/requirements.md': `## ADD R10
WHEN x THE SYSTEM SHALL y

## ADD R4
WHEN a THE SYSTEM SHALL b
`,
  });
  try {
    const r = runValidator('apply-delta', ['auth/c'], dir);
    assert.equal(r.status, 0);
    const merged = readFile(dir, 'specs/active/auth/requirements.merged.md');
    const order = [...merged.matchAll(/^## (R\d+)/gm)].map(m => m[1]);
    assert.deepEqual(order, ['R1', 'R2', 'R3', 'R4', 'R10']);
  } finally {
    cleanup(dir);
  }
});
