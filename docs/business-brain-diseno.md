# Business Brain — Diseño conceptual en profundidad

**Componente:** Business Brain  
**Producto:** Mercadeo IA  
**Tipo:** Diseño conceptual. Sin implementación.  
**Versión:** 1.0

**Documentos relacionados:**
- `docs/FOUNDATIONAL_PRINCIPLES.md` — Constitución del proyecto
- `docs/business-brain-modelo-de-razonamiento.md` — **Modelo de razonamiento estratégico** (referencia cognitiva definitiva)
- `docs/mercadeo-ia-master-blueprint.md` — Arquitectura general (Sección V.8)

---

## Resumen

El **Business Brain** es el componente más importante de Mercadeo IA.

Es el **único** que dialoga con el empresario. Todos los demás cerebros generan **evidencia**. El Business Brain **integra** esa evidencia, **detecta conflictos**, **consulta** la experiencia acumulada, **construye hipótesis** y **presenta** una propuesta completamente explicable.

No es un chatbot. No es un motor de reglas. No es un LLM que responde preguntas.

Es el **sistema de síntesis estratégica** que convierte el conocimiento distribuido de Mercadeo IA en claridad para decidir — durante décadas, sin reemplazar al empresario.

---

## 1. Filosofía

### 1.1 Qué es el Business Brain

El Business Brain es la **capa de integración cognitiva** de Mercadeo IA.

Su función es tomar un **problema de decisión** expresado por el empresario (o detectado por señales del sistema) y producir una **síntesis estratégica explicable** que integre:

- Evidencia de todos los cerebros de dominio
- Relaciones del Knowledge Graph
- Experiencia y heurísticas de Legacy Intelligence
- Calibración y aprendizaje acumulado del Learning Engine
- Patrones, causas, consecuencias y contexto — no solo datos puntuales

El Business Brain **piensa en patrones y relaciones**. Usa el tiempo solo para ubicar esos patrones en una línea histórica.

### 1.2 Qué problema resuelve

| Problema del empresario | Cómo lo resuelve el Business Brain |
|-------------------------|-----------------------------------|
| Información dispersa en muchos dominios | Una sola síntesis integrada |
| Señales contradictorias entre áreas | Conflictos explícitos, nunca ocultos |
| Decisiones sin memoria institucional | Consulta Legacy con patrones similares |
| Datos sin contexto ni causa | Cruza evidencia con experiencia y hipótesis |
| Incertidumbre invisible | Confianza explícita y riesgos nombrados |
| Conocimiento que se pierde con las personas | Hereda y aplica experiencia estructurada |
| Sobrecarga cognitiva | Reduce complejidad sin simplificar en exceso |

**Problema central que resuelve:** el empresario no puede integrar mentalmente, en tiempo real, todo lo que Mercadeo IA sabe. El Business Brain hace esa integración **a su servicio**, no en su reemplazo.

### 1.3 Qué NO es — y qué NO debe hacer

| Anti-patrón | Por qué está prohibido |
|-------------|------------------------|
| **Chatbot inteligente** | Conversación sin evidencia trazable degenera en opinión |
| **Motor de reglas rígido** | Las decisiones estratégicas no se reducen a if/else |
| **LLM que responde preguntas** | Genera texto plausible sin garantía de evidencia |
| **Autopiloto de decisiones** | Viola el principio rector — el empresario decide |
| **Oráculo con respuesta única** | Oculta conflictos y alternativas |
| **CRM / asistente operativo** | No gestiona tareas; integra inteligencia estratégica |
| **Dashboard narrador** | No describe números; sintetiza para decidir |
| **Filtro de alertas** | No lista notificaciones; construye comprensión |

**Lista explícita de lo que NO debe hacer:**

