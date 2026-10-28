# TSM — bitácora de construcción del perfil

> Reglas: `docs/PROFILE_PLAYBOOK.md` §3.
> Claude la lee completa al empezar cada sesión y la actualiza en cada aprobación (no al final).
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)

| Campo | Valor |
|---|---|
| Empresa | Taiwan Semiconductor Manufacturing Company Limited (NYSE: TSM · TWSE: 2330) |
| Modo | A — empresa nueva |
| Rama | `feat/tsm-profile` |
| Analista responsable | SAB (Santiago Alvarez) |
| Inicio | 2026-10-15 |
| Avance | 35 de 39 unidades aprobadas · 2 omitidas · 1 en espera (EV-EST) |

## 1. Inventario de datos (F0)

Revisado 2026-10-15.

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | ✔ | agregada 2026-10-15 (id `d9691a16-…`; nombre "Taiwan Semiconductor Manufacturing Co.", sector Semiconductors, logo tsmc.com). La búsqueda de Add Company no la encuentra (no está en el S&P 500 ni en Fiscal.ai), así que se insertó con `api.insertCompany` desde la sesión de SAB, misma fila que crea el botón | el perfil abre | — |
| Filing anual (10-K / 20-F) | ✔ 20-F | **Foreign private issuer**: 20-F anual + 6-K trimestral (no 10-Q/8-K). Último 20-F: FY2025, presentado 2026-04-16, acc. `0001628280-26-025362` (CIK 0001046179). Trimestrales: Management Report + comunicado en 6-K / investor.tsmc.com | Overview, Top Line, textos verbatim | — |
| Año fiscal / moneda | ⚠ | cierre 31 dic (calendario ✔). **Reporta en NT$**; la guía trimestral de ingresos la da en **US$**. El ADR TSM = **5 acciones ordinarias** de 2330 TT | — | Múltiplos: EPS en NT$ por acción ordinaria → hay que convertir a US$ por ADR (×5 ÷ tipo de cambio) con FX declarado |
| Summit DCF | ✔ | llegó 2026-10-15 (sync 19:21 UTC): 1 snapshot `2026-10-15` (after Q3 - 2026), USD millions, 21,528 facts, 87 etiquetas — incluye consenso BBG (`REV/EBITDA/EARNINGS/SHARES_BBG_EST`), guía (`REV/GROSS_MARGIN/OP_MARGIN_LOW/HIGH_GUIDANCE`), plataformas, regiones, nodos, obleas. Valuación: EV/EBITDA 12x y P/E 19x (2027 fwd) con el **mismo** price target → `quality_flags` | F0-SM, serie Summit, Estimates, Target Multiple, Sensitivity | — |
| Consenso BBG (`BBG_CONSENSUS.txt` + `Consensus_Portal.xlsm`) | ✘ | `inspect_matrix.py TSM` → "TSM not in the workbook" (trae AMZN, GOOGL, LYFT, META, NVDA, SN, SPOT, TBBB, UBER) | `estMatrix.cons`, Setup, export de Bottom Line, P/E forward | sin consenso ni export (caso DHR) |
| `get-market-history` (Massive) | ✘ desplegada | sigue sin desplegar (404) | Historic Multiple en vivo | Historic Multiple con "Live data pending" (se revisa con `?mockmarket=1`) |
| `get-summit-data` + PR del portal | n/a | sin modelo Summit no aplica | — | — |
| SPLC (clientes / proveedores) | ✔ | `nvidia-map-reference/splc-parsed.json` (export `SPLC_BBG.xlsx`, sujeto `2330 TT Equity`): 20 clientes + 20 proveedores, mayoría 4Q25 | TL-CUS tabla, BL-SPLC | — |
| Transcripciones | ◐ | nada en `docs/calls/`; **Quartr sin suscripción activa**; TSMC publica la transcripción oficial en investor.tsmc.com (fuente primaria) | EV-POST, EV-NOTES, citas | — |
| Fiscal.ai (plan) | ❓ | probablemente fuera del plan gratuito; confirmar en Pillars ▸ Management | tabla en vivo de Management | el hueco dice "not available on the current Fiscal.ai plan" (correcto) |
| Massive (`liveQuote`) | ✔ (se asume) | TSM cotiza en NYSE en US$; verificar en la vista previa | market cap, peers | — |
| Fotos / imágenes | ✘ | nada en `img/leadership/` | — | iniciales / emoji |

**Calendario:** TSMC reportó 3Q26 el 2026-10-15 (conferencia ese día). Guía que había dado para 3Q26: ingresos US$44.6–45.8B, margen bruto 65.0–67.0%.

**Alcance acordado (2026-10-15, SAB):** completo — ninguna unidad ⏭️ de alcance. Las que dependen de Summit quedan ⛔ hasta que llegue el modelo (hoy) y, las que lo leen en vivo, hasta que se despliegue `get-summit-data`. Consenso BBG: se decide al llegar a EV-RES-DATA.

## 1b. Mapa Summit (F0-SM)

✅ aprobado 2026-10-15 (SAB) — sobre el snapshot `2026-10-15` (source 13:16 UTC, parsed 19:21 UTC). Archivo: `js/summit-map/tsm.js`.

**Cómo está armado el modelo (lo que el MCP no dice):**
- Moneda USD, escala millones (`list_dcf_models`). TSMC reporta en NT$: el modelo trae **dos bases en US$**:
  - **`DEFAULT`** (`REV`, `OP_INCOME`, `EBITDA`, `EARNINGS`, `DNA`, `CFO`, `CAPEX`, `FCF`, `INT_*`, `TAX_RATE`, `SHARES`): NT$ del 20-F ÷ ~31.08 NT$/US$ (FY25; el 20-F da 31.11 promedio ponderado y 31.37 al cierre). Anual 2018–2025 real, 2022–2030 proyectado; trimestral real 2022Q1–2026Q3.
  - **`SEGM`** (`SEGM_*`, `SEMG_GP`, `RND/SGNA/OTHER_OPEX`, `PLAT_*`, `REG_*`, `TECH_*`, guía): las cifras **en US$ que TSMC publica cada trimestre** (Management Report). Trimestral real 2022Q1–2026Q3 y proyectado hasta 2029Q4.
- `SHARES` = **ADR equivalentes** (acciones comunes ÷ 5), millones, fin de periodo.
- Las cuatro etiquetas de consenso vienen de `source=BBG`, anuales 2020–2030.

