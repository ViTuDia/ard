# De Koppelbaas — Project Status

## Wat het is
Acquisitie-dashboard voor architectenbureau ARD/AtelierRuimDenkers. Koppelt ontwikkelaars aan kansen (vastgoedprojecten) tot matches die door een kanban-pipeline bewegen.

## Technische stack
- Single-file vanilla JS app: `index.html` (~3900 regels)
- Firebase Realtime Database (project: atelierruimdenkers-d47d6)
- GitHub Pages hosting: https://vitudia.github.io/koppelbaas/
- SHA-256 wachtwoord auth, dark mode, CSS custom properties
- Touch drag polyfill voor iOS/iPadOS
- Leaflet.js + OpenStreetMap/CartoDB voor kaartweergave
- Nominatim geocoding met Firebase caching + fallback zonder huisnummer
- Lucide-style inline SVG iconen (ico() helper, geen CDN dependency)
- Firebase Cloud Function voor iCal feed (functions/)

## Firebase config
- API key: AIzaSyCuOvghMPD0d_yKnhAhNHXbN72NosDRdKQ
- Database URL: https://atelierruimdenkers-d47d6-default-rtdb.europe-west1.firebasedatabase.app
- Rules: meta, devTypes, kansCats, devs, kansen, matches, users allemaal .read/.write true
- API key restriction: HTTP referrers (https://vitudia.github.io/*), API: Firebase Realtime Database only

## Git
- Repo: vitudia/koppelbaas (public)
- Wijzigingen altijd naar main mergen en pushen voor GitHub Pages deploy

## Voltooide features
- Complete kanban board (4 stages: matches, verkennend, offerte, actief)
- Ontwikkelaars-paneel met type-groepen, badges, highlight/selectie, inklapbare categorieën
- Kansen-paneel met categorie-groepen, in/uitklappen
- Match-kaarten met coalities, stage gates, alarmsysteem
- Drag & drop: desktop (HTML5) + touch (iOS polyfill met 200ms hold)
- Drag reorder: matches in pipeline, devTypes, kansCats, devs, kansen binnen én tussen categorieën
- Drag indicator: single fixed-positioned element, gap-centered, met geel bolletje (open cirkel)
- Drag indicator verdwijnt niet meer bij hover (visibility:hidden + elementFromPoint fallback)
- Kans naar pipeline slepen → opent pickDevs modal voor match-aanmaak
- Resizable divider tussen panelen en pipeline (standaard 600px: 300px per paneel)
- Cat-group visuele hiërarchie (achtergrond containers voor categorieën)
- Pipeline-kolommen met subtiele stage-kleur achtergrond (6% opacity), borders doorlopend tot footer
- Pipeline kolomheaders: altijd gelijke hoogte (min-height reservering ook zonder financiële data)
- Dark mode met 30+ kleurvariabelen
- Login flow: auto-detect setup als geen hash, 4s timeout fallback
- Mobiel: tab-navigatie (SVG iconen: users/map-pin/kanban), stage-tabs, move-knoppen, geen selectie-highlight
- Mobiel: header knoppen nowrap + compact, actie/drempel velden single-column
- Styled confirm-modals overal (geen native confirm/alert)
- Verwijder-dialogen tonen impact: aantal koppelingen, honorarium dat verloren gaat
- Undo-toast bij match-verwijdering (6 seconden "Ongedaan maken" knop)
- Toast "Opgeslagen" alleen bij daadwerkelijke wijzigingen (niet bij openen+sluiten)
- Zoekbalken met ✕ clear-knop (CSS :not(:placeholder-shown))
- Scroll-behoud bij elke renderModal() call (modal-body + modal-scroll-list)
- Modal focus behouden bij typen (render() slaat renderModal() over als input actief is in modal)
- Header-knoppen: uniforme hoogte (34px), vaste breedte icon-knoppen (36px), 18px iconen
- Mobiel: single-tap werkt (geen render bij niet-drag touchend), touch drag transparantie 0.15
- Verbindingsindicator + feedback-bolletje in footer (groen=geen feedback, rood=feedback ontvangen)
- 10+ UX features: toast, zoekbalk, escape, dubbelklik, swipe tabs, haptic, lege-kolom berichten, dirty-modal warning, tab-tellers
- Print: landscape, geen marges
- Orphaned matches: matches met verwijderde kans tonen als rood kaartje met delete-knop
- Alle iconen als inline Lucide SVG (ico() helper met 14 iconen, geen emoji's)
- Chevrons (.chev class): vaste breedte (14px) zodat tekst niet verspringt bij in/uitklappen
- Tekst-truncatie (ellipsis) op lange kans-namen in matchkaarten en kansen-paneel
- Input focus/hover stijlen in modals (gele rand focus, grijze rand hover, transitie)

### Feature-toggles
- Drie features aan/uit te zetten in instellingen (data blijft bewaard in Firebase):
  - **Financieel overzicht**: honorarium, verwachte omzet, calculator, €-icoon
  - **Vergrendeling**: slotjes op matchkaarten, voorkom verslepen naar andere kolom
  - **Actie-signalering**: bolletjes op kaarten, alarmen bij verlopen acties
- Toggles als schuifknoppen in instellingen-modal, werken via data-action click delegation
- Default: alle drie uit. Gebruiker zet aan wat nodig is

### Actie-signalering
- Per match een `nextAction` datumveld (volgende geplande actie)
- Gekleurde stip op matchkaart (12px): grijs=geen, groen=gepland, oranje=verlopen, rood=kritiek
- Actieve matches (Werk) zijn uitgesloten van actie-signalering — werk wordt elders bijgehouden
- Drempels instelbaar per pipeline-kolom in admin (default: matches 14d, verkennend 10d, offerte 7d)
- Per-kaart override mogelijk (`actionThreshold` veld in bewerkmodal)
- Alerts gegroepeerd in popup: "Koppelingen (X)" en "Acties (X)" apart
- "X matches zonder geplande actie" telling in alarmen
- Afspraken-overzicht: tabel-modal (klok-knop in header) met alle niet-actieve matches
  - Status-bolletje, bewerkbare datum, drempel per rij
  - Oranje/rood status consistent met drempel (custom of standaard)
  - Wijzigingen direct opgeslagen, status ververst live
- Todoist blijft het taaksysteem — Koppelbaas signaleert alleen welke matches aandacht nodig hebben

### Selectiebalk
- Twee inklapknoppen: "Panelen" (dev-categorieën + kansen) en "Pipeline" (matchkaarten)
- Reset-knop bij actieve selectie
- Gewogen omzet voor geselecteerde ontwikkelaar

### Header & menu
- Header: alerts knop → afspraken knop → verwacht knop → kaart knop → tandwiel-menu
- Stats (devs/vrij) verplaatst naar paneltitels: "Ontwikkelaars (15)", "Kansen (2)"
- Dropdown-menu onder tandwiel: Instellingen, Printen, Licht/Donker thema, Uitloggen, status-bolletjes (verbinding + feedback)
- Menu-items met hover-effect, sluit bij klik erbuiten
- Feedback-bolletje: groen = geen feedback, rood = feedback ontvangen (klikbaar naar Firebase console)
- Instellingen-modal (was "Admin") met secties: Features, Conversie%, Honorarium defaults, Actie-drempels, Agenda-feed, Backup & export, Handleiding, Feedback, Wachtwoord

### Matchkaart layout
- Titelrij: ▸ Naam (count) [lock] [€] [●actie] [Badge]
- Badge rechts in titelrij met stage.short (Match/Verkennend/Offerte/Werk)
- Actie-indicator als gekleurde stip (12px): grijs=geen, groen=gepland, oranje=verlopen, rood=kritiek
- € icoon altijd grijs zichtbaar (met rode streep als waarde ontbreekt)
- Actie-bolletje en € niet zichtbaar op actieve matches (Werk)
- Slotje alleen zichtbaar als vergrendeld
- BVO en functie samengevoegd op één regel: "BVO 5.000m² — Woningbouw"
- Adres met mapPin icoon, contact met user icoon, honorarium met € icoon

### Financieel
- Verwachte omzet tracking: per match honorarium, instelbare conversie-% per stage, gewogen pipeline-waarde in header + per kolom
- Honorariumcalculator: inklapbare calculator in match-edit modal met 3 berekeningswijzen:
  - BVO × bouwkosten/m² × honorarium%
  - Aantal units × prijs per unit
  - Vast bedrag (direct invullen)
- Calculator: geen re-render op oninput (inline DOM-update), confirm-dialoog pas op blur
- Calculator opent automatisch als honorarium nog niet ingevuld is
- Bureau-defaults in admin (€2.000/m², 4%) — gelden alleen voor nieuwe matches, bestaande matches worden niet gewijzigd
- BVO sync: wijzigen van BVO op een kans werkt automatisch door naar alle matches voor die kans (alleen bvo-type, niet units/fixed)
- Financieel overzicht: tabel-modal (820px breed, klik op "verwacht" knop) voor snel inline bewerken van alle matches
  - Bewerkbaar per rij: berekeningstype (BVO/Units/Vast), relevante velden, honorarium
  - Stage-groepskoppen met gekleurde achtergrond
  - Live in-place DOM-update bij wijzigingen (geen re-render, keyboard blijft open)
- Dev-omzet: bij selectie van een ontwikkelaar toont de selectiebalk het gewogen verwachte honorarium
- Match-kaart € icoontje altijd zichtbaar (met rood streepje als honorarium ontbreekt)
- Match-bewerkmodal: fase boven BVO/honorarium, rode labels bij lege verplichte velden (honorarium, volgende actie)
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
- Geocode fallback: als Nominatim adres niet vindt, retry zonder huisnummer
- Status toont altijd "X/Y locatie(s) geladen"
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
- `honPct` ontbreekt als apart invoerveld in financieel overzicht BVO-rij (bewuste compactheid)
- Print preview niet grondig getest met nieuwe features

## Gefixt (voorheen bekende bugs)
- `_calcConfirmed` reset nu per modal-sessie (was: eenmaal bevestigd = vrij wijzigen)
- `editKansFromMatch` keert nu terug naar editMatch via `_returnToEditMatch` state
- Focus-restore in finEdit gebruikt nu `data-mid`/`data-fld` attributen i.p.v. waarde-matching
- `asArr()` helper beschermt tegen Firebase array→object conversie in coals/links
- `stageHistory` begrensd tot max 50 entries (`.slice(-49)` op alle 4 plekken)
- Drag indicator verdwijnt niet meer bij hover (visibility:hidden + behoud laatste positie)
- Keyboard sluit niet meer bij typen in financieel overzicht/calculator (in-place DOM-updates)
- Honorarium confirm-dialoog pas op blur, niet per karakter
- `_calcConfirmed`/`_origHonorium` toegevoegd in alle editMatch-paden (alertGoToMatch, stageGate)
- Null check in finEdit totaalberekening (voorkom crash bij verwijderde match)
- Toast "Opgeslagen" alleen bij daadwerkelijke wijzigingen
- Chevrons vaste breedte (.chev class) — geen layout-shift bij in/uitklappen

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
- `/home/user/koppelbaas/seed.html` — testdata loader (met alle velden incl. lat/lng, features, nextAction)
- `/home/user/koppelbaas/robots.txt` — zoekmachine-blokkering
- `/home/user/koppelbaas/database.rules.json` — Firebase rules
- `/home/user/koppelbaas/firebase.json` — hosting + functions config
