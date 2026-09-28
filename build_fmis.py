# FMIS (Field Management Information System) landing page. Executed at the end of build3.py (shares its names).
_fm_topic = _up.quote("FMIS field management system enquiry")
_fm_facts = ["Forms with GPS and photos", "Skip logic and repeat groups", "Tasks, check-ins and reports", "Five roles, one workspace", "Works offline, syncs online",
             "Web, Windows and Android", "For institutions, teams and individuals"]
_fm_items = "".join(f'<span class="tk"><b>{i + 1:02d}</b> {esc(t)}</span>' for i, t in enumerate(_fm_facts))
_fm_ticker = f'<div class="ticker-strip"><div class="ticker" aria-hidden="true"><div class="ticker-track">{_fm_items}{_fm_items}</div></div></div>'

FM_TOUR = [
 ("fmis-d-dashboard", "Dashboard", "Submissions this week, team in the field, overdue tasks and the review queue, all on one screen.", ["Live numbers for the whole programme", "Charts of daily submissions and review status", "Top performing field agents"]),
 ("fmis-d-builder", "Build your own forms", "Design a data collection form with 16 question types, skip logic to show a question only when it is relevant, repeat groups for lists like household members, and validation rules such as an end date after a start date.", ["16 question types, including barcode/QR and audio", "Skip logic, repeat groups and cross-question validation", "Publish when it is ready"]),
 ("fmis-d-submissions", "Collected data", "Every response in one list with who collected it, when, where and whether it was reviewed.", ["Search and filter by form or person", "Approve, return for correction or reject", "Export everything to Excel (CSV)"]),
 ("fmis-d-review", "Review with the full picture", "A supervisor sees every answer, the photo and the GPS point, and replies to the collector with a note.", ["GPS point with a map link", "Photo evidence", "Note back to the field agent"]),
 ("fmis-d-tasks", "Tasks and follow-up", "Assign work to people, set due dates and priorities, and see what is late.", ["Overdue tasks flagged", "Progress and notes from the field", "Linked to projects"]),
 ("fmis-d-map", "Field map", "See where data was collected and where the team checked in. Capturing a GPS point on a form also shows the real Rwanda sector it falls in, so a collector can confirm their location on the spot.", ["Points coloured by review status", "Real Rwanda sector boundaries on GPS capture", "Open any point on a street map"]),
 ("fmis-d-performance", "Performance", "A fair score for each field agent from quality, output, task completion and attendance.", ["Leaderboard", "Certificates for training and good work", "Export to CSV"]),
 ("fmis-d-reports", "Reports", "Choose a period and a project and print a summary report, or save it as a PDF.", ["Submissions by person and day", "Approval rate and progress", "Ready for donors and partners"]),
]
_fm_slides = "".join(f'''<div class="slide" data-i="{i}" data-title="{esc(t)}"><div class="slide-shot">{win("assets/fmis-shots/" + img + ".jpg", t, title="FMIS", w=2160, h=1350, logo="assets/fmis-96.png")}</div><div class="slide-text"><span class="step-no">Screen {i + 1} of {len(FM_TOUR)}</span><h3>{esc(t)}</h3><p>{esc(d)}</p><ul class="checklist">{"".join(f"<li>{esc(x)}</li>" for x in pts)}</ul></div></div>''' for i, (img, t, d, pts) in enumerate(FM_TOUR))
_fm_thumbs = "".join(f'<button class="tthumb" data-go="{i}"><span>{i + 1}</span>{esc(t)}</button>' for i, (img, t, d, pts) in enumerate(FM_TOUR))


def _fm_phone(img, alt):
    return f'<div class="phone"><img src="assets/fmis-shots/{img}.jpg" alt="{alt} on a phone" width="824" height="1720" loading="lazy"></div>'


