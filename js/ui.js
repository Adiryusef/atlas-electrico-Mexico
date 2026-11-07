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
  /* Mapa base simple (sin mosaicos): solo límites estatales. Lo usan los módulos que aún no pasan al estilo Google. */
  function baseMap(id, opts = {}) {
    if (opts.google) return googleMap(id, opts);
    const m = L.map(id, Object.assign({ zoomSnap: 0.25, minZoom: 3.5, maxZoom: 10, attributionControl: true, scrollWheelZoom: false }, opts));
    m.setView([23.6, -102.3], 4.75);
    m.attributionControl.setPrefix(false);
    m.attributionControl.addAttribution('Límites: CONABIO/INEGI 2022');
    return m;
  }

  /* ---- Mapa con estilo Google Maps ----
     Capa 1 (siempre): fondo vectorial propio con la paleta de Google (agua azul, tierra gris cálido, límites punteados,
     nombres de estados, países y mares) que se ve aunque no haya internet.
     Capa 2: mosaicos abiertos CARTO Voyager (claro) o Dark Matter (oscuro); en «Satélite», imágenes Esri con etiquetas.
     Si los mosaicos no cargan, queda visible solo la capa 1. Google no permite usar sus mosaicos sin llave de API y facturación. */
  const GM = {
    light: { water: '#aadaff', land: '#f2efe9', other: '#e8e6df', line: '#c4c0b5', state: '#bdb8ab', lab: '#7a7468', sea: '#5b8db8',
      tiles: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' },
    dark: { water: '#0f1b2e', land: '#2a2940', other: '#222236', line: '#46446a', state: '#4d4b72', lab: '#a39fc4', sea: '#5f7ea8',
      tiles: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' }
  };
  const SAT = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const SAT_LAB = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
  const isDark = () => { const t = document.documentElement.getAttribute('data-theme'); return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; };
  const SEA_LABELS = [['Océano Pacífico', 17.5, -110.5], ['Golfo de México', 25.2, -92.8], ['Golfo de California', 26.2, -110.0], ['Mar Caribe', 17.3, -83.3]];
  const ST_SHORT = { 'Coahuila de Zaragoza': 'Coahuila', 'Veracruz de Ignacio de la Llave': 'Veracruz', 'Michoacán de Ocampo': 'Michoacán', 'Ciudad de México': 'CDMX', 'México': 'Edo. Méx.', 'Baja California Sur': 'Baja California Sur', 'Quintana Roo': 'Q. Roo' };
  const COUNTRY_LABELS = [['Estados Unidos', 33.2, -104.5], ['Guatemala', 15.5, -90.6], ['Belice', 17.2, -88.7], ['Cuba', 21.9, -79.5]];

  function googleMap(id, opts) {
    const m = L.map(id, Object.assign({ zoomSnap: 0.25, minZoom: 4, maxZoom: 13, attributionControl: true, scrollWheelZoom: false, zoomControl: true }, opts));
    m.setView([23.6, -102.3], 4.75);
    m.attributionControl.setPrefix(false);
    m.getContainer().classList.add('gm');
    m.createPane('vec').style.zIndex = 150;
    m.createPane('fbl').style.zIndex = 450; m.getPane('fbl').style.pointerEvents = 'none';
    const st = { mode: 'mapa', loaded: 0, failed: 0, fb: false };
    const tiles = L.tileLayer(GM.light.tiles, { maxZoom: 13, subdomains: 'abcd', attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · © <a href="https://carto.com/attributions">CARTO</a>' });
    const sat = L.tileLayer(SAT, { maxZoom: 13, attribution: 'Imágenes © Esri, Maxar, Earthstar Geographics' });
    const satLab = L.tileLayer(SAT_LAB, { maxZoom: 13 });
    const vec = { countries: null, states: null, labels: L.layerGroup() };
    let note;
    const C = () => (isDark() ? GM.dark : GM.light);

    function paint() {
      const c = C(), dark = isDark();
      m.getContainer().style.background = st.mode === 'sat' ? '#0b1a2a' : c.water;
      m.getContainer().classList.toggle('gm-dark', dark);
      tiles.setUrl(c.tiles);
      if (vec.countries) vec.countries.setStyle({ fillColor: c.other, color: c.other, weight: 1.2, fillOpacity: 1 });
      if (vec.states) vec.states.setStyle({ fillColor: c.land, color: c.state, weight: 0.9, dashArray: '3 3', fillOpacity: 1 });
      vec.labels.eachLayer(l => { const e = l.getElement && l.getElement(); if (e) e.classList.toggle('gm-lab-dark', dark); });
    }
    function setFallback(on) {
      st.fb = on;
      if (on) { vec.labels.addTo(m); } else { m.removeLayer(vec.labels); }
      if (note) note.getContainer().style.display = on && st.mode === 'mapa' ? '' : 'none';
    }
    tiles.on('tileload', () => { st.loaded++; if (st.fb) setFallback(false); });
    tiles.on('tileerror', () => { st.failed++; if (!st.loaded && !st.fb && st.mode === 'mapa') setFallback(true); });

    function setMode(mode) {
      st.mode = mode;
      [tiles, sat, satLab].forEach(l => { if (m.hasLayer(l)) m.removeLayer(l); });
      if (mode === 'sat') { sat.addTo(m); satLab.addTo(m); if (st.fb) setFallback(false); }
      else { tiles.addTo(m); if (!st.loaded && st.failed) setFallback(true); }
      paint();
      ctl.getContainer().querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode));
    }
    const ctl = L.control({ position: 'topright' });
    ctl.onAdd = () => {
      const d = L.DomUtil.create('div', 'gm-switch leaflet-bar');
      d.innerHTML = '<button type="button" data-mode="mapa" aria-pressed="true">Mapa</button><button type="button" data-mode="sat" aria-pressed="false">Satélite</button>';
      L.DomEvent.disableClickPropagation(d);
      d.addEventListener('click', e => { const b = e.target.closest('button'); if (b) setMode(b.dataset.mode); });
      return d;
    };
    ctl.addTo(m);
    const nc = L.control({ position: 'topright' });
    nc.onAdd = () => { const d = L.DomUtil.create('div', 'gm-note'); d.textContent = 'Mapa simplificado: sin conexión a mosaicos'; d.style.display = 'none'; return d; };
    nc.addTo(m); note = nc;
    tiles.addTo(m);

    m.gmReady = Promise.all([geo('context'), geo('states')]).then(([ctx, sts]) => {
      const c = C();
      vec.countries = L.geoJSON(ctx, { pane: 'vec', interactive: false, style: () => ({ fillColor: c.other, color: c.other, weight: 1.2, fillOpacity: 1 }) }).addTo(m);
      vec.states = L.geoJSON(sts, { pane: 'vec', interactive: false, style: () => ({ fillColor: c.land, color: c.state, weight: 0.9, dashArray: '3 3', fillOpacity: 1 }) }).addTo(m);
      const lab = (txt, ll, cls) => L.marker(ll, { pane: 'fbl', interactive: false, keyboard: false, icon: L.divIcon({ className: 'gm-lab ' + cls, html: `<span>${txt}</span>`, iconSize: [0, 0] }) });
      SEA_LABELS.forEach(([t, la, lo]) => vec.labels.addLayer(lab(t, [la, lo], 'sea')));
      COUNTRY_LABELS.forEach(([t, la, lo]) => vec.labels.addLayer(lab(t, [la, lo], 'cty')));
      vec.states.eachLayer(l => { const n = l.feature.properties.NOM_ENT; vec.labels.addLayer(lab(ST_SHORT[n] || n, l.getBounds().getCenter(), 'st')); });
      if (st.fb) vec.labels.addTo(m);
      paint();
      m.gmBounds = vec.states.getBounds();
      return m.gmBounds;
    });
    m.refreshTheme = paint;
    return m;
  }

  /* Marcador tipo «pin» de Google Maps, escalado por categoría de capacidad */
  function pinIcon(color, size = 26) {
    const w = size, h = Math.round(size * 1.35);
    return L.divIcon({
      className: 'gm-pin', iconSize: [w, h], iconAnchor: [w / 2, h - 1], popupAnchor: [0, -h + 6], tooltipAnchor: [w / 2 - 2, -h / 2],
      html: `<svg viewBox="0 0 24 32" width="${w}" height="${h}" aria-hidden="true"><path d="M12 .8C5.8.8.8 5.7.8 11.8c0 8.2 11.2 19.4 11.2 19.4s11.2-11.2 11.2-19.4C23.2 5.7 18.2.8 12 .8z" fill="${color}" stroke="rgba(0,0,0,.35)" stroke-width="1"/><circle cx="12" cy="11.8" r="4.2" fill="#fff"/></svg>`
    });
  }
  const haversine = (a, b) => {
    const R = 6371, r = Math.PI / 180, dLa = (b[0] - a[0]) * r, dLo = (b[1] - a[1]) * r;
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLo / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  const logTick = (f) => (v) => { const m = v / 10 ** Math.floor(Math.log10(v)); return [1, 2, 5].includes(Math.round(m * 100) / 100) ? f(v) : ''; };
  return { logTick, fmt, pct, css, esc, el, sum, cite, srcText, term, initTips, colors, famColor, chart, redrawAll, axis, noGrid, barDs, legendHTML, table, seg, geo, baseMap, pinIcon, isDark, haversine };
})();
