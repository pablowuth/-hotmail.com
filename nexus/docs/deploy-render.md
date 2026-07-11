# Nexus on Render (free)

Deploy permanente gratuito de Nexus para ChatGPT.

## Deploy en 1 clic

1. Abrí: https://render.com/deploy?repo=https://github.com/pablowuth/-hotmail.com
2. Iniciá sesión en Render (cuenta gratis con GitHub)
3. Confirmá el blueprint (`render.yaml` en la raíz del repo)
4. Esperá el deploy (~2-3 min)
5. Copiá la URL pública, ej. `https://nexus-control-plane.onrender.com`

## Conectar ChatGPT

1. En ChatGPT → tu GPT → **Configure** → **Actions**
2. **Import from URL**: `https://TU-URL.onrender.com/openapi.json`
3. O pegá el contenido de `nexus/docs/chatgpt-action.json` (actualizá la URL)
4. Guardá y probá: "Encolá un prompt en Nexus"

## Endpoints

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/v1/health` | Health check |
| POST | `/v1/prompt` | Encolar tarea (202) |
| GET | `/v1/tasks/{id}` | Polling estado |

## Notas plan free

- El servicio **duerme tras 15 min** sin tráfico; el primer request puede tardar ~30-60s
- SQLite se reinicia en cada redeploy (sin disco persistente en free)
- `NEXUS_RECOVERY_TOKEN` se genera automáticamente en Render

## Probar local (cloud profile)

```bash
cd nexus
NEXUS_PROFILE=cloud npm run start:cloud
curl http://127.0.0.1:8787/v1/health
```
