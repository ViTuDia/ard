# COWORK INSTRUCTIE: ARD — De Koppelbaas — Firebase Web App

## PROJECT OVERZICHT

Bouw een web app voor **De Koppelbaas**: een acquisitie-dashboard waarmee architectenbureau ARD / AtelierRuimDenkers twee gelijkwaardige inputs (ontwikkelaars en kansen) koppelt tot matches die door een pipeline bewegen. De app draait als **statische single-page app op GitHub Pages** met **Firebase Realtime Database** als backend. Realtime sync zodat twee collega's tegelijk kunnen werken.

---

## KERNCONCEPT

Het board heeft drie zones:

```
| Ontwikkelaars | Kansen ||| Potentiële matches | Verkennend | Offerte | Werk |
|   (input)     | (input) |||              (pipeline / kanban)                |
|   250px       | 250px   |||              (flex, rest van scherm)            |
```

**Links**: twee gelijkwaardige inputpanelen — wie ken je (ontwikkelaars) en wat zie je (kansen).
**Rechts**: de pipeline — matches die ontstaan wanneer een kans aan ontwikkelaar(s) gekoppeld wordt.

Een kans kan meerdere matches hebben (met verschillende ontwikkelaars). Ongematchte kansen staan links. Gematchte kansen verdwijnen uit het linkerpaneel.

---

## REFERENTIE

Het werkende prototype staat in het bestand `matchbord-ard.jsx` (React component, ~657 regels). Dit is de **exacte feature- en design-referentie**. De web app moet identiek functioneren en er identiek uitzien, maar dan als standalone HTML/JS met Firebase.

---

## TECHNISCHE STACK

- **Frontend**: Eén `index.html` bestand met inline CSS en JavaScript (geen build tools)
- **Backend**: Firebase Realtime Database (bestaand project)
- **Hosting**: GitHub Pages (bestaande repo)
- **Auth**: Eén gedeeld wachtwoord (SHA-256 hash opgeslagen in Firebase, vergelijkt bij login)
- **Geen frameworks**: Vanilla JS, geen React, geen npm. Laad Firebase SDK via CDN.

---

## BOUWVOLGORDE

Gebruik **Plan mode** om het plan te bespreken, schakel dan over naar **Code mode** om te bouwen.

### Stap 1: `index.html`
De volledige app in één bestand:
- Firebase SDK laden via CDN
- Login-scherm met wachtwoordinvoer
- Na login: het volledige matchbord (zie FEATURES hieronder)
- Alle CSS inline in `<style>` tags
- Alle JS inline in `<script>` tags

### Stap 2: `database.rules.json`
Firebase security rules.

### Stap 3: `firebase.json`
Minimale project configuratie.

### Stap 4: `README.md`
Setup-instructies: Firebase config invullen, wachtwoord instellen, GitHub Pages activeren.

---

## DATA-STRUCTUUR (Firebase Realtime Database)

