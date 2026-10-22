import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'ishiyama-sushi-lp-v2.html');
let html=fs.readFileSync(source,'utf8');
const args=process.argv.slice(2);
if(args.length>1) throw Error('Usage: node scripts/prepare.mjs [https://published-site-url/]');
let base;
if(args[0]){
 const u=new URL(args[0]);
 if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash) throw Error('Use an HTTPS site URL without credentials, query or fragment.');
 base=u.href.replace(/\/$/,'')+'/';
 const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 html=html.replace('content="img/sushi-concept.jpg"',`content="${escape(new URL('img/sushi-concept.jpg',base).href)}"`);
 html=html.replace('</head>',`<meta property="og:url" content="${escape(base)}">\n<link rel="canonical" href="${escape(base)}">\n</head>`);
}
const output=path.join(root,'_site');
fs.mkdirSync(path.join(output,'img'),{recursive:true});
fs.writeFileSync(path.join(output,'index.html'),html);
fs.writeFileSync(path.join(output,'.nojekyll'),'');
for(const name of ['sushi-concept.jpg','seasonal-concept.jpg','sake-concept.jpg','tableware-concept.jpg']) fs.copyFileSync(path.join(root,'img',name),path.join(output,'img',name));
console.log(`Prepared ${output}${base?' for '+base:' (local preview; absolute OG URLs are added during deployment)'}`);
