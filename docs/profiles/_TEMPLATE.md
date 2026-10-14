# <TICKER> — bitácora de construcción del perfil

> Copia este archivo a `docs/profiles/<TICKER>.md` en la Fase 0. Reglas: `docs/PROFILE_PLAYBOOK.md` §3.
> Claude la lee completa al empezar cada sesión y la actualiza en cada aprobación (no al final).
> Estados: ⬜ pendiente · 📝 propuesta · 🔨 en construcción · 👀 en revisión · 🔁 cambios pedidos ·
> ✅ aprobada · ⏭️ omitida (con razón) · ⛔ bloqueada (qué falta y quién lo consigue)

| Campo | Valor |
|---|---|
| Empresa | <Nombre> (<BOLSA>: <TICKER>) |
| Modo | A — empresa nueva / B — reordenar existente |
| Rama | `feat/<ticker>-profile` |
| Analista responsable | |
| Inicio | AAAA-MM-DD |
| Avance | 0 de M unidades aprobadas · 0 omitidas · 0 bloqueadas (M = filas del tablero − ⏭️ de alcance; Anexo C) |

## 1. Inventario de datos (F0)

| Fuente | ¿Existe? | Detalle (fechas, cobertura) | Qué habilita | Qué queda fuera sin ella |
|---|---|---|---|---|
| Fila en `companies` | | | el perfil abre | todo |
| Filing anual (10-K / 20-F) | | forma, FY, accession | Overview, Top Line, textos verbatim | |
| Año fiscal / moneda | | cierre, moneda | | |
| Summit DCF | | # snapshots, último periodo real de cada uno | Summit en Results/Estimates; Target Multiple; Sensitivity | |
| Consenso BBG (`BBG_CONSENSUS.txt` + `Consensus_Portal.xlsm`) | | # snapshots, último `data_as_of` | `estMatrix.cons`, Setup, export de Bottom Line | sin consenso ni export (caso DHR) |
| `get-market-history` (Massive) | | desplegada sí/no | Historic Multiple en vivo | Historic Multiple con "Live data pending" |
| `get-summit-data` (+ valuación, `get_valuation_history`) + PR del portal | | ¿existe en main / desplegada? · ¿la valuación del modelo es confiable (quality_flags)? | Summit en vivo en todo el perfil | series Summit ausentes (Conexiones pendientes); EV-EST, VA-TM, VA-SENS ⛔ |
| SPLC (clientes / proveedores) | | archivo, fecha | TL-CUS tabla, BL-SPLC | |
| Transcripciones | | trimestres disponibles | EV-POST, EV-NOTES, citas | |
| Fiscal.ai (plan) | | | tabla en vivo de Management | |
| Massive (`liveQuote`) | | | market cap, peers | |
| Fotos / imágenes | | | Management, Products | |

**Alcance acordado:** (qué unidades quedan ⏭️ desde el inicio y por qué)

## 1b. Mapa Summit (F0-SM)

> Reglas: `docs/PROFILE_PLAYBOOK.md` §6.3. Una fila por **cada** etiqueta de `list_metrics`, incluidas las `ignore`.
> Archivo que lee el portal: `js/summit-map/<ticker>.js` (sin números).

Modelo: `<ruta del .xlsm>` · moneda · escala · N snapshots (primero → último) · N etiquetas: x core · y segment · z kpi · g guidance · c consensus · i ignore · valuación: métodos y quality_flags

| Etiqueta MCP | Rol | Clave portal | Qué es, en una línea | Base | Unidad real | Agregación | Periodos | Cuadre vs filing | Confianza |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

### Dudas

<!-- Una por etiqueta ❓. Se resuelve antes de que una unidad la use. -->
```
❓ <TICKER> · <ETIQUETA> — <pregunta>
   Lo que se ve: …
   Quién responde: autor del modelo / Claude con el filing / analista
   Mientras tanto: <qué no se usa>
   Respuesta (AAAA-MM-DD): …
```

### Cambios del mapa

<!-- Solo se agrega: snapshot nuevo → etiqueta nueva, desaparecida o con salto de escala/signo. -->
- AAAA-MM-DD · snapshot AAAA-MM-DD · <qué cambió> — <qué se hizo>

## 2. Tablero de unidades

