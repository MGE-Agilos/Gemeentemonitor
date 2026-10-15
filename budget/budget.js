/* Généré par scripts/build_budget_module.py à partir de budgets/data/dashboard/index.html. */

(function () {
  const S = window.BC = window.BC || {};
  // néerlandais par défaut (priorité commerciale : la Flandre) ; ?lang=fr dans l'URL pour le français
  let urlLang = null;
  try { urlLang = new URLSearchParams(location.search).get('lang'); } catch (e) { /* sandbox */ }
  S.lang = S.lang || (urlLang === 'fr' ? 'fr' : 'nl');
  // bilingual string: L('texte', 'tekst')
  const L = S.L = (fr, nl) => (S.lang === 'nl' ? nl : fr);
  const fmtCache = {};
  const nf = (key, opts) => {
    const k = S.lang + key;
    if (!fmtCache[k]) fmtCache[k] = new Intl.NumberFormat(S.lang === 'nl' ? 'nl-BE' : 'fr-BE', opts);
    return fmtCache[k];
  };
  const ok = (v) => v != null && isFinite(v);
  S.fmt = {
    eur: (v) => (ok(v) ? nf('0', { maximumFractionDigits: 0 }).format(v) + ' €' : '—'),
    eurc: (v) => (ok(v) ? (Math.abs(v) >= 1e5 ? nf('c', { notation: 'compact', maximumFractionDigits: 1 }).format(v) : nf('0', { maximumFractionDigits: 0 }).format(v)) + ' €' : '—'),
    n0: (v) => (ok(v) ? nf('0', { maximumFractionDigits: 0 }).format(v) : '—'),
    n1: (v) => (ok(v) ? nf('1', { maximumFractionDigits: 1 }).format(v) : '—'),
    n2: (v) => (ok(v) ? nf('2', { maximumFractionDigits: 2 }).format(v) : '—'),
    signedEur: (v) => (ok(v) ? (v > 0 ? '+' : v < 0 ? '−' : '') + S.fmt.eurc(Math.abs(v)) : '—'),
  };
  // indicator catalogue: key -> [fr, nl, unit, decimals, group]
  S.IND = {
    dep_expl_hab: ["Dépenses d'exploitation / hab.", 'Exploitatie-uitgaven / inw.', '€', 0, 'bud'],
    rec_expl_hab: ["Recettes d'exploitation / hab.", 'Exploitatie-ontvangsten / inw.', '€', 0, 'bud'],
    solde_expl_hab: ["Solde d'exploitation / hab.", 'Exploitatiesaldo / inw.', '€', 0, 'bud'],
    solde_expl_pct: ["Solde d'exploitation (% des recettes)", 'Exploitatiesaldo (% van de ontvangsten)', '%', 1, 'bud'],
    dep_inv_hab: ['Investissements / hab.', 'Investeringen / inw.', '€', 0, 'bud'],
    ratio_charges_financieres_pct: ['Ratio de charges financières (Wallonie, Bruxelles)', 'Financiële lastenratio (Wallonië, Brussel)', '%', 1, 'bud'],
    gf_ecart_plan_2027_2031_hab: ['Écart Gemeentefonds 2027-2031 / hab. (Flandre)', 'Verschil Gemeentefonds 2027-2031 / inw. (Vlaanderen)', '€', 0, 'bud'],
    dep_personnel_hab: ['Personnel / hab.', 'Personeel / inw.', '€', 0, 'bud'],
    dep_fonctionnement_hab: ['Fonctionnement / hab.', 'Werking / inw.', '€', 0, 'bud'],
    dep_transferts_hab: ['Transferts / hab.', 'Overdrachten / inw.', '€', 0, 'bud'],
    dep_dette_hab: ['Dette / hab.', 'Schuld / inw.', '€', 0, 'bud'],
    police_hab: ['Dotation zone de police / hab.', 'Dotatie politiezone / inw.', '€', 0, 'bud'],
    secours_hab: ['Dotation zone de secours / hab.', 'Dotatie hulpverleningszone / inw.', '€', 0, 'bud'],
    cpas_hab: ['Dotation CPAS / hab.', 'Dotatie OCMW / inw.', '€', 0, 'bud'],
    rec_fiscalite_hab: ['Fiscalité / hab.', 'Fiscaliteit / inw.', '€', 0, 'bud'],
    ipp_hab: ['Additionnels IPP / hab.', 'Aanvullende personenbelasting / inw.', '€', 0, 'bud'],
    pri_hab: ['Additionnels précompte immobilier / hab.', 'Opcentiemen onroerende voorheffing / inw.', '€', 0, 'bud'],
    taxes_locales_hab: ['Taxes locales / hab.', 'Lokale belastingen / inw.', '€', 0, 'bud'],
    rec_dotations_hab: ['Dotations et subsides / hab.', 'Dotaties en subsidies / inw.', '€', 0, 'bud'],
    fonds_hab: ['Fonds des communes / hab.', 'Gemeentefonds / inw.', '€', 0, 'bud'],
    rec_prestations_hab: ['Prestations / hab.', 'Prestaties / inw.', '€', 0, 'bud'],
    population: ['Population', 'Bevolking', 'hab', 0, 'pop'],
    croissance_pop_2015_2025_pct: ['Croissance de la population 2015-2025', 'Bevolkingsgroei 2015-2025', '%', 1, 'pop'],
    part_0_2_pct: ['Part des 0-2 ans', 'Aandeel 0-2-jarigen', '%', 1, 'pop'],
    part_3_11_pct: ['Part des 3-11 ans', 'Aandeel 3-11-jarigen', '%', 1, 'pop'],
    part_0_17_pct: ['Part des 0-17 ans', 'Aandeel 0-17-jarigen', '%', 1, 'pop'],
    part_65p_pct: ['Part des 65 ans et plus', 'Aandeel 65-plussers', '%', 1, 'pop'],
    part_80p_pct: ['Part des 80 ans et plus', 'Aandeel 80-plussers', '%', 1, 'pop'],
    part_etrangers_pct: ['Part des étrangers', 'Aandeel vreemdelingen', '%', 1, 'pop'],
    age_moyen: ['Âge moyen', 'Gemiddelde leeftijd', 'ans', 1, 'pop'],
    revenu_imposable_par_habitant: ['Revenu imposable / hab.', 'Belastbaar inkomen / inw.', '€', 0, 'rich'],
    revenu_disponible_median_menage: ['Revenu disponible médian', 'Mediaan beschikbaar inkomen', '€', 0, 'rich'],
    taux_risque_pauvrete_pct: ['Taux de risque de pauvreté', 'Armoederisico', '%', 1, 'rich'],
    taux_implicite_additionnel_ipp_pct: ['Taux implicite additionnel IPP', 'Impliciet tarief aanvullende personenbelasting', '%', 2, 'rich'],
    revenu_cadastral_par_habitant: ['Revenu cadastral / hab.', 'Kadastraal inkomen / inw.', '€', 0, 'rich'],
    revenu_cadastral_exonere_pct: ['Revenu cadastral exonéré', 'Vrijgesteld kadastraal inkomen', '%', 1, 'rich'],
    prix_median_maison: ["Prix médian d'une maison", 'Mediaanprijs van een woning', '€', 0, 'rich'],
    rc_economique_pct: ['Part économique du revenu cadastral', 'Economisch aandeel van het KI', '%', 1, 'eco'],
    entreprises_par_1000_hab: ['Entreprises TVA / 1 000 hab.', 'Btw-plichtige ondernemingen / 1 000 inw.', '', 1, 'eco'],
    horeca_par_1000_hab: ['Horeca / 1 000 hab.', 'Horeca / 1 000 inw.', '', 1, 'eco'],
    hebergements_par_1000_hab: ['Hôtels et campings / 1 000 hab.', 'Hotels en campings / 1 000 inw.', '', 2, 'eco'],
    superficie_km2: ['Superficie', 'Oppervlakte', 'km²', 1, 'terr'],
    densite_hab_km2: ['Densité', 'Dichtheid', 'hab/km²', 0, 'terr'],
    sections_villages: ['Sections (anciennes communes)', 'Deelgemeenten', '', 0, 'terr'],
    sol_bati_pct: ['Sol bâti', 'Bebouwde grond', '%', 1, 'terr'],
    sol_bois_pct: ['Bois', 'Bos', '%', 1, 'terr'],
    km_voirie_locale_par_1000_hab: ['Voirie locale (km / 1 000 hab.)', 'Lokale wegen (km / 1 000 inw.)', 'km', 2, 'terr'],
    batiments_avant_1946_pct: ["Bâtiments d'avant 1946", 'Gebouwen van vóór 1946', '%', 1, 'terr'],
    n_piscine: ['Piscines', 'Zwembaden', '', 0, 'equ'],
    n_ecole: ['Écoles', 'Scholen', '', 0, 'equ'],
    n_hall_sportif_par_10000_hab: ['Halls sportifs / 10 000 hab.', 'Sporthallen / 10 000 inw.', '', 1, 'equ'],
    n_hopital: ['Hôpitaux', 'Ziekenhuizen', '', 0, 'equ'],
    n_gare: ['Gares', 'Stations', '', 0, 'equ'],
  };
  S.GROUPS = { bud: ['Budget 2026', 'Begroting 2026'], pop: ['Population', 'Bevolking'], rich: ['Richesse et fiscalité', 'Welvaart en fiscaliteit'], eco: ['Activité économique', 'Economische activiteit'], terr: ['Territoire', 'Grondgebied'], equ: ['Équipements', 'Voorzieningen'] };
  S.UNITS = { hab: ['hab.', 'inw.'], 'hab/km²': ['hab./km²', 'inw./km²'], ans: ['ans', 'jaar'] };
  S.REGIONS = ['Wallonie', 'Flandre', 'Bruxelles'];
  S.REGNAME = { Wallonie: ['Wallonie', 'Wallonië'], Flandre: ['Flandre', 'Vlaanderen'], Bruxelles: ['Bruxelles', 'Brussel'], Belgique: ['Belgique', 'België'] };
  S.FONCTIONS = {
    '0 Recettes et dépenses générales': 'Algemene ontvangsten en uitgaven', '1 Administration générale': 'Algemeen bestuur', '3 Sécurité': 'Veiligheid',
    '4 Voiries-communications': 'Wegen en verkeer', '5 Industrie - commerce': 'Nijverheid en handel', '6 Sylviculture - Agriculture': 'Bosbouw en landbouw',
    '70>75 Enseignement': 'Onderwijs', '76>77 Culture et sports': 'Cultuur en sport', '78 Radio, télévision, presse': 'Radio, televisie, pers', '79 Culte': 'Erediensten',
    '80>86 Action sociale': 'Sociale actie', '87 Santé publique et hygiène': 'Volksgezondheid en hygiëne', '90>92 Logement': 'Huisvesting', '93 Aménagement du territoire': 'Ruimtelijke ordening',
  };
  S.POSTENL = { Personnel: 'Personeel', Fonctionnement: 'Werking', Transferts: 'Overdrachten', Dette: 'Schuld', Autres: 'Overige', Fiscalité: 'Fiscaliteit', 'Dotations et subsides': 'Dotaties en subsidies', Prestations: 'Prestaties', Dépenses: 'Uitgaven', Recettes: 'Ontvangsten' };
  S.fonction = (f) => (S.lang === 'nl' ? f.split(' ')[0] + ' ' + (S.FONCTIONS[f] || f.slice(f.indexOf(' ') + 1)) : f);
  S.poste = (p) => (S.lang === 'nl' ? S.POSTENL[p] || p : p);
  S.reg = (r) => (S.REGNAME[r] ? S.REGNAME[r][S.lang === 'nl' ? 1 : 0] : r);
  S.name = (r) => (S.lang === 'nl' ? r.commune_nl || r.commune : r.commune);
  S.prov = (r) => (S.lang === 'nl' ? r.province_nl || r.province : r.province);
  S.statut = (s) => ({ fiable: L('fiable', 'betrouwbaar'), faible: L('peu fiable', 'weinig betrouwbaar'), absent: L('absent', 'ontbreekt') }[s] || s);

  S.state = S.state || { tab: 'apercu', region: 'Belgique', ind: 'dep_expl_hab', x: 'revenu_imposable_par_habitant', y: 'dep_expl_hab',
    nis: '62063', search: '', sort: { key: 'ind', dir: -1 }, dims: ['taille', 'territoire', 'richesse', 'age'], k: 10 };
  S.sim = S.sim || { nis: null, lev: {}, lines: [] };

  S.label = (k) => (S.IND[k] ? S.IND[k][S.lang === 'nl' ? 1 : 0] : k);
  S.fmtInd = (k, v) => {
    if (v == null || !isFinite(v)) return '—';
    const m = S.IND[k];
    if (!m) return S.fmt.n1(v);
    const d = m[3] === 0 ? S.fmt.n0(v) : m[3] === 1 ? S.fmt.n1(v) : S.fmt.n2(v);
    const u = S.UNITS[m[2]] ? S.UNITS[m[2]][S.lang === 'nl' ? 1 : 0] : m[2];
    return u === '€' ? d + ' €' : u === '%' ? d + ' %' : u ? d + ' ' + u : d;
  };
  S.colorOf = (region) => dash.colors[Math.max(0, S.REGIONS.indexOf(region))];
  S.median = (a) => (a.length ? d3.median(a) : null);
  S.pctCache = {};
  // percentile of a value within its region (rank / n)
  S.pct = (rows, key, row) => {
    const ck = key + '|' + row.region;
    if (!S.pctCache[ck]) S.pctCache[ck] = rows.filter((r) => r.region === row.region && r[key] != null).map((r) => r[key]).sort((a, b) => a - b);
    const a = S.pctCache[ck];
    if (row[key] == null || !a.length) return null;
    return 100 * d3.bisectRight(a, row[key]) / a.length;
  };
  S.tip = (box) => {
    let t = box.querySelector('.bc-tip');
    if (!t) { t = document.createElement('div'); t.className = 'bc-tip'; t.hidden = true; box.appendChild(t); }
    return {
      show(ev, lines) {
        t.replaceChildren(...lines.map((l, i) => { const d = document.createElement('div'); if (i === 0) { const b = document.createElement('b'); b.textContent = l; d.appendChild(b); } else { d.textContent = l; d.className = i === 1 ? 'muted' : ''; } return d; }));
        t.hidden = false;
        const r = box.getBoundingClientRect();
        let x = ev.clientX - r.left + 12, y = ev.clientY - r.top + 12;
        const w = t.offsetWidth, h = t.offsetHeight;
        if (x + w > r.width) x = Math.max(0, ev.clientX - r.left - w - 12);
        if (y + h > r.height) y = Math.max(0, ev.clientY - r.top - h - 12);
        t.style.left = x + 'px'; t.style.top = y + 'px';
      },
      hide() { t.hidden = true; },
    };
  };
  S.failed = (el) => { el.replaceChildren(); const d = document.createElement('div'); d.className = 'bc-failed'; d.textContent = 'Failed to load'; el.appendChild(d); };
  S.empty = (el, txt) => { el.replaceChildren(); const p = document.createElement('p'); p.className = 'bc-empty'; p.textContent = txt; el.appendChild(p); };
  S.useLog = (vals) => { const pos = vals.filter((v) => v > 0); return pos.length === vals.length && pos.length > 1 && d3.max(pos) / d3.min(pos) > 80; };
  S.axisClean = (g) => { g.attr('font-size', null).attr('font-family', null); g.selectAll('text').attr('fill', 'var(--color-fg-muted)').style('font-size', 'var(--cds-font-size-caption)'); g.selectAll('line,path').attr('stroke', 'var(--cds-chart-axis)'); };
  S.safe = (fns) => fns.forEach((f) => { try { f(); } catch (e) { setTimeout(() => { throw e; }); } });

  // peers: same region, usable budget, nearest on standardized dimensions
  S.DIMS = {
    taille: [['Taille', 'Omvang'], [['population', true]]],
    territoire: [['Territoire', 'Grondgebied'], [['densite_hab_km2', true], ['superficie_km2', true], ['sections_villages', false]]],
    richesse: [['Richesse', 'Welvaart'], [['revenu_imposable_par_habitant', false], ['taux_risque_pauvrete_pct', false]]],
    age: [['Âge', 'Leeftijd'], [['part_0_17_pct', false], ['part_65p_pct', false]]],
    economie: [['Activité économique', 'Economische activiteit'], [['rc_economique_pct', false], ['entreprises_par_1000_hab', false]]],
    immobilier: [['Base immobilière', 'Vastgoedbasis'], [['revenu_cadastral_par_habitant', false]]],
    tourisme: [['Tourisme', 'Toerisme'], [['horeca_par_1000_hab', false]]],
  };
  S.peers = (rows, c) => {
    if (!c) return [];
    const reg = rows.filter((r) => r.region === c.region);
    const feats = S.state.dims.flatMap((d) => (S.DIMS[d] ? S.DIMS[d][1] : []));
    if (!feats.length) return [];
    const stats = feats.map(([k, lg]) => {
      const v = reg.map((r) => r[k]).filter((x) => x != null && (!lg || x > 0)).map((x) => (lg ? Math.log(x) : x));
      return [k, lg, d3.mean(v), d3.deviation(v) || 1];
    });
    const z = (r, [k, lg, m, s]) => (r[k] == null || (lg && r[k] <= 0) ? null : ((lg ? Math.log(r[k]) : r[k]) - m) / s);
    const zc = stats.map((st) => z(c, st));
    return reg.filter((r) => r.nis !== c.nis && r.budget_statut === 'fiable' && r.dep_expl_hab != null)
      .map((r) => {
        let s = 0, n = 0;
        stats.forEach((st, i) => { const a = zc[i], b = z(r, st); if (a != null && b != null) { s += (a - b) ** 2; n++; } });
        return { r, d: n ? Math.sqrt(s / n) : Infinity };
      })
      .sort((a, b) => a.d - b.d).slice(0, S.state.k).map((x) => x.r);
  };

  // simulation model: base amounts (€) from the per-inhabitant figures of the 2026 budget
  S.POSTES = [
    ['dep_personnel_hab', ['Personnel', 'Personeel'], 'dep'], ['dep_fonctionnement_hab', ['Fonctionnement', 'Werking'], 'dep'], ['dep_transferts_hab', ['Transferts', 'Overdrachten'], 'dep'],
    ['dep_dette_hab', ['Dette', 'Schuld'], 'dep'], ['dep_autres_hab', ['Autres dépenses', 'Overige uitgaven'], 'dep'],
    ['rec_fiscalite_hab', ['Fiscalité', 'Fiscaliteit'], 'rec'], ['rec_dotations_hab', ['Dotations et subsides', 'Dotaties en subsidies'], 'rec'], ['rec_prestations_hab', ['Prestations', 'Prestaties'], 'rec'], ['rec_autres_hab', ['Autres recettes', 'Overige ontvangsten'], 'rec'],
  ];
  S.LEVERS = [
    ['personnel', ['Personnel', 'Personeel'], '%', 'dep_personnel_hab'], ['fonctionnement', ['Fonctionnement (énergie, entretien…)', 'Werking (energie, onderhoud…)'], '%', 'dep_fonctionnement_hab'],
    ['police', ['Dotation zone de police', 'Dotatie politiezone'], '%', 'police_hab'], ['secours', ['Dotation zone de secours', 'Dotatie hulpverleningszone'], '%', 'secours_hab'],
    ['cpas', ['Dotation CPAS', 'Dotatie OCMW'], '%', 'cpas_hab'], ['transferts', ['Autres transferts', 'Overige overdrachten'], '%', 'dep_transferts_hab'], ['dette', ['Charges de la dette', 'Schuldlasten'], '%', 'dep_dette_hab'],
    ['ipp_taux', ["Taux d'additionnel IPP (nouveau taux)", 'Tarief aanvullende personenbelasting (nieuw tarief)'], 'taux', 'ipp_hab'], ['pri', ['Additionnels au précompte immobilier', 'Opcentiemen onroerende voorheffing'], '%', 'pri_hab'],
    ['taxes', ['Taxes locales', 'Lokale belastingen'], '%', 'taxes_locales_hab'], ['prestations', ['Tarifs et prestations', 'Tarieven en prestaties'], '%', 'rec_prestations_hab'],
    ['dotations', ['Fonds et dotations régionales', 'Gewestelijke fondsen en dotaties'], '%', 'rec_dotations_hab'], ['population', ['Population', 'Bevolking'], '%', null],
  ];
  S.LEVERS_TOTAL = [['dep_tot', ["Dépenses d'exploitation", 'Exploitatie-uitgaven'], '%', 'dep_expl_hab'], ['rec_tot', ["Recettes d'exploitation", 'Exploitatie-ontvangsten'], '%', 'rec_expl_hab'], ['population', ['Population', 'Bevolking'], '%', null]];
  S.flemishTax = (c) => c.region === 'Flandre' && c.waarde_1pct_apb > 0 && c.aanslagvoet_apb > 0;
  S.LEVERS_FL = S.LEVERS.filter(([k]) => k !== 'ipp_taux' && k !== 'pri').concat([
    ['apb_taux', ['Taux additionnel IPP (APB, nouveau taux en %)', 'Aanvullende personenbelasting (APB, nieuw tarief in %)'], 'apb', null],
    ['oov_opc', ['Centimes additionnels au précompte (OOV, nouveau nombre)', 'Opcentiemen onroerende voorheffing (OOV, nieuw aantal)'], 'oov', null]]);
  S.simActive = () => S.sim.nis && (Object.values(S.sim.lev).some((v) => v != null && v !== '' && Number(v) !== 0) || S.sim.lines.some((l) => Number(l.montant)));
  S.simulate = (c) => {
    if (!c) return null;
    const Lv = (k) => { const v = Number(S.sim.lev[k]); return isFinite(v) ? v / 100 : 0; };
    const pop0 = c.population, g = Lv('population'), pop1 = pop0 * (1 + g);
    const A = (k) => (c[k] == null ? 0 : c[k] * pop0);
    const lines = S.sim.lines.filter((l) => Number(l.montant));
    const rows = [];
    let extra = {};
    if (c.budget_ventile) {
      const pol = A('police_hab'), sec = A('secours_hab'), cp = A('cpas_hab'), tr = A('dep_transferts_hab');
      const trAutres = Math.max(0, tr - pol - sec - cp);
      const ipp = A('ipp_hab'), pri = A('pri_hab'), tax = A('taxes_locales_hab'), fisc = A('rec_fiscalite_hab');
      const t0 = c.taux_implicite_additionnel_ipp_pct, t1 = Number(S.sim.lev.ipp_taux);
      const hasT = S.sim.lev.ipp_taux != null && S.sim.lev.ipp_taux !== '' && isFinite(t1) && t0;
      const ippScale = (hasT ? t1 / t0 : 1) * (1 + g);
      const fiscAutres = Math.max(0, fisc - ipp - pri - tax);
      // Flanders: official rates and yields (1 % APB, 100 opcentiemen OOV) of the multi-year plan
      let ippNew = ipp * ippScale, priNew = pri * (1 + Lv('pri')) * (1 + g);
      if (S.flemishTax(c)) {
        const set = (k) => S.sim.lev[k] != null && S.sim.lev[k] !== '' && isFinite(Number(S.sim.lev[k]));
        const dA = set('apb_taux') ? (Number(S.sim.lev.apb_taux) - c.aanslagvoet_apb) * c.waarde_1pct_apb : 0;
        const dO = set('oov_opc') ? (Number(S.sim.lev.oov_opc) - c.aanslagvoet_oov) / 100 * c.waarde_100opc_oov : 0;
        ippNew = (ipp + dA) * (1 + g); priNew = (pri + dO) * (1 + g);
      }
      const sim = {
        dep_personnel_hab: A('dep_personnel_hab') * (1 + Lv('personnel')),
        dep_fonctionnement_hab: A('dep_fonctionnement_hab') * (1 + Lv('fonctionnement')),
        dep_transferts_hab: trAutres * (1 + Lv('transferts')) + pol * (1 + Lv('police')) + sec * (1 + Lv('secours')) + cp * (1 + Lv('cpas')),
        dep_dette_hab: A('dep_dette_hab') * (1 + Lv('dette')),
        dep_autres_hab: A('dep_autres_hab'),
        rec_fiscalite_hab: fiscAutres + ippNew + priNew + tax * (1 + Lv('taxes')),
        rec_dotations_hab: A('rec_dotations_hab') * (1 + Lv('dotations')),
        rec_prestations_hab: A('rec_prestations_hab') * (1 + Lv('prestations')),
        rec_autres_hab: A('rec_autres_hab'),
      };
      S.POSTES.forEach(([k, lab, s]) => rows.push({ k, lab: lab[S.lang === 'nl' ? 1 : 0], s, v0: A(k), v1: sim[k] }));
      const ex = { police_hab: pol * (1 + Lv('police')), secours_hab: sec * (1 + Lv('secours')), cpas_hab: cp * (1 + Lv('cpas')),
        ipp_hab: ippNew, pri_hab: priNew, taxes_locales_hab: tax * (1 + Lv('taxes')), fonds_hab: A('fonds_hab') * (1 + Lv('dotations')) };
      extra = Object.fromEntries(Object.entries(ex).map(([k, v]) => [k, c[k] == null ? null : v / pop1]));
    } else {
      rows.push({ k: 'dep_expl_hab', lab: L("Dépenses d'exploitation", 'Exploitatie-uitgaven'), s: 'dep', v0: A('dep_expl_hab'), v1: A('dep_expl_hab') * (1 + Lv('dep_tot')) });
      rows.push({ k: 'rec_expl_hab', lab: L("Recettes d'exploitation", 'Exploitatie-ontvangsten'), s: 'rec', v0: A('rec_expl_hab'), v1: A('rec_expl_hab') * (1 + Lv('rec_tot')) });
    }
    lines.forEach((l, i) => rows.push({ k: 'ligne' + i, lab: l.libelle || L('Ligne ajoutée', 'Toegevoegde lijn'), s: l.sens, v0: 0, v1: Number(l.montant) }));
    const sum = (s, f) => d3.sum(rows.filter((r) => r.s === s), (r) => r[f]);
    const dep0 = sum('dep', 'v0'), dep1 = sum('dep', 'v1'), rec0 = sum('rec', 'v0'), rec1 = sum('rec', 'v1');
    const perHab = {};
    rows.forEach((r) => { if (!r.k.startsWith('ligne')) perHab[r.k] = c[r.k] == null ? null : r.v1 / pop1; });
    Object.assign(perHab, extra);
    perHab.dep_expl_hab = dep1 / pop1; perHab.rec_expl_hab = rec1 / pop1;
    return { rows, dep0, dep1, rec0, rec1, pop0, pop1, perHab };
  };

  // ---- motion helpers ----
  S.reduced = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  // animate a figure from its previous value to the new one
  S.countUp = (el, v, fmt) => {
    if (v == null || !isFinite(v)) { el.textContent = fmt(v); el._v = null; return; }
    const from = el._v != null && isFinite(el._v) ? el._v : 0;
    el._v = v;
    if (S.reduced() || from === v) { el.textContent = fmt(v); return; }
    let t0 = null; const dur = 550;
    const step = (t) => {
      if (el._v !== v) return;
      if (t0 == null) t0 = t;
      const k = Math.max(0, Math.min(1, (t - t0) / dur)), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(k < 1 ? from + (v - from) * e : v);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  S.toast = (msg) => {
    let t = document.querySelector('.bc-toast');
    if (!t) { t = document.createElement('div'); t.className = 'bc-toast'; t.setAttribute('role', 'status'); document.querySelector('.bc').appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(S._toastT); S._toastT = setTimeout(() => { t.hidden = true; }, 2600);
  };
  S.GLOSS = {
    afm: [['Autofinancement (AFM)', 'Autofinancieringsmarge (AFM)'], ["Solde d'exploitation moins les remboursements périodiques nets des emprunts. Il mesure si la commune peut rembourser sa dette avec ses recettes courantes. Le plan doit afficher une AFM positive la dernière année (2031).", 'Exploitatiesaldo min de netto periodieke leningsuitgaven. Het toont of de gemeente haar schuld kan aflossen met haar gewone ontvangsten. Het plan moet een positieve AFM hebben in het laatste jaar (2031).']],
    bbr: [['Résultat budgétaire disponible (BBR)', 'Beschikbaar budgettair resultaat (BBR)'], ['Résultat budgétaire cumulé, moins les montants réservés. Il doit être positif chaque année du plan pluriannuel.', 'Gecumuleerd budgettair resultaat min de bestemde gelden. Het moet elk jaar van het meerjarenplan positief zijn.']],
    gf: [['Gemeentefonds', 'Gemeentefonds'], ["Principale dotation de la Région flamande aux communes. Sa croissance annuelle (3,5 %) est ramenée à 1 % en 2027, 1,25 % en 2028 et 1,5 % en 2029. Le niveau perdu n'est pas rattrapé : la perte est structurelle.", 'Belangrijkste dotatie van het Vlaamse Gewest aan de gemeenten. De jaarlijkse groei (3,5 %) wordt 1 % in 2027, 1,25 % in 2028 en 1,5 % in 2029. Het verloren niveau wordt niet ingehaald: het verlies is structureel.']],
    solde: [["Solde d'exploitation", 'Exploitatiesaldo'], ["Wallonie et Bruxelles : résultat de l'exercice propre du service ordinaire, prélèvements fonctionnels compris. Flandre : solde d'exploitation BBC, qui doit être positif pour couvrir les remboursements d'emprunts. Les définitions diffèrent : comparez au sein d'une région.", 'Wallonië en Brussel: resultaat van het eigen dienstjaar van de gewone dienst, functionele heffingen inbegrepen. Vlaanderen: exploitatiesaldo BBC, dat positief moet zijn om de aflossingen te dekken. De definities verschillen: vergelijk binnen een gewest.']],
    extra: [['Indicateur de soutenabilité', 'Duurzaamheidsindicator'], ['Flandre : AFM 2031 après la réduction du Gemeentefonds. Wallonie et Bruxelles : ratio de charges financières (intérêts et remboursements / recettes ordinaires) ; les circulaires wallonnes 2026 demandent une trajectoire de dette au-delà de 17,5 % (15,5 % sous plan CRAC).', 'Vlaanderen: AFM 2031 na de inkrimping van het Gemeentefonds. Wallonië en Brussel: financiële lastenratio (intresten en aflossingen / gewone ontvangsten); de Waalse omzendbrieven 2026 vragen een schuldtraject boven 17,5 % (15,5 % onder CRAC-plan).']],
    pct: [['Rang régional', 'Gewestelijke rang'], ["Position de la commune parmi les communes de sa région, de 0 (la plus basse) à 100 (la plus haute). On compare au sein d'une région parce que les règles de financement et de comptabilité diffèrent.", 'Positie van de gemeente tussen de gemeenten van haar gewest, van 0 (laagste) tot 100 (hoogste). We vergelijken binnen een gewest omdat de financierings- en boekhoudregels verschillen.']],
    pairs: [['Communes comparables', 'Vergelijkbare gemeenten'], ['Communes de la même région, avec un budget exploitable, les plus proches sur les dimensions choisies (écarts standardisés). Changez les dimensions pour changer le groupe de comparaison.', 'Gemeenten uit hetzelfde gewest, met een bruikbare begroting, die het dichtst aanleunen op de gekozen dimensies (gestandaardiseerde verschillen). Wijzig de dimensies om de vergelijkingsgroep te wijzigen.']],
    leviers: [['Comment simuler', 'Hoe simuleren'], ['Déplacez un curseur ou tapez une valeur : le résultat se met à jour immédiatement dans le bandeau. Les variations s\'appliquent au budget 2026. Enregistrez ensuite le scénario pour le comparer à d\'autres.', 'Verschuif een schuifregelaar of typ een waarde: het resultaat wordt meteen bijgewerkt in de balk. De wijzigingen gelden voor de begroting 2026. Bewaar daarna het scenario om het met andere te vergelijken.']],
  };
  S.showInfo = (btn) => {
    const g = S.GLOSS[btn.dataset.term]; if (!g) return;
    S.hideInfo();
    const pop = document.createElement('div'); pop.className = 'bc-pop'; pop.setAttribute('role', 'dialog');
    const b = document.createElement('b'); b.textContent = g[0][S.lang === 'nl' ? 1 : 0];
    pop.append(b, document.createTextNode(g[1][S.lang === 'nl' ? 1 : 0]));
    const root = document.querySelector('.bc'); root.appendChild(pop);
    const rr = root.getBoundingClientRect(), br = btn.getBoundingClientRect();
    let x = br.right - rr.left - pop.offsetWidth; if (x < 0) x = 0;
    pop.style.left = x + 'px'; pop.style.top = (br.bottom - rr.top + 6) + 'px';
    S._pop = pop;
  };
  S.hideInfo = () => { if (S._pop) { S._pop.remove(); S._pop = null; } };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.bc-info');
    if (b) { e.stopPropagation(); if (S._pop && S._popFor === b) { S.hideInfo(); S._popFor = null; } else { S.showInfo(b); S._popFor = b; } return; }
    if (S._pop && !e.target.closest('.bc-pop')) { S.hideInfo(); S._popFor = null; }
  }, true);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { S.hideInfo(); } });

  // static texts: data-nl (text) and data-nl-ph (placeholder); French kept in data-fr
  S.applyStatic = () => {
    try { document.documentElement.lang = S.lang; } catch (e) { /* sandbox */ }
    document.querySelectorAll('.bc [data-nl]').forEach((el) => {
      if (el.dataset.fr == null) el.dataset.fr = el.textContent;
      el.textContent = S.lang === 'nl' ? el.dataset.nl : el.dataset.fr;
    });
    document.querySelectorAll('.bc [data-nl-ph]').forEach((el) => {
      if (el.dataset.frPh == null) el.dataset.frPh = el.placeholder;
      el.placeholder = S.lang === 'nl' ? el.dataset.nlPh : el.dataset.frPh;
    });
    document.querySelectorAll('.bc-lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === S.lang)));
  };
})();

