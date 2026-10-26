# SOFI — bitácora de construcción del perfil

> Reglas: `docs/PROFILE_PLAYBOOK.md` §3.
> Claude la lee completa al empezar cada sesión y la actualiza en cada aprobación (no al final).
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)

| Campo | Valor |
|---|---|
| Empresa | SoFi Technologies, Inc. (NASDAQ: SOFI) |
| Modo | B — reordenar existente (perfil viejo, `js/overviews/sofi.js`, 3,799 líneas, un solo archivo) |
| Rama | `feat/sofi-profile` (desde `origin/main` @ `95c00e0`) |
| Analista responsable | Dani (Daniel Alvarez) |
| Inicio | 2026-10-26 |
| Avance | 0 de 39 unidades aprobadas · F0 y B1 en propuesta |

**Regla de esta sesión (analista, 2026-10-26):** el perfil es viejo y puede tener cosas que ya no aplican
a la convención actual (la de META / TSM / AMZN). Lo que claramente contradice la convención se puede
quitar, **pero ante la duda se conserva y se confirma con el analista antes de podar**. Que algo se haya
construido antes no es razón para quedarse, ni para irse. Esto es más estricto que la regla 1 del playbook
solo en un punto: aquí "podar" siempre pasa por una pregunta explícita pieza por pieza (§5).

## 1. Inventario de datos (F0)

Revisado 2026-10-26. ✔ verificado hoy · ❓ por verificar.

| Fuente | ¿Existe? | Detalle | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | ✔ (el perfil ya abre hoy) | `SOFI: sofiOverview` en `js/overviews/index.js:33` | el perfil abre | — |
| Filing anual / trimestral | ✔ | 10-K FY2025 (31-dic-2025) y 10-Q 2Q26 (30-jun-2026) en Drive (`Ad hoc info search\SOFI`). Forma 10-K (empresa doméstica, calendario, USD). Número de acceso EDGAR: por anotar | Overview, Top Line, textos verbatim, cuadre F0-SM | todo |
| Año fiscal / moneda | ✔ (por el perfil viejo) | cierre 31 dic, USD. Sin ajustes de FX | — | — |
| Summit DCF | ✔ (MCP autenticado 2026-10-26) | 3 snapshots: `2026-02-03`, `2026-04-29`, `2026-08-05`; 92 etiquetas, 23,298 hechos cada uno, USD millones. El último trae **2Q26 ya real** (llamada del 2026-07-29). **Ninguna valuación** (`get_valuation_history` → `no_valuations_for_ticker`). El perfil viejo citaba el snapshot `2026-05-13`, que **ya no existe** en el MCP | F0-SM, serie Summit, Estimates (3 snapshots, necesita ≥ 2 ✔) | Target Multiple sin múltiplo ni precio objetivo del modelo (⏭️ propuesto) |
| Consenso BBG | ✔ (agregado 2026-10-26 por el analista) | `inspect_matrix.py SOFI`: 18 snapshots, 2022-05-15 → 2026-10-26. Core: Net Revenue, Non-Interest Expense, Adjusted EBITDA, Income Tax, Adjusted Net Income, Diluted Shares, Diluted EPS, D&A, SBC (+ Other Non-Op sin datos). 23 KPIs: miembros, originaciones PL/SL/HL, saldos, depósitos, deuda, Loan Platform Fees, líneas de opex y Provision for Credit Losses. Horizontes fq-4…fq+4, fy-2…fy+3 | `estMatrix.cons`, Setup, export de Bottom Line | ver dudas ❓ BBG abajo |
| `get-market-history` (Massive) | ❓ | estado de despliegue por verificar | Historic Multiple en vivo | "Live data pending" |
| `get-quote` (Yahoo, hoy lo usa SOFI) | ❓ | CLAUDE.md dice "Not yet deployed"; el perfil viejo cae a un precio fijo $17.57 | precio en vivo | regla 10: el precio no se siembra |
| SPLC | ❓ | no se buscó todavía en `nvidia-map-reference/` ni exports de Drive | BL-SPLC, TL-CUS | probable ⏭️: SoFi es banco/fintech de consumo |
| Transcripciones | ✘ en repo | `docs/calls/` no tiene SOFI. Quartr por consultar | EV-POST, EV-NOTES, citas | — |
| Fiscal.ai (plan) | ❓ | hoy Management usa **Form 4 sembrado a mano** (`INSIDER_TX`) | tabla en vivo de Management | hueco "not available on current plan" |
| Massive (`liveQuote`) | ❓ | probar en la vista previa | market cap, peers | — |
| Fotos | ❓ | el perfil viejo usa iniciales (`orgInitials`) | Management | iniciales |

**Escalera de capacidades provisional:** con consenso BBG ya hay `estMatrix`, Setup y el export de Bottom Line; Summit (Estimates, Target Multiple, Sensitivity) espera la autenticación del MCP. Se confirma al cerrar F0.

**Alcance acordado:** pendiente (compuerta F0).

## 1b. Mapa Summit (F0-SM)

📝 **Primera pasada, 2026-10-26** — snapshot `2026-08-05` (source 14:50 UTC), moneda USD, escala millones, 92 etiquetas.
**Cuadre contra 10-K / 10-Q hecho 2026-10-26 (ver abajo): 3 diferencias abiertas.** Falta la confirmación del autor del modelo en las ❓. El archivo `js/summit-map/sofi.js` todavía **no** está escrito (se genera al aprobar).

**Cómo está armado el modelo (lo que el MCP no dice):**
- Todas las etiquetas dicen `USD · millions · sum`, incluidas conteos, saldos, tasas y precios; la unidad real va abajo.
- Hay tres fuentes: `DEFAULT` (core consolidado), `SEGM` (segmentos y KPIs) y `BBG` (4 etiquetas de consenso, sólo anuales).
- **`REV` (DEFAULT) es ingreso bruto, no neto:** FY25 `REV` 4,770 = `SEG_REVENUE` 3,613 + gasto por intereses 1,156. El "total net
  revenue" que usa SoFi y el perfil viejo ($3.61B) es **`SEG_REVENUE`** (2Q26: 1,197 = `NIM_REVENUE` 788 + `NII_REVENUE` 409 ✔).
- Último real: **2Q26** (trimestral). 2026 anual y 2026Q3+ son proyección Summit.
- `EARNINGS` = utilidad neta **ajustada** (2Q26 160.4); `NET_INCOME_GAAP` = GAAP (2Q26 156.6); coinciden en FY25 (481.3).
- La valuación no se mapea (no existe para SOFI).

