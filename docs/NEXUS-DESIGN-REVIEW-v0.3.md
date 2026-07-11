# NEXUS — DESIGN REVIEW CRÍTICA + ARQUITECTURA v0.3
## Comité de Arquitectura Independiente (humano · ChatGPT · Cursor/Grok)

**Tipo:** Design Review adversarial — NO es defensa de la v0.2  
**Entrada revisada:** Arquitectura cerrada v0.2 (Sovereign Reflex)  
**Salida:** veredicto, fallas encontradas, y propuesta v0.3  
**Estado:** SIN CÓDIGO — solo arquitectura  
**Regla del comité:** no conformismo; si hay que romper la v0.2, se rompe

---

# 0. VEREDICTO DEL COMITÉ

La v0.2 **identifica bien el problema** (SPOF del executor) y acierta en dos ideas:

1. API asíncrona 202 (mata Cloudflare 524 / requests eternos)
2. Control Plane no debe morir cuando cae Cursor

Pero como arquitectura multi-año, la v0.2 está **sobre-diseñada** y contiene **contradicciones graves**, SPOFs renombrados, y complejidad de sistema distribuido aplicada a lo que hoy es un **runtime local con runners enchufables**.

**Veredicto:**

> NO aprobar v0.2 para implementación.  
> Adoptar v0.3 (**Nexus Kernel + Runners**), que preserva los objetivos reales y elimina la ceremonia tipo Kubernetes/Event-Sourcing prematura.

La v0.2 no es “incorrecta”. Es **prematuramente distribuida**.

---

# 1. INTENTO DE ROMPER LA v0.2

## 1.1 Contradicciones

### C1 — “Tres planos” vs proceso único
La v0.2 dibuja Sovereign / Intent / Effect como planos independientes. En V1 todo vive en SQLite embebido + un runtime. Si el proceso Nexus muere, **caen los tres planos juntos**.

P1 (“Control Plane nunca depende de un executor”) es cierto respecto de Cursor, pero **falso respecto del proceso host**. La independencia de planos es cosmético hasta HA real (Fase F). Presentarlo como resuelto es autoengaño.

### C2 — P14 vs Recovery Intent
P14 prohíbe bind-by-name.  
Recovery usa `"target":"executor.cursor-agent"`.

Eso **es** bind-by-name. La v0.2 no formaliza la excepción admin/recovery. Principio absoluto + práctica necesaria = contradicción.

### C3 — Bootstrap “no es dios” pero es el único que puede salvar el mundo
P11 saca a bootstrap del WORK. Bien.  
Pero toda reparación ejecutable depende de bootstrap. Si bootstrap está corrupto, P10 (“administrable”) se reduce a **observar el incendio**, no apagarlo.

Administrable ≠ recuperable. La v0.2 confunde ambos.

### C4 — Quórum de “2 manos” en una sola PC
Dos procesos en la misma máquina Windows **no son quórum**. Se caen juntos con un BSOD, corte de luz, disco lleno o Update de Windows.

El “quórum crítico ≥ 2” es teatro de consenso sin dominio de falla independiente.

### C5 — Failover Local → Cloud “transparente”
Local tiene filesystem, secretos, workspace path, OS.  
Cloud tiene otra trust boundary, latencia, y posiblemente **cero** acceso al repo local.

Tratarlos como manos sustituibles por capability tags es mentira semántica. Un `shell.run` local ≠ `shell.run` cloud.

### C6 — QUEUED eterno vs WAITING_EXECUTOR
Se renombra el síntoma. Sin TTL / dead-letter / SLA, el usuario vuelve a tener tareas colgadas para siempre, solo que ahora el health dice `sovereign_ok=true`.

Más peligroso: da falsa sensación de salud.

### C7 — “Sin rutas hardcodeadas” (P9 absoluto)
Discovery necesita **candidatos configurados**. Configurar rutas candidatas no es el bug. El bug es usar una ruta versionada como **identidad** del executor.

P9 absoluto empuja a magia de discovery frágil. Debe ser: *identidad ≠ path; paths son candidatos ordenados*.

### C8 — Recovery Mode global
Un modo global NORMAL/DEGRADED/RECOVERY acopla disponibilidad de endpoints distintos.  
Podés querer aceptar prompts y rechazar dispatch, o reparar sin aceptar WORK nuevo. Un solo enum no expresa eso y se atasca fácilmente (“quedó en RECOVERY”).

