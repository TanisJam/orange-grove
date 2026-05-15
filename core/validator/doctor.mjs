#!/usr/bin/env node
// Orange Grove — Harness doctor.
// Validates harness health: feature_list.json + state.yaml + folder/agent layout drift.
//
// Usage:
//   node validator/doctor.mjs           # human output
//   node validator/doctor.mjs --json    # machine output
//
// Exit: 0 healthy, 1 issues found.
//
// Note: state.yaml is parsed with a minimal regex reader limited to the controlled
// shape Orange Grove writes. A full YAML parser is intentionally avoided to keep
// the validator dependency-free.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const FEATURE_LIST = join(ROOT, 'feature_list.json');
const STATE = join(ROOT, 'progress', 'state.yaml');
const ACTIVE = join(ROOT, 'specs', 'active');
const ARCHIVE = join(ROOT, 'specs', 'archive');
const TEMPLATES = join(ROOT, 'templates');

// Adapter-aware agent directories. At least ONE must be installed.
const ADAPTER_DIRS = [
  { tool: 'opencode', dir: '.opencode/agents', ext: '.md' },
  { tool: 'claude-code', dir: '.claude/agents', ext: '.md' },
  { tool: 'cursor', dir: '.cursor/rules', ext: '.mdc' },
  { tool: 'codex', dir: '.codex/agents', ext: '.md' },
];

const REQUIRED_TEMPLATES = [
  'explore.md', 'requirements.md', 'design.md',
  'tasks.md', 'impl.md', 'verify.md', 'harvest.md',
];

const AGENT_NAMES = [
  'orange-grove', 'soil-reader', 'root-gardener',
  'trunk-shaper', 'branch-pruner', 'fruit-grower',
  'ripeness-checker', 'harvest-inspector',
];

const ALLOWED_STATUSES = [
  'seed', 'exploring', 'rooting', 'shaping', 'pruning',
  'spec_ready', 'growing', 'ripening', 'harvest_ready',
  'done', 'archived',
];

const ACTIVE_FOLDER_STATUSES = new Set([
  'seed', 'exploring', 'rooting', 'shaping', 'pruning',
  'spec_ready', 'growing', 'ripening', 'harvest_ready', 'done',
]);

const issues = [];
const add = (level, msg) => issues.push({ level, msg });

// 1. feature_list.json valid + has features array.
let featureList = null;
if (!existsSync(FEATURE_LIST)) {
  add('FAIL', 'feature_list.json missing at repo root');
} else {
  try {
    featureList = JSON.parse(readFileSync(FEATURE_LIST, 'utf8'));
    if (!Array.isArray(featureList.features)) {
      add('FAIL', 'feature_list.json: features must be an array');
    }
  } catch (e) {
    add('FAIL', `feature_list.json invalid JSON: ${e.message}`);
  }
}

