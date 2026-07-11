# Business Brain – Prediction Engine

**Componente:** Prediction Engine — escenarios futuros del Business Brain  
**Producto:** Mercadeo IA  
**Tipo:** Diseño conceptual. Sin implementación.  
**Versión:** 1.0

**Documentos relacionados:**
- `docs/business-brain-modelo-de-razonamiento.md` — Modelo de razonamiento
- `docs/business-brain-learning-engine.md` — Learning Engine
- `docs/business-brain-abstraction-engine.md` — Abstraction Engine
- `docs/business-brain-curiosity-engine.md` — Curiosity Engine
- `docs/FOUNDATIONAL_PRINCIPLES.md` — Constitución del proyecto

---

## Resumen

El **Prediction Engine** define **cómo el Business Brain construye escenarios futuros** utilizando evidencia, patrones históricos, tendencias, relaciones y niveles de incertidumbre.

**No intenta adivinar el futuro.**  
Su misión es identificar los **futuros más probables** y explicar claramente **por qué** considera que podrían ocurrir.

Trabaja siempre con **probabilidades y bandas**, nunca con certezas.

**Principio rector:**

> *"El objetivo del Prediction Engine no es acertar siempre. Es reducir progresivamente la incertidumbre y mejorar la calidad de las decisiones conforme aumenta el conocimiento del sistema."*

El Prediction Engine **no decide**, **no da órdenes** y **no oculta lo que no sabe**.

---

## I. Filosofía de la predicción

### I.1 Predicción como reducción de incertidumbre

El futuro es inherentemente incierto. El Prediction Engine no lo elimina — lo **hace visible y manejable**. Su valor está en:

- Nombrar futuros plausibles antes de que lleguen
- Explicar qué evidencia los sustenta
- Indicar qué observar para confirmar o invalidar
- Permitir al empresario decidir con mapa de posibilidades, no con ilusión de certeza

### I.2 Patrones antes que extrapolación

Mercadeo IA razona **patrón-first**. El Prediction Engine no extrapola líneas rectas sobre gráficos — identifica **estructuras** que en el pasado produjeron desenlaces similares y evalúa si la configuración actual se parece.

| Enfoque débil | Enfoque del Prediction Engine |
|---------------|------------------------------|
| "Subió 3 meses → seguirá subiendo" | "Estructura de saturación emergente: consultas ↔, importaciones ↑, jugadores ↑" |
| Punto único | Banda de outcomes probables |
| Fecha exacta | Ventana temporal con probabilidad cualitativa |
| Certeza | Confianza explícita + escenarios alternativos |

### I.3 Humildad epistémica

| Principio | Enunciado |
|-----------|-----------|
| **Probabilidad, no certeza** | Toda salida lleva nivel de confianza |
| **Múltiples futuros** | Mínimo escenario probable + alternativas |
| **Falsabilidad** | Indicadores de invalidación obligatorios |
| **Revisión** | Predicciones pasadas se comparan con realidad |
| **Aprendizaje** | Fallar bien calibrado es mejor que acertar por suerte |
| **No decidir** | Escenarios informan; el empresario decide |

### I.4 Predicción al servicio de la decisión

Una predicción solo tiene valor si **cambia o informa una decisión posible**. Si ningún escenario altera qué haría el empresario, la predicción no se prioriza.

---

## II. Diferencia entre predicción, proyección y especulación

| Concepto | Definición | Evidencia | Uso en Mercadeo IA |
|----------|------------|-----------|------------------|
| **Proyección** | Extensión matemática de tendencia observable | Alta — datos de serie temporal | Base del escenario probable — nunca suficiente sola |
| **Predicción** | Escenario futuro plausible con mecanismo causal y evidencia cruzada | Media-alta — patrones + cerebros + Legacy | Salida principal del engine |
| **Especulación** | Futuro posible sin evidencia suficiente o mecanismo claro | Baja | Solo como escenario disruptivo etiquetado — nunca como probable |

**Regla:** Proyección alimenta predicción. Especulación nunca se presenta sin etiqueta de baja confianza y condiciones explícitas de activación.

