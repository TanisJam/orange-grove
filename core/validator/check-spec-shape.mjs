#!/usr/bin/env node
// Orange Grove — Spec shape validator.
// Verifies each spec file matches the required sections from templates/.
//
// Usage:
//   node validator/check-spec-shape.mjs                # all active features
//   node validator/check-spec-shape.mjs <feature-id>   # single feature
//   node validator/check-spec-shape.mjs --json
//
// Exit: 0 PASS, 1 FAIL.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ACTIVE = join(ROOT, 'specs', 'active');

// Required H2 sections per spec file.
const SHAPE = {
  'explore.md': {
    required: ['Codebase context', 'Constraints discovered', 'Open questions'],
    minLines: 5,
  },
  'requirements.md': {
    // At least one Rn heading must exist (validated separately).
    required: [],
    requireRnHeading: true,
    minLines: 3,
  },
  'design.md': {
    required: ['Decision', 'Alternative considered', 'Test strategy'],
    minLines: 5,
  },
  'tasks.md': {
    // At least one task checkbox line.
    required: [],
    requireTaskLine: true,
    minLines: 1,
  },
};

const extractH2Headings = (md) => {
  const re = /^##\s+(.+?)\s*$/gm;
  const headings = [];
  let m;
  while ((m = re.exec(md))) headings.push(m[1].trim());
  return headings;
};

const hasRnHeading = (md) => /^##\s+R\d+\b/m.test(md);
const hasTaskLine = (md) => /^-\s*\[[ x]\]\s*T\d+/im.test(md);

const checkFile = (featureId, fileName) => {
  const path = join(ACTIVE, featureId, fileName);
  if (!existsSync(path)) {
    return { file: fileName, status: 'MISSING', missing: [] };
  }
  const md = readFileSync(path, 'utf8');
  const lines = md.trim().split('\n').filter(l => l.trim()).length;
  const shape = SHAPE[fileName];
  const missing = [];

  if (lines < shape.minLines) missing.push(`(too short: ${lines} non-empty lines)`);

  const headings = extractH2Headings(md);
  for (const required of shape.required) {
    // Match by case-insensitive prefix to tolerate small wording differences.
    const found = headings.some(h => h.toLowerCase().startsWith(required.toLowerCase()));
    if (!found) missing.push(`missing section: ## ${required}`);
  }

  if (shape.requireRnHeading && !hasRnHeading(md)) {
    missing.push('missing at least one ## Rn requirement');
  }
  if (shape.requireTaskLine && !hasTaskLine(md)) {
    missing.push('missing at least one - [ ] Tn task line');
  }

  return {
    file: fileName,
    status: missing.length === 0 ? 'PASS' : 'FAIL',
    missing,
  };
};

const checkFeature = (id) => {
  const dir = join(ACTIVE, id);
  if (!existsSync(dir)) {
    return { id, status: 'SKIP', reason: 'feature folder missing', files: [] };
  }
  const files = Object.keys(SHAPE).map(f => checkFile(id, f));
  const failedFiles = files.filter(f => f.status !== 'PASS');
  return {
    id,
    status: failedFiles.length === 0 ? 'PASS' : 'FAIL',
    files,
  };
};

const args = process.argv.slice(2);
const json = args.includes('--json');
const targets = args.filter(a => !a.startsWith('--'));

if (!existsSync(ACTIVE)) {
  console.error(`[ERROR] ${ACTIVE} does not exist. Run from repo root.`);
  process.exit(2);
}

const features = targets.length > 0
  ? targets
  : readdirSync(ACTIVE).filter(f => {
      const p = join(ACTIVE, f);
      return statSync(p).isDirectory() && !f.startsWith('.');
    });

if (features.length === 0) {
  if (json) console.log('[]');
  else console.log('[INFO] No active features to check.');
  process.exit(0);
}

const results = features.map(checkFeature);
const failed = results.filter(r => r.status === 'FAIL');

if (json) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const r of results) {
    const tag = r.status === 'PASS' ? '[PASS]' : r.status === 'FAIL' ? '[FAIL]' : '[SKIP]';
    console.log(`${tag} ${r.id}${r.reason ? ` — ${r.reason}` : ''}`);
    for (const f of r.files || []) {
      if (f.status === 'PASS') continue;
      console.log(`  ${f.status === 'MISSING' ? '[MISSING]' : '[FAIL]'} ${f.file}`);
      for (const issue of f.missing) console.log(`    - ${issue}`);
    }
  }
  console.log('');
  console.log(`Summary: ${results.length - failed.length}/${results.length} PASS`);
}

process.exit(failed.length > 0 ? 1 : 0);
