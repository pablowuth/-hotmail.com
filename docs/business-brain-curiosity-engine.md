# Business Brain – Curiosity Engine

**Componente:** Curiosity Engine — curiosidad estratégica permanente del Business Brain  
**Producto:** Mercadeo IA  
**Tipo:** Diseño conceptual. Sin implementación.  
**Versión:** 1.0

**Documentos relacionados:**
- `docs/business-brain-modelo-de-razonamiento.md` — Cómo piensa el Business Brain
- `docs/business-brain-diseno.md` — Arquitectura operativa del Business Brain
- `docs/FOUNDATIONAL_PRINCIPLES.md` — Constitución del proyecto

---

## Resumen

El **Curiosity Engine** es la capacidad permanente del Business Brain de **generar preguntas estratégicas por iniciativa propia** — no esperar a que el empresario pregunte.

Un gran sistema no solo responde preguntas. **Detecta las preguntas que nadie hizo.**

El Curiosity Engine trabaja en segundo plano, observando el Knowledge Graph, las señales de los cerebros, los vacíos de evidencia y las anomalías del mercado. Cuando encuentra algo que merece investigación, **propone una pregunta estratégica** al empresario — justificada, con propósito y con evidencia de por qué vale la pena preguntarse eso ahora.

Nunca inventa problemas. Nunca alarmismo sin sustento. Nunca ocupa al empresario con ruido.

---

## I. Principios

| Principio | Enunciado |
|-----------|-----------|
| **Curiosidad permanente** | Opera continuamente en segundo plano — no solo cuando el empresario abre el sistema |
| **Preguntas, no respuestas** | Su salida es una investigación propuesta, no una conclusión |
| **Nunca inventar problemas** | Toda pregunta nace de evidencia observable o anomalía detectable |
| **Propósito estratégico obligatorio** | Si la pregunta no puede mejorar una decisión futura, no se formula |
| **Justificación trazable** | Toda pregunta cita qué la disparó: dato, patrón, vacío o tensión |
| **Humildad epistémica** | Formula incertidumbre — no afirma que hay un problema, sino que **podría** haber uno que vale investigar |
| **Respeto al empresario** | No exige investigar; **invita** con razón clara |
| **No decidir** | Nunca convierte una pregunta curiosa en recomendación de acción |

---

## II. Qué es y qué no es

### II.1 Qué es

El Curiosity Engine es el **radar de preguntas** del Business Brain: la función que transforma observación pasiva en **investigación activa propuesta**.

Trabaja como un estratega que, mientras revisa el negocio, deja de lado lo obvio y anota en el margen:

> *"Esto no cuadra."*  
> *"Esto lleva meses moviéndose lento — ¿alguien lo está viendo?"*  
> *"Tenemos la mitad del cuadro. ¿Qué falta?"*

### II.2 Qué NO es

| Anti-patrón | Por qué no |
|-------------|------------|
| Generador de alertas | Las alertas informan; las preguntas curiosas **abren investigación** |
| Chatbot proactivo | No conversa por conversar |
| Motor de notificaciones | No compite por atención sin propósito |
| Creador de problemas ficticios | Viola el principio de no inventar |
| Sustituto del razonamiento | Las preguntas alimentan el modelo de razonamiento; no lo reemplazan |
| CRM de seguimiento | No pregunta "¿contactó al cliente?" |

---

## III. Operación en segundo plano

### III.1 Ciclo permanente

```
OBSERVAR (grafo + cerebros + Legacy + series)
        ↓
DETECTAR (¿hay algo de los 5 dominios de curiosidad?)
        ↓
EVALUAR (¿merece una pregunta estratégica?)
        ↓
FORMULAR (pregunta con propósito y justificación)
        ↓
PRIORIZAR (¿qué tan urgente o valiosa es esta pregunta?)
        ↓
ENTREGAR (al empresario, cuando corresponde)
        ↓
REGISTRAR (para Learning Engine — ¿la pregunta fue útil?)
```