---

## 1.2 Single Points of Failure (los que v0.2 no elimina)

| SPOF | ¿v0.2 lo elimina? | Realidad |
|------|-------------------|----------|
| executor.cursor-agent | Parcial | Sí para WORK si hay Cloud; no en Fase A |
| Proceso Nexus / host | No | Todo el “Sovereign Plane” muere con el host |
| SQLite archivo local | No | Corrupción/disco = muerte del Intent Plane |
| Single event writer | Introducido | Nuevo cuello y SPOF de throughput |
| Bootstrap | Renombrado | SPOF de recuperación ejecutable |
| Clave del Genesis Seal | Introducido | SPOF criptográfico nuevo |
| Parser LLM (si se usa en recovery UX) | Introducido | Dependencia de proveedor para “proponer” |

**Conclusión:** v0.2 elimina el SPOF emocional (Cursor) e introduce SPOFs estructurales nuevos (seal keys, hash writer, bootstrap-as-only-healer, event-sourcing runtime).

---

## 1.3 Acoplamientos innecesarios

1. **Event sourcing completo** acoplado a una cola de tareas simple.  
2. **Capability Index** acoplado antes de tener 2 runners reales.  
3. **Genesis Seal + mirror + epoch** acoplado al boot path conceptual (aunque “no sea obligatorio el mirror”, el diseño obliga a pensar crypto desde el día 0).  
4. **Reflex Controller** acoplado a reparación automática sin circuit breaker → acoplamiento observación/acción peligroso.  
5. **Health `intent_ok`** acoplado a un ledger que vive en el mismo proceso que `sovereign_ok` → señal redundante en V1.  
6. **API `/v1/prompt`** acoplada a la metáfora ChatGPT; el dominio real es Task/Job.

---

## 1.4 Problemas de recuperación

1. Repair storms: probe fail → reinstall → fail → reinstall.  
2. No hay budget de reparación (N intentos / ventana).  
3. Dry-run sin modelo de “qué cuenta como simulación segura” para restart/reinstall.  
4. Rollback de launcher no define rollback de **estado del workspace** si la hand ya tocó el repo.  
5. `reclaim-orphans` post-crash puede **re-ejecutar** tareas no-idempotentes (doble commit, doble push).  
6. Recovery NL parser: si el LLM está caído, ¿recovery UX muere aunque el JSON estructurado funcione? Hay que separar canales.

---

## 1.5 Problemas de seguridad

1. Whitelist de actions no es suficiente sin **object-level authz** (quién puede repair qué).  
2. Path Oracle + reinstall puede convertirse en **supply-chain local** si los packs no están firmados de verdad (v0.2 lo menciona, no lo fuerza en Fase A–C).  
3. Cloud failover puede exfiltrar contexto del prompt/repo a otro proveedor sin consentimiento explícito por tarea.  
4. Critical Override “humano” sin hardware/OS auth fuerte es solo un flag.  
5. Audit log en el mismo SQLite que el sistema: un atacante con write al DB puede reescribir historia si no hay anclaje externo. El hash chain local **no protege** contra quien controla el archivo (puede recalcular la cadena).  
6. Bootstrap con poder de reinstalar binarios = rootkit interno si se compromete el runtime.

---

## 1.6 Concurrencia

1. Lease + renew + expire entre Broker y Hand: clásico split-brain → doble ejecución.  
2. Fencing token ayuda, pero hands deben **obedecerlo**; Cursor/cloud adapters actuales probablemente no tienen fencing real. Diseño asume disciplina que no existe.  
3. Single writer de events serializa todo: bajo carga de progress pulses, el ledger se convierte en cuello.  
4. Pulse flood + claim loops cuando una hand flapea HEALTHY/UNHEALTHY.

---

## 1.7 Consistencia

1. “Events fuente de verdad + proyecciones” exige rebuild, versionado de proyectores, y bugs sutiles de proyección stale.  
2. Para una task queue, consistencia suficiente es: **fila de tarea atómica + audit append**. Event sourcing es consistencia cara sin beneficio V1.  
3. Hash chain da integridad cosmético frente a tamper externo, no frente a dueño del disco.  
4. Failover mid-task sin idempotency keys de efecto → inconsistencia de repo (merge conflicts, commits duplicados).

