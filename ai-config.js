/*
  Opsætning af Marvin, AI-hjælperen (Google Gemini).
  Se AI-OPSAETNING.md for, hvordan nøglen oprettes og låses til denne side.

  apiKey        Gemini API-nøgle fra aistudio.google.com. Tom streng = AI-knappen skjules helt.
  model         Gemini-model. Alle Flash-modeller kan læse billeder og er med i gratis-niveauet.
                Eksempler: 'gemini-2.5-flash' (stabil, mindst kø), 'gemini-3.5-flash', 'gemini-3.8-flash' (nyest, ofte "high demand" på gratis-niveauet).
                Marvin prøver altid også 'gemini-2.5-flash' og 'gemini-2.5-flash-lite' som sidste udvej.
  fallbackModel Reservemodel, hvis den første fejler (fx findes ikke eller er overbelastet). Standard: 'gemini-2.5-flash'.
  supportPhone  Vises i svar, når guiderne ikke dækker.
  supportEmail  Bruges af knappen "Send til IT-support". Tom streng = knappen skjules.
  endpoint      Skift kun hvis nøglen flyttes bag en mellemstation (fx Cloudflare Worker).
                Skal ende uden skråstreg. {model} erstattes med modelnavnet.
*/
window.MV_AI = {
    apiKey: '',
  model: 'gemini-2.5-flash',
  fallbackModel: 'gemini-3.5-flash',
  supportPhone: '23905042',
  supportEmail: '',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
};