fm = hero_page("Field management", "FMIS", "Field Management Information System: collect data, manage your team, follow progress and report, in the field and at the office.") + _fm_ticker + f'''
<section class="section"><div class="container">
<div class="grid g4">
<div class="tile navy rv"><b data-count="16">16</b><span>Question types for your forms</span></div>
<div class="tile sky rv"><b data-count="5">5</b><span>Roles: Admin, Manager, Supervisor, Field agent, Viewer</span></div>
<div class="tile navy rv"><b data-count="3">3</b><span>Web, Windows and Android</span></div>
<div class="tile sky rv"><b data-count="0">0</b><span>Internet needed to collect data</span></div>
</div></div></section>
<section class="section"><div class="container split" style="align-items:start">
<div><div class="kicker">Try it now</div><h2>One workspace for your whole field team</h2>
<p>FMIS is for any institution, project or individual that collects data and manages people in the field: surveys, monitoring, inspections, programme delivery and reporting. Everything works on the device with no internet. When you turn on cloud sync, the team shares one workspace and reports arrive as soon as a phone is online.</p>
<ol class="next"><li>Press <b>Open the web app</b> and choose <b>Explore with demo data</b>, or <b>Create a workspace</b>.</li><li>Sign in as any person in the demo. The PIN is <b>1234</b>.</li><li>Look at the forms, submissions, tasks, map and reports.</li><li>To use it for real, create your workspace, add your team and turn on cloud sync.</li></ol>
<p style="margin-top:1.2rem"><a class="btn btn-gold" href="fmis/">Open the web app</a> <a class="btn btn-outline" href="assets/downloads/FMIS-Android-1.0.0.apk" download>Android app (APK)</a> <a class="btn btn-outline" href="{R2_BASE}/FMIS-Setup-1.0.0.exe" download>Windows installer</a> <a class="btn btn-outline" href="assets/brochures/FMIS-guide.pdf" download>Guide (PDF)</a></p></div>
<div class="grid" style="gap:1rem">
<img src="assets/fmis-192.png" alt="FMIS logo" width="180" height="180" style="width:min(180px,55%);height:auto;margin:0 auto .4rem;display:block;filter:drop-shadow(0 12px 24px rgba(6,48,122,.25))">
<div class="card">{ico("target")}<h3>Demo workspace</h3><p>A household survey team with 11 people, forms, tasks, GPS points and reports, so you can try every screen and every role.</p></div>
<div class="card">{ico("shield")}<h3>Your own workspace</h3><p>Create it in two minutes. You are the Admin: add people, build forms, and invite your team by code.</p></div>
</div></div></section>
<section class="section sky"><div class="container tour" data-tour>
<div class="section-head"><div><div class="kicker">See it for yourself</div><h2>Screen by screen</h2></div><p>Real screens from the web app, using the demo workspace. Click a screenshot to enlarge it.</p></div>
<div class="tour-bar"><div class="tour-progress"><i></i></div><div class="tour-ctrl"><button class="btn btn-outline btn-sm" data-prev>&larr; Back</button><button class="btn btn-primary btn-sm" data-next>Next &rarr;</button><button class="btn btn-outline btn-sm" data-play aria-pressed="false">Play</button></div></div>
<div class="tour-stage">{_fm_slides}</div>
<div class="tour-thumbs">{_fm_thumbs}</div>
<p class="tiny-note">Tip: use the left and right arrow keys.</p>
</div></section>
<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">In the field</div><h2>Built for the phone in your hand</h2></div><p>Field agents collect data, check in with GPS, update tasks and message the team from a phone. Everything is saved on the phone first.</p></div>
<div class="phones" style="grid-template-columns:repeat(3,1fr);max-width:700px;margin:0 auto">{_fm_phone("fmis-m-dashboard", "Field agent dashboard")}{_fm_phone("fmis-m-fill", "Filling a form")}{_fm_phone("fmis-m-attendance", "Check in")}</div>
</div></section>
<section class="section soft"><div class="container"><div class="section-head"><div><div class="kicker">What is inside</div><h2>Everything a field programme needs</h2></div><p>The same features on the web, on Windows and on Android.</p></div>
<div class="grid g3">
<div class="card">{ico("edit")}<h3>16 question types</h3><p>Short and long text, number, decimal, date, time, date and time, single and multiple choice, yes/no, rating, GPS, photo, audio recording, barcode/QR code and phone number, plus notes.</p></div>
<div class="card">{ico("code")}<h3>Skip logic and validation</h3><p>Show a question only when an earlier answer matches a condition, and require answers to compare correctly against each other, for example an end date after a start date.</p></div>
<div class="card">{ico("database")}<h3>Repeat groups</h3><p>Collect a repeatable list inside one form, such as one entry per household member or asset, with add and remove on the fill screen and one row per entry in the export.</p></div>
<div class="card">{ico("pin")}<h3>GPS check-in and field map</h3><p>Field agents check in and out, and every submission can carry a GPS point shown against the real Rwanda sector it falls in. See every point on a map that works offline.</p></div>
<div class="card">{ico("target")}<h3>Tasks and projects</h3><p>Group work into projects with targets, assign tasks, set due dates and follow progress from the field.</p></div>
<div class="card">{ico("shield")}<h3>Review and quality</h3><p>Supervisors approve, return for correction or reject each submission with a note. Approved data is locked.</p></div>
<div class="card">{ico("users")}<h3>Team and roles</h3><p>Add people by hand or import a CSV list. Five roles decide who can see and do what.</p></div>
<div class="card">{ico("book")}<h3>Reports and exports</h3><p>Print or save summary reports as PDF, and export responses, attendance, performance and the team list to Excel.</p></div>
<div class="card">{ico("chart")}<h3>Performance and certificates</h3><p>A score for each field agent, and printable certificates for training and good work.</p></div>
<div class="card">{ico("phone")}<h3>Messages and announcements</h3><p>Team-wide announcements, project chats and direct messages, so questions get answered in the app.</p></div>
<div class="card">{ico("cloud")}<h3>Cloud sync</h3><p>Turn it on and every device shares one workspace. It still works with no signal and catches up when the phone is online.</p></div>
</div></div></section>
<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">Five roles</div><h2>Everyone sees what they should</h2></div><p>Access is enforced on the server as well as in the app.</p></div>
<div class="scroll-x"><table class="cmp" style="width:100%"><tr><th>Role</th><th>What they do</th><th>What they see</th></tr>
<tr><td>Admin</td><td>Owns the workspace, manages the team, settings, projects and forms</td><td>Everything</td></tr>
<tr><td>Manager</td><td>Runs projects and the team, builds forms, reviews work</td><td>Everything except the Admin's settings</td></tr>
<tr><td>Supervisor</td><td>Assigns tasks, reviews submissions and reports</td><td>All field work of the team</td></tr>
<tr><td>Field agent</td><td>Collects data, checks in, sends reports, updates own tasks</td><td>Own work, published forms, team chat</td></tr>
<tr><td>Viewer</td><td>Read only, for funders and partners</td><td>Projects, tasks and approved data</td></tr></table></div></div></section>
<section class="section soft"><div class="container split" style="align-items:start"><div><div class="kicker">How the team connects</div><h2>From one device to the whole team</h2>
<ol class="next"><li>The Admin creates the workspace and adds the team.</li><li>In <b>Settings</b> the Admin signs in to a cloud account and turns on <b>cloud sync</b>.</li><li>The Admin presses <b>Invite someone</b> and sends each person a one-time code by WhatsApp or SMS.</li><li>Each person opens FMIS on their phone or computer, chooses <b>Join a workspace online</b> and enters the code, their phone number and a PIN.</li><li>From then on, submissions, tasks, messages and reports travel between devices. Each role receives only what it may see.</li></ol></div>
<div class="grid" style="gap:1rem"><div class="card">{ico("lock")}<h3>Your data, your control</h3><p>Everything is saved on the device first. Backups are one button. The Admin can remove anyone's access at any time, and that person is cut off at once.</p></div><div class="card">{ico("wifi")}<h3>Works with poor networks</h3><p>Forms, GPS and photos work with no signal. Changes wait on the phone and are sent when it is online.</p></div></div></div></section>
<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">Who it is for</div><h2>Any organisation, any size, or just you</h2></div></div>
<div class="grid g3"><div class="card">{ico("buildings")}<h3>Institutions and NGOs</h3><p>Run baseline and endline surveys, monitoring visits and programme reporting across districts with one system.</p></div><div class="card">{ico("chalkboard")}<h3>Research and consulting firms</h3><p>Manage enumerators, review data quality the same day and give clients clean exports.</p></div><div class="card">{ico("bulb")}<h3>Individuals and small teams</h3><p>A single person can use FMIS as a personal field notebook with forms, tasks and reports, and add teammates later.</p></div></div></div></section>
<section class="section soft"><div class="container"><div class="section-head"><div><div class="kicker">Web, Windows and Android</div><h2>Which version suits you</h2></div></div>
<div class="scroll-x"><table class="cmp" style="width:100%"><tr><th></th><th>Web</th><th>Windows</th><th>Android</th></tr>
<tr><td>Needs installing</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>Works without internet</td><td>Keep the tab open</td><td>Yes</td><td>Yes</td></tr>
<tr><td>GPS, photos and audio</td><td>Yes, in a browser that allows it</td><td>Photos and audio from files, location typed in</td><td>Yes, GPS and camera</td></tr>
<tr><td>Barcode/QR field</td><td>Type or paste the code</td><td>Type or paste the code</td><td>Type or paste the code</td></tr>
<tr><td>Cloud sync between devices</td><td>Yes</td><td>Yes</td><td>Yes</td></tr><tr><td>PDF and Excel exports</td><td>Yes</td><td>Yes</td><td>Yes</td></tr></table></div>
<div class="callout-box"><b>Good to know.</b> Data lives on each device until you turn on cloud sync. Use the backup button in Settings to keep a copy. <a href="contact.html?topic={_fm_topic}#form">Ask us about training and setup</a>.</div></div></section>
<section class="section"><div class="container" style="max-width:820px"><div class="section-head"><div><div class="kicker">Questions</div><h2>Good to know</h2></div></div>
<details><summary>Do field agents need internet to collect data?</summary><p>No. Forms, GPS, photos, check-ins and tasks work with no connection. Everything is saved on the device and is sent when it goes online.</p></details>
<details><summary>Is our data safe?</summary><p>Data stays on your devices until you turn on cloud sync. With sync on, it travels over a secure connection, each person signs in with a phone number and PIN, and the server decides who can read or change what. Use a strong PIN and remove people who leave.</p></details>
<details><summary>Can I change the forms after people started collecting?</summary><p>Yes. Edit and publish the form again. Answers already collected stay as they are, and new answers follow the new questions.</p></details>
<details><summary>What is skip logic and how do repeat groups work?</summary><p>Skip logic shows a question only when an earlier answer matches a condition you set, so a form does not ask irrelevant questions. A repeat group lets one form collect a list, such as one entry per household member: the person filling it adds or removes entries, and the export gives one row per entry alongside the form's other answers.</p></details>
<details><summary>Can I scan a barcode?</summary><p>The barcode/QR field accepts a typed or pasted code today on every device. Camera scanning is being added to the Android app; until then, type or paste the code.</p></details>
<details><summary>What happens if two people edit at the same time?</summary><p>The most recent change wins for the same record. People collecting data each create their own records, so they never overwrite each other. Approved submissions are locked.</p></details>
<details><summary>Does it work in Kinyarwanda and French?</summary><p>The menus are available in English, French and Kinyarwanda. Your forms can be written in any language.</p></details>
<details><summary>Can we use it for a project with many teams?</summary><p>Yes. Create one workspace per project or per organisation, add managers and supervisors, and invite field agents with codes.</p></details>
</div></section>
<section class="section soft"><div class="container"><div class="reach"><div>
<div class="kicker">Ready when you are</div><h2>Start your workspace in two minutes</h2>
<p>Open the demo, look at every screen and every role, then create your own workspace.</p>
<div class="kg">{ico("shield")}<span>Free to try, <b>no sign up</b></span></div>
</div>
<div class="reach-actions">
<a class="btn btn-gold" href="fmis/">Open the web app</a>
<a class="btn btn-ghost-light" href="assets/downloads/FMIS-Android-1.0.0.apk" download>Android app (APK)</a>
<a class="btn btn-ghost-light" href="assets/brochures/FMIS-guide.pdf" download>Download the guide (PDF)</a>
</div></div></div></section>'''
add("field-management.html", "FMIS | Field Management Information System", "FMIS is a field management system for data collection, tasks, GPS check-in, reports and team management, with 16 question types, skip logic, repeat groups and validation rules. Works offline on Windows, Android and the web, with cloud sync for teams.", "products", fm,
    ld=ld_bc([("Home", ""), ("Products", "products.html"), ("FMIS", "field-management.html")]))