| Etiqueta MCP | Rol | Clave portal | Qué es, en una línea | Unidad real | Agregación | Cuadre / evidencia | Confianza |
|---|---|---|---|---|---|---|---|
| `SEG_REVENUE` | core | `rev` | Ingreso neto total (NII + no financiero) | USD M | suma | FY25 3,613 = perfil viejo ✔; 2Q26 = 788 + 409 ✔ | ✔ FY25 · ✘ 2Q26 (−21.7) |
| `REV` | core | — | Ingreso **bruto** (neto + gasto por intereses) | USD M | suma | 4,770 − 1,156 = 3,613 ✔ | ✔ (no usar como `rev`) |
| `NIM_REVENUE` | segment | `nii` | Ingreso neto por intereses | USD M | suma | `II_REVENUE` + `IE_REVENUE` ✔ | ✔ |
| `II_REVENUE` · `IE_REVENUE` · `LII_REVENUE` · `IEBIBD_REVENUE` · `IETD_REVENUE` | segment | `int.*` | Ingreso por intereses · gasto (negativo) · de préstamos · gasto de depósitos con interés · (todo 0) | USD M | suma | II 1,141 + IE −352 = 788 ✔ | ✔ · `IETD` ignore (0) |
| `NII_REVENUE` | segment | `nonint` | Ingreso **no financiero** (el nombre engaña: no es "net interest income") | USD M | suma | 1,197 − 788 = 409 ✔ | ✔ ⚠ nombre |
| `LPB_REVENUE` · `LPBO_REVENUE` · `LPBR_REVENUE` | segment | `lpb.*` | Loan Platform Business: total · originación · referral | USD M | suma | 140.9 = 116.6 + 24.4 ✔ | ✔ |
| `TP_REVENUE` | segment | `tp.rev` | Ingreso Technology Platform | USD M | suma | FY25 360.9 = perfil viejo ✔ | ⚠ falta 10-K |
| `OTHER_REVENUE` · `SERVICING_REVENUE` · `LOSS_REVENUE` | segment | `other.*` | Otros ingresos · servicing · `LOSS_REVENUE` ❓ | USD M | suma | — | ❓ `LOSS_REVENUE` |
| `NIE` | core | `nie` | Gasto no financiero total | USD M | suma | = `SME`+`GAE`+`TPDEV`+`COO`+`PCL` (2Q26 1,014.4 ✔) | ✔ |
| `SME` · `GAE` · `TPDEV` · `COO` · `PCL` | segment | `opex.*` | Ventas y marketing · G&A · tecnología y desarrollo · costo de operaciones · provisión de pérdidas (decodificados por aritmética) | USD M | suma | la suma cuadra con `NIE` ✔ | ⚠ confirmar nombres |
| `OP_INCOME` | core | `opinc` | Utilidad operativa | USD M | suma | 1,197 − 1,014 = 183 ✔ | ✔ |
| `ITE` · `ISB` | segment | `tax.*` | Gasto de impuestos (`ITE`) · `ISB` ❓ (30 en 2Q26, 0 en FY25) | USD M | suma | — | ❓ `ISB` |
| `TAX_RATE` | core | `tax_rate` | Tasa efectiva | **fracción** (0.261 = 26.1%) | promedio | FY25 8.5% | ⚠ |
| `EARNINGS` | core | `earnings` | Utilidad neta **ajustada** | USD M | suma | FY25 481.3 ✔ | ✔ |
| `NET_INCOME_GAAP` | core | `ni_gaap` | Utilidad neta GAAP | USD M | suma | 2Q26 156.6 | ✔ |
| `ADJ_NET_INCOME` | core | — | Idéntica a `EARNINGS` en todos los periodos vistos | USD M | suma | = `EARNINGS` | ⚠ duplicada, ¿ignore? |
| `EBITDA` · `ADJ_EBITDA` | core | `ebitda` | EBITDA ajustado (idénticos en todos los periodos vistos) | USD M | suma | FY25 1,054 = perfil viejo ✔ | ⚠ duplicada |
| `SHARES` | core | `shares` | Acciones diluidas promedio | **millones de acciones** | promedio | FY25 1,252 | ⚠ confirmar base |
| `DNA` · `SBC` · `CAPEX` | core | `dna` · `sbc` · `capex` | D&A · compensación en acciones · capex (signo −; trimestral vacío, sólo FY25 −242.4) | USD M | suma | — | ⚠ `CAPEX` trimestral |
| `CFO` · `FCF` | core | `cfo` · `fcf` | Flujo operativo y libre — FY25 **−3,742 / −3,985** (préstamos mantenidos para venta); trimestral 0 | USD M | suma | — | ⚠ no usar sin explicar |
| `INT_INC` · `INT_EXP` | core | `int_inc` · `int_exp` | Ingreso/gasto por intereses consolidados; `INT_EXP` anual = 0 pero trimestral −352 | USD M | suma | `INT_INC` 2Q26 = `II_REVENUE` ✔ | ⚠ `INT_EXP` FY25 vacío |
| `MEMB` | kpi | `members` | Miembros totales | **miles** (13,650 = 13.65M ✔ perfil viejo) | fin de periodo | 2Q26 15,810 | ✔ ⚠ unidad |
| `PPM` · `FSPPM` | kpi | `ppm` | Productos por miembro · productos de Financial Services por miembro | x (1.54) | fin de periodo | — | ✔ |
| `FSP` · `TPA` | kpi | `fsp` · `tp.accts` | Productos de Financial Services (miles) · cuentas habilitadas de Technology Platform (miles; 134,800 = 134.8M) | miles | fin de periodo | `TPA` FY25 128.5M = perfil viejo ✔ | ✔ |
| `TPRPA` | kpi | — | Ingreso por cuenta de Technology Platform | USD | — | — | ❓ definición (0.42 / 2.81) |
| `PLOV` · `SLOV` · `HLOV` · `LOV` | kpi | `orig.*` | Originaciones: personal · estudiantil · hipotecario · total | USD M | suma | 10,720 + 2,687 + 1,393 = 14,800 ✔ (2Q26) | ✔ |
| `PNO` · `PLPBO` | kpi | `orig.pl.*` | Originaciones personales: con balance propio · vía Loan Platform | USD M | suma | `PNO` + `PLPBO` = `PLOV` (7,618 + 3,100 ✔) | ✔ |
| `PLB` · `SLB` · `HLB` | kpi | `bal.*` | Saldo de préstamos: personal 26.2B · estudiantil 16.0B · hipotecario 1.9B | USD M | fin de periodo | — | ⚠ `HLB` salta 541 → 1,887 (2Q25 → 2Q26) |
| `TNL` · `TNPL` · `TNSL` · `TNHL` · `TNLO` · `TNPLO` · `TNSLO` · `TNHLO` | kpi | `n.*` | Número de préstamos (total / personal / estudiantil / hipotecario) y sufijo `O` | miles | fin de periodo | `TNL` 3,093 | ❓ unidad y sufijo `O` |
| `AVGPL` · `AVGSL` · `AVGHL` | kpi | `avg.loan.*` | Tamaño promedio de préstamo (USD: 25,360 / 45,900 / 232,300) | USD | promedio | — | ❓ |
| `PLBPM` · `SLBPM` · `HLBPM` · `LBPM` · `LPBPM` · `LPPM` | kpi | `perm.*` | Razones "por miembro" | USD | — | sin comprobar | ❓ |
| `DBPM` · `DBORPM` | kpi | `dep.perm` | Depósitos por miembro (USD) · `DBORPM` ❓ | USD | — | `DBPM` = 41.9B ÷ 15.81M = 2,651 ✔ | ✔ · ❓ `DBORPM` |
| `IBD` · `IBDB` · `IBL` · `IEA` · `LIEA` · `TDB` | kpi | `bs.*` | Depósitos con interés · `IBDB` ❓ · pasivos con interés · activos que generan interés · `LIEA` ❓ · `TDB` ❓ | USD M | fin de periodo | `IEA` 52.9B (2Q26) | ❓ |
| `CCB` · `CCBB` · `NPRM` · `SRPM` · `LOSS` | kpi | — | sin identificar | ? | ? | — | ❓ |
| `ADJ_EBITDA_LOW_GUIDANCE` · `ADJ_EBITDA_HIGH_GUIDANCE` · `REV_LOW_GUIDANCE` · `REV_HIGH_GUIDANCE` | guidance | `guid.*` | Guía de la empresa — **todas en 0** en FY25, 2Q25 y 2Q26 | USD M | — | — | ⛔ vacías; la guía sale de los 8-K y las llamadas |
| `REV_BBG_EST` · `EBITDA_BBG_EST` · `EARNINGS_BBG_EST` · `SHARES_BBG_EST` | consensus | `cons.*` | Consenso BBG embebido en el modelo (sólo FY25, `source=BBG`) | USD M | suma | FY25 3,560 / 1,037 / 460 / 1,231 | ⚠ sólo anual; se usa el workbook de consenso |

**Resumen:** 92 etiquetas, todas incluidas arriba (agrupadas por familia). La clasificación por rol es provisional: se cuenta exacta al aprobar el mapa.

### Cuadre del modelo contra los filings (2026-10-26)

Filings: **10-K FY2025** (año al 31-dic-2025) y **10-Q 2Q26** (trimestre al 30-jun-2026), ambos en
`G:\My Drive\Summit\Docs\Extras\Team\DAA\Ad hoc info search\SOFI\`. Cifras en USD miles del filing → millones.

| Concepto | Modelo (snapshot 2026-08-05) | Filing | Δ | |
|---|---|---|---|---|
| Ingreso neto GAAP FY25 | `SEG_REVENUE` 3,613 | 3,613.4 | 0 | ✔ |
| Utilidad neta FY25 | `NET_INCOME_GAAP` 481.3 | 481.3 | 0 | ✔ |
| Ingreso neto GAAP **2Q25** | 854.9 | 854.9 | 0 | ✔ |
| Utilidad neta 2Q26 | `NET_INCOME_GAAP` 156.6 | 156.6 | 0 | ✔ |
| Ingreso neto por intereses 2Q26 | `NIM_REVENUE` 788.2 | 788.2 | 0 | ✔ |
| Ingreso por intereses 2Q26 / gasto 2Q26 | 1,141 / −352.3 | 1,140.5 / 352.3 | 0 | ✔ |
| Adjusted EBITDA 2Q26 | 357.8 | 357.8 | 0 | ✔ |
| Miembros 2Q26 | `MEMB` 15,810 mil | "más de 15.8 millones" | 0 | ✔ |
| Cuentas habilitadas Tech Platform 2Q26 | `TPA` 134,800 mil | "135 millones" | redondeo | ✔ |
| **Ingreso neto GAAP 2Q26** | `SEG_REVENUE` **1,197** | **1,218.7** (ajustado 1,205.6) | **−21.7** | ✘ |
| Ingreso no financiero 2Q26 | `NII_REVENUE` 409 | 430.5 | −21.5 | ✘ (mismo origen) |
| Tech Platform ingreso 2Q26 | `TP_REVENUE` 50.5 | línea "Technology products and solutions" 52.5 (ingresos por contratos del segmento: 50.5) | −2.0 | ⚠ |
| Tech Platform ingreso 2Q25 | 90.8 | línea "Technology products and solutions" 90.8 | 0 | ✔ |
| Tech Platform ingreso FY25 | 360.9 | línea "Technology products and solutions" 360.9 (el **segmento** Technology Platform reporta 450.2) | 0 | ✔ |
| Loan platform fees FY25 · Other noninterest FY25 | `LPB_REVENUE` 575.9 · `OTHER_REVENUE` 214.6 | 575.9 · 214.6 | 0 | ✔ |
| Other noninterest 2Q26 | `OTHER_REVENUE` 66.0 | 85.5 | −19.5 | ✘ (explica casi todo el −21.5 del ingreso no financiero) |

**Lo que significa:**
1. El 2Q26 "real" del modelo **no cuadra con el 10-Q** en ingreso neto (−$21.7M, 1.8%): ni con GAAP ni con el ajustado.
   El modelo parece tener una cifra preliminar o de otra fecha para 2Q26. Hasta que el autor la confirme, las series
   Summit de 2Q26 **no se muestran como real** (❓).
2. **Corrección (2026-10-26):** `TP_REVENUE` **no** es el ingreso del segmento. Es la línea consolidada "Technology products and solutions" del ingreso no financiero (FY25 360.9 y 2Q25 90.8 cuadran al dólar); el **segmento** Technology Platform reporta 450.2 en FY25. El perfil viejo la rotulaba "segment net revenue": error de etiqueta que no se copia. La diferencia de 2Q26 (−21.7 en ingreso neto) viene sobre todo de `OTHER_REVENUE` (66.0 vs 85.5) y un poco de tecnología (−2.0).
3. Las demás etiquetas que se pudieron cruzar (utilidad neta, NII, EBITDA ajustado, miembros, FY25) **sí cuadran al dólar**.

**Quién responde:** autor del modelo (celda del .xlsm del 2Q26 y de `TP_REVENUE`).

### Dudas

```
❓ SOFI · REV vs SEG_REVENUE — ¿`rev` del portal = SEG_REVENUE (neto)? REV (DEFAULT) es bruto.
   Lo que se ve: FY25 4,770 vs 3,613; la diferencia es el gasto por intereses, 1,156.
   Quién responde: analista. Mientras tanto: ninguna unidad usa REV.

