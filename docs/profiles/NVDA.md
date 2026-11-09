# NVDA — bitácora de construcción del perfil

> Reglas: `docs/PROFILE_PLAYBOOK.md` §3. Claude la lee completa al empezar cada sesión y la actualiza en
> cada aprobación (no al final).
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)

| Campo | Valor |
|---|---|
| Empresa | NVIDIA Corporation (NASDAQ: NVDA) |
| Modo | B — reordenar existente (`js/overviews/nvidia.js`, 2,089 líneas en main @ `cc7ede9`) |
| Rama | `feat/nvda-restructure` (worktree `C:\Users\santi\Developer\rs-nvda`) |
| Analista responsable | SAB |
| Inicio | 2026-10-28 (F0 pausada ese día; retomada 2026-11-02) |
| Avance | 30 de 40 unidades aprobadas · 0 omitidas · 2 bloqueadas (M = filas del tablero − ⏭️ de alcance; Anexo C) |

## 1. Inventario de datos (F0)

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | sí | NVDA ya tiene perfil en el portal | el perfil abre | — |
| Filing anual (10-K / 20-F) | sí, 10-K | 10-K FY2026 presentado 2026-02-25; 10-Q 2Q FY27 2026-08-26; DEF 14A 2026-05-12; próximo print 3Q FY27 ~2026-11-19 | Overview, Top Line, textos verbatim | — |
| Año fiscal / moneda | ⚠ no calendario | cierra el último domingo de enero (FY2026 = feb-2025 → ene-2026); USD | — | componentes que asumen año calendario (§14): se etiquetan en año fiscal (FY27, 3Q FY27) |
| Summit DCF | sí | modelo propio de SAB (`DCF\Semiconductors - SAB\NVDA\DCF NVDA.xlsm`); 3 snapshots: 2025-12-12 (después de 3Q FY26) · 2026-03-04 (4Q FY26) · 2026-08-28 (2Q FY27); 33 etiquetas | Summit en Results/Estimates; Target Multiple; Sensitivity; Submit History | — |
| Consenso BBG (`BBG_CONSENSUS.txt` + `Consensus_Portal.xlsm`) | sí | 30 snapshots 2019-05-21 → **2026-09-09** (último reportado 2Q FY27); 26 métricas + 8 slots de segmento (revenue, Data Center, op. profit por segmento); layout estable; etiquetas en año fiscal | `estMatrix.cons`, Setup, export de Bottom Line | — |
| `get-market-history` (Massive) | sí (responde 200, ya no 404) | confirmado en VA-HIST el 2026-11-09 (precio diario NVDA desde 2019-05-21) | Historic Multiple en vivo | — |
| Valuación del modelo en el MCP (`get_valuation_history`) | sí, confiable | 3 submits, EV/EBITDA + P/E, sin `quality_flags`. 2026-08-28: 18× EV/EBITDA y 22× P/E sobre 2028 → PT $370.54 / $370.00. Prueba PT÷FV: cuadra en 2026-08-28 (1.112 / 1.112) y 2026-03-04 (1.281 / 1.281); 2025-12-12 usa años distintos por método (EV/EBITDA 2028, P/E 2027) → se revisa en VA-SUB | Summit congelado en todo el perfil: EV-EST, VA-TM, VA-SUB, VA-SENS | — |
| SPLC (clientes / proveedores) | sí | `nvidia-map-reference/SPLC_BBG.xlsx` (NVDA sujeto) | TL-CUS tabla, BL-SPLC | — |
| Transcripciones | ❌ no | nada en `docs/calls/`; Quartr no se conectará (SAB, 2026-10-26) | EV-POST, EV-NOTES, citas | EV-POST y EV-NOTES sin fuente hasta conseguir los PDFs oficiales de IR |
| Fiscal.ai (plan) | sí | NVDA está en el plan gratuito | tabla en vivo de Management | — |
| Massive (`liveQuote`) | sí | se confirma en F1 | market cap, peers | — |
| Fotos / imágenes | sí | 6 de liderazgo (`img/leadership/nvda-*.jpg`), 4 de productos | Management, Products | — |
| Contenido existente (modo B) | sí | main: Overview en cajas + Deep Dive con 6 pestañas planas (Segments · Technology · Management · Consensus · Valuation · Industry Analysis). Ramas sin mergear: `feat/nvidia-overview`, `feat/nvidia-overview-enhancements`, `feat/nvidia-overview-v2` (taxonomía, placeholders) | B1 / B2 | — |

**Alcance acordado (2026-11-02, SAB):** las 40 unidades; ninguna ⏭️ de alcance. EV-POST y EV-NOTES quedan ⛔ hasta tener las transcripciones oficiales de IR (3Q FY26 → 2Q FY27, y 3Q FY27 del ~2026-11-19). Se construye con Summit 2026-08-28 y BBG 2026-09-09 y se refresca después del print de 3Q FY27.

## 1b. Mapa Summit (F0-SM)

> Reglas: `docs/PROFILE_PLAYBOOK.md` §6.3. Una fila por **cada** etiqueta de `list_metrics`, incluidas las `ignore`.
> Archivo: `js/summit-map/nvda.js` (sin números, no lo importa el portal).

Modelo: `G:\My Drive\Summit\Docs\Research\DCF\Semiconductors - SAB\NVDA\DCF NVDA.xlsm` (autor: SAB) · USD · millones · 3 snapshots (2025-12-12 → 2026-08-28) · **33 etiquetas: 19 core · 7 segment · 0 kpi · 2 guidance · 4 consensus · 1 ignore** · valuación: EV/EBITDA + P/E (Base, Forward), sin quality_flags en los 3 submits.
Año fiscal: periodo MCP `2026` = FY2026 (feb-2025 → ene-2026); `2027Q2` = 2Q FY27. Cuadres contra SEC XBRL (companyfacts, 10-K FY2026 y 10-Q 2Q FY27), bajados el 2026-11-02.

| Etiqueta MCP | Rol | Clave portal | Qué es, en una línea | Base | Unidad real | Agregación | Periodos | Cuadre vs filing | Confianza |
|---|---|---|---|---|---|---|---|---|---|
| `REV` | core | `rev` | Ingreso total | GAAP | USD M | suma | A y Q | FY26 215,938 vs 10-K 215,938 → Δ 0 ✔; 2Q FY27 96,221 vs 10-Q 96,221 ✔ | ✔ |
| `GAAP_GROSS_PROFIT` | core | `gp` | Utilidad bruta | GAAP | USD M | suma | A y Q | FY26 153,463 ✔; 2Q FY27 72,142 ✔ | ✔ |
| `ADJ_GROSS_PROFIT` | core | `gp_adj` | Utilidad bruta ajustada | ajustada | USD M | suma | A y Q | FY26 = GAAP + 270 (≈ AR_COGS 268); 2Q FY27 = GAAP + 117 (= AR_COGS 46 + SBC_COGS 71) | ❓ duda 2 |
| `GAAP_OP_INCOME` | core | `opinc` | Utilidad operativa | GAAP | USD M | suma | A y Q | FY26 130,387 ✔; FY25 81,454 vs 81,453 ✔; 2Q FY27 63,734 ✔ | ✔ |
| `OP_INCOME` | core | `opinc_adj` | Utilidad operativa ajustada (el motor del DCF) | GAAP + costos de adquisición | USD M | suma | A y Q | FY26 130,898 = GAAP + 511 (AR_COGS 268 + AR_OPEX 241 + 2) | ⚠ duda 1 |
| `EBITDA` | core | `ebitda` | EBITDA del modelo | modelo | USD M | suma | A | FY26 145,063 = OP_INCOME 130,898 + DNA 2,843 + INT_INC 2,300 + otros no operativos 9,022 (10-K) → Δ 0; proyección = OP_INCOME + DNA + INT_INC | ⚠ duda 3 |
| `EARNINGS` | core | `earnings` | Utilidad del modelo (ajustada) | ajustada | USD M | suma | A | FY26 120,578 = utilidad neta 10-K 120,067 + 511; FY27E = (OP_INCOME + INT_INC − INT_EXP) × (1 − 0.17) al dólar | ⚠ duda 1 |
| `DNA` | core | `dna` | Depreciación y amortización | GAAP | USD M | suma | A | FY26 2,843 ✔ | ✔ |
| `CAPEX` | core | `capex` | Compras de PP&E e intangibles (negativo) | GAAP | USD M | suma | A (DEFAULT) · Q real (SEGM) | FY26 −6,042 vs 10-K 6,042 ✔ | ✔ |
| `CFO` | core | `cfo` | Flujo de operación | GAAP | USD M | suma | A | FY26 102,718 ✔ | ✔ |
| `FCF` | core | `fcf` | CFO − capex | modelo | USD M | suma | A | FY26 96,676 = 102,718 − 6,042 ✔ | ✔ |
| `INT_INC` | core | `int_inc` | Ingreso por intereses | GAAP | USD M | suma | A | FY26 2,300 ✔ | ✔ |
| `INT_EXP` | core | `int_exp` | Gasto por intereses | GAAP | USD M | suma | A | FY26 259 ✔ | ✔ |
| `TAX_RATE` | core | `tax_rate` | Tasa de impuestos del modelo | modelo | % (decimal) | promedio | A | FY26 0.1506 = impuesto 21,383 ÷ (antes de impuestos 141,450 + 511); 10-K efectiva 15.1% | ✔ |
| `SHARES` | core | `shares` | Acciones diluidas promedio | diluidas | acciones M | fin de periodo | A | FY26 24,514 ✔ | ✔ |
| `SBC_COGS` | core | `sbc_cogs` | SBC en costo de ventas (positivo) | GAAP | USD M | suma | A y Q, solo reales | FY26 261 + 6,125 = 6,386 = SBC 10-K ✔ | ✔ |
| `SBC_OPEX` | core | `sbc_opex` | SBC en gastos operativos (negativo) | GAAP | USD M | suma | A y Q, solo reales | ver arriba ✔ | ✔ |
| `AR_COGS` | core | `ar_cogs` | Costos de adquisición en costo de ventas (positivo) | GAAP | USD M | suma | A y Q | FY26 268 + 241 = 509 vs amortización de intangibles 10-K 488 (el resto, otros costos de adquisición) | ✔ |
| `AR_OPEX` | core | `ar_opex` | Costos de adquisición en gastos operativos (negativo) | GAAP | USD M | suma | A y Q | ver arriba | ✔ |
| `DC_REVENUE` | segment | `seg.dc.rev` | Ingreso Data Center | GAAP | USD M | suma | A y Q, reales y proyección | FY26 193,737 = Compute 162,361 + Networking 31,376 ✔; los 5 segmentos suman 215,938 = REV ✔; 2Q FY27 89,023 se cruza con el 10-Q en EV-RES-DATA | ✔ |
| `COMP_REVENUE` | segment | `seg.comp.rev` | Data Center — Compute | GAAP | USD M | suma | solo reales | ver DC | ✔ |
| `NETW_REVENUE` | segment | `seg.netw.rev` | Data Center — Networking | GAAP | USD M | suma | solo reales | ver DC | ✔ |
| `GMNG_REVENUE` | segment | `seg.gmng.rev` | Gaming | GAAP | USD M | suma | solo reales | FY26 16,042 (suma ✔) | ✔ |
| `PV_REVENUE` | segment | `seg.pv.rev` | Professional Visualization | GAAP | USD M | suma | solo reales | FY26 3,191 (suma ✔) | ✔ |
| `AUTO_REVENUE` | segment | `seg.auto.rev` | Automotive | GAAP | USD M | suma | solo reales | FY26 2,349 (suma ✔) | ✔ |
| `OEM_REVENUE` | segment | `seg.oem.rev` | OEM & Other | GAAP | USD M | suma | solo reales | FY26 619 (suma ✔) | ✔ |
| `REVENUE_GUIDANCE_LOW` | guidance | `guid.rev.low` | Guía de ingreso del próximo trimestre, bajo | — | USD M | — | Q | 3Q FY27 105,840 = 108,000 − 2% | ✔ |
| `REVENUE_GUIDANCE_HIGH` | guidance | `guid.rev.high` | Guía, alto | — | USD M | — | Q | 3Q FY27 110,160 = 108,000 + 2% | ✔ |
| `REV_BBG_EST` | consensus | `cons.rev` | Consenso BBG de ingreso dentro del modelo | — | USD M | suma | A | — | ✔ |
| `EBITDA_BBG_EST` | consensus | `cons.ebitda` | Consenso BBG de EBITDA | — | USD M | suma | A | — | ✔ |
| `EARNINGS_BBG_EST` | consensus | `cons.earnings` | Consenso BBG de utilidad | — | USD M | suma | A | — | ✔ |
| `SHARES_BBG_EST` | consensus | `cons.shares` | Consenso BBG de acciones | — | acciones M | fin de periodo | A | — | ✔ |
| `ADJ_OP_INCOME` | ignore | — | Copia de `OP_INCOME` en la hoja de segmentos | — | — | — | — | mismos valores en todos los periodos | ✔ |

