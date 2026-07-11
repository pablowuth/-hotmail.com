# Business Brain – Learning Engine

**Componente:** Learning Engine — aprendizaje post-decisión del Business Brain  
**Producto:** Mercadeo IA  
**Tipo:** Diseño conceptual. Sin implementación.  
**Versión:** 1.0

**Documentos relacionados:**
- `docs/FOUNDATIONAL_PRINCIPLES.md` — Constitución del proyecto
- `docs/business-brain-modelo-de-razonamiento.md` — Modelo de razonamiento
- `docs/business-brain-diseno.md` — Diseño operativo del Business Brain
- `docs/business-brain-abstraction-engine.md` — Abstraction Engine
- `docs/business-brain-curiosity-engine.md` — Curiosity Engine

---

## Resumen

El **Learning Engine** define **cómo aprende Mercadeo IA después de cada decisión tomada por el empresario**.

**No aprende leyendo más información.**  
Aprende **comparando**:

- hipótesis
- decisión
- resultado
- tiempo
- contexto
- consecuencias

**Principio rector:**

> *"Aprender no significa recordar más. Significa cometer menos errores importantes con el paso del tiempo."*

Su misión es descubrir:

- qué razonamientos fueron correctos
- cuáles fallaron
- cuáles acertaron por casualidad
- qué reglas deben fortalecerse
- qué reglas deben debilitarse
- qué patrones dejan de ser válidos

El Learning Engine **no decide**, **no reemplaza al empresario** y **no modifica evidencia**. **Calibra conocimiento** con honestidad.

---

## I. Filosofía del aprendizaje

### I.1 Aprendizaje como activo compuesto

Mercadeo IA no mejora por acumular datos. Mejora cuando el ciclo **hipótesis → decisión → resultado → comparación** produce **aprendizaje reutilizable** que reduce errores futuros.

Cada decisión del empresario es una **experimento vivido**. El Learning Engine es el laboratorio que extrae la lección — sin borrar el experimento.

### I.2 Aprendizaje ≠ memorizar

| Memorizar | Aprender |
|-----------|----------|
| Guardar el hecho | Extraer el mecanismo |
| Más registros | Mejor calibración |
| Recordar qué pasó | Saber qué haría diferente la próxima vez |
| Pasivo | Comparativo y reflexivo |

### I.3 El empresario sigue siendo la fuente

El Learning Engine aprende **de las decisiones humanas y sus resultados** — no de modelos que se auto-confirmen. La experiencia humana permanece como ancla; el aprendizaje **calibra**, no **sustituye**.

### I.4 Aprendizaje lento y honesto

| Principio | Enunciado |
|-----------|-----------|
| **Gradualismo** | Una decisión rara vez cambia una regla — acumula evidencia |
| **Reversibilidad del conocimiento** | Las reglas se fortalecen o debilitan; rara vez se borran |
| **Errores son oro** | Los fracasos enseñan más que los éxitos accidentales |
| **Contexto obligatorio** | Sin contexto, no hay aprendizaje transferible |
| **Legacy primero** | Antes de modificar una conclusión, consultar experiencia acumulada |
| **Humildad** | Un acierto no prueba que el razonamiento fuera correcto |

### I.5 Qué aprende y qué no

| Aprende | No aprende |
|---------|------------|
| Calibración de confianza de heurísticas | A decidir por el empresario |
| Validez de patrones en contextos | A reescribir evidencia histórica |
| Sesgos recurrentes (propios y del empresario) | De un solo caso sin corroboración |
| Qué preguntas curiosas fueron útiles | De correlaciones sin mecanismo |
| Cuándo un patrón abstracto dejó de aplicar | Ignorando Legacy |

---

## II. Información, conocimiento y aprendizaje

### II.1 Tres capas

```
INFORMACIÓN          CONOCIMIENTO           APRENDIZAJE
────────────         ─────────────          ────────────
Datos crudos    →    Estructurado      →    Calibrado por
Hechos               Patrones               experiencia
Eventos              Heurísticas            comparada
Señales              Experiencias           Confianza ajustada
                     Principios             "Qué cambió"
```

| Capa | Pregunta que responde | Ejemplo |
|------|----------------------|---------|
| **Información** | ¿Qué ocurrió? | "Importaciones subieron 18%" |
| **Conocimiento** | ¿Qué significa / cómo se organiza? | "Categoría en saturación; heurística H-12 activa" |
| **Aprendizaje** | ¿Qué cambió en nuestra comprensión tras decidir y observar resultado? | "H-12 acertó en timing pero sobrestimó margen — debilitar confianza en entornos de TC volátil" |

