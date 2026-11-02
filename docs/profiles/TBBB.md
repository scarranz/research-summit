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
| Avance | 0 de M unidades aprobadas (tablero §2; M se fija en la compuerta F0) |

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

## 1b. Mapa Summit (F0-SM)

⛔ Pendiente de acceso al MCP Summit en esta sesión y de la decisión de Dani sobre submit (ver §6). Mientras tanto no se escribe `js/summit-map/tbbb.js` ni se refresca ningún número Summit.

## 2. Tablero de unidades

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | 👀 | 2026-11-02 | | | Esta sección §1 espera compuerta |
| B1 | Inventario de contenido existente | 👀 | 2026-11-02 | | | §5; conteo de control 45 (código); falta contar en DOM del portal local |
| B2 | Mapa de reubicación | 📝 | 2026-11-02 | | | §5b propuesta; nada se mueve antes de aprobar |
| F0-SM | Mapa de métricas Summit | ⛔ | | | | espera MCP + decisión submit |
| F1 | Esqueleto + vista previa | ⬜ | | | | |
| OV-1…OV-7, OV-F | Overview (7 bloques + pie) | ⬜ | | | | ya existen estandarizados; se auditan vs §8, no se reconstruyen |
| EV-RES-DATA | Dataset de Results (números) | ⬜ | | | | rehacer trimestral + anual con BBG (10 snapshots) |
| EV-RES | Evolution ▸ Results | ⬜ | | | | |
| TL-GEN | Top Line ▸ General | ⬜ | | | | |
| TL-SEG | Top Line ▸ Segments | ⬜ | | | | Merchandise vs Recyclables (BBG kpi1/kpi2) |
| TL-OTH | Top Line ▸ Other | ⬜ | | | | |
| TL-CUS | Top Line ▸ Customers | ⏭️ propuesto | | | | retailer, sin SPLC (confirmar en F0) |
| EV-EST | Evolution ▸ Estimates | ⬜ | | | | BBG (10) + Summit congelado |
| EV-SET | Earnings ▸ Setup | ⬜ | | | | |
| EV-POST | Earnings ▸ Post-Results | ⬜ | | | | **2Q26 nuevo** (call + release + PPT) |
| EV-NOTES | Earnings ▸ Notes | ⬜ | | | | |
| BL-GEN-1…5 | Bottom Line ▸ General (5 bloques) | ⬜ | | | | |
| BL-SEG | Bottom Line ▸ Segments | ⬜ | | | | |
| BL-SPLC | Bottom Line ▸ Supply Chain | ⏭️ propuesto | | | | sin SPLC; Logistics/DC va en MISC |
| VA-HIST | Valuation ▸ Historic Multiple | ⬜ | | | | depende de `get-market-history` |
| VA-PEERS | Valuation ▸ Peers | ⬜ | | | | hay `B_PEERS` y scatter propio |
| VA-TM | Valuation ▸ Target Multiple / PEG | ⛔ | | | | espera Summit |
| VA-SUB | Valuation ▸ Submit History | ⛔ | | | | espera Summit |
| VA-SENS | Valuation ▸ Sensitivity Analysis | ⛔ | | | | existe matriz SSS×store growth; reubicar (B2 #36) |
| MG-TEAM / MG-OWN / MG-GOV / MG-TRACK | Management (4 sub-tabs) | ⬜ | | | | existe Corporate/Regional/Ownership & Dilution |
| MISC-* | Miscellaneous | ⬜ | | | | Store Tour, Logistics, Landscape, BİM, Unit economics (§5b) |
| F-FINAL | Cierre + conciliación B3 | ⬜ | | | | |

## 3. Decisiones del analista

- 2026-11-02 · rama · Se parte de `origin/main` actualizado, **no** del PR viejo (feat/tbbb-overview, >2–3 meses) — Dani.
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

## 6. Bloqueos y preguntas abiertas

- ⛔ **Snapshot Summit** (Dani revisa): lo cableado es 2026-05-22; el consenso ya llega a 2Q26 (2026-09-09). Mientras no haya snapshot con 2Q26, Summit queda como está y marcado con su fecha; no se inventa ni se mezcla. Mismo patrón que Mastercard (overview hecho sin submit).
- Acceso al MCP Summit en esta sesión: la herramienta no está disponible (solo `authenticate`). Dani decide si autentico o él lo corre.
- `get-market-history`: verificar si está desplegada (VA-HIST).
- Confirmar con Dani: base de EBITDA (Adjusted ex-SBC vs reportado) para Results/Bottom Line.

## 7. Historial de aprobaciones

(append-only; vacío)
