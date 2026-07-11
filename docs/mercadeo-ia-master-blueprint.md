# MERCADEO IA — MASTER BLUEPRINT

**Versión:** 1.1  
**Clasificación:** Arquitectura estratégica — documento rector  
**Horizonte:** 10 años  
**Estado:** Diseño conceptual. Sin implementación.

---

## Prefacio

Este documento redefine Mercadeo IA.

**Ya no es un CRM inteligente.**  
**Es un Sistema Operativo de Inteligencia Estratégica para Empresas.**

Su objetivo no es administrar clientes. Es ayudar a los empresarios a tomar mejores decisiones durante décadas — preservando lo que los datos solos no pueden capturar: la experiencia humana acumulada, los errores, las crisis, las intuiciones y el contexto histórico que da sentido a los números.

Este blueprint es la hoja de ruta arquitectónica para construir ese sistema.

**Documentos relacionados:**

| Documento | Rol |
|-----------|-----|
| `docs/FOUNDATIONAL_PRINCIPLES.md` | **Constitución del proyecto** — propósito, filosofía, principios, límites. Prevalece sobre todo desarrollo. |
| `docs/business-brain-diseno.md` | **Diseño en profundidad del Business Brain** — ciclo de decisión, consulta distribuida, conflictos, explicabilidad |
| `docs/mercadeo-ia-master-blueprint.md` | Arquitectura estratégica general |
| `docs/supply-intelligence-engine-diseno.md` | Diseño profundo de Supply Intelligence y Freight Intelligence |

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

**Límite sagrado:** Mercadeo IA nunca intenta reemplazar al empresario. Existe para ampliar su capacidad de observar, comprender, recordar, relacionar, aprender y decidir. La decisión final es siempre humana.

> *Cada nueva funcionalidad debe responder: ¿Ayuda realmente al empresario a tomar una mejor decisión que la que tomaría sin el sistema? Si la respuesta es no, no debe implementarse.*  
> — Ver `FOUNDATIONAL_PRINCIPLES.md`

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

## II. MODELO DE RAZONAMIENTO

### II.1 El tiempo no es el eje principal

Mercadeo IA **no razona primero** en pasado, presente o futuro.

Razona primero en:

| Eje primario | Qué aporta |
|--------------|------------|
| **Patrones** | Regularidades que se repiten en contextos distintos |
| **Relaciones** | Cómo se conectan entidades entre sí |
| **Causas** | Por qué algo ocurre, no solo que ocurre |
| **Consecuencias** | Qué desencadena qué, en cadena |
| **Señales** | Indicadores tempranos de cambio |
| **Contexto** | Circunstancias que hacen que un patrón aplique o no |

El **tiempo** se utiliza solamente para **ubicar un patrón dentro de una línea histórica** — no como categoría primaria de pensamiento.

### II.2 Implicaciones arquitectónicas

| Enfoque incorrecto | Enfoque correcto |
|--------------------|------------------|
| "¿Qué pasó el mes pasado?" | "¿Qué patrón se repite y dónde aparece en el histórico?" |
| Dashboard temporal primero | Grafo de relaciones primero; tiempo como dimensión de ubicación |
| Predicción como extrapolación lineal | Predicción como proyección de patrones con contexto |
| Experiencia atada a una fecha | Experiencia reutilizable en contextos distintos |

### II.3 Conocimiento reutilizable

El conocimiento capturado debe poder aplicarse **en distintos contextos**. Una experiencia de sobrestock en 2019 debe poder iluminar una decisión de stock en 2029 si el patrón — no la fecha — es relevante.

Legacy Intelligence, heurísticas y DecisionRecord se diseñan para **reutilización contextual**, no para archivo cronológico.

---

## III. CONSTITUCIÓN — PRINCIPIOS FUNDAMENTALES

Los principios completos, límites y criterios de aceptación de funcionalidades están en **`FOUNDATIONAL_PRINCIPLES.md`**. Aquí se resumen las implicaciones arquitectónicas.

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

