# MA — bitácora de construcción del perfil (alcance: Evolution ▸ Earnings, Results y Estimates)

> Reglas: `docs/PROFILE_PLAYBOOK.md` §3. Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)
>
> **Nota de proceso (2026-10-28).** Dani pidió ejecutar y dejar lista la sección de Earnings de Mastercard sin pasar por la compuerta unidad por
> unidad (§2). Por eso ninguna unidad está ✅: todas quedan 👀 en revisión hasta que Dani las apruebe viéndolas en el PR en draft. Nada se mergea
> sin su autorización.

| Campo | Valor |
|---|---|
| Empresa | Mastercard Incorporated (NYSE: MA) |
| Modo | B — reordenar existente (el perfil ya tenía Overview y Deep Dive; se rehace Evolution ▸ Earnings sobre la maquinaria del playbook) |
| Rama | `feat/mastercard-remitly` (PR draft #153; worktree `research-summit-mastercard`) |
| Analista responsable | Dani (DOAA351) |
| Inicio | 2026-07-30 (remediación de Earnings) · reconstrucción 2026-10-28 |
| Avance | 0 de 19 unidades aprobadas · 18 en revisión · 1 omitida (VA-TM) |

## 1. Inventario de datos (F0)

| Fuente | ¿Existe? | Detalle | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Consenso BBG (`BBG_CONSENSUS.txt`) | Sí | 23 snapshots de `MA US EQUITY` (2021-05-04 → 2026-10-28), 50 slots de métrica y 50 de KPI por bloque, 22 métricas + 12 KPIs con valores para MA; layout estable en los 23; etiquetas de periodo y fechas de cierre sin desajustes | `estMatrix.cons`, Setup, Post-Results | — |
| `Consensus_Portal.xlsm` (hoja `CONSENSUS`) | Sí (leída por `emit_matrix.py`) | misma unión de snapshots; sin filas solo-hoja | idem | — |
| Summit DCF | Parcial | `G:\My Drive\Summit\Docs\Research\DCF\Payments - All\MA\DCF MA - New.xlsm`: pestañas Projection History y Segments (**solo anual**, 2018–2029; sin proyecciones trimestrales), Discounted Cash Flow y SOTP (valuación propia del modelo) | Summit anual en Results (25 líneas; la historia del modelo cuadra con los actuals de Bloomberg), Drivers, Sensitivity | Summit trimestral; Estimates (necesita ≥ 2 snapshots del MCP) |
| MCP Summit | ⛔ | `/mcp` no logró autenticar el 2026-10-28 | snapshots por fecha, `estMatrix.summit`, `evolution` | Estimates, Road to the print del lado Summit |
| Transcripciones | Sí | `docs/calls/MA-latest.md` (Q2 2026) y `MA.md` (Q1 2026, Q4 2025, Q3 2025, Q2 2025), verbatim | Post-Results, Notes | — |
| Quartr | ⛔ | el conector pidió re-autenticar | cotejo de actuals contra filings | cotejo: se hizo contra lo dicho en las llamadas |
| Filing / 8-K | No leído en esta pasada | los actuals son los de Bloomberg (`fq0`), cotejados con las cifras de la llamada (ingresos $9,277M, EPS $4.97 vs $5.04 ajustado, VAS $3,826M, etc.) | — | cuadre contra el 8-K: pendiente |

**Alcance acordado:** Earnings (Setup · Post-Results · Notes), Results, y las sub-tabs General de Top Line y Bottom Line (mismo dataset de Results). Estimates ⏭️ (ver §7). De Valuation solo Sensitivity (con el DCF). Historic Multiple (necesita `get-market-history`), Peers, Target Multiple (el múltiplo objetivo y el precio objetivo viven en la hoja Output del modelo, que solo llega por el MCP), Management y Miscellaneous no se tocaron.

## 2. Tablero de unidades

| ID | Unidad | Estado | Nota |
|---|---|---|---|
| EV-RES-DATA | `js/results-data/ma.js` (34 métricas, 29 trimestres 2Q20→2Q27, anual 2020→2029, notas por métrica, `estMatrix.cons` generado) | 👀 2026-10-28 | verificación pre-print: 1085 iguales · 12 "cambiados" (redondeo de líneas pequeñas en $M, ≤ 1.7%) · 3 rellenados · 0 en blanco |
| EV-RES | pestaña Results (motor `results.js`, selector "Estimates as of", Road to the print) | 👀 2026-10-28 | revisada en harness local (capturas) |
| EV-SET | Setup (`ma-ce.js`, `ma-setup.js`, trimestre Q3 2026) | 👀 2026-10-28 | rejilla de 22 + 12 líneas, notas de guía por línea, gráfica Setup |
| EV-POST | Post-Results de Q2 2026, Q1 2026, Q4 2025 y Q3 2025 | 👀 2026-10-28 | The print · Call Summary (prepared + 10 preguntas por trimestre, respuestas con citas) · Propose Notes · Also on the call |
| EV-NOTES | Notes (`js/themes-data/ma.js`, versión 2) | 👀 2026-10-28 | 6 ejes, 15 hilos; 2 ganchos cerrados; notas de Q3 2025 agregadas (migración de Capital One, cross-border, recompras) |
| TL-GEN | Top Line ▸ General (`results-data/ma-tl.js`: net revenue, segments Payment Network and VAS, revenue build, volumes and transactions; motor `results.js`, registro `MA_TLG`) | 👀 2026-10-28 | las sub-tabs Segments, Customers, TAM e Industry Analysis existentes se conservan |
| BL-GEN | Bottom Line ▸ General (`results-data/ma-bl.js`: rentabilidad y márgenes, costos y debajo de la línea, flujo de caja y capital; registro `MA_BL`) | 👀 2026-10-28 | Unit Economics, Suppliers y Margins existentes se conservan; sin costo de ventas ni utilidad bruta (MA no los tiene) |
| TL-DRV | Top Line ▸ Drivers (`results-data/ma-drivers.js`, generado por `scripts/consensus/ma/build_ma_drivers.py` desde la pestaña Segments del DCF: tarjetas, volumen de compra por región y producto, transacciones conmutadas, plantilla, yield; historia del modelo 2018–2025 + proyección Summit 2026–2029, anual) | 👀 2026-10-28 | registro `MA_DRV`; el modelo no trae consenso ni guía para estas series |
| VA-SENS | Valuation ▸ Sensitivity re-basada en el snapshot congelado del DCF (`ma-sensitivity-data.js`, generado por `build_ma_sensitivity.py`): año base FY26E–FY29E, cada driver arranca en el valor del modelo y el caso base reproduce el EPS del modelo ($21.99 en FY27E) | 👀 2026-10-28 | el P/E arranca en el múltiplo de mercado sobre el EPS del modelo cuando llega el precio en vivo (sin múltiplo ni precio escritos); la valuación del propio DCF (WACC 11.0%, terminal 14× EV/EBITDA, $417 por acción hoy) va en el pie, no como default |
| EV-EST | Evolution ▸ Estimates (`evolution` en `ma.js`, generado por `build_ma_evolution.py`) | 👀 2026-10-28 | 11 vintages de Bloomberg que traen FY26–FY28 (feb 2024 → oct 28 2026) con el único snapshot del modelo Summit (lectura del xlsm, 2026-10-28) como un punto a la derecha; Dani: "MA solo tiene 1 snapshot, con eso basta" |
| VA-HIST | Valuation ▸ Historic Multiple (`ma-histmult.js` copiado de `meta-histmult.js` + `ma-histmult-data.js` generado por `build_ma_histmult.py`) | 👀 2026-10-28 | P/E hacia adelante y trailing con precio en vivo (`get-market-history`; sin desplegar sale "Live data pending") y EPS/EBITDA/acciones de Bloomberg; **EV/EBITDA vacío** hasta cargar la deuda neta de los 10-Q/10-K (no está en el export de Bloomberg); la rama de EPS GAAP-comparable está dicha en el pie |
| VA-PEERS | Valuation ▸ Peers y Overview ▸ OV-6 (`ma-peers.js`, copia de `sofi-peers.js`) | 👀 2026-10-28 | denominadores de Bloomberg: MA de `BBG_CONSENSUS.txt` (28-oct) y V, AXP, PYPL, FIS, GPN, XYZ del Equity Universe Consensus (14-oct); trailing = último año reportado (FY0), forward = estimado del año en curso (FY+1); cotización en vivo primero y cierre del 27-oct (Yahoo) como respaldo fechado; sin múltiplos escritos. Amex sin EV/EBITDA (prestamista); FIS y GPN con efectos de M&A en FY+1 |
| VA-TM | Valuation ▸ Target Multiple / PEG | ⏭️ | el múltiplo objetivo y el precio objetivo viven en la hoja Output del modelo, que solo llega por el MCP (no está en el xlsm); no se publica la pestaña |
| MG-TEAM · MG-OWN · MG-GOV · MG-TRACK | Management reordenado a Executives & Board · Ownership · Governance & SBC · Track Record | 👀 2026-10-28 | Ownership absorbe Capital Allocation reconstruida con Bloomberg (recompras y FCF: la cifra vieja de $14.5B en FY25 era errónea, el dato es $12.0B); Governance & SBC usa SBC y acciones de Bloomberg; la tabla de Fiscal.ai sigue en vivo; el texto de los ejecutivos pasó a tiempo pasado donde el cambio del 3-ago ya ocurrió; pendiente: dividendos y tenedores del 10-K y el proxy |
| MISC | Miscellaneous (5 sub-tabs: Competitive position, Litigation & regulation, Guidance record, Strategy, History & M&A) | 👀 2026-10-28 | todo lo que ya existía y es propio de Mastercard; ver mapa de reubicación |
| OV-1…OV-7 | Overview reconstruido con el 10-K FY2025 (`mastercard.js`): Key Facts (empleados ~39,800, no 35,000; market cap en vivo, sin semilla), lede, 2×2, How Mastercard makes money (categorías y región cuadran con $32,791M; líneas de ingreso cuadran con $39,998M bruto − $20,522M rebates), Products & platforms, peer map, Timeline | 👀 2026-10-28 | barras grises sin color, 4 colapsables con el título exacto, sin `<style>` en línea; Mastercard reporta UN segmento (Payment Solutions): el selector dice Categories / Region |
| TL-GEN · TL-SEG · TL-OTH · TL-CUS | Top Line sobre el motor `segments.js` (`js/segments-data/ma.js`): General, Segments (Payment network, Value-added services and solutions como sustitutos de segmento), Other (líneas de ingreso antes de rebates; región), Customers (concentración: cinco mayores clientes 21% del ingreso neto, ninguno >10%; clientes nombrados en llamadas con trimestre) | 👀 2026-10-28 | el motor imprime "2 reportable" aunque la cita del 10-K (Nota 22) dice un segmento: pendiente generalizarlo en un PR de motor. Sin segmento operating income. SPLC de MA no está en disco: la tabla de contrapartes queda como "not loaded yet" |
| BL-UE | Bottom Line ▸ Unit Economics reconstruida (`maUnitEconBody`): puente bruto a neto FY2025 y take rate FY2023–25 leídos de `results-data/ma.js` | 👀 2026-10-28 | retira el puente ilustrativo de $53B / 38% y los ~31 bps / ~57%: el bruto de red es $40.0B, los rebates $20.5B (51.3%) y el margen operativo 57.6% |
| MISC-GUIDE | Guidance record desde las presentaciones (Apéndice B y C, reconciliación del outlook): 22 guías trimestrales Q2'21–Q3'26 y trayectoria del guide anual FY22–FY26; delivered = crecimiento cn del comunicado menos puntos de adquisiciones | 👀 2026-10-28 | bandas numéricas indicativas (mapeo de palabras a rangos, declarado en el pie) |

## 3. Decisiones

- 2026-10-28 · **El set de métricas es el del archivo** (EARNINGS_CONVENTIONS §6a): todas las 22 + 12 con valores válidos se muestran. Sustituye al set anterior de 8 + 4. (Dani: "las convenciones de SAB mandan".)
- 2026-10-28 · **Capex y recompras en positivo** (convención de SAB en META: "positive spend"); el archivo las trae negativas y se invierten con `sign:-1`. Client incentives se queda negativo (contra-ingreso, como lo trae BBG).
- 2026-10-28 · **EPS = línea GAAP-comparable de Bloomberg** ($4.97 en Q2 2026 vs $5.04 ajustado de la compañía), para que sorpresa y consenso estén en la misma base. Operating income = as reported (GAAP); EBITDA = comparable.
- 2026-10-28 · **Mastercard guía tasas de crecimiento, no niveles**: no hay banda de guía ni fila "guide" en la rejilla (`MA_GUIDED` vacío); la guía vive en las notas de Setup de cada línea.
- 2026-10-28 · **Fuera**: "AI summary / the minute", "Points for the call", red-lines y tee-ups, la tarjeta de IR/EDGAR y el párrafo introductorio de Earnings (ajustes de SAB del 2026-10-21, EV-SET y EV-POST).
- 2026-10-28 · **Notas con clave huérfana "Cross-border volume"** (notas y marcas de watch del Q2/Q1/Q4): se re-clavaron a *Cross-border volume fees*, la única línea de cross-border que trae el archivo (es ingreso en dólares, no volumen); el texto de cada nota dice ambas cosas.

## 4. Excepciones aceptadas

- Verificación pre-print: 12 diferencias de redondeo en líneas pequeñas ($M a 0 decimales): `q.lit` ×4, `q.invinc` ×3, `q.oie` ×4, `y.oie` ×1 (máx. 1.7%). Se aceptan como redondeo; los valores completos están en `estMatrix`.
- `Operating income` de Q2 2026 muestra +13% de sorpresa: la serie del Street cae de ~$5.4B (2 trimestres antes) a $4.9B (1 trimestre antes), señal de contribuyentes en bases distintas; está dicho en la nota de la métrica.
- Beat/miss = por encima/por debajo del número del Street en todas las líneas, también costos y client incentives; el pop-up "How this is built" lo dice.
- Snapshot 2022-08-02 de `y.oth` es reimpresión del de 2022-11-01: se descarta con `dropVintages` en `map_ma.json`.

## 5. Cuadres (compuerta EV-RES-DATA)

**a) Actuals y consenso vs lo dicho en la llamada de Q2 2026 (BBG)**

