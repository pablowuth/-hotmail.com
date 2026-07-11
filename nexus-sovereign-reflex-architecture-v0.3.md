# Nexus Sovereign Reflex — Arquitectura Cerrada v0.3

**Estado:** diseño cerrado — **sin implementación**  
**Supersede:** v0.2 (Executor Registry → Capability Registry)  
**Rol de este documento:** contrato de arquitectura para evolución multi-año  
**Autores:** humano · ChatGPT · Cursor (Arquitecto Principal)

---

## 0. Veredicto

Nexus es un **runtime soberano de intents** gobernado por un **Sovereign Reflex Kernel** que **no conoce ejecutores ni vendors**. Conoce únicamente:

- **capacidades** (vocabulario canónico estable),
- **constraints** (localidad, tier, workspace, política),
- **ofertas vivas** (proyección efímera de plugins),
- y **gaps** (diferencia entre lo requerido y lo observable).

Acepta trabajo por API asíncrona, lo registra en un ledger durable, y lo empareja con ofertas de capacidad mediante **Intent Matcher + Lease Broker**. Los ejecutores son **plugins del Effect Plane** que publican manifests y pulses; nunca son ciudadanos de primera clase del Intent Plane.

Si ninguna oferta satisface un intent WORK, el task queda QUEUED y el sistema entra en mode DEGRADED/RECOVERY — pero Nexus sigue administrable.

---

## 0.1 Motivación del cambio respecto de v0.2

La v0.2 decía asignar por “capacidad + prioridad + salud”, pero el centro de gravedad era el **Executor Registry** (`executor.cursor-agent`, `kind=LOCAL|CLOUD`, failover Local→Cloud). Eso acopla el kernel a vendors y taxonomías de mano.

La v0.3 invierte el modelo:

| v0.2 | v0.3 |
|------|------|
| Executor-first, capabilities como atributo | Capability-first, executors como plugins |
| Failover Local → Cloud hardcoded | Failover = re-match de ofertas por score |
| Recovery apunta a `executorId` | Recovery apunta a capability / providerRef opaco |
| Incorporar agente = tocar registry schema | Incorporar agente = publicar manifest |

**Matiz crítico:** “el kernel nunca conoce ejecutores” es **semántico**, no literal. El ledger registra `providerRef` opaco para leases, fencing y auditoría. Lo prohibido es que el **routing** conozca nombres de vendor, kinds fijos o taxonomía de manos.

---

## 1. Decisiones cerradas + veredicto del Arquitecto

### D1 — Genesis Seal

| Decidido | Veredicto |
|----------|-----------|
| Local = autoridad operativa | **Aprobado** (heredado v0.2) |
| Mirror off-host firmado = respaldo / auditoría | **Aprobado** |
| Arranque nunca depende del mirror | **Aprobado — no negociable** |
| **Capability Registry versionado dentro del Seal** | **Aprobado — nuevo en v0.3** |

**Mejoras obligatorias:**

- El Genesis Seal incluye `capability_registry_digest` además de `seal_epoch`.
- Ampliar el vocabulario de capacidades requiere bump de versión del Seal (o Critical Override auditado).
- Conflicto local vs mirror: gana local; restore solo vía `recovery.restore-seal-from-mirror` (crítico).
- Clave de firma en OS keystore; mirror no guarda private key.

### D2 — Failover y segunda oferta

| Decidido v0.2 | Veredicto v0.3 |
|---------------|----------------|
| Prioridad Local → Cloud → Bootstrap | **Rechazado** |
| Failover por re-match de ofertas | **Aprobado** |
| Usuario no nota el cambio (async) | **Aprobado solo para tasks 202** |
| Plugins recovery-only no claiman WORK | **Aprobado — P11** |

**Política adoptada:**

```
Task class = WORK:
  Intent Matcher selecciona mejor offer por score(capability, constraints, health)
  Si lease expira o offer muere → re-match (mismo taskId, nuevo offerId)
  Si no hay offers → QUEUED + CapabilityGap + mode≥DEGRADED

Task class = RECOVERY:
  Solo offers con capabilities recovery.*
  Plugin recovery-runtime tiene exclusividad de claim RECOVERY
```

**Honestidad:** sesiones interactivas/streaming **no** tienen failover transparente. Solo el modelo async 202 lo garantiza.

### D3 — Ledger SQLite V1

| Decidido | Veredicto |
|----------|-----------|
| SQLite embebido, WAL, sin Internet | **Aprobado** |
| Events append-only + hash chain | **Aprobado** |
| Proyecciones rebuildables | **Aprobado — P13** |
| Interface `LedgerStore` migrable a PostgreSQL | **Aprobado — obligatorio** |
| Single event appender | **Aprobado** |

Proyecciones v0.3: `tasks_current`, `offers_current`, `capability_gaps_current` — **no** `executors_current`.

### D4 — Recovery Mode sin NL directo

