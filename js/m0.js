/* Módulo 0 · Recursos energéticos */
window.M0 = (() => {
  const { fmt, pct, cite, term, chart, axis, noGrid, barDs, legendHTML, table, seg, sum } = UI;
  const Y = GEN_NAC.years, i23 = Y.indexOf(2023);
  const tot23 = GEN_NAC.total[i23];
  const share = (techs) => sum(techs.map(t => GEN_NAC.tech[t][i23])) / tot23 * 100;

  /* Recursos: cadena recurso → combustible → conversión → tecnología → electricidad (descripciones conceptuales) */
  const RES = {
    gas:   { n: 'Gas natural', fam: 'fosil', ic: '🔥', comb: 'Gas natural (principalmente metano), transportado por gasoducto', proc: 'Química → térmica (combustión) → mecánica (turbinas) → eléctrica', tec: ['Ciclo combinado', 'Turbogás', 'Térmica convencional', 'Combustión interna'], key: 'ciclo-combinado', ctrl: 'Controlable: se despacha según la demanda', lca: 'Gas natural (ciclo combinado)', fuel: 'Gas natural', imp: ['Ciclo combinado', 'Turbogás'] },
    carbon:{ n: 'Carbón mineral', fam: 'fosil', ic: '⛏️', comb: 'Carbón pulverizado que se quema en una caldera', proc: 'Química → térmica (caldera) → vapor → mecánica (turbina) → eléctrica', tec: ['Carboeléctrica'], key: 'carboelectrica', ctrl: 'Controlable, aunque con arranques lentos', lca: 'Carbón (pulverizado)', fuel: 'Carbón', imp: ['Carboeléctrica'] },
    comb:  { n: 'Combustóleo', fam: 'fosil', ic: '🛢️', comb: 'Derivado pesado del petróleo', proc: 'Química → térmica (caldera) → vapor → mecánica → eléctrica', tec: ['Térmica convencional', 'Combustión interna'], key: 'vapor-convencional', ctrl: 'Controlable', lca: null, fuel: 'Combustóleo', imp: ['Térmica convencional'] },
    diesel:{ n: 'Diésel y derivados', fam: 'fosil', ic: '⛽', comb: 'Diésel u otros destilados del petróleo', proc: 'Química → térmica (motor o turbina) → mecánica → eléctrica', tec: ['Combustión interna', 'Turbogás'], key: 'combustion-interna', ctrl: 'Controlable; útil en sistemas aislados y picos', lca: null, fuel: 'Diésel', imp: ['Combustión interna'] },
    uranio:{ n: 'Uranio', fam: 'nuclear', ic: '⚛️', comb: 'Uranio enriquecido en barras de combustible', proc: 'Nuclear (fisión) → térmica → vapor → mecánica → eléctrica', tec: ['Nucleoeléctrica'], key: 'nucleoelectrica', ctrl: 'Controlable; opera casi siempre a plena carga', lca: 'Nuclear', fuel: null, imp: ['Nucleoeléctrica'] },
    solar: { n: 'Radiación solar', fam: 'renovable', ic: '☀️', comb: 'No hay combustible: llegan fotones a la celda', proc: 'Radiante → eléctrica (efecto fotovoltaico, corriente directa) → inversor (alterna)', tec: ['Fotovoltaica'], key: 'fotovoltaico', ctrl: 'Variable: depende de la hora, las nubes y la estación', lca: 'Solar FV (gran escala)', fuel: null, imp: ['Fotovoltaica', 'Híbrido FV-Batería'] },
    viento:{ n: 'Viento', fam: 'renovable', ic: '🌬️', comb: 'No hay combustible: masa de aire en movimiento', proc: 'Cinética del aire → mecánica (rotor) → eléctrica (generador)', tec: ['Eoloeléctrica'], key: 'renovable', ctrl: 'Variable: depende de la velocidad del viento', lca: 'Eólica (terrestre)', fuel: null, imp: ['Eoloeléctrica'] },
    agua:  { n: 'Energía hidráulica', fam: 'renovable', ic: '💧', comb: 'No hay combustible: agua almacenada en presas o en cauces', proc: 'Potencial (altura) → cinética → mecánica (turbina) → eléctrica', tec: ['Hidroeléctrica'], key: 'renovable', ctrl: 'Controlable con presa, pero limitada por el agua disponible', lca: 'Hidroeléctrica', fuel: null, imp: ['Hidroeléctrica'] },
    geo:   { n: 'Calor geotérmico', fam: 'renovable', ic: '🌋', comb: 'Vapor y agua caliente de yacimientos subterráneos', proc: 'Térmica del subsuelo → vapor → mecánica (turbina) → eléctrica', tec: ['Geotermoeléctrica'], key: 'geotermica', ctrl: 'Controlable: produce de forma continua', lca: 'Geotermia', fuel: null, imp: ['Geotermoeléctrica'] },
    bio:   { n: 'Biomasa y biogás', fam: 'renovable', ic: '🌿', comb: 'Bagazo de caña, residuos orgánicos o biogás de rellenos sanitarios', proc: 'Química (biomasa) → térmica (combustión) → mecánica → eléctrica', tec: ['Bioenergía'], key: 'renovable', ctrl: 'Controlable si hay combustible almacenado', lca: 'Biomasa (dedicada)', fuel: null, imp: ['Bioenergía'] }
  };

  let state = { res: 'gas', scope: 'nac', year: '2023', cmp: ['gas', 'solar', 'uranio'], conv: 'gas', stage: 0 };

  function render(root) {
    root.innerHTML = `
    <div class="mod-head">
      <span class="kicker">Módulo 0</span>
      <h1 id="h-m0">Recursos energéticos</h1>
      <p>De dónde sale la energía que se convierte en electricidad. Distingue el ${term('recurso-primario', 'recurso primario')}, el ${term('combustible', 'combustible')}, el ${term('conversion', 'proceso de conversión')} y la ${term('tecnologia', 'tecnología')}.</p>
    </div>
    <div class="grid">
      <div class="sec-title"><span class="num">0.1</span><h2>Del recurso a la electricidad</h2></div>
      <div class="card c12">
        <div class="card-h"><div><h2>Elige un recurso y sigue la cadena</h2><p class="sub">Cada recurso pasa por cinco etapas distintas antes de llegar a la red.</p></div></div>
        <div class="chips" id="resChips" role="group" aria-label="Recurso energético"></div>
        <div class="chain" id="chain" aria-live="polite"></div>
      </div>

      <div class="sec-title"><span class="num">0.2</span><h2>Fósiles, nucleares y renovables</h2></div>
      <div class="card c8"><div class="three" id="fams"></div>
        <div class="callout"><b>Una tecnología puede usar varios combustibles.</b> PRODESEN agrupa como térmica convencional a centrales que queman gas natural, diésel, combustóleo o coque, y la combustión interna puede usar gas natural, diésel o combustóleo. Por eso conviene clasificar por recurso y no solo por tecnología. ${cite({ s: 'P24', p: '201', t: 'notas del Cuadro A1.11' })}</div>
      </div>
      <div class="card c4">
        <h2>Renovable ≠ limpia</h2>
        <p class="sub">${term('renovable', 'Renovable')} describe si el recurso se regenera; ${term('limpia', 'limpia')} es una categoría legal basada en emisiones.</p>
        <svg viewBox="0 0 320 230" role="img" aria-labelledby="vennT" style="width:100%;height:auto">
          <title id="vennT">Diagrama: todas las renovables son limpias; la nuclear y la cogeneración eficiente son limpias pero no renovables.</title>
          <rect x="6" y="6" width="308" height="218" rx="18" fill="none" stroke="var(--line-2)" stroke-dasharray="5 4"/>
          <text x="20" y="30" font-size="13" font-weight="700" fill="var(--ink)">Energías limpias (definición legal)</text>
          <ellipse cx="110" cy="130" rx="88" ry="70" fill="var(--renovable)" fill-opacity=".16" stroke="var(--renovable)" stroke-width="2"/>
          <text x="110" y="100" text-anchor="middle" font-size="13" font-weight="700" fill="var(--renovable)">Renovables</text>
          <text x="110" y="122" text-anchor="middle" font-size="12" fill="var(--ink-2)">solar · eólica</text>
          <text x="110" y="140" text-anchor="middle" font-size="12" fill="var(--ink-2)">hidroeléctrica</text>
          <text x="110" y="158" text-anchor="middle" font-size="12" fill="var(--ink-2)">geotermia · bioenergía</text>
          <rect x="216" y="70" width="92" height="40" rx="10" fill="var(--nuclear)" fill-opacity=".16" stroke="var(--nuclear)"/>
          <text x="262" y="95" text-anchor="middle" font-size="12.5" font-weight="700" fill="var(--nuclear)">Nuclear</text>
          <rect x="208" y="124" width="104" height="52" rx="10" fill="var(--fosil)" fill-opacity=".14" stroke="var(--fosil)"/>
          <text x="260" y="146" text-anchor="middle" font-size="12" font-weight="700" fill="var(--fosil)">Cogeneración</text>
          <text x="260" y="163" text-anchor="middle" font-size="12" font-weight="700" fill="var(--fosil)">eficiente</text>
          <text x="262" y="200" text-anchor="middle" font-size="11" fill="var(--ink-3)">limpias, no renovables</text>
        </svg>
        <p class="note">La energía nucleoeléctrica y la cogeneración eficiente aparecen como energías limpias en la LIE de 2014 (art. 3, fr. XXII, incisos i y k) y en la Ley del Sector Eléctrico de 2025 (art. 3, fr. XXI). La Ley de Planeación y Transición Energética de 2025 define las renovables como fuentes que se regeneran de forma natural; el uranio no lo hace.</p>
        ${cite([{ s: 'DOF14', p: '45–46' }, { s: 'DOF25', p: '86' }, { s: 'DOF25', p: '193' }])}
      </div>

      <div class="sec-title" id="clasificador"><span class="num">0.3</span><h2>Clasificador interactivo</h2></div>
      <div class="card c12" id="sorterCard"></div>

      <div class="sec-title"><span class="num">0.4</span><h2>Diagramas de conversión de energía</h2></div>
      <div class="card c12">
        <div class="conv-tabs chips" id="convTabs" role="group" aria-label="Cadena de conversión"></div>
        <div class="flow" id="flow"></div>
        <div class="stage-info" id="stageInfo" aria-live="polite"></div>
      </div>

      <div class="sec-title"><span class="num">0.5</span><h2>Matriz energética por recurso</h2></div>
      <div class="card c12">
        <div class="filters">
          <span class="flab">Ámbito</span><div class="seg" id="scopeSeg"></div>
          <span class="flab">Año</span><div class="seg" id="yearSeg"></div>
          <span id="scopeBadge"></span>
        </div>
      </div>
      <div class="kpis" id="matKpis"></div>
      <div class="card c5">
        <div class="card-h"><h2>Composición por recurso</h2><span id="compBadge"></span></div>
        <div class="chart" id="compWrap"><canvas id="m0comp" aria-label="Participación fósil, nuclear y renovable"></canvas></div>
        <div id="compLegend"></div>
        <div id="compSrc"></div>
      </div>
      <div class="card c7">
        <div class="card-h"><h2>Generación por tecnología</h2><span class="note">Color = recurso primario</span></div>
        <div class="chart lg" id="techWrap"><canvas id="m0tech" aria-label="Generación por tecnología"></canvas></div>
        <div id="techTbl"></div>
      </div>
      <div class="card c12">
        <div class="card-h"><div><h2>Evolución de la generación nacional por recurso, 2018–2023</h2><p class="sub">Generación neta inyectada a la red (GWh). Pasa el cursor sobre cada año para ver el total y el porcentaje oficial de energía limpia.</p></div><span class="badge nac">Nacional</span></div>
        <div class="chart" style="height:320px"><canvas id="m0evo" aria-label="Evolución de la generación por recurso"></canvas></div>
        ${legendHTML([['var(--fosil)', 'Fósil (incluye cogeneración eficiente)'], ['var(--nuclear)', 'Nuclear'], ['var(--renovable)', 'Renovable']])}
        <p class="note">Para 2024 no hay generación nacional por tecnología en los documentos disponibles: «Dato no disponible». Para CFE sí hay datos de 2023 y 2024.</p>
        ${cite(GEN_NAC.src)}
      </div>

      <div class="sec-title" id="comparador"><span class="num">0.6</span><h2>Comparador energético</h2></div>
      <div class="card c12">
        <p class="sub">Selecciona dos o más recursos para compararlos.</p>
        <div class="chips" id="cmpChips" role="group" aria-label="Recursos a comparar"></div>
        <div class="tblwrap"><table class="cmp-table" id="cmpTable"></table></div>
        <div class="grid" style="padding:0;gap:16px">
          <div class="c6" style="min-width:0">
            <h3>Emisiones de ${term('ciclo-vida', 'ciclo de vida')} (mediana)</h3>
            <div class="chart sm"><canvas id="m0lca" aria-label="Emisiones de ciclo de vida"></canvas></div>
            ${cite(EMIS_LCA.src)}
          </div>
          <div class="c6" style="min-width:0">
            <h3>Emisión ${term('directas', 'directa')} por energía del combustible</h3>
            <div class="chart sm"><canvas id="m0fuel" aria-label="Factor de emisión por combustible"></canvas></div>
            ${cite(EMIS_FUEL.src)}
          </div>
        </div>
        <div class="callout">No se mezclan las dos medidas. El <b>ciclo de vida</b> se expresa en gCO₂e por kWh e incluye fabricación, construcción, combustible y desmantelamiento. El <b>factor directo</b> se expresa en kg de CO₂ por GJ de combustible quemado; para convertirlo a kWh eléctrico hay que dividir entre la eficiencia de la central. Las tecnologías sin combustión no tienen emisión directa por combustión; para el CO₂ que libera el vapor geotérmico no hay dato en las fuentes: «Dato no disponible».</div>
      </div>

      <div class="sec-title"><span class="num">0.7</span><h2>Indicadores de conciencia energética</h2></div>
      <div class="grid" id="consc" style="grid-column:span 12;padding:0"></div>

      <div class="sec-title" id="reflexion"><span class="num">0.8</span><h2>Actividad de reflexión</h2></div>
      <div class="card c5">
        <h2>Gráfica de apoyo: hidroeléctrica y fotovoltaica</h2>
        <p class="sub">Generación anual (GWh) de dos tecnologías renovables. La tabla incluye la capacidad instalada (MW). Úsala en las preguntas 1 a 3.</p>
        <div class="chart"><canvas id="m0q" aria-label="Generación hidroeléctrica y fotovoltaica 2018-2023"></canvas></div>
        ${legendHTML([['var(--renovable)', 'Hidroeléctrica (GWh)'], ['var(--coral)', 'Fotovoltaica (GWh)']])}
        <div id="qTbl"></div>
        ${cite([GEN_NAC.src, CAP_NAC.src])}
      </div>
      <div class="card c7"><div class="quiz" id="quiz"></div></div>
    </div>`;


    buildChain(root); buildFams(root); buildSorter(root); buildConv(root); buildMatrix(root); buildCmp(root); buildConsc(root); buildQuiz(root);
  }

  /* ---------- 0.1 cadena ---------- */
  function buildChain(root) {
    const c = root.querySelector('#resChips');
    c.innerHTML = Object.entries(RES).map(([k, r]) => `<button type="button" class="chip" data-k="${k}" aria-pressed="${k === state.res}" style="--c:var(--${r.fam})"><span class="dot"></span>${r.ic} ${r.n}</button>`).join('');
    c.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; state.res = b.dataset.k; c.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b)); drawChain(root); });
    drawChain(root);
  }
  function drawChain(root) {
    const r = RES[state.res];
    root.querySelector('#chain').innerHTML = [
      ['Recurso primario', `${r.ic} ${r.n}`, `Familia: <b style="color:var(--${r.fam})">${FAMILY_LABEL[r.fam]}</b>`],
      ['Fuente o combustible', r.comb, ''],
      ['Proceso de conversión', r.proc, ''],
      ['Tecnología de generación', r.tec.join(' · '), `Ver: ${term(r.key)}`],
      ['Electricidad producida', `${pct(share(r.imp), 1)} de la generación nacional 2023`, `Tecnología: ${r.imp.join(' + ')} ${cite(GEN_NAC.src)}`]
    ].map(([l, v, d]) => `<div class="st"><div class="sl">${l}</div><div class="sv">${v}</div><div class="sd">${d}</div></div>`).join('');
  }

  /* ---------- 0.2 familias ---------- */
  function buildFams(root) {
    const fam = (k, title, items, foot) => `<div class="fam" style="--c:var(--${k})"><h3><i></i>${title}</h3><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>${foot ? `<p class="note">${foot}</p>` : ''}</div>`;
    root.querySelector('#fams').innerHTML =
      fam('fosil', 'Fósiles', [
        `<b>Gas natural</b> → ${term('ciclo-combinado')}, ${term('turbogas', 'turbogás')}, ${term('vapor-convencional', 'vapor convencional')}`,
        `<b>Carbón mineral</b> → ${term('carboelectrica', 'carboeléctrica')}`,
        `<b>Combustóleo</b> → vapor convencional, combustión interna`,
        `<b>Diésel y derivados</b> → ${term('combustion-interna', 'combustión interna')}, turbogás`
      ], 'Liberan CO₂ al quemarse; el carbono estuvo enterrado millones de años.') +
      fam('nuclear', 'Nuclear', [
        `<b>Uranio</b> → ${term('fision', 'fisión nuclear')}`,
        `Calor → vapor → turbina (${term('rankine', 'ciclo Rankine')})`,
        `${term('nucleoelectrica', 'Nucleoeléctrica')}: Laguna Verde, Veracruz`
      ], 'No es renovable: el uranio es un mineral finito. Sí es limpia por ley.') +
      fam('renovable', 'Renovables', [
        `<b>Radiación solar</b> → fotovoltaica (${term('fotovoltaico', 'efecto fotovoltaico')})`,
        `<b>Viento</b> → eólica`, `<b>Agua</b> → hidroeléctrica`,
        `<b>Calor geotérmico</b> → ${term('geotermica', 'geotermoeléctrica')}`, `<b>Biomasa y biogás</b> → bioenergía`
      ], 'Se regeneran de forma natural. Varias dependen del clima.');
  }

  /* ---------- 0.3 clasificador ---------- */
  const CARDS = [
    ['Gas natural', 'Recurso', 'fosil', 'Combustible fósil: metano formado a partir de materia orgánica enterrada.'],
    ['Carbón mineral', 'Recurso', 'fosil', 'Roca combustible de origen fósil.'],
    ['Combustóleo', 'Combustible', 'fosil', 'Derivado pesado del petróleo.'],
    ['Diésel', 'Combustible', 'fosil', 'Destilado del petróleo; se usa en motores de combustión interna y turbinas.'],
    ['Uranio', 'Recurso', 'nuclear', 'Mineral que alimenta la fisión. Es finito, así que no es renovable.'],
    ['Fisión nuclear', 'Proceso', 'nuclear', 'Proceso de conversión, no un recurso: el núcleo de U-235 se divide y libera calor.'],
    ['Radiación solar', 'Recurso', 'renovable', 'Llega todos los días; no se agota a escala humana.'],
    ['Viento', 'Recurso', 'renovable', 'Movimiento de aire causado por el calentamiento desigual de la Tierra.'],
    ['Agua de una presa', 'Recurso', 'renovable', 'El ciclo del agua la renueva, aunque depende de las lluvias.'],
    ['Calor geotérmico', 'Recurso', 'renovable', 'Calor interno de la Tierra; el yacimiento debe manejarse para no agotarlo.'],
    ['Bagazo de caña', 'Combustible', 'renovable', 'Biomasa: residuo agrícola que vuelve a crecer en cada cosecha.'],
    ['Biogás de relleno sanitario', 'Combustible', 'renovable', 'Metano de residuos orgánicos; la ley lo cuenta como bioenergía.'],
    ['Central de ciclo combinado', 'Tecnología', 'fosil', 'En México quema principalmente gas natural (turbina de gas + turbina de vapor).'],
    ['Carboeléctrica', 'Tecnología', 'fosil', 'Caldera de carbón + ciclo Rankine.'],
    ['Laguna Verde', 'Central', 'nuclear', 'Única nucleoeléctrica del país (Veracruz).'],
    ['Aerogenerador', 'Tecnología', 'renovable', 'Convierte la energía cinética del viento en electricidad.'],
    ['Panel fotovoltaico', 'Tecnología', 'renovable', 'Efecto fotovoltaico: de luz a corriente directa.'],
    ['Motor de combustión interna', 'Tecnología', 'fosil', 'Depende del combustible: con diésel, combustóleo o gas natural es fósil; con biogás sería bioenergía renovable.', ['renovable']],
    ['Vapor convencional', 'Tecnología', 'fosil', 'Puede quemar combustóleo, gas natural, diésel o coque; todos son fósiles. La tecnología no define el recurso: el combustible sí.'],
    ['Cogeneración eficiente', 'Tecnología', 'fosil', 'Suele usar gas natural (fósil), pero la ley la cuenta como energía limpia. Es el ejemplo de “limpia” que no es “renovable”.']
  ];
  let placed = {}, selected = null;
  function buildSorter(root) {
    const card = root.querySelector('#sorterCard');
    card.innerHTML = `
      <div class="card-h"><div><h2>Clasifica ${CARDS.length} tarjetas por su recurso primario</h2><p class="sub">Arrastra cada tarjeta a su categoría. Con teclado o en el teléfono: toca o pulsa Enter sobre una tarjeta y después sobre la categoría.</p></div>
      <div class="filters"><button class="btn" id="chk" type="button">Revisar</button><button class="btn ghost" id="rst" type="button">Reiniciar</button></div></div>
      <div class="sorter">
        <div class="pool" id="pool" aria-label="Tarjetas sin clasificar"></div>
        <div class="bins">
          ${['fosil', 'nuclear', 'renovable'].map(k => `<div class="bin" data-bin="${k}" tabindex="0" role="button" aria-label="Categoría ${FAMILY_LABEL[k]}" style="--c:var(--${k})"><h4><i></i>${FAMILY_LABEL[k]}</h4><div class="items"></div></div>`).join('')}
        </div>
        <div class="score" id="score" aria-live="polite"></div>
        <div class="fb" id="fb"></div>
      </div>`;
    const pool = card.querySelector('#pool');
    const mk = (i) => { const [n, k] = CARDS[i]; return `<span class="tcard" draggable="true" tabindex="0" role="button" aria-pressed="false" data-i="${i}">${n}<span class="k">${k}</span></span>`; };
    const draw = () => {
      pool.innerHTML = CARDS.map((c, i) => placed[i] ? '' : mk(i)).join('') || '<span class="note">Todas las tarjetas están clasificadas. Pulsa «Revisar».</span>';
      card.querySelectorAll('.bin').forEach(b => { b.querySelector('.items').innerHTML = Object.entries(placed).filter(([, v]) => v === b.dataset.bin).map(([i]) => mk(+i)).join(''); });
    };
    draw();
    const drop = (i, bin) => { if (bin) placed[i] = bin; else delete placed[i]; selected = null; card.querySelectorAll('.bin').forEach(b => b.classList.remove('target')); draw(); card.querySelector('#score').textContent = ''; card.querySelector('#fb').innerHTML = ''; };
    card.addEventListener('dragstart', e => { const t = e.target.closest('.tcard'); if (t) e.dataTransfer.setData('text/plain', t.dataset.i); });
    card.querySelectorAll('.bin').forEach(b => {
      b.addEventListener('dragover', e => { e.preventDefault(); b.classList.add('over'); });
      b.addEventListener('dragleave', () => b.classList.remove('over'));
      b.addEventListener('drop', e => { e.preventDefault(); b.classList.remove('over'); drop(e.dataTransfer.getData('text/plain'), b.dataset.bin); });
    });
    pool.addEventListener('dragover', e => e.preventDefault());
    pool.addEventListener('drop', e => { e.preventDefault(); drop(e.dataTransfer.getData('text/plain'), null); });
    const act = (e) => {
      const t = e.target.closest('.tcard'); const b = e.target.closest('.bin');
      if (t) { e.stopPropagation(); selected = t.dataset.i; card.querySelectorAll('.tcard').forEach(x => x.setAttribute('aria-pressed', x === t)); card.querySelectorAll('.bin').forEach(x => x.classList.add('target')); return; }
      if (b && selected !== null) drop(selected, b.dataset.bin);
    };
    card.addEventListener('click', act);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { if (e.target.closest('.tcard,.bin')) { e.preventDefault(); act(e); } } });
    card.querySelector('#rst').addEventListener('click', () => { placed = {}; drop(-1, null); });
    card.querySelector('#chk').addEventListener('click', () => {
      let ok = 0, ko = 0, pt = 0; const fb = [];
      CARDS.forEach(([n, , ans, exp, alt], i) => {
        const p = placed[i]; if (!p) return;
        const el = card.querySelector(`.tcard[data-i="${i}"]`);
        if (p === ans) { ok++; el.classList.add('ok'); fb.push(`<div class="ok">✔ <b>${n}</b>: ${exp}</div>`); }
        else if (alt && alt.includes(p)) { pt++; el.classList.add('part'); fb.push(`<div class="part">◐ <b>${n}</b>: ${exp}</div>`); }
        else { ko++; el.classList.add('ko'); fb.push(`<div class="ko">✘ <b>${n}</b> va en <b>${FAMILY_LABEL[ans]}</b>. ${exp}</div>`); }
      });
      const left = CARDS.length - Object.keys(placed).length;
      card.querySelector('#score').innerHTML = `<span class="s-ok">✔ ${ok} aciertos</span><span class="s-ko">✘ ${ko} errores</span><span class="s-pt">◐ ${pt} depende del combustible</span>${left ? `<span class="note">${left} sin clasificar</span>` : ''}`;
      card.querySelector('#fb').innerHTML = fb.join('');
    });
  }

  /* ---------- 0.4 conversión ---------- */
  const CONV = {
    gas: { n: 'Gas natural', st: [
      ['🔥', 'Gas natural', 'Química', 'El metano guarda energía en sus enlaces químicos. Llega a la central por gasoducto.'],
      ['💥', 'Combustión', 'Química → térmica', 'En la cámara de combustión el gas se quema con aire comprimido; los gases alcanzan muy alta temperatura (ciclo Brayton).'],
      ['🌀', 'Turbinas', 'Térmica → mecánica', 'Los gases calientes se expanden en la turbina de gas. En un ciclo combinado, su calor de escape produce vapor para una segunda turbina (ciclo Rankine).'],
      ['⚡', 'Electricidad', 'Mecánica → eléctrica', 'El eje gira un generador síncrono: un campo magnético giratorio induce tensión alterna de 60 Hz en el estator (ley de Faraday).']] },
    carbon: { n: 'Carbón', st: [
      ['⛏️', 'Carbón', 'Química', 'El carbón se muele hasta polvo fino para quemarse de forma eficiente.'],
      ['🔥', 'Combustión', 'Química → térmica', 'En la caldera, la combustión calienta tubos con agua.'],
      ['♨️', 'Vapor', 'Térmica', 'El agua se convierte en vapor a alta presión y temperatura (ciclo Rankine).'],
      ['🌀', 'Turbina', 'Térmica → mecánica', 'El vapor se expande en la turbina y la hace girar; luego se condensa y regresa a la caldera.'],
      ['⚡', 'Electricidad', 'Mecánica → eléctrica', 'El generador acoplado a la turbina produce corriente alterna.']] },
    uranio: { n: 'Uranio', st: [
      ['⚛️', 'Uranio', 'Nuclear', 'Pastillas de uranio enriquecido dentro de barras de combustible.'],
      ['💠', 'Fisión', 'Nuclear → térmica', 'Un neutrón divide un núcleo de U-235; se libera calor y más neutrones. Las barras de control regulan la reacción en cadena.'],
      ['🌡️', 'Calor', 'Térmica', 'El calor del núcleo del reactor se transfiere al agua de enfriamiento.'],
      ['♨️', 'Vapor', 'Térmica', 'En un reactor de agua en ebullición, como los de Laguna Verde, el agua hierve dentro del reactor y forma vapor.'],
      ['⚡', 'Electricidad', 'Mecánica → eléctrica', 'El vapor mueve la turbina y esta el generador; el vapor se condensa y regresa al reactor.']] },
    solar: { n: 'Radiación solar', st: [
      ['☀️', 'Radiación solar', 'Radiante', 'Los fotones llegan a la superficie del panel.'],
      ['🔆', 'Efecto fotovoltaico', 'Radiante → eléctrica', 'En la unión p-n del silicio, los fotones liberan electrones y se produce corriente directa.'],
      ['🔌', 'Inversor', 'CD → CA', 'Electrónica de potencia que convierte la corriente directa en alterna sincronizada con la red.'],
      ['⚡', 'Electricidad', 'Eléctrica', 'Se eleva la tensión con un transformador y se inyecta a la red. Sin turbina ni partes móviles.']] },
    viento: { n: 'Viento', st: [
      ['🌬️', 'Viento', 'Cinética', 'La potencia disponible crece con el cubo de la velocidad del viento.'],
      ['🔄', 'Energía cinética → rotor', 'Cinética → mecánica', 'Las aspas, con perfil aerodinámico, transforman el flujo de aire en par sobre el eje.'],
      ['⚙️', 'Aerogenerador', 'Mecánica → eléctrica', 'Una caja multiplicadora o un generador de imanes permanentes convierte el giro en electricidad; la electrónica ajusta la frecuencia.'],
      ['⚡', 'Electricidad', 'Eléctrica', 'Un transformador eleva la tensión para conectarse a la red.']] },
    agua: { n: 'Agua', st: [
      ['💧', 'Agua', 'Potencial', 'El agua almacenada a cierta altura en la presa tiene energía potencial (mgh).'],
      ['⬇️', 'Energía potencial o cinética', 'Potencial → cinética', 'Al bajar por la tubería de presión el agua gana velocidad.'],
      ['🌀', 'Turbina', 'Cinética → mecánica', 'El chorro o flujo de agua hace girar una turbina (Francis, Kaplan o Pelton).'],
      ['⚡', 'Electricidad', 'Mecánica → eléctrica', 'El generador convierte el giro en corriente alterna. El agua regresa al río.']] }
  };
  function buildConv(root) {
    const tabs = root.querySelector('#convTabs');
    tabs.innerHTML = Object.entries(CONV).map(([k, c]) => `<button type="button" class="chip" data-k="${k}" aria-pressed="${k === state.conv}">${c.n}</button>`).join('');
    tabs.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; state.conv = b.dataset.k; state.stage = 0; tabs.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b)); drawConv(root); });
    root.querySelector('#flow').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; state.stage = +b.dataset.s; drawConv(root); });
    drawConv(root);
  }
  function drawConv(root) {
    const c = CONV[state.conv];
    root.querySelector('#flow').innerHTML = c.st.map(([ic, lb, en], i) => `${i ? '<span class="ar" aria-hidden="true">→</span>' : ''}<button type="button" data-s="${i}" aria-pressed="${i === state.stage}"><span class="ic" aria-hidden="true">${ic}</span><span class="lb">${lb}</span><span class="en">${en}</span></button>`).join('');
    const s = c.st[state.stage];
    root.querySelector('#stageInfo').innerHTML = `<b>Etapa ${state.stage + 1}: ${s[1]}</b> · <span class="note">${s[2]}</span><br>${s[3]}`;
  }

  /* ---------- 0.5 matriz ---------- */
  function dataFor(scope, year) {
    year = +year;
    if (scope === 'nac') {
      const i = GEN_NAC.years.indexOf(year); if (i < 0) return null;
      const tech = Object.fromEntries(Object.entries(GEN_NAC.tech).map(([t, a]) => [t, a[i]]));
      return { tech, total: GEN_NAC.total[i], clean: GEN_NAC.cleanPct[i], src: GEN_NAC.src, kind: 'neta inyectada' };
    }
    const i = GEN_CFE.years.indexOf(year); if (i < 0) return null;
    const tech = Object.fromEntries(Object.entries(GEN_CFE.tech).map(([t, a]) => [t, a[i]]));
    return { tech, total: GEN_CFE.total[i], clean: null, src: GEN_CFE.src, kind: 'bruta' };
  }
  const byFam = (tech) => { const f = { fosil: 0, nuclear: 0, renovable: 0 }; for (const [t, v] of Object.entries(tech)) f[FAMILY[t]] += v; return f; };
  function buildMatrix(root) {
    seg(root.querySelector('#scopeSeg'), [{ v: 'nac', l: 'Nacional (SEN)' }, { v: 'cfe', l: 'Solo CFE' }], state.scope, v => { state.scope = v; drawMatrix(root); });
    seg(root.querySelector('#yearSeg'), [{ v: '2022', l: '2022' }, { v: '2023', l: '2023' }, { v: '2024', l: '2024' }], state.year, v => { state.year = v; drawMatrix(root); });
    drawMatrix(root);
    chart('m0evo', C => {
      const fam = GEN_NAC.years.map((y, i) => byFam(Object.fromEntries(Object.entries(GEN_NAC.tech).map(([t, a]) => [t, a[i]]))));
      return {
        type: 'bar',
        data: { labels: GEN_NAC.years, datasets: [
          barDs({ label: 'Renovable', data: fam.map(f => f.renovable), backgroundColor: C.renovable, stack: 's' }),
          barDs({ label: 'Nuclear', data: fam.map(f => f.nuclear), backgroundColor: C.nuclear, stack: 's', borderRadius: 0 }),
          barDs({ label: 'Fósil', data: fam.map(f => f.fosil), backgroundColor: C.fosil, stack: 's', borderRadius: 0 })
        ] },
        options: {
          scales: { x: noGrid(C, { stacked: true }), y: axis(C, { stacked: true, title: { display: true, text: 'GWh', color: C.ink2 }, ticks: { color: C.ink2, callback: v => fmt(v) } }) },
          plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${fmt(x.raw)} GWh`, footer: it => `Total: ${fmt(GEN_NAC.total[it[0].dataIndex])} GWh · limpia oficial ${pct(GEN_NAC.cleanPct[it[0].dataIndex], 2)}` } } }
        }
      };
    });
  }
  function drawMatrix(root) {
    const d = dataFor(state.scope, state.year);
    const scopeName = state.scope === 'nac' ? 'Nacional (SEN)' : 'CFE';
    root.querySelector('#scopeBadge').innerHTML = state.scope === 'nac' ? '<span class="badge nac">Datos nacionales · CENACE/SENER</span>' : '<span class="badge cfe">Solo CFE · generación bruta</span>';
    root.querySelector('#compBadge').innerHTML = `<span class="badge ${state.scope === 'nac' ? 'nac' : 'cfe'}">${scopeName} ${state.year}</span>`;
    const k = root.querySelector('#matKpis');
    if (!d) {
      const extra = state.scope === 'cfe' && state.year === '2022' ? `Total CFE 2022: ${fmt(GEN_CFE.total2022.v)} GWh, sin desglose por tecnología. ${cite({ s: 'IA22', p: '36' })}` : 'No hay generación nacional por tecnología para 2024 en los documentos disponibles.';
      k.innerHTML = `<div class="kpi" style="grid-column:1/-1"><span class="kl">${scopeName} · ${state.year}</span><span class="kv na">Dato no disponible</span><span class="kd">${extra}</span></div>`;
      ['m0comp', 'm0tech'].forEach(id => { const c = UI.chart(id, () => ({ type: 'bar', data: { labels: [], datasets: [] } })); });
      root.querySelector('#compLegend').innerHTML = '<p class="na">Dato no disponible</p>'; root.querySelector('#techTbl').innerHTML = ''; root.querySelector('#compSrc').innerHTML = '';
      return;
    }
    const f = byFam(d.tech); const T = d.total;
    const top = Object.entries(d.tech).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t).join(', ');
    k.innerHTML = [
      ['Generación ' + d.kind, fmt(T), 'GWh', `${scopeName} ${state.year}`, 'var(--accent)'],
      ['Origen fósil', pct(f.fosil / T * 100), '', 'Incluye cogeneración eficiente', 'var(--fosil)'],
      ['Origen nuclear', pct(f.nuclear / T * 100), '', 'Laguna Verde', 'var(--nuclear)'],
      ['Origen renovable', pct(f.renovable / T * 100), '', 'Hidro, eólica, solar, geo, bio', 'var(--renovable)'],
      ['Limpia (oficial)', d.clean !== null ? pct(d.clean, 2) : (state.year === '2024' ? pct(GEN_CFE.limpia2024.pct, 1) : pct((f.nuclear + f.renovable) / T * 100)), '', d.clean !== null ? 'Criterio legal (incluye cogeneración)' : (state.year === '2024' ? 'CFE, IA 2024 p. 27' : 'Cálculo: renovable + nuclear'), 'var(--mint)'],
      ['Tecnologías principales', '', '', top, 'var(--magenta)']
    ].map(([l, v, u, dd, c]) => `<div class="kpi" style="--k:${c}"><span class="kl">${l}</span>${v ? `<span class="kv">${v}<span class="ku">${u}</span></span>` : ''}<span class="kd">${dd}</span></div>`).join('');
    chart('m0comp', C => ({
      type: 'doughnut',
      data: { labels: ['Fósil', 'Nuclear', 'Renovable'], datasets: [{ data: [f.fosil, f.nuclear, f.renovable], backgroundColor: [C.fosil, C.nuclear, C.renovable], borderColor: C.surface, borderWidth: 2, hoverOffset: 6 }] },
      options: { cutout: '62%', plugins: { tooltip: { callbacks: { label: x => ` ${x.label}: ${fmt(x.raw)} GWh (${pct(x.raw / T * 100)})` } } } }
    }));
    root.querySelector('#compLegend').innerHTML = legendHTML([['var(--fosil)', `Fósil ${pct(f.fosil / T * 100)}`], ['var(--nuclear)', `Nuclear ${pct(f.nuclear / T * 100)}`], ['var(--renovable)', `Renovable ${pct(f.renovable / T * 100)}`]]);
    root.querySelector('#compSrc').innerHTML = cite(d.src);
    const rows = Object.entries(d.tech).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    chart('m0tech', C => ({
      type: 'bar',
      data: { labels: rows.map(r => r[0]), datasets: [barDs({ data: rows.map(r => r[1]), backgroundColor: rows.map(r => C[FAMILY[r[0]]]), borderSkipped: 'start' })] },
      options: { indexAxis: 'y', scales: { x: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'GWh', color: C.ink2 } }), y: noGrid(C) },
        plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} GWh · ${pct(x.raw / T * 100)} · ${FAMILY_LABEL[FAMILY[x.label]]}` } } } }
    }));
    root.querySelector('#techTbl').innerHTML = table(['Tecnología', 'Recurso', 'GWh', '%'], rows.map(([t, v]) => [t, FAMILY_LABEL[FAMILY[t]], v, UI.fmt(v / T * 100, 1)])) + cite(d.src);
  }

  /* ---------- 0.6 comparador ---------- */
  function buildCmp(root) {
    const c = root.querySelector('#cmpChips');
    c.innerHTML = Object.entries(RES).map(([k, r]) => `<button type="button" class="chip" data-k="${k}" aria-pressed="${state.cmp.includes(k)}" style="--c:var(--${r.fam})"><span class="dot"></span>${r.n}</button>`).join('');
    c.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return; const k = b.dataset.k;
      if (state.cmp.includes(k)) { if (state.cmp.length > 2) state.cmp = state.cmp.filter(x => x !== k); }
      else state.cmp = [...state.cmp, k];
      c.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', state.cmp.includes(x.dataset.k)));
      drawCmp(root);
    });
    drawCmp(root);
  }
  function drawCmp(root) {
    const sel = state.cmp.map(k => RES[k]);
    const rowsDef = [
      ['Familia', r => `<span class="tag" style="color:var(--${r.fam})">${FAMILY_LABEL[r.fam]}</span>`],
      ['¿Renovable?', r => r.fam === 'renovable' ? '<span class="tag y">Sí</span>' : '<span class="tag n">No</span>'],
      ['¿Limpia (ley)?', r => r.fam === 'fosil' ? '<span class="tag n">No</span> <span class="note">salvo cogeneración eficiente</span>' : '<span class="tag y">Sí</span>'],
      ['Disponibilidad', r => `<span class="tag ${/Variable/.test(r.ctrl) ? 'm' : 'y'}">${/Variable/.test(r.ctrl) ? 'Variable' : 'Controlable'}</span> <span class="note">${r.ctrl}</span>`],
      ['Combustible', r => r.comb],
      ['Conversión', r => r.proc],
      ['Emisiones de ciclo de vida', r => r.lca ? `<b>${fmt(EMIS_LCA.v[r.lca])}</b> gCO₂e/kWh <span class="note">(${r.lca})</span>` : '<span class="na">Dato no disponible</span>'],
      ['Emisión directa por combustión', r => r.fuel ? `<b>${fmt(EMIS_FUEL.v[r.fuel], 1)}</b> kg CO₂/GJ de combustible` : (r.fam === 'renovable' && r.n.includes('Biomasa') ? '<span class="na">Dato no disponible</span>' : (r.n.includes('geotérmico') ? 'Sin combustión · CO₂ del vapor: <span class="na">Dato no disponible</span>' : 'Sin combustión')) ],
      ['Importancia en la matriz 2023', r => `<b>${pct(share(r.imp))}</b> de la generación nacional <span class="note">(${r.imp.join(' + ')})</span>`]
    ];
    root.querySelector('#cmpTable').innerHTML = `<thead><tr><th scope="col">Criterio</th>${sel.map(r => `<th scope="col">${r.ic} ${r.n}</th>`).join('')}</tr></thead><tbody>${rowsDef.map(([l, f]) => `<tr><th scope="row">${l}</th>${sel.map(r => `<td>${f(r)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    const lca = sel.filter(r => r.lca);
    chart('m0lca', C => ({
      type: 'bar', data: { labels: lca.map(r => r.n), datasets: [barDs({ data: lca.map(r => EMIS_LCA.v[r.lca]), backgroundColor: lca.map(r => C[r.fam]) })] },
      options: { indexAxis: 'y', scales: { x: axis(C, { title: { display: true, text: 'gCO₂e/kWh', color: C.ink2 } }), y: noGrid(C) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} gCO₂e/kWh (mediana IPCC)` } } } }
    }));
    const fu = sel.filter(r => r.fuel);
    chart('m0fuel', C => ({
      type: 'bar', data: { labels: fu.length ? fu.map(r => r.n) : ['Sin combustión en la selección'], datasets: [barDs({ data: fu.map(r => EMIS_FUEL.v[r.fuel]), backgroundColor: C.fosil })] },
      options: { indexAxis: 'y', scales: { x: axis(C, { min: 0, title: { display: true, text: 'kg CO₂ / GJ', color: C.ink2 } }), y: noGrid(C) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw, 1)} kg CO₂/GJ` } } } }
    }));
  }

  /* ---------- 0.7 conciencia ---------- */
  function buildConsc(root) {
    const t23 = GEN_NAC.tech; const i18 = 0;
    const fos = share(['Ciclo combinado', 'Térmica convencional', 'Turbogás', 'Combustión interna', 'Carboeléctrica', 'Cogeneración eficiente']);
    const ren = share(['Hidroeléctrica', 'Geotermoeléctrica', 'Eoloeléctrica', 'Fotovoltaica', 'Bioenergía', 'Híbrido FV-Batería']);
    const nuc = share(['Nucleoeléctrica']);
    const fvx = t23['Fotovoltaica'][i23] / t23['Fotovoltaica'][i18];
    const fu = GEN_CFE.combustibles2024.v; const fosTJ = fu['Gas natural'][1] + fu['Combustóleo'][1] + fu['Carbón'][1] + fu['Diésel'][1];
    const gasPct = fu['Gas natural'][1] / fosTJ * 100;
    const ind = [
      ['Dependencia de combustibles fósiles', pct(fos), 'de la generación nacional 2023 usa gas, carbón, combustóleo o diésel', 'fosil', fos, 'Si el gas natural escaseara, ¿qué parte del sistema se vería afectada primero?', [GEN_NAC.src, { s: 'CALC' }]],
      ['Concentración en un solo combustible', pct(gasPct), 'del combustible fósil que quemó CFE en 2024 fue gas natural (por energía, TJ)', 'fosil', gasPct, '¿Qué riesgos tiene depender de un combustible que en buena parte se transporta por gasoducto?', [GEN_CFE.combustibles2024.src, { s: 'CALC' }]],
      ['Participación de recursos renovables', pct(ren), 'de la generación nacional 2023 (hidro, eólica, solar, geotermia y bioenergía)', 'renovable', ren, '¿Por qué la participación renovable bajó en 2023 si la capacidad solar y eólica creció?', [GEN_NAC.src, { s: 'CALC' }]],
      ['Participación de energía nuclear', pct(nuc), `de la generación nacional 2023 sale de una sola central (Laguna Verde, ${fmt(1608)} MW)`, 'nuclear', nuc, '¿Qué implica que toda la energía nuclear dependa de un solo sitio?', [GEN_NAC.src, CAP_NAC.src]],
      ['Evolución de las tecnologías', '×' + fmt(fvx, 1), `creció la generación fotovoltaica entre 2018 (${fmt(t23['Fotovoltaica'][0])} GWh) y 2023 (${fmt(t23['Fotovoltaica'][i23])} GWh)`, 'renovable', Math.min(100, fvx * 10), '¿Qué cambios necesita la red cuando crece una fuente que solo produce de día?', [GEN_NAC.src]],
      ['Implicación ambiental', fmt(GEN_CFE.co2.v, 1) + ' tCO₂/MWh', 'emisiones promedio del parque de CFE (2022–2024)', 'fosil', 60, 'Si la carboeléctrica emite ~820 gCO₂e/kWh en ciclo de vida y la eólica ~11, ¿qué pasa con las emisiones al sustituir una por otra?', [GEN_CFE.co2.src, EMIS_LCA.src]]
    ];
    root.querySelector('#consc').innerHTML = ind.map(([t, v, d, fam, w, q, s]) => `
      <div class="card c4" style="border-top:4px solid var(--${fam})">
        <h3>${t}</h3>
        <div class="kv" style="font:800 30px/1 Sora,sans-serif;color:var(--${fam})">${v}</div>
        <p class="sub">${d}</p>
        <div aria-hidden="true" style="height:8px;border-radius:99px;background:var(--surface-2);overflow:hidden"><div style="height:100%;width:${Math.max(2, Math.min(100, w))}%;background:var(--${fam});border-radius:99px"></div></div>
        <p class="note">💭 ${q}</p>
        ${cite(s)}
      </div>`).join('');
  }

  /* ---------- 0.8 quiz ---------- */
  function buildQuiz(root) {
    const Yr = GEN_NAC.years; const h = GEN_NAC.tech['Hidroeléctrica'], fv = GEN_NAC.tech['Fotovoltaica'];
    chart('m0q', C => ({
      type: 'bar', data: { labels: Yr, datasets: [barDs({ label: 'Hidroeléctrica', data: h, backgroundColor: C.renovable }), barDs({ label: 'Fotovoltaica', data: fv, backgroundColor: C.coral })] },
      options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) }, title: { display: true, text: 'GWh', color: C.ink2 } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${fmt(x.raw)} GWh` } } } }
    }));
    root.querySelector('#qTbl').innerHTML = table(['Año', 'Hidro GWh', 'Hidro MW', 'FV GWh', 'FV MW'], Yr.map((y, i) => [y, h[i], CAP_NAC.tech['Hidroeléctrica'][i], fv[i], CAP_NAC.tech['Fotovoltaica'][i]]));
    const cfH = 20609 / (12612 * 8.76) * 100, cfE = 20700 / (7055 * 8.76) * 100, cfF = 18147 / (7437 * 8.76) * 100;
    const nonFos = (GEN_NAC.tech['Nucleoeléctrica'][i23] + sum(['Hidroeléctrica', 'Geotermoeléctrica', 'Eoloeléctrica', 'Fotovoltaica', 'Bioenergía', 'Híbrido FV-Batería'].map(t => GEN_NAC.tech[t][i23]))) / tot23 * 100;
    const Q = [
      ['En la gráfica, la generación hidroeléctrica cae de 35,561 GWh (2022) a 20,609 GWh (2023), mientras la capacidad hidroeléctrica se mantiene en unos 12,612 MW (tabla). ¿Qué conclusión es válida?',
        ['Se cerraron varias hidroeléctricas en 2023', 'La capacidad instalada no cambió; cambió cuánto se pudo aprovechar, así que bajó el factor de planta', 'La fotovoltaica sustituyó a la hidroeléctrica en las mismas presas', 'La gráfica tiene un error'], 1,
        `La capacidad (MW) es la potencia máxima; la generación (GWh) depende de cuánto opera la central. Con la misma capacidad, el ${term('factor-planta', 'factor de planta')} hidro de 2023 fue ≈ ${pct(cfH)} (cálculo: 20,609 GWh ÷ (12,612 MW × 8,760 h)). Los documentos no detallan la causa para 2023; depende del agua disponible y del despacho.`],
      ['¿En qué año la fotovoltaica superó por primera vez la mitad de la generación hidroeléctrica?',
        ['2019', '2020', '2021', '2023'], 1,
        `En 2020 la FV generó ${fmt(fv[2])} GWh frente a ${fmt(h[2])} GWh de la hidro (${pct(fv[2] / h[2] * 100)}). En 2019 la proporción era de ${pct(fv[1] / h[1] * 100)}.`],
      ['En 2023, ¿qué tecnología produjo más energía por cada MW instalado?',
        ['Fotovoltaica', 'Eólica', 'Hidroeléctrica', 'Las tres por igual'], 1,
        `Factor de planta calculado: eólica ≈ ${pct(cfE)}, fotovoltaica ≈ ${pct(cfF)}, hidro ≈ ${pct(cfH)}. El sol solo está disponible de día; el viento puede soplar también de noche.`],
      ['Según la matriz 2023, la energía limpia oficial es 23.19 %, pero la suma de renovables y nuclear da un porcentaje menor. ¿Por qué?',
        ['Por errores de redondeo', 'Porque la ley cuenta la cogeneración eficiente como limpia aunque use gas natural', 'Porque la nuclear no cuenta como limpia', 'Porque se excluye la hidroeléctrica'], 1,
        `Renovable + nuclear = ${pct(nonFos, 2)}. La diferencia (≈ ${pct(23.19 - nonFos, 2)}) corresponde a la cogeneración eficiente: ${fmt(GEN_NAC.tech['Cogeneración eficiente'][i23])} GWh. Limpia ≠ renovable ≠ no fósil.`],
      ['Con los valores del comparador (ciclo de vida, mediana IPCC), ¿cuánto CO₂e se evitaría aproximadamente al producir 1 GWh con gas en ciclo combinado en lugar de carbón?',
        ['33 t', '330 t', '3,300 t', '820 t'], 1,
        '(820 − 490) gCO₂e/kWh × 1,000,000 kWh = 330,000,000 g ≈ 330 t de CO₂e. Para bajar más las emisiones habría que usar tecnologías de decenas de gramos por kWh, como la eólica (11) o la nuclear (12).']
    ];
    const qz = root.querySelector('#quiz');
    qz.innerHTML = Q.map(([q, o, a, e], i) => `<div class="q" data-a="${a}"><p class="qt">${i + 1}. ${q}</p><div class="opts">${o.map((t, j) => `<button type="button" data-j="${j}">${t}</button>`).join('')}</div><div class="exp" hidden>${e}</div></div>`).join('') + `<p class="score" id="qscore" aria-live="polite"></p>`;
    qz.addEventListener('click', e => {
      const b = e.target.closest('.opts button'); if (!b) return; const q = b.closest('.q'); if (q.dataset.done) return;
      q.dataset.done = 1; const a = +q.dataset.a; const ok = +b.dataset.j === a;
      b.classList.add(ok ? 'ok' : 'ko'); q.querySelector(`[data-j="${a}"]`).classList.add('ok');
      const ex = q.querySelector('.exp'); ex.hidden = false; ex.insertAdjacentHTML('afterbegin', `<b>${ok ? '✔ Correcto.' : '✘ No exactamente.'}</b> `);
      const done = qz.querySelectorAll('.q[data-done]').length, good = [...qz.querySelectorAll('.q[data-done]')].filter(x => x.querySelector('.ok') && x.querySelector('.ok') === x.querySelector(`[data-j="${x.dataset.a}"]`) && !x.querySelector('.ko')).length;
      qz.querySelector('#qscore').textContent = `Respondidas ${done}/5 · aciertos ${good}`;
    });
  }

  return { render };
})();
