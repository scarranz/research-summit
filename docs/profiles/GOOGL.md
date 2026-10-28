# GOOGL — bitácora de construcción del perfil

> Copia este archivo a `docs/profiles/<TICKER>.md` en la Fase 0. Reglas: `docs/PROFILE_PLAYBOOK.md` §3.
> Claude la lee completa al empezar cada sesión y la actualiza en cada aprobación (no al final).
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)

| Campo | Valor |
|---|---|
| Empresa | Alphabet Inc. (NASDAQ: GOOGL · también GOOG, mismo módulo) |
| Modo | B — reordenar existente (perfil de DOAA351, PRs #60/#62, jul 2026; `js/overviews/googl.js` 2,900 líneas) |
| Rama | `feat/googl-restructure` (desde `origin/main` @ `95c00e0`, 2026-10-26; worktree `rs-playbook`). Nombre de modo B (§7.1); `feat/googl-profile` ya existe en GitHub (rama vieja de DOAA351, jul 2026) y no se toca |
| Analista responsable | SAB (Santiago Alvarez) |
| Inicio | 2026-10-26 |
| Avance | **44 de 44** unidades aprobadas (F0 · F0-SM · B1 · B2 · F1 · OV-1…OV-7 · OV-F · EV-RES-DATA · EV-RES · TL-GEN · TL-SEG · TL-OTH · TL-CUS · EV-EST · EV-SET · EV-NOTES · EV-POST · BL-GEN-1…5 · BL-SEG · BL-SPLC · VA-HIST · VA-PEERS · VA-TM · VA-SENS · MG-TEAM · MG-OWN · MG-GOV · MG-TRACK · MISC-comp · MISC-capex · MISC-capacity · MISC-strategy · MISC-tam · F-FINAL) · 0 omitidas · 0 bloqueadas. M = 38 del Anexo C + B1/B2 + 4 (MISC aprobado en B2 con 4 sub-tabs: comp · tam · capex · strategy; capacity agregada por SAB el 26-oct). Perfil completo (F-FINAL 2026-10-27). Pendiente: 3T26 tras el reporte del 28-oct |

## 1. Inventario de datos (F0)

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | ✔ (se asume) | el perfil ya abre (registrado en `js/overviews/index.js` como `GOOGL` y `GOOG`) | el perfil abre | — |
| Filing anual (10-K / 20-F) | ✔ | 10-K FY2025 (Alphabet, CIK 1652044, domestic filer); accession por anotar en OV-1 | Overview, Top Line, textos verbatim | — |
| Año fiscal / moneda | ✔ | cierre 31 dic · USD | — | — |
| Summit DCF | ✔ (ingestado 2026-10-26) | `G:\My Drive\Summit\Docs\Research\DCF\Technology - SAB\GOOGL\DCF GOOGL - New.xlsm`. MCP: **3 snapshots** 2026-07-23 · 2026-07-28 · **2026-08-06**, los tres `after_quarter` Q2 - 2026 (parseados 2026-10-26). USD, millones | F0-SM; Summit congelado en Results/Top Line/Setup/Bottom Line, EV-EST (eje de 3 snapshots), VA-TM, VA-SENS | — |
| Consenso BBG (`BBG_CONSENSUS.txt` + `Consensus_Portal.xlsm`) | ✔ | `GOOGL US EQUITY`: **30 snapshots**, 2019-05-04 → **2026-09-08**; headline completo (Revenue, COGS, GP, opex por función, Op. income, Adj. EBITDA…) | `estMatrix.cons`, Setup, export de Bottom Line, forward de peers | — |
| `get-market-history` (Massive) | ✔ desplegada (2026-10-14, PR #142) | precio diario; `ratios` falla → acciones/deuda de EDGAR XBRL como en META | Historic Multiple en vivo | — |
| Valuación del modelo en el MCP (`get_valuation_history`) | ✔ | 2 métodos por snapshot, `quality_flags` vacío en los 3. 08-06: EV/EBITDA 12.7× y P/E 24.0×, 2027 Forward. ⚠ 07-23: EV/EBITDA con `target_year` **2029** (14.0×) vs 2027 en los otros — cambio de definición a revisar en VA-TM. Falta confirmar contra la hoja Output del workbook | VA-TM, VA-SENS | — |
| SPLC (clientes / proveedores) | ◐ | el perfil actual usa un export **GOOGL US Equity, as of 22-Jul-2026** (728 proveedores / 1,166 clientes), pero el archivo no está en el repo ni en Drive por nombre — falta ubicarlo | TL-CUS tabla, BL-SPLC | BL-SPLC sin el archivo fuente |
| Transcripciones | ✔ | `docs/calls/GOOGL.md` (4Q23 → 1Q26) + `GOOGL-latest.md` (2Q26, 2026-07-22). Quartr: ya no se conecta (SAB, 2026-10-26); transcripciones oficiales en PDF de Alphabet IR (s206.q4cdn.com). **3T26 se reporta a fines de oct 2026** (fecha por confirmar) | EV-POST, EV-NOTES, citas | — |
| Fiscal.ai (plan) | ✘ (según CLAUDE.md) | GOOGL no está en el plan gratis (solo AMZN, MA, NVDA, UBER, V) — se verifica en el portal | tabla en vivo de Management | el hueco dice "not available on the current Fiscal.ai plan" (correcto) |
| Massive (`liveQuote`) | ✔ | funciona vía `covered-calls-massive` | market cap, peers | — |
| Fotos / imágenes | ✔ | `img/leadership/googl-*.jpg` (7: Pichai, Porat, Ashkenazi, Hassabis, Kurian, Mohan, Schindler) | Management | — |

**Alcance acordado (2026-10-26, SAB):** las 38 unidades + B1/B2 son construibles; BL-SPLC pendiente de saber si hay export SPLC de GOOGL.

## 1b. Mapa Summit (F0-SM)

> Reglas: `docs/PROFILE_PLAYBOOK.md` §6.3. Una fila por **cada** etiqueta de `list_metrics`, incluidas las `ignore`.
> Archivo que lee el portal: `js/summit-map/<ticker>.js` (sin números).

Modelo: `G:\My Drive\Summit\Docs\Research\DCF\Technology - SAB\GOOGL\DCF GOOGL - New.xlsm` · USD · millones ·
3 snapshots (2026-07-23 · 2026-07-28 · 2026-08-06, los tres después del 2T26; ingestados 2026-10-26) ·
**62 etiquetas: 33 core · 13 segment · 4 kpi · 0 guidance · 4 consensus · 8 ignore** · **valuación: EV / EBITDA y
P / E (Base, Forward), `quality_flags` vacío en los 3** · 7 dudas.

Fuentes dentro del modelo: **DEFAULT** = totales (reales = 10-K GAAP; proyecciones **solo anuales**, 2026–2029) ·
**SEGM** = ingresos por tipo y segmentos del 10-K, líneas del estado de resultados y las **proyecciones trimestrales**
de los totales (`SEG_REV`, `SEG_OPINC`, `SEG_EBITDA`…) · **BBG** = consenso Bloomberg dentro del modelo (anual).
La numeración `SEGn` **no** sigue el orden del 10-K (p. ej. `SEG1_OPINC` = Services, `SEG2_OPINC` = Cloud).

Cuadre: todas las etiquetas `core` y `segment` cuadran con el 10-K FY25 (acc. 0001652044-26-000018) al dólar (EDGAR XBRL + texto del 10-K),
salvo las marcadas. Archivo: `js/summit-map/googl.js` (sin números).

| Etiqueta MCP | Rol | Clave portal | Qué es, en una línea | Base | Unidad real | Agregación | Periodos | Cuadre vs filing | Confianza |
|---|---|---|---|---|---|---|---|---|---|
| `REV` | core | `rev` | Ingreso total | GAAP | USD M | suma | A 2026–29 (proy.) | FY25 402,836 = 10-K → Δ0 ✔ | ✔ |
| `SEG_REV` | core | `rev (Q)` | Ingreso total, trimestral | GAAP | USD M | suma | Q 2Q26–4Q27 | 4Q25 113,828 = 8-K ✔; anual 2026 roto | ❓ (duda 2) |
| `COGS` | core | `cogs` | Costo de ventas (incluye TAC) | GAAP | USD M | suma | Q 2026–27; A 2027+ (2026 vacío) | FY25 162,535 Δ0 ✔ | ✔ |
| `SEG_GP` | core | `gp` | Utilidad bruta | GAAP | USD M | suma | Q; A 2027+ | FY25 240,301 = 402,836−162,535 ✔ | ✔ |
| `R&D` | core | `rd` | Investigación y desarrollo | GAAP | USD M | suma | Q y A | FY25 61,087 Δ0 ✔ | ✔ |
| `S&A` | core | `sm` | Sales & marketing (la etiqueta dice S&A) | GAAP | USD M | suma | Q y A | FY25 28,693 Δ0 ✔ | ✔ |
| `G&A` | core | `ga` | General & administrative | GAAP | USD M | suma | Q y A | FY25 21,482 Δ0 ✔ | ✔ |
| `OP_INCOME` | core | `opinc` | Utilidad operativa | GAAP | USD M | suma | A | FY25 129,039 Δ0 ✔ | ✔ |
| `SEG_OPINC` | core | `opinc (Q)` | Utilidad operativa, trimestral | GAAP | USD M | suma | Q 2Q26–4Q27 | FY25 129,039 ✔ | ✔ |
| `EBITDA` | core | `ebitda` | EBITDA **ajustado** = op. inc. + depreciación + SBC | ajustada | USD M | suma | A | FY25 175,128 = 129,039+21,136+24,953 ✔ | ⚠ no es GAAP |
| `SEG_EBITDA` | core | `ebitda (Q)` | Ídem, trimestral | ajustada | USD M | suma | Q | FY25 175,128 ✔ | ⚠ |
| `SBC` | core | `sbc` | SBC del flujo de efectivo | GAAP | USD M | suma | Q 2026; A 2027+ | FY25 24,953 = CF Δ0 ✔ (gasto total de la nota: 27,100) | ✔ |
| `DNA` | core | `dna` | Depreciación de P&E (Alphabet no da amortización aparte) | GAAP | USD M | suma | A | FY25 21,136 = CF Δ0 ✔ | ✔ |
| `D&A` | core | `dna (Q)` | Ídem, trimestral | GAAP | USD M | suma | Q | FY25 21,136 ✔ | ✔ |
| `CAPEX` | core | `capex` | Compras de P&E (negativo) | GAAP | USD M | suma | A | FY25 −91,447 Δ0 ✔ | ✔ |
| `SEG_CAPEX` | core | `capex (Q)` | Ídem, trimestral | GAAP | USD M | suma | Q 2026–27 | ΣQ26 = anual 2026 (−205,756) ✔ | ✔ |
| `CFO` | core | `cfo` | Flujo operativo | GAAP | USD M | suma | A | FY25 164,713 Δ0 ✔ | ✔ |
| `FCF` | core | `fcf` | CFO − capex | modelo | USD M | suma | A | FY25 73,266 = 164,713−91,447 ✔ | ✔ |
| `INT_INC` | core | `int_inc` | Ingreso por intereses | GAAP | USD M | suma | A | FY25 4,337 Δ0 ✔ | ✔ |
| `SEG_INT_INC` | core | `int_inc (Q)` | Ídem, trimestral | GAAP | USD M | suma | Q | FY25 4,337 ✔ | ✔ |
| `INT_EXP` | core | `int_exp` | Gasto por intereses | GAAP | USD M | suma | A | FY25 736 Δ0 ✔ | ✔ |
| `SEG_INT_EXP` | core | `int_exp (Q)` | Ídem, trimestral | GAAP | USD M | suma | Q | FY25 736 ✔ | ✔ |
| `SEG_NON_OPINC` | core | `non_op` | OI&E neto total | GAAP | USD M | suma | Q y A | FY25 29,787 Δ0 ✔ | ✔ |
| `SEG_OTHER_INC` | core | `oie_equity` | OI&E: valores de capital y otros | GAAP | USD M | suma | A | FY25 26,186 vs 24,080+281+1,667 = 26,028 (Δ158) | ❓ (duda 6) |
| `PERF_FEES` | core | `oie_perf` | OI&E: performance fees | GAAP | USD M | suma | A | FY25 −297; no es línea aparte en la tabla OI&E del 10-K | ❓ (duda 6) |
| `DEBT_LOSS_GAIN` | core | `oie_debt` | OI&E: ganancia (pérdida) en deuda | GAAP | USD M | suma | A | FY25 540 Δ0 ✔ | ✔ |
| `FX_LOSS_GAIN` | core | `oie_fx` | OI&E: tipo de cambio | GAAP | USD M | suma | A | FY25 −382 Δ0 ✔ | ✔ |
| `SEG_EBT` | core | `ebt` | Utilidad antes de impuestos | GAAP | USD M | suma | Q y A | FY25 158,826 = 129,039+29,787 ✔ | ✔ |
| `SEG_INCTAX` | core | `tax` | Impuestos | GAAP | USD M | suma | Q y A | FY25 26,656 Δ0 ✔ | ✔ |
| `SEG_NETINC` | core | `net_income` | Utilidad neta GAAP | GAAP | USD M | suma | Q y A | FY25 132,170 Δ0 ✔ | ✔ |
| `EARNINGS` | core | `earnings` | Utilidad **del modelo** = (op. inc. + intereses netos) × (1 − TAX_RATE); sin ganancias de OI&E | ajustada | USD M | suma | A 2026–29 | FY25 105,984 = (129,039+4,337−736)×(1−0.20097) ✔; GAAP 132,170 | ⚠ "Model earnings (adj.)" |
| `TAX_RATE` | core | `tax_rate` | Tasa del modelo = impuesto GAAP ÷ (op. inc. + intereses netos) | modelo | % (decimal) | promedio | A | FY25 0.2010 = 26,656 ÷ 132,640 ✔; tasa efectiva 10-K 16.8% | ⚠ |
| `SHARES` | core | `shares` | Acciones diluidas (A+B+C) | diluida | acciones M | fin de periodo | A (planas desde 2026) | FY25 12,230 Δ0 ✔ | ✔ |
| `SEG2_REV` | segment | `services.rev` | Google Services, ingreso | GAAP | USD M | suma | Q y A | FY25 342,721 Δ0 ✔ | ⚠ ΣQ27 ≠ anual (duda 2) |
| `SEG1_OPINC` | segment | `services.opinc` | Google Services, utilidad operativa | GAAP | USD M | suma | A 2026; Q 1Q26 | FY25 139,404 Δ0 ✔ | ❓ (duda 4) |
| `SEG3_REV` | segment | `services.ads.rev` | Google advertising | GAAP | USD M | suma | Q y A | FY25 294,691 Δ0 ✔ | ⚠ ΣQ27 ≠ anual |
| `SEG4_REV` | segment | `search.rev` | Google Search & other | GAAP | USD M | suma | Q y A | FY25 224,532 Δ0 ✔ | ⚠ ΣQ27 = anual 2026 copiado |
| `SEG5_REV` | segment | `youtube.rev` | YouTube ads | GAAP | USD M | suma | Q y A | FY25 40,367 Δ0 ✔ | ✔ (ΣQ27 = anual) |
| `SEG6_REV` | segment | `network.rev` | Google Network | GAAP | USD M | suma | Q y A | FY25 29,792 Δ0 ✔ | ✔ |
| `SEG7_REV` | segment | `subs.rev` | Subscriptions, platforms & devices | GAAP | USD M | suma | Q y A | FY25 48,030 Δ0 ✔ | ⚠ ΣQ27 ≠ anual |
| `SEG8_REV` | segment | `cloud.rev` | Google Cloud, ingreso | GAAP | USD M | suma | Q y A | FY25 58,705 Δ0 ✔ | ❓ (duda 3) |
| `SEG2_OPINC` | segment | `cloud.opinc` | Google Cloud, utilidad operativa | GAAP | USD M | suma | A 2026; Q 1Q26 | FY25 13,910 Δ0 ✔; 4Q25 5,313 | ❓ (duda 4) |
| `SEG9_REV` | segment | `bets.rev` | Other Bets, ingreso | GAAP | USD M | suma | Q y A | FY25 1,537 Δ0 ✔ | ✔ |
| `SEG3_OPINC` | segment | `bets.opinc` | Other Bets, utilidad operativa | GAAP | USD M | suma | A 2026; Q 1Q26 | FY25 −7,515 Δ0 ✔ | ❓ (duda 4) |
| `SEG10_REV` | segment | `hedging.rev` | Hedging gains (losses) | GAAP | USD M | suma | Q y A | FY25 −127; cierra la suma de segmentos a 402,836 ✔ | ✔ |
| `SEG4_OPINC` | segment | `alphabet_level.opinc` | Alphabet-level activities | GAAP | USD M | suma | A 2026; Q 1Q26 | FY25 −16,760 Δ0 ✔ (Σ 4 = 129,039 ✔) | ❓ (duda 4) |
| `TAC` | kpi | `tac` | Traffic acquisition costs | GAAP | USD M | suma | Q 2Q26–; A | FY25 59,926 Δ0 ✔ | ✔ |
| `SHARE_BUYBACK` | kpi | `buyback_usd` | Recompras ($) | GAAP | USD M | suma | A (no proyecta) | FY25 −45,709 Δ0 ✔ | ✔ |
| `SH_REPUR` | kpi | `buyback_sh` | Acciones recompradas | — | ¿acciones M? | suma | A | FY25 −244.7 | ❓ (duda 5) |
| `STOCK_PAYMENT` | kpi | `stock_issuance` | Proceeds from stock issuance (SAB) | — | USD M | suma | Q y A | FY25 13,986 ≠ pagos netos por acciones (14,167) ≠ dividendos (10,049) | ❓ (duda 5) |
| `REV_BBG_EST` | consensus | `cons.rev` | Consenso BBG de ingreso | ¿neto de TAC? | USD M | suma | A | FY25 340,855 ≈ 402,836−59,926 = 342,910 | ❓ (duda 7) |
| `EBITDA_BBG_EST` | consensus | `cons.ebitda` | Consenso BBG de EBITDA | ajustada | USD M | suma | A | FY25 174,183 vs modelo 175,128 | ✔ |
| `EARNINGS_BBG_EST` | consensus | `cons.earnings` | Consenso BBG de utilidad | ≈ GAAP | USD M | suma | A | FY25 129,701 vs GAAP 132,170 | ⚠ base distinta a EARNINGS |
| `SHARES_BBG_EST` | consensus | `cons.shares` | Consenso BBG de acciones | diluida | acciones M | fin de periodo | A | FY25 12,194 | ✔ |
| `SEG1_REV` | ignore | `—` | Todo en cero | — | — | — | — | — | — |
| `SEG5_OPINC` | ignore | `—` | Todo en cero | — | — | — | — | — | — |
| `SEG_COGS` | ignore | `—` | Todo en cero (vive en COGS) | — | — | — | — | — | — |
| `SEG_DNA` | ignore | `—` | Todo en cero (vive en DNA / D&A) | — | — | — | — | — | — |
| `SEG_SBC` | ignore | `—` | Todo en cero (vive en SBC) | — | — | — | — | — | — |
| `SEG_CFO` | ignore | `—` | Proyección en cero; real duplica CFO | — | — | — | — | — | — |
| `SEG_FCF` | ignore | `—` | Proyección = solo capex (no es FCF) | — | — | — | — | — | — |
| `RPO` | ignore | `—` | Vacío en todo periodo | — | — | — | — | — | — |

**Valuación (`get_valuation_history`)** — se congela tal cual, sin dudas de calidad:

| Snapshot | EV / EBITDA | P / E | Precio ese día |
|---|---|---|---|
| 2026-08-06 | 12.7× · 2027 Fwd · PT $344.60 · FV $323.31 | 24.0× · 2027 Fwd · PT $391.52 · FV $367.09 | $357.65 |
| 2026-07-28 | 12.7× · 2027 Fwd · PT $318.50 · FV $297.37 | 21.3× · 2027 Fwd · PT $317.53 · FV $296.24 | $334.15 |
| 2026-07-23 | **14.0× · 2029 Fwd** · PT $490.01 · FV $381.04 | 30.0× · 2027 Fwd · PT $434.97 · FV $405.11 | $320.03 |

### Dudas

```
❓ GOOGL · 1 · columnas de periodos reportados en la hoja de proyección
   Lo que se ve: en `projection_history`, los periodos ya reportados traen valores de otras filas
   (2025: R&D 1,166,922 · G&A 254,357 · SEG3_OPINC −941,563 · SEG_REV 958,001; 1Q26: R&D 263,122 · G&A 63,345).
   Propuesta: para todo periodo reportado se usa SOLO `actuals_history` (los reales cuadran con el 10-K).
   Quién responde: SAB (autor del modelo) — confirmar la regla.   Mientras tanto: se aplica la regla.
   Respuesta (2026-10-26, SAB): ok — reportado solo de actuals_history. ✔ cerrada

❓ GOOGL · 2 · los trimestres no suman al año
   Lo que se ve (snapshot 2026-08-06): Σ trimestres 2027 vs anual 2027 — Services 380,565 vs 434,570 ·
   advertising 338,343 vs 371,279 · Search 257,990 (= el anual 2026, copiado) vs 290,974 · Subs 42,222 vs 63,291 ·
   Cloud 171,745 vs 194,192 (YouTube y Network sí cuadran). En 2026: SEG_REV anual 1,082,849 (roto); REV anual 506,295
   vs Σ SEG_REV 510,615, con 1Q26 proyectado 116,070 ≠ real 109,896.
   Quién responde: SAB.   Mientras tanto: trimestres 2027 de Summit en null (regla §9.1); 2026 = reales 1T–2T + 3T–4T
   proyectados solo si cuadran con el anual.
   Respuesta (2026-10-26, SAB): los trimestres solo se usan para proyectar el FY corriente (2026); los FY siguientes se
   proyectan como año completo. → 2027+ solo anual; trimestres 2027 de Summit = null. ✔ cerrada

❓ GOOGL · 3 · Google Cloud 2026
   Lo que se ve: SEG8_REV anual 2026 = 48,699 (menor que el real FY25, 58,705) vs Σ trimestres 125,345; y 2Q26
   proyectado 24,131 < 1Q26 28,514. Services + Cloud + Bets + hedging 2026 = 437,498 ≠ REV 506,295.
   Quién responde: SAB.   Mientras tanto: Cloud 2026 de Summit no se muestra.
   Respuesta (2026-10-26, SAB): vale la suma de trimestres (~125.3B); la celda anual 2026 está mal y no se lee. ✔ cerrada

❓ GOOGL · 4 · utilidad operativa por segmento
   Lo que se ve: SEG1–4_OPINC solo tienen anual 2026 (Services 80,133 — ¿medio año?) y 1Q26; 2027+ = 0.
   Quién responde: SAB.   Mientras tanto: sin serie Summit de utilidad por segmento (como META: "Summit (discontinued)").
   Respuesta (2026-10-26, SAB): sí, "discontinued" por ahora; puede retomar la proyección por segmento más adelante
   (revisar el mapa en el próximo submit). ✔ cerrada

❓ GOOGL · 5 · STOCK_PAYMENT y SH_REPUR
   Lo que se ve: STOCK_PAYMENT FY25 13,986 no coincide con pagos netos por acciones (14,167) ni con dividendos
   (10,049); SH_REPUR FY25 −244.7 (¿millones de acciones?).
   Quién responde: SAB.   Mientras tanto: no se usan.
   Respuesta (2026-10-26, SAB): STOCK_PAYMENT = proceeds from stock issuance. SH_REPUR sin respuesta (no se usa). ◐

❓ GOOGL · 6 · componentes de OI&E
   Lo que se ve: SEG_OTHER_INC 26,186 vs 10-K (equity securities 24,080 + equity method 281 + other 1,667 = 26,028);
   PERF_FEES −297 no aparece como línea en el 10-K. El total SEG_NON_OPINC sí cuadra (29,787).
   Quién responde: Claude con el 10-K / SAB.   Mientras tanto: Bottom Line ▸ Op. income → net income usa las
   líneas del 10-K, no estas.

❓ GOOGL · 7 · base del consenso de ingreso (BBG)
   Lo que se ve: REV_BBG_EST "real" FY25 340,855 ≈ ingreso neto de TAC (402,836 − 59,926 = 342,910), no el GAAP
   402,836. Lo mismo explica que en `results-data/googl.js` el consenso trimestral se vea ~17 % debajo del real.
   Quién responde: Claude con el archivo BBG (`SALES_REV_TURN` de GOOGL) — se resuelve en EV-RES-DATA.
   Mientras tanto: el consenso de ingreso no se compara contra el ingreso GAAP.
   Respuesta (2026-10-26, SAB): ok — Claude lo resuelve en EV-RES-DATA. (abierta para Claude)
```

Notas (⚠, no dudas): `EBITDA` es ajustado (+SBC) · `EARNINGS` excluye las ganancias de OI&E y usa `TAX_RATE` del
modelo → en el portal se rotula "Model earnings (adj.)" · el snapshot 2026-07-23 valuó EV/EBITDA a **2029**, los dos
siguientes a **2027** (cambio de definición: VA-TM lo marca).

### Cambios del mapa

<!-- Solo se agrega: snapshot nuevo → etiqueta nueva, desaparecida o con salto de escala/signo. -->
- AAAA-MM-DD · snapshot AAAA-MM-DD · <qué cambió> — <qué se hizo>

## 2. Tablero de unidades

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | ✅ | 2026-10-26 | SAB | | Summit ingestado el mismo día (3 snapshots) |
| B1 | Inventario de contenido existente | ✅ | 2026-10-26 | SAB | | 51 piezas (conteo de control) |
| B2 | Mapa de reubicación | ✅ | 2026-10-26 | SAB | | 51 destinos; 3 fusiones de duplicados (#18, #41, #50) + #32 aprobadas |
| F0-SM | Mapa de métricas Summit | ✅ | 2026-10-26 | SAB | | 62 etiquetas; dudas 1–5 y 7 respondidas; abiertas sin uso: SH_REPUR, OI&E (6) |
| F1 | Esqueleto + vista previa | ✅ | 2026-10-26 | SAB | | estructura AMZN (6 secciones); paneles viejos en su destino B2; sub-tabs sin contenido se agregan con su unidad (regla 5) |
| OV-1 | Overview ▸ Key Facts | ✅ | 2026-10-26 | SAB | | 10 celdas a la norma (10-K FY2025, EDGAR); market cap en vivo con fecha / unavailable; acento --steel |
| OV-2 | Overview ▸ Descripción | ✅ | 2026-10-26 | SAB | | 3 oraciones, 72 palabras, sin cifras, del 10-K Item 1 |
| OV-3 | Overview ▸ Cuadrante 2×2 | ✅ | 2026-10-26 | SAB | | The edge neutral (SAB); How it earns + Services 10× Cloud op. income; títulos en navy |
| OV-4 | Overview ▸ How it makes money | ✅ | 2026-10-26 | SAB | | Segments/Geography en grises; 3 segmentos + "The revenue lines" con cifras del 10-K; cuadre Δ0 |
| OV-5 | Overview ▸ Products & platforms | ✅ | 2026-10-26 | SAB | | 8 familias; Wiz cerrada (mar-2026, $29.5B) y TPU systems (10-Q 2T26); texto neutral |
| OV-6 | Overview ▸ Competitors (peer map) | ✅ | 2026-10-26 | SAB | | 6 nombres (GOOGL + MSFT, AMZN, META, AAPL, ORCL); denominadores 10-K/BBG; múltiplos en vivo; Trailing por defecto |
| OV-7 | Overview ▸ Timeline | ✅ | 2026-10-26 | SAB | | 14 hitos en orden; Wiz cerrada mar-2026 ($29.5B) con modal; texto sin opinión |
| OV-F | Overview ▸ Pie de fuentes | ✅ | 2026-10-26 | SAB | | un solo pie; 10-K FY2025 + 10-Q 2T26 + 8-K 4T25 + IR; múltiplos en vivo; sin "seeded" |
| EV-RES-DATA | Dataset de Results (números) | ✅ | 2026-10-26 | SAB | | act (BBG reportado, cuadrado vs XBRL) + cons (estMatrix 30 snapshots; rev = suma de segmentos) + Summit 08-06 congelado; verify_preprint 502 same / 0 changed |
| EV-RES | Evolution ▸ Results | ✅ | 2026-10-26 | SAB | | motor results.js con el dataset nuevo; selector de vintage, sorpresas, Road to the print |
| TL-GEN | Top Line ▸ General | ✅ | 2026-10-26 | SAB | | motor segments.js; cita 10-K; 3 tarjetas; How revenue divides |
| TL-SEG | Top Line ▸ Segments | ✅ | 2026-10-26 | SAB | | Services · Cloud · Other Bets; 4 KPIs de monetización + TAC rate + backlog; precio×volumen Search y Network; bloque 5 con ⚑ hasta EV-NOTES |
| TL-OTH | Top Line ▸ Other | ✅ | 2026-10-26 | SAB | | líneas de ingreso (q/y) + geografía (anual 2023–25) |
| TL-CUS | Top Line ▸ Customers | ✅ | 2026-10-26 | SAB | | sin concentración >10% (verbatim); 3 clases; sección 4 sin export SPLC; sección 5 espera el motor |
| EV-EST | Evolution ▸ Estimates | ✅ | 2026-10-26 | SAB | | 2 snapshots (28-jul, 6-ago; 23-jul fuera); FY26–29; consenso EBITDA + utilidad (bases distintas, con aviso) |
| EV-SET | Evolution ▸ Earnings ▸ Setup | ✅ | 2026-10-26 | SAB | | `googl-ce.js` (copia de meta-ce.js) + `googl-ce-data.js`; 3T26 (28-oct) con Street segment-sum, Summit 08-06 y notas verbatim del CFO |
| EV-POST | Evolution ▸ Earnings ▸ Post-Results | ✅ | 2026-10-26 | SAB | | The print + Call Summary de 2T26/1T26/4T25 (9 puntos de prepared, 9 Q&A, 7 'Also on the call', 5 Propose Notes c/u); citas textuales de las transcripciones oficiales de Alphabet IR (PDF, descargadas con permiso de SAB), verificadas cita por cita y hablante por hablante (56/57/57, 0 fallas). 3T26 se llena después del 28-oct |
| EV-NOTES | Evolution ▸ Earnings ▸ Notes | ✅ | 2026-10-26 | SAB (v2 con sus notas, aprobada) | | semilla v2 `themes-data/googl.js`: base = notas a mano de SAB (GOOGL (2).pdf, 3T22→2T26 + GS Sep25/Sep26, MS Mar26, I/O May26) + hilos de Dani no cubiertos; 24 hilos, 167 notas, 7 ganchos cerrados (caída de publicidad 22–23, Cloud rentable, reset de costos 23–24, capex FY23/24/25, "same rate"); cifras contrastadas con 10-K/10-Q (4 corregidas) + Watch List de Dani (21 filas) |
| BL-GEN-1 | Bottom Line ▸ General ▸ Profitability & margins | ✅ | 2026-10-26 | SAB | | copia de `meta-bl.js` → `googl-bl.js`; consenso de ingreso = suma de segmentos BBG; bruta sin consenso (base mixta); Summit = `opinc/ebitda/mearn/fcf` congelado 08-06; Normalized = − OI&E después de impuestos; notas de one-offs (multa CE, Waymo) |
| BL-GEN-2 | Bottom Line ▸ General ▸ The bridge | ✅ | 2026-10-26 | SAB | | costo de ventas en 2 barras (TAC · otros, 10-K) + bruta + R&D · S&M · G&A; FY19–FY25 y 1T23–2T26 cuadran con la utilidad operativa; forward: costo de ventas derivado (ingreso − opex − EBIT), TAC del consenso de Services |
| BL-GEN-3 | Bottom Line ▸ General ▸ Op. income → net income | ✅ | 2026-10-26 | SAB | | OI&E en ámbar; Normalized grava solo la utilidad operativa a la tasa efectiva |
| BL-GEN-4 | Bottom Line ▸ General ▸ Stock-based compensation | ✅ | 2026-10-26 | SAB | | solo Dilution: Alphabet no divulga SBC por línea (10-K) |
| BL-GEN-5 | Bottom Line ▸ General ▸ Expense lines | ✅ | 2026-10-26 | SAB | | 5 pestañas (TAC · otros costos de ventas · R&D · S&M · G&A); definiciones verbatim 10-K FY2025; drivers 10-K/10-Q 2T26; citas de las transcripciones oficiales; Unit Economics de Dani (#19, #21, #22) en TAC y otros costos |
| BL-SEG | Bottom Line ▸ Segments | ✅ | 2026-10-26 | SAB | | copia del bloque de segmentos de `meta-bl.js` en `googl-bl.js`; Services · Cloud · Other Bets + Alphabet-level como línea propia (suman la utilidad consolidada); consenso BBG de utilidad por segmento; Summit solo en Consolidated (el modelo no proyecta utilidad por segmento); By segment con años del consenso + By cost (compensación · otros, Services y Cloud, 10-K/10-Q); 3 fichas; escalera de margen de Cloud de Dani (#31) en la nota de Cloud |
| BL-SPLC | Bottom Line ▸ Supply Chain | ✅ | 2026-10-26 | SAB | | `js/overviews/googl-splc.js` (copia de `meta-splc.js`) con las cifras SPLC de Dani tal cual (SAB: export del 22-jul-2026 no ubicado); KPIs · cadena 1 capex (6 tarjetas) · cadena 2 contenido (`.rs-ft`) · quién necesita a quién · geografía · riesgos y clientes rastreables (mapa #23–#28) |
| VA-HIST | Valuation ▸ Historic Multiple | ✅ | 2026-10-26 | SAB | | `googl-histmult.js` (copia de `meta-histmult.js`) + `googl-histmult-data.js` (XBRL 1T19–2T26, depreciación 2019–1T23 de los flujos de cada 10-Q/10-K, acciones pre-split ×20); precio en vivo (get-market-history ya responde); P/E solo trailing ex-OI&E (sin P/E forward, deshabilitado con razón); EV/EBITDA ajustado fwd/trail; FY+3 deshabilitado |
| VA-PEERS | Valuation ▸ Peers | ✅ | 2026-10-26 | SAB | | el mapa de OV-6 (estado compartido) + tabla abierta con múltiplos en vivo; callout de Dani (#43) → pregunta del lede; tabla sembrada de Dani reemplazada; EPS de Alphabet ex-OI&E ($8.81, sin P/E forward) también en OV-6 por decisión de SAB |
| VA-TM | Valuation ▸ Target Multiple / PEG | ✅ | 2026-10-26 | SAB | | `googl-target-multiple.js` (copia de `tsm-target-multiple.js`) + `googl-target-multiple-data.js` congelado del MCP (snapshots 28-jul y 6-ago; 23-jul excluido): EV/EBITDA 12.7× y P/E 21.3×→24.0× FY2027, PT $318.50/$317.53 → $344.60/$391.52; duda abierta: el PT de P/E implica EPS $16.31 vs EARNINGS÷SHARES $15.96; deuda neta Live del 10-Q 2T26 |
| VA-SUB | Valuation ▸ Submit History | 👀 | 2026-10-28 | | | motor `js/submits.js` + `js/submits-data/googl.js` congelado del MCP (submits 28-jul y 6-ago; 23-jul fuera, como en todo el perfil): escalón del PT por submit, abre en P/E (21.3× → 24.0× FY2027, $317.53 → $391.52), precio Massive en vivo; tablas Submit detail + What the target was built on (CoE 17.6%/17.3%, crecimiento implícito 12.9%/13.2%). Revisión §6.3: PT÷FV igual en los dos métodos (1.066/1.067 y 1.071/1.072) → el MCP leyó las celdas correctas |
| VA-SENS | Valuation ▸ Sensitivity Analysis | ✅ | 2026-10-26 | SAB | | `googl-sensitivity.js` (copia de `meta-sensitivity.js`) + `googl-sensitivity-data.js` (Summit 08-06 congelado: Services · Cloud · Other Bets, margen operativo consolidado, EBITDA ajustado); múltiplo de salida = el del modelo (12.7× / 24.0× FY2027); Street = consenso BBG por segmento; SENS sembrado de Dani (#42) reemplazado |
| MG-TEAM | Management ▸ Executives & Board | ✅ | 2026-10-26 | SAB | | datos a `googl-mgmt-data.js` (motor `management.js`, brand = SUMMIT_CAT[0]); 8 ejecutivos (los 7 de Dani + Kent Walker); consejo de 10 verificado contra el DEF 14A 2026 (Page/Brin desde 1998, Doerr desde 1999; Porat President & CIO desde sep-2023); 3 celdas de gobierno; línea de Kurian al 2T26 |
| MG-OWN | Management ▸ Ownership | ✅ | 2026-10-26 | SAB | | `googl-own.js` (copia de `meta-own.js`): tabla de los 14 insiders del DEF 14A 2026 (Clase A, Clase B, % del voto, valor en vivo de acciones con voto) + tabla de las 3 clases (10-Q 2T26) + >5% (BlackRock; Vanguard en nota) + hueco Fiscal.ai; sin selector de fondos (no hay export HDS); barras aproximadas de Dani (#47) reemplazadas |
| MG-GOV | Management ▸ Governance & SBC | ✅ | 2026-10-26 | SAB | | `googl-gov.js`: 4 KPIs (7/10 independientes, SBC $25.0B = 6.2% del ingreso, recompras $45.4B, dividendos $10.0B FY2025) + tabla "How Alphabet is governed" (las 6 filas de Dani #48 verificadas + comités; recompras/dividendo de #44) + puntero a BL ▸ SBC; sin repetir % de voto de Ownership; CSS .gov-tbl nuevo |
| MG-TRACK | Management ▸ Track Record | ✅ | 2026-10-26 | SAB | | `googl-track.js` (copia de `tsm-mgmt.js` tsmTrackBody): 8 líderes SIN calificaciones (SAB, como TSM) — At Alphabet / Context con cifras reportadas del portal y citas oficiales; modal `gtrk:`; "The bench, in one line" del callout de Dani (#51); las 7 calificaciones "delivering" de Dani (#49) quedan registradas aquí, no se muestran |
| MISC-comp | Miscellaneous ▸ Competitive Position | ✅ | 2026-10-26 | SAB | | `googl-comp.js` (copia de `meta-comp.js`): lede = OV-3 "The edge"; 5 cuestionamientos (arenas de Dani #17) con evidencia en ambos sentidos; tablas Cloud (Google Cloud, AWS, Intelligent Cloud, OCI) y publicidad (Google, Meta, Amazon, Microsoft) del último trimestre de cada filing; sin cuota de mercado (sin fuente primaria); mapa de Dani (#18) no se repite (vive en VA-PEERS) |
| MISC-capex | Miscellaneous ▸ Capex & Depreciation | ✅ | 2026-10-27 | SAB | | `googl-misc.js` + `googl-misc-data.js` (copia de `meta-misc.js` capex): capex/depreciación real + Summit 2026-08-06 (anual y trimestral, con depreciación trimestral), 10 revisiones de guía, 4 vías de pago, compromisos fuera del capex ($63B → $225B → $940B), PP&E por línea, leases, Intersect, financiamiento; capex = Results; reemplaza el panel #44 de Dani |
| MISC-capacity | Miscellaneous ▸ Capacity → Revenue | ✅ | 2026-10-27 | SAB | | `googl-misc.js` (copia de `metaCapacityBody`): cadena de 5 eslabones (se corta en capacidad: sin MW/GW/TPUs), backlog vs ingreso Cloud, cobertura del backlog firmado vs consenso/Summit con control de conversión (50%), 68 data centers por país |
| MISC-strategy | Miscellaneous ▸ Strategy | ✅ | 2026-10-27 | SAB | | `googlStrategyBody` (copia de `metaStrategyBody`): ciclo "full stack" de 5 pasos (Dani #40) con cifras de las transcripciones oficiales + 4 apuestas en tabla ("broaden the box"); sin Nobel / 15 productos / ⅔–⅓ (sin fuente) |
| MISC-tam | Miscellaneous ▸ TAM | ✅ | 2026-10-27 | SAB | | `googlTamBody`: publicidad (WPP Media, 16-jun-2026) y cloud (Synergy, 30-jul-2026) con la cifra de Alphabet al lado (de Results); fronteras sin tamaño; sin Gartner; fuera "~$700B"/"$700B+" y el callout de tesis |
| F-FINAL | Cierre y entrega | ✅ | 2026-10-27 | SAB | | recorrido completo sin errores; código muerto de Dani borrado (googl.js 2,956 → 1,022 líneas); gráficas de Misc a la norma §17.2; mapa conciliado (#14 ◐) |


> Desde el 15 oct 2026 EV-EST, VA-TM y VA-SENS se construyen con Summit congelado del MCP (regla 10);
> EV-EST necesita ≥ 2 snapshots. Cada `MISC-<clave>` aprobada reemplaza la fila MISC; en MISC siempre se
> proponen `MISC-comp` y, si aplica, `MISC-capacity` (playbook §15b).

## 3. Decisiones del analista

<!-- Solo se agrega. Si una decisión cambia, nueva línea que cita la anterior. -->
- 2026-10-26 · F0 · Modo B (reordenar el perfil de DOAA351); Summit se congela del MCP (ingestado hoy) — SAB
- 2026-10-26 · OV-4 · §21 "texto corrido en negro (#111418)" aplica a TODO el perfil, Overview incluido (no solo Earnings); títulos navy, rótulos/fuentes gris. Las unidades del Deep Dive lo traen al construirse — SAB. ⚑ Para la guía: §21 lo dice como regla general pero solo se aplicó en META ▸ Earnings/Supply Chain; proponer en rama chore/ que §8 (Overview) lo diga explícito.
- 2026-10-26 · B2 · Misc = TAM · Competitive position · Strategy · Capex & Depreciation; Guidance se disuelve en Notes (ganchos Promise); se quitan el botón IR y la intro de Earnings; se fusionan los duplicados #18, #41, #50 — SAB
- 2026-10-26 · F0-SM · Periodos reportados solo de `actuals_history`; trimestres Summit solo del FY corriente (2026), años siguientes solo anual; Cloud 2026 = suma de trimestres; utilidad por segmento Summit = "Summit (discontinued)" (puede volver); STOCK_PAYMENT = proceeds from stock issuance — SAB
- 2026-10-28 · VA-SUB · Submit History con el motor común (mismo diseño que SPOT: P/E por default, azul Summit `--steel`, precio gris claro, fair value apagado); se construye en esta rama para que vaya en el mismo PR que GOOGL — SAB

## 4. Excepciones aceptadas

<!-- Cada FAIL de la autoauditoría que el analista decidió dejar. -->
- AAAA-MM-DD · <ID> · <qué regla> — <por qué se acepta> — <quién>

## 5. Mapa de reubicación (solo modo B)

Conteo de control (piezas originales): **51** (B1, 2026-10-26, leído de `js/overviews/googl.js` @ `95c00e0`; el
conteo visual en el portal lo confirma SAB). Además, datos sin pieza visible propia: `results-data/googl.js`,
`results-data/googl-setup.js`, `docs/calls/GOOGL*.md` (4T23–2T26), filas de la Watch List en Supabase
(`company_themes`), y código muerto (`gddEmpty`, el `ceResultsPending` de Estimates).

Destinos aprobados por SAB el 2026-10-26 (B2), incluidas las fusiones #18, #41, #50 y quitar #32. Estado ⬜ = destino aprobado, falta moverla.

| # | Pieza original (archivo:función) | Destino (sección ▸ sub-tab ▸ bloque) | Cómo | Estado |
|---|---|---|---|---|
| 1 | `stdOverviewBody` · Key Facts `STD_FACTS` (10 celdas) | Overview ▸ OV-1 | se rehace a la norma: CEO "· joined 2004 · CEO since Dec 2019"; market cap con estado (loading/live/unavailable) | ✅ |
| 2 | Descripción `UB_LEDE` (4 oraciones, lista productos y control fundador) | Overview ▸ OV-2 | 2–4 oraciones sin lista de segmentos; el control fundador pasa a MG-OWN, el "AI stack" a OV-3 The edge | ✅ |
| 3 | Cuadrante 2×2 `STD_BIZ` | Overview ▸ OV-3 | se ajusta (≤ 30 palabras, How it earns con el dato de utilidad por segmento) | ✅ |
| 4 | How Alphabet makes money `GMM_SEG`/`GMM_GEO`/`REV_DEFS` (3 segmentos, 4 regiones) | Overview ▸ OV-4 | barras en grises; acordeones con "The numbers"; "The revenue lines" del 10-K (Search · YouTube · Network · Subs · Cloud); geografía con hedging; las cifras de `econ` se conservan | ✅ |
| 5 | Products & platforms `G_PRODUCTS` (8 familias) | Overview ▸ OV-5 | se conserva; revisar texto (Wiz ya cerró o no) | ✅ |
| 6 | Peer map `G_PEERS` (MSFT, AAPL, AMZN, META; múltiplos y mc sembrados) | Overview ▸ OV-6 | denominadores (10-K / BBG) + `liveQuote` (regla 10); peers los decide SAB; `why` se conserva | ✅ |
| 7 | Timeline `TIMELINE` (14 hitos) | Overview ▸ OV-7 | se conserva; revisar regla de hitos (Motorola, dividendo, US v. Google, Wiz, $3T) | ✅ |
| 8 | Pie `OV_SOURCES` | Overview ▸ OV-F | se rehace sin "seeded" | ✅ |
| 9 | Top Line ▸ Segments · tira de 6 KPIs (`ddStat`: 5T+ búsquedas, 15 productos ≥500M, 350M subs, backlog $462B, 16B tokens/min…) | Top Line ▸ TL-SEG ▸ "KPIs the company publishes" (cada KPI en su segmento) | se reparte por segmento, con fuente y trimestre | ◐ backlog → KPI de Cloud (TL-SEG ✅); "trillions of searches" → OV-5; 190.8K empleados → OV-1; 15 productos ≥500M, 350M subs y 16B tokens/min (datos de llamadas) → semilla de EV-NOTES con su trimestre |
| 10 | Top Line ▸ Segments · lede "One machine, three reported segments" | Top Line ▸ TL-GEN ▸ tarjetas (`brief`) / "Our read on it" | el texto pasa a `brief`/`summary` | ✅ |
| 11 | Top Line ▸ Segments · gráfica `gChartSeg` ingreso por segmento FY19–25 (`FIN`) | Top Line ▸ TL-GEN ▸ "How revenue divides" (motor) | reemplazada por el motor; los datos FY19–25 al dataset de Results | ◐ FY2021–25 en Results ✅; FY2019–20 (de Dani, en $B redondeados, sin fuente y anteriores a la reexpresión de segmentos de 2021) **no** se llevan hasta cotejarlos con los 10-K — la constante `FIN` sigue en el código |
| 12 | Top Line ▸ Segments · tarjetas `DD_SEGS` (3, con modal) | Top Line ▸ TL-GEN tarjetas + TL-SEG "What it is" / "What it sells" | el texto de cada modal se reparte en `brief`, `sells`, `products` | ◐ lo descriptivo → `brief`/`sells`/`products` ✅; las cifras y lecturas de llamadas del modal (Search +10→+19%, escalera de margen Cloud, Waymo 500K viajes/semana y ronda de $16B, Verily/GFiber) → semilla de EV-NOTES con su trimestre; `DD_SEGS` sigue en el código |
| 13 | Top Line ▸ Customers · tarjetas `DD_CUST` (4 bolsas de demanda, con modal) | Top Line ▸ TL-CUS ▸ "The customer classes it names" + sección 5 (por clase) | se conserva el texto; citas FILING verbatim donde el 10-K las da | ◐ clases con cita 10-K ✅; las cifras de llamadas de cada modal (retail #1, >30% del gasto en campañas con IA, 120K+ empresas en Gemini, 350M subs, 13M desarrolladores…) → semilla de EV-NOTES y, cuando exista el motor, sección 5; `DD_CUST` sigue en el código |
| 14 | Top Line ▸ Customers · callout "cross-pool read" | Top Line ▸ TL-CUS ▸ nota de la sección 5 | texto a nota (OURS) | ◐ espera la sección 5 del motor; el texto sigue en el código |
| 15 | Top Line ▸ TAM · lede + 3 tarjetas (Ads, Cloud & AI, frontiers) | Miscellaneous ▸ MISC-tam (propuesta) | sin equivalente en AMZN; sub-tab propia de Misc | ✅ |
| 16 | Top Line ▸ TAM · callout "one-line TAM thesis" | Miscellaneous ▸ MISC-tam | va con #15 | ✅ |
| 17 | Top Line ▸ Industry Analysis · lede + `DD_ARENA` (5 arenas, con modal) | Miscellaneous ▸ MISC-comp (Competitive position) | cada arena = un cuestionamiento con evidencia a favor/en contra | ✅ |
| 18 | Top Line ▸ Industry Analysis · segundo mapa de peers `stdPeerScatter('ind')` | fusionada con #6 (OV-6 / VA-PEERS) | duplicado exacto del mapa (requiere aprobación específica) | ✅ |
| 19 | Bottom Line ▸ Unit Economics · lede "The unit is a query" | Bottom Line ▸ BL-GEN-5 ▸ Cost of revenues ▸ Key figures / Effect on margin | texto a la línea de costo | ✅ |
| 20 | Unit Economics · cadena de ingreso (queries → % comercial → subasta → paid clicks × CPC) | Top Line ▸ TL-SEG Search ▸ "Revenue interactions" (precio × volumen: paid clicks × CPC) | identidad con datos del 10-K/10-Q (crecimientos YoY) | ✅ |
| 21 | Unit Economics · curva de costo de servir (4 barras, cifras de management) | Bottom Line ▸ BL-GEN-5 ▸ Cost of revenues ▸ Composition and drivers + Management commentary | citas verbatim con trimestre | ✅ |
| 22 | Unit Economics · tarjetas TAC y Depreciación | Bottom Line ▸ BL-GEN-5 ▸ Cost of revenues (TAC y depreciación como componentes) | componentes del costo de ventas (10-K los da) | ✅ |
| 23 | Bottom Line ▸ Supply Chain · lede + tira de KPIs (728 proveedores…) | Bottom Line ▸ BL-SPLC ▸ KPIs | formato de la guía (copia de `meta-splc.js`) | ✅ |
| 24 | Supply Chain · cadena de capex `SPLC_INFRA` (6 tarjetas con modal) | Bottom Line ▸ BL-SPLC ▸ Cadena 1 | se conserva la lectura; sin colores por proveedor | ✅ |
| 25 | Supply Chain · tabla de contenido `SPLC_CONTENT` | Bottom Line ▸ BL-SPLC ▸ Cadena 2 (`.rs-ft`) | tabla al componente de la guía | ✅ |
| 26 | Supply Chain · dependencia `SPLC_DEP` (8 barras) | Bottom Line ▸ BL-SPLC ▸ "Who needs whom" | se conserva | ✅ |
| 27 | Supply Chain · callout "asymmetry" | Bottom Line ▸ BL-SPLC ▸ nota | texto a nota | ✅ |
| 28 | Supply Chain · tarjetas "traceable customer" y "geography" | BL-SPLC ▸ Geografía + TL-CUS ▸ "Who has said they buy" | se reparten | ✅ |
| 29 | Bottom Line ▸ Margins · lede "Two margin stories" | Bottom Line ▸ BL-GEN-1 ▸ nota | texto a nota | ✅ |
| 30 | Margins · gráfica `gChartMargin` margen grupo y Services FY19–25 + nota de one-offs | Bottom Line ▸ BL-GEN-1 (grupo) + BL-SEG ▸ Profit by segment (Services) | reemplazada por los motores; la nota de one-offs (multa CE 3T25…) a la `note` | ✅ |
| 31 | Margins · gráfica `gChartCloudM` escalera de margen Cloud 1Q23–1Q26 | Bottom Line ▸ BL-SEG ▸ Profit by segment (Cloud, trimestral) | reemplazada; la leyenda "2.6% → 32.9%" a la nota | ✅ |
| 32 | Evolution ▸ Earnings · botón IR + intro "the decision layer" | fusionada con la cabecera del perfil (IR/EDGAR en `headerSources`) | se quita por regla de SAB (META, 2026-10-21) — pide aprobación específica | ✅ (quitados en EV-SET) |
| 33 | Earnings ▸ Setup (`ceSetupBody`, `CE_CONS` tecleado, gráficas Setup, `ceAnnualBody` con `GOOGL_SETUP`) | Evolution ▸ EV-SET | copia de `meta-ce.js`; `CE_CONS` armado al cargar desde Results | ✅ (el archivo de Dani pasa a `googl-ce-data.js`; ingreso/op. income/EPS/capex/segmentos se rehacen al cargar desde Results) |
| 34 | Earnings ▸ Watch List (motor `watchlist.js`, filas en Supabase `company_themes`) | Evolution ▸ EV-NOTES (Watch List debajo del theme record, como META) | se conservan las filas guardadas; `palette:'summit'` | ✅ (21 filas visibles) |
| 35 | Earnings ▸ theme record `callsBody` / `GOOGL_THEMES` (9 temas, 11 llamadas) | Evolution ▸ EV-NOTES (semilla `themes-data/googl.js`) | temas = segmentos/ejes; ganchos cerrados; revisar la copia en Supabase antes de re-sembrar | ✅ (no había registro guardado en Supabase: el viejo vivía solo en memoria) |
| 36 | Earnings ▸ Post-Results (`CALL_EARNINGS`: 2T26, 1T26, 4T25 reportados; 3T26 upcoming) | Evolution ▸ EV-POST | formato de la guía (citas verbatim de `docs/calls/`); se agrega el 3T26 cuando reporte | ✅ (Call Summary de las transcripciones oficiales; `CALL_EARNINGS` de Dani borrado en F-FINAL) |
| 37 | Evolution ▸ Results (`results-data/googl.js`) | Evolution ▸ EV-RES | dataset rehecho: base del consenso (duda 7), Summit congelado | ✅ |
| 38 | Evolution ▸ Estimates (vacío → "pending") | Evolution ▸ EV-EST | se construye con los 3 snapshots | ✅ (2 snapshots: el 23-jul queda fuera por decisión de SAB) |
| 39 | Evolution ▸ Guidance · `G_GUIDE` (5 compromisos, con modal) + callout "what they will NOT give you" | Evolution ▸ EV-NOTES (cada compromiso = gancho "Promise — reconcile") + la frase "no numeric guidance" a la nota de Results | sin sub-tab Guidance (no existe en la estructura) | ✅ |
| 40 | Evolution ▸ Strategy · ciclo de 5 pasos + callout "broaden the box" | Miscellaneous ▸ MISC-strategy (como META) | se conserva | ✅ |
| 41 | Evolution ▸ Timeline (`timelineBody`, el mismo de OV-7) | fusionada con #7 (OV-7) | duplicado exacto (requiere aprobación específica) | ✅ |
| 42 | Valuation ▸ Sensitivity (`SENS`: EBITDA $235B y 15× sembrados, sliders) | Valuation ▸ VA-SENS | se rehace con Summit congelado (12.7× / 24.0× del modelo); el texto a la nota | ✅ |
| 43 | Valuation ▸ Peers · tabla de 5 con múltiplos sembrados + callout | Valuation ▸ VA-PEERS ("The numbers behind the map") | múltiplos en vivo; el callout al lede | ✅ |
| 44 | Valuation ▸ Capital Allocation · gráfica `gChartCap` + 4 tarjetas (capex, buybacks, dividendo, deuda) | Miscellaneous ▸ MISC-capex (Capex & Depreciation, como AMZN/META) + MG-OWN ▸ "Capital returned" (buybacks, dividendo) | se reparte | ✅ |
| 45 | Valuation ▸ Financials · gráfica `gChartFin` FY19–25 + tabla FY23–25 | Evolution ▸ EV-RES (anual) + Bottom Line ▸ BL-GEN-1 | reemplazada por los motores; la columna "read" a las notas | ✅ |
| 46 | Management ▸ Executives & Board (`GOOGL_MGMT`: 7 ejecutivos, 10 consejeros) | Management ▸ MG-TEAM | se conserva; `brand` → token Summit | ✅ |
| 47 | Management ▸ Ownership (barras por clase y votos, "approximate") | Management ▸ MG-OWN (tabla estructurada + top holders) | cifras con documento (DEF 14A 2026) | ✅ |
| 48 | Management ▸ Governance (6 filas) | Management ▸ MG-GOV | se conserva; sin repetir KPIs de Ownership | ✅ |
| 49 | Management ▸ Track Record (`G_TRACK`, 7 tarjetas con modal) | Management ▸ MG-TRACK | calificaciones las decide SAB | ✅ |
| 50 | Track Record · franja "Independent board" (7 consejeros) | fusionada con #46 (consejo en MG-TEAM) | duplicado (requiere aprobación específica) | ✅ |
| 51 | Track Record · callout "the caveat" | Management ▸ MG-TRACK ▸ "The bench, in one line" | se conserva | ✅ |

## 6. Bloqueos y preguntas abiertas

| Desde | Unidad | Qué falta | Quién lo consigue | Estado |
|---|---|---|---|---|
| 2026-10-26 | F0-SM, EV-EST, VA-TM, VA-SENS + series Summit | GOOGL no estaba ingestado en el MCP de Summit | SAB | ✅ cerrado 2026-10-26 (ingestado, 3 snapshots) |
| 2026-10-26 | BL-SPLC, TL-CUS tabla | Ubicar el export SPLC de GOOGL del 22-Jul-2026 que usó Dani | SAB / DOAA351 | cerrado: SAB decidió usar las cifras de Dani tal cual |
| 2026-10-26 | TL-CUS ▸ sección 5 | "What each top customer buys" espera el motor (`segments.js` aún no dibuja `customers.buys`) — PR de motor aparte | Claude (PR de motor) | abierto |
| 2026-10-26 | TL-* / OV-4 | El motor escribe fijo "net sales" (Alphabet dice "revenue") — generalizar en PR de motor aparte (playbook §10) | Claude (PR de motor) | abierto |
| 2026-10-26 | EV-NOTES | Llevar a la semilla de Notes, con trimestre, las cifras de llamadas de `DD_SEGS`, `DD_CUST` y la tira de KPIs (mapa #9, #12, #13) | Claude | cerrado (semilla v2) |

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

## 7. Historial de aprobaciones

<!-- Solo se agrega, la más reciente al final. Una entrada por cada paso por la compuerta. -->
### 2026-10-26 · F0 Inventario de datos — APROBADA
- Qué se mostró: tabla de fuentes (10-K FY2025, BBG 30 snapshots al 2026-09-08, get-market-history desplegada, transcripciones 4T23–2T26, Fiscal.ai fuera de plan, SPLC sin export, fotos 7).
- Fuentes: MCP Summit (`list_dcf_models`, `list_snapshots`, `get_valuation_history`), `inspect_matrix.py GOOGL`, repo.
- Cambios pedidos / decisiones: Summit faltaba en el MCP; SAB lo dio de alta el mismo día → verificado: 3 snapshots + valuación limpia.
- Ojo: en `results-data/googl.js` el consenso de ingreso parece bajo vs actuals (2T26 119,796 vs 99,711) — revisar en EV-RES-DATA.

### 2026-10-26 · F0-SM Mapa de métricas Summit — APROBADA
- Qué se mostró: tabla de 62 etiquetas (33 core · 13 segment · 4 kpi · 4 consensus · 8 ignore), cuadre de cada core/segment contra el 10-K FY25 (Δ0), valuación de los 3 snapshots, 7 dudas; `js/summit-map/googl.js` sin números.
- Fuentes: MCP Summit (`list_metrics`, `get_fundamentals` 2026-08-06, `get_valuation_history`); EDGAR XBRL companyfacts + texto del 10-K (acc. 0001652044-26-000018).
- Autoauditoría: ✔ las 62 etiquetas en el mapa (incl. ignore) · ✔ cuadre o razón en cada core/segment · ✔ unidades revisadas (TAX_RATE decimal, SHARES acciones M) · ✔ valuación revisada (métodos, target_year, flags) · ✔ ningún número en el archivo.
- Cambios pedidos / decisiones: respuestas de SAB a las dudas 1–5 (ver §1b y §3).

### 2026-10-26 · B1 Inventario de contenido existente — APROBADA
- Qué se mostró: 51 piezas visibles de `js/overviews/googl.js` (8 Overview, 43 Deep Dive en 5 secciones / 21 sub-tabs) + datos sin pieza propia.
- Pendiente: ubicar el export SPLC del 22-Jul-2026 (Bloqueos).

### 2026-10-26 · B2 Mapa de reubicación — APROBADA
- Qué se mostró: destino por pieza en la estructura AMZN (§5), con Misc nuevo y fusiones de duplicados.
- Decisiones: ver §3.

### 2026-10-26 · F1 Esqueleto + vista previa — APROBADA
- Qué se mostró: Deep Dive con 6 secciones AMZN; 16 sub-tabs con los paneles viejos en su destino B2; prueba en navegador sin errores (11 gráficas).
- Pregunta de SAB: por qué faltan TL Segments/Other, BL Segments, Estimates — respuesta: regla 5 (se agregan con su unidad; dependen de EV-RES-DATA). SAB eligió seguir el orden de la guía (Overview primero).

### 2026-10-26 · OV-1 Key Facts — APROBADA
- Qué se mostró: 10 celdas (Listing, HQ, Incorporated, SEC filer, Founded, IPO, CEO, Employees, Dividend, Market cap live $3.90T · Oct 26, 2026).
- Fuentes: 10-K FY2025 (portada, Item 1: 190,820 empleados al 31-dic-2025); EDGAR (domestic filer); Massive (market cap).
- Autoauditoría: ✔ 10 celdas · ✔ CEO con antigüedad · ✔ market cap con estado y fecha · ✔ filer en EDGAR · ✔ sin celdas vacías · ✔ acento --steel (se quitó la regla en línea .stdkf con el azul de Google, A1 parcial).
- Dato movido: "first ever in 2024" del dividendo queda en el Timeline (OV-7).

### 2026-10-26 · OV-2 Descripción — APROBADA
- Qué se mostró: 3 oraciones, 72 palabras, parafraseadas del 10-K FY2025 Item 1.
- Autoauditoría: ✔ 2–4 oraciones / 50–80 palabras · ✔ sin cifras ni adjetivos promocionales · ✔ sin tesis · ✔ no repite el 2×2.
- Movido: control fundador → MG-OWN (ya está ahí); AI stack → OV-3 The edge (ya está ahí); "billions of users" se quita (cifra sin fuente; las cifras van a los KPIs de TL-SEG).

### 2026-10-26 · OV-3 Cuadrante 2×2 — APROBADA
- Qué se mostró: What it sells y Who buys it sin cambios; How it earns con la mezcla FY2025 + "Services earns 10× Cloud's operating income ($139.4B vs $13.9B)"; The edge neutral.
- Fuentes: 10-K FY2025 (ingresos por tipo; nota de segmentos).
- Autoauditoría: ✔ ≤ 30 palabras (24 · 16 · 29 · 30) · ✔ cifras solo en How it earns, con año · ✔ títulos en navy (se quitaron las reglas .q2 en línea con el azul de Google; `.ov-googl` agregado a la regla `:is(...) .q2-k` de css/overview.css).
- Decisión: The edge = versión neutral (sin "unmatched") — SAB.

### 2026-10-26 · OV-4 How Alphabet makes money — APROBADA
- Qué se mostró: Segments | Geography en grises por tamaño; acordeones Services · Cloud · Other Bets (desc de Dani sin cifras) con "The numbers" del 10-K; nuevo "The revenue lines" (6 líneas); leyenda de cierre con op. income, net income, EPS y el OI&E de $29.8B.
- Fuentes: 10-K FY2025 (MD&A ingresos por tipo; Nota 2 geografía; nota de segmentos; estado de resultados); 4Q25 Cloud del 8-K 4Q25.
- Autoauditoría: ✔ cuadre segmentos = geografía = 402,836 (hedging −127 en la leyenda) · ✔ desc sin cifras · ✔ grises sin color por segmento · ✔ geografía de mayor a menor · ✔ pastillas por clase (sin estilos en línea) · ✔ se quitaron las reglas en línea .acc/.famd/.ov-row (A1).
- Cambio pedido por SAB al aprobar: **los colores de texto no seguían §21** (texto corrido en negro #111418). Aplicado a todo el Overview de GOOGL: lede, valores, celdas del 2×2, descripciones, "The numbers", leyendas, barras, productos y timeline en #111418; títulos en navy; rótulos y fuentes en gris (`css/overview.css`, regla `.ov-googl :is(...)`). Afecta también a OV-1…OV-3 ya aprobadas (solo color).

### 2026-10-26 · OV-5 Products & platforms — APROBADA
- Qué se mostró: 8 familias con modal; Cloud con "TPU systems" (venta de sistemas TPU, 10-Q 2T26 Nota 2) y Security con Wiz cerrada el 11-mar-2026 por $29.5B (10-Q 2T26 Nota 8); TPUs "Ironwood, seventh generation" (10-K); se quitaron opiniones sin fuente.
- Fuentes: 10-K FY2025 Item 1; 10-Q 2T26 (acc. 0001652044-26-000071); páginas de producto.
- Autoauditoría: ✔ dos niveles · ✔ línea de familia ≤ 6 palabras · ✔ producto 1–3 líneas · ✔ sin opinión/cifras sin fuente · ✔ modal probado en el portal.
- Pendiente para OV-7: el hito "Wiz agreed … subject to regulatory review" está desactualizado (cerró mar-2026); Intersect ($5.9B, mar-2026) a decidir.

### 2026-10-26 · OV-6 Competitors — the peer map — APROBADA
- Qué se mostró: mapa copiado de meta.js (denominadores + `liveQuote`), 6 nombres; en vivo 26-oct: P/E trailing GOOGL 29.4× · MSFT 29.6× · AMZN 34.7× · META 27.0× · AAPL 46.0× · ORCL 21.6×; forward solo GOOGL/AMZN/META.
- Fuentes: 10-K de cada uno vía EDGAR XBRL (MSFT FY2026 acc. 0001193125-26-323660; AAPL FY2025 acc. 0000320193-25-000079; ORCL FY2026 acc. 0001193125-26-277521; GOOGL/META/AMZN = mismos denominadores de `meta.js`); forward BBG FY2026 (8–10 sep 2026).
- Autoauditoría: ✔ P/E ⇄ EV/EBITDA y Forward/Trailing cambian los ejes (probado) · ✔ × y Add · ✔ ningún múltiplo ni market cap en el archivo · ✔ ejes del dato · ✔ sin `<style>` en línea (A1) · ✔ leyenda con fuente/fecha y años fiscales distintos.
- Avisos: (1) P/E forward de GOOGL 16.0× usa EPS BBG FY2026 GAAP $19.90 (probablemente con ganancias de inversiones) — se muestra tal cual el archivo; (2) ⚑ **META**: su `ME_PEERS` da a GOOGL `gf:6.9` (BBG neto de TAC ÷ GAAP); la base consistente es 26.8% — corregir en un PR de META. (3) Datos compartidos GOOGL/META/AMZN duplicados en dos perfiles (regla "un solo archivo"): proponer un módulo compartido de denominadores en un PR aparte.
- Decisión: peers = Dani + ORCL — SAB.

### 2026-10-26 · OV-7 Timeline — APROBADA
- Qué se mostró: 14 hitos en orden cronológico; Wiz pasa a "Mar 2026 · acquired for $29.5B" con modal (10-K: acuerdo $32.0B mar-2025; 10-Q 2T26 Nota 8: cierre 11-mar-2026); se quitaron opiniones (Android "dominant…moat", Motorola "fiasco", Bard "rushed", dividendo "coming-of-age", remedies "market had priced").
- Autoauditoría: ✔ orden estricto · ✔ una línea + viñetas en modal · ✔ un solo asunto legal · ✔ solo el último hito de $T · ✔ modales probados en el portal.
- Decisión: Intersect ($5.9B, mar-2026) **no** entra al Timeline; va a Misc ▸ Capex & Depreciation — SAB.

### 2026-10-26 · OV-F Pie del Overview — APROBADA
- Qué se mostró: un solo pie con 10-K FY2025 (5-feb-2026), 10-Q 2T26 (23-jul-2026), 8-K 4T25, IR, EDGAR; múltiplos en vivo con la fecha del consenso BBG. Sin "seeded".
- Autoauditoría: ✔ único pie del Overview · ✔ documentos primarios, no conectores · ✔ sin firma.
- Excepción aceptada (temporal): queda un `<style>` en línea en `stdOverviewBody` con estilos de los paneles viejos del Deep Dive (gdd-*, ov-callout…); las reglas del Overview ya se quitaron (A1). Se vacía al rehacer cada panel del Deep Dive.
- **Overview completo (OV-1…OV-7 + OV-F) ✅.**

### 2026-10-26 · EV-RES-DATA Dataset de Results — APROBADA
- Qué se mostró: tabla de cuadre (2Q24, 3Q25, 2Q26, FY2025 vs 10-Q/10-K: Δ0 salvo net income 2Q26, tomado del 10-Q 112,193 en lugar de BBG 112,107); cuadre trimestres↔año 2026 por fuente (Summit exacto; consenso ≤0.7%, normal por distinto panel de analistas); segmentos suman al total (Δ = hedging); `verify_preprint.py GOOGL cons`: 502 same / 0 changed / 0 blanked.
- Construcción: `scripts/consensus/map_googl.json` (por código BBG; `rev` = suma de segmentos) + `emit_matrix.py` con la opción nueva `"sum"` (opcional, no cambia a otras empresas) + `apply_matrix.py`; actuals de las columnas reportadas de BBG, cruzados contra EDGAR XBRL (108 celdas; las diferencias son todas 2016–2021, fuera de la ventana); Summit 2026-08-06 congelado (anual 2026–29; trimestral solo 3T–4T26); banda de guía de capex 2025 ($91–93B) y 2026 ($195–205B).
- Decisiones: consenso de ingreso = suma de segmentos; EPS/net income GAAP + "Model earnings (adj.)" aparte; extras: banda de capex, TAC, FCF — SAB.
- Decisión (reemplaza la respuesta a la duda 3 de F0-SM): **Cloud 2026 Summit = $117.5B** (real 1T–2T + modelo 3T–4T), no los $125.3B de los 4 trimestres del modelo — es el único que cuadra con el total del modelo — SAB.
- Fuera: la mitad Summit de `estMatrix` (modo "One Summit model file") — solo 3 snapshots, todos post-2T26; se puede agregar con `emit_summit_matrix.py` en EV-EST.

### 2026-10-26 · EV-RES Evolution ▸ Results — APROBADA
- Qué se mostró: el motor `results.js` con el dataset nuevo: selector "Estimates as of" (30 snapshots), Top Line y Margins con desplegables agrupados (Totals · Segments · Revenue lines / Company · Segments op. income), Summit 3T–4T26 y 2026–29, banda de capex, tarjeta de sorpresas, Road to the print, ⚑ No company guidance.
- Autoauditoría: ✔ desplegables agrupados · ✔ tablas colapsadas con encabezado · ✔ estimados marcados · ✔ sin intro · ✔ notas al pie · ✔ consola sin errores.
- Reemplaza la pieza #37 (y la #45 en su parte de Results anual).

### 2026-10-26 · TL-GEN · TL-SEG · TL-OTH · TL-CUS Top Line — APROBADAS
- Qué se mostró: motor `segments.js` con `js/segments-data/googl.js` (registrado en `js/segments.js` SEGMENTS_DATA): General (cita 10-K Item 1, 3 tarjetas, How revenue divides); Segments (Services · Cloud · Other Bets, definición verbatim de la Nota 15, productos con cita, KPIs paid clicks/CPC/impressions/CPI con definición verbatim + TAC rate derivado + backlog; precio × volumen Search y Network con chequeo 2T26; backlog × conversión en Cloud); Other (líneas de ingreso q/y + geografía anual 2023–25, Nota 2); Customers (sin concentración >10%, 3 clases con cita).
- Fuentes: 10-K FY2025 (acc. 0001652044-26-000018), 10-Q 2T26 (acc. 0001652044-26-000071), BBG (KPIs reportados, cuadrados contra el 10-Q 2T26), Results dataset.
- Autoauditoría: ✔ FILING solo verbatim con ubicación (notas y secciones cotejadas en el texto del 10-K) · ✔ series por puntero a Results · ✔ 4 sub-tabs sin errores (4 gráficas) · ✔ 4T23 vacío en KPIs (BBG no lo trae, regla 7).
- Pendientes: sección 4 (sin export SPLC) y sección 5 (motor) de Customers; bloque 5 de Segments con ⚑ hasta EV-NOTES; cifras de llamadas de Dani → EV-NOTES (mapa #9, #12, #13).

### 2026-10-26 · EV-EST Evolution ▸ Estimates — APROBADA
- Qué se mostró: bloque `evolution` en `results-data/googl.js` (Summit snapshots 2026-07-28 y 2026-08-06, FY2026–29; montado con `initResultsEvo('GOOGL')`); revisión grande = capex FY27–28 ($260.0B→$308.6B; $117.1B→$385.8B) y FCF FY28 (+$207.6B→−$35.4B).
- Decisiones: el snapshot 2026-07-23 queda fuera (guardado a medio actualizar: capex 2026 $77.9B, op. income vacío, FCF +$107.7B); consenso = EBITDA y utilidad guardados en el modelo, la utilidad con aviso de bases distintas (BBG GAAP vs modelo ajustado) — SAB. Ingreso sin consenso aquí (REV_BBG_EST es el headline mezclado).
- Autoauditoría: ✔ ticker pasado al montaje · ✔ `prior` FY2025 · ✔ rampa de un tono · ✔ ceros del modelo → null · ✔ consola sin errores.

### 2026-10-26 · EV-SET Earnings ▸ Setup — APROBADA · EV-NOTES Notes — APROBADA y reabierta
- Qué se mostró: `js/overviews/googl-ce.js` (copia de meta-ce.js con datos de Alphabet), `js/overviews/googl-ce-data.js` (archivo BBG de Dani + reconstrucción al cargar desde Results; ingreso = suma de segmentos), `js/results-data/googl-setup.js` (copia de meta-setup.js), `js/themes-data/googl.js` (18 hilos, 5 ejes; capex FY24/FY25 cerrados), registro en `js/segments.js` (THEME_SRC/THEME_SEG). 3T26 = mié 28-oct-2026 después del cierre (Alphabet IR, 6-oct-2026). Notas del Setup con citas textuales del CFO (llamada 2T26). Watch List de Dani: 21 filas.
- Autoauditoría: ✔ sin emojis ni tarjetas IR · ✔ texto en negro · ✔ Summit leído de Results · ✔ claves de notas = líneas del grid · ✔ consola sin errores.
- Decisiones (SAB): **Quartr ya no va a estar conectado** — las transcripciones salen de docs/calls y de la transcripción oficial de Alphabet IR; las notas de SAB están en `C:\Users\santi\Downloads\GOOGL (2).pdf` (GoodNotes) y pasan a ser la base de la semilla de Notes → EV-NOTES vuelve a revisión.

### 2026-10-26 · EV-NOTES Notes (v2) — APROBADA
- Qué se mostró: semilla `js/themes-data/googl.js` v2 (GOOGL_THEMES_V = 2): base = las notas a mano de SAB (25 páginas, 3T22 → 2T26, más GS Communacopia sep-2025 y sep-2026, Morgan Stanley TMT mar-2026 y Google I/O may-2026, cada evento en el trimestre calendario en que ocurrió y nombrado en la nota) + los hilos de Dani que las notas no cubren (con sus citas textuales). 24 hilos, 167 notas, 7 ganchos cerrados.
- Fuera de Notes: revisión propia de sep-2024 (múltiplos), primer de Gemini jun-2024, diagramas ad-tech de la CE, primers de DV360 y Ad Manager, notas de META/SMCI en las mismas páginas.
- Autoauditoría: ✔ cifras contrastadas con `results-data/googl.js` (10-K/10-Q); corregidas 4 (Cloud 4T24 +30%, Cloud 2T25 +32%, backlog 2T25 +38%, FCF $24.8B = 4T24) · ✔ parafraseo en inglés · ✔ ganchos cerrados con "Reconciled:" desde el 10-K · ✔ consola sin errores.

### 2026-10-26 · EV-POST Post-Results — APROBADA
- Qué se mostró: Call Summary de 4T25, 1T26 y 2T26 en `js/overviews/googl-ce-data.js` (9 prepared, 9 Q&A, 7 'Also on the call', 5 Propose Notes c/u). Fuente: transcripciones oficiales de Alphabet IR (PDF de s206.q4cdn.com, descargadas con permiso de SAB); `docs/calls/GOOGL*.md` no se cita (sin hablantes en 2T26, Q&A de 4T25 solo en notas, texto sin editar).
- Autoauditoría: ✔ cada cita comprobada contra el PDF oficial, incluido el hablante (56/57/57, 0 fallas) · ✔ sin texto generado ni emojis · ✔ consola sin errores.
- Correcciones que trajo la fuente oficial: el vehículo de Waymo es **Ojai** (no "Oasis"; corregido también en Notes y en `googl.js`; semilla de Notes → v3); la última analista de 2T26 es Shweta Khajuria (Wolfe Research).
- Ajuste (SAB): la tarjeta "Cloud backlog (RPO)" pasa a **"Revenue backlog (RPO)"** — $519.5B es el backlog total del 10-Q; Cloud = $513.9B.
- Pendiente: Call Summary de 3T26 después del reporte del 28-oct-2026.

### 2026-10-26 · BL-GEN-1…5 Bottom Line ▸ General — APROBADAS
- Qué se mostró: `js/overviews/googl-bl.js` (copia de `meta-bl.js`, parte General) + `js/overviews/googl-bl-data.js` (líneas de gasto de SEC XBRL FY2019–FY2025 y 1T23–2T26, TAC del MD&A, dives verbatim) + `js/overviews/googl-bbg.js` (export BBG, as of 9/8/2026, generado con `scripts/bbg_extract.py`). CSS: los selectores META de Bottom Line ahora incluyen `.ov-googl-dd` (sin reglas nuevas).
- Decisiones (SAB): consenso de ingreso = suma de segmentos BBG, sin consenso de utilidad bruta/costo de ventas (base mixta bruto/neto de TAC); Normalized = − OI&E después de impuestos a la tasa efectiva; costo de ventas en TAC + otros, luego R&D · S&M · G&A.
- Autoauditoría: ✔ las líneas cuadran con la utilidad operativa en cada periodo · ✔ sin años tecleados (pie y etiquetas derivados del dato) · ✔ EBITDA = op. income + D&A + SBC en BBG y Summit (la nota lo dice) · ✔ Summit "Model earnings (adj.)" (`mearn`) en Net · ✔ citas de llamadas contra las transcripciones oficiales · ✔ consola sin errores.
- Excepciones: sin vista "SBC by line" (Alphabet no la divulga). FY2019 dobla la línea "European Commission fines" ($1,697M) dentro de G&A.
- Reubicación: Dani #19/#21/#22 → dives de TAC y otros costos de ventas; #29/#30 → notas de márgenes; #45 → EV-RES + BL-GEN-1; #31 (escalera de margen de Cloud) → BL-SEG (pendiente).

### 2026-10-26 · BL-SEG Bottom Line ▸ Segments — APROBADA
- Qué se mostró: bloque de segmentos de `js/overviews/googl-bl.js` (copia del de `meta-bl.js`) + `GOOGL_SEG_Y/Q`, `GOOGL_SEG_ALLOC`, `GOOGL_SEG_DIVES` en `googl-bl-data.js` (10-K FY2025 Nota 15 y 10-Q 1T25–2T26; Q4 = año − nueve meses; rev − comp − other = oi en cada fila).
- Decisiones (SAB): Alphabet-level como su propia línea (sin ficha); puente By segment (con años del consenso) + By cost, sin sliders; Services por defecto.
- Autoauditoría: ✔ los cuatro renglones suman la utilidad consolidada · ✔ Summit solo en Consolidated (el modelo no proyecta utilidad por segmento; la nota lo dice) · ✔ citas oficiales · ✔ consola sin errores.
- Reubicación: Dani #31 (escalera de margen de Cloud) → nota de Profit by segment ▸ Google Cloud + ficha de Cloud.
- SPLC (SAB): usar los datos de Dani tal cual (export GOOGL US Equity, 22-jul-2026), reformateados al formato de la guía.

### 2026-10-26 · BL-SPLC Bottom Line ▸ Supply Chain — APROBADA
- Qué se mostró: `js/overviews/googl-splc.js` (copia de `meta-splc.js`) con las cifras SPLC que compiló DOAA351 (GOOGL US Equity, 22-jul-2026), reformateadas a la guía; estilos META extendidos a `.ov-googl-dd`. Modal `splc:` ahora resuelve con `googlSplcPop`.
- Decisión (SAB): usar los datos de Dani tal cual (el export no está en el repo ni en Drive); el pie lo dice.
- Reubicación: mapa #23–#28 completos (KPIs, cadena de capex, contenido, dependencia, asimetría → nota, clientes rastreables y geografía → tabla de riesgos/clientes y geografía). `SPLC_INFRA/CONTENT/DEP` y `splcBody` quedan en `googl.js` hasta F-FINAL.

### 2026-10-26 · VA-HIST Valuation ▸ Historic Multiple — APROBADA
- Qué se mostró: `js/overviews/googl-histmult.js` (copia de `meta-histmult.js`) + `js/overviews/googl-histmult-data.js` (1T19–2T26 de SEC XBRL; depreciación 2019–1T23 leída del estado de flujos de cada 10-Q/10-K porque es etiqueta propia; acciones pre-split ×20). Precio en vivo: `get-market-history` YA responde (26-oct-2026), sin aviso de pendiente.
- Decisiones (SAB): P/E solo trailing ex-OI&E (operativa × (1 − tasa) ÷ acciones); sin P/E forward (el consenso EPS de BBG es GAAP) — chip gris con la razón; EBITDA ajustado (operativa + depreciación + SBC) en forward y trailing.
- Autoauditoría: ✔ FY2025 EBITDA trimestral = BBG ($175,128M) · ✔ deuda = la que dijo la CFO · ✔ FY+3 deshabilitado con razón · ✔ consola sin errores.
- Nota: desde 2T26 la línea de caja incluye $87.1B de acciones negociables (CFO), lo dice el pie.

### 2026-10-26 · VA-PEERS Valuation ▸ Peers — APROBADA
- Qué se mostró: `googlValuationPeersBody()` en `googl.js` = lede + `stdPeerScatter('dd')` (mismo estado `G_SC` que OV-6, tabla "The numbers behind the map" abierta) + pie. P/E trailing hoy: Alphabet 29.4× GAAP vs Microsoft 29.6×, Meta 26.9×; promedio ex-Alphabet 31.8×.
- Decisión (SAB): el P/E de Alphabet en el mapa usa EPS ex-OI&E ($8.81 FY2025, de `googl-histmult-data.js`) y no tiene P/E forward (el consenso BBG es GAAP) → 36.0× trailing. Los demás quedan GAAP. Cambia también OV-6 (mismo `G_PEERS`): nota del mapa y chip "no forward P/E — Street EPS is GAAP, with the gains".

### 2026-10-26 · VA-TM Valuation ▸ Target Multiple / PEG — APROBADA
- Qué se mostró: `js/overviews/googl-target-multiple.js` (copia de `tsm-target-multiple.js`) + `googl-target-multiple-data.js` (MCP `get_valuation_history` + `get_fundamentals`, congelado 26-oct; snapshots 28-jul y 6-ago, 23-jul excluido). CSS .tm-* de TSM extendido a `.ov-googl-dd`.
- ❓ Duda para el autor del modelo: el PT por P/E ($391.52 a 24×) implica EPS FY2027 $16.31 vs EARNINGS ÷ SHARES $15.96 (acciones implícitas ~12,050M vs 12,317M); el EV/EBITDA cuadra con ~$6.0B de deuda neta. Se muestra como lo grabó el modelo.

### 2026-10-26 · VA-SENS Valuation ▸ Sensitivity Analysis — APROBADA
- Qué se mostró: `js/overviews/googl-sensitivity.js` (copia de `meta-sensitivity.js`) + `googl-sensitivity-data.js` (Summit 08-06 congelado; Cloud 2026 = $117.5B corregido; los tres segmentos suman REV salvo −$74M de hedging 2026). Múltiplo de salida = el del modelo (12.7× EV/EBITDA, 24.0× P/E, FY2027); puente fijo = D&A + SBC (EBITDA ajustado); deuda neta del 10-Q 2T26 (caja neta $142B, incluye $87.1B de acciones negociables — por eso la celda base difiere del PT del modelo, el pie lo dice).
- Reubicación: Dani #42 (SENS sembrado $235B × 15×) reemplazado; el pie lo nombra.

### 2026-10-26 · MG-TEAM Management ▸ Executives & Board — APROBADA
- Qué se mostró: `js/overviews/googl-mgmt-data.js` (datos de `GOOGL_MGMT` sacados de googl.js; motor `management.js`; brand = SUMMIT_CAT[0]). 8 ejecutivos (Dani + Kent Walker, del DEF 14A 2026); consejo de 10 contra el proxy (Page/Brin 1998, Doerr 1999 — Dani decía 2015/2016; Porat President & CIO sep-2023); 3 celdas de gobierno; Kurian al 2T26.
- Reubicación: #46 ✅; #50 (franja de consejo independiente del Track Record) fusionada aquí.

### 2026-10-26 · MG-OWN Management ▸ Ownership — APROBADA
- Qué se mostró: `js/overviews/googl-own.js` (copia de `meta-own.js`): 14 insiders del DEF 14A 2026 (al 6-abr-2026; Page 27.4% y Brin 25.3% del voto; grupo 54.3%), tabla de las 3 clases (10-Q 2T26: A 48.0% / B 6.8% / C 45.2% de las acciones; B = 58.7% del voto), >5% (BlackRock 6.1% de A; Vanguard en nota), hueco Fiscal.ai.
- Decisión (SAB): sin selector "Top holders" (no hay export HDS de GOOGL). Reubicación #47 ✅.

### 2026-10-26 · MG-GOV Management ▸ Governance & SBC — APROBADA
- Qué se mostró: `js/overviews/googl-gov.js`: 4 KPIs (7/10 independientes; SBC $25.0B = 6.2% del ingreso; recompras $45.4B; dividendos pagados $10.0B, FY2025, 10-K) + tabla "How Alphabet is governed" (6 filas de Dani #48 verificadas/actualizadas + comités del DEF 14A 2026; recompras y dividendo de #44) + puntero a BL ▸ General ▸ SBC. CSS nuevo `.ov-googl-dd .gov-tbl` (texto a la izquierda).
- Reubicación: #48 ✅; #44 → recompras/dividendo aquí (capex queda para MISC-capex).

### 2026-10-26 · MG-TRACK Management ▸ Track Record — APROBADA
- Qué se mostró: `js/overviews/googl-track.js` (copia de `tsm-mgmt.js` tsmTrackBody/Pop): 8 líderes sin calificaciones; "At Alphabet" con cifras reportadas que ya están en el portal, "Context" del DEF 14A 2026; citas verificadas contra las transcripciones oficiales; modal `gtrk:` en `wireModal`.
- Decisión (SAB): sin calificaciones (como TSM). Registro: Dani calificaba "delivering" a Pichai, Ashkenazi, Porat, Kurian, Hassabis, Schindler y Mohan (G_TRACK, julio 2026).
- Reubicación: #49 ✅ (sin calificaciones), #51 → "The bench, in one line".

- 2026-10-26 · MISC propuesta — SAB: Comp (Cloud + publicidad) · Capex · Capacity (incluirla mostrando dónde se corta) · Strategy · TAM (con fuentes citadas); orden Comp · Capex · Capacity · Strategy · TAM.

### 2026-10-26 · MISC-comp Miscellaneous ▸ Competitive Position — APROBADA
- Qué se mostró: `js/overviews/googl-comp.js` (copia de `meta-comp.js`; CSS .mcp-* de META extendido a `.ov-googl-dd`): lede = OV-3; 5 cuestionamientos (Dani #17) con evidencia en ambos sentidos; tabla Cloud (Google Cloud, AWS, Intelligent Cloud, OCI — 10-Q/8-K de cada empresa, último trimestre) y tabla de publicidad (Google, Meta, Amazon, Microsoft). Sin cuota de mercado. #18 (mapa) no se repite: vive en VA-PEERS.
- Pendiente para el 27-oct (SAB: "deja lo demás para mañana"): MISC-capex → MISC-capacity → MISC-strategy → MISC-tam, luego F-FINAL; reordenar las sub-tabs Comp · Capex · Capacity · Strategy · TAM al construir. Sin commit desde 2b3e034 (Comp + log + CSS).

### 2026-10-27 · MISC-capex Miscellaneous ▸ Capex & Depreciation — APROBADA
- Qué se mostró: `js/overviews/googl-misc.js` + `googl-misc-data.js` (copia de `meta-misc.js` capex; CSS `.mx-*` de META extendido a `.ov-googl-dd`): 4 KPIs (capex FY25 $91.4B; 1S26 $80.6B vs guía $195–205B; compras comprometidas $811B; PP&E neto $321.2B); gráfica capex + depreciación FY21–FY28E (Summit 2026-08-06) y 1T23–2T26 (con línea de depreciación trimestral); 10 revisiones de guía; 4 vías de pago; compromisos fuera del capex dic-24/dic-25/mar-26/jun-26 ($63B → $225B → $940B) + lo firmado después + definiciones de Alphabet; PP&E por línea (no en servicio $50.6B → $122.8B; vida útil de servidores 4 → 6 años en 2023); leases; Intersect; financiamiento (deuda LP $10.9B → $98.2B, bonos 1S26, acciones 2T26, recompras en cero en 1S26).
- Fuentes: 10-K FY2023/24/25, 10-Q 1T26/2T26 (EDGAR; SAB autorizó su email de Summit como contacto del User-Agent), llamadas 4T23–2T26, Summit 2026-08-06. Capex = Results. 3T26 pendiente (reporta el 28-oct).
- Sub-tabs Misc: Comp · Capex · Strategy · TAM (Capacity entra entre Capex y Strategy). Panel #44 de Dani (`capallocBody`/`gBuildCap`) eliminado; reubicación #44 ✅.

### 2026-10-27 · MISC-capacity Miscellaneous ▸ Capacity → Revenue — APROBADA
- Qué se mostró: `googl-misc.js` (`googlCapacityBody/Build`, copia de `metaCapacityBody`) + datos en `googl-misc-data.js`: cadena capex → capacidad → uso (tokens) → backlog → ingreso de Cloud, cortada en capacidad (Alphabet no publica MW/GW/TPUs; proxy = activos no en servicio $50.6B → $122.8B); gráfica backlog vs ingreso de Cloud 1T23–2T26 + tabla (backlog ÷ ingreso anualizado 5.2×); cobertura del backlog de Cloud firmado ($513.9B × 50% / 2 = $128.5B al año) vs consenso próximos 4T (96%), FY27 (76%), FY28 (52%) y Summit, con control 40–70%; directorio de 68 ubicaciones (31 en desarrollo) por país, de datacenters.google/locations (leído 27-oct).
- Citas verificadas contra las transcripciones oficiales 4T25/1T26/2T26 y el 10-Q 2T26. Sub-tabs Misc: Comp · Capex · Capacity → Revenue · Strategy · TAM.
- Avance corregido a 41 de 44: MISC-capacity no estaba en la M original.

### 2026-10-27 · MISC-strategy Miscellaneous ▸ Strategy — APROBADA
- Qué se mostró: `googlStrategyBody` en `googl-misc.js` + `GOOGL_LOOP`/`GOOGL_BETS` en `googl-misc-data.js` (copia de `metaStrategyBody`; CSS `.mx-loop5` de 5 columnas): lede "full stack"; ciclo Own the silicon → Lead the research → Ship to billions → Earn four ways → Reinvest; tabla de apuestas (suscripciones de IA, venta de TPUs, UCP, Waymo). Citas verificadas contra las transcripciones oficiales 4T25/1T26/2T26.
- Decisión (SAB): quitar lo que no tiene fuente primaria: "tres Nobel en dos años", "15 productos ≥500M", "⅔ caja / ⅓ deuda"; capex $180–190B → $195–205B. `strategyBody` de Dani eliminado. Reubicación #40 ✅.

### 2026-10-27 · MISC-tam Miscellaneous ▸ TAM — APROBADA
- Qué se mostró: `googlTamBody` + `GOOGL_TAM_*` (googl-misc-data.js): publicidad (WPP Media TYNY Midyear, 16-jun-2026: $1.3T +8.9%; búsqueda 21.8% ≈ $283B derivado; búsqueda generativa $5.1B → >$100B 2030; Alphabet+Meta+Amazon 57.6% ex China) junto a Google ads FY2025 $294.7B (+14.9% 1S26) y Search $224.5B (+17.9%); cloud (Synergy, 30-jul-2026: $143.4B 2T26 +43%, $500B TTM, AMZN 28% / MSFT 20% / GOOG 15%, GenAI +165%) junto a Google Cloud $24.8B +82%; fronteras (suscripciones, TPUs, Waymo) solo con cifras de Alphabet; nota de definiciones (no es cuota).
- Decisión (SAB): fronteras sin tamaño; sin Gartner. Dani "~$700B digital", "$700B+ cloud" y "one-line TAM thesis" fuera (sin fuente / opinión). `tamBody` eliminado. Reubicación #15 y #16 ✅.

### 2026-10-27 · F-FINAL Cierre y entrega — APROBADO (SAB)
- ① Recorrido completo en el portal real (sesión de SAB): Overview + 6 secciones, 25 sub-tabs y fases; sin errores de consola, sin `NaN`/`undefined`, todas las gráficas dibujadas, todos los paneles con pie (Top Line con el `sg-src` del motor), ninguno < 400 caracteres (Customers 888). IDs duplicados: 16 `rs*` del motor de Results montado 3 veces (Setup · Results · Estimates), como en META/TSM. `<style>` en línea: ninguno nuevo; 6 heredados (5 de `meta-ce.js` en Earnings, 1 en Executives & Board).
- ② Cabecera, precio en vivo, Fiscal.ai (hueco "fuera de plan" previsto) OK; sin avisos "Live data pending". Notes no se probó guardando (no escribir en Supabase).
- ③ §17.4: las 3 gráficas de Misc (capex/depreciación, compromisos, backlog) pasadas a la norma §17.2 a pedido de SAB — chips como leyenda (ocultar quita la serie de gráfica, tabla y total), zoom en ambos ejes con doble clic para restablecer (`attachBrush` copiado de `rsAttachBrush`), el cambio anual/trimestral suelta el zoom, tabla debajo en desplegable con conteo de series y periodos. Probado en el portal.
- ④ Mapa de reubicación conciliado: 50 de 51 ✅; #14 ◐ (espera la sección 5 del motor de segmentos).
- Limpieza (SAB: "sí, bórralo"): código muerto de Dani eliminado de `googl.js` tras moverse su contenido — paneles viejos (`industryBody`, `unitEconBody`, `timelineBody`, `financialsBody`, márgenes, guidance, peers, sensibilidad, ownership, gobierno, track, SPLC), el Earnings viejo (`ce*`, `CE_CONS`, `CALL_EARNINGS`, `GOOGL_THEMES`, `callsBody`) y sus reglas CSS `gdd-*` sin uso; la Watch List toma los trimestres de `googl-ce-data.js`. `googl.js` 2,956 → 1,022 líneas; el recorrido da los mismos paneles que antes.
- Pendiente después del reporte del 28-oct: 3T26 (Call Summary del PDF oficial, Results, Notes) y la columna sep-2026 de Capex (10-Q 3T26).

### 2026-10-28 · VA-SUB Submit History — 👀 EN REVISIÓN
- Qué se mostró: Valuation ▸ Submit History en localhost (motor `js/submits.js`, datos `js/submits-data/googl.js`); reemplaza el borrador solo-GOOGL `googl-submits.js` (no se commiteó; respaldo en el scratchpad de la sesión).
- Fuentes: MCP `get_valuation_history('GOOGL')` + `get_metric_snapshot_series` (REV, OP_INCOME, EBITDA, EARNINGS, SHARES · 2026/2027), jalado 2026-10-28; precio Massive.
- Autoauditoría: P/E activo al abrir · línea `#3E5A82` · chips ocultan serie en gráfica y tabla · nota "Left out" del 23-jul · pie de fuentes · sin errores de consola.
- La rama trae además el motor y la ficha VA-SUB de la guía (merge de `feat/dcf-submit-history`) para un solo PR.