### III.2 Cuándo entrega al empresario

No toda detección se convierte en pregunta inmediata. El Curiosity Engine **prioriza**:

| Factor | Efecto en prioridad |
|--------|---------------------|
| Materialidad para decisiones de compra, stock, precio o producto | Sube |
| Convergencia de múltiples señales débiles | Sube |
| Anomalía con mecanismo plausible | Sube |
| Vacío que bloquea razonamiento futuro | Sube |
| Señal aislada sin persistencia | Baja |
| Pregunta ya formulada recientemente sin nueva evidencia | Se suprime |
| Confianza de la detección baja | Se acumula hasta confirmación |

### III.3 Relación con el Business Brain

| Modo | Rol del Curiosity Engine |
|------|--------------------------|
| **Segundo plano** | Genera preguntas por iniciativa propia |
| **Primer plano** | Cuando el empresario trae un problema, el Curiosity Engine **ya tiene** preguntas relevantes preparadas |
| **Razonamiento activo** | Las preguntas curiosas alimentan la fase de "información faltante" del modelo de razonamiento |

El Curiosity Engine **no dialoga directamente** con el empresario. El Business Brain **presenta** las preguntas curiosas con su voz única — integradas en síntesis o como investigaciones propuestas independientes.

---

## IV. Los cinco dominios de búsqueda

El Curiosity Engine trabaja en segundo plano buscando en cinco dominios. Cada dominio tiene criterios de detección, tipo de pregunta que genera y límites.

---

### 1. Cambios lentos

**Qué busca:** Tendencias pequeñas, graduales, que pasan desapercibidas porque no cruzan umbrales de alerta — pero que, acumuladas, cambian el panorama estratégico.

**Por qué importa:** Los empresarios reaccionan a lo abrupto. Los cambios lentos son los que más sorprenden cuando ya es tarde.

| Señal de cambio lento | Ejemplo |
|-----------------------|---------|
| Deriva gradual de precio declarado | −2% mensual durante 8 meses — nadie alertó |
| Participación de importador que gana 0.5% por mes | De 5% a 12% en 14 meses |
| Flete en deriva alcista dentro de banda "normal" | MA30 acercándose a MA90 sin cruce aún |
| Consultas creciendo por debajo del umbral de pico | +3% mensual sostenido — oportunidad temprana |
| Concentración de origen que se desplaza país a país | China 80% → 72% → 65% en 18 meses |

**Pregunta tipo generada:**

> *"El origen de la categoría X se está desplazando gradualmente de China hacia Vietnam desde hace 14 meses. ¿Conviene investigar si esto altera su costo de reposición o la calidad percibida antes de que el cambio sea irreversible?"*

**Propósito estratégico:** Anticipar decisiones de sourcing, precio o posicionamiento antes de que el cambio lento se vuelva estructural.

**Límite:** No preguntar por deriva que está dentro del ruido histórico sin persistencia mínima de 3+ períodos.

---

### 2. Anomalías

**Qué busca:** Todo comportamiento inesperado que se desvía del patrón establecido — sin asumir si es bueno o malo hasta investigar.

**Por qué importa:** Las anomalías son donde vive la información nueva: oportunidad, amenaza o error de dato.

| Tipo de anomalía | Ejemplo |
|------------------|---------|
| Pico aislado de importaciones | +400% un mes, vuelta a normal al siguiente |
| Importador que deja de importar sin señal previa | Activo 3 años, cero operaciones en 60 días |
| Precio de mercado desconectado de valor declarado | Divergencia > 25% sin explicación macro |
| Consultas que suben sin categoría relacionada en publicaciones | Demanda sin oferta visible aún |
| Flete que rompe banda histórica de 24 meses | Evento extraordinario o cambio de régimen |

**Pregunta tipo generada:**

> *"Un importador que representaba el 15% del volumen de categoría Y dejó de importar hace 45 días sin señal previa de salida. ¿Conviene investigar si liquidó stock, cambió de categoría o encontró un problema de proveedor — y qué implicaría eso para su posición?"*

