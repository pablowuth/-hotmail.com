# Nexus Sovereign Reflex — Arquitectura v0.1 (diseño)

**Estado:** propuesta de arquitectura — sin implementación  
**Autores de revisión:** Cursor/Grok · ChatGPT · humano  
**Problema raíz:** el plano de ejecución es un SPOF (`executor.cursor-agent` → `EXECUTOR_UNAVAILABLE` / `ENOENT`)  
**Objetivo:** sistema autorreparable donde ningún executor, agente, launcher ni ruta sea indispensable

---

## 0. Veredicto en una frase

Nexus deja de “llamar a un executor” y pasa a **publicar intenciones durables** que cualquier mano viva puede reclamar; el Control Plane (Sovereign Plane) **nunca** ejecuta trabajo de proyecto y **nunca** se apaga cuando fallan los ejecutores.

---

## 1. Diagnóstico del diseño actual (por qué esta clase de fallos es inevitable)

```
ChatGPT → Nexus Inbox → executor.cursor-agent → Proyecto
```

Fallos estructurales (no solo el bug de hoy):

| Fallo | Manifestación actual | Clase |
|-------|----------------------|--------|
| Binding duro a un executor | `executor.cursor-agent` es el único camino | SPOF de identidad |
| Binding duro a una ruta | `...\versions\2026.07.09-a3815c0\node.exe` | SPOF de filesystem |
| Binding duro a un launcher | headless probe = un binario | SPOF de proceso |
| Binding duro a un agente | Cursor como único effector | SPOF de proveedor |
| Control acoplado a Data | si el executor cae, Nexus “queda ciego” / `WAITING_EXECUTOR` infinito | Contaminación de planos |
| Salud = “¿responde el executor?” | `workspace_access = false` confunde runtime con efecto | Métrica equivocada |

Reparar el `ENOENT` de hoy **no elimina** la clase. Hay que romper el modelo “pipeline único”.

---

## 2. Idea fundacional (no es Kubernetes)

### Nombre: **Sovereign Reflex**

Tres ideas que no son “pods + kubelet”:

### 2.1 Tres planos (no dos)

| Plano | Vive aunque… | Habla con ChatGPT | Ejecuta código de proyecto |
|-------|--------------|-------------------|----------------------------|
| **Sovereign Plane** | todos los executors mueran | sí (siempre) | **nunca** |
| **Intent Plane** | no haya manos vivas | sí (leer/escribir intents) | no |
| **Effect Plane** | — (efímero) | no directamente | sí |

Kubernetes mezcla “API siempre up” con “schedular workloads”. Aquí el contrato es más duro: **el Sovereign Plane no tiene manos**. Si necesita “hacer algo”, publica un *intent de recuperación* hacia `executor.bootstrap`, que es la única excepción controlada (ver §4.6).

### 2.2 Intents con lease, no colas con “waiting forever”

Todo trabajo es un **Intent** en un ledger append-only:

```
OPEN → CLAIMED(lease, hand_id) → SUCCEEDED | FAILED | EXPIRED → (re)OPEN
```

- No existe `WAITING_EXECUTOR` como estado terminal ni infinito.
- Si no hay mano capaz: el intent queda `OPEN` y el sistema reporta `DEGRADED_NO_HANDS` — **visible, auditable, recuperable**.
- Si una mano muere a mitad: el lease expira → el intent vuelve a `OPEN` automáticamente.

Eso mata para siempre la clase “WAITING_EXECUTOR infinito”.

### 2.3 Binding por **capacidad**, no por nombre de executor

Los intents declaran:

```yaml
requires:
  capabilities: [fs.write, git.commit, shell.run]
  workspace: mercadeo-ia
forbidden:
  bind_to: executor.cursor-agent   # el runtime RECHAZA este campo
```

El **Claim Broker** elige cualquier mano viva que ofrezca esas capacidades. Cursor, Grok u “otros” son **facades de agente** que *producen* intents; no *son* el plano de ejecución.

