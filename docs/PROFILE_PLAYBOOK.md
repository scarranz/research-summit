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
Valuation · Management**. (*Miscellaneous* existe en AMZN pero queda fuera de esta guía: si la empresa
ya lo tiene se conserva intacto; si no, no se crea en este proceso.)

> **Verificado contra el código el 13 oct 2026** (main @ `afabbc9`), sección por sección, leyendo
> `js/overviews/amzn.js` y sus motores — no contra los docs anteriores, que se han desviado del código.
> Donde esta guía cita `archivo:línea`, es de esa versión.

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
- §6 Fase 0 — Inventario de datos
- §7 Fase 1 — Esqueleto y vista previa
- §8 Overview (7 bloques)
- §9 Evolution ▸ Results (el dataset que destraba todo lo demás)
- §10 Top Line (4 sub-tabs)
- §11 Evolution ▸ Estimates
- §12 Evolution ▸ Earnings (Setup · Post-Results · Notes)
- §13 Bottom Line (3 sub-tabs)
- §14 Valuation (4 sub-tabs)
- §15 Management (4 sub-tabs)
- §16 Cierre — auditoría final y entrega

**Parte III — Reglas transversales**
- §17 Gráficas
- §18 Tablas
- §19 Texto: dónde sí hay descripciones y dónde no
- §20 Números, unidades y estimados
- §21 Color
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

Estas ocho reglas no se rompen nunca. Si una tarea parece exigir romper una, se detiene y se pregunta.

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
6. **Sin precisión falsa.** Un estimado se marca como estimado; un dato sembrado a mano se marca como
   sembrado y con fecha; si se mezclan periodos se dice.
7. **El dato que falta no se rellena.** Si no hay fuente, la pieza se omite o se marca ⛔ bloqueada en
   la bitácora — nunca se aproxima ni se "estima un poco".
8. **Borrador para revisión.** Claude commitea y hace push a una rama propia cuando el analista lo
   pide, pero **no abre el PR** hasta que el analista lo revise en local y lo pida. Una empresa por PR.
   Solo San u Oscar hacen merge.

## §1 Qué documento manda cuando dos se contradicen

| Para | Manda |
|---|---|
| El **proceso** (orden, compuertas, bitácora) y las **reglas de contenido** de cada unidad | **Esta guía** |
| El **detalle técnico** de un motor (contrato de datos campo por campo) | `RESULTS_CONVENTIONS.md` (Results/Estimates), `PANE_CATALOG.md` §1 (segments), `CHART_ENGINE_REFERENCE.md` (charts) |
| La forma final de algo que esta guía no cubre | **AMZN tal como se ve en pantalla** (abrir el harness y leer el DOM), no los docs |
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
clics** para verla: `http://localhost:8000/harness-<ticker>.html` → pestaña Deep Dive → Top Line →
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
7. **Bloqueos y preguntas abiertas** — qué falta, quién lo consigue, desde cuándo.
8. **Historial de aprobaciones** — una entrada por cada paso por la compuerta, **solo se agrega**
   (append-only), la más reciente al final: fecha · unidad · resultado · qué se mostró · fuentes ·
   cambios pedidos.

### 3.3 Reglas de la bitácora

- Claude la **lee completa al empezar cada sesión** sobre esa empresa, antes de tocar nada, y le
  resume al analista dónde quedaron ("van 9 de 36; la siguiente es TL-OTH; hay 1 bloqueo").
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
la empresa en el harness y cuenta lo que se ve (no solo lo que dice el código). Resultado: una tabla
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
  Si de verdad no cabe en ninguna, se pregunta (nunca se inventa la sub-tab).
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
| 1 | Esqueleto + vista previa (§7) | Para poder mostrar cada unidad desde el principio |
| 2 | Overview (§8) | No depende de nada; es la cara del perfil |
| 3 | Evolution ▸ Results — **el dataset** (§9) | Top Line, Estimates, Earnings Setup y Historic Multiple leen de aquí |
| 4 | Top Line (§10) | Sus series de segmentos apuntan al dataset de Results |
| 5 | Evolution ▸ Estimates (§11) | Mismo archivo de datos que Results, bloque `evolution` |
| 6 | Evolution ▸ Earnings (§12) | Necesita el consenso por trimestre y las transcripciones |
| 7 | Bottom Line (§13) | Necesita el export de Bloomberg |
| 8 | Valuation (§14) | Necesita el dataset de Results/consenso y los peers |
| 9 | Management (§15) | Independiente; puede adelantarse si el analista quiere |
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
| 3 | ¿Existe modelo Summit DCF? ¿Cuántos snapshots? **¿Último periodo real de cada uno?** | MCP Summit: `search_ticker`, `list_dcf_models`, `list_snapshots`; el nombre del snapshot no dice qué trae |
| 4 | ¿Está el ticker en `BBG_CONSENSUS.txt`? ¿Cuántos snapshots y de qué fecha el último? | `G:\My Drive\Summit\Docs\0\BBG_CONSENSUS.txt` (fuera del repo). Al 17 sep 2026: AMZN, GOOGL, LYFT, META, NVDA, UBER (30 c/u), SN, SPOT, TBBB (10 c/u) |
| 5 | ¿Hay múltiplos diarios de Bloomberg (plantilla BQL)? | `BBG_MULTIPLES_TEMPLATE.xlsx` — el camino que usó SN (§14 VA-HIST) |
| 6 | ¿La empresa es "sujeto" en un export SPLC (clientes / proveedores)? | `nvidia-map-reference/`, `robotics-research/`, exports en Drive |
| 7 | ¿Hay transcripciones de llamadas? ¿Cuáles trimestres? | `docs/calls/<TICKER>*.md`; MCP Quartr (`list_events`, `read_transcript`) |
| 8 | ¿Está en el plan de Fiscal.ai (tabla de ejecutivos e insiders)? | Pillars ▸ Management de la empresa en el portal |
| 9 | ¿Massive devuelve precio y market cap? | `liveQuote(ticker)` en la vista previa |
| 10 | ¿Hay fotos de ejecutivos e imágenes de productos? | `img/leadership/`, `img/products/` (opcional; si no, iniciales / emoji) |
| 11 | Año fiscal: ¿cierra en diciembre? Moneda de reporte | 10-K. **Si no es calendario o no es USD, se anota**: varios componentes asumen año calendario (§14) y USD |
| 12 | Modo B: ¿qué contenido existe hoy? | §4.2 B1 |

### 6.2 Qué entrega (tabla en la bitácora)

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Filing anual | 10-K FY2025, acc. … | | Overview, Top Line, textos verbatim | todo |
| Summit DCF | sí, 7 snapshots, último real 2Q26 | | serie Summit en Results/Estimates/Bottom Line; Target Multiple; Sensitivity | Estimates, Target Multiple real, Sensitivity |
| BBG_CONSENSUS | sí, 10 snapshots | | consenso en Results, Earnings Setup, Bottom Line, Historic Multiple | Bottom Line forward, Setup grid |
| … | | | | |

Y una **escalera de capacidades** concreta para esta empresa (qué sub-tabs podrá tener y cuáles no),
derivada de §9.3 y de las fichas. Ejemplo: "DHR no tiene modelo Summit → Estimates, Target Multiple y
Sensitivity no se pueden construir; Results sí (actuals + consenso)".

**Compuerta F0:** el analista confirma el inventario y el alcance. Esto fija qué unidades quedan ⏭️
desde el principio (con su razón) — así el tablero nunca promete algo imposible.

## §7 Fase 1 — Esqueleto y vista previa (unidad `F1`)

### 7.1 Rama y archivos

1. `git checkout main && git pull origin main && git checkout -b feat/<ticker>-profile`
   (modo B: `feat/<ticker>-restructure`).
2. Copiar `docs/profiles/_TEMPLATE.md` → `docs/profiles/<TICKER>.md` y llenar cabecera + inventario.
3. Crear `js/overviews/<ticker>.js` (o, en modo B, trabajar sobre el existente) exportando:
   ```js
   export var <t>Overview = { html, init, headerSources, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
   ```
   - `headerSources` (opcional) pinta los botones de IR y EDGAR en la cabecera del perfil.
   - `absorbsPillars: true` (opcional) oculta la pestaña Pillars. **AMZN no lo usa** (Pillars queda
     visible); seguir a AMZN salvo que el analista decida otra cosa.
4. Registrar en `js/overviews/index.js` (import + entrada en `OVERVIEWS`).

### 7.2 El armazón del Deep Dive

Copiar de `amzn.js` (`deepDiveHtml` ~5390, `wireDD` ~5574, `aBuildSub` ~5524, `deepDiveInit` ~5887):
- la barra de secciones `.dd-tabs > button.dd-tab[data-dd=…]` y los paneles `.dd-pane[data-dd=…]`;
- dentro de cada panel, `.ovt-subtabs > button.ovt-subtab[data-ovst=…]` y `.ovt-subpane[data-ovst=…]`;
- el despachador perezoso `aBuildSub(root, dd, key)` que construye cada gráfica **solo cuando su
  sub-tab se vuelve visible**, dentro de `requestAnimationFrame`;
