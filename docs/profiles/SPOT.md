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
| TL-GEN · TL-SEG · TL-OTH · TL-CUS | Top Line | ⬜ | | | | los panes viejos se retiraron (§11); se construye con `segments.js` |
| EV-SET | Evolution ▸ Earnings ▸ Setup (3Q26) | 👀 | 2026-10-20 | | | **rehecho sobre la maquinaria canónica** (`spot-ce.js`): 9 headline + 8 KPIs propios, Street (BBG) · Summit (MCP 08-05) · fila "guide"; gráfica Setup con Street; notas actualizadas |
| EV-EST | Evolution ▸ Estimates | 👀 | 2026-10-20 | | | 4 vintages reales del MCP (12-18 · 02-09 · 04-28 · 08-05), años 2026–2029; Street = BBG guardado en cada snapshot |
| EV-POST | Evolution ▸ Earnings ▸ Post-Results (2Q26) | 👀 | 2026-10-20 | | | 17 tarjetas vs Street/Summit, Call Summary (7 comentarios + 14 preguntas de la transcripción 4-ago), Propose Notes (6), Also on the call (7) |
| EV-NOTES | Evolution ▸ Earnings ▸ Notes | 👀 | 2026-10-20 | | | 10 temas en 8 grupos; semilla = el registro de temas que vivía en `spot.js` + 2 temas de la call |
| BL-GEN-1…5 · BL-SEG · BL-SPLC | Bottom Line | ⬜ | | | | BL-SPLC probablemente ⏭️ |
| VA-TM | Valuation ▸ Target Multiple / PEG | 👀 | 2026-10-20 | | | 4 snapshots del MCP con la valuación del workbook tal cual (EV/EBITDA 20.5× · P/E 28×, 2027); Live con FX implícito |
| VA-HIST · VA-PEERS · VA-SENS | Valuation | ⬜ | | | | HIST: `get-market-history` sin desplegar → "Live data pending"; PEERS: esperan denominadores (ver §9); SENS: re-basar del snapshot 05-22 al 08-05 |
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

## 5. Excepciones aceptadas

(ninguna todavía)

## 6. Bloqueos y preguntas abiertas

- ✔ Branch de SAB encontrado 2026-10-20: `origin/feat/meta-profile` (bitácora META + `summit-map/meta.js` + 8 reglas nuevas del review de TSM en el playbook). Aplican a SPOT: Overview sin color · trimestres estimados que suman al año · producto concreto por segmento y precio × volumen (en SPOT: suscriptores × ARPU) · COGS separado de opex · Misc: Competitive position siempre. (Antes: no lo encontraba.) **Pendiente de mergear a main**: se trabaja con esas reglas leídas de la rama.
- ~~**No encontré el branch de SAB de hoy con META.** En `origin` y `mine` lo más reciente de SAB es el perfil de **TSM** (#146, 2026-10-16, hecho con el playbook) y `chore/company-profile-playbook` (2026-10-14). `feat/meta-restructure` es de julio. Se usa TSM + playbook como referencia de formato. Si el branch de hoy es local o está sin pushear, hay que pasarlo.~~
- ~~Autenticar el MCP de Summit~~ ✔ 2026-10-20.
- `BBG_CONSENSUS.txt` en cp1252: los scripts de `scripts/consensus/` necesitan `encoding='cp1252'`.

## 7. Historial de aprobaciones

- 2026-10-20 · F0 · 📝 propuesta (sin aprobación todavía)

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
| `WL_ROWS` (11 hooks Q4-23…Q3-26) | `spot-wl-legacy.js` (verbatim) | el Watch List canónico es Notes; los hooks reexpresan los temas del registro, no se fusionaron |
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
