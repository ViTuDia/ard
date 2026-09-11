// ════════════════════════════════════════════════════
// ARD — gedeeld kleurenpalet en thema-schakelaar
// Licht/donker zit in JS omdat de apps kleuren ook buiten CSS gebruiken
// (inline styles, canvas, Leaflet-pins). De CSS-variabelen worden hier
// gezet, zodat shared/theme.css en de inline styles hetzelfde palet delen.
// ════════════════════════════════════════════════════

const LIGHT = {
  zwart:"#000000",wit:"#ffffff",geel:"#d9a300",grijs:"#878786",
  blauw:"#006f9d",rood:"#c22d0b",groen:"#007b2f",oranje:"#c97b1a",
  lichtgrijs:"#f4f3f1",zachtgrijs:"#e8e7e4",bg:"#fafaf9",
  header:"#d9a300",headerTxt:"#000000",headerSub:"#00000088",headerDiv:"#00000033",
  kaart:"#ffffff",kaartBorder:"#e8e7e4",panelBg:"#ffffff",selBg:"#ffffff",footerBg:"#ffffff",
  txtPrimary:"#000000",txtSecondary:"#878786",
  devSelBg:"#000000",devSelTxt:"#ffffff",devSelBorder:"#d9a300",
  devHlBg:"#e8f5e9",devHlBorder:"#007b2f",
  modalBg:"#ffffff",modalOverlay:"rgba(0,0,0,0.4)",inputBorder:"#e8e7e4",
  badgeBg:"#2a2a2a",badgeTxt:"#ffffff",
  catGroupBg:"#f7f6f4",catHeaderBg:"#eeedea",
};
const DARK = {
  zwart:"#000000",wit:"#ffffff",geel:"#d9a300",grijs:"#999999",
  blauw:"#4dabcf",rood:"#e85d3a",groen:"#2ea852",oranje:"#e0a030",
  lichtgrijs:"#2a2a2a",zachtgrijs:"#3a3a3a",bg:"#1a1a1a",
  header:"#252525",headerTxt:"#ffffff",headerSub:"#ffffff66",headerDiv:"#ffffff22",
  kaart:"#252525",kaartBorder:"#3a3a3a",panelBg:"#1e1e1e",selBg:"#222222",footerBg:"#1e1e1e",
  txtPrimary:"#e8e8e8",txtSecondary:"#999999",
  devSelBg:"#d9a300",devSelTxt:"#000000",devSelBorder:"#d9a300",
  devHlBg:"#1a3a1a",devHlBorder:"#2ea852",
  modalBg:"#2a2a2a",modalOverlay:"rgba(0,0,0,0.7)",inputBorder:"#4a4a4a",
  badgeBg:"#d9a300",badgeTxt:"#000000",
  catGroupBg:"#232323",catHeaderBg:"#2c2c2c",
};

// Voorkeur staat in localStorage (kb_dark) en geldt voor alle ARD-apps
function themeIsDark() { return localStorage.getItem('kb_dark') === '1'; }
function themeSetDark(v) { localStorage.setItem('kb_dark', v ? '1' : '0'); }
function themePalette(dark) { return (dark == null ? themeIsDark() : dark) ? DARK : LIGHT; }

// Zet het palet als CSS-variabelen op <html> + body
function applyPalette(c) {
  c = c || themePalette();
  const r = document.documentElement.style;
  Object.keys(c).forEach(k => r.setProperty('--' + k, c[k]));
  document.body.style.background = c.bg;
  document.body.style.color = c.txtPrimary;
}