- el cambio de sub-tab **acotado al panel** (`:scope >`), nunca con `document.querySelector`.

En la Fase 1 las sub-tabs **no se publican vacías**: el armazón existe en la rama, pero cada sub-tab
solo se agrega al HTML cuando su unidad se construye (regla de oro 5). Mientras tanto, la vista previa
muestra solo las sub-tabs ya hechas.

### 7.3 La vista previa local (cómo se le muestra al analista)

- Servidor: `powershell -File serve.ps1` → `http://localhost:8000/` (no usar `python`, no hay).
- Harness: copiar `harness-amzn.html` → `harness-<ticker>.html` (queda fuera de git, `.gitignore`),
  cambiar el import y el ticker. Monta Overview y Deep Dive **sin login**.
- Para revisar Historic Multiple antes de que exista el dato en vivo: `?mockmarket=1` (ver el bloque
  en `harness-amzn.html`).
- Lo que el harness **no** trae: la cabecera del perfil, el precio en vivo de cabecera y la tabla de
  Fiscal.ai (necesitan `companies.js` y sesión). Esas tres cosas se revisan en el portal real
  (localhost con sesión iniciada) en §16.
- **Truco para auditar con automatización:** las pestañas en segundo plano pausan
  `requestAnimationFrame`, así que ninguna gráfica se construye. Antes de recorrer, en consola:
  `window.requestAnimationFrame = fn => setTimeout(() => fn(performance.now()), 0)`.
- Auditar a zoom 100 % (el `zoom` de CSS deforma las gráficas de Chart.js).

**Compuerta F1:** el analista abre el harness, ve la cabecera de pestañas (aunque estén casi vacías) y
confirma que la vista previa le funciona. Desde aquí, cada unidad se muestra así.

---

## §8 Overview — los 7 bloques

**Responde:** *¿qué es esta empresa, en un minuto?* Es el gancho, no el reporte.

**Referencia AMZN:** `amzn.js` 149–597 (datos + render), `html()` 5084, `init()` 5864.
**Tipo:** datos (copiar las funciones `std*` de AMZN y cambiar las constantes). Sin Chart.js: todo es
HTML/CSS e SVG.

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
Los bloques 1–3 no llevan título encima. Los 4–7 usan el colapsable `collapsible(title, inner, false)`
(`amzn.js:158`), con el título exacto de la tabla (cambiando el nombre de la empresa).

### OV-1 Key Facts

- **Forma:** 10 celdas, 5 columnas × 2 filas (2 columnas en móvil). Celdas blancas, divisores finos,
  sin sombreado gris. Línea de acento de 3 px arriba, con `var(--brand-2, var(--brand))` de la hoja
  de estilos — **no** un hex fijo.
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
| 10 | Market cap | en vivo: `$2.45T · live`; si falla: semilla con fecha `~$2.4T · Oct 2026` | `liveQuote` (Massive) |

- **Si falta un dato:** se sustituye por el siguiente hecho más relevante (p. ej. estructura de
  acciones si es dual-class), nunca una celda vacía ni "N/A". La sustitución es decisión del analista.
- **Qué decide el analista:** la celda sustituta, si hace falta.
- **No copiar de AMZN:** la línea de acento con hex fijo (`#2a78d6`); la celda de market cap que se
  queda diciendo "live" si la llamada falla (debe mostrar la semilla fechada).
- **Verificación:** 10 celdas · CEO con antigüedad · market cap con estado (live o fecha) · filer
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
     "FY2025 net sales **$716.9B (+12%)** — the same total, two ways: by segment or by geography."
  2. Pastillas `Segments` (activa) · `Geography`.
  3. Barras horizontales de CSS (`.ov-mbars`): etiqueta · barra con el $ dentro · % a la derecha.
     Segmentos en orden del 10-K; geografía de mayor a menor, con "Rest of world" al final.
  4. Acordeones de definición, uno por segmento (`.acc`), título = nombre del segmento + paréntesis
     corto que diga qué es ("AWS (most of the profit)"):
     - cuerpo: **qué es, qué hace y cómo cobra**, cualitativo, ~40–60 palabras, **sin números**;
     - dentro, un acordeón anidado **"The numbers"** con filas clave/valor: ventas y crecimiento,
       utilidad operativa, margen, y un hecho de contexto. Aquí **sí** van números;
     - subsegmentos (si existen): otro nivel anidado dentro del segmento, con números.
  5. Un acordeón final opcional **"The revenue lines"** si el 10-K desagrega ingresos por producto
     (AMZN: 7 líneas con $ · % · crecimiento).
  6. Leyenda de cierre con utilidad operativa y neta del año + la frase que cambia la lectura.
- **Regla de las ≥ 2 rebanadas:** si hay un solo segmento o una sola geografía, no se dibuja una barra
  única — se dice en una línea ("single reportable segment") y se muestra solo la vista que califica.
- **Cuadre obligatorio:** suma de segmentos = suma de geografías = ventas totales reportadas
  (tolerancia: redondeo declarado). Claude lo verifica con números y lo reporta en ④. Si no cuadra, es
  un error de datos y no se muestra.
- **Fuente:** 10-K, nota de segmentos y desagregación de ingresos (AMZN: Nota 10).
- **No copiar de AMZN:** prosa con números dentro de "The revenue lines" (los números van en filas).

### OV-5 Products & platforms

- **Contenido:** leyenda "**Tap any family** for the specific products inside it." + rejilla de
  tarjetas, **una por familia de producto** (AMZN: 7 familias, 25 productos).
- **Tarjeta:** icono (emoji, o foto `img/products/<ticker>-*.jpg` si existe — si falla, se oculta) ·
  nombre de familia · una línea de ≤ 6 palabras · "See products ›".
- **Al hacer clic (modal):** título = icono + familia; la línea; luego la lista de productos
  específicos, cada uno **nombre en negrita + 1–3 líneas** de qué hace y para qué sirve.
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
     círculo; tamaño = market cap en vivo. La empresa del perfil con borde grueso.
  4. Fila de chips: un chip por peer con **×** que lo **elimina** (no lo tacha); campo "+ TICKER" y
     botón Add. Re-agregar un peer conocido restaura sus múltiplos sembrados.
  5. Leyenda: "Remove a peer with the × on its chip, or add one by ticker. Only **listed** peers with a
     public multiple plot here — <rivales privados con nombre> have no market multiple." + nota:
     "Multiples & growth are seeded approximations (<Mmm AAAA>; …); market caps are live."
- **Datos:** arreglo `A_PEERS` = `{tk, n, peT, peF, evT, evF, gt, gf, mc, hl, why}` (§14 VA-PEERS);
  **el mismo arreglo y el mismo estado** alimentan el mapa del Overview y Valuation ▸ Peers. La tabla
  de números solo aparece en Valuation ▸ Peers.
- **Fuente:** múltiplos y crecimiento sembrados y fechados (fuente nombrada en el pie, no solo en un
  comentario de código); market cap en vivo (Massive).
- **Qué decide el analista:** el conjunto de peers (normalmente 5–8 cotizados + la empresa) y la frase
  `why` de cada uno.
- **No copiar de AMZN:** colores naranjas sobrantes (`#FFB84D`, `#C7761A`); los topes fijos de los
  ejes (45× / 30× / 25 %) si los peers los rebasan — ajustar los topes para que nadie quede pegado al
  borde; múltiplos trailing y forward idénticos para la propia empresa (error de siembra en AMZN).
- **Verificación:** P/E y EV/EBITDA cambian el eje · Forward/Trailing cambian ambos ejes · × elimina ·
  Add funciona · ningún peer pegado al borde sin aviso · el pie dice la fecha de siembra.

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
- **Fuente:** IR, 10-K, prospecto, comunicados oficiales.
- **No copiar de AMZN:** el hito de $2T (Jun 2024) va después de uno de 2023–26: respetar el orden.

### OV-F Pie del Overview

