# Handoff — NVIDIA Overview (`feat/nvidia-overview-enhancements`)

> Apuntes para continuar en otra máquina. **Borrar este archivo antes de mergear el PR.**

## Cómo retomar
```bash
git fetch origin
git checkout feat/nvidia-overview-enhancements
git pull
python -m http.server 8000   # (o python3 / py) → http://localhost:8000
```
Casi todo vive en `js/overviews/nvidia.js`; estilos en `css/semi-map.css` y `css/overview.css`.

## Estado del perfil NVIDIA (7 tabs)
| Tab | Estado |
|---|---|
| Overview | ✅ Resumen ejecutivo (KPIs FY2026, cómo gana dinero, financieros FY25→FY26, peers, tailwinds/headwinds) |
| Segments | ✅ Chart trimestral apilado con toggles **New/Old**, **Quarterly/Annual**, **BBG/Summit(soon)**; forecast BBG→FY2029 sombreado; tablas old/new/GAAP; Vera Rubin |
| Technology | ✅ 4 animaciones (CPU vs GPU, Moore 3 ejes, transistores con años, barras de generaciones) + mapa 3D "What NVIDIA sells" con fotos reales + Vera Rubin |
| Management | ✅ Árbol interactivo con fotos (click → detalle) + ownership insiders/board con **valor en vivo** (`api.liveQuote`) |
| **Consensus** | ⛔ STUB — pendiente |
| **Valuation** | 🟡 Parcial — solo vista forward DCF Summit; faltan múltiplos |
| Industry Analysis | ✅ Mapa de semiconductores con focus a NVDA |

## Siguiente
1. **Consensus** (lo más visual, pendiente): beats vs consenso cada trimestre/año desde FY2023.
   - Guidance beats ya conocidos: Q1 FY27 guió $78.0B → entregó $81.6B; Q2 guía $91.0B.
   - Estimados Bloomberg (rev/EPS por trimestre, forward) están en `NVDA_BBG.xlsx`.
2. **Valuation**: múltiplos (P/E, EV/Sales, EV/EBITDA actuales vs históricos), PEG, supuestos del DCF Summit + escenarios.

## Gotchas
- **Archivos fuente NO viajan por git** — `nvidia-map-reference/` es gitignored (PDFs, `NVDA_BBG.xlsx`, `NVDA_OWN.xlsx`, `NVDA2024.pptx`). Para Consensus/Valuation **volver a subir `NVDA_BBG.xlsx`**. Los datos ya extraídos (segmentos, ownership) están hardcodeados en `nvidia.js`.
- **Imágenes SÍ viajan** (commiteadas): `img/products/nvda-*.jpg`, `img/leadership/nvda-*.jpg`.
- **Precio en vivo (Management):** `api.liveQuote('NVDA')` requiere **sesión iniciada**; sin login los valores muestran "—".
- Parseo Excel sin openpyxl/jq → usé `python + zipfile` (en la laptop quizá tengas openpyxl).

## Datos clave ya verificados (no re-derivar)
- **FY2026:** Rev $215.9B (+65%), Data Center $193.7B, GAAP GM 71.1% (cargo H20 ~$4.5B Q1), net income $120.1B, EPS $4.90.
- **Q1 FY2027:** $81.6B (+85%); guía Q2 $91.0B.
- **Segmentos:** nuevos = Data Center (Hyperscale + ACIE) + Edge Computing; viejos = DC/Gaming/PV/Auto/OEM. Edge ≈ Gaming+PV+Auto+OEM.
- **Vera Rubin (ramp H2 2026):** Rubin R200 ~336B transistores, 3nm, HBM4 288GB, ~50 PFLOPS FP4; CPU Vera (88 cores Olympus Arm).
- **Ownership:** Jensen 812.0M (3.36%); insiders+board ~3.5%.
- **Summit DCF:** rev FY2027E $390.3B, FY2028E $566.7B.

## PR
Branch pusheado. PR **no abierto** todavía (lo abre SAB; San/Oscar mergean).
Link: https://github.com/scarranz/research-summit/pull/new/feat/nvidia-overview-enhancements
