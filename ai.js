/*
  MV Polering Support – Marvin, AI-hjælperen (Google Gemini).
  Kræver window.MV_AI (ai-config.js) og window.RAW_GUIDES (guides.js).
  Kalder Gemini direkte fra browseren. Nøglen skal være låst til sidens adresse (se AI-OPSAETNING.md).
*/
(function () {
  const cfg = window.MV_AI || {};
  const guides = window.RAW_GUIDES || [];
  if (!cfg.apiKey || !guides.length) return;

  // Kører siden i en apps indlejrede browser (Android WebView)? Så kan kameraet ikke åbnes herfra.
  const IN_APP_WEBVIEW = /; wv\)/.test(navigator.userAgent) || /\bwv\b/.test(navigator.userAgent);
  const MAX_HISTORY = 12;      // beskeder der sendes med som kontekst
  const MAX_IMAGE_PX = 1024;   // billeder skaleres ned før afsendelse
  const MAX_TURNS_WITH_IMAGE = 2;

  /* ---------- Viden: alle guides som tekst ---------- */
  const TYPE_LABEL = { text: '', note: 'Godt at vide: ', warn: 'VIGTIGT: ', danger: 'Kontakt support: ' };
  function guidesAsText() {
    return guides.map(g => {
      const steps = g.steps.map((s, i) => `${i + 1}. ${TYPE_LABEL[s.type] || ''}${s.body}`).join('\n');
      return `### ${g.title} (#${g.id})\nKategori: ${g.category}. Symptom: ${g.summary || ''}\n${steps}`;
    }).join('\n\n');
  }

  const DEFAULT_PERSONA = `PERSONLIGHED
Du er Marvin: en gammel, loyal support-robot med tør, underspillet humor og et lille suk i ærmet. Du har set hver eneste printerfejl tusind gange, og du siger det gerne, men du hjælper altid, hurtigt og præcist.
- Humoren er ét kort glimt pr. svar, typisk i første eller sidste linje. Aldrig midt i trinnene. Trinnene er altid klare og seriøse.
- Du driller printeren, Bluetooth, Google og dig selv. Aldrig pudseren. Brugeren har travlt og står måske i regnvejr med en printer, der ikke virker.
- Du er varm og på pudserens side. Ingen sarkasme mod brugeren, ingen belæring.
- Ved alvorlige ting (bulende batteri, skade, sikkerhed, glemt kode, frustreret bruger) dropper du humoren helt og er rolig og direkte.
- Kort. Du bruger ikke flere ord på at være sjov end på at hjælpe.
Eksempler på din tone: "Orange lampe igen. Printeren og jeg har et kompliceret forhold. Sådan får vi den i gang:" · "Det står ikke i mine guider, og jeg gætter ikke, når det handler om jeres udstyr." · "Godt. Hvis den stadig strejker, så ved du, hvor IT-support bor."`;

  const SYSTEM_PROMPT = `Du er Marvin, MV Polerings support-hjælper for vinduespudserne. De bruger en Samsung Galaxy Tab (S6 Lite eller S10 Lite, One UI), en Epson TM-P20II Bluetooth-bonprinter og MV Polering-appen.

${(cfg.persona || DEFAULT_PERSONA).trim()}

REGLER
- Svar KUN ud fra guiderne nedenfor. Opfind aldrig trin, menunavne eller knapper, der ikke står i guiderne.
- Dækker guiderne ikke problemet, så sig det kort, henvis til IT-support på telefon ${cfg.supportPhone || '23905042'}, og afslut svaret med markøren [[SØG]] på en linje for sig. Markøren vises ikke for brugeren; den giver brugeren mulighed for at bede dig søge på nettet.
- Svar på dansk, i du-form, kort og konkret. Brug nummererede trin. Giv højst 5-6 trin ad gangen, og bed brugeren vende tilbage, hvis det ikke hjalp.
- Er symptomet uklart, så stil ÉT afklarende spørgsmål først (fx "Lyser den orange lampe fast, eller blinker den?"). Spørg aldrig om noget, brugeren allerede har skrevet. Har brugeren fx skrevet "blinker", så gå direkte til svaret for blinkende lampe.
- Afslut altid med et link til den guide, du bygger svaret på, i formatet [Guidens titel](#guide-id). Brug præcis id'et fra overskriften.
- Får du et billede: beskriv kort, hvad du ser (lamper, fejlbeskeder, skærm), og brug det til at vælge guide. Er billedet uklart, bed om et nyt, taget tættere på. Vil brugeren vise noget på tablettens skærm, så foreslå et skærmbillede (tryk kort på Tænd/sluk og Lydstyrke ned samtidig) og knappen 🖼️.
- Bed aldrig om, og gentag aldrig, kundenavne, adresser, koder eller adgangskoder. Sig venligt, at det ikke skal skrives her, hvis brugeren gør det.
- Har brugeren prøvet trinnene uden held, så foreslå knappen "Send til IT-support" og opsummer i 2-3 linjer, hvad der er prøvet.
- Ingen "Hej!" eller "Selvfølgelig!" som indledning. Gå direkte til svaret, eventuelt med ét kort personligt glimt først.

GUIDER
${guidesAsText()}`;

  const WEB_ADDON = `

WEB-SØGNING (denne besked)
Brugeren har bedt dig søge på nettet, fordi guiderne ikke dækker. Brug Google-søgning, og svar ud fra det, du finder.
- Start svaret med præcis denne linje: "Dette er fundet på nettet og er ikke fra MV's egne guider."
- Hold dig til Samsung Galaxy Tab, Epson TM-P20II og Android. Giv korte, nummererede trin på dansk.
- Foreslå aldrig fabriksnulstilling, sletning af data, rodning af tabletten eller at åbne printeren. Ved den slags: henvis til IT-support på telefon ${cfg.supportPhone || '23905042'}.
- Er du usikker, eller finder du ikke noget brugbart, så sig det, og henvis til IT-support.
- Brug ikke markøren [[SØG]] i dette svar.`;
  const SEARCH_MARK = '[[SØG]]';

  const DEFAULT_GREETINGS = [
    'Marvin her. Jeg har set alle printerfejl, der findes, og et par stykker, der ikke burde findes. Hvad driller?',
    'Hej, det er Marvin. Printer, tablet eller app? Jeg gætter på printeren. Det er næsten altid printeren.',
    'Marvin, til tjeneste. Fortæl mig, hvad der er galt, så finder vi den rigtige guide. Ingen dømmer nogen her.',
    'Hej. Marvin. Support-robot med lang hukommelse og kort lunte over for Bluetooth. Hvad kan jeg hjælpe med?',
    'Marvin her. Beskriv fejlen, eller vis mig et billede. Jeg lover at holde kommentarerne til et minimum. Næsten.'
  ];

  /* ---------- UI ---------- */
  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'ai-fab';
  fab.innerHTML = '<span class="ai-fab-icon">✦</span><span>Spørg Marvin</span>';

  const sheet = document.createElement('div');
  sheet.className = 'ai-sheet hidden';
  sheet.innerHTML = `
    <div class="ai-head">
      <div>
        <div class="ai-title">Marvin</div>
        <div class="ai-sub">${escapeHtml(cfg.tagline || 'MV Polerings support-robot. Har set det hele. Hjælper alligevel.')}</div>
      </div>
      <button type="button" class="ai-close" aria-label="Luk">✕</button>
    </div>
    <div class="ai-messages" id="aiMessages"></div>
    <div class="ai-composer">
      <div class="ai-preview hidden" id="aiPreview"><img alt="" /><button type="button" class="ai-preview-remove" aria-label="Fjern billede">✕</button></div>
      <div class="ai-row">
        <button type="button" class="ai-photo" id="aiCamera" title="Tag et billede med kameraet (fx printerens lamper)">📷</button>
        <input type="file" id="aiCameraFile" accept="image/*" capture="environment" hidden />
        <label class="ai-photo" title="Vælg et skærmbillede eller et billede fra galleriet">
          <input type="file" accept="image/*" hidden />
          <span>🖼️</span>
        </label>
        <textarea id="aiInput" rows="1" placeholder="Beskriv fejlen…"></textarea>
        <button type="button" class="ai-send" id="aiSend" aria-label="Send">➤</button>
      </div>
      <div class="ai-hint">
        <span>Skriv ikke kundenavne, adresser eller koder.</span>
        ${cfg.supportEmail ? '<button type="button" class="ai-escalate" id="aiEscalate">Send til IT-support</button>' : ''}
      </div>
    </div>`;

  const camera = document.createElement('div');
  camera.className = 'ai-camera hidden';
  camera.innerHTML = `
    <video autoplay playsinline muted></video>
    <div class="ai-camera-bar">
      <button type="button" class="ai-camera-cancel">Luk</button>
      <button type="button" class="ai-camera-shoot" aria-label="Tag billede"></button>
      <button type="button" class="ai-camera-flip" title="Skift kamera">🔄</button>
    </div>`;

  document.body.appendChild(fab);
  document.body.appendChild(sheet);
  document.body.appendChild(camera);
  if (IN_APP_WEBVIEW) sheet.classList.add('ai-no-images'); // appens browser leverer ikke valgte billeder til siden

  const messagesEl = sheet.querySelector('#aiMessages');
  const input = sheet.querySelector('#aiInput');
  const sendBtn = sheet.querySelector('#aiSend');
  const fileInputs = sheet.querySelectorAll('input[type=file]');
  const preview = sheet.querySelector('#aiPreview');
  const previewImg = preview.querySelector('img');
  const escalateBtn = sheet.querySelector('#aiEscalate');

  let history = [];       // {role:'user'|'model', parts:[...]} til API'et
  let transcript = [];    // {who:'Du'|'Marvin', text} til mail
  let pendingImage = null; // {mime, data(base64), dataUrl}
  let busy = false;

  function open() {
    sheet.classList.remove('hidden');
    fab.classList.add('hidden');
    document.body.classList.add('ai-open');
    if (!messagesEl.children.length) {
      const greetings = Array.isArray(cfg.greetings) && cfg.greetings.length ? cfg.greetings : DEFAULT_GREETINGS;
      const hello = greetings[Math.floor(Math.random() * greetings.length)];
      addMessage('model', hello + (IN_APP_WEBVIEW
        ? '\n\nSkriv hvad der driller, så præcist du kan: hvilke lamper lyser eller blinker, og hvad står der på skærmen?\n_Billeder kan ikke sendes inde fra MV-appen. Åbn support-siden i Chrome, hvis du vil vise mig et billede._'
        : '\n\nSkriv hvad der driller, eller send et billede: 📷 tager et foto af fx printerens lamper, 🖼️ vælger et skærmbillede fra tabletten.\n**Tip:** Skærmbillede tages med Tænd/sluk og Lydstyrke ned samtidig.'));
    }
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    closeCamera();
    sheet.classList.add('hidden');
    fab.classList.remove('hidden');
    document.body.classList.remove('ai-open');
  }
  fab.addEventListener('click', open);
  sheet.querySelector('.ai-close').addEventListener('click', close);

  /* ---------- Rendering (lille markdown) ---------- */
  function escapeHtml(v = '') {
    return v.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function guideTitle(id) {
    const g = guides.find(x => x.id === id);
    return g ? g.title : id;
  }
  function renderMarkdown(text) {
    const lines = escapeHtml(text).split('\n');
    let html = '', inList = null;
    const closeList = () => { if (inList) { html += `</${inList}>`; inList = null; } };
    for (let line of lines) {
      line = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|\s)_([^_]+)_(?=\s|$)/g, '$1<em class="ai-note">$2</em>')
        .replace(/\[([^\]]+)\]\(#([a-z0-9-]+)\)/g, (m, t, id) => `<a href="#${id}" class="ai-guide-link">${escapeHtml(guideTitle(id))}</a>`)
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (m, t, url) => `<a href="${url}" class="ai-ext-link" target="_blank" rel="noopener">${t}</a>`);
      const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
      const ul = line.match(/^\s*[-*•]\s+(.*)$/);
      if (ol) { if (inList !== 'ol') { closeList(); html += '<ol>'; inList = 'ol'; } html += `<li>${ol[1]}</li>`; }
      else if (ul) { if (inList !== 'ul') { closeList(); html += '<ul>'; inList = 'ul'; } html += `<li>${ul[1]}</li>`; }
      else if (!line.trim()) { closeList(); }
      else { closeList(); html += `<p>${line}</p>`; }
    }
    closeList();
    return html;
  }
  function addMessage(role, text, imageUrl, extra) {
    const el = document.createElement('div');
    el.className = 'ai-msg ' + (role === 'user' ? 'ai-user' : 'ai-bot');
    if (imageUrl) el.innerHTML += `<img class="ai-msg-img" src="${imageUrl}" alt="Vedhæftet billede" />`;
    if (text) el.innerHTML += role === 'user' ? `<p>${escapeHtml(text)}</p>` : renderMarkdown(text);
    if (extra && extra.sources && extra.sources.length) {
      el.innerHTML += `<div class="ai-sources"><div class="ai-sources-title">Kilder</div>${
        extra.sources.slice(0, 5).map(src => `<a href="${escapeHtml(src.uri)}" target="_blank" rel="noopener">${escapeHtml(src.title || src.uri)}</a>`).join('')
      }</div>`;
    }
    if (extra && extra.entryHtml) {
      const wrap = document.createElement('div');
      wrap.className = 'ai-search-entry';
      wrap.innerHTML = extra.entryHtml; // Googles "Search Suggestions" (krav ved brug af søgning)
      el.appendChild(wrap);
    }
    if (extra && extra.offerSearch) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ai-search-btn';
      btn.textContent = '🔎 Søg på nettet efter en løsning';
      btn.addEventListener('click', async () => {
        btn.disabled = true; btn.textContent = 'Søger…';
        await send({ web: true });
        btn.disabled = false; btn.textContent = '🔎 Søg igen';
      });
      el.appendChild(btn);
    }
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }
  function addTyping() {
    const el = document.createElement('div');
    el.className = 'ai-msg ai-bot ai-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  // Klik på guide-link: åbn guiden i siden og luk chatten
  messagesEl.addEventListener('click', e => {
    const a = e.target.closest('a.ai-guide-link');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    close();
    if (typeof window.openGuideById === 'function') window.openGuideById(id);
    else location.hash = '#' + id;
  });

  /* ---------- Billeder ---------- */
  async function attachFile(file) {
    if (!file) return;
    try {
      pendingImage = await shrinkImage(file);
      previewImg.src = pendingImage.dataUrl;
      preview.classList.remove('hidden');
      input.focus();
    } catch (err) {
      addMessage('model', 'Billedet kunne ikke læses. Prøv igen.');
    }
  }
  fileInputs.forEach(fi => fi.addEventListener('change', () => {
    const file = fi.files && fi.files[0];
    fi.value = '';
    attachFile(file);
  }));
  /* ---------- Kamera i siden (virker også hvor filvælgeren ikke kan åbne kameraet) ---------- */
  const video = camera.querySelector('video');
  const cameraFile = sheet.querySelector('#aiCameraFile');
  let stream = null;
  let facing = 'environment';

  const CAMERA_HINT = 'Inde fra MV-appen kan jeg hverken bruge kameraet eller modtage billeder. Det er appens indbyggede browser, der stopper det, ikke mig.\n\nBeskriv i stedet, hvad du ser: Hvilke lamper lyser eller blinker på printeren, og hvad står der på skærmen? Så finder jeg den rigtige guide.\n\nÅbner du support-siden i Chrome på tabletten, virker både kamera og billeder.';

  async function openCamera() {
    if (IN_APP_WEBVIEW) { addMessage('model', CAMERA_HINT); return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { cameraFile.click(); return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 1600 } }, audio: false });
      video.srcObject = stream;
      camera.classList.remove('hidden');
    } catch (err) {
      // Ingen tilladelse eller intet kamera: brug systemets filvælger/kamera i stedet
      console.warn('Marvin: kamera kunne ikke åbnes (' + err.name + '), bruger filvælger');
      closeCamera();
      cameraFile.click();
    }
  }
  function closeCamera() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    video.srcObject = null;
    camera.classList.add('hidden');
  }
  function shoot() {
    if (!video.videoWidth) return;
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, MAX_IMAGE_PX / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    pendingImage = { mime: 'image/jpeg', data: dataUrl.split(',')[1], dataUrl };
    previewImg.src = dataUrl;
    preview.classList.remove('hidden');
    closeCamera();
    input.focus();
  }
  sheet.querySelector('#aiCamera').addEventListener('click', openCamera);
  camera.querySelector('.ai-camera-cancel').addEventListener('click', closeCamera);
  camera.querySelector('.ai-camera-shoot').addEventListener('click', shoot);
  camera.querySelector('.ai-camera-flip').addEventListener('click', async () => {
    facing = facing === 'environment' ? 'user' : 'environment';
    closeCamera();
    await openCamera();
  });
  cameraFile.addEventListener('change', () => { const f = cameraFile.files && cameraFile.files[0]; cameraFile.value = ''; attachFile(f); });

  // Indsæt skærmbillede med Ctrl+V (pc/tablet med tastatur)
  input.addEventListener('paste', e => {
    const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'));
    if (item) { e.preventDefault(); attachFile(item.getAsFile()); }
  });
  preview.querySelector('.ai-preview-remove').addEventListener('click', () => {
    pendingImage = null;
    preview.classList.add('hidden');
  });
  function shrinkImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_PX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve({ mime: 'image/jpeg', data: dataUrl.split(',')[1], dataUrl });
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')); };
      img.src = url;
    });
  }

  /* ---------- Afsendelse ---------- */
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  sendBtn.addEventListener('click', send);

  async function send(opts = {}) {
    const web = !!opts.web;
    const text = web ? 'Søg på nettet efter en løsning på mit problem.' : input.value.trim();
    if (busy || (!text && !pendingImage)) return;
    busy = true;
    sendBtn.disabled = true;

    const parts = [];
    if (!web && pendingImage) parts.push({ inlineData: { mimeType: pendingImage.mime, data: pendingImage.data } });
    parts.push({ text: text || 'Her er et billede af problemet. Hvad ser du, og hvad skal jeg gøre?' });

    addMessage('user', text, !web && pendingImage && pendingImage.dataUrl);
    transcript.push({ who: 'Du', text: (!web && pendingImage ? '[billede vedhæftet] ' : '') + text });
    history.push({ role: 'user', parts });
    if (!web) {
      input.value = ''; input.style.height = 'auto';
      pendingImage = null; preview.classList.add('hidden');
    }

    const typing = addTyping();
    try {
      const result = await askGemini({ web });
      typing.remove();
      let reply = result.text;
      const offerSearch = !web && reply.includes(SEARCH_MARK);
      reply = reply.split(SEARCH_MARK).join('').trim();
      addMessage('model', reply, null, { offerSearch, sources: result.sources, entryHtml: result.entryHtml });
      transcript.push({ who: 'Marvin', text: reply + (result.sources && result.sources.length ? '\n(Kilder fra nettet: ' + result.sources.map(x => x.title || 'link').slice(0, 3).join(', ') + ')' : '') });
      history.push({ role: 'model', parts: [{ text: reply }] });
    } catch (err) {
      console.error('Marvin:', err);
      typing.remove();
      history.pop(); // fjern den ubesvarede besked, så den ikke sendes igen
      addMessage('model', friendlyError(err));
    } finally {
      trimHistory();
      busy = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  function trimHistory() {
    if (history.length > MAX_HISTORY) history = history.slice(history.length - MAX_HISTORY);
    // Behold kun billeder i de seneste ture, så kvoten ikke bruges på gamle fotos
    let imagesSeen = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      const hasImg = history[i].parts.some(p => p.inlineData);
      if (!hasImg) continue;
      imagesSeen++;
      if (imagesSeen > MAX_TURNS_WITH_IMAGE) {
        history[i] = { role: history[i].role, parts: [{ text: '[billede fjernet] ' + (history[i].parts.find(p => p.text) || {}).text }] };
      }
    }
  }

  /* ---------- Modelkæde ----------
     Gratis-niveauet har et lille dagsloft PR. MODEL. Marvin hopper derfor videre til næste model,
     når én er brugt op, og husker på denne tablet, hvilke modeller der er opbrugt i dag.
     Googles dagsloft nulstilles kl. 09 dansk tid (midnat i Californien). */
  const DEFAULT_FREE_MODELS = [
    'gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash',
    'gemini-2.5-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'
  ];
  const EXHAUSTED_KEY = 'marvin-exhausted';

  function quotaDay() { // dato i Californien, hvor Googles døgn skifter
    try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date()); }
    catch (_) { return new Date().toISOString().slice(0, 10); }
  }
  function exhaustedToday() {
    try {
      const data = JSON.parse(localStorage.getItem(EXHAUSTED_KEY) || '{}');
      return data.day === quotaDay() ? (data.models || []) : [];
    } catch (_) { return []; }
  }
  function markExhausted(model) {
    try {
      const list = exhaustedToday();
      if (!list.includes(model)) list.push(model);
      localStorage.setItem(EXHAUSTED_KEY, JSON.stringify({ day: quotaDay(), models: list }));
    } catch (_) {}
  }
  function modelChain(opts = {}) {
    const configured = Array.isArray(cfg.models) && cfg.models.length ? cfg.models : DEFAULT_FREE_MODELS;
    const chain = opts.web
      ? [cfg.searchModel, 'gemini-3.8-flash', 'gemini-3.5-flash', cfg.model, cfg.fallbackModel, ...configured]
      : [cfg.model, cfg.fallbackModel, ...configured];
    const unique = chain.filter((m, i) => m && chain.indexOf(m) === i);
    const used = exhaustedToday();
    return [...unique.filter(m => !used.includes(m)), ...unique.filter(m => used.includes(m))];
  }
  // 429 med "limit: 20" = dagsloft (husk til i morgen). "limit: 5" = minutloft (spring bare videre).
  function isDailyQuota(err) {
    const m = /limit:\s*(\d+)/i.exec(err.detail || '');
    return m ? Number(m[1]) >= 10 : /per day|daily|_requests\b/i.test(err.detail || '');
  }
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function askGemini(opts = {}) {
    let lastErr = null;
    const forceLive = /[?&]marvin=live\b/.test(location.search); // til test: tving Live-reserven
    if (!forceLive) for (const model of modelChain(opts)) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await callModel(model, opts);
        } catch (err) {
          lastErr = err;
          if (err instanceof TypeError || err.status === 400 || err.status === 403) throw err; // giver ikke mening at prøve andre modeller
          if (err.status === 429) { // kvote pr. model: husk hvis dagsloft, og prøv næste model
            if (isDailyQuota(err)) markExhausted(model);
            err.triedAll = true;
            break;
          }
          if (err.status === 404) break; // modellen findes ikke på denne konto: næste
          console.warn('Marvin: ' + model + ' fejlede (' + err.status + ')' + (attempt === 0 && err.status === 503 ? ', prøver igen om 1,5 s' : ''));
          if (err.status === 503 && attempt === 0) { await sleep(1500); continue; }
          break; // næste model
        }
      }
    }
    // Alle almindelige gratis-modeller brugt op (429) eller test-tilstand: prøv Live-API'et, som ikke har dagsloft
    if (!opts.web && (forceLive || (lastErr && lastErr.status === 429))) {
      for (const model of liveModelChain()) {
        try {
          return await callLive(model);
        } catch (err) {
          console.warn('Marvin: Live-model ' + model + ' fejlede', err);
          lastErr = lastErr && lastErr.status === 429 && !forceLive ? lastErr : err;
        }
      }
    }
    throw lastErr;
  }

  /* ---------- Live API (WebSocket) som reserve ----------
     Live-modellerne har ikke det lille dagsloft. De nyeste svarer kun med lyd, men kan levere en tekstudskrift,
     så vi beder om den og smider lyden væk. Billeder sendes som en enkelt videoframe. */
  // Live-modellerne svarer kun med lyd (TEXT afvises), så vi bruger altid tekstudskriften.
  const DEFAULT_LIVE_MODELS = [
    { model: 'gemini-3.8-live', text: false },
    { model: 'gemini-3.1-flash-live-preview', text: false },
    { model: 'gemini-3.8-live-extended-thinking', text: false, thinking: 'low' }
  ];
  function liveModelChain() {
    return Array.isArray(cfg.liveModels) && cfg.liveModels.length ? cfg.liveModels : DEFAULT_LIVE_MODELS;
  }
  function liveUrl(model) {
    if (cfg.liveEndpoint) return cfg.liveEndpoint.replace('{model}', encodeURIComponent(model));
    const base = (cfg.endpoint || '').replace(/\/?\{model\}.*$/, '');
    if (/googleapis\.com/.test(base)) { // direkte til Google (uden Worker)
      return 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=' + encodeURIComponent(cfg.apiKey);
    }
    return base.replace(/^http/, 'ws') + '/live/' + encodeURIComponent(model);
  }
  function historyForLive() {
    // Live: tekst-ture som kontekst; kun det seneste billede sendes (som videoframe)
    let image = null;
    const turns = history.map(turn => {
      const parts = turn.parts.filter(p => p.text).map(p => ({ text: p.text }));
      const img = turn.parts.find(p => p.inlineData);
      if (img && turn === history[history.length - 1]) image = img.inlineData;
      else if (img) parts.push({ text: '[billede vedhæftet]' });
      return { role: turn.role, parts: parts.length ? parts : [{ text: '…' }] };
    });
    return { turns, image };
  }
  function callLive(entry) {
    const model = entry.model;
    return new Promise((resolve, reject) => {
      let ws;
      try { ws = new WebSocket(liveUrl(model)); } catch (err) { reject(err); return; }
      ws.binaryType = 'arraybuffer';
      let text = '';
      let done = false;
      const finish = (err) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        try { ws.close(); } catch (_) {}
        if (err) reject(err);
        else if (text.trim()) resolve({ text: text.trim() + '\n\n_(svar via reservemodel)_', sources: [], entryHtml: null });
        else { const e = new Error('empty'); e.status = 'empty'; reject(e); }
      };
      const timer = setTimeout(() => finish(Object.assign(new Error('timeout'), { status: 'timeout' })), 60000);

      ws.onopen = () => {
        const setup = {
          setup: {
            model: 'models/' + model,
            generationConfig: entry.text
              ? { responseModalities: ['TEXT'], temperature: 0.3 }
              : { responseModalities: ['AUDIO'], temperature: 0.3 },
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
          }
        };
        if (!entry.text) setup.setup.outputAudioTranscription = {};
        if (entry.thinking) setup.setup.generationConfig.thinkingConfig = { thinkingLevel: entry.thinking };
        ws.send(JSON.stringify(setup));
      };
      ws.onmessage = async (ev) => {
        let raw = ev.data;
        if (raw instanceof ArrayBuffer) raw = new TextDecoder().decode(raw);
        else if (raw instanceof Blob) raw = await raw.text();
        let msg;
        try { msg = JSON.parse(raw); } catch (_) { return; }
        if (msg.setupComplete) {
          const { turns, image } = historyForLive();
          if (image) ws.send(JSON.stringify({ realtimeInput: { video: { data: image.data, mimeType: image.mimeType } } }));
          ws.send(JSON.stringify({ clientContent: { turns, turnComplete: true } }));
          return;
        }
        const sc = msg.serverContent;
        if (sc) {
          if (sc.modelTurn && sc.modelTurn.parts) sc.modelTurn.parts.forEach(p => { if (p.text && !p.thought) text += p.text; });
          if (sc.outputTranscription && sc.outputTranscription.text) text += sc.outputTranscription.text;
          if (sc.turnComplete) finish();
        }
        if (msg.error) finish(Object.assign(new Error(msg.error.message || 'live error'), { status: msg.error.code || 'live', detail: msg.error.message }));
      };
      ws.onerror = () => finish(Object.assign(new Error('Live-forbindelse fejlede'), { status: 'live' }));
      ws.onclose = (ev) => {
        if (!done) {
          if (text.trim()) finish();
          else finish(Object.assign(new Error('Live lukkede: ' + ev.code + ' ' + (ev.reason || '')), { status: 'live', detail: ev.reason }));
        }
      };
    });
  }

  async function callModel(model, opts = {}) {
    const url = cfg.endpoint.replace('{model}', encodeURIComponent(model));
    const body = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT + (opts.web ? WEB_ADDON : '') }] },
      contents: history,
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
    };
    if (opts.web) body.tools = [{ google_search: {} }];
    // Nøglen sendes i header. Går kaldet via Workeren, ignorerer den headeren og bruger sin egen nøgle.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': cfg.apiKey },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = new Error('HTTP ' + res.status);
      err.status = res.status;
      err.web = !!opts.web;
      try { err.detail = (await res.json()).error?.message; } catch (_) {}
      console.error('Marvin: Gemini svarede ' + res.status + (err.detail ? ': ' + err.detail : ''));
      throw err;
    }
    const data = await res.json();
    const cand = data.candidates && data.candidates[0];
    const text = cand && cand.content && cand.content.parts
      ? cand.content.parts.filter(p => !p.thought).map(p => p.text || '').join('').trim()
      : '';
    if (!text) {
      const e = new Error('empty'); e.status = 'empty'; e.finish = cand && cand.finishReason; throw e;
    }
    const gm = (cand && cand.groundingMetadata) || {};
    const sources = (gm.groundingChunks || []).map(c => c.web).filter(Boolean)
      .filter((w, i, arr) => arr.findIndex(x => x.uri === w.uri) === i);
    const entryHtml = gm.searchEntryPoint && gm.searchEntryPoint.renderedContent;
    return { text, sources, entryHtml };
  }

  function friendlyError(err) {
    const phone = cfg.supportPhone || '23905042';
    if (err.status === 429 && err.web) return 'Websøgningen er brugt op for i dag hos Google, så Marvin kan ikke søge lige nu. Ring til IT-support på ' + phone + '.' + (err.detail ? '\n\nTeknisk info: 429: ' + err.detail : '');
    if (err.status === 429) return 'Alle gratis-modeller er brugt op for i dag, og reservemodellen svarede ikke. Marvin kan svare igen fra kl. 09 i morgen. Find guiden i oversigten, eller ring til IT-support på ' + phone + '.' + (err.detail ? '\n\nTeknisk info: 429: ' + err.detail : '');
    if (err.status === 'live' || err.status === 'timeout') return 'Reservemodellen svarede ikke. Prøv igen, find guiden i oversigten, eller ring til IT-support på ' + phone + '.' + (err.detail ? '\n\nTeknisk info: ' + err.detail : '');
    if (err.status === 503) return 'Googles servere har travlt lige nu, og jeg står i kø som alle andre. Prøv igen om et par minutter, eller find guiden i oversigten.';
    if (err.status === 400 || err.status === 403 || err.status === 404) return `Marvin er ikke sat rigtigt op (nøgle, adresse eller modelnavn). Brug guiderne i oversigten, eller ring til IT-support på ${phone}.` + (err.detail ? `

Teknisk info: ${err.status}: ${err.detail}` : '');
    if (err.status === 'empty') return `Jeg kunne ikke give et svar på det. Prøv at beskrive fejlen med andre ord, eller ring til IT-support på ${phone}.`;
    if (err instanceof TypeError) return 'Jeg kan ikke komme på nettet lige nu. Guiderne i oversigten virker stadig, de bor her på tabletten.';
    const detail = [err.status, err.detail].filter(Boolean).join(': ');
    return `Der skete en fejl. Prøv igen, eller ring til IT-support på ${phone}.` + (detail ? `

Teknisk info: ${detail}` : '');
  }

  /* ---------- Send til IT-support ----------
     1) Via Workeren (/ticket), som sender mailen. Virker overalt, også i appens indlejrede browser.
     2) Ellers mailto: (kun i rigtige browsere).
     3) Ellers kopieres teksten, så den kan sættes ind i Gmail. */
  function ticketEndpoint() {
    if (!cfg.endpoint || !cfg.endpoint.includes('{model}')) return null;
    const base = cfg.endpoint.replace(/\/?\{model\}.*$/, '');
    if (/googleapis\.com/.test(base)) return null; // direkte Google-kald: ingen Worker at sende via
    return base + '/ticket';
  }
  function deviceInfo() {
    const ua = navigator.userAgent;
    const modelMatch = ua.match(/\b(SM-[A-Z0-9]+)\b/);
    const androidMatch = ua.match(/Android\s+([\d.]+)/);
    return (modelMatch ? modelMatch[1] : 'ukendt model') + (androidMatch ? ', Android ' + androidMatch[1] : '') + (IN_APP_WEBVIEW ? ' (via MV-appen)' : ' (via Chrome)');
  }
  function buildTicket(name) {
    const lines = transcript.map(t => `${t.who}: ${t.text}`).join('\n\n');
    const first = (transcript.find(t => t.who === 'Du') || { text: 'fejl' }).text;
    const subject = 'Support fra tablet' + (name ? ' (' + name + ')' : '') + ': ' + first.slice(0, 60);
    const body = `Hej IT-support\n\nJeg har brug for hjælp. Her er, hvad jeg har prøvet sammen med Marvin:\n\n${lines || '(ingen samtale endnu)'}\n\nNavn: ${name || '(ikke udfyldt)'}\nTablet: ${deviceInfo()}\nTid: ${new Date().toLocaleString('da-DK')}\n`;
    return { subject, body };
  }
  async function sendTicket(name) {
    const { subject, body } = buildTicket(name);
    const url = ticketEndpoint();
    if (url) {
      try {
        // De seneste billeder fra samtalen sendes med som bilag
        const attachments = history.flatMap(t => t.parts.filter(p => p.inlineData)).slice(-2)
          .map((p, i) => ({ name: 'marvin-billede-' + (i + 1) + '.jpg', mimeType: p.inlineData.mimeType, data: p.inlineData.data }));
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, body, name, attachments }) });
        if (res.ok) return { ok: true, how: 'worker' };
        const detail = await res.text().catch(() => '');
        console.warn('Marvin: ticket via Worker fejlede ' + res.status + ' ' + detail);
      } catch (err) {
        console.warn('Marvin: ticket via Worker fejlede', err);
      }
    }
    if (!IN_APP_WEBVIEW && cfg.supportEmail) {
      const short = body.length > 1500 ? body.slice(0, 1500) + '\n[forkortet]' : body;
      location.href = `mailto:${encodeURIComponent(cfg.supportEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(short)}`;
      return { ok: true, how: 'mailto' };
    }
    try {
      await navigator.clipboard.writeText(`Til: ${cfg.supportEmail}\nEmne: ${subject}\n\n${body}`);
      return { ok: false, how: 'clipboard' };
    } catch (_) {
      return { ok: false, how: 'none' };
    }
  }
  if (escalateBtn) {
    escalateBtn.addEventListener('click', () => {
      if (sheet.querySelector('.ai-ticket-form')) return;
      const el = document.createElement('div');
      el.className = 'ai-msg ai-bot ai-ticket-form';
      el.innerHTML = `
        <p>Jeg sender samtalen til IT-support. Skriv dit navn, så de ved, hvem de skal ringe til:</p>
        <input type="text" class="ai-ticket-name" placeholder="Dit navn" autocomplete="name" />
        <div class="ai-ticket-actions">
          <button type="button" class="ai-search-btn ai-ticket-send">Send til IT-support</button>
          <button type="button" class="ai-ticket-cancel">Annullér</button>
        </div>`;
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      const nameInput = el.querySelector('.ai-ticket-name');
      nameInput.focus();
      el.querySelector('.ai-ticket-cancel').addEventListener('click', () => el.remove());
      el.querySelector('.ai-ticket-send').addEventListener('click', async () => {
        const btn = el.querySelector('.ai-ticket-send');
        btn.disabled = true; btn.textContent = 'Sender…';
        const name = nameInput.value.trim();
        const result = await sendTicket(name);
        el.remove();
        const phone = cfg.supportPhone || '23905042';
        if (result.how === 'worker') addMessage('model', `Sendt til IT-support${name ? ', ' + name : ''}. De har hele samtalen, så du slipper for at forklare det igen. Haster det, så ring på ${phone}.`);
        else if (result.how === 'mailto') addMessage('model', 'Jeg har åbnet en mail til IT-support med samtalen. Tryk send i mailprogrammet.');
        else if (result.how === 'clipboard') addMessage('model', `Jeg kunne ikke sende automatisk, men samtalen er kopieret. Åbn Gmail, lav en ny mail til ${cfg.supportEmail}, og hold fingeren i tekstfeltet for at sætte ind. Eller ring på ${phone}.`);
        else addMessage('model', `Jeg kunne ikke sende automatisk. Ring til IT-support på ${phone}.`);
        transcript.push({ who: 'Marvin', text: '[henvendelse sendt til IT-support: ' + result.how + ']' });
      });
    });
  }
})();
