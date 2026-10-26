/* Content stays visible without JavaScript; only navigation and optional motion are enhanced. */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#navigation');
  if (!toggle || !nav || !window.matchMedia) return;
  const desktop = matchMedia('(min-width: 901px)');
  const close = (returnFocus = false) => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close(true);
  });
  const resize = () => { if (desktop.matches) close(); };
  if (desktop.addEventListener) desktop.addEventListener('change', resize);
  document.documentElement.classList.add('js');
})();

(() => {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate || !window.matchMedia) return;
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
          { opacity: 0.55, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 480, easing: 'ease-out' });
        running.add(animation);
        animation.onfinish = animation.oncancel = () => running.delete(animation);
      } catch (_) { /* Base CSS always displays the content. */ }
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
