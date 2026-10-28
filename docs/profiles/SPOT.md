# SPOT — bitácora de construcción del perfil

> Reglas: `docs/PROFILE_PLAYBOOK.md` §3.
> Claude la lee completa al empezar cada sesión y la actualiza en cada aprobación (no al final).
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)

| Campo | Valor |
|---|---|
| Empresa | Spotify Technology S.A. (NYSE: SPOT) |
| Modo | B — reordenar existente (hay Overview + Deep Dive de 5 secciones desde jul 2026, PRs #46 · #67 · #76) |
| Rama | `feat/spot-deep-dive` (desde `origin/main` @ `d1b652d`, 2026-10-20) |
| Analista responsable | DAA (Daniel Alvarez) |
| Inicio | 2026-10-20 |
| Avance | 1 unidad aprobada (EV-RES-DATA) — el tablero se fija después de B1/B2 |

## 1. Inventario de datos (F0)

Revisado 2026-10-20. Estado: 📝 propuesta (pendiente de confirmar con el analista).

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | ✔ (se asume) | el perfil ya abre hoy (registrado en `js/overviews/index.js` como `SPOT`) | el perfil abre | — |
| Filing anual | ◐ por verificar | Spotify es **foreign private issuer** (Luxemburgo): 20-F anual + 6-K trimestral, IFRS. Falta bajar el 20-F FY2025 y anotar fecha/accession | Overview, Top Line, textos verbatim | — |
| Año fiscal / moneda | ⚠ | cierre 31 dic. **Reporta y guía en EUR** (también el DCF y el consenso). Regla de `results-data/spot.js`: no convertir a USD | — | Múltiplos con el precio en US$ del ADR: hay que convertir con FX declarado (Derivatives ya decidió no mostrar múltiplos para SPOT) |
| Summit DCF | ✔ | MCP autenticado 2026-10-20. **4 snapshots**: 2025-12-18 · 2026-02-09 · 2026-04-28 · **2026-08-05** (after Q2 - 2026; 13,192 datos; 54 etiquetas). ⚠ El código actual cita **"Aug 4"** y **"May 22"**: ninguno existe ya en el MCP (el de agosto es 08-05; el de 05-22 desapareció, igual que en META). Valuación limpia en los 4 (`quality_flags` vacío): **EV/EBITDA 20.5× y P/E 28×, 2027 Forward**, price target €561.15 / €517.91 (en EUR, como el modelo) | F0-SM, serie Summit, Estimates (4 vintages), Target Multiple, Sensitivity | — |
| Consenso BBG (`BBG_CONSENSUS.txt`) | ✔ **nuevo** | `SPOT US EQUITY`: **10 snapshots** (`data_as_of` 2024-04-28 → **2026-09-09**), EUR, escala M. Headline: Revenue, COGS, Gross Profit, Opex, G&A, S&M, R&D, Operating Income, Adj. EBITDA, interés, pre-tax, tax, Net Income, acciones, Diluted EPS, D&A, SBC, capex, CFO, FCF, recompras. KPIs: MAU total / Premium / Ad-supported, Premium ARPU, ingreso, COGS y GP por segmento (Premium · Ad-Supported), MAU y subs por 4 regiones. Hoy `results-data/spot.js` tiene `cons` casi vacío ("SPOT has no rows in BBG_CONSENSUS") → **quedó stale** | `estMatrix.cons`, Setup, Results con Street, export de Bottom Line | — |
| Encoding del archivo | ⚠ | `BBG_CONSENSUS.txt` ya no es UTF-8 (byte `0xb5`): `scripts/consensus/*.py` fallan con `UnicodeDecodeError`; se lee como `cp1252` | — | — |
| `get-market-history` (Massive) | ✘ desplegada | sigue sin desplegar (404, según `CLAUDE.md`) | Historic Multiple en vivo | Historic Multiple con "Live data pending" |
| SPLC | ❓ | no hay export de SPOT en el repo; Spotify es B2C (sin clientes concentrados); los proveedores son labels/publishers, no cadena de suministro | — | BL-SPLC probablemente ⏭️ |
| Transcripciones | ✔ | `SPOT CALLS.txt` (626 KB): Q2 2024 → **Q2 2026** + `SPOT Q2 2026.txt` (54 KB, 2026-08-04). Falta el 3Q26 | EV-POST, EV-NOTES, citas, Watch List | — |
| `docs/calls/SPOT.md` | ✘ | no existe | — | no hace falta si el consenso sale del archivo BBG |
| Fiscal.ai / Massive | ❓ | verificar en Pillars ▸ Management y `liveQuote` (Spotify cotiza en NYSE como acción ordinaria de un emisor extranjero, no ADR; el precio de `liveQuote` viene en US$ y los targets/modelo en EUR, así que no se comparan sin un FX declarado) | Management en vivo, market cap | — |

**Calendario:** el siguiente print es **3Q26** (hoy 2026-10-20; fecha aún no anunciada). Guía 3Q26 (de la call de 2Q26): 305M subs · MAU +11M · op. income €670M · GM 32.9%.

## 2. Diagnóstico del perfil actual (lo que está desactualizado)

Resultado de leer `js/overviews/spot.js` (4,504 líneas) y `js/results-data/spot*.js` contra `PROFILE_PLAYBOOK.md` y el perfil de TSM:

| # | Hallazgo | Dónde | Contra el playbook |
|---|---|---|---|
| 1 | **Management es un placeholder** ("🚧 In progress — Management is being built") | `deepDiveHtml` → `ddEmpty(...)` | regla 5: no hay sub-tabs placeholder; faltan MG-TEAM/OWN/GOV/TRACK |
| 2 | **Top Line no usa el motor** `segments.js`: 4 sub-tabs a medida (Users · ARPU & Pricing · Advertising · vs Netflix) | `mauBody` `arpuBody` `advertisingBody` `vsBody` | §10: General · Segments · Other · Customers con `segments-data/spot.js` |
| 3 | **Bottom Line tiene 1 sub-tab** (Product Mix) | `productMixBody` | §13: General (margins, bridge, op→NI, SBC, expense lines) · Segments · Supply Chain |
| 4 | **Valuation solo tiene 2 herramientas** (Price Sensitivity, 2029 Targets) | `sensPriceBody` `idtBody` | §14: Historic Multiple · Peers · Target Multiple/PEG · Sensitivity |
| 5 | **Earnings en formato viejo** (Setup · Watch List · Post-Results, `ceStyle()` inline, `WL_ROWS` en código) e **Investor Day 2026** como 4.ª sub-tab de Evolution | `ceSetupBody` `ceWatchBody` `ceResultsBody` | §12: Setup · Post-Results · Notes; Watch List en Supabase; Investor Day → Miscellaneous |
| 6 | **Consenso Street vacío** en Results aunque el archivo BBG ya trae 10 snapshots de SPOT | `results-data/spot.js` | §9: `estMatrix.cons` desde BBG |
| 7 | **Summit congelado al 2026-08-04**, no hay `js/summit-map/spot.js` | `results-data/spot.js` | §6.3 F0-SM |
| 8 | Inline `<style>` (`ddStyle`, `ceStyle`, `cePhaseStyle`, `ceGridStyle`…) y verde de marca `#1DB954` en las pestañas | `spot.js` | §3.1/3.3: tokens Summit; marca solo en el logo |
| 9 | Overview con bloques fuera del estándar (`fy25Glance`, scatter propio `spot-sc`) — por auditar contra OV-1…OV-7 | `stdOverviewBody` | §8 |
| 10 | Datos al 2Q26; el 3Q26 está por reportar | `CALL_EARNINGS` | §12 rutina por print |

## 3. Tablero de unidades

Modo B: antes de F1 van **B1 (inventario de lo que existe)** y **B2 (mapa de reubicación)**; el analista aprueba el mapa antes de mover nada. Las filas de construcción se fijan después.

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | 📝 | 2026-10-20 | | | este documento, §1 |
| F0-SM | Mapa de métricas Summit | 👀 (usado por EV-RES-DATA ✅; falta aprobación explícita del mapa y las 9 dudas) | 2026-10-20 | | | `js/summit-map/spot.js` + §1b; 54 etiquetas, 9 dudas |
| B1 | Inventario de contenido existente | ⬜ | | | | conteo de control |
| B2 | Mapa de reubicación | ⬜ | | | | |
| F1 | Esqueleto + vista previa | ⬜ | | | | |
| OV-1…OV-F | Overview (7 bloques + pie) | 👀 | 2026-10-20 | | | sin color (reglas SAB 19–20 oct): barras grises, títulos 2×2 en negro, acento --steel, peers navy; Key Facts: CEO con antigüedad, celda "IPO"; **⚑ OV-6: múltiplos de peers sembrados (stockanalysis 31-jul), contra la regla 10** |
| EV-RES-DATA | Dataset de Results (números) | ✅ | 2026-10-20 | DAA | | cons BBG (10 vintages, 120 celdas nuevas, blanked 0) · 4 líneas de usuarios · Summit 3Q26 re-congelado (MCP 08-05) |
| EV-RES | Evolution ▸ Results | 👀 | 2026-10-20 | | | para revisar en el portal local: Companies ▸ SPOT ▸ Deep Dive ▸ Evolution ▸ Results (nuevo grupo Users, picker de vintages BBG) |
| TL-GEN · TL-SEG · TL-CUS | Top Line (General · Segments · Customers) | 👀 | 2026-10-20 | | | motor `segments.js` + `segments-data/spot.js`; 2 segmentos (Premium, Ad-Supported), utilidad = **bruta**; precio × volumen (suscriptores × ARPU) con costo por unidad; ver §12 |
| TL-OTH | Top Line ▸ Other | ⏭️ | 2026-10-20 | DAA | | Spotify no publica un corte de ingreso útil más allá de sus segmentos (geografía de 3 cubetas, solo FY2025 en el repo) |
| EV-SET | Evolution ▸ Earnings ▸ Setup (3Q26) | 👀 | 2026-10-20 | | | **rehecho sobre la maquinaria canónica** (`spot-ce.js`): 9 headline + 8 KPIs propios, Street (BBG) · Summit (MCP 08-05) · fila "guide"; gráfica Setup con Street; notas actualizadas |
| EV-EST | Evolution ▸ Estimates | 👀 | 2026-10-20 | | | 4 vintages reales del MCP (12-18 · 02-09 · 04-28 · 08-05), años 2026–2029; Street = BBG guardado en cada snapshot |
| EV-POST | Evolution ▸ Earnings ▸ Post-Results (2Q26) | 👀 | 2026-10-20 | | | 17 tarjetas vs Street/Summit, Call Summary (7 comentarios + 14 preguntas de la transcripción 4-ago), Propose Notes (6), Also on the call (7) |
| EV-NOTES | Evolution ▸ Earnings ▸ Notes | 👀 | 2026-10-20 | | | 10 temas en 8 grupos; semilla = el registro de temas que vivía en `spot.js` + 2 temas de la call |
| BL-GEN-1…5 | Bottom Line ▸ General | 👀 | 2026-10-20 | | | `spot-bl.js` (copia de `tsm-bl.js`) + `spot-bl-data.js` + `spot-bbg.js`; EUR; ver §13 |
| BL-SEG | Bottom Line ▸ Segments | ⏭️ | 2026-10-20 | | | la única utilidad por segmento es la bruta y ya está en Top Line ▸ Segments; no hay utilidad operativa por segmento |
| BL-SPLC | Bottom Line ▸ Supply Chain | ⏭️ | 2026-10-20 | | | no hay export SPLC de SPOT |
| VA-TM | Valuation ▸ Target Multiple / PEG | 👀 | 2026-10-20 | | | 4 snapshots del MCP con la valuación del workbook tal cual (EV/EBITDA 20.5× · P/E 28×, 2027); Live con FX implícito |
| VA-HIST · VA-PEERS | Valuation | ⬜ | | | | HIST: `get-market-history` sin desplegar → "Live data pending"; PEERS: esperan denominadores (ver §6) |
| VA-SUB | Valuation ▸ Submit History | 👀 | 2026-10-28 | | | piloto del motor `js/submits.js` + `js/submits-data/spot.js`: 4 submits (18-dic-2025 fuera), P/E del 22-oct corregido a P80; precios por acción en US$ (ver §4) |
| VA-SENS | Valuation ▸ Sensitivity | 👀 | 2026-10-20 | | | `spot-sensitivity.js` (copia de `tsm-sensitivity.js`) + `spot-sensitivity-data.js`; EUR, sin precio en vivo, sin WACC; ver §14 |
| MG-TEAM · MG-OWN · MG-GOV · MG-TRACK | Management | ⬜ | | | | hoy placeholder |
| MISC-* | Miscellaneous | ⬜ | | | | candidatos: Investor Day 2026, SAX/Advertising, vs Netflix, $10 flow map |
| F-FINAL | Cierre y entrega | ⬜ | | | | |

## 4. Decisiones del analista

- 2026-10-20 · general · Spotify se queda en **EUR** en todo el perfil (consenso, DCF y guía vienen en EUR) — DAA
- 2026-10-20 · alcance · **Management va hasta el final** (F-FINAL). Prioridad: Overview + lo relevante para la earnings season (Results, Setup, Post-Results, Notes, Estimates, Watch List); después Top Line, Bottom Line y Valuation — DAA
- 2026-10-20 · EV-RES-DATA · Street = vintage previo con su fecha (el archivo solo guarda el snapshot posterior al print anterior); se quitó el 4,790 de 2Q26 compilado a mano y queda 4,795 (BBG 2026-05-03) — DAA
- 2026-10-20 · EV-RES-DATA · Se agregan MAU, suscriptores, MAU Ads y ARPU Premium a Results (actuals del export BBG, que coinciden con los decks: 4Q25 751/290/476/4.70; 1Q26 761/293/483/4.76; 2Q26 777/300/494/4.89) — DAA
- 2026-10-20 · EV-RES-DATA · Summit: se conserva la historia 1Q24–2Q26 (xlsm); 3Q26 se re-congela del MCP 2026-08-05 (rev 5,023.1 · Premium 4,511.6 · Ads 511.6 · op. income 672.5 · FCF 742.3) — DAA
- 2026-10-20 · orden · Results → Setup 3Q26 → Estimates → Post-Results/Notes 2Q26 → Overview — DAA
- 2026-10-20 · fuentes · Se parte del MCP de Summit (SPOT sí está, 4 snapshots) + el consenso BBG ya cargado (10 snapshots) — DAA
- 2026-10-28 · VA-SUB · Submit History: escalón por submit, un método a la vez (abre en P/E), objetivo en azul Summit (`--steel`, el de Key Facts; SAB lo corrigió desde `SUMMIT_CAT[0]`), precio en gris claro, fair value apagado al abrir, tablas horizontales (Submit detail + What the target was built on) — SAB
- 2026-10-28 · VA-SUB · Fuera el submit del 18-dic-2025 (EV/EBITDA a FY2029, P/E a FY2026 a 49×: mal armado) — SAB
- 2026-10-28 · VA-SUB · El P/E del 22-oct se congela en US$645.14 (celda P80 del workbook); el MCP traía 672.78 (Q80, año siguiente). Arreglo pendiente en el DCF (sección 6).
- 2026-10-28 · VA-SUB · Los precios objetivo de SPOT están en **US$** (el `px` de cada submit coincide con el cierre de Massive en dólares); el modelo sigue en EUR y la tabla de supuestos lo muestra en €. Excepción a "SPOT en EUR en todo el perfil", solo para precios por acción.

## 5. Excepciones aceptadas

(ninguna todavía)

## 6. Bloqueos y preguntas abiertas

- ✔ Branch de SAB encontrado 2026-10-20: `origin/feat/meta-profile` (bitácora META + `summit-map/meta.js` + 8 reglas nuevas del review de TSM en el playbook). Aplican a SPOT: Overview sin color · trimestres estimados que suman al año · producto concreto por segmento y precio × volumen (en SPOT: suscriptores × ARPU) · COGS separado de opex · Misc: Competitive position siempre. (Antes: no lo encontraba.) **Pendiente de mergear a main**: se trabaja con esas reglas leídas de la rama.
- ~~**No encontré el branch de SAB de hoy con META.** En `origin` y `mine` lo más reciente de SAB es el perfil de **TSM** (#146, 2026-10-16, hecho con el playbook) y `chore/company-profile-playbook` (2026-10-14). `feat/meta-restructure` es de julio. Se usa TSM + playbook como referencia de formato. Si el branch de hoy es local o está sin pushear, hay que pasarlo.~~
- ~~Autenticar el MCP de Summit~~ ✔ 2026-10-20.
- `BBG_CONSENSUS.txt` en cp1252: los scripts de `scripts/consensus/` necesitan `encoding='cp1252'`.

**Arreglos pendientes en el DCF (los hace SAB; anotado 2026-10-28):**
- [ ] `DCF SPOT.xlsm`, bloque P/E: con el año objetivo en FY2028 (dos años adelante), el price target que se guarda es Q80 (US$672.78), pero el fair value se descuenta de P80 (US$645.14). Dejar el target y su fair value en la misma celda/año y volver a hacer submit. En el portal el 22-oct va congelado con P80 y la nota "Corrected".
- (sin acción) El submit del 18-dic-2025 (EV/EBITDA a FY2029, P/E a FY2026 a 49×) ya no se puede arreglar: el workbook se sobreescribió. Sigue fuera.

## 7. Historial de aprobaciones

- 2026-10-20 · F0 · 📝 propuesta (sin aprobación todavía)
- 2026-10-28 · VA-SUB · 👀 construido y mostrado en el portal; SAB: "se va viendo bien" → commit 4e86056 (falta la aprobación formal de la compuerta)

## 1b. Mapa Summit (F0-SM)

📝 propuesta 2026-10-20. Archivo: `js/summit-map/spot.js`. Snapshot 2026-08-05, EUR, millones.

**Cuadres hechos:** REV FY25 17,186 = 4,190+4,193+4,272+4,531 (1Q25–4Q25 del dataset de Results) ✔ · 2026 proyectado 4,533+4,777+5,023+5,428 = 19,762 = anual ✔ · Premium+Ads 2026 17,829+1,933 = 19,762 ✔; 2027 20,885+2,234 = 23,119 ✔ · guía 3Q26 (rev 4,990–5,010 · GM 32.7–33.1% · op. income 669–671 · MAU 787–789) = punto de la call de 2Q26 (€5.0B · 32.9% · €670M · 788M) ✔.

**Dudas abiertas (para el autor del modelo):**
```
❓ SPOT · PREMIUM_COGS / ADS_COGS anuales — 2025 y 2026 proyectados = el ingreso del segmento (14,093 / 17,829 / 1,768 / 1,933) y 2027 cae a 13,512. Los trimestrales sí cuadran. Mientras tanto: costo anual = ingreso − GP.
❓ SPOT · EARNINGS FY25 — actual 2,212 (IFRS, = suma de trimestres) vs projection_history 3,234 (definición del modelo). Mientras tanto: actual del actuals_history; proyecciones rotuladas "Model earnings".
❓ SPOT · Premium/Ads FY25 — actual 15,350/1,836 (base vieja) vs projection_history 14,093/1,768: reclasificación de ene-2026 (nota de results-data). Mientras tanto: no mezclar bases en un mismo año.
❓ SPOT · CAPEX — signo: actuals negativos, proyecciones positivas. Se normaliza al cargar.
❓ SPOT · TAX_RATE — FY25 0.5% vs 10%/12%/22% proyectado. ¿Qué pasó en FY25 (beneficio fiscal)? Mientras tanto no se usa.
❓ SPOT · INT_EXP — proyecciones paran en FY25.
❓ SPOT · MAU / MAUPS / MAUAD / ARPU_* / COST_* — en cero en todos los periodos; los MAU y subs trimestrales reales vienen solo de EU/NA/LATAM/ROW_MAU(PS), y solo 4Q25–2Q26. Mientras tanto: usuarios y subs salen del dataset de Results (decks) y del consenso BBG.
❓ SPOT · MAUPS_GUIDANCE_* — vacío aunque Spotify guía suscriptores cada trimestre (3Q26: 305M). La guía de subs sale de la call.
❓ SPOT · Resultados "summit" en results-data (3Q26 ingreso 5,035) ≠ MCP 08-05 (5,023): el código se sembró de otro vintage del xlsm. Se re-congela desde el MCP.
```

**Valuación (get_valuation_history, 2026-08-05, Base):** EV/EBITDA 20.5× → price target €561.15 · P/E 28× → €517.91, ambos FY2027 Forward, en EUR. Sin `quality_flags` en ninguno de los 4 snapshots. El store también devuelve fair value, upside, precio al snapshot y WACC; **no se usan ni se muestran** (decisión DAA 2026-10-20: el portal no usa WACC ni valor descontado para los estimados de Summit). Historial: 2026-04-28 EV 20.5× €537.42 · P/E 28× €541.65; 2026-02-09 18× €498.84 / 20× €434.04; 2025-12-18 18× FY29 €936.41 / 49× FY26 €817.29.

## 1c. Consenso BBG listo para EV-RES-DATA

`scripts/consensus/map_spot.json` (nuevo) corre con `emit_matrix.py` y da **10 vintages** (2024-04-28 → 2026-09-09), 15 métricas trimestrales (ingreso, Premium/Ads, GP, op. income, EBITDA, NI, EPS, FCF, MAU, subs, MAU Ads, ARPU) y 9 anuales; 0 snapshots reimpresos, 0 series congeladas. ⚠ `emit_matrix.py` y `inspect_matrix.py` leen `utf-8-sig` y fallan con el archivo actual (cp1252): se corrió desde una copia parcheada; el parche es de una línea y va en PR propio de herramienta.

## 1d. EV-RES-DATA — cuadre (propuesta 2026-10-20)

**Trimestres ↔ año, FY2026, vintage BBG 2026-09-09** (regla SAB: los estimados suman al año dentro de cada fuente). Reportados 1Q26+2Q26 + estimados 3Q26+4Q26 vs el anual de la misma fuente:

| Métrica (€M) | 1Q26 | 2Q26 | 3Q26e | 4Q26e | Suma | Anual BBG | Dif. |
|---|---|---|---|---|---|---|---|
| Ingreso | 4,533 | 4,777 | 4,977 | 5,245 | 19,531 | 19,522 | +9 (0.05%) |
| Premium | 4,148 | 4,331 | 4,482 | 4,672 | 17,634 | 17,629 | +5 |
| Ad-Supported | 385 | 446 | 491 | 578 | 1,900 | 1,899 | +0.2 |
| Gross profit | 1,495 | 1,596 | 1,639 | 1,776 | 6,506 | 6,500 | +6 |
| Op. income | 715 | 655 | 678 | 828 | 2,876 | 2,874 | +2 |
| FCF | 824 | 797 | 849 | 913 | 3,383 | 3,380 | +3 |
| Net income | 721 | 545 | 599 | 720 | 2,585 | 2,589 | −4 |

Todas dentro de 0.05%, de signo mixto: es el redondeo normal de un consenso con distinto número de contribuyentes por trimestre, no un error de carga. Summit (MCP 08-05): ingreso 4,533+4,777+5,023+5,428 = 19,762 = anual ✔.

**Checks:** `verify_preprint.py SPOT` → same 0 · changed 0 · filled 120 · **blanked 0** ✔. Archivo BBG: 10 snapshots, 0 reimpresos, 0 series congeladas. Etiquetas de periodo y `close_*` por snapshot: sin desajustes (emit_matrix valida al cargar). Usuarios: una sola cifra por trimestre en los 10 snapshots y coinciden con los decks.

**Pendiente en esta unidad:** la matriz `summit` por vintage (los 4 snapshots reales) se arma con EV-EST; hoy el picker de Summit usa la serie plana.

- 2026-10-20 · EV-RES-DATA · ✅ aprobada por DAA — cuadre FY26 ≤0.05%, blanked 0, Summit 3Q26 desde MCP 08-05

- 2026-10-20 · EV-SET · 👀 Setup 3Q26: la rejilla pasa de 2 a 3 columnas (Guide · Street BBG · Summit). Street = vintage 2026-09-09 (posterior a la guía), con la diferencia vs guía; Summit se lee de `spotResults` (ya no tecleado). Notas reescritas donde citaban el modelo viejo: Summit pasó de 5,035/699/496/769 a 5,023/672.5/512/742 y de estar 4.3% sobre la guía de op. income a 0.4%; GM implícito 33.6% → 32.9% (el modelo ya carga el cargo regulatorio). Post-Results sigue puntuando contra la guía (EV-POST pendiente).

- 2026-10-20 · EV-EST · 👀 Estimates reconstruido desde el MCP: los vintages "May 22" y "Aug 4" que mostraba la pestaña **no existen en el MCP** (snapshots reales: 12-18, 02-09, 04-28, 08-05), se retiraron. Valores que tenían (se conservan aquí): ingreso FY26 19,775 / 19,694 · FY27 22,958 / 22,895 · FY28 26,605 / 26,531 · FY29 30,489 / 30,404; EBITDA FY27 4,048 / 4,052 · FY29 6,455 / 6,476; op. income FY27 3,714 / 3,710 · FY29 6,229 / 6,241; earnings FY27 3,076 / 3,074 · FY29 5,182 / 5,193; FCF FY27 4,119 / 4,134 · FY29 6,533 / 6,566 (orden: May 22 / Aug 4). Hallazgo: el snapshot del 08-05 revierte buena parte del recorte de out-years (FY29 ingreso +13%, EBITDA +18% vs abril) y el modelo vuelve a estar +11% (ingreso) y +25% (EBITDA) sobre el Street en FY29; la narrativa anterior ("el modelo convergió al Street") ya no vale y las notas se reescribieron.
- 2026-10-20 · hallazgo (para VA-SENS / VA-TM) · `spot.js` líneas ~1580 y ~1762 (Price Sensitivity y 2029 Targets) siguen basadas en el snapshot **2026-05-22**, que ya no existe en el MCP; hay que re-basarlas en 2026-08-05 cuando se llegue a Valuation. No se tocaron en EV-EST.

## 8. Earnings sobre la maquinaria canónica (2026-10-20) — qué se movió y dónde quedó cada pieza

Decisión DAA (2026-10-20): portar `tsm-ce.js` → `spot-ce.js` (Watch List en código, sin SQL: los hooks pasan a temas de Notes, que ya persisten en `company_theme_record`).

| Pieza que estaba en `js/overviews/spot.js` | Destino | Nota |
|---|---|---|
| `CE_CONS` (rejilla, solo guía) | `spot-ce-data.js` `SPOT_CE_CONS` | ahora se arma al cargar desde `results-data/spot.js`: Street BBG + guía + actuals + bases YoY/QoQ (bases reexpresadas de Premium/Ads tras la reclasificación de ene-2026) |
| `CALL_EARNINGS` (Q3 upcoming, Q2 reported: setup.notes, debate, results.notes/watch/thesisCheck/intoCall/priceReaction/summary, call.highlights) | `spot-ce-data.js` `SPOT_CALL_EARNINGS` | movido sin cambios; `us` se lee de Results; Q2 ganó `call.take/prepared/qanda/newQuestions` |
| `WL_ROWS` (11 hooks Q4-23…Q3-26) | retirado (git, commit `f52d20d`) | el Watch List canónico es Notes; los hooks reexpresan los temas del registro, no se fusionaron |
| `SPOT_THEMES` (8 temas) + `SRC_CALLS` | `themes-data/spot.js` | + `seg` por tema (8 grupos) + 2 temas nuevos de la call (Add-ons ARPU, Reserved) |
| `ceIRButton` (tarjeta IR/EDGAR) y el párrafo explicativo de dos fases | — | eran decoración copiada de GOOGL (colores de Google); los enlaces (IR e EDGAR CIK 1639920) quedan en el comentario de `spot.js` |
| ~2,260 líneas de renderizadores `ce*`/`wl*` | `spot-ce.js` (canónico) | `spot.js` pasó de 4,504 a 2,268 líneas |

**Lo que el formato canónico NO dibuja** (queda en los datos, sin perderse): `results.summary` (5 párrafos + notas), `results.thesisCheck`, `results.intoCall`, `results.priceReaction`. ⚑ Decisión pendiente del analista: ¿alguna de esas piezas debe tener lugar en el perfil (p. ej. `thesisCheck` como Notes o `summary` como "Also on the call")?

**Bugs de la copia canónica detectados (avisar a SAB):** `tsm-ce.js` línea ~1021 deja `stmt:ceStmtIdx(m.k)` dentro de un comentario → "Statement order" no ordena nunca (orden por sorpresa/indefinido); y el crecimiento sobre una base cero o negativa imprime absurdos (EPS 2Q25 = −0.42 → "−760%"). Corregido en `spot-ce.js`; no se tocó TSM.

**Otros hallazgos:** las notas de `results-data/spot.js` mostraban `<b>` literal (el motor las pinta como texto) — 46 etiquetas retiradas; el texto de Setup/Results decía "13 preguntas" pero la call tuvo 14 (10 analistas); la transcripción no trae speaker en la mayoría de las respuestas, así que las del Q&A nuevo van como "Management" salvo cuando la propia transcripción los presenta.

**Pendiente en esta tanda:** cierre del precio post-print (`priceReaction.close` sigue en null: no hay precio de cierre en el repo; no se inventa); `consensus-evolution` no se monta (no hay bloque SPOT, §12).

## 9. Overview sin color (2026-10-20) — qué cambió

Reglas de SAB (playbook §8 en `feat/meta-profile`, 19–20 oct): sin color categórico, un solo acento `--steel`, barras de OV-4 en grises claros con los montos en negro, títulos del 2×2 en negro, círculos de peers blancos con borde gris (la empresa, navy), sin tira de precio en vivo.

- `html()`: se quitó el `--brand:#1DB954` de la raíz; `css/overview.css` ahora define `.ov-spot { --brand/--brand-2: var(--steel) }`, `.ov-spot .q2-k` en `--navy` y el bloque `.gmm-neutral` (mismo texto que SAB agregó para META/TSM/AMZN).
- Se borraron los dos `<style>` en línea del Overview (`stdOverviewBody`, `stdPeerScatter`): todas sus reglas ya vivían en `css/overview.css` (playbook §3.3, A1). El quinto campo (color) de `GMM_SEG/GEO` ya no se lee y se quitó de los datos.
- `gmmBars` = la de `tsm.js` (ranking por tamaño, monto fuera de la barra si < 10%).
- Key Facts: celda 6 pasó de "Public since" a **IPO** (`Apr 2018 · NYSE direct listing`); CEO ahora con antigüedad (`Alex Norström (joined 2011) & Gustav Söderström (joined 2009) · co-CEOs since Jan 2026`, de la propia línea de tiempo); `SEC filer` = `Foreign (20-F/6-K)` (la verificación en EDGAR queda en el comentario).
- Tira de precio en vivo: **SPOT no la tenía** (market cap en Key Facts y `liveQuote` solo alimentan la celda y los peers).

**Excepciones abiertas (no se tocaron, hay que decidir):**
- ⚑ **OV-6 / VA-PEERS** — `S_PEERS` trae múltiplos P/E y EV/EBITDA **sembrados** (stockanalysis.com, leídos el 2026-07-31) y crecimiento; la regla 10 pide guardar denominadores con fuente (EPS/EBITDA de cada peer, del filing o de BBG) y calcular el múltiplo con el precio en vivo. Requiere esos denominadores para NFLX, TME, UMG, WMG, SIRI, DUOL, LYV (+ SPOT). Mientras tanto el mapa sigue como estaba.
- Los iconos de OV-5 son emoji (permitido por §8); los logos de los peers son el único color del mapa.
- Deep Dive: Top Line / Bottom Line / Valuation siguen con sus verdes `#1DB954` en gráficas propias; se resuelven al reconstruir cada sección con el motor y `SUMMIT_CAT`.

## 10. Valuation ▸ Target Multiple / PEG (2026-10-20)

Copia de `tsm-target-multiple.js` → `spot-target-multiple.js`; datos congelados en `spot-target-multiple-data.js` (MCP, 4 snapshots; `quality_flags` vacío en todos). Es la primera sub-tab de Valuation; las dos herramientas existentes (Price Sensitivity, 2029 Targets) siguen detrás, sin cambios.

| Snapshot | Después de | EV/EBITDA | P/E | Price target EV · P/E (€) |
|---|---|---|---|---|
| 2025-12-18 | 3Q25 | 18× FY29 | 49× FY26 | 936.41 · 817.29 |
| 2026-02-09 | 3Q25 | 18× FY27 | 20× FY27 | 498.84 · 434.04 |
| 2026-04-28 | 1Q26 | 20.5× FY27 | 28× FY27 | 537.42 · 541.65 |
| **2026-08-05** | 2Q26 | **20.5× FY27** | **28× FY27** | **561.15 · 517.91** |

**Corrección (DAA, 2026-10-20):** en la primera versión de este panel yo supuse que los targets estaban en US$ por ADR y agregué un FX "implícito"; era un error mío, sin verificar. Spotify cotiza en NYSE como **acción ordinaria de un emisor extranjero (no ADR)** y los targets del workbook están en **EUR**, consistentes con el modelo. Se quitó todo el FX, el precio en US$ y la comparación contra el precio en vivo.

**Tampoco se muestran WACC, fair value ni upside** (el portal no los usa para Summit): siguen en el archivo de datos congelado tal como los registra el store, y no se leen. El panel muestra múltiplo recorrido, price target registrado (€), el subyacente del modelo (€) y el PEG.

⚑ **Pregunta abierta para el autor del modelo (la muestra el pie del panel):** con las filas que el store guarda para el snapshot 08-05, EV/EBITDA (EBITDA FY27 × 20.5 + caja neta €9.4B, ÷ acciones) da €478 y P/E (EARNINGS ÷ SHARES × 28) da €448, contra los €561.15 y €517.91 registrados (+17% y +16%). Los targets se muestran tal como están; de qué base de EBITDA, EPS y caja neta salen no se puede recuperar del store.

## 11. Panes fuera de la estructura canónica — retirados (DAA, 2026-10-20)

Decisión de DAA: lo que no está en las estructuras de TSMC, META o AMZN y no está autorizado por las reglas de SAB **no va** en el perfil, aunque una versión anterior de SPOT lo tuviera. Esto reemplaza, para estas piezas, la regla de "reubicar sin borrar" del §4.2 del playbook (el analista autoriza el retiro de forma explícita).

| Pane retirado | Dónde estaba | Dónde se puede recuperar |
|---|---|---|
| Users · ARPU & Pricing · Advertising (SAX) · vs Netflix | Top Line | commit `f52d20d` (`js/overviews/spot.js`) |
| Product Mix · FY2025 at a glance | Bottom Line | idem |
| Investor Day 2026 | Evolution | idem |
| Price Sensitivity (WACC / g) · 2029 Targets | Valuation | idem |
| Placeholder "Management" | Deep Dive | — (vuelve al construir MG-*) |

Queda el Deep Dive con **solo lo construido**: Evolution (Earnings ▸ Setup · Post-Results · Notes · Results · Estimates) y Valuation (Target Multiple / PEG). Top Line, Bottom Line, Management y Miscellaneous reaparecen conforme se construyan con los motores (`segments.js`, etc.); ninguna sub-tab es un placeholder. `spot.js` pasó de 2,268 a 644 líneas (de 4,504 al inicio).

## 12. Top Line (2026-10-20)

Decisiones DAA (2026-10-20): (1) la "utilidad" del segmento es la **utilidad bruta** (Spotify reporta ingreso y utilidad bruta por segmento, no operativa); (2) **Other se omite** (⏭️); (3) **Customers se construye como hallazgo**.

**Archivos:** `js/segments-data/spot.js` (nuevo) · registro en `js/segments.js` (imports, `SEGMENTS_DATA.SPOT`, `THEME_SRC`, `THEME_SEG`) · Results: `premgp`/`adgp` trimestrales (Bloomberg Rep; **3Q25 derivado** del total del 20-F porque Bloomberg trae la cifra consolidada en el trimestre equivocado: 5,166 y 330 cuadran con la Nota 23) y una **vista anual** nueva (FY2023–FY2025 reportado, FY2026–FY2028 Summit congelado 2026-08-05) · montaje en `spot.js` (Top Line: General · Segments · Customers).

**Textos FILING (verbatim, 20-F FY2025, acc. 0001628280-26-006874, filed 2026-02-10):** cómo se organiza el negocio (Item 5, p.43), cómo gana Premium (Item 4.B, p.35–36: "Revenue from our Premium segment is a function of the price of our Subscription Offerings and the number of subscribers…"), cómo gana Ad-Supported (p.36/44), definiciones de MAU, Premium Subscribers, Ad-Supported MAU y Premium ARPU (p.46–47), y la frase de precios (p.35, p.47). **No leído:** el texto de la Nota 23 y la tabla de ingreso por geografía (la herramienta de lectura se corta antes de los estados financieros); por eso no hay definición de segmento de las notas ni corte geográfico.

**Precio × volumen (obligatorio):** Premium = subscriber-months × ingreso por subscriber-month (descomposición; el ARPU reportado cae dentro de ~1% del derivado en cada trimestre). Costo por unidad = costo de ventas Premium ÷ subscriber-months: €3.18 en 1Q24 → €3.17 en 2Q26 mientras el precio pasó de €4.56 a €4.87, así que lo que se amplió fue la utilidad bruta por suscriptor (€1.37 → €1.70). Ad-Supported: audiencia (MAU gratuitos promedio) × ingreso por MAU; "impressions × price" queda como **NOT CHARTED** (no se publica).

**⚑ Cambios al motor `segments.js` (compartido — conviene que SAB los revise en un PR de motor):** (a) símbolo de moneda tomado de `res.currency` (antes `$` fijo; sin `currency` sigue `$`); (b) unidad `count` (usuarios, millones) y su eje secundario en M; (c) el eje principal usa euros por unidad cuando la serie es `eps` (ARPU) y se oculta si solo hay series del eje secundario; (d) totales de grupo con un decimal bajo 20B; (e) la gráfica del top line de cada segmento conserva `currency`. Pendiente conocido del motor: escribe fijo "net sales" en las tarjetas y "No customer concentration is disclosed at all… no named customer anywhere in the filing" cuando `disclosed:false`; para SPOT esa frase es más fuerte de lo que verifiqué (leí Items 1–6, no las notas financieras) y la `note` del dato lo dice.

**Lo que no se hizo:** sección 5 de TL-CUS ("what each top customer buys"): el motor todavía no la dibuja y para SPOT nada la cuantifica; tabla SPLC: no hay export de SPOT; la "Bridge" de Premium se verificó en gráfica solo hasta que se abre la tarjeta (no la capturé).

## 13. Bottom Line (2026-10-20)

**Archivos:** `js/overviews/spot-bl.js` (copia adaptada de `tsm-bl.js`, que a su vez copia el cierre de AMZN: `aMarginsBody`, `aBridgeBody`, `aNetBridgeBody`, `aSbcBody`, `expenseTabsBody`, `aBlFootGeneral`) · `js/overviews/spot-bl-data.js` (líneas de gasto + SBC por función + 4 inmersiones) · `js/overviews/spot-bbg.js` (generado: `SUMMIT_DOCS="G:/My Drive/Summit/Docs/0" py scripts/bbg_extract.py SPOT`, asOf 9/9/2026; el parser lee con `errors='replace'`, sirve para cp1252) · CSS `.ov-spot-dd` copiado de `.ov-tsm-dd` al final de `css/overview.css` · pestaña + montaje en `spot.js` (más el toggle genérico de `rs-collap`, que faltaba).

**Vistas (apiladas, sin selector):** Profitability & margins · The bridge (Build-up €B · Margin change bps · Forward con 4 sliders) · Operating income → net income · Stock-based compensation & dilution · colapsable Expense lines (4 pestañas) · pie.

**Datos de las líneas de gasto (histórico):** el export de BBG solo trae 3 años y 5 trimestres reportados, así que se **cosen las columnas reportadas de los 10 snapshots que ya están en `BBG_CONSENSUS.txt`** (el más nuevo gana): FY2021–FY2025 y 1Q23–2Q26, sin ninguna consulta nueva a Bloomberg. Cuadra al 0: ingreso − costo de ingreso − R&D − S&M − G&A = utilidad operativa en cada año y cada trimestre, los 4 trimestres suman el año, y FY2023–FY2025 coinciden con el estado de resultados del 20-F. Spotify no tiene línea "other operating": no hay barra "Other" (solo el residual de redondeo del consenso en el modo Forward, que se dibuja únicamente si es visible).

**Del 20-F FY2025 (acc. 0001628280-26-006874), verbatim:** Item 5 (costo de ingreso Premium / Ad-Supported, R&D, S&M, G&A y sus explicaciones), definiciones de "Components of our Operating Results", nota de SBC por función (€5/138/62/42M en 2025, total 247; 2024: 5/152/61/49; 2023: 5/194/66/56), costo social del SBC (€125M vs €291M, Item 3.D), empleados promedio y severance 2023 (nota de gastos de personal). **De la llamada Q2 2026 (4 ago):** margen bruto, guía de 3T, ~€200M de opex incremental (marketing + IA), headcount plano, "compute y marketing".

**Decisiones propuestas (reversibles):**
1. **SBC se incluye** (BL-GEN-4): es material en Spotify (~11% de la utilidad operativa FY2025), a diferencia de TSM. Dilution = barras SBC + acciones diluidas del consenso (sin línea Summit: el modelo congelado no trae acciones); SBC by line = solo años reportados (el 20-F da el reparto, el export no).
2. **Net income walk con una sola barra** "Non-operating, net" (= pretax − op. income): el export no divide ingreso/costo financiero ni cambios de valor razonable. Se puede abrir con el estado de resultados del 20-F (R4) si el analista lo quiere.
3. **BL-SEG ⏭️**: Spotify solo reporta utilidad **bruta** por segmento y ya vive en Top Line ▸ Segments. **BL-SPLC ⏭️**: sin export SPLC.
4. Sin modo "Normalized" (no hay ganancia no operativa recurrente identificada en el export).

**Pendiente / no leído:** Item 6.D (headcount a fin de año) y notas de D&A por función no se alcanzaron en la lectura del 20-F (solo promedio de empleados); la comparación 2024 vs 2023 de Item 5 remite al 20-F anterior (solo cifras de la tabla). Summit: líneas anuales de op. income / GP / FCF congeladas en `results-data` (snapshot 2026-08-05); EBITDA y net income no tienen línea Summit.

## 14. Valuation ▸ Sensitivity (2026-10-20)

**Archivos:** `js/overviews/spot-sensitivity.js` (copia adaptada de `tsm-sensitivity.js`) · `js/overviews/spot-sensitivity-data.js` (un snapshot Summit congelado + caja neta) · CSS `.ov-spot-dd` al final de `css/overview.css` · sub-tab en `spot.js`.

**Datos:** snapshot Summit 2026-08-05 (después de 2Q26), jalado del MCP el 2026-10-20 (`projection_history`, EUR M): `PREMIUM_REVENUE` + `ADS_REVENUE` (suman `REV` al euro en 2026–2029), `OP_INCOME`, `EBITDA`, `EARNINGS` (definición del modelo, no IFRS), `TAX_RATE`, `SHARES`. Base 2025 = ingreso reportado por segmento (`results-data/spot.js`). Street = BBG (`spot-bbg.js`, segmentos 454645 Premium / 454644 Ad-Supported, FY2026–28; FY2029 cae al modelo y la franja lo dice). Múltiplo de salida arranca en el del modelo (20.5× EV/EBITDA · 28× P/E, FY2027).

**Decisiones (reversibles):** (1) drivers = crecimiento de Premium, crecimiento de Ad-Supported, margen operativo consolidado, múltiplo (Spotify reporta utilidad *bruta* por segmento, no operativa → un solo margen, estructura de la nota de TSM/SN). (2) **Sin precio en vivo ni ± vs precio**: la rejilla se lee contra el caso base (no hay FX ni se compara contra el precio en US$). (3) **Caja neta €9.4B** de la llamada Q2 2026 ("€9.4 billion cash and cash equivalents and no debt other than lease liabilities"): redondeada, sin arrendamientos ni inversiones de corto plazo; el modelo Summit no trae línea de deuda neta. Si el analista prefiere el balance del 6-K de 2Q26, se reemplaza `SPOT_NETCASH`.

**Cuadre con Target Multiple:** el caso base de la rejilla (FY2027, 20.5×) da ≈ €478 y a P/E ≈ €448; el PT registrado en el workbook es €561.15 / €517.91 y se muestra en Target Multiple. No coinciden y no se fuerza: la rejilla valúa el año a un múltiplo de salida; el PT del workbook es otro objeto (pregunta abierta para el autor del modelo). El pie lo dice.

## 15. Corrección de moneda (DAA, 2026-10-20, tarde)

El workbook registra los **price targets y el precio de cada submit en US$** (la acción cotiza en US$ en NYSE); las líneas del modelo (ingreso, EBITDA, utilidad, EPS, caja neta) siguen en EUR. Se corrige lo anterior (§10 y §14 decían "todo en EUR"): los PT se muestran **tal como están registrados, en US$**; los valores por acción que el portal deriva del modelo en EUR (Target Multiple modo *Live* y la rejilla de Sensitivity) se **multiplican por el último EUR/USD disponible**: 1.1215 US$ por EUR (BCE, archivo diario `eurofxref-daily.xml`, 2026-10-20) en `js/overviews/spot-fx-data.js` (constante fechada, se refresca reemplazando el bloque). Con eso Live da ≈ $536 (EV/EBITDA) y ≈ $502 (P/E) contra los PT registrados $561.15 / $517.91 (+4.6 % / +3.1 %); sigue sin coincidir y no se fuerza (el tipo de cambio, el EBITDA/EPS y la caja neta que usó el workbook no son recuperables del store; pregunta abierta para el autor del modelo). Sigue sin WACC, sin valor justo descontado y sin precio en vivo.

## 16. Revisión de Bottom Line / Results (DAA, 2026-10-20, noche)

Observaciones del analista tras ver el portal: consenso ausente en el pasado, guías faltantes (gross margin, MAU, subs), métricas con snapshots de Summit que no aparecían, Road to the print ilegible. Lo encontrado y lo hecho:

| Hallazgo | Causa | Acción |
|---|---|---|
| Ejes de Results en **$** con datos en euros | `results.js` pasaba `m.cur` (indefinido en SPOT) en 4 de los 5 sitios que dibujan ticks; el quinto ya usaba `rsCur(m)` | los 4 llaman ahora a `rsCur(m)` (cambio de motor compartido, 4 líneas; datasets sin `currency` siguen en `$`) |
| Road to the print sin línea Summit, 4 snapshots | `estMatrix.summit` no existía para SPOT | `scripts/consensus/map_summit_spot.json` + 4 volcados del MCP (2025-12-18, 02-09, 04-28, 08-05) → `emit_summit_matrix.py` → `apply_matrix.py`. Ahora 7 puntos en 2Q26 (4 BBG + 3 Summit) |
| Summit "no modela" MAU/subs | **sí**: solo el snapshot 2025-12-18 trae MAU 761.2 / subs 295.1 / MAU ad-supported 466.2 para 4Q25 (y anuales); los tres posteriores tienen esas filas en cero | 4Q25 cargado como Summit pre-print; sin línea después de 4Q25 (no hay dato) |
| Snapshot 2025-12-18 y trimestres futuros | los trimestres 2026+ repiten el de 1Q26 (1Q27 = 1Q26) y no cuadran con el anual | `emit_summit_matrix.py` ganó `horizon` y `drop_repeat_quarters` (opcionales, por config): se conserva solo 4Q25 de ese vintage y se descartan celdas Premium repetidas |
| Guías faltantes | `guideLo/Hi` solo desde 4Q25 (MAU) y 2Q26 (subs) | leídas de las llamadas Q4'23 → Q2'26: MAU, subs, ingreso, GM y utilidad operativa para **cada trimestre 1Q24–3Q26** (los 4 existentes coinciden) |
| Gross margin "no se puede graficar" | era falso: TSM lo grafica como métrica `pct` | nueva métrica `gm` (Gross Margin as guided) en Margins & Profitability |
| Gross profit sin guía | Spotify guía margen, no GP | guía GP = margen guiado × ingreso guiado (derivado, así dicho en la nota); GP Summit = suma de los dos segmentos pre-print |
| MAU ad-supported sin guía | no se guía | guía derivada = MAU guiado − subs guiado + solapamiento (subs + MAU ad − MAU total, 12–17M, mantenido al último trimestre reportado); nota explica por qué no suman y que Summit asumió solapamiento cero |
| Bottom Line sin consenso ni Summit históricos | el gráfico solo traía BBG para años/trimestres futuros | `spot-bl.js`: consenso y Summit **pre-print** de cada periodo reportado (regla del motor `preprint`) + guía como marcadores; trimestral usa el dataset de Results |

**Límites reales de datos (no son bugs):** (1) el archivo BBG más antiguo es 2024-04-28, ya posterior al print de 1Q24 → no hay consenso pre-print de 1Q24 ni FY2023; (2) Summit solo tiene 4 snapshots → Summit pre-print solo para 4Q25–3Q26 y FY2025; (3) el modelo no tiene EPS ni utilidad neta trimestral. 2Q25–2Q26 vienen del 20-F/6-K, no de snapshots nuevos.

**Pendiente de revisión del analista:** las dos guías derivadas (GP y MAU ad-supported); si prefiere no mostrarlas como "Guidance", se quitan de `guideLo/Hi` y quedan en la nota. Distinto y no tocado: en el motor, las etiquetas de barras negativas chocan con el eje en "Actuals vs Estimates" (2Q25).

## 17. Limpieza de restos del formato anterior (DAA, 2026-10-21)

Las tandas anteriores agregaron la estructura canónica pero dejaron piezas que ya nada dibuja. Retirado (todo recuperable en git, commits `f52d20d` y `105f722`):

- `spot.js`: `ID_NEWS` (tarjetas "What's new"), `NEWS_DETAIL_DEFAULT`, `newsViz`, `newsDetailHtml` (~95 líneas sin llamador); cabecera del archivo reescrita (hablaba de "Product Mix" y de dos sub-tabs que ya no existen); comentario de `wireModal` sobre `sax`/`news`.
- `css/overview.css` (−323 líneas): bloques `.spot-*` (euro bar, fmt bars, vs Netflix, Investor Day, news, SAX, flujo TTD), `.ov-spot .ovg-*`/`.ovs-*`, `.idt-pnl-*`, `.pr-table`/`.pr-usdwrap` (ARPU) y `.spl-*` (Price Sensitivity). Ninguna clase tenía uso en JS.
- `spot-ce-data.js`: `results.thesisCheck`, `intoCall`, `priceReaction`, `summary` del Q2 2026 (el formato canónico no los dibuja; la decisión pendiente del §8 queda resuelta: se retiran).
- `spot-wl-legacy.js` borrado (los hooks del Watch List viejo; los temas viven en `themes-data/spot.js`).

Agregado por consistencia con AMZN/TSM: `headerSources` (logo IR + sello SEC/EDGAR en la cabecera de la empresa).

## 18. Consenso de hoy (2026-10-21)

DAA actualizó `BBG_CONSENSUS.txt` con una fila **viva** de SPOT (primera de las 11; `data_as_of` en blanco, fechas de cierre como serial). Regla del analista: el consenso del Setup es **el más reciente que exista, aunque sea de un día antes del call**, no el de días después del print anterior.

- `scripts/consensus/emit_matrix.py`: una fila con `data_as_of` en blanco se fecha por la fecha del archivo (hoy, 2026-10-21); además el `.txt` se lee con `errors='replace'` (trae un byte cp1252 y el lector estricto fallaba).
- Regenerado y empalmado (`emit_matrix.py` → `apply_matrix.py` → `verify_preprint.py`: filled=220, changed=0, blanked=0). Nuevo vintage `2026-10-21` en `estMatrix.cons`.
- La primera exportación de la fila venía cortada (solo Revenue/Gross Profit, por un error al agregarla); DAA la corrigió y se volvió a correr todo: las 19 métricas trimestrales y las anuales traen el vintage `2026-10-21` (verify: filled=220, changed=0, blanked=0). El Setup de 3Q26 queda 100% sobre el consenso del 21-oct.
- `js/overviews/spot-bbg.js` regenerado desde la fila de hoy (`bbg_extract.py SPOT`; una fila con `data_as_of` en blanco se fecha por el archivo → asOf 10/21/2026). 445 de 1,006 celdas cambiaron, todas en estimados (años y trimestres forward); ninguna columna reportada se movió. Lo leen Bottom Line (Street de la gráfica forward) y Sensitivity (Street FY26–28 por segmento).
- **Un snapshot por print:** la fila del 21-oct reemplaza a la del 9-sep (misma ventana post-2Q26), no se suma. `map_spot.json` ganó `"supersede_latest": true` y `emit_matrix.py` lo aplica solo a SPOT: quedan **10 vintages** (2024-04-28 → 2026-10-21), igual que antes. La fila del 9-sep sigue en el `.txt` como archivo, pero ya no entra a `estMatrix`.

## 19. Top Line, segunda pasada (DAA, 2026-10-21)

Problemas vistos en Top Line y qué se hizo (el motor `segments.js` es compartido: los cambios no alteran AMZN/TSM, verificado con `harness-tsm`):

| Hallazgo | Causa | Acción |
|---|---|---|
| General sin forecast trimestral (TSM sí: 3Q26–2Q27) | el eje de SPOT era solo trimestres reportados y Results terminaba en 3Q26 | `results-data/spot.js`: +4Q26, 1Q27, 2Q27 con el snapshot Summit 2026-08-05 (rev, Premium, Ads, GP, op. income, EBITDA, FCF); eje del segmento hasta 2Q27. El Setup sigue acotado a 3Q26 (`spot-ce-data.js`). |
| Historia desde 1Q24 | el dataset de Results arranca en 1Q24 | `segments-data/spot.js` ▸ `history`: 1Q23–4Q23 de las columnas *reportadas* del snapshot BBG más viejo (2024-04-28): rev, Premium, Ads, GP por segmento, subs, MAU, ad-MAU, ARPU. Cuadra: Premium + Ads = total en cada trimestre; 1Q24 = Results. |
| Subs/ARPU/MAU sin forecast | el modelo Summit no los trae (solo 4Q25) | campo `fwd` en esas 4 métricas de Results = Street BBG 2026-10-21 (3Q26–2Q27); el motor lo lee solo donde no hay `summit` ni `act`. |
| "Share" y "€B" en KPIs (counts, ARPU) | los controles eran los mismos para todo | `modesHtml`: sin series monetarias el primer botón es **Level** y no hay "Growth in € added"; **Share** solo aparece si hay base (`shareBase`: subs y ad-MAU sobre MAU total → "% of MAU"); ARPU no tiene common size. Las opciones siguen lo que está dibujado. |
| Customers con panel "Who has said they buy from… SPLC not loaded" | estado vacío genérico del motor | `customers.splc: false` en SPOT: B2C, no hay censo contraparte; la sección no se dibuja. |
| Pie de tabla decía "US$ billions" | texto fijo | usa la moneda del dataset (TSM sigue en US$). |

Observaciones abiertas: (1) el modelo Summit 2026-08-05 trae 1Q27 muy por debajo de 4Q26 (ingreso 4,829 vs 5,428; Ads 385 vs 590): se muestra tal cual, sin ajustar. (2) Las tarjetas de General leen el último periodo del eje, que ahora es 2Q27 (forecast), igual que TSM. (3) Antes de 1Q23 no hay datos de segmento en el repo.

## 20. Summit user and unit-economics estimates (2026-10-21)

The Summit model rows for MAUPS, MAUAD, MAU and ARPU_PREM exist in the 2026-08-05 snapshot but are zero in every period (checked through the MCP), so no Summit users forecast was loaded before. The analyst supplied the last Summit estimate before each print:

- Quarters: 4Q26, 3Q26, then 2Q25 back to 3Q23. 3Q25-2Q26 were not supplied. Identified by reproducing each column from the Summit rows (4Q26: Premium revenue 4,838.4 / 319.0 subscribers = 15.17; Ad revenue 590 / 526.4 = 1.12; cost per user = (revenue - gross profit) / users = 9.86 and 0.86).
- ARPU and cost per user are quarterly, on end-of-period users, in EUR (the analyst wrote $; Summit SPOT is EUR). They are not Spotify's reported ARPU (monthly, average subscribers).
- `results-data/spot.js`: Summit arrays for `subs` and `admau` filled (1Q24-2Q25, 3Q26, 4Q26); new metrics `parpu`, `pcpu`, `aarpu`, `acpu` (reported quarters computed from the published lines).
- `segments-data/spot.js`: `historySummit` holds 3Q23/4Q23 (not drawn: Results axis starts 1Q24); four KPI cards added.

- Reproducibility: only 3Q26/4Q26 (and about 3Q24) reproduce from the Summit revenue and gross profit rows in the dataset; the other supplied quarters come from different model vintages (the model logic changed), so they are stored as supplied. Premium + Ad-Supported does not equal MAU (overlap), which is why user-based ratios never tie exactly.

## 21. No Summit quarterly forecast for 2027
Summit has made no quarterly forecast beyond 4Q26 (the 1Q27/2Q27 values in the 2026-08-05 snapshot, e.g. the 1Q27 revenue dip, are not forecasts; they were removed from `views.q` and `estMatrix.summit`). Consensus keeps 1Q27/2Q27 on the Results axis. The Top Line axis ends at 4Q26 (two forecast quarters). Top Line charts open with the Summit and Consensus chips on (`defaultHidden: []` in the segments dataset; the engine reads it, TSM keeps the old default). FY2026-FY2028 annual Summit values are unchanged.

## 22. Margin lines on the gross-profit charts
On Gross Profit metrics the chart draws three margin lines on the right axis (margin of each series over its own revenue: solid dark = Actual, dashed blue = Summit, dotted grey = Consensus). The legend had one chip that did not say so, and the tooltip rows were just "Margin % (...)". `js/results.js` (shared engine): the chip now reads "<margin label> % · right axis: solid line Actual, dashed Summit, dotted Consensus" and the tooltip rows carry the metric's margin label. Wiring the Summit and Consensus chips on by default (section 21) is what made the three lines visible at once; the margin chip hides all three.

## 23. Top Line cleanup after review (2026-10-21)
- The supplied ARPU and cost figures are quarterly; the reported ARPU is monthly. Summit ARPU now lives in the existing `arpu` series as the supplied figure divided by three (so it sits next to reported and Street on one basis). The separate Premium ARPU series and the five "(ours)" KPI cards were removed. Cost per user stays as Results-tab series only (`pcpu` per subscriber-month, `aarpu`/`acpu` per ad MAU); Top Line carries only the published KPIs.
- Margin lines (three series, second axis) open OFF on the segment charts (`defaultHidden: ['margin']`); the chip turns them on.
- "Revenue interactions" opens on growth rates (`bridgeGrowth: true`): one axis, one unit, Premium and Ad-Supported identical in form. Levels are one click away. Chip colours now follow what is drawn.
- Open: the forecast quarters of the bridge draw only the target (the terms have no Summit value for 3Q26-4Q26); Premium and Ad-Supported still differ in content where the business does (3 vs 2 product lines, 1 vs 2 relations).

## 24. Revenue interactions, rebuilt (2026-10-21)
- Both segments now carry the same single relation, built only from published lines: Premium revenue = subscribers × revenue per subscriber; Ad-Supported revenue = ad-supported MAUs × revenue per ad MAU (per quarter, on quarter-end users). Subscriber-months, average-MAU drivers and the "Impressions × price" relation (Spotify discloses neither) are removed.
- The chart opens as an INDEX (first quarter shown = 100) on one axis (`bridgeIndex: true`, new `idx` mode in `js/segments.js`, offered only on the bridge, with Growth as the alternative). Growth is no longer the default. The terms now carry the 3Q26/4Q26 forecast, because they come from the Summit-supplied users and Summit revenue.
- Series are labelled "Premium revenue" and "Ad-Supported revenue" (results `short` renamed).
- `js/results.js`: with Values On, a bar narrower than its label (three series per period) prints the number above the bar in dark ink, staggered by series, instead of white text on the white page.

## 25. Premium and Ad-Supported mirrored
Each segment now carries the same two KPI cards, users and revenue per user (Premium: Subscribers and Premium ARPU; Ad-Supported: Ad-Supported MAUs and Revenue per Ad-Supported MAU, derived and labelled so), and the same single relation with the same Index chart. The Total MAUs card was removed from the Ad-Supported tab; total MAU stays as the base of the "% of MAU" view. Reference check: `origin/feat/meta-profile` (2026-10-20) has `bridges: []` on both Family of Apps and Reality Labs; its two Family of Apps relations are listed as NOT CHARTED, and its KPI cards are ARPP, impressions growth and price-per-ad growth. SPOT charts its relation because users and revenue are published in levels.

## 26. Same calculation structure in both segments
Both segments follow the same DCF structure: users, revenue per user (ARPU) and cost per user, so each Top Line carries the same three KPI cards on the same basis (euros per month, the quarterly quotient divided by three, as the reported ARPU is): Premium Subscribers / Premium ARPU / Premium cost per subscriber; Ad-Supported MAUs / Ad-Supported ARPU / Ad-Supported cost per MAU. Results series renamed to match (`aarpu`, `acpu`, `pcpu` now monthly). The Revenue interactions derived terms use `div: 3` (new option in `sgDerived`) so they read per month as well. Before this, Premium ARPU was monthly and Ad revenue per MAU was quarterly, and the cost-per-user series were missing from the Top Line.

## 27. Correction of the supplied quarters, SAB/META alignment (2026-10-21)
- The ten supplied columns are 4Q26, 3Q26, 2Q26, 1Q26, 4Q25, 3Q25, 2Q25, 1Q25, 4Q24, 3Q24 (not 3Q23-4Q23): each column reproduces the Premium revenue and gross profit of the model's `projection_history` sheet (8/5 snapshot). The earlier placement (2Q25 back to 3Q23, 4Q26/3Q26) was wrong and is replaced; `historySummit` (3Q23/4Q23) is removed. Premium and Ad-Supported gross profit 1Q24-3Q25 supplied by the analyst are loaded (gp = sum). Open: `premrev`/`rev` Summit values already in the dataset for 1Q24-3Q25 do not match `projection_history` (e.g. 1Q24 Premium revenue 3,170.0 vs 2,820.8) and their source is not traceable.
- Per the META branch (`origin/feat/meta-profile`, playbook TL-GEN / TL-SEG): General cards show the last REPORTED quarter (engine change merged); "KPIs the company publishes" lists only published KPIs, so the derived ARPU-per-MAU and cost-per-user series left the cards (they live in the relation's table and in Results); price x volume is the Revenue interactions relation of both segments. Total MAUs card restored (published).
- Revenue interactions chart = growth drivers (index mode removed): YoY revenue growth split into users and revenue per user, plus total growth line; slate greys via the dataset `ramp`. KPI chart: a lone non-money series is a solid dark line on the main axis.

## 28. Revenue interactions: Lines and Growth drivers, both working (2026-10-21)
- The relation chart has two views with working toggles in both segments: Lines (default; the three series, each divided by its own first quarter = 100 so one axis serves users, revenue per user and revenue; the legend says so and chips hide a series) and Growth drivers (bars: year-on-year growth split into users and revenue per user, plus the total growth line). Values On/Off works in both. The table always carries the levels. Tested by clicking each control in headless Chrome and reading the chart datasets, for Premium and Ad-Supported; the KPI chart controls (Level, % of MAU, Growth, Values, card selection) were tested the same way.
- Profile palette (`ramp`): slate greys.
- Bottom Line ▸ Supply Chain is not built: playbook BL-SPLC applies only when the company has a Bloomberg SPLC supplier export; none exists for SPOT in the repo or on the Drive. It was marked "does not apply" without telling the analyst, and should have been asked for. Needs `SPLC_BBG.xlsx` (SPLC, SPOT US Equity, suppliers).

## 29. Supply Chain and Customers from the SPLC screens (2026-10-21)
The earlier note "Supply Chain does not apply (no SPLC export)" was wrong: it only looked for xlsx/csv exports, and the analyst had Bloomberg SPLC screenshots for SPOT (G:\My Drive\Summit\Docs\Extras\Team\DAA\Ad hoc info search\SPOT UPDATE, 21 Oct 2026, currency EUR).
- Bottom Line ▸ Supply Chain (`js/overviews/spot-splc.js`, copy of the META/TSM module, BL-SPLC): 67 suppliers with a domicile, 1,022 supplier facilities (US 57.5%, China 1.8%), nine suppliers carry a size (EUR 3.7B in total; Universal Music EUR 2.5B = 19.5% of cost of revenue and 20.1% of Universal's revenue; Warner Music EUR 1.2B filed under SG&A, as reported). Chain 1 = the two licensors, Chain 2 = the seven software/other suppliers with a size, Who needs whom, geography (twelve countries in the table, six drawn). The other ~60 supplier names have no size and are not drawn; Sony Group is among them.
- Top Line ▸ Customers: the 25 customers Bloomberg lists, none sized (names, Bloomberg industry, filing basis); the empty-state panel is gone and `splc: false` removed.
- Compiled by hand from the screenshots (no loader on the supplier side). Cost percentages are Bloomberg's "SPOT's Cost %" in the category named in the next column.

Format check (SPLC, same day): compared against the rendered TSMC Supply Chain pane and the META module of the SAB branch. SPOT now follows them: limitation badge first ("Only 9 suppliers carry a size"), five KPIs, Chain 1 cards with the TSMC chip set (share of cost, dependency, amount and period, basis), Chain 2 table with the same columns (Supplier, Relationship with its period, cost %, their exposure, Category, Lands in, Basis), Who needs whom with the value in the bar and the relationship size at the right, geography with its data table, standard source footer. META's navy skin is kept (no categorical colours).

## 30. Review round: Valuation, Evolution, relation chart (2026-10-21)
- Relation chart: the Growth drivers bars are removed (code and button). The relation is drawn as lines only, each over its own first quarter (= 100) on one axis, chips hide a series, Values On/Off works (`bridgeLines: true`).
- Evolution ▸ Earnings ▸ Setup no longer carries "Road to the print" (`conv: false` in `results-data/spot-setup.js`); it stays in Evolution ▸ Results, where TSMC and META carry it (both have a vintage matrix).
- Valuation now has Peers (VA-PEERS): the Overview map with the same state plus "The numbers behind the map" (cheapest first, peer average and median excluding Spotify). Still seeded: the peer multiples and growth rates (stockanalysis.com, 31 Jul 2026), which playbook rule 10 does not allow; only the market caps are live. Order: Peers, Target Multiple, Sensitivity.
- Valuation ▸ Historic Multiple is NOT built: it needs the price-history service (get-market-history, not deployed; the playbook ships the tab with the "Live data pending" notice) and a decision on currency: price is in US$ and EPS/EBITDA in EUR, and the only rate on file is one ECB value dated 2026-10-20, which cannot translate a history. Waiting for the analyst's call.
- "What management has said": the three blocks in Bottom Line ▸ General are per expense line (different quotes); in Top Line ▸ Segments the Quarter order repeats a theme title under every quarter that mentioned it. Not changed.

## 31. Empty charts in Evolution: audit and fixes (2026-10-21)
Audit of `results-data/spot.js` (which metric has Actual, Summit and Street per period) and what the Evolution tabs read: they read the vintage matrix (`estMatrix`), not the arrays, so a metric absent from the matrix has an empty Summit/Street line however full its array is.
- Fixed by derivation, computed from the matrix itself (block at the end of the dataset, nothing typed): gross margin (gross profit / revenue) for Summit and Street; Premium ARPU (Summit), Premium cost per subscriber, Ad-Supported ARPU and cost per MAU for Summit and Street (users at quarter end, divided by 3). Summit subscribers and ad-supported MAU for 3Q26/4Q26 (analyst-supplied) are in the 2026-08-05 vintage.
- Added annual lines: Net income (Summit FY2026-28 from the model's EARNINGS row, 2,821.6 / 3,234.8 / 4,363.4; reported FY2024-25 as the sum of the quarters) and EBITDA (reported FY2024-25, Street).
- "Road to the print": Spotify guides one number, so there is no range to shade; the legend now says "Guidance (single number)" and the line is heavier. TSMC and META guide a range.
- Evolution ▸ Estimates exists on the META branch (SAB); TSMC has Track Record instead.
- Not available, and why: Summit quarterly net income, EPS, shares, operating cash flow, capex, D&A (the model rows are annual-only or zero); Summit annual EBITDA in the 2026-08-05 snapshot (zero); Summit anything for 1Q27/2Q27 (no forecast yet); consensus for the per-user costs is derived, not published.
- Historic Multiple still needs: the price-history service (not deployed; the tab ships with the "Live data pending" notice), a EUR/US$ history (price is US$, EPS is EUR), and net debt per quarter (cash, short-term investments and debt from the 6-K / 20-F; not on file, Quartr needed a new sign-in).

## 32. Valuation ▸ Historic Multiple built (2026-10-21)
- How TSMC and META do it: the same `get-market-history` edge function for the daily price (not deployed: Supabase answers 404, per CLAUDE.md; only San/Oscar can deploy it) and filings-derived denominators in a data file (`tsm-histmult-data.js`, `meta-histmult-data.js`). No price list exists. SPOT now follows them: `js/overviews/spot-histmult.js` (copy of the TSMC module) and `js/overviews/spot-histmult-data.js` (generated, not typed, from Spotify's 6-K interim statements and 20-Fs on SEC EDGAR, 1Q21-2Q26: diluted EPS LTM, EBITDA, diluted shares, cash, short term investments, Exchangeable Notes, net debt). Net debt: Exchangeable Notes (non-current plus current line) less cash and short term investments, net cash every quarter since 1Q21.
- Currency: the price is in US$ and Spotify reports in EUR. Every line is computed in EUR: the daily US$ close is divided by the ECB euro reference rate of the same day, fetched live from the ECB data API (public, no key, CORS open). No rate is written in the code; if the ECB request fails the tab shows its own note.
- In the real portal the tab shows "Live data pending — daily price unavailable" until the edge function is deployed, as TSMC and META do. Checked with an invented price path (`?mockmarket=1` in the local harness, not delivered): P/E forward 35-65x, now about 40x; EV/EBITDA trailing is empty where EBITDA is negative (2022-2023).
- Basis difference to know: the Results EBITDA (Bloomberg) is EUR 82-96M higher than operating income + D&A + SBC in 1Q24, 3Q24 and 4Q24 (social costs); the module uses Results from 1Q24 and the filings before.
- Finding: Results `eps` 4Q25 = 4.43 does not tie to the 20-F (FY2025 diluted EPS 10.51, nine months 4.93, so 4Q25 is about 5.58; net income 1,174M / 212M shares = 5.5). Not changed; to be checked.
- Peers: TSMC and META keep EPS/EBITDA/net debt per peer in a file and compute the multiple live from `liveQuote`; SPOT's peers still carry written multiples (stockanalysis.com, 31 Jul 2026). EDGAR gives the US filers (NFLX, WMG, SIRI, DUOL, LYV); UMG (Euronext) and TME (CNY) need their annual reports; BBG_CONSENSUS.txt has no peer, so forward would be empty.

## 33. Q3 2026 print and call integrated (2026-10-22)
One fill per print (EARNINGS_CONVENTIONS §8 step 9), then rolled to Q4 2026 upcoming. Sources: Q3 2026 shareholder deck (PDF, 22 Oct) and the call transcript handed over by the analyst (saved verbatim in `docs/calls/SPOT-latest.md`; no earlier SPOT calls file, so nothing rotated).
- `results-data/spot.js`: 3Q26 actuals (revenue 4,969, Premium 4,487, Ad-Supported 482, GP 1,639 / 33.0%, op income 672, net income 518, EPS 2.48, FCF 735, MAU 788, subs 306, ad MAU 499, ARPU 4.95, EBITDA 792) and the 4Q26 guide (revenue 5,200, GM 33.8%, op income 820, MAU 818, subs 316). Notes rewritten.
- `spot-ce-data.js`: Q3 2026 reported (results watch + 8 notes, call with take, prepared, Q&A, new questions, highlights); new Q4 2026 upcoming (setup, debate). `themes-data/spot.js`: Q3 update on 8 themes, new theme "Agents are distribution, not displacement". Net cash 9,900 in target-multiple and sensitivity.
- Caveats: 3Q26 segment gross profit is derived (segment margins from the deck) until the interim 6-K; the Results EBITDA basis (Bloomberg, about operating income + D&A) differs from the deck's, so the scorecard shows a spurious beat; restated 3Q25/4Q25 Premium/Ad comparatives are in the notes while history stays as originally reported; Results `eps` 4Q25 still unreconciled (§32).
- Pending: Watch List hooks and the Q4 chain are opened in the portal (Supabase); Bottom Line and Estimates need the post-print BBG_CONSENSUS.txt refresh; Historic Multiple needs the 3Q26 row once the interim 6-K is on EDGAR.
- Review round (2026-10-22): Top Line quarterly axis now reaches 1Q27 with Street only (`streetForward` in `segments-data/spot.js`; Summit stays to 4Q26). Evolution ▸ Estimates was empty because `initResultsEvo()` was called without the ticker; now `initResultsEvo('SPOT')`. Summit total MAU is computed as Premium subscribers + ad-supported MAU (derived block at the end of `results-data/spot.js`, 3Q24–4Q26 and the Aug 5 vintage). The five guided lines (Total MAU, Revenue, Premium subscribers, Operating income, Gross margin) are flagged `guided: true` in Results (dropdown "★ guided") and carry a GUIDED tag in Post-Results (`SPOT_GUIDED`). Investor Day targets (mid-teens revenue CAGR, 35–40% gross margin, 20%+ operating margin by 2030) added to the revenue, gross margin and operating income notes of Q3 and Q4.
- Open: Summit 4Q25 subscribers is 270.9 in the Results series but 295.1 in the Dec 18 2025 vintage; the 4Q25 MAU (761.2) comes from that vintage, so the Summit MAU line has a step there. Estimates (annual) still has no user metric: the dataset footer says the model's user rows are empty.
- Horizon (2026-10-22): every chart shows TWO quarters past the last print (4Q26, 1Q27; Summit only to 4Q26, Street to 1Q27). The shared engine's forward-horizon rule (SAB, Jul 29 2026: forward quarters only within the current fiscal year) trimmed the Results/Evolution and Top Line "top line" charts to 4Q26; a dataset can now set `forwardQuarters: n` (SPOT: 2, `rsTrimData` in `js/results.js`, carried through `buildSegResults`). Bottom Line ▸ Profitability & margins quarterly axis capped at last print + 2 (`aQAxis`), guidance drawn as a horizontal line on each bar (was a diamond marker). Evolution ▸ Results dropdown tag is now "(guided)".
