// overviews/hyperscalers-data.js — curated dataset for the Hyperscalers industry analysis.
//
// SOURCE OF RECORD: the earnings-call transcripts in `hyperscalers/` (gitignored —
// licensed PDFs + extracted .txt, 2023-10 → 2026-07). Every number below is either
//   • STATED  — said on a call, and the `src` names which one, or
//   • DERIVED — arithmetic on stated numbers, flagged `d:true` and explained.
// Nothing here is sourced from outside the transcript corpus. Where a call did not
// state a figure the value is `null` — NOT interpolated. Read the gaps as gaps.
//
// AXIS CONVENTION (per SAB): everything is on a CALENDAR basis so the four are
// comparable. Microsoft is the only fiscal-year reporter (FY ends 30 June), so its
// "FY26Q2" call lands in the Jan-2026 calendar column. That offset is surfaced in
// the UI as a note, never silently absorbed.
//
// PALETTE: the four series colours were validated with the data-viz validator
// (light mode, #FFFFFF surface, all-pairs): worst CVD ΔE 9.2, worst normal-vision
// ΔE 16.3 — both clear. Note the portal accent #2563EB was REJECTED by the
// validator (ΔE 14.1 vs violet, below the 15 floor), which is why slot 1 is
// #2a78d6 and not the portal blue. Aqua (#1baf7a) sits at 2.82:1 on white, under
// the 3:1 bar, so the relief rule applies: the charts ship direct labels AND a
// table view. Do not re-order or substitute these without re-running the validator.

export const HS_COMPANIES = [
  { id: 'amzn',  ticker: 'AMZN',  name: 'Amazon',    color: '#2a78d6', fy: 'Calendario' },
  { id: 'googl', ticker: 'GOOGL', name: 'Alphabet',  color: '#eb6834', fy: 'Calendario' },
  { id: 'meta',  ticker: 'META',  name: 'Meta',      color: '#1baf7a', fy: 'Calendario' },
  { id: 'msft',  ticker: 'MSFT',  name: 'Microsoft', color: '#4a3aa7', fy: 'Fiscal jun.' },
];

// The calls, in calendar order. `msft` names the fiscal quarter that lands here.
export const HS_VINTAGES = [
  { key: '24q1', label: "Abr '24", calls: '1Q24', msft: 'FY24Q3' },
  { key: '24q2', label: "Jul '24", calls: '2Q24', msft: 'FY24Q4' },
  { key: '24q3', label: "Oct '24", calls: '3Q24', msft: 'FY25Q1' },
  { key: '24q4', label: "Ene '25", calls: '4Q24', msft: 'FY25Q2' },
  { key: '25q1', label: "Abr '25", calls: '1Q25', msft: 'FY25Q3' },
  { key: '25q2', label: "Jul '25", calls: '2Q25', msft: 'FY25Q4' },
  { key: '25q3', label: "Oct '25", calls: '3Q25', msft: 'FY26Q1' },
  { key: '25q4', label: "Ene '26", calls: '4Q25', msft: 'FY26Q2' },
  { key: '26q1', label: "Abr '26", calls: '1Q26', msft: 'FY26Q3' },
  { key: '26q2', label: "Jul '26", calls: '2Q26', msft: 'FY26Q4' },
];

