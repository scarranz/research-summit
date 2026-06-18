const PEOPLE = ['daa', 'sab', 'pvg'];
const FIELDS = ['apr', 'aug', 'dec-ret', 'dec-rr'];
const LS_KEY = 'summit-portfolio-pts';

export function loadTeamPage() {
  const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');

  document.querySelectorAll('.port-input').forEach(input => {
    const key = input.dataset.key;
    if (saved[key] !== undefined && saved[key] !== '') input.value = saved[key];

    input.addEventListener('input', () => {
      saved[key] = input.value;
      localStorage.setItem(LS_KEY, JSON.stringify(saved));
      updateTotal(key.split('-')[0], saved);
    });
  });

  PEOPLE.forEach(p => updateTotal(p, saved));
}

function updateTotal(person, saved) {
  let total = 0;
  let hasAny = false;
  FIELDS.forEach(f => {
    const val = parseFloat(saved[`${person}-${f}`]);
    if (!isNaN(val)) { total += val; hasAny = true; }
  });
  const el = document.getElementById(`pt-${person}`);
  if (el) el.textContent = hasAny ? (Number.isInteger(total) ? total : total.toFixed(1)) : '—';
}