Toda propuesta al empresario debe justificar:

| Elemento | Contenido |
|----------|-----------|
| Evidencia utilizada | Hechos observables que sustentan la propuesta |
| Datos utilizados | Fuentes, períodos, entidades, métricas |
| Reglas utilizadas | Heurísticas, índices, umbrales activados |
| Experiencias relacionadas | Casos Legacy con patrones similares |
| Hipótesis utilizadas | Supuestos que conectan datos con conclusión |
| Nivel de confianza | Grado de certeza y factores que lo modifican |
| Alternativas descartadas | Qué más se consideró y por qué no se propone |

Nunca entregar únicamente una recomendación. Nunca: *"Haga esto."* sin más.

**Implicación arquitectónica:** Explainability Engine es transversal y actúa como **gate obligatorio** antes de cualquier salida al empresario.

### Principio 5 — Control de complejidad

Cada nueva capacidad — módulo, submódulo, integración, automatización — debe justificar:

1. **¿Qué problema resuelve?**
2. **¿Qué decisiones mejora?**
3. **¿Qué conocimiento nuevo aporta?**

Si no mejora la capacidad de decisión del empresario, **no se incorpora**.

Este principio aplica a todo el horizonte de 10 años. La arquitectura aprobada es suficiente; no se agregan módulos sin pasar este filtro.

---

## IV. ARQUITECTURA GENERAL

### IV.1 Vista de capas

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CAPA DE EXPERIENCIA                                                    │
│  Interfaces de decisión · Diálogo · Alertas · Gemelo digital visual     │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│  BUSINESS BRAIN — Sintetizador estratégico (NO decide)                  │
│  Sintetiza · Detecta conflictos · Relaciona · Explica · Propone         │
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

### IV.2 El Knowledge Graph como columna vertebral

Todos los Grandes Cerebros comparten un **grafo de conocimiento empresarial** gestionado por Knowledge Engine. No son silos.

#### Regla fundamental: ninguna entidad aislada

**Ninguna entidad puede quedar aislada. Todo debe relacionarse.**

Cada entidad del sistema debe poder responder:

> **¿Con qué otras entidades está relacionada?**

Si una entidad no tiene relaciones, el sistema debe:
1. Intentar inferirlas automáticamente, o
2. Marcarla como `pending_relationship` para resolución, o
3. Rechazar su ingesta hasta que pueda conectarse al grafo

Entidades obligatoriamente conectables:

| Dominio | Entidades |
|---------|-----------|
| Demanda | Clientes, consultas, segmentos |
| Oferta | Productos, categorías |
| Competencia | Competidores, importadores, publicaciones, precios |
| Suministro | Proveedores, fábricas, importaciones, contenedores, fletes |
| Memoria | Experiencias, heurísticas, decisiones |
| Contexto | Economía, señales, índices |

**Nodos principales:**
`Persona`, `Empresa`, `Producto`, `Categoría`, `Cliente`, `Competidor`, `Importador`, `Proveedor`, `Fábrica`, `Contenedor`, `RutaLogística`, `Flete`, `Mercado`, `Decisión`, `Experiencia`, `Heurística`, `Señal`, `Índice`, `EventoEconómico`, `Precio`, `Importación`, `Venta`, `Consulta`

**Aristas principales:**
`importa`, `provee`, `compite_con`, `consulta_por`, `publica_sobre`, `decidió_sobre`, `resultó_en`, `similar_a`, `contradice`, `refuerza`, `abastece`, `fabrica_en`, `transporta_en`, `impacta_a`, `cuesta_flete`, `tiene_precio`, `aplica_en_contexto`

**Reglas del grafo:**

| Regla | Descripción |
|-------|-------------|
| Unicidad | Si dos motores hablan de la misma entidad real, es el mismo nodo |
| Conectividad | Toda entidad tiene ≥ 1 arista; idealmente ≥ 3 |
| Trazabilidad | Toda arista tiene fuente y confianza |
| Reutilización | Las relaciones importan más que los atributos aislados |

