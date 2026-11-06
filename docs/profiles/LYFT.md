# LYFT — bitácora de construcción del perfil

> Copia este archivo a `docs/profiles/<TICKER>.md` en la Fase 0. Reglas: `docs/PROFILE_PLAYBOOK.md` §3.
> Claude la lee completa al empezar cada sesión y la actualiza en cada aprobación (no al final).
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)

| Campo | Valor |
|---|---|
| Empresa | Lyft, Inc. (NASDAQ: LYFT) |
| Modo | B — reordenar existente (`js/overviews/lyft.js`, 4,439 líneas + `js/results-data/lyft.js` y `lyft-setup.js`) |
| Rama | `feat/lyft-profile` (desde `origin/main` @ `e2a30fa`, 2026-11-04; worktree `research-summit-lyft`). Ya existen en GitHub `feat/earnings-rollout-lyft` y `feat/lyft-2q26-results` (no se tocan) |
| Analista responsable | SAB (Santiago Alvarez); la sesión la abre Dani |
| Inicio | 2026-11-04 |
| Avance | 28 de 41 unidades aprobadas; 10 construidas y pendientes de aprobación (🔍: EV-SET/EV-POST/EV-NOTES con el 3T26, BL-SPLC, VA-HIST, VA-TM, VA-SENS, MG-TEAM, MG-GOV, MG-TRACK); 1 omitida ⏭️; por cerrar: MISC y F-FINAL (1 ⬜, 1 ⏸) |

## 1. Inventario de datos (F0)

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | ✔ | LYFT abre hoy; módulo registrado en `js/overviews/index.js` | el perfil abre | — |
| Filing anual (10-K / 20-F) | ✔ verificado en EDGAR 2026-11-04 | 10-K FY2025, acc. **0001628280-26-006960**, presentado 2026-02-11 (CIK 1759509), domestic filer, Nasdaq Global Select. Último 10-Q listado: acc. 0001628280-26-054499 (2026-08-07; periodo 30-jun-2026 probable, no abierto). Notas leídas 2026-11-05 desde los JSON de `G:\My Drive\Summit\Docs\Extras\Team\DAA\Ad hoc info search\LYFT` (10-K FY23/24/25, 10-Q 2T26 acc. 0001628280-26-054499, Prepared Remarks 2T26): **un solo segmento operativo** (Rideshare/Rentals son categorías de ingreso); ingresos FY25 EE.UU. 6,060.2 / Internacional 256.0 de 6,316.3. Falta: transcripción del Q&A del 2T26 y el print del 3T26 (hoy 2026-11-05 tras cierre) | Overview, Top Line, textos verbatim | — |
| Año fiscal / moneda | ✔ | cierre 31 dic · USD (el modelo trae FREENOW en EUR, por revisar) | — | — |
| Summit DCF | ✔ (archivo local; **el MCP no se usa**) | `DCF LYFT.xlsm` en `Research\DCF\Transportation - SAB\LYFT\`, modificado 2026-08-07 (un día después del 2T26). Hojas Projection History / Actuals History (269×182), Segments, SEG_BBG, SOTP, Output. ⚠ la hoja Output trae caché viejo (LFQE "Q4 - 2023", estado "Offline"): no se lee de ahí. # de submits y último periodo real: se leen de Projection History en F0-SM | F0-SM; Summit congelado en Results/Setup, EV-EST, VA-TM, VA-SUB, VA-SENS | si el archivo no tiene ≥2 vintages, EV-EST y VA-SUB ⏭️ |
| Consenso BBG | ✔ | `LYFT US EQUITY`: **30 snapshots, 2019-05-12 → 2026-09-08** (`inspect_matrix.py`). ⚠ el dataset actual (`results-data/lyft.js`) dice que LYFT **no** tiene filas en BBG y su consenso es "compilado a mano por print": está **desactualizado**. Último snapshot 09-08; nada posterior | `estMatrix.cons`, Setup, Bottom Line; reemplaza el consenso a mano | — |
| `get-market-history` (Massive) | ✔ desplegada (confirmado en UBER 2026-11-03) | precio diario | Historic Multiple en vivo | — |
| Valuación del modelo | ◐ | sin MCP: múltiplo/PT/FV salen de Discounted Cash Flow / SOTP del xlsm (como UBER). Se verifica en F0-SM | VA-TM, VA-SUB, VA-SENS | VA-TM/VA-SUB ⏭️ si no se puede leer |
| SPLC | ◐ | el perfil actual tiene `supplySection` / `lySuppliersBody` (por revisar en B1); sin export SPLC conocido en disco | TL-CUS, BL-SPLC | BL-SPLC como UBER: lo divulgado, sin export |
| Transcripciones | ◐ | `docs/calls/LYFT.md` (compendio) + `LYFT-latest.md` = **1T26 (7-may)**. **El 2T26 (6-ago) no está en `docs/calls`**; el 3T26 aún no sale (fecha por confirmar; Lyft reportó el 3T25 el 5-nov) | EV-POST, EV-NOTES, citas | 2T26 sin transcripción verbatim |
| Fiscal.ai (plan) | ✘ | LYFT no está en el plan gratis (solo AMZN, MA, NVDA, UBER, V) | tabla en vivo de Management | MG-OWN sin tabla en vivo: DEF 14A |
| Massive (`liveQuote`) | ✔ | `covered-calls-massive` | market cap, peers | — |
| Fotos / imágenes | ◐ | `img/leadership/lyft-*` por revisar | Management | iniciales |

**Alcance propuesto (pendiente de SAB):** las 45 unidades + B1/B2 son construibles salvo lo marcado ◐; Summit = último submit del xlsm local; consenso = BBG (reemplaza lo compilado a mano).

## 1b. Mapa Summit (F0-SM)

> Reglas: `docs/PROFILE_PLAYBOOK.md` §6.3. Archivo: `js/summit-map/lyft.js` (sin números). **No hay MCP**: las etiquetas salen de las hojas
> `Projection History` y `Actuals History` de `DCF LYFT.xlsm` (copia leída de Drive, guardado 2026-08-07). Las hojas Output / Summary tienen caché
> viejo ("Q4 - 2023", "Offline") y **no se leen**.

Modelo: `DCF LYFT.xlsm` · USD · millones · **4 submits distintos**: 2025-12-15 (después de 3T25) · 2026-02-11 (4T25) · 2026-05-08 (1T26) ·
**2026-08-07 (2T26)** (el 08-07 está guardado dos veces, ID 4 y 5, con 2 segundos de diferencia: es el mismo estado) · 49 filas con código
(43 códigos únicos; OP_INCOME, DNA, FCF, CFO, CAPEX y CFO_INSURANCE_RESERVES aparecen dos veces con valores distintos) ·
**43 códigos únicos: 12 core · 3 segment · 11 línea de costo/SBC · 9 kpi · 4 guidance · 4 consensus · 0 ignore** ·
Reales: `Actuals History` trae **hasta 2T26** (Rev 1,843.5 · Adj. EBITDA 177.2 · GB 5,504.2) — **verificado 2026-11-05**: Rev 1,843.5 contra 10-Q (1,843,544 miles); GB 5.5B (+23%), Adj. EBITDA 177 (+37%), 262M rides y 30.5M riders contra Prepared Remarks. La guía 3T26 (GB 5.50–5.67B, EBITDA 183–203) **no está en el modelo** (columna 3T26 de guía en 0); el modelo trae la guía de 2T26 (GB 5,300–5,430 · EBITDA 160–180)
(el comunicado no está en `docs/calls`). Valuación del modelo: **solo EV / EBITDA** en los 4 submits, `target_year` 2027 Forward:

| Submit | Después de | Múltiplo | Price target | Fair value | Precio ese día | FV ÷ precio − 1 |
|---|---|---|---|---|---|---|
| 2025-12-15 | 3T25 | 9.0× | $32.01 | $31.96 | $18.85 | +69.5% |
| 2026-02-11 | 4T25 | 8.0× | $28.21 | $23.03 | $13.99 | +64.6% |
| 2026-05-08 | 1T26 | 5.0× | $18.73 | $16.47 | $14.37 | +14.6% |
| 2026-08-07 | 2T26 | 7.0× | $23.76 | $22.00 | $17.11 | +28.6% |

(Cálculo propio de la última columna: FV ÷ precio − 1; la hoja trae PT, FV y precio, no el upside.)

Cuadre — **vía el dataset de Results/Customers existente (que viene de los 8-K)**; el cuadre directo contra 10-K/8-K queda pendiente:

| Etiqueta (código en el xlsm) | Rol | Clave portal | Qué es | Base | Unidad real | Agregación | Cuadre | Confianza |
|---|---|---|---|---|---|---|---|---|
| `REV` | core | `rev` | Ingreso | GAAP | USD M | suma | FY25 6,316.3 ✔ · 1T26 1,650.5 ✔ | ✔ (2T26 1,843.5 sin 8-K) |
| `SEGM_REVENUE` | segment | `seg_rev` | Ingreso del bloque de segmento | — | USD M | suma | FY25 6,484.3 ≠ REV 6,316.3 | ❓ (duda 1) |
| `GB_REVENUE` · `RENTALS_REVENUE` | segment | `seg.rideshare.rev` · `seg.rentals.rev` | Ingreso Rideshare/plataforma · Rentals | — | USD M | suma | FY25 6,063.4 + 420.9 = 6,484.3 | ❓ (duda 1); Rentals en 0 en 2T26 real |
| `EBITDA` | core | `ebitda` | EBITDA ajustado (lado core) | ajustada | USD M | suma | FY25 528.9 ✔ · 1T26 132.8 ✔ | ⚠ FY26: 718.8 vs ADJ_EBITDA 706.4 (duda 3) |
| `ADJ_EBITDA` | segment | `ebitda_adj` | EBITDA ajustado (base de la guía) | ajustada | USD M | suma | FY25 528.9 ✔ | ⚠ ídem |
| `OP_INCOME` (core) | core | `opinc_core` | Utilidad operativa | ¿GAAP? | USD M | suma | FY25 = 0 · FY26/27 = 0 · trimestres sí traen valor | ❓ (duda 2) |
| `OP_INCOME` (bloque costos) | segment | `opinc` | Utilidad operativa | GAAP | USD M | suma | FY25 23.3 (sin cotejar) · 1T26 −5.3 | ❓ (duda 2) |
| `EARNINGS` | core | `earnings` | Utilidad neta GAAP | GAAP | USD M | suma | FY25 134.6 (sin cotejar); trimestres en 0 | ⚠ solo anual |
| `SHARES` | core | `shares` | Acciones diluidas | diluidas | acciones M | fin de periodo | FY25 417.7; FY26 359.2 | ❓ (duda 4) |
| `DNA` (core y bloque) | core | `dna` | D&A | GAAP | USD M | suma | 135.227 vs 135.262 | ⚠ dos valores casi iguales |
| `INT_INC` · `INT_EXP` · `TAX_RATE` | core | ídem | Intereses y tasa | modelo | USD M · % | suma · promedio | INT_INC en 0 siempre; TAX_RATE 0.15 → 0.05 | ❓ (duda 5) |
| `CFO` (core y bloque) | core | `cfo` | Flujo operativo | GAAP | USD M | suma | FY25 1,168.4 vs 1,168.4 ✔ | ✔ |
| `CAPEX` (core y bloque) | core | `capex` | Capex | GAAP | USD M | suma | FY25 −52.8 (core) vs −80.1 (bloque) | ❓ (duda 6) |
| `FCF` (core y bloque) | core | `fcf` | Flujo libre | empresa | USD M | suma | FY25 1,115.6 (core; coincide con el "+$1.12B" del perfil) vs 1,088.3 (bloque) | ❓ (duda 6) |
| `GROSS_BOOKINGS` | kpi | `gb` | Gross Bookings | empresa | USD M | suma | FY25 18,507.1 ✔ · 1T26 4,946.0 ✔ | ✔ |
| `RIDES` | kpi | `rides` | Viajes | empresa | M | suma | FY25 945.5 ✔ · 1T26 236.9 ✔ | ✔ |
| `RIDERS_ACTIVE` | kpi | `riders` | Pasajeros activos | empresa | M | fin de periodo | FY25 29.2 ✔ · 1T26 28.3 ✔ | ✔ |
| `RIDES_PER_USER` · `GB_PER_RIDE` | kpi | `rides_per_user` · `gb_per_ride` | Derivadas del modelo | modelo | viajes · USD | promedio | FY25 2.78 · 20.84 | ⚠ derivadas |
| `COGS` · `OPERATION_SUPPORT_OPEX` · `RND_OPEX` · `SNM_OPEX` · `GNA_OPEX` | segment (línea de costo) | `cost.*` | Costos GAAP por línea | GAAP | USD M | suma | COGS 1T26 864.1 ✔ | ✔ (resto sin cotejar) |
| `SBC_COGS` · `SBC_ONS` · `SBC_RND` · `SBC_SNM` · `SBC_GNA` | segment (línea de costo) | `sbc.*` | SBC por función | GAAP | USD M | suma | FY25 suma 322.3 (sin cotejar) | ⚠ |
| `CFO_ADJ_EBITDA` · `CFO_INSURANCE_RESERVES` (x2) · `CFO_ACCRUED_LIAB` · `INSURANCE_RESERVES` | kpi | `cfo_ebitda` · `cfo_ins` · `cfo_ins_ind` · `ins_reserves` | Puente del flujo y reservas de seguro (modelo) | modelo | USD M | suma · fin | reservas 2,180.4 (FY25); 2,307.7 (2T26) | ⚠ construcciones del modelo |
| `GB_GUIDANCE_LOW/HIGH` · `ADJ_EBITDA_GUIDANCE_LOW/HIGH` | guidance | `guide.*` | Guía de Lyft | — | USD M | — | 1T26 4,860–5,000 y 120–140; 2T26 5,300–5,430 y 160–180 (cuadran con el dataset); **3T26 5,500–5,670 y 183–203 sin 8-K** | ⚠ 3T26 pendiente de 8-K |
| `REV/EBITDA/SHARES/EARNINGS_BBG_EST` | consensus | — | BBG anual dentro del modelo | — | — | — | — | se usa `BBG_CONSENSUS.txt`, no esto |

### Dudas

```
❓ LYFT · 1 · SEGM_REVENUE vs REV (FY2025: 6,484.3 vs 6,316.3)
   Lo que se ve: SEGM_REVENUE = GB_REVENUE + RENTALS_REVENUE = 6,484.3, pero el ingreso reportado y REV dan 6,316.3 (el dataset de Results también).
   Quién responde: autor del modelo / Claude con el 10-K.   Mientras tanto: ingreso por segmento no se usa; Top Line ▸ Segments solo con GB, rides, riders.
