# Nexus Sovereign Reflex — Arquitectura Cerrada v0.2

**Estado:** diseño cerrado — **sin implementación**  
**Supersede:** v0.1 (preguntas abiertas resueltas)  
**Rol de este documento:** contrato de arquitectura para evolución multi-año  
**Autores:** humano · ChatGPT · Cursor/Grok (Arquitecto Principal)

---

## 0. Veredicto

Nexus es un **runtime soberano de intents**: acepta trabajo por API asíncrona, lo registra en un ledger durable, y lo asigna por **capacidad + prioridad + salud** a manos intercambiables. El Control Plane nunca ejecuta trabajo de proyecto. Si todas las manos caen, Nexus sigue administrable en Recovery Mode.

---

## 1. Decisiones cerradas (ronda ChatGPT) + veredicto del Arquitecto

### D1 — Genesis Seal

| Decidido | Veredicto |
|----------|-----------|
| Local = autoridad operativa | **Aprobado** |
| Mirror off-host firmado = respaldo / auditoría / integridad | **Aprobado** |
| Arranque nunca depende del mirror | **Aprobado — no negociable** |

**Crítica / mejora obligatoria:**

- Definir **conflicto local vs mirror**: si divergen, gana local; el mirror solo se usa tras verificación de firma + decisión explícita de recovery (`action: restore-seal-from-mirror`).
- La **clave de firma** del seal es un SPOF criptográfico. Mitigación: clave en DPAPI/OS keystore local + procedimiento de rotación documentado; el mirror no guarda la private key.
- Añadir `seal_epoch` monotónico: impide rollback accidental a un seal viejo del mirror sin quorum crítico.

### D2 — Segunda mano y failover

| Decidido | Veredicto |
|----------|-----------|
| Prioridad: Local → Cloud → Bootstrap | **Parcialmente rechazado** |
| Usuario no nota el cambio | **Aprobado solo para tareas async** |
| Cursor = miembro del registry, no “EL” executor | **Aprobado** |

**Objeción fuerte (no es pedantería):**

Poner **bootstrap en la cadena de failover de trabajo normal** contradice P1/P8 y convierte a bootstrap en dios:

- Bootstrap con `shell.run` / `git.commit` de proyecto = nuevo SPOF semántico.
- Si bootstrap “salva” features cuando Local+Cloud mueren, nunca se fuerza la reparación de manos reales.
- Recovery Mode deja de ser un estado visible: el sistema finge salud ejecutando todo en bootstrap.

**Propuesta superior (adoptada en este doc):**

```
Trabajo de proyecto (Task class = WORK):
  Local Hand → Cloud Hand → (nadie) → Task queda OPEN + mode=DEGRADED/RECOVERY
  Bootstrap NO claima WORK.

Trabajo de recuperación (Task class = RECOVERY):
  Solo Bootstrap (whitelist).
  Opcionalmente, una Hand sana puede asistir probes, pero la autoridad es Bootstrap.
```

Failover transparente para el usuario = mismo `taskId`, cambio de `claimed_by` en el ledger.  
**Honestidad:** sesiones interactivas/streaming de Cursor **no** son transparentes al failover; solo el modelo async 202 lo es. No prometamos magia en sync/interactive.

### D3 — Ledger SQLite V1

| Decidido | Veredicto |
|----------|-----------|
| SQLite embebido, WAL, sin Internet | **Aprobado** |
| Append-only lógico + hash encadenado | **Aprobado con matices** |
| Interface migrable a PostgreSQL | **Aprobado — obligatorio** |
| Backups, migraciones, exportación | **Aprobado** |

**Crítica / mejora:**

- “Append-only lógico” ≠ tablas inmutables. Modelo: tabla `events` append-only real (hash chain); proyecciones (`tasks_current`, `executors_current`) son **materializaciones** rebuildables desde events.
- Un solo writer de eventos (cola interna) evita corrupción de hash chain bajo concurrencia.
- Cloudflare 524 se mitiga con API 202, no con “SQLite más rápido”.

### D4 — Recovery Mode sin NL directo

| Decidido | Veredicto |
|----------|-----------|
| NL → Parser → Recovery Intent → whitelist → auth → dry-run → exec → audit | **Aprobado — excelente** |
| LLM propone, Runtime decide | **Aprobado — principio rector** |