### II.2 Solo el aprendizaje cierra el flywheel

```
Experiencia → Conocimiento → Inteligencia → Decisión → RESULTADO
                                                          ↓
                                                    APRENDIZAJE
                                                          ↓
                                              Conocimiento calibrado
```

Sin la capa de aprendizaje, Mercadeo IA es un sistema que **informa** pero no **mejora**.

### II.3 Aprendizaje requiere comparación

No hay aprendizaje sin **contraste** entre lo que se pensaba que pasaría y lo que pasó. Información nueva sin comparación es solo **más datos**.

---

## III. Ciclo completo de aprendizaje

### III.1 Diagrama del ciclo

```
HIPÓTESIS
  (Business Brain presentó N hipótesis con confianza y evidencia)
        ↓
DECISIÓN
  (El empresario eligió — el sistema registra cuál hipótesis siguió, si alguna)
        ↓
RESULTADO
  (Observado en el tiempo — ventas, stock, margen, mercado, etc.)
        ↓
COMPARACIÓN
  (Esperado vs real; hipótesis vs outcome; contexto entonces vs ahora)
        ↓
APRENDIZAJE
  (Tipo clasificado — ver Sección IV)
        ↓
ACTUALIZACIÓN DEL CONOCIMIENTO
  (Confianza de reglas, validez de patrones, entrada en Biblioteca)
```

### III.2 Fase: Hipótesis

**Qué captura el Learning Engine al momento de la decisión:**

- Hipótesis presentadas por el Business Brain (todas, no solo la "más sólida")
- Evidencia y reglas que sustentaban cada una
- Nivel de confianza declarado
- Experiencias Legacy citadas
- Patrones abstractos invocados (Abstraction Engine)
- Conflictos detectados
- Qué el empresario **esperaba** explícitamente, si lo declaró

Sin snapshot de hipótesis, no hay comparación posible después.

### III.3 Fase: Decisión

**Qué registra:**

- Qué eligió el empresario
- Si siguió una hipótesis del sistema, la ignoró o eligió híbrido
- Contexto humano adicional que el empresario aportó
- Timestamp y horizonte implícito de la decisión

**Regla:** El Learning Engine **no juzga** la decisión. La **documenta**.

### III.4 Fase: Resultado

**Qué observa (según horizonte de la decisión):**

| Horizonte | Ejemplos de resultado |
|-----------|----------------------|
| Corto (semanas) | Stock vendido, margen realizado, respuesta de competencia |
| Medio (meses) | Rotación, participación, cash flow |
| Largo (años) | Posición de mercado, relación con proveedor, supervivencia de SKU |

El resultado puede ser **mixto** — éxito en una dimensión, fracaso en otra.

### III.5 Fase: Comparación

**Dimensiones de comparación:**

| Dimensión | Pregunta |
|-----------|----------|
| Hipótesis vs realidad | ¿Qué hipótesis se acercó más al outcome? |
| Esperado vs real | ¿El empresario obtuvo lo que buscaba? |
| Confianza vs acierto | ¿La confianza declarada calibró bien? |
| Reglas invocadas | ¿Las heurísticas activadas predijeron correctamente? |
| Contexto | ¿El contexto cambió entre decisión y resultado? |
| Segundo orden | ¿Hubo consecuencias no anticipadas? |

### III.6 Fase: Aprendizaje

Clasificar el tipo de aprendizaje (Sección IV). Extraer **explicación** — por qué acertó o falló el razonamiento, no solo el número.

### III.7 Fase: Actualización del conocimiento

| Qué se actualiza | Cómo |
|------------------|------|
| Confianza de heurísticas | Subir / bajar / marcar contested |
| Validez de patrones | Confirmar / debilitar / deprecar |
| Calibración global | Learning ajusta bandas de confianza futuras |
| Biblioteca de aprendizajes | Nueva entrada — nunca sobrescribe anteriores |
| Legacy | Si el aprendizaje es estructural, puede proponer enriquecimiento de experiencia |
| Sesgos detectados | Registro de patrón de sesgo — no acusación |

---

## IV. Tipos de aprendizaje

### IV.1 Éxito confirmado

