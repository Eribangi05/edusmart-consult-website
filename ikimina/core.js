/* ===== Ikimina Desktop — core: storage, domain logic, seed, charts, i18n ===== */
const DAY = 86400000;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- storage (Electron IPC, falls back to localStorage in a browser) ---------- */
const Store = {
  async load() {
    if (window.api) return await window.api.load();
    try { return JSON.parse(localStorage.getItem('ikimina-db')); } catch { return null; }
  },
  _t: null,
  save(db) {
    clearTimeout(this._t);
    this._t = setTimeout(() => {
      if (window.api) window.api.save(db); else localStorage.setItem('ikimina-db', JSON.stringify(db));
    }, 250);
  }
};

/* ---------- i18n ---------- */
const LANGS = { en: 'English', fr: 'Français', rw: 'Ikinyarwanda' };
const T = {
  en: {},
  fr: {
    dashboard: 'Tableau de bord', members: 'Membres', contributions: 'Cotisations', loans: 'Prêts', finance: 'Finances', rotation: 'Rotation',
    reports: 'Rapports', announcements: 'Annonces', meetings: 'Réunions', requests: 'Demandes', audit: "Journal d'audit", settings: 'Paramètres',
    analytics: 'Analyses', mysavings: 'Mon épargne', myloans: 'Mes prêts', profile: 'Profil', signout: 'Déconnexion', welcome: 'Bienvenue',
    cash: 'Caisse', totalSavings: 'Épargne totale', outstanding: 'Encours des prêts', save: 'Enregistrer', cancel: 'Annuler', search: 'Rechercher…'
  },
  rw: {
    dashboard: 'Ibigenderwaho', members: 'Abanyamuryango', contributions: 'Imisanzu', loans: 'Inguzanyo', finance: 'Imari', rotation: 'Kuzunguruka',
    reports: 'Raporo', announcements: 'Amatangazo', meetings: 'Inama', requests: 'Ibisabwa', audit: 'Amateka y’ibikorwa', settings: 'Igenamiterere',
    analytics: 'Isesengura', mysavings: 'Ubwizigame bwanjye', myloans: 'Inguzanyo zanjye', profile: 'Umwirondoro', signout: 'Sohoka', welcome: 'Murakaza neza',
    cash: 'Amafaranga mu kigega', totalSavings: 'Ubwizigame bwose', outstanding: 'Inguzanyo zisigaye', save: 'Bika', cancel: 'Hagarika', search: 'Shakisha…'
  }
};
let LANG = 'en';
const LOC = () => ({ en: 'en-GB', fr: 'fr-FR', rw: 'rw' }[LANG] || 'en-GB');
const t = (k, fallback) => (T[LANG] && T[LANG][k]) || fallback || k.charAt(0).toUpperCase() + k.slice(1);

