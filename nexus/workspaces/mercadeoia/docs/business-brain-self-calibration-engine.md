# Business Brain – Self-Calibration Engine

**Componente:** Self-Calibration Engine — auditoría continua del razonamiento del Business Brain  
**Producto:** Mercadeo IA  
**Tipo:** Diseño conceptual. Sin implementación.  
**Versión:** 1.0

**Documentos relacionados:**
- `docs/business-brain-learning-engine.md` — Learning Engine (aprendizaje post-decisión)
- `docs/business-brain-modelo-de-razonamiento.md` — Modelo de razonamiento
- `docs/business-brain-prediction-engine.md` — Prediction Engine
- `docs/business-brain-diseno.md` — Diseño operativo del Business Brain
- `docs/FOUNDATIONAL_PRINCIPLES.md` — Constitución del proyecto

---

## Resumen

El **Self-Calibration Engine** define **cómo el Business Brain evalúa continuamente la calidad de su propio razonamiento** para mejorar con el tiempo.

**Este documento no describe cómo aprende.**  
Eso pertenece al **Learning Engine**.

Este documento describe **cómo el sistema evalúa críticamente la calidad de su propio pensamiento**.

El Self-Calibration Engine actúa como **auditor permanente** del Business Brain.

Su misión es detectar cuándo el sistema:

- razona mejor
- razona peor
- genera hipótesis débiles
- genera exceso de confianza
- deja de cuestionar sus conclusiones
- comienza a repetir sesgos
- pierde capacidad predictiva
- necesita recalibrarse

**Principio rector:**

> *"Un sistema inteligente no es el que nunca se equivoca. Es el que reconoce sus errores, los explica y mejora continuamente sin perder el conocimiento acumulado."*

El Self-Calibration Engine **no decide**, **no modifica evidencia** y **no borra historia**. **Audita, calibra y transparenta**.

---

## I. Filosofía de la autocalibración

### I.1 Razonamiento como proceso auditable

Mercadeo IA no solo produce conclusiones — produce **razonamientos**. Cada síntesis, hipótesis y predicción es un artefacto que puede evaluarse en calidad, no solo en resultado.

| Enfoque ingenuo | Enfoque del Self-Calibration Engine |
|-----------------|-------------------------------------|
| "Acertó → el razonamiento fue bueno" | Evaluar si el acierto fue por mecanismo o por suerte |
| "Erró → borrar y empezar de cero" | Registrar el error, calibrar confianza, conservar historia |
| "Más datos → mejor sistema" | Mejor calibración → mejor sistema |
| Confianza fija | Confianza dinámica según desempeño reciente |
| Mejora automática | Mejora **auditada** y **explicada** |

### I.2 El espejo crítico del Business Brain

El Business Brain razona en voz alta. El Self-Calibration Engine es la **voz interna que pregunta si ese razonamiento merece la confianza que declara**.

```
BUSINESS BRAIN          SELF-CALIBRATION ENGINE
──────────────          ───────────────────────
Razona                  ¿Fue sólido el razonamiento?
Hipoteiza               ¿La hipótesis tenía evidencia suficiente?
Predice                 ¿La confianza estaba calibrada?
Explica                 ¿La explicación fue honesta sobre límites?
Sintetiza               ¿Se cuestionaron alternativas?
```

No compite con el Business Brain. Lo **supervisa con humildad y rigor**.

### I.3 Autocalibración como disciplina epistémica

| Principio | Enunciado |
|-----------|-----------|
| **Honestidad sobre desempeño** | El sistema debe saber cuándo razona peor, no solo cuándo acierta |
| **Confianza ganada** | La confianza sube solo con evidencia de calidad sostenida |
| **Errores visibles** | Un error oculto es peor que un error reconocido |
| **Historia intacta** | La autocalibración ajusta pesos, no reescribe el pasado |
| **Mejora no garantizada** | El sistema puede degradarse; debe detectarlo |
| **No decidir** | Calibrar razonamiento; el empresario decide |

### I.4 Autocalibración al servicio de la decisión

Un razonamiento mal calibrado — demasiado confiado o demasiado tímido — **daña la decisión** tanto como un razonamiento erróneo. El Self-Calibration Engine existe para que el empresario reciba no solo buenas ideas, sino ideas con **nivel de confianza honesto**.

### I.5 Qué calibra y qué no

| Calibra | No calibra |
|---------|------------|
| Nivel de confianza declarado | Evidencia histórica (inmutable) |
| Peso de heurísticas y patrones | Hechos registrados |
| Vigencia de reglas y Legacy | Decisiones del empresario |
| Calidad del proceso de razonamiento | Opiniones del empresario |
| Alertas de degradación | Datos crudos de cerebros |
| Recomendaciones de revisión | Pipeline ni arquitectura |

---

## II. Diferencia entre aprender y calibrarse

Aprender y calibrarse son complementarios pero **no intercambiables**.

| Dimensión | Learning Engine | Self-Calibration Engine |
|-----------|-----------------|-------------------------|
| **Momento** | Después de decisión y resultado | Continuo — durante y después del razonamiento |
| **Pregunta central** | ¿Qué cambió en nuestro conocimiento tras comparar hipótesis con outcome? | ¿Qué tan bueno fue el razonamiento que produjo esa hipótesis? |
| **Input principal** | Hipótesis + decisión + resultado + contexto | Calidad de hipótesis, predicciones, explicaciones, evidencia usada |
| **Output principal** | Aprendizaje reutilizable en Biblioteca | Ajuste de confianza, alertas, solicitudes de revisión |
| **Horizonte** | Cierre del ciclo decisorio | Vigilancia permanente del proceso cognitivo |
| **Analogía** | El maestro que extrae la lección del examen | El auditor que evalúa si el método de estudio funciona |

