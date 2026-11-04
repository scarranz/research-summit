# TPL — bitácora de construcción del perfil

> Reglas: `docs/PROFILE_PLAYBOOK.md` §3. Claude la lee completa al empezar cada sesión y la actualiza en cada aprobación.
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)

| Campo | Valor |
|---|---|
| Empresa | Texas Pacific Land Corporation (NYSE: TPL · también NYSE Texas) |
| Modo | A — empresa nueva, **modo exprés** (aprobación por sección, SAB 2026-11-04) |
| Rama | `feat/uber-3q26-call-submit` (worktree `rs-uber`) — compartida con el follow-up de UBER por decisión de SAB; separar en su PR al final |
| Analista responsable | SAB |
| Inicio | 2026-11-04 |
| Avance | 7 filas del tablero aprobadas (F0, F1, Overview, Results data + tab, Top Line, Peers, Management) · 1 omitida (BL-SPLC) · bloqueadas por Summit: F0-SM, EV-EST, VA-TM, VA-SUB, VA-SENS |

## 1. Inventario de datos (F0) — 2026-11-04

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | ✔ | confirmada por SAB 2026-11-04 | el perfil abre | todo |
| Filing anual | ✔ | 10-K FY2025, acc. 0001811074-26-000018 (2026-02-18); CIK 1811074; 10-Q 1T26 y 2T26; 8-K Item 2.02 cada trimestre desde 2021 | Overview, Top Line, Results (act), Management, textos verbatim | — |
| Año fiscal / moneda | ✔ | cierra 31 dic · USD | — | — |
| **Splits** | ⚠ | 3-for-1 en mar 2024 y 3-for-1 el 22 dic 2025 (10-K Item 1). Toda cifra por acción va en la base actual | — | — |
| Summit DCF | ✘ | `search_ticker TPL` → no_matches (2026-11-04). SAB lo está armando en paralelo | Summit en Results/Top Line/Setup, EV-EST, VA-TM, VA-SUB, VA-SENS | esas unidades ⛔ hasta el primer submit |
| Consenso BBG | ✔ (hoja viva) | Agregado por SAB el 2026-11-04 a `Consensus_Portal.xlsm` ▸ `CONSENSUS`: 23 snapshots (2021-05-11 → 2026-11-03). **Todavía no está en el archivo `BBG_CONSENSUS.txt`** (falta correr la exportación; `inspect_matrix.py` solo lee el .txt). Las 9 líneas por segmento traen solo reportado, sin forward | `estMatrix.cons`, Street en Results/Setup, export de Bottom Line, forward de peers | Results solo con `act`; Bottom Line desde filings (precedente DHR) |
| `get-market-history` | ✘ | sin desplegar (San) | Historic Multiple en vivo | VA-HIST con "Live data pending" |
| Valuación del modelo en el MCP | ✘ | no hay modelo | VA-TM, VA-SUB | ⛔ |
| SPLC | ✘ | no hay export con TPL como sujeto | TL-CUS tabla SPLC, BL-SPLC | BL-SPLC ⏭️ |
| Transcripciones | ✔ | TPL hace llamada trimestral (2T26: 6 ago 2026, 9:30 CT). Fuentes: stockanalysis.com / Motley Fool; no hay `docs/calls/TPL*.md` todavía | EV-POST, EV-NOTES | — |
| Fiscal.ai | ❓ | plan gratuito ~25 empresas; probablemente "not available" | tabla en vivo de Management | el hueco lo dice |
| Massive (`liveQuote`) | ✔ (se usa) | | market cap, peers | |
| Fotos | ✘ | iniciales | — | — |

**Alcance acordado (SAB, 2026-11-04):** se construye todo lo que sale de filings y mercado. Las piezas que necesitan
Summit o BBG **no se montan**; quedan sus archivos-esqueleto y la receta (§5b) para aterrizarlas el día que llegue el dato.
BL-SPLC ⏭️ (sin export SPLC).

## 1b. Mapa Summit (F0-SM)

⛔ Sin modelo en el MCP. Esqueleto en `js/summit-map/tpl.js` con las claves `core` que el portal va a pedir y la
lista de etiquetas que esperamos (por confirmar contra `list_metrics` cuando exista el modelo).

