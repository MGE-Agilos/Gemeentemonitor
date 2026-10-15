// Panneau du chatbot : connexion, choix du modèle, messages, questions d'exemple et saisie.
// La clé API n'est jamais dans la page : elle reste dans Supabase, derrière le relais budgets-chat.
import { renderMarkdown } from './md.js';
import { buildHelp } from './help.js';

export const MODELS = [['claude-sonnet-5-5', 'Sonnet 5.5'], ['claude-opus-5-5', 'Opus 5.5']];

const EXAMPLES = [
  ['Quelles communes flamandes perdent le plus de Gemeentefonds par habitant entre 2027 et 2031 ?', 'Welke Vlaamse gemeenten verliezen tussen 2027 en 2031 het meest Gemeentefonds per inwoner?'],
  ['Combien de communes flamandes auront une AFM négative en 2031 après la réduction ?', 'Hoeveel Vlaamse gemeenten hebben in 2031 na de inkrimping een negatieve AFM?'],
  ['Pourquoi Knokke-Heist dépense-t-elle autant par habitant ?', 'Waarom geeft Knokke-Heist zoveel uit per inwoner?'],
  ["Simule une hausse de l'APB de 0,5 point à Malines et montre le résultat.", 'Simuleer een verhoging van de APB met 0,5 procentpunt in Mechelen en toon het resultaat.'],
];

const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