// 2. state.yaml exists and has expected top-level keys.
let stateActive = null;
const stateFeatureIds = new Set();
let stateRaw = '';
if (!existsSync(STATE)) {
  add('FAIL', 'progress/state.yaml missing');
} else {
  stateRaw = readFileSync(STATE, 'utf8');
  if (!/^schema_version:\s*\d+/m.test(stateRaw)) {
    add('FAIL', 'state.yaml missing schema_version');
  }
  const activeMatch = stateRaw.match(/^active_feature:\s*(\S+)/m);
  if (!activeMatch) add('FAIL', 'state.yaml missing active_feature');
  else stateActive = activeMatch[1] === 'null' ? null : activeMatch[1].replace(/^["']|["']$/g, '');

  // Extract feature ids under `features:` map.
  // Match lines like `  feature-name:` (2-space indent, ending in colon, no value).
  const featuresBlock = stateRaw.match(/^features:\s*(\{\}|$)([\s\S]*?)(?=^\w)/m);
  if (featuresBlock && featuresBlock[1] !== '{}') {
    const block = featuresBlock[2];
    const idRe = /^\s{2}([a-zA-Z0-9][a-zA-Z0-9_-]*):\s*$/gm;
    let m;
    while ((m = idRe.exec(block))) stateFeatureIds.add(m[1]);
  }
}

// 3. Cross-check feature_list and state.yaml ids agree.
if (featureList) {
  const listIds = new Set(featureList.features.map(f => f.id));
  for (const id of listIds) {
    if (!stateFeatureIds.has(id) && stateFeatureIds.size > 0) {
      add('WARN', `feature ${id} in feature_list.json but not in state.yaml`);
    }
  }
  for (const id of stateFeatureIds) {
    if (!listIds.has(id)) {
      add('WARN', `feature ${id} in state.yaml but not in feature_list.json`);
    }
  }

  // 4. Statuses are allowed.
  for (const f of featureList.features) {
    if (!ALLOWED_STATUSES.includes(f.status)) {
      add('FAIL', `feature ${f.id} has unknown status: ${f.status}`);
    }
  }

  // 5. Active-state features have a folder in specs/active.
  for (const f of featureList.features) {
    const kind = f.kind || 'feature';

    // Validate change-specific schema.
    if (kind === 'change') {
      if (!f.targets) {
        add('FAIL', `feature ${f.id} has kind=change but no "targets" field`);
        continue;
      }
      const baseFeature = featureList.features.find(x => x.id === f.targets);
      if (!baseFeature) {
        add('FAIL', `feature ${f.id} targets "${f.targets}" but base is not in feature_list.json`);
        continue;
      }
      if (!f.id.startsWith(`${f.targets}/`)) {
        add('WARN', `feature ${f.id} kind=change should have id format "<base>/<change-id>" (base=${f.targets})`);
      }
    }

    if (ACTIVE_FOLDER_STATUSES.has(f.status)) {
      let folder;
      if (kind === 'change') {
        const changeId = f.id.split('/').slice(1).join('/');
        folder = join(ACTIVE, f.targets, 'changes', changeId);
      } else {
        folder = join(ACTIVE, f.id);
      }
      if (!existsSync(folder)) {
        add('FAIL', `feature ${f.id} (kind=${kind}) has status ${f.status} but no folder at ${folder.replace(ROOT + '/', '')}`);
      }
    }
    if (f.status === 'archived') {
      const folder = kind === 'change'
        ? join(ARCHIVE, f.targets, 'changes', f.id.split('/').slice(1).join('/'))
        : join(ARCHIVE, f.id);
      if (!existsSync(folder)) {
        add('FAIL', `feature ${f.id} is archived but no folder at ${folder.replace(ROOT + '/', '')}`);
      }
    }
  }

  // 6. Active feature pointer in state.yaml is in feature_list.
  if (stateActive && !listIds.has(stateActive)) {
    add('FAIL', `state.yaml active_feature "${stateActive}" not in feature_list.json`);
  }
}

// 7. Required templates present.
if (!existsSync(TEMPLATES)) {
  add('FAIL', 'templates/ directory missing');
} else {
  for (const tpl of REQUIRED_TEMPLATES) {
    if (!existsSync(join(TEMPLATES, tpl))) add('FAIL', `templates/${tpl} missing`);
  }
}

// 8. Required agents present — check whichever adapter is installed.
const installedAdapters = ADAPTER_DIRS.filter(a => existsSync(join(ROOT, a.dir)));
if (installedAdapters.length === 0) {
  add('FAIL', 'no adapter installed — expected one of: ' + ADAPTER_DIRS.map(a => a.dir).join(', '));
} else {
  for (const adapter of installedAdapters) {
    const dirPath = join(ROOT, adapter.dir);
    for (const agent of AGENT_NAMES) {
      const file = `${agent}${adapter.ext}`;
      if (!existsSync(join(dirPath, file))) {
        add('FAIL', `${adapter.dir}/${file} missing (${adapter.tool} adapter)`);
      }
    }
    const present = readdirSync(dirPath).filter(f => f.endsWith(adapter.ext));
    for (const f of present) {
      const name = f.replace(adapter.ext, '');
      if (!AGENT_NAMES.includes(name)) {
        add('WARN', `unexpected agent file ${adapter.dir}/${f} (not in canonical roster)`);
      }
    }
  }
  if (installedAdapters.length > 1) {
    add('WARN', `multiple adapters installed (${installedAdapters.map(a => a.tool).join(', ')}) — agents may drift; consider keeping one source of truth`);
  }
}

// 9. Required top-level files.
for (const f of ['AGENTS.md', 'CHECKPOINTS.md', 'docs/orange-grove.md']) {
  if (!existsSync(join(ROOT, f))) add('FAIL', `${f} missing`);
}

// 10. specs/active and specs/archive directories exist.
if (!existsSync(ACTIVE)) add('FAIL', 'specs/active/ missing');
if (!existsSync(ARCHIVE)) add('FAIL', 'specs/archive/ missing');

// Output.
const json = process.argv.includes('--json');
const fails = issues.filter(i => i.level === 'FAIL');
const warns = issues.filter(i => i.level === 'WARN');

if (json) {
  console.log(JSON.stringify({ status: fails.length === 0 ? 'HEALTHY' : 'UNHEALTHY', issues }, null, 2));
} else {
  if (fails.length === 0 && warns.length === 0) {
    console.log('[HEALTHY] Orange Grove harness looks good.');
  } else {
    if (fails.length) {
      console.log(`[UNHEALTHY] ${fails.length} fail${fails.length > 1 ? 's' : ''}:`);
      for (const i of fails) console.log(`  [FAIL] ${i.msg}`);
    }
    if (warns.length) {
      console.log(`[NOTE] ${warns.length} warning${warns.length > 1 ? 's' : ''}:`);
      for (const i of warns) console.log(`  [WARN] ${i.msg}`);
    }
  }
}

process.exit(fails.length > 0 ? 1 : 0);
