/* ===== FMIS views, part 1: dashboard, team, projects, tasks ===== */
'use strict';

/* ---------- dashboard ---------- */
const lastDays = (n) => Array.from({ length: n }, (_, i) => dayStart(Date.now()) - (n - 1 - i) * DAY);
function subsPerDay(list, n = 14) { const days = lastDays(n); return days.map((d) => ({ l: String(new Date(d).getDate()), v: list.filter((s) => dayStart(s.at) === d).length })); }

VIEWS.dashboard = () => (role() === 'AGENT' ? agentDash() : role() === 'VIEWER' ? viewerDash() : leadDash());

function leadDash() {
  const subs = DB.submissions.filter((s) => s.status !== 'DRAFT'); const week = subs.filter((s) => s.at >= Date.now() - 7 * DAY);
  const active = DB.projects.filter((p) => p.status === 'ACTIVE').length; const rate = S.approvalRate(subs); const late = DB.tasks.filter((t) => S.isOverdue(t)).length;
  const inNow = S.agents().filter((m) => S.checkedIn(m.id)).length;
  const byStatus = ['SUBMITTED', 'APPROVED', 'REJECTED'].map((k, i) => ({ l: STATUS.submission[k], v: subs.filter((s) => s.status === k).length, c: ['#f5a623', '#1a9f6e', '#d64545'][i] }));
  const tasksBy = Object.keys(STATUS.task).map((k, i) => ({ l: STATUS.task[k], v: DB.tasks.filter((t) => t.status === k).length, c: ['#8aa0aa', '#0f8a8f', '#1a9f6e', '#d64545'][i] }));
  const top = S.agents().map((m) => ({ m, sc: S.score(m) })).sort((a, b) => b.sc.total - a.sc.total).slice(0, 5);
  const pend = DB.submissions.filter((s) => s.status === 'SUBMITTED').sort((a, b) => a.at - b.at).slice(0, 5);
  return `<div class="hero"><div><div class="l">${esc(DB.org.name)}</div><div class="big">${num(week.length)} <small>submissions this week</small></div><div class="l">${num(subs.length)} in total · ${rate == null ? 'no reviews yet' : rate + '% approved'}</div></div>
    <div class="acts">${can.manageWork() ? '<button class="btn gold" data-act="newProject">＋ New project</button>' : ''}${can.assign() ? '<button class="btn glass" data-act="newTask">＋ Assign a task</button>' : ''}<button class="btn glass" data-act="go" data-r="submissions">Review submissions${pendingCount() ? ` (${pendingCount()})` : ''}</button></div></div>
    <div class="grid g4 mt">${kpi('a', '👥', 'Team', num(S.active().length), `${S.agents().length} field agents`)}${kpi('b', '📁', 'Active projects', active, `${DB.projects.length} in total`)}${kpi('c', '📍', 'In the field today', inNow, `of ${S.agents().length} agents`)}${kpi(late ? 'e' : 'd', '⏰', 'Overdue tasks', late, `${DB.tasks.filter((t) => t.status !== 'DONE').length} open`)}</div>
    <div class="grid g21 mt"><div class="card"><h3>📈 Submissions, last 14 days</h3>${Charts.bars(subsPerDay(subs))}</div><div class="card"><h3>Review status</h3>${Charts.donut(byStatus, subs.length, 'submissions')}</div></div>
    <div class="grid g3 mt"><div class="card"><h3>🏆 Top field agents</h3>${top.length ? top.map((x, i) => `<div class="row li"><b class="rank">${i + 1}</b>${avatar(x.m.name, 32)}<div class="sp"><b>${esc(x.m.name)}</b><div class="muted sm">${x.sc.submissions} submissions</div></div><b>${x.sc.total}</b></div>`).join('') : empty('🏆', 'No agents yet')}</div>
      <div class="card"><h3>Tasks</h3>${Charts.donut(tasksBy, DB.tasks.length, 'tasks')}</div>
      <div class="card"><h3>📥 Waiting for review</h3>${pend.length ? pend.map((s) => `<div class="row li" data-act="openSub" data-id="${esc(s.id)}" tabindex="0" style="cursor:pointer"><div class="sp"><b>${esc((S.form(s.formId) || {}).name || 'Form')}</b><div class="muted sm">${esc(S.name(s.memberId))} · ${ago(s.at)}</div></div><span class="muted">›</span></div>`).join('') : empty('✅', 'Nothing waiting', 'All submissions are reviewed.')}</div></div>
    <div class="card mt"><h3>📁 Projects</h3>${projectList(false)}</div>`;
}

