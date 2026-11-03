# TBBB — bitácora de construcción del perfil

> Reglas: `docs/PROFILE_PLAYBOOK.md` §3. Claude la lee completa al empezar cada sesión y la actualiza en cada aprobación.
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)

| Campo | Valor |
|---|---|
| Empresa | BBB Foods / Tiendas 3B (NYSE: TBBB) |
| Modo | **B — reordenar existente** (PR #40 / #73 ya en main; hay Overview estandarizado + Deep Dive híbrido) |
| Rama | `feat/tbbb-profile` (desde `origin/main` cc7ede9, 2026-11-01; worktree `research-summit-tbbb`) |
| Analista responsable | Dani |
| Inicio | 2026-11-02 |
| Avance | 0 aprobadas por el analista; varias construidas y en revisión (tablero §2). Dani aprueba al final de la sesión de trabajo (2026-11-02) |

## 1. Inventario de datos (F0)

| Fuente | ¿Existe? | Detalle | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Filing anual | Sí — **Form 20-F** (IFRS, FY Dec-31, Ps. MXN) | FY2025 20-F (2026-04-02) · **20-F/A No. 1 (2026-05-21)**, 10 págs (corrige la fecha del lock-up) · FY2024 (2025-04-29) · FY2023 (2024-04-30). CIK 0001978954 | Overview, Top Line, Management, textos verbatim | — |
| Releases / decks | Sí | Earnings Release 1Q26 y **2Q26**, Earnings PPT 2Q26 (Drive `…\TBBB\`). No hay PPT de 1Q26 en la carpeta | Results trimestral, Post-Results 2Q26, Guidance | PPT 1Q26 (el release lo cubre) |
| Transcripciones | Sí — `TBBB Calls.txt` (4,857 líneas, modificado 2026-11-02) | El .txt trae 11 calls (la primera post-IPO, 4Q23, hasta 2Q26). `docs/calls/TBBB.md` tenía 7 (3Q24→1Q26); **2Q26 destilado el 2026-11-02** (8 en repo). Faltan por destilar 4Q23, 1Q24 y 2Q24 (opcionales, pre-3Q24) | EV-POST, EV-NOTES, Watch List | — |
| Consenso BBG | Sí — **10 snapshots**, 2024-05-27 → **2026-09-09** (último ya con 2Q26 reportado) | `inspect_matrix.py TBBB`: layout estable en los 10; 24 slots de P&L/CF + 6 KPIs (Merchandise Rev, Recyclables Rev, Stores BOP/EOP, Net adds, DCs); fq-4…fq+4 y fy-2…fy+3 | Results trimestral + anual, Setup, Estimates, Bottom Line forward | — |
| Summit DCF | Sí — pero lo cableado es **snapshot 2026-05-22** (pre-2Q26). Sin acceso por herramienta MCP en esta sesión | Hoy: anual 2020–2029, EBITDA "model-computed" | Target Multiple, Sensitivity, Estimates (Summit congelado, regla 10) | ⛔ ver §6: Dani revisa si hace falta submit con data a 2Q26 |
| Fila en `companies` | Sí (el perfil ya abre) | | | |
| `get-market-history` | Por verificar en F0 (hoy 404 en otras empresas) | | Historic Multiple en vivo | Historic Multiple con "Live data pending" |
| Precio / market cap | Massive `liveQuote('TBBB')` (el Overview ya lo usa) | | | |
| SPLC | No aplica (retailer; sin export clientes/proveedores) | | | BL-SPLC y TL-CUS ⏭️ |
| Fiscal.ai / fotos | Fotos: `img/leadership/3b-*.png` ya existen. Fiscal.ai por verificar | | Management | |

**Moneda / FY:** Ps. MXN, IFRS, FY = año calendario (✔ compatible con los componentes anuales). Cualquier comparador en USD se convierte, no se mezcla.
**Alcance acordado:** pendiente de compuerta F0.

### Hallazgos del estado actual (código en main) — a corregir en la reconstrucción

1. `js/results-data/tbbb.js` es **solo anual**, 2020–2029, último actual = **FY2025**. No incorpora 1Q26 ni 2Q26 trimestrales. `updated: 'Aug 2026'`.
2. El comentario del archivo dice "TBBB is not in our consensus archive, cons = null". **Falso hoy**: hay 10 snapshots. Solo Revenue trae `cons`, con valores sospechosos (p. ej. FY2024 cons 50,452 vs actual 57,439; FY2023 45,516 vs actual 44,078) → rehacer desde `inspect_matrix`/`emit_matrix`, no parchar.
3. El texto de Estimates dice "11 snapshots (Apr 2024 → Aug 2026)": el archivo real tiene 10, de 2024-05-27 a 2026-09-09.
4. Summit EBITDA es "model-computed"; el consenso trae `IS_COMPARABLE_EBITDA`, y la compañía reporta **Adjusted EBITDA** (ex-SBC). Hay que fijar base en la reconstrucción (decisión del analista).
5. Evolution tiene dos sub-tabs vacías (**Strategy**, **Timeline**) → viola regla 5 (no publicar sub-tabs "pendiente"). Se mueven/eliminan según el mapa.
6. La estructura de Deep Dive **no es la de AMZN** (§5): Top Line tiene 7 sub-tabs a medida, Bottom Line es un solo panel (Unit Economics), Valuation es solo Sensitivity (una matriz EV propia), Evolution tiene 6.
7. Código muerto en `bbb.js`: `overviewBody`, `storesBody`, `generalBody`, la barra `ovt-*` y `showOvt` ya no se renderizan (`html()` usa `stdOverviewBody`). Su **contenido** (KPI tiles, tabla FY24→FY25, bullets "How money", Timeline legacy) hay que confirmar que ya vive en el Overview estándar antes de tocarlo (B1 #9–#12).
8. Post-Results y Watch List llegan hasta **1Q26**; el Watch List ya tiene sembrados los hooks para 2Q26 (lock-up Aug 6, margen bruto, F&V/Irrepetibles, G&A, work-week, private label).

### Hallazgos nuevos al construir (2026-11-02)

9. **El tbbb.js anterior tenía errores de datos.** SSS FY2025 figuraba 16.5% y el 20-F dice **18.3%**; la serie "EBITDA (model)" (p. ej. 2022: 614) no cuadraba con ninguna base reportada (EBITDA 2022 = 1,305 = utilidad operativa + D&A); la utilidad operativa FY2025 es una **pérdida de Ps.675M** y el set anterior no la mostraba. Todo reconstruido desde el 20-F y los releases.
10. **El bloque evolution (Estimates) anterior convertía USD a MXN sobre cifras que Bloomberg ya trae en pesos**, inflando FY2026 a ~Ps.114B (el Street real es ~Ps.103B, coherente con la guía de +29% a +32% sobre Ps.78.2B). Reconstruido desde estMatrix sin conversión.
11. **Outlier de consenso**: gp de 4Q26 en dos vintages (2026-03-16: 7,032; 2026-05-11: 7,748; ~24-27% del ingreso vs ~16-17%) es un error de un analista. No se borró el vintage porque arrastraría el consenso pre-print válido de 1Q26. Pendiente de decisión.
12. **DCs de BBG congelado** (13 únicos de 30 celdas): dcs solo con actuals, sin consenso.
13. **EBITDA de BBG está en base reportada** (después de SBC) y mezcla bases por analista. Por eso hay dos líneas: EBITDA reportado (comparable con el consenso) y EBITDA ajustado ex-SBC (sin consenso; base de la compañía y de la call).
14. **Ambigüedad de 4Q24 OCF**: los trimestres 2024 de los releases 2025 suman 2,354.9 y el 9M24 comparativo dice 2,378.2. 4Q24 OCF queda en blanco; capex sí cuadra.

15. **EBITDA e IFRS 16 (la renta).** Los costos de ventas y de tienda ya incluyen depreciación, incluida la de los activos por derecho de uso; el EBITDA de la compañía suma toda la depreciación de vuelta y por eso queda **antes de la renta** (el interés del arrendamiento va debajo, en costos financieros). Es lo que infla el EBITDA frente a un comparable que registra renta en opex. La compañía revela cada trimestre los "capitalized lease payments for buildings": Ps.316M (1Q24), 338, 357, 378 (4Q24), 397, 439, 463, 533 (4Q25), 534 (1Q26), 593 (2Q26); suman Ps.1,389M en 2024 y Ps.1,833M en 2025, igual que lo revelado. Se agregaron `rent` (pago de rentas, de la compañía) y `ebitdaal` (**EBITDA ex-SBC después de rentas**, derivado: ajustado menos renta; 2Q26: Ps.982M, 3.8% de ingreso, contra Ps.1,575M y 6.1% antes de renta). Antes de 2024 no hay cifra de renta en los filings disponibles, así que esos años quedan en blanco. No se encontró en el repo ninguna versión anterior de este tratamiento (la que Dani recuerda de Pablo).
16. **La "Adjusted EBITDA" de Sensitivity no es EBITDA**: es ingreso × (margen bruto 16.2% − ventas 10.3% − admin ex-SBC 2.7%) = 3.2%, y esas líneas ya traen depreciación (incluida la de ROU). Está más cerca de la utilidad operativa antes de SBC que del EBITDA reportado (5.6% del ingreso en FY2025). Se agregó la advertencia en el pie de la matriz; el modelo no se tocó.

## 1b. Mapa Summit (F0-SM)

⛔ Pendiente de acceso al MCP Summit en esta sesión y de la decisión de Dani sobre submit (ver §6). Mientras tanto no se escribe `js/summit-map/tbbb.js` ni se refresca ningún número Summit.

## 2. Tablero de unidades

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | 👀 | 2026-11-02 | | 3bd843e | §1; actualizado con los hallazgos 9-14 |
| B1 | Inventario de contenido existente | 👀 | 2026-11-02 | | | §5; conteo de control 45 (código); falta contar en DOM del portal local |
| B2 | Mapa de reubicación | 📝 | 2026-11-02 | | | §5b propuesta; nada se mueve antes de aprobar |
| F0-SM | Mapa de métricas Summit | 👀 | 2026-11-02 | | | `js/summit-map/tbbb.js` escrito desde `DCF TBBB.xlsm` (no desde el MCP); `approved: null`, dudas para el autor del modelo en §10 |
| F1 | Esqueleto + vista previa | 👀 | 2026-11-02 | | | Deep Dive reordenado a la estructura canónica (§5c). Vista previa: `harness-tbbb.html` (local, ignorado por git) |
| OV-1…OV-7, OV-F | Overview (7 bloques + pie) | ⬜ | | | | ya existen estandarizados; se auditan vs §8, no se reconstruyen |
| EV-RES-DATA | Dataset de Results (números) | 👀 | 2026-11-02 | | 3bd843e | Trimestral 1Q24-2Q26 + anual 2021-2025; consenso BBG (10 snapshots) vía estMatrix; Summit solo años forward (snapshot 2026-05-22). Cuadre en §8 |
| EV-RES | Evolution ▸ Results | 👀 | 2026-11-02 | | | Renderiza en el harness: surprise vs Street, Road to the print, márgenes |
| TL-GEN | Top Line ▸ General | 👀 | 2026-11-02 | | | Motor Results (`tbbb-tl.js`): ingresos + tiendas, altas, DCs y SSS, trimestral y anual; debajo, las gráficas a medida conservadas (tiendas, vs OXXO, SSS vs ANTAD). El SSS vs ANTAD no tiene 2Q26 (el release solo dice brecha >20 pts) |
| TL-SEG | Top Line ▸ Segments | 🔨 | 2026-11-02 | | | Hoy: Product Mix a medida (private label vs branded + milk) reubicado |
| TL-OTH | Top Line ▸ Other | ⬜ | | | | |
| TL-CUS | Top Line ▸ Customers | ⏭️ propuesto | | | | retailer, sin SPLC (confirmar en F0) |
| EV-EST | Evolution ▸ Estimates | 👀 parcial | 2026-11-02 | | | Solo Street (10 vintages, FY26-28). Falta la mitad Summit: espera snapshot post-2Q26 (≥2 snapshots) |
| EV-SET | Earnings ▸ Setup | 👀 | 2026-11-02 | | | `tbbb-setup.js` ahora trimestral + anual con estMatrix |
| EV-POST | Earnings ▸ Post-Results | 👀 | 2026-11-02 | | | 2Q26 agregado (recap + resumen de call, tono objetivo). Watch List: lock-up cerrado, 4 hooks nuevos para 3Q26. Guidance FY26 actualizada con 1H |
| EV-NOTES | Earnings ▸ Notes | 👀 | 2026-11-02 | | | Sin notas del equipo: semilla **generada con IA** (`js/themes-data/tbbb.js`: 21 hilos, 95 notas de las 11 calls, 3 guías anuales cerradas) y módulo `bbb-notes.js` (por tema / por trimestre, filtros, alta de notas, guarda en `company_theme_record` solo al editar). Reemplaza la fase Watch List, cuyos 12 hilos quedaron absorbidos en la semilla. Dani: reemplazar o ampliar con sus notas |
| BL-GEN-1…5 | Bottom Line ▸ General | 👀 parcial | 2026-11-02 | | | Motor Results (`tbbb-bl.js`): Profitability & margins, Expense lines (ventas, admin, admin ex-SBC, SBC) y Operating profit to net income (financieros, FX, impuesto). Debajo: Unit Economics conservado. The bridge hecho (`bbb-bridge.js`: margen bruto → utilidad operativa → EBITDA → EBITDA ex-SBC → después de rentas, por periodo, % o Ps. M). Bloque de SBC dedicado hecho (`bbb-sbc.js`: calendario por programa FY2026E-2029E del release 2Q26 y tabla de acciones diluidas a 30-jun-2026) |
| BL-SEG | Bottom Line ▸ Segments | ⬜ | | | | |
| BL-SPLC | Bottom Line ▸ Supply Chain | 🔨 | 2026-11-02 | | | Sin export SPLC; la sub-tab aloja Logistics (cadena, simulador multi-DC, cuándo abrir un DC) |
| VA-HIST | Valuation ▸ Historic Multiple | ⬜ | | | | depende de `get-market-history` |
| VA-PEERS | Valuation ▸ Peers | ⛔ parcial | 2026-11-02 | | | Scatter reubicado. Sus múltiplos y crecimiento de peers están **sembrados a mano (Aug 2026)**, contra la regla 10; no tengo fuente para reemplazarlos. Falta consenso de los peers (WALMEX, FMX, CHDRAUIB, LACOMUBC) y FX para que el múltiplo de TBBB sea en vivo |
| VA-TM | Valuation ▸ Target Multiple / PEG | ⬜ | | | | Hay datos (4 submits, solo EV/EBITDA); falta construir el motor/pantalla (≈900 líneas en AMZN/SPOT). Siguiente |
| VA-SUB | Valuation ▸ Submit History | 👀 | 2026-11-02 | | | `js/submits-data/tbbb.js` (4 submits, solo EV/EBITDA) + motor común; ver §10 para los avisos (definición de EBITDA cambió, P/E roto, caso Bull/Base) |
| VA-SENS | Valuation ▸ Sensitivity Analysis | 👀 (base refrescada al submit del 13-ago) | 2026-11-02 | | | Matriz SSS × aperturas reubicada tal cual; su base de EBITDA usa el modelo Summit del 22-may (pendiente de refresh) |
| MG-TEAM / MG-OWN / MG-GOV / MG-TRACK | Management (4 sub-tabs) | 👀 | 2026-11-02 | | | Executives & Board · Ownership · Governance & SBC (calendario SBC actualizado al release 2Q26) · Track Record con 6 líderes y **calificaciones propuestas** (4 Value creator, 2 Mixed/unproven) a confirmar por Dani |
| MISC-* | Miscellaneous | 👀 | 2026-11-02 | | | Store Tour · Competitive Landscape · BİM Blueprint (intactos) |
| F-FINAL | Cierre + conciliación B3 | ⬜ | | | | |

## 3. Decisiones del analista

- 2026-11-02 · rama · Se parte de `origin/main` actualizado, **no** del PR viejo (feat/tbbb-overview, >2–3 meses) — Dani.
- 2026-11-02 · EBITDA · La renta (IFRS 16) se muestra: EBITDA ex-SBC como base de la compañía y, al lado, EBITDA ex-SBC después de rentas (derivado) — Dani pidió tomar en cuenta que el EBITDA de TBBB está antes de renta.
- 2026-11-02 · Summit · Se incorpora "lo que hay so far"; Dani revisa si hace falta un submit del modelo con data a 2Q26 antes de congelar números Summit — Dani.

## 4. Excepciones aceptadas

(ninguna)

## 5. B1 — Inventario de contenido existente (conteo de control = 45)

Fuente: lectura de `js/overviews/bbb*.js`, `js/results-data/tbbb*.js`, `docs/calls/TBBB.md`. ⚠ Falta el conteo contra el DOM del portal local (§4.2 B1); se hace al levantar la vista previa en F1 y se concilia.

| # | Pieza (archivo:función) | Dónde se ve hoy |
|---|---|---|
| 1 | `bbb.js:stdKeyFacts` Key Facts (market cap en vivo vía Massive) | Overview |
| 2 | `bbb.js:STD_DESC` lede | Overview |
| 3 | `bbb.js:stdFourQuad` cuadrante 2×2 | Overview |
| 4 | `bbb.js:moneyMapBody` How 3B makes money (barra mix + acordeones) | Overview |
| 5 | `bbb.js:productsBody/wireProducts` Products + pop-up | Overview |
| 6 | `bbb.js:bPeerScatter` Competitors / peer map (scatter, chips on/off, caps en vivo) | Overview |
| 7 | `bbb.js:stdTimeline` Timeline | Overview |
| 8 | `bbb.js:STD_SOURCES` pie de fuentes | Overview |
| 9 | `bbb.js:overviewBody` SNAPSHOT + DESC (legacy, no renderiza) | — |
| 10 | `bbb.js:KPIS` KPI tiles + AS_OF + FY_NOTE (legacy) | — |
| 11 | `bbb.js:FINANCIALS` tabla FY2024→FY2025 (legacy) | — |
| 12 | `bbb.js:HOW_MONEY`, `TIMELINE` bullets "History & Milestones" (legacy) | — |
| 13 | `bbb.js:growthBody` Store Count Growth (chart + slider) | DD ▸ Top Line ▸ Store Growth |
| 14 | `bbb.js:growthBody` Store Expansion vs OXXO — same company age | DD ▸ Top Line ▸ Store Growth |
| 15 | `bbb.js:sssBody` SSS 3B vs ANTAD (chart con etiquetas) | DD ▸ Top Line ▸ Same-Store Sales |
| 16 | `bbb.js:mixBody` Private label vs branded evolution (chart) | DD ▸ Top Line ▸ Product Mix |
| 17 | `bbb.js:mixBody` Private-label economics — milk 1 L | DD ▸ Top Line ▸ Product Mix |
| 18 | `bbb-logistics.js:tourBody` Store Tour 3D (Matterport; CSP en netlify.toml) | DD ▸ Top Line ▸ Store Tour |
| 19 | `bbb-logistics.js` The supply chain, end to end | DD ▸ Top Line ▸ Logistics |
| 20 | `bbb-logistics.js` simulador multi-DC | DD ▸ Top Line ▸ Logistics |
| 21 | `bbb-logistics.js` Why — and when — 3B opens a new DC | DD ▸ Top Line ▸ Logistics |
| 22 | `bbb-landscape.js` Mapa coroplético 32 estados (3B/Neto/BARA) + `mx-map-data.js` | DD ▸ Top Line ▸ Competitive Landscape |
| 23 | `bbb-landscape.js` Scale — total store count | idem |
| 24 | `bbb-landscape.js` Each chain at a glance (+ toggle vs Walmex/Chedraui/La Comer/OXXO) | idem |
| 25 | `bbb-landscape.js` The runway — hard-discount penetration | idem |
| 26 | `bbb-bim.js` roadmap BİM vs 3B | DD ▸ Top Line ▸ BİM Blueprint |
| 27 | `bbb-bim.js` side by side at comparable maturity | idem |
| 28 | `bbb-bim.js` margins — stable by design | idem |
| 29 | `bbb-bim.js` what the blueprint implies for 3B | idem |
| 30 | `bbb.js:ueBody` First-year sales per new store by vintage (chart) | DD ▸ Bottom Line |
| 31 | `bbb.js:ueBody` What it costs to open a store | DD ▸ Bottom Line |
| 32 | `bbb.js:ueBody` Negative working capital (flujo 20/39/59 días + 3 pasos + two numbers + analogía) | DD ▸ Bottom Line |
| 33 | `bbb.js:bIRButton` tarjetas IR + EDGAR | DD ▸ Evolution ▸ Earnings |
| 34 | `results-data/tbbb-setup.js` Setup (engine) | Earnings ▸ Setup |
| 35 | `bbb.js:WL_ROWS_TBBB` Watch List (6 vivos para 2Q26 + 2 cerrados) | Earnings ▸ Watch List |
| 36 | `bbb.js:bPostResultsBody/TBBB_CALLS` Post-Results: print recap + call summary (1Q26, FY2025 y anteriores) | Earnings ▸ Post-Results |
| 37 | `results-data/tbbb.js` Results (engine, anual) | Evolution ▸ Results |
| 38 | `bbb.js` Estimates (`resultsEvoHtml`) | Evolution ▸ Estimates |
| 39 | `bbb.js:bGuidanceBody` Guidance: track opens vs guía, cards FY26, "what 3B does NOT guide" | Evolution ▸ Guidance |
| 40 | `bbb.js` Strategy (vacía) | Evolution ▸ Strategy |
| 41 | `bbb.js` Timeline (vacía) | Evolution ▸ Timeline |
| 42 | `bbb-sensitivity.js` matriz SSS × store growth → EV implícito | DD ▸ Valuation |
| 43 | `bbb-management.js` org charts Corporate/Regional + modal CV + fotos | DD ▸ Management |
| 44 | `bbb-management.js` Ownership: share structure, economics vs control, major shareholders | DD ▸ Management |
| 45 | `bbb-management.js` Dilution & SBC | DD ▸ Management |

(Fuera de la cuenta, son soporte y se concilian aparte: `docs/calls/TBBB.md` (7 calls), constantes de datos en `bbb.js` (B_PEERS, STORE_COUNT, GD_*), `img/leadership/3b-*.png`.)

## 5b. B2 — Mapa de reubicación (PROPUESTA, nada se mueve hasta aprobar)

| # | Destino propuesto (estructura AMZN) | Cómo |
|---|---|---|
| 1–8 | Overview ▸ OV-1…OV-7 + OV-F | ya estandarizado; auditar contra §8 uno por uno |
| 9–12 | Overview (los que no estén ya) / Bottom Line ▸ General; si ya viven en el Overview se marcan "fusionada con #N" con aprobación | revisar antes de borrar código muerto |
| 13, 15 | Top Line ▸ General (`segov`): tiendas, SSS vs ANTAD como KPIs operativos del motor | gráficas a medida → motor `segments.js` con datos; el texto pasa al panel |
| 14 | Top Line ▸ General (comparativo OXXO) o Miscellaneous (MISC-comp) | |
| 16–17 | Top Line ▸ Segments (Merchandise vs Recyclables + private label) / milk economics en nota del panel | |
| 18 | Miscellaneous ▸ Store Tour (único en su tipo) | tal cual |
| 19–21 | Bottom Line ▸ Supply Chain si cabe, si no MISC ▸ Logistics & DCs (simulador intacto) | |
| 22–25 | Valuation ▸ Peers (contexto competitivo) y/o MISC ▸ Competitive Landscape (mapa) | mapa se conserva intacto |
| 26–29 | Miscellaneous ▸ BİM Blueprint | tal cual |
| 30–32 | Bottom Line ▸ General (márgenes/FCF) + MISC ▸ Unit Economics (vintage, costo por tienda, capital de trabajo) | conservar texto y datos |
| 33–36 | Evolution ▸ Earnings (Setup · Post-Results · Notes); Watch List se conserva | |
| 37–38 | Evolution ▸ Results / Estimates con dataset nuevo trimestral+anual | |
| 39 | Evolution ▸ Earnings ▸ Notes o Top Line ▸ General (Guidance); es el track "guía de aperturas vs entregado", valioso, se conserva | pregunta al analista |
| 40–41 | **Sin contenido**: se retiran como sub-tabs vacías (nada que borrar) | aprobación explícita |
| 42 | Valuation ▸ Sensitivity Analysis (se conserva la matriz SSS×aperturas y se alinea al formato AMZN) | |
| 43–45 | Management ▸ Executives & Board · Ownership · Governance & SBC | |

## 5c. Estructura del Deep Dive tras la reubicación (2026-11-02)

| Sección | Sub-tabs | Contenido reubicado (B1 #) |
|---|---|---|
| Top Line | General · Segments | #13-15 (tiendas, vs OXXO, SSS vs ANTAD) · #16-17 (mix, milk) |
| Bottom Line | General · Supply Chain | #30-32 (unit economics, costo, capital de trabajo) · #19-21 (logística, simulador, cuándo un DC) |
| Evolution | Earnings (Setup · Watch List · Post-Results) · Results · Estimates · Guidance | #33-39; **#40-41 Strategy/Timeline vacías retiradas (no tenían contenido)** |
| Valuation | Peers · Sensitivity Analysis | #6 (scatter, copia; el Overview conserva el suyo) · #42 |
| Management | Executives & Board · Ownership · Governance & SBC | #43 · #44 · #45 |
| Miscellaneous | Store Tour · Competitive Landscape · BİM Blueprint | #18 · #22-25 · #26-29 |

Overview (#1-8) intacto. #9-12 (legacy) siguen sin renderizar y sin borrarse del código; decidir en F-FINAL si se fusionan con el Overview estándar. Conteo: 45 piezas originales, 45 con destino (las 2 retiradas estaban vacías; aprobación pendiente).

### Actualizaciones de 2Q26 en piezas heredadas (2026-11-02)

- Supply Chain: 21 DCs y 3,624 tiendas (antes 20 y 3,469, de 1Q26). Competitive Landscape: la cifra de 3B pasa a ~3,624; las de Neto/BARA/OXXO siguen con la fecha original de sus fuentes, así que esa tabla mezcla fechas (se anota en el pie en F-FINAL).
- Watch List: encabezado y nota pasan a 3Q26.
- Overview: Key Facts, 2×2 y bloques 4-7 se revisaron; son estándar y con fecha FY2025, sin cambios necesarios.

### Correcciones de contenido (2026-11-02, segunda pasada)

- El Overview y varias notas decían que el SBC de 2025 era un cargo "one-time/one-off" ligado al IPO. Los releases lo atribuyen al **Liquidity Event Plan** (7.5M acciones Class C otorgadas en junio 2025, vesting trimestral a 3 años, reconocimiento gradual), con calendario decreciente hasta 2028. Corregido en el Timeline, FY_NOTE, FIN_NOTE y en el texto de Peers; se agregó el hito 2026 (follow-on de mayo, fin del lock-up el 6-ago).
- Calls en el repo: 11 (se destilaron 4Q23, 1Q24 y 2Q24).

### Guidance (2026-11-02)

- Nueva tabla "guided vs delivered" con las tres líneas guiadas, verificada en los transcripts: FY2024 (380-420 tiendas, ingresos +28% a +32%, SSS "mid-teens" → 484, +30.3%, +13.4%), FY2025 (500-550, +26% a +29%, SSS +11% a +14% → 574, +36.1%, +18.3%), FY2026 (590-630, +29% a +32%, SSS +13% a +16%; 1H: 278, +36.2%, +16.0%/+20.0%). El lede anterior decía que solo se guiaban aperturas (y en 2026 ingresos): corregido; la guía de SSS 2026 (13%-16%) no estaba en el portal.

## 6. Bloqueos y preguntas abiertas

- ⛔ **Snapshot Summit** (Dani revisa; es lo único que bloquea EV-EST completo, VA-TM, VA-SUB, VA-HIST y el refresh de Sensitivity): lo cableado es 2026-05-22; el consenso ya llega a 2Q26 (2026-09-09). Mientras no haya snapshot con 2Q26, Summit queda como está y marcado con su fecha; no se inventa ni se mezcla. Mismo patrón que Mastercard (overview hecho sin submit).
- Acceso al MCP Summit en esta sesión: la herramienta no está disponible (solo `authenticate`). Dani decide si autentico o él lo corre.
- `get-market-history`: verificar si está desplegada (VA-HIST).
- Confirmar con Dani: base de EBITDA (Adjusted ex-SBC vs reportado) para Results/Bottom Line.

## 7. Historial de aprobaciones

(append-only; vacío)

## 8. Cuadre EV-RES-DATA (2026-11-02)

Verificado contra los documentos fuente:
- La suma de 1Q25-4Q25 = Total Revenue FY2025 del 20-F (Ps.78,152.943M) y 1Q24-4Q24 = FY2024 (57,439.019M). Igual para net income FY2024 (334.422M) y FY2025 (-2,839.571M).
- EBITDA reportado 2025 (suma de trimestres 1,223.9M) = utilidad operativa FY25 + D&A del flujo de efectivo (-675.230 + 1,899.144 = 1,223.914M). Ajustado 4Q25 = 79.442 + 890.679 + 230.151 = 1,200.272M, igual a lo impreso por la compañía (Ps.1,200M).
- SBC 4Q25 = 2,930.222 (20-F) - 2,039.543 (3 trimestres) = 890.679M (el release redondea a Ps.891M); 4Q24 = 127.090M (release: Ps.127M).
- Stores: 2,288 (YE23) más altas trimestrales reproduce 2,634 (3Q24, reportado), 2,772 (YE24), 2,889/3,031/3,162/3,346 (2025) y 3,469/3,624 (2026).
- verify_preprint.py TBBB cons: changed=0, blanked=0 (el matrix no modifica ningún valor existente).
- Razonabilidad del consenso: pre-print 2Q26 (vintage 2026-05-11) revenue 24,743 vs actual 26,037 (+5.2%); stores 3,629 vs 3,624.

Pendiente de la compuerta: Dani elige 3 periodos al azar para comparar contra el documento. El cuadre trimestres a año de los años estimados (2026 con 1Q26 y 2Q26 ya reportados) queda para F-FINAL.

## 9. Pendientes para cerrar el perfil (en orden)

1. Summit: tras el submit con data a 2Q26: F0-SM, mitad Summit de estMatrix y evolution, VA-TM, VA-SUB, refresh de VA-SENS.
2. Top Line y Bottom Line al motor (segments.js, márgenes) con datos trimestrales; hoy son las gráficas a medida reubicadas.
3. Valuation: Historic Multiple (requiere get-market-history desplegada) y tabla de Peers estilo AMZN.
4. Overview: auditar OV-1 a OV-7 contra §8 (ya estandarizados; falta revisar Key Facts, 2x2 y pie de fuentes con 2Q26 y follow-on).
5. Dani: confirmar o cambiar las calificaciones de Track Record y revisar/ampliar la semilla de Notes (generada por IA).
6. F-FINAL: conciliación del conteo de control (B3) contra el DOM del portal local.

## 10. Actualización 2026-11-02 (release 3Q26 + xlsm del modelo Summit)

**Entradas:** release 3Q26 (2-nov-2026; el call es el 3-nov y aún no hay transcript) y `DCF TBBB.xlsm` (hoja Projection History). El MCP de Summit sigue sin estar disponible; el xlsm es la fuente (regla 10: congelado en archivo).

**Corrección de Dani (2-nov):** el último submit real es el del **13-ago-2026**. El bloque de la hoja con fecha 2026-11-02 (ID 5) **no es un submit** (no se ha hecho submit post-3Q26; el call no ha ocurrido) y se ignora: ni en Estimates, ni en Submit History, ni en Sensitivity. Un primer pase lo había tratado como submit y se revirtió. Cuando haya un submit real tras el call, se re-lee con `build_tbbb_summit.py` (agregar el bloque a `START`/`VINT`) y se APPENDEA.

**3Q26 cargado (Ps. M):** ingresos 28,445.449; utilidad bruta 4,743.303; utilidad operativa 681.674; EBITDA 1,327.003; SBC 550.428; EBITDA ex-SBC 1,877.431; utilidad neta 23.255; OCF 2,765.158; capex 1,098.926; FCF (OCF - capex, derivado) 1,666.2; tiendas 3,765 (+141); SSS 20.5%; CD 25; rentas de edificios 638 (EBITDA ex-SBC tras rentas 1,239.4, 4.4%). Cuadre: 9M ingresos 22,860.346 + 26,037.292 + 28,445.449 = 77,343.087 = release. Tiendas 3,624 + 141 = 3,765. Nueva línea derivada FCF (trimestral y anual) en Results ▸ Cash flow, con la salvedad de que es antes de pagos de arrendamiento (~Ps.0.8B por trimestre en 2026) y que el OCF lo ayuda el financiamiento a proveedores. `gen_tbbb.py` regenerado; consenso BBG sin cambios (último snapshot 2026-09-09; `verify_preprint TBBB cons`: changed=0, blanked=0).

**Summit (`scripts/consensus/tbbb/build_tbbb_summit.py`):** submits 2025-12-12 (después de 3Q25), 2026-03-13 (4Q25), 2026-05-08 (1Q26), 2026-08-13 (2Q26). Líneas con base comparable: ingresos (anual), utilidad bruta, gastos de venta y de administración, SBC, utilidad neta, tiendas, SSS, CD. Se descarta: EBITDA (reconstrucción tras rentas que cambió de definición entre 8-may y 13-ago: FY2027 5,762 → 3,839 con ingresos iguales; FY2025 pasó de -18 a 1,921), ADJ_EBITDA, capex anual (el bloque no confirmado trae razones por tienda), trimestrales del primer submit desde 1Q26 en P&L (utilidad bruta negativa, EBITDA de -20,000). Las celdas trimestrales de un trimestre ya reportado son la proyección congelada previa al print (p. ej. 2Q26 utilidad bruta 3,986 vs 4,362 real); la columna 3Q26 del submit del 13-ago es el estimado de Summit antes del print (utilidad bruta 4,318 vs 4,743 real; tiendas 3,769 vs 3,765).
- `estMatrix.summit` (4 vintages) empalmado con `apply_matrix.py`; `summit` plano = submit del 13-ago. `verify_preprint TBBB summit` reporta cambios porque compara contra el lado Street; no se usó como compuerta.
- Evolution ▸ Estimates con ambas mitades sobre los 10 snapshots BBG; cada submit se ubica en el snapshot BBG más cercano (12-dic en 24-nov, 13-mar en 16-mar, 8-may en 11-may, 13-ago en 9-sep).

**Valuación (Submit History), secundaria:** solo EV/EBITDA (el P/E es #VALUE!/#SPILL! en todos y -US$78 en el primero). PT/FV/precio: 12-dic 42.95/37.56/33.01 (25x 2027); 13-mar 36.19/34.15/33.08 (25x 2027); 8-may 34.52/32.89/37.97 (25x 2027); 13-ago 62.85/58.85/49.37 (30x 2028). El salto del 13-ago mezcla tres cambios (múltiplo 25→30, año 2027→2028, definición de EBITDA). Dani (2-nov): los múltiplos quedan en segundo plano en TBBB porque la compañía reporta pérdidas por el SBC; el foco es financieros y fundamentales (por eso Target Multiple e Historic Multiple no se construyen ahora).

**Overview 3Q26:** Post-Results con 3Q26 **solo del release** (aviso en pantalla); 9 hilos de Notes con nota Q3 2026 ("release only"); bloque de SBC con Apéndices 1 y 2 de 3Q26 (calendario 2,376 / 879 / 215 / 50; conteo diluido 165,423,297 a US$53; Clase C convertida en Clase A); conteos 3,765 tiendas y 25 CD; Sensitivity con base y SBC del submit del 13-ago (porcentajes de margen del usuario intactos).

**Pendiente:** call del 3-nov (Post-Results completo, Notes, guía 2026, `docs/calls/TBBB.md`); más fundamentales (balance, arrendamientos, capital de trabajo por trimestre); Peers sin fuente; ANTAD 3Q26; Track Record (ratings por confirmar); outlier de utilidad bruta 4Q26. Dudas para el autor del modelo: definición del EBITDA y su cambio, acciones diluidas de 115M, P/E roto, etiqueta Bull/Base.

### 10b. Ajustes del 2026-11-03 (Summit trimestral de ingresos e intereses)

- **Ingresos trimestrales de Summit:** la fila REV trimestral del libro estaba en 0 (no se extraía). Dani pegó las estimaciones del modelo (submit del 13-ago) de 4Q23 a 1Q27 (11,910.8 … 29,475); se cargaron en `build_tbbb_summit.py` (bloque `MAN`) como el trimestral del submit del 13-ago; los trimestres ya reportados quedan como la estimación congelada previa al print. Desde el siguiente submit ya vendrá extraído. Los 4 trimestres de 2026 suman 104,228 contra 106,042 del anual del mismo submit (1.7%); se muestran ambos tal cual.
- **Ingreso y costo financiero:** no vienen en Summit (ni actuals); Dani pegó las estimaciones trimestrales: ingreso financiero 4Q24 a 4Q26 (50.8; 55.6 en 2025; 49.7 en 2026) y costo financiero 1Q25 a 4Q26 (163.54 … 596.33; sin 4Q24). Sin pronóstico después de 4Q26. Los actuals ya los tiene el dataset desde los releases. El consenso BBG sí trae ambas líneas (`IS_FINANCIAL_INCOME`, signo -1 porque Bloomberg las publica negativas; `IS_FINANCE_COST`), agregadas a `map_tbbb.json` en trimestral y anual.
- **Derivados de Summit:** `adminx` = administración menos SBC y `adds` = cambio en tiendas del propio modelo (solo 4Q26 en adelante).
- **Regla de 2 trimestres hacia adelante (4Q26 y 1Q27 tras 3Q26):** Summit cubre ingresos, utilidad bruta, ventas, administración, SBC, utilidad neta, tiendas, SSS, CD y adds en los dos; ingreso/costo financiero solo 4Q26 (sin pronóstico más allá). Sin Summit en ambos: utilidad operativa, EBITDA, EBITDA ex-SBC, OCF, capex, FCF, FX e impuestos (el modelo no los trae con base comparable). Sin consenso BBG: EBITDA ex-SBC, FCF, SSS, CD, gastos de venta/administración, FX, impuestos, rentas.
- **Consenso BBG refrescado (2026-11-03 09:32):** el archivo ahora trae **11 snapshots** (hasta 2026-11-03, el primero posterior al print de 3Q26; el snapshot que figuraba como 2026-09-09 aparece ahora como 2026-08-17). `estMatrix.cons` y Estimates regenerados; el submit del 13-ago de Summit se ubica en el snapshot del 17-ago.
- **Centros de distribución en el consenso:** Bloomberg sí trae pronóstico (`NUM_OF_DISTRIBUTION_CENTERS`, 4 trimestres y 3 años hacia adelante). Se había descartado como "serie congelada" por la heurística de pocos valores únicos, pero son enteros en un rango angosto y cambian en cada snapshot (p. ej. 4Q26: 24 en mar-26, 24 en may-26, 25 en ago-26, 25 en nov-26). Se carga; `emit_matrix.py` sigue marcándola FROZEN por esa heurística (falso positivo).
