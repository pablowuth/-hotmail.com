# Nexus Sovereign Reflex — Arquitectura Cerrada v0.3.1

**Estado:** diseño cerrado con enmiendas post-revisión — **sin implementación**  
**Supersede:** v0.3 (enmiendas de comité independiente)  
**Rol:** contrato congelable para Fase A'  
**Base:** v0.3 + hallazgos críticos de revisión arquitectónica

---

## Enmiendas respecto de v0.3

Esta versión **no reabre** el modelo capability-first. Corrige contradicciones, cierra gaps de contrato y redefine el corte de Fase A'.

### E1 — Ontología oficial (Skill / Capability / Offer)

| Término | Definición | Vive en |
|---------|------------|---------|
| **Skill** | Intención de negocio / tipo de trabajo (`code.change`, `repo.sync`) | Cliente, Planner (futuro) |
| **Capability** | Contrato técnico ejecutable versionado (`repo.edit`, `shell.run`) | Capability Registry (Seal) |
| **Offer** | Instancia publicada de ≥1 capabilities con constraints | Capability Index (efímero) |
| **Provider** | Proceso plugin que emite offers (`providerRef` opaco) | Effect Plane |
| **Executor / Hand** | **Términos deprecados** en Intent Plane; solo alias humanos en observabilidad | Fuera del kernel |

**Regla:** el kernel enruta **Capabilities**, no Skills.  
**Fase A':** el cliente envía `requires` (capabilities) directamente.  
**Fase B'+:** un **Intent Planner** opcional traduce `prompt` + contexto → `requires` (skills→capabilities). Sin Planner, no hay skills-first E2E desde NL.

### E2 — Modelo de matching v1 (explícito)

**Fase A'–D' usan Bundle-Single-Provider:**

- Un task WORK tiene un único `claimedOffer`.
- Esa offer debe satisfacer **todo** `requires.allOf`.
- `requires.anyOf` se resuelve por **expansión a capabilities concretas** antes del match (el cliente o Planner elige).
- **No** hay multi-provider por task en v1.

**Fase E'+ (futuro):** Task Graph con sub-intents y `affinity.sameProvider` para workflows multi-mano.

### E3 — Intent Matcher: Fase A' = Opción B

**Adoptado para Fase A':** Scoring con **filtros duros** + score simple.

```
Filtros duros (excluyen):
  - health ∉ {HEALTHY, DEGRADED}
  - recovery-only offer
  - no cubre allOf
  - locality host-required no cumplida
  - tier > tier.max
  - workspace no soportado

Score (ordena supervivientes):
  tier_match, locality_match, health, load, staleness

Sin solver CSP en Fase A'.
```

**Reservado Fase E'+:** constraint solver si hay Task Graph, incompatibilidades, o multi-provider.

### E4 — P11 enunciado correcto + P19

| ID | Principio |
|----|-----------|
| **P11** | Plugins recovery-only no claiman WORK |
| **P19** | El mecanismo de recovery **no depende** de la salud de las offers que debe reparar |

**Implicación:** recovery-runtime corre en el **host OS** con privilegios acotados, no como subordinado de un plugin WORK. Sus operaciones son **host-local** (procesos, archivos de launcher, leases en ledger). No invoca `onExecute` de plugins WORK para reparar.

### E5 — recovery-runtime: límites anti-dios

| Permitido | Prohibido |
|-----------|-----------|
| `recovery.reclaim` sobre ledger | Escribir events fuera del Event Appender |
| Reiniciar proceso de plugin por PID registrado | `shell.run` arbitrario |
| Verificar digest de launcher vs Seal | Modificar Genesis Seal sin quorum/override |
| Rebuild **proyección** del Index desde manifests persistidos | `register-plugin` sin authz `recovery-admin` |
| Dry-run siempre antes de execute (salvo reclaim interno en boot) | Recovery recursivo (recovery task que dispara recovery) |
| Máx 1 RECOVERY task activa por target | Autoinvocación sin `requestedBy=reflex` + cooldown |

**Whitelist Fase A':** solo `reclaim-orphans`, `export-ledger`.  
**Fase C':** resto de acciones con dry-run + rollback.

**Eliminado de whitelist automática:** `rebuild-capability-index` como acción execute — pasa a **procedimiento interno de boot** auditado (`RuntimeStarted`), no invocable por NL.

### E6 — Plugin Plane Protocol (contratos internos congelados)

#### `POST /v1/plugins/register`

```json
{
  "manifest": { "...CapabilityManifest..." },
  "auth": { "pluginToken": "…" }
}
```

→ `201 { "providerRef": "prv_…", "registeredAt": "…" }`

#### `POST /v1/plugins/{providerRef}/pulse`

Body = Pulse. Idempotente por `seq`. `409` si seq regresivo.

#### `POST /v1/plugins/{providerRef}/leases/{leaseId}/renew`

```json
{ "taskId": "tsk_…", "fencingToken": "…", "extendSec": 60 }
```

