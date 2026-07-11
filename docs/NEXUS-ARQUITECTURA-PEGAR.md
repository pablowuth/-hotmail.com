# NEXUS — ARQUITECTURA CERRADA v0.2
## Documento único para revisión (humano · ChatGPT · Cursor/Grok)

**Estado:** diseño cerrado — SIN CÓDIGO  
**Objetivo:** sistema autorreparable sin puntos únicos de falla en el plano de ejecución  
**PR:** https://github.com/pablowuth/-hotmail.com/pull/4

---

# 0. VEREDICTO

Nexus es un **runtime soberano de intents**:

- acepta trabajo por API asíncrona
- lo registra en un ledger durable
- lo asigna por **capacidad + prioridad + salud** a manos intercambiables
- el Control Plane **nunca** ejecuta trabajo de proyecto
- si todas las manos caen, Nexus **sigue administrable** en Recovery Mode

Nexus deja de “llamar a un executor” y pasa a publicar intenciones durables que cualquier mano viva puede reclamar.

---

# 1. PROBLEMA QUE ESTAMOS ELIMINANDO

Arquitectura actual:

```
ChatGPT → Nexus Inbox → executor.cursor-agent → Proyecto
```

Clase de fallos:

- `EXECUTOR_UNAVAILABLE`
- `ENOENT` (ruta hardcodeada a `node.exe`)
- `WAITING_EXECUTOR` infinito
- `workspace_access = false` confundido con “Nexus muerto”
- dependencia de un solo executor / launcher / ruta / IA

Reparar el ENOENT de hoy **no elimina** la clase. Hay que romper el pipeline único.

---

# 2. DECISIONES CERRADAS + CRÍTICA DEL ARQUITECTO

## D1 — Genesis Seal

**Decisión:**

- Local = autoridad operativa
- Mirror off-host firmado = respaldo / auditoría / integridad
- El arranque **nunca** depende del mirror

**Veredicto:** APROBADO

**Mejoras obligatorias:**

- Si local y mirror divergen → **gana local**
- Restaurar desde mirror solo con acción explícita: `restore-seal-from-mirror`
- La private key no vive en el mirror
- Usar `seal_epoch` monotónico para evitar rollback accidental a un seal viejo

**Principio:** Local = autoridad operativa. Off-host = respaldo verificable.

---

## D2 — Segunda mano / Failover

**Decisión original de la ronda:**

```
Local → Cloud → Bootstrap
```

**Veredicto:** PARCIALMENTE RECHAZADO

### Objeción fuerte

Poner **bootstrap** en la cadena de failover de trabajo normal es un error arquitectónico:

1. Convierte a bootstrap en un nuevo “dios”
2. Oculta el estado degradado (disponibilidad falsa)
3. Contradice “Control Plane no depende de executors” y “reparaciones reversibles/acotadas”
4. Si bootstrap puede hacer `shell.run` / `git.commit` de proyecto, vuelve el SPOF semántico

### Enmienda adoptada (superior)

```
Trabajo de proyecto (class = WORK):
  Local Hand → Cloud Hand → (nadie) → Task queda QUEUED
  + mode = DEGRADED / RECOVERY
  Bootstrap NO claima WORK

Trabajo de recuperación (class = RECOVERY):
  Solo Bootstrap (whitelist)
```

Cursor deja de ser “EL ejecutor”.  
Cursor pasa a ser un miembro más del Executor Registry.

**Transparencia al usuario:**

- En tareas async: mismo `taskId`, cambia `claimedBy` → sí puede ser transparente
- En sesiones interactivas/streaming de Cursor: **no** es transparente  
  No prometamos magia ahí

---

## D3 — Ledger

**Decisión:**

- SQLite embebido en V1
- WAL
- append-only lógico
- hash encadenado
- backups
- migraciones versionadas
- exportación
- funciona sin Internet
- interfaz migrable a PostgreSQL después

**Veredicto:** APROBADO

**Matiz importante:**