1. Tomar decisiones por el empresario — ni explícita ni implícitamente
2. Ocultar conflictos entre cerebros
3. Entregar propuestas sin los elementos obligatorios de explicabilidad
4. Presentar una sola opción como si fuera la única posible
5. Usar lenguaje imperativo (*"debe comprar"*, *"tiene que esperar"*)
6. Priorizar la respuesta más reciente sobre patrones validados sin justificar
7. Ignorar Legacy cuando existe experiencia con patrón similar
8. Operar sin consultar el Knowledge Graph (entidades aisladas)
9. Simular certeza donde la confianza es baja
10. Sustituir el juicio humano en decisiones de alto impacto emocional o ético

### 1.4 Límites del Business Brain

| Límite | Descripción |
|--------|-------------|
| **Límite de decisión** | Propone hipótesis; nunca ejecuta ni impone |
| **Límite de certeza** | No puede afirmar lo que la evidencia no sustenta |
| **Límite de cobertura** | Si un cerebro no tiene datos, debe declararlo — no inventar |
| **Límite temporal** | No predice con precisión falsa; opera en bandas y patrones |
| **Límite de contexto humano** | No conoce lo que el empresario no registró ni dijo |
| **Límite ético** | No recomienda acciones fuera del marco legal o ético del negocio |
| **Límite de completitud del gemelo** | Si el Market Digital Twin está incompleto, la confianza baja proporcionalmente |
| **Límite de delegación** | Debe resistir la tendencia del usuario a delegar sin querer |

### 1.5 Principios que nunca puede violar

Estos principios derivan de `FOUNDATIONAL_PRINCIPLES.md` y son **inviolables**:

| # | Principio | Implicación para Business Brain |
|---|-----------|--------------------------------|
| 1 | **El empresario decide** | Toda salida termina con decisión humana explícita |
| 2 | **Explicabilidad obligatoria** | Sin los 8 elementos, no hay entrega |
| 3 | **Patrones antes que tiempo** | Razonar por patrón, relación y causa — no por "el mes pasado" |
| 4 | **Nada aislado** | Toda evidencia se conecta en el grafo |
| 5 | **Experiencia es activo** | Legacy se consulta sistemáticamente, no opcionalmente |
| 6 | **Conflicto visible** | Contradicciones se muestran, no se resuelven en silencio |
| 7 | **Hipótesis, no órdenes** | Lenguaje de posibilidad y trade-offs |
| 8 | **Confianza honesta** | Incertidumbre explícita siempre |
| 9 | **Conocimiento reutilizable** | Legacy se invoca por patrón, no por fecha |
| 10 | **Pregunta rectora** | Si la síntesis no mejora la decisión, no se entrega |

---

## 2. Ciclo completo de decisión

Arquitectura conceptual del proceso de pensamiento del Business Brain — de problema a propuesta explicable.

### 2.1 Vista general del ciclo

```
PROBLEMA DE DECISIÓN (empresario o señal del sistema)
        ↓
[1] COMPRENSIÓN — ¿Qué se está decidiendo realmente?
        ↓
[2] CONTEXTO — ¿Qué entidades, patrones y relaciones están involucradas?
        ↓
[3] CONSULTA DISTRIBUIDA — ¿Qué evidencia aporta cada cerebro?
        ↓
[4] INTEGRACIÓN — ¿Qué cuadro coherente emerge? ¿Dónde hay tensiones?
        ↓
[5] CONFLICTO — ¿Hay contradicciones? Protocolo formal.
        ↓
[6] LEGACY — ¿Qué experiencias tienen el mismo patrón?
        ↓
[7] HIPÓTESIS — ¿Qué líneas de acción son razonables?
        ↓
[8] EXPLICABILIDAD — Ensamblar los 8 elementos obligatorios.
        ↓
[9] ENTREGA — Síntesis al empresario. Decisión humana.
        ↓
[10] REGISTRO — DecisionRecord para Learning Engine.
```

### 2.2 Fase 1 — Comprensión del problema

**Entrada:** Pregunta, dilema o señal del empresario.  
Ejemplo: *"¿Adelanto la compra de contenedores de categoría X antes del pico estacional?"*

