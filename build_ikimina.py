# Ikimina (savings group manager) web app landing page. Executed at the end of build3.py (shares its names).
_ik_topic = _up.quote("Ikimina savings group app enquiry")
_ik_facts = ["Contributions, loans and share-out in one place", "President, Accountant, Secretary and Member roles", "Attendance and contribution history",
             "Kinyarwanda, English and French", "Each group sets its own rules", "Web and Android, always in step"]
_ik_items = "".join(f'<span class="tk"><b>{i + 1:02d}</b> {esc(t)}</span>' for i, t in enumerate(_ik_facts))
_ik_ticker = f'<div class="ticker-strip"><div class="ticker" aria-hidden="true"><div class="ticker-track">{_ik_items}{_ik_items}</div></div></div>'

IK_TOUR = [
 ("iki-d-dashboard", "Group dashboard", "Group cash, member savings, loans out and interest earned in one view. Every figure opens the page behind it.", ["Cash and savings at a glance", "Clickable figures and alerts", "Savings recorded per month"]),
 ("iki-d-members", "Members register", "Every member with role, phone number, savings and status. New members are approved by a second officer.", ["Search and filter members", "Approval before anyone joins", "Reset a forgotten PIN"]),
 ("iki-d-contrib", "Record contributions", "Only the Accountant records savings. Pick the member, the month and the date from a calendar, and a receipt is issued.", ["Month and date pickers", "Cash and mobile money with a reference", "Works offline and syncs later"]),
 ("iki-d-attendance", "Attendance", "The Secretary marks who came to each meeting. The record shows every member across the last meetings, with an attendance rate.", ["Present, late, absent or excused", "Optional fines for late and absent", "Members see their own attendance"]),
 ("iki-d-history", "Contribution history", "See who paid, part-paid or missed in each month, compared with what each member owes for their shares.", ["Members by months grid", "Totals collected each month", "Members see their own timeline"]),
 ("iki-d-loans", "Loans", "Request, approve, disburse and repay loans with the group's own interest rate, a repayment schedule and late penalties.", ["President and Accountant both approve", "Automatic schedule and balance", "Overdue instalments flagged"]),
 ("iki-d-analytics", "Group health", "See how much was collected this period, who is behind, and send a friendly WhatsApp reminder in one tap.", ["Collection rate", "Members behind and overdue loans", "Year-end share-out preview"]),
 ("iki-d-rotation", "Rotation and pot", "For groups that take turns receiving the pot, keep the order, record each payout and see who is next.", ["Set the rotation order", "Payouts approved before they are paid", "Payout history"]),
 ("iki-d-finance", "Income and expenses", "Record fines, fees, donations and group costs so the cashbook always matches the cash. Large expenses need approval.", ["Income by source", "Expenses by category", "Who recorded and approved each entry"]),
 ("iki-d-reports", "Reports", "Group statements and member statements as PDF, plus Excel exports of contributions, loans and the cashbook.", ["Group financial statement (PDF)", "Member statements (PDF)", "Excel exports"]),
]
_ik_slides = "".join(f'''<div class="slide" data-i="{i}" data-title="{esc(t)}"><div class="slide-shot">{win("assets/ikimina-shots/" + img + ".jpg", t, title="Ikimina", w=2160, h=1350, logo="assets/products/ikimina.png")}</div><div class="slide-text"><span class="step-no">Screen {i + 1} of {len(IK_TOUR)}</span><h3>{esc(t)}</h3><p>{esc(d)}</p><ul class="checklist">{"".join(f"<li>{esc(x)}</li>" for x in pts)}</ul></div></div>''' for i, (img, t, d, pts) in enumerate(IK_TOUR))
_ik_thumbs = "".join(f'<button class="tthumb" data-go="{i}"><span>{i + 1}</span>{esc(t)}</button>' for i, (img, t, d, pts) in enumerate(IK_TOUR))


def _ik_phone(img, alt):
    return f'<div class="phone"><img src="assets/ikimina-shots/{img}.jpg" alt="{alt} on a phone" width="824" height="1720" loading="lazy"></div>'