❓ SOFI · EBITDA/ADJ_EBITDA y EARNINGS/ADJ_NET_INCOME — idénticas; ¿cuál es la fuente y cuál se ignora?
   Quién responde: autor del modelo. Mientras tanto: se usa EBITDA y EARNINGS.

❓ SOFI · CFO/FCF/CAPEX/INT_EXP — vacíos en trimestres; FY25 CFO −3,742 por préstamos mantenidos para venta.
   Mientras tanto: Bottom Line no muestra flujo de caja hasta aclararlo.

❓ SOFI · opacas (ISB, LOSS, LOSS_REVENUE, TPRPA, DBORPM, TDB, IBDB, LIEA, CCB, CCBB, NPRM, SRPM, salto de HLB)
   Quién responde: autor del modelo, con la celda del .xlsm. Mientras tanto: no se usan.

❓ SOFI · unidades — MEMB, TPA y FSP en miles; AVG* en USD; TAX_RATE fracción; SHARES en millones de acciones; todas dicen "USD millions".
   Se anotan aquí y en el mapa; ninguna se convierte en silencio.

❓ SOFI · guía — las 4 etiquetas de guía están en 0; la guía se saca de los 8-K y de las llamadas (SOFI_calls.txt).
```

```
❓ SOFI · SEG_REVENUE / NIE / SBC / PCL — los trimestres de Summit no suman al anual del mismo modelo
   Lo que se ve: ingreso 2026 = trimestres 4,866.7 (1Q26 1,100.4 + 2Q26 1,218.7 + 3Q26 1,207.4 + 4Q26 1,340.2) vs anual 5,317.5; 2027 = 6,952.6 vs 6,280.3. 1Q27 salta a 1,594 (+19% QoQ) desde 4Q26. NIE 2027 5,693.7 vs 4,876.5; SBC 2027 512.4 vs 390.1; PCL 2027 47.7 vs 60.5. EBITDA, utilidad, SBC y PCL de 2026 sí cuadran (diferencia ≤ 0.1).
   Quién responde: autor del modelo. Mientras tanto: se muestra tal cual con la advertencia en la nota; no se fuerza el cuadre.