/* ---------- formatting ---------- */
let DB = null;
const cur = () => (DB && DB.group.currency) || 'RWF';
const money = (n, compact) => {
  n = Number(n) || 0;
  if (compact && Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (compact && Math.abs(n) >= 1e4) return (n / 1e3).toFixed(0) + 'K';
  return Math.round(n).toLocaleString('en-US');
};
const moneyC = (n) => `${money(n)} <small>${esc(cur())}</small>`;
const RW_M = ['Mutarama', 'Gashyantare', 'Werurwe', 'Mata', 'Gicurasi', 'Kamena', 'Nyakanga', 'Kanama', 'Nzeri', 'Ukwakira', 'Ugushyingo', 'Ukuboza'];
const RW_MS = ['Mut', 'Gas', 'Wer', 'Mat', 'Gic', 'Kam', 'Nya', 'Kan', 'Nze', 'Ukw', 'Ugu', 'Ukb'];
const RW_D = ['Ku cyumweru', 'Kuwa mbere', 'Kuwa kabiri', 'Kuwa gatatu', 'Kuwa kane', 'Kuwa gatanu', 'Kuwa gatandatu'];
function dl(ts, o) { // locale-aware date; Kinyarwanda is formatted by hand (browsers lack rw date data)
  const d = new Date(ts); if (LANG !== 'rw') return d.toLocaleDateString(LOC(), o);
  let s = ''; if (o.day) s += d.getDate() + ' '; if (o.month) s += (o.month === 'long' ? RW_M : RW_MS)[d.getMonth()]; if (o.year) s += ' ' + d.getFullYear();
  return (o.weekday ? RW_D[d.getDay()] + ', ' : '') + s.trim();
}
const fdate = (ts, o) => dl(ts, o || { day: 'numeric', month: 'short', year: 'numeric' });
const ftime = (ts) => new Date(ts).toLocaleTimeString(LANG === 'rw' ? 'en-GB' : LOC(), { hour: '2-digit', minute: '2-digit', hour12: false });
const ago = (ts) => {
  const d = Math.floor((Date.now() - ts) / DAY);
  if (d <= 0) return 'Today'; if (d === 1) return 'Yesterday'; if (d < 30) return d + ' days ago';
  if (d < 365) return Math.floor(d / 30) + ' mo ago'; return Math.floor(d / 365) + ' yr ago';
};
const toInputDate = (ts) => new Date(ts).toISOString().slice(0, 10);
const fromInputDate = (s) => { const d = new Date(s + 'T12:00:00'); return d.getTime(); };
const initials = (n) => n.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const avatar = (name, size = 36) => `<span class="av" style="width:${size}px;height:${size}px;font-size:${size * .38}px;background:linear-gradient(135deg,hsl(${hue(name)} 60% 42%),hsl(${(hue(name) + 40) % 360} 65% 32%))">${esc(initials(name))}</span>`;

/* ---------- security ---------- */
async function hashPin(pin, salt) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pin));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function makeCred(pin) { const salt = uid(); return { salt, pinHash: await hashPin(pin, salt) }; }

/* ---------- contribution periods ---------- */
const CYCLES = { DAILY: 'Daily', WEEKLY: 'Weekly', BIWEEKLY: 'Every 2 weeks', MONTHLY: 'Monthly' };
const EPOCH = new Date('2020-01-06T00:00:00').getTime(); // a Monday
function periodIdx(ts, cycle = DB.group.cycle) {
  const d = new Date(ts);
  if (cycle === 'MONTHLY') return d.getFullYear() * 12 + d.getMonth();
  const len = cycle === 'DAILY' ? 1 : cycle === 'WEEKLY' ? 7 : 14;
  return Math.floor((ts - EPOCH) / DAY / len);
}
function periodLabel(idx, cycle = DB.group.cycle) {
  if (cycle === 'MONTHLY') return dl(new Date(Math.floor(idx / 12), idx % 12, 1), { month: 'short', year: 'numeric' });
  const len = cycle === 'DAILY' ? 1 : cycle === 'WEEKLY' ? 7 : 14;
  const s = EPOCH + idx * len * DAY;
  return cycle === 'DAILY' ? fdate(s) : 'Wk of ' + fdate(s, { day: 'numeric', month: 'short' });
}
const curPeriod = () => periodIdx(Date.now());
const monthKey = (ts) => { const d = new Date(ts); return d.getFullYear() * 12 + d.getMonth(); };
const monthLabel = (k) => dl(new Date(Math.floor(k / 12), k % 12, 1), { month: 'short' });

