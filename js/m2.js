/* Módulo 2 · Transmisión eléctrica */
window.M2 = (() => {
  const { fmt, pct, cite, term, chart, axis, noGrid, barDs, legendHTML, table, seg, colors } = UI;
  let map, sysLayer, ctrLayer, st = { sys: 'all', kvYear: '2023' };
  const sim = { P: 300, V: 400, R: 5, pf: 1 };

  function render(root) {
    const tx = TX.kmByKv, i23 = 2;
    root.innerHTML = `
    <div class="mod-head">
      <span class="kicker">Módulo 2</span>
      <h1 id="h-m2">Transmisión eléctrica</h1>
      <p>La ${term('rnt', 'Red Nacional de Transmisión')} lleva la energía a grandes distancias en alta tensión (69 kV o más). México tiene cuatro sistemas eléctricos; tres de ellos están en la península de Baja California y no se conectan con el ${term('sin', 'SIN')}.</p>
    </div>
    <div class="grid">
      <div class="kpis">
        <div class="kpi" style="--k:var(--accent)"><span class="kl">Líneas de transmisión 2023</span><span class="kv">${fmt(tx.total[i23])}<span class="ku">km</span></span><span class="kd">RNT de 69 a 400 kV · CENACE ${cite(tx.src)}</span></div>
        <div class="kpi" style="--k:var(--coral)"><span class="kl">Líneas de CFE Transmisión 2024</span><span class="kv">${fmt(TX.cfeTx.km[2])}<span class="ku">km</span></span><span class="kd">${cite(TX.cfeTx.src)}</span></div>
        <div class="kpi" style="--k:var(--magenta)"><span class="kl">Red de 400 kV</span><span class="kv">${fmt(tx.kv['400 kV'][i23])}<span class="ku">km</span></span><span class="kd">${pct(tx.kv['400 kV'][i23] / tx.total[i23] * 100)} de la RNT (2023)</span></div>
        <div class="kpi" style="--k:var(--renovable)"><span class="kl">Subestaciones de CFE 2024</span><span class="kv">${fmt(TX.cfeTx.subest[2])}</span><span class="kd">${fmt(TX.cfeTx.mva[2])} MVA de transformación</span></div>
        <div class="kpi" style="--k:var(--mint)"><span class="kl">Transformación RNT + RGD del MEM 2023</span><span class="kv">${fmt(TX.transf.total[2])}<span class="ku">MVA</span></span><span class="kd">${cite(TX.transf.src)}</span></div>
      </div>

      <div class="sec-title"><span class="num">2.1</span><h2>Mapa de los sistemas eléctricos</h2></div>
      <div class="card c8">
        <div class="filters"><span class="flab">Sistema</span><div class="seg" id="t-sys"></div></div>
        <div id="t-map" class="map" role="region" aria-label="Mapa de sistemas interconectados"></div>
        <p class="note">Los polígonos son una representación aproximada con límites estatales y municipales (INEGI/CONABIO): el SIBC con el estado de Baja California, el SIMUL con el municipio de Mulegé y el SIBCS con el resto de Baja California Sur. Los límites eléctricos reales no coinciden exactamente (ver Figura A1.1). No se dibujan trayectorias de líneas porque las fuentes no traen su geometría.</p>
        ${cite([{ s: 'P24', p: '155', t: 'Figura A1.1' }, { s: 'GEO' }])}
      </div>
      <div class="card c4">
        <h2>¿Quién se conecta con quién?</h2>
        <div class="schem" id="t-schem"></div>
        <div id="t-sysinfo" class="stage-info" aria-live="polite"></div>
      </div>

      <div class="sec-title"><span class="num">2.2</span><h2>Indicadores de la red</h2></div>
      <div class="card c7">
        <div class="card-h"><div><h2>Longitud de líneas por nivel de tensión</h2><p class="sub">km de la RNT</p></div><div class="seg" id="t-kvy"></div></div>
        <div class="chart"><canvas id="t-kv" aria-label="Kilómetros por nivel de tensión"></canvas></div>
        ${table(['Tensión', ...tx.years.map(String)], Object.entries(tx.kv).map(([k, a]) => [k, ...a]).concat([['Total', ...tx.total]]))}
        ${cite(tx.src)}
      </div>
      <div class="card c5">
        <div class="card-h"><div><h2>Capacidad de transformación</h2><p class="sub">MVA efectivos en subestaciones</p></div></div>
        <div class="chart"><canvas id="t-tr" aria-label="Capacidad de transformación"></canvas></div>
        ${legendHTML([['var(--accent)', 'Bancos de la RNT'], ['var(--renovable)', 'Bancos de las RGD del MEM']])}
        ${cite(TX.transf.src)}
      </div>
      <div class="card c12">
        <div class="card-h"><div><h2>Consumo neto por sistema, 2021–2023</h2><p class="sub">Cada sistema tiene su propia escala para que se vean los sistemas pequeños. GWh.</p></div></div>
        <div class="grid" style="padding:0">
          ${['SIN', 'SIBC', 'SIBCS', 'SIMUL'].map(s => `<div class="c3" style="min-width:0"><h3>${s}</h3><div class="chart xs"><canvas id="t-c-${s}" aria-label="Consumo ${s}"></canvas></div><p class="note">${fmt(TX.consumo.sys[s][2])} GWh en 2023 (${pct(TX.consumo.sys[s][2] / TX.consumo.sen[2] * 100, 2)} del SEN)</p></div>`).join('')}
        </div>
        ${cite(TX.consumo.src)}
      </div>
      <div class="card c6">
        <h2>CFE Transmisión, 2022–2024</h2>
        ${table(['Indicador', '2022', '2023', '2024'], [['Líneas (km)', ...TX.cfeTx.km], ['Subestaciones', ...TX.cfeTx.subest], ['Transformación (MVA)', ...TX.cfeTx.mva]])}
        <div class="callout warn"><b>Inconsistencia entre fuentes:</b> para 2023, CENACE (PRODESEN) reporta ${fmt(tx.total[2])} km y CFE Transmisión ${fmt(TX.cfeTx.km[1])} km. La diferencia (${fmt(tx.total[2] - TX.cfeTx.km[1])} km) puede deberse a criterios de inventario distintos; aquí se muestran ambas cifras con su fuente.</div>
        ${cite([TX.cfeTx.src, tx.src])}
      </div>
      <div class="card c6">
        <h2>Intercambio internacional</h2>
        <div class="chart sm"><canvas id="t-ie" aria-label="Importación y exportación"></canvas></div>
        ${legendHTML([['var(--accent)', 'Importación (GWh)'], ['var(--coral)', 'Exportación (GWh)']])}
        ${cite(TX.impExp.src)}
      </div>

      <div class="sec-title" id="distancias"><span class="num">2.3</span><h2>Distancias entre regiones</h2></div>
      <div class="card c12">
        <p class="sub">Distancia en línea recta entre las sedes de dos centros de control regional. Las líneas reales siguen rutas más largas.</p>
        <div class="filters">
          <select id="t-d1" aria-label="Centro de origen" style="padding:8px;border-radius:10px;border:1px solid var(--line-2);background:var(--surface)"></select>
          <span aria-hidden="true">↔</span>
          <select id="t-d2" aria-label="Centro de destino" style="padding:8px;border-radius:10px;border:1px solid var(--line-2);background:var(--surface)"></select>
          <div class="kpi" style="--k:var(--coral);min-width:220px"><span class="kl">Distancia en línea recta</span><span class="kv" id="t-dv">—</span><span class="kd" id="t-dd"></span></div>
        </div>
        <p class="note">Cálculo propio con la fórmula del haversine (radio terrestre 6,371 km) usando el punto interior de cada municipio sede (INEGI/CONABIO). Sedes: PRODESEN 2024-2038, p. 155.</p>
        ${cite([{ s: 'P24', p: '155' }, { s: 'GEO' }, { s: 'CALC' }])}
      </div>

      <div class="sec-title" id="simulador"><span class="num">2.4</span><h2>Simulador de transmisión</h2></div>
      <div class="card c12">
        <div class="sim">
          <div class="ctrl" id="t-ctrl">
            ${slider('P', 'Potencia transmitida P', 10, 1500, 10, sim.P, 'MW')}
            ${slider('V', 'Tensión entre líneas V', 69, 400, 1, sim.V, 'kV')}
            <div class="chips" role="group" aria-label="Tensiones típicas">${[69, 115, 230, 400].map(v => `<button type="button" class="chip" data-kv="${v}" aria-pressed="false">${v} kV</button>`).join('')}</div>
            ${slider('R', 'Resistencia equivalente por fase R', 0.1, 50, 0.1, sim.R, 'Ω')}
            ${slider('pf', 'Factor de potencia cos φ', 0.7, 1, 0.01, sim.pf, '')}
            <div class="formula">
              <span>I = P / (√3 · V · cos φ)</span>
              <span>P<sub>pérdidas</sub> = 3 · I² · R</span>
            </div>
          </div>
          <div style="display:grid;gap:12px;min-width:0">
            <div class="out" id="t-out" aria-live="polite"></div>
            <div class="grid" style="padding:0">
              <div class="c6" style="min-width:0"><h3>Pérdidas (% de P) según la tensión</h3><div class="chart sm"><canvas id="t-sim-l" aria-label="Pérdidas contra tensión"></canvas></div></div>
              <div class="c6" style="min-width:0"><h3>Corriente por fase según la tensión</h3><div class="chart sm"><canvas id="t-sim-i" aria-label="Corriente contra tensión"></canvas></div></div>
            </div>
            <div class="assume"><b>Supuestos y limitaciones del modelo:</b>
              <ul>
                <li>Sistema trifásico balanceado; P es potencia activa total y V la tensión de línea (entre fases), en valor eficaz.</li>
                <li>Solo pérdidas resistivas (efecto Joule) en una resistencia equivalente por fase. No incluye reactancia, efecto corona, caída de tensión, efecto piel, temperatura ni pérdidas en transformadores.</li>
                <li>R es un valor que eliges tú para ilustrar el efecto; no corresponde a una línea real específica. La resistencia de una línea depende de su longitud, calibre y material.</li>
                <li>Con cos φ menor a 1 circula más corriente para la misma potencia activa, por eso las pérdidas crecen.</li>
                <li>Por defecto cos φ = 1 (factor de potencia unitario).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    seg(root.querySelector('#t-sys'), [{ v: 'all', l: 'Todos' }, { v: 'SIN', l: 'SIN' }, { v: 'SIBC', l: 'SIBC' }, { v: 'SIBCS', l: 'SIBCS' }, { v: 'SIMUL', l: 'SIMUL' }], st.sys, v => { st.sys = v; styleSys(); sysInfo(v === 'all' ? null : v); });
    seg(root.querySelector('#t-kvy'), TX.kmByKv.years.map(y => ({ v: String(y), l: String(y) })), st.kvYear, v => { st.kvYear = v; kvChart(); });
    schematic(root); sysInfo(null); charts(); kvChart(); distances(root); simInit(root); initMap();
  }

  const slider = (k, label, min, max, step, v, u) => `<label for="t-${k}">${label}<span class="row"><input type="range" id="t-${k}r" min="${min}" max="${max}" step="${step}" value="${v}" aria-label="${label}"><input type="number" id="t-${k}" min="${min}" max="${max}" step="${step}" value="${v}"><span class="u">${u}</span></span></label>`;

  function schematic(root) {
    root.querySelector('#t-schem').innerHTML = `
      <svg viewBox="0 0 320 250" role="img" aria-labelledby="schT">
        <title id="schT">Esquema: el SIN se enlaza con Texas; el SIBC se enlaza con el WECC por dos líneas de 230 kV; SIBCS y SIMUL están aislados; no hay enlace entre el SIN y el SIBC.</title>
        <g class="sys-box" data-s="SIBC" tabindex="0"><rect x="10" y="20" width="90" height="44" rx="10" fill="var(--magenta)" fill-opacity=".18" stroke="var(--magenta)"/><text x="55" y="47" text-anchor="middle" font-size="13" font-weight="700">SIBC</text></g>
        <g class="sys-box" data-s="SIMUL" tabindex="0"><rect x="10" y="100" width="90" height="44" rx="10" fill="var(--coral)" fill-opacity=".18" stroke="var(--coral)"/><text x="55" y="127" text-anchor="middle" font-size="13" font-weight="700">SIMUL</text></g>
        <g class="sys-box" data-s="SIBCS" tabindex="0"><rect x="10" y="180" width="90" height="44" rx="10" fill="var(--renovable)" fill-opacity=".18" stroke="var(--renovable)"/><text x="55" y="207" text-anchor="middle" font-size="13" font-weight="700">SIBCS</text></g>
        <g class="sys-box" data-s="SIN" tabindex="0"><rect x="170" y="90" width="140" height="64" rx="12" fill="var(--accent)" fill-opacity=".18" stroke="var(--accent)"/><text x="240" y="118" text-anchor="middle" font-size="14" font-weight="700">SIN</text><text x="240" y="138" text-anchor="middle" font-size="11" fill="var(--ink-2)">7 regiones de control</text></g>
        <rect x="170" y="8" width="140" height="40" rx="10" fill="none" stroke="var(--ink-3)" stroke-dasharray="4 3"/><text x="240" y="32" text-anchor="middle" font-size="12" fill="var(--ink-2)">EE. UU.: WECC · Texas</text>
        <path d="M100 38 C140 30,150 28,170 28" stroke="var(--magenta)" stroke-width="3" fill="none"/><text x="118" y="22" font-size="10.5" fill="var(--ink-2)">2 × 230 kV</text>
        <path d="M262 90 L262 48" stroke="var(--accent)" stroke-width="3"/><text x="268" y="74" font-size="10.5" fill="var(--ink-2)">enlaces</text>
        <path d="M100 60 L170 110" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 4"/><text x="114" y="96" font-size="16" fill="var(--bad)" font-weight="700">✕</text>
        <text x="110" y="168" font-size="10.5" fill="var(--ink-3)">aislados</text>
      </svg>`;
    root.querySelectorAll('.sys-box').forEach(g => {
      const go = () => { st.sys = g.dataset.s; root.querySelectorAll('#t-sys button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === st.sys)); styleSys(); sysInfo(st.sys); };
      g.addEventListener('click', go); g.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    });
  }
  function sysInfo(s) {
    const box = document.getElementById('t-sysinfo');
    if (!s) { box.innerHTML = `<b>Cuatro sistemas.</b> El SIN y el SIBC tienen enlaces con Estados Unidos, pero no entre sí. El SIBCS y el SIMUL están aislados. Selecciona un sistema en el mapa o en el esquema. ${cite({ s: 'P24', p: '155, 158' })}`; return; }
    const S = SYSTEMS[s], c = TX.consumo.sys[s];
    const inc = TX.consumo.inc[s][2];
    box.innerHTML = `<b>${S.name} (${S.short})</b><br>${S.desc}<br><span class="note">Enlaces: ${S.link}</span><br>Consumo neto 2023: <b>${fmt(c[2])} GWh</b> (${inc >= 0 ? '+' : ''}${pct(inc)} vs 2022). ${cite([S.src, TX.consumo.src])}`;
  }
  function sysColor(C, s) { return { SIN: C.accent, SIBC: C.magenta, SIBCS: C.renovable, SIMUL: C.coral }[s]; }
  async function initMap() {
    map = UI.baseMap('t-map');
    const g = await UI.geo('systems'); const states = await UI.geo('states'); const C = colors();
    const stL = L.geoJSON(states, { style: () => ({ color: C.line, weight: .6, fill: false }), interactive: false }).addTo(map);
    map.fitBounds(stL.getBounds(), { padding: [8, 8] });
    sysLayer = L.geoJSON(g, {
      style: f => ({ color: sysColor(C, f.properties.SYS), weight: 2, fillColor: sysColor(C, f.properties.SYS), fillOpacity: .22 }),
      onEachFeature: (f, l) => { l.bindTooltip(SYSTEMS[f.properties.SYS].name, { sticky: true }); l.on('click', () => { st.sys = f.properties.SYS; document.querySelectorAll('#t-sys button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === st.sys)); styleSys(); sysInfo(st.sys); }); }
    }).addTo(map);
    ctrLayer = L.layerGroup().addTo(map);
    TX.centros.forEach(c => {
      L.circleMarker([c.lat, c.lon], { radius: 6, color: '#1B1236', weight: 2, fillColor: '#FFF6EF', fillOpacity: 1 })
        .bindPopup(`<h4>${c.n}</h4><dl><dt>Sede</dt><dd>${c.c}</dd><dt>Sistema</dt><dd>${SYSTEMS[c.sys].short}</dd></dl><p class="note">Ubicación aproximada: punto interior del municipio. Fuente: ${UI.srcText({ s: 'P24', p: '155' })}</p>`)
        .bindTooltip(c.n).addTo(ctrLayer);
    });
    const lg = L.control({ position: 'bottomleft' });
    lg.onAdd = () => { const d = L.DomUtil.create('div', 'map-legend'); d.innerHTML = `<b>Sistemas</b><br>${['SIN', 'SIBC', 'SIBCS', 'SIMUL'].map(s => `<i class="sq" style="background:${sysColor(colors(), s)}"></i>${s}`).join('<br>')}<br><i style="background:#FFF6EF;border:2px solid #1B1236"></i>Centro de control`; return d; };
    lg.addTo(map);
  }
  function styleSys(noFly) {
    if (!sysLayer) return; const C = colors();
    sysLayer.setStyle(f => { const on = st.sys === 'all' || st.sys === f.properties.SYS; return { color: sysColor(C, f.properties.SYS), weight: on ? 2.5 : 1, fillColor: sysColor(C, f.properties.SYS), fillOpacity: on ? .32 : .06 }; });
    if (noFly) return;
    if (st.sys !== 'all') { const lyr = sysLayer.getLayers().find(l => l.feature.properties.SYS === st.sys); if (lyr) map.flyToBounds(lyr.getBounds(), { padding: [30, 30], duration: .6, maxZoom: 7 }); }
    else map.flyToBounds(sysLayer.getBounds(), { padding: [8, 8], duration: .6 });
  }

  function kvChart() {
    const i = TX.kmByKv.years.indexOf(+st.kvYear); const kv = Object.entries(TX.kmByKv.kv);
    chart('t-kv', C => ({
      type: 'bar', data: { labels: kv.map(r => r[0]), datasets: [barDs({ data: kv.map(r => r[1][i]), backgroundColor: kv.map(r => ['400 kV', '230 kV', '161 kV'].includes(r[0]) ? C.accent : C.renovable) })] },
      options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'km', color: C.ink2 } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} km · ${pct(x.raw / TX.kmByKv.total[i] * 100)} de la RNT` } } } }
    }));
  }
  function charts() {
    chart('t-tr', C => ({
      type: 'bar', data: { labels: TX.transf.years, datasets: [barDs({ label: 'RNT', data: TX.transf.rnt, backgroundColor: C.accent }), barDs({ label: 'RGD del MEM', data: TX.transf.rgd, backgroundColor: C.renovable })] },
      options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'MVA', color: C.ink2 } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${fmt(x.raw)} MVA` } } } }
    }));
    ['SIN', 'SIBC', 'SIBCS', 'SIMUL'].forEach(s => chart('t-c-' + s, C => ({
      type: 'bar', data: { labels: TX.consumo.years, datasets: [barDs({ data: TX.consumo.sys[s], backgroundColor: sysColor(C, s) })] },
      options: { scales: { x: noGrid(C), y: axis(C, { beginAtZero: true, ticks: { color: C.ink2, maxTicksLimit: 4, callback: v => fmt(v) } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} GWh` } } } }
    })));
    chart('t-ie', C => ({
      type: 'bar', data: { labels: TX.impExp.years, datasets: [barDs({ label: 'Importación', data: TX.impExp.imp, backgroundColor: C.accent }), barDs({ label: 'Exportación', data: TX.impExp.exp, backgroundColor: C.coral })] },
      options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'GWh', color: C.ink2 } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${fmt(x.raw)} GWh` } } } }
    }));
  }

  function distances(root) {
    const a = root.querySelector('#t-d1'), b = root.querySelector('#t-d2');
    const opts = TX.centros.map((c, i) => `<option value="${i}">${c.c} · ${c.n}</option>`).join('');
    a.innerHTML = opts; b.innerHTML = opts; a.value = 7; b.value = 3;
    const go = () => { const p = TX.centros[a.value], q = TX.centros[b.value]; const d = UI.haversine([p.lat, p.lon], [q.lat, q.lon]); root.querySelector('#t-dv').innerHTML = `${fmt(d)}<span class="ku">km</span>`; root.querySelector('#t-dd').textContent = p.sys === q.sys ? `Ambos en el ${q.sys}` : `${p.sys} y ${q.sys} no están conectados eléctricamente`; };
    a.addEventListener('change', go); b.addEventListener('change', go); go();
  }

  /* ---------- simulador ---------- */
  const calc = (P, V, R, pf) => { const I = (P * 1e6) / (Math.sqrt(3) * V * 1e3 * pf); const loss = 3 * I * I * R; return { I, loss, pctLoss: loss / (P * 1e6) * 100 }; };
  function simInit(root) {
    ['P', 'V', 'R', 'pf'].forEach(k => {
      const r = root.querySelector(`#t-${k}r`), n = root.querySelector(`#t-${k}`);
      const set = (v) => { v = Math.min(+r.max, Math.max(+r.min, +v || +r.min)); sim[k] = v; r.value = v; n.value = v; simDraw(root); };
      r.addEventListener('input', () => set(r.value)); n.addEventListener('change', () => set(n.value));
    });
    root.querySelectorAll('[data-kv]').forEach(b => b.addEventListener('click', () => { sim.V = +b.dataset.kv; root.querySelector('#t-Vr').value = sim.V; root.querySelector('#t-V').value = sim.V; simDraw(root); }));
    simDraw(root);
  }
  function simDraw(root) {
    const { I, loss, pctLoss } = calc(sim.P, sim.V, sim.R, sim.pf);
    const at115 = calc(sim.P, 115, sim.R, sim.pf).loss, at400 = calc(sim.P, 400, sim.R, sim.pf).loss;
    root.querySelectorAll('[data-kv]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.kv === sim.V));
    root.querySelector('#t-out').innerHTML = `
      <div class="o"><div class="ol">Corriente por fase I</div><div class="ov">${fmt(I, 1)} A</div></div>
      <div class="o"><div class="ol">Pérdidas resistivas</div><div class="ov">${fmt(loss / 1e6, 3)} MW</div></div>
      <div class="o"><div class="ol">Pérdidas / P</div><div class="ov" style="color:${pctLoss > 10 ? 'var(--bad)' : 'inherit'}">${fmt(pctLoss, 2)} %</div></div>
      <div class="o"><div class="ol">Si fuera 115 kV en vez de 400 kV</div><div class="ov">×${fmt(at115 / at400, 1)}</div></div>
      ${pctLoss > 30 ? '<div class="o" style="grid-column:1/-1;color:var(--bad)">Las pérdidas superan el 30 % de P: en la práctica esta combinación no se usaría (el modelo deja de ser realista).</div>' : ''}`;
    const Vs = []; for (let v = 69; v <= 400.01; v += 3.31) Vs.push(+v.toFixed(1));
    if (!Vs.includes(400)) Vs.push(400);
    const ptsL = Vs.map(v => ({ x: v, y: calc(sim.P, v, sim.R, sim.pf).pctLoss }));
    const ptsI = Vs.map(v => ({ x: v, y: calc(sim.P, v, sim.R, sim.pf).I }));
    const common = (C, ylab, fmtY) => ({ parsing: false, animation: false, scales: { x: axis(C, { type: 'linear', min: 60, max: 400, title: { display: true, text: 'Tensión entre líneas (kV)', color: C.ink2 } }), y: axis(C, { type: 'logarithmic', title: { display: true, text: ylab, color: C.ink2 }, ticks: { color: C.ink2, autoSkip: true, callback: (v) => { const m = v / 10 ** Math.floor(Math.log10(v)); return [1, 2, 5].includes(Math.round(m * 100) / 100) ? fmtY(v) : ''; } } }) },
      plugins: { tooltip: { callbacks: { title: it => `${fmt(it[0].raw.x, 1)} kV`, label: x => ' ' + fmtY(x.raw.y) } } } });
    chart('t-sim-l', C => ({ type: 'line', data: { datasets: [{ data: ptsL, borderColor: C.fosil, borderWidth: 2, pointRadius: 0 }, { type: 'scatter', data: [{ x: sim.V, y: pctLoss }], backgroundColor: C.fosil, borderColor: C.surface, borderWidth: 2, pointRadius: 7 }] }, options: common(C, 'Pérdidas (% de P), escala log', v => (v >= 1 ? fmt(v, 1) : v >= 0.01 ? fmt(v, 2) : v.toExponential(0)) + ' %') }));
    chart('t-sim-i', C => ({ type: 'line', data: { datasets: [{ data: ptsI, borderColor: C.accent, borderWidth: 2, pointRadius: 0 }, { type: 'scatter', data: [{ x: sim.V, y: I }], backgroundColor: C.accent, borderColor: C.surface, borderWidth: 2, pointRadius: 7 }] }, options: common(C, 'Corriente (A), escala log', v => fmt(v) + ' A') }));
  }

  function onShow() { if (map) setTimeout(() => map.invalidateSize(), 50); }
  function onTheme() { if (sysLayer) styleSys(true); }
  return { render, onShow, onTheme, calc };
})();
