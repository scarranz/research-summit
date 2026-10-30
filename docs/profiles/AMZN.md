# AMZN — bitácora de construcción del perfil

> Reglas: `docs/PROFILE_PLAYBOOK.md` §3. Claude la lee completa al empezar cada sesión y la actualiza en cada
> aprobación (no al final).
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos / por actualizar ·
> ✅ aprobada · ✅ʰ heredada (ya cumple la guía; revisada, sin cambios) · ⏭️ omitida (con razón) · ⛔ bloqueada

| Campo | Valor |
|---|---|
| Empresa | Amazon.com, Inc. (NASDAQ: AMZN) |
| Modo | B — poner al día el perfil existente (la referencia de la guía, construida jul–sep 2026, **antes** de la guía) con todo lo que la guía agregó desde el 14 oct 2026 (review TSM, META, GOOGL) |
| Rama | `feat/amzn-restructure` (desde `origin/main` @ `83bedc1`, 2026-10-29; worktree `rs-playbook`) |
| Analista responsable | SAB (Santiago Alvarez) |
| Inicio | 2026-10-29 |
| Forma de trabajo | **Recorrido completo, pero SAB solo aprueba lo nuevo o distinto** (SAB, 2026-10-29). Lo que ya cumple queda ✅ʰ con la revisión anotada; lo que cambia pasa por la compuerta |
| Avance | **45 de 45** (MISC-comp ⏭️ por decisión de SAB) · perfil al día con la guía (F-FINAL 2026-10-29) |

## 1. Inventario de datos (F0)

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | ✔ | el perfil abre hoy (`AMZN` en `js/overviews/index.js`) | el perfil abre | — |
| Filing anual | ✔ | 10-K FY2025 (domestic filer, CIK 1018724); 10-Q 2Q26 | Overview, Top Line, verbatim | — |
| Año fiscal / moneda | ✔ | cierre 31 dic · USD | — | — |
| Summit DCF | ✔ | **4 snapshots en el MCP**: 2025-12-18 (after Q3-25) · 2026-02-10 (Q4-25) · 2026-05-05 (Q1-26) · **2026-08-04 (Q2-26)**. ⚠ `results-data/amzn.js` dice "7 saved model files Dec 2025 → Aug 2026": el MCP hoy tiene 4 — se re-congela de los 4 | F0-SM; Summit en Results/Top Line/Setup/Bottom Line, EV-EST, VA-TM, VA-SUB, VA-SENS | — |
| Consenso BBG | ✔ | `AMZN US EQUITY`: **30 snapshots**, 2019-04-30 → **2026-09-10**; headline completo (Revenue, COGS, Gross profit, opex por función, Op. income, EBITDA, EPS, SBC por función, capex, FCF, RPO) + segmentos (rev, op. income, D&A, PP&E) | `estMatrix.cons`, Setup, Bottom Line, forward de peers | — |
| `get-market-history` (Massive) | ✔ desplegada (PR #142) | precio diario; `ratios` falla → acciones/deuda de EDGAR XBRL (como META/GOOGL) | Historic Multiple, Submit History | — |
| Valuación del modelo en el MCP | ✔ con una duda | 2 métodos por snapshot, `quality_flags` vacío. 08-04: EV/EBITDA 9.5× y P/E 28.0×, 2027 Forward. ⚠ **12-18: no pasa la prueba PT ÷ FV** (duda 4) | VA-TM, VA-SUB, VA-SENS | — |
| SPLC | ✔ | ya cargado en Top Line ▸ Customers y Bottom Line ▸ Supply Chain (fecha a confirmar en su unidad) | TL-CUS, BL-SPLC | — |
| Transcripciones | ✔ | `docs/calls/AMZN.md` (histórico) + `AMZN-latest.md` (2Q26, 2026-07-30). **3T26: Amazon reporta a fines de oct 2026** — se carga en esta rama (SAB, 2026-10-29) | EV-POST, EV-NOTES, citas | — |
| Fiscal.ai | ✔ | AMZN está en el plan | tabla en vivo de Management | — |
| Massive (`liveQuote`) | ✔ | vía `covered-calls-massive` | market cap, peers | — |
| Fotos | ✔ | `img/leadership/` (las que ya usa el perfil) | Management | — |

**Alcance:** todas las unidades son construibles. No hay ⏭️ de alcance.

## 1b. Mapa Summit (F0-SM)

Modelo: Summit DCF AMZN (.xlsm en `G:\My Drive\Summit\Docs\Research\DCF`) · USD · millones · 4 snapshots
(2025-12-18 → 2026-08-04) · **41 etiquetas: 12 core · 26 segment (4 segmentos × rev/opinc/EBITDA/capex/D&A/PP&E +
EBITDA_SEGM) · 0 kpi · 0 guidance · 4 consensus · 3 ignore** · valuación: EV / EBITDA y P / E (Base), `quality_flags`
vacío en los 4 · **4 dudas**. Archivo: `js/summit-map/amzn.js` (sin números).

Fuentes dentro del modelo: **DEFAULT** = totales, proyección **solo anual** (los trimestres valen 0) · **SEGM** = los
tres segmentos + corporativo, proyección **trimestral y anual** de ingreso y utilidad operativa · **BBG** = consenso
anual dentro del modelo. **El modelo no trae costo de ventas, gross profit ni gastos por función** → no hay serie
Summit de gross profit (a diferencia de GOOGL).

Cuadre contra el 10-K FY2025 (snapshot 2026-08-04, `actuals_history`):

| Etiqueta MCP | Rol | Clave portal | Qué es | Base | Unidad | Agreg. | Periodos | Cuadre FY25 | Conf. |
|---|---|---|---|---|---|---|---|---|---|
| `REV` | core | `rev` | Ventas netas | GAAP | USD M | suma | A | 716,924 = 10-K ✔ | ✔ |
| `USREV` | segment | `seg.na.rev` | Ventas North America | GAAP | USD M | suma | Q y A | 426,305 ✔ | ✔ |
| `INTREV` | segment | `seg.intl.rev` | Ventas International | GAAP | USD M | suma | Q y A | 161,894 ✔ | ✔ |
| `AWS` | segment | `seg.aws.rev` | Ventas AWS | GAAP | USD M | suma | Q y A | 128,725 ✔ | ✔ |
| `OPINC` | segment | `seg.na.opinc` | Utilidad operativa North America | GAAP | USD M | suma | Q y A | 29,619 ✔ | ✔ |
| `OPINC2` | segment | `seg.intl.opinc` | Utilidad operativa International | GAAP | USD M | suma | Q y A | 4,750 ✔ | ✔ |
| `OPINC3` | segment | `seg.aws.opinc` | Utilidad operativa AWS | GAAP | USD M | suma | Q y A | 45,606 ✔ | ✔ |
| `OP_INCOME` | core / ignore (proy.) | `opinc` (solo reales) | Utilidad operativa total | GAAP | USD M | suma | A | 79,975 = suma de segmentos ✔ | ❓ duda 1 (proyección rota) |
| `EBITDA` | core | `ebitda` | EBITDA **ajustado** = op. inc. + D&A + SBC | ajustada | USD M | suma | A | 165,198 = 79,975 + 65,756 + 19,467 ✔ | ⚠ no es GAAP |
| `EBITDA_SEGM` | core | `ebitda (Q)` | EBITDA ajustado, trimestral | ajustada | USD M | suma | Q y A | 165,198 ✔ | ✔ |
| `US_EBITDA` · `INT_EBITDA` · `AWS_EBITDA` | segment | `seg.*.ebitda` | Op. inc. + D&A del segmento (**sin** SBC) | — | USD M | suma | A (Q = op. inc.) | 45,122 · 9,657 · 67,056 ✔ | ⚠ duda 2 (trimestral) |
| `CORP_OTHER_EBITDA` · `CORP_OTHER_DNA` | segment | `seg.corp.*` | D&A no asignada a segmentos | — | USD M | suma | A | 23,896 = 65,756 − 15,503 − 4,907 − 21,450 ✔ | ✔ |
| `US_DNA` · `INT_DNA` · `AWS_DNA` | segment | `seg.*.dna` | D&A por segmento (10-K Nota 10) | GAAP | USD M | suma | A | 15,503 · 4,907 · 21,450 ✔ | ✔ |
| `US_CAPEX` · `INT_CAPEX` · `AWS_CAPEX` · `CORP_CAPEX` | segment | `seg.*.capex` | Altas de activo fijo por segmento (signo −) | GAAP | USD M | suma | A | AWS −96,496 ✔ (10-K: "property and equipment additions") | ✔ |
| `US_PPE` · `INT_PPE` · `AWS_PPE` · `CORP_PPE` | segment | `seg.*.ppe` | Activo fijo neto por segmento | GAAP | USD M | fin de periodo | A | AWS 190,055 · Intl 30,632 ✔ | ✔ |
| `OTHER_CAPEX` · `OTHER_PPE` | ignore | — | Línea de conciliación | — | USD M | — | A | capex FY25 +10,533 (positivo) | ❓ duda 3 |
| `DNA` | core | `dna` | D&A total | GAAP | USD M | suma | A | 65,756 ✔ | ✔ |
| `CAPEX` | core | `capex` | Compras de P&E (bruto, signo −) | GAAP | USD M | suma | A | −131,819 ✔ | ✔ |
| `CFO` | core | `cfo` | Flujo de operación | GAAP | USD M | suma | A | 139,514 ✔ | ✔ |
| `FCF` | core | `fcf` | CFO − capex bruto | modelo | USD M | suma | A | 7,695 ✔ (Amazon reporta $11.2B, que netea ventas de P&E e incentivos) | ⚠ |
| `INT_INC` · `INT_EXP` | core | `int_inc` · `int_exp` | Intereses ganados / pagados | GAAP | USD M | suma | A | 4,381 · 2,274 ✔ | ✔ |
| `EARNINGS` | core | `earnings` | Utilidad **ajustada** del modelo | ajustada | USD M | suma | A | 62,995 = (79,975 + 4,381 − 2,274) × (1 − 0.2325) ✔; GAAP fue 77,670 | ⚠ no es GAAP |
| `TAX_RATE` | core | `tax_rate` | Tasa del modelo (la que cuadra EARNINGS), no la efectiva del 10-K | modelo | % (decimal) | promedio | A | 0.2325 real; proyectado 16% (2026–27) y 20% (2028–29) — corregido 2026-10-29 | ✔ |
| `SHARES` | core | `shares` | Acciones diluidas | diluidas | acciones M | fin de periodo | A | 10,827 ✔ — **proyección plana** en 10,827 todos los años | ⚠ |
| `REV_BBG_EST` · `EBITDA_BBG_EST` · `EARNINGS_BBG_EST` · `SHARES_BBG_EST` | consensus | — | Consenso BBG dentro del modelo | — | — | — | A | no se usan (el consenso sale de `BBG_CONSENSUS.txt`) | ✔ |

**Valuación (`get_valuation_history`), prueba PT ÷ FV (§6.3):**

| Snapshot | EV/EBITDA | P/E | PT÷FV EV | PT÷FV P/E | |
|---|---|---|---|---|---|
| 2026-08-04 | 9.5× 2027 Fwd · PT $292.99 | 28.0× 2027 Fwd · PT $314.17 | 1.075 | 1.077 | ✔ |
| 2026-05-05 | 12.0× 2027 · PT $290.68 | 29.0× 2027 · PT $291.95 | 1.129 | 1.131 | ✔ |
| 2026-02-10 | 10.0× 2027 · PT $241.44 | 28.0× 2027 · PT $254.86 | 1.171 | 1.175 | ✔ |
| 2025-12-18 | 15.0× 2027 · PT $338.18 | 25.0× 2027 **Trailing** · PT $240.42 | **1.002** | **1.132** | ❌ duda 4 |

### Dudas

```
❓ 1 · AMZN · OP_INCOME (proyección) — la hoja de proyección trae 197,000 en 2026Q3 y 0 en 2027+.
   Quién responde: autor del modelo (SAB) · Mientras tanto: la utilidad operativa Summit = OPINC + OPINC2 + OPINC3
   (cuadra con el 10-K en FY25). Respuesta (2026-10-29, SAB): aprobado así.
❓ 2 · AMZN · EBITDA por segmento trimestral — la D&A trimestral por segmento vale 0, así que el EBITDA trimestral
   del segmento = su utilidad operativa. Mientras tanto: EBITDA por segmento solo anual. Respuesta (2026-10-29, SAB): solo anual.
❓ 3 · AMZN · OTHER_CAPEX / OTHER_PPE — conciliación con signo raro (+10,533 en FY25). Mientras tanto: no se usa. Respuesta (2026-10-29, SAB): no se usa.
❓ 4 · AMZN · valuación 2025-12-18 — PT ÷ FV = 1.002 en EV/EBITDA vs 1.132 en P/E (y P/E marcado "Trailing", upside
   EV +48.6%). Parece el caso de §6.3 (celda equivocada). Quién responde: SAB, abriendo el workbook de ese submit.
   Respuesta (2026-10-29, SAB): **dejarlo fuera** — `skip` en VA-SUB ("Left out") y fuera de VA-TM.
❓ 5 · AMZN · trimestres 2027+ (USREV/INTREV/AWS/OPINC*) — el archivo 2026-08-04 re-cortó los anuales 2027+ pero no sus
   trimestres (1T27 idéntico al de mayo): la suma de trimestres 2027 vs el anual da AWS −7.4%, op. inc. −22%.
   Respuesta (2026-10-29, SAB): **solo año en curso** — trimestres Summit solo 2026; 2027+ en la vista anual (como GOOGL).
```

### Cambios del mapa
- 2026-10-29 · mapa creado (4 snapshots; antes no existía `js/summit-map/amzn.js`).

## 2. Tablero de unidades

Resultado de la auditoría del 2026-10-29 (código en `83bedc1` contra la guía). **🔁** = no cumple algo que la guía
agregó; la nota dice qué. **✅ʰ** se marca solo al revisarla en su turno.

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | ✅ | 2026-10-29 | SAB | | |
| F0-SM | Mapa de métricas Summit | ✅ | 2026-10-29 | SAB | | nuevo: `js/summit-map/amzn.js`; 4 dudas resueltas |
| B1 | Inventario de contenido existente | ✅ | 2026-10-29 | SAB | | = esta auditoría (§5) |
| B2 | Mapa de reubicación | ✅ | 2026-10-29 | SAB | | casi nada se mueve: la estructura ya es la de la guía |
| F1 | Esqueleto | 🔁 | | | | `<style>` del Overview y del mapa de peers ya quitados (A1); quedan los del Deep Dive (se quitan en su unidad); `ceResultsPending` en Top Line; raíz del Overview con `--brand:var(--steel)` |
| OV-1 | Key Facts | ✅ʰ | 2026-10-29 | — | | ya cumple: 10 celdas, CEO con dos fechas, market cap en vivo sin semilla |
| OV-2 | Descripción | ✅ | 2026-10-29 | SAB | | sin los tipos de cliente |
| OV-3 | Cuadrante 2×2 | ✅ʰ | 2026-10-29 | — | | ya cumple (≤ 30 palabras, títulos en negro) |
| OV-4 | How Amazon makes money | ✅ | 2026-10-29 | SAB | | geografía de mayor a menor con Rest of world al final; sin números en el texto; pastillas sin estilo en línea |
| OV-5 | Products & platforms | ✅ʰ | 2026-10-29 | — | | ya cumple (7 familias, modal por familia) |
| OV-6 | Peer map | ✅ | 2026-10-29 | SAB | | denominadores de EDGAR/BBG + `liveQuote` (A3 cerrado en AMZN); ejes del dato; EPS de Amazon sin ganancias |
| OV-7 | Timeline | ✅ | 2026-10-29 | SAB | | orden cronológico estricto |
| OV-F | Pie | ✅ | 2026-10-29 | SAB | | 10-K del 6-feb-2026; sin Summit ni semillas |
| EV-RES-DATA | Dataset de Results | ✅ | 2026-10-29 | SAB | | 3T26 + guía 4T26; consenso = BBG antes de cada print (295/295 = matriz); Summit de los 4 snapshots; gp q/y; op. inc. anual total y por segmento (A16 cerrado); EPS anual; Summit trimestral solo 2026 |
| EV-RES | Results | ✅ʰ | 2026-10-29 | — | | motor sin cambios; renderiza con el dataset nuevo (selector de vintage: 4 Summit · 30 BBG) |
| TL-GEN | Top Line ▸ General | ✅ʰ | 2026-10-29 | — | | ya cumple; eje con 3T26 (tarjetas leen el último trimestre del dataset) |
| TL-SEG | Top Line ▸ Segments | ✅ | 2026-10-29 | SAB | | productos de AWS con nombre concreto (EC2/Graviton · S3/Aurora/DynamoDB · Bedrock/SageMaker/Trainium); clientes nombrados ya estaban; precio × volumen: declarado NOT CHARTED (Amazon no publica unidades ni precio) — cumple; Summit de drivers con snapshot 2026-08-04 en `source`; costos de envío 3T25/4T25/3T26 y FY25 completados del 8-K |
| TL-OTH | Top Line ▸ Other | ✅ʰ | 2026-10-29 | — | | ya cumple (líneas de ingreso + geografía, citas del 10-K) |
| TL-CUS | Top Line ▸ Customers | ✅ʰ | 2026-10-29 | — | | secciones 1–4 cumplen; sección 5 espera el motor (como GOOGL) → Bloqueos |
| EV-EST | Estimates | ✅ʰ | 2026-10-29 | — | | bloque `evolution` con los 7 archivos Summit fechados (Dic-2025 → Ago-2026); no hay submit nuevo desde el 2026-08-04 → nada que agregar |
| EV-SET | Earnings ▸ Setup | ✅ | 2026-10-29 | SAB | | máquina formal `amzn-ce.js` (copia de `googl-ce.js`); datos en `amzn-ce-data.js`; CE_CONS se rearma del dataset de Results; `setup.us` leído del dataset (A17 cerrado) |
| EV-POST | Earnings ▸ Post-Results | ✅ | 2026-10-29 | SAB | | 3T26 (print + notas del 8-K); llamadas 4T25/1T26/2T26 textuales de Motley Fool (77/84/66 citas verificadas); textos IA fuera de la vista; Call Summary 3T26 pendiente (transcripción no publicada) |
| EV-NOTES | Earnings ▸ Notes | ✅ | 2026-10-29 | SAB | | piel formal + Watch List `palette:'summit'`; el registro guardado en Supabase gana siempre (`AMZN_THEMES_V=0`) — los ganchos cerrados se agregan en el portal, no en la semilla |
| BL-GEN-1 | Profitability & margins | ✅ | 2026-10-29 | SAB | | copia de `googl-bl.js` → `amzn-bl.js` + `amzn-bl-data.js` (XBRL 10-K/10-Q + 8-K 3T26; cuadre 23/23 periodos; 66 citas verificadas); gross profit con consenso; Summit anual leído de `views.y` |
| BL-GEN-2 | The bridge | ✅ | 2026-10-29 | SAB | | costo de ventas aparte (una barra: el 10-K no da componentes) + subtotal Gross profit; modo Cost structure |
| BL-GEN-3 | Op. income → net income | ✅ | 2026-10-29 | SAB | | leyenda sin fechas tecleadas; Normalized sin la ganancia no operativa |
| BL-GEN-4 | SBC | ✅ | 2026-10-29 | SAB | | Dilution + SBC by line (XBRL por línea); eje de acciones a la derecha (A9); línea Summit de acciones (snapshot 2026-08-04) |
| BL-GEN-5 | Expense lines | ✅ | 2026-10-29 | SAB | | 6 líneas en el orden del 10-K, estructura formal de 6 secciones, citas verbatim |
| BL-SEG | Bottom Line ▸ Segments | ✅ | 2026-10-29 | SAB | | optgroups; la nota avisa la caída Summit→BBG; EBITDA por segmento = op. inc. + D&A |
| BL-SPLC | Supply Chain | ✅ | 2026-10-29 | SAB | | tabla `.rs-ft` (antes `.ce-tbl`, cuyo estilo vivía en el Earnings viejo) |
| VA-HIST | Historic Multiple | ✅ | 2026-10-29 | SAB | | `amzn-histmult.js` copia de `googl-histmult.js` + `amzn-histmult-data.js` (EDGAR XBRL 1Q19–2Q26 + 8-K 3T26); P/E sin no operativos, sin P/E forward (A20 resuelto por decisión); EBITDA adj. forward de `estMatrix.cons.y` |
| VA-PEERS | Peers | ✅ | 2026-10-29 | SAB | | mismo mapa que OV-6 (aprobado con el Overview) |
| VA-TM | Target Multiple / PEG | ✅ | 2026-10-29 | SAB | | `amzn-target-multiple.js` copia de `googl-…`; datos congelados `amzn-target-multiple-data.js` (3 submits); sin `TM_LIVE_READY`/`SNAP_DATA`/`MOCK_*` (A22); `_ndSrc` (A23) |
| VA-SUB | Submit History | ✅ | 2026-10-29 | SAB | | motor `submits.js` + `js/submits-data/amzn.js` (4 submits, 2025-12-18 con `skip`) |
| VA-SENS | Sensitivity | ✅ | 2026-10-29 | SAB | | `amzn-sensitivity.js` copia de `googl-…` + `amzn-sensitivity-data.js` (snapshot 2026-08-04); múltiplos del modelo 9.5×/28×, año 2027; Street desde BBG por segmento (sin `CONS` inventado, A24); A26 explicado en el pie |
| MG-TEAM | Executives & Board | ✅ʰ | 2026-10-29 | — | | ya cumple |
| MG-OWN | Ownership | ✅ | 2026-10-29 | SAB | | sin emojis en las cajas; `.ew-box` en la hoja de estilos (A29) |
| MG-GOV | Governance & SBC | ✅ | 2026-10-29 | SAB | | KPIs que no repiten Ownership; sin emojis (A29) |
| MG-TRACK | Track Record | ✅ | 2026-10-29 | SAB | | escala con tokens (`--pos`/`--gold`), campo `at` (A28) |
| MISC-capex | Misc ▸ Capex & Depreciation | ✅ | 2026-10-29 | SAB | | supuestos del workbook fechados al submit 2026-08-04 (SAB); `<style>` en línea pendiente de subir a la hoja (A10) |
| MISC-manda | Misc ▸ M&A | ✅ʰ | 2026-10-29 | — | | sin cambios |
| MISC-other | Misc ▸ Other Analysis | ✅ʰ | 2026-10-29 | — | | sin cambios |
| MISC-comp | Misc ▸ Competitive position | ⏭️ | 2026-10-29 | SAB | | propuesta y descartada por SAB (eligió solo Capacity → revenue) |
| MISC-capacity | Misc ▸ Capacity → revenue | ✅ | 2026-10-29 | SAB | | `amzn-misc.js` (copia de `googl-misc.js`) + `amzn-misc-data.js`: cadena capex → GW agregados (llamadas) → instalado (no divulgado: se corta) → backlog $496B / 6.4 años (10-Q) → ingreso AWS; regiones AWS por país (41, página oficial) |
| F-FINAL | Cierre | ✅ | 2026-10-29 | SAB | | recorrido completo en el harness; B3: 21 → 23 sub-tabs del Deep Dive (+Submit History, +Capacity → revenue), ninguna quitada |

Fuera del perfil, en la misma rama (SAB, 2026-10-29): **3T26** (Results, Earnings, Hyperscalers) cuando Amazon reporte.

## 3. Decisiones del analista

- 2026-10-29 · alcance · Recorrido completo; SAB aprueba solo lo nuevo o distinto — SAB
- 2026-10-29 · 3T26 · El reporte del 3T26 va en esta misma rama — SAB
- 2026-10-29 · OV-6 · EPS de Amazon en el mapa de peers **sin ganancias no operativas** (como Alphabet): utilidad operativa FY25 × (1 − tasa efectiva 19.7%) ÷ acciones diluidas = $5.93 (GAAP $7.17); sin P/E forward para Amazon. Peers en GAAP — SAB
- 2026-10-29 · EV-RES-DATA · Summit trimestral solo para el año en curso (2026); 2027+ solo anual (duda 5) — SAB
- 2026-10-29 · EV-POST · Citas de llamadas textuales de Motley Fool para todos los trimestres (reemplazan los registros reconstruidos de prensa); textos de análisis IA fuera de la vista, como META — SAB
- 2026-10-29 · VA-TM · El salto de EBITDA del submit 2026-08-04 (FY27 +27.5% vs earnings +9.9%: D&A+SBC suben con el capex) se marca "EBITDA step-up", no cambio de definición — SAB
- 2026-10-29 · MISC · Solo Capacity → revenue; Competitive position descartada; supuestos de capex del workbook fechados al submit del 2026-08-04 — SAB
- 2026-10-29 · F0-SM · Utilidad operativa Summit = OPINC + OPINC2 + OPINC3; EBITDA por segmento solo anual; OTHER_CAPEX/PPE no se usan; submit 2025-12-18 fuera de VA-SUB y VA-TM — SAB

## 4. Excepciones aceptadas

## 5. Mapa de reubicación (solo modo B)

AMZN ya tiene la estructura de la guía (es su referencia), así que B2 no mueve piezas entre pestañas: cada pieza se
queda donde está y se corrige en su unidad (tablero §2). Las únicas altas son VA-SUB, MISC-comp y MISC-capacity; no
se quita nada. El conteo de control se hace en F-FINAL contra las sub-tabs de hoy: **7 secciones · 23 sub-tabs**
(Top Line 4 · Bottom Line 3 · Evolution 3 · Valuation 4 · Management 4 · Misc 3, + Overview).

## 6. Bloqueos y preguntas abiertas

| Desde | Unidad | Qué falta | Quién lo consigue | Estado |
|---|---|---|---|---|
| 2026-10-29 | VA-SUB / VA-TM | duda 4: valuación del submit 2025-12-18 | SAB | cerrada: se deja fuera |
| 2026-10-29 | EV-POST ▸ 3T26 | Call Summary del 3T26: transcripción de Motley Fool no publicada el 29-oct (el 2T26 tardó ~8 días) | Claude, al publicarse | cerrada 2026-10-30: transcripción de Dani (Drive, `AMZN calls.txt`) |
| 2026-10-29 | TL-CUS ▸ sección 5 | "What each top customer buys" — `segments.js` no la dibuja todavía | PR de motor aparte | cerrada 2026-10-30: motor en `feat/segments-customer-buys` |

## 6b. Conexiones pendientes ("Live data pending")

| Desde | Unidad ▸ bloque | Qué falta (función / dato) | Quién lo destraba | Estado |
|---|---|---|---|---|

## 6c. Review del analista — pendientes

| # | Pedido (textual) | Unidad | Qué hay que construir | Depende de | ¿Va a la guía? | Estado |
|---|---|---|---|---|---|---|

## 7. Historial de aprobaciones

### 2026-10-29 · F0 · F0-SM · B1 · B2 — APROBADAS
- Qué se mostró: inventario (4 snapshots Summit, 30 BBG), mapa de 41 etiquetas con cuadre FY25 vs 10-K, prueba PT÷FV de los 4 submits, lista de trabajo de 45 unidades.
- Fuentes: MCP Summit (`list_snapshots`, `list_metrics`, `get_fundamentals` 2026-08-04, `get_valuation_history`); 10-K FY2025; `BBG_CONSENSUS.txt` (`inspect_matrix.py`).
- Decisiones: dudas 1–3 como se propusieron; duda 4 → el submit 2025-12-18 se deja fuera.

### 2026-10-29 · OV-1 … OV-7 · OV-F Overview — APROBADO (OV-1, OV-3, OV-5 heredadas)
- Qué se mostró: peer map con denominadores (10-K/10-Q/20-F vía EDGAR XBRL: WMT FY Jan-26, COST FY Aug-26, MELI FY25, BABA FY Mar-26 en US$ de conveniencia; GOOGL/MSFT/AMZN como en el perfil de GOOGL; forward BBG solo AMZN y GOOGL) y múltiplos en vivo; ejes derivados; geografía ordenada; Timeline cronológico; lede sin tipos de cliente; pie nuevo; sin `<style>` en línea (clases a `css/overview.css`: `.ov-amzn` en el texto negro, `.ov-amzn-dd` en la tabla de peers).
- Revisión interna en el harness (sin sesión: sin precio en vivo); SAB revisa en el portal.
- Decisión: EPS de Amazon sin ganancias ($5.93, no los ~$5.82 que se le dijeron al preguntar: se usó la definición de GOOGL — op. income × (1 − tasa efectiva) — en lugar de la utilidad ajustada del modelo, para que el dato salga del 10-K y no de Summit).

### 2026-10-29 · EV-RES-DATA Dataset de Results — APROBADA · EV-RES heredada
- Qué se mostró: 3T26 del 8-K Ex. 99.1 (acc. 0001018724-26-000038, 29-oct-2026) y guía 4T26 ($240–247B ventas, $28.5–33.5B op. inc.);
  consenso = último snapshot BBG antes de cada print (`emit_matrix.py` regenerado con el snapshot 2026-09-10; el 2026-08-04 ya no
  existe en el archivo: la hoja viva lo sobrescribió); `verify_preprint.py AMZN cons` → 295 iguales, 0 cambios, 0 vaciados;
  Summit de los 4 snapshots (`emit_summit_matrix.py`, dumps del 2026-10-29); métricas nuevas gp (q, y), opinc anual + 3 segmentos,
  EPS anual (y `map_amzn.json` extendido: q/y gp, y opinc/segmentos/eps); notas reescritas (definición + advertencias).
- Cuadre vs fuente: 3T26 (ventas, AWS, op. inc., NA op. inc., EPS, capex, GP) = 8-K; 2T26 y 4T25 = tablas del 8-K. GP histórico =
  ingresos − costo de ventas (EDGAR XBRL, Q4 = anual − 9M); anual GP = BBG (Rep) al dólar.
- Trimestres ↔ año (por fuente, vintage del archivo): 2026 Summit ventas −0.3%, AWS +0.8%; cons ventas −0.03%. 2027 Summit no cuadra → duda 5.
- Efecto en otras unidades: Bottom Line (`aSummitAnnual`, `aSegSummitAnnual`) suma trimestres → pasará a leer el anual en BL-GEN/BL-SEG.

### 2026-10-29 · TL-GEN · TL-OTH · TL-CUS · EV-EST — heredadas · TL-SEG en revisión
- Revisadas contra §10–§11: ya cumplen. Cambios de datos: eje trimestral con 3T26; costos de envío completados del 8-K.
- `estMatrix`: se conservan como vintages los 3 archivos Summit que el MCP ya no sirve (2026-05-13, 07-30, 08-03) y la fila BBG
  2026-08-04 que la hoja viva sobrescribió (§20b: lo viejo no se borra si un panel lo usa como vintage). `verify_preprint` sigue 295/295.

### 2026-10-29 · EV-SET · EV-POST · EV-NOTES Earnings + TL-SEG — APROBADAS
- Qué se mostró: Earnings en la máquina formal (`js/overviews/amzn-ce.js`, copia de `googl-ce.js`), datos movidos de `amzn.js` a
  `js/overviews/amzn-ce-data.js` (el cierre `ce*` viejo de `amzn.js` ya no se monta); 3T26 reportado (8-K Ex. 99.1); llamadas
  4T25 (fool.com 2026-02-05), 1T26 (2026-04-29), 2T26 (2026-08-07) con citas verbatim verificadas por subagentes (77 · 84 · 66, 0 faltantes);
  errores del registro viejo corregidos (citas inexistentes, oradores y analistas). Nombres concretos de productos AWS en TL-SEG.
- Advertencias anotadas en el archivo: Motley Fool marca sus transcripciones como parcialmente hechas con IA; 4T25: una respuesta a
  Mahaney atribuida a Olsavsky que parece de Jassy (se deja como la fuente).
- Pendiente: Call Summary 3T26 (Bloqueos).

### 2026-10-29 · Hyperscalers 3T26 (fuera del perfil, misma rama)
- Columna Oct '26 de Amazon desde el 8-K: capex de efectivo $75.9B (= $77,259M − $1,381M, derivado), marco 2026 ~$220B reiterado,
  AWS $45,984M / op. inc. $17,773M. Backlog, citas de capacidad y What They Said quedan null hasta la transcripción.

### 2026-10-29 · BL-GEN-1…5 · BL-SEG · BL-SPLC · VA-HIST · VA-TM · VA-SUB · VA-SENS · MG-OWN · MG-GOV · MG-TRACK · MISC-capex · MISC-capacity · Hyperscalers 3T26 — APROBADAS
- Bottom Line y Valuation portados por subagentes desde los módulos de GOOGL (archivos `amzn-bl*.js`, `amzn-histmult*.js`,
  `amzn-target-multiple*.js`, `amzn-sensitivity*.js`); Submit History, Management, Misc y Hyperscalers por Claude.
- CSS: toda regla con `.ov-googl-dd` en `css/overview.css` tiene ahora su par `.ov-amzn-dd` (109 listas `:is()` + 167 selectores);
  estilos de `bottomlineCapexBody` movidos a la hoja (A10).
- Avisos anotados: 4T22 EPS sin no operativos negativo (tasa efectiva 129%, Rivian); deuda neta 3T26 sin la porción circulante
  (~$3B) hasta el 10-Q; TAX_RATE del modelo 16% en 2026–27 y 20% en 2028–29 (mapa corregido); costo de ventas sin componentes.
- Decisión: "EBITDA step-up" (ver Decisiones).

### 2026-10-29 · F-FINAL Cierre — recorrido (pendiente de aprobación final)
- Recorrido en el harness (rAF shim): las 23 sub-tabs cargan; consola sin errores nuevos; sin emojis en el Deep Dive (quitados los de Leases);
  cada sub-tab con pie (Top Line usa el pie del motor, `.ov-fynote.sg-src`).
- Excepciones (como GOOGL): ids `rs*` duplicados porque el motor de Results se monta dos veces (Setup + Results, §16); `<style>` que
  traen el motor de Earnings copiado (5), `management.js` (1) y Leases (1, `EW_CSS`).
- Conciliación B3: Deep Dive 21 sub-tabs → 23 (+VA-SUB, +MISC-capacity); nada borrado. El código viejo de Earnings y Bottom Line sigue
  en `amzn.js` sin montarse; sus datos se movieron a `amzn-ce-data.js` / `amzn-bl-data.js`.
- Pendientes después de entregar: Call Summary 3T26 y celdas de llamada en Hyperscalers (transcripción de Motley Fool); deuda neta 3T26
  completa con el 10-Q; TL-CUS sección 5 (motor). Verificar en el portal con sesión: precio en vivo (peers, Historic Multiple, Submit History).

### 2026-10-29 · F-FINAL — APROBADO
- SAB aprueba el perfil completo; commit + push de `feat/amzn-restructure` (sin PR hasta que lo pida).

### 2026-10-30 · EV-POST ▸ 3T26 Call Summary · EV-NOTES (propuestas) · Hyperscalers (celdas de llamada) — en revisión
- Fuente de la llamada: la transcripción que juntó Dani (Drive: `Extras/Team/DAA/Ad hoc info search/AMZN calls.txt`, 30-oct;
  el archivo no dice de qué proveedor sale). 13 temas de prepared remarks, 6 preguntas (Post, Nowak, Mahaney, Sheridan, Anmuth,
  Sandler), 7 puntos en "Also on the call"; 73 citas cotejadas palabra por palabra contra el archivo, 0 faltantes.
- Propose Notes (`call.newQuestions`, 14): paráfrasis en inglés de las notas manuscritas de SAB (30-oct), cada una con su sub-tema.
  Nuevos: AWS ▸ Bedrock; Amazon US ▸ Grocery & everyday essentials, Zoox, Amazon Leo, Prime Video. Se publican desde el portal
  (la copia guardada en Supabase manda sobre la semilla). `amzn-ce.js`: una propuesta puede nombrar su tema (`seg`) y el
  sub-tema nuevo llega con el nombre puesto.
- Correcciones a las notas, contra la fuente: la capitalización de Leo empieza en el **1T27**, no en el 4T ("later than I've been
  predicting"); "tens of billions… profitable" es **Prime Video**; Zoox y el FCF TTM (−$42.4B) salen del 8-K, no de la llamada.
- Hyperscalers: backlog Oct '26 = $578B; cita de capacidad Oct '26; las 5 filas de What They Said con la celda 3T26.
  Revisado en el portal (localhost, con sesión). Las etiquetas al final de cada línea ahora respetan el orden vertical (AMZN $578B quedaba debajo de GOOGL $561B) y se actualizó el pie de What They Said.
- Pendiente: el 10-Q del 3T26 (presentado el 30-oct, acc. 0001018724-26-000040): deuda neta completa, D&A por segmento y drivers del MD&A en Bottom Line.
- Aprobado por SAB (30-oct) → commit a7b5957. Además: el recuadro "Model QA" de Hyperscalers ya no muestra las etiquetas `<b>`.

### 2026-10-30 · 10-Q del 3T26 (presentado el 30-oct, acc. 0001018724-26-000040) — en revisión
- Deuda neta 3T26: deuda $179,952M (no circulante $173,125M + circulante $6,827M, Nota 5) − caja y valores $114,226M
  ($55,783M + $58,443M) = **$65,726M** (antes $58,899M sin la porción circulante). Lo leen Historic Multiple, Target Multiple
  y Sensitivity; las dos últimas ya no dicen "non-current only" y nombran el 10-Q.
- D&A por segmento 3T26 (Nota 8): NA $4,566M · Internacional $1,346M · AWS $9,230M → Bottom Line ▸ Segments (EBITDA por
  segmento y puente por costo). La nota de EBITDA ya no dice que al último trimestre le falta la D&A cuando sí la tiene.
- Bottom Line ▸ General: drivers del MD&A al 3T26 (costo de ventas + envíos $28.3B, T&I, S&M, G&A, otros); contratos de energía
  3T26 ($91M de ganancia no realizada, Nota 1); se conservan los puntos fechados del 2T26. Citas de la llamada del 3T26 en
  costo de ventas, fulfillment y T&I (Leo: capitalización desde el 1T27). 10 citas cotejadas, 0 faltantes.
- Backlog: 3T26 = $578B (Nota 1) agregado a la serie de Top Line (Bloomberg aún no lo tenía); Misc ▸ Capacity → Revenue con
  vida remanente 6.1 años (antes 6.4, 10-Q del 2T26).
- Cierra el pendiente "deuda neta 3T26 completa con el 10-Q". Queda: TL-CUS sección 5 (motor).

### 2026-10-30 · TL-CUS ▸ sección 5 "What each top customer buys" — en revisión
- Motor: `segments.js` la dibuja ahora (rama propia `feat/segments-customer-buys`, mergeada aquí; la guía §10 actualizada).
  Peso tecleado o calculado de las series del dataset; sin `buys` no aparece, así que los demás perfiles no cambian.
- AMZN, por clase de cliente (Amazon no tiene clientes grandes): Consumers 47.6% · Sellers 24.0% · Developers and enterprises
  18.0% · Advertisers 9.6% del FY2025 (líneas de ingreso del 10-K, Nota 10; las 7 suman $716,924M); Content creators sin peso
  (dentro de tiendas y suscripciones). Debajo, los dos clientes de AWS que nombra el 10-Q del 3T26 (Nota 1): OpenAI ($38.0B +
  $100.0B a 8 años) y Anthropic (+más de $100.0B a 10 años), como compromisos, no como peso en el ingreso.
- No se afirma que esos compromisos estén dentro del backlog de $578B: el 10-Q no lo dice (y en el 1T26 Anthropic estaba fuera).

### 2026-10-30 · Hyperscalers ▸ Capacity & Cost/GW — "The model against the 3Q26 guides" (fuera del perfil, misma rama)
- No hay vintage nuevo de GW: la hoja D&A del DCF de AMZN (29-oct) es igual a la de agosto; los DCF de GOOGL (29-oct) y META (28-oct)
  no traen hoja de capex/D&A; el de MSFT no cambia desde el 4-ago. SAB: no re-resolver los GW, poner una nota modelo vs guía.
- Nota nueva (`HS_GW_GUIDE_CHECK`): capex 2026 del modelo vs guía 3T26 — AMZN en línea; GOOGL ($205.8B vs $195–205B) y META
  ($145.0B vs $135–145B) en el techo, −2.8% y −3.4% de GW al punto medio (aritmética nuestra, rotulada); MSFT no comparable (año fiscal).
- Ladder CY2026: el resumen de META y MSFT seguía en $137.5B y $175B; ahora $140B y $170B, la guía del 3T26.
- Pendiente para SAB: actualizar `CapEx D&A DCFs.xlsx` con el 3T26 para re-extraer GW, depreciación y el puente.

### 2026-10-30 · Consenso Bloomberg 2026-10-30 (post-print, export de Dani) cargado
- `estMatrix.cons`: se **agregó** el snapshot 10/30 (23 líneas, ninguna borrada) con un script de alta en vez de regenerar el
  bloque: el archivo ya no trae el 9/10 (lo pisó la hoja viva) y trae otra versión del 8/4 (9 celdas) y del capex 2026 en cuatro
  snapshots viejos; se conservan las versiones aprobadas el 29-oct (§20b).
- Arreglos fijos `cons`: solo celdas futuras (sin `act`), 77 celdas (4T26, 1T–3T27, FY2026–28) al valor que el motor ya toma de la
  matriz. `verify_preprint.py AMZN cons` → same=306, changed=0, filled=0, blanked=0; 0 celdas reportadas tocadas (cotejado contra copia).
- `amzn-bbg.js` regenerado (`bbg_extract.py`, asOf 10/30/2026): Bottom Line, Sensitivity (Street), Target Multiple leen de ahí.
- Peers (OV-6): fila AMZN forward EBITDA FY2026 $222,018M y crecimiento 15.7% (antes $220,794M / 15.6%, Sep 10). La fila GOOGL queda
  en su snapshot del Sep 8: su crecimiento forward (26.8%) no se reproduce con el ingreso del consenso; pendiente de revisar en GOOGL.
- No cambia: Estimates (`evolution`) — su consenso es el que viene dentro de cada snapshot Summit; sin snapshot Summit posterior al
  4-ago no hay punto nuevo. Setup del 3T26 (consenso previo al print, 9/10) tampoco.