// ── 1 · THE GUIDANCE LADDER ───────────────────────────────────────────────────
// For a given TARGET calendar year, what each company said that year's CapEx
// would be, on each call. Midpoint of the guided range, US$B. null = the call
// stated no full-year number (Chart.js spans the gap; markers show statements).
export const HS_GUIDE = [
  {
    year: '2025',
    label: 'CapEx CY2025',
    blurb: 'El primer año completo de la carrera. Nadie bajó una guía; Alphabet la subió tres veces y terminó 22% arriba de donde empezó.',
    series: {
      //        Abr24  Jul24  Oct24  Ene25  Abr25  Jul25  Oct25  Ene26  Abr26  Jul26
      googl: [  null,  null,  null,  75,    75,    85,    92,    null,  null,  null ],
      amzn:  [  null,  null,  null,  105,   null,  null,  125,   null,  null,  null ],
      meta:  [  null,  null,  null,  62.5,  68,    69,    71,    null,  null,  null ],
      msft:  [  null,  null,  null,  null,  null,  null,  null,  null,  null,  null ],
    },
    // What each guide resolved to, and where the numbers come from.
    resolve: {
      googl: { first: 75,   last: 92,   actual: 91.4, src: 'Guía inicial 4Q24 (feb-26 call: “approximately $75 billion”); $85B en 2Q25; $91–93B en 3Q25; real $91.4B confirmado en la call 4Q25.' },
      amzn:  { first: 105,  last: 125,  actual: 125,  d: true, src: 'La guía 4Q24 no fue un número anual: Olsavsky dio “$26.3B trimestrales… razonablemente representativo”, de donde sale ~$105B (derivado). El número anual explícito ($125B) llegó recién en la call 3Q25.' },
      meta:  { first: 62.5, last: 71,   actual: 71,   src: 'Rango $60–65B (4Q24) → $64–72B (1Q25) → $66–72B (2Q25) → $70–72B (3Q25). Se grafica el punto medio.' },
      msft:  { first: null, last: null, actual: 118,  d: true, src: 'Microsoft no guía por año calendario. Los $118B son la SUMA de sus cuatro trimestres calendario 2025 declarados ($21.4 + $24.2 + $34.9 + $37.5B), incluidos leases financieros. Derivado, no declarado.' },
    },
  },
  {
    year: '2026',
    label: 'CapEx CY2026',
    blurb: 'El salto de escalón. Las cuatro vuelven a subir — y la única línea que BAJA lo hace por un cambio contable, no por menos inversión.',
    series: {
      //        Abr24  Jul24  Oct24  Ene25  Abr25  Jul25  Oct25  Ene26  Abr26  Jul26
      googl: [  null,  null,  null,  null,  null,  null,  null,  180,   185,   200  ],
      amzn:  [  null,  null,  null,  null,  null,  null,  null,  200,   null,  220  ],
      meta:  [  null,  null,  null,  null,  null,  null,  null,  125,   135,   137.5],
      msft:  [  null,  null,  null,  null,  null,  null,  null,  null,  190,   175  ],
    },
    resolve: {
      googl: { first: 180, last: 200, actual: null, src: '$175–185B (4Q25) → $180–190B (1Q26, incorpora Intersect) → $195–205B (2Q26). Punto medio.' },
      amzn:  { first: 200, last: 220, actual: null, src: '“About $200 billion” (4Q25) → “approximately $220 billion” (2Q26). Jassy atribuye el alza al mayor costo de memoria.' },
      meta:  { first: 125, last: 137.5, actual: null, src: '$115–135B (4Q25) → $125–145B (1Q26) → $130–145B (2Q26, estrecha el piso). Punto medio.' },
      msft:  { first: 190, last: 175, actual: null, flag: 'accounting', src: '⚠ ~$190B (FY26Q3, incluye ~$25B de mayor precio de componentes) → ~$175B (FY26Q4). La baja NO es menos inversión: al extender la vida útil de data centers de 15 a 25 años, más leases pasan de financieros a operativos, y los operativos no cuentan como CapEx. Hood: “outside of this useful life impact, our calendar year 2026 CapEx investment expectations remain unchanged.”' },
    },
  },
];

// ── 2 · REPORTED QUARTERLY CAPEX ──────────────────────────────────────────────
// US$B, as stated on the call for that quarter. Definitions differ by company —
// see HS_BASIS. null = not stated on any call in the corpus.
export const HS_QUARTERLY = {
  googl: [12.0, null, 13.0, 14.0, 17.2, 22.4, 24.0, 27.9, 35.7, 44.9],
  amzn:  [14.0, null, null, 26.3, 24.3, 31.4, 34.2, null, 43.2, 53.1],
  meta:  [6.7,  8.5,  9.2,  14.8, null, 17.0, 19.4, 22.1, 19.8, 31.1],
  msft:  [14.0, 19.0, 20.0, 22.6, 21.4, 24.2, 34.9, 37.5, 31.9, 41.0],
};

// Why you cannot stack these four series without adjusting them first.
export const HS_BASIS = [
  { id: 'googl', basis: 'CapEx reportado (caja)',
    note: 'Serie limpia. El hueco de jul-24 es real: la call 2Q24 no está en el corpus.' },
  { id: 'amzn',  basis: 'Cambia a mitad de camino',
    note: '⚠ En 2024 Amazon reportaba “capital investments” = CapEx + leases financieros de equipo. Desde 2025 pasa a “cash CapEx”. El punto de ene-25 ($26.3B) está en la base vieja; los de 2025-26 en la nueva. No son la misma serie.' },
  { id: 'meta',  basis: 'CapEx + pagos de principal de leases financieros',
    note: '⚠ Desde el JV con Blue Owl (Hyperion, Luisiana), el costo de construcción del data center ya NO entra en CapEx: Meta aporta 20% y va por “other investing”. El JV con BlackRock (El Paso, 1 GW) sigue el mismo esquema. El CapEx reportado subestima la capacidad que Meta controla.' },
  { id: 'msft',  basis: 'CapEx incluyendo leases financieros',
    note: '⚠ La brecha entre CapEx y “cash paid for PP&E” es el lease financiero, que se reconoce entero al firmar. Desde FY27 la extensión de vida útil 15→25 años empuja leases futuros a operativos, que quedan FUERA del CapEx reportado (~$15B menos en CY2026 sin cambiar la inversión).' },
];