### II.1 Flujo conjunto

```
RAZONAMIENTO (Business Brain)
        ↓
AUDITORÍA (Self-Calibration) ←── evalúa calidad del pensamiento
        ↓
DECISIÓN (Empresario)
        ↓
RESULTADO
        ↓
APRENDIZAJE (Learning Engine) ←── extrae lección del outcome
        ↓
RECALIBRACIÓN (Self-Calibration) ←── ajusta confianza futura
        ↓
CONOCIMIENTO ACTUALIZADO (sin borrar historia)
```

### II.2 Casos donde divergen

| Situación | Learning Engine | Self-Calibration Engine |
|-----------|-----------------|-------------------------|
| Acierto por suerte | Registra falso éxito; no fortalece regla | Detecta exceso de confianza futura |
| Error con buen razonamiento | Registra decisión válida con outcome adverso | Mantiene confianza en método; ajusta solo dominio |
| Razonamiento débil que acertó | Tentativo — espera replicación | Baja confianza en proceso, no solo en regla |
| Degradación sin errores recientes | Puede no activarse aún | Detecta por tendencia de calibración |

**Regla:** El Learning Engine responde *"¿qué aprendimos del resultado?"*  
El Self-Calibration Engine responde *"¿estamos pensando bien?"*

---

## III. Cómo mide la calidad del razonamiento

La calidad del razonamiento no se reduce a acertar o errar. Se evalúa en **dimensiones estructurales**.

### III.1 Dimensiones de calidad

| Dimensión | Qué evalúa | Señal de calidad alta | Señal de calidad baja |
|-----------|------------|----------------------|----------------------|
| **Solidez de hipótesis** | ¿Alternativas consideradas? ¿Evidencia cruzada? | Múltiples hipótesis, refutación propia | Una sola explicación sin descartes |
| **Calidad de evidencia** | ¿Fuentes diversas? ¿Recientes? ¿Relevantes? | Evidencia convergente de ≥2 cerebros | Una fuente domina sin contraste |
| **Coherencia interna** | ¿Las partes del razonamiento se contradicen? | Narrativa consistente | Contradicciones no resueltas |
| **Honestidad epistémica** | ¿Se declararon límites e incertidumbre? | Límites explícitos, bandas de confianza | Certeza sin reservas |
| **Relevancia decisoria** | ¿El razonamiento informa una decisión real? | Conectado a trade-offs del empresario | Análisis ornamental |
| **Falsabilidad** | ¿Hay indicadores de invalidación? | Condiciones de refutación claras | Conclusión no falsable |
| **Uso de Legacy** | ¿Se consultó experiencia acumulada? | Legacy integrado con contexto actual | Ignorado o aplicado ciegamente |
| **Profundidad causal** | ¿Mecanismo explicado o solo correlación? | Cadena causa → efecto | "Subió porque subió" |

### III.2 Score conceptual de razonamiento

El Self-Calibration Engine no produce un número opaco para el empresario. Produce una **evaluación cualitativa estructurada**:

```
CALIDAD DEL RAZONAMIENTO (evaluación interna)
├── Solidez de hipótesis:     alta | media | baja
├── Calidad de evidencia:     alta | media | baja
├── Coherencia interna:       alta | media | baja | alerta
├── Honestidad epistémica:    alta | media | baja | alerta
├── Calibración histórica:    mejorando | estable | degradando
└── Recomendación:            mantener | revisar | recalibrar
```

### III.3 Evaluación retrospectiva vs. en tiempo real

| Modo | Cuándo | Para qué |
|------|--------|----------|
| **En tiempo real** | Durante síntesis del Business Brain | Detectar debilidad antes de entregar al empresario |
| **Retrospectivo** | Tras outcome o revisión periódica | Calibrar confianza futura en dominios similares |
| **Periódico** | Auditoría programada (semanal, mensual, trimestral) | Detectar degradación lenta, sesgos acumulados |

---

## IV. Cómo detecta exceso de confianza

El exceso de confianza es el fallo más peligroso de un sistema inteligente: **hablar con certeza cuando la evidencia no la sostiene**.

### IV.1 Señales de exceso de confianza

| Señal | Descripción | Ejemplo |
|-------|-------------|---------|
| **Confianza > precisión histórica** | Declara 0.85 pero acierta ~60% en dominio similar | Predicciones de demanda con confianza alta y sorpresas frecuentes |
| **Reducción de alternativas** | Presenta una sola hipótesis sin descartes documentados | "El mercado se saturará" sin escenario contrario |
| **Ignorar incertidumbre** | No declara límites ni variables críticas | Síntesis sin bandas ni indicadores de invalidación |
| **Aciertos recientes inflados** | Serie de aciertos eleva confianza sin revisar mecanismo | Tres aciertos por timing fortuito → confianza sube |
| **Consenso sin contraste** | Múltiples fuentes dicen lo mismo pero son la misma señal | Tres cerebros leyendo el mismo dato |
| **Legacy sin contexto** | "Siempre fue así" aplicado sin verificar vigencia | Regla de 2018 aplicada en mercado transformado |