❓ LYFT · 2 · OP_INCOME core en 0 (FY25, FY26, FY27); el del bloque de costos trae 23.3 / 198.6 / 509.4
   Quién responde: autor del modelo (SAB).   Mientras tanto: no se usa el core; en Bottom Line solo EBITDA y la cascada de costos.
❓ LYFT · 3 · EBITDA vs ADJ_EBITDA (FY26 718.8 vs 706.4; FY27 959.0 en ambas)
   Quién responde: autor del modelo.   Mientras tanto: Summit de EBITDA = ADJ_EBITDA (es la base de la guía); se anota en el pie.
❓ LYFT · 4 · SHARES FY25 417.7 → FY26 359.2 (−14%)
   Lo que se ve: BBG estima 396.8; recompras no alcanzan para explicar el salto.   Mientras tanto: sin EPS de Summit; no se usa en Sensitivity.
❓ LYFT · 5 · INT_INC en 0 siempre; TAX_RATE 0.15 (FY25) → 0.05 (FY26+); trimestres en 0.   Mientras tanto: no se usan.
❓ LYFT · 6 · FCF/CAPEX con dos definiciones (core: 1,115.6 y −52.8; bloque: 1,088.3 y −80.1 en FY25)
   Quién responde: autor del modelo.   Mientras tanto: se usa el core FCF (coincide con el +$1.12B del perfil actual); se dice en el pie.
❓ LYFT · valuación — solo EV / EBITDA en los 4 submits (el playbook del 14-oct decía "P/E copia EV/EBITDA": ya no hay P/E en el archivo).
   Lo lógico: PT ÷ FV varía por submit (1.002 · 1.225 · 1.137 · 1.080) y no hay un segundo método para la prueba de §6.3; el múltiplo saltó 5.0× → 7.0× entre 05-08 y 08-07.
   Quién responde: autor del modelo.   Mientras tanto: VA-TM y VA-SENS con EV/EBITDA 7.0× 2027 Fwd rotulado "PT/FV sin prueba cruzada".
