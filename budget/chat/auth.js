// Connexion Supabase (projet MGE-Agilos) : la session de l'utilisateur ouvre l'accès au relais
// budgets-chat, qui détient la clé API. Ici ne figurent que l'URL et la clé publique (anon /
// publishable) du projet, faites pour être dans une page web : la clé service_role n'y est jamais.

export const SUPABASE_URL = 'https://vxwmhsgxoomcbiukeinp.supabase.co';
// clé publique « anon » du projet (Settings → API), faite pour être dans une page web
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4d21oc2d4b29tY2JpdWtlaW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTMwODUsImV4cCI6MjA5MTgyOTA4NX0.DYfan7mRM0dYkB9xouBjb2Y1ONdmZxByrsr29nSZuAE';
export const FUNCTION_URL = SUPABASE_URL + '/functions/v1/budgets-chat';

// client officiel à version figée, chargé seulement quand on en a besoin
const SDK_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm';
let sb = null;
async function client() {
  if (!SUPABASE_ANON_KEY) throw new Error("configuration Supabase incomplète (clé publique manquante dans chat/auth.js)");
  if (!sb) {
    const { createClient } = await import(SDK_URL);
    sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, storageKey: 'bc-budgets-auth' } });
  }
  return sb;
}
const session = async () => (await (await client()).auth.getSession()).data.session;

export const supabaseAuth = {
  publicKey: SUPABASE_ANON_KEY,
  // email de la session en cours, ou null
  async email() {
    try { const s = await session(); return s && s.user ? s.user.email : null; } catch (e) { return null; }
  },
  // jeton d'accès courant (supabase-js le rafraîchit avant expiration)
  async token() { const s = await session(); return s ? s.access_token : ''; },
  // renvoie null si la connexion réussit, sinon le message d'erreur
  async signIn(email, password) {
    try {
      const { error } = await (await client()).auth.signInWithPassword({ email, password });
      return error ? error.message : null;
    } catch (e) { return e && e.message ? e.message : String(e); }
  },
  async signOut() { try { await (await client()).auth.signOut(); } catch (e) { /* déjà déconnecté */ } },
};