### IV.2 Mecanismo de detección

```
CONFIANZA DECLARADA
        ↓
COMPARAR con precisión histórica en dominio + horizonte similares
        ↓
¿Confianza >> precisión?  →  ALERTA: exceso de confianza
        ↓
¿Acierto reciente sin mecanismo validado?  →  ALERTA: falso refuerzo
        ↓
¿Alternativas < mínimo requerido?  →  ALERTA: convergencia prematura
        ↓
ACCIÓN: disminuir confianza recomendada + solicitar evidencia adicional
```

### IV.3 Calibración de confianza

| Estado | Relación confianza ↔ realidad | Acción |
|--------|------------------------------|--------|
| **Bien calibrado** | Confianza 0.7 ≈ acierto ~70% | Mantener |
| **Sobreconfiado** | Confianza 0.8, acierto ~55% | Reducir banda de confianza futura |
| **Subconfiado** | Confianza 0.5, acierto ~75% | Puede aumentar con evidencia de mecanismo |
| **Impredecible** | Alta varianza sin patrón | Declarar alta incertidumbre; no ajustar a la baja ciegamente |

---

## V. Cómo detecta conclusiones débiles

Una conclusión débil no es necesariamente falsa — es **insuficientemente sustentada** para el nivel de confianza que declara.

### V.1 Criterios de debilidad

| Criterio | Indicador de debilidad |
|----------|------------------------|
| **Evidencia única** | Una sola fuente sin corroboración |
| **Correlación sin mecanismo** | "A y B suben juntos" sin explicar por qué |
| **Muestra insuficiente** | Un caso tratado como patrón |
| **Contexto ignorado** | Conclusión válida en otro entorno, no en este |
| **Sin refutación propia** | El Business Brain no intentó destruir su hipótesis |
| **Dependencia de proyección** | Solo extrapolación matemática, sin patrón estructural |
| **Legacy mal aplicado** | Experiencia transferida sin verificar `applies_when` |
| **Explicación circular** | La conclusión se usa como evidencia de sí misma |

### V.2 Clasificación de debilidad

| Nivel | Descripción | Tratamiento |
|-------|-------------|-------------|
| **Aceptable con reservas** | Evidencia parcial pero honesta sobre límites | Entregar con confianza media-baja |
| **Débil** | Evidencia insuficiente para la afirmación | Marcar, reducir confianza, sugerir más evidencia |
| **Muy débil** | Casi especulación disfrazada de análisis | No elevar a síntesis principal; escenario disruptivo si aplica |
| **Inválida** | Contradice evidencia sólida sin resolver conflicto | Bloquear hasta resolución o declarar conflicto explícito |

### V.3 Ejemplo

**Conclusión:** "La categoría entrará en commodity en 6 meses."  
**Evaluación Self-Calibration:**

| Criterio | Estado |
|----------|--------|
| Evidencia cruzada | Solo Market Intelligence — falta Supply |
| Mecanismo | Parcial — menciona jugadores pero no márgenes |
| Refutación propia | No documentada |
| Legacy | No consultado |
| Horizonte | 6 meses con confianza 0.75 — exceso para evidencia |
| **Veredicto** | Conclusión **débil** — reducir confianza a 0.45; solicitar Supply + Legacy |

---

## VI. Cómo identifica contradicciones internas

El Business Brain integra múltiples cerebros y fuentes. Las contradicciones son **información valiosa**, no errores a ocultar.

### VI.1 Tipos de contradicción

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Entre cerebros** | Market dice expansión; Economic dice contracción | Señales opuestas en mismo horizonte |
| **Entre evidencia y Legacy** | Datos actuales vs. experiencia histórica | Importaciones bajan pero Legacy dice que categoría siempre crece en Q4 |
| **Entre hipótesis** | Hipótesis A y B mutuamente excluyentes sin pesos | "Saturación" y "crecimiento acelerado" con misma confianza |
| **Entre partes del razonamiento** | Conclusión no sigue de premisas | "Demanda baja" + "aumentar inventario recomendado" |
| **Entre confianza y evidencia** | Alta confianza con evidencia escasa | Confianza 0.8 con una señal temprana |
| **Temporal** | Conclusión de hoy contradice predicción de hace 30 días sin explicar cambio | Cambio de escenario sin registro de recalibración |

### VI.2 Protocolo de detección

```
INTEGRAR salidas de cerebros + Legacy + hipótesis activas
        ↓
MAPEAR afirmaciones en ejes: dirección, magnitud, timing, mecanismo
        ↓
¿Dos o más afirmaciones incompatibles sin conflicto declarado?
        ↓ SÍ
REGISTRAR contradicción interna
        ↓
¿Fue resuelta en síntesis? (pesos, condiciones, escenarios)
        ↓ NO
ALERTA: contradicción no resuelta → debilitar confianza global
        ↓
¿Contradicción persistente en mismo dominio?
        ↓ SÍ
Solicitar Curiosity + revisión de reglas
```

### VI.3 Contradicción productiva vs. dañina

| Productiva | Dañina |
|------------|--------|
| Declarada en síntesis con pesos | Oculta o promediada artificialmente |
| Genera escenarios alternativos | Una parte silenciada |
| Invita a nueva evidencia | Se resuelve por autoridad de una fuente |
| El empresario ve el conflicto | El empresario recibe falsa unanimidad |

