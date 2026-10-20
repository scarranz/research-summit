# META — bitácora de construcción del perfil

> Reglas: `docs/PROFILE_PLAYBOOK.md` §3.
> Claude la lee completa al empezar cada sesión y la actualiza en cada aprobación (no al final).
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)

| Campo | Valor |
|---|---|
| Empresa | Meta Platforms, Inc. (NASDAQ: META) |
| Modo | **B — reordenar existente** (`js/overviews/meta.js`, 3,493 líneas, + `results-data/meta.js`, `meta-setup.js`) |
| Rama | `feat/meta-profile` (en el mismo PR que los cambios de la guía del review de TSM, decisión SAB 2026-10-20) |
| Analista responsable | SAB |
| Inicio | 2026-10-20 |
| Avance | 0 de 39 unidades aprobadas · 0 omitidas · 0 bloqueadas (M = filas del tablero − ⏭️ de alcance; Anexo C) |

## 1. Inventario de datos (F0)

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | ✔ | perfil existente en el portal | el perfil abre | — |
| Filing anual (10-K / 20-F) | ✔ | **10-K** FY2025, acc. 0001628280-26-003942 (2026-01-29) · último 10-Q 2Q26, acc. 0001628280-26-050705 (2026-07-30) · 8-K del 2Q26 0001628280-26-050596 (2026-07-29) · DEF 14A 2026-04-16 · CIK 0001326801 | Overview, Top Line, textos verbatim | — |
| Año fiscal / moneda | ✔ | cierra 31 dic (calendario) · USD | todo sin ajustes | — |
| Summit DCF | ✔ ⚠ | 5 snapshots: 2025-12-15 · 2025-12-18 (372 datos, parcial) · 2026-02-03 · 2026-05-05 · **2026-08-04** (último real 2Q26) · 35 etiquetas · **el snapshot 2026-05-22 que cita el código actual ya no existe en el MCP** · ⚠ 2027Q1 proyectado = 643.2 (roto, debería ser ~$70B) | el mapa F0-SM; Summit congelado en Results/Top Line/Bottom Line/Setup, Estimates (5 snapshots), Sensitivity | — |
| Consenso BBG (`BBG_CONSENSUS.txt` + `Consensus_Portal.xlsm`) | ✔ | 30 snapshots META, 4/29/2019 → **9/8/2026** (archivo del 2026-10-15) · ruta en esta máquina `G:\My Drive\Summit\Docs\0` | `estMatrix.cons`, Setup, export de Bottom Line | — |
| `get-market-history` (Massive) | ✔ | desplegada (precios funcionan; la ruta de ratios falla para todos los tickers — visto en TSM) | Historic Multiple en vivo | — |
| Valuación del modelo en el MCP (`get_valuation_history`) | ✘ | `no_valuations_for_ticker` en los 5 snapshots (Oscar, 14 oct: META sin valuación) | — | **VA-TM sin múltiplo ni precio objetivo del modelo** |
| SPLC (clientes / proveedores) | ✔ | export META US Equity as-of 2026-06-26 (ya en `meta.js` `SC_SUPPLIERS`) | TL-CUS tabla, BL-SPLC | — |
| Transcripciones | ◐ | `docs/calls/META.md` Q4 2023 → Q4 2025 + `META-latest.md` 1Q26–2Q26 (**2Q26 reconstruido de prensa; el verbatim de IR sigue pendiente**) · Quartr desconectado en esta sesión (hay que volver a iniciar sesión con /mcp) | EV-POST, EV-NOTES, citas | citas verbatim de 2Q26 |
| Fiscal.ai (plan) | ✘ (por confirmar en el portal) | META no está en la lista del plan gratis (AMZN, MA, NVDA, UBER, V) | tabla en vivo de Management | la tabla de Fiscal.ai muestra "not available" |
| Massive (`liveQuote`) | ✔ (por confirmar en F1) | | market cap, peers | — |
| Fotos / imágenes | ✘ | no hay `img/leadership/meta-*` | Management con iniciales | fotos de ejecutivos |

**Próximo print:** 3Q26 — fecha por confirmar (Meta suele reportar la última semana de octubre). Cae en
medio de la construcción: la rutina de cada print (§12) entra cuando llegue.

