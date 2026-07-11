export class BaseExecutor {
  constructor({ id, priority = 100, enabled = true, healthTimeoutMs = 2000 }) {
    this.id = id;
    this.priority = priority;
    this.enabled = enabled;
    this.healthTimeoutMs = healthTimeoutMs;
    this.lastHealth = null;
  }

  async healthCheck() {
    throw new Error('healthCheck not implemented');
  }

  async execute(_task, _context) {
    throw new Error('execute not implemented');
  }

  canHandle(_task) {
    return this.enabled;
  }
}