### 2.4 Pulso testigo (Witness Pulse), no RPC al muerto

La liveness no se pregunta al proceso caído. Cada mano emite un **Pulse** firmado:

```
hand_id · capabilities · launcher_digest · workspace_access · ts · seq
```

El **Pulse Aggregator** declara muerto lo que deja de pulsar. El preflight `ENOENT` deja de ser “Nexus caído”: es “esa mano no pulsa / no arranca” → Reflex dispara reparación o failover.

### 2.5 Autogenia: el sistema se regenera desde un sello

`executor.bootstrap` guarda un **Genesis Seal** (manifest firmado): registry deseado, launchers, rutas candidatas, políticas de recovery. Puede reconstruir el registry aunque la DB de registry esté corrupta. Eso no es “controller reconciliation” genérico: es **semilla soberana** embebida en el runtime.

---

## 3. Diagrama de arquitectura

```
                         ┌─────────────────────────┐
                         │        ChatGPT          │
                         │   (y cualquier agente)  │
                         └────────────┬────────────┘
                                      │  solo Inbox / Health / Audit / Recovery
                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     SOVEREIGN PLANE  (nunca depende del Effect Plane)    │
│                                                                          │
│  ┌──────────┐  ┌─────────────┐  ┌────────────┐  ┌─────────────────────┐  │
│  │  Gate    │  │   Health    │  │   Audit    │  │  Recovery Console   │  │
│  │ (Inbox)  │  │   Oracle    │  │   Spine    │  │  (+ Recovery Mode)  │  │
│  └────┬─────┘  └──────┬──────┘  └─────┬──────┘  └──────────┬──────────┘  │
│       │               │               │                    │             │
│       └───────────────┴───────┬───────┴────────────────────┘             │
│                               ▼                                          │
│                    ┌────────────────────┐                                │
│                    │  Pulse Aggregator  │◄──── pulses de todas las manos │
│                    └─────────┬──────────┘                                │
│                              │                                           │
│                    ┌─────────▼──────────┐                                │
│                    │ Reflex Controller  │  desired ↔ observed            │
│                    └─────────┬──────────┘                                │
└──────────────────────────────┼───────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           INTENT PLANE                                   │
│                                                                          │
│   ┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐   │
│   │  Intent Ledger  │◄───►│  Claim Broker   │◄───►│ Capability Index │   │
│   │  (durable)      │     │  (leases)       │     │                  │   │
│   └─────────────────┘     └────────┬────────┘     └──────────────────┘   │
│                                    │                                     │
│                         ┌──────────▼──────────┐                          │
│                         │ Executor Registry   │                          │
│                         │ (manos + launchers) │                          │
│                         └──────────┬──────────┘                          │
└────────────────────────────────────┼─────────────────────────────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
          ▼                          ▼                          ▼
   ┌─────────────┐           ┌─────────────┐           ┌─────────────────┐
   │   Hand A    │           │   Hand B    │           │ executor.       │
   │ cursor-pack │           │  grok-pack  │           │ bootstrap       │
   │ (launcher*) │           │ (launcher*) │           │ (Autogenous     │
   └──────┬──────┘           └──────┬──────┘           │  Kernel)        │
          │                         │                  │  siempre local  │
          └────────────┬────────────┘                  │  al runtime     │
                       ▼                               └────────┬────────┘
                 ┌───────────┐                                  │
                 │ Proyecto  │◄─────────────────────────────────┘
                 │(Mercadeo) │     solo intents de recovery /
                 └───────────┘     registry / launcher repair
```

\* Launchers son **adaptadores versionados**, nunca una ruta absoluta hardcodeada como identidad del sistema.

---

## 4. Componentes y responsabilidades

### 4.1 Gate (Inbox Gateway)

