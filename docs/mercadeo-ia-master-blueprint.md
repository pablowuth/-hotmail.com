# MERCADEO IA — MASTER BLUEPRINT

**Versión:** 1.0  
**Clasificación:** Arquitectura estratégica — documento rector  
**Horizonte:** 10 años  
**Estado:** Diseño conceptual. Sin implementación.

---

## Prefacio

Este documento redefine Mercadeo IA.

**Ya no es un CRM inteligente.**  
**Es un Sistema Operativo de Inteligencia Estratégica para Empresas.**

Su objetivo no es administrar clientes. Es ayudar a los empresarios a tomar mejores decisiones durante décadas — preservando lo que los datos solos no pueden capturar: la experiencia humana acumulada, los errores, las crisis, las intuiciones y el contexto histórico que da sentido a los números.

Este blueprint es la hoja de ruta arquitectónica para construir ese sistema. Debe leerse como constitución, no como manual de features.

**Documentos relacionados (subsistemas detallados):**
- `docs/supply-intelligence-engine-diseno.md` — diseño profundo de Supply Intelligence y Freight Intelligence

---

## I. NORTH STAR

### I.1 Declaración de misión

Mercadeo IA debe convertirse en la plataforma que:

| Capacidad | Significado |
|-----------|-------------|
| **Aprende continuamente** | Cada interacción, decisión y resultado enriquece el sistema |
| **Preserva conocimiento empresarial** | La experiencia no se pierde cuando las personas se van |
| **Descubre patrones** | Encuentra regularidades que el ojo humano no alcanza a ver en el volumen |
| **Explica** | Toda conclusión tiene narrativa comprensible |
| **Justifica** | Toda recomendación tiene evidencia trazable |
| **Predice** | Anticipa escenarios con incertidumbre explícita |
| **Aprende de la experiencia humana** | Los datos dicen qué; las personas dicen por qué |
| **Reduce incertidumbre** | No elimina el riesgo; lo hace visible y manejable |

**Límite sagrado:** Mercadeo IA nunca intenta reemplazar al empresario. Potencia su capacidad. La decisión final es humana. El sistema informa, no manda.

### I.2 Lo que Mercadeo IA NO es

| Anti-patrón | Por qué rechazarlo |
|-------------|-------------------|
| CRM con chatbot | Reduce la visión a gestión de contactos |
| Dashboard de KPIs | Muestra números sin contexto ni memoria |
| BI tradicional | Explica el pasado, no preserva sabiduría ni predice con experiencia |
| Autopiloto de decisiones | Viola el principio de potenciación humana |
| Repositorio de documentos | Archiva sin estructurar ni relacionar conocimiento |
| Agregador de datos externos | Sin cruce con experiencia interna, es ruido caro |

### I.3 El ciclo perpetuo (flywheel)

```
Experiencia humana
       ↓
Conocimiento estructurado (Legacy + Heurísticas)
       ↓
Inteligencia (Grandes Cerebros + Motores transversales)
       ↓
Decisiones informadas (con explicación y confianza)
       ↓
Resultados observados
       ↓
Nuevo aprendizaje → vuelve a Experiencia humana
```

Este ciclo es el activo compuesto del sistema. Cada vuelta debe dejar a Mercadeo IA más inteligente que el día anterior.

### I.4 Objetivo final

Mercadeo IA no debe ser simplemente software.

Debe convertirse en **el activo intelectual más importante de una empresa**: el lugar donde vive la memoria estratégica, donde se cruzan décadas de experiencia con señales del presente, y donde cada nueva generación de decisores hereda el aprendizaje de las anteriores.

---

## II. CONSTITUCIÓN — LOS CUATRO PRINCIPIOS

### Principio 1 — La experiencia es un activo estratégico

La experiencia de un empresario no es anecdótica. Es capital.

Mercadeo IA debe:
- **Preservarla** — capturar antes de que se pierda
- **Organizarla** — estructura, no archivos sueltos
- **Relacionarla** — conectar experiencias entre sí y con datos
- **Enriquecerla** — contrastar con evidencia externa
- **Transmitirla** — a quienes llegan después
- **Nunca sustituirla** — complementar, no reemplazar

**Implicación arquitectónica:** Legacy Intelligence no es un módulo opcional. Es infraestructura de primer nivel, al mismo nivel que la base de datos transaccional.

### Principio 2 — Datos y experiencia son complementarios

| Fuente | Responde |
|--------|----------|
| Datos | ¿Qué ocurrió? |
| Experiencia | ¿Por qué ocurrió? ¿Qué no se ve en el número? |

Ningún motor de inteligencia debe operar solo con una fuente. Toda recomendación significativa cruza ambas.

**Implicación arquitectónica:** Todo `Insight` debe poder citar `Evidence` (datos) y `Experience` (legacy/heurísticas) por separado.

### Principio 3 — Aprendizaje compuesto diario

Cada interacción — consulta, decisión registrada, resultado reportado, corrección humana, excepción a una regla — debe producir un artefacto de aprendizaje persistente.

**Implicación arquitectónica:** Learning Engine no es batch mensual. Es un proceso continuo con feedback loop en cada capa.

### Principio 4 — Explicabilidad obligatoria

Toda recomendación debe incluir:

```
RECOMENDACIÓN: [qué hacer]
POR QUÉ: [razonamiento en lenguaje claro]
EVIDENCIA: [datos, fuentes, períodos]
CONFIANZA: [nivel + factores que lo reducen o aumentan]
RIESGOS: [qué puede salir mal]
EXPERIENCIA HISTÓRICA: [casos similares del Legacy]
ALTERNATIVAS: [qué más se consideró y por qué se descartó]
```

Nunca: *"Haga esto."* sin más.

