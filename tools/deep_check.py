"""Deep static check of the built site: broken internal links, missing local assets, duplicate ids, unclosed-looking tags."""
import os, re, glob, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

pages = sorted(glob.glob('*.html'))
problems = []

def exists_local(path):
    path = path.split('#')[0].split('?')[0]
    if path == '' or path.startswith('http') or path.startswith('mailto') or path.startswith('tel'):
        return True
    return os.path.exists(path)

for p in pages:
    t = open(p, encoding='utf-8').read()
    # 1. hrefs / srcs
    for m in re.finditer(r'(?:href|src)="([^"]+)"', t):
        v = m.group(1)
        if v.startswith(('http://', 'https://', 'mailto:', 'tel:', '#', 'javascript:', 'data:')):
            continue
        if not exists_local(v):
            problems.append(f'{p}: missing local target {v!r}')
    # 2. duplicate ids
    ids = re.findall(r'\bid="([^"]+)"', t)
    seen = {}
    for i in ids:
        seen[i] = seen.get(i, 0) + 1
    for i, c in seen.items():
        if c > 1:
            problems.append(f'{p}: duplicate id {i!r} appears {c} times')
    # 3. basic tag balance for common containers
    for tag in ['div', 'section', 'article', 'ul', 'ol', 'table', 'a']:
        opens = len(re.findall(r'<' + tag + r'(?:\s[^>]*)?>', t))
        closes = len(re.findall(r'</' + tag + r'>', t))
        if opens != closes:
            problems.append(f'{p}: <{tag}> imbalance open={opens} close={closes}')
    # 4. leftover template braces (f-string mistakes)
    for m in re.finditer(r'\{[a-zA-Z_][a-zA-Z0-9_]{0,30}\}', t):
        problems.append(f'{p}: possible unrendered template var {m.group(0)!r}')
    # 5. em/en dashes
    if '—' in t or '–' in t:
        problems.append(f'{p}: contains an em or en dash')

print(f'checked {len(pages)} pages')
if problems:
    print(f'{len(problems)} issue(s):')
    for x in problems[:200]:
        print(' -', x)
else:
    print('no issues found')