```
PROYECCIÓN (datos)  →  PREDICCIÓN (patrón + mecanismo + evidencia cruzada)
                              ↓
                    ESPECULACIÓN (solo si útil — escenario disruptivo, confianza baja)
```

---

## III. Cómo utiliza cada fuente de conocimiento

### III.1 Knowledge Engine

| Aporte | Uso en predicción |
|--------|-------------------|
| Relaciones entre entidades | ¿Qué actor afecta a qué si cambia X? |
| Patrones en el grafo | Precedentes estructurales registrados |
| Completitud del mapa | Baja completitud → baja confianza |
| Entidades huérfanas | Vacíos que impiden escenario completo |

**Pregunta típica:** *"Si el proveedor Z falla, ¿quién más en el grafo se afecta?"*

### III.2 Legacy Intelligence

| Aporte | Uso |
|--------|-----|
| Experiencias con patrón similar | Precedente vivido — no misma fecha |
| Heurísticas | Condiciones bajo las cuales el desenlace ocurrió |
| `does_not_apply_when` | Invalidar predicción si contexto cambió |
| Fracasos documentados | Escenarios adversos con alta credibilidad |

**Pregunta típica:** *"¿Qué pasó la última vez que la estructura de fuerzas fue esta?"*

### III.3 Learning Engine

| Aporte | Uso |
|--------|-----|
| Calibración histórica | ¿Las confianzas pasadas acertaron? |
| Biblioteca de aprendizajes | Mecanismos confirmados o refutados |
| Falsos éxitos / fracasos útiles | No repetir predicciones que fallaron por razón conocida |
| Sesgos detectados | Ajustar peso de ciertas fuentes |

**Pregunta típica:** *"¿Predijimos bien saturación en categorías similares antes?"*

### III.4 Abstraction Engine

| Aporte | Uso |
|--------|-----|
| Patrones abstractos | Commoditización, invasión de canal, luna de miel, etc. |
| Analogías inter-industria | Desenlaces en estructuras similares |
| Riesgo de falsa analogía | Limitar confianza |

**Pregunta típica:** *"¿En qué fase del patrón abstracto está esta categoría?"*

### III.5 Curiosity Engine

| Aporte | Uso |
|--------|-----|
| Cambios lentos detectados | Señales tempranas antes de umbral de alerta |
| Tensiones latentes | Escenarios de conflicto futuro |
| Anomalías | Posibles puntos de inflexión incipientes |
| Vacíos | Incertidumbre declarada en predicción |

**Pregunta típica:** *"¿Qué deriva gradual podría materializar escenario crítico en 6 meses?"*

### III.6 Market Intelligence

| Aporte | Uso |
|--------|-----|
| Precios y publicaciones | Guerra de precios, participación |
| Competidores | Entrada/salida de jugadores |
| Tendencias | Demanda visible en mercado |
| Narrativa competitiva | Dirección del posicionamiento |

### III.7 Supply Intelligence

| Aporte | Uso |
|--------|-----|
| Importaciones | Oferta futura en canal |
| Concentración | Riesgo de desabastecimiento o guerra de stock |
| Freight Intelligence | Costo de reposición futuro |
| Velocidad de reposición | Timing de llegada de oferta |

### III.8 Economic Intelligence

| Aporte | Uso |
|--------|-----|
| Tipo de cambio, inflación | Margen y poder adquisitivo |
| Aranceles | Cambio de régimen en landed cost |
| Ciclo macro | Contexto de expansión o contracción |
| Construcción | Driver de categorías ligadas a obra |

### III.9 Integración — peso conceptual

```
Escenario = f(
  proyección de datos (Market, Supply, Economic),
  patrón abstracto (Abstraction),
  precedente Legacy,
  calibración Learning,
  señales tempranas (Curiosity),
  relaciones (Knowledge)
)
```

Ninguna fuente sola determina el escenario. **Convergencia** sube confianza; **divergencia** la baja o genera escenarios múltiples.

---

## IV. Cómo construye escenarios

### IV.1 Proceso de construcción