ik = hero_page("Savings groups", "Ikimina", "Run your savings group with clear records: contributions, loans, rotation and reports, in Kinyarwanda, English or French.") + _ik_ticker + f'''
<section class="section"><div class="container">
<div class="grid g4">
<div class="tile navy rv"><b data-count="4">4</b><span>Officer roles: President, Accountant, Secretary, Vice President</span></div>
<div class="tile sky rv"><b data-count="4">4</b><span>Contribution cycles: daily to monthly</span></div>
<div class="tile navy rv"><b data-count="10">10</b><span>Screens for money, people and governance</span></div>
<div class="tile sky rv"><b data-count="3">3</b><span>Languages: Kinyarwanda, English, French</span></div>
</div></div></section>
<section class="section"><div class="container split" style="align-items:start">
<div><div class="kicker">Try it now</div><h2>Open it in your browser</h2>
<p>The books live online, so the President, Accountant, Secretary and members each use their own phone and see the same group. The demo is a test version with sample data. Look around, and ask us to set up your own group.</p>
<ol class="next"><li>Press <b>Open the web app</b>.</li><li>Sign in with the demo member phone number and PIN below.</li><li>See a member's savings, loans, attendance and contribution history, and switch between Kinyarwanda, English and French. The first start can take up to a minute while the demo server wakes up.</li></ol>
<p style="margin-top:1.2rem"><a class="btn btn-gold" href="https://ikimina-demo.onrender.com/">Open the web app</a> <a class="btn btn-outline" href="assets/downloads/Ikimina-Android-1.2.1.apk" download>Android app (APK, 7 MB)</a> <a class="btn btn-outline" href="contact.html?topic={_ik_topic}#form">Set up my group</a> <a class="btn btn-outline" href="ikimina-guide.html">User guide</a></p></div>
<div class="grid" style="gap:1rem">
<img src="assets/products/ikimina.png" alt="Ikimina logo" width="140" height="140" style="width:min(140px,50%);height:auto;margin:0 auto .4rem;display:block">
<div class="card">{ico("target")}<h3>Demo group</h3><p>Twiyubake Ikimina, a sample group with 25 fictional members, loans, meetings and six months of history, so you can try every screen.</p>
<p class="tiny-note"><b>Demo member:</b> 0788000204 · PIN 5273<br>To see the officer screens (Accountant, Secretary, President), ask us for a guided demo.</p></div>
<div class="card">{ico("shield")}<h3>Your own group</h3><p>We create your group, and you choose who holds each role. Every member signs in with a phone number and PIN, with a lock after too many wrong tries.</p></div>
</div></div></section>
<section class="section sky"><div class="container tour" data-tour>
<div class="section-head"><div><div class="kicker">See it for yourself</div><h2>Screen by screen</h2></div><p>Real screens from the web app, using the demo group. Click a screenshot to enlarge it.</p></div>
<div class="tour-bar"><div class="tour-progress"><i></i></div><div class="tour-ctrl"><button class="btn btn-outline btn-sm" data-prev>&larr; Back</button><button class="btn btn-primary btn-sm" data-next>Next &rarr;</button><button class="btn btn-outline btn-sm" data-play aria-pressed="false">Play</button></div></div>
<div class="tour-stage">{_ik_slides}</div>
<div class="tour-thumbs">{_ik_thumbs}</div>
<p class="tiny-note">Tip: use the left and right arrow keys.</p>
</div></section>
<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">In your pocket</div><h2>Works on a phone too</h2></div><p>On a phone the menu slides in from the side and the cards stack, so a treasurer can record contributions at the meeting.</p></div>
<div class="phones" style="grid-template-columns:repeat(3,1fr);max-width:700px;margin:0 auto">{_ik_phone("iki-m-dashboard", "Member home")}{_ik_phone("iki-m-history", "My contributions")}{_ik_phone("iki-m-member", "My attendance")}</div>
</div></section>
<section class="section soft"><div class="container"><div class="section-head"><div><div class="kicker">What is inside</div><h2>Everything a savings group needs</h2></div><p>The same features on the web and on Android.</p></div>
<div class="grid g3">
<div class="card">{ico("users")}<h3>Members and roles</h3><p>The President oversees, the Accountant records every payment, the Secretary keeps attendance and notices, and members see only their own savings and loans.</p></div>
<div class="card">{ico("target")}<h3>Contributions</h3><p>Set the amount and cycle (daily, weekly, every two weeks or monthly). Members can hold more than one share. Dates and months come from a calendar, so records stay clean.</p></div>
<div class="card">{ico("chart")}<h3>Loans</h3><p>Flat or declining interest, a maximum loan based on savings, approval by two officers, an instalment schedule and late penalties after a grace period.</p></div>
<div class="card">{ico("clock")}<h3>Rotation</h3><p>For groups that pass the pot around: set the order, record each payout and see whose turn is next.</p></div>
<div class="card">{ico("calendar")}<h3>Attendance and history</h3><p>The Secretary records who came to each meeting, and everyone can see who contributed in each month. Members check their own record in their account.</p></div>
<div class="card">{ico("edit")}<h3>Each group sets its own rules</h3><p>Amounts, interest, fines and who approves what are the group's own choices, and changes to them can need approval.</p></div>
<div class="card">{ico("book")}<h3>Reports</h3><p>Group and member statements as PDF, a year-end share-out preview, and Excel exports for contributions, loans and the cashbook.</p></div>
<div class="card">{ico("shield")}<h3>Audit trail</h3><p>Every sign in, payment, approval and change is logged with who did it and when. The books are append-only: a mistake is corrected by a reversal, never by erasing it.</p></div>
<div class="card">{ico("translate")}<h3>Three languages</h3><p>Kinyarwanda, English and French, with dark mode for evening meetings.</p></div>
</div></div></section>
<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">Web and Android</div><h2>Which version suits you</h2></div></div>
<div class="scroll-x"><table class="cmp" style="width:100%"><tr><th></th><th>Web</th><th>Android</th></tr>
<tr><td>Cost to try</td><td>Free</td><td>Free</td></tr><tr><td>Needs installing</td><td>No</td><td>Yes (APK)</td></tr>
<tr><td>Works without internet</td><td>Partly</td><td>Savings can be recorded offline and sync later</td></tr><tr><td>Where the records live</td><td>The group's online books</td><td>The group's online books</td></tr>
<tr><td>PDF and Excel reports</td><td>Yes</td><td>Yes</td></tr></table></div>
<div class="callout-box"><b>Good to know.</b> The demo is a test version with sample data only, so please do not enter real members or real money in it. Ask us to set up your own group.</div></div></section>
<section class="section soft"><div class="container" style="max-width:820px"><div class="section-head"><div><div class="kicker">Questions</div><h2>Good to know</h2></div></div>
<details><summary>Can the whole group use it together?</summary><p>Yes. Each officer and member signs in on their own phone and sees the same books, according to their role.</p></details>
<details><summary>Who can record savings?</summary><p>Only the Accountant, or an officer the President has authorised for a limited time. This keeps one person accountable for the money.</p></details>
<details><summary>What if the President or Accountant changes?</summary><p>The group asks for the change and other officers approve it. If a group is stuck, for example someone lost their phone, our support team can help after checking who is asking, and the change is recorded in the group's audit log.</p></details>
<details><summary>Does it work with mobile money?</summary><p>You can record a payment as cash or mobile money with a reference number. The app does not connect to any mobile money account or move money.</p></details>
<details><summary>Do I need the internet?</summary><p>You need a connection to open it. On Android the Accountant can keep recording savings when the connection drops, and the records upload by themselves when it returns.</p></details>
</div></section>
<section class="section"><div class="container"><div class="reach"><div>
<div class="kicker">Ready when you are</div><h2>See your group's books in two minutes</h2>
<p>Open the demo, look at every screen, then ask us to set up your own group.</p>
<div class="kg">{ico("shield")}<span>Free to try, <b>sample data only</b></span></div>
</div>
<div class="reach-actions">
<a class="btn btn-gold" href="https://ikimina-demo.onrender.com/">Open the web app</a>
<a class="btn btn-ghost-light" href="contact.html?topic={_ik_topic}#form">Set up my group</a>
<a class="btn btn-ghost-light" href="ikimina-guide.html">Read the user guide</a>
</div></div></div></section>'''
add("savings-groups.html", "Ikimina | Savings group manager in your browser", "Manage a savings group (ikimina, VSLA or tontine) in your browser: contributions, loans, rotation, reports and roles for the President, Accountant and members.", "products", ik,
    ld=ld_bc([("Home", ""), ("Products", "products.html"), ("Ikimina", "savings-groups.html")]))