**Escalera de capacidades:** Results (actual + consenso BBG + guía + Summit congelado) ✔ · Top Line ✔ ·
Estimates ✔ (5 snapshots) · Earnings ✔ (ya existe) · Bottom Line ✔ (export BBG) · Historic Multiple ✔ en vivo ·
Peers ✔ · **Target Multiple: sin múltiplo del modelo** (⛔ hasta que Oscar cargue la valuación de META al MCP) ·
Sensitivity ✔ (el snapshot congelado; sin precio objetivo del modelo) · Management ✔ (sin Fiscal.ai ni fotos) ·
Misc ✔ (Spend Engine, Ad ecosystem, etc. ya existen).

**Alcance acordado (2026-10-20, SAB):** se construye todo; **VA-TM queda ⛔** hasta que el MCP tenga la
valuación de META. Sin Quartr (SAB no puede volver a iniciar sesión): transcripciones de `docs/calls/` y de
la página de IR de Meta.

## 1b. Mapa Summit (F0-SM)

> Reglas: `docs/PROFILE_PLAYBOOK.md` §6.3. Una fila por **cada** etiqueta de `list_metrics`, incluidas las `ignore`.
> Archivo que lee el portal: `js/summit-map/<ticker>.js` (sin números).

Modelo: `G:\My Drive\Summit\Docs\Research\DCF\Technology - SAB\META\DCF META.xlsm` · USD · millones ·
5 snapshots (2025-12-15 → 2026-08-04; el 2025-12-18 trae solo 372 datos) · **35 etiquetas: 12 core · 6 segment ·
11 kpi · 2 guidance · 4 consensus · 0 ignore** · **valuación: ninguna en el
MCP** (el workbook sí la tiene: Output ▸ VALUATION, ver §6) · 6 dudas.

Fuentes dentro del modelo: **DEFAULT** = totales de la empresa (reales = 10-K GAAP; proyecciones **solo anuales**,
salvo `REV` que trae trimestres hasta 4Q26) · **SEGM** = Family of Apps / Reality Labs, publicidad vs otros, guía y
KPIs · **BBG** = consenso de Bloomberg guardado en el modelo (anual).

Cuadre vs 10-K FY2025 (acc. 0001628280-26-003942, XBRL de EDGAR): ✔ = al dólar.

