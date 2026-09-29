/*
  Marvin-mellemstation til Cloudflare Workers.

  Holder Gemini-nøglen hemmelig: siden kalder denne Worker, og Workeren kalder Google
  med nøglen fra en hemmelig variabel (GEMINI_API_KEY). Nøglen ligger derfor aldrig i
  GitHub eller i browseren.

  Opsætning: se AI-OPSAETNING.md, afsnittet "Mellemstation på Cloudflare Workers".

  Kun kald fra ALLOWED_ORIGINS accepteres. Tilføj flere adresser adskilt af komma,
  fx "https://mvit-support.github.io,http://localhost:8765".
*/

const DEFAULT_ORIGINS = ['https://mvit-support.github.io'];
const GOOGLE = 'https://generativelanguage.googleapis.com/v1beta/models/';
const MODEL_OK = /^[a-z0-9.-]+$/i;

export default {
  async fetch(request, env) {
    const origins = (env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',') : DEFAULT_ORIGINS).map(s => s.trim());
    const origin = request.headers.get('Origin') || '';
    const allowed = origins.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : origins[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-goog-api-key',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: { code: 405, message: 'Kun POST' } }, 405, cors);
    if (!allowed) return json({ error: { code: 403, message: 'Origin ikke tilladt: ' + origin } }, 403, cors);
    if (!env.GEMINI_API_KEY) return json({ error: { code: 500, message: 'GEMINI_API_KEY mangler i Workerens indstillinger' } }, 500, cors);

    // Stien er /{model}:generateContent eller bare /{model}
    const path = decodeURIComponent(new URL(request.url).pathname.replace(/^\/+/, ''));
    const model = path.replace(/:generateContent$/, '');
    if (!MODEL_OK.test(model)) return json({ error: { code: 400, message: 'Ugyldigt modelnavn' } }, 400, cors);

    // Begræns størrelsen (billeder er allerede skaleret ned i browseren)
    const body = await request.text();
    if (body.length > 6_000_000) return json({ error: { code: 413, message: 'Forespørgslen er for stor' } }, 413, cors);

    // Nøglen sendes i header (Googles anbefalede måde). Virker både for gamle AIza-nøgler og nye AQ.-nøgler.
    const upstream = await fetch(GOOGLE + encodeURIComponent(model) + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY.trim() },
      body
    });

    // Send Googles svar videre uændret (status og JSON), med CORS-headere
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', ...cors }
    });
  }
};

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}