| Atributo | Detalle |
|----------|---------|
| **Qué es** | Resultado alineado con hipótesis; razonamiento correcto identificable |
| **Señal** | Mecanismo predicho ocurrió — no solo el número final |
| **Acción** | Fortalecer confianza de reglas y patrones que sustentaron |
| **Cuidado** | Verificar que no fue suerte — ver falso éxito |

*Ejemplo:* Se hipotetizó adelantar compra por flete alcista; flete subió 22%; margen protegido. Mecanismo confirmado.

### IV.2 Falso éxito

| Atributo | Detalle |
|----------|---------|
| **Qué es** | Resultado favorable pero por razón distinta a la hipótesis — o por suerte |
| **Señal** | Outcome positivo + mecanismo predicho NO ocurrió, o contexto externo impulsó |
| **Acción** | **No** fortalecer reglas que sustentaron; registrar como advertencia |
| **Cuidado** | El más peligroso — refuerza mal razonamiento |

*Ejemplo:* Compra adelantada "por flete"; el éxito vino porque competidor salió del mercado — no por flete.

### IV.3 Fracaso útil

| Atributo | Detalle |
|----------|---------|
| **Qué es** | Resultado negativo con lección clara y mecanismo identificado |
| **Señal** | Se puede explicar por qué falló; aplica a futuro |
| **Acción** | Fortalecer aprendizaje en Biblioteca; posible nueva experiencia Legacy |
| **Cuidado** | No generalizar sin applies_when |

*Ejemplo:* Sobrestock tras compra en saturación — confirma heurística Legacy y debilita "comprar ante flete" en saturación.

### IV.4 Fracaso repetitivo

| Atributo | Detalle |
|----------|---------|
| **Qué es** | Mismo tipo de error en decisiones similares — patrón de fallo |
| **Señal** | Biblioteca muestra ≥2 aprendizajes con estructura similar negativa |
| **Acción** | Alertar sesgo (empresario o sistema); elevar prioridad de conflicto en Business Brain |
| **Cuidado** | Puede indicar sesgo del empresario o regla sistémica incorrecta |

*Ejemplo:* Tercera vez que se adelanta compra en categoría saturada con sobrestock resultante.

### IV.5 Cambio del entorno

| Atributo | Detalle |
|----------|---------|
| **Qué es** | Razonamiento era válido entonces; contexto estructural cambió después |
| **Señal** | Regla acertó históricamente; `does_not_apply_when` ahora activo |
| **Acción** | Debilitar aplicabilidad futura de regla sin borrarla; marcar cambio de régimen |
| **Cuidado** | No confundir con fracaso del empresario |

*Ejemplo:* Heurística de importar desde China válida 2010–2019; aranceles 2020+ cambian estructura.

### IV.6 Cambio del mercado

| Atributo | Detalle |
|----------|---------|
| **Qué es** | Patrón de mercado evolucionó — saturación, commodity, nuevo jugador |
| **Señal** | Fase de ciclo de vida cambió; datos de Market/Supply confirman |
| **Acción** | Deprecar patrón para contexto viejo; actualizar fase en Product Intelligence |
| **Cuidado** | Distinguir cambio lento (Curiosity) de cambio de régimen |

---

## V. Qué información registra después de cada decisión

Registro conceptual post-decisión (alimenta Biblioteca y calibración):

| Campo | Contenido |
|-------|-----------|
| Referencia a decisión | Vínculo al DecisionRecord y síntesis del Business Brain |
| Hipótesis snapshot | Todas las hipótesis con confianza al momento de decidir |
| Decisión del empresario | Qué eligió y si siguió hipótesis del sistema |
| Horizonte de evaluación | Cuándo se medirá el resultado |
| Resultado esperado | Por empresario y por sistema (pueden diferir) |
| Resultado real | Multi-dimensional — margen, stock, participación, etc. |
| Contexto al decidir | Macro, fase de producto, flete, competencia |
| Contexto al evaluar | Qué cambió entre decisión y medición |
| Reglas invocadas | Heurísticas y patrones activos |
| Legacy citado | Experiencias referenciadas |
| Tipo de aprendizaje | Clasificación Sección IV |
| Explicación causal | Por qué acertó o falló el razonamiento |
| Ajustes propuestos | Qué confianzas cambiar — pendiente de evidencia acumulada |
| Segundo orden | Consecuencias no anticipadas |

---

## VI. Cómo calcula el valor real de una decisión

### VI.1 Valor real ≠ resultado contable simple

