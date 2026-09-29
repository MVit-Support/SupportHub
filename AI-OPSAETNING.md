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
  apiKey: 'AQ....',             // nøglen fra trin 1 (nye nøgler starter med AQ., ældre med AIza)
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

## Anbefalet: mellemstation på Cloudflare Workers (nøglen ude af GitHub)

GitHub blokerer med rette, når en nøgle lægges i et offentligt repo. Med en Worker ligger nøglen kun hos Cloudflare, og siden kalder Workeren i stedet for Google. Det tager ca. 10 minutter og er gratis.

1. Opret en konto på https://dash.cloudflare.com (gratis-planen rækker).
2. Vælg **Workers & Pages** > **Create** > **Create Worker**. Giv den navnet `marvin`, og tryk **Deploy**.
3. Tryk **Edit code**, slet indholdet, og indsæt hele filen `worker/marvin-proxy.js` fra denne mappe. Tryk **Deploy**.
4. Gå til Workerens **Settings** > **Variables and Secrets** > **Add**:
   - Type **Secret**, navn `GEMINI_API_KEY`, værdi = din Gemini-nøgle. Nye nøgler fra Google starter med `AQ.`, ældre med `AIza`. Begge virker, da Workeren sender nøglen i headeren `x-goog-api-key`.
   - Type **Text**, navn `ALLOWED_ORIGINS`, værdi `https://mvit-support.github.io`.
   Gem. Workeren genstarter selv.
5. Kopiér Workerens adresse fra oversigten, fx `https://marvin.dit-navn.workers.dev`.
6. I `ai-config.js`:

```js
  apiKey: 'worker',   // må ikke være tom, men bruges ikke. Nøglen ligger i Workeren.
  endpoint: 'https://marvin.dit-navn.workers.dev/{model}',
```

7. Upload. Der ligger nu ingen nøgle i GitHub, så push-beskyttelsen slår ikke til.

Nøglen behøver ikke website-låsning i Google, da den aldrig forlader Cloudflare. Behold gerne API-begrænsningen til Generative Language API.

Test lokalt: tilføj `,http://localhost:8765` til `ALLOWED_ORIGINS` (uden mellemrum efter kommaet).

## "Send til IT-support": mail via Workeren

Knappen sender samtalen som mail til IT-support. Appens indlejrede browser kan ikke åbne mailprogrammer, så mailen sendes fra Workeren via et lille Google Apps Script, der bruger jeres egen Google-konto.

1. Følg vejledningen i toppen af `worker/ticket-mail.gs` (Apps Script, ca. 5 minutter). Den giver dig en webapp-adresse, der slutter på `/exec`.
2. I Cloudflare: Workeren `marvin` > Settings > Variables and Secrets. Tilføj:
   - `TICKET_WEBHOOK` (Text) = webapp-adressen fra trin 1
   - `TICKET_TO` (Text) = `it@mvpolering.dk`
   - `TICKET_SECRET` (Secret) = samme tilfældige tekst, som du skrev ind i `ticket-mail.gs`
3. Sørg for at Workeren kører den nyeste `worker/marvin-proxy.js` (Edit code > indsæt > Deploy).

Mailen indeholder hele samtalen, pudserens navn, tabletmodel og Android-version. Er Workeren ikke sat op til mail, falder Marvin tilbage til at åbne Gmail (kun i Chrome) eller kopiere teksten, så den kan sættes ind manuelt.

## Alternativ uden mellemstation: nøglen indsættes ved udgivelse

Vil I ikke have en Worker, kan nøglen ligge som en GitHub Actions-secret og skrives ind i `ai-config.js` under udgivelsen af Pages. Nøglen er så ikke i git, men den er stadig synlig for alle, der åbner sidens kildekode, og skal derfor være låst til `https://mvit-support.github.io/*` og til Generative Language API. Løsningen med Worker er sikrere.