---

## 1.8 Escalabilidad

1. Diseño habla de multi-año pero optimiza ceremonia, no throughput.  
2. Un solo SQLite writer no escala a muchos hands/progress.  
3. Capability matching genérico no escala en claridad (explosión de taxonomía).  
4. Cloud hand “N” sin cola por región/tenant: diseño de un nodo fingiendo cluster.

Para el caso real actual (1 usuario, 1–2 runners, 1 workspace), la arquitectura está **dos órdenes de magnitud más compleja** que el problema.

---

## 1.9 Componentes innecesarios (para V1 / incluso V2 cercano)

| Componente v0.2 | Juicio del comité |
|-----------------|-------------------|
| Tres planos formales | Innecesario; usar 2 capas reales |
| Event sourcing + hash chain | Prematuro |
| Genesis Seal crypto + mirror | Prematuro (bastan config versionada + backup) |
| Capability Index rico | Prematuro (basta runner kind + status) |
| Recovery Mode enum global | Reemplazar por disponibilidad por capacidad |
| Pulse Aggregator como servicio separado | Puede ser health poll simple al inicio |
| Reflex automático completo | Peligroso sin circuit breakers; defer |
| Quórum de manos | Teatro en single-host |
| fencing token distribuido | Sobrepeso si no hay ejecución paralela real multi-hand |

---

## 1.10 Complejidad accidental

La v0.2 copia el **vocabulario** de Kubernetes/Event Sourcing/Capability security sin el **problema** que justifica ese vocabulario.

Problema real:

> “Quiero encolar trabajo de agentes, no bloquear HTTP, sobrevivir si Cursor muere, y poder reparar runners.”

Eso es:

- Job queue durable
- Runner adapters
- Health endpoints
- Admin repair tools

No es un control plane de cluster.

**KISS roto.**  
**Separación de responsabilidades confusa** (bootstrap como “executor” peer).  
**SOLID:** Reflex + Bootstrap + Registry comparten autoridades solapadas de reparación.  
**YAGNI:** seal/mirror/hash/quórum.

---

# 2. QUÉ SÍ HAY QUE CONSERVAR DE LA v0.2

No tirar todo. Conservar:

1. API async `202` + `taskId` + poll  
2. Control/API no bloqueado por runner  
3. Registry de runners (Cursor como miembro, no como dios)  
4. Recovery por intents estructurados + whitelist (LLM propone, runtime decide)  
5. Path candidates / discovery (identidad ≠ ruta)  
6. Failover Local → Cloud **opcional y explícito**, no mágico  
7. Auditoría de reparaciones  
8. Principio: sin runners, el sistema sigue respondiendo health/poll/admin

Descartar o degradar: event sourcing pesado, seal crypto temprano, quórum de procesos, bootstrap-as-executor, modos globales rígidos, capabilities finas tempranas.

---

# 3. ARQUITECTURA SUPERIOR v0.3 — “NEXUS KERNEL + RUNNERS”

## 3.1 Idea fundacional (más simple, más honesta)

```
                ChatGPT / clientes
                        │
                        ▼
              ┌─────────────────────┐
              │    NEXUS KERNEL     │
              │  (siempre local)    │
              │  API · Store ·      │
              │  Dispatcher ·       │
              │  Repair · Audit     │
              └──────────┬──────────┘
                         │ asigna Jobs
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
      Runner Local  Runner Cloud  (futuros)
      (Cursor pack) (opt-in)
           │             │
           └──────┬──────┘
                  ▼
              Workspace
```

**No hay “tres planos”. Hay dos capas:**

| Capa | Qué es | Muere si… |
|------|--------|-----------|
| **Kernel** | Proceso/servicio local de control | Muere el host/proceso Nexus |
| **Runners** | Adaptadores reemplazables de ejecución | Muere ese runner |

Bootstrap **deja de ser un executor**. Pasa a ser **Repair Subsystem del Kernel** (`kernel.repair`).  
Porque recuperar el sistema no es “un tipo más de trabajo de proyecto”; es privilegio de control.

Esta es la corrección conceptual más importante respecto de v0.2.

---

## 3.2 Principios v0.3 (reemplazan P1–P14 donde chocan)