```
1. MARCO — ¿Qué decisión o dominio se quiere iluminar?
2. HORIZONTE — Corto / mediano / largo (ver Sección: Horizonte temporal)
3. ESTADO ACTUAL — Snapshot de patrones y señales (no solo números)
4. PROYECCIÓN — Tendencias observables en bandas
5. MECANISMO — ¿Por qué continuaría o cambiaría la trayectoria?
6. ESCENARIOS — Optimista, probable, conservador, crítico, disruptivo
7. PROBABILIDAD CUALITATIVA — Alta / media / baja por escenario
8. INDICADORES — Confirmación e invalidación por escenario
9. CONFIANZA GLOBAL — Del conjunto
10. SALIDA ESTRUCTURADA — Ver Sección: Salida del Prediction Engine
```

### IV.2 Escenarios no excluyentes

Los escenarios **coexisten** como futuros posibles — no como única verdad. El escenario **probable** es el de mayor peso evidencial hoy; puede cambiar mañana con nueva señal.

### IV.3 Conexión con Business Brain

El Prediction Engine **alimenta** el razonamiento y la síntesis — no reemplaza el modelo de razonamiento. Business Brain integra escenarios con hipótesis de acción y conflictos.

---

## V. Cómo identifica señales tempranas

### V.1 Definición

Señal temprana: observación de **cambio pequeño pero estructurado** que precede — en patrones históricos — un desenlace mayor.

### V.2 Criterios de señal temprana válida

| Criterio | Descripción |
|----------|-------------|
| Persistencia | No un dato aislado — al menos 2–3 períodos o fuentes |
| Mecanismo plausible | Cadena causa → consecuencia identificable |
| Precedente | Legacy o patrón abstracto donde esta señal precedió el desenlace |
| Materialidad | Si se confirma, altera una decisión |

### V.3 Fuentes de señales tempranas

Ver Sección dedicada: **Señales tempranas**.

### V.4 Curiosity como radar

El Curiosity Engine detecta cambios lentos y tensiones latentes — el Prediction Engine **interpreta** hacia qué escenario apuntan.

---

## VI. Cómo detecta puntos de inflexión

### VI.1 Punto de inflexión

Momento en que la **trayectoria estructural** cambia de régimen — no fluctuación normal.

| Señal de inflexión | Ejemplo |
|--------------------|---------|
| Cruce sostenido de medias móviles (flete, volumen) | MA30 cruza MA90 ≥ 4 semanas |
| Cambio de signo en segunda derivada | Crecimiento de importaciones desacelera → acelera caída |
| Entrada masiva de jugadores | Importadores activos +50% en 6m |
| Ruptura de rango histórico | Precio sale de banda 24m |
| Evento extraordinario | Arancel, pandemia, quiebre proveedor |
| Legacy + datos alineados | "Estructura igual a pre-guerra de precios 2019" |

### VI.2 Inflexión vs ruido

| Pregunta | Inflexión si |
|----------|--------------|
| ¿Persiste más de un período? | Sí |
| ¿Múltiples cerebros lo confirman? | Sí |
| ¿Hay mecanismo? | Sí |
| ¿Legacy reconoce el patrón? | Refuerza |

Si no — anotar como señal temprana, no como inflexión confirmada.

---

## VII. Cómo mide incertidumbre

### VII.1 Tipos de incertidumbre en predicción

| Tipo | Fuente | Efecto en escenario |
|------|--------|---------------------|
| **Datos** | Lag, proxy, completitud baja del grafo | Amplía bandas |
| **Modelo** | Patrón reconocido pero fase ambigua | Múltiples escenarios competidores |
| **Evento** | Riesgo de shock no modelable | Escenario crítico o disruptivo |
| **Comportamiento** | Reacción de competencia o cliente impredecible | Confianza media máxima |
| **Fundamental** | Varios futuros igualmente plausibles | No elegir uno solo |

### VII.2 Comunicación de incertidumbre

- **Bandas** en lugar de puntos ("margen 18–26%", no "margen 22%")
- **Ventanas** en lugar de fechas ("entre 4 y 8 meses", no "en junio")
- **Probabilidad cualitativa** (alta / media / baja) — no falsa precisión decimal
- **Variables críticas** — qué desconocemos que más movería el escenario