| Etiqueta MCP | Rol | Clave portal | Qué es, en una línea | Base | Unidad real | Agregación | Periodos | Cuadre vs filing | Confianza |
|---|---|---|---|---|---|---|---|---|---|
| `REV` | core | `rev` | Ingreso neto consolidado | IFRS | USD M (NT$ ÷ FX del modelo) | suma | A 2018–2030 · Q 2022Q1–2026Q3 | FY25 122,555.6 vs 20-F NT$3,809,054.3 ÷ 31.08 = 122,556 → Δ 0 ✔ (a 31.37: 121,423.5) | ⚠ FX implícito |
| `OP_INCOME` | core | `opinc` | Utilidad de operación | IFRS | USD M | suma | A · Q **(Q4 = 0)** | FY25 62,244.7 vs NT$1,936,091.7 ÷ 31.08 = 62,293 → Δ −0.1% | ❓ Q4 |
| `EBITDA` | core | `ebitda` | EBITDA del modelo (≈ EBT + int. exp + D&A, incluye no-operativos) | modelo | USD M | suma | A · Q **(Q4 roto)** | FY25 88,178.8 vs (EBT 65,690 + int. 398 + D&A 22,139) = 88,227 → Δ −0.05% | ❓ Q4 + definición |
| `EARNINGS` | core | `earnings` | Utilidad neta atribuible a la controladora | IFRS | USD M | suma | A · Q **(Q4 negativo)** | FY25 55,143.9 vs NT$1,697,604.0 ÷ 31.08 = 54,620 → Δ +1.0% | ❓ Q4 + Δ 1% |
| `SHARES` | core | `shares` | Acciones en ADR equivalentes (comunes ÷ 5) | — | ADR M | fin de periodo | A · Q (constante 5,186.474) | 25,932M comunes ÷ 5 = 5,186.5 ✔ | ✔ |
| `DNA` | core | `dna` | Depreciación + amortización | IFRS | USD M | suma | A · Q | FY25 22,139.4 vs (679,684.0 + 8,412.4) ÷ 31.08 = 22,139 → Δ 0 ✔ | ✔ |
| `CFO` | core | `cfo` | Flujo operativo | IFRS | USD M | suma | A · Q | FY25 73,197.0 vs 2,274,975.6 ÷ 31.08 = 73,197 → Δ 0 ✔ | ✔ |
| `CAPEX` | core | `capex` | Capex (**signo negativo**) | IFRS | USD M | suma | A · Q | FY25 −40,939.6 vs 1,272,411 ÷ 31.08 = 40,940 → Δ 0 ✔ | ✔ (signo) |
| `FCF` | core | `fcf` | CFO + CAPEX | modelo | USD M | suma | A · Q | 73,197.0 − 40,939.6 = 32,257.4 ✔ | ✔ |
| `INT_INC` | core | `int_inc` | Ingreso por intereses | IFRS | USD M | suma | A · Q | FY25 3,402.1 vs 105,739.1 ÷ 31.08 = 3,402 ✔ | ✔ |
| `INT_EXP` | core | `int_exp` | Costos financieros | IFRS | USD M | suma | A · Q | FY25 398.0 vs 12,370.4 ÷ 31.08 = 398 ✔ | ✔ |
| `TAX_RATE` | core | `tax_rate` | Tasa de impuestos | — | % (decimal) | promedio | A · Q **(Q4 > 200%)** | FY25 0.16 vs efectiva 20-F 346,529.8 ÷ 2,041,654.7 = 17.0% | ❓ |
| `SEGM_REV` | segment | `seg.total.rev` | Ingreso en US$ reportado por TSMC | reportado US$ | USD M | suma | Q 2022Q1–2029Q4 · A **(no cuadra)** | 3Q26 46,720 vs 6-K "$46.72 billion" ✔ · FY25 anual 119,567 ≠ suma de trimestres 122,427 | ❓ anual |
| `SEMG_GP` | segment | `seg.total.gp` | Utilidad bruta en US$ reportado (la etiqueta dice SEMG, no SEGM) | reportado US$ | USD M | suma | Q · A | 3Q26 31,026 ÷ 46,720 = 66.4% vs 6-K 66.4% ✔ | ✔ |
| `SEGM_OPINC` | segment | `seg.total.opinc` | Utilidad de operación en US$ reportado | reportado US$ | USD M | suma | Q · A | 3Q26 27,506 ÷ 46,720 = 58.9% vs 6-K 58.7% → Δ +81 | ⚠ |
| `SEGM_COGS` | segment | `seg.total.cogs` | Costo de ventas en US$ | reportado US$ | USD M | suma | Q · A | 3Q26 15,694 = 46,720 − 31,026 ✔ | ✔ |
| `SEGM_OPEX` | segment | `seg.total.opex` | Gastos de operación totales en US$ | reportado US$ | USD M | suma | Q · A | 3Q26 3,520 = 31,026 − 27,506 ✔ | ✔ |
| `RND_OPEX` | segment | `seg.total.rnd` | Investigación y desarrollo | reportado US$ | USD M | suma | Q · A | FY25 7,880 vs 246,427.2 ÷ 31.08 = 7,929 → Δ −0.6% · **proyección 2025 = 18,381** | ❓ proyección |
| `SGNA_OPEX` | segment | `seg.total.sga` | G&A + marketing | reportado US$ | USD M | suma | Q · A | FY25 3,167 vs (82,304.3 + 16,918.1) ÷ 31.08 = 3,192 → Δ −0.8% · **proyección 2025 = 11,249** | ❓ proyección |
| `OTHER_OPEX` | segment | `seg.total.other_opex` | Otros ingresos/gastos operativos, neto | reportado US$ | USD M | suma | Q · A | FY25 32.7 vs 447.3 ÷ 31.08 = 14.4 | ❓ |
| `DNA_COGS` · `EMPLOYEE_COGS` · `OTHER_COGS` | ignore | — | Desglose del costo de ventas; 2025Q4 proyectado = `SEGM_COGS` completo en las tres y `EMPLOYEE_COGS` 3Q26 = 0.812 | — | — | — | — | no cuadra | ❓ (no se usan) |
| `PLAT_HPC_REV` · `PLAT_SMARTPH_REV` · `PLAT_IOT_REV` · `PLAT_AUTO_REV` · `PLAT_DCE_REV` · `PLAT_OTHER_REV` | segment | `seg.hpc/smartphone/iot/auto/dce/other.rev` | Ingreso por plataforma (HPC, Smartphone, IoT, Automotive, DCE, Others) = % publicado × ingreso US$ | reportado US$ (derivado de %) | USD M | suma | Q 2022Q1–2029Q4 · A | FY25 HPC 70,446 vs 2,192,931 ÷ 31.08 = 70,557 → Δ −0.2%; suma 6 plataformas 122,023 vs 122,427 | ⚠ % redondeado |
| `REG_NA_REV` · `REG_APAC_REV` · `REG_CHI_REV` · `REG_JAP_REV` | kpi | `geo.na/apac/china/japan.rev` | Ingreso por región (% × ingreso) — **falta EMEA** | reportado US$ (derivado de %) | USD M | suma | Q 2022Q1–2026Q3 · A; sin proyección | FY25 NA 92,324 vs 92,512 (−0.2%); APAC 11,018 vs 10,594 (+4%); China 10,177 vs 10,537 (−3%) | ⚠ |
| `TECH_2NM/3NM/5NM/7NM/16NM/28NM/40_45NM/65NM/90NM/110NM/150NM_REV` | kpi | `node.<n>.rev` | Ingreso de obleas por nodo (% × ingreso) | reportado US$ (derivado de %) | USD M | suma | Q (3nm desde 2023Q3; 2nm desde 2026Q1) · A; sin proyección | 3Q26: 2nm 3,737.6 = 8% × 46,720 ✔; 3nm 33% ✔ | ⚠ % redondeado |
| `TECH_10NM_REV` · `TECH_20NM_REV` · `TECH_ABOVE_250NM_REV` · `AVG_REV_PER_WAFER` · `WAF_CAPACITY` · `WAF_SHIPMENTS` | ignore | — | Vacías (0 en todos los periodos) | — | — | — | — | — | — |
| `REV_LOW_GUIDANCE` · `REV_HIGH_GUIDANCE` | guidance | `guide.rev` | Guía trimestral de ingreso (bajo / alto) | US$ | USD M | — | Q 2022Q1–2026Q4 | 19 trimestres 2022Q1–2026Q3 = 6-K ✔ · **2026Q4 bajo = 53,300 vs 6-K US$52.3B** | ❓ 4Q26 |
| `GROSS_MARGIN_LOW/HIGH_GUIDANCE` | guidance | `guide.gm` | Guía de margen bruto | — | % (decimal) | — | Q 2022Q1–2026Q4 | = 6-K los 20 trimestres ✔ | ✔ |
| `OP_MARGIN_LOW/HIGH_GUIDANCE` | guidance | `guide.om` | Guía de margen operativo | — | % (decimal) | — | Q 2022Q1–2026Q4 | 2025Q4 0.49–0.51 y 2026Q3 0.56–0.58 = 6-K ✔ | ✔ |
| `REV_BBG_EST` · `EBITDA_BBG_EST` · `EARNINGS_BBG_EST` | consensus | `cons.rev/ebitda/earnings` | Consenso Bloomberg anual | BBG | USD M | — | A 2020–2030 | no aplica | ✔ |
| `SHARES_BBG_EST` | ignore | — | Vacía (0) | — | — | — | — | — | — |
| `SEG1…SEG5_REV/OPINC` · `SEG_REV/GP/COGS/OPINC/EBITDA/EBT/NETINC/DNA/CAPEX/CFO/FCF/SBC/INCTAX/INT_EXP/INT_INC/NON_OPINC/OTHER_INC` | ignore | — | Plantilla de segmentos sin usar (0 en todo) — TSMC tiene un solo segmento | — | — | — | — | — | — |

**Valuación** (`get_valuation_history`): EV / EBITDA 12.0x y P / E 19.0x, 2027 Forward, mismo price target $413.63 y fair value $398.54 → `quality_flags` en los dos. SAB dice que ya lo corrigió en el workbook; el MCP aún no tiene un snapshot nuevo (último parse 19:21 UTC).

**Conteo:** 87 etiquetas — 12 core · 14 segment (8 del estado de resultados en US$ reportado + 6 plataformas) · 15 kpi (4 regiones + 11 nodos) · 6 guidance · 3 consensus · 37 ignore (27 plantilla SEG + 6 vacías + `SHARES_BBG_EST` + 3 del desglose de COGS) · 7 dudas.

### Dudas (F0-SM)

```
❓ TSM · OP_INCOME / EBITDA / EARNINGS / TAX_RATE (hoja DEFAULT) — el 4.º trimestre está roto
   Lo que se ve: 2023Q4, 2024Q4, 2025Q4 → OP_INCOME 0; EBITDA 5,397 / 6,057 / 6,204; EARNINGS −688 / −1,583 / −1,917;
   TAX_RATE 2.21 / 3.22 / 3.17. Los Q1–Q3 y los anuales sí cuadran. Parece un "anual − (Q1+Q2+Q3)" sobre otra base.
   Quién responde: autor del modelo. Mientras tanto: los trimestres de utilidad se toman de la hoja SEGM (US$ reportado).
❓ TSM · SEGM_REV anual — el anual no es la suma de los trimestres
   FY25 119,567 vs 25,526 + 30,070 + 33,100 + 33,731 = 122,427 (FY24: 88,273 vs 90,077). 119,567 es igual a REV 2025 proyectado.
   Quién responde: autor del modelo. Mientras tanto: el anual se arma sumando trimestres.
❓ TSM · REV_LOW_GUIDANCE 2026Q4 — 53,300 en el modelo; el 6-K del 2026-10-15 dice US$52.3–54.3B (53.3 es el punto medio).
   Quién responde: autor del modelo. Mientras tanto: se usa el 6-K.
❓ TSM · RND_OPEX / SGNA_OPEX — real FY25 7,880 / 3,167 pero proyectado FY25 18,381 / 11,249 (otra escala o definición).
   Quién responde: autor del modelo. Mientras tanto: solo reales.
❓ TSM · TAX_RATE — FY25 0.16 vs 17.0% efectiva del 20-F. ¿Efectiva, estatutaria o redondeada?
❓ TSM · EARNINGS — FY25 +1.0% vs utilidad atribuible del 20-F a 31.08 (los otros rubros cuadran al dólar). ¿Otro FX o suma de trimestres en US$?
❓ TSM · valuación — EV / EBITDA y P / E con el mismo price target y fair value (quality_flags). SAB lo corrigió en el workbook; falta que el MCP cargue el nuevo snapshot.
   Mientras tanto: no se muestra price target ni fair value.
```