**Mejora:** el Parser vive en Sovereign Plane; puede usar LLM **solo para proponer** JSON schema-validado. Si el parse falla → `REJECTED_UNPARSEABLE`, nunca “best effort execute”.

### D5 — Quórum

| Decidido | Veredicto |
|----------|-----------|
| NORMAL ≥ 1 mano sana | **Aprobado** |
| Crítico ≥ 2 manos | **Aprobado con refinamiento** |

**Refinamiento:**

- “Mano” para quorum de WORK = Hand Local o Cloud en estado `HEALTHY`.
- Bootstrap **no cuenta** como mano de quorum de WORK (evita autoengaño).
- Para ops críticas sin 2 manos: permitir **Critical Override** humano explícito + audit (`override_reason`), no silencio automático. Si no, Genesis Seal nunca se actualiza en un deploy de una sola máquina.

### Principios definitivos (P1–P10) — ratificados

| ID | Principio | Notas de arquitectura |
|----|-----------|------------------------|
| P1 | Control Plane nunca depende de un executor | Gate/Health/Ledger/Recovery no llaman Hands para vivir |
| P2 | Tarea normal con 1 mano sana | Quórum NORMAL = 1 |
| P3 | Toda tarea larga es asíncrona | `POST /v1/prompt` → 202 |
| P4 | Health/Polling/Recovery no se bloquean por executor | Timeouts duros; lecturas solo ledger/oracle |
| P5 | Recovery = intents estructurados + whitelist | Sin NL→exec directo |
| P6 | SQLite Ledger V1 | Detrás de `LedgerStore` interface |
| P7 | Genesis Seal local + mirror off-host | Local autoridad; mirror opcional |
| P8 | Toda reparación auditable y reversible | Dry-run + rollback slot |
| P9 | Nunca rutas hardcodeadas | Path Oracle / discovery |
| P10 | Sin executors, Nexus administrable | Recovery Mode |

**Principios añadidos tras crítica (P11–P14):**

| ID | Principio |
|----|-----------|
| P11 | Bootstrap no ejecuta Tasks clase WORK |
| P12 | Failover de WORK = Local → Cloud solamente |
| P13 | Eventos del ledger son la fuente de verdad; tablas current son proyecciones |
| P14 | El Runtime rechaza bind-by-name de executors desde clientes externos |

---

## 2. Vista de arquitectura (diagramas)

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

### 2.2 Separación de clases de tarea

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

## 3. Componentes (responsabilidades cerradas)

| Componente | Plano | Responsabilidad | No puede |
|------------|-------|-----------------|----------|
| **API Gateway** | Sovereign | Auth, rate limit, 202 Accepted, polling | Ejecutar trabajo |
| **Health Oracle** | Sovereign | `sovereign/intent/effect` status | Preguntar a un Hand para saber si Nexus vive |
| **Recovery Console** | Sovereign | Pipeline NL→…→audit | Ejecutar fuera de whitelist |
| **Parser** | Sovereign | NL → Recovery Intent JSON schema | Ejecutar |
| **Reflex Controller** | Sovereign | desired↔observed; emite RECOVERY tasks | Shell arbitrario |
| **Pulse Aggregator** | Sovereign | ALIVE/STALE/DEAD por pulsos | |
| **LedgerStore** | Intent | Events + proyecciones | Conocer Cursor |
| **Claim Broker** | Intent | Asignar por capability+priority+health | Bind forzado desde cliente |
| **Executor Registry** | Intent | Catálogo de manos + failover policy | Rutas hardcodeadas como identidad |
| **Path Oracle** | Effect/Bootstrap | Discovery dinámico de binarios | Una sola ruta fija |
| **Hand Local** | Effect | Ejecutar WORK | Definir salud de Nexus |
| **Hand Cloud** | Effect | Ejecutar WORK (failover) | Ser obligatorio para arrancar |
| **executor.bootstrap** | Runtime interno | Solo RECOVERY | Ejecutar WORK de proyecto |

---

## 4. Contratos

### 4.1 API asíncrona

#### `POST /v1/prompt`

Acepta un prompt/pedido de trabajo. **Nunca** ejecuta dentro del request.

**Request (conceptual):**