function agentDash() {
  const me = SESSION.id; const mine = S.subsOf(me).filter((s) => s.status !== 'DRAFT'); const today = mine.filter((s) => dayStart(s.at) === dayStart(Date.now())).length; const rate = S.approvalRate(mine);
  const tasks = S.tasksOf(me).filter((t) => t.status !== 'DONE').sort((a, b) => (a.due || 9e15) - (b.due || 9e15)); const inn = S.checkedIn(me);
  const forms = DB.forms.filter((f) => f.status === 'PUBLISHED'); const ann = DB.messages.filter((m) => m.kind === 'announcement').sort((a, b) => b.at - a.at).slice(0, 2);
  const draft = S.subsOf(me).filter((s) => s.status === 'DRAFT').length;
  return `<div class="hero"><div><div class="l">${fdate(Date.now(), { weekday: 'long', day: 'numeric', month: 'long' })}</div><div class="big">${today} <small>collected today</small></div><div class="l">${inn ? '📍 Checked in at ' + ftime(S.todayCheckin(me).at) : 'You have not checked in yet'}</div></div>
    <div class="acts"><button class="btn gold" data-act="go" data-r="collect">✍️ Collect data</button><button class="btn glass" data-act="checkIn">${inn ? 'Check out' : '📍 Check in'}</button></div></div>
    <div class="grid g4 mt">${kpi('a', '📥', 'My submissions', mine.length, draft ? draft + ' saved as draft' : 'all sent')}${kpi('b', '✅', 'Approval rate', rate == null ? '—' : rate + '%', 'of reviewed forms')}${kpi('c', '📋', 'Open tasks', tasks.length, tasks.filter((t) => S.isOverdue(t)).length + ' overdue')}${kpi('d', '📍', 'Days in the field', S.daysPresent(me), 'last 30 days')}</div>
    <div class="grid g2 mt"><div class="card"><h3>✅ My tasks</h3>${tasks.length ? tasks.slice(0, 5).map((t) => taskRow(t)).join('') : empty('🎉', 'No open tasks')}</div>
      <div class="card"><h3>📝 Forms to fill</h3>${forms.length ? forms.map((f) => `<div class="row li"><div class="sp"><b>${esc(f.name)}</b><div class="muted sm">${esc((S.project(f.projectId) || {}).name || 'General')} · ${f.fields.length} questions</div></div><button class="btn s p" data-act="fillForm" data-id="${esc(f.id)}">Start</button></div>`).join('') : empty('📝', 'No forms yet', 'Your manager will publish forms here.')}</div></div>
    ${ann.length ? `<div class="card mt"><h3>📣 Announcements</h3>${ann.map((m) => `<div class="li"><b>${esc(S.name(m.from))}</b> <span class="muted sm">${ago(m.at)}</span><div>${esc(m.text)}</div></div>`).join('')}</div>` : ''}`;
}

function viewerDash() {
  const appr = DB.submissions.filter((s) => s.status === 'APPROVED'); const ps = DB.projects.map((p) => ({ p, pr: S.projectProgress(p) }));
  return `<div class="hero"><div><div class="l">${esc(DB.org.name)}</div><div class="big">${num(appr.length)} <small>approved submissions</small></div><div class="l">Read only access for partners and funders</div></div></div>
    <div class="grid g3 mt">${kpi('a', '📁', 'Projects', DB.projects.length, DB.projects.filter((p) => p.status === 'ACTIVE').length + ' active')}${kpi('b', '✅', 'Tasks done', DB.tasks.filter((t) => t.status === 'DONE').length, `of ${DB.tasks.length}`)}${kpi('c', '👥', 'Team', S.active().length, 'members')}</div>
    <div class="grid g21 mt"><div class="card"><h3>📈 Approved submissions, last 14 days</h3>${Charts.bars(subsPerDay(appr))}</div><div class="card"><h3>Project progress</h3>${ps.length ? ps.map(({ p, pr }) => `<div class="li"><div class="row"><b class="sp">${esc(p.name)}</b><span>${pr.pct}%</span></div>${bar(pr.pct)}</div>`).join('') : empty('📁', 'No projects yet')}</div></div>`;
}

