# De Koppelbaas — Project Status

## Wat het is
Acquisitie-dashboard voor architectenbureau ARD/AtelierRuimDenkers. Koppelt ontwikkelaars aan kansen (vastgoedprojecten) tot matches die door een kanban-pipeline bewegen.

## Technische stack
- Single-file vanilla JS app: `index.html` (~3500 regels)
- Firebase Realtime Database (project: atelierruimdenkers-d47d6)
- GitHub Pages hosting: https://vitudia.github.io/koppelbaas/
- SHA-256 wachtwoord auth, dark mode, CSS custom properties
- Touch drag polyfill voor iOS/iPadOS
- Leaflet.js + OpenStreetMap/CartoDB voor kaartweergave
- Nominatim geocoding met Firebase caching

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
- Admin menu: wachtwoord wijzigen, backup/import, conversiepercentages, honorarium-defaults, uitloggen
- Login flow: auto-detect setup als geen hash, 4s timeout fallback
- Mobiel: tab-navigatie, stage-tabs, move-knoppen, geen selectie-highlight
- Lock-modus per match-kaart: vergrendelde kaarten niet versleepbaar naar andere kolom, slotje rechtsonder
- Styled confirm-modals overal (geen native confirm/alert)
- Verwijder-dialogen tonen impact: aantal koppelingen, honorarium dat verloren gaat
- Undo-toast bij match-verwijdering (6 seconden "Ongedaan maken" knop)
- Zoekbalken met ✕ clear-knop (CSS :not(:placeholder-shown))
- Scroll-behoud bij toggle dev in pick/coalition/editMatch modals (id="modal-scroll-list")
- Header-knoppen: uniforme hoogte (34px), vaste breedte icon-knoppen (36px), 18px iconen
- Mobiel: single-tap werkt (geen render bij niet-drag touchend), touch drag transparantie 0.15
- Verbindingsindicator rechtsonder in footer
- 10+ UX features: toast, zoekbalk, escape, dubbelklik, swipe tabs, haptic, lege-kolom berichten, dirty-modal warning, tab-tellers
- Print: landscape, geen marges
- Orphaned matches: matches met verwijderde kans tonen als rood kaartje met delete-knop

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
- Match-kaart 💰 icoontje met rood streepje alleen als honorarium ontbreekt (14px, duidelijk zichtbaar)
- Header: "€1.9M verwacht" knop (desktop) / "€1.9M" (mobiel) opent financieel overzicht
- Header stat "vrij" toont aantal ongematchte kansen (niet totaal)
- Geldbedragen tonen automatisch punten als duizendtal-scheiding (1.000.000) na invullen
- Pipeline kolomheaders: prominente weergave van honorarium + conversie% → gewogen waarde

### Kaartweergave
- Interactieve kaart-modal (🗺 knop in header) met alle kansen als pins
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
- Bereikbaar via admin-menu → "Handleiding openen"
- Zoekbalk filtert hoofdstukken op titel en inhoud
- In-app feedbackformulier in admin (Bug / Feature request → opgeslagen in meta/feedback)
- robots.txt + noindex meta tag tegen zoekmachine-indexering

## Bekende bugs (low priority, bewust niet gefixt)
- `_calcConfirmed` reset niet per modal-sessie (eenmaal bevestigd = vrij wijzigen, logisch gedrag)
- `editKansFromMatch` keert niet terug naar editMatch na sluiten (bekende UX-beperking)
- `honPct` ontbreekt als apart invoerveld in financieel overzicht BVO-rij (bewuste compactheid)
- Focus-restore in finEdit matcht op waarde, kan verkeerd veld focussen bij gelijke waarden
- Firebase kan arrays converteren naar objects bij concurrent edits (theoretisch risico, geen praktisch probleem)
- `stageHistory` groeit onbegrensd (verwaarloosbaar over tijd)
- Print preview niet grondig getest met nieuwe features

## Gepland: iCal contactmomenten (volgende sessie)
Feature: iCal-feed met geplande contactmomenten per match + signaleringssysteem.

### Concept
- Per match een **volgende contactdatum** instellen
- Signalering in 3 niveaus:
  - **Toekomst**: contactmoment gepland, nog niet verlopen
  - **Verlopen**: contactmoment is gepasseerd, actie nodig
  - **Lang verlopen**: significant over tijd (instelbare drempel)
- Tijdsspanne instelbaar in settings per pipeline-kolom (bijv. "verkennend: elke 2 weken") óf per individuele kaart (override)
- Na daadwerkelijk contact: vink zetten → mogelijkheid om volgende datum te prikken
- Systeem doet aanbeveling voor contactfrequentie op basis van pipeline-positie
- **iCal export**: .ics feed/bestand met alle geplande contactmomenten zodat ze in agenda verschijnen

### Benodigde velden per match
- `nextContact`: datum (volgende geplande contactmoment)
- `contactHistory`: array van {date, note} (contactlog)
- `contactInterval`: number (dagen, override per kaart, null = gebruik kolom-default)

### Benodigde velden in meta/settings
- `contactDefaults`: per stage een default interval in dagen
  - Bijv. matches: 14, verkennend: 10, offerte: 7, actief: 7

### UI-elementen
- Match-kaart: klein klok/kalender icoontje met kleur-indicator (groen/oranje/rood)
- Match-edit modal: contactsectie met datum-picker + contactlog
- Settings: default contactintervallen per kolom
- Header of admin: "iCal exporteren" knop → genereert .ics bestand
### iCal feed
- **Dynamische iCal URL** die je in Google Calendar / Apple Calendar / Outlook abonneert
- URL serveert altijd actuele contactmomenten uit Firebase (geen eenmalige export)
- Technisch: een aparte endpoint (bijv. `ical.html` of Firebase Cloud Function) die een .ics genereert bij elke request
- Alternatief zonder backend: een `webcal://` link die een statisch .ics bestand op GitHub Pages plaatst, periodiek bijgewerkt door de app zelf (bij elke save een .ics regenereren en opslaan)

## Gepland: Cash forecast (apart project)
- Aparte HTML-pagina, gekoppeld aan dezelfde Firebase
- Per maand facturatie-planning voor actieve/offerte projecten
- Pijplijnreserve voor verkennend/matches
- Wordt eerst los in Excel opgezet, daarna gekoppeld

## Development workflow
- Na elke JS-wijziging: syntax check met `node --check` op extracted script
- Altijd mergen naar main en pushen voor GitHub Pages deploy
- Footer is static (niet fixed) zodat kolom-borders doorlopen

## Bestanden
- `/home/user/koppelbaas/index.html` — de volledige app
- `/home/user/koppelbaas/seed.html` — testdata loader
- `/home/user/koppelbaas/robots.txt` — zoekmachine-blokkering
- `/home/user/koppelbaas/database.rules.json` — Firebase rules
- `/home/user/koppelbaas/firebase.json` — hosting config