```

### Cambios del mapa

- 2026-11-04 · mapa inicial desde el xlsm local (sin MCP) — 2 filas de guardado idéntico el 08-07 tratadas como una.

## 2. Tablero de unidades

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | ✅ | 2026-11-04 | SAB | | Summit = DCF LYFT.xlsm local (7-ago); BBG 30 snapshots (último 09-08) |
| B1 | Inventario de contenido existente | ✅ | 2026-11-04 | SAB | | borrador de código; falta contar en el portal |
| B2 | Mapa de reubicación | ✅ | 2026-11-04 | SAB | | borrador; Strategy sin hogar en el esqueleto: propuesta MISC-strategy |
| F0-SM | Mapa de métricas Summit | ✅ | 2026-11-04 | SAB | | desde xlsm local; 49 filas / 43 códigos; 6 dudas + valuación |
| F1 | Esqueleto + vista previa | ✅ | 2026-11-04 | SAB | | 6 secciones; paneles enteros en su destino B2; absorbsPillars quitado (Pillars vuelve con Ratings); Ownership, General/Other de Top Line, Historic Multiple, Target Multiple y Submit History llegan con su unidad |
| OV-1 | Overview ▸ Key Facts | ✅ | 2026-11-04 | SAB | | 10 celdas; verificado 10-K: HQ, Delaware, 3,913 empleados, dividendo; Founded/IPO/CEO verificados 2026-11-05 en 10-K (ver §4); market cap solo en vivo |
| OV-2 | Overview ▸ Descripción | ✅ | 2026-11-05 | SAB | | 68 palabras, 3 oraciones, sin cifras; fuente 10-K FY25 Item 1 (p.5) |
| OV-3 | Overview ▸ Cuadrante 2×2 | ✅ | 2026-11-05 | SAB | | 4 celdas 27/26/25/28 palabras; How it earns con FY25 desde 10-K (6,316.3; ASC 606 5,895.5; ASC 842 420.8) |
| OV-4 | Overview ▸ How it makes money | ✅ | 2026-11-05 | SAB | | Un solo segmento operativo: vista Revenue lines + Region; todo del 10-K FY25 (rev note p.83, estados p.69, MD&A p.51) |
| OV-5 | Overview ▸ Products & platforms | ✅ | 2026-11-05 | SAB | | 8 familias planas, 22 productos; fuentes 10-K FY25 Item 1 + Prepared Remarks 2T26 |
| OV-6 | Overview ▸ Competitors (peer map) | ✅ | 2026-11-04 | | | |
| OV-7 | Overview ▸ Timeline | ✅ | 2026-11-05 | SAB | | 10 hitos en orden cronológico, 8 con Read more; fuentes 10-K FY23/FY25 + Prepared Remarks 2T26 |
| OV-F | Overview ▸ Pie de fuentes | ✅ | 2026-11-05 | SAB | | pie al formato del playbook; desplegables renombrados |
| EV-RES-DATA | Dataset de Results (números) | ✅ | 2026-11-05 | SAB | | BBG pre-print (estMatrix, 30 snapshots), 2T26 real del 10-Q, Summit congelado (4 vintages), guía 3T26; FCF sin consenso |
| EV-RES | Evolution ▸ Results | ✅ | 2026-11-05 | SAB | | revisada por SAB en el portal local; FCF sin chip Consensus a propósito |
| TL-GEN | Top Line ▸ General | ✅ | 2026-11-05 | SAB | | un segmento (10-K Nota 2); revisado por SAB en el portal |
| TL-SEG | Top Line ▸ Segments | ✅ | 2026-11-05 | SAB | | 1 segmento, 3 productos, 5 KPI con definición verbatim, 3 identidades; ⚑ Notes hasta EV-NOTES |
| TL-OTH | Top Line ▸ Other | ✅ | 2026-11-05 | SAB | | 2 cortes anuales FY23–25 (línea contable, geografía) |
| TL-CUS | Top Line ▸ Customers | ✅ | 2026-11-05 | SAB | | sin concentración divulgada; sin SPLC |
| EV-EST | Evolution ▸ Estimates | ✅ | 2026-11-05 | SAB | | 4 snapshots del xlsm (12-15, 02-11, 05-08, 08-07); FY26–FY29; revisado por SAB en el portal |
| EV-SET | Evolution ▸ Earnings ▸ Setup | 🔍 | 2026-11-05 | | | Setup 3T26 congelado (BBG 11-04 + Summit 08-07) y Setup 4T26 nuevo (guía del 3T26; consenso BBG 11-04 anterior al print; Summit 08-07) |
| EV-POST | Evolution ▸ Earnings ▸ Post-Results | 🔍 | 2026-11-05 | | | Post-Results 2T26 (con Q&A de 9 preguntas, transcripción de Dani) y 3T26 (comunicado + Prepared Remarks + transcripción; 10 preguntas); pendiente de aprobación SAB |
| EV-NOTES | Evolution ▸ Earnings ▸ Notes | 🔍 | 2026-11-05 | | | semilla themes-data/lyft.js: 6 hilos, con actualización Q2 2026 y Q3 2026 (5 de 6 ejes) |
| BL-GEN-1 | Bottom Line ▸ General ▸ Profitability & margins | ✅ | 2026-11-05 | SAB | | ported uber-bl.js → lyft-bl.js; BBG + 10-K; en revisión |
| BL-GEN-2 | Bottom Line ▸ General ▸ The bridge | ✅ | 2026-11-05 | SAB | | puente con 5 líneas funcionales; cost structure |
| BL-GEN-3 | Bottom Line ▸ General ▸ Op. income → net income | ✅ | 2026-11-05 | SAB | | normalizado solo quita la liberación de $2.9B |
| BL-GEN-4 | Bottom Line ▸ General ▸ Stock-based compensation | ✅ | 2026-11-05 | SAB | | SBC por función FY21–25 (10-K); acciones Summit no usadas (duda 4) |
| BL-GEN-5 | Bottom Line ▸ General ▸ Expense lines | ✅ | 2026-11-05 | SAB | | 5 pestañas de gasto con MD&A verbatim FY25 y 10-Q 2T26 |
| BL-SEG | Bottom Line ▸ Segments | ⏭️ | 2026-11-05 |  | | Lyft reporta un solo segmento: no hay Segments en Bottom Line |
| BL-SPLC | Bottom Line ▸ Supply Chain | 🔍 | 2026-11-05 | | | decisión de Dani: no se necesita export SPLC; se conserva el contenido anterior, sin reverificar (proveedores/clientes de la versión anterior) |
| VA-HIST | Valuation ▸ Historic Multiple | 🔍 | 2026-11-05 | | | añade el balance del 3T26 (comunicado, no 10-Q) como 5.º punto; decisión de Dani: no hacen falta los 10-Q intermedios — 10-K + último 10-Q alcanzan |
| VA-PEERS | Valuation ▸ Peers | ✅ | 2026-11-05 | SAB | | mismo mapa que OV-6 + tabla; tabla anterior en desplegable |
| VA-TM | Valuation ▸ Target Multiple / PEG | 🔍 | 2026-11-05 | | | construida: 4 submits válidos (EV/EBITDA 9×/8×/5×/7× sobre FY2027), sin pierna P/E (el modelo no la registra); EARNINGS del 11-feb nulo por error de escala; el guardado del 05-nov NO se usa (instrucción de Dani) |
| VA-SUB | Valuation ▸ Submit History | ✅ | 2026-11-05 | SAB | | 4 submits del xlsm; EV/EBITDA; ni/sh/opi en null por las dudas |
| VA-SENS | Valuation ▸ Sensitivity Analysis | 🔍 | 2026-11-05 | | | construida sobre el submit 08-07 con un solo segmento: crecimiento del ingreso, margen de EBITDA aj. (OP_INCOME proyectado = 0, duda 2) y múltiplo; solo EV/EBITDA; calculadora anterior conservada debajo |
| MG-TEAM | Management ▸ Executives & Board | 🔍 | 2026-11-05 | | | consejo = firmantes del 10-K FY25 (8) + Minicucci (call 2T26); CAO Stephen Hope (10-K); CFO Michael Brous (call 3T26). Independencia y comités: del roster anterior, sin reverificar (no hay proxy ni se pedirá) |
| MG-OWN | Management ▸ Ownership | ✅ | 2026-11-05 | SAB | | sin tabla de tenedores (falta DEF 14A); KPIs, clases, recompras y tabla en vivo |
| MG-GOV | Management ▸ Governance & SBC | 🔍 | 2026-11-05 | | | verificado en 10-K/10-Q/comunicado: Clase B 8.531M acciones a 31-dic-24 (~29% del voto, cálculo) y ninguna a 31-dic-25, consejo clasificado, acciones en circulación, recompras. Pago del CEO y razón: del roster anterior, marcados como no reverificados |
| MG-TRACK | Management ▸ Track Record | 🔍 | 2026-11-05 | | | añade Michael Brous (ámbar, sin historial como CFO); Brewer cerrada "hasta el call del 3T26"; calificaciones son juicio del analista, sin cambios |
| MISC | Miscellaneous (una fila `MISC-<clave>` por sub-tab aprobada) | ⬜ | | | | |
| F-FINAL | Cierre y entrega | ⏸ | 2026-11-05 |  | | B3 pendiente de revisión; datos del Overview movidos a lyft-ov-data.js; estilo en línea del Overview retirado; falta limpiar el código viejo de ce* |

(Modo B: agregar B1 — inventario de contenido existente y B2 — mapa de reubicación después de F0.)

> Desde el 15 oct 2026 EV-EST, VA-TM y VA-SENS se construyen con Summit congelado del MCP (regla 10);
> EV-EST necesita ≥ 2 snapshots. Cada `MISC-<clave>` aprobada reemplaza la fila MISC; en MISC siempre se
> proponen `MISC-comp` y, si aplica, `MISC-capacity` (playbook §15b).

## 3. Decisiones del analista

<!-- Solo se agrega. Si una decisión cambia, nueva línea que cita la anterior. -->
- AAAA-MM-DD · <ID> · <decisión> — <por qué> — <quién>

## 4. Excepciones aceptadas

<!-- Cada FAIL de la autoauditoría que el analista decidió dejar. -->
- 2026-11-04 · OV-1 · Founded / IPO / fecha de CEO sin fuente primaria — se acepta por ahora — SAB
  - Resuelto 2026-11-05: Founded 2012 (inc. 2007 como Bounder Web, Zimride 2008) = 10-K FY25 p.10; IPO $72.00, primer día 29-mar-2019 = 10-K FY23 p.53; CEO: "segundo trimestre de 2023" = 10-K FY23 p.34 (el mes exacto no está en fuente; la celda dice Q2 2023)
- AAAA-MM-DD · <ID> · <qué regla> — <por qué se acepta> — <quién>

## 5. Mapa de reubicación (solo modo B)

Conteo de control (piezas): **69 filas** (B1, leído del código de `lyft.js` en `main` @ `e2a30fa`). ⚠ BORRADOR de Claude: conteo y destinos salen de leer el código; **falta abrir LYFT en el portal local y contar lo que se ve** (§4.2 B1) antes de que SAB apruebe. Datos probablemente muertos (constantes SNAPSHOT, DESC, KPIS, AS_OF, FY_NOTE, SEGMENTS, PEERS, TAILWINDS, HEADWINDS, TARGETS, INITIATIVES, GM_*, `lyIntro`, `placeholder()`) se listan aparte y no se cuentan; se confirma en B2 que ninguna función los usa. Destinos nuevos sin pieza original (TL-OTH, VA-HIST, VA-SUB) no son filas.

### B1 — inventario
| # | Pieza | file:función | Sección actual |
|---|---|---|---|
| 1 | Key Facts | `lyft.js:stdKeyFacts (LY_FACTS)` | Overview |
| 2 | Lede | `lyft.js:stdOverviewBody (LY_LEDE)` | Overview |
| 3 | 2×2 quadrant | `lyft.js:stdFourQuad (LY_BIZ)` | Overview |
| 4 | Money map bars (revenue split) | `lyft.js:stdMoneyMap (LY_REV)` | Overview |
| 5 | Segment definitions | `lyft.js:stdMoneyMap (LY_SEG_DEF)` | Overview |
| 6 | Products & platforms + modal | `lyft.js:stdProducts (LY_PROD_GROUPS)` | Overview |
| 7 | Peer scatter (multiple vs growth) | `lyft.js:stdPeerScatter (LY_PEERS, LY_SC)` | Overview |
| 8 | Timeline + modal | `lyft.js:stdTimeline (TIMELINE)` | Overview |
| 9 | Overview footer | `lyft.js (LY_OV_SOURCES)` | Overview |
| 10 | Shared modal | `lyft.js:html + wireModal` | Overview |
| 11 | Live price strip | `lyft.js:lySegmentsBody #lyLive` | Top Line ▸ Segments |
| 12 | Segments lede | `lyft.js:lySegmentsBody` | Top Line ▸ Segments |
| 13 | Chart: Gross Bookings FY2022-2029E | `lyft.js:buildOverviewCharts (A_GB)` | Top Line ▸ Segments |
| 14 | Chart: Adj. EBITDA FY2022-2029E | `lyft.js:buildOverviewCharts (A_EBITDA)` | Top Line ▸ Segments |
| 15 | Where the Revenue Actually Comes From | `lyft.js:revComposition` | Top Line ▸ Segments |
| 16 | Segment pills Rideshare / Media & Growth | `lyft.js:lySegmentsBody (.seg-pill, estilo en línea)` | Top Line ▸ Segments |
| 17 | Rideshare in depth (riders x frequency x price, decomposition, rides and riders charts) | `lyft.js:growthBody, renderDecomp, RIDES_CFG, RIDERS_CFG, DECOMP_NOTES` | Top Line ▸ Segments |
| 18 | Range slider for riders/rides | `lyft.js:rangeSlider` | Top Line ▸ Segments |
| 19 | The deceleration debate | `lyft.js:growthBody` | Top Line ▸ Segments |
| 20 | Lyft Media & Growth in depth | `lyft.js:mediaBody` | Top Line ▸ Segments |
| 21 | KPI strip (riders, rides, partnership share, membership) | `lyft.js:lyCustomersBody` | Top Line ▸ Customers |
| 22 | Active riders bars | `lyft.js:lyCustomersBody` | Top Line ▸ Customers |
| 23 | The loyalty stack | `lyft.js:lyCustomersBody` | Top Line ▸ Customers |
| 24 | Advertisers, the other customer | `lyft.js:lyCustomersBody` | Top Line ▸ Customers |
| 25 | How the market is defined | `lyft.js:lyTamBody` | Top Line ▸ TAM |
| 26 | The dollar dimension | `lyft.js:lyTamBody` | Top Line ▸ TAM |
| 27 | Lyft Media & micromobility sizing | `lyft.js:lyTamBody` | Top Line ▸ TAM |
| 28 | Competitive Landscape, rivals & adjacent fronts | `lyft.js:lyIndustryBody` | Top Line ▸ Industry |
| 29 | Competitive map, rivals by business traits | `lyft.js:lyRivalScatter` | Top Line ▸ Industry |
| 30 | Regulation & driver classification | `lyft.js:REG, lyIndustryBody` | Top Line ▸ Industry |
| 31 | Follow a single ride, where the money goes | `lyft.js:unitBody, stmtFlow, PR_* / UE_*` | Bottom Line ▸ Unit Economics |
| 32 | Where each $ of a ride goes (chart) | `lyft.js:unitBody #lyUEdecomp` | Bottom Line ▸ Unit Economics |
| 33 | Take rate, and why it misleads | `lyft.js:unitBody #lyUEtake, TAKE_EXPL` | Bottom Line ▸ Unit Economics |
| 34 | Driver classification foundation | `lyft.js:unitBody` | Bottom Line ▸ Unit Economics |
| 35 | Is the margin jump durable? | `lyft.js:unitBody, COGS_NOTE` | Bottom Line ▸ Unit Economics |
| 36 | Who Powers Lyft, supplier & customer ecosystem | `lyft.js:lySuppliersBody, supplySection (SC_SUPPLIERS, SC_CUSTOMERS)` | Bottom Line ▸ Suppliers |
| 37 | Insurance money flow and model compare | `lyft.js:insuranceBody, linsMoneyFlow, insModelCompare, RISK_XFER` | Bottom Line ▸ Insurance |
| 38 | Margins chart (live Massive) + fallback + notes | `lyft.js:lyMarginsBody, buildLyMargins, lyLoadMargins, LY_MRG_*` | Bottom Line ▸ Margins |
| 39 | IR button / links | `lyft.js:ceIRButton` | Evolution ▸ Earnings |
| 40 | Quarter pills | `lyft.js:ceQPills` | Evolution ▸ Earnings |
| 41 | Setup (grid + annual) | `lyft.js:ceSetupBody, ceGrid, ceAnnualBody, CE_CONS` | Evolution ▸ Earnings |
| 42 | Watch List (shared engine) + theme record | `lyft.js:ceWatchBody, mountWatchList, LY_THEMES` | Evolution ▸ Earnings |
| 43 | Post-Results blocks | `lyft.js:ceResultsBody, cePrintBlock, ceSummaryBlock, CALL_EARNINGS` | Evolution ▸ Earnings |
| 44 | Popover help | `lyft.js:ceQ / ceReg (CE_POP)` | Evolution ▸ Earnings |
| 45 | Results dataset + chart | `results-data/lyft.js, resultsHtml` | Evolution ▸ Results |
| 46 | Setup dataset | `results-data/lyft-setup.js` | Evolution ▸ Results |
| 47 | Estimates evolution | `lyft.js:resultsEvoHtml` | Evolution ▸ Estimates |
| 48 | Model vs Reality (AVE chart and stats) | `lyft.js:modelBody, AVE, computeAveStats, renderAveStats` | Evolution ▸ Guidance |
| 49 | Guidance vs reality (GUIDE, GQ) | `lyft.js:modelBody, GUIDE, GQ` | Evolution ▸ Guidance |
| 50 | Turnaround from to | `lyft.js:strategyBody` | Evolution ▸ Strategy |
| 51 | Flywheel | `lyft.js:lyFlywheel (FW_DETAIL)` | Evolution ▸ Strategy |
| 52 | 2027 targets and how | `lyft.js:strategyBody (TGT)` | Evolution ▸ Strategy |
| 53 | AV bet | `lyft.js:strategyBody` | Evolution ▸ Strategy |
| 54 | Knockout and engines at a glance | `lyft.js:lyKnockout, lyEnginesGlance` | Evolution ▸ Strategy |
| 55 | History & Milestones | `lyft.js:historyStoryBody (TIMELINE)` | Evolution ▸ Timeline |
| 56 | M&A, what each deal changed | `lyft.js:mnaTimeline (MNA)` | Evolution ▸ Timeline |
| 57 | Scenario to price-target calculator | `lyft.js:LYFT_VAL (makeValuation)` | Valuation ▸ Multiples |
| 58 | Peers multiples | `lyft.js:lyPeerMultBody (LY_PEER_MULT)` | Valuation ▸ Peers |
| 59 | Analyst Ratings slot | `lyft.js #dd-val-slot (companies.js)` | Valuation ▸ Ratings |
| 60 | Capital allocation (framing, dividend, SBC) | `lyft.js:lyCapAllocBody` | Valuation ▸ Capital |
| 61 | Balance sheet (chart, cash and reserve, debt and dilution) | `lyft.js:lyBalanceBody, buildLyBal (LY_BAL_BARS)` | Valuation ▸ Balance |
| 62 | Financials chart (GB, revenue, EBITDA, FCF) | `lyft.js:lyFinBody, lyFinSeries (LY_FIN_YEARS)` | Valuation ▸ Financials |
| 63 | Executives and Board (9 execs, 8 directors, governance) | `lyft.js:LYFT_MGMT (makeManagement)` | Management |
| 64 | Ownership slot | `lyft.js #dd-mgmt-slot` | Management |
| 65 | Governance & SBC | `lyft.js:lyGovBody, buildLySbc (LY_SBC_HIST)` | Management |
| 66 | Track Record cards | `lyft.js:lyTrackBody (LY_TRACK, LY_TRACK_RATE)` | Management |
| 67 | Annual series A_* and quarterly UE_* | `lyft.js L366-387` | Cross-cutting |
| 68 | Brand and palette constants | `lyft.js L359-363` | Cross-cutting |
| 69 | Logo helper | `lyft.js:lyLogo` | Cross-cutting |