/* ---------- team ---------- */
VIEWS.team = () => {
  const q = (VS.q.team || '').toLowerCase(); const rf = VS.tab.teamRole || 'ALL';
  const list = DB.members.filter((m) => (rf === 'ALL' || m.role === rf) && (m.name + ' ' + (m.region || '') + ' ' + (m.title || '') + ' ' + (m.phone || '')).toLowerCase().includes(q)).sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) || a.name.localeCompare(b.name));
  const cnt = (r) => DB.members.filter((m) => m.role === r).length;
  return `<div class="bar row wrap">${searchBox('team', 'Search the team')}${tabsBar('teamRole', [['ALL', `All ${DB.members.length}`], ...ROLE_ORDER.filter((r) => cnt(r)).map((r) => [r, `${ROLES[r]} ${cnt(r)}`])], rf)}<span class="sp"></span>
    ${can.manageTeam() ? '<button class="btn" data-act="importTeam">⬆ Import CSV</button><button class="btn p" data-act="newMember">＋ Add person</button>' : ''}<button class="btn" data-act="exportTeam">⬇ Export</button></div>
    <div class="card mt tw"><table><thead><tr><th>Name</th><th>Role</th><th>Region</th><th>Phone</th><th>Status</th><th class="r">Score</th><th></th></tr></thead><tbody>${list.map((m) => { const sc = m.role === 'AGENT' ? S.score(m).total : null; return `<tr><td><div class="row">${avatar(m.name, 34)}<div><b>${esc(m.name)}</b><div class="muted sm">${esc(m.title || '')}</div></div></div></td><td>${roleTag(m.role)}</td><td>${esc(m.region || '—')}</td><td>${esc(m.phone || '—')}</td><td>${stPill('member', m.status || 'ACTIVE')}</td><td class="r">${sc == null ? '—' : sc}</td><td class="r"><button class="btn s" data-act="viewMember" data-id="${esc(m.id)}">Open</button></td></tr>`; }).join('') || `<tr><td colspan="7">${empty('👥', 'No one found')}</td></tr>`}</tbody></table></div>`;
};
const memberFields = (m = {}) => [{ name: 'name', label: 'Full name', required: true, value: m.name || '', full: true }, { name: 'role', label: 'Role', options: ROLE_ORDER.filter((r) => r !== 'ADMIN' || role() === 'ADMIN').map((r) => [r, ROLES[r]]), value: m.role || 'AGENT' }, { name: 'phone', label: 'Phone', value: m.phone || '', required: true },
  { name: 'email', label: 'Email (optional)', type: 'email', value: m.email || '' }, { name: 'title', label: 'Position', value: m.title || '' }, { name: 'region', label: 'District or region', value: m.region || '' }, { name: 'status', label: 'Status', options: options(STATUS.member), value: m.status || 'ACTIVE' }];