| Etiqueta MCP | Rol | Clave portal | Qué es, en una línea | Base | Unidad real | Agregación | Periodos | Cuadre vs filing | Confianza |
|---|---|---|---|---|---|---|---|---|---|
| `REV` | core | `rev` | Ingreso total | GAAP | USD M | suma | A 2018–; Q 1Q22–4Q26 (proy.) | FY25 200,966 = 10-K ✔ | ❓ 2027 trimestral roto (1Q27 = 643.2) |
| `OP_INCOME` | core | `opinc` | Utilidad operativa | GAAP | USD M | suma | A (proy. solo anual) | FY25 83,276 = 10-K ✔ | ✔ |
| `EBITDA` | core | `ebitda` | EBITDA "comparable" de Bloomberg | **ajustada** | USD M | suma | A | FY25 126,140 ≠ OI + D&A (101,892); la diferencia ≈ SBC (20,427) + extraordinarios | ⚠ etiquetar "EBITDA (adj.)" |
| `EARNINGS` | core | `earnings` | Utilidad neta | **mixta**: real GAAP, proyección normalizada | USD M | suma | A | real FY25 60,458 = 10-K ✔; proyección FY25 73,881 excluye el cargo único de impuestos (OBBBA) | ⚠ "Model earnings (adj.)" en proyección |
| `SHARES` | core | `shares` | Acciones diluidas | diluidas | acciones M | fin de periodo | A | FY25 2,574 = 10-K ✔ | ⚠ proyección plana en 2,574 |
| `DNA` | core | `dna` | Depreciación y amortización | GAAP | USD M | suma | A | FY25 18,616 = 10-K ✔ | ✔ |
| `CFO` | core | `cfo` | Flujo de operación | GAAP | USD M | suma | A | FY25 115,800 = 10-K ✔ | ✔ |
| `CAPEX` | core | `capex` | Compras de propiedad y equipo (**signo negativo**) | GAAP | USD M | suma | A | FY25 −69,691 = 10-K ✔ | ✔ |
| `FCF` | core | `fcf` | CFO − capex | modelo | USD M | suma | A | FY25 46,109 = 115,800 − 69,691 ✔ | ✔ |
| `INT_INC` | core | `int_inc` | Ingreso por intereses | GAAP | USD M | suma | A | FY25 2,123 = 10-K ✔ | ✔ |
| `INT_EXP` | core | `int_exp` | Gasto por intereses | GAAP | USD M | suma | A | FY25 1,165 = 10-K ✔ | ✔ |
| `TAX_RATE` | core | `tax_rate` | Tasa efectiva | efectiva | % (decimal) | promedio | A | FY25 0.296 = 10-K ✔ | ✔ |
| `FoA_Revenue` | segment | `seg.foa.rev` | Ingreso de Family of Apps | GAAP (nota de segmentos) | USD M | suma | A y Q | FY25 198,758 = 10-K ✔ | ✔ |
| `ADV_REVENUE` | segment | `seg.foa.ads.rev` | Ingreso de publicidad | GAAP | USD M | suma | A y Q | FY25 196,174 = 10-K ✔ | ✔ |
| `OTH_REVENUE` | segment | `seg.foa.other.rev` | Otros ingresos de FoA (WhatsApp Business, Meta Verified…) | GAAP | USD M | suma | A y Q | FY25 2,584 = 10-K ✔ | ✔ |
| `FA_OP_INCOME` | segment | `seg.foa.opinc` | Utilidad operativa de FoA | GAAP | USD M | suma | A; Q | FY25 102,469 = 10-K ✔ | ❓ proyección se corta: anual solo 2026, trimestral hasta 4Q25 |
| `RL_REVENUE` | segment | `seg.rl.rev` | Ingreso de Reality Labs | GAAP | USD M | suma | A y Q | FY25 2,207 = 10-K ✔ | ✔ |
| `RL_OP_INCOME` | segment | `seg.rl.opinc` | Utilidad operativa de Reality Labs | GAAP | USD M | suma | A; Q | FY25 −19,193 = 10-K ✔ | ❓ igual que FA_OP_INCOME |
| `DAP` | kpi | `kpi.dap` | Personas activas diarias en la familia de apps | — | personas M | fin de periodo | Q | 4Q25 3,580 (snapshot 2026-02-03) = 8-K ✔ | ❓ vacío en 2026-08-04 |
| `DAP_GROWTH` | kpi | `kpi.dap_growth` | Crecimiento de DAP | — | % | — | Q | — | ❓ vacío en 2026-08-04 |
| `AVG_ARPU` | kpi | `kpi.arpp` | Ingreso promedio por persona | — | USD | suma | Q | 4Q25 16.6 (snapshot 2026-02-03) | ❓ vacío en 2026-08-04 |
| `FOA_REV_DAP` | kpi | `kpi.foa_rev_dap` | Ingreso de FoA por persona | — | USD | — | Q | — | ❓ vacío |
| `CORE_REV_DAP` | kpi | `kpi.core_rev_dap` | Ingreso "core" de FoA por persona | — | USD | — | Q | — | ❓ vacío; definición de "core" |
| `WA_REV_DAP` | kpi | `kpi.wa_rev_dap` | Ingreso de WhatsApp por persona | modelo | USD | — | Q | — | ❓ vacío; Meta no lo publica |
| `CORE_ARPU_GROWTH` | kpi | `kpi.core_arpu_g` | Crecimiento del ARPU core | — | % | — | Q | — | ❓ vacío |
| `TOTAL_ADV_REV_GROWTH` | kpi | `kpi.ad_rev_g` | Crecimiento del ingreso de publicidad | — | % | — | Q | — | ❓ vacío |
| `PER_EMPLOYEE_REV` | kpi | `kpi.emp_rev` | Ingreso por empleado | modelo | USD | — | Q | — | ❓ vacío |
| `PER_EMPLOYEE_OPEX` | kpi | `kpi.emp_opex` | Gasto operativo por empleado | modelo | USD | — | Q | — | ❓ vacío |
| `PER_EMPLOYEE_OPINC` | kpi | `kpi.emp_opinc` | Utilidad operativa por empleado | modelo | USD | — | Q | — | ❓ vacío |
| `REVENUE_GUIDANCE_LOW` | guidance | `guide.rev.lo` | Guía de ingreso del trimestre (bajo) | — | USD M | — | Q | 2Q26 58,000 = 8-K 1Q26 ✔ | ✔ (3Q26 no capturada aún) |
| `REVENUE_GUIDANCE_HIGH` | guidance | `guide.rev.hi` | Guía de ingreso del trimestre (alto) | — | USD M | — | Q | 2Q26 61,000 = 8-K ✔ | ✔ |
| `REV_BBG_EST` | consensus | `cons.rev` | Consenso BBG de ingreso | — | USD M | suma | A | — | ✔ (el portal usa `BBG_CONSENSUS.txt`, §9.1) |
| `EBITDA_BBG_EST` | consensus | `cons.ebitda` | Consenso BBG de EBITDA | ajustada | USD M | suma | A | — | ✔ |
| `EARNINGS_BBG_EST` | consensus | `cons.earnings` | Consenso BBG de utilidad | ajustada | USD M | suma | A | — | ✔ |
| `SHARES_BBG_EST` | consensus | `cons.shares` | Consenso BBG de acciones | — | acciones M (el MCP dice USD) | fin de periodo | A | — | ✔ |