/* ---------- selectors / domain logic ---------- */
const S = {
  member: (id) => DB.members.find(m => m.id === id),
  name: (id) => (S.member(id) || { name: 'Unknown' }).name,
  active: () => DB.members.filter(m => m.status === 'ACTIVE'),
  savedBy: (id) => DB.contributions.filter(c => c.memberId === id).reduce((a, c) => a + c.amount, 0),
  totalSavings: () => DB.contributions.reduce((a, c) => a + c.amount, 0),
  loansOf: (id) => DB.loans.filter(l => l.memberId === id),
  paidOn: (l) => DB.repayments.filter(r => r.loanId === l.id).reduce((a, r) => a + r.amount, 0),
  balance: (l) => Math.max(0, l.totalRepay - S.paidOn(l)),
  inFlight: () => DB.loans.filter(l => l.status === 'ACTIVE'),
  outstanding: () => S.inFlight().reduce((a, l) => a + S.balance(l), 0),
  disbursed: () => DB.loans.filter(l => l.disbursedAt).reduce((a, l) => a + l.principal, 0),
  repaid: () => DB.repayments.reduce((a, r) => a + r.amount, 0),
  interestEarned: () => DB.loans.filter(l => l.disbursedAt).reduce((a, l) => {
    const paid = S.paidOn(l); const ratio = l.totalRepay ? Math.min(1, paid / l.totalRepay) : 0; return a + l.totalInterest * ratio;
  }, 0),
  expenses: () => DB.expenses.reduce((a, e) => a + e.amount, 0),
  income: () => DB.income.reduce((a, e) => a + e.amount, 0),
  payouts: () => DB.payouts.reduce((a, p) => a + p.amount, 0),
  cash: () => S.totalSavings() + S.income() + S.repaid() - S.disbursed() - S.expenses() - S.payouts(),
  expectedPer: (m) => DB.group.amount * (m.shares || 1),
  paidInPeriod: (id, p) => DB.contributions.filter(c => c.memberId === id && c.period === p).reduce((a, c) => a + c.amount, 0),
  periodStatus(m, p) {
    const paid = S.paidInPeriod(m.id, p), exp = S.expectedPer(m);
    return paid >= exp ? 'PAID' : paid > 0 ? 'PARTIAL' : 'UNPAID';
  },
  periodsDue(m) { const j = periodIdx(m.joinDate); return Math.max(0, curPeriod() - j + 1); },
  arrears(m) { return Math.max(0, S.periodsDue(m) * S.expectedPer(m) - S.savedBy(m.id)); },
  overdueOf(l) {
    if (l.status !== 'ACTIVE') return 0;
    const dueSoFar = l.schedule.filter(r => r.due <= Date.now()).reduce((a, r) => a + r.total, 0);
    return Math.max(0, Math.min(dueSoFar - S.paidOn(l), S.balance(l)));
  },
  nextInstallment(l) {
    let paid = S.paidOn(l), cum = 0;
    for (const r of l.schedule) { cum += r.total; if (cum - paid > 0.5) return { ...r, remaining: cum - paid }; }
    return null;
  },
  penaltyFor(l) {
    const od = S.overdueOf(l); if (!od) return 0;
    const first = l.schedule.find(r => r.due <= Date.now()); if (!first) return 0;
    const late = Date.now() - first.due; if (late < DB.group.graceDays * DAY) return 0;
    return od * DB.group.penaltyRate / 100;
  },
  maxLoan: (m) => S.savedBy(m.id) * DB.group.loanMultiplier,
  score(m) { // 0–100 reliability score
    const due = S.periodsDue(m); const exp = due * S.expectedPer(m);
    let sc = exp ? Math.min(1, S.savedBy(m.id) / exp) * 70 : 70;
    const ls = S.loansOf(m.id).filter(l => l.disbursedAt);
    sc += ls.length ? (ls.some(l => S.overdueOf(l) > 0) ? 0 : 30) : 22;
    return Math.round(sc);
  },
  rankSavers: () => S.active().map(m => ({ m, v: S.savedBy(m.id) })).sort((a, b) => b.v - a.v),
  monthly(n = 6) {
    const now = monthKey(Date.now()); const out = [];
    for (let k = now - n + 1; k <= now; k++) {
      const inR = (ts) => monthKey(ts) === k;
      out.push({
        k, label: monthLabel(k),
        savings: DB.contributions.filter(c => inR(c.date)).reduce((a, c) => a + c.amount, 0),
        expenses: DB.expenses.filter(c => inR(c.date)).reduce((a, c) => a + c.amount, 0),
        income: DB.income.filter(c => inR(c.date)).reduce((a, c) => a + c.amount, 0) + DB.repayments.filter(c => inR(c.date)).reduce((a, c) => a + c.amount, 0)
      });
    }
    return out;
  },
  collection() {
    const p = curPeriod(); const act = S.active();
    const paid = act.filter(m => S.periodStatus(m, p) === 'PAID').length;
    const expected = act.reduce((a, m) => a + S.expectedPer(m), 0);
    const got = act.reduce((a, m) => a + Math.min(S.paidInPeriod(m.id, p), S.expectedPer(m) * 5), 0);
    return { paid, total: act.length, expected, got, pct: expected ? Math.min(100, got / expected * 100) : 0 };
  }
};