### IV.3 Primitiva universal: Decision Record

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

### IV.4 Bus de eventos (Event Fabric)

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

## V. LOS GRANDES CEREBROS

Cada cerebro es un **dominio de inteligencia** con: ingesta propia, modelo conceptual, índices, señales, y contribución al grafo. Ninguno es autosuficiente.

---

### V.1 Buyer Intelligence

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

---

### V.2 Product Intelligence

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

---

### V.3 Supply Intelligence — Radar estratégico de suministro

**Misión:** Convertir datos de comercio exterior, logística y cadena de suministro en un **radar estratégico** — no un repositorio de registros aduaneros.

Supply Intelligence debe detectar continuamente:

| Dimensión | Qué detecta | Decisión que habilita |
|-----------|-------------|----------------------|
| **Concentración de mercado** | Pocos importadores dominan una categoría | ¿Entrar es viable? ¿Hay espacio? |
| **Dependencia de proveedores** | Un proveedor abastece a muchos competidores o concentra categoría | ¿Riesgo de canal? ¿Buscar alternativa? |
| **Velocidad de reposición** | Frecuencia y plazo entre importaciones por producto/importador | ¿Cuánto stock necesito? ¿Cuándo reordenar? |
| **Evolución de costos** | Tendencia de valor declarado, flete, landed cost | ¿Margen futuro? ¿Timing de compra? |
| **Riesgo de desabastecimiento** | Caída de importaciones, concentración, flete ↑, lead time ↑ | ¿Asegurar stock? |
| **Oportunidades de compra** | Flete bajando, importaciones bajas, consultas subiendo | ¿Adelantar compra? |
| **Concentración por país** | Origen geográfico dominante en categoría | ¿Riesgo geopolítico? ¿Diversificar origen? |
| **Concentración por proveedor** | Proveedor único o dominante en cadena | ¿Negociar? ¿Segundo sourcing? |

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

#### Freight Intelligence — política permanente de histórico

Freight Intelligence no muestra solamente el valor actual. Es una **referencia estratégica permanente**.

**Política de conservación de histórico:**

| Parámetro | Valor |
|-----------|-------|
| Mínimo obligatorio | 24 meses |
| Objetivo arquitectónico | 5 años |
| Principio | Conservar el **mayor histórico posible** — nunca descartar datos históricos de flete |
| Ruta primaria | China → Uruguay / Río de la Plata (o proxy jerárquico) |
| Contenedores | 20ft / 40ft / 40HC |

**Qué debe mostrar siempre (más allá del valor puntual):**

| Elemento | Propósito |
|----------|-----------|
| Tendencia | Dirección estructural del costo logístico |
| Ciclos | Patrones estacionales y recurrentes |
| Promedios móviles 30/90 días | Filtrar ruido; detectar cambio de régimen |
| Eventos extraordinarios | Picos COVID, bloqueos de canal, guerras comerciales, blank sailings |
| Cambios relevantes | Cruces de medias, rupturas de rango, alertas de suba/baja fuerte |

El tiempo aquí **ubica patrones** en la línea histórica; el razonamiento primario sigue siendo: ¿qué patrón se repite, qué consecuencia tiene para el costo de reposición, y qué señal emite para la decisión de compra?

#### Supply Risk — diseño

| Tipo de riesgo | Variables |
|----------------|-----------|
| Desabastecimiento | Caída importaciones, concentración proveedor, flete ↑, lead time |
| Concentración | Un proveedor > X% del volumen de categoría |
| Geopolítico | Origen en zona de tensión, cambios arancelarios |
| Logístico | Blank sailings, congestión portuaria, flete volátil |
| Canal | Proveedor vendiendo directo (cruzar con heurísticas Legacy) |

#### Análisis crítico

- ✅ Como radar estratégico es el diferenciador central para importadores LATAM
- ✅ Freight permanente con histórico largo es infraestructura, no feature
- ⚠️ Riesgo: calidad desigual de datos por país — Uruguay puede requerir proxies siempre
- ⚠️ Riesgo: Factory Intelligence tiene cobertura muy baja en BOL estándar
- ⚠️ Riesgo: señales de concentración sin contexto de categoría generan falsos positivos