**Implicación arquitectónica:** Explainability Engine es transversal. No es decoración UI; es contrato de salida de todo motor.

---

## III. ARQUITECTURA GENERAL

### III.1 Vista de capas

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CAPA DE EXPERIENCIA                                                    │
│  Interfaces de decisión · Diálogo · Alertas · Gemelo digital visual     │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│  BUSINESS BRAIN — Orquestador de inteligencia estratégica               │
│  Sintetiza · Prioriza · Resuelve conflictos entre motores               │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌──────────────┬──────────────┬──────────────┬──────────────┬─────────────┐
│ Buyer        │ Product      │ Supply       │ Market       │ Economic    │
│ Intelligence │ Intelligence │ Intelligence │ Intelligence │ Intelligence│
└──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│  MOTORES TRANSVERSALES                                                  │
│  Prediction · Why · What If · Explainability                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌──────────────────────────────┬──────────────────────────────────────────┐
│  KNOWLEDGE ENGINE            │  LEARNING ENGINE                         │
│  Grafo · Ontología · Memoria │  Feedback · Calibración · Evolución      │
└──────────────────────────────┴──────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│  LEGACY INTELLIGENCE — Memoria estratégica de la empresa                │
│  Experiencias · Heurísticas · Errores · Crisis · Decisiones             │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│  MARKET DIGITAL TWIN — Gemelo digital del mercado y la empresa          │
│  Entidades conectadas · Relaciones · Estado · Simulación                │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│  CAPA DE DATOS — Ingesta · Normalización · Linaje · Confianza             │
│  Datos internos · Datos externos · Eventos · Series temporales          │
└─────────────────────────────────────────────────────────────────────────┘
```

### III.2 El Knowledge Graph como columna vertebral

Todos los Grandes Cerebros comparten un **grafo de conocimiento empresarial** gestionado por Knowledge Engine. No son silos.

**Nodos principales:**
`Persona`, `Empresa`, `Producto`, `Categoría`, `Cliente`, `Competidor`, `Importador`, `Proveedor`, `Fábrica`, `Contenedor`, `RutaLogística`, `Mercado`, `Decisión`, `Experiencia`, `Heurística`, `Señal`, `Índice`, `EventoEconómico`, `ObraConstrucción`, `CampañaPublicitaria`, `PublicaciónSocial`, `Venta`, `Consulta`

**Aristas principales:**
`importa`, `provee`, `compite_con`, `consulta_por`, `publica_sobre`, `decidió_sobre`, `resultó_en`, `similar_a`, `contradice`, `refuerza`, `abastece`, `fabrica_en`, `transporta_en`, `impacta_a`

**Regla:** Si dos motores hablan de la misma entidad, hablan del mismo nodo en el grafo.

### III.3 Primitiva universal: Decision Record

Propuesta arquitectónica crítica: toda la plataforma gira en torno a un objeto **`DecisionRecord`**.

| Campo | Propósito |
|-------|-----------|
| context | Situación al momento de decidir |
| problem | Qué se intentaba resolver |
| options_considered | Alternativas evaluadas |
| decision | Qué se eligió |
| rationale | Por qué (humano + sistema) |
| evidence_at_time | Snapshot de datos disponibles |
| experiences_cited | Legacy/heurísticas invocadas |
| confidence | Nivel al decidir |
| outcome | Resultado observado (posterior) |
| lessons | Aprendizaje extraído |
| related_decisions | Enlaces en el grafo |

Esto unifica Legacy Intelligence, Learning Engine y Explainability. **Sin DecisionRecord, no hay memoria estratégica real.**

### III.4 Bus de eventos (Event Fabric)

| Evento | Productor | Consumidores |
|--------|-----------|--------------|
| `entity.discovered` | Cualquier motor | Knowledge Engine, Digital Twin |
| `signal.created` | Motores de dominio | Business Brain, Alertas |
| `decision.recorded` | Usuario / sistema | Legacy, Learning |
| `outcome.observed` | Usuario / datos | Learning, Legacy |
| `heuristic.validated` | Learning | Knowledge, Explainability |
| `heuristic.invalidated` | Learning | Knowledge, Explainability |
| `prediction.generated` | Prediction Engine | Business Brain, What If |
| `experience.captured` | Legacy | Knowledge, Learning |
| `confidence.updated` | Learning | Todos los motores |

Acoplamiento **asíncrono**. Los motores no se llaman directamente; publican y consumen eventos.

---

## IV. LOS GRANDES CEREBROS

Cada cerebro es un **dominio de inteligencia** con: ingesta propia, modelo conceptual, índices, señales, y contribución al grafo. Ninguno es autosuficiente.

---

### IV.1 Buyer Intelligence

**Misión:** Entender quién compra, quién podría comprar, cómo evoluciona la demanda y qué impulsa las consultas — no gestionar contactos.

**Ya no es CRM.** Es inteligencia del lado de la demanda.

| Dimensión | Qué responde |
|-----------|--------------|
| Demanda | ¿Qué buscan? ¿Con qué intensidad? ¿Dónde crece? |
| Intención | ¿Consulta exploratoria, comparación o compra inminente? |
| Segmentos | ¿Qué perfiles emergen sin segmentación manual? |
| Ciclo de compra | ¿Cuánto tarda una categoría en convertir? |
| Sensibilidad | ¿Precio, calidad, disponibilidad, marca? |
| Señales tempranas | ¿Qué consultas anticipan importaciones o ventas? |

**Entidades:** `BuyerSegment`, `DemandSignal`, `QueryPattern`, `IntentScore`, `ConversionPath`, `BuyerPersona` (dinámica, no estática)

**Índices:** Demanda relativa, momentum de consultas, gap demanda-oferta, propensión a conversión

**Cruces críticos:**
- Buyer ↔ Product (¿qué demanda hay para qué SKU?)
- Buyer ↔ Market (¿competidor captura la demanda que yo no?)
- Buyer ↔ Supply (¿consultas suben antes que importaciones?)
- Buyer ↔ Legacy (¿qué pasó la última vez que vimos este patrón de consultas?)

**Análisis crítico:**
- ✅ Correcto alejarse del CRM: la demanda es señal estratégica, no ficha de contacto
- ⚠️ Riesgo: confundir volumen de consultas con demanda real (bots, curiosidad, estudiantes)
- ⚠️ Riesgo: privacidad — inteligencia de demanda sin vigilancia indebida
- 💡 Mejora: separar **Demand Intelligence** (macro) de **Relationship Intelligence** (micro, opcional, para quien quiera gestionar relaciones sin que sea el centro)

**Módulo sugerido no contemplado:** **Voice of Customer Engine** — NLP sobre consultas reales para extraer pain points, no solo contar volumen.

---

### IV.2 Product Intelligence

**Misión:** Comprender el ciclo de vida, viabilidad, margen, posicionamiento y destino estratégico de cada producto en el catálogo y en el mercado.

| Dimensión | Qué responde |
|-----------|--------------|
| Ciclo de vida | ¿En qué fase está? (descubrimiento → declive → reemplazo) |
| Viabilidad | ¿Conviene entrar, mantener o salir? |
| Margen | ¿Actual y proyectado con flete, tipo de cambio, competencia? |
| Posicionamiento | ¿Commodity, diferenciado, premium, nicho? |
| Portafolio | ¿Qué productos se cannibalizan? ¿Qué gaps hay? |
| Sensibilidad | ¿Al flete, al dólar, a estacionalidad, a un proveedor? |

**Entidades:** `Product`, `ProductLifecyclePhase`, `MarginModel`, `PortfolioRole`, `CannibalizationLink`, `ReplacementCandidate`

**Submódulos:**
- Lifecycle Classifier
- Margin Simulator (consume Economic + Supply)
- Portfolio Optimizer
- Differentiation Analyzer

**Cruces críticos:**
- Product ↔ Supply (landed cost, riesgo de proveedor)
- Product ↔ Market (precios competencia, saturación)
- Product ↔ Buyer (demanda vs oferta)
- Product ↔ Legacy (¿qué productos similares fallaron antes y por qué?)

**Análisis crítico:**
- ✅ Es el cerebro donde convergen la mayoría de señales operativas
- ⚠️ Riesgo: sobre-optimizar margen a corto plazo ignorando posicionamiento estratégico
- ⚠️ Riesgo: clasificación de ciclo de vida sin histórico suficiente
- 💡 Mejora: **Portfolio Intelligence** como subcapa — el producto individual no se decide aislado

---

### IV.3 Supply Intelligence

**Misión:** Convertir datos de comercio exterior, logística y cadena de suministro en inteligencia para decisiones de compra, stock, sourcing y riesgo.

**Documento detallado:** `docs/supply-intelligence-engine-diseno.md`

#### Submódulos

| Submódulo | Misión | Salida clave |
|-----------|--------|--------------|
| **Import Intelligence** | Quién importó qué, cuánto, cuándo, desde dónde, a qué valor | Operaciones, importadores, patrones |
| **Freight Intelligence** | Costo de flete desde China (24m mínimo, extensible a 5 años) | Gráfica permanente, tendencia, alertas |
| **Supply Risk** | Riesgo de desabastecimiento, concentración, dependencia | Índice de riesgo, alertas |
| **Product Origin Intelligence** | De dónde viene cada categoría/producto del mercado | Mapas de origen, shifts geopolíticos |
| **Proveedor Intelligence** | Perfil de proveedores extranjeros, relaciones, volumen | Grafo proveedor↔importadores |
| **Factory Intelligence** | Planta/fábrica de origen cuando es identificable | Trazabilidad, riesgo de concentración |
| **Container Intelligence** | Volúmenes en contenedores, tipos, rutas, frecuencia | Capacidad, estacionalidad logística |

#### Freight Intelligence — requisitos reforzados

- Gráfica **siempre visible** del flete China → Uruguay/Río de la Plata (o proxy)
- Histórico mínimo **24 meses**, arquitectura preparada para **5 años**
- Tipos de contenedor: 20ft / 40ft / 40HC
- Rutas proxy jerárquicas: Sudamérica → Brasil/Santos → Costa Este USA → Europa → índice global
- Cruce con costo de reposición, timing de compra, guerra de precios

#### Supply Risk — diseño

| Tipo de riesgo | Variables |
|----------------|-----------|
| Desabastecimiento | Caída importaciones, concentración proveedor, flete ↑, lead time |
| Concentración | Un proveedor > X% del volumen de categoría |
| Geopolítico | Origen en zona de tensión, cambios arancelarios |
| Logístico | Blank sailings, congestión portuaria, flete volátil |
| Canal | Proveedor vendiendo directo (cruzar con heurísticas Legacy) |

#### Análisis crítico

- ✅ Freight permanente es diferenciador real para importadores LATAM
- ✅ Separar submódulos evita monolito incomprensible
- ⚠️ Riesgo: calidad desigual de datos por país — Uruguay puede requerer proxies siempre
- ⚠️ Riesgo: Factory Intelligence tiene cobertura muy baja en BOL estándar
- ⚠️ Riesgo: Container Intelligence sin valor declarado puede distorsionar volúmenes
- 💡 Mejora: **Landed Cost Engine** transversal que unifica flete + arancel + tipo de cambio + valor declarado
- 💡 Mejora: **Sourcing Scenario Engine** — "si cambio de China a Vietnam, ¿qué pasa con costo, plazo y riesgo?"

---

### IV.4 Market Intelligence

**Misión:** Comprender el ecosistema competitivo, precios, publicaciones, tendencias y dinámica del mercado en tiempo casi real e histórico.

| Dimensión | Qué responde |
|-----------|--------------|
| Competencia | ¿Quién vende qué, a qué precio, con qué intensidad? |
| Precios | ¿Cómo se mueven? ¿Guerra de precios? |
| Publicaciones | ¿Qué se detecta en marketplaces, web, redes? |
| Tendencias | ¿Qué emerge antes de aparecer en importaciones? |
| Participación | ¿Quién gana o pierde terreno? |
| Narrativa | ¿Cómo se posiciona la competencia en mensaje? |

**Entidades:** `Competitor`, `MarketPrice`, `DetectedPublication`, `Trend`, `MarketShareEstimate`, `PriceWarSignal`, `NarrativePattern`

**Submódulos sugeridos:**
- Competitor Intelligence
- Price Intelligence
- Publication Scanner
- Trend Detector
- Advertising Intelligence (ver sección VIII — módulo nuevo)

**Cruces críticos:**
- Market ↔ Supply (importaciones vs precios publicados)
- Market ↔ Buyer (consultas vs oferta visible)
- Market ↔ Product (ciclo de vida vs dinámica competitiva)
- Market ↔ Legacy (¿vivimos esta guerra de precios antes?)

**Análisis crítico:**
- ✅ Es el cerebro más cercano al "mercado visible"
- ⚠️ Riesgo: scraping frágil, bloqueos, datos incompletos
- ⚠️ Riesgo: precio publicado ≠ precio real de transacción
- 💡 Mejora: **Narrative Intelligence** — no solo precio, sino cómo compite la competencia en mensaje

---

### IV.5 Economic Intelligence

**Misión:** Contextualizar decisiones empresariales dentro del entorno macroeconómico: tipo de cambio, inflación, tasas, construcción, empleo, aranceles, ciclos.

| Dimensión | Qué responde |
|-----------|--------------|
| Tipo de cambio | ¿Impacto en costo importado y margen? |
| Inflación | ¿Presión en precios y poder adquisitivo? |
| Tasas | ¿Costo de capital, liquidez? |
| Construcción | ¿Actividad sectorial que impulsa categorías? |
| Aranceles | ¿Cambio regulatorio que altera landed cost? |
| Ciclo | ¿Expansión o contracción del mercado local? |

**Entidades:** `EconomicIndicator`, `ExchangeRateSeries`, `TariffRule`, `ConstructionActivity`, `MacroScenario`, `EconomicEvent`

**Cruces críticos:**
- Economic ↔ Supply (TC + flete + arancel = landed cost)
- Economic ↔ Product (margen proyectado)
- Economic ↔ Buyer (poder adquisitivo vs demanda)
- Economic ↔ Market (construcción → demanda de categorías)

**Análisis crítico:**
- ✅ Imprescindible para importadores y distribuidores LATAM
- ⚠️ Riesgo: indicadores macro son lentos — no sirven para decisiones tácticas solos
- ⚠️ Riesgo: correlación ≠ causalidad (construcción sube, ¿por eso venden más sanitarios?)
- 💡 Mejora: **Macro Scenario Layer** para What If Engine — "dólar a 50 vs 45"

---

### IV.6 Knowledge Engine

**Misión:** Gestionar el grafo de conocimiento, la ontología, la memoria estructurada y las relaciones entre todas las entidades y artefactos intelectuales.

| Responsabilidad | Detalle |
|-----------------|---------|
| Ontología | Tipos de entidades, relaciones permitidas, vocabulario controlado |
| Grafo | Almacenamiento y consulta de nodos y aristas |
| Resolución de entidades | Mismo importador = mismo nodo aunque venga de 3 fuentes |
| Memoria semántica | Búsqueda por significado, no solo keyword |
| Linaje | De dónde vino cada dato y cada conclusión |
| Versionado | La ontología evoluciona sin romper histórico |

**No confundir con Legacy:** Knowledge Engine es infraestructura. Legacy Intelligence es contenido estratégico humano.

**Análisis crítico:**
- ✅ Sin esto, los cerebros son islas
- ⚠️ Riesgo: ontología demasiado rígida al inicio — paralysis by design
- ⚠️ Riesgo: grafo a escala 10 años puede volverse inconsultable
- 💡 Mejora: ontología **evolutiva** con versiones; empezar mínima, expandir por uso real
- 💡 Mejora: **Semantic Layer** unificado para que todos los motores hablen el mismo lenguaje de categorías

---

### IV.7 Learning Engine

**Misión:** Cerrar el ciclo de aprendizaje: capturar resultados, calibrar confianza, validar o invalidar heurísticas, mejorar predicciones.

| Proceso | Descripción |
|---------|-------------|
| Outcome tracking | ¿Qué pasó después de cada decisión/recomendación? |
| Calibration | ¿Las confianzas declaradas coinciden con resultados reales? |
| Heuristic evolution | Subir o bajar confianza de reglas según evidencia |
| Pattern discovery | Detectar patrones nuevos en decisiones + resultados |
| Feedback humano | Correcciones explícitas del empresario |
| Model refresh | Reentrenar o ajustar modelos con nuevo conocimiento |

**Tipos de aprendizaje:**

| Tipo | Fuente |
|------|--------|
| Explícito | Usuario registra resultado o corrige recomendación |
| Implícito | Cambio de comportamiento (compró pese a recomendación de esperar) |
| Contrafactual | What If comparado con lo que realmente ocurrió |

**Análisis crítico:**
- ✅ Es lo que convierte software en activo compuesto
- ⚠️ Riesgo: feedback escaso — empresarios no documentan decisiones
- ⚠️ Riesgo: aprendizaje de errores sin contexto reproduce sesgos
- ⚠️ Riesgo: catastrophic forgetting si se prioriza lo reciente
- 💡 Mejora: **Decision Journal** UX mínima — 3 campos post-decisión, no formulario largo
- 💡 Mejora: pesos temporales — reciente importa más, pero Legacy nunca desaparece

---

### IV.8 Business Brain

**Misión:** Orquestador estratégico. Sintetiza señales de todos los cerebros, resuelve conflictos, prioriza, y produce recomendaciones unificadas con explicación completa.

**Ejemplo de conflicto:**
- Supply dice: "adelantar compra, flete subiendo"
- Product dice: "producto en saturación, no agregar stock"
- Legacy dice: "la última vez que adelantamos compra en saturación, tuvimos sobrestock 8 meses"

**Business Brain debe:**
1. Presentar las tres perspectivas
2. Ponderar por confianza y recencia
3. Recomendar con matices
4. Nunca ocultar el conflicto

**No es un LLM suelto.** Es una capa de síntesis con reglas, scores y citas obligatorias.

**Análisis crítico:**
- ✅ Necesario — sin orquestador, el usuario recibe 9 alertas contradictorias
- ⚠️ Riesgo: convertirse en caja negra si se delega todo a un modelo generativo
- ⚠️ Riesgo: single point of failure conceptual
- 💡 Mejora: **Conflict Resolution Protocol** documentado — cómo se pondera Legacy vs datos recientes
- 💡 Mejora: modo "solo presentar opciones" vs "recomendar" — el empresario elige el modo

---

### IV.9 Legacy Intelligence

**Misión:** Preservar la experiencia empresarial como activo estratégico estructurado. **Especialmente errores, crisis y fracasos** — no solo éxitos.

#### Modelo de experiencia

```
Contexto
    ↓