## 2. Tablero de unidades

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | ✅ | 2026-10-15 | SAB | | alcance completo: Summit llega hoy |
| F0-SM | Mapa de métricas Summit | ✅ | 2026-10-15 | SAB | | 87 etiquetas; 7 dudas abiertas para el autor del modelo |
| F1 | Esqueleto + vista previa | ✅ | 2026-10-15 | SAB | | revisado en el portal real local (cabecera, precio en vivo, IR + EDGAR) |
| OV-1 | Overview ▸ Key Facts | ✅ | 2026-10-15 | SAB | | 10 celdas del 20-F FY2025; market cap en vivo |
| OV-2 | Overview ▸ Descripción | ✅ | 2026-10-15 | SAB | | 3 oraciones, 72 palabras, del 20-F Item 4 |
| OV-3 | Overview ▸ Cuadrante 2×2 | ✅ | 2026-10-15 | SAB | | 20-F FY2025; "The edge" aprobado por SAB |
| OV-4 | Overview ▸ How it makes money | ✅ | 2026-10-15 | SAB | | Platform · Geography · Node en US$ trimestral reportado |
| OV-5 | Overview ▸ Products & platforms | ✅ | 2026-10-15 | SAB | | 5 familias por tecnología, 21 productos |
| OV-6 | Overview ▸ Competitors (peer map) | ✅ | 2026-10-15 | SAB | | foundries; múltiplos en vivo = precio ÷ denominadores del filing |
| OV-7 | Overview ▸ Timeline | ✅ | 2026-10-15 | SAB | | 6 hitos, 5 con "Read more" |
| OV-F | Overview ▸ Pie de fuentes | ✅ | 2026-10-15 | SAB | | Overview completo |
| EV-RES-DATA | Dataset de Results (números) | ✅ | 2026-10-15 | SAB | | 1Q22–3Q26 en US$; BBG 30 snapshots; verify 327/0 |
| EV-RES | Evolution ▸ Results | ✅ | 2026-10-15 | SAB | | primera sub-tab del Deep Dive; `deepDive` exportado |
| TL-GEN | Top Line ▸ General | ✅ | 2026-10-15 | SAB | | 6 plataformas como "segmentos"; cita Note 38 |
| TL-SEG | Top Line ▸ Segments | ✅ | 2026-10-15 | SAB | | esbelto: FILING + OURS + 2 KPIs por plataforma |
| TL-OTH | Top Line ▸ Other | ✅ | 2026-10-15 | SAB | | nodo (Q+A) · región cliente (A) · obleas vs resto (Q+A) |
| TL-CUS | Top Line ▸ Customers | ✅ | 2026-10-15 | SAB | | concentración 20-F + SPLC 20 clientes (4Q25) |
| EV-EST | Evolution ▸ Estimates | ⛔ | | | | el eje son los snapshots Summit y hay 1 (2026-10-15); se arma con el 2º submit (4Q26, ene-2027) |
| EV-SET | Evolution ▸ Earnings ▸ Setup | ✅ | 2026-10-15 | SAB | | Q4 2026 + Q3 2026; 9 headline + 6 KPIs |
| EV-POST | Evolution ▸ Earnings ▸ Post-Results | ✅ | 2026-10-15 | SAB | | Q3 2026: print + 7 temas + 17 Q&A + 6 notas propuestas |
| EV-NOTES | Evolution ▸ Earnings ▸ Notes | ✅ | 2026-10-15 | SAB | | 5 temas · 13 hilos (3Q26) |
| BL-GEN-1 | Bottom Line ▸ General ▸ Profitability & margins | ✅ | 2026-10-16 | SAB | | Annual 2018–2028E / Quarterly; actual + consenso BBG; serie Summit congelada por agregar |
| BL-GEN-2 | Bottom Line ▸ General ▸ The bridge | ✅ | 2026-10-16 | SAB | | FY25 $122.4B → $62.2B |
| BL-GEN-3 | Bottom Line ▸ General ▸ Op. income → net income | ✅ | 2026-10-16 | SAB | | sin Normalized NI; FY25 $62.3B → $55.3B |
| BL-GEN-4 | Bottom Line ▸ General ▸ Stock-based compensation | ⏭️ | 2026-10-16 | SAB | | sin vista de SBC (decisión SAB) |
| BL-GEN-5 | Bottom Line ▸ General ▸ Expense lines | ✅ | 2026-10-16 | SAB | | 5 líneas 2018–2025 y 1Q22–2Q26, US$ al FX de cada trimestre |
| BL-SEG | Bottom Line ▸ Segments | ⏭️ | 2026-10-16 | SAB | | un solo segmento reportable (20-F, Note 38) |
| BL-SPLC | Bottom Line ▸ Supply Chain | ✅ | 2026-10-16 | SAB | | top 20 proveedores BBG; orden por % del costo; geografía por país sede |
| VA-HIST | Valuation ▸ Historic Multiple | ✅ | 2026-10-16 | SAB | | 4 líneas; precio en vivo (Massive); caja neta de los 6-K; EV/EBITDA desde mediados de 2022 |
| VA-PEERS | Valuation ▸ Peers | ✅ | 2026-10-16 | SAB | | mismo mapa que OV-6 + tabla con promedio/mediana ex-TSMC |
| VA-TM | Valuation ▸ Target Multiple / PEG | ✅ | 2026-10-16 | SAB | | valuación Summit congelada (snapshot 2026-10-15); EV 12× $413.63 · P/E 19× $410.28 |
| VA-SUB | Valuation ▸ Submit History | 👀 | 2026-10-28 | | | motor `js/submits.js` + `js/submits-data/tsm.js` congelado del MCP: 2 submits (15-oct, 19-oct), abre en P/E (19× → 20× FY2027; PT $410.28 → $453.92, por ADR). PT÷FV 1.038/1.038 y 1.036/1.036: limpio. El MCP guarda OP_INCOME en 0 → la fila Operating income sale en blanco; el caso viene como "0" (no se muestra) |
| VA-SENS | Valuation ▸ Sensitivity | ✅ | 2026-10-16 | SAB | | snapshot Summit 2026-10-15 congelado; 5 plataformas + margen consolidado; Street BBG real |
| MG-TEAM | Management ▸ Executives & Board | ✅ | 2026-10-16 | SAB | | top 6 ejecutivos + consejo completo (10), 20-F Item 6; foto solo de Wei (las demás iniciales) |
| MG-OWN | Management ▸ Ownership | ✅ | 2026-10-16 | SAB | | tabla de insiders (36, 20-F) en formato .rt; toggle "Top holders" pendiente del HDS de Bloomberg |
| MG-GOV | Management ▸ Governance & SBC | ✅ | 2026-10-16 | SAB | | 4 KPIs + 3 tablas .rt (pago ejecutivos, comités, pool de pago y capital devuelto) + nota |
| MG-TRACK | Management ▸ Track Record | ✅ | 2026-10-16 | SAB | | 6 líderes, sin calificaciones (SAB); modal exec: |
| MISC-fabs | Miscellaneous ▸ Fabs & Capacity | ✅ | 2026-10-16 | SAB | | del dashboard TSMC v7 de SAB: mapa estático, directorio (20-F), envíos de wafers, CoWoS (estimado) |
| MISC-asml | Miscellaneous ▸ TSMC × ASML | ✅ | 2026-10-16 | SAB | | ventas de ASML por cliente, ASML en el capex de TSMC, EUV (clientes, techo, economía por equipo, → capacidad N2); estimados marcados |
| F-FINAL | Cierre y entrega | ⬜ | | | | |

## 3. Decisiones del analista

<!-- Solo se agrega. Si una decisión cambia, nueva línea que cita la anterior. -->
- 2026-10-15 · F0 · Alcance completo; nada se omite por falta de Summit — SAB sube el modelo Summit de TSM hoy — SAB
- 2026-10-15 · F0 · Consenso BBG: decidir más adelante (al llegar a EV-RES-DATA) — SAB
- 2026-10-15 · F0 · Fila en `companies`: la agrega SAB con Add Company — SAB
- 2026-10-15 · F1 · Todo se revisa directo en el portal real en local (sesión de SAB), no en un harness; anotado en PROFILE_PLAYBOOK §7.3 y en /build-profile — SAB
- 2026-10-15 · F1 · SAB ya tiene permiso para agregar empresas; pidió a Claude agregar TSM desde su sesión (hecho) — SAB
- 2026-10-15 · todas · Summit se codifica directo (snapshot congelado del MCP), sin feed en vivo — SAB
- 2026-10-16 · guía · Actualizar la regla 10 del playbook para todas las empresas (hecho: PROFILE_PLAYBOOK regla 10 + §20b, /build-profile, _TEMPLATE, CLAUDE.md) — SAB
- 2026-10-16 · BL-GEN · Sin vista de SBC; sin Normalized net income; BL-SEG ⏭️ (un solo segmento) — SAB
- 2026-10-16 · BL-SPLC · Construir con los 20 proveedores del export del mapa de semis (no esperar un export completo de 2330 TT) — SAB
- 2026-10-16 · VA-HIST · P/E y EV/EBITDA; la caja neta trimestral se saca de los balances 6-K (1Q22–2Q26) — SAB
- 2026-10-16 · Series Summit · Dibujar también la historia que trae el modelo en los periodos reportados (etiquetada como historia del modelo, no estimado previo) — SAB
- 2026-10-16 · MG-TEAM · Tarjetas solo para el top 6 (CEO, Co-COOs, CFO, General Counsel, ventas); fotos oficiales — SAB
- 2026-10-16 · MG-OWN · Fuera el layout de cajas de AMZN: tabla estructurada de insiders, formato de tablas del portal (.twrap/.rt), sin la fila del >5%; agregar toggle "Top holders" (fondos) cuando llegue el HDS — SAB
- 2026-10-16 · MG-TRACK · Sin calificaciones de color (Claude propuso 4 verdes / 2 ámbar; SAB prefirió solo el historial) — SAB
- 2026-10-16 · MISC · Misc llevará el análisis TSMC + ASML que SAB prepara en otro chat; se agrega cuando esté depurado — SAB
- 2026-10-16 · VA-TM · Construir ya con un solo snapshot; la diferencia del EPS de la pierna P/E queda como duda abierta para el autor del modelo — SAB
- 2026-10-28 · VA-SUB · Submit History con el motor común (P/E por default, azul Summit `--steel`, precio gris claro, fair value apagado); fila EBITDA rotulada "EBITDA" (el del modelo, no ajustado) — Claude, falta confirmación de SAB

## 4. Excepciones aceptadas

- 2026-10-15 · OV-6 · Vista inicial del mapa de peers = **Trailing** (la guía pide Forward): con el set de foundries solo TSM tiene consenso BBG, así que Forward mostraría una sola burbuja. Aprobado por SAB en la compuerta OV-6.

## 5. Mapa de reubicación (solo modo B)

No aplica (modo A).

## 6. Bloqueos y preguntas abiertas

