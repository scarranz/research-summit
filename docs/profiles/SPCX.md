# SPCX — bitácora de construcción del perfil

> Reglas: `docs/PROFILE_PLAYBOOK.md` §3. Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión ·
> 🔁 cambios pedidos · ✅ aprobada · ⏭️ omitida · ⛔ bloqueada.

| Campo | Valor |
|---|---|
| Empresa | Space Exploration Technologies Corp. (NASDAQ: SPCX) |
| Modo | A — empresa nueva, **exprés por bloques** (SAB, 2026-11-25: "velo haciendo por bloques completos para que no te tenga que estar dando autorización todo el tiempo") |
| Rama | `feat/spcx-profile` (worktree `C:\Users\santi\Developer\rs-spcx`, desde origin/main 3d75fab) |
| Analista responsable | SAB |
| Inicio | 2026-11-25 |
| Avance | Bloques 1 (Overview) y 2 (Miscellaneous) construidos 👀 · 0 aprobados |

**Publicación.** 2026-11-25: SAB autorizó subir SpaceX a GitHub ("sí súbelo a github"); rama pusheada, sin PR hasta que SAB lo pida.

## 1. Inventario de datos (F0) — 2026-11-25

| Fuente | ¿Existe? | Detalle | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | **por confirmar** | SAB la agrega con Add Company si no está | el perfil abre en el portal | todo (en el portal) |
| Filing anual | 424B4 (prospecto, Jun 12 2026) con FY2023–25 auditado; aún no hay 10-K (el primero será FY2026, ~feb 2027) | 10-Q Q2 2026; release Q3 2026 (Oct 20); 10-Q Q3 2026 | Overview, Results reportado, Top Line | — |
| Año fiscal / moneda | dic · USD | | | |
| Summit DCF | **no** | `search_ticker('SPCX')` sin resultados; existe `DCF SPCX.xlsm` (Oct 21) sin ingesta | — | Estimates (Summit), Target Multiple, Submit History, Sensitivity (⏭️) |
| Consenso BBG | **no en `BBG_CONSENSUS.txt`**; sí export propio `Research\DCF\Technology - SAB\SPCX\SPCX BBG CONSENSUS.xlsx` (Annual + Quarterly, 2023A–2030E, sacado 2026-11-25) | segmentos ≠ total y anual ≠ suma de trimestres (distintos contribuyentes) | consenso en Misc y, luego, en Results | `estMatrix.cons` por el pipeline estándar (hay que mapearlo a mano o agregar SPCX al workbook) |
| J.P. Morgan | 4 notas (Jul 7, Oct 21, FAQs nov, NVDA read-across Nov 18) en Drive `SOURCES` | modelo por segmento 2026–31 | referencia en Misc | — |
| `get-market-history` | desplegada (oct 2026) | | Historic Multiple en vivo | — |
| Massive (`liveQuote`) | por verificar en el portal con sesión | | market cap, peers, precio del modelo de escenarios | "live quote unavailable" / "Live data pending" |
| SPLC | no revisado | | | BL-SPLC |
| Transcripciones | llamadas Q2 y Q3 2026 en Drive (`SPACEX CALLS AND CONFERENCES.txt`) | | Earnings | — |
| Fiscal.ai | probablemente fuera del plan | | tabla de insiders en vivo | |

**Alcance acordado (SAB, 2026-11-25):** valuación solo con consenso + J.P. Morgan como referencia (sin modelo Summit).
Mucho del análisis va a Miscellaneous. Unidades que dependen de Summit → ⏭️ (EV-EST Summit, VA-TM, VA-SUB, VA-SENS).

## 2. Tablero de unidades