ACT.newMember = () => {
  if (!guard(can.manageTeam())) return;
  modal({ title: '＋ Add a person', body: F([...memberFields(), { name: 'pin', label: 'First PIN (4 digits)', type: 'password', required: true, placeholder: '••••', hint: 'They can change it in Profile.' }]), submit: 'Add person',
    onSubmit: async (v) => { if (!/^\d{4}$/.test(v.pin)) { toast('The PIN must be 4 digits.', true); return false; } if (v.role === 'ADMIN' && role() !== 'ADMIN') { toast('Only an Admin can create an Admin.', true); return false; }
      const m = { id: uid(), name: v.name.trim(), role: v.role, phone: v.phone.trim(), email: v.email || '', title: v.title || '', region: v.region || '', status: v.status, createdAt: Date.now(), ...(await makeCred(v.pin)) };
      DB.members.push(m); audit('Person added', `${m.name} (${ROLES[m.role]})`); commit(); refresh(); toast('Person added'); } });
};
ACT.viewMember = ({ id }) => {
  const m = S.member(id); if (!m) return; const sc = m.role === 'AGENT' ? S.score(m) : null; const subs = S.subsOf(m.id); const tasks = S.tasksOf(m.id);
  modal({ title: esc(m.name), wide: true, cancel: 'Close', body: `<div class="grid g2"><div><div class="row">${avatar(m.name, 64)}<div><h3 style="margin:0">${esc(m.name)}</h3>${roleTag(m.role)} ${stPill('member', m.status || 'ACTIVE')}</div></div>
    <div class="list mt">${[['💼', 'Position', m.title], ['📍', 'Region', m.region], ['📞', 'Phone', m.phone], ['✉️', 'Email', m.email], ['📅', 'Joined', fdate(m.createdAt)]].map(([i, l, v]) => `<div class="row li"><span>${i}</span><span class="muted sp">${l}</span><b>${esc(v || '—')}</b></div>`).join('')}</div></div>
    <div>${sc ? `<div class="row" style="justify-content:space-around">${Charts.ring(sc.total, sc.total, 'score')}${Charts.ring(S.approvalRate(subs) || 0, S.approvalRate(subs) == null ? '—' : S.approvalRate(subs) + '%', 'approved', 'var(--amber)')}</div>` : ''}
    <div class="list mt">${[['📥', 'Submissions', subs.length], ['✅', 'Tasks done', `${tasks.filter((t) => t.status === 'DONE').length} of ${tasks.length}`], ['📍', 'Days in the field (30 days)', S.daysPresent(m.id)]].map(([i, l, v]) => `<div class="row li"><span>${i}</span><span class="muted sp">${l}</span><b>${v}</b></div>`).join('')}</div></div></div>`,
    footer: `${can.manageTeam() ? `<button type="button" class="btn" data-act="editMember" data-id="${esc(m.id)}">Edit</button><button type="button" class="btn" data-act="resetPin" data-id="${esc(m.id)}">Reset PIN</button>${window.Cloud && Cloud.linked() && m.id !== SESSION.id ? `<button type="button" class="btn" data-act="cloudInviteFor" data-id="${esc(m.id)}">☁ Invite to cloud</button>` : ''}` : ''}${can.manageWork() ? `<button type="button" class="btn" data-act="issueCert" data-id="${esc(m.id)}">🎓 Certificate</button>` : ''}` });
};
ACT.editMember = ({ id }) => {
  const m = S.member(id); if (!guard(can.manageTeam())) return; if (m.role === 'ADMIN' && role() !== 'ADMIN') return toast('Only the Admin can edit the Admin.', true);
  modal({ title: 'Edit ' + esc(m.name), body: F(memberFields(m)), onSubmit: (v) => {
    if (m.id === SESSION.id && v.role !== m.role) { toast('You cannot change your own role.', true); return false; }
    if (v.role === 'ADMIN' && role() !== 'ADMIN') { toast('Only an Admin can create an Admin.', true); return false; }
    Object.assign(m, { name: v.name.trim(), role: v.role, phone: v.phone.trim(), email: v.email || '', title: v.title || '', region: v.region || '', status: v.status }); audit('Person updated', m.name); commit(); refresh(); toast('Saved'); } });
};
ACT.resetPin = ({ id }) => {
  if (!guard(can.manageTeam())) return; const m = S.member(id);
  modal({ title: 'Reset PIN for ' + esc(m.name), body: F([{ name: 'pin', label: 'New 4-digit PIN', type: 'password', required: true, placeholder: '••••', full: true }]), onSubmit: async (v) => { if (!/^\d{4}$/.test(v.pin)) { toast('The PIN must be 4 digits.', true); return false; } Object.assign(m, await makeCred(v.pin)); audit('PIN reset', m.name); commit(); toast('PIN changed'); } });
};
ACT.exportTeam = async () => { await exportCSV('team.csv', [['Name', 'Role', 'Position', 'Region', 'Phone', 'Email', 'Status'], ...DB.members.map((m) => [m.name, ROLES[m.role], m.title, m.region, m.phone, m.email, m.status])]); toast('Exported'); };
ACT.importTeam = async () => {
  if (!guard(can.manageTeam())) return;
  const txt = await new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.csv,text/csv'; i.onchange = () => (i.files[0] ? i.files[0].text().then(res) : res(null)); i.click(); }); if (!txt) return;
  const rows = parseCSV(txt); if (rows.length < 2) return toast('The file has no rows.', true);
  const head = rows[0].map((h) => h.trim().toLowerCase()); const col = (n) => head.findIndex((h) => h.includes(n)); const ci = { name: col('name'), role: col('role'), phone: col('phone'), region: col('region') >= 0 ? col('region') : col('district'), title: col('position') >= 0 ? col('position') : col('title'), email: col('email') };
  if (ci.name < 0) return toast('The first row must have a "Name" column. Other columns: Role, Phone, Region, Position, Email.', true);
  const rev = Object.fromEntries(Object.entries(ROLES).map(([k, v]) => [v.toLowerCase(), k])); let added = 0, skipped = 0; const cred = await makeCred('1234');
  for (const r of rows.slice(1)) {
    const name = (r[ci.name] || '').trim(); if (!name) continue; const phone = ci.phone >= 0 ? (r[ci.phone] || '').trim() : ''; if (phone && DB.members.some((m) => m.phone === phone)) { skipped++; continue; }
    const rl = ci.role >= 0 ? rev[(r[ci.role] || '').trim().toLowerCase()] || (ROLES[(r[ci.role] || '').trim().toUpperCase()] ? (r[ci.role] || '').trim().toUpperCase() : 'AGENT') : 'AGENT';
    DB.members.push({ id: uid(), name, role: rl === 'ADMIN' ? 'AGENT' : rl, phone, email: ci.email >= 0 ? r[ci.email] || '' : '', title: ci.title >= 0 ? r[ci.title] || '' : '', region: ci.region >= 0 ? r[ci.region] || '' : '', status: 'ACTIVE', createdAt: Date.now(), ...cred }); added++;
  }
  audit('Team imported', `${added} added, ${skipped} skipped`); commit(); refresh(); toast(`${added} added${skipped ? `, ${skipped} skipped (phone already exists)` : ''}. New people have the PIN 1234; ask them to change it.`);
};