### Dudas

```
❓ META · REV 2027 trimestral — 1Q27 = 643.2 y 4Q27 = 1,528 en el snapshot 2026-08-04 (escala de Reality Labs, no de Meta)
   Lo que se ve: 2026 trimestral bien (3Q26 64,658 · 4Q26 74,408); el anual 2027 (326,206) está bien.
   Quién responde: autor del modelo (SAB) — fila REV de Projection History, columnas Q1–Q4 2027.
   Mientras tanto: 2027 trimestral de Summit va en null (regla de §9.1: no se reparte el anual).
   Respuesta (AAAA-MM-DD): …

❓ META · FA_OP_INCOME / RL_OP_INCOME — la proyección se corta (anual solo 2026; 2027+ = 0; trimestral hasta 4Q25)
   Quién responde: autor del modelo. Mientras tanto: sin Summit por segmento después de 2026 (Top Line ▸ Segments
   y Bottom Line ▸ Segments muestran solo real + consenso).

❓ META · KPIs (DAP, ARPP, revenue per person, per employee) — llenos en el snapshot 2026-02-03, en cero en 2026-08-04
   ¿Se rompió el bloque SEGM de KPIs después de febrero? ¿Unidades de *_GROWTH (decimal o %)? ¿qué es "core"?
   Quién responde: autor del modelo. Mientras tanto: los KPIs del portal salen del 8-K (Meta los publica), no de Summit.

❓ META · EARNINGS proyección — normalizada (sin el cargo único de impuestos de 2025)
   Confirmar con el autor que 2026+ es "net income ajustado". Mientras tanto: se etiqueta "Model earnings (adj.)".

❓ META · SHARES proyección plana en el último real
   ¿Es a propósito (sin recompras en el modelo)? Mientras tanto: EPS del modelo = earnings ÷ acciones planas, con nota.

❓ META · valuación — no está en el MCP (ver §6). Mientras tanto: VA-TM ⛔.
```

**Respuesta de SAB (2026-10-20) a las dudas 1–3:** "cambiamos la forma de proyección en el modelo por esos
meses, por lo que eso debe explicar por qué hay diferencias". → Los trimestres 2027, la proyección por segmento
y los KPIs vacíos vienen del cambio de método en el modelo, no de un error de lectura. Regla que se mantiene:
lo que el snapshot trae en cero o con escala equivocada **no se usa** (va en null, §9.1); los KPIs salen del 8-K.

### Cambios del mapa

<!-- Solo se agrega: snapshot nuevo → etiqueta nueva, desaparecida o con salto de escala/signo. -->
- AAAA-MM-DD · snapshot AAAA-MM-DD · <qué cambió> — <qué se hizo>

