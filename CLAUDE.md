# De Koppelbaas — Project Status

## Wat het is
Acquisitie-dashboard voor architectenbureau ARD/AtelierRuimDenkers. Koppelt ontwikkelaars aan kansen (vastgoedprojecten) tot matches die door een kanban-pipeline bewegen.

## Technische stack
- Single-file vanilla JS app: `index.html` (~3800 regels)
- Firebase Realtime Database (project: atelierruimdenkers-d47d6)
- GitHub Pages hosting: https://vitudia.github.io/koppelbaas/
- SHA-256 wachtwoord auth, dark mode, CSS custom properties
- Touch drag polyfill voor iOS/iPadOS
- Leaflet.js + OpenStreetMap/CartoDB voor kaartweergave
- Nominatim geocoding met Firebase caching
- Lucide-style inline SVG iconen (ico() helper, geen CDN dependency)
- Firebase Cloud Function voor iCal feed (functions/)

## Firebase config
- API key: AIzaSyCuOvghMPD0d_yKnhAhNHXbN72NosDRdKQ
- Database URL: https://atelierruimdenkers-d47d6-default-rtdb.europe-west1.firebasedatabase.app
- Rules: meta, devTypes, kansCats, devs, kansen, matches, users allemaal .read/.write true
- API key restriction: HTTP referrers (https://vitudia.github.io/*), API: Firebase Realtime Database only

## Git
- Repo: vitudia/koppelbaas (public)
- Wijzigingen altijd naar main pushen voor GitHub Pages deploy

## Voltooide features
- Complete kanban board (4 stages: matches, verkennend, offerte, actief)
- Ontwikkelaars-paneel met type-groepen, badges, highlight/selectie
- Kansen-paneel met categorie-groepen, in/uitklappen
- Match-kaarten met coalities, stage gates, alarmsysteem
- Drag & drop: desktop (HTML5) + touch (iOS polyfill met 200ms hold)
- Drag reorder: matches in pipeline, devTypes, kansCats, devs, kansen binnen én tussen categorieën
- Drag indicator: single fixed-positioned element, gap-centered, met geel bolletje (open cirkel)
- Kans naar pipeline slepen → opent pickDevs modal voor match-aanmaak
- Resizable divider tussen panelen en pipeline (standaard 600px: 300px per paneel)
- Cat-group visuele hiërarchie (achtergrond containers voor categorieën)
- Pipeline-kolommen met subtiele stage-kleur achtergrond (6% opacity), borders doorlopend tot footer
- Dark mode met 30+ kleurvariabelen
- Login flow: auto-detect setup als geen hash, 4s timeout fallback
- Mobiel: tab-navigatie (SVG iconen: users/map-pin/kanban), stage-tabs, move-knoppen, geen selectie-highlight
- Styled confirm-modals overal (geen native confirm/alert)
- Verwijder-dialogen tonen impact: aantal koppelingen, honorarium dat verloren gaat
- Undo-toast bij match-verwijdering (6 seconden "Ongedaan maken" knop)
- Zoekbalken met ✕ clear-knop (CSS :not(:placeholder-shown))
- Scroll-behoud bij elke renderModal() call (modal-body + modal-scroll-list)
- Header-knoppen: uniforme hoogte (34px), vaste breedte icon-knoppen (36px), 18px iconen
- Mobiel: single-tap werkt (geen render bij niet-drag touchend), touch drag transparantie 0.15
- Verbindingsindicator + feedback-bolletje in footer (zonder tekst)
- 10+ UX features: toast, zoekbalk, escape, dubbelklik, swipe tabs, haptic, lege-kolom berichten, dirty-modal warning, tab-tellers
- Print: landscape, geen marges
- Orphaned matches: matches met verwijderde kans tonen als rood kaartje met delete-knop
- Alle iconen als inline Lucide SVG (ico() helper met 14 iconen, geen emoji's)

### Feature-toggles
- Drie features aan/uit te zetten in instellingen (data blijft bewaard in Firebase):
  - **Financieel overzicht**: honorarium, verwachte omzet, calculator, €-icoon
  - **Vergrendeling**: slotjes op matchkaarten, voorkom verslepen naar andere kolom
  - **Actie-signalering**: klokjes op kaarten, alarmen bij verlopen acties
- Toggles als schuifknoppen in instellingen-modal, werken via data-action click delegation
- Default: alle drie uit. Gebruiker zet aan wat nodig is

### Actie-signalering
- Per match een `nextAction` datumveld (volgende geplande actie)
- Klokje-indicator op matchkaart (grijs=geen, groen=gepland, oranje=verlopen, rood=kritiek)
- Drempels instelbaar per pipeline-kolom in admin (default: matches 14d, verkennend 10d, offerte 7d, actief 7d)
- Per-kaart override mogelijk (`actionThreshold` veld in bewerkmodal)
- Verlopen/kritieke matches verschijnen in alarm-dropdown
- "X matches zonder geplande actie" telling in alarmen
- Todoist blijft het taaksysteem — Koppelbaas signaleert alleen welke matches aandacht nodig hebben

### Header & menu
- Header: stats (devs/vrij/matches) → spacer → alerts knop → verwacht knop → kaart knop → tandwiel-menu
- Dropdown-menu onder tandwiel: Instellingen, Printen, Licht/Donker thema, Uitloggen
- Menu-items met hover-effect, sluit bij klik erbuiten
- Instellingen-modal (was "Admin") met secties: Features, Conversie%, Honorarium defaults, Actie-drempels, Agenda-feed, Backup & export, Handleiding, Feedback, Wachtwoord

### Matchkaart layout
- Titelrij: ▸ Naam (count) [lock] [clock] [€] [Badge]
- Badge rechts in titelrij met stage.short (Match/Verkennend/Offerte/Werk)
- BVO en functie samengevoegd op één regel: "BVO 5.000m² — Woningbouw"
- Adres met mapPin icoon, contact met user icoon, honorarium met € icoon

### Financieel
- Verwachte omzet tracking: per match honorarium, instelbare conversie-% per stage, gewogen pipeline-waarde in header + per kolom
- Honorariumcalculator: inklapbare calculator in match-edit modal met 3 berekeningswijzen:
  - BVO × bouwkosten/m² × honorarium%
  - Aantal units × prijs per unit
  - Vast bedrag (direct invullen)
- Calculator opent automatisch als honorarium nog niet ingevuld is
- Bureau-defaults in admin (€2.000/m², 4%) — gelden alleen voor nieuwe matches, bestaande matches worden niet gewijzigd
- BVO sync: wijzigen van BVO op een kans werkt automatisch door naar alle matches voor die kans (alleen bvo-type, niet units/fixed)
- Financieel overzicht: tabel-modal (klik op "verwacht" knop) voor snel inline bewerken van alle matches
  - Bewerkbaar per rij: berekeningstype (BVO/Units/Vast), relevante velden, honorarium
  - Stage-groepskoppen met gekleurde achtergrond
  - Live visuele feedback bij wijzigingen
- Dev-omzet: bij selectie van een ontwikkelaar toont de selectiebalk het gewogen verwachte honorarium
- Match-kaart € icoontje met rood streepje alleen als honorarium ontbreekt
- Header stat "vrij" toont aantal ongematchte kansen (niet totaal)
- Geldbedragen tonen automatisch punten als duizendtal-scheiding (1.000.000) na invullen
- Pipeline kolomheaders: "Min. X koppelingen" tekst + honorarium + conversie% → gewogen waarde

### Kaartweergave
- Interactieve kaart-modal (kaart-knop in header) met alle kansen als pins
- Leaflet.js + CartoDB Positron (light) / Dark Matter (dark mode)
- Pins gekleurd per pipeline-stage: rood=ongematcht, grijs/geel/blauw/groen=stage
- Rode/oranje rand op pins bij alert-status (te weinig koppelingen)
- Popup bij klik: kansnaam, adres, stage-badge, BVO, alert-info, "Bewerk kans →"
- Geocoding via Nominatim (gratis, 1 req/sec), coördinaten gecached in Firebase op kans-object (lat/lng)
- Cache-invalidatie bij adreswijziging
- Na bewerken kans vanuit kaart → terug naar kaart (ook via Escape)
- Legenda met kleurbetekenis + alert-indicators

### Help & Feedback
- Help-modal met 11 doorzoekbare hoofdstukken (compact, 2-4 regels per hoofdstuk)
- Bereikbaar via menu → Instellingen → "Handleiding openen"
- Bij sluiten help-modal → terug naar instellingen-modal
- Zoekbalk filtert hoofdstukken op titel en inhoud
- In-app feedbackformulier in instellingen (Bug / Feature request → opgeslagen in meta/feedback)
- robots.txt + noindex meta tag tegen zoekmachine-indexering

### iCal feed (nog niet gedeployd)
- Firebase Cloud Function in `functions/` map
- Genereert .ics bestand met alle matches die een nextAction datum hebben
- Rollende datums: verlopen events verschijnen op vandaag (elke dag terug tot afgehandeld)
- Events bevatten: kansnaam, fase, ontwikkelaars, notitie
- Token-beveiliging: URL bevat `?token=` parameter, token opgeslagen in `meta/icalToken`
- Token genereerbaar via instellingen → "Genereer feed-URL"
- Vereist Firebase Blaze plan voor deployment

### Backup & export
- JSON backup (volledige database, excl. password hash)
- CSV export (puntkomma-separator + BOM voor Excel)
- Backup import met herstel

## Bekende bugs (low priority, bewust niet gefixt)
- `_calcConfirmed` reset niet per modal-sessie (eenmaal bevestigd = vrij wijzigen, logisch gedrag)
- `editKansFromMatch` keert niet terug naar editMatch na sluiten (bekende UX-beperking)
- `honPct` ontbreekt als apart invoerveld in financieel overzicht BVO-rij (bewuste compactheid)
- Focus-restore in finEdit matcht op waarde, kan verkeerd veld focussen bij gelijke waarden
- Firebase kan arrays converteren naar objects bij concurrent edits (theoretisch risico, geen praktisch probleem)
- `stageHistory` groeit onbegrensd (verwaarloosbaar over tijd)
- Print preview niet grondig getest met nieuwe features

## Security
- Auth is client-side (localStorage flag), bewust eenvoudig gehouden
- Password hash (unsalted SHA-256) leesbaar/overschrijfbaar via open Firebase rules — acceptabel risico voor deze app
- Backup export sluit passwordHash uit
- iCal feed beveiligd met token (meta/icalToken)
- XSS: esc() functie consistent toegepast op alle user data in HTML

## Gepland: Cloud Function deployen
- Blaze plan activeren op Firebase project
- `cd functions && npm install && firebase deploy --only functions`
- Daarna: in app → Instellingen → "Genereer feed-URL" → URL kopiëren naar agenda

## Gepland: Cash forecast (apart project)
- Aparte HTML-pagina, gekoppeld aan dezelfde Firebase
- Per maand facturatie-planning voor actieve/offerte projecten
- Pijplijnreserve voor verkennend/matches
- Wordt eerst los in Excel opgezet, daarna gekoppeld

## Development workflow
- Na elke JS-wijziging: syntax check met `node --check` op extracted script
- Altijd mergen naar main en pushen voor GitHub Pages deploy
- Footer is static (niet fixed) zodat kolom-borders doorlopen
- ico() helper voor SVG iconen: ico('name', size) — geen externe dependencies

## Bestanden
- `/home/user/koppelbaas/index.html` — de volledige app
- `/home/user/koppelbaas/functions/index.js` — iCal Cloud Function
- `/home/user/koppelbaas/functions/package.json` — Cloud Function dependencies
- `/home/user/koppelbaas/seed.html` — testdata loader
- `/home/user/koppelbaas/robots.txt` — zoekmachine-blokkering
- `/home/user/koppelbaas/database.rules.json` — Firebase rules
- `/home/user/koppelbaas/firebase.json` — hosting + functions config
