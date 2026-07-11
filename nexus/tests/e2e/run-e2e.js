#!/usr/bin/env node
/**
 * End-to-end verification:
 * - control plane health
 * - executor preflight
 * - real task against a mercadeoia-like workspace
 * - cursor-agent disabled failover
 * - confirm /v1/prompt stays fast (no Cloudflare 524 risk)
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRuntime, stopNexus } from '../../src/runtime.js';
import { TaskStatus } from '../../src/control-plane/states.js';
import { resolveFromRoot } from '../../src/utils/paths.js';

const results = [];

function record(name, ok, detail = {}) {
  results.push({ name, ok, ...detail });
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${name}${detail.message ? ` — ${detail.message}` : ''}`);
}

async function main() {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-e2e-data-'));
  // Prefer real mercadeoia path if present (Windows host / mounted), else simulate
  const candidates = [
    process.env.NEXUS_E2E_WORKSPACE,
    resolveFromRoot('workspaces', 'mercadeoia'),
    'C:\\\\Users\\\\Diva\\\\Desktop\\\\mercadeoia',
    '/mnt/c/Users/Diva/Desktop/mercadeoia',
    resolveFromRoot('..', 'mercadeoia'),
  ].filter(Boolean);

  let workspace = candidates.find((p) => {
    try { return fs.existsSync(p); } catch { return false; }
  });
  if (!workspace) {
    workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'mercadeoia-sim-'));
    fs.writeFileSync(path.join(workspace, 'README.md'), '# mercadeoia (simulated workspace for Nexus e2e)\n');
    console.log(`[e2e] mercadeoia path not found; using simulated workspace ${workspace}`);
  } else {
    console.log(`[e2e] using workspace ${workspace}`);
  }

  process.env.NEXUS_DISABLE_CURSOR_AGENT = '1';
  process.env.NEXUS_WORKER_UNREF = '1';

  const runtime = await createRuntime({
    dataDir,
    recoveryToken: 'e2e-token',
    worker: {
      pollIntervalMs: 40,
      maxConcurrent: 2,
      waitingExecutorTimeoutMs: 250,
      taskHardTimeoutMs: 15_000,
    },
  });
  await runtime.worker.start();
  await new Promise((resolve, reject) => {
    runtime.server.once('error', reject);
    runtime.server.listen(0, '127.0.0.1', resolve);
  });
  const port = runtime.server.address().port;
  const base = `http://127.0.0.1:${port}`;

  // 1) Health
  {
    const res = await fetch(`${base}/v1/health`);
    const body = await res.json();
    record('control-plane-health', res.status === 200 && body.ok === true, {
      status: res.status,
      workerRunning: body.workerRunning,
    });
  }

  // 2) Preflight
  {
    const res = await fetch(`${base}/v1/executors/preflight`);
    const body = await res.json();
    record('executor-preflight', res.status === 200 && body.failoverReady === true, {
      cursorAgent: body.cursorAgent?.ok,
      localShell: body.localShell?.ok,
      note: body.note,
    });
  }

  // 3) Fast /v1/prompt (no long request)
  let taskId;
  {
    const started = Date.now();
    const res = await fetch(`${base}/v1/prompt`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Summarize the workspace structure for mercadeoia supply intelligence.',
        workspace,
      }),
    });
    const elapsed = Date.now() - started;
    const body = await res.json();
    taskId = body.taskId;
    record('prompt-202-fast', res.status === 202 && body.status === 'QUEUED' && elapsed < 1000, {
      status: res.status,
      elapsedMs: elapsed,
      taskId,
      message: elapsed < 1000 ? `responded in ${elapsed}ms` : `TOO SLOW ${elapsed}ms (524 risk)`,
    });
  }

  // 4) Task completes via failover (cursor disabled)
  {
    let final = null;
    for (let i = 0; i < 100; i++) {
      await new Promise((r) => setTimeout(r, 50));
      const body = await fetch(`${base}/v1/tasks/${taskId}`).then((r) => r.json());
      if ([TaskStatus.SUCCEEDED, TaskStatus.FAILED].includes(body.task.status)) {
        final = body.task;
        break;
      }
    }
    const ok = final?.status === TaskStatus.SUCCEEDED && final?.executorId === 'executor.local-shell';
    record('failover-task-success', ok, {
      status: final?.status,
      executorId: final?.executorId,
      error: final?.error,
    });
  }

  // 5) Recovery: requeue-waiting
  {
    const stuck = runtime.taskStore.create({ prompt: ' artificially stuck', workspace });
    runtime.taskStore.update(stuck.id, {
      status: TaskStatus.WAITING_EXECUTOR,
      waitingExecutorSince: new Date().toISOString(),
    });
    const res = await fetch(`${base}/v1/recovery`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-nexus-recovery-token': 'e2e-token',
      },
      body: JSON.stringify({ action: 'requeue-waiting' }),
    });
    const body = await res.json();
    record('recovery-requeue-waiting', res.status === 200 && body.ok === true, {
      result: body.result?.result,
    });
  }

  // 6) repair-executor + rollback
  {
    const repair = await fetch(`${base}/v1/recovery`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-nexus-recovery-token': 'e2e-token',
      },
      body: JSON.stringify({ action: 'repair-executor', executorId: 'executor.local-shell' }),
    });
    const repairBody = await repair.json();
    const rollback = await fetch(`${base}/v1/recovery`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-nexus-recovery-token': 'e2e-token',
      },
      body: JSON.stringify({ action: 'rollback-last-repair' }),
    });
    const rollbackBody = await rollback.json();
    record('recovery-repair-and-rollback', repair.status === 200 && rollback.status === 200 && rollbackBody.result?.result?.rolledBack === true, {
      repairOk: repairBody.ok,
      rolledBack: rollbackBody.result?.result?.rolledBack,
    });
  }

  // 7) Confirm no WAITING_EXECUTOR left behind after worker cycles
  {
    await new Promise((r) => setTimeout(r, 400));
    const waiting = runtime.taskStore.listByStatus(TaskStatus.WAITING_EXECUTOR);
    record('no-stuck-waiting-executor', waiting.length === 0, {
      waiting: waiting.map((t) => t.id),
    });
  }

  await stopNexus(runtime);
  delete process.env.NEXUS_DISABLE_CURSOR_AGENT;
  delete process.env.NEXUS_WORKER_UNREF;

  const failed = results.filter((r) => !r.ok);
  const outPath = path.join(dataDir, 'e2e-results.json');
  fs.writeFileSync(outPath, `${JSON.stringify({ results, failed: failed.length }, null, 2)}\n`);
  console.log(`\n[e2e] ${results.length - failed.length}/${results.length} passed`);
  console.log(`[e2e] results: ${outPath}`);
  if (failed.length) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