```json
{
  "prompt": "Implementar X en Mercadeo IA",
  "workspace": "mercadeo-ia",
  "priority": "normal",
  "client": { "id": "chatgpt", "request_id": "…" },
  "requires": { "capabilities": ["repo.edit", "shell.run"] }
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
  "acceptedAt": "2026-07-11T01:50:00Z"
}
```

Reglas:

- Timeout del request HTTP: corto (segundos). Trabajo largo = P3.
- Idempotencia: `client.request_id` → mismo `taskId` si se reintenta.
- Prohibido: campo `executorId` / `bindTo` desde cliente (P14). Si viene → 400.

#### `GET /v1/tasks/{taskId}`

Devuelve proyección actual + últimos eventos.

#### `GET /v1/health`

```json
{
  "mode": "NORMAL | DEGRADED | RECOVERY",
  "sovereign_ok": true,
  "intent_ok": true,
  "effect_ok": false,
  "hands": {
    "healthy": 0,
    "registered": 2
  },
  "workspace_access": null
}
```

`workspace_access` solo aparece **por hand** en `/v1/executors`, nunca como verdad global de Nexus.

#### Recovery (ejemplos)

- `POST /v1/recovery/intents` — body = Recovery Intent estructurado
- `POST /v1/recovery/parse` — NL → propuesta (no ejecuta)
- `POST /v1/recovery/intents/{id}/dry-run`
- `POST /v1/recovery/intents/{id}/execute` — requiere authz

### 4.2 Recovery Intent (contrato)

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

**Whitelist V1 (cerrada; ampliar solo por versión de Genesis Seal):**

| action | Descripción |
|--------|-------------|
| `repair-executor` | Rediscovery + probe + restart controlado |
| `rediscover-paths` | Path Oracle refresh |
| `reinstall-launcher` | Reinstala pack sellado |
| `rollback-launcher` | Vuelve digest anterior |
| `restart-worker` | Restart proceso hand |
| `rebuild-registry` | Reconstruye desde Genesis Seal local |
| `reclaim-orphans` | Reabre tasks con lease muerto |
| `register-executor` | Alta de hand en registry |
| `restore-seal-from-mirror` | Crítico: requiere quorum o override |
| `export-ledger` | Exportación auditable |

Cualquier otra `action` → `REJECTED_NOT_IN_WHITELIST`.

### 4.3 Pulse (contrato Hand → Aggregator)

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

## 5. Modelo de datos (Ledger V1)

### 5.1 Principio

```
events (append-only, hash chain)  →  fuente de verdad
projections (tasks, executors, …) →  vistas rebuildables
```

Interface:

```text
LedgerStore {
  append(event) → offset
  readFrom(offset) → events
  getTask(taskId) → TaskProjection
  listExecutors() → ExecutorProjection[]
  export(from,to) → bundle
  migrate(version)
}
```

SQLite hoy / Postgres mañana: **solo cambia el adapter**.

### 5.2 Eventos (núcleo)

| event_type | Payload esencial |
|------------|------------------|
| `TaskAccepted` | taskId, class, requires, promptRef, client |
| `TaskQueued` | taskId |
| `TaskClaimed` | taskId, executorId, leaseUntil, fencingToken |
| `TaskLeaseRenewed` | taskId, leaseUntil |
| `TaskProgress` | taskId, message, percent? |
| `TaskSucceeded` | taskId, artifacts |
| `TaskFailed` | taskId, errorClass, retryable |
| `TaskExpired` | taskId, reason |
| `TaskRequeued` | taskId, fromExecutor, cause |
| `ExecutorRegistered` | executor projection snapshot |
| `ExecutorHealthChanged` | executorId, from, to, lastError |
| `ExecutorFailover` | taskId, from, to, reason |
| `RecoveryProposed` | recoveryId, intent |
| `RecoveryValidated` | recoveryId |
| `RecoveryDryRunCompleted` | recoveryId, result |
| `RecoveryExecuted` | recoveryId, result |
| `RecoveryRolledBack` | recoveryId |
| `AuditNote` | actor, detail |
| `RuntimeStarted` | version, sealDigest |
| `ModeChanged` | from, to |

Cada event:

```text
offset, ts, type, payload, prev_hash, hash, actor
```

`hash = H(prev_hash || type || payload || ts || offset)`

### 5.3 Proyección: Tasks

```text
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

### 5.4 Proyección: Executor Registry

```text
executorId                 # ej. executor.cursor-agent, executor.cloud-1, executor.bootstrap
kind: LOCAL | CLOUD | BOOTSTRAP
priority                   # 1=local, 2=cloud, 0=bootstrap (solo RECOVERY)
state: REGISTERED | HEALTHY | DEGRADED | UNHEALTHY | DISABLED
capabilities[]
launcher:
  packId
  digest
  pathCandidates[]         # nunca una sola ruta hardcodeada como identidad
  discoveredPath?          # resultado actual del Path Oracle
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

**Regla:** `kind=BOOTSTRAP` ⇒ `canAcceptWork=false` siempre.

### 5.5 Recovery Actions

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

### 5.6 Logs / Auditoría

- Logs operativos: stream rotativo (archivo), referenciados desde events.
- Auditoría: **solo** via events (`Recovery*`, `Executor*`, `AuditNote`). No hay “log que nadie lee”.

---

## 6. Máquinas de estado

### 6.1 Task (WORK)

```
QUEUED ──claim──► CLAIMED ──start──► RUNNING ──► SUCCEEDED
   ▲                 │                  │
   │                 │ lease expire     ├──► FAILED (retryable?)
   │                 ▼                  │
   └──────────── EXPIRED ───────────────┘
                      │
                      └── requeue → QUEUED (attempt++)
```

Si `FAILED` y `retryable` y hay otra hand → Broker requeue + posible failover.

### 6.2 Task (RECOVERY)

```
QUEUED → CLAIMED(bootstrap) → DRY_RUN → EXECUTED → SUCCEEDED
                              │            │
                              └─REJECT───► FAILED
                                           │
                                      ROLLED_BACK
```

### 6.3 Executor

```
REGISTERED → HEALTHY ⇄ DEGRADED → UNHEALTHY → DISABLED
                ▲                      │
                └──── repair success ──┘
```

### 6.4 Runtime Mode

```
NORMAL ── (0 healthy WORK hands) ──► DEGRADED ──► RECOVERY
   ▲                                    │            │
   └──────── hands restored ────────────┴────────────┘
```

- **DEGRADED:** Gate up; tasks WORK quedan QUEUED; recovery activo.
- **RECOVERY:** igual + UI/API de recovery priorizada; P10 garantizado.

---

## 7. Secuencia de ejecución (WORK)

```
Client          Gateway         Ledger          Broker           Hand
  │                │               │               │               │
  │ POST /v1/prompt│               │               │               │
  │───────────────►│               │               │               │
  │                │ append TaskAccepted/Queued    │               │
  │                │──────────────►│               │               │
  │◄──── 202 QUEUED│               │               │               │
  │                │               │ notify        │               │
  │                │               │──────────────►│               │
  │                │               │  select HEALTHY by priority   │
  │                │               │  Local first, else Cloud      │
  │                │               │────────────── claim ─────────►│
  │                │               │◄──── lease renew / progress ──│
  │ GET /tasks/id  │               │               │               │
  │───────────────►│ read proj     │               │               │
  │◄──── RUNNING   │◄──────────────│               │               │
  │                │               │◄──── Succeeded ───────────────│
```

**Nunca** hay ejecución en el hilo HTTP del POST.

---

## 8. Recovery (pipeline cerrado)

```
NL (ChatGPT)
  → Parser (schema)
  → Recovery Intent JSON
  → Validate (schema + semantics)
  → Whitelist match
  → Authorization
  → Dry Run (bootstrap simula / checks)
  → Execute (bootstrap)
  → Audit events
  → Rollback disponible si mode=safe && rollback=true
```

Ejemplo ENOENT:

1. Pulse/probe → `lastErrorClass=ENOENT`
2. Reflex crea `repair-executor` (o humano via ChatGPT)
3. Dry-run: Path Oracle lista candidatos; reporta cuáles existen
4. Execute: actualiza `discoveredPath`, re-probe, restart worker
5. Si OK → Executor HEALTHY → Broker drena QUEUED
6. Si fail → `reinstall-launcher` / `rollback-launcher`
7. Si 0 hands WORK → Mode RECOVERY; Nexus sigue administrable

---

## 9. Failover

### 9.1 Política WORK (adoptada)

