import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'ishiyama-sushi-lp-v2.html'),'utf8');
const failures=[];
const assert=(condition,message)=>{if(!condition) failures.push(message);};
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert(new Set(ids).size===ids.length,'Duplicate IDs');
for(const m of html.matchAll(/href="#([^\"]+)"/g)) assert(ids.includes(m[1]),'Missing anchor '+m[1]);
const imgs=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
assert(imgs.length===4,'Expected four original concept images');
for(const img of imgs){
 assert(/alt="[^"]+"/.test(img),'Image lacks specific alt text');
 const src=img.match(/src="([^"]+)"/)?.[1];
 assert(src?.startsWith('img/'),'Image must use img/ relative path');
 assert(fs.existsSync(path.join(root,src||'missing')),'Missing image: '+src);
 assert(/loading="(?:eager|lazy)"/.test(img),'Image missing loading behavior');
}
for(const m of html.matchAll(/<a\b[^>]*href="https?:[^>]*>/g)){
 assert(/target="_blank"/.test(m[0]),'External link does not open in new tab');
 assert(/rel="noopener noreferrer"/.test(m[0]),'Missing external link rel');
}
assert(!/(?:src|url\()\s*=?["']?https?:\/\/ishiyamasushi\.com\/wp-content/i.test(html),'Official site media reference');
assert(!/src="(?:assets|images)\//.test(html),'Old image path');
assert(/<style>/.test(html)&&!/<link[^>]+rel="stylesheet"/.test(html),'CSS must be inline');
assert(/@media\(max-width:1024px\)/.test(html)&&/@media\(max-width:768px\)/.test(html),'Required breakpoints missing');
assert(/prefers-reduced-motion/.test(html),'Reduced motion support missing');
const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
assert(title&&title.length<=60,'Title exceeds 60 characters');
assert(description&&description.length<=120,'Description exceeds 120 characters');
for(const property of ['title','description','image','type']) assert(html.includes(`property="og:${property}"`),'Missing OG '+property);
for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(script[1]);
const colors=[['body','#15232b','#f6f3eb'],['muted','#606760','#f6f3eb'],['accent','#766039','#f6f3eb'],['gold button','#17232a','#d0b27e']];
const luminance=hex=>{const rgb=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
const contrast=colors.map(([label,fg,bg])=>{const a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert(ratio>=4.5,'Insufficient contrast: '+label);return {label,ratio:ratio.toFixed(2)};});
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(JSON.stringify({status:'passed',images:imgs.length,titleLength:title.length,descriptionLength:description.length,contrast,browserLayout:'not validated by static checks'},null,2));
