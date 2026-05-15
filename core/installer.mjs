#!/usr/bin/env node
// Orange Grove — Installer.
// Assembles agent files from core/ bodies + adapter frontmatter, then copies
// skill, templates, validator, docs, and initial state into the target project.
//
// Usage (from inside the orange-sdd repo):
//   node core/installer.mjs --tool <tool> --target <path> [--force]
//
// Tools: opencode | claude-code | cursor | codex
//
// Behavior:
// - Agents and skill: always (re)installed.
// - State files (feature_list.json, state.yaml, current.md, history.md): NEVER overwritten if present.
// - Templates, validator, docs: refreshed.
// - Specs directories created if missing; never touched if present.

import {
  readFileSync, writeFileSync, mkdirSync,
  existsSync, readdirSync, statSync, copyFileSync, rmSync,
} from 'node:fs';
import { join, dirname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(__filename), '..');

const args = process.argv.slice(2);
const getFlag = (name) => {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return null;
  return args[i + 1];
};
const hasFlag = (name) => args.includes(`--${name}`);

const tool = getFlag('tool');
const target = resolve(getFlag('target') || '.');
const force = hasFlag('force');
const dryRun = hasFlag('dry-run');

if (!tool) {
  console.error('Error: --tool <opencode|claude-code|cursor|codex> required.');
  process.exit(2);
}

const adapterDir = join(REPO_ROOT, 'adapters', tool);
const adapterManifestPath = join(adapterDir, 'manifest.json');
if (!existsSync(adapterManifestPath)) {
  console.error(`Error: adapter "${tool}" not found at ${adapterManifestPath}`);
  process.exit(2);
}

const coreManifest = JSON.parse(readFileSync(join(REPO_ROOT, 'core', 'manifest.json'), 'utf8'));
const adapterManifest = JSON.parse(readFileSync(adapterManifestPath, 'utf8'));

const log = (level, msg) => {
  const tag = { INFO: '[INFO]', WRITE: '[WRITE]', SKIP: '[SKIP]', WARN: '[WARN]' }[level] || `[${level}]`;
  console.log(`${tag} ${msg}`);
};

const ensureDir = (p) => {
  if (dryRun) return;
  mkdirSync(p, { recursive: true });
};

const writeFile = (path, content, { overwrite = 'always' } = {}) => {
  if (existsSync(path) && overwrite === 'never' && !force) {
    log('SKIP', `${path} (exists, overwrite=never)`);
    return;
  }
  if (dryRun) {
    log('WRITE', `${path} (dry-run)`);
    return;
  }
  ensureDir(dirname(path));
  writeFileSync(path, content);
  log('WRITE', path);
};

const copyTree = (src, dst, { overwrite = 'always' } = {}) => {
  if (!existsSync(src)) {
    log('WARN', `source missing: ${src}`);
    return;
  }
  const s = statSync(src);
  if (s.isDirectory()) {
    ensureDir(dst);
    for (const entry of readdirSync(src)) {
      if (entry.startsWith('.')) continue;
      copyTree(join(src, entry), join(dst, entry), { overwrite });
    }
  } else {
    if (existsSync(dst) && overwrite === 'never' && !force) {
      log('SKIP', `${dst} (exists, overwrite=never)`);
      return;
    }
    if (dryRun) {
      log('WRITE', `${dst} (dry-run)`);
      return;
    }
    ensureDir(dirname(dst));
    copyFileSync(src, dst);
    log('WRITE', dst);
  }
};

// --- Frontmatter renderers per tool ----------------------------------------

const yamlValue = (v) => {
  if (Array.isArray(v)) return `[${v.map(x => JSON.stringify(x)).join(', ')}]`;
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object') return null; // handled separately
  return String(v);
};

const renderOpencodeFrontmatter = (agentMeta, agentConfig) => {
  const lines = ['---'];
  lines.push(`description: ${agentMeta.description}`);
  lines.push(`mode: ${agentConfig.mode}`);
  if (agentConfig.permission) {
    lines.push('permission:');
    for (const [k, v] of Object.entries(agentConfig.permission)) {
      lines.push(`  ${k}: ${v}`);
    }
  }
  lines.push('---', '');
  return lines.join('\n');
};