| Dato | Archivo | Documento |
|---|---|---|
| Ingresos netos | 9,277 | "Net revenue +12%" (crecimiento cc; el nivel coincide con 5,451 + 3,826) |
| Payment Network + VAS | 5,451 + 3,826 = 9,277 | cuadra con ingresos |
| Bruto − incentivos | 11,448 − 5,997 = 5,451 | cuadra con Payment Network |
| Domésticos + cross-border + procesamiento + otros | 3,154 + 3,460 + 4,508 + 326 = 11,448 | cuadra con ingreso bruto; "other network assessments $326 million" ✔ |
| EPS | 4.97 (GAAP-comparable) | $5.04 ajustado en la llamada |
| Recompras | 4,898 | "$4.9 billion" ✔ |
| Volumen de compra | 2,417,000 | "$2.4T" (consistente con GDV +8%) |

**b) Trimestres ↔ año (2026, consenso de Bloomberg: 1Q+2Q reales + 3Q+4Q estimados vs FY26)**

| Métrica | Suma de trimestres | FY26 consenso | Dif. | FY26 Summit |
|---|---|---|---|---|
| Ingresos | 37,314 | 37,289 | 0.1% | 38,058 |
| Op. income | 22,031 | 22,011 | 0.1% | 22,281 |
| EBITDA | 23,642 | 23,590 | 0.2% | 23,962 |
| Net income | 17,251 | 17,254 | 0.0% | 17,320 |
| CFO | 18,120 | 18,163 | 0.2% | 18,867 |
| Capex | 865 | 840 | 3.0% | 590 |
| D&A | 1,254 | 1,247 | 0.6% | 1,248 |
| EPS (no se suma) | 19.60 | 19.61 | 0.1% | — |