**Qué hace el Business Brain:**

- Identifica el **tipo de decisión**: compra, stock, precio, producto, salida, espera, diversificación
- Extrae **entidades involucradas**: producto, categoría, proveedor, mercado, competidores
- Detecta **horizonte implícito**: táctico (semanas), estratégico (meses), estructural (años)
- Reformula internamente el problema en términos de **patrón**: no *"¿compro en marzo?"* sino *"¿conviene anticipar exposición ante patrón de flete alcista + demanda creciente + riesgo de saturación?"*
- Si el problema es ambiguo, **pregunta al empresario** antes de consultar cerebros — es el único diálogo permitido en esta fase

**Salida de fase:** Marco de decisión claro — problema, entidades, horizonte y patrón identificado.

### 2.3 Fase 2 — Contexto vía Knowledge Graph

**Qué hace:**

- Consulta Knowledge Engine: entidades relacionadas, aristas, patrones previos
- Responde: ¿qué más está conectado a este problema que el empresario podría no estar viendo?
- Ejemplo: el producto X comparte proveedor con competidor Y; la categoría tiene concentración de importación en un solo país

**Salida de fase:** Mapa relacional del problema — quién, qué, cómo se conecta.

### 2.4 Fase 3 — Consulta distribuida

Consulta **en paralelo** a cada cerebro con preguntas específicas (detalle en Sección 3).

**Salida de fase:** Conjunto de paquetes de evidencia por cerebro, cada uno con confianza propia.

### 2.5 Fase 4 — Integración

**Qué hace:**

- Agrupa evidencia por **tema**: costo, demanda, riesgo, oportunidad, competencia, macro
- Identifica **convergencias**: múltiples cerebros apuntan en la misma dirección
- Identifica **divergencias**: cerebros tensionan entre sí
- Construye **cadena causal**: causa → consecuencia → implicación para la decisión
- Pondera por confianza de cada fuente (detalle en Sección 3.3)

**Salida de fase:** Cuadro integrado con zonas de acuerdo y zonas de tensión marcadas.

### 2.6 Fase 5 — Resolución de conflictos

Si hay divergencia significativa, activa el **Protocolo de Conflicto** (Sección 4).  
Nunca salta esta fase si hay contradicción material.

### 2.7 Fase 6 — Consulta Legacy

**Qué hace:**

- Busca experiencias con **patrón similar** — no con fecha similar
- Evalúa `applies_when` y `does_not_apply_when` del contexto actual
- Invoca heurísticas activas que toquen el dominio
- Si Legacy **contradice** la evidencia actual, lo presenta como conflicto adicional

**Salida de fase:** Experiencias y heurísticas citables con confianza y aplicabilidad.

### 2.8 Fase 7 — Construcción de hipótesis

**Qué hace:**

- Genera **2 a 4 hipótesis de acción** razonables — nunca una sola
- Cada hipótesis incluye: acción posible, condiciones bajo las cuales tendría sentido, riesgos, evidencia que la sustenta y evidencia que la debilita
- Marca una hipótesis como **más sólida** solo si la evidencia converge con alta confianza — y explica por qué
- Si ninguna hipótesis es claramente superior, **lo declara**

**Lenguaje obligatorio:** *"Una hipótesis razonable sería…"*, *"La evidencia sugiere con mayor solidez…"*, *"Si prioriza X sobre Y, podría considerar…"*

### 2.9 Fase 8 — Explicabilidad

Explainability Engine valida que los 8 elementos obligatorios estén completos (Sección 5).  
Si falta alguno, el Business Brain **no entrega** — vuelve a la fase que falta.

### 2.10 Fase 9 — Entrega al empresario

**Estructura fija de entrega:**

