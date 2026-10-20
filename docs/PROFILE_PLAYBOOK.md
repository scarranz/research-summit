# Guía para construir un perfil de empresa (PROFILE PLAYBOOK)

**Para qué sirve.** Esta es la guía paso a paso para **dar de alta una empresa nueva** en el portal o
**reordenar una que ya existe**, sin perder información ni estructura. Dice el orden de las cosas, el
contenido de cada sección, el formato y comportamiento de cada gráfica, cómo se muestran las tablas,
de dónde sale cada número, qué métricas van en cada sección, dónde hay descripciones y dónde no, cómo
funciona la herramienta de Notes, y cómo se lleva una **bitácora** de lo que ya se aprobó y lo que falta.

**Cómo se trabaja.** Claude y el analista avanzan **una unidad a la vez**. Claude propone, construye,
muestra y **pregunta si quedó bien**; nada avanza sin un "aprobado" explícito, y cada aprobación queda
escrita en la bitácora de la empresa (`docs/profiles/<TICKER>.md`). El comando `/build-profile <TICKER>`
corre este protocolo de principio a fin.

**Referencia: Amazon (AMZN).** El perfil de Amazon es el modelo de forma y contenido. Las pestañas que
cubre esta guía son **Overview** y, dentro de **Deep Dive**: **Top Line · Bottom Line · Evolution ·
Valuation · Management**, más **Miscellaneous** como lugar de lo propio de la empresa que no cabe en
ninguna otra pestaña (§15b).

