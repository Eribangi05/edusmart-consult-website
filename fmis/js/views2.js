/* ===== FMIS views, part 2: forms, data collection, submissions, attendance, field map ===== */
'use strict';

/* ---------- forms (list and builder) ---------- */
VIEWS.forms = () => {
  const q = (VS.q.forms || '').toLowerCase(); const list = DB.forms.filter((f) => f.name.toLowerCase().includes(q) && (can.manageWork() || can.assign() ? true : f.status === 'PUBLISHED'));
  return `<div class="bar row wrap">${searchBox('forms', 'Search forms')}<span class="sp"></span>${can.manageWork() ? '<button class="btn p" data-act="newForm">＋ New form</button>' : ''}</div>
  <div class="mt grid g2">${list.map((f) => { const n = S.subsOfForm(f.id).length; const proj = S.project(f.projectId); return `<div class="card"><div class="row"><b class="sp">${esc(f.name)}</b>${stPill('form', f.status)}</div><div class="muted sm" style="margin:4px 0 8px">${esc(proj ? proj.name : 'General')} · ${f.fields.filter((x) => x.type !== 'note').length} questions · ${n} response${n === 1 ? '' : 's'}</div><p class="muted sm">${esc(f.description || '')}</p>
    <div class="row wrap" style="gap:8px;margin-top:10px">${f.status === 'PUBLISHED' && can.collect() ? `<button class="btn s p" data-act="fillForm" data-id="${esc(f.id)}">✍️ Fill</button>` : ''}<button class="btn s" data-act="previewForm" data-id="${esc(f.id)}">👁 Preview</button>${can.manageWork() ? `<button class="btn s" data-act="editForm" data-id="${esc(f.id)}">Edit</button>` : ''}<button class="btn s" data-act="formResponses" data-id="${esc(f.id)}">📥 Responses</button><button class="btn s" data-act="exportForm" data-id="${esc(f.id)}">⬇ CSV</button>${can.manageWork() ? `<button class="btn s" data-act="formSummary" data-id="${esc(f.id)}">📊 Summary</button>` : ''}</div></div>`; }).join('') || `<div class="full">${empty('📝', 'No forms yet', can.manageWork() ? 'Build your first data collection form with the button above.' : '')}</div>`}</div>`;
};

