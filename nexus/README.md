# Nexus Control Plane

Async execution control plane that **does not block HTTP on Cursor Agent**.

## Root cause addressed

- Hardcoded broken Windows path to a specific `cursor-agent` version `node.exe`
- `/v1/prompt` waiting on executor completion (Cloudflare 524 risk)
- Tasks stuck forever in `WAITING_EXECUTOR` when `executor.cursor-agent` was unavailable

## Architecture

```
Client → POST /v1/prompt → 202 QUEUED (immediate)
                ↓
         TaskStore (durable)
                ↓
         TaskWorker (background)
                ↓
     ExecutorRegistry (priority + health)
        ├─ executor.cursor-agent (preferred, optional)
        ├─ executor.local-shell  (failover)
        └─ executor.bootstrap    (repair-only whitelist)
```

## Quick start

```bash
cd nexus
npm start
```

## Key endpoints

| Method | Path | Behavior |
|--------|------|----------|
| POST | `/v1/prompt` | Always HTTP **202** + `taskId` + `QUEUED` |
| GET | `/v1/tasks/{id}` | Poll task status |
| GET | `/v1/health` | Control plane + executor health |
| GET | `/v1/executors/preflight` | Executor preflight / failover readiness |
| POST | `/v1/recovery` | Whitelisted repair actions (token required) |

Recovery token: header `X-Nexus-Recovery-Token` (default in `config/default.json`, override with `NEXUS_RECOVERY_TOKEN`).

## Disable Cursor Agent (failover test)

```bash
NEXUS_DISABLE_CURSOR_AGENT=1 npm start
```

## Tests

```bash
npm test
npm run test:e2e
```
