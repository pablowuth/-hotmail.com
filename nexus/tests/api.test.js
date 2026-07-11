import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRuntime, stopNexus } from '../src/runtime.js';
import { TaskStatus } from '../src/control-plane/states.js';

async function listen(runtime) {
  await new Promise((resolve, reject) => {
    runtime.server.once('error', reject);
    runtime.server.listen(0, '127.0.0.1', resolve);
  });
  const addr = runtime.server.address();
  runtime.baseUrl = `http://127.0.0.1:${addr.port}`;
}

test('POST /v1/prompt returns 202 immediately without waiting for executors', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-api-'));
  process.env.NEXUS_DISABLE_CURSOR_AGENT = '1';
  const runtime = await createRuntime({
    dataDir,
    port: 0,
    recoveryToken: 'test-token',
    worker: { pollIntervalMs: 50, maxConcurrent: 1, waitingExecutorTimeoutMs: 200, taskHardTimeoutMs: 5000 },
  });
  // Do NOT start worker yet — proves HTTP does not wait on execution
  await listen(runtime);

  const started = Date.now();
  const res = await fetch(`${runtime.baseUrl}/v1/prompt`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt: 'hello async', workspace: dataDir }),
  });
  const elapsed = Date.now() - started;
  const body = await res.json();

  assert.equal(res.status, 202);
  assert.equal(body.status, TaskStatus.QUEUED);
  assert.ok(body.taskId);
  assert.ok(elapsed < 1000, `response took too long: ${elapsed}ms (Cloudflare 524 risk)`);

  await new Promise((r) => runtime.server.close(() => r()));
  delete process.env.NEXUS_DISABLE_CURSOR_AGENT;
});

test('recovery endpoint requires token and supports requeue-waiting', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-rec-'));
  const runtime = await createRuntime({
    dataDir,
    recoveryToken: 'secret',
    worker: { pollIntervalMs: 1000, maxConcurrent: 1, waitingExecutorTimeoutMs: 10_000, taskHardTimeoutMs: 5000 },
  });
  await listen(runtime);

  const task = runtime.taskStore.create({ prompt: 'recover me' });
  runtime.taskStore.update(task.id, {
    status: TaskStatus.WAITING_EXECUTOR,
    waitingExecutorSince: new Date().toISOString(),
  });

  const unauthorized = await fetch(`${runtime.baseUrl}/v1/recovery`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'requeue-waiting' }),
  });
  assert.equal(unauthorized.status, 401);

  const ok = await fetch(`${runtime.baseUrl}/v1/recovery`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-nexus-recovery-token': 'secret',
    },
    body: JSON.stringify({ action: 'requeue-waiting' }),
  });
  assert.equal(ok.status, 200);
  const body = await ok.json();
  assert.equal(body.ok, true);
  assert.equal(runtime.taskStore.get(task.id).status, TaskStatus.QUEUED);

  await new Promise((r) => runtime.server.close(() => r()));
});

test('failover: with cursor disabled, local-shell completes the task', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-fail-'));
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-ws-'));
  process.env.NEXUS_DISABLE_CURSOR_AGENT = '1';
  process.env.NEXUS_WORKER_UNREF = '1';

  const runtime = await createRuntime({
    dataDir,
    recoveryToken: 'secret',
    worker: { pollIntervalMs: 50, maxConcurrent: 2, waitingExecutorTimeoutMs: 300, taskHardTimeoutMs: 10_000 },
  });
  await runtime.worker.start();
  await listen(runtime);

  const health = await fetch(`${runtime.baseUrl}/v1/health`).then((r) => r.json());
  assert.equal(health.ok, true);

  const preflight = await fetch(`${runtime.baseUrl}/v1/executors/preflight`).then((r) => r.json());
  assert.equal(preflight.failoverReady, true);
  assert.equal(preflight.cursorAgent.ok, false);

  const enqueue = await fetch(`${runtime.baseUrl}/v1/prompt`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Inspect workspace and confirm Nexus failover works',
      workspace,
    }),
  });
  assert.equal(enqueue.status, 202);
  const { taskId } = await enqueue.json();

  let final = null;
  for (let i = 0; i < 80; i++) {
    await new Promise((r) => setTimeout(r, 50));
    const task = await fetch(`${runtime.baseUrl}/v1/tasks/${taskId}`).then((r) => r.json());
    if (task.task.status === TaskStatus.SUCCEEDED || task.task.status === TaskStatus.FAILED) {
      final = task.task;
      break;
    }
  }

  assert.ok(final, 'task did not finish in time');
  assert.equal(final.status, TaskStatus.SUCCEEDED);
  assert.equal(final.executorId, 'executor.local-shell');
  assert.ok(fs.existsSync(path.join(workspace, '.nexus', `task-${taskId}.json`)));

  await stopNexus(runtime);
  delete process.env.NEXUS_DISABLE_CURSOR_AGENT;
  delete process.env.NEXUS_WORKER_UNREF;
});

