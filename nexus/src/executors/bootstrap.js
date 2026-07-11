import fs from 'node:fs';
import path from 'node:path';
import { BaseExecutor } from './base.js';

/**
 * executor.bootstrap — Nexus-native repair executor.
 * Does NOT depend on Cursor. Only whitelisted repair operations.
 */
export const BOOTSTRAP_ACTIONS = Object.freeze([
  'repair-executor',
  'register-executor',
  'restart-worker',
  'requeue-waiting',
  'rollback-last-repair',
]);

export class BootstrapExecutor extends BaseExecutor {
  constructor(options = {}) {
    super({
      id: options.id || 'executor.bootstrap',
      priority: options.priority ?? 100,
      enabled: options.enabled !== false,
      healthTimeoutMs: options.healthTimeoutMs || 500,
    });
    this.operationTimeoutMs = options.operationTimeoutMs || 15_000;
    this.runtime = options.runtime || null;
    this.auditLog = [];
    this.rollbackStack = [];
  }

  attachRuntime(runtime) {
    this.runtime = runtime;
  }

  async healthCheck() {
    const started = Date.now();
    this.lastHealth = {
      ok: true,
      latencyMs: Date.now() - started,
      detail: {
        actions: BOOTSTRAP_ACTIONS,
        runtimeAttached: Boolean(this.runtime),
      },
      checkedAt: new Date().toISOString(),
    };
    return this.lastHealth;
  }

  canHandle(task) {
    if (!this.enabled) return false;
    const action = task?.metadata?.bootstrapAction || task?.metadata?.action;
    if (!action) return false;
    return BOOTSTRAP_ACTIONS.includes(action);
  }

  async execute(task, _context = {}) {
    const action = task?.metadata?.bootstrapAction || task?.metadata?.action;
    if (!BOOTSTRAP_ACTIONS.includes(action)) {
      const err = new Error(`Action not in bootstrap whitelist: ${action}`);
      err.code = 'BOOTSTRAP_DENIED';
      throw err;
    }
    if (!this.runtime) {
      const err = new Error('Bootstrap runtime not attached');
      err.code = 'BOOTSTRAP_NO_RUNTIME';
      throw err;
    }

    const started = Date.now();
    const timeoutMs = this.operationTimeoutMs;
    const result = await withTimeout(
      this.#dispatch(action, task.metadata || {}, task),
      timeoutMs,
      `bootstrap action ${action} timed out after ${timeoutMs}ms`,
    );

    const entry = {
      id: `audit-${Date.now()}`,
      action,
      taskId: task.id,
      ok: true,
      result,
      durationMs: Date.now() - started,
      at: new Date().toISOString(),
    };
    this.auditLog.push(entry);
    this.#persistAudit(entry);
    return {
      executorId: this.id,
      output: `bootstrap:${action} ok`,
      audit: entry,
      result,
    };
  }

  async runAction(action, params = {}) {
    if (!BOOTSTRAP_ACTIONS.includes(action)) {
      const err = new Error(`Action not in bootstrap whitelist: ${action}`);
      err.code = 'BOOTSTRAP_DENIED';
      throw err;
    }
    if (!this.runtime) {
      const err = new Error('Bootstrap runtime not attached');
      err.code = 'BOOTSTRAP_NO_RUNTIME';
      throw err;
    }
    const started = Date.now();
    try {
      const result = await withTimeout(
        this.#dispatch(action, params, null),
        this.operationTimeoutMs,
        `bootstrap action ${action} timed out`,
      );
      const entry = {
        id: `audit-${Date.now()}`,
        action,
        taskId: null,
        ok: true,
        result,
        durationMs: Date.now() - started,
        at: new Date().toISOString(),
      };
      this.auditLog.push(entry);
      this.#persistAudit(entry);
      return entry;
    } catch (err) {
      const entry = {
        id: `audit-${Date.now()}`,
        action,
        taskId: null,
        ok: false,
        error: err.message,
        durationMs: Date.now() - started,
        at: new Date().toISOString(),
      };
      this.auditLog.push(entry);
      this.#persistAudit(entry);
      throw err;
    }
  }

