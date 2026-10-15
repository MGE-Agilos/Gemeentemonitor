/* Cockpit communal — application statique (données dans data/, construites par scripts/build_platform.py). */
"use strict";

const T = {
  fr: {
    titre: "Cockpit communal", chercher: "Chercher une commune…", comparer_a: "Comparer à",
    cockpit: "Cockpit", domaines: "Domaines", benchmark: "Benchmark", pst: "PST / plan pluriannuel",
    simulateurs: "Simulateurs", donnees: "Données & sources",
    pairs_region: "Toutes les communes de la région", pairs_taille: "Communes de même taille", pairs_profil: "Même profil socio-économique (Belfius)",
    pairs_prov: "Communes de la province",
    habitants: "habitants", province: "Province", profil: "Profil", taille: "Taille",
    points_attention: "Points d'attention", atouts: "Atouts", favorable: "favorable", a_surveiller: "à surveiller",
    dans_moyenne: "dans la moyenne", descriptif: "descriptif", pairs: "pairs", mediane_pairs: "Médiane des pairs",
    tout_voir: "Tout voir", aucune_donnee: "Pas encore de donnée pour cette commune.",
    rang: "Rang", sur: "sur", percentile: "Percentile", evolution: "Évolution", carte: "Carte",
    distribution: "Position parmi les pairs", classement: "Classement des pairs", valeur: "Valeur", annee: "Année",
    source: "Source", definition: "Définition", commune: "Commune", filtrer: "Filtrer les indicateurs…",
    ecart_mediane: "Écart à la médiane", statut: "Statut", exporter: "Exporter CSV", ecart_iq: "Écart interquartile des pairs",
    vue_region: "Région", vue_belgique: "Belgique",
    plus_haut_mieux: "plus haut = favorable", plus_bas_mieux: "plus bas = favorable",
    accueil_intro: "Choisissez une commune pour ouvrir son cockpit : chaque domaine de la gestion communale, situé par rapport aux communes comparables.",
    sources_obtenues: "sources", indicateurs: "indicateurs", communes: "communes",
  },
  nl: {
    titre: "Gemeentelijke cockpit", chercher: "Zoek een gemeente…", comparer_a: "Vergelijken met",
    cockpit: "Cockpit", domaines: "Domeinen", benchmark: "Benchmark", pst: "Meerjarenplan / PST",
    simulateurs: "Simulaties", donnees: "Data & bronnen",
    pairs_region: "Alle gemeenten van het gewest", pairs_taille: "Gemeenten van dezelfde grootte", pairs_profil: "Zelfde sociaaleconomisch profiel (Belfius)",
    pairs_prov: "Gemeenten van de provincie",
    habitants: "inwoners", province: "Provincie", profil: "Profiel", taille: "Grootte",
    points_attention: "Aandachtspunten", atouts: "Sterktes", favorable: "gunstig", a_surveiller: "op te volgen",
    dans_moyenne: "gemiddeld", descriptif: "beschrijvend", pairs: "vergelijkbare gemeenten", mediane_pairs: "Mediaan vergelijkbare gemeenten",
    tout_voir: "Alles bekijken", aucune_donnee: "Nog geen gegevens voor deze gemeente.",
    rang: "Rang", sur: "op", percentile: "Percentiel", evolution: "Evolutie", carte: "Kaart",
    distribution: "Positie tegenover vergelijkbare gemeenten", classement: "Rangschikking", valeur: "Waarde", annee: "Jaar",
    source: "Bron", definition: "Definitie", commune: "Gemeente", filtrer: "Indicatoren filteren…",
    ecart_mediane: "Verschil met mediaan", statut: "Status", exporter: "CSV exporteren", ecart_iq: "Interkwartielbereik",
    vue_region: "Gewest", vue_belgique: "België",
    plus_haut_mieux: "hoger = gunstig", plus_bas_mieux: "lager = gunstig",
    accueil_intro: "Kies een gemeente om haar cockpit te openen: elk beleidsdomein, afgezet tegen vergelijkbare gemeenten.",
    sources_obtenues: "bronnen", indicateurs: "indicatoren", communes: "gemeenten",
  },
};
const ANNEE_COURANTE = 2026;
const REG_NL = { Flandre: "Vlaanderen", Wallonie: "Wallonië", Bruxelles: "Brussel" };

const S = {
  lang: localStorage.getItem("cc_lang") || "fr",
  pairs: localStorage.getItem("cc_pairs") || "taille",
  meta: null, communes: [], byNis: {}, ind: {}, dom: {}, cache: {}, geo: null,
};
const t = (k) => (T[S.lang] && T[S.lang][k]) || T.fr[k] || k;
const lbl = (o) => (S.lang === "nl" ? o.nl || o.fr : o.fr);
const nomC = (c) => (S.lang === "nl" ? c.nl : c.fr) || c.fr;
const regL = (r) => (S.lang === "nl" ? REG_NL[r] || r : r);
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

function fmt(v, unite) {
  if (v == null || Number.isNaN(v)) return "–";
  const a = Math.abs(v);
  const d = a >= 1000 ? 0 : a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : 3;
  const s = v.toLocaleString(S.lang === "nl" ? "nl-BE" : "fr-BE", { maximumFractionDigits: d });
  return unite ? `${s} ${unite}` : s;
}
const fmtU = (v, ind) => (/^(0\/1|oui\/non|booléen|boolean)$/i.test((ind.unite || "").trim()) && v != null
  ? (v >= 0.5 ? (S.lang === "nl" ? "ja" : "oui") : (S.lang === "nl" ? "nee" : "non"))
  : fmt(v, uniteCourte(ind.unite)));
function uniteCourte(u) {
  if (!u) return "";
  if (/^(habitants?|nombre|n|count|aantal|unités?)$/i.test(u.trim())) return "";
  if (/^(nombre|aantal) \/ 1 000 hab\.$/i.test(u.trim())) return "/ 1 000 hab.";
  return u;
}

/* ---------- Données ---------- */
async function getJSON(p) {
  const r = await fetch(p);
  if (!r.ok) throw new Error(p + " " + r.status);
  return r.json();
}
async function loadDomain(d) {
  if (!S.cache[d]) S.cache[d] = getJSON(`data/d_${d}.json`).catch(() => ({}));
  return S.cache[d];
}
/** Série d'un indicateur : résumé (3 dernières années) par défaut, série complète si `full`. */
async function series(indId, full = false) {
  const ind = S.ind[indId];
  if (!ind) return null;
  if (full) {
    const k = "i:" + indId;
    if (!S.cache[k]) S.cache[k] = getJSON(`data/i/${ind.f}.json`).catch(() => null);
    return S.cache[k];
  }
  const d = await loadDomain(ind.domaine);
  return d[indId] || null;
}

/** Groupe de pairs d'une commune selon le mode choisi (toujours dans la même région). */
function peers(nis, mode = S.pairs) {
  const c = S.byNis[nis];
  return S.communes.filter((x) => x.region === c.region &&
    (mode === "region" || (mode === "taille" && x.taille === c.taille) ||
      (mode === "profil" && x.profil === c.profil) || (mode === "prov" && x.province === c.province)));
}

/** Année de référence : la plus récente où au moins la moitié des pairs couverts a une valeur. */
function refYear(s, peerNis) {
  // Les années futures (projections) ne servent de référence que pour un indicateur purement prospectif.
  let n = s.annees.length;
  while (n > 1 && s.annees[n - 1] > ANNEE_COURANTE && s.annees[0] <= ANNEE_COURANTE) n--;
  const counts = s.annees.slice(0, n).map((_, i) => peerNis.reduce((a, p) => a + (s.v[p] && s.v[p][i] != null ? 1 : 0), 0));
  const max = Math.max(...counts);
  if (max === 0) return -1;
  for (let i = n - 1; i >= 0; i--) if (counts[i] >= max * 0.5) return i;
  return n - 1;
}

/** Statistiques d'une commune pour un indicateur parmi ses pairs. */
function stats(s, ind, nis, peerList) {
  const peerNis = peerList.map((p) => p.nis);
  let yi = refYear(s, peerNis);
  if (yi < 0) return null;
  let me = s.v[nis] ? s.v[nis][yi] : null;
  // Si la commune n'a pas de valeur l'année de référence, on prend sa dernière valeur disponible.
  if (me == null && s.v[nis]) {
    for (let i = s.annees.length - 1; i >= 0; i--) if (s.v[nis][i] != null) { me = s.v[nis][i]; yi = i; break; }
  }
  const vals = peerNis.map((p) => (s.v[p] ? s.v[p][yi] : null)).filter((x) => x != null).sort((a, b) => a - b);
  if (!vals.length) return null;
  const q = (p) => d3.quantileSorted(vals, p);
  let pct = null, rank = null, score = null, statut = "na";
  if (me != null) {
    const below = vals.filter((x) => x < me).length, eq = vals.filter((x) => x === me).length;
    pct = (below + eq / 2) / vals.length;
    rank = ind.sens === -1 ? below + 1 : vals.length - below - eq + 1;
    if (ind.sens) {
      score = ind.sens === 1 ? pct : 1 - pct;
      statut = score >= 0.75 ? "good" : score <= 0.25 ? "bad" : "mid";
    } else statut = "desc";
  }
  return { annee: s.annees[yi], yi, me, vals, n: vals.length, min: vals[0], max: vals[vals.length - 1],
    q1: q(0.25), med: q(0.5), q3: q(0.75), pct, rank, score, statut };
}

/* ---------- Icônes et petits composants ---------- */
const ICON = {
  good: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>',
  bad: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M12 8v5M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>',
  mid: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M6 12h12"/></svg>',
};
function chip(st) {
  if (!st || st.statut === "na") return "";
  if (st.statut === "good") return `<span class="chip good">${ICON.good}${t("favorable")}</span>`;
  if (st.statut === "bad") return `<span class="chip bad">${ICON.bad}${t("a_surveiller")}</span>`;
  if (st.statut === "mid") return `<span class="chip">${ICON.mid}${t("dans_moyenne")}</span>`;
  return `<span class="chip">P${Math.round(st.pct * 100)}</span>`;
}
function gauge(st, ind) {
  if (!st || st.me == null) return "";
  const lo = st.vals[Math.floor(st.n * 0.02)] ?? st.min, hi = st.vals[Math.ceil(st.n * 0.98) - 1] ?? st.max;
  const span = hi - lo || 1;
  const x = (v) => Math.max(0, Math.min(100, ((v - lo) / span) * 100));
  const title = `${t("mediane_pairs")} : ${fmtU(st.med, ind)} · ${t("ecart_iq")} : ${fmtU(st.q1, ind)} – ${fmtU(st.q3, ind)}`;
  return `<div class="gauge" title="${esc(title)}"><div class="track"></div>
    <div class="iqr" style="left:${x(st.q1)}%;width:${Math.max(1, x(st.q3) - x(st.q1))}%"></div>
    <div class="med" style="left:${x(st.med)}%"></div><div class="me" style="left:${x(st.me)}%"></div></div>`;
}

const tip = {
  el: null,
  show(html, ev) {
    this.el = this.el || $("#tip");
    this.el.innerHTML = html;
    this.el.classList.remove("hidden");
    this.move(ev);
  },
  move(ev) {
    if (!this.el) return;
    const w = this.el.offsetWidth, h = this.el.offsetHeight;
    let x = ev.clientX + 14, y = ev.clientY + 14;
    if (x + w > innerWidth - 8) x = ev.clientX - w - 14;
    if (y + h > innerHeight - 8) y = ev.clientY - h - 14;
    this.el.style.left = x + "px"; this.el.style.top = y + "px";
  },
  hide() { this.el && this.el.classList.add("hidden"); },
};

