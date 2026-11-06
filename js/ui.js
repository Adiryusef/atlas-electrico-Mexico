/* Utilidades compartidas: formato, citas, tooltips, gráficas y mapas */
const UI = (() => {
  const nf = (d = 0) => new Intl.NumberFormat('es-MX', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmt = (v, d = 0) => (v === null || v === undefined || Number.isNaN(v)) ? 'Dato no disponible' : nf(d).format(v);
  const pct = (v, d = 1) => fmt(v, d) + ' %';
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const sum = (a) => a.reduce((x, y) => x + y, 0);

  /* ---- citas ---- */
  function srcText(ref) {
    const S = SOURCES[ref.s]; if (!S) return ref.s;
    let t = `${S.inst} · ${S.doc}`;
    if (ref.p) t += (/^\d/.test(ref.p) ? ' · p. ' : ' · ') + ref.p;
    if (ref.t) t += ` · ${ref.t}`;
    return t;
  }
  function cite(refs) {
    refs = Array.isArray(refs) ? refs : [refs];
    return `<span class="srcs">${refs.map(r => {
      const S = SOURCES[r.s] || {};
      const short = `${S.short || S.inst}${r.p ? (/^\d/.test(r.p) ? ', p. ' : ', ') + r.p : ''}`;
      const full = srcText(r) + (S.note ? ' (' + S.note + ')' : '') + (S.url ? ' · ' + S.url : '');
      return `<button type="button" class="src" data-tip="${esc(full)}">${esc(short)}</button>`;
    }).join('')}</span>`;
  }
  const term = (key, text) => `<span class="term" tabindex="0" data-term="${key}">${text || (GLOSSARY[key] ? GLOSSARY[key][0] : key)}</span>`;

  /* ---- tooltip flotante (hover, foco y toque) ---- */
  const tip = () => document.getElementById('tip');
  let pinned = null;
  function showTip(target) {
    const t = tip(); let html = '';
    if (target.dataset.term && GLOSSARY[target.dataset.term]) {
      const [h, d] = GLOSSARY[target.dataset.term]; html = `<b>${esc(h)}</b>${esc(d)}`;
    } else if (target.dataset.tip) html = esc(target.dataset.tip);
    if (!html) return;
    t.innerHTML = html; t.hidden = false;
    const r = target.getBoundingClientRect(); const tw = t.offsetWidth, th = t.offsetHeight;
    let x = Math.min(window.innerWidth - tw - 8, Math.max(8, r.left + r.width / 2 - tw / 2));
    let y = r.top - th - 8; if (y < 8) y = r.bottom + 8;
    t.style.left = x + 'px'; t.style.top = y + 'px';
  }
  function hideTip() { if (!pinned) tip().hidden = true; }
  function initTips() {
    const sel = '[data-term],[data-tip]';
    document.addEventListener('mouseover', e => { const t = e.target.closest(sel); if (t) showTip(t); });
    document.addEventListener('mouseout', e => { const t = e.target.closest(sel); if (t && !pinned) hideTip(); });
    document.addEventListener('focusin', e => { const t = e.target.closest(sel); if (t) showTip(t); });
    document.addEventListener('focusout', e => { const t = e.target.closest(sel); if (t) { pinned = null; hideTip(); } });
    document.addEventListener('click', e => {
      const t = e.target.closest(sel);
      if (t) { pinned = t; showTip(t); } else { pinned = null; tip().hidden = true; }
    });
    window.addEventListener('scroll', () => { pinned = null; tip().hidden = true; }, { passive: true });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { pinned = null; tip().hidden = true; } });
  }

  /* ---- colores ---- */
  function colors() {
    return {
      fosil: css('--fosil'), nuclear: css('--nuclear'), renovable: css('--renovable'),
      ink: css('--ink'), ink2: css('--ink-2'), ink3: css('--ink-3'), line: css('--line'), surface: css('--surface'), surface2: css('--surface-2'),
      coral: css('--coral'), violet: css('--violet'), mint: css('--mint'), magenta: css('--magenta'), accent: css('--accent'),
      good: css('--good'), bad: css('--bad'),
      seq: [0, 1, 2, 3, 4, 5].map(i => css('--seq-' + i))
    };
  }
  const famColor = (tech) => colors()[FAMILY[tech] || 'fosil'];

  /* ---- gráficas (Chart.js) con registro para re-dibujar al cambiar tema ---- */
  const charts = new Map();
  function chart(id, build) {
    const cv = document.getElementById(id); if (!cv || !window.Chart) return null;
    if (charts.has(id)) charts.get(id).inst.destroy();
    const C = colors();
    Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = C.ink2;
    Chart.defaults.borderColor = C.line;
    const cfg = build(C);
    cfg.options = cfg.options || {};
    cfg.options.responsive = true; cfg.options.maintainAspectRatio = false;
    cfg.options.plugins = Object.assign({ legend: { display: false } }, cfg.options.plugins || {});
    cfg.options.plugins.tooltip = Object.assign({
      backgroundColor: '#1B1236', titleColor: '#FFC2A1', bodyColor: '#FFF6EF', padding: 10, cornerRadius: 10,
      titleFont: { family: 'Sora', weight: '700' }, boxPadding: 4
    }, cfg.options.plugins.tooltip || {});
    const inst = new Chart(cv, cfg);
    charts.set(id, { inst, build });
    return inst;
  }
  function redrawAll() { for (const [id, c] of charts) { if (document.getElementById(id)) chart(id, c.build); } }
  const axis = (C, extra = {}) => Object.assign({ grid: { color: C.line, drawTicks: false }, border: { display: false }, ticks: { color: C.ink2, padding: 6 } }, extra);
  const noGrid = (C, extra = {}) => Object.assign({ grid: { display: false }, border: { display: false }, ticks: { color: C.ink2 } }, extra);
  const barDs = (o) => Object.assign({ borderRadius: 4, borderSkipped: 'start', maxBarThickness: 34, borderWidth: 0 }, o);
  const legendHTML = (items) => `<div class="legend">${items.map(([c, l]) => `<span><i style="--c:${c}"></i>${l}</span>`).join('')}</div>`;

  /* ---- tabla accesible ---- */
  function table(head, rows, d = 0) {
    return `<details class="tbl"><summary>Ver tabla de datos</summary><div class="tblwrap"><table class="data"><thead><tr>${head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${typeof c === 'number' ? fmt(c, d) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
  }

  /* ---- segmentos y chips ---- */
  function seg(container, options, value, onChange) {
    container.innerHTML = options.map(o => `<button type="button" data-v="${o.v}" aria-pressed="${o.v == value}">${o.l}</button>`).join('');
    container.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      container.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
      onChange(b.dataset.v);
    });
  }

  /* ---- mapas (Leaflet sin teselas externas: solo límites INEGI/CONABIO) ---- */
  const geoCache = {};
  async function geo(name) {
    if (!geoCache[name]) geoCache[name] = fetch(`data/${name}.json`).then(r => r.json());
    return geoCache[name];
  }
  function baseMap(id, opts = {}) {
    const m = L.map(id, Object.assign({ zoomSnap: 0.25, minZoom: 3.5, maxZoom: 10, attributionControl: true, scrollWheelZoom: false }, opts));
    m.setView([23.6, -102.3], 4.75);
    m.attributionControl.setPrefix(false);
    m.attributionControl.addAttribution('Límites: CONABIO/INEGI 2022');
    return m;
  }
  const haversine = (a, b) => {
    const R = 6371, r = Math.PI / 180, dLa = (b[0] - a[0]) * r, dLo = (b[1] - a[1]) * r;
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLo / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  const logTick = (f) => (v) => { const m = v / 10 ** Math.floor(Math.log10(v)); return [1, 2, 5].includes(Math.round(m * 100) / 100) ? f(v) : ''; };
  return { logTick, fmt, pct, css, esc, el, sum, cite, srcText, term, initTips, colors, famColor, chart, redrawAll, axis, noGrid, barDs, legendHTML, table, seg, geo, baseMap, haversine };
})();
