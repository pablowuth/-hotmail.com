import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { resolveCursorAgentLauncher } from '../src/launcher/windows-cursor-agent.js';

test('launcher prefers agent.cmd with shell:true on win32', async () => {
  const result = await resolveCursorAgentLauncher({
    platform: 'win32',
    env: {},
    whichFn: async (name) => (name === 'agent.cmd' ? 'C:\\Tools\\agent.cmd' : null),
    existsFn: () => false,
    probeFn: async ({ command, shell }) => {
      assert.equal(command, 'C:\\Tools\\agent.cmd');
      assert.equal(shell, true);
      return { ok: true, stdout: '0.1.0' };
    },
  });
  assert.equal(result.ok, true);
  assert.equal(result.kind, 'agent.cmd');
  assert.equal(result.shell, true);
});

test('launcher falls back to PATH then versioned node.exe+index.js', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-agent-'));
  const versionDir = path.join(root, 'versions', '2026.07.10-abc');
  fs.mkdirSync(versionDir, { recursive: true });
  const nodeExe = path.join(versionDir, 'node.exe');
  const indexJs = path.join(versionDir, 'index.js');
  fs.writeFileSync(nodeExe, '');
  fs.writeFileSync(indexJs, '');

  // Broken hardcoded-style sibling without files should be skipped
  const broken = path.join(root, 'versions', '2026.07.09-a3815c0');
  fs.mkdirSync(broken, { recursive: true });

  const result = await resolveCursorAgentLauncher({
    platform: 'win32',
    env: { NEXUS_DISABLE_CURSOR_AGENT: '' },
    searchRoots: [root],
    whichFn: async () => null,
    existsFn: (p) => fs.existsSync(p),
    readdirFn: (p) => fs.readdirSync(p, { withFileTypes: true }),
    probeFn: async ({ command, args }) => {
      if (command === nodeExe && args[0] === indexJs) {
        return { ok: true, stdout: 'ok' };
      }
      return { ok: false, error: 'nope' };
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.kind, 'versioned');
  assert.equal(result.command, nodeExe);
  assert.deepEqual(result.argsPrefix, [indexJs]);
  assert.equal(result.shell, false);
});

test('launcher respects NEXUS_DISABLE_CURSOR_AGENT', async () => {
  const result = await resolveCursorAgentLauncher({
    platform: 'win32',
    env: { NEXUS_DISABLE_CURSOR_AGENT: '1' },
    whichFn: async () => 'C:\\agent.cmd',
    existsFn: () => true,
    probeFn: async () => ({ ok: true }),
  });
  assert.equal(result.ok, false);
  assert.match(result.reason, /disabled/i);
});

test('launcher never returns broken version without node.exe+index.js', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-agent-'));
  const broken = path.join(root, 'versions', '2026.07.09-a3815c0');
  fs.mkdirSync(broken, { recursive: true });
  // only a placeholder file, no node.exe / index.js
  fs.writeFileSync(path.join(broken, 'README.txt'), 'broken');

  const result = await resolveCursorAgentLauncher({
    platform: 'win32',
    env: {},
    searchRoots: [root],
    whichFn: async () => null,
    existsFn: (p) => fs.existsSync(p),
    readdirFn: (p) => fs.readdirSync(p, { withFileTypes: true }),
    probeFn: async () => ({ ok: true }),
  });
  assert.equal(result.ok, false);
  assert.ok(result.candidates.some((c) => c.kind === 'versioned' && c.hasNode === false));
});
