# Ikimina (savings group manager) web app landing page. Executed at the end of build3.py (shares its names).
_ik_topic = _up.quote("Ikimina savings group app enquiry")
_ik_facts = ["Contributions, loans and share-out in one place", "President, Accountant and Member roles", "Works offline, no sign up",
             "Kinyarwanda, English and French", "PDF statements and Excel exports", "Web, Windows and Android"]
_ik_items = "".join(f'<span class="tk"><b>{i + 1:02d}</b> {esc(t)}</span>' for i, t in enumerate(_ik_facts))
_ik_ticker = f'<div class="ticker-strip"><div class="ticker" aria-hidden="true"><div class="ticker-track">{_ik_items}{_ik_items}</div></div></div>'

IK_TOUR = [
 ("iki-d-dashboard", "Group dashboard", "Cash in hand, total savings, loans out and interest earned, with alerts for overdue loans and members who have not paid.", ["Cash in hand at a glance", "Six month cash flow chart", "Collection rate for the current period"]),
 ("iki-d-members", "Members register", "Every member with role, phone number, shares, savings, arrears and a reliability score.", ["Search and filter members", "Savings and arrears per member", "Reliability score from 0 to 100"]),
 ("iki-d-contrib", "Contributions", "Record what each member paid this period, by cash or mobile money, and see who is paid, partly paid or late.", ["Paid, partial and unpaid board", "Cash and MoMo with a reference", "Receipts for members"]),
 ("iki-d-loans", "Loans", "Apply, approve, disburse and repay loans with the group's own interest rate, a repayment schedule and late penalties.", ["Flat or declining interest", "Automatic schedule and balance", "Overdue loans flagged in red"]),
 ("iki-d-analytics", "Analytics", "See how savings, income and expenses move month by month, and who your top savers are.", ["Savings, income and expenses by month", "Top savers ranking", "Loan portfolio at a glance"]),
 ("iki-d-rotation", "Rotation and pot", "For groups that take turns receiving the pot, keep the order, record each payout and see who is next.", ["Set the rotation order", "Record each round's payout", "Payout history"]),
 ("iki-d-finance", "Income and expenses", "Record fines, fees, donations and group costs so the cashbook always matches the cash.", ["Income by source", "Expenses by category", "Who recorded and approved each entry"]),
 ("iki-d-reports", "Reports and backup", "Group statements and member statements as PDF, a share-out calculator, Excel exports and a full backup file.", ["Group financial statement (PDF)", "Member statements (PDF)", "Backup and restore"]),
]
_ik_slides = "".join(f'''<div class="slide" data-i="{i}" data-title="{esc(t)}"><div class="slide-shot">{win("assets/ikimina-shots/" + img + ".jpg", t, title="Ikimina", w=2160, h=1350, logo="assets/products/ikimina.svg")}</div><div class="slide-text"><span class="step-no">Screen {i + 1} of {len(IK_TOUR)}</span><h3>{esc(t)}</h3><p>{esc(d)}</p><ul class="checklist">{"".join(f"<li>{esc(x)}</li>" for x in pts)}</ul></div></div>''' for i, (img, t, d, pts) in enumerate(IK_TOUR))
_ik_thumbs = "".join(f'<button class="tthumb" data-go="{i}"><span>{i + 1}</span>{esc(t)}</button>' for i, (img, t, d, pts) in enumerate(IK_TOUR))


def _ik_phone(img, alt):
    return f'<div class="phone"><img src="assets/ikimina-shots/{img}.jpg" alt="{alt} on a phone" width="824" height="1720" loading="lazy"></div>'