```

### Cambios del mapa

- 2026-10-26 · snapshot 2026-08-05 · primera pasada — falta cuadre contra filing y el archivo `summit-map/sofi.js`.

## 2. Tablero de unidades

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | 📝 | 2026-10-26 | | | esperando compuerta |
| B1 | Inventario de lo que existe | 📝 | 2026-10-26 | | | §5 abajo (34 filas por función; conteo fino pendiente) |
| B2 | Mapa de reubicación | 📝 | 2026-10-26 | | | decisiones de #12 #13 #21 #23 #24 #25 #27 #29 #30 tomadas; faltan #1 #2 #4 #6 #7 #15 #17 #26 #31 #32 #33 y la aprobación del mapa completo |
| F0-SM | Mapa de métricas Summit | 📝 | 2026-10-26 | | | primera pasada; dudas ❓ abiertas |
| F1 | Esqueleto + vista previa | ✅ | 2026-10-26 | Dani | 7a0f231 | modo B: sin cambio de código (el perfil viejo ya corre); preview de Netlify del PR #152 listo; el analista confirma que SOFI abre ahí. Ojo: las funciones del portal limitan CORS a research-summit.netlify.app y localhost:8000, así que precio/Massive/Fiscal.ai pueden salir como no disponibles en el preview |
| OV-1 | Overview ▸ Key Facts | ✅ | 2026-10-26 | Dani | 326247d | 10 celdas del 10-K; celda CEO sin fecha hasta que Dani la confirme; market cap en vivo |
| OV-2 | Overview ▸ Descripción | ✅ | 2026-10-26 | Dani | 2341e93 | lede de 3 oraciones; cita de la misión → Misc |
| OV-3 | Overview ▸ Cuadrante 2×2 | ✅ | 2026-10-26 | Dani | 6664b2c | 4 celdas ≤ 30 palabras; The edge = banco + productos |
| OV-4 | Overview ▸ How it makes money | ✅ | 2026-10-26 | Dani | 110f4fe | solo vista Segments (el 10-K no trae geografía); acordeones por segmento + The revenue lines |
| OV-5 | Overview ▸ Products & platforms | ✅ | 2026-10-26 | Dani | 2c8e8db | 5 familias, 16 productos; modal por familia |
| OV-6 | Overview ▸ Competitors (peer map) | 👀 | 2026-10-26 | | | 5 peers + SoFi; Nu fuera; denominadores de EDGAR; módulo `sofi-peers.js` |
| OV-7 | Overview ▸ Timeline | 👀 | 2026-10-26 | | | 11 hitos en orden cronológico; 6 con Read more |
| OV-F | Overview ▸ Pie de fuentes | 👀 | 2026-10-26 | | | OV_SOURCES, único pie del Overview |
| EV-RES-DATA | Dataset de Results (números) | 👀 | 2026-10-26 | | | 17 métricas q + y; act, summit, cons; estMatrix cons + summit; guía de la empresa incluida (8-K y llamadas) |
| EV-RES | Evolution ▸ Results | 👀 | 2026-10-26 | | | primer sub-tab del Deep Dive; motor results.js |
| TL-GEN | Top Line ▸ General | ⬜ | | | | |
| TL-SEG | Top Line ▸ Segments | ⬜ | | | | |
| TL-OTH | Top Line ▸ Other | ⬜ | | | | |
| TL-CUS | Top Line ▸ Customers | ⬜ | | | | |
| EV-EST | Evolution ▸ Estimates | 👀 | 2026-10-26 | | | 8 métricas, 4 años × 3 snapshots Summit; sin serie de consenso |
| EV-SET | Evolution ▸ Earnings ▸ Setup | 👀 | 2026-10-26 | | | grilla de consenso por horizonte + gráfica Setup + notas de guía de 3Q26 |
| EV-POST | Evolution ▸ Earnings ▸ Post-Results | 👀 | 2026-10-26 | | | 2Q26 y 1Q26 completos (resumen, notas, discurso preparado, preguntas); 4Q25 en construcción |
| EV-NOTES | Evolution ▸ Earnings ▸ Notes | 👀 | 2026-10-26 | | | registro de temas vacío a propósito; el analista agrega notas en el portal |
| BL-GEN-1 | Bottom Line ▸ General ▸ Profitability & margins | 👀 | 2026-10-26 | | | sobre el motor Results (sección blprof) |
| BL-GEN-2 | Bottom Line ▸ General ▸ The bridge | ⬜ | | | | |
| BL-GEN-3 | Bottom Line ▸ General ▸ Op. income → net income | ⬜ | | | | |
| BL-GEN-4 | Bottom Line ▸ General ▸ Stock-based compensation | ⬜ | | | | |
| BL-GEN-5 | Bottom Line ▸ General ▸ Expense lines | 👀 | 2026-10-26 | | | 4 líneas funcionales + provisión + SBC, % del ingreso (sección blexp) |
| BL-SEG | Bottom Line ▸ Segments | ⬜ | | | | |
| BL-SPLC | Bottom Line ▸ Supply Chain | ⬜ | | | | |
| VA-HIST | Valuation ▸ Historic Multiple | ⬜ | | | | |
| VA-PEERS | Valuation ▸ Peers | 👀 | 2026-10-26 | | | mapa + tabla de números; mismo estado que el Overview |
| VA-TM | Valuation ▸ Target Multiple / PEG | ⬜ | | | | |
| VA-SENS | Valuation ▸ Sensitivity Analysis | ⬜ | | | | |
| MG-TEAM | Management ▸ Executives & Board | 👀 | 2026-10-26 | | | 10 ejecutivos + 9 consejeros del perfil viejo, marcados "seeded, dated" |
| MG-OWN | Management ▸ Ownership | ⬜ | | | | |
| MG-GOV | Management ▸ Governance & SBC | ⬜ | | | | |
| MG-TRACK | Management ▸ Track Record | ⬜ | | | | |
| MISC | Miscellaneous (una fila `MISC-<clave>` por sub-tab) | ⬜ | | | | aquí caerán Members, Loan Platform, Tech Platform, FICO, capital… |
| F-FINAL | Cierre y conciliación | ⬜ | | | | |

## 3. Decisiones del analista

- 2026-10-26 · general · Se sigue la convención más reciente (META, TSM, AMZN; playbook actualizado con el review de SAB del 2026-10-19) — Dani
- 2026-10-26 · general · Lo viejo que contradice la convención se puede quitar, pero ante la duda se conserva y se confirma antes de podar — Dani
- 2026-10-26 · B2 #12 #13 #25 · Rule of 40, Capital Raises y SOTP van a Miscellaneous (`MISC-rule40`, `MISC-capital`, `MISC-sotp`) — no tienen hogar en la convención y se conservan — Dani
- 2026-10-26 · B2 #21 #23 · Actuals vs Estimates y Evolution se rehacen con Results y Estimates sobre los 3 snapshots reales del MCP (el snapshot 05-13 ya no existe) — Dani
- 2026-10-26 · B2 #24 · Sensitivity conserva el diseño multi-driver de SoFi; base del snapshot 08-05 y precio en vivo sin fallback sembrado — Dani
- 2026-10-26 · B2 #27 #29 #30 · Peers e Insiders se conservan marcados "seeded, dated" hasta reemplazarlos con fuentes primarias — Dani
- 2026-10-26 · general · Quartr ya no se consulta (sin acceso); las llamadas vienen de `SOFI_calls.txt` que subió Dani — Dani
- 2026-10-26 · general · El PR #152 se mantiene en borrador, con aviso de no mergear, sólo para previsualizar desde otra computadora — Dani

- 2026-10-26 · F0-SM · Los desajustes pequeños entre el modelo Summit y los filings (2Q26 −$21.7M de ingreso neto, `TP_REVENUE`) y entre el consenso BBG y el DCF (métricas "close to" pero no idénticas, margen bajo) no bloquean: son aproximadamente comparables — Dani
- 2026-10-26 · general · El analista juzga el portal real abriendo el preview de Netlify del PR (https://deploy-preview-152--research-summit.netlify.app), no capturas ni harness; Claude no manda capturas salvo que se pidan — Dani
- 2026-10-26 · OV-1 · Las 4 tarjetas de KPIs, la nota FY2025 y la celda "Bank charter" salen del Overview y se **mueven** (no se borran): tarjetas → Top Line/Results, nota FY2025 → Bottom Line, Bank charter → lede y How SoFi makes money; las constantes quedan en `sofi.js` con comentario hasta entonces — Dani
- 2026-10-26 · OV-1 · Celda CEO: Dani confirma la fecha de inicio de Anthony Noto (el 10-K no la trae); mientras tanto la celda dice solo "Anthony Noto" — Dani
- 2026-10-26 · OV-2 · Lede aprobado como se propuso; la cita de la misión ("achieve financial independence…") se conserva en `DESC_LEGACY` y va a Miscellaneous — Dani
- 2026-10-26 · OV-3 · "The edge" = banco nacional que financia préstamos con depósitos propios ($37.5B) + miembros que adoptan más productos (Financial Services Productivity Loop) — Dani
- 2026-10-26 · OV-4 · Solo vista Segments (sin Geography: el 10-K no desagrega ingresos por geografía); Corporate/Other (−$227.8M, derivado: total reportado menos los tres segmentos) aparece solo en la leyenda; acordeón final "The revenue lines" con las 5 líneas del 10-K — Dani
- 2026-10-26 · OV-5 · 5 familias: Lending · Banking & cards · Investing & crypto · Member tools · Technology Platform — Dani
- 2026-10-26 · OV-6 · Peers: HOOD, NU, IBKR, SCHW, AFRM, UPST (+ SOFI); denominadores y crecimiento de EDGAR (10-K / 20-F del propio peer), sin agregadores — Dani
- 2026-10-26 · general · Nu queda fuera del peer map (Dani no sube el 20-F); los desajustes leves de datos son aceptables; Claude sigue ejecutando las unidades restantes y los gates se agrupan: Dani revisa en el preview y marca lo que no le convence — Dani
- 2026-10-26 · OV-1 · Celda CEO cerrada: "Anthony Noto · CEO since Mar 2018" (nombrado el 2018-01-23, efectivo 2018-03-01; fuente: sala de prensa de SoFi) — verificado por Claude
- 2026-10-26 · OV-6 · Peers finales: HOOD, SCHW, IBKR, UPST, AFRM (+ SOFI). Nu queda fuera. Las frases `why` de cada peer las propuso Claude (el analista las puede cambiar al revisar) — Dani / Claude
- 2026-10-26 · EV-RES-DATA · `act` = valores reportados de Bloomberg (últimos 5 trimestres y 3 años; cuadran con el 10-K / 10-Q) y, para lo anterior y las líneas de ingreso, el `actuals_history` del modelo; 2Q26 de interés neto (788.2) y de ingreso no financiero (430.5) se fijan con el 10-Q. `summit` = `projection_history` del snapshot 2026-08-05, congelado. `cons` = último snapshot BBG que aún traía el periodo como pronóstico. La guía de la empresa queda vacía hasta cargarla de los 8-K / llamadas — Claude, bajo la regla del analista de aceptar desajustes leves
- 2026-10-26 · EV-RES-DATA · La inconsistencia del modelo Summit (los trimestres de ingreso, gasto no financiero, SBC y provisión no suman al anual de 2026–27) **se publica con una advertencia en la nota de cada métrica**, no se corrige ni se fuerza el cuadre; es una duda para el autor del modelo — Claude (el analista pidió no frenar por desajustes)

## 4. Excepciones aceptadas

- 2026-10-26 · F0-SM · Cuadre contra filings con 3 diferencias abiertas (ingreso neto 2Q26, `TP_REVENUE`, etiquetas opacas) — se aceptan como aproximadas, pero **la serie Summit de 2Q26 se marca "model actual, does not tie to 10-Q" donde se muestre** y `TP_REVENUE` se rotula "Technology products and solutions", no "segment revenue" — Dani

## 5. Mapa de reubicación / B1 — inventario de lo que existe

Conteo de control (piezas originales): **pendiente** (hoy 34 filas agrupadas por función; falta contar abriendo el perfil en el portal
local, playbook §4.2 B1). Archivo: `js/overviews/sofi.js`.

Estructura actual (ocho pestañas propias, anterior al sistema compartido): **Overview · General · Interest
Income · Fee Income · Management · Valuation · Sensitivity · Peers**. La convención actual es Overview +
Deep Dive (Top Line · Bottom Line · Evolution · Valuation · Management · Miscellaneous). Columna **Marca**:
🟢 encaja en la convención y se reubica · 🟡 duda — se conserva y se pregunta · 🔴 contradice una regla del
playbook (candidata a podar, **solo con tu OK**).

| # | Pieza original (`sofi.js:función`) | Destino propuesto (convención actual) | Marca / por qué | Estado |
|---|---|---|---|---|
| 1 | `overviewBody` snapshot + KPIs (`SNAPSHOT`, `KPIS`) | Overview ▸ Key Facts | 🟡 KPIs de 1Q26 sembrados (hoy ya hay 2Q26 / 3Q26 por publicar); precio y market cap deben ir en vivo (regla 10) | ⬜ |
| 2 | `DESC`, `AS_OF`, `FY_NOTE` | Overview ▸ Descripción | 🟡 texto de FY2025 / 1Q26; se actualiza, no se pierde | ⬜ |
| 3 | `HOW_MONEY` + `SEGMENTS` + `incomeSquare` | Overview ▸ How SoFi makes money | 🟢 | ⬜ |
| 4 | `ENGINE` (cross-buy flywheel) | Overview ▸ Cuadrante 2×2 / Products | 🟡 | ⬜ |
| 5 | `FS_APP` (productos de Financial Services) y `TECH_PRODUCTS` (Galileo, Technisys) | Overview ▸ Products & platforms | 🟢 corregido 2026-10-26: antes decía `OFFERINGS`, que son ofertas de capital y van con #13 | ⬜ |
| 6 | `TAILWINDS` / `HEADWINDS` | Misc (o Overview, por decidir) | 🟡 no hay bloque equivalente en la convención | ⬜ |
| 7 | `TARGETS` / `DRIVERS` (metas de largo plazo) | Misc ▸ guidance / targets | 🟡 | ⬜ |
| 8 | `FINANCIALS` + `FIN_NOTE` (FY24 vs FY25) | Bottom Line ▸ General / Results | 🟢 sustituida por el motor, el texto pasa a nota | ⬜ |
| 9 | `PEERS` (tarjetas de rivales en Overview) | Overview ▸ Competitors | 🟢 | ⬜ |
| 10 | `milestonesBody` / `TIMELINE` | Overview ▸ Timeline | 🟢 | ⬜ |
| 11 | `membersBody` + `MEM_*` (miembros, slider CAGR) | Top Line ▸ Segments (KPI) o Misc | 🟢 motor `segments.js` | ⬜ |
| 12 | `rule40Body` / `buildRule40Chart` | Misc ▸ Rule of 40 (`MISC-rule40`) | ✔ decidido 2026-10-26: se conserva en Misc, se reconstruye con datos frescos al aprobarla | ⬜ |
| 13 | `capRaisesBody` + `CAPR_*` (capital, BVPS, TBVPS) + `OFFERINGS` (convertibles y acciones) | Misc ▸ Capital (`MISC-capital`) | ✔ decidido 2026-10-26: Misc | ⬜ |
| 14 | `interestBody` + `loanBlock` (`LOAN_PL/SL/HL`) | Top Line ▸ Segments ▸ Lending | 🟢 | ⬜ |
| 15 | `ficoCard` / `ficoGauge` (FICO 746) | Top Line ▸ Segments ▸ Lending KPIs | 🟡 | ⬜ |
| 16 | `capCard` (ratio de capital vs 10.5% requerido) | Misc ▸ capacity → revenue | 🟢 encaja con "Capacity → revenue" (§15b) | ⬜ |
| 17 | `feeBody` + `FEE_INTRO` | Top Line ▸ Segments (Fee) | 🟡 | ⬜ |
| 18 | `lpbBody` (Loan Platform Business: hero, flujo, funders, pie) | Top Line ▸ Segments ▸ Lending / Misc ▸ LPB | 🟢 contenido único, se conserva entero | ⬜ |
| 19 | `techBody` (Galileo/Technisys, clientes, gráfica de cuentas e ingreso) | Top Line ▸ Segments ▸ Technology Platform + TL-CUS | 🟢 | ⬜ |
| 20 | `fsBody` (Financial Services) | Top Line ▸ Segments ▸ Financial Services | 🟢 | ⬜ |
| 21 | `valuationBody` → `aveBody` (Actuals vs Estimates, `AVE_METRICS`) | Evolution ▸ Results (surprise scorecard) | ✔ decidido 2026-10-26: se rehace con el motor Results y los 3 snapshots reales (02-03, 04-29, 08-05) congelados; texto y lógica de surprise se conservan | ⬜ |
| 22 | `guidanceBody` (Actuals vs Guidance, anual + trimestral) | Evolution ▸ Results (guidance) | 🟢 **ya portado a `results.js`** (comentario en `results.js:3573`) — pieza fuente | ⬜ |
| 23 | Evolution `EVO_*` (cómo cambió el modelo entre snapshots) | Evolution ▸ Estimates | ✔ decidido 2026-10-26: motor Estimates con los 3 snapshots reales | ⬜ |
| 24 | `sensBody` + `SENS_*` (multi-driver, LPB e ingreso por intereses) | Valuation ▸ Sensitivity Analysis | ✔ decidido 2026-10-26: se conserva el diseño propio; base re-sacada del snapshot 08-05; precio en vivo | ⬜ |
| 25 | `SOTP_*` + `renderSotp` (suma de partes) | Misc ▸ SOTP (`MISC-sotp`) | ✔ decidido 2026-10-26: Misc | ⬜ |
| 26 | `fetchSofiQuote` / `renderLiveBanner` (banner de precio, fallback $17.57) | Eliminada por precio en vivo estándar | 🔴 precio sembrado de respaldo (regla 10) | ⬜ |
| 27 | `peersBody` + `PEER_SERIES`, `PEER_FEE`, tabla, series de tiempo, mix, scatter | Valuation ▸ Peers | ✔ decidido 2026-10-26: se conserva y se marca "seeded, dated"; se reemplaza por fuentes primarias en su unidad | ⬜ |
| 28 | `managementBody` → `orgChartBody` (`ORG_*`, `PROFILES`, modal) | Management ▸ Executives & Board | 🟢 | ⬜ |
| 29 | `insiderActivityBody` + `INSIDER_TX` (Form 4 a mano) | Management ▸ Governance | ✔ decidido 2026-10-26: se conserva y se marca "seeded, dated" hasta reemplazarlo | ⬜ |
| 30 | `INSIDER_OWN` / `SHARES_OUT` | Management ▸ Ownership | ✔ decidido 2026-10-26: igual que #29 | ⬜ |
| 31 | `BRAND '#0E7CC0'`, `PEER_COLORS`, `AVE_GREEN/RED`, `EVO_COLORS` | Tokens Summit | 🔴 la marca de SoFi sólo en el logo; el Overview sin color categórico (§8, §21) | ⬜ |
| 32 | 15 `style="…"` en línea | CSS compartido | 🔴 un perfil nuevo no agrega estilos en línea | ⬜ |
| 33 | `soonBody` (placeholder) | — | 🔴 no se publican sub-tabs "pendiente" (regla 5) — ¿todavía se usa? | ⬜ |
| 34 | `SOURCES` | pies de fuentes por panel | 🟢 | ⬜ |

(34 filas agrupadas por función; el conteo de control definitivo se fija en B1 abriendo el perfil en local.)

## 6. Bloqueos y preguntas abiertas

| Desde | Unidad | Qué falta | Quién lo consigue | Estado |
|---|---|---|---|---|
| 2026-10-26 | F0-SM, EV-EST, VA-TM, VA-SENS | ~~MCP sin autenticar~~ resuelto 2026-10-26 | Dani | ✔ cerrado |
| 2026-10-26 | EV-SET, BL | ~~SOFI no estaba en el workbook~~ resuelto 2026-10-26 | Dani | ✔ cerrado |
| 2026-10-26 | EV-RES-DATA | ❓ BBG slot `kpi17` etiqueta "Servicing" pero código `CB_IS_SERVICE_REVENUE`; `kpi18` etiqueta "Technology Products and Solutions" con código `IS_MORTGAGE_PRODUCTION_REVENUE`; `kpi16` "Loan Origination, Sales, and Securitiz…" con código `LOAN_SERVICING_INCOME`. Etiqueta y código parecen cruzados; `kpi1` Total Members sólo trae fq-4 y fq+1…+4 (sin fq0). No se usan hasta confirmar contra el 10-Q | Dani (quien armó los slots) | abierto |
| 2026-10-26 | EV-POST, EV-NOTES | ~~transcripciones~~ resuelto: Dani subió `SOFI_calls.txt` (11 llamadas, Q4 2023 → Q2 2026). Quartr **ya no se consulta** (sin acceso). Falta copiarlas a `docs/calls/` | Claude | ✔ cerrado |

## 6b. Conexiones pendientes ("Live data pending")

| Desde | Unidad ▸ bloque | Qué falta | Quién lo destraba | Estado |
|---|---|---|---|---|
| 2026-10-26 | precio / Key Facts / Peers | `get-quote` / `get-market-history` sin desplegar (por verificar) | San / Oscar | por verificar |

## 6c. Review del analista — pendientes

| # | Pedido | Unidad | Qué hay que construir | Depende de | ¿Va a la guía? | Estado |
|---|---|---|---|---|---|---|

## 7. Historial de aprobaciones

(ninguna todavía)

### 2026-10-26 · F1 Esqueleto + vista previa — APROBADA
- Qué se mostró: preview de Netlify del PR #152 (https://deploy-preview-152--research-summit.netlify.app); modo B, sin cambio de código.
- Fuentes: n/a
- Autoauditoría: el perfil viejo abre en el preview (confirmado por el analista).
- Decisiones: ver §3.

### 2026-10-26 · OV-1 Key Facts — 👀 EN REVISIÓN
- Qué se mostró: Overview ▸ Key Facts de 10 celdas (reemplaza el snapshot de 6 celdas y las 4 tarjetas de KPIs), en el preview del PR #152.
- Fuentes: 10-K FY2025 (portada: Nasdaq, San Francisco, Delaware; Item 1: fundada 2011, ~6,100 empleados al 31-dic-2025; Item 5: nunca ha pagado dividendos; Nota 1: cotiza desde el 1-jun-2021 tras la fusión con Social Capital Hedosophia V). Market cap: `api.liveQuote('SOFI')` (Massive), sin semilla.
- Autoauditoría: 10 celdas ✔ · orden y etiquetas exactas ✔ · sin hex ni color categórico nuevo ✔ (línea de acento = `--steel` vía `--brand-2` en `.ov-sofi`) · market cap con estados "loading / live / unavailable" ✔ · sin celdas vacías ✔ · CEO **sin antigüedad** ✘ (falta la fecha: la confirma Dani) · filer verificado en EDGAR ⚠ (se infiere de que presenta 10-K/10-Q; no se abrió EDGAR) · `node --check` de `sofi.js` ✔ · render visual no verificado por Claude (lo juzga el analista en el preview).
- Ojo: en el preview de Netlify el market cap puede salir "live quote unavailable" porque las funciones limitan CORS a `research-summit.netlify.app` y `localhost:8000`.

### 2026-10-26 · OV-1 Key Facts — APROBADA
- Qué se mostró: las 10 celdas en el preview del PR #152 (commit `326247d`).
- Fuentes: 10-K FY2025; market cap `liveQuote`.
- Autoauditoría: ver entrada anterior; pendiente la fecha de CEO (la pasa Dani aparte) y el filer sin abrir EDGAR.
- Cambios pedidos / decisiones: ninguno.

### 2026-10-26 · OV-2 Descripción — 👀 EN REVISIÓN
- Qué se mostró: lede de 3 oraciones, 57 palabras, en el Overview del preview.
- Fuentes: 10-K FY2025, Item 1 (Company Overview; Bank Holding Company), parafraseado.
- Autoauditoría: 2–4 oraciones ✔ (3) · 50–80 palabras ✔ (57) · sin lista de segmentos ni moat ✔ · sin adjetivos prohibidos ✔ · neutral ✔ · "no physical branches" del lede viejo no está en el 10-K y se descartó ✔.

### 2026-10-26 · OV-2 Descripción — APROBADA
- Qué se mostró: lede de 3 oraciones y 57 palabras en el preview (commit `2341e93`).
- Cambios pedidos / decisiones: la cita de la misión va a Miscellaneous.

### 2026-10-26 · OV-3 Cuadrante 2×2 — 👀 EN REVISIÓN
- Qué se mostró: tabla 2×2 (`.q2`) bajo el lede, nunca colapsada.
- Fuentes: 10-K FY2025 — Item 1; MD&A: ingreso por intereses netos 2,219.0 + no financiero 1,394.4 = 3,613.4; segmentos Lending 1,848.9 · Technology Platform 450.2 · Financial Services 1,542.0 = 3,841.2 antes de eliminaciones (48% / 12% / 40%); miembros 13.6M (+35%); depósitos totales $37.5B.
- Autoauditoría: orden What it sells · Who buys it · How it earns · The edge ✔ · palabras por celda (What it sells 26, Who buys it 24, How it earns 22, The edge 27) ≤ 30 ✔ · solo "How it earns" lleva mezcla de ingresos con año ✔ · sin color (`.q2-k` en navy: se agregó `.ov-sofi` a la regla compartida) ✔ · `node --check` ✔.
- Corrección al perfil viejo: Technology Platform ya no se muestra como $361M (que es la línea "Technology products and solutions", no el segmento) sino como el ingreso de segmento que reporta el 10-K, $450.2M.

### 2026-10-26 · OV-3 Cuadrante 2×2 — APROBADA
- Qué se mostró: tabla 2×2 en el preview (commit `6664b2c`). Sin cambios pedidos.

### 2026-10-26 · OV-4 How SoFi makes money — 👀 EN REVISIÓN
- Qué se mostró: bloque colapsable "How SoFi makes money" (cerrado de inicio) con leyenda, barras grises por segmento, 3 acordeones de segmento (definición + "The numbers"), acordeón "The revenue lines" y leyenda de cierre.
- Fuentes: 10-K FY2025 — MD&A (tabla de segmentos; componentes del ingreso no financiero; resultados consolidados), nota de segmentos (intercompañía $85.5M eliminada en Corporate/Other), Item 1.
- Cuadre (④): segmentos 1,848.9 + 450.2 + 1,542.0 = 3,841.2; Corporate/Other = 3,613.4 − 3,841.2 = −227.8 (derivado); las 5 líneas 2,219.0 + 575.9 + 360.9 + 242.9 + 214.6 = 3,613.4 ✔; crecimientos +35% · +24% · +14% · +88% ✔; márgenes de contribución 55% · 32% · 51% ✔; utilidad antes de impuestos 525.9 (14.6%) y neta 481.3 (13.3%) ✔.
- Autoauditoría: sin geografía → una sola vista, dicho en la leyenda ✔ · barras en grises por tamaño con el monto dentro (`.gmm-neutral`) ✔ · desc sin números ✔ · "The numbers" con filas clave/valor ✔ · sin hex nuevos ni estilos en línea salvo el ancho de barra ✔ · `node --check` ✔ · render visual no verificado por Claude.
- Se quitaron del Overview las secciones "How SoFi Makes Money" (bullets) y "Three Segments"; `HOW_MONEY` y `SEGMENTS` siguen como constantes (B2 #3) porque traen cifras de Q1 2026 (96% fondeo con depósitos, NIM 5.9%, 43% cross-buy) que no son del 10-K FY2025 y se ubican en otra unidad.
- Duda abierta: "beneficio fiscal único de 2024" va sin cifra porque el 10-K da dos importes distintos según la tabla (258.4 y 247.2) y el perfil viejo decía ~266.

### 2026-10-26 · OV-4 How SoFi makes money — APROBADA
- Qué se mostró: bloque completo en el preview (commit `110f4fe`). Sin cambios pedidos.

### 2026-10-26 · OV-5 Products & platforms — 👀 EN REVISIÓN
- Qué se mostró: bloque colapsable "Products & platforms" (cerrado de inicio): leyenda "Tap any family…" + 5 tarjetas; cada una abre un modal con sus productos (nombre en negrita + 1–2 líneas).
- Fuentes: 10-K FY2025, Item 1 (segmentos Lending, Technology Platform y Financial Services; Loan Platform Business; productos de Financial Services).
- Autoauditoría: tarjeta = icono + familia + línea ≤ 6 palabras + "See products ›" ✔ · modal = icono + familia, línea en gris, productos ✔ · dos niveles (nunca todos los productos a la vista) ✔ · ninguna familia con más de ~6 productos (Member tools = 6) ✔ · sin color ni estilos en línea ✔ · `node --check` ✔ · render visual no verificado por Claude.
- Supuesto a confirmar: Galileo = "event and authorization platform accessed via APIs" por eliminación (el 10-K nombra a Technisys como la plataforma bancaria nativa en la nube; no liga explícitamente a Galileo con su descripción). Peach y Composer (solo en el 10-Q de 2026) quedan fuera y van al Timeline.
- Corrección al mapa B2: `OFFERINGS` del perfil viejo son ofertas de capital (convertibles y acciones), no productos; se movió a #13 (`MISC-capital`).

### 2026-10-26 · OV-5 Products & platforms — APROBADA
- Qué se mostró: 5 familias y 16 productos en el preview (commit `2c8e8db`). Sin cambios pedidos.

### 2026-10-26 · OV-6 Competitors (peer map) — 📝 PROPUESTA, datos de EDGAR a medias
- Fuente: XBRL `companyfacts` de data.sec.gov (cada peer, su propio 10-K / 20-F). Último año fiscal anual, USD. EV/EBITDA no aplica a brokers ni bancos (SCHW, IBKR, NU, HOOD); solo P/E.

| Peer | Año fiscal (filing) | Ingreso | Ingreso año previo | Crecimiento | EPS diluido | Utilidad neta | Nota |
|---|---|---|---|---|---|---|---|
| HOOD (Robinhood) | FY2025 (10-K/A, 2026-02-20) | 4,473 M | 2,951 M | +51.6% | 2.05 | 1,883 M | el feed trae la enmienda 10-K/A; falta confirmar contra el 10-K original |
| SCHW (Schwab) | FY2025 (10-K, 2026-02-25) | 23,921 M | 19,606 M | +22.0% | 4.65 | 8,852 M | |
| IBKR (Interactive Brokers) | FY2025 (10-K, 2026-02-27) | 6,205 M (net of interest expense) | 5,185 M | +19.7% | 2.22 | 4,357 M (incluye participaciones no controladoras) | EPS de la Clase A; el grupo gana más |
| UPST (Upstart) | FY2025 (10-K, 2026-02-10) | 1,043.9 M | 636.5 M | +64.0% | 0.45 | 53.6 M | |
| AFRM (Affirm) | FY2026, cierre 2026-06-30 (10-K, 2026-08-27) | 4,261.1 M | 3,224.4 M | +32.2% | 5.53 (no comparable) | 1,929.8 M | **verificado 2026-10-26:** antes de impuestos 492.7 M; beneficio fiscal de 1,437.1 M (reserva de valuación −913.7 M). P/E trailing = "not meaningful"; no se dibuja sin otra base válida (EPS ajustado por impuestos no se inventa) |
| NU (Nu Holdings) | FY2025 (20-F, 2026-04-08, acc. 0001292814-26-002166) | ⛔ Dani sube el 20-F a Drive (2026-10-26) | | | | | SEC responde 403 al documento completo y el feed XBRL solo llega a FY2024 |

- Crecimiento calculado como ingreso FY ÷ ingreso FY previo − 1 (mismo concepto XBRL en ambos años).
- SoFi: forward con consenso BBG (está en `BBG_CONSENSUS.txt`); los 6 peers van solo con trailing, "no Street file".
- Decidido 2026-10-26 (Dani): Nu entra cuando Dani suba el 20-F FY2025 a la carpeta de SOFI en Drive; Affirm se verifica y su P/E queda "not meaningful" (hecho arriba). Pendiente: el `why` de cada peer y construir el mapa.

### 2026-10-26 · OV-7 Timeline y OV-F Pie — 👀 EN REVISIÓN (gates agrupados)
- Qué se mostró: bloque colapsable "Timeline — how it became today's SoFi" con 11 hitos en orden estricto (2011 · Mar 2018 · May 2020 · Jun 2021 · Feb 2022 · Mar 2022 · Apr 2023 · 2024–25 · Jul–Dec 2025 · Q4 2025 · Q2 2026); 6 abren modal con viñetas. Pie único del Overview.
- Fuentes: 10-K FY2025 (Item 1A lista de adquisiciones: Galileo mayo 2020, Golden Pacific feb 2022, Technisys mar 2022, Wyndham abr 2023; Nota 1: cotización 2021-06-01; Nota 13: ofertas del 2025-07-31 y 2025-12-08; SoFiUSD dic 2025; SoFi Crypto Q4 2025), 10-Q 2Q26 Nota 2 (Peach y Composer, ~$70.1M en efectivo), sala de prensa de SoFi (CEO).
- Autoría: se descartó del perfil viejo lo que no estaba en filings ("Stanford", la biografía de Noto en Goldman/Twitter más allá del dato de Twitter, la tarjeta de Q1 2026); el `TIMELINE` viejo sigue en General ▸ Milestones hasta reubicarlo (B2 #10).
- Autoauditoría: orden cronológico estricto ✔ · cada hito responde "por qué importa hoy" ✔ · sin splits, recompras ni litigios ✔ · `Read more` solo con viñetas, nunca prosa ✔ · pie sin firma ni Summit copiado ✔ · `node --check` ✔.

### 2026-10-26 · OV-6 Competitors (peer map) — 👀 EN REVISIÓN (gate agrupado)
- Qué se mostró: bloque colapsable "Competitors — the peer map" en el Overview: leyenda, pastillas Multiple (P/E · EV/EBITDA) y Basis (Forward · Trailing), dispersión SVG con burbujas, chips con × y campo "+ TICKER", tooltip con el `why`. Reemplaza la tabla "Peers & Competitive Landscape" (el texto de `PEERS` queda en `sofi.js`, B2 #9).
- Fuentes (denominadores, de cada peer): HOOD, SCHW, IBKR, UPST y AFRM — XBRL `companyfacts` de SEC EDGAR (10-K FY2025; AFRM 10-K FY2026 al 2026-06-30). SOFI: EPS GAAP FY2025 0.39 (10-K) y consenso BBG FY2026 EPS 0.5967 / ingreso 4,782.4 (`data_as_of` 2026-10-26); crecimiento 35.1% (FY2025) y 32.4% (FY2026E). Precio, market cap y EV: en vivo (`api.liveQuote`), nada sembrado.
- Autoauditoría: ningún múltiplo ni market cap en el archivo ✔ · P/E y EV/EBITDA cambian el eje ✔ (prueba en Node con precios de prueba: P/E trailing dibuja 5, forward solo SOFI, EV/EBITDA ninguno hasta tener EV vivo) · Forward/Trailing cambian ambos ejes ✔ · × elimina y Add restaura datos del archivo ✔ · ejes derivados del dato ✔ · sin precio en vivo no hay burbuja ✔ · sin hex nuevos más allá de los grises de ejes del módulo copiado ✔ · `node --check` ✔ · render visual no verificado por Claude.
- Notas: EBITDA no aplica a brokers (HOOD, SCHW, IBKR) y por eso solo P/E; UPST y AFRM llevan EBITDA = utilidad operativa + D&A del 10-K y necesitan EV en vivo; AFRM sin P/E (beneficio fiscal de $1.44B, chip lo dice); IBKR usa el EPS de la Clase A; el feed de HOOD trae el 10-K/A (falta contrastar con el 10-K original). Peers sin forward: "trailing only — no Street file".
- Dependencia: la tabla de números va en Valuation ▸ Peers (VA-PEERS), mismo estado.

### 2026-10-26 · EV-RES-DATA Dataset de Results — 👀 EN REVISIÓN
- Qué se mostró: `js/results-data/sofi.js` (registrado en `js/results.js`): 17 métricas trimestrales (1Q24–4Q27) y anuales (2024–2028) — Top Line (ingreso neto, 6 líneas de ingreso, miembros y originaciones) y Margins & Profitability (EBITDA ajustado, utilidad neta ajustada, EPS, gasto no financiero, SBC, provisión); `act` · `summit` · `cons` + `estMatrix` (BBG: 18 snapshots; Summit: 3 snapshots).
- Fuentes: 10-K FY2025 y 10-Q 2Q26; `BBG_CONSENSUS.txt` + `Consensus_Portal.xlsm` (último snapshot 2026-10-26); Summit MCP (snapshots 2026-02-03, 2026-04-29, 2026-08-05, congelados). Mapas: `scripts/consensus/map_sofi.json` y `map_summit_sofi.json`.
- Cuadre vs fuente (3 periodos): ingreso 4Q25 act 1,025.051 = 10-Q (tabla trimestral 1,025,051) ✔ · EBITDA ajustado 1Q26 act 339.901 = 10-Q (339,901) ✔ · miembros 2Q26 act 15,814 mil = "más de 15.8 millones" ✔.
- Cuadre trimestres ↔ año de cada año estimado (suma de trimestres · anual · diferencia, millones):

| Métrica · año | Summit | Street (BBG) |
|---|---|---|
| Ingreso 2026 | 4,866.7 · 5,317.5 · −450.8 ✘ | 4,924.5 · 4,782.4 · +142.1 (~3%) |
| Ingreso 2027 | 6,952.6 · 6,280.3 · +672.3 ✘ | trimestres incompletos (BBG llega a 2Q27) |
| EBITDA 2026 | 1,647.1 · 1,647.1 · 0.0 ✔ | 1,628.3 · 1,628.4 · −0.1 ✔ |
| EBITDA 2027 | 2,177.8 · 2,186.1 · −8.3 | trimestres incompletos |
| Utilidad ajustada 2026 | 825.7 · 825.7 · 0.0 ✔ | 810.4 · 806.0 · +4.4 |
| Utilidad ajustada 2027 | 1,133.0 · 1,095.0 · +38.1 | trimestres incompletos |
| Gasto no financiero 2026 | 3,801.0 · 3,823.7 · −22.7 | 3,858.0 · 3,853.0 · +5.0 |
| SBC 2026 | 282.5 · 282.5 · 0.0 ✔ | 299.1 · 299.2 · −0.1 ✔ |
| Provisión 2026 | 48.7 · 48.7 · 0.0 ✔ | 48.8 · 48.2 · +0.6 |

- Prueba de aceptación `verify_preprint.py SOFI cons`: 225 celdas iguales, 0 cambiadas, 0 rellenadas, 0 borradas ✔.
- Autoauditoría: etiquetas de periodo `nQyy` / `yyyy` ✔ · comillas rectas ✔ · margen con numerador y denominador de la misma serie ✔ · periodo futuro = `act: null` ✔ · estimados sin trimestres que existan en otra fuente quedan `null` (BBG sin 3Q27–4Q27) ✔ · `node` carga el dataset y `results.js` ✔.
- Pendiente: guía de la empresa (de los 8-K y las llamadas; el perfil viejo trae `GUID_ANNUAL` / `GUID_QTR` en `sofi.js`); métrica por segmento (Lending / Technology Platform / Financial Services) no está en el modelo y se arma con los filings en TL-SEG.

### 2026-10-26 · EV-RES Evolution ▸ Results — 👀 EN REVISIÓN
- Qué se mostró: primer sub-tab del Deep Dive de SOFI (pestaña "Deep Dive" ahora visible): Evolution ▸ Results con el motor `results.js` (gráfica de barras, selector de métrica por familia, Quarterly | Annual, leyenda Actual · Summit · Consensus, tabla "Period detail", tarjeta Actuals vs Estimates y Road to the print por el `estMatrix`).
- Raíz `ov-sofi-dd` agregada a las listas de `css/selectors.css` y con acento `--steel` en `css/overview.css`.
- Sin Estimates / Earnings todavía: el sub-tab se agrega cuando su unidad esté construida (regla 5).
- Autoauditoría: `node --check` de `sofi.js` y `results.js` ✔ · `resultsHtml('SOFI')` genera el panel ✔ · render visual no verificado por Claude.

### 2026-10-26 · EV-RES-DATA — guía de la empresa cargada (misma unidad, 👀)
- Se agregó la métrica "Adjusted net revenue" (la que SoFi guía; no está en el modelo ni en BBG, sin series Summit/Street) y las bandas `guideLo`/`guideHi` de ingreso ajustado, EBITDA ajustado, utilidad neta ajustada y EPS: trimestral 1Q24–2Q26 y anual 2024–2026. Fuentes: 8-K Ex. 99.1 (capturadas en el perfil viejo, `GUID_QTR`/`GUID_ANNUAL`), llamada de Q1 2026 (guía de 2Q26: ingreso ≈ $1.115B, EBITDA ≈ $330M, margen de utilidad 12–13%, EPS $0.10–0.11) y llamada de Q2 2026 (FY2026: ingreso ajustado $4.75–4.85B, EBITDA ≈ $1.6B, utilidad ajustada ≈ $825M, EPS ≈ $0.60).
- La banda de utilidad de 2Q26 ($133.8–145.0M) está **derivada** del margen declarado (12–13%) sobre $1.115B; se dice en la nota de la métrica. La guía de utilidad y EPS fue GAAP hasta mediados de 2025 y ajustada después (también en la nota). La llamada de Q2 2026 no da guía trimestral de 3Q26 (solo año completo).
- `verify_preprint.py SOFI cons`: 225 iguales, 0 cambiadas ✔.

### 2026-10-26 · EV-EST Evolution ▸ Estimates — 👀 EN REVISIÓN
- Qué se mostró: segundo sub-tab de Evolution: cómo se movió la proyección de Summit de cada año fiscal (2026–2029) entre los 3 snapshots guardados (3-feb, 29-abr y 5-ago de 2026), en 8 métricas: ingreso neto, EBITDA ajustado, utilidad ajustada, gasto no financiero, miembros y originaciones personal / estudiantil / hipotecaria. Bloque `evolution` en `js/results-data/sofi.js`.
- Fuentes: Summit MCP, `projection_history` de cada snapshot (congelado, sin conexión en vivo). Sin serie de consenso en esta pestaña (`cons: null`).
- Hallazgos: ingreso 2026: 4,725.2 → 4,935.2 → 5,317.5 (+12.5%); 2027: 6,105.2 → 6,287.6 → 6,280.3 (+2.9%); 2029 salta de 8,838.9 a 10,682.5 en el último snapshot.
- Autoauditoría: ≥ 2 snapshots ✔ (hay 3) · números del bloque = valores guardados en cada snapshot (nunca los actuals) ✔ · la nota advierte la inconsistencia trimestres↔anual del modelo ✔ · `node --check` ✔.

### 2026-10-26 · VA-PEERS Valuation ▸ Peers — 👀 EN REVISIÓN
- Qué se mostró: segunda sección del Deep Dive (Valuation ▸ Peers): el mismo mapa del Overview (mismo estado, quitar un peer en uno lo quita en el otro) y debajo, abierta, la tabla "The numbers behind the map": peer, múltiplo (P/E o EV/EBITDA, forward o trailing), crecimiento, market cap y "vs peer avg"; promedio y mediana excluyen a SoFi.
- Fuentes: las del OV-6 (10-K de cada peer en EDGAR; consenso BBG solo para SoFi); precio, market cap y EV en vivo (Massive). Pie con fuentes y fechas, y avisos de Nu fuera y del P/E de Affirm.
- Autoauditoría: mismo conjunto de datos que OV-6 ✔ · prueba en Node con precios de prueba: 9 filas (encabezado, 6 peers, promedio y mediana) ✔ · peers sin múltiplo se hunden al final en vez de ordenarse como cero ✔ · `node --check` ✔ · `css/overview.css` extendió las reglas compartidas `.ov-tsm-dd, .ov-meta-dd` a `.ov-sofi-dd` ✔ · render visual no verificado por Claude.

### 2026-10-26 · MG-TEAM Management ▸ Executives & Board — 👀 EN REVISIÓN
- Qué se mostró: tercera sección del Deep Dive (Management ▸ Executives & Board) con el motor compartido `management.js`: lede, 10 tarjetas de ejecutivos (Noto, Lapointe, Lavet, Avalos, Tanona, Rishel, Stafford Webb, Keough, Schuppenhauer, Pinto; fotos de `img/leadership` donde existen, iniciales si no), modal con la bio completa y franja del consejo (Hutton presidente, Freiberg vicepresidente, Noto también ejecutivo, Meltzer, Liang, Yesil, Bashir, Hele, Borden).
- Fuentes: roster, bios y consejo **del perfil viejo** (página de liderazgo de SoFi, Form 4 de consejeros 2025–26 y proxy FY2026), **no re-verificados contra el proxy en esta construcción** (decisión del analista 2026-10-26: conservar y marcar). La fecha de Noto como CEO es de la sala de prensa de SoFi. Módulo `js/overviews/sofi-mgmt.js`.
- Autoauditoría: bio y línea en texto plano ✔ · acento = token Summit `--steel`, no el azul de SoFi ✔ · sin etiquetas de independencia (no hay proxy; no se afirma) ✔ · sin celdas "Governance & compensation" (sin datos verificados) ✔ · pie con fuente y la advertencia de no re-verificado ✔ · `node --check` ✔ · render visual no verificado por Claude.
- Pendiente real: verificar roster, cargos y consejo contra el proxy DEF 14A de 2026 (no está en Drive) y agregar independencia, comités y compensación (MG-GOV).

### 2026-10-26 · EV-SET / EV-NOTES Evolution ▸ Earnings — 👀 EN REVISIÓN (Post-Results en construcción)
- Qué se mostró: primer sub-tab de Evolution: Earnings con Setup · Post-Results · Notes, copia adaptada de `meta-ce.js` (`js/overviews/sofi-ce.js`). Datos en `js/overviews/sofi-ce-data.js` (consenso por horizonte armado al cargar desde `results-data/sofi.js` y su `estMatrix`: ingreso, miembros, originaciones, gasto no financiero, SBC, EBITDA ajustado, utilidad ajustada, EPS), dataset `results-data/sofi-setup.js` registrado como `SOFI_SETUP` en `results.js`, registro de temas `themes-data/sofi.js` (vacío).
- Setup de 3Q26 (próximo print): consenso BBG del 2026-10-26, Summit congelado del 2026-08-05 y la guía de la llamada del 29-jul (solo año completo: ingreso ajustado $4.75–4.85B, EBITDA ≈ $1.6B, utilidad ajustada ≈ $825M, EPS ≈ $0.60 con 22% de impuestos; sin guía discreta del trimestre).
- Autoauditoría: `node --check` de los 5 archivos ✔ · el constructor de la grilla da ingreso 2Q26 = 1.22 ($B), miembros 15.81 M, filas de consenso por horizonte ✔ · el HTML de Earnings se genera completo (82 mil caracteres) con las 3 fases y los pills de trimestre ✔ (prueba en Node con los imports de red sustituidos) · `ov-sofi-dd` en las reglas ✔ · render visual no verificado por Claude.
- Pendiente (EV-POST): las entradas por trimestre reportado (resumen, sorpresas, preparado, Q&A) se escriben a partir de `docs/calls`; el consenso pre-print de 2Q26 ya está en la grilla. Notes: sin semilla (no hay notas del analista de SOFI).

### 2026-10-26 · BL-GEN-1 y BL-GEN-5 Bottom Line ▸ General — 👀 EN REVISIÓN
- Qué se mostró: nueva sección **Bottom Line** (primera del Deep Dive) con el sub-tab General sobre el motor Results (`results-data/sofi-bl.js`, registrado como `SOFI_BL`): "Profitability & margins" (utilidad antes de impuestos, EBITDA ajustado, utilidad ajustada, con margen sobre ingreso neto) y "Expense lines" (gasto no financiero, tecnología y producto, ventas y marketing, costo de operaciones, G&A, provisión y SBC, cada una como % del ingreso). Series: actuals, Summit congelado y consenso BBG.
- Fuentes: DCF de SOFI (`DCF SOFI.xlsm`, hoja Segments; Dani 2026-10-26) como referencia de qué proyecta Summit: las líneas funcionales, utilidad antes de impuestos, impuestos, EBITDA, D&A, SBC y EPS tienen forecast trimestral y anual; **los ingresos por segmento (Lending, Technology Platform, Financial Services) vienen vacíos, o sea Summit no los proyecta**. Mismos valores que el MCP (ingreso 2026 = 5,317.5; 3Q26 = 1,207.4). Consenso: `BBG_CONSENSUS.txt`, slots kpi19–22 (códigos `CB_IS_DATA_PROCESSING_COST`, `CB_IS_S_AND_M_EXPENSE`, `CB_IS_GENL_AND_ADMIN_EXPN`, `CB_IS_OTHER_OPEX`).
- Cuadre: las 4 líneas funcionales + provisión suman $1,014.4M en 2Q26; el "gasto no financiero" del filing ($1,000.6M) **no incluye** la provisión ($13.8M). La nota de esa métrica lo dice. `verify_preprint.py SOFI cons`: 301 iguales, 0 cambiadas ✔.
- Decisión de construcción (Claude): SoFi es un banco, sin costo de ventas ni utilidad bruta; en vez de portar el módulo a medida de META (1,000 líneas, bridge desde costo de ingresos) Bottom Line ▸ General se construye sobre el motor Results ya probado. **Pendiente a medida:** el puente ingreso → utilidad neta (BL-GEN-2), op. income → net income (BL-GEN-3) y SBC (BL-GEN-4).
- Autoauditoría: `node --check` ✔ · el HTML del Deep Dive genera las 4 secciones y el panel del motor ✔ (prueba en Node) · render visual no verificado por Claude.

### 2026-10-26 · EV-POST Post-Results, trimestre 2Q26 — 👀 EN REVISIÓN
- Qué se mostró: entrada completa de Q2 2026 en `js/overviews/sofi-ce-data.js`: Setup pre-print (consenso BBG del 2026-05-04, Summit congelado, guía de la llamada del 29-abr), resultados (titular, 5 párrafos de resumen en tono objetivo, 9 notas por métrica, ranking para el siguiente print, 4 preguntas para la llamada) y la llamada (8 bloques de discurso preparado, 8 preguntas y respuestas con analista y tema, la lectura de una frase, tres minutos y 3 preguntas nuevas).
- Fuentes: transcripción verbatim de la llamada del 2026-07-29 (`SOFI_calls.txt`, que subió Dani; Quartr no se usa), 10-Q 2Q26 (ingreso GAAP 1,218.7), consenso BBG pre-print (ingreso ≈ 1.13B, EBITDA ajustado ≈ 0.35B, utilidad ajustada ≈ 0.17B, EPS 0.12, originaciones personales ≈ 8.5B, estudiantiles ≈ 1.7B, hipotecarias ≈ 1.3B) y el Summit congelado (ingreso 1,123).
- Autoauditoría: cifras de las notas = transcripción o dataset ✔ · las claves de nota existen en `SOFI_CE_CONS` ✔ · tono del resumen: sin guiones largos, sin construcción "no A sino B", sin narrar crecimientos (las cifras van en las notas) ✔ · el Post-Results queda sin `thesisCheck` (no hay tesis del analista de SOFI) ni `highlights` ✔ declarado · sin precio del día siguiente (no hay serie cargada) — se dice en `priceReaction` ✔ · `node --check` ✔ · el HTML de Earnings renderiza (148 mil caracteres) con el Q&A y las preguntas ✔.
- Nota: el modelo Summit trae 1,197 de ingreso en 2Q26, 21.7 por debajo del filing; la entrada usa lo reportado y lo dice.

### 2026-10-26 · EV-POST Post-Results, trimestre 1Q26 — 👀 EN REVISIÓN
- Qué se mostró: entrada completa de Q1 2026 en `js/overviews/sofi-ce-data.js`: Setup pre-print (consenso BBG del 2026-02-04, Summit congelado, guía de la llamada de 4Q25: ingreso ajustado ≈ $1.04B, EBITDA ≈ $300M, utilidad ajustada ≈ $160M, EPS $0.12), resultados (titular, 5 párrafos, 9 notas, ranking, 4 preguntas) y la llamada (7 bloques preparados, 5 preguntas y respuestas con analista y tema).
- Fuentes: transcripción de la llamada del 2026-04-29, 10-Q / consenso: ingreso GAAP 1,100.4 vs Street ≈ 1.06B; EBITDA ajustado 339.9 vs ≈ 0.32B; originaciones personales 8.3B vs ≈ 7.6B, estudiantiles 2.6B vs ≈ 1.6B, hipotecarias 1.2B vs ≈ 1.0B; miembros 14.7M.
- Verificado contra la transcripción: récords de originación "por cuatro trimestres seguidos", platform +90% interanual y menos que en 4Q25, SoFi Plus a $10 al mes con 4.5% de APY hasta $20,000. Se quitó de un borrador una frase que no estaba en la llamada (crecimiento del platform de "2.3 veces en dos años").
- Autoauditoría: claves de nota válidas en `SOFI_CE_CONS` ✔ · mismo tono objetivo y mismas omisiones declaradas que 2Q26 (sin `thesisCheck`, sin precio del día siguiente) ✔ · `node --check` ✔.
