# De Koppelbaas — Project Status

## Wat het is
Acquisitie-dashboard voor architectenbureau ARD/AtelierRuimDenkers. Koppelt ontwikkelaars aan kansen (vastgoedprojecten) tot matches die door een kanban-pipeline bewegen.

## Technische stack
- Single-file vanilla JS app: `index.html` (~3200+ regels)
- Firebase Realtime Database (project: atelierruimdenkers-d47d6)
- GitHub Pages hosting: https://vitudia.github.io/koppelbaas/
- SHA-256 wachtwoord auth, dark mode, CSS custom properties
- Touch drag polyfill voor iOS/iPadOS

## Firebase config
- API key: AIzaSyCuOvghMPD0d_yKnhAhNHXbN72NosDRdKQ
- Database URL: https://atelierruimdenkers-d47d6-default-rtdb.europe-west1.firebasedatabase.app
- Rules: meta, devTypes, kansCats, devs, kansen, matches, users allemaal .read/.write true
- API key restriction: HTTP referrers (https://vitudia.github.io/*), API: Firebase Realtime Database only

## Git
- Repo: vitudia/koppelbaas (private)
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
- Honorariumcalculator: inklapbare calculator in match-edit modal (BVO × bouwkosten/m² × honorarium%), auto-fill honorarium
- Calculator opent automatisch als honorarium nog niet ingevuld is
- Bureau-defaults in admin (€2.000/m², 4%) — gelden alleen voor nieuwe matches, bestaande matches worden niet gewijzigd
- BVO sync: wijzigen van BVO op een kans werkt automatisch door naar alle matches voor die kans
- Financieel overzicht: tabel-modal (klik op "verwacht" stat) voor snel inline bewerken van alle matches
- Dev-omzet: bij selectie van een ontwikkelaar toont de selectiebalk het gewogen verwachte honorarium
- Match-kaart 💰 icoontje met rood streepje alleen als honorarium ontbreekt
- Header stat "vrij" toont aantal ongematchte kansen (niet totaal)

### Help
- Help-modal met 11 doorzoekbare hoofdstukken (overzicht, devs, kansen, pipeline, matches, coalities, financieel, alerts, instellingen, mobiel, tips)
- Bereikbaar via admin-menu → "Handleiding openen"
- Zoekbalk filtert hoofdstukken op titel en inhoud

## Bekende aandachtspunten
- Print preview kan nog beter (was eerder leeg, nu gefixed maar niet grondig getest)
- ▲/▼ knoppen voor sortering ontbreken (spec: optioneel, drag werkt)
- Firebase API key is publiek (by design), beveiligd via HTTP referrer restriction
- Bij custom domain (bijv. koppelbaas.atelierruimdenkers.nl) moet de referrer restriction uitgebreid worden

## Development workflow
- Na elke JS-wijziging: syntax check met `node --check` op extracted script
- Altijd mergen naar main en pushen voor GitHub Pages deploy
- Footer is static (niet fixed) zodat kolom-borders doorlopen

## Bestanden
- `/home/user/koppelbaas/index.html` — de volledige app
- `/home/user/koppelbaas/seed.html` — testdata loader
- `/home/user/koppelbaas/database.rules.json` — Firebase rules
- `/home/user/koppelbaas/firebase.json` — hosting config
