import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function serializeTask(task) {
  return {
    id: task.id,
    status: task.status,
    prompt: task.prompt,
    workspace: task.workspace ?? null,
    metadata: JSON.stringify(task.metadata || {}),
    executor_id: task.executorId ?? null,
    provider_ref: task.providerRef ?? null,
    request_id: task.clientRequestId ?? task.requestId ?? null,
    attempts: JSON.stringify(task.attempts || []),
    result: task.result == null ? null : JSON.stringify(task.result),
    error: task.error == null ? null : JSON.stringify(task.error),
    created_at: task.createdAt,
    updated_at: task.updatedAt,
    queued_at: task.queuedAt ?? null,
    waiting_executor_since: task.waitingExecutorSince ?? null,
    started_at: task.startedAt ?? null,
    finished_at: task.finishedAt ?? null,
  };
}

function deserializeTask(row) {
  if (!row) return null;
  return {
    id: row.id,
    status: row.status,
    prompt: row.prompt,
    workspace: row.workspace,
    metadata: row.metadata ? JSON.parse(row.metadata) : {},
    executorId: row.executor_id,
    providerRef: row.provider_ref,
    clientRequestId: row.request_id,
    attempts: row.attempts ? JSON.parse(row.attempts) : [],
    result: row.result ? JSON.parse(row.result) : null,
    error: row.error ? JSON.parse(row.error) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    queuedAt: row.queued_at,
    waitingExecutorSince: row.waiting_executor_since,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
  };
}

function deserializeProvider(row) {
  return {
    providerRef: row.provider_ref,
    executorId: row.executor_id,
    alias: row.alias,
    capabilities: JSON.parse(row.capabilities || '[]'),
    tier: row.tier,
    locality: row.locality,
    health: row.health ? JSON.parse(row.health) : null,
    updatedAt: row.updated_at,
  };
}

export class SqliteLedger {
  constructor(dataDir) {
    ensureDir(dataDir);
    this.dbPath = path.join(dataDir, 'nexus.sqlite');
    this.db = new DatabaseSync(this.dbPath);
    this.db.exec('PRAGMA journal_mode = WAL;');
    this.#migrate();
  }

  #migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        prompt TEXT NOT NULL,
        workspace TEXT,
        metadata TEXT,
        executor_id TEXT,
        provider_ref TEXT,
        request_id TEXT,
        attempts TEXT,
        result TEXT,
        error TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        queued_at TEXT,
        waiting_executor_since TEXT,
        started_at TEXT,
        finished_at TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_request_id ON tasks(request_id) WHERE request_id IS NOT NULL;

      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts TEXT NOT NULL,
        type TEXT NOT NULL,
        task_id TEXT,
        message TEXT,
        payload TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_events_task ON events(task_id);

      CREATE TABLE IF NOT EXISTS providers (
        provider_ref TEXT PRIMARY KEY,
        executor_id TEXT NOT NULL,
        alias TEXT,
        capabilities TEXT NOT NULL,
        tier INTEGER DEFAULT 1,
        locality TEXT DEFAULT 'host',
        health TEXT,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS recovery_audit (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts TEXT NOT NULL,
        action TEXT NOT NULL,
        ok INTEGER NOT NULL,
        detail TEXT
      );
    `);
  }

  upsertTask(task) {
    const row = serializeTask(task);
    this.db.prepare(`
      INSERT INTO tasks (
        id, status, prompt, workspace, metadata, executor_id, provider_ref, request_id,
        attempts, result, error, created_at, updated_at, queued_at, waiting_executor_since,
        started_at, finished_at
      ) VALUES (
        @id, @status, @prompt, @workspace, @metadata, @executor_id, @provider_ref, @request_id,
        @attempts, @result, @error, @created_at, @updated_at, @queued_at, @waiting_executor_since,
        @started_at, @finished_at
      )
      ON CONFLICT(id) DO UPDATE SET
        status = excluded.status,
        prompt = excluded.prompt,
        workspace = excluded.workspace,
        metadata = excluded.metadata,
        executor_id = excluded.executor_id,
        provider_ref = excluded.provider_ref,
        request_id = excluded.request_id,
        attempts = excluded.attempts,
        result = excluded.result,
        error = excluded.error,
        updated_at = excluded.updated_at,
        queued_at = excluded.queued_at,
        waiting_executor_since = excluded.waiting_executor_since,
        started_at = excluded.started_at,
        finished_at = excluded.finished_at
    `).run(row);
  }

  getTask(id) {
    const row = this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    return deserializeTask(row);
  }

  findTaskByRequestId(requestId) {
    if (!requestId) return null;
    const row = this.db.prepare('SELECT * FROM tasks WHERE request_id = ?').get(requestId);
    return deserializeTask(row);
  }

  listTasks({ status, limit = 1000 } = {}) {
    let sql = 'SELECT * FROM tasks';
    const params = [];
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    sql += ' ORDER BY created_at ASC LIMIT ?';
    params.push(limit);
    return this.db.prepare(sql).all(...params).map(deserializeTask);
  }

  appendEvent({ taskId = null, type, message = null, data = {} }) {
    const ts = new Date().toISOString();
    this.db.prepare(
      'INSERT INTO events (ts, type, task_id, message, payload) VALUES (?, ?, ?, ?, ?)',
    ).run(ts, type, taskId, message, JSON.stringify(data));
    return ts;
  }

  listEvents(taskId) {
    return this.db
      .prepare('SELECT * FROM events WHERE task_id = ? ORDER BY id ASC')
      .all(taskId)
      .map((row) => ({
        ts: row.ts,
        type: row.type,
        taskId: row.task_id,
        message: row.message,
        data: row.payload ? JSON.parse(row.payload) : {},
      }));
  }

  upsertProvider(row) {
    const ts = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO providers (provider_ref, executor_id, alias, capabilities, tier, locality, health, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(provider_ref) DO UPDATE SET
        executor_id = excluded.executor_id,
        alias = excluded.alias,
        capabilities = excluded.capabilities,
        tier = excluded.tier,
        locality = excluded.locality,
        health = excluded.health,
        updated_at = excluded.updated_at
    `).run(
      row.providerRef,
      row.executorId,
      row.alias || row.executorId,
      JSON.stringify(row.capabilities || []),
      row.tier ?? 1,
      row.locality || 'host',
      JSON.stringify(row.health || null),
      ts,
    );
  }

  listProviders() {
    return this.db
      .prepare('SELECT * FROM providers ORDER BY tier ASC, provider_ref ASC')
      .all()
      .map(deserializeProvider);
  }

  appendRecoveryAudit(entry) {
    this.db.prepare('INSERT INTO recovery_audit (ts, action, ok, detail) VALUES (?, ?, ?, ?)').run(
      entry.at || new Date().toISOString(),
      entry.action,
      entry.ok ? 1 : 0,
      JSON.stringify(entry),
    );
  }

  listRecoveryAudit({ limit = 50 } = {}) {
    return this.db
      .prepare('SELECT * FROM recovery_audit ORDER BY id DESC LIMIT ?')
      .all(limit)
      .map((row) => ({
        id: row.id,
        ts: row.ts,
        action: row.action,
        ok: row.ok === 1,
        detail: row.detail ? JSON.parse(row.detail) : null,
      }));
  }

  close() {
    this.db.close();
  }
}