1. **Reformulación del problema** — para confirmar comprensión compartida
2. **Síntesis ejecutiva** — 3-5 líneas, patrones principales
3. **Evidencia integrada** — por dominio, con confianza
4. **Conflictos detectados** — si existen, prominentes
5. **Experiencia Legacy relevante** — patrón, no anécdota
6. **Hipótesis de acción** — 2-4 opciones con trade-offs
7. **Hipótesis más sólida** — con justificación, nunca como orden
8. **Elementos de explicabilidad completos** — anexo estructurado
9. **Pregunta de cierre al empresario** — *"¿Qué decide? ¿Qué contexto adicional tiene que el sistema no conoce?"*

### 2.11 Fase 10 — Registro para aprendizaje

Tras la decisión del empresario (inmediata o posterior):

- Registra DecisionRecord
- Alimenta Learning Engine con decisión, evidencia usada, resultado posterior
- Calibra confianza de heurísticas invocadas

El ciclo cierra el flywheel de Mercadeo IA.

---

## 3. Consulta distribuida

El Business Brain no **llama** a los cerebros como funciones. Publica un **marco de consulta** en el Event Fabric y recibe **paquetes de evidencia** estructurados.

### 3.1 Estructura de una consulta

Cada consulta a un cerebro incluye:

| Campo | Contenido |
|-------|-----------|
| decision_frame | Problema reformulado en términos de patrón |
| entities_involved | Entidades del grafo involucradas |
| questions | Preguntas específicas a ese cerebro |
| min_confidence_threshold | Umbral mínimo para incluir evidencia |
| context_from_graph | Relaciones relevantes ya conocidas |

### 3.2 Consultas por cerebro

#### Buyer Intelligence

| Preguntas que realiza el Business Brain | Respuestas esperadas |
|----------------------------------------|---------------------|
| ¿Qué patrón de demanda existe para esta categoría/producto? | Señal de demanda, momentum de consultas, dirección |
| ¿La demanda anticipa o acompaña la oferta? | Gap demanda-oferta, fase del patrón |
| ¿Hay segmentos con demanda diferenciada? | Perfiles, intención, sensibilidad |
| ¿Qué patrón de consultas precedió situaciones similares? | Precedente histórico del patrón |

**Formato de respuesta esperado:** señales con magnitud, dirección, confianza, período de observación, entidades relacionadas.

#### Market Intelligence

| Preguntas | Respuestas esperadas |
|-----------|---------------------|
| ¿Qué hacen los competidores en esta categoría? | Precios, publicaciones, participación |
| ¿Hay patrón de guerra de precios emergente? | Señal, participantes, intensidad |
| ¿Cómo evoluciona el precio de mercado? | Tendencia, dispersión, convergencia |
| ¿Hay nuevos jugadores o salidas? | Cambio estructural del patrón competitivo |

#### Product Intelligence

| Preguntas | Respuestas esperadas |
|-----------|---------------------|
| ¿En qué fase del ciclo de vida está este producto/categoría? | Fase, señales de la fase, confianza |
| ¿Cuál es el margen actual y proyectado? | Banda de margen, factores de presión |
| ¿Conviene entrar, mantener, reducir o salir? | Evaluación por patrón de ciclo |
| ¿Hay cannibalización o producto sucesor? | Relaciones de portafolio |

#### Supply Intelligence

| Preguntas | Respuestas esperadas |
|-----------|---------------------|
| ¿Qué patrón muestran las importaciones? | Volumen, participación, tendencia |
| ¿Hay concentración de mercado o de proveedor? | Índices, entidades dominantes |
| ¿Cuál es la velocidad de reposición del mercado? | Frecuencia, lead time del patrón |
| ¿Hay riesgo de desabastecimiento u oportunidad de compra? | Señales del radar estratégico |
| ¿Cómo evolucionan los costos declarados? | Tendencia de costo, implicación en reposición |

#### Freight Intelligence (vía Supply Intelligence)

| Preguntas | Respuestas esperadas |
|-----------|---------------------|
| ¿Qué patrón de flete existe en la ruta relevante? | Tendencia, ciclo, MA 30/90 |
| ¿Hay evento extraordinario reciente? | Picos, rupturas, alertas |
| ¿Cómo impacta el flete en el costo de reposición? | % impacto estimado |
| ¿El patrón sugiere adelantar o esperar compra? | Hipótesis logística con confianza |