Summit no tiene trimestres, así que no hay cuadre trimestral del lado Summit (regla 7: los trimestres Summit van `null`). El 3% de capex es la diferencia entre contribuyentes del Street; la nota de la métrica lo dice.

## 6. Mapa de reubicación (modo B)

| # | Pieza original (`mastercard.js`) | Destino | Cómo |
|---|---|---|---|
| 1 | `CE_CONS` (a mano, 12 snapshots, 8 + 4 líneas) | `ma-ce-data.js` `MA_CE_CONS` (se arma al cargar desde `results-data/ma.js`) | reemplazada; mismos datos, regenerados |
| 2 | `CALL_EARNINGS` setup.notes (guías Q3/Q2) | `ma-ce-data.js` `setup.notes` por línea | movidas y ampliadas con las guías de opex, tasa, OI&E, recompras |
| 3 | `CALL_EARNINGS` results.notes (Q2/Q1/Q4) | `ma-ce-data.js` `results.notes` | movidas; clave "Cross-border volume" → "Cross-border volume fees" |
| 4 | `call.highlights` (Q2/Q1/Q4) | `ma-ce-data.js` `call.highlights` ("Also on the call") | movidos tal cual |
| 5 | `call.newQuestions` | `ma-ce-data.js` `call.newQuestions` (Propose Notes) | movidas tal cual |
| 6 | `MA_THEMES` (6 temas planos, Q4 2023 → Q1 2026) | `themes-data/ma.js` (6 ejes, 15 hilos, + Q2 2026) | regrupados y ampliados |
| 7 | `WL_ROWS` y la Watch List inline | Watch List compartida bajo Notes (`js/watchlist.js`, Supabase, `sql/014_ma_themes_seed.sql`) | ya estaba migrada; solo se monta |
| 8 | `results.summary` (AI Summary), `thesisCheck`, `intoCall`, `priceReaction`, `call.take`, `dots`, `threeMinutes`, `notBringing`, `debate`, `pricedIn`, `oneLiner` | — | **retirados** del render (SAB 2026-10-21: nada generado por IA ni de relleno); el texto sigue en el historial de git (commit `c253dad` y anteriores) |
| 9 | `ceIRButton` + párrafo "Earnings — the decision layer" | — | retirados (ajuste SAB META) |
| 10 | `CE_ANNUAL` (código muerto) | — | retirado |
| 11 | Valuation ▸ Multiples (`ddMultiplesBody`, múltiplos escritos a mano "~28×") | Valuation ▸ Historic Multiple + Peers | **retirada**: violaba la regla 10 (múltiplos de mercado sembrados); lo que sobrevive es el mapa de peers y su lectura cualitativa |
| 12 | Valuation ▸ Financials (`ddFinancialsBody`, series DCF tecleadas) | Top Line ▸ General/Drivers y Bottom Line ▸ General (motor de Results) | **retirada**: las mismas series, con datos de Bloomberg y del modelo, ya están en el motor |
| 13 | Bottom Line ▸ Margins (`ddMarginsBody`, márgenes en vivo de Massive con respaldo tecleado) | Bottom Line ▸ General | **fusionada**: márgenes sobre ingreso neto en el motor de Results |
| 14 | Valuation ▸ Capital Allocation (`maCapAllocBody`, valores aproximados a mano) | Management ▸ Ownership | movida y reconstruida con Bloomberg |
| 15 | Management ▸ Governance & SBC (`maSbcBody`, SBC aproximado a mano) | Management ▸ Governance & SBC | reconstruida con Bloomberg; el texto de gobierno se conserva |
| 16 | Top Line ▸ Industry Analysis (`ddIndustryBody`) | Miscellaneous ▸ Competitive position | movida tal cual |
| 17 | Valuation ▸ Risk & Litigation (`ddRiskBody`) | Miscellaneous ▸ Litigation & regulation | movida tal cual |
| 18 | Evolution ▸ Guidance (`maGuideBody`) | Miscellaneous ▸ Guidance record | movida tal cual (Mastercard guía crecimientos, no niveles) |
| 19 | Evolution ▸ Strategy (`ddStrategyBody`) | Miscellaneous ▸ Strategy | movida tal cual |
| 20 | Evolution ▸ Timeline (`ddTimelineBody`) | Miscellaneous ▸ History & M&A | movida tal cual (la línea de tiempo corta sigue en el Overview) |
| 21 | Top Line ▸ TAM (`ddTamBody`, TAM sin fuente verificable en disco) | — | **retirada** del montaje (el código sigue en el archivo, sin usar); Top Line ▸ Other ahora son los cortes del 10-K |
| 22 | Bottom Line ▸ Suppliers (`ddSuppliersBody`) | Bottom Line ▸ Supply Chain | renombrada según la guía |