---

## VIII. Cómo calcula niveles de confianza

### VIII.1 Confianza del escenario

Confianza = función de:

```
convergencia entre fuentes (cerebros, Legacy, Abstraction)
+ calidad y frescura de datos
+ calibración histórica (Learning) en predicciones similares
+ completitud del Knowledge Graph en el dominio
+ claridad del mecanismo causal
− divergencia entre fuentes
− riesgo de falsa analogía
− especulación sin ancla
```

### VIII.2 Bandas de confianza

| Banda | Significado | Presentación |
|-------|-------------|--------------|
| **Alta** | Convergencia fuerte; mecanismo claro; precedente Legacy | "Escenario con solidez evidencial" |
| **Media** | Dirección razonable; tensiones o lagunas | "Inclinación — monitorear indicadores" |
| **Baja** | Especulativo; señal temprana; datos escasos | "Hipótesis de vigilancia — no basar decisión grande" |

### VIII.3 Confianza nunca > 0.90

Reservar 0.90+ solo para proyecciones mecánicas de corto plazo con datos completos (ej. "el contenedor en tránsito llega en 18 días"). Escenarios estratégicos rara vez superan 0.75–0.80.

---

## IX. Cómo revisa predicciones anteriores

### IX.1 Registro de predicciones

Toda predicción emitida se registra con:

- Escenarios y confianzas al momento
- Evidencia y patrones citados
- Indicadores de confirmación/invalidación comprometidos
- Horizonte de revisión
- Decisión del empresario (si aplica)

### IX.2 Ciclo de revisión

```
FECHA T0: predicción emitida
        ↓
FECHA T1: revisión intermedia (señales tempranas)
        ↓
FECHA T2: horizonte cumplido — comparar escenario probable vs realidad
        ↓
LEARNING ENGINE: clasificar acierto, fallo, falso positivo, sorpresa
        ↓
Calibrar confianza futura en dominio similar
```

### IX.3 Tipos de resultado de revisión

| Resultado | Descripción |
|-----------|-------------|
| **Acierto calibrado** | Escenario probable ocurrió; confianza era apropiada |
| **Sorpresa** | Ocurrió escenario no priorizado — aprender por qué |
| **Falso positivo** | Predicción alarmante no se materializó — revisar señales |
| **Falso negativo** | No predijimos desenlace que ocurrió — gap grave |
| **Timing erróneo** | Dirección correcta, horizonte incorrecto |

---

## X. Cómo aprende cuando una predicción falla

### X.1 Protocolo de fallo

```
1. ¿Qué escenario se materializó vs cuál predijimos?
2. ¿Falló la dirección, la magnitud o el timing?
3. ¿Qué señal ignoramos o mal interpretamos?
4. ¿Legacy tenía advertencia no ponderada?
5. ¿Falsa correlación? ¿Sobreajuste?
6. ¿Cambió el entorno entre predicción y outcome?
7. REGISTRAR en Learning Engine — tipo de aprendizaje
8. AJUSTAR calibración en dominio — no borrar predicción original
```

### X.2 Fallar bien vs fallar mal

| Fallar bien | Fallar mal |
|-------------|------------|
| Alta confianza con evidencia convergente; outcome otro escenario también listado | Certeza implícita; un solo futuro |
| Indicadores de invalidación publicados | Sin condiciones de refutación |
| Aprendizaje registrado | Ignorar fallo |

---

## XI. Cómo evita sobreajuste

### XI.1 Señales de sobreajuste

| Señal | Descripción |
|-------|-------------|
| Patrón ajustado a pocos puntos históricos | "Siempre pasa en marzo" con N=2 |
| Muchas variables para un solo caso | Explicación post-hoc |
| Predicción muy específica con datos escasos | Falsa precisión |
| Ignorar `does_not_apply_when` de Legacy | Contexto cambió |
| Reaccionar a cada anomalía | Sin persistencia |

### XI.2 Antídotos

