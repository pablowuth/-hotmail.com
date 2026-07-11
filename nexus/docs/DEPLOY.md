# Deploy gratuito en Render

## Autenticación

La API está protegida con **API key** (`NEXUS_API_KEY`):

```
Authorization: Bearer TU_API_KEY
```

En ChatGPT Actions → **Authentication** → API Key → Bearer → pegá la key de Render.

Público sin key: solo `/health`, `/v1/health` y `/openapi.json`.

## URL pública temporal (ya activa)

```
https://cult-criticism-sublime-corn.trycloudflare.com
```

Importá en ChatGPT Actions: `https://cult-criticism-sublime-corn.trycloudflare.com/openapi.json`

> Este túnel es temporal: muere cuando se apaga el agente cloud. Para permanente, usá Render abajo.

## Deploy permanente free (1 clic)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/pablowuth/-hotmail.com)

1. Clic en el botón o abrí: https://render.com/deploy?repo=https://github.com/pablowuth/-hotmail.com
2. Login con GitHub (cuenta gratis)
3. Confirmá blueprint → deploy
4. URL final: `https://nexus-control-plane.onrender.com` (o el nombre que asigne Render)

## ChatGPT Action

Schema listo: `nexus/docs/chatgpt-action.json`

En GPT → Configure → Actions → Import from URL:
`https://TU-URL/openapi.json`
