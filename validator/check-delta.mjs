#!/usr/bin/env node
// Orange Grove — Delta validator.
// Validates a change's delta requirements against the base feature's requirements:
// - ADD Rn must use a number higher than every Rn in the base.
// - MODIFY Rn must reference an existing Rn in the base; its "Before" block must
//   match the base block verbatim (whitespace-normalized).
// - REMOVE Rn must reference an existing Rn in the base; its "Was" block must
//   match the base block verbatim.
//
// Usage:
//   node validator/check-delta.mjs <base>/<change-id>          # by composite id
//   node validator/check-delta.mjs <base> <change-id>          # by parts
//   node validator/check-delta.mjs <base>/<change-id> --json
//
// Exit: 0 PASS, 1 FAIL, 2 invocation error.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ACTIVE = join(ROOT, 'specs', 'active');

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const json = process.argv.includes('--json');

let base, changeId;
if (args.length === 1 && args[0].includes('/')) {
  [base, changeId] = args[0].split('/', 2);
} else if (args.length === 2) {
  [base, changeId] = args;
} else {
  console.error('Usage: node validator/check-delta.mjs <base>/<change-id> [--json]');
  process.exit(2);
}

const baseReqPath = join(ACTIVE, base, 'requirements.md');
const deltaReqPath = join(ACTIVE, base, 'changes', changeId, 'requirements.md');

if (!existsSync(baseReqPath)) {
  console.error(`[ERROR] base requirements not found: ${baseReqPath}`);
  process.exit(2);
}
if (!existsSync(deltaReqPath)) {
  console.error(`[ERROR] delta requirements not found: ${deltaReqPath}`);
  process.exit(2);
}

const baseMd = readFileSync(baseReqPath, 'utf8');
const deltaMd = readFileSync(deltaReqPath, 'utf8');

// Split markdown into chunks at every H2 boundary. Each chunk starts with `## `.
const splitH2 = (md) => md.split(/(?=^##\s)/m).filter(s => s.startsWith('## '));

// Parse base: map Rn -> body text (everything after the heading line).
const parseBaseRequirements = (md) => {
  const map = new Map();
  for (const chunk of splitH2(md)) {
    const m = chunk.match(/^##\s+(R\d+)\b[^\n]*\n([\s\S]*)/);
    if (m) map.set(m[1], m[2].trim());
  }
  return map;
};

// Parse delta blocks. Each H2 is `ADD Rn`, `MODIFY Rn`, or `REMOVE Rn`.
const parseDeltaBlocks = (md) => {
  const blocks = [];
  for (const chunk of splitH2(md)) {
    const m = chunk.match(/^##\s+(ADD|MODIFY|REMOVE)\s+(R\d+)\b[^\n]*\n([\s\S]*)/);
    if (m) blocks.push({ op: m[1], id: m[2], body: m[3] });
  }
  return blocks;
};

// Extract the H3 subsection content from a block body.
const extractSubsection = (body, name) => {
  // Use a sentinel by appending a final marker to make end-of-body terminator predictable.
  const padded = body + '\n### __END__\n';
  const re = new RegExp(`^###\\s+${name}\\s*\\n([\\s\\S]*?)(?=^###\\s)`, 'm');
  const m = padded.match(re);
  return m ? m[1].trim() : null;
};

const normalize = (s) => s.replace(/\s+/g, ' ').trim();

const baseReqs = parseBaseRequirements(baseMd);
const baseHighest = [...baseReqs.keys()].reduce(
  (max, id) => Math.max(max, Number(id.slice(1))), 0
);

const blocks = parseDeltaBlocks(deltaMd);
const failures = [];

if (blocks.length === 0) {
  failures.push({ kind: 'no-blocks', msg: 'delta requirements has no ADD/MODIFY/REMOVE blocks' });
}

const usedIds = new Set();
for (const b of blocks) {
  if (usedIds.has(b.id)) {
    failures.push({ kind: 'duplicate', op: b.op, id: b.id, msg: `${b.id} appears in more than one block` });
  }
  usedIds.add(b.id);

  if (b.op === 'ADD') {
    if (baseReqs.has(b.id)) {
      failures.push({ kind: 'add-collision', id: b.id, msg: `ADD ${b.id} collides with existing base requirement` });
    }
    const n = Number(b.id.slice(1));
    if (n <= baseHighest) {
      failures.push({ kind: 'add-not-higher', id: b.id, msg: `ADD ${b.id} must be higher than base's highest R${baseHighest}` });
    }
  }

  if (b.op === 'MODIFY') {
    if (!baseReqs.has(b.id)) {
      failures.push({ kind: 'modify-missing-base', id: b.id, msg: `MODIFY ${b.id} not found in base requirements` });
      continue;
    }
    const before = extractSubsection(b.body, 'Before');
    const after = extractSubsection(b.body, 'After');
    if (!before) failures.push({ kind: 'modify-no-before', id: b.id, msg: `MODIFY ${b.id} missing ### Before section` });
    if (!after) failures.push({ kind: 'modify-no-after', id: b.id, msg: `MODIFY ${b.id} missing ### After section` });
    if (before && normalize(before) !== normalize(baseReqs.get(b.id))) {
      failures.push({ kind: 'modify-before-mismatch', id: b.id, msg: `MODIFY ${b.id} "Before" block does not match base verbatim` });
    }
  }

  if (b.op === 'REMOVE') {
    if (!baseReqs.has(b.id)) {
      failures.push({ kind: 'remove-missing-base', id: b.id, msg: `REMOVE ${b.id} not found in base requirements` });
      continue;
    }
    const was = extractSubsection(b.body, 'Was');
    if (!was) failures.push({ kind: 'remove-no-was', id: b.id, msg: `REMOVE ${b.id} missing ### Was section` });
    if (was && normalize(was) !== normalize(baseReqs.get(b.id))) {
      failures.push({ kind: 'remove-was-mismatch', id: b.id, msg: `REMOVE ${b.id} "Was" block does not match base verbatim` });
    }
  }
}

const result = {
  base,
  change: changeId,
  base_highest_rn: `R${baseHighest}`,
  blocks: blocks.map(b => ({ op: b.op, id: b.id })),
  status: failures.length === 0 ? 'PASS' : 'FAIL',
  failures,
};

if (json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  const tag = result.status === 'PASS' ? '[PASS]' : '[FAIL]';
  console.log(`${tag} ${base}/${changeId} — ${blocks.length} block(s), base highest ${result.base_highest_rn}`);
  for (const b of blocks) console.log(`  ${b.op} ${b.id}`);
  if (failures.length) {
    console.log('');
    for (const f of failures) console.log(`  [FAIL] ${f.msg}`);
  }
}

process.exit(failures.length > 0 ? 1 : 0);
