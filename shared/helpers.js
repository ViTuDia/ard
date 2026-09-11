// ════════════════════════════════════════════════════
// ARD — gedeelde helpers
// Geen app-specifieke kennis: alles hier werkt zonder STATE.
// ════════════════════════════════════════════════════

// ─── De apps in deze repo ───────────────────────
// Eén lijst, zodat een nieuwe app op één plek wordt toegevoegd.
const ARD_APPS = [
  { id: 'koers',      naam: 'Koers',      file: 'koers.html',      omschrijving: 'Kwartaaldoelen en planning' },
  { id: 'koppelbaas', naam: 'Koppelbaas', file: 'koppelbaas.html', omschrijving: 'Ontwikkelaars koppelen aan kansen' },
  { id: 'kas',        naam: 'Kas',        file: 'kas.html',        omschrijving: 'Facturatie en cash forecast' },
  { id: 'inkopper',   naam: 'In-Kopper',  file: 'inkopper.html',   omschrijving: 'Nieuwsberichten op de website plaatsen' },
];

// Pills onder de gouden header. activeId = de app waar je nu bent.
function renderAppSwitcher(activeId) {
  return '<div class="app-switcher" data-noprint>' + ARD_APPS.map(a =>
    `<a class="app-pill${a.id === activeId ? ' active' : ''}" href="${a.file}">${esc(a.naam)}</a>`
  ).join('') + '</div>';
}

// Het ARD-blok linksboven. Klikbaar: brengt je terug naar het app-overzicht.
// Op de router zelf wijst het nergens heen — daar ben je al.
function renderBrand(label, naam, { home = true } = {}) {
  const logo = `<div>
        <div class="header-logo-ard">ARD</div>
        <div class="header-logo-sub">ATELIERRUIMDENKERS</div>
      </div>`;
  return `<div class="header-left">
      ${home ? `<a href="index.html" class="brand-home" title="Naar het app-overzicht">${logo}</a>` : logo}
      <div class="header-div"></div>
      <div>
        <div class="header-title-label">${esc(label)}</div>
        <div class="header-title-name">${esc(naam)}</div>
      </div>
    </div>`;
}

// Uitlog-icoon; zit niet in ico() omdat alleen de menu's het gebruiken
const ICO_LOGOUT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';
const ICO_GRID = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';

// Het tandwiel-menu. `extra` komt bovenaan, boven de vaste items.
function renderHeaderMenu({ dark, menuOpen, c, extra = [], print = true, home = true }) {
  const items = [
    ...extra,
    ...(home ? [{action:'gotoApps',icon:ICO_GRID,label:'Alle apps'}] : []),
    ...(print ? [{action:'print',icon:ico('printer',16),label:'Printen'}] : []),
    {action:'toggleDark',icon:dark?ico('sun',16):ico('moon',16),label:dark?'Licht thema':'Donker thema'},
    {action:'logout',icon:ICO_LOGOUT,label:'Uitloggen',color:c.rood}
  ];
  return `<div style="position:relative">
        <button title="Menu" class="btn header-btn header-btn-icon" style="background:${dark?'#444':'#000'}" data-action="toggleHeaderMenu"><span class="header-icon">${ico('settings',18)}</span></button>
        <div class="header-menu" style="display:${menuOpen?'block':'none'};position:absolute;right:0;top:100%;margin-top:4px;background:${c.kaart};border:1px solid ${c.zachtgrijs};border-radius:6px;box-shadow:0 4px 16px rgba(0,0,0,.15);min-width:200px;z-index:500;padding:4px 0">
          ${items.map(i => `<button style="display:flex;align-items:center;gap:10px;width:100%;padding:8px 14px;background:none;border:none;cursor:pointer;font-size:12px;font-family:inherit;color:${i.color||c.txtPrimary};text-align:left" onmouseover="this.style.background='${c.lichtgrijs}'" onmouseout="this.style.background='none'" data-action="${i.action}">${i.icon}<span>${i.label}</span></button>`).join('')}
        </div>
      </div>`;
}

// Gouden header met tandwiel-menu + app-switcher.
// Koppelbaas heeft een eigen variant omdat daar meer knoppen in de header staan,
// maar gebruikt wel renderBrand() en renderHeaderMenu() hieronder.
function renderAppShell({ label, naam, appId, dark, menuOpen, c, print = true }) {
  return `<div class="header">
    ${renderBrand(label, naam)}
    <div class="header-right">
      ${renderHeaderMenu({ dark, menuOpen, c, print })}
    </div>
  </div>` + renderAppSwitcher(appId);
}

// ─── Tekst en getallen ──────────────────────────
function esc(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function fmtEuro(n) {
  if (!n || n === 0) return '€0';
  if (n >= 1000000) return '€' + (n/1000000).toFixed(1).replace('.0','') + 'M';
  if (n >= 1000) return '€' + (n/1000).toFixed(1).replace('.0','') + 'K';
  return '€' + n;
}

const uid = () => Math.random().toString(36).substring(2,9);
const today = () => new Date().toISOString().split('T')[0];
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Firebase-objecten naar arrays ──────────────
// id komt bewust als laatste: de Firebase-sleutel wint van een id-veld in de data
function objToArr(obj) {
  if (!obj) return [];
  return Object.keys(obj).map(id => ({...obj[id], id}));
}
function sortedArr(obj) { return objToArr(obj).sort((a,b) => (a.so||0) - (b.so||0)); }
// Firebase maakt van een array soms een object; dit vangt dat af
function asArr(v) { return Array.isArray(v) ? v : []; }

// ─── Omgeving ───────────────────────────────────
function isMob() { return window.innerWidth < 768; }
function haptic() { if (navigator.vibrate) navigator.vibrate(30); }

// ─── Iconen (Lucide-stijl, inline SVG) ──────────
function ico(name,sz=18){const p={
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
printer:'<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
map:'<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',
settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
lockOpen:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
banknote:'<circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor" stroke="none">€</text>',
pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
mapPin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'
};return `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle">${p[name]||''}</svg>`;}

// ─── Toast ──────────────────────────────────────
let _undoTimer = null;
function showToast(msg, undoFn) {
  const t = document.getElementById('toast');
  if (!t) return;
  if (_undoTimer) { clearTimeout(_undoTimer); _undoTimer = null; }
  if (undoFn) {
    t.innerHTML = `<span>${esc(msg)}</span><button class="undo-btn" id="undo-btn">Ongedaan maken</button>`;
    document.getElementById('undo-btn').onclick = () => { undoFn(); t.classList.remove('show'); clearTimeout(_undoTimer); };
    t.classList.add('show');
    _undoTimer = setTimeout(() => t.classList.remove('show'), 6000);
  } else {
    t.innerHTML = esc(msg);
    t.classList.add('show');
    _undoTimer = setTimeout(() => t.classList.remove('show'), 2000);
  }
}
