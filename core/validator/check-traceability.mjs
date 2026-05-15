#!/usr/bin/env node
// Orange Grove — Traceability validator.
// Verifies every Rn in requirements.md is covered by at least one task,
// and that every "(covers Rn)" in tasks.md references an existing Rn.
//
// Usage:
//   node validator/check-traceability.mjs                # all active features
//   node validator/check-traceability.mjs <feature-id>   # single feature
//   node validator/check-traceability.mjs --json         # machine output
//
// Exit: 0 PASS, 1 FAIL.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ACTIVE = join(ROOT, 'specs', 'active');

const parseRequirements = (md) => {
  const re = /^##\s+(R\d+)\b/gm;
  const ids = new Set();
  let m;
  while ((m = re.exec(md))) ids.add(m[1]);
  return ids;
};

const parseTaskCoverage = (md) => {
  // Matches: - [ ] T1 — anything (covers R1, R2)
  const taskRe = /^-\s*\[[ x]\]\s*(T\d+)[^(\n]*\(covers\s+([^)]+)\)/gim;
  const coverage = new Map(); // Rn -> Set<Tn>
  let m;
  while ((m = taskRe.exec(md))) {
    const tid = m[1];
    const rns = m[2].split(',').map(s => s.trim()).filter(Boolean);
    for (const rn of rns) {
      if (!/^R\d+$/.test(rn)) continue;
      if (!coverage.has(rn)) coverage.set(rn, new Set());
      coverage.get(rn).add(tid);
    }
  }
  return coverage;
};

const checkFeature = (id) => {
  const dir = join(ACTIVE, id);
  if (!existsSync(dir)) {
    return { id, status: 'SKIP', reason: 'feature folder missing in specs/active' };
  }
  const reqPath = join(dir, 'requirements.md');
  const taskPath = join(dir, 'tasks.md');

  if (!existsSync(reqPath)) return { id, status: 'SKIP', reason: 'requirements.md missing' };
  if (!existsSync(taskPath)) return { id, status: 'SKIP', reason: 'tasks.md missing' };

  const requirements = parseRequirements(readFileSync(reqPath, 'utf8'));
  const coverage = parseTaskCoverage(readFileSync(taskPath, 'utf8'));

  const uncovered = [];
  for (const rn of requirements) {
    if (!coverage.has(rn) || coverage.get(rn).size === 0) uncovered.push(rn);
  }
  const orphanRefs = [];
  for (const rn of coverage.keys()) {
    if (!requirements.has(rn)) orphanRefs.push(rn);
  }

  return {
    id,
    status: uncovered.length === 0 && orphanRefs.length === 0 ? 'PASS' : 'FAIL',
    requirements: [...requirements].sort(),
    coverage: Object.fromEntries(
      [...coverage].map(([k, v]) => [k, [...v].sort()])
    ),
    uncovered,
    orphanRefs,
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
    if (r.status === 'FAIL') {
      if (r.uncovered.length) {
        console.log(`  uncovered requirements: ${r.uncovered.join(', ')}`);
      }
      if (r.orphanRefs.length) {
        console.log(`  task refs to nonexistent Rn: ${r.orphanRefs.join(', ')}`);
      }
    }
  }
  console.log('');
  console.log(`Summary: ${results.length - failed.length}/${results.length} PASS`);
}

process.exit(failed.length > 0 ? 1 : 0);