;

// ---------- data, calculations, tabs, language ----------
(function () {
  const S = window.BC;
  const L = S.L;
  dash.calc('stats_region', {
    inputs: ['communes'],
    title: 'Chiffres clés par région / Kerncijfers per gewest',
    description: "Nombre de communes, population, médianes et total des dépenses d'exploitation 2026 (budgets exploitables).",
    fn: (communes) => ['Belgique', 'Wallonie', 'Flandre', 'Bruxelles'].map((region) => {
      const rs = communes.filter((c) => region === 'Belgique' || c.region === region);
      const ok = rs.filter((c) => c.budget_statut === 'fiable' && c.dep_expl_hab != null);
      return {
        region,
        communes: rs.length,
        communes_budget: ok.length,
        population: d3.sum(rs, (c) => c.population),
        population_budget: d3.sum(ok, (c) => c.population),
        dep_expl_mediane_hab: Math.round(d3.median(ok, (c) => c.dep_expl_hab)),
        rec_expl_mediane_hab: Math.round(d3.median(ok.filter((c) => c.rec_expl_hab != null), (c) => c.rec_expl_hab)),
        dep_expl_total: d3.sum(ok, (c) => c.dep_expl_total),
        communes_solde: ok.filter((c) => c.solde_expl_total != null && c.solde_expl_total !== '').length,
        communes_deficit: ok.filter((c) => c.solde_expl_total != null && c.solde_expl_total !== '' && Number(c.solde_expl_total) < 0).length,
        solde_expl_total: d3.sum(ok, (c) => Number(c.solde_expl_total) || 0),
      };
    }),
  });
  dash.calc('natures_region', {
    inputs: ['communes'],
    title: 'Budget par nature et par région / Begroting per aard en gewest',
    description: 'Moyenne par habitant de chaque nature de dépense et de recette (somme des montants / somme des habitants), budgets ventilés.',
    fn: (communes) => {
      const postes = [['dep_personnel_hab', 'Personnel', 'Dépenses'], ['dep_fonctionnement_hab', 'Fonctionnement', 'Dépenses'], ['dep_transferts_hab', 'Transferts', 'Dépenses'], ['dep_dette_hab', 'Dette', 'Dépenses'], ['dep_autres_hab', 'Autres', 'Dépenses'],
        ['rec_fiscalite_hab', 'Fiscalité', 'Recettes'], ['rec_dotations_hab', 'Dotations et subsides', 'Recettes'], ['rec_prestations_hab', 'Prestations', 'Recettes'], ['rec_autres_hab', 'Autres', 'Recettes']];
      const out = [];
      ['Wallonie', 'Flandre', 'Bruxelles'].forEach((region) => {
        const rs = communes.filter((c) => c.region === region && c.budget_ventile);
        const pop = d3.sum(rs, (c) => c.population);
        postes.forEach(([k, poste, sens]) => out.push({ region, sens, poste, moyenne_hab: Math.round(d3.sum(rs, (c) => (c[k] || 0) * c.population) / pop), communes: rs.length }));
      });
      return out;
    },
  });
  dash.calc('fonctions_region', {
    inputs: ['fonctions', 'communes'],
    title: 'Dépenses par fonction et par région / Uitgaven per functie en gewest',
    description: "Moyenne par habitant des dépenses d'exploitation de chaque groupe de fonctions, communes ventilées par fonction.",
    fn: (fonctions, communes) => {
      const pop = new Map(communes.map((c) => [c.nis, c]));
      const out = [];
      ['Wallonie', 'Flandre', 'Bruxelles'].forEach((region) => {
        const rows = fonctions.filter((f) => pop.get(f.nis) && pop.get(f.nis).region === region);
        const nisSet = new Set(rows.map((f) => f.nis));
        const popTot = d3.sum([...nisSet], (n) => pop.get(n).population);
        d3.rollups(rows, (v) => d3.sum(v, (f) => f.dep_hab * pop.get(f.nis).population), (f) => f.fonction)
          .forEach(([fonction, tot]) => out.push({ region, fonction, moyenne_hab: Math.round(tot / popTot) }));
      });
      return out;
    },
  });

  dash.calc('gf_stats', {
    inputs: ['communes'],
    title: 'Gemeentefonds : chiffres clés / kerncijfers',
    description: "Somme des écarts entre plans pluriannuels et montants officiels 2027-2031, perte par rapport à 3,5 %, plans non adaptés et communes qui ne respectent plus les normes BBC après la réduction.",
    fn: (communes) => {
      const f = communes.filter((c) => c.gf_ecart_plan_2027_2031 != null && c.gf_ecart_plan_2027_2031 !== '');
      const t = (v) => v === true || v === 'true' || v === 1;
      return [{
        communes: f.length,
        ecart_plan: d3.sum(f, (c) => Number(c.gf_ecart_plan_2027_2031)),
        perte_35: d3.sum(f, (c) => Number(c.gf_perte_vs_3_5_2027_2031)),
        plans_non_a_jour: f.filter((c) => !t(c.gf_plan_a_jour)).length,
        afm2031_neg: f.filter((c) => Number(c.afm_2031) < 0).length,
        afm2031_neg_apres: f.filter((c) => Number(c.afm_2031_apres) < 0).length,
        bbr_neg: f.filter((c) => t(c.bbr_negatif_avant)).length,
        bbr_neg_apres: f.filter((c) => t(c.bbr_negatif_apres)).length,
      }];
    },
  });
  dash.calc('gf_annees', {
    inputs: ['pluriannuel'],
    title: 'Gemeentefonds par année / per jaar',
    description: 'Total des communes flamandes par année : Gemeentefonds prévu, officiel et à 3,5 %, et nombre de communes avec un BBR ou une AFM négatifs avant et après la réduction.',
    fn: (pluriannuel) => d3.rollups(pluriannuel, (v) => ({
      gf_plan: d3.sum(v, (x) => x.gf_plan), gf_officieel: d3.sum(v, (x) => x.gf_officieel), gf_35: d3.sum(v, (x) => x.gf_35),
      bbr_neg: v.filter((x) => x.bbr < 0).length, bbr_neg_apres: v.filter((x) => x.bbr_apres < 0).length,
      afm_neg: v.filter((x) => x.afm < 0).length, afm_neg_apres: v.filter((x) => x.afm_apres < 0).length,
    }), (x) => x.annee).map(([annee, o]) => ({ annee, ...o })).sort((a, b) => a.annee - b.annee),
  });

  const tabs = [...document.querySelectorAll('.bc-tab')];
  S.showTab = (t) => {
    S.state.tab = t;
    if (S.anim) S.anim();
    tabs.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === t)));
    ['apercu', 'gf', 'commune', 'simulation', 'methode'].forEach((id) => { document.getElementById(id).hidden = id !== t; });
    dash.setLink(t);
    S.render();
  };
  tabs.forEach((b) => b.addEventListener('click', () => S.showTab(b.dataset.tab)));
  // sticky bar height, used to place the simulation result bar under it
  const sticky = document.getElementById('bc-sticky');
  const setH = () => document.querySelector('.bc').style.setProperty('--bc-sticky-h', sticky.offsetHeight + 'px');
  try { new ResizeObserver(setH).observe(sticky); } catch (e) { /* old browser */ }
  setH();
  // one fade-in of the charts after a navigation (not while typing in the simulation)
  S.anim = () => {
    const root = document.querySelector('.bc'); root.classList.add('bc-anim');
    clearTimeout(S._animT); S._animT = setTimeout(() => root.classList.remove('bc-anim'), 450);
  };
  // drill-down from the tiles
  document.querySelector('.bc').addEventListener('click', (e) => {
    const t = e.target.closest('.bc-tile[data-drill]'); if (!t || e.target.closest('.bc-info')) return;
    const [kind, val] = t.dataset.drill.split(':');
    if (kind === 'ind') { S.state.ind = val; S.anim(); S.render(); document.getElementById('card-carte').scrollIntoView({ behavior: S.reduced() ? 'auto' : 'smooth', block: 'start' }); }
    if (kind === 'gf') { S.state.gffilter = val; S.render(); document.getElementById('card-gf-table').scrollIntoView({ behavior: S.reduced() ? 'auto' : 'smooth', block: 'start' }); }
  });
  document.querySelector('.bc').addEventListener('keydown', (e) => {
    const t = e.target.closest && e.target.closest('.bc-tile[data-drill]');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); t.click(); }
  });
  // global commune search with suggestions
  const gs = document.getElementById('g-search'), gl = document.getElementById('g-list');
  let gItems = [], gIdx = -1;
  const norm = (x) => (x || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const gClose = () => { gl.hidden = true; gs.setAttribute('aria-expanded', 'false'); gIdx = -1; };
  const gPick = (r) => {
    gClose(); gs.value = ''; gs.blur();
    const tab = ['apercu', 'methode'].includes(S.state.tab) || (S.state.tab === 'gf' && r.region !== 'Flandre') ? 'commune' : S.state.tab;
    S.select(r.nis, tab);
    S.toast(S.name(r) + ' · ' + S.reg(r.region));
  };
  const gDraw = () => {
    gl.replaceChildren(...gItems.map((r, i) => {
      const li = document.createElement('li'); li.setAttribute('role', 'option'); li.setAttribute('aria-selected', String(i === gIdx));
      const n = document.createElement('span'); n.textContent = S.name(r) + (r.commune_nl && r.commune_nl !== r.commune ? ' / ' + (S.lang === 'nl' ? r.commune : r.commune_nl) : '');
      const m = document.createElement('small'); m.textContent = S.reg(r.region) + ' · ' + S.fmt.n0(r.population) + ' ' + L('hab.', 'inw.');
      li.append(n, m);
      li.addEventListener('mousedown', (ev) => { ev.preventDefault(); gPick(r); });
      return li;
    }));
    gl.hidden = !gItems.length; gs.setAttribute('aria-expanded', String(!!gItems.length));
  };
  gs.addEventListener('input', () => {
    const q = norm(gs.value.trim());
    if (q.length < 2 || !S.rows) { gItems = []; gDraw(); return; }
    gItems = S.rows.filter((r) => norm(r.commune).includes(q) || norm(r.commune_nl).includes(q))
      .sort((a, b) => (norm(S.name(a)).startsWith(q) ? 0 : 1) - (norm(S.name(b)).startsWith(q) ? 0 : 1) || b.population - a.population).slice(0, 12);
    gIdx = gItems.length ? 0 : -1; gDraw();
  });
  gs.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); gIdx = Math.min(gItems.length - 1, gIdx + 1); gDraw(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); gIdx = Math.max(0, gIdx - 1); gDraw(); }
    else if (e.key === 'Enter' && gItems[gIdx]) { e.preventDefault(); gPick(gItems[gIdx]); }
    else if (e.key === 'Escape') gClose();
  });
  gs.addEventListener('blur', () => setTimeout(gClose, 150));
  // selected commune, with shortcuts to every view
  S.renderCtx = () => {
    const box = document.getElementById('bc-ctx'); const c = S.byNis && S.byNis.get(S.state.nis);
    if (!c) { box.replaceChildren(); return; }
    const st = document.createElement('strong'); st.textContent = S.name(c);
    const sm = document.createElement('span'); sm.className = 'bc-note'; sm.textContent = S.reg(c.region);
    const btn = (lab, tab, nl) => { const b = document.createElement('button'); b.className = 'bc-btn'; b.textContent = L(lab, nl); b.setAttribute('aria-pressed', String(S.state.tab === tab)); b.addEventListener('click', () => { if (tab === 'gf') S.state.gfnis = c.nis; S.showTab(tab); }); return b; };
    const items = [st, sm, btn('Analyse', 'commune', 'Analyse')];
    if (c.region === 'Flandre') items.push(btn('Gemeentefonds', 'gf', 'Gemeentefonds'));
    items.push(btn('Simuler', 'simulation', 'Simuleren'));
    box.replaceChildren(...items);
  };
  document.querySelectorAll('.bc-lang button').forEach((b) => b.addEventListener('click', () => {
    S.lang = b.dataset.lang;
    S.langChanged = true;
    S.render();
  }));

  S.select = (nis, tab) => {
    S.state.nis = nis;
    if (S.anim) S.anim();
    const sr = S.byNis && S.byNis.get(nis);
    if (sr && sr.region === 'Flandre') S.state.gfnis = nis;
    if (tab) S.showTab(tab); else S.render();
  };

  S.render = () => {
    S.applyStatic();
    const c = dash.data('communes');
    const st = dash.data('stats_region');
    const ok = c.status === 'ok';
    const txt = ['nis', 'commune', 'commune_nl', 'region', 'province', 'province_nl'];
    S.rows = ok ? c.data.map((r) => {
      const o = { ...r };
      Object.keys(o).forEach((k) => { if (!txt.includes(k) && k.indexOf('budget_') !== 0 && o[k] != null && o[k] !== '') o[k] = Number(o[k]); });
      o.nis = String(o.nis);
      o.budget_ventile = r.budget_ventile === true || r.budget_ventile === 'true';
      return o;
    }) : [];
    S.byNis = new Map(S.rows.map((r) => [r.nis, r]));
    S.pctCache = {};
    const lede = document.getElementById('lede');
    if (st.status === 'ok') {
      const b = st.data.find((r) => r.region === 'Belgique');
      lede.textContent = S.L(
        `${S.fmt.n0(b.communes_budget)} communes sur ${S.fmt.n0(b.communes)} ont un budget 2026 exploitable. Explorez les écarts entre communes, puis analysez une commune face à des communes comparables et simulez des changements.`,
        `${S.fmt.n0(b.communes_budget)} van de ${S.fmt.n0(b.communes)} gemeenten hebben een bruikbare begroting 2026. Verken de verschillen tussen gemeenten, analyseer daarna een gemeente tegenover vergelijkbare gemeenten en simuleer wijzigingen.`);
    }
    if (S.state.tab === 'apercu' && S.renderApercu) S.renderApercu();
    if (S.state.tab === 'commune' && S.renderCommune) S.renderCommune();
    if (S.state.tab === 'gf' && S.renderGF) S.safe([S.renderGF]);
    if (S.state.tab === 'simulation' && S.renderSimulation) S.renderSimulation();
    if (S.renderCtx) S.renderCtx();
    S.langChanged = false;
  };

  dash.onData(() => S.render());
  const named = '';
  if (['apercu', 'gf', 'commune', 'simulation', 'methode'].includes(named)) S.showTab(named);
})();

