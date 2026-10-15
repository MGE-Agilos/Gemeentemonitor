// Point d'entrée du chatbot (version GitHub Pages) : monte le panneau et relie l'agent, les outils
// du tableau de bord et le SDK Anthropic. Le SDK n'appelle pas Anthropic directement : il passe par
// le relais Supabase budgets-chat, qui ajoute la clé API côté serveur. Les modules sont aussi
// exposés dans window.BCChat (tests).
import { renderMarkdown } from './md.js';
import { TOOLS, runTool } from './tools.js';
import { SYSTEM, contextNote } from './prompt.js';
import { Agent } from './agent.js';
import { mountUI } from './ui.js';
import { supabaseAuth, FUNCTION_URL } from './auth.js';

// SDK officiel à version figée, chargé seulement à la première question
const SDK_URL = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.128.0/+esm';
let Anthropic = null;
let errs = null; // classes d'erreur du SDK (injectables par les tests)
let auth = supabaseAuth; // remplaçable par les tests
let makeClient = async () => {
  if (!Anthropic) { Anthropic = (await import(SDK_URL)).default; errs = Anthropic; }
  return new Anthropic({
    apiKey: 'cle-gardee-par-le-relais', // ignorée : le relais utilise son secret
    baseURL: FUNCTION_URL,
    dangerouslyAllowBrowser: true,
    maxRetries: 2,
    defaultHeaders: { apikey: auth.publicKey },
    // jeton de session courant à chaque requête (il est rafraîchi par supabase-js)
    fetch: async (url, init = {}) => {
      const h = new Headers(init.headers);
      h.set('authorization', 'Bearer ' + (await auth.token()));
      h.delete('x-api-key');
      return fetch(url, { ...init, headers: h });
    },
  });
};

const BC = window.BC;
const run = (name, input) => runTool(name, input, window.BC, window.dash);

let model = 'claude-sonnet-5-5';
let agent = null;
let view = null;
let running = false;

const ui = mountUI({
  BC,
  onSend: (q) => ask(q, 'new'),
  onReset: () => { agent = null; carry = null; },
  onModel: (m) => { model = m; agent = null; carry = null; },
  onLogin: (email, password) => auth.signIn(email, password),
  onLogout: () => auth.signOut(),
});
// session déjà ouverte (elle est gardée par supabase-js dans ce navigateur) ; la réponse arrive après
// le chargement du client Supabase : on l'ignore si l'utilisateur s'est connecté entre-temps
const auth0 = auth;
auth0.email().then((e) => { if (auth === auth0 && !ui.user) ui.setUser(e); });

// un agent par conversation (remis à zéro par « Nouvelle conversation » ou un changement de modèle)
// après une session expirée, le client est recréé mais la conversation continue
let carry = null;
// vrai si l'historique (agent en cours ou conservé) attend encore une réponse de Claude
const pending = () => {
  const m = agent ? agent.messages : carry || [];
  return m.length > 0 && m[m.length - 1].role === 'user';
};
async function getAgent() {
  if (agent) return agent;
  const client = await makeClient();
  agent = new Agent({ client, model, tools: TOOLS, system: SYSTEM, runTool: run,
    onText: (d) => view && view.append(d), onTool: (names) => view && view.tool(names) });
  if (carry) { agent.messages = carry; carry = null; }
  return agent;
}

// mode : 'new' (nouvelle question), 'retry' (relancer la boucle), 'resend' (renvoyer la question)
async function ask(q, mode) {
  if (running) return;
  if (!ui.user) {
    ui.showLogin(ui.L("Connectez-vous d'abord.", 'Meld u eerst aan.'));
    if (mode !== 'new' && view) view.notice(ui.L('Connexion requise.', 'Aanmelding vereist.'), () => ask(q, mode));
    return;
  }
  running = true;
  ui.setBusy(true);
  if (mode === 'new') ui.addUser(q);
  view = ui.startAssistant();
  try {
    const a = await getAgent();
    const r = mode === 'retry' ? await a.retry() : await a.ask(contextNote(BC) + q);
    report(r);
  } catch (e) {
    fail(e, q);
  } finally {
    running = false;
    ui.setBusy(false);
  }
}

function report(r) {
  const L = ui.L;
  if (r.status === 'refusal') view.notice(L('Le modèle a refusé de répondre à cette question.', 'Het model weigerde deze vraag te beantwoorden.'));
  if (r.status === 'truncated' || r.status === 'truncated_tool') view.notice(L('Réponse tronquée.', 'Antwoord afgekapt.'));
  if (r.status === 'max_turns') view.notice(L("Trop d'étapes : reformulez la question plus simplement.", 'Te veel stappen: formuleer de vraag eenvoudiger.'));
}

function fail(e, q) {
  const L = ui.L, A = errs;
  const again = () => ask(q, pending() ? 'retry' : 'resend');
  // 401 : session absente ou expirée côté relais
  if (A && e instanceof A.AuthenticationError) {
    ui.setUser(null);
    if (agent) { carry = agent.messages; agent = null; }
    view.notice(L('Session expirée (401).', 'Sessie verlopen (401).'), again);
    ui.showLogin(L('Reconnectez-vous, puis cliquez sur « Réessayer ».', 'Meld u opnieuw aan en klik dan op “Opnieuw proberen”.'));
    return;
  }
  // 403 : compte absent de la liste blanche budgets.allowed_users
  if (A && e instanceof A.PermissionDeniedError) {
    view.notice(L("Ce compte n'est pas autorisé à utiliser l'assistant. Demandez l'accès à l'administrateur.", 'Dit account mag de assistent niet gebruiken. Vraag toegang aan de beheerder.'));
    return;
  }
  let msg;
  const quota = e && /quota/i.test(e.message || '');
  if (A && e instanceof A.RateLimitError) msg = quota
    ? L('Quota journalier atteint pour ce compte : réessayez demain.', 'Dagquotum bereikt voor dit account: probeer morgen opnieuw.')
    : L('Limite de débit atteinte : attendez quelques secondes.', 'Limiet bereikt: wacht enkele seconden.');
  else if (A && e instanceof A.APIConnectionError) msg = L("Connexion impossible avec l'API.", 'Geen verbinding met de API.');
  else if (A && e instanceof A.APIError) msg = L("Erreur de l'API ", 'API-fout ') + (e.status || '') + ' : ' + (e.message || '');
  else msg = L('Erreur : ', 'Fout: ') + (e && e.message ? e.message : String(e));
  view.notice(msg, again);
}

// lien du guide : index.html?ask=… ouvre le panneau avec la question, sans l'envoyer
try {
  const qs = new URLSearchParams(location.search);
  const q = qs.get('ask');
  if (q) {
    ui.prefill(q.slice(0, 500));
    qs.delete('ask');
    history.replaceState(null, '', location.pathname + (qs.toString() ? '?' + qs : '') + location.hash);
  }
} catch (e) { /* URL illisible : on ignore */ }

window.BCChat = {
  renderMarkdown, TOOLS, runTool: run, SYSTEM, contextNote, Agent,
  // tests : remplacent la création du client et la connexion (aucun appel réseau)
  setClientFactory(f, errors) { makeClient = f; errs = errors || null; agent = null; },
  async setAuth(a) { auth = a; agent = null; ui.setUser(await a.email()); },
};
