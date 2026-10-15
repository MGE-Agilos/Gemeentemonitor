/* Généré par scripts/build_budget_module.py — ne pas modifier ici. */
// Minimal stand-in for the claude.ai dashboard API: loads the JSON files, runs the
// page's calculations once their inputs are loaded, and redraws on data or resize.
window.dash = (function () {
  const files = {communes: 'budget/data/communes.json', specificites: 'budget/data/specificites.json', fonctions: 'budget/data/fonctions.json', carte: 'budget/data/carte.json', pluriannuel: 'budget/data/pluriannuel.json'};
  const store = {}, calcs = {}, cbs = [];
  const notify = () => cbs.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
  const recompute = () => {
    Object.entries(calcs).forEach(([id, c]) => {
      const st = c.inputs.map((i) => (store[i] || {}).status);
      if (st.every((s) => s === 'ok')) {
        try { store[id] = { status: 'ok', data: c.fn(...c.inputs.map((i) => store[i].data)) }; }
        catch (e) { console.error(e); store[id] = { status: 'error', data: [] }; }
      } else store[id] = { status: st.includes('error') ? 'error' : 'loading', data: [] };
    });
  };
  Object.entries(files).forEach(([id, url]) => {
    store[id] = { status: 'loading', data: [] };
    fetch(url).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => { store[id] = { status: 'ok', data: d }; recompute(); notify(); })
      .catch((e) => { store[id] = { status: 'error', data: [], message: String(e) }; recompute(); notify(); });
  });
  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(notify, 150); });
  return {
    data: (id) => store[id] || { status: 'missing', data: [] },
    calc: (id, o) => { calcs[id] = o; recompute(); },
    loader: () => {},
    onData: (f) => { cbs.push(f); try { f(); } catch (e) { console.error(e); } },
    colors: ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)', 'var(--s7)', 'var(--s8)'],
    setLink: (name) => { if (window.GM && GM.budgetLink) GM.budgetLink(name); },
    params: () => ({}), setParams: () => {}, resetParams: () => {}, refresh: () => {},
  };
})();