| Decidido | Veredicto |
|----------|-----------|
| NL → Parser → Recovery Intent → whitelist → auth → dry-run → exec → audit | **Aprobado** |
| LLM propone, Runtime decide | **Aprobado — principio rector** |
| Recovery targets son capabilities, no vendors | **Aprobado — nuevo v0.3** |

Parser en Sovereign Plane. Parse fallido → `REJECTED_UNPARSEABLE`. Nunca “best effort execute”.

### D5 — Quórum

| Decidido | Veredicto |
|----------|-----------|
| NORMAL ≥ 1 offer HEALTHY que cubra requires | **Aprobado — reformulado** |
| Crítico ≥ 2 offers de tiers distintos o 2 providerRefs | **Aprobado con refinamiento** |
| Plugins recovery-only no cuentan para quorum WORK | **Aprobado** |
| Critical Override humano auditado en single-node | **Aprobado** |

“Mano sana” en v0.3 = **oferta viva** que satisface el capability set, no un executor nombrado.

### D6 — Capability-first Kernel (nuevo)

| Decidido | Veredicto |
|----------|-----------|
| Intent Plane enruta solo por capacidades + constraints | **Aprobado — P15** |
| Executors = plugins del Effect Plane | **Aprobado — P16** |
| Capability Registry = contrato estable | **Aprobado — P17** |
| Capability Index = ofertas efímeras rebuildables | **Aprobado — P18** |
| Clientes no envían providerRef ni offerId | **Aprobado — P14** |

### Principios definitivos (P1–P18)

| ID | Principio | Notas |
|----|-----------|-------|
| P1 | Control Plane nunca depende de un plugin para vivir | Gate/Health/Ledger/Recovery no llaman plugins para saber si Nexus vive |
| P2 | Tarea WORK normal con ≥1 offer sana | Quórum NORMAL = cobertura de capabilities |
| P3 | Toda tarea larga es asíncrona | `POST /v1/prompt` → 202 |
| P4 | Health/Polling/Recovery no se bloquean por plugin | Timeouts duros; lecturas solo ledger + index |
| P5 | Recovery = intents estructurados + whitelist | Sin NL→exec directo |
| P6 | SQLite Ledger V1 detrás de `LedgerStore` | |
| P7 | Genesis Seal local + mirror off-host opcional | Local autoridad |
| P8 | Toda reparación auditable y reversible | Dry-run + rollback |
| P9 | Nunca rutas hardcodeadas en kernel | Path discovery vive en plugins |
| P10 | Sin plugins WORK, Nexus administrable | Recovery Mode |
| P11 | Plugins recovery-only no claiman WORK | |
| P12 | Failover WORK = re-match de ofertas, no cadena fija | |
| P13 | Events = fuente de verdad; proyecciones rebuildables | |
| P14 | Runtime rechaza bind-by-provider desde clientes | 400 si viene providerRef/offerId |
| P15 | Kernel enruta solo por capacidades y constraints | |
| P16 | Identidad de vendor vive en Effect Plane, no en Intent Plane | |
| P17 | Capability Registry es contrato estable; plugins reemplazables | |
| P18 | Toda oferta expira; el índice es efímero | TTL + pulse-driven |

---

## 2. Vista de arquitectura

### 2.1 Planos

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTES                                 │
│         ChatGPT · Agentes · UI · Automatizaciones            │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS (async)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 SOVEREIGN PLANE                              │
│  API Gateway │ Health Oracle │ Recovery Console              │
│  Parser (NL→Intent) │ AuthZ │ Dry-Run Engine                 │
│  Reflex Controller │ Gap Aggregator                          │
│  Genesis Seal (local + capability_registry_digest)           │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│              INTENT PLANE — SOVEREIGN REFLEX KERNEL          │
│  Ledger (SQLite, events + hash chain)                          │
│  Capability Registry (estable, en Seal)                      │
│  Capability Index (ofertas vivas, proyección)                │
│  Intent Matcher (requires × offers × constraints)            │
│  Lease Broker (leases sobre offerId)                           │
│  Gap Emitter (CapabilityGap, ModeChanged)                      │
└───────────────┬─────────────────────────────────────────────┘
                │ claim lease sobre offer
        ┌───────┴───────┬───────────────┐
        ▼               ▼               ▼
   Plugin A         Plugin B      recovery-runtime
   (tier-1,host)    (tier-2,any)  (recovery.* only)
        │               │               │
        └───────┬───────┴───────────────┘
                ▼
         EFFECT PLANE (plugins)
                ▼
            Proyecto / OS / Red
```

### 2.2 Separación WORK vs RECOVERY

```
                 ┌──────────────┐
                 │  API / Gate  │
                 └──────┬───────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
     class=WORK              class=RECOVERY
            │                       │
            ▼                       ▼
   Intent Matcher            Matcher filtrado
   (excluye recovery.*       (solo recovery.*
    como única cap)           como requires)
            │                       │
            ▼                       ▼
   Offers tier-1..n           recovery-runtime
   con repo.edit, etc.        plugin único autoridad