El **valor real** de una decisión incluye dimensiones que el resultado inmediato puede ocultar:

| Dimensión | Pregunta |
|-----------|----------|
| **Económica** | ¿Mejoró margen, cash flow, ROI del capital invertido? |
| **Estratégica** | ¿Mejoró posición competitiva, relación con proveedor, portfolio? |
| **Opcionalidad** | ¿Dejó abierta o cerrada una opción valiosa? |
| **Riesgo** | ¿Redujo o aumentó exposición a cola negativa? |
| **Informacional** | ¿Se aprendió algo que vale más que el resultado puntual? |
| **Reversibilidad** | ¿El costo de revertir fue mayor o menor al anticipado? |

### VI.2 Fórmula conceptual (no matemática)

```
Valor real = f(resultado económico, resultado estratégico, calidad del razonamiento, 
             aprendizaje generado, costo de oportunidad, riesgo asumido vs materializado)
```

### VI.3 Calidad del razonamiento vs calidad del resultado

| Resultado | Razonamiento | Valoración del Learning Engine |
|-----------|--------------|-------------------------------|
| Bueno | Bueno | Éxito confirmado — fortalecer |
| Bueno | Malo | Falso éxito — no fortalecer |
| Malo | Bueno | Mala suerte o cambio de entorno — no castigar reglas |
| Malo | Malo | Fracaso útil o repetitivo — aprender |

**Principio:** El Learning Engine evalúa **proceso y outcome** — no solo outcome.

### VI.4 Ventanas temporales

Una decisión puede tener **valor negativo a 30 días** y **positivo a 12 meses** — o al revés. El Learning Engine evalúa en el horizonte **declarado al decidir** y revisita horizontes posteriores sin reescribir el aprendizaje inicial — **añade** capas.

---

## VII. Cómo evita aprender de coincidencias

### VII.1 Coincidencia vs causalidad

| Coincidencia | Causalidad |
|--------------|------------|
| Dos cosas ocurrieron juntas | Una explica la otra |
| Sin mecanismo | Con mecanismo identificable |
| No replica | Replica en contextos similares |
| Una observación | Múltiples observaciones |

### VII.2 Reglas anti-coincidencia

```
1. NUNCA cambiar confianza de regla con un solo caso — salvo fracaso catastrófico documentado
2. EXIGIR mecanismo explicativo — no solo correlación
3. BUSCAR contra-ejemplo — ¿hubo caso donde regla falló?
4. CONSULTAR Legacy — ¿experiencia previa confirma o refuta?
5. ESPERAR replicación — segundo caso similar antes de fortalecer fuerte
6. SEPARAR falso éxito de éxito confirmado — obligatorio
7. DECLARAR "aprendizaje tentativo" si N < umbral de casos
```

### VII.3 Umbral de evidencia para modificar reglas

| Cambio propuesto | Evidencia mínima conceptual |
|------------------|----------------------------|
| Debilitar levemente | 1 fracaso útil con mecanismo claro |
| Debilitar significativamente | 2+ fracasos o 1 + Legacy alineado |
| Fortalecer | 2+ éxitos confirmados (no falsos) |
| Marcar contested | Contradicción Legacy vs datos recientes |
| Deprecar patrón | Cambio de entorno + cambio de mercado confirmados |

---

## VIII. Cómo detecta sesgos del empresario

### VIII.1 Sesgos frecuentes

| Sesgo | Manifestación | Señal en datos |
|-------|---------------|----------------|
| **Exceso de optimismo** | Ignora hipótesis cautas del sistema | Decisiones repetidas contra hipótesis conservadora |
| **Aversión a pérdida tardía** | No corta stock muerto | Fracaso repetitivo en liquidación |
| **Anclaje** | Primera cotización o experiencia vieja domina | Decisiones desconectadas de datos actuales |
| **Confirmación** | Solo registra outcomes favorables | Outcomes negativos no documentados |
| **Narrativa** | "Esta vez es diferente" sin estructura | Legacy does_not_apply_when invocado sin evidencia |
| **Sunk cost** | Sigue invirtiendo en producto fallido | Fracaso repetitivo misma categoría |

### VIII.2 Detección conceptual

1. Comparar **decisiones** vs **hipótesis del sistema** — patrón sistemático
2. Comparar **expectativas declaradas** vs **resultados** — calibración
3. Buscar **fracasos repetitivos** con misma estructura
4. Cruzar con **Legacy** — ¿el empresario repite error ya documentado?

