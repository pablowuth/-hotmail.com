#!/usr/bin/env node
import { createRuntime, stopNexus } from '../src/runtime.js';

const runtime = await createRuntime({
  port: 0,
  dataDir: process.env.NEXUS_DATA_DIR || './data',
});

await runtime.worker.start();
const preflightRes = await fetchHealth(runtime);
console.log(JSON.stringify(preflightRes, null, 2));
await runtime.worker.stop();
await new Promise((r) => runtime.server.close(() => r()));

async function fetchHealth(runtime) {
  const health = await runtime.registry.healthCheckAll();
  return {
    ok: Object.values(health).some((h) => h.ok),
    health,
    executors: runtime.registry.snapshot(),
  };
}