```

### 2.3 Qué conoce cada capa

| Capa | Conoce | No conoce |
|------|--------|-----------|
| **Kernel** | capabilityId, constraints, offerId, scores, gaps | "Cursor", "Cloud Agent", rutas de binarios |
| **Ledger** | providerRef opaco, offerId, events | semántica de vendor |
| **Plugin** | su identidad, launcher, paths | routing global de otros plugins |
| **Observabilidad** | alias humanos (providerRef → nombre) | — (fuera del kernel) |

---

## 3. Componentes (responsabilidades cerradas)

| Componente | Plano | Responsabilidad | No puede |
|------------|-------|-----------------|----------|
| **API Gateway** | Sovereign | Auth, rate limit, 202, polling | Ejecutar trabajo |
| **Health Oracle** | Sovereign | sovereign_ok, intent_ok, effect_ok, mode | Preguntar a plugin si Nexus vive |
| **Recovery Console** | Sovereign | Pipeline NL→…→audit | Ejecutar fuera de whitelist |
| **Parser** | Sovereign | NL → Recovery Intent JSON | Ejecutar |
| **Reflex Controller** | Sovereign | desired↔observed; emite RECOVERY tasks | Shell arbitrario |
| **Gap Aggregator** | Sovereign | CapabilityGap por capabilityId | |
| **LedgerStore** | Intent | Events + proyecciones | Conocer vendors |
| **Capability Registry** | Intent | Vocabulario canónico versionado | Paths, binarios, identidades |
| **Capability Index** | Intent | Ofertas vivas desde pulses | Persistir ofertas como verdad |
| **Intent Matcher** | Intent | Score y selección de offer | Bind forzado desde cliente |
| **Lease Broker** | Intent | Lease, renew, expire, reclaim | Ejecutar trabajo |
| **Plugin (genérico)** | Effect | Manifest, pulse, claim handler, execute | Definir salud de Nexus |
| **recovery-runtime** | Effect | Solo capabilities recovery.* | Claimar WORK |

**Eliminados respecto v0.2:** Executor Registry, Claim Broker executor-centric, Hand Local/Cloud como tipos kernel, `executor.bootstrap` como identidad.

---

## 4. Contratos

### 4.1 API asíncrona

#### `POST /v1/prompt`

Acepta un intent de trabajo. **Nunca** ejecuta dentro del request.

**Request:**

```json
{
  "prompt": "Implementar X en Mercadeo IA",
  "workspace": "mercadeo-ia",
  "priority": "normal",
  "client": { "id": "chatgpt", "request_id": "…" },
  "requires": {
    "allOf": ["repo.edit", "shell.run"]
  },
  "constraints": {
    "locality": "host-preferred",
    "tier": { "preferred": 1, "max": 2 }
  }
}
```

**Response:**

```http
HTTP/1.1 202 Accepted
```

```json
{
  "taskId": "tsk_01HZX…",
  "status": "QUEUED",
  "pollUrl": "/v1/tasks/tsk_01HZX…",
  "acceptedAt": "2026-07-11T08:30:00Z"
}
```

**Reglas:**

- Timeout HTTP corto (segundos). Trabajo largo = P3.
- Idempotencia: `client.request_id` → mismo `taskId`.
- Prohibido: `providerRef`, `offerId`, `executorId`, `bindTo` → 400 (P14).
- `requires` usa ids del Capability Registry.
- `constraints` opcionales; defaults: `locality=any`, `tier.preferred=1`.

#### `GET /v1/tasks/{taskId}`

Proyección actual + últimos eventos + gaps si aplica.

```json
{
  "taskId": "tsk_01HZX…",
  "status": "RUNNING",
  "attempt": 1,
  "claimedOffer": "ofr_…",
  "matchedCapabilities": ["repo.edit", "shell.run"],
  "gaps": [],
  "events": [ "…" ]
}
```

`claimedOffer` es opaco. Alias humano solo en `/v1/observability/providers` (ops).

#### `GET /v1/health`

```json
{
  "mode": "NORMAL | DEGRADED | RECOVERY",
  "sovereign_ok": true,
  "intent_ok": true,
  "effect_ok": false,
  "capability_coverage": {
    "repo.edit": { "healthy_offers": 1, "gap": false },
    "shell.run": { "healthy_offers": 1, "gap": false }
  },
  "gaps": []
}
```

Ya no expone `hands.registered` ni `workspace_access` global.

#### `GET /v1/capabilities`

Catálogo del Capability Registry (desde Seal).

#### `GET /v1/offers` (ops / debug)

Ofertas vivas en el Index. Filtrable por `capabilityId`, `tier`, `locality`.

#### `GET /v1/observability/providers` (ops)

Mapeo `providerRef` → alias humano, versión plugin, último pulse. **No usado por el matcher.**

#### Recovery

- `POST /v1/recovery/intents` — body = Recovery Intent
- `POST /v1/recovery/parse` — NL → propuesta (no ejecuta)
- `POST /v1/recovery/intents/{id}/dry-run`
- `POST /v1/recovery/intents/{id}/execute`

### 4.2 Capability Registry (contrato estable)

Entrada canónica:

```text
capabilityId:     "repo.edit"           # namespaced: domain.action
version:          "1.0.0"               # semver del contrato
semantics:
  idempotent:     false
  sideEffects:    write
  requiresWorkspace: true