| Unidad | Estado | Fecha | Nota |
|---|---|---|---|
| F0 Inventario | 👀 | 2026-11-25 | arriba |
| F0-SM Mapa Summit | ⏭️ | 2026-11-25 | no hay modelo en el MCP |
| F1 Esqueleto | 👀 | 2026-11-25 | `js/overviews/spcx.js` registrado en `index.js`; `.ov-spcx` / `.ov-spcx-dd` en `selectors.css` y `overview.css` |
| OV-1 Key Facts | 👀 | 2026-11-25 | 10 celdas; market cap en vivo |
| OV-2 Lede | 👀 | 2026-11-25 | |
| OV-3 2×2 | 👀 | 2026-11-25 | |
| OV-4 How SpaceX makes money | 👀 | 2026-11-25 | segmento y geografía cuadran a $18,674M (424B4) |
| OV-5 Products & platforms | 👀 | 2026-11-25 | 7 familias |
| OV-6 Peer map | 👀 | 2026-11-25 | 8 nombres: SPCX, AMZN, RKLB, ASTS, IRDM, VSAT, CRWV, NBIS — denominadores de EDGAR (10-K/20-F FY2025; VSAT FY a mar-2026); solo trailing salvo SPCX y AMZN; las burbujas necesitan el precio en vivo (portal con sesión) |
| OV-7 Timeline | 👀 | 2026-11-25 | 10 hitos |
| OV-F Pie | 👀 | 2026-11-25 | |
| MISC-fin Financial Model | 👀 | 2026-11-25 | consenso BBG + 8 supuestos; JPM referencia |
| MISC-cash Funding | 👀 | 2026-11-25 | deuda nueva como plug; intereses vuelven al EPS |
| MISC-val Scenario Valuation | 👀 | 2026-11-25 | P/E, EV/EBITDA, DCF; Bear/Consensus/JPM/Bull; precio en vivo |
| MISC-si AI & Compute | 👀 | 2026-11-25 | |
| MISC-ship Starship & Launch | 👀 | 2026-11-25 | Flight 15 ship catch |
| MISC-conn Starlink | 👀 | 2026-11-25 | candidato a moverse a Top Line ▸ Segments cuando exista TL |
| MISC-orb Orbital Compute | 👀 | 2026-11-25 | |
| MISC-def Defense | 👀 | 2026-11-25 | |
| MISC-comp Competitive Position | 👀 | 2026-11-25 | |
| MISC-risk Risks | 👀 | 2026-11-25 | |
| MISC-tgt Stated Targets | 👀 | 2026-11-25 | 24 metas públicas de Musk/Shotwell/CFO con evidencia y estado; verificadas contra transcripciones (guía `SOURCES/ELON_MEDIA_GUIDE.md`) |
| MISC-src Sources & Open Questions | 👀 | 2026-11-25 | |
| EV-RES-DATA / EV-RES Results | 👀 | 2026-11-25 | `js/results-data/spcx.js`: trimestral 1Q25–4Q28 y anual 2023–2030; reportado (424B4, 10-Q, release Q3; 4Q25 derivado) + consenso Bloomberg (export propio, campo por campo, sin recomponer totales); guía 1Q27 revenue y 4Q26 capex; sin Summit |
| TL-GEN · TL-SEG · TL-OTH · TL-CUS | 👀 | 2026-11-25 | `js/segments-data/spcx.js`: 3 segmentos (Space, Connectivity, SI) con productos, KPIs, puentes (suscriptores × ARPU; MW × revenue por MW); Other: líneas, geografía, productos vs servicios; Customers: Customer A (gobierno, 20.9% 2025) y **Customer B (SI) 34.5% del revenue de 3Q26** (10-Q) |
| EV-EST Estimates | ⏭️ | | sin modelo Summit (solo consenso) |
| EV-SET · EV-POST · EV-NOTES Earnings | ⬜ | | bloque 3/4; Q3 2026 transcript disponible |
| BL-GEN · BL-SEG | 👀 | 2026-11-25 | vistas `blgen`/`blseg` en spcx-misc.js (motor chartBlock del dashboard): márgenes reportado vs consenso, estructura de costos, D&A y SBC; márgenes por segmento. Leen Results; costos del export BBG |
| BL-SPLC Supply Chain | ⬜ | | sin export SPLC de SPCX todavía |
| VA-HIST Historic Multiple | 👀 | 2026-11-25 | vista `vahist`: cierres diarios en vivo (Massive, get-market-history) desde el IPO; P/E, EV/EBITDA y EV/Sales sobre el consenso 2027E/2028E (una sola foto: la línea se mueve solo con el precio, se dice en pantalla); acciones de las portadas de los 10-Q, deuda neta de los balances |
| VA-PEERS Peers | 👀 | 2026-11-25 | mismo mapa y estado que OV-6 + tabla |
| VA-TM · VA-SUB · VA-SENS | ⏭️ | | sin modelo Summit |
| MG-TEAM · MG-OWN · MG-GOV · MG-TRACK | ⬜ | | bloque 4 |
| F-FINAL | ⬜ | | |

## 3. Decisiones

