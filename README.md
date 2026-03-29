# De Koppelbaas — ARD / AtelierRuimDenkers

Acquisitie-dashboard: koppel ontwikkelaars aan kansen tot matches die door een pipeline bewegen.

## Setup

### 1. Firebase project

1. Ga naar [Firebase Console](https://console.firebase.google.com/) en maak een project aan (of gebruik een bestaand project).
2. Activeer **Realtime Database** (regio: `europe-west1`).
3. Ga naar **Project Settings > General** en kopieer de Firebase config.
4. Open `index.html` en vul de `firebaseConfig` waarden in:

```javascript
const firebaseConfig = {
  apiKey: "jouw-api-key",
  authDomain: "jouw-project.firebaseapp.com",
  databaseURL: "https://jouw-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jouw-project",
  storageBucket: "jouw-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 2. Wachtwoord instellen

Bij de eerste keer openen detecteert de app automatisch dat er nog geen wachtwoord is. Je krijgt een setup-scherm waar je direct een wachtwoord kiest. Het wachtwoord wordt als SHA-256 hash opgeslagen in Firebase (`/meta/passwordHash`).

Het wachtwoord kan later gewijzigd worden via het **Admin-menu** (⚙ knop in de header).

### 3. Database rules deployen

```bash
firebase deploy --only database
```

Of kopieer de inhoud van `database.rules.json` handmatig naar de Firebase Console > Realtime Database > Rules.

### 4. GitHub Pages

1. Push alle bestanden naar je GitHub repo.
2. Ga naar **Settings > Pages** en selecteer de branch (bijv. `main`) en root (`/`).
3. De app is beschikbaar op `https://jouw-gebruiker.github.io/koppelbaas/`.

## Optionele seed-data

Via de Firebase Console kun je begindata toevoegen:

### Ontwikkelaar-types (`devTypes`)


### Kans-categorieeen (`kansCats`)


### Gebruikers (`users`)