/* ---------- loan maths (port of the Android LoanCalculator) ---------- */
function addMonths(ts, n) { const d = new Date(ts); d.setMonth(d.getMonth() + n); return d.getTime(); }
function calcLoan(principal, ratePct, n, type, first) {
  const r = ratePct / 100; const rows = [];
  if (type === 'FLAT') {
    const ti = principal * r * n, tot = principal + ti;
    for (let i = 1; i <= n; i++) rows.push({ no: i, due: addMonths(first, i - 1), principal: principal / n, interest: ti / n, total: tot / n, balance: Math.max(0, principal - principal / n * i) });
    return { totalRepay: tot, totalInterest: ti, installment: tot / n, schedule: rows };
  }
  const emi = r === 0 ? principal / n : principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  let bal = principal, ti = 0;
  for (let i = 1; i <= n; i++) {
    const int = bal * r, pp = emi - int; bal -= pp; ti += int;
    rows.push({ no: i, due: addMonths(first, i - 1), principal: pp, interest: int, total: emi, balance: Math.max(0, bal) });
  }
  return { totalRepay: principal + ti, totalInterest: ti, installment: emi, schedule: rows };
}

/* ---------- mutations ---------- */
let SESSION = null;
const who = () => (SESSION ? SESSION.name : 'System');
function audit(action, details) { DB.audit.unshift({ id: uid(), action, details, by: who(), at: Date.now() }); if (DB.audit.length > 2000) DB.audit.length = 2000; }
function commit() { Store.save(DB); }
function notify(text, memberId = null, icon = '🔔') { DB.notes.unshift({ id: uid(), text, memberId, icon, at: Date.now() }); if (DB.notes.length > 300) DB.notes.length = 300; }

const ROLES = { PRESIDENT: 'President', ACCOUNTANT: 'Accountant', MEMBER: 'Member' };
const can = {
  record: () => SESSION && SESSION.role === 'ACCOUNTANT',
  approve: () => SESSION && SESSION.role === 'PRESIDENT',
  manage: () => SESSION && SESSION.role === 'PRESIDENT',
  admin: () => SESSION && SESSION.role !== 'MEMBER',
  viewFinance: () => SESSION && SESSION.role !== 'MEMBER'
};