### B2 — destinos
| # | Pieza original | Destino | Cómo | Estado |
|---|---|---|---|---|
| 1 | Key Facts | Overview ▸ Key Facts (OV-1) | se rehace con celdas del 10-K; market cap en vivo | ✅ |
| 2 | Lede | Overview ▸ Descripción (OV-2) | se reescribe sin cifras | ✅ |
| 3 | 2×2 quadrant | Overview ▸ Cuadrante (OV-3) | se adapta al formato | ✅ |
| 4 | Money map bars (revenue split) | Overview ▸ How it makes money (OV-4) | se verifica contra el 10-K | ✅ |
| 5 | Segment definitions | Overview ▸ How it makes money (OV-4) | acordeones de definición | ✅ |
| 6 | Products & platforms + modal | Overview ▸ Products (OV-5) | sin emojis | ✅ |
| 7 | Peer scatter (multiple vs growth) | Overview ▸ Competitors (OV-6) | múltiplos en vivo, forward de BBG | ✅ |
| 8 | Timeline + modal | Overview ▸ Timeline (OV-7) | movido a lyft-ov-timeline.js | ✅ OV-7 (movido a lyft-ov-data.js; el timeline anterior sigue en Misc ▸ M&A and History) |
| 9 | Overview footer | Overview ▸ Pie de fuentes (OV-F) | un solo pie | ✅ |
| 10 | Shared modal | infraestructura compartida (F1) | se conserva | ✅ |
| 11 | Live price strip | Top Line ▸ General (TL-GEN) | get-quote | ✅ |
| 12 | Segments lede | Top Line ▸ General (TL-GEN) | cita del 10-K Item 1 | ✅ |
| 13 | Chart: Gross Bookings FY2022-2029E | Top Line ▸ General (TL-GEN) | el motor segments.js la reemplaza; datos a segments-data | ◐ conservado en el desplegable de Segments (gráficas GB/EBITDA anteriores) |
| 14 | Chart: Adj. EBITDA FY2022-2029E | Top Line ▸ General (TL-GEN) | datos al archivo | ◐ conservado en el desplegable de Segments (gráficas GB/EBITDA anteriores) |
| 15 | Where the Revenue Actually Comes From | Top Line ▸ Segments (TL-SEG) | colapsable | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 16 | Segment pills Rideshare / Media & Growth | Top Line ▸ Segments (TL-SEG) | el motor trae sus pills; estilo en línea sale | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 17 | Rideshare in depth (riders x frequency x price, decomposition, rides and riders charts) | Top Line ▸ Segments ▸ Rideshare (TL-SEG) | KPIs del segmento; análisis en colapsable | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 18 | Range slider for riders/rides | Top Line ▸ Segments (TL-SEG) | lo reemplaza el control del motor | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 19 | The deceleration debate | Top Line ▸ Segments ▸ Rideshare (TL-SEG) | texto en colapsable | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 20 | Lyft Media & Growth in depth | Top Line ▸ Segments ▸ Media (TL-SEG) | sub-segmento | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 21 | KPI strip (riders, rides, partnership share, membership) | Top Line ▸ Customers (TL-CUS) | cifras de 1T26, se refrescan | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 22 | Active riders bars | Top Line ▸ Customers (TL-CUS) | gráfica del motor | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 23 | The loyalty stack | Top Line ▸ Customers (TL-CUS) | colapsable | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 24 | Advertisers, the other customer | Top Line ▸ Customers (TL-CUS) | colapsable | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 25 | How the market is defined | Miscellaneous ▸ TAM (MISC-tam) | como UBER | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 26 | The dollar dimension | Miscellaneous ▸ TAM (MISC-tam) | como UBER | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 27 | Lyft Media & micromobility sizing | Miscellaneous ▸ TAM (MISC-tam) | como UBER | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 28 | Competitive Landscape, rivals & adjacent fronts | Miscellaneous ▸ Competitive Position (MISC-comp) | como UBER | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 29 | Competitive map, rivals by business traits | Miscellaneous ▸ Competitive Position (MISC-comp) | como UBER | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 30 | Regulation & driver classification | Miscellaneous ▸ Regulation (MISC-regulation) | como UBER | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 31 | Follow a single ride, where the money goes | Bottom Line ▸ General ▸ The bridge (BL-GEN-2) | datos trimestrales a archivo | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 32 | Where each $ of a ride goes (chart) | Bottom Line ▸ General ▸ Profitability & margins (BL-GEN-1) | se adapta al formato | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 33 | Take rate, and why it misleads | Bottom Line ▸ General (BL-GEN-1) | nota del panel | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 34 | Driver classification foundation | Miscellaneous ▸ Regulation (MISC-regulation) | se adapta al formato | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 35 | Is the margin jump durable? | Bottom Line ▸ General (BL-GEN-1) | colapsable | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 36 | Who Powers Lyft, supplier & customer ecosystem | Bottom Line ▸ Supply Chain (BL-SPLC) | sin export SPLC; se dice en el pie | ◐ conservado; sin export SPLC (BL-SPLC ⏭️ salvo que SAB lo consiga) |
| 37 | Insurance money flow and model compare | Miscellaneous ▸ Insurance & Balance Sheet (MISC-insurance) | como UBER | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 38 | Margins chart (live Massive) + fallback + notes | Bottom Line ▸ General ▸ Profitability & margins (BL-GEN-1) | versión AMZN; notas al panel | ✅ BL-GEN-1 lo reemplaza (BBG + filings); la versión Massive en vivo sigue debajo, en el desplegable |
| 39 | IR button / links | Evolution ▸ Earnings | se conserva | ✅ retirado de la vista por el estándar §12 (SAB 2026-10-21); los enlaces IR/EDGAR siguen en Resources |
| 40 | Quarter pills | Evolution ▸ Earnings | motor | ✅ |
| 41 | Setup (grid + annual) | Evolution ▸ Earnings ▸ Setup (EV-SET) | consenso de BBG, no a mano | ✅ |
| 42 | Watch List (shared engine) + theme record | Evolution ▸ Earnings ▸ Notes (EV-NOTES) | se adapta al formato | ✅ |
| 43 | Post-Results blocks | Evolution ▸ Earnings ▸ Post-Results (EV-POST) | hoy solo hasta 1T26 | ✅ |
| 44 | Popover help | Evolution ▸ Earnings | se conserva | ✅ retirado de la vista por el estándar §12 (SAB 2026-10-21); los enlaces IR/EDGAR siguen en Resources |
| 45 | Results dataset + chart | Evolution ▸ Results (EV-RES-DATA / EV-RES) | se recarga con BBG y 2T26 real | ✅ dataset y pestaña aprobados |
| 46 | Setup dataset | Evolution ▸ Earnings ▸ Setup (EV-SET) | se adapta al formato | ✅ |
| 47 | Estimates evolution | Evolution ▸ Estimates (EV-EST) | necesita 2 o más vintages del xlsm | ✅ |
| 48 | Model vs Reality (AVE chart and stats) | Evolution ▸ Results (debajo) | como UBER | ✅ |
| 49 | Guidance vs reality (GUIDE, GQ) | Evolution ▸ Results (debajo) | como UBER | ✅ |
| 50 | Turnaround from to | Miscellaneous ▸ Strategy (MISC-strategy, propuesta nueva) | el esqueleto no tiene Strategy | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 51 | Flywheel | Miscellaneous ▸ Strategy (MISC-strategy) | se adapta al formato | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 52 | 2027 targets and how | Management ▸ Track Record (MG-TRACK) | metas a 3 años | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 53 | AV bet | Miscellaneous ▸ Strategy (MISC-strategy) | se adapta al formato | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 54 | Knockout and engines at a glance | Miscellaneous ▸ Strategy (MISC-strategy) | se adapta al formato | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 55 | History & Milestones | Overview ▸ Timeline (OV-7), fusionada con #8 | requiere aprobación específica de fusión | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 56 | M&A, what each deal changed | Miscellaneous ▸ M&A (MISC-manda) | se adapta al formato | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 57 | Scenario to price-target calculator | Valuation ▸ Target Multiple (VA-TM) y Sensitivity (VA-SENS) | precio y caja tecleados dejan de mostrarse | ◐ calculadora conservada en Sensitivity; VA-TM y VA-SENS reconstruidos bloqueados por dudas 2 y 4 del modelo (§6) |
| 58 | Peers multiples | Valuation ▸ Peers (VA-PEERS) | mapa compartido con OV-6 | ✅ |
| 59 | Analyst Ratings slot | Pillars ▸ Ratings | como UBER | ✅ |
| 60 | Capital allocation (framing, dividend, SBC) | Management ▸ Governance & SBC (MG-GOV) | se adapta al formato | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 61 | Balance sheet (chart, cash and reserve, debt and dilution) | Miscellaneous ▸ Insurance & Balance Sheet (MISC-insurance) | se adapta al formato | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 62 | Financials chart (GB, revenue, EBITDA, FCF) | Bottom Line ▸ General (BL-GEN-1) | motor | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 63 | Executives and Board (9 execs, 8 directors, governance) | Management ▸ Executives & Board (MG-TEAM) | DEF 14A 2026 | ◐ conservado; falta DEF 14A 2026 para verificar consejo y comités (§6) |
| 64 | Ownership slot | Management ▸ Ownership (MG-OWN) | sin Fiscal.ai; DEF 14A | ✅ construido sin tabla de tenedores: falta DEF 14A (§6); tabla en vivo en su hueco |
| 65 | Governance & SBC | Management ▸ Governance & SBC (MG-GOV) | se adapta al formato | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 66 | Track Record cards | Management ▸ Track Record (MG-TRACK) | sin calificaciones (decisión SAB en UBER/GOOGL) | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 67 | Annual series A_* and quarterly UE_* | archivo de datos (EV-RES-DATA) | snapshot 2026-05-13 | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 68 | Brand and palette constants | F1: tokens Summit, marca solo en logo | se adapta al formato | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |
| 69 | Logo helper | F1 | se adapta al formato | ◐ conservado completo en un desplegable "the earlier analysis (moved from the old … tab)"; no se borra |

