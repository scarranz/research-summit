"""Extract AMZN's ceStyle() into a stylesheet scoped to .ov-sn.

Reads js/overviews/amzn.js, pulls the ceStyle() body, turns the JS string
concatenation back into plain CSS, substitutes the colour constants, and
prefixes EVERY selector with .ov-sn so the result cannot reach any other
profile's markup. @media bodies are recursed into; @keyframes bodies are left
alone (their "from/to/0%" are not selectors).
"""
import re, sys, io

SRC, OUT, SCOPE = 'js/overviews/amzn.js', 'css/earnings.css', '.ov-sn'

COLORS = {
    'BRAND': 'var(--brand)', 'BRAND2': 'var(--brand-2, #146EB4)',
    'SQUID': '#232F3E', 'GREEN': '#2E8B57', 'GRAY': '#9AA4B0',
    'BLUE': '#2557D6', 'RED': '#EA4335', 'YELLOW': '#E8A00C',
    'PURPLE': '#7A5AF8', 'AMBER': '#B7791F',
}

src = io.open(SRC, encoding='utf-8').read()

# ── 1. the Earnings CSS is NOT one block. AMZN emits ~9 <style> elements; five
# carry the Earnings machinery:
#     ceHeaderSources()  → .cohd-src* / .edgar   (the IR + EDGAR banner cards)
#     ceStyle()          → .ce-*                 (153 rules)
#     ceGridStyle()      → .ce-*                 (27 rules, incl. .ce-dbt)
#     cePhaseStyle()     → .ce-*                 (173 rules, the three phases)
#     EW_CSS             → .ew-*                 (32 rules, the Watch List)
# Taking only ceStyle() — the first attempt — produced a stylesheet missing the
# banners, the debate grid, the phase chrome and the whole Watch List.
BLOCKS = ['function ceHeaderSources(){', 'function ceStyle(){', 'function ceGridStyle(){',
          'function cePhaseStyle(){', "var EW_CSS='<style>'"]
body = ''
for marker in BLOCKS:
    if marker not in src:
        sys.exit('MISSING BLOCK: ' + marker)
    s = src.index(marker)
    # capture from the marker to the literal that closes this style element
    e = src.index('</style>', s) + len('</style>')
    body += src[s:e] + "\n';\n"

# ── 2. rebuild the CSS from the JS literals + colour constants ───────────────
# A real state machine, not a regex. The earlier regex desynced on apostrophes
# inside JS comments ("AMZN's"), which swallowed whole runs of CSS and silently
# produced a stylesheet with 78 of the 356 classes. Walk strings and comments
# explicitly instead.
css, i, n = '', 0, len(body)
ident = re.compile(r'[A-Z_][A-Z_0-9]*')
while i < n:
    c = body[i]
    if c == "'":                                   # string literal
        j, lit = i + 1, ''
        while j < n:
            if body[j] == '\\':
                lit += body[j + 1]
                j += 2
                continue
            if body[j] == "'":
                break
            lit += body[j]
            j += 1
        if lit != '<style>':
            css += lit
        i = j + 1
        continue
    if c == '/' and i + 1 < n and body[i + 1] == '*':   # block comment
        i = body.index('*/', i) + 2
        continue
    if c == '/' and i + 1 < n and body[i + 1] == '/':   # line comment
        nl = body.find('\n', i)
        i = n if nl < 0 else nl + 1
        continue
    m = ident.match(body, i)                        # a colour constant
    if m:
        name = m.group(0)
        if name in COLORS:
            css += COLORS[name]
        elif name not in ('BRAND', 'BRAND2'):
            pass                                    # `return`, `function` etc.
        i = m.end()
        continue
    i += 1
css = css.replace('</style>', '')

# ── 3. split into top-level rules, honouring brace depth ─────────────────────
def split_rules(text):
    rules, buf, depth, i, n = [], '', 0, 0, len(text)
    while i < n:
        c = text[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                rules.append(buf + '}')
                buf = ''
                i += 1
                continue
        buf += c
        i += 1
    if buf.strip():
        rules.append(buf)
    return rules

def scope_sel(sel):
    out = []
    for part in sel.split(','):
        p = part.strip()
        if not p:
            continue
        out.append(p if p.startswith(SCOPE) else SCOPE + ' ' + p)
    return ', '.join(out)

def fmt_decls(d):
    items = [x.strip() for x in d.split(';') if x.strip()]
    return ''.join('\n  ' + x + ';' for x in items)

def emit(rule, indent=''):
    head, _, rest = rule.partition('{')
    head = head.strip()
    inner = rest.rstrip()
    if inner.endswith('}'):
        inner = inner[:-1]
    if head.startswith('@media') or head.startswith('@supports'):
        sub = ''.join(emit(r, indent + '  ') for r in split_rules(inner))
        return '\n%s%s {%s\n%s}\n' % (indent, head, sub, indent)
    if head.startswith('@keyframes'):
        return '\n%s%s {%s\n%s}\n' % (indent, head, inner, indent)
    if head.startswith('@'):
        return '\n%s%s { %s }\n' % (indent, head, inner.strip())
    return '\n%s%s {%s\n%s}' % (indent, scope_sel(head), fmt_decls(inner).replace('\n  ', '\n  ' + indent), indent)

rules = split_rules(css)
out = [
    '/* css/earnings.css — the .ce-* Earnings machinery, as a STYLESHEET.',
    ' *',
    ' * Extracted mechanically from the ceStyle() block in js/overviews/amzn.js (the superset of',
    ' * the six inline copies) by scripts/, with BRAND/BRAND2 swapped for var(--brand) /',
    ' * var(--brand-2) and the semantic state colours kept at AMZN\'s literal values.',
    ' *',
    ' * ⚠ EVERY selector is scoped to `.ov-sn`. That is deliberate and it is the whole safety',
    ' * story: amzn, googl, uber, lyft, meta and spot each still ship their own inline ceStyle(),',
    ' * and this file physically cannot reach their markup. Linking it changes nothing for them.',
    ' *',
    ' * This is the SEED for the portal-wide extraction the blueprint (§3.3) describes — that PR',
    ' * drops the `.ov-sn` scope, deletes the six inline copies and points every profile here.',
    ' * Until someone does that, do not widen the scope.',
    ' *',
    ' * Regenerate: py scripts/extract_ce_style.py',
    ' */',
    '',
]
for r in rules:
    out.append(emit(r))

text = '\n'.join(out) + '\n'
io.open(OUT, 'w', encoding='utf-8').write(text)
nrules = text.count(' {')
print('wrote %s — %d bytes, ~%d rules' % (OUT, len(text), nrules))
unscoped = [l for l in text.split('\n') if l.rstrip().endswith('{') and '.ov-sn' not in l and not l.strip().startswith('@')]
print('unscoped rule heads: %d' % len(unscoped))
for l in unscoped[:10]:
    print('   ' + l.strip())