## 2. Tablero de unidades

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | ✅ | 2026-11-04 | SAB | | alcance y modo exprés por AskUserQuestion |
| F0-SM | Mapa de métricas Summit | ⛔ | | | | sin modelo Summit |
| F1 | Esqueleto + vista previa | ✅ | 2026-11-04 | SAB | | `js/overviews/tpl.js` registrado; Deep Dive exportado (modo exprés) |
| OV-1 … OV-F | Overview (7 bloques + pie) | ✅ | 2026-11-04 | SAB | | revisión por sección |
| EV-RES-DATA | Dataset de Results | ✅ | 2026-11-04 | SAB | | `act` 1Q22–2Q26 y 2021–2025 + `estMatrix.cons` (map_tpl.json); forward 3Q26–3Q27 y FY2026–28 en las 8 métricas con consenso |
| EV-RES | Evolution ▸ Results | ✅ | 2026-11-04 | SAB | | |
| TL-GEN · TL-SEG · TL-OTH · TL-CUS | Top Line | ✅ | 2026-11-04 | SAB | | `segments-data/tpl.js` |
| EV-EST | Estimates | ⛔ | | | | Summit ≥ 2 snapshots |
| EV-SET | Earnings ▸ Setup | 👀 | | | | solo Street (sin Summit); 4T26 upcoming + históricos; notas por línea del comunicado |
| EV-POST | Earnings ▸ Post-Results | 👀 | | | | print 3T26/2T26/1T26/4T25 vs Street; Q&A de 2T26 (8), 1T26 (6), 4T25 (9) con 118 citas verificadas (chkq 0 faltantes); 3T26 `call:null` hasta la llamada del 5 nov 9:30 CT |
| EV-NOTES | Earnings ▸ Notes | 👀 | | | | semilla `themes-data/tpl.js` v1: notas de SAB (TPL.pdf) + contexto de comunicados; 6 temas, 12 hilos; `v` sellado en cada hilo |
| BL-GEN-1 … 5 | Bottom Line ▸ General | 👀 | | | | `tpl-bl.js` (copia de uber-bl.js) + `tpl-bl-data.js`: 5 líneas de gasto por naturaleza (10-K, XBRL), FY2018–25 y 1Q22–3Q26; consenso BBG; sin COGS (TPL no lo reporta) |
| BL-SEG | Bottom Line ▸ Segments | 👀 | | | | utilidad neta por segmento (medida del CODM) y op. income 2024+; sin puente forward (BBG no trae segmentos) |
| BL-SPLC | Supply Chain | ⏭️ | 2026-11-04 | | | sin export SPLC |
| VA-HIST | Historic Multiple | 👀 | | | | `tpl-histmult.js` + `-data.js` (acciones y caja de XBRL, ajustadas ×9/×3); forward P/E con EPS anual BBG por snapshot; regla nueva: una línea forward se corta si un snapshot posterior ya no trae ese año |
| VA-PEERS | Peers | ✅ | 2026-11-04 | SAB | | LB, VNOM, BSM, KRP, DMLP (SAB 2026-11-04) |
| VA-TM | Target Multiple / PEG | ⛔ | | | | sin modelo |
| VA-SUB | Submit History | ⛔ | | | | sin modelo |
| VA-SENS | Sensitivity | ⛔ | | | | sin modelo |
| MG-TEAM · MG-OWN · MG-GOV · MG-TRACK | Management | ✅ | 2026-11-04 | SAB | | proxy DEF 14A 2026-09-25; calificaciones de Track Record apagadas (`SHOW_RATINGS=false`, como GOOGL/UBER) — SAB confirma |
| MISC-comp | Misc ▸ Competitive Position | 👀 | | | | 5 cuestionamientos + tabla de 6 empresas, celda con fuente |
| MISC-nextgen | Misc ▸ Next-Gen Land Use | 👀 | | | | directorio agrupado ($271.0M divulgados, 7 partidas); la venta de tierra 1T26 ES Project Kilby (Chevron, 10-Q 2T26 Nota 4); Shackelford/Jones $122.7M acumulado 9M |
| F-FINAL | Cierre | ⬜ | | | | |

## 3. Decisiones del analista