K1. El Kernel responde siempre que el proceso esté vivo, aunque no haya runners.  
K2. Un Job de usuario nunca se ejecuta dentro del request HTTP.  
K3. Cursor es un Runner, nunca el Kernel.  
K4. Repair es privilegio del Kernel, no un runner peer.  
K5. Identidad de runner ≠ ruta de filesystem.  
K6. Local y Cloud no son semánticamente equivalentes; failover cloud es opt-in por job.  
K7. Sin runner sano: Jobs quedan `QUEUED` con **SLA/TTL** y luego `ABANDONED` (no cola infinita).  
K8. LLM nunca ejecuta; solo puede proponer RepairIntent JSON.  
K9. Auditoría append-only simple; integridad criptográfica fuerte es fase posterior.  
K10. Single-host no finge quórum distribuido. Auth admin + audit reemplazan “2 manos”.  
K11. Complejidad distribuida (leases fuertes, fencing, event sourcing) solo cuando exista paralelismo real multi-runner.  
K12. Disponibilidad es por capacidad (`accept`, `dispatch`, `repair`), no por un enum global único.

---

## 3.3 Componentes v0.3 (mínimos)

### Kernel

1. **API Gateway**  
   - `POST /v1/jobs` (ex-`/v1/prompt`) → 202  
   - `GET /v1/jobs/{id}`  
   - `GET /v1/health`  
   - `GET /v1/runners`  
   - `POST /v1/repair/intents` (+ parse/dry-run/execute)

2. **Job Store** (SQLite)  
   - Tabla `jobs` (estado)  
   - Tabla `audit_log` (append-only)  
   - Tabla `runners`  
   - **No** event sourcing obligatorio  
   - Interface `Store` para migrar a Postgres después

3. **Dispatcher**  
   - Elige runner según policy  
   - Policy default: Local only  
   - Cloud solo si `job.allowCloudFailover=true` **y** cloud healthy  
   - Si ninguno: job sigue QUEUED hasta TTL

4. **Runner Registry**  
   - id, kind, status, last_error, path_candidates, discovered_path, last_heartbeat, supports_cloud_semantics

5. **Repair Subsystem** (`kernel.repair`)  
   - Whitelist  
   - Dry-run  
   - Execute  
   - Rollback de launcher cuando aplique  
   - Circuit breaker (máx N reparaciones / ventana / runner)  
   - No aparece como runner de WORK

6. **Heartbeat Monitor**  
   - Simple: runner heartbeat o probe periódico  
   - No hace falta “Pulse Aggregator” como concepto separado en V1

### Runners

- **LocalRunner** (Cursor pack + Path candidates)  
- **CloudRunner** (opcional, opt-in)  
- Futuros runners sin cambiar Kernel

---

## 3.4 Modelo de datos v0.3 (simple)

### jobs

```
jobId
status: QUEUED | RUNNING | SUCCEEDED | FAILED | ABANDONED | CANCELLED
prompt / inputRef
workspace
allowCloudFailover: bool (default false)
assignedRunnerId?
attempt
lastError?
createdAt, updatedAt, queuedUntil? (TTL)
idempotencyKey (client.request_id)
```

### runners

```
runnerId
kind: LOCAL | CLOUD
status: HEALTHY | UNHEALTHY | DISABLED
pathCandidates[]
discoveredPath?
lastHeartbeatAt
lastErrorClass?
labels/capabilities coarse?: [workspace.exec]   # opcional, grueso
```

### audit_log

```
id, ts, actor, action, target, payload, result
```

Append-only práctico. Sin hash chain en V1.  
Backup de DB + file permissions cubren el 90% del riesgo real.

### repair_intents

```
repairId
intent JSON
status: PROPOSED | REJECTED | DRY_RUN_OK | EXECUTED | FAILED
```

---

## 3.5 Estados y disponibilidad (sin Recovery Mode global)

Health responde capacidades:

```json
{
  "kernel": true,
  "capabilities": {
    "accept_jobs": true,
    "dispatch_jobs": false,
    "repair": true,
    "poll": true,
    "audit_read": true
  },
  "runners": {
    "local": "UNHEALTHY",
    "cloud": "DISABLED"
  }
}
```

Esto reemplaza NORMAL/DEGRADED/RECOVERY con algo accionable y no bloqueante.

Si se quiere UX “Recovery Mode”, que sea **solo una etiqueta derivada** cuando `dispatch_jobs=false && repair=true`, no un estado que gobierna el sistema.