> **Verificado contra el código el 14 oct 2026** (main @ `3667342`, ya con los PRs #140 y #141),
> sección por sección, leyendo `js/overviews/amzn.js` y sus motores — no contra los docs anteriores, que
> se han desviado del código. La guía cita **nombres de función**, no números de línea (se mueven con
> cada PR); donde aparece un número, va con `~` y es solo orientativo.
>
> **Actualizada el 20 oct 2026 con el review de TSMC de SAB (2026-10-19)** — lo que pidió para TSM vale
> para toda empresa: Overview sin color (§8, §21) · trimestres estimados que suman al año (§9.1) · qué
> vende cada segmento y a quién, y qué le compra cada cliente (TL-SEG, TL-CUS) · precio × volumen y
> durabilidad del precio (TL-SEG) · COGS separado de gastos operativos (BL-GEN-2, BL-GEN-5) · tres
> sub-tabs que siempre se proponen en Misc: Competitive position, Capacity → revenue y directorio por
> país (§15b) · directorios agrupados con subtotales (§18) · review después de entregar (§16 paso 7).
> TSM es la primera empresa que construye estas piezas (su bitácora §6c, R1–R8); la que venga después
> copia de TSM.

---

## Índice

**Parte I — El método**
- §0 Reglas de oro
- §1 Qué documento manda cuando dos se contradicen
- §2 El protocolo interactivo (la compuerta de aprobación)
- §3 La bitácora de la empresa
- §4 Los dos modos: empresa nueva · reordenar una existente
- §5 El orden de construcción (y por qué no es el orden de las pestañas)

**Parte II — Las fases**
- §6 Fase 0 — Inventario de datos (+ 6.3 Mapa de métricas Summit, `F0-SM`)
- §7 Fase 1 — Esqueleto y vista previa
- §8 Overview (7 bloques)
- §9 Evolution ▸ Results (el dataset que destraba todo lo demás)
- §10 Top Line (4 sub-tabs)
- §11 Evolution ▸ Estimates
- §12 Evolution ▸ Earnings (Setup · Post-Results · Notes)
- §13 Bottom Line (3 sub-tabs)
- §14 Valuation (4 sub-tabs)
- §15 Management (4 sub-tabs)
- §15b Miscellaneous (lo propio de la empresa)
- §16 Cierre — auditoría final y entrega

**Parte III — Reglas transversales**
- §17 Gráficas
- §18 Tablas
- §19 Texto: dónde sí hay descripciones y dónde no
- §20 Números, unidades y estimados
- §20b Datos en vivo vs datos en archivo ("Live data pending")
- §21 Color
- §21b Selectores de navegación (las barras de arriba)
- §22 Pie de fuentes
- §23 Modales, colapsables y pestañas
- §24 La herramienta de Notes (reglas de uso)

**Anexos**
- A. Defectos conocidos de AMZN — **no copiar**
- B. Matriz de fuentes por pieza
- C. Lista de unidades (IDs) y sus dependencias
- D. Guiones de pregunta para cada compuerta

---

# PARTE I — EL MÉTODO

## §0 Reglas de oro

Estas diez reglas no se rompen nunca. Si una tarea parece exigir romper una, se detiene y se pregunta.

1. **Nunca borrar contenido.** Lo que no encaja se **mueve** a la sección más relevante y se anota en
   el mapa de reubicación de la bitácora (§4). Borrar requiere aprobación explícita y por escrito en la
   bitácora, unidad por unidad.
2. **Nada avanza sin aprobación.** Cada unidad pasa por la compuerta de §2. "Se ve bien" de Claude no
   es aprobación; solo cuenta el "aprobado" del analista, registrado en la bitácora.
3. **Las fuentes deciden, no Claude.** Toda cifra tiene una fuente primaria (10-K/20-F, 10-Q, 8-K,
   proxy, transcripción, modelo Summit, Bloomberg) y queda nombrada en el pie del panel. Un foro, un
   blog o un agregador nunca es la fuente de un dato.
4. **Un motor antes que un panel a medida.** Si un motor del portal ya dibuja eso (`results.js`,
   `segments.js`, `management.js`, `consensus-evolution.js`), se escribe un **archivo de datos**, no
   código nuevo (§17.1).
5. **No inventar pestañas ni sub-tabs.** La estructura es la de AMZN (§5). Una sub-tab existe porque
   hay algo que mostrar; no se publica una sub-tab que solo diga "pendiente".
6. **Sin precisión falsa.** Un estimado se marca como estimado; un dato sembrado a mano (solo de
   filings o Bloomberg, regla 10) se marca como sembrado y con fecha; si se mezclan periodos se dice.
7. **El dato que falta no se rellena.** Si no hay fuente, la pieza se omite o se marca ⛔ bloqueada en
   la bitácora — nunca se aproxima ni se "estima un poco".
8. **Borrador para revisión.** Claude commitea y hace push a una rama propia cuando el analista lo
   pide, pero **no abre el PR** hasta que el analista lo revise en local y lo pida. Una empresa por PR.
   Solo San u Oscar hacen merge.
9. **Todo lo que se ve en el portal va en inglés**, nunca traducido (los términos se pierden): textos,
   etiquetas, notas, pies. Esta guía y la bitácora van en español. (Decisión SAB, 2026-10-13.)
10. **Los datos de mercado van en vivo; los del modelo Summit van congelados en archivo.** Ver §20b.
    En resumen:
    - **En vivo, siempre:** precio, market cap, acciones/deuda para múltiplos, múltiplos de mercado
      (Massive, vía funciones del portal). Ningún precio ni market cap sembrado.
    - **Congelado en archivo, con fecha de snapshot:** **todo número del modelo Summit** (proyecciones
      por snapshot, múltiplo y precio objetivo, supuestos). Claude lo saca **una vez** del MCP de
      Summit, con el mapa F0-SM, y lo escribe en un módulo de datos de la empresa cuyo encabezado dice
      el snapshot y "frozen on purpose, not live". Se refresca volviendo a sacarlo cuando el modelo
      tiene un submit nuevo. **No habrá conexión en vivo a Summit** (decisión SAB, 2026-10-15: no era
      eficiente montar el MCP en vivo) — nada espera a `get-summit-data`.
    - **También en archivo, con fuente y fecha:** lo de los filings (10-K/10-Q/8-K/20-F/6-K/proxy) y lo
      de Bloomberg (`BBG_CONSENSUS.txt`, exports SPLC), porque no hay conexión directa.
    - **Si un dato en vivo de mercado todavía no tiene camino** (función sin desplegar): **no** se
      siembra "mientras tanto". La parte que falta muestra **"⚑ Live data pending — <qué falta>"**;
      si la unidad depende por completo de ese dato, queda ⛔ y no se publica (regla 5). Detalle en §20b.
    (Decisiones SAB, 2026-10-13 y 2026-10-15.)

## §1 Qué documento manda cuando dos se contradicen

| Para | Manda |
|---|---|
| El **proceso** (orden, compuertas, bitácora) y las **reglas de contenido** de cada unidad | **Esta guía** |
| El **detalle técnico** de un motor (contrato de datos campo por campo) | `RESULTS_CONVENTIONS.md` (Results/Estimates), `PANE_CATALOG.md` §1 (segments), `CHART_ENGINE_REFERENCE.md` (charts) |
| La forma final de algo que esta guía no cubre | **AMZN tal como se ve en pantalla** (abrir AMZN en el portal local y leer el DOM), no los docs |
| Un defecto de AMZN listado en el **Anexo A** | **Esta guía**: el defecto no se copia |

Los docs anteriores (`COMPANY_PROFILE_BLUEPRINT.md`, `PANE_CATALOG.md`, `OVERVIEW_CONVENTIONS.md`,
`EARNINGS_CONVENTIONS.md`) siguen siendo útiles como referencia técnica, pero **tienen desviaciones
conocidas** respecto al código. Cuando contradigan esta guía, gana esta guía, y Claude lo anota en la
bitácora para corregir el doc después (no en el mismo PR de la empresa).

## §2 El protocolo interactivo — la compuerta de aprobación

### 2.1 Qué es una "unidad"

Una **unidad** es la pieza más pequeña que el analista puede juzgar de un vistazo: un bloque del
Overview, una sub-tab del Deep Dive, o una fase de Earnings. El Anexo C las lista con su ID
(p. ej. `OV-1 Key Facts`, `TL-SEG Segments`, `EV-NOTES Notes`). **Se aprueba unidad por unidad**, nunca
una sección entera de golpe.

### 2.2 El ciclo de cada unidad (seis pasos, siempre en este orden)

```
 ① PROPONER ──► ② CONSTRUIR ──► ③ MOSTRAR ──► ④ AUTOAUDITAR ──► ⑤ PREGUNTAR ──► ⑥ REGISTRAR
      ▲                                                               │
      └──────────────────────── 🔁 cambios pedidos ◄─────────────────┘
```

**① PROPONER** (antes de escribir una sola línea). Claude le presenta al analista, en lenguaje simple:
- qué va a contener la unidad (lista de bloques, métricas, controles), copiado de la ficha de esta guía;
- de dónde saldrá cada dato (fuente concreta: "10-K FY2025, Nota 10", "Summit DCF snapshot 2026-08-04");
- qué decisiones son del analista (p. ej. qué KPIs, qué peers, qué rating) — con una propuesta de
  Claude para cada una, para que el analista solo confirme o corrija;
- qué **no** va a tener y por qué (dato inexistente, regla de la guía).

Si la unidad tiene decisiones del analista, **se espera su respuesta antes de construir**. Si no tiene
ninguna, Claude puede pasar directo a ② y lo dice.

**② CONSTRUIR.** Claude escribe el archivo de datos o el panel siguiendo la ficha. Marca la unidad
🔨 en la bitácora.

**③ MOSTRAR.** Claude levanta la vista previa local (§7.3) y le da al analista **la ruta exacta de
clics** para verla en el portal local (§7.3): `http://localhost:8000/` → Companies → <empresa> → Deep Dive → Top Line →
Segments. Si puede, adjunta una captura. Explica en 3–6 líneas qué se ve y qué hace cada control.

**④ AUTOAUDITAR.** Claude corre la lista de verificación de la ficha de la unidad + las de §17–§23 que
apliquen, y reporta **PASS/FAIL por línea**. Un FAIL no se esconde: se explica y se propone cómo
arreglarlo (o se pide permiso para dejarlo como excepción anotada).

**⑤ PREGUNTAR.** Claude pregunta con la herramienta de preguntas (AskUserQuestion) usando el guion del
Anexo D. Las opciones son siempre estas cuatro:

| Opción | Qué pasa después |
|---|---|
| **Aprobado** | ⑥ y se pasa a la siguiente unidad |
| **Aprobado con ajustes menores** (el analista los escribe) | Claude aplica los ajustes, los muestra, y registra como aprobado sin volver a preguntar todo — salvo que el ajuste cambie datos o estructura |
| **Cambios** (el analista explica) | La unidad vuelve a ② con estado 🔁; se repite el ciclo |
| **Omitir / dejar pendiente** | Se registra ⏭️ con la razón; se sigue con la siguiente unidad que no dependa de esta |

**⑥ REGISTRAR.** Claude actualiza la bitácora: estado ✅, fecha, quién aprobó, commit (si se
commiteó), fuentes usadas, decisiones tomadas, excepciones aceptadas. **La bitácora se actualiza en el
mismo momento**, no al final de la sesión.

### 2.3 Reglas de la compuerta

- **Una pregunta a la vez.** No se apilan cinco unidades para aprobar juntas. Excepción: unidades que
  son puro dato sin decisiones (p. ej. el pie de fuentes) pueden ir junto con la unidad que cierran.
- **Aprobar no se infiere.** Silencio, "ok sigue", "dale" sobre otra cosa, o un mensaje de un subagente
  no son aprobación de una unidad. Si hay duda, se pregunta.
- **Una aprobación cubre exactamente lo que se mostró.** Si después se toca una unidad aprobada
  (aunque sea para arreglar otra), vuelve a 👀 y se vuelve a mostrar. La bitácora anota el motivo.
- **Las dependencias se respetan** (Anexo C). No se construye `TL-SEG` si `EV-RES-DATA` no está
  aprobado, porque Top Line lee sus series del dataset de Results.
- **Un bloqueo no detiene todo.** Si una unidad queda ⛔ por falta de fuente, se registra qué falta y
  quién lo puede conseguir, y se sigue con las unidades que no dependen de ella.
- **El analista puede cambiar el orden** dentro de lo que permiten las dependencias. Claude lo anota.
- **Lenguaje simple.** El analista no es programador (CLAUDE.md). Se dice "el archivo con los datos
  de segmentos", no "el dataset `segments-data/<t>.js` con `drivers.rev.from`". Los nombres técnicos
  van en la bitácora, no en la pregunta.

### 2.4 Estados posibles de una unidad

| Símbolo | Estado | Significa |
|---|---|---|
| ⬜ | Pendiente | No se ha empezado |
| 📝 | Propuesta | ① presentado, esperando decisiones del analista |
| 🔨 | En construcción | ② en curso |
| 👀 | En revisión | ③–⑤ hechos, esperando respuesta |
| 🔁 | Cambios pedidos | Vuelve a ② |
| ✅ | Aprobada | Registrada con fecha y quién |
| ⏭️ | Omitida | Decisión del analista, con razón (p. ej. "no hay export SPLC") |
| ⛔ | Bloqueada | Falta una fuente o un permiso (p. ej. desplegar una función) — se dice qué y quién |

## §3 La bitácora de la empresa

### 3.1 Dónde vive y por qué ahí

`docs/profiles/<TICKER>.md`, en la **misma rama** que el perfil. Se crea copiando
`docs/profiles/_TEMPLATE.md` en la Fase 0. Vive en el repo (no en el chat ni en la memoria de Claude)
porque:
- sobrevive entre sesiones y entre personas — otra sesión de Claude o San/Oscar retoman leyéndola;
- viaja dentro del PR, así el revisor ve qué se aprobó, cuándo y con qué excepciones;
- es la "fuente de verdad" del estado: si la bitácora dice ⬜, la unidad no está hecha, aunque haya
  código.

### 3.2 Qué contiene (en este orden)

1. **Cabecera** — ticker, nombre, modo (nueva / reordenar), rama, analista responsable, fecha de
   inicio, contador "N de M unidades aprobadas".
2. **Inventario de datos (Fase 0)** — la tabla de §6.2, con lo que existe y lo que no.
3. **Tablero de unidades** — una fila por unidad del Anexo C, con estado, fecha, quién aprobó, commit,
   nota corta. Todas las filas existen desde el día uno (en ⬜), así siempre se ve lo que falta.
4. **Decisiones** — cada decisión del analista (peers elegidos, KPIs, rating de un ejecutivo, base
   GAAP vs ajustada…), con fecha y el porqué. Solo se agrega, nunca se borra; si una decisión cambia,
   se agrega una nueva línea que reemplaza la anterior y la cita.
5. **Excepciones aceptadas** — cada FAIL de la autoauditoría que el analista aceptó dejar, con razón.
6. **Mapa de reubicación** (solo modo B) — §4.2.
7. **Bloqueos y preguntas abiertas** — qué falta, quién lo consigue, desde cuándo. Y aparte,
   **Conexiones pendientes**: bloques aprobados que muestran "Live data pending" (§20b).
8. **Historial de aprobaciones** — una entrada por cada paso por la compuerta, **solo se agrega**
   (append-only), la más reciente al final: fecha · unidad · resultado · qué se mostró · fuentes ·
   cambios pedidos.

### 3.3 Reglas de la bitácora

- Claude la **lee completa al empezar cada sesión** sobre esa empresa, antes de tocar nada, y le
  resume al analista dónde quedaron ("van 9 de 38; la siguiente es TL-OTH; hay 1 bloqueo").
- Se actualiza **en cada ⑥**, no en lote al final.
- Las fechas son absolutas (`2026-10-13`), nunca "ayer".
- Si el código y la bitácora no coinciden (p. ej. alguien tocó una unidad aprobada fuera del
  proceso), Claude lo dice, no lo "arregla" en silencio.
- La bitácora **no** reemplaza el pie de fuentes del panel: el lector del portal nunca la ve.

## §4 Los dos modos

### 4.1 Modo A — empresa nueva

Se sigue §5 de principio a fin. La empresa empieza sin Overview ni Deep Dive; cada unidad se crea
desde cero copiando la forma de AMZN (§17.1: copiar el código de AMZN, no reimplementarlo).

### 4.2 Modo B — reordenar una empresa existente (sin perder nada)

El riesgo aquí no es construir mal, es **perder** algo. Por eso hay tres pasos extra **antes** de la
Fase 1, cada uno con su compuerta:

**B1 — Inventario de lo que existe.** Claude recorre el módulo de la empresa (`js/overviews/<t>.js` y
sus archivos hermanos) y lista **cada pieza de contenido visible**: cada pestaña, sub-tab, bloque,
gráfica, tabla, tarjeta, modal, texto largo y constante de datos, con `archivo:función`. También abre
la empresa en el portal local y cuenta lo que se ve (no solo lo que dice el código). Resultado: una tabla
numerada en la bitácora. Ese número es el **conteo de control**.

**B2 — Mapa de reubicación.** Para cada pieza, un destino en la estructura de AMZN:

| # | Pieza original (archivo:función) | Destino (sección ▸ sub-tab ▸ bloque) | Cómo | Estado |
|---|---|---|---|---|
| 1 | `uber.js:financialsBody` "Margins" | Bottom Line ▸ General ▸ Profitability & margins | reemplazada por la versión AMZN; el texto original pasa a la nota del panel | ⬜ |
| 2 | `uber.js:historyBody` timeline | Overview ▸ Timeline | se adapta al formato (§8 OV-7) | ⬜ |
| 3 | `uber.js:fleetBody` (no tiene equivalente) | Top Line ▸ Segments ▸ Mobility ▸ KPIs | se conserva tal cual dentro de la sub-tab | ⬜ |

(Ejemplo ilustrativo: los nombres de función de UBER son inventados para mostrar el formato.)

Reglas del mapa:
- **Toda pieza tiene destino.** No existe la columna "se elimina". Si algo de verdad sobra (duplicado
  exacto de otra pieza), el destino es "fusionada con #N" y se pide aprobación específica.
- Una pieza sin equivalente en AMZN va **dentro** de la sub-tab más relevante, no a una sub-tab nueva.
  Si de verdad no cabe en ninguna, va a **Miscellaneous** (§15b), con aprobación (nunca se inventa una
  sub-tab en otra sección).
- El contenido viejo que se reemplaza por una versión mejor (p. ej. una gráfica a medida reemplazada
  por el motor de Results) conserva su **texto y sus datos**: el texto pasa a la nota o al colapsable
  del panel nuevo; los datos, al archivo de datos.

El analista aprueba el mapa completo antes de mover nada.

**B3 — Conciliación al final.** En §16 se vuelve a contar. Cada fila del mapa debe estar ✅ y el
conteo de control debe cuadrar (piezas originales = piezas reubicadas + fusionadas aprobadas). Si no
cuadra, no se entrega.

Durante el modo B se mueve **por unidad de destino**, siguiendo el mismo orden de §5 y la misma
compuerta. Una pieza movida se muestra en su destino y se aprueba ahí.

## §5 El orden de construcción

Las pestañas **se muestran** en el orden de AMZN, pero **se construyen** en el orden de las
dependencias de datos. Estas dos tablas no son iguales a propósito.

**Orden en pantalla (fijo, igual que AMZN):**

```
Perfil:     Overview · Deep Dive · Pillars · Resources
Deep Dive:  Top Line · Bottom Line · Evolution · Valuation · Management (· Miscellaneous)
  Top Line:     General · Segments · Other · Customers
  Bottom Line:  General · Segments · Supply Chain
  Evolution:    Earnings (Setup · Post-Results · Notes) · Results · Estimates
  Valuation:    Historic Multiple · Peers · Target Multiple / PEG · Sensitivity Analysis
  Management:   Executives & Board · Ownership · Governance & SBC · Track Record
```

Claves internas (no cambiarlas — el código las usa): secciones `data-dd` = `topline`, `bottomline`,
`evolution`, `valuation`, `mgmt`; sub-tabs `data-ovst` = `segov`, `segdrv`, `segoth`, `segcus` ·
`margins`, `segments`, `supplychain` · `earnings`, `results`, `estevo` · `histmult`, `peers`,
`targetmult`, `sensitivity` · `team`, `ownership`, `governance`, `track`. (SN usó `management` en vez
de `mgmt` — no repetirlo.)

**Orden de construcción:**

| Paso | Fase | Por qué en este lugar |
|---|---|---|
| 0 | Inventario de datos (§6) | Decide qué es posible; sin esto no se promete nada |
| 0b | Mapa de métricas Summit (§6.3) | Toda unidad que use Summit lee del mapa; sin él, nadie sabe qué es cada etiqueta |
| 1 | Esqueleto + vista previa (§7) | Para poder mostrar cada unidad desde el principio |
| 2 | Overview (§8) | No depende de nada; es la cara del perfil |
| 3 | Evolution ▸ Results — **el dataset** (§9) | Top Line, Estimates, Earnings Setup y Historic Multiple leen de aquí |
| 4 | Top Line (§10) | Sus series de segmentos apuntan al dataset de Results |
| 5 | Evolution ▸ Estimates (§11) | Mismo archivo de datos que Results, bloque `evolution` (Summit congelado, regla 10) |
| 6 | Evolution ▸ Earnings (§12) | Necesita el consenso por trimestre y las transcripciones |
| 7 | Bottom Line (§13) | Necesita el export de Bloomberg |
| 8 | Valuation (§14) | Necesita el dataset de Results/consenso, los peers y el modelo Summit congelado (Target Multiple, Sensitivity) |
| 9 | Management (§15) | Independiente; puede adelantarse si el analista quiere |
| 9b | Miscellaneous (§15b) | Solo si quedó algo propio de la empresa sin lugar; al final, cuando ya se sabe qué sobra |
| 10 | Cierre (§16) | Auditoría completa + conciliación (modo B) + entrega |

Management no depende de nada: si el analista quiere variar, se puede hacer en cualquier momento
después del paso 1.

---

# PARTE II — LAS FASES

Cada ficha de unidad tiene siempre la misma forma:
**Responde** (la pregunta del lector) · **Referencia AMZN** · **Tipo** (motor / datos / a medida) ·
**Contenido, de arriba a abajo** · **Gráfica y tabla** · **Texto** · **Fuentes** · **Qué decide el
analista** · **Si falta el dato** · **No copiar de AMZN** · **Verificación**.

## §6 Fase 0 — Inventario de datos (unidad `F0`)

### 6.1 Qué se revisa (Claude lo hace solo, sin construir nada)

| # | Pregunta | Cómo se verifica |
|---|---|---|
| 1 | ¿La empresa existe en la tabla `companies`? | Abrir el portal → Companies. Si no, el analista la agrega con "Add Company" (no Claude por SQL) |
| 2 | ¿Qué forma presenta: 10-K o 20-F? Último número de acceso | EDGAR (no se infiere del país) |
| 3 | ¿Existe modelo Summit DCF? ¿Cuántos snapshots? **¿Último periodo real de cada uno?** Si existe → unidad F0-SM (§6.3) | MCP Summit: `search_ticker`, `list_dcf_models`, `list_snapshots`; el nombre del snapshot no dice qué trae |
| 4 | ¿Está el ticker en el consenso de Bloomberg? ¿Cuántos snapshots y de qué fecha el último? | `<letra>:\My Drive\Summit\Docs\0\BBG_CONSENSUS.txt` (archivo) + `Consensus_Portal.xlsm` (hoja `CONSENSUS`, la viva) — fuera del repo; es la unidad de Drive del equipo, la letra cambia por máquina. `py scripts/consensus/inspect_matrix.py <TK>` lo lista (§9.1). Al 17 sep 2026: AMZN, GOOGL, LYFT, META, NVDA, UBER (30 c/u), SN, SPOT, TBBB (10 c/u). **Si no está** (caso DHR), no hay consenso, ni `estMatrix`, ni export de Bottom Line: anotarlo y pedirle al analista que lo agregue al workbook antes de EV-RES-DATA |
| 5 | ¿Hay historia de precio, acciones y deuda en vivo? (Historic Multiple, §14) | `get-market-history` desplegada (hoy da 404 si no). Los múltiplos congelados de BBG que usó SN **ya no se aceptan** (regla 10) |
| 6 | ¿La empresa es "sujeto" en un export SPLC (clientes / proveedores)? | `nvidia-map-reference/`, `robotics-research/`, exports en Drive |
| 7 | ¿Hay transcripciones de llamadas? ¿Cuáles trimestres? | `docs/calls/<TICKER>*.md`; MCP Quartr (`list_events`, `read_transcript`) |
| 8 | ¿Está en el plan de Fiscal.ai (tabla de ejecutivos e insiders)? | Pillars ▸ Management de la empresa en el portal |
| 9 | ¿Massive devuelve precio y market cap? | `liveQuote(ticker)` en la vista previa |
| 9b | ¿El MCP ya trae la valuación del modelo (múltiplo objetivo, precio objetivo) y el último submit del workbook? | `get_valuation_history` (§6.3) y `list_snapshots`; comparar contra la hoja Output del workbook. Summit **no** va en vivo: se congela en archivo (regla 10, §20b) |
| 10 | ¿Hay fotos de ejecutivos e imágenes de productos? | `img/leadership/`, `img/products/` (opcional; si no, iniciales / emoji) |
| 11 | Año fiscal: ¿cierra en diciembre? Moneda de reporte | 10-K. **Si no es calendario o no es USD, se anota**: varios componentes asumen año calendario (§14) y USD |
| 12 | Modo B: ¿qué contenido existe hoy? | §4.2 B1 |

### 6.2 Qué entrega (tabla en la bitácora)

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Filing anual | 10-K FY2025, acc. … | | Overview, Top Line, textos verbatim | todo |
| Summit DCF | sí, 7 snapshots, último real 2Q26 | | el mapa F0-SM; y, congelado en archivo, la serie Summit en Results/Top Line/Bottom Line/Setup, Estimates, Target Multiple y Sensitivity | Estimates, Target Multiple, Sensitivity (⏭️) |
| BBG_CONSENSUS | sí, 10 snapshots | | consenso en Results, Earnings Setup, Bottom Line, Historic Multiple | Bottom Line forward, Setup grid |
| … | | | | |

Y una **escalera de capacidades** concreta para esta empresa (qué sub-tabs podrá tener y cuáles no),
derivada de §9.3 y de las fichas. Ejemplo: "DHR no tiene modelo Summit → Estimates, Target Multiple y
Sensitivity no se pueden construir; Results sí (actuals + consenso)".

**Compuerta F0:** el analista confirma el inventario y el alcance. Esto fija qué unidades quedan ⏭️
desde el principio (con su razón) — así el tablero nunca promete algo imposible.

### 6.3 Mapa de métricas Summit (unidad `F0-SM`)

**Por qué existe.** El MCP de Summit guarda los datos de cada modelo con las etiquetas que puso quien
lo armó, y **no hay un catálogo común**: el catálogo "universal" del MCP está vacío. Verificado el
14 oct 2026: `compare_companies_metric` responde `metric_not_in_universal_catalog` para Revenue,
EBITDA y Earnings. Homologar los modelos no es realista, así que **se explica cada empresa una vez, al
darla de alta**. Ese mapa es lo que permite que el portal lea Summit **sin IA**: el código busca
`rev` en el mapa, ve que en este modelo se llama `REV`, y lo pide. Ningún número va en el mapa; solo
nombres, definiciones y unidades.

**Qué no se puede creer del MCP** (por eso el mapa se escribe a mano y no se deriva):
- **Unidades y agregación.** Todas las métricas dicen `USD · millions · sum`, incluso `TAX_RATE`,
  `SHARES` o `USERS`. La unidad real se determina mirando el valor y el modelo.
- **Moneda.** La moneda del modelo viene en `list_dcf_models` (SPOT en EUR, TBBB en MXN), no en la
  métrica.
- **GAAP o ajustado.** El nombre no lo dice: en AMZN `EARNINGS` es utilidad **ajustada**; UBER tiene
  `GAAP_NET_INCOME` y SOFI `NET_INCOME_GAAP`.
- **Nombres opacos.** En AMZN `OPINC` / `OPINC2` / `OPINC3` son la utilidad operativa GAAP de North
  America / International / AWS. Se confirmó porque EBITDA del segmento − D&A del segmento cuadra al
  dólar; el nombre no lo dice.
- **`description` y `category` vienen vacíos** en todas las métricas.

**Cuándo se hace:** justo después de F0 y **antes de cualquier unidad que use Summit** (EV-RES-DATA,
EV-EST, EV-SET, Bottom Line, VA-TM, VA-SENS). No depende de F1.

**① Proponer — Claude lo prepara solo:**
1. `list_dcf_models` → moneda, escala, número de snapshots y fechas.
2. `list_metrics <TICKER>` → la lista completa de etiquetas.
3. `get_fundamentals` del último snapshot (y de uno viejo) → valores de muestra, qué periodos trae cada
   etiqueta (anual, trimestral) y de qué hoja (`projection_history`, `actuals_history`).
4. Cada etiqueta se clasifica en **un** rol:

| Rol | Qué es | Ejemplos |
|---|---|---|
| `core` | Las métricas que todos los perfiles usan, con **clave fija del portal** | `rev`, `ebitda`, `opinc`, `earnings`, `eps`, `shares`, `capex`, `cfo`, `fcf`, `dna`, `tax_rate`, `int_exp`, `int_inc`, `sbc` |
| `segment` | Ingreso, utilidad, EBITDA, capex o D&A de un segmento | AMZN `AWS`, `OPINC3`; UBER `MOBILITY_REVENUE`; NVDA `DC_REVENUE` |
| `kpi` | Métrica operativa propia de la empresa | UBER `ORDERS`, `USERS`; SOFI `MEMB` |
| `guidance` | Guía de la empresa (bajo / alto) | UBER `EBITDA_LOW_GUIDANCE` / `_HIGH_` |
| `consensus` | Consenso de Bloomberg que trae el modelo | `REV_BBG_EST`, `EBITDA_BBG_EST` |
| `ignore` | Auxiliar del modelo, no se muestra | se dice por qué |

**La valuación del modelo no es una etiqueta: viene aparte, con campos fijos.** Desde el 14 oct 2026
el MCP la sirve con su propia herramienta, `get_valuation_history(ticker, method?)` (Claude la congela
en archivo, regla 10). No aparece en `list_metrics`, así que
**no se mapea**: los campos son los mismos en todos los modelos. Por cada snapshot, más nuevo primero:
- del snapshot: `snapshot_date`, `after_quarter` ("Q2 - 2026"), `current_price` (precio ese día),
  `wacc`, `coe`, `cod`, `beta`, `rfr`, `avg_market_return`, `equity_to_total_capital`;
- `valuations[]`, **un bloque por método**: `method` (texto del workbook: "EV / EBITDA", "P / E"),
  `case` ("Base"), `multiple`, `target_year` (año al que se aplica el múltiplo, p. ej. 2027),
  `multiple_basis` ("Forward"/"Trailing"), `price_target`, `fair_value`, `upside_pct`
  (= `fair_value` ÷ `current_price` − 1, ya calculado: no recalcular) y `quality_flags`.

Reglas: los números llegan como texto y las tasas como decimales (0.155 = 15.5 %); la moneda es la del
modelo (`list_dcf_models`); los nombres de `method` y `case` se muestran tal cual; **un bloque con
`quality_flags` no vacío no es confiable** (p. ej. un método copiado del otro) y solo se muestra con la
advertencia. Lo único que se revisa por empresa en F0-SM es la **calidad** (va a "Dudas"):

```
❓ <TICKER> · valuación — <qué falla> (p. ej. LYFT: P/E idéntico a EV/EBITDA, quality_flags)
   Mientras tanto: <qué no se muestra>   ·   Quién responde: autor del modelo / Oscar
```

Estado al 14 oct 2026 (Oscar): con valuación AMZN, CART, NVDA, SPOT, UBER; TBBB solo P/E confiable
(EV/EBITDA mezcla Bull y Base); LYFT no confiable (P/E copia EV/EBITDA); sin valuación MA, META, SOFI.

5. **Verificación contra el filing:** para cada `core` y cada `segment`, el valor real de **un**
   periodo cerrado contra el 10-K/10-Q, con diferencia. Si no cuadra, la etiqueta queda ❓.

**② Construir — dos piezas:**

**(a) La explicación**, en la bitácora (sección "Mapa Summit"), una fila por etiqueta:

| Etiqueta MCP | Rol | Clave portal | Qué es, en una línea | Base | Unidad real | Agregación | Periodos | Cuadre vs filing | Confianza |
|---|---|---|---|---|---|---|---|---|---|
| `OPINC3` | segment | `seg.aws.opinc` | Utilidad operativa de AWS | GAAP | USD M | suma | Q y A, <rango> | FY25: <modelo> vs 10-K <filing> → Δ 0 ✔ | ✔ |
| `EARNINGS` | core | `earnings` | Utilidad neta **ajustada** del modelo | ajustada | USD M | suma | A | no aplica (ajustada) | ✔ |
| `TAX_RATE` | core | `tax_rate` | Tasa efectiva | — | % | promedio | A | — | ❓ ¿efectiva o estatutaria? |

- **Unidad real:** `USD M` · `% ` · `x` (múltiplo) · `$/acción` · `acciones M` · `unidades M` (o la
  que sea), y la moneda si no es USD.
- **Agregación:** `suma` (flujos), `promedio` (tasas, márgenes), `fin de periodo` (saldos, acciones,
  usuarios). Define cómo se arma un anual a partir de trimestres, o si no se puede.
- **Confianza:** ✔ verificado · ❓ duda abierta (va a "Dudas") · ⚠ verificado pero con advertencia
  (p. ej. cambio de definición entre snapshots).

**(b) El archivo que lee el portal:** `js/summit-map/<ticker>.js`, generado de la tabla aprobada:

```js
export var summitMap = {
  ticker: 'AMZN', currency: 'USD', scale: 'millions',
  approved: '2026-10-14',                       // fecha de la compuerta F0-SM
  core: {
    rev:      { mcp: 'REV',      base: 'GAAP',     unit: 'usd_m',  agg: 'sum' },
    earnings: { mcp: 'EARNINGS', base: 'adjusted', unit: 'usd_m',  agg: 'sum' },
    shares:   { mcp: 'SHARES',   base: 'diluted',  unit: 'shares_m', agg: 'end' },
    tax_rate: { mcp: 'TAX_RATE', base: null,       unit: 'pct',    agg: 'avg' }
  },
  segments: [
    { key: 'aws', label: 'AWS', rev: 'AWS', opinc: 'OPINC3', ebitda: 'AWS_EBITDA',
      capex: 'AWS_CAPEX', dna: 'AWS_DNA' }
  ],
  kpis: [], guidance: [], consensus: { rev: 'REV_BBG_EST', ebitda: 'EBITDA_BBG_EST' },
  // La valuación no se mapea (campos fijos, get_valuation_history). Solo se anota qué métodos
  // no son confiables para esta empresa, para que el portal los muestre con la advertencia.
  valuationUnreliable: [],                       // p. ej. LYFT: ['P / E']
  ignore: []
};
```

Reglas del archivo: las claves de `core` son **las mismas en todas las empresas** (si una no existe en
el modelo, no se pone, y el componente que la necesita se deshabilita con la razón); `label` va en
inglés, como el resto del portal; **ningún valor numérico**.

**El archivo no lo importa el portal.** Es el diccionario que usa Claude al congelar los números
Summit (regla 10, §20b): dice qué etiqueta del MCP es cada línea, en qué unidad y con qué signo. La
carpeta `js/summit-map/` la crea la primera empresa; el archivo **no se registra** en ningún lado.

**Dudas — la parte que no se salta.** Toda etiqueta ❓ va a la sección "Dudas" de la bitácora con
este formato, y **se resuelve antes de usarla**:

```
❓ AMZN · TAX_RATE — ¿tasa efectiva o estatutaria? ¿Sobre utilidad GAAP o ajustada?
   Lo que se ve: <valores por año>; no coincide con la tasa efectiva del 10-K de FY25 (<x>%).
   Quién responde: autor del modelo (<nombre>) — se le pregunta con la celda del .xlsm.
   Mientras tanto: no se usa en Bottom Line ▸ Normalized.
   Respuesta (AAAA-MM-DD): …
```

Quién responde cada tipo: **qué es una etiqueta y su base** → el autor del modelo (el .xlsm en
`G:\My Drive\Summit\Docs\Research\DCF\<Sector>\<TICKER>\`); **cuadre contra el filing** → Claude, con
el documento; **si se muestra o no** → el analista.

**③④ Mostrar y autoauditar:** la tabla completa, el conteo (`N etiquetas: x core · y segment · z kpi
· … · d dudas`), los cuadres, y el archivo `summit-map/<ticker>.js`. Autoauditoría: toda etiqueta
de `list_metrics` aparece en el mapa (también las `ignore`) · cada `core` y `segment` tiene cuadre o
razón · ninguna unidad copiada del MCP sin revisar · valuación revisada (métodos, `target_year`,
`quality_flags`) · ningún número en el archivo.

**⑤ Compuerta F0-SM:** el analista aprueba el mapa. Una etiqueta ❓ puede quedar abierta solo si
ninguna unidad la usa todavía; se anota en "Bloqueos".

**Mantenimiento — cada submit nuevo.** Al aparecer un snapshot nuevo, Claude compara `list_metrics`
contra el mapa: etiqueta nueva → se clasifica y se pregunta; etiqueta que desapareció → aviso, porque
el portal dejará de encontrarla; mismo nombre con valores que saltan de escala (×1000) o de signo → ❓.
El cambio entra al mapa con su fecha; no se edita en silencio.

## §7 Fase 1 — Esqueleto y vista previa (unidad `F1`)

### 7.1 Rama y archivos

0. **Qué manda.** Para una empresa nueva manda esta guía. Si `CLAUDE.md`, el comentario de
   `js/overviews/index.js` o un doc viejo dicen otra cosa, se sigue la guía y se anota la diferencia en
   la bitácora. **No usar `/fill-overview`** para una empresa nueva: su contenido ya está en §8.
1. `git checkout main && git pull origin main && git checkout -b feat/<ticker>-profile`
   (modo B: `feat/<ticker>-restructure`).
2. Copiar `docs/profiles/_TEMPLATE.md` → `docs/profiles/<TICKER>.md` y llenar cabecera + inventario.
3. Crear `js/overviews/<ticker en minúsculas>.js` (o, en modo B, trabajar sobre el existente). Se arma
   **copiando `amzn.js`** y quitando lo que todavía no se construye. Exporta:
   ```js
   export var <t>Overview = { html, init, headerSources };          // al principio
   // y, desde que la primera sub-tab del Deep Dive está aprobada:
   export var <t>Overview = { html, init, headerSources, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
   ```
   - **`deepDive` no se exporta** hasta que exista la primera sub-tab aprobada: sin él, el portal no
     muestra la pestaña Deep Dive (regla 5: nada vacío a la vista).
   - `headerSources` pinta los botones de IR y EDGAR en la cabecera del perfil (AMZN: `ceHeaderSources`).
   - `absorbsPillars: true` (opcional) oculta la pestaña Pillars. **AMZN no lo usa** (Pillars queda
     visible); seguir a AMZN salvo que el analista decida otra cosa.
4. Registrar en `js/overviews/index.js`: `import { <t>Overview } from './<t>.js';` + `<TICKER>:
   <t>Overview` en `OVERVIEWS`.
5. **Los demás registros** se hacen cuando llega su unidad (no antes), y están en cada ficha:

| Archivo | Qué se registra | Unidad |
|---|---|---|
| `js/results.js` | `import` de `<t>Results` y `<T>_SETUP` + entradas `<T>` y `<T>_SETUP` en `RESULTS_DATA` | EV-RES-DATA · EV-SET |
| `js/segments.js` | `import` de `<t>Segments` + entrada en `SEGMENTS_DATA`; `import` de `themes-data/<t>.js` + entradas en `THEME_SRC` y `THEME_SEG` | TL-GEN · EV-NOTES |
| `<t>.js` `deepDiveHtml` | botón `.dd-tab` / `.ovt-subtab` + su `.ovt-subpane` | cada sub-tab |
| `<t>.js` `aBuildSub` | la rama `dd==='…' / key==='…'` que construye la gráfica | cada sub-tab con gráfica |
| `<t>.js` `deepDiveInit` | el atributo del encabezado colapsable en la lista `SELF`, si el módulo nuevo maneja su propio colapsable (§23) | la que lo traiga |
| `<t>.js` `wireModal` → `resolve()` | la rama del tipo `data-detail="<tipo>:<id>"` (p. ej. `exec:` de Track Record) | la que use modal |

### 7.2 El armazón — `html()`, `init()` y el Deep Dive

**Overview (`html` / `init`).** Copiar de `amzn.js`:
- `html(c)` = `<div class="ov ov-<t>" data-brand="<T>" style="--brand-2:var(--steel);--brand-soft:rgba(37,99,235,0.08)">`
  + `stdOverviewBody(c)` + el modal (`#<t>ModalBack`, `#<t>ModalX`, `#<t>ModalT`, `#<t>ModalB`).
  Las dos variables `--brand-2` y `--brand-soft` **se copian tal cual**: son tokens neutros de Summit,
  no el color de la empresa (§21).
- `init(c)`, en este orden: `wireModal(root)` → manejador de `.ov-collap-h` → manejador de `.acc-h`
  → pastillas `[data-gmm]` → `wireScatters(root)` → `aLiveOne(root,'<T>')` → subir el modal a
  `#co-detailview`.

**Deep Dive.** Copiar `deepDiveHtml`, `wireDD`, `aBuildSub` y `deepDiveInit`:
- la barra de secciones `.dd-tabs > button.dd-tab[data-dd=…]` y los paneles `.dd-pane[data-dd=…]`;
- dentro de cada panel, `.ovt-subtabs > button.ovt-subtab[data-ovst=…]` y `.ovt-subpane[data-ovst=…]`;
- el despachador perezoso `aBuildSub(root, dd, key)` que construye cada gráfica **solo cuando su
  sub-tab se vuelve visible**, dentro de `requestAnimationFrame`;
- `deepDiveInit`: `wireDD` → `wireModal` → `<T>_MGMT.init(root)` (cuando exista Management) → el
  manejador global de `.rs-collap-h` con su lista `SELF` → construir la sub-tab visible.

**Al copiar, cambiar siempre:**
- la clase raíz `.ov-amzn-dd` → `.ov-<t>-dd` (la usan `wireDD` y `ceEqualizeTabBars` como selector);
- **no copiar `ceResultsPending`** ni el patrón `segmentsHtml('AMZN')||ceResultsPending(…)`: si no hay
  dato, la sub-tab no se agrega (regla 5);
- todo `document.querySelector` → `root.querySelector` (AMZN aún lo usa en algunos builders de
  Bottom Line y Misc);
- los nombres fijos de Amazon — si se quedan, cosas dejan de pintarse sin error: `#amznMc` (celda de
  market cap), `tk==='AMZN'` dentro de `aLiveOne`, las clases `.amzn-sc*` del mapa de peers,
  `amznModalBack/X/T/B`, `root._amznCloseModal`, `_amznDetailWired`, `_amznReady`, `_amznSaveT`, el
  texto "ex-AMZN" de `aScTableOne`, `data-brand="AMZN"`, `AMZN_LEDE`, `AMZN_MGMT`, y cada `'AMZN'`
  literal que se pasa a un motor (`initSegments(root,'AMZN')`, `resultsHtml('AMZN')`…).

**Barras de navegación:** agregar `.ov-<t>-dd` a la lista `:is(…)` de `css/selectors.css` (§21b) y no
darles estilos propios a `.dd-tab` / `.ovt-subtab` / `.ce-phtab`.

En la Fase 1 las sub-tabs **no se publican vacías**: cada botón y su panel se agregan al HTML cuando su
unidad se construye (regla de oro 5).

### 7.3 La vista previa: el portal real en local (cómo se le muestra al analista)

**Se trabaja directo en el portal, no en un harness** (decisión SAB, 2026-10-15). El analista revisa
cada unidad en el portal real corriendo en su máquina, con su sesión, igual que lo verá el equipo.

- **Servidor:** `powershell -File serve.ps1` (puerto 8000), **en segundo plano y una sola vez** por
  sesión; si el puerto está ocupado, `powershell -File serve.ps1 -Port 8001`. No usar `python` (es un
  alias roto); para scripts, `py`.
- **Dónde se ve:** `http://localhost:8000/` → el analista inicia sesión con su correo (código mágico;
  **Claude nunca inicia sesión por él**) → Companies → la empresa → Overview / Deep Dive.
- **Requisitos (se revisan en F1):**
  1. `env.js` local con la URL y la llave pública de Supabase (está fuera de git);
  2. la empresa dada de alta en `companies` — la agrega el analista con **Add Company** (F0 #1);
  3. el módulo registrado en `js/overviews/index.js` (§7.1 paso 4).
- **Ventaja:** desde la primera unidad se ve todo lo que antes solo aparecía al final: la cabecera del
  perfil, el precio en vivo, los botones IR/EDGAR, la tabla de Fiscal.ai y Notes guardando en Supabase.
- **Recargar sin caché** (Ctrl+Shift+R) después de cada cambio: el navegador guarda los módulos JS.
- Si el perfil todavía no exporta `deepDive`, la pestaña Deep Dive no aparece: es lo esperado.
- **Lo que depende de una función sin desplegar** (p. ej. `get-market-history`) se aprueba tal como se
  ve en el portal: con su aviso "⚑ Live data pending" (§20b).
- **El harness** (`harness-amzn.html` → `harness-<ticker>.html`, fuera de git) **ya no se usa para
  mostrarle nada al analista**. Queda solo como herramienta interna de Claude cuando necesite revisar
  algo que el portal todavía no puede pintar (p. ej. Historic Multiple con `?mockmarket=1`); lo que se
  aprueba es siempre lo que se ve en el portal.
- **Truco para auditar con automatización:** las pestañas en segundo plano pausan
  `requestAnimationFrame`, así que ninguna gráfica se construye. Antes de recorrer, en consola:
  `window.requestAnimationFrame = fn => setTimeout(() => fn(performance.now()), 0)`.
- Auditar a zoom 100 % (el `zoom` de CSS deforma las gráficas de Chart.js).

**Compuerta F1:** el analista abre `http://localhost:8000/` con su sesión, entra a la empresa y ve el
Overview montado (todavía vacío o con lo que haya) y la cabecera con los botones IR/EDGAR, y confirma
que la vista previa le funciona. El Deep Dive aparece cuando su primera sub-tab esté aprobada. Desde
aquí, cada unidad se muestra así.

### 7.4 De qué código se copia cada unidad

**Base: AMZN, siempre.** Las copias de SN (SharkNinja) son más viejas y algunas rompen la regla 10
(múltiplos congelados, `MOCK_*`). De SN solo se toman las cuatro piezas marcadas.

| Unidad | Copiar de | Tomar de SN además |
|---|---|---|
| OV-1 … OV-7, OV-F | `amzn.js`: datos `STD_FACTS, AMZN_LEDE, STD_BIZ, GMM_SEG, GMM_GEO, REV_DEFS, A_PRODUCTS, TIMELINE, A_PEERS, OV_SOURCES`; render `stdKeyFacts, stdFourQuad, stdMoneyMap, gmmBars, stdProducts, stdPeerScatter, stdTimeline, stdOverviewBody`; cableado `html, init, wireModal, wireScatters, aLiveOne` | — |
| EV-RES-DATA / EV-RES / EV-EST | motor `results.js` (archivo de datos, no código) | — |
| TL-* | motor `segments.js` (archivo de datos) | — |
| EV-SET / EV-POST / EV-NOTES | `amzn.js`, bloque `ce*`, **re-extraído por símbolo** siguiendo la lista de cambios del encabezado de `sharkninja-ce.js` | `CE_CONS` armado al cargar desde `<t>Results` (`sharkninja-ce-data.js`) |
| BL-* | `amzn.js` (`aMarginsBody`, `aBridgeBody`, `aNetBridgeBody`, `aSbcBody`, `expenseTabsBody`, `segmentsBody`, `aSplcBody` y sus builders) | — |
| VA-HIST | `amzn-histmult.js` | horizontes deshabilitados con su razón (`sharkninja-histmult.js`) |
| VA-PEERS | `valuationPeersBody` + el mapa de `amzn.js` | — |
| VA-TM | `amzn-target-multiple.js` | rastreo de la fuente de la deuda neta (`_ndSrc`, `sharkninja-target-multiple.js`) |
| VA-SENS | `amzn-sensitivity.js` | — |
| MG-* | motor `management.js` + `AMZN_MGMT`, `amznOwnBody`, `amznGovBody`, `amznTrackBody` | datos separados del código (`sharkninja-mgmt-data.js`) |
| MISC | `amzn.js` panel `misc` | — |

"Copiar" = traer el código y cambiar los datos y los nombres de §7.2, **corrigiendo en la copia lo que
siga abierto del Anexo A**. Nunca reimplementar a partir de un doc.

---

## §8 Overview — los 7 bloques

**Responde:** *¿qué es esta empresa, en un minuto?* Es el gancho, no el reporte.

**Referencia AMZN (`amzn.js`):** datos `STD_FACTS, AMZN_LEDE, STD_BIZ, GMM_SEG, GMM_GEO, REV_DEFS,
A_PRODUCTS, TIMELINE, A_PEERS, OV_SOURCES`; render `stdKeyFacts, stdFourQuad, stdMoneyMap, gmmBars,
stdProducts, stdPeerScatter, stdTimeline, stdOverviewBody`; cableado `html, init, wireModal,
wireScatters, aLiveOne` (orden en §7.2). **Tipo:** datos (copiar las funciones `std*` de AMZN y cambiar
las constantes). Sin Chart.js: todo es HTML/CSS e SVG.

**Antes de copiar (A1, abierto):** `stdOverviewBody` y `stdPeerScatter` traen un `<style>` en línea.
Lo del Overview (`.stdkf`, `.q2`, `.stdp`, `.acc`, `.ov-collap`) ya está en `css/overview.css`: en la
copia se borra. Pero las clases del mapa de peers (`.mg-tog`, `.mg-seg`, `.mg-pill`, `.asc-*`, `.mg-tip`)
**solo existen en ese `<style>`**: se suben a `css/overview.css` (y se dice en el PR) antes de borrarlo.
Ojo: la hoja de estilos tiene `.ov-foot` a 10.5px y `.ov-lede` en `--blue`; el `<style>` en línea los
pisa (10px, `--navy`). Manda la hoja.

**Estructura fija, de arriba a abajo (exactamente esto, nada más):**

| # | ID | Bloque | Estado inicial |
|---|---|---|---|
| 1 | OV-1 | Key Facts (10 celdas) | siempre visible |
| 2 | OV-2 | Descripción (lede) | siempre visible |
| 3 | OV-3 | Cuadrante 2×2 | siempre visible |
| 4 | OV-4 | "How <Empresa> makes money" | colapsado ▸ |
| 5 | OV-5 | "Products & platforms" | colapsado ▸ |
| 6 | OV-6 | "Competitors — the peer map" | colapsado ▸ |
| 7 | OV-7 | "Timeline — how it became today's <Empresa>" | colapsado ▸ |
| — | OV-F | Pie de fuentes del Overview | siempre |

Prohibido agregar un 8.º bloque: ni tira de precio, ni segundo recuadro de KPIs, ni firma de autor.
**La tira de precio en vivo** (ticker · precio · cambio · market cap · EV · deuda neta · acciones) **no
existe en ningún perfil**: el precio y el cambio ya están en la cabecera del perfil, y el market cap en Key
Facts. La cotización en vivo (`liveQuote`) se pide igual, pero solo alimenta la celda de market cap, el mapa
de peers y Sensitivity — sin pintar nada propio (SAB, 2026-10-20, al quitarla de META). En modo B, si el
perfil la trae, se quita (con su aprobación anotada) y se conserva la llamada.
Los bloques 1–3 no llevan título encima. Los 4–7 usan el colapsable `collapsible(title, inner, false)`
de `amzn.js`, con el título exacto de la tabla (cambiando el nombre de la empresa).

**El Overview va sin color** (review TSM, SAB 2026-10-19: "quitar colores de la parte de Overview para
que se vea más profesional"). Todo el Overview se pinta con tokens neutros de Summit: texto `--navy`,
acentos `--steel`, divisores y ejes en grises (`SUMMIT_MUTE`). En concreto:
- **Barras de OV-4:** solo **grises claros**, y los montos dentro de la barra en **negro** (`--navy`)
  (SAB, 2026-10-20). El gris lo pone la hoja de estilos: `gmmBars` envuelve en `.ov-mbars.gmm-neutral`,
  ordena las filas por tamaño y da a cada barra `.gmm-g1` (la más grande, un poco más oscura) … `.gmm-g6`.
  Nada de `SUMMIT_CAT` ni de color por segmento, plataforma o región; el quinto campo de los datos ya no
  se usa. Referencia: `gmmBars` de `tsm.js` / `amzn.js`.
- **Mapa de peers (OV-6):** círculos blancos con borde gris; la empresa del perfil, borde `--navy`
  grueso. Los logos son el único color.
- **Sin rellenos de color** en tarjetas, pastillas, chips ni encabezados (ni `--brand-soft` de fondo
  en bloques enteros). La pastilla activa se marca con navy, como en el resto del portal.
- **Títulos de celdas y etiquetas en negro** (`--navy`): "What it sells", "Who buys it", "How it earns",
  "The edge" del 2×2 y cualquier rótulo equivalente — nunca en azul ni en el color de la empresa
  (SAB, 2026-10-20). En `css/overview.css` la regla `:is(.ov-amzn, .ov-tsm, .ov-meta) .q2-k`: cada
  empresa que pasa por la guía agrega su clase raíz ahí.
- **Un solo color de acento en todo el perfil:** el azul Summit que subraya las pestañas del perfil
  (OVERVIEW · DEEP DIVE…), `--steel`. Es el de la línea de 3 px de Key Facts, el subrayado de la
  pestaña activa en cada nivel y cualquier otro realce. En la raíz del perfil: `--brand: var(--steel);
  --brand-2: var(--steel)` (SAB, 2026-10-20).
- El color categórico (`SUMMIT_CAT`, §21) **empieza en el Deep Dive**, donde hace falta para separar
  series en una gráfica.
- **Verificación** (va en la autoauditoría de cada OV): buscar `SUMMIT_CAT` y hex en las constantes y
  funciones del Overview — no debe quedar ninguno fuera del logo.

### OV-1 Key Facts

- **Forma:** 10 celdas, 5 columnas × 2 filas (2 columnas en móvil). Celdas blancas, divisores finos,
  sin sombreado gris. Línea de acento de 3 px arriba en `--steel` (el azul Summit de las pestañas del
  perfil), vía `var(--brand-2, var(--brand))` de la hoja de estilos con la raíz en `--steel` — **no** un
  hex fijo ni el color de la empresa.
- **Las 10 celdas, en este orden** (etiqueta exacta en inglés · formato del valor · fuente):

| # | Etiqueta | Formato | Fuente |
|---|---|---|---|
| 1 | Listing | `NASDAQ: AMZN` | EDGAR / bolsa |
| 2 | HQ | `Ciudad, Estado, País` | 10-K portada |
| 3 | Incorporated | `Delaware, USA` | 10-K portada |
| 4 | SEC filer | `Domestic (10-K/10-Q/8-K)` o `Foreign (20-F/6-K)` | **EDGAR** — lo que de verdad presenta |
| 5 | Founded | `1994 (Jeff Bezos)` | IR / 10-K |
| 6 | IPO | `May 1997 · NASDAQ` (o el mecanismo real: SPAC, direct listing…) | IR / prospecto |
| 7 | CEO | `Nombre · joined AAAA · CEO since Mmm AAAA` (las dos fechas si existen; al menos una) | IR / proxy |
| 8 | Employees | `~1,576,000 · Dec 2025` (con fecha) | 10-K Item 1 |
| 9 | Dividend | `Payer` / `Non-payer · never paid one` — **sin yield** | 10-K Item 5 |
| 10 | Market cap | mientras carga: `loading live quote…`; en vivo: `$2.45T · live, Oct 14, 2026`; si falla: `live quote unavailable` (sin semilla, regla 10) | `liveQuote` (Massive), vía `aLiveOne` |

- **Datos:** `STD_FACTS = [[etiqueta, valor], …]` (10 pares); la celda de market cap lleva el valor
  `'loading live quote…'` y el `id` que `aLiveOne` rellena (`#<t>Mc`).
- **Si falta un dato:** se sustituye por el siguiente hecho más relevante (p. ej. estructura de
  acciones si es dual-class), nunca una celda vacía ni "N/A". La sustitución es decisión del analista.
- **Qué decide el analista:** la celda sustituta, si hace falta.
- **Copiar tal cual de AMZN:** la línea de acento (ya usa `var(--brand-2, var(--brand))`) y el manejo
  de market cap (sin semilla). Solo renombrar `#amznMc` y `tk==='AMZN'` (§7.2).
- **Verificación:** 10 celdas · CEO con antigüedad · market cap con estado (live o "unavailable") · filer
  verificado en EDGAR · sin celdas vacías.

### OV-2 Descripción (lede)

- **Forma:** un párrafo `.ov-lede`, **2–4 oraciones, ~50–80 palabras** (AMZN: 2 oraciones, 69).
- **Contenido:** qué es la empresa y qué hace, al nivel más alto. **No** enumera segmentos, mezcla de
  ingresos, tipos de cliente ni el moat — cada uno tiene su bloque abajo. Si el lector lo va a leer
  más abajo, no se gasta aquí.
- **Tono:** neutral. Prohibido: "disciplined", "industry-leading", "best-in-class",
  "mission-critical", "world-class", y cualquier tesis de inversión.
- **Fuente:** 10-K Item 1 / IR, parafraseado.
- **No copiar de AMZN:** su lede repite los tipos de cliente del cuadrante ("consumers, third-party
  sellers, enterprises…"). En una empresa nueva, no.

### OV-3 Cuadrante 2×2

- **Forma:** una sola tabla de 2×2 con bordes compartidos (`.q2`), no cuatro tarjetas sueltas. Nunca
  colapsada.
- **Celdas, en este orden:** `What it sells` · `Who buys it` · `How it earns` · `The edge`.
  **≤ 30 palabras cada una.**
- **"How it earns"** es la única con números: mezcla de ingresos en una línea, con año
  ("FY2025: ~38% online stores · ~24% seller services · ~18% AWS…") y, si existe, el dato que cambia la
  lectura ("— but AWS earns ~57% of operating income").
- **Fuente:** 10-K (segmentos, desagregación de ingresos); "The edge" es lectura del analista y debe
  ser defendible con el 10-K.
- **Qué decide el analista:** "The edge".

### OV-4 How <Empresa> makes money

- **Contenido, de arriba a abajo:**
  1. Leyenda de una línea (`.ov-diagram-cap`) con el total y su crecimiento:
     "FY2025 net sales **$716.9B (+12%)** — the same total, two ways: by segment or by geography. Both
     reconcile to the reported figure."
  2. Pastillas con el prefijo "View:" — `Segments` (activa) · `Geography` (`data-gmm="seg|geo"`).
  3. Barras horizontales de CSS (`gmmBars`): etiqueta · barra con el $ dentro · % a la derecha.
     Segmentos en orden del 10-K; geografía de mayor a menor, con "Rest of world" al final (AMZN lo
     pone en 2.º lugar — no copiar). Color: **grises claros por tamaño, montos en negro** (`.gmm-neutral`,
     arriba), ni `SUMMIT_CAT` ni los hex `GREEN`/`GRAY` de AMZN.
  4. Acordeones de definición, uno por segmento (`.acc`), título = nombre del segmento + paréntesis
     corto que diga qué es ("AWS (most of the profit)"):
     - cuerpo: **qué es, qué hace y cómo cobra**, cualitativo, ~40–60 palabras, **sin números**;
     - dentro, un acordeón anidado **"The numbers"** con filas clave/valor: ventas y crecimiento,
       utilidad operativa, margen, y un hecho de contexto. Aquí **sí** van números;
     - subsegmentos (si existen): otro nivel anidado dentro del segmento, con números.
  5. Un acordeón final opcional **"The revenue lines"** si el 10-K desagrega ingresos por producto
     (AMZN: 7 líneas con $ · % · crecimiento), con `econNote` debajo de las filas (p. ej. "the split
     is company-wide, not per segment").
  6. Leyenda de cierre con utilidad operativa y neta del año + la frase que cambia la lectura + la
     fuente ("Source: <filing> (Note N)").
- **Datos:** `GMM_SEG` / `GMM_GEO` = `[[etiqueta, % numérico, '$x.xB', 'x%', color], …]` (el quinto
  campo ya no se usa: el gris lo da `.gmm-neutral`);
  `REV_DEFS` = `[{ seg:'Nombre (paréntesis corto)', desc:'<html cualitativo>', econ:[[clave, valor], …],
  econNote? }, …]`. `desc` admite `<b>`, nunca cifras.
- **Regla de las ≥ 2 rebanadas:** si hay un solo segmento o una sola geografía, no se dibuja una barra
  única — se dice en una línea ("single reportable segment") y se muestra solo la vista que califica.
- **Cuadre obligatorio:** suma de segmentos = suma de geografías = ventas totales reportadas
  (tolerancia: redondeo declarado). Claude lo verifica con números y lo reporta en ④. Si no cuadra, es
  un error de datos y no se muestra.
- **Fuente:** 10-K, nota de segmentos y desagregación de ingresos (AMZN: Nota 10).
- **No copiar de AMZN:** prosa con números dentro del `desc` de "The revenue lines" ("+22%", "+20%":
  los números van en filas); "Rest of world" fuera de su lugar; hex sueltos en las barras; estilos en
  línea en las pastillas (que `init` cambia a mano).

### OV-5 Products & platforms

- **Contenido:** leyenda "**Tap any family** for the specific products inside it." + rejilla de
  tarjetas, **una por familia de producto** (AMZN: 7 familias, 25 productos).
- **Tarjeta:** icono (emoji) · nombre de familia · una línea de ≤ 6 palabras · "See products ›".
  (`stdProducts` de AMZN solo maneja emoji; una foto por familia requiere código nuevo — preguntarlo
  antes, no es parte del estándar.)
- **Al hacer clic (modal, `data-detail="prod:<i>"`):** título = icono + familia; la línea `d` en gris;
  luego la lista de productos específicos, cada uno **nombre en negrita + 1–3 líneas** de qué hace y
  para qué sirve.
- **Datos:** `A_PRODUCTS = [{ ic:'🛒', fam:'Nombre', d:'≤ 6 palabras', items:[[nombre, html], …] }, …]`.
- **Regla de dos niveles:** nunca todos los productos a la vista; se entra por familia. Si una familia
  tiene más de ~6 productos, la lista del modal va en acordeones (OVERVIEW_CONVENTIONS §4.5); AMZN los
  muestra planos porque tiene ≤ 4 por familia.
- **Fuente:** 10-K Item 1 + IR / páginas de producto oficiales.
- **Qué decide el analista:** cómo se agrupan las familias.

### OV-6 Competitors — the peer map

- **Contenido, de arriba a abajo:**
  1. Leyenda: "Peers mapped by **valuation multiple** (x) and **revenue growth** (y). **Bubble size =
     live market cap in USD.** Hover or tap a bubble for the read."
  2. Pastillas **Multiple:** `P/E` (por defecto) · `EV/EBITDA` — **nunca P/S**. **Basis:** `Forward`
     (por defecto) · `Trailing` (aplica a ambos ejes).
  3. Dispersión SVG: eje X "← cheaper (lower multiple)" … "more expensive →" con etiqueta central
     ("P/E · forward"); eje Y "slow" … "fast growth". Burbuja = logo de la empresa dentro de un
     círculo (`logo` opcional por peer; si no, el logo de parqet), con el nombre debajo; tamaño =
     market cap en vivo. La empresa del perfil con borde grueso. Tooltip: logo + nombre + `why`
     (1–2 oraciones).
  4. Fila de chips: un chip por peer con **×** que lo **elimina** (no lo tacha); campo "+ TICKER" y
     botón Add. Re-agregar un peer conocido restaura sus datos de archivo.
  5. Leyenda: "Remove a peer with the × on its chip, or add one by ticker. Only **listed** peers with a
     public multiple plot here — <rivales privados con nombre> have no market multiple." + nota:
     "Multiples = live price ÷ <reported (filings, as of …) | Bloomberg consensus (as of …)>; market
     caps are live."
- **Datos (regla 10):** el archivo **no guarda múltiplos ni market cap**, guarda los
  **denominadores**, que sí pueden ir en archivo porque vienen de filings o Bloomberg: arreglo
  `A_PEERS` = `{tk, n, epsT, epsF, ebitdaT, ebitdaF, gt, gf, asOf, src, hl, why, logo?}` (§14
  VA-PEERS). El múltiplo y el tamaño se calculan en el navegador con `liveQuote(tk)` (`js/api.js`, ya
  devuelve `{price, marketCap, ev, netDebt, shares}`): **P/E = price ÷ EPS; EV/EBITDA = ev ÷ EBITDA**.
  - **Trailing** = último año/LTM reportado, del filing **del propio peer** (10-K / 20-F).
  - **Forward** = consenso BBG solo si el peer está en `BBG_CONSENSUS.txt` / `Consensus_Portal.xlsm`;
    si no, ese peer va solo con trailing y su chip lo dice ("trailing only — no Street file").
  - **Moneda:** si el peer reporta en otra moneda que la de su cotización (BABA, MELI…), solo entra si
    el denominador se convierte con un tipo de cambio declarado en `src`; si no, se excluye con nota.
  - **Sin precio en vivo**, la burbuja no se dibuja (no hay `mc` de respaldo).
  - **Ejes:** los topes se derivan del dato (máximo de los peers visibles + margen), no fijos.
  - Un ticker agregado a mano que no está en `A_PEERS` entra solo con market cap y no se dibuja hasta
    tener denominadores (el `why` que le pone el Add de `wireScatters` lo dice).
  - **No hay código de referencia todavía:** AMZN sigue con múltiplos sembrados (A3). La primera
    empresa escribe este cálculo en `aScMult` (hoy lee `peT/peF/evT/evF`), `aScMax` y `aScRenderOne`, y
    se vuelve la referencia; decirlo en el PR.
  **El mismo arreglo y el mismo estado (`A_SC`, global)** alimentan el mapa del Overview y Valuation ▸
  Peers: quitar un peer en uno lo quita en el otro. La tabla de números solo aparece en Valuation ▸
  Peers.
- **Fuente:** denominadores y crecimiento con fuente y fecha (nombrada en el pie, no solo en un
  comentario de código); precio y market cap en vivo (Massive).
- **Qué decide el analista:** el conjunto de peers (normalmente 5–8 cotizados + la empresa) y la frase
  `why` de cada uno.
- **No copiar de AMZN:** los múltiplos y el `mc` sembrados en `A_PEERS` (`peT/peF/evT/evF/mc`,
  stockanalysis.com, Jul 2026; y AMZN con `peT = peF = 27.8`) — A3; los topes fijos de los ejes (X
  45×/30× en `aScMax`, Y 25 % en `aScRenderOne`: MELI y COST quedan pegados al borde); la leyenda que
  dice "seeded approximations"; el `<style>` en línea de `stdPeerScatter` (A1).
- **Verificación:** P/E y EV/EBITDA cambian el eje · Forward/Trailing cambian ambos ejes · × elimina ·
  Add funciona · ningún peer pegado al borde sin aviso · ningún múltiplo escrito en el archivo · el
  pie dice la fecha de los denominadores.

### OV-7 Timeline

- **Contenido:** lista vertical de hitos (AMZN: 11), cada uno = año + una línea corta; los que tienen
  profundidad abren un modal ("Read more →") con **viñetas secuenciales** (qué pasó → luego → luego),
  nunca prosa larga. Orden **cronológico estricto**.
- **Qué entra** (cada hito responde "¿por qué importa para lo que la empresa es hoy?"):
  génesis y mecanismo de salida a bolsa · primer dividendo de la historia · spin-offs y desinversiones
  materiales · M&A material (objetivo cotizado, o que aportó un segmento/producto actual; los fallidos
  también) · un segmento que se volvió material · reinvenciones del modelo de negocio · cambios de CEO
  que importan (el actual; la salida del fundador) · solo el **último** hito de billón de dólares ·
  eventos de capital muy dilutivos · **a lo sumo un** asunto legal/SEC definitorio · quiebras ·
  redomicilio · cambio de nombre estructural.
- **Qué no entra:** splits, dividendos en acciones neutros, emisiones no dilutivas, hitos de market
  cap menores a $1T, nombramientos de consejo, litigios de rutina, M&A pequeño, recompras/dividendos,
  retrasos de filings.
- **Génesis primero:** antes de escribir, establecer cómo nació la empresa en su forma actual
  (spin-off, SPAC, fusión, roll-up…) y contarlo sin cabos sueltos.
- **Datos:** `TIMELINE = [{ y:'1994–97', t:'<html, una línea>', d?:'<ul class="ov-bullets"><li>…</li></ul>' }, …]`.
  Sin `d` no hay "Read more"; el título del modal es solo `y`.
- **Fuente:** IR, 10-K, prospecto, comunicados oficiales.
- **No copiar de AMZN:** su `TIMELINE` está fuera de orden ("2023–25", "2023–26" y luego "Jun 2024"):
  respetar el orden cronológico estricto.

### OV-F Pie del Overview

Un `.ov-foot` al final, con este formato:
"Sources — <filing> (SEC EDGAR) for <qué cifras>; <IR / comunicados> for qualitative content and
history; <otros>. Market cap and peer multiples are live (Massive price ÷ reported or Bloomberg
consensus figures as of <Mmm AAAA>). Forward figures are estimates, not company guidance."
Va en `OV_SOURCES` (texto plano, pasa por `esc()`). **Es el único pie del Overview**: los colapsables
4–7 no llevan pie propio (§22). Sin firma de autor. El Deep Dive tiene sus propios pies (uno por
panel). **No copiar de AMZN:** su `OV_SOURCES` cita "Summit DCF model (snapshot 2026-05-13)" y "peer
multiples … seeded" — en una empresa nueva, ni Summit copiado ni múltiplos sembrados.

---

## §9 Evolution ▸ Results — el dataset (unidades `EV-RES-DATA` y `EV-RES`)

**Responde:** *¿cuánto hizo cada periodo, y quién acertó: nuestro modelo, la calle o la guía de la
empresa?*

**Referencia AMZN:** motor `js/results.js` (`resultsHtml('AMZN')`, `initResults(wrap,'AMZN')`), datos
`js/results-data/amzn.js`. **Tipo:** motor — se escribe un archivo de datos, no un panel.

Se construye **antes** que Top Line porque Top Line, Estimates, Earnings ▸ Setup y Historic Multiple
leen de este archivo. Por eso tiene dos unidades: primero el dato (`EV-RES-DATA`), luego la pestaña
(`EV-RES`).

### 9.1 El archivo `js/results-data/<ticker>.js`

Contrato completo en `RESULTS_CONVENTIONS.md`; lo esencial:

```js
export var <t>Results = {
  updated, source,                         // source = pie del panel (una oración por cada fuente mezclada)
  views: {
    q: { label:'Quarterly', note, metrics:{ <key>:{ label, short, group, unit, marginOf?,
            periods:['1Q23',…], act:[], summit:[], cons:[], guideLo:[], guideHi:[], note } },
         sections:[ { key:'top', label:'Top Line', defaultMetric:'rev', groups:[{label,keys}] },
                    { key:'margins', label:'Margins & Profitability', defaultMetric:'opinc', groups:[…] } ] },
    y: { … periods:['2023',…] … }
  },
  estMatrix?: { … },   // GENERADO por scripts/consensus/ — no se edita a mano (receta abajo)
  evolution?: { … }    // §11
};
```

Campos opcionales que AMZN usa y conviene conocer: `marginLabel` (nombre del margen en chips y eje),
`currency` / `currencyName` (empresa que no reporta en USD), `surprise:false` (métrica sin tarjeta de
sorpresas), `conv:false`; en `evolution`, `actKey`.

- **Métricas mínimas** (lo que AMZN tiene; adaptar nombres al 10-K):
  - Trimestral — Top Line: `rev` (Totals) · un key por segmento (Segments) · líneas de ingreso si el
    10-K las da (Revenue lines). Margins & Profitability: `opinc`, `eps`, `capex` (Company) · utilidad
    operativa por segmento con `marginOf` = ventas del segmento (Segments).
  - Anual — Top Line: `rev` + segmentos. Margins & Profitability: `ebitda` (por defecto), `earnings`,
    `capex` + **utilidad operativa por segmento también en anual** (AMZN no la tiene en anual y por eso
    Top Line ▸ Segments pierde esa métrica al cambiar a Annual — no repetirlo).
- **`act`** = lo reportado (8-K Ex. 99.1 / 10-Q). **`cons`** = consenso de la calle (BBG).
  **`guideLo/guideHi`** = guía de la empresa (del 8-K anterior). Un periodo futuro **es** `act: null` —
  no existe otra bandera.
- **`summit`** = la proyección del modelo antes de cada print — **congelada en el archivo** (regla 10,
  §20b): Claude la saca del MCP de Summit con el mapa `js/summit-map/<ticker>.js` (para cada periodo,
  el snapshot anterior al print) y el `source` del dataset nombra el modelo y los snapshots ("Summit
  DCF model, snapshots AAAA-MM-DD … AAAA-MM-DD; frozen, not live"). Mismo formato que AMZN; el motor
  no se toca.
- **Consenso de periodos ya reportados (el "pre-print"):** sale de `estMatrix.cons` (el snapshot de BBG
  anterior a cada print). Si el archivo de BBG no llega tan atrás, esos periodos van **sin** `cons` y
  se dice en la `note` — **nunca** de un agregador (CNBC/Refinitiv, Zacks/Yahoo: AMZN y SN lo hicieron;
  regla 3).
- **Margen:** numerador y denominador de la **misma** serie, siempre.
- **Los trimestres estimados suman al año** (review TSM, SAB 2026-10-19: "actualizar los quarters de
  2027 con los números que tenemos del año"). Para cada año con estimados, y **dentro de cada fuente**
  por separado (`summit` con `summit`, `cons` con `cons`): en métricas de flujo (ingreso, utilidad,
  EBITDA, capex) Q1+Q2+Q3+Q4 = el anual de esa misma fuente; en un año a medias, los trimestres
  reportados (`act`) + los estimados = el anual estimado. EPS no se suma (las acciones cambian): se
  revisa que el anual ≈ suma con tolerancia declarada. Si la fuente **no trae** trimestres de un año
  que sí trae en anual, los trimestres van en `null` (regla 7) — **no** se reparte el anual entre cuatro
  ni se copian los de la otra fuente. Si los trae pero no cuadran (pasó con TSM: Q4 roto en el DEFAULT
  y `SEGM_REV` anual ≠ suma), es una **duda del mapa** (F0-SM ▸ Dudas) y no se publica hasta que el
  autor del modelo la resuelva. ❓ Si hubiera que **forzar** el cuadre (p. ej. llevar los trimestres de
  consenso al anual de Summit), lo decide el analista en la compuerta, y la `note` de la métrica lo dice.
- **Etiquetas de periodo:** `nQyy` (`3Q26`) trimestral, `yyyy` anual. (Earnings usa `Q3 2026`; no
  mezclar formatos dentro de un mismo archivo.)
- **Comillas:** delimitadores de string con comillas rectas. Una comilla tipográfica como delimitador
  rompe `results.js` **para todas las empresas** (ya pasó).
- **Registro:** en `js/results.js`, `import { <t>Results } from './results-data/<t>.js';` y la entrada
  `<T>: <t>Results` en `RESULTS_DATA`. (El dataset de Setup, `<T>_SETUP`, se registra igual en EV-SET.)
- **Fuentes:** actuals del 8-K/10-Q; consenso de `BBG_CONSENSUS.txt` + `Consensus_Portal.xlsm` (vía
  `estMatrix`); Summit congelado del MCP, con la fecha de cada snapshot.
  Si el ticker no está en el consenso de BBG: Results va solo con `act` (+ guía), y el analista decide
  si lo agrega al workbook.

**Receta de `estMatrix` (la parte de consenso).** Con `py`, desde `scripts/consensus/`, y la carpeta
de Drive del equipo en `SUMMIT_DOCS` (la letra cambia por máquina):
1. `SUMMIT_DOCS="<letra>:/My Drive/Summit/Docs/0" py inspect_matrix.py <TK>` — lista cada métrica del
   export con su **código de Bloomberg** (p. ej. `IS_COMPARABLE_EBIT`), segmento, escala y snapshots.
2. Escribir `map_<tk>.json` a partir de la columna CODE (nunca del número de slot: cambia por ticker).
3. `py emit_matrix.py <TK> map_<tk>.json [valid_<tk>.json]` → `out/estmatrix_<tk>.js` (une el `.txt`
   archivado y la hoja viva `CONSENSUS` del `.xlsm`; necesita `openpyxl`, que ya está).
4. `py apply_matrix.py <TK> --dry` y luego sin `--dry` — empalma el bloque en el dataset.
5. `py verify_preprint.py <TK> cons` — la prueba de aceptación; cada diferencia se clasifica
   (redondeo / actualización real / error) antes de seguir.
6. La mitad `summit` de `estMatrix`: `emit_summit_matrix.py` sirve (regla 10 la permite desde el
   15 oct 2026), siempre contra los snapshots vigentes del MCP y con la fecha en el encabezado; luego
   `verify_preprint.py <TK> summit`. Si el script está cableado a Amazon, se adapta o se arma a mano.

**Compuerta EV-RES-DATA:** Claude muestra una tabla de cuadre: para 3 periodos al azar, el valor del
archivo vs el documento fuente, métrica por métrica. **Además**, una segunda tabla con el cuadre
trimestres ↔ año de cada año estimado (por fuente y por métrica de flujo: suma de trimestres · anual ·
diferencia). El analista aprueba los números antes de ver ninguna gráfica.

### 9.2 La pestaña Results — qué se ve (de arriba a abajo)

1. **Selector "Estimates as of"** — solo si hay `estMatrix`. Modos: *Latest file before each print*
   (por defecto) · *As of a date* · *One Summit model file* · *One Street (Bloomberg) file*, con un
   segundo selector "which file" en los modos de un archivo; y una nota de vintage. (Sin la mitad
   Summit de `estMatrix`, el motor no ofrece el modo *One Summit model file* — es lo esperado.)
2. **Un bloque por sección** (`top`, `margins`), cada uno con:
   - **Fila 1:** nombre + desplegable de métricas **agrupado por familia** (`<optgroup>`: Totals ·
     Segments · Revenue lines · Company…). Cada opción con su nombre completo.
   - **Fila 2:** Quarterly | Annual · unidad (`$B`) | Growth | Margin % (solo si hay `marginOf`) ·
     YoY | QoQ (en Growth trimestral) · % | Amount (en Growth) · Values On | Off (Off) — y a la
     derecha, rangos: Last 4Q · Last 8Q · Reported · Forward · All (anual: Last 3Y · Last 5Y · …).
   - **Leyenda (chips que ocultan la serie en la gráfica Y en la tabla):** Actual (navy) · Summit model
     (azul, solo si hay serie Summit) · Consensus (gris) · "Guidance range" o "Guidance (single number)"
     · línea de margen (solo fuera de la sección `top`); banderas ámbar "⚑ No company guidance" y, en
     modo margen, "⚑ Guidance is not a margin"; pista "▲ beat · ▼ miss · click a chip to hide it".
   - **Gráfica:** barras; zona sombreada "FORECAST" en periodos futuros con etiquetas en burbuja;
     margen en el eje derecho exterior; arrastrar para hacer zoom en **ambos ejes**, doble clic
     restablece; slider de periodos debajo.
   - **Tabla "Period detail"** (colapsada por defecto — `tbl: false` en el estado inicial de `results.js`): periodos en
     columnas (E en estimados), filas Actual / crecimiento / margen, y por cada fuente valor /
     crecimiento / sorpresa / margen; columna fija "Range record" (CAGR, ▲/▼, desviación media,
     aciertos de guía).
   - Pie del bloque: la `note` de la métrica.
3. **"Actuals vs Estimates"** (tarjeta de sorpresas) — aparece sola si dos series se traslapan en
   periodos reportados: Quarterly | Annual propio · "Compare [Actual ▾] against…" · Summit ✓ /
   Consensus ✓ / Guidance ✗ (con Low / Mid / High) · modo Surprise % | Amount (en EPS dice
   "per-share") · el "Estimates as of" repetido · barras divergentes; tabla colapsada.
4. **"Road to the print"** — aparece sola si hay `estMatrix`: cómo llegó el pronóstico de un periodo,
   snapshot por snapshot; selector de periodo y modo Level | Distance.
5. **Pie:** nota de la vista + `source` del dataset.

- **Texto:** ninguna introducción sobre las gráficas (el campo `intro` no se muestra). Lo explicativo
  va en la `note` de cada métrica (1–2 oraciones: definición y advertencias, p. ej. "GAAP; incluye el
  cargo de la FTC en 3Q25").
- **Qué decide el analista:** qué métricas entran (más allá de las mínimas); base GAAP vs ajustada.
- **Si falta el dato:** sin dataset no hay sub-tab (no se publica vacía). Solo con `act` hay barras y
  tabla, sin tarjeta de sorpresas. Una empresa sin `estMatrix` ni `evolution` (GOOGL, IBKR) está
  **completa**, no incompleta.

### 9.3 Escalera de capacidades (qué da cada capa de datos)

| Con esto | Se obtiene |
|---|---|
| `views` + `act` | Results: barras, tabla, "⚑ No company guidance" |
| + `cons` (archivo) | chip Consensus, filas de sorpresa, Range record, tarjeta Actuals vs Estimates |
| + `summit` (congelado del MCP) | chip Summit y sus sorpresas (§9.1) |
| + `guideLo/guideHi` | banda de guía, filas de guía, Low/Mid/High |
| + `estMatrix.cons` (generado) | selector de vintage **y** Road to the print, automáticamente (solo modos de consenso) |
| + `evolution` | la pestaña Estimates (§11) — Summit congelado por snapshot |
| + `<ticker>-setup.js` | la gráfica de Earnings ▸ Setup (§12) |

---

## §10 Top Line — 4 sub-tabs (motor `segments.js`)

**Responde:** *¿de dónde viene el ingreso y qué lo mueve?*

**Referencia AMZN:** motor `js/segments.js`, datos `js/segments-data/amzn.js`, montaje en
`deepDiveHtml` (panel `topline`) y en la rama `topline` de `aBuildSub`. **Tipo:** motor — se escribe
`js/segments-data/<ticker>.js`. Ya lo usan AMZN, DHR y SN.

**Registro (en `js/segments.js`):**
1. `import { <t>Segments } from './segments-data/<t>.js';` y `import { <t>Results } from './results-data/<t>.js';`
2. En `SEGMENTS_DATA`: `<T>: { seg: <t>Segments, res: <t>Results }`.
3. Cuando exista la semilla de Notes (EV-NOTES): `import { <T>_THEMES } from './themes-data/<t>.js';`,
   la entrada en `THEME_SRC` y el mapa nombre-de-tema → `key` de segmento en `THEME_SEG`. Sin esto, el
   bloque 5 de TL-SEG dice "nothing on record" (le pasa a DHR).
4. En `<t>.js`: los botones y paneles en `deepDiveHtml`
   (`segmentsOverviewHtml/segmentsHtml/segmentsOtherHtml/segmentsCustomersHtml('<T>')`) y las ramas
   `initSegments*(root,'<T>')` en `aBuildSub`. Omitir Other = quitar su botón, su panel y su rama.

**Requisito:** `EV-RES-DATA` aprobado. Cada `drivers.rev` / `drivers.opinc` de un segmento es un
**puntero** `{from:'results:<key>'}` (o `shared:<key>`) a una métrica que debe existir; si no existe, la
serie desaparece sin avisar.

**Cómo se arma el archivo (empresa nueva): a mano**, como DHR y SN. El generador
`scripts/segments/emit_segments.py` está cableado a Amazon (pide un volcado del MCP de Summit con las
etiquetas de AMZN), `verify_segments.mjs` necesita `node` (no está instalado) y el doc que cita,
`SEGMENTS_CONVENTIONS.md`, no existe. Sí sirven `extract_10k.py` / `extract_geo.py` como ayuda para
sacar texto y geografía del 10-K, y `load_splc.py` para Customers.

**Contrato del archivo** (`export var <t>Segments = {…}`):
- **Raíz:** `company, updated, source, axis{q,y}, shared, derived{num,den,unit,annualiseDen}, overview{tenK|lede}, segments[], other[], customers`.
- **Por segmento:** `key, label, tenK{text,where,cite,url,needs}, summary, brief, sells[{name,what}],
  products[{name,what,tenK,customers{archetype,named[{name,q,what}],note,concentration},management,needs}],
  drivers{rev,opinc}, kpis[{name,definition,source,periodicity,series,unit,filing,filingWhere,needs}],
  kpiNote, interactions[{name,relation,lines,why,data,bridge}], bridges[{key,target,terms,view,kind,note}], highlights`.
- **Por corte de Other:** `key, label, sub, lede, series, views, axis, note, tenK, cite, spans, caveat`.
- **Summit:** `summit:{}` con las series del modelo **congeladas** del MCP (regla 10), por segmento y
  con el snapshot en el `source`. Con eso aparece la zona FORECAST, igual que en AMZN.
- **FILING:** un texto sin `filingWhere` sale con chip OURS, no FILING (así quedó arreglado A15). Lo que
  lleve `filingWhere` tiene que ser **verbatim**.

### Comportamiento común de las gráficas de Top Line

Controles (fila etiquetada): **Period** Quarterly | Annual · **Show** $B | Share | Growth · con Growth:
**Compare** YoY | QoQ y **Growth in** % | $ added · **Layout** Stacked | Side by side (solo barras en
$B) · **Values** On | Off (Off). Leyenda en chips (ocultar quita la serie de gráfica, tabla y conteos).
Zoom en ambos ejes, doble clic restablece. Slider de dos manijas. Tabla colapsada:
"<título> · show · N series over M periods". Estimados = solo Summit (Top Line no lee consenso),
sombreados con "FORECAST" y marcados E — **hoy no hay estimados** en una empresa nueva (`summit:{}`,
ver arriba). Colores: `SUMMIT_CAT` en orden fijo, el color sigue a la entidad (A13 ya arreglado).

### TL-GEN General (`segov`, activa por defecto)

1. **"The segments"** (sub: "N reportable"):
   - Cita del 10-K con chip **FILING**: la oración del Item 1 que dice cómo se organiza la empresa
     (`overview.tenK = {text, where}`), verbatim.
   - **Tarjetas de segmento** (una por segmento, en orden del arreglo), plegadas: nombre · "what it
     does" · cifra grande (ventas del último trimestre, p. ej. "$42.2B · 2Q26 net sales") · ▲ YoY ·
     "% of group revenue". Al abrir: `brief` (3–4 oraciones en lenguaje simple) + lista `sells`
     (3–5 viñetas "**nombre** — qué es").
2. **"How revenue divides"** — gráfica de barras apiladas por segmento, trimestral por defecto, con
   total arriba de cada columna; nota fija debajo de la gráfica; tabla "Revenue detail".
3. Pie `.ov-fynote.sg-src` = `source` del archivo.

- Las tarjetas usan siempre el último trimestre; el crecimiento sigue la unidad de la gráfica.
- **Texto:** la cita del 10-K + `brief` en cada tarjeta. Nada más.
- **No copiar de AMZN:** `overview.interactions` (dato muerto, no se muestra — no escribirlo). Ojo: el
  motor escribe fijo "net sales" (`ovCards`) y "consolidated net sales" (pie de Other) — si la empresa
  dice "revenue", anotarlo en la bitácora para generalizar el motor en un PR aparte (no en el de la
  empresa).

### TL-SEG Segments (`segdrv`)

Pastillas de segmento arriba (primer segmento por defecto). Por segmento, de arriba a abajo:

1. **"What it is"**
   - **FILING:** definición verbatim del segmento (nota de segmentos del 10-K), con `where` y enlace.
   - **OURS — "Our read on it"** (plegado): `summary`, 1–2 oraciones de lectura propia. Editable en el
     portal, pero **solo se guarda en ese navegador** (localStorage) — no es colaborativo; lo que deba
     quedar, se escribe en el archivo de datos.
   - **Top line del segmento** (lo dibuja el motor de Results): ventas y utilidad operativa del
     segmento, Actual por defecto, Summit y Consensus apagados.
2. **"What it sells"** (sub: "N lines") — tarjetas por producto (`products[]`); al abrir, pestañas:
   **Definition** (FILING verbatim, si el 10-K define esa línea) · **Who buys it** (FILING: el párrafo
   del Item 1 sobre esa clase de cliente; CALL: clientes nombrados en llamadas con trimestre; OURS:
   nota; ⚑ concentración) · **Commentary** (CALL: citas de management con trimestre).
   **Cada segmento tiene que contestar "qué vende exactamente y a quién"** (review TSM, SAB
   2026-10-19: "entender qué chips producen de cada segmento, quiénes son los end clients"). Por eso
   `products[]` baja al nivel del **producto concreto** que el lector reconoce (en TSM: el chip — Apple
   A19, NVIDIA Blackwell —, no "HPC"; en Meta: el formato o superficie — Reels ads, WhatsApp Business
   messaging —, no "Family of Apps"), y `customers.named` dice el **cliente final** de cada uno. Lo que
   la empresa no nombra y se arma de SPLC o prensa va con chip OURS y la palabra *estimate*, nunca FILING.
3. **"KPIs the company publishes"** (sub: "N disclosed") — `kpiNote` (qué publica y qué no) ·
   pastillas YoY | QoQ · tarjetas KPI (valor más reciente + ▲ crecimiento; las que no son serie salen
   atenuadas "not a series") · al abrir: **What it is** (definición propia + fuente + periodicidad) e
   **In the filing** (cita **verbatim** si el filing lo define) · gráfica de líneas que sigue al KPI
   abierto.
4. **"Revenue interactions"** (sub: "N relations · M with data") — tarjetas de identidades del tipo
   "ingreso = a × b" (p. ej. capacidad × rendimiento, backlog × conversión). Cada una dice "chart
   inside" o "no series". Al abrir: **What it says** (`why` + `data`) y, si hay ≥ 4 periodos con todos
   los términos, **Chart** con la identidad, un sello `DECOMPOSITION` (un término sale del otro) o
   `INDEPENDENT` (fuentes separadas — usar solo cuando es verdad) y la gráfica puente.
   Las relaciones sin datos se listan igual, con `bridge:null` y `data` que diga "NOT CHARTED".
   **Precio × volumen es obligatoria** en todo segmento donde la empresa publique (o se pueda sacar del
   filing) una unidad y su precio: ingreso = unidades × precio por unidad (TSM: obleas × ingreso por
   oblea; Meta: ad impressions × average price per ad, que Meta da como crecimiento YoY; AMZN AWS no
   la tiene). Y con ella, la **durabilidad del precio** (review TSM, SAB 2026-10-19: "ver si el pricing
   increase que vienen teniendo se puede mantener a través del tiempo"): en la pestaña **What it says**,
   tres cosas con fuente — la serie histórica del precio por unidad, los aumentos anunciados por la
   empresa (con fecha y alcance), y contra qué se mide su sostenibilidad: el **costo por unidad** si se
   divulga (Bottom Line ▸ Expense lines ▸ Unit economics, BL-GEN-5) o el costo del insumo clave (en TSM,
   el precio de las herramientas de ASML, que sube desde 2027). Sin costo por unidad divulgado, se dice
   y no se estima (regla 7).
5. **"What management has said"** — lee la **semilla estática** de Notes (`THEME_SRC` →
   `themes-data/<t>.js`, vía `themesFor`), filtrada por segmento con `THEME_SEG`; **no** lee lo que se
   edita en Notes (Supabase). Orden por Quarter (por defecto) | Theme. Si no hay semilla: "⚑ The theme
   record carries no entries for this segment yet." Por eso depende de EV-NOTES: mientras no exista,
   este bloque muestra esa bandera y TL-SEG se aprueba así.
6. Pie = `source`.

- **Qué decide el analista:** qué KPIs (solo los que la empresa **publica**), qué identidades de
  ingreso, el `summary` de cada segmento, qué productos listar.
- **Reglas de texto:** "FILING" = verbatim y con ubicación (`filingWhere`); "CALL" = de una
  transcripción con trimestre; "OURS" = nuestra lectura, corta. Nunca se mezcla.
- **No copiar de AMZN:** `adjacencies` (no se muestra); un término repetido en `highlights`; la falta
  de utilidad operativa anual por segmento (A16, §9.1); los bloques `summit:{2026…}` de
  `segments-data/amzn.js` (regla 10).

### TL-OTH Other (`segoth`)

Cortes alternativos del **mismo** ingreso total (líneas de producto, geografía…), uno por pastilla.
Por corte: `lede` corta (1–2 oraciones) · gráfica apilada con totales · `note` · **"How the filing
defines it"** (cita verbatim de la nota + definición verbatim de cada serie, chip FILING) · `caveat` ⚑
si aplica (p. ej. "no margin exists for this cut").
- **Regla:** un corte solo anual **debe** declarar `views: ['y']`, o no dibuja nada.
- **Si no hay cortes:** la sub-tab dice "This company publishes no revenue cut beyond its reportable
  segments." — y en ese caso **se omite la sub-tab** (⏭️), salvo que el analista quiera mostrar el
  hallazgo.

### TL-CUS Customers (`segcus`)

Sin gráfica. Cinco secciones (la 5.ª, abajo):
1. **"What the company discloses"** — concentración de clientes: si no se divulga, el recuadro ámbar
   "⚑ No customer concentration is disclosed at all…" + desplegable con la nota y la cita. Eso **es**
   el hallazgo, no un hueco.
2. **"The customer classes it names for itself"** — tarjetas con las clases de cliente del Item 1,
   cada una con su cita verbatim.
3. **"Named on the record"** — clientes nombrados en llamadas (se juntan solos desde
   `products[].customers.named`).
4. **"Who has said they buy from <Empresa>"** — tabla SPLC (cliente · ticker · relación · tamaño ·
   % de su costo · base), solo si hay export SPLC con la empresa como sujeto. **Primero la
   limitación** (cuánto del ingreso cubre), después la tabla.

- **Cómo se carga SPLC:** `py scripts/segments/load_splc.py <TK> <export.csv>` escribe
  `scripts/segments/splc_<tk>.json`; ese contenido se pega en `customers.splc = {customers[], named,
  sized, sizedSumM, revBaseM, revBaseLabel, coverageWhy, source, file}`. `coverageWhy` es la frase de
  cobertura propia de la empresa (el motor ya la usa, con el nombre de la empresa).
- **Concentración:** si `concentration.disclosed` no es `false`, la `note` se pinta como cita FILING:
  tiene que ser verbatim.
- **Sección 5 — "What each top customer buys"** (review TSM, SAB 2026-10-19: "breakdown de los chips
  de cada cliente, ej. Apple"). Tabla, una fila por cliente principal (los 5–10 más grandes que se
  puedan sostener con fuente): Customer · ticker · qué le compra (productos concretos) · segmento ·
  peso estimado en el ingreso (`~x%`, marcado *estimate* salvo que el filing lo dé) · fuente. Si la
  empresa no tiene clientes grandes (Meta: millones de anunciantes), la fila es la **clase de cliente**
  que sí divulga o que la llamada cuantifica (p. ej. anunciantes de China, verticales de e-commerce y
  gaming), con la misma columna de peso; si nada lo cuantifica, la sección dice eso en una línea y no
  inventa la tabla (regla 7).
  - **Datos:** `customers.buys = [{name, tk?, what, seg, share?, shareBasis:'filing'|'estimate', src}]`.
  - **Motor:** `segments.js` **todavía no dibuja esta sección**. La primera empresa que la construya
    (TSM R1) la agrega al motor en un PR propio de motor y se vuelve la referencia; hasta entonces la
    unidad TL-CUS se aprueba sin la sección 5 y queda anotada en Bloqueos ("TL-CUS ▸ sección 5 espera el
    motor").
- "Named on the record" ya ordena del trimestre más nuevo al más viejo (arreglado).

---

## §11 Evolution ▸ Estimates (`EV-EST`)

**Responde:** *¿cómo se movió nuestra visión (y la de la calle) sobre FY26, FY27, FY28?*

**Referencia AMZN:** `resultsEvoHtml('AMZN')` / `initResultsEvo('AMZN')`, bloque `evolution:` de
`results-data/amzn.js`. **Tipo:** motor.

**Requisito:** modelo Summit con **≥ 2 snapshots**. El eje X de esta pestaña son los snapshots del
modelo, congelados en el bloque `evolution` (regla 10). Sin modelo Summit, ⏭️ con razón. No existe un
generador "solo consenso".

**Contenido, por sección** (`top` "Top Line" con `rev` por defecto; `prof` "Profitability" con
`capex` por defecto — AMZN; para otra empresa el analista elige el default):
- Modo `US$B` | `Growth` (% | Amount) | `Margin %`; interruptor "Reported" (apagado).
- Leyenda: un chip por año fiscal (rampa de un solo tono, clara→oscura — los años son ordinales; **no**
  usar la paleta categórica) · Summit (sólida) · Consensus (punteada) · Reported (de puntos).
- Gráfica de líneas: eje X = snapshots con etiqueta de evento ("Dec 18 2025 · post-3Q"), una línea
  por año × fuente; tooltip con la revisión contra el snapshot anterior.
- Tablas "Revision record" y "Snapshot by snapshot" (colapsadas).
- Bloque **"Projection by snapshot"** (requiere ≥ 2 snapshots): la curva de un snapshot, con selector
  de archivo (más nuevo primero) y "⇄ Compare" contra el anterior; tabla "Projection detail".
- Con "Reported" encendido aparece "⚑ FY… still open" para años sin cerrar; si ningún año cerró, el
  botón sale deshabilitado ("Reported ✕").
- Pie: `evolution.note`.

**Datos:** `evolution = { note, vintages:[{label,event}], years, sections,
metrics:{ k:{ label, unit, marginOf?, note, summit:[[…]], cons?:[[…]], prior:{summit:[…], cons?:[…]} } },
actKey? }`. AMZN lo generó con `scripts/consensus/emit_evolution.py` desde el MCP Summit, y **ese es
el camino** (regla 10: Summit congelado, con la fecha de cada snapshot). El script exige que el dataset
ya traiga `estMatrix` con `cons` **y** `summit` y un bloque `evolution:`, y escribe
`out/evolution_<tk>.js` para pegar a mano. Al refrescar (submit nuevo), se agrega el snapshot al eje.
- **`prior` es obligatorio para toda métrica con modo Growth** (el año fiscal previo al primer año
  seguido), o el primer año no tiene crecimiento.
- **El montaje debe pasar el ticker:** `requestAnimationFrame(function(){ initResultsEvo('<T>'); })`.
  Sin el ticker, los botones de Growth/tabla dejan de responder sin aviso.

---

## §12 Evolution ▸ Earnings — Setup · Post-Results · Notes

**Responde:** *¿qué espera la calle de este trimestre, qué pasó, y qué hilos seguimos llamada a
llamada?*

**Referencia AMZN:** maquinaria `ce*` en `amzn.js` (`ceQPills`, `ceSetupBody`, `ceResultsBody`,
`ceWatchBody`, `ceAnnualBody`, `gBuildCeAnnual`, `wireCallEarnings`, `wireCeTrack`, `wireThemeRecord`,
el editor ✎ y la persistencia del theme record; montaje en `deepDiveHtml` y `wireDD`). **Tipo:** a
medida: se **re-extrae de `amzn.js` por símbolo** (la cerradura de dependencias de esas funciones),
no por rango de líneas, y se cambian los datos.

**No copiar `sharkninja-ce.js` tal cual:** está desactualizado (no trae `amznSyncSegOrder` y conserva
"(Summit pending)"). Usar **su encabezado como la lista de cambios** a aplicar sobre la extracción
fresca: datos en `./<t>-ce-data.js` (`CE_CONS`, `CALL_EARNINGS`); `AMZN_THEMES` → `<T>_THEMES`;
`CE_MARGIN_DEN` / `CE_STMT_ORDER` / `CE_TOPLINE` con las líneas de la empresa; `ceGuessTarget` con sus
temas; `ceFmtV` / `ceTkFmt` con la unidad de la empresa ($M o $B); dataset `AMZN_SETUP` → `<T>_SETUP`;
cada `'AMZN'` → `'<T>'` y los helpers `amzn*` → `<t>*`; el texto "Custom KPIs — <T>".

**Orden en pantalla:** Evolution abre en **Earnings** (activa) · Results · Estimates.

Arriba de las tres fases: pestañas de fase `Setup` (activa) · `Post-Results` · `Notes`, y pastillas de
trimestre (más nuevo primero; Post-Results solo muestra trimestres ya reportados; Notes oculta las
pastillas porque no es por trimestre).

**Datos que alimentan Earnings:**
- `CE_CONS = { src, asOf[], q[] ("Q4 2022"…), hz:['4q out','3q out','2q out','1q out'], nHead (= 9
  métricas de encabezado), m:[{ k, u, t, qr:[[4q,3q,2q,1q]…], qa, qy, qq }] }` (`qa` = el real). **No
  hay generador en el repo.** Patrón a seguir (el de SN, `sharkninja-ce-data.js`): **armarlo al cargar**
  desde `<t>Results` con una lista `LINES` + una función `series()`, sin teclear números. Hoy eso llena
  solo la columna "1q out"; las columnas de revisión (2q–4q out) saldrían de `estMatrix.cons` (nadie lo
  hace todavía: si se necesita, es código nuevo y se dice en el PR).
- `CALL_EARNINGS = { ticker, quarters:[ { q:'Q3 2026', status:'upcoming'|'reported', date,
  setup:{ us, notes, source, asOf }, results:null|{…}, call:null|{ prepared:[{topic, body}],
  qanda:[{analyst:'Nombre · Banco', q, qFull, a}], highlights, newQuestions } } ] }`, más nuevo primero.
  `setup.us` son los números Summit del trimestre → regla 10: **se congelan del MCP**, del snapshot
  más reciente antes del print, con la fecha en `setup.source` (§EV-SET). Nunca tecleados a ojo.
- `js/results-data/<ticker>-setup.js` — copia de `amzn-setup.js` con **una sola sección de clave
  única** (`'setup'`, etiqueta "All tracked lines", todos los periodos; nunca `top`/`margins`, que
  chocarían con Results). Se registra como `<T>_SETUP` en `RESULTS_DATA` (`results.js`).

**Mecánica de trimestres (no evidente):** la rejilla de Setup solo aparece si `CE_CONS.q` contiene el
trimestre; Post-Results muestra un trimestre solo si `results` no es `null` (no basta `status:'reported'`);
el trimestre "upcoming" nuevo se agrega cuando el Post-Results anterior ya está lleno.

### EV-SET Setup (antes del print)

1. Chip "① Pre-Call" (gris "frozen" si el trimestre ya se reportó).
2. **Barra "Estimates":** Consensus | Summit | Both (Consensus) · YoY | QoQ | Off (YoY) ·
   Margin | Hide mgn (Hide).
3. **Dos rejillas:** "Headline — every company, always" (9 métricas fijas: Revenue, Gross profit,
   Operating income, EBITDA, EPS (diluted), Operating cash flow, Capex, D&A, Diluted shares) y
   "Custom KPIs — <TICKER>" (las propias: ventas y utilidad por segmento, o los KPIs de la empresa).
   Cada celda: mini-tabla Street | Summit, chips de crecimiento, fila de margen (si aplica) y un `?`
   con la advertencia de esa métrica (`setup.notes[métrica] = {t, h}`).
4. **"The Setup picture — reported vs Summit vs Street: pick any line, window the period with the
   lever, toggle margins"** (`ceAnnualBody`) — segunda instancia del motor de Results con el dataset
   `<T>_SETUP`.
5. **Consensus Evolution** — revisiones de la calle por snapshot de BBG (`consensus-evolution.js`,
   datos en `consensus-evolution-data.js`). **No montarlo** si `CONSENSUS_EVO['<T>']` no existe: el
   archivo dice "GENERATED" pero no hay script, solo trae AMZN, y `GROUPS`/`SEG` del módulo tienen las
   claves de Amazon (SN lo monta y sale vacío — no repetirlo). Agregarlo para otra empresa es un
   generador nuevo (pendiente, PR aparte).

- **Fuentes:** Street = BBG (archivo, vía `CE_CONS`); Summit = snapshot más reciente del modelo antes
  del print, **congelado** en `setup.us` (regla 10), con la fecha del snapshot en la `source` del
  trimestre. `?` = 8-K de guía + la llamada anterior.
- **Regla:** las claves de `setup.notes` son **exactamente** los nombres de `CE_CONS.m[].k`; una nota
  con una clave que no existe no se ve.
- **No copiar de AMZN:** `setup.us` tecleado a mano de un snapshot viejo y sin fecha (A17); la
  clave huérfana "Advertising" en `setup.notes`; el texto "Custom KPIs — AMZN" y
  `consensusEvo.html('AMZN',…)` fijos.

### EV-POST Post-Results (después del print)

Por trimestre reportado:
1. Chip "② Post-Results".
2. **"The print — down the income statement"** (`?` "How this is built"): controles View Cards | Chart
   (Cards) · Basis vs Street | vs Summit | Both (vs Street) · filtro All | Beats | Misses | In line ·
   orden Statement order | By surprise · Lines All | Top line | Bottom line · Margin · Growth. Cada
   tarjeta: métrica + veredicto (**|sorpresa| < 2 % = in line**), tabla Street | Summit | Actual con
   valor / crecimiento / margen. Solo en Cards: Margin | Hide mgn (Margin) y YoY | QoQ | Off (YoY).
   En Chart: barras divergentes de sorpresa en un solo eje %.
3. **"Call Summary"** (plegado) — *By Prepared Remarks* (tema + cuerpo) | *By Analyst Question*
   (pregunta; al abrir: 🏦 banco + analista, **Q** completa, **A** con la voz directa de management,
   partes clave en negrita). Cada punto con "＋ add note".
4. **"📝 Propose Notes"** (plegado) — tarjetas con los temas nuevos de la llamada
   (`call.newQuestions`), cada una con Theme / Sub-theme sugeridos y texto editable; ✓ Accept / ✕
   Reject; **"Publish to Notes →"** las archiva en Notes.
5. **"Also on the call"** (plegado) — los demás puntos (`call.highlights` que no sean `band:'lead'`),
   cada uno con "＋ add note"; "Still open" es el campo `open` del punto (se muestra en el detalle),
   no un control.

- **Fuentes:** actuals del 8-K; Street/Summit como en Setup; Call Summary de la **transcripción**
  (`docs/calls/<TICKER>-latest.md`, o Quartr). Las respuestas de management son **citas directas**,
  no resúmenes con voz de Claude.
- **Qué decide el analista:** qué temas se proponen como notas y a qué tema se archivan.
- **No copiar de AMZN:** `ceGuessTarget` tiene expresiones regulares de Amazon (agentic, AWS…) —
  reescribirlas para la empresa; los campos `results.notes/watch/thesisCheck…` no se muestran: no
  gastar tiempo llenándolos.

### EV-NOTES Notes — ver §24 para las reglas de uso

Lo que se construye en esta unidad: el registro de temas de la empresa (`js/themes-data/<ticker>.js`,
semilla), el orden de temas (`<T>_SEG_ORDER`), el montaje de `ceWatchBody`, y el **registro de la
semilla en `js/segments.js`** (`THEME_SRC` + `THEME_SEG`, §10) para que Top Line ▸ Segments la lea.
Contrato de la semilla: `export var <T>_THEMES = [{ seg:'<tema>', theme:'<sub-tema>', st:{ k:'trend'|'promise'|'watch',
since, last }, why, updates:[{ q:'Q2 2026', items:[…] }] }, …]`. Contenido:
1. Banda "▤ The theme record — every thread, across all calls".
2. Vista **By theme** (por defecto) | **By quarter**; filtro "Since"; filtro de ganchos All | Open
   hooks | Closed.
3. By theme: un acordeón por tema (= segmento o eje del negocio), dentro un sub-tema por hilo con
   chip de estado — `Confirmed trend` · `Promise — reconcile` · `Watch` — y su edad ("tracked 3
   quarters"); `why` en cursiva; notas agrupadas por trimestre; botón "✎ Edit / Add note".
4. Panel "✎ Edit notes & tracking" (plegado): crear/borrar tema y sub-tema, ventana de seguimiento
   (since / until), agregar/editar/borrar notas.

- **Semilla:** solo notas **reales** de llamadas ya ocurridas, con trimestre. Un tema sin notas no se
  siembra como marcador vacío.
- **Requisitos fuera del código:** la empresa tiene fila en `companies` y la tabla
  `company_theme_record` existe (sql 011, ya corrida — no requiere SQL nuevo).

### Rutina por cada print (después de entregado el perfil)

1. **Antes:** trimestre nuevo al **frente** de `CALL_EARNINGS.quarters` con `setup`; guía
   (`guideLo/Hi`) del último 8-K; regenerar `estMatrix.cons` (receta §9.1) — `CE_CONS` se rearma solo
   al cargar.
2. **Print + llamada:** `act` en Results; marcar el trimestre `reported` + `results:{}` + `call:{…}`;
   regenerar `estMatrix.cons` con el snapshot post-print; revisar el mapa F0-SM si hubo submit nuevo;
   rotar `docs/calls/<T>-latest.md` a `<T>.md`.
3. **Notas:** se archivan en el portal (Propose Notes / ＋ add note), no editando la semilla.

---

## §13 Bottom Line — 3 sub-tabs

**Responde:** *¿dónde deja el ingreso de ser ingreso?*

**Referencia AMZN (`amzn.js`):** `aMarginsBody`, `aBridgeBody`, `aNetBridgeBody`, `aSbcBody`,
`expenseTabsBody`, `aBlFootGeneral` (General); `segmentsBody`, `aBlFootSegments` (Segments);
`aSplcBody` (Supply Chain); sus builders en la rama `bottomline` de `aBuildSub` (`aBuildMargins`,
`aBuildExpenses`, `aBuildSegments`, `aBuildSplc`); datos `js/overviews/amzn-bbg.js`. **Tipo:** datos
generados + vistas a medida (se copian de AMZN; no hay motor compartido). `dhr-chartkit.js` extrajo
parte del andamiaje, pero trae el selector viejo (`dPicker`) y colores fijos (`D_SEG`): **no usarlo
como base**; se copia de AMZN.

**Datos de Bloomberg:** `js/overviews/<ticker>-bbg.js`, **generado** por `scripts/bbg_extract.py`
desde `BBG_CONSENSUS.txt` (no se edita a mano). Cómo correrlo:
- **Requisito:** la empresa tiene que estar en `BBG_CONSENSUS.txt`. Si no está (caso DHR), no hay
  export: Bottom Line se arma con lo reportado (`results-data` + filings), sin forward de consenso, y
  se dice en el pie (precedente: `dhr.js`).
- `SRC` está **fijo en el código** (`G:\Mi unidad\…`, sin argumento ni variable de entorno): cambiarlo
  a la ruta de esta máquina (`<letra>:\My Drive\…`) — es un cambio al script, se menciona en el PR.
- `py scripts/bbg_extract.py <TICKER>` (`python` es un alias roto; el docstring dice `python`). Solo
  usa librería estándar; con Python 3.14 no se ha corrido completo. **Ojo:** escribe
  `js/overviews/<ticker>-bbg.js` y sobrescribe si ya existe.
- **`SEGNAMES`** usa los ids numéricos de segmento de Bloomberg: correrlo una vez, leer los `seg<id>`
  que imprime, y mapearlos (`'<T>': {'227465':'aws', …}`).
- **`CODE`** mapea el **código de campo de Bloomberg** (`codeN`, p. ej. `CB_IS_OTHER_OPEX`), no la
  etiqueta `metricN`; lo que no esté en `CODE` sale con el nombre de la etiqueta. Revisarlo contra
  la empresa (está pensado para Amazon).
- La fila se busca con `startswith(ticker)`: un ticker corto puede chocar con uno largo (SN / SNOW).
  Verificar que tomó la fila correcta.
- Los trimestres se etiquetan por calendario: si el año fiscal no cierra en diciembre, salen mal
  etiquetados — anotarlo en F0 y corregir en la vista.
- El export cambia con cada snapshot: anotar el `asOf` usado.
- **Contrato:** `export var <tk>BBG = { asOf:'M/D/YYYY', yearsA[3], yearsF[3], qtrs[9], segIds,
  is:{ k:{ a, f, qA, qF, q } }, seg:{ … } }`. Solo trae 3 años reales + 3 estimados.

**Datos de filings, a mano y con fuente** (permitidos por la regla 10): las líneas de gasto funcional
**históricas reportadas** y ventas/utilidad por segmento (como `A_OPEX` anual FY18–25 y `A_OPEXQ`
trimestral de AMZN — son cifras reportadas, aunque AMZN las tomó de la hoja de su DCF: en la empresa
nueva se toman del 10-K/10-Q y se cita el filing); notas del 10-K (`A_TENK`: capex y PP&E por
segmento, SBC por función). Las mini-barras de ~8 años de Expense lines salen de aquí (BBG no llega
tan atrás).

**Lo que viene del modelo Summit** (regla 10, congelado): las acciones diluidas del modelo
(`A_SUMMIT_SHARES` en AMZN) y las series `summit` que AMZN lee de `results-data` (`aSummitAnnual`,
`aSegSummitAnnual`, `aBuildSegFc`). En la empresa nueva salen del mismo `results-data` congelado
(§9.1) y, si hace falta algo más (acciones), de un bloque con la fecha del snapshot en el módulo de
Bottom Line. Nada de avisos "Live data pending" para Summit.

### BL-GEN General (`margins`, activa por defecto)

**Las vistas van apiladas y visibles, sin selector** (SAB, 13 oct 2026; `aGeneralPicker` quedó en el
archivo pero ya no se monta): *Profitability & margins* → *The bridge — revenue → operating income* →
*Operating income → net income* → *Stock-based compensation* → el colapsable "Expense lines — the N
functional deep dives (unit economics, drivers, calls)" → el pie del panel (`aBlFootGeneral`).

**BL-GEN-1 Profitability & margins**
- Desplegable: Gross profit · **Operating income (GAAP)** (por defecto) · EBITDA · Net income (GAAP) ·
  Free cash flow — agrupado en optgroups (Profit / Cash), como ya lo hace AMZN.
- En trimestral, Operating income sale de `results-data` (Actual / Summit / Consensus); las demás
  métricas trimestrales salen del export de BBG (sin Summit).
- Modos: Period Annual (por defecto) | Quarterly · Net Reported | Normalized (**solo visible cuando la
  métrica es Net income y el periodo anual**) · rangos All · Reported · Forward · Last 5.
- Leyenda: un chip por fuente (Actual · Summit · Consensus) que oculta barra **y** línea de margen.
- Gráfica: barras = $ (eje derecho), líneas = margen % (eje derecho exterior); periodos futuros
  desvanecidos (`aFadeC`), tooltip con "(E)"; zoom en ambos ejes.
- Tabla "Data — what the chart draws" (colapsada) con lo que se dibuja.
- **Normalized:** resta la ganancia no operativa después de impuestos, a la tasa efectiva del
  periodo. ⚠ En el export de BBG `otherNonOp` está con signo de **gasto**: una ganancia viene negativa
  (`G = −otherNonOp`). Si no se invierte, una ganancia de $53B se dibuja como pérdida.
- **Regla:** cada serie con su definición; si la base difiere, la etiqueta lo dice (AMZN ya etiqueta
  "Model earnings (adj.)").
- **No copiar de AMZN:** años y etiquetas tecleados (A12, en parte abierto: `'$356B · 49.7%'` en las
  pestañas de gasto, `EW_LABS` ’18–’25, chips del explorador de segmentos, años en `aBlFootGeneral`) —
  derivarlos del dato; el pie que cita "DCF AMZN.xlsm".

**BL-GEN-2 The bridge** (`.ov-sec-h` "The bridge — how revenue becomes operating income")
- Modos: **Build-up ($B)** (por defecto) · Margin change (bps) · Forward (expenses) · Cost structure
  (abajo).
- Build-up: cascada Ingreso → − cada línea de gasto funcional → Utilidad operativa; Annual (año más
  reciente por defecto) | Quarterly (año + trimestre; los no reportados deshabilitados).
- bps: margen del año "From" → contribución de cada línea en bps (verde/rojo) → margen del año "to".
- Forward: año estimado + 5 sliders (±25 %) por línea contra consenso; el resto es un residual fijo,
  así con todo en 0 cuadra con el consenso; "Reset to consensus".
- Tabla "The waterfall — every step" (Step | Value | Running), colapsada.
- **Líneas de gasto:** las del MD&A de la empresa (sus nombres), no las de Amazon.
- **COGS separado de los gastos operativos** (review TSM, SAB 2026-10-19: "desglosar COGS de los
  expenses en el portal"). En toda vista del puente, el **costo de ventas** va primero y aparte, con
  subtotal **Gross profit**, y después los gastos operativos (R&D, S&M, G&A, otros):
  Ingreso → − costo de ventas (por componente, si el filing lo da) → **Gross profit** → − cada gasto
  operativo → Utilidad operativa. Los componentes del costo de ventas salen de las notas del 10-K/20-F
  (TSM: depreciación, materiales, mano de obra, overhead; Meta: el MD&A explica el cost of revenue por
  infraestructura — depreciación, energía, personal de data centers —, pagos de contenido y de
  partners); si el filing solo da el total, va una sola barra y la nota lo dice.
- **Cuarto modo: "Cost structure"** — barras apiladas en % del ingreso a lo largo del tiempo (anual por
  defecto | trimestral): los componentes del costo de ventas en una familia de tonos y los gastos
  operativos en otra, con la línea de margen bruto y la de margen operativo encima, y la tabla
  "Cost structure — every line" (colapsada) con lo que se dibuja. Responde "¿lo que se movió fue el costo
  de producir o el gasto de operar?". Datos: los mismos de filings (`A_OPEX`/`A_OPEXQ` + las notas).
  AMZN no tiene este modo: es código nuevo sobre el andamiaje de `aBuildMargins` (TSM R7 lo construye
  primero y queda de referencia).

**BL-GEN-3 Operating income → net income** — cascada Op. income → interés neto → ganancias de
inversiones (ámbar) → impuestos → otros → Net income; toggle Reported | Normalized; año (estimado más
cercano por defecto); leyenda dinámica de **≤ 3 oraciones** con margen neto reportado vs normalizado y
la fuente al final, sin fechas fijas (la de AMZN pasa de 3 oraciones, habla de Anthropic y trae "as of
Aug 2026" tecleado — no copiar).

**BL-GEN-4 Stock-based compensation** — vista Dilution (por defecto: barras SBC + líneas de acciones
diluidas — hoy solo consenso; la línea Summit queda pendiente, ver arriba) | SBC by line (apiladas por
función); unidad $B | % (de ingreso en Dilution; del SBC total en By line). Leyenda clicable en ambas
vistas y rango del eje derivado del dato (AMZN ya lo hace). **No copiar:** el eje de acciones a la
**izquierda** (va a la derecha, §17.3).

**BL-GEN-5 Expense lines** (colapsable al final, cerrado: "Expense lines — the N functional deep dives")
- Explorador con una pestaña por línea de gasto (color · nombre · `$X · Y% of revenue` calculado del
  dato, no tecleado). **El costo de ventas es la primera pestaña**, separada de los gastos operativos
  y abierta en sus componentes (mismo criterio que el puente). Por línea, de arriba a abajo:
  1. KPIs (3–4): monto y % de ingreso · cambio en margen YoY (ppt) · SBC incluido · el dato distintivo.
  2. **"How the 10-K defines it"** — cita verbatim del MD&A, con fuente.
  3. **"What sits inside this line"** — 1–2 cajas.
  4. **"Share of revenue over time"** — mini-barras de los últimos ~8 años.
  5. **"Unit economics"** — el flujo de costo por unidad **si se divulga**; si no, decirlo ("does not
     disclose a dollar cost-per-unit") — nunca estimarlo.
  6. **"Why it matters to the bottom line"** · 7. **"Why it has moved — the drivers"**.
  8. **"What management has said"** — citas con trimestre, de `docs/calls/`.
  9. Pie `.ov-foot`.
- **Qué decide el analista:** cuáles son las líneas, qué entra en unit economics y drivers.

**Pie del panel General** (`aBlFootGeneral`, ya existe en AMZN): "Sources — Bloomberg consensus export
(as of <fecha>); <filing> MD&A and notes; Summit DCF model (snapshot <fecha>)." — con años
derivados del dato.

### BL-SEG Segments (`segments`)

**Apilado, sin selector:** *Operating income & margin by segment* → *Revenue vs profit — common size* →
*The segment bridge* → el colapsable "Segment deep dives — …" → el pie (`aBlFootSegments`).
1. **Profit by segment — Actual vs Summit vs Consensus:** métrica Operating income | EBITDA; pastillas
   de segmento (el más relevante por defecto) + Consolidated; Annual | Quarterly. Barras $ + línea de
   margen. Trimestral + EBITDA dibuja trimestral (AMZN ya lo arregló). Summit = serie congelada.
2. **Revenue vs profit — common size:** métrica Revenue | Operating income | EBITDA; Basis · Show $B |
   Share | Growth · Layout · Period · Compare · Growth in (los controles que no aplican se ocultan).
   Basis = Summit obliga a anual y esconde Period; EBITDA esconde Basis.
3. **The segment bridge:** Historical (utilidad del año "From" → Δ por segmento → año "to") | Forward
   (vs Consensus | vs Summit, con sliders por segmento; AMZN: ±30 %, AWS ±40 %).
   vs Summit usa la serie congelada. Si una base cae a la otra por falta de dato, **la nota lo dice** (AMZN cae
   de Summit a BBG en silencio — no copiar).
4. **Segment deep dives** (colapsable): pestaña por segmento con KPIs, "The business", margen en el
   tiempo, "What moves it", la definición verbatim de la nota de segmentos, estructura de costos
   ("what the company breaks out — and doesn't"), citas de llamadas y pie.
- **No copiar de AMZN:** los desplegables de segfc/segoi sin `<optgroup>` (§17.2 #4).

### BL-SPLC Supply Chain (`supplychain`)

Solo si la empresa es sujeto en un export SPLC de proveedores; si no, ⏭️ (no se publica vacía).
1. KPIs (5): proveedores rastreados · instalaciones · % en EE. UU. · % en China · relación más grande.
2. **Cadena 1** (la más estratégica): tarjetas por proveedor con barra de tamaño relativo, % del costo,
   dependencia; clic → modal con la lectura.
3. **Cadena 2:** tabla Supplier | Relationship | <T> cost % | Their exposure | Category (con el
   componente de tablas `.rs-ft` de §18 — AMZN usa `.ce-tbl`, no copiar).
4. **"Who needs whom"** — barras de dependencia de ingreso del proveedor respecto a la empresa.
5. Geografía: barras horizontales por país (% de instalaciones), con tabla.
6. Pie: "Source: Bloomberg Supply Chain Analysis (SPLC), <TICKER> US Equity, as of <fecha>.
   Relationship sizes are Bloomberg estimates; directional, not audited."
- **Primero la limitación**, si la cobertura es baja.
- **Datos:** el lado de proveedores **no tiene cargador** (`load_splc.py` solo hace clientes): los
  arreglos `A_SPLC_*` se compilan a mano desde el export, con `as of`.

---

## §14 Valuation — 4 sub-tabs

**Responde:** *¿cuánto vale, y contra qué?*

**Referencia AMZN:** `amzn-histmult.js` (montado por `valuationHistBody`), `valuationPeersBody` (en
`amzn.js`), `amzn-target-multiple.js`, `amzn-sensitivity.js`. **Tipo:** a medida (copiar el módulo de
AMZN y cambiar datos). **Base: AMZN, no SN** — los módulos de SN rompen la regla 10 (múltiplos BBG
congelados en `sharkninja-histmult.js`, `MOCK_*` en `sharkninja-target-multiple.js`, múltiplos
sembrados en `sharkninja-peers.js`). De SN solo se toman las dos piezas de la tabla §7.4.

**Registro de un módulo nuevo** (en `<t>.js`): el `import`, el `<div class="ovt-subpane">` en
`deepDiveHtml` y la rama en `aBuildSub` (`<t>HistMult.init(root)`, etc.).

**Qué se publica hoy (14 oct 2026), para una empresa nueva:**

| Unidad | Hoy | Por qué |
|---|---|---|
| VA-HIST | se construye y se aprueba con el aviso | tiene estructura útil; el analista la aprueba en el portal con el aviso (Claude puede revisar la gráfica internamente con `?mockmarket=1`); solo falta desplegar `get-market-history` |
| VA-PEERS | se construye completa | `liveQuote` ya funciona |
| VA-TM | se construye completa | valuación y filas del modelo congeladas del MCP (regla 10) |
| VA-SENS | se construye completa | un snapshot Summit congelado (regla 10) |

AMZN muestra hoy VA-TM y VA-SENS con avisos de pendiente (el interruptor `TM_LIVE_READY = false` de
`amzn-target-multiple.js` cambia todo el panel por `tmBlockedBody()`): eso se armó esperando el camino
en vivo, que ya no va a existir (regla 10, 15 oct 2026). Para una empresa nueva **no se copia la
compuerta**: el panel sale con los datos congelados.

### VA-HIST Historic Multiple (`histmult`, activa por defecto)

- **Contenido:** título "Historic Multiple" + pista "P/E and EV/EBITDA, forward and trailing — click a
  chip to drop one" · base Forward NTM (por defecto) · Current FY · FY+1 · FY+2 · FY+3 · base Trailing
  LTM (por defecto) · Last FY · densidad Daily (por defecto) · Quarterly · Annual · rangos 1Y 2Y 3Y 5Y
  All · slider de fechas (arriba de los chips) · chips P/E fwd · P/E trail · EV/EBITDA fwd · EV/EBITDA
  trail (+ "Average over the range" cuando hay una sola línea; + "Fiscal-year rolls") · botón "↕ Full
  scale — reframe" (cuando se recortan picos) · gráfica de líneas (P/E eje derecho interior, EV/EBITDA
  exterior; insignias con el valor actual) · lectura de rango (mín–máx, actual) · tabla "Detail"
  (colapsada, trimestral/anual, más nuevo primero) · pie con cómo se construye cada línea y de dónde
  sale cada dato. Estado inicial: NTM · LTM · Daily · All · tabla cerrada.
- **Camino de datos — en tiempo real (decisión SAB, 2026-10-13), el de AMZN:**
  - **En vivo** vía `get-market-history` (Massive), con `fetchPriceHistory(t, from, to)` y
    `fetchRatiosHistory(t, 20)` de `api.js`: precio diario; por trimestre, acciones = `market_cap ÷
    price` y deuda neta = `EV − market_cap`.
  - **Denominadores** (archivo, permitidos): de `results-data/<t>.js` — EBITDA y EPS reales
    (`views.y.metrics.ebitda.act`, `views.q.metrics.eps.act`) para trailing; consenso
    `estMatrix.cons` para forward; fechas de reporte de `estMatrix.vintages[].lastActual`.
  - **Regla:** el P/E forward necesita **EPS anual por snapshot** (`estMatrix.cons.y.eps`). AMZN lo
    arma sumando 4 trimestres de un mismo snapshot y por eso su NTM sale vacío — no copiar eso.
  - **Rechazado:** el camino de SN (múltiplos diarios **congelados** de Bloomberg,
    `<ticker>-bbg-multiples.js`). Son números de mercado escritos en el código.
- **Mientras `get-market-history` no esté desplegada** (solo San/Oscar pueden): la sub-tab se construye
  y se aprueba en el portal tal como se ve (Claude puede revisar la gráfica internamente con
  `?mockmarket=1`, §7.3); en el portal real muestra
  `<div class="rs-noguide">⚑ Live data pending — price history service not deployed yet</div>`. Va a
  Conexiones pendientes. **Un aviso por fuente que falte y con la razón real** (AMZN usa una clase gris
  propia `.hm-notice`, dice siempre "not deployed yet" ante cualquier error, y si solo fallan los
  `ratios` las líneas de EV/EBITDA desaparecen sin aviso — no copiar).
- **Qué decide el analista:** base GAAP vs ajustada; qué horizontes tienen sentido (los que no tienen
  dato se deshabilitan con la razón — la pieza que se toma de `sharkninja-histmult.js`).
- **Si falta el dato:** las líneas sin denominador no se dibujan; nunca un 0× inventado (AMZN ya trae
  la guarda en `numerAt`).
- **Al copiar, cambiar:** `'AMZN'` y `START` fijos; `fyEndDay` (asume año calendario — si la empresa no
  cierra en diciembre, cambiarlo); el `<style>` en línea y los hex (`#8A93A0`, `#C0392B`) → tokens.

### VA-PEERS Peers (`peers`)

- **Contenido:** `.ov-lede` (~1–2 oraciones: "The peer map. The same live-cap scatter as the
  Overview, kept beside the valuation work…") · el mismo mapa que OV-6 (mismo estado: quitar un peer
  aquí lo quita allá) · **tabla "The numbers behind the map"** (abierta): Peer · múltiplo activo ·
  crecimiento · market cap · vs peer avg; filas de promedio y mediana **sin** la empresa del perfil.
- **Datos:** `A_PEERS` (regla 10 — sin múltiplos ni market cap escritos), campo por campo: `tk` · `n`
  nombre · `epsT`/`epsF` EPS trailing (filing) / forward (BBG) · `ebitdaT`/`ebitdaF` igual · `gt`/`gf` crecimiento de ingreso trailing/forward en % · `asOf` y `src`
  de esos datos · `hl: true` solo para la empresa · `why` una oración para el tooltip. Los múltiplos,
  el market cap y el EV salen de `liveQuote` en vivo (OV-6).
- **Excepción aceptada:** sin zoom ni ocultar-por-leyenda (los chips × cumplen esa función).
- **Pie:** `.ov-foot` con la fuente y fecha de los denominadores y "price live" (AMZN ya tiene pie).
- **No copiar de AMZN:** el lede que dice "seeded approximations… not live"; los ejes fijos (OV-6).

### VA-TM Target Multiple / PEG (`targetmult`)

- **Bloque A — "Target Multiple — revision log":** desplegable agrupado (*Year-end price target* ▸
  price target · EV/EBITDA vs P/E spread; *Model underlying* ▸ Revenue/EBITDA/Net earnings/EPS FY+1)
  · fuente del múltiplo (Recorded | Live) · lectura (unidad | Change, % | Amount) · año forward ·
  Snapshots All | Revisions only · entradas Live (EV/EBITDA, P/E, deuda neta — se llena del quote) ·
  aviso rojo si el año forward tiene un cambio de definición · gráfica por snapshot (puntos llenos =
  revisión real; huecos = re-lectura sin cambio) · tabla por snapshot (abierta) en tres bandas
  (encabezado · EBITDA · Earnings) · pie.
- **Bloque B — "PEG":** PEG ratio · sus dos insumos; base P/E ÷ crecimiento de earnings | EV/EBITDA ÷
  crecimiento de EBITDA; marcas 1.0 / 2.0; crecimiento ≤ 0 → "PEG meaningless" (nunca un ratio sin
  sentido); tabla; pie propio.
- **Datos — todo del modelo Summit, congelado (decisiones SAB, 2026-10-13 y 2026-10-15):** por año forward, una fila por
  snapshot con `rev`, `ebitda`, `earn`, `sh` (más el año previo para el PEG) **y la valuación de ese
  submit**: múltiplo objetivo (EV/EBITDA y P/E), precio objetivo y sus supuestos, tal como estaban en la
  hoja Output del modelo en esa fecha. La valuación sale de `get_valuation_history` del MCP (campos fijos:
  `method`, `multiple`, `target_year`, `multiple_basis`, `price_target`, `fair_value`, `upside_pct`,
  `quality_flags`, más `current_price` y `wacc` por snapshot — §6.3); las filas del modelo, de
  `get_fundamentals` / `get_snapshot` con el mapa F0-SM. Todo va congelado en
  `<t>-target-multiple-data.js`, con el snapshot de cada fila. El eje X son los
  snapshots; el año forward de trabajo = `target_year`. Un método con `quality_flags` se dibuja con la
  advertencia, nunca como dato limpio.
- **Estado al 16 oct 2026 → se construye.** La valuación está en el MCP (Oscar, 14 oct) y se congela
  (regla 10). Antes de congelar, confirmar que el MCP ya reingestó el último submit del workbook
  (comparar contra la hoja Output): si el analista corrigió la valuación y el MCP no la tiene, se
  espera a la reingesta en lugar de congelar la versión vieja.
- **Regla clave:** **nunca un múltiplo ilustrativo ni elegido a mano.** AMZN conserva detrás de su
  compuerta `SNAP_DATA`, `SNAP_2026`, `MOCK_*`, `REALIZED` (14.8× / 26.5×, ilustrativos) y múltiplos
  Live por defecto 14 / 32 — nada de eso se copia. El modo "Live" que recalcula con el precio en vivo
  se mantiene como lectura secundaria, no como sustituto del múltiplo del modelo.
- **Qué decide el analista:** el año forward de trabajo (ciclo de escritorio 1 nov → 31 oct) y si un
  cambio de definición rompe la comparación. **Los múltiplos objetivo no los decide el analista aquí:**
  son los del modelo.
- **Sin modelo Summit:** ⏭️ (no hay de dónde sacar el múltiplo objetivo).
- **Cuando se construya:** rastrear de dónde salió la deuda neta (`_ndSrc` de
  `sharkninja-target-multiple.js`: deck · live · input) para que el pie nunca diga "from the live quote"
  si la llamada falló (A23).

### VA-SENS Sensitivity Analysis (`sensitivity`)

- **Estado al 16 oct 2026 → se construye** con un snapshot Summit congelado (regla 10). AMZN tiene el
  modelo (`M`, `SHARES`) escrito en el código **sin fecha de snapshot**, y los múltiplos de salida
  (12 / 30) elegidos a mano, con un pie que dice "The exit multiple is your input" — eso no se copia: el
  bloque congelado lleva su snapshot y el múltiplo por defecto es el del modelo.
- **Contenido:** año de valuación (el año forward que decida el analista; AMZN arranca en 2028 con
  años 2026–2029) · Assumptions: Summit model |
  Street consensus · Exit multiple on EV/EBITDA | P/E · valor del múltiplo · ejes X e Y: cada uno elige
  un driver (crecimiento o margen de un segmento, o el múltiplo), "starts at", "step", reset · franja
  "Held at …" con todo lo que queda fijo · **rejilla 5×5** de precio implícito con ±% vs precio en vivo
  (verde arriba, rojo abajo; tooltip con la cadena EBITDA × múltiplo = EV → equity → $/acción) ·
  tarjeta de comparación con la otra base ("What consensus assumes") · tarjetas del mismo caso base en
  4 años · nota · pie.
- **Datos:** de **un** snapshot Summit, **congelado** del MCP con el mapa F0-SM, en
  `<t>-sensitivity-data.js` con la fecha del snapshot: por año (base + 4)
  y por segmento `rev`, `op`, `eb`; más `corp`, `earn`, `tax`; acciones; el múltiplo de salida por
  defecto = el múltiplo objetivo del modelo (`get_valuation_history`, §6.3). Los drivers y su paso son configuración
  de la vista (no datos) y sí van en el código. D&A por segmento = `eb − op`, fija.
- **Regla clave:** el consenso (`CONS`) **no puede ser marcador**. AMZN ya oculta el botón Street
  (`consPlaceholder()`) y muestra "⚑ Live Street figures pending", pero `CONS.v` con números inventados
  sigue en el código (A24, en parte): no copiarlo. En una empresa nueva se conecta al export de BBG por
  segmento, o la opción Street consensus no existe.
- **Pie:** "Live price and net debt via Massive" solo si la llamada respondió (A23); el múltiplo de
  salida se describe como el del modelo.
- **Si la empresa no reporta utilidad por segmento:** la estructura de `sharkninja-sensitivity.js`, sin sus datos (drivers de crecimiento por categoría
  + un margen consolidado).
- **Qué decide el analista:** drivers, pasos y ejes por defecto. El múltiplo de salida arranca en el
  del modelo; el lector lo puede mover en la vista.
- **No copiar de AMZN:** que el EBITDA de Sensitivity (suma de segmentos) no cuadre con el de Target
  Multiple (consolidado) sin decirlo — si difieren, el pie lo explica (A26). (Los inputs tras un reset y
  el bloqueo de X = Y — `keepDistinct` — ya están arreglados en AMZN.)

---

## §15 Management — 4 sub-tabs

**Responde:** *¿quién la dirige y qué ha hecho?*

**Referencia AMZN (`amzn.js`):** `AMZN_MGMT = makeManagement({...})`, `amznOwnBody`, `amznGovBody`,
`amznTrackBody`; motor `js/overviews/management.js`. **Tipo:** motor (Executives & Board) + datos (los
otros tres). Ninguna gráfica. Los datos van separados del código, como `sharkninja-mgmt-data.js`.

**Cableado (fácil de olvidar):**
- `deepDiveInit` llama `<T>_MGMT.init(root)` (sin eso, el modal de la bio no abre);
- el modal de Track Record usa `data-detail="exec:<id>"`: agregar la rama `exec:` en `resolve()` de
  `wireModal`;
- la clave de la sub-tab es **`team`** (como AMZN), no `execboard` (SN) — §5.

### MG-TEAM Executives & Board (`team`, activa por defecto)

- **Contenido:** lede (`lede`, HTML **sin** `<p>` alrededor, ~2–3 oraciones: tamaño del equipo, rasgo
  distintivo) · rejilla de tarjetas de ejecutivos (foto o iniciales · nombre · cargo · desde · una línea
  · "Full bio ›"; el CEO con `lead:true`, ancho completo) · modal con la bio completa · franja "Board
  of Directors — <boardNote>" (nombre · Independent/Insider · rol; presidente con franja; quien también
  es ejecutivo atenuado "also management") · rejilla "Governance & compensation" (3 celdas) · pie.
- **Datos:** `execs[{id, name, title, since?, line, bio?, lead?, img?}]` (`bio` y `line` son **texto
  plano** — pasan por `mEsc` y el HTML se vería literal) · `board[{name, independent, role, chair?,
  dual?}]` · `boardNote` · `gov[{k, v, d?}]` · `foot` · `brand: SUMMIT_CAT[0]` (token Summit, no color
  de la empresa).
- **Fuentes:** página oficial de liderazgo (ejecutivos), proxy DEF 14A (consejo, comités). Fotos
  `img/leadership/<ticker>-<nombre>.jpg` si existen.
- **Qué decide el analista:** qué ejecutivos (AMZN: los 27 del S-team + fundador; para otra empresa,
  el equipo que la empresa publica) y si el consejo va completo o un subconjunto (si es subconjunto,
  decirlo correctamente).
- (Ya arreglados en AMZN, se copian bien: el `boardNote` correcto y el cierre del modal al cambiar de
  sub-tab.)

### MG-OWN Ownership (`ownership`)

- **Contenido:** lede (~1–2 oraciones, la idea central: "One share, one vote…") · KPIs (4: mayor
  tenedor %, clases de acciones, SBC del año, recompras/dividendo) · "Who owns <Empresa>" (2 cajas:
  fundador/insiders, institucionales) · "Capital returned to shareholders" (nota) · "Executives &
  insider activity — live from Fiscal.ai" + el hueco `<div id="dd-mgmt-slot">` (se llena solo) · pie.
- **Fuentes:** proxy (beneficial ownership), 10-K (SBC, recompras), Fiscal.ai (tabla en vivo). **Cada
  cifra con su documento y fecha en el pie.**
- **Si la empresa no está en el plan de Fiscal.ai:** el hueco dice "not available on the current
  Fiscal.ai plan" — correcto, se deja. (La primera sincronización que se quedaba en "Pulling…" ya está
  arreglada en `companies.js`; igual se revisa en §16.)

### MG-GOV Governance & SBC (`governance`)

- **Contenido:** lede (~1–2 oraciones) · KPIs (4: estructura de voto, independencia del consejo,
  SBC $ y % de ingreso, recompras/dividendo) · `.ov-sec-h` "How <Empresa> is governed" + 4 cajas
  (clase de acciones, independencia, comités, SBC vs recompras) · nota que apunta a Bottom Line ▸
  General ▸ SBC para la gráfica (**aquí no se re-grafica**) · pie.
- **Regla:** no repetir KPIs de Ownership. Si una cifra aparece en ambos, va en uno solo (AMZN repite 3
  de 4 — no copiar).
- **Estilo (A29, abierto):** las cajas (`ewBoxes`, clase `.ew-box`) dependen del CSS de `EW_CSS`, que
  AMZN solo inyecta en Bottom Line y Leases; en una empresa nueva usar `.sg-cards` o subir ese estilo a
  la hoja de estilos (y decirlo en el PR).

### MG-TRACK Track Record (`track`)

- **Contenido:** lede (~1–2 oraciones: "rated on what they have actually built") · leyenda de
  calificaciones · rejilla de 2 columnas con tarjeta por líder: nombre + calificación · "rol · at
  <Empresa> since <año de ingreso>" · "**At <Empresa>:** qué construyó" · "**Context:** trayectoria" ·
  "Full track record ›" → modal con el detalle y "Net read" · recuadro "The bench, in one line" · pie.
- **Escala:** `green` "Value creator" · `amber` "Mixed / unproven" (y un `red` si el analista lo
  quiere). Colores con los tokens semánticos (`SUMMIT_POS`…), no los hex de AMZN (`#06965A`, `#B7791F`).
- **Regla:** `since` = **año de ingreso a la empresa** (AMZN ya lo corrigió). El campo que el código lee
  se llama como la empresa (`m.amzn`, A28 en parte): renombrarlo junto con su etiqueta.
- **Qué decide el analista (todo):** qué líderes, la calificación de cada uno, el "Net read" y la frase
  del recuadro. **Claude propone, el analista califica.** El pie lo dice: "Ratings are an editorial
  read, not a Summit output."

---

## §15b Miscellaneous — lo propio de la empresa (`MISC`)

**Responde:** *¿qué de esta empresa importa y no cabe en ninguna otra pestaña?* (Decisión SAB,
2026-10-13: Misc entra al alcance como **el lugar** de lo específico de cada empresa.)

**Referencia AMZN:** panel `data-dd="misc"` de `deepDiveHtml` con 3 sub-tabs: *Capex & Depreciation*
(`capex`) · *M&A* (`manda`) · *Other Analysis* (`other`). Montaje perezoso en `aBuildSub` (`dd==='misc'`).
**Tipo:** a medida.

- **Qué entra:** análisis que la empresa justifica y que no responde la pregunta de ninguna otra
  pestaña (p. ej. capex e infraestructura en AMZN, M&A, un regulador o licencia propia, una línea de
  negocio en incubación). **Antes de mandarlo aquí** se prueba la sub-tab más relevante (§4.2); Misc no
  es un cajón para lo que da flojera ubicar.
- **Qué no entra:** algo que ya responde otra pestaña (un KPI de segmento va a Top Line ▸ Segments; un
  gasto va a Bottom Line); una sub-tab que solo diga "pendiente" (regla de oro 5).
- **Estructura:** las sub-tabs las propone Claude y las aprueba el analista; **cada sub-tab de Misc es
  su propia unidad** (`MISC-<clave>`, p. ej. `MISC-capex`), con su ficha escrita en la bitácora antes de
  construirla (Responde · Contenido · Fuentes · Verificación). Si la empresa no tiene nada que poner aquí,
  la sección no se crea y `MISC` queda ⏭️ con razón.
- **Reglas:** todas las de la Parte III (gráficas, tablas, **un pie por sub-tab**, regla 10).
- **Montaje:** como cualquier sub-tab (§7.1): botón + panel en `deepDiveHtml` y, si tiene gráficas,
  su rama en `aBuildSub` (`dd==='misc'`). En AMZN solo `capex` construye gráficas al entrar
  (`aBuildCapex`, `aBuildSegCapDa`, `aBuildLeases`); `manda` y `other` son HTML estático.
- **Qué decide el analista:** si la sección existe, qué sub-tabs tiene y en qué orden.

**Tres sub-tabs que Claude siempre propone en ① de MISC** (review TSM, SAB 2026-10-19). Se proponen en
toda empresa; el analista decide cuáles entran (la que no aplica queda en la bitácora como "propuesta,
descartada" con razón):

1. **`MISC-comp` Competitive position — "quality of the business"** ("entender mejor a los competidores
   para rebatir el cuestionamiento de las ventajas competitivas"). El mapa de peers (OV-6/VA-PEERS)
   compara **valuación**; esta sub-tab compara **el negocio**. Responde: *¿por qué no le quitan el
   lugar?*
   - Lede de 1–2 oraciones con la tesis del moat (lo que dice "The edge" de OV-3) y, debajo, **los
     cuestionamientos** más serios, uno por tarjeta, cada uno con la evidencia a favor y en contra.
   - Tabla de competidores (incluye a los privados y a las divisiones de otras empresas: Samsung
     Foundry, Intel Foundry, Rapidus en TSM; TikTok, YouTube, Google Search en Meta): por fila, las
     métricas operativas que deciden la industria — cuota de mercado, escala (ingreso del segmento
     comparable), margen, inversión (capex o R&D), y 2–4 métricas propias de la industria que el
     analista elige en ① (TSM: nodo líder y fecha, yield, flota EUV; Meta: usuarios diarios, tiempo de
     uso, precio por anuncio). Cada celda con fuente; lo que no se sabe va vacío ("—", §18), no estimado.
   - Gráfica solo si hay una serie comparable en el tiempo (p. ej. cuota de mercado por trimestre).
   - **Regla:** muestra evidencia, no veredicto (como el Investment Spectrum: nada de puntajes).
2. **`MISC-capacity` Capacity → revenue** ("conectar la capacidad, las máquinas que le van a llegar,
   cómo eso se traduce en wafers y a su vez en revenue"). **Solo para empresas cuyo ingreso está
   limitado por capacidad física** (foundry, data centers, tiendas, aerolíneas, minas); en las demás se
   descarta en ①. Cadena completa, eslabón por eslabón, cada uno con fuente:
   insumo (capex, equipos recibidos) → capacidad (obleas/mes, MW, tiendas) → unidades vendidas →
   × precio por unidad (el mismo de TL-SEG) → ingreso implícito, **contra lo reportado (historia) y el
   consenso (adelante)**. La brecha entre el ingreso implícito y el consenso es el hallazgo; los
   supuestos de conversión (utilización, rendimiento) son controles que el lector mueve, con el valor
   de la fuente por defecto. En Meta la cadena sería capex → capacidad de cómputo → ¿ingreso?: si un
   eslabón no tiene fuente, la cadena no se dibuja completa y se dice dónde se corta.
3. **Directorio físico en tabla por país** ("tabla con la lista de fabs por país"). Si la empresa tiene
   activos físicos que importan (fabs, data centers, tiendas, centros de distribución), la sub-tab que
   los muestre (puede ser la misma `MISC-capacity`) lleva **una tabla agrupada por país** (o región):
   fila de grupo con subtotales (número de activos y capacidad), y dentro las filas por activo (nombre ·
   ubicación · qué produce · capacidad · estado/año). Un mapa o tarjetas pueden acompañarla, nunca
   reemplazarla. Formato de tabla en §18.

**Datos compartidos entre dos perfiles** (p. ej. ASML ↔ TSM: unidades EUV, precios de herramientas,
envíos por cliente). Viven en **un solo archivo de datos** del perfil que es la fuente primaria (el
de ASML), y el otro perfil lo **importa**; nunca se copian los números a un segundo archivo. El pie del
panel que los usa cita el documento primario (no "el perfil de ASML"), y la bitácora de los dos perfiles
anota la dependencia (columna "Depende de" en el review, §16).

- **No copiar de AMZN:** la sub-tab de capex se arma con `bottomlineCapexBody()+segCapDaBody()+aLeasesBody()`
  y solo Leases tiene `.ov-foot`; `bottomlineCapexBody` cita "DCF datacenter build assumptions"
  (números Summit en código, regla 10). El estilo `.acx-tog` ya está en `css/overview.css`: borrar la
  copia en línea, no traerla.

## §16 Cierre — auditoría final y entrega (`F-FINAL`)

1. **Recorrido completo en el portal local** (con el truco de rAF de §7.3): cada sección y sub-tab, cada
   control clicado al menos una vez. Reportar:
   - ids duplicados y manejadores que resuelven por `document` (el motor de Results se monta hasta 3
     veces por perfil: Setup · Results · Estimates);
   - gráficas sin tabla; colores con `NaN`; paneles sin pie; paneles casi vacíos (< 400 caracteres);
   - `<style>` en línea nuevos (meta: ninguno nuevo; los que traiga el código copiado se listan).
2. **Portal real** (localhost con sesión): cabecera, precio en vivo, botones IR/EDGAR, tabla de
   Fiscal.ai, Notes guardando en Supabase. Consola sin errores. Cada aviso "⚑ Live data pending" que
   se vea tiene su fila en Conexiones pendientes, y viceversa.
3. **Lista de §17.4 por cada gráfica**, PASS/FAIL.
4. **Modo B:** conciliación del mapa de reubicación (§4.2 B3).
5. **Bitácora:** todas las unidades en ✅ / ⏭️ / ⛔ con razón; excepciones listadas; resumen final.
6. **Compuerta final:** el analista aprueba el perfil completo. Entonces, **si lo pide**: commit + push
   de la rama; y **solo si lo pide**, `gh pr create` con el resumen de la bitácora (qué cambió
   visualmente, excepciones, bloqueos). Nunca merge.
7. **Review del analista (después de entregado).** Si el analista revisa el perfil ya entregado (como
   el review de TSM del 2026-10-19), cada pedido se anota en la bitácora §6c como una fila `R<n>`:
   el pedido **textual**, la unidad que toca, qué hay que construir, de qué depende y el estado. Cada R
   pasa por la compuerta normal (§2) y, al aprobarse, se registra en §7. Si un pedido vale para
   **todas** las empresas (no solo para esta), además se propone el cambio a esta guía en su propia
   rama `chore/…`, para que la siguiente empresa ya lo traiga desde el principio.

---

# PARTE III — REGLAS TRANSVERSALES

## §17 Gráficas

### 17.1 Antes de escribir una gráfica

1. ¿Es una métrica en el tiempo contra expectativas? → **motor de Results** (dataset, no canvas).
2. ¿Es la sección Top Line? → **motor de segmentos**.
3. ¿Ya existe en AMZN? → **copiar ese código** (tabla §7.4) y cambiar los datos; "igual que Amazon"
   significa extraer el código de Amazon, no reimplementarlo. Las copias de SN/DHR son más viejas: no
   se usan como base.
4. Solo si es otra cosa (cascada, mapa, matriz, red) se escribe un canvas, y aun así cumple 17.2.

### 17.2 Las seis obligatorias (toda gráfica del Deep Dive)

| # | Regla | Cómo se verifica |
|---|---|---|
| 1 | **Zoom en ambos ejes** arrastrando; doble clic restablece; el zoom se suelta al cambiar de modo | arrastrar horizontal, vertical, sobre el eje; doble clic |
| 2 | **Clic en la leyenda oculta la serie** — y la quita de la tabla y de los totales | ocultar y mirar la tabla |
| 3 | **Tabla debajo, en un desplegable**, con **al menos** todo lo dibujado; el encabezado dice qué contiene y cuántos periodos | colapsar y leer el encabezado |
| 4 | **Desplegable de métricas agrupado por familia** (`<optgroup>`), con los segmentos dentro; cada opción se entiende sola | abrirlo |
| 5 | **Cada número con su unidad; cada estimado marcado** (sombreado, E, "(est.)") | mirar un periodo futuro y el eje |
| 6 | **Sin dato no se dibuja nada roto** — se omite o se muestra una bandera ámbar ("⚑ No company guidance") | cargar sin ese dato |

Excepciones aceptadas (no hay que pedirlas otra vez): el mapa de peers (sin zoom; los chips × reemplazan
a la leyenda); los ejes X de snapshots en Target Multiple/PEG y Estimates (zoom solo vertical, por
diseño); las visuales del Overview (barras CSS y mapa SVG — son gancho, no análisis; su tabla vive en
el Deep Dive). Cualquier otra excepción se pide en la compuerta y queda en la bitácora.

### 17.3 Disposición

```
┃ Nombre del bloque   [ métrica ▾ ]                     ← fila 1: QUÉ
  [Quarterly|Annual] [$B|Growth|Margin %] [YoY|QoQ]   Range  Last 4Q · …   ← fila 2: CÓMO · VENTANA
  ■ Actual  ■ Summit  ■ Street  ■ Guidance             ← chips (clic oculta)
  ┌──────────────── gráfica ────────────────┐           ← arrastrar = zoom · doble clic = reset
  ●──────────────── slider ─────────────────●
  ▸ Period detail   show · Total, 18 periods            ← tabla colapsable
```
Los ejes Y van a la **derecha** (principal adentro, margen afuera). Los controles que cambian el
significado de un número van a la izquierda; los que cambian qué números se ven, a la derecha.

### 17.4 Lista por gráfica (se reporta en ④)

- [ ] zoom horizontal, vertical, sobre el eje, doble clic
- [ ] cambiar cada modo con zoom activo: el zoom se suelta
- [ ] cada chip oculta la serie en gráfica, tabla y totales; los colores de las demás no cambian
- [ ] la tabla colapsada dice métrica y conteo
- [ ] el desplegable está agrupado y cada opción se lee sola
- [ ] periodos futuros sombreados y marcados E; ejes con unidades
- [ ] sin dato: nada roto
- [ ] a ~380 px de ancho: nada se encima, la tabla hace scroll
- [ ] cada control clicado en el navegador (no solo leído en el código)

## §18 Tablas

- Componente: `.rs-ft-scroll > table.rs-ft` (celdas `.rs-ft-h`, `.rs-ft-nil` para vacío, `.rs-ft-este`
  para estimado). Colapsable: `.rs-collap`.
- **Bajo una gráfica:** periodos en columnas (más viejo → más nuevo, izquierda → derecha), series en
  filas; estimados con E; una columna resumen a la derecha cuando la gráfica tiene ventana (calculada
  sobre la ventana, no sobre todo).
- **Tablas de comparación** (peers, proveedores): una fila por entidad, ordenadas por la métrica activa;
  promedio y mediana al final **sin** la empresa del perfil; la empresa resaltada con el tono neutro
  del portal (no su color).
- **Directorios agrupados** (activos por país, clientes por segmento): fila de grupo en negrita con
  sus **subtotales** (cuántos y la suma de la columna numérica), las filas del grupo debajo con
  sangría, grupos ordenados por el subtotal de mayor a menor y una fila **Total** al final que cuadra
  con la suma de grupos. Cada grupo se puede plegar; arranca abierto. (Review TSM, SAB 2026-10-19:
  fabs por país.)
- **Por defecto:** colapsadas, salvo que la tabla sea el contenido principal (Peers, Target Multiple,
  PEG, directorios) — esas abiertas. Las de los motores (Results, Top Line, Estimates) arrancan colapsadas.
- Vacío = "—" (`.rs-ft-nil`), nunca 0; "immaterial" solo si la fuente lo dice.
- Encabezado del colapsable siempre dice qué hay dentro ("Period detail · show · AWS, 14 periods").

## §19 Texto: dónde sí hay descripciones y dónde no

| Lugar | ¿Descripción? | Forma y largo |
|---|---|---|
| Overview ▸ Key Facts | No | solo valores |
| Overview ▸ Descripción | **Sí** | 2–4 oraciones, ~50–80 palabras |
| Overview ▸ Cuadrante | Sí, mínima | ≤ 30 palabras por celda |
| Overview ▸ colapsables (4–7) | No hay párrafo de introducción | una leyenda de una línea arriba + a lo sumo una de cierre (OV-4 y OV-6 llevan las dos) |
| Overview ▸ definición de segmento | Sí | ~40–60 palabras, cualitativo, **sin números** (los números en "The numbers") |
| Overview ▸ producto | Sí, mínima | familia ≤ 6 palabras; producto 1–3 líneas |
| Overview ▸ Timeline | Sí, mínima | una línea visible; profundidad en viñetas dentro de "Read more" |
| Gráficas de motor (Results, Estimates, Bottom Line std, Top Line) | **No** hay lede sobre la gráfica | lo explicativo va en la `note` de la métrica (1–2 oraciones) o en el pie |
| Top Line ▸ citas del filing | Sí (verbatim) | chip FILING + ubicación; nunca paráfrasis con ese chip |
| Top Line ▸ "Our read on it" | Sí | 1–2 oraciones, chip OURS |
| Top Line ▸ tarjeta de segmento (`brief`) | Sí | 3–4 oraciones en lenguaje simple |
| Bottom Line ▸ cascadas | Solo leyenda dinámica | ≤ 3 oraciones, con fuente al final |
| Bottom Line ▸ Expense lines | Sí (es el lugar de la profundidad) | por bloque ≤ ~3 oraciones; definición verbatim |
| Valuation ▸ Peers | Sí | lede de 1–2 oraciones |
| Valuation ▸ Historic / Target / Sensitivity | No hay lede | el "cómo se construye" va al pie |
| Management ▸ cada sub-tab | Sí | lede de 1–3 oraciones; luego KPIs y cajas cortas |
| Misc ▸ Competitive position | Sí | lede de 1–2 oraciones; cada cuestionamiento en su tarjeta (≤ 3 oraciones a favor, ≤ 3 en contra) |
| Misc ▸ Capacity → revenue | No hay lede | una línea por eslabón (qué es y de dónde sale); supuestos al pie |
| Earnings ▸ Setup | No | solo los `?` por métrica (≤ 3 viñetas) |
| Earnings ▸ Call Summary | Sí, citada | voz directa de management, no resumen de Claude |
| Notes | Sí | una nota = un hecho o promesa, ≤ 2 líneas, con trimestre |

Reglas generales: nada de muros de texto (lo que pase de ~2 líneas va a un modal o colapsable);
ninguna tesis de inversión fuera de Track Record (y ahí marcada como editorial); idioma del contenido
en pantalla: **inglés**, como el resto del portal; nombres propios y términos del filing tal cual.

## §20 Números, unidades y estimados

| Tipo | Formato | Ejemplo |
|---|---|---|
| Dinero ≥ $1B | `$x.xB` (1 decimal); ≥ $1T `$x.xxT` | `$42.2B`, `$2.45T` |
| Dinero < $1B | `$xM` | `$554M` |
| EPS / por acción | `$x.xx` | `$1.68` |
| Porcentaje | `x.x%` | `11.2%` |
| Diferencia de porcentajes | `pp` (o `bps` en cascadas de margen) | `+1.4 pp`, `−120 bps` |
| Múltiplo | `x.x×` | `27.8×` |
| Crecimiento | `▲ x.x%` / `▼ x.x%`; < ±0.05 neutral | `▲ 36.8%` |
| Fechas | `Mmm AAAA` o `AAAA-MM-DD` en fuentes | `Oct 2026`, `2026-08-04` |
| Trimestres | `3Q26` en Results/Top Line; `Q3 2026` en Earnings/Notes | no mezclar en un archivo |

- Un estimado nunca se ve igual que un real: sombreado/desvanecido + E.
- Un dato sembrado a mano (solo filings o Bloomberg, §20b) dice "seeded" y su fecha.
- Moneda distinta de USD: se dice en el pie; en Valuation los múltiplos solo si la base es comparable.
- Tilde de redondeo (`~`) solo cuando la fuente redondea; no para disfrazar un cálculo propio.

## §20b Datos en vivo vs datos en archivo ("Live data pending")

Regla de oro 10, en detalle (decisiones SAB, 2026-10-13 y 2026-10-15).

| Dato | Dónde vive | Cómo llega al panel |
|---|---|---|
| Precio, market cap, EV, deuda neta actual | **En vivo** | `liveQuote` (Massive) |
| Historia de precio, acciones, deuda | **En vivo** | `get-market-history` (Massive) |
| Múltiplos de mercado (propios y de peers) | **Se calculan en vivo** | precio en vivo ÷ denominador de archivo (filing o BBG) |
| Todo número del modelo Summit (proyecciones, snapshots, múltiplo y precio objetivo, supuestos) | **Archivo de datos, congelado** | Claude lo saca del MCP de Summit con el mapa `js/summit-map/<ticker>.js` y lo escribe en el módulo de la empresa, con la fecha del snapshot |
| Lo reportado (10-K/10-Q/8-K/20-F/6-K/proxy) | Archivo de datos | con documento y fecha en el pie |
| Bloomberg (`BBG_CONSENSUS.txt`, SPLC) | Archivo de datos | generado o compilado, con `asOf`; no hay conexión directa a BBG |
| Configuración de una vista (drivers, pasos, rangos de ejes) | Código | no es un dato |

**Claude y el MCP de Summit.** No habrá conexión en vivo (decisión SAB, 2026-10-15: no era eficiente
montar el MCP en vivo), así que Claude es el puente: saca los números **una vez**, los congela en el
repo y **cita el documento primario**, no el conector ("Summit DCF model, snapshot AAAA-MM-DD", nunca
"vía MCP"). El navegador nunca llama al MCP.
- **Dónde:** en el archivo de datos que ya usa el motor (`summit` en `results-data/<t>.js`,
  `summit:{}` en `segments-data/<t>.js`, `evolution`, `setup.us`) o, para un panel propio, en un
  módulo `<t>-summit-data.js`. Encabezado: modelo, snapshot(s), fecha de extracción y "frozen on
  purpose, not live — refresh by re-pulling when a new snapshot is submitted".
- **Qué snapshot:** antes de congelar, `list_snapshots` para tomar el más reciente y revisar su último
  periodo real; la valuación con `get_valuation_history`. Un método con `quality_flags` se congela con
  la advertencia, nunca como dato limpio. Si el analista acaba de corregir el workbook, confirmar que
  el MCP ya lo reingestó (comparar contra la hoja Output) antes de congelar.
- **Cuadre:** cada número congelado se cuadra contra el MCP en la autoauditoría (3 al azar por bloque),
  y los reales del modelo contra el filing.
- **Refresco:** cuando hay un submit nuevo, se vuelve a correr la extracción, se cambia la fecha del
  encabezado y se anota en la bitácora. Lo viejo no se borra si un panel lo usa como vintage.
- **Generadores:** `emit_summit_matrix.py` (mitad `summit` de `estMatrix`) y `emit_evolution.py`
  (bloque `evolution`) **vuelven a servir**, siempre que lean el snapshot más reciente y escriban la
  fecha. Si un script está cableado a Amazon, se adapta o se arma a mano; no se reimplementa el motor.

**Cuando el camino en vivo de mercado todavía no existe** (función sin desplegar), hay dos casos. **No
se siembran números "mientras tanto"** en ninguno: no hay nada que migrar después, solo conectar.

1. **La unidad tiene contenido útil sin ese dato** (p. ej. Historic Multiple antes del despliegue de
   `get-market-history`) → **se construye y se aprueba**:
   - en un **panel propio** (código de la empresa), la parte que falta muestra
     `<div class="rs-noguide">⚑ Live data pending — <qué falta></div>` — la clase `.rs-noguide` ya
     existe (`css/results.css`, pastilla ámbar); frase corta en la pastilla, la explicación va al pie.
     Ejemplos de texto: "— price history service not deployed yet", "— live quote unavailable";
   - en un **motor compartido** (`results.js`, `segments.js`) **no se toca el motor** en el PR de la
     empresa: la serie simplemente no aparece y el pie (`source`) dice qué falta;
   - en la bitácora queda ✅ con la nota "pendiente en vivo: <qué>" y una fila en **Conexiones
     pendientes**, que dice qué bloque, qué función falta y quién lo destraba (San: desplegar).
   - Cuando se destraba, se conecta, se vuelve a mostrar (👀) y se cierra la fila.
2. **La unidad depende por completo de ese dato** → **⛔ y no se publica** (ni botón ni panel; regla 5).
   Se anota en Bloqueos con qué falta y quién lo destraba, y se construye cuando exista.

**Lo Summit ya no cae en ninguno de los dos casos:** con el modelo congelado en archivo, EV-EST, VA-TM,
VA-SENS y las series Summit de Results, Top Line, Setup y Bottom Line **se construyen completas**. El
aviso "Live data pending — Summit model feed not connected yet" ya no se usa; si un perfil lo tiene
(perfiles armados antes del 15 oct 2026), se reemplaza por la serie congelada.

**Estado al 16 oct 2026:** funciona `liveQuote` (vía `covered-calls-massive`, ya desplegada). Sin
desplegar: `get-market-history` y `get-quote` (San). `get-summit-data` y los `fetchSummit*` de `api.js`
(PR #142) **no se usan** en los perfiles nuevos — Summit va congelado. La carpeta `js/summit-map/` sí
se usa: es el diccionario con el que Claude sabe qué etiqueta del MCP es cada línea al congelar.

## §21 Color

- **El perfil no elige colores.** No se define `--brand` con el color de la empresa; el color de la
  empresa aparece **solo en su logo**. Lo que AMZN pone en su raíz (`--brand-2:var(--steel)`,
  `--brand-soft:rgba(37,99,235,0.08)`) son tokens neutros de Summit y **se copian tal cual**.
- **El Overview no lleva color categórico** (§8, SAB 2026-10-19): solo navy, steel y grises. Lo de
  abajo (`SUMMIT_CAT`) aplica al Deep Dive.
- **Acento único en todo el perfil = `--steel`** (el azul Summit que subraya OVERVIEW · DEEP DIVE…):
  líneas de acento, subrayado de pestañas activas, realces. Títulos y rótulos en `--navy`. (SAB 2026-10-20.)
- **Series:** `SUMMIT_CAT` de `js/viz-palette.js`, en orden fijo, sin ciclar; el color sigue a la
  entidad (ocultar una serie no repinta las demás); más de 8 → "Other".
- **Fuentes de dato:** Actual = navy · Summit = azul · Consensus = gris — siempre las mismas.
- **Años fiscales y snapshots:** rampa de un solo tono (ordinal), no categórica.
- **Estado:** `SUMMIT_POS` / `SUMMIT_NEG` / `SUMMIT_MUTE` / `SUMMIT_INK` — nunca como "serie 4".
- Los slots 3–5 tienen poco contraste: la gráfica que los use necesita etiquetas o tabla (todas la
  tienen por §17.2).
- Dispersiones y mapas: máximo 3 slots (`SUMMIT_CAT3`).
- **Nada de hex sueltos** en código nuevo. AMZN todavía trae algunos (`GREEN`/`GRAY` del Overview, la
  escala de Track Record, los de `amzn-histmult.js`): en la copia se cambian por tokens.

## §21b Selectores de navegación (las barras de arriba)

**Por qué existe.** Las barras de navegación del Deep Dive se fueron agregando con cada unidad y
terminaron con estilos distintos: secciones subrayadas pero con el activo en naranja de Amazon,
sub-pestañas en mayúsculas con relleno azul, fases de Earnings con otro azul. SAB (15 oct 2026) pidió
que todas sigan una misma lógica de diseño, para que el portal se vea estandarizado y hecho con
detalle, no "generado por IA".

**Qué cubre — y qué no.**
- **Sí:** solo las barras apiladas de arriba: secciones del Deep Dive (`.dd-tab`), sub-pestañas
  (`.ovt-subtab`) y sub-pestañas anidadas (Earnings ▸ `.ce-phtab`).
- **No:** los controles dentro del contenido (Quarterly/Annual, $B/Growth, View:, leyendas, chips,
  tarjetas seleccionables, colapsables). Se quedan como están en cada motor.

**El sistema** (`css/selectors.css`, se carga después de todas las hojas): solo texto, cada nivel un
paso más chico y más callado que el de arriba.

| Nivel | Qué es | Forma |
|---|---|---|
| 1 | Pestañas del perfil (OVERVIEW · DEEP DIVE · PILLARS · RESOURCES) | Lo da el portal (`companies.css`); no se toca |
| 2 | Secciones (Top Line · Bottom Line · Evolution…) | 13.5px, peso 600, subrayado de 2px sobre una línea gris que cruza todo el ancho |
| 3 | Sub-pestañas (General · Segments · Other…) | 12.5px, peso 500 (600 el activo), subrayado de 1.5px, sin línea de fondo |
| 3b | Sub-pestañas anidadas (Setup · Post-Results · Notes) | Igual que el nivel 3, en su propia fila bajo una línea muy tenue |

**Reglas:**
- Tipo oración en todos los niveles bajo el 1 (nada en mayúsculas).
- El activo: texto en **navy Summit** y subrayado en el **azul Summit de las pestañas del perfil**
  (`--steel`, SAB 2026-10-20) — nunca `--brand` de la empresa (por ahí se filtraban el naranja de Amazon
  y los dos azules) — y sin rellenos.
- Ningún módulo de empresa define estilos propios para `.dd-tab`, `.ovt-subtab` o `.ce-phtab`, ni
  `<style>` en línea ni estilos puestos desde JS.

**Cómo entra una empresa.** Se agrega la clase raíz de su Deep Dive (`.ov-<t>-dd`) a la lista
`:is(…)` de `css/selectors.css` **cuando la empresa pasa por esta guía** (F1, o al reordenar en modo
B). No se aplica a todas a la vez: hoy están AMZN y TSM; las demás entran cuando se trabajen. La
compuerta F1 revisa que la empresa ya esté en la lista.

## §22 Pie de fuentes

Cada panel del Deep Dive (cada sub-tab, y cada colapsable con contenido propio dentro de ella) termina
con un `.ov-foot`. **El Overview lleva un solo pie** (OV-F); sus colapsables 4–7 no llevan pie propio.

```
Sources — <documento> (<nota / sección>, <fecha o accession>); <documento 2> (…);
<modelo Summit, snapshot AAAA-MM-DD>; <Bloomberg <export>, as of AAAA-MM-DD>.
<Advertencias: qué es estimado, qué es sembrado, qué es en vivo.>
```
- Nombrar el documento primario, no el conector (no "vía MCP"; sí "Summit DCF model, snapshot …").
- Overview y Deep Dive tienen pies separados; sin firma de autor.
- Un panel sin pie no está terminado (falla la autoauditoría).

## §23 Modales, colapsables y pestañas

- Modal: uno por perfil, **subido a `#co-detailview`** (un panel oculto se tragaría un modal anidado);
  se cierra con ×, clic fuera, Esc **y al cambiar de pestaña o sub-tab**. Excepción conocida: el modal
  de bio de `management.js` (`.mg2-modal`) es propio del motor y no se sube; se deja así.
- Disparador: `.ov-clickable[data-detail="<tipo>:<id>"]` + `resolve()` en `wireModal` (cada tipo nuevo
  — `prod:`, `hist:`, `exec:`… — necesita su rama en `resolve()`).
- Colapsables: `.ov-collap` en el Overview; `.rs-collap` en el Deep Dive. Una gráfica dentro de un
  colapsable se construye **al abrirlo** (Chart.js no dibuja oculto).
- ⚠ `deepDiveInit` tiene un manejador global de `.rs-collap-h`. Los encabezados que se abren solos
  (motores y módulos de Valuation) se excluyen con la lista `SELF` (`[data-selfwired], [data-hmtblb],
  [data-tmtblb], …`); si no, el clic abre y cierra a la vez. **Todo módulo nuevo con su propio
  colapsable** pone `data-selfwired="1"` en el encabezado, o agrega su atributo a `SELF`.
- Pestañas: el cambio se acota al panel (`:scope >`) y a la raíz `.ov-<t>-dd`; nunca
  `document.querySelector`. El estado (sub-tab activa) se conserva al volver.
- Sin `<style>` en línea nuevo; si falta un estilo, va a una hoja de estilos y se dice en el PR.
- `esc()` de `amzn.js` **no** escapa `&`; el `mEsc` de `management.js` sí. Saber qué función recibe
  cada texto para no ver `&amp;` en pantalla.

## §24 La herramienta de Notes — reglas de uso

**Qué es.** El registro vivo de los **hilos** que el equipo sigue llamada a llamada: tendencias
confirmadas, promesas de management por reconciliar y cosas a vigilar. Vive en Evolution ▸ Earnings ▸
Notes; su **semilla** también alimenta Top Line ▸ Segments ▸ "What management has said".

**Cómo se organiza.**
```
Tema (p. ej. un segmento: "AWS")
 └─ Sub-tema = un hilo ("Backlog")       estado: Confirmed trend | Promise — reconcile | Watch
     · why: por qué lo seguimos (1 línea)        ventana: tracking since Qn AAAA → until (abierto/cerrado)
     · Q2 2026: nota · nota
     · Q1 2026: nota
```

**Dónde se guarda.** En Supabase, tabla `company_theme_record`: **un registro por empresa** con todo el
árbol. Cualquiera con sesión puede leer y escribir. El archivo `js/themes-data/<ticker>.js` es solo la
**semilla**: en cuanto existe un registro en la base, la semilla deja de leerse — editar el archivo ya
no cambia nada.

**Cómo se escribe una nota (tres caminos, todos en el portal):**
1. Post-Results → "＋ add note" sobre cualquier punto de la llamada (pre-llena el texto).
2. Post-Results → "📝 Propose Notes" → Accept → "Publish to Notes →".
3. Notes → "✎ Edit / Add note" en un sub-tema, o el panel "✎ Edit notes & tracking".

**Reglas de contenido:**
- **Una nota = un hecho, cifra o promesa**, ≤ 2 líneas, en inglés, con el trimestre de la llamada.
- Si es cita, entre comillas y textual; si es paráfrasis, sin comillas. Cifras con unidad.
- Negrita solo para la cifra o la palabra clave (`<b>`). Nada más de HTML.
- Sin opinión de inversión: Notes registra lo que se dijo y lo que pasó, no lo que pensamos.
- **Promise — reconcile** se usa cuando management prometió algo con fecha o cifra; cuando se cumple o
  falla, se agrega la nota que lo reconcilia y se cierra la ventana ("until").
- No duplicar: si ya existe la misma nota en ese sub-tema y trimestre, el portal la bloquea y avisa
  (también en el editor en línea, `ceNoteDup`).
- Borrar una nota es **inmediato y sin confirmación**: hacerlo solo si está mal.

**Limitaciones conocidas (hasta que se arreglen):**
- Un **tema nuevo sin sub-temas** creado desde el portal no se guarda (un tema reaparece tras recargar
  solo si tiene al menos un sub-tema — `amznSyncSegOrder`, que la copia debe traer). **Regla:** los
  temas (nivel superior) se definen en la semilla durante la unidad `EV-NOTES`; en el portal, crear un
  tema solo junto con su primer sub-tema.
- Top Line ▸ Segments ▸ "What management has said" lee la **semilla**, no lo guardado en Supabase:
  lo que se agrega en Notes no aparece ahí (§10).
- El estado del sub-tema (`trend/promise/watch`) y el `why` no se editan desde la interfaz: se definen
  en la semilla antes del primer guardado (después, pedirlo a San/Oscar).
- Último en guardar gana: si dos personas editan a la vez, uno pisa al otro. Coordinar.
- Sin sesión, los cambios **no se guardan** y no hay aviso.

**Semilla para una empresa nueva (unidad EV-NOTES):** temas = los segmentos o ejes del negocio;
sub-temas = los 3–8 hilos que el analista quiere seguir; cada uno con estado, `why`, `since` y al
menos una nota real de una llamada ya ocurrida. Un segmento sin hilos queda sin sub-temas (no se
siembra un marcador).

---

# ANEXOS

## Anexo A — Defectos conocidos de AMZN: no copiar

Encontrados en la auditoría del 13 oct 2026; estado verificado contra `main` @ `3667342` (14 oct 2026,
después de los PRs #140 y #141). Al copiar código de AMZN, **corregir en la copia lo que siga abierto**;
el arreglo en AMZN mismo va en su propio PR, no en el de la empresa nueva.

Estado: ✅ arreglado en `main` (copiar de AMZN ya lo trae) · ◐ en parte · ❌ abierto (corregir en la copia).

| # | Dónde (AMZN) | Defecto | Estado | En la copia |
|---|---|---|---|---|
| A1 | Overview `stdOverviewBody`, `stdPeerScatter` | `<style>` en línea que pisa la hoja de estilos | ❌ | borrar; subir antes a `css/overview.css` las clases del mapa de peers (§8) |
| A2 | Overview `aLiveOne` / `aMcCell` | market cap sin fecha; si falla dice "live" | ✅ | sin semilla: "loading live quote…" / "live quote unavailable" |
| A3 | Overview `A_PEERS` | múltiplos y `mc` sembrados (y AMZN con P/E trailing = forward, 27.8) | ❌ | denominadores + `liveQuote` (OV-6) |
| A4 | Overview / Peers | naranjas de Amazon | ✅ | — |
| A5 | Bottom Line `aStd*` | arrastre vertical truena (`onY=null`) | ✅ | — |
| A6 | Bottom Line margins | consenso repite el último real | ✅ | — |
| A7 | Bottom Line margins | "Net income — Summit" = earnings ajustado | ✅ | — ("Model earnings (adj.)") |
| A8 | Bottom Line segfc | trimestral + EBITDA dibuja anual | ✅ | — |
| A9 | Bottom Line SBC | leyenda no clicable; eje de acciones fijo | ✅ | (sigue: eje a la izquierda — ponerlo a la derecha) |
| A10 | `.acx-tog` | estilo de pastillas inyectado desde Misc | ✅ | ya está en `css/overview.css`; borrar la copia en línea de `bottomlineCapexBody` |
| A11 | Bottom Line General/Segments | sin pie a nivel de panel | ✅ | — (`aBlFootGeneral`, `aBlFootSegments`) |
| A12 | Bottom Line | años y etiquetas tecleados | ◐ | derivar del dato (`'$356B · 49.7%'`, `EW_LABS`, chips, años del pie) |
| A13 | Top Line | colores se re-asignan al ocultar una serie | ✅ | — |
| A14 | `.rs-collap-h` | doble manejador: el clic abre y cierra | ✅ | lista `SELF` / `data-selfwired` (§23) |
| A15 | Top Line KPIs | paráfrasis con chip FILING | ✅ | FILING solo con `filingWhere` y verbatim |
| A16 | Results anual | sin utilidad operativa por segmento | ❌ | agregarla en `y` |
| A17 | Earnings Setup | "(Summit pending)" · Summit de snapshot viejo · "AMZN" fijo · clave huérfana "Advertising" | ◐ | quitado el título; lo demás sigue — Summit no se teclea (§12) |
| A18 | Earnings `ceGuessTarget` | regex de Amazon | ❌ | reescribir |
| A19 | Notes | tema nuevo no persiste; sin chequeo de duplicados | ✅ | traer `amznSyncSegOrder` y `ceNoteDup` (la copia de SN no los tiene) |
| A20 | Historic Multiple | P/E forward vacío (EPS anual armado de trimestres); sin desplegar | ❌ | EPS anual por snapshot; en vivo o aviso (§14) |
| A21 | Historic Multiple `numerAt` | 0× inventado si falta deuda/acciones | ✅ | — |
| A22 | Target Multiple | múltiplos inventados por defecto | ✅ (compuerta `TM_LIVE_READY`) | empresa nueva: múltiplo del modelo, congelado (regla 10) |
| A23 | Target Multiple / Sensitivity | pie afirma deuda "from the live quote / via Massive" aunque falle | ❌ | rastrear la fuente (`_ndSrc` de SN) |
| A24 | Sensitivity | consenso inventado (`CONS`) | ◐ | ya no se muestra, pero `CONS.v` sigue en el código: no copiarlo |
| A25 | Sensitivity | inputs de rango dejan de funcionar tras un reset | ✅ | — |
| A26 | Sensitivity vs Target Multiple | EBITDA distinto (segmentos vs consolidado) sin decirlo | ❌ | conciliar o explicar en el pie |
| A27 | `management.js` | modal no se cierra al cambiar de sub-tab | ✅ | — |
| A28 | Track Record | `since` mezcla ingreso y cargo; campo `amzn` | ◐ | `since` ya es ingreso; renombrar el campo |
| A29 | Management `ewBoxes` | el CSS `.ew-box` solo vive en `EW_CSS` (Bottom Line / Leases) | ❌ | `.sg-cards` o subir el estilo |
| A30 | Management boardNote | "full roster in Pillars" (falso) | ✅ | — |
| A31 | Ownership | cifras "approximate" sin documento | ✅ | — |
| A32 | Peers | sin `.ov-foot` | ✅ | — |
| A33 | `companies.js` | primera sincronización de Fiscal.ai se queda "Pulling…" | ✅ | — |
| A34 | Results, Top Line, Estimates, Setup, Bottom Line, Target Multiple, Sensitivity, Misc | números Summit copiados al repo (`summit:[]`, `estMatrix.summit`, `evolution`, `setup.us`, `segments-data summit:{}`, `A_SUMMIT_SHARES`, `SNAP_DATA`, `M`, "DCF datacenter") | ◐ | desde el 15 oct 2026 Summit **sí** va en archivo, pero congelado del MCP con fecha de snapshot y refrescado en cada submit; lo de AMZN falla por no tener fecha y venir de snapshots viejos (regla 10, §20b) |

## Anexo B — Matriz de fuentes por pieza

| Pieza | Fuente primaria | Archivo en el repo |
|---|---|---|
| Key Facts | EDGAR, 10-K portada/Item 1/Item 5, IR, proxy; market cap en vivo (Massive) | módulo `<ticker>.js` |
| Descripción, cuadrante, productos, timeline | 10-K Item 1, IR, comunicados | módulo |
| How it makes money | 10-K nota de segmentos + desagregación de ingresos + geografía | módulo |
| Peers (Overview y Valuation) | denominadores de filings/BBG (fuente y fecha en el pie); precio, market cap y EV en vivo (Massive) | módulo (`A_PEERS`, sin múltiplos) |
| Mapa Summit | MCP Summit (`list_metrics`, `get_fundamentals`) + autor del modelo + cuadre vs filing | `js/summit-map/<t>.js` + bitácora "Mapa Summit" |
| Results / Estimates | 8-K/10-Q (actuals); `BBG_CONSENSUS.txt` + `Consensus_Portal.xlsm` (cons, `estMatrix.cons`); 8-K (guía) — en archivo. Summit congelado del MCP (snapshot en `source`) | `results-data/<t>.js` |
| Top Line | 10-K (verbatim), llamadas (named), semilla de Notes (management), BBG kpi, SPLC — Summit congelado (`summit:{}`) | `segments-data/<t>.js` (a mano) |
| Earnings Setup / Post-Results | `CE_CONS` armado al cargar desde `results-data`; 8-K, transcripciones; Summit congelado (`setup.us`, con fecha) | `<t>-ce-data.js` + `results-data/<t>-setup.js` + `docs/calls/<T>*.md` |
| Notes | llamadas (en el portal) | Supabase `company_theme_record` (+ semilla `themes-data/<t>.js`, registrada en `segments.js`) |
| Bottom Line | export BBG generado (`bbg_extract.py`); 10-K/10-Q (gastos funcionales y segmentos históricos), MD&A y notas; SPLC — en archivo. Summit (acciones del modelo, series `summit`) congelado | `<t>-bbg.js` + módulo |
| Historic Multiple | precio, acciones y deuda en vivo (`get-market-history`); EPS/EBITDA de `results-data` (`act` y `estMatrix.cons`) | módulo `<t>-histmult.js` (sin datos propios) |
| Target Multiple / Sensitivity | Summit DCF congelado (snapshots + valuación del modelo, del MCP); BBG por segmento | módulos `<t>-target-multiple.js`, `<t>-sensitivity.js` + sus `-data.js` congelados |
| Miscellaneous | según la sub-tab (ficha en la bitácora) | módulo |
| Misc ▸ Competitive position | filings y presentaciones de cada competidor; datos de industria con fuente nombrada (TrendForce, Counterpoint…) | módulo |
| Misc ▸ Capacity → revenue | filings y presentaciones de la empresa (capacidad, unidades); el perfil del proveedor si existe (archivo compartido, importado); consenso de `results-data` | módulo + archivo compartido del otro perfil |
| Top Line ▸ Customers ▸ "What each top customer buys" | 10-K (concentración), SPLC, llamadas; prensa solo marcada *estimate* | `segments-data/<t>.js` (`customers.buys`) |
| Management | página de liderazgo, DEF 14A, 10-K (SBC), Fiscal.ai (en vivo) | módulo + `img/leadership/` |

Regla de oro de datos (regla 10, §20b): **lo de filings y Bloomberg se saca una vez, se guarda en el
repo y se cita el documento primario; lo del modelo Summit también, congelado con la fecha del
snapshot; solo lo de mercado (precio, market cap) se lee en vivo.** El navegador nunca llama al MCP.

## Anexo C — Unidades y dependencias

| ID | Unidad | Depende de | Hoy (14 oct 2026), empresa nueva |
|---|---|---|---|
| F0 | Inventario de datos | — | se hace |
| F0-SM | Mapa de métricas Summit | F0 (solo si hay modelo Summit; si no, ⏭️) | se hace (lo usa Claude al congelar Summit) |
| F1 | Esqueleto + vista previa | F0 | se hace |
| B1 / B2 | (modo B) Inventario de contenido existente · mapa de reubicación | F0 | — |
| OV-1 … OV-7, OV-F | Overview: Key Facts · Descripción · Cuadrante · Makes money · Products · Peers · Timeline · Pie | F1 (OV-6 comparte `A_PEERS` con VA-PEERS) | se hace |
| EV-RES-DATA | Dataset de Results (números) | F0 + F0-SM | se hace, con `summit` congelado |
| EV-RES | Pestaña Results | EV-RES-DATA | se hace |
| TL-GEN · TL-SEG · TL-OTH · TL-CUS | Top Line | EV-RES-DATA; el bloque 5 de TL-SEG lee la semilla de EV-NOTES (mientras no exista, muestra su bandera ⚑) | se hace |
| EV-EST | Estimates | EV-RES-DATA + F0-SM + Summit ≥ 2 snapshots congelados (el eje son los snapshots) | se hace (sin modelo Summit, ⏭️) |
| EV-SET | Earnings ▸ Setup | EV-RES-DATA + `CE_CONS` (armado al cargar desde EV-RES-DATA) | se hace |
| EV-POST | Earnings ▸ Post-Results | EV-SET + transcripción | se hace |
| EV-NOTES | Earnings ▸ Notes (semilla) | EV-POST (para los temas) | se hace |
| BL-GEN-1 … BL-GEN-5 | Bottom Line ▸ General (4 vistas apiladas + Expense lines) | export BBG (o, sin él, lo reportado — precedente DHR) | se hace |
| BL-SEG | Bottom Line ▸ Segments | export BBG | se hace |
| BL-SPLC | Bottom Line ▸ Supply Chain | export SPLC (si no hay, ⏭️) | se hace o ⏭️ |
| VA-HIST | Historic Multiple | EV-RES-DATA (`act` + `estMatrix.cons`, EPS anual por snapshot) · en vivo: `get-market-history` | se hace; se aprueba en el portal con el aviso |
| VA-PEERS | Peers | OV-6 | se hace |
| VA-TM | Target Multiple / PEG | F0-SM + valuación del modelo congelada (`get_valuation_history`) | se hace (sin modelo Summit, ⏭️) |
| VA-SENS | Sensitivity | F0-SM (segmentos) + snapshot Summit congelado + BBG por segmento | se hace (sin modelo Summit, ⏭️) |
| MG-TEAM · MG-OWN · MG-GOV · MG-TRACK | Management | F1 | se hace |
| MISC (y `MISC-<clave>` por sub-tab) | Miscellaneous — siempre se proponen `MISC-comp` y, si aplica, `MISC-capacity` (§15b) | F1; al final, cuando ya se sabe qué no cupo en otra pestaña. `MISC-capacity` usa el precio por unidad de TL-SEG y el consenso de EV-RES-DATA | se hace o ⏭️ |
| F-FINAL | Cierre | todas | se hace |

**Reglas de la tabla:**
- Una dependencia en **⏭️ cuenta como cumplida** (p. ej. sin modelo Summit, F0-SM ⏭️ no detiene
  EV-RES-DATA).
- "en vivo: …" = lo que hace falta para quitar el aviso "Live data pending" (§20b, caso 1). Las filas
  **⛔** son el caso 2 de §20b: no se publican hasta que exista ese camino.
- **Contador "N de M"** de la bitácora: **M = filas del tablero menos las ⏭️ de alcance** fijadas en F0.
  En modo B se suman B1 y B2. Cada `MISC-<clave>` aprobada **reemplaza** la fila `MISC` (si hay dos
  sub-tabs en Misc, M sube en uno). Las ⛔ siguen contando en M: son trabajo pendiente, no descartado.

## Anexo D — Guiones de pregunta para cada compuerta

**Formato del mensaje que acompaña la pregunta (③ + ④):**

```
<ID> <Nombre> — listo para revisar
Dónde verlo: http://localhost:8000/ → Companies → <empresa> → Deep Dive → Top Line → Segments
Qué contiene: (3–6 líneas, en lenguaje simple)
De dónde salen los datos: (fuente · fecha, por bloque)
Decisiones que tomé por ti (confírmalas): …
Autoauditoría: ✔ zoom · ✔ leyenda · ✔ tabla · ✘ pie (falta la fecha del export — ¿la agrego como "as of 8/4/2026"?)
Lo que NO incluí y por qué: …
```

**Pregunta (AskUserQuestion), siempre con estas opciones:**
- "Aprobado" — *queda registrado y pasamos a <siguiente unidad>*
- "Aprobado con ajustes menores" — *dime cuáles; los aplico y lo registro*
- "Cambios" — *dime qué cambiar; lo rehago y te lo vuelvo a mostrar*
- "Omitir / dejar pendiente" — *queda ⏭️ con la razón que me des*

**Preguntas de decisión típicas en ① (con propuesta de Claude primero, marcada "(Recomendado)"):**

| Unidad | Pregunta |
|---|---|
| F0 | "Esto es lo que hay de la empresa (reportes, modelo Summit, datos de Bloomberg, llamadas). Con eso podemos armar X de las 38 piezas; A y B no, porque … Lo del modelo Summit lo congelo del snapshot <fecha>. ¿Confirmas el alcance?" |
| F0-SM | "El modelo de <empresa> trae N datos: x son los básicos (ventas, EBITDA, utilidad…), y son por segmento, z son indicadores propios; la valuación del modelo trae estos métodos: … (y estos no son confiables: …). Tengo d dudas para el autor del modelo: … ¿Apruebas la lista? ¿Hay alguno que marqué 'no mostrar' y sí quieres ver?" |
| OV-1 | "No encontré <dato> para la celda <n>. ¿La sustituyo por <propuesta>?" |
| OV-3 | "Propongo esta frase para 'The edge': … ¿Te sirve?" |
| OV-6 / VA-PEERS | "Propongo estos peers: … (y descarto … porque no cotiza). ¿Agregas o quitas alguno?" |
| EV-RES-DATA | "¿La utilidad por acción y el EBITDA los mostramos como los reporta la empresa (GAAP) o ajustados?" · "Además de las básicas, ¿agrego estas métricas: …?" |
| TL-SEG | "La empresa publica estos indicadores: … ¿Cuáles entran?" · "Estas fórmulas del ingreso (p. ej. usuarios × gasto por usuario) tienen datos: … ¿Las incluimos?" |
| EV-NOTES | "Propongo seguir estos temas, llamada a llamada: … (cada uno como tendencia, promesa o vigilar). ¿Cuáles dejamos y cómo los marcamos?" |
| BL-GEN-5 | "Las líneas de gasto del MD&A son: … ¿Hago una pestaña por cada una?" |
| VA-TM | Hoy no se pregunta: queda en espera (⛔). Cuando se pueda: "¿Con qué año hacia adelante trabajamos? (El múltiplo objetivo es el del modelo.)" |
| VA-SENS | Hoy no se pregunta: queda en espera (⛔). Cuando se pueda: "¿Qué dos supuestos movemos en la tabla (p. ej. crecimiento de un segmento y su margen)?" |
| MG-TEAM | "¿Equipo completo que publica la empresa, o solo el C-suite?" |
| MG-TRACK | "Propongo estas calificaciones: … ¿Las ajustas?" |
| MISC | "No cupieron en otra pestaña: … Propongo estas sub-tabs: … — además de las tres de siempre: Competitive position (con estas métricas de la industria: …), Capacity → revenue (aplica / no aplica porque …) y el directorio físico por país. ¿Cuáles creamos?" |
| TL-CUS | "Los clientes principales que puedo sostener con fuente son: … (su peso lo marco *estimate* salvo …). ¿Agregas o quitas alguno?" |
| BL-GEN-2 | "El filing abre el costo de ventas en: … ¿Lo mostramos con esos componentes?" |
| F-FINAL | "Todo aprobado salvo … ¿Hago commit y push? (El PR solo cuando tú lo pidas.)" |