**Propósito estratégico:** Convertir sorpresa en investigación antes de que el mercado reaccione.

**Límite:** Anomalía aislada sin persistencia ni mecanismo plausible → se anota, no se pregunta aún. Esperar confirmación o buscar causa en grafo.

---

### 3. Patrones incompletos

**Qué busca:** Relaciones parciales entre entidades — el grafo muestra conexión, pero falta un eslabón para que el patrón sea accionable o comprensible.

**Por qué importa:** Un patrón a medias genera decisiones a medias. Completar el patrón es investigar.

| Patrón incompleto | Qué falta |
|-------------------|-----------|
| Proveedor abastece a 4 importadores — falta volumen relativo | ¿Es proveedor dominante o marginal? |
| Producto en crecimiento de consultas — sin importaciones visibles | ¿Oferta local, stock previo o categoría mal mapeada? |
| Competidor baja precio — sin señal de costo (flete, TC) | ¿Guerra de precios o liquidación? |
| Experiencia Legacy aplica — sin datos actuales que confirmen o refuten | ¿Sigue vigente el patrón? |
| Dos cerebros señalan lo mismo — sin tercera confirmación | ¿Convergencia real o sesgo de fuente? |

**Pregunta tipo generada:**

> *"El proveedor Z aparece abasteciendo a tres de sus competidores directos, pero el sistema no tiene volumen estimado ni frecuencia de envío. ¿Conviene investigar si comparten cadena de suministro al punto de que un cambio en Z afecte a todos por igual?"*

**Propósito estratégico:** Completar el cuadro relacional antes de que una decisión se tome con mapa parcial.

**Límite:** No forzar completitud donde los datos estructuralmente no existen — en ese caso, declarar vacío (dominio 4) en lugar de inventar.

---

### 4. Vacíos de conocimiento

**Qué busca:** Información importante que el sistema **aún no posee** y que, si la tuviera, mejoraría decisiones futuras en un dominio concreto.

**Por qué importa:** Lo que no se sabe y no se nombra se trata como si no importara. El Curiosity Engine hace visible la ignorancia estratégica.

| Tipo de vacío | Ejemplo |
|---------------|---------|
| Categoría activa sin histórico de flete suficiente | < 24 meses de datos |
| Competidor mapeado sin operaciones de importación | ¿Importa o compra local? |
| Producto propio sin cruce con ciclo de vida de mercado | ¿En qué fase está realmente? |
| Sin experiencia Legacy en dominio de decisión frecuente | ¿Qué aprendió la empresa antes? |
| País origen dominante sin datos transaccionales | Solo proxy disponible |
| DecisionRecord sin outcome registrado | ¿Qué pasó con decisiones pasadas similares? |

**Pregunta tipo generada:**

> *"Usted toma decisiones frecuentes sobre categoría electrodomésticos, pero el sistema no tiene ninguna experiencia Legacy registrada en ese dominio. ¿Conviene capturar al menos una experiencia estructurada — éxito o fracaso — para que futuras decisiones no partan de cero?"*

**Propósito estratégico:** Cerrar gaps que degradan la calidad de todo el razonamiento futuro.

**Límite:** No pedir información por completitud cosmética — solo vacíos que afectan decisiones identificables.

---

### 5. Tensiones latentes

**Qué busca:** Señales que **aún no chocan formalmente** pero que, si continúan su trayectoria, convergerán en un conflicto que el Business Brain tendrá que presentar al empresario. Detectar la tensión **antes** del choque.

**Por qué importa:** El conflicto resuelto tarde es costoso. La tensión detectada temprano es oportunidad de decidir con calma.