---

### V.4 Market Intelligence

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

**Cruces críticos:**
- Market ↔ Supply (importaciones vs precios publicados)
- Market ↔ Buyer (consultas vs oferta visible)
- Market ↔ Product (ciclo de vida vs dinámica competitiva)
- Market ↔ Legacy (¿vivimos esta guerra de precios antes?)

**Análisis crítico:**
- ✅ Es el cerebro más cercano al mercado visible
- ⚠️ Riesgo: scraping frágil, bloqueos, datos incompletos
- ⚠️ Riesgo: precio publicado ≠ precio real de transacción

---

### V.5 Economic Intelligence

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
- ⚠️ Riesgo: correlación ≠ causalidad

---

### V.6 Knowledge Engine

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
- ⚠️ Riesgo: ontología demasiado rígida al inicio
- ⚠️ Riesgo: entidades huérfanas si no se aplica la regla de no aislamiento
- ⚠️ Riesgo: grafo a escala 10 años puede volverse inconsultable sin índices semánticos

---

### V.7 Learning Engine

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
- ⚠️ Riesgo: catastrophic forgetting si se prioriza lo reciente sobre patrones validados

---

### V.8 Business Brain

**Documento completo:** `docs/business-brain-diseno.md`

El Business Brain es el **componente más importante** de Mercadeo IA y el **único que dialoga con el empresario**. Todos los demás cerebros generan evidencia; el Business Brain la integra.

**No es:** chatbot, motor de reglas, LLM que responde preguntas.  
**Es:** sistema de síntesis estratégica que detecta conflictos, consulta Legacy, construye hipótesis y entrega propuestas con los 8 elementos obligatorios de explicabilidad.

| Función | Qué hace | Qué NO hace |
|---------|----------|-------------|
| **Sintetizar** | Unifica evidencia de todos los cerebros | No elige por el empresario |
| **Detectar conflictos** | Protocolo formal C1–C6; nunca oculta | No promedia contradicciones |
| **Relacionar** | Conecta patrones vía Knowledge Graph | No opera en silos |
| **Explicar y justificar** | 8 elementos obligatorios vía Explainability Engine | No entrega sin sustento |
| **Proponer hipótesis** | 2–4 opciones con trade-offs | No ejecuta ni impone |

**Ciclo de decisión (10 fases):** Comprensión → Contexto → Consulta distribuida → Integración → Conflicto → Legacy → Hipótesis → Explicabilidad → Entrega → Registro.

**Principio inviolable:** la decisión final siempre pertenece al empresario.

---

### V.9 Legacy Intelligence — Preservación de experiencia empresarial

#### Modelo de experiencia — conocimiento reutilizable

**El objetivo NO es escribir un diario. El objetivo es construir conocimiento reutilizable.**

Cada experiencia se estructura como:

```
Contexto
    ↓
Problema
    ↓
Opciones consideradas
    ↓
Decisión
    ↓
Resultado
    ↓
Aprendizaje
    ↓
Cuándo volvería a aplicar
    ↓
Cuándo NO volvería a aplicar
    ↓
Nivel de confianza
    ↓
Relación con otras experiencias
```

Los campos **"cuándo volvería a aplicar"** y **"cuándo NO volvería a aplicar"** son lo que transforman una historia en conocimiento transferible entre contextos. El tiempo de ocurrencia es metadata; el patrón es el activo.

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
| lesson | text | Aprendizaje explícito y reutilizable |
| applies_when | text | Cuándo volvería a aplicar este aprendizaje |
| does_not_apply_when | text | Cuándo NO volvería a aplicar — tan importante como el aprendizaje |
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
- ⚠️ Riesgo: degenerar en diario narrativo sin estructura reutilizable
- ⚠️ Riesgo: sesgo del fundador — sus heurísticas dominan el sistema
- ⚠️ Riesgo: experiencias viejas aplicadas a contextos nuevos sin revisar `does_not_apply_when`
- ⚠️ Riesgo: información sensible en texto libre