/* ---------- demo data ---------- */
function rng(seed) { return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296; }
async function buildDemo() {
  const r = rng(7), now = Date.now();
  const cred = await makeCred('1234');
  const group = { name: 'Twisungane Ikimina', location: 'Kigali, Rwanda', objective: 'Save together, lend to each other, grow together.', currency: 'RWF', cycle: 'MONTHLY', amount: 20000, sharePrice: 5000, interestRate: 5, interestType: 'FLAT', penaltyRate: 2, graceDays: 7, loanMultiplier: 3, requireApproval: true, createdAt: addMonths(now, -9), dueDay: 5 };
  const names = [
    ['Uwase Marie', 'PRESIDENT'], ['Niyonzima Jean Claude', 'ACCOUNTANT'], ['Mukamana Alice'], ['Habimana Eric'], ['Ingabire Grace'], ['Nsengiyumva Patrick'],
    ['Uwimana Claudine'], ['Ndayisaba Emmanuel'], ['Mukashema Diane'], ['Bizimana Samuel'], ['Uwamahoro Josiane'], ['Kayitesi Aline'], ['Munyaneza Olivier']
  ];
  const goals = ['Build a house', 'School fees', 'Buy a cow', 'Start a shop', 'Buy land', 'Medical insurance', 'Grow farming', 'Buy a motorbike'];
  const members = names.map(([name, role], i) => ({
    id: 'm' + (i + 1), name, role: role || 'MEMBER', phone: '0788' + String(100000 + Math.floor(r() * 899999)),
    idNumber: '1' + String(199000000000000 + Math.floor(r() * 9e11)).slice(0, 15), address: ['Gasabo', 'Kicukiro', 'Nyarugenge'][i % 3] + ', Kigali',
    goal: goals[i % goals.length], nextOfKin: names[(i + 3) % names.length][0], joinDate: addMonths(now, -9 + (i > 9 ? 2 : 0)),
    shares: i % 5 === 4 ? 2 : 1, status: 'ACTIVE', ...cred
  }));
  const contributions = [], payouts = [];
  const cp = periodIdx(now, 'MONTHLY');
  members.forEach((m, i) => {
    const j = periodIdx(m.joinDate, 'MONTHLY');
    for (let p = j; p <= cp; p++) {
      const reliability = i === 7 ? .55 : i === 9 ? .7 : .95;
      if (p === cp && r() > .5) continue;
      if (r() > reliability) continue;
      const amt = 20000 * m.shares;
      const day = 1 + Math.floor(r() * 9);
      const d = new Date(Math.floor(p / 12), p % 12, day, 10).getTime();
      if (d > now) continue;
      contributions.push({ id: uid(), memberId: m.id, amount: amt, date: d, period: p, method: r() > .4 ? 'MOMO' : 'CASH', ref: '', note: '', by: 'Niyonzima Jean Claude' });
    }
  });
  const loans = [], repayments = [];
  const mkLoan = (mid, principal, n, monthsAgo, paidN, status, purpose) => {
    const first = addMonths(now, -monthsAgo + 1);
    const c = calcLoan(principal, group.interestRate, n, 'FLAT', first);
    const l = { id: uid(), memberId: mid, principal, rate: group.interestRate, type: 'FLAT', n, purpose, guarantorId: 'm3', status, requestedAt: addMonths(now, -monthsAgo) - 3 * DAY, approvedBy: 'Uwase Marie', ...c };
    if (status === 'ACTIVE' || status === 'PAID') {
      l.disbursedAt = addMonths(now, -monthsAgo);
      for (let i = 0; i < paidN; i++) repayments.push({ id: uid(), loanId: l.id, amount: c.installment, date: c.schedule[i].due, method: 'MOMO', ref: '', by: 'Niyonzima Jean Claude', inst: i + 1 });
    }
    loans.push(l); return l;
  };
  mkLoan('m4', 150000, 6, 4, 4, 'ACTIVE', 'Buy stock for shop');
  mkLoan('m6', 200000, 5, 5, 2, 'ACTIVE', 'School fees for children');
  mkLoan('m8', 100000, 4, 4, 1, 'ACTIVE', 'Farm inputs');
  mkLoan('m5', 80000, 3, 7, 3, 'PAID', 'Medical bills');
  mkLoan('m11', 120000, 4, 0, 0, 'PENDING', 'Buy sewing machine');
  const expenses = [
    { id: uid(), category: 'Stationery', description: 'Ledger books and receipts', amount: 12500, date: addMonths(now, -6) },
    { id: uid(), category: 'Meeting', description: 'Refreshments for AGM', amount: 45000, date: addMonths(now, -4) },
    { id: uid(), category: 'Transport', description: 'Bank visit', amount: 8000, date: addMonths(now, -2) },
    { id: uid(), category: 'Solidarity', description: 'Support for bereaved member', amount: 60000, date: addMonths(now, -1) }
  ].map(e => ({ ...e, by: 'Niyonzima Jean Claude', approvedBy: 'Uwase Marie' }));
  const income = [
    { id: uid(), source: 'Membership fee', description: 'Registration of new member', amount: 10000, date: addMonths(now, -7) },
    { id: uid(), source: 'Fine', description: 'Late payment fine', amount: 4000, date: addMonths(now, -3) },
    { id: uid(), source: 'Fine', description: 'Missed meeting fine', amount: 2000, date: addMonths(now, -1) },
    { id: uid(), source: 'Donation', description: 'Local NGO support', amount: 50000, date: addMonths(now, -5) }
  ].map(e => ({ ...e, by: 'Niyonzima Jean Claude' }));
  const announcements = [
    { id: uid(), title: 'Contribution deadline', body: `Please pay your monthly contribution of ${money(group.amount)} RWF before the 5th of every month to avoid fines.`, pinned: true, at: now - 2 * DAY, by: 'Uwase Marie' },
    { id: uid(), title: 'Year-end share-out planning', body: 'We will hold the annual share-out in December. Members with pending loans must clear them by 30 November.', pinned: false, at: now - 9 * DAY, by: 'Uwase Marie' },
    { id: uid(), title: 'New MoMo number', body: 'Contributions can now also be sent via Mobile Money to the accountant. Always ask for a receipt.', pinned: false, at: now - 20 * DAY, by: 'Niyonzima Jean Claude' }
  ];
  const meetings = [
    { id: uid(), title: 'Monthly general meeting', at: now + 6 * DAY, location: 'Umuganda Hall, Kicukiro', agenda: 'Review contributions, approve loans, plan share-out.', minutes: '', done: false, attendance: {} },
    { id: uid(), title: 'Monthly general meeting', at: now - 24 * DAY, location: 'Umuganda Hall, Kicukiro', agenda: 'Budget review', minutes: 'Approved 2 loans. Agreed to raise fine for lateness to 2,000 RWF.', done: true, attendance: Object.fromEntries(members.map((m, i) => [m.id, i % 6 === 5 ? 'ABSENT' : 'PRESENT'])) }
  ];
  const requests = [
    { id: uid(), memberId: 'm10', type: 'LOAN', message: 'Buy a second-hand motorbike for deliveries', amount: 90000, n: 3, status: 'PENDING', at: now - 2 * DAY },
    { id: uid(), memberId: 'm9', type: 'ABSENT', message: 'Travelling for a family wedding, will miss the next meeting.', amount: 0, n: 0, status: 'PENDING', at: now - DAY }
  ];
  const rotation = { order: members.filter(m => m.role !== 'ACCOUNTANT').slice(0, 8).map(m => m.id), pos: 3 };
  payouts.push({ id: uid(), memberId: 'm3', amount: 160000, date: addMonths(now, -3), note: 'Round 1', by: 'Niyonzima Jean Claude' }, { id: uid(), memberId: 'm1', amount: 160000, date: addMonths(now, -2), note: 'Round 2', by: 'Niyonzima Jean Claude' });
  rotation.pos = 2;
  const audits = [{ id: uid(), action: 'Group created', details: 'Demo group set up', by: 'System', at: group.createdAt }];
  return { v: 1, group, members, contributions, loans, repayments, expenses, income, announcements, meetings, requests, payouts, rotation, audit: audits, notes: [], prefs: { theme: 'light', lang: 'en', lastUser: null }, demo: true };
}
async function buildEmpty(g, pres, acct) {
  const now = Date.now();
  const mk = async (o, role, id) => ({ id, name: o.name, role, phone: o.phone, idNumber: '', address: '', goal: '', nextOfKin: '', joinDate: now, shares: 1, status: 'ACTIVE', ...(await makeCred(o.pin)) });
  const members = [await mk(pres, 'PRESIDENT', 'm1')];
  if (acct.name) members.push(await mk(acct, 'ACCOUNTANT', 'm2'));
  return {
    v: 1, group: { ...g, sharePrice: 0, interestType: 'FLAT', penaltyRate: 2, graceDays: 7, loanMultiplier: 3, requireApproval: true, createdAt: now, dueDay: 5 },
    members, contributions: [], loans: [], repayments: [], expenses: [], income: [], announcements: [], meetings: [], requests: [], payouts: [],
    rotation: { order: [], pos: 0 }, audit: [{ id: uid(), action: 'Group created', details: g.name, by: pres.name, at: now }], notes: [], prefs: { theme: 'light', lang: 'en', lastUser: null }, demo: false
  };
}

