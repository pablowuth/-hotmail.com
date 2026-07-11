/**
 * Executor registry with priority ordering and health checks.
 * Lower priority number = preferred first.
 */
export class ExecutorRegistry {
  constructor() {
    /** @type {Map<string, import('./base.js').BaseExecutor>} */
    this.executors = new Map();
  }

  register(executor) {
    if (!executor?.id) throw new Error('Executor must have id');
    this.executors.set(executor.id, executor);
    return executor;
  }

  unregister(id) {
    return this.executors.delete(id);
  }

  get(id) {
    return this.executors.get(id) || null;
  }

  update(id, patch = {}) {
    const executor = this.get(id);
    if (!executor) throw new Error(`Unknown executor: ${id}`);
    if (patch.priority !== undefined) executor.priority = patch.priority;
    if (patch.enabled !== undefined) executor.enabled = Boolean(patch.enabled);
    return executor;
  }

  setEnabled(id, enabled) {
    return this.update(id, { enabled });
  }

  list() {
    return [...this.executors.values()].sort((a, b) => a.priority - b.priority);
  }

  snapshot() {
    return this.list().map((e) => ({
      id: e.id,
      priority: e.priority,
      enabled: e.enabled,
      lastHealth: e.lastHealth,
    }));
  }

  async healthCheckOne(id) {
    const executor = this.get(id);
    if (!executor) throw new Error(`Unknown executor: ${id}`);
    return executor.healthCheck();
  }

  async healthCheckAll() {
    const results = {};
    for (const executor of this.list()) {
      results[executor.id] = await executor.healthCheck();
    }
    return results;
  }

  /**
   * Select the best healthy executor that can handle the task.
   * Skips disabled / unhealthy / incompatible executors.
   * Optionally skip a set of already-failed executor ids for failover.
   */
  async selectForTask(task, { skipIds = new Set(), preferIds = [] } = {}) {
    const ordered = this.list().filter((e) => e.enabled && !skipIds.has(e.id));

    // Prefer explicit ids first if provided and healthy
    const preferSet = new Set(preferIds);
    const ranked = [
      ...ordered.filter((e) => preferSet.has(e.id)),
      ...ordered.filter((e) => !preferSet.has(e.id)),
    ];

    const attempts = [];
    for (const executor of ranked) {
      if (!executor.canHandle(task)) {
        attempts.push({ id: executor.id, skipped: true, reason: 'cannot_handle' });
        continue;
      }
      // Bootstrap-only tasks should not fall through to cursor/local unless intended
      if (task?.metadata?.bootstrapOnly && executor.id !== 'executor.bootstrap') {
        attempts.push({ id: executor.id, skipped: true, reason: 'bootstrap_only' });
        continue;
      }
      const health = await executor.healthCheck();
      attempts.push({ id: executor.id, health });
      if (health.ok) {
        return { executor, attempts };
      }
    }
    return { executor: null, attempts };
  }
}