Problema
    ↓
Opciones consideradas
    ↓
Decisión tomada
    ↓
Resultado observado
    ↓
Aprendizaje extraído
    ↓
Nivel de confianza
    ↓
Relación con otras experiencias
```

#### Qué capturar

| Categoría | Ejemplos |
|-----------|----------|
| Errores | Sobrestock, proveedor equivocado, producto lanzado antes de tiempo |
| Crisis | Tipo de cambio, quiebre de proveedor, pandemia, guerra de precios |
| Fracasos | Producto discontinuado, cliente perdido, canal que colapsó |
| Decisiones difíciles | Salir de un mercado, cambiar proveedor principal |
| Intuiciones | "Sentía que el mercado no estaba listo" — capturar antes de que se diluya |
| Heurísticas | Reglas nacidas de experiencia (ver sección V) |
| Cambios de mercado | Pivots del sector, nuevas regulaciones vividas |
| Contexto histórico | "En 2008 hicimos X y pasó Y" |

#### Entidad: Experience (`experience`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| title | string | Título memorable |
| context | text | Situación de mercado, empresa, época |
| problem | text | Qué se enfrentaba |
| options | jsonb | Opciones que se consideraron |
| decision | text | Qué se decidió |
| outcome | text | Qué pasó (éxito, fracaso, mixto) |
| lesson | text | Aprendizaje explícito |
| confidence | float | Qué tan aplicable es hoy |
| emotional_weight | enum | low, medium, high — decisiones traumáticas importan |
| tags | string[] | categoría, producto, proveedor, mercado |
| related_experience_ids | UUID[] | Experiencias similares o contrastantes |
| related_heuristic_ids | UUID[] | Reglas derivadas |
| captured_by | person | Quién aportó la experiencia |
| captured_at | date | Cuándo se preservó |
| era | string | "pre-pandemia", "2015-2018", etc. |
| evidence_links | jsonb | Datos que corroboran o contradicen |

#### Entidad: Heuristic (`heuristic`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | |
| rule | text | La regla en lenguaje natural |
| context | text | Cuándo aplica |
| evidence | jsonb | Experiencias y datos que la sustentan |
| exceptions | jsonb | Cuándo NO aplica |
| confidence | float | 0–1, evoluciona con el tiempo |
| times_applied | int | Cuántas veces se invocó |
| times_validated | int | Cuántas veces resultó correcta |
| times_invalidated | int | Cuántas veces falló |
| derived_from | UUID[] | Experiencias origen |
| status | enum | draft, active, deprecated, contested |
| last_reviewed_at | date | |

**Ejemplo de heurística:**
> "Cuando un proveedor comienza a vender directamente a los clientes de sus distribuidores, normalmente ese producto comienza a perder atractivo para el canal."

- Contexto: distribución B2B, categorías commoditizables
- Excepción: productos con servicio postventa obligatorio
- Evidencia: 3 experiencias Legacy + 2 casos en Import Intelligence
- Confianza: 0.78

#### Análisis crítico

- ✅ Es el activo más difícil de replicar y el más valioso a 10 años
- ⚠️ Riesgo: captura lenta — sin hábito, queda vacío
- ⚠️ Riesgo: sesgo del fundador — sus heurísticas dominan el sistema
- ⚠️ Riesgo: experiencias viejas aplicadas a contextos nuevos
- ⚠️ Riesgo: información sensible (proveedores, márgenes) en texto libre
- 💡 Mejora: **Experience Interview Mode** — guía conversacional para extraer experiencias sin formularios
- 💡 Mejora: **Contested Heuristics** — cuando datos actuales contradicen Legacy, mostrar el debate explícitamente
- 💡 Mejora: **Succession Mode** — transmisión estructurada a siguiente generación

---

## V. MOTORES TRANSVERSALES

### V.1 Prediction Engine

**Misión:** Generar proyecciones con horizonte, intervalo de confianza y variables consideradas.

| Tipo de predicción | Ejemplos |
|--------------------|----------|
| Demanda | Consultas, ventas por categoría |
| Precio | Precio de mercado, valor declarado importación |
| Flete | Tendencia 30/90 días |
| Saturación | Tiempo estimado hasta guerra de precios |
| Margen | Banda probable en 6 meses |
| Riesgo | Probabilidad de desabastecimiento |

**Contrato de salida:**
```
predicción + horizonte + intervalo + variables + confianza + qué invalidaría la predicción
```

**Análisis crítico:**
- ⚠️ Riesgo: falsa precisión — mostrar decimales donde hay incertidumbre
- 💡 Mejora: siempre en bandas, nunca punto único para decisiones estratégicas

### V.2 Why Engine

**Misión:** Responder "¿por qué?" — causalidad operativa, no solo correlación.

| Pregunta | Fuentes |
|----------|---------|
| ¿Por qué subieron las consultas? | Buyer + Market + estacionalidad |
| ¿Por qué cayó el margen? | Economic + Supply (flete) + Market (precios) |
| ¿Por qué falló este producto? | Legacy + Product lifecycle + Market |

Combina datos, experiencias y heurísticas. Produce árbol de causas con pesos.

### V.3 What If Engine

**Misión:** Simulación de escenarios contrafactuales.

| Escenario | Variables |
|-----------|-----------|
| "¿Y si el dólar sube 10%?" | Landed cost, margen, precio competitivo |
| "¿Y si cambio de proveedor?" | Costo, plazo, riesgo, calidad (Legacy) |
| "¿Y si adelanto compra 60 días?" | Stock, flete, riesgo saturación |
| "¿Y si entro a esta categoría?" | Proyección demanda + competencia + ciclo |

Consume Market Digital Twin como sandbox.

### V.4 Explainability Engine

**Misión:** Garantizar que toda salida del sistema cumpla el Principio 4.

**No es un módulo opcional de UI.** Es el formateador y validador de explicaciones antes de que lleguen al usuario.

| Componente | Función |
|------------|---------|
| Evidence assembler | Reúne citas de datos |
| Experience linker | Encuentra Legacy relevante |
| Confidence explainer | Desglosa factores de confianza |
| Risk surfacer | Lista riesgos de la recomendación |
| Alternative generator | Qué más se consideró |
| Plain language renderer | Narrativa comprensible |

---

## VI. MARKET DIGITAL TWIN

### VI.1 Concepto

Un **gemelo digital** es una representación viva, conectada y simulable del mercado y de la empresa dentro de él. No es un dashboard. Es un modelo relacional del mundo en el que opera el empresario.

### VI.2 Entidades representadas

| Dominio | Entidades en el gemelo |
|---------|------------------------|
| Demanda | Clientes, segmentos, consultas, intención |
| Oferta competitiva | Competidores, importadores, publicaciones, precios |
| Producto | Productos propios y de mercado, categorías, ciclos |
| Suministro | Proveedores, fábricas, rutas, contenedores, fletes |
| Economía | TC, inflación, construcción, aranceles |
| Marketing | Campañas publicitarias, canales, gasto |
| Social | Publicaciones, tendencias, narrativas |
| Logística | Puertos, tiempos, costos |
| Ventas | Volúmenes, márgenes, estacionalidad |
| Memoria | Experiencias, heurísticas, decisiones pasadas |

### VI.3 Propiedades del gemelo

| Propiedad | Descripción |
|-----------|-------------|
| Conectado | Toda entidad tiene relaciones explícitas |
| Temporal | Estado en cualquier punto del histórico (mínimo 24m, objetivo 5-10 años) |
| Simulable | What If Engine opera sobre el gemelo |
| Observable | Señales en tiempo casi real actualizan el estado |
| Explicable | Cada relación tiene fuente y confianza |
| Vivo | Se actualiza con cada ingesta y cada decisión registrada |

### VI.4 Arquitectura del gemelo

```
Market Digital Twin
├── Entity Layer (nodos tipados)
├── Relationship Layer (aristas con peso y confianza)
├── State Layer (snapshots temporales)
├── Signal Layer (eventos que modifican estado)
├── Simulation Layer (What If)
└── View Layer (representaciones — NO diseñar UI aquí, solo contratos de vista)
```

### VI.5 Análisis crítico

- ✅ Visión correcta a 10 años — es el integrador natural de todos los cerebros
- ⚠️ Riesgo: intentar construir el gemelo completo en fase 1 — imposible
- ⚠️ Riesgo: mantenimiento ontológico costoso
- ⚠️ Riesgo: simulaciones con datos incompletos generan falsa confianza
- 💡 Mejora: **Gemelo por dominio** primero (Supply Twin, Market Twin) → fusión progresiva
- 💡 Mejora: indicador de **completitud del gemelo** por zona — "simulación con 40% de entidades, baja confianza"

---

## VII. MÓDULOS ADICIONALES PROPUESTOS

Módulos no pedidos explícitamente pero arquitectónicamente necesarios:

| Módulo | Misión | Por qué |
|--------|--------|---------|
| **Decision Intelligence** | Meta-capa de calidad de decisiones | Medir si las decisiones mejoran con el tiempo |
| **Regulatory Intelligence** | Aranceles, normas, compliance importación | Impacto directo en landed cost y viabilidad |
| **Construction Intelligence** | Actividad de obra pública y privada | Driver de demanda en múltiples categorías LATAM |
| **Advertising Intelligence** | Gasto y presencia publicitaria de competencia | Anticipar movimientos de mercado |
| **Capital Intelligence** | Liquidez, costo de capital, ciclo de caja | Decisiones de stock requieren dinero |
| **Relationship Intelligence** | Relaciones comerciales profundas (evolución del CRM) | Opcional, no central — relaciones como contexto, no como objetivo |
| **Reputation Intelligence** | Señales de reputación de proveedores y competidores | Riesgo de cadena de suministro |
| **Temporal Intelligence** | Estacionalidad, ciclos, calendario comercial | Casi todo es temporal; merece motor dedicado |
| **Confidence Propagation Engine** | Propagar incertidumbre entre motores | Si flete tiene baja confianza, margen proyectado también |

---

## VIII. RIESGOS ARQUITECTÓNICOS GLOBALES

| # | Riesgo | Severidad | Mitigación |
|---|--------|-----------|------------|
| 1 | **Complejidad prematura** — 9 cerebros + 4 motores + gemelo desde día 1 | Crítica | Roadmap por fases; gemelo por dominio; ontología mínima |
| 2 | **Legacy vacío** — sin hábito de captura, el activo estrella no existe | Crítica | UX de captura mínima; Decision Journal; entrevistas guiadas |
| 3 | **Contradicciones no resueltas** — motores dicen cosas opuestas | Alta | Business Brain con protocolo de conflicto explícito |
| 4 | **Falsa confianza** — predicciones y simulaciones con datos incompletos | Alta | Confidence obligatorio; completitud del gemelo visible |
| 5 | **Sesgo del fundador** — heurísticas de una persona dominan | Alta | Contested heuristics; diversidad de fuentes Legacy |
| 6 | **Privacidad y sensibilidad** — experiencias con datos confidenciales | Alta | Clasificación de sensibilidad; acceso por rol |
| 7 | **Dependencia de datos externos** — licencias, scraping, lag | Alta | Multi-fuente; proxies; transparencia de lag |
| 8 | **LLM como atajo** — Business Brain degenera en chatbot sin evidencia | Alta | Explainability Engine como gate obligatorio |
| 9 | **Catastrophic forgetting** — aprendizaje reciente borra sabiduría vieja | Media | Pesos temporales con piso para Legacy |
| 10 | **Costo de mantenimiento 10 años** — ontología, integraciones, fuentes | Media | Diseño modular; contratos estables; automatización de linaje |
| 11 | **Adopción** — sistema brillante que nadie alimenta | Crítica | Valor desde fase 1 sin Legacy completo; cada fase útil sola |
| 12 | **Scope creep hacia ERP** — intentar operar la empresa | Media | Límite claro: inteligencia estratégica, no operación |

---

## IX. CRÍTICA AL DISEÑO ANTERIOR Y MEJORAS APLICADAS

| Diseño anterior | Problema | Mejora en este blueprint |
|-----------------|----------|--------------------------|
| Mercadeo IA como CRM inteligente | Objetivo incorrecto — gestiona en vez de potenciar | OS de Inteligencia Estratégica |
| Supply Intelligence aislado | Módulo de datos sin memoria ni experiencia | Integrado al grafo + Legacy + Business Brain |
| Recomendaciones tipo "compre" | Sin explicación ni contexto | Principio 4 + Explainability Engine |
| Gráficas como fin | Visualización sin decisión | Toda gráfica ligada a decisión y señal |
| Product Intelligence mencionado pero no diseñado | Hueco arquitectónico | Cerebro completo con submódulos |
| Sin modelo de experiencia | Pérdida de conocimiento inevitable | Legacy Intelligence como infraestructura |
| Sin orquestador | Alertas contradictorias | Business Brain con resolución de conflictos |
| Sin gemelo | Cruces manuales entre motores | Market Digital Twin progresivo |
| Freight como feature | Debe ser permanente y estratégico | Widget permanente, 24m-5a, cruce con reposición |

---

## X. HOJA DE RUTA — 10 AÑOS

### Fase 0 — Fundación (Año 1, H1)
**Objetivo:** Infraestructura de conocimiento y primer valor.

- Knowledge Engine: ontología mínima, grafo básico
- DecisionRecord como primitiva
- Legacy Intelligence: captura de experiencias (MVP)
- Event Fabric
- Explainability Engine: contrato de salida
- **Primer cerebro operativo:** Supply Intelligence (Import + Freight)
- Widget flete China permanente (24 meses)

**Criterio de éxito:** Un empresario puede ver flete, importaciones, y registrar su primera experiencia estructurada.

### Fase 1 — Señales (Año 1, H2 — Año 2)
**Objetivo:** De datos a conclusiones.

- Market Intelligence: competidores, precios, publicaciones
- Buyer Intelligence: consultas y demanda
- Supply: Supply Risk, Proveedor Intelligence
- Learning Engine: outcome tracking básico
- Heurísticas: crear, consultar, evolucionar confianza
- Business Brain: síntesis simple (sin ML pesado)

**Criterio de éxito:** Recomendaciones explicadas con evidencia cruzando 3+ fuentes.

### Fase 2 — Producto y economía (Año 2 — 3)
**Objetivo:** Decisiones de catálogo y margen.

- Product Intelligence completo
- Economic Intelligence
- Supply: Product Origin, Container Intelligence
- Prediction Engine: demanda, flete, saturación
- Why Engine básico
- Market Digital Twin: dominios Supply + Market

**Criterio de éxito:** Simular margen de un producto con flete + TC + competencia.

### Fase 3 — Memoria estratégica (Año 3 — 4)
**Objetivo:** El activo Legacy cobra vida.

- Legacy Intelligence maduro: entrevistas, heurísticas contested
- Learning Engine: calibración de confianza
- What If Engine
- Factory Intelligence (donde haya datos)
- Construction Intelligence
- Digital Twin: fusión Supply + Market + Economic

**Criterio de éxito:** Una recomendación cita automáticamente una experiencia de hace 10 años relevante.

### Fase 4 — Gemelo y predicción (Año 4 — 6)
**Objetivo:** Simulación estratégica.

- Market Digital Twin integrado
- Prediction Engine avanzado con bandas
- Advertising Intelligence
- Regulatory Intelligence
- Capital Intelligence
- Temporal Intelligence

**Criterio de éxito:** What If de escenario macro completo en < 30 segundos con explicación.

### Fase 5 — OS maduro (Año 6 — 10)
**Objetivo:** Activo intelectual de décadas.

- Business Brain con resolución de conflictos madura
- Succession Mode (transmisión generacional)
- Confidence Propagation Engine
- Reputation Intelligence
- Gemelo con 5-10 años de histórico
- Decision Intelligence (¿mejoramos nuestras decisiones?)
- Aprendizaje compuesto visible: métricas de calidad de decisión

**Criterio de éxito:** Una empresa puede incorporar un nuevo CEO y en 30 días acceder a décadas de experiencia estructurada, cruzada con señales actuales, para decidir con contexto.

---

## XI. MÉTRICAS DE ÉXITO DEL SISTEMA (10 AÑOS)

| Métrica | Qué mide |
|---------|----------|
| Decision Quality Index | ¿Los resultados mejoran cuando se sigue el sistema? |
| Legacy Coverage | % de decisiones estratégicas con experiencia relacionada |
| Explanation Completeness | % de recomendaciones con los 6 elementos obligatorios |
| Confidence Calibration | Correlación entre confianza declarada y acierto real |
| Heuristic Health | Ratio validadas vs invalidadas por heurística |
| Time to Insight | Tiempo desde señal hasta recomendación explicada |
| Knowledge Half-life | Cuánto tiempo tarda una experiencia en quedar obsoleta |
| Adoption Depth | ¿Cuántos decisores usan y alimentan el sistema? |
| Uncertainty Reduction | ¿Se reduce la varianza de resultados negativos evitables? |
| Succession Readiness | ¿Puede un nuevo decisor operar con contexto en < 30 días? |

---

## XII. DIAGRAMA DE INTERACCIÓN ENTRE CEREBROS

```
                         ┌─────────────────┐
                         │  BUSINESS BRAIN │
                         └────────┬────────┘
                                  │
        ┌────────────┬────────────┼────────────┬────────────┐
        ↓            ↓            ↓            ↓            ↓
   ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐
   │ Buyer   │ │ Product  │ │ Supply   │ │ Market  │ │ Economic │
   │ Intel   │ │ Intel    │ │ Intel    │ │ Intel   │ │ Intel    │
   └────┬────┘ └────┬─────┘ └────┬─────┘ └────┬────┘ └────┬─────┘
        │           │            │            │           │
        └───────────┴────────────┴────────────┴───────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ↓                           ↓
            ┌──────────────┐           ┌──────────────┐
            │  Prediction  │           │   What If    │
            │  Why         │           │   Explain    │
            └──────┬───────┘           └──────┬───────┘
                   │                          │
                   └──────────┬───────────────┘
                              ↓
              ┌───────────────────────────────┐
              │     MARKET DIGITAL TWIN       │
              └───────────────┬───────────────┘
                              │
              ┌───────────────┴───────────────┐
              ↓                               ↓
      ┌──────────────┐               ┌──────────────┐
      │  KNOWLEDGE   │←─────────────→│   LEARNING   │
      │   ENGINE     │               │   ENGINE     │
      └──────┬───────┘               └──────┬───────┘
             │                              │
             └──────────────┬───────────────┘
                            ↓
                  ┌──────────────────┐
                  │ LEGACY           │
                  │ INTELLIGENCE     │
                  │ (Experiencias +  │
                  │  Heurísticas)    │
                  └──────────────────┘