#### Economic Intelligence

| Preguntas | Respuestas esperadas |
|-----------|---------------------|
| ¿Qué factores macro afectan esta decisión? | TC, inflación, tasas, aranceles |
| ¿Hay patrón de presión en costo o demanda macro? | Dirección, magnitud, horizonte |
| ¿El contexto macro refuerza o debilita otras señales? | Interacción con evidencia de otros cerebros |

#### Knowledge Engine

| Preguntas | Respuestas esperadas |
|-----------|---------------------|
| ¿Qué entidades están relacionadas con este problema? | Grafo local: nodos y aristas |
| ¿Hay patrones previos registrados en estas relaciones? | Patrones históricos en el grafo |
| ¿Hay entidades huérfanas o datos incompletos? | Completitud, impacto en confianza |
| ¿Qué conexiones no obvias existen? | Proveedor compartido, categoría vecina, etc. |

#### Legacy Intelligence

| Preguntas | Respuestas esperadas |
|-----------|---------------------|
| ¿Existen experiencias con patrón similar? | Experiencias con `applies_when` relevante |
| ¿Cuándo NO aplicaría esas experiencias hoy? | `does_not_apply_when` evaluado contra contexto |
| ¿Qué heurísticas activas tocan este dominio? | Reglas, confianza, excepciones |
| ¿Legacy contradice la evidencia actual? | Conflicto experiencia vs datos |

#### Learning Engine

| Preguntas | Respuestas esperadas |
|-----------|---------------------|
| ¿Decisiones similares pasadas tuvieron buen resultado? | Outcomes de DecisionRecords similares |
| ¿Las confianzas previas en este patrón fueron calibradas? | Precisión histórica de predicciones similares |
| ¿Alguna heurística invocada fue invalidada recientemente? | Estado de validación |
| ¿El sistema aprendió algo nuevo que modifique el peso? | Ajustes de calibración recientes |

### 3.3 Ponderación de confiabilidad

Cada paquete de evidencia llega con `confidence` propia. El Business Brain calcula un **peso efectivo** por evidencia:

```
Peso efectivo = confianza del cerebro
              × frescura del dato (no confundir con prioridad temporal)
              × completitud de la fuente
              × calibración histórica (Learning Engine)
              × aplicabilidad al contexto (Legacy: applies_when)
```

**Reglas de ponderación:**

| Regla | Descripción |
|-------|-------------|
| **No gana siempre el más reciente** | Un patrón validado en 3 años pesa más que un dato de ayer sin contexto |
| **Legacy con patrón fuerte** | Pesa alto cuando `applies_when` coincide y confianza > umbral |
| **Legacy con `does_not_apply_when` activo** | Se excluye o pesa mínimo — con explicación |
| **Datos con baja completitud** | Pesan menos; la confianza global baja |
| **Convergencia multi-cerebro** | Múltiples cerebros independientes con misma dirección → confianza sube |
| **Divergencia material** | No se promedia — se activa protocolo de conflicto |
| **Heurística contested** | Peso reducido; se muestra el debate |

### 3.4 Integración de respuestas contradictorias

Cuando dos cerebros discrepan **materialmente** (no ruido menor):

1. **No promediar** — las contradicciones no se suavizan
2. **Nombrar** — cada posición con su evidencia y peso
3. **Clasificar** el tipo de conflicto (Sección 4.1)
4. **Activar protocolo** formal
5. **Presentar** al empresario sin resolver unilateralmente — salvo indicar cuál hipótesis tiene mayor solidez evidencial, siempre explicando por qué

---

## 4. Resolución de conflictos

### 4.1 Tipología de conflictos