## 2. Tablero de unidades

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | ✅ | 2026-10-20 | SAB | | VA-TM ⛔ hasta valuación de META en el MCP |
| F0-SM | Mapa de métricas Summit | ✅ | 2026-10-20 | SAB | | dudas explicadas: cambio de forma de proyección en el modelo |
| B1 | (modo B) Inventario de lo que existe | ⬜ | | | | |
| B2 | (modo B) Mapa de reubicación | ⬜ | | | | |
| F1 | Esqueleto + vista previa | ⬜ | | | | |
| OV-1 | Overview ▸ Key Facts | ⬜ | | | | |
| OV-2 | Overview ▸ Descripción | ⬜ | | | | |
| OV-3 | Overview ▸ Cuadrante 2×2 | ⬜ | | | | |
| OV-4 | Overview ▸ How it makes money | ⬜ | | | | |
| OV-5 | Overview ▸ Products & platforms | ⬜ | | | | |
| OV-6 | Overview ▸ Competitors (peer map) | ⬜ | | | | |
| OV-7 | Overview ▸ Timeline | ⬜ | | | | |
| OV-F | Overview ▸ Pie de fuentes | ⬜ | | | | |
| EV-RES-DATA | Dataset de Results (números) | ⬜ | | | | |
| EV-RES | Evolution ▸ Results | ⬜ | | | | |
| TL-GEN | Top Line ▸ General | ⬜ | | | | |
| TL-SEG | Top Line ▸ Segments | ⬜ | | | | |
| TL-OTH | Top Line ▸ Other | ⬜ | | | | |
| TL-CUS | Top Line ▸ Customers | ⬜ | | | | |
| EV-EST | Evolution ▸ Estimates | ⬜ | | | | |
| EV-SET | Evolution ▸ Earnings ▸ Setup | ⬜ | | | | |
| EV-POST | Evolution ▸ Earnings ▸ Post-Results | ⬜ | | | | |
| EV-NOTES | Evolution ▸ Earnings ▸ Notes | ⬜ | | | | |
| BL-GEN-1 | Bottom Line ▸ General ▸ Profitability & margins | ⬜ | | | | |
| BL-GEN-2 | Bottom Line ▸ General ▸ The bridge | ⬜ | | | | |
| BL-GEN-3 | Bottom Line ▸ General ▸ Op. income → net income | ⬜ | | | | |
| BL-GEN-4 | Bottom Line ▸ General ▸ Stock-based compensation | ⬜ | | | | |
| BL-GEN-5 | Bottom Line ▸ General ▸ Expense lines | ⬜ | | | | |
| BL-SEG | Bottom Line ▸ Segments | ⬜ | | | | |
| BL-SPLC | Bottom Line ▸ Supply Chain | ⬜ | | | | |
| VA-HIST | Valuation ▸ Historic Multiple | ⬜ | | | | |
| VA-PEERS | Valuation ▸ Peers | ⬜ | | | | |
| VA-TM | Valuation ▸ Target Multiple / PEG | ⬜ | | | | |
| VA-SENS | Valuation ▸ Sensitivity Analysis | ⬜ | | | | |
| MG-TEAM | Management ▸ Executives & Board | ⬜ | | | | |
| MG-OWN | Management ▸ Ownership | ⬜ | | | | |
| MG-GOV | Management ▸ Governance & SBC | ⬜ | | | | |
| MG-TRACK | Management ▸ Track Record | ⬜ | | | | |
| MISC | Miscellaneous (una fila `MISC-<clave>` por sub-tab aprobada) | ⬜ | | | | |
| F-FINAL | Cierre y entrega | ⬜ | | | | |

(Modo B: agregar B1 — inventario de contenido existente y B2 — mapa de reubicación después de F0.)

> Desde el 15 oct 2026 EV-EST, VA-TM y VA-SENS se construyen con Summit congelado del MCP (regla 10);
> EV-EST necesita ≥ 2 snapshots. Cada `MISC-<clave>` aprobada reemplaza la fila MISC; en MISC siempre se
> proponen `MISC-comp` y, si aplica, `MISC-capacity` (playbook §15b).

## 3. Decisiones del analista

<!-- Solo se agrega. Si una decisión cambia, nueva línea que cita la anterior. -->
- AAAA-MM-DD · <ID> · <decisión> — <por qué> — <quién>

## 4. Excepciones aceptadas

<!-- Cada FAIL de la autoauditoría que el analista decidió dejar. -->
- AAAA-MM-DD · <ID> · <qué regla> — <por qué se acepta> — <quién>