## 6. Bloqueos y preguntas abiertas

| Desde | Unidad | Qué falta | Quién lo consigue | Estado |
|---|---|---|---|---|
| 2026-11-05 | VA-TM · VA-SENS · MG-TEAM/OWN/GOV | Dudas del modelo (§1b): SHARES salta de 417.7 a 359.2 en FY26 (BBG 396.8); EARNINGS FY25 134.6 vs 2,844.0 del 10-K; OP_INCOME core en 0 FY25-27 vs 23.3 en el bloque de costos; FCF y EBITDA con dos filas | autor del modelo Summit | abierto |
| 2026-11-05 | MG-TEAM · MG-OWN · MG-GOV | Proxy statement 2026 (DEF 14A) de Lyft: consejo, comités, tenedores >5% y tabla de insiders | Dani | abierto |
| 2026-11-05 | EV-POST (3T26) · EV-SET (4T26) | 8-K, Prepared Remarks y call del 3T26 (print 2026-11-05 tras cierre) y transcripción con Q&A del 2T26 | Dani | abierto |
| 2026-11-05 | VA-HIST | 10-Q 1T24–3T25 y 1T26 para escalonar acciones y deuda neta por trimestre (hoy solo 4T23, 4T24, 4T25, 2T26) | Dani | abierto |
| 2026-11-05 | BL-SPLC | Export SPLC con Lyft como sujeto (proveedores) | Dani / San | abierto |

## 6b. Conexiones pendientes ("Live data pending")

> `docs/PROFILE_PLAYBOOK.md` §20b. Bloques aprobados que hoy muestran el aviso porque falta el camino
> en vivo. No hay números copiados que migrar: al destrabarse, se conecta, se vuelve a mostrar y se cierra.

| Desde | Unidad ▸ bloque | Qué falta (función / dato) | Quién lo destraba | Estado |
|---|---|---|---|---|
| 2026-11-05 | VA-HIST ▸ gráfica | `get-market-history` (precio diario Massive) no desplegada: San/Oscar | San / Oscar | abierto |
| 2026-11-05 | OV-1, OV-6 ▸ market cap y múltiplos | `get-quote` / `liveQuote` en vivo (login del analista) | — | funciona con el login de SAB |

## 6c. Review del analista — pendientes

> `docs/PROFILE_PLAYBOOK.md` §16 paso 7. Pedidos del analista después de entregado el perfil. Cada R pasa
> por la compuerta normal y se registra en §7 al aprobarse. Si el pedido vale para toda empresa, se
> propone también como cambio a la guía.

| # | Pedido (textual) | Unidad | Qué hay que construir | Depende de | ¿Va a la guía? | Estado |
|---|---|---|---|---|---|---|

## 7. Historial de aprobaciones

<!-- Solo se agrega, la más reciente al final. Una entrada por cada paso por la compuerta. -->
### AAAA-MM-DD · <ID> <Nombre> — <APROBADA | CAMBIOS | OMITIDA>
- Qué se mostró:
- Fuentes:
- Autoauditoría:
- Cambios pedidos / decisiones:

### 2026-11-04 · F0 Inventario de datos — APROBADA
- Qué se mostró: tabla §1 y alcance propuesto.
- Fuentes: `inspect_matrix.py LYFT`, carpeta DCF de Drive, `docs/calls/LYFT*.md`, `results-data/lyft.js`.
- Autoauditoría: Output del xlsm con caché viejo (no se usa); 10-K/10-Q sin accession verificado todavía.
- Cambios pedidos / decisiones: ninguno.

### 2026-11-04 · B1 + B2 — APROBADAS
- Qué se mostró: 69 piezas con destino; 3 decisiones (Strategy → MISC-strategy y metas 2027 → Track Record; History & Milestones fusionada con Overview ▸ Timeline; código muerto SNAPSHOT/DESC/KPIS/SEGMENTS/PEERS/TAILWINDS/HEADWINDS/TARGETS).
- Fuentes: lectura de `js/overviews/lyft.js`.
- Autoauditoría: conteo hecho desde el código; **no se contó en el portal local** (login); se concilia en F-FINAL.

### 2026-11-04 · F0-SM Mapa de métricas Summit — APROBADA
- Qué se mostró: tabla de 43 códigos, 4 submits, valuación EV/EBITDA, 6 dudas + la de valuación.
- Fuentes: `DCF LYFT.xlsm` (Projection History / Actuals History), dataset de Results (8-K).
- Autoauditoría: Output/Summary del xlsm con caché viejo, no se leen; 2T26 y guía 3T26 del modelo sin 8-K; dudas abiertas sin uso.
- Cambios pedidos / decisiones: ninguno; las dudas quedan en "Bloqueos".

### 2026-11-04 · F1 Esqueleto + vista previa — APROBADA
- Qué se mostró: 6 secciones con los paneles actuales en su destino B2; `http://localhost:8000/`; Pillars vuelve.
- Fuentes: —
- Autoauditoría: sintaxis OK; no se probó en navegador por Claude (login); gráficas de Bottom Line ▸ General apiladas visibles.
- Cambios pedidos / decisiones: ninguno.

### 2026-11-04 · OV-1 Key Facts — APROBADA
- Qué se mostró: 10 celdas; market cap solo en vivo ("loading live quote…" / "live quote unavailable").
- Fuentes: 10-K FY2025 (acc. 0001628280-26-006960): HQ, Delaware, 3,913 empleados Dic 2025, dividendo, Nasdaq; Founded/IPO/CEO desde el perfil anterior (sin fuente primaria).
- Autoauditoría: PASS 10 celdas, sin celdas vacías, sin semilla de market cap; FAIL parcial (aceptado): Founded, IPO y fecha del CEO sin fuente primaria — verificar con prospecto/proxy.
- Cambios pedidos / decisiones: ninguno. Datos siguen en `lyft.js` (separación en lyft-ov*.js en F-FINAL).

### 2026-11-05 · OV-2 Descripción · Aprobado (SAB)
- Lede nuevo de 68 palabras sin cifras, desde 10-K FY25 Item 1 (p.5). Reemplaza el anterior (con "segundo mayor" y cifras de rentabilidad), que se retira del Overview.
- Autoauditoría: PASS sin números, 3 oraciones, neutral; el texto anterior queda en el historial de git (commit e2a30fa..).

### 2026-11-05 · OV-3 Cuadrante 2×2 · Aprobado (SAB)
- Fuente: 10-K FY25 Item 1 (p.5), Nota de ingresos (p.78-79, 83). The edge: lectura del analista, respaldada por 10-K p.7/p.14 (Uber como competidor principal).
- Hallazgo: el 10-K dice que la publicidad no es un componente significativo; el texto anterior de Lyft Media (~$100M, >100% YoY) y el "take ~34%" no tienen fuente en el 10-K. Se reubican/verifican en OV-4 y Top Line (no se borran).