| Tipo | Ejemplo | Naturaleza |
|------|---------|------------|
| **C1 — Táctico** | Supply dice comprar; Product dice esperar | Tension de horizonte o ciclo |
| **C2 — Evidencial** | Datos de importación vs precios de mercado no cuadran | Calidad o lag de fuentes |
| **C3 — Temporal de patrón** | Señal emergente vs experiencia Legacy de patrón opuesto | Memoria vs presente |
| **C4 — Macro vs micro** | Economic conservador; Market agresivo | Escalas diferentes |
| **C5 — Experiencia vs datos** | Legacy dice fracasó; datos actuales dicen oportunidad | `does_not_apply_when` puede resolver o profundizar |
| **C6 — Confianza** | Un cerebro con alta confianza vs otro con baja pero crítico | Peso asimétrico |

### 4.2 Protocolo formal de conflicto

```
PASO 1 — DETECCIÓN
  ¿Dos o más cerebros sugieren direcciones opuestas con confianza > umbral?
  → SÍ: declarar conflicto explícito. → NO: integrar normalmente.

PASO 2 — CARACTERIZACIÓN
  Clasificar tipo (C1–C6).
  Identificar entidades y patrones en tensión.

PASO 3 — EVIDENCIA COMPLETA DE CADA LADO
  Por cada posición en conflicto:
    - Cerebro fuente
    - Evidencia específica
    - Confianza
    - Condiciones bajo las cuales sería válida
    - Qué la debilitaría

PASO 4 — CONSULTA LEGACY OBLIGATORIA
  ¿Hubo conflicto similar antes?
  ¿Qué se decidió? ¿Qué pasó?
  ¿Aplica hoy o does_not_apply_when lo excluye?

PASO 5 — EVALUACIÓN DE SOLIDEZ (no de decisión)
  Ponderar por reglas de Sección 3.3.
  Identificar qué lado tiene mayor solidez evidencial HOY.
  NUNCA confundir "más sólido" con "debe hacerse".

PASO 6 — FORMULACIÓN DE TRADE-OFFS
  Articular qué se gana y qué se pierde con cada opción.
  Hacer visible el costo de elegir cada lado del conflicto.

PASO 7 — ENTREGA CON CONFLICTO PROMINENTE
  El conflicto aparece ANTES de la hipótesis más sólida.
  Nunca enterrado en un anexo.

PASO 8 — PREGUNTA AL EMPRESARIO
  "¿Qué prioriza en este contexto: X o Y?"
  El empresario resuelve lo que el sistema no debe resolver.
```

### 4.3 Ejemplo completo de conflicto

**Problema:** ¿Adelantar compra de importación de categoría electrodomésticos?

| Cerebro | Posición | Evidencia | Confianza |
|---------|----------|-----------|-----------|
| **Supply** | Adelantar — patrón de flete alcista + importaciones competencia bajas | Flete MA30 > MA90; importaciones −12% vs patrón estacional | 0.78 |
| **Product** | Esperar — categoría en fase saturación | 8 importadores nuevos en 6m; ciclo = saturación | 0.81 |
| **Economic** | Reducir exposición — tipo de cambio bajo presión | TC +8% en 90d; margen comprimido | 0.85 |
| **Legacy** | Caso similar 2019: adelantar en saturación → sobrestock 8 meses | Experiencia #147, applies_when: saturación + flete subiendo; confianza 0.82 | 0.82 |

**Business Brain entrega (estructura):**

> **Conflicto detectado (tipo C1 + C3):** Supply y Economic sugieren anticipar exposición ante flete y tipo de cambio. Product y Legacy sugieren cautela ante saturación y precedente de sobrestock.
>
> **Mayor solidez evidencial hoy:** Product (0.81) y Legacy (0.82) convergen en el patrón de saturación con precedente directo. Economic tiene alta confianza (0.85) pero aplica al margen, no al riesgo de inventario.
>
> **Hipótesis posibles:**
> 1. *Adelantar parcialmente* — cubrir 60d de stock, no ciclo completo (balancea flete vs saturación)
> 2. *Esperar 30-45d* — monitorear si saturación profundiza o demanda absorbe
> 3. *Adelantar solo SKUs de rotación alta* — excluir los de rotación lenta que generaron sobrestock en 2019
>
> **Hipótesis con mayor solidez combinada:** Opción 3 — respeta Legacy (no repetir sobrestock en lentos), atiende Supply (cubre rápidos antes de flete), reduce riesgo Economic.
>
> **Decisión:** corresponde al empresario.