Un `.ov-foot` al final, con este formato:
"Sources — <filing> (SEC EDGAR) for <qué cifras>; <IR / comunicados> for qualitative content and
history; <otros>. Market cap and peer bubbles are live (Massive); peer multiples & growth are seeded
approximations (<Mmm AAAA>), directional. Forward figures are estimates, not company guidance."
Sin firma de autor. El Deep Dive tiene sus propios pies (uno por panel).

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
  estMatrix?: { … },   // GENERADO por scripts/consensus/ — no se edita a mano
  evolution?: { … }    // §11
};
```

- **Métricas mínimas** (lo que AMZN tiene; adaptar nombres al 10-K):
  - Trimestral — Top Line: `rev` (Totals) · un key por segmento (Segments) · líneas de ingreso si el
    10-K las da (Revenue lines). Margins & Profitability: `opinc`, `eps`, `capex` (Company) · utilidad
    operativa por segmento con `marginOf` = ventas del segmento (Segments).
  - Anual — Top Line: `rev` + segmentos. Margins & Profitability: `ebitda` (por defecto), `earnings`,
    `capex` + **utilidad operativa por segmento también en anual** (AMZN no la tiene en anual y por eso
    Top Line ▸ Segments pierde esa métrica al cambiar a Annual — no repetirlo).
- **`act`** = lo reportado (8-K Ex. 99.1 / 10-Q). **`summit`** = la proyección congelada del modelo
  antes de cada print. **`cons`** = consenso de la calle (BBG). **`guideLo/guideHi`** = guía de la
  empresa (del 8-K anterior). Un periodo futuro **es** `act: null` — no existe otra bandera.
- **Margen:** numerador y denominador de la **misma** serie, siempre.
- **Etiquetas de periodo:** `nQyy` (`3Q26`) trimestral, `yyyy` anual. (Earnings usa `Q3 2026`; no
  mezclar formatos dentro de un mismo archivo.)
- **Comillas:** delimitadores de string con comillas rectas. Una comilla tipográfica como delimitador
  rompe `results.js` **para todas las empresas** (ya pasó).
- **Registro:** importar y agregar `<T>: <t>Results` en `RESULTS_DATA` (`results.js` ~22–63).
- **Fuentes:** actuals del 8-K/10-Q; Summit del MCP (`get_fundamentals`, `projection_history`); consenso
  de `BBG_CONSENSUS.txt`, y si el ticker no está, compilado a mano por print en
  `docs/calls/<TICKER>.md` (diciendo el piso de ruido).

**Compuerta EV-RES-DATA:** Claude muestra una tabla de cuadre: para 3 periodos al azar, el valor del
archivo vs el documento fuente, métrica por métrica. El analista aprueba los números antes de ver
ninguna gráfica.

### 9.2 La pestaña Results — qué se ve (de arriba a abajo)

1. **Selector "Estimates as of"** — solo si hay `estMatrix`. Modos: *Latest file before each print*
   (por defecto) · *As of a date* · *One Summit model file* · *One Street (Bloomberg) file*; y una nota
   de vintage ("Summit: 7 snapshots…").
2. **Un bloque por sección** (`top`, `margins`), cada uno con:
   - **Fila 1:** nombre + desplegable de métricas **agrupado por familia** (`<optgroup>`: Totals ·
     Segments · Revenue lines · Company…). Cada opción con su nombre completo.
   - **Fila 2:** Quarterly | Annual · unidad (`$B`) | Growth | Margin % (solo si hay `marginOf`) ·
     YoY | QoQ (en Growth trimestral) · % | Amount (en Growth) · Values On | Off (Off) — y a la
     derecha, rangos: Last 4Q · Last 8Q · Reported · Forward · All (anual: Last 3Y · Last 5Y · …).
   - **Leyenda (chips que ocultan la serie en la gráfica Y en la tabla):** Actual (navy) · Summit model
     (azul) · Consensus (gris) · Guidance (banda o marca) · línea de margen; banderas ámbar
     "⚑ No company guidance" cuando aplica; pista "▲ beat · ▼ miss · click a chip to hide it".
   - **Gráfica:** barras; zona sombreada "FORECAST" en periodos futuros con etiquetas en burbuja;
     margen en el eje derecho exterior; arrastrar para hacer zoom en **ambos ejes**, doble clic
     restablece; slider de periodos debajo.
   - **Tabla "Period detail"** (colapsada por defecto — `tbl: false` en `results.js:272`): periodos en
     columnas (E en estimados), filas Actual / crecimiento / margen, y por cada fuente valor /
     crecimiento / sorpresa / margen; columna fija "Range record" (CAGR, ▲/▼, desviación media,
     aciertos de guía).
   - Pie del bloque: la `note` de la métrica.
3. **"Actuals vs Estimates"** (tarjeta de sorpresas) — aparece sola si dos series se traslapan en
   periodos reportados: comparar contra Summit ✓ / Consensus ✓ / Guidance ✗; modo Surprise % | Amount;
   barras divergentes; tabla colapsada.
4. **"Road to the print"** — aparece sola si hay `estMatrix`: cómo llegó el pronóstico de un periodo,
   snapshot por snapshot.
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
| + `summit` / `cons` | chips, filas de sorpresa, Range record, tarjeta Actuals vs Estimates |
| + `guideLo/guideHi` | banda de guía, filas de guía, Low/Mid/High |
| + `estMatrix` (generado) | selector de vintage **y** Road to the print, automáticamente |
| + `evolution` | la pestaña Estimates (§11) |
| + `<ticker>-setup.js` | la gráfica de Earnings ▸ Setup (§12) |

---

## §10 Top Line — 4 sub-tabs (motor `segments.js`)

**Responde:** *¿de dónde viene el ingreso y qué lo mueve?*

**Referencia AMZN:** motor `js/segments.js`, datos `js/segments-data/amzn.js`, montaje
`amzn.js:5402-5414` y `aBuildSub` 5525–5532. **Tipo:** motor — se escribe
`js/segments-data/<ticker>.js` y se registra en `SEGMENTS_DATA` (`segments.js` ~34–58) junto con
`THEME_SEG` / `THEME_SRC` si hay Notes. Ya lo usan AMZN, DHR y SN.

**Requisito:** `EV-RES-DATA` aprobado. Cada `drivers.rev` / `drivers.opinc` de un segmento es un
**puntero** `{from:'results:<key>'}` a una métrica que debe existir en el dataset de Results; si no
existe, la serie desaparece sin avisar.

El archivo dice que se genera con `scripts/segments/emit_segments.py` (insumos
`scripts/segments/*_<ticker>.json`) y se verifica con `node scripts/segments/verify_segments.mjs <TK>`.
Si se edita el `.js` a mano, la edición se pierde en la siguiente regeneración: decidir en F0 si se
usará el generador o la edición manual, y anotarlo en la bitácora.

### Comportamiento común de las gráficas de Top Line

Controles (fila etiquetada): **Period** Quarterly | Annual · **Show** $B | Share | Growth · con Growth:
**Compare** YoY | QoQ y **Growth in** % | $ added · **Layout** Stacked | Side by side (solo barras en
$B) · **Values** On | Off (Off). Leyenda en chips (ocultar quita la serie de gráfica, tabla y conteos).
Zoom en ambos ejes, doble clic restablece. Slider de dos manijas. Tabla colapsada:
"<título> · show · N series over M periods". Estimados = solo Summit (Top Line no lee consenso),
sombreados con "FORECAST" y marcados E. Colores: `SUMMIT_CAT` en orden fijo.

### TL-GEN General (`segov`, activa por defecto)

1. **"The segments"** (sub: "N reportable"):
   - Cita del 10-K con chip **FILING**: la oración del Item 1 que dice cómo se organiza la empresa
     (`overview.tenK = {text, where}`), verbatim.
   - **Tarjetas de segmento** (una por segmento, en orden del arreglo), plegadas: nombre · "what it
     does" · cifra grande (ventas del último trimestre, p. ej. "$42.2B · 2Q26 net sales") · ▲ YoY ·
     "% of group revenue". Al abrir: `brief` (3–4 oraciones en lenguaje simple) + lista `sells`
     (3–5 viñetas "**nombre** — qué es").
2. **"How revenue divides"** — gráfica de barras apiladas por segmento, trimestral por defecto, con
   total arriba de cada columna; tabla "Revenue detail".
3. Pie `.ov-fynote.sg-src` = `source` del archivo.

- **Texto:** la cita del 10-K + `brief` en cada tarjeta. Nada más.
- **No copiar de AMZN:** `overview.interactions` (dato muerto, no se muestra — no escribirlo).

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
5. **"What management has said"** — viene de la herramienta de Notes (§24), filtrada por segmento;
   orden por Quarter | Theme. Si no hay notas: "⚑ The theme record carries no entries for this
   segment yet."
6. Pie = `source`.

- **Qué decide el analista:** qué KPIs (solo los que la empresa **publica**), qué identidades de
  ingreso, el `summary` de cada segmento, qué productos listar.
- **Reglas de texto:** "FILING" = verbatim y con ubicación; "CALL" = de una transcripción con
  trimestre; "OURS" = nuestra lectura, corta. Nunca se mezcla: una paráfrasis no lleva chip FILING
  (AMZN lo hace en algunos KPIs — no copiar).
- **No copiar de AMZN:** `adjacencies` (no se muestra); un término repetido en `highlights`; la falta
  de utilidad operativa anual por segmento (§9.1).

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

Sin gráfica. Cuatro secciones:
1. **"What the company discloses"** — concentración de clientes: si no se divulga, el recuadro ámbar
   "⚑ No customer concentration is disclosed at all…" + desplegable con la nota y la cita. Eso **es**
   el hallazgo, no un hueco.
2. **"The customer classes it names for itself"** — tarjetas con las clases de cliente del Item 1,
   cada una con su cita verbatim.
3. **"Named on the record"** — clientes nombrados en llamadas (se juntan solos desde
   `products[].customers.named`).
4. **"Who has said they buy from <Empresa>"** — tabla SPLC (cliente · ticker · relación · tamaño ·
   % de su costo · base), solo si hay export SPLC con la empresa como sujeto
   (`py scripts/segments/load_splc.py <TK> <export.csv>`). **Primero la limitación** (cuánto del
   ingreso cubre), después la tabla.

- **No copiar de AMZN:** la frase de cobertura en el motor está escrita para Amazon ("consumers do
  not file") — revisar que tenga sentido para la empresa o pedir que se generalice; el orden de
  "Named on the record" es alfabético-lexical, no cronológico.

---

## §11 Evolution ▸ Estimates (`EV-EST`)

**Responde:** *¿cómo se movió nuestra visión (y la de la calle) sobre FY26, FY27, FY28?*

**Referencia AMZN:** `resultsEvoHtml('AMZN')` / `initResultsEvo('AMZN')`, bloque `evolution` de
`results-data/amzn.js` (~944–1028). **Tipo:** motor.

**Requisito:** modelo Summit con **≥ 2 snapshots**. Sin eso, la sub-tab **no existe** (⏭️ con razón),
no se fabrica.

**Contenido, por sección** (`top` "Top Line" con `rev` por defecto; `prof` "Profitability" con
`capex` por defecto — AMZN; para otra empresa el analista elige el default):
- Modo `US$B` | `Growth` (% | Amount) | `Margin %`; interruptor "Reported" (apagado).
- Leyenda: un chip por año fiscal (rampa de un solo tono, clara→oscura — los años son ordinales; **no**
  usar la paleta categórica) · Summit (sólida) · Consensus (punteada) · Reported (de puntos).
- Gráfica de líneas: eje X = snapshots con etiqueta de evento ("Dec 18 2025 · post-3Q"), una línea
  por año × fuente; tooltip con la revisión contra el snapshot anterior.
- Tablas "Revision record" y "Snapshot by snapshot" (colapsadas).
- Bloque **"Projection by snapshot"**: la curva de un snapshot (el más nuevo), con "⇄ Compare" contra
  el anterior.
- Pie: `evolution.note`.

**Datos:** `evolution = { note, vintages:[{label,event}], years, sections, metrics:{ k:{ label, unit,
marginOf?, note, summit:[[…]], cons?:[[…]], prior:{summit:[…], cons?:[…]} } } }`. Se genera con
`scripts/consensus/emit_evolution.py` desde el MCP Summit (`projection_history`).
- **`prior` es obligatorio para toda métrica con modo Growth** (el año fiscal previo al primer año
  seguido), o el primer año no tiene crecimiento.
- **El montaje debe pasar el ticker:** `requestAnimationFrame(function(){ initResultsEvo('<T>'); })`.
  Sin el ticker, los botones de Growth/tabla dejan de responder sin aviso.

---

## §12 Evolution ▸ Earnings — Setup · Post-Results · Notes

**Responde:** *¿qué espera la calle de este trimestre, qué pasó, y qué hilos seguimos llamada a
llamada?*

**Referencia AMZN:** maquinaria `ce*` en `amzn.js` (`ceSetupBody` 1715, `ceResultsBody` 2396,
`ceWatchBody` 1789, `wireDD` 5574). La copia de referencia para otra empresa es
`js/overviews/sharkninja-ce.js` (extracción mecánica del bloque de AMZN con los datos cambiados).
**Tipo:** a medida (se copia el bloque completo **por símbolo**, no por rango de líneas, y se cambian
los datos).

Arriba de las tres fases: pestañas de fase `Setup` (activa) · `Post-Results` · `Notes`, y pastillas de
trimestre (más nuevo primero; Post-Results solo muestra trimestres ya reportados; Notes oculta las
pastillas porque no es por trimestre).

**Datos que alimentan Earnings:**
- `CE_CONS` — consenso por trimestre desde `BBG_CONSENSUS.txt`: `asOf[]`, `q[]` ("Q4 2022"…),
  `nHead` (= 9 métricas de encabezado), `m[]` (15 métricas en AMZN: 9 de encabezado + 6 propias de la
  empresa). **Hoy no hay generador en el repo** — anotarlo en F0 como bloqueo a resolver.
- `CALL_EARNINGS = { ticker, quarters:[ {q:'Q3 2026', status:'upcoming'|'reported', date,
  setup:{us, notes}, results:null|{…}, call:null|{prepared, qanda, highlights, newQuestions}} ] }`,
  más nuevo primero.
- `js/results-data/<ticker>-setup.js` — copia de `amzn-setup.js` con **una sola sección de clave
  única** (`'setup'`, nunca `top`/`margins`, que chocarían con Results).

### EV-SET Setup (antes del print)

1. Chip "① Pre-Call" (gris "frozen" si el trimestre ya se reportó).
2. **Barra "Estimates":** Consensus | Summit | Both (Consensus) · YoY | QoQ | Off (YoY) ·
   Margin | Hide mgn (Hide).
3. **Dos rejillas:** "Headline — every company, always" (9 métricas fijas: Revenue, Gross profit,
   Operating income, EBITDA, EPS (diluted), Operating cash flow, Capex, D&A, Diluted shares) y
   "Custom KPIs — <TICKER>" (las propias: ventas y utilidad por segmento, o los KPIs de la empresa).
   Cada celda: mini-tabla Street | Summit, chips de crecimiento, fila de margen (si aplica) y un `?`
   con la advertencia de esa métrica (`setup.notes[métrica] = {t, h}`).
4. **"The Setup picture — reported vs Street"** — segunda instancia del motor de Results con el
   dataset `<T>_SETUP`.
5. **Consensus Evolution** — revisiones de la calle por snapshot de BBG (`consensus-evolution.js`,
   datos en `consensus-evolution-data.js`). Opcional: solo si hay al menos ~6 snapshots de BBG.

- **Fuentes:** Street = BBG; Summit = snapshot más reciente del modelo (anotar la fecha); `?` = 8-K de
  guía + la llamada anterior.
- **Regla:** las claves de `setup.notes` son **exactamente** los nombres de `CE_CONS.m[].k`; una nota
  con una clave que no existe no se ve (AMZN tiene "Advertising" huérfana).
- **No copiar de AMZN:** el título "(Summit pending)"; números Summit de un snapshot viejo cuando hay
  uno más nuevo; el texto "Custom KPIs — AMZN" y `consensusEvo.html('AMZN',…)` fijos.

### EV-POST Post-Results (después del print)

Por trimestre reportado:
1. Chip "② Post-Results".
2. **"The print — down the income statement"** (`?` "How this is built"): controles View Cards | Chart
   (Cards) · Basis vs Street | vs Summit | Both (vs Street) · filtro All | Beats | Misses | In line ·
   orden Statement order | By surprise · Lines All | Top line | Bottom line · Margin · Growth. Cada
   tarjeta: métrica + veredicto (**|sorpresa| < 2 % = in line**), tabla Street | Summit | Actual con
   valor / crecimiento / margen. En Chart: barras divergentes de sorpresa en un solo eje %.
3. **"Call Summary"** (plegado) — *By Prepared Remarks* (tema + cuerpo) | *By Analyst Question*
   (pregunta; al abrir: 🏦 banco + analista, **Q** completa, **A** con la voz directa de management,
   partes clave en negrita). Cada punto con "＋ add note".
4. **"📝 Propose Notes"** (plegado) — tarjetas con los temas nuevos de la llamada
   (`call.newQuestions`), cada una con Theme / Sub-theme sugeridos y texto editable; ✓ Accept / ✕
   Reject; **"Publish to Notes →"** las archiva en Notes.
5. **"Also on the call"** (plegado) — los demás puntos (`call.highlights` que no sean `band:'lead'`),
   cada uno con "Still open" y "＋ add note".

- **Fuentes:** actuals del 8-K; Street/Summit como en Setup; Call Summary de la **transcripción**
  (`docs/calls/<TICKER>-latest.md`, o Quartr). Las respuestas de management son **citas directas**,
  no resúmenes con voz de Claude.
- **Qué decide el analista:** qué temas se proponen como notas y a qué tema se archivan.
- **No copiar de AMZN:** `ceGuessTarget` tiene expresiones regulares de Amazon (agentic, AWS…) —
  reescribirlas para la empresa; los campos `results.notes/watch/thesisCheck…` no se muestran: no
  gastar tiempo llenándolos.

### EV-NOTES Notes — ver §24 para las reglas de uso

Lo que se construye en esta unidad: el registro de temas de la empresa (`js/themes-data/<ticker>.js`,
semilla), el orden de temas (`<T>_SEG_ORDER`), y el montaje de `ceWatchBody`. Contenido:
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

1. **Antes:** trimestre nuevo al **frente** de `CALL_EARNINGS.quarters` con `setup`; `CE_CONS` con el
   snapshot nuevo; guía (`guideLo/Hi`) del último 8-K; regenerar `estMatrix`.
2. **Print + llamada:** `act` en Results; marcar el trimestre `reported` + `results:{}` + `call:{…}`;
   snapshot post-print en `estMatrix`/`evolution`; rotar `docs/calls/<T>-latest.md` a `<T>.md`.
3. **Notas:** se archivan en el portal (Propose Notes / ＋ add note), no editando la semilla.

---

## §13 Bottom Line — 3 sub-tabs

**Responde:** *¿dónde deja el ingreso de ser ingreso?*

**Referencia AMZN:** `amzn.js` (`aGeneralPicker` 3525, `aMarginsBody` 3561, `aBridgeBody` 3260,
`aNetBridgeBody` 3422, `aSbcBody` 3468, `expenseTabsBody` 3829, `segmentsBody` 4131, `aSplcBody` 5141)
y los datos `js/overviews/amzn-bbg.js`. **Tipo:** datos generados + vistas a medida (se copian; no hay
motor compartido). **Preferir `js/overviews/dhr-chartkit.js`**, que ya extrajo el andamiaje, la
cascada, las tablas y el selector — no hacer una tercera copia.

**Datos:** `js/overviews/<ticker>-bbg.js`, **generado** por `scripts/bbg_extract.py <TICKER>` desde
`BBG_CONSENSUS.txt` (no se edita a mano). Antes de correrlo (bloqueos a anotar en F0):
- la ruta `SRC` del script dice `G:\Mi unidad\…`; en esta máquina es `G:\My Drive\…`;
- el script necesita Python, y `python` aquí es un stub roto;
- agregar los ids de segmento de la empresa en `SEGNAMES` y **revisar el mapa `CODE`** contra las
  etiquetas `metricN` de la empresa (está pensado para Amazon: `CB_IS_OTHER_OPEX → fulfillment`…);
- el archivo de BBG cambia: el AMZN commiteado es del 8/4/2026 y ese snapshot ya no está — fijar y
  anotar el `asOf` usado.

Además, a mano desde el modelo Summit / 10-K: tabla anual de gastos funcionales y segmentos (como
`A_OPEX`, FY18–FY25), tabla trimestral (`A_OPEXQ`, **con fuente**), notas del 10-K (`A_TENK`: capex y
PP&E por segmento, SBC por función) y acciones diluidas del modelo.

### BL-GEN General (`margins`, activa por defecto)

Arriba: selector "CHART" con 4 vistas — *Profitability & margins* (por defecto) · *The bridge —
revenue → operating income* · *Operating income → net income* · *Stock-based compensation*; pista
"Pick one — the rest stay tucked away."

**BL-GEN-1 Profitability & margins**
- Desplegable: Gross profit · **Operating income (GAAP)** (por defecto) · EBITDA · Net income (GAAP) ·
  Free cash flow — **agrupado** en optgroups (AMZN no lo agrupa; regla §17).
- Modos: Period Annual (por defecto) | Quarterly · Net Reported | Normalized (**solo visible cuando la
  métrica es Net income y el periodo anual**) · rangos All · Reported · Forward · Last 5.
- Leyenda: un chip por fuente (Actual · Summit · Consensus) que oculta barra **y** línea de margen.
- Gráfica: barras = $ (eje derecho), líneas = margen % (eje derecho exterior); periodos futuros
  desvanecidos (`aFadeC`), tooltip con "(E)"; zoom en ambos ejes.
- Tabla "Data — what the chart draws" (colapsada) con lo que se dibuja.
- **Normalized:** resta la ganancia no operativa después de impuestos, a la tasa efectiva del
  periodo. ⚠ En el export de BBG `otherNonOp` está con signo de **gasto**: una ganancia viene negativa
  (`G = −otherNonOp`). Si no se invierte, una ganancia de $53B se dibuja como pérdida.
- **Regla:** cada serie con su definición — no se grafica la "earnings" ajustada del modelo Summit con
  la etiqueta "Net income (GAAP)" (AMZN lo hace — no copiar). Si la base difiere, la etiqueta lo dice.
- **No copiar de AMZN:** consenso que repite el último real; arrastre vertical que truena
  (`onY = null`); años fijos en el código (`'FY23'…`) — derivarlos del dato.

**BL-GEN-2 The bridge** (`.ov-sec-h` "The bridge — how revenue becomes operating income")
- Modos: **Build-up ($B)** (por defecto) · Margin change (bps) · Forward (expenses).
- Build-up: cascada Ingreso → − cada línea de gasto funcional → Utilidad operativa; Annual (año más
  reciente por defecto) | Quarterly (año + trimestre; los no reportados deshabilitados).
- bps: margen del año "From" → contribución de cada línea en bps (verde/rojo) → margen del año "to".
- Forward: año estimado + 5 sliders (±25 %) por línea contra consenso; el resto es un residual fijo,
  así con todo en 0 cuadra con el consenso; "Reset to consensus".
- Tabla "The waterfall — every step" (Step | Value | Running), colapsada.
- **Líneas de gasto:** las del MD&A de la empresa (sus nombres), no las de Amazon.

**BL-GEN-3 Operating income → net income** — cascada Op. income → interés neto → ganancias de
inversiones (ámbar) → impuestos → otros → Net income; toggle Reported | Normalized; año (estimado más
cercano por defecto); leyenda dinámica de ~2–3 oraciones con margen neto reportado vs normalizado y la
fuente al final.

**BL-GEN-4 Stock-based compensation** — vista Dilution (por defecto: barras SBC + líneas de acciones
diluidas Summit vs consenso) | SBC by line (apiladas por función); unidad $B | % (de ingreso en
Dilution; del SBC total en By line). **Leyenda clicable en ambas vistas** (AMZN no la tiene en
Dilution — no copiar). Rango del eje de acciones derivado del dato, no fijo.

**BL-GEN-5 Expense lines** (colapsable al final, cerrado: "Expense lines — the N functional deep dives")
- Explorador con una pestaña por línea de gasto (color · nombre · `$X · Y% of revenue` calculado del
  dato, no tecleado). Por línea, de arriba a abajo:
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

**Pie del panel General:** AMZN no tiene uno a nivel de panel (solo dentro de los colapsables); una
empresa nueva **sí** lo lleva: "Sources — Bloomberg consensus export (as of <fecha>); <filing> MD&A;
Summit DCF (snapshot <fecha>)".

### BL-SEG Segments (`segments`)

Selector "CHART": *Operating income & margin by segment* (por defecto) · *Revenue vs profit — common
size* · *The segment bridge*; más el colapsable "Segment deep dives…".
1. **Profit by segment — Actual vs Summit vs Consensus:** métrica Operating income | EBITDA; pastillas
   de segmento (el más relevante por defecto) + Consolidated; Annual | Quarterly. Barras $ + línea de
   margen. **Trimestral + EBITDA debe dibujar trimestral** (AMZN cae al anual — no copiar).
2. **Revenue vs profit — common size:** métrica Revenue | Operating income | EBITDA; Basis · Show $B |
   Share | Growth · Layout · Period · Compare · Growth in (los controles que no aplican se ocultan).
3. **The segment bridge:** Historical (utilidad del año "From" → Δ por segmento → año "to") | Forward
   (vs Consensus | vs Summit, con sliders por segmento). Si una base cae a la otra por falta de dato,
   la nota lo dice (AMZN lo hace en silencio — no copiar).
4. **Segment deep dives** (colapsable): pestaña por segmento con KPIs, "The business", margen en el
   tiempo, "What moves it", la definición verbatim de la nota de segmentos, estructura de costos
   ("what the company breaks out — and doesn't"), citas de llamadas y pie.
- **Pie del panel:** obligatorio (AMZN no lo tiene a nivel de panel).

### BL-SPLC Supply Chain (`supplychain`)

Solo si la empresa es sujeto en un export SPLC de proveedores; si no, ⏭️ (no se publica vacía).
1. KPIs (5): proveedores rastreados · instalaciones · % en EE. UU. · % en China · relación más grande.
2. **Cadena 1** (la más estratégica): tarjetas por proveedor con barra de tamaño relativo, % del costo,
   dependencia; clic → modal con la lectura.
3. **Cadena 2:** tabla Supplier | Relationship | <T> cost % | Their exposure | Category.
4. **"Who needs whom"** — barras de dependencia de ingreso del proveedor respecto a la empresa.
5. Geografía: barras horizontales por país (% de instalaciones), con tabla.
6. Pie: "Source: Bloomberg Supply Chain Analysis (SPLC), <TICKER> US Equity, as of <fecha>.
   Relationship sizes are Bloomberg estimates; directional, not audited."
- **Primero la limitación**, si la cobertura es baja.

---

## §14 Valuation — 4 sub-tabs

**Responde:** *¿cuánto vale, y contra qué?*

**Referencia AMZN:** `amzn-histmult.js`, `valuationPeersBody` (`amzn.js` 4881), `amzn-target-multiple.js`,
`amzn-sensitivity.js`. **Copias de referencia para otra empresa:** `sharkninja-histmult.js`,
`sharkninja-peers.js`, `sharkninja-target-multiple.js`, `sharkninja-sensitivity.js` (SN ya resolvió
varios defectos de AMZN). **Tipo:** a medida (copiar el módulo y cambiar datos).

### VA-HIST Historic Multiple (`histmult`, activa por defecto)

- **Contenido:** título "Historic Multiple" + pista "P/E and EV/EBITDA, forward and trailing — click a
  chip to drop one" · base Forward NTM (por defecto) · Current FY · FY+1 · FY+2 · FY+3 · base Trailing
  LTM (por defecto) · Last FY · densidad Daily (por defecto) · Quarterly · Annual · rangos 1Y 2Y 3Y 5Y
  All · slider de fechas · chips P/E fwd · P/E trail · EV/EBITDA fwd · EV/EBITDA trail (+ "Average over
  the range" cuando hay una sola línea; + "Fiscal-year rolls") · gráfica de líneas (P/E eje derecho
  interior, EV/EBITDA exterior; insignias con el valor actual) · lectura de rango (mín–máx, actual) ·
  tabla "Detail" (colapsada, trimestral/anual, más nuevo primero) · pie con cómo se construye cada
  línea y de dónde sale cada dato.
- **Camino de datos recomendado — el de SN:** múltiplos diarios **congelados** de Bloomberg
  (`<ticker>-bbg-multiples.js` = `{asOf, d[], px[], pe1, pe2, pe3, ev1, ev2, ev3}`, sacados con la
  plantilla BQL). Funciona hoy, no depende de nada sin desplegar.
- **Camino AMZN (no recomendado para empresa nueva):** precio y acciones/deuda en vivo vía la función
  `get-market-history`, **que sigue sin desplegarse** (solo San/Oscar pueden), así que en el portal
  muestra "⚑ Live data unavailable". Además, con los datos de AMZN el P/E forward NTM queda **vacío**:
  el consenso de EPS por año se arma sumando 4 trimestres de un mismo snapshot, y eso casi nunca
  existe. **Regla:** el P/E forward necesita una fila de EPS **anual** por snapshot.
- **Qué decide el analista:** base GAAP vs ajustada; qué horizontes tienen sentido (los que no tienen
  dato se deshabilitan con la razón, como SN).
- **Si falta el dato:** las líneas sin denominador no se dibujan; nunca un 0× inventado (agregar la
  guarda de SN en `numerAt`).
- **No copiar de AMZN:** año fiscal = calendario fijo en el código (si la empresa no cierra en
  diciembre, cambiarlo); zoom vertical solo en el eje de P/E; tooltip de EV/EBITDA que dice "price ÷".

### VA-PEERS Peers (`peers`)

- **Contenido:** `.ov-lede` (~1–2 oraciones: "The peer map. The same live-cap scatter as the
  Overview, kept beside the valuation work…") · el mismo mapa que OV-6 (mismo estado: quitar un peer
  aquí lo quita allá) · **tabla "The numbers behind the map"** (abierta): Peer · múltiplo activo ·
  crecimiento · market cap · vs peer avg; filas de promedio y mediana **sin** la empresa del perfil.
- **Datos:** `A_PEERS`, campo por campo: `tk` · `n` nombre · `peT`/`peF` P/E trailing/forward ·
  `evT`/`evF` EV/EBITDA trailing/forward (si `evF` es derivado, decirlo) · `gt`/`gf` crecimiento de
  ingreso trailing/forward en % · `mc` market cap $B (respaldo; el vivo lo reemplaza) · `hl: true`
  solo para la empresa · `why` una oración para el tooltip.
- **Excepción aceptada:** sin zoom ni ocultar-por-leyenda (los chips × cumplen esa función).
- **Pie:** `.ov-foot` con la fuente y fecha de siembra (AMZN solo tiene una nota — usar pie).
- **No copiar de AMZN:** el tinte naranja en la fila de la empresa.

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
- **Datos:** por año forward, una fila por snapshot Summit con `rev`, `ebitda`, `earn`, `sh`; más el
  año previo de cada snapshot para el PEG. Del MCP Summit.
- **Regla clave:** **el modo por defecto no puede ser ilustrativo.** En AMZN "Recorded multiple" usa
  múltiplos inventados (`MOCK_EV/MOCK_PE`). En una empresa nueva el defecto es **Live** con los
  múltiplos que decida el analista, salvo que existan los múltiplos registrados reales del workbook.
- **Qué decide el analista:** los múltiplos objetivo (EV/EBITDA y P/E), el año forward de trabajo
  (ciclo de escritorio 1 nov → 31 oct), y si un cambio de definición rompe la comparación.
- **Sin modelo Summit:** un solo snapshot del consenso (camino SN); o ⏭️.
- **No copiar de AMZN:** el pie que dice "net debt from the live quote" aunque la llamada haya fallado
  (SN rastrea la fuente real).

### VA-SENS Sensitivity Analysis (`sensitivity`)

- **Contenido:** año de valuación (último año forward por defecto) · Assumptions: Summit model |
  Street consensus · Exit multiple on EV/EBITDA | P/E · valor del múltiplo · ejes X e Y: cada uno elige
  un driver (crecimiento o margen de un segmento, o el múltiplo), "starts at", "step", reset · franja
  "Held at …" con todo lo que queda fijo · **rejilla 5×5** de precio implícito con ±% vs precio en vivo
  (verde arriba, rojo abajo; tooltip con la cadena EBITDA × múltiplo = EV → equity → $/acción) ·
  tarjeta de comparación con la otra base ("What consensus assumes") · tarjetas del mismo caso base en
  4 años · nota · pie.
- **Datos:** de **un** snapshot Summit: por año (base + 4) y por segmento `rev`, `op`, `eb`; más
  `corp`, `earn`, `tax`; acciones; drivers con su paso. D&A por segmento = `eb − op`, fija.
- **Regla clave:** el consenso (`CONS`) **no puede ser marcador**. En AMZN es inventado (⚑
  "placeholder"); en una empresa nueva se conecta al export de BBG por segmento, o la opción Street
  consensus no se muestra.
- **Si la empresa no reporta utilidad por segmento:** camino SN (drivers de crecimiento por categoría
  + un margen consolidado).
- **Qué decide el analista:** drivers, pasos, ejes por defecto, múltiplos de salida.
- **No copiar de AMZN:** los inputs "starts at/step" que dejan de funcionar tras un reset; que el
  EBITDA de Sensitivity (suma de segmentos) no cuadre con el de Target Multiple (consolidado) sin
  decirlo — si difieren, el pie lo explica; X e Y con el mismo driver (bloquearlo).

---

## §15 Management — 4 sub-tabs

**Responde:** *¿quién la dirige y qué ha hecho?*

**Referencia AMZN:** `AMZN_MGMT = makeManagement({...})` (`amzn.js` 4923), `amznOwnBody` 4987,
`amznGovBody` 5002, `amznTrackBody` 5015; motor `js/overviews/management.js`. **Tipo:** motor
(Executives & Board) + datos (los otros tres). Ninguna gráfica.

### MG-TEAM Executives & Board (`team`, activa por defecto)

- **Contenido:** lede (`lede`, HTML **sin** `<p>` alrededor, ~2–3 oraciones: tamaño del equipo, rasgo
  distintivo) · rejilla de tarjetas de ejecutivos (foto o iniciales · nombre · cargo · desde · una línea
  · "Full bio ›"; el CEO con `lead:true`, ancho completo) · modal con la bio completa · franja "Board
  of Directors — <boardNote>" (nombre · Independent/Insider · rol; presidente con franja; quien también
  es ejecutivo atenuado "also management") · rejilla "Governance & compensation" (3 celdas) · pie.
- **Datos:** `execs[{id, name, title, since?, line, bio?, lead?, img?}]` (`bio` es **texto plano** —
  el HTML se ve literal) · `board[{name, independent, role, chair?, dual?}]` · `boardNote` · `gov[{k, v,
  d?}]` · `foot` · `brand: SUMMIT_CAT[0]` (token Summit, no color de la empresa).
- **Fuentes:** página oficial de liderazgo (ejecutivos), proxy DEF 14A (consejo, comités). Fotos
  `img/leadership/<ticker>-<nombre>.jpg` si existen.
- **Qué decide el analista:** qué ejecutivos (AMZN: los 27 del S-team + fundador; para otra empresa,
  el equipo que la empresa publica) y si el consejo va completo o un subconjunto (si es subconjunto,
  decirlo correctamente).
- **No copiar de AMZN:** "full roster in Pillars ▸ Management" (falso: Pillars muestra tenedores, no
  el consejo); el modal de bio que no se cierra al cambiar de sub-tab (pedir el arreglo en
  `management.js` o anotarlo como excepción).

### MG-OWN Ownership (`ownership`)

- **Contenido:** lede (~1–2 oraciones, la idea central: "One share, one vote…") · KPIs (4: mayor
  tenedor %, clases de acciones, SBC del año, recompras/dividendo) · "Who owns <Empresa>" (2 cajas:
  fundador/insiders, institucionales) · "Capital returned to shareholders" (nota) · "Executives &
  insider activity — live from Fiscal.ai" + el hueco `<div id="dd-mgmt-slot">` (se llena solo) · pie.
- **Fuentes:** proxy (beneficial ownership), 10-K (SBC, recompras), Fiscal.ai (tabla en vivo). **Cada
  cifra con su documento y fecha en el pie** (AMZN solo dice "approximate" — no copiar).
- **Si la empresa no está en el plan de Fiscal.ai:** el hueco dice "not available on the current
  Fiscal.ai plan" — correcto, se deja.
- **Conocido:** la primera sincronización de una empresa nueva puede quedarse en "Pulling management
  data…" hasta recargar (defecto de `companies.js`) — revisarlo en §16 y anotarlo.

### MG-GOV Governance & SBC (`governance`)

- **Contenido:** lede (~1–2 oraciones) · KPIs (4: estructura de voto, independencia del consejo,
  SBC $ y % de ingreso, recompras/dividendo) · `.ov-sec-h` (AMZN no lo tiene) + 4 cajas (clase de
  acciones, independencia, comités, SBC vs recompras) · nota que apunta a Bottom Line ▸ General ▸ SBC
  para la gráfica (**aquí no se re-grafica**) · pie.
- **Regla:** no repetir KPIs de Ownership. Si una cifra aparece en ambos, va en uno solo.
- **Estilo:** las cajas (`ewBoxes`) dependen de CSS que AMZN inyecta en otra pestaña; en una empresa
  nueva usar `.sg-cards` o pedir que el estilo pase a la hoja de estilos.

### MG-TRACK Track Record (`track`)

- **Contenido:** lede (~1–2 oraciones: "rated on what they have actually built") · leyenda de
  calificaciones · rejilla de 2 columnas con tarjeta por líder: nombre + calificación · "rol · at
  <Empresa> since <año de ingreso>" · "**At <Empresa>:** qué construyó" · "**Context:** trayectoria" ·
  "Full track record ›" → modal con el detalle y "Net read" · recuadro "The bench, in one line" · pie.
- **Escala:** `green` "Value creator" · `amber` "Mixed / unproven" (y un `red` si el analista lo
  quiere). Colores con los tokens semánticos (`SUMMIT_POS`…), no hex sueltos.
- **Regla:** `since` = **año de ingreso a la empresa** (AMZN mezcla ingreso y año en el cargo — no
  copiar). El campo que el código lee se llama como la empresa (`m.amzn`): renombrarlo junto con su
  etiqueta.
- **Qué decide el analista (todo):** qué líderes, la calificación de cada uno, el "Net read" y la frase
  del recuadro. **Claude propone, el analista califica.** El pie lo dice: "Ratings are an editorial
  read, not a Summit output."

---

## §16 Cierre — auditoría final y entrega (`F-FINAL`)

1. **Recorrido completo en el harness** (con el truco de rAF de §7.3): cada sección y sub-tab, cada
   control clicado al menos una vez. Reportar:
   - ids duplicados y manejadores que resuelven por `document` (el motor de Results se monta hasta 3
     veces por perfil: Setup · Results · Estimates);
   - gráficas sin tabla; colores con `NaN`; paneles sin pie; paneles casi vacíos (< 400 caracteres);
   - `<style>` en línea nuevos (meta: ninguno nuevo; los que traiga el código copiado se listan).
2. **Portal real** (localhost con sesión): cabecera, precio en vivo, botones IR/EDGAR, tabla de
   Fiscal.ai, Notes guardando en Supabase. Consola sin errores.
3. **Lista de §17.4 por cada gráfica**, PASS/FAIL.
4. **Modo B:** conciliación del mapa de reubicación (§4.2 B3).
5. **Bitácora:** todas las unidades en ✅ / ⏭️ / ⛔ con razón; excepciones listadas; resumen final.
6. **Compuerta final:** el analista aprueba el perfil completo. Entonces, **si lo pide**: commit + push
   de la rama; y **solo si lo pide**, `gh pr create` con el resumen de la bitácora (qué cambió
   visualmente, excepciones, bloqueos). Nunca merge.

---

# PARTE III — REGLAS TRANSVERSALES

## §17 Gráficas

### 17.1 Antes de escribir una gráfica

1. ¿Es una métrica en el tiempo contra expectativas? → **motor de Results** (dataset, no canvas).
2. ¿Es la sección Top Line? → **motor de segmentos**.
3. ¿Ya existe en AMZN (o en SN/DHR, que la extrajeron)? → **copiar ese código** y cambiar los datos;
   "igual que Amazon" significa extraer el código de Amazon, no reimplementarlo.
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
- **Por defecto:** colapsadas, salvo que la tabla sea el contenido principal (Peers, Target Multiple,
  PEG) — esas abiertas. Las de los motores (Results, Top Line, Estimates) arrancan colapsadas.
- Vacío = "—" (`.rs-ft-nil`), nunca 0; "immaterial" solo si la fuente lo dice.
- Encabezado del colapsable siempre dice qué hay dentro ("Period detail · show · AWS, 14 periods").

## §19 Texto: dónde sí hay descripciones y dónde no

| Lugar | ¿Descripción? | Forma y largo |
|---|---|---|
| Overview ▸ Key Facts | No | solo valores |
| Overview ▸ Descripción | **Sí** | 2–4 oraciones, ~50–80 palabras |
| Overview ▸ Cuadrante | Sí, mínima | ≤ 30 palabras por celda |
| Overview ▸ colapsables (4–7) | No hay párrafo de introducción | una leyenda de una línea |
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
- Un dato sembrado a mano dice "seeded" y su fecha.
- Moneda distinta de USD: se dice en el pie; en Valuation los múltiplos solo si la base es comparable.
- Tilde de redondeo (`~`) solo cuando la fuente redondea; no para disfrazar un cálculo propio.

## §21 Color

- **El perfil no elige colores.** No se define `--brand` en la raíz del perfil; el color de la empresa
  aparece **solo en su logo**.
- **Series:** `SUMMIT_CAT` de `js/viz-palette.js`, en orden fijo, sin ciclar; el color sigue a la
  entidad (ocultar una serie no repinta las demás); más de 8 → "Other".
- **Fuentes de dato:** Actual = navy · Summit = azul · Consensus = gris — siempre las mismas.
- **Años fiscales y snapshots:** rampa de un solo tono (ordinal), no categórica.
- **Estado:** `SUMMIT_POS` / `SUMMIT_NEG` / `SUMMIT_MUTE` / `SUMMIT_INK` — nunca como "serie 4".
- Los slots 3–5 tienen poco contraste: la gráfica que los use necesita etiquetas o tabla (todas la
  tienen por §17.2).
- Dispersiones y mapas: máximo 3 slots (`SUMMIT_CAT3`).
- **Nada de hex sueltos** en código nuevo. Los restos naranjas de Amazon (`#FF9900`, `#FFB84D`,
  `#C7761A`, `rgba(255,153,0,…)`) no se copian.

## §22 Pie de fuentes

Cada panel (cada sub-tab, y cada colapsable con contenido propio) termina con un `.ov-foot`:

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
  se cierra con ×, clic fuera, Esc **y al cambiar de pestaña o sub-tab**.
- Disparador: `.ov-clickable[data-detail="<tipo>:<id>"]` + `resolve()` en `wireModal`.
- Colapsables: `.ov-collap` en el Overview; `.rs-collap` en el Deep Dive. Una gráfica dentro de un
  colapsable se construye **al abrirlo** (Chart.js no dibuja oculto).
- ⚠ En AMZN un manejador global de `.rs-collap-h` choca con los manejadores propios de algunos
  paneles (clic que abre y cierra a la vez). En código nuevo, usar la marca `data-selfwired` de DHR
  (`dhr.js` ~873) para excluir los colapsables que se manejan solos.
- Pestañas: el cambio se acota al panel (`:scope >`); el estado (sub-tab activa) se conserva al volver.
- Sin `<style>` en línea nuevo; si falta un estilo, va a una hoja de estilos y se dice en el PR.
- `esc()` de `amzn.js` **no** escapa `&`; el `mEsc` de `management.js` sí. Saber qué función recibe
  cada texto para no ver `&amp;` en pantalla.

## §24 La herramienta de Notes — reglas de uso

**Qué es.** El registro vivo de los **hilos** que el equipo sigue llamada a llamada: tendencias
confirmadas, promesas de management por reconciliar y cosas a vigilar. Vive en Evolution ▸ Earnings ▸
Notes y también alimenta Top Line ▸ Segments ▸ "What management has said".

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
- No duplicar: si ya existe la misma nota en ese sub-tema y trimestre, no se agrega (el portal avisa,
  salvo en el editor en línea — revisar a mano ahí).
- Borrar una nota es **inmediato y sin confirmación**: hacerlo solo si está mal.

**Limitaciones conocidas (hasta que se arreglen):**
- Un **tema nuevo** creado desde el portal no queda guardado en el orden de temas y puede no verse
  tras recargar. **Regla:** los temas (nivel superior) se definen en la semilla durante la unidad
  `EV-NOTES`; en el portal solo se crean sub-temas y notas.
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

Encontrados en la auditoría del 13 oct 2026. Al copiar código de AMZN, **corregir en la copia**; el
arreglo en AMZN mismo va en su propio PR, no en el de la empresa nueva.

| # | Dónde (AMZN) | Defecto | En la copia |
|---|---|---|---|
| A1 | Overview `stdOverviewBody` 552–585 | `<style>` en línea que pisa la hoja de estilos (acento hex, `.ov-foot` a 10px) | usar las clases de `css/overview.css` |
| A2 | Overview Key Facts 506 | market cap sin fecha; si falla dice "live" | semilla fechada como respaldo |
| A3 | Overview peers 288 | AMZN con P/E trailing = forward (27.8) | verificar siembra |
| A4 | Overview/Peers 327, 337, 393 | naranjas de Amazon | tokens Summit |
| A5 | Bottom Line `aStd*` 3110 / 2987 | arrastre vertical truena (`onY=null`) | pasar el callback de Y |
| A6 | Bottom Line margins 3615 | consenso repite el último real | consenso desde el primer estimado |
| A7 | Bottom Line margins | "Net income — Summit" = earnings ajustado | etiquetar la base real |
| A8 | Bottom Line segfc 4270 | trimestral + EBITDA dibuja anual | rama trimestral propia |
| A9 | Bottom Line SBC 3499 | leyenda no clicable; eje de acciones fijo | leyenda clicable; rango del dato |
| A10 | Bottom Line `.acx-tog` 4580 | estilo de pastillas inyectado desde Misc ▸ Capex | traer el estilo (como `dhr-chartkit.js`) |
| A11 | Bottom Line General/Segments | sin pie a nivel de panel | pie obligatorio |
| A12 | Bottom Line | años fijos en el código (`'FY23'…`, `i<3`) | derivar del dato |
| A13 | Top Line | colores se re-asignan al ocultar una serie | color por entidad |
| A14 | Top Line / varios `.rs-collap-h` 5892 | doble manejador: el clic abre y cierra | `data-selfwired` |
| A15 | Top Line KPIs | paráfrasis con chip FILING | FILING solo verbatim |
| A16 | Results anual | sin utilidad operativa por segmento | agregarla en `y` |
| A17 | Earnings Setup | "(Summit pending)", Summit de snapshot viejo, "AMZN" fijo | textos y datos de la empresa |
| A18 | Earnings `ceGuessTarget` 2542 | regex de Amazon | reescribir |
| A19 | Notes | tema nuevo no persiste; editor en línea sin chequeo de duplicados | temas en semilla; §24 |
| A20 | Historic Multiple | P/E forward vacío (EPS anual armado de trimestres); `get-market-history` sin desplegar | camino SN (BBG congelado) |
| A21 | Historic Multiple 363 | 0× inventado si falta deuda/acciones | guarda de SN |
| A22 | Target Multiple | modo por defecto con múltiplos inventados (`MOCK_*`) | Live por defecto |
| A23 | Target Multiple 797 | pie afirma deuda "from the live quote" aunque falle | rastrear la fuente |
| A24 | Sensitivity | consenso inventado (`CONS` placeholder) | BBG por segmento o no mostrar |
| A25 | Sensitivity 568 | inputs de rango dejan de funcionar tras un reset | re-enlazar tras reset |
| A26 | Sensitivity vs Target Multiple | EBITDA distinto (segmentos vs consolidado) sin decirlo | conciliar o explicar en el pie |
| A27 | Management `management.js` | modal no se cierra al cambiar de sub-tab; escuchas que se acumulan | arreglar en el motor (PR aparte) o excepción |
| A28 | Management Track Record | `since` mezcla ingreso y cargo; campo `amzn` | año de ingreso; renombrar |
| A29 | Management `ewBoxes` | estilo solo existe en otra pestaña | `.sg-cards` o hoja de estilos |
| A30 | Management boardNote | "full roster in Pillars" (falso) | texto correcto |
| A31 | Ownership | cifras "approximate" sin documento | fuente y fecha |
| A32 | Peers | sin `.ov-foot` | pie |
| A33 | `companies.js` 228/306 | primera sincronización de Fiscal.ai se queda "Pulling…" | revisar en §16; arreglo en PR aparte |

## Anexo B — Matriz de fuentes por pieza

| Pieza | Fuente primaria | Archivo en el repo |
|---|---|---|
| Key Facts | EDGAR, 10-K portada/Item 1/Item 5, IR, proxy; market cap en vivo (Massive) | módulo `<ticker>.js` |
| Descripción, cuadrante, productos, timeline | 10-K Item 1, IR, comunicados | módulo |
| How it makes money | 10-K nota de segmentos + desagregación de ingresos + geografía | módulo |
| Peers (Overview y Valuation) | múltiplos sembrados (fuente y fecha en el pie); market cap Massive | módulo (`A_PEERS`) |
| Results / Estimates | 8-K/10-Q (actuals); Summit DCF MCP (summit, evolution); BBG_CONSENSUS (cons, estMatrix); 8-K (guía) | `results-data/<t>.js` |
| Top Line | 10-K (verbatim), llamadas (named, management), BBG kpi, Summit, SPLC | `segments-data/<t>.js` |
| Earnings Setup / Post-Results | BBG_CONSENSUS (`CE_CONS`), Summit snapshot, 8-K, transcripciones | módulo + `docs/calls/<T>*.md` |
| Notes | llamadas (en el portal) | Supabase `company_theme_record` (+ semilla `themes-data/<t>.js`) |
| Bottom Line | BBG export generado; Summit DCF (gastos funcionales); 10-K MD&A y notas; SPLC | `<t>-bbg.js` + módulo |
| Historic Multiple | BBG múltiplos diarios congelados (BQL) | `<t>-bbg-multiples.js` |
| Target Multiple / Sensitivity | Summit DCF snapshots (MCP); BBG por segmento | módulos `<t>-target-multiple.js`, `<t>-sensitivity.js` |
| Management | página de liderazgo, DEF 14A, 10-K (SBC), Fiscal.ai (en vivo) | módulo + `img/leadership/` |

Regla de oro de datos: **se saca una vez, se congela en el repo y se cita el documento primario**;
ningún panel llama a un conector (MCP) en tiempo de ejecución.

## Anexo C — Unidades y dependencias

| ID | Unidad | Depende de |
|---|---|---|
| F0 | Inventario de datos | — |
| F1 | Esqueleto + vista previa | F0 |
| B1 / B2 | (modo B) Inventario de contenido existente · mapa de reubicación | F0 |
| OV-1 … OV-7, OV-F | Overview: Key Facts · Descripción · Cuadrante · Makes money · Products · Peers · Timeline · Pie | F1 (OV-6 comparte `A_PEERS` con VA-PEERS) |
| EV-RES-DATA | Dataset de Results (números) | F0 |
| EV-RES | Pestaña Results | EV-RES-DATA |
| TL-GEN · TL-SEG · TL-OTH · TL-CUS | Top Line | EV-RES-DATA |
| EV-EST | Estimates | EV-RES-DATA + Summit ≥ 2 snapshots |
| EV-SET | Earnings ▸ Setup | EV-RES-DATA + `CE_CONS` |
| EV-POST | Earnings ▸ Post-Results | EV-SET + transcripción |
| EV-NOTES | Earnings ▸ Notes (semilla) | EV-POST (para los temas) |
| BL-GEN-1 … BL-GEN-5 | Bottom Line ▸ General (4 vistas + Expense lines) | export BBG |
| BL-SEG | Bottom Line ▸ Segments | export BBG |
| BL-SPLC | Bottom Line ▸ Supply Chain | export SPLC |
| VA-HIST | Historic Multiple | múltiplos BBG (o EV-RES-DATA con estMatrix + función desplegada) |
| VA-PEERS | Peers | OV-6 |
| VA-TM | Target Multiple / PEG | Summit snapshots |
| VA-SENS | Sensitivity | Summit snapshot por segmento + BBG por segmento |
| MG-TEAM · MG-OWN · MG-GOV · MG-TRACK | Management | F1 |
| F-FINAL | Cierre | todas |

## Anexo D — Guiones de pregunta para cada compuerta

**Formato del mensaje que acompaña la pregunta (③ + ④):**

```
<ID> <Nombre> — listo para revisar
Dónde verlo: http://localhost:8000/harness-<t>.html → Deep Dive → Top Line → Segments
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
| F0 | "Este es el inventario. Con esto se pueden hacer X de 36 unidades; quedan fuera A, B porque … ¿Confirmas el alcance?" |
| OV-1 | "No encontré <dato> para la celda <n>. ¿La sustituyo por <propuesta>?" |
| OV-3 | "Propongo esta frase para 'The edge': … ¿Te sirve?" |
| OV-6 / VA-PEERS | "Propongo estos peers: … (y descarto … porque no cotiza). ¿Agregas o quitas alguno?" |
| EV-RES-DATA | "¿Base GAAP o ajustada para EPS/EBITDA?" · "¿Agrego estas métricas además de las mínimas?" |
| TL-SEG | "La empresa publica estos KPIs: … ¿Cuáles entran?" · "Estas identidades de ingreso tienen datos: … ¿Las incluimos?" |
| EV-NOTES | "Propongo estos temas y sub-temas para seguir: … ¿Cuáles siembro y con qué estado?" |
| BL-GEN-5 | "Las líneas de gasto del MD&A son: … ¿Hago una pestaña por cada una?" |
| VA-TM | "¿Qué múltiplos objetivo usamos (EV/EBITDA y P/E) y para qué año?" |
| VA-SENS | "¿Qué drivers en los ejes por defecto, y qué múltiplo de salida?" |
| MG-TEAM | "¿Equipo completo que publica la empresa, o solo el C-suite?" |
| MG-TRACK | "Propongo estas calificaciones: … ¿Las ajustas?" |
| F-FINAL | "Todo aprobado salvo … ¿Hago commit y push? (El PR solo cuando tú lo pidas.)" |