- Único punto de entrada para ChatGPT y agentes.
- Traduce mensajes → Intents (o consultas de solo lectura).
- **No** invoca executors.
- Garantiza: si Gate está up, ChatGPT “tiene Nexus”, aunque Effect Plane = 0 manos.

### 4.2 Health Oracle

Separa tres saluds (hoy están mezcladas):

| Señal | Significa |
|-------|-----------|
| `sovereign_ok` | Gate + Ledger + Oracle vivos |
| `intent_ok` | Ledger writable + Broker vivo |
| `effect_ok` | ≥1 mano con capabilities requeridas pulsando |
| `workspace_access` | **atributo de una mano**, no de Nexus |

`workspace_access = false` deja de significar “Nexus muerto”.

### 4.3 Audit Spine

- Append-only: intents, claims, pulses, heal actions, rollbacks.
- Disponible en Recovery Mode.
- Fuente de verdad para “qué pasó cuando Cursor se cayó”.

### 4.4 Pulse Aggregator

- Recibe pulses; marca `ALIVE | STALE | DEAD`.
- Timeout configurable por clase de mano.
- Emite eventos al Reflex (`HandLost`, `CapabilityGap`, `LauncherBroken`).

### 4.5 Reflex Controller

Bucle de autorreparación (desired vs observed):

1. Lee Genesis Seal + políticas.
2. Compara registry deseado vs manos observadas.
3. Emite **Recovery Intents** (no ejecuta shell él mismo, salvo delegar a bootstrap).
4. Orden de preferencia de sanación:
   - failover a otra mano viva con misma capability
   - rediscovery de launcher/rutas
   - reinstall launcher pack
   - restart worker
   - rollback de versión de launcher
   - rebuild registry desde Genesis Seal
   - activar Recovery Mode si quorum de effect = 0

### 4.6 `executor.bootstrap` — Autogenous Kernel

**Requisitos duros (los tuyos):**

- Vive **dentro** del runtime Nexus.
- No depende de Cursor, Grok ni agente externo.
- Funciona con **todas** las demás manos caídas.

**Puede:**

| Acción | Cómo |
|--------|------|
| Registrar ejecutores | escribe Executor Registry + Capability Index |
| Reparar ejecutores | recovery intents locales (probe, fix path, reinstall) |
| Reinstalar launchers | desde launcher packs sellados en el runtime |
| Corregir rutas | **Path Oracle**: candidatos ordenados, nunca una sola ruta |
| Recuperar tareas | reabre intents con lease expirado / huérfanos |
| Reiniciar workers | process supervisor local del runtime |
| Rollback | vuelve launcher_digest anterior conocido-bueno |
| Reconstruir registry | desde Genesis Seal |

**Límite deliberado:** bootstrap **no** es el executor de features del proyecto Mercadeo IA. Solo effectors mínimos: filesystem del runtime, procesos locales, registry, launcher packs. Así no se convierte en el nuevo SPOF “hace todo”.

### 4.7 Intent Ledger

- Durable (SQLite/Postgres/append-log — decisión de implementación posterior).
- Estados con lease (§2.2).
- Idempotencia por `intent_id` + `dedupe_key`.

### 4.8 Claim Broker

- Match: `requires.capabilities ⊆ hand.capabilities` ∧ `hand.status == ALIVE`.
- Emite lease con TTL.
- Renovación por heartbeat de la mano mientras trabaja.
- Al expirar: requeue automático + marca la mano sospechosa.

### 4.9 Executor Registry + Capability Index

- Registry: manos, launchers, digests, path candidates, last_pulse.
- Capability Index: mapa invertido `capability → [hand_ids]`.
- Prohibido: campo “default_executor_global”.

### 4.10 Hands (executors) + Launcher Packs

Una **Hand** = proceso effector + launcher pack + pulse emitter.

Un **Launcher Pack** incluye:

- binarios o scripts versionados
- **Path Oracle** (lista de candidatos + discovery rules)
- probe contract (qué cuenta como “ready”)
- rollback slot (N versiones)