| Antídoto | Acción |
|----------|--------|
| Exigir replicación de patrón | ≥2 precedentes o Legacy + datos |
| Preferir estructura sobre detalle | Patrón abstracto vs fecha exacta |
| Out-of-sample conceptual | ¿Patrón aplica en categoría distinta? |
| Learning Engine | ¿Predicciones similares calibraron bien? |
| Bandas amplias cuando N bajo | Humildad explícita |
| Revisión obligatoria | Feedback loop |

---

## XII. Cómo evita falsas correlaciones

### XII.1 Correlación ≠ causalidad

| Pregunta obligatoria | Si NO → no predecir causalmente |
|----------------------|--------------------------------|
| ¿Hay mecanismo que conecte A y B? | |
| ¿Legacy o Abstraction apoyan el mecanismo? | |
| ¿La correlación persiste fuera de la muestra? | |
| ¿Hay variable confundente (macro, estacionalidad)? | |
| ¿Invertir la causalidad tiene sentido? | |

### XII.2 Ejemplos de trampa

| Falsa correlación | Realidad posible |
|-------------------|------------------|
| Consultas suben cuando sube flete | Ambos driven por estacionalidad de obra |
| Importaciones bajan → desabastecimiento | Lag normal de reposición |
| Un mes de datos alineados | Ruido |

### XII.3 Protocolo

1. Nombrar mecanismo antes de escenario  
2. Buscar confundente en Economic / estacionalidad  
3. Consultar Legacy — ¿mecanismo operó antes?  
4. Si solo correlación — escenario con confianza **baja** y etiqueta "correlacional, no causal"

---

## XIII. Tipos de escenarios

Para cada tipo: condiciones necesarias, indicadores de confirmación, cancelación, riesgos y oportunidades.

---

### Escenario Optimista

**Definición:** Futuro favorable al empresario en el marco analizado — requiere que varias señales positivas se alineen.

| Dimensión | Contenido |
|-----------|-----------|
| **Condiciones necesarias** | Demanda sostenida; costo estable o bajante; competencia sin entrada masiva; ejecución sin fricción |
| **Confirmación** | Consultas ↑ sostenido; margen realizado ≥ banda superior; participación estable o ↑ |
| **Cancelación** | Entrada competidor agresivo; shock de costo; caída demanda macro |
| **Riesgos** | Sobreconfianza; sobrestock por optimismo |
| **Oportunidades** | Escalar, invertir en visibilidad, asegurar proveedor en condiciones favorables |

---

### Escenario Probable

**Definición:** Futuro con mayor peso evidencial hoy — base para planificación.

| Dimensión | Contenido |
|-----------|-----------|
| **Condiciones necesarias** | Continuidad de patrones actuales sin shock |
| **Confirmación** | Indicadores clave siguen tendencia base |
| **Cancelación** | Señal temprana fuerte en dirección opuesta |
| **Riesgos** | Tratar probable como certeza |
| **Oportunidades** | Planificar con bandas, no con punto único |

---

### Escenario Conservador

**Definición:** Futuro menos favorable pero plausible — plan de contingencia.

| Dimensión | Contenido |
|-----------|-----------|
| **Condiciones necesarias** | Presión en costo o demanda; competencia activa; sin colapso |
| **Confirmación** | Margen en banda inferior; rotación más lenta; precio bajo presión |
| **Cancelación** | Demanda rebota; costo normaliza |
| **Riesgos** | Parálisis por exceso de cautela |
| **Oportunidades** | Reducir exposición; fortalecer eficiencia; negociar |

---

### Escenario Crítico

**Definición:** Futuro adverso material — requiere condiciones de estrés pero son creíbles.

| Dimensión | Contenido |
|-----------|-----------|
| **Condiciones necesarias** | Shock de costo + demanda débil; o desabastecimiento inverso (sobrestock industria); guerra de precios |
| **Confirmación** | Margen negativo sostenido; liquidaciones competencia; cash flow tensionado |
| **Cancelación** | Estabilización macro; salida de competidores |
| **Riesgos** | No preparar aunque sea probable baja |
| **Oportunidades** | Adquirir participación si competidores quiebran; comprar activo barato |

