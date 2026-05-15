import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeFixture, cleanup, runValidator } from './_helpers.mjs';

test('check-traceability: PASS when every Rn is covered', () => {
  const dir = makeFixture({
    'specs/active/foo/requirements.md':
      '# Roots — foo\n\n## R1\nWHEN x THE SYSTEM SHALL y\n\n## R2\nWHEN a THE SYSTEM SHALL b\n',
    'specs/active/foo/tasks.md':
      '# Branches — foo\n\n- [ ] T1 — do thing (covers R1)\n- [ ] T2 — do other (covers R2)\n',
  });
  try {
    const r = runValidator('check-traceability', ['foo'], dir);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /\[PASS\] foo/);
  } finally {
    cleanup(dir);
  }
});

test('check-traceability: FAIL when an Rn is uncovered', () => {
  const dir = makeFixture({
    'specs/active/foo/requirements.md':
      '## R1\nWHEN x\n\n## R2\nWHEN y\n\n## R3\nWHEN z\n',
    'specs/active/foo/tasks.md':
      '- [ ] T1 — covers (covers R1)\n- [ ] T2 — covers (covers R2)\n',
  });
  try {
    const r = runValidator('check-traceability', ['foo'], dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /\[FAIL\] foo/);
    assert.match(r.stdout, /uncovered requirements:.*R3/);
  } finally {
    cleanup(dir);
  }
});

test('check-traceability: FAIL on orphan task reference', () => {
  const dir = makeFixture({
    'specs/active/foo/requirements.md': '## R1\nWHEN x\n',
    'specs/active/foo/tasks.md':
      '- [ ] T1 — covers (covers R1)\n- [ ] T2 — orphan (covers R99)\n',
  });
  try {
    const r = runValidator('check-traceability', ['foo'], dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /task refs to nonexistent Rn:.*R99/);
  } finally {
    cleanup(dir);
  }
});

test('check-traceability: SKIP when requirements.md missing', () => {
  const dir = makeFixture({
    'specs/active/foo/tasks.md': '- [ ] T1 — (covers R1)\n',
  });
  try {
    const r = runValidator('check-traceability', ['foo'], dir);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /\[SKIP\] foo.*requirements\.md missing/);
  } finally {
    cleanup(dir);
  }
});

test('check-traceability: --json produces parseable output', () => {
  const dir = makeFixture({
    'specs/active/foo/requirements.md': '## R1\nWHEN x\n',
    'specs/active/foo/tasks.md': '- [ ] T1 — (covers R1)\n',
  });
  try {
    const r = runValidator('check-traceability', ['foo', '--json'], dir);
    assert.equal(r.status, 0);
    const parsed = JSON.parse(r.stdout);
    assert.equal(parsed[0].status, 'PASS');
    assert.deepEqual(parsed[0].requirements, ['R1']);
  } finally {
    cleanup(dir);
  }
});
