# Nexus Control Plane — Apollo-13

Autonomous execution control plane. **Does not require the operator PC or Cursor Agent.**

## Mode: `apollo13`

- `POST /v1/prompt` → HTTP **202** + `QUEUED` immediately (no Cloudflare 524)
- WORK runs on `executor.local-shell` inside this environment
- `executor.cursor-agent` is optional and auto-disabled when unavailable
- `executor.bootstrap` handles recovery without Cursor
- Default workspace: `workspaces/mercadeoia` (provisioned from repo branches)

## Start (no PC needed)

```bash
cd nexus
npm run provision
npm run apollo13
# verify against live server:
npm run apollo13:verify
```

Health: `GET http://127.0.0.1:8787/v1/health`  
Prompt: `POST http://127.0.0.1:8787/v1/prompt`  
Recovery: `POST http://127.0.0.1:8787/v1/recovery` with `X-Nexus-Recovery-Token`

## Tests

```bash
npm test
npm run test:e2e
```