# ---- the user guide as a web page (same content as the PDF: tools/ikimina_guide_content.py)
import sys as _sys
_sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "tools"))
import ikimina_guide_content as _gc


def _g_block(b):
    t = b[0]
    if t == "shots":
        items = b[1]
        if all(x[0] == "d" for x in items):
            cols = 1 if len(items) == 1 else 2
            cells = "".join(f'<figure class="fig">{win(_gc.GI.replace("assets/", "assets/") + f + ".jpg", ttl, title="Ikimina", w=1500, h=938, logo="assets/ikimina-192.png")}<figcaption><b>{esc(ttl)}</b>{esc(cap)}</figcaption></figure>' for _, f, ttl, cap in items)
            return f'<div class="grid" style="grid-template-columns:repeat({cols},1fr);gap:1.2rem;margin:1.2rem 0">{cells}</div>'
        cells = "".join(f'<figure class="fig" style="text-align:center"><div class="phone"><img src="{_gc.GI}{f}.jpg" alt="{esc(ttl)} on a phone" width="560" height="1170" loading="lazy"></div><figcaption><b>{esc(ttl)}</b>{esc(cap)}</figcaption></figure>' for _, f, ttl, cap in items)
        return f'<div class="phones" style="grid-template-columns:repeat({len(items)},1fr);max-width:{min(900, 260 * len(items))}px;margin:1.2rem auto">{cells}</div>'
    if t == "steps":
        return '<ol class="next">' + "".join(f"<li><b>{esc(a)}.</b> {esc(d)}</li>" for a, d in b[1]) + "</ol>"
    if t == "bullets":
        return '<ul class="guide-list">' + "".join(f"<li>{esc(x)}</li>" for x in b[1]) + "</ul>"
    if t == "call":
        return f'<div class="callout-box">{esc(b[2])}</div>'
    if t == "table":
        return '<div class="scroll-x"><table class="cmp" style="width:100%"><tr>' + "".join(f"<th>{esc(h)}</th>" for h in b[1]) + "</tr>" + "".join("<tr>" + "".join(f"<td>{esc(c)}</td>" for c in r) + "</tr>" for r in b[2]) + "</table></div>"
    return f"<p>{esc(b[1])}</p>"