| Tensión latente | Trayectoria |
|-----------------|-------------|
| Flete en deriva alcista + importaciones competencia acelerando | Conflicto futuro: comprar caro vs llegar tarde |
| Consultas subiendo + margen comprimido por TC | Conflicto: subir precio vs perder participación |
| Legacy advierte sobrestock + Supply sugiere oportunidad de compra | Conflicto experiencia vs datos — aún no activado |
| Saturación lenta + nuevo importador entrando cada mes | Conflicto con guerra de precios en horizonte 6-9 meses |
| Stock propio alto (si conocido) + señal de desabastecimiento de mercado | Conflicto: liquidar vs asegurar posición |

**Pregunta tipo generada:**

> *"El flete en ruta China → destino lleva 4 meses en deriva alcista gradual sin cruzar alerta, y las importaciones de competidores en su categoría principal aceleraron un 18% en el último trimestre. ¿Conviene investigar ahora si conviene adelantar exposición — antes de que estas dos señales converjan en un dilema de costo vs inventario?"*

**Propósito estratégico:** Dar al empresario ventana de decisión antes de que la tensión se vuelva urgente.

**Límite:** Tensión debe basarse en trayectorias observables — no en predicción especulativa sin señal.

---

## V. Cómo se genera una pregunta estratégica

### V.1 De detección a pregunta — filtros obligatorios

Toda candidata a pregunta debe pasar **cinco filtros**:

```
1. ¿Hay evidencia o anomalía trazable?          → NO: descartar
2. ¿Tiene propósito estratégico claro?          → NO: descartar
3. ¿Mejora una decisión futura identificable?   → NO: descartar
4. ¿Se puede formular sin inventar el problema? → NO: descartar
5. ¿El empresario puede hacer algo con la pregunta? → NO: descartar
```

### V.2 Estructura obligatoria de toda pregunta curiosa

| Campo | Contenido |
|-------|-----------|
| **Pregunta** | Formulada en lenguaje claro, orientada a investigación |
| **Dominio** | Cambio lento / Anomalía / Patrón incompleto / Vacío / Tensión latente |
| **Qué disparó la pregunta** | Evidencia específica, fuente, período |
| **Propósito estratégico** | Qué decisión futura podría mejorar si se investiga |
| **Urgencia cualitativa** | Observar / Investigar pronto / Investigar antes de próxima decisión |
| **Qué cerraría la pregunta** | Qué evidencia o acción resolvería la incertidumbre |
| **Confianza de la detección** | Alta / media / baja |

### V.3 Plantilla

```
─── PREGUNTA ESTRATÉGICA ───

[Pregunta en una oración]

Por qué ahora:
  [Evidencia que la dispara — dominio N]

Propósito:
  [Qué decisión futura podría mejorar]

Si investiga, buscaría:
  [Qué información cerraría el gap]

Urgencia: [observar / pronto / antes de decidir]
Confianza de detección: [alta / media / baja]
```

---

## VI. Ejemplos integrados

### Ejemplo A — Cambio lento

**Detección:** Participación de origen Vietnam en categoría herramientas pasó de 8% a 19% en 16 meses sin alerta.

**Pregunta:**
> *"¿Conviene investigar si el desplazamiento gradual de origen hacia Vietnam en herramientas responde a aranceles, flete o calidad — y si su proveedor actual en China sigue siendo competitivo a 12 meses?"*

---

### Ejemplo B — Anomalía

**Detección:** Valor unitario declarado de categoría Z cayó 35% en un mes; precios de mercado estables.

**Pregunta:**
> *"¿Conviene investigar si la caída abrupta del valor declarado en categoría Z es cambio de producto, error de clasificación aduanera o presión de competencia en origen — antes de recalcular su margen?"*

---

### Ejemplo C — Patrón incompleto

**Detección:** Grafo muestra mismo proveedor para empresario y dos competidores; sin frecuencia ni volumen.

**Pregunta:**
> *"¿Conviene investigar el volumen real que mueve su proveedor compartido con competidores X e Y — para evaluar si un cambio en ese proveedor es riesgo sistémico o marginal?"*

---

### Ejemplo D — Vacío de conocimiento

**Detección:** 12 DecisionRecords de compra en categoría X; cero outcomes registrados.

