/*
  MV Polering Support – Marvin, AI-hjælperen (Google Gemini).
  Kræver window.MV_AI (ai-config.js) og window.RAW_GUIDES (guides.js).
  Kalder Gemini direkte fra browseren. Nøglen skal være låst til sidens adresse (se AI-OPSAETNING.md).
*/
(function () {
  const cfg = window.MV_AI || {};
  const guides = window.RAW_GUIDES || [];
  if (!cfg.apiKey || !guides.length) return;

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

  const SYSTEM_PROMPT = `Du er Marvin, MV Polerings support-hjælper for vinduespudserne. De bruger en Samsung Galaxy Tab (S6 Lite eller S10 Lite, One UI), en Epson TM-P20II Bluetooth-bonprinter og MV Polering-appen.

REGLER
- Svar KUN ud fra guiderne nedenfor. Opfind aldrig trin, menunavne eller knapper, der ikke står i guiderne.
- Dækker guiderne ikke problemet, så sig det kort, og henvis til IT-support på telefon ${cfg.supportPhone || '23905042'}.
- Svar på dansk, i du-form, kort og konkret. Brug nummererede trin. Giv højst 5-6 trin ad gangen, og bed brugeren vende tilbage, hvis det ikke hjalp.
- Er symptomet uklart, så stil ÉT afklarende spørgsmål først (fx "Lyser den orange lampe fast, eller blinker den?").
- Afslut altid med et link til den guide, du bygger svaret på, i formatet [Guidens titel](#guide-id). Brug præcis id'et fra overskriften.
- Får du et billede: beskriv kort, hvad du ser (lamper, fejlbeskeder, skærm), og brug det til at vælge guide. Er billedet uklart, bed om et nyt, taget tættere på. Vil brugeren vise noget på tablettens skærm, så foreslå et skærmbillede (tryk kort på Tænd/sluk og Lydstyrke ned samtidig) og knappen 🖼️.
- Bed aldrig om, og gentag aldrig, kundenavne, adresser, koder eller adgangskoder. Sig venligt, at det ikke skal skrives her, hvis brugeren gør det.
- Har brugeren prøvet trinnene uden held, så foreslå knappen "Send til IT-support" og opsummer i 2-3 linjer, hvad der er prøvet.
- Ingen indledende høflighedsfraser. Gå direkte til svaret. Du må gerne være venlig og have et glimt i øjet, men hold det kort.

GUIDER
${guidesAsText()}`;

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
        <div class="ai-sub">MV Polerings support-hjælper. Beskriv fejlen, eller send et billede.</div>
      </div>
      <button type="button" class="ai-close" aria-label="Luk">✕</button>
    </div>
    <div class="ai-messages" id="aiMessages"></div>
    <div class="ai-composer">
      <div class="ai-preview hidden" id="aiPreview"><img alt="" /><button type="button" class="ai-preview-remove" aria-label="Fjern billede">✕</button></div>
      <div class="ai-row">
        <label class="ai-photo" title="Tag et billede med kameraet (fx printerens lamper)">
          <input type="file" accept="image/*" capture="environment" hidden />
          <span>📷</span>
        </label>
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

  document.body.appendChild(fab);
  document.body.appendChild(sheet);

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
      addMessage('model', 'Hej, jeg er Marvin. Skriv hvad der driller, eller send et billede: 📷 tager et foto af fx printerens lamper, 🖼️ vælger et skærmbillede fra tabletten.\n\n**Tip:** Tag et skærmbillede ved at trykke kort på Tænd/sluk og Lydstyrke ned samtidig.');
    }
    setTimeout(() => input.focus(), 50);
  }
  function close() {
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
        .replace(/\[([^\]]+)\]\(#([a-z0-9-]+)\)/g, (m, t, id) => `<a href="#${id}" class="ai-guide-link">${escapeHtml(guideTitle(id))}</a>`);
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
  function addMessage(role, text, imageUrl) {
    const el = document.createElement('div');
    el.className = 'ai-msg ' + (role === 'user' ? 'ai-user' : 'ai-bot');
    if (imageUrl) el.innerHTML += `<img class="ai-msg-img" src="${imageUrl}" alt="Vedhæftet billede" />`;
    if (text) el.innerHTML += role === 'user' ? `<p>${escapeHtml(text)}</p>` : renderMarkdown(text);
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

  async function send() {
    const text = input.value.trim();
    if (busy || (!text && !pendingImage)) return;
    busy = true;
    sendBtn.disabled = true;

    const parts = [];
    if (pendingImage) parts.push({ inlineData: { mimeType: pendingImage.mime, data: pendingImage.data } });
    parts.push({ text: text || 'Her er et billede af problemet. Hvad ser du, og hvad skal jeg gøre?' });

    addMessage('user', text, pendingImage && pendingImage.dataUrl);
    transcript.push({ who: 'Du', text: (pendingImage ? '[billede vedhæftet] ' : '') + text });
    history.push({ role: 'user', parts });
    input.value = ''; input.style.height = 'auto';
    pendingImage = null; preview.classList.add('hidden');

    const typing = addTyping();
    try {
      const reply = await askGemini();
      typing.remove();
      addMessage('model', reply);
      transcript.push({ who: 'Marvin', text: reply });
      history.push({ role: 'model', parts: [{ text: reply }] });
    } catch (err) {
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

  // Kæde af modeller: den valgte, reserven og to sikre gratis-modeller. Hver prøves op til 2 gange ved 503.
  function modelChain() {
    const chain = [cfg.model, cfg.fallbackModel, 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
    return chain.filter((m, i) => m && chain.indexOf(m) === i);
  }
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function askGemini() {
    let lastErr = null;
    for (const model of modelChain()) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await callModel(model);
        } catch (err) {
          lastErr = err;
          if (err instanceof TypeError || err.status === 400 || err.status === 403 || err.status === 429) throw err; // giver ikke mening at prøve andre modeller
          console.warn('Marvin: ' + model + ' fejlede (' + err.status + ')' + (attempt === 0 && err.status === 503 ? ', prøver igen om 1,5 s' : ''));
          if (err.status === 503 && attempt === 0) { await sleep(1500); continue; }
          break; // næste model
        }
      }
    }
    throw lastErr;
  }

  async function callModel(model) {
    const url = cfg.endpoint.replace('{model}', encodeURIComponent(model)) + '?key=' + encodeURIComponent(cfg.apiKey);
    const body = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: history,
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = new Error('HTTP ' + res.status);
      err.status = res.status;
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
    return text;
  }

  function friendlyError(err) {
    const phone = cfg.supportPhone || '23905042';
    if (err.status === 429) return 'Marvin er optaget lige nu. Prøv igen om et minut, eller find guiden i oversigten.';
    if (err.status === 503) return 'Googles servere er overbelastede lige nu, så Marvin kan ikke svare. Prøv igen om et par minutter, eller find guiden i oversigten.';
    if (err.status === 400 || err.status === 403 || err.status === 404) return `Marvin er ikke sat rigtigt op (nøgle, adresse eller modelnavn). Brug guiderne i oversigten, eller ring til IT-support på ${phone}.` + (err.detail ? `

Teknisk info: ${err.status}: ${err.detail}` : '');
    if (err.status === 'empty') return `Jeg kunne ikke give et svar på det. Prøv at beskrive fejlen med andre ord, eller ring til IT-support på ${phone}.`;
    if (err instanceof TypeError) return 'Ingen forbindelse til internettet. Guiderne i oversigten virker stadig.';
    const detail = [err.status, err.detail].filter(Boolean).join(': ');
    return `Der skete en fejl. Prøv igen, eller ring til IT-support på ${phone}.` + (detail ? `

Teknisk info: ${detail}` : '');
  }

  /* ---------- Send til IT-support ---------- */
  if (escalateBtn) {
    escalateBtn.addEventListener('click', () => {
      const lines = transcript.map(t => `${t.who}: ${t.text}`).join('\n\n');
      const body = `Hej IT-support\n\nJeg har brug for hjælp. Her er, hvad jeg har prøvet sammen med Marvin:\n\n${lines || '(ingen samtale endnu)'}\n\nTablet: \nNavn: \n`;
      const subject = 'Support fra tablet: ' + (transcript.find(t => t.who === 'Du') || { text: 'fejl' }).text.slice(0, 60);
      location.href = `mailto:${encodeURIComponent(cfg.supportEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
})();