El error actual:

```
C:\Users\Diva\AppData\Local\cursor-agent\versions\2026.07.09-a3815c0\node.exe
ENOENT
```

en el nuevo modelo es: *candidato[0] falló* → Path Oracle prueba candidato[1..] → si todos fallan, Pulse = DEAD + Reflex pide a bootstrap reinstall/rediscovery — **sin tumbar Nexus**.

### 4.11 Agent Facades (Cursor, Grok, otros)

- Clientes del Gate.
- Pueden proponer intents o actuar como manos *si* exponen capabilities y pulsan.
- Ninguno es parte del Sovereign Plane.
- ChatGPT tampoco: es un cliente privilegiado del Gate.

---

## 5. Recovery Mode

### Activación

Cuando `effect_ok == false` (0 manos ALIVE con capabilities mínimas) **o** política de quorum no se cumple:

```
mode = RECOVERY
```

### Qué permanece disponible (nunca ciego)

| Capacidad | Disponible |
|-----------|------------|
| health | sí |
| polling / inbox | sí |
| logs / audit | sí |
| recovery commands | sí (vía bootstrap) |
| auditoría | sí |
| ejecución de features de proyecto | no (explícitamente degradado) |

### Qué puede hacer ChatGPT en Recovery Mode

1. Leer Health Oracle desglosado.
2. Listar intents `OPEN` / `EXPIRED`.
3. Ordenar: `repair_launcher`, `rediscover_paths`, `rebuild_registry`, `register_hand`, `rollback_launcher`.
4. Ver progreso de recovery intents ejecutados por bootstrap.

### Salida

Cuando Pulse Aggregator ve ≥1 mano capaz → `mode = NORMAL` y Claim Broker retoma claims.

---

## 6. Flujo de ejecución (happy path)

```
1. ChatGPT → Gate: "implementar X en Mercadeo IA"
2. Gate valida → escribe Intent(OPEN, requires=[...]) en Ledger
3. Audit Spine registra IntentCreated
4. Claim Broker ve Intent OPEN
5. Capability Index: manos candidatas ALIVE
6. Broker CLAIMED(hand=B, lease=60s)
7. Hand B ejecuta efecto en el proyecto
8. Hand B renueva lease mientras trabaja + emite Pulse
9. Hand B escribe Intent SUCCEEDED + artifacts refs
10. Gate puede responder a ChatGPT con resultado (poll o push)
```

Si en el paso 5 no hay manos: Intent permanece OPEN; Health = `DEGRADED_NO_HANDS`; Gate sigue respondiendo; Reflex/bootstrap intentan sanar.

---

## 7. Flujo de recuperación (el caso de hoy, reescrito)

**Síntoma viejo:** `EXECUTOR_UNAVAILABLE` / preflight `ENOENT` / Nexus inutilizable.

**Flujo nuevo:**

```
1. Hand cursor-pack intenta probe → Path Oracle candidato falla (ENOENT)
2. Hand no logra emitir Pulse ready → Aggregator marca STALE→DEAD
3. CapabilityGap detectado (p.ej. shell.run sin proveedores)
4. Reflex:
   a. ¿Hay otra mano con shell.run? → sí: failover silencioso (Broker usa la otra)
   b. ¿No? → Recovery Intent: rediscover_paths(cursor-pack)
5. bootstrap ejecuta Path Oracle ampliado (AppData, PATH, known installs, pack interno)
6. Si rediscovery falla → reinstall launcher pack (versión sellada)
7. Si reinstall falla → rollback a digest anterior
8. Si sigue muerto y no hay otras manos → Recovery Mode
9. ChatGPT sigue hablando con Gate; ve el diagnóstico; puede ordenar rebuild_registry
10. Intents de proyecto siguen OPEN (no perdidos, no “waiting forever” opaco)
```

**Resultado:** la clase ENOENT se convierte en evento de sanación, no en muerte del sistema.

---

