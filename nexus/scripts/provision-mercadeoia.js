#!/usr/bin/env node
/**
 * Provision the mercadeoia workspace inside Nexus so Apollo-13 can operate
 * without the operator's Windows PC path.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { resolveFromRoot } from '../src/utils/paths.js';

const dest = resolveFromRoot('workspaces', 'mercadeoia');
fs.mkdirSync(dest, { recursive: true });

const repoRoot = resolveFromRoot('..');
const branches = [
  'origin/cursor/import-dashboard-411d',
  'origin/cursor/master-blueprint-v1-411d',
];

function tryCheckoutSparse() {
  for (const branch of branches) {
    const probe = spawnSync('git', ['ls-tree', '-r', '--name-only', branch, 'supply-intelligence'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    if (probe.status !== 0 || !probe.stdout.trim()) continue;

    const files = probe.stdout.trim().split('\n').filter(Boolean);
    for (const file of files) {
      const show = spawnSync('git', ['show', `${branch}:${file}`], {
        cwd: repoRoot,
        encoding: 'buffer',
        maxBuffer: 20 * 1024 * 1024,
      });
      if (show.status !== 0) continue;
      const outFile = path.join(dest, file.replace(/^supply-intelligence\/?/, '') || 'README.md');
      // Keep under supply-intelligence subfolder for clarity
      const target = path.join(dest, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, show.stdout);
    }

    // Also copy blueprint docs if present
    const docs = spawnSync('git', ['ls-tree', '-r', '--name-only', branch, 'docs'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    if (docs.status === 0) {
      for (const file of docs.stdout.trim().split('\n').filter(Boolean)) {
        const show = spawnSync('git', ['show', `${branch}:${file}`], {
          cwd: repoRoot,
          encoding: 'buffer',
          maxBuffer: 5 * 1024 * 1024,
        });
        if (show.status !== 0) continue;
        const target = path.join(dest, file);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, show.stdout);
      }
    }

    return { branch, files: files.length };
  }
  return null;
}

const result = tryCheckoutSparse();
if (!result) {
  fs.writeFileSync(
    path.join(dest, 'README.md'),
    '# mercadeoia (Apollo-13 provisioned stub)\n\nWorkspace created because upstream branch content was unavailable.\n',
  );
  console.log(`[provision] stub workspace at ${dest}`);
} else {
  fs.writeFileSync(
    path.join(dest, 'APOLLO13.md'),
    [
      '# Apollo-13 workspace',
      '',
      `Provisioned from \`${result.branch}\` without operator PC access.`,
      `Files mirrored: ${result.files}`,
      `At: ${new Date().toISOString()}`,
      '',
    ].join('\n'),
  );
  console.log(`[provision] mirrored ${result.files} files from ${result.branch} → ${dest}`);
}

console.log(`[provision] ready: ${dest}`);
