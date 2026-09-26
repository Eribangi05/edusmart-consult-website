/* ===== FMIS ui helpers: modals, toasts, forms, small components, event delegation ===== */
'use strict';
const VIEWS = {};                     // screens: VIEWS.name = () => html
const ACT = {};                       // click handlers, called from data-act="name" attributes
const VS = { q: {}, tab: {}, sel: {} }; // view state: search boxes, tabs, selections (kept while you move around)

function toast(msg, bad) {
  const box = $('#toasts'); if (!box) return;
  const el = document.createElement('div'); el.className = 'toast' + (bad ? ' bad' : ''); el.textContent = msg; el.setAttribute('role', bad ? 'alert' : 'status');
  box.appendChild(el); setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, bad ? 4200 : 2600);
}
function closeModal() { const m = $('#modal-root'); if (m) m.innerHTML = ''; }
const modalOpen = () => { const m = $('#modal-root'); return !!(m && m.innerHTML.trim()); };

function fld(f) {
  const { name, label, type = 'text', value = '', options, required, placeholder, hint, full, min, max, step, readonly, rows } = f;
  const req = required ? 'required' : '';
  let input;
  if (options) input = `<select name="${name}" ${req}>${options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(v) === String(value) ? 'selected' : ''}>${esc(l)}</option>`; }).join('')}</select>`;
  else if (type === 'textarea') input = `<textarea name="${name}" rows="${rows || 3}" placeholder="${esc(placeholder || '')}" ${req}>${esc(value)}</textarea>`;
  else input = `<input name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder || '')}" ${req} ${min !== undefined ? `min="${min}"` : ''} ${max !== undefined ? `max="${max}"` : ''} ${step ? `step="${step}"` : ''} ${readonly ? 'readonly' : ''} autocomplete="off">`;
  return `<div class="${full ? 'full' : ''}"><label class="f">${esc(label)}${required ? ' *' : ''}</label>${input}${hint ? `<span class="hint muted">${esc(hint)}</span>` : ''}</div>`;
}
const F = (fields) => `<div class="fg">${fields.map(fld).join('')}</div>`;

function modal({ title, body, wide, submit = 'Save', onSubmit, onInput, footer, cancel = 'Cancel', danger }) {
  $('#modal-root').innerHTML = `<div class="scrim" data-act="closeModalScrim"><form class="modal ${wide ? 'wide' : ''}" id="mform" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header><h3>${title}</h3><button type="button" class="iconbtn" data-act="closeModal" aria-label="Close">✕</button></header><div class="bd">${body}</div>
    <footer>${footer || ''}<span class="sp"></span>${cancel ? `<button type="button" class="btn" data-act="closeModal">${cancel}</button>` : ''}${onSubmit ? `<button class="btn ${danger ? 'r' : 'p'}" type="submit">${submit}</button>` : ''}</footer></form></div>`;
  const form = $('#mform');
  form.onsubmit = async (e) => { e.preventDefault(); if (!onSubmit) return; const v = Object.fromEntries(new FormData(form).entries()); form.querySelectorAll('input[type=checkbox]').forEach((c) => { if (c.name) { const all = form.querySelectorAll(`input[type=checkbox][name="${c.name}"]`); if (all.length > 1) v[c.name] = [...all].filter((x) => x.checked).map((x) => x.value); } }); const r = await onSubmit(v, form); if (r !== false) closeModal(); };
  if (onInput) { form.oninput = () => onInput(Object.fromEntries(new FormData(form).entries()), form); onInput(Object.fromEntries(new FormData(form).entries()), form); }
  const first = form.querySelector('input:not([type=hidden]):not([readonly]),select,textarea'); if (first && !window.matchMedia('(pointer:coarse)').matches) first.focus();
}
function confirmBox(text, onYes, yes = 'Yes, continue', danger) {
  modal({ title: 'Please confirm', body: `<p>${text}</p>`, submit: yes, danger, onSubmit: () => { onYes(); } });
}

const pill = (txt, cls = '') => `<span class="pill ${cls}">${txt}</span>`;
const empty = (icon, text, sub = '') => `<div class="empty"><div class="e">${icon}</div><b>${text}</b><div>${sub}</div></div>`;
const kpi = (cls, ico, label, val, desc = '') => `<div class="kpi ${cls}"><div class="ico">${ico}</div><div class="l">${label}</div><div class="v">${val}</div><div class="d">${desc}</div></div>`;
const roleTag = (r) => `<span class="role ${r}">${esc(ROLES[r] || r)}</span>`;
const stPill = (kind, st) => { const map = { TODO: '', DOING: 'info', DONE: 'ok', BLOCKED: 'bad', PLANNING: '', ACTIVE: 'ok', PAUSED: 'warn', DRAFT: 'warn', PUBLISHED: 'ok', CLOSED: '', SUBMITTED: 'info', APPROVED: 'ok', RETURNED: 'warn', REJECTED: 'bad', SENT: 'info', REVIEWED: 'ok', INACTIVE: 'bad' }; return pill(esc((STATUS[kind] || {})[st] || st), map[st] || ''); };
const guard = (ok, msg) => { if (!ok) toast(msg || 'You do not have permission for this action.', true); return ok; };
const options = (map) => Object.entries(map);
const memberOpts = (list) => list.map((m) => [m.id, m.name]);
const bar = (p, cls = '') => `<div class="bar-t ${cls}"><div class="bar-f" style="width:${Math.max(0, Math.min(100, p))}%"></div></div>`;
const searchBox = (key, ph = 'Search…') => `<div class="searchin"><span>🔍</span><input data-filter="${key}" placeholder="${esc(ph)}" value="${esc(VS.q[key] || '')}" aria-label="${esc(ph)}"></div>`;
const tabsBar = (key, items, cur) => `<div class="tabs" role="tablist">${items.map(([k, l]) => `<button type="button" role="tab" aria-selected="${cur === k}" class="${cur === k ? 'on' : ''}" data-act="setTab" data-key="${key}" data-v="${esc(k)}">${l}</button>`).join('')}</div>`;

/* one delegated listener for all buttons and links with data-act */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act;
  if (a === 'closeModalScrim') { if (e.target === el) closeModal(); return; }
  if (ACT[a]) { const r = ACT[a](el.dataset, e, el); if (r && typeof r.catch === 'function') r.catch((err) => { console.error(err); toast('Something went wrong: ' + (err && err.message || err), true); }); }
});
document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-filter]'); if (!el) return;
  VS.q[el.dataset.filter] = el.value;
  const pos = el.selectionStart; render(); const again = $(`[data-filter="${el.dataset.filter}"]`); if (again) { again.focus(); try { again.setSelectionRange(pos, pos); } catch (err) { /* not supported for this input */ } }
});
ACT.closeModal = () => closeModal();
ACT.setTab = ({ key, v }) => { VS.tab[key] = v; render(); };