---

### Escenario Disruptivo

**Definición:** Futuro de baja probabilidad y alto impacto — cambio de régimen, no extensión de tendencia.

| Dimensión | Contenido |
|-----------|-----------|
| **Condiciones necesarias** | Regulación nueva; tecnología sustituta; quiebre cadena suministro global; cambio radical comportamiento |
| **Confirmación** | Señales débiles alineándose; eventos en otros mercados |
| **Cancelación** | Status quo regulatorio; adopción lenta |
| **Riesgos** | Descartar por improbable y ser sorprendido |
| **Oportunidades** | First mover si se detecta temprano; pivot estratégico |

**Confianza típica:** baja — siempre etiquetado como vigilancia, no como plan base.

---

## XIV. Horizonte temporal

### XIV.1 Corto plazo (semanas – 3 meses)

| Útil | Menos útil |
|------|------------|
| Stock en tránsito, pedidos colocados | Estructura de industria en 5 años |
| Flete spot, TC actual | Legacy de década sin `does_not_apply_when` evaluado |
| Publicaciones y precios recientes | Patrones abstractos lentos |
| Estacionalidad inmediata | Escenarios disruptivos |

**Predicciones típicas:** desabastecimiento táctico, presión de margen trimestral, movimiento de competidor.

### XIV.2 Mediano plazo (3 – 18 meses)

| Útil | Menos útil |
|------|------------|
| Tendencias de importación, consultas | Ruido semanal |
| Fases de ciclo de vida de producto | Proyección lineal simple |
| Legacy con patrón similar | Anécdota sin estructura |
| Tensiones latentes (Curiosity) | Especulación tecnológica lejana |
| Freight MA 30/90, Economic | |

**Predicciones típicas:** saturación, guerra de precios, luna de miel, oportunidad de categoría.

### XIV.3 Largo plazo (18 meses – 5+ años)

| Útil | Menos útil |
|------|------------|
| Patrones abstractos, cambio de régimen | Datos transaccionales diarios |
| Legacy estratégico, aprendizajes acumulados | Predicción puntual de precio |
| Economic estructural, aranceles | Señales tempranas operativas |
| Abstraction inter-industria | |

**Predicciones típicas:** commoditización de categoría, desintermediación, reposicionamiento necesario.

**Regla:** A mayor horizonte, **mayor incertidumbre** y **bandas más amplias** — obligatorio.

---

## XV. Señales tempranas

El sistema debe detectar **cambios pequeños** antes de que sean evidentes.

| Dominio | Señal temprana | Posible escenario futuro |
|---------|----------------|------------------------|
| **Consultas (Buyer)** | +3–5% mensual sostenido 4m en categoría plana | Oportunidad temprana |
| **Consultas** | Caída de conversión con volumen estable | Postergación / incertidumbre |
| **Importaciones (Supply)** | Aceleración de jugadores sin alza consultas | Saturación futura |
| **Importaciones** | Caída sostenida con consultas estables | Desabastecimiento |
| **Fletes (Freight)** | MA30 acercándose a MA90 sin cruce | Presión de costo próxima |
| **Fletes** | Evento extraordinario en ruta China | Shock de reposición |
| **Regulatorio (Economic)** | Proyecto arancelario, norma importación | Cambio de régimen landed cost |
| **Tecnológico** | Sustituto gana tracción en mercados líderes | Disrupción a mediano plazo |
| **Comportamiento consumidor** | Consultas por atributo nuevo (sustentable, kit, etc.) | Cambio de preferencia |
| **Competencia (Market)** | Un jugador deja de publicar; otro duplica | Reordenamiento participación |
| **Competencia** | Convergencia de precios publicados | Guerra de precios incipiente |
| **Curiosity: cambio lento** | Origen importación deriva país | Shift cadena suministro |
| **Curiosity: tensión latente** | Flete ↑ + saturación ↔ | Dilema costo-inventario futuro |

### XV.1 De señal temprana a predicción