### 2026-11-05 · OV-4 How Lyft makes money · Aprobado (SAB)
- Fuente: 10-K FY25 — nota de ingresos (disgregación y geografía, p.83), estado de resultados (p.69), MD&A métricas clave (p.51), Nota 2 (un segmento operativo, p.74).
- Cifras: ingresos 6,316.3 (+9%); GB 18,507.0 (+15%); ASC 606 5,895.5 (93%, +10%); ASC 842 420.8 (7%, plano); EE.UU. 6,060.2 (96%); Internacional 256.0 (4%; FY24 140.1); pérdida operativa (188.4); utilidad neta 2,844.0 (beneficio fiscal 2,897.3 por liberar la valuation allowance; antes de impuestos (53.2)).
- Reubicado/retirado de la vista (nada se borra): el strip de KPI (GB, Rides, Active Riders, EBITDA, FCF) ya vive en Bottom Line/Results; "take ~34%" y Lyft Media (~$100M, >100% YoY) quedan en `LY_SEG_DEF` hasta TL-SEG, donde se verifican o se marcan sin fuente. El pie de "geografía omitida, solo EE.UU. y Canadá" era obsoleto (Freenow, 10-K muestra Internacional).
- Autoauditoría: PASS cifras con fuente; barras reconcilian al total (5,895.5+420.8=6,316.3; 6,060.2+256.0=6,316.3).
- **Hallazgo para el autor del modelo (§6):** el modelo trae EARNINGS FY25 134.6 y OP_INCOME 23.3, pero el 10-K reporta utilidad neta 2,844.0 y pérdida operativa (188.4). Se suma a las dudas 2 y 4 de §1b. No se usan esos campos hasta aclarar. Adj. EBITDA FY25: 10-K 528.8 vs modelo 528.9 (redondeo).

### 2026-11-05 · OV-5 Products & platforms · Aprobado (SAB)
- Rejilla plana de 8 familias (UBER: `stdProducts` + modal `prod:<i>`); título del desplegable pasa a "Products & platforms". Fuentes: 10-K FY25 Item 1 (modos, Price Lock, Express Drive, bikes y scooters, Lyft Business, Lyft Silver) y Prepared Remarks 2T26 (Freenow, TBR, Curb, XXL, Lyft Teen, sistemas de LUS, Waymo Nashville, Baidu Londres).
- Retirado de la vista (sigue en `LY_PROD_GROUPS`, se reubica en TL-SEG/MISC): Lyft Pink (precio ~$9.99/$99 sin fuente), Lyft Media/anuncios, May Mobility, Mobileye+Marubeni, Level 5 vendida a Woven Planet, Lyft Healthcare. Ninguno aparece en el 10-K FY25 ni en los remarks; verificar con IR si se reincorporan.
- Autoauditoría: PASS 8 tarjetas, d ≤ 6 palabras, ningún número sin fuente.

### 2026-11-05 · OV-6 Competitors — the peer map · Aprobado (SAB)
- Peers (decisión SAB): LYFT, UBER, DASH, GRAB. Motor portado de `uber-ov.js` a `js/overviews/lyft-peers.js` (clases `ly-sc`, estado `LY_SCP`); denominadores en `js/overviews/lyft-ov-data.js` (`LY_PEER_DATA`). Múltiplos y market cap en vivo (Massive), nada sembrado.
- Fuentes: LYFT 10-K FY25 + BBG 2026-11-04 (EPS GAAP 0.52, EBITDA aj. 701.7, ingresos 7,366.4); UBER BBG 2026-11-03 (EBITDA 11,401); DASH 10-K FY25 (del archivo de UBER); GRAB comunicado FY25 (6-K acc. 0001855612-26-000012), 20-F acc. 0001855612-26-000020 solo cotejado en ingresos (3,370) y EBITDA aj. (500).
- Pendiente/avisos: crecimiento forward de UBER (11.1%) arrastrado del perfil UBER (BBG 2026-09-10); GRAB EPS/op. profit/D&A/deuda del comunicado, no verificados en el 20-F; DASH y GRAB solo trailing; no probado en navegador por mí. El motor viejo (`LY_SC`, `stdPeerScatter`) sigue en el código para Valuation ▸ Peers hasta VA-PEERS y se retira en F-FINAL.

### 2026-11-05 · OV-7 Timeline + OV-F Pie · Aprobado (SAB)
- OV-7: `LY_TIMELINE` nuevo (10 hitos; modal `lyhist:<i>`). Entran: Bounder Web/Zimride 2007, Lyft 2012/2013, IPO mar-2019 ($72.00; cierre del primer día $78.29), venta de Level 5 (2021), PBSC (2022), CEO Risher (Q2 2023), Freenow (31-jul-2025), TBR (oct-2025), liberación de valuation allowance (Q4 2025, $2.9B), Waymo Nashville (jun-2026).
- Fuera por falta de fuente (siguen en `TIMELINE` viejo → Misc ▸ M&A and History): Prop 22 (fecha y 58.6%), comprador/precio de Level 5, Investor Day 2024 y sus objetivos 2027, "primera ride-hailing en salir a bolsa", AV partners 2025 (May Mobility, Mobileye, Tensor), recompra de $500M.
- OV-F: `LY_OV_SOURCES` reescrito al formato del playbook; sin menciones al snapshot Summit de mayo ni a "web-sourced"; desplegables "How Lyft makes money" y "Timeline — how it became today's Lyft".
- **Overview OV-1…OV-F completo.** Pendiente de Overview para F-FINAL: mover datos a `lyft-ov-data.js`, retirar `stdPeerScatter`/`LY_SC` viejos y el `<style>` inline de `stdOverviewBody` a `css/overview.css`.

### 2026-11-05 · EV-RES-DATA Dataset de Results · Aprobado (SAB)
- `js/results-data/lyft.js` reconstruido. Actuals 1T24–1T26 como estaban (8-K); 2T26 del 10-Q acc. 0001628280-26-054499: rev 1,843.5 · GB 5,504.2 · EBITDA aj. 177.2 · NI 50.3 · EPS dil. 0.13 · FCF 319.6 · rides 262.4 · riders 30.5 · reservas de seguro 2,307.7. Periodos nuevos: 3T26 y 4T26 (estimados). Guía 3T26 (remarks 2T26): GB 5,500–5,670, EBITDA 183–203.
- Consenso: `scripts/consensus/map_lyft.json` → `emit_matrix.py` → `apply_matrix.py` (bloque `estMatrix`, 30 snapshots, 2019-05-12 a 2026-11-04; 0 reimpresos, 0 series congeladas). `cons` plano = pre-print BBG; se retiró todo consenso de agregadores (Zacks, LSEG, FactSet, StreetAccount, StockStory). `verify_preprint.py`: blanked 0. FCF excluido (`drop`): la serie HEADLINE_FCF de Bloomberg no usa la definición de Lyft (CFO menos PP&E y flota de scooters); 1T25 Street 132.1 vs reportado 280.7.
- Summit (xlsm, Projection History): 3T26-4T26 y anual 2026-2029 del vintage 2026-08-07. Cuadre trimestres→año 2026 exacto con Summit (GB 21,888.8; rev 7,268.7; EBITDA 718.8 fila core; FCF 1,265.7); con BBG dentro de 0.05–0.15% (encuestas distintas, no se fuerza).
- Cuadre de actuals: FY25 suma de trimestres vs 10-K — rev 6,316.3 ✔; GB 18,507.1 vs 18,507.0; EBITDA 528.9 vs 528.8; FCF 1,115.5 vs 1,115.6; rides 945.5 ✔. FY24 rev 5,786.0 ✔, GB 16,099.4 ✔.
- Notas de métricas corregidas a BBG (sorpresas nuevas; ej. EBITDA superó a BBG en 9 de 10 trimestres; rides −5.0% en 4T25 y −4.0% en 1T26) y a Summit 08-07 (GB 2027 $24.6B; EBITDA 2027 $959M; FCF 2027 $1,277M). Retirado por no tener fuente: "Gett UK (may-2026)".
- **Duda nueva para el autor del modelo:** RIDES 2T26 en `Actuals History` = 262.0; el 10-Q trae 262.4 (los remarks redondean a 262). Se suma a las dudas de §1b. Además `Actuals History` REV FY25 de `Projection History` = 6,484.3 vs 6,316.3 reportado (duda 1, sin cambio).
- Pendiente de este archivo: bloque `evolution` (EV-EST, vintages Dec-15/Feb-11/May-13 → agregar Aug-7 y May-08 vs May-13), `LYFT_SETUP` (EV-SET), y que el 3T26 se carga tras el print de hoy.

### 2026-11-05 · EV-RES Pestaña Results · Aprobado (SAB)
- Montada sin cambios de código (motor `results.js`, dataset aprobado en EV-RES-DATA). SAB la revisó en el portal local.

### 2026-11-05 · TL-GEN · TL-SEG · TL-OTH · TL-CUS Top Line · Aprobados (SAB)
- Archivo nuevo `js/segments-data/lyft.js` (patrón SN: un solo segmento, 10-K Nota 2). Registrado en `js/segments.js` (`LYFT: { seg: lyftSegments, res: lyftResults }`) y montado en `deepDiveHtml` (General · Segments · Other · Customers); el análisis anterior (`lySegmentsBody`, `lyCustomersBody`) quedó debajo en desplegables "the earlier analysis (moved from the old … tab)", nada se borró.
- Datos anuales de Other (10-K FY25, nota de ingresos): ASC 606 4,116.2 / 5,365.5 / 5,895.5; ASC 842 287.4 / 420.5 / 420.8; EE.UU. 4,245.1 / 5,645.9 / 6,060.2; Internacional 158.5 / 140.1 / 256.0 (2023/2024/2025); ambos cortes suman el ingreso reportado.
- KPIs con definición verbatim del 10-K (Item 7): Gross Bookings, Rides, Active Riders. **Nota de comparabilidad:** el 10-K dice que en 4T25 se simplificó la definición de Gross Bookings, sin impacto en periodos previos; en 1T25 se actualizó la de Active Riders.
- Cambio de motor mínimo y aditivo (`js/segments.js`, `sgResolveRef`): campo opcional `segUnit` en la métrica de Results para que Rides y Active Riders (que en Results viven en `usdM` como sustituto) salgan como conteos en Top Line. Para el PR: generalizar el motor aparte.
- Omitido: tabla SPLC (no hay export con Lyft como sujeto); bloque 5 de TL-SEG ("What management has said") muestra su bandera ⚑ hasta EV-NOTES; precio×volumen: costo por unidad (seguro por ride) pendiente de BL-GEN-5.
- Sin verificar en navegador por mí: lo revisó SAB en el portal local.

### 2026-11-05 · EV-EST Estimates · Aprobado (SAB)
- Bloque `evolution` de `results-data/lyft.js` rehecho desde `DCF LYFT.xlsm` / Projection History, 4 snapshots (bloques 219, 170, 121 y 1 = 2025-12-15, 2026-02-11, 2026-05-08, 2026-08-07). Métricas: GB, rev, EBITDA, FCF, capex (positivo), FY2026–FY2029; `prior` FY2025 (18,507 / 6,316 / 529 / 1,116).
- **Corrección de datos:** la versión anterior traía un vintage "May 13, 2026" bajado del MCP cuyos valores de años lejanos no coinciden con el snapshot 05-08 del archivo (GB FY2028 26,769 vs 28,613; FY2029 28,604 vs 32,953; coincide en FY2026). Se usan los valores del xlsm. El texto anterior ("la baja más agresiva...", "−47 %") se reescribió con las cifras nuevas.
- Lectura: GB FY2029 −15.1 % y rev FY2029 −20.6 % entre dic y ago; EBITDA FY2029 −30.0 %; en agosto EBITDA FY26–28 +5/+3/+14 % vs mayo; FCF FY2027 1,277 vs meta >$1B.
- Consenso no se muestra en este eje: los snapshots de BBG (2025-11-10, 2026-02-15, 2026-05-12, 2026-11-04) no coinciden con las fechas de los submits de Summit.
- Montaje: `initResultsEvo('LYFT')` ahora pasa el ticker (regla del §11).
- Dudas del modelo: FCF tiene dos filas que difieren antes de FY2026 (FY2025 1,088.3 y 1,001.6 vs 1,115.6 reportado); EBITDA vs ADJ_EBITDA FY2026 718.8 vs 706.4 (duda 3 de §1b).