---

## VII. Cómo identifica reglas obsoletas

Las reglas, heurísticas y patrones que alguna vez funcionaron **pueden dejar de aplicar** cuando el contexto cambia.

### VII.1 Señales de obsolescencia

| Señal | Descripción |
|-------|-------------|
| **Fallos repetidos en dominio de la regla** | Misma heurística falla ≥2 veces sin explicación de suerte |
| **Contexto de activación ya no existe** | `applies_when` de Legacy ya no se cumple |
| **Nueva estructura de mercado** | Jugadores, regulación o tecnología transformaron el dominio |
| **Predicciones sistemáticamente sesgadas** | La regla empuja siempre en una dirección y la realidad va en otra |
| **Sin uso exitoso reciente** | Regla activa pero sin acierto documentado en ≥12 meses |
| **Contradicción sostenida con evidencia fresca** | Datos nuevos consistentemente contradicen la regla |
| **Aprendizajes que la debilitan** | Learning Engine registró debilitamiento no atendido |

### VII.2 Proceso de revisión de reglas

```
REGLA / HEURÍSTICA / PATRÓN LEGACY
        ↓
¿Último éxito documentado > umbral temporal?
        ↓ SÍ (sospecha)
¿Contexto de applies_when sigue vigente?
        ↓ NO
MARCAR: regla candidata a obsolescencia
        ↓
¿Fallos recientes en dominio de aplicación?
        ↓ SÍ
RECOMENDAR: revisión obligatoria
        ↓
NO eliminar — debilitar confianza + solicitar validación
        ↓
Curiosity: ¿qué cambió en el entorno?
        ↓
REGISTRAR recalibración con transparencia
```

### VII.3 Estados de una regla

| Estado | Confianza | Acción del sistema |
|--------|-----------|-------------------|
| **Activa** | Normal | Usar con peso estándar |
| **En revisión** | Reducida | Usar con reserva; buscar evidencia fresca |
| **Debilitada** | Baja | Solo como referencia; no como base principal |
| **Suspendida** | Mínima | No usar hasta revalidación — sigue en historia |
| **Revalidada** | Restaurada o ajustada | Tras evidencia de que aplica de nuevo o con nuevo contexto |

**Regla:** Nunca borrar. Siempre **debilitar, suspender o revalidar** con registro.

---

## VIII. Cómo detecta sobreajuste

El sobreajuste ocurre cuando el sistema **ajusta su razonamiento a ruido o casos aislados** en lugar de patrones estructurales.

### VIII.1 Manifestaciones de sobreajuste

| Manifestación | Descripción |
|---------------|-------------|
| **Regla de un solo caso** | Un outcome generó regla sin segundo caso de corroboración |
| **Patrón demasiado específico** | "En marzo de 2024 con TC X y proveedor Y..." — no transferible |
| **Confianza alta tras un acierto** | Un éxito eleva confianza desproporcionadamente |
| **Muchas reglas, poca estructura** | Biblioteca crece en heurísticas micro sin principios abstractos |
| **Peor en contextos nuevos** | Razonamiento excelente en casos vistos, pobre en novedad |
| **Explicación post-hoc** | Narrativa construida para justificar resultado, no para predecir |
| **Ignorar base rate** | Ajustar a excepción ignorando frecuencia histórica |

### VIII.2 Contramedidas del Self-Calibration Engine

| Contramedida | Mecanismo |
|--------------|-----------|
| **Umbral de replicación** | No fortalecer regla sin ≥2 casos independientes |
| **Prueba de transferencia** | ¿La regla aplica en contexto ligeramente distinto? |
| **Abstraction check** | ¿Existe principio abstracto o solo caso concreto? |
| **Penalización de complejidad** | Preferir explicaciones más simples con igual poder |
| **Hold-out conceptual** | Reservar casos recientes para validar reglas aprendidas en anteriores |
| **Alerta de micro-patrón** | Regla con alcance muy estrecho → confianza tentativa |

### VIII.3 Relación con Learning Engine

El Learning Engine puede generar aprendizajes tentativos. El Self-Calibration Engine **vigila que los tentativos no se promuevan a reglas sólidas sin evidencia suficiente**.

```
APRENDIZAJE TENTATIVO (Learning)
        ↓
SELF-CALIBRATION: ¿replicado? ¿transferible? ¿mecanismo claro?
        ↓ NO
MANTENER tentativo — no elevar confianza
        ↓ SÍ (en segundo caso independiente)
PERMITIR fortalecimiento gradual
```

---

## IX. Cómo detecta dependencia excesiva de una fuente

Un razonamiento sano **triangula** entre fuentes. La dependencia excesiva de una sola fuente concentra riesgo y ciego puntos.

### IX.1 Señales de dependencia excesiva

| Señal | Umbral conceptual |
|-------|-------------------|
| **Un cerebro domina síntesis** | >70% del peso evidencial de una conclusión proviene de un cerebro |
| **Sin corroboración cruzada** | Conclusión importante sin segunda fuente independiente |
| **Correlación de fuentes** | Dos "fuentes" que en realidad leen el mismo dato subyacente |
| **Ignorar conflicto** | Una fuente disiente pero fue silenciada en síntesis |
| **Histórico de fallos de fuente** | Un cerebro con precisión baja sigue dominando |
| **Novedad sin contraste** | Dato nuevo de una fuente aceptado sin validación |