- `events` = append-only real (fuente de verdad) + hash chain
- tablas `*_current` = proyecciones rebuildables
- un solo writer de eventos (evita corrupción de hash bajo concurrencia)
- Cloudflare 524 se mitiga con API 202, no con “SQLite más rápido”

---

## D4 — Recovery Mode

**Decisión:** NO ejecutar lenguaje natural directamente.

Flujo:

```
Lenguaje Natural
  → Parser
  → Recovery Intent estructurado
  → Validación
  → Lista Blanca
  → Autorización
  → Dry Run
  → Ejecución
  → Auditoría
```

Ejemplo:

```json
{
  "action": "repair-executor",
  "target": "executor.cursor-agent",
  "mode": "safe",
  "rollback": true
}
```

**Principio:** El LLM propone. El Runtime decide.

**Veredicto:** APROBADO — excelente

**Mejora:** si el parse falla → `REJECTED_UNPARSEABLE`. Nunca “best effort execute”.

---

## D5 — Quórum

**Decisión:**

- NORMAL: ≥ 1 mano sana
- Operaciones críticas: ≥ 2 manos  
  (Genesis Seal, secretos, rollback profundo, cambios de arquitectura, recuperación crítica)

**Veredicto:** APROBADO con refinamiento

**Refinamiento:**

- “Mano” para WORK = Local o Cloud en estado HEALTHY
- Bootstrap **no cuenta** como mano de quorum de WORK
- Si no hay 2 manos para ops críticas: permitir **Critical Override humano** explícito + audit  
  Si no, un nodo solo nunca podría rotar el seal

---

# 3. PRINCIPIOS DEFINITIVOS

## Ratificados (P1–P10)

P1. El Control Plane nunca depende de un executor.  
P2. Toda tarea normal puede ejecutarse con una sola mano sana.  
P3. Toda tarea larga será asíncrona.  
P4. Health, Polling y Recovery nunca podrán bloquearse por un executor.  
P5. Recovery utiliza Recovery Intents estructurados y lista blanca.  
P6. SQLite será el Ledger operativo en V1.  
P7. Genesis Seal tendrá copia local y mirror off-host.  
P8. Toda reparación debe ser auditable y reversible.  
P9. Nunca usar rutas hardcodeadas para localizar executors. Siempre descubrimiento dinámico.  
P10. Si todos los executors fallan, Nexus debe seguir siendo administrable.

## Añadidos tras crítica (P11–P14)

P11. Bootstrap no ejecuta Tasks clase WORK.  
P12. Failover de WORK = Local → Cloud solamente.  
P13. Los events del ledger son la fuente de verdad; las tablas current son proyecciones.  
P14. El Runtime rechaza bind-by-name de executors desde clientes externos.

---

# 4. DIAGRAMAS

## 4.1 Planos

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTES                                 │
│         ChatGPT · Agentes · UI · Automatizaciones            │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS (async)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 SOVEREIGN PLANE                              │
│  API Gateway │ Health │ Polling │ Recovery Console           │
│  Parser(NL→Intent) │ AuthZ │ Dry-Run Engine                  │
│  Pulse Aggregator │ Reflex Controller                        │
│  Genesis Seal (local)  ··· mirror off-host (opcional)        │
└───────────────┬──────────────────────────────┬──────────────┘
                │                              │
                ▼                              ▼
┌───────────────────────────────┐   ┌─────────────────────────┐
│         INTENT PLANE          │   │   BOOTSTRAP (interno)   │
│  Ledger (SQLite)              │   │   solo RECOVERY         │
│  Claim Broker                 │   │   whitelist + rollback  │
│  Executor Registry            │   └─────────────────────────┘
│  Capability Index             │
└───────────────┬───────────────┘
                │ claim WORK
        ┌───────┴───────┐
        ▼               ▼
   Hand LOCAL      Hand CLOUD
   (prioridad 1)   (prioridad 2)
        │               │
        └───────┬───────┘
                ▼
            Proyecto
