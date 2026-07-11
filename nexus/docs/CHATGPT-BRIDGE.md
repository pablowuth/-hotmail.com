# Puente ChatGPT ↔ Nexus (sin autenticación)

## URL pública activa

```
https://cult-criticism-sublime-corn.trycloudflare.com
```

## ChatGPT — copiar y pegar

**Import schema (Actions → Import from URL):**
```
https://cult-criticism-sublime-corn.trycloudflare.com/openapi.json
```

**Authentication:** `None` (sin API key)

**Instrucciones para el GPT:**
```
Cuando el usuario pida ejecutar algo en Nexus o Mercadeo IA:
1. POST /v1/prompt con {"prompt": "<instrucción>"}
2. Tomá el taskId (status QUEUED, HTTP 202)
3. Esperá 2-3 segundos
4. GET /v1/tasks/{taskId}
5. Repetí polling hasta status SUCCEEDED o FAILED
6. Mostrá task.result al usuario
```

## Endpoints públicos (sin auth)

| Endpoint | Método | HTTP esperado |
|----------|--------|---------------|
| `/v1/health` | GET | 200 |
| `/openapi.json` | GET | 200 |
| `/v1/prompt` | POST | 202 |
| `/v1/tasks/{id}` | GET | 200 |

## Verificar puente

```bash
cd nexus
npm run verify:bridge -- https://cult-criticism-sublime-corn.trycloudflare.com
```

## URL permanente (Render free)

https://render.com/deploy?repo=https://github.com/pablowuth/-hotmail.com

Tras deploy, importá `https://TU-SERVICIO.onrender.com/openapi.json` en ChatGPT.
