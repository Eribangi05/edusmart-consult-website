# Third part of the site generator: trust pages, help centre and live status. Executed by build.py after build2.py (shares its names).

def wrap_sec(inner):
    return '<section class="section"><div class="container" style="max-width:780px">' + inner + '</div></section>'

TRUST = [
 ("terms.html", "Terms of use", "The terms for using this website and the EduSmart Consult products.", [
  ("Who we are", "EduSmart Consult LTD is a company based in Kigali, Rwanda. These terms cover this website, the Smart School App (Windows and Android) and Smart School Cloud."),
  ("Using the products", "Use the products for your school's teaching, learning and administration. Do not copy, resell or reverse engineer them, and do not use them to break the law or harm others."),
  ("Your school's data", "Your school owns its learner and staff records. We process them only to run the service you asked for. You can export your data at any time and ask us to delete your cloud records."),
  ("Availability", "The apps work offline by design. Smart School Cloud is provided with reasonable care but we cannot promise it will never be interrupted. Check the <a href=\"status.html\">status page</a> for the current state."),
  ("Content from other owners", "Books, exams and curriculum material shown in the apps belong to their owners and are used under the arrangements described with each partner. They are not ours to license to you separately."),
  ("Changes", "We may update these terms. Material changes will be announced on this website and in the app's what's new screen."),
  ("Contact", "Questions about these terms: <a data-email href=\"#\">email</a>.")]),
 ("licence-agreement.html", "Licence agreement", "What a school licence for Smart School App and Smart School Cloud includes.", [
  ("What you receive", "A licence lets one school use the Smart School App on its devices and, if it chooses, connect them to Smart School Cloud for that school. The dates, plan and learner limit are recorded on the licence we agree with you."),
  ("If a licence ends", "The apps keep working offline on your devices so lessons are never blocked. Cloud sync pauses after the grace period recorded on the licence, and resumes once it is renewed."),
  ("Devices", "You may install the apps on the devices your school controls. Each device joins the cloud with a one time code, and a school manager can remove a device at any time."),
  ("Support and updates", "Licensed schools receive app updates and help through the Support desk. Support hours and response times are as agreed in your licence."),
  ("Ending the agreement", "Either side may end the agreement as set out in your licence. On request we export your data and delete your cloud records."),
  ("Contact", "To arrange or renew a licence, use <a href=\"request.html\">Request a demo</a> or write to <a data-email href=\"#\">email</a>.")]),
 ("security.html", "Security", "How Smart School Cloud protects school records.", [
  ("Built to work offline first", "Records live on your own devices. The cloud is a shared copy that devices sync with, not the only copy."),
  ("Access", "Each device joins with a one time code and then holds its own key. Removing a device cuts off its access immediately. Web app users sign in with a role that limits what they can see."),
  ("Our staff", "Support staff see only what the support role needs. Sensitive actions, such as resetting a PIN, need the school's permission and are written to an audit trail. Staff accounts can use two step sign in."),
  ("In transit and at rest", "Connections use HTTPS. Passwords and keys are stored as one way hashes, never in plain text."),
  ("Backups", "The cloud database is backed up by our hosting provider and we can restore a school's records on request. Schools also keep their own backups on their devices."),
  ("Reporting a problem", "If you think you have found a security problem, write to <a data-email href=\"#\">email</a> with the details. We will reply within two working days.")]),
 ("child-safety.html", "Child safety", "How the products protect children who use them.", [
  ("Learners come first", "The Smart School App is used by children, so we collect only what a school needs to teach and report: names, class, results and attendance."),
  ("No advertising, no tracking", "The apps show no advertisements and do not track learners. Learner data is never sold or used for marketing."),
  ("Controlled access", "Learners see their own work. Teachers see their own classes and subjects. Only school managers see the whole school. Parent reports are printed or shown by the school."),
  ("Content", "Learning content is the curriculum material supplied with the app. There is no open chat and no way for strangers to contact a child through it."),
  ("Concerns", "If you have a concern about a child's safety in connection with our products, write to <a data-email href=\"#\">email</a> straight away. Concerns about a child's welfare should also go to the school's head teacher.")]),
]

for fname, title, desc, secs in TRUST:
    body = hero_page(title, title, desc) + wrap_sec("".join("<h3>%s</h3><p>%s</p>" % (h, t) for h, t in secs))
    add(fname, title + " | EduSmart Consult", desc, "", body)