**Pregunta:**
> *"¿Conviene registrar qué ocurrió con las últimas decisiones de compra en categoría X — para que el sistema pueda calibrar si sus recomendaciones pasadas fueron acertadas?"*

---

### Ejemplo E — Tensión latente

**Detección:** MA30 de flete > MA90 por 8 semanas (sin alerta fuerte aún) + fase de saturación en Product Intelligence.

**Pregunta:**
> *"¿Conviene investigar ahora su exposición a inventario en categoría X — antes de que el flete alcista y la saturación del mercado converjan en presión simultánea de costo y precio?"*

---

## VII. Priorización de preguntas

Cuando el Curiosity Engine genera múltiples preguntas, las ordena por:

| Criterio | Peso |
|----------|------|
| Materialidad para decisión recurrente del empresario | Alto |
| Convergencia de dominios (ej. tensión latente + anomalía) | Alto |
| Urgencia de ventana (antes de que cierre) | Alto |
| Vacío que bloquea razonamiento en dominio activo | Medio-alto |
| Novedad (no preguntada antes) | Medio |
| Confianza de detección | Modulador |

**Regla:** Máximo de preguntas activas visibles al empresario en un período — evitar fatiga de curiosidad. Las demás se encolan o se suprimen hasta nueva evidencia.

---

## VIII. Qué hace después de la pregunta

| Respuesta del empresario | Acción del sistema |
|--------------------------|-------------------|
| Investiga y aporta información | Alimenta Knowledge Graph / Legacy; cierra pregunta |
| Decide ignorar | Registrar; Learning Engine evalúa si la pregunta fue útil |
| Pide síntesis completa | Business Brain activa modelo de razonamiento con la pregunta como marco |
| "No aplica" | Registrar `does_not_apply_when` si corresponde; no repetir |

El Curiosity Engine **aprende** qué tipos de preguntas el empresario encuentra valiosas — vía Learning Engine, sin nuevas entidades: usa los mecanismos existentes de feedback y calibración.

---

## IX. Límites y prohibiciones

| Prohibición | Razón |
|-------------|-------|
| Inventar problemas sin evidencia | Viola principio rector |
| Formular preguntas sin propósito estratégico | Ruido, no curiosidad |
| Convertir pregunta en recomendación de acción | Solo el razonamiento activo del Business Brain puede llegar a hipótesis |
| Saturar al empresario con preguntas | Fatiga → ignorancia del sistema |
| Repetir la misma pregunta sin nueva evidencia | Acoso, no curiosidad |
| Preguntar por completitud de datos irrelevantes | Violación del filtro de propósito |
| Simular urgencia sin trayectoria observable | Falsa alarma |

---

## X. Relación con el modelo de razonamiento

| Fase del razonamiento | Aporte del Curiosity Engine |
|-----------------------|----------------------------|
| Identificar verdadero problema | Preguntas curiosas previas pueden redefinir el marco |
| Información faltante | Vacíos detectados en segundo plano |
| Tensiones latentes | Anticipa conflictos antes de la fase de integración |
| Cuándo NO recomendar | Vacíos críticos detectados impiden síntesis prematura |
| Preguntas al empresario | Curiosity Engine alimenta la lista con preguntas ya justificadas |

El Curiosity Engine **no reemplaza** el modelo de razonamiento. Lo **alimenta** con preguntas que el empresario no había formulado.

---

## XI. Cierre

La curiosidad estratégica es lo que separa un sistema reactivo de uno que **acompaña al empresario durante décadas**.

El empresario experto siempre tiene una lista mental de *"esto me huele raro, debería mirarlo"*. El Curiosity Engine es esa lista — **sistematizada, justificada, permanente y honesta**.

No inventa problemas.  
No decide por el empresario.  
Solo pregunta lo que vale la pena investigar — y explica por qué.

> *"Noté algo que quizás nadie está viendo. ¿Le importa que lo investiguemos juntos?"*

---

*Business Brain – Curiosity Engine v1.0*  
*Mercadeo IA — Sin implementación.*
