/*
  MV Polering Support – "Åbn i Chrome".
  Inde i MV-appens indlejrede browser virker kamera, billeder, opkald og mail ikke. Alt virker i Chrome.
  Dette script viser derfor en bjælke øverst inde i appen og forsøger at åbne siden i Chrome via en
  Android intent-adresse. Forsøget sker i en usynlig ramme, så det ikke ender i en fejlside, hvis appens
  browser ikke giver adressen videre til Android. Lykkes det ikke, kan brugeren kopiere adressen.

  Slå fra: sæt window.MV_AI.openInChrome = false i ai-config.js.
  Automatisk forsøg ved åbning: window.MV_AI.openInChromeAuto = true/false (standard: true).
*/
(function () {
  const cfg = window.MV_AI || {};
  if (cfg.openInChrome === false) return;
  const IN_APP_WEBVIEW = /; wv\)/.test(navigator.userAgent) || /\bwv\b/.test(navigator.userAgent);
  if (!IN_APP_WEBVIEW) return;

  const pageUrl = location.origin + location.pathname + location.hash;
  const shortUrl = pageUrl.replace(/^https?:\/\//, '');
  const intentUrl = 'intent://' + pageUrl.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;end';

  const bar = document.createElement('div');
  bar.className = 'chrome-bar';
  bar.innerHTML = `
    <span class="chrome-bar-text">Kamera, billeder og opkald virker kun i Chrome.</span>
    <button type="button" class="chrome-bar-open">Åbn i Chrome</button>
    <button type="button" class="chrome-bar-close" aria-label="Luk">✕</button>`;
  document.body.prepend(bar);
  document.body.classList.add('has-chrome-bar');

  const text = bar.querySelector('.chrome-bar-text');
  let attempts = 0;

  function tryOpen(auto) {
    attempts++;
    // Usynlig ramme: hvis appens browser giver intent-adressen videre, åbner Chrome. Ellers sker der ingenting synligt.
    let frame = document.getElementById('chromeIntentFrame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'chromeIntentFrame';
      frame.style.cssText = 'position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none';
      document.body.appendChild(frame);
    }
    frame.src = intentUrl;
    if (!auto) {
      text.textContent = 'Åbner Chrome… Skete der ingenting, så åbn Chrome selv og skriv: ' + shortUrl;
      try { navigator.clipboard.writeText(pageUrl); text.textContent += ' (adressen er kopieret)'; } catch (_) {}
    }
  }

  bar.querySelector('.chrome-bar-open').addEventListener('click', () => tryOpen(false));
  bar.querySelector('.chrome-bar-close').addEventListener('click', () => {
    bar.remove();
    document.body.classList.remove('has-chrome-bar');
    try { sessionStorage.setItem('mv-chrome-bar-closed', '1'); } catch (_) {}
  });

  let closed = false;
  try { closed = sessionStorage.getItem('mv-chrome-bar-closed') === '1'; } catch (_) {}
  if (closed) { bar.remove(); document.body.classList.remove('has-chrome-bar'); return; }

  // Automatisk forsøg én gang pr. åbning af appen
  if (cfg.openInChromeAuto !== false) {
    let tried = false;
    try { tried = sessionStorage.getItem('mv-chrome-auto-tried') === '1'; } catch (_) {}
    if (!tried) {
      try { sessionStorage.setItem('mv-chrome-auto-tried', '1'); } catch (_) {}
      setTimeout(() => tryOpen(true), 600);
    }
  }
})();