```
Señal temprana detectada
        ↓
¿Mecanismo + precedente (Legacy/Abstraction)?
        ↓ SÍ
Escenario con confianza media — indicadores definidos
        ↓ NO
Vigilancia en Curiosity — no escenario formal aún
```

---

## XVI. Salida del Prediction Engine

Cada predicción debe incluir:

| Campo | Contenido |
|-------|-----------|
| **escenario** | Tipo (optimista, probable, etc.) + narrativa |
| **evidencia utilizada** | Cerebros, datos, períodos — trazable |
| **patrones relacionados** | Abstractos y de dominio |
| **hipótesis** | Supuestos que conectan evidencia con futuro |
| **nivel de confianza** | Banda + factores |
| **incertidumbre** | Tipo y magnitud cualitativa |
| **variables críticas** | Qué movería más el escenario |
| **indicadores confirmación** | Qué observar si el escenario se materializa |
| **indicadores invalidación** | Qué observar si el escenario se descarta |
| **horizonte** | Corto / mediano / largo + ventana |

### XVI.1 Plantilla

```
─── ESCENARIO PREDICTIVO ───

Tipo: [Optimista / Probable / Conservador / Crítico / Disruptivo]
Horizonte: [corto / mediano / largo] — ventana: [...]

Narrativa: [...]

Evidencia: [...]
Patrones: [...]
Hipótesis: [...]

Confianza: [alta / media / baja] — factores: [...]
Incertidumbre: [...]
Variables críticas: [...]

Confirmaría: [...]
Invalidaría: [...]

Escenarios alternativos activos: [...]
```

---

## XVII. Ejemplos

### Ejemplo 1 — Producto entrando en etapa commodity

| Campo | Contenido |
|-------|-----------|
| Escenario probable | Commoditización en 9–14 meses |
| Evidencia | 11 importadores nuevos 12m; precio unitario convergiendo; HS genérico; Market publicaciones por precio |
| Patrones | Commoditización emergente (Abstraction) |
| Legacy | Categoría herramientas 2018 — misma estructura |
| Confianza | Media-alta |
| Confirmaría | Dispersión precio < 8%; más jugadores |
| Invalidaría | Diferenciación por servicio sostenida; salida de jugadores |
| Horizonte | Mediano |

---

### Ejemplo 2 — Posible guerra de precios

| Campo | Contenido |
|-------|-----------|
| Escenario conservador-crítico | Guerra de precios en 6–9 meses |
| Evidencia | Importaciones ↑ 35% 6m; consultas ↔; flete ↓ (stock barato en camino); Market promociones ↑ |
| Patrones | Stock anticipado + saturación (Abstraction) |
| Confianza | Media |
| Confirmaría | Caída precio publicado; liquidaciones |
| Invalidaría | Absorción demanda con consultas ↑ fuerte |
| Horizonte | Mediano |

---

### Ejemplo 3 — Riesgo de desabastecimiento

| Campo | Contenido |
|-------|-----------|
| Escenario probable-conservador | Desabastecimiento local en 8–12 semanas en SKU rotación alta |
| Evidencia | Importaciones categoría −22% 3m; consultas estables; concentración 2 proveedores |
| Freight | MA30 > MA90 — costo no incentiva stock competencia |
| Confianza | Media |
| Confirmaría | Lead time proveedor alarga; competidores sin stock |
| Invalidaría | Pico importaciones; sustitución SKU |
| Horizonte | Corto |

---

### Ejemplo 4 — Nueva oportunidad de mercado

| Campo | Contenido |
|-------|-----------|
| Escenario optimista | Ventana oportunidad 4–8 meses antes de saturación |
| Evidencia | Consultas +28% 4m; importaciones +8% solo; 3 importadores; luna de miel (Product) |
| Curiosity | Cambio lento en consultas por "kit" |
| Confianza | Media |
| Confirmaría | Conversión mejora; entrada lenta competencia |
| Invalidaría | Importaciones explosivas; guerra precio temprana |
| Horizonte | Mediano-corto |

---

### Ejemplo 5 — Cambio de comportamiento del consumidor

