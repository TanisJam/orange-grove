// Test helpers for Orange Grove validators.
// Zero-deps: uses node:fs, node:os, node:child_process.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
export const REPO_ROOT = resolve(dirname(__filename), '..');

export const VALIDATOR = (name) =>
  join(REPO_ROOT, 'core', 'validator', `${name}.mjs`);

// Create a temp dir and write the given files. Paths are relative to the temp dir.
// Returns the temp dir path. Always returns absolute paths.
export const makeFixture = (files = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'orange-grove-test-'));
  for (const [relPath, content] of Object.entries(files)) {
    const fullPath = join(dir, relPath);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, content);
  }
  return dir;
};

export const cleanup = (dir) => {
  rmSync(dir, { recursive: true, force: true });
};

// Run a validator from the validator/ directory with the given args, in the given cwd.
// Returns { status, stdout, stderr }.
export const runValidator = (name, args = [], cwd) => {
  const result = spawnSync('node', [VALIDATOR(name), ...args], {
    cwd,
    encoding: 'utf8',
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
};

export const readFile = (cwd, relPath) =>
  readFileSync(join(cwd, relPath), 'utf8');