  async #dispatch(action, params, task) {
    switch (action) {
      case 'repair-executor':
        return this.#repairExecutor(params);
      case 'register-executor':
        return this.#registerExecutor(params);
      case 'restart-worker':
        return this.#restartWorker(params);
      case 'requeue-waiting':
        return this.#requeueWaiting(params);
      case 'rollback-last-repair':
        return this.#rollbackLastRepair(params);
      default: {
        const err = new Error(`Unsupported bootstrap action: ${action}`);
        err.code = 'BOOTSTRAP_DENIED';
        throw err;
      }
    }
  }

  async #repairExecutor(params) {
    const executorId = params.executorId || 'executor.cursor-agent';
    const registry = this.runtime.registry;
    const before = registry.snapshot();
    this.rollbackStack.push({
      type: 'repair-executor',
      before,
      at: new Date().toISOString(),
    });

    // Clear launcher cache / force re-resolve paths
    const executor = registry.get(executorId);
    if (!executor) {
      throw new Error(`Unknown executor: ${executorId}`);
    }
    if (typeof executor.resolveLauncher === 'function') {
      executor._launcherCache = null;
      executor._launcherCacheAt = 0;
    }
    registry.setEnabled(executorId, params.enabled !== false);
    const health = await registry.healthCheckOne(executorId);
    return {
      executorId,
      repaired: true,
      health,
      note: 'Cleared caches, refreshed health, updated enabled flag',
    };
  }

  async #registerExecutor(params) {
    const { id, priority, enabled = true, type = 'local-shell' } = params;
    if (!id) throw new Error('register-executor requires id');
    const before = this.runtime.registry.snapshot();
    this.rollbackStack.push({
      type: 'register-executor',
      before,
      registeredId: id,
      at: new Date().toISOString(),
    });

    if (this.runtime.registry.get(id)) {
      this.runtime.registry.update(id, { priority, enabled });
      return { id, updated: true, priority, enabled };
    }

    let executor;
    if (type === 'local-shell') {
      const { LocalShellExecutor } = await import('./local-shell.js');
      executor = new LocalShellExecutor({ id, priority: priority ?? 60, enabled });
    } else if (type === 'bootstrap') {
      throw new Error('Cannot register another bootstrap executor via bootstrap');
    } else {
      throw new Error(`Unsupported executor type for register: ${type}`);
    }
    this.runtime.registry.register(executor);
    return { id, registered: true, type, priority: executor.priority, enabled: executor.enabled };
  }

  async #restartWorker() {
    const before = {
      running: this.runtime.worker?.isRunning?.() || false,
    };
    this.rollbackStack.push({
      type: 'restart-worker',
      before,
      at: new Date().toISOString(),
    });
    await this.runtime.worker.stop();
    await this.runtime.worker.start();
    return {
      restarted: true,
      running: this.runtime.worker.isRunning(),
    };
  }

  async #requeueWaiting() {
    const beforeTasks = this.runtime.taskStore
      .listByStatus('WAITING_EXECUTOR')
      .map((t) => t.id);
    this.rollbackStack.push({
      type: 'requeue-waiting',
      beforeTaskIds: beforeTasks,
      at: new Date().toISOString(),
    });
    const result = this.runtime.taskStore.requeueWaiting();
    return { ...result, taskIds: beforeTasks };
  }

  async #rollbackLastRepair() {
    const last = this.rollbackStack.pop();
    if (!last) {
      return { rolledBack: false, reason: 'No repair to rollback' };
    }

    if (last.type === 'register-executor' && last.registeredId) {
      this.runtime.registry.unregister(last.registeredId);
    }
    if (last.type === 'repair-executor' && last.before) {
      for (const item of last.before) {
        if (this.runtime.registry.get(item.id)) {
          this.runtime.registry.update(item.id, {
            priority: item.priority,
            enabled: item.enabled,
          });
        }
      }
    }
    // requeue-waiting and restart-worker are best-effort; record only
    const entry = {
      id: `audit-rollback-${Date.now()}`,
      action: 'rollback-last-repair',
      ok: true,
      result: { rolledBack: true, undone: last },
      at: new Date().toISOString(),
    };
    this.auditLog.push(entry);
    this.#persistAudit(entry);
    return { rolledBack: true, undone: last };
  }

  #persistAudit(entry) {
    try {
      const dataDir = this.runtime?.config?.dataDir;
      if (!dataDir) return;
      const file = path.join(dataDir, 'bootstrap-audit.jsonl');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.appendFileSync(file, `${JSON.stringify(entry)}\n`, 'utf8');
    } catch {
      // audit persistence must not break repair
    }
  }
}

function withTimeout(promise, ms, message) {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => {
        const err = new Error(message);
        err.code = 'BOOTSTRAP_TIMEOUT';
        reject(err);
      }, ms);
    }),
  ]);
}