---

## 3.6 Secuencia de ejecución

```
1. POST /v1/jobs → valida → insert job QUEUED → 202
2. Dispatcher toma job
3. Elige Local si HEALTHY
4. Si Local UNHEALTHY y allowCloudFailover y Cloud HEALTHY → Cloud
5. Si no → job sigue QUEUED; si supera TTL → ABANDONED + audit + alerta
6. Runner ejecuta fuera de HTTP
7. Callback/heartbeat de progreso
8. Terminal state + audit
```

---

## 3.7 Recovery / Repair

```
NL → Parser(opcional) → RepairIntent JSON → schema
  → whitelist → authz admin → dry-run → execute(kernel.repair)
  → audit → circuit breaker counters
```

Whitelist esencial V1:

- rediscover_paths  
- restart_runner  
- reinstall_launcher  
- rollback_launcher  
- disable_runner / enable_runner  
- reclaim_queued (re-eval TTL; **no** reejecutar RUNNING dudoso sin política)

**Política anti doble-ejecución:**  
Si al reiniciar Kernel hay jobs `RUNNING` sin heartbeat → pasan a `FAILED(retryable)` o `QUEUED` solo si el job fue marcado `idempotent=true`. Default: **FAILED_NEEDS_REVIEW**.  
Esto es más seguro que reclaim ciego de v0.2.

---

## 3.8 Failover (honesto)

```
Default:
  Local only

If allowCloudFailover=true:
  Local → Cloud → QUEUED/ABANDONED

Never:
  Cloud “en silencio”
  Repair subsystem como fallback de WORK
```

Contrato con el usuario/ChatGPT: cloud failover es decisión explícita, porque cambia privacidad y semántica.

---

## 3.9 Seguridad v0.3

1. Admin token / local capability para repair (no abrir repair al mismo canal público que prompt sin authz).  
2. `allowCloudFailover` default false.  
3. Launcher packs: digest requerido desde la primera reinstall (no defer vacío).  
4. Audit siempre.  
5. No fingir integridad crypto anti-tamper mientras el atacante puede ser dueño del disco; eso va a fase de mirror off-host anclado.  
6. Circuit breaker de repair.  
7. Separar canal `POST /v1/jobs` de `POST /v1/repair/*`.

---

## 3.10 Concurrencia v0.3

V1 asume **un dispatcher, pocos runners**.

- Lock de job por `UPDATE ... WHERE status=QUEUED` atómico  
- No fencing distribuido hasta multi-dispatcher  
- Heartbeat timeout → mark UNHEALTHY  
- Evitar progress spam: throttle de updates

Cuando existan 2+ dispatchers o muchos runners: entonces sí leases/fencing. No antes.

---

## 3.11 Escalabilidad

Camino limpio:

1. Un host, un kernel, 1–2 runners (ahora)  
2. Store interface → Postgres (equipo)  
3. Cloud runners N  
4. HA kernel (después, real)

No se finge el paso 4 en el vocabulario del paso 1.

---

# 4. COMPARACIÓN v0.2 vs v0.3

| Tema | v0.2 | v0.3 | Por qué v0.3 gana |
|------|------|------|-------------------|
| Metáfora | Kubernetes/event-sourced OS | Kernel + job queue + runners | Coincide con el problema real |
| Planos | 3 lógicos | 2 reales | Menos ficción |
| Bootstrap | executor especial | subsystem del kernel | Autoridad clara |
| Persistencia | event sourcing + hash | jobs + audit_log | KISS, suficiente |
| Seal/mirror | día 0 conceptual | fase posterior | YAGNI |
| Quórum | 2 hands | admin auth + audit | Honesto en single-host |
| Failover cloud | cuasi-simétrico | opt-in explícito | Seguridad/semántica |
| Cola sin runners | QUEUED infinito | TTL → ABANDONED | Evita ceguera dulce |
| Recovery mode | enum global | capabilities | Menos estados atascables |
| Doble ejecución | reclaim agresivo | default NEEDS_REVIEW | Más seguro |
| Complejidad V1 | Alta | Media-baja | Implementable sin mentir |

---

# 5. RIESGOS RESIDUALES DE LA v0.3 (también críticos)

El comité no vende v0.3 como perfecta.

