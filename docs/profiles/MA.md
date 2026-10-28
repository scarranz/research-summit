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
| Avance | 0 de 6 unidades aprobadas · 6 en revisión · 1 omitida (EV-EST) |

## 1. Inventario de datos (F0)

| Fuente | ¿Existe? | Detalle | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Consenso BBG (`BBG_CONSENSUS.txt`) | Sí | 23 snapshots de `MA US EQUITY` (2021-05-04 → 2026-10-28), 50 slots de métrica y 50 de KPI por bloque, 22 métricas + 12 KPIs con valores para MA; layout estable en los 23; etiquetas de periodo y fechas de cierre sin desajustes | `estMatrix.cons`, Setup, Post-Results | — |
| `Consensus_Portal.xlsm` (hoja `CONSENSUS`) | Sí (leída por `emit_matrix.py`) | misma unión de snapshots; sin filas solo-hoja | idem | — |
| Summit DCF | Parcial | `G:\My Drive\Summit\Docs\Research\DCF\Payments - All\MA\DCF MA - New.xlsm`, pestaña Projection History: **solo anual** (2022–2029); sin proyecciones trimestrales | Summit anual en Results (10 líneas) | Summit trimestral; Estimates (necesita ≥ 2 snapshots del MCP) |
| MCP Summit | ⛔ | `/mcp` no logró autenticar el 2026-10-28 | snapshots por fecha, `estMatrix.summit`, `evolution` | Estimates, Road to the print del lado Summit |
| Transcripciones | Sí | `docs/calls/MA-latest.md` (Q2 2026) y `MA.md` (Q1 2026, Q4 2025, Q3 2025, Q2 2025), verbatim | Post-Results, Notes | — |
| Quartr | ⛔ | el conector pidió re-autenticar | cotejo de actuals contra filings | cotejo: se hizo contra lo dicho en las llamadas |
| Filing / 8-K | No leído en esta pasada | los actuals son los de Bloomberg (`fq0`), cotejados con las cifras de la llamada (ingresos $9,277M, EPS $4.97 vs $5.04 ajustado, VAS $3,826M, etc.) | — | cuadre contra el 8-K: pendiente |

**Alcance acordado:** Earnings (Setup · Post-Results · Notes) + Results. Estimates ⏭️ (ver §6).

## 2. Tablero de unidades

| ID | Unidad | Estado | Nota |
|---|---|---|---|
| EV-RES-DATA | `js/results-data/ma.js` (34 métricas, 29 trimestres 2Q20→2Q27, anual 2020→2029, notas por métrica, `estMatrix.cons` generado) | 👀 2026-10-28 | verificación pre-print: 1085 iguales · 12 "cambiados" (redondeo de líneas pequeñas en $M, ≤ 1.7%) · 3 rellenados · 0 en blanco |
| EV-RES | pestaña Results (motor `results.js`, selector "Estimates as of", Road to the print) | 👀 2026-10-28 | revisada en harness local (capturas) |
| EV-SET | Setup (`ma-ce.js`, `ma-setup.js`, trimestre Q3 2026) | 👀 2026-10-28 | rejilla de 22 + 12 líneas, notas de guía por línea, gráfica Setup |
| EV-POST | Post-Results de Q2 2026, Q1 2026 y Q4 2025 | 👀 2026-10-28 | The print · Call Summary (prepared + 10 preguntas por trimestre, respuestas con citas) · Propose Notes · Also on the call |
| EV-NOTES | Notes (`js/themes-data/ma.js`) | 👀 2026-10-28 | 6 ejes, 15 hilos; 2 ganchos cerrados |
| EV-EST | Estimates | ⏭️ | requiere ≥ 2 snapshots del MCP Summit; la pestaña no se publica (regla 5) |

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

## 7. Bloqueos y preguntas abiertas

- ⛔ **MCP Summit sin autenticar** (`/mcp` → "still unauthorized"): bloquea Estimates (`evolution`), `estMatrix.summit` y el snapshot Summit por trimestre. Quién: Dani (reautenticar) · desde 2026-10-28.
- ⛔ **Quartr** pidió re-autenticar: el cotejo de actuals contra filings se hizo contra la llamada, no contra el 8-K. Pendiente: cotejo contra el 8-K del Q2 2026.
- ❓ Dani decide si las 34 líneas se quedan todas en la rejilla de Setup o si se colapsan las secundarias.
- Q3 2026 se reporta en los últimos días de octubre de 2026: al llegar el print y la llamada, rotar `MA-latest.md` → `MA.md`, llenar `results` y `call`, abrir Q4 2026 (rutina del playbook, §12).
- Cuadre del trimestre contra el 8-K (EV-RES-DATA) y revisión de la Watch List en el portal real (la fila de `companies` de MA existe; el harness local no tiene id válido).

## 8. Historial de aprobaciones (solo se agrega)

- 2026-10-28 · todas las unidades · 👀 en revisión (sin compuerta; instrucción explícita de Dani de ejecutar) · se mostró: capturas del harness local de Setup, Post-Results (Q2 2026), Notes y Results · fuentes: `BBG_CONSENSUS.txt` (snapshot 2026-10-28), `DCF MA - New.xlsm`, `docs/calls/MA-latest.md` y `MA.md` · scripts: `scripts/consensus/map_ma.json`, `scripts/consensus/ma/build_ma_dataset.py`.