- 2026-11-25 · SAB · Modo exprés por bloques; aprobación por bloque, no por unidad.
- 2026-11-25 · SAB · Valuación solo con consenso Bloomberg + J.P. Morgan como referencia; sin modelo Summit.
- 2026-11-25 · SAB · "Mucho de esto va a ir en Miscellaneous": el modelo y las secciones temáticas del dashboard de Drive
  van como sub-tabs de Misc (MISC-fin … MISC-src).
- 2026-11-25 · Claude (propuesta) · Peers OV-6: SPCX, AMZN, RKLB, ASTS, IRDM, VSAT, CRWV, NBIS. Por defecto
  EV/EBITDA forward; el forward de SPCX es FY2027 porque FY2026 ya está 3/4 reportado. **Pendiente de SAB.**

## 4. Excepciones / desviaciones de la guía (para que SAB las vea)

- **Misc con 11 sub-tabs** (la guía propone 3 típicas). Es el dashboard de SAB portado tal cual por su pedido. El
  modelo vive en un módulo grande (`js/overviews/spcx-misc.js`, generado a partir de los archivos del dashboard de
  Drive) con su propio motor de gráficas (`chartBlock`, que ya cumple §17.2: zoom de dos ejes con doble clic,
  leyenda que oculta serie y la quita de la tabla, tabla bajo la gráfica en desplegable). Estilos en `css/spcx.css`,
  todo bajo `.spx` (no toca otros perfiles).
- **Starlink en Misc** mientras no exista Top Line; al construir TL-SEG se mueve o se enlaza (sin borrar).
- **Datos de sell-side en archivo** (J.P. Morgan y otros) con fuente y fecha en cada pie; el precio es en vivo.

## 5. Bloqueos y preguntas abiertas

- ¿Push a GitHub? (ver ⚠ arriba).
- ¿SPCX ya está en `companies`? Si no, SAB lo agrega con Add Company.
- ¿Agregar SPCX al workbook de consenso (`Consensus_Portal.xlsm`) para que Results/Earnings usen el pipeline estándar?

**Conexiones pendientes:** precio en vivo de SPCX (Massive) — si `liveQuote` no responde, Scenario Valuation muestra
"⚑ Live data pending".

## 6. Historial

- 2026-11-25 · F0 + F1 + Overview (bloque 1) + Miscellaneous (bloque 2) construidos y revisados en
  `harness-spcx.html` (local): 10 celdas de Key Facts, 11 sub-tabs de Misc construyen sin errores de consola ni
  NaN; con un precio de prueba inyectado solo en el navegador, la valuación coincide con el dashboard de Drive
  (Consensus P/E 20× 2028E → $192 hoy). Falta la vista en el portal real con sesión (SAB).
- 2026-11-25 · SAB ("hazlo") · MISC-tgt Stated Targets agregado (también en el dashboard de Drive). Bull = metas de Musk:
  13 GW a fin de 2027, ~$38/W → ~$500B de ARR de salida ("best guess", Baron 6-nov), costo ~60% de la industria
  (TomorrowX 18-nov). Flight 15: nave atrapada, **booster perdido** (NASASpaceFlight, Aviation Week) — corregido en
  Overview, Products y Starship & Launch. Verificación de cifras: 15 de 16 confirmadas en transcripciones/reportes;
  "<$100/kg en 2–3 años" no lleva fecha en la transcripción (se quitó la fecha).
- 2026-11-25 · SAB no podía dar de alta SPCX: Add Company busca solo en la lista S&P 500 y en Fiscal.ai (plan gratuito).
  Arreglo en `js/companies.js`: si no hay resultados y el texto parece ticker, se consulta `lookup-ticker` (Yahoo) y se
  ofrece la empresa. El alta la sigue haciendo el usuario con su sesión (Claude no escribe en la base).
- 2026-11-25 · Vista previa: `harness-spcx.html` ahora replica la ficha del portal (cabecera + Overview/Deep Dive) y se
  sirve en localhost:8000 (rama feat/spcx-profile), con la sesión de SAB → precio y market cap en vivo funcionan.
  Mientras SPCX no esté en `companies`, se revisa ahí; no hay nada que portar.
- 2026-11-25 · Bloque 3 (parte 1): Evolution ▸ Results construido con el motor `results.js` (dataset sin Summit, como DHR).
- 2026-11-25 · Bloque 3 (parte 2): Top Line construido con el motor `segments.js`; utilidad operativa por segmento agregada al dataset de Results.