```

## 4.2 Clases de tarea

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
   Broker: Local→Cloud      Broker: Bootstrap only
            │                       │
            ▼                       ▼
   Hands de proyecto         Whitelist repair ops
```

---

# 5. COMPONENTES Y RESPONSABILIDADES

| Componente | Plano | Puede | No puede |
|------------|-------|-------|----------|
| API Gateway | Sovereign | Auth, 202, polling | Ejecutar trabajo |
| Health Oracle | Sovereign | sovereign/intent/effect | Preguntar a un Hand para saber si Nexus vive |
| Recovery Console | Sovereign | Pipeline NL→audit | Ejecutar fuera de whitelist |
| Parser | Sovereign | NL → JSON schema | Ejecutar |
| Reflex Controller | Sovereign | desired↔observed; emitir RECOVERY | Shell arbitrario |
| Pulse Aggregator | Sovereign | ALIVE/STALE/DEAD | — |
| LedgerStore | Intent | Events + proyecciones | Conocer Cursor |
| Claim Broker | Intent | Asignar por capability+priority+health | Bind forzado desde cliente |
| Executor Registry | Intent | Catálogo + failover policy | Rutas hardcodeadas como identidad |
| Path Oracle | Effect/Bootstrap | Discovery dinámico | Una sola ruta fija |
| Hand Local | Effect | Ejecutar WORK | Definir salud de Nexus |
| Hand Cloud | Effect | Ejecutar WORK (failover) | Ser obligatorio para arrancar |
| executor.bootstrap | Runtime interno | Solo RECOVERY | Ejecutar WORK de proyecto |

---

# 6. CONTRATOS

## 6.1 API asíncrona

### POST /v1/prompt

Nunca ejecuta dentro del request HTTP.

Request conceptual:

```json
{
  "prompt": "Implementar X en Mercadeo IA",
  "workspace": "mercadeo-ia",
  "priority": "normal",
  "client": { "id": "chatgpt", "request_id": "…" },
  "requires": { "capabilities": ["repo.edit", "shell.run"] }
}
```

Response:

```http
HTTP/1.1 202 Accepted
```

```json
{
  "taskId": "tsk_01HZX…",
  "status": "QUEUED",
  "pollUrl": "/v1/tasks/tsk_01HZX…",
  "acceptedAt": "2026-07-11T01:50:00Z"
}
```

Reglas:

- Timeout HTTP corto
- Idempotencia por `client.request_id`
- Si viene `executorId` / `bindTo` → 400 (P14)

### GET /v1/tasks/{taskId}

Proyección actual + últimos eventos.

### GET /v1/health

```json
{
  "mode": "NORMAL | DEGRADED | RECOVERY",
  "sovereign_ok": true,
  "intent_ok": true,
  "effect_ok": false,
  "hands": { "healthy": 0, "registered": 2 },
  "workspace_access": null
}
```

`workspace_access` es por hand en `/v1/executors`, no verdad global de Nexus.

### Recovery endpoints

- `POST /v1/recovery/parse` — NL → propuesta (no ejecuta)
- `POST /v1/recovery/intents` — crea Recovery Intent
- `POST /v1/recovery/intents/{id}/dry-run`
- `POST /v1/recovery/intents/{id}/execute`

## 6.2 Recovery Intent

```json
{
  "action": "repair-executor",
  "target": "executor.cursor-agent",
  "mode": "safe",
  "rollback": true,
  "dryRun": true,
  "reason": "ENOENT on probe",
  "requestedBy": "chatgpt"
}
```

### Whitelist V1

| action | Descripción |
|--------|-------------|
| repair-executor | Rediscovery + probe + restart controlado |
| rediscover-paths | Path Oracle refresh |
| reinstall-launcher | Reinstala pack sellado |
| rollback-launcher | Vuelve digest anterior |
| restart-worker | Restart proceso hand |
| rebuild-registry | Reconstruye desde Genesis Seal local |
| reclaim-orphans | Reabre tasks con lease muerto |
| register-executor | Alta de hand |
| restore-seal-from-mirror | Crítico: quorum o override |
| export-ledger | Exportación auditable |

