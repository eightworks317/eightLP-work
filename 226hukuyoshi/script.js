'use strict';
const shop = window.SHOP;
document.querySelectorAll('[data-map-link]').forEach(link => { link.href = shop.mapUrl; });
const menuList = document.querySelector('#menu-list');
function renderMenu(filter) {
  menuList.replaceChildren();
  shop.menu.filter(item => filter === 'all' || item.category === filter).forEach((item, index) => {
    const article = document.createElement('article');
    article.className = item.image ? 'menu-item menu-featured' : 'menu-item';
    if (item.image) { const image = document.createElement('img'); image.src = item.image; image.alt = item.alt; image.width = 900; image.height = 600; image.loading = 'lazy'; article.append(image); }
    const info = document.createElement('div'); info.className = 'menu-item-info';
    const english = document.createElement('p'); english.className = 'menu-english'; english.textContent = item.en;
    const heading = document.createElement('h3'); heading.textContent = item.name;
    const description = document.createElement('p'); description.className = 'menu-description'; description.textContent = item.description;
    const price = document.createElement('p'); price.className = 'menu-price'; price.append(document.createTextNode(item.price.toLocaleString('ja-JP'))); const yen = document.createElement('small'); yen.textContent = '円'; price.append(yen);
    info.append(english, heading, description, price);
    if (item.tag) { const tag = document.createElement('span'); tag.className = 'menu-tag'; tag.textContent = item.tag; info.prepend(tag); }
    article.append(info); menuList.append(article);
  });
}
renderMenu('all');
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(tab => { const active = tab === button; tab.classList.toggle('active', active); tab.setAttribute('aria-pressed', String(active)); });
  renderMenu(button.dataset.filter);
}));
const toggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeNav() { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'メニューを開く'); mobileNav.hidden = true; }
toggle.addEventListener('click', () => { const opening = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(opening)); toggle.setAttribute('aria-label', opening ? 'メニューを閉じる' : 'メニューを開く'); mobileNav.hidden = !opening; });
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });
document.querySelector('#copy-address').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText(shop.address); status.textContent = '住所をコピーしました。'; }
  catch { status.textContent = shop.address; }
});