```

---

## XIII. GLOSARIO

| Término | Definición |
|---------|------------|
| Gran Cerebro | Motor de inteligencia de dominio (Buyer, Product, Supply, etc.) |
| Motor transversal | Capacidad que atraviesa todos los dominios (Prediction, Why, etc.) |
| DecisionRecord | Primitiva que captura contexto → decisión → resultado → aprendizaje |
| Heurística | Regla nacida de experiencia con contexto, excepciones y confianza |
| Experiencia | Relato estructurado de una situación vivida con aprendizaje |
| Señal | Observación procesada que puede generar alerta o recomendación |
| Gemelo digital | Representación conectada, temporal y simulable del mercado |
| Confianza | Grado de certeza explícito, siempre visible, siempre calibrable |
| Legacy | Conjunto de experiencias y heurísticas preservadas |
| Flywheel | Ciclo experiencia → conocimiento → inteligencia → decisión → experiencia |

---

## XIV. CIERRE

Mercadeo IA, concebido así, no compite con CRMs ni con herramientas de BI.

Compite por ser **la memoria estratégica de una empresa** — el lugar donde la experiencia de décadas se encuentra con la señal del presente para reducir la incertidumbre del futuro.

La pregunta que debe responder en cada fase del roadmap no es *"¿qué feature construimos?"* sino:

> **¿Esta capacidad ayuda a un empresario a tomar una mejor decisión, con más contexto, más evidencia, y más sabiduría acumulada que ayer?**

Si la respuesta es sí, se construye. Si no, no pertenece a este sistema.

---

*Master Blueprint v1.0 — Mercadeo IA, Sistema Operativo de Inteligencia Estratégica para Empresas.*  
*Sin implementación. Documento rector para desarrollo 2026–2036.*