equivalence:      ["git.write"]         # opcional
recoveryOnly:     false                 # true para recovery.*
```

**Capability Registry V1 (mínimo Fase A'):**

| capabilityId | recoveryOnly | Descripción |
|--------------|--------------|-------------|
| `repo.read` | false | Lectura de repositorio |
| `repo.edit` | false | Edición de archivos en workspace |
| `shell.run` | false | Ejecución de comandos |
| `shell.run.sandboxed` | false | Shell con restricciones |
| `workspace.mount` | false | Acceso a workspace nombrado |
| `test.run` | false | Ejecutar tests |
| `recovery.repair` | true | Reparar provider de capacidad |
| `recovery.rediscover` | true | Rediscovery de paths/binarios |
| `recovery.reinstall` | true | Reinstalar pack sellado |
| `recovery.rollback` | true | Rollback a digest anterior |
| `recovery.reclaim` | true | Reclaim leases huérfanos |
| `recovery.export` | true | Exportar ledger |

Ampliar el registry = bump de `capability_registry_digest` en Genesis Seal.

### 4.3 Capability Manifest (plugin → kernel, al registrarse)

```json
{
  "providerRef": "prv_01HZX…",
  "pluginVersion": "1.0.0",
  "offers": [
    {
      "capabilities": ["repo.edit", "shell.run"],
      "constraints": {
        "locality": "host",
        "tier": 1,
        "workspace": { "mercadeo-ia": true }
      },
      "maxConcurrent": 2,
      "leaseTtlSec": 120
    }
  ],
  "launcherDigest": "sha256:…"
}
```

El kernel emite `CapabilityOfferPublished` por cada offer derivada del manifest.

### 4.4 Pulse (plugin → Capability Index)

```json
{
  "providerRef": "prv_01HZX…",
  "offerId": "ofr_01HZX…",
  "seq": 1842,
  "ts": "2026-07-11T08:30:00Z",
  "status": "HEALTHY",
  "capabilities": ["repo.edit", "shell.run"],
  "constraints": {
    "locality": "host",
    "tier": 1,
    "workspace": { "mercadeo-ia": true }
  },
  "load": { "activeLeases": 1, "maxConcurrent": 2 },
  "lastError": null,
  "lastErrorClass": null
}
```

**Reglas:**

- Sin pulse dentro de `2 × leaseTtl` → offer STALE.
- Sin pulse dentro de `5 × leaseTtl` → offer DEAD (removida del Index).
- `offerId` puede rotar; `providerRef` es estable por sesión de plugin.

### 4.5 Recovery Intent (contrato v0.3)

```json
{
  "action": "repair-capability-provider",
  "target": {
    "capability": "repo.edit",
    "locality": "host",
    "providerRef": "prv_…"
  },
  "mode": "safe",
  "rollback": true,
  "dryRun": true,
  "reason": "ENOENT on probe",
  "requestedBy": "chatgpt"
}
```

Variante abstracta (sin providerRef):

```json
{
  "action": "restore-capability",
  "target": {
    "capability": "repo.edit",
    "locality": "host-preferred"
  },
  "mode": "safe",
  "rollback": true,
  "dryRun": true,
  "reason": "tier-1 gap",
  "requestedBy": "reflex"
}
```

**Whitelist V1 (cerrada):**

| action | Descripción |
|--------|-------------|
| `repair-capability-provider` | Rediscovery + probe + restart controlado |
| `restore-capability` | Restaurar cobertura de una capability (cualquier tier) |
| `rediscover-paths` | Path discovery en plugin afectado |
| `reinstall-launcher` | Reinstala pack sellado del plugin |
| `rollback-launcher` | Digest anterior |
| `restart-plugin` | Restart proceso del plugin |
| `rebuild-capability-index` | Reconstruye Index desde manifests + pulses |
| `reclaim-orphans` | Reabre tasks con lease muerto |
| `register-plugin` | Alta de plugin en Effect Plane |
| `restore-seal-from-mirror` | Crítico: quorum o override |
| `export-ledger` | Exportación auditable |

Cualquier otra `action` → `REJECTED_NOT_IN_WHITELIST`.

---

## 5. Modelo de datos (Ledger V1)

### 5.1 Principio

```
events (append-only, hash chain)     →  fuente de verdad
projections (tasks, offers, gaps)    →  vistas rebuildables
Capability Registry                  →  en Genesis Seal (no en events)
Capability Index                     →  efímero, rebuildable desde pulses
```

```text
LedgerStore {
  append(event) → offset
  readFrom(offset) → events
  getTask(taskId) → TaskProjection
  listOffers(capabilityId?) → OfferProjection[]
  listGaps() → GapProjection[]
  export(from,to) → bundle
  migrate(version)
}
```

### 5.2 Eventos (núcleo v0.3)

| event_type | Payload esencial |
|------------|------------------|
| `TaskAccepted` | taskId, class, requires, constraints, promptRef, client |
| `TaskQueued` | taskId |
| `TaskMatched` | taskId, offerId, score, matchedCapabilities |
| `TaskClaimed` | taskId, offerId, providerRef, leaseUntil, fencingToken |
| `TaskLeaseRenewed` | taskId, leaseUntil |
| `TaskProgress` | taskId, message, percent? |
| `TaskSucceeded` | taskId, artifacts |
| `TaskFailed` | taskId, errorClass, retryable |
| `TaskExpired` | taskId, reason |
| `TaskRequeued` | taskId, fromOffer, cause |
| `CapabilityOfferPublished` | offerId, providerRef, capabilities, constraints |
| `CapabilityOfferHealthChanged` | offerId, from, to, lastError |
| `CapabilityOfferExpired` | offerId, reason |
| `CapabilityLeaseTransferred` | taskId, fromOffer, toOffer, reason |
| `CapabilityGapDetected` | capabilityId, constraints, reason |
| `CapabilityGapResolved` | capabilityId |
| `RecoveryProposed` | recoveryId, intent |
| `RecoveryValidated` | recoveryId |
| `RecoveryDryRunCompleted` | recoveryId, result |
| `RecoveryExecuted` | recoveryId, result |
| `RecoveryRolledBack` | recoveryId |
| `AuditNote` | actor, detail |
| `RuntimeStarted` | version, sealDigest, registryDigest |
| `ModeChanged` | from, to, trigger |

Cada event:

```text
offset, ts, type, payload, prev_hash, hash, actor
```

`hash = H(prev_hash || type || payload || ts || offset)`

### 5.3 Proyección: Task

```text
taskId
class: WORK | RECOVERY
status: QUEUED | MATCHED | CLAIMED | RUNNING | SUCCEEDED | FAILED | EXPIRED | CANCELLED
priority: low | normal | high | critical
requires: { allOf: [], anyOf: [] }
constraints: { locality, tier }
claimedOffer?
claimedProviderRef?          # opaco, audit/fencing
leaseUntil?
fencingToken?
attempt
matchScore?
lastError?
gaps[]                       # capabilityIds sin cobertura
createdAt, updatedAt
promptRef / recoveryIntentRef
```

### 5.4 Proyección: Offer (Capability Index)

```text
offerId                      # opaco, puede rotar
providerRef                  # opaco, estable por sesión plugin
capabilities[]
constraints:
  locality: host | region | any
  tier: 1 | 2 | 3
  workspace: { name: bool }
