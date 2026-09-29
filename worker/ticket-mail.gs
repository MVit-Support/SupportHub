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

  Ændrer du koden senere, skal du lave en ny udrulning, før ændringen virker.
*/

const SECRET = 'SKIFT-MIG-TIL-EN-LANG-TILFAELDIG-TEKST';
const DEFAULT_TO = 'it@mvpolering.dk';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (SECRET && data.secret !== SECRET) {
      return ContentService.createTextOutput('error: forkert secret');
    }
    const to = data.to || DEFAULT_TO;
    const subject = String(data.subject || 'Support fra tablet').slice(0, 200);
    const body = String(data.body || '').slice(0, 20000);
    MailApp.sendEmail({ to: to, subject: subject, body: body, name: 'Marvin (MV Support)' });
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}

// Så man kan tjekke i browseren, at webappen kører
function doGet() {
  return ContentService.createTextOutput('Marvin ticket-webhook kører. Brug POST.');
}