/* ---------- charts (pure SVG, no dependencies) ---------- */
const Charts = {
  bars(data, keys, colors, h = 210) {
    const w = 560, pad = { l: 44, r: 8, t: 12, b: 26 };
    const max = Math.max(1, ...data.flatMap(d => keys.map(k => d[k])));
    const nice = Math.pow(10, Math.floor(Math.log10(max))); const top = Math.ceil(max / nice) * nice;
    const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b, gw = iw / data.length, bw = Math.min(26, gw / (keys.length + 1));
    let g = '';
    for (let i = 0; i <= 4; i++) { const y = pad.t + ih - ih * i / 4; g += `<line x1="${pad.l}" x2="${w - pad.r}" y1="${y}" y2="${y}" class="gl"/><text x="${pad.l - 6}" y="${y + 4}" class="ax" text-anchor="end">${money(top * i / 4, true)}</text>`; }
    data.forEach((d, i) => {
      const cx = pad.l + gw * i + gw / 2;
      keys.forEach((k, j) => {
        const bh = ih * d[k] / top, x = cx - (keys.length * bw) / 2 + j * bw;
        g += `<rect class="bar" x="${x}" y="${pad.t + ih - bh}" width="${bw - 3}" height="${Math.max(0, bh)}" rx="4" fill="${colors[j]}" style="animation-delay:${i * 60}ms"><title>${d.label}: ${money(d[k])}</title></rect>`;
      });
      g += `<text x="${cx}" y="${h - 8}" class="ax" text-anchor="middle">${d.label}</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${h}" class="chart">${g}</svg>`;
  },
  area(points, color = 'var(--emerald)', h = 170, labels = []) {
    const w = 560, pad = 10; if (points.length < 2) points = [0, ...points, ...points];
    const max = Math.max(1, ...points), n = points.length;
    const xy = points.map((v, i) => [pad + (w - 2 * pad) * i / (n - 1), h - 24 - (h - 44) * v / max]);
    const line = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const id = 'g' + uid();
    let lb = ''; labels.forEach((l, i) => { if (l) lb += `<text x="${xy[i][0]}" y="${h - 6}" class="ax" text-anchor="middle">${l}</text>`; });
    return `<svg viewBox="0 0 ${w} ${h}" class="chart"><defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".35"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <path d="${line} L${xy[n - 1][0]} ${h - 24} L${xy[0][0]} ${h - 24} Z" fill="url(#${id})"/><path d="${line}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="draw"/>
      <circle cx="${xy[n - 1][0]}" cy="${xy[n - 1][1]}" r="5" fill="${color}"/>${lb}</svg>`;
  },
  donut(items, center = '', sub = '') {
    const total = items.reduce((a, i) => a + i.v, 0) || 1; let a0 = -Math.PI / 2, path = '';
    const R = 70, r = 46, cx = 90, cy = 90;
    items.filter(i => i.v > 0).forEach(it => {
      const a1 = a0 + (it.v / total) * Math.PI * 2 - (items.length > 1 ? .02 : 0);
      const large = a1 - a0 > Math.PI ? 1 : 0; const p = (a, rad) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
      const [x0, y0] = p(a0, R), [x1, y1] = p(a1, R), [x2, y2] = p(a1, r), [x3, y3] = p(a0, r);
      path += `<path d="M${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${r} ${r} 0 ${large} 0 ${x3} ${y3} Z" fill="${it.c}"><title>${it.l}: ${money(it.v)}</title></path>`; a0 = a1 + .02;
    });
    return `<div class="donutwrap"><svg viewBox="0 0 180 180" class="donut">${path}<text x="90" y="88" text-anchor="middle" class="dc">${center}</text><text x="90" y="106" text-anchor="middle" class="ds">${sub}</text></svg>
      <div class="legend">${items.map(i => `<div><i style="background:${i.c}"></i><span>${esc(i.l)}</span><b>${money(i.v, true)}</b></div>`).join('')}</div></div>`;
  },
  ring(pct, label, sub, color = 'var(--emerald)', size = 130) {
    const r = 52, c = 2 * Math.PI * r, off = c * (1 - Math.min(100, pct) / 100);
    return `<div class="ring" style="width:${size}px;height:${size}px"><svg viewBox="0 0 130 130"><circle cx="65" cy="65" r="${r}" class="rbg"/><circle cx="65" cy="65" r="${r}" class="rfg" stroke="${color}" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 65 65)"/></svg><div class="rin"><b>${label}</b><small>${sub}</small></div></div>`;
  },
  hbars(items, color = 'var(--emerald)') {
    const max = Math.max(1, ...items.map(i => i.v));
    return `<div class="hbars">${items.map(i => `<div class="hb"><span class="hl">${esc(i.l)}</span><div class="ht"><div class="hf" style="width:${i.v / max * 100}%;background:${i.c || color}"></div></div><b>${money(i.v, true)}</b></div>`).join('')}</div>`;
  }
};

/* ---------- CSV / PDF helpers ---------- */
function toCSV(rows) { return '﻿' + rows.map(r => r.map(v => { v = String(v ?? ''); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',')).join('\r\n'); }
async function exportCSV(name, rows) {
  const content = toCSV(rows);
  if (window.api) { const p = await window.api.exportFile({ name, content, filters: [{ name: 'CSV (Excel)', extensions: ['csv'] }] }); return p; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type: 'text/csv' })); a.download = name; a.click(); return name;
}
const PDF_CSS = `body{font-family:Segoe UI,Arial,sans-serif;color:#14261b;margin:0;padding:34px;font-size:12px}h1{margin:0;font-size:24px;color:#0f5132}h2{font-size:14px;margin:22px 0 8px;color:#0f5132;border-bottom:2px solid #f5b301;padding-bottom:4px}
.top{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f5132;padding-bottom:12px;margin-bottom:16px}.muted{color:#5b6f63}table{width:100%;border-collapse:collapse}th{background:#0f5132;color:#fff;text-align:left;padding:6px 8px;font-size:11px}
td{padding:6px 8px;border-bottom:1px solid #e3ece6}tr:nth-child(even) td{background:#f5faf7}.r{text-align:right}.kpis{display:flex;gap:10px;margin:10px 0}.k{flex:1;background:#f0f8f3;border-left:4px solid #f5b301;padding:10px;border-radius:6px}.k b{display:block;font-size:16px;color:#0f5132}
.big{font-size:34px;font-weight:800;color:#0f5132}.box{border:2px dashed #0f5132;border-radius:12px;padding:22px;margin-top:14px}.foot{margin-top:30px;color:#5b6f63;font-size:10px;text-align:center}.sig{display:flex;gap:40px;margin-top:50px}.sig div{flex:1;border-top:1px solid #333;padding-top:4px;text-align:center}`;
function pdfShell(title, body) {
  return `<html><head><meta charset="utf-8"><style>${PDF_CSS}</style></head><body><div class="top"><div><h1>${esc(DB.group.name)}</h1><div class="muted">${esc(DB.group.location || '')}</div></div><div style="text-align:right"><b>${esc(title)}</b><div class="muted">Generated ${fdate(Date.now())}</div></div></div>${body}<div class="foot">Generated by Ikimina Desktop · ${esc(DB.group.name)}</div></body></html>`;
}
async function savePDF(name, title, body) {
  const html = pdfShell(title, body);
  if (window.api) return await window.api.savePdf({ name, html });
  const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); w.print(); } return name;
}
