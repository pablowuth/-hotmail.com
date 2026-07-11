import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { TaskStatus } from '../control-plane/states.js';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export class JsonStore {
  constructor(filePath) {
    this.filePath = filePath;
    ensureDir(path.dirname(filePath));
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]\n', 'utf8');
    }
  }

  readAll() {
    const raw = fs.readFileSync(this.filePath, 'utf8').trim();
    if (!raw) return [];
    return JSON.parse(raw);
  }

  writeAll(items) {
    const tmp = `${this.filePath}.tmp`;
    fs.writeFileSync(tmp, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
    fs.renameSync(tmp, this.filePath);
  }
}

export class TaskStore {
  constructor(dataDir) {
    this.store = new JsonStore(path.join(dataDir, 'tasks.json'));
  }

  list() {
    return this.store.readAll();
  }

  get(taskId) {
    return this.list().find((t) => t.id === taskId) || null;
  }

  create(input) {
    const now = new Date().toISOString();
    const task = {
      id: randomUUID(),
      status: TaskStatus.QUEUED,
      prompt: input.prompt,
      workspace: input.workspace || null,
      metadata: input.metadata || {},
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
    const all = this.list();
    all.push(task);
    this.store.writeAll(all);
    return task;
  }

  update(taskId, patch) {
    const all = this.list();
    const idx = all.findIndex((t) => t.id === taskId);
    if (idx < 0) throw new Error(`Task not found: ${taskId}`);
    const updated = {
      ...all[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    this.store.writeAll(all);
    return updated;
  }

  listByStatus(status) {
    return this.list().filter((t) => t.status === status);
  }

  requeueWaiting() {
    const now = new Date().toISOString();
    const all = this.list();
    let count = 0;
    for (const task of all) {
      if (task.status === TaskStatus.WAITING_EXECUTOR) {
        task.status = TaskStatus.QUEUED;
        task.waitingExecutorSince = null;
        task.queuedAt = now;
        task.updatedAt = now;
        task.error = null;
        count += 1;
      }
    }
    this.store.writeAll(all);
    return { requeued: count };
  }
}
