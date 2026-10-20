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
| Avance | 12 de 41 unidades aprobadas (F0, F0-SM, B1, B2, OV-1…OV-7, OV-F) · 0 omitidas · 1 bloqueada (VA-TM) (M = filas del tablero − ⏭️ de alcance; Anexo C) |

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
| B1 | (modo B) Inventario de lo que existe | ✅ | 2026-10-20 | SAB | | 104 piezas (pieza 2 borrada con aprobación) |
| B2 | (modo B) Mapa de reubicación | ✅ | 2026-10-20 | SAB | | 7 fusiones aprobadas · Misc con 5 sub-tabs |
| F1 | Esqueleto + vista previa | ⬜ | | | | |
| OV-1 | Overview ▸ Key Facts | ✅ | 2026-10-20 | SAB | 10 celdas del 10-K FY2025 + market cap en vivo |
| OV-2 | Overview ▸ Descripción | ✅ | 2026-10-20 | SAB (aprobación previa) | | 61 palabras, del 10-K Item 1 |
| OV-3 | Overview ▸ Cuadrante 2×2 | ✅ | 2026-10-20 | SAB (aprobación previa) | | ≤ 30 palabras por celda; 3.58B DAP, sin cliente ≥ 10% |
| OV-4 | Overview ▸ How it makes money | ✅ | 2026-10-20 | SAB (aprobación previa) | | Segments + Geography (Note 2) + acordeones con "The numbers"; barras grises |
| OV-5 | Overview ▸ Products & platforms | ✅ | 2026-10-20 | SAB (aprobación previa) | | 7 familias con modal (10-K Item 1) |
| OV-6 | Overview ▸ Competitors (peer map) | ✅ | 2026-10-20 | SAB (aprobación previa) | | 8 peers, denominadores del 10-K; forward BBG solo META/GOOGL/AMZN; Trailing por defecto |
| OV-7 | Overview ▸ Timeline | ✅ | 2026-10-20 | SAB (aprobación previa) | | 7 hitos en orden, viñetas, sin precios de acción |
| OV-F | Overview ▸ Pie de fuentes | ✅ | 2026-10-20 | SAB (aprobación previa) | | un solo pie |
| EV-RES-DATA | Dataset de Results (números) | ✅ | 2026-10-20 | SAB | | consenso BBG (220 celdas, verify_preprint 0 cambios/0 borrados) en vez de LSEG; Summit recongelado del 2026-08-04; EBITDA en base reportada (OI + D&A) |
| EV-RES | Evolution ▸ Results | ✅ | 2026-10-20 | SAB | | mismo motor; ficha Consensus vuelve a aparecer |
| TL-GEN | Top Line ▸ General | ⬜ | | | | |
| TL-SEG | Top Line ▸ Segments | ⬜ | | | | |
| TL-OTH | Top Line ▸ Other | ⬜ | | | | |
| TL-CUS | Top Line ▸ Customers | ⬜ | | | | |
| EV-EST | Evolution ▸ Estimates | ✅ | 2026-10-20 | SAB | | 5 snapshots: Dec 15 · Feb 3 · May 5 · Aug 4 (sin el 05-22 que ya no existe) |
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
- 2026-10-20 · OV-2…OV-F · SAB aprobó OV-2 y pidió hacer el resto del Overview de un jalón, aprobándolo por adelantado ("ya te apruebo con todos"); **no cambiar la guía por esto** (excepción solo para META) — SAB
- 2026-10-20 · OV-6 · Peers = plataformas de anuncios cotizadas: GOOGL, AMZN, APP, RDDT, PINS, TTD, SNAP (TikTok privado; YouTube dentro de Alphabet). Vista por defecto Trailing (solo 3 tienen forward en BBG) — Claude, cubierto por la aprobación previa
- 2026-10-20 · B2 · Mapa aprobado con las 7 fusiones (#8+#37, #10+#80, #17, #90+#51, #102, #103, #104 FY_NOTE/AS_OF); Pillars vuelve a mostrarse (sin `absorbsPillars`, como AMZN); Misc = **Competitive position · Capex & Depreciation · Strategy · M&A · Capacity → revenue** (SAB pidió dejar Capacity → revenue aunque Claude proponía descartarla; donde la cadena no tenga fuente se dice dónde se corta, §15b) — SAB
- 2026-10-20 · B1 pieza 2 · Quitar por completo la tira de precio en vivo del Overview (precio, cambio, market cap, net debt) — el precio ya está en la cabecera — SAB. Regla llevada a la guía §8.
- 2026-10-20 · OV-4 (META, AMZN, TSM) · Barras de "How it makes money" en grises claros por tamaño, montos en negro; títulos del 2×2 en negro también en AMZN y TSM — SAB. Guía §8 OV-4.
- 2026-10-20 · todo el perfil · Títulos del 2×2 (What it sells, Who buys it…) en negro (--navy) y **un solo acento en todo el perfil: el azul Summit que subraya las pestañas del perfil (--steel)** — línea de Key Facts, subrayado de pestañas activas en todos los niveles. Meta entra a css/selectors.css. Aplicado a Meta y escrito en la guía (§8, §21, §21b) — SAB

## 4. Excepciones aceptadas

<!-- Cada FAIL de la autoauditoría que el analista decidió dejar. -->
- AAAA-MM-DD · <ID> · <qué regla> — <por qué se acepta> — <quién>

## 5. Mapa de reubicación (solo modo B)

Conteo de control (piezas originales): **104** — 101 visibles (B1, 2026-10-20: código leído completo +
recorrido del portal local, 26 sub-tabs, consola sin errores) + 2 paneles sin montar + 1 grupo de constantes con
texto sin mostrar. El código muerto sin contenido (helpers sin llamar, CSS retirado, `_scBindDetails`
inexistente) no cuenta: se limpia sin mapa.

Hallazgos de B1: 16 `<style>` en línea y ~60 hex (paleta de marca de Meta); "~$1.8T" sembrado en 3 lugares,
múltiplos de peers sembrados (`META_PEERS`, `MULT_ROWS`) y precio de respaldo $740 (regla 10); Summit del
snapshot 2026-05-22 (ya no existe) en ~15 constantes; consenso LSEG en Results; cifras viejas (Q4'25) que
contradicen Earnings 2Q26; el lede del theme record apunta a un tab "Guidance" que ya no existe; Timeline y el
"moat $1.00" repetidos. Todo el texto en pantalla está en inglés.

| # | Pieza original (archivo:función) | Ubicación hoy | Destino (sección ▸ sub-tab ▸ bloque) | Cómo | Estado |
|---|---|---|---|---|---|
| 1 | `metaKeyFacts (META_FACTS)` · 10 celdas; market cap en vivo (fallback "~$1.8T · est" sembrado) | Overview ▸ Key Facts | Overview ▸ OV-1 Key Facts | se rehace con las 10 celdas de la guía; sin el market cap sembrado ("~$1.8T · est") | ✅ |
| 2 | `renderLive (#meLive)` · tira de precio, market cap, EV, deuda neta, acciones (Massive) | Overview ▸ precio en vivo | — (eliminada) | **borrado aprobado por SAB 2026-10-20**: "quítalo por completo"; la cotización en vivo se sigue pidiendo para market cap, peers y Sensitivity | ✅ |
| 3 | `html (DESC)` · párrafo FoA ~50%+ margen, consolidado ~41%, RL −$19B | Overview ▸ lede | Overview ▸ OV-2 Descripción | se reescribe a 50–80 palabras sin números; las cifras pasan a OV-3/OV-4 "The numbers" | ✅ |
| 4 | `metaFourQuad (META_BIZ)` · qué vende · quién compra · cómo gana · ventaja | Overview ▸ 2×2 | Overview ▸ OV-3 Cuadrante 2×2 | se conserva, ajustado a ≤ 30 palabras por celda | ✅ |
| 5 | `moneyMapBody` · barras Ads 98% vs RL+other 2% | Overview ▸ How Meta makes money | Overview ▸ OV-4 How Meta makes money | barras de segmento (FoA vs RL) + vista Geography del 10-K + acordeones por segmento con "The numbers" | ✅ |
| 6 | `moneyMapBody→chain (AD_FLOW)` · cadena de 5 pasos de la subasta, con modal | Overview ▸ How Meta makes money | Top Line ▸ Segments ▸ FoA ▸ Revenue interactions | la cadena de la subasta se vuelve la explicación de impresiones × precio por anuncio | ⬜ |
| 7 | `productsBody (RL_DETAIL)` · 4 tarjetas FoA + 3 RL con modal | Overview ▸ What it makes | Overview ▸ OV-5 Products & platforms | tarjetas por familia (Facebook, Instagram, WhatsApp, Messenger, Threads, Meta AI, Reality Labs) con modal | ✅ |
| 8 | `moatBody (ECO_OPEN)` · reparto de $1.00 en el open web | Overview ▸ Walled garden | Misc ▸ Competitive position ▸ The walled garden | **fusión** con #37 (mismo reparto de $1.00) | ⬜ |
| 9 | `metaScatter (META_PEERS, META_CATS)` · scatter 9 peers, múltiplos sembrados "web-sourced mid-2026" | Overview ▸ Competitors | Overview ▸ OV-6 Competitors | se rehace: denominadores de filings/BBG y múltiplos en vivo (regla 10); sin múltiplos sembrados | ✅ |
| 10 | `html (TIMELINE)` · 7 hitos con modal | Overview ▸ Timeline | Overview ▸ OV-7 Timeline | se conserva; **fusión** con #80 (mismo arco de hitos) | ✅ |
| 11 | `OV_SOURCE` · pie (cita snapshot 2026-05-22) | Overview ▸ pie | Overview ▸ OV-F Pie | se reescribe sin el snapshot 2026-05-22 ni "web-sourced multiples" | ✅ |
| 12 | `wireModal` · modal compartido (11 tipos) | Overview/DD ▸ modal | Overview y Deep Dive ▸ modal | se conserva (infraestructura) | ⬜ |
| 13 | `deepDiveHtml/subtabs` · 5 secciones + sub-tabs | DD ▸ navegación | Deep Dive ▸ barras de navegación | se rehace con la estructura de AMZN (F1) | ⬜ |
| 14 | `segmentsBody (RL_CUM)` · lede + 2 tarjetas FoA vs RL | Top Line ▸ Segments | Top Line ▸ General ▸ The segments | el texto pasa a las tarjetas de segmento (`brief`) del motor | ⬜ |
| 15 | `buildSegments meSegRev` · barras ingreso por segmento FY21–25 | Top Line ▸ Segments | Top Line ▸ General ▸ How revenue divides | reemplazada por el motor (datos de Results); los datos FY21–25 van al archivo de Results | ⬜ |
| 16 | `meSegOp` · barras utilidad operativa por segmento FY21–25 | Top Line ▸ Segments | Top Line ▸ Segments ▸ top line del segmento | reemplazada por el motor (utilidad operativa por segmento de Results) | ⬜ |
| 17 | `kpis(KPIS)` · nota + 4 tiles FY25 | Top Line ▸ Segments | Top Line ▸ General ▸ tarjetas de segmento | **fusión** con las tarjetas del motor; la nota de la brecha RL pasa a la `note` del panel | ⬜ |
| 18 | `SRC_FIN` · pie | Top Line ▸ Segments | Top Line ▸ pie del panel | reemplazado por el pie del motor (`source`) | ⬜ |
| 19 | `.mseg-tabs` · toggle FoA ⇄ RL | Top Line ▸ Segments | Top Line ▸ Segments ▸ pastillas de segmento | reemplazado por las pastillas del motor | ⬜ |
| 20 | `foaBody` · ecuación impresiones × precio por anuncio (Q4'25, desactualizada) | Top Line ▸ Segments ▸ FoA | Top Line ▸ Segments ▸ FoA ▸ Revenue interactions | impresiones × precio por anuncio: la identidad obligatoria de precio × volumen (R6), actualizada a 2Q26 | ⬜ |
| 21 | `buildFoa meFoaRev` · barras apiladas Advertising + Other FY21–25 | Top Line ▸ Segments ▸ FoA | Top Line ▸ Other ▸ Advertising vs Other revenue | corte alternativo del ingreso de FoA (motor) | ⬜ |
| 22 | `foaBody` · nota DAP/ARPP (~3.5B, desactualizada) | Top Line ▸ Segments ▸ FoA | Top Line ▸ Segments ▸ FoA ▸ KPIs | DAP y ARPP como KPIs publicados (8-K), actualizados | ⬜ |
| 23 | `foaBody` · "the auction in one line" | Top Line ▸ Segments ▸ FoA | Top Line ▸ Segments ▸ FoA ▸ Revenue interactions | texto "the auction in one line" dentro de What it says | ⬜ |
| 24 | `foaBody` · GEM antes/después | Top Line ▸ Segments ▸ FoA | Top Line ▸ Segments ▸ FoA ▸ What it sells ▸ Commentary | GEM como cita de management con trimestre | ⬜ |
| 25 | `foaBody` · 4 tiles de crecimiento (Reels, Threads, WhatsApp) + pie | Top Line ▸ Segments ▸ FoA | Top Line ▸ Segments ▸ FoA ▸ KPIs / What management has said | tiles de crecimiento como KPIs o citas con trimestre | ⬜ |
| 26 | `rlBody (RL_WHAT, RL_DETAIL)` · lede + Quest/Ray-Ban/Horizon/Orion con modal | Top Line ▸ Segments ▸ RL | Top Line ▸ Segments ▸ RL ▸ What it sells | Quest / Ray-Ban Meta / Horizon / Orion como productos con definición y clientes | ⬜ |
| 27 | `rlBody (RL_NOTE, RL_READ_DETAIL)` · "How to read RL" 3 tarjetas + pie | Top Line ▸ Segments ▸ RL | Top Line ▸ Segments ▸ RL ▸ Our read on it + Commentary | las 3 tarjetas como lectura propia (OURS) y citas (CALL) | ⬜ |
| 28 | `customersBody` · hero 0.02% vs 10–20% | Top Line ▸ Customers | Top Line ▸ Customers ▸ What the company discloses | el hallazgo de concentración (no hay cliente material) | ⬜ |
| 29 | `customersBody (SC_CUST_*)` · tabla SPLC top-5 clientes + 239 más | Top Line ▸ Customers | Top Line ▸ Customers ▸ Who has said they buy from Meta | tabla SPLC; y sección 5 "What each top customer buys" por clase de anunciante (R1) | ⬜ |
| 30 | `customersBody (SC_NOTE)` · "Why this matters" + pie | Top Line ▸ Customers | Top Line ▸ Customers ▸ nota + pie | texto a la nota de cobertura (`coverageWhy`) | ⬜ |
| 31 | `tamBody (TAM_BARS)` · barras publicidad global / digital / Meta | Top Line ▸ TAM | Misc ▸ Competitive position ▸ market share | el TAM como denominador de la cuota de mercado; texto de superficies nuevas a la nota | ⬜ |
| 32 | `tamBody (TAM_NEW, TAM_NOTE)` · superficies nuevas + nota | Top Line ▸ TAM | Misc ▸ Competitive position ▸ market share | el TAM como denominador de la cuota de mercado; texto de superficies nuevas a la nota | ⬜ |
| 33 | `industryBody` · 4 tiles de la arena | Top Line ▸ Industry | Misc ▸ Competitive position | amenazas → "cuestionamientos" con evidencia a favor y en contra; peers cualitativos → tabla de competidores (TikTok, YouTube, Google Search, Amazon Ads…); cifras desactualizadas se corrigen | ⬜ |
| 34 | `industryBody (META_THREATS)` · 6 amenazas con modal | Top Line ▸ Industry | Misc ▸ Competitive position | amenazas → "cuestionamientos" con evidencia a favor y en contra; peers cualitativos → tabla de competidores (TikTok, YouTube, Google Search, Amazon Ads…); cifras desactualizadas se corrigen | ⬜ |
| 35 | `industryBody` · Bull vs Bear + what to watch (capex desactualizado) | Top Line ▸ Industry | Misc ▸ Competitive position | amenazas → "cuestionamientos" con evidencia a favor y en contra; peers cualitativos → tabla de competidores (TikTok, YouTube, Google Search, Amazon Ads…); cifras desactualizadas se corrigen | ⬜ |
| 36 | `industryBody (PEERS)` · tabla cualitativa de 4 peers + pie | Top Line ▸ Industry | Misc ▸ Competitive position | amenazas → "cuestionamientos" con evidencia a favor y en contra; peers cualitativos → tabla de competidores (TikTok, YouTube, Google Search, Amazon Ads…); cifras desactualizadas se corrigen | ⬜ |
| 37 | `unitEconBody` · lede + callout $1.00 | Bottom Line ▸ Unit Economics | Misc ▸ Competitive position ▸ The walled garden | flujo animado + "why margin" se conservan; el callout de $1.00 se **fusiona** con #8 | ⬜ |
| 38 | `flowHtml/wireFlow (FLOW_*)` · flujo animado de la subasta (Play/Prev/Next) | Bottom Line ▸ Unit Economics | Misc ▸ Competitive position ▸ The walled garden | flujo animado + "why margin" se conservan; el callout de $1.00 se **fusiona** con #8 | ⬜ |
| 39 | `unitEconBody` · "Why margin" + pie | Bottom Line ▸ Unit Economics | Misc ▸ Competitive position ▸ The walled garden | flujo animado + "why margin" se conservan; el callout de $1.00 se **fusiona** con #8 | ⬜ |
| 40 | `spendBody (SPEND_LEDE)` · lede de la reconstrucción leases/cloud | Bottom Line ▸ Spend Engine | Misc ▸ Capex & Depreciation | como el Misc ▸ Capex de AMZN; capex y D&A con Summit 2026-08-04 congelado; leases/cloud como estimado marcado; se corrige la leyenda de 2028 | ⬜ |
| 41 | `buildSpend meCapex` · barras capex FY19–2027E | Bottom Line ▸ Spend Engine | Misc ▸ Capex & Depreciation | como el Misc ▸ Capex de AMZN; capex y D&A con Summit 2026-08-04 congelado; leases/cloud como estimado marcado; se corrige la leyenda de 2028 | ⬜ |
| 42 | `meDa` · barras D&A FY21–2027E | Bottom Line ▸ Spend Engine | Misc ▸ Capex & Depreciation | como el Misc ▸ Capex de AMZN; capex y D&A con Summit 2026-08-04 congelado; leases/cloud como estimado marcado; se corrige la leyenda de 2028 | ⬜ |
| 43 | `EST_CAP` · leyenda de estimados (menciona 2028, inconsistente) | Bottom Line ▸ Spend Engine | Misc ▸ Capex & Depreciation | como el Misc ▸ Capex de AMZN; capex y D&A con Summit 2026-08-04 congelado; leases/cloud como estimado marcado; se corrige la leyenda de 2028 | ⬜ |
| 44 | `spendBody (SPEND_WAYS)` · Owned / Leases / Cloud con modal | Bottom Line ▸ Spend Engine | Misc ▸ Capex & Depreciation | como el Misc ▸ Capex de AMZN; capex y D&A con Summit 2026-08-04 congelado; leases/cloud como estimado marcado; se corrige la leyenda de 2028 | ⬜ |
| 45 | `SPEND_MIX + SPEND_NOTE` · compromisos cloud 2026 por destino | Bottom Line ▸ Spend Engine | Misc ▸ Capex & Depreciation | como el Misc ▸ Capex de AMZN; capex y D&A con Summit 2026-08-04 congelado; leases/cloud como estimado marcado; se corrige la leyenda de 2028 | ⬜ |
| 46 | `spendBody (EFFIC)` · eficiencias + pie | Bottom Line ▸ Spend Engine | Misc ▸ Capex & Depreciation | como el Misc ▸ Capex de AMZN; capex y D&A con Summit 2026-08-04 congelado; leases/cloud como estimado marcado; se corrige la leyenda de 2028 | ⬜ |
| 47 | `suppliersBody` · 4 tiles de asimetría + leyenda | Bottom Line ▸ Suppliers | Bottom Line ▸ Supply Chain | se conserva (SPLC 2026-06-26), en el formato de AMZN | ⬜ |
| 48 | `scRenderSuppliers (SC_SUPPLIERS)` · ranking 19 proveedores con filtro CAPEX/COGS/SGA y modal | Bottom Line ▸ Suppliers | Bottom Line ▸ Supply Chain | se conserva (SPLC 2026-06-26), en el formato de AMZN | ⬜ |
| 49 | `mbars` · mix por categoría | Bottom Line ▸ Suppliers | Bottom Line ▸ Supply Chain | se conserva (SPLC 2026-06-26), en el formato de AMZN | ⬜ |
| 50 | `mbars (SC_GEO)` · geografía 6 países + pie | Bottom Line ▸ Suppliers | Bottom Line ▸ Supply Chain | se conserva (SPLC 2026-06-26), en el formato de AMZN | ⬜ |
| 51 | `marginsBody/loadMargins (MRG_*)` · líneas de márgenes FY21–26E (vivo vía get-margins) | Bottom Line ▸ Margins | Bottom Line ▸ General ▸ Profitability & margins | reemplazada por la versión AMZN (desplegable de métricas, Actual/Summit/Consensus) | ⬜ |
| 52 | `MRG_NOTE_*, SRC_FIN` · nota + pie | Bottom Line ▸ Margins | Bottom Line ▸ General ▸ Profitability & margins | reemplazada por la versión AMZN (desplegable de métricas, Actual/Summit/Consensus) | ⬜ |
| 53 | `ceIRButton` · tarjetas IR y EDGAR | Evolution ▸ Earnings | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 54 | `ce-note` · intro de las fases | Evolution ▸ Earnings | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 55 | `ce-phtabs + ceQPills` · Setup / Watch List / Post-Results + trimestres | Evolution ▸ Earnings | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 56 | `ceSetupBody` · badge + lede | Earnings ▸ Setup | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 57 | `ceSetupBody` · barra de controles | Earnings ▸ Setup | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 58 | `ceGrid('head') (CE_CONS)` · grilla de 9 métricas Street vs Summit | Earnings ▸ Setup | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 59 | `ceGrid('cust')` · grilla de 4 KPIs propios | Earnings ▸ Setup | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 60 | `ceSetupBody` · nota de la grilla | Earnings ▸ Setup | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 61 | `ceSetupBody` · "The debate" Street vs Summit | Earnings ▸ Setup | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 62 | `setup.debate.synth` · "the one thing to resolve" | Earnings ▸ Setup | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 63 | `setup.pricedIn / oneLiner` · "What was priced in" | Earnings ▸ Setup | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 64 | `resultsHtml('META_SETUP')` · gráfica Setup (motor Results) | Earnings ▸ Setup | Evolution ▸ Earnings ▸ Setup | se conserva; Summit congelado del 2026-08-04 y consenso BBG; se re-extrae la maquinaria de AMZN | ⬜ |
| 65 | `mountWatchList` · Watch List (Supabase) | Earnings ▸ Watch List | Evolution ▸ Earnings ▸ Setup ▸ Watch List | se conserva (Supabase), como en AMZN | ⬜ |
| 66 | `callsBody (META_THEMES)` · theme record por tema / por trimestre | Earnings ▸ Watch List | Evolution ▸ Earnings ▸ Notes | theme record → fase Notes; se arregla el lede que apunta a "Guidance" | ⬜ |
| 67 | `ceResultsBody` · badge + lede | Earnings ▸ Post-Results | Evolution ▸ Earnings ▸ Post-Results | se conserva; nota de EPS sin LSEG | ⬜ |
| 68 | `cePrintBlock` · tiles del print vs Street/Summit | Earnings ▸ Post-Results | Evolution ▸ Earnings ▸ Post-Results | se conserva; nota de EPS sin LSEG | ⬜ |
| 69 | `ceSummaryBlock` · call summary (solo Q2'26) | Earnings ▸ Post-Results | Evolution ▸ Earnings ▸ Post-Results | se conserva; nota de EPS sin LSEG | ⬜ |
| 70 | `thesisCheck` · red-lines HELD/TRIPPED | Earnings ▸ Post-Results | Evolution ▸ Earnings ▸ Post-Results | se conserva; nota de EPS sin LSEG | ⬜ |
| 71 | `intoCall` · "What this tees up" | Earnings ▸ Post-Results | Evolution ▸ Earnings ▸ Post-Results | se conserva; nota de EPS sin LSEG | ⬜ |
| 72 | `ceHighlightsBlock` · "Also on the call" | Earnings ▸ Post-Results | Evolution ▸ Earnings ▸ Post-Results | se conserva; nota de EPS sin LSEG | ⬜ |
| 73 | `ceResultsBody` · pie | Earnings ▸ Post-Results | Evolution ▸ Earnings ▸ Post-Results | se conserva; nota de EPS sin LSEG | ⬜ |
| 74 | `resultsHtml('META') views.q` · trimestral actual vs Summit vs Street vs guía (consenso LSEG) | Evolution ▸ Results | Evolution ▸ Results | el dataset se rehace: consenso BBG (no LSEG), Summit congelado de los 5 snapshots | ✅ |
| 75 | `views.y` · anual | Evolution ▸ Results | Evolution ▸ Results | el dataset se rehace: consenso BBG (no LSEG), Summit congelado de los 5 snapshots | ✅ |
| 76 | `resultsEvoHtml('META')` · cada año a través de 4 vintages | Evolution ▸ Estimates | Evolution ▸ Estimates | se rehace con los 5 snapshots del MCP | ✅ |
| 77 | `strategyBody (STRAT_LOOP)` · flywheel de 4 nodos | Evolution ▸ Strategy | Misc ▸ Strategy | flywheel + cuatro apuestas, como sub-tab propia de Misc | ⬜ |
| 78 | `STRAT_HERO` · 3 tarjetas hero | Evolution ▸ Strategy | Misc ▸ Strategy | flywheel + cuatro apuestas, como sub-tab propia de Misc | ⬜ |
| 79 | `STRAT_DRIVERS, STRAT_NOTE` · cuatro apuestas con modal + pie | Evolution ▸ Strategy | Misc ▸ Strategy | flywheel + cuatro apuestas, como sub-tab propia de Misc | ⬜ |
| 80 | `timelineBody (TIMELINE)` · arco de 7 hitos (repite el 10) | Evolution ▸ Timeline | Overview ▸ OV-7 Timeline | **fusión** con #10 (duplicado) | ⬜ |
| 81 | `META_MNA` · 7 deals de M&A con modal + nota | Evolution ▸ Timeline | Misc ▸ M&A | como el Misc ▸ M&A de AMZN | ⬜ |
| 82 | `#dd-val-slot` · Pillar de Valuation (ratings Massive) | Valuation ▸ Analyst Ratings | Pillars ▸ Valuation | vuelve a su lugar original: la pestaña Pillars se muestra otra vez, como en AMZN (sin `absorbsPillars`) | ⬜ |
| 83 | `multiplesBody (MULT_ROWS)` · tabla de 5 empresas, múltiplos sembrados | Valuation ▸ Multiples | Valuation ▸ Peers ▸ The numbers behind the map | se rehace en vivo (denominadores + precio vivo); sin múltiplos sembrados | ⬜ |
| 84 | `sensBody (SENS_DRIVERS)` · 4 sliders | Valuation ▸ Sensitivity | Valuation ▸ Sensitivity Analysis | versión AMZN con Summit 2026-08-04; los 4 supuestos (crecimiento de ads, margen, recompra, P/E) como los ejes; sin precio de respaldo $740 | ⬜ |
| 85 | `sensRender (SENS_BASE)` · tiles implícitos vs precio vivo (fallback $740) | Valuation ▸ Sensitivity | Valuation ▸ Sensitivity Analysis | versión AMZN con Summit 2026-08-04; los 4 supuestos (crecimiento de ads, margen, recompra, P/E) como los ejes; sin precio de respaldo $740 | ⬜ |
| 86 | `sensBody` · pie | Valuation ▸ Sensitivity | Valuation ▸ Sensitivity Analysis | versión AMZN con Summit 2026-08-04; los 4 supuestos (crecimiento de ads, margen, recompra, P/E) como los ejes; sin precio de respaldo $740 | ⬜ |
| 87 | `capAllocBody` · 4 tiles de retorno de capital | Valuation ▸ Capital Allocation | Management ▸ Governance & SBC ▸ Capital return | recompras + dividendos vs FCF, junto a la dilución por SBC | ⬜ |
| 88 | `buildCapital meCap` · recompras + dividendos vs FCF FY21–25 | Valuation ▸ Capital Allocation | Management ▸ Governance & SBC ▸ Capital return | recompras + dividendos vs FCF, junto a la dilución por SBC | ⬜ |
| 89 | `CAP_*` · tabla + nota + pie | Valuation ▸ Capital Allocation | Management ▸ Governance & SBC ▸ Capital return | recompras + dividendos vs FCF, junto a la dilución por SBC | ⬜ |
| 90 | `finBody (FIN_SERIES)` · 6 métricas FY19–2027E con slider | Valuation ▸ Financials | Bottom Line ▸ General ▸ Profitability & margins | **fusión** con #51: el desplegable de métricas de BL-GEN-1 ya cubre Rev/OI/NI/EBITDA/FCF/Capex | ⬜ |
| 91 | `META_MGMT.lede` · lede | Management ▸ Executives & Board | Management ▸ Executives & Board | se conserva (motor management.js) | ⬜ |
| 92 | `makeManagement execs` · 9 ejecutivos con modal CV | Management ▸ Executives & Board | Management ▸ Executives & Board | se conserva (motor management.js) | ⬜ |
| 93 | `board` · 12 consejeros + nota | Management ▸ Executives & Board | Management ▸ Executives & Board | se conserva (motor management.js) | ⬜ |
| 94 | `gov` · 4 tiles de gobierno + pie | Management ▸ Executives & Board | Management ▸ Executives & Board | se conserva (motor management.js) | ⬜ |
| 95 | `trackBody` · leyenda de ratings | Management ▸ Track Record | Management ▸ Track Record | se conserva; sin "~$1.8T company" | ⬜ |
| 96 | `META_TRACK` · 9 ejecutivos calificados con modal | Management ▸ Track Record | Management ▸ Track Record | se conserva; sin "~$1.8T company" | ⬜ |
| 97 | `META_BOARD_TRACK` · 6 consejeros + pie | Management ▸ Track Record | Management ▸ Track Record | se conserva; sin "~$1.8T company" | ⬜ |
| 98 | `govBody` · lede + callout de control | Management ▸ Governance & SBC | Management ▸ Governance & SBC | se conserva | ⬜ |
| 99 | `buildSbc meSbc` · SBC vs acciones diluidas FY21–25 + pie | Management ▸ Governance & SBC | Bottom Line ▸ General ▸ Stock-based compensation | la gráfica SBC vs acciones diluidas va a BL-GEN-4 (como AMZN); MG-GOV la cita | ⬜ |
| 100 | `#dd-mgmt-slot` · Pillar de Management (Fiscal.ai; META fuera del plan) | Management ▸ Ownership | Pillars ▸ Management | vuelve a Pillars; Management ▸ Ownership se arma con la tabla de insiders (Form 4 / DEF 14A), como TSM | ⬜ |
| 101 | `SOURCES` · pie maestro | DD ▸ pie general | Un pie por panel (§22) | el pie maestro se reparte en los pies de cada sub-tab | ⬜ |
| 102 | `modelBody + buildAve* (Q13…OPM_A)` · backtest de sorpresas 1Q23–1Q26 ("kept for salvage") | (sin montar) Model vs Reality | Evolution ▸ Results ▸ surprise scorecard | **fusión**: Results ya muestra la sorpresa por trimestre; los datos (snapshot que ya no existe) no se reusan | ✅ |
| 103 | `guideBody (GUIDE, CAPEX_GUIDE)` · guiado vs entregado 1Q24–2Q26 + escalada del capex guide | (sin montar) Guidance | Evolution ▸ Results ▸ bandas de guía + capex guide anual | **fusión**: la guía de ingreso va en guideLo/guideHi; la escalada del capex guide como guía anual de capex | ✅ |
| 104 | `CALLS, CALLS_NOTE, TAILWINDS, HEADWINDS, WALLED, FOA_WINS, GEM_WHAT, GEM_POINTS, FY_NOTE, AS_OF` · texto editorial sin mostrar | (sin montar) constantes con contenido | repartidas | TAILWINDS/HEADWINDS → Misc ▸ Competitive position; WALLED/FOA_WINS/GEM_* → Top Line ▸ Segments ▸ FoA; CALLS → Earnings ▸ Notes; FY_NOTE/AS_OF (cifras viejas) → **fusión** con OV-4 "The numbers" | ⬜ |

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

### 2026-10-20 · B1 Inventario + B2 Mapa de reubicación — APROBADAS
- Qué se mostró: inventario de 104 piezas (101 visibles + 2 paneles sin montar + 1 grupo de constantes), contado en el código y en el portal local (26 sub-tabs, consola limpia); mapa con destino y "cómo" para cada pieza; 7 fusiones.
- Cambios pedidos antes de aprobar: quitar la tira de precio en vivo (hecho, pieza 2); títulos del 2×2 en negro y acento único `--steel` (hecho, también AMZN/TSM); barras de OV-4 en grises (hecho, también AMZN/TSM).
- Ajuste al aprobar: Misc conserva **Capacity → revenue**.
### AAAA-MM-DD · <ID> <Nombre> — <APROBADA | CAMBIOS | OMITIDA>
- Qué se mostró:
- Fuentes:
- Autoauditoría:
- Cambios pedidos / decisiones:

### 2026-10-20 · OV-1 Key Facts — APROBADA
- Qué se mostró: 10 celdas estándar (Listing, HQ, Incorporated, SEC filer, Founded, IPO, CEO, Employees 78,865 · Dec 2025, Dividend, Market cap en vivo con fecha); sin semilla de market cap.
- Fuentes: 10-K FY2025 (portada; Item 1 Corporate Information y Human Capital; Item 5 Dividend Policy); EDGAR; Massive liveQuote.

### 2026-10-20 · OV-2 … OV-7 + OV-F — APROBADAS (aprobación previa de SAB)
- SAB aprobó OV-2 y pidió hacer el resto del Overview de un jalón con aprobación por adelantado; no se cambia la guía por esto.
- Qué se hizo: OV-3 2×2 reescrito con cifras del 10-K FY2025; OV-4 "How Meta makes money" con vistas Segments / Geography (Note 15 y Note 2), acordeones por segmento con "The numbers" (absorben las cifras de la descripción vieja, pieza #3 y #104) y "The revenue lines"; OV-5 7 familias de producto con modal; OV-6 mapa de peers copiado de TSM (denominadores del 10-K FY2025 vía EDGAR XBRL + consenso BBG FY2026 para META/GOOGL/AMZN; múltiplos en vivo); OV-7 7 hitos con viñetas (sin precios de acción); OV-F pie único. Se quitaron del Overview el `<style>` en línea (A1), el mapa viejo con múltiplos sembrados y el colapsable del moat.
- Pendientes de su destino (contenido conservado en el código, B2): cadena de la subasta `AD_FLOW` (#6 → TL-SEG) y walled garden `ECO_OPEN` (#8 → MISC-comp).
- Autoauditoría: ✔ 7 bloques + pie en orden · ✔ 2×2 ≤ 30 palabras · ✔ segmentos = geografía = $200,966M · ✔ barras grises, montos en negro · ✔ sin `<style>` en el Overview · ✔ consola sin errores · ✘ **cotizaciones en vivo**: todas las funciones del portal respondían 401 a la sesión local (también para TSM); el mapa de peers y el market cap muestran "no live price" / "live quote unavailable" hasta volver a iniciar sesión — verificar al reconectar.
- Ojo para SAB: el consenso BBG FY2026 de GOOGL (archivo 9/8/2026) da ingreso +6.9% y EPS $19.90 (+84%), probablemente con ganancias de inversiones; se muestra tal cual el archivo.

### 2026-10-20 · EV-RES-DATA + EV-RES + EV-EST — APROBADAS
- Consenso: Bloomberg (`scripts/consensus/map_meta.json` → `emit_matrix.py` → `apply_matrix.py`; 30 snapshots, sin series congeladas ni reimpresas); flat `cons` = preprint del matrix (`verify_preprint.py META cons`: 220 same, 0 changed, 0 blanked). LSEG/Refinitiv eliminado.
- Summit: recongelado del snapshot 2026-08-04 (Projection History del workbook, Last Submit = 2026-08-04 15:52:20 = snapshot del MCP). Cuadre §9.1: 2026 reportado 1T–2T + estimados 3T–4T = anual (ingreso 256,178; OI 88,738; capex 145,000 en base del modelo). 2027 trimestral roto → null.
- EBITDA anual en base reportada (OI + D&A) para act, Summit (derivado) y BBG.
- Estimates: vintages Dec 15 · Feb 3 · May 5 · Aug 4 (2026-05-22 eliminado); notas reescritas.
- Arreglo de paso: `inspect_matrix.py` / `emit_matrix.py` leen el archivo BBG con `errors='replace'` (el byte µ los tumbaba para todos los tickers).
- Piezas B2 cerradas: #74, #75, #76, #102 (sorpresa = Results), #103 (bandas de guía).
