/* Stated targets — what Musk and SpaceX management have promised in public, and what has happened since.
   Catalogue started from SOURCES/ELON_MEDIA_GUIDE.md; quotes re-checked against the SpaceX Q2/Q3 2026 call transcripts where they exist. Every row was re-checked on Nov 25 2026 against the source named
   in "Evidence" unless it says "not re-checked". Status as of Nov 25 2026. */
const TGT_EV = {
  call:  'Company call transcript',
  off:   'Official transcript',
  third: 'Third-party transcript',
  press: 'Press report only',
  nrc:   'Not re-checked'
};
const TGT = [
  // topic, target, stated (date · venue), evidence key, status key, status note
  ['rev',  '$100B of ARR by the end of 2026, "annualized revenue based on the month of December"', 'Oct 20 2026 · Q3 call (CFO); also Q2 call and Baron conference', 'call', 'open', 'Q4 2026 print settles it. Q3 was $14.6B (~$58B annualised); Musk expects ~70% q/q growth in Q4.'],
  ['rev',  '~$500B annualised revenue in December 2027 — "my best guess"', 'Nov 6 2026 · Baron conference', 'third', 'open', 'Consensus 2027 revenue $187B; J.P. Morgan ~$400B exit ARR.'],
  ['rev',  '$1T annualised revenue by end-2027 — about 2% likely, in his words', 'Nov 6 2026 · Baron conference', 'third', 'open', 'Stated as a low-probability case, not a target.'],
  ['rev',  '10 GW online by end-2027 → $300–500B a year of revenue (≈ $30–50 per watt)', 'Aug 11 2026 · SpaceX all-hands', 'press', 'open', '1.4 GW was running at the time.'],
  ['gw',   'Compute: a little over 2 GW at end-2026 and 5–10 GW by 2027 (CFO)', 'Sep 10 2026 · Goldman Sachs conference', 'press', 'raised', 'Raised on Oct 20 to 2.5–3 GW at YE26 and +10 GW during 2027.'],
  ['gw',   'Adding ~0.5 GW a month now; more than 1 GW a month by end-2027', 'Nov 18 2026 · TomorrowX Summit', 'press', 'open', 'Implies ~3 GW at YE26 if the pace holds.'],
  ['gw',   'Build cost ~60% of industry estimates ("off by a factor of two")', 'Nov 18 2026 · TomorrowX Summit', 'press', 'open', 'J.P. Morgan models ~$33B per GW and reports SpaceX sees its cost in the mid-$30sB range, "potentially well below the costs of others" (Oct 21 2026).'],
  ['ship', 'Catch the ship on the next flight, "end of this month" (August)', 'Aug 4 2026 · Q2 call', 'call', 'slipped', 'Caught on Flight 15, Nov 14 — about three months later; the booster was lost on that flight (J.P. Morgan; press, not yet a company disclosure).'],
  ['ship', 'At least one Starship flight a day, "probably a year from now"', 'Aug 4 2026 · Q2 call', 'call', 'walked', 'Oct 20: weekly in 1H27, twice weekly or more in 2H27.'],
  ['ship', 'Weekly flights "at some point in the first half of next year", twice weekly or more in 2H27', 'Oct 20 2026 · Q3 call', 'call', 'open', 'Flight 13 → 14 gap was ~9 weeks. Re-flying the caught ship by early 2027 is management’s aim per J.P. Morgan (Nov 2026), not stated on the call.'],
  ['ship', 'Full reusability is the 2026 breakthrough', 'Jan 22 2026 · Davos', 'nrc', 'partly', 'Ship caught (Nov 14) but booster lost and no stage re-flown (J.P. Morgan; press); reflight now targeted for early 2027.'],
  ['ship', 'Under $100 per kg to orbit', 'Nov 6 2026 · Baron conference', 'third', 'open', 'No date attached. Clear Street reads the S-1 as requiring ~$100/kg for orbital compute.'],
  ['ship', '~1 million tons to orbit in three or four years', 'Feb 5 2026 · Dwarkesh Podcast', 'off', 'open', '2025: ~2,200 tons in total (Bloomberg).'],
  ['ship', 'Uncrewed Starships to Mars in the late-2026 window', 'May 2025 · Starbase update', 'nrc', 'walked', 'Dropped in Feb 2026 for a Moon-first plan; Mars work resumes in 5–7 years.'],
  ['orb',  'Space becomes the cheapest place to put AI within 36 months, "maybe 30"', 'Feb 5 2026 · Dwarkesh Podcast', 'off', 'open', 'Implies ~2028–29. Bank models put cost parity in the 2030s.'],
  ['orb',  'Full AI-1 compute satellites launch late 2027', 'Jun 12 2026 · Shotwell on CNBC', 'off', 'open', 'Dates have held since June.'],
  ['orb',  'Starmind compute satellites: first launch Q3 2027, large volume 2028, very large 2029 ("I\'m just guessing")', 'Nov 6 2026 · Baron conference', 'third', 'open', 'Q3 call: Starmind satellites begin flying in 2027.'],
  ['orb',  'Terafab first test chip functional "in approximately May or June of next year"', 'Oct 20 2026 · Q3 call (repeated Nov 18 at TomorrowX)', 'call', 'open', 'Volume production "around Q3 of 2028" at Gibbons Creek (Q3 call). No cost or construction schedule given at the March launch event.'],
  ['conn', 'Starlink Mobile U.S. service in early 2028, after Mobile V2 satellites fly in 2027', 'Oct 20 2026 · Q3 call', 'call', 'open', 'J.P. Morgan expects 2029.'],
  ['conn', 'Direct-to-cell V2 in 2027; 800 MHz micro-cells in production in 2027', 'Nov 18 2026 · NYT DealBook', 'nrc', 'open', ''],
  ['conn', 'Starlink V3 → ~100× today\'s bandwidth in two to three years', 'Nov 6 2026 · Baron conference', 'nrc', 'open', 'First V3s flew on Starship (26 per flight vs 60 planned).'],
  ['other','Long-run margins ~70% gross, ~45% net', 'Jun 4 2026 · IPO roadshow', 'nrc', 'open', '2025: 49% gross, −26% net.'],
  ['other','AI will be ~99% of SpaceX\'s value in four or five years', 'Aug 11 2026 · SpaceX all-hands', 'press', 'open', 'Not testable near term.'],
  ['other','Capex lower than peers ("not quite as much")', 'Jun 12 2026 · Shotwell on CNBC', 'off', 'open', 'Capex was $48B in 9M 2026; ~$300B implied for 2027.']
];
const TGT_ST = { open:['Open','n'], raised:['Raised','ok'], slipped:['Slipped','wait'], walked:['Walked back','open'], partly:['Partly met','wait'] };
const TGT_TOPIC = [['all','All'],['rev','Revenue'],['gw','Compute build'],['ship','Starship'],['orb','Orbital & chips'],['conn','Starlink'],['other','Other']];