Cualquier otra action → `REJECTED_NOT_IN_WHITELIST`

## 6.3 Pulse (Hand → Aggregator)

```json
{
  "executorId": "executor.cursor-agent",
  "seq": 1842,
  "ts": "…",
  "status": "HEALTHY",
  "capabilities": ["repo.edit", "shell.run"],
  "workspaceAccess": { "mercadeo-ia": true },
  "launcherDigest": "sha256:…",
  "lastError": null
}
```

---

# 7. MODELO DE DATOS (LEDGER V1)

## Principio

```
events (append-only, hash chain)  →  fuente de verdad
projections (tasks, executors, …) →  vistas rebuildables
```

Interface:

```
LedgerStore {
  append(event) → offset
  readFrom(offset) → events
  getTask(taskId) → TaskProjection
  listExecutors() → ExecutorProjection[]
  export(from,to) → bundle
  migrate(version)
}
```

SQLite hoy / Postgres mañana: solo cambia el adapter.

## Eventos núcleo

- TaskAccepted / TaskQueued / TaskClaimed / TaskLeaseRenewed
- TaskProgress / TaskSucceeded / TaskFailed / TaskExpired / TaskRequeued
- ExecutorRegistered / ExecutorHealthChanged / ExecutorFailover
- RecoveryProposed / RecoveryValidated / RecoveryDryRunCompleted
- RecoveryExecuted / RecoveryRolledBack
- AuditNote / RuntimeStarted / ModeChanged

Cada event:

```
offset, ts, type, payload, prev_hash, hash, actor
hash = H(prev_hash || type || payload || ts || offset)
```

## Proyección Tasks

```
taskId
class: WORK | RECOVERY
status: QUEUED | CLAIMED | RUNNING | SUCCEEDED | FAILED | EXPIRED | CANCELLED
priority: low | normal | high | critical
requires.capabilities[]
workspace?
claimedBy?
leaseUntil?
fencingToken?
attempt
lastError?
createdAt, updatedAt
promptRef / recoveryIntentRef
```

## Proyección Executor Registry

```
executorId                 # executor.cursor-agent | executor.cloud-1 | executor.bootstrap
kind: LOCAL | CLOUD | BOOTSTRAP
priority                   # 1=local, 2=cloud, 0=bootstrap (solo RECOVERY)
state: REGISTERED | HEALTHY | DEGRADED | UNHEALTHY | DISABLED
capabilities[]
launcher:
  packId
  digest
  pathCandidates[]         # nunca una sola ruta como identidad
  discoveredPath?          # resultado Path Oracle
health:
  lastPulseAt
  consecutiveFailures
  lastError
  lastErrorClass           # ENOENT | TIMEOUT | PROBE_FAIL | NETWORK | …
  workspaceAccess{}
failover:
  canAcceptWork: bool      # false para bootstrap
  maxConcurrent
  weight
registeredAt, updatedAt
```

Regla dura: `kind=BOOTSTRAP` ⇒ `canAcceptWork=false` siempre.

## Recovery Actions

```
recoveryId
intent (JSON validado)
status: PROPOSED | VALIDATED | REJECTED | DRY_RUN | EXECUTED | ROLLED_BACK
whitelistMatch
authz
dryRunResult?
executeResult?
rollbackPlan?
createdAt, updatedAt
```

## Logs / Auditoría

- Logs operativos: archivos rotativos referenciados desde events
- Auditoría: solo via events. No hay “log que nadie lee”

---

# 8. ESTADOS

## Task WORK

```
QUEUED → CLAIMED → RUNNING → SUCCEEDED
                 ↘ EXPIRED → requeue → QUEUED
                 ↘ FAILED (retryable?) → requeue / stop
```

## Task RECOVERY

```
QUEUED → CLAIMED(bootstrap) → DRY_RUN → EXECUTED → SUCCEEDED
                            ↘ REJECT/FAILED → ROLLED_BACK?
```

## Executor