1. **SPOF del Kernel/host permanece.** Hay que nombrarlo y planear servicio OS watchdog + backup DB.  
2. **Sin event sourcing, rebuild de estado histórico es más pobre.** Se acepta a cambio de simplicidad; audit_log mitiga.  
3. **Cloud opt-in puede no usarse nunca** → SPOF local vuelve. Mitigar con alerta cuando local unhealthy > N minutos.  
4. **Repair en el kernel concentra poder.** Mitigar con authz + whitelist + circuit breaker; no con fingir que es un peer más.  
5. **ChatGPT puede odiar `/v1/jobs` rename.** Se puede alias `/v1/prompt` → jobs sin contaminar el dominio.  
6. **Si mañana Nexus es multi-tenant cluster**, v0.3 deberá evolucionar (leases, etc.). La interface Store/Dispatcher lo permite sin teatro hoy.

---

# 6. PLAN DE IMPLEMENTACIÓN v0.3 (fases)

## Fase A — Kernel mínimo (primer valor real)

- SQLite: jobs, runners, audit_log  
- `POST /v1/jobs` → 202 QUEUED  
- `GET /v1/jobs/{id}`, `GET /v1/health` (capabilities)  
- Registry con LocalRunner  
- Dispatcher Local-only + TTL/ABANDONED  
- Si Local down: API sigue viva  
- Tests: cursor caído, 524, reinicio, reanudación segura

## Fase B — Path candidates + errores honestos

- ENOENT → lastErrorClass  
- rediscover_paths  
- restart_runner

## Fase C — Repair subsystem

- Whitelist + dry-run + audit + circuit breaker  
- Parser NL opcional  
- Sin repair automático agresivo al inicio (o con budget 1)

## Fase D — CloudRunner opt-in

- allowCloudFailover  
- tests de privacidad/semántica  
- nunca default silent

## Fase E — Hardening

- backups DB  
- launcher digests enforced  
- watchdog OS  
- mirror de audit off-host (aquí sí)

## Fase F — Distribución real (solo si hace falta)

- Postgres  
- leases/fencing  
- multi-kernel HA

---

# 7. MATRIZ DE ATAQUE: cómo la v0.3 sobrevive donde v0.2 flaquea

| Ataque / falla | v0.2 | v0.3 |
|----------------|------|------|
| Cursor ENOENT | recovery complejo + modos | repair kernel + API viva |
| Cola infinita | QUEUED sin fin | TTL → ABANDONED |
| Reclaim post-crash | riesgo doble exec | FAILED_NEEDS_REVIEW default |
| Cloud silent failover | posible | bloqueado por default |
| Quórum single-PC | teatro | eliminado |
| Tamper hash chain local | falsa seguridad | no se promete |
| Repair storm | posible | circuit breaker |
| Sobre-diseño bloquea Fase A | alto | Fase A minimal |

---

# 8. RESPUESTA DIRECTA AL PEDIDO

> “Si encontrás una arquitectura superior, aunque cambie radicalmente la v0.2, proponela.”

**Sí: v0.3 Kernel + Runners es superior para Nexus hoy y a 2–3 años vista**, salvo que el objetivo real sea construir una plataforma multi-host tipo cluster de agentes (no es el pain actual).

La v0.2 es una buena **visión aspiracional**.  
La v0.3 es una **arquitectura implementable sin autoengaño**.

---

# 9. PEDIDO AL EQUIPO (humano + ChatGPT)

Confirmar o refutar con argumentos técnicos:

1. ¿Aceptan abandonar event sourcing/hash chain/seal crypto en V1?  
2. ¿Aceptan que bootstrap NO sea executor, sino `kernel.repair`?  
3. ¿Aceptan failover cloud **opt-in por job** (default false)?  
4. ¿Aceptan TTL → `ABANDONED` en lugar de QUEUED infinito?  
5. ¿Aceptan que “quórum de 2 manos” en single-host se elimine?

Si ChatGPT defiende v0.2, que responda específicamente a las contradicciones C1–C8 y a la falsa seguridad del hash chain local.

---

# 10. ESTADO

- v0.2: NO aprobada para implementación por este comité  
- v0.3: propuesta recomendada  
- Código: todavía no  
- Próximo paso: ratificar v0.3 o contra-argumentar punto por punto

Fin del Design Review.
