#!/usr/bin/env node
/**
 * Live Apollo-13 verification against a running control plane (or boots one).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolveFromRoot } from '../src/utils/paths.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = process.env.NEXUS_BASE_URL || 'http://127.0.0.1:8787';
const token = process.env.NEXUS_RECOVERY_TOKEN || 'nexus-recovery-dev-token';
const workspace = resolveFromRoot('workspaces', 'mercadeoia');

const results = [];
function record(name, ok, detail = {}) {
  results.push({ name, ok, ...detail });
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${name}${detail.message ? ` — ${detail.message}` : ''}`);
}

async function waitForHealth(timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(`${baseUrl}/v1/health`);
      if (res.ok) return res.json();
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('control plane health timeout');
}

async function main() {
  // Ensure workspace exists
  const prov = spawn(process.execPath, [path.join(__dirname, 'provision-mercadeoia.js')], {
    stdio: 'inherit',
  });
  await new Promise((resolve, reject) => {
    prov.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('provision failed'))));
  });

  let health;
  try {
    health = await waitForHealth(3000);
  } catch {
    console.log('[live] control plane not up — starting apollo13…');
    const child = spawn(process.execPath, [path.join(__dirname, 'apollo13-start.js')], {
      cwd: resolveFromRoot('.'),
      env: {
        ...process.env,
        NEXUS_DISABLE_CURSOR_AGENT: '1',
        NEXUS_HOST: '0.0.0.0',
        NEXUS_PORT: '8787',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
    });
    child.unref();
    fs.writeFileSync(resolveFromRoot('data', 'apollo13.pid'), String(child.pid));
    health = await waitForHealth(20000);
  }

  record('health', health.ok === true && health.apollo13?.requiresOperatorPc === false, {
    mode: health.mode,
    message: `mode=${health.mode} cursorEnabled=${health.apollo13?.cursorEnabled}`,
  });

  const pre = await fetch(`${baseUrl}/v1/executors/preflight`).then((r) => r.json());
  record('preflight', pre.failoverReady === true || pre.localShell?.ok === true, {
    cursorAgent: pre.cursorAgent?.ok,
    localShell: pre.localShell?.ok,
  });

  const started = Date.now();
  const enqueue = await fetch(`${baseUrl}/v1/prompt`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Generá un resumen de la estructura de mercadeoia / supply-intelligence y escribí una nota de estado Apollo-13.',
      workspace,
    }),
  });
  const elapsed = Date.now() - started;
  const body = await enqueue.json();
  record('prompt-202', enqueue.status === 202 && elapsed < 1000, {
    status: enqueue.status,
    elapsedMs: elapsed,
    taskId: body.taskId,
    message: `${elapsed}ms`,
  });

  let final = null;
  for (let i = 0; i < 100; i++) {
    await new Promise((r) => setTimeout(r, 80));
    const t = await fetch(`${baseUrl}/v1/tasks/${body.taskId}`).then((r) => r.json());
    if (['SUCCEEDED', 'FAILED'].includes(t.task.status)) {
      final = t.task;
      break;
    }
  }
  record('task-succeeded-without-cursor', final?.status === 'SUCCEEDED' && final?.executorId !== 'executor.cursor-agent', {
    status: final?.status,
    executorId: final?.executorId,
  });

  const marker = path.join(workspace, '.nexus', `task-${body.taskId}.json`);
  record('workspace-artifact', fs.existsSync(marker), { marker });

  const recovery = await fetch(`${baseUrl}/v1/recovery`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-nexus-recovery-token': token,
    },
    body: JSON.stringify({ action: 'requeue-waiting' }),
  }).then((r) => r.json());
  record('recovery', recovery.ok === true);

  const after = await fetch(`${baseUrl}/v1/health`).then((r) => r.json());
  record('no-waiting-executor', (after.tasks?.waitingExecutor || 0) === 0, {
    waiting: after.tasks?.waitingExecutor,
  });

  const failed = results.filter((r) => !r.ok);
  const out = resolveFromRoot('data', 'apollo13-live-results.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify({ baseUrl, results, failed: failed.length }, null, 2)}\n`);
  console.log(`\n[live] ${results.length - failed.length}/${results.length} passed → ${out}`);
  if (failed.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