### VIII.3 Cómo reporta sesgos

El Learning Engine **no acusa**. Presenta al Business Brain **patrones observados**:

> *"En 4 de las últimas 6 decisiones de compra en categorías en saturación, la decisión fue adelantar stock pese a hipótesis cauta del sistema. El outcome fue sobrestock en 3 casos. Podría existir sesgo de optimismo en contexto de saturación."*

El empresario **valida o refuta**. Sin validación, queda como hipótesis de sesgo — no como verdad.

---

## IX. Cómo detecta sesgos propios (del sistema)

### IX.1 Sesgos del sistema

| Sesgo | Manifestación |
|-------|---------------|
| **Sesgo de recencia** | Sobrepesar datos nuevos vs Legacy |
| **Sesgo de confianza** | Declarar confianza alta con datos incompletos |
| **Sesgo de convergencia** | Asumir que 3 cerebros de acuerdo = certeza |
| **Sesgo de patrón** | Ver patrón donde hay ruido |
| **Sesgo de analogía** | Abstraction Engine fuerza comparación |
| **Sesgo de fuente** | Confiar en un cerebro sistemáticamente sobre otro sin calibrar |

### IX.2 Detección

| Método | Descripción |
|--------|-------------|
| **Calibration tracking** | ¿Confianza 0.8 = acierto ~80% del tiempo? |
| **Por cerebro** | ¿Qué cerebro acierta más en qué dominio? |
| **Por tipo de decisión** | ¿Fallamos más en compra que en precio? |
| **Falsos éxitos** | ¿Cuántos éxitos fueron por razón equivocada? |
| **Legacy vs sistema** | ¿Cuándo Legacy acertó y el sistema no? |

### IX.3 Corrección

- Ajustar pesos de ponderación en Business Brain (conceptual)
- Bajar confianza base en dominios mal calibrados
- Marcar heurísticas sistémicas como contested
- Alimentar Curiosity con "¿por qué fallamos aquí repetidamente?"

---

## X. Cómo modifica el nivel de confianza de reglas anteriores

### X.1 Principio: ajuste gradual, nunca borrado

Las reglas y heurísticas **no se eliminan** por un caso. Su **confianza** se mueve en bandas:

```
confianza nueva = confianza anterior ± Δ

Δ depende de:
  - tipo de aprendizaje (IV)
  - fuerza del mecanismo explicativo
  - número de casos acumulados
  - alineación o conflicto con Legacy
  - detección de cambio de entorno
```

### X.2 Tabla de ajustes conceptuales

| Evento | Ajuste típico |
|--------|---------------|
| Éxito confirmado (1 caso) | +0.03 a +0.05 |
| Éxito confirmado (3+ casos) | +0.08 a +0.12 |
| Falso éxito | −0.02 a regla; marcar "no reforzar por este caso" |
| Fracaso útil | −0.05 a −0.10 |
| Fracaso repetitivo | −0.10 a −0.15; alerta sesgo |
| Cambio de entorno | Marcar `aplicabilidad reducida`; no penalizar regla histórica |
| Legacy refuta ajuste propuesto | Suspender ajuste hasta debate explícito |

### X.3 Límites

| Límite | Valor conceptual |
|--------|------------------|
| Confianza mínima | 0.10 — regla casi deprecada pero histórica preservada |
| Confianza máxima | 0.95 — nunca certeza absoluta |
| Cambio máximo por caso | 0.15 — un solo evento no redefine todo |

### X.4 Estados de regla

| Estado | Significado |
|--------|-------------|
| active | Confianza normal operativa |
| strengthened | Reforzada recientemente con evidencia |
| weakened | Debilitada — usar con cautela |
| contested | Legacy y datos discrepan |
| deprecated | Patrón de entorno invalidó — conservada en histórico |
| tentative | Nueva regla — pocos casos |

---

## XI. Cómo aprende sin destruir conocimiento histórico

### XI.1 Principio de conservación

> **Aprender es sumar capas, no reescribir el pasado.**

| Permitido | Prohibido |
|-----------|-----------|
| Añadir entrada en Biblioteca | Borrar aprendizajes anteriores |
| Ajustar confianza hacia adelante | Modificar evidencia histórica |
| Marcar regla como deprecated | Eliminar regla del registro |
| Añadir `does_not_apply_when` | Reescribir experiencia Legacy |
| Versionar interpretación | Afirmar "antes estábamos equivocados" sin preservar el antes |