```
/devTypes/{id}
  - label: string (bijv. "Puur sang")
  - short: string (bijv. "PS", max 2 tekens, voor badge)
  - so: number (sortOrder, volgorde in paneel)

/kansCats/{id}
  - label: string (bijv. "Rotterdam", "Schiedam")
  - so: number (sortOrder)

/users/{id}
  - name: string (bijv. "Vincent", "Gideon")
  - short: string (bijv. "VT", "GP", max 2 tekens)
  - so: number (sortOrder)

/devs/{id}
  - name: string
  - tid: string (verwijst naar devType ID)
  - schaal: string
  - contact: string (contactpersoon)
  - notitie: string
  - so: number (sortOrder binnen type-groep)
  - createdAt: string (ISO datum, automatisch bij aanmaken)
  - updatedAt: string (ISO datum, automatisch bij elke wijziging)
  - ownerId: string | null (verwijst naar user ID, optioneel, voor toekomstig gebruik)

/kansen/{id}
  - name: string
  - cid: string (verwijst naar kansCat ID)
  - adres: string
  - omvang: string (m²)
  - type: string ("Wonen" | "Kantoor" | "Gemengd" | "Bedrijven" | "Collectief" | "Retail" | "Zorg" | "Anders")
  - notitie: string
  - contact: string (contactpersoon)
  - so: number (sortOrder binnen categorie)
  - createdAt: string (ISO datum, automatisch bij aanmaken)
  - updatedAt: string (ISO datum, automatisch bij elke wijziging)
  - ownerId: string | null (optioneel, voor toekomstig gebruik)

/matches/{id}
  - kid: string (verwijst naar kans ID)
  - links: [devId, ...] (array van individueel gekoppelde ontwikkelaar-IDs)
  - coals: [[devId, devId], ...] (array van coalitie-arrays)
  - stage: "matches" | "verkennend" | "offerte" | "actief"
  - notitie: string (notitie specifiek voor deze match, los van de kans-notitie)
  - col: boolean (collapsed/ingeklapt, default false)
  - so: number (sortOrder binnen kolom)
  - createdAt: string (ISO datum, automatisch bij aanmaken)
  - updatedAt: string (ISO datum, automatisch bij elke wijziging)
  - stageHistory: [{stage: string, at: string}, ...]
  - ownerId: string | null (optioneel, voor toekomstig gebruik) (array van fase-wisselingen, automatisch bijgehouden bij elke stage-wijziging. Eerste entry = aanmaakmoment.)

/meta
  - passwordHash: string (SHA-256 van het gedeelde wachtwoord)
```

---

## LAYOUT

### Header (gele balk, #d9a300, zwarte tekst)
- Links: ARD logo ("ARD" 26px bold + "ATELIERRUIMDENKERS" 8px) | "Acquisitie / De Koppelbaas"
- Rechts: tellerblokken (devs, kansen, matches), alert-knop ("⚠ X alerts", rood als er alerts zijn, zwart als niet), print-knop

### Selectiebalk (altijd zichtbaar, vaste hoogte 34px, witte achtergrond)
- Links: naam van geselecteerd item (met gele "/" prefix) of leeg
- Rechts: "▾ Alles inklappen" / "▸ Alles uitklappen" knop (klapt ALLE kaarten op het hele board in/uit: zowel kansen links als matches rechts). Plus "✕ Reset" knop als er een selectie actief is.
- **Belangrijk**: deze balk heeft altijd dezelfde hoogte, ongeacht selectie. Geen verspringen.

### Links: twee inputpanelen (elk 250px, totaal 500px, gescheiden door 2px rand rechts)

### Rechts: kanban pipeline (flex, rest van scherm, 4 kolommen)

### Footer
- "/ ARD / AtelierRuimDenkers — De Koppelbaas" + "Willem Buytewechstraat 45, Rotterdam"

---

## FEATURES: ONTWIKKELAARS-PANEEL (links, 250px)