```
priority 1: kind=LOCAL  AND state=HEALTHY AND capabilities⊇requires
priority 2: kind=CLOUD  AND state=HEALTHY AND capabilities⊇requires
else:       leave QUEUED; mode≥DEGRADED; emit CapabilityGap
```

Bootstrap **excluido**.

### 9.2 Disparadores de failover mid-task

- Lease expirado sin renew
- Pulse DEAD del `claimedBy`
- `TaskFailed` retryable con `errorClass` en {EXECUTOR_DEAD, ENOENT, PROBE_FAIL}

Acción: `TaskRequeued` + `ExecutorFailover` event + claim a siguiente prioridad.

### 9.3 Transparencia al usuario

- Mismo `taskId`
- Polling muestra `claimedBy` actual y `attempt`
- No se miente: si está QUEUED por falta de hands, status/mode lo dicen

### 9.4 Cloudflare 524 / timeouts de borde

Causa raíz: request síncrono largo.  
Mitigación arquitectónica: **202 + poll** (P3).  
Complemento: heartbeats de progreso en ledger para UX; no “alargar el HTTP”.

---

## 10. Bootstrap Executor (diseño cerrado)

**Naturaleza:** proceso/módulo interno del runtime Nexus.  
**Dependencias:** cero agentes externos.  
**Capabilities:** solo las de la whitelist de Recovery.  
**canAcceptWork:** false.

Soporta:

| Capacidad | Detalle |
|-----------|---------|
| Reparación | repair, rediscover, reinstall, restart |
| Rollback | launcher digest anterior + registro de plan |
| Auditoría | todo via Ledger events |
| Registry | rebuild desde Genesis Seal local |
| Orphans | reclaim leases muertos post-crash |

Al arrancar Runtime:

1. Verifica Genesis Seal local (firma + epoch)
2. Abre Ledger (WAL)
3. Emite `RuntimeStarted`
4. Reclama orphans (`reclaim-orphans` interno)
5. Registra/confirma `executor.bootstrap` en Registry
6. Intenta discovery de Local/Cloud hands
7. Si 0 WORK hands → Mode RECOVERY (sigue administrable)

---

## 11. Diseño de pruebas (sin código aún — matriz)

| ID | Escenario | Expectativa |
|----|-----------|-------------|
| T01 | Cursor caído | Tasks QUEUED o failover a Cloud; `/health` sovereign_ok=true |
| T02 | Ruta inválida | Path Oracle prueba siguientes; no crash de Nexus |
| T03 | Node inexistente (ENOENT) | errorClass=ENOENT; repair path; Gate vivo |
| T04 | Internet caída | Local + SQLite siguen; Cloud UNHEALTHY; WORK en Local |
| T05 | Executor caído mid-task | lease expire → requeue → otra hand o QUEUED |
| T06 | Recovery whitelist | action desconocida → REJECTED |
| T07 | Recovery happy path | dry-run → execute → audit → hand HEALTHY |
| T08 | Reinicio Runtime | orphans reclaimed; tasks reanudables; seal local basta |
| T09 | Reanudación tareas | QUEUED/EXPIRED vuelven a claim post-restart |
| T10 | Cloudflare 524 | POST nunca supera umbral; solo 202; poll independiente |
| T11 | Recuperación automática | Reflex emite repair sin ChatGPT; auditado |
| T12 | Bootstrap no toma WORK | aunque sea el único “vivo”, WORK no se claima por bootstrap |
| T13 | Mirror off-host down | arranque OK solo con seal local |
| T14 | Divergence seal | gana local; restore-from-mirror requiere crítico/override |
| T15 | Dual-hand critical | op crítica sin 2 hands → deny o override auditado |

---

## 12. Riesgos (actualizados)

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Bootstrap como dios (si se ignora P11) | Crítica | P11/P12 + test T12 |
| Quorum ≥2 bloquea ops en single-node | Alta | Critical Override auditado |
| Hash chain + multiwriter SQLite | Alta | single event appender |
| Path Oracle ejecuta binario equivocado | Alta | digest allowlist + firma pack |
| Cloud hand añade dependencia de red | Media | Local first; T04 |
| Parser LLM alucina actions | Media | schema + whitelist; nunca exec directo |
| Prometer failover invisible en interactive | Media | Solo garantizar async taskId |
| Sobre-diseño antes de Fase A | Alta | fases estrictas abajo |
| SPOF del host OS | Alta (nombrado) | watchdog servicio OS en fase posterior |