_g_toc = "".join(f'<a class="tthumb" href="#{s["id"]}"><span>{i + 1}</span>{esc(s["title"])}</a>' for i, s in enumerate(_gc.SECTIONS))
_g_secs = "".join(f'<section class="section{" soft" if i % 2 else ""}" id="{s["id"]}"><div class="container"><div class="kicker">{esc(s["kick"])}</div><h2>{esc(s["title"])}</h2><p class="lead">{esc(s["lead"])}</p>{"".join(_g_block(b) for b in s["blocks"])}</div></section>' for i, s in enumerate(_gc.SECTIONS))
ikg = hero_page("Savings groups", "Ikimina user guide", "Everything your group needs to know, for members, the Accountant, the Secretary, the President and the EduSmart support team, with screens from the real app.") + f'''
<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">In this guide</div><h2>Choose your section</h2></div><p>Members start with Getting started. Officers read the sections for their own job.</p></div>
<div class="tour-thumbs" style="flex-wrap:wrap">{_g_toc}</div>
<p style="margin-top:1.2rem"><a class="btn btn-gold" href="assets/brochures/Ikimina-guide.pdf" download>Download the guide (PDF)</a> <a class="btn btn-outline" href="savings-groups.html">About Ikimina</a> <a class="btn btn-outline" href="https://ikimina-demo.onrender.com/">Open the web app</a></p></div></section>
{_g_secs}
<section class="section"><div class="container"><div class="reach"><div><div class="kicker">Ready when you are</div><h2>Set up your group with EduSmart Consult</h2><p>We create the group, train your officers and support you.</p></div>
<div class="reach-actions"><a class="btn btn-gold" href="contact.html?topic={_ik_topic}#form">Set up my group</a><a class="btn btn-ghost-light" href="assets/brochures/Ikimina-guide.pdf" download>Download the guide (PDF)</a></div></div></div></section>'''
add("ikimina-guide.html", "Ikimina user guide | EduSmart Consult", "Step-by-step guide to Ikimina for members, the Accountant, the Secretary, the President and EduSmart support, with screenshots from the real app.", "products", ikg,
    ld=ld_bc([("Home", ""), ("Products", "products.html"), ("Ikimina", "savings-groups.html"), ("User guide", "ikimina-guide.html")]))
