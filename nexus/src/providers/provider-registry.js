import { capabilitiesForExecutor, listCapabilityCatalog } from './capabilities.js';

/**
 * Skills-first provider view over executor implementations.
 */
export class ProviderRegistry {
  constructor({ executorRegistry, taskStore }) {
    this.executorRegistry = executorRegistry;
    this.taskStore = taskStore;
  }

  providerRefForExecutor(executorId) {
    return `prv_${executorId.replace(/[^a-zA-Z0-9]+/g, '_')}`;
  }

  async syncFromExecutors() {
    const providers = [];
    for (const executor of this.executorRegistry.list()) {
      const health = await executor.healthCheck();
      const capabilities = capabilitiesForExecutor(executor.id);
      const tier = executor.id === 'executor.cursor-agent' ? 1
        : executor.id === 'executor.local-shell' ? 2
          : executor.id === 'executor.bootstrap' ? 0 : 3;
      const locality = executor.id === 'executor.bootstrap' ? 'host' : executor.id.includes('cloud') ? 'any' : 'host';
      const row = {
        providerRef: this.providerRefForExecutor(executor.id),
        executorId: executor.id,
        alias: executor.id.replace('executor.', ''),
        capabilities,
        tier,
        locality,
        health,
        enabled: executor.enabled,
        priority: executor.priority,
      };
      this.taskStore?.syncProvider(row);
      providers.push(row);
    }
    return providers;
  }

  listCapabilities() {
    return listCapabilityCatalog();
  }

  listProviders() {
    const persisted = this.taskStore?.listProviders() || [];
    if (persisted.length > 0) return persisted;
    return this.snapshot();
  }

  snapshot() {
    return this.executorRegistry.list().map((executor) => ({
      providerRef: this.providerRefForExecutor(executor.id),
      executorId: executor.id,
      alias: executor.id.replace('executor.', ''),
      capabilities: capabilitiesForExecutor(executor.id),
      priority: executor.priority,
      enabled: executor.enabled,
      lastHealth: executor.lastHealth,
      tier: executor.id === 'executor.cursor-agent' ? 1 : executor.id === 'executor.local-shell' ? 2 : 0,
    }));
  }

  async getHealthSummary() {
    const health = await this.executorRegistry.healthCheckAll();
    const providers = await this.syncFromExecutors();
    const healthyCount = Object.values(health).filter((h) => h?.ok).length;
    return {
      healthyCount,
      executors: this.executorRegistry.snapshot(),
      health,
      providers,
      capabilities: this.listCapabilities(),
    };
  }
}
