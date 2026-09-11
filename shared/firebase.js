// ════════════════════════════════════════════════════
// ARD — gedeelde Firebase-koppeling
// Verwacht dat de compat-SDK's (app, auth, database) al geladen zijn.
// ════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "AIzaSyCuOvghMPD0d_yKnhAhNHXbN72NosDRdKQ",
  authDomain: "atelierruimdenkers-d47d6.firebaseapp.com",
  databaseURL: "https://atelierruimdenkers-d47d6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "atelierruimdenkers-d47d6",
  storageBucket: "atelierruimdenkers-d47d6.firebasestorage.app",
  messagingSenderId: "534130177405",
  appId: "1:534130177405:web:05c134372ec52fa6b80814"
};

let db = null;
let auth = null;

function initFirebase() {
  if (db) return;
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
    db = firebase.database();
  } catch(e) {
    console.error('Firebase init fout:', e);
  }
}

// ─── Database-helpers ───────────────────────────
function fbSet(path, data) { return db.ref(path).set(data); }
function fbUpdate(path, data) { return db.ref(path).update(data); }
function fbRemove(path) { return db.ref(path).remove(); }
function fbPush(path, data) { const ref = db.ref(path).push(); ref.set(data); return ref.key; }
function fbMulti(updates) { return db.ref().update(updates); }

// ─── Auth ───────────────────────────────────────
// Authenticatie loopt via Firebase Authentication (e-mail + wachtwoord).
// Google verifieert het wachtwoord server-side; de database-rules laten
// uitsluitend ingelogde gebruikers toe. Accounts beheer je in de Firebase
// Console onder Authentication → Users.

// Nederlandse tekst bij de Firebase Auth-foutcodes die hier kunnen optreden
function authErrorText(e) {
  const code = (e && e.code) || '';
  // Lokaal previewen: de API-key staat alleen de live domeinen toe als referrer
  if (code.indexOf('requests-from-referer') !== -1) {
    return 'Dit adres staat niet in de API-key-restricties. Voeg het toe in Google Cloud Console → Credentials, of test op ard.atelierruimdenkers.nl.';
  }
  switch (code) {
    case 'auth/invalid-email':          return 'Ongeldig e-mailadres.';
    case 'auth/user-disabled':          return 'Dit account is geblokkeerd.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':     return 'E-mailadres of wachtwoord is onjuist.';
    case 'auth/too-many-requests':      return 'Te veel pogingen. Probeer het over een paar minuten opnieuw.';
    case 'auth/network-request-failed': return 'Geen verbinding. Controleer je internet.';
    case 'auth/weak-password':          return 'Wachtwoord te zwak: kies er een van minimaal 8 tekens.';
    case 'auth/requires-recent-login':  return 'Log opnieuw in en probeer het daarna nog een keer.';
    case 'auth/operation-not-allowed':  return 'E-mail/wachtwoord-login staat uit in Firebase.';
    default: return 'Fout: ' + ((e && e.message) || 'onbekend');
  }
}

// Poortwachter voor app-pagina's: draait onReady zodra er een sessie is,
// en stuurt anders terug naar de router (die het inlogscherm toont).
// Vuurt ook als er elders wordt uitgelogd — dan volgt alsnog de redirect.
function requireAuth(onReady) {
  initFirebase();
  if (!auth) {
    document.body.innerHTML = '<p style="padding:24px;font-family:Rubik,sans-serif">Kan Firebase niet initialiseren. Herlaad de pagina.</p>';
    return;
  }
  let entered = false;
  auth.onAuthStateChanged(user => {
    if (user) {
      if (entered) return;
      entered = true;
      onReady(user);
    } else {
      location.replace('index.html');
    }
  });
}

function logout() {
  if (auth) auth.signOut().finally(() => location.replace('index.html'));
  else location.replace('index.html');
}