/* ---------- projects ---------- */
function projectList(edit) {
  if (!DB.projects.length) return empty('📁', 'No projects yet', can.manageWork() ? 'Create the first project to organise your field work.' : '');
  return `<div class="grid g2">${DB.projects.map((p) => { const pr = S.projectProgress(p); return `<div class="card pcard" data-act="viewProject" data-id="${esc(p.id)}" tabindex="0"><div class="row"><b class="sp">${esc(p.name)}</b>${stPill('project', p.status)}</div><div class="muted sm" style="margin:4px 0 10px">${esc(p.region || '')} ${p.start ? '· ' + fdate(p.start) + ' to ' + fdate(p.end) : ''}</div>${bar(pr.pct)}<div class="row sm muted" style="margin-top:6px"><span class="sp">${pr.pct}% complete</span><span>${pr.done}/${pr.tasks} tasks</span><span>${pr.subs}${p.target ? '/' + p.target : ''} submissions</span></div></div>`; }).join('')}</div>`;
}
VIEWS.projects = () => `<div class="bar row wrap"><span class="sp"></span>${can.manageWork() ? '<button class="btn p" data-act="newProject">＋ New project</button>' : ''}</div><div class="mt">${projectList(true)}</div>`;
const projectFields = (p = {}) => [{ name: 'name', label: 'Project name', required: true, full: true, value: p.name || '' }, { name: 'description', label: 'Description', type: 'textarea', full: true, value: p.description || '' }, { name: 'status', label: 'Status', options: options(STATUS.project), value: p.status || 'PLANNING' },
  { name: 'leaderId', label: 'Project lead', options: [['', '(none)'], ...memberOpts(DB.members.filter((m) => m.role !== 'VIEWER'))], value: p.leaderId || '' }, { name: 'start', label: 'Start date', type: 'date', value: p.start ? toInputDate(p.start) : toInputDate(Date.now()) }, { name: 'end', label: 'End date', type: 'date', value: p.end ? toInputDate(p.end) : '' },
  { name: 'region', label: 'Area covered', value: p.region || '' }, { name: 'target', label: 'Target number of submissions', type: 'number', min: 0, value: p.target || '' }];