**Lo que el modelo no trae:** el esquema nuevo de segmentos (Hyperscale · ACIE · Edge, desde 1Q FY27) — solo Data Center tiene proyección. Gaming, ProViz, Auto y OEM solo tienen reales (proyección en 0, que se lee como "sin dato", nunca como cero).

### Dudas

```
⚠ NVDA · "ajustado" (OP_INCOME, EARNINGS, ADJ_*) — la definición cambió entre submits.
   Lo que se ve: en el submit 2025-12-12, FY25 ajustado = GAAP + SBC + costos de adquisición
   (OP_INCOME FY25 86,783 = 81,454 + 4,738 SBC + 595 AR). En el submit 2026-08-28, el mismo FY25 = 82,045
   (solo + costos de adquisición; el SBC ya se trata como costo).
   Quién responde: SAB (autor del modelo) — ¿fue a propósito (SBC como costo real desde 2026)?
   Mientras tanto: EV-EST y VA-SUB comparan utilidad/EBITDA entre submits con una nota de cambio de base;
   se revisa también el submit 2026-03-04 al congelar.
   Hallazgo (2026-11-02, EV-RES-DATA): desde FY2027 el non-GAAP de NVIDIA ya NO excluye el SBC y la historia se reexpresó (comunicado del 2026-02-25); la definición nueva = GAAP + costos de adquisición = el "ajustado" de Summit desde marzo. Probable respuesta: SAB alineó el modelo a la nueva definición de NVIDIA. Pendiente de confirmar.
   Respuesta (2026-11-02): SAB — sí, a propósito: desde el submit 2026-03-04 el modelo sigue la nueva definición non-GAAP de NVIDIA (SBC como costo). Cerrada; la nota de EV-EST lo dice como hecho.

❓ NVDA · ADJ_GROSS_PROFIT — dentro del mismo submit (2026-08-28) suma SBC en 2Q FY27 pero no en FY26.
   Lo que se ve: FY26 = GAAP + 270 (≈ AR_COGS 268); 2Q FY27 = GAAP + 117 (= AR_COGS 46 + SBC_COGS 71).
   Quién responde: SAB (celda de la hoja de segmentos).
   Mientras tanto: el portal usa la utilidad bruta GAAP (`gp`); `gp_adj` no se muestra.
   Respuesta (AAAA-MM-DD): …

⚠ NVDA · EBITDA — incluye ingreso por intereses (y en reales, otros ingresos no operativos: en FY26 +9,022
   de ganancias en inversiones).
   Lo que se ve: proyección = utilidad operativa ajustada + D&A + intereses ganados. El 18× EV/EBITDA del
   modelo se aplica sobre este EBITDA.
   Quién responde: SAB — ¿es la definición que quieres?
   Mientras tanto: se muestra como "EBITDA (model)" con la definición en la nota; nunca se mezcla con el EBITDA
   de Bloomberg sin decirlo.
   Respuesta (AAAA-MM-DD): …
```

### Cambios del mapa

<!-- Solo se agrega: snapshot nuevo → etiqueta nueva, desaparecida o con salto de escala/signo. -->
- AAAA-MM-DD · snapshot AAAA-MM-DD · <qué cambió> — <qué se hizo>

