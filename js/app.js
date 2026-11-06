/* Navegación entre módulos, render perezoso y tema */
(() => {
  const MODS = { m0: window.M0, m1: window.M1, m2: window.M2, m3: window.M3, m4: window.M4, fuentes: window.FUENTES };
  const rendered = new Set();

  function show(id) {
    if (!MODS[id]) id = 'm0';
    document.querySelectorAll('.mod').forEach(s => s.classList.toggle('on', s.id === 's-' + id));
    document.querySelectorAll('.tabs a').forEach(a => a.setAttribute('aria-selected', a.dataset.tab === id));
    const sec = document.getElementById('s-' + id);
    if (!rendered.has(id)) { MODS[id].render(sec); rendered.add(id); }
    if (MODS[id].onShow) MODS[id].onShow();
    const tab = document.querySelector(`.tabs a[data-tab="${id}"]`);
    if (tab) tab.parentElement.scrollTo({ left: Math.max(0, tab.offsetLeft - 16), behavior: 'smooth' });
  }
  function route() {
    const h = (location.hash || '#m0').slice(1);
    const [mod, anchor] = h.split('/');
    show(mod);
    if (anchor) { const a = document.getElementById(anchor); if (a) setTimeout(() => a.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }
    else window.scrollTo({ top: 0 });
    setTimeout(() => { if (!anchor) window.scrollTo({ top: 0 }); }, 0);
  }
  window.addEventListener('hashchange', route);

  document.getElementById('themeBtn').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('atlas-theme', next); } catch (e) { }
    UI.redrawAll();
    Object.values(MODS).forEach(m => m && m.onTheme && m.onTheme());
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { UI.redrawAll(); Object.values(MODS).forEach(m => m && m.onTheme && m.onTheme()); });

  UI.initTips();
  route();
})();
