# Marvin (AI-hjælper): opsætning

Support-siden har en indbygget AI-hjælper, Marvin (knappen "Spørg Marvin" nederst til højre).
Den bruger Google Gemini og svarer kun ud fra guiderne i `guides.js`.
Knappen vises først, når der er sat en nøgle ind i `ai-config.js`.

## 1. Opret nøglen

1. Gå til https://aistudio.google.com og log ind med den Google-konto, der skal eje nøglen.
2. Vælg **Get API key** > **Create API key**. Lad AI Studio oprette et nyt projekt, eller vælg et eksisterende.
3. Kopiér nøglen.

## 2. Lås nøglen til support-siden (vigtigt)

Nøglen ligger i selve siden og kan læses af alle, der åbner kildekoden. Derfor skal den låses, så den kun virker fra jeres adresse.

1. Gå til https://console.cloud.google.com/apis/credentials og vælg det projekt, AI Studio oprettede (hedder typisk "Gemini API" eller "Generative Language Client").
2. Klik på nøglen.
3. Under **Application restrictions** vælg **Websites** og tilføj:
   - `https://mvit-support.github.io/*`
4. Under **API restrictions** vælg **Restrict key** og markér kun **Generative Language API**.
5. Gem. Det kan tage op til 5 minutter, før begrænsningen virker.

Vil du teste lokalt fra din egen computer, så tilføj også `http://localhost:*` under Websites, og fjern den igen bagefter.

## 3. Sæt nøglen ind

Åbn `ai-config.js` og udfyld:

```js
window.MV_AI = {
  apiKey: 'AIza...',            // nøglen fra trin 1
  model: 'gemini-2.5-flash',    // stabil. 'gemini-3.8-flash' er nyere, men ofte overbelastet på gratis-niveauet
  supportPhone: '23905042',
  supportEmail: 'it@mvpolering.dk', // mail til knappen "Send til IT-support". Tom = knappen skjules
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
};
```

Upload hele mappen til GitHub. Tabletterne henter den nye version ved næste åbning.

## Gratis-niveauet

- Flash-modellerne er gratis via API'et med et loft pr. minut og pr. dag. Rammes loftet, får brugeren beskeden "Marvin er optaget lige nu", og guiderne virker stadig.
- Fordi virksomheden er i EU, bruger Google ikke jeres spørgsmål og billeder til at forbedre deres produkter, heller ikke på gratis-niveauet.
- Billeder skaleres ned til max 1024 px i browseren, før de sendes, så de fylder mindre i kvoten.

## Hvis nøglen bliver misbrugt

Slet nøglen i Google Cloud Console, opret en ny, og sæt den ind i `ai-config.js`. Der løber ingen regning på gratis-niveauet.

## Senere: flyt nøglen bag en mellemstation

Vil I på et tidspunkt gemme nøglen helt væk (fx på Cloudflare Workers eller bag Tailscale Funnel), så peg `endpoint` på mellemstationens adresse og lad `apiKey` være en vilkårlig tekst (den skal blot ikke være tom). Mellemstationen sætter så selv den rigtige nøgle på, før den kalder Google. Resten af siden skal ikke ændres.
