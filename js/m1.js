/* Módulo 1 · Generación eléctrica */
window.M1 = (() => {
  const { fmt, pct, cite, term, chart, axis, noGrid, barDs, legendHTML, table, seg, sum, colors } = UI;
  let st = { year: '2023', scope: 'nac', techs: new Set(), plant: null };
  let map, layer;
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
        <div class="subnav" role="navigation" aria-label="En este módulo">${['Mapa', 'Por tecnología', 'Septiembre 2026', 'Fósiles y limpias', 'Ciclo combinado', 'Capacidad', 'Emisiones'].map((n, i) => `<button type="button" data-go="${i}"><span>1.${i + 1}</span>${n}</button>`).join('')}</div>
        <div class="filters">
          <span class="flab">Año</span><div class="seg" id="g-year"></div>
          <span class="flab">Ámbito</span><div class="seg" id="g-scope"></div>
        </div>
        <div class="filters"><span class="flab">Tecnología</span><div class="chips" id="g-tech" role="group" aria-label="Filtrar por tecnología"></div></div>
      </div>
      <div class="kpis" id="g-kpis"></div>

      <div class="sec-title"><span class="num">1.1</span><h2>Mapa de centrales eléctricas</h2></div>
      <div class="card c8">
        <div class="card-h"><div><h2>${PLANTS.length} centrales reales en ${new Set(PLANTS.map(p => p.e)).size} entidades</h2><p class="sub">El tamaño del pin indica la capacidad (MW) y el color el recurso. Busca una central o toca un pin.</p></div></div>
        <div class="mapwrap">
          <div class="gm-search" role="search">
            <input id="g-q" type="search" placeholder="Buscar central, estado o tecnología" autocomplete="off" aria-label="Buscar central" aria-controls="g-qlist" aria-expanded="false">
            <ul id="g-qlist" role="listbox" hidden></ul>
          </div>
          <div id="g-map" class="map" role="region" aria-label="Mapa de centrales eléctricas"></div>
        </div>
        <p class="note">Coordenadas: WRI Global Power Plant Database (datos NACEI/CFE-CENACE) y, cuando se indica «aprox.», punto interior del municipio (INEGI/CONABIO). Lista de centrales: PRODESEN 2024-2038, Cuadro A1.9. Mapa base: mosaicos abiertos © OpenStreetMap y CARTO, con fondo propio de respaldo y límites estatales INEGI/CONABIO.</p>
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

      <div class="sec-title"><span class="num">1.3</span><h2>Septiembre de 2026, hora por hora</h2></div>
      <div class="card c12" id="hourCard">
        <div class="card-h"><div><h2>Qué tecnología generó la electricidad en cada hora</h2><p class="sub">Energía generada liquidada por CENACE en el SEN (MWh por hora, equivalente a MW promedio de esa hora). Cada hora del día se llena con una mezcla distinta: de noche domina el gas; al mediodía entra el sol; al caer la tarde sube la hidroeléctrica.</p></div><span class="badge nac">SEN · CENACE · liquidación L0</span></div>
        <div class="filters">
          <span class="flab">Vista</span><div class="seg" id="h-mode"></div>
          <span class="ctrl" id="h-dayctl" style="display:flex;align-items:center;gap:8px"><label class="flab" for="h-day">Día de septiembre</label><input type="range" id="h-day" min="1" max="30" value="1" style="width:160px;accent-color:var(--coral)"><output id="h-dayo" style="font-weight:700;min-width:2ch">1</output></span>
        </div>
        <div class="kpis" id="h-kpis"></div>
        <div class="chart" style="height:360px"><canvas id="g-hour" aria-label="Generación horaria por tecnología, septiembre de 2026"></canvas></div>
        <div id="h-leg"></div>
        <p class="callout" id="h-ins"></p>
        <div id="h-tbl"></div>
        ${cite(GEN_SEP26.src)}
      </div>
      <div class="card c7">
        <div class="card-h"><div><h2>Participación de cada tecnología en el mes</h2><p class="sub">Septiembre de 2026, 30 días de operación.</p></div><span class="badge nac">SEN · CENACE</span></div>
        <div class="chart"><canvas id="g-hmix" aria-label="Participación por tecnología en septiembre de 2026"></canvas></div>
        <div id="h-mixsrc"></div>
      </div>
      <div class="card c5">
        <h2>Cómo leer estos datos</h2>
        <ul class="issues">
          <li><b>Qué mide:</b> la energía que cada tecnología entregó, ya liquidada por el CENACE (versión original, L0), hora por hora.</li>
          <li><b>Qué no es:</b> no es la serie anual neta inyectada del PRODESEN. Los totales no se pueden comparar uno a uno; por eso aquí solo se comparan porcentajes.</li>
          <li><b>Hora 1:</b> el CENACE numera las horas del 1 al 24; la hora 1 va de las 00:00 a las 01:00.</li>
          <li><b>Una liquidación posterior (L1, L2…)</b> puede ajustar los valores; el archivo usado es el original.</li>
        </ul>
        <div id="h-cmp"></div>
      </div>

      <div class="sec-title"><span class="num">1.4</span><h2>Fuentes fósiles y limpias</h2></div>
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

      <div class="sec-title" id="ccvc"><span class="num">1.5</span><h2>Ciclo combinado frente a vapor convencional</h2></div>
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

      <div class="sec-title"><span class="num">1.6</span><h2>Capacidad instalada</h2></div>
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

      <div class="sec-title"><span class="num">1.7</span><h2>Emisiones asociadas a la electricidad</h2></div>
      <div class="card c5">
        <div class="card-h"><h2>Factor de emisión del SEN</h2><span class="badge nac">Nacional · ${FE_SEN.year}</span></div>
        <div class="kpis" style="grid-template-columns:1fr 1fr">
          <div class="kpi" style="--k:var(--fosil)"><span class="kl">Factor de emisión</span><span class="kv">${fmt(FE_SEN.v, 3)}<span class="ku">${FE_SEN.u}</span></span><span class="kd">= ${fmt(FE_SEN.v * 1000)} gCO₂e por kWh</span></div>
          <div class="kpi" style="--k:var(--coral)"><span class="kl">Promedio del parque CFE</span><span class="kv">${fmt(GEN_CFE.co2.v, 1)}<span class="ku">tCO₂/MWh</span></span><span class="kd">2022–2024, solo CFE</span></div>
        </div>
        <p class="sub">El factor oficial sirve para estimar las emisiones <b>indirectas</b> de quien consume electricidad de la red. El de 2025 todavía no se publica; durante el periodo de reporte 2026 de la Cédula de Operación Anual (vigente hasta el 30 de junio) se usa el de 2024.</p>
        <div class="callout warn">Los dos valores no se pueden comparar directamente: uno es del sistema eléctrico completo (en CO₂e) y el otro solo del parque de CFE (en CO₂). Tampoco son emisiones de ciclo de vida (módulo 0.6).</div>
        ${cite([FE_SEN.src, GEN_CFE.co2.src])}
      </div>
      <div class="card c7">
        <h2>Calculadora: ¿cuánto CO₂e implica tu consumo?</h2>
        <p class="sub">Multiplica tu consumo por el factor del SEN 2024. Es una estimación de emisiones indirectas.</p>
        <div class="ctrl" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <label class="flab" for="e-kwh">Consumo (kWh por mes)</label>
          <input type="range" id="e-kwh" min="50" max="3000" step="10" value="250" style="flex:1;min-width:160px;accent-color:var(--coral)">
          <output id="e-kwho" style="font:700 18px 'Sora',sans-serif;min-width:6ch">250 kWh</output>
        </div>
        <div class="kpis" id="e-out"></div>
        <p class="note">Fórmula: emisiones (kg CO₂e) = consumo (kWh) × ${fmt(FE_SEN.v * 1000)} g/kWh ÷ 1,000. Cálculo propio con el factor oficial.</p>
        ${cite([FE_SEN.src, { s: 'CALC' }])}
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
    root.querySelector('.subnav').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const t = root.querySelectorAll('.sec-title')[+b.dataset.go]; if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    staticCharts();
    draw(root);
    initMap(root);
    buildHourly(root);
    buildEmis(root);
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

  /* ---------- 1.3 septiembre de 2026, hora por hora ---------- */
  const HGROUPS = [
    { k: 'Nuclear', techs: ['Nucleoeléctrica'], c: C => C.nuclear },
    { k: 'Geotermia y bioenergía', techs: ['Geotermoeléctrica', 'Bioenergía'], c: () => (UI.isDark() ? '#9BC25B' : '#6F9B2E') },
    { k: 'Ciclo combinado', techs: ['Ciclo combinado'], c: C => C.fosil },
    { k: 'Otras fósiles (carbón, vapor, turbogás, combustión interna)', techs: ['Carboeléctrica', 'Térmica convencional', 'Turbogás', 'Combustión interna'], c: () => (UI.isDark() ? '#F6B08F' : '#F2A07B') },
    { k: 'Hidroeléctrica', techs: ['Hidroeléctrica'], c: C => C.renovable },
    { k: 'Eólica', techs: ['Eólica'], c: () => (UI.isDark() ? '#6FB1F0' : '#3B82C4') },
    { k: 'Solar fotovoltaica', techs: ['Fotovoltaica'], c: () => (UI.isDark() ? '#F5C451' : '#E5A91A') }
  ];
  const TECH_FAM = { 'Eólica': 'Eoloeléctrica' };
  let H = null, hs = { mode: 'avg', day: 1 };
  const hsum = (techs, i) => sum(techs.map(t => H.mwh[t][i]));
  function hourSeries() {
    // devuelve, por grupo, 24 valores en MW: promedio del mes o un día
    return HGROUPS.map(g => Array.from({ length: 24 }, (_, h) => {
      if (hs.mode === 'day') return hsum(g.techs, (hs.day - 1) * 24 + h);
      let t = 0; for (let d = 0; d < H.days; d++) t += hsum(g.techs, d * 24 + h); return t / H.days;
    }));
  }
  async function buildHourly(root) {
    seg(root.querySelector('#h-mode'), [{ v: 'avg', l: 'Promedio del mes' }, { v: 'day', l: 'Un día' }], hs.mode, v => { hs.mode = v; root.querySelector('#h-dayctl').style.display = v === 'day' ? 'flex' : 'none'; drawHour(); });
    const sl = root.querySelector('#h-day'), out = root.querySelector('#h-dayo');
    root.querySelector('#h-dayctl').style.display = 'none';
    sl.addEventListener('input', () => { hs.day = +sl.value; out.textContent = sl.value; drawHour(); });
    try { H = await (await fetch(GEN_SEP26.file)).json(); } catch (e) { H = null; }
    if (!H) { root.querySelector('#hourCard').insertAdjacentHTML('beforeend', '<p class="na">Dato no disponible: no se pudo cargar el archivo de generación de septiembre de 2026.</p>'); return; }
    drawHour();
    // participación mensual por tecnología
    const rows = H.tech.map(t => [t, sum(H.mwh[t]) / 1000]).sort((a, b) => b[1] - a[1]); const T = sum(rows.map(r => r[1]));
    chart('g-hmix', C => ({
      type: 'bar', data: { labels: rows.map(r => r[0]), datasets: [barDs({ data: rows.map(r => r[1]), backgroundColor: rows.map(r => C[FAMILY[TECH_FAM[r[0]] || r[0]]]) })] },
      options: { indexAxis: 'y', scales: { x: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'GWh en septiembre de 2026', color: C.ink2 } }), y: noGrid(C) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} GWh · ${pct(x.raw / T * 100)}` } } } }
    }));
    root.querySelector('#h-mixsrc').innerHTML = table(['Tecnología', 'GWh', '% del total'], rows.map(([t, v]) => [t, v, UI.fmt(v / T * 100, 1)])) + cite([GEN_SEP26.src, { s: 'CALC' }]);
    // comparación de porcentajes con 2023
    const famSep = { fosil: 0, nuclear: 0, renovable: 0 }; rows.forEach(([t, v]) => { famSep[FAMILY[TECH_FAM[t] || t]] += v; });
    const i23 = GEN_NAC.years.indexOf(2023); const fam23 = { fosil: 0, nuclear: 0, renovable: 0 }; Object.entries(GEN_NAC.tech).forEach(([t, a]) => { fam23[FAMILY[t]] += a[i23]; });
    root.querySelector('#h-cmp').innerHTML = `<div class="tblwrap"><table class="data"><thead><tr><th scope="col">Recurso</th><th scope="col">Sep. 2026</th><th scope="col">2023 (anual)</th></tr></thead><tbody>${['fosil', 'nuclear', 'renovable'].map(k => `<tr><th scope="row">${FAMILY_LABEL[k]}</th><td>${pct(famSep[k] / T * 100)}</td><td>${pct(fam23[k] / GEN_NAC.total[i23] * 100)}</td></tr>`).join('')}</tbody></table></div><p class="note">Un mes de verano no es un año: la hidroeléctrica y la demanda cambian con la estación. Cálculo propio. ${cite([GEN_SEP26.src, GEN_NAC.src, { s: 'CALC' }])}</p>`;
  }
  function drawHour() {
    if (!H) return; const root = document.getElementById('hourCard'); if (!root) return;
    const ser = hourSeries(); const tot = Array.from({ length: 24 }, (_, h) => sum(ser.map(g => g[h])));
    const hrs = Array.from({ length: 24 }, (_, h) => h + 1);
    const label = hs.mode === 'avg' ? 'Promedio de los 30 días' : `Día ${hs.day} de septiembre de 2026`;
    const maxI = tot.indexOf(Math.max(...tot)), minI = tot.indexOf(Math.min(...tot));
    const FV = ser[6], sol = FV.indexOf(Math.max(...FV));
    const energyGWh = hs.mode === 'avg' ? sum(H.tech.map(t => sum(H.mwh[t]))) / 1000 : sum(tot) / 1000;
    root.querySelector('#h-kpis').innerHTML = [
      [hs.mode === 'avg' ? 'Energía del mes' : 'Energía del día', fmt(energyGWh), 'GWh', label, 'var(--accent)'],
      ['Hora de máxima generación', fmt(tot[maxI]), 'MW', `Hora ${maxI + 1} (${String(maxI).padStart(2, '0')}:00–${String(maxI + 1).padStart(2, '0')}:00)`, 'var(--fosil)'],
      ['Hora de mínima generación', fmt(tot[minI]), 'MW', `Hora ${minI + 1}`, 'var(--nuclear)'],
      ['Pico solar fotovoltaico', fmt(FV[sol]), 'MW', `Hora ${sol + 1} · ${pct(FV[sol] / tot[sol] * 100)} del total`, 'var(--renovable)']
    ].map(([l, v, u, d, c]) => `<div class="kpi" style="--k:${c}"><span class="kl">${l}</span><span class="kv">${v}<span class="ku">${u}</span></span><span class="kd">${d}</span></div>`).join('');
    chart('g-hour', C => ({
      type: 'line',
      data: { labels: hrs, datasets: HGROUPS.map((g, i) => ({ label: g.k, data: ser[i], fill: i === 0 ? 'origin' : '-1', backgroundColor: g.c(C), borderColor: C.surface, borderWidth: 1, pointRadius: 0, pointHoverRadius: 4, tension: .25 })) },
      options: {
        interaction: { mode: 'index', intersect: false },
        scales: { x: noGrid(C, { title: { display: true, text: 'Hora del día (CENACE: la hora 1 va de 00:00 a 01:00)', color: C.ink2 } }), y: axis(C, { stacked: true, beginAtZero: true, title: { display: true, text: 'MW', color: C.ink2 }, ticks: { color: C.ink2, callback: v => fmt(v) } }) },
        plugins: { tooltip: { callbacks: { title: it => `${label} · hora ${it[0].label}`, label: x => ` ${x.dataset.label.split(' (')[0]}: ${fmt(x.raw)} MW`, footer: it => `Total: ${fmt(tot[it[0].dataIndex])} MW` } } }
      }
    }));
    const C0 = UI.colors();
    root.querySelector('#h-leg').innerHTML = UI.legendHTML(HGROUPS.slice().reverse().map(g => [g.c(C0), g.k]));
    const hy = ser[4];
    root.querySelector('#h-ins').innerHTML = `<b>Lo que se ve:</b> a la hora ${sol + 1} el sol aporta ${pct(FV[sol] / tot[sol] * 100)} de la generación; después de la puesta del sol, la hidroeléctrica pasa de ${fmt(hy[13])} MW (hora 14) a ${fmt(hy[19])} MW (hora 20) para cubrir la subida de la demanda de la noche. Cálculo propio con los datos de ${label.toLowerCase()}.`;
    root.querySelector('#h-tbl').innerHTML = table(['Hora', ...HGROUPS.map(g => g.k.split(' (')[0] + ' (MW)'), 'Total (MW)'], hrs.map((h, i) => [h, ...ser.map(g => Math.round(g[i])), Math.round(tot[i])]));
  }

  /* ---------- 1.7 emisiones ---------- */
  function buildEmis(root) {
    const sl = root.querySelector('#e-kwh'), o = root.querySelector('#e-kwho'), out = root.querySelector('#e-out');
    const upd = () => {
      const kwh = +sl.value; o.textContent = fmt(kwh) + ' kWh';
      const kgM = kwh * FE_SEN.v; // kWh × tCO2e/MWh = kg CO2e (1 MWh = 1000 kWh, 1 t = 1000 kg)
      out.innerHTML = [['Por mes', fmt(kgM, 1), 'kg CO₂e', `${fmt(kwh)} kWh × ${fmt(FE_SEN.v * 1000)} g/kWh`, 'var(--fosil)'], ['Por año', fmt(kgM * 12 / 1000, 2), 't CO₂e', 'Si el consumo se mantiene 12 meses', 'var(--coral)']]
        .map(([l, v, u, d, c]) => `<div class="kpi" style="--k:${c}"><span class="kl">${l}</span><span class="kv">${v}<span class="ku">${u}</span></span><span class="kd">${d}</span></div>`).join('');
    };
    sl.addEventListener('input', upd); upd();
  }

  /* ---------- mapa estilo Google ---------- */
  const pinSize = (mw) => mw >= 1000 ? 36 : mw >= 300 ? 28 : 21;
  async function initMap(root) {
    map = UI.baseMap('g-map', { google: true });
    map.zoomControl.setPosition('bottomright');
    layer = L.layerGroup().addTo(map);
    const lg = L.control({ position: 'bottomleft' });
    lg.onAdd = () => { const d = L.DomUtil.create('div', 'map-legend'); d.innerHTML = '<b>Recurso</b><br><i style="background:var(--fosil)"></i>Fósil<br><i style="background:var(--nuclear)"></i>Nuclear<br><i style="background:var(--renovable)"></i>Renovable<br><span class="note">Pin más grande = más MW<br>(&lt; 300 · 300–999 · ≥ 1,000)</span>'; return d; };
    lg.addTo(map);
    drawMarkers();
    const bounds = await map.gmReady;
    map.fitBounds(bounds, { padding: [10, 10] });
    initSearch(root);
  }
  function drawMarkers() {
    if (!layer) return; layer.clearLayers(); const C = colors();
    PLANTS.forEach((p, i) => {
      if (!st.techs.has(p.t)) return;
      const mk = L.marker([p.lat, p.lon], { icon: UI.pinIcon(C[famOf(p.t)], pinSize(p.mw)), title: p.n, riseOnHover: true, zIndexOffset: Math.round(p.mw) });
      mk.bindTooltip(`${p.n} · ${fmt(p.mw)} MW`, { direction: 'right', offset: [8, -6] });
      mk.on('click', () => selectPlant(i, false));
      mk.bindPopup(popup(p), { maxWidth: 300 });
      layer.addLayer(mk); p._mk = mk;
    });
  }
  /* Buscador flotante (estilo Google Maps) */
  const norm = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function initSearch(root) {
    const q = root.querySelector('#g-q'), ul = root.querySelector('#g-qlist');
    const close = () => { ul.hidden = true; q.setAttribute('aria-expanded', 'false'); };
    const open = () => {
      const t = norm(q.value.trim());
      const hits = PLANTS.map((p, i) => [p, i]).filter(([p]) => !t || norm(`${p.n} ${p.e} ${p.t} ${p.own}`).includes(t)).slice(0, 8);
      ul.innerHTML = hits.length ? hits.map(([p, i]) => `<li role="option"><button type="button" data-i="${i}"><i style="background:var(--${famOf(p.t)})"></i><span><b>${UI.esc(p.n)}</b><small>${UI.esc(p.e)} · ${p.t} · ${fmt(p.mw, p.mw % 1 ? 1 : 0)} MW</small></span></button></li>`).join('') : '<li class="none">Sin resultados</li>';
      ul.hidden = false; q.setAttribute('aria-expanded', 'true');
    };
    q.addEventListener('input', open); q.addEventListener('focus', open);
    q.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); q.blur(); } if (e.key === 'Enter') { const b = ul.querySelector('button'); if (b) b.click(); } });
    ul.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const i = +b.dataset.i; if (!st.techs.has(PLANTS[i].t)) { st.techs.add(PLANTS[i].t); drawMarkers(); } q.value = PLANTS[i].n; close(); selectPlant(i, true); });
    document.addEventListener('click', e => { if (!e.target.closest('.gm-search')) close(); });
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
    layer && layer.eachLayer(l => { const e = l.getElement && l.getElement(); if (e) e.classList.toggle('sel', l === p._mk); });
    if (fly && map) { map.flyTo([p.lat, p.lon], 7, { duration: .6 }); if (p._mk) setTimeout(() => p._mk.openPopup(), 650); }
  }

  function onShow() { if (map) setTimeout(() => map.invalidateSize(), 50); }
  function onTheme() { if (map) { map.refreshTheme(); drawMarkers(); } drawHour(); }
  return { render, onShow, onTheme };
})();