let BLD = null;                                                        // the form being built
const newField = (type = 'text') => ({ id: 'q' + uid().slice(-6), label: '', type, required: false, options: type === 'choice' || type === 'multi' ? ['Option 1', 'Option 2'] : undefined });
ACT.newForm = () => { if (!guard(can.manageWork())) return; BLD = { form: null, fields: [newField('text')] }; builderModal({ name: '', description: '', projectId: '', status: 'DRAFT' }); };
ACT.editForm = ({ id }) => { if (!guard(can.manageWork())) return; const f = S.form(id); BLD = { form: f, fields: JSON.parse(JSON.stringify(f.fields)) }; builderModal(f); };
function builderModal(f) {
  modal({ title: BLD.form ? 'Edit form' : '＋ New form', wide: true, submit: 'Save form',
    body: `<div class="fg">${fld({ name: 'name', label: 'Form name', required: true, full: true, value: f.name || '' })}${fld({ name: 'description', label: 'Instructions for the person filling it', type: 'textarea', full: true, rows: 2, value: f.description || '' })}${fld({ name: 'projectId', label: 'Project', options: [['', '(general)'], ...memberOpts(DB.projects)], value: f.projectId || '' })}${fld({ name: 'status', label: 'Status', options: options(STATUS.form), value: f.status || 'DRAFT', hint: 'Only Published forms can be filled by field agents.' })}</div>
    <h4 style="margin-top:16px">Questions</h4><div id="bfields"></div><div class="row wrap mt" style="gap:8px"><button type="button" class="btn s" data-act="addField">＋ Add a question</button><button type="button" class="btn s" data-act="addRepeat">＋ Add a repeat group</button></div>`,
    onSubmit: (v) => {
      const stripBlank = (list) => list.filter((x) => x.label.trim() || x.type === 'note');
      const checkOne = (x, fields) => { if (!x.label.trim()) { toast('Every question needs a label.', true); return false; } if ((x.type === 'choice' || x.type === 'multi') && (x.options || []).filter((o) => o.trim()).length < 2) { toast(`"${x.label}" needs at least two options.`, true); return false; }
        if (x.skipIf) { const refIdx = fields.indexOf(fields.find((y) => y.id === x.skipIf.fieldId)); if (refIdx === -1 || refIdx >= fields.indexOf(x)) { toast(`"${x.label}"'s show-only-if must reference an earlier question.`, true); return false; } if (!['answered', 'unanswered'].includes(x.skipIf.op) && !String(x.skipIf.value ?? '').trim()) { toast(`"${x.label}"'s show-only-if needs a value to compare against.`, true); return false; } }
        if (x.constraint) { const refIdx = fields.indexOf(fields.find((y) => y.id === x.constraint.fieldId)); if (refIdx === -1 || refIdx >= fields.indexOf(x)) { toast(`"${x.label}"'s comparison must reference an earlier question.`, true); return false; } } return true; };
      const fields = stripBlank(BLD.fields); if (!fields.filter((x) => x.type !== 'note').length) { toast('Add at least one question.', true); return false; }
      for (const x of fields) {
        if (x.type === 'repeat') { x.fields = stripBlank(x.fields || []); if (!x.fields.filter((y) => y.type !== 'note').length) { toast(`"${x.label || 'Repeat group'}" needs at least one question in it.`, true); return false; } for (const y of x.fields) if (!checkOne(y, x.fields)) return false; if (!x.label.trim()) { toast('Every repeat group needs a name.', true); return false; } continue; }
        if (!checkOne(x, fields)) return false;
      }
      const cleanOne = (x) => { const o = { id: x.id, label: x.label.trim(), type: x.type, required: !!x.required }; if (x.options) o.options = x.options.map((s) => s.trim()).filter(Boolean); if (x.type === 'number' || x.type === 'decimal') { if (x.min !== '' && x.min != null) o.min = +x.min; if (x.max !== '' && x.max != null) o.max = +x.max; } if (x.hint) o.hint = x.hint; if (x.skipIf) o.skipIf = x.skipIf; if (x.constraint) o.constraint = x.constraint; if (x.type === 'repeat') o.fields = x.fields.map(cleanOne); return o; };
      const clean = fields.map(cleanOne);
      if (BLD.form) { Object.assign(BLD.form, { name: v.name.trim(), description: v.description, projectId: v.projectId || null, status: v.status, fields: clean, version: (BLD.form.version || 1) + 1, updatedAt: Date.now() }); audit('Form updated', v.name); }
      else { DB.forms.push({ id: uid(), name: v.name.trim(), description: v.description, projectId: v.projectId || null, status: v.status, fields: clean, version: 1, createdBy: SESSION.id, createdAt: Date.now() }); audit('Form created', v.name); }
      commit(); refresh(); toast('Form saved'); } });
  paintBuilder();
}
// only a question with a simple, directly-comparable answer can be referenced by a later question's
// skip condition - not GPS/photo (not meaningfully comparable) or a note (not an answer at all)
const SKIP_REFABLE = (t) => !['note', 'gps', 'photo'].includes(t);
const SKIP_OPS_NUMERIC = [['eq', 'is'], ['neq', 'is not'], ['gt', 'is greater than'], ['lt', 'is less than'], ['answered', 'is answered'], ['unanswered', 'is not answered']];
const SKIP_OPS_OTHER = [['eq', 'is'], ['neq', 'is not'], ['answered', 'is answered'], ['unanswered', 'is not answered']];
// constraint: a question's OWN answer must compare a certain way against an earlier question's
// answer, e.g. "end date after start date" - unlike skipIf there is no literal value to type in,
// it is always a same-form field reference, so the stored shape is just {fieldId, op}
const CONSTRAINT_TYPES = ['number', 'decimal', 'date', 'time', 'datetime'];
const CONSTRAINT_OPS = [['gt', 'must be after/greater than'], ['lt', 'must be before/less than'], ['neq', 'must be different from']];
// number/decimal compare numerically; date/time/datetime inputs are all ISO-formatted so plain
// string comparison already sorts them chronologically - no date-parsing library needed
function compareOrdered(type, op, v, ref) {
  const isNum = type === 'number' || type === 'decimal';
  if (op === 'neq') return isNum ? +v !== +ref : String(v) !== String(ref);
  if (op === 'gt') return isNum ? +v > +ref : String(v) > String(ref);
  return isNum ? +v < +ref : String(v) < String(ref); // 'lt'
}
function skipRow(x, dbf, prior) {
  if (!prior.length) return '';
  const ref = x.skipIf && prior.find((y) => y.id === x.skipIf.fieldId);
  const ops = ref && (ref.type === 'number' || ref.type === 'rating') ? SKIP_OPS_NUMERIC : SKIP_OPS_OTHER;
  const needsValue = ref && !['answered', 'unanswered'].includes(x.skipIf.op);
  const valueInput = !ref || !needsValue ? '' : ref.type === 'choice' || ref.type === 'yesno'
    ? `<select data-bf="${dbf}:skipValue">${(ref.type === 'yesno' ? [['true', 'Yes'], ['false', 'No']] : ref.options.map((o) => [o, o])).map(([v, l]) => `<option value="${esc(v)}" ${String(x.skipIf.value) === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`
    : `<input data-bf="${dbf}:skipValue" value="${esc(x.skipIf.value ?? '')}" placeholder="Value" aria-label="Value to compare">`;
  return `<div class="row wrap" style="gap:8px;margin-top:6px"><label class="muted sm">Show only if</label><select data-bf="${dbf}:skipField" aria-label="Depends on question">
    <option value="">Always show</option>${prior.map((y) => `<option value="${esc(y.id)}" ${x.skipIf && x.skipIf.fieldId === y.id ? 'selected' : ''}>${esc(y.label || '(untitled question)')}</option>`).join('')}</select>
    ${ref ? `<select data-bf="${dbf}:skipOp" aria-label="Condition">${ops.map(([v, l]) => `<option value="${v}" ${x.skipIf.op === v ? 'selected' : ''}>${l}</option>`).join('')}</select>${valueInput}` : ''}</div>`;
}
// a repeat group is a pseudo-field {type:'repeat', fields:[...]} - one level deep only (a repeat
// inside a repeat is refused in the builder, see ACT.addSubField). dbf addresses a field by its
// dot-joined index path ("2" for a top-level field, "2.0" for its first nested question) so the
// same input/move/delete plumbing works for both without a second copy of the row template.
function fieldRow(x, path, list, prior) {
  const dbf = path.join('.'); const i = path[path.length - 1]; const top = path.length === 1;
  return `<div class="bfield"><div class="row wrap" style="gap:8px"><span class="bn">${i + 1}</span><input class="sp" data-bf="${dbf}:label" value="${esc(x.label)}" placeholder="${x.type === 'note' ? 'Instruction text' : 'Question'}" aria-label="Question"><select data-bf="${dbf}:type" aria-label="Type">${options(FIELD_TYPES).map(([k, l]) => `<option value="${k}" ${x.type === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
    ${x.type === 'choice' || x.type === 'multi' ? `<textarea data-bf="${dbf}:options" rows="3" placeholder="One option per line" aria-label="Options">${esc((x.options || []).join('\n'))}</textarea>` : ''}
    ${x.type === 'number' || x.type === 'decimal' ? `<div class="row" style="gap:8px"><input type="number" data-bf="${dbf}:min" value="${esc(x.min ?? '')}" placeholder="Minimum"><input type="number" data-bf="${dbf}:max" value="${esc(x.max ?? '')}" placeholder="Maximum"></div>` : ''}
    ${top ? skipRow(x, dbf, prior) : ''}
    ${top && CONSTRAINT_TYPES.includes(x.type) ? constraintRow(x, dbf, prior.filter((y) => CONSTRAINT_TYPES.includes(y.type))) : ''}
    <div class="row wrap" style="gap:8px">${x.type !== 'note' ? `<label class="chkl"><input type="checkbox" data-bf="${dbf}:required" ${x.required ? 'checked' : ''}> Required</label>` : ''}<span class="sp"></span><button type="button" class="btn s" data-act="moveField" data-path="${dbf}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">↑</button><button type="button" class="btn s" data-act="moveField" data-path="${dbf}" data-d="1" ${i === list.length - 1 ? 'disabled' : ''} aria-label="Move down">↓</button><button type="button" class="btn s r" data-act="delField" data-path="${dbf}" aria-label="Delete question">✕</button></div></div>`;
}
function constraintRow(x, dbf, prior) {
  if (!prior.length) return '';
  const ref = x.constraint && prior.find((y) => y.id === x.constraint.fieldId);
  return `<div class="row wrap" style="gap:8px;margin-top:6px"><label class="muted sm">Compared to</label><select data-bf="${dbf}:constraintField" aria-label="Compare against">
    <option value="">No comparison</option>${prior.map((y) => `<option value="${esc(y.id)}" ${x.constraint && x.constraint.fieldId === y.id ? 'selected' : ''}>${esc(y.label || '(untitled question)')}</option>`).join('')}</select>
    ${ref ? `<select data-bf="${dbf}:constraintOp" aria-label="Comparison">${CONSTRAINT_OPS.map(([v, l]) => `<option value="${v}" ${x.constraint.op === v ? 'selected' : ''}>${l}</option>`).join('')}</select>` : ''}</div>`;
}
function fieldAt(path) { return path.length === 1 ? BLD.fields[path[0]] : (BLD.fields[path[0]] || {}).fields && BLD.fields[path[0]].fields[path[1]]; }
function paintBuilder() {
  const host = $('#bfields'); if (!host) return;
  // a reorder or type change can leave a skip condition pointing at a question that is no longer
  // earlier (or no longer exists) - drop it rather than let the builder and the saved data disagree
  BLD.fields.forEach((x, i) => { if (x.skipIf && !BLD.fields.slice(0, i).some((y) => y.id === x.skipIf.fieldId)) x.skipIf = undefined; if (x.constraint && !BLD.fields.slice(0, i).some((y) => y.id === x.constraint.fieldId)) x.constraint = undefined; });
  host.innerHTML = BLD.fields.map((x, i) => {
    if (x.type === 'repeat') {
      return `<div class="bfield brepeat"><div class="row wrap" style="gap:8px"><span class="bn">${i + 1}</span><input class="sp" data-bf="${i}:label" value="${esc(x.label)}" placeholder="Repeat group name, e.g. Household member" aria-label="Repeat group ${i + 1}"><span class="pill">Repeat group</span></div>
        <div class="brepeat-sub">${(x.fields || []).map((sx, j) => fieldRow(sx, [i, j], x.fields, [])).join('')}</div>
        <div class="row wrap mt" style="gap:8px"><button type="button" class="btn s" data-act="addSubField" data-path="${i}">＋ Add a question to this group</button></div>
        <div class="row wrap" style="gap:8px;margin-top:8px"><span class="sp"></span><button type="button" class="btn s" data-act="moveField" data-path="${i}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">↑</button><button type="button" class="btn s" data-act="moveField" data-path="${i}" data-d="1" ${i === BLD.fields.length - 1 ? 'disabled' : ''} aria-label="Move down">↓</button><button type="button" class="btn s r" data-act="delField" data-path="${i}" aria-label="Delete group">✕ Remove group</button></div></div>`;
    }
    return fieldRow(x, [i], BLD.fields, BLD.fields.slice(0, i).filter((y) => SKIP_REFABLE(y.type)));
  }).join('');
}
document.addEventListener('input', (e) => {
  const el = e.target.closest && e.target.closest('[data-bf]'); if (!el || !BLD) return; const [pathStr, p] = el.dataset.bf.split(':'); const path = pathStr.split('.').map(Number); const f = fieldAt(path); if (!f) return;
  if (p === 'required') f.required = el.checked; else if (p === 'options') f.options = el.value.split('\n'); else if (p === 'type') { f.type = el.value; if ((f.type === 'choice' || f.type === 'multi') && !f.options) f.options = ['Option 1', 'Option 2']; paintBuilder(); }
  else if (p === 'skipField') { f.skipIf = el.value ? { fieldId: el.value, op: 'eq', value: '' } : undefined; paintBuilder(); }
  else if (p === 'skipOp') { f.skipIf.op = el.value; paintBuilder(); }
  else if (p === 'skipValue') { f.skipIf.value = el.value; }
  else if (p === 'constraintField') { f.constraint = el.value ? { fieldId: el.value, op: 'gt' } : undefined; paintBuilder(); }
  else if (p === 'constraintOp') { f.constraint.op = el.value; }
  else f[p] = el.value;
});
const focusLastLabel = () => { const l = $$('#bfields input[data-bf$=":label"]'); if (l.length) l[l.length - 1].focus(); };
ACT.addField = () => { BLD.fields.push(newField('text')); paintBuilder(); focusLastLabel(); };
ACT.addRepeat = () => { BLD.fields.push({ id: 'q' + uid().slice(-6), label: '', type: 'repeat', fields: [newField('text')] }); paintBuilder(); };
ACT.addSubField = ({ path }) => { const rep = BLD.fields[+path]; if (!rep || rep.type !== 'repeat') return; rep.fields.push(newField('text')); paintBuilder(); focusLastLabel(); };
ACT.delField = ({ path }) => { const idx = path.split('.').map(Number); if (idx.length === 1) BLD.fields.splice(idx[0], 1); else BLD.fields[idx[0]].fields.splice(idx[1], 1); paintBuilder(); };
ACT.moveField = ({ path, d }) => { const idx = path.split('.').map(Number); d = +d; const list = idx.length === 1 ? BLD.fields : BLD.fields[idx[0]].fields; const i = idx[idx.length - 1]; const j = i + d; if (j < 0 || j >= list.length) return; [list[i], list[j]] = [list[j], list[i]]; paintBuilder(); };
ACT.previewForm = ({ id }) => { const f = S.form(id); modal({ title: 'Preview: ' + esc(f.name), wide: true, cancel: 'Close', body: `<p class="muted">${esc(f.description || '')}</p><div class="fg">${f.fields.map((x) => x.type === 'repeat' ? repeatBlock(x, undefined) : fieldInput(x, undefined)).join('')}</div>` }); };

/* ---------- filling a form ---------- */
function fieldInput(x, val, prefix = '') {
  const name = 'f_' + prefix + x.id; const req = x.required ? ' *' : ''; const label = `<label class="f">${esc(x.label)}${req}</label>`; const hint = x.hint ? `<span class="hint muted">${esc(x.hint)}</span>` : '';
  const isR = x.required ? 'required' : '';
  switch (x.type) {
    case 'note': return `<div class="full"><div class="alert"><span>ℹ️</span><span>${esc(x.label)}</span></div></div>`;
    case 'longtext': return `<div class="full">${label}<textarea name="${name}" rows="3" ${isR}>${esc(val || '')}</textarea>${hint}</div>`;
    case 'number': case 'decimal': return `<div>${label}<input name="${name}" type="number" inputmode="decimal" step="any" ${x.min != null ? `min="${x.min}"` : ''} ${x.max != null ? `max="${x.max}"` : ''} value="${esc(val ?? '')}" ${isR}>${hint}</div>`;
    case 'date': return `<div>${label}<input name="${name}" type="date" value="${esc(val || '')}" ${isR}></div>`;
    case 'time': return `<div>${label}<input name="${name}" type="time" value="${esc(val || '')}" ${isR}></div>`;
    case 'datetime': return `<div>${label}<input name="${name}" type="datetime-local" value="${esc(val || '')}" ${isR}></div>`;
    case 'phone': return `<div>${label}<input name="${name}" type="tel" inputmode="tel" value="${esc(val || '')}" ${isR}></div>`;
    case 'barcode': return `<div class="full">${label}<div class="row wrap" style="gap:8px"><input class="sp" name="${name}" type="text" value="${esc(val || '')}" placeholder="Scan or type the code" ${isR}>${window.api && window.api.scanBarcode ? `<button type="button" class="btn s p" data-act="scanBarcode" data-n="${name}">📷 Scan</button>` : ''}</div>${hint}</div>`;
    case 'choice': return (x.options || []).length <= 4 ? `<div class="full">${label}<div class="radios">${(x.options || []).map((o) => `<label><input type="radio" name="${name}" value="${esc(o)}" ${val === o ? 'checked' : ''} ${isR}> ${esc(o)}</label>`).join('')}</div></div>` : `<div class="full">${label}<select name="${name}" ${isR}><option value="">Select…</option>${(x.options || []).map((o) => `<option ${val === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></div>`;
    case 'multi': return `<div class="full">${label}<div class="chk">${(x.options || []).map((o) => `<label><input type="checkbox" name="${name}" value="${esc(o)}" ${(val || []).includes(o) ? 'checked' : ''}> ${esc(o)}</label>`).join('')}</div></div>`;
    case 'yesno': return `<div>${label}<div class="radios"><label><input type="radio" name="${name}" value="yes" ${val === true ? 'checked' : ''} ${isR}> Yes</label><label><input type="radio" name="${name}" value="no" ${val === false ? 'checked' : ''} ${isR}> No</label></div></div>`;
    case 'rating': return `<div>${label}<div class="radios stars">${[1, 2, 3, 4, 5].map((n) => `<label title="${n}"><input type="radio" name="${name}" value="${n}" ${+val === n ? 'checked' : ''} ${isR}> ${n}</label>`).join('')}</div></div>`;
    case 'gps': return `<div class="full">${label}<input type="hidden" name="${name}" value="${esc(val ? JSON.stringify(val) : '')}"><div class="gpsbox" data-gps="${name}" ${x.required ? 'data-req="1"' : ''}><div class="gpsval" id="${name}_v">${val ? `📍 ${val.lat}, ${val.lng} (±${val.acc || '?'} m)` : 'No location captured yet'}</div><div class="row wrap" style="gap:8px"><button type="button" class="btn s p" data-act="captureGps" data-n="${name}">📍 Capture my location</button><input class="gpsin" id="${name}_lat" placeholder="Latitude" inputmode="decimal" value="${val ? val.lat : ''}"><input class="gpsin" id="${name}_lng" placeholder="Longitude" inputmode="decimal" value="${val ? val.lng : ''}"><button type="button" class="btn s" data-act="manualGps" data-n="${name}">Use typed</button></div><div class="gpsmap" id="${name}_map" ${val ? '' : 'hidden'}></div><div class="gpssector muted sm" id="${name}_sector"></div></div>${hint}</div>`;
    case 'photo': return `<div class="full">${label}<input type="hidden" name="${name}" value="${esc(val || '')}"><div class="photobox"><img id="${name}_img" alt="" ${val ? `src="${esc(val)}"` : 'hidden'}><div class="row wrap" style="gap:8px"><label class="btn s p" style="cursor:pointer">📷 Take or choose a photo<input type="file" accept="image/*" capture="environment" hidden data-photo="${name}"></label>${val ? `<button type="button" class="btn s r" data-act="clearPhoto" data-n="${name}">Remove</button>` : `<button type="button" class="btn s r" data-act="clearPhoto" data-n="${name}" hidden>Remove</button>`}</div></div>${hint}</div>`;
    case 'audio': return `<div class="full">${label}<input type="hidden" name="${name}" value="${esc(val || '')}"><div class="photobox"><audio id="${name}_aud" controls ${val ? `src="${esc(val)}"` : 'hidden'}></audio><div class="row wrap" style="gap:8px"><label class="btn s p" style="cursor:pointer">🎙️ Record or choose audio<input type="file" accept="audio/*" capture hidden data-audio="${name}"></label>${val ? `<button type="button" class="btn s r" data-act="clearAudio" data-n="${name}">Remove</button>` : `<button type="button" class="btn s r" data-act="clearAudio" data-n="${name}" hidden>Remove</button>`}</div></div>${hint}</div>`;
    default: return `<div>${label}<input name="${name}" type="text" value="${esc(val || '')}" ${isR}>${hint}</div>`;
  }
}
const setHidden = (n, v) => { const h = document.querySelector(`#mform [name="${n}"]`); if (h) h.value = v; };

// Rwanda sector boundaries (same simplified shapes used on the public website's map), bundled locally
// under assets/ so this works offline in the field - not fetched from any server. Lets a data collector
// see which sector their captured GPS point actually falls in, the same way a Kobo form would.
let SECTORS_GJ = null;
async function loadSectors() { if (SECTORS_GJ) return SECTORS_GJ; try { SECTORS_GJ = await fetch('assets/rwanda-sectors.json').then((r) => r.json()); } catch (e) { SECTORS_GJ = { type: 'FeatureCollection', features: [] }; } return SECTORS_GJ; }
function pointInRing(pt, ring) { let inside = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1]; if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)) inside = !inside; } return inside; }
function pointInFeature(pt, geom) { if (geom.type === 'Polygon') return pointInRing(pt, geom.coordinates[0]); if (geom.type === 'MultiPolygon') return geom.coordinates.some((poly) => pointInRing(pt, poly[0])); return false; }
const GPS_MAPS = {}; // one small Leaflet map per GPS field on screen, keyed by its "f_<id>" name
async function updateGpsMap(n, lat, lng) {
  const host = $('#' + n + '_map'); const cap = $('#' + n + '_sector'); if (!host || !window.L) return; host.hidden = false;
  const gj = await loadSectors(); const hit = gj.features.find((f) => pointInFeature([lng, lat], f.geometry));
  if (cap) cap.textContent = hit ? `📍 ${hit.properties.sector} sector, ${hit.properties.district} district, ${hit.properties.province}` : 'Outside any known Rwanda sector';
  let gm = GPS_MAPS[n]; if (!gm) gm = GPS_MAPS[n] = { map: L.map(host, { zoomControl: false, attributionControl: false, scrollWheelZoom: false }) };
  gm.map.invalidateSize(); gm.map.setView([lat, lng], 13);
  if (gm.marker) gm.marker.setLatLng([lat, lng]); else gm.marker = L.marker([lat, lng]).addTo(gm.map);
  if (gm.sectorLayer) { gm.map.removeLayer(gm.sectorLayer); gm.sectorLayer = null; }
  if (hit) gm.sectorLayer = L.geoJSON(hit, { style: { color: '#0aa0f0', weight: 2, fillOpacity: .12 } }).addTo(gm.map);
}
ACT.captureGps = async ({ n }) => {
  const box = $('#' + n + '_v'); if (box) box.textContent = 'Getting your location…';
  try { const g = await getPosition(); setHidden(n, JSON.stringify(g)); if (box) box.textContent = `📍 ${g.lat}, ${g.lng} (±${g.acc} m)`; $('#' + n + '_lat').value = g.lat; $('#' + n + '_lng').value = g.lng; updateGpsMap(n, g.lat, g.lng); }
  catch (e) { if (box) box.textContent = e.message; }
};
ACT.manualGps = ({ n }) => {
  const lat = parseFloat($('#' + n + '_lat').value), lng = parseFloat($('#' + n + '_lng').value); const box = $('#' + n + '_v');
  if (!(lat >= -90 && lat <= 90) || !(lng >= -180 && lng <= 180)) { if (box) box.textContent = 'Type a valid latitude and longitude, for example -1.9441 and 30.0619.'; return; }
  const g = { lat: +lat.toFixed(6), lng: +lng.toFixed(6), acc: 0, at: Date.now(), manual: true }; setHidden(n, JSON.stringify(g)); if (box) box.textContent = `📍 ${g.lat}, ${g.lng} (typed)`; updateGpsMap(n, g.lat, g.lng);
};
ACT.clearPhoto = ({ n }) => { setHidden(n, ''); const im = $('#' + n + '_img'); if (im) { im.hidden = true; im.removeAttribute('src'); } };
ACT.clearAudio = ({ n }) => { setHidden(n, ''); const au = $('#' + n + '_aud'); if (au) { au.hidden = true; au.removeAttribute('src'); } };
// no native scanner is wired up yet on any shell - this hook is here so a future platform.js
// addition (window.api.scanBarcode) lights the button up automatically; until then the barcode
// field is manual-entry only, same as GPS's typed fallback when capture isn't available
ACT.scanBarcode = async ({ n }) => {
  if (!(window.api && window.api.scanBarcode)) return;
  try { const code = await window.api.scanBarcode(); if (code) setHidden(n, code); }
  catch (e) { toast('Could not scan. Type the code instead.', true); }
};
document.addEventListener('change', async (e) => {
  const inp = e.target.closest && e.target.closest('[data-photo]');
  if (inp) { if (!inp.files[0]) return;
    try { const url = await shrinkImage(inp.files[0]); if (url.length > 230000) return toast('That photo is too large to sync. Take it again from further away or use a smaller size.', true); const n = inp.dataset.photo; setHidden(n, url); const im = $('#' + n + '_img'); im.src = url; im.hidden = false; const rm = inp.closest('.photobox').querySelector('[data-act=clearPhoto]'); if (rm) rm.hidden = false; } catch (err) { toast('Could not read that photo.', true); }
    return; }
  const ainp = e.target.closest && e.target.closest('[data-audio]'); if (!ainp || !ainp.files[0]) return;
  try { const url = await readFileDataUrl(ainp.files[0]); if (url.length > 700000) return toast('That recording is too large to sync. Try a shorter clip.', true); const n = ainp.dataset.audio; setHidden(n, url); const au = $('#' + n + '_aud'); au.src = url; au.hidden = false; const rm = ainp.closest('.photobox').querySelector('[data-act=clearAudio]'); if (rm) rm.hidden = false; } catch (err) { toast('Could not read that recording.', true); }
});

// Show-only-if: x.skipIf = {fieldId, op, value}, fieldId must be an EARLIER question (enforced in
// builderModal's onSubmit and kept consistent by paintBuilder). Evaluated against values collected
// so far in field order, so a hidden question's own answer is correctly treated as "unanswered" by
// anything that in turn depends on it.
function fieldVisible(x, values) {
  if (!x.skipIf) return true; const { fieldId, op, value } = x.skipIf; const v = values[fieldId];
  const empty = v === undefined || v === '' || (Array.isArray(v) && !v.length);
  switch (op) {
    case 'answered': return !empty;
    case 'unanswered': return empty;
    case 'neq': return String(v) !== String(value);
    case 'gt': return parseFloat(v) > parseFloat(value);
    case 'lt': return parseFloat(v) < parseFloat(value);
    default: return String(v) === String(value); // 'eq'
  }
}
// reads one question's raw answer from the DOM, given the name prefix its inputs were rendered with
// ('' for a normal top-level question, "<repeatId>__<instanceKey>__" for a question inside a repeat
// instance) - shared by readValues' top-level loop and its per-instance loop over a repeat group.
function readOneValue(form, x, prefix) {
  const n = 'f_' + prefix + x.id;
  if (x.type === 'multi') return [...form.querySelectorAll(`[name="${n}"]:checked`)].map((c) => c.value);
  if (x.type === 'yesno') { const c = form.querySelector(`[name="${n}"]:checked`); return c ? c.value === 'yes' : undefined; }
  if (x.type === 'gps') { const h = form.querySelector(`[name="${n}"]`); return h && h.value ? JSON.parse(h.value) : undefined; }
  if (x.type === 'photo' || x.type === 'audio') { const h = form.querySelector(`[name="${n}"]`); return (h && h.value) || undefined; }
  if (x.type === 'number' || x.type === 'decimal') { const el = form.querySelector(`[name="${n}"]`); const s = el ? el.value : ''; return s === '' ? undefined : +s; }
  if (x.type === 'rating') { const c = form.querySelector(`[name="${n}"]:checked`); return c ? +c.value : undefined; }
  const el = form.querySelector(`[name="${n}"]`); const c = el && el.type === 'radio' ? form.querySelector(`[name="${n}"]:checked`) : el; return c && c.value !== '' ? c.value : undefined;
}
function readValues(form, fields) {
  const values = {}; const errs = []; const visible = new Set();
  for (const x of fields) {
    if (!fieldVisible(x, values)) continue; visible.add(x.id);
    if (x.type === 'note') continue;
    if (x.type === 'repeat') {
      const grp = form.querySelector(`#rg_${CSS.escape(x.id)}`); const items = grp ? [...grp.querySelectorAll(':scope > .repeat-item')] : []; const arr = [];
      items.forEach((item, pos) => { const k = item.dataset.ri; const inst = {};
        x.fields.forEach((sx) => { if (sx.type === 'note') return; const v = readOneValue(form, sx, x.id + '__' + k + '__');
          if ((sx.type === 'number' || sx.type === 'decimal') && v != null && ((sx.min != null && v < sx.min) || (sx.max != null && v > sx.max))) errs.push(`${x.label} #${pos + 1}: "${sx.label}" must be between ${sx.min ?? '…'} and ${sx.max ?? '…'}.`);
          const has = v !== undefined && !(Array.isArray(v) && !v.length); if (has) inst[sx.id] = v; else if (sx.required) errs.push(`${x.label} #${pos + 1}: "${sx.label}" is required.`); });
        if (Object.keys(inst).length) arr.push(inst); });
      if (arr.length) values[x.id] = arr; continue;
    }
    const v = readOneValue(form, x, '');
    if ((x.type === 'number' || x.type === 'decimal') && v != null && ((x.min != null && v < x.min) || (x.max != null && v > x.max))) errs.push(`"${x.label}" must be between ${x.min ?? '…'} and ${x.max ?? '…'}.`);
    const has = v !== undefined && !(Array.isArray(v) && !v.length); if (has) values[x.id] = v; else if (x.required) errs.push(`"${x.label}" is required.`);
    if (has && x.constraint) { const refV = values[x.constraint.fieldId]; const refField = fields.find((y) => y.id === x.constraint.fieldId); if (refV !== undefined && !compareOrdered(x.type, x.constraint.op, v, refV)) errs.push(`"${x.label}" ${CONSTRAINT_OPS.find(([op]) => op === x.constraint.op)[1]} "${refField ? refField.label : 'that question'}".`); }
  }
  return { values, errs, visible };
}
// one repeat instance's own question set, namespaced so several instances (and several repeat
// groups) never collide on input name - k is a stable id assigned once at creation, never reused,
// so removing an instance can't make a later readValues() call pick up the wrong DOM node
function repeatInstance(x, k, val) {
  return `<div class="repeat-item" data-ri="${k}"><div class="row"><b>#${k + 1}</b><span class="sp"></span><button type="button" class="btn s r" data-act="delRepeatItem" data-rid="${esc(x.id)}" data-ri="${k}">Remove</button></div>
  <div class="fg">${x.fields.map((sx) => fieldInput(sx, val ? val[sx.id] : undefined, x.id + '__' + k + '__')).join('')}</div></div>`;
}
function repeatBlock(x, vals) {
  const count = vals && vals.length ? vals.length : 1;
  let items = ''; for (let k = 0; k < count; k++) items += repeatInstance(x, k, vals && vals[k]);
  return `<div class="full repeatgrp"><h4>${esc(x.label)}</h4><div class="repeat-items" id="rg_${esc(x.id)}" data-next="${count}">${items}</div><button type="button" class="btn s" data-act="addRepeatItem" data-rid="${esc(x.id)}">＋ Add another</button></div>`;
}
let FILL_FORM = null; // the form currently open in openFill(), so ACT.addRepeatItem can find a repeat's own question list
ACT.addRepeatItem = ({ rid }) => { const x = FILL_FORM && FILL_FORM.fields.find((y) => y.id === rid); const grp = $('#rg_' + rid); if (!x || !grp) return; const k = +grp.dataset.next; grp.dataset.next = k + 1; grp.insertAdjacentHTML('beforeend', repeatInstance(x, k, undefined)); };
ACT.delRepeatItem = ({ rid, ri }) => { const grp = $('#rg_' + rid); if (!grp) return; if (grp.children.length <= 1) return toast('A repeat group needs at least one entry.', true); const item = grp.querySelector(`.repeat-item[data-ri="${ri}"]`); if (item) item.remove(); };
VIEWS.collect = () => {
  const forms = DB.forms.filter((f) => f.status === 'PUBLISHED'); const drafts = S.subsOf(SESSION.id).filter((s) => s.status === 'DRAFT' || s.status === 'RETURNED').sort((a, b) => b.at - a.at);
  return `${drafts.length ? `<div class="card"><h3>✏️ Continue or correct (${drafts.length})</h3>${drafts.map((s) => `<div class="row li"><div class="sp"><b>${esc((S.form(s.formId) || {}).name || 'Form')}</b><div class="muted sm">${s.status === 'RETURNED' ? '↩️ Returned by your supervisor: ' + esc((s.review || {}).note || 'please correct') : 'Draft · ' + ago(s.at)}</div></div><button class="btn s p" data-act="editSub" data-id="${esc(s.id)}">Open</button></div>`).join('')}</div>` : ''}
  <div class="grid g2 ${drafts.length ? 'mt' : ''}">${forms.map((f) => `<div class="card"><div class="row"><b class="sp">${esc(f.name)}</b></div><div class="muted sm" style="margin:4px 0 8px">${esc((S.project(f.projectId) || {}).name || 'General')} · ${f.fields.filter((x) => x.type !== 'note').length} questions · you sent ${S.subsOfForm(f.id).filter((s) => s.memberId === SESSION.id && s.status !== 'DRAFT').length}</div><p class="muted sm">${esc(f.description || '')}</p><button class="btn p" data-act="fillForm" data-id="${esc(f.id)}" style="margin-top:8px">✍️ Start a new one</button></div>`).join('') || `<div class="full">${empty('📝', 'No forms available', 'Your manager has not published a form yet.')}</div>`}</div>`;
};
ACT.fillForm = ({ id }) => openFill(S.form(id), null);
ACT.editSub = ({ id }) => { const s = DB.submissions.find((x) => x.id === id); if (s) openFill(S.form(s.formId), s); };
function openFill(f, existing) {
  if (!f) return toast('That form is no longer available.', true); if (!guard(can.collect(), 'Viewers cannot fill forms.')) return;
  const initVals = existing ? existing.values : {};
  // a previous modal's GPS map instances are tied to DOM nodes the next modal() call will replace -
  // drop them so a same-named field in the new modal gets a fresh map instead of a detached one
  f.fields.forEach((x) => { if (x.type === 'gps' && GPS_MAPS['f_' + x.id]) { try { GPS_MAPS['f_' + x.id].map.remove(); } catch (e) { /* already gone */ } delete GPS_MAPS['f_' + x.id]; } });
  FILL_FORM = f;
  modal({ title: esc(f.name), wide: true, cancel: 'Cancel', submit: 'Submit', body: `<p class="muted">${esc(f.description || '')}</p>${existing && existing.review && existing.review.note && existing.status === 'RETURNED' ? `<div class="alert bad"><span>↩️</span><span><b>Returned:</b> ${esc(existing.review.note)}</span></div>` : ''}<div class="fg">${f.fields.map((x) => `<div data-fid="${esc(x.id)}" style="display:${fieldVisible(x, initVals) ? 'contents' : 'none'}">${x.type === 'repeat' ? repeatBlock(x, existing ? existing.values[x.id] : undefined) : fieldInput(x, existing ? existing.values[x.id] : undefined)}</div>`).join('')}</div>`,
    footer: `<button type="button" class="btn" data-act="saveDraft" data-form="${esc(f.id)}" data-sub="${esc(existing ? existing.id : '')}">💾 Save draft</button>`,
    // re-run on every keystroke/change (modal()'s onInput hook, also called once immediately) so a
    // hidden question never blocks submit and a shown one always reflects the latest earlier answers
    // toggling display alone is not enough: a hidden field's <input required> still blocks native
    // HTML5 form validation on submit (browsers check the control's own computed display, not
    // whether an ancestor is display:none) - so required has to come off while it's hidden too
    onInput: (v, form) => { const { visible } = readValues(form, f.fields); f.fields.forEach((x) => { const el = form.querySelector(`[data-fid="${esc(x.id)}"]`); if (!el) return; const show = visible.has(x.id); el.style.display = show ? 'contents' : 'none';
      el.querySelectorAll('[required],[data-was-required]').forEach((inp) => { if (show) { if (inp.dataset.wasRequired) { inp.required = true; delete inp.dataset.wasRequired; } } else if (inp.required) { inp.required = false; inp.dataset.wasRequired = '1'; } }); }); },
    onSubmit: (v, form) => { const { values, errs } = readValues(form, f.fields); if (errs.length) { toast(errs[0], true); return false; } saveSubmission(f, existing, values, 'SUBMITTED'); } });
  if (existing) f.fields.forEach((x) => { const v = x.type === 'gps' && existing.values[x.id]; if (v) updateGpsMap('f_' + x.id, v.lat, v.lng); });
}
ACT.saveDraft = ({ form, sub }) => { const f = S.form(form); const existing = sub ? DB.submissions.find((x) => x.id === sub) : null; const { values } = readValues($('#mform'), f.fields); if (!Object.keys(values).length) return toast('Nothing to save yet.', true); saveSubmission(f, existing, values, 'DRAFT'); closeModal(); };
function saveSubmission(f, existing, values, status) {
  const g = Object.values(values).find((v) => v && typeof v === 'object' && !Array.isArray(v) && v.lat != null) || null; const now = Date.now();
  if (existing) { Object.assign(existing, { values, status, gps: g, updatedAt: now, review: status === 'SUBMITTED' ? null : existing.review }); if (status === 'SUBMITTED') existing.at = now; }
  else DB.submissions.push({ id: uid(), formId: f.id, projectId: f.projectId || null, memberId: SESSION.id, status, at: now, updatedAt: now, values, gps: g, review: null, ver: f.version || 1 });
  audit(status === 'DRAFT' ? 'Draft saved' : 'Form submitted', f.name); commit(); refresh(); toast(status === 'DRAFT' ? 'Draft saved on this device' : 'Submitted. It syncs when you are online.');
}

/* ---------- submissions ---------- */
const subValue = (x, v) => { if (v == null) return '—'; if (x.type === 'repeat') return Array.isArray(v) ? `${v.length} entr${v.length === 1 ? 'y' : 'ies'}` : '—'; if (x.type === 'yesno') return v ? 'Yes' : 'No'; if (Array.isArray(v)) return v.join(', '); if (x.type === 'gps') return `${v.lat}, ${v.lng}`; if (x.type === 'photo') return '📷 photo'; if (x.type === 'audio') return '🎙️ recording'; return String(v); };
VIEWS.submissions = () => {
  const mineOnly = role() === 'AGENT'; const st = VS.tab.subs || 'ALL'; const q = (VS.q.subs || '').toLowerCase(); const ff = VS.sel.subForm || ''; const af = VS.sel.subAgent || '';
  let list = DB.submissions.filter((s) => (!mineOnly || s.memberId === SESSION.id)); if (role() === 'VIEWER') list = list.filter((s) => s.status === 'APPROVED');
  if (st !== 'ALL') list = list.filter((s) => s.status === st); if (ff) list = list.filter((s) => s.formId === ff); if (af) list = list.filter((s) => s.memberId === af);
  list = list.filter((s) => (((S.form(s.formId) || {}).name || '') + ' ' + S.name(s.memberId) + ' ' + JSON.stringify(s.values)).toLowerCase().includes(q)).sort((a, b) => b.at - a.at);
  const all = DB.submissions.filter((s) => !mineOnly || s.memberId === SESSION.id); const c = (k) => all.filter((s) => s.status === k).length;
  const tabs = [['ALL', `All ${all.length}`], ['SUBMITTED', `Submitted ${c('SUBMITTED')}`], ['APPROVED', `Approved ${c('APPROVED')}`], ['RETURNED', `Returned ${c('RETURNED')}`], ['REJECTED', `Rejected ${c('REJECTED')}`], ['DRAFT', `Drafts ${c('DRAFT')}`]];
  return `<div class="bar row wrap">${searchBox('subs', 'Search responses')}<select data-sel="subForm" aria-label="Form"><option value="">All forms</option>${DB.forms.map((f) => `<option value="${esc(f.id)}" ${ff === f.id ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}</select>${can.seeAll() ? `<select data-sel="subAgent" aria-label="Person"><option value="">Everyone</option>${DB.members.filter((m) => m.role !== 'VIEWER').map((m) => `<option value="${esc(m.id)}" ${af === m.id ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}</select>` : ''}<span class="sp"></span>${can.seeAll() ? '<button class="btn" data-act="exportAll">⬇ Export all (CSV)</button>' : ''}</div>
  ${role() === 'VIEWER' ? '' : `<div class="mt">${tabsBar('subs', tabs, st)}</div>`}
  <div class="card mt tw"><table><thead><tr><th>Form</th>${mineOnly ? '' : '<th>Collected by</th>'}<th>When</th><th>Status</th><th>Location</th><th></th></tr></thead><tbody>${list.slice(0, 300).map((s) => `<tr><td><b>${esc((S.form(s.formId) || {}).name || 'Form')}</b><div class="muted sm">${esc(firstAnswer(s))}</div></td>${mineOnly ? '' : `<td>${esc(S.name(s.memberId))}</td>`}<td>${fdt(s.at)}</td><td>${stPill('submission', s.status)}</td><td>${s.gps ? `<a href="${mapLink(s.gps)}" target="_blank" rel="noopener">📍 map</a>` : '—'}</td><td class="r"><button class="btn s" data-act="openSub" data-id="${esc(s.id)}">Open</button></td></tr>`).join('') || `<tr><td colspan="6">${empty('📥', 'Nothing here yet')}</td></tr>`}</tbody></table>${list.length > 300 ? `<div class="muted sm" style="padding:10px">Showing the newest 300 of ${list.length}. Use the filters or export to see the rest.</div>` : ''}</div>`;
};
const firstAnswer = (s) => { const f = S.form(s.formId); if (!f) return ''; const x = f.fields.find((y) => y.type === 'text' || y.type === 'choice'); return x && s.values[x.id] != null ? `${x.label}: ${s.values[x.id]}` : ''; };
document.addEventListener('change', (e) => { const el = e.target.closest && e.target.closest('[data-sel]'); if (!el) return; VS.sel[el.dataset.sel] = el.value; render(); });
ACT.openSub = ({ id }) => {
  const s = DB.submissions.find((x) => x.id === id); if (!s) return; const f = S.form(s.formId) || { name: 'Form', fields: [] }; const leader = can.review(); const own = s.memberId === SESSION.id;
  modal({ title: esc(f.name), wide: true, cancel: 'Close', submit: leader && s.status !== 'DRAFT' ? 'Save decision' : 'Close', onSubmit: leader && s.status !== 'DRAFT' ? (v) => { const prev = s.status; s.status = v.decision; s.review = { by: SESSION.id, at: Date.now(), note: (v.note || '').trim() }; s.updatedAt = Date.now(); s.seen = false; if (prev !== s.status) audit('Submission ' + STATUS.submission[s.status].toLowerCase(), `${f.name} by ${S.name(s.memberId)}`); commit(); refresh(); toast('Decision saved'); } : null,
    body: `<div class="row wrap" style="gap:12px"><div class="row">${avatar(S.name(s.memberId), 34)}<div><b>${esc(S.name(s.memberId))}</b><div class="muted sm">${fdt(s.at)}</div></div></div><span class="sp"></span>${stPill('submission', s.status)}</div>
    <div class="list mt">${f.fields.filter((x) => x.type !== 'note' && x.type !== 'photo' && x.type !== 'audio' && fieldVisible(x, s.values)).map((x) => `<div class="row li"><span class="muted" style="flex:0 0 42%">${esc(x.label)}</span><b class="sp">${esc(subValue(x, s.values[x.id]))}</b></div>`).join('')}</div>
    ${f.fields.filter((x) => x.type === 'photo' && s.values[x.id]).map((x) => `<h4 class="mt">${esc(x.label)}</h4><img class="subphoto" src="${esc(s.values[x.id])}" alt="${esc(x.label)}">`).join('')}
    ${f.fields.filter((x) => x.type === 'audio' && s.values[x.id]).map((x) => `<h4 class="mt">${esc(x.label)}</h4><audio controls src="${esc(s.values[x.id])}"></audio>`).join('')}
    ${s.gps ? `<div class="alert mt"><span>📍</span><span>${s.gps.lat}, ${s.gps.lng}${s.gps.acc ? ` (±${s.gps.acc} m)` : ''} · <a href="${mapLink(s.gps)}" target="_blank" rel="noopener">Open in OpenStreetMap</a></span></div>` : ''}
    ${s.review && s.review.note ? `<div class="alert ${s.status === 'APPROVED' ? '' : 'bad'} mt"><span>💬</span><span><b>${esc(S.name(s.review.by))}:</b> ${esc(s.review.note)}</span></div>` : ''}
    ${leader && s.status !== 'DRAFT' ? `<h4 class="mt">Review</h4><div class="fg">${fld({ name: 'decision', label: 'Decision', options: [['SUBMITTED', 'Keep waiting'], ['APPROVED', 'Approve'], ['RETURNED', 'Return for correction'], ['REJECTED', 'Reject']], value: s.status })}${fld({ name: 'note', label: 'Note to the collector', type: 'textarea', full: true, rows: 2, value: (s.review && s.review.note) || '' })}</div>` : ''}`,
    footer: `${own && (s.status === 'DRAFT' || s.status === 'RETURNED' || s.status === 'SUBMITTED') ? `<button type="button" class="btn" data-act="editSub" data-id="${esc(s.id)}">✏️ Edit</button>` : ''}${can.manageWork() ? `<button type="button" class="btn r" data-act="deleteSub" data-id="${esc(s.id)}">Delete</button>` : ''}` });
  if (own && s.status === 'REJECTED' && !s.seen) { s.seen = true; Store.save(DB); }
};
ACT.deleteSub = ({ id }) => { if (!guard(can.manageWork())) return; confirmBox('Delete this response permanently?', () => { const s = DB.submissions.find((x) => x.id === id); DB.submissions = DB.submissions.filter((x) => x.id !== id); audit('Response deleted', s ? (S.form(s.formId) || {}).name : ''); commit(); refresh(); closeModal(); toast('Deleted'); }, 'Delete', true); };
function formRows(f) {
  const subs = S.subsOfForm(f.id).sort((a, b) => a.at - b.at);
  // the first repeat group gets flattened to one row per instance (standard ODK/XLSForm convention);
  // a second repeat group in the same form (rare) falls back to a plain entry-count column rather
  // than being silently dropped - full flattening of more than one repeat is out of scope for v1
  const repeatField = f.fields.find((x) => x.type === 'repeat');
  const plainCols = f.fields.filter((x) => x.type !== 'note' && x.type !== 'photo' && x.type !== 'audio' && x !== repeatField);
  const subCols = repeatField ? repeatField.fields.filter((sx) => sx.type !== 'note' && sx.type !== 'photo' && sx.type !== 'audio') : [];
  const header = ['Response ID', 'Collected by', 'Date', 'Status', ...plainCols.map((x) => x.label)];
  if (repeatField) header.push(`${repeatField.label} #`, ...subCols.map((sx) => `${repeatField.label}: ${sx.label}`));
  header.push('Latitude', 'Longitude', 'Review note');
  const rows = [header];
  subs.forEach((s) => {
    const base = [s.id, S.name(s.memberId), fdt(s.at), STATUS.submission[s.status] || s.status, ...plainCols.map((x) => subValue(x, s.values[x.id]).replace(/^—$/, ''))];
    const tail = [s.gps ? s.gps.lat : '', s.gps ? s.gps.lng : '', (s.review && s.review.note) || ''];
    if (!repeatField) { rows.push([...base, ...tail]); return; }
    const arr = s.values[repeatField.id] || [];
    if (!arr.length) rows.push([...base, '', ...subCols.map(() => ''), ...tail]);
    else arr.forEach((inst, idx) => rows.push([...base, String(idx + 1), ...subCols.map((sx) => subValue(sx, inst[sx.id]).replace(/^—$/, '')), ...tail]));
  });
  return rows;
}
ACT.exportForm = async ({ id }) => { const f = S.form(id); await exportCSV(`${f.name.replace(/[^\w]+/g, '-')}-responses.csv`, formRows(f)); toast('Exported'); };
ACT.exportAll = async () => { const rows = [['Form', 'Response ID', 'Collected by', 'Date', 'Status', 'Latitude', 'Longitude', 'Answers']]; DB.submissions.forEach((s) => { const f = S.form(s.formId); rows.push([f ? f.name : '', s.id, S.name(s.memberId), fdt(s.at), s.status, s.gps ? s.gps.lat : '', s.gps ? s.gps.lng : '', f ? f.fields.filter((x) => x.type !== 'note' && x.type !== 'photo' && x.type !== 'audio').map((x) => `${x.label}: ${subValue(x, s.values[x.id])}`).join(' | ') : '']); }); await exportCSV('all-responses.csv', rows); toast('Exported'); };
ACT.formResponses = ({ id }) => { VS.sel.subForm = id; VS.tab.subs = 'ALL'; ACT.go({ r: 'submissions' }); };
ACT.formSummary = ({ id }) => {
  const f = S.form(id); const subs = S.subsOfForm(id).filter((s) => s.status !== 'DRAFT' && s.status !== 'REJECTED');
  const parts = f.fields.filter((x) => ['choice', 'multi', 'yesno', 'rating', 'number'].includes(x.type)).map((x) => {
    const vals = subs.map((s) => s.values[x.id]).filter((v) => v != null); if (!vals.length) return '';
    if (x.type === 'number') { const n = vals.map(Number); return `<div class="li"><b>${esc(x.label)}</b><div class="muted">Average ${(n.reduce((a, b) => a + b, 0) / n.length).toFixed(1)} · min ${Math.min(...n)} · max ${Math.max(...n)} · n=${n.length}</div></div>`; }
    const cnt = {}; vals.forEach((v) => (Array.isArray(v) ? v : [x.type === 'yesno' ? (v ? 'Yes' : 'No') : String(v)]).forEach((k) => { cnt[k] = (cnt[k] || 0) + 1; }));
    return `<div class="li"><b>${esc(x.label)}</b> <span class="muted sm">n=${vals.length}</span>${Charts.hbars(Object.entries(cnt).sort((a, b) => b[1] - a[1]).map(([l, v]) => ({ l, v })))}</div>`; }).join('');
  modal({ title: 'Summary: ' + esc(f.name), wide: true, cancel: 'Close', body: `<p class="muted">${subs.length} valid response${subs.length === 1 ? '' : 's'} (drafts and rejected ones are left out).</p>${parts || empty('📊', 'No answers to summarise yet')}` });
};

/* ---------- attendance ---------- */
VIEWS.attendance = () => role() === 'AGENT' || !can.seeAll() ? myAttendance() : teamAttendance();
function myAttendance() {
  const me = SESSION.id; const inn = S.checkedIn(me); const hist = DB.checkins.filter((c) => c.memberId === me).sort((a, b) => b.at - a.at);
  const days = {}; hist.forEach((c) => { const d = dayStart(c.at); (days[d] = days[d] || []).push(c); });
  return `<div class="hero"><div><div class="l">${fdate(Date.now(), { weekday: 'long', day: 'numeric', month: 'long' })}</div><div class="big">${inn ? 'In the field' : 'Not checked in'}</div><div class="l">${inn ? 'Since ' + ftime(S.todayCheckin(me).at) : 'Check in when you start work'}</div></div><div class="acts"><button class="btn gold big" data-act="checkIn">${inn ? '🏁 Check out' : '📍 Check in now'}</button></div></div>
  <div class="card mt"><h3>Recent days</h3>${Object.keys(days).length ? Object.entries(days).sort((a, b) => b[0] - a[0]).slice(0, 14).map(([d, cs]) => { const i = cs.filter((c) => c.type === 'IN').sort((a, b) => a.at - b.at)[0]; const o = cs.filter((c) => c.type === 'OUT').sort((a, b) => b.at - a.at)[0]; return `<div class="row li"><b class="sp">${fdate(+d, { weekday: 'short', day: 'numeric', month: 'short' })}</b><span>${i ? '🟢 ' + ftime(i.at) : ''}</span><span>${o ? '🔴 ' + ftime(o.at) : ''}</span><span class="muted">${i && o ? ((o.at - i.at) / 3600000).toFixed(1) + ' h' : ''}</span></div>`; }).join('') : empty('📍', 'No check-ins yet')}</div>`;
}
function teamAttendance() {
  const days = lastDays(14).reverse(); const agents = DB.members.filter((m) => m.role === 'AGENT' || m.role === 'SUPERVISOR').filter((m) => m.status !== 'INACTIVE');
  const inToday = agents.filter((m) => S.checkedIn(m.id)).length;
  return `<div class="grid g4">${kpi('a', '🟢', 'In the field now', inToday, `of ${agents.length} people`)}${kpi('b', '📅', 'Average attendance', agents.length ? pct(agents.reduce((a, m) => a + S.daysPresent(m.id, 14), 0), agents.length * 12) + '%' : '—', 'last 14 days')}</div>
  <div class="bar row wrap mt"><span class="sp"></span><button class="btn" data-act="exportAttendance">⬇ Export (CSV)</button></div>
  <div class="card mt tw"><table><thead><tr><th>Person</th>${days.slice(0, 10).map((d) => `<th class="c">${new Date(d).getDate()}</th>`).join('')}<th class="r">Days (30)</th></tr></thead><tbody>${agents.map((m) => `<tr><td><b>${esc(m.name)}</b></td>${days.slice(0, 10).map((d) => { const c = DB.checkins.find((x) => x.memberId === m.id && x.type === 'IN' && dayStart(x.at) === d); return `<td class="c">${c ? '<span class="okdot" title="' + ftime(c.at) + '">●</span>' : '<span class="muted">·</span>'}</td>`; }).join('')}<td class="r">${S.daysPresent(m.id)}</td></tr>`).join('') || `<tr><td colspan="12">${empty('📍', 'No field team yet')}</td></tr>`}</tbody></table></div>`;
}
ACT.exportAttendance = async () => { await exportCSV('attendance.csv', [['Person', 'Type', 'Date', 'Time', 'Latitude', 'Longitude'], ...DB.checkins.slice().sort((a, b) => a.at - b.at).map((c) => [S.name(c.memberId), c.type, fdate(c.at), ftime(c.at), c.gps ? c.gps.lat : '', c.gps ? c.gps.lng : ''])]); toast('Exported'); };
ACT.checkIn = async () => {
  if (!guard(can.checkin())) return; const me = SESSION.id; const type = S.checkedIn(me) ? 'OUT' : 'IN'; toast('Getting your location…'); let g = null;
  try { g = await getPosition(); } catch (e) { toast(e.message + ' Checking in without a location.', true); }
  DB.checkins.push({ id: uid(), memberId: me, type, at: Date.now(), gps: g, note: '' }); audit(type === 'IN' ? 'Checked in' : 'Checked out', g ? `${g.lat}, ${g.lng}` : 'no location'); commit(); refresh(); toast(type === 'IN' ? 'You are checked in. Have a good day!' : 'You are checked out. Thank you!');
};

/* ---------- field map ---------- */
VIEWS.map = () => {
  const ff = VS.sel.mapForm || ''; const mode = VS.tab.map || 'SUBS';
  let pts = [];
  if (mode === 'SUBS') pts = DB.submissions.filter((s) => s.gps && s.status !== 'DRAFT' && (role() !== 'VIEWER' || s.status === 'APPROVED') && (!ff || s.formId === ff)).map((s) => ({ lat: s.gps.lat, lng: s.gps.lng, l: `${S.name(s.memberId)} · ${(S.form(s.formId) || {}).name || ''} · ${fdt(s.at)}`, c: s.status === 'APPROVED' ? '#1a9f6e' : s.status === 'REJECTED' ? '#d64545' : '#f5a623', s }));
  else pts = DB.checkins.filter((c) => c.gps && c.type === 'IN' && c.at >= Date.now() - 7 * DAY).map((c) => ({ lat: c.gps.lat, lng: c.gps.lng, l: `${S.name(c.memberId)} · check-in ${fdt(c.at)}`, c: '#0f8a8f', s: c }));
  return `<div class="bar row wrap">${tabsBar('map', [['SUBS', 'Collected data'], ...(can.seeAll() ? [['CHK', 'Check-ins (7 days)']] : [])], mode)}${mode === 'SUBS' ? `<select data-sel="mapForm" aria-label="Form"><option value="">All forms</option>${DB.forms.map((f) => `<option value="${esc(f.id)}" ${ff === f.id ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}</select>` : ''}<span class="sp"></span><span class="muted sm">${pts.length} point${pts.length === 1 ? '' : 's'}</span></div>
  <div class="card mt">${Charts.scatter(pts, 340)}${mode === 'SUBS' ? '<div class="legend inline"><div><i style="background:#1a9f6e"></i>Approved</div><div><i style="background:#f5a623"></i>Waiting</div><div><i style="background:#d64545"></i>Rejected</div></div>' : ''}<p class="muted sm">This plot works with no internet. Use the links below to see any point on a street map.</p></div>
  <div class="card mt tw"><table><thead><tr><th>Point</th><th>Coordinates</th><th></th></tr></thead><tbody>${pts.slice(0, 60).map((p) => `<tr><td>${esc(p.l)}</td><td>${p.lat}, ${p.lng}</td><td class="r"><a class="btn s" href="${mapLink(p)}" target="_blank" rel="noopener">Open map</a></td></tr>`).join('') || `<tr><td colspan="3">${empty('🗺️', 'No GPS points yet')}</td></tr>`}</tbody></table></div>`;
};