### 4.4 Lo que el protocolo prohíbe

- Elegir un lado del conflicto sin explicar el otro
- Promediar posiciones opuestas en una recomendación única
- Usar Legacy para anular datos sin evaluar `does_not_apply_when`
- Presentar la hipótesis más sólida como decisión tomada
- Resolver conflictos de alto impacto sin preguntar al empresario

---

## 5. Explicabilidad obligatoria

Toda entrega del Business Brain debe pasar por Explainability Engine. **Si falta un elemento obligatorio, no se entrega.**

### 5.1 Los 8 elementos obligatorios

| # | Elemento | Contenido requerido |
|---|---------|---------------------|
| 1 | **Propuesta / hipótesis** | Qué línea de acción se sugiere — en lenguaje de posibilidad |
| 2 | **Evidencias utilizadas** | Hechos observables que sustentan la síntesis |
| 3 | **Datos consultados** | Fuentes, cerebros, períodos, entidades — trazables |
| 4 | **Reglas aplicadas** | Heurísticas activadas, índices, umbrales del radar Supply, etc. |
| 5 | **Experiencias relacionadas** | Legacy con patrón similar — cuándo aplica y cuándo no |
| 6 | **Hipótesis utilizadas** | Supuestos que conectan evidencia con conclusión |
| 7 | **Nivel de confianza** | Global y por componente — qué sube o baja la confianza |
| 8 | **Alternativas descartadas** | Qué otras hipótesis se evaluaron y por qué se depriorizaron |

### 5.2 Plantilla conceptual de entrega

```
─── SÍNTESIS ───
[Reformulación del problema en términos de patrón]

─── PATRONES PRINCIPALES ───
[Convergencias detectadas entre cerebros]

─── CONFLICTOS (si existen) ───
[Posición A vs Posición B, con evidencia y solidez]

─── HIPÓTESIS DE ACCIÓN ───
[2-4 opciones con trade-offs]

─── HIPÓTESIS DE MAYOR SOLIDEZ ───
[Cuál y por qué — no es una orden]

─── EXPLICABILIDAD COMPLETA ───
1. Propuesta:        [...]
2. Evidencias:       [...]
3. Datos:            [...]
4. Reglas:           [...]
5. Experiencias:     [...]
6. Hipótesis:        [...]
7. Confianza:        [...]
8. Alternativas:     [...]

─── DECISIÓN ───
[Espacio para el empresario. Pregunta de cierre.]
```

### 5.3 Niveles de confianza — cómo comunicarlos

| Banda | Significado para el empresario |
|-------|-------------------------------|
| Alta (>0.80) | Evidencia convergente, patrón claro, pocas lagunas |
| Media (0.55–0.80) | Dirección razonable pero con tensiones o datos incompletos |
| Baja (<0.55) | Exploratorio — más preguntas que respuestas; no actuar sin más contexto |

Siempre indicar **qué elevaría o bajaría** la confianza.

---

## 6. Modelo de diálogo con el empresario

### 6.1 El Business Brain como único interlocutor

| Componente | Relación con el empresario |
|------------|--------------------------|
| Buyer, Market, Product, Supply, Economic | Sin diálogo directo — solo evidencia |
| Knowledge, Legacy, Learning | Sin diálogo directo — consultados por Business Brain |
| Explainability Engine | Sin diálogo — valida antes de entregar |
| **Business Brain** | **Único que dialoga** |

### 6.2 Tipos de diálogo permitidos