### 2026-11-05 · EV-SET · EV-POST · EV-NOTES · BL-GEN-1…5 · VA-HIST · VA-PEERS · VA-SUB · MG-OWN · en revisión (sin aprobar aún)
- **Earnings:** `js/overviews/lyft-ce.js` (port de `uber-ce.js`), `lyft-ce-data.js` (consenso BBG generado con `scripts/consensus/emit_ce_lyft.py` y `map_lyft_ce.json`; sin FCF, SBC ni capex porque la serie de Bloomberg no está en la base de Lyft; Summit del xlsm vía Results y un bloque congelado de líneas de costo y flujo), `themes-data/lyft.js`. Q3 2026 abierto como Setup (BBG 2026-11-04, Summit 2026-08-07, guía 183–203 / 5,500–5,670); Q2 2026 pasa a reported con Post-Results del 10-Q y los remarks (sin Q&A). El registro anterior (Q1 2026 y 4T25, con sus highlights y bloques de análisis) se movió sin cambios.
- **Bottom Line:** `lyft-bl.js` + `lyft-bl-data.js` + `lyft-bbg.js` (generado por `scripts/bbg_extract.py LYFT`, con los códigos de Lyft añadidos al `CODE` del script). Cinco líneas funcionales (FY21–FY25 del 10-K, trimestres 2T25–2T26 de Bloomberg, que cuadran con el 10-Q en 2T25 y 2T26). Hallazgo: S&M +68 % YoY en 2T26 (incentivos $186.9M vs $99.9M, 10-Q). El análisis anterior queda en un desplegable.
- **Valuation:** `lyft-histmult.js` (P/E solo forward GAAP; trailing deshabilitado con su razón), `lyft-histmult-data.js` (4 puntos de balance), mapa de peers compartido (`lyft-peers.js`), `submits-data/lyft.js` (4 submits, EV/EBITDA). VA-TM y VA-SENS no se reconstruyen (dudas del modelo, §6).
- **Management:** Ownership nuevo (clase única desde el 15-ago-2025, 10-K); `brand` del roster pasa al token Summit. Roster, gobierno y track record anteriores se conservan; falta DEF 14A.
- **CSS:** `.ov-lyft-dd` agregado a las listas `:is(...)` y a los selectores por empresa de `css/overview.css` y `css/selectors.css`.
- **No probado por mí en navegador.** Revisión pendiente de SAB en el portal local.

### 2026-11-05 · EV-SET · EV-POST (2T26) · EV-NOTES · BL-GEN-1…5 · VA-HIST · VA-PEERS · VA-SUB · MG-OWN · Aprobados (SAB)
- Aprobados en el portal local. VA-HIST con el aviso de datos en vivo (get-market-history no desplegada) y gráfica desde feb-2024 por los 4 balances disponibles. MG-OWN con la bandera del proxy.
- En pausa (⏸): VA-TM, VA-SENS (dudas 2 y 4 del modelo), MG-TEAM, MG-GOV, MG-TRACK (falta DEF 14A), BL-SPLC (sin export SPLC), F-FINAL (B3 y limpieza del código viejo de `ce*`), y el Post-Results del 3T26 / Setup del 4T26 (print de 2026-11-05).

### 2026-11-05 · F-FINAL (parcial) · limpieza de código
- Se retiraron de `lyft.js` 25 funciones sin ninguna referencia (maquinaria vieja de Earnings: `ceSetupBody`, `ceResultsBody`, `ceGrid`, `ceQPills` …, el scatter viejo `stdPeerScatter`, `lyIntro`); 4,402 → 3,714 líneas. El contenido de datos (Q1 2026 y anteriores, hilos de llamadas) ya vive en `lyft-ce-data.js` y `themes-data/lyft.js`.
- Siguen en `lyft.js`, referenciados entre sí y sin uso desde la vista: `CE_CONS`, `CALL_EARNINGS`, `LY_THEMES`, `callsBody`, `wireCallEarnings`, `wireCeTrack`, `gBuildCeAnnual`, `CE_POP`. Su retiro requiere desenredarlos juntos: queda para el cierre (F-FINAL) junto con el cuadre B3.

### 2026-11-05 · EV-POST 3T26 + Setup 4T26 · Q&A del 2T26 · correcciones de render
- **Fuentes del 3T26** (carpeta de Drive): comunicado 8-K Ex. 99.1, Prepared Remarks y Slides del 3T26 (JSON parseados) + transcripción del call (pegada por Dani). Las citas de Prepared Remarks y comunicado se verificaron por script contra el texto (67 citas; la única "no encontrada" estaba partida por un salto de página, p.7→p.8). Las citas del Q&A se copiaron de la transcripción y se verificaron igual.
- **Results (js/results-data/lyft.js):** actuals 3T26 (GB 5,616.9 · Rev 1,821.8 · Rides 273.5 · Riders 31.6 · EBITDA aj. 203.9 · NI (9.7) · EPS (0.03) · FCF 294.7 · reservas de seguro 2,302.9) y guía 4T26 (GB 5,740–5,940; EBITDA 188–213). Los actuals del xlsm (Actuals History) coinciden con el comunicado.
- **Summit NO se movió del submit 2026-08-07.** El submit del xlsm con fecha 2026-11-05 17:35 *no es un vintage válido*: Dani lo guardó para corregir líneas del modelo, no como estado posterior al print (instrucción de Dani: "haz como que Q3 2026 NO estaba reflejado"). Por eso no se añadió quinto snapshot en Evolution ▸ Estimates ni quinta fila en Submit History, y el Setup del 4T26 usa Summit del 08-07. Cuando Dani guarde un submit post-3T26 válido, se agrega como vintage nuevo.
- **Earnings (lyft-ce-data.js):** Q3 2026 pasa a `reported` con Post-Results (18 notas por línea), 10 temas de Prepared Remarks, 10 preguntas de analistas y 9 candidatos a Notes; nuevo Setup Q4 2026 (guía, consenso Bloomberg 2026-11-04 —anterior al print— y Summit 08-07). `ACT_EXTRA` con las líneas de costo, utilidad operativa, OCF y acciones del 3T26 (D&A trimestral no se da en el comunicado).
- **Q&A del 2T26:** 9 preguntas cargadas desde la transcripción pegada por Dani (antes el 2T26 solo tenía Prepared Remarks).
- **Notes (themes-data/lyft.js):** actualización Q3 2026 en 5 de los 6 ejes (Media sin novedad). **Bottom Line:** 3T26 agregado a la serie trimestral de costos (comunicado). **Management:** nuevo CFO Michael Brous (presentado en el call del 3T26 y citado como CFO en el comunicado); Brewer pasa a "CFO hasta el call del 3T26". Falta fecha efectiva del cambio y 8-K/proxy: ver §6.
- **Errores encontrados y corregidos hoy:** (1) un `</div>` faltante en la nota del puente de Bottom Line anidaba Evolution/Valuation/Mgmt/Misc dentro de Bottom Line (pestañas vacías); (2) selectores `.ov-lyftstercard-dd` en `lyft-ce.js` (reemplazo masivo mal hecho); (3) `lyft-histmult.js` rompía sin serie anual de EPS.
- **Procedencia de los calls anteriores (Q4 2023–Q1 2026):** vienen del código previo del repo (`docs/calls/LYFT.md` y `LYFT-latest.md`: citas de Prepared Remarks leídas del PDF de Lyft y extractos de Q&A de transcripciones de terceros, rotulados). No se re-verificaron en esta pasada.
- **Pendiente:** 8-K del cambio de CFO y proxy 2026 (Management y Ownership); resto de la lista de §6.

### 2026-11-05 · Desbloqueo de unidades en pausa (instrucción de Dani)
- **Instrucción:** no pedir proxy, Slides, export SPLC ni 10-Q intermedios; el 10-K FY25 + el último 10-Q (2T26) + el comunicado del 3T26 alcanzan. Las unidades en pausa se construyen con lo que hay y lo no verificable se rotula.
- **VA-TM** (`lyft-target-multiple.js` + `-data.js`, portado de `uber-target-multiple.js`): 4 submits válidos del xlsm; valuación y filas del modelo congeladas; el modelo solo valúa EV/EBITDA (9×, 8×, 5×, 7× sobre FY2027) → no hay pierna P/E (el P/E "en vivo" parte de la celda P/E del libro, 16×, no de una cifra inventada). EARNINGS del submit 2026-02-11 = null (error de escala ×378). EARNINGS y SHARES se muestran como el modelo los trae, con aviso (dudas 2 y 4).
- **VA-SENS** (`lyft-sensitivity.js` + `-data.js`, portado de `uber-sensitivity.js`): un snapshot (08-07), un solo segmento; ejes = crecimiento del ingreso, margen de EBITDA aj. sobre ingreso y múltiplo de salida (arranca en el del modelo); base Summit | Street (Bloomberg). OP_INCOME proyectado es 0 en ese submit (duda 2), por eso el margen es de EBITDA y no operativo. La calculadora anterior (`LYFT_VAL`) queda debajo, desplegable.
- **El guardado del xlsm con fecha 2026-11-05 17:35 no es un submit** (Dani lo guardó corrigiendo líneas del modelo, antes de cargar el 3T26): no se usa como vintage en Estimates, Submit History, Target Multiple ni Sensitivity. Ese guardado ya trae OP_INCOME, EARNINGS y SHARES poblados para los años proyectados; cuando haya un submit posterior al 3T26, podrá reabrirse la duda 2 y 4.
- **MG-TEAM/GOV/TRACK:** sin proxy. Consejo = los 8 firmantes del 10-K (10-feb-2026) + Ben Minicucci (call del 2T26); CAO Stephen Hope (10-K); CFO Michael Brous (call del 3T26, fecha efectiva no dada). Verificado en 10-K/10-Q/comunicado: Clase B (20 votos) 8.531M acciones a 31-dic-24 ≈ 29% del voto (cálculo propio) y cero a 31-dic-25; consejo clasificado en tres clases; acciones en circulación (400.9M a 31-dic-25; 379.2M a 30-sep-26); recompras. No reverificado (proxy): pago del CEO y razón, independencia y comités.
- **Insurance & Balance Sheet:** actualizado del 1T26 al 30-sep-2026 con el balance del comunicado del 3T26 (se quita el aviso "work in progress"); detalle de deuda del 10-Q del 2T26.
- **VA-HIST:** se añade el balance del 3T26 (comunicado; el 10-Q del 3T26 no está en archivo). No se piden los 10-Q de 1T24–3T25: la serie sigue escalonada en los 10-K + 2T26 + 3T26.
- **Pendiente real (nada que Dani deba traer):** aprobación de SAB de las unidades 🔍; las dudas del modelo 2 y 4 (la última versión guardada ya las corrige; falta un submit posterior al 3T26 para reabrirlas); `get-market-history` (San/Oscar) para el gráfico de precio de Historic Multiple; MISC-* siguen como análisis de la versión anterior sin reverificar (salvo Insurance & Balance Sheet); F-FINAL (código viejo `CE_CONS`, `CALL_EARNINGS`, `LY_THEMES`… y cuadre B3).