### IX.2 Mapa de dependencia

```
SÍNTESIS / HIPÓTESIS / PREDICCIÓN
        ↓
DISTRIBUIR peso por fuente:
  Market Intelligence:    __%
  Supply Intelligence:    __%
  Economic Intelligence:  __%
  Legacy:                 __%
  Knowledge Engine:       __%
  Abstraction:            __%
        ↓
¿Alguna fuente > umbral de dominancia?
        ↓ SÍ
ALERTA: dependencia excesiva
        ↓
RECOMENDAR: consulta obligatoria a fuente ausente o disidente
```

### IX.3 Fuentes y riesgos típicos

| Fuente | Riesgo de dependencia excesiva |
|--------|-------------------------------|
| **Market Intelligence** | Sobreponderar demanda visible; ignorar supply |
| **Supply Intelligence** | Sobreponderar logística; ignorar demanda |
| **Economic Intelligence** | Sobreponderar macro; ignorar micro del negocio |
| **Legacy** | Sobreponderar pasado; ignorar cambio estructural |
| **Knowledge Engine** | Sobreponderar grafo estático; ignorar señales frescas |
| **Abstraction** | Sobreponderar analogías lejanas; ignorar contexto local |

---

## X. Cómo detecta cuando Legacy pesa demasiado

Legacy Intelligence es un activo estratégico. Pero **el pasado no siempre es prólogo** — y aplicarlo sin filtro es un sesgo tan peligroso como ignorarlo.

### X.1 Señales de Legacy excesivo

| Señal | Descripción |
|-------|-------------|
| **Evidencia fresca ignorada** | Datos actuales contradicen Legacy y Legacy prevalece sin explicación |
| **Sin verificar applies_when** | Experiencia aplicada fuera de su contexto de validez |
| **"Siempre fue así"** | Lenguaje que cierra exploración de cambio |
| **Peso > evidencia actual** | Legacy aporta >50% del peso en decisión de mercado dinámico |
| **Sin Curiosity complementaria** | No se preguntó qué pudo haber cambiado |
| **Experiencias antiguas sin revisión** | Experiencias >5 años con confianza alta sin revalidación |
| **Bloqueo de hipótesis nuevas** | Legacy descarta hipótesis válidas por precedente |

### X.2 Balance Legacy vs. presente

| Contexto | Peso Legacy apropiado | Peso evidencia fresca |
|----------|----------------------|----------------------|
| Mercado estable, categoría madura | Alto | Complementario |
| Mercado en transformación | Medio-bajo | Alto |
| Señales de disrupción | Bajo — como advertencia, no como predicción | Muy alto |
| Primera vez en categoría | Bajo — analogías, no reglas | Muy alto |
| Decisión recurrente con historial | Alto | Validación |

### X.3 Protocolo

```
LEGACY INVOCADO en razonamiento
        ↓
¿Se verificó applies_when / does_not_apply_when?
        ↓ NO
ALERTA: Legacy sin contexto
        ↓
¿Evidencia fresca contradice Legacy?
        ↓ SÍ
¿Se declaró el conflicto y se ponderó?
        ↓ NO
ALERTA: Legacy pesa demasiado
        ↓
RECOMENDAR: Curiosity sobre cambio estructural + debilitar peso Legacy
```

---

## XI. Cómo detecta cuando el contexto cambió

El contexto no es estático. El Self-Calibration Engine vigila **cambios estructurales** que invalidan razonamientos que antes funcionaban.

### XI.1 Dimensiones de cambio contextual

| Dimensión | Señales de cambio |
|-----------|-------------------|
| **Mercado** | Nuevos jugadores, consolidación, cambio de canal |
| **Oferta** | Nuevos orígenes, disrupción logística, costos estructurales |
| **Economía** | TC, inflación, tasas, política comercial |
| **Regulación** | Normas nuevas, aranceles, restricciones |
| **Tecnología** | Nuevos materiales, procesos, sustitutos |
| **Consumidor** | Cambio de preferencias, generacional, sostenibilidad |
| **Competencia** | Guerras de precio, nuevos entrantes, salidas |
| **Empresa propia** | Cambio de escala, portfolio, capacidad |

### XI.2 Indicadores de cambio contextual

| Indicador | Qué sugiere |
|-----------|-------------|
| **Predicciones sistemáticamente sesgadas en una dirección** | El modelo mental ya no describe la realidad |
| **Señales tempranas acumuladas** | Múltiples micro-cambios apuntan a transformación |
| **Legacy contradicho repetidamente** | El pasado dejó de ser guía |
| **Nuevos patrones sin precedente en Biblioteca** | Estructura nueva emergente |
| **Curiosity genera preguntas no respondidas** | Vacíos de comprensión crecientes |
| **Contradicciones entre cerebros persistentes** | El sistema no converge porque el entorno es distinto |

### XI.3 Respuesta ante cambio de contexto

```
DETECTAR cambio contextual (≥2 señales convergentes)
        ↓
DECLARAR: "Contexto en transición" — no "todo sigue igual"
        ↓
REBAJAR confianza global en dominio afectado
        ↓
SUSPENDER reglas Legacy hasta revalidación
        ↓
ACTIVAR Curiosity en dominio de cambio
        ↓
SOLICITAR evidencia fresca a cerebros relevantes
        ↓
REGISTRAR recalibración con transparencia
```

