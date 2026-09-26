/* ===== Ikimina Desktop — French & Kinyarwanda translation layer =====
   Source text in the UI is English. When LANG is 'fr' or 'rw', every text node / placeholder / title
   that appears in the DOM is translated from the dictionaries in i18n-data.js. */
const I18N = { missing: new Set(), collect: false };
const LEAD = /^([^A-Za-z0-9À-ɏ'"(]*)/;   // emoji / symbols before the words
function trText(raw) {
  if (LANG === 'en' || !raw) return raw;
  const idx = LANG === 'fr' ? 0 : 1;
  const lead = (raw.match(/^\s*/) || [''])[0], trail = (raw.match(/\s*$/) || [''])[0];
  let core = raw.trim(); if (!core) return raw;
  const sym = (core.match(LEAD) || [''])[0]; let body = core.slice(sym.length);
  if (!body) return raw;
  // trailing symbols such as ":" or "…" or "→"
  const tm = body.match(/([\s:…→←↩✕✔*\u{1F300}-\u{1FAFF}☀-➿️]*)$/u); const tail = tm ? tm[1] : ''; if (tail) body = body.slice(0, body.length - tail.length);
  const hit = I18N_DICT[body]; if (hit && hit[idx]) return lead + sym + hit[idx] + tail + trail;
  for (const [re, fr, rw] of I18N_PATTERNS) { const m = body.match(re); if (m) { const tpl = idx === 0 ? fr : rw; return lead + sym + tpl.replace(/\$(\d)/g, (_, n) => trPart(m[+n], idx)) + tail + trail; } }
  for (const sep of [' · ', ' — ']) if (body.includes(sep)) {
    const out = body.split(sep).map(p => trText(p)).join(sep);
    if (out !== body) return lead + sym + out + tail + trail;
  }
  if (I18N.collect && /[A-Za-z]{3}/.test(body)) I18N.missing.add(body);
  return raw;
}
function trPart(s, idx) { const h = I18N_DICT[s]; return h && h[idx] ? h[idx] : s; }
const DONE = new WeakSet();
function trNode(n) {
  if (LANG === 'en') return;
  if (n.nodeType === 3) { if (DONE.has(n)) return; DONE.add(n); const p = n.parentNode; if (p && /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return; if (p && p.closest && p.closest('[data-notr]')) return; const v = trText(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; return; }
  if (n.nodeType !== 1) return;
  if (n.closest && n.closest('[data-notr]')) return;
  for (const a of ['placeholder', 'title']) if (n.hasAttribute && n.hasAttribute(a)) { const v = trText(n.getAttribute(a)); if (v !== n.getAttribute(a)) n.setAttribute(a, v); }
  n.childNodes.forEach(trNode);
}
new MutationObserver((ms) => { if (LANG === 'en' && !I18N.collect) return; ms.forEach(m => m.addedNodes.forEach(trNode)); }).observe(document.body, { childList: true, subtree: true });
trNode(document.body);
