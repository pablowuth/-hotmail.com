import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { ExecutorRegistry } from '../src/executors/registry.js';
import { LocalShellExecutor } from '../src/executors/local-shell.js';
import { BootstrapExecutor } from '../src/executors/bootstrap.js';
import { BaseExecutor } from '../src/executors/base.js';

class FakeCursor extends BaseExecutor {
  constructor({ healthy = false } = {}) {
    super({ id: 'executor.cursor-agent', priority: 10, enabled: true });
    this.healthy = healthy;
  }
  async healthCheck() {
    this.lastHealth = { ok: this.healthy, latencyMs: 1, detail: {}, checkedAt: new Date().toISOString() };
    return this.lastHealth;
  }
  async execute() {
    throw new Error('cursor boom');
  }
}

test('registry selects healthy executor by priority and skips unhealthy', async () => {
  const registry = new ExecutorRegistry();
  registry.register(new FakeCursor({ healthy: false }));
  registry.register(new LocalShellExecutor({ priority: 50 }));
  const { executor, attempts } = await registry.selectForTask({ prompt: 'x', metadata: {} });
  assert.equal(executor.id, 'executor.local-shell');
  assert.ok(attempts.some((a) => a.id === 'executor.cursor-agent' && a.health && a.health.ok === false));
});

test('bootstrap whitelist denies unknown actions', async () => {
  const boot = new BootstrapExecutor();
  boot.attachRuntime({
    config: { dataDir: fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-boot-')) },
    registry: new ExecutorRegistry(),
    taskStore: { listByStatus: () => [], requeueWaiting: () => ({ requeued: 0 }) },
    worker: { stop: async () => {}, start: async () => {}, isRunning: () => true },
  });
  await assert.rejects(
    () => boot.runAction('rm -rf /', {}),
    /not in bootstrap whitelist/,
  );
});

test('bootstrap requeue-waiting and rollback stack', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-boot-'));
  const { TaskStore } = await import('../src/store/task-store.js');
  const { TaskStatus } = await import('../src/control-plane/states.js');
  const store = new TaskStore(dataDir);
  const t = store.create({ prompt: 'stuck' });
  store.update(t.id, {
    status: TaskStatus.WAITING_EXECUTOR,
    waitingExecutorSince: new Date().toISOString(),
  });

  const registry = new ExecutorRegistry();
  const boot = new BootstrapExecutor();
  const runtime = {
    config: { dataDir },
    registry,
    taskStore: store,
    worker: {
      stop: async () => {},
      start: async () => {},
      isRunning: () => true,
    },
  };
  boot.attachRuntime(runtime);

  const result = await boot.runAction('requeue-waiting', {});
  assert.equal(result.result.requeued, 1);
  assert.equal(store.get(t.id).status, TaskStatus.QUEUED);

  const rb = await boot.runAction('rollback-last-repair', {});
  assert.equal(rb.result.rolledBack, true);
});
