# Web apps hub page (apps.html). Executed at the end of build3.py (shares its names). The app list lives in build.py (APP_CARDS).
_ap_topic = _up.quote("Web apps and installers enquiry")


def _dl_row(a):
    web = f'<a class="dl-btn" href="{a["web"]}"><span>{"Live demo" if a["slug"] == "school" else "Web app"}</span><small>Opens in your browser</small></a>'
    apk = (f'<a class="dl-btn" href="{a["apk"]}" download><span>Android (APK)</span><small>{a["apk_size"]}</small></a>' if a["apk"]
           else '<a class="dl-btn" href="downloads.html"><span>Android</span><small>See downloads</small></a>')
    win = (f'<a class="dl-btn" href="{a["win"]}" download><span>Windows installer</span><small>{a["win_size"]}</small></a>' if a["win"]
           else '<a class="dl-btn" href="downloads.html"><span>Windows</span><small>See downloads</small></a>')
    return f'<div class="dl-row"><div class="dl-app"><img src="{a["logo"]}" alt="" width="48" height="48" loading="lazy"><div><b>{a["name"]}</b><div class="muted" style="font-size:.85rem">{a["note"]}</div></div></div>{web}{apk}{win}</div>'


apps_page = hero_page("Web apps", "Our web apps", "Open them in your browser now. Install them on Windows or Android when you are ready. Use one account to keep your work on all your devices.") + f'''
<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">Choose an app</div><h2>Four apps, one place</h2></div><p>Each app has a live demo you can try with no sign up.</p></div>
<div class="appgrid">{"".join(app_tile(a) for a in APP_CARDS)}</div></div></section>
<section class="section soft" id="downloads"><div class="container"><div class="section-head"><div><div class="kicker">Downloads</div><h2>Install on Windows or Android</h2></div><p>Installed apps work with no internet. The web version needs a connection to open.</p></div>
<div class="card">{"".join(_dl_row(a) for a in APP_CARDS)}</div>
<div class="callout-box"><b>Installing.</b> On Android, open the downloaded file and allow installs from your browser when your phone asks (these apps are not on Google Play yet). On Windows, run the installer; if Windows SmartScreen warns, choose <b>More info</b> then <b>Run anyway</b>, because the installers are not yet signed by a recognised publisher. <br><b>No installer?</b> Open FMIS or Ikimina in Chrome or Edge and choose <b>Install app</b> (on a phone: <b>Add to Home screen</b>). It then opens like an app and works with no internet. Not sure? <a href="contact.html?topic={_ap_topic}#form">Ask us</a>.</div></div></section>
<section class="section"><div class="container split" style="align-items:start"><div><div class="kicker">One account, all devices</div><h2>Start on a phone, continue on a computer</h2>
<p>Turn on cloud sync in an app and sign in with your phone number and a PIN. Your work is saved on the device first, so it always works offline. When the device is online it sends what changed and receives what other devices changed.</p>
<ol class="next"><li><b>Amategeko y'Umuhanda:</b> your practice history and exam scores follow your account, and a code you unlock once works on all your devices.</li><li><b>Ikimina:</b> the President turns on sync for the group and invites the Accountant and members with codes. Members see only their own records.</li><li><b>FMIS:</b> the Admin invites the team by code. Each role sees only what it should, and field data reaches the office as soon as a phone is online.</li></ol></div>
<div class="grid" style="gap:1rem"><div class="card">{ico("cloud")}<h3>Works offline first</h3><p>No signal in the field or at the meeting? Keep working. Everything catches up when you are back online.</p></div>
<div class="card">{ico("lock")}<h3>You stay in control</h3><p>Make a backup any time. The person who set up a group or workspace can remove anyone's access at once.</p></div>
<div class="card">{ico("shield")}<h3>Only what each person may see</h3><p>The server decides who can read and change what, not just the app on the screen.</p></div></div></div></section>
<section class="section soft"><div class="container"><div class="section-head"><div><div class="kicker">Devices</div><h2>What works where</h2></div></div>
<div class="scroll-x"><table class="cmp" style="width:100%"><tr><th></th><th>Web</th><th>Windows</th><th>Android</th></tr>
<tr><td>Needs installing</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>Works with no internet</td><td>After the page has loaded</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Cloud sync between devices</td><td>Yes</td><td>Yes</td><td>Yes</td></tr><tr><td>GPS and camera (FMIS)</td><td>In browsers that allow it</td><td>Photos from files</td><td>Yes</td></tr>
<tr><td>Printing and PDF</td><td>Yes</td><td>Yes</td><td>Yes</td></tr></table></div></div></section>
<section class="section"><div class="container" style="max-width:820px"><div class="section-head"><div><div class="kicker">Questions</div><h2>Good to know</h2></div></div>
<details><summary>Do I need an account?</summary><p>No. Every app works on its own device without one. An account is only needed if you want to share or continue your work on another device.</p></details>
<details><summary>Is it free?</summary><p>You can try every app for free. Amategeko y'Umuhanda has a free sample and a full version unlocked with a code. Smart School App is licensed to schools. Ask us about FMIS and Ikimina for your organisation.</p></details>
<details><summary>Will my data be lost if I clear my browser?</summary><p>The web apps keep data in the browser, so clearing site data removes it unless cloud sync or a backup is on. Use the backup button, or turn on cloud sync.</p></details>
<details><summary>Which browsers work?</summary><p>Current versions of Chrome, Edge, Firefox and Safari, on phones and computers.</p></details>
<details><summary>Can EduSmart Consult set it up for us?</summary><p>Yes. We can set up your workspace, train your team and support you. <a href="contact.html?topic={_ap_topic}#form">Send an enquiry</a>.</p></details></div></section>
<section class="section soft"><div class="container"><div class="reach"><div><div class="kicker">Need help choosing?</div><h2>Tell us what you want to do</h2><p>We will point you to the right app and help you get started.</p></div>
<div class="reach-actions"><a class="btn btn-gold" href="contact.html?topic={_ap_topic}#form">Send an enquiry</a><a class="btn btn-ghost-light" href="request.html">Request a demo</a></div></div></div></section>'''
add("apps.html", "Web apps | Open EduSmart Consult apps in your browser", "Open Ikimina, FMIS, Amategeko y'Umuhanda and Smart School App in your browser, or install them on Windows and Android and keep your work on all your devices with one account.", "apps", apps_page,
    ld=ld_bc([("Home", ""), ("Web apps", "apps.html")]))
