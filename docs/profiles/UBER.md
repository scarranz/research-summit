# UBER — bitácora de construcción del perfil

> Reglas: `docs/PROFILE_PLAYBOOK.md` §3. Claude la lee completa al empezar cada sesión y la actualiza en cada aprobación.
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)

| Campo | Valor |
|---|---|
| Empresa | Uber Technologies, Inc. (NYSE: UBER) |
| Modo | B — reordenar existente (`js/overviews/uber.js`, ~4,640 líneas; perfil de DOAA351/SAB/posterdeb, PRs #33/#43/#52/#53/#70/#78) |
| Rama | `feat/uber-restructure-v2` (desde `origin/main` @ `791f1b7`, 2026-11-03; worktree `rs-uber`). `feat/uber-restructure` ya existe en GitHub (rama vieja de DOAA351, jul 2026, mergeada en #52) y no se toca |
| Analista responsable | SAB (Santiago Alvarez) |
| Inicio | 2026-11-03 |
| Plazo | **3T26 se reporta el 2026-11-04** (mañana). SAB eligió "todo de una vez" (2026-11-03); por el plazo, EV-RES-DATA → EV-SET se adelantan dentro de lo que permiten las dependencias (§2.3) |
| Avance | 45 de 45 unidades aprobadas (2026-11-04) |

## 1. Inventario de datos (F0)

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | ✔ | el perfil ya abre (registrado en `js/overviews/index.js`) | el perfil abre | — |
| Filing anual (10-K / 20-F) | ✔ | 10-K FY2025 (Uber, CIK 1543151, domestic filer); 10-Q 2T26 | Overview, Top Line, textos verbatim | — |
| Año fiscal / moneda | ✔ | cierre 31 dic · USD | — | — |
| Summit DCF | ✔ | MCP: **4 submits** 2025-12-15 (después de 3T25) · 2026-02-05 (4T25) · 2026-05-06 (1T26) · **2026-08-05 (2T26)**. **No hay submit antes del 3T26**; SAB decidió usar el del 5-ago (2026-11-03). El dataset viejo también usaba un guardado 2026-07-31 que el MCP ya no lista (EBITDA/FCF forward) | F0-SM; Summit congelado en Results/Top Line/Setup, EV-EST, VA-TM, VA-SUB, VA-SENS | — |
| Consenso BBG (`BBG_CONSENSUS.txt` + `Consensus_Portal.xlsm`) | ✔ | `UBER US EQUITY`: **30 snapshots**, 2019-06-04 → **2026-09-10**; nada más nuevo ni en la hoja viva. GB total y por segmento, ingreso por segmento, utilidad operativa ajustada por segmento, EBITDA, FCF, viajes, MAPC. **Sin EPS ajustado** (solo GAAP) | `estMatrix.cons`, Setup, Bottom Line, forward de peers | EPS Street del 3T26 se queda con el archivo viejo |
| `get-market-history` (Massive) | ✔ desplegada (responde 401 sin sesión, ya no 404) | precio diario | Historic Multiple en vivo | — |
| Valuación del modelo en el MCP | ✔ | 4 submits, `quality_flags` vacío. 08-05: EV/EBITDA 14.0× 2027 Fwd · PT $107.58 · FV $101.46 · P/E 22.0× 2027 Fwd · PT $113.29 · FV $106.51; precio ese día $66.85. Prueba PT÷FV: 1.060 vs 1.064 → consistente. Submits anteriores solo EV/EBITDA (15×, 15×, 14×) | VA-TM, VA-SUB, VA-SENS | — |
| SPLC (clientes / proveedores) | ◐ | el perfil actual tiene sub-tabs `customers` y `suppliers` (por revisar en B1 de dónde salen) | TL-CUS, BL-SPLC | — |
| Transcripciones | ◐ | `docs/calls/UBER.md` (compendio hasta 4T25) + `UBER-latest.md` (**1T26**, sin rotar). La llamada del **2T26 no está en `docs/calls`** (el resumen vive en `uber.js` CALL_EARNINGS). 3T26: 2026-11-04 | EV-POST, EV-NOTES | — |
| Fiscal.ai (plan) | ✔ | UBER está en el plan gratis | tabla en vivo de Management | — |
| Massive (`liveQuote`) | ✔ | `covered-calls-massive` | market cap, peers | — |
| Fotos / imágenes | ✔ | `img/leadership/uber-*` (10) | Management | — |

**Alcance acordado (2026-11-03, SAB):** las 38 unidades + B1/B2 son construibles; Summit = submit 2026-08-05 (no habrá submit antes del 3T26).

## 1b. Mapa Summit (F0-SM)

> Reglas: `docs/PROFILE_PLAYBOOK.md` §6.3. Archivo: `js/summit-map/uber.js` (sin números).

Modelo: MCP `UBER` · USD · millones · 4 submits (2025-12-15 · 2026-02-05 · 2026-05-06 · 2026-08-05) ·
**67 etiquetas: 17 core · 21 segment · 14 kpi · 6 guidance · 4 consensus · 5 ignore (agrupadas)** · valuación EV / EBITDA
(4 submits) + P / E (solo 08-05), `quality_flags` vacío · 4 dudas.

Cuadre contra el comunicado (vía `act` del dataset de Results, que cuadra con cada 8-K) — 2T26 y FY2025:

| Etiqueta MCP | Rol | Clave portal | Qué es | Base | Unidad real | Agregación | Cuadre | Confianza |
|---|---|---|---|---|---|---|---|---|
| `REV` | core | `rev` | Ingreso | GAAP | USD M | suma | 2T26 14,191 ✔ · FY25 52,017 ✔ | ✔ |
| `ADJ_OPINC` | core | `opinc` | Utilidad operativa no-GAAP | ajustada | USD M | suma | 2T26 2,143 ✔ · FY25 6,309 vs 6,453 | ❓ (duda 1) |
| `OP_INCOME` | core | `opinc_gaap` | Utilidad de operación | ¿GAAP? | USD M | suma | 2T26 2,004 vs GAAP 1,890 | ❓ (duda 2) |
| `EBITDA` | core | `ebitda` | EBITDA ajustado | ajustada | USD M | suma | 2T26 2,819 ✔ · FY25 8,730 ✔ | ⚠ forward trimestral en 0 en 08-05 |
| `ADJ_NET_INCOME` / `EARNINGS` | core | `earnings` | Utilidad neta no-GAAP | ajustada | USD M | suma | FY25 5,237 (las dos) | ✔ |
| `GAAP_NET_INCOME` | core | `net_income` | Utilidad neta GAAP | GAAP | USD M | suma | 2T26 2,394 ✔ (BBG reportado) | ✔ |
| `ADJ_EPS` | core | `eps` | EPS no-GAAP | ajustada | $/acción | — | 2T26 0.806 ✔ · FY25 2.47 ✔ | ✔ |
| `SHARES` · `SHARES_OUT` | core | `shares` · `shares_out` | Diluidas (anual) · en circulación | — | acciones M | fin | FY25 2,119.7 · 2T26 2,050.2 | ✔ |
| `CAPEX` · `CFO` · `FCF` | core | `capex` · `cfo` · `fcf` | Flujo | GAAP / empresa | USD M | suma | FCF 2T26 2,792 ✔ · FY25 9,763 ✔ | ⚠ forward trimestral en 0 en 08-05 |
| `DNA` · `SBC` · `INT_INC` · `INT_EXP` · `TAX_RATE` | core | ídem | — | GAAP / modelo | USD M · % | suma · prom. | signos negativos en DNA/SBC | ✔ |
| `MOBILITY_*` · `DELIVERY_*` · `FREIGHT_*` (GB, REVENUE, ADJ_OPINC, EBITDA, CFO) · `CORP_GNA_*` | segment | `seg.<x>.*` | Por segmento | — | USD M | suma | GB 2T26 28,988 / 27,463 / 1,571 ✔; ingreso 7,363 / 5,245 ✔; op. inc. 2,215 / 1,055 / −24 / −1,103 = 2,143 ✔ | ⚠ `*_EBITDA` con quiebre de base en 1T26; `*_CFO` es asignación del modelo |
| `ORDERS` · `USERS` | kpi | `trips` · `mapc` | Viajes · MAPC | — | M | suma · fin | 3,867 ✔ · 208 ✔ | ⚠ ORDERS anual FY26 no sirve |
| `ONE_*` · `NON_MEMBERS_*` · `DELIVERY_GB_UBER_ONE` · `NEW_UBER_ONE_SPENDING` · `GB_PER_USER` | kpi | `one_*` | Socios Uber One vs no socios (construcción del modelo) | modelo | M · USD | — | ONE_MEMBERS_USERS 2T26 50 (comunicado: "50M+") | ⚠ derivadas del modelo |
| `SHR_BUYBACK` · `EBITDA_CFO` · `INSURANCE_CFO` | kpi | — | Recompras · conversión · reservas de seguro | — | USD M | suma | — | `EBITDA_CFO` ❓ (duda 4) |
| `GB/EBITDA/EPS_LOW/HIGH_GUIDANCE` | guidance | — | Guía | — | — | — | **todo en 0** (nunca se llenó) | guía sale de los comunicados |
| `REV/EBITDA/EARNINGS/SHARES_BBG_EST` | consensus | — | BBG anual dentro del modelo | — | — | — | — | se usa `BBG_CONSENSUS.txt` |
| `GAI`, `SHR_BUYBACK_PRICE`, `AIR`, `LOTR/LTR/STR/STI/RCUR/RNCUR` | ignore | — | ceros · unidades mezcladas · duplicado · auxiliares de balance | — | — | — | — | — |

### Dudas

```
❓ UBER · 1 · ADJ_OPINC anual FY2025
   Lo que se ve: 6,309 en el modelo vs 6,453 en el dataset de Results (los trimestres sí cuadran, p. ej. 2T26 2,143).
   Quién responde: Claude con el 10-K / SAB.   Mientras tanto: el anual de Results queda como está.
❓ UBER · 2 · OP_INCOME 2T26 = 2,004 vs GAAP 1,890
   Quién responde: SAB (autor del modelo).   Mientras tanto: no se usa (la utilidad operativa del perfil es la no-GAAP).
❓ UBER · 3 · forward trimestral de EBITDA / FCF en 0 en el submit 08-05
   Lo que se ve: el guardado 07-31 que los traía ya no lo lista el MCP.
   Mientras tanto: las series forward ya congeladas en el dataset se quedan (fuente 2026-07-31, dicha en el encabezado).
❓ UBER · 4 · EBITDA_CFO — qué es (FY2025 7,439). No se usa.
```

### Cambios del mapa

- 2026-11-03 · mapa creado (F0-SM) sobre el submit 2026-08-05.

## 2. Tablero de unidades

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | ✅ | 2026-11-03 | SAB | | Summit 4 submits (último 08-05), BBG 30 snapshots (último 09-10) |
| B1 | Inventario de contenido existente | ✅ | 2026-11-03 | SAB | | 96 piezas (conteo de control) |
| B2 | Mapa de reubicación | ✅ | 2026-11-03 | SAB | | 96 destinos; 9 fusiones aprobadas; Misc = comp · insurance · regulation · M&A/DH · TAM |
| F0-SM | Mapa de métricas Summit | ✅ | 2026-11-03 | SAB | | 67 etiquetas; 4 dudas abiertas sin uso |
| F1 | Esqueleto + vista previa | ✅ | 2026-11-03 | SAB | | 6 secciones, 18 sub-tabs; paneles enteros en su destino B2; Pillars visible otra vez (Ratings) |
| OV-1 | Overview ▸ Key Facts | ✅ | 2026-11-03 | SAB | fc50e3c | market cap en vivo con fecha / "unavailable"; 10 celdas |
| OV-2 | Overview ▸ Descripción | ✅ | 2026-11-03 | SAB | fc50e3c | sin cifras, del 10-K Item 1 |
| OV-3 | Overview ▸ Cuadrante 2×2 | ✅ | 2026-11-03 | SAB | fc50e3c | sin verde de Uber; cuotas de ingreso FY2025 |
| OV-4 | Overview ▸ How it makes money | ✅ | 2026-11-03 | SAB | fc50e3c | segmentos y región (10-K Nota 13), ambas cuadran con 52,017 |
| OV-5 | Overview ▸ Products & platforms | ✅ | 2026-11-03 | SAB | fc50e3c | 10 familias, sin emojis |
| OV-6 | Overview ▸ Competitors (peer map) | ✅ | 2026-11-03 | SAB | fc50e3c | 5 peers (UBER, DASH, CART, LYFT, GRAB); denominadores 10-K/20-F XBRL; forward BBG solo UBER/LYFT; múltiplos en vivo |
| OV-7 | Overview ▸ Timeline | ✅ | 2026-11-03 | SAB | fc50e3c | timeline movido sin cambios a uber-ov-timeline.js |
| OV-F | Overview ▸ Pie de fuentes | ✅ | 2026-11-03 | SAB | fc50e3c | un solo pie |
| EV-RES-DATA | Dataset de Results (números) | ✅ | 2026-11-03 | SAB | | estMatrix.cons v2 (30 snapshots, último 09-10); cons planos sincronizados; Summit anual 2026 de op. inc./EPS con nota |
| EV-RES | Evolution ▸ Results | ✅ | 2026-11-03 | SAB | 8b8fab9 | motor results.js; "Model vs Reality" y "Guidance vs reality" debajo (B2 #67/#68) — heredado, sin cambios de forma |
| TL-GEN | Top Line ▸ General | ✅ | 2026-11-03 | SAB | fc50e3c | motor segments.js; cita 10-K Item 1 |
| TL-SEG | Top Line ▸ Segments | ✅ | 2026-11-03 | SAB | fc50e3c | Mobility/Delivery/Freight con sells/products/kpiNote; frrev nuevo; análisis anterior en colapsable |
| TL-OTH | Top Line ▸ Other | ✅ | 2026-11-03 | SAB | fc50e3c | geografía región y país (10-K Nota 13) |
| TL-CUS | Top Line ▸ Customers | ✅ | 2026-11-03 | SAB | fc50e3c | 5 clases del 10-K; sin concentración (no se divulga); Uber One anterior en colapsable |
| EV-EST | Evolution ▸ Estimates | ✅ | 2026-11-03 | SAB | 8b8fab9 | motor; bloque evolution sin cambios (no hay submit nuevo) — heredado |
| EV-SET | Evolution ▸ Earnings ▸ Setup | ✅ | 2026-11-03 | SAB | | `uber-ce.js` (copia de googl-ce.js) + `uber-ce-data.js`; CE_CONS de `emit_ce_uber.py` (BBG 30 snapshots, último 09-10) + líneas de Results; Q3 2026 con Summit 08-05 y guía del 2T26 |
| EV-POST | Evolution ▸ Earnings ▸ Post-Results | ✅ | 2026-11-04 | SAB | 06408ca | 3T26 construido (8-K 4-nov + suplemento + prepared remarks; 46/46 citas verificadas por script); Q&A (9 preguntas, 56 citas) y Also on the call desde la transcripción el 2026-11-04; Setup 4T26 abierto con la guía; Street actualizado al archivo BBG del 3-nov (DOAA351), reemplazó la fila del 10-sep; verify_preprint 335/0/0
| EV-NOTES | Evolution ▸ Earnings ▸ Notes | ✅ | 2026-11-03 | SAB | 8b8fab9 | semilla v2 de las notas a mano de SAB (UBER.pdf): 30 hilos, 298 notas, Q3 2022 → Q2 2026; v1 guardada como UBER_THEMES_V1 |
| BL-GEN-1 | Bottom Line ▸ General ▸ Profitability & margins | ✅ | 2026-11-03 | SAB | 8b8fab9 | uber-bl.js (copia de googl-bl.js); margen sobre ingreso o GB |
| BL-GEN-2 | Bottom Line ▸ General ▸ The bridge | ✅ | 2026-11-03 | SAB | 8b8fab9 | 6 renglones de costo del 10-K (XBRL); subtotal "After cost of revenue" (Uber no reporta utilidad bruta) |
| BL-GEN-3 | Bottom Line ▸ General ▸ Op. income → net income | ✅ | 2026-11-03 | SAB | 8b8fab9 | op. income → net income (marcas de participaciones, liberación fiscal) |
| BL-GEN-4 | Bottom Line ▸ General ▸ Stock-based compensation | ✅ | 2026-11-03 | SAB | 8b8fab9 | SBC por función (10-K Nota 10) |
| BL-GEN-5 | Bottom Line ▸ General ▸ Expense lines | ✅ | 2026-11-03 | SAB | 8b8fab9 | una pestaña por renglón de gasto |
| BL-SEG | Bottom Line ▸ Segments | ✅ | 2026-11-03 | SAB | 8b8fab9 | Adj. EBITDA (a 4T25) y Segment Operating Income (desde 1T24) separados; unit economics anterior en colapsable |
| BL-SPLC | Bottom Line ▸ Supply Chain | ✅ | 2026-11-03 | SAB | 8b8fab9 | uber-splc.js con suppliersBody + SC_DISCLOSED (BBG 29-jun-2026); sin export SPLC en disco (dicho en el pie) |
| VA-HIST | Valuation ▸ Historic Multiple | ✅ | 2026-11-03 | SAB | 8b8fab9 | precio en vivo; P/E sobre EPS no-GAAP, sin forward P/E (BBG solo GAAP); deuda/acciones de XBRL |
| VA-PEERS | Valuation ▸ Peers | ✅ | 2026-11-03 | SAB | fc50e3c | mapa compartido con OV-6 + tabla |
| VA-TM | Valuation ▸ Target Multiple / PEG | ✅ | 2026-11-03 | SAB | 8b8fab9 | Summit 2026-08-05 congelado: 14.0× EV/EBITDA y 22.0× P/E sobre 2027 |
| VA-SUB | Valuation ▸ Submit History | ✅ | 2026-11-03 | SAB | 8b8fab9 | motor submits.js + submits-data/uber.js (4 submits) |
| VA-SENS | Valuation ▸ Sensitivity Analysis | ✅ | 2026-11-03 | SAB | 8b8fab9 | uber-sensitivity.js sobre 2026-08-05; la calculadora vieja (UBER_VAL, precio y caja tecleados) ya no se muestra; queda en el código |
| MG-TEAM | Management ▸ Executives & Board | ✅ | 2026-11-03 | SAB | 8b8fab9 | uber-mgmt-data.js: 10 ejecutivos, 10 consejeros (DEF 14A 2026); Susan Anderson fuera del grid (ya no está en la página de liderazgo), queda comentada |
| MG-OWN | Management ▸ Ownership | ✅ | 2026-11-03 | SAB | 8b8fab9 | tabla de 13 insiders (DEF 14A, 2-mar-2026) + >5% + Fiscal.ai en vivo; sin archivo HDS → sin toggle de top holders |
| MG-GOV | Management ▸ Governance & SBC | ✅ | 2026-11-03 | SAB | 8b8fab9 | 4 KPIs + tabla de gobierno + gráfica de SBC con acciones de los balances |
| MG-TRACK | Management ▸ Track Record | ✅ | 2026-11-03 | SAB | 8b8fab9 | 7 tarjetas SIN calificaciones (SAB: quitarlas, como GOOGL); targets 3 años, turnaround, capital allocation |
| MISC-comp | Misc ▸ Competitive Position | ✅ | 2026-11-03 | SAB | 885011a | arena map + rival map (B2 #37–#38) |
| MISC-insurance | Misc ▸ Insurance & Balance Sheet | ✅ | 2026-11-03 | SAB | 885011a | B2 #44–#51, #87–#88 |
| MISC-regulation | Misc ▸ Regulation | ✅ | 2026-11-03 | SAB | 885011a | sacada de Top Line ▸ Mobility (B2 #20) |
| MISC-manda | Misc ▸ M&A and Delivery Hero | ✅ | 2026-11-03 | SAB | 885011a | B2 #73–#82 |
| MISC-tam | Misc ▸ TAM | ✅ | 2026-11-03 | SAB | 885011a | B2 #34–#36 |
| F-FINAL | Cierre y entrega | ✅ | 2026-11-04 | SAB | | B3: 96 = 82 OK + 7 fusionadas + 7 parciales (texto conservado en datos, no en pantalla; §6) · 0 faltantes; 1,894 líneas muertas fuera de uber.js; estilos a css/overview.css; 7 citas del 10-K verificadas (4 corregidas) |

(Modo B: agregar B1 — inventario de contenido existente y B2 — mapa de reubicación después de F0.)

> Desde el 15 oct 2026 EV-EST, VA-TM y VA-SENS se construyen con Summit congelado del MCP (regla 10);
> EV-EST necesita ≥ 2 snapshots. Cada `MISC-<clave>` aprobada reemplaza la fila MISC; en MISC siempre se
> proponen `MISC-comp` y, si aplica, `MISC-capacity` (playbook §15b).

## 3. Decisiones del analista

<!-- Solo se agrega. Si una decisión cambia, nueva línea que cita la anterior. -->
- 2026-11-03 · enfoque · "todo de una vez" (reordenar completo + 3T26) — reporte el 2026-11-04 — SAB
- 2026-11-03 · F0 · Summit del submit 2026-08-05 para el Setup del 3T26 (no habrá submit nuevo antes) — SAB
- 2026-11-03 · B1 · la rama de DOAA351 `feat/uber-deep-dive` se usa solo donde sirva — SAB ("si ves que es útil… si no, desde 0")
- 2026-11-03 · B2 · mapa aprobado con las 9 fusiones (#11, #30, #48, #53, #67, #68, #70, #72, #91) — SAB
- 2026-11-03 · B2 · TAM → Misc ▸ TAM (sub-tab propia, como GOOGL) — SAB
- 2026-11-03 · TL-OTH · Gross Bookings por segmento como primer bloque de Top Line ▸ Other (pedido de SAB en la revisión) — SAB
- 2026-11-03 · OV-6/VA-PEERS · P/E de Uber con EPS no-GAAP ($2.47), como Historic Multiple; peers en GAAP — SAB
- 2026-11-03 · EV-RES · Uber One Members en Results ▸ KPIs: solo cifras dichas por Uber (comunicado o llamada), trimestres sin cifra en blanco, Summit solo forward (2026-08-05), sin Street — SAB
- 2026-11-03 · MG-TRACK · sin calificaciones de ejecutivos (solo evidencia, como GOOGL) — SAB
- 2026-11-03 · EV-RES-DATA · Summit FY2026 de utilidad operativa y EPS se muestra como lo dice el modelo, con nota (ΣQ ≠ anual, −5.2% / −5.6%) — SAB

## 4. Excepciones aceptadas

<!-- Cada FAIL de la autoauditoría que el analista decidió dejar. -->
- AAAA-MM-DD · <ID> · <qué regla> — <por qué se acepta> — <quién>

## 5. Mapa de reubicación (solo modo B)

Conteo de control (piezas originales): **96** (B1, leído del código de `uber.js` en `main` @ `791f1b7`; código muerto aparte:
`ubIntro`, `placeholder()`, `PEERS`, `TRIP_CASH`, `A_FCF`). La rama vieja de DOAA351 `feat/uber-deep-dive` (PR #100, cerrado) se
revisó: se rescata solo como borrador `segments-data/uber.js` (cuadra con el 10-K; con 8 arreglos), los nombres de costos y
`SEGNAMES` de Bloomberg; lo demás se salta (estilos en línea, verde de Uber, emojis, múltiplos a mano).

### B1 — inventario
#### B1 (detalle) (control count)

Counting rule: one row per visible content piece (block / section / chart / table / card set / modal set /
long text) and one row per data constant family that feeds visible content. Pure containers (a tab whose
only content is the rows listed under it) are not counted separately. Dead code is listed at the end and
**not** counted.

| # | Piece | file:function | Description | Source footer |
|---|---|---|---|---|
| **Overview** |||||
| 1 | Key Facts | uber.js:stdKeyFacts (STD_FACTS) | 10 cells; market cap seeded "~$150B · Jul 2026", replaced live by liveQuote | covered by #9 |
| 2 | Lede | uber.js:stdOverviewBody (UB_LEDE) | one-paragraph description | #9 |
| 3 | 2×2 quadrant | uber.js:stdFourQuad (STD_BIZ) | What it sells / Who buys / How it earns / The edge | #9 |
| 4 | Money map bars | uber.js:stdMoneyMap (STD_REV, STD_GB) | FY2025 segment bars, Revenue ⇄ Gross Bookings toggle, segment-colored | #9 + inline caption |
| 5 | "What is X?" accordions + Segment economics | uber.js:stdMoneyMap (STD_SEG_DEF) | per-segment definition; nested GB / revenue / Adj. EBITDA FY2025 | #9 |
| 6 | Products (two-tier) + `fam:` modal | uber.js:stdProducts (UB_PROD_GROUPS) | 3 groups, 11 family cards with emoji icons → product list modal | #9 |
| 7 | Peer scatter | uber.js:stdPeerScatter/ubScRender/ubScChips (UB_PEERS, UB_SC) | multiple vs growth, bubble = live mcap; multiples/growth seeded | #9 (says "web-sourced approximations") |
| 8 | Timeline + `hist:` modal | uber.js:stdTimeline (TIMELINE) | 8 milestones 2009–2026 | #9 |
| 9 | Overview footer | uber.js (UB_OV_SOURCES) | sources; Summit snapshot 2026-05-07 | itself |
| 10 | Shared modal | uber.js:html + wireModal | one modal for all `data-detail` keys (key, trip, mna, hist, reg, ins, aleka, note, fam, exec, arena, dh*, ce) | n/a |
| **Top Line ▸ Segments** |||||
| 11 | Live price strip | uber.js:ubSegmentsBody `#ubLive` + renderLive/fetchQuote | UBER price, % change, time (get-quote) | none |
| 12 | Segments lede | uber.js:ubSegmentsBody | "three businesses of very different size" | none at pane level (pane ends with #19's footer) |
| 13 | Chart: Gross Bookings by segment (annual 2022–2029E) | uber.js:buildOverviewCharts→buildSegStack (A_MOB_GB/A_DEL_GB/A_FRT_GB) | stacked bars, estimate = light | none (SOURCES only below Mobility) |
| 14 | Chart: Adj. EBITDA annual 2022–2029E | uber.js:buildAnnualBar (A_EBITDA) | bars | none |
| 15 | The Business in Three Parts | uber.js:segParts | segment cards/split text | none |
| 16 | Segment pill toggle | uber.js:ubSegmentsBody `.seg-pill` (inline `<style>`) | Mobility / Delivery / Freight | n/a |
| 17 | Mobility lede | uber.js:mobilityBody | where it came from / where it's going | SOURCES |
| 18 | The Barbell diagram | uber.js:barbellDiagram (BB_LOW, BB_PREM) | low-cost vs premium SVG economics | SOURCES |
| 19 | Autonomous Vehicles — Partner or Threat? | uber.js:mobilityBody | own-fleet vs aggregator comparison + evidence note | SOURCES (`ov-foot`) |
| 20 | Regulation & Driver Classification + `reg:` modal | uber.js:mobilityBody/regCard (REGV) | 4 cards (US, Intl, framing, other drags) | SOURCES |
| 21 | Delivery hero ("pandemic fad") | uber.js:deliveryBody | margin 1.9% → 4.0% → ~8% progression | SOURCES |
| 22 | Chart: Margin convergence (segment Adj. EBITDA ÷ GB, 1Q23–4Q25) | uber.js:buildDeliveryCharts→buildLines (MOB_MARGIN, DEL_MARGIN) | Mobility vs Delivery margin lines | SOURCES |
| 23 | Grocery & Advertising — two growth engines | uber.js:deliveryBody | two cards (~$12B grocery, >$2B ads) | SOURCES |
| 24 | The Merchant Network | uber.js:deliveryBody/scCard (SC_CUSTOMERS) | merchant logo cards from Bloomberg SPLC | SOURCES |
| 25 | Freight pane | uber.js:freightBody | lede, 4 KPI tiles, callout | own `ov-foot` (Uber FY2025 / Summit model) |
| **Top Line ▸ Customers** |||||
| 26 | Customers lede ×2 + Uber One stat tiles | uber.js:uberOneBody (UBERONE_STAT) | three kinds of customer; Uber One as monetization engine | SOURCES |
| 27 | Chart: Uber One members 4Q23–1Q26 | uber.js:buildUberOneCharts (UBERONE_GROWTH) | line, 19M → 50M | SOURCES |
| 28 | Priced to the Planet (SVG) | uber.js:uberOnePricing | USD-equivalent monthly price by country | SOURCES |
| 29 | Member economics | uber.js:uberOneEconomics (UBERONE_SPEND) | payback curve SVG, spend bars, penetration runway | SOURCES |
| 30 | The Cross-Sell Flywheel | uber.js:uberOneBody | callout text | SOURCES |
| 31 | Non-members | uber.js:uberOneBody | text section | SOURCES |
| 32 | Advertisers — merchant as customer | uber.js:uberOneBody | text section | SOURCES |
| 33 | Platform Expansion (U4B, Travel) | uber.js:uberOneBody | rows | SOURCES |
| **Top Line ▸ TAM** |||||
| 34 | TAM tiles | uber.js:ubTamBody | $5.7T / $2.8T S-1 TAMs, US market sizes | own `ov-foot` |
| 35 | The runway in two pictures | uber.js:ubTamBody (penBar) | penetration bars ride-hailing / delivery | own `ov-foot` |
| 36 | How Uber sizes it + Delivery TAM + sourcing callout | uber.js:ubTamBody | 2 text sections + callout | own `ov-foot` |
| **Top Line ▸ Industry Analysis** |||||
| 37 | Competitive Landscape — arena by arena + `arena:` modal | uber.js:uberArenaMap (AR_DETAIL) | 6 arenas: lead / contest / bet | SOURCES |
| 38 | Competitive map — rivals by business traits | uber.js:uberRivalScatter + PEER_NOTE + init peer-dot tips | breadth × geography scatter, 7 rivals incl. private | SOURCES |
| **Bottom Line ▸ Unit Economics** |||||
| 39 | How a Trip Makes Money — one $10 ride + `trip:` modal | uber.js:unitEconBody/chain/mbars (TRIP_FLOW, TRIP_SPLIT, TRIP_TAKE) | step chain + where $10 goes + Uber's $3 take | SOURCES; "Illustrative — Summit deck, Dec 2024" |
| 40 | How a Delivery order makes money | uber.js:unitEconBody (dbar) | split bars + 2 KPI tiles | SOURCES |
| 41 | Chart: Take rate 1Q23–1Q26 + `note:take` UK modal | uber.js:buildMobilityCharts→buildLines (MOB_TAKE, DEL_TAKE, UK_NOTE) | Mobility vs Delivery take | SOURCES |
| **Bottom Line ▸ Suppliers** |||||
| 42 | Driver & courier base | uber.js:suppliersBody | text section | SOURCES |
| 43 | Vendor layer — asset-light | uber.js:suppliersBody/scCard (SC_SUPPLIERS) | supplier cards (SPLC), 138 suppliers note | SOURCES |
| **Bottom Line ▸ Insurance & FCF** |||||
| 44 | Insurance hero + primer chips + machine cards + `ins:` modals | uber.js:insuranceBody (INS_POP) | $12.9B reserve; 3 primer + 3 machine cards | own `ov-foot` |
| 45 | Follow the money (SVG) + `aleka:` modals | uber.js:insMoneyFlow (ALEKA_CHAIN) | captive-insurer flow diagram | own `ov-foot` |
| 46 | How its role flipped | uber.js:insuranceBody/irPhase (INS_TL) | crutch → headwind → tailwind | own `ov-foot` |
| 47 | Reserve build bars 2021–Q1 26 | uber.js:insuranceBody (RES, local) | HTML bars | own `ov-foot` |
| 48 | Cash-burner → compounder bars 2021–2025 | uber.js:insuranceBody (OI, local) | GAAP op income diverging bars | own `ov-foot` |
| 49 | Is the cash real? bull/bear | uber.js:insuranceBody | two cards + modals | own `ov-foot` |
| 50 | Why it is becoming a smaller slice | uber.js:insuranceBody | text | own `ov-foot` |
| 51 | Uber vs Lyft — two ways to run insurance | uber.js:insModelCompare | comparison table | own `ov-foot` |
| **Bottom Line ▸ Margins** |||||
| 52 | Chart: Margins FY21–FY26E (6 lines) + note | uber.js:ubMarginsBody/buildUbMargins/ubLoadMargins (UB_MRG_*) | fallback data, live Massive override | **no `ov-foot`** (note only) |
| **Evolution ▸ Earnings** |||||
| 53 | IR / EDGAR banner + intro note | uber.js:ceIRButton + deepDiveHtml `.ce-note` | big IR/EDGAR cards; "decision layer" paragraph (emoji) | n/a |
| 54 | Phase tabs + quarter pills | uber.js:deepDiveHtml / ceQPills | Setup · Watch List · Post-Results; Q3 2026 (upcoming), Q2 2026, Q1 2026 | n/a |
| 55 | Setup grid (per quarter) | uber.js:ceSetupBody/ceGrid (CE_CONS, CALL_EARNINGS.setup) | headline + custom KPIs, Street/Summit/Both, YoY/QoQ, margins | per-quarter `ov-foot` ("Frozen at call time") + setup.source |
| 56 | "Where Summit and the Street differ" | uber.js:ceSetupBody (setup.debate) | diverge bullets + synth | same |
| 57 | Setup chart | uber.js:ceAnnualBody/gBuildCeAnnual → results.js `UBER_SETUP` | engine chart+table | engine source |
| 58 | Watch List | uber.js:ceWatchBody → watchlist.js:mountWatchList | shared engine, Supabase `company_themes` | engine |
| 59 | Theme record (By theme ⇄ By quarter) | uber.js:callsBody/callsByQuarter (UB_THEMES) | 6+ themes across 10 calls Q4'23–Q1'26 | own Sources line |
| 60 | Post-Results: The print scorecard | uber.js:ceResultsBody/cePrintBlock | Q2 2026, Q1 2026 vs frozen Street/Summit | per-quarter `ov-foot` |
| 61 | Post-Results: Call summary "the minute" | uber.js:ceSummaryBlock (UB_Q*_SUMMARY) | AI-distilled paragraphs + "＋ more" | per-quarter `ov-foot` |
| 62 | Post-Results: Thesis red-lines | uber.js:ceResultsBody (UB_Q*_THESISCHECK) | HELD/TRIPPED cards | per-quarter `ov-foot` |
| 63 | Post-Results: What this tees up | uber.js:ceResultsBody/ceTeeSplit (UB_Q*_INTOCALL) | hunt list, emoji-led | per-quarter `ov-foot` |
| 64 | Post-Results: Also on the call | uber.js:ceHighlightsBlock (UB_Q*_HIGHLIGHTS) | tagged highlights with detail | per-quarter `ov-foot` |
| **Evolution ▸ Results / Estimates** |||||
| 65 | Results | results.js via `resultsHtml('UBER')` (uberResults, 13 metrics × Q/A) | actual / Summit / Street / guidance | engine `source` (Summit 2026-08-05, BBG 2026-07-31) |
| 66 | Estimates | results.js via `resultsEvoHtml('UBER')` (uberResults.evolution) | annual estimate vintages | engine source |
| **Evolution ▸ Guidance** |||||
| 67 | Model vs Reality back-test + stats | uber.js:modelBody/buildAveChart/renderAve (AVE, rangeSlider) | Summit surprise bars by metric, 1Q23–1Q26 | own `ov-foot` (snapshot 2026-05-07) |
| 68 | Guidance vs reality chart + table | uber.js:modelBody/buildGuideChart/renderGuideTable (GUIDE) | guided band vs actual vs model (GB, EBITDA) | own `ov-foot` |
| 69 | 3-Year Targets (Investor Day Feb 2024) | uber.js:ub3yrTargets (TARGETS) | 3 target tiles + "running ahead" note | none |
| **Evolution ▸ Strategy** |||||
| 70 | Turnaround hero | uber.js:ubStrategyBody (inline `<style>` .utn) | −$3.5B → +$5.6B → $9.8B FCF, chips | SOURCES |
| 71 | What Truly Drives Uber + `key:` modal | uber.js:ubStrategyBody (KEY_DRIVERS) | 5 driver cards: Flywheel, Uber One, Barbell, Advertising, Cash Machine | SOURCES |
| **Evolution ▸ Timeline** |||||
| 72 | History & Milestones | uber.js:historyStoryBody (TIMELINE) | same TIMELINE as #8 | **none** |
| 73 | M&A — what each deal changed + `mna:` modal | uber.js:mnaTimeline (MNA) | divestitures/acquisitions grouped by financial effect + collapsible | **none** |
| **Evolution ▸ Delivery Hero Acquisition** |||||
| 74 | Deal intro + Deal snapshot + `dhp:` modals | uber.js:deliveryHeroBody/dhSnapshotHero (DH_PARAMS) | announced Jul 16 2026 | DH_SOURCES as `.ov-fynote` (not `.ov-foot`) |
| 75 | Delivery Hero at a glance (FY2025) | uber.js:deliveryHeroBody (DH_GLANCE) | KPI tiles | same |
| 76 | Where the markets change — world map + list, 3 views + `dhc:` modals | uber.js:dhMarketsSection/dhClassify/dhCountryDetail (DH_UBER_MARKETS, DH_SSW_MARKETS, UBER_MOBILITY/DELIVERY_MARKETS, DH_SETS, DH_REGION_*, WORLD_PATHS) | choropleth Uber today / DH today / after deal | DH_MAP_SOURCES |
| 77 | Combined scale bars ($236B pro forma) | uber.js:deliveryHeroBody/mbars | GB bars + EBITDA note | same |
| 78 | KPIs — Uber vs Delivery Hero + `dhk:` modals (incl. EBITDA turnaround) | uber.js:dhKpiSection/dhKpiDetail/dhEbitdaTurnaroundBody (DH_KPI_GLOSSARY, DH_EBITDA_TURN) | KPI comparability glossary | own source note |
| 79 | Uber One Opportunity + `dhu:`/`dhr:` modals | uber.js:dhUberOneSection/dhRationaleBanner/dhUberOneRegionCard (DH_RATIONALE, DH_UBERONE_REGIONS, DH_SEGMENT_GMV) | 4 region cards | 8-K Ex. 99.2 cite + DH_SEGMENT_SOURCE |
| 80 | Timeline — stake-building to integration (collapsible) | uber.js:dhTimelineBody (DH_TIMELINE_DEAL) | deal timeline | DH_SOURCES |
| 81 | Commitment to Germany | uber.js:dhGermanyBody (DH_GERMANY) | commitments | DH_SOURCES |
| 82 | Deal advisors (collapsible) | uber.js:dhAdvisorsBody (DH_ADVISORS) | list | DH_SOURCES |
| **Valuation** |||||
| 83 | Scenario → price target calculator | valuation.js:makeValuation via UBER_VAL.body/init | per-segment GB growth × take × margin × EV/EBITDA → price; net cash/price editable | `.val-foot` (Summit DCF, no snapshot date) |
| 84 | Peers multiples table | uber.js:ubPeerMultBody (UB_PEER_MULT) | 5 listed peers, mcap / EV/EBITDA / P/E / growth / "the read" | own `ov-foot` ("~Jul 2026, secondary sources") |
| 85 | Analyst Ratings (live) | companies.js:loadValuationData → `#dd-val-slot` | Massive ratings table + consensus bar (ex-Pillars ▸ Valuation) | engine |
| 86 | Capital Allocation | uber.js:ubCapAllocBody (local R) | 4 KPI tiles, FY22–25 table, hierarchy, buybacks, dividend, SBC text | own `ov-foot` |
| 87 | Balance Sheet (WIP banner, KPIs, line-item table) | uber.js:ubBalanceBody | Q1 2026 10-Q; net debt, stakes, insurance reserve | own `ov-foot` |
| 88 | Chart: equity-stake portfolio + insurance-reserve text + solidity callout | uber.js:buildUbBal (UB_STAKES) + ubBalanceBody | horizontal bars, carrying value | own `ov-foot` |
| **Management** |||||
| 89 | Executives & Board (bios modal, board, gov tiles) | management.js:makeManagement via UBER_MGMT | 11 execs, 10 directors, 3 gov tiles | `ov-foot` (cfg.foot) |
| 90 | Ownership & insiders (live) | companies.js:loadManagementData → `#dd-mgmt-slot` | Fiscal.ai holders + insider trades (ex-Pillars ▸ Management) | engine |
| 91 | Governance tiles | uber.js:ubGovBody | 4 tiles (voting, board, CEO pay, SBC %) | **none** |
| 92 | Chart: SBC % of revenue vs shares out FY20–25 + text | uber.js:buildUbSbc (UB_SBC_HIST) + ubGovBody | bar+line combo | **none** |
| 93 | Track Record cards + `exec:` modal | uber.js:ubTrackBody (TRACK_MGMT, TRACK_RATE) | 7 execs color-rated value creator / mixed / destroyer + CEO callout | own `ov-foot` |
| **Data constants not already named above (feed visible content)** |||||
| 94 | Annual + quarterly Summit series | uber.js top (YEARS, A_*, Q13, *_GB_A/E, *_REV_A, *_EB_A, REV_A/E, EB_A/E, MAPC_A/E, FCF_A/E, derived) | snapshot 2026-05-07; feed #13, #14, #22, #41, #67 | SOURCES |
| 95 | Results dataset | results-data/uber.js (uberResults, uberSetup) | 13 metrics, Q 3Q22–1Q27 + annual, evolution vintages | engine |
| 96 | Earnings data | uber.js (CE_CONS, CE_ANNUAL, CALL_EARNINGS, UB_Q1/Q2_2026_*) | BBG archive 12 snapshots; Q3'26 setup; Q1/Q2'26 results | per block |

**Control count = 96.**

Dead code (not rendered, not counted, must still get a destination): `ubIntro` + SNAPSHOT, DESC, KPIS,
AS_OF, FY_NOTE (and the `note:gaap` modal that only FY_NOTE triggers; GAAP_NOTE); `placeholder()`;
`PEERS`; `TRIP_CASH`; `A_FCF`. Proposed: D1 `ubIntro` set → fused with #1/#2/OV-F data (approval to drop);
D2 `placeholder` → drop (playbook rule: no placeholder panes); D3 PEERS/TRIP_CASH/A_FCF → drop (unreferenced) or
TRIP_CASH text → note of #39.

---


### B2 — destinos
#### B2 (borrador)

Legend for "How": **keep** = kept as-is inside the destination · **engine** = replaced by the engine /
AMZN version, original text → panel note/collapsible, data → data file · **merge #N** = duplicate, fused
(needs specific approval) · **adapt** = same content reshaped to the playbook format.

| # | Piece | Destination | How |
|---|---|---|---|
| 1 | Key Facts | OV-1 | adapt (AMZN `stdKeyFacts`; neutral palette; mcap fallback dated) |
| 2 | Lede | OV-2 | keep |
| 3 | 2×2 quadrant | OV-3 | adapt (labels navy, no green) |
| 4 | Money map bars | OV-4 | adapt to `gmmBars` grey bars; GB toggle kept |
| 5 | What is X? + Segment economics | OV-4 | adapt (REV_DEFS accordions); econ numbers → from results-data |
| 6 | Products | OV-5 | adapt (AMZN two-tier; emoji icons removed) |
| 7 | Peer scatter | OV-6 | engine (AMZN `stdPeerScatter` on liveQuote; seeded multiples removed, `why` text kept) |
| 8 | Timeline | OV-7 | adapt to §8 OV-7 format |
| 9 | Overview footer | OV-F | adapt (update snapshot/date) |
| 10 | Shared modal | profile infrastructure | keep |
| 11 | Live price strip | — | merge with profile header (playbook §8: no price strip; keep the quote call) — approval |
| 12 | Segments lede | TL-GEN (segov) | text → `overview.lede` / note |
| 13 | GB by segment annual | TL-GEN "How revenue divides" | engine (segments.js stacked bars; GB as a segment series); data → segments-data/uber.js |
| 14 | Adj. EBITDA annual | BL-GEN-1 Profitability & margins | engine (AMZN margins view, EBITDA metric) |
| 15 | Business in Three Parts | TL-GEN segment cards | engine; text → `brief`/`summary` per segment |
| 16 | Segment pills | TL-SEG (segdrv) segment pills | engine |
| 17 | Mobility lede | TL-SEG ▸ Mobility "What it is" | text → `summary` |
| 18 | Barbell diagram | TL-SEG ▸ Mobility | keep (as segment highlight/interaction block) |
| 19 | AV — Partner or Threat? | TL-SEG ▸ Mobility (alt: MISC-comp) | keep |
| 20 | Regulation & driver classification | Misc ▸ Regulation (regulator-specific, §15b) | keep |
| 21 | Delivery hero | TL-SEG ▸ Delivery | text → `summary`/highlights |
| 22 | Margin convergence chart | BL-SEG (segments) profit by segment | engine (segment EBITDA ÷ GB as margin line); text → note |
| 23 | Grocery & Advertising | TL-SEG ▸ Delivery (products/KPIs) | keep |
| 24 | Merchant Network | TL-CUS (segcus) | adapt (SPLC customers via `load_splc.py`; cards kept) |
| 25 | Freight pane | TL-SEG ▸ Freight | engine (KPIs/summary); callout → `kpiNote` |
| 26 | Customers lede + Uber One tiles | TL-CUS | text → section lede; tiles kept |
| 27 | Uber One members chart | TL-SEG KPIs (Mobility+Delivery cross-segment) or TL-CUS | engine KPI series (`kpis[]`), if not → keep in TL-CUS |
| 28 | Priced to the Planet | TL-CUS | keep |
| 29 | Member economics | TL-CUS | keep |
| 30 | Cross-Sell Flywheel | TL-CUS | merge with #71 "Flywheel" card text → one note (approval) |
| 31 | Non-members | TL-CUS | keep |
| 32 | Advertisers | TL-CUS | keep |
| 33 | Platform Expansion | TL-SEG ▸ Mobility products (U4B) / Delivery | adapt into `products[]` |
| 34 | TAM tiles | TL-GEN (segov) collapsible, or Misc ▸ TAM | keep (analyst decides; no TAM slot in spine) |
| 35 | Runway bars | same as #34 | keep |
| 36 | TAM text + callout | same as #34 | keep |
| 37 | Arena map | Misc ▸ MISC-comp Competitive position | keep (fits "quality of business" sub-tab) |
| 38 | Rival map | Misc ▸ MISC-comp | keep; PEER_NOTE → lede |
| 39 | $10 trip | BL-SEG ▸ Segment deep dives ▸ Mobility (cost structure) | keep; TRIP_CASH text → note |
| 40 | Delivery order | BL-SEG ▸ Segment deep dives ▸ Delivery | keep |
| 41 | Take-rate chart | TL-SEG KPIs (take rate = revenue ÷ GB via `derived`) | engine; UK modal → `kpiNote` |
| 42 | Driver & courier base | BL-SPLC (supplychain) "limitation first" lede | text → lede |
| 43 | Vendor layer | BL-SPLC | adapt (KPIs + supplier cards + `.rs-ft` table; SPLC as-of) |
| 44 | Insurance hero/primer/machine | Misc ▸ Insurance (Aleka) | keep |
| 45 | Money-flow SVG | Misc ▸ Insurance | keep |
| 46 | Role flipped | Misc ▸ Insurance | keep |
| 47 | Reserve build bars | Misc ▸ Insurance | keep |
| 48 | Op-income bars | BL-GEN-1 (GAAP operating income) | merge with BL-GEN chart (data identical in results/BBG) — approval |
| 49 | Bull/bear cash | Misc ▸ Insurance | keep |
| 50 | Smaller slice | Misc ▸ Insurance | keep |
| 51 | Uber vs Lyft insurance | Misc ▸ Insurance | keep |
| 52 | Margins chart | BL-GEN-1 | engine (AMZN `aMarginsBody` on uber-bbg + results-data); fallback numbers → data file; note text kept |
| 53 | IR/EDGAR banner + intro | — | removed per §12 EV-SET SAB rule (META) — approval |
| 54 | Phase tabs + pills | EV Earnings | adapt to Setup · Post-Results · Notes |
| 55 | Setup grid | EV-SET | engine (re-extract `ce*` from amzn/tsm-ce into `uber-ce.js` + `uber-ce-data.js`) |
| 56 | Summit vs Street differ | EV-SET | keep |
| 57 | Setup chart | EV-SET | keep (engine; move to `results-data/uber-setup.js` single `setup` section) |
| 58 | Watch List | EV-NOTES (below theme record, if it holds saved rows) | keep (engine) |
| 59 | Theme record | EV-NOTES | engine; UB_THEMES → `js/themes-data/uber.js` + THEME_SRC in segments.js |
| 60 | Print scorecard | EV-POST | keep |
| 61 | Call summary "the minute" | EV-POST Call Summary (prepared + Q&A verbatim) | replaced; old prose → Notes seed (approval: playbook bans AI summary) |
| 62 | Thesis red-lines | EV-NOTES | text → Notes entries (playbook bans red-lines in Post-Results) |
| 63 | What this tees up | EV-NOTES (open hooks) | text → Notes entries (emoji stripped) |
| 64 | Also on the call | EV-POST | keep |
| 65 | Results | EV-RES | keep (engine; dataset needs 3Q26 when printed) |
| 66 | Estimates | EV-EST | keep (engine) |
| 67 | Model vs Reality | EV-RES (Summit series + surprise scorecard) | merge with #65 (same back-test, older snapshot) — text → Results note |
| 68 | Guidance vs reality | EV-RES (guideLo/guideHi band) | merge with #65 — table text → note |
| 69 | 3-Year Targets | MG-TRACK (management vs its own targets) | keep |
| 70 | Turnaround hero | MG-TRACK | merge with #93 CEO turnaround callout (approval) |
| 71 | What Truly Drives Uber cards | TL-SEG interactions/highlights (Flywheel, Uber One, Barbell, Ads); "Cash Machine" → BL-GEN note | adapt (cards split by topic) |
| 72 | History & Milestones | OV-7 | merge #8 (same TIMELINE const) |
| 73 | M&A | Misc ▸ M&A (`manda`, as AMZN) | keep |
| 74 | DH deal snapshot | Misc ▸ M&A ▸ Delivery Hero (or own Misc sub-tab `dhacq`) | keep |
| 75 | DH at a glance | same | keep |
| 76 | DH world map | same | keep |
| 77 | Combined scale | same | keep |
| 78 | DH KPIs | same | keep |
| 79 | DH Uber One opportunity | same | keep |
| 80 | DH timeline | same | keep |
| 81 | Germany | same | keep |
| 82 | Advisors | same | keep |
| 83 | Scenario calculator | VA-SENS (sensitivity) | engine (AMZN `amzn-sensitivity.js` on a frozen Summit snapshot); segment hints → slider hints |
| 84 | Peers table | VA-PEERS | engine (live multiples); "The read" column kept; seeded multiples removed |
| 85 | Analyst Ratings | Pillars ▸ Valuation (restore Pillars tab: `absorbsPillars:false`) | keep (engine) |
| 86 | Capital Allocation | MG-TRACK (capital-allocation record) + SBC part → MG-GOV | keep; SBC text merge #92 |
| 87 | Balance Sheet table/KPIs | VA-TM / VA-SENS EV→equity bridge (net debt) + Misc ▸ Insurance & balance sheet | keep (net-debt inputs feed bridge; WIP banner resolved or kept) |
| 88 | Equity-stake chart | Misc ▸ Insurance & balance sheet (or BL-GEN "Operating income → net income" note on stake gains) | keep |
| 89 | Executives & Board | MG-TEAM | keep (engine; data → `uber-mgmt-data.js`; fix stale foot) |
| 90 | Ownership live | Pillars ▸ Management + MG-OWN new (insiders table + top holders HDS) | keep |
| 91 | Governance tiles | MG-GOV | merge with UBER_MGMT.gov tiles (#89 duplicates 3 of 4) |
| 92 | SBC chart | MG-GOV | keep |
| 93 | Track Record | MG-TRACK | keep |
| 94 | Summit series 2026-05-07 | results-data/uber.js / segments-data/uber.js `summit:{}` | data → data file (refresh to latest snapshot) |
| 95 | Results dataset | EV-RES-DATA | keep |
| 96 | Earnings data | `uber-ce-data.js` | move (CE_CONS built at load from uberResults per SN pattern) |

Reconciliation check for B3: 96 original = (kept + engine + adapt) + merges. Merges proposed (need specific
approval): #11, #30, #48, #53, #67, #68, #70, #72, #91 (and partial #86 SBC text).

---


## 6. Bloqueos y preguntas abiertas

| Desde | Unidad | Qué falta | Quién lo consigue | Estado |
|---|---|---|---|---|
| 2026-11-03 | VA-TM / VA-SENS | ~~Arreglo pendiente en el DCF~~ → **no era error**: el PT = múltiplo × métrica FY2027 **+ el flujo de FY2026** (P/E: 22 × EPS $4.89 = $107.61 + FCFE/acción $5.69 = $113.29; EV/EBITDA: 14 × EBITDA = $222.5B + PV FCF $11.7B − deuda neta $5.3B → $107.58). Hipótesis de SAB, confirmada en `DCF UBER.xlsm` ▸ Discounted Cash Flow (P75–P80, I85–I95); notas de Target Multiple y Sensitivity corregidas | SAB | cerrado 2026-11-03 |
| 2026-11-03 | EV-RES-DATA | `opinc.act` y `eps.act` vs filings → **corregido**: fuente = 8-K 12-ene-2026 (acc. 0001543151-26-000005, recast 1T24–3T25) + comunicados 4T25/1T26/2T26. opinc 2T24–4T24 → 1,025/1,146/1,318, FY2024 → 4,310; antes de 1T24 el dataset traía utilidad de operación GAAP (otra base) → en blanco; Street de opinc solo desde 4T25/FY2026 (antes Bloomberg estimaba otra medida). EPS no-GAAP: 1T24–3T24 y 1T25 ajustados 1–2 centavos; FY2024 1.82, FY2025 2.45 (peers: Uber epsT 2.45) | Claude | cerrado 2026-11-03 |
| 2026-11-03 | VA-SUB | Submit History abre en P/E (un solo punto); ¿UBER debería abrir en EV/EBITDA? (requiere tocar submits.js) | SAB | abierto |
| 2026-11-03 | TL-* | citas del 10-K del borrador de DOAA351 sin cotejar palabra por palabra | Claude | abierto |
| 2026-11-03 | EV-POST | sin transcripción del 2T26 en docs/calls (Call Summary textual vacío en 2T26/1T26) | Claude (stockanalysis.com / IR) | 3T26 cerrado (2026-11-04): Q&A de 9 preguntas desde la transcripción de stockanalysis.com, 56/56 citas verificadas; transcripciones 2T26 y 3T26 ya en docs/calls (1T26 rotado a UBER.md). Sigue abierto: Q&A textual de 2T26/1T26 en el portal |
| 2026-11-04 | OV-6 (#7) | texto `why` original de los peers quedó solo en `UB_PEERS` (uber.js), no en pantalla; el mapa vivo usa redacción nueva | SAB | abierto |
| 2026-11-04 | EV-NOTES (#61–#63) | resumen viejo, red-lines y "what this tees up" del 1T26/2T26 siguen como datos en uber-ce-data.js; no están en la semilla de Notes | SAB | abierto |
| 2026-11-04 | TL-SEG / BL-GEN (#71) | dos tarjetas de "What Truly Drives Uber" sin lugar en pantalla: "near-100%-margin business inside Delivery" y "Cash Machine" | SAB | abierto |
| 2026-11-04 | VA-SENS (#83) | las pistas por segmento de la calculadora vieja (take rate y crecimiento históricos) no pasaron a los sliders | SAB | abierto |
| 2026-11-04 | VA-PEERS (#84) | columna "The read" de la tabla vieja de peers no está en el pane vivo | SAB | abierto |
| 2026-11-04 | Motor de Results | ids repetidos rsVintNote, rsBlocks, rsConvHost, rsViewNote (el motor se monta 3 veces: Setup, Results, Estimates); es del motor compartido | SAB | abierto |
| 2026-11-04 | F-FINAL | duplicados visibles que quedan del modo B: TIMELINE también en Misc ▸ M&A (#72), franja de precio vieja en el plegable de Segments (#11), barras de op. income viejas junto a BL-GEN (#48); 21 `<style>` en línea de los panes conservados | SAB | abierto |
| 2026-11-04 | VA-TM / VA-SUB | arreglo en el DCF: en el submit del 2026-11-04 (año objetivo FY2028, a dos años) los dos precios objetivo se leyeron de Q49/Q80 (152.04 EV/EBITDA, 154.36 P/E); los correctos son P49/P80 (150.16 / 155.08), que es lo que muestra el portal con nota `fix`. PT÷FV = 1.025 / 1.026 | SAB | abierto |
| 2026-11-04 | F0-SM | arreglo en el DCF: las filas de consenso Bloomberg guardadas en el modelo están un año corridas (la celda FY2026 trae el FY2027 de la calle: revenue 66,602, EBITDA 13,779); el portal toma la calle del archivo BBG, no de esas filas | SAB | abierto |
| 2026-11-04 | F0-SM | el snapshot 2026-08-05 del MCP fue reprocesado y ya no coincide con lo congelado en agosto (4T26 revenue 16,025 vs 16,574; EPS FY2026 3.557 vs 3.681; EBITDA/FCF trimestrales ya no en 0); los guardados 2026-05-07 y 2026-07-31 ya no aparecen. Lo congelado se dejó igual | SAB / Oscar | abierto |
| 2026-11-04 | F0-SM | revisión del DCF: Freight GB y revenue planos en 7,214 para FY2027–30 (sus propios trimestres 2027 suman 12,742); Uber One FY2027 anual 88.5 vs 73.3 en el 4T; FCF anual duplicado (DEFAULT 11,268 vs build-up 10,598 en FY2026); siguen en 0 GAAP net income, acciones diluidas trimestrales y GAAP op income anual; op income y EPS FY2026 ≈5.5% sobre 1T–3T reales + 4T modelo | SAB | abierto |
| 2026-11-04 | EV-POST | 10-Q del 3T26 aún no en EDGAR (4-nov tarde): cotejar D&A, SBC, acciones y Uber One cuando salga | Claude | abierto |

### EV-NOTES — cifras de las notas de SAB que no se leyeron con seguridad (UBER.pdf)

1. p1 (Q3 2022): GB "Exp. 30 billion": unclear whether this is the quarter or the guide (not used as a note).
2. p1 (Q3 2022): GB mix percentages are overwritten (45%/47% mobility/delivery?), so they were not used.
3. p1 (Q3 2022): "Mobility take rate had a benefit of 7.7%" and "delivery … 9%" are unclear, so not used.
4. p1 (Q3 2022): "DOJ citation … California passed w/58%": probably the DOL contractor rule and Prop 22 (58%). Wording unclear.
5. p1 (top): an unlabelled 2-line fragment ("US comeback to margins, cont 23 / work to do in 23") with no quarter, not used.
6. p3 (Q2 2023): Adj EBITDA "up 552M" and margin "up from 1.3%" (prior-year figures) are faint.
7. p6 (Feb 2024 Investor Update): "89% of countries (top 10) profitable", first digit unclear. Not used.
8. p6: "Adj EBITDA to FCF, margin high 30s to 40%" seems to repeat the EBITDA CAGR. Not used as a margin.
9. p6/p8: "<10% of airports penetrated" is legible but seems low against p23 (airports 15% of mobility GB). Check meaning.
10. p8: page dated 14/FEB/25, content is the Feb 2024 Investor Update. Filed under Q4 2023.
11. p9 (Q2 2024): "Ad spend more than tripled YoY": may be advertisers or ad revenue. Check.
12. p12/p14: name of Uber's fleet system written "ERD" / "ERP". Unclear.
13. p12 (Barclays): "Uber One available in under low 20 countries": wording unclear. Not used.
14. p12 (Barclays): "Delivery has 4 consecutive Qs @ 1?% growth", second digit illegible.
15. p12 (Barclays): "Goal for them is to lower their take rate": unclear whose take rate (Uber's or partners').
16. p16 (Q1 2025): parentheticals "(13%)" after mobility and "(15%)" after delivery GB are unclear, possibly reported (non-cc) growth.
17. p16: "penetration continues to increase to 60%", base not written (likely delivery GB).
18. p16: Q2 2025 range is labelled "Revenue" but $45.75–47.25B matches the GB guide. Filed as GB.
19. p18 (Q2 2025): Q3 GB written "$49.75–$48.25b" and Adj EBITDA "$2.29–2.19b", both reversed. Filed as $48.25–49.75B / $2.19–2.29B.
20. p21 (Q3 2025): California coverage "$1M → $600K individual & $300K per accident" vs p22 (UBS) "$1M → $300K". Check split.
21. p21: "members have 3x consumption & 35 higher retention", unit missing (35%?).
22. p22 (UBS): growth formula "17% × 4% × Δprice = 22%": price term left blank.
23. p23 (Q4 2025): "UberX ~35% of mobility GB" vs p21 "UberX is 2/3 of trips". Check, not used as a note.
24. p24: Morgan Stanley conference date "2?/MAR/2026", day unclear.
25. p25 (Nvidia GTC): "1?M cars built each year": second digit unclear (18M?). Not used.
26. p26 (Q1 2026): Blacklane "generates $5bn in annual GB" looks high for Blacklane; may be $0.5B. Check.
27. p26: revenue hit from the UK change "$1B (8% headwind)" is legible but check the exact amount.
28. p28 (Bernstein): Delivery Hero average cost "low 30s", currency/unit not written (€ per share?).
29. p29 (DH M&A): offer written "€41.50" (first character ambiguous); "$14.8B ($13.7B w/ previous stock)" and pro-forma GB "$2866" (~$286B?) are unclear.
30. p30 (Q2 2026): "Take rate decline of 500bp → 400bp from UK → $1.13 revenue impact": the $ figure is probably $1.1B, and which take rate is meant (mobility or total) is not written.
31. p19 / p32: both GS Communacopia pages are undated, so Sep 2025 / Sep 2026 is assumed from page order.

31 items.


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
### 2026-11-03 · F0 + F0-SM — APROBADAS
- Qué se mostró: inventario de datos (§1) y mapa Summit (§1b, `js/summit-map/uber.js`).
- Fuentes: MCP Summit (`list_snapshots`, `list_metrics`, `get_fundamentals` 2T26/FY25, `get_valuation_history`); `inspect_matrix.py UBER`.
- Autoauditoría: toda etiqueta de `list_metrics` en el mapa ✔ · core/segment con cuadre o duda ✔ · valuación revisada (PT÷FV 1.060/1.064) ✔ · sin números en el archivo ✔.
### 2026-11-03 · B1 + B2 — APROBADAS
- Qué se mostró: 96 piezas con destino; 9 fusiones; Misc con 5 sub-tabs (comp, insurance, regulation, M&A/DH, TAM).
- Nota: B1 se contó leyendo el código; el conteo en pantalla se hace en el cierre (B3).
### 2026-11-04 · Q&A 3T26 + notas de SAB + submit Summit 2026-11-04 (feat/uber-3q26-call-submit)
- Call Summary 3T26: 9 preguntas del Q&A desde la transcripción (stockanalysis.com; Uber solo publicó prepared remarks), 56/56 citas verificadas por script; "Also on the call" (salida de Jill Hazelbaker a OpenAI; agentes de IA: 4 viajes y ~500 pedidos en la semana de Halloween); Propose Notes 7 → 15.
- Notes: semilla v3 con las notas a mano de SAB del 3T26 ("UBER (1).pdf", 2 págs.) en 19 sub-temas + uno nuevo (Costs & capital ▸ Acquisitions & integration); cotejadas con release, prepared remarks y transcripción (€4.5B de bonos, no $; "$2T food TAM" fuera). Se conservó la única nota del equipo que la copia de Supabase tenía y la v2 no (Freight, Q4 2026). El portal reemplazó la copia guardada (31 hilos).
- docs/calls: 3T26 en UBER-latest.md; 1T26 y 2T26 rotados a UBER.md.
- Submit Summit 2026-11-04 cargado: Results/Estimates (vintage 6), Submit History, Target Multiple (FY2028), Sensitivity (base), Bottom Line (bloque Summit), Segments (nota), Options (Derivatives), mapa Summit, Setup 4T26 (SUMMIT_EXTRA 4T26/1T27). Problemas del DCF en §6.

### 2026-11-04 · EV-POST 3T26 + F-FINAL — APROBADAS (SAB pidió PR y merge)
- EV-POST: print del 8-K del 4-nov, notas por línea, Call Summary con 46 citas verificadas contra las prepared remarks, Setup 4T26 abierto; Street al archivo BBG del 3-nov.
- F-FINAL: recorrido de las 24 sub-pestañas sin errores ni NaN; B3 sin faltantes (7 parciales en §6); código muerto fuera; estilos legados a css/overview.css; citas del 10-K de Top Line cotejadas (Mobility y Freight sin "…", tabla geográfica, frase por país inexistente → la oración real de la Nota 13).

### AAAA-MM-DD · <ID> <Nombre> — <APROBADA | CAMBIOS | OMITIDA>
- Qué se mostró:
- Fuentes:
- Autoauditoría:
- Cambios pedidos / decisiones:
### 2026-11-03 · F1 Esqueleto — APROBADA
- Qué se mostró: Deep Dive con la espina de AMZN + Misc (comp · insurance · M&A/DH · TAM); `.ov-uber-dd` en `css/selectors.css`; `absorbsPillars` quitado (Ratings vuelve a Pillars).
- Autoauditoría (harness interno, rAF shim): 18 sub-tabs pintan, 0 errores de consola.
### 2026-11-03 · EV-RES-DATA — APROBADA
- Qué se mostró: cuadre de 3 periodos vs comunicado (ingreso 3T25, GB 1T24, EBITDA 2T26) y ΣQ vs anual 2026 por fuente.
- Fuentes: `BBG_CONSENSUS.txt` + `Consensus_Portal.xlsm` (30 snapshots); Summit 2026-08-05 (sin cambio); guía de los comunicados.
- Nota técnica: `scripts/consensus/apply_matrix.py` se come el bloque `evolution` cuando un comentario del bloque viejo trae un apóstrofe (su `match_brace` no salta comentarios); el empalme se hizo a mano. Arreglo del script → PR aparte.
### 2026-11-03 · EV-SET Setup — APROBADA
- Qué se mostró: Setup del Q3 2026 (upcoming, Wed Nov 4 2026): 9 headline + 16 custom; Consensus / Summit / Both; notas de guía (GB $58.25–60.25B, Adj. EBITDA $2.86–2.96B, Non-GAAP EPS $0.84–0.88).
- Fuentes: `BBG_CONSENSUS.txt` (snapshot 2026-09-10) vía `scripts/consensus/emit_ce_uber.py` + `map_uber_ce.json`; Summit 2026-08-05 leído de `results-data/uber.js` (`ceSummitUs`); comunicado 2T26.
- Movido sin borrar: `CALL_EARNINGS` y los bloques `UB_Q1/Q2_2026_*` de `uber.js` → `uber-ce-data.js`; `UB_THEMES` → `js/themes-data/uber.js` (con `seg` y `st`). La maquinaria vieja `ce*` de `uber.js` queda sin uso hasta F-FINAL.
- CSS: `.ov-uber-dd` agregado a los selectores de `css/overview.css` que ya cubrían `.ov-googl-dd`.
- Autoauditoría: 0 errores · pastillas Q3/Q2/Q1 · Post-Results del Q2 2026 puntúa el print · ✘ Summit vacío en 5 líneas headline (GP, CFO, capex, D&A, acciones: no están en Results) — aceptado tal cual.
### 2026-11-03 · Bloque 2 (OV-1…OV-F, TL-GEN, TL-SEG, TL-OTH, TL-CUS, VA-PEERS) — APROBADO (en bloque, decisión de SAB)
- Qué se mostró: Overview en `uber-ov.js` (copia de googl.js) + `uber-ov-data.js`; Top Line en `segments.js` con `segments-data/uber.js` (rescatado de DOAA351 con sus arreglos); Valuation ▸ Peers.
- Fuentes: 10-K FY2025 (acc. 0001543151-26-000015) Nota 13 e Item 1; 10-K/20-F FY2025 de DASH, CART, LYFT, GRAB (XBRL); BBG consenso FY2026 (UBER 2026-09-10, LYFT 2026-09-08); Summit actuals para Freight revenue.
- Excepciones aceptadas: EBITDA trailing (GAAP op. inc. + D&A) vs forward (ajustado BBG) con bases distintas, dicho en el pie; P/E trailing de UBER/LYFT bajo por liberación de reservas fiscales; citas del 10-K del borrador de Dani sin cotejar palabra por palabra (pendiente).
### 2026-11-03 · Bloque 3 (BL-GEN-1…5, BL-SEG, BL-SPLC, VA-HIST, VA-TM, VA-SUB, VA-SENS, MG-TEAM/OWN/GOV/TRACK, EV-NOTES; EV-RES/EV-EST heredadas) — APROBADO (en bloque)
- Qué se mostró: Bottom Line (`uber-bl.js`, `uber-bl-data.js`, `uber-bbg.js`, `uber-splc.js`), Valuation (`uber-histmult*`, `uber-target-multiple*`, `submits-data/uber.js`, `uber-sensitivity*`), Management (`uber-mgmt-data.js`, `uber-own.js`, `uber-gov.js`, `uber-track.js`), Notes (`themes-data/uber.js` v2).
- Fuentes: SEC EDGAR XBRL CIK 1543151 (FY2019–FY2025, 1Q23–2Q26), 10-K FY2025 (Notas 10 y 13), 8-K 12-ene-2026 (recast de Segment Operating Income), comunicados 4T25 y 2T26, DEF 14A 2026, BBG_CONSENSUS.txt (9/10/2026), Summit 2026-08-05 congelado, notas a mano de SAB (UBER.pdf).
- Autoauditoría (harness, rAF shim): 23 sub-tabs pintan, 0 errores. Live market data sin sesión → "Live data pending" (esperado).
- Cambios pedidos: quitar calificaciones de Track Record (hecho).
### 2026-11-03 · MISC (comp, insurance, regulation, manda, tam) — APROBADO
- Qué se mostró: las 5 sub-tabs con el contenido anterior movido; Regulation sacada de Mobility; estilos de los paneles viejos recuperados (`ubLegacyStyle`) sin tocar el Overview.
- Pendiente para F-FINAL: pasar esos estilos a `css/overview.css` y quitar el verde de Uber dentro de estos paneles; borrar el código muerto de `uber.js` (maquinaria `ce*` vieja, Overview viejo, UBER_VAL sin uso).
### 2026-11-03 · Revisión completa en el portal (sesión de SAB) — cambios aprobados
- Recorrido: 24 sub-tabs, 0 errores de consola; en vivo: market cap $136B (Nov 3 2026), precio, múltiplos de peers, Historic Multiple, Fiscal.ai.
- Agregado: Top Line ▸ Other ▸ Gross Bookings (motor segments.js, `results:mobgb/delgb/frgb`, definición del 10-K textual, cotejada en EDGAR) + KPI de GB de Freight. Aprobado.
- Cambiado: P/E de Uber en Peers con EPS no-GAAP. Aprobado.
### 2026-11-03 · EV-RES ▸ KPIs ▸ Uber One Members — APROBADO
- Fuentes: comunicados 8-K Ex. 99.1 (3Q23, 3Q24, 4Q24, 1Q26) y transcripciones en docs/calls (4Q23, 1Q25, 2Q25, 4Q25); Summit 2026-08-05 (`ONE_MEMBERS_USERS`, projection_history, solo 3Q26–1Q27).
- Excepción aceptada: el motor sombrea 2Q26 como forecast porque no hay cifra divulgada (se corrige con el dato del 3T26).
### 2026-11-03 · EV-SET / EV-RES — Street y Summit en todas las líneas (pedido de SAB)
- Setup 3T26: 21 de 25 líneas con las dos columnas. Summit agregado (congelado del MCP, submit 2026-08-05): flujo operativo, capex, D&A, SBC, ingreso de Freight, utilidad operativa de Mobility y Delivery, utilidad operativa GAAP. Street del segundo trimestre adelante = archivo BBG más nuevo.
- Sin Summit, con nota en la línea: utilidad bruta (Uber no la reporta; el modelo no la tiene), utilidad neta GAAP y EPS GAAP (fila en 0), acciones diluidas (fila en 0).
- Results: Freight trimestral y anual, Uber One (trimestral y anual = 4T), FCF anual del modelo y FCF trimestral forward del submit 08-05. Viajes anual sin Summit a propósito (fila anual del modelo rota: FY26 12,260 < FY25 13,567). Sin Street: Uber One (Bloomberg no lo cubre) y EPS no-GAAP forward más allá del 3T26 (el export solo trae EPS GAAP).
