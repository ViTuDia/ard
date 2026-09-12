// ════════════════════════════════════════════════════
// KOERS — datamodel en statuslogica
//
// De legenda van de roadmap is hier de bron van waarheid. Elke kleur
// beantwoordt één van twee vragen: in welke FASE zit dit (groen → geel),
// of wat was de UITKOMST (oranje / roze / grijs).
//
// Kerngedachte: alleen de voorbereiding loopt over de tijd. De rest zijn
// stempels op één cel. Oranje staat altijd op de maand waarin het doel
// écht af was — niet op de geplande maand.
// ════════════════════════════════════════════════════

// ─── Statussen ──────────────────────────────────
// Wat hier staat wordt opgeslagen; 'beslissing-open' niet (zie koersStatus).
const KOERS_STATUS = {
  gepland:     { label: 'Doel',                    kleur: 'geel',   loopt: true  },
  gehaald:     { label: 'Doel gehaald',            kleur: 'oranje', loopt: false },
  bijgesteld:  { label: 'Bijgesteld',              kleur: 'roze',   loopt: false },
  verschoven:  { label: 'Verschoven / uitgelopen', kleur: 'grijs',  loopt: false },
  doorlopend:  { label: 'Doorlopend',              kleur: 'geel',   loopt: true  },
};

// Alarm, afgeleid uit de datum en dus nooit opgeslagen: deadline voorbij,
// niet gehaald én nog niet beslist. Hoort weg bij de eerstvolgende review.
const KOERS_BESLISSING_OPEN = {
  label: 'Beslissing open', kleur: 'geel', rand: 'rood', loopt: false
};

// ─── Maanden ────────────────────────────────────
// Maanden zijn "YYYY-MM". Rekenen doen we op een volgnummer (jaar*12+maand),
// zodat jaargrenzen vanzelf goed gaan.
function maandNr(m) {
  if (!m) return null;
  const [j, mn] = String(m).split('-').map(Number);
  if (!j || !mn) return null;
  return j * 12 + (mn - 1);
}

function nrNaarMaand(nr) {
  const j = Math.floor(nr / 12);
  const mn = (nr % 12) + 1;
  return j + '-' + String(mn).padStart(2, '0');
}

// De huidige maand als "YYYY-MM". Datum als parameter zodat het testbaar is.
function huidigeMaand(vandaag) {
  const d = vandaag || new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

// ─── Afgeleide status ───────────────────────────
// Geeft terug wat er getekend moet worden. Alleen 'gepland' kan omslaan:
// staat de doelmaand in het verleden, dan is er een beslissing te nemen.
function koersStatus(goal, vandaag) {
  if (!goal || !goal.status) return 'gepland';
  if (goal.status !== 'gepland') return goal.status;
  const nu = maandNr(huidigeMaand(vandaag));
  const doel = maandNr(goal.endMonth);
  if (doel == null || nu == null) return 'gepland';
  return doel < nu ? 'beslissing-open' : 'gepland';
}

// ─── Wat er getekend wordt ──────────────────────
// Vertaalt één doel naar cellen. Fase 3 tekent alleen wat hier uitkomt,
// zodat de tekenregels op één plek staan.
//
// Geeft terug:
//   status      de afgeleide status (zie koersStatus)
//   groen       [vanMaand, totMaand] of null — de aanloop, de enige balk
//               die over de tijd loopt
//   stempel     { maand, kleur, rand } of null — de ene cel die telt
//   verlaten    maand of null — grijze, doorgestreepte cel op de geplande
//               plek die niet leverde
function koersCellen(goal, vandaag) {
  const status = koersStatus(goal, vandaag);
  const start = maandNr(goal.startMonth);
  const eind = maandNr(goal.endMonth);
  const uit = { status, groen: null, stempel: null, verlaten: null };
  if (eind == null) return uit;

  // Doorlopend: één balk over het hele bereik, geen stempel
  if (status === 'doorlopend') {
    uit.groen = [goal.startMonth, goal.endMonth];
    uit.doorlopend = true;
    return uit;
  }

  // Aanloop: alle maanden vóór de doelmaand. Valt weg als start = eind.
  if (start != null && start < eind) {
    uit.groen = [goal.startMonth, nrNaarMaand(eind - 1)];
  }

  if (status === 'gepland' || status === 'beslissing-open') {
    uit.stempel = {
      maand: goal.endMonth,
      kleur: 'geel',
      rand: status === 'beslissing-open' ? 'rood' : null
    };
    return uit;
  }

  if (status === 'gehaald') {
    // Oranje op de maand waarin het écht af was. Liep het uit, dan markeert
    // grijs de geplande maand die niet leverde.
    const echt = goal.completedAt || goal.endMonth;
    uit.stempel = { maand: echt, kleur: 'oranje', rand: null };
    if (maandNr(echt) > eind) uit.verlaten = goal.endMonth;
    return uit;
  }

  if (status === 'bijgesteld') {
    // Bewust losgelaten of verkleind: één stempel, geen duur. De lege
    // maanden erna blijven leeg — dat is een afwezigheid, niet een balk.
    uit.stempel = { maand: goal.endMonth, kleur: 'roze', rand: null };
    return uit;
  }

  if (status === 'verschoven') {
    // De geplande maand die niet leverde. Het werk landt elders, als eigen
    // doel; hoe die twee aan elkaar hangen bepalen we als we gaan tekenen.
    uit.stempel = null;
    uit.verlaten = goal.endMonth;
    return uit;
  }

  return uit;
}

// ─── Standaard-indeling ─────────────────────────
// Vijf gebieden volgens Grip op Ondernemerschap. Dit is de indeling; er is
// geen oudere die er nog toe doet. koers.html schrijft hem weg zodra
// /koers/areas leeg is.
const KOERS_AREAS_DEFAULT = {
  analyse: {
    name: 'Analyse + Focus', order: 1,
    subgroups: {
      kansen: { name: 'Kansen/bedreigingen/sterktes/zwaktes', order: 1 },
      strat:  { name: 'Strategische agenda', order: 2 },
      sdwm:   { name: 'See, Do, Want, Move', order: 3 },
    },
  },
  context: {
    name: 'Context', order: 2,
    subgroups: {
      doelgroep: { name: 'Doelgroep', order: 1 },
      marktpos:  { name: 'Marktpositie', order: 2 },
      waarde:    { name: 'Waardepropositie', order: 3 },
    },
  },
  clients: {
    name: 'Clients', order: 3,
    subgroups: {
      comm: {
        name: 'Communicatie', order: 1,
        subgroups: { 'comm-ong': { name: 'Ongoing', order: 1 } },
      },
      koud: {
        name: 'Koude acquisitie', order: 2,
        subgroups: { 'koud-ong': { name: 'Ongoing', order: 1 } },
      },
      warm: {
        name: 'Warme acquisitie = Koppelbaas', order: 3,
        subgroups: { 'warm-ong': { name: 'Ongoing', order: 1 } },
      },
    },
  },
  company: {
    name: 'Company', order: 4,
    subgroups: {
      taken: {
        name: 'Taken', order: 1,
        subgroups: { ontpl: { name: 'Ontplooiing', order: 1 } },
      },
      middelen:   { name: 'Middelen', order: 2 },
      identiteit: { name: 'Identiteit', order: 3 },
    },
  },
  cash: {
    name: 'Cash', order: 5,
    subgroups: {
      inkomst:  { name: 'Inkomstenplan', order: 1 },
      uitgaven: { name: 'Uitgavenplan', order: 2 },
      balans:   { name: 'Balans', order: 3 },
    },
  },
};

// Loopt de (maximaal drie lagen diepe) boom af en geeft alle subgroepen
// plat terug, met hun pad. Handig om een subgroupId op te zoeken.
// `leaf` is false voor een subgroep die zelf weer subgroepen heeft — doelen
// hangen alleen aan bladeren, niet aan tussenlagen zoals 'Koude acquisitie'.
function koersSubgroepen(areas) {
  const uit = [];
  const loop = (node, areaId, pad) => {
    const subs = node.subgroups || {};
    // Firebase geeft sleutels alfabetisch terug, dus zelf op order sorteren
    const ids = Object.keys(subs).sort((a, b) => (subs[a].order || 0) - (subs[b].order || 0));
    ids.forEach(id => {
      const s = subs[id];
      const heeftKinderen = !!(s.subgroups && Object.keys(s.subgroups).length);
      uit.push({ id, name: s.name, order: s.order || 0, areaId,
                 pad: pad.concat(s.name), leaf: !heeftKinderen });
      loop(s, areaId, pad.concat(s.name));
    });
  };
  const areaIds = Object.keys(areas || {})
    .sort((a, b) => (areas[a].order || 0) - (areas[b].order || 0));
  areaIds.forEach(areaId => loop(areas[areaId], areaId, []));
  return uit;
}

// De subgroepen waar een doel aan kan hangen
function koersLeafSubgroepen(areas) {
  return koersSubgroepen(areas).filter(s => s.leaf);
}

// ─── Pad in de database ─────────────────────────
// Id's zijn plat, de opslag is genest. Om te hernoemen, te herordenen of te
// verwijderen heb je dus het pad onder /koers/ nodig:
//   koersDbPad(areas, 'comm') → 'areas/clients/subgroups/comm'
// Heet bewust anders dan de `pad` uit koersSubgroepen(): dat zijn namen om te
// laten zien, dit is een databasepad om naar te schrijven.
function koersDbPad(areas, id) {
  if (!areas || !id) return null;
  const zoek = (obj, prefix) => {
    for (const key of Object.keys(obj || {})) {
      if (key === id) return prefix + key;
      const kinderen = obj[key] && obj[key].subgroups;
      if (kinderen) {
        const diep = zoek(kinderen, prefix + key + '/subgroups/');
        if (diep) return diep;
      }
    }
    return null;
  };
  return zoek(areas, 'areas/');
}