---

## VI. MOTORES TRANSVERSALES

### VI.1 Prediction Engine

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
- Mitigación: siempre en bandas; patrones primero, tiempo como ubicación

### VI.2 Why Engine

**Misión:** Responder "¿por qué?" — causalidad operativa, no solo correlación.

| Pregunta | Fuentes |
|----------|---------|
| ¿Por qué subieron las consultas? | Buyer + Market + estacionalidad |
| ¿Por qué cayó el margen? | Economic + Supply (flete) + Market (precios) |
| ¿Por qué falló este producto? | Legacy + Product lifecycle + Market |

Combina datos, experiencias y heurísticas. Produce árbol de causas con pesos.

### VI.3 What If Engine

**Misión:** Simulación de escenarios contrafactuales.

| Escenario | Variables |
|-----------|-----------|
| "¿Y si el dólar sube 10%?" | Landed cost, margen, precio competitivo |
| "¿Y si cambio de proveedor?" | Costo, plazo, riesgo, calidad (Legacy) |
| "¿Y si adelanto compra 60 días?" | Stock, flete, riesgo saturación |
| "¿Y si entro a esta categoría?" | Proyección demanda + competencia + ciclo |

Consume Market Digital Twin como sandbox.

### VI.4 Explainability Engine

**Misión:** Garantizar que toda salida hacia el empresario cumpla el Principio 4 y los `FOUNDATIONAL_PRINCIPLES.md`.

**No es decoración de UI.** Es el validador y ensamblador obligatorio de explicaciones.

**Contrato de salida hacia el empresario:**

| # | Elemento | Obligatorio |
|---|---------|-------------|
| 1 | Propuesta / hipótesis | Sí — en lenguaje de posibilidad, no imperativo |
| 2 | Evidencia utilizada | Sí |
| 3 | Datos utilizados (fuentes, períodos) | Sí |
| 4 | Reglas utilizadas (heurísticas, índices) | Sí |
| 5 | Experiencias relacionadas (Legacy) | Si existen |
| 6 | Hipótesis utilizadas | Sí |
| 7 | Nivel de confianza | Sí |
| 8 | Alternativas descartadas | Sí |

Si Explainability Engine no puede completar los elementos obligatorios, **la propuesta no se entrega**.

| Componente | Función |
|------------|---------|
| Evidence assembler | Reúne evidencia y datos con fuentes |
| Rule tracer | Identifica qué heurísticas e índices se activaron |
| Experience linker | Encuentra Legacy con patrones similares |
| Hypothesis articulator | Explicita supuestos |
| Confidence explainer | Desglosa factores de confianza |
| Alternative generator | Documenta opciones descartadas |
| Plain language renderer | Narrativa comprensible para el empresario |

---

## VII. MARKET DIGITAL TWIN

### VII.1 Concepto

Un **gemelo digital** es una representación viva, conectada y simulable del mercado y de la empresa dentro de él. No es un dashboard. Es un modelo relacional del mundo en el que opera el empresario.

### VII.2 Entidades representadas

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

### VII.3 Propiedades del gemelo

| Propiedad | Descripción |
|-----------|-------------|
| Conectado | Toda entidad tiene relaciones explícitas — ninguna aislada |
| Patrón-first | Estado descrito por relaciones y señales; tiempo como ubicación histórica |
| Simulable | What If Engine opera sobre el gemelo |
| Observable | Señales en tiempo casi real actualizan el estado |
| Explicable | Cada relación tiene fuente y confianza |
| Vivo | Se actualiza con cada ingesta y cada decisión registrada |

### VII.4 Arquitectura del gemelo

```
Market Digital Twin
├── Entity Layer (nodos tipados)
├── Relationship Layer (aristas con peso y confianza)
├── State Layer (snapshots temporales)
├── Signal Layer (eventos que modifican estado)
├── Simulation Layer (What If)
└── View Layer (representaciones — NO diseñar UI aquí, solo contratos de vista)
```