export function mountUI({ BC, onSend, onReset, onModel, onLogin, onLogout }) {
  const L = (fr, nl) => (BC.lang === 'nl' ? nl : fr);

  const open = el('button', 'bc-btn bcc-open'); open.id = 'bcc-open'; open.type = 'button';
  // Gemeentemonitor : le bouton prend la place du bouton « Assistent » de l'en-tête (toute l'application) ;
  // le guide a son propre lien dans l'en-tête. Page autonome : barre du tableau de bord.
  const slot = document.getElementById('gm-assist-slot');
  const host = document.querySelector('.bc-sticky-right');
  if (slot) slot.replaceChildren(open); else if (host) host.prepend(open); else document.body.append(open);
  // icône vers le guide d'utilisation de toute l'application (gids.html du site)
  const guideLink = el('a', 'bc-btn bcc-guidelink'); guideLink.id = 'bcc-guide-link';
  if (slot) guideLink.hidden = true;
  open.after(guideLink);

  const panel = el('aside', 'bcc-panel'); panel.id = 'bcc-panel'; panel.hidden = true;
  const head = el('div', 'bcc-head');
  const title = el('strong', 'bcc-title');
  const model = el('select', 'bcc-model');
  MODELS.forEach(([v, lab]) => model.append(new Option(lab, v)));
  const reset = el('button', 'bcc-link bcc-reset'); reset.type = 'button';
  const who = el('span', 'bcc-who');
  const logout = el('button', 'bcc-link bcc-logout'); logout.type = 'button'; logout.hidden = true;
  const close = el('button', 'bcc-close', '×'); close.type = 'button';
  // le panneau recouvre les boutons FR/NL de la page : il a son propre bouton de langue
  const lang = el('button', 'bc-btn bcc-lang'); lang.type = 'button';
  lang.addEventListener('click', () => {
    const next = BC.lang === 'nl' ? 'fr' : 'nl';
    // Gemeentemonitor : la langue de toute l'application (le module budget suit)
    const sel = document.getElementById('lang');
    if (sel && document.getElementById('gm-assist-slot')) { sel.value = next; sel.dispatchEvent(new Event('change')); return; }
    const b = document.querySelector(`.bc-lang button[data-lang="${next}"]`);
    if (b) b.click();
  });
  const tools = el('div', 'bcc-head-tools');
  const helpBtn = el('button', 'bcc-link bcc-help-btn'); helpBtn.type = 'button';
  tools.append(model, helpBtn, reset, who, logout);
  head.append(title, lang, close, tools);
  const note = el('p', 'bcc-note');
  // connexion Supabase (email + mot de passe) ; les comptes sont créés par l'administrateur
  const loginForm = el('form', 'bcc-login'); loginForm.id = 'bcc-login';
  const loginTitle = el('strong', 'bcc-login-title');
  const mail = el('input'); mail.id = 'bcc-login-email'; mail.type = 'email'; mail.autocomplete = 'username';
  const pw = el('input'); pw.id = 'bcc-login-pw'; pw.type = 'password'; pw.autocomplete = 'current-password';
  const loginBtn = el('button', 'bc-btn'); loginBtn.id = 'bcc-login-btn'; loginBtn.type = 'submit';
  const loginMsg = el('p', 'bcc-loginmsg');
  loginForm.append(loginTitle, mail, pw, loginBtn, loginMsg);
  const help = el('div', 'bcc-help'); help.hidden = true;
  const log = el('div', 'bcc-log'); log.setAttribute('aria-live', 'polite');
  const examples = el('div', 'bcc-examples');
  const form = el('form', 'bcc-form');
  const input = el('textarea'); input.id = 'bcc-input'; input.rows = 2;
  const send = el('button', 'bc-btn'); send.id = 'bcc-send'; send.type = 'submit';
  form.append(input, send);
  panel.append(head, note, loginForm, help, log, examples, form);
  document.body.append(panel);

  let busy = false, helpSeen = false, user = null;
  // défilement automatique seulement si l'utilisateur est déjà en bas
  const scroll = () => { if (log.scrollHeight - log.scrollTop - log.clientHeight < 40) log.scrollTop = log.scrollHeight; };
  const showLogin = (msg) => { loginForm.hidden = false; loginMsg.textContent = msg || ''; (mail.value ? pw : mail).focus(); };
  const setUser = (email) => {
    user = email || null;
    loginForm.hidden = !!user; logout.hidden = !user;
    who.textContent = user || '';
    if (user) loginMsg.textContent = '';
  };
  const setBusy = (b) => {
    busy = b; send.disabled = b; input.disabled = b;
    if (b) log.querySelectorAll('.bcc-err button').forEach((x) => x.remove()); // plus de « Réessayer » périmé
    examples.querySelectorAll('button').forEach((x) => { x.disabled = b; });
  };
  // le mode d'emploi prend la place de la conversation tant qu'il est ouvert
  const showHelp = (on) => {
    help.hidden = !on; log.hidden = on;
    examples.hidden = on || log.children.length > 0;
    helpBtn.textContent = on ? L('Retour à la conversation', 'Terug naar het gesprek') : L("Mode d'emploi", 'Handleiding');
    helpBtn.setAttribute('aria-expanded', String(on));
    if (on) help.scrollTop = 0;
  };
  const submit = (text) => {
    const q = String(text || '').trim();
    if (!q || busy) return;
    if (!user) { showLogin(L("Connectez-vous d'abord.", 'Meld u eerst aan.')); return; }
    input.value = ''; examples.hidden = true;
    onSend(q);
  };
  const relabel = () => {
    open.textContent = '💬 ' + L('Assistant', 'Assistent');
    guideLink.textContent = '📖 ' + L('Guide', 'Gids');
    guideLink.href = 'gids.html?lang=' + L('fr', 'nl');
    guideLink.title = L("Guide d'utilisation de l'application", 'Gebruikersgids van de toepassing');
    panel.setAttribute('aria-label', L('Assistant', 'Assistent'));
    title.textContent = L('Assistant du Moniteur communal', 'Assistent Gemeentemonitor');
    reset.textContent = L('Nouvelle conversation', 'Nieuw gesprek');
    logout.textContent = L('Se déconnecter', 'Afmelden');
    close.setAttribute('aria-label', L('Fermer', 'Sluiten'));
    lang.textContent = L('NL', 'FR');
    lang.setAttribute('aria-label', L('Nederlands', 'Français'));
    model.setAttribute('aria-label', L('Modèle', 'Model'));
    note.textContent = L(
      'Les chiffres viennent du tableau de bord : données compilées automatiquement, non validées officiellement.',
      'De cijfers komen uit het dashboard: automatisch samengestelde gegevens, niet officieel gevalideerd.');
    loginTitle.textContent = L('Connexion', 'Aanmelden');
    mail.placeholder = L('Adresse email', 'E-mailadres'); mail.setAttribute('aria-label', mail.placeholder);
    pw.placeholder = L('Mot de passe', 'Wachtwoord'); pw.setAttribute('aria-label', pw.placeholder);
    loginBtn.textContent = L('Se connecter', 'Aanmelden');
    input.placeholder = L('Posez une question sur une commune, un budget, un indicateur…', 'Stel een vraag over een gemeente, een begroting, een indicator…');
    input.setAttribute('aria-label', input.placeholder);
    send.textContent = L('Envoyer', 'Verzenden');
    help.replaceChildren(buildHelp(L, (q) => { showHelp(false); submit(q); }));
    showHelp(!help.hidden);
    examples.replaceChildren(...EXAMPLES.map((q) => {
      const b = el('button', 'bcc-ex', L(q[0], q[1])); b.type = 'button'; b.disabled = busy;
      b.addEventListener('click', () => submit(b.textContent));
      return b;
    }));
  };

  open.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) {
      relabel();
      // première ouverture sans connexion : le mode d'emploi explique comment commencer
      if (!user && !log.children.length && !helpSeen) { helpSeen = true; showHelp(true); }
      (loginForm.hidden ? input : mail).focus();
    }
  });
  close.addEventListener('click', () => { panel.hidden = true; });
  helpBtn.addEventListener('click', () => showHelp(help.hidden));
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const m = mail.value.trim(), p = pw.value;
    if (!m || !p) { showLogin(L('Indiquez votre email et votre mot de passe.', 'Geef uw e-mailadres en wachtwoord in.')); return; }
    loginBtn.disabled = true; loginMsg.textContent = L('Connexion…', 'Aanmelden…');
    const err = await onLogin(m, p);
    loginBtn.disabled = false;
    if (err) { showLogin(L('Connexion refusée : ', 'Aanmelden geweigerd: ') + err); return; }
    pw.value = ''; setUser(m.toLowerCase()); showHelp(false); input.focus();
  });
  form.addEventListener('submit', (e) => { e.preventDefault(); submit(input.value); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(input.value); } });
  reset.addEventListener('click', () => { if (busy) return; log.replaceChildren(); showHelp(false); onReset(); });
  logout.addEventListener('click', async () => {
    if (busy) return;
    await onLogout(); setUser(null); showLogin(L('Vous êtes déconnecté.', 'U bent afgemeld.'));
  });
  let modelPrev = model.value;
  model.addEventListener('change', () => {
    if (busy) { model.value = modelPrev; return; }
    modelPrev = model.value; log.replaceChildren(); showHelp(false); onModel(model.value);
  });
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { panel.hidden = true; open.focus(); } });
  document.addEventListener('click', (e) => { if (e.target.closest('.bc-lang button')) setTimeout(relabel, 0); });
  relabel(); setUser(null);

  return {
    L, showLogin, setUser, setBusy,
    get user() { return user; },
    // ouvre le panneau avec une question prête à être envoyée (lien du guide)
    prefill(q) {
      if (panel.hidden) open.click();
      showHelp(false);
      input.value = q;
      if (user) input.focus(); else showLogin(L('Connectez-vous, puis envoyez la question.', 'Meld u aan en verzend dan de vraag.'));
    },
    addUser(text) { showHelp(false); log.append(el('div', 'bcc-msg bcc-user', text)); log.scrollTop = log.scrollHeight; },
    startAssistant() {
      const box = el('div', 'bcc-msg bcc-bot');
      const tools = el('div', 'bcc-tools'); tools.hidden = true;
      const body = el('div', 'bcc-body');
      box.append(tools, body); log.append(box);
      let text = '';
      return {
        append(d) { text += d; body.replaceChildren(renderMarkdown(text)); scroll(); },
        tool(names) {
          tools.hidden = false;
          tools.textContent = (tools.textContent ? tools.textContent + ' · ' : '🔧 ') + names.join(' · ');
          if (text) text += '\n\n';
          scroll();
        },
        notice(msg, retry) {
          const n = el('div', 'bcc-err', msg);
          if (retry) {
            const b = el('button', 'bcc-link', L('Réessayer', 'Opnieuw proberen')); b.type = 'button';
            b.addEventListener('click', () => { n.remove(); retry(); });
            n.append(' ', b);
          }
          box.append(n); scroll();
        },
      };
    },
  };
}
