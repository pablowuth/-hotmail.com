import http from 'node:http';
import { URL } from 'node:url';
import { TaskStatus } from './control-plane/states.js';
import { assertApiKey } from './auth/api-key.js';

export function createServer(runtime) {
  const server = http.createServer(async (req, res) => {
    try {
      await handleRequest(runtime, req, res);
    } catch (err) {
      const status = err.status || 500;
      sendJson(res, status, {
        error: {
          code: err.code || 'INTERNAL_ERROR',
          message: err.message || 'Internal error',
        },
      });
    }
  });
  return server;
}

async function handleRequest(runtime, req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const { pathname } = url;
  const method = (req.method || 'GET').toUpperCase();

  if (method === 'GET' && pathname === '/health') {
    return sendJson(res, 200, await buildHealth(runtime));
  }

  if (method === 'GET' && pathname === '/v1/health') {
    return sendJson(res, 200, await buildHealth(runtime));
  }

  if (method === 'GET' && (pathname === '/openapi.json' || pathname === '/v1/openapi.json')) {
    return sendJson(res, 200, runtime.openapi);
  }

  if (method === 'POST' && pathname === '/v1/recovery') {
    return handleRecovery(runtime, req, res);
  }

  assertApiKey(req, runtime.config);

  if (method === 'GET' && pathname === '/v1/capabilities') {
    return sendJson(res, 200, { capabilities: runtime.providers.listCapabilities() });
  }

  if (method === 'GET' && pathname === '/v1/providers') {
    await runtime.providers.syncFromExecutors();
    return sendJson(res, 200, { providers: runtime.providers.listProviders() });
  }

  if (method === 'GET' && pathname === '/v1/executors') {
    const health = await runtime.registry.healthCheckAll();
    return sendJson(res, 200, {
      executors: runtime.registry.snapshot(),
      health,
    });
  }

  if (method === 'GET' && pathname === '/v1/executors/preflight') {
    return sendJson(res, 200, await preflight(runtime));
  }

  if (method === 'POST' && pathname === '/v1/prompt') {
    return handlePrompt(runtime, req, res);
  }

  if (method === 'GET' && pathname.startsWith('/v1/tasks/')) {
    const taskId = pathname.slice('/v1/tasks/'.length);
    const task = runtime.taskStore.get(taskId);
    if (!task) {
      return sendJson(res, 404, { error: { code: 'NOT_FOUND', message: 'Task not found' } });
    }
    const events = runtime.taskStore.listEvents(taskId);
    return sendJson(res, 200, { task, events });
  }

  if (method === 'GET' && pathname === '/v1/tasks') {
    const status = url.searchParams.get('status');
    const tasks = status
      ? runtime.taskStore.listByStatus(status)
      : runtime.taskStore.list();
    return sendJson(res, 200, { tasks });
  }

  sendJson(res, 404, { error: { code: 'NOT_FOUND', message: `No route ${method} ${pathname}` } });
}

async function handlePrompt(runtime, req, res) {
  const body = await readJson(req);
  const prompt = body?.prompt ?? body?.text ?? body?.message;
  if (!prompt || typeof prompt !== 'string') {
    return sendJson(res, 400, {
      error: { code: 'INVALID_REQUEST', message: 'prompt is required' },
    });
  }

  const clientRequestId = body?.client?.request_id || body?.requestId || null;
  if (clientRequestId) {
    const existing = runtime.taskStore.findByClientRequestId(clientRequestId);
    if (existing) {
      return sendJson(res, 200, {
        taskId: existing.id,
        status: existing.status,
        idempotent: true,
      });
    }
  }

  const task = runtime.taskStore.create({
    prompt,
    workspace: body.workspace || body.cwd || runtime.config.workspace?.defaultPath || null,
    metadata: body.metadata || {},
    clientRequestId,
  });

  runtime.taskStore.ledger.appendEvent({
    taskId: task.id,
    type: 'TASK_QUEUED',
    message: 'Task queued for async execution',
  });

  sendJson(res, 202, {
    taskId: task.id,
    status: TaskStatus.QUEUED,
    message: 'Task accepted and queued for background execution',
  });
}

async function handleRecovery(runtime, req, res) {
  const token = extractToken(req);
  runtime.recovery.assertToken(token);
  const body = await readJson(req);
  const action = body?.action;
  if (!action) {
    return sendJson(res, 400, {
      error: {
        code: 'INVALID_REQUEST',
        message: 'action is required',
        allowed: runtime.recovery.allowedActions(),
      },
    });
  }
  const params = { ...body };
  delete params.action;
  const result = await runtime.recovery.execute(action, params);
  runtime.taskStore.recordRecovery({
    action,
    ok: true,
    at: new Date().toISOString(),
    result,
  });
  sendJson(res, 200, {
    ok: true,
    action,
    result,
  });
}

async function buildHealth(runtime) {
  const summary = await runtime.providers.getHealthSummary();
  const waiting = runtime.taskStore.listByStatus(TaskStatus.WAITING_EXECUTOR).length;
  const queued = runtime.taskStore.listByStatus(TaskStatus.QUEUED).length;
  const running = runtime.taskStore.listByStatus(TaskStatus.RUNNING).length;
  const sovereignOk = true;
  const intentOk = runtime.worker.isRunning();
  const effectOk = summary.healthyCount > 0;
  return {
    ok: sovereignOk && intentOk,
    sovereign_ok: sovereignOk,
    intent_ok: intentOk,
    effect_ok: effectOk,
    service: 'nexus-control-plane',
    version: '0.3.1-phase-a-prime',
    workerRunning: runtime.worker.isRunning(),
    tasks: { queued, waitingExecutor: waiting, running },
    executors: summary.executors,
    health: summary.health,
    providers: summary.providers,
    capabilities: summary.capabilities,
    recovery: {
      allowedActions: runtime.recovery.allowedActions(),
      recent: runtime.taskStore.listRecovery({ limit: 10 }),
    },
    timestamp: new Date().toISOString(),
  };
}

async function preflight(runtime) {
  const health = await runtime.registry.healthCheckAll();
  const cursor = health['executor.cursor-agent'];
  const local = health['executor.local-shell'];
  const bootstrap = health['executor.bootstrap'];
  return {
    ok: Boolean(local?.ok || bootstrap?.ok || cursor?.ok),
    cursorAgent: cursor || { ok: false },
    localShell: local || { ok: false },
    bootstrap: bootstrap || { ok: false },
    failoverReady: Boolean(local?.ok || bootstrap?.ok),
    note: cursor?.ok
      ? 'cursor-agent available'
      : 'cursor-agent unavailable; failover executors will be used',
  };
}

function extractToken(req) {
  const header = req.headers['x-nexus-recovery-token'] || req.headers['authorization'];
  if (!header) return null;
  if (typeof header !== 'string') return null;
  if (header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim();
  }
  return header.trim();
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (err) {
        const e = new Error('Invalid JSON body');
        e.status = 400;
        e.code = 'INVALID_JSON';
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store',
  });
  res.end(payload);
}
