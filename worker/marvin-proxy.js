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
    if (!allowed) return json({ error: { code: 403, message: 'Origin ikke tilladt: ' + origin } }, 403, cors);
    if (!env.GEMINI_API_KEY) return json({ error: { code: 500, message: 'GEMINI_API_KEY mangler i Workerens indstillinger' } }, 500, cors);

    // /live/{model}: WebSocket-proxy til Live API (reserve når dagsloftet er nået). Nøglen sættes på her.
    if (request.headers.get('Upgrade') === 'websocket') {
      const liveModel = decodeURIComponent(new URL(request.url).pathname.replace(/^\/+live\/?/, ''));
      if (!MODEL_OK.test(liveModel)) return json({ error: { code: 400, message: 'Ugyldigt modelnavn' } }, 400, cors);
      return proxyLive(request, env);
    }
    if (request.method !== 'POST') return json({ error: { code: 405, message: 'Kun POST' } }, 405, cors);

    const path = decodeURIComponent(new URL(request.url).pathname.replace(/^\/+/, ''));

    // /ticket: "Send til IT-support". Sendes videre til TICKET_WEBHOOK (Google Apps Script), som mailer til TICKET_TO.
    if (path === 'ticket') {
      if (!env.TICKET_WEBHOOK) return json({ error: { code: 501, message: 'TICKET_WEBHOOK er ikke sat op i Workeren' } }, 501, cors);
      let ticket;
      try { ticket = await request.json(); } catch (_) { return json({ error: { code: 400, message: 'Ugyldig JSON' } }, 400, cors); }
      const subject = String(ticket.subject || 'Support fra tablet').slice(0, 200);
      const body = String(ticket.body || '').slice(0, 20000);
      const hook = await fetch(env.TICKET_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: env.TICKET_TO || '', subject, body, secret: env.TICKET_SECRET || '' }),
        redirect: 'follow' // Apps Script svarer med en redirect
      });
      const text = await hook.text();
      const ok = hook.ok && !/error|fejl/i.test(text.slice(0, 200));
      return json(ok ? { ok: true } : { error: { code: 502, message: 'Mail kunne ikke sendes: ' + text.slice(0, 200) } }, ok ? 200 : 502, cors);
    }

    // Stien er /{model}:generateContent eller bare /{model}
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

async function proxyLive(request, env) {
  const LIVE_URL = 'https://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';
  const key = env.GEMINI_API_KEY.trim();
  // Først med nøglen i header; afviser Google det, så prøv den gamle måde med ?key=
  let upstreamResp = await fetch(LIVE_URL, { headers: { 'Upgrade': 'websocket', 'x-goog-api-key': key } });
  if (!upstreamResp.webSocket) {
    const first = upstreamResp.status + ' ' + (await upstreamResp.text().catch(() => '')).slice(0, 200);
    upstreamResp = await fetch(LIVE_URL + '?key=' + encodeURIComponent(key), { headers: { 'Upgrade': 'websocket' } });
    if (!upstreamResp.webSocket) {
      const second = upstreamResp.status + ' ' + (await upstreamResp.text().catch(() => '')).slice(0, 200);
      console.error('Live API afviste forbindelsen. Header: ' + first + ' | ?key=: ' + second);
      return new Response('Live API afviste forbindelsen: ' + second, { status: 502 });
    }
  }
  const upstream = upstreamResp.webSocket;
  upstream.accept();

  const pair = new WebSocketPair();
  const [client, server] = Object.values(pair);
  server.accept();

  server.addEventListener('message', e => { try { upstream.send(e.data); } catch (_) {} });
  upstream.addEventListener('message', e => { try { server.send(e.data); } catch (_) {} });
  const closeBoth = (code, reason) => {
    try { server.close(code, reason); } catch (_) {}
    try { upstream.close(code, reason); } catch (_) {}
  };
  server.addEventListener('close', e => closeBoth(1000, 'client closed'));
  upstream.addEventListener('close', e => closeBoth(1000, (e.reason || 'upstream closed').slice(0, 120)));
  server.addEventListener('error', () => closeBoth(1011, 'client error'));
  upstream.addEventListener('error', () => closeBoth(1011, 'upstream error'));

  return new Response(null, { status: 101, webSocket: client });
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}
