const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.database();

exports.ical = functions.region('europe-west1').https.onRequest(async (req, res) => {
  try {
    const [matchesSnap, kansenSnap, devsSnap] = await Promise.all([
      db.ref('matches').once('value'),
      db.ref('kansen').once('value'),
      db.ref('devs').once('value')
    ]);

    const matches = matchesSnap.val() || {};
    const kansen = kansenSnap.val() || {};
    const devs = devsSnap.val() || {};

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayStr = fmt(now);

    const events = [];

    for (const [id, m] of Object.entries(matches)) {
      if (!m.nextAction) continue;

      const kans = kansen[m.kid];
      if (!kans) continue;

      const nextDate = new Date(m.nextAction);
      nextDate.setHours(0, 0, 0, 0);

      // Rollende datum: verlopen events verschijnen vandaag
      const eventDate = nextDate < now ? now : nextDate;
      const dateStr = fmt(eventDate);

      // Ontwikkelaarnamen ophalen
      const devNames = (m.links || [])
        .map(did => devs[did]?.name || '?')
        .join(', ');

      const stageLabel = {
        matches: 'Match',
        verkennend: 'Verkennend',
        offerte: 'Offerte',
        actief: 'Actief'
      }[m.stage] || m.stage;

      const isOverdue = nextDate < now;
      const summary = (isOverdue ? '[VERLOPEN] ' : '') + kans.name + ' — opvolgen';

      let description = 'Fase: ' + stageLabel;
      if (devNames) description += '\nOntwikkelaar(s): ' + devNames;
      if (m.notitie) description += '\nNotitie: ' + m.notitie;
      if (isOverdue) {
        const days = Math.round((now - nextDate) / 86400000);
        description += '\n\nOriginele datum: ' + fmt(nextDate) + ' (' + days + ' dagen verlopen)';
      }

      events.push(vevent(id, dateStr, summary, description, kans.name));
    }

    const cal = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Koppelbaas//iCal Feed//NL',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Koppelbaas opvolging',
      'X-WR-TIMEZONE:Europe/Amsterdam',
      ...events,
      'END:VCALENDAR'
    ].join('\r\n');

    res.set({
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="koppelbaas.ics"',
      'Cache-Control': 'public, max-age=900'
    });
    res.send(cal);

  } catch (err) {
    console.error('iCal error:', err);
    res.status(500).send('Internal error');
  }
});

function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return y + m + day;
}

function nextDay(dateStr) {
  const y = parseInt(dateStr.slice(0,4));
  const m = parseInt(dateStr.slice(4,6)) - 1;
  const d = parseInt(dateStr.slice(6,8));
  const next = new Date(y, m, d + 1);
  return fmt(next);
}

function vevent(uid, dateStr, summary, description, location) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  return [
    'BEGIN:VEVENT',
    'UID:' + uid + '@koppelbaas',
    'DTSTAMP:' + stamp,
    'DTSTART;VALUE=DATE:' + dateStr,
    'DTEND;VALUE=DATE:' + nextDay(dateStr),
    'SUMMARY:' + esc(summary),
    'DESCRIPTION:' + esc(description),
    'LOCATION:' + esc(location),
    'END:VEVENT'
  ].join('\r\n');
}

function esc(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}