| 23 | Top Line ▸ Segments (`ddSegmentsBody`: fee lines, "money machine" con bps ilustrativos) | — | **retirada**: cifras ilustrativas; reemplazada por el motor de segmentos |
| 24 | Top Line ▸ Customers (`ddCustomersBody`: mix "42% vs 27% del líder", "US ≈ 51% de clientes") | — | **retirada**: cifras sin fuente en disco; reemplazada por Customers del motor |
| 25 | Overview ▸ "Value-Added Services — the moat's growth engine" (8.º bloque) | — | **retirado** (el playbook prohíbe un 8.º bloque; los datos de TAM de VAS no se pudieron verificar) |
| 26 | Overview ▸ Competitors (`stdPeerScatter` con múltiplos web sembrados) | `ma-peers.js` | **reemplazado**: mismo mapa, denominadores de Bloomberg |
| 27 | Bottom Line ▸ Unit Economics (puente de $53B, 38%, ~31 bps) | `maUnitEconBody` | **reemplazada** con los reportados |
| 28 | Revenue build (`MA_TLG`) y Drivers (`MA_DRV`) | Top Line ▸ Revenue build y Drivers | se conservan como sub-tabs extra (datos de Bloomberg y del modelo Summit) |

## 7. Bloqueos y preguntas abiertas

