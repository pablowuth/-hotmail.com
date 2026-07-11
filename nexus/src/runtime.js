import fs from 'node:fs';
import path from 'node:path';
import { loadConfig } from './utils/config.js';
import { resolveFromRoot, expandWindowsEnv } from './utils/paths.js';
import { TaskStore } from './store/task-store.js';
import { ExecutorRegistry } from './executors/registry.js';
import { CursorAgentExecutor } from './executors/cursor-agent.js';
import { LocalShellExecutor } from './executors/local-shell.js';
import { BootstrapExecutor } from './executors/bootstrap.js';
import { TaskWorker } from './worker/task-worker.js';
import { RecoveryService } from './recovery/recovery-service.js';
import { createServer } from './server.js';

export async function createRuntime(overrides = {}) {
  const config = loadConfig(overrides);
  fs.mkdirSync(config.dataDir, { recursive: true });

  if (config.defaultWorkspace) {
    const ws = path.isAbsolute(config.defaultWorkspace)
      ? config.defaultWorkspace
      : resolveFromRoot(config.defaultWorkspace);
    fs.mkdirSync(ws, { recursive: true });
    config.defaultWorkspace = ws;
  }

  const taskStore = new TaskStore(config.dataDir);
  const registry = new ExecutorRegistry();

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

  // Apollo-13: if Cursor is unavailable, disable it automatically so WORK never blocks.
  if (config.mode === 'apollo13' || config.apollo13?.autoDisableUnhealthyCursor) {
    const cursorHealth = await cursorExecutor.healthCheck();
    if (!cursorHealth.ok) {
      cursorExecutor.enabled = false;
      console.info('[nexus:apollo13] cursor-agent unavailable — disabled. Operating with local-shell + bootstrap only.');
    } else {
      console.info('[nexus:apollo13] cursor-agent healthy; kept as optional low-priority executor.');
    }
  }

  // Ensure at least one WORK executor is healthy
  const localHealth = await localExecutor.healthCheck();
  if (!localHealth.ok) {
    throw new Error('Apollo-13 abort: executor.local-shell unhealthy — cannot operate without operator PC fallback');
  }

  const worker = new TaskWorker({ taskStore, registry, config });

  const runtime = {
    config,
    taskStore,
    registry,
    worker,
    bootstrap: bootstrapExecutor,
    recovery: null,
    openapi: null,
    server: null,
    mode: config.mode || 'apollo13',
  };

  bootstrapExecutor.attachRuntime(runtime);
  runtime.recovery = new RecoveryService({
    bootstrap: bootstrapExecutor,
    recoveryToken: config.recoveryToken,
  });

  const openapiPath = resolveFromRoot('openapi.json');
  runtime.openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

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

  const host = runtime.config.host || '0.0.0.0';
  const port = runtime.config.port || 8787;

  await new Promise((resolve, reject) => {
    runtime.server.once('error', reject);
    runtime.server.listen(port, host, () => resolve());
  });

  const addr = runtime.server.address();
  runtime.baseUrl = `http://127.0.0.1:${addr.port}`;
  console.info(`[nexus] mode=${runtime.mode} listening on ${host}:${addr.port}`);
  console.info(`[nexus] local URL ${runtime.baseUrl}`);
  console.info('[nexus] POST /v1/prompt → 202 QUEUED (never waits for Cursor/PC)');
  if (runtime.config.defaultWorkspace) {
    console.info(`[nexus] default workspace: ${runtime.config.defaultWorkspace}`);
  }
  return runtime;
}

export async function stopNexus(runtime) {
  if (!runtime) return;
  await runtime.worker.stop();
  await new Promise((resolve) => runtime.server.close(() => resolve()));
}