test('WAITING_EXECUTOR tasks are recovered and not left forever', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-wait-'));
  process.env.NEXUS_DISABLE_CURSOR_AGENT = '1';
  process.env.NEXUS_WORKER_UNREF = '1';

  // Seed stuck tasks before runtime starts (startup requeue)
  const seedStorePath = path.join(dataDir, 'tasks.json');
  fs.mkdirSync(dataDir, { recursive: true });
  const stuckId = '00000000-0000-4000-8000-000000000001';
  fs.writeFileSync(
    seedStorePath,
    JSON.stringify([
      {
        id: stuckId,
        status: TaskStatus.WAITING_EXECUTOR,
        prompt: 'stuck forever previously',
        workspace: dataDir,
        metadata: {},
        executorId: 'executor.cursor-agent',
        attempts: [],
        result: null,
        error: { code: 'WAITING_EXECUTOR', message: 'no executor' },
        createdAt: new Date(Date.now() - 60_000).toISOString(),
        updatedAt: new Date(Date.now() - 60_000).toISOString(),
        queuedAt: new Date(Date.now() - 60_000).toISOString(),
        waitingExecutorSince: new Date(Date.now() - 60_000).toISOString(),
        startedAt: null,
        finishedAt: null,
      },
    ], null, 2),
  );

  const runtime = await createRuntime({
    dataDir,
    recoveryToken: 'secret',
    worker: { pollIntervalMs: 40, maxConcurrent: 2, waitingExecutorTimeoutMs: 150, taskHardTimeoutMs: 10_000 },
  });

  // Startup should have requeued
  assert.equal(runtime.taskStore.get(stuckId).status, TaskStatus.QUEUED);

  await runtime.worker.start();
  await listen(runtime);

  let final = null;
  for (let i = 0; i < 80; i++) {
    await new Promise((r) => setTimeout(r, 50));
    const t = runtime.taskStore.get(stuckId);
    if (t.status === TaskStatus.SUCCEEDED || t.status === TaskStatus.FAILED) {
      final = t;
      break;
    }
  }
  assert.ok(final);
  assert.equal(final.status, TaskStatus.SUCCEEDED);

  await stopNexus(runtime);
  delete process.env.NEXUS_DISABLE_CURSOR_AGENT;
  delete process.env.NEXUS_WORKER_UNREF;
});

test('API key: required when configured, blocks unauthorized access', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-auth-'));
  process.env.NEXUS_API_KEY = 'secret-api-key';
  process.env.NEXUS_AUTH_REQUIRED = '1';

  const runtime = await createRuntime({ dataDir, port: 0 });
  await listen(runtime);

  const denied = await fetch(`${runtime.baseUrl}/v1/prompt`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt: 'no auth' }),
  });
  assert.equal(denied.status, 401);

  const health = await fetch(`${runtime.baseUrl}/v1/health`);
  assert.equal(health.status, 200);

  const ok = await fetch(`${runtime.baseUrl}/v1/prompt`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer secret-api-key',
    },
    body: JSON.stringify({ prompt: 'with auth' }),
  });
  assert.equal(ok.status, 202);

  await new Promise((r) => runtime.server.close(() => r()));
  delete process.env.NEXUS_API_KEY;
  delete process.env.NEXUS_AUTH_REQUIRED;
});