const teamPicker = (sel) => `<div class="full"><label class="f">Project team</label><div class="chk">${DB.members.filter((m) => m.role !== 'ADMIN' && m.role !== 'VIEWER').map((m) => `<label><input type="checkbox" name="team" value="${esc(m.id)}" ${sel.includes(m.id) ? 'checked' : ''}> ${esc(m.name)} <span class="muted sm">${esc(ROLES[m.role])}</span></label>`).join('')}</div></div>`;
ACT.newProject = () => { if (!guard(can.manageWork())) return; modal({ title: '＋ New project', wide: true, body: `<div class="fg">${projectFields().map(fld).join('')}${teamPicker([])}</div>`, submit: 'Create project', onSubmit: (v) => { const p = { id: uid(), name: v.name.trim(), description: v.description, status: v.status, leaderId: v.leaderId || null, start: fromInputDate(v.start), end: fromInputDate(v.end), region: v.region, target: +v.target || 0, team: [].concat(v.team || []), createdAt: Date.now() }; DB.projects.push(p); audit('Project created', p.name); commit(); refresh(); toast('Project created'); } }); };
ACT.editProject = ({ id }) => { const p = S.project(id); if (!guard(can.manageWork())) return; modal({ title: 'Edit project', wide: true, body: `<div class="fg">${projectFields(p).map(fld).join('')}${teamPicker(p.team || [])}</div>`, onSubmit: (v) => { Object.assign(p, { name: v.name.trim(), description: v.description, status: v.status, leaderId: v.leaderId || null, start: fromInputDate(v.start), end: fromInputDate(v.end), region: v.region, target: +v.target || 0, team: [].concat(v.team || []) }); audit('Project updated', p.name); commit(); refresh(); toast('Saved'); } }); };
ACT.deleteProject = ({ id }) => { const p = S.project(id); if (!guard(can.manageWork())) return; confirmBox(`Delete the project <b>${esc(p.name)}</b>? Its tasks and forms stay but lose the link. Submissions are kept.`, () => { DB.projects = DB.projects.filter((x) => x.id !== id); DB.tasks.forEach((t) => { if (t.projectId === id) t.projectId = null; }); DB.forms.forEach((f) => { if (f.projectId === id) f.projectId = null; }); audit('Project deleted', p.name); commit(); refresh(); closeModal(); toast('Project deleted'); }, 'Delete project', true); };
ACT.viewProject = ({ id }) => {
  const p = S.project(id); if (!p) return; const pr = S.projectProgress(p); const ts = DB.tasks.filter((t) => t.projectId === id); const fs = DB.forms.filter((f) => f.projectId === id);
  modal({ title: esc(p.name), wide: true, cancel: 'Close', body: `<p class="muted">${esc(p.description || '')}</p><div class="row" style="gap:20px;flex-wrap:wrap;margin:8px 0">${Charts.ring(pr.pct, pr.pct + '%', 'complete')}<div class="sp"><div class="row li"><span class="muted sp">Status</span>${stPill('project', p.status)}</div><div class="row li"><span class="muted sp">Lead</span><b>${esc(p.leaderId ? S.name(p.leaderId) : '—')}</b></div><div class="row li"><span class="muted sp">Dates</span><b>${fdate(p.start)} to ${fdate(p.end)}</b></div><div class="row li"><span class="muted sp">Submissions</span><b>${pr.subs}${p.target ? ' of ' + p.target : ''}</b></div></div></div>
    <h4>Team</h4><div class="chips">${(p.team || []).map((m) => `<span class="chip">${esc(S.name(m))}</span>`).join('') || '<span class="muted">No one assigned</span>'}</div>
    <h4 style="margin-top:14px">Forms</h4>${fs.length ? fs.map((f) => `<div class="row li"><b class="sp">${esc(f.name)}</b>${stPill('form', f.status)}<span class="muted sm">${S.subsOfForm(f.id).length} responses</span></div>`).join('') : '<div class="muted">No forms yet</div>'}
    <h4 style="margin-top:14px">Tasks</h4>${ts.length ? ts.map((t) => `<div class="row li"><b class="sp">${esc(t.title)}</b><span class="muted sm">${esc(S.name(t.assigneeId))}</span>${stPill('task', t.status)}</div>`).join('') : '<div class="muted">No tasks yet</div>'}`,
    footer: can.manageWork() ? `<button type="button" class="btn" data-act="editProject" data-id="${esc(id)}">Edit</button><button type="button" class="btn r" data-act="deleteProject" data-id="${esc(id)}">Delete</button>` : '' });
};

