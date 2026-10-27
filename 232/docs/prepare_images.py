"""Optimize selected generated assets; originals are retained."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json
root=Path(__file__).resolve().parents[1]
sources=json.loads((root/'docs/selected-image-sources.json').read_text(encoding='utf-8'))
(root/'assets/images').mkdir(parents=True,exist_ok=True)
sheet=Image.new('RGB',(1400,1960),'#f5eee5')
draw=ImageDraw.Draw(sheet)
inventory=[]
for index,(name,source) in enumerate(sources.items()):
    im=Image.open(source).convert('RGB')
    size=(1536,1024) if name=='hero-kobachi' else (1100,733)
    im=ImageOps.fit(im,size,method=Image.Resampling.LANCZOS)
    target=root/'assets/images'/f'{name}.webp'
    im.save(target,'WEBP',quality=88,method=6)
    thumb=ImageOps.contain(im,(660,440))
    x,y=(index%2)*700+20,(index//2)*490+10
    sheet.paste(thumb,(x,y))
    draw.text((x,y+450),name,fill='#352d2b')
    inventory.append({'file':f'assets/images/{name}.webp','width':im.width,'height':im.height,'bytes':target.stat().st_size})
sheet.save(root/'docs/contact-sheet.jpg',quality=90)
(root/'docs/image-inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'images':inventory,'total_bytes':sum(i['bytes'] for i in inventory)},indent=2))