health: PUBLISHED | HEALTHY | DEGRADED | STALE | DEAD
load: { activeLeases, maxConcurrent }
lastPulseAt
lastError
lastErrorClass               # ENOENT | TIMEOUT | PROBE_FAIL | NETWORK | …
leaseTtlSec
publishedAt, updatedAt
```

**Regla:** offers con solo `recovery.*` ⇒ `eligibleForWork=false`.

### 5.5 Proyección: Capability Gap

```text
capabilityId
constraintsSnapshot
reason: NO_OFFERS | ALL_STALE | ALL_DEAD | TIER_GAP | LOCALITY_GAP
detectedAt
resolvedAt?
affectedTaskCount
```

### 5.6 Proyección: Recovery Action

```text
recoveryId
intent (JSON validado)
status: PROPOSED | VALIDATED | REJECTED | DRY_RUN | EXECUTED | ROLLED_BACK
whitelistMatch: bool
authz: { actor, decision }
dryRunResult?
executeResult?
rollbackPlan?
createdAt, updatedAt
```

---

## 6. Intent Matcher (algoritmo de routing)

### 6.1 Función de score

Para cada offer candidata que cubre `requires` (allOf satisfecho):

```text
score(offer, task) =
    W_cov  × capability_coverage(requires, offer.capabilities)
  + W_tier × tier_match(task.constraints.tier, offer.constraints.tier)
  + W_loc  × locality_match(task.constraints.locality, offer.constraints.locality)
  + W_hlt  × health_weight(offer.health)
  + W_ws   × workspace_match(task.workspace, offer.constraints.workspace)
  - W_load × (offer.load.activeLeases / offer.load.maxConcurrent)
  - W_stl  × staleness_penalty(offer.lastPulseAt)
