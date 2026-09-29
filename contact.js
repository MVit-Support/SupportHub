/*
  MV Polering Support – "Skriv til IT-support".
  Lille formular (navn + besked), der sendes som mail via Workeren (/ticket), ligesom Marvins henvendelser.
  Virker uafhængigt af Marvin. Bruger supportPhone/supportEmail/endpoint fra ai-config.js.
  Fald tilbage: mailto: i rigtige browsere, ellers kopiering til udklipsholder (appens indlejrede browser kan ikke åbne mail).
*/
(function () {
  const cfg = window.MV_AI || {};
  const phone = cfg.supportPhone || '23905042';
  const email = cfg.supportEmail || '';
  const IN_APP_WEBVIEW = /; wv\)/.test(navigator.userAgent) || /\bwv\b/.test(navigator.userAgent);

  function escapeHtml(v = '') {
    return v.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function ticketEndpoint() {
    if (!cfg.endpoint || !cfg.endpoint.includes('{model}')) return null;
    const base = cfg.endpoint.replace(/\/?\{model\}.*$/, '');
    if (/googleapis\.com/.test(base)) return null;
    return base + '/ticket';
  }
  function deviceInfo() {
    const ua = navigator.userAgent;
    const modelMatch = ua.match(/\b(SM-[A-Z0-9]+)\b/);
    const androidMatch = ua.match(/Android\s+([\d.]+)/);
    return (modelMatch ? modelMatch[1] : 'ukendt model') + (androidMatch ? ', Android ' + androidMatch[1] : '') + (IN_APP_WEBVIEW ? ' (via MV-appen)' : ' (via Chrome)');
  }

  /* ---------- Knapper ---------- */
  // Appens indlejrede browser kan ikke åbne tel:-links. Dér kopierer et tryk nummeret i stedet.
  function phoneHtml(label) {
    return IN_APP_WEBVIEW
      ? `<button type="button" class="contact-phone contact-phone-copy" title="Kopiér nummeret">${label}</button>`
      : `<a class="contact-phone" href="tel:${phone}">${label}</a>`;
  }
  // Desktop: i guidens titelbjælke (erstatter den passive "IT-Support • nummer"-chip)
  const chip = document.querySelector('.helper-chip');
  if (chip) {
    chip.innerHTML = phoneHtml('IT-Support ' + phone) + `<button type="button" class="contact-open">✉ Skriv til IT-support</button>`;
    chip.classList.add('helper-chip-contact');
  }
  // Mobil/tablet: i oversigten under søgefeltet
  const asideTop = document.querySelector('.aside-top');
  if (asideTop) {
    const row = document.createElement('div');
    row.className = 'contact-row';
    row.innerHTML = phoneHtml('📞 ' + phone) + `<button type="button" class="btn soft contact-open">✉ Skriv til IT-support</button>`;
    asideTop.appendChild(row);
  }
  document.querySelectorAll('.contact-phone-copy').forEach(btn => {
    const label = btn.textContent;
    btn.addEventListener('click', async () => {
      let copied = false;
      try { await navigator.clipboard.writeText(phone); copied = true; } catch (_) {}
      btn.textContent = copied ? '✓ Kopieret: ' + phone : phone;
      btn.classList.add('copied');
      showToast(copied
        ? `Nummeret ${phone} er kopieret. Åbn Telefon-appen, og sæt det ind, eller tast det.`
        : `Ring til IT-support på ${phone} fra Telefon-appen.`);
      setTimeout(() => { btn.textContent = label; btn.classList.remove('copied'); }, 4000);
    });
  });
  let toastTimer = null;
  function showToast(text) {
    let t = document.querySelector('.contact-toast');
    if (!t) { t = document.createElement('div'); t.className = 'contact-toast'; document.body.appendChild(t); }
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 4000);
  }

  /* ---------- Formular ---------- */
  const sheet = document.createElement('div');
  sheet.className = 'contact-sheet hidden';
  sheet.innerHTML = `
    <div class="contact-box">
      <div class="contact-head">
        <div>
          <div class="contact-title">Skriv til IT-support</div>
          <div class="contact-sub">Vi vender tilbage hurtigst muligt. Haster det: ring ${escapeHtml(phone)}</div>
        </div>
        <button type="button" class="contact-close" aria-label="Luk">✕</button>
      </div>
      <form class="contact-form" novalidate>
        <label>Dit navn
          <input type="text" name="name" autocomplete="name" placeholder="Fx Mads" required />
        </label>
        <label>Din besked
          <textarea name="message" rows="6" placeholder="Beskriv hvad der er galt, og hvad du allerede har prøvet…" required></textarea>
        </label>
        <div class="contact-attach">
          ${IN_APP_WEBVIEW
            ? `<div class="contact-attach-hint contact-attach-blocked"><strong>Billeder kan ikke vedhæftes inde fra MV-appen.</strong> Beskriv fejlen med ord her, eller send skærmbilledet fra Galleri: åbn billedet, tryk <strong>Del</strong> → <strong>Gmail</strong> → til <strong>${escapeHtml(email || 'IT-support')}</strong>. Åbner du support-siden i Chrome, kan du vedhæfte direkte.</div>`
            : `<label class="btn soft contact-attach-btn">🖼️ Vedhæft skærmbillede
            <input type="file" accept="image/*" multiple hidden />
          </label>
          <div class="contact-thumbs"></div>
          <div class="contact-attach-hint">Skærmbillede: tryk kort på Tænd/sluk og Lydstyrke ned samtidig. Op til 3 billeder.</div>`}
        </div>
        <div class="contact-hint">Skriv ikke kundenavne, adresser eller koder. Tabletmodel og tidspunkt sendes med automatisk.</div>
        <div class="contact-actions">
          <button type="submit" class="btn contact-send">Send til IT-support</button>
          <button type="button" class="contact-cancel">Annullér</button>
        </div>
        <div class="contact-status" aria-live="polite"></div>
      </form>
    </div>`;
  document.body.appendChild(sheet);

  const form = sheet.querySelector('.contact-form');
  const status = sheet.querySelector('.contact-status');
  const sendBtn = sheet.querySelector('.contact-send');
  const nameInput = form.elements.name;
  const msgInput = form.elements.message;
  const fileInput = form.querySelector('.contact-attach input[type=file]') || document.createElement('input');
  const thumbs = form.querySelector('.contact-thumbs') || document.createElement('div');
  const MAX_IMAGES = 3;
  const MAX_PX = 1280;
  let attachments = []; // {name, mimeType, data(base64), dataUrl}

  function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error || new Error('read failed'));
      r.readAsDataURL(file);
    });
  }
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('bad image'));
      img.src = src;
    });
  }
  async function shrinkImage(file) {
    let img;
    const url = URL.createObjectURL(file);
    try { img = await loadImage(url); }
    catch (_) { img = await loadImage(await readAsDataUrl(file)); } // reserve: læs filen direkte
    finally { URL.revokeObjectURL(url); }
    const scale = Math.min(1, MAX_PX / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    return { name: (file.name || 'billede').replace(/\.[a-z0-9]+$/i, '') + '.jpg', mimeType: 'image/jpeg', data: dataUrl.split(',')[1], dataUrl };
  }
  function renderThumbs() {
    thumbs.innerHTML = attachments.map((a, i) => `<div class="contact-thumb"><img src="${a.dataUrl}" alt="" /><button type="button" data-i="${i}" aria-label="Fjern billede">✕</button></div>`).join('');
  }
  thumbs.addEventListener('click', e => {
    const b = e.target.closest('button[data-i]');
    if (!b) return;
    attachments.splice(Number(b.dataset.i), 1);
    renderThumbs();
  });
  fileInput.addEventListener('change', async () => {
    const files = [...(fileInput.files || [])];
    status.textContent = files.length ? 'Læser billede…' : '';
    for (const f of files) {
      if (attachments.length >= MAX_IMAGES) { status.textContent = 'Højst ' + MAX_IMAGES + ' billeder.'; break; }
      try {
        attachments.push(await shrinkImage(f));
        status.textContent = attachments.length + (attachments.length === 1 ? ' billede vedhæftet.' : ' billeder vedhæftet.');
        status.classList.add('ok');
      } catch (err) {
        console.warn('Kontakt: billede kunne ikke læses', err);
        status.textContent = 'Billedet kunne ikke læses. Prøv at vælge det igen, eller tag et nyt skærmbillede.';
        status.classList.remove('ok');
      }
    }
    fileInput.value = '';
    renderThumbs();
  });
  // Ctrl+V med et billede i beskedfeltet
  msgInput.addEventListener('paste', async e => {
    const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'));
    if (!item || attachments.length >= MAX_IMAGES) return;
    e.preventDefault();
    try { attachments.push(await shrinkImage(item.getAsFile())); renderThumbs(); } catch (_) {}
  });

  function open() {
    sheet.classList.remove('hidden');
    document.body.classList.add('contact-open-body');
    status.textContent = '';
    try { nameInput.value = nameInput.value || localStorage.getItem('mv-contact-name') || ''; } catch (_) {}
    setTimeout(() => (nameInput.value ? msgInput : nameInput).focus(), 50);
  }
  function close() {
    sheet.classList.add('hidden');
    document.body.classList.remove('contact-open-body');
  }
  document.querySelectorAll('.contact-open').forEach(b => b.addEventListener('click', open));
  sheet.querySelector('.contact-close').addEventListener('click', close);
  sheet.querySelector('.contact-cancel').addEventListener('click', close);
  sheet.addEventListener('click', e => { if (e.target === sheet) close(); });

  async function sendTicket(name, message) {
    const subject = 'Besked fra tablet (' + name + '): ' + message.slice(0, 60).replace(/\s+/g, ' ');
    const body = `Hej IT-support\n\n${message}\n\nNavn: ${name}\nTablet: ${deviceInfo()}\nTid: ${new Date().toLocaleString('da-DK')}\nSendt fra: support-siden (Skriv til IT-support)\n` + (attachments.length ? `Vedhæftet: ${attachments.length} billede(r)\n` : '');
    const url = ticketEndpoint();
    if (url) {
      try {
        const payload = { subject, body, name, attachments: attachments.map(a => ({ name: a.name, mimeType: a.mimeType, data: a.data })) };
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) return 'worker';
        console.warn('Kontakt: Worker svarede ' + res.status + ' ' + (await res.text().catch(() => '')));
      } catch (err) {
        console.warn('Kontakt: Worker fejlede', err);
      }
    }
    if (!IN_APP_WEBVIEW && email) {
      location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return 'mailto';
    }
    try { await navigator.clipboard.writeText(`Til: ${email}\nEmne: ${subject}\n\n${body}`); return 'clipboard'; }
    catch (_) { return 'none'; }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    if (!name) { status.textContent = 'Skriv dit navn, så IT-support ved, hvem de skal ringe til.'; nameInput.focus(); return; }
    if (message.length < 5) { status.textContent = 'Skriv lidt mere om, hvad der er galt.'; msgInput.focus(); return; }
    try { localStorage.setItem('mv-contact-name', name); } catch (_) {}

    sendBtn.disabled = true;
    const label = sendBtn.textContent;
    sendBtn.textContent = 'Sender…';
    status.textContent = ''; status.classList.remove('ok');
    const how = await sendTicket(name, message);
    sendBtn.disabled = false;
    sendBtn.textContent = label;

    if (how === 'worker') {
      form.reset();
      attachments = []; renderThumbs();
      nameInput.value = name;
      status.textContent = `Sendt. IT-support har fået din besked og vender tilbage. Haster det, så ring ${phone}.`;
      status.classList.add('ok');
      setTimeout(() => { close(); status.classList.remove('ok'); status.textContent = ''; }, 3500);
    } else if (how === 'mailto') {
      status.textContent = 'Din mail er åbnet. Tryk send i mailprogrammet.';
    } else if (how === 'clipboard') {
      status.textContent = `Kunne ikke sende automatisk. Beskeden er kopieret: åbn Gmail, ny mail til ${email}, og sæt ind. Billeder skal vedhæftes manuelt. Eller ring ${phone}.`;
    } else {
      status.textContent = `Kunne ikke sende automatisk. Ring til IT-support på ${phone}.`;
    }
  });
})();