| Desde | Unidad | Qué falta | Quién lo consigue | Estado |
|---|---|---|---|---|
| 2026-10-15 | todas (portal real) | fila TSM en `companies` (Add Company) | SAB | cerrado 2026-10-15 |
| 2026-10-15 | F0-SM, EV-EST, VA-TM, VA-SENS | modelo Summit DCF de TSM en el MCP | SAB (hoy) | cerrado 2026-10-15 |
| 2026-10-15 | EV-EST, VA-TM, VA-SENS | ~~`get-summit-data` desplegada~~ → Summit se codifica directo (snapshot congelado del MCP) | SAB | cerrado 2026-10-15 |
| 2026-10-15 | EV-RES-DATA, EV-SET, BL-*, VA-HIST forward | decisión: agregar TSM a `Consensus_Portal.xlsm` | SAB | abierto |
| 2026-10-16 | EV-EST | 2º snapshot del modelo Summit (el eje de Estimates son los snapshots; hoy hay 1) | SAB (submit del 4Q26) | abierto |
| 2026-10-16 | MG-OWN ▸ toggle Top holders | export Bloomberg HDS de 2330 TT Equity (y TSM US Equity), formato NVDA_OWN.xlsx | SAB | abierto |

## 6b. Conexiones pendientes ("Live data pending")

| Desde | Unidad ▸ bloque | Qué falta (función / dato) | Quién lo destraba | Estado |
|---|---|---|---|---|
| 2026-10-15 | EV-SET ▸ columna Summit de la rejilla | `setup.us` se llena con el snapshot Summit congelado | Claude | cerrado 2026-10-16 (Q4 2026 desde el snapshot; Q3 2026 sin snapshot previo) |
| 2026-10-15 | EV-RES (y Top Line) ▸ serie Summit | serie `summit` codificada en `js/results-data/tsm.js` desde el snapshot congelado (mapa `js/summit-map/tsm.js`) | Claude | cerrado 2026-10-16 |
| 2026-10-16 | BL-GEN-1 ▸ serie Summit (márgenes) | quitar el aviso "Live data pending" de `tsm-bl.js` y leer la serie congelada (mismo paso que EV-RES) | Claude | cerrado 2026-10-16 |

## 7. Historial de aprobaciones

<!-- Solo se agrega, la más reciente al final. -->
### 2026-10-15 · F0 Inventario de datos — APROBADA (con ajuste)
- Qué se mostró: tabla de inventario (20-F, NT$/ADR 5:1, sin Summit, sin BBG consensus, SPLC sí, transcripciones en IR oficial, sin fotos).
- Fuentes: EDGAR (CIK 0001046179), MCP Summit (`search_ticker`, `list_dcf_models`), `scripts/consensus/inspect_matrix.py`, `splc-parsed.json`, investor.tsmc.com.
- Cambios pedidos / decisiones: incluir todo; las unidades Summit pasan de ⏭️ a ⛔ porque el modelo llega hoy.

### 2026-10-15 · F1 Esqueleto + vista previa — CAMBIOS
- Qué se mostró: `harness-tsm.html` con el Overview vacío ("no deepDive").
- Cambios pedidos: no usar harness; trabajar directo en el portal local. Se borró `harness-tsm.html`, se reescribió playbook §7.3 (y referencias en §2.2, §4.2, §14, §16, Anexos C y D) y el comando /build-profile.

### 2026-10-15 · F1 Esqueleto + vista previa — APROBADA
- Qué se mostró: perfil de TSM en el portal real (localhost:8000, sesión de SAB): cabecera con logo, "TSM · Semiconductors", precio en vivo, botones IR (investor.tsmc.com) y EDGAR (CIK 1046179); pestañas Overview · Pillars · Resources; Overview vacío; sin Deep Dive.
- Auto-revisión: carga sin errores de consola ✔ · sin `<style>` inline ✔ · paleta Summit, marca solo en el logo ✔ · sin sub-tabs vacías ✔ · regla 10 ✔.
- Cambios pedidos: ninguno.

### 2026-10-15 · OV-1 Key Facts — APROBADA
- Qué se mostró: 10 celdas en el portal real — Listing `NYSE: TSM · TWSE: 2330` · HQ `Hsinchu, Taiwan` · Incorporated `Taiwan (R.O.C.)` · SEC filer `Foreign (20-F/6-K)` · Founded `1987 (Morris Chang)` · IPO `Sep 1994 · TWSE · ADS on NYSE Oct 1997` · CEO `C.C. Wei · joined 1998 · CEO since Jun 2018` · Employees `90,557 · Dec 2025` · Dividend `Payer · quarterly` · Market cap en vivo (`$2.17T · live, Oct 15, 2026`).
- Fuentes: 20-F FY2025 (acc. 0001628280-26-025362): portada, Item 4 (constitución 21-feb-1987; TWSE 5-sep-1994; NYSE 8-oct-1997), Item 6 (bio de C.C. Wei; 90,557 empleados de tiempo completo al 31-dic-2025), Item 8 (dividendos trimestrales). Fundador: tsmc.com company profile. Market cap: `liveQuote` (Massive, por ADR equivalente).
- Auto-revisión: 10 celdas ✔ · CEO con antigüedad ✔ · market cap con estado ✔ · filer verificado en EDGAR ✔ · sin celdas vacías ✔ · sin `<style>` ✔ · regla 10 ✔.
- Nota: C.C. Wei también es Chairman desde jun 2024 (no se incluyó para no alargar la celda; aparece en MG-TEAM).
- Cambios pedidos: ninguno.

### 2026-10-15 · F0-SM Mapa de métricas Summit — APROBADA
- Qué se mostró: las 87 etiquetas del snapshot `2026-10-15` clasificadas (12 core · 14 segment · 15 kpi · 6 guidance · 3 consensus · 37 ignore), con su cuadre contra el 20-F FY2025 y los 6-K; `js/summit-map/tsm.js`.
- Fuentes: MCP Summit (`list_dcf_models`, `list_metrics`, `get_fundamentals`, `get_valuation_history`); 20-F FY2025 (estado de resultados, flujo, notas); 6-K de guía 2022–2026 y comunicado 3Q26 (2026-10-15).
- Auto-revisión: 87/87 etiquetas en el mapa ✔ · core y segment con cuadre o razón ✔ · unidades revisadas a mano ✔ · valuación revisada (quality_flags) ✔ · sin números en el archivo ✔.
- Dudas abiertas (7, ver §1b): Q4 roto en DEFAULT · SEGM_REV anual ≠ suma · guía 4Q26 bajo · RND/SGNA proyectados · TAX_RATE · EARNINGS +1% · valuación pendiente de re-ingesta (SAB ya corrigió el workbook).
- Cambios pedidos: ninguno.

### 2026-10-15 · OV-2 Descripción — APROBADA
- Qué se mostró: lede de 3 oraciones / 72 palabras en el portal real: foundry dedicada (fabrica chips que diseñan otros, no vende con marca propia) · fundada en Taiwán en 1987 · procesos de maduros a avanzados + máscaras, empaquetado avanzado y pruebas · fabs en Taiwán, EE.UU., China y Japón.
- Fuentes: 20-F FY2025, Item 4 ("Business Overview of the Company", "Our Semiconductor Facilities").
- Auto-revisión: 2–4 oraciones ✔ · 50–80 palabras ✔ · tono neutral ✔ · sin segmentos / clientes / moat ✔ · sin `<style>` ✔.
- Cambios pedidos: ninguno.

### 2026-10-15 · OV-3 Cuadrante 2×2 — APROBADA
- Qué se mostró: What it sells (fabricación por contrato de chips diseñados por clientes, 2nm a nodos maduros + máscaras, 3DFabric, pruebas) · Who buys it (fabless, system companies, IDMs; top-10 ~78%, mayor 19% de FY2025) · How it earns (FY2025: ~58% HPC · ~29% smartphone · ~5% IoT · ~5% auto · ~3% otros; 74% del revenue de obleas en 7nm o menos) · The edge (escala y capacidad en nodos avanzados + foundry pura que no compite con sus clientes).
- Fuentes: 20-F FY2025 Item 3 (concentración de clientes), Item 4 (negocio, competencia), Item 5 (revenue por plataforma y por nodo).
- Auto-revisión: 4 celdas en orden ✔ · ≤30 palabras (26/24/28/29) ✔ · solo "How it earns" con números ✔ · sin `<style>` ✔.
- Decisión del analista: "The edge" tal como se propuso.
- Cambios pedidos: ninguno.

### 2026-10-15 · OV-4 How TSMC makes money — APROBADA
- Decisiones del analista (antes de construir): vistas **Platform · Geography · Node** (TSMC tiene un solo segmento, así que "Segments" no aplica); moneda **US$ trimestral reportado** (FY2025 = $122.43B = 25.53 + 30.07 + 33.10 + 33.73; FY2024 = $90.07B).
- Qué se mostró: leyenda con total $122.4B (+35.9%) y "single reportable segment"; tres vistas que suman $122.4B cada una (plataforma 6 barras; región del cliente 5; nodo 6 + non-wafer); 6 acordeones de plataforma (qué es + "The numbers": revenue, crecimiento US$ y NT$, participación 2023→2025) + "The revenue lines" (wafer $105.2B / non-wafer $17.2B); cierre con márgenes FY2025 (bruto 59.9%, operativo 50.8%, neto 44.6%).
- Método: cada rebanada = participación exacta en NT$ del 20-F × total US$ reportado; nodos = % del revenue de obleas (presentación 4Q25) × participación de obleas en el revenue (20-F). El crecimiento por plataforma en US$ difiere del que TSMC publica (en NT$); se muestran los dos.
- Fuentes: 20-F FY2025 Item 4 (descripción de plataformas), Item 5 (revenue por plataforma y por región del cliente, NT$ 2023–2025), nota de revenue (wafer / others); comunicados trimestrales 6-K (revenue en US$ 1Q24–4Q25); presentación 4Q25 (6-K EX-99.2, slides 6 y 8).
- Auto-revisión: 3 vistas cuadran al total ✔ · ≥2 rebanadas por vista ✔ · paleta `SUMMIT_CAT` en orden + `SUMMIT_MUTE` para "Others"/"Non-wafer" ✔ · `desc` sin números ✔ · pastillas y acordeones funcionan ✔ · sin `<style>`; estilos del toggle y espaciados subidos a `css/overview.css` ✔.
- Arreglo frente a AMZN: en barras < 10% el monto va fuera de la barra (en AMZN se corta). Las pastillas usan la clase `.active`, no estilos puestos desde JS.
- Cambios pedidos: ninguno.