/* ---------- tasks ---------- */
function taskRow(t, full) {
  const proj = S.project(t.projectId); const od = S.isOverdue(t);
  return `<div class="task ${od ? 'late' : ''}" data-act="openTask" data-id="${esc(t.id)}" tabindex="0"><div class="row"><b class="sp">${esc(t.title)}</b>${stPill('task', t.status)}</div><div class="row sm muted wrap" style="margin-top:4px;gap:10px"><span>${proj ? '📁 ' + esc(proj.name) : ''}</span>${full ? `<span>👤 ${esc(S.name(t.assigneeId))}</span>` : ''}<span>${t.due ? (od ? '⚠️ Overdue: ' : '📅 ') + fdate(t.due) : ''}</span>${t.priority && t.priority !== 'NORMAL' ? `<span>${t.priority === 'URGENT' ? '🔥' : t.priority === 'HIGH' ? '⬆️' : '⬇️'} ${PRIORITY[t.priority]}</span>` : ''}</div>${t.progress ? bar(t.progress) : ''}</div>`;
}
VIEWS.tasks = () => {
  const mine = role() === 'AGENT'; const tab = VS.tab.tasks || (mine ? 'MINE' : 'OPEN'); const q = (VS.q.tasks || '').toLowerCase();
  let list = DB.tasks.filter((t) => (t.title + ' ' + S.name(t.assigneeId)).toLowerCase().includes(q));
  if (tab === 'MINE') list = list.filter((t) => t.assigneeId === SESSION.id); if (tab === 'OPEN') list = list.filter((t) => t.status !== 'DONE'); if (tab === 'LATE') list = list.filter((t) => S.isOverdue(t)); if (tab === 'DONE') list = list.filter((t) => t.status === 'DONE');
  list.sort((a, b) => (a.status === 'DONE') - (b.status === 'DONE') || (a.due || 9e15) - (b.due || 9e15));
  const tabs = [...(mine ? [] : [['OPEN', 'Open'], ['LATE', 'Overdue']]), ['MINE', 'Mine'], ['DONE', 'Done']];
  if (!mine) tabs.splice(2, 0, ['ALL', 'All']);
  return `<div class="bar row wrap">${searchBox('tasks', 'Search tasks')}${tabsBar('tasks', tabs, tab)}<span class="sp"></span>${can.assign() ? '<button class="btn p" data-act="newTask">＋ Assign a task</button>' : ''}</div>
    <div class="mt">${list.length ? list.map((t) => taskRow(t, !mine)).join('') : empty('✅', 'No tasks here', can.assign() ? 'Assign work to your team with the button above.' : 'Nothing assigned to you right now.')}</div>`;
};
const taskFields = (t = {}) => [{ name: 'title', label: 'Task', required: true, full: true, value: t.title || '' }, { name: 'description', label: 'Details', type: 'textarea', full: true, value: t.description || '' }, { name: 'assigneeId', label: 'Assign to', options: memberOpts(DB.members.filter((m) => m.role !== 'VIEWER' && m.status !== 'INACTIVE')), value: t.assigneeId || (S.agents()[0] || {}).id || '' },
  { name: 'projectId', label: 'Project', options: [['', '(none)'], ...memberOpts(DB.projects)], value: t.projectId || '' }, { name: 'due', label: 'Due date', type: 'date', value: t.due ? toInputDate(t.due) : '' }, { name: 'priority', label: 'Priority', options: options(PRIORITY), value: t.priority || 'NORMAL' }];