```

**Defaults:**

| Peso | Valor | Significado |
|------|-------|-------------|
| W_tier | alto | Preferir tier-1 (host) sobre tier-2 (cloud) |
| W_loc | alto | `host-required` es filtro duro, no solo score |
| W_hlt | medio | HEALTHY > DEGRADED; STALE/DEAD excluidos |
| W_load | bajo | Balanceo simple |

### 6.2 Selección

```
1. Filtrar: health ∈ {HEALTHY, DEGRADED}, cubre requires, no recovery-only
2. Aplicar filtros duros de constraints (host-required, tier.max)
3. Ordenar por score descendente
4. Elegir top-1; emitir TaskMatched
5. Lease Broker intenta claim; si falla (race), probar siguiente
6. Si ninguna: emitir CapabilityGapDetected; task permanece QUEUED
```

### 6.3 Failover

No hay cadena Local→Cloud. Hay **re-match**:

```
lease expire | offer DEAD | TaskFailed(retryable)
  → TaskRequeued
  → CapabilityLeaseTransferred
  → Intent Matcher (excluye fromOffer)
  → nuevo claim o gap
```

---

## 7. Máquinas de estado

### 7.1 Task (WORK)

```
QUEUED ──match──► MATCHED ──claim──► CLAIMED ──start──► RUNNING ──► SUCCEEDED
   ▲                  │                  │                  │
   │                  │ claim fail       │ lease expire     ├──► FAILED
   │                  ▼                  ▼                  │
   └──────────── requeue ◄──────── EXPIRED ◄────────────────┘
                      │
                      └── attempt++ → QUEUED
```

### 7.2 Task (RECOVERY)

```
QUEUED → MATCHED → CLAIMED(recovery-runtime) → DRY_RUN → EXECUTED → SUCCEEDED
                              │                    │
                              └──── REJECT ───────► FAILED
                                                    │
                                               ROLLED_BACK
```

### 7.3 Offer

```
PUBLISHED → HEALTHY ⇄ DEGRADED → STALE → DEAD
                ▲                      │
                └──── pulse resume ────┘
```

### 7.4 Runtime Mode

```
NORMAL ── (gap en requires críticos) ──► DEGRADED ──► RECOVERY
   ▲                                          │              │
   └──────── gaps resueltos ──────────────────┴──────────────┘
```

- **NORMAL:** todas las capabilities del registry con ≥1 offer HEALTHY en tier preferido.
- **DEGRADED:** ≥1 gap; Gate up; WORK tasks QUEUED; Reflex activo.
- **RECOVERY:** gaps persistentes o recovery-runtime es la única autoridad; P10 garantizado.

---

## 8. Secuencia de ejecución (WORK)

```
Client       Gateway      Ledger       Matcher      LeaseBroker    Plugin
  │             │            │             │              │           │
  │ POST prompt │            │             │              │           │
  │────────────►│            │             │              │           │
  │             │ append TaskAccepted/Queued             │           │
  │             │───────────►│             │              │           │
  │◄── 202      │            │             │              │           │
  │             │            │ notify      │              │           │
  │             │            │────────────►│              │           │
  │             │            │  score offers              │           │
  │             │            │◄─TaskMatched─│              │           │
  │             │            │─────────────┼─────────────►│           │
  │             │            │             │   claim lease  │──────────►│
  │             │            │◄─TaskClaimed─┼──────────────┼───────────│
  │             │            │             │              │  execute  │
  │ GET task    │            │             │              │           │
  │────────────►│ read proj  │             │              │           │
  │◄─ RUNNING   │◄───────────│             │              │           │
  │             │            │◄─ Succeeded ─┼──────────────┼───────────│
```

**Nunca** hay ejecución en el hilo HTTP del POST.

---

## 9. Recovery (pipeline cerrado)

```
NL (ChatGPT) o Reflex
  → Parser (schema)
  → Recovery Intent JSON
  → Validate (schema + semantics)
  → Whitelist match
  → Authorization
  → Dry Run (recovery-runtime simula)
  → Execute (recovery-runtime)
  → Audit events
  → Rollback si mode=safe && rollback=true