→ `200 { "leaseUntil": "…" }` | `409` lease lost | `410` offer dead

#### `POST /v1/plugins/{providerRef}/leases/{leaseId}/complete`

```json
{ "taskId": "…", "fencingToken": "…", "status": "SUCCEEDED|FAILED", "result": {} }
```

### E7 — API externa: gaps cerrados

#### `POST /v1/tasks/{taskId}/cancel`

→ `202` si QUEUED/MATCHED; `409` si RUNNING sin política; emite `TaskCancelled`.

#### `GET /v1/tasks/{taskId}/events?after={offset}`

SSE opcional Fase C'; polling obligatorio Fase A'.

#### Errores estándar

```json
{
  "error": {
    "code": "UNKNOWN_CAPABILITY | INVALID_CONSTRAINT | CAPABILITY_GAP | …",
    "message": "…",
    "retryable": false,
    "details": {}
  }
}
```

#### Auth (mínimo Fase A')

- Clientes externos: `Authorization: Bearer <client_token>`
- Plugins: `pluginToken` emitido en register (rotación Fase E')
- Recovery execute: `recovery-admin` role + audit

#### Idempotencia

| Operación | Key |
|-----------|-----|
| `POST /v1/prompt` | `client.request_id` |
| `POST /v1/recovery/intents` | `client.request_id` o `Idempotency-Key` header |
| pulse | `providerRef + seq` |

#### Versionado

- Header `X-Nexus-API-Version: 1`
- `GET /openapi.json` obligatorio antes de Fase A' merge

### E8 — Health Oracle (definiciones)

| Señal | Definición |
|-------|------------|
| `sovereign_ok` | Gate + Ledger + Matcher loop vivos |
| `intent_ok` | Event appender escribiendo; proyecciones rebuildables |
| `effect_ok` | ≥1 offer HEALTHY cubre **core capabilities** del Seal |
| `mode` | NORMAL / DEGRADED / RECOVERY según gaps en **core set** |

**Core capabilities Fase A':** `repo.edit`, `shell.run` (configurable en Seal, no todo el Registry).

### E9 — Fase A' redefinida (corte mínimo real)

**Incluido:**

1. Genesis Seal con Registry mínimo + core set
2. Ledger + events + proyecciones Task/Offer/Gap
3. Event Appender único + hash chain
4. API: `POST /v1/prompt`, `GET /v1/tasks/:id`, `GET /v1/health`, `GET /v1/capabilities`, `POST /v1/tasks/:id/cancel`
5. Plugin protocol: register, pulse, claim-via-matcher, renew, complete
6. Intent Matcher **Opción B** (filtros + score)
7. Lease Broker con fencing
8. Un plugin WORK stub (tier-1)
9. recovery-runtime: **solo** `reclaim-orphans` en boot + `export-ledger` vía API
10. Observabilidad: `/v1/offers`, `/v1/observability/providers`
11. `openapi.json`
12. Tests obligatorios: T08, T09, T10, T12, T17, T19, T-A1–T-A6 (ver abajo)

**Excluido (postergado):**

- Failover entre dos plugins (Fase D')
- Recovery execute / dry-run / NL parse (Fase C')
- Reflex auto-repair (Fase C')
- Gap Aggregator automático (Fase C'; manual via health en A')
- Intent Planner / skills (Fase B'+)
- Mirror, quorum, chaos (Fase E')
- SSE streaming

**Criterio de aceptación Fase A':**

> Con plugin WORK detenido, `POST /v1/prompt` → 202, task QUEUED, `sovereign_ok=true`, `effect_ok=false`, `mode=DEGRADED`. Con plugin vivo, task SUCCEEDED. Tras kill -9 del runtime, restart → orphans reclaimed, task reanudable.

### E10 — Pruebas obligatorias Fase A'

| ID | Escenario |
|----|-----------|
| T-A1 | prompt sin plugin → 202 + QUEUED + DEGRADED |
| T-A2 | plugin pulsa + task → SUCCEEDED |
| T-A3 | kill runtime mid-RUNNING → restart → reclaim → requeue |
| T-A4 | client.request_id duplicado → mismo taskId |
| T-A5 | renew lease válido extiende; fencing inválido → 409 |
| T-A6 | recovery-runtime no acepta WORK claim |
| T-A7 | cancel en QUEUED → CANCELLED |

### E11 — Definition of Done v0.3.1

- [x] Ontología Skill/Capability/Offer/Provider
- [x] Bundle-Single-Provider explícito
- [x] Matcher Opción B para Fase A'
- [x] P19 recovery independence
- [x] recovery-runtime acotado
- [x] Plugin Plane Protocol
- [x] API gaps críticos cerrados
- [x] Fase A' recortada y verificable
- [x] openapi.json requerido

**Siguiente paso:** implementar Fase A' según esta v0.3.1.

---

*Enmiendas v0.3.1 — post revisión de comité independiente. El cuerpo completo de v0.3 sigue vigente salvo donde esta v0.3.1 lo enmienda explícitamente.*
