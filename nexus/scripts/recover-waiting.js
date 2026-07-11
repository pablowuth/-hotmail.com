#!/usr/bin/env node
/**
 * Recover all tasks currently stuck in WAITING_EXECUTOR.
 * Can run against a live control plane or directly on the data store.
 */
import { loadConfig } from '../src/utils/config.js';
import { TaskStore } from '../src/store/task-store.js';
import { TaskStatus } from '../src/control-plane/states.js';

const config = loadConfig();
const store = new TaskStore(config.dataDir);
const waiting = store.listByStatus(TaskStatus.WAITING_EXECUTOR);
console.log(`[recover] found ${waiting.length} WAITING_EXECUTOR task(s)`);
for (const t of waiting) {
  console.log(`  - ${t.id} updatedAt=${t.updatedAt}`);
}
const result = store.requeueWaiting();
console.log(`[recover] requeued=${result.requeued}`);