---

## XII. Cómo recomienda revisar conocimiento antiguo

El conocimiento antiguo no es basura — pero **sí requiere revisión periódica** para evitar que el sistema razone con mapas desactualizados.

### XII.1 Criterios de revisión recomendada

| Criterio | Acción recomendada |
|----------|-------------------|
| **Antigüedad sin uso exitoso** | Experiencia o regla sin acierto en ≥12 meses → revisar |
| **Antigüedad sin uso** | Sin invocación en ≥18 meses → revisar relevancia |
| **Dominio en transformación** | Todo conocimiento del dominio → revisión prioritaria |
| **Debilitamiento acumulado** | Learning registró debilitamientos no atendidos → revisión |
| **Contradicción sostenida** | Conocimiento antiguo vs. evidencia fresca → revisión |
| **Cambio de escala empresarial** | Conocimiento de etapa anterior → revisar aplicabilidad |

### XII.2 Tipos de revisión

| Tipo | Alcance | Frecuencia sugerida |
|------|---------|---------------------|
| **Revisión ligera** | Verificar vigencia de reglas activas | Continua (automática en auditoría) |
| **Revisión profunda** | Dominio completo — Legacy, patrones, heurísticas | Trimestral por dominio prioritario |
| **Revisión de crisis** | Tras degradación detectada o cambio contextual | Inmediata |
| **Revisión anual** | Inventario completo de conocimiento calibrable | Anual |

### XII.3 Output de recomendación de revisión

Cada recomendación incluye:

| Campo | Contenido |
|-------|-----------|
| **Qué revisar** | Regla, experiencia Legacy, patrón, heurística |
| **Por qué** | Antigüedad, fallos, cambio contextual, contradicción |
| **Prioridad** | Alta | media | baja |
| **Evidencia que provocó** | Señales concretas |
| **Qué buscar en revisión** | ¿Sigue aplicando? ¿Nuevo applies_when? ¿Debilitar o revalidar? |
| **Sin borrar** | El conocimiento permanece; solo cambia su peso o estado |

---

## XIII. Auditoría del razonamiento

El sistema debe evaluar **periódicamente** la calidad de sus propios procesos cognitivos — no solo sus resultados.

### XIII.1 Ámbitos de auditoría

| Ámbito | Qué evalúa | Preguntas guía |
|--------|------------|----------------|
| **Calidad de hipótesis** | Solidez, alternativas, refutación propia | ¿Se generaron alternativas? ¿Se intentó refutar? |
| **Calidad de predicciones** | Calibración, falsabilidad, escenarios | ¿Confianza calibrada? ¿Indicadores de invalidación? |
| **Calidad de explicaciones** | Honestidad, límites, coherencia | ¿Se declararon límites? ¿Explicación completa? |
| **Calidad de evidencia** | Diversidad, frescura, relevancia | ¿Fuentes cruzadas? ¿Evidencia suficiente para confianza? |
| **Calidad de decisiones apoyadas** | Valor decisorio del razonamiento | ¿El empresario pudo decidir mejor? ¿Outcome alineado con calidad del razonamiento? |

### XIII.2 Ciclo de auditoría

```
PERÍODO (semana / mes / trimestre)
        ↓
MUESTREAR razonamientos del período
  - hipótesis generadas
  - predicciones emitidas
  - síntesis entregadas
  - decisiones apoyadas con outcome conocido
        ↓
EVALUAR cada ámbito (XIII.1)
        ↓
CALCULAR tendencias (mejorando / estable / degradando)
        ↓
DETECTAR anomalías y patrones de fallo
        ↓
GENERAR informe de auditoría interno
        ↓
SI degradación → activar recalibración (Sección XV)
        ↓
REGISTRAR con transparencia (Sección XVII)
```

### XIII.3 Auditoría vs. aprendizaje

| Auditoría (Self-Calibration) | Aprendizaje (Learning Engine) |
|------------------------------|-------------------------------|
| Evalúa el **proceso** de pensar | Extrae **lección** del resultado |
| Periódica y continua | Post-decisión |
| Puede actuar antes del outcome | Requiere outcome |
| Detecta degradación del método | Actualiza conocimiento |

---

## XIV. Indicadores

El Self-Calibration Engine mide la **salud del razonamiento** — no el volumen de actividad.

### XIV.1 Indicadores principales

| Indicador | Qué mide | Señal saludable | Señal de alerta |
|-----------|----------|-----------------|-----------------|
| **Precisión histórica** | % de hipótesis/predicciones acertadas por dominio y horizonte | Estable o mejorando | Caída sostenida ≥15% |
| **Evolución de confianza** | Tendencia de confianza declarada en el tiempo | Calibrada con precisión | Confianza sube sin mejora de precisión |
| **Estabilidad del conocimiento** | % de reglas activas sin debilitamiento ni revalidación | Alta estabilidad con revisiones periódicas | Muchas reglas en revisión simultánea |
| **Velocidad de aprendizaje** | Tiempo entre error repetitivo y ajuste de comportamiento | Errores no se repiten | Mismo error ≥2 veces sin recalibración |
| **Errores repetidos** | Frecuencia de misma estructura de error | Decreciente | Creciente o estable en nivel alto |
| **Hipótesis descartadas** | % de hipótesis que el propio sistema refutó antes de síntesis | Saludable — indica rigor | Muy bajo — posible convergencia prematura |
| **Hipótesis confirmadas** | % de hipótesis que outcome confirmó | Alineado con confianza declarada | Muchas confirmadas con baja confianza (suerte) o pocas con alta (sobreconfianza) |

