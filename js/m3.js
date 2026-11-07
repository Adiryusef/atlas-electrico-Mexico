/* Módulo 3 · Distribución eléctrica */
window.M3 = (() => {
  const { fmt, pct, cite, term, chart, axis, noGrid, barDs, legendHTML, table, seg, colors, sum, isDark } = UI;
  let map, divLayer, st = { met: 'saidi24', div: null };
  const tr = { Vp: 13200, a: 60, S: 75, ph: '1' };

  function render(root) {
    const R = DIST.rgd, i = 2;
    root.innerHTML = `
    <div class="mod-head">
      <span class="kicker">Módulo 3</span>
      <h1 id="h-m3">Distribución eléctrica</h1>
      <p>Las ${term('rgd', 'Redes Generales de Distribución')} reducen la tensión y llevan la energía hasta cada usuario. CFE Distribución opera ${DIST.divisiones} divisiones y ${DIST.zonas} zonas.</p>
    </div>
    <div class="grid">
      <div class="kpis">
        <div class="kpi" style="--k:var(--accent)"><span class="kl">Usuarios atendidos 2024</span><span class="kv">${fmt(DIST.usuarios.v, 1)}<span class="ku">millones</span></span><span class="kd">${cite(DIST.usuarios.src)}</span></div>
        <div class="kpi" style="--k:var(--coral)"><span class="kl">Redes de distribución</span><span class="kv">${fmt(DIST.kmRGD.v / 1000)}<span class="ku">mil km</span></span><span class="kd">${cite(DIST.kmRGD.src)}</span></div>
        <div class="kpi" style="--k:var(--fosil)"><span class="kl">Pérdidas de energía 2024</span><span class="kv">${pct(DIST.perdidas.total[2], 2)}</span><span class="kd">Incluye alta tensión · MT+BT: ${pct(DIST.perdidas.mtbt[2], 2)}</span></div>
        <div class="kpi" style="--k:var(--renovable)"><span class="kl">${term('saidi', 'SAIDI')} 2024</span><span class="kv">${fmt(DIST.saidi.v[2], 1)}<span class="ku">min/usuario</span></span><span class="kd">${term('saifi', 'SAIFI')}: ${fmt(DIST.saidi.saifi[2], 3)} interrupciones</span></div>
        <div class="kpi" style="--k:var(--mint)"><span class="kl">Electrificación 2024</span><span class="kv">${pct(DIST.electrificacion.v2024, 2)}</span><span class="kd">2023: ${pct(DIST.electrificacion.v2023, 2)} ${cite(DIST.electrificacion.src)}</span></div>
      </div>

      <div class="sec-title"><span class="num">3.1</span><h2>Mapa de divisiones de distribución</h2></div>
      <div class="card c8">
        <div class="filters"><label class="flab" for="d-met">Colorear por</label><select id="d-met" class="sel" aria-label="Indicador para colorear el mapa"></select></div>
        <div class="mapwrap"><div id="d-map" class="map" role="region" aria-label="Mapa de divisiones de distribución"></div></div>
        <p class="note">Cada entidad se colorea con el valor de su división principal, según la CRE (Acuerdo A/058/2017, Anexo B). Las entidades con borde punteado se reparten entre varias divisiones. Es una aproximación: los límites reales de las divisiones siguen municipios, no estados.</p>
        ${cite([{ s: 'CRE17' }, DIV24.src.infra, DIV24.src.conf, { s: 'GEO' }])}
      </div>
      <div class="card c4">
        <h2>División seleccionada</h2>
        <div id="d-info" class="stage-info" aria-live="polite"></div>
      </div>
      <div class="card c12">
        <div class="card-h"><div><h2 id="d-rt">Indicador por división</h2><p class="sub" id="d-rs"></p></div></div>
        <div class="chart lg"><canvas id="d-rank" aria-label="Indicador por división"></canvas></div>
        <p class="note" id="d-rn"></p>
        <div id="d-rtab"></div>
        <p id="d-rc"></p>
      </div>
      <div class="card c12">
        <div class="card-h"><div><h2>Pérdidas técnicas y no técnicas por división, 2024</h2><p class="sub">% de la energía ingresada a cada división. Las no técnicas incluyen robo, errores de medición y facturación.</p></div></div>
        <div class="chart lg"><canvas id="d-loss" aria-label="Pérdidas técnicas y no técnicas por división"></canvas></div>
        ${legendHTML([['var(--accent)', 'Técnicas'], ['var(--fosil)', 'No técnicas']])}
        <p class="note">Los porcentajes técnicos y no técnicos son los que reporta CFE Distribución; su suma no coincide exactamente con pérdidas ÷ energía ingresada porque las bases de cálculo del documento no se detallan.</p>
        ${cite(DIV24.src.per)}
      </div>

      <div class="sec-title"><span class="num">3.2</span><h2>Indicadores de la red de distribución</h2></div>
      <div class="card c6">
        <div class="card-h"><div><h2>Pérdidas de energía, 2022–2024</h2><p class="sub">% de la energía</p></div><span class="badge cfe">CFE Distribución</span></div>
        <div class="chart sm"><canvas id="d-perd" aria-label="Pérdidas de energía"></canvas></div>
        ${legendHTML([['var(--fosil)', 'Media + baja tensión'], ['var(--accent)', 'Total (incluye alta tensión)']])}
        <div class="callout">En 2023 las pérdidas en las RGD fueron <b>${fmt(DIST.perdidasRGD2023.gwh)} GWh</b> (${pct(DIST.perdidasRGD2023.pct)} de la energía recibida en media tensión): <b>${pct(DIST.perdidasRGD2023.tec, 2)}</b> ${term('perdidas-tecnicas', 'técnicas')} (efecto Joule I²R) y <b>${pct(DIST.perdidasRGD2023.notec, 2)}</b> ${term('perdidas-no-tecnicas', 'no técnicas')}. ${cite(DIST.perdidasRGD2023.src)}</div>
        ${cite(DIST.perdidas.src)}
      </div>
      <div class="card c6">
        <div class="card-h"><div><h2>Continuidad del servicio</h2><p class="sub">SAIDI nacional (minutos por usuario)</p></div><span class="badge cfe">CFE Distribución</span></div>
        <div class="chart sm"><canvas id="d-cont" aria-label="SAIDI nacional"></canvas></div>
        ${table(['Año', 'SAIDI (min)', 'SAIFI'], DIST.saidi.years.map((y, j) => [y, UI.fmt(DIST.saidi.v[j], 3), UI.fmt(DIST.saidi.saifi[j], 3)]))}
        ${cite(DIST.saidi.src)}
      </div>
      <div class="card c6">
        <div class="card-h"><div><h2>Longitud de las RGD, 2021–2023</h2><p class="sub">km de líneas de media y baja tensión</p></div></div>
        <div class="chart sm"><canvas id="d-km" aria-label="Longitud de redes de distribución"></canvas></div>
        ${legendHTML([['var(--accent)', 'Media tensión (2.4 a 34 kV)'], ['var(--renovable)', 'Baja tensión (menos de 2.4 kV)']])}
        <p class="note">${fmt(R.transf[i])} transformadores de media a baja tensión y ${fmt(R.circuitos[i])} circuitos de media tensión en 2023. El IA 2024 reporta 901 mil km de RGD; la suma MT + BT de 2023 es ${fmt(R.mt[i] + R.bt[i])} km.</p>
        ${cite([R.src, DIST.kmRGD.src])}
      </div>
      <div class="card c6">
        <div class="card-h"><div><h2>Clientes de suministro básico</h2><p class="sub">Millones de clientes</p></div><span class="badge cfe">CFE SSB</span></div>
        <div class="chart sm"><canvas id="d-cli" aria-label="Clientes"></canvas></div>
        <p class="note">49,016,942 clientes a diciembre de 2024 (suministro básico). El IA 2024 redondea a 49.1 millones de usuarios en Distribución.</p>
        ${cite(DIST.clientesSSB.src)}
      </div>
      <div class="card c12">
        <div class="card-h"><div><h2>Consumo y usuarios por región de control, 2023</h2><p class="sub">% del consumo final (${fmt(DIST.gcr2023.consumoFinal)} GWh) y de los usuarios finales (${fmt(DIST.gcr2023.usuariosM, 1)} millones)</p></div><span class="badge nac">Nacional</span></div>
        <div class="chart"><canvas id="d-gcr" aria-label="Consumo y usuarios por región"></canvas></div>
        ${legendHTML([['var(--fosil)', '% del consumo final'], ['var(--accent)', '% de los usuarios']])}
        ${cite(DIST.gcr2023.src)}
      </div>

      <div class="sec-title" id="sectores"><span class="num">3.3</span><h2>Consumo residencial frente a industrial</h2></div>
      <div class="card c7">
        <div class="card-h"><div><h2>Ventas por sector tarifario</h2><p class="sub">GWh, suministro básico de CFE</p></div><div class="seg" id="d-secy"></div></div>
        <div class="chart"><canvas id="d-sec" aria-label="Ventas por sector"></canvas></div>
        ${cite(DIST.sectores.src)}
      </div>
      <div class="card c5">
        <h2>Consumo promedio por usuario</h2>
        <div class="chart sm"><canvas id="d-pu" aria-label="Consumo por usuario"></canvas></div>
        <div id="d-pu-txt"></div>
        <div class="callout warn">En la tabla del IA 2024 (pp. 119–120), «Mediana industria: 873 usuarios» y «Gran industria: 452,910 usuarios» parecen intercambiados. Aquí se usa el sector industrial agregado (${fmt(DIST.sectores.usuarios.Industrial[5])} usuarios), que sí coincide con la tabla de la p. 121.</div>
        ${cite([DIST.sectores.src, { s: 'CALC' }])}
      </div>

      <div class="sec-title" id="transformador"><span class="num">3.4</span><h2>Simulador de transformador</h2></div>
      <div class="card c12">
        <div class="sim">
          <div class="ctrl">
            ${slider('Vp', 'Tensión primaria Vp', 2400, 34500, 100, tr.Vp, 'V')}
            ${slider('a', 'Relación de espiras Np : Ns', 1, 300, 0.5, tr.a, ': 1')}
            ${slider('S', 'Potencia aparente S', 5, 500, 5, tr.S, 'kVA')}
            <div><span class="flab">Conexión</span> <div class="seg" id="d-ph"></div></div>
            <div class="formula"><span>Vp / Vs = Np / Ns</span><span>Vp · Ip = Vs · Is${'  '}(= S)</span><span id="d-fx" class="note"></span></div>
          </div>
          <div style="display:grid;gap:12px;min-width:0">
            <div class="out" id="d-out" aria-live="polite"></div>
            <div class="grid" style="padding:0">
              <div class="c6" style="min-width:0"><h3>Tensión: primario vs secundario</h3><div class="chart sm"><canvas id="d-tv" aria-label="Tensiones"></canvas></div></div>
              <div class="c6" style="min-width:0"><h3>Corriente: primario vs secundario</h3><div class="chart sm"><canvas id="d-ti" aria-label="Corrientes"></canvas></div></div>
            </div>
            <div class="assume"><b>Supuestos del transformador ideal:</b>
              <ul>
                <li>Sin pérdidas en el cobre ni en el núcleo, sin flujo de dispersión y permeabilidad infinita: la potencia aparente de entrada es igual a la de salida.</li>
                <li>La tensión cambia en proporción a las espiras y la corriente en proporción inversa: si la tensión baja 60 veces, la corriente sube 60 veces.</li>
                <li>Unidades: V en volts, I en amperes y S en kVA (1 kVA = 1,000 VA). En trifásico, V es la tensión entre líneas e I = S / (√3 · V).</li>
                <li>Las tensiones del ejemplo son ilustrativas. Las RGD operan en media tensión de 2.4 a 34 kV y en baja tensión por debajo de 2.4 kV (PRODESEN, p. 157).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    seg(root.querySelector('#d-ph'), [{ v: '1', l: 'Monofásico' }, { v: '3', l: 'Trifásico' }], tr.ph, v => { tr.ph = v; trDraw(root); });
    seg(root.querySelector('#d-secy'), DIST.sectores.years.map(y => ({ v: String(y), l: String(y) })), '2024', v => secChart(+v));
    metInit(root); info(null); charts(); secChart(2024); trInit(root); initMap();
  }

  const slider = (k, label, min, max, step, v, u) => `<label for="d-${k}">${label}<span class="row"><input type="range" id="d-${k}r" min="${min}" max="${max}" step="${step}" value="${v}" aria-label="${label}"><input type="number" id="d-${k}" min="${min}" max="${max}" step="${step}" value="${v}"><span class="u">${u}</span></span></label>`;

  const DV = DIV24.divs, DIVS = Object.keys(DV);
  /* indicadores por división (todos de DIV24; los derivados se marcan como cálculo propio) */
  const loss = d => d.per24 / d.ing24 * 100;
  const METS = {
    saidi24: { l: 'SAIDI 2024 (min por usuario)', f: d => d.saidi24, u: 'min', dec: 2, src: DIV24.src.conf, note: 'Menor es mejor: minutos promedio sin servicio por usuario al año.', low: 'good' },
    saidi23: { l: 'SAIDI 2023 (min por usuario)', f: d => d.saidi23, u: 'min', dec: 2, src: DIV24.src.conf, low: 'good' },
    saifi24: { l: 'SAIFI 2024 (interrupciones por usuario)', f: d => d.saifi24, u: '', dec: 2, src: DIV24.src.conf, low: 'good' },
    caidi24: { l: 'CAIDI 2024 (min por interrupción)', f: d => d.caidi24, u: 'min', dec: 1, src: DIV24.src.conf, note: 'Duración promedio de cada interrupción (CAIDI = SAIDI ÷ SAIFI).', low: 'good' },
    loss24: { l: 'Pérdidas totales 2024 (% de la energía ingresada)', f: loss, u: '%', dec: 1, src: [DIV24.src.bal, { s: 'CALC' }], note: 'Cálculo propio: pérdida total ÷ energía ingresada, ambas de la Tabla V.3.', low: 'good' },
    pnt24: { l: 'Pérdidas no técnicas 2024 (%)', f: d => d.pnt24, u: '%', dec: 2, src: DIV24.src.per, low: 'good' },
    pt24: { l: 'Pérdidas técnicas 2024 (%)', f: d => d.pt24, u: '%', dec: 2, src: DIV24.src.per, low: 'good' },
    serv: { l: 'Servicios (usuarios) 2024', f: d => d.servMiles * 1000, u: '', dec: 0, src: DIV24.src.infra },
    ventas: { l: 'Ventas de energía 2024 (GWh)', f: d => d.ventasGWh, u: 'GWh', dec: 0, src: DIV24.src.infra },
    kwhServ: { l: 'Ventas por servicio 2024 (kWh por servicio al año)', f: d => d.ventasGWh * 1e6 / (d.servMiles * 1000), u: 'kWh', dec: 0, src: [DIV24.src.infra, { s: 'CALC' }], note: 'Cálculo propio: ventas ÷ servicios. Refleja el peso de la industria y del clima en cada división.' },
    kmMT: { l: 'Líneas de media tensión (km)', f: d => d.kmMT, u: 'km', dec: 0, src: DIV24.src.infra },
    ss: { l: 'Capacidad de subestaciones de distribución (MVA)', f: d => d.ssMVA, u: 'MVA', dec: 0, src: DIV24.src.infra }
  };
  const nacOf = k => { const m = METS[k]; return m.f(DIV24.nac); };
  const seqColor = (k, v) => { const C = colors(); const vs = DIVS.map(d => METS[k].f(DV[d])); const lo = Math.min(...vs), hi = Math.max(...vs); const i = Math.min(5, Math.floor((v - lo) / (hi - lo + 1e-9) * 6)); return C.seq[i]; };
  const mfmt = (k, v) => { const m = METS[k]; return fmt(v, m.dec) + (m.u === '%' ? ' %' : m.u ? ' ' + m.u : ''); };

  function metInit(root) {
    const sel = root.querySelector('#d-met');
    sel.innerHTML = Object.entries(METS).map(([k, m]) => `<option value="${k}">${m.l}</option>`).join('');
    sel.value = st.met; sel.addEventListener('change', () => { st.met = sel.value; styleMap(); rank(); });
  }

  function info(cve, name) {
    const box = document.getElementById('d-info');
    if (!cve) { box.innerHTML = '<b>Selecciona una entidad en el mapa</b><br>Verás su división principal, las divisiones con las que se comparte y los indicadores de cada una.'; return; }
    const m = STATE_DIV[cve]; const all = [m.d, ...(m.shared || [])]; st.div = m.d;
    const ks = ['serv', 'saidi24', 'loss24', 'pnt24'];
    const row = (lab, f) => `<tr><th scope="row">${lab}</th>${ks.map(k => `<td>${mfmt(k, f(k))}</td>`).join('')}</tr>`;
    box.innerHTML = `<b>${name}</b><br>División principal: <b>${m.d}</b>${m.shared ? `<br><span class="note">También atendida por: ${m.shared.join(', ')}</span>` : ''}${m.note ? `<br><span class="note">${m.note}</span>` : ''}
      <div class="tblwrap"><table class="data"><thead><tr><th>División (2024)</th><th scope="col">Servicios</th><th scope="col">SAIDI</th><th scope="col">Pérdidas</th><th scope="col">No técn.</th></tr></thead><tbody>
      ${all.map(d => row(d, k => METS[k].f(DV[d]))).join('')}${row('Nacional', k => nacOf(k))}</tbody></table></div>
      ${cite([DIV24.src.infra, DIV24.src.conf, DIV24.src.per, { s: 'CRE17' }])}`;
    styleMap(); rank();
  }
  async function initMap() {
    map = UI.baseMap('d-map', { google: true });
    map.zoomControl.setPosition('bottomright');
    const s = await UI.geo('states');
    divLayer = L.geoJSON(s, {
      style: f => styleFor(f),
      onEachFeature: (f, l) => {
        const m = STATE_DIV[f.properties.CVE_ENT];
        l.bindTooltip(() => `${f.properties.NOM_ENT}: ${m.d}${m.shared ? ' (compartida)' : ''} · ${mfmt(st.met, METS[st.met].f(DV[m.d]))}`, { sticky: true });
        l.on('click', () => info(f.properties.CVE_ENT, f.properties.NOM_ENT));
      }
    }).addTo(map);
    const lg = L.control({ position: 'bottomleft' });
    lg.onAdd = () => { const d = L.DomUtil.create('div', 'map-legend'); d.id = 'd-leg'; return d; };
    lg.addTo(map); legend();
    const bounds = await map.gmReady;
    map.fitBounds(bounds, { padding: [10, 10] });
  }
  function styleFor(f) {
    const C = colors(); const m = STATE_DIV[f.properties.CVE_ENT];
    return { color: m.d === st.div ? '#1a73e8' : isDark() ? '#6b6890' : '#ffffff', weight: m.d === st.div ? 2.5 : 1.2, dashArray: m.shared ? '4 3' : null, fillColor: seqColor(st.met, METS[st.met].f(DV[m.d])), fillOpacity: .72 };
  }
  function styleMap() { if (map && map.refreshTheme) map.refreshTheme(); if (divLayer) { divLayer.setStyle(styleFor); legend(); } }
  function legend() {
    const d = document.getElementById('d-leg'); if (!d) return; const C = colors(); const k = st.met;
    const vs = DIVS.map(x => METS[k].f(DV[x])), lo = Math.min(...vs), hi = Math.max(...vs);
    const steps = [0, 1, 2, 3, 4, 5].map(i => [C.seq[i], lo + (hi - lo) * i / 6, lo + (hi - lo) * (i + 1) / 6]);
    d.innerHTML = `<b>${METS[k].l.replace(/ \(.*$/, '')}</b><br>` + steps.map(([c, a, b]) => `<i class="sq" style="background:${c}"></i>${fmt(a, METS[k].dec > 1 ? 1 : METS[k].dec)}–${fmt(b, METS[k].dec > 1 ? 1 : METS[k].dec)}`).join('<br>') + '<br><span class="note">Borde punteado: entidad compartida</span>';
  }
  function rank() {
    const k = st.met, m = METS[k]; const nac = nacOf(k);
    const rows = DIVS.map(d => [d, m.f(DV[d])]).sort((a, b) => b[1] - a[1]);
    document.getElementById('d-rt').textContent = m.l;
    document.getElementById('d-rs').innerHTML = `La línea punteada es el valor nacional (${mfmt(k, nac)}). La división seleccionada se marca con borde azul.`;
    document.getElementById('d-rn').innerHTML = (m.note ? m.note + ' ' : '') + `Fuente de los datos por división: PAMRGD 2025-2039.`;
    document.getElementById('d-rc').innerHTML = cite(m.src);
    document.getElementById('d-rtab').innerHTML = table(['División', m.l], rows.map(r => [r[0], mfmt(k, r[1])]));
    chart('d-rank', C => ({
      type: 'bar', data: { labels: rows.map(r => r[0]), datasets: [barDs({ data: rows.map(r => r[1]), backgroundColor: rows.map(r => m.low ? (r[1] > nac ? C.fosil : C.renovable) : C.accent), borderColor: rows.map(r => r[0] === st.div ? '#1a73e8' : 'transparent'), borderWidth: 2 })] },
      options: { indexAxis: 'y', scales: { x: axis(C, { beginAtZero: true, ticks: { color: C.ink2, callback: v => fmt(v, v < 10 ? 1 : 0) } }), y: noGrid(C) },
        plugins: { tooltip: { callbacks: { label: x => ` ${mfmt(k, x.raw)}${m.low ? (x.raw > nac ? ' · peor que el promedio nacional' : ' · mejor que el promedio nacional') : ''}` } } } },
      plugins: [{ id: 'natl', afterDraw: (c) => { const x = c.scales.x.getPixelForValue(nac); const { top, bottom } = c.chartArea; const g = c.ctx; g.save(); g.strokeStyle = C.ink; g.setLineDash([5, 4]); g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, top); g.lineTo(x, bottom); g.stroke(); g.restore(); } }]
    }));
  }

  function charts() {
    rank();
    const lr = DIVS.map(d => [d, DV[d].pt24, DV[d].pnt24]).sort((a, b) => (b[1] + b[2]) - (a[1] + a[2]));
    chart('d-loss', C => ({
      type: 'bar', data: { labels: lr.map(r => r[0]), datasets: [barDs({ label: 'Técnicas', data: lr.map(r => r[1]), backgroundColor: C.accent, stack: 'p', borderRadius: 0 }), barDs({ label: 'No técnicas', data: lr.map(r => r[2]), backgroundColor: C.fosil, stack: 'p' })] },
      options: { indexAxis: 'y', scales: { x: axis(C, { stacked: true, ticks: { color: C.ink2, callback: v => v + ' %' } }), y: noGrid(C, { stacked: true }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${fmt(x.raw, 2)} %` } } } }
    }));
    chart('d-perd', C => ({
      type: 'line', data: { labels: DIST.perdidas.years, datasets: [
        { label: 'MT + BT', data: DIST.perdidas.mtbt, borderColor: C.fosil, backgroundColor: C.fosil, borderWidth: 2, pointRadius: 5 },
        { label: 'Total', data: DIST.perdidas.total, borderColor: C.accent, backgroundColor: C.accent, borderWidth: 2, pointRadius: 5, pointStyle: 'rectRot' }] },
      options: { scales: { x: noGrid(C), y: axis(C, { min: 8, max: 15, ticks: { color: C.ink2, callback: v => v + ' %' } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${pct(x.raw, 2)}` } } } }
    }));
    chart('d-cont', C => ({
      type: 'bar', data: { labels: DIST.saidi.years, datasets: [barDs({ data: DIST.saidi.v, backgroundColor: C.renovable })] },
      options: { scales: { x: noGrid(C), y: axis(C, { beginAtZero: true, ticks: { color: C.ink2 }, title: { display: true, text: 'min/usuario', color: C.ink2 } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw, 3)} min` } } } }
    }));
    const R = DIST.rgd;
    chart('d-km', C => ({
      type: 'bar', data: { labels: R.years, datasets: [barDs({ label: 'Media tensión', data: R.mt, backgroundColor: C.accent, stack: 'k' }), barDs({ label: 'Baja tensión', data: R.bt, backgroundColor: C.renovable, stack: 'k', borderRadius: 0 })] },
      options: { scales: { x: noGrid(C, { stacked: true }), y: axis(C, { stacked: true, ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'km', color: C.ink2 } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${fmt(x.raw)} km` } } } }
    }));
    chart('d-cli', C => ({
      type: 'line', data: { labels: DIST.clientesSSB.years, datasets: [{ data: DIST.clientesSSB.v.map(v => v / 1e6), borderColor: C.accent, backgroundColor: C.accent, borderWidth: 2, pointRadius: 5, fill: false }] },
      options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v, 0) + ' M' } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(DIST.clientesSSB.v[x.dataIndex])} clientes` } } } }
    }));
    const G = Object.entries(DIST.gcr2023.v);
    chart('d-gcr', C => ({
      type: 'bar', data: { labels: G.map(g => g[0]), datasets: [barDs({ label: 'Consumo final', data: G.map(g => g[1][0]), backgroundColor: C.fosil }), barDs({ label: 'Usuarios', data: G.map(g => g[1][1]), backgroundColor: C.accent })] },
      options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => v + ' %' } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${pct(x.raw)}` } } } }
    }));
    const S = DIST.sectores; const j = 5;
    const per = Object.keys(S.ventas).map(k => [k, S.ventas[k][j] * 1e6 / S.usuarios[k][j]]);
    chart('d-pu', C => ({
      type: 'bar', data: { labels: per.map(p => p[0]), datasets: [barDs({ data: per.map(p => p[1]), backgroundColor: per.map(p => p[0] === 'Industrial' ? C.fosil : p[0].startsWith('Doméstico') ? C.accent : C.ink3) })] },
      options: { indexAxis: 'y', scales: { x: axis(C, { type: 'logarithmic', ticks: { color: C.ink2, callback: UI.logTick(v => fmt(v)) }, title: { display: true, text: 'kWh por usuario al año (escala log)', color: C.ink2 } }), y: noGrid(C) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} kWh/usuario·año` } } } }
    }));
    const dom = per[0][1], ind = per[5][1];
    document.getElementById('d-pu-txt').innerHTML = `<p class="sub">En 2024 un usuario industrial consumió en promedio <b>${fmt(ind)} kWh</b> y uno doméstico de bajo consumo <b>${fmt(dom)} kWh</b>: unas <b>${fmt(ind / dom)} veces</b> más. El sector industrial tiene el ${pct(S.usuarios.Industrial[j] / sum(Object.values(S.usuarios).map(a => a[j])) * 100, 2)} de los usuarios y el ${pct(S.ventas.Industrial[j] / sum(Object.values(S.ventas).map(a => a[j])) * 100)} de las ventas.</p>`;
  }
  function secChart(y) {
    const S = DIST.sectores, j = S.years.indexOf(y); const rows = Object.keys(S.ventas).map(k => [k, S.ventas[k][j]]);
    chart('d-sec', C => ({
      type: 'bar', data: { labels: rows.map(r => r[0]), datasets: [barDs({ data: rows.map(r => r[1]), backgroundColor: rows.map(r => r[0] === 'Industrial' ? C.fosil : r[0].startsWith('Doméstico') ? C.accent : C.ink3) })] },
      options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'GWh', color: C.ink2 } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} GWh · ${fmt(S.usuarios[x.label][j])} usuarios` } } } }
    }));
  }

  /* ---------- transformador ---------- */
  function trInit(root) {
    ['Vp', 'a', 'S'].forEach(k => {
      const r = root.querySelector(`#d-${k}r`), n = root.querySelector(`#d-${k}`);
      const set = (v) => { v = Math.min(+r.max, Math.max(+r.min, +v || +r.min)); tr[k] = v; r.value = v; n.value = v; trDraw(root); };
      r.addEventListener('input', () => set(r.value)); n.addEventListener('change', () => set(n.value));
    });
    trDraw(root);
  }
  function trDraw(root) {
    const k = tr.ph === '3' ? Math.sqrt(3) : 1;
    const Vs = tr.Vp / tr.a, S = tr.S * 1000, Ip = S / (k * tr.Vp), Is = S / (k * Vs);
    root.querySelector('#d-fx').textContent = tr.ph === '3' ? 'Trifásico: I = S / (√3 · V_línea)' : 'Monofásico: I = S / V';
    root.querySelector('#d-out').innerHTML = `
      <div class="o"><div class="ol">Tensión secundaria Vs</div><div class="ov">${fmt(Vs, 1)} V</div></div>
      <div class="o"><div class="ol">Corriente primaria Ip</div><div class="ov">${fmt(Ip, 2)} A</div></div>
      <div class="o"><div class="ol">Corriente secundaria Is</div><div class="ov">${fmt(Is, 1)} A</div></div>
      <div class="o"><div class="ol">Comprobación ${tr.ph === '3' ? '√3·' : ''}Vp·Ip = ${tr.ph === '3' ? '√3·' : ''}Vs·Is</div><div class="ov">${fmt(k * tr.Vp * Ip / 1000, 1)} = ${fmt(k * Vs * Is / 1000, 1)} kVA</div></div>
      <div class="o"><div class="ol">Nivel de salida</div><div class="ov" style="font-size:15px">${Vs <= 1000 ? 'Baja tensión (≤ 1 kV)' : Vs < 69000 ? 'Media tensión (1–69 kV)' : 'Alta tensión'}</div></div>`;
    chart('d-tv', C => ({ type: 'bar', data: { labels: ['Primario', 'Secundario'], datasets: [barDs({ data: [tr.Vp, Vs], backgroundColor: [C.accent, C.renovable] })] },
      options: { animation: false, scales: { x: noGrid(C), y: axis(C, { type: 'logarithmic', ticks: { color: C.ink2, callback: UI.logTick(v => fmt(v) + ' V') } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw, 1)} V` } } } } }));
    chart('d-ti', C => ({ type: 'bar', data: { labels: ['Primario', 'Secundario'], datasets: [barDs({ data: [Ip, Is], backgroundColor: [C.accent, C.fosil] })] },
      options: { animation: false, scales: { x: noGrid(C), y: axis(C, { type: 'logarithmic', ticks: { color: C.ink2, callback: UI.logTick(v => fmt(v, v < 1 ? 2 : 0) + ' A') } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw, 2)} A` } } } } }));
  }

  function onShow() { if (map) setTimeout(() => map.invalidateSize(), 50); }
  function onTheme() { styleMap(); rank(); }
  return { render, onShow, onTheme };
})();