// ── 3 · CONTRACTED BACKLOG ────────────────────────────────────────────────────
// US$B. Alphabet "Cloud backlog", Amazon "backlog", Microsoft "commercial RPO".
// Meta has none by design — it sells no contracted cloud capacity. That absence
// is a finding, not missing data.
export const HS_BACKLOG = {
  googl: [null, null, null, null, null, null, 155, 240, 462, 514],
  amzn:  [null, null, null, null, 189,  null, 200, 244, 364, 496],
  meta:  [null, null, null, null, null, null, null, null, null, null],
  msft:  [null, 269,  null, 298,  315,  368,  392,  625,  627,  678],
};

export const HS_BACKLOG_NOTES = [
  'Microsoft es la única que publica el corte de concentración: en FY26Q4 el RPO creció <b>84% reportado pero 25% excluyendo OpenAI</b>. Ese desglose lo dieron ellos, sin que se lo pidieran.',
  'De los $462B de backlog de Alphabet en 1Q26, <b>$46B son acuerdos de hardware TPU</b>, no contratos cloud típicos.',
  'Amazon: “multi-year, multi-gigawatt” de Anthropic y OpenAI. El backlog pasó de $189B a $496B en cinco trimestres.',
  'Meta no tiene backlog porque no vende capacidad contratada — todo su CapEx se justifica contra retorno interno. Es la que menos prueba externa puede mostrar, y lo reconoce: Susan Li dijo que GenAI está “mucho más temprano en la curva de retorno”, y no dan guía 2027.',
];

// ── 4 · ACCOUNTING & USEFUL-LIFE CHANGES ──────────────────────────────────────
// Every change moves reported profit or reported CapEx in the favourable
// direction. Listed chronologically.
export const HS_ACCOUNTING = [
  { when: "Ene '24", who: 'amzn', what: 'Extiende la vida útil de servidores a 6 años',
    effect: '+', impact: '≈ +200 pb de margen AWS interanual, repetido los cuatro trimestres de 2024.' },
  { when: "Ene '25", who: 'meta', what: 'Extiende la vida útil de servidores y red a ~5,5 años',
    effect: '+', impact: 'Ahorro en CapEx anual y en depreciación; ya venía dentro de la guía.' },
  { when: "Ene '25", who: 'amzn', what: 'Acorta un subconjunto de servidores y red de 6 a 5 años',
    effect: '−', impact: '−$700M al resultado operativo 2025; más $920M de cargo por retiro anticipado en 4Q24 y −$600M adicionales en 2025.' },
  { when: "Ene '25", who: 'amzn', what: 'Extiende equipo pesado de fulfillment de 10 a 13 años',
    effect: '+', impact: '+$900M al resultado operativo 2025 — compensa con creces el ajuste de servidores.' },
  { when: "Oct '25", who: 'meta', what: 'JV con Blue Owl (Hyperion, Luisiana)',
    effect: '+', impact: 'La construcción sale del CapEx reportado; Meta aporta 20% vía “other investing”.' },
  { when: "Jul '26", who: 'msft', what: 'Extiende data centers y oficinas de 15 a 25 años (desde FY27)',
    effect: '+', impact: 'Impacto “mínimo” en resultado operativo FY27 — pero arrastra leases de financieros a operativos y baja el CapEx reportado CY2026 de ~$190B a ~$175B.' },
  { when: "Jul '26", who: 'meta', what: 'JV con BlackRock (El Paso, 1 GW)',
    effect: '+', impact: 'Mismo esquema que Blue Owl. Meta: “multiple pathways to generate returns on invested capital”.' },
];

// ── 5 · THE MIGRATING BOTTLENECK ──────────────────────────────────────────────
export const HS_BOTTLENECK = [
  { period: '2024', label: 'Chips y señal de demanda',
    quote: 'Microsoft, jul-24: “we can throttle that investment… if we see differences in demand signal”. El discurso todavía es que la demanda manda y la oferta se ajusta.' },
  { period: '2025 H1', label: 'Energía',
    quote: 'Jassy, feb-25: “the world is still constrained on power”. Amazon empieza a reportar gigavatios como KPI: +3,8 GW en doce meses.' },
  { period: '2025 H2', label: 'Capacidad física',
    quote: 'Las cuatro dicen que la demanda excede la oferta. Microsoft revierte su propia guía: de “FY26 crecerá menos que FY25” a “crecerá más”.' },
  { period: '2026', label: 'Memoria y componentes',
    quote: 'El driver de las subas ya no es capacidad sino precio: Amazon +$20B, Microsoft ~$25B de los $190B, Meta lo atribuye explícitamente a memoria. Alphabet alquila capacidad de terceros como puente.' },
];