/* ---------- Navigation ---------- */
function route() {
  const h = location.hash.replace(/^#\/?/, "").split("/").map(decodeURIComponent);
  return { nis: h[0] && S.byNis[h[0]] ? h[0] : null, view: h[1] || "cockpit", a: h[2], b: h[3] };
}
function go(nis, view = "cockpit", a, b) {
  location.hash = "#/" + [nis, view, a, b].filter((x) => x != null && x !== "").map(encodeURIComponent).join("/");
}
function lastNis() {
  const n = localStorage.getItem("cc_nis");
  return n && S.byNis[n] ? n : null;
}

function renderTabs(r) {
  const nis = r.nis || lastNis();
  const items = [["cockpit", t("cockpit")], ["defis", S.lang === "nl" ? "Uitdagingen" : "Défis"], ["domaine", t("domaines")], ["benchmark", t("benchmark")],
    ["pst", t("pst")], ["simulateurs", t("simulateurs")], ["donnees", t("donnees")]];
  $("#tabs").innerHTML = items.map(([v, l]) => {
    const href = v === "donnees" ? `#/${nis || "-"}/donnees` : nis ? `#/${nis}/${v}` : "#/";
    return `<a href="${href}" class="${r.view === v ? "on" : ""}">${esc(l)}</a>`;
  }).join("");
}

async function render() {
  const r = route();
  renderTabs(r);
  document.documentElement.lang = S.lang;
  document.querySelectorAll("[data-t]").forEach((el) => (el.textContent = t(el.dataset.t)));
  document.querySelectorAll("[data-tp]").forEach((el) => (el.placeholder = t(el.dataset.tp)));
  tip.hide();
  const app = $("#app");
  if (r.view === "donnees") return viewDonnees(app, r);
  if (!r.nis) return viewAccueil(app);
  localStorage.setItem("cc_nis", r.nis);
  $("#q").value = nomC(S.byNis[r.nis]);
  if (r.view === "domaine") return viewDomaine(app, r.nis, r.a || S.meta.domaines.find((d) => d.n)?.id, r.b);
  if (r.view === "benchmark") return viewBenchmark(app, r.nis, r.a);
  if (r.view === "pst") return viewPST(app, r.nis);
  if (r.view === "defis") return viewDefis(app, r.nis, r.a);
  if (r.view === "simulateurs") return viewSim(app, r.nis);
  return viewCockpit(app, r.nis);
}

/* ---------- Accueil ---------- */
const FEATURES = [
  { fr: ["Cockpit", "Chaque domaine de la gestion communale en un coup d'œil, avec la position de la commune parmi des communes comparables et ses points d'attention."],
    nl: ["Cockpit", "Elk beleidsdomein in één oogopslag, met de positie van de gemeente tegenover vergelijkbare gemeenten en haar aandachtspunten."] },
  { fr: ["Défis", "Vieillissement, pauvreté, logement, climat, finances, écoles, sécurité… : les grands enjeux des communes belges, éclairés par les données de la commune."],
    nl: ["Uitdagingen", "Vergrijzing, armoede, wonen, klimaat, financiën, scholen, veiligheid…: de grote uitdagingen, belicht met de gegevens van de gemeente."] },
  { fr: ["PST / plan pluriannuel", "Objectifs stratégiques, opérationnels et actions reliés aux indicateurs : point de départ, cible, suivi automatique. Proposition générée à partir des points d'attention."],
    nl: ["Meerjarenplan / PST", "Doelstellingen, actieplannen en acties gekoppeld aan indicatoren: startwaarde, doel en automatische opvolging."] },
  { fr: ["Benchmark", "Comparaison avec les communes de même taille, de même profil socio-économique (typologie Belfius) ou de la même province, toujours au sein de la région."],
    nl: ["Benchmark", "Vergelijking met gemeenten van dezelfde grootte, hetzelfde sociaaleconomisch profiel (Belfius) of dezelfde provincie, steeds binnen het gewest."] },
  { fr: ["Simulateurs", "Impact d'un changement de taux de l'additionnel IPP ou des centimes additionnels au précompte immobilier, à partir du rendement réel d'un point."],
    nl: ["Simulaties", "Impact van een tariefwijziging van de aanvullende personenbelasting of de opcentiemen, op basis van de werkelijke opbrengst van een punt."] },
  { fr: ["Données ouvertes", "Statbel, IWEPS, Statistiek Vlaanderen, IBSA, SPP Intégration sociale, AIM, Fluvius, ORES, IRCEL, police… : sources citées, couverture et données encore à demander."],
    nl: ["Open data", "Statbel, IWEPS, Statistiek Vlaanderen, BISA, POD MI, IMA, Fluvius, ORES, IRCEL, politie…: bronnen, dekking en nog op te vragen gegevens."] },
];

function viewAccueil(app) {
  const m = S.meta;
  // Retour à l'accueil : plus aucune commune sélectionnée.
  try { localStorage.removeItem("cc_nis"); } catch { /* stockage indisponible */ }
  renderTabs(route());
  const nSrc = m.sources.length, nInd = m.indicateurs.length;
  app.innerHTML = `<div class="card" style="max-width:820px;margin:40px auto">
    <h1>${esc(t("titre"))}</h1>
    <p class="secondary">${esc(t("accueil_intro"))}</p>
    <div class="row" style="margin:18px 0">
      <div class="fact"><div class="v num">${S.communes.length}</div><div class="l">${t("communes")}</div></div>
      <div class="fact"><div class="v num">${nInd}</div><div class="l">${t("indicateurs")}</div></div>
      <div class="fact"><div class="v num">${nSrc}</div><div class="l">${t("sources_obtenues")}</div></div>
    </div>
    <div class="row" id="exemples"></div></div>
    <div class="grid g-tiles" style="max-width:1100px;margin:0 auto">${FEATURES.map((f) => `<div class="card"><h3>${esc(f[S.lang][0])}</h3><p class="secondary" style="margin:6px 0 0;font-size:13px">${esc(f[S.lang][1])}</p></div>`).join("")}</div>`;
  const ex = ["21004", "62063", "44021", "92094", "25072", "71072", "57081", "11002"].filter((n) => S.byNis[n]);
  $("#exemples").innerHTML = ex.map((n) => `<a class="btn" href="#/${n}/cockpit">${esc(nomC(S.byNis[n]))}</a>`).join("");
  $("#q").value = "";
  $("#q").focus();
}

/* ---------- Modules liés ---------- */
const MODULES = [
  { fr: "Budgets 2026 et simulation", nl: "Begrotingen 2026 en simulatie", url: "https://mge-agilos.github.io/BudgetsCommunaux2026/",
    desc_fr: "Comparatif détaillé des budgets 2026 des 565 communes", desc_nl: "Gedetailleerde vergelijking van de begrotingen 2026" },
  { fr: "Mobilité : simulateur de trafic", nl: "Mobiliteit: verkeerssimulator", url: "https://mge-agilos.github.io/RouteOptimization/",
    desc_fr: "Impact de travaux et fermetures de voiries sur le trafic", desc_nl: "Impact van werken en wegafsluitingen op het verkeer",
    communes: ["25121", "25091", "25119", "25112", "25023", "25068"] },
];

/* ---------- Cockpit ---------- */
function tileIndicators(dom, nis) {
  const c = S.byNis[nis];
  const inds = S.meta.indicateurs.filter((i) => i.domaine === dom && (i.couverture[c.region] || 0) > 0);
  const keys = inds.filter((i) => i.cle_tuile);
  if (keys.length) return keys;
  // À défaut de sélection éditoriale : indicateurs orientés et bien couverts d'abord, en écartant
  // les comptages bruts qui ont une version rapportée à la population.
  const derived = new Set(inds.filter((i) => i.derive_de).map((i) => i.derive_de));
  return inds.filter((i) => !derived.has(i.id)).sort((a, b) => (Math.abs(b.sens) - Math.abs(a.sens)) || ((b.couverture[c.region] || 0) - (a.couverture[c.region] || 0))).slice(0, 5);
}

async function evalDomain(dom, nis, list) {
  const pl = peers(nis);
  const out = [];
  for (const ind of list) {
    const s = await series(ind.id);
    if (!s) continue;
    const st = stats(s, ind, nis, pl);
    if (st && st.me != null) out.push({ ind, st, s });
  }
  return out;
}

async function viewCockpit(app, nis) {
  const c = S.byNis[nis];
  const pl = peers(nis);
  const prof = S.meta.profils[`${c.region}|${c.profil}`];
  app.innerHTML = `<div class="hero">
      <div><div class="muted">${esc(regL(c.region))} · ${esc(S.lang === "nl" ? c.province_nl : c.province)}</div><h1>${esc(nomC(c))}</h1></div>
      <div class="facts">
        <div class="fact"><div class="v num">${fmt(c.pop)}</div><div class="l">${t("habitants")}</div></div>
        <div class="fact"><div class="v">${esc(prof ? prof[S.lang] : "–")}</div><div class="l">${t("profil")}</div></div>
        <div class="fact"><div class="v num">${pl.length}</div><div class="l">${t("pairs")} · ${esc($("#pairs").selectedOptions[0]?.text || "")}</div></div>
      </div></div>
    <div class="alerts"><div class="card"><h2>${t("points_attention")}</h2><ul id="al-bad"><li class="muted">…</li></ul></div>
      <div class="card"><h2>${t("atouts")}</h2><ul id="al-good"><li class="muted">…</li></ul></div></div>
    <div class="grid g-tiles" id="tiles"></div>
    <div class="card" style="margin-top:14px"><h2>${S.lang === "nl" ? "Gespecialiseerde modules" : "Modules spécialisés"}</h2>
      <div class="row" style="margin-top:10px">${MODULES.filter((m) => !m.communes || m.communes.includes(nis)).map((m) =>
        `<a class="btn" href="${m.url}" target="_blank" rel="noopener" title="${esc(m[S.lang === "nl" ? "desc_nl" : "desc_fr"])}">${esc(lbl(m))} ↗</a>`).join("")}</div>
      <p class="note">${S.lang === "nl" ? "Diepgaande analyses die buiten de cockpit draaien: begrotingen 2026 in detail en verkeerssimulatie." : "Analyses approfondies hors du cockpit : budgets 2026 au niveau de l'article et simulation du trafic."}</p></div>`;
  const tiles = $("#tiles");
  const doms = S.meta.domaines.filter((d) => d.n > 0 && !d.lourd);
  tiles.innerHTML = doms.map((d) => `<div class="card tile" id="tile-${d.id}"><h2>${esc(lbl(d))}<a href="#/${nis}/domaine/${d.id}">${t("tout_voir")} →</a></h2><div class="empty">…</div></div>`).join("");
  const all = [];
  await Promise.all(doms.map(async (d) => {
    const list = tileIndicators(d.id, nis);
    const res = await evalDomain(d.id, nis, list);
    const el = $(`#tile-${d.id}`);
    if (!el) return;
    el.querySelector(".empty")?.remove();
    if (!res.length) el.insertAdjacentHTML("beforeend", `<div class="empty">${t("aucune_donnee")}</div>`);
    for (const { ind, st } of res) {
      el.insertAdjacentHTML("beforeend", `<div class="kpi" data-i="${esc(ind.id)}" data-d="${d.id}">
        <div class="lbl">${esc(lbl(ind))} <span class="muted">· ${st.annee}</span></div>
        <div class="val num">${fmtU(st.me, ind)}</div>
        <div class="gauge-wrap" style="grid-column:1/-1;display:flex;gap:10px;align-items:center"><div style="flex:1">${gauge(st, ind)}</div>${chip(st)}</div></div>`);
    }
    // Points d'attention : on évalue tous les indicateurs orientés du domaine.
    // Seulement les indicateurs retenus par la curation (tuiles et défis) : les sous-séries restent dans la vue domaine.
    const oriented = S.meta.indicateurs.filter((i) => i.domaine === d.id && i.sens && (i.cle_tuile || (i.defis || []).length) && (i.couverture[c.region] || 0) >= 10);
    for (const x of await evalDomain(d.id, nis, oriented)) all.push(x);
  }));
  tiles.querySelectorAll(".kpi").forEach((k) => k.addEventListener("click", () => go(nis, "domaine", k.dataset.d, k.dataset.i)));
  const li = (x) => `<li data-i="${esc(x.ind.id)}" data-d="${x.ind.domaine}"><span class="lbl">${esc(lbl(x.ind))}</span>
    <span class="num secondary" style="white-space:nowrap">${fmtU(x.st.me, x.ind)} · ${t("rang")} ${x.st.rank}/${x.st.n}</span></li>`;
  const uniq = (arr) => { const seen = new Set(); return arr.filter((x) => { const k = x.ind.derive_de || x.ind.id; if (seen.has(k)) return false; seen.add(k); return true; }); };
  const bad = uniq(all.filter((x) => x.st.statut === "bad").sort((a, b) => a.st.score - b.st.score)).slice(0, 8);
  const good = uniq(all.filter((x) => x.st.statut === "good").sort((a, b) => b.st.score - a.st.score)).slice(0, 8);
  $("#al-bad").innerHTML = bad.map(li).join("") || `<li class="muted">–</li>`;
  $("#al-good").innerHTML = good.map(li).join("") || `<li class="muted">–</li>`;
  app.querySelectorAll(".alerts li[data-i]").forEach((k) => k.addEventListener("click", () => go(nis, "domaine", k.dataset.d, k.dataset.i)));
}

/* ---------- Domaine ---------- */
async function viewDomaine(app, nis, dom, indId) {
  const c = S.byNis[nis];
  const inds = S.meta.indicateurs.filter((i) => i.domaine === dom && (i.couverture[c.region] || 0) > 0);
  const others = S.meta.indicateurs.filter((i) => i.domaine === dom && !(i.couverture[c.region] || 0));
  if (!indId || !S.ind[indId]) indId = (tileIndicators(dom, nis)[0] || inds[0] || others[0] || {}).id;
  const domSel = `<select id="domsel">${S.meta.domaines.filter((d) => d.n).map((d) => `<option value="${d.id}" ${d.id === dom ? "selected" : ""}>${esc(lbl(d))}</option>`).join("")}</select>`;
  app.innerHTML = `<div class="row between" style="margin-bottom:14px"><h1>${esc(nomC(c))}</h1>${domSel}</div>
    <div class="dom-layout"><div class="card ind-list"><input id="filt" placeholder="${esc(t("filtrer"))}"><div id="ilist"></div></div>
    <div class="dom-main" id="dmain"></div></div>`;
  $("#domsel").onchange = (e) => go(nis, "domaine", e.target.value);
  const pl = peers(nis);
  const groups = {};
  for (const i of inds) (groups[i.theme || i.dossier] = groups[i.theme || i.dossier] || []).push(i);
  const dots = {};
  const drawList = () => {
    const f = $("#filt").value.toLowerCase();
    $("#ilist").innerHTML = Object.entries(groups).map(([g, arr]) => {
      const items = arr.filter((i) => !f || lbl(i).toLowerCase().includes(f));
      if (!items.length) return "";
      return `<div class="grp">${esc(g.replace(/_/g, " "))}</div>` + items.map((i) =>
        `<a href="#/${nis}/domaine/${dom}/${encodeURIComponent(i.id)}" class="${i.id === indId ? "on" : ""}"><span class="dot ${dots[i.id] || ""}"></span>${esc(lbl(i))}</a>`).join("");
    }).join("") + (others.length ? `<div class="grp">${S.lang === "nl" ? "Niet beschikbaar in dit gewest" : "Non disponibles dans cette région"} (${others.length})</div>` : "");
  };
  $("#filt").oninput = drawList;
  drawList();
  // Pastilles de statut (asynchrone, sans bloquer) ; pas pour les domaines volumineux.
  if (!S.meta.domaines.find((d) => d.id === dom)?.lourd) evalDomain(dom, nis, inds).then((res) => { res.forEach((x) => (dots[x.ind.id] = x.st.statut === "good" ? "good" : x.st.statut === "bad" ? "bad" : "")); drawList(); });
  if (indId) await drawIndicator($("#dmain"), nis, S.ind[indId], pl);
  if (dom === "securite") zonesPanel($("#dmain"), nis);
  if (dom === "gouvernance") gouvPanel($("#dmain"), nis);
  const on = $("#ilist .on"), il = $(".ind-list");
  if (on && il && (on.offsetTop > il.scrollTop + il.clientHeight || on.offsetTop < il.scrollTop)) il.scrollTop = on.offsetTop - 60;
}

async function drawIndicator(el, nis, ind, pl) {
  const c = S.byNis[nis];
  const s = await series(ind.id, true);
  if (!s) { el.innerHTML = `<div class="card">${t("aucune_donnee")}</div>`; return; }
  const st = stats(s, ind, nis, pl);
  const src = S.meta.sources.find((x) => x.source_id === ind.source && x.dossier === ind.dossier) || S.meta.sources.find((x) => x.source_id === ind.source);
  const sens = ind.sens === 1 ? t("plus_haut_mieux") : ind.sens === -1 ? t("plus_bas_mieux") : t("descriptif");
  el.innerHTML = `<div class="card"><div class="headline">
      <div><div class="muted">${esc(lbl(ind))}${st ? " · " + st.annee : ""}</div><div class="big num">${st ? fmtU(st.me, ind) : "–"}</div></div>
      ${st && st.me != null ? `<div class="fact"><div class="v num">${st.rank} <span class="muted" style="font-size:13px">${t("sur")} ${st.n}</span></div><div class="l">${t("rang")} (${sens})</div></div>
      <div class="fact"><div class="v num">${fmtU(st.med, ind)}</div><div class="l">${t("mediane_pairs")}</div></div>
      <div>${chip(st)}</div>` : `<div class="muted">${t("aucune_donnee")}</div>`}
    </div>
    ${ind.def && ind.def !== lbl(ind) + "." ? `<p class="secondary" style="margin:10px 0 0">${esc(ind.def)}</p>` : ""}
    <div class="note">${t("source")} : ${src ? `${src.url ? `<a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.organisme || src.source_id)}</a>` : esc(src.organisme || src.source_id)} — ${esc(src.titre || "")}` : esc(ind.source || "–")} · ${t("annee")} : ${ind.annees[0]}${ind.annees.length > 1 ? "–" + ind.annees[ind.annees.length - 1] : ""}</div></div>
    <div class="charts">
      <div class="card"><div class="chart-title"><span>${t("carte")}</span><span class="row" style="gap:6px"><button class="btn small" data-v="region">${t("vue_region")}</button><button class="btn small" data-v="be">${t("vue_belgique")}</button></span></div><div id="map" class="map"></div><div id="maplegend" class="legend"></div></div>
      <div class="grid">
        <div class="card"><div class="chart-title"><span>${t("evolution")}</span><span class="legend"><span><i style="background:var(--series-1)"></i>${esc(nomC(c))}</span><span><i style="background:var(--peer)"></i>${t("mediane_pairs")}</span><span><i class="sq" style="background:var(--band)"></i>${t("ecart_iq")}</span></span></div><div id="line"></div></div>
        <div class="card"><div class="chart-title"><span>${t("distribution")}</span></div><div id="strip"></div></div>
      </div></div>
    <div class="card"><div class="chart-title"><span>${t("classement")}</span><button class="btn small" id="csv">${t("exporter")}</button></div><div class="table-wrap" id="rank"></div></div>`;
  let mapMode = "region";
  const drawMap = () => choropleth($("#map"), $("#maplegend"), s, ind, nis, mapMode, st ? st.yi : s.annees.length - 1);
  el.querySelectorAll("[data-v]").forEach((b) => (b.onclick = () => { mapMode = b.dataset.v; drawMap(); }));
  drawMap();
  lineChart($("#line"), s, ind, nis, pl);
  if (st) stripChart($("#strip"), s, ind, nis, pl, st);
  rankTable($("#rank"), s, ind, nis, pl, st);
}

/** Zones de police et de secours de la commune : clé de répartition des dotations entre communes. */
async function zonesPanel(el, nis) {
  if (!el) return;
  let Z;
  try { Z = S.cache.zones || (S.cache.zones = await getJSON("data/zones.json")); } catch { return; }
  const cz = Z.communes[nis];
  if (!cz || !el.isConnected) return;
  const nl = S.lang === "nl";
  const card = (typ) => {
    const z = Z.zones[`${typ}:${cz[typ]}`];
    if (!z) return "";
    const rows = z.communes.slice().sort((a, b) => (b.pop || 0) - (a.pop || 0));
    const cle = rows.some((r) => r.part_dot != null);
    const eff = z.effectifs || {};
    const EFF = { ops_cadre_organique: nl ? "Operationeel kader (organiek)" : "Cadre opérationnel (organique)", ops_cadre_reel: nl ? "operationeel (reëel)" : "opérationnel (réel)",
      calog_cadre_organique: nl ? "CALog (organiek)" : "CALog (organique)", calog_cadre_reel: nl ? "CALog (reëel)" : "CALog (réel)" };
    const effTxt = Object.keys(EFF).filter((k) => eff[k])
      .map((k) => `${EFF[k]} : <b class="num">${fmt(eff[k].v)}</b>`).join(" · ") + (Object.keys(EFF).some((k) => eff[k]) ? ` <span class="muted">(${(eff.ops_cadre_reel || Object.values(eff)[0]).annee})</span>` : "");
    return `<div class="card"><div class="chart-title"><span>${typ === "police" ? (nl ? "Politiezone" : "Zone de police") : (nl ? "Hulpverleningszone" : "Zone de secours")} : ${esc(z.nom)}</span>
      <span class="muted">${rows.length} ${t("communes")}</span></div>
      ${rows.length > 1 ? `<div class="table-wrap" style="max-height:none"><table><thead><tr><th>${t("commune")}</th><th class="r">${t("habitants")}</th><th class="r">${nl ? "Aandeel bevolking" : "Part population"}</th>
        ${cle ? `<th class="r">${nl ? "Dotatie 2026" : "Dotation 2026"}</th><th class="r">${nl ? "Aandeel dotatie" : "Part dotation"}</th><th class="r">€/hab.</th><th class="r" title="${nl ? "aandeel dotatie / aandeel bevolking" : "part de la dotation / part de la population"}">${nl ? "Index" : "Indice"}</th>` : ""}</tr></thead><tbody>${
        rows.map((r) => { const c = S.byNis[r.nis]; return `<tr class="${r.nis === nis ? "me" : ""}"><td>${esc(c ? nomC(c) : r.nis)}</td><td class="r num">${fmt(r.pop ?? c?.pop)}</td><td class="r num">${r.part_pop != null ? fmt(r.part_pop) + " %" : "–"}</td>
          ${cle ? `<td class="r num">${r.dotation != null ? fmt(r.dotation) + " €" : "–"}</td><td class="r num">${r.part_dot != null ? fmt(r.part_dot) + " %" : "–"}</td><td class="r num">${fmt(r.dot_hab)}</td><td class="r num">${r.indice != null ? fmt(r.indice) : "–"}</td>` : ""}</tr>`; }).join("")}</tbody></table></div>
        ${cle ? `<p class="note">${nl ? "Een index boven 1 betekent dat de gemeente een groter deel van de dotatie betaalt dan haar aandeel in de bevolking." : "Un indice supérieur à 1 signifie que la commune paie une part de la dotation plus grande que sa part de la population de la zone."}</p>` : `<p class="note">${nl ? "Verdeelsleutel niet beschikbaar voor deze zone." : "Clé de répartition non disponible pour cette zone (dotations non publiées en données ouvertes)."}</p>`}`
        : `<p class="secondary">${nl ? "Eengemeentezone." : "Zone monocommunale."}</p>`}
      ${effTxt ? `<p class="note">${effTxt}</p>` : ""}</div>`;
  };
  el.insertAdjacentHTML("afterbegin", card("police") + card("secours"));
}

/** Conseil communal 2024, collège et intercommunales de la commune. */
async function gouvPanel(el, nis) {
  if (!el) return;
  let G;
  try { G = S.cache.gouv || (S.cache.gouv = await getJSON("data/gouvernance.json")); } catch { return; }
  const g = G[nis];
  if (!g || !el.isConnected) return;
  const nl = S.lang === "nl";
  const tot = g.listes.reduce((a, x) => a + (x.s || 0), 0);
  const elus = g.listes.filter((x) => x.s);
  // Barre des sièges : une couleur par liste dans l'ordre fixe des séries, au-delà de 7 listes regroupées en « autres ».
  const cols = ["var(--series-1)", "var(--series-2)", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6"];
  const main = elus.slice(0, 7), autres = elus.slice(7).reduce((a, x) => a + x.s, 0);
  const seg = [...main.map((x, i) => ({ l: x.l, s: x.s, c: cols[i] })), ...(autres ? [{ l: nl ? "andere" : "autres", s: autres, c: "var(--peer)" }] : [])];
  const bar = tot ? `<div style="display:flex;gap:2px;height:18px;margin:10px 0 6px">${seg.map((x) => `<div title="${esc(x.l)} : ${x.s}" style="flex:${x.s};background:${x.c};border-radius:3px"></div>`).join("")}</div>
    <div class="legend">${seg.map((x) => `<span><i class="sq" style="background:${x.c}"></i>${esc(x.l)} · <b class="num">${x.s}</b></span>`).join("")}</div>` : "";
  const html = `<div class="card"><div class="chart-title"><span>${nl ? "Gemeenteraad 2024" : "Conseil communal 2024"}</span><span class="muted">${tot} ${nl ? "zetels" : "sièges"}</span></div>${bar}
      <div class="table-wrap" style="max-height:260px;margin-top:8px"><table><thead><tr><th>${nl ? "Lijst" : "Liste"}</th><th class="r">${nl ? "Stemmen" : "Voix"}</th><th class="r">${nl ? "Zetels" : "Sièges"}</th></tr></thead><tbody>${
        g.listes.map((x) => `<tr><td>${esc(x.l)}</td><td class="r num">${x.pv != null ? fmt(x.pv) + " %" : "–"}</td><td class="r num">${x.s ?? "–"}</td></tr>`).join("")}</tbody></table></div></div>
    ${g.college.length ? `<div class="card"><div class="chart-title"><span>${nl ? "College en mandatarissen" : "Collège et mandataires"}</span></div><div class="table-wrap" style="max-height:260px"><table><tbody>${
      g.college.map((x) => `<tr><td class="muted">${esc(x.f)}</td><td>${esc(x.n)}</td><td class="muted">${esc(x.l)}</td></tr>`).join("")}</tbody></table></div></div>` : ""}
    ${g.intercos.length ? `<div class="card"><div class="chart-title"><span>${nl ? "Intergemeentelijke samenwerking" : "Intercommunales et coopérations"}</span><span class="muted">${g.intercos.length}</span></div><div class="row" style="gap:6px">${
      g.intercos.map((x) => `<span class="chip" title="${esc(x.s)}">${esc(x.n)}</span>`).join("")}</div></div>` : ""}`;
  el.insertAdjacentHTML("afterbegin", html);
}

function choropleth(el, legendEl, s, ind, nis, mode, yi) {
  if (!el || !el.isConnected) return; // vue remplacée entre-temps
  const c = S.byNis[nis];
  const feats = S.geo.filter((g) => mode === "be" || S.byNis[g.nis]?.region === c.region);
  const w = el.clientWidth || 600;
  const fc = { type: "FeatureCollection", features: feats.map((g) => g.f) };
  const proj = d3.geoMercator().fitWidth(w, fc);
  const path = d3.geoPath(proj);
  const h = Math.ceil(path.bounds(fc)[1][1]) + 2;
  const val = (n) => (s.v[n] ? s.v[n][yi] : null);
  const vals = feats.map((g) => val(g.nis)).filter((v) => v != null).sort((a, b) => a - b);
  // Échelle séquentielle bleue en quantiles (7 classes) ; gris = pas de donnée.
  const ramp = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"];
  const qs = d3.scaleQuantile().domain(vals).range(ramp);
  const svg = d3.create("svg").attr("viewBox", `0 0 ${w} ${h}`).attr("width", "100%").attr("role", "img")
    .attr("aria-label", `${lbl(ind)} — ${t("carte")}`);
  svg.append("g").selectAll("path").data(feats).join("path")
    .attr("class", (g) => "c" + (g.nis === nis ? " sel" : ""))
    .attr("d", (g) => path(g.f))
    .attr("fill", (g) => { const v = val(g.nis); return v == null ? "var(--surface-2)" : qs(v); })
    .on("mousemove", (ev, g) => { const cc = S.byNis[g.nis]; tip.show(`<b>${esc(cc ? nomC(cc) : g.nis)}</b><br>${fmtU(val(g.nis), ind)}`, ev); })
    .on("mouseleave", () => tip.hide())
    .on("click", (ev, g) => go(g.nis, "domaine", ind.domaine, ind.id));
  svg.select("path.sel").raise();
  el.replaceChildren(svg.node());
  const th = qs.quantiles();
  legendEl.innerHTML = vals.length ? ramp.map((col, i) => `<span><i class="sq" style="background:${col}"></i>${i === 0 ? "< " + fmt(th[0]) : i === ramp.length - 1 ? "≥ " + fmt(th[i - 1]) : fmt(th[i - 1]) + " – " + fmt(th[i])}</span>`).join("") +
    `<span><i class="sq" style="background:var(--surface-2);border:1px solid var(--border)"></i>${S.lang === "nl" ? "geen gegevens" : "pas de donnée"}</span>` : "";
}

function lineChart(el, s, ind, nis, pl) {
  if (!el || !el.isConnected) return; // vue remplacée entre-temps
  const yrs = s.annees;
  if (yrs.length < 2) { el.innerHTML = `<div class="empty">${S.lang === "nl" ? "Eén enkel jaar beschikbaar." : "Une seule année disponible."}</div>`; return; }
  const peerNis = pl.map((p) => p.nis);
  const pts = yrs.map((y, i) => {
    const v = peerNis.map((p) => (s.v[p] ? s.v[p][i] : null)).filter((x) => x != null).sort((a, b) => a - b);
    return { y, me: s.v[nis] ? s.v[nis][i] : null, med: v.length ? d3.quantileSorted(v, 0.5) : null,
      q1: v.length ? d3.quantileSorted(v, 0.25) : null, q3: v.length ? d3.quantileSorted(v, 0.75) : null, n: v.length };
  });
  const w = el.clientWidth || 500, h = 210, m = { t: 10, r: 14, b: 24, l: 54 };
  const x = d3.scaleLinear().domain(d3.extent(yrs)).range([m.l, w - m.r]);
  const ys = pts.flatMap((p) => [p.me, p.q1, p.q3]).filter((v) => v != null);
  const y = d3.scaleLinear().domain([Math.min(0, d3.min(ys)), d3.max(ys) * 1.05 || 1]).nice().range([h - m.b, m.t]);
  const svg = d3.create("svg").attr("viewBox", `0 0 ${w} ${h}`).attr("width", "100%");
  svg.append("g").attr("class", "grid").selectAll("line").data(y.ticks(4)).join("line")
    .attr("x1", m.l).attr("x2", w - m.r).attr("y1", y).attr("y2", y);
  svg.append("g").attr("class", "axis").attr("transform", `translate(0,${h - m.b})`)
    .call(d3.axisBottom(x).ticks(Math.min(yrs.length, 8)).tickFormat(d3.format("d")).tickSizeOuter(0));
  svg.append("g").attr("class", "axis").attr("transform", `translate(${m.l},0)`)
    .call(d3.axisLeft(y).ticks(4).tickFormat((v) => fmt(v)).tickSize(0)).call((g) => g.select("path").remove());
  const band = pts.filter((p) => p.q1 != null);
  svg.append("path").datum(band).attr("fill", "var(--band)")
    .attr("d", d3.area().x((p) => x(p.y)).y0((p) => y(p.q1)).y1((p) => y(p.q3)));
  svg.append("path").datum(band).attr("fill", "none").attr("stroke", "var(--peer)").attr("stroke-width", 2).attr("stroke-dasharray", "4 3")
    .attr("d", d3.line().x((p) => x(p.y)).y((p) => y(p.med)));
  const mine = pts.filter((p) => p.me != null);
  svg.append("path").datum(mine).attr("fill", "none").attr("stroke", "var(--series-1)").attr("stroke-width", 2)
    .attr("d", d3.line().defined((p) => p.me != null).x((p) => x(p.y)).y((p) => y(p.me)));
  svg.append("g").selectAll("circle").data(mine).join("circle").attr("r", 3.5).attr("fill", "var(--series-1)")
    .attr("stroke", "var(--surface-1)").attr("stroke-width", 2).attr("cx", (p) => x(p.y)).attr("cy", (p) => y(p.me));
  // Survol : réticule + infobulle.
  const cross = svg.append("line").attr("stroke", "var(--text-muted)").attr("y1", m.t).attr("y2", h - m.b).style("display", "none");
  svg.append("rect").attr("x", m.l).attr("y", m.t).attr("width", w - m.l - m.r).attr("height", h - m.t - m.b).attr("fill", "transparent")
    .on("mousemove", (ev) => {
      const [mx] = d3.pointer(ev);
      const yr = Math.round(x.invert(mx));
      const p = pts.reduce((a, b) => (Math.abs(b.y - yr) < Math.abs(a.y - yr) ? b : a));
      cross.style("display", null).attr("x1", x(p.y)).attr("x2", x(p.y));
      tip.show(`<b>${p.y}</b><br>${esc(nomC(S.byNis[nis]))} : ${fmtU(p.me, ind)}<br>${t("mediane_pairs")} : ${fmtU(p.med, ind)}<br><span class="muted">${t("ecart_iq")} : ${fmt(p.q1)} – ${fmt(p.q3)} (n = ${p.n})</span>`, ev);
    })
    .on("mouseleave", () => { cross.style("display", "none"); tip.hide(); });
  el.replaceChildren(svg.node());
}

function stripChart(el, s, ind, nis, pl, st) {
  if (!el || !el.isConnected) return; // vue remplacée entre-temps
  const w = el.clientWidth || 500, h = 92, m = { l: 10, r: 10 };
  const pts = pl.map((p) => ({ p, v: s.v[p.nis] ? s.v[p.nis][st.yi] : null })).filter((d) => d.v != null);
  const lo = st.vals[Math.floor(st.n * 0.01)], hi = st.vals[Math.ceil(st.n * 0.99) - 1];
  const x = d3.scaleLinear().domain([lo, hi === lo ? lo + 1 : hi]).range([m.l, w - m.r]).clamp(true);
  const svg = d3.create("svg").attr("viewBox", `0 0 ${w} ${h}`).attr("width", "100%");
  svg.append("rect").attr("x", x(st.q1)).attr("width", Math.max(1, x(st.q3) - x(st.q1))).attr("y", 18).attr("height", 34).attr("fill", "var(--band)").attr("rx", 4);
  svg.append("line").attr("x1", x(st.med)).attr("x2", x(st.med)).attr("y1", 14).attr("y2", 56).attr("stroke", "var(--peer)").attr("stroke-width", 2);
  const jit = (n) => ((parseInt(n, 10) * 2654435761) % 1000) / 1000 * 24 - 12; // décalage vertical stable par commune
  svg.append("g").selectAll("circle").data(pts.filter((d) => d.p.nis !== nis)).join("circle")
    .attr("cx", (d) => x(d.v)).attr("cy", (d) => 35 + jit(d.p.nis)).attr("r", 3.5).attr("fill", "var(--peer)").attr("fill-opacity", 0.55)
    .on("mousemove", (ev, d) => tip.show(`<b>${esc(nomC(d.p))}</b><br>${fmtU(d.v, ind)}`, ev)).on("mouseleave", () => tip.hide())
    .on("click", (ev, d) => go(d.p.nis, "domaine", ind.domaine, ind.id)).style("cursor", "pointer");
  if (st.me != null) {
    svg.append("circle").attr("cx", x(st.me)).attr("cy", 35).attr("r", 7).attr("fill", "var(--series-1)").attr("stroke", "var(--surface-1)").attr("stroke-width", 2);
    svg.append("text").attr("x", x(st.me)).attr("y", 12).attr("text-anchor", x(st.me) > w - 80 ? "end" : x(st.me) < 80 ? "start" : "middle")
      .style("fill", "var(--text-primary)").style("font-weight", 600).text(nomC(S.byNis[nis]));
  }
  svg.append("text").attr("x", m.l).attr("y", h - 6).text(fmtU(lo, ind));
  svg.append("text").attr("x", w - m.r).attr("y", h - 6).attr("text-anchor", "end").text(fmtU(hi, ind));
  svg.append("text").attr("x", x(st.med)).attr("y", h - 6).attr("text-anchor", "middle").text(`${S.lang === "nl" ? "mediaan" : "médiane"} ${fmt(st.med)}`);
  el.replaceChildren(svg.node());
}

function rankTable(el, s, ind, nis, pl, st) {
  if (!el || !el.isConnected) return; // vue remplacée entre-temps
  if (!st) { el.innerHTML = ""; return; }
  const rows = pl.map((p) => ({ p, v: s.v[p.nis] ? s.v[p.nis][st.yi] : null })).filter((d) => d.v != null)
    .sort((a, b) => (ind.sens === -1 ? a.v - b.v : b.v - a.v));
  el.innerHTML = `<table><thead><tr><th class="r">#</th><th>${t("commune")}</th><th class="r">${t("valeur")} ${st.annee}</th><th class="r">${t("habitants")}</th></tr></thead><tbody>${
    rows.map((d, i) => `<tr class="${d.p.nis === nis ? "me" : ""}"><td class="r num">${i + 1}</td><td><a href="#/${d.p.nis}/domaine/${ind.domaine}/${encodeURIComponent(ind.id)}">${esc(nomC(d.p))}</a></td><td class="r num">${fmtU(d.v, ind)}</td><td class="r num">${fmt(d.p.pop)}</td></tr>`).join("")}</tbody></table>`;
  const me = el.querySelector("tr.me");
  if (me) el.scrollTop = Math.max(0, me.offsetTop - el.clientHeight / 2);
  $("#csv").onclick = () => downloadCSV(`${ind.id}.csv`, [["nis", "commune", "annee", ind.id], ...rows.map((d) => [d.p.nis, nomC(d.p), st.annee, d.v])]);
}

function downloadCSV(name, rows) {
  const txt = "﻿" + rows.map((r) => r.map((x) => (/[",;\n]/.test(String(x ?? "")) ? `"${String(x).replace(/"/g, '""')}"` : x ?? "")).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([txt], { type: "text/csv" }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------- Benchmark ---------- */
async function viewBenchmark(app, nis, domFilter) {
  const c = S.byNis[nis];
  const pl = peers(nis);
  const doms = S.meta.domaines.filter((d) => d.n && !d.lourd);
  app.innerHTML = `<div class="row between" style="margin-bottom:14px"><div><h1>${t("benchmark")} — ${esc(nomC(c))}</h1>
    <div class="muted">${pl.length} ${t("pairs")} · ${esc($("#pairs").selectedOptions[0]?.text || "")}</div></div>
    <div class="row"><select id="bdom"><option value="">${S.lang === "nl" ? "Alle domeinen (sleutelindicatoren)" : "Tous les domaines (indicateurs clés)"}</option>${doms.map((d) => `<option value="${d.id}" ${d.id === domFilter ? "selected" : ""}>${esc(lbl(d))}</option>`).join("")}</select>
    <button class="btn" id="bcsv">${t("exporter")}</button></div></div>
    <div class="card"><div class="table-wrap" style="max-height:none" id="btab"><div class="loading">…</div></div></div>`;
  $("#bdom").onchange = (e) => go(nis, "benchmark", e.target.value);
  let rows = [];
  for (const d of doms) {
    if (domFilter && d.id !== domFilter) continue;
    const list = domFilter ? S.meta.indicateurs.filter((i) => i.domaine === d.id && (i.couverture[c.region] || 0) > 0) : tileIndicators(d.id, nis);
    for (const x of await evalDomain(d.id, nis, list)) rows.push({ d, ...x });
  }
  const gap = (x) => (x.st.med ? (x.st.me / x.st.med - 1) * 100 : null);
  $("#btab").innerHTML = `<table><thead><tr><th>${S.lang === "nl" ? "Domein" : "Domaine"}</th><th>${S.lang === "nl" ? "Indicator" : "Indicateur"}</th><th class="r">${t("annee")}</th><th class="r">${esc(nomC(c))}</th><th class="r">${t("mediane_pairs")}</th><th class="r">${t("ecart_mediane")}</th><th style="width:160px">${t("distribution")}</th><th class="r">${t("rang")}</th><th>${t("statut")}</th></tr></thead><tbody>${
    rows.map((x) => `<tr><td class="muted">${esc(lbl(x.d))}</td><td><a href="#/${nis}/domaine/${x.d.id}/${encodeURIComponent(x.ind.id)}">${esc(lbl(x.ind))}</a></td><td class="r num">${x.st.annee}</td><td class="r num">${fmtU(x.st.me, x.ind)}</td><td class="r num">${fmtU(x.st.med, x.ind)}</td><td class="r num">${gap(x) == null ? "–" : (gap(x) > 0 ? "+" : "") + fmt(gap(x)) + " %"}</td><td>${gauge(x.st, x.ind)}</td><td class="r num">${x.st.rank}/${x.st.n}</td><td>${chip(x.st)}</td></tr>`).join("")}</tbody></table>`;
  $("#bcsv").onclick = () => downloadCSV(`benchmark_${nis}.csv`, [["domaine", "indicateur", "libelle", "annee", "valeur", "mediane_pairs", "q1", "q3", "rang", "n_pairs", "statut"],
    ...rows.map((x) => [x.d.id, x.ind.id, lbl(x.ind), x.st.annee, x.st.me, x.st.med, x.st.q1, x.st.q3, x.st.rank, x.st.n, x.st.statut])]);
}

/* ---------- Défis ---------- */
const DEFIS = [
  { id: "finances", fr: "Soutenabilité financière", nl: "Financiële houdbaarheid",
    txt_fr: "Charges de personnel et de pensions en hausse (cotisation de responsabilisation), dotations aux zones de police et de secours, dette et marge d'autofinancement : la plupart des communes doivent dégager des marges sans alourdir la fiscalité.",
    txt_nl: "Stijgende personeels- en pensioenlasten (responsabiliseringsbijdrage), dotaties aan politie- en hulpverleningszones, schuld en autofinancieringsmarge: de meeste gemeenten moeten ruimte vinden zonder de fiscaliteit te verzwaren." },
  { id: "aines", fr: "Vieillissement et soins aux aînés", nl: "Vergrijzing en ouderenzorg",
    txt_fr: "La part des 80 ans et plus va fortement augmenter d'ici 2035. Les communes et CPAS doivent anticiper l'offre de maisons de repos, de résidences-services et de maintien à domicile.",
    txt_nl: "Het aandeel 80-plussers stijgt sterk tegen 2035. Gemeenten en OCMW's moeten het aanbod aan woonzorgcentra, assistentiewoningen en thuiszorg plannen." },
  { id: "pauvrete", fr: "Pauvreté et action sociale", nl: "Armoede en sociaal beleid",
    txt_fr: "Le nombre de bénéficiaires du revenu d'intégration a fortement augmenté depuis 2020, et la limitation des allocations de chômage dans le temps reporte une partie de la charge sur les CPAS à partir de 2026.",
    txt_nl: "Het aantal leefloners steeg sterk sinds 2020 en de beperking van de werkloosheidsuitkeringen in de tijd verschuift vanaf 2026 een deel van de last naar de OCMW's." },
  { id: "logement", fr: "Logement abordable", nl: "Betaalbaar wonen",
    txt_fr: "Prix de l'immobilier, listes d'attente pour un logement social et objectifs régionaux de logements publics (ancrage communal, sociaal objectief) : un enjeu central des législatures 2024-2030.",
    txt_nl: "Vastgoedprijzen, wachtlijsten voor sociale huurwoningen en gewestelijke doelstellingen (bindend sociaal objectief): een kernthema van de legislatuur 2024-2030." },
  { id: "climat", fr: "Climat et transition énergétique", nl: "Klimaat en energietransitie",
    txt_fr: "Engagements de la Convention des Maires (-40 à -55 % de CO2 en 2030), rénovation du patrimoine communal, passage de l'éclairage public au LED, développement du renouvelable et des bornes de recharge.",
    txt_nl: "Engagementen van het Burgemeestersconvenant (-40 tot -55 % CO2 tegen 2030), renovatie van het gemeentelijk patrimonium, ledverlichting, hernieuwbare energie en laadpalen." },
  { id: "demographie", fr: "Croissance et projections démographiques", nl: "Bevolkingsgroei en projecties",
    txt_fr: "Les projections de population et de ménages déterminent les besoins futurs en écoles, crèches, logements et équipements.",
    txt_nl: "Bevolkings- en huishoudensprojecties bepalen de toekomstige behoefte aan scholen, kinderopvang, woningen en voorzieningen." },
  { id: "ecoles", fr: "Petite enfance et enseignement", nl: "Kinderopvang en onderwijs",
    txt_fr: "Taux de couverture de l'accueil 0-3 ans, pression démographique sur les écoles et pouvoir organisateur communal.",
    txt_nl: "Dekkingsgraad van de kinderopvang, demografische druk op scholen en het gemeentelijk onderwijs." },
  { id: "sante", fr: "Santé de la population", nl: "Gezondheid van de bevolking",
    txt_fr: "Espérance de vie, accès aux soins de première ligne et maladies chroniques : des écarts importants entre communes, que les politiques locales (prévention, cohésion sociale, CPAS) peuvent réduire.",
    txt_nl: "Levensverwachting, toegang tot eerstelijnszorg en chronische ziekten: grote verschillen tussen gemeenten, die lokaal beleid (preventie, sociale cohesie, OCMW) kan verkleinen." },
  { id: "securite", fr: "Sécurité et prévention", nl: "Veiligheid en preventie",
    txt_fr: "Criminalité enregistrée, sécurité routière et poids des dotations aux zones pluricommunales de police et de secours.",
    txt_nl: "Geregistreerde criminaliteit, verkeersveiligheid en het gewicht van de dotaties aan de politie- en hulpverleningszones." },
  { id: "mobilite", fr: "Mobilité et infrastructures", nl: "Mobiliteit en infrastructuur",
    txt_fr: "Entretien des voiries et de l'égouttage, investissements subsidiés (PIC/FRIC, Wegenfonds), infrastructures cyclables et accidents.",
    txt_nl: "Onderhoud van wegen en riolering, gesubsidieerde investeringen, fietsinfrastructuur en ongevallen." },
  { id: "environnement", fr: "Propreté et environnement", nl: "Netheid en milieu",
    txt_fr: "Déchets par habitant et collecte sélective (coût-vérité), dépôts clandestins, espaces verts, qualité de l'air et risque d'inondation.",
    txt_nl: "Afval per inwoner en selectieve inzameling, sluikstorten, groen, luchtkwaliteit en overstromingsrisico." },
  { id: "gouvernance", fr: "Gouvernance et confiance", nl: "Bestuur en vertrouwen",
    txt_fr: "Participation électorale, stabilité des majorités, confiance des habitants dans l'administration et coopération intercommunale : la capacité de la commune à porter son projet.",
    txt_nl: "Opkomst, stabiliteit van de meerderheid, vertrouwen van de inwoners in het bestuur en intergemeentelijke samenwerking: het draagvlak van de gemeente." },
  { id: "economie", fr: "Économie locale et attractivité", nl: "Lokale economie en aantrekkelijkheid",
    txt_fr: "Emploi local, création d'entreprises, vacance commerciale, tourisme et vie associative.",
    txt_nl: "Lokale werkgelegenheid, ondernemerschap, leegstand, toerisme en verenigingsleven." },
];

function defiIndicators(defi, nis) {
  const c = S.byNis[nis];
  return S.meta.indicateurs.filter((i) => (i.defis || []).includes(defi) && (i.couverture[c.region] || 0) > 0);
}

async function evalMany(inds, nis) {
  const byDom = {};
  inds.forEach((i) => (byDom[i.domaine] = byDom[i.domaine] || []).push(i));
  return (await Promise.all(Object.entries(byDom).map(([dom, l]) => evalDomain(dom, nis, l)))).flat();
}

async function viewDefis(app, nis, id) {
  const c = S.byNis[nis];
  if (id) return viewDefi(app, nis, DEFIS.find((d) => d.id === id) || DEFIS[0]);
  app.innerHTML = `<h1 style="margin-bottom:6px">${S.lang === "nl" ? "Uitdagingen" : "Défis"} — ${esc(nomC(c))}</h1>
    <p class="secondary" style="margin-top:0">${S.lang === "nl" ? "De grote uitdagingen van de Belgische gemeenten, telkens met de indicatoren van de gemeente tegenover vergelijkbare gemeenten." : "Les grands défis des communes belges, chacun éclairé par les indicateurs de la commune comparés à ceux des communes semblables."}</p>
    <div class="grid g-tiles" id="dgrid"></div>`;
  const grid = $("#dgrid");
  const jobs = [];
  for (const d of DEFIS) {
    const inds = defiIndicators(d.id, nis);
    if (!inds.length) continue;
    const card = document.createElement("a");
    card.className = "card tile";
    card.href = `#/${nis}/defis/${d.id}`;
    card.style.cssText = "text-decoration:none;color:inherit";
    card.innerHTML = `<h2>${esc(lbl(d))}</h2><p class="secondary" style="margin:0 0 10px;font-size:13px">${esc(S.lang === "nl" ? d.txt_nl : d.txt_fr)}</p><div class="row" style="gap:6px" data-s><span class="muted">…</span></div>`;
    grid.appendChild(card);
    jobs.push(evalMany(inds, nis).then((res) => {
      const n = (k) => res.filter((x) => x.st.statut === k).length;
      card.querySelector("[data-s]").innerHTML = res.length ? `<span class="chip bad">${ICON.bad}${n("bad")} ${t("a_surveiller")}</span><span class="chip good">${ICON.good}${n("good")} ${t("favorable")}</span><span class="chip">${res.length} ${t("indicateurs")}</span>` : `<span class="muted">${t("aucune_donnee")}</span>`;
    }));
  }
  if (!grid.children.length) grid.innerHTML = `<div class="card">${t("aucune_donnee")}</div>`;
  await Promise.all(jobs);
}

async function viewDefi(app, nis, d) {
  const c = S.byNis[nis];
  const inds = defiIndicators(d.id, nis);
  app.innerHTML = `<div class="row between" style="margin-bottom:6px"><div><a href="#/${nis}/defis" class="muted">← ${S.lang === "nl" ? "Uitdagingen" : "Défis"}</a><h1>${esc(lbl(d))} — ${esc(nomC(c))}</h1></div>
    <button class="btn primary noprint" id="topst">${S.lang === "nl" ? "Toevoegen aan het meerjarenplan" : "Ajouter au PST"}</button></div>
    <p class="secondary" style="margin-top:0;max-width:900px">${esc(S.lang === "nl" ? d.txt_nl : d.txt_fr)}</p>
    <div class="card"><div class="table-wrap" style="max-height:none" id="dtab"><div class="loading">…</div></div></div>`;
  const res = (await evalMany(inds, nis)).sort((a, b) => (a.st.score ?? 0.5) - (b.st.score ?? 0.5));
  $("#dtab").innerHTML = res.length ? `<table><thead><tr><th>${S.lang === "nl" ? "Indicator" : "Indicateur"}</th><th class="r">${t("annee")}</th><th class="r">${esc(nomC(c))}</th><th class="r">${t("mediane_pairs")}</th><th style="width:170px">${t("distribution")}</th><th class="r">${t("rang")}</th><th>${t("statut")}</th></tr></thead><tbody>${
    res.map((x) => `<tr><td><a href="#/${nis}/domaine/${x.ind.domaine}/${encodeURIComponent(x.ind.id)}">${esc(lbl(x.ind))}</a></td><td class="r num">${x.st.annee}</td><td class="r num">${fmtU(x.st.me, x.ind)}</td><td class="r num">${fmtU(x.st.med, x.ind)}</td><td>${gauge(x.st, x.ind)}</td><td class="r num">${x.st.rank}/${x.st.n}</td><td>${chip(x.st)}</td></tr>`).join("")}</tbody></table>` : `<div class="empty">${t("aucune_donnee")}</div>`;
  $("#topst").onclick = () => {
    const sel = res.filter((x) => x.ind.sens && x.st.statut === "bad");
    const pick = (sel.length ? sel : res.filter((x) => x.ind.sens && x.st.statut === "mid")).slice(0, 4);
    const p = pstLoad(nis) || { version: 1, commune: nis, titre: (S.lang === "nl" ? "Meerjarenplan 2025-2030 — " : "Programme stratégique transversal 2025-2030 — ") + nomC(c), os: [] };
    p.os.push({ id: uid(), titre: lbl(d), defi: d.id, oo: pick.map((x) => ({ id: uid(), titre: lbl(x.ind),
      indicateurs: [{ id: x.ind.id, depart: x.st.me, annee_depart: x.st.annee, cible: +(x.st.statut === "bad" ? x.st.med : (x.ind.sens === 1 ? x.st.q3 : x.st.q1)).toPrecision(3), annee_cible: 2030 }],
      actions: [{ titre: "", responsable: "", echeance: "2027-12", budget: "", statut: "a_lancer" }] })) });
    pstSave(nis, p);
    go(nis, "pst");
  };
}

/* ---------- PST / meerjarenplan ---------- */
const PST_KEY = (nis) => `cc_pst_${nis}`;
function pstLoad(nis) { try { return JSON.parse(localStorage.getItem(PST_KEY(nis))) || null; } catch { return null; } }
function pstSave(nis, p) { try { localStorage.setItem(PST_KEY(nis), JSON.stringify(p)); } catch { /* stockage indisponible */ } }
const uid = () => Math.random().toString(36).slice(2, 9);

async function pstProposal(nis) {
  const c = S.byNis[nis];
  const os = [];
  for (const d of S.meta.domaines.filter((x) => x.n && !x.lourd && x.id !== "profil")) {
    const oriented = S.meta.indicateurs.filter((i) => i.domaine === d.id && i.sens && (i.cle_tuile || (i.defis || []).length) && (i.couverture[c.region] || 0) >= 10);
    const res = (await evalDomain(d.id, nis, oriented)).filter((x) => x.st.statut === "bad").sort((a, b) => a.st.score - b.st.score).slice(0, 3);
    if (!res.length) continue;
    os.push({ id: uid(), titre: (S.lang === "nl" ? "Verbeteren: " : "Améliorer : ") + lbl(d).toLowerCase(), domaine: d.id,
      oo: res.map((x) => ({ id: uid(), titre: (S.lang === "nl" ? "Bijsturen van " : "Ramener vers la médiane des pairs : ") + lbl(x.ind).toLowerCase(),
        indicateurs: [{ id: x.ind.id, depart: x.st.me, annee_depart: x.st.annee, cible: +x.st.med.toPrecision(3), annee_cible: 2030 }],
        actions: [{ titre: "", responsable: "", echeance: "2027-12", budget: "", statut: "a_lancer" }] })) });
  }
  return { version: 1, commune: nis, titre: (S.lang === "nl" ? "Meerjarenplan 2025-2030 — " : "Programme stratégique transversal 2025-2030 — ") + nomC(c), os };
}

async function viewPST(app, nis) {
  const c = S.byNis[nis];
  let p = pstLoad(nis);
  const fl = c.region === "Flandre";
  const vocab = fl && S.lang === "nl" ? { os: "Beleidsdoelstelling", oo: "Actieplan", act: "Actie" } : { os: S.lang === "nl" ? "Strategische doelstelling" : "Objectif stratégique", oo: S.lang === "nl" ? "Operationele doelstelling" : "Objectif opérationnel", act: "Action" };
  const STAT = { a_lancer: S.lang === "nl" ? "te starten" : "à lancer", en_cours: S.lang === "nl" ? "lopend" : "en cours", fait: S.lang === "nl" ? "klaar" : "réalisé", retard: S.lang === "nl" ? "vertraagd" : "en retard" };
  app.innerHTML = `<div class="row between" style="margin-bottom:14px"><div><h1>${t("pst")} — ${esc(nomC(c))}</h1>
    <div class="muted">${fl ? (S.lang === "nl" ? "Structuur BBC: beleidsdoelstellingen → actieplannen → acties, gekoppeld aan indicatoren en budget." : "Structure BBC : beleidsdoelstellingen → actieplannen → acties, reliées aux indicateurs et au budget.") : (S.lang === "nl" ? "Structuur PST (CDLD art. L1123-27): strategische → operationele doelstellingen → acties." : "Structure PST (CDLD art. L1123-27) : objectifs stratégiques → opérationnels → actions, reliés aux indicateurs et au budget.")}</div></div>
    <div class="row noprint"><button class="btn" id="pgen">${S.lang === "nl" ? "Voorstel op basis van aandachtspunten" : "Proposer à partir des points d'attention"}</button>
    <button class="btn" id="padd">+ ${vocab.os}</button><button class="btn" id="pexp">Export JSON</button><button class="btn" id="pcsv">${S.lang === "nl" ? "Export CSV (gemeenschappelijk model)" : "Export CSV (modèle commun)"}</button>
    <label class="btn">Import JSON<input type="file" id="pimp" accept="application/json" hidden></label><button class="btn" onclick="print()">${S.lang === "nl" ? "Afdrukken" : "Imprimer"}</button></div></div>
    <div id="pbody" class="grid"></div>
    <details class="card noprint" style="margin-top:14px" id="pex"><summary style="cursor:pointer;font-weight:600">${S.lang === "nl" ? "Inspiratie: echte plannen (PST en meerjarenplannen)" : "S'inspirer : extraits de PST et de plans pluriannuels réels"}</summary><div id="pexbody" class="table-wrap" style="margin-top:10px"></div></details>`;
  const save = () => pstSave(nis, p);
  getJSON("data/pst_exemples.json").then((ex) => {
    const el = $("#pexbody");
    if (!el) return;
    el.innerHTML = `<table><thead><tr><th>${t("commune")}</th><th>${S.lang === "nl" ? "Niveau" : "Niveau"}</th><th>Code</th><th>${S.lang === "nl" ? "Omschrijving" : "Intitulé"}</th><th>${S.lang === "nl" ? "Indicator" : "Indicateur de suivi"}</th></tr></thead><tbody>${
      ex.map((r) => `<tr><td>${esc(r.commune)} <span class="muted">${esc(r.cadre)} ${esc(r.periode)}</span></td><td>${esc(["", "OS/BD", "OO/AP", "action"][+r.niveau] || r.niveau)}</td><td class="muted">${esc(r.code_source)}</td><td>${r.url_source ? `<a href="${esc(r.url_source)}" target="_blank" rel="noopener">${esc(r.intitule)}</a>` : esc(r.intitule)}</td><td class="muted">${esc(r.indicateur_suivi)}</td></tr>`).join("")}</tbody></table>`;
  }).catch(() => $("#pex")?.remove());
  const allInds = S.meta.indicateurs.filter((i) => (i.couverture[c.region] || 0) > 0);
  const indOpts = (sel) => `<option value="">—</option>` + S.meta.domaines.filter((d) => d.n).map((d) => `<optgroup label="${esc(lbl(d))}">${allInds.filter((i) => i.domaine === d.id).map((i) => `<option value="${esc(i.id)}" ${i.id === sel ? "selected" : ""}>${esc(lbl(i))}</option>`).join("")}</optgroup>`).join("");
  async function progressOf(ix) {
    const ind = S.ind[ix.id];
    if (!ind) return null;
    const s = await series(ix.id);
    if (!s || !s.v[nis]) return null;
    let last = null, ly = null;
    s.v[nis].forEach((v, i) => { if (v != null) { last = v; ly = s.annees[i]; } });
    if (last == null || ix.depart == null || ix.cible == null || ix.cible === ix.depart) return { last, ly, pct: null };
    return { last, ly, pct: Math.max(0, Math.min(1, (last - ix.depart) / (ix.cible - ix.depart))) };
  }
  async function draw() {
    const body = $("#pbody");
    if (!p) {
      body.innerHTML = `<div class="card"><p>${S.lang === "nl" ? "Nog geen plan voor deze gemeente. Start van een voorstel gebaseerd op de aandachtspunten, of maak een lege doelstelling aan." : "Pas encore de plan pour cette commune. Partez d'une proposition construite à partir des points d'attention, ou créez un objectif vide."}</p>
        <p class="note">${S.lang === "nl" ? "Het plan wordt in deze browser bewaard; exporteer het in JSON om het te delen." : "Le plan est enregistré dans ce navigateur ; exportez-le en JSON pour le partager ou l'archiver."}</p></div>`;
      return;
    }
    body.innerHTML = `<div class="card"><input class="t" id="ptitre" style="width:100%;font-size:18px;font-weight:650;border:none;background:transparent" value="${esc(p.titre)}"></div>` +
      p.os.map((os, i) => `<div class="card pst-os" data-os="${i}">
        <div class="head"><span class="chip">${vocab.os} ${i + 1}</span><input class="t" data-f="os-titre" value="${esc(os.titre)}">
          ${fl ? "" : `<select data-f="os-volet" title="Volet"><option value="externe" ${os.volet !== "interne" ? "selected" : ""}>${S.lang === "nl" ? "extern" : "externe"}</option><option value="interne" ${os.volet === "interne" ? "selected" : ""}>${S.lang === "nl" ? "intern" : "interne"}</option></select>`}
          <button class="x noprint" data-del-os="${i}" title="Supprimer">×</button></div>
        ${os.oo.map((oo, j) => `<div class="pst-oo" data-oo="${j}">
          <div class="head"><span class="chip">${vocab.oo} ${i + 1}.${j + 1}</span><input class="t" data-f="oo-titre" value="${esc(oo.titre)}">
            <label class="muted" style="white-space:nowrap;font-size:12px;padding-top:6px"><input type="checkbox" data-f="oo-prio" ${oo.prioritaire ? "checked" : ""}> ${S.lang === "nl" ? "prioritair" : "prioritaire"}</label>
            <button class="x noprint" data-del-oo="${j}">×</button></div>
          <div class="pst-ind colhead"><span>${S.lang === "nl" ? "Indicator" : "Indicateur"}</span><span>${S.lang === "nl" ? "Start" : "Départ"}</span><span>${S.lang === "nl" ? "Doel" : "Cible"}</span><span>${S.lang === "nl" ? "Jaar" : "Échéance"}</span><span>${S.lang === "nl" ? "Voortgang (laatste waarde)" : "Avancement (dernière valeur)"}</span><span></span></div>
          ${oo.indicateurs.map((ix, k) => `<div class="pst-ind" data-ix="${k}"><select data-f="ix-id">${indOpts(ix.id)}</select>
            <input type="number" step="any" data-f="ix-depart" value="${ix.depart ?? ""}"><input type="number" step="any" data-f="ix-cible" value="${ix.cible ?? ""}">
            <input type="number" data-f="ix-annee" value="${ix.annee_cible ?? ""}"><div class="prog" data-prog="${i}-${j}-${k}"></div><button class="x noprint" data-del-ix="${k}">×</button></div>`).join("")}
          <button class="btn small noprint" data-add-ix style="margin-top:6px">+ ${S.lang === "nl" ? "indicator" : "indicateur"}</button>
          <div class="pst-act colhead" style="margin-top:10px"><span>${vocab.act}</span><span>${S.lang === "nl" ? "Verantwoordelijke" : "Responsable"}</span><span>${S.lang === "nl" ? "Termijn" : "Échéance"}</span><span>Budget (€)</span><span>${t("statut")}</span><span></span></div>
          ${oo.actions.map((a, k) => `<div class="pst-act" data-act="${k}"><input data-f="a-titre" value="${esc(a.titre)}" placeholder="${S.lang === "nl" ? "Omschrijving van de actie" : "Description de l'action"}"><input data-f="a-resp" value="${esc(a.responsable)}">
            <input type="month" data-f="a-ech" value="${esc(a.echeance)}"><input type="number" data-f="a-budget" value="${esc(a.budget)}">
            <select data-f="a-stat">${Object.entries(STAT).map(([k2, v]) => `<option value="${k2}" ${a.statut === k2 ? "selected" : ""}>${v}</option>`).join("")}</select><button class="x noprint" data-del-act="${k}">×</button></div>`).join("")}
          <button class="btn small noprint" data-add-act style="margin-top:6px">+ ${vocab.act.toLowerCase()}</button></div>`).join("")}
        <button class="btn small noprint" data-add-oo style="margin:10px 0 0 14px">+ ${vocab.oo}</button></div>`).join("") +
      `<div class="card"><h3>${S.lang === "nl" ? "Samenvatting" : "Synthèse"}</h3><div id="psum" class="row" style="margin-top:8px"></div></div>`;
    $("#ptitre").oninput = (e) => { p.titre = e.target.value; save(); };
    body.querySelectorAll("[data-os]").forEach((osEl) => {
      const os = p.os[+osEl.dataset.os];
      osEl.querySelector('[data-f="os-titre"]').oninput = (e) => { os.titre = e.target.value; save(); };
      const vol = osEl.querySelector('[data-f="os-volet"]');
      if (vol) vol.onchange = (e) => { os.volet = e.target.value; save(); };
      osEl.querySelector("[data-del-os]").onclick = () => { if (confirm("Supprimer cet objectif ?")) { p.os.splice(+osEl.dataset.os, 1); save(); draw(); } };
      osEl.querySelector("[data-add-oo]").onclick = () => { os.oo.push({ id: uid(), titre: "", indicateurs: [], actions: [] }); save(); draw(); };
      osEl.querySelectorAll("[data-oo]").forEach((ooEl) => {
        const oo = os.oo[+ooEl.dataset.oo];
        ooEl.querySelector('[data-f="oo-titre"]').oninput = (e) => { oo.titre = e.target.value; save(); };
        ooEl.querySelector('[data-f="oo-prio"]').onchange = (e) => { oo.prioritaire = e.target.checked; save(); };
        ooEl.querySelector("[data-del-oo]").onclick = () => { os.oo.splice(+ooEl.dataset.oo, 1); save(); draw(); };
        ooEl.querySelector("[data-add-ix]").onclick = () => { oo.indicateurs.push({ id: "", depart: null, cible: null, annee_cible: 2030 }); save(); draw(); };
        ooEl.querySelector("[data-add-act]").onclick = () => { oo.actions.push({ titre: "", responsable: "", echeance: "", budget: "", statut: "a_lancer" }); save(); draw(); };
        ooEl.querySelectorAll("[data-ix]").forEach((r) => {
          const ix = oo.indicateurs[+r.dataset.ix];
          r.querySelector('[data-f="ix-id"]').onchange = async (e) => {
            ix.id = e.target.value;
            const s = await series(ix.id);
            const st = s && stats(s, S.ind[ix.id], nis, peers(nis));
            if (st) { ix.depart = st.me; ix.annee_depart = st.annee; ix.cible = +st.med.toPrecision(3); }
            save(); draw();
          };
          r.querySelector('[data-f="ix-depart"]').oninput = (e) => { ix.depart = e.target.value === "" ? null : +e.target.value; save(); };
          r.querySelector('[data-f="ix-cible"]').oninput = (e) => { ix.cible = e.target.value === "" ? null : +e.target.value; save(); };
          r.querySelector('[data-f="ix-annee"]').oninput = (e) => { ix.annee_cible = +e.target.value; save(); };
          r.querySelector("[data-del-ix]").onclick = () => { oo.indicateurs.splice(+r.dataset.ix, 1); save(); draw(); };
        });
        ooEl.querySelectorAll("[data-act]").forEach((r) => {
          const a = oo.actions[+r.dataset.act];
          const bind = (f, k) => (r.querySelector(`[data-f="${f}"]`).oninput = (e) => { a[k] = e.target.value; save(); summary(); });
          bind("a-titre", "titre"); bind("a-resp", "responsable"); bind("a-ech", "echeance"); bind("a-budget", "budget");
          r.querySelector('[data-f="a-stat"]').onchange = (e) => { a.statut = e.target.value; save(); summary(); };
          r.querySelector("[data-del-act]").onclick = () => { oo.actions.splice(+r.dataset.act, 1); save(); draw(); };
        });
      });
    });
    for (const [i, os] of p.os.entries()) for (const [j, oo] of os.oo.entries()) for (const [k, ix] of oo.indicateurs.entries()) {
      const el = body.querySelector(`[data-prog="${i}-${j}-${k}"]`);
      progressOf(ix).then((pr) => {
        if (!el) return;
        if (!pr) { el.innerHTML = `<span class="muted">–</span>`; return; }
        const ind = S.ind[ix.id];
        el.innerHTML = pr.pct == null ? `<span class="num">${fmtU(pr.last, ind)} <span class="muted">(${pr.ly})</span></span>`
          : `<div class="row" style="gap:6px;flex-wrap:nowrap"><div class="progress" style="flex:1" title="${Math.round(pr.pct * 100)} %"><div style="width:${pr.pct * 100}%"></div></div><span class="num">${fmtU(pr.last, ind)} <span class="muted">(${pr.ly})</span></span></div>`;
      });
    }
    summary();
  }
  function summary() {
    const el = $("#psum");
    if (!el || !p) return;
    const acts = p.os.flatMap((o) => o.oo.flatMap((x) => x.actions));
    const bud = acts.reduce((a, x) => a + (+x.budget || 0), 0);
    const by = (s) => acts.filter((a) => a.statut === s).length;
    el.innerHTML = [[p.os.length, vocab.os], [p.os.reduce((a, o) => a + o.oo.length, 0), vocab.oo], [acts.length, vocab.act],
      [fmt(bud) + " €", "Budget"], [by("fait"), STAT.fait], [by("en_cours"), STAT.en_cours], [by("retard"), STAT.retard]]
      .map(([v, l]) => `<div class="fact"><div class="v num">${v}</div><div class="l">${esc(l)}</div></div>`).join("");
  }
  $("#pgen").onclick = async () => {
    if (p && !confirm(S.lang === "nl" ? "Het huidige plan vervangen?" : "Remplacer le plan actuel ?")) return;
    $("#pbody").innerHTML = `<div class="loading">…</div>`;
    p = await pstProposal(nis); save(); draw();
  };
  $("#padd").onclick = () => { p = p || { version: 1, commune: nis, titre: `PST — ${nomC(c)}`, os: [] }; p.os.push({ id: uid(), titre: "", oo: [] }); save(); draw(); };
  $("#pexp").onclick = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(p || {}, null, 2)], { type: "application/json" }));
    a.download = `pst_${nis}.json`; a.click();
  };
  $("#pcsv").onclick = () => {
    if (!p) return;
    const plan = `${fl ? "BBC" : "PST"}-${nis}`;
    const rows = [["plan_id", "nis", "cadre", "niveau", "code", "parent_code", "intitule", "volet", "prioritaire", "indicateur_cockpit", "valeur_reference", "annee_reference", "cible", "annee_cible", "responsable", "echeance", "budget_eur", "statut"]];
    p.os.forEach((os, i) => {
      const c1 = `OS${i + 1}`;
      rows.push([plan, nis, fl ? "BBC" : "PST", 1, c1, "", os.titre, os.volet || "externe", "", "", "", "", "", "", "", "", "", ""]);
      os.oo.forEach((oo, j) => {
        const c2 = `OO${i + 1}.${j + 1}`;
        rows.push([plan, nis, fl ? "BBC" : "PST", 2, c2, c1, oo.titre, os.volet || "externe", oo.prioritaire ? "oui" : "", "", "", "", "", "", "", "", "", ""]);
        oo.indicateurs.forEach((ix) => rows.push([plan, nis, fl ? "BBC" : "PST", "indicateur", "", c2, S.ind[ix.id] ? lbl(S.ind[ix.id]) : ix.id, "", "", ix.id, ix.depart, ix.annee_depart || "", ix.cible, ix.annee_cible, "", "", "", ""]));
        oo.actions.forEach((a, k) => rows.push([plan, nis, fl ? "BBC" : "PST", 3, `${i + 1}.${j + 1}.${k + 1}`, c2, a.titre, "", "", "", "", "", "", "", a.responsable, a.echeance, a.budget, a.statut]));
      });
    });
    downloadCSV(`${plan}.csv`, rows);
  };
  $("#pimp").onchange = async (e) => {
    try { const j = JSON.parse(await e.target.files[0].text()); if (!Array.isArray(j.os)) throw 0; p = j; save(); draw(); }
    catch { alert(S.lang === "nl" ? "Ongeldig bestand." : "Fichier invalide."); }
  };
  draw();
}

/* ---------- Simulateurs ---------- */
// Chaque simulateur cherche ses indicateurs par identifiant, dans l'ordre (le premier disponible gagne).
const SIMS = [
  { id: "ipp", fr: "Additionnel à l'impôt des personnes physiques", nl: "Aanvullende personenbelasting",
    taux: ["taux_add_ipp"], unite: "%", rendement: ["ipp_rendement_1pct"],
    recette: ["bud_additionnels_ipp_hab"], min: 0, max: 9, pas: 0.1, defaut: 7 },
  { id: "pri", fr: "Centimes additionnels au précompte immobilier", nl: "Opcentiemen onroerende voorheffing",
    taux: ["taux_add_pri"], unite: "", rendement: ["pri_rendement_1centime"],
    recette: ["bud_additionnels_pri_hab"], min: 0, max: 4000, pas: 1, defaut: 2600 },
];
const firstInd = (ids) => {
  for (const id of ids) if (S.ind[id]) return S.ind[id];
  return S.meta.indicateurs.find((i) => ids.some((x) => i.id.endsWith("." + x))) || null;
};

async function lastVal(ind, nis) {
  if (!ind) return null;
  const s = await series(ind.id);
  if (!s || !s.v[nis]) return null;
  for (let i = s.annees.length - 1; i >= 0; i--) if (s.v[nis][i] != null) return { v: s.v[nis][i], annee: s.annees[i], s };
  return null;
}

async function viewSim(app, nis) {
  const c = S.byNis[nis];
  app.innerHTML = `<h1 style="margin-bottom:6px">${t("simulateurs")} — ${esc(nomC(c))}</h1>
    <p class="secondary" style="margin-top:0">${S.lang === "nl" ? "Wat brengt een wijziging van het tarief op? Het rendement wordt evenredig met het tarief verondersteld (zelfde belastbare basis)." : "Que rapporte un changement de taux ? Le rendement est supposé proportionnel au taux (même base imposable, sans effet de comportement)."}</p>
    <div class="grid" id="sims"></div>`;
  for (const sim of SIMS) {
    const ti = firstInd(sim.taux), ri = firstInd(sim.recette), yi = firstInd(sim.rendement || []);
    const tv = await lastVal(ti, nis), rv = await lastVal(ri, nis), yv = await lastVal(yi, nis);
    if (!$("#sims")) return;
    const box = document.createElement("div");
    box.className = "card";
    $("#sims").appendChild(box);
    if (!rv && !(yv && tv)) { box.innerHTML = `<h2>${esc(lbl(sim))}</h2><div class="empty">${t("aucune_donnee")}</div>`; continue; }
    const taux0 = tv ? tv.v : null;
    const pop = c.pop || 0;
    // Recette de départ : rendement d'un point × taux si le rendement est connu, sinon le budget.
    const parRendement = !!(yv && taux0);
    const rec0 = parRendement ? yv.v * taux0 : rv.v * pop;
    const src0 = parRendement ? (S.lang === "nl" ? `opbrengst van 1 punt (${yv.annee}) × tarief` : `rendement d'un point (${yv.annee}) × taux`) : (S.lang === "nl" ? `begroting ${rv.annee}` : `budget ${rv.annee}`);
    const pl = peers(nis);
    let peerRates = [];
    if (tv) peerRates = pl.map((p) => ({ p, v: tv.s.v[p.nis] ? tv.s.v[p.nis][tv.s.annees.indexOf(tv.annee)] : null })).filter((d) => d.v != null);
    // Plage du curseur : autour des taux observés chez les pairs.
    const obs = [...peerRates.map((d) => d.v), taux0].filter((v) => v != null);
    const lo = obs.length ? Math.max(sim.min, Math.floor(Math.min(...obs) * 0.8 / sim.pas) * sim.pas) : sim.min;
    const hi = obs.length ? Math.min(sim.max, Math.ceil(Math.max(...obs) * 1.2 / sim.pas) * sim.pas) : sim.max;
    box.innerHTML = `<h2>${esc(lbl(sim))}</h2><div class="sim" style="margin-top:10px">
      <div><div class="muted">${S.lang === "nl" ? "Huidig tarief" : "Taux actuel"} ${tv ? `(${tv.annee})` : ""}</div>
        <div class="result num">${taux0 != null ? fmt(taux0, sim.unite) : (S.lang === "nl" ? "onbekend" : "inconnu")}</div>
        <div class="slider"><label>${S.lang === "nl" ? "Nieuw tarief" : "Nouveau taux"} : <b class="num" data-o="t"></b></label>
        <input type="range" min="${lo}" max="${hi}" step="${sim.pas}" value="${taux0 ?? sim.defaut}"></div>
        <div class="muted">${S.lang === "nl" ? "Huidige ontvangst" : "Recette actuelle"} (${esc(src0)})</div>
        <div class="num" style="font-size:18px;font-weight:620">${fmt(rec0)} € <span class="muted" style="font-size:13px">(${fmt(rec0 / (pop || 1))} €/hab.)</span></div>
        ${parRendement ? `<div class="note">${S.lang === "nl" ? "1 punt brengt" : "1 point rapporte"} ${fmt(yv.v)} €${rv ? ` · ${S.lang === "nl" ? "begroting" : "budget"} ${rv.annee} : ${fmt(rv.v * pop)} €` : ""}</div>` : ""}
        <div class="muted" style="margin-top:10px">${S.lang === "nl" ? "Nieuwe ontvangst" : "Nouvelle recette"}</div>
        <div class="result num" data-o="r"></div><div class="num delta" data-o="d"></div>
        <div class="note">${S.lang === "nl" ? "Per inwoner" : "Par habitant"} : <span data-o="h"></span></div></div>
      <div><div class="chart-title"><span>${S.lang === "nl" ? "Tarieven van vergelijkbare gemeenten" : "Taux des communes comparables"}</span></div><div data-o="chart"></div></div></div>`;
    const input = box.querySelector("input[type=range]");
    const upd = () => {
      const nt = +input.value;
      box.querySelector('[data-o="t"]').textContent = fmt(nt, sim.unite);
      if (taux0 == null || !taux0) {
        box.querySelector('[data-o="r"]').textContent = "–";
        box.querySelector('[data-o="d"]').textContent = S.lang === "nl" ? "Huidig tarief ontbreekt: simulatie onmogelijk." : "Taux actuel manquant : simulation impossible.";
        return;
      }
      const nr = rec0 * nt / taux0;
      const d = nr - rec0;
      box.querySelector('[data-o="r"]').textContent = fmt(nr) + " €";
      const del = box.querySelector('[data-o="d"]');
      del.textContent = (d >= 0 ? "+" : "") + fmt(d) + " € / an";
      del.className = "num delta " + (d > 0 ? "up" : d < 0 ? "down" : "");
      box.querySelector('[data-o="h"]').textContent = fmt(nr / (pop || 1)) + " €/hab.";
      if (peerRates.length) histo(box.querySelector('[data-o="chart"]'), peerRates.map((d2) => d2.v), nt, taux0, sim.unite);
    };
    input.oninput = upd;
    upd();
  }
}

function histo(el, vals, cur, base, unite) {
  if (!el || !el.isConnected) return; // vue remplacée entre-temps
  const w = el.clientWidth || 500, h = 180, m = { t: 18, r: 10, b: 24, l: 30 };
  const x = d3.scaleLinear().domain(d3.extent([...vals, cur, ...(base != null ? [base] : [])])).nice().range([m.l, w - m.r]);
  const bins = d3.bin().domain(x.domain()).thresholds(x.ticks(20))(vals);
  const y = d3.scaleLinear().domain([0, d3.max(bins, (b) => b.length)]).nice().range([h - m.b, m.t]);
  const svg = d3.create("svg").attr("viewBox", `0 0 ${w} ${h}`).attr("width", "100%");
  svg.append("g").attr("class", "axis").attr("transform", `translate(0,${h - m.b})`).call(d3.axisBottom(x).ticks(6).tickFormat((v) => fmt(v)).tickSizeOuter(0));
  svg.append("g").selectAll("rect").data(bins).join("rect").attr("x", (b) => x(b.x0) + 1).attr("width", (b) => Math.max(0, x(b.x1) - x(b.x0) - 2))
    .attr("y", (b) => y(b.length)).attr("height", (b) => y(0) - y(b.length)).attr("rx", 2).attr("fill", "var(--peer)").attr("fill-opacity", 0.6)
    .on("mousemove", (ev, b) => tip.show(`${fmt(b.x0)} – ${fmt(b.x1)} ${unite} : <b>${b.length}</b>`, ev)).on("mouseleave", () => tip.hide());
  const mark = (v, col, txt, anchor) => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", m.t - 4).attr("y2", h - m.b).attr("stroke", col).attr("stroke-width", 2);
    svg.append("text").attr("x", x(v) + (anchor === "end" ? -4 : anchor === "start" ? 4 : 0)).attr("y", m.t - 6).attr("text-anchor", anchor).style("fill", "var(--text-primary)").text(txt);
  };
  // Étiquettes de part et d'autre quand les deux repères sont proches ; une seule s'ils coïncident.
  const same = base != null && Math.abs(x(cur) - x(base)) < 2;
  if (base != null && !same) mark(base, "var(--peer)", S.lang === "nl" ? "huidig" : "actuel", cur >= base ? "end" : "start");
  mark(cur, "var(--series-1)", same ? (S.lang === "nl" ? "huidig" : "actuel") : (S.lang === "nl" ? "nieuw" : "nouveau"), same ? "middle" : cur >= base ? "start" : "end");
  el.replaceChildren(svg.node());
}

/* ---------- Données & sources ---------- */
function viewDonnees(app) {
  const m = S.meta;
  const st = (s) => (s || "").toLowerCase();
  const cls = (s) => (st(s).startsWith("obtenu") ? "obtenu" : /non|demander/.test(st(s)) ? "non" : "");
  const doms = m.domaines.filter((d) => d.n);
  const regs = ["Flandre", "Wallonie", "Bruxelles"];
  const nReg = Object.fromEntries(regs.map((r) => [r, S.communes.filter((c) => c.region === r).length]));
  app.innerHTML = `<h1 style="margin-bottom:6px">${t("donnees")}</h1>
    <p class="secondary" style="margin-top:0">${S.lang === "nl" ? "Gegenereerd op" : "Données générées le"} ${esc(m.genere)} · ${m.indicateurs.length} ${t("indicateurs")} · ${m.sources.length} ${t("sources_obtenues")}.</p>
    <div class="card" style="margin-bottom:14px"><h2>${S.lang === "nl" ? "Methode" : "Méthode"}</h2><ul class="secondary" style="margin:8px 0 0;padding-left:18px">${(S.lang === "nl" ? [
        "Vergelijkingen gebeuren altijd binnen hetzelfde gewest: de wettelijke en budgettaire kaders verschillen.",
        "Vergelijkbare gemeenten: zelfde grootteklasse, zelfde Belfius-cluster (sociaaleconomische typologie 2017) of zelfde provincie.",
        "Het referentiejaar is het recentste jaar waarvoor minstens de helft van de vergelijkbare gemeenten een waarde heeft; projecties tellen nooit als huidige waarde.",
        "Status: ‘gunstig’ in het beste kwart, ‘op te volgen’ in het slechtste kwart, volgens de richting van de indicator (hoger of lager is beter). Beschrijvende indicatoren tonen enkel het percentiel.",
        "Absolute aantallen en bedragen worden omgerekend per inwoner of per 1 000 inwoners om gemeenten van verschillende grootte te vergelijken.",
        "Gemeentefusies van 2019 en 2025: alle gegevens zijn omgezet naar de 565 gemeenten van 2025 (sommen of gemiddelden).",
      ] : [
        "Les comparaisons se font toujours au sein d'une même région : les cadres légaux et budgétaires diffèrent.",
        "Communes comparables : même classe de taille, même cluster Belfius (typologie socio-économique 2017) ou même province.",
        "L'année de référence est la plus récente pour laquelle au moins la moitié des communes comparables ont une valeur ; une projection n'est jamais traitée comme une valeur actuelle.",
        "Statut : « favorable » dans le meilleur quart, « à surveiller » dans le moins bon quart, selon le sens de l'indicateur (plus haut ou plus bas est favorable). Un indicateur descriptif n'affiche que son percentile.",
        "Les comptages et montants absolus sont rapportés à la population (par habitant ou pour 1 000 habitants) pour comparer des communes de tailles différentes.",
        "Fusions de communes de 2019 et 2025 : toutes les données sont ramenées aux 565 communes de 2025 (sommes ou moyennes).",
      ]).map((x) => `<li style="margin-bottom:4px">${esc(x)}</li>`).join("")}</ul></div>
    <div class="card" style="margin-bottom:14px"><h2>${S.lang === "nl" ? "Dekking per domein" : "Couverture par domaine"}</h2><div class="table-wrap" style="max-height:none"><table><thead><tr><th>${S.lang === "nl" ? "Domein" : "Domaine"}</th><th class="r">${t("indicateurs")}</th>${regs.map((r) => `<th class="r">${regL(r)} (${S.lang === "nl" ? "max. gemeenten" : "communes max."})</th>`).join("")}</tr></thead><tbody>${
      doms.map((d) => { const is = m.indicateurs.filter((i) => i.domaine === d.id); return `<tr><td><a href="#/${lastNis() || "-"}/domaine/${d.id}">${esc(lbl(d))}</a></td><td class="r num">${is.length}</td>${regs.map((r) => { const mx = Math.max(0, ...is.map((i) => i.couverture[r] || 0)); return `<td class="r num">${mx} / ${nReg[r]}</td>`; }).join("")}</tr>`; }).join("")}</tbody></table></div></div>
    <div class="card"><div class="row between"><h2>Sources</h2><select id="sfilt"><option value="">${S.lang === "nl" ? "Alle statussen" : "Tous les statuts"}</option><option value="obtenu">obtenu</option><option value="partiel">partiel</option><option value="non">${S.lang === "nl" ? "niet open / op te vragen" : "non ouvert / à demander"}</option></select></div>
    <div class="table-wrap" style="max-height:640px" id="stab"></div>
    <p class="note">${S.lang === "nl" ? "Bronnen die niet open zijn, vormen de lijst van gegevens om op te vragen of uit de interne systemen van de gemeente te koppelen." : "Les sources non ouvertes forment la liste des données à demander aux organismes ou à brancher depuis les systèmes internes de la commune."}</p></div>`;
  const draw = () => {
    const f = $("#sfilt").value;
    const rows = m.sources.filter((s) => !f || (f === "non" ? cls(s.statut) === "non" : st(s.statut).startsWith(f)));
    $("#stab").innerHTML = `<table><thead><tr><th>${S.lang === "nl" ? "Domein" : "Domaine"}</th><th>${S.lang === "nl" ? "Organisatie" : "Organisme"}</th><th>${S.lang === "nl" ? "Titel" : "Titre"}</th><th>${S.lang === "nl" ? "Niveau" : "Granularité"}</th><th>${S.lang === "nl" ? "Jaren" : "Années"}</th><th>${t("statut")}</th></tr></thead><tbody>${
      rows.map((s) => `<tr><td class="muted">${esc((doms.find((d) => d.id === s.dossier) || { fr: s.dossier }).fr || s.dossier)}</td><td>${esc(s.organisme)}</td><td>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.titre || s.source_id)}</a>` : esc(s.titre || s.source_id)}</td><td>${esc(s.granularite)}</td><td>${esc(s.annees)}</td><td><span class="status ${cls(s.statut)}">${esc(s.statut)}</span></td></tr>`).join("")}</tbody></table>`;
  };
  $("#sfilt").onchange = draw;
  draw();
}

/* ---------- Recherche, réglages, démarrage ---------- */
function norm(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
function setupSearch() {
  const q = $("#q"), box = $("#suggest");
  let items = [], on = 0;
  const show = () => {
    const v = norm(q.value.trim());
    if (!v) { box.classList.add("hidden"); return; }
    items = S.communes.filter((c) => norm(c.fr).includes(v) || norm(c.nl).includes(v) || c.nis === v)
      .sort((a, b) => (norm(a.fr).startsWith(v) ? 0 : 1) - (norm(b.fr).startsWith(v) ? 0 : 1) || b.pop - a.pop).slice(0, 12);
    on = 0;
    box.innerHTML = items.map((c, i) => `<div data-n="${c.nis}" class="${i === 0 ? "on" : ""}"><span>${esc(nomC(c))}</span><span class="muted">${esc(regL(c.region))}</span></div>`).join("");
    box.classList.toggle("hidden", !items.length);
  };
  const pick = (n) => { box.classList.add("hidden"); const r = route(); go(n, ["donnees"].includes(r.view) ? "cockpit" : r.view, r.view === "domaine" || r.view === "benchmark" ? r.a : undefined, r.view === "domaine" ? r.b : undefined); };
  q.addEventListener("input", show);
  q.addEventListener("focus", () => q.select());
  q.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      on = Math.max(0, Math.min(items.length - 1, on + (e.key === "ArrowDown" ? 1 : -1)));
      box.querySelectorAll("div").forEach((d, i) => d.classList.toggle("on", i === on));
      e.preventDefault();
    } else if (e.key === "Enter" && items[on]) pick(items[on].nis);
    else if (e.key === "Escape") box.classList.add("hidden");
  });
  box.addEventListener("mousedown", (e) => { const d = e.target.closest("[data-n]"); if (d) pick(d.dataset.n); });
  q.addEventListener("blur", () => setTimeout(() => box.classList.add("hidden"), 150));
}

function setupControls() {
  const pairs = $("#pairs");
  const fill = () => {
    pairs.innerHTML = [["taille", t("pairs_taille")], ["profil", t("pairs_profil")], ["prov", t("pairs_prov")], ["region", t("pairs_region")]]
      .map(([v, l]) => `<option value="${v}" ${S.pairs === v ? "selected" : ""}>${esc(l)}</option>`).join("");
  };
  fill();
  pairs.onchange = () => { S.pairs = pairs.value; try { localStorage.setItem("cc_pairs", S.pairs); } catch { /* */ } render(); };
  const lang = $("#lang");
  lang.value = S.lang;
  lang.onchange = () => { S.lang = lang.value; try { localStorage.setItem("cc_lang", S.lang); } catch { /* */ } fill(); render(); };
  $("#theme").onclick = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("cc_theme", root.dataset.theme); } catch { /* */ }
    render();
  };
  try { const th = localStorage.getItem("cc_theme"); if (th) document.documentElement.dataset.theme = th; } catch { /* */ }
}

async function init() {
  try {
    const [meta, communes, carte] = await Promise.all([getJSON("data/meta.json"), getJSON("data/communes.json"), getJSON("data/carte.json")]);
    S.meta = meta;
    S.communes = communes;
    communes.forEach((c) => (S.byNis[c.nis] = c));
    meta.indicateurs.forEach((i) => (S.ind[i.id] = i));
    S.geo = carte.map((g) => ({ nis: g.nis, f: { type: "Feature", geometry: { type: "MultiPolygon", coordinates: typeof g.rings === "string" ? JSON.parse(g.rings) : g.rings } } }));
    // d3.geoPath attend des anneaux extérieurs dans le sens horaire : on corrige ceux qui couvriraient le globe.
    for (const g of S.geo) if (d3.geoArea(g.f) > 2 * Math.PI) g.f.geometry.coordinates = g.f.geometry.coordinates.map((poly) => poly.map((ring) => ring.slice().reverse()));
    $("#foot").textContent = `Agilos · ${meta.indicateurs.length} ${t("indicateurs")} · ${meta.sources.length} ${t("sources_obtenues")} · ${meta.genere}`;
    setupSearch();
    setupControls();
    addEventListener("hashchange", render);
    let rz;
    addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(render, 250); });
    if (!location.hash && lastNis()) go(lastNis());
    else render();
  } catch (e) {
    $("#app").innerHTML = `<div class="card">Erreur de chargement : ${esc(e.message)}. ${location.protocol === "file:" ? "Ouvrez le site via un serveur local (py -m http.server) plutôt que directement depuis le disque." : ""}</div>`;
    console.error(e);
  }
}
init();