- 2026-11-04 · F0 · Modo exprés: se aprueba por sección (Overview, Top Line, Evolution, Valuation, Management…), no por unidad — SAB
- 2026-11-04 · OV-6/VA-PEERS · Peers = LandBridge (LB), Viper (VNOM), Black Stone (BSM), Kimbell (KRP), Dorchester (DMLP) — dueños de tierra/regalías listados en EE. UU. — SAB
- 2026-11-04 · F0 · Sin Summit ni BBG: dejar los archivos listos y ocultos, nada a la vista hasta que llegue el dato — SAB
- 2026-11-04 · F0 · TPL vive en la misma rama que el follow-up de UBER — SAB

## 4. Excepciones aceptadas

## 5. Mapa de reubicación (solo modo B)

No aplica (modo A).

## 5b. Datos por llegar — receta de aterrizaje

**Cuando TPL entre al MCP de Summit (primer submit):**
1. `list_dcf_models` / `list_snapshots TPL` / `list_metrics TPL` → llenar `js/summit-map/tpl.js` y la tabla §1b (F0-SM, con cuadre vs 10-K).
2. `get_valuation_history TPL` → revisar `price_target ÷ fair_value` igual en los dos métodos (§6.3; si no, congelar P49/P80 con `fix`).
3. Congelar (regla 10, encabezado con snapshot y "frozen on purpose, not live"):
   - `summit:[]` por métrica en `js/results-data/tpl.js` (y `estMatrix.summit` con `emit_summit_matrix.py`);
   - `summit:{}` en `js/segments-data/tpl.js`;
   - `js/submits-data/tpl.js` (esqueleto ya creado, `submits: []`) → registrar `TPL: tplSubmits` en `SUBMITS_DATA` de `js/submits.js` y montar la sub-tab `submits` en `tpl.js`;
   - Target Multiple y Sensitivity: copiar `uber-target-multiple*.js` / `uber-sensitivity*.js` a `tpl-*` y llenar sus `-data.js`;
   - Estimates (`evolution`) cuando haya ≥ 2 snapshots.
4. En `tpl.js`: agregar las sub-tabs a `deepDiveHtml` (Valuation: `targetmult`, `submits`, `sensitivity`; Evolution: `estevo`) y sus ramas en `buildSub`.

**Consenso BBG (llegó 2026-11-04, hoja viva):**
1. `py scripts/consensus/inspect_matrix.py TPL` → `scripts/consensus/map_tpl.json` → `emit_matrix.py` → `apply_matrix.py` → `verify_preprint.py TPL cons` (playbook §9.1).
2. ✅ 2026-11-04: `cons` en Results (`estMatrix`) y forward de TPL en `T_PEERS`. Pendiente: Bottom Line forward y Setup.
3. `py scripts/bbg_extract.py TPL` → `js/overviews/tpl-bbg.js` para Bottom Line forward.
4. Earnings ▸ Setup (`CE_CONS` se arma al cargar desde `tplResults`).

## 6. Bloqueos y preguntas abiertas

| Desde | Unidad | Qué falta | Quién lo consigue | Estado |
|---|---|---|---|---|
| 2026-11-04 | F0-SM, EV-EST, VA-TM, VA-SUB, VA-SENS, Summit en Results/Top Line | modelo Summit de TPL en el MCP | SAB (DCF) + Oscar (ingesta) | abierto |
| 2026-11-04 | consenso | TPL está en la hoja viva pero no en `BBG_CONSENSUS.txt`: correr la exportación para que quede archivado | SAB | abierto |
| 2026-11-04 | EV-RES | Snapshot 2026-11-03: Operating income FY2028 = **−65.5** (los demás años ~800–900): dato raro de Bloomberg, se ve en Results ▸ Annual ▸ Forward. Revisar en BBG; si sigue, se quita esa vintage de `y.opinc` en `map_tpl.json` | SAB | abierto |
| 2026-11-04 | EV-RES / VA-PEERS | La EBITDA de consenso es la *comparable* de Bloomberg (FY2026 871.7) contra la Adjusted EBITDA de la empresa (FY2025 687.4): verificar que sea la misma base | SAB | abierto |
| 2026-11-04 | MG-GOV | La nota apunta a Bottom Line ▸ General ▸ SBC, que aún no existe (se construye en BL-GEN-4) | Claude | abierto |
| 2026-11-04 | OV-1 | celda 6 "IPO" sustituida por "Structure" (trust 1888 → corporación 2021) | SAB | cerrado (aprobado con el Overview) |
| 2026-11-04 | EV-POST | 3T26 se reporta ~4–5 nov 2026 (2025: 5 nov); 10-Q y transcripción | Claude | abierto |