ik = hero_page("Savings groups", "Ikimina", "Run your savings group with clear records: contributions, loans, rotation and reports, in Kinyarwanda, English or French.") + _ik_ticker + f'''
<section class="section"><div class="container">
<div class="grid g4">
<div class="tile navy rv"><b data-count="3">3</b><span>Roles: President, Accountant, Member</span></div>
<div class="tile sky rv"><b data-count="4">4</b><span>Contribution cycles: daily to monthly</span></div>
<div class="tile navy rv"><b data-count="8">8</b><span>Reports and exports</span></div>
<div class="tile sky rv"><b data-count="3">3</b><span>Languages: Kinyarwanda, English, French</span></div>
</div></div></section>
<section class="section"><div class="container split" style="align-items:start">
<div><div class="kicker">Try it now</div><h2>Open it in your browser</h2>
<p>No download and no sign up. Start with the demo group to look around, or create your own group in two minutes. Everything you enter stays in your own browser.</p>
<ol class="next"><li>Press <b>Open the web app</b>.</li><li>Choose <b>Explore with demo data</b> to see a full group, or <b>Create my group</b> to start yours.</li><li>In the demo, sign in as any member with the PIN <b>1234</b>.</li><li>Use <b>Reports</b> to save a backup of your data.</li></ol>
<p style="margin-top:1.2rem"><a class="btn btn-gold" href="ikimina/">Open the web app</a> <a class="btn btn-outline" href="contact.html?topic={_ik_topic}#form">Ask about Windows or Android</a></p></div>
<div class="grid" style="gap:1rem">
<img src="assets/products/ikimina.svg" alt="Ikimina logo" width="140" height="140" style="width:min(140px,50%);height:auto;margin:0 auto .4rem;display:block">
<div class="card">{ico("target")}<h3>Demo group</h3><p>Twisungane Ikimina, a sample group with 13 members, loans, meetings and months of history, so you can try every screen.</p></div>
<div class="card">{ico("shield")}<h3>Your own group</h3><p>Create your group, add members and start recording. PIN sign in for each member, with a lock after too many wrong tries.</p></div>
</div></div></section>
<section class="section sky"><div class="container tour" data-tour>
<div class="section-head"><div><div class="kicker">See it for yourself</div><h2>Screen by screen</h2></div><p>Real screens from the web app, using the demo group. Click a screenshot to enlarge it.</p></div>
<div class="tour-bar"><div class="tour-progress"><i></i></div><div class="tour-ctrl"><button class="btn btn-outline btn-sm" data-prev>&larr; Back</button><button class="btn btn-primary btn-sm" data-next>Next &rarr;</button><button class="btn btn-outline btn-sm" data-play aria-pressed="false">Play</button></div></div>
<div class="tour-stage">{_ik_slides}</div>
<div class="tour-thumbs">{_ik_thumbs}</div>
<p class="tiny-note">Tip: use the left and right arrow keys.</p>
</div></section>
<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">In your pocket</div><h2>Works on a phone too</h2></div><p>On a phone the menu slides in from the side and the cards stack, so a treasurer can record contributions at the meeting.</p></div>
<div class="phones" style="grid-template-columns:repeat(3,1fr);max-width:700px;margin:0 auto">{_ik_phone("iki-m-dashboard", "Dashboard")}{_ik_phone("iki-m-menu", "Menu")}{_ik_phone("iki-m-member", "Member account")}</div>
</div></section>
<section class="section soft"><div class="container"><div class="section-head"><div><div class="kicker">What is inside</div><h2>Everything a savings group needs</h2></div><p>The same features in the browser and in the Windows program.</p></div>
<div class="grid g3">
<div class="card">{ico("users")}<h3>Members and roles</h3><p>The President approves and oversees, the Accountant records every payment, and members see only their own savings and loans.</p></div>
<div class="card">{ico("target")}<h3>Contributions</h3><p>Set the amount and cycle (daily, weekly, every two weeks or monthly). Members can hold more than one share.</p></div>
<div class="card">{ico("chart")}<h3>Loans</h3><p>Flat or declining interest, a maximum loan based on savings, president approval, an instalment schedule and late penalties after a grace period.</p></div>
<div class="card">{ico("clock")}<h3>Rotation</h3><p>For groups that pass the pot around: set the order, record each payout and see whose turn is next.</p></div>
<div class="card">{ico("edit")}<h3>Requests, meetings, announcements</h3><p>Members ask for loans or report absences, and the group posts meeting notices, minutes and announcements.</p></div>
<div class="card">{ico("book")}<h3>Reports</h3><p>Group and member statements as PDF, a year-end share-out calculator, and Excel exports for contributions, loans, cashbook and members.</p></div>
<div class="card">{ico("shield")}<h3>Audit trail</h3><p>Every sign in, payment, approval and change is logged with who did it and when.</p></div>
<div class="card">{ico("translate")}<h3>Three languages</h3><p>Kinyarwanda, English and French, with dark mode for evening meetings.</p></div>
<div class="card">{ico("lock")}<h3>Your data stays with you</h3><p>Records are saved on your own device. Nothing is sent to us. Save a backup file regularly.</p></div>
</div></div></section>
<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">Web, Windows and Android</div><h2>Which version suits you</h2></div></div>
<div class="scroll-x"><table class="cmp" style="width:100%"><tr><th></th><th>Web</th><th>Windows</th></tr>
<tr><td>Cost to try</td><td>Free</td><td>Ask us</td></tr><tr><td>Needs installing</td><td>No</td><td>Yes</td></tr>
<tr><td>Works without internet</td><td>Keep the tab open after the first visit</td><td>Yes</td></tr><tr><td>Where the records live</td><td>This browser</td><td>This computer</td></tr>
<tr><td>Backup and restore</td><td>Yes</td><td>Yes</td></tr><tr><td>PDF and Excel reports</td><td>Yes</td><td>Yes</td></tr></table></div>
<div class="callout-box"><b>Good to know.</b> Records live on one device. If several officers need the same books, use one shared computer, or save a backup and restore it on another device. Ikimina is also available as an Android app. <a href="contact.html?topic={_ik_topic}#form">Ask us about the installed apps</a>.</div></div></section>
<section class="section soft"><div class="container" style="max-width:820px"><div class="section-head"><div><div class="kicker">Questions</div><h2>Good to know</h2></div></div>
<details><summary>Is my group's data safe?</summary><p>Your records are saved on your own device only. Members sign in with a PIN, and the app locks after ten minutes of no use. Because nothing is stored online, clearing the browser data would remove your records, so use <b>Reports</b> then <b>Backup all data</b> often and keep the file safe.</p></details>
<details><summary>Can two people use the same group?</summary><p>Not at the same time on different devices. Records are kept on one device. To move to another device, save a backup and restore it there.</p></details>
<details><summary>What is the demo PIN?</summary><p>In the demo group every member's PIN is 1234. When you create your own group you choose your own PINs.</p></details>
<details><summary>Does it work with mobile money?</summary><p>You can record a payment as cash or MoMo with a reference number. The app does not connect to any mobile money account or move money.</p></details>
<details><summary>Do I need the internet?</summary><p>You need a connection to open the web app. For a fully offline setup, ask about the Windows or Android app.</p></details>
</div></section>
<section class="section"><div class="container"><div class="reach"><div>
<div class="kicker">Ready when you are</div><h2>See your group's books in two minutes</h2>
<p>Open the demo, look at every screen, then create your own group when you are ready.</p>
<div class="kg">{ico("shield")}<span>Free to try, <b>no sign up</b></span></div>
</div>
<div class="reach-actions">
<a class="btn btn-gold" href="ikimina/">Open the web app</a>
<a class="btn btn-ghost-light" href="contact.html?topic={_ik_topic}#form">Ask about Windows or Android</a>
</div></div></div></section>'''
add("savings-groups.html", "Ikimina | Savings group manager in your browser", "Manage a savings group (ikimina, VSLA or tontine) in your browser: contributions, loans, rotation, reports and roles for the President, Accountant and members.", "products", ik,
    ld=ld_bc([("Home", ""), ("Products", "products.html"), ("Ikimina", "savings-groups.html")]))
