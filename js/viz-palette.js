// ═══════════════════════════════════════════════════════════════════════════════════════════════
//  The portal's categorical chart palette — one fixed hue order, used by every company.
//
//  WHY THIS EXISTS. A company profile must not choose colours. When each profile picked its own
//  brand hues, orange MEANT Amazon and green MEANT Spotify, so the same chart read differently on
//  every page and a new profile had a palette decision to make before it could draw anything. With
//  one fixed order, slot 1 is the same blue on every company, and colour stops carrying brand.
//  The company's brand belongs in its logo. (SAB, Sep 2026.)
//
//  HOW TO USE IT. Assign slots in FIXED ORDER and never cycle: series 1 takes SUMMIT_CAT[0],
//  series 2 takes SUMMIT_CAT[1], and so on. Colour follows the ENTITY, not its rank — if a filter
//  drops a series, the survivors keep their slots rather than being repainted. A ninth series is
//  never a generated hue: fold it into "Other", facet it, or use small multiples.
//
//  VALIDATION (do not eyeball this; re-run it if you change a value). Checked with the dataviz
//  skill's validator against the portal's white card surface, light mode, on the ADJACENT pairlist
//  — the one that applies to stacked bars, grouped bars and lines:
//      Lightness band ......... pass (all inside L 0.43–0.77)
//      Chroma floor ........... pass (all >= 0.1)
//      CVD separation ......... pass (worst adjacent ΔE 9.1, target >= 8)
//      Normal-vision floor .... pass (worst adjacent ΔE 19.6, floor >= 15)
//      Contrast vs surface .... RELIEF REQUIRED for slots 3, 4 and 5 (aqua 2.82, yellow 2.17,
//                               magenta 2.69 — all below 3:1 on white)
//
//  ⚠ THE RELIEF RULE IS A CONDITION, NOT A WARNING. If a chart uses slot 3, 4 or 5 it MUST also
//  ship visible direct labels or the data table under it. Every portal chart already carries a
//  collapsible table (CHART_ENGINE_REFERENCE §0.2, non-negotiable 3), so the condition is met by
//  construction — but if you ever build a chart without one, these hues are not available to it.
//
//  ⚠ SCATTER, BUBBLE AND CHOROPLETH USE A DIFFERENT PAIRLIST. Those forms compare every pair, not
//  just neighbours, and the full set cannot clear the floors there. Cap them at THREE slots
//  (SUMMIT_CAT3, validated all-pairs) and fold the rest into "Other".
// ═══════════════════════════════════════════════════════════════════════════════════════════════

export var SUMMIT_CAT = [
  '#2a78d6',   // 1 · blue
  '#eb6834',   // 2 · orange
  '#1baf7a',   // 3 · aqua      — relief required
  '#eda100',   // 4 · yellow    — relief required
  '#e87ba4',   // 5 · magenta   — relief required
  '#008300',   // 6 · green
  '#4a3aa7',   // 7 · violet
  '#e34948',   // 8 · red
];

// The all-pairs-safe subset. Use this for scatter / bubble / choropleth / small multiples.
export var SUMMIT_CAT3 = SUMMIT_CAT.slice(0, 3);

// Neutrals and semantics. These are NOT categorical slots and must never be used as "series 4":
// a status colour that also means a series destroys the status reading.
export var SUMMIT_INK  = '#1E2733';   // near-black navy — the "actual"/reference series
export var SUMMIT_MUTE = '#7C8694';   // grey — context, comparison, "everything else"
export var SUMMIT_POS  = '#16A34A';   // good
export var SUMMIT_NEG  = '#DC2626';   // bad

// Fade a series colour to an alpha, accepting BOTH '#rrggbb' and 'rgba(r,g,b,a)'. Estimate and
// forward periods are drawn with the same hue at reduced alpha, never a different hue — the hue
// carries the entity, the alpha carries the confidence.
export function fade(c, a){
  if (!c) return c;
  if (c.charAt(0) === '#'){
    var h = c.replace('#', '');
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    return 'rgba(' + parseInt(h.slice(0,2),16) + ',' + parseInt(h.slice(2,4),16) + ',' +
           parseInt(h.slice(4,6),16) + ',' + a + ')';
  }
  var m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(c);
  return m ? 'rgba(' + m[1] + ',' + m[2] + ',' + m[3] + ',' + a + ')' : c;
}
