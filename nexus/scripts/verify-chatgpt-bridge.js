#!/usr/bin/env node
/**
 * Verifica el puente ChatGPT ↔ Nexus ↔ ejecutor (Cursor/failover).
 * Uso: node scripts/verify-chatgpt-bridge.js [BASE_URL]
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const base = (process.argv[2] || process.env.NEXUS_PUBLIC_URL || 'http://127.0.0.1:8787').replace(/\/$/, '');
const results = [];

function record(name, ok, detail = {}) {
  results.push({ name, ok, ...detail });
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${name}${detail.code ? ` HTTP ${detail.code}` : ''}${detail.note ? ` — ${detail.note}` : ''}`);
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { res, body };
}

async function main() {
  console.log(`[bridge] base URL: ${base}\n`);

  // 1) Health
  {
    const { res, body } = await fetchJson(`${base}/v1/health`);
    record('GET /v1/health', res.status === 200 && body?.ok === true, { code: res.status });
  }

  // 2) OpenAPI
  {
    const { res, body } = await fetchJson(`${base}/openapi.json`);
    const ok = res.status === 200 && body?.openapi && body?.paths?.['/v1/prompt'];
    record('GET /openapi.json', ok, {
      code: res.status,
      note: ok ? `servers=${JSON.stringify(body.servers?.map((s) => s.url))}` : 'invalid schema',
    });
  }

  // 3) POST /v1/prompt (sin auth)
  let taskId;
  {
    const started = Date.now();
    const { res, body } = await fetchJson(`${base}/v1/prompt`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Bridge test: confirm workspace mercadeoia is reachable and return summary',
        metadata: { source: 'verify-chatgpt-bridge' },
      }),
    });
    taskId = body?.taskId;
    const ok = (res.status === 202 || res.status === 200) && Boolean(taskId);
    record('POST /v1/prompt', ok, {
      code: res.status,
      note: `taskId=${taskId} in ${Date.now() - started}ms`,
    });
  }

  if (!taskId) {
    console.error('\n[bridge] abort: no taskId');
    process.exit(1);
  }

  // 4) GET /v1/tasks/:id until terminal
  {
    let final = null;
    for (let i = 0; i < 100; i++) {
      await new Promise((r) => setTimeout(r, 100));
      const { res, body } = await fetchJson(`${base}/v1/tasks/${taskId}`);
      if (res.status !== 200) continue;
      const status = body?.task?.status;
      if (status === 'SUCCEEDED' || status === 'FAILED') {
        final = body;
        break;
      }
    }
    const ok = final?.task?.status === 'SUCCEEDED';
    record('GET /v1/tasks/{id} round-trip', ok, {
      code: 200,
      note: `status=${final?.task?.status} executor=${final?.task?.executorId}`,
    });

    // 5) Full round-trip summary
    record('ChatGPT→Nexus→Executor→Nexus', ok, {
      note: ok
        ? `result=${JSON.stringify(final.task.result?.output || final.task.result).slice(0, 120)}`
        : final?.task?.error?.message || 'timeout',
    });
  }

  const failed = results.filter((r) => !r.ok);
  const out = path.join(os.tmpdir(), 'nexus-bridge-verify.json');
  fs.writeFileSync(out, `${JSON.stringify({ base, results, failed: failed.length }, null, 2)}\n`);
  console.log(`\n[bridge] ${results.length - failed.length}/${results.length} passed`);
  console.log(`[bridge] report: ${out}`);
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
