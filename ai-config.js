/*
  Opsætning af Marvin, AI-hjælperen (Google Gemini).
  Se AI-OPSAETNING.md for, hvordan nøglen oprettes og låses til denne side.

  apiKey        Med Worker (anbefalet): skriv 'worker'. Nøglen ligger i Cloudflare, ikke her.
                Uden Worker: selve Gemini-nøglen (starter med AIza). Tom streng = AI-knappen skjules helt.
  model         Gemini-model. Alle Flash-modeller kan læse billeder og er med i gratis-niveauet.
                Eksempler: 'gemini-2.5-flash' (stabil, mindst kø), 'gemini-3.5-flash', 'gemini-3.8-flash' (nyest, ofte "high demand" på gratis-niveauet).
                Marvin prøver altid også 'gemini-2.5-flash' og 'gemini-2.5-flash-lite' som sidste udvej.
  fallbackModel Reservemodel, hvis den første fejler (fx findes ikke eller er overbelastet). Standard: 'gemini-2.5-flash'.
  supportPhone  Vises i svar, når guiderne ikke dækker.
  supportEmail  Bruges af knappen "Send til IT-support". Tom streng = knappen skjules.
  endpoint      Adressen på jeres Cloudflare Worker + '/{model}'. {model} erstattes med modelnavnet.
                Uden Worker: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
*/
window.MV_AI = {
  apiKey: 'worker',
  model: 'gemini-2.5-flash',
  fallbackModel: 'gemini-3.5-flash',
  supportPhone: '23905042',
  supportEmail: '',
  endpoint: 'https://marvin.stefan-2f1.workers.dev/{model}'
};