- ⛔ **MCP Summit sin autenticar** (`/mcp` → "still unauthorized"): bloquea Estimates (`evolution`), `estMatrix.summit` y el snapshot Summit por trimestre. Quién: Dani (reautenticar) · desde 2026-10-28.
- ✅ Holders y proxy: Dani (2026-10-28) los saca del alcance ("no lo recuerdo relevante para el análisis"); Ownership queda con capital allocation y dividendos del 10-K.
- ⏳ **Balance a trimestres intermedios** (1Q21–3Q21, 1Q22–3Q22, 1Q23–3Q23, 1Q24–3Q24, 1Q25–3Q25): net debt solo en los cierres de año FY2021–FY2025 y 1Q26/2Q26 (10-K/10-Q entregados); EV/EBITDA empieza en 4Q21.
- ✅ SPLC de MA cargado (capturas de Bloomberg del 28-oct-2026): 61 clientes sin tamaño (Customers) y 60 proveedores, 13 con tamaño estimado (Bottom Line ▸ Supply Chain, que reemplaza la lista del 29-jun).
- ⛔ **Quartr** pidió re-autenticar: el cotejo de actuals contra filings se hizo contra la llamada, no contra el 8-K. Pendiente: cotejo contra el 8-K del Q2 2026.
- ❓ Dani decide si las 34 líneas se quedan todas en la rejilla de Setup o si se colapsan las secundarias.
- Q3 2026 se reporta en los últimos días de octubre de 2026: al llegar el print y la llamada, rotar `MA-latest.md` → `MA.md`, llenar `results` y `call`, abrir Q4 2026 (rutina del playbook, §12).
- Cuadre del trimestre contra el 8-K (EV-RES-DATA) y revisión de la Watch List en el portal real (la fila de `companies` de MA existe; el harness local no tiene id válido).