### 2026-10-15 · OV-5 Products & platforms — APROBADA
- Decisión del analista (antes de construir): 5 familias por tecnología.
- Qué se mostró: 🔬 Leading-edge logic (N2, A16, N3, N5/N4) · ⚙️ Mainstream logic (N7/N6, 16/12nm, 28/22nm) · 📡 Specialty (RF, memoria embebida, PMIC, sensores, display drivers, ULP/ULL) · 🧱 3DFabric packaging (CoWoS, SoIC, InFO, 3Dblox) · 🛠️ Design & manufacturing services (OIP, CyberShuttle, máscaras, pruebas). 21 productos, cada uno con 1–2 líneas en una ventana emergente.
- Fuentes: 20-F FY2025 Item 4 (párrafos por plataforma, "Design and Technology Platforms", "Multi-project Wafer Program", "Research and Development").
- Auto-revisión: tarjeta = icono + familia + ≤6 palabras + "See products ›" ✔ · dos niveles ✔ · ventana abre, se iza a `#co-detailview` y cierra con Esc ✔ · sin `<style>`; estilos de la ventana subidos a `css/overview.css` (`.prod-*`) ✔.
- Cambios pedidos: ninguno.

### 2026-10-15 · OV-6 Competitors — the peer map — APROBADA
- Decisiones del analista (antes de construir): peers = **solo foundries** cotizadas en EE.UU. (INTC, GFS, UMC, TSEM) + TSM; Samsung Foundry y SMIC nombrados en la nota (sin múltiplo en US$). Forward **solo para quien tenga consenso** (hoy solo TSM).
- Qué se mostró: mapa SVG múltiplo × crecimiento, burbuja = market cap en vivo; pastillas P/E ⇄ EV/EBITDA y Forward ⇄ Trailing; chips con × y "+ TICKER"/Add; los chips explican por qué falta un peer ("no P/E — loss", "trailing only — no Street file", "no figures on file", "no live price").
- Datos (regla 10): `A_PEERS` guarda **denominadores**, no múltiplos ni market cap — EPS, EBITDA (= utilidad operativa + D&A), deuda neta (préstamos y bonos − efectivo, sin arrendamientos) y crecimiento de revenue, del reporte anual FY2025 de cada peer en SEC EDGAR: TSM 20-F (US$ a NT$31.37; EPS US$10.43 por ADS), INTC 10-K (EPS −0.06 → sin P/E), GFS 20-F, UMC 20-F (US$ a NT$31.37; EPS por ADS = 5 acciones), TSEM 20-F. Forward de TSM: `BBG_CONSENSUS.txt` FY2026, data_as_of 7/21/2026 (EPS US$3.3167 × 5 por ADS; EBITDA $123,993M; revenue $168,165M → +37.2%). El navegador calcula P/E = precio ÷ EPS y EV/EBITDA = EV ÷ EBITDA, con EV = EV de Massive o market cap + deuda neta.
- Primera implementación del cálculo en vivo (AMZN sigue con múltiplos sembrados, A3): `aScMult`, ejes derivados (`aScNice`), notas en los chips. Es la nueva referencia; decirlo en el PR.
- Auto-revisión: P/E ⇄ EV/EBITDA y Forward ⇄ Trailing cambian ejes ✔ · × elimina ✔ · Add agrega; re-agregar restaura datos ✔ · ejes derivados, nada pegado al borde ✔ · ningún múltiplo en el archivo ✔ · nota con fuente y fecha ✔ · sin `<style>`; estilos de chips/tooltip subidos a `css/overview.css` ✔.
- Excepción aceptada: vista inicial **Trailing** (la guía dice Forward) porque en Forward solo TSM tiene datos. UMC y GFS quedan casi encimadas en EV/EBITDA; el tooltip las distingue.
- Cambios pedidos: ninguno.

### 2026-10-15 · OV-7 Timeline — APROBADA
- Qué se mostró: 1987 (fundación, foundry pura) · 1994–97 (TWSE, NYSE ADS) · Jun 2018 (retiro de Morris Chang; C.C. Wei CEO; Chairman desde jun 2024) · 2020–24 (Arizona, JASM, ESMC, CHIPS Act) · 2023 (HPC plataforma más grande) · 2025 (2nm en volumen). 5 con "Read more" en viñetas.
- Fuentes: 20-F FY2025 Items 4, 5 y 6; tsmc.com company profile (fundador, "pioneered the pure-play foundry business model").
- Fuera a propósito: cambios de CEO de 2005 y 2009 (la guía pide solo el actual y la salida del fundador); hito de market cap de un billón (sin fecha en fuente oficial).
- Auto-revisión: orden cronológico estricto ✔ · cada hito explica lo que TSMC es hoy ✔ · viñetas ✔ · ventana abre/cierra ✔ · sin `<style>` ✔.
- Cambios pedidos: ninguno.

### 2026-10-15 · OV-F Pie del Overview — APROBADA (Overview completo)
- Qué se mostró: `.ov-foot` único: 20-F FY2025 (filed Apr 16 2026) · 6-K trimestrales (US$ por trimestre, mezcla por nodo) · tsmc.com · historial de filings · reporte anual FY2025 de cada peer · qué es en vivo (market cap, múltiplos) y qué es estimado (forward BBG, Jul 2026) · tipo de cambio de los 20-F (NT$31.37).
- Auditoría del Overview completo: 7 bloques + pie en el orden de la guía ✔ · un solo pie ✔ · sin IDs duplicados, sin NaN/undefined ✔ · 0 `<style>` ✔ · consola sin errores ✔ · sin Summit copiado ni múltiplos sembrados ✔.
- Cambios pedidos: ninguno.

### 2026-10-15 · EV-RES-DATA Dataset de Results — APROBADA
- Decisiones del analista (antes de construir): métricas = mínimas + plataformas + gross profit (y márgenes bruto/operativo como TSMC los guía); base **US$ al tipo de cambio de cada trimestre**; periodos **1Q22 → hoy**; consenso: sí (TSM ya está en `BBG_CONSENSUS.txt`); plataformas: **usar solo los snapshots limpios**.
- Archivo: `js/results-data/tsm.js` (registrado en `js/results.js` como `TSM`). Trimestral 1Q22–2Q27 (19 reportados + 3 forward), anual 2022–2028. 13 métricas por vista.
- Fuentes: 6-K EX-99.1 de cada trimestre (US$ revenue, EPS por ADR en US$, tabla NT$); 6-K EX-99.2 (presentaciones: % por plataforma y capex — slides en imagen, leídos uno por uno; 1Q22–4Q22 y 2Q25 solo en imagen); 20-F FY2024/FY2025 (split anual por plataforma en NT$, D&A). FX = NT$ revenue ÷ US$ revenue de TSMC (cuadra con el promedio de cada presentación). Guía: comunicado del trimestre anterior. Consenso: `estMatrix` generado (`map_tsm.json`, `emit_matrix.py`, `apply_matrix.py`); `verify_preprint.py TSM cons` → 327 iguales, 0 cambios.
- Hallazgos: (1) `BBG_CONSENSUS.txt` trae un byte no-UTF-8 ("µ" en "90nm - 0.13µm", 60 veces) que rompe `inspect_matrix.py` para todos los tickers — se trabajó sobre una copia en scratch; hay que arreglar el export o el script. (2) En 7–9 de los 30 snapshots, todas las celdas de plataformas repiten el snapshot del 21-jul-2026 → excluidas con `dropVintages` (nueva opción de `emit_matrix.py`, con chequeo automático "reprinted-snapshot"); totales limpios. Avisar a San/Oscar.
- Tabla de cuadre mostrada (2Q23, 4Q24, 3Q26 × revenue, márgenes, gross profit, EPS, capex, HPC, guía, consenso): todo ✔ contra el documento fuente.
- Summit: no va en el archivo (regla 10); `source` termina con "Summit model series: live data pending…"; anotado en Conexiones pendientes.
- Cambios pedidos: ninguno.

### 2026-10-15 · EV-RES Evolution ▸ Results — APROBADA
- Qué se mostró: pestaña Deep Dive (nueva) con solo Evolution ▸ Results (regla 5: lo demás aparece con su unidad). Motor `results.js` con `resultsHtml('TSM')` / `initResults`: selector "Estimates as of" (Latest file before each print · One Street file; 30 snapshots), Top Line (revenue + 6 plataformas) y Margins & Profitability (op. income, gross profit, EPS/ADR, capex; Gross/Operating Margin as guided con su banda de guía), tarjeta Actuals vs Estimates, Road to the print, pie con fuentes y "Summit model series: live data pending".
- Código: `deepDiveHtml`, `aBuildSub`, `wireDD`, `deepDiveInit` copiados de `amzn.js` (raíz `.ov-tsm-dd`, solo la rama Evolution ▸ Results; sin `ceResultsPending`); `tsmOverview.deepDive` exportado.
- Auto-revisión: motor carga sin errores ✔ · `<optgroup>` por familia ✔ · banda de guía en revenue y márgenes ✔ · pie con fuente y Summit pendiente ✔ · motor sin tocar ✔.
- Limitación conocida del motor (no se corrige en este PR): en métricas `unit:'pct'` las pastillas siguen diciendo "$B" y ofrecen "Margin %" (igual en SN/TBBB/DHR).
- Cambios pedidos: ninguno.

### 2026-10-15 · EV-RES — corrección después de aprobada
- Defecto encontrado al montar Top Line: la gráfica por defecto de Margins & Profitability (Income from Operations) fallaba al dibujarse (`rsMarginArr` lee `m.summit[i]`; el dataset no traía el arreglo `summit`). No se vio en la compuerta porque la revisión cambió a "Gross Margin (as guided)", que no tiene `marginOf`.
- Arreglo: cada métrica lleva `summit: [null, …]` (sin números — regla 10 intacta). Re-generado, `apply_matrix` + `verify_preprint` (327 / 0). Recorridas las 26 métricas (13 trimestrales + 13 anuales): 0 errores de consola.
- Aprendizaje para la guía: un dataset sin Summit debe llevar `summit` en null, no omitirlo.