;

// ---------- VUE D'ENSEMBLE ----------
(function () {
  const S = window.BC;
  const L = S.L;
  const fillSelect = (sel, val) => {
    if (sel.options.length && sel.dataset.lang === S.lang) { sel.value = val; return; }
    sel.replaceChildren();
    sel.dataset.lang = S.lang;
    d3.groups(Object.entries(S.IND), ([, m]) => m[4]).forEach(([g, items]) => {
      const og = document.createElement('optgroup'); og.label = S.GROUPS[g][S.lang === 'nl' ? 1 : 0];
      items.forEach(([k]) => og.appendChild(new Option(S.label(k), k)));
      sel.appendChild(og);
    });
    sel.value = val;
  };
  const fInd = document.getElementById('f-ind'), fX = document.getElementById('f-x'), fY = document.getElementById('f-y');
  const fReg = document.getElementById('f-region'), fSearch = document.getElementById('f-search');
  fInd.addEventListener('change', () => { S.state.ind = fInd.value; S.anim(); S.render(); });
  fX.addEventListener('change', () => { S.state.x = fX.value; S.render(); });
  fY.addEventListener('change', () => { S.state.y = fY.value; S.render(); });
  fReg.addEventListener('change', () => { S.state.region = fReg.value; S.render(); });
  fSearch.addEventListener('input', () => { S.state.search = fSearch.value; S.renderTable(); });
  document.querySelectorAll('#classement th button').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.sort;
    S.state.sort = { key: k, dir: S.state.sort.key === k ? -S.state.sort.dir : (k === 'commune' || k === 'region' ? 1 : -1) };
    S.renderTable();
  }));
  document.querySelector('#classement tbody').addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-key]');
    if (tr) S.select(tr.dataset.key, 'commune');
  });
  const inRegion = (r) => S.state.region === 'Belgique' || r.region === S.state.region;
  const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);

  S.renderApercu = () => {
    fillSelect(fInd, S.state.ind); fillSelect(fX, S.state.x); fillSelect(fY, S.state.y);
    fReg.value = S.state.region;
    const st = dash.data('stats_region');
    [['t-communes', 'communes', S.fmt.n0], ['t-budget', 'communes_budget', S.fmt.n0], ['t-pop', 'population', S.fmt.n0],
      ['t-dep', 'dep_expl_mediane_hab', S.fmt.eur], ['t-rec', 'rec_expl_mediane_hab', S.fmt.eur], ['t-total', 'dep_expl_total', S.fmt.eurc], ['t-deficit', 'communes_deficit', S.fmt.n0]].forEach(([id, f, fmt]) => {
      const el = document.getElementById(id);
      el.dataset.where = 'region=' + S.state.region;
      if (st.status === 'ok') {
        const row = st.data.find((r) => r.region === S.state.region);
        S.countUp(el, row[f], fmt);
        el.classList.remove('dash-skeleton');
        if (id === 't-deficit') {
          const dn = document.getElementById('t-deficit-note');
          dn.textContent = L(`sur ${S.fmt.n0(row.communes_solde)} budgets · solde cumulé ${S.fmt.signedEur(row.solde_expl_total)}`, `op ${S.fmt.n0(row.communes_solde)} begrotingen · totaal saldo ${S.fmt.signedEur(row.solde_expl_total)}`);
          el.style.color = row.communes_deficit > 0 ? 'var(--color-bad)' : '';
        }
        if (id === 't-budget') document.getElementById('t-budget-note').textContent = L(`${S.fmt.n0(100 * row.population_budget / row.population)} % de la population`, `${S.fmt.n0(100 * row.population_budget / row.population)} % van de bevolking`);
      } else if (st.status === 'error') { el.textContent = '—'; el.classList.remove('dash-skeleton'); }
    });
    const lab = lower(S.label(S.state.ind));
    document.getElementById('carte-titre').textContent = L('Carte : ', 'Kaart: ') + lab;
    document.getElementById('distrib-titre').textContent = L('Distribution par région : ', 'Spreiding per gewest: ') + lab;
    document.getElementById('classement-titre').textContent = L('Classement : ', 'Rangschikking: ') + lab;
    const th = document.getElementById('classement-th');
    th.dataset.field = S.state.ind;
    th.querySelector('button').textContent = S.label(S.state.ind);
    S.safe([S.renderMap, S.renderDistribution, S.renderScatter, S.renderNatures, S.renderFonctions, S.renderTable]);
  };

  S.renderMap = () => {
    const box = document.getElementById('carte');
    const cg = dash.data('carte'), cc = dash.data('communes');
    if (cg.status === 'error' || cc.status === 'error') return S.failed(box);
    if (cg.status !== 'ok' || cc.status !== 'ok') return;
    // each feature holds its polygons, each polygon its outer ring
    if (!S.geo) S.geo = cg.data.map((g) => ({ nis: String(g.nis), rings: (typeof g.rings === 'string' ? JSON.parse(g.rings) : g.rings).map((poly) => poly[0]).filter((ring) => ring && ring.length > 2) }));
    const W = box.clientWidth || 600;
    const geo = S.geo.filter((g) => { const r = S.byNis.get(g.nis); return r && inRegion(r); });
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    geo.forEach((g) => g.rings.forEach((ring) => ring.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); })));
    const k = Math.cos((50.5 * Math.PI) / 180);
    const sc = Math.min(W / ((x1 - x0) * k), 520 / (y1 - y0));
    const H = Math.round((y1 - y0) * sc) + 4;
    const px = (x) => (x - x0) * k * sc + (W - (x1 - x0) * k * sc) / 2, py = (y) => (y1 - y) * sc + 2;
    // the theme colors can be oklch or color(): shade with opacity instead of mixing RGB values
    const op = (t) => 0.1 + 0.9 * t;
    const key = S.state.ind;
    box.replaceChildren();
    const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).style('touch-action', 'none').style('cursor', 'grab');
    const tip = S.tip(box);
    const layer = svg.append('g');
    const paths = layer.selectAll('path').data(geo).join('path')
      .attr('d', (g) => g.rings.map((ring) => 'M' + ring.map(([x, y]) => px(x).toFixed(1) + ',' + py(y).toFixed(1)).join('L') + 'Z').join(''))
      .attr('fill', (g) => (S.pct(S.rows, key, S.byNis.get(g.nis)) == null ? 'var(--color-bg)' : dash.colors[0]))
      .attr('fill-opacity', (g) => { const p = S.pct(S.rows, key, S.byNis.get(g.nis)); return p == null ? 1 : op(p / 100); })
      .attr('stroke', (g) => (g.nis === S.state.nis ? 'var(--color-fg)' : 'var(--color-panel)'))
      .attr('stroke-width', (g) => (g.nis === S.state.nis ? 2 : 0.4))
      .attr('vector-effect', 'non-scaling-stroke')
      .style('cursor', 'pointer')
      .on('mouseenter', function () { d3.select(this).raise().attr('stroke', 'var(--color-fg)').attr('stroke-width', 1.5); })
      .on('mousemove', (ev, g) => { const r = S.byNis.get(g.nis); const p = S.pct(S.rows, key, r); tip.show(ev, [S.name(r), S.reg(r.region), S.label(key) + ' : ' + S.fmtInd(key, r[key]), p == null ? L('Pas de donnée', 'Geen gegevens') : L('Rang régional : ', 'Gewestelijke rang: ') + S.fmt.n0(p) + ' / 100']); })
      .on('mouseleave', function (ev, g) { tip.hide(); d3.select(this).attr('stroke', g.nis === S.state.nis ? 'var(--color-fg)' : 'var(--color-panel)').attr('stroke-width', g.nis === S.state.nis ? 2 : 0.4); layer.selectAll('path').filter((d) => d.nis === S.state.nis).raise(); })
      .on('click', (ev, g) => S.select(g.nis, 'commune'));
    paths.filter((g) => g.nis === S.state.nis).raise();
    // zoom: buttons, Ctrl + wheel, pinch, drag; the view is kept across redraws of the same region
    const zKey = S.state.region + '|' + W;
    const zoom = d3.zoom().scaleExtent([1, 20]).translateExtent([[0, 0], [W, H]])
      .filter((ev) => (ev.type === 'wheel' ? ev.ctrlKey || ev.metaKey : !ev.button))
      .on('start', () => svg.style('cursor', 'grabbing'))
      .on('end', () => svg.style('cursor', 'grab'))
      .on('zoom', (ev) => { layer.attr('transform', ev.transform); S.mapZoom = { key: zKey, t: ev.transform }; });
    svg.call(zoom).on('dblclick.zoom', null);
    if (S.mapZoom && S.mapZoom.key === zKey) svg.call(zoom.transform, S.mapZoom.t);
    const dur = S.reduced() ? 0 : 350;
    S.mapZoomApi = {
      in: () => svg.transition().duration(dur).call(zoom.scaleBy, 1.7),
      out: () => svg.transition().duration(dur).call(zoom.scaleBy, 1 / 1.7),
      reset: () => svg.transition().duration(dur).call(zoom.transform, d3.zoomIdentity),
      focus: () => {
        const g = geo.find((d) => d.nis === S.state.nis); if (!g) { S.toast(L('La commune choisie n\'est pas dans la région affichée.', 'De gekozen gemeente ligt niet in het getoonde gewest.')); return; }
        let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
        g.rings.forEach((ring) => ring.forEach(([x, y]) => { a = Math.min(a, px(x)); b = Math.max(b, px(x)); c = Math.min(c, py(y)); d = Math.max(d, py(y)); }));
        const kk = Math.max(1, Math.min(14, 0.35 / Math.max((b - a) / W, (d - c) / H)));
        svg.transition().duration(S.reduced() ? 0 : 600).call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(kk).translate(-(a + b) / 2, -(c + d) / 2));
      },
    };
    const lg = document.getElementById('carte-legende');
    lg.replaceChildren();
    [[L('Rang bas', 'Lage rang'), 0.05], [L('Médian', 'Mediaan'), 0.5], [L('Rang haut', 'Hoge rang'), 0.95]].forEach(([t, v]) => { const s = document.createElement('span'); const sw = document.createElement('span'); sw.className = 'bc-sw'; sw.style.background = dash.colors[0]; sw.style.opacity = String(op(v)); s.append(sw, t); lg.appendChild(s); });
    const s = document.createElement('span'); const sw = document.createElement('span'); sw.className = 'bc-sw'; sw.style.background = 'var(--color-bg)'; sw.style.border = '1px solid var(--color-border-line)'; s.append(sw, L('Pas de donnée', 'Geen gegevens')); lg.appendChild(s);
  };
  document.getElementById('map-zoom').addEventListener('click', (e) => { const b = e.target.closest('[data-z]'); if (b && S.mapZoomApi) S.mapZoomApi[b.dataset.z](); });
  document.getElementById('sc-zoom').addEventListener('click', (e) => { const b = e.target.closest('[data-z]'); if (b && S.scZoomApi) S.scZoomApi[b.dataset.z](); });

  S.renderDistribution = () => {
    const box = document.getElementById('distribution');
    const cc = dash.data('communes');
    if (cc.status === 'error') return S.failed(box);
    if (cc.status !== 'ok') return;
    const key = S.state.ind;
    const regs = S.REGIONS.filter((g) => S.state.region === 'Belgique' || g === S.state.region);
    const rows = S.rows.filter((r) => inRegion(r) && r[key] != null);
    if (!rows.length) return S.empty(box, L('Pas de données pour cet indicateur.', 'Geen gegevens voor deze indicator.'));
    box.replaceChildren();
    const W = box.clientWidth || 500, band = 70, m = { l: 80, r: 16, t: 8, b: 28 };
    const H = m.t + m.b + band * regs.length;
    const vals = rows.map((r) => r[key]);
    const log = S.useLog(vals);
    const x = (log ? d3.scaleLog() : d3.scaleLinear()).domain(d3.extent(vals)).nice().range([m.l, W - m.r]);
    const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`);
    svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(Math.max(3, Math.floor(W / 110)), '~s')).call(S.axisClean);
    const tip = S.tip(box);
    regs.forEach((g, i) => {
      const y0 = m.t + i * band;
      svg.append('text').attr('x', 0).attr('y', y0 + band / 2).attr('dy', '0.35em').attr('fill', 'var(--color-fg)').style('font-size', 'var(--cds-font-size-caption)').text(S.reg(g));
      const rs = rows.filter((r) => r.region === g);
      let seed = (i + 1) * 9301;
      const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      svg.append('g').selectAll('circle').data(rs).join('circle')
        .attr('cx', (r) => x(r[key])).attr('cy', () => y0 + 10 + rnd() * (band - 20))
        .attr('r', (r) => (r.nis === S.state.nis ? 6 : 2.6))
        .attr('fill', (r) => (r.nis === S.state.nis ? 'var(--color-fg)' : S.colorOf(g)))
        .attr('fill-opacity', (r) => (r.nis === S.state.nis ? 1 : 0.55))
        .style('cursor', 'pointer')
        .on('mousemove', (ev, r) => tip.show(ev, [S.name(r), S.label(key), S.fmtInd(key, r[key])]))
        .on('mouseleave', () => tip.hide())
        .on('click', (ev, r) => S.select(r.nis, 'commune'));
      const med = d3.median(rs, (r) => r[key]);
      if (med != null) {
        svg.append('line').attr('x1', x(med)).attr('x2', x(med)).attr('y1', y0 + 4).attr('y2', y0 + band - 4).attr('stroke', 'var(--color-fg)').attr('stroke-width', 2);
        svg.append('text').attr('x', x(med) + 4).attr('y', y0 + 10).attr('fill', 'var(--color-fg-muted)').style('font-size', 'var(--cds-font-size-caption)').text(L('médiane ', 'mediaan ') + S.fmtInd(key, med));
      }
    });
    svg.selectAll('circle').filter((r) => r.nis === S.state.nis).raise();
  };

  S.renderScatter = () => {
    const box = document.getElementById('nuage');
    const cc = dash.data('communes');
    if (cc.status === 'error') return S.failed(box);
    if (cc.status !== 'ok') return;
    const kx = S.state.x, ky = S.state.y;
    const rows = S.rows.filter((r) => inRegion(r) && r[kx] != null && r[ky] != null);
    if (!rows.length) return S.empty(box, L('Pas de données pour ce croisement.', 'Geen gegevens voor deze combinatie.'));
    box.replaceChildren();
    const W = box.clientWidth || 700, H = 400, m = { l: 64, r: 16, t: 22, b: 40 };
    const lx = S.useLog(rows.map((r) => r[kx])), ly = S.useLog(rows.map((r) => r[ky]));
    const x = (lx ? d3.scaleLog() : d3.scaleLinear()).domain(d3.extent(rows, (r) => r[kx])).nice().range([m.l, W - m.r]);
    const y = (ly ? d3.scaleLog() : d3.scaleLinear()).domain(d3.extent(rows, (r) => r[ky])).nice().range([H - m.b, m.t]);
    const rad = d3.scaleSqrt().domain([0, d3.max(rows, (r) => r.population)]).range([1.5, 18]);
    const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).style('touch-action', 'none');
    const clipId = 'bc-sc-clip';
    svg.append('clipPath').attr('id', clipId).append('rect').attr('x', m.l).attr('y', m.t).attr('width', W - m.l - m.r).attr('height', H - m.t - m.b);
    const grid = svg.append('g');
    const gx = svg.append('g').attr('transform', `translate(0,${H - m.b})`);
    const gy = svg.append('g').attr('transform', `translate(${m.l},0)`);
    const logTxt = L(' (échelle log)', ' (logschaal)');
    svg.append('text').attr('x', W - m.r).attr('y', H - 6).attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').style('font-size', 'var(--cds-font-size-caption)').text(S.label(kx) + (lx ? logTxt : ''));
    svg.append('text').attr('x', m.l + 4).attr('y', m.t - 8).attr('fill', 'var(--color-fg-muted)').style('font-size', 'var(--cds-font-size-caption)').text(S.label(ky) + (ly ? logTxt : ''));
    const tip = S.tip(box);
    const plot = svg.append('g').attr('clip-path', `url(#${clipId})`);
    const dots = plot.selectAll('circle').data(rows.slice().sort((a, b) => b.population - a.population)).join('circle')
      .attr('r', (r) => rad(r.population))
      .attr('fill', (r) => (r.nis === S.state.nis ? 'var(--color-fg)' : S.colorOf(r.region))).attr('fill-opacity', (r) => (r.nis === S.state.nis ? 1 : 0.5))
      .attr('stroke', 'var(--color-panel)').attr('stroke-width', 0.5).style('cursor', 'pointer')
      .on('mouseenter', function () { d3.select(this).raise().attr('stroke', 'var(--color-fg)').attr('stroke-width', 1.5); })
      .on('mousemove', (ev, r) => tip.show(ev, [S.name(r), S.reg(r.region) + ' · ' + S.fmtInd('population', r.population), S.label(kx) + ' : ' + S.fmtInd(kx, r[kx]), S.label(ky) + ' : ' + S.fmtInd(ky, r[ky])]))
      .on('mouseleave', function () { tip.hide(); d3.select(this).attr('stroke', 'var(--color-panel)').attr('stroke-width', 0.5); })
      .on('click', (ev, r) => S.select(r.nis, 'commune'));
    dots.filter((r) => r.nis === S.state.nis).raise();
    const draw = (nx, ny) => {
      grid.selectAll('line').data(ny.ticks(6)).join('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', (d) => ny(d)).attr('y2', (d) => ny(d)).attr('stroke', 'var(--cds-chart-grid)');
      gx.call(d3.axisBottom(nx).ticks(Math.max(3, Math.floor(W / 120)), '~s')).call(S.axisClean);
      gy.call(d3.axisLeft(ny).ticks(6, '~s')).call(S.axisClean);
      dots.attr('cx', (r) => nx(r[kx])).attr('cy', (r) => ny(r[ky]));
    };
    draw(x, y);
    // zoom rescales the axes; the view is kept while the same variables are shown
    const zKey = [kx, ky, S.state.region, W].join('|');
    const zoom = d3.zoom().scaleExtent([1, 40]).extent([[m.l, m.t], [W - m.r, H - m.b]]).translateExtent([[m.l, m.t], [W - m.r, H - m.b]])
      .filter((ev) => (ev.type === 'wheel' ? ev.ctrlKey || ev.metaKey : !ev.button))
      .on('zoom', (ev) => { draw(ev.transform.rescaleX(x), ev.transform.rescaleY(y)); S.scZoom = { key: zKey, t: ev.transform }; });
    svg.call(zoom).on('dblclick.zoom', null);
    if (S.scZoom && S.scZoom.key === zKey) svg.call(zoom.transform, S.scZoom.t);
    const dur = S.reduced() ? 0 : 350;
    S.scZoomApi = {
      in: () => svg.transition().duration(dur).call(zoom.scaleBy, 1.7),
      out: () => svg.transition().duration(dur).call(zoom.scaleBy, 1 / 1.7),
      reset: () => svg.transition().duration(dur).call(zoom.transform, d3.zoomIdentity),
    };
    const lg = document.getElementById('nuage-legende'); lg.replaceChildren();
    S.REGIONS.filter((g) => S.state.region === 'Belgique' || g === S.state.region).forEach((g) => { const s = document.createElement('span'); const sw = document.createElement('span'); sw.className = 'bc-sw'; sw.style.background = S.colorOf(g); s.append(sw, S.reg(g)); lg.appendChild(s); });
  };

  const stacked = (box, legend, data, catKey, valKey, order, catLabel) => {
    box.replaceChildren(); legend.replaceChildren();
    const regs = S.REGIONS.filter((g) => S.state.region === 'Belgique' || g === S.state.region);
    const groups = [];
    regs.forEach((g) => order.groups.forEach((grp) => groups.push({ region: g, grp })));
    const W = box.clientWidth || 500, m = { l: 150, r: 60, t: 4, b: 24 }, bh = 22, gap = 8;
    const H = m.t + m.b + groups.length * (bh + gap) + regs.length * 10;
    const totals = groups.map((gr) => d3.sum(data.filter((d) => d.region === gr.region && (order.grpOf ? order.grpOf(d) === gr.grp : true)), (d) => Math.max(0, d[valKey])));
    const x = d3.scaleLinear().domain([0, d3.max(totals) || 1]).nice().range([m.l, W - m.r]);
    const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`);
    svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(Math.max(3, Math.floor(W / 120))).tickFormat((v) => S.fmt.n0(v) + ' €')).call(S.axisClean);
    const tip = S.tip(box);
    let yy = m.t;
    groups.forEach((gr, i) => {
      if (i > 0 && gr.region !== groups[i - 1].region) yy += 10;
      svg.append('text').attr('x', m.l - 8).attr('y', yy + bh / 2).attr('dy', '0.35em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').style('font-size', 'var(--cds-font-size-caption)').text(S.reg(gr.region) + (order.groups.length > 1 ? ' · ' + S.poste(gr.grp) : ''));
      let acc = 0;
      order.cats.forEach((cat, ci) => {
        const d = data.find((r) => r.region === gr.region && r[catKey] === cat && (order.grpOf ? order.grpOf(r) === gr.grp : true));
        if (!d || !(d[valKey] > 0)) return;
        svg.append('rect').attr('x', x(acc)).attr('y', yy).attr('width', Math.max(0, x(acc + d[valKey]) - x(acc) - 1)).attr('height', bh).attr('rx', 3)
          .attr('fill', dash.colors[ci % dash.colors.length])
          .on('mousemove', (ev) => tip.show(ev, [catLabel(cat), S.reg(gr.region), S.fmt.eur(d[valKey]) + L(' par habitant', ' per inwoner')]))
          .on('mouseleave', () => tip.hide());
        acc += d[valKey];
      });
      svg.append('text').attr('x', x(acc) + 4).attr('y', yy + bh / 2).attr('dy', '0.35em').attr('fill', 'var(--color-fg-muted)').style('font-size', 'var(--cds-font-size-caption)').text(S.fmt.eur(acc));
      yy += bh + gap;
    });
    order.cats.forEach((cat, ci) => { const s = document.createElement('span'); const sw = document.createElement('span'); sw.className = 'bc-sw'; sw.style.background = dash.colors[ci % dash.colors.length]; s.append(sw, catLabel(cat)); legend.appendChild(s); });
  };

  S.renderNatures = () => {
    const box = document.getElementById('natures'), d = dash.data('natures_region');
    if (d.status === 'error') return S.failed(box);
    if (d.status !== 'ok') return;
    const data = d.data.map((r) => ({ ...r, cat: r.sens + '|' + r.poste }));
    const cats = ['Dépenses|Personnel', 'Dépenses|Fonctionnement', 'Dépenses|Transferts', 'Dépenses|Dette', 'Dépenses|Autres', 'Recettes|Fiscalité', 'Recettes|Dotations et subsides', 'Recettes|Prestations', 'Recettes|Autres'];
    const catLabel = (c) => { const [s, p] = c.split('|'); return S.poste(s) + ' : ' + S.poste(p); };
    stacked(box, document.getElementById('natures-legende'), data, 'cat', 'moyenne_hab', { groups: ['Dépenses', 'Recettes'], grpOf: (r) => r.sens, cats }, catLabel);
  };

  S.renderFonctions = () => {
    const box = document.getElementById('fonctions'), d = dash.data('fonctions_region');
    if (d.status === 'error') return S.failed(box);
    if (d.status !== 'ok') return;
    const cats = [...new Set(d.data.map((r) => r.fonction))].sort((a, b) => parseInt(a) - parseInt(b));
    stacked(box, document.getElementById('fonctions-legende'), d.data, 'fonction', 'moyenne_hab', { groups: ['Dépenses'], cats }, S.fonction);
  };

  S.renderTable = () => {
    const tb = document.querySelector('#classement tbody');
    if (dash.data('communes').status !== 'ok') return;
    const key = S.state.ind, q = S.state.search.trim().toLowerCase();
    const rows = S.rows.filter((r) => inRegion(r) && (!q || r.commune.toLowerCase().includes(q) || (r.commune_nl || '').toLowerCase().includes(q)));
    const sk = S.state.sort.key === 'ind' ? key : S.state.sort.key, dir = S.state.sort.dir;
    const val = (r) => (sk === 'commune' ? S.name(r) : r[sk]);
    rows.sort((a, b) => {
      const va = val(a), vb = val(b);
      if (va == null && vb == null) return 0; if (va == null) return 1; if (vb == null) return -1;
      return (typeof va === 'string' ? va.localeCompare(vb, S.lang) : va - vb) * dir;
    });
    document.querySelectorAll('#classement th').forEach((th) => { const b = th.querySelector('button'); th.removeAttribute('aria-sort'); if (b && b.dataset.sort === S.state.sort.key) th.setAttribute('aria-sort', dir > 0 ? 'ascending' : 'descending'); });
    tb.replaceChildren(...rows.map((r) => {
      const tr = document.createElement('tr'); tr.dataset.key = r.nis;
      if (r.nis === S.state.nis) tr.className = 'sel';
      const td = (t, cls) => { const e = document.createElement('td'); e.textContent = t; if (cls) e.className = cls; return e; };
      tr.append(td(S.name(r)), td(S.reg(r.region), 'hide-n'), td(S.fmt.n0(r.population), 'num'), td(S.fmtInd(key, r[key]), 'num'), td(S.statut(r.budget_statut), 'hide-n'));
      return tr;
    }));
  };
})();

;

// ---------- ANALYSE D'UNE COMMUNE ----------
(function () {
  const S = window.BC;
  const L = S.L;
  const inp = document.getElementById('c-input'), list = document.getElementById('c-list');
  const optLabel = (r) => S.name(r) + ' (' + S.reg(r.region) + ')';
  inp.addEventListener('change', () => {
    const v = inp.value.trim().toLowerCase();
    const r = S.rows.find((x) => optLabel(x).toLowerCase() === v) || S.rows.find((x) => x.commune.toLowerCase() === v || (x.commune_nl || '').toLowerCase() === v);
    if (r) S.select(r.nis);
  });
  document.getElementById('c-k').addEventListener('change', (e) => { S.state.k = Number(e.target.value); S.render(); });
  document.querySelector('#c-pairs tbody').addEventListener('click', (e) => { const tr = e.target.closest('tr[data-key]'); if (tr) S.select(tr.dataset.key); });

  // budget item -> structural indicators that may explain it
  S.EXPLAIN = {
    dep_personnel_hab: ['part_3_11_pct', 'part_0_2_pct', 'n_piscine', 'n_hall_sportif_par_10000_hab', 'population', 'sections_villages', 'n_theatre_centre_culturel', 'n_bibliotheque', 'ecoles_par_1000_enfants'],
    dep_fonctionnement_hab: ['densite_hab_km2', 'km_voirie_locale_par_1000_hab', 'km_chemins_par_1000_hab', 'sections_villages', 'n_piscine', 'n_patinoire', 'batiments_avant_1946_pct', 'hebergements_par_1000_hab', 'horeca_par_1000_hab'],
    dep_transferts_hab: ['taux_risque_pauvrete_pct', 'revenu_imposable_par_habitant', 'part_65p_pct', 'part_80p_pct', 'population', 'rc_economique_pct'],
    police_hab: ['population', 'densite_hab_km2', 'horeca_par_1000_hab', 'rc_bureaux_commerces_pct', 'n_gare', 'hebergements_par_1000_hab'],
    secours_hab: ['rc_industrie_stockage_pct', 'population', 'hebergements_par_1000_hab'],
    cpas_hab: ['taux_risque_pauvrete_pct', 'revenu_imposable_par_habitant', 'part_80p_pct'],
    dep_dette_hab: ['croissance_pop_2015_2025_pct', 'batiments_avant_1946_pct'],
    rec_fiscalite_hab: ['revenu_imposable_par_habitant', 'revenu_cadastral_par_habitant', 'taux_implicite_additionnel_ipp_pct', 'rc_economique_pct'],
    ipp_hab: ['revenu_imposable_par_habitant', 'taux_implicite_additionnel_ipp_pct', 'part_65p_pct'],
    pri_hab: ['revenu_cadastral_par_habitant', 'revenu_cadastral_exonere_pct', 'rc_economique_pct'],
    taxes_locales_hab: ['entreprises_par_1000_hab', 'rc_economique_pct', 'hebergements_par_1000_hab', 'horeca_par_1000_hab'],
    rec_dotations_hab: ['revenu_imposable_par_habitant', 'population', 'taux_risque_pauvrete_pct'],
    fonds_hab: ['revenu_imposable_par_habitant', 'population', 'densite_hab_km2'],
    rec_prestations_hab: ['n_piscine', 'sol_bois_pct', 'hebergements_par_1000_hab'],
  };
  // [key, [fr, nl], sub-item]
  S.DEP = [['dep_expl_hab', ['Total exploitation', 'Totaal exploitatie']], ['dep_personnel_hab', ['Personnel', 'Personeel']], ['dep_fonctionnement_hab', ['Fonctionnement', 'Werking']], ['dep_transferts_hab', ['Transferts', 'Overdrachten']],
    ['police_hab', ['dont zone de police', 'waarvan politiezone'], 1], ['secours_hab', ['dont zone de secours', 'waarvan hulpverleningszone'], 1], ['cpas_hab', ['dont CPAS', 'waarvan OCMW'], 1], ['dep_dette_hab', ['Dette', 'Schuld']], ['dep_inv_hab', ['Investissements', 'Investeringen']]];
  S.REC = [['rec_expl_hab', ['Total exploitation', 'Totaal exploitatie']], ['rec_fiscalite_hab', ['Fiscalité', 'Fiscaliteit']], ['ipp_hab', ['dont additionnels IPP', 'waarvan aanvullende personenbelasting'], 1], ['pri_hab', ['dont additionnels précompte', 'waarvan opcentiemen OV'], 1],
    ['taxes_locales_hab', ['dont taxes locales', 'waarvan lokale belastingen'], 1], ['rec_dotations_hab', ['Dotations et subsides', 'Dotaties en subsidies']], ['fonds_hab', ['dont fonds des communes', 'waarvan gemeentefonds'], 1], ['rec_prestations_hab', ['Prestations', 'Prestaties']]];

  // dot-and-range chart: commune vs peers' quartiles, optional simulated value
  S.rangeChart = (box, items, opts) => {
    const it = items.filter((d) => d.v != null || d.med != null);
    if (!it.length) return S.empty(box, opts.empty);
    box.replaceChildren();
    const W = box.clientWidth || 500, rh = 30, m = { l: Math.min(210, W * 0.4), r: 70, t: 4, b: 24 };
    const H = m.t + m.b + it.length * rh;
    const mx = d3.max(it, (d) => Math.max(d.v || 0, d.p75 || 0, d.sim || 0)) || 1;
    const x = d3.scaleLinear().domain([0, mx]).nice().range([m.l, W - m.r]);
    const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`);
    svg.append('g').selectAll('line').data(x.ticks(5)).join('line').attr('x1', (d) => x(d)).attr('x2', (d) => x(d)).attr('y1', m.t).attr('y2', H - m.b).attr('stroke', 'var(--cds-chart-grid)');
    svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(Math.max(3, Math.floor(W / 110))).tickFormat((v) => S.fmt.n0(v) + ' €')).call(S.axisClean);
    const tip = S.tip(box);
    it.forEach((d, i) => {
      const y = m.t + i * rh + rh / 2;
      const showSim = d.sim != null && Math.abs(d.sim - (d.v || 0)) > 0.5;
      svg.append('text').attr('x', m.l - 8).attr('y', y).attr('dy', '0.35em').attr('text-anchor', 'end').attr('fill', d.sub ? 'var(--color-fg-muted)' : 'var(--color-fg)').style('font-size', 'var(--cds-font-size-caption)').text(d.lab);
      if (d.p25 != null && d.p75 != null) svg.append('rect').attr('x', x(d.p25)).attr('y', y - 6).attr('width', Math.max(2, x(d.p75) - x(d.p25))).attr('height', 12).attr('rx', 4).attr('fill', 'var(--cds-chart-muted)').attr('fill-opacity', 0.45);
      if (d.med != null) svg.append('line').attr('x1', x(d.med)).attr('x2', x(d.med)).attr('y1', y - 8).attr('y2', y + 8).attr('stroke', 'var(--color-fg-muted)').attr('stroke-width', 2);
      let col = 'var(--color-fg)';
      if (d.v != null && d.p75 != null && d.p25 != null) {
        const high = d.v > d.p75, low = d.v < d.p25;
        if (opts.sens === 'dep') col = high ? 'var(--cds-chart-status-critical)' : low ? 'var(--color-ok)' : 'var(--color-fg)';
        else col = low ? 'var(--cds-chart-status-critical)' : high ? 'var(--color-ok)' : 'var(--color-fg)';
      }
      if (d.v != null) svg.append('circle').attr('cx', x(d.v)).attr('cy', y).attr('r', 5.5).attr('fill', col);
      if (showSim) svg.append('path').attr('d', 'M0,-7L6,0L0,7L-6,0Z').attr('transform', `translate(${x(d.sim)},${y})`).attr('fill', 'none').attr('stroke', 'var(--color-fg)').attr('stroke-width', 1.5);
      svg.append('text').attr('x', W - m.r + 6).attr('y', y).attr('dy', '0.35em').attr('fill', 'var(--color-fg-muted)').style('font-size', 'var(--cds-font-size-caption)').text(S.fmt.eur(showSim ? d.sim : d.v));
      svg.append('rect').attr('x', 0).attr('y', y - rh / 2).attr('width', W).attr('height', rh).attr('fill', 'transparent')
        .on('mousemove', (ev) => tip.show(ev, [d.lab,
          L('Médiane des comparables : ', 'Mediaan vergelijkbare gemeenten: ') + S.fmt.eur(d.med) + ' (25-75 % : ' + S.fmt.n0(d.p25) + ' – ' + S.fmt.eur(d.p75) + ')',
          L('Commune : ', 'Gemeente: ') + S.fmt.eur(d.v), ...(showSim ? [L('Simulation : ', 'Simulatie: ') + S.fmt.eur(d.sim)] : [])]))
        .on('mouseleave', () => tip.hide());
    });
  };

  S.compare = (c, peers, defs, sim) => defs.map(([k, lab, sub]) => {
    const vals = peers.map((p) => p[k]).filter((v) => v != null).sort((a, b) => a - b);
    const q = (p) => (vals.length ? d3.quantileSorted(vals, p) : null);
    return { k, lab: Array.isArray(lab) ? lab[S.lang === 'nl' ? 1 : 0] : lab, sub: !!sub, v: c[k], med: q(0.5), p25: q(0.25), p75: q(0.75), n: vals.length, sim: sim ? sim.perHab[k] : null };
  });

  const nlOr = (s, k) => (S.lang === 'nl' && s[k + '_nl'] ? s[k + '_nl'] : s[k]);
  const specItem = (s) => {
    const d = document.createElement('div'); d.className = 'bc-spec-item';
    const n = document.createElement('div'); n.className = 'bc-spec-name'; n.textContent = nlOr(s, 'specificite');
    const meta = document.createElement('div'); meta.className = 'bc-spec-meta';
    const ind = s.indicateur;
    const hasMed = s.mediane_region != null && s.mediane_region !== '';
    meta.textContent = (S.IND[ind] ? S.label(ind) + ' : ' : '') + S.fmtInd(ind, Number(s.valeur)) + (hasMed ? L(' · médiane régionale ', ' · gewestelijke mediaan ') + S.fmtInd(ind, Number(s.mediane_region)) : '');
    d.append(n, meta);
    if (s.percentile != null && s.percentile !== '') {
      const bar = document.createElement('div'); bar.className = 'bc-pbar'; const dot = document.createElement('i');
      dot.style.left = Number(s.percentile) + '%'; dot.style.background = 'var(--color-fg)'; bar.appendChild(dot); d.appendChild(bar);
      const pm = document.createElement('div'); pm.className = 'bc-spec-meta'; pm.textContent = L('Rang régional : ', 'Gewestelijke rang: ') + S.fmt.n0(Number(s.percentile)) + ' / 100'; d.appendChild(pm);
    }
    const t = document.createElement('div'); t.className = 'bc-spec-txt'; t.textContent = nlOr(s, 'explication'); d.appendChild(t);
    return d;
  };

  S.renderCommune = () => {
    const cc = dash.data('communes');
    if (cc.status !== 'ok') return;
    if (!list.options.length || list.dataset.lang !== S.lang) {
      list.dataset.lang = S.lang;
      list.replaceChildren(...S.rows.slice().sort((a, b) => S.name(a).localeCompare(S.name(b), S.lang)).map((r) => new Option(optLabel(r))));
    }
    const c = S.byNis.get(S.state.nis) || S.rows[0];
    if (document.activeElement !== inp) inp.value = optLabel(c);
    const where = 'nis=' + c.nis;
    const badges = document.getElementById('c-badges'); badges.replaceChildren();
    const pill = (t, cls) => { const s = document.createElement('span'); s.className = 'bc-pill ' + (cls || ''); s.textContent = t; badges.appendChild(s); };
    pill(S.reg(c.region)); pill(S.prov(c) || '');
    pill(c.budget_statut === 'fiable' ? (c.budget_ventile ? L('Budget détaillé', 'Gedetailleerde begroting') : L('Budget en totaux', 'Begroting in totalen')) : c.budget_statut === 'faible' ? L('Budget peu fiable', 'Weinig betrouwbare begroting') : L('Budget 2026 non trouvé', 'Begroting 2026 niet gevonden'), c.budget_statut === 'fiable' ? 'ok' : c.budget_statut === 'faible' ? 'warn' : 'bad');
    if (S.simActive() && S.sim.nis === c.nis) pill(L('Simulation en cours', 'Simulatie actief'), 'warn');
    document.getElementById('c-source').textContent = c.budget_source
      ? L('Source du budget : ', 'Bron van de begroting: ') + c.budget_source + (c.budget_fiabilite ? L(' · fiabilité ', ' · betrouwbaarheid ') + c.budget_fiabilite : '')
      : L('Aucun budget 2026 exploitable : seules les spécificités structurelles sont affichées.', 'Geen bruikbare begroting 2026: enkel de structurele kenmerken worden getoond.');

    const peers = S.peers(S.rows, c);
    const sim = S.simActive() && S.sim.nis === c.nis ? S.simulate(c) : null;
    const med = (k) => S.median(peers.map((p) => p[k]).filter((v) => v != null));
    [['c-pop', 'population', S.fmt.n0], ['c-dep', 'dep_expl_hab', S.fmt.eur], ['c-rec', 'rec_expl_hab', S.fmt.eur], ['c-inv', 'dep_inv_hab', S.fmt.eur]].forEach(([id, k, f]) => {
      const el = document.getElementById(id); el.dataset.where = where; el.textContent = f(c[k]);
    });
    document.getElementById('c-pop-note').textContent = S.fmt.n1(c.superficie_km2) + ' km² · ' + S.fmtInd('densite_hab_km2', c.densite_hab_km2);
    const note = (k) => {
      const m = med(k);
      if (c[k] == null || m == null) return L('pas de comparaison possible', 'geen vergelijking mogelijk');
      const d = c[k] - m;
      return L('comparables : ', 'vergelijkbaar: ') + S.fmt.eur(m) + ' (' + (d >= 0 ? '+' : '−') + S.fmt.n0(Math.abs(100 * d / m)) + ' %)' + (sim && sim.perHab[k] != null ? L(' · simulé ', ' · gesimuleerd ') + S.fmt.eur(sim.perHab[k]) : '');
    };
    document.getElementById('c-dep-note').textContent = note('dep_expl_hab');
    document.getElementById('c-rec-note').textContent = note('rec_expl_hab');
    document.getElementById('c-inv-note').textContent = note('dep_inv_hab');
    const xl = document.getElementById('c-extra-label'), xv = document.getElementById('c-extra'), xn = document.getElementById('c-extra-note');
    xv.style.color = ''; xv.dataset.where = where;
    if (c.region === 'Flandre' && c.afm_2031_apres != null) {
      xl.textContent = L('AFM 2031 après réduction du Gemeentefonds', 'AFM 2031 na inkrimping Gemeentefonds');
      xv.dataset.field = 'afm_2031_apres';
      xv.textContent = S.fmt.signedEur(c.afm_2031_apres);
      xv.style.color = c.afm_2031_apres < 0 ? 'var(--color-bad)' : 'var(--color-ok)';
      xn.textContent = L('avant : ', 'vóór: ') + S.fmt.signedEur(c.afm_2031) + L(' · écart Gemeentefonds 2027-2031 : ', ' · verschil Gemeentefonds 2027-2031: ') + S.fmt.signedEur(c.gf_ecart_plan_2027_2031);
    } else {
      xl.textContent = L('Ratio de charges financières', 'Financiële lastenratio');
      xv.dataset.field = 'ratio_charges_financieres_pct';
      if (c.ratio_charges_financieres_pct != null) {
        xv.textContent = S.fmtInd('ratio_charges_financieres_pct', c.ratio_charges_financieres_pct);
        xv.style.color = c.ratio_charges_financieres_pct > 17.5 ? 'var(--color-bad)' : c.ratio_charges_financieres_pct > 15.5 ? 'var(--color-warn)' : '';
        xn.textContent = L('charges de la dette / recettes ordinaires · seuil 17,5 % (15,5 % sous plan CRAC)', 'schuldlasten / gewone ontvangsten · drempel 17,5 % (15,5 % onder CRAC-plan)');
      } else { xv.textContent = '—'; xn.textContent = L('non disponible pour ce budget', 'niet beschikbaar voor deze begroting'); }
    }
    const cs = document.getElementById('c-solde'), csn = document.getElementById('c-solde-note');
    cs.dataset.where = where;
    if (c.solde_expl_total != null) {
      cs.textContent = S.fmt.signedEur(c.solde_expl_total);
      cs.style.color = c.solde_expl_total < 0 ? 'var(--color-bad)' : 'var(--color-ok)';
      const ms = med('solde_expl_pct');
      csn.textContent = (c.solde_expl_total < 0 ? L('déficit', 'tekort') : L('boni', 'overschot')) + ' · ' + S.fmtInd('solde_expl_pct', c.solde_expl_pct) + L(' des recettes', ' van de ontvangsten') + (ms != null ? L(' · comparables ', ' · vergelijkbaar ') + S.fmtInd('solde_expl_pct', ms) : '');
    } else {
      cs.textContent = '—'; cs.style.color = '';
      csn.textContent = c.solde_a_verifier ? L('à vérifier : détail des recettes incomplet', 'na te kijken: detail van de ontvangsten onvolledig') : L('non disponible', 'niet beschikbaar');
    }

    // specificities
    const box = document.getElementById('c-spec'); box.replaceChildren();
    const sd = dash.data('specificites');
    const specs = sd.status === 'ok' ? sd.data.filter((s) => String(s.nis) === c.nis) : [];
    if (sd.status === 'error') S.failed(box);
    else if (sd.status === 'ok') {
      [[L('Pressions à la dépense', 'Druk op de uitgaven'), (s) => s.domaine !== 'Budget 2026' && s.effet_depenses === 'hausse', 'bad'],
        [L('Atouts pour les recettes', 'Troeven voor de ontvangsten'), (s) => s.domaine !== 'Budget 2026' && s.effet_recettes === 'hausse', 'ok'],
        [L('Freins aux recettes', 'Remmen op de ontvangsten'), (s) => s.domaine !== 'Budget 2026' && s.effet_recettes === 'baisse', 'warn'],
        [L('Observations sur le budget 2026', 'Vaststellingen over de begroting 2026'), (s) => s.domaine === 'Budget 2026', '']].forEach(([t, f, cls]) => {
        const items = specs.filter(f);
        const col = document.createElement('div'); col.className = 'bc-spec-col';
        const h = document.createElement('h3'); h.textContent = t; const n = document.createElement('span'); n.className = 'bc-pill ' + cls; n.textContent = String(items.length); h.appendChild(n); col.appendChild(h);
        if (!items.length) { const p = document.createElement('p'); p.className = 'bc-empty'; p.textContent = L('Rien de marquant par rapport aux autres communes de la région.', 'Niets opvallends tegenover de andere gemeenten van het gewest.'); col.appendChild(p); }
        items.sort((a, b) => Math.abs(50 - Number(b.percentile || 50)) - Math.abs(50 - Number(a.percentile || 50))).forEach((s) => col.appendChild(specItem(s)));
        box.appendChild(col);
      });
    }

    // peers controls + table
    const dims = document.getElementById('c-dims');
    if (!dims.children.length) Object.keys(S.DIMS).forEach((k) => {
      const b = document.createElement('button'); b.className = 'bc-btn'; b.dataset.dim = k;
      b.addEventListener('click', () => { const i = S.state.dims.indexOf(k); if (i >= 0) S.state.dims.splice(i, 1); else S.state.dims.push(k); S.render(); });
      dims.appendChild(b);
    });
    [...dims.children].forEach((b) => { b.textContent = S.DIMS[b.dataset.dim][0][S.lang === 'nl' ? 1 : 0]; b.setAttribute('aria-pressed', String(S.state.dims.includes(b.dataset.dim))); });
    document.getElementById('c-k').value = String(S.state.k);
    const tb = document.querySelector('#c-pairs tbody');
    const td = (t, cls) => { const e = document.createElement('td'); e.textContent = t; if (cls) e.className = cls; return e; };
    const prow = (r, sel) => { const tr = document.createElement('tr'); tr.dataset.key = r.nis; if (sel) tr.className = 'sel'; tr.append(td(S.name(r)), td(S.fmt.n0(r.population), 'num'), td(S.fmt.eur(r.revenu_imposable_par_habitant), 'num hide-n'), td(S.fmt.n0(r.densite_hab_km2), 'num hide-n'), td(S.fmt.eur(r.dep_expl_hab), 'num'), td(S.fmt.eur(r.rec_expl_hab), 'num')); return tr; };
    tb.replaceChildren(prow(c, true), ...peers.map((r) => prow(r)));

    // comparisons
    const depItems = S.compare(c, peers, S.DEP, sim), recItems = S.compare(c, peers, S.REC, sim);
    const noBudget = c.budget_statut !== 'fiable';
    const noTxt = L('Pas de budget 2026 exploitable pour cette commune.', 'Geen bruikbare begroting 2026 voor deze gemeente.');
    S.safe([
      () => S.rangeChart(document.getElementById('c-dep-chart'), noBudget ? [] : depItems, { sens: 'dep', empty: noTxt }),
      () => S.rangeChart(document.getElementById('c-rec-chart'), noBudget ? [] : recItems, { sens: 'rec', empty: noTxt }),
    ]);

    // diagnostic
    const diag = document.getElementById('c-diag'); diag.replaceChildren();
    const totalsOnly = L("Le budget n'est disponible qu'en totaux.", 'De begroting is enkel in totalen beschikbaar.');
    const block = (title, items, empty) => {
      const col = document.createElement('div'); col.className = 'bc-spec-col';
      const h = document.createElement('h3'); h.textContent = title; col.appendChild(h);
      if (!items.length) { const p = document.createElement('p'); p.className = 'bc-empty'; p.textContent = empty; col.appendChild(p); }
      const ul = document.createElement('ul'); ul.className = 'bc-diag';
      items.forEach((d) => {
        const li = document.createElement('li');
        const b = document.createElement('strong'); b.textContent = d.lab + ' : ' + S.fmt.signedEur(d.gapTot) + L(' par an', ' per jaar');
        li.append(b, document.createTextNode(' (' + S.fmt.eur(d.v) + L(' / hab. contre ', ' / inw. tegenover ') + S.fmt.eur(d.med) + L(' chez les comparables).', ' bij vergelijkbare gemeenten).')));
        const ex = specs.filter((s) => (S.EXPLAIN[d.k] || []).includes(s.indicateur) && s.domaine !== 'Budget 2026');
        if (ex.length) { const e = document.createElement('div'); e.className = 'bc-spec-txt'; e.textContent = L('Explications possibles : ', 'Mogelijke verklaringen: ') + ex.map((s) => nlOr(s, 'specificite').toLowerCase()).join(', ') + '.'; li.appendChild(e); }
        ul.appendChild(li);
      });
      col.appendChild(ul); diag.appendChild(col);
    };
    const dn = document.getElementById('c-diag-note');
    if (noBudget) { dn.textContent = ''; S.empty(diag, L("Pas de budget 2026 exploitable : le diagnostic budgétaire n'est pas possible.", 'Geen bruikbare begroting 2026: een begrotingsdiagnose is niet mogelijk.')); }
    else {
      const det = (items) => items.filter((d) => !['dep_expl_hab', 'rec_expl_hab', 'dep_inv_hab'].includes(d.k) && d.v != null && d.med != null && d.n >= 3).map((d) => ({ ...d, gapTot: (d.v - d.med) * c.population }));
      block(L('Dépense plus que les comparables', 'Geeft meer uit dan vergelijkbare gemeenten'), det(depItems).filter((d) => d.v > d.p75).sort((a, b) => b.gapTot - a.gapTot).slice(0, 4), c.budget_ventile ? L('Aucun poste au-dessus de 75 % des communes comparables.', 'Geen enkele post boven 75 % van de vergelijkbare gemeenten.') : totalsOnly);
      block(L('Perçoit moins que les comparables', 'Ontvangt minder dan vergelijkbare gemeenten'), det(recItems).filter((d) => d.v < d.p25).sort((a, b) => a.gapTot - b.gapTot).slice(0, 4), c.budget_ventile ? L('Aucune recette sous 25 % des communes comparables.', 'Geen enkele ontvangst onder 25 % van de vergelijkbare gemeenten.') : totalsOnly);
      block(L('Perçoit plus que les comparables', 'Ontvangt meer dan vergelijkbare gemeenten'), det(recItems).filter((d) => d.v > d.p75).sort((a, b) => b.gapTot - a.gapTot).slice(0, 3), c.budget_ventile ? L('Aucune recette au-dessus de 75 % des communes comparables.', 'Geen enkele ontvangst boven 75 % van de vergelijkbare gemeenten.') : totalsOnly);
      const tot = depItems[0];
      dn.textContent = tot.med != null
        ? L(`Dépenses d'exploitation : ${S.fmt.eur(c.dep_expl_hab)} par habitant, contre ${S.fmt.eur(tot.med)} pour la médiane de ${peers.length} communes comparables (${S.fmt.signedEur((c.dep_expl_hab - tot.med) * c.population)} par an). Un poste est signalé quand il dépasse 75 % des comparables (ou passe sous 25 % pour une recette).`,
          `Exploitatie-uitgaven: ${S.fmt.eur(c.dep_expl_hab)} per inwoner, tegenover ${S.fmt.eur(tot.med)} voor de mediaan van ${peers.length} vergelijkbare gemeenten (${S.fmt.signedEur((c.dep_expl_hab - tot.med) * c.population)} per jaar). Een post wordt gemeld als hij boven 75 % van de vergelijkbare gemeenten ligt (of onder 25 % voor een ontvangst).`)
        : L('Écart à la médiane des communes comparables, multiplié par la population.', 'Verschil met de mediaan van de vergelijkbare gemeenten, vermenigvuldigd met de bevolking.');
    }

    // functions
    const fb = document.getElementById('c-fonc-chart');
    const fd = dash.data('fonctions');
    if (fd.status === 'error') S.failed(fb);
    else if (fd.status === 'ok') {
      const mine = new Map(fd.data.filter((f) => String(f.nis) === c.nis).map((f) => [f.fonction, Number(f.dep_hab)]));
      const pset = new Set(peers.map((p) => p.nis));
      const pf = fd.data.filter((f) => pset.has(String(f.nis)));
      const has = new Set(pf.map((f) => String(f.nis)));
      const fns = [...new Set([...mine.keys(), ...pf.map((f) => f.fonction)])].sort((a, b) => parseInt(a) - parseInt(b));
      const items = fns.map((fn) => {
        const vals = peers.filter((p) => has.has(p.nis)).map((p) => { const r = pf.find((f) => String(f.nis) === p.nis && f.fonction === fn); return r ? Number(r.dep_hab) : 0; }).sort((a, b) => a - b);
        const q = (p) => (vals.length ? d3.quantileSorted(vals, p) : null);
        return { k: fn, lab: S.fonction(fn), v: mine.size ? (mine.get(fn) || 0) : null, med: q(0.5), p25: q(0.25), p75: q(0.75) };
      });
      document.getElementById('c-fonc-note').textContent = mine.size
        ? L('Euros par habitant. Rouge : au-dessus de 75 % des communes comparables ; vert : sous 25 %.', 'Euro per inwoner. Rood: boven 75 % van de vergelijkbare gemeenten; groen: onder 25 %.')
        : L("Le budget de cette commune n'est pas ventilé par fonction.", 'De begroting van deze gemeente is niet opgesplitst naar functie.');
      S.safe([() => S.rangeChart(fb, mine.size ? items : [], { sens: 'dep', empty: L('Pas de ventilation par fonction pour cette commune.', 'Geen opsplitsing naar functie voor deze gemeente.') })]);
    }
    S.safe([() => S.renderProfil(c, peers)]);
  };

  S.PROFIL = ['population', 'densite_hab_km2', 'croissance_pop_2015_2025_pct', 'part_0_2_pct', 'part_3_11_pct', 'part_65p_pct', 'part_80p_pct', 'revenu_imposable_par_habitant', 'taux_risque_pauvrete_pct', 'taux_implicite_additionnel_ipp_pct', 'revenu_cadastral_par_habitant', 'rc_economique_pct', 'entreprises_par_1000_hab', 'horeca_par_1000_hab', 'sections_villages', 'km_voirie_locale_par_1000_hab', 'batiments_avant_1946_pct', 'sol_bois_pct'];
  S.renderProfil = (c, peers) => {
    const box = document.getElementById('c-profil'); box.replaceChildren();
    const keys = S.PROFIL.filter((k) => S.rows.some((r) => r[k] != null));
    const W = box.clientWidth || 600, rh = 22, m = { l: Math.min(250, W * 0.44), r: 80, t: 4, b: 24 };
    const H = m.t + m.b + keys.length * rh;
    const x = d3.scaleLinear().domain([0, 100]).range([m.l, W - m.r]);
    const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`);
    svg.append('g').selectAll('line').data([0, 25, 50, 75, 100]).join('line').attr('x1', (d) => x(d)).attr('x2', (d) => x(d)).attr('y1', m.t).attr('y2', H - m.b).attr('stroke', (d) => (d === 50 ? 'var(--cds-chart-reference)' : 'var(--cds-chart-grid)'));
    svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).tickValues([0, 25, 50, 75, 100])).call(S.axisClean);
    const tip = S.tip(box);
    keys.forEach((k, i) => {
      const y = m.t + i * rh + rh / 2;
      svg.append('text').attr('x', m.l - 8).attr('y', y).attr('dy', '0.35em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').style('font-size', 'var(--cds-font-size-caption)').text(S.label(k));
      peers.forEach((p) => { const pp = S.pct(S.rows, k, p); if (pp != null) svg.append('line').attr('x1', x(pp)).attr('x2', x(pp)).attr('y1', y - 5).attr('y2', y + 5).attr('stroke', 'var(--cds-chart-muted)').attr('stroke-width', 1.5); });
      const pc = S.pct(S.rows, k, c);
      if (pc != null) {
        svg.append('circle').attr('cx', x(pc)).attr('cy', y).attr('r', 5.5).attr('fill', dash.colors[0]);
        svg.append('text').attr('x', W - m.r + 6).attr('y', y).attr('dy', '0.35em').attr('fill', 'var(--color-fg-muted)').style('font-size', 'var(--cds-font-size-caption)').text(S.fmtInd(k, c[k]));
      }
      svg.append('rect').attr('x', 0).attr('y', y - rh / 2).attr('width', W).attr('height', rh).attr('fill', 'transparent')
        .on('mousemove', (ev) => tip.show(ev, [S.label(k), S.name(c) + ' : ' + S.fmtInd(k, c[k]) + (pc != null ? ' (rang ' + S.fmt.n0(pc) + ' / 100)' : ''), L('Médiane des comparables : ', 'Mediaan vergelijkbare gemeenten: ') + S.fmtInd(k, S.median(peers.map((p) => p[k]).filter((v) => v != null)))]))
        .on('mouseleave', () => tip.hide());
    });
  };
})();

;

// ---------- SIMULATION ----------
(function () {
  const S = window.BC;
  const L = S.L;
  const levBox = document.getElementById('s-levers'), linesBox = document.getElementById('s-lines');
  document.getElementById('s-goto').addEventListener('click', () => S.showTab('commune'));
  document.getElementById('s-reset').addEventListener('click', () => { S.sim = { nis: S.state.nis, lev: {}, lines: [] }; S.buildLevers(true); S.buildLines(); S.render(); });
  document.getElementById('s-addline').addEventListener('click', () => { S.sim.lines.push({ libelle: '', sens: 'dep', montant: '' }); S.buildLines(); });
  document.getElementById('s-presets').addEventListener('click', (e) => {
    const b = e.target.closest('[data-preset]'); if (!b) return;
    const c = S.byNis.get(S.state.nis); if (!c) return;
    S.sim.nis = c.nis;
    const p = b.dataset.preset, add = (k, v) => { S.sim.lev[k] = (Number(S.sim.lev[k]) || 0) + v; };
    if (p === 'index') { if (c.budget_ventile) add('personnel', 2); else add('dep_tot', 1); }
    if (p === 'energie') { if (c.budget_ventile) add('fonctionnement', 5); else add('dep_tot', 0.8); }
    if (p === 'police' && c.budget_ventile) add('police', 5);
    if (p === 'piscine') {
      S.sim.lines.push({ libelle: L('Piscine : personnel, énergie, entretien (hypothèse)', 'Zwembad: personeel, energie, onderhoud (hypothese)'), sens: 'dep', montant: 900000 });
      S.sim.lines.push({ libelle: L('Piscine : entrées et abonnements (hypothèse)', 'Zwembad: toegangen en abonnementen (hypothese)'), sens: 'rec', montant: 300000 });
    }
    if (p === 'gf') S.addGfLine(c);
    if (p === 'pairs') {
      const peers = S.peers(S.rows, c);
      const defs = c.budget_ventile ? [['personnel', 'dep_personnel_hab'], ['fonctionnement', 'dep_fonctionnement_hab'], ['transferts', 'dep_transferts_hab'], ['dette', 'dep_dette_hab']] : [['dep_tot', 'dep_expl_hab']];
      defs.forEach(([lev, k]) => { const m = S.median(peers.map((x) => x[k]).filter((v) => v != null)); if (m != null && c[k] > m) S.sim.lev[lev] = Math.round(1000 * (m / c[k] - 1)) / 10; });
    }
    S.buildLevers(true); S.buildLines(); S.render();
  });

  // Flanders: the 2027 gap between the plan and the official Gemeentefonds, as a negative receipt
  S.addGfLine = (c) => {
    const pl = dash.data('pluriannuel');
    const r27 = pl.status === 'ok' ? pl.data.find((x) => String(x.nis) === c.nis && Number(x.annee) === 2027) : null;
    const msg = document.getElementById('s-scen-msg');
    if (!r27) { msg.textContent = L('Pas de données Gemeentefonds pour cette commune.', 'Geen Gemeentefonds-gegevens voor deze gemeente.'); return; }
    const d = Math.round(Number(r27.gf_ecart_plan));
    S.sim.lines = S.sim.lines.filter((l) => !l.gf);
    S.sim.lines.push({ libelle: L('Réduction du Gemeentefonds 2027 (officiel − plan)', 'Inkrimping Gemeentefonds 2027 (officieel − plan)'), sens: 'rec', montant: d, gf: true });
    msg.textContent = Math.abs(d) < 1000 ? L('Le plan de cette commune intègre déjà la réduction.', 'Het plan van deze gemeente houdt al rekening met de inkrimping.') : '';
  };

  S.buildLevers = (force) => {
    const c = S.byNis.get(S.state.nis); if (!c) return;
    const defs = c.budget_ventile ? (S.flemishTax(c) ? S.LEVERS_FL : S.LEVERS) : S.LEVERS_TOTAL;
    const sig = c.nis + (c.budget_ventile ? 'v' : 't') + S.lang;
    if (!force && levBox.dataset.sig === sig) return;
    levBox.dataset.sig = sig;
    levBox.replaceChildren(...defs.filter(([, , , k]) => !k || c[k] != null).map(([key, lab, unit, base]) => {
      const l = document.createElement('label'); l.className = 'bc-lever';
      const t = document.createElement('span'); t.textContent = lab[S.lang === 'nl' ? 1 : 0];
      const i = document.createElement('input'); i.type = 'number'; i.id = 'lev-' + key; i.step = unit === 'taux' ? '0.1' : '0.5';
      i.value = S.sim.lev[key] != null ? S.sim.lev[key] : unit === 'apb' ? c.aanslagvoet_apb : unit === 'oov' ? c.aanslagvoet_oov
        : (unit === 'taux' ? (c.taux_implicite_additionnel_ipp_pct != null ? Math.round(c.taux_implicite_additionnel_ipp_pct * 100) / 100 : '') : 0);
      if (unit === 'oov') i.step = '10';
      i.addEventListener('input', () => { S.sim.nis = c.nis; S.sim.lev[key] = i.value === '' ? null : Number(i.value); S.renderSimulation(true); });
      const bs = document.createElement('span'); bs.className = 'base';
      bs.textContent = unit === 'apb'
        ? L('taux actuel ', 'huidig tarief ') + S.fmt.n2(c.aanslagvoet_apb) + ' % · ' + L('1 % rapporte ', '1 % brengt ') + S.fmt.eurc(c.waarde_1pct_apb) + L('', ' op')
        : unit === 'oov' ? L('actuel ', 'huidig ') + S.fmt.n0(c.aanslagvoet_oov) + ' · ' + L('100 centimes rapportent ', '100 opcentiemen brengen ') + S.fmt.eurc(c.waarde_100opc_oov) + L('', ' op')
        : unit === 'taux'
        ? L('taux actuel ≈ ', 'huidig tarief ≈ ') + S.fmt.n2(c.taux_implicite_additionnel_ipp_pct) + ' % · ' + S.fmt.eurc((c.ipp_hab || 0) * c.population)
        : L('variation en % · base ', 'wijziging in % · basis ') + (base ? S.fmt.eurc(c[base] * c.population) : S.fmtInd('population', c.population));
      // a slider next to the field, both kept in sync
      const rg = document.createElement('input'); rg.type = 'range'; rg.id = 'levr-' + key; rg.setAttribute('aria-label', t.textContent);
      const lim = unit === 'apb' ? [0, 9, 0.1] : unit === 'oov' ? [0, 2000, 10] : unit === 'taux' ? [0, 10, 0.1] : key === 'population' ? [-10, 10, 0.5] : [-25, 25, 0.5];
      rg.min = lim[0]; rg.max = lim[1]; rg.step = lim[2]; rg.value = i.value === '' ? lim[0] : i.value;
      rg.addEventListener('input', () => { i.value = rg.value; i.dispatchEvent(new Event('input')); });
      i.addEventListener('input', () => { if (i.value !== '') rg.value = i.value; });
      const row = document.createElement('span'); row.className = 'bc-lever-row'; row.append(rg, i);
      l.append(t, row, bs); return l;
    }));
  };
  S.buildLines = () => {
    linesBox.replaceChildren(...S.sim.lines.map((ln, idx) => {
      const d = document.createElement('div'); d.className = 'bc-line';
      const t = document.createElement('input'); t.type = 'text'; t.id = 'line-lib-' + idx; t.placeholder = L('Libellé', 'Omschrijving'); t.value = ln.libelle; t.setAttribute('aria-label', L('Libellé', 'Omschrijving'));
      t.addEventListener('input', () => { ln.libelle = t.value; S.renderSimulation(true); });
      const s = document.createElement('select'); s.id = 'line-sens-' + idx; s.setAttribute('aria-label', 'Type'); s.append(new Option(L('Dépense', 'Uitgave'), 'dep'), new Option(L('Recette', 'Ontvangst'), 'rec')); s.value = ln.sens;
      s.addEventListener('change', () => { ln.sens = s.value; S.renderSimulation(true); });
      const m = document.createElement('input'); m.type = 'number'; m.id = 'line-mt-' + idx; m.step = '1000'; m.placeholder = L('Montant €', 'Bedrag €'); m.value = ln.montant; m.setAttribute('aria-label', L('Montant annuel en euros', 'Jaarbedrag in euro'));
      m.addEventListener('input', () => { ln.montant = m.value; S.sim.nis = S.state.nis; S.renderSimulation(true); });
      const x = document.createElement('button'); x.className = 'bc-btn'; x.textContent = L('Retirer', 'Verwijderen');
      x.addEventListener('click', () => { S.sim.lines.splice(idx, 1); S.buildLines(); S.renderSimulation(true); });
      d.append(t, s, m, x); return d;
    }));
  };

  // ---- saved scenarios (browser storage when available, memory otherwise) ----
  const SKEY = 'bc-scenarios-v1';
  S.scenList = () => { try { const v = JSON.parse(localStorage.getItem(SKEY) || 'null'); if (Array.isArray(v)) return v; } catch (e) { /* storage blocked */ } return S._scenMem || []; };
  S.scenStore = (list) => { S._scenMem = list; try { localStorage.setItem(SKEY, JSON.stringify(list)); } catch (e) { /* storage blocked */ } };
  S.scenSel = S.scenSel || new Set();
  const msgEl = () => document.getElementById('s-scen-msg');
  const levTxt = (sc) => {
    const parts = Object.entries(sc.lev || {}).filter(([, v]) => v != null && v !== '' && Number(v) !== 0).map(([k, v]) => {
      const d = [...S.LEVERS, ...S.LEVERS_FL, ...S.LEVERS_TOTAL].find((x) => x[0] === k);
      const lab = d ? d[1][S.lang === 'nl' ? 1 : 0] : k;
      return lab + ' ' + (['apb_taux', 'oov_opc', 'ipp_taux'].includes(k) ? '= ' + v : (Number(v) > 0 ? '+' : '') + v + ' %');
    });
    (sc.lines || []).filter((l) => Number(l.montant)).forEach((l) => parts.push((l.libelle || L('ligne', 'lijn')) + ' ' + S.fmt.signedEur(l.sens === 'dep' ? -Number(l.montant) : Number(l.montant))));
    return parts.join(' · ') || L('aucun changement', 'geen wijziging');
  };
  S.evalScen = (sc) => {
    const c = S.byNis.get(String(sc.nis)); if (!c || c.dep_expl_hab == null) return null;
    const keep = S.sim; S.sim = { nis: c.nis, lev: sc.lev || {}, lines: sc.lines || [] };
    let r = null; try { r = S.simulate(c); } finally { S.sim = keep; }
    return { c, r };
  };
  document.getElementById('s-scen-save').addEventListener('click', () => {
    const c = S.byNis.get(S.state.nis); if (!c) return;
    const list = S.scenList();
    const nameEl = document.getElementById('s-scen-name');
    const name = nameEl.value.trim() || L('Scénario ', 'Scenario ') + (list.length + 1);
    const sc = { id: Date.now().toString(36), name, nis: c.nis, lev: { ...S.sim.lev }, lines: S.sim.lines.map((l) => ({ ...l })), date: new Date().toISOString() };
    list.push(sc); S.scenStore(list); S.scenSel.add(sc.id); nameEl.value = '';
    msgEl().textContent = L('Scénario enregistré : ', 'Scenario bewaard: ') + name;
    S.toast(L('Scénario enregistré', 'Scenario bewaard') + ' : ' + name);
    S.renderScenarios();
  });
  const exportText = () => JSON.stringify({ format: 'budgets-communaux-scenarios', version: 1, scenarios: S.scenList() }, null, 1);
  document.getElementById('s-scen-export').addEventListener('click', () => {
    try {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([exportText()], { type: 'application/json' }));
      a.download = 'scenarios-budgets-communaux.json';
      document.body.appendChild(a); a.click(); a.remove();
      msgEl().textContent = L('Fichier exporté. Si rien ne se télécharge, utilisez « Copier ».', 'Bestand geëxporteerd. Als er niets gedownload wordt, gebruik dan “Kopiëren”.');
    } catch (e) { msgEl().textContent = L('Export impossible ici : utilisez « Copier ».', 'Exporteren kan hier niet: gebruik “Kopiëren”.'); }
  });
  document.getElementById('s-scen-copy').addEventListener('click', () => {
    const txt = exportText();
    const box = document.getElementById('s-scen-import'), ta = document.getElementById('s-scen-import-text');
    navigator.clipboard.writeText(txt).then(() => { msgEl().textContent = L('Scénarios copiés dans le presse-papiers.', "Scenario's gekopieerd naar het klembord."); })
      .catch(() => { box.hidden = false; ta.value = txt; ta.select(); msgEl().textContent = L('Copie automatique refusée : le texte est sélectionné ci-dessus, copiez-le avec Ctrl+C.', 'Automatisch kopiëren geweigerd: de tekst is hierboven geselecteerd, kopieer met Ctrl+C.'); });
  });
  document.getElementById('s-scen-import-btn').addEventListener('click', () => { const b = document.getElementById('s-scen-import'); b.hidden = !b.hidden; });
  document.getElementById('s-scen-import-go').addEventListener('click', () => {
    const ta = document.getElementById('s-scen-import-text');
    try {
      const v = JSON.parse(ta.value);
      const arr = (Array.isArray(v) ? v : v.scenarios || []).filter((x) => x && x.nis && S.byNis.get(String(x.nis)));
      if (!arr.length) throw new Error('empty');
      const list = S.scenList();
      arr.forEach((x, i) => list.push({ id: Date.now().toString(36) + i, name: String(x.name || 'Import').slice(0, 80), nis: String(x.nis), lev: typeof x.lev === 'object' && x.lev ? x.lev : {}, lines: Array.isArray(x.lines) ? x.lines.map((l) => ({ libelle: String(l.libelle || '').slice(0, 120), sens: l.sens === 'rec' ? 'rec' : 'dep', montant: Number(l.montant) || 0, gf: !!l.gf })) : [], date: x.date || new Date().toISOString() }));
      S.scenStore(list); ta.value = ''; document.getElementById('s-scen-import').hidden = true;
      msgEl().textContent = L(arr.length + ' scénario(s) importé(s).', arr.length + " scenario('s) geïmporteerd.");
      S.renderScenarios();
    } catch (e) { msgEl().textContent = L("Texte non reconnu : collez un export de scénarios.", "Tekst niet herkend: plak een export van scenario's."); }
  });
  document.querySelector('#s-scen-table tbody').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]'); const cb = e.target.closest('input[type=checkbox]');
    const id = (b || cb) && (b || cb).dataset.id; if (!id) return;
    const list = S.scenList(); const sc = list.find((x) => x.id === id); if (!sc) return;
    if (cb) { if (cb.checked) S.scenSel.add(id); else S.scenSel.delete(id); S.renderScenarios(); return; }
    if (b.dataset.act === 'load') {
      S.state.nis = String(sc.nis);
      S.sim = { nis: String(sc.nis), lev: { ...(sc.lev || {}) }, lines: (sc.lines || []).map((l) => ({ ...l })) };
      S.buildLevers(true); S.buildLines(); S.render();
      msgEl().textContent = L('Scénario chargé : ', 'Scenario geladen: ') + sc.name;
    }
    if (b.dataset.act === 'del') { S.scenStore(list.filter((x) => x.id !== id)); S.scenSel.delete(id); S.renderScenarios(); }
  });

  S.renderScenarios = () => {
    const list = S.scenList();
    const tb = document.querySelector('#s-scen-table tbody');
    const td = (t, cls) => { const e = document.createElement('td'); e.textContent = t; if (cls) e.className = cls; return e; };
    if (!list.length) {
      const tr = document.createElement('tr'); const c0 = td(L('Aucun scénario enregistré. Réglez des leviers puis cliquez sur « Enregistrer le scénario ».', 'Nog geen scenario bewaard. Stel hefbomen in en klik op “Scenario bewaren”.'), 'bc-empty'); c0.colSpan = 5; tr.appendChild(c0); tb.replaceChildren(tr);
    } else {
      tb.replaceChildren(...list.map((sc) => {
        const tr = document.createElement('tr'); tr.style.cursor = 'default';
        const ev = S.evalScen(sc);
        const cbx = document.createElement('input'); cbx.type = 'checkbox'; cbx.dataset.id = sc.id; cbx.checked = S.scenSel.has(sc.id); cbx.setAttribute('aria-label', L('Comparer ', 'Vergelijken ') + sc.name);
        const c0 = document.createElement('td'); c0.appendChild(cbx);
        const c1 = td(sc.name); c1.title = levTxt(sc);
        const cr = S.byNis.get(String(sc.nis));
        const c4 = document.createElement('td');
        const lb = document.createElement('button'); lb.className = 'bc-btn'; lb.dataset.act = 'load'; lb.dataset.id = sc.id; lb.textContent = L('Charger', 'Laden');
        const db = document.createElement('button'); db.className = 'bc-btn'; db.dataset.act = 'del'; db.dataset.id = sc.id; db.textContent = L('Supprimer', 'Verwijderen'); db.style.marginLeft = '6px';
        c4.append(lb, db);
        tr.append(c0, c1, td(cr ? S.name(cr) : sc.nis), td(ev ? S.fmt.signedEur(ev.r.rec1 - ev.r.dep1) : '—', 'num'), c4);
        return tr;
      }));
    }
    // comparison: 2026 budget of the current commune + the ticked scenarios
    const head = document.getElementById('s-cmp-head'), body = document.querySelector('#s-cmp-table tbody'), chart = document.getElementById('s-cmp-chart');
    const c = S.byNis.get(S.state.nis);
    const cols = [];
    if (c && c.dep_expl_hab != null) {
      const base = S.evalScen({ nis: c.nis, lev: {}, lines: [] });
      if (base) cols.push({ name: L('Budget 2026 – ', 'Begroting 2026 – ') + S.name(c), ...base, sc: null });
    }
    list.filter((sc) => S.scenSel.has(sc.id)).forEach((sc) => { const ev = S.evalScen(sc); if (ev) cols.push({ name: sc.name, ...ev, sc }); });
    if (cols.length < 2) {
      head.replaceChildren(); body.replaceChildren();
      S.empty(chart, L('Cochez un ou plusieurs scénarios pour les comparer au budget 2026.', "Vink een of meer scenario's aan om ze te vergelijken met de begroting 2026."));
      return;
    }
    const th = (t, cls) => { const e = document.createElement('th'); e.textContent = t; if (cls) e.className = cls; return e; };
    head.replaceChildren(th(''), ...cols.map((x) => th(x.name, 'num')));
    const b0 = cols[0];
    const rowsDef = [
      [L('Commune', 'Gemeente'), (x) => S.name(x.c)],
      [L('Dépenses d\'exploitation', 'Exploitatie-uitgaven'), (x) => S.fmt.eurc(x.r.dep1)],
      [L('Recettes d\'exploitation', 'Exploitatie-ontvangsten'), (x) => S.fmt.eurc(x.r.rec1)],
      [L('Solde', 'Saldo'), (x) => S.fmt.signedEur(x.r.rec1 - x.r.dep1)],
      [L('Écart de solde / budget 2026', 'Verschil saldo / begroting 2026'), (x) => (x.c.nis === b0.c.nis ? S.fmt.signedEur((x.r.rec1 - x.r.dep1) - (b0.r.rec1 - b0.r.dep1)) : '—')],
      [L('Dépenses / hab.', 'Uitgaven / inw.'), (x) => S.fmt.eur(x.r.dep1 / x.r.pop1)],
      [L('Recettes / hab.', 'Ontvangsten / inw.'), (x) => S.fmt.eur(x.r.rec1 / x.r.pop1)],
      [L('Hypothèses', 'Hypothesen'), (x) => (x.sc ? levTxt(x.sc) : L('budget voté', 'gestemde begroting'))],
    ];
    body.replaceChildren(...rowsDef.map(([lab, f]) => {
      const tr = document.createElement('tr'); tr.style.cursor = 'default';
      const c0 = document.createElement('td'); c0.textContent = lab; tr.appendChild(c0);
      cols.forEach((x) => { const e = document.createElement('td'); e.className = 'num'; e.textContent = f(x); if (lab === L('Hypothèses', 'Hypothesen')) { e.style.whiteSpace = 'normal'; e.style.minWidth = '12rem'; e.style.textAlign = 'left'; } tr.appendChild(e); });
      return tr;
    }));
    // bar chart of the balances
    chart.replaceChildren();
    const W = chart.clientWidth || 600, bh = 22, m = { l: Math.min(220, W * 0.38), r: 70, t: 4, b: 24 };
    const H = m.t + m.b + cols.length * (bh + 8);
    const vals = cols.map((x) => x.r.rec1 - x.r.dep1);
    const ext = d3.extent([0, ...vals]);
    const x = d3.scaleLinear().domain(ext).nice().range([m.l, W - m.r]);
    const svg = d3.select(chart).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`);
    svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(Math.max(3, Math.floor(W / 120))).tickFormat((v) => S.fmt.eurc(v))).call(S.axisClean);
    svg.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', m.t).attr('y2', H - m.b).attr('stroke', 'var(--cds-chart-reference)');
    cols.forEach((col, i) => {
      const y = m.t + i * (bh + 8), v = vals[i];
      svg.append('text').attr('x', m.l - 8).attr('y', y + bh / 2).attr('dy', '0.35em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').style('font-size', 'var(--cds-font-size-caption)').text(col.name.length > 34 ? col.name.slice(0, 33) + '…' : col.name);
      svg.append('rect').attr('x', Math.min(x(0), x(v))).attr('y', y).attr('width', Math.max(1, Math.abs(x(v) - x(0)))).attr('height', bh).attr('rx', 4)
        .attr('fill', v < 0 ? 'var(--cds-chart-status-critical)' : (i === 0 ? 'var(--cds-chart-muted)' : dash.colors[0]));
      svg.append('text').attr('x', Math.max(x(0), x(v)) + 4).attr('y', y + bh / 2).attr('dy', '0.35em').attr('fill', 'var(--color-fg-muted)').style('font-size', 'var(--cds-font-size-caption)').text(S.fmt.signedEur(v));
    });
  };

  S.renderSimulation = (fromInput) => {
    if (dash.data('communes').status !== 'ok') return;
    const c = S.byNis.get(S.state.nis); if (!c) return;
    if (S.sim.nis !== c.nis) { S.sim = { nis: c.nis, lev: {}, lines: [] }; S.buildLevers(true); S.buildLines(); }
    if (!fromInput) { S.buildLevers(false); if (linesBox.children.length !== S.sim.lines.length || S.langChanged) S.buildLines(); }
    document.getElementById('s-commune').textContent = S.name(c) + ' (' + S.reg(c.region) + ')';
    document.getElementById('preset-gf').hidden = c.region !== 'Flandre';
    S.safe([S.renderScenarios]);
    const tb = document.querySelector('#s-table tbody');
    const ok = c.budget_statut === 'fiable' && c.dep_expl_hab != null;
    document.getElementById('s-note').textContent = ok
      ? (c.budget_ventile
        ? L("Les montants de départ sont ceux du budget 2026 (exploitation, exercice propre). La simulation s'affiche aussi sur la page Analyse d'une commune.", 'De startbedragen zijn die van de begroting 2026 (exploitatie, eigen dienstjaar). De simulatie verschijnt ook op de pagina Analyse van een gemeente.')
        : L("Ce budget n'est disponible qu'en totaux : seuls les leviers globaux et les lignes ajoutées sont proposés.", 'Deze begroting is enkel in totalen beschikbaar: alleen de globale hefbomen en toegevoegde lijnen zijn beschikbaar.'))
      : L('Pas de budget 2026 exploitable pour cette commune : choisissez-en une autre.', 'Geen bruikbare begroting 2026 voor deze gemeente: kies een andere.');
    if (!ok) { tb.replaceChildren(); ['s-solde0', 's-solde1', 's-dep1', 's-rec1'].forEach((id) => { document.getElementById(id).textContent = '—'; }); document.getElementById('s-chart').replaceChildren(); return; }
    const r = S.simulate(c);
    const td = (t, cls) => { const e = document.createElement('td'); e.textContent = t; if (cls) e.className = cls; return e; };
    const dcell = (d, s) => { const good = s === 'dep' ? d < 0 : d > 0; return td(Math.abs(d) < 1 ? '—' : S.fmt.signedEur(d), 'num bc-delta ' + (Math.abs(d) < 1 ? '' : good ? 'pos' : 'neg')); };
    const rowsOut = r.rows.map((x) => { const tr = document.createElement('tr'); tr.append(td((x.s === 'dep' ? L('Dépense · ', 'Uitgave · ') : L('Recette · ', 'Ontvangst · ')) + x.lab), td(S.fmt.eurc(x.v0), 'num'), td(S.fmt.eurc(x.v1), 'num'), dcell(x.v1 - x.v0, x.s)); return tr; });
    const tot = (lab, a, b, s) => { const tr = document.createElement('tr'); tr.className = 'sel'; tr.append(td(lab), td(S.fmt.eurc(a), 'num'), td(S.fmt.eurc(b), 'num'), dcell(b - a, s)); return tr; };
    tb.replaceChildren(...rowsOut, tot(L('Total dépenses', 'Totaal uitgaven'), r.dep0, r.dep1, 'dep'), tot(L('Total recettes', 'Totaal ontvangsten'), r.rec0, r.rec1, 'rec'), tot(L('Solde', 'Saldo'), r.rec0 - r.dep0, r.rec1 - r.dep1, 'rec'));
    const s0 = r.rec0 - r.dep0, s1 = r.rec1 - r.dep1;
    document.getElementById('s-solde0').textContent = S.fmt.signedEur(s0);
    document.getElementById('s-solde1').textContent = S.fmt.signedEur(s1);
    document.getElementById('sb-s0').textContent = S.fmt.signedEur(s0);
    const sb1 = document.getElementById('sb-s1'); sb1.textContent = S.fmt.signedEur(s1); sb1.style.color = s1 < 0 ? 'var(--color-bad)' : '';
    const sbd = document.getElementById('sb-d'); sbd.textContent = S.fmt.signedEur(s1 - s0); sbd.style.color = s1 - s0 > 0.5 ? 'var(--color-ok)' : s1 - s0 < -0.5 ? 'var(--color-bad)' : '';
    document.getElementById('sb-dep').textContent = S.fmt.eur(r.dep1 / r.pop1);
    document.getElementById('sb-rec').textContent = S.fmt.eur(r.rec1 / r.pop1);
    const sd = document.getElementById('s-solde-delta'); sd.textContent = L('écart ', 'verschil ') + S.fmt.signedEur(s1 - s0) + L(' par an', ' per jaar'); sd.className = 'bc-tile-note bc-delta ' + (s1 - s0 > 0.5 ? 'pos' : s1 - s0 < -0.5 ? 'neg' : '');
    const peers = S.peers(S.rows, c);
    const md = S.median(peers.map((p) => p.dep_expl_hab).filter((v) => v != null)), mr = S.median(peers.map((p) => p.rec_expl_hab).filter((v) => v != null));
    document.getElementById('s-dep1').textContent = S.fmt.eur(r.dep1 / r.pop1);
    document.getElementById('s-dep-note').textContent = L('budget ', 'begroting ') + S.fmt.eur(r.dep0 / r.pop0) + L(' · comparables ', ' · vergelijkbaar ') + S.fmt.eur(md);
    document.getElementById('s-rec1').textContent = S.fmt.eur(r.rec1 / r.pop1);
    document.getElementById('s-rec-note').textContent = L('budget ', 'begroting ') + S.fmt.eur(r.rec0 / r.pop0) + L(' · comparables ', ' · vergelijkbaar ') + S.fmt.eur(mr);
    const defs = c.budget_ventile
      ? [['dep_expl_hab', ['Dépenses : total', 'Uitgaven: totaal']], ...S.DEP.slice(1).filter(([k]) => k !== 'dep_inv_hab'), ['rec_expl_hab', ['Recettes : total', 'Ontvangsten: totaal']], ...S.REC.slice(1)]
      : [['dep_expl_hab', ["Dépenses d'exploitation", 'Exploitatie-uitgaven']], ['rec_expl_hab', ["Recettes d'exploitation", 'Exploitatie-ontvangsten']]];
    S.safe([() => S.rangeChart(document.getElementById('s-chart'), S.compare(c, peers, defs, S.simActive() ? r : null), { sens: 'dep', empty: '—' })]);
  };
})();