registerView({ id:'tgt',
  html: `
  <div class="srow" id="tgt-tiles"></div>

  ${sec({ t:'What was promised, and what happened', s:'Public targets from Musk, Shotwell and the CFO, each checked against the source named',
    ctl:`<div class="ctls">${seg('tgt-f','Topic',TGT_TOPIC,'all')}</div>`,
    b:`<div class="tw" id="tgt-t"></div>`,
    n:'Evidence: <b>company call</b> = SpaceX earnings-call transcript; <b>official transcript</b> = published by the host (Dwarkesh, CNBC); <b>third-party transcript</b> = TeslaNorth\'s transcript of the Baron talk, not checked word for word by its publisher; <b>press report only</b> = no transcript or recording was checked; the quote rests on a news write-up of the talk (Teslarati, Dealroom, BGR) — treat as unconfirmed; <b>not re-checked</b> = not yet compared with a transcript. Where a Q2 or Q3 2026 call transcript carries the same target, the call is cited instead. Status as of Nov 25 2026.' })}

  ${sec({ t:'How to read Musk\'s timelines', s:'Our read: his own rule, and the 2026 record',
    b:`<ul class="pl">
      <li><strong>He sets deadlines at about 50% odds</strong> and expects to be late half the time (Dwarkesh, Feb 2026). Treat a date as a median, not a commitment.</li>
      <li><strong>Hardware slips one to two quarters:</strong> the ship catch came ~3 months after the Q2-call promise; full reuse and orbital refuelling moved from 2026 to early 2027.</li>
      <li><strong>Cadence promises get walked back within a quarter:</strong> "at least one flight a day", "probably a year from now" (Q2 call, Aug) became weekly → twice weekly in 2027 (Oct).</li>
      <li><strong>Compute guidance has been raised, not cut</strong> (CFO 5–10 GW in Sep, press → "highly confident of 10 gigawatts incremental next year" on the Oct call), and the build rate he cites (0.5 GW a month, press) supports it. Compute is the part the market pays for.</li>
      <li><strong>Revenue targets come with his own odds:</strong> ~$500B exit ARR in 2027 is a "best guess"; $1T about 2%. The Bull scenario uses the first, never the second.</li>
    </ul>`,
    n:'Dwarkesh Podcast official transcript (Feb 5 2026); SpaceX Q2 and Q3 2026 call transcripts; Baron conference transcript (TeslaNorth, Nov 7 2026).' })}

  ${sec({ t:'Where to hear it', s:'The five sources worth the time, in order',
    b:`<ul class="pl">
      <li><strong>Baron Investment Conference, Nov 6 2026</strong> — ARR path and his own odds; Starmind dates. Third-party transcript: <a href="https://teslanorth.com/2026/11/07/elon-musks-full-ron-baron-interview-2026-tesla-spacex-starship-ai-and-more/" target="_blank" rel="noopener">TeslaNorth</a>.</li>
      <li><strong>TomorrowX Summit with Gavin Baker, Nov 18 2026</strong> — build rate, cost per GW, Terafab. <a href="https://www.youtube.com/watch?v=DY8clym2-jQ" target="_blank" rel="noopener">YouTube</a>.</li>
      <li><strong>Dwarkesh Podcast, Feb 5 2026</strong> — the orbital-compute case and his deadline rule. <a href="https://www.dwarkesh.com/p/elon-musk" target="_blank" rel="noopener">Official transcript</a>.</li>
      <li><strong>Shotwell on CNBC, Jun 12 2026</strong> — AI-1 satellites, capex discipline. <a href="https://pressroom.versantmedia.com/cnbc/press-releases/cnbc-exclusive-transcript-spacex-president-and-coo-gwynne-shotwell-speaks-cnbcs" target="_blank" rel="noopener">Official transcript</a>.</li>
      <li><strong>SpaceX all-hands, Aug 11 2026</strong> — 10 GW → $300–500B; AI as ~99% of value. <a href="https://www.teslarati.com/spacexs-next-trillion-dollar-bet-has-nothing-to-do-with-rockets-musk-tells-staff/" target="_blank" rel="noopener">Teslarati report (press)</a>.</li>
    </ul>`,
    n:'Primary sources first: SpaceX Q2 (Aug 4 2026) and Q3 (Oct 20 2026) earnings-call transcripts (ir.spacex.com), the Dwarkesh and CNBC official transcripts above. The all-hands and TomorrowX items rest on press reports and video, not a published transcript.' })}
  `,
  init(){
    let f = 'all';
    const draw = () => {
      const rows = TGT.filter(r => f === 'all' || r[0] === f);
      $('#tgt-t').innerHTML = table(['Target','Stated','Evidence','Status','Since then'],
        rows.map(r => [`<span style="white-space:normal;display:inline-block;max-width:340px;text-align:left">${r[1]}</span>`, r[2], `<span class="tag ${r[3]==='nrc'?'n':r[3]==='press'?'wait':'e'}">${TGT_EV[r[3]]}</span>`,
          `<span class="tag ${TGT_ST[r[4]][1]}">${TGT_ST[r[4]][0]}</span>`, `<span style="white-space:normal;display:inline-block;max-width:300px;text-align:left">${r[5]}</span>`]));
    };
    pills('#tgt-f', v => { f = v; draw(); });
    const n = k => TGT.filter(r => r[4] === k).length;
    $('#tgt-tiles').innerHTML = tile('Targets tracked', TGT.length, 'Musk, Shotwell, CFO · Jan–Nov 2026') +
      tile('Still open', n('open'), 'Most fall due in 2027') +
      tile('Slipped or walked back', n('slipped') + n('walked') + n('partly'), 'All on Starship and Mars') +
      tile('Raised', n('raised'), 'Compute build guidance');
    draw();
  }
});