### 2026-10-15 · TL-GEN Top Line ▸ General — APROBADA
- Decisiones del analista (antes de construir): las **6 plataformas** hacen de segmentos (TSMC tiene un solo segmento operativo); Other llevará nodo, región del cliente y obleas vs resto.
- Archivo: `js/segments-data/tsm.js` (registrado en `js/segments.js` como `TSM`, con `tsmResults`). Cada plataforma apunta a `results:<key>` (un solo hogar por número). Montaje: sección Top Line ▸ General en `deepDiveHtml` + rama `topline` en `aBuildSub`.
- Qué se mostró: cita FILING verbatim ("As a result, the Company has only one operating segment, the foundry segment." — 20-F FY2025 Note 38) · 6 tarjetas (último trimestre, ▲ YoY, % del total; al abrir `brief` + `sells` parafraseados del 20-F Item 4) · barras apiladas Q/A con tabla "Revenue detail" · pie = `source`.
- Avisos: el motor escribe fijo "net sales" (TSMC dice "net revenue") → generalizar el motor en PR aparte; en 3Q26 IoT = Automotive porque TSMC imprime ambos como 4%.
- Cambios pedidos: ninguno.

### 2026-10-15 · TL-SEG Top Line ▸ Segments — APROBADA
- Decisión del analista (antes de construir): alcance esbelto, solo lo publicado por plataforma.
- Qué se mostró: por plataforma, `tenK` FILING verbatim (20-F Item 4, con ubicación; "Others" no tiene definición en el filing) · `summary` OURS (cotejado contra la serie: rangos de IoT 4–7% y Auto 4–6% corregidos; Smartphone −1% YoY en 3Q26) · top line de la plataforma (motor Results: actual + consenso, "No company guidance") · `products` con `customers.archetype` FILING y la nota de que TSMC no nombra clientes (Customer A 19% / B 17% de FY2025, Note 38) · KPIs: revenue (`results:<k>`) y participación (`derived` = `results:<k>` ÷ `results:rev`) · sin interacciones (no se divulga volumen × precio por plataforma) · "What management has said" con bandera hasta EV-NOTES.
- Montaje: sub-tab `segdrv` en `deepDiveHtml` + rama `initSegments(root,'TSM')` en `aBuildSub`.
- Auto-revisión: FILING verbatim con ubicación ✔ · OURS separado ✔ · 6 plataformas cargan sin errores ✔.
- Cambios pedidos: ninguno.

### 2026-10-15 · TL-OTH Top Line ▸ Other — APROBADA
- Decisión del analista: cortes por nodo, región del cliente y obleas vs resto.
- Datos (`shared` en `js/segments-data/tsm.js`, construidos con scripts de scratch; cada corte cuadra con el revenue de Results en todos los periodos — verificado con aserciones):
  - **Technology node** (Q 1Q22–2Q26 + A 2022–2025): % de revenue de obleas de cada slide "Revenue by Technology" (19 slides leídos por un ayudante; cada pie suma 100) × revenue de obleas de los estados financieros trimestrales 6-K ("Disaggregation of revenue — Product"; Q4 = anual − 9M), en US$ al FX del trimestre; anual = tabla de nodos del 20-F (FY2024 para 2022, FY2025 para 2023–2025; coincide con los slides). Agrupado: 2nm · 3nm · 5nm · 7nm · 16/20nm · 28nm · 40nm & older · Non-wafer. 3Q26 pendiente hasta los estados financieros de noviembre.
  - **Customer region** (A 2022–2025): 20-F Item 5 por sede del cliente, participación NT$ exacta × US$ del año.
  - **Wafer vs the rest** (Q + A): estados financieros 6-K / reporte anual.
- Citas FILING verbatim: definición de nodo (20-F Item 5 nota 1), de región (Markets and Customers) y notas de APAC/EMEA.
- Hallazgo: los estados financieros trimestrales (6-K, ~1 mes después del reporte) traen obleas vs resto y geografía por ubicación de facturación cada trimestre.
- Cambios pedidos: ninguno.

### 2026-10-15 · TL-CUS Top Line ▸ Customers — APROBADA (Top Line completo)
- Qué se mostró: concentración FILING verbatim (20-F Item 3: top-10 70/76/78%, mayor 25/22/19%, segundo 11/12/17% en 2023–2025) · 3 clases de cliente verbatim (fabless, system companies, IDMs; Item 4) · "Named on the record" = 0 (TSMC no nombra clientes; el motor dice "yet") · SPLC: 20 clientes (sujeto `2330 TT Equity`, lado cliente, `nvidia-map-reference/splc-parsed.json`), $23.7B en 4Q25 ≈ 70% del revenue del trimestre, con la limitación primero.
- Nota OURS en `coverageWhy`: NVIDIA 19% y Apple 17% según Bloomberg coinciden con "Customer A/B" del 20-F FY2025 — coincidencia, no confirmación.
- Auto-revisión: limitación antes de la tabla ✔ · nota de concentración verbatim (disclosed: true) ✔ · sin errores ✔.
- Cambios pedidos: ninguno.

### 2026-10-15 · Paréntesis — selectores de navegación (decisión de SAB)
- Pedido: que los selectores por nivel tengan un mismo formato y una misma lógica de diseño, para que el portal se vea estandarizado.
- Inventario medido en AMZN: 61 tipos de botón; las barras de navegación tenían 3 estilos (activo de sección en naranja de marca; sub-pestañas en mayúsculas con relleno; fases de Earnings con otro azul).
- Decisión: dirección "todo subrayado / texto"; **solo las barras de arriba** (secciones, sub-pestañas, sub-pestañas anidadas) — el contenido de abajo se queda como estaba; **solo AMZN y TSM** — las demás entran al pasar por la guía. En esta rama.
- Hecho: `css/selectors.css` (cargado al final en `index.html`, alcance `:is(.ov-amzn-dd, .ov-tsm-dd)`); guía §21b nueva + recordatorio en §7.2. Verificado: AMZN y TSM con el sistema nuevo, controles de contenido sin cambio, SharkNinja sin cambio.
- Un primer intento también tocó los controles del contenido y todas las empresas; SAB lo corrigió y se revirtió.

### 2026-10-15 · EV-SET Evolution ▸ Earnings ▸ Setup — APROBADA
- Decisiones del analista (antes de construir): trimestres **Q4 2026 (upcoming) + Q3 2026 (reportado hoy)**; consenso: **usar el snapshot BBG del 21-jul y avisarlo**; KPIs propios: **plataformas + márgenes guiados**; llamada: SAB pegó la transcripción oficial de hoy → `docs/calls/TSM-latest.md`.
- Código: `js/overviews/tsm-ce.js` = extracción automática de `amzn.js` (cierre de dependencias desde ceQPills, ceSetupBody, ceResultsBody, ceWatchBody, gBuildCeAnnual, wireCallEarnings, wireCeTrack, wireThemeRecord, editor ✎ y persistencia; 98 piezas → 2,159 líneas) con los cambios de la lista de SN: datos en `tsm-ce-data.js`, `TSM_THEMES`, `TSM_SEG_ORDER`, `CE_MARGIN_DEN/CE_STMT_ORDER/CE_TOPLINE` y `ceGuessTarget` de TSMC, `TSM_SETUP`, `amzn*`→`tsm*`; sin Consensus Evolution (no hay bloque TSM).
- Datos: `TSM_CE_CONS` se arma al cargar desde `tsmResults` (sin números tecleados; $B a 1 decimal como AMZN). Para las 9 de encabezado se agregaron a Results 4 métricas trimestrales OCULTAS (EBITDA, OCF, D&A, acciones ADR-eq.) desde los estados financieros 6-K (YTD diferenciado) y los comunicados, con su consenso BBG en `map_tsm.json` (verify 415/0). `results-data/tsm-setup.js` (copia de amzn-setup) registrado como `TSM_SETUP`. `themes-data/tsm.js` vacío hasta EV-NOTES.
- Notas "?": guidance 4Q26 ($52.3–54.3B · GM 65–67% · OM 56.5–58.5%), FY2026 "around 44%" en US$, capex 2026 $60–64B, dilución 2nm y fabs en el exterior (~2% → 3–4%), citas de la llamada.
- Avisos aceptados: Street 4Q26 del 21-jul (antes del print) queda bajo el rango guiado; celdas de margen sin Street (BBG no trae consenso de margen); Summit vacío; sin Consensus Evolution.
- Cambios pedidos: ninguno.

### 2026-10-15 · EV-POST Evolution ▸ Earnings ▸ Post-Results — APROBADA
- Qué se mostró (Q3 2026): The print (tarjetas + gráfica de sorpresa vs Street BBG 21-jul; EBITDA/OCF/D&A sin real hasta los estados financieros de noviembre) · Call Summary: 7 temas preparados + 17 preguntas de 8 analistas (Citi, J.P. Morgan, TD Cowen, Morgan Stanley, UBS, BofA, Macquarie, Stifel) con respuestas en cita textual · Propose Notes: 6 temas para Q4 2026 · Also on the call: 6 puntos.
- Fuente: transcripción oficial pegada por SAB → `docs/calls/TSM-latest.md`. Venía DOS veces, byte-idéntica; se dejó una copia (anotado en el encabezado del archivo).
- Arreglo en la copia (defecto de amzn.js con líneas en %): los márgenes salían sin "%" y con un "crecimiento" en la tarjeta; `ceFmtV/ceTkFmt` formatean "%" y las líneas en % no llevan base de crecimiento. Hecho en el generador (`make_tsm_ce.py`), no a mano.
- Cambios pedidos: ninguno.

### 2026-10-15 · EV-NOTES Evolution ▸ Earnings ▸ Notes — APROBADA
- Semilla `js/themes-data/tsm.js`: 5 temas (AI & HPC demand · Leading-edge technology · Margins & overseas fabs · Capacity & capex · Consumer & smartphone), 13 hilos, todos con notas de la llamada del 3Q26 (no hay transcripciones anteriores en el repo).
- `js/segments.js`: THEME_SRC/THEME_SEG para TSM ('AI & HPC demand' → hpc, 'Consumer & smartphone' → smart) — Top Line ▸ Segments ▸ "What management has said" ya lee la semilla.
- Recordatorio: al primer guardado desde el portal el registro vive en Supabase y la semilla deja de leerse (§24).
- Cambios pedidos: ninguno.