---

## 13. Plan de implementación por fases (aún sin código en este PR)

### Fase A — Supervivencia del Control Plane (primer valor real)

**Objetivo:** ChatGPT nunca pierde a Nexus aunque Cursor esté muerto.

Entregar:

1. Ledger SQLite (`LedgerStore` + events + projections Tasks/Executors)
2. `POST /v1/prompt` → 202 QUEUED
3. `GET /v1/tasks/{id}`, `GET /v1/health` (tres señales)
4. Executor Registry con Local registrado + estados
5. Claim Broker de 1 hand (Local) con leases
6. Reemplazo semántico de `WAITING_EXECUTOR` → QUEUED + mode DEGRADED
7. Tests: T01, T03 (parcial), T08, T09, T10

**Fuera de Fase A:** Cloud hand, bootstrap repair completo, mirror off-host.

### Fase B — Path Oracle + launcher pack Local

- Discovery dinámico (P9)
- ENOENT → errorClass + no fatal global
- Tests T02, T03

### Fase C — Bootstrap + Recovery pipeline

- Whitelist + dry-run + audit + rollback
- Reflex repair automático básico
- Tests T06, T07, T11, T12

### Fase D — Cloud Hand + failover Local→Cloud

- Prioridades registry
- Failover mid-task
- Tests T04, T05

### Fase E — Genesis Seal mirror + quorum crítico + chaos

- Mirror off-host
- Ops críticas + override
- Chaos: matar hands, cortar red, reinicios
- Tests T13–T15 + matriz completa

### Fase F — HA del Sovereign Plane / watchdog OS

- Fuera del SPOF executor; ataca SPOF de host

---

## 14. Crítica global: ¿hay una arquitectura mejor?

### Alternativa considerada: “Supervisor único con plugins”

Un solo process manager que reinicia Cursor. **Más simple**, pero no elimina SPOF de proveedor ni ceguera si el plugin es el mismo Cursor. **Inferior** a Sovereign Reflex para el objetivo multi-año.

### Alternativa considerada: “Cola externa (Redis/SQS) + workers”

Madura y simple operativamente. **Rechazada para V1** porque exige red/infra y viola “funciona sin Internet” (D3/T04). La interface `LedgerStore` permite llegar ahí en V2 **sin** cambiar planos.

### Alternativa considerada: “Bootstrap también ejecuta WORK”

Más “alta disponibilidad aparente”. **Rechazada**: disponibilidad falsa, superficie de daño máxima, contradice P1/P8. Mejor DEGRADED honesto + reparación.

### Qué sí mejoramos respecto de la decisión cruda Local→Cloud→Bootstrap

Separar **failover de WORK** de **autoridad de RECOVERY**. Es más elegante, más seguro y más simple de razonar a 5 años: dos colas mentales, un solo ledger.

### Qué no tocaremos aún (deuda consciente)

- Réplica multi-host del Sovereign Plane
- Interactive/streaming sessions con failover
- Governance de prompts de negocio (Mercadeo IA)

---

## 15. Definition of Done del diseño (para pasar a código)

El diseño se considera cerrado para iniciar Fase A cuando este documento queda aprobado con:

- [x] D1–D5 resueltas
- [x] P1–P14 ratificados
- [x] Bootstrap fuera del failover WORK
- [x] Contratos API 202
- [x] Modelo events + projections
- [x] Registry con prioridades/health/capabilities
- [x] Recovery pipeline con whitelist
- [x] Matriz de pruebas
- [x] Fases A–F

**Siguiente paso tras aprobación explícita:** implementar solo Fase A.

---

## 16. Resumen ejecutivo para ChatGPT

1. Ratificamos D1, D3, D4, D5 y P1–P10.  
2. **Enmendamos D2:** failover WORK = Local → Cloud; Bootstrap solo RECOVERY (P11–P12).  
3. Añadimos P13–P14 (events como verdad; no bind-by-name).  
4. Quorum crítico con **override humano auditado** para single-node.  
5. Fase A diseñada; **aún sin código** hasta OK final del equipo.