```
REGISTERED → HEALTHY ⇄ DEGRADED → UNHEALTHY → DISABLED
                ▲                      │
                └──── repair success ──┘
```

## Runtime Mode

```
NORMAL → (0 healthy WORK hands) → DEGRADED → RECOVERY
  ▲                                  │          │
  └──────── hands restored ──────────┴──────────┘
```

- DEGRADED: Gate up; WORK queda QUEUED; recovery activo
- RECOVERY: igual + recovery priorizado; P10 garantizado

---

# 9. SECUENCIA DE EJECUCIÓN (WORK)

```
1. Client POST /v1/prompt
2. Gateway valida + append TaskAccepted/Queued
3. Responde 202 + taskId + QUEUED
4. Claim Broker selecciona mano HEALTHY por prioridad (Local, luego Cloud)
5. Claim con lease + fencingToken
6. Hand ejecuta fuera del request HTTP
7. Hand renueva lease + emite Pulse + Progress
8. Hand reporta SUCCEEDED o FAILED
9. Client hace poll GET /v1/tasks/{id}
```

Si no hay manos: Task permanece QUEUED; mode=DEGRADED/RECOVERY; Gate sigue vivo.

---

# 10. RECOVERY

## Pipeline

```
NL → Parser → Recovery Intent → Validate → Whitelist
  → AuthZ → Dry Run → Execute → Audit → Rollback disponible
```

## Caso ENOENT de hoy, reescrito

1. Probe falla → `lastErrorClass=ENOENT`
2. Reflex o ChatGPT proponen `repair-executor`
3. Dry-run: Path Oracle lista candidatos existentes
4. Execute: actualiza `discoveredPath`, re-probe, restart
5. Si OK → HEALTHY → Broker drena QUEUED
6. Si fail → reinstall-launcher / rollback-launcher
7. Si 0 hands WORK → Mode RECOVERY
8. Nexus sigue administrable (health, polling, logs, recovery, auditoría)

---

# 11. FAILOVER

## Política WORK

```
priority 1: LOCAL  + HEALTHY + capabilities suficientes
priority 2: CLOUD  + HEALTHY + capabilities suficientes
else:       QUEUED + DEGRADED/RECOVERY + CapabilityGap
```

Bootstrap excluido de WORK.

## Disparadores mid-task

- Lease expirado
- Pulse DEAD del claimedBy
- FAILED retryable con errorClass en {EXECUTOR_DEAD, ENOENT, PROBE_FAIL}

Acción: TaskRequeued + ExecutorFailover + claim a siguiente prioridad.

## Cloudflare 524

Causa: request síncrono largo.  
Mitigación: POST 202 + poll. No alargar el HTTP.

---

# 12. BOOTSTRAP EXECUTOR

- Interno al runtime Nexus
- No depende de Cursor / Grok / agentes externos
- Solo operaciones de whitelist RECOVERY
- Soporta: repair, rollback, audit, rebuild registry, reclaim orphans
- `canAcceptWork = false`

## Boot sequence

1. Verificar Genesis Seal local
2. Abrir Ledger (WAL)
3. Emitir RuntimeStarted
4. Reclaim orphans
5. Registrar executor.bootstrap
6. Discovery de Local/Cloud
7. Si 0 WORK hands → Mode RECOVERY

---

# 13. MATRIZ DE PRUEBAS (DISEÑO)

| ID | Escenario | Expectativa |
|----|-----------|-------------|
| T01 | Cursor caído | QUEUED o failover Cloud; sovereign_ok=true |
| T02 | Ruta inválida | Path Oracle sigue; Nexus no crash |
| T03 | Node inexistente ENOENT | errorClass=ENOENT; Gate vivo |
| T04 | Internet caída | Local+SQLite OK; Cloud UNHEALTHY |
| T05 | Executor caído mid-task | lease expire → requeue |
| T06 | Recovery action desconocida | REJECTED |
| T07 | Recovery happy path | dry-run→exec→audit→HEALTHY |
| T08 | Reinicio Runtime | orphans reclaimed; seal local basta |
| T09 | Reanudación tareas | QUEUED/EXPIRED vuelven a claim |
| T10 | Cloudflare 524 | POST corto 202; poll independiente |
| T11 | Recuperación automática | Reflex repara; auditado |
| T12 | Bootstrap no toma WORK | aunque sea el único “vivo” |
| T13 | Mirror off-host down | arranque OK con seal local |
| T14 | Divergence seal | gana local; restore requiere crítico/override |
| T15 | Dual-hand critical | sin 2 hands → deny o override auditado |