### 2026-10-15 · Decisión de SAB — Summit codificado, no en vivo
- "El de summit acuérdate que no va a estar en vivo, se va a codificar directo porque no era eficiente crear el MCP para que sea en vivo."
- Efecto: EV-EST, VA-TM y VA-SENS dejan de estar ⛔; las series Summit (Results, Top Line, Setup, Bottom Line) se llenan desde un snapshot congelado del MCP, con fecha. Contradice la regla 10 del playbook ("no Summit numbers in code") — guía actualizada el 2026-10-16 con aprobación de SAB.

### 2026-10-16 · BL-GEN Bottom Line ▸ General — APROBADA
- Qué se mostró (portal real, sesión de SAB): Margins (Annual/Quarterly, actual + consenso BBG 2026E–2028E) · The bridge (revenue → OI; FY25 $122.4B → $62.2B) · Net income walk (OI → interés neto → otros no operativos → impuestos → minoritarios → neto; FY25 $62.3B → $55.3B) · Expense lines (costo de ventas, R&D, G&A, Marketing, otros operativos netos).
- Código: copia de la clausura de `amzn.js` en `js/overviews/tsm-bl.js`; datos `tsm-bl-data.js` (6-K y 20-F, US$ por suma de trimestres) y `tsm-bbg.js` (`bbg_extract.py TSM`, as of 7/21/2026). Cuadres: margen bruto 2018 48.3 % y 2Q26 67.7 % = TSMC.
- Omitidas: BL-GEN-4 (SBC, decisión SAB) y BL-SEG (un segmento, Note 38).
- Pendiente: la serie Summit congelada reemplaza el aviso "Live data pending" (Conexiones pendientes).
- Cambios pedidos: ninguno.

### 2026-10-16 · BL-SPLC Bottom Line ▸ Supply Chain — APROBADA
- Qué se mostró (portal real): aviso "Top 20 suppliers only" + lede · 5 KPIs (20 proveedores · 11 equipo / 9 materiales · 10 de 20 con sede en Japón · 9 de 20 divulgados por el proveedor · ASML 15.3 % del capex) · Cadena 1 equipo (11 tarjetas con modal) · Cadena 2 materiales (tabla `.rs-ft`) · Who needs whom (top 10 por % del ingreso del proveedor) · geografía por país sede con tabla · pie.
- Datos: `nvidia-map-reference/SPLC_BBG.xlsx`, bloque de proveedores de 2330 TT Equity, compilado a mano en `js/overviews/tsm-splc.js` (el lado proveedores no tiene cargador, §13). Relaciones fechadas 22-may-2025 a 25-jun-2026, periodos mezclados (trimestre / año / periodo calendario) → orden por % del costo, cada monto con su periodo.
- Limitación dicha primero: sin universo de proveedores, sin instalaciones, sin geografía por instalación. Categorías y lecturas = Summit (lo dice el pie).
- Desviaciones de AMZN: tabla `.rs-ft` en vez de `.ce-tbl`; la gráfica de geografía lleva tabla; estilos en `css/overview.css` (`.ov-tsm-dd .tsm-splc-*`).
- Cambios pedidos: ninguno.

### 2026-10-16 · VA-HIST Valuation ▸ Historic Multiple — APROBADA
- Qué se mostró (portal real): pestaña Valuation nueva, sub-tab Historic Multiple; 4 líneas (P/E fwd/trail, EV/EBITDA fwd/trail), NTM · Current FY · FY+1…FY+3 · LTM · Last FY, Daily/Quarterly/Annual, rangos, slider, tabla Detail, pie. Hoy: P/E fwd NTM 20.3× (rango 10.1–34.3× desde may-2019), P/E LTM 26.8× (incluye 3Q26), EV/EBITDA fwd 13.3×, trail 20.4×.
- Código: copia de `amzn-histmult.js` → `js/overviews/tsm-histmult.js` (script `scratchpad/hm/adapt_hm.py`); estilos en línea → `css/overview.css` (`.ov-tsm-dd .hm-*`); colores → tokens.
- Datos: precio en vivo (`get-market-history`, ya desplegada — responde). EPS por ADR y EBITDA: forward = `estMatrix.cons.y` (anual por snapshot, no suma de trimestres); trailing = reales de Results. Acciones = comunicados. Caja neta = `js/overviews/tsm-histmult-data.js` (balances 6-K 1Q22–2Q26, `scratchpad/hm/parse_bs.py` + `build_netcash.py`), escalonada en la fecha de cada 6-K; US$ al tipo promedio del trimestre. Fecha del 3Q26 desde `TSM_CALL_EARNINGS` (posterior al último snapshot BBG).
- Hallazgos para el PR: la ruta `ratios` de `get-market-history` falla para todos los tickers (también AMZN → sus líneas EV/EBITDA desaparecen sin aviso); en la copia se arregló una carrera de render al togglear chips rápido (AMZN la conserva).
- Cambios pedidos: ninguno.

### 2026-10-16 · VA-PEERS Valuation ▸ Peers — APROBADA
- Qué se mostró (portal real): lede + el mismo mapa de OV-6 (`stdPeerScatter('dd')`, mismo estado `A_SC`) + tabla "The numbers behind the map" abierta (Peer · múltiplo activo · crecimiento · market cap · vs peer avg; promedio y mediana ex-TSMC) + pie. Hoy, P/E trailing: TSMC 39.8× vs mediana 39.0× / promedio 57.5× (Tower 103.5× lo infla); EV/EBITDA trailing TSMC 25.1×.
- Código: tabla copiada de `amzn.js` (`aScTableOne` y helpers) en `js/overviews/tsm.js`; estilos `.asc-*` de su `<style>` en línea → `css/overview.css` (`.ov-tsm-dd`), colores a tokens (`--neg`/`--pos`/`--surface`). Lede sin "seeded… not live" (Annex A).
- Datos: los de OV-6 (denominadores de filings + forward BBG solo TSMC); precio, market cap y EV en vivo.
- Cambios pedidos: ninguno.

### 2026-10-16 · VA-TM Valuation ▸ Target Multiple / PEG — APROBADA
- Qué se mostró (portal real): bitácora de revisiones (Recorded multiple: EV/EBITDA 12× FY2027 → $413.63, P/E 19× → $410.28, blended $411.96, precio en vivo; Live con múltiplos propios que arrancan en 12×/19×) + tabla Snapshot detail (bandas EBITDA / Earnings; realized "pending · 31 Dec 2026") + pie (fair value $398.54 / $395.16 al WACC 19.3 %, distancia al precio en vivo, duda del EPS) + PEG (P/E 0.64 sobre +29.9 % de utilidad; EV/EBITDA 0.41).
- Código: copia de `amzn-target-multiple.js` → `js/overviews/tsm-target-multiple.js` (`scratchpad/hm/adapt_tm.py`): sin compuerta `TM_LIVE_READY`, sin `MOCK_*`/`REALIZED`/`SNAP_2026` tecleados; precios objetivo = los del workbook (no recalculados); deuda neta del Live = balance 6-K 2Q26 con su fuente en el pie (A23); estilos → `css/overview.css` (`.ov-tsm-dd .tm-*`); con un solo snapshot el punto va al centro y el precio en vivo se dibuja como marca.
- Datos: `js/overviews/tsm-target-multiple-data.js`, CONGELADO del MCP el 2026-10-16 (`get_valuation_history` + `get_fundamentals` DEFAULT, mapa F0-SM; consenso BBG del propio modelo). Un snapshot (2026-10-15, after 3Q26); cada submit nuevo agrega una fila.
- Verificado antes de congelar: el MCP ya tiene la valuación corregida por SAB (P/E ≠ EV/EBITDA; sin quality_flags) — se quita `valuationUnreliable` del mapa.
- Duda abierta (autor del modelo): la pierna P/E implica EPS FY2027 $21.59 vs EARNINGS ÷ SHARES $21.05 (→ $400 a 19×). La pierna EV/EBITDA cuadra con ~US$71.6B de caja neta.
- Cambios pedidos: ninguno.

### 2026-10-16 · VA-SENS Valuation ▸ Sensitivity — APROBADA
- Qué se mostró (portal real): año de valuación 2026–2029 (2027 por defecto = año del múltiplo del modelo) · Assumptions Summit model | Street (Bloomberg consensus) · exit EV/EBITDA | P/E (12× / 19× del modelo) · ejes X/Y con starts at / step / reset · franja "Held at …" · rejilla 5×5 (centro 2027 a 12× = $415) · tarjeta "What Street assumes" (HPC 41.8 % vs 50.6 %, margen 58.6 % vs 56.9 % → $399) · tarjetas 2026–2029 ($325 / $415 / $525 / $659) · pie.
- Código: copia de `sharkninja-sensitivity.js` (estructura de un solo segmento que pide §14) → `js/overviews/tsm-sensitivity.js` (`scratchpad/hm/adapt_sens.py`); datos `js/overviews/tsm-sensitivity-data.js` CONGELADO del MCP (snapshot 2026-10-15); año base 2025 = plataformas reportadas (Results); Street leído de `tsmResults` (cons anual) y `tsm-bbg.js` (oi ÷ revenue), sin teclear; deuda neta = balance 6-K 2Q26 (A23); `keepDistinct` traído de AMZN; arreglados en la copia: `bindRange` que capturaba el objeto viejo (los inputs morían tras cambiar un eje) y "−$0M"; estilos → `css/overview.css`.
- Reconciliación dicha en el pie (A26): EBITDA base = el de Target Multiple; la diferencia de precio ($415 vs $413.63) es la deuda neta (balance vs la del workbook).
- Duda nueva (autor del modelo): desde 2026 el REV del modelo = suma de 5 plataformas; PLAT_OTHER_REV ($3.3B en 2026) se proyecta pero queda fuera del total (en los reales de TSMC "Others" sí suma).
- Cambios pedidos: ninguno.