### XI.2 Modelo de capas temporales

```
Capa 2015: Regla R con confianza 0.85 (válida en contexto C2015)
Capa 2020: Cambio de entorno — aplicabilidad reducida
Capa 2024: Confianza actual 0.45 en contexto C2024
           PERO: en contexto similar a C2015, sigue siendo 0.80 referencial
```

### XI.3 Aprendizaje acumulativo

Cada aprendizaje es **inmutable** una vez registrado. Los ajustes de confianza son **nuevos estados** con referencia al anterior — linaje completo.

---

## XII. Consulta a Legacy Intelligence antes de modificar conclusiones

### XII.1 Regla obligatoria

**Ningún ajuste de confianza, deprecación de patrón o aprendizaje estructural se finaliza sin consultar Legacy.**

### XII.2 Protocolo

```
PROPUESTA DE AJUSTE (ej: debilitar heurística H-7)
        ↓
CONSULTA LEGACY: experiencias y heurísticas relacionadas
        ↓
¿Legacy CONFIRMA el ajuste?     → Proceder con Δ normal
¿Legacy CONTRADICE?             → Marcar contested; Business Brain presenta debate
¿Legacy SILENCIOSO?             → Proceder con Δ reducido; marcar tentative
¿Experiencia única del fundador? → Declarar posible sesgo; pedir validación
        ↓
REGISTRAR en Biblioteca con referencia a Legacy consultado
```

### XII.3 Cuando Legacy y aprendizaje nuevo discrepan

No se elige un ganador automáticamente. Se registra:

- Qué dice el aprendizaje nuevo (datos recientes)
- Qué dice Legacy (experiencia vivida)
- Posibles explicaciones: cambio de entorno, falso éxito, sesgo, contexto no visto

El Business Brain puede presentar al empresario: *"El sistema aprendió X de los últimos resultados, pero la experiencia de 2017 sugiere Y. ¿Qué contexto cambió?"*

---

## XIII. Biblioteca de aprendizajes

La **Biblioteca de aprendizajes** es el repositorio acumulativo de todo aprendizaje post-decisión. **Append-only** — nunca se borra.

### XIII.1 Estructura de cada aprendizaje

| Campo | Descripción |
|-------|-------------|
| **fecha** | Fecha de registro del aprendizaje (puede diferir de fecha de decisión) |
| **contexto** | Situación de mercado, empresa, macro al decidir y al evaluar |
| **decisión** | Qué eligió el empresario |
| **hipótesis inicial** | Snapshot de hipótesis del Business Brain |
| **resultado esperado** | Por sistema y/o empresario |
| **resultado real** | Observado — multi-dimensional |
| **diferencias** | Esperado vs real — dónde divergió |
| **explicación** | Por qué ocurrió la divergencia — mecanismo causal |
| **confianza** | Confianza del aprendizaje mismo — ¿qué tan seguro está el sistema de esta lección? |
| **aplicabilidad futura** | applies_when / does_not_apply_when del aprendizaje |

### XIII.2 Campos adicionales de soporte

| Campo | Descripción |
|-------|-------------|
| tipo_aprendizaje | Éxito confirmado, falso éxito, etc. |
| reglas_afectadas | Qué heurísticas o patrones se ajustaron |
| legacy_consultado | Referencias a experiencias revisadas |
| sesgo_detectado | Si aplica — empresario o sistema |
| valor_real_decisión | Evaluación multi-dimensional |
| horizonte_evaluación | Corto / medio / largo |

### XIII.3 Uso de la Biblioteca

| Consumidor | Uso |
|------------|-----|
| Business Brain | Casos similares al razonar |
| Learning Engine | Detectar fracaso repetitivo; calibrar |
| Legacy Intelligence | Propuesta de nuevas experiencias estructuradas |
| Abstraction Engine | Extraer principios de múltiples aprendizajes |
| Métricas | Calidad de decisiones, precisión creciente |

---

## XIV. Qué nunca debe hacer

