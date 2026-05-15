#!/usr/bin/env node
// Orange Grove — Apply delta (preview).
// Produces a merged preview of base requirements with a change's ADD/MODIFY/REMOVE
// operations applied. Does NOT replace the base file — writes a sibling
// `.merged.md` for harvest-inspector review.
//
// Usage:
//   node validator/apply-delta.mjs <base> <change-id>
//   node validator/apply-delta.mjs <base>/<change-id>
//
// Output: writes specs/active/<base>/requirements.merged.md
//
// Exit: 0 success, 1 if base/delta missing or invalid, 2 invocation error.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ACTIVE = join(ROOT, 'specs', 'active');

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));

let base, changeId;
if (args.length === 1 && args[0].includes('/')) {
  [base, changeId] = args[0].split('/', 2);
} else if (args.length === 2) {
  [base, changeId] = args;
} else {
  console.error('Usage: node validator/apply-delta.mjs <base>/<change-id>');
  process.exit(2);
}

const baseReqPath = join(ACTIVE, base, 'requirements.md');
const deltaReqPath = join(ACTIVE, base, 'changes', changeId, 'requirements.md');
const outPath = join(ACTIVE, base, 'requirements.merged.md');

if (!existsSync(baseReqPath) || !existsSync(deltaReqPath)) {
  console.error('[ERROR] base or delta requirements not found.');
  process.exit(1);
}

const baseMd = readFileSync(baseReqPath, 'utf8');
const deltaMd = readFileSync(deltaReqPath, 'utf8');

const splitH2 = (md) => md.split(/(?=^##\s)/m).filter(s => s.startsWith('## '));

const parseBlocks = (md) => {
  const blocks = [];
  for (const chunk of splitH2(md)) {
    const m = chunk.match(/^##\s+(R\d+)\b/);
    if (m) blocks.push({ id: m[1], text: chunk.trim() });
  }
  return blocks;
};

const parseDeltaOps = (md) => {
  const ops = [];
  for (const chunk of splitH2(md)) {
    const m = chunk.match(/^##\s+(ADD|MODIFY|REMOVE)\s+(R\d+)\b[^\n]*\n([\s\S]*)/);
    if (m) ops.push({ op: m[1], id: m[2], body: m[3].trim() });
  }
  return ops;
};

const extractSubsection = (body, name) => {
  const padded = body + '\n### __END__\n';
  const re = new RegExp(`^###\\s+${name}\\s*\\n([\\s\\S]*?)(?=^###\\s)`, 'm');
  const m = padded.match(re);
  return m ? m[1].trim() : null;
};

const baseBlocks = parseBlocks(baseMd);
const ops = parseDeltaOps(deltaMd);

// Build map id -> text from base.
const merged = new Map(baseBlocks.map(b => [b.id, b.text]));

// Apply ops in order: ADD, MODIFY, REMOVE.
const summary = [];
for (const op of ops) {
  if (op.op === 'ADD') {
    if (merged.has(op.id)) {
      summary.push(`SKIPPED ADD ${op.id} (collision with base)`);
      continue;
    }
    // Reconstruct the block as `## Rn\n<body>`. The op body might contain WHEN/SHALL directly.
    merged.set(op.id, `## ${op.id}\n${op.body}`);
    summary.push(`ADDED ${op.id}`);
  } else if (op.op === 'MODIFY') {
    if (!merged.has(op.id)) {
      summary.push(`SKIPPED MODIFY ${op.id} (not in base)`);
      continue;
    }
    const after = extractSubsection(op.body, 'After');
    if (!after) {
      summary.push(`SKIPPED MODIFY ${op.id} (no After section)`);
      continue;
    }
    merged.set(op.id, `## ${op.id}\n${after}`);
    summary.push(`MODIFIED ${op.id}`);
  } else if (op.op === 'REMOVE') {
    if (!merged.has(op.id)) {
      summary.push(`SKIPPED REMOVE ${op.id} (not in base)`);
      continue;
    }
    merged.delete(op.id);
    summary.push(`REMOVED ${op.id}`);
  }
}

// Preserve any non-Rn content (header, prose) from base, then append blocks in numeric order.
const baseHeader = baseMd.split(/^##\s+R\d+/m, 1)[0].trimEnd();
const sortedIds = [...merged.keys()].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const body = sortedIds.map(id => merged.get(id)).join('\n\n');

const banner = `<!-- AUTO-GENERATED PREVIEW from validator/apply-delta.mjs.
Base: ${baseReqPath}
Change: ${deltaReqPath}
Operations:
${summary.map(s => `- ${s}`).join('\n')}
Review this file. If approved, replace requirements.md with this content. -->`;

const output = `${banner}\n\n${baseHeader}\n\n${body}\n`;

writeFileSync(outPath, output);
console.log(`[OK] wrote ${outPath}`);
for (const s of summary) console.log(`     ${s}`);
process.exit(0);