## 6b. Conexiones pendientes ("Live data pending")

| Desde | Unidad ▸ bloque | Qué falta (función / dato) | Quién lo destraba | Estado |
|---|---|---|---|---|
| 2026-11-04 | VA-HIST ▸ toda la gráfica | `get-market-history` | — | cerrado: ya responde en el portal (2026-11-04, P/E trail 33.8×, EV/EBITDA trail 24.1× a $300) |

## 6c. Review del analista — pendientes

| # | Pedido (textual) | Unidad | Qué hay que construir | Depende de | ¿Va a la guía? | Estado |
|---|---|---|---|---|---|---|

## 7. Historial de aprobaciones

### 2026-11-04 · F0 Inventario de datos — APROBADA
- Qué se mostró: el inventario (sin Summit, sin BBG, 10-K FY2025, llamadas trimestrales) y tres decisiones.
- Decisiones: modo exprés por sección; peers LB/VNOM/BSM/KRP/DMLP; esqueletos ocultos para lo que depende de Summit/BBG.

### 2026-11-04 · EV-RES-DATA — consenso cargado (sin compuerta todavía)
- `scripts/consensus/map_tpl.json` (8 métricas por código BBG; capex con signo −1; `drop` q.capex congelado; `dropVintages` de 4 repeticiones que señaló `emit_matrix.py`) → `emit_matrix.py` → `apply_matrix.py` → `verify_preprint.py TPL cons`: filled 149, changed 0, blanked 0.
- Periodos forward agregados (act null) a rev, opinc, adjebitda, netinc, eps, da, fcf (3Q26–3Q27) y capex (solo anual, FY2026–28).

### 2026-11-04 · F1 + Overview (OV-1…OV-F) + EV-RES-DATA/EV-RES + Top Line + VA-PEERS + Management — APROBADAS (modo exprés, por sección)
- Qué se mostró: el portal real en local con sesión de SAB; Results con Actual vs Consensus (23 snapshots) y forward; Peers con forward solo de TPL; Management con calificaciones apagadas.
- Fuentes: 10-K FY2025, 10-Qs, 8-K Ex. 99.1 1Q22–2Q26, DEF 14A 2026-09-25, Consensus_Portal.xlsm (CONSENSUS, 2026-11-03), XBRL de los peers.
- Decisiones: "Structure" en lugar de "IPO" en Key Facts; Track Record sin calificaciones.
- Siguiente: Bottom Line (desde filings + consenso), Earnings (3T26 se reporta ~5 nov; transcripción), Historic Multiple, Misc.

### 2026-11-04 · EV-RES-DATA — 3T26 reportado hoy (sin compuerta)
- TPL publicó el 3T26 el 4 nov 2026 (8-K acc. 0001811074-26-000075; 10-Q acc. 0001811074-26-000077). Cargados en `act` 3Q26: rev 273.4, LRM 201.6, WSO 71.8, líneas (167.3 + 36.2 + 28.4 + 41.4 + 0.1 = 273.4 ✔), opinc 207.8, NI 167.4, EPS 2.42, Adj. EBITDA 238.4, FCF 170.3, capex 14.5 (compras 13,984 + 505 de cuentas por pagar, mismo criterio que 2Q26), DD&A 22.8, segmentos (op. 166.3 / 41.5; NI 133.8 / 33.6), 42,300 Boe/d, $44.97/Boe, agua 672 y 5,541 MBbls/d.
- `verify_preprint.py TPL cons`: filled 201, changed 0, blanked 0. La llamada del 3T26 es posterior (transcripción pendiente).
- Notas de SAB (`Downloads/TPL.pdf`, 11 páginas, Q2 2023 → Q3 2026) transcritas a scratchpad `tplnotes/notes.md`; las págs. 4–5 (comparativo de competidores y gráficas FinChat) no son notas de llamada → fuera de Notes; los números de Bolt que SAB marcó "by an analyst" → fuera.