| Prohibición | Razón |
|-------------|-------|
| **Nunca borrar historia** | El activo es la memoria acumulada |
| **Nunca olvidar errores** | Los errores son el aprendizaje más valioso |
| **Nunca modificar evidencia** | Integridad del sistema |
| **Nunca reemplazar experiencia por un único caso** | Anti-coincidencia |
| **Nunca cambiar reglas sin suficiente evidencia** | Gradualismo y calibración |
| Nunca castigar al empresario | Aprende del proceso, no juzga |
| Nunca auto-confirmar al sistema | Detectar sesgos propios |
| Nunca aprender sin comparación hipótesis-resultado | No es aprendizaje, es almacenamiento |
| Nunca ignorar Legacy en ajustes | Experiencia humana es ancla |
| Nunca presentar aprendizaje como orden | Calibra conocimiento, no decide |

---

## XV. Ejemplos completos

### Ejemplo 1 — Compra grande que salió mal

**Contexto:** Categoría sanitarios, fase saturación, flete en deriva alcista.  
**Hipótesis del sistema:** Esperar o compra parcial (confianza 0.76). Hipótesis alternativa: adelantar por flete (0.62).  
**Decisión del empresario:** Adelantar compra completa — 3 contenedores.  
**Resultado esperado:** Proteger margen ante flete.  
**Resultado real:** Flete subió 15% — pero competencia liquidó stock; precio de mercado −12%. Sobrestock 10 meses. Margen neto negativo.

| Campo | Valor |
|-------|-------|
| Tipo | Fracaso útil (+ señal de posible sesgo optimismo) |
| Explicación | Mecanismo de flete operó; mecanismo de saturación/precio dominó outcome |
| Aprendizaje | En saturación, protección de flete no compensa riesgo de inventario |
| Ajuste | Debilitar "adelantar por flete" cuando Product = saturación (−0.08) |
| Legacy | Confirma experiencia #147 — fortalecer Legacy, no debilitar |
| Confianza aprendizaje | 0.88 |

---

### Ejemplo 2 — Producto nuevo exitoso

**Contexto:** Perfiles aluminio mamparas — luna de miel, consultas +40%.  
**Hipótesis:** Escalar stock (0.79). Alternativa: piloto cauteloso (0.65).  
**Decisión:** Piloto 1 contenedor + evaluar 60d.  
**Resultado esperado:** Validar rotación sin sobrestock.  
**Resultado real:** Rotación 45d; margen 28%; competidor entró mes 4 pero tarde.

| Campo | Valor |
|-------|-------|
| Tipo | Éxito confirmado |
| Explicación | Piloto permitió escalar con evidencia; luna de miel real |
| Aprendizaje | En luna de miel con incertidumbre de velocidad competencia, piloto > apuesta total |
| Ajuste | Fortalecer heurística piloto en luna de miel (+0.06) |
| Valor real | Económico positivo + opcionalidad preservada |
| Confianza aprendizaje | 0.82 |

---

### Ejemplo 3 — Cambio de proveedor

**Contexto:** Proveedor A subió precio 18%; alternativa B 12% más barato, sin historial.  
**Hipótesis:** Cambiar a B con pedido piloto (0.71). Mantener A negociando (0.68).  
**Decisión:** Cambio total a B por ahorro.  
**Resultado esperado:** Ahorro 12% costo.  
**Resultado real:** Calidad inferior; devoluciones 8%; relación con A rota; costo real +5% vs A.

| Campo | Valor |
|-------|-------|
| Tipo | Fracaso útil |
| Explicación | Optimización de precio ignoró calidad y riesgo de transición |
| Aprendizaje | Cambio de proveedor sin piloto en categoría sensible a calidad = riesgo oculto |
| Ajuste | Fortalecer "piloto proveedor nuevo" (+0.07); Legacy si existe experiencia similar |
| Falso éxito | No — fracaso claro |
| Confianza aprendizaje | 0.90 |

---

### Ejemplo 4 — Campaña de marketing fallida

**Contexto:** Inversión en publicación digital categoría revestimientos.  
**Hipótesis:** Consultas +25% en 60d (0.65). Alternativa: impacto marginal en commoditizado (0.58).  
**Decisión:** Campaña agresiva en precio.  
**Resultado esperado:** Consultas y conversión.  
**Resultado real:** Consultas +8%; conversión sin cambio; categoría commoditizada — cliente decide por distribuidor habitual.

| Campo | Valor |
|-------|-------|
| Tipo | Fracaso útil — posible falso diagnóstico si consultas subieron "por casualidad" |
| Explicación | En commodity, marketing de precio no cambia estructura de decisión |
| Aprendizaje | Patrón abstracto: commoditización → marketing de precio tiene bajo ROI |
| Ajuste | Debilitar supuesto "marketing → consultas" en commodity (−0.06) |
| Confianza aprendizaje | 0.75 (un caso — tentativo hasta replicación) |

