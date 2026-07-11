import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { TaskStatus } from '../control-plane/states.js';
import { SqliteLedger } from './sqlite-ledger.js';

export class TaskStore {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.ledger = new SqliteLedger(dataDir);
    this.#migrateLegacyJsonIfNeeded();
  }

  #migrateLegacyJsonIfNeeded() {
    const legacyPath = path.join(this.dataDir, 'tasks.json');
    if (!fs.existsSync(legacyPath)) return;
    if (this.ledger.listTasks({ limit: 1 }).length > 0) return;

    const raw = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
    const tasks = Array.isArray(raw) ? raw : Object.values(raw.tasks || {});
    for (const task of tasks) {
      this.ledger.upsertTask(task);
      this.ledger.appendEvent({
        taskId: task.id,
        type: 'MIGRATED_FROM_JSON',
        message: 'Imported from legacy tasks.json',
      });
    }
    const backup = `${legacyPath}.migrated-${Date.now()}`;
    fs.renameSync(legacyPath, backup);
  }

  list() {
    return this.ledger.listTasks();
  }

  get(taskId) {
    return this.ledger.getTask(taskId);
  }

  findByClientRequestId(requestId) {
    return this.ledger.findTaskByRequestId(requestId);
  }

  create(input) {
    const now = new Date().toISOString();
    const task = {
      id: randomUUID(),
      status: TaskStatus.QUEUED,
      prompt: input.prompt,
      workspace: input.workspace || null,
      metadata: input.metadata || {},
      clientRequestId: input.clientRequestId || null,
      executorId: null,
      attempts: [],
      result: null,
      error: null,
      createdAt: now,
      updatedAt: now,
      queuedAt: now,
      waitingExecutorSince: null,
      startedAt: null,
      finishedAt: null,
    };
    this.ledger.upsertTask(task);
    this.ledger.appendEvent({
      taskId: task.id,
      type: 'TASK_CREATED',
      message: 'Task accepted',
      data: { status: TaskStatus.QUEUED },
    });
    return task;
  }

  update(taskId, patch) {
    const current = this.get(taskId);
    if (!current) throw new Error(`Task not found: ${taskId}`);
    const updated = {
      ...current,
      ...patch,
      metadata: patch.metadata ? { ...current.metadata, ...patch.metadata } : current.metadata,
      updatedAt: new Date().toISOString(),
    };
    this.ledger.upsertTask(updated);
    return updated;
  }

  listByStatus(status) {
    return this.ledger.listTasks({ status });
  }

  listEvents(taskId) {
    return this.ledger.listEvents(taskId);
  }

  requeueWaiting() {
    const now = new Date().toISOString();
    const waiting = this.listByStatus(TaskStatus.WAITING_EXECUTOR);
    for (const task of waiting) {
      this.update(task.id, {
        status: TaskStatus.QUEUED,
        waitingExecutorSince: null,
        queuedAt: now,
        error: null,
      });
      this.ledger.appendEvent({
        taskId: task.id,
        type: 'TASK_REQUEUED',
        message: 'Requeued from WAITING_EXECUTOR',
      });
    }
    return { requeued: waiting.length };
  }

  syncProvider(provider) {
    this.ledger.upsertProvider(provider);
  }

  listProviders() {
    return this.ledger.listProviders();
  }

  recordRecovery(entry) {
    this.ledger.appendRecoveryAudit(entry);
  }

  listRecovery({ limit = 50 } = {}) {
    return this.ledger.listRecoveryAudit({ limit });
  }

  close() {
    this.ledger.close();
  }
}