## 8. Cómo se eliminan las clases de fallo pedidas

| Clase a eliminar | Mecanismo |
|------------------|-----------|
| `WAITING_EXECUTOR` infinito | leases + requeue; estado `OPEN` explícito + `DEGRADED_NO_HANDS` |
| `ENOENT` como muerte | Path Oracle multi-candidato + launcher packs + bootstrap repair |
| Única ruta | discovery ordenada; ruta nunca es identidad |
| Única IA | Agent Facades intercambiables; Gate no prefiere proveedor |
| Único launcher | packs versionados + rollback + reinstall |
| Único proveedor/executor | Capability Index con N manos; prohibido default global |
| Nexus ciego | Sovereign Plane + Recovery Mode siempre up |

---

## 9. Contratos clave (interfaces conceptuales)

### Intent

```text
intent_id, dedupe_key, source (chatgpt|agent|reflex),
requires.capabilities[], workspace?,
priority, created_at,
state, claim?: {hand_id, lease_until},
result?: {status, error_class, artifacts}
```

### Hand registration

```text
hand_id, launcher_pack_id, launcher_digest,
path_candidates[], capabilities[],
pulse_interval, probe_contract
```

### Pulse

```text
hand_id, seq, ts, status, capabilities,
workspace_access, launcher_digest, errors[]
```

### Recovery Intent (solo bootstrap / Reflex)

```text
action: rediscover_paths | reinstall_launcher | restart_worker |
        rollback_launcher | rebuild_registry | register_hand | reclaim_orphans
target: hand_id | pack_id | registry
```

---

## 10. Migración desde la arquitectura actual

Migración por **estratos**, sin big-bang ciego:

### Fase A — Separar planos (mínimo vital)

1. Gate/Inbox + Health Oracle dejan de llamar al executor para “estar vivos”.
2. Introducir Intent Ledger aunque haya **una sola** mano (`cursor-pack`).
3. Convertir el dispatch actual en Claim Broker de una mano.
4. Reemplazar `WAITING_EXECUTOR` por `OPEN` + métrica `no_hands`.

**Ya aquí:** ChatGPT no pierde a Nexus si Cursor cae.

### Fase B — Path Oracle + launcher pack

1. Envolver `cursor-agent` como launcher pack con candidatos de ruta.
2. Probe deja de hardcodear `versions\2026.07.09-...\node.exe` como única verdad.
3. Errores ENOENT → evento, no fatal global.

### Fase C — `executor.bootstrap` + Reflex

1. Embebido en runtime.
2. Genesis Seal inicial (export del registry actual).
3. Recovery Mode real.
4. Acciones: rediscover, reinstall, rollback, rebuild, reclaim.

### Fase D — Segunda mano

1. Registrar una mano alternativa (Grok pack u otro local/cloud).
2. Failover automático por capabilities.
3. Retirar cualquier “default executor” residual.

### Fase E — Endurecimiento

1. Quorum policies, chaos tests (matar manos a propósito).
2. Audit completo, runbooks solo vía Recovery Console.
3. Prohibiciones en schema: no `bind_to` executor concreto desde Gate.

**Compatibilidad:** el Inbox actual puede quedar como fachada del Gate; el scheduler actual se convierte en Claim Broker; health se parte en tres señales.

---

## 11. Qué mejora respecto del diseño existente

1. **Supervivencia de comunicación:** ChatGPT ↔ Nexus independiente del Effect Plane.
2. **Trabajo no se pierde ni se atasca opaco:** ledger + leases.
3. **Fallas de filesystem dejan de ser fallas de producto.**
4. **Autorreparación con actor local (bootstrap)** que no necesita “llamar a Cursor para arreglar Cursor”.
5. **Multi-proveedor real** por capacidades, no por if/else de agentes.
6. **Observabilidad honesta:** `workspace_access` vuelve a su dueño (la mano).
7. **Recovery Mode** como estado de primer nivel, no como “está todo roto”.