const renderClaudeCodeFrontmatter = (agentMeta, agentConfig) => {
  const lines = ['---'];
  lines.push(`name: ${agentMeta.name}`);
  lines.push(`description: ${agentMeta.description}`);
  if (agentConfig.tools) lines.push(`tools: ${agentConfig.tools.join(', ')}`);
  if (agentConfig.model) lines.push(`model: ${agentConfig.model}`);
  lines.push('---', '');
  return lines.join('\n');
};

const renderCursorFrontmatter = (agentMeta, agentConfig) => {
  const lines = ['---'];
  lines.push(`description: ${agentMeta.description}`);
  if (agentConfig.globs && agentConfig.globs.length) {
    lines.push('globs:');
    for (const g of agentConfig.globs) lines.push(`  - ${g}`);
  } else {
    lines.push('globs: []');
  }
  lines.push(`alwaysApply: ${agentConfig.alwaysApply ?? false}`);
  lines.push('---', '');
  return lines.join('\n');
};

const renderCodexFrontmatter = (agentMeta) => {
  // Codex stub: minimal description-only frontmatter.
  return `---\nname: ${agentMeta.name}\ndescription: ${agentMeta.description}\n---\n\n`;
};

const renderers = {
  opencode: renderOpencodeFrontmatter,
  'claude-code': renderClaudeCodeFrontmatter,
  cursor: renderCursorFrontmatter,
  codex: renderCodexFrontmatter,
};

const renderer = renderers[tool];
if (!renderer) {
  console.error(`Error: no frontmatter renderer for tool "${tool}".`);
  process.exit(2);
}

// --- Install ---------------------------------------------------------------

log('INFO', `Installing Orange Grove into ${target} using ${tool} adapter${dryRun ? ' (dry-run)' : ''}.`);

// 1. Agents
const agentDir = join(target, adapterManifest.agentDir);
for (const agent of coreManifest.agents) {
  const bodyPath = join(REPO_ROOT, 'core', 'agents', `${agent.name}.md`);
  if (!existsSync(bodyPath)) {
    log('WARN', `core agent body missing: ${bodyPath}`);
    continue;
  }
  const body = readFileSync(bodyPath, 'utf8');
  const config = adapterManifest.agents[agent.name] || {};
  const frontmatter = renderer(agent, config);
  const outPath = join(agentDir, `${agent.name}${adapterManifest.agentExtension}`);
  writeFile(outPath, frontmatter + body);
}

// 2. Skill
const skillSource = join(REPO_ROOT, coreManifest.skill.source);
const skillTargetDir = join(target, adapterManifest.skillDir);
const skillExt = tool === 'cursor' ? '.mdc' : '.md';
const skillTargetFile = join(skillTargetDir, `SKILL${skillExt}`);
writeFile(skillTargetFile, readFileSync(skillSource, 'utf8'));

// 3. Shared templates / validator
copyTree(
  join(REPO_ROOT, coreManifest.shared.templates.source),
  join(target, coreManifest.shared.templates.target),
);
copyTree(
  join(REPO_ROOT, coreManifest.shared.validator.source),
  join(target, coreManifest.shared.validator.target),
);

// 4. Shared docs (always refresh)
for (const doc of coreManifest.shared.docs) {
  const src = join(REPO_ROOT, doc.source);
  const dst = join(target, doc.target);
  writeFile(dst, readFileSync(src, 'utf8'));
}

// 5. Initial state (never overwrite)
for (const s of coreManifest.shared.state) {
  const src = join(REPO_ROOT, s.source);
  const dst = join(target, s.target);
  writeFile(dst, readFileSync(src, 'utf8'), { overwrite: s.overwrite || 'always' });
}

// 6. Required directories
for (const dir of coreManifest.shared.directories) {
  const dst = join(target, dir);
  if (!existsSync(dst)) {
    ensureDir(dst);
    if (!dryRun) writeFileSync(join(dst, '.gitkeep'), '');
    log('WRITE', `${dst}/ (created)`);
  } else {
    log('SKIP', `${dst} (exists)`);
  }
}

// 7. Adapter extras
for (const extra of adapterManifest.extraFiles || []) {
  const src = join(REPO_ROOT, extra.source);
  const dst = join(target, extra.target);
  if (existsSync(dst) && extra.overwrite === 'never' && !force) {
    log('SKIP', `${dst} (exists, overwrite=never)`);
    continue;
  }
  writeFile(dst, readFileSync(src, 'utf8'));
}

log('INFO', 'Install complete.');
log('INFO', `Next: run "node validator/doctor.mjs" from ${target} to verify health.`);