---

# 14. RIESGOS

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Bootstrap como dios si se ignora P11 | Crítica | P11/P12 + test T12 |
| Quorum ≥2 bloquea single-node | Alta | Critical Override auditado |
| Hash chain + multiwriter SQLite | Alta | single event appender |
| Path Oracle ejecuta binario equivocado | Alta | digest allowlist + firma pack |
| Cloud hand depende de red | Media | Local first; T04 |
| Parser LLM alucina actions | Media | schema + whitelist |
| Failover “invisible” en interactive | Media | Solo garantizar async taskId |
| Sobre-diseño antes de Fase A | Alta | fases estrictas |
| SPOF del host OS | Alta | watchdog/HA en Fase F |

---

# 15. PLAN POR FASES (SIN CÓDIGO AÚN)

## Fase A — Supervivencia del Control Plane

Objetivo: ChatGPT no pierde Nexus aunque Cursor esté muerto.

Entregar:

1. Ledger SQLite (events + projections)
2. POST /v1/prompt → 202 QUEUED
3. GET /v1/tasks/{id} + GET /v1/health
4. Executor Registry (Local)
5. Claim Broker con leases (1 hand)
6. WAITING_EXECUTOR → QUEUED + DEGRADED
7. Tests T01, T03 parcial, T08, T09, T10

Fuera de A: Cloud hand, bootstrap repair completo, mirror off-host.

## Fase B — Path Oracle + launcher pack Local

- Discovery dinámico (P9)
- ENOENT no fatal global
- Tests T02, T03

## Fase C — Bootstrap + Recovery pipeline

- Whitelist + dry-run + audit + rollback
- Reflex repair básico
- Tests T06, T07, T11, T12

## Fase D — Cloud Hand + failover Local→Cloud

- Prioridades registry
- Failover mid-task
- Tests T04, T05

## Fase E — Genesis Seal mirror + quorum crítico + chaos

- Mirror off-host
- Ops críticas + override
- Chaos tests
- T13–T15

## Fase F — HA Sovereign Plane / watchdog OS

- Ataca SPOF de host (no de executor)

---

# 16. CRÍTICA GLOBAL / ALTERNATIVAS

## ¿Bootstrap en failover WORK?
Rechazado. Disponibilidad falsa + dios interno.

## ¿Cola externa Redis/SQS en V1?
Rechazada: viola operación sin Internet. `LedgerStore` permite migrar después sin cambiar planos.

## ¿Supervisor único que reinicia Cursor?
Más simple, pero no elimina SPOF de proveedor ni ceguera. Inferior a multi-año.

## Mejora real adoptada
Separar failover de WORK de autoridad de RECOVERY. Dos colas mentales, un solo ledger. Más elegante y más seguro a 5 años.

---

# 17. PEDIDO A CHATGPT

Confirmar o objetar explícitamente:

1. Enmienda P11–P12 (Bootstrap fuera del failover WORK)
2. Critical Override auditado para ops críticas en single-node
3. P13–P14
4. Que el diseño queda cerrado para iniciar **solo Fase A** cuando haya OK del equipo

Si ChatGPT insiste en Local→Cloud→Bootstrap para WORK, debe aceptar conscientemente un dios interno y documentar ese tradeoff.

---

# 18. ESTADO ACTUAL

- Diseño v0.2 cerrado en documento
- SIN implementación todavía
- Próximo paso tras OK: implementar únicamente Fase A

Fin del documento.
