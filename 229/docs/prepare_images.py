"""Compress generated assets and build a contact sheet for review."""
import json
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

root = Path(__file__).resolve().parents[1]
sources = json.loads((root / 'docs/image-sources.json').read_text(encoding='utf-8'))
sheet = Image.new('RGB', (1000, 800), '#f4f3ec')
draw = ImageDraw.Draw(sheet)
inventory = []
for index, (name, source) in enumerate(sources.items()):
    image = Image.open(source).convert('RGB')
    size = (1536, 1024) if name == 'hero-aimori' else (1100, 733)
    image = ImageOps.fit(image, size, method=Image.Resampling.LANCZOS)
    target = root / 'assets/images' / f'{name}.webp'
    image.save(target, 'WEBP', quality=88, method=6)
    x, y = (index % 2) * 500, (index // 2) * 200
    thumb = ImageOps.contain(image, (470, 168))
    sheet.paste(thumb, (x + (500-thumb.width)//2, y))
    draw.text((x + 18, y+175), name, fill='#29483c')
    inventory.append({'file': f'assets/images/{name}.webp', 'width': image.width, 'height': image.height, 'bytes': target.stat().st_size})
sheet.save(root / 'docs/contact-sheet.jpg', quality=90)
(root / 'docs/image-inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(inventory, indent=2))
