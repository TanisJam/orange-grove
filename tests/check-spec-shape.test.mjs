import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeFixture, cleanup, runValidator } from './_helpers.mjs';

const FULL_FEATURE = {
  'specs/active/foo/explore.md':
    '# Soil — foo\n\n## Codebase context\n- file:1\n\n## Constraints discovered\n- something\n\n## Open questions\n- Q1\n',
  'specs/active/foo/requirements.md':
    '# Roots — foo\n\n## R1\nWHEN x THE SYSTEM SHALL y\n',
  'specs/active/foo/design.md':
    '# Trunk — foo\n\n## Decision\nfoo\n\n## Alternative considered\nbar\n\n## Test strategy\n- R1 → test\n',
  'specs/active/foo/tasks.md':
    '- [ ] T1 — do (covers R1)\n',
};

test('check-spec-shape: PASS when every required section is present', () => {
  const dir = makeFixture(FULL_FEATURE);
  try {
    const r = runValidator('check-spec-shape', ['foo'], dir);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /\[PASS\] foo/);
  } finally {
    cleanup(dir);
  }
});

test('check-spec-shape: FAIL when design.md is missing a required section', () => {
  const broken = {
    ...FULL_FEATURE,
    'specs/active/foo/design.md':
      '# Trunk\n\n## Decision\nfoo\n', // missing Alternative considered + Test strategy
  };
  const dir = makeFixture(broken);
  try {
    const r = runValidator('check-spec-shape', ['foo'], dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /missing section: ## Alternative considered/);
    assert.match(r.stdout, /missing section: ## Test strategy/);
  } finally {
    cleanup(dir);
  }
});

test('check-spec-shape: FAIL when requirements.md has no Rn', () => {
  const broken = {
    ...FULL_FEATURE,
    'specs/active/foo/requirements.md': '# Roots\n\nempty prose only\n',
  };
  const dir = makeFixture(broken);
  try {
    const r = runValidator('check-spec-shape', ['foo'], dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /missing at least one ## Rn requirement/);
  } finally {
    cleanup(dir);
  }
});

test('check-spec-shape: FAIL when tasks.md has no Tn checkbox', () => {
  const broken = {
    ...FULL_FEATURE,
    'specs/active/foo/tasks.md': '# Branches\n\nno tasks here\n',
  };
  const dir = makeFixture(broken);
  try {
    const r = runValidator('check-spec-shape', ['foo'], dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /missing at least one - \[ \] Tn task line/);
  } finally {
    cleanup(dir);
  }
});

test('check-spec-shape: reports MISSING when a file is absent', () => {
  const broken = { ...FULL_FEATURE };
  delete broken['specs/active/foo/explore.md'];
  const dir = makeFixture(broken);
  try {
    const r = runValidator('check-spec-shape', ['foo'], dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /\[MISSING\] explore\.md/);
  } finally {
    cleanup(dir);
  }
});