# ---------------- Help centre
HELP = [
 ("Getting started", [
  ("How do I install the Smart School App?", "On Windows, download the installer from the <a href=\"downloads.html\">Downloads page</a> and run it. On Android, install the APK from the same page. The first time you open it, choose your school and set up staff."),
  ("Do I need the internet?", "No. Everything works offline. The internet is only used if your school turns on Smart School Cloud sync."),
  ("Which devices are supported?", "Windows 10 or 11 computers and Android phones and tablets. Both run the same app.")]),
 ("Smart School Cloud", [
  ("How do I connect a device to the cloud?", "A school manager opens Cloud sync in the app, or asks us for a join code. On the new device choose Join with a code and type it in. Codes work once per device and expire."),
  ("A device stopped syncing. What now?", "Open the sync card in the app. It says what is wrong: no internet, licence ended, device removed or app out of date. Fix that and tap Sync now."),
  ("How do I remove a lost device?", "A school manager can remove it from the school's device list. It loses access straight away.")]),
 ("Accounts and PINs", [
  ("I forgot the manager PIN.", "Contact the Support desk. With your school's permission we can set a temporary PIN that you must change at first sign in."),
  ("Can a parent see reports?", "Schools print or share parent reports from the app. Parents do not need an account.")]),
 ("Licences and support", [
  ("What happens when the licence ends?", "The apps keep working offline. Cloud sync pauses after the grace period until the licence is renewed."),
  ("How do I contact support?", "Use the <a href=\"contact.html\">Contact page</a> or <a href=\"request.html\">Request form</a>. We reply within two working days.")]),
]
hb = hero_page("Help centre", "Help centre", "Answers to common questions about the Smart School App and Smart School Cloud.")
hb += wrap_sec("".join("<h3>%s</h3>%s" % (g, "".join("<details><summary>%s</summary><p>%s</p></details>" % (q, a) for q, a in items)) for g, items in HELP)
               + '<p style="margin-top:24px">Still stuck? <a href="contact.html">Contact us</a>.</p>')
add("help.html", "Help centre | EduSmart Consult", "Answers to common questions about the Smart School App and Smart School Cloud.", "", hb)

# ---------------- Live status
sb = hero_page("Status", "Service status", "Live status of Smart School Cloud.") + wrap_sec('''
<div class="card" style="padding:20px"><h3 id="stHead">Checking...</h3><p id="stSub" class="muted"></p>
<ul id="stList" style="list-style:none;padding:0;margin:16px 0 0"></ul></div>
<p class="muted" style="margin-top:16px">The Smart School App itself works offline, so lessons continue even if the cloud is unavailable.</p>
<script>
(function(){var C=window.EDUSMART||{},b=(C.cloud&&C.cloud.baseUrl)||"";var h=document.getElementById("stHead"),s=document.getElementById("stSub"),l=document.getElementById("stList");
var names={sync:"Sync service",database:"Database",web_app:"Web app"};
function show(ok,j){h.textContent=ok?"All systems operational":"Some services are down";h.style.color=ok?"#1D7A47":"#c92a2a";
 s.textContent="Checked "+new Date().toLocaleTimeString();
 l.innerHTML=Object.keys(names).map(function(k){var v=j&&j.components&&j.components[k];return '<li style="padding:8px 0;border-top:1px solid #e3e8ef">'+names[k]+': <b style="color:'+(v==="operational"?"#1D7A47":"#c92a2a")+'">'+(v||"unknown")+'</b></li>';}).join("");}
if(!b){h.textContent="Status is not configured";return;}
h.textContent="Checking (the server may take up to a minute to wake)...";
var ctl=new AbortController();setTimeout(function(){ctl.abort();},70000);
fetch(b+"/v1/public/status",{signal:ctl.signal,cache:"no-store"}).then(function(r){return r.json().then(function(j){show(r.ok&&j.ok,j);});}).catch(function(){show(false,null);});})();
</script>''')
add("status.html", "Service status | EduSmart Consult", "Live status of Smart School Cloud.", "", sb)