;

// ---------- GEMEENTEFONDS (FLANDRE) ----------
(function () {
  const S = window.BC;
  const L = S.L;
  S.state.gfnis = S.state.gfnis || '44021';
  S.state.gfsort = S.state.gfsort || { key: 'gf_ecart_plan_2027_2031_hab', dir: 1 };
  S.state.gfsearch = S.state.gfsearch || '';
  const YEARS = [2026, 2027, 2028, 2029, 2030, 2031];

  // multi-series line chart over the plan years
  S.lineChart = (box, series, legend, fmt) => {
    box.replaceChildren(); if (legend) legend.replaceChildren();
    const W = box.clientWidth || 500, H = 240, m = { l: 70, r: 16, t: 10, b: 26 };
    const all = series.flatMap((s) => s.values.filter((v) => v != null && isFinite(v)));
    if (!all.length) return S.empty(box, L('Pas de données.', 'Geen gegevens.'));
    const lo = Math.min(0, d3.min(all)), hi = Math.max(0, d3.max(all));
    const x = d3.scaleLinear().domain([YEARS[0], YEARS[YEARS.length - 1]]).range([m.l, W - m.r]);
    const y = d3.scaleLinear().domain([lo, hi]).nice().range([H - m.b, m.t]);
    const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`);
    svg.append('g').selectAll('line').data(y.ticks(5)).join('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', (d) => y(d)).attr('y2', (d) => y(d)).attr('stroke', (d) => (d === 0 ? 'var(--cds-chart-reference)' : 'var(--cds-chart-grid)'));
    svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).tickValues(YEARS).tickFormat((v) => String(v))).call(S.axisClean);
    svg.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(5).tickFormat(fmt)).call(S.axisClean);
    series.forEach((s) => {
      const pts = YEARS.map((yr, i) => [yr, s.values[i]]).filter(([, v]) => v != null && isFinite(v));
      svg.append('path').attr('d', d3.line().x((d) => x(d[0])).y((d) => y(d[1]))(pts)).attr('fill', 'none').attr('stroke', s.color)
        .attr('stroke-width', 2).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round').attr('stroke-dasharray', s.dash ? '5 4' : null);
      svg.append('g').selectAll('circle').data(pts).join('circle').attr('cx', (d) => x(d[0])).attr('cy', (d) => y(d[1])).attr('r', 2.8).attr('fill', s.color);
      if (legend) { const sp = document.createElement('span'); const sw = document.createElement('span'); sw.className = 'bc-sw'; sw.style.background = s.color; sp.append(sw, s.name); legend.appendChild(sp); }
    });
    const tip = S.tip(box);
    const step = (x(YEARS[1]) - x(YEARS[0]));
    YEARS.forEach((yr, i) => {
      svg.append('rect').attr('x', x(yr) - step / 2).attr('y', m.t).attr('width', step).attr('height', H - m.t - m.b).attr('fill', 'transparent')
        .on('mousemove', (ev) => tip.show(ev, [String(yr), ...series.map((s) => s.name + ' : ' + fmt(s.values[i]))]))
        .on('mouseleave', () => tip.hide());
    });
  };

  const tbl = document.querySelector('#gf-table tbody');
  tbl.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-key]'); if (!tr) return;
    S.state.gfnis = tr.dataset.key; S.state.nis = tr.dataset.key;
    S.renderGF();
    document.getElementById('card-gf-commune').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.querySelectorAll('#gf-table th button').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.sort;
    S.state.gfsort = { key: k, dir: S.state.gfsort.key === k ? -S.state.gfsort.dir : (k === 'commune' ? 1 : 1) };
    S.renderGF();
  }));
  document.getElementById('gf-search').addEventListener('input', (e) => { S.state.gfsearch = e.target.value; S.renderGF(); });
  document.getElementById('gf-chips').addEventListener('click', (e) => { const b = e.target.closest('[data-f]'); if (b) { S.state.gffilter = b.dataset.f; S.renderGF(); } });
  document.getElementById('gf-prov').addEventListener('change', (e) => { S.state.gfprov = e.target.value; S.renderGF(); });
  const gin = document.getElementById('gf-input'), glist = document.getElementById('gf-list');
  gin.addEventListener('change', () => {
    const v = gin.value.trim().toLowerCase();
    const r = S.rows.find((x) => x.region === 'Flandre' && (S.name(x).toLowerCase() === v || x.commune.toLowerCase() === v || (x.commune_nl || '').toLowerCase() === v));
    if (r) { S.state.gfnis = r.nis; S.state.nis = r.nis; S.renderGF(); }
  });
  document.getElementById('gf-to-sim').addEventListener('click', () => {
    const c = S.byNis.get(S.state.gfnis); if (!c) return;
    S.state.nis = c.nis;
    S.sim = { nis: c.nis, lev: {}, lines: [] };
    S.addGfLine(c);
    S.showTab('simulation');
    S.buildLevers(true); S.buildLines(); S.render();
  });

  S.renderGF = () => {
    const st = dash.data('gf_stats');
    const setT = (id, f, fmt) => { const el = document.getElementById(id); if (st.status === 'ok' && st.data[0]) { S.countUp(el, st.data[0][f], fmt); el.classList.remove('dash-skeleton'); } };
    setT('gf-t-ecart', 'ecart_plan', S.fmt.signedEur);
    setT('gf-t-perte', 'perte_35', S.fmt.signedEur);
    setT('gf-t-plans', 'plans_non_a_jour', S.fmt.n0);
    setT('gf-t-afm', 'afm2031_neg_apres', S.fmt.n0);
    setT('gf-t-bbr', 'bbr_neg_apres', S.fmt.n0);
    if (st.status === 'ok' && st.data[0]) {
      const d = st.data[0];
      document.getElementById('gf-t-plans-note').textContent = L(`sur ${d.communes} communes : leur plan attend plus que les montants officiels`, `op ${d.communes} gemeenten: hun plan verwacht meer dan de officiële bedragen`);
      document.getElementById('gf-t-afm-note').textContent = L(`communes, contre ${d.afm2031_neg} avant la réduction`, `gemeenten, tegenover ${d.afm2031_neg} vóór de inkrimping`);
      document.getElementById('gf-t-bbr-note').textContent = L(`communes entre 2027 et 2031, contre ${d.bbr_neg} avant`, `gemeenten tussen 2027 en 2031, tegenover ${d.bbr_neg} vóór`);
      ['gf-t-afm', 'gf-t-bbr', 'gf-t-ecart', 'gf-t-perte'].forEach((id) => { document.getElementById(id).style.color = 'var(--color-bad)'; });
    }
    const ga = dash.data('gf_annees');
    const tb = document.getElementById('gf-total-chart'), nb = document.getElementById('gf-norms-chart');
    if (ga.status === 'error') { S.failed(tb); S.failed(nb); }
    else if (ga.status === 'ok') {
      const by = new Map(ga.data.map((r) => [Number(r.annee), r]));
      const v = (k) => YEARS.map((yr) => (by.get(yr) ? by.get(yr)[k] : null));
      S.lineChart(tb, [
        { name: L('Prévu dans les plans', 'Gepland in de plannen'), color: dash.colors[0], values: v('gf_plan') },
        { name: L('Officiel après réduction', 'Officieel na inkrimping'), color: 'var(--cds-chart-status-critical)', values: v('gf_officieel') },
        { name: L('Avec 3,5 % de croissance', 'Met 3,5 % groei'), color: 'var(--cds-chart-muted)', values: v('gf_35'), dash: true },
      ], document.getElementById('gf-total-leg'), (x) => S.fmt.eurc(x));
      S.lineChart(nb, [
        { name: L('BBR négatif, avant', 'Negatief BBR, vóór'), color: dash.colors[0], values: v('bbr_neg') },
        { name: L('BBR négatif, après', 'Negatief BBR, na'), color: 'var(--cds-chart-status-critical)', values: v('bbr_neg_apres') },
        { name: L('AFM négative, avant', 'Negatieve AFM, vóór'), color: dash.colors[1], values: v('afm_neg'), dash: true },
        { name: L('AFM négative, après', 'Negatieve AFM, na'), color: dash.colors[3], values: v('afm_neg_apres'), dash: true },
      ], document.getElementById('gf-norms-leg'), (x) => S.fmt.n0(x));
    }
    // ranking
    const q = S.state.gfsearch.trim().toLowerCase();
    const f = S.state.gffilter || 'all', prov = S.state.gfprov || '';
    const keepF = { all: () => true, afm: (r) => r.afm_2031_apres < 0, bbr: (r) => !!r.bbr_negatif_apres, plan: (r) => !r.gf_plan_a_jour, ok: (r) => !!r.gf_plan_a_jour }[f] || (() => true);
    document.querySelectorAll('#gf-chips [data-f]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
    const ps = document.getElementById('gf-prov');
    if (!ps.options.length || ps.dataset.lang !== S.lang) {
      ps.dataset.lang = S.lang;
      const provs = [...new Set(S.rows.filter((r) => r.region === 'Flandre').map((r) => r.province))].sort();
      ps.replaceChildren(new Option(L('Toutes', 'Alle'), ''), ...provs.map((pv) => new Option(S.prov({ province: pv, province_nl: (S.rows.find((r) => r.province === pv) || {}).province_nl }), pv)));
    }
    ps.value = prov;
    const rows = S.rows.filter((r) => r.region === 'Flandre' && r.gf_ecart_plan_2027_2031 != null && keepF(r) && (!prov || r.province === prov) && (!q || r.commune.toLowerCase().includes(q) || (r.commune_nl || '').toLowerCase().includes(q)));
    const cnt = document.getElementById('gf-count') || (() => { const e = document.createElement('p'); e.id = 'gf-count'; e.className = 'bc-note'; document.getElementById('gf-chips').after(e); return e; })();
    cnt.textContent = L(`${rows.length} communes · écart cumulé 2027-2031 : ${S.fmt.signedEur(d3.sum(rows, (r) => r.gf_ecart_plan_2027_2031))}`, `${rows.length} gemeenten · gecumuleerd verschil 2027-2031: ${S.fmt.signedEur(d3.sum(rows, (r) => r.gf_ecart_plan_2027_2031))}`);
    const { key, dir } = S.state.gfsort;
    rows.sort((a, b) => (key === 'commune' ? S.name(a).localeCompare(S.name(b), S.lang) : (a[key] ?? 0) - (b[key] ?? 0)) * dir);
    document.querySelectorAll('#gf-table th').forEach((th) => { const b = th.querySelector('button'); th.removeAttribute('aria-sort'); if (b && b.dataset.sort === key) th.setAttribute('aria-sort', dir > 0 ? 'ascending' : 'descending'); });
    const td = (t, cls, bad) => { const e = document.createElement('td'); e.textContent = t; if (cls) e.className = cls; if (bad) e.style.color = 'var(--color-bad)'; return e; };
    tbl.replaceChildren(...rows.map((r) => {
      const tr = document.createElement('tr'); tr.dataset.key = r.nis; if (r.nis === S.state.gfnis) tr.className = 'sel';
      tr.append(td(S.name(r)), td(S.fmt.n0(r.population), 'num hide-n'), td(S.fmt.signedEur(r.gf_ecart_plan_2027_2031), 'num'), td(S.fmt.signedEur(r.gf_ecart_plan_2027_2031_hab), 'num'),
        td(S.fmt.signedEur(r.afm_2031), 'num hide-n', r.afm_2031 < 0), td(S.fmt.signedEur(r.afm_2031_apres), 'num', r.afm_2031_apres < 0),
        td(S.fmt.signedEur(r.bbr_2031), 'num hide-n', r.bbr_2031 < 0), td(S.fmt.signedEur(r.bbr_2031_apres), 'num', r.bbr_2031_apres < 0));
      return tr;
    }));
    // one municipality, 2026-2031
    const fl = S.rows.filter((r) => r.region === 'Flandre');
    if (!glist.options.length || glist.dataset.lang !== S.lang) { glist.dataset.lang = S.lang; glist.replaceChildren(...fl.slice().sort((a, b) => S.name(a).localeCompare(S.name(b), S.lang)).map((r) => new Option(S.name(r)))); }
    const c = S.byNis.get(S.state.gfnis) || fl[0];
    if (!c) return;
    if (document.activeElement !== gin) gin.value = S.name(c);
    const pl = dash.data('pluriannuel');
    const gb = document.getElementById('gf-c-gf'), cb = document.getElementById('gf-c-norms');
    if (pl.status === 'error') { S.failed(gb); S.failed(cb); return; }
    if (pl.status !== 'ok') return;
    const mine = new Map(pl.data.filter((x) => String(x.nis) === c.nis).map((x) => [Number(x.annee), x]));
    const v = (k) => YEARS.map((yr) => (mine.get(yr) ? Number(mine.get(yr)[k]) : null));
    S.lineChart(gb, [
      { name: L('Prévu dans le plan', 'Gepland in het plan'), color: dash.colors[0], values: v('gf_plan') },
      { name: L('Officiel après réduction', 'Officieel na inkrimping'), color: 'var(--cds-chart-status-critical)', values: v('gf_officieel') },
      { name: L('Avec 3,5 % de croissance', 'Met 3,5 % groei'), color: 'var(--cds-chart-muted)', values: v('gf_35'), dash: true },
    ], document.getElementById('gf-c-gf-leg'), (x) => S.fmt.eurc(x));
    S.lineChart(cb, [
      { name: L('AFM du plan', 'AFM van het plan'), color: dash.colors[0], values: v('afm') },
      { name: L('AFM après réduction', 'AFM na inkrimping'), color: 'var(--cds-chart-status-critical)', values: v('afm_apres') },
      { name: L('BBR du plan', 'BBR van het plan'), color: dash.colors[2], values: v('bbr'), dash: true },
      { name: L('BBR après réduction', 'BBR na inkrimping'), color: dash.colors[3], values: v('bbr_apres'), dash: true },
    ], document.getElementById('gf-c-norms-leg'), (x) => S.fmt.eurc(x));
    const head = document.getElementById('gf-c-head');
    const th = (t, cls) => { const e = document.createElement('th'); e.textContent = t; if (cls) e.className = cls; return e; };
    head.replaceChildren(th(S.name(c)), ...YEARS.map((yr) => th(String(yr), 'num')));
    const lines = [
      [L('Gemeentefonds prévu (plan)', 'Gemeentefonds gepland (plan)'), 'gf_plan'],
      [L('Gemeentefonds officiel', 'Gemeentefonds officieel'), 'gf_officieel'],
      [L('dont compensation Elia', 'waarvan Elia-compensatie'), 'gf_elia'],
      [L('Écart officiel − plan', 'Verschil officieel − plan'), 'gf_ecart_plan', true],
      [L('Écart cumulé', 'Gecumuleerd verschil'), 'gf_ecart_plan_cumule', true],
      [L('AFM du plan', 'AFM van het plan'), 'afm', true],
      [L('AFM après réduction', 'AFM na inkrimping'), 'afm_apres', true],
      [L('BBR du plan', 'BBR van het plan'), 'bbr', true],
      [L('BBR après réduction', 'BBR na inkrimping'), 'bbr_apres', true],
      [L('Dépenses d\'investissement', 'Investeringsuitgaven'), 'inv_uitgaven'],
      [L('Nouveaux emprunts', 'Nieuwe leningen'), 'nieuwe_leningen'],
      [L('Remboursements d\'emprunts', 'Aflossingen'), 'aflossingen'],
      [L('Intérêts', 'Intresten'), 'interesten'],
      [L('Taux additionnel IPP (APB, %)', 'Aanslagvoet APB (%)'), 'aanslagvoet_apb', false, true],
      [L('Centimes additionnels OOV', 'Opcentiemen OOV'), 'aanslagvoet_oov', false, true],
    ];
    document.querySelector('#gf-c-table tbody').replaceChildren(...lines.map(([lab, k, signed, plain]) => {
      const tr = document.createElement('tr'); tr.style.cursor = 'default';
      const c0 = document.createElement('td'); c0.textContent = lab; tr.appendChild(c0);
      v(k).forEach((val) => {
        const e = document.createElement('td'); e.className = 'num';
        e.textContent = val == null ? '—' : plain ? S.fmt.n2(val) : signed ? S.fmt.signedEur(val) : S.fmt.eurc(val);
        if (signed && val < 0 && (k === 'afm_apres' || k === 'bbr_apres' || k === 'afm' || k === 'bbr')) e.style.color = 'var(--color-bad)';
        tr.appendChild(e);
      });
      return tr;
    }));
  };
})();