## 5. Mapa de reubicación (solo modo B)

Conteo de control (piezas originales): **N**

| # | Pieza original (archivo:función) | Destino (sección ▸ sub-tab ▸ bloque) | Cómo | Estado |
|---|---|---|---|---|
| 1 | | | | ⬜ |

## 6. Bloqueos y preguntas abiertas

| Desde | Unidad | Qué falta | Quién lo consigue | Estado |
|---|---|---|---|---|
| 2026-10-20 | VA-TM | Valuación de META en el MCP. El workbook `DCF META.xlsm` sí la tiene (Output ▸ VALUATION: EV/EBITDA PT 808.91, P/E PT 795.98), pero el último submit (2026-08-04) es anterior a que el MCP la leyera. Arreglo: (1) Oscar carga hacia atrás la valuación de los 5 snapshots, como con AMZN; (2) SAB hace submit nuevo después del 3Q26 | Oscar · SAB | ⬜ |
| 2026-10-20 | EV-RES-DATA / F0-SM | Summit 2027Q1 proyectado = 643.2 en el snapshot 2026-08-04 (roto) — corregir en el workbook antes del próximo submit | SAB (autor del modelo) | ⬜ |
| 2026-10-20 | EV-POST 2Q26 | Transcripción verbatim de IR del 2Q26 (hoy reconstruida de prensa) | SAB / Dani | ⬜ |

## 6b. Conexiones pendientes ("Live data pending")

> `docs/PROFILE_PLAYBOOK.md` §20b. Bloques aprobados que hoy muestran el aviso porque falta el camino
> en vivo. No hay números copiados que migrar: al destrabarse, se conecta, se vuelve a mostrar y se cierra.

| Desde | Unidad ▸ bloque | Qué falta (función / dato) | Quién lo destraba | Estado |
|---|---|---|---|---|

## 6c. Review del analista — pendientes

> `docs/PROFILE_PLAYBOOK.md` §16 paso 7. Pedidos del analista después de entregado el perfil. Cada R pasa
> por la compuerta normal y se registra en §7 al aprobarse. Si el pedido vale para toda empresa, se
> propone también como cambio a la guía.

| # | Pedido (textual) | Unidad | Qué hay que construir | Depende de | ¿Va a la guía? | Estado |
|---|---|---|---|---|---|---|

## 7. Historial de aprobaciones

<!-- Solo se agrega, la más reciente al final. Una entrada por cada paso por la compuerta. -->

### 2026-10-20 · F0 Inventario de datos — APROBADA
- Qué se mostró: tabla de §1 (10-K FY2025, 10-Q 2Q26, Summit 5 snapshots hasta 2026-08-04, BBG 30 snapshots hasta 9/8/2026, sin valuación en el MCP, SPLC 2026-06-26, transcripciones hasta 2Q26, sin Fiscal.ai ni fotos).
- Hallazgos: el código actual cita un snapshot Summit 2026-05-22 que ya no existe; `results-data/meta.js` toma consenso de LSEG/Refinitiv (prohibido, §9.1) → EV-RES-DATA se rehace; 2027Q1 Summit roto.
- Pregunta de SAB: qué falta para la valuación → respuesta: el workbook la tiene; falta que el MCP la lea (backfill de Oscar o submit nuevo). Aprobó con eso.

### 2026-10-20 · F0-SM Mapa de métricas Summit — APROBADA
- Qué se mostró: 35 etiquetas (12 core · 6 segment · 11 kpi · 2 guidance · 4 consensus), cuadre de cada core y segment contra el XBRL del 10-K FY2025 (todo al dólar), 6 dudas; archivo `js/summit-map/meta.js` sin números.
- Fuentes: MCP Summit (`list_snapshots`, `list_metrics`, `get_fundamentals`, `get_valuation_history`); workbook `DCF META.xlsm` (hojas Actuals/Projection History); EDGAR XBRL companyfacts.
- Respuesta de SAB: las diferencias vienen de un cambio en la forma de proyectar del modelo en esos meses.
### AAAA-MM-DD · <ID> <Nombre> — <APROBADA | CAMBIOS | OMITIDA>
- Qué se mostró:
- Fuentes:
- Autoauditoría:
- Cambios pedidos / decisiones:
