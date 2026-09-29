/*
  Google Apps Script: modtager "Send til IT-support" fra Workeren og sender en mail fra din Google-konto.

  Opsætning (ca. 5 minutter):
  1. Gå til https://script.google.com, logget ind med den Google Workspace-konto, mailen skal sendes fra
     (fx it@mvpolering.dk eller din egen).
  2. Nyt projekt > slet indholdet > indsæt denne fil > gem (navn fx "Marvin ticket").
  3. Udskift SECRET nedenfor med en lang tilfældig tekst, fx 30 bogstaver og tal. Samme tekst skal
     sættes som variablen TICKET_SECRET i Workeren.
  4. Tryk "Udrul" (Deploy) > "Ny udrulning" > type "Webapp".
     - Kør som: Mig
     - Hvem har adgang: Alle
     Tryk "Udrul", og godkend tilladelserne (scriptet må sende mail som dig).
  5. Kopiér webapp-adressen (slutter på /exec), og sæt den som variablen TICKET_WEBHOOK i Workeren.
     Sæt også TICKET_TO = it@mvpolering.dk i Workeren.

  Afsender: Mailen sendes fra den konto, du er logget ind med, når du udruller. Skal den komme fra
  it@mvpolering.dk, så log ind som it@mvpolering.dk, når du laver projektet, eller sæt it@mvpolering.dk op som
  "Send mail som"-alias i din egen Gmail og lad FROM stå. Scriptet bruger aliaset, hvis det findes.

  Ændrer du koden senere, skal du lave en ny udrulning, før ændringen virker:
  Udrul > Administrer udrulninger > blyanten ved den aktive udrulning > Version: "Ny version" > Udrul.
  Webapp-adressen forbliver den samme.
*/

const SECRET = 'SKIFT-MIG-TIL-EN-LANG-TILFAELDIG-TEKST';
const DEFAULT_TO = 'it@mvpolering.dk';
// Afsender. Mailen sendes fra den konto, scriptet er udrullet fra. Er FROM en anden adresse, virker det kun,
// hvis FROM er sat op som "Send mail som"-alias i den kontos Gmail. Ellers bruges kontoens egen adresse.
const FROM = 'it@mvpolering.dk';
const SENDER_NAME = 'Marvin (MV Support)';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (SECRET && data.secret !== SECRET) {
      return ContentService.createTextOutput('error: forkert secret');
    }
    const to = data.to || DEFAULT_TO;
    const subject = String(data.subject || 'Support fra tablet').slice(0, 200);
    const body = String(data.body || '').slice(0, 20000);
    const attachments = (data.attachments || []).slice(0, 3).map(function (a, i) {
      return Utilities.newBlob(Utilities.base64Decode(a.data), a.mimeType || 'image/jpeg', a.name || ('billede-' + (i + 1) + '.jpg'));
    });
    const me = (Session.getEffectiveUser().getEmail() || '').toLowerCase();
    const opts = { name: SENDER_NAME };
    if (attachments.length) opts.attachments = attachments;
    if (FROM && FROM.toLowerCase() !== me) {
      // Send som alias, hvis kontoen har det. GmailApp kræver, at du godkender adgang til Gmail ved udrulning.
      const aliases = GmailApp.getAliases().map(function (a) { return a.toLowerCase(); });
      if (aliases.indexOf(FROM.toLowerCase()) !== -1) opts.from = FROM;
    }
    GmailApp.sendEmail(to, subject, body, opts);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}

// Så man kan tjekke i browseren, at webappen kører
function doGet() {
  return ContentService.createTextOutput('Marvin ticket-webhook kører. Brug POST.');
}
