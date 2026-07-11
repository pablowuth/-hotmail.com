import { TaskStatus, isTerminal } from '../control-plane/states.js';

/**
 * Background worker: never blocks HTTP.
 * Picks QUEUED tasks, selects healthy executors with failover,
 * and never leaves tasks stuck in WAITING_EXECUTOR indefinitely.
 */
export class TaskWorker {
  constructor({
    taskStore,
    registry,
    config,
    logger = console,
  }) {
    this.taskStore = taskStore;
    this.registry = registry;
    this.config = config;
    this.logger = logger;
    this._timer = null;
    this._running = false;
    this._active = new Set();
    this._generation = 0;
  }

  isRunning() {
    return this._running;
  }

  async start() {
    if (this._running) return;
    this._running = true;
    this._generation += 1;
    const gen = this._generation;
    const interval = this.config.worker?.pollIntervalMs || 200;
    this._timer = setInterval(() => {
      if (this._generation !== gen) return;
      this.tick().catch((err) => {
        this.logger.error?.('[worker] tick error', err);
      });
    }, interval);
    // Allow Node to exit if only the timer remains in tests when stopped;
    // while running we want the process kept alive by the HTTP server.
    if (typeof this._timer.unref === 'function' && process.env.NEXUS_WORKER_UNREF === '1') {
      this._timer.unref();
    }
    this.logger.info?.('[worker] started');
  }

  async stop() {
    this._running = false;
    this._generation += 1;
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    // Wait briefly for in-flight tasks
    const deadline = Date.now() + 5000;
    while (this._active.size > 0 && Date.now() < deadline) {
      await sleep(50);
    }
    this.logger.info?.('[worker] stopped');
  }

  async tick() {
    if (!this._running) return;
    this.#expireWaitingExecutors();

    const max = this.config.worker?.maxConcurrent || 2;
    if (this._active.size >= max) return;

    const queued = this.taskStore
      .listByStatus(TaskStatus.QUEUED)
      .sort((a, b) => String(a.queuedAt).localeCompare(String(b.queuedAt)));

    for (const task of queued) {
      if (this._active.size >= max) break;
      if (this._active.has(task.id)) continue;
      this._active.add(task.id);
      this.#processTask(task.id)
        .catch((err) => this.logger.error?.('[worker] process error', err))
        .finally(() => this._active.delete(task.id));
    }
  }

  #expireWaitingExecutors() {
    const timeout = this.config.worker?.waitingExecutorTimeoutMs || 5000;
    const now = Date.now();
    for (const task of this.taskStore.listByStatus(TaskStatus.WAITING_EXECUTOR)) {
      const since = task.waitingExecutorSince
        ? Date.parse(task.waitingExecutorSince)
        : Date.parse(task.updatedAt || task.createdAt);
      if (Number.isFinite(since) && now - since >= timeout) {
        // Failover path: requeue so another executor can be tried,
        // or fail if too many attempts.
        const attempts = task.attempts || [];
        if (attempts.length >= 5) {
          this.taskStore.update(task.id, {
            status: TaskStatus.FAILED,
            error: {
              code: 'NO_HEALTHY_EXECUTOR',
              message: 'Exceeded WAITING_EXECUTOR retries; no healthy executor available',
              attempts,
            },
            finishedAt: new Date().toISOString(),
            waitingExecutorSince: null,
          });
        } else {
          this.taskStore.update(task.id, {
            status: TaskStatus.QUEUED,
            waitingExecutorSince: null,
            queuedAt: new Date().toISOString(),
            error: {
              code: 'WAITING_EXECUTOR_TIMEOUT',
              message: 'Requeued after WAITING_EXECUTOR timeout',
            },
          });
        }
      }
    }
  }

  async #processTask(taskId) {
    let task = this.taskStore.get(taskId);
    if (!task || task.status !== TaskStatus.QUEUED) return;

    // Mark waiting while we select an executor (short-lived)
    task = this.taskStore.update(taskId, {
      status: TaskStatus.WAITING_EXECUTOR,
      waitingExecutorSince: new Date().toISOString(),
    });

    const failedIds = new Set(
      (task.attempts || [])
        .filter((a) => a && a.ok === false)
        .map((a) => a.executorId),
    );

    // Prefer non-cursor fallbacks if cursor already failed in this task
    const preferIds = failedIds.has('executor.cursor-agent')
      ? ['executor.local-shell', 'executor.bootstrap']
      : [];

    const { executor, attempts: selectionAttempts } = await this.registry.selectForTask(task, {
      skipIds: failedIds,
      preferIds,
    });

    if (!executor) {
      // Stay in WAITING_EXECUTOR briefly; tick will requeue/fail via timeout.
      this.taskStore.update(taskId, {
        status: TaskStatus.WAITING_EXECUTOR,
        waitingExecutorSince: task.waitingExecutorSince || new Date().toISOString(),
        error: {
          code: 'WAITING_EXECUTOR',
          message: 'No healthy executor available yet',
          selectionAttempts,
        },
      });
      return;
    }

    task = this.taskStore.update(taskId, {
      status: TaskStatus.RUNNING,
      executorId: executor.id,
      waitingExecutorSince: null,
      startedAt: new Date().toISOString(),
      error: null,
    });

    const attempt = {
      executorId: executor.id,
      startedAt: new Date().toISOString(),
      ok: false,
    };

    try {
      const hardTimeout = this.config.worker?.taskHardTimeoutMs || 120_000;
      const result = await withTimeout(
        executor.execute(task, { timeoutMs: hardTimeout }),
        hardTimeout,
        `Task hard-timeout after ${hardTimeout}ms on ${executor.id}`,
      );
      attempt.ok = true;
      attempt.finishedAt = new Date().toISOString();
      attempt.resultSummary = summarize(result);
      const attempts = [...(task.attempts || []), attempt];
      this.taskStore.update(taskId, {
        status: TaskStatus.SUCCEEDED,
        result,
        attempts,
        finishedAt: new Date().toISOString(),
        error: null,
      });
    } catch (err) {
      attempt.ok = false;
      attempt.finishedAt = new Date().toISOString();
      attempt.error = { code: err.code || 'EXECUTOR_ERROR', message: err.message };
      const attempts = [...(task.attempts || []), attempt];

      // Failover: requeue for another executor unless exhausted
      const tried = new Set(attempts.map((a) => a.executorId));
      const remaining = this.registry
        .list()
        .filter((e) => e.enabled && !tried.has(e.id) && e.canHandle(task));

      if (remaining.length > 0) {
        this.taskStore.update(taskId, {
          status: TaskStatus.QUEUED,
          attempts,
          executorId: null,
          queuedAt: new Date().toISOString(),
          error: {
            code: 'FAILOVER',
            message: `${executor.id} failed; requeued for failover`,
            cause: err.message,
          },
        });
        return;
      }

      this.taskStore.update(taskId, {
        status: TaskStatus.FAILED,
        attempts,
        finishedAt: new Date().toISOString(),
        error: {
          code: err.code || 'EXECUTOR_ERROR',
          message: err.message,
        },
      });
    }
  }
}

function summarize(result) {
  if (!result || typeof result !== 'object') return { type: typeof result };
  return {
    executorId: result.executorId,
    output: typeof result.output === 'string' ? result.output.slice(0, 200) : undefined,
  };
}

function withTimeout(promise, ms, message) {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => {
        const err = new Error(message);
        err.code = 'TASK_TIMEOUT';
        reject(err);
      }, ms);
    }),
  ]);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export { isTerminal };
