import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeFixture, cleanup, runValidator } from './_helpers.mjs';

// Build a minimal-but-complete harness fixture for doctor.
const baseHarness = (extras = {}) => ({
  'feature_list.json': JSON.stringify({
    schema_version: 2,
    features: [],
    statuses: [
      'seed', 'exploring', 'rooting', 'shaping', 'pruning',
      'spec_ready', 'growing', 'ripening', 'harvest_ready',
      'done', 'archived',
    ],
    kinds: ['feature', 'change'],
    rules: {},
  }, null, 2),
  'progress/state.yaml':
    'schema_version: 1\nactive_feature: null\nfeatures: {}\n',
  'templates/explore.md': '# x\n',
  'templates/requirements.md': '# x\n',
  'templates/design.md': '# x\n',
  'templates/tasks.md': '# x\n',
  'templates/impl.md': '# x\n',
  'templates/verify.md': '# x\n',
  'templates/harvest.md': '# x\n',
  'AGENTS.md': 'x',
  'CHECKPOINTS.md': 'x',
  'docs/orange-grove.md': 'x',
  'specs/active/.gitkeep': '',
  'specs/archive/.gitkeep': '',
  // opencode adapter with all 8 agents.
  '.opencode/agents/orange-grove.md': '---\nmode: primary\n---\nbody',
  '.opencode/agents/soil-reader.md': '---\nmode: subagent\n---\nbody',
  '.opencode/agents/root-gardener.md': '---\nmode: subagent\n---\nbody',
  '.opencode/agents/trunk-shaper.md': '---\nmode: subagent\n---\nbody',
  '.opencode/agents/branch-pruner.md': '---\nmode: subagent\n---\nbody',
  '.opencode/agents/fruit-grower.md': '---\nmode: subagent\n---\nbody',
  '.opencode/agents/ripeness-checker.md': '---\nmode: subagent\n---\nbody',
  '.opencode/agents/harvest-inspector.md': '---\nmode: subagent\n---\nbody',
  ...extras,
});

test('doctor: HEALTHY on a complete harness', () => {
  const dir = makeFixture(baseHarness());
  try {
    const r = runValidator('doctor', [], dir);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /\[HEALTHY\]/);
  } finally {
    cleanup(dir);
  }
});

test('doctor: FAIL when an agent file is missing', () => {
  const broken = baseHarness();
  delete broken['.opencode/agents/orange-grove.md'];
  const dir = makeFixture(broken);
  try {
    const r = runValidator('doctor', [], dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /\.opencode\/agents\/orange-grove\.md missing/);
  } finally {
    cleanup(dir);
  }
});

test('doctor: FAIL when a feature status references missing folder', () => {
  const featureList = {
    schema_version: 2,
    features: [{ id: 'ghost', status: 'growing', kind: 'feature' }],
    statuses: [
      'seed', 'exploring', 'rooting', 'shaping', 'pruning',
      'spec_ready', 'growing', 'ripening', 'harvest_ready',
      'done', 'archived',
    ],
    kinds: ['feature', 'change'],
    rules: {},
  };
  const broken = baseHarness({
    'feature_list.json': JSON.stringify(featureList, null, 2),
  });
  const dir = makeFixture(broken);
  try {
    const r = runValidator('doctor', [], dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /ghost.*no folder at specs\/active\/ghost/);
  } finally {
    cleanup(dir);
  }
});

test('doctor: FAIL when a change has no targets field', () => {
  const featureList = {
    schema_version: 2,
    features: [{ id: 'base/c', status: 'seed', kind: 'change' }],
    statuses: [
      'seed', 'exploring', 'rooting', 'shaping', 'pruning',
      'spec_ready', 'growing', 'ripening', 'harvest_ready',
      'done', 'archived',
    ],
    kinds: ['feature', 'change'],
    rules: {},
  };
  const broken = baseHarness({
    'feature_list.json': JSON.stringify(featureList, null, 2),
  });
  const dir = makeFixture(broken);
  try {
    const r = runValidator('doctor', [], dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /has kind=change but no "targets" field/);
  } finally {
    cleanup(dir);
  }
});

test('doctor: --json output is parseable and reports issues', () => {
  const broken = baseHarness();
  delete broken['.opencode/agents/orange-grove.md'];
  const dir = makeFixture(broken);
  try {
    const r = runValidator('doctor', ['--json'], dir);
    assert.equal(r.status, 1);
    const parsed = JSON.parse(r.stdout);
    assert.equal(parsed.status, 'UNHEALTHY');
    const fails = parsed.issues.filter(i => i.level === 'FAIL');
    assert.ok(fails.some(f => f.msg.includes('orange-grove.md missing')));
  } finally {
    cleanup(dir);
  }
});