### 2026-10-16 · Series Summit en EV-RES, EV-SET, TL-*, BL-GEN — APROBADA
- Qué se mostró (portal real): serie "Summit model" del snapshot 2026-10-15, congelada en `js/results-data/tsm.js` (`scratchpad/hm/freeze_results.py` + `freeze_hist.py`): forward 4Q26–2Q27 (hoja SEGM: revenue, plataformas, utilidad bruta y operativa) y FY2026–FY2028 (más EBITDA, utilidad neta, EPS, capex); historia del modelo 1Q22–3Q26 y FY2022–FY2025 (decisión SAB). Setup Q4 2026 lee `setup.us` del mismo dataset (`summitUs('4Q26')` en `tsm-ce-data.js`); Top Line extiende su eje a los periodos forward; Bottom Line lee las filas anuales del modelo. Avisos "Live data pending" de Summit quitados en todo TSM.
- Advertencias escritas en las fuentes: en periodos reportados la serie es la historia del modelo, no un estimado previo al print, y no cuadra con lo reportado (2Q23 $23.5B vs $15.7B; FY2023 $92.6B SEGM / $66.9B DEFAULT vs $69.3B). El 4Q26 del modelo ($47.5B) está por debajo de la guía de TSMC ($52.3–54.3B): el snapshot parece previo a incorporar el print del 3Q26.
- Pendiente fuera de TSM: el letrero fijo de `results.js` ("showing the estimate that stood before each print") no aplica a TSM — PR aparte del motor.
- Incidente: un apóstrofo sin escapar en `source` rompió la carga del portal unos segundos; corregido y verificado.
- Cambios pedidos: ninguno.

### 2026-10-16 · MG-TEAM Management ▸ Executives & Board — APROBADA
- Qué se mostró (portal real): sección Management nueva (después de Valuation), sub-tab `team`; lede · 6 tarjetas (Wei a todo lo ancho con foto; Chyn, Mii, Huang, Fang, Zhang) con modal de bio · consejo completo (10: 7 independientes, presidentes de comité) · 3 celdas de gobierno · pie.
- Código: motor compartido `makeManagement` (`js/overviews/management.js`), montado en `js/overviews/tsm-mgmt.js` como en AMZN/SN; datos `js/overviews/tsm-mgmt-data.js`; `TSM_MGMT.init(root)` en `deepDiveInit`.
- Fuente: 20-F FY2025 Item 6 (al 28-feb-2026) y Board Practices; TSMC no presenta proxy. Bios condensadas del 20-F; `line` = Summit.
- Corrección a la propuesta: el comité de Nominating, Corporate Governance & Sustainability incluye al CEO (no es 100 % independiente); el 20-F no nombra consejero independiente líder.
- Fotos: `img/leadership/tsm-wei.jpg` (tsmc.com, con permiso de SAB). Las otras 5 salen con iniciales — decisión final de SAB (16-oct): no se agregan fotos, no queda como pendiente.
- Cambios pedidos: ninguno.

### 2026-10-16 · MG-OWN Management ▸ Ownership — APROBADA (insiders)
- Primera versión (copia de amznOwnBody: KPIs + 3 cajas + capital devuelto) RECHAZADA por SAB: quiere una tabla estructurada, insiders primero y luego fondos.
- Qué quedó: lede de una línea · tabla de los 36 consejeros y ejecutivos (20-F Item 6, al 18-mar-2026): #, nombre (+ nota), cargo, acciones comunes, ADSs, ADS-equivalente, % out, valor a precio ADR en vivo; filtro All / Board / Executive officers; fila de total (12.3M ADS-eq., 0.24 %) · nota (grupo 60.2M acciones al 28-feb, exclusiones, Yeh sin acciones personales) · hueco de Fiscal.ai (TSM fuera del plan) · pie.
- Formato: tablas estándar del portal `.twrap` + `.rt` (css/shared.css), a pedido de SAB; quitada la fila del National Development Fund (SAB).
- Código: `tsmOwnBody` / `tsmOwnInit` en `js/overviews/tsm-mgmt.js`; datos `TSM_INSIDERS` en `tsm-mgmt-data.js` (parseados del 20-F). Lección: `.own-bar` ya existía como clase global (barra gris) — renombrada `.own-ctl`.
- Pendiente: toggle "Top holders" con fondos desde Bloomberg HDS (SAB exporta). Dividendos y SBC pasan a Governance.

### 2026-10-16 · MG-GOV Management ▸ Governance & SBC — APROBADA
- Qué se mostró (portal real): lede · 4 KPIs (7 de 10 independientes / Chair+CEO; CEO US$77.2M 2025; profit sharing NT$103.1B = US$3.3B, 2.7 % del revenue; SBC NT$1.2B ≈ US$39M) · tabla "Executive pay, 2025" (Wei, Huang, resto en agregado, total US$288.8M) · tabla "Board committees" (3 comités, presidentes, miembros, composición, 4 reuniones c/u) · tabla "Pay pool and capital returned" 2023–2025 (profit sharing, SBC, consejo, dividendos pagados, recompras) · nota "cómo se paga" · pie.
- Formato: tablas `.twrap` + `.rt` del portal (preferencia de SAB en MG-OWN), no las cajas de AMZN; sin repetir KPIs de Ownership.
- Fuente: 20-F FY2025 Item 6 Compensation y Board Practices; Note 29; estados de cambios en el patrimonio (SBC) y de flujos (dividendos, acciones propias). Código `tsmGovBody` en `tsm-mgmt.js`, datos `TSM_GOV` en `tsm-mgmt-data.js`.
- Cambios pedidos: ninguno.

### 2026-10-16 · MG-TRACK Management ▸ Track Record — APROBADA
- Qué se mostró (portal real): lede · 6 tarjetas en 2 columnas (Wei, Mii, Chyn, Huang, Zhang, Fang) con rol · año de ingreso · "At TSMC" (resultados medibles) · "Context" (trayectoria) · modal "Full track record" (rama `exec:` en `wireModal`) · recuadro "The bench, in one line" · pie.
- Sin calificaciones (decisión SAB): tarjetas con el acento Summit, sin leyenda ni veredicto; el pie lo dice.
- Fuentes: 20-F FY2025 Item 6 (roles y fechas), cifras reportadas del portal (revenue US$, mix de plataformas, margen bruto, caja neta 6-K), 20-F (dividendos, N2 en volumen 2025), llamada 3Q26 (cita del CFO sobre la dilución de las fábricas del exterior).
- Código: `tsmTrackBody` / `tsmTrackPop` en `tsm-mgmt.js`; datos `TSM_TRACK` en `tsm-mgmt-data.js`; estilos `.trk-*` en `css/overview.css` (copia de SN/AMZN sin los hex de calificación).
- Cambios pedidos: ninguno.

### 2026-10-16 · Perfil TSM — DADO POR TERMINADO (SAB)
- SAB da el perfil por terminado con 33 de 38 unidades aprobadas y 2 omitidas.
- Quedan como agregados futuros, no como bloqueos del perfil: EV-EST (con el 2º snapshot Summit), MISC (análisis TSMC + ASML de SAB) y el toggle "Top holders" de Ownership (export HDS de Bloomberg).
- Fotos: solo C.C. Wei; los otros 5 con iniciales por decisión de SAB (no es pendiente).

### 2026-10-16 · MISC-fabs Miscellaneous ▸ Fabs & Capacity — APROBADA
- Origen: vistas "Map" y "Capacity" del dashboard independiente de SAB (`tsmc_dashboard_v7.html`, 16-oct); SAB eligió traer solo histórico (los supuestos forward esperan sus decisiones) e incluir estimados de terceros marcados.
- Qué se mostró: 5 KPIs (16 fabs en operación · 5 países · >17M wafers 2025 · 4.48M wafers 3Q26 · CoWoS ~127K 2026E estimado) · mapa mundial estático (`js/overviews/world-map-data.js`, generado de world-atlas 110m — el CSP bloquea bajarlo en vivo) con un marcador por sitio y zoom World/East Asia/Taiwan/U.S./Europe; modal por sitio (`fab:`) · directorio de 24 fabs (`.twrap/.rt`; año, wafer y nodo del 20-F; capacidad por fab marcada *estimate*) · envíos trimestrales 4Q19–3Q26 + tabla · CoWoS 2022–2026E (estimado) + tabla · pie.
- Diferencia con el dashboard: Fab 12 — el 20-F da 40 nm como nodo más avanzado en volumen (el dashboard decía N7/N10/N16); se muestra el del 20-F con nota.
- Fuera (forward/estimado de reparto): capacidad por nodo y región, rampas, línea de tiempo futura.
- Código: `js/overviews/tsm-fabs.js` + `tsm-fabs-data.js`; sección `misc` nueva en `tsm.js`.
- Cambios pedidos: ninguno.

### 2026-10-16 · MISC-asml Miscellaneous ▸ TSMC × ASML — APROBADA
- Origen: vista "ASML" del dashboard v7 de SAB. Primera versión (solo histórico: 5 KPIs + mayor cliente de ASML + ASML en el capex de TSMC + EUV por cliente) — SAB pidió "todo lo necesario" sin relleno.
- Agregado (SAB eligió las 4 piezas): ventas de ASML por grupo de cliente 2019–2025 (TSMC / Samsung estimado / resto, con el % de TSMC; reemplaza la gráfica del mayor cliente, 2017–18 en nota) · techo EUV de ASML vs entregas vs TSMC 2024–2030 (reportado/guiado sólido, modelo tenue) · economía por equipo (tabla, estimado) · EUV → capacidad N2 2024–2030 (gráfica + tabla; 2026–30 = modelo de SAB, marcado).
- No se trajo: las notas en prosa del mix de herramientas (repiten las tablas).
- Fuentes: ASML 20-F/Annual Reports, ASML Q3 2026 (14-oct), TSMC 20-F, ASML Investor Day nov-2024, dashboard de SAB. ASML no nombra a su mayor cliente: identificado como TSMC por cruce con ventas en Taiwán (dicho en el pie).
- Código: `js/overviews/tsm-asml.js` + `tsm-asml-data.js`.
- Cambios pedidos: ninguno.

### 2026-10-28 · VA-SUB Submit History — 👀 EN REVISIÓN
- Qué se mostró: Valuation ▸ Submit History en localhost (entre Target Multiple y Sensitivity).
- Fuentes: MCP `get_valuation_history('TSM')` + `get_metric_snapshot_series` (REV, OP_INCOME, EBITDA, EARNINGS, SHARES · 2026–2027), jalado 2026-10-28; precio Massive (ADR).
- Ojo: OP_INCOME = 0 en el MCP para ambos submits (null en el archivo); caso "0" en vez de "Base" — los dos para Oscar.