```

**Ejemplo: gap en repo.edit@host tier-1**

1. Gap Aggregator detecta `CapabilityGapDetected(repo.edit, LOCALITY_GAP)`
2. Reflex emite `restore-capability` o humano vía ChatGPT
3. Dry-run: recovery-runtime lista plugins con repo.edit; reporta paths/probes
4. Execute: repair plugin, re-pulse, offer HEALTHY
5. Gap Resolved → Matcher drena QUEUED
6. Si falla → `reinstall-launcher` / `rollback-launcher`
7. Si 0 offers WORK → RECOVERY; Nexus administrable

**ENOENT** sigue siendo `lastErrorClass` en pulse del plugin; el kernel solo ve offer DEGRADED/DEAD, no el path.

---

## 10. recovery-runtime (diseño cerrado)

**Naturaleza:** plugin interno del runtime Nexus, no un “executor bootstrap” nombrado en el kernel.  
**Capabilities:** solo `recovery.*`  
**eligibleForWork:** false siempre

| Capacidad | Detalle |
|-----------|---------|
| `recovery.repair` | Reparar provider de una capability |
| `recovery.rediscover` | Path discovery en plugin |
| `recovery.reinstall` | Pack sellado |
| `recovery.rollback` | Digest anterior |
| `recovery.reclaim` | Leases huérfanos |
| `recovery.export` | Export ledger |

Al arrancar Runtime:

1. Verifica Genesis Seal (firma + epoch + registryDigest)
2. Abre Ledger (WAL)
3. Emite `RuntimeStarted`
4. Reclama orphans (`recovery.reclaim` interno)
5. Publica offers recovery-runtime en Index
6. Espera manifests/pulses de plugins WORK
7. Si 0 offers WORK para capabilities core → RECOVERY

---

## 11. Plugins del Effect Plane (contrato)

Todo plugin implementa:

```text
onRegister() → CapabilityManifest
onPulse()    → cada leaseTtl/2 segundos
onClaim(task, lease) → accept | reject
onExecute(task) → progress events → result
onRelease(lease)
```

**Reglas:**

- Plugin no elige tasks; solo acepta/rechaza claims sobre sus offers.
- Plugin no conoce otros plugins.
- Path discovery, launcher, binarios: **dentro del plugin**.
- Un mismo vendor puede publicar múltiples offers (ej. tier-1 host + tier-2 cloud) como **dos plugins o dos offers**.

### 11.1 Ejemplo: dos plugins, misma capability

| providerRef | tier | locality | Uso |
|-------------|------|----------|-----|
| prv_local_… | 1 | host | Dev agent local |
| prv_cloud_… | 2 | any | Cloud agent |

Failover emerge del scorer, no de regla hardcoded.

---

## 12. Diseño de pruebas (matriz v0.3)

| ID | Escenario | Expectativa |
|----|-----------|-------------|
| T01 | Plugin tier-1 caído | Re-match a tier-2 o QUEUED + gap; sovereign_ok=true |
| T02 | Ruta inválida en plugin | offer DEGRADED; Nexus no crash |
| T03 | ENOENT en plugin | lastErrorClass; repair-capability-provider; Gate vivo |
| T04 | Internet caída | tier-1 sigue; tier-2 STALE; WORK en tier-1 |
| T05 | Offer muerta mid-task | lease expire → re-match → otra offer o gap |
| T06 | Recovery whitelist | action desconocida → REJECTED |
| T07 | Recovery happy path | dry-run → execute → gap resolved |
| T08 | Reinicio Runtime | orphans reclaimed; seal local basta |
| T09 | Reanudación tasks | QUEUED/EXPIRED re-match post-restart |
| T10 | Cloudflare 524 | solo 202; poll independiente |
| T11 | Reflex auto-repair | emite restore-capability sin ChatGPT |
| T12 | recovery-runtime no toma WORK | aunque sea único vivo |
| T13 | Mirror off-host down | arranque OK |
| T14 | Divergence seal | gana local; restore crítico |
| T15 | Quorum crítico | deny o override auditado |
| T16 | Nuevo plugin sin kernel change | manifest + pulse → matcher lo usa |
| T17 | Cliente envía providerRef | 400 |
| T18 | Dos plugins compiten | un lease gana; otro reject limpio |
| T19 | Capability no en Registry | TaskAccepted → REJECTED_UNKNOWN_CAPABILITY |
| T20 | Offer STALE | excluida del matcher; gap si era única |

---

## 13. Riesgos

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Capability sprawl | Alta | Registry en Seal; namespaces; equivalence classes |
| Equivalencia ambigua | Media | `equivalence[]` explícito en Registry |
| Race en claim de offers | Alta | leases + fencing tokens + offer TTL |
| Debug abstracto | Media | `/v1/observability/providers` fuera del kernel |
| Fase A' más costosa que v0.2 | Media | vocabulario mínimo (8–12 capabilities) |
| recovery-runtime como dios | Crítica | P11 + T12; solo recovery.* |
| Hash chain + multiwriter | Alta | single event appender |
| Parser LLM alucina actions | Media | schema + whitelist |
| SPOF host OS | Alta | Fase F: watchdog OS |

---

## 14. Plan de implementación por fases

### Fase A' — Kernel + un plugin (primer valor real)

**Objetivo:** ChatGPT nunca pierde a Nexus aunque el plugin tier-1 esté muerto.

Entregar:

1. Capability Registry mínimo en Genesis Seal
2. Ledger + events v0.3 + proyecciones Task/Offer/Gap
3. `POST /v1/prompt` → 202 con requires + constraints
4. `GET /v1/tasks/{id}`, `GET /v1/health`, `GET /v1/capabilities`
5. Capability Index + Intent Matcher + Lease Broker
6. Un plugin tier-1 publicando `repo.edit` + `shell.run`
7. recovery-runtime registrado (solo recovery.*, sin execute real aún)
8. Gap + mode DEGRADED
9. Tests: T01 (parcial), T08, T09, T10, T12, T17, T19

**Fuera de Fase A':** segundo plugin, recovery execute completo, mirror.

### Fase B' — Path discovery en plugin + errores ENOENT

- Plugin implementa rediscovery interno
- Pulse reporta `lastErrorClass`
- Tests: T02, T03

### Fase C' — Recovery pipeline completo

- Whitelist + dry-run + execute + rollback
- Reflex auto-repair básico
- Tests: T06, T07, T11

### Fase D' — Segundo plugin (tier-2) + failover por re-match

- Cloud plugin publica mismas capabilities tier-2
- Failover mid-task
- Tests: T04, T05, T16, T18

### Fase E' — Genesis Seal mirror + quorum + chaos

- Mirror off-host
- Ops críticas + override
- Tests: T13–T15 + chaos

### Fase F' — HA Sovereign Plane + watchdog OS

- Réplica control plane
- Watchdog servicio OS

---

## 15. Migración conceptual v0.2 → v0.3

| Concepto v0.2 | Equivalente v0.3 |
|---------------|------------------|
| `executor.cursor-agent` | `providerRef` opaco + alias en observability |
| `kind=LOCAL` | `constraints.tier=1, locality=host` |
| `kind=CLOUD` | `constraints.tier=2, locality=any` |
| `executor.bootstrap` | recovery-runtime plugin |
| `Executor Registry` | Capability Registry + Capability Index |
| `Claim Broker` | Intent Matcher + Lease Broker |
| `ExecutorFailover` event | `CapabilityLeaseTransferred` |
| `repair-executor` action | `repair-capability-provider` |
| Failover Local→Cloud | score(tier=1) > score(tier=2) |

**No hay migración de código** (aún sin implementación). Es rediseño pre-Fase A.

---

## 16. Crítica global: ¿por qué v0.3 y no v0.2?

### v0.2 era válida si…

- Solo existirán 2 manos para siempre (Local + Cloud).
- No habrá agentes especializados (linter, deploy, GPU, etc.).
- El equipo acepta refactor en Fase D.

### v0.3 es superior si…

- Nexus es runtime multi-año para Mercadeo IA.
- Habrá N agentes con capacidades solapadas.
- El kernel debe permanecer estable mientras los plugins cambian.
- Failover debe ser política de scoring, no hardcode.

### Alternativa rechazada: “Capability Registry sin Kernel reflexivo”

Solo catálogo + cola manual. **Rechazada:** sin Reflex Controller y Gap Aggregator, los gaps no se cierran automáticamente y ChatGPT vuelve a ser el operador de turno.

### Deuda consciente (igual que v0.2)

- Réplica multi-host del Sovereign Plane
- Interactive/streaming con failover
- Governance de prompts de negocio
- Marketplace abierto de plugins de terceros

---

## 17. Definition of Done del diseño

El diseño se considera cerrado para iniciar Fase A' cuando:

- [x] D1–D6 resueltas
- [x] P1–P18 ratificados
- [x] Kernel capability-first; plugins en Effect Plane
- [x] recovery-runtime no claima WORK
- [x] Contratos API 202 con requires + constraints
- [x] Modelo events + proyecciones Offer/Gap
- [x] Intent Matcher con scoring documentado
- [x] Recovery pipeline con whitelist v0.3
- [x] Matriz de pruebas T01–T20
- [x] Fases A'–F'
- [x] Migración conceptual v0.2 documentada

**Siguiente paso tras aprobación explícita:** implementar solo Fase A'.

---

## 18. Resumen ejecutivo para ChatGPT

1. **Cambio central:** Nexus ya no conoce executors en el Intent Plane; conoce **capacidades** y **ofertas**.
2. **Plugins** publican manifests y pulses; el **Intent Matcher** empareja intents con ofertas por score.
3. **Failover** = re-match, no Local→Cloud hardcoded.
4. **recovery-runtime** reemplaza bootstrap como plugin interno con solo `recovery.*`.
5. **providerRef** existe solo para audit/fencing (opaco); routing no usa nombres de vendor.
6. **Fase A'** redefine el primer entregable: Registry + Matcher + 1 plugin, sin Executor Registry.
7. **Aún sin código** hasta OK final del equipo.

### Preguntas sugeridas para la revisión

- ¿El scoring propuesto es suficiente o falta un constraint solver explícito?
- ¿`equivalence classes` en el Registry resuelven bien el solapamiento repo.edit / git.write?
- ¿P18 (offers efímeras) introduce riesgo de flapping en el matcher?
- ¿La separación Kernel / Observability es limpia o hay leakage?
- ¿Fase A' es el slice mínimo correcto o se puede recortar más?

---

*Nexus Sovereign Reflex Architecture v0.3 — Capability Registry + Sovereign Reflex Kernel. Sin implementación.*
