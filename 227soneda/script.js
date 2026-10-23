const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'メニューを開く'); nav.classList.remove('is-open'); }
toggle.addEventListener('click', () => { const expanded = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(expanded)); toggle.setAttribute('aria-label', expanded ? 'メニューを閉じる' : 'メニューを開く'); nav.classList.toggle('is-open', expanded); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
