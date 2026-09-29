/*
  Opsætning af Marvin, AI-hjælperen (Google Gemini).
  Se AI-OPSAETNING.md for, hvordan nøglen oprettes og låses til denne side.

  apiKey        Med Worker (anbefalet): skriv 'worker'. Nøglen ligger i Cloudflare, ikke her.
                Uden Worker: selve Gemini-nøglen (starter med AIza). Tom streng = AI-knappen skjules helt.
  model         Gemini-model. Alle Flash-modeller kan læse billeder og er med i gratis-niveauet.
                Eksempler: 'gemini-2.5-flash' (stabil, mindst kø), 'gemini-3.5-flash', 'gemini-3.8-flash' (nyest, ofte "high demand" på gratis-niveauet).
                Marvin prøver altid også 'gemini-2.5-flash' og 'gemini-2.5-flash-lite' som sidste udvej.
  fallbackModel Reservemodel, hvis den første fejler (fx findes ikke eller er overbelastet). Standard: 'gemini-2.5-flash'.
  searchModel   Model til websøgning (knappen "Søg på nettet"). Gemini 3-modellerne har 5.000 gratis søgninger/md.
                Standard: 'gemini-3.8-flash', derefter prøves 'gemini-3.5-flash' og de øvrige.
  models        Liste over gratis-modeller, Marvin hopper imellem, når dagsloftet (ca. 20 kald/model/dag) er nået.
                Rækkefølgen er prioriteringen. Udelad linjen for at bruge Marvins standardliste.
  liveModels    Reserve via Live-API'et (WebSocket, intet dagsloft), når ALLE modeller ovenfor er brugt op.
                text: true = modellen svarer med tekst. text: false = svarer med lyd, vi bruger tekstudskriften.
                Test reserven med ?marvin=live i adressen.
  supportPhone  Vises i svar, når guiderne ikke dækker.
  supportEmail  Bruges af knappen "Send til IT-support". Tom streng = knappen skjules.
  endpoint      Adressen på jeres Cloudflare Worker + '/{model}'. {model} erstattes med modelnavnet.
                Uden Worker: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
*/
window.MV_AI = {
  apiKey: 'worker',
  model: 'gemini-2.5-flash',
  fallbackModel: 'gemini-3.5-flash',
  searchModel: 'gemini-3.8-flash',
  models: [
    'gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash',
    'gemini-2.5-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'
  ],
  liveModels: [
    { model: 'gemini-3.1-flash-live-preview', text: true },
    { model: 'gemini-3.8-live', text: false },
    { model: 'gemini-3.8-live-extended-thinking', text: false }
  ],
  supportPhone: '23905042',
  supportEmail: 'it@mvpolering.dk',
  endpoint: 'https://marvin.stefan-2f1.workers.dev/{model}'
};
