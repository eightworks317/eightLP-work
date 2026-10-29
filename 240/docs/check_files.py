"""Static verification only; does not replace browser layout/interaction checks."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import json, re
from PIL import Image

root = Path(__file__).resolve().parents[1]
class Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.links, self.images, self.local, self.stack, self.errors = set(), [], [], [], [], []
        self.h1, self.iframe = 0, []
    def handle_starttag(self, tag, attributes):
        a = dict(attributes)
        if 'id' in a:
            if a['id'] in self.ids: self.errors.append('Duplicate ID: '+a['id'])
            self.ids.add(a['id'])
        if tag == 'h1': self.h1 += 1
        if tag == 'a':
            self.links.append(a.get('href',''))
            if a.get('target') == '_blank' and 'noopener' not in a.get('rel',''): self.errors.append('Missing noopener')
        if tag == 'img': self.images.append(a)
        if tag == 'iframe': self.iframe.append(a)
        for key in ['src', 'href']:
            value = a.get(key,'')
            if value and not value.startswith('#') and not urlparse(value).scheme:
                self.local.append(value)
        if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:
            self.stack.append(tag)
    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag: self.errors.append('Nesting mismatch: '+tag)
        else: self.stack.pop()

html = (root/'index.html').read_text(encoding='utf-8')
p = Check(); p.feed(html)
errors = p.errors
if p.stack: errors.append('Unclosed tags: '+str(p.stack))
for href in p.links:
    if not href or href == '#': errors.append('Empty link')
    if href.startswith('#') and href[1:] not in p.ids: errors.append('Missing anchor: '+href)
for value in p.local:
    if not (root/value).is_file(): errors.append('Missing file: '+value)
if p.h1 != 1: errors.append('h1 count')
if len(p.images) != 6 or len(set(i['src'] for i in p.images)) != 6: errors.append('Image count/reuse')
for i in p.images:
    if not all(i.get(a) for a in ['alt','width','height']): errors.append('Image metadata')
    with Image.open(root/i['src']) as im:
        if im.size != (int(i['width']), int(i['height'])): errors.append('Image dimensions: '+i['src'])
if len(p.iframe) != 1 or not p.iframe[0].get('title') or '/maps/embed?' not in p.iframe[0]['src']: errors.append('Map iframe')
if 'fetch(' in (root/'js/main.js').read_text(encoding='utf-8'): errors.append('Local fetch dependency')
for forbidden in ['非公式','仮設定','AI生成','制作サンプル','準備中','人気No.1']:
    if forbidden in html: errors.append('Editorial artifact: '+forbidden)
css = (root/'css/style.css').read_text(encoding='utf-8')
if css.count('{') != css.count('}'): errors.append('CSS brace mismatch')
def luminance(color):
    rgb = [int(color[i:i+2],16)/255 for i in (1,3,5)]
    rgb = [v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    return sum(v*w for v,w in zip(rgb,[.2126,.7152,.0722]))
contrast = {}
for a,b in [('#263331','#f2f3ea'),('#58645f','#e1e8dd'),('#fffdf7','#30584e')]:
    values = sorted([luminance(a),luminance(b)])
    contrast[a+' on '+b] = round((values[1]+.05)/(values[0]+.05),2)
report = {'errors':errors,'h1':p.h1,'images':len(p.images),'unique_images':len(set(i['src'] for i in p.images)),'local_references':len(p.local),'links':len(p.links),'ids':len(p.ids),'contrast_ratios':contrast,'scope':'static only; not browser rendering or interaction'}
(root/'docs/static-check.json').write_text(json.dumps(report, ensure_ascii=False, indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
