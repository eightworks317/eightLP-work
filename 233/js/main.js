/* Progressive enhancement: content and native FAQ remain usable without JavaScript. */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#navigation');
  if (!toggle || !nav || !window.matchMedia) return;
  const desktop = matchMedia('(min-width: 961px)');
  const close = (focusToggle = false) => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (focusToggle) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close(true);
  });
  if (desktop.addEventListener) desktop.addEventListener('change', () => { if (desktop.matches) close(); });
  document.documentElement.classList.add('js');
})();

(() => {
  if (!window.matchMedia || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  const running = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reduced.matches) continue;
      try {
        const animation = entry.target.animate([
          { opacity: 0.6, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 480, easing: 'ease-out' });
        running.add(animation);
        animation.onfinish = animation.oncancel = () => running.delete(animation);
      } catch (_) { /* Base styles always show the content. */ }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  if (reduced.addEventListener) reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    running.forEach(animation => animation.cancel());
    running.clear();
  });
})();

(() => {
  const bar = document.querySelector('.filter-bar');
  const cards = [...document.querySelectorAll('[data-category]')];
  if (!bar || !cards.length) return;
  bar.hidden = false;
  const status = document.querySelector('.filter-status');
  bar.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const type = button.dataset.filter;
    bar.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    cards.forEach(card => { card.hidden = type !== 'all' && card.dataset.category !== type; if (!card.hidden) count++; });
    if (status) status.textContent = `${button.textContent}：写真付きメニュー${count}件を表示`;
  });
})();
