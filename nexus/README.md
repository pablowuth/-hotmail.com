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

## Cloud (sin PC local)

Nexus puede vivir en la nube: el workspace `workspaces/mercadeoia` vive en el repo y el ejecutor principal es `executor.local-shell` (Linux).

```bash
cd nexus
NEXUS_PROFILE=cloud npm run start:cloud
```

Para ChatGPT, desplegá en un host con URL pública HTTPS (Render, Fly, Railway):

1. Conectá el repo a Render y usá `nexus/render.yaml`
2. Copiá la URL pública (ej. `https://nexus-control-plane.onrender.com`)
3. En el GPT Action de ChatGPT, apuntá `servers[0].url` a esa URL y subí `openapi.json`

ChatGPT → HTTPS → Nexus cloud → workspace en repo (sin tu PC).

Perfil cloud desactiva `executor.cursor-agent` y usa `local-shell` como primario.

## Quick start (local)

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
