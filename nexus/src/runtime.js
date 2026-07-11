import fs from 'node:fs';
import path from 'node:path';
import { loadConfig } from './utils/config.js';
import { resolveFromRoot, expandWindowsEnv } from './utils/paths.js';
import { TaskStore } from './store/task-store.js';
import { ExecutorRegistry } from './executors/registry.js';
import { ProviderRegistry } from './providers/provider-registry.js';
import { CursorAgentExecutor } from './executors/cursor-agent.js';
import { LocalShellExecutor } from './executors/local-shell.js';
import { BootstrapExecutor } from './executors/bootstrap.js';
import { TaskWorker } from './worker/task-worker.js';
import { RecoveryService } from './recovery/recovery-service.js';
import { createServer } from './server.js';

export async function createRuntime(overrides = {}) {
  const config = loadConfig(overrides);
  fs.mkdirSync(config.dataDir, { recursive: true });

  const taskStore = new TaskStore(config.dataDir);
  const registry = new ExecutorRegistry();
  const providers = new ProviderRegistry({ executorRegistry: registry, taskStore });

  const searchRoots = (config.cursorAgent?.windowsSearchRoots || []).map(expandWindowsEnv);

  const cursorExecutor = new CursorAgentExecutor({
    id: config.executors.cursorAgent.id,
    priority: config.executors.cursorAgent.priority,
    enabled: config.executors.cursorAgent.enabled,
    healthTimeoutMs: config.executors.cursorAgent.healthTimeoutMs,
    searchRoots,
  });

  const localExecutor = new LocalShellExecutor({
    id: config.executors.localShell.id,
    priority: config.executors.localShell.priority,
    enabled: config.executors.localShell.enabled,
    healthTimeoutMs: config.executors.localShell.healthTimeoutMs,
  });

  const bootstrapExecutor = new BootstrapExecutor({
    id: config.executors.bootstrap.id,
    priority: config.executors.bootstrap.priority,
    enabled: config.executors.bootstrap.enabled,
    healthTimeoutMs: config.executors.bootstrap.healthTimeoutMs,
    operationTimeoutMs: config.executors.bootstrap.operationTimeoutMs,
  });

  registry.register(cursorExecutor);
  registry.register(localExecutor);
  registry.register(bootstrapExecutor);

  const worker = new TaskWorker({ taskStore, registry, config });

  const runtime = {
    config,
    taskStore,
    registry,
    providers,
    worker,
    bootstrap: bootstrapExecutor,
    recovery: null,
    openapi: null,
    server: null,
  };

  bootstrapExecutor.attachRuntime(runtime);
  runtime.recovery = new RecoveryService({
    bootstrap: bootstrapExecutor,
    recoveryToken: config.recoveryToken,
    taskStore,
  });

  const openapiPath = resolveFromRoot('openapi.json');
  runtime.openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

  await providers.syncFromExecutors();

  const recovered = taskStore.requeueWaiting();
  if (recovered.requeued > 0) {
    console.info(`[nexus] requeued ${recovered.requeued} WAITING_EXECUTOR task(s) on startup`);
  }

  runtime.server = createServer(runtime);
  return runtime;
}

export async function startNexus(overrides = {}) {
  const runtime = await createRuntime(overrides);
  await runtime.worker.start();

  const host = runtime.config.host || '127.0.0.1';
  const port = runtime.config.port || 8787;

  await new Promise((resolve, reject) => {
    runtime.server.once('error', reject);
    runtime.server.listen(port, host, () => resolve());
  });

  const addr = runtime.server.address();
  runtime.baseUrl = `http://${host}:${addr.port}`;
  console.info(`[nexus] control plane listening on ${runtime.baseUrl}`);
  console.info('[nexus] POST /v1/prompt returns 202 immediately; workers execute asynchronously');
  return runtime;
}

export async function stopNexus(runtime) {
  if (!runtime) return;
  await runtime.worker.stop();
  await new Promise((resolve) => runtime.server.close(() => resolve()));
  runtime.taskStore?.close?.();
}