---

## 12. Riesgos

| Riesgo | Por qué importa | Mitigación |
|--------|-----------------|------------|
| Bootstrap se vuelve dios | nuevo SPOF disfrazado | capabilities mínimas; no ejecuta features de negocio |
| Ledger corrupto | pérdida de intents | append-only + snapshots + Genesis no depende del ledger de trabajo |
| Leases mal calibrados | thrash de reclaims | TTL por clase de intent + jitter + “sticky claim” mientras Pulse ALIVE |
| Split-brain de manos | dos manos claim mismo intent | lease fencing token / epoch en Ledger |
| Path Oracle inseguro | ejecutar binario equivocado | digests firmados + allowlist de locations + probe contract |
| Recovery Mode eterno | degradación normalizada | SLO: alertar si RECOVERY > N minutos; runbook humano |
| Complejidad prematura | no se termina la migración | fases A→E; Fase A ya elimina ceguera |
| “Multi-agent” cosmético | segunda mano nunca llega | Definition of Done de Fase D = failover probado matando mano A |

---

## 13. Crítica a esta propia propuesta

1. **Todavía hay un SPOF físico:** la máquina/runtime donde corre el Sovereign Plane. Autogenia no reemplaza HA multi-host; solo elimina SPOF de *executor*. Si el host de Nexus muere, hace falta réplica del Sovereign Plane (fuera de alcance v0.1, pero hay que nombrarlo).
2. **Bootstrap confiable es difícil:** si el runtime está tan roto que ni bootstrap arranca, Recovery Mode no existe. Hace falta un **watchdog de OS** (servicio Windows/systemd) fuera del proceso Node — tercer anillo no dibujado aún.
3. **Capability model puede mentir:** una mano puede anunciar `git.commit` y fallar. Hace falta probe de capabilities, no solo registro declarado.
4. **No resuelve semántica de negocio:** Mercadeo IA sigue necesitando políticas de qué intents son seguros. Este diseño es de supervivencia operativa, no de governance de producto.
5. **Riesgo de sobre-diseño:** si solo se implementan diagramas y no Fase A, seguimos con el ENOENT. La propuesta vale solo si Fase A se prioriza.
6. **Originalidad vs. practicidad:** Intent+lease se parece a work queues; Reflex se parece a reconciliation. La diferencia real está en (a) Sovereign sin manos, (b) bootstrap autógeno, (c) Path Oracle+packs, (d) prohibición de bind-by-name. Si el equipo diluye (a) o (d), volvemos al diseño actual con otro nombre.

---

## 14. Principios normativos (para no traicionar el diseño)

1. El Sovereign Plane no ejecuta trabajo de proyecto.
2. Ningún intent puede bindear un `hand_id` concreto desde clientes externos.
3. Ninguna ruta de filesystem es identidad de un executor.
4. `WAITING_EXECUTOR` no existe; solo `OPEN` + degradación explícita.
5. `workspace_access` es de la mano, no de Nexus.
6. Bootstrap no depende de ningún agente externo.
7. Recovery Mode preserva health, polling, logs, recovery, auditoría.
8. Toda sanación deja traza en Audit Spine.

---

## 15. Preguntas abiertas para la ronda con ChatGPT

1. ¿Genesis Seal vive solo en disco local o también en un mirror off-host?
2. ¿Segunda mano prioritaria: otro launcher local, cloud agent, o ambos?
3. ¿Ledger embebido (SQLite) vs servicio externo en v1?
4. ¿ChatGPT en Recovery Mode: comandos estructurados o lenguaje natural → intents de recovery?
5. ¿Quórum: “≥1 mano” basta al inicio, o exigimos 2 para NORMAL?

---

## 16. Próximo paso (cuando se apruebe)

No código de features todavía: cerrar este doc con ChatGPT (aceptar / enmendar principios §14 y fases §10), luego implementar **solo Fase A** como primer PR vertical.
