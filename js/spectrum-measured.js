// spectrum-measured.js — the Spectrum's measured layer.
//
// The board's y axis, capital intensity, is a judgment: someone decided where NVIDIA sits
// relative to Meta. This module computes the same axis from filed figures, so the two can be
// put side by side and the gap between them argued about. The x axis is deliberately NOT
// computed — see "Why only one axis" below.
//
// The ghost marker a company gets is always at its own x. Only the height moves. The line
// between node and ghost is the whole point: it is the distance between what we think a
// business costs to run and what its accounts say.
//
// Inputs come from js/spectrum-measured-data.js, generated from SEC XBRL by
// scripts/spectrum/fetch-fundamentals.ps1. Nothing here is typed by hand.

import { SPECTRUM_FUNDAMENTALS } from './spectrum-measured-data.js';

/* ─── Why only one axis ────────────────────────────────────────────────────
   The x axis asks how a company creates value — technology, users, footprint,
   or the underlying commodity. That is a claim about the source of a business's
   economics, and filings do not report it. Every ratio that looks like a proxy
   breaks on the same case: Meta's property and equipment now runs near a full
   year of revenue, so any asset-based measure of x would push the purest
   advertising business on the board out past a hard-discount grocer. What that
   ratio actually measures is capital intensity — which is the other axis.

   So x stays a judgment, y gets measured, and the two pieces of evidence that
   do bear on x — gross margin and R&D intensity — are reported in the panel as
   evidence rather than folded into a coordinate.                             */

/* ─── The three terms ──────────────────────────────────────────────────────
   Capital intensity is read as: how much capital does a dollar of revenue tie
   up, in whatever form the business ties it up?

   A fab ties it up as plant. A discounter ties it up as stores and inventory.
   A lender ties it up as equity it must hold against a loan book — which is the
   rule this axis was missing. SoFi and Interactive Brokers have almost no fixed
   assets and are not asset-light in any sense that matters, and the funding term
   is what says so.

   Each term is scaled between two anchors on a log axis, because capital
   intensity spans two orders of magnitude across the board and a linear scale
   would put everything except the fabs in the top decile. Anchors are round
   numbers chosen to bracket the board, not fitted to it.                      */

const TERMS = [
  {
    key: 'capex',
    label: 'Capex / revenue',
    hint: 'Capital being consumed right now — the flow.',
    weight: 0.40,
    anchors: [0.004, 0.35],
    of: f => (f.capex == null ? null : f.capex / f.revenue),
    format: v => (v * 100).toFixed(1) + '%'
  },
  {
    key: 'assets',
    label: 'Productive assets / revenue',
    hint: 'Property, plant and equipment, leased space and inventory — the stock.',
    weight: 0.35,
    anchors: [0.03, 1.2],
    of: f => {
      // Missing lines are absent, not zero — but a company with property and no
      // inventory line genuinely carries no inventory, so the sum tolerates nulls
      // as long as at least one of the three is reported.
      const parts = [f.ppe, f.rou, f.inventory].filter(v => v != null);
      if (!parts.length) return null;
      return parts.reduce((a, b) => a + b, 0) / f.revenue;
    },
    format: v => v.toFixed(2) + '×'
  },
  {
    key: 'funding',
    label: 'Equity / revenue',
    hint: 'Capital the business must hold to operate at all — the term that catches lenders.',
    weight: 0.25,
    anchors: [0.20, 3.0],
    of: f => (f.equity == null ? null : f.equity / f.revenue),
    format: v => v.toFixed(2) + '×'
  }
];

// Evidence about the x axis. Shown, never scored.
const EVIDENCE = [
  {
    key: 'grossMargin',
    label: 'Gross margin',
    hint: 'What the next unit costs. Near-zero marginal cost is the signature of an intangible model.',
    of: f => (f.grossProfit == null ? null : f.grossProfit / f.revenue),
    format: v => (v * 100).toFixed(0) + '%'
  },
  {
    key: 'rnd',
    label: 'R&D / revenue',
    hint: 'What the company spends to know something others do not.',
    of: f => (f.rnd == null ? null : f.rnd / f.revenue),
    format: v => (v * 100).toFixed(1) + '%'
  }
];

const BY_TICKER = SPECTRUM_FUNDAMENTALS.reduce((m, f) => { m[f.ticker] = f; return m; }, {});

// Log interpolation between anchors, clamped. Values at or below the low anchor
// score 0 (asset-light, top of the board); at or above the high anchor, 100.
function scale(value, [lo, hi]) {
  if (!(value > 0)) return 0;
  const t = (Math.log(value) - Math.log(lo)) / (Math.log(hi) - Math.log(lo));
  return Math.max(0, Math.min(100, t * 100));
}

/* Returns null when the company has no usable filing at all, and otherwise an
   object carrying the score, the terms behind it, and what was missing — the
   panel shows all three, because a number whose provenance is hidden is worth
   less than no number. */
export function measureCapital(ticker) {
  const f = BY_TICKER[ticker];
  if (!f || !f.revenue) return null;

  const used = [];
  const missing = [];

  for (const term of TERMS) {
    const raw = term.of(f);
    if (raw == null) {
      missing.push(term);
      continue;
    }
    used.push({
      key: term.key,
      label: term.label,
      hint: term.hint,
      weight: term.weight,
      value: raw,
      display: term.format(raw),
      score: scale(raw, term.anchors)
    });
  }

  // Two terms out of three still says something; one does not.
  if (used.length < 2) return null;

  const weight = used.reduce((a, t) => a + t.weight, 0);
  const y = used.reduce((a, t) => a + t.score * t.weight, 0) / weight;

  const evidence = EVIDENCE.map(e => {
    const raw = e.of(f);
    return { key: e.key, label: e.label, hint: e.hint, display: raw == null ? null : e.format(raw) };
  });

  return {
    ticker,
    y: Math.round(y * 10) / 10,
    terms: used,
    missing: missing.map(t => ({ key: t.key, label: t.label })),
    partial: used.length < TERMS.length,
    evidence,
    period: f.periodEnd,
    form: f.form,
    currency: f.currency,
    stale: f.stale || null
  };
}

// Everything the board can measure, keyed by ticker — so the plane can draw its
// ghosts without asking company by company whether one exists.
export function measuredBoard(tickers) {
  const out = {};
  for (const t of tickers) {
    const m = measureCapital(t);
    if (m) out[t] = m;
  }
  return out;
}

export const MEASURED_NOTE =
  'Capital intensity computed from each company\'s latest annual filing (10-K, or 20-F for ' +
  'TSMC, Spotify, Grupo Aeroportuario and Tiendas 3B): capex, productive assets and equity, ' +
  'each per dollar of revenue, blended 40 / 35 / 25. The horizontal axis is not computed — ' +
  'no filed ratio distinguishes how a company creates value without collapsing into this one.';