### VII.5 Análisis crítico

- ✅ Integrador natural de todos los cerebros a 10 años
- ⚠️ Riesgo: construir el gemelo completo en fase 1
- ⚠️ Riesgo: entidades huérfanas si no se aplica regla de conectividad
- ⚠️ Riesgo: simulaciones con datos incompletos generan falsa confianza
- Mitigación: gemelo por dominio primero; indicador de completitud visible

---

## VIII. RIESGOS ARQUITECTÓNICOS GLOBALES

| # | Riesgo | Severidad | Mitigación |
|---|--------|-----------|------------|
| 1 | **Complejidad prematura** — 9 cerebros + 4 motores + gemelo desde día 1 | Crítica | Roadmap por fases; gemelo por dominio; ontología mínima |
| 2 | **Legacy vacío** — sin hábito de captura, el activo estrella no existe | Crítica | UX de captura mínima; Decision Journal; entrevistas guiadas |
| 3 | **Contradicciones no resueltas** — motores dicen cosas opuestas | Alta | Business Brain presenta conflictos; empresario decide |
| 4 | **Falsa confianza** — predicciones con datos incompletos | Alta | Confidence obligatorio; completitud del gemelo visible |
| 5 | **Sesgo del fundador** — heurísticas de una persona dominan | Alta | `does_not_apply_when`; heurísticas contested |
| 6 | **Privacidad y sensibilidad** — experiencias confidenciales | Alta | Clasificación de sensibilidad; acceso por rol |
| 7 | **Dependencia de datos externos** — licencias, lag | Alta | Multi-fuente; proxies; transparencia de lag |
| 8 | **Business Brain como decisor** — usuario delega sin querer | Alta | Lenguaje de hipótesis; decisión explícitamente humana |
| 9 | **Entidades huérfanas** — datos sin relaciones en el grafo | Alta | Regla de no aislamiento; rechazo de ingesta |
| 10 | **Razonamiento temporal primero** — ignorar patrones | Media | Modelo de razonamiento patrón-first (Sección II) |
| 11 | **Legacy como diario** — historias no reutilizables | Alta | Campos `applies_when` / `does_not_apply_when` obligatorios |
| 12 | **Scope creep** — agregar módulos sin justificación | Alta | Principio 5 de control de complejidad |
| 13 | **Adopción** — sistema que nadie alimenta | Crítica | Valor desde fase 1; captura mínima de experiencias |
| 14 | **Scope creep hacia ERP/CRM** | Media | Límites en FOUNDATIONAL_PRINCIPLES.md |

---

## IX. CONSOLIDACIÓN v1.1 — MEJORAS APLICADAS

| Área | Mejora |
|------|--------|
| Razonamiento | Patrones, relaciones y causas primero; tiempo como ubicación histórica |
| Legacy | Conocimiento reutilizable con `applies_when` / `does_not_apply_when` |
| Knowledge Graph | Regla fundamental: ninguna entidad aislada |
| Explainability | 8 elementos obligatorios; gate antes de entregar al empresario |
| Supply Intelligence | Radar estratégico con 8 dimensiones de detección |
| Freight | Política permanente de histórico: mín 24m, objetivo 5a, patrones y ciclos |
| Business Brain | Sintetiza y propone hipótesis; nunca decide |
| Complejidad | Filtro de 3 preguntas para toda capacidad nueva |
| Constitución | `FOUNDATIONAL_PRINCIPLES.md` como documento rector no técnico |
| Módulos | Arquitectura cerrada; no se agregan módulos sin justificación |

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
- Business Brain: síntesis y detección de conflictos (no decisión)

**Criterio de éxito:** Propuestas explicadas con los 8 elementos obligatorios cruzando 3+ fuentes.

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

- Legacy Intelligence maduro: `applies_when` / `does_not_apply_when` obligatorios
- Learning Engine: calibración de confianza
- What If Engine
- Factory Intelligence (donde haya datos)
- Digital Twin: fusión Supply + Market + Economic