### 2026-11-04 · EV-SET / EV-POST / EV-NOTES — construidas (👀)
- `tpl-ce.js` (copia de `uber-ce.js`), `tpl-ce-data.js` (`CE_CONS` armado al cargar desde `tplResults`), `results-data/tpl-setup.js`, `themes-data/tpl.js`; registros `TPL_SETUP` (results.js) y `THEME_SRC/THEME_SEG` (segments.js).
- Sin Summit: Setup solo "Consensus"; Post-Results solo "vs Street". Sin guía de la empresa.
- Cifras de las notas de SAB que solo vienen de la llamada se dejaron sin número (regla: cotejar con el 8-K); corregidas: −13.8% NI es semestral; venta de tierra 1T26 = $42.5M (no $41.6M); dividendos 2024 marcados pre-split.
- Results: el motor lee `summit`/`cons` sin revisar si existen (`rsMarginArr`) → se agregaron arreglos `cons` (todas) y `summit` (las de margen) en null; el botón Summit de la tarjeta de sorpresas sale desactivado ("na").
- Bugs encontrados en UBER y arreglados en esta rama: (1) la semilla no sellaba `v` → cada carga reemplazaba lo guardado en Supabase (se agregó el sello); (2) `.ov-uberstercard-dd` → `.ov-uber-dd` en `uber-ce.js` (la regla de texto negro no aplicaba). El mismo bug (1) existe en main para AMZN, MA y SOFI (sin sello) — arreglo aparte.

### 2026-11-04 · BL-GEN-1…5 + BL-SEG — construidas (👀)
- Líneas: sueldos · gastos de agua · G&A (incluye honorarios legales, como en el 10-K FY2024) · DD&A · ad valorem (separada desde FY2021). Revenue − 5 líneas = op. income cada año y trimestre (al $K). 3Q26 agregado del comunicado (sbc pendiente del 10-Q); segmentos por línea llegan a 2Q26.
- Consenso FY2028 de op. income (−65.5) se trata como faltante (regla: negativo con ingreso > $1B), con nota al pie.
- `tpl-bbg.js` generado de la hoja viva (el .txt aún sin TPL); volver a correr `bbg_extract.py TPL` cuando esté.
- CSS: `.ov-tpl-dd` agregado al bloque de Bottom Line de css/overview.css (solo selectores).
- Bug heredado en `uber-bl.js` (no tocado): la tabla bajo la gráfica formatea los márgenes como $ — arreglado en la copia de TPL.

### 2026-11-04 · EV-POST — Q&A de las llamadas
- Transcripciones leídas en el Chrome de SAB (stockanalysis.com, data source Quartr; curl bloqueado por Cloudflare, no se forzó): `docs/calls/TPL-latest.md` (2T26) y `docs/calls/TPL.md` (1T26, 4T25). Texto copiado de la página y verificado por hash contra el DOM.
- 23 filas de Q&A (Texas Capital, KeyBanc, Tudor Pickering Holt), 118 citas, 0 faltantes. Pendiente: llamada del 3T26 (5 nov) → rotar `TPL-latest.md`.

### 2026-11-04 · MISC — propuesta aprobada (SAB: "sigue con Historic Multiple y Misc")
- MISC-comp Competitive Position: cuestionamientos al moat con evidencia a favor y en contra + tabla TPL / LB / VNOM / BSM / KRP / DMLP (acres de superficie, NRA, producción Boe/d, volúmenes de agua, ingreso FY2025, margen operativo, deuda neta), cada celda con fuente.
- MISC-nextgen Next-Gen Land Use: directorio agrupado con subtotales de proyectos/transacciones de data centers, energía, agua y renovables (Bolt, venta de tierra 1T26, Project Kilby, compras en Shackelford/Jones, desalinización Orla).
- MISC-capacity: propuesta, descartada — el ingreso de TPL no depende de capacidad propia (depende de la perforación de terceros); el agua desalinizada es piloto.
- EV-SET 3T26: SAB confirmó que los reales del 3T26 van en Post-Results (Setup queda congelado pre-print, por diseño).

### 2026-11-04 · VA-HIST + MISC — construidas y montadas (👀)
- Recorrido en el portal: 16 sub-tabs, todas con pie de fuentes, sin NaN, consola limpia.
- VA-HIST en vivo (get-market-history responde). Pendiente: caja del 3T26 del 10-Q (hoy se queda la de 2T26).
- MISC: texto de tablas en `--navy` como googl-comp (la guía pide negro #111418) — excepción a decidir.