| Campo | Contenido |
|-------|-----------|
| Escenario probable | Shift a compra por proyecto integrado vs m² suelto |
| Evidencia | Consultas "kit", "todo incluido", "baño listo" ↑ sostenido; Market competencia aún por m² |
| Abstraction | Reducción fricción decisión compleja |
| Confianza | Media |
| Confirmaría | ↑ ticket medio; ↑ conversión en bundles |
| Invalidaría | Consultas vuelven a SKU suelto; precio domina |
| Horizonte | Mediano |

---

### Ejemplo 6 — Caída futura del margen

| Campo | Contenido |
|-------|-----------|
| Escenario probable | Margen bruto −4 a −8 pts en 12 meses |
| Evidencia | TC presión + flete MA alcista; commoditización incipiente; Economic inflación |
| Learning | Falso éxito previo atribuido solo a volumen |
| Variables críticas | TC, flete, precio mercado |
| Confianza | Media |
| Confirmaría | Precio no traslada costo; competencia no sube |
| Invalidaría | Diferenciación exitosa; TC revierte |
| Horizonte | Mediano-largo |

---

## XVIII. Qué nunca debe hacer

| Prohibición | Razón |
|-------------|-------|
| **Nunca presentar predicción como certeza** | Humildad epistémica |
| **Nunca ocultar incertidumbre** | Decisiones informadas |
| **Nunca extrapolar sin evidencia** | Sobreajuste |
| **Nunca ignorar escenarios alternativos** | Sorpresa evitable |
| **Nunca dejar de revisar predicciones anteriores** | Calibración |
| Nunca dar fecha exacta en estratégico | Falsa precisión |
| Nunca un solo escenario | Pluralidad obligatoria |
| Nunca predecir sin indicadores de invalidación | No falsable |
| Nunca decidir por el empresario | Rol del Business Brain |
| Nunca ignorar Legacy en escenario adverso | Experiencia vivida |

---

## XIX. Aprendizaje

Toda predicción vuelve al **Learning Engine** para cerrar el ciclo:

```
PREDICCIÓN (escenarios + confianza + indicadores)
        ↓
RESULTADO REAL (al cumplir horizonte)
        ↓
COMPARACIÓN (acierto, sorpresa, timing, magnitud)
        ↓
APRENDIZAJE (tipo: calibración, falso positivo, patrón refinado)
        ↓
ACTUALIZACIÓN DEL CONOCIMIENTO
  - confianza futura en dominio similar
  - peso de señales tempranas
  - Biblioteca de aprendizajes
  - posible enriquecimiento Legacy
```

### XIX.1 Métricas de aprendizaje predictivo

| Métrica | Objetivo |
|---------|----------|
| Calibración | Confianza 0.7 ≈ acierto ~70% en escenario probable |
| Brier conceptual | Menor sorpresa de escenarios no listados |
| Utilidad decisoria | ¿La predicción cambió una decisión que mejoró outcome? |
| Señales tempranas | % que materializaron escenario en horizonte |

---

## XX. Relación con el Business Brain

```
Cerebros + Curiosity + Abstraction + Legacy + Learning + Knowledge
        ↓
PREDICTION ENGINE → escenarios con bandas y confianza
        ↓
BUSINESS BRAIN → integra en síntesis, hipótesis, conflictos
        ↓
EMPRESARIO → decide
        ↓
LEARNING ENGINE → calibra predicciones futuras
```

El Prediction Engine **no habla directamente** con el empresario. Entrega **escenarios calificados** al Business Brain para la síntesis razonada.

---

## XXI. Cierre

El Prediction Engine no adivina. **Ilumina futuros plausibles** con evidencia, patrones, humildad y ganas de aprender cuando el futuro no coincide con el mapa.

> *"El objetivo no es acertar siempre. Es reducir progresivamente la incertidumbre y mejorar la calidad de las decisiones conforme aumenta el conocimiento del sistema."*

El empresario decide en un mundo incierto.  
El Prediction Engine le entrega **mapas**, no **oráculos**.

---

*Business Brain – Prediction Engine v1.0*  
*Mercadeo IA — Sin implementación.*
