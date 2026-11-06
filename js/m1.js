/* Módulo 1 · Generación eléctrica */
window.M1 = (() => {
  const { fmt, pct, cite, term, chart, axis, noGrid, barDs, legendHTML, table, seg, sum, colors } = UI;
  let st = { year: '2023', scope: 'nac', techs: new Set(), plant: null };
  let map, layer, statesLayer;
  const plantTechs = [...new Set(PLANTS.map(p => p.t))];
  st.techs = new Set(plantTechs);

  function render(root) {
    root.innerHTML = `
    <div class="mod-head">
      <span class="kicker">Módulo 1</span>
      <h1 id="h-m1">Generación eléctrica</h1>
      <p>Dónde y cómo se produce la electricidad. Distinguimos la <span class="badge nac">generación nacional</span> (todas las centrales del SEN, CENACE/SENER) de la <span class="badge cfe">generación de CFE</span> (solo centrales propias; los PIE se reportan aparte).</p>
    </div>
    <div class="grid">
      <div class="card c12">
        <div class="filters">
          <span class="flab">Año</span><div class="seg" id="g-year"></div>
          <span class="flab">Ámbito</span><div class="seg" id="g-scope"></div>
        </div>
        <div class="filters"><span class="flab">Tecnología</span><div class="chips" id="g-tech" role="group" aria-label="Filtrar por tecnología"></div></div>
      </div>
      <div class="kpis" id="g-kpis"></div>

      <div class="sec-title"><span class="num">1.1</span><h2>Mapa de centrales eléctricas</h2></div>
      <div class="card c8">
        <div class="card-h"><div><h2>${PLANTS.length} centrales reales en ${new Set(PLANTS.map(p => p.e)).size} entidades</h2><p class="sub">El tamaño del círculo es proporcional a la capacidad (MW); el color indica el recurso. Selecciona una central.</p></div></div>
        <div id="g-map" class="map" role="region" aria-label="Mapa de centrales eléctricas"></div>
        <p class="note">Coordenadas: WRI Global Power Plant Database (datos NACEI/CFE-CENACE) y, cuando se indica «aprox.», punto interior del municipio (INEGI/CONABIO). Lista de centrales: PRODESEN 2024-2038, Cuadro A1.9. Fondo: límites estatales INEGI/CONABIO, sin mapas comerciales.</p>
      </div>
      <div class="card c4">
        <h2>Central seleccionada</h2>
        <div id="g-plant" aria-live="polite"><p class="sub">Toca un círculo del mapa o elige de la lista.</p></div>
        <label class="flab" for="g-plist">Lista de centrales</label>
        <select id="g-plist" style="padding:8px;border-radius:10px;border:1px solid var(--line-2);background:var(--surface)"></select>
      </div>

      <div class="sec-title"><span class="num">1.2</span><h2>Generación por tecnología</h2></div>
      <div class="card c7">
        <div class="card-h"><h2 id="g-t-title">Generación anual por tecnología</h2><span id="g-badge"></span></div>
        <div class="chart lg"><canvas id="g-tech-c" aria-label="Generación por tecnología"></canvas></div>
        <div id="g-tech-src"></div>
      </div>
      <div class="card c5">
        <div class="card-h"><h2>Participación por tecnología</h2></div>
        <div class="chart"><canvas id="g-share" aria-label="Participación porcentual"></canvas></div>
        <div id="g-share-leg"></div>
      </div>

      <div class="card c6">
        <div class="card-h"><div><h2>Generación anual</h2><p class="sub">GWh por año: SEN (neta inyectada) y CFE (neta).</p></div></div>
        <div class="chart"><canvas id="g-annual" aria-label="Generación anual nacional y CFE"></canvas></div>
        ${legendHTML([['var(--accent)', 'Nacional (SEN)'], ['var(--coral)', 'CFE']])}
        ${cite([GEN_NAC.src, GEN_CFE.neta.src])}
      </div>
      <div class="card c6">
        <div class="card-h"><div><h2>Variación interanual por tecnología</h2><p class="sub" id="g-var-sub"></p></div></div>
        <div class="chart"><canvas id="g-var" aria-label="Variación interanual"></canvas></div>
        <div id="g-var-src"></div>
      </div>

      <div class="sec-title"><span class="num">1.3</span><h2>Fuentes fósiles y limpias</h2></div>
      <div class="card c7">
        <div class="card-h"><div><h2>Participación fósil y limpia</h2><p class="sub">Nacional 2018–2023, porcentaje de la generación neta según el criterio legal de energía limpia.</p></div><span class="badge nac">Nacional</span></div>
        <div class="chart"><canvas id="g-fl" aria-label="Participación fósil y limpia"></canvas></div>
        ${legendHTML([['var(--fosil)', 'No limpia (fósil)'], ['var(--renovable)', 'Limpia (oficial)']])}
        ${cite(GEN_NAC.src)}
      </div>
      <div class="card c5">
        <div class="card-h"><div><h2>Energía limpia en CFE</h2><p class="sub">Energía neta de CFE con energías limpias (%).</p></div><span class="badge cfe">CFE</span></div>
        <div class="chart sm"><canvas id="g-cfel" aria-label="Energía limpia CFE"></canvas></div>
        <div class="callout warn">El IA 2024 dice que los 38,983 GWh limpios de CFE son «más del 25 % del total de la generación eléctrica del país», pero ese 25.3 % se calcula sobre la generación de CFE (154,059 GWh), no sobre la nacional. ${cite({ s: 'IA24', p: '27' })}</div>
        ${cite(GEN_CFE.limpiaNeta.src)}
      </div>

      <div class="sec-title" id="ccvc"><span class="num">1.4</span><h2>Ciclo combinado frente a vapor convencional</h2></div>
      <div class="card c5">
        <h2>¿En qué se diferencian?</h2>
        <svg viewBox="0 0 360 250" role="img" aria-labelledby="ccT" style="width:100%;height:auto">
          <title id="ccT">Esquema: el vapor convencional usa una caldera y una turbina de vapor; el ciclo combinado agrega una turbina de gas y recupera su calor de escape.</title>
          <text x="10" y="18" font-size="13" font-weight="700" fill="var(--ink)">Vapor convencional (Rankine)</text>
          <rect x="10" y="30" width="90" height="46" rx="8" fill="var(--fosil)" fill-opacity=".15" stroke="var(--fosil)"/><text x="55" y="58" text-anchor="middle" font-size="12" fill="var(--ink)">Caldera</text>
          <path d="M100 53h40" stroke="var(--ink-3)" stroke-width="2" marker-end="url(#ar)"/>
          <rect x="142" y="30" width="96" height="46" rx="8" fill="var(--surface-2)" stroke="var(--line-2)"/><text x="190" y="52" text-anchor="middle" font-size="12" fill="var(--ink)">Turbina</text><text x="190" y="67" text-anchor="middle" font-size="11" fill="var(--ink-3)">de vapor</text>
          <path d="M238 53h30" stroke="var(--ink-3)" stroke-width="2" marker-end="url(#ar)"/>
          <rect x="270" y="30" width="80" height="46" rx="8" fill="var(--surface-2)" stroke="var(--line-2)"/><text x="310" y="58" text-anchor="middle" font-size="12" fill="var(--ink)">Generador</text>
          <text x="10" y="118" font-size="13" font-weight="700" fill="var(--ink)">Ciclo combinado (Brayton + Rankine)</text>
          <rect x="10" y="130" width="96" height="46" rx="8" fill="var(--fosil)" fill-opacity=".15" stroke="var(--fosil)"/><text x="58" y="152" text-anchor="middle" font-size="12" fill="var(--ink)">Turbina</text><text x="58" y="167" text-anchor="middle" font-size="11" fill="var(--ink-3)">de gas</text>
          <path d="M106 153h30" stroke="var(--ink-3)" stroke-width="2" marker-end="url(#ar)"/>
          <rect x="138" y="130" width="70" height="46" rx="8" fill="var(--surface-2)" stroke="var(--line-2)"/><text x="173" y="158" text-anchor="middle" font-size="11.5" fill="var(--ink)">Gen. 1</text>
          <path d="M58 176v24h40" fill="none" stroke="var(--coral)" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#ar)"/>
          <text x="20" y="214" font-size="10.5" fill="var(--coral)">gases calientes</text>
          <rect x="100" y="190" width="110" height="46" rx="8" fill="var(--surface-2)" stroke="var(--line-2)"/><text x="155" y="211" text-anchor="middle" font-size="11.5" fill="var(--ink)">Recuperador</text><text x="155" y="226" text-anchor="middle" font-size="11" fill="var(--ink-3)">de calor → vapor</text>
          <path d="M210 213h20" stroke="var(--ink-3)" stroke-width="2" marker-end="url(#ar)"/>
          <rect x="232" y="190" width="70" height="46" rx="8" fill="var(--surface-2)" stroke="var(--line-2)"/><text x="267" y="211" text-anchor="middle" font-size="11.5" fill="var(--ink)">Turbina</text><text x="267" y="226" text-anchor="middle" font-size="11" fill="var(--ink-3)">de vapor</text>
          <path d="M302 213h12" fill="none" stroke="var(--ink-3)" stroke-width="2"/><text x="318" y="217" font-size="11.5" fill="var(--ink)">Gen. 2</text>
          <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ink-3)"/></marker></defs>
        </svg>
        <p class="sub">El ${term('vapor-convencional', 'vapor convencional')} usa solo el ${term('rankine', 'ciclo Rankine')}. El ${term('ciclo-combinado', 'ciclo combinado')} quema gas en un ${term('brayton', 'ciclo Brayton')} y aprovecha el calor de escape para generar vapor; así obtiene más electricidad del mismo combustible. Otras tecnologías: ${term('turbogas', 'turbogás')}, ${term('combustion-interna', 'combustión interna')}, ${term('carboelectrica', 'carboeléctrica')}, ${term('nucleoelectrica', 'nucleoeléctrica')} y ${term('geotermica', 'geotérmica')}.</p>
      </div>
      <div class="card c7">
        <div class="card-h"><div><h2>Generación, capacidad y factor de planta</h2><p class="sub">Nacional, 2018–2023</p></div><span class="badge nac">Nacional</span></div>
        <div class="chart sm"><canvas id="g-cc-gen" aria-label="Generación ciclo combinado vs térmica convencional"></canvas></div>
        <div class="chart sm"><canvas id="g-cc-fp" aria-label="Factor de planta ciclo combinado vs térmica convencional"></canvas></div>
        ${legendHTML([['var(--fosil)', 'Ciclo combinado'], ['var(--accent)', 'Térmica (vapor) convencional']])}
        <p class="note">Factor de planta = GWh ÷ (MW × 8.76). Es un cálculo propio con la generación (Cuadro A1.11) y la capacidad (Cuadro A1.7) del PRODESEN 2024-2038.</p>
        <div id="g-cc-tbl"></div>
        ${cite([GEN_NAC.src, CAP_NAC.src, { s: 'CALC' }])}
      </div>

      <div class="sec-title"><span class="num">1.5</span><h2>Capacidad instalada</h2></div>
      <div class="card c7">
        <div class="card-h"><div><h2>Evolución de la capacidad por recurso, 2018–2023</h2><p class="sub">MW interconectados (excluye centrales en pruebas).</p></div><span class="badge nac">Nacional</span></div>
        <div class="chart"><canvas id="g-cap" aria-label="Capacidad instalada por recurso"></canvas></div>
        ${legendHTML([['var(--fosil)', 'Fósil'], ['var(--nuclear)', 'Nuclear'], ['var(--renovable)', 'Renovable']])}
        ${cite(CAP_NAC.src)}
      </div>
      <div class="card c5">
        <div class="card-h"><div><h2>Capacidad por propietario, 2023</h2><p class="sub">MW interconectados</p></div><span class="badge nac">Nacional</span></div>
        <div class="chart sm"><canvas id="g-own" aria-label="Capacidad por propietario"></canvas></div>
        ${table(['Propietario', 'MW', 'MW limpios'], CAP_OWNER_2023.owners.map((o, i) => [o, CAP_OWNER_2023.total[i], CAP_OWNER_2023.clean[i]]))}
        ${cite(CAP_OWNER_2023.src)}
      </div>
    </div>`;

    seg(root.querySelector('#g-year'), ['2022', '2023', '2024'].map(v => ({ v, l: v })), st.year, v => { st.year = v; draw(root); });
    seg(root.querySelector('#g-scope'), [{ v: 'nac', l: 'Nacional (SEN)' }, { v: 'cfe', l: 'Solo CFE' }], st.scope, v => { st.scope = v; draw(root); });
    const tc = root.querySelector('#g-tech');
    tc.innerHTML = plantTechs.map(t => `<button type="button" class="chip" data-t="${t}" aria-pressed="true" style="--c:var(--${FAMILY[t === 'Vapor convencional' ? 'Térmica convencional' : t] || 'fosil'})"><span class="dot"></span>${t}</button>`).join('') + `<button type="button" class="chip" data-all="1" aria-pressed="true">Todas</button>`;
    tc.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      if (b.dataset.all) { st.techs = new Set(plantTechs); }
      else { const t = b.dataset.t; if (st.techs.has(t) && st.techs.size > 1) st.techs.delete(t); else st.techs.add(t); }
      tc.querySelectorAll('.chip[data-t]').forEach(x => x.setAttribute('aria-pressed', st.techs.has(x.dataset.t)));
      tc.querySelector('[data-all]').setAttribute('aria-pressed', st.techs.size === plantTechs.length);
      drawMarkers(); draw(root);
    });
    const pl = root.querySelector('#g-plist');
    pl.innerHTML = '<option value="">— Elige una central —</option>' + PLANTS.map((p, i) => `<option value="${i}">${p.n} (${p.e})</option>`).join('');
    pl.addEventListener('change', () => { if (pl.value !== '') selectPlant(+pl.value, true); });
    staticCharts();
    draw(root);
    initMap();
  }

  const famOf = (t) => FAMILY[t === 'Vapor convencional' ? 'Térmica convencional' : t] || 'fosil';
  const techMatch = (chartTech) => {
    // Relaciona la tecnología del gráfico con los filtros (vapor convencional = térmica convencional)
    const alias = { 'Térmica convencional': 'Vapor convencional', 'Diésel': 'Combustión interna', 'Turbojet': 'Turbogás' };
    const t = alias[chartTech] || chartTech;
    return !plantTechs.includes(t) || st.techs.has(t);
  };

  function dataFor() {
    const y = +st.year;
    if (st.scope === 'nac') { const i = GEN_NAC.years.indexOf(y); if (i < 0) return null; return { tech: Object.fromEntries(Object.entries(GEN_NAC.tech).map(([t, a]) => [t, a[i]])), total: GEN_NAC.total[i], src: GEN_NAC.src, prev: i > 0 ? Object.fromEntries(Object.entries(GEN_NAC.tech).map(([t, a]) => [t, a[i - 1]])) : null, prevTotal: i > 0 ? GEN_NAC.total[i - 1] : null, clean: GEN_NAC.cleanPct[i] }; }
    const i = GEN_CFE.years.indexOf(y);
    if (i < 0) return null;
    return { tech: Object.fromEntries(Object.entries(GEN_CFE.tech).map(([t, a]) => [t, a[i]])), total: GEN_CFE.total[i], src: GEN_CFE.src, prev: i > 0 ? Object.fromEntries(Object.entries(GEN_CFE.tech).map(([t, a]) => [t, a[i - 1]])) : null, prevTotal: i > 0 ? GEN_CFE.total[i - 1] : (y === 2023 ? GEN_CFE.total2022.v : null), clean: null };
  }

  function draw(root) {
    const d = dataFor(); const scopeName = st.scope === 'nac' ? 'Nacional' : 'CFE';
    root.querySelector('#g-badge').innerHTML = `<span class="badge ${st.scope === 'nac' ? 'nac' : 'cfe'}">${scopeName} ${st.year}</span>`;
    const K = root.querySelector('#g-kpis');
    if (!d) {
      const why = st.scope === 'nac' ? 'El PRODESEN 2024-2038 llega a 2023; no hay cifra nacional 2024 en los documentos disponibles.' : `CFE 2022: ${fmt(GEN_CFE.total2022.v)} GWh totales, sin desglose por tecnología en el Informe Anual 2022.`;
      K.innerHTML = `<div class="kpi" style="grid-column:1/-1"><span class="kl">${scopeName} ${st.year}</span><span class="kv na">Dato no disponible</span><span class="kd">${why} Cambia el año o el ámbito.</span></div>`;
      chart('g-tech-c', () => ({ type: 'bar', data: { labels: [], datasets: [] } })); chart('g-share', () => ({ type: 'doughnut', data: { labels: [], datasets: [] } }));
      root.querySelector('#g-tech-src').innerHTML = '<p class="na">Dato no disponible</p>'; root.querySelector('#g-share-leg').innerHTML = '';
    } else {
      const T = d.total; const varPct = d.prevTotal ? (T / d.prevTotal - 1) * 100 : null;
      const fos = sum(Object.entries(d.tech).filter(([t]) => FAMILY[t] === 'fosil' || t === 'Vapor convencional').map(([, v]) => v));
      const cc = d.tech['Ciclo combinado'], vc = d.tech['Térmica convencional'] ?? d.tech['Vapor convencional'];
      K.innerHTML = [
        ['Generación anual', fmt(T), 'GWh', `${scopeName} ${st.year} · ${st.scope === 'nac' ? 'neta inyectada' : 'bruta'}`, 'var(--accent)'],
        ['Variación interanual', varPct === null ? '—' : (varPct >= 0 ? '+' : '') + pct(varPct), '', d.prevTotal ? `vs ${+st.year - 1}: ${fmt(d.prevTotal)} GWh` : 'Dato no disponible', 'var(--magenta)'],
        ['Fuentes fósiles', pct(fos / T * 100), '', 'Incluye cogeneración eficiente', 'var(--fosil)'],
        ['Fuentes limpias', d.clean !== null ? pct(d.clean, 2) : pct((T - fos) / T * 100), '', d.clean !== null ? 'Criterio legal (PRODESEN)' : 'Renovable + nuclear (cálculo)', 'var(--renovable)'],
        ['Ciclo combinado / vapor conv.', fmt(cc / vc, 1) + '×', '', `${fmt(cc)} vs ${fmt(vc)} GWh`, 'var(--coral)']
      ].map(([l, v, u, dd, c]) => `<div class="kpi" style="--k:${c}"><span class="kl">${l}</span><span class="kv">${v}<span class="ku">${u}</span></span><span class="kd">${dd}</span></div>`).join('');
      const rows = Object.entries(d.tech).filter(([t, v]) => v > 0 && techMatch(t)).sort((a, b) => b[1] - a[1]);
      root.querySelector('#g-t-title').textContent = `Generación por tecnología · ${scopeName} ${st.year}`;
      chart('g-tech-c', C => ({
        type: 'bar', data: { labels: rows.map(r => r[0]), datasets: [barDs({ data: rows.map(r => r[1]), backgroundColor: rows.map(r => C[famOf(r[0])]) })] },
        options: { indexAxis: 'y', scales: { x: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'GWh', color: C.ink2 } }), y: noGrid(C) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} GWh · ${pct(x.raw / T * 100)}` } } } }
      }));
      root.querySelector('#g-tech-src').innerHTML = table(['Tecnología', 'GWh', '% del total'], rows.map(([t, v]) => [t, v, UI.fmt(v / T * 100, 1)])) + cite(d.src);
      const top = rows.slice(0, 5), rest = T - sum(top.map(r => r[1]));
      chart('g-share', C => {
        const pal = [C.fosil, C.accent, C.renovable, C.coral, C.magenta];
        return { type: 'doughnut', data: { labels: [...top.map(r => r[0]), 'Resto'], datasets: [{ data: [...top.map(r => r[1]), rest], backgroundColor: [...top.map(r => C[famOf(r[0])]), C.line], borderColor: C.surface, borderWidth: 2 }] },
          options: { cutout: '58%', plugins: { tooltip: { callbacks: { label: x => ` ${x.label}: ${pct(x.raw / T * 100)}` } } } } };
      });
      root.querySelector('#g-share-leg').innerHTML = `<div class="legend">${top.map(r => `<span><i style="--c:var(--${famOf(r[0])})"></i>${r[0]}: ${pct(r[1] / T * 100)}</span>`).join('')}<span><i style="--c:var(--line)"></i>Resto: ${pct(rest / T * 100)}</span></div><p class="note">Las tecnologías del mismo recurso comparten color; el nombre está en la etiqueta.</p>`;
    }
    // variación interanual
    let vr = null, vlab = '', vsrc;
    if (st.scope === 'cfe' || st.year === '2024') { vr = Object.entries(GEN_CFE.tech).map(([t, a]) => [t, (a[1] / a[0] - 1) * 100, a[1] - a[0]]); vlab = 'CFE, 2023 → 2024 (generación bruta)'; vsrc = GEN_CFE.src; }
    else { const i = GEN_NAC.years.indexOf(+st.year); vr = Object.entries(GEN_NAC.tech).filter(([, a]) => a[i - 1] > 0).map(([t, a]) => [t, (a[i] / a[i - 1] - 1) * 100, a[i] - a[i - 1]]); vlab = `Nacional, ${+st.year - 1} → ${st.year} (generación neta)`; vsrc = GEN_NAC.src; }
    vr = vr.filter(r => techMatch(r[0]) && (r[2] / (r[1] / 100)) >= 500).sort((a, b) => b[1] - a[1]);
    root.querySelector('#g-var-sub').textContent = vlab + ' · solo tecnologías con al menos 500 GWh el año base';
    chart('g-var', C => ({
      type: 'bar', data: { labels: vr.map(r => r[0]), datasets: [barDs({ data: vr.map(r => r[1]), backgroundColor: vr.map(r => r[1] >= 0 ? C.renovable : C.magenta), borderSkipped: false })] },
      options: { indexAxis: 'y', scales: { x: axis(C, { ticks: { color: C.ink2, callback: v => v + ' %' } }), y: noGrid(C) }, plugins: { tooltip: { callbacks: { label: x => ` ${(x.raw >= 0 ? '+' : '') + pct(x.raw)} (${vr[x.dataIndex][2] >= 0 ? '+' : ''}${fmt(vr[x.dataIndex][2])} GWh)` } } } }
    }));
    root.querySelector('#g-var-src').innerHTML = legendHTML([['var(--renovable)', 'Aumento'], ['var(--magenta)', 'Disminución']]) + cite([vsrc, { s: 'CALC' }]);
  }

  function staticCharts() {
    const Y = GEN_NAC.years;
    chart('g-annual', C => ({
      type: 'line', data: { labels: [2018, 2019, 2020, 2021, 2022, 2023, 2024], datasets: [
        { label: 'Nacional (SEN)', data: [...GEN_NAC.total, null], borderColor: C.accent, backgroundColor: C.accent, borderWidth: 2, pointRadius: 4, tension: .2 },
        { label: 'CFE (neta)', data: [null, null, null, null, ...GEN_CFE.neta.v], borderColor: C.coral, backgroundColor: C.coral, borderWidth: 2, pointRadius: 4, tension: .2 }] },
      options: { scales: { x: noGrid(C), y: axis(C, { beginAtZero: true, ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'GWh', color: C.ink2 } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => x.raw === null ? ` ${x.dataset.label}: Dato no disponible` : ` ${x.dataset.label}: ${fmt(x.raw)} GWh` } } } }
    }));
    chart('g-fl', C => ({
      type: 'bar', data: { labels: Y, datasets: [
        barDs({ label: 'Limpia (oficial)', data: GEN_NAC.cleanPct, backgroundColor: C.renovable, stack: 'a' }),
        barDs({ label: 'No limpia', data: GEN_NAC.cleanPct.map(v => +(100 - v).toFixed(2)), backgroundColor: C.fosil, stack: 'a', borderRadius: 0 })] },
      options: { scales: { x: noGrid(C, { stacked: true }), y: axis(C, { stacked: true, max: 100, ticks: { color: C.ink2, callback: v => v + ' %' } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${pct(x.raw, 2)}` } } } }
    }));
    chart('g-cfel', C => ({
      type: 'bar', data: { labels: GEN_CFE.limpiaNeta.years, datasets: [barDs({ data: GEN_CFE.limpiaNeta.v, backgroundColor: C.renovable })] },
      options: { scales: { x: noGrid(C), y: axis(C, { beginAtZero: true, max: 50, ticks: { color: C.ink2, callback: v => v + ' %' } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${pct(x.raw)} de la energía neta de CFE` } } } }
    }));
    const cc = GEN_NAC.tech['Ciclo combinado'], tc = GEN_NAC.tech['Térmica convencional'];
    const ccMW = CAP_NAC.tech['Ciclo combinado'], tcMW = CAP_NAC.tech['Térmica convencional'];
    const fp = (g, c) => g.map((v, i) => +(v / (c[i] * 8.76) * 100).toFixed(1));
    chart('g-cc-gen', C => ({
      type: 'bar', data: { labels: Y, datasets: [barDs({ label: 'Ciclo combinado', data: cc, backgroundColor: C.fosil }), barDs({ label: 'Térmica convencional', data: tc, backgroundColor: C.accent })] },
      options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'GWh', color: C.ink2 } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${fmt(x.raw)} GWh` } } } }
    }));
    chart('g-cc-fp', C => ({
      type: 'line', data: { labels: Y, datasets: [
        { label: 'Ciclo combinado', data: fp(cc, ccMW), borderColor: C.fosil, backgroundColor: C.fosil, borderWidth: 2, pointRadius: 4 },
        { label: 'Térmica convencional', data: fp(tc, tcMW), borderColor: C.accent, backgroundColor: C.accent, borderWidth: 2, pointRadius: 4, pointStyle: 'rectRot' }] },
      options: { scales: { x: noGrid(C), y: axis(C, { min: 0, max: 100, ticks: { color: C.ink2, callback: v => v + ' %' }, title: { display: true, text: 'Factor de planta', color: C.ink2 } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${pct(x.raw)}` } } } }
    }));
    document.getElementById('g-cc-tbl').innerHTML = table(['Año', 'CC GWh', 'CC MW', 'CC FP %', 'TC GWh', 'TC MW', 'TC FP %'], Y.map((y, i) => [y, cc[i], ccMW[i], UI.fmt(fp(cc, ccMW)[i], 1), tc[i], tcMW[i], UI.fmt(fp(tc, tcMW)[i], 1)]));
    const famCap = Y.map((_, i) => { const f = { fosil: 0, nuclear: 0, renovable: 0 }; for (const [t, a] of Object.entries(CAP_NAC.tech)) f[FAMILY[t]] += a[i]; return f; });
    chart('g-cap', C => ({
      type: 'bar', data: { labels: Y, datasets: [
        barDs({ label: 'Renovable', data: famCap.map(f => f.renovable), backgroundColor: C.renovable, stack: 's' }),
        barDs({ label: 'Nuclear', data: famCap.map(f => f.nuclear), backgroundColor: C.nuclear, stack: 's', borderRadius: 0 }),
        barDs({ label: 'Fósil', data: famCap.map(f => f.fosil), backgroundColor: C.fosil, stack: 's', borderRadius: 0 })] },
      options: { scales: { x: noGrid(C, { stacked: true }), y: axis(C, { stacked: true, ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'MW', color: C.ink2 } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${fmt(x.raw)} MW`, footer: it => `Total: ${fmt(CAP_NAC.total[it[0].dataIndex])} MW · limpia ${pct(CAP_NAC.cleanPct[it[0].dataIndex], 2)}` } } } }
    }));
    chart('g-own', C => ({
      type: 'bar', data: { labels: CAP_OWNER_2023.owners, datasets: [barDs({ label: 'MW', data: CAP_OWNER_2023.total, backgroundColor: [C.accent, C.coral, C.renovable, C.ink3] })] },
      options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} MW (${pct(x.raw / 89008 * 100)} del total)` } } } }
    }));
  }

  /* ---------- mapa ---------- */
  async function initMap() {
    map = UI.baseMap('g-map');
    const s = await UI.geo('states');
    const C = colors();
    statesLayer = L.geoJSON(s, { style: () => ({ color: C.line, weight: 1, fillColor: C.surface, fillOpacity: 1 }), interactive: false }).addTo(map);
    map.fitBounds(statesLayer.getBounds(), { padding: [8, 8] });
    layer = L.layerGroup().addTo(map);
    const lg = L.control({ position: 'bottomleft' });
    lg.onAdd = () => { const d = L.DomUtil.create('div', 'map-legend'); d.innerHTML = '<b>Recurso</b><br><i style="background:var(--fosil)"></i>Fósil<br><i style="background:var(--nuclear)"></i>Nuclear<br><i style="background:var(--renovable)"></i>Renovable<br><span class="note">Tamaño ∝ capacidad (MW)</span>'; return d; };
    lg.addTo(map);
    drawMarkers();
  }
  function drawMarkers() {
    if (!layer) return; layer.clearLayers(); const C = colors();
    PLANTS.forEach((p, i) => {
      if (!st.techs.has(p.t)) return;
      const r = 4 + Math.sqrt(p.mw) / 3.2;
      const mk = L.circleMarker([p.lat, p.lon], { radius: r, color: C.surface, weight: 2, fillColor: C[famOf(p.t)], fillOpacity: .88 });
      mk.bindTooltip(`${p.n} · ${fmt(p.mw)} MW`, { direction: 'top' });
      mk.on('click', () => selectPlant(i, false));
      mk.bindPopup(popup(p), { maxWidth: 300 });
      layer.addLayer(mk); p._mk = mk;
    });
  }
  const popup = (p) => `<h4>${p.n}</h4><dl>
    <dt>Ubicación</dt><dd>${p.m ? p.m + ', ' : ''}${p.e}${p.geo === 'MUN' ? ' (aprox., municipio)' : ''}</dd>
    <dt>Tecnología</dt><dd>${p.t} · ${FAMILY_LABEL[famOf(p.t)]}</dd>
    <dt>Capacidad</dt><dd>${fmt(p.mw, p.mw % 1 ? 1 : 0)} MW</dd>
    <dt>Propietario</dt><dd>${p.own}</dd>
    ${p.gen ? `<dt>Generación ${p.gen.y}</dt><dd>${fmt(p.gen.v, 1)} GWh (${p.gen.k})</dd>` : ''}
  </dl><p class="note" style="margin-top:6px">Fuente: ${UI.srcText(p.mwSrc)}</p>`;
  function selectPlant(i, fly) {
    const p = PLANTS[i]; st.plant = i;
    document.getElementById('g-plist').value = i;
    const gh = p.gen ? p.gen.v / (p.mw * 8.76) * 100 : null;
    document.getElementById('g-plant').innerHTML = `
      <h3>${p.n}</h3>
      <div class="kpis" style="grid-template-columns:1fr 1fr">
        <div class="kpi" style="--k:var(--${famOf(p.t)})"><span class="kl">Capacidad</span><span class="kv">${fmt(p.mw, p.mw % 1 ? 1 : 0)}<span class="ku">MW</span></span></div>
        <div class="kpi" style="--k:var(--accent)"><span class="kl">Generación ${p.gen ? p.gen.y : ''}</span>${p.gen ? `<span class="kv">${fmt(p.gen.v, 1)}<span class="ku">GWh</span></span>` : '<span class="kv na">Dato no disponible</span>'}</div>
      </div>
      <dl style="display:grid;grid-template-columns:auto 1fr;gap:4px 10px;margin:0;font-size:14px">
        <dt class="note">Ubicación</dt><dd style="margin:0">${p.m ? p.m + ', ' : ''}${p.e}${p.geo === 'MUN' ? ' <span class="badge">aprox.</span>' : ''}</dd>
        <dt class="note">Tecnología</dt><dd style="margin:0">${p.t} (${FAMILY_LABEL[famOf(p.t)]})</dd>
        <dt class="note">Propietario</dt><dd style="margin:0">${p.own === 'PIE' ? term('pie', 'PIE') : p.own}</dd>
        ${gh ? `<dt class="note">Factor de planta</dt><dd style="margin:0">≈ ${pct(gh)} <span class="note">(cálculo)</span></dd>` : ''}
        <dt class="note">Coordenadas</dt><dd style="margin:0">${p.lat.toFixed(4)}, ${p.lon.toFixed(4)} · ${p.geo === 'GPPD' ? 'WRI GPPD' : 'municipio INEGI/CONABIO'}</dd>
      </dl>
      ${cite([p.mwSrc, ...(p.gen ? [p.gen.src] : []), ...(p.a19 ? [{ s: 'P24', p: '195–198', t: 'Cuadro A1.9, núm. ' + p.a19 }] : []), { s: p.geo === 'GPPD' ? 'GPPD' : 'GEO' }])}`;
    if (fly && map) { map.flyTo([p.lat, p.lon], 7, { duration: .6 }); if (p._mk) setTimeout(() => p._mk.openPopup(), 650); }
  }

  function onShow() { if (map) setTimeout(() => map.invalidateSize(), 50); }
  function onTheme() { if (statesLayer) { const C = colors(); statesLayer.setStyle({ color: C.line, fillColor: C.surface }); drawMarkers(); } }
  return { render, onShow, onTheme };
})();