**Criterio de éxito:** Una propuesta cita automáticamente una experiencia con patrón similar, indicando cuándo aplica y cuándo no.

### Fase 4 — Gemelo y predicción (Año 4 — 6)
**Objetivo:** Simulación estratégica.

- Market Digital Twin integrado
- Prediction Engine avanzado con bandas
- Why Engine maduro

**Criterio de éxito:** What If de escenario completo con explicación y confianza explícita.

### Fase 5 — OS maduro (Año 6 — 10)
**Objetivo:** Activo intelectual de décadas.

- Business Brain con síntesis madura y conflictos explícitos
- Gemelo con 5-10 años de histórico (flete, importaciones, precios)
- Aprendizaje compuesto visible: métricas de calidad de decisión
- Transmisión generacional de Legacy

**Criterio de éxito:** Un nuevo decisor accede en 30 días a décadas de experiencia estructurada, cruzada con señales actuales, para decidir con contexto.

---

## XI. MÉTRICAS DE ÉXITO DEL SISTEMA (10 AÑOS)

| Métrica | Qué mide |
|---------|----------|
| Decision Quality Index | ¿Los resultados mejoran cuando el empresario usa el sistema? |
| Legacy Coverage | % de decisiones estratégicas con experiencia relacionada |
| Explanation Completeness | % de propuestas con los 8 elementos obligatorios |
| Knowledge Reusability | % de experiencias con `applies_when` y `does_not_apply_when` completos |
| Graph Connectivity | % de entidades con ≥ 3 relaciones en el grafo |
| Confidence Calibration | Correlación entre confianza declarada y acierto real |
| Heuristic Health | Ratio validadas vs invalidadas por heurística |
| Pattern Detection Rate | Señales generadas por patrones vs por umbrales temporales simples |
| Adoption Depth | ¿Cuántos decisores usan y alimentan el sistema? |
| Succession Readiness | ¿Puede un nuevo decisor operar con contexto en < 30 días? |

---

## XII. DIAGRAMA DE INTERACCIÓN ENTRE CEREBROS

```
                         ┌─────────────────┐
                         │  BUSINESS BRAIN │
                         │  (sintetiza, NO │
                         │   decide)       │
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
| Experiencia | Conocimiento estructurado reutilizable — no un relato anecdótico |
| Señal | Observación de patrón que puede generar alerta o hipótesis |
| Gemelo digital | Representación conectada y simulable del mercado — sin entidades aisladas |
| Confianza | Grado de certeza explícito, siempre visible, siempre calibrable |
| Legacy | Conjunto de experiencias y heurísticas preservadas |
| Flywheel | Ciclo experiencia → conocimiento → inteligencia → decisión → experiencia |
| Patrón-first | Modelo de razonamiento donde patrones y relaciones preceden al tiempo |
| Hipótesis | Propuesta del sistema al empresario — no una orden |
| Radar estratégico | Supply Intelligence como detector continuo de riesgos y oportunidades |

---

## XIV. CIERRE

Mercadeo IA, concebido así, no compite con CRMs ni con herramientas de BI.

Compite por ser **la memoria estratégica de una empresa** — el lugar donde los patrones de décadas se encuentran con las señales del presente para reducir la incertidumbre del futuro.

La pregunta rectora de cada fase del roadmap:

> **¿Ayuda realmente al empresario a tomar una mejor decisión que la que tomaría sin el sistema?**

Si la respuesta es sí, se construye. Si no, no pertenece aquí — sin importar cuán sofisticado parezca.

La decisión final siempre es del empresario. Mercadeo IA amplía su capacidad de observar, comprender, recordar, relacionar, aprender y decidir.

---

*Master Blueprint v1.1 — Mercadeo IA, Sistema Operativo de Inteligencia Estratégica para Empresas.*  
*Constitución: `FOUNDATIONAL_PRINCIPLES.md`*  
*Sin implementación. Documento rector para desarrollo 2026–2036.*