## 8. Historial de aprobaciones (solo se agrega)

- 2026-10-28 (5.ª pasada, cierre; Dani: "NO IMPORTA QUE NO ESTE EL TARGET MULTIPLE, Y PORQUE QUIERES HOLDERS Y PROXY?") · Target Multiple queda ⏭️ sin pendiente; holders y proxy fuera de alcance; SPLC cargado desde `...\MA\SPLC` (8 capturas): Customers con 61 relaciones y Supply Chain con 60 proveedores.

- 2026-10-28 (5.ª pasada; Dani: "SIGUEN FALTANDO DEMASIADAS COSAS Y SIGUE VIENDOSE MAL") · se vio el harness: el perfil usaba el rojo/naranja de Mastercard (pastillas, línea de Key Facts, títulos del 2×2) y el Overview seguía con cifras sembradas. Cambios: acento único Summit (`selectors.css` sin `.ov-mastercard-dd`, `.ov-mastercard` con `--brand: var(--steel)`, `MA_RED/MA_ORANGE` → `SUMMIT_CAT`); Overview reconstruido con el 10-K FY2025; peers con denominadores de Bloomberg; Top Line sobre el motor de segmentos; Unit Economics con datos reportados; net debt de 10-K/10-Q para EV/EBITDA; dividendos del 10-K ($3.04 por acción, $0.87 trimestral declarado); Guidance record desde las presentaciones (22 guías). Corregido un error de marcado en Ownership. Tour del harness: 25 sub-tabs, 0 errores de consola. Fuentes: 10-K FY2019–FY2025 y 10-Q Q1/Q2 2026 (carpeta Descargas), 22 comunicados y 23 presentaciones, `MA calls.txt`, Equity Universe Consensus.