## 2. Tablero de unidades

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | ✅ | 2026-11-02 | SAB | — | alcance completo; EV-POST/EV-NOTES esperan transcripciones |
| F0-SM | Mapa de métricas Summit | ✅ | 2026-11-02 | SAB | — | 33 etiquetas; 3 dudas abiertas (no las usa ninguna unidad aún) |
| B1 | Inventario de contenido existente (modo B) | ✅ | 2026-11-02 | SAB | — | 40 piezas (35 visibles + 5 sin uso) |
| B2 | Mapa de reubicación (modo B) | ✅ | 2026-11-02 | SAB | — | 40/40 con destino; 4 fusiones; #30 datos aproximados descartados (aprobado) |
| F1 | Esqueleto + vista previa | ✅ | 2026-11-02 | SAB | — | estructura AMZN (6 secciones); paneles viejos en su destino B2; tokens Summit en las dos raíces; `.ov-nvda-dd` en `css/selectors.css` |
| OV-1 | Overview ▸ Key Facts | ✅ | 2026-11-02 | SAB | — | 10 celdas del 10-K FY2026 + market cap en vivo; tiles de múltiplos → Valuation ▸ Target Multiple (B2 #2) |
| OV-2 | Overview ▸ Descripción | ✅ | 2026-11-02 | SAB | — | 3 oraciones, 66 palabras, sin cifras, del 10-K Item 1 |
| OV-3 | Overview ▸ Cuadrante 2×2 | ✅ | 2026-11-02 | SAB | — | 4 celdas ≤ 30 palabras; How it earns del 10-K FY2026 (90/7/3 + C&N 93% del op. income); The edge neutral (SAB) |
| OV-4 | Overview ▸ How it makes money | ✅ | 2026-11-02 | SAB | — | 2 segmentos + geografía (sede del cliente) + revenue lines; cuadre Δ0; barras grises |
| OV-5 | Overview ▸ Products & platforms | ✅ | 2026-11-02 | SAB | — | 7 familias con modal (10-K Item 1); 4 fotos dentro de su familia; sin emojis (ajuste SAB) |
| OV-6 | Overview ▸ Competitors (peer map) | ✅ | 2026-11-02 | SAB | — | NVDA + AMD, AVGO, INTC, QCOM, MRVL (SAB); denominadores 10-K (SEC XBRL); forward BBG solo NVDA; Trailing por defecto |
| OV-7 | Overview ▸ Timeline | ✅ | 2026-11-02 | SAB | — | 11 hitos cronológicos, 9 con Read more; 10-K FY2026 + comunicados |
| OV-F | Overview ▸ Pie de fuentes | ✅ | 2026-11-02 | SAB | — | un solo pie; sin Summit; denominadores de peers con fecha |
| EV-RES-DATA | Dataset de Results (números) | ✅ | 2026-11-02 | SAB | — | act + cons (estMatrix 466 iguales) + Summit 3 snapshots congelados + guía ±2% + evolution |
| EV-RES | Evolution ▸ Results | ✅ | 2026-11-02 | SAB | — | motor results.js con nvda.js; Consensus viejo → sub-tab Estimates hasta EV-EST |
| TL-GEN | Top Line ▸ General | ✅ | 2026-11-02 | SAB | — | plataformas Hyperscale · ACIE · Edge (`segments-data/nvda.js`); historia desde 1Q26 |
| TL-SEG | Top Line ▸ Segments | ✅ | 2026-11-02 | SAB | — | 3 plataformas, 14 productos, precio × volumen "no publicado"; management con bandera (sin transcripciones) |
| TL-OTH | Top Line ▸ Other | ✅ | 2026-11-02 | SAB | — | 4 cortes (C&N/Graphics · esquema viejo · compute/networking · geografía), cuadran al total |
| TL-CUS | Top Line ▸ Customers | ✅ | 2026-11-02 | SAB | — | concentración 10-K + clases + SPLC (20, 4Q FY26) + qué compra cada cliente (3 filing + 7 BBG estimate) |
| EV-EST | Evolution ▸ Estimates | ✅ | 2026-11-02 | 2026-11-02 | SAB | motor resultsEvo, 3 submits, Profitability por defecto = op. income non-GAAP |
| EV-SET | Evolution ▸ Earnings ▸ Setup | ✅ | 2026-11-09 | SAB | — | solo Setup; Q2·Q3·Q4 FY27; 25 líneas; notas solo del 8-K |
| EV-POST | Evolution ▸ Earnings ▸ Post-Results | ⛔ | 2026-11-02 | | | faltan transcripciones oficiales de IR |
| EV-NOTES | Evolution ▸ Earnings ▸ Notes | ⛔ | 2026-11-02 | | | depende de EV-POST (transcripciones) |
| BL-GEN-1 | Bottom Line ▸ General ▸ Profitability & margins | ✅ | 2026-11-09 | SAB | — | 6 métricas en su base de EV-RES-DATA; EBITDA trimestral cae a anual con nota; arreglo de ventana al cambiar de eje |
| BL-GEN-2 | Bottom Line ▸ General ▸ The bridge | ✅ | 2026-11-09 | SAB | — | 4 modos; costo de ventas aparte en una barra; Arm FY23 ámbar |
| BL-GEN-3 | Bottom Line ▸ General ▸ Op. income → net income | ✅ | 2026-11-09 | SAB | — | Reported/Normalized FY24–FY29E; forward desde op. income non-GAAP |
| BL-GEN-4 | Bottom Line ▸ General ▸ Stock-based compensation | ✅ | 2026-11-09 | SAB | — | Dilution (sin línea Summit, SAB) + SBC by line; % sobre la suma de líneas |
| BL-GEN-5 | Bottom Line ▸ General ▸ Expense lines | ✅ | 2026-11-09 | SAB | — | 3 líneas (costo de ventas aparte) · 6 secciones · citas verificadas por script |
| BL-SEG | Bottom Line ▸ Segments | ✅ | 2026-11-09 | SAB | — | C&N · Graphics · no asignado; EBITDA anual; sin Summit por segmento; pestaña vieja retirada |
| BL-SPLC | Bottom Line ▸ Supply Chain | ✅ | 2026-11-09 | SAB | — | 20 proveedores SPLC (sin sumar periodos) + compromisos $279B 10-Q + inventarios + cita 10-K; sin geografía (no hay datos); mapa de semis abajo |
| VA-HIST | Valuation ▸ Historic Multiple | ✅ | 2026-11-09 | SAB | — | `nvda-histmult.js` (copia de `meta-histmult.js`) + `nvda-histmult-data.js` (XBRL 1Q19–2Q27); P/E GAAP; EV/EBITDA fwd desde 2026-03-02; calendario fiscal de enero; precio en vivo |
| VA-PEERS | Valuation ▸ Peers | ✅ | 2026-11-09 | SAB | — | mapa OV-6 con estado compartido (quitar un peer aquí lo quita allá) + tabla abierta; promedio/mediana sin NVIDIA; P/E trailing sobre el último 10-K (no LTM) |
| VA-TM | Valuation ▸ Target Multiple / PEG | ✅ | 2026-11-09 | SAB | — | `nvda-target-multiple.js` (copia de `uber-target-multiple.js`) + datos congelados de 3 submits; FY2028; cambio de base en 2026-03-04; Live con el balance del modelo; calculadora vieja abajo hasta VA-SENS |
| VA-SUB | Valuation ▸ Submit History | ⬜ | | | | |
| VA-SENS | Valuation ▸ Sensitivity Analysis | ⬜ | | | | |
| MG-TEAM | Management ▸ Executives & Board | ✅ | 2026-11-02 | 2026-11-02 | SAB | 6 ejecutivos + consejo de 10 (proxy 2026), motor management.js |
| MG-OWN | Management ▸ Ownership | ✅ | 2026-11-02 | 2026-11-02 | SAB | 14 insiders (proxy + Form 4) + >5% + Fiscal.ai con aviso de diferencias |
| MG-GOV | Management ▸ Governance & SBC | ✅ | 2026-11-02 | 2026-11-02 | SAB | 4 KPIs + tabla de 7 filas (10-K FY26, proxy 2026) |
| MG-TRACK | Management ▸ Track Record | ✅ | 2026-11-02 | 2026-11-02 | SAB | 6 líderes, sin calificaciones, modal `ntrk:` |
| MISC | Miscellaneous (una fila `MISC-<clave>` por sub-tab aprobada) | ⬜ | | | | |
| F-FINAL | Cierre y entrega | ⬜ | | | | |


> Desde el 15 oct 2026 EV-EST, VA-TM y VA-SENS se construyen con Summit congelado del MCP (regla 10);
> EV-EST necesita ≥ 2 snapshots. Cada `MISC-<clave>` aprobada reemplaza la fila MISC; en MISC siempre se
> proponen `MISC-comp` y, si aplica, `MISC-capacity` (playbook §15b).

## 3. Decisiones del analista

<!-- Solo se agrega. Si una decisión cambia, nueva línea que cita la anterior. -->
- 2026-11-02 · B2 · La curva aproximada "How the estimate climbed" (`EVOL`, reconstruida de una gráfica de Fiscal.ai) se reemplaza por los 30 snapshots reales de BBG en Results; los números aproximados se descartan, el texto se conserva — precisión falsa (regla 6) — SAB
- 2026-11-02 · B2 · Technology va entera a una sub-tab propia Miscellaneous ▸ Technology (`MISC-tech`); CUDA y el flywheel a `MISC-comp` — no tiene equivalente en AMZN — SAB
- 2026-11-02 · OV-3 · "The edge" = stack completo diseñado en conjunto (texto neutral); se descarta el "20-year software lock-in" del perfil viejo por sonar a tesis — SAB
- 2026-11-02 · OV-5 · Products & platforms **sin emojis** (ni en la tarjeta ni en el título de la ventana), para NVIDIA y para todas las empresas; la guía se corrige en su propia rama `chore/` — SAB
- 2026-11-02 · OV-6 · Peers = AMD, Broadcom, Intel, Qualcomm, Marvell (los 4 del perfil viejo + Marvell); TSMC y Arm descartados — SAB
- 2026-11-02 · EV-RES-DATA · Cada serie en su base: op. income GAAP (act + Summit `GAAP_OP_INCOME`) y op. income non-GAAP (act + consenso BBG "comparable"); margen bruto non-GAAP (act + consenso + guía); EPS GAAP (act + consenso BBG + Summit EARNINGS/SHARES con la duda 1) — evitar sorpresas falsas por SBC — SAB
- 2026-11-02 · EV-RES-DATA · Segmentos: esquema nuevo (Hyperscale · ACIE · Edge Computing, recast desde 1Q FY25, después de la reclasificación de 2Q FY27) + esquema viejo (Data Center · Gaming · ProViz · Automotive · OEM & Other) como historia hasta 4Q FY26 — SAB
- 2026-11-02 · EV-RES-DATA · Métricas extra: margen bruto, gastos operativos, free cash flow, utilidad neta — SAB
- 2026-11-02 · EV-RES-DATA · Historia trimestral desde 1Q FY20 (abr-2019, todo el archivo BBG); EPS ajustado por los splits 4:1 (jul-2021) y 10:1 (jun-2024) — SAB
- 2026-11-02 · TL-* · Los segmentos de Top Line = plataformas de mercado (Hyperscale · ACIE · Edge Computing); en Other: segmentos reportables C&N/Graphics, el esquema viejo de plataformas y la geografía; la utilidad operativa por segmento queda en Bottom Line — SAB
- 2026-11-02 · MG-* · Management adelantado (SAB). Ejecutivos = los 5 del proxy 2026 (Huang, Kress, Puri, Shoquist, Teter) + Chris Malachowsky; consejo completo. Ownership = insiders del proxy + posiciones Form 4 del export BBG (NVDA_OWN.xlsx, jun-2026) y >5% del proxy, sin Top holders (el cache de fondos del export es viejo, dic-2023). Track Record sin calificaciones (como TSM y GOOGL) — SAB
- 2026-11-02 · TL-CUS · En "What each top customer buys" se muestran los 7 estimados de Bloomberg junto a los clientes sin nombre del filing, marcados estimate, con la nota de que un peso parecido no prueba que sean el mismo cliente — SAB
- 2026-11-02 · B2 · El mapa de cadena de suministro de semis (`semi-industry.js`) va a Bottom Line ▸ Supply Chain debajo de la tabla SPLC, importando el módulo compartido — SAB
- 2026-11-02 · BL-GEN · El costo de ventas va en una sola barra (el 10-K no lo desglosa) con una nota — SAB (anotado en el código el 2026-11-02; registrado aquí el 2026-11-09)
- 2026-11-02 · BL-GEN-5 · Management commentary de las líneas de gasto: transcripciones de The Motley Fool (terceros; NVIDIA publica repeticiones, no texto), marcadas como tales en el pie — SAB (registrado el 2026-11-09). Pendiente: si también valen para EV-POST/EV-NOTES
- 2026-11-09 · EV-SET · Notas del Setup solo del 8-K de NVIDIA (comunicado + CFO commentary con la guía), sin citas de la llamada: Motley Fool NO se usa en Earnings; EV-POST y EV-NOTES siguen ⛔ hasta tener transcripción oficial — SAB
- 2026-11-09 · EV-SET · Calle = snapshot BBG 2026-09-09 (el BBG_CONSENSUS.txt del 2026-11-06 no trae uno más nuevo para NVDA); se recarga si SAB actualiza NVDA antes del print — SAB
- 2026-11-09 · EV-SET · Líneas: ingreso → DC (Hyperscale · ACIE · Compute · Networking) → Edge → utilidad bruta (non-GAAP) → R&D · SG&A · opex → op. income non-GAAP y GAAP → C&N · Graphics → EBITDA → intereses · impuestos → utilidad neta → EPS → CFO · capex · FCF · D&A · acciones; trimestres 3Q FY27 y 4Q FY27 — SAB
- 2026-11-09 · BL-SEG · Medidas: utilidad operativa por segmento (anual y trimestral, con consenso BBG) + EBITDA por segmento SOLO anual FY24–FY26 (utilidad + D&A por segmento del 10-K, sin consenso ni Summit); lo no asignado (SBC, gastos no asignados, costos de adquisición) como su propia serie — SAB
- 2026-11-09 · BL-SEG · Comentarios de management en las pestañas de segmento: filings (10-K/10-Q MD&A, 8-K) + citas de Motley Fool verificadas y marcadas de terceros (como BL-GEN-5; distinto de Earnings, que es solo 8-K) — SAB
- 2026-11-09 · BL-SPLC · Sin gráfica de geografía: el export SPLC de NVDA no trae plantas ni conteo de proveedores; la limitación va arriba; se agrega si SAB exporta la vista geográfica — SAB
- 2026-11-09 · BL-SPLC · Bloque de filings "What NVIDIA has committed to its suppliers": compromisos de supply & capacity por año fiscal (10-Q 2Q FY27 Note 10, $279B), trayectoria $95.2B → $119B → $279B, inventarios, y la frase del 10-K que nombra proveedores por rol (texto de proveedores del DESC viejo, B2 #3) — SAB
- 2026-11-09 · VA-HIST · P/E sobre EPS GAAP, forward y trailing (el único con consenso BBG en los 30 snapshots); el pie avisa que el 1S FY27 trae $23.7B de ganancias por inversiones en acciones (10-Q), por eso el trailing de 2026 se ve bajo — SAB
- 2026-11-09 · VA-HIST · EV/EBITDA forward solo desde el snapshot 2026-03-02 (base nueva, SBC como gasto); trailing = utilidad operativa GAAP + D&A de XBRL desde FY2019; FY+3 deshabilitado (BBG trae 3 años) — SAB

## 4. Excepciones aceptadas

<!-- Cada FAIL de la autoauditoría que el analista decidió dejar. -->
- AAAA-MM-DD · <ID> · <qué regla> — <por qué se acepta> — <quién>

## 5. Mapa de reubicación (solo modo B)

Conteo de control (piezas originales): **40** — 35 visibles + 5 grupos de código sin uso. B1 levantado de `main` @ `cc7ede9` (2026-11-02). Ramas viejas: `feat/nvidia-overview` = mismo contenido que main; `feat/nvidia-overview-enhancements` sin diferencias; `feat/nvidia-overview-v2` solo agrega una taxonomía de pestañas con placeholders (`wipNote`), sin contenido que mover.

| # | Pieza original (archivo:función) | Destino (sección ▸ sub-tab ▸ bloque) | Cómo | Estado |
|---|---|---|---|---|
| 1 | Overview ▸ `overviewBody` banner `SNAPSHOT` (6 celdas: modelo, sede, fundada…) — tecleado | Overview ▸ OV-1 Key Facts | las 6 celdas entran en las 10 de la guía; "Last reported quarter" pasa a 2Q FY27; market cap en vivo con estado | ✅ |
| 2 | Overview ▸ `heroMultiples`/`multFill` + `MULT` — 6 tiles P/E · growth · PEG · EV/EBITDA, toggle Trailing/Forward, mkt cap y EV en vivo — EPS/EBITDA Summit tecleados sin fecha de snapshot | Valuation ▸ VA-TM Target Multiple / PEG (P/E, PEG, EV/EBITDA) + OV-1 (mkt cap / EV en vivo) | EPS/EBITDA re-sacados del MCP, snapshot 2026-08-28 congelado con fecha; Trailing/Forward = años del modelo | ✅ |
| 3 | Overview ▸ `descBox` + `DESC` — descripción expandible | Overview ▸ OV-2 Descripción | se reescribe a 50–80 palabras sin números; las cifras pasan a OV-3/OV-4 | ✅ |
| 4 | Overview ▸ `heroBusiness` + `BIZ` — business snapshot | Overview ▸ OV-3 Cuadrante 2×2 | ya tiene las 4 celdas de la guía; se ajusta a ≤ 30 palabras por celda | ✅ |
| 5 | Overview ▸ caja "What they offer" `productsBody` + `PRODUCTS` (4 imágenes) | Overview ▸ OV-5 Products & platforms | se conserva con sus 4 imágenes; formato de tarjetas de la guía | ✅ |
| 6 | Overview ▸ caja "How it makes money" `moneyBody`/`buildMoneyChart` — `MONEY_SEG`/`MONEY_REG` (toggle segment/region, canvas `nvMoneyChart`), `MONEY_SEG_CARDS`, `MONEY_REG_DETAIL` — región "approx" | Overview ▸ OV-4 How NVIDIA makes money | barras en grises por segmento + vista Geography del 10-K (por facturación, sin "approx"); tarjetas → acordeones con "The numbers" | ✅ |
| 7 | Overview ▸ caja "Margins" `marginsBody`/`buildMarginChart` — márgenes vivos de `get-margins` (Massive) + `MARGIN_FALLBACK` + `MARGIN_PROJ` FY27E + slider (`nvMgChart`) — FY27E Summit sin fecha | Bottom Line ▸ BL-GEN-1 Profitability & margins | reemplazada por la versión AMZN (export BBG + filings); FY27E Summit congelado 2026-08-28; el texto de la nota se conserva | ⬜ |
| 8 | Overview ▸ caja "Competitors" `competitorsBody`/`buildCompChart` + `COMP` — burbujas múltiplo × crecimiento × tamaño, EV/PE, fwd/trailing, chips (`nvCompChart`) — múltiplos de peers: revisar si sembrados (Anexo A3) | Overview ▸ OV-6 Competitors (peer map) + Valuation ▸ VA-PEERS | mapa de AMZN: denominadores de filings/BBG + `liveQuote` (regla 10); peers los decide SAB en OV-6 | ✅ |
| 9 | Overview ▸ pie `SOURCES` | Overview ▸ OV-F Pie | se rehace al formato de la guía (documento + fecha por bloque) | ✅ |
| 10 | Deep Dive ▸ Segments ▸ "Revenue by segment ($B)" `buildSegChart` — framework nuevo/viejo, Q/A, fuente BBG/Summit, proyección sombreada (`SEGX_*`, `SEGA_*`, `nvdaSegChart`) — Summit/BBG tecleados | Top Line ▸ TL-GEN General (motor de segmentos) + series en EV-RES-DATA | Summit/BBG ya no tecleados: Summit congelado 2026-08-28, BBG 2026-09-09; esquema nuevo y viejo como dos grupos del desplegable | ✅ |
| 11 | Deep Dive ▸ Segments ▸ "FY2026 revenue mix (new framework)" `mixBar` | Top Line ▸ TL-GEN (vista mezcla %) | la mezcla la calcula el motor desde el dataset | ✅ |
| 12 | Deep Dive ▸ Segments ▸ tabla "New framework — revenue by market platform (recast)" `SEG_NEW` — Hyperscale / ACIE / Edge | Top Line ▸ TL-GEN (tabla del periodo) + TL-SEG (qué vende cada segmento y a quién) | definiciones Hyperscale / ACIE / Edge pasan a TL-SEG; números al dataset | ✅ |
| 13 | Deep Dive ▸ Segments ▸ tabla "Old framework — as reported through FY2026" `SEG_OLD` + texto "The bridge" | Top Line ▸ TL-GEN (esquema viejo como historia) — texto "The bridge" en la nota colapsable | datos al dataset; el puente se conserva textual | ✅ |
| 14 | Deep Dive ▸ Segments ▸ "GAAP reportable segments (quarterly)" `SEG_GAAP` (Compute & Networking · Graphics) | Bottom Line ▸ BL-SEG (utilidad operativa por segmento GAAP) + TL-GEN (ingreso) | Compute & Networking / Graphics; arregla de paso Anexo A16 (utilidad por segmento en anual) | ✅ |
| 15 | Deep Dive ▸ Segments ▸ "Latest print & guidance (Q1 FY2027)" — desactualizado: ya salió 2Q FY27 | Evolution ▸ EV-SET Setup (guía del próximo trimestre) + serie guidance en EV-RES-DATA | se actualiza a 2Q FY27 reportado / guía 3Q FY27 | ✅ |
| 16 | Deep Dive ▸ Segments ▸ "Milestones by segment" `SEG_MILESTONES` | Top Line ▸ TL-SEG (hitos por segmento) + los principales a OV-7 Timeline |  | ✅ |
| 17 | Deep Dive ▸ Technology ▸ "What NVIDIA sells — the full stack" `sellsMap`/`initSellsMap` + `TECH_STACK` (tap a layer) | Miscellaneous ▸ MISC-tech "Technology" (nueva sub-tab propuesta) | se conserva tal cual (interactivo) | ⬜ |
| 18 | Deep Dive ▸ Technology ▸ "The basic logic: transistors = computing power" `transistorShrink` + `TR_STEPS` — animación | Miscellaneous ▸ MISC-tech | se conserva tal cual | ⬜ |
| 19 | Deep Dive ▸ Technology ▸ "Moore’s Law — and why it matters now" `mooreCard`/`buildMooreChart` + `MOORE` | Miscellaneous ▸ MISC-tech | se conserva; la gráfica cumple §17.2 (zoom, tabla) | ⬜ |
| 20 | Deep Dive ▸ Technology ▸ "CPU vs GPU — serial vs parallel" `cpuGpuDemo`/`cgRun` + `CPU_GPU` — animación | Miscellaneous ▸ MISC-tech | se conserva tal cual | ⬜ |
| 21 | Deep Dive ▸ Technology ▸ "Generation over generation" `gpuGenBars` + `GPU_GENS` | Miscellaneous ▸ MISC-tech | se conserva; tabla debajo | ⬜ |
| 22 | Deep Dive ▸ Technology ▸ "CUDA — the software moat" (texto) | Miscellaneous ▸ MISC-comp Competitive position (tesis del moat) | fusión con #39 (flywheel de CUDA, mismo argumento) | ⬜ |
| 23 | Deep Dive ▸ Technology ▸ "Putting it together: the AI data center" (texto) | Miscellaneous ▸ MISC-tech | se conserva tal cual | ⬜ |
| 24 | Deep Dive ▸ Technology ▸ "Architecture & product timeline" `TECH_TIMELINE` | Miscellaneous ▸ MISC-tech (roadmap completo) + lanzamientos clave a OV-7 Timeline |  | ⬜ |
| 25 | Deep Dive ▸ Management ▸ "Leadership & organization" `orgTree` + `LEADERS` (6 fotos, detalle al clic) | Management ▸ MG-TEAM Executives & Board (motor `management.js`) | mismas 6 fotos; el organigrama se conserva si el motor lo permite, si no la vista del motor + nota | ✅ |
| 26 | Deep Dive ▸ Management ▸ "Insider & board ownership" `ownTable` + `OWNERSHIP` (valor a precio vivo) | Management ▸ MG-OWN Ownership | tabla de insiders `.twrap/.rt` + "Top holders" (formato aprobado en META) | ✅ |
| 27 | Deep Dive ▸ Consensus ▸ "Beat track record" (texto, 13 beats seguidos) | Evolution ▸ EV-RES (marcador de sorpresas del motor) | el texto pasa a la nota del panel | ✅ |
| 28 | Deep Dive ▸ Consensus ▸ "Guidance vs. reported revenue ($B)" `GUIDE` + `NEXT_GUIDE` (`nvdaConsChart`) — llega a 1Q FY27 | Evolution ▸ EV-RES-DATA serie guidance (1Q FY24 → 2Q FY27) | datos al dataset; el motor la dibuja contra lo reportado | ✅ |
| 29 | Deep Dive ▸ Consensus ▸ "What consensus expects forward" tabla `CONS` (BBG) — BBG sin fecha de snapshot | Evolution ▸ EV-RES-DATA `estMatrix.cons` (BBG 2026-09-09) | con fecha; la tabla la arma el motor | ✅ |
| 30 | Deep Dive ▸ Consensus ▸ "How the estimate for each fiscal year climbed" `EVOL` (`nvdaEvolChart`) — ⚠ "approximate path reconstructed from the Fiscal.ai chart" — precisión falsa | Evolution ▸ EV-RES eje "estimates as of" (30 snapshots reales de BBG) | **descarte aprobado por SAB 2026-11-02**: la curva aproximada de Fiscal.ai NO se conserva (precisión falsa); el texto de la historia sí, a la nota | ✅ |
| 31 | Deep Dive ▸ Consensus ▸ "Summit’s estimate, snapshot by snapshot" `SUMMIT_REV` + `SUMMIT_BBG27` (`nvdaSnapChart`) — ⚠ dice "May '26"; el MCP tiene 2026-08-28, no mayo | Evolution ▸ EV-EST Estimates (eje = snapshots Summit) | re-sacado del MCP: 2025-12-12 · 2026-03-04 · 2026-08-28 (se corrige "May '26") | ✅ |
| 32 | Deep Dive ▸ Valuation ▸ "1 · Build a case" — sliders crecimiento y margen bruto por FY, `VAL_BASE` — bases = consenso tecleado | Valuation ▸ VA-SENS Sensitivity Analysis | los dos sliders (crecimiento, margen bruto) pasan a los dos supuestos de la matriz; bases = Summit congelado | ⬜ |
| 33 | Deep Dive ▸ Valuation ▸ "2 · Apply a multiple → implied price" — P/E · EV/EBITDA · EV/Sales, `MULT_CFG`, precio vivo — ⚠ `VAL_SHARES_B` y `VAL_NETCASH_B` sembrados (regla 10) | Valuation ▸ VA-TM Target Multiple / PEG | múltiplo → precio implícito; acciones y caja neta en vivo (adiós `VAL_SHARES_B`/`VAL_NETCASH_B`) | ✅ |
| 34 | Deep Dive ▸ Valuation ▸ "Summit DCF — forward view" `DCF_TARGETS` — Summit sin fecha | Valuation ▸ VA-TM (precio objetivo del modelo) + EV-EST | cifras re-sacadas del MCP 2026-08-28 | ✅ |
| 35 | Deep Dive ▸ Industry Analysis ▸ mapa de cadena de suministro `semiIndustry.html({highlight:'NVDA',focus:true})` (módulo compartido `semi-industry.js`) — compartido con Industry Analysis del portal | Bottom Line ▸ BL-SPLC Supply Chain (debajo de la tabla SPLC) | mismo módulo compartido `semi-industry.js`, sin copiarlo | ✅ |
| 36 | (no se muestra) `ovTopics` + `drillCard`/`topicPanel` — tarjetas de temas: `POSITION`, `MIX_THEN`/`MIX_NOW` (`mixShiftBlock`, `heroBar`), `AS_OF`, `FINANCIALS` + `FIN_NOTE`, `PEERS`, `TAILWINDS`, `HEADWINDS` — código sin uso | Repartida: `POSITION` → OV-2 · `MIX_THEN/NOW` → TL-GEN (nota) · `AS_OF`/`FINANCIALS`/`FIN_NOTE` → EV-RES-DATA + nota de Results · `PEERS` → fusión con #8 · `TAILWINDS`/`HEADWINDS` → MISC-comp (tarjetas de cuestionamientos) | se revisan cifra por cifra contra el 10-K | ⬜ |
| 37 | (no se muestra) `heroScorecard` + `SCORE_TILES` — código sin uso | Overview ▸ OV-1 Key Facts | fusión con #1/#2 (market cap, revenue TTM, márgenes, P/E) | ⬜ |
| 38 | (no se muestra) `heroProducts` (otra vista de `PRODUCTS`) — código sin uso | Overview ▸ OV-5 | fusión con #5 (otra vista de los mismos `PRODUCTS`) | ✅ |
| 39 | (no se muestra) `heroDiff` + `DIFF` (diferenciadores) — código sin uso | Miscellaneous ▸ MISC-comp Competitive position | flywheel de CUDA + tesis; fusión con #22 | ⬜ |
| 40 | (no se muestra) constantes `KPIS`, `FY_NOTE`, `HOW_MONEY` — código sin uso | `KPIS` → OV-1 / OV-3 "The numbers" · `FY_NOTE` → nota de Results · `HOW_MONEY` → OV-4 acordeones |  | ⬜ |

## 6. Bloqueos y preguntas abiertas

| Desde | Unidad | Qué falta | Quién lo consigue | Estado |
|---|---|---|---|---|
| 2026-11-02 | EV-RES-DATA (DCF) | **Arreglo pendiente en el DCF:** en el submit 2025-12-12 la utilidad operativa GAAP de 1Q–3Q FY26 del modelo queda $426M por encima de lo reportado (86,088), así FY26 no cuadra con la suma. Se corrige en el DCF, no en el MCP | SAB | abierto |
| 2026-11-02 | EV-RES-DATA (Summit) | ~~El MCP de Summit pide re-autenticar (`/mcp`): faltan los snapshots 2025-12-12 y 2026-03-04, el 4Q27/FY29 del modelo y la mitad Summit de estMatrix | SAB (correr `/mcp`) | cerrado 2026-11-02 (SAB re-autenticó; Summit completado) |
| 2026-11-02 | EV-RES-DATA | ¿Existe un recast de NVIDIA IR de Hyperscale/ACIE trimestral FY25 después de la reclasificación de 2Q FY27? Hoy esos trimestres van null antes de 1Q26 (3Q26/4Q26 del recast de BBG) | SAB | abierto |
| 2026-11-02 | EV-EST, VA-SUB, VA-TM | Dudas 1 y 3 del Mapa Summit (cambio de definición de "ajustado" entre submits; intereses dentro del EBITDA) | SAB (autor del modelo) | duda 1 cerrada 2026-11-02; duda 3 abierta (EBITDA rotulado "Summit definition", sin consenso) |
| 2026-11-02 | EV-POST, EV-NOTES | Transcripciones oficiales (PDF de IR) de 3Q FY26, 4Q FY26, 1Q FY27, 2Q FY27; y 3Q FY27 (~2026-11-19) | SAB | abierto |
| 2026-11-02 | VA-SUB | Submit 2025-12-12: P/E sobre 2027 y EV/EBITDA sobre 2028 — revisar la prueba PT÷FV en la hoja Output | Claude (con el workbook) | abierto |
| 2026-11-09 | (rama) | Merge de origin/main fdda9d8 en la rama (0648b4b, local, sin push): conflictos solo en listas de selectores (overview.css, selectors.css, segments.js), resueltos con UBER/LYFT + NVDA | Claude | cerrado |
| 2026-11-09 | F-FINAL | El 10-K FY2026 numera la nota de segmentos como **Note 16**; OV-3 y OV-4 (aprobados) citan "Note 17" — revisar y corregir en el cierre (vuelve a mostrarse) | Claude | abierto |

## 6b. Conexiones pendientes ("Live data pending")

> `docs/PROFILE_PLAYBOOK.md` §20b. Bloques aprobados que hoy muestran el aviso porque falta el camino
> en vivo. No hay números copiados que migrar: al destrabarse, se conecta, se vuelve a mostrar y se cierra.

| Desde | Unidad ▸ bloque | Qué falta (función / dato) | Quién lo destraba | Estado |
|---|---|---|---|---|

## 6c. Review del analista — pendientes

> `docs/PROFILE_PLAYBOOK.md` §16 paso 7. Pedidos del analista después de entregado el perfil. Cada R pasa
> por la compuerta normal y se registra en §7 al aprobarse. Si el pedido vale para toda empresa, se
> propone también como cambio a la guía.

| # | Pedido (textual) | Unidad | Qué hay que construir | Depende de | ¿Va a la guía? | Estado |
|---|---|---|---|---|---|---|
| R1 | "vamos a quitarle los emojis a esta parte, no solo a Nvidia si no a todos y arreglar eso en la guia" (2026-11-02) | OV-5 (todas las empresas) | NVIDIA: hecho en esta rama. Demás perfiles con tarjetas de producto + `PROFILE_PLAYBOOK.md` §8 OV-5: rama `chore/` propia | — | sí | NVIDIA ✅ · las otras 16 empresas + guía + OVERVIEW_CONVENTIONS hechos en la rama `chore/products-no-emoji` (worktree rs-noemoji), sin commit, esperando a SAB |

## 7. Historial de aprobaciones

<!-- Solo se agrega, la más reciente al final. Una entrada por cada paso por la compuerta. -->
### AAAA-MM-DD · <ID> <Nombre> — <APROBADA | CAMBIOS | OMITIDA>
- Qué se mostró:
- Fuentes:
- Autoauditoría:
- Cambios pedidos / decisiones:

### 2026-11-02 · F0 Inventario de datos — APROBADA
- Qué se mostró: tabla de §1 (filings, año fiscal no calendario, Summit 3 snapshots + valuación, BBG 30 snapshots al 2026-09-09, get-market-history responde, SPLC, Fiscal.ai, fotos, sin transcripciones) y el alcance.
- Fuentes: EDGAR; MCP Summit `list_snapshots` / `get_valuation_history` (2026-11-02); `scripts/consensus/inspect_matrix.py NVDA` sobre `G:\My Drive\Summit\Docs\0\BBG_CONSENSUS.txt` (archivo del 2026-10-30).
- Autoauditoría: las 12 preguntas de §6.1 respondidas; prueba PT÷FV de §6.3 en los 3 submits (2 cuadran, 1 con años distintos por método → bloqueo VA-SUB).
- Cambios pedidos / decisiones: SAB pidió confirmar antes que la guía es la última (main @ cc7ede9, guía del 2026-10-30; ninguna rama trae una versión más nueva). Aprobado sin cambios.

### 2026-11-02 · B1 Inventario de contenido existente — APROBADA
- Qué se mostró: las 40 piezas de la sección 5 (Overview 9 · Segments 7 · Technology 8 · Management 2 · Consensus 5 · Valuation 3 · Industry Analysis 1 · código sin uso 5) y los problemas a corregir al reubicar (EVOL aproximado de Fiscal.ai, "May '26" que no existe en el MCP, acciones/caja neta sembradas, guía en 1Q FY27).
- Fuentes: `js/overviews/nvidia.js` en main @ cc7ede9; ramas feat/nvidia-overview, -enhancements, -v2.
- Autoauditoría: toda función render y constante de datos listada; código sin uso identificado por referencias.
- Cambios pedidos / decisiones: ninguno. Conteo de control = 40.

### 2026-11-02 · B2 Mapa de reubicación — APROBADA
- Qué se mostró: destino de las 40 piezas (sección 5) en la estructura AMZN; 4 fusiones (#22+#39 CUDA, #38→#5 productos, #37→#1/#2 Key Facts, PEERS de #36→#8).
- Fuentes: B1.
- Autoauditoría: 40/40 con destino; ninguna fila "se elimina"; sub-tab nueva solo en Miscellaneous (MISC-tech, MISC-comp), cada una pasará su propia compuerta.
- Cambios pedidos / decisiones: las tres de la sección 3 (EVOL descartado, Technology → MISC-tech, mapa semis → BL-SPLC).

### 2026-11-02 · F0-SM Mapa de métricas Summit — APROBADA
- Qué se mostró: tabla de §1b (33 etiquetas: 19 core · 7 segment · 2 guidance · 4 consensus · 1 ignore), cuadres vs SEC XBRL, valuación (3 submits sin quality_flags) y `js/summit-map/nvda.js`.
- Fuentes: MCP Summit `list_metrics` y `get_fundamentals` (snapshots 2026-08-28 y 2025-12-12, consultados 2026-11-02); SEC companyfacts CIK 0001045810 (10-K FY2026, 10-Q 2Q FY27).
- Autoauditoría: toda etiqueta de `list_metrics` en el mapa (también la ignore) ✔ · cada core y segment con cuadre o razón ✔ (DC 2Q FY27 se cruza en EV-RES-DATA) · unidades revisadas, no copiadas del MCP ✔ · valuación revisada ✔ · ningún número en el archivo ✔.
- Cambios pedidos / decisiones: aprobado con las 3 dudas abiertas (ninguna unidad las usa todavía).

### 2026-11-02 · F1 Esqueleto + vista previa — APROBADA
- Qué se mostró: Deep Dive con las 6 secciones AMZN (`dd-tab`/`ovt-subtab`, maquinaria copiada de `googl.js`); 6 sub-tabs con los paneles viejos en su destino B2, cada uno dentro de su `.ovt-pane[data-ovt]` viejo para que sus builders sigan funcionando (Top Line ▸ General = Segments · BL ▸ Supply Chain = mapa semis · Evolution ▸ Results = Consensus · Valuation ▸ Target Multiple = Valuation · Management ▸ Executives & Board · Misc ▸ Technology). Overview sin cambios salvo tokens Summit (`--brand:var(--steel)`).
- Fuentes: —
- Autoauditoría: recorrido en el portal real (sesión de SAB, rAF shim): 6 secciones abren, 5 canvases + mapa construidos, 0 errores de consola, precio en vivo ✔, Pillars visible, sin `<style>` nuevo.
- Cambios pedidos / decisiones: ninguno.

### 2026-11-02 · OV-1 Key Facts — APROBADA
- Qué se mostró: 10 celdas (Listing, HQ, Incorporated, SEC filer, Founded, IPO, CEO, Employees ~42,000 · Jan 2026, Dividend, Market cap live $5.00T · Nov 2, 2026); acento `--steel`. Reemplaza el banner `SNAPSHOT` (B2 #1, ✅). Los tiles de múltiplos (B2 #2) pasan a Valuation ▸ Target Multiple, cableados con `initMultiples(pane)` hasta VA-TM.
- Fuentes: 10-K FY2026 (acc. 0001045810-26-000021: portada, Item 1, Item 5); DEF 14A 2026; NVIDIA IR (IPO); Massive `liveQuote`.
- Autoauditoría: 10 celdas ✔ · CEO con antigüedad ✔ · market cap con estado (live / unavailable, sin semilla) ✔ · filer verificado en EDGAR ✔ · sin celdas vacías ✔ · sin hex/SUMMIT_CAT ✔ · 0 errores de consola ✔. `.ov-nvda` agregado a la regla de texto negro de `css/overview.css`.
- Cambios pedidos / decisiones: ninguno.

### 2026-11-02 · OV-2 Descripción — APROBADA
- Qué se mostró: `.ov-lede` `NV_LEDE` (3 oraciones, 66 palabras, sin cifras) en lugar del `descBox` expandible (B2 #3, ✅). El texto viejo `DESC` queda en el código: moat → OV-3, proveedores → BL-SPLC, Mellanox → OV-7.
- Fuentes: 10-K FY2026, Item 1 "Our Company".
- Autoauditoría: 2–4 oraciones ✔ · 50–80 palabras ✔ · sin cifras ✔ · sin segmentos/clientes/moat ✔ · tono neutral ✔ · texto en negro ✔ · 0 errores ✔.
- Cambios pedidos / decisiones: ninguno.

### 2026-11-02 · OV-3 Cuadrante 2×2 — APROBADA
- Qué se mostró: `.q2` `STD_BIZ` (25/25/27/27 palabras) en lugar de las tarjetas `BIZ` (B2 #4, ✅). How it earns: FY2026 ~90% DC · ~7% Gaming · ~3% ProViz/Auto/OEM; C&N 93% del op. income de segmentos ($130.1B de $139.3B).
- Fuentes: 10-K FY2026 (revenue by market platform; Note 17 segmentos; nota de concentración).
- Autoauditoría: una tabla 2×2 ✔ · ≤ 30 palabras ✔ · números solo en How it earns, con año ✔ · títulos `--navy` (`.ov-nvda` agregado a la regla `.q2-k`) ✔ · 0 errores ✔. El 22%/14% de clientes directos se deja para TL-CUS.
- Cambios pedidos / decisiones: The edge neutral (sección 3).

### 2026-11-02 · OV-4 How NVIDIA makes money — APROBADA
- Qué se mostró: colapsable "How NVIDIA makes money" (`collapsible` + `stdMoneyMap` copiados de googl.js): Segments (C&N $193.5B 90% · Graphics $22.5B 10%) ⇄ Geography por sede del cliente (US 69% · Taiwan 20% · China 9% · Other 2%, con la nota del 76% de DC de clientes con sede en Taiwán → EE.UU./Europa); acordeones por segmento con "The numbers"; "The revenue lines" por mercado final; cierre con op. income / net income y la conciliación de $8.9B. Reemplaza la caja vieja `moneyBody` (B2 #6, ✅); `HOW_MONEY` (#40) queda cubierto.
- Fuentes: 10-K FY2026, Note 17 (segmentos, geografía, revenue by end market, conciliación) + estado de resultados.
- Autoauditoría: cuadre segmentos = geografía = mercados = 215,938 ✔ · barras `.gmm-neutral` ✔ · `desc` sin cifras ✔ · toggle y acordeones clicados ✔ · 0 errores ✔.
- Cambios pedidos / decisiones: ninguno.

### 2026-11-02 · OV-5 Products & platforms — APROBADA CON AJUSTES MENORES
- Qué se mostró: colapsable "Products & platforms" (`stdProducts` + `wireModal` copiados de googl.js) con 7 familias (`NV_PRODUCTS`) y ventana por familia; las 4 fotos de las tarjetas viejas dentro de su familia. Reemplaza `productsBody` (B2 #5, ✅) y cubre `heroProducts` (#38, fusión, ✅). Modal `#nvdaModalBack` subido a `#co-detailview` (uno solo, se reemplaza en cada render).
- Fuentes: 10-K FY2026 Item 1 (Data Center, Gaming, ProViz, Automotive; Rubin 2H FY27; NVLink Fusion; AI Enterprise; DRIVE Hyperion); páginas de producto de NVIDIA.
- Autoauditoría: dos niveles ✔ · línea ≤ 6 palabras ✔ · modal abre/cierra, uno solo ✔ · fotos cargan ✔ · texto descriptivo ✔ · 0 errores ✔.
- Cambios pedidos / decisiones: SAB: "quitarle los emojis a esta parte, no solo a Nvidia si no a todos y arreglar eso en la guía". Aplicado en NVIDIA y vuelto a mostrar (0 íconos, título de la ventana sin emoji). Las demás empresas + guía: rama aparte (`chore/`), anotado en §6c.

### 2026-11-02 · OV-6 Competitors — the peer map — APROBADA
- Qué se mostró: colapsable "Competitors — the peer map" (código de googl.js renombrado `N_SC`/`N_PEERS`/`nSc*`, clase `.nvda-sc`); 6 nombres; múltiplos en vivo (P/E = precio ÷ EPS; EV/EBITDA = EV ÷ EBITDA). Hoy trailing: NVDA 42×/37× · QCOM 34×/13× · MRVL 60×/63× · AVGO 69×/47× · AMD 190×/113× · INTC sin P/E/40×. Forward solo NVDA (BBG FY27). Reemplaza el gráfico `COMP` con múltiplos sembrados (B2 #8, ✅).
- Fuentes: SEC XBRL companyfacts de cada peer (10-K: AMD FY25, AVGO FY25, INTC FY25, QCOM FY25, MRVL FY26, NVDA FY26), bajados 2026-11-02; NVDA forward `BBG_CONSENSUS.txt` snapshot 2026-09-09 (EPS 9.94, EBITDA comparable 272,392, revenue +89.7%); Massive `liveQuote`.
- Autoauditoría: pastillas de múltiplo y base cambian ejes ✔ · × elimina y Add restaura ✔ · topes derivados del dato ✔ · ningún múltiplo en archivo ✔ · círculos blancos, NVDA con borde navy ✔ · 0 errores ✔. Nota: AMD a 190× P/E por su EPS GAAP (amortización de Xilinx); el EBITDA forward de BBG es "comparable" (suma SBC), anotado en el código.
- Cambios pedidos / decisiones: peers (sección 3).

### 2026-11-02 · OV-7 Timeline — APROBADA
- Qué se mostró: colapsable "Timeline — how it became today's NVIDIA" (`stdTimeline` de googl.js; modal `hist:`), 11 hitos: 1993–98 génesis · 1999 IPO + GeForce 256 · 2006 CUDA · 2012 AlexNet + primer dividendo · 2020 Mellanox · 2020–22 Arm (cancelada) · 2022–25 controles de exportación (H20 $4.5B) · FY2024 Data Center · 2023–24 Grace/Blackwell · Oct 2025 $5T · Dec 2025 Groq. Lanzamientos clave de `TECH_TIMELINE` (#24) y la frase de Mellanox de `DESC` (#3) incluidos; el roadmap completo sigue en Misc ▸ Technology.
- Fuentes: 10-K FY2026 (Item 1, Item 1A, Note 2); 10-K FY2024; comunicados de NVIDIA (IPO, dividendo, Mellanox, Arm).
- Autoauditoría: cronológico estricto ✔ · modales con viñetas secuenciales ✔ · génesis primero ✔ · solo el último hito de market cap ✔ · un solo asunto regulatorio ✔ · 0 errores ✔ (una comilla rompió el módulo al conectarlo; corregida antes de mostrar).
- Cambios pedidos / decisiones: ninguno.

### 2026-11-02 · OV-F Pie del Overview — APROBADA
- Qué se mostró: `OV_SOURCES` (un solo `.ov-foot`, documento + fecha por tipo de dato; sin Summit, sin múltiplos sembrados, sin firma). Reemplaza `SOURCES` (B2 #9, ✅). Overview final = Key Facts · lede · 2×2 · Makes money · Products · Peer map · Timeline · pie. La caja vieja de Margins (B2 #7) pasa a Bottom Line ▸ General (`oldPane('margins')`, `initMargins(pane)`) hasta BL-GEN-1.
- Fuentes: las de OV-1…OV-7.
- Autoauditoría: un pie ✔ · fechas ✔ · sin Summit ✔ · 7 bloques ✔ · Margins funciona en BL (gráfica, chips, slider) ✔ · 0 errores ✔ (un apóstrofe rompió el módulo al conectarlo; corregido y ahora se verifica la carga antes de recargar).
- Cambios pedidos / decisiones: ninguno.

### 2026-11-02 · EV-RES-DATA Dataset de Results — APROBADA
- Qué se mostró: `js/results-data/nvda.js` (23 métricas trimestrales 1Q20→2Q28, 25 anuales FY2020→FY2029), registrado en `js/results.js`; `scripts/consensus/map_nvda.json` + estMatrix (cons) y `map_summit_nvda.json` + Summit matrix + `evolution`. Tabla de cuadre de 3 periodos (3Q22, 1Q25, 2Q27: todo Δ0) y tabla trimestres ↔ año (Summit: 0 salvo −426 GAAP op. inc 12-12 y +29/+28 non-GAAP 08-28; consenso FY27 con brechas de canasta BBG explicadas).
- Hallazgos: desde FY2027 el non-GAAP de NVIDIA ya no excluye SBC (historia reexpresada; comunicado 2026-02-25) → todo el non-GAAP en la base nueva (old − SBC), reproduce exacto los reexpresados de 1Q26 y 4Q26; consenso non-GAAP solo desde el archivo 2026-03-02; Hyperscale/ACIE desde 1Q26 (no hay recast FY25 post-reclasificación); el submit 12-12 queda fuera en las líneas non-GAAP (base vieja).
- Fuentes: SEC EDGAR (10-K, 10-Q, 8-K Ex. 99.1/99.2 — comunicados y CFO commentary); `BBG_CONSENSUS.txt` + `Consensus_Portal.xlsm` (30 snapshots al 2026-09-09); MCP Summit snapshots 2025-12-12 / 2026-03-04 / 2026-08-28 (congelados).
- Autoauditoría: verify_preprint cons 466 same / 0 changed / 0 blanked ✔ · emit_summit_matrix: toda serie Summit = su pick pre-print ✔ · módulo carga en el portal ✔ · comillas rectas como delimitadores ✔.
- Cambios pedidos / decisiones: ninguno. Los dumps crudos de Summit (`scripts/consensus/dumps/nvda_summit/`, 4.2 MB) no se suben al repo.

### 2026-11-02 · EV-RES Evolution ▸ Results — APROBADA
- Qué se mostró: Evolution ▸ Results = `resultsHtml('NVDA')` / `initResults(wrap,'NVDA')`; selector "Estimates as of" (4 modos), Top Line y Margins & Profitability con desplegables agrupados, Actuals vs Estimates, Road to the print. Reemplaza #27–#30 de la pestaña Consensus (✅); el pane viejo queda como sub-tab Estimates por #31 hasta EV-EST.
- Fuentes: las de EV-RES-DATA.
- Autoauditoría: 4 canvases ✔ · Quarterly/Annual, $B/Growth clicados ✔ · Period detail con Real/Summit/Consenso y sorpresas ✔ · bandera "No company guidance" ✔ · 0 errores ✔ · zoom/chips/slider = motor compartido.
- Cambios pedidos / decisiones: ninguno (abre con toda la historia desde 1Q20).

### 2026-11-02 · TL-GEN Top Line ▸ General — APROBADA
- Qué se mostró: motor `segments.js` con `js/segments-data/nvda.js` (registrado en `js/segments.js`); cita FILING del 10-K Item 1; tarjetas Hyperscale $48.7B · ACIE $40.3B · Edge $7.2B (2Q FY27); barras apiladas 1Q26→ (anual FY25–FY26). Reemplaza la gráfica de segmentos (#10) y la mezcla FY26 (#11) del pane viejo; el pane viejo pasa a Bottom Line ▸ Segments por #14/#15.
- Fuentes: Results dataset (hyper/acie/edge); 10-K FY2026 Item 1.
- Autoauditoría: zoom/reset ✔ · controles ✔ · chips ocultan en gráfica y tabla ✔ · tabla con encabezado ✔ · 0 errores ✔ · ✘ ~380 px sin probar. Motor: "3 reportable" y "net sales" fijos (para PR aparte del motor).
- Cambios pedidos / decisiones: ninguno.

### 2026-11-02 · TL-SEG Top Line ▸ Segments — APROBADA
- Qué se mostró: por plataforma — definición FILING verbatim (comunicado 1Q FY27, 8-K Ex. 99.1), lectura OURS, top line; 14 productos con definición del 10-K y "who buys it" del 10-K (concentración 16% en 2Q27); KPIs = ingreso y participación (kpiNote: NVIDIA no publica más); interacciones: unidades × precio NOT CHARTED (sin unidades/precio/costo publicados), DC × participación (DECOMPOSITION, 6 trimestres), Edge = total − DC sin gráfica; management con bandera. Absorbe #12 (definiciones) y #16 (milestones guardados en datos como `milestones`, no se pintan; los principales en OV-7).
- Fuentes: 8-K 1Q FY27 y 2Q FY27; 10-K FY2026; 10-Q 2Q FY27; Results dataset.
- Autoauditoría: controles clicados ✔ · gráfica de interacción ✔ · verbatim con ubicación ✔ · 0 errores ✔ · ✘ ~380 px sin probar. Motor: chip OURS rotulado "SUMMIT" (PR del motor).
- Cambios pedidos / decisiones: ninguno.

### 2026-11-02 · TL-OTH Top Line ▸ Other — APROBADA
- Qué se mostró: 4 cortes — segmentos reportables (1Q20–2Q27), plataformas hasta FY2026 (1Q20–4Q26), DC compute vs networking (1Q24–4Q26, corte propio para no recortar el esquema viejo), geografía por sede del cliente (FY24–FY26, `views:['y']`, advertencia 76%); definiciones FILING del 10-K. "The bridge" (#13, ✅) en la nota del esquema viejo, con cifras exactas del 10-K (sin "OEM aproximado").
- Fuentes: CFO commentaries (8-K Ex. 99.2), 10-K FY2026, historial reportado de BBG (compute/networking 1Q24–4Q24).
- Autoauditoría: cada corte cuadra al total ✔ · 4 gráficas ✔ · chips ✔ · 0 errores ✔ · ✘ ~380 px sin probar.
- Cambios pedidos / decisiones: ninguno (SAB aceptó el corte propio de compute/networking y el bridge corregido).

### 2026-11-02 · TL-CUS Top Line ▸ Customers — APROBADA
- Qué se mostró: concentración FILING (FY26 22%/14%; FY25 12/11/11%; cuentas por cobrar 25/18/13%); 4 clases de clientes verbatim; 0 nombrados; tabla SPLC (20 clientes, $49.6B = 72.9% de 4Q FY26, aviso de doble conteo); "What each top customer buys" 11 filas (3 filing sin nombre + AI research company + 7 estimados BBG). Ajuste aplicado: la nota dice que un peso de BBG que coincide con uno del filing no prueba que sea el mismo cliente.
- Fuentes: 10-K FY2026, 10-Q 2Q FY27, `nvidia-map-reference/SPLC_BBG.xlsx` (2026-03-06).
- Autoauditoría: verbatim con ubicación ✔ · estimados marcados estimate ✔ · tarjetas ✔ · 0 errores ✔.
- Cambios pedidos / decisiones: mostrar los estimados BBG (sección 3).


### 2026-11-02 · MG-TEAM Management ▸ Executives & Board — APROBADA
- Qué se mostró: motor `management.js` — 6 ejecutivos con foto y bio (Huang lead; Kress, Puri, Shoquist, Teter, Malachowsky), consejo de 10 con Neal como Lead Director (sin chair) y 9 independientes con comités, 3 tarjetas de gobierno. Reemplaza `orgTree`/`LEADERS` (#25), mismas 6 fotos.
- Fuentes: 10-K FY2026 (Item 1, executive officers al 20-feb-2026); proxy 2026 (DEF 14A, 12-may-2026).
- Autoauditoría: fotos cargan ✔ · modal de bio abre/cierra ✔ · pie de fuente ✔ · paleta Summit ✔ · inglés ✔ · (menor) fuente de Malachowsky = "NVIDIA", vaga.
- Cambios pedidos / decisiones: ninguno.

### 2026-11-02 · MG-OWN Management ▸ Ownership — APROBADA (con ajustes menores)
- Qué se mostró: tabla `.twrap/.rt` de 14 insiders con dos columnas fechadas (proxy 23-mar-2026 · último Form 4 jun-2026), cambio del último Form 4, % sobre 24.1B (10-Q 2Q FY27) y valor a precio vivo; filtro All/Board/Executive officers; fila total del grupo (proxy, 3.94%); >5% BlackRock 7.43% y Vanguard 7.31% (proxy); Fiscal.ai en vivo en `#dd-mgmt-slot`. Reemplaza `ownTable`/`OWNERSHIP` (#26).
- Fuentes: proxy 2026 (DEF 14A), Form 4 vía export BBG (HDS insider), 10-Q 2Q FY27 (portada).
- Autoauditoría: precio vivo ✔ · filtro 14/10/6 ✔ · Fiscal.ai carga ✔ · arreglado en la revisión: notas largas y encabezados desbordaban la tabla (notas acortadas, detalle a la nota; encabezados en 2 líneas) y el nombre en >5% iba a la derecha (regla `.ov-nvda-dd .own-h5`).
- Cambios pedidos / decisiones: SAB pidió el aviso bajo Fiscal.ai: sus cifras difieren de los Form 4 (Huang 909.6M vs 812.0M; Coxe 53.3M vs 30.6M) y la tabla de arriba es la fuente primaria. Pendiente fuera de este PR: GOOGL y META tienen el mismo defecto de alineación en su tabla >5%.

### 2026-11-02 · MG-GOV Management ▸ Governance & SBC — APROBADA
- Qué se mostró: lede; 4 KPIs (9 de 10 independientes · SBC $6.4B = 3.0% del ingreso · recompras $40.1B · dividendos $974M, FY2026); tabla "How NVIDIA is governed" de 7 temas; puntero a la gráfica de SBC en Bottom Line ▸ General (BL-GEN, por construir).
- Fuentes: 10-K FY2026 (flujos de efectivo, acciones diluidas, Item 5); proxy 2026 (DEF 14A).
- Autoauditoría: cifras recalculadas ✔ (6,386/215,938 = 3.0%; recompras 6.3× SBC; diluidas −1.7%) · sin repetir Ownership ✔ · pie ✔ · arreglado en la revisión: la tabla salía alineada a la derecha (faltaba `.ov-nvda-dd` en las reglas `.gov-tbl` de GOOGL/AMZN).
- Cambios pedidos / decisiones: ninguno.

### 2026-11-02 · MG-TRACK Management ▸ Track Record — APROBADA
- Qué se mostró: 6 tarjetas (Huang, Kress, Puri, Shoquist, Teter, Malachowsky) con "At NVIDIA" (cifras reportadas) y "Context" (trayectoria previa), modal `ntrk:` con el detalle, "The bench, in one line"; sin calificaciones (decisión de SAB).
- Fuentes: 10-K FY2026 (Item 1, executive officers; Item 1A; Note 2; balance), dataset de Results (10-K/10-Q), Governance.
- Autoauditoría: cifras ✔ (ingreso 10.9→215.9B, DC 3.0→193.7B, inventario 10.1→21.4B) · modal ✔ · pie ✔ · corregido antes de la compuerta: "The bench" exageraba ("every record built during the AI build-out") → "the figures above all come from the AI build-out years (FY2020–FY2026)" · (débil) el Context de Malachowsky es genérico; los filings no dan más.
- Cambios pedidos / decisiones: ninguno.

### 2026-11-02 · EV-EST Evolution ▸ Estimates — APROBADA
- Qué se mostró: `resultsEvoHtml('NVDA')` / `initResultsEvo('NVDA')` sobre el bloque `evolution` (3 submits 2025-12-12 · 2026-03-04 · 2026-08-28, FY2026–FY2029); Top Line (rev por defecto, Data Center) y Profitability (op. income non-GAAP por defecto — decisión SAB; GAAP, utilidad bruta, EBITDA del modelo, capex, FCF); slider de 3 bolitas; Revision record, Snapshot by snapshot, Projection by snapshot con ⇄ Compare. Reemplaza el panel viejo de Consensus (#31; el "May '26" inexistente se corrige con los 3 snapshots reales).
- Fuentes: MCP Summit (3 snapshots congelados), consenso BBG (guardado en el archivo del modelo para rev; workbook BBG para el resto).
- Autoauditoría: slider recorta gráfica y tablas ✔ (5→4 columnas) · rampa de un tono por año ✔ · columnas ajustadas de dic-2025 vacías con nota de cambio de base ✔ · 0 errores de consola ✔.
- Cambios pedidos / decisiones: duda 1 cerrada (SAB: alineación a propósito desde marzo) → la nota lo dice como hecho.
- Conciliación B3 corregida en esta compuerta: los textos de #27 (beats) y #30 (historia del consenso) estaban marcados ✅ pero nunca se habían pasado a ninguna nota; también los callouts de #31 y del consenso forward. Pasados con cifras recalculadas a las notas de rev: Quarterly (17 trimestres seguidos sobre el punto medio desde 3Q23; único fallo 2Q23 −17%; pico +22.8% en 2Q24; últimos seis +2.5% a +5.7%; guía 2Q26 sin H20), Annual (consenso BBG FY25 $44.0B→$130.5B, FY26 $43.9B→$215.9B, FY27 $146.3B→$409.7B) y Estimates (Summit sobre la calle en FY27 en los 3 submits; FY26 −1.2%; FY28 +52% en agosto; BBG 9/9/2026 FY27–FY29 $409.7B / $693.7B / $918.3B). Los números viejos (13 beats, ~$685B FY29, $390B "May '26") eran incorrectos o aproximados y no se conservan.

### 2026-11-02 · EV-RES Evolution ▸ Results — RE-APROBADA
- Qué cambió: solo las notas de Total Revenue (Quarterly y Annual) con los textos de #27 y #30 (ver EV-EST). SAB re-aprobó.

### 2026-11-09 · BL-GEN-1 Bottom Line ▸ General ▸ Profitability & margins — APROBADA
- Qué se mostró: `aMarginsBody`/`aBuildMargins` (copia de googl-bl.js ← amzn.js) en `js/overviews/nvda-bl.js`; desplegable Profit (Gross profit non-GAAP · Operating income GAAP, por defecto · Operating income non-GAAP · EBITDA · Net income GAAP) / Cash (FCF); Annual | Quarterly; Normalized solo con Net income anual; rangos All/Reported/Forward/Last 5; chip por fuente; tabla plegada. Reemplaza la caja vieja de Margins (B2 #7): su FY27E Summit sin fecha se reemplaza por Summit congelado; el texto viejo de la nota quedó en las notas por métrica.
- Fuentes: `js/results-data/nvda.js` (act 10-K/10-Q; Summit 3 snapshots congelados; consenso BBG 2026-09-09); `nvda-bbg.js` (export BBG 9/9/2026) para Normalized.
- Autoauditoría: 6 métricas × Annual/Quarterly ✔ · ejes a la derecha ✔ · futuros desvanecidos ✔ · zoom en ambos ejes ✔ · sin `<style>` ✔ · 0 errores (39 botones) ✔ · FAIL arreglado antes de mostrar: en Quarterly, pasar por EBITDA (cae a anual) dejaba la ventana de 10 periodos en las demás métricas (1Q20–2Q22, sin consenso) → `aStdRender` reinicia la ventana cuando cambia el eje (mismo andamiaje en googl/meta/amzn-bl: revisar en PR aparte) · observación: EBITDA trimestral no se dibuja (no está en Results; el export BBG solo trae 9 trimestres "comparable") · Summit FY26 GAAP op. income 129.9 vs 130.4 = el −426 del submit 12-12 (bloqueo §6).
- Cambios pedidos / decisiones: ninguno.

### 2026-11-09 · BL-GEN-2 Bottom Line ▸ General ▸ The bridge — APROBADA
- Qué se mostró: Build-up ($B) anual (FY19–FY26) y trimestral (3Q/4Q FY27 deshabilitados), Margin change (bps), Forward (expenses) con 5 sliders contra consenso + "consensus residual", Cost structure (% del ingreso apilado FY19–FY26 + margen bruto y operativo, tabla). Costo de ventas primero y aparte con subtotal Gross profit, una sola barra (decisión 2026-11-02); Arm FY23 en ámbar.
- Fuentes: SEC XBRL (10-K/10-Q) vía `nvda-bl-data.js`; export BBG 9/9/2026 para Forward.
- Autoauditoría: FY26 215.9 − 62.5 = 153.5 − 18.5 − 4.6 = 130.4 ✔ · 2Q27 96.2 → 63.7 ✔ · bps FY23 15.7% → FY26 60.4% suma ✔ · FY23 cuadra con el cargo de Arm ✔ · ejes a la derecha ✔ · 0 errores ✔.
- Cambios pedidos / decisiones: ninguno.

### 2026-11-09 · BL-GEN-3 Bottom Line ▸ General ▸ Operating income → net income — APROBADA
- Qué se mostró: cascada Op. income → interés neto → otros ingresos (ámbar) → impuestos → Net income; Reported | Normalized; FY24–FY29E (FY27E por defecto); los años estimados parten de op. income non-GAAP (rótulo y texto lo dicen); leyenda de 3 oraciones.
- Fuentes: 10-K FY2024–FY2026 vía SEC XBRL y líneas reportadas del export BBG; export BBG 9/9/2026 para FY27E–FY29E.
- Autoauditoría: FY24 29.76 · FY25 72.88 · FY26 120.07 = 10-K ✔ · Normalized FY26 112.41 ✔ · ≤ 3 oraciones, sin fechas tecleadas ✔ · 0 errores ✔ · FAIL arreglado antes de mostrar: el texto decía que FY27E "already contains the reported quarters", pero el consenso (224.2) se pronostica sin ganancias en inversiones y deja fuera las de 1Q27/2Q27 (GAAP real 1H = 118.0 vs 97.8 implícito) → texto corregido.
- Cambios pedidos / decisiones: ninguno.

### 2026-11-09 · BL-GEN-4 Bottom Line ▸ General ▸ Stock-based compensation — APROBADA
- Qué se mostró: Dilution (barras SBC + acciones diluidas reportadas y consenso BBG) | SBC by line (costo de ventas · R&D · SG&A); $B | %; ambos ejes a la derecha; tabla plegada.
- Fuentes: 10-K FY2026 Nota 3 (SBC por línea, FY24–FY26); export BBG 9/9/2026 (FY27E–FY29E, acciones diluidas).
- Autoauditoría: FY26 SBC 6.4 = 0.3 + 4.7 + 1.4 = 10-K ✔ · acciones 24,940 → 24,514 ✔ · ejes a la derecha (A9) ✔ · 0 errores ✔ · FAIL arreglado antes de mostrar: en SBC by line %, las líneas forward de BBG no suman su total de SBC (FY28E 13.0 vs 9.2) y R&D salía en 108.6% con barras cortadas en el tope de 100% → el % ahora es sobre la suma de las líneas, con nota.
- Cambios pedidos / decisiones: sin línea de acciones Summit (ofrecida; SAB aprobó sin ella).

### 2026-11-09 · BL-GEN-5 Bottom Line ▸ General ▸ Expense lines — APROBADA
- Qué se mostró: colapsable "Expense lines — the 3 cost lines of the income statement"; pestañas Cost of revenue · (rótulo Operating expenses) · R&D · SG&A con `$X · Y%` calculados; por línea: Key figures · Definition — Form 10-K (solo costo de ventas; R&D y SG&A sin definición en el 10-K, la nota lo dice) · Share of revenue FY2019–FY2026 · Composition and drivers (una tabla) · Effect on the operating margin · Management commentary · pie.
- Fuentes: 10-K FY2026 (Item 7, notas), 10-Q 2Q FY27; SEC XBRL (series); transcripciones de The Motley Fool de 3Q FY26–2Q FY27 (decisión SAB 2026-11-02, marcadas de terceros en el pie).
- Autoauditoría: sin emojis ni íconos ✔ · sin título repetido ✔ · costo de ventas primero ✔ · 15 fragmentos de citas de llamadas verificados por script contra las 4 transcripciones de Motley Fool bajadas el 2026-11-09 ✔ · 7 citas de 10-K/10-Q verificadas contra el texto de los filings ✔ · 0 errores ✔ · desvío aceptado: la guía pide `docs/calls/`; fuente = Motley Fool por decisión de SAB.
- Cambios pedidos / decisiones: ninguno. Bottom Line ▸ General completo.

### 2026-11-09 · EV-SET Evolution ▸ Earnings ▸ Setup — APROBADA
- Qué se mostró: Evolution abre en Earnings; solo la fase Setup (Post-Results y Notes sin publicar: sin transcripción oficial, decisión SAB); pastillas Q4 FY27 · **Q3 FY27 (activa)** · Q2 FY27 (reportado, congelado); lista "down the income statement" de 25 líneas con Street | Summit, YoY/QoQ, margen, titular de la nota visible + `?`, GUIDED en ingreso / utilidad bruta / opex; Setup picture (motor de Results, `NVDA_SETUP`); pie de fuentes por trimestre. Reubica B2 #15 ("Latest print & guidance (Q1 FY2027)") en las notas de Q2 FY27, actualizado.
- Archivos: `js/overviews/nvda-ce.js` (copia de `lyft-ce.js`), `js/overviews/nvda-ce-data.js`, `js/results-data/nvda-setup.js` (registrado `NVDA_SETUP` en `js/results.js`), `js/themes-data/nvda.js` (semilla vacía), `scripts/consensus/map_nvda_ce.json` + `emit_ce_nvda.py` (líneas que Results no trae: R&D, SG&A, EBITDA, intereses, impuestos, CFO, D&A, acciones).
- Fuentes: BBG_CONSENSUS.txt (30 snapshots; Street Q3/Q4 = 2026-09-09, Q2 = 2026-05-25); Summit congelado en Results (Q3/Q4 = submit 2026-08-28, Q2 = 2026-03-04); 8-K de NVIDIA del 2026-08-26 y 2026-05-20 (Ex. 99.1 y 99.2).
- Autoauditoría: 23 citas verificadas por script contra los 8-K ✔ · reportados 2Q FY27 de las líneas nuevas = 8-K (R&D non-GAAP 6,884; SG&A 1,348; EBITDA 65,083; impuestos 11,819; CFO 24,077; D&A 1,127; acciones 24,285) ✔ · R&D/SG&A/EBITDA solo en la base nueva (sin YoY hasta 4Q FY27) ✔ · 31 controles sin errores ✔ · sin emojis ni tarjetas IR/EDGAR ✔ · cifras "derived" marcadas ✔ · arreglado sobre la copia de LYFT: abre en el próximo print (no el más lejano), titular de nota visible en la fila (§12), pie de fuentes por trimestre (LYFT no lo pintaba) · advertencia: YoY de Hyperscale/ACIE contra el recast de BBG de 3Q FY26 (bloqueo §6 abierto).
- Cambios pedidos / decisiones: las tres de la sección 3 (2026-11-09).

### 2026-11-09 · BL-SEG Bottom Line ▸ Segments — APROBADA
- Qué se mostró: sección de segmentos copiada de `googl-bl.js` en `js/overviews/nvda-bl.js` (`nvdaBlSegmentsHtml/Build`), datos nuevos en `nvda-bl-data.js` (`NVDA_SEG_*`). Profit by segment (C&N · Graphics · Unallocated · Consolidated GAAP; Operating income | EBITDA anual FY24–FY26; anual/trimestral) · Revenue vs profit common size · segment bridge (por segmento; forward = suma de los dos segmentos, sin "By cost" porque NVIDIA no da costos por segmento) · deep dives C&N y Graphics · pie. La pestaña vieja de Segments (`segmentsBody`, B2 #10–16) sale de pantalla: #14 absorbido aquí (tabla trimestral → gráfica + tabla; texto de los dos segmentos GAAP → definición y "The business"); Anexo A16 (utilidad por segmento en anual) resuelto.
- Fuentes: 10-K FY2026 Nota 16 (definiciones, D&A por segmento, conciliación) y 10-Q 2Q FY27; dataset de Results (cnrev/grrev/cnop/grop; no asignado = op. income GAAP − segmentos); consenso BBG de utilidad por segmento; Summit solo consolidado; Motley Fool (prepared remarks de Kress).
- Autoauditoría: C&N FY26 130.1 · Graphics 9.2 · no asignado −8.9 (= SBC 6,386 + 1,997 + 527) · 2Q FY27 no asignado −2.86 (= 2,027 + 612 + 222) ✔ · EBITDA = OI + D&A (C&N 131.7, Graphics 9.7, consolidado 133.2) ✔ · puente FY23→FY26 cuadra a 130.4 ✔ · 21 citas verificadas por script (13 filings, 8 llamadas, todas de Kress dentro de la llamada) ✔ · 51 controles sin errores ✔ · sin `<style>` ✔ · observaciones: D&A C&N FY26 redondeado en el 10-K ("$1.6 billion", nota en pantalla); el 10-K numera la nota de segmentos como 16 — OV-3/OV-4 citan "Note 17", revisar en F-FINAL.
- Cambios pedidos / decisiones: las dos de la sección 3 (2026-11-09).

### 2026-11-09 · BL-SPLC Bottom Line ▸ Supply Chain — APROBADA
- Qué se mostró: `js/overviews/nvda-splc.js` (copia de `meta-splc.js`), montado en `nvidia.js` arriba del mapa de semis (`semi-industry.js`, B2 #35 ✅). Lede + nota de cobertura; 5 KPIs ($279B compromisos · TSMC 37% del costo de ventas · materias primas $11.3B · KYEC 36% · 20 relaciones); bloque de filings (compromisos por año fiscal con tabla completa $366B, trayectoria $95.2B → $119B → $279B, inventarios ene/jul, cita del 10-K por rol); Cadena 1 silicio (8 tarjetas con modal); Cadena 2 sistemas/componentes/herramientas (12 filas); "who needs whom" top 10.
- Fuentes: `nvidia-map-reference/SPLC_BBG.xlsx` (NVDA US Equity, relaciones del 2025-06-04 al 2026-06-25); 10-Q 2Q FY27 Note 10 e inventarios; 10-K FY2026 Note 12 e Item 1 Manufacturing.
- Autoauditoría: 3 citas verificadas por script contra 10-K/10-Q ✔ · nada sumado entre periodos (los 20 "% del costo" suman ~110%) ✔ · Fabrinet/Ibiden = 1/4 del anual (FN FY25 $3.42B × 27.6% ÷ 4 ≈ $236M) → "quarterly avg." ✔ · tabla bajo la gráfica ✔ · paleta Summit, CSS en `css/overview.css` (sin `<style>`) ✔ · modal, desplegable y mapa funcionan ✔.
- Cambios pedidos / decisiones: las dos de la sección 3 (2026-11-09).

### 2026-11-09 · VA-HIST Valuation ▸ Historic Multiple — APROBADA
- Qué se mostró: `js/overviews/nvda-histmult.js` (copia de `meta-histmult.js`) + `js/overviews/nvda-histmult-data.js` (SEC XBRL companyfacts CIK 0001045810, 1Q19–2Q27, generado por script el 2026-11-09: acciones diluidas reexpresadas por los splits ×40/×10 según fecha de filing, caja + valores de deuda negociables, deuda, utilidad operativa GAAP, D&A). Primera sub-tab de Valuation (activa por defecto). Año fiscal de NVIDIA (último domingo de enero) en `fyEndDay`/`fy0Of`/`periodKey`/marcas de cambio de año; trimestres 1Q27…, años FY2020…; FY+3 deshabilitado con la razón.
- Fuentes: precio Massive en vivo (`get-market-history`, confirmado); consenso BBG (estMatrix.cons.y.eps 2019-05-21 → 2026-09-09; ebitda desde 2026-03-02); EPS GAAP reportado de `results-data/nvda.js`; 10-Q 2Q FY27 (ganancias por inversiones en acciones $23.7B en el 1S).
- Autoauditoría: hoy P/E fwd 12.0× = $176 ÷ NTM $14.73 (0.23 × FY27 $9.94 + 0.77 × FY28 $16.14) ✔ · P/E trail 22.3× = $176 ÷ $7.91 (1.30+1.76+2.39+2.46) ✔ · hoy = 4Q27 (el Q3 FY27 cerró el 2026-10-25) ✔ · acciones 24.3–25.3B en toda la serie ✔ · sin denominador no se dibuja ✔ · tabla, zoom, rangos, chips ✔ · paleta Summit, sin `<style>` ✔.
- Cambios pedidos / decisiones: las dos de la sección 3 (2026-11-09).

### 2026-11-09 · VA-PEERS Valuation ▸ Peers — APROBADA
- Qué se mostró: `nvdaValuationPeersBody()` en `nvidia.js` = lede + `stdPeerScatter('dd')` (el mapa de OV-6, `N_PEERS`/`N_SC`) + tabla "The numbers behind the map" abierta (peer · múltiplo · crecimiento · market cap · vs peer avg; promedio y mediana sin NVIDIA) + pie. `nScRenderAll` ahora repinta todos los mapas `.nvda-sc` de la página, así el estado es compartido con OV-6 (único cambio en código de OV-6; no altera lo que OV-6 muestra).
- Fuentes: 10-K de cada empresa (SEC EDGAR, pulled 2026-11-02); forward BBG FY2027 2026-09-09 solo NVIDIA; precio / market cap / EV en vivo (Massive).
- Autoauditoría: P/E trailing en vivo Qualcomm 34.9× · NVIDIA 36.1× · Marvell 50.5× · Broadcom 66.8× · AMD 188.6× · Intel sin P/E (pérdida); mediana ex-NVIDIA 58.6× ✔ · quitar Intel en Valuation lo quita del Overview (6 → 5 en ambos) ✔ · forward: solo NVIDIA, peers con "trailing only — no Street file" ✔ · sin múltiplos escritos ✔. Excepción aceptada de la guía: sin zoom (los chips × la cubren).
- Nota mostrada a SAB: P/E trailing de NVIDIA 36× aquí (último 10-K, EPS FY2026 $4.90) vs 22× en VA-HIST (LTM $7.91 con las ganancias por inversiones de FY27).

### 2026-11-09 · VA-TM Valuation ▸ Target Multiple / PEG — APROBADA
- Qué se mostró: `js/overviews/nvda-target-multiple.js` (copia de `uber-target-multiple.js`) + `js/overviews/nvda-target-multiple-data.js` (congelado: valuación de `get_valuation_history` 2026-11-09; filas REV/EBITDA/EARNINGS/SHARES de los volcados `get_fundamentals` del 2026-11-02). 3 submits: 2025-12-12 (EV/EBITDA 16× FY2028 → $249.54; P/E 24× FY2027 → $201.95), 2026-03-04 (18× / 22× FY2028 → $245.69 / $245.68), 2026-08-28 (18× / 22× FY2028 → $370.54 / $370.00). Abre en FY2028. `BREAK_ON = '2026-03-04'` (la SBC pasa a ser gasto): etiqueta en el punto y la tabla + aviso rojo del año + nota del PEG. Live con el balance del propio modelo (deuda $33.9B, caja y valores $99.4B → caja neta $65.5B, fuente en el pie). Fecha del objetivo = fin del año fiscal anterior (Jan 31, 2027). CSS: se agregó `.ov-nvda-dd` a las reglas `.tm-*` existentes; divisor `.nv-tm-old`. La calculadora vieja (B2 #32) queda debajo con un título hasta VA-SENS; #2, #33 y #34 quedan cubiertos (✅).
- Fuentes: Summit DCF model (instrument NVDA, model 12da9a59); `DCF NVDA.xlsm` ▸ Discounted Cash Flow (archivo del 2026-08-28, leído 2026-11-09).
- Autoauditoría: PT P/E = (22 × 395,606 + 232,436) ÷ 24,150.4 = $370.00 ✔ · PT EV/EBITDA = 18 × 483,971 + 208,043 − 33,875 + 99,369 = $8,985,014M de equity → $370.54 ✔ · PT÷FV 1.112/1.112 y 1.281/1.281 ✔ · sin `quality_flags` ✔ · Live a 18× = (18 × 483,971 + 65,494) ÷ 23,787 = $368.98 (sin el flujo FY2027, explicado en el pie) ✔ · sin múltiplos inventados ✔ · sin `<style>` ✔.
- Cambios pedidos / decisiones: ninguno.