- Titel "ONTWIKKELAARS" (13px, uppercase) + knop "+ Nieuw"
- Subtekst: "Klik om koppelingen te zien."
- Gegroepeerd per dynamisch type (uit `/devTypes`, gesorteerd op `so`)
- Per type-header: categorie-label (14px, fontWeight 600) + ✎ knop (bewerk type)
- Per ontwikkelaar binnen type (gesorteerd op `so`):
  - Naam (13px), schaal eronder (10px, grijs)
  - Rechts: koppelingenteller (X×) in blokje + ✎ knop
  - Ongekoppelde ontwikkelaar (0×): rode rand links (3px solid #c22d0b)
  - Klik: selecteert (zwart bg, gele rand links). Gekoppelde matches in pipeline lichten op. Rest vervaagt (opacity 0.15).
  - Klik op geselecteerde: deselecteert.
- "Geen categorie" groep voor ontwikkelaars zonder geldig type
- Onderaan: "+ Categorie" knop → opent modal met lege velden. Categorie wordt pas aangemaakt bij "Klaar" (niet bij openen modal).
- Badge per type: vierkant, 24px in header / 22px bij dev, kleur #2a2a2a, witte letters (afkorting uit devType.short)

### Highlight-gedrag ontwikkelaars
- Match geselecteerd in pipeline → gekoppelde ontwikkelaars: groene achtergrond (#e8f5e9), groene rand links
- Match geselecteerd → niet-gekoppelde ontwikkelaars: opacity 0.15
- Geen selectie: normale weergave

---

## FEATURES: KANSEN-PANEEL (links, 250px)

- Titel "KANSEN" (13px, uppercase) + fold/unfold knop (▾/▸, klapt alle kansen in/uit) + knop "+ Nieuw"
- Subtekst: "Koppel aan ontwikkelaar → match." (verandert bij drag: "Loslaten = match ontkoppelen")
- Drop-zone: match-kaarten uit pipeline kunnen hierheen gesleept worden → match wordt verwijderd, kans verschijnt weer als ongematchte kans. Visuele indicator bij dragover ("Hier loslaten" in geel gestippeld kader).
- **Alleen ongematchte kansen zichtbaar** — gematchte kansen verdwijnen uit dit paneel.
- Gegroepeerd per dynamisch gebied/categorie (uit `/kansCats`, gesorteerd op `so`)
- Per categorie-header: label (14px, fontWeight 600) + fold/unfold knop (▾/▸, klapt alle kansen in die categorie in/uit) + ✎ knop
- Per kans (gesorteerd op `so`):
  - **Inklapbaar**: klik op de titel-rij (chevron + naam) om in/uit te klappen. Ingeklapt: alleen titel + knoppen. Uitgeklapt: + m²/type, adres (klikbaar Google Maps). Info links uitgelijnd tegen de kaartrand (geen inspringing).
  - Rechts: "MATCH →" knop (badge-stijl: gele tekst, geel-tint achtergrond, gele rand) + ✎ knop
  - **Sleepbaar naar pipeline**: sleep een kans naar een pijplijnkolom → dev-picker opent → match wordt aangemaakt in die fase
- "Geen categorie" groep voor kansen zonder geldig gebied
- Onderaan: "+ Categorie" knop (zelfde gedrag als bij ontwikkelaars: pas aanmaken bij Klaar)

---

## FEATURES: PIPELINE / KANBAN (rechts, 4 kolommen)

### Kolommen

| ID | Label | Short (badge) | Subtitel | Kleur | Min. koppelingen | Toevoeg-knop |
|----|-------|---------------|----------|-------|-----------------|-------------|
| matches | Potentiële matches | Match | Kans + ontwikkelaar | #878786 | 2 | + Match |
| verkennend | Verkennende gesprekken | Verkennend | Gesprekken lopen | #d9a300 | 2 | + Verkennend gesprek |
| offerte | Offertetraject | Offerte | Concreet verzoek | #006f9d | 1 | + Offertetraject |
| actief | Lopend werk | Werk | In uitvoering | #007b2f | 1 | GEEN |

### Kolomheaders (vaste hoogte 88px, gelijk uitgelijnd)
- Titel (15px, fontWeight 600, kolomkleur) + fold/unfold knop rechts naast titel (▾/▸, zelfde hoogte als titel)
- Subtitel eronder (10px, grijs)
- Rechts: telgetal (24px, fontWeight 300, kolomkleur)
- Bij kolommen met min. 2: "Min. 2 koppelingen" tekst (8px, italic). Bij kolommen met min. 1: "Min. 1 koppeling" tekst. Alle kolommen op gelijke hoogte (spacer indien nodig).
- Gekleurde lijn onderaan header (3px solid kolomkleur) — op gelijke hoogte in alle kolommen.

### Toevoeg-knoppen (+ Match, + Verkennend gesprek, + Offertetraject)
- Klik → opent kans-kiezer modal (lijst van alle ongematchte kansen). Kies kans → opent dev-picker. Match belandt direct in die kolom.

### Match-kaarten
- **Drag & drop** tussen kolommen (wijzigt stage, toont stage gate als het een voorwaartse beweging is — zie STAGE GATES) én binnen kolommen (wijzigt sortOrder)
- **Drag naar kansen-paneel links** → match wordt verwijderd, kans wordt weer ongematchte kans
- **Inklapbaar** (▸/▾ chevron): ingeklapt = titel + koppelingsteller + stage-badge op één rij. Ingeklapte status (`col`) opgeslagen in Firebase.
- **Titel-rij** (altijd zichtbaar): chevron + kansnaam (wrapt naar meerdere regels indien nodig, geen afkapping) + stage-badge rechts (kolomkleur, korte naam). Badge en titel op één flex-rij, badge krimpt niet.
- **Rand links (5px)**:
  - Rood (#c22d0b) = 0 koppelingen (alle kolommen)
  - Oranje (#c97b1a) = 1 koppeling, maar min. 2 vereist (matches + verkennend)
  - Grijs (#e8e7e4) = voldoende koppelingen
- **Achtergrondkleur kaart**:
  - Rood-tint (rood + 18% alpha) bij 0 koppelingen (alle kolommen)
  - Oranje-tint (oranje + 18% alpha) bij 1 koppeling en min. 2 vereist
  - Wit bij voldoende
- **Uitgeklapte inhoud**:
  - m² + type (11px, grijs)
  - Adres (klikbaar → Google Maps, blauw)
  - Contactpersoon (11px, grijs, met 👤)
  - Match-notitie (11px, grijs, italic, afgekapt 50 tekens)
- **Koppelingen-sectie** (onder scheidingslijn):
  - Status-tekst: "⚠ Geen match" (rood) / "⚠ 1 match" (oranje, bij min. 2 kolommen) / "✓ X matches" (zwart)
  - Individuele koppelingen: badge + naam per regel, ✕ om te ontkoppelen
  - Coalities: gestippeld geel kader (#d9a300, 08% bg, 55% border). "Coalitie (klik om te bewerken)" header. Leden eronder met badge + naam. ✕ om te verwijderen (met bevestiging).
- **Actieknoppen** (onder scheidingslijn): "+ coalitie", "✎ bewerk"
- **Klik op kaart**: selecteert (glow border in kolomkleur). Gekoppelde ontwikkelaars in linkerpaneel lichten groen op.

### Belangrijke logica
- Coalitie-leden verschijnen NIET bij individuele koppelingen (geen dubbel)
- `totalLinks` = individuele links (exclusief coalitieleden) + aantal coalities
- Min. 2 koppelingen vereist in "matches" en "verkennend"
- Min. 1 koppeling vereist in "offerte" en "actief"
- Alle kolommen tonen alerts bij onvoldoende koppelingen
- Verwijderen ontwikkelaar → verwijdert uit alle links en coalities in alle matches
- Verwijderen kans → verwijdert alle matches van die kans
- Match terugsleepbaar naar kansenpaneel → match wordt verwijderd

---

## STAGE GATES (bevestiging bij fase-wissel)

Wanneer een match-kaart naar een volgende fase wordt gesleept, verschijnt een bevestigingsmodal met een checkbox. De kaart kan pas in de nieuwe kolom terechtkomen als de checkbox is aangevinkt. Dit voorkomt dat kaarten te snel doorschuiven zonder dat de bijbehorende actie daadwerkelijk is uitgevoerd.

### Gates per fase-overgang

| Naar fase | Vraag | Checkbox-tekst |
|-----------|-------|----------------|
| Verkennende gesprekken | "Verplaatsen naar Verkennende gesprekken?" | ☐ Gesprek gepland |
| Offertetraject | "Verplaatsen naar Offertetraject?" | ☐ Gevraagd een offerte te maken |
| Lopend werk | "Verplaatsen naar Lopend werk?" | ☐ Offerte goedgekeurd |

### Gedrag
- Gate verschijnt bij **slepen naar een volgende fase** én bij **fase-wissel via dropdown in bewerkmodal**
- Gate verschijnt NIET bij terugslepen naar een eerdere fase (correctie is altijd vrij)
- Gate verschijnt NIET bij verplaatsen binnen dezelfde kolom (sorteren)
- De checkbox begint altijd uitgevinkt
- "Bevestig" knop is disabled totdat checkbox is aangevinkt
- "Annuleer" = kaart blijft in de huidige kolom
- De gate-bevestiging wordt NIET opgeslagen in Firebase (het is een eenmalige check)

### Fasevolgorde (voor gate-logica)
```
matches (0) → verkennend (1) → offerte (2) → actief (3)
```
Gate verschijnt alleen als `nieuweIndex > huidigeIndex`.

---

## FEATURES: IN/UITKLAPPEN

Drie niveaus:

1. **Globaal**: "▾ Alles inklappen / ▸ Alles uitklappen" in de selectiebalk. Klapt ALLE kaarten op het hele board (kansen links + matches rechts) tegelijk in of uit.
2. **Per kolom/categorie**: ▾/▸ knop naast elke kolomtitel (pipeline) en naast elke categorienaam (kansen). Klapt alle kaarten in die groep.
3. **Per kaart**: ▾/▸ chevron op elke kaart individueel.

Match-inklapstatus (`col`) wordt opgeslagen in Firebase. Kans-inklapstatus is lokale UI-state (wordt niet opgeslagen).

---

## FEATURES: MODALS

1. **Kans-kiezer** (voor pipeline + knoppen): lijst van alle ongematchte kansen met naam, m², type. Klik → opent dev-picker.
2. **Dev-picker / Match maken**: selecteer 1+ ontwikkelaars met checkboxes (geel). Klik "Match" → match wordt aangemaakt.
3. **Match bewerken**: kans-info blok (niet bewerkbaar, met "Bewerk kans →" knop die naar kans-modal navigeert), notitie, fase (dropdown — bij voorwaartse fase-wissel verschijnt stage gate), ontwikkelaars (checkboxes, coalitieleden grijs + "coalitie" label), verwijder-knop.
4. **Ontwikkelaar bewerken**: naam, type (dropdown uit devTypes), schaal, contactpersoon, notitie, verwijder-knop.
5. **Kans bewerken**: naam, gebied (dropdown uit kansCats), adres, omvang, functie, contact, notitie, verwijder-knop.
6. **Coalitie vormen/bewerken**: selecteer 2+ ontwikkelaars. Bij bewerken: bestaande leden voorgeselecteerd. Opslaan/Annuleer.
7. **Categorie toevoegen** (devType): label + afkorting (max 2 tekens). Wordt PAS aangemaakt bij "Klaar", niet bij openen modal.
8. **Categorie toevoegen** (kansCat): naam. Wordt PAS aangemaakt bij "Klaar".
9. **Categorie bewerken** (devType of kansCat): label (+ afkorting bij devType). Verwijder-knop. Bij verwijderen type → ontwikkelaars vallen in "geen categorie". Bij verwijderen gebied → kansen vallen in "geen categorie".
10. **Bevestig verwijderen**: voor matches, ontwikkelaars, kansen, coalities, types, en gebieden. Altijd apart bevestigingsmodal.

---

## FEATURES: ALARMSYSTEEM

- Alert-knop in header: "⚠ X alerts" (rood als alerts > 0, zwart als 0)
- Alert = match met minder koppelingen dan het minimum van die kolom
- Per alarm in modal:
  - Rood bolletje + "Kansnaam — geen match (minstens X nodig)" bij 0 koppelingen
  - Oranje bolletje + "Kansnaam — 1 match (minstens 2 nodig)" bij 1 koppeling in kolommen die 2 vereisen
  - → knop navigeert naar match-bewerkscherm

---

## FEATURES: HIGHLIGHT/SELECTIE

- **Klik ontwikkelaar** → gekoppelde matches in pipeline lichten op (selectie-glow), rest vervaagt
- **Klik match-kaart** → gekoppelde ontwikkelaars links lichten groen op, rest vervaagt
- **Selectiebalk** toont naam + reset-knop
- Klik op al-geselecteerd item → deselecteert

---

## FEATURES: SORTEREN

- **Pipeline matches**: drag & drop binnen kolom herordent. `so` wordt herberekend.
- **Ontwikkelaars en kansen** in linkerpanelen: drag & drop herordent binnen groep (TODO voor Cowork — in mockup niet volledig geïmplementeerd, gebruik ▲/▼ als fallback indien drag te complex).
- **Categorieën** (devTypes en kansCats): herordenen via `so`. Implementeer als drag of als ▲/▼ knoppen.
- Nieuwe items krijgen `so` = hoogste waarde + 1.

---

## HUISSTIJL / DESIGN

### Font
Google Fonts: **Rubik** (wght 300, 400, 500, 600, 700)
- Light (300): lopende tekst, subtitels, details
- Regular (400): namen, kaartinhoud
- Medium (500): knoppen, labels
- SemiBold (600): kolomtitels, categoriekoppen

### Kleuren

| Naam | HEX | Gebruik |
|------|-----|---------|
| Zwart | #000000 | Tekst, knoppen |
| Wit | #ffffff | Kaarten, achtergronden |
| Mosterdgeel | #d9a300 | Header, accenten, coalities, verkennend-kolom, selectie, Match-knop |
| Grijs | #878786 | Subtitels, chevrons, matches-kolom |
| Blauw | #006f9d | Offerte-kolom, Google Maps links |
| Rood | #c22d0b | Alarm 0 koppelingen, verwijder-knoppen |
| Groen | #007b2f | Actief-kolom, highlight gekoppelde devs |
| Oranje | #c97b1a | Alarm 1 koppeling |
| Lichtgrijs | #f4f3f1 | Knop-achtergronden |
| Zachtgrijs | #e8e7e4 | Randen, scheidingslijnen |
| Badge-kleur | #2a2a2a | Alle ontwikkelaar-type badges (één kleur) |

### Branding
- Header: gele balk (#d9a300) met zwarte tekst
- "ARD" (26px, bold, letterspacing 3) + "ATELIERRUIMDENKERS" (8px, 300)
- Forward slash (/) als grafisch element in selectiebalk en footer
- Footer: "/ ARD / AtelierRuimDenkers — De Koppelbaas" + "Willem Buytewechstraat 45, Rotterdam"

---

## LOGIN-SCHERM

- Zwart scherm, ARD logo gecentreerd
- Wachtwoord-invoerveld + knop "Openen"
- SHA-256 hash vergelijken met `/meta/passwordHash`
- Sessie opslaan in localStorage
- Bij fout: foutmelding

---

## REALTIME SYNC

- Firebase `onValue` listeners op `/devs`, `/kansen`, `/matches`, `/devTypes`, `/kansCats`, `/users`
- Bij elke lokale wijziging: direct wegschrijven naar Firebase
- Last-write-wins (geen conflict-resolution nodig)

---

## FIREBASE CONFIG PLACEHOLDER

```javascript
const firebaseConfig = {
  apiKey: "JOUW-API-KEY",
  authDomain: "JOUW-PROJECT.firebaseapp.com",
  databaseURL: "https://JOUW-PROJECT-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "JOUW-PROJECT",
  storageBucket: "JOUW-PROJECT.appspot.com",
  messagingSenderId: "JOUW-SENDER-ID",
  appId: "JOUW-APP-ID"
};
```

---

## WAT NIET MEENEMEN

- Geen dummy-data in de code (database begint leeg, gebruiker voegt zelf toe)
- Geen React, geen npm, geen build tools
- Geen localStorage voor data (alleen voor sessie-token en dark mode)
- Geen datum-velden zichtbaar op kaarten (worden wel opgeslagen, niet getoond)
- Standaard devTypes en kansCats staan als voorbeeld in de README, niet hardcoded in de app

---

## TIMESTAMPS (onzichtbaar, automatisch)

Alle timestamps worden automatisch bijgehouden, nergens handmatig ingevoerd of zichtbaar op het board. Ze worden opgeslagen voor toekomstig gebruik (rapportages, doorlooptijden, stagnatie-detectie).

- **`createdAt`**: wordt gezet bij aanmaken van een dev, kans, of match. ISO-datumstring (bijv. "2026-03-25").
- **`updatedAt`**: wordt overschreven bij elke wijziging aan het record.
- **`stageHistory`** (alleen matches): bij elke fase-wissel wordt een entry toegevoegd: `{stage: "verkennend", at: "2026-03-25"}`. De eerste entry is het aanmaakmoment met de initiële stage. Entries worden nooit verwijderd, alleen toegevoegd. Dit maakt het later mogelijk om doorlooptijden per fase te berekenen.

---

## EIGENAARSCHAP (onzichtbaar, voorbereid)

Het datamodel bevat een `/users` collectie en `ownerId` velden op devs, kansen, en matches. Dit is voorbereid voor toekomstig gebruik (filteren per eigenaar, kleurcodering, "mijn matches" view). 

- **Nu**: de `/users` collectie en alle `ownerId` velden worden aangemaakt in de database-structuur maar zijn nergens zichtbaar in de UI. Geen dropdown, geen filter, geen badge.
- **Later**: eigenaar toewijzen via een dropdown in de bewerkmodals, filteren in de header, initialen-badge op kaarten.
- De `/users` collectie wordt beheerd via de Firebase console (niet via de app). Voorbeeld-entries in de README: `{name: "Vincent", short: "VT"}` en `{name: "Gideon", short: "GP"}`.

---

## DARK MODE

- Toggle-knop in de header (☾ / ☀), naast de alert- en print-knoppen
- Twee kleurschema's: LIGHT en DARK. Bij toggle wisselen alle kleuren naar het andere schema.
- Dark mode status opslaan in localStorage (niet in Firebase) zodat het per browser persoonlijk is.

### Dark mode kleuren

| Element | Light | Dark |
|---------|-------|------|
| Achtergrond | #fafaf9 | #1a1a1a |
| Header | #d9a300 (geel) | #252525 (donkergrijs) |
| Header tekst | #000000 | #ffffff |
| Panelen | #ffffff | #1e1e1e |
| Kaarten | #ffffff | #252525 |
| Kaartranden | #e8e7e4 | #3a3a3a |
| Primaire tekst | #000000 | #e8e8e8 |
| Secundaire tekst | #878786 | #999999 |
| Modal achtergrond | #ffffff | #2a2a2a |
| Modal overlay | rgba(0,0,0,0.4) | rgba(0,0,0,0.7) |
| Inputranden | #e8e7e4 | #4a4a4a |
| Dev-badge achtergrond | #2a2a2a | #d9a300 (geel) |
| Dev-badge tekst | #ffffff | #000000 |
| Geselecteerde dev achtergrond | #000000 | #d9a300 |
| Geselecteerde dev tekst | #ffffff | #000000 |
| Highlight gekoppeld | #e8f5e9 | #1a3a1a |
| Blauw (links) | #006f9d | #4dabcf |
| Rood (alarm) | #c22d0b | #e85d3a |
| Groen (actief) | #007b2f | #2ea852 |
| Oranje (1 match) | #c97b1a | #e0a030 |
| Stage badge achtergrond | lichte tint per kolom | donkere tint per kolom |

### Implementatie-aanpak
- Definieer twee objecten (LIGHT, DARK) met identieke keys
- Bij toggle: wissel het actieve kleurobject
- Alle styles lezen uit het actieve object (nooit hardcoded kleuren)
- **Belangrijk**: alle tekst gebruikt `txtPrimary` / `txtSecondary` — nooit hardcoded `#000000`. Dit geldt ook voor ontwikkelaarsnamen, koppelingstellers, en categorie-labels in de linkerpanelen.
- Stage-badge achtergrondkleuren passen zich aan per thema

---

## PRINT

- Alle knoppen, interactie-elementen, drag-handles verbergen (`data-noprint` → `display: none !important` in `@media print`)
- Kleuren behouden (`print-color-adjust: exact`)

---

## KWALITEITSEISEN

- Eén `index.html` bestand, volledig zelfstandig (behalve CDN-links)
- Werkt op desktop Chrome/Safari/Firefox
- Print-vriendelijk
- Responsive: bruikbaar op laptop-schermen (1280px+)
- Geen console-errors
- Clean code, goed leesbaar, met Nederlandse comments waar nuttig