- 2026-10-28 (4.ª pasada; Dani: "MA solo tiene 1 snapshot... usa los consensus de BBG... ¿por qué no tocamos Management y Miscellaneous?") · Estimates, Historic Multiple, Peers, Management reordenado, Miscellaneous y limpieza de lo que sobraba (mapa de reubicación filas 11–22). Recorrido completo de las 6 secciones y 24 sub-tabs en el harness local: sin errores de consola. Pendiente cuando Dani pase calls y filings: dividendos y tenedores, deuda neta (EV/EBITDA), peers con denominadores de filings, cotejo contra el 8-K.
- 2026-10-28 (3.ª pasada, solo con el DCF; Dani: "quédate con lo del DCF") · Summit anual ampliado de 10 a 25 líneas con la pestaña Segments (EPS, Payment Network, VAS, bruto a neto, opex, G&A, A&M, SBC, litigio, impuestos, recompras, volumen, transacciones; cuadre de la historia del modelo contra Bloomberg 0.0% salvo opex +1.4% a +2.5% y pre-tax −1.8%, que se dejaron fuera o se anotaron) · Top Line ▸ Drivers · Valuation ▸ Sensitivity re-basada · las filas de dominio y cross-border de la pestaña Segments se dejaron fuera porque el modelo las proyecta en cero desde 2027 · el modelo trae litigio de ~$740M al año contra ~$150M del Street y Payment Network casi plano después de 2026: está dicho en las notas de cada línea.
- 2026-10-28 (2.ª pasada) · EV-POST ampliado a Q3 2025 (setup con la guía de la llamada de Q2 2025, notas por línea, 8 remarks, 10 preguntas con citas, 5 highlights, 4 preguntas nuevas); notas de las tarjetas de EPS aclaran que el crecimiento de la tarjeta es nominal sobre las líneas de Bloomberg y el de la llamada es non-GAAP a moneda constante · TL-GEN y BL-GEN agregados.
- 2026-10-28 · todas las unidades · 👀 en revisión (sin compuerta; instrucción explícita de Dani de ejecutar) · se mostró: capturas del harness local de Setup, Post-Results (Q2 2026), Notes y Results · fuentes: `BBG_CONSENSUS.txt` (snapshot 2026-10-28), `DCF MA - New.xlsm`, `docs/calls/MA-latest.md` y `MA.md` · scripts: `scripts/consensus/map_ma.json`, `scripts/consensus/ma/build_ma_dataset.py`.