### XIV.2 Indicadores de calibración

| Indicador | Fórmula conceptual | Objetivo |
|-----------|-------------------|----------|
| **Calibration gap** | Confianza declarada − precisión real | → 0 (bien calibrado) |
| **False confidence rate** | Aciertos donde mecanismo era débil / total aciertos | ↓ |
| **Unresolved contradiction rate** | Contradicciones no resueltas / síntesis totales | → 0 |
| **Legacy overweight rate** | Síntesis donde Legacy > umbral sin verificar contexto | → 0 |
| **Single-source dependency rate** | Conclusiones con una sola fuente dominante | ↓ |
| **Overfit suspicion rate** | Reglas de caso único promovidas a sólidas | → 0 |

### XIV.3 Indicadores de degradación

| Indicador | Umbral de alerta |
|-----------|------------------|
| Precisión 30 días < precisión 90 días − 10% | Degradación reciente |
| Calibration gap > +0.15 sostenido | Sobreconfianza crónica |
| Errores repetidos mismo dominio ≥2 en 60 días | Fallo estructural no atendido |
| Contradicciones no resueltas > 20% del período | Integración deficiente |
| Reglas obsoletas marcadas sin revisión > 90 días | Deuda de calibración |

### XIV.4 Dashboard conceptual

```
SELF-CALIBRATION HEALTH (vista interna)
├── Precisión global:           72% (↓ 4% vs. trimestre anterior)  ⚠
├── Calibration gap:            +0.12 (sobreconfiado)               ⚠
├── Errores repetidos:          1 (supply timing)                   ⚠
├── Contradicciones resueltas:  94%                                 ✓
├── Dependencia fuente única:   8%                                  ✓
├── Reglas en revisión:         3                                   ℹ
└── Estado general:             RECALIBRACIÓN RECOMENDADA
```

---

## XV. Recalibración

Cuando el Self-Calibration Engine detecta **degradación**, debe activar un protocolo de recalibración — no esperar pasivamente.

### XV.1 Disparadores de recalibración

| Disparador | Severidad |
|------------|-----------|
| Degradación de precisión sostenida | Alta |
| Calibration gap > umbral | Alta |
| Error repetido misma estructura | Alta |
| Cambio contextual detectado | Alta |
| Contradicciones no resueltas acumuladas | Media |
| Regla obsoleta sin revisión | Media |
| Dependencia excesiva de fuente | Media |
| Sobreajuste detectado | Media |

### XV.2 Acciones de recalibración

Cuando detecte degradación, el sistema deberá:

| Acción | Descripción |
|--------|-------------|
| **Disminuir confianza** | Rebajar bandas de confianza en dominio afectado hasta nueva evidencia |
| **Solicitar nueva evidencia** | Consulta activa a cerebros con datos frescos del dominio |
| **Consultar nuevamente Legacy** | Revalidar experiencias — ¿siguen aplicando? |
| **Consultar Curiosity** | Generar preguntas sobre qué cambió y qué no se está viendo |
| **Generar nuevas hipótesis** | Forzar pluralidad — mínimo tres alternativas en dominio afectado |
| **Evitar repetir errores** | Marcar estructura de error; bloquear mismo razonamiento sin nueva evidencia |

### XV.3 Protocolo de recalibración

```
DETECTAR degradación (indicadores XIV.3)
        ↓
CLASIFICAR severidad (alta / media)
        ↓
DISMINUIR confianza en dominio afectado
        ↓
REGISTRAR inicio de recalibración (transparencia)
        ↓
EJECUTAR acciones según severidad:
  Alta:   todas las acciones XV.2 + suspender reglas sospechosas
  Media:  evidencia + Curiosity + nuevas hipótesis
        ↓
MONITOREAR indicadores durante período de observación
        ↓
¿Mejora calibración?
        ↓ SÍ
CERRAR recalibración — restaurar confianza gradualmente
        ↓ NO
ESCALAR: revisión profunda de dominio + informe al empresario si afecta decisiones activas
```

### XV.4 Recalibración gradual

La confianza no se restaura de golpe. Tras recalibración exitosa:

| Fase | Confianza | Condición para avanzar |
|------|-----------|------------------------|
| **Observación** | Mínima | Recalibración activa |
| **Tentativa** | Baja-media | ≥2 razonamientos sólidos en dominio |
| **Recuperación** | Media | Precisión alineada con confianza en 30 días |
| **Normal** | Estándar | Calibration gap < umbral por 60 días |

---

## XVI. Qué nunca debe hacer

| Prohibición | Por qué |
|-------------|---------|
| **Nunca modificar evidencia** | La evidencia es sagrada — solo el empresario y los hechos la definen |
| **Nunca borrar historia** | Los errores pasados son activos de calibración |
| **Nunca ocultar errores** | Un error oculto se repite; uno visible se aprende |
| **Nunca aumentar confianza sin evidencia** | La confianza se gana con calidad sostenida, no con deseo |
| **Nunca asumir que siempre mejora** | Los sistemas degradan; la vigilancia es permanente |
| Nunca decidir por el empresario | Rol del Business Brain |
| Nunca reemplazar al Learning Engine | Aprender ≠ calibrar |
| Nunca eliminar reglas — solo debilitar o suspender | Reversibilidad del conocimiento |
| Nunca recalibrar sin registro | Transparencia obligatoria |
| Nunca castigar al empresario por outcomes | Se evalúa razonamiento, no la decisión humana |