| ID | Unidad | Estado | Fecha | Aprobó | Commit | Nota |
|---|---|---|---|---|---|---|
| F0 | Inventario de datos | ⬜ | | | | |
| F0-SM | Mapa de métricas Summit | ⬜ | | | | |
| F1 | Esqueleto + vista previa | ⬜ | | | | |
| OV-1 | Overview ▸ Key Facts | ⬜ | | | | |
| OV-2 | Overview ▸ Descripción | ⬜ | | | | |
| OV-3 | Overview ▸ Cuadrante 2×2 | ⬜ | | | | |
| OV-4 | Overview ▸ How it makes money | ⬜ | | | | |
| OV-5 | Overview ▸ Products & platforms | ⬜ | | | | |
| OV-6 | Overview ▸ Competitors (peer map) | ⬜ | | | | |
| OV-7 | Overview ▸ Timeline | ⬜ | | | | |
| OV-F | Overview ▸ Pie de fuentes | ⬜ | | | | |
| EV-RES-DATA | Dataset de Results (números) | ⬜ | | | | |
| EV-RES | Evolution ▸ Results | ⬜ | | | | |
| TL-GEN | Top Line ▸ General | ⬜ | | | | |
| TL-SEG | Top Line ▸ Segments | ⬜ | | | | |
| TL-OTH | Top Line ▸ Other | ⬜ | | | | |
| TL-CUS | Top Line ▸ Customers | ⬜ | | | | |
| EV-EST | Evolution ▸ Estimates | ⬜ | | | | |
| EV-SET | Evolution ▸ Earnings ▸ Setup | ⬜ | | | | |
| EV-POST | Evolution ▸ Earnings ▸ Post-Results | ⬜ | | | | |
| EV-NOTES | Evolution ▸ Earnings ▸ Notes | ⬜ | | | | |
| BL-GEN-1 | Bottom Line ▸ General ▸ Profitability & margins | ⬜ | | | | |
| BL-GEN-2 | Bottom Line ▸ General ▸ The bridge | ⬜ | | | | |
| BL-GEN-3 | Bottom Line ▸ General ▸ Op. income → net income | ⬜ | | | | |
| BL-GEN-4 | Bottom Line ▸ General ▸ Stock-based compensation | ⬜ | | | | |
| BL-GEN-5 | Bottom Line ▸ General ▸ Expense lines | ⬜ | | | | |
| BL-SEG | Bottom Line ▸ Segments | ⬜ | | | | |
| BL-SPLC | Bottom Line ▸ Supply Chain | ⬜ | | | | |
| VA-HIST | Valuation ▸ Historic Multiple | ⬜ | | | | |
| VA-PEERS | Valuation ▸ Peers | ⬜ | | | | |
| VA-TM | Valuation ▸ Target Multiple / PEG | ⬜ | | | | |
| VA-SENS | Valuation ▸ Sensitivity Analysis | ⬜ | | | | |
| MG-TEAM | Management ▸ Executives & Board | ⬜ | | | | |
| MG-OWN | Management ▸ Ownership | ⬜ | | | | |
| MG-GOV | Management ▸ Governance & SBC | ⬜ | | | | |
| MG-TRACK | Management ▸ Track Record | ⬜ | | | | |
| MISC | Miscellaneous (una fila `MISC-<clave>` por sub-tab aprobada) | ⬜ | | | | |
| F-FINAL | Cierre y entrega | ⬜ | | | | |

(Modo B: agregar B1 — inventario de contenido existente y B2 — mapa de reubicación después de F0.)

> Al 14 oct 2026, para una empresa nueva, **EV-EST, VA-TM y VA-SENS arrancan en ⛔** (necesitan Summit
> en vivo; playbook §20b caso 2) y se anotan en Bloqueos. Cada `MISC-<clave>` aprobada reemplaza la fila MISC.

## 3. Decisiones del analista

<!-- Solo se agrega. Si una decisión cambia, nueva línea que cita la anterior. -->
- AAAA-MM-DD · <ID> · <decisión> — <por qué> — <quién>

## 4. Excepciones aceptadas

<!-- Cada FAIL de la autoauditoría que el analista decidió dejar. -->
- AAAA-MM-DD · <ID> · <qué regla> — <por qué se acepta> — <quién>

## 5. Mapa de reubicación (solo modo B)

Conteo de control (piezas originales): **N**

| # | Pieza original (archivo:función) | Destino (sección ▸ sub-tab ▸ bloque) | Cómo | Estado |
|---|---|---|---|---|
| 1 | | | | ⬜ |

## 6. Bloqueos y preguntas abiertas

| Desde | Unidad | Qué falta | Quién lo consigue | Estado |
|---|---|---|---|---|

## 6b. Conexiones pendientes ("Live data pending")

> `docs/PROFILE_PLAYBOOK.md` §20b. Bloques aprobados que hoy muestran el aviso porque falta el camino
> en vivo. No hay números copiados que migrar: al destrabarse, se conecta, se vuelve a mostrar y se cierra.

| Desde | Unidad ▸ bloque | Qué falta (función / dato) | Quién lo destraba | Estado |
|---|---|---|---|---|

## 7. Historial de aprobaciones

<!-- Solo se agrega, la más reciente al final. Una entrada por cada paso por la compuerta. -->
### AAAA-MM-DD · <ID> <Nombre> — <APROBADA | CAMBIOS | OMITIDA>
- Qué se mostró:
- Fuentes:
- Autoauditoría:
- Cambios pedidos / decisiones:
