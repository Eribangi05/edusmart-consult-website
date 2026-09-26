/* ===== FMIS core: storage, roles, selectors, formatting, charts, demo data ===== */
'use strict';
const DAY = 86400000;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- storage: Electron and Android bridges, or the browser ---------- */
const Store = {
  async load() {
    if (window.api) return await window.api.load();
    try { return JSON.parse(localStorage.getItem('fmis-db')); } catch { return null; }
  },
  _t: null,
  save(db) {
    clearTimeout(this._t);
    this._t = setTimeout(() => { try { if (window.api) window.api.save(db); else localStorage.setItem('fmis-db', JSON.stringify(db)); } catch (e) { toastSafe('Could not save. Free some space on this device.'); } }, 250);
  },
  flush(db) { clearTimeout(this._t); try { if (window.api) window.api.save(db); else localStorage.setItem('fmis-db', JSON.stringify(db)); } catch (e) { /* ignore */ } },
};
const toastSafe = (m) => { try { toast(m, true); } catch (e) { /* ui not ready */ } };

/* ---------- languages ---------- */
const LANGS = { en: 'English', fr: 'Français', rw: 'Ikinyarwanda' };
const TR = {
  fr: { dashboard: 'Tableau de bord', team: 'Équipe', projects: 'Projets', tasks: 'Tâches', forms: 'Formulaires', collect: 'Collecte', submissions: 'Réponses', attendance: 'Présence', map: 'Carte', messages: 'Messages', reports: 'Rapports', performance: 'Performance', library: 'Bibliothèque', certificates: 'Certificats', audit: 'Journal', settings: 'Paramètres', profile: 'Profil', signout: 'Déconnexion', save: 'Enregistrer', cancel: 'Annuler', search: 'Rechercher…', overview: 'Vue d’ensemble', field: 'Terrain', manage: 'Gestion', admin: 'Administration', welcome: 'Bienvenue', new: 'Nouveau', status: 'Statut', name: 'Nom', role: 'Rôle', close: 'Fermer', delete: 'Supprimer', edit: 'Modifier', export: 'Exporter' },
  rw: { dashboard: 'Ibigenderwaho', team: 'Ikipe', projects: 'Imishinga', tasks: 'Imirimo', forms: 'Impapuro', collect: 'Gukusanya', submissions: 'Ibyakusanyijwe', attendance: 'Kuboneka', map: 'Ikarita', messages: 'Ubutumwa', reports: 'Raporo', performance: 'Imikorere', library: 'Ibitabo', certificates: 'Impamyabumenyi', audit: 'Amateka', settings: 'Igenamiterere', profile: 'Umwirondoro', signout: 'Sohoka', save: 'Bika', cancel: 'Hagarika', search: 'Shakisha…', overview: 'Incamake', field: 'Mu murima', manage: 'Imicungire', admin: 'Ubuyobozi', welcome: 'Murakaza neza', new: 'Gishya', status: 'Uko bimeze', name: 'Izina', role: 'Inshingano', close: 'Funga', delete: 'Siba', edit: 'Hindura', export: 'Sohora' },
};
let LANG = 'en';
const t = (k, fallback) => (TR[LANG] && TR[LANG][k]) || fallback || k.charAt(0).toUpperCase() + k.slice(1);

/* ---------- roles ---------- */
const ROLES = { ADMIN: 'Admin', MANAGER: 'Manager', SUPERVISOR: 'Supervisor', AGENT: 'Field agent', VIEWER: 'Viewer' };
const ROLE_ORDER = ['ADMIN', 'MANAGER', 'SUPERVISOR', 'AGENT', 'VIEWER'];
const ROLE_INFO = {
  ADMIN: 'Owns the workspace. Manages the team, settings, projects and forms, and sees everything.',
  MANAGER: 'Runs projects and the team, builds forms, reviews work and reports. Cannot change workspace settings or the Admin.',
  SUPERVISOR: 'Assigns and follows up tasks, reviews submissions and reports, and sees the whole team\'s field work.',
  AGENT: 'Collects data, checks in, sends reports and messages, and updates their own tasks.',
  VIEWER: 'Read only. Sees projects, tasks and approved data. Suits funders and partners.',
};
let SESSION = null;
const role = () => (SESSION ? SESSION.role : null);
const can = {
  admin: () => role() === 'ADMIN',
  manageTeam: () => ['ADMIN', 'MANAGER'].includes(role()),
  manageWork: () => ['ADMIN', 'MANAGER'].includes(role()),
  assign: () => ['ADMIN', 'MANAGER', 'SUPERVISOR'].includes(role()),
  review: () => ['ADMIN', 'MANAGER', 'SUPERVISOR'].includes(role()),
  collect: () => role() && role() !== 'VIEWER',
  checkin: () => role() && role() !== 'VIEWER',
  message: () => role() && role() !== 'VIEWER',
  seeAll: () => ['ADMIN', 'MANAGER', 'SUPERVISOR'].includes(role()),
  viewAudit: () => ['ADMIN', 'MANAGER'].includes(role()),
  report: () => role() && role() !== 'VIEWER',
};

/* ---------- formatting ---------- */
let DB = null;
const RW_M = ['Mutarama', 'Gashyantare', 'Werurwe', 'Mata', 'Gicurasi', 'Kamena', 'Nyakanga', 'Kanama', 'Nzeri', 'Ukwakira', 'Ugushyingo', 'Ukuboza'];
const fdate = (ts, o) => { if (!ts) return '—'; const d = new Date(ts); o = o || { day: 'numeric', month: 'short', year: 'numeric' }; if (LANG === 'rw') return (o.day ? d.getDate() + ' ' : '') + RW_M[d.getMonth()].slice(0, 3) + (o.year ? ' ' + d.getFullYear() : ''); return d.toLocaleDateString(LANG === 'fr' ? 'fr-FR' : 'en-GB', o); };
const ftime = (ts) => (ts ? new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) : '');
const fdt = (ts) => (ts ? fdate(ts) + ' ' + ftime(ts) : '—');
const ago = (ts) => { const m = Math.floor((Date.now() - ts) / 60000); if (m < 1) return 'now'; if (m < 60) return m + ' min ago'; const h = Math.floor(m / 60); if (h < 24) return h + ' h ago'; const d = Math.floor(h / 24); return d < 30 ? d + ' d ago' : fdate(ts); };
const toInputDate = (ts) => new Date(ts).toISOString().slice(0, 10);
const fromInputDate = (s) => (s ? new Date(s + 'T12:00:00').getTime() : null);
const dayStart = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
const initials = (n) => String(n || '?').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const hue = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const avatar = (name, size = 34) => `<span class="av" style="width:${size}px;height:${size}px;font-size:${size * 0.38}px;background:linear-gradient(135deg,hsl(${hue(name)} 55% 42%),hsl(${(hue(name) + 40) % 360} 60% 32%))">${esc(initials(name))}</span>`;
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const num = (n) => (Number(n) || 0).toLocaleString('en-US');

/* ---------- security ---------- */
async function hashPin(pin, salt) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pin));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
async function makeCred(pin) { const salt = uid(); return { salt, pinHash: await hashPin(pin, salt) }; }

/* ---------- data model ----------
   org, members, projects, tasks, forms, submissions, checkins, messages, reports, library, certificates, audit  (all synced)
   prefs, seq, notes                                                                                           (this device only) */
const COLLECTIONS = ['members', 'projects', 'tasks', 'forms', 'submissions', 'checkins', 'messages', 'reports', 'library', 'certificates', 'audit'];
const STATUS = {
  task: { TODO: 'To do', DOING: 'In progress', DONE: 'Done', BLOCKED: 'Blocked' },
  project: { PLANNING: 'Planning', ACTIVE: 'Active', PAUSED: 'Paused', DONE: 'Completed' },
  form: { DRAFT: 'Draft', PUBLISHED: 'Published', CLOSED: 'Closed' },
  submission: { DRAFT: 'Draft', SUBMITTED: 'Submitted', APPROVED: 'Approved', RETURNED: 'Returned', REJECTED: 'Rejected' },
  report: { SENT: 'Sent', REVIEWED: 'Reviewed' },
  member: { ACTIVE: 'Active', INACTIVE: 'Inactive' },
};
const PRIORITY = { LOW: 'Low', NORMAL: 'Normal', HIGH: 'High', URGENT: 'Urgent' };
const FIELD_TYPES = { text: 'Short text', longtext: 'Long text', number: 'Number', date: 'Date', choice: 'Single choice', multi: 'Multiple choice', yesno: 'Yes / No', rating: 'Rating (1 to 5)', gps: 'GPS location', photo: 'Photo', phone: 'Phone number', note: 'Note (instructions, no answer)' };
const REPORT_TYPES = { DAILY: 'Daily report', WEEKLY: 'Weekly report', INCIDENT: 'Incident', CHALLENGE: 'Challenge or need', SUCCESS: 'Success story' };

function migrate() {
  DB.org = DB.org || { name: 'My workspace', sector: '', country: 'Rwanda', createdAt: Date.now() };
  for (const c of COLLECTIONS) DB[c] = DB[c] || [];
  DB.seq = DB.seq || { cert: 0 }; DB.notes = DB.notes || [];
  DB.prefs = DB.prefs || { theme: 'light', lang: 'en', lastUser: null, read: {} };
  DB.prefs.read = DB.prefs.read || {};
}
function audit(action, details) { DB.audit.unshift({ id: uid(), action, details: details || '', by: SESSION ? SESSION.name : 'System', byId: SESSION ? SESSION.id : null, at: Date.now() }); if (DB.audit.length > 1500) DB.audit.length = 1500; }
function commit() { Store.save(DB); if (window.Cloud) Cloud.changed(); }

/* ---------- selectors ---------- */
const S = {
  member: (id) => DB.members.find((m) => m.id === id),
  name: (id) => (S.member(id) || { name: 'Unknown' }).name,
  active: () => DB.members.filter((m) => m.status !== 'INACTIVE'),
  agents: () => DB.members.filter((m) => m.role === 'AGENT' && m.status !== 'INACTIVE'),
  project: (id) => DB.projects.find((p) => p.id === id),
  form: (id) => DB.forms.find((f) => f.id === id),
  tasksOf: (mid) => DB.tasks.filter((t) => t.assigneeId === mid),
  subsOf: (mid) => DB.submissions.filter((s) => s.memberId === mid),
  subsOfForm: (fid) => DB.submissions.filter((s) => s.formId === fid),
  isOverdue: (t) => t.status !== 'DONE' && t.due && t.due < dayStart(Date.now()),
  todayCheckin: (mid) => DB.checkins.filter((c) => c.memberId === mid && c.at >= dayStart(Date.now())).sort((a, b) => b.at - a.at)[0] || null,
  checkedIn: (mid) => { const c = S.todayCheckin(mid); return !!c && c.type === 'IN'; },
  approvalRate(list) { const dec = list.filter((s) => s.status === 'APPROVED' || s.status === 'REJECTED'); return dec.length ? pct(dec.filter((s) => s.status === 'APPROVED').length, dec.length) : null; },
  daysPresent(mid, days = 30) { const since = dayStart(Date.now()) - days * DAY; return new Set(DB.checkins.filter((c) => c.memberId === mid && c.type === 'IN' && c.at >= since).map((c) => dayStart(c.at))).size; },
  projectProgress(p) {
    const ts = DB.tasks.filter((t) => t.projectId === p.id); const forms = DB.forms.filter((f) => f.projectId === p.id);
    const subs = DB.submissions.filter((s) => forms.some((f) => f.id === s.formId) && s.status !== 'REJECTED' && s.status !== 'DRAFT').length;
    const taskPct = ts.length ? pct(ts.filter((t) => t.status === 'DONE').length, ts.length) : null;
    const targetPct = p.target ? Math.min(100, pct(subs, p.target)) : null;
    const parts = [taskPct, targetPct].filter((x) => x != null);
    return { tasks: ts.length, done: ts.filter((t) => t.status === 'DONE').length, subs, pct: parts.length ? Math.round(parts.reduce((a, b) => a + b, 0) / parts.length) : 0, taskPct, targetPct };
  },
  score(m) {                                            // 0 to 100: quality, output, reliability and attendance of one person
    const subs = S.subsOf(m.id); const rate = S.approvalRate(subs); const tasks = S.tasksOf(m.id);
    const q = rate == null ? 70 : rate; const o = Math.min(100, subs.length * 5); const r = tasks.length ? pct(tasks.filter((t) => t.status === 'DONE').length, tasks.length) : 70; const a = Math.min(100, pct(S.daysPresent(m.id), 22));
    return { total: Math.round(q * 0.35 + o * 0.25 + r * 0.2 + a * 0.2), quality: q, output: o, reliability: r, attendance: a, submissions: subs.length };
  },
};

/* ---------- charts (plain SVG) ---------- */
const Charts = {
  bars(data, color = 'var(--teal)', h = 190) {
    const w = 560, pad = { l: 34, r: 8, t: 10, b: 24 }; const max = Math.max(1, ...data.map((d) => d.v));
    const nice = Math.pow(10, Math.floor(Math.log10(max))); const top = Math.ceil(max / nice) * nice; const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b, gw = iw / Math.max(1, data.length), bw = Math.min(30, gw * 0.62);
    let g = '';
    for (let i = 0; i <= 4; i++) { const y = pad.t + ih - (ih * i) / 4; g += `<line x1="${pad.l}" x2="${w - pad.r}" y1="${y}" y2="${y}" class="gl"/><text x="${pad.l - 6}" y="${y + 4}" class="ax" text-anchor="end">${Math.round((top * i) / 4)}</text>`; }
    data.forEach((d, i) => { const cx = pad.l + gw * i + gw / 2; const bh = (ih * d.v) / top; g += `<rect class="bar" x="${cx - bw / 2}" y="${pad.t + ih - bh}" width="${bw}" height="${Math.max(0, bh)}" rx="4" fill="${d.c || color}"><title>${esc(d.l)}: ${d.v}</title></rect><text x="${cx}" y="${h - 7}" class="ax" text-anchor="middle">${esc(String(d.l).slice(0, 8))}</text>`; });
    return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img">${g}</svg>`;
  },
  donut(items, center = '', sub = '') {
    const total = items.reduce((a, i) => a + i.v, 0) || 1; let a0 = -Math.PI / 2, path = ''; const R = 70, r = 46, cx = 90, cy = 90;
    items.filter((i) => i.v > 0).forEach((it) => {
      const a1 = a0 + (it.v / total) * Math.PI * 2 - (items.filter((i) => i.v > 0).length > 1 ? 0.02 : 0); const large = a1 - a0 > Math.PI ? 1 : 0; const p = (a, rad) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
      const [x0, y0] = p(a0, R), [x1, y1] = p(a1, R), [x2, y2] = p(a1, r), [x3, y3] = p(a0, r);
      path += it.v === total ? `<circle cx="${cx}" cy="${cy}" r="${(R + r) / 2}" fill="none" stroke="${it.c}" stroke-width="${R - r}"/>` : `<path d="M${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${r} ${r} 0 ${large} 0 ${x3} ${y3} Z" fill="${it.c}"><title>${esc(it.l)}: ${it.v}</title></path>`; a0 = a1 + 0.02;
    });
    return `<div class="donutwrap"><svg viewBox="0 0 180 180" class="donut">${path}<text x="90" y="88" text-anchor="middle" class="dc">${center}</text><text x="90" y="106" text-anchor="middle" class="ds">${sub}</text></svg><div class="legend">${items.map((i) => `<div><i style="background:${i.c}"></i><span>${esc(i.l)}</span><b>${i.v}</b></div>`).join('')}</div></div>`;
  },
  ring(p, label, sub, color = 'var(--teal)', size = 120) {
    const r = 46, c = 2 * Math.PI * r, off = c * (1 - Math.min(100, p) / 100);
    return `<div class="ring" style="width:${size}px;height:${size}px"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${r}" class="rbg"/><circle cx="60" cy="60" r="${r}" class="rfg" stroke="${color}" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 60 60)"/></svg><div class="rin"><b>${label}</b><small>${sub}</small></div></div>`;
  },
  hbars(items, color = 'var(--teal)') { const max = Math.max(1, ...items.map((i) => i.v)); return `<div class="hbars">${items.map((i) => `<div class="hb"><span class="hl">${esc(i.l)}</span><div class="ht"><div class="hf" style="width:${(i.v / max) * 100}%;background:${i.c || color}"></div></div><b>${i.v}</b></div>`).join('')}</div>`; },
  /** a scatter of GPS points on a plain background: no map tiles are needed, so it works with no internet */
  scatter(points, h = 300) {
    if (!points.length) return '<div class="empty">No GPS points yet.</div>';
    const w = 640, pad = 28; const lats = points.map((p) => p.lat), lngs = points.map((p) => p.lng);
    let a = Math.min(...lats), b = Math.max(...lats), c = Math.min(...lngs), d = Math.max(...lngs); if (b - a < 0.002) { a -= 0.001; b += 0.001; } if (d - c < 0.002) { c -= 0.001; d += 0.001; }
    const X = (lng) => pad + ((lng - c) / (d - c)) * (w - 2 * pad), Y = (lat) => h - pad - ((lat - a) / (b - a)) * (h - 2 * pad);
    let g = ''; for (let i = 0; i <= 4; i++) { g += `<line x1="${pad + (i * (w - 2 * pad)) / 4}" x2="${pad + (i * (w - 2 * pad)) / 4}" y1="${pad}" y2="${h - pad}" class="gl"/><line y1="${pad + (i * (h - 2 * pad)) / 4}" y2="${pad + (i * (h - 2 * pad)) / 4}" x1="${pad}" x2="${w - pad}" class="gl"/>`; }
    points.forEach((p) => { g += `<circle cx="${X(p.lng)}" cy="${Y(p.lat)}" r="${p.r || 6}" fill="${p.c || 'var(--teal)'}" fill-opacity=".8" stroke="#fff" stroke-width="1.5"><title>${esc(p.l || '')}</title></circle>`; });
    return `<svg viewBox="0 0 ${w} ${h}" class="chart scatter" role="img" aria-label="Field locations">${g}<text x="${pad}" y="${h - 8}" class="ax">${c.toFixed(3)}°E</text><text x="${w - pad}" y="${h - 8}" class="ax" text-anchor="end">${d.toFixed(3)}°E</text><text x="4" y="${pad}" class="ax">${b.toFixed(3)}°</text></svg>`;
  },
};

/* ---------- CSV ---------- */
function toCSV(rows) { return '﻿' + rows.map((r) => r.map((v) => { v = String(v ?? ''); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',')).join('\r\n'); }
async function exportCSV(name, rows) {
  const content = toCSV(rows);
  if (window.api && window.api.exportFile) return await window.api.exportFile({ name, content, filters: [{ name: 'CSV (Excel)', extensions: ['csv'] }] });
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type: 'text/csv' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); return name;
}
function parseCSV(text) {
  const rows = []; let row = [], cur = '', q = false; text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) { const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { row.push(cur); cur = ''; } else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; } else if (ch !== '\r') cur += ch; }
  if (cur || row.length) { row.push(cur); rows.push(row); } return rows.filter((r) => r.some((c) => c.trim()));
}
const PRINT_CSS = `body{font-family:Segoe UI,Arial,sans-serif;color:#10222b;margin:0;padding:30px;font-size:12px}h1{margin:0;font-size:22px;color:#0a3f5c}h2{font-size:14px;margin:20px 0 8px;color:#0a3f5c;border-bottom:2px solid #f5a623;padding-bottom:4px}
.top{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f8a8f;padding-bottom:10px;margin-bottom:14px}.muted{color:#5a6f78}table{width:100%;border-collapse:collapse}th{background:#0a3f5c;color:#fff;text-align:left;padding:6px 8px;font-size:11px}td{padding:6px 8px;border-bottom:1px solid #dfe9ed}tr:nth-child(even) td{background:#f4f9fa}.r{text-align:right}.kpis{display:flex;gap:10px;margin:10px 0;flex-wrap:wrap}.k{flex:1;min-width:110px;background:#eef7f8;border-left:4px solid #f5a623;padding:9px;border-radius:6px}.k b{display:block;font-size:17px;color:#0a3f5c}.foot{margin-top:26px;color:#5a6f78;font-size:10px;text-align:center}.cert{border:8px double #0f8a8f;padding:50px;text-align:center;margin:30px}.cert h1{font-size:38px}.cert .big{font-size:30px;font-weight:800;color:#0a3f5c;margin:18px 0}`;
function printShell(title, body) {
  return `<html><head><meta charset="utf-8"><title>${esc(title)}</title><style>${PRINT_CSS}</style></head><body><div class="top"><div style="display:flex;gap:12px;align-items:center"><img src="${LOGO_DATA}" alt="" width="44" height="44"><div><h1>${esc(DB.org.name)}</h1><div class="muted">${esc([DB.org.sector, DB.org.country].filter(Boolean).join(' · '))}</div></div></div><div style="text-align:right"><b>${esc(title)}</b><div class="muted">Generated ${fdate(Date.now())}</div></div></div>${body}<div class="foot">Generated by FMIS · Field Management Information System</div></body></html>`;
}
async function printDoc(name, title, body, raw) {
  const html = raw ? body : printShell(title, body);
  if (window.api && window.api.savePdf) return await window.api.savePdf({ name, html });
  const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 300); } else toastSafe('Allow pop-ups to print or save as PDF.'); return name;
}

/* ---------- images and location ---------- */
function shrinkImage(file, max = 900, quality = 0.62) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => { const img = new Image(); img.onerror = reject; img.onload = () => { const k = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); resolve(c.toDataURL('image/jpeg', quality)); }; img.src = fr.result; };
    fr.readAsDataURL(file);
  });
}
function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('This device has no location service.'));
    let done = false; const end = (fn, v) => { if (!done) { done = true; clearTimeout(t); fn(v); } };
    // some systems never answer (a hidden permission prompt, or no location service), so give up after 15 seconds
    const t = setTimeout(() => end(reject, new Error('Could not get the location in time. Move to open sky, or type the coordinates.')), 15000);
    navigator.geolocation.getCurrentPosition((p) => end(resolve, { lat: +p.coords.latitude.toFixed(6), lng: +p.coords.longitude.toFixed(6), acc: Math.round(p.coords.accuracy || 0), at: Date.now() }),
      (e) => end(reject, new Error(e.code === 1 ? 'Location permission was refused. Allow location for this app, or type the coordinates.' : 'Could not get the location. Move to open sky, or type the coordinates.')), { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
  });
}
const mapLink = (g) => (g && g.lat != null ? `https://www.openstreetmap.org/?mlat=${g.lat}&mlon=${g.lng}#map=17/${g.lat}/${g.lng}` : '#');

/* ---------- demo workspace ---------- */
function rng(seed) { return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296; }
async function buildDemo() {
  const r = rng(11), now = Date.now(); const cred = await makeCred('1234');
  const org = { name: 'Northern Household Survey 2026', sector: 'Research and data collection', country: 'Rwanda', createdAt: now - 40 * DAY, contact: '', about: 'A demonstration workspace: a household survey team collecting data across four districts.' };
  const P = (id, name, roleName, phone, region, title, extra) => ({ id, name, role: roleName, phone, email: '', region, title, status: 'ACTIVE', createdAt: now - 40 * DAY, ...cred, ...(extra || {}) });
  const members = [P('m1', 'Uwase Marie', 'ADMIN', '0788000001', 'Kigali', 'Programme director'), P('m2', 'Nkurunziza Paul', 'MANAGER', '0788000002', 'Kigali', 'Survey manager'), P('m3', 'Mukamana Alice', 'SUPERVISOR', '0788000003', 'Musanze', 'Field supervisor'), P('m4', 'Habimana Eric', 'SUPERVISOR', '0788000004', 'Rubavu', 'Field supervisor'),
    P('m5', 'Ingabire Grace', 'AGENT', '0788000005', 'Musanze', 'Enumerator'), P('m6', 'Nsengiyumva Patrick', 'AGENT', '0788000006', 'Musanze', 'Enumerator'), P('m7', 'Uwimana Claudine', 'AGENT', '0788000007', 'Burera', 'Enumerator'), P('m8', 'Ndayisaba Emmanuel', 'AGENT', '0788000008', 'Rubavu', 'Enumerator'),
    P('m9', 'Mukashema Diane', 'AGENT', '0788000009', 'Rubavu', 'Enumerator'), P('m10', 'Bizimana Samuel', 'AGENT', '0788000010', 'Gakenke', 'Enumerator'), P('m11', 'Kayitesi Aline', 'VIEWER', '0788000011', 'Kigali', 'Donor representative')];
  const projects = [
    { id: 'p1', name: 'Household living conditions survey', description: 'Interview 400 households in four districts about water, energy, health and income.', status: 'ACTIVE', start: now - 30 * DAY, end: now + 30 * DAY, region: 'Northern and Western provinces', leaderId: 'm2', target: 60, team: ['m3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10'] },
    { id: 'p2', name: 'Health facility assessment', description: 'Visit and score 25 health centres: staffing, services and condition.', status: 'PLANNING', start: now + 5 * DAY, end: now + 45 * DAY, region: 'Musanze and Burera', leaderId: 'm3', target: 25, team: ['m3', 'm5', 'm7'] }];
  const f = (id, label, type, extra) => ({ id, label, type, required: false, ...(extra || {}) });
  const forms = [
    { id: 'f1', projectId: 'p1', name: 'Household questionnaire', description: 'One form per household visited. Ask permission before starting.', status: 'PUBLISHED', version: 1, createdBy: 'm2', createdAt: now - 28 * DAY, fields: [
      f('q_name', 'Name of the respondent', 'text', { required: true }), f('q_age', 'Age of the respondent', 'number', { required: true, min: 15, max: 110 }), f('q_sex', 'Sex', 'choice', { required: true, options: ['Female', 'Male'] }), f('q_size', 'Number of people in the household', 'number', { required: true, min: 1, max: 30 }),
      f('q_water', 'Main source of drinking water', 'choice', { required: true, options: ['Piped water', 'Public tap', 'Protected spring', 'Borehole', 'River or lake', 'Other'] }), f('q_power', 'Does the household have electricity?', 'yesno', { required: true }),
      f('q_fuel', 'Cooking fuel used (tick all)', 'multi', { options: ['Firewood', 'Charcoal', 'Gas', 'Electricity', 'Biogas'] }), f('q_school', 'Are all children of school age in school?', 'yesno'), f('q_sat', 'How satisfied is the household with local services?', 'rating'),
      f('q_gps', 'Household location', 'gps', { required: true }), f('q_photo', 'Photo of the dwelling (with permission)', 'photo'), f('q_note', 'Interviewer notes', 'longtext')] },
    { id: 'f2', projectId: 'p2', name: 'Health facility checklist', description: 'Complete during the visit.', status: 'PUBLISHED', version: 1, createdBy: 'm3', createdAt: now - 5 * DAY, fields: [
      f('h_name', 'Name of the facility', 'text', { required: true }), f('h_type', 'Type', 'choice', { required: true, options: ['Health post', 'Health centre', 'District hospital'] }), f('h_staff', 'Number of clinical staff', 'number', { required: true, min: 0, max: 500 }),
      f('h_serv', 'Services offered', 'multi', { options: ['Maternity', 'Vaccination', 'Laboratory', 'Pharmacy', 'Emergency'] }), f('h_cond', 'Overall condition of the building', 'rating'), f('h_gps', 'Location', 'gps', { required: true })] },
    { id: 'f3', projectId: 'p1', name: 'Community leader interview', description: 'Short interview with the village leader.', status: 'DRAFT', version: 1, createdBy: 'm2', createdAt: now - 2 * DAY, fields: [f('c_name', 'Leader name', 'text', { required: true }), f('c_issue', 'Biggest community problem', 'longtext')] }];
  const tasks = [
    { id: 't1', projectId: 'p1', title: 'Complete 20 interviews in Musanze sector A', description: 'Use the household questionnaire.', assigneeId: 'm5', due: now + 3 * DAY, priority: 'HIGH', status: 'DOING', progress: 60, createdBy: 'm3', createdAt: now - 12 * DAY, notes: [] },
    { id: 't2', projectId: 'p1', title: 'Complete 20 interviews in Burera', description: '', assigneeId: 'm7', due: now + 5 * DAY, priority: 'NORMAL', status: 'DOING', progress: 40, createdBy: 'm3', createdAt: now - 12 * DAY, notes: [] },
    { id: 't3', projectId: 'p1', title: 'Complete 20 interviews in Rubavu', description: '', assigneeId: 'm8', due: now - 2 * DAY, priority: 'HIGH', status: 'TODO', progress: 10, createdBy: 'm4', createdAt: now - 12 * DAY, notes: [] },
    { id: 't4', projectId: 'p1', title: 'Verify GPS points for last week', description: 'Check for outliers and duplicates.', assigneeId: 'm3', due: now + 1 * DAY, priority: 'NORMAL', status: 'TODO', progress: 0, createdBy: 'm2', createdAt: now - 3 * DAY, notes: [] },
    { id: 't5', projectId: 'p1', title: 'Attend refresher training', description: '', assigneeId: 'm6', due: now - 10 * DAY, priority: 'NORMAL', status: 'DONE', progress: 100, createdBy: 'm2', createdAt: now - 20 * DAY, notes: [] },
    { id: 't6', projectId: 'p2', title: 'Prepare facility visit schedule', description: '', assigneeId: 'm3', due: now + 4 * DAY, priority: 'NORMAL', status: 'TODO', progress: 0, createdBy: 'm2', createdAt: now - 1 * DAY, notes: [] }];
  const submissions = [], checkins = [];
  const sites = { Musanze: [-1.499, 29.634], Burera: [-1.47, 29.84], Rubavu: [-1.68, 29.36], Gakenke: [-1.69, 29.78] };
  const waters = ['Piped water', 'Public tap', 'Protected spring', 'Borehole', 'River or lake'];
  const agents = members.filter((m) => m.role === 'AGENT');
  agents.forEach((m, i) => {
    const n = 4 + Math.floor(r() * 5);
    for (let k = 0; k < n; k++) {
      const at = now - Math.floor(r() * 26) * DAY - Math.floor(r() * 8) * 3600000; const [lat, lng] = sites[m.region] || sites.Musanze; const st = r() < 0.6 ? 'APPROVED' : r() < 0.7 ? 'SUBMITTED' : 'REJECTED';
      submissions.push({ id: uid() + k + i, formId: 'f1', projectId: 'p1', memberId: m.id, status: st, at, updatedAt: at, values: { q_name: ['Mukamana', 'Habimana', 'Uwera', 'Niyonsenga', 'Kamanzi', 'Mutesi', 'Rukundo'][Math.floor(r() * 7)] + ' ' + ['J.', 'M.', 'A.', 'P.'][Math.floor(r() * 4)], q_age: 18 + Math.floor(r() * 55), q_sex: r() < 0.55 ? 'Female' : 'Male', q_size: 2 + Math.floor(r() * 7), q_water: waters[Math.floor(r() * waters.length)], q_power: r() < 0.45, q_fuel: r() < 0.7 ? ['Firewood'] : ['Charcoal', 'Gas'], q_school: r() < 0.8, q_sat: 1 + Math.floor(r() * 5) }, gps: { lat: +(lat + (r() - 0.5) * 0.08).toFixed(6), lng: +(lng + (r() - 0.5) * 0.08).toFixed(6), acc: 8 + Math.floor(r() * 20), at },
        review: st === 'SUBMITTED' ? null : { by: 'm3', at: at + 3600000, note: st === 'REJECTED' ? 'GPS point is far from the sector. Please re-visit or correct.' : '' } });
    }
    for (let d = 0; d < 14; d++) { if (d > 0 && r() < 0.25) continue; if (d === 0 && i > 3) continue; const day = dayStart(now - d * DAY); if (new Date(day).getDay() === 0) continue; const [lat, lng] = sites[m.region] || sites.Musanze; checkins.push({ id: uid() + d + i, memberId: m.id, type: 'IN', at: day + 7.5 * 3600000 + Math.floor(r() * 3600000), gps: { lat: +(lat + (r() - 0.5) * 0.02).toFixed(6), lng: +(lng + (r() - 0.5) * 0.02).toFixed(6), acc: 15 }, note: '' }); if (d > 0) checkins.push({ id: uid() + 'o' + d + i, memberId: m.id, type: 'OUT', at: day + 16.5 * 3600000 + Math.floor(r() * 3600000), gps: null, note: '' }); }
  });
  submissions.forEach((s) => { if (s.formId === 'f1') s.values.q_gps = s.gps; });
  const messages = [
    { id: 'g1', thread: 'org', from: 'm2', at: now - 6 * DAY, text: 'Welcome to the survey team. Please read the enumerator handbook in the Library before starting.', kind: 'announcement' },
    { id: 'g2', thread: 'org', from: 'm3', at: now - 2 * DAY, text: 'Reminder: submit all forms before 6 pm each day so they can be reviewed the same evening.', kind: 'announcement' },
    { id: 'g3', thread: 'proj:p1', from: 'm5', at: now - 1 * DAY, text: 'Sector A: the road to the upper cell is flooded. I will start from the lower cell tomorrow.' }, { id: 'g4', thread: 'proj:p1', from: 'm3', at: now - 1 * DAY + 900000, text: 'Thanks Grace. Go ahead and tell me when you are back on schedule.' },
    { id: 'g5', thread: 'dm:m3:m5', from: 'm3', at: now - 3 * 3600000, text: 'Please recheck the GPS point on your last rejected form.' }];
  const reports = [
    { id: 'r1', memberId: 'm5', projectId: 'p1', type: 'DAILY', title: 'Daily report: Musanze sector A', body: '6 households interviewed. Two refused. One respondent asked for the results to be shared with the cell leader.', at: now - 1 * DAY, status: 'REVIEWED', review: { by: 'm3', at: now - 20 * 3600000, note: 'Thank you. I will follow up with the cell leader.' } },
    { id: 'r2', memberId: 'm8', projectId: 'p1', type: 'INCIDENT', title: 'Motorbike breakdown', body: 'Transport broke down near the lake road. Lost half a day. Need a spare tyre allowance.', at: now - 4 * 3600000, status: 'SENT', review: null }];
  const library = [
    { id: 'l1', title: 'Enumerator handbook', category: 'Guides', kind: 'note', body: 'Introduce yourself and the study. Get consent before every interview. Never leave a form half filled without saving it as a draft. Capture the GPS point at the household gate. Submit every evening.', url: '', at: now - 30 * DAY, by: 'm2' },
    { id: 'l2', title: 'Uganda Bureau of Statistics: Survey methodology', category: 'References', kind: 'link', body: '', url: 'https://www.ubos.org', at: now - 20 * DAY, by: 'm2' }];
  const certificates = [{ id: 'c1', memberId: 'm6', title: 'Refresher training completed', detail: 'Completed the two-day enumerator refresher training with distinction.', issuedBy: 'm2', at: now - 10 * DAY, serial: 'CERT-0001' }];
  DB = { v: 1, org, members, projects, tasks, forms, submissions, checkins, messages, reports, library, certificates, audit: [{ id: uid(), action: 'Workspace created', details: 'Demo workspace', by: 'System', byId: null, at: now - 40 * DAY }], seq: { cert: 1 }, notes: [], prefs: { theme: 'light', lang: 'en', lastUser: null, read: {} }, demo: true };
  return DB;
}
async function buildEmpty(orgInfo, admin) {
  const now = Date.now(); const cred = await makeCred(admin.pin);
  DB = { v: 1, org: { name: orgInfo.name, sector: orgInfo.sector || '', country: orgInfo.country || '', createdAt: now, about: '' },
    members: [{ id: 'm1', name: admin.name, role: 'ADMIN', phone: admin.phone, email: admin.email || '', region: '', title: admin.title || 'Administrator', status: 'ACTIVE', createdAt: now, ...cred }],
    projects: [], tasks: [], forms: [], submissions: [], checkins: [], messages: [], reports: [], library: [], certificates: [], audit: [{ id: uid(), action: 'Workspace created', details: orgInfo.name, by: admin.name, byId: 'm1', at: now }], seq: { cert: 0 }, notes: [], prefs: { theme: 'light', lang: 'en', lastUser: null, read: {} }, demo: false };
  return DB;
}