---

### Ejemplo 5 — Cliente importante perdido

**Contexto:** Constructora 15% de ventas; competidor ofreció plazo 90d.  
**Hipótesis:** Igualar plazo reduce margen pero retiene (0.70). Perder cliente es costoso (0.82).  
**Decisión:** No igualar plazo — política de caja.  
**Resultado esperado:** Preservar margen y disciplina crediticia.  
**Resultado real:** Cliente perdido; 15% ventas migró; competidor capturó obra relacional.

| Campo | Valor |
|-------|-------|
| Tipo | Mixto — decisión coherente con política; outcome negativo en participación |
| Explicación | Trade-off caja vs participación resuelto por empresario — no "error" de razonamiento |
| Aprendizaje | Registrar trade-off explícito; valor real estratégico negativo, económico de política positivo |
| Ajuste | No debilitar reglas — registrar como decisión de priorización válida |
| Sesgo | No detectado — fue elección consciente |
| Confianza aprendizaje | 0.85 en "documentar trade-off", no en "debilitar plazo" |

---

## XVI. Métricas

El Learning Engine mide la **mejora del sistema y del proceso decisorio** — no volumen de datos.

### XVI.1 Métricas principales

| Métrica | Qué mide | Dirección deseada |
|---------|----------|-------------------|
| **Calidad de decisiones** | Valor real promedio de decisiones evaluadas | ↑ en el tiempo |
| **% hipótesis correctas** | Hipótesis más sólida del sistema vs outcome | ↑ calibración |
| **Velocidad de aprendizaje** | Tiempo entre fracaso repetitivo y cambio de comportamiento | ↓ errores repetidos más rápido |
| **Conocimiento reutilizable** | % aprendizajes con aplicabilidad futura documentada | ↑ |
| **Reducción errores repetidos** | Misma estructura de error — frecuencia en el tiempo | ↓ |
| **Precisión creciente** | Correlación confianza declarada ↔ acierto real | → 1.0 (calibración) |

### XVI.2 Métricas de salud del aprendizaje

| Métrica | Alerta si |
|---------|-----------|
| Tasa de falsos éxitos | > 25% de éxitos clasificados como falsos |
| Aprendizajes tentativos sin replicar | > 40% sin segundo caso en 12 meses |
| Ajustes sin consulta Legacy | > 0% — debe ser cero |
| Decisiones sin outcome registrado | > 30% después de horizonte vencido |
| Sesgos detectados no validados | Acumulación sin respuesta del empresario |

### XVI.3 Métricas de impacto a 10 años

| Métrica | Objetivo conceptual |
|---------|---------------------|
| Decision Quality Index | Mejora sostenida año sobre año |
| Errores catastróficos repetidos | Cero repetición de misma estructura sin intervención |
| Calibración de confianza | Banda ±10% de precisión real |
| Aprendizajes activos en Biblioteca | Crecimiento con alta aplicabilidad futura |
| Transferencia cross-categoría | Aprendizajes aplicados en contextos distintos al origen |

---

## XVII. Relación con otros componentes

| Componente | Relación |
|------------|----------|
| **Business Brain** | Presenta hipótesis; recibe decisión; entrega síntesis — Learning cierra el ciclo |
| **Legacy Intelligence** | Consulta obligatoria; aprendizajes pueden enriquecer experiencias |
| **Abstraction Engine** | Extrae principios de múltiples aprendizajes en Biblioteca |
| **Curiosity Engine** | Aprende qué preguntas fueron útiles; alimenta priorización |
| **Explainability Engine** | Calibración de confianza mejora explicaciones futuras |

---

## XVIII. Cierre

El Learning Engine es lo que convierte Mercadeo IA de un sistema que **acumula** en uno que **mejora**.

No aprende leyendo más. Aprende **comparando** lo que se pensó con lo que ocurrió — con honestidad sobre la suerte, los sesgos y los cambios de entorno.

No borra el pasado. Calibra el futuro.

> *"Aprender no significa recordar más. Significa cometer menos errores importantes con el paso del tiempo."*

El empresario sigue decidiendo.  
El Learning Engine hace que cada decisión — acierto o error — deje una lección que nadie tenga que volver a pagar.

---

*Business Brain – Learning Engine v1.0*  
*Mercadeo IA — Sin implementación.*