| Tipo | Cuándo | Ejemplo |
|------|--------|---------|
| **Clarificación** | Problema ambiguo en Fase 1 | "¿El horizonte es 30 días o 6 meses?" |
| **Priorización** | Conflicto C1–C6 en Fase 5 | "¿Prioriza margen o rotación de stock?" |
| **Contexto humano** | Sistema no puede saber | "¿Tiene compromiso comercial que el sistema no ve?" |
| **Entrega de síntesis** | Fase 9 | Estructura completa con explicabilidad |
| **Seguimiento** | Post-decisión | "¿Qué decidió? ¿Qué resultado observó?" |

### 6.3 Tipos de diálogo prohibidos

- Charla libre sin marco de decisión
- Respuestas a preguntas generales sin consultar cerebros
- Opinión sin evidencia trazable
- Confirmación de decisiones ya tomadas sin registrar para Learning
- Simular que el sistema "decidió" algo

---

## 7. Relación con Explainability Engine y motores transversales

```
Cerebros de dominio ──→ evidencia
Knowledge / Legacy / Learning ──→ contexto y memoria
         ↓
   BUSINESS BRAIN ──→ síntesis + hipótesis + conflictos
         ↓
 EXPLAINABILITY ENGINE ──→ valida 8 elementos
         ↓
     Empresario ──→ decide
         ↓
  LEARNING ENGINE ──→ calibra
```

| Motor | Rol respecto al Business Brain |
|-------|-------------------------------|
| **Explainability Engine** | Gate de salida — valida, no redacta solo |
| **Why Engine** | Business Brain lo invoca en Fase 4 para cadenas causales |
| **What If Engine** | Business Brain lo ofrece si el empresario pide explorar escenarios |
| **Prediction Engine** | Aporta bandas proyectadas como evidencia — no como verdad |

---

## 8. Riesgos específicos del Business Brain

| Riesgo | Mitigación |
|--------|------------|
| Degenerar en chatbot | Solo diálogo con marco de decisión; evidencia obligatoria |
| Degenerar en motor de reglas | Hipótesis múltiples; conflictos visibles; patrones no if/else |
| Degenerar en LLM opaco | Explainability Engine como gate; citas trazables |
| Delegación implícita | Lenguaje de hipótesis; pregunta de cierre; DecisionRecord |
| Sobre-síntesis | No colapsar conflictos; trade-offs explícitos |
| Sub-síntesis | Consulta obligatoria a todos los cerebros relevantes |
| Legacy ignorado | Fase 6 nunca opcional |
| Confianza falsa | Bandas honestas; completitud del grafo visible |

---

## 9. Criterios de éxito del Business Brain

| Criterio | Medición conceptual |
|----------|---------------------|
| Integración | Toda entrega relevante cita ≥ 3 cerebros o declara por qué no |
| Conflictos visibles | 100% de conflictos materiales aparecen en la entrega |
| Explicabilidad | 100% de entregas con 8 elementos completos |
| Decisión humana | 100% de ciclos terminan con decisión del empresario registrada o pendiente |
| Mejora de decisión | Decision Quality Index mejora vs baseline sin sistema |
| Resistencia a delegación | Empresarios reportan sentir que deciden, no que obedecen |
| Legacy útil | ≥ 40% de decisiones estratégicas citan experiencia con patrón aplicable |

---

## 10. Cierre

El Business Brain no es la capa más visible de Mercadeo IA por accidente. Es su **razón de existir**.

Sin él, los cerebros son islas de evidencia. Con él, el empresario tiene un interlocutor que **ve el cuadro completo**, **recuerda lo que la empresa vivió**, **muestra lo que no cuadra**, y **propone caminos** con honestidad intelectual.

Nunca reemplaza al empresario.  
Nunca toma decisiones por él.  
Siempre explica.  
Siempre justifica.  
Siempre deja decidir.

---

*Business Brain — Diseño conceptual v1.0*  
*Mercadeo IA — Sistema Operativo de Inteligencia Estratégica para Empresas*  
*Sin implementación.*