ACT.newTask = () => { if (!guard(can.assign())) return; modal({ title: '＋ Assign a task', body: F(taskFields()), submit: 'Assign', onSubmit: (v) => { const t = { id: uid(), title: v.title.trim(), description: v.description, assigneeId: v.assigneeId, projectId: v.projectId || null, due: fromInputDate(v.due), priority: v.priority, status: 'TODO', progress: 0, createdBy: SESSION.id, createdAt: Date.now(), notes: [] }; DB.tasks.push(t); audit('Task assigned', `${t.title} → ${S.name(t.assigneeId)}`); commit(); refresh(); toast('Task assigned'); } }); };
ACT.openTask = ({ id }) => {
  const t = DB.tasks.find((x) => x.id === id); if (!t) return; const mine = t.assigneeId === SESSION.id; const canEdit = can.assign() || mine;
  modal({ title: esc(t.title), wide: true, cancel: 'Close', submit: 'Save update', onSubmit: canEdit ? (v) => { const prev = t.status; t.status = v.status; t.progress = t.status === 'DONE' ? 100 : Math.max(0, Math.min(100, +v.progress || 0)); if (v.note && v.note.trim()) { t.notes = t.notes || []; t.notes.push({ by: SESSION.id, at: Date.now(), text: v.note.trim() }); } t.updatedAt = Date.now(); if (prev !== t.status) audit('Task status', `${t.title}: ${STATUS.task[t.status]}`); commit(); refresh(); toast('Task updated'); } : null,
    body: `<p class="muted">${esc(t.description || 'No extra details.')}</p><div class="list"><div class="row li"><span class="muted sp">Assigned to</span><b>${esc(S.name(t.assigneeId))}</b></div><div class="row li"><span class="muted sp">Project</span><b>${esc((S.project(t.projectId) || {}).name || '—')}</b></div><div class="row li"><span class="muted sp">Due</span><b>${fdate(t.due)}</b></div><div class="row li"><span class="muted sp">Priority</span><b>${PRIORITY[t.priority || 'NORMAL']}</b></div></div>
    ${canEdit ? `<div class="fg mt">${fld({ name: 'status', label: 'Status', options: options(STATUS.task), value: t.status })}${fld({ name: 'progress', label: 'Progress (%)', type: 'number', min: 0, max: 100, value: t.progress || 0 })}${fld({ name: 'note', label: 'Add a note or update', type: 'textarea', full: true, rows: 2 })}</div>` : ''}
    ${(t.notes || []).length ? `<h4 class="mt">Updates</h4>${t.notes.slice().reverse().map((n) => `<div class="li"><b>${esc(S.name(n.by))}</b> <span class="muted sm">${ago(n.at)}</span><div>${esc(n.text)}</div></div>`).join('')}` : ''}`,
    footer: can.assign() ? `<button type="button" class="btn" data-act="editTask" data-id="${esc(id)}">Edit task</button><button type="button" class="btn r" data-act="deleteTask" data-id="${esc(id)}">Delete</button>` : '' });
};
ACT.editTask = ({ id }) => { const t = DB.tasks.find((x) => x.id === id); if (!guard(can.assign())) return; modal({ title: 'Edit task', body: F(taskFields(t)), onSubmit: (v) => { Object.assign(t, { title: v.title.trim(), description: v.description, assigneeId: v.assigneeId, projectId: v.projectId || null, due: fromInputDate(v.due), priority: v.priority, updatedAt: Date.now() }); audit('Task updated', t.title); commit(); refresh(); toast('Saved'); } }); };
ACT.deleteTask = ({ id }) => { const t = DB.tasks.find((x) => x.id === id); if (!guard(can.manageWork(), 'Only a Manager or Admin can delete tasks.')) return; confirmBox(`Delete the task <b>${esc(t.title)}</b>?`, () => { DB.tasks = DB.tasks.filter((x) => x.id !== id); audit('Task deleted', t.title); commit(); refresh(); closeModal(); toast('Task deleted'); }, 'Delete', true); };
