#!/usr/bin/env node
/**
 * Apollo-13 boot: provision workspace, recover stuck tasks, start control plane.
 * No operator PC and no Cursor Agent required.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startNexus } from '../src/runtime.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nexusRoot = path.resolve(__dirname, '..');

console.log('[apollo13] provisioning mercadeoia workspace…');
const prov = spawnSync(process.execPath, [path.join(__dirname, 'provision-mercadeoia.js')], {
  cwd: nexusRoot,
  stdio: 'inherit',
  env: process.env,
});
if (prov.status !== 0) {
  console.error('[apollo13] provision failed');
  process.exit(prov.status || 1);
}

process.env.NEXUS_DISABLE_CURSOR_AGENT = process.env.NEXUS_DISABLE_CURSOR_AGENT || '1';

const runtime = await startNexus({
  mode: 'apollo13',
  host: process.env.NEXUS_HOST || '0.0.0.0',
  port: process.env.NEXUS_PORT ? Number(process.env.NEXUS_PORT) : 8787,
});

async function shutdown(signal) {
  console.info(`[apollo13] shutting down (${signal})`);
  const { stopNexus } = await import('../src/runtime.js');
  await stopNexus(runtime);
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Self-check after boot
setTimeout(async () => {
  try {
    const health = await fetch(`${runtime.baseUrl}/v1/health`).then((r) => r.json());
    console.info(`[apollo13] self-check ok=${health.ok} mode=${health.mode} waiting=${health.tasks?.waitingExecutor}`);
  } catch (err) {
    console.error('[apollo13] self-check failed', err.message);
  }
}, 300);