---

## XVII. Transparencia

Toda recalibración debe quedar **registrada y explicable**. El empresario y el sistema deben poder entender qué cambió y por qué.

### XVII.1 Registro de recalibración

Cada evento de recalibración incluye:

| Campo | Contenido |
|-------|-----------|
| **Qué cambió** | Confianza, peso de regla, estado de heurística, dominio afectado |
| **Por qué cambió** | Indicador o señal que disparó la recalibración |
| **Qué evidencia provocó el cambio** | Datos, fallos, contradicciones, cambio contextual |
| **Cómo afecta futuras recomendaciones** | "En dominio X, confianza reducida de 0.75 a 0.50 hasta nueva evidencia" |
| **Fecha y duración** | Inicio, fase actual, condiciones de cierre |
| **Acciones tomadas** | Lista de acciones del protocolo XV.3 ejecutadas |

### XVII.2 Ejemplo de registro

```
RECALIBRACIÓN #2024-Q3-SUPPLY-07
─────────────────────────────────
Qué cambió:     Confianza en predicciones de timing de importación
                reducida de 0.72 a 0.48 en horizonte 60-90 días

Por qué:        Precisión cayó 18% en trimestre; calibration gap +0.20;
                error repetido en estimación de lead time (2 casos)

Evidencia:      Predicción #P-1847 y #P-1902 fallaron en timing;
                Supply Intelligence reportó cambio en congestión portuaria
                no incorporado en modelo de razonamiento

Impacto futuro: Predicciones de supply en horizonte 60-90 días llevarán
                banda de incertidumbre ampliada; se solicitará Freight
                Intelligence en toda predicción de timing

Acciones:       ✓ Disminuir confianza
                ✓ Solicitar Freight Intelligence
                ✓ Consultar Curiosity sobre cambio logístico
                ✓ Suspender heurística H-SUPPLY-03
                ◻ Pendiente: segundo caso de validación para restaurar

Estado:         OBSERVACIÓN (desde 2024-09-15)
```

### XVII.3 Visibilidad para el empresario

No toda recalibración requiere notificación activa al empresario. Pero debe ser **consultable**:

| Severidad | Visibilidad |
|-----------|-------------|
| **Alta** — afecta decisiones activas o confianza global | Notificación en próxima síntesis relevante |
| **Media** — dominio específico | Disponible en historial de calibración |
| **Baja** — ajuste fino interno | Registro interno; visible si empresario pregunta |

### XVII.4 Transparencia como confianza

El empresario confía más en un sistema que dice *"bajé mi confianza en este dominio porque me equivoqué dos veces"* que en uno que nunca admite degradación.

---

## XVIII. Relación con otros componentes

| Componente | Relación con Self-Calibration |
|------------|------------------------------|
| **Business Brain** | Objeto de auditoría — recibe ajustes de confianza y alertas |
| **Learning Engine** | Complementario — aprende del outcome; Self-Calibration evalúa el proceso |
| **Prediction Engine** | Fuente de predicciones a auditar; recibe recalibración de confianza |
| **Legacy Intelligence** | Vigilar peso excesivo; recomendar revisión de experiencias |
| **Curiosity Engine** | Activar ante cambio contextual o reglas obsoletas |
| **Abstraction Engine** | Verificar que patrones no sean sobreajuste de casos |
| **Explainability Engine** | La calidad de explicaciones es un ámbito de auditoría |
| **Knowledge Engine** | Detectar dependencia excesiva del grafo estático |
| **Cerebros especializados** | Auditar precisión por fuente; detectar dominancia |

### XVIII.1 Flujo en el ecosistema

```
                    ┌─────────────────────────┐
                    │   SELF-CALIBRATION      │
                    │   (auditor permanente)  │
                    └───────────┬─────────────┘
                                │ vigila
        ┌───────────────────────┼───────────────────────┐
        ↓                       ↓                       ↓
 BUSINESS BRAIN          PREDICTION ENGINE        LEARNING ENGINE
 (razonamiento)          (predicciones)           (aprendizajes)
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                ↓
                    RECALIBRACIÓN + TRANSPARENCIA
                                ↓
                    CONOCIMIENTO CON PESOS AJUSTADOS
                    (historia intacta)
```

---

## XIX. Cierre

El Self-Calibration Engine es lo que impide que Mercadeo IA se convierta en un sistema que **habla con certeza mientras pierde calidad**.

No aprende del resultado — eso es del Learning Engine.  
**Vigila cómo se piensa**, detecta cuando el pensamiento se degrada, y **recalibra con honestidad**.

No borra el pasado. No modifica evidencia. No oculta errores.

> *"Un sistema inteligente no es el que nunca se equivoca. Es el que reconoce sus errores, los explica y mejora continuamente sin perder el conocimiento acumulado."*

El empresario decide.  
El Self-Calibration Engine asegura que las recomendaciones lleguen con **confianza merecida**.

---

*Business Brain – Self-Calibration Engine v1.0*  
*Mercadeo IA — Sin implementación.*