# ---------------- Road code (Amategeko y'Umuhanda) web app landing page
import urllib.parse as _up
_topic = _up.quote("Amategeko y'Umuhanda unlock code enquiry")
rc = hero_page("Road code", "Amategeko y'Umuhanda", "Practise for the Rwanda provisional driving licence theory test, in Kinyarwanda, English or French.") + f'''
<section class="section"><div class="container split" style="align-items:start">
<div><div class="kicker">Try it now</div><h2>Open it in your browser</h2>
<p>No download and no sign up. Create a small profile with a name and a PIN, and start practising. Your results stay in your own browser.</p>
<ol class="next"><li>Press <b>Open the web app</b>.</li><li>Create your profile and choose your language.</li><li>Practise questions, learn the road signs and take a timed mock exam.</li><li>Press <b>Unlock full version</b> and type your code to get everything.</li></ol>
<p style="margin-top:1.2rem"><a class="btn btn-gold" href="amategeko/">Open the web app</a> <a class="btn btn-outline" href="contact.html?topic={_topic}#form">Ask for an unlock code</a> <a class="btn btn-outline" href="assets/brochures/Amategeko-Umuhanda-guide.pdf" download>Download the guide (PDF)</a></p></div>
<div class="grid" style="gap:1rem">
<img src="assets/amategeko-logo.png" alt="Amategeko y'Umuhanda logo" width="260" height="265" style="width:min(260px,70%);height:auto;margin:0 auto .4rem;display:block;filter:drop-shadow(0 12px 24px rgba(6,48,122,.25))">
<div class="card">{ico("target")}<h3>Free sample</h3><p>40 practice questions, 36 road signs, 15 glossary terms and a mock exam. Enough to see how it works.</p></div>
<div class="card">{ico("shield")}<h3>Full version</h3><p>All 328 questions, 126 road signs, 61 glossary terms, 8 lessons and the traffic law documents. Unlocked with a code from EduSmart Consult or your driving school.</p></div>
</div></div></section>
<section class="section sky"><div class="container"><div class="section-head"><div><div class="kicker">What is inside</div><h2>Everything a candidate needs to practise</h2></div><p>The same content as the Windows and Android apps.</p></div>
<div class="grid g3">
<div class="card">{ico("target")}<h3>Practice that finds your gaps</h3><p>Questions you get wrong come back first, with a short explanation after each answer.</p></div>
<div class="card">{ico("clock")}<h3>Timed mock exam</h3><p>20 questions in 20 minutes, marked out of 20, with a review of every answer at the end.</p></div>
<div class="card">{ico("pin")}<h3>Road signs</h3><p>Browse signs by family, search by name or code, and see what each one means.</p></div>
<div class="card">{ico("book")}<h3>Markings, lights and signals</h3><p>Road markings, traffic lights and police signals shown as clear pictures.</p></div>
<div class="card">{ico("edit")}<h3>Glossary and flashcards</h3><p>Learn the terms used in the road code and test yourself with flashcards.</p></div>
<div class="card">{ico("chart")}<h3>Your progress</h3><p>See how ready you are, which topics are weak and how your exam scores change.</p></div>
<div class="card">{ico("translate")}<h3>Three languages</h3><p>Kinyarwanda first, with English and French. Switch at any time.</p></div>
<div class="card">{ico("phone")}<h3>Made for phones</h3><p>Works on a phone, a tablet or a computer. Large answer buttons and a menu that stays out of the way.</p></div>
<div class="card">{ico("lock")}<h3>Your data stays with you</h3><p>Your profile and results are saved in your own browser. Nothing about your practice is sent to us.</p></div>
</div></div></section>
<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">Free and full</div><h2>What each version includes</h2></div></div>
<div class="scroll-x"><table class="cmp"><tr><th></th><th>Free sample</th><th>Full version</th></tr>
<tr><td>Practice questions</td><td>40</td><td>328</td></tr><tr><td>Road signs</td><td>36</td><td>126</td></tr><tr><td>Glossary terms</td><td>15</td><td>61</td></tr>
<tr><td>Lessons</td><td>2</td><td>8</td></tr><tr><td>Traffic law documents</td><td>Not included</td><td>Included</td></tr>
<tr><td>Timed mock exam</td><td>Yes</td><td>Yes</td></tr><tr><td>Progress and exam history</td><td>Yes</td><td>Yes</td></tr><tr><td>Kinyarwanda, English, French</td><td>Yes</td><td>Yes</td></tr></table></div>
<div class="callout-box"><b>Installed apps.</b> Amategeko y'Umuhanda is also available as a Windows program and an Android app that work fully offline, which suits driving schools with shared computers. <a href="contact.html?topic={_topic}#form">Ask about the installed apps</a>.</div></div></section>
<section class="section soft"><div class="container" style="max-width:820px"><div class="section-head"><div><div class="kicker">Questions</div><h2>Good to know</h2></div></div>
<details><summary>Do I need the internet?</summary><p>You need a connection to open the web app and to unlock the full version. After you unlock, the full content is kept in your browser and opens again without a connection.</p></details>
<details><summary>Will I lose my progress?</summary><p>Your progress is saved in your browser on your device. It stays there unless you clear the browser data or use a private window. Use the backup option in Settings to keep a copy.</p></details>
<details><summary>How many devices can use my code?</summary><p>Each code has a limit set when it was made, for example one phone for a learner or thirty for a driving school. If you reach the limit, contact whoever gave you the code.</p></details>
<details><summary>Is this the official exam?</summary><p>No. It is a practice tool made by EduSmart Consult, and it is not an official Rwanda National Police or government product. Questions follow the published road code, so always check the current official texts too, and treat your score as a guide.</p></details>
<details><summary>Where do I get a code?</summary><p>From your driving school, or from us. <a href="contact.html?topic={_topic}#form">Send an enquiry</a> or message us on WhatsApp.</p></details>
</div></section>'''
add("road-code.html", "Amategeko y'Umuhanda | Road code theory practice in your browser", "Practise for the Rwanda provisional driving licence theory test in your browser: road signs, questions and timed mock exams in Kinyarwanda, English and French.", "products", rc,
    ld=ld_bc([("Home", ""), ("Products", "products.html"), ("Amategeko y'Umuhanda", "road-code.html")]))