### 2026-11-06 · Consenso nuevo, 2 trimestres hacia adelante, Top Line y consistencia (feedback de Dani)
- **Consenso:** `BBG_CONSENSUS.txt` / `Consensus_Portal.xlsm` actualizados por Dani (31 snapshots, último 2026-11-06 = primer archivo posterior al 3T26). La fila del 2026-11-04 (consenso previo al print) **ya no existe en ninguno de los dos archivos** (se sobrescribió); se restauró desde el commit anterior en `estMatrix` (14 de 14 series) y en `LYFT_CE_CONS_GEN` (34 celdas del grid de Earnings con valor en el commit anterior: Q3 26 a 1q, Q4 26 a 2q, Q1 27 a 3q, Q2 27 a 4q) para que el comparativo del 3T26 siga siendo el del día anterior al print. El FCF de Bloomberg (`HEADLINE_FCF`) deja de descartarse (instrucción de Dani) y se rotula como serie de Bloomberg que no sigue la definición de Lyft; no tiene fila previa al print del 11-04, así que el "Street" del 3T26 viene del archivo de agosto.
- **Dos trimestres hacia adelante:** `forwardQuarters: 2` en Results y Setup (regla del analista, como SPOT); periodo 1Q27 añadido a las series trimestrales y al eje de Top Line; el grid de Earnings llega a Q1 2027. **Summit no llega a 1Q27**: las columnas trimestrales 2027 del submit 08-07 no cuadran con sus propios totales anuales (EBITDA de los 4 trimestres suma 1,907.6 contra 959.0 anual; ingreso 8,958.7 contra 8,068.5; GB 25,021.6 contra 24,636.7) y se dejan fuera hasta que el modelo se corrija.
- **Línea "Insurance reserves" eliminada** del Results, del grid y de las notas de Earnings (nadie la estima); el balance sigue en Miscellaneous ▸ Insurance & Balance Sheet.
- **Summit en Earnings:** utilidad operativa y D&A trimestrales (submit vigente de cada trimestre); para el 3T26 también utilidad neta 71.2, acciones 382.5 y EPS 0.19 (columna 3T26 del guardado del 05-nov, que es el forecast previo a cargar el print; GB/ingreso/EBITDA ahí son idénticos al submit 08-07). D&A real 3T26 = 115.248 (9M) − 75.392 (1S) = 39.856.
- **Top Line ▸ General:** para una empresa de un solo segmento (`overview.single`) muestra la gráfica del motor (Actual · Summit model · Consensus, todo encendido), no un reparto de ingreso. `defaultHidden: []` para Lyft (el default del motor apaga Summit y Street; la nota del código lo atribuye a SAB, sep-2026, y permite que un dataset lo cambie). Paleta apagada propia (`ramp` y `y2Ramp`, como MA y SPOT).
- **Consistencia:** todos los toggles de periodo en orden "Quarterly | Annual" con Quarterly por defecto (Bottom Line estaba al revés); zona sombreada FORECAST en Bottom Line (la misma del motor) y sin sufijo "E"; las líneas de margen de Summit/consenso nacen del último dato real (`anchorForecast`, opt-in por dataset); métricas derivadas Rides por Active Rider y Gross Bookings por Active Rider; Gross Bookings por viaje en dólares (estaba como "×").
- **Bloques viejos bajo "the earlier analysis":** siguen (regla B2 de §4.2: toda pieza tiene destino y el mapa lo aprobó Dani el 04-nov); se arreglaron dos cosas: los colores de marca (rosa) pasan a azul Summit, y sus gráficas ahora se construyen al abrir el desplegable (antes quedaban sin tamaño y en blanco). Pendiente de decisión de Dani: retirarlos o llevarlos a Miscellaneous.
- **Errores propios corregidos hoy:** el plugin de zona FORECAST usaba `RS_FWD` sin definir en `lyft-bl.js` (lo encontró ESLint `no-undef`; commit posterior).

### 2026-11-06 · Auditoría independiente (2.ª corrida) y correcciones
- **Hallazgos corregidos:** (alto) el bloque de marca de Lyft en `css/overview.css` seguía definiendo rosa y morado (`--brand`, `--brand-soft`, `--brand-2` y los hover): ahora son acero Summit; el morado `#6B2BD9` de `lyft.js` también. (medio) `y.capex.summit` y `y.ebitda.summit[2025]` de `results-data/lyft.js` no coincidían con el submit 08-07 (ahora 107.3 / 161.4 / 129.3 / 138.1 y 528.9); la cita de la renovación en `lyft-ce-data.js` y `lyft-bl-data.js` tenía la palabra "insurance" metida (restaurada textual); "Summit … above the top of the range" (5,657 < 5,670); "7 of 8 independent" contradecía el roster de 9 directores; calculadora vieja con acciones y caja de 2026-05 (ahora 379.2M y +$905M del comunicado del 3T26 y DCF del 08-07); fila OV-6 del tablero ✅ y línea "Avance" recontada (28 ✅ de 41 filas). (bajo) SBC de 2Q25/2Q26 en `LYFT_OPEXQ` (82.1 / 76.6 del 10-Q), "$882M"→883, notas y encabezado de `results-data/lyft.js` actualizados al 3T26, D&A +3.5%, "17 notas"→18, `lyOwnBody` fuera de `deepDiveHtml`, código muerto del scatter viejo (`LY_PEERS`, `LY_SC`, `lyScRender`…) eliminado y el market cap en vivo de Key Facts conservado.
- **No corregido todavía:** datos de mercado fijos en el bloque viejo de Peers (`LY_PEER_MULT`, "~Jul 2026", rotulados) y precio por defecto de la calculadora vieja ($14.70, editable); comentarios heredados de AMZN/MA en `lyft-ce.js`; 13 variables sin uso en `lyft-ce.js`; la tira de precio en vivo del mapa B2 #11 y los objetivos 2027 del #52 viven en bloques viejos (Segments ▸ earlier analysis y Misc ▸ Strategy), no en TL-GEN / Track Record; secciones 1, 1b, 5 y 6 de este log conservan texto anterior al 06-nov (VA-TM/VA-SENS "bloqueados", "falta DEF 14A", "30 snapshots").
- **Sin verificar por falta de documento** (no son defectos): citas del Q&A y de la presentación del call (no hay transcripciones en disco), citas de los hilos Q4 2023–Q1 2026 en `themes-data/lyft.js`, actuals trimestrales individuales de 1T24–1T26 (no hay 8-K en disco; las sumas anuales sí cuadran con los 10-K).

### 2026-11-06 · 10-Q del 3T26, citas contra el compendio de calls, ajustados, precio en vivo y Miscellaneous (feedback de Dani)
- **10-Q del 3T26** (`0001628280-26-071225`, firmado el 5-nov-2026): sustituye al comunicado como fuente del balance y las notas. Datos nuevos incorporados: D&A 3T26 = 39.9 contra 33.8 (ya trimestral); incentivos en S&M $247.9M contra $128.4M (+$119.5M) y +$8.5M en alianzas de marketing; G&A +$94.1M, de los cuales +$52.2M neto en reservas legales/fiscales/regulatorias y +$20.4M en pasivos generales autoasegurados; costo de ingresos −$55.8M por SB 371 y cambios favorables en estimaciones de siniestros (y el 10-Q advierte que subirá en el corto plazo con las renovaciones); recompras 3T26: 3.1M acciones por $50.0M (9M: 31.6M por $450.0M); 377,896,271 acciones Clase A al 30-oct-2026; deuda total con vencimientos corrientes $1,052.0M (corriente $52.5M); **segundo contrato de transferencia de cartera de pérdidas con Riverstone, 1-jul-2026**: pólizas oct-2019 a sep-2025, prima $406M, límite agregado $743M, mayormente con fondos retenidos (el de feb-2025: $85.1M de prima, límite $120.5M); ganancia diferida $54.3M. Ingresos por alquiler (ASC 842) siguen sin cifra trimestral ("menos de 10% del ingreso"): por eso Top Line ▸ Other conserva solo los cortes anuales del 10-K.
- **Cambio de CFO con fecha:** carta de empleo de Michael Brous del 7-sep-2026 y contrato de consultoría de Erin Brewer vigente desde el 28-sep-2026 (anexos 10.1 y 10.2 del 10-Q); Brous firma el 10-Q como CFO.
- **Citas:** las del Q&A del 3T26 y 2T26 y las de los hilos Q4 2023–Q1 2026 ahora se verifican contra `LYFT_calls_Q4-2025_to_Q3-2026.md` (134 citas entre comillas: 131 textuales; las otras 3 son falsos positivos de comillas anidadas, un salto de página y un nombre de producto). Se retira la marca "sin verificar" de esas citas.
- **Precio en vivo:** la calculadora vieja ya no trae precio fijo ($14.70, julio): toma `api.liveQuote('LYFT')` al abrir y queda editable; acciones y caja del 3T26 (379.2M, +$905M). El market cap de Key Facts ya era en vivo.
- **Consenso ajustado:** Dani agregó al archivo `IS_COMP_NET_INC_EXCL_STOCK_COMP` e `IS_COMP_EPS_EXCL_STOCK_COMP` (kpi5/kpi6). Entran al grid de Earnings como "Adjusted net income (ex-SBC)" y "Adjusted EPS (ex-SBC)" con el Street (Q3 previo al print: $143.5M y $0.36; Q4 posterior: $140.6M y $0.35; Q1 27: $147.1M y $0.37). Sin actual para 1T26–3T26: los "reportados" de Bloomberg no están en una sola base (2T26 = utilidad GAAP) y Lyft no publica la medida. Summit solo trae GAAP.
- **Lo viejo ("earlier analysis")** sale de las pestañas canónicas y va a Miscellaneous como sub-tabs propias, tal cual, como en MA, TBBB, SOFI y GOOGL: "Rideshare, Media & riders" (Segments + Customers viejos), "Unit economics & financials" (márgenes, unidades, financieros) y "Scenario calculator & peer table". Top Line, Bottom Line y Valuation conservan solo el contenido canónico. Misc queda con 8 sub-tabs.
