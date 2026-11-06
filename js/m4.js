/* Módulo 4 · ¿Sabías que? (20 hallazgos) + Reforma energética */
window.M4 = (() => {
  const { fmt, pct, cite, term, chart, axis, noGrid, barDs, legendHTML, table, seg, sum, colors } = UI;
  const N = GEN_NAC, i23 = N.years.indexOf(2023), T23 = N.total[i23];
  const g23 = (t) => N.tech[t][i23];
  const renT = ['Hidroeléctrica', 'Eoloeléctrica', 'Fotovoltaica', 'Geotermoeléctrica', 'Bioenergía', 'Híbrido FV-Batería'];
  const ren23 = sum(renT.map(g23));
  const usoHogar = DIST.sectores.ventas['Doméstico bajo consumo'][5] * 1e6 / DIST.sectores.usuarios['Doméstico bajo consumo'][5]; // kWh/usuario·año 2024
  const fp = (t) => { const ci = CAP_NAC.years.indexOf(2023); return g23(t) / (CAP_NAC.tech[t][ci] * 8.76) * 100; };
  const losses = (V) => M2.calc(300, V, 5, 1).pctLoss;
  const dist = (a, b) => UI.haversine([TX.centros[a].lat, TX.centros[a].lon], [TX.centros[b].lat, TX.centros[b].lon]);

  const H = [
    /* ---------- Recursos ---------- */
    { cat: 'rec', q: '¿Qué porcentaje de la electricidad mexicana se genera con combustibles fósiles?', big: pct(100 - N.cleanPct[i23], 2), u: 'no limpia (2023)',
      txt: `De ${fmt(T23)} GWh inyectados a la red en 2023, el ${pct(N.cleanPct[i23], 2)} fue limpio según la ley. Con criterio de recurso (la cogeneración eficiente cuenta como fósil porque quema gas) el origen fósil sube a ${pct((T23 - ren23 - g23('Nucleoeléctrica')) / T23 * 100)}. Si se suma la generación distribuida solar, el PRODESEN da ${pct(GEN_NAC_2023_TOTAL_GD.fossilPct, 2)} fósil.`,
      src: [N.src, { s: 'CALC' }],
      viz: (id) => chart(id, C => ({ type: 'doughnut', data: { labels: ['Fósil (recurso)', 'Nuclear', 'Renovable'], datasets: [{ data: [T23 - ren23 - g23('Nucleoeléctrica'), g23('Nucleoeléctrica'), ren23], backgroundColor: [C.fosil, C.nuclear, C.renovable], borderColor: C.surface, borderWidth: 2 }] }, options: { cutout: '60%', plugins: { tooltip: { callbacks: { label: x => ` ${x.label}: ${pct(x.raw / T23 * 100)}` } } } } })) },
    { cat: 'rec', q: '¿Cuánto CO₂e emite cada tecnología por kWh?', big: '820 vs 11', u: 'gCO₂e/kWh (carbón vs eólica)',
      txt: `Medianas de ciclo de vida del IPCC: el carbón emite unas 75 veces más que la eólica por kWh. Es distinto de la emisión directa: CFE reporta ${fmt(GEN_CFE.co2.v, 1)} tCO₂/MWh (= ${fmt(GEN_CFE.co2.v * 1000)} g/kWh) para su parque en operación, y la guía CFE SPA00-63 da 56.1 kg CO₂/GJ para gas y 94.6 kg CO₂/GJ para carbón al quemarse.`,
      src: [EMIS_LCA.src, GEN_CFE.co2.src, EMIS_FUEL.src],
      viz: (id) => { const e = Object.entries(EMIS_LCA.v); chart(id, C => ({ type: 'bar', data: { labels: e.map(x => x[0]), datasets: [barDs({ data: e.map(x => x[1]), backgroundColor: e.map(x => /Carbón|Gas/.test(x[0]) ? C.fosil : /Nuclear/.test(x[0]) ? C.nuclear : C.renovable) })] }, options: { indexAxis: 'y', scales: { x: axis(C, { ticks: { color: C.ink2 } }), y: noGrid(C, { ticks: { color: C.ink2, font: { size: 10 } } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${x.raw} gCO₂e/kWh` } } } } })); } },
    { cat: 'rec', q: '¿Por qué la energía nuclear es limpia, pero no renovable?', big: '12', u: 'gCO₂e/kWh en ciclo de vida',
      txt: 'Limpia es una categoría legal por emisiones: la LIE de 2014 y la Ley del Sector Eléctrico de 2025 incluyen la nucleoeléctrica. Renovable depende de que el recurso se regenere, y el uranio es un mineral finito. En 2024 CFE usó 130,343 TJ de uranio.',
      src: [{ s: 'DOF14', p: '45–46' }, { s: 'DOF25', p: '86' }, EMIS_LCA.src, GEN_CFE.combustibles2024.src],
      viz: (id) => { document.getElementById(id).parentElement.outerHTML = `<div class="grid" style="padding:0;gap:6px;grid-template-columns:auto 1fr 1fr;font-size:12px;align-items:stretch">
        <span></span><b style="text-align:center">Renovable</b><b style="text-align:center">No renovable</b>
        <b style="writing-mode:vertical-rl;transform:rotate(180deg);text-align:center">Limpia</b><div class="op" style="border-color:var(--renovable)">Solar, eólica, hidro, geotermia, bioenergía</div><div class="op" style="border-color:var(--nuclear)"><b>Nuclear</b> · cogeneración eficiente</div>
        <b style="writing-mode:vertical-rl;transform:rotate(180deg);text-align:center">No limpia</b><div class="op">—</div><div class="op" style="border-color:var(--fosil)">Carbón, combustóleo, diésel, gas sin cogeneración eficiente</div></div>`; } },
    { cat: 'rec', q: '¿Qué participación tienen el sol, el viento, el agua y la geotermia dentro de la generación renovable?', big: pct(g23('Eoloeléctrica') / ren23 * 100), u: 'eólica, la mayor en 2023',
      txt: `En 2023 la eólica (${fmt(g23('Eoloeléctrica'))} GWh) superó por poco a la hidroeléctrica (${fmt(g23('Hidroeléctrica'))} GWh), un año en que la hidro cayó 42 % respecto a 2022. La solar aportó ${pct(g23('Fotovoltaica') / ren23 * 100)} y la geotermia ${pct(g23('Geotermoeléctrica') / ren23 * 100)} de lo renovable.`,
      src: [N.src, { s: 'CALC' }],
      viz: (id) => chart(id, C => ({ type: 'bar', data: { labels: ['Eólica', 'Hidro', 'Solar FV', 'Geotermia', 'Bio + híbrido'], datasets: [barDs({ data: [g23('Eoloeléctrica'), g23('Hidroeléctrica'), g23('Fotovoltaica'), g23('Geotermoeléctrica'), g23('Bioenergía') + g23('Híbrido FV-Batería')].map(v => +(v / ren23 * 100).toFixed(1)), backgroundColor: C.renovable })] }, options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => v + ' %' } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${pct(x.raw)} de lo renovable` } } } } })) },
    { cat: 'rec', q: '¿Qué recursos dependen del clima y cuáles se pueden controlar?', big: pct(fp('Nucleoeléctrica'), 0) + ' vs ' + pct(fp('Fotovoltaica'), 0), u: 'factor de planta nuclear vs solar (2023)',
      txt: 'El factor de planta (energía generada ÷ energía máxima posible) muestra qué tanto produce cada tecnología. Solar y eólica dependen del sol y del viento (variables). La nuclear, la geotermia y el ciclo combinado pueden despacharse cuando se necesitan (controlables). La hidro depende del agua almacenada.',
      src: [N.src, CAP_NAC.src, { s: 'CALC' }],
      viz: (id) => { const t = [['Nucleoeléctrica', 'c'], ['Ciclo combinado', 'c'], ['Geotermoeléctrica', 'c'], ['Eoloeléctrica', 'v'], ['Fotovoltaica', 'v'], ['Hidroeléctrica', 'h']]; chart(id, C => ({ type: 'bar', data: { labels: t.map(x => x[0]), datasets: [barDs({ data: t.map(x => +fp(x[0]).toFixed(1)), backgroundColor: t.map(x => x[1] === 'v' ? C.coral : x[1] === 'h' ? C.renovable : C.accent) })] }, options: { indexAxis: 'y', scales: { x: axis(C, { max: 100, ticks: { color: C.ink2, callback: v => v + ' %' } }), y: noGrid(C) }, plugins: { tooltip: { callbacks: { label: x => ` Factor de planta ${pct(x.raw)}` } } } } })); },
      legend: [['var(--accent)', 'Controlable'], ['var(--coral)', 'Variable (clima)'], ['var(--renovable)', 'Depende del agua']] },

    /* ---------- Generación ---------- */
    { cat: 'gen', q: '¿Qué tecnología produce más electricidad en México?', big: pct(g23('Ciclo combinado') / T23 * 100), u: 'ciclo combinado (2023)',
      txt: `El ciclo combinado generó ${fmt(g23('Ciclo combinado'))} GWh en 2023, más que todas las demás tecnologías juntas. Entre 2018 y 2023 pasó de ${fmt(N.tech['Ciclo combinado'][0])} a ${fmt(g23('Ciclo combinado'))} GWh.`,
      src: [N.src],
      viz: (id) => { const r = Object.entries(N.tech).map(([t, a]) => [t, a[i23]]).sort((a, b) => b[1] - a[1]).slice(0, 6); chart(id, C => ({ type: 'bar', data: { labels: r.map(x => x[0]), datasets: [barDs({ data: r.map(x => x[1]), backgroundColor: r.map(x => C[FAMILY[x[0]]]) })] }, options: { indexAxis: 'y', scales: { x: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v / 1000) + ' TWh' } }), y: noGrid(C) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} GWh` } } } } })); } },
    { cat: 'gen', q: '¿Cuál es la central eléctrica de mayor capacidad?', big: '2,778', u: 'MW · Petacalco (carbón, Guerrero)',
      txt: 'La C.T. Presidente Plutarco Elías Calles (Petacalco), en La Unión, Guerrero, es la única carboeléctrica de CFE en ese estado. Le sigue la hidroeléctrica Chicoasén, en Chiapas, con 2,400 MW según la base WRI GPPD. Comparación entre las centrales del mapa del Módulo 1.',
      src: [{ s: 'P24', p: '188', t: 'Cuadro A1.8.1' }, { s: 'P24', p: '195', t: 'Cuadro A1.9' }, { s: 'GPPD' }],
      viz: (id) => { const r = [...PLANTS].sort((a, b) => b.mw - a.mw).slice(0, 6); chart(id, C => ({ type: 'bar', data: { labels: r.map(p => p.n.replace(/^(C\.[A-Z.]+\s)/, '').slice(0, 28)), datasets: [barDs({ data: r.map(p => p.mw), backgroundColor: r.map(p => C[FAMILY[p.t === 'Vapor convencional' ? 'Térmica convencional' : p.t]]) })] }, options: { indexAxis: 'y', scales: { x: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) } }), y: noGrid(C, { ticks: { color: C.ink2, font: { size: 10 } } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} MW · ${r[x.dataIndex].t}` } } } } })); } },
    { cat: 'gen', q: '¿Cuánta electricidad produce una central nuclear?', big: '11.98', u: 'TWh netos · Laguna Verde 2024',
      txt: `Con 1,608 MW, Laguna Verde entregó 11.98 TWh en 2024: la U1 6,328.8 GWh y la U2 5,649 GWh. En 2023 la nucleoeléctrica aportó el ${pct(g23('Nucleoeléctrica') / T23 * 100)} de la generación nacional con una sola central.`,
      src: [{ s: 'IA24', p: '63' }, CAP_CFE.src, N.src],
      viz: (id) => chart(id, C => ({ type: 'bar', data: { labels: ['Unidad 1', 'Unidad 2'], datasets: [barDs({ data: [6328.8, 5649], backgroundColor: C.nuclear })] }, options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw, 1)} GWh (2024)` } } } } })) },
    { cat: 'gen', q: '¿Cómo ha evolucionado la generación solar y eólica?', big: '×' + fmt(g23('Fotovoltaica') / N.tech['Fotovoltaica'][0], 1), u: 'solar FV entre 2018 y 2023',
      txt: `La solar pasó de ${fmt(N.tech['Fotovoltaica'][0])} a ${fmt(g23('Fotovoltaica'))} GWh, y la eólica de ${fmt(N.tech['Eoloeléctrica'][0])} a ${fmt(g23('Eoloeléctrica'))} GWh. La capacidad solar creció de ${fmt(CAP_NAC.tech['Fotovoltaica'][0])} a ${fmt(CAP_NAC.tech['Fotovoltaica'][5])} MW.`,
      src: [N.src, CAP_NAC.src],
      viz: (id) => chart(id, C => ({ type: 'line', data: { labels: N.years, datasets: [{ label: 'Solar FV', data: N.tech['Fotovoltaica'], borderColor: C.coral, backgroundColor: C.coral, borderWidth: 2, pointRadius: 3 }, { label: 'Eólica', data: N.tech['Eoloeléctrica'], borderColor: C.renovable, backgroundColor: C.renovable, borderWidth: 2, pointRadius: 3, pointStyle: 'rectRot' }] }, options: { scales: { x: noGrid(C), y: axis(C, { beginAtZero: true, ticks: { color: C.ink2, callback: v => fmt(v) } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${fmt(x.raw)} GWh` } } } } })),
      legend: [['var(--coral)', 'Solar FV'], ['var(--renovable)', 'Eólica']] },
    { cat: 'gen', q: '¿Cuántos hogares podría abastecer, en teoría, una central en un año?', big: fmt(11980e6 / usoHogar / 1e6, 1), u: 'millones de hogares con Laguna Verde',
      txt: `Supuesto: un usuario doméstico de bajo consumo usó en promedio ${fmt(usoHogar)} kWh en 2024 (77,811 GWh ÷ 43,667,549 usuarios). Es un cálculo teórico: ignora pérdidas, horarios y la mezcla real de la red. Elige otra central:`,
      src: [{ s: 'IA24', p: '63' }, DIST.sectores.src, { s: 'CALC' }],
      viz: (id, card) => {
        const ps = PLANTS.filter(p => p.gen);
        const holder = document.getElementById(id).parentElement;
        holder.insertAdjacentHTML('beforebegin', `<select aria-label="Central" style="padding:6px;border-radius:8px;border:1px solid var(--line-2);background:var(--surface)">${ps.map((p, i) => `<option value="${i}">${p.n} (${fmt(p.gen.v, 1)} GWh, ${p.gen.y})</option>`).join('')}</select>`);
        const sel = holder.previousElementSibling;
        const upd = () => { const p = ps[sel.value]; const homes = p.gen.v * 1e6 / usoHogar; card.querySelector('.big').innerHTML = `${fmt(homes / 1e6, 2)}<small>millones de hogares · ${p.n.replace(/^C\.[A-Z.]+\s/, '')}</small>`;
          chart(id, C => ({ type: 'bar', data: { labels: ps.map(q => q.n.replace(/^(C\.[A-Z.]+\s|Nucleoeléctrica\s)/, '').slice(0, 22)), datasets: [barDs({ data: ps.map(q => q.gen.v * 1e6 / usoHogar / 1e6), backgroundColor: ps.map(q => q === p ? C.coral : C.line) })] }, options: { indexAxis: 'y', scales: { x: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v, 1) + ' M' } }), y: noGrid(C, { ticks: { color: C.ink2, font: { size: 10 } } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw, 2)} millones de hogares` } } } } })); };
        sel.addEventListener('change', upd); upd();
      } },

    /* ---------- Transmisión ---------- */
    { cat: 'tx', q: '¿Cuántos kilómetros tiene la red nacional de transmisión?', big: fmt(TX.kmByKv.total[2]), u: 'km (2023)',
      txt: `Equivale a unas ${fmt(TX.kmByKv.total[2] / dist(7, 3))} veces la distancia en línea recta de Mexicali a Mérida (${fmt(dist(7, 3))} km, cálculo propio). El 44 % de la red opera en 115 kV y el 24 % en 400 kV.`,
      src: [TX.kmByKv.src, { s: 'CALC' }],
      viz: (id) => { const kv = Object.entries(TX.kmByKv.kv); chart(id, C => ({ type: 'bar', data: { labels: kv.map(k => k[0]), datasets: [barDs({ data: kv.map(k => k[1][2]), backgroundColor: kv.map(k => ['400 kV', '230 kV', '161 kV'].includes(k[0]) ? C.accent : C.renovable) })] }, options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v / 1000) + ' mil' } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} km` } } } } })); } },
    { cat: 'tx', q: '¿Por qué se usan líneas de 400 kV?', big: '×' + fmt((400 / 115) ** 2, 1), u: 'menos pérdidas a 400 kV que a 115 kV',
      txt: `Para la misma potencia, la corriente es inversamente proporcional a la tensión (I = P / √3·V·cos φ) y las pérdidas crecen con I² (3·I²·R). Subir de 115 a 400 kV reduce la corriente ${fmt(400 / 115, 1)} veces y las pérdidas ${fmt((400 / 115) ** 2, 1)} veces, con la misma resistencia. México tiene ${fmt(TX.kmByKv.kv['400 kV'][2])} km de líneas de 400 kV.`,
      src: [TX.kmByKv.src, { s: 'CALC' }],
      viz: (id) => chart(id, C => ({ type: 'bar', data: { labels: ['115 kV', '230 kV', '400 kV'], datasets: [barDs({ data: [115, 230, 400].map(v => +((400 / v) ** 2).toFixed(2)), backgroundColor: [C.fosil, C.coral, C.renovable] })] }, options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => '×' + v } }) }, plugins: { tooltip: { callbacks: { label: x => ` pérdidas relativas: ×${fmt(x.raw, 2)} respecto a 400 kV` } } } } })) },
    { cat: 'tx', q: '¿Qué sistemas eléctricos no están conectados al SIN?', big: '3', u: 'sistemas en la península de Baja California',
      txt: 'El SIBC se conecta con el oeste de EE. UU. (WECC) por dos líneas de 230 kV, pero no con el SIN. El SIBCS y el de Mulegé están aislados de todos. Juntos consumieron menos del 6 % de la energía del país en 2023.',
      src: [{ s: 'P24', p: '155' }, TX.consumo.src],
      viz: (id) => { const s = ['SIBC', 'SIBCS', 'SIMUL']; chart(id, C => ({ type: 'bar', data: { labels: s, datasets: [barDs({ data: s.map(k => TX.consumo.sys[k][2]), backgroundColor: [C.magenta, C.renovable, C.coral] })] }, options: { scales: { x: noGrid(C), y: axis(C, { type: 'logarithmic', ticks: { color: C.ink2, callback: UI.logTick(v => fmt(v)) } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} GWh (2023)` } } } } })); } },
    { cat: 'tx', q: '¿Qué distancias recorre la electricidad entre regiones?', big: fmt(dist(7, 3)), u: 'km en línea recta Mexicali–Mérida',
      txt: 'Distancias entre las sedes de los centros de control regional (cálculo propio con el haversine). La energía del SIN puede viajar entre regiones por las compuertas de flujo de 400 y 230 kV. Mexicali y Mérida no intercambian energía porque están en sistemas distintos. Explora más pares en el Módulo 2.',
      src: [{ s: 'P24', p: '155, 168–181', t: 'sedes y Cuadro A1.6' }, { s: 'GEO' }, { s: 'CALC' }],
      viz: (id) => { const from = 0; const r = TX.centros.map((c, i) => [c.c, dist(from, i)]).filter((_, i) => i !== from).sort((a, b) => a[1] - b[1]); chart(id, C => ({ type: 'bar', data: { labels: r.map(x => x[0]), datasets: [barDs({ data: r.map(x => x[1]), backgroundColor: C.accent })] }, options: { indexAxis: 'y', scales: { x: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) + ' km' } }), y: noGrid(C, { ticks: { color: C.ink2, font: { size: 10 } } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} km desde Ciudad de México` } } } } })); } },
    { cat: 'tx', q: '¿Cómo cambian las pérdidas eléctricas al aumentar la tensión?', big: fmt(losses(400), 2) + ' %', u: 'pérdidas con 300 MW, 5 Ω/fase y 400 kV',
      txt: `Mueve la tensión para ver el efecto (modelo simplificado del Módulo 2). En el sistema real, las pérdidas totales de energía fueron ${pct(TX.perdidasSEN2023.v)} del consumo neto del SEN en 2023, sumando pérdidas técnicas y no técnicas.`,
      src: [TX.perdidasSEN2023.src, { s: 'CALC' }],
      viz: (id, card) => {
        const holder = document.getElementById(id).parentElement;
        holder.insertAdjacentHTML('beforebegin', '<label class="row" style="display:flex;gap:8px;align-items:center;font-size:13px">Tensión <input type="range" min="69" max="400" step="1" value="400" style="flex:1;accent-color:var(--coral)" aria-label="Tensión en kV"><b class="vv">400 kV</b></label>');
        const r = holder.previousElementSibling.querySelector('input');
        const upd = () => { const V = +r.value; holder.previousElementSibling.querySelector('.vv').textContent = V + ' kV'; card.querySelector('.big').innerHTML = `${fmt(losses(V), 2)} %<small>pérdidas con 300 MW, 5 Ω/fase y ${V} kV</small>`;
          const xs = [69, 85, 115, 138, 161, 230, 400]; chart(id, C => ({ type: 'bar', data: { labels: xs.map(v => v + ' kV'), datasets: [barDs({ data: xs.map(losses), backgroundColor: xs.map(v => v === V ? C.coral : C.line) })] }, options: { animation: false, scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => v + ' %' } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw, 2)} % de P` } } } } })); };
        r.addEventListener('input', upd); upd();
      } },

    /* ---------- Distribución ---------- */
    { cat: 'dist', q: '¿Cuántos usuarios reciben electricidad por las redes de distribución?', big: fmt(DIST.usuarios.v, 1), u: 'millones de usuarios (2024)',
      txt: `CFE registró ${fmt(DIST.clientesSSB.v[5])} clientes de suministro básico al cierre de 2024, unos 4.5 millones más que en 2019. La electrificación alcanzó el ${pct(DIST.electrificacion.v2024, 2)}.`,
      src: [DIST.usuarios.src, DIST.clientesSSB.src, DIST.electrificacion.src],
      viz: (id) => chart(id, C => ({ type: 'line', data: { labels: DIST.clientesSSB.years, datasets: [{ data: DIST.clientesSSB.v.map(v => v / 1e6), borderColor: C.accent, backgroundColor: C.accent, borderWidth: 2, pointRadius: 3 }] }, options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v) + ' M' } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw, 2)} millones` } } } } })) },
    { cat: 'dist', q: '¿Cuántos kilómetros de redes de distribución existen?', big: '901', u: 'mil km (2024)',
      txt: `Es unas 8 veces la red de transmisión. En 2023 había ${fmt(DIST.rgd.mt[2])} km de media tensión y ${fmt(DIST.rgd.bt[2])} km de baja tensión, con ${fmt(DIST.rgd.transf[2])} transformadores de distribución.`,
      src: [DIST.kmRGD.src, DIST.rgd.src],
      viz: (id) => chart(id, C => ({ type: 'bar', data: { labels: ['Transmisión (RNT)', 'Distribución MT', 'Distribución BT'], datasets: [barDs({ data: [TX.kmByKv.total[2], DIST.rgd.mt[2], DIST.rgd.bt[2]], backgroundColor: [C.accent, C.coral, C.renovable] })] }, options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => fmt(v / 1000) + ' mil' } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} km (2023)` } } } } })) },
    { cat: 'dist', q: '¿Qué porcentaje de la energía se pierde en la distribución?', big: pct(DIST.perdidasRGD2023.pct), u: 'de la energía recibida en media tensión (2023)',
      txt: `Se perdieron ${fmt(DIST.perdidasRGD2023.gwh)} GWh en las RGD. Solo ${pct(DIST.perdidasRGD2023.tec, 2)} son pérdidas técnicas (calor por efecto Joule); ${pct(DIST.perdidasRGD2023.notec, 2)} son no técnicas: usos ilícitos y fallas de medición.`,
      src: [DIST.perdidasRGD2023.src],
      viz: (id) => chart(id, C => ({ type: 'bar', data: { labels: ['Pérdidas 2023'], datasets: [barDs({ label: 'Técnicas', data: [DIST.perdidasRGD2023.tec], backgroundColor: C.accent, stack: 'p' }), barDs({ label: 'No técnicas', data: [DIST.perdidasRGD2023.notec], backgroundColor: C.fosil, stack: 'p', borderRadius: 0 })] }, options: { indexAxis: 'y', scales: { x: axis(C, { stacked: true, ticks: { color: C.ink2, callback: v => v + ' %' } }), y: noGrid(C, { stacked: true }) }, plugins: { tooltip: { callbacks: { label: x => ` ${x.dataset.label}: ${pct(x.raw, 2)}` } } } } })),
      legend: [['var(--accent)', 'Técnicas'], ['var(--fosil)', 'No técnicas']] },
    { cat: 'dist', q: '¿Cómo se reduce la tensión antes de llegar a una vivienda?', big: fmt(DIST.rgd.transf[2]), u: 'transformadores de media a baja tensión',
      txt: 'La energía viaja en alta tensión (400 a 69 kV) por la RNT. En subestaciones baja a media tensión (más de 1 kV y menos de 69 kV; las redes operan de 2.4 a 34 kV). Un transformador de poste o pedestal la lleva a baja tensión (1 kV o menos) para la casa. Prueba el simulador del Módulo 3.',
      src: [{ s: 'P24', p: '155, 157' }],
      viz: (id) => { const lv = [['400–230 kV', 'Transmisión', 'var(--accent)'], ['161–69 kV', 'Subtransmisión', 'var(--magenta)'], ['34–2.4 kV', 'Media tensión', 'var(--coral)'], ['≤ 1 kV', 'Baja tensión', 'var(--renovable)']];
        document.getElementById(id).parentElement.outerHTML = `<svg viewBox="0 0 360 170" role="img" aria-label="Escalones de tensión: transmisión, subtransmisión, media y baja tensión" style="width:100%;height:auto">${lv.map(([v, l, c], i) => `<rect x="${4 + i * 89}" y="${8 + i * 32}" width="82" height="${150 - i * 32}" rx="8" fill="${c}" fill-opacity=".2" stroke="${c}"/><text x="${45 + i * 89}" y="${30 + i * 32}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">${v}</text><text x="${45 + i * 89}" y="${47 + i * 32}" text-anchor="middle" font-size="10.5" fill="var(--ink-2)">${l}</text>`).join('')}<text x="${45 + 3 * 89}" y="${150}" text-anchor="middle" font-size="16">🏠</text></svg>`; } },
    { cat: 'dist', q: '¿Qué diferencias hay entre el consumo residencial y el industrial?', big: '×' + fmt(DIST.sectores.ventas.Industrial[5] * 1e6 / DIST.sectores.usuarios.Industrial[5] / usoHogar), u: 'consumo por usuario: industria vs hogar',
      txt: `En 2024, ${fmt(DIST.sectores.usuarios.Industrial[5])} usuarios industriales compraron ${fmt(DIST.sectores.ventas.Industrial[5])} GWh, más que los ${fmt(DIST.sectores.usuarios['Doméstico bajo consumo'][5] / 1e6, 1)} millones de hogares de bajo consumo (${fmt(DIST.sectores.ventas['Doméstico bajo consumo'][5])} GWh).`,
      src: [DIST.sectores.src, { s: 'CALC' }],
      viz: (id) => chart(id, C => ({ type: 'bar', data: { labels: ['Usuarios', 'Ventas (GWh)'], datasets: [barDs({ label: 'Doméstico bajo consumo', data: [DIST.sectores.usuarios['Doméstico bajo consumo'][5] / 49016942 * 100, DIST.sectores.ventas['Doméstico bajo consumo'][5] / 225197 * 100], backgroundColor: C.accent }), barDs({ label: 'Industrial', data: [DIST.sectores.usuarios.Industrial[5] / 49016942 * 100, DIST.sectores.ventas.Industrial[5] / 225197 * 100], backgroundColor: C.fosil })] }, options: { scales: { x: noGrid(C), y: axis(C, { max: 100, ticks: { color: C.ink2, callback: v => v + ' %' } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${x.dataset.label}: ${pct(x.raw)}` } } } } })),
      legend: [['var(--accent)', 'Doméstico bajo consumo'], ['var(--fosil)', 'Industrial']] }
  ];
  const CAT = { rec: ['Recursos energéticos', 'var(--renovable)'], gen: ['Generación', 'var(--coral)'], tx: ['Transmisión', 'var(--accent)'], dist: ['Distribución', 'var(--magenta)'] };

  function render(root) {
    root.innerHTML = `
    <div class="mod-head">
      <span class="kicker">Módulo 4</span>
      <h1 id="h-m4">¿Sabías que?</h1>
      <p>20 hallazgos sobre el sistema eléctrico mexicano, cada uno con su cifra, una visualización y la fuente con página. Al final: la reforma energética de 2013 y sus cambios posteriores.</p>
    </div>
    <div class="grid" style="margin-bottom:16px"><div class="card c12"><div class="filters"><span class="flab">Tema</span><div class="seg" id="h-f"></div><a class="btn ghost" href="#reforma" style="text-decoration:none">Ir a la reforma energética ↓</a></div></div></div>
    <div class="hf" id="h-grid"></div>
    <div id="reforma" style="scroll-margin-top:120px"></div>`;
    const grid = root.querySelector('#h-grid');
    grid.innerHTML = H.map((h, i) => `
      <article class="hcard" data-cat="${h.cat}" style="--hc:${CAT[h.cat][1]}">
        <span class="ht">${CAT[h.cat][0]} · ${String(i + 1).padStart(2, '0')}</span>
        <h3>${h.q}</h3>
        <div class="big">${h.big}<small>${h.u}</small></div>
        <div class="chart sm"><canvas id="h${i}" aria-label="${UI.esc(h.q)}"></canvas></div>
        ${h.legend ? legendHTML(h.legend) : ''}
        <p>${h.txt}</p>
        ${cite(h.src)}
      </article>`).join('');
    H.forEach((h, i) => h.viz('h' + i, grid.children[i]));
    seg(root.querySelector('#h-f'), [{ v: 'all', l: 'Todos (20)' }, { v: 'rec', l: 'Recursos' }, { v: 'gen', l: 'Generación' }, { v: 'tx', l: 'Transmisión' }, { v: 'dist', l: 'Distribución' }], 'all',
      v => grid.querySelectorAll('.hcard').forEach(c => c.hidden = !(v === 'all' || c.dataset.cat === v)));
    reforma(root.querySelector('#reforma'));
  }

  /* ================= Reforma energética ================= */
  let era = 'all', ev = 'dof', vEra = 'r13';
  function reforma(box) {
    const cfeShare = GEN_OWNER_2023.total[0] / sum(GEN_OWNER_2023.total) * 100;
    const precio = DIST.sectores.productosMDP.map((m, i) => m / sum(Object.values(DIST.sectores.ventas).map(a => a[i])));
    box.innerHTML = `
    <div class="mod-head" style="margin-top:36px">
      <span class="kicker">Apartado especial</span>
      <h1>La reforma energética de 2013: ¿cómo cambió el sector eléctrico mexicano?</h1>
      <p>Separamos <b>hechos</b> (lo que dicen las leyes y los decretos), <b>cifras</b> (lo que miden CFE y SENER) e <b>interpretaciones</b> (lo que sostienen distintos actores). Un cambio estadístico ocurrido después de 2013 no prueba que lo haya causado la reforma.</p>
    </div>
    <div class="grid">
      <div class="sec-title"><span class="num">R.1</span><h2>Contexto político y legislativo</h2></div>
      <div class="card c12">
        <div class="filters"><span class="flab">Etapa</span><div class="seg" id="r-era"></div></div>
        <div class="era-legend"><span><i style="background:#8E86A6"></i>Antes de 2013</span><span><i style="background:var(--coral)"></i>Reforma 2013 y leyes 2014</span><span><i style="background:var(--magenta)"></i>Cambios 2021–2022</span><span><i style="background:var(--violet)"></i>Reforma 2024–2025</span></div>
        <div class="tl-bar" id="r-tl" role="group" aria-label="Línea de tiempo"></div>
        <div class="tl-detail" id="r-tld" aria-live="polite"></div>
        <div class="callout"><b>Actores principales:</b> el Ejecutivo federal (iniciativa de Enrique Peña Nieto), el PAN (iniciativa propia en el Senado), los grupos que votaron a favor en la Cámara de Diputados (PRI, PAN, PVEM y Nueva Alianza), la oposición de izquierda (PRD y otros, que tomaron la tribuna) y los congresos estatales que ratificaron la reforma constitucional. ${cite([{ s: 'EXP13' }, { s: 'EXP21' }])}</div>
      </div>

      <div class="sec-title"><span class="num">R.2</span><h2>Cambios estructurales</h2></div>
      <div class="card c12">
        <div class="filters"><span class="flab">Modelo</span><div class="seg" id="r-vm"></div></div>
        <div class="vchain" id="r-vc"></div>
        <div class="legend"><span><i style="--c:var(--violet)"></i>Actividad reservada al Estado</span><span><i style="--c:var(--coral)"></i>Abierta a particulares</span></div>
      </div>

      <div class="sec-title"><span class="num">R.3</span><h2>Cinco repercusiones documentadas</h2></div>
      <div class="card c6">
        <span class="badge">Repercusión 1</span>
        <h2>Participación de CFE y de los privados en la generación</h2>
        <div class="chart sm"><canvas id="r1" aria-label="Generación por propietario 2023"></canvas></div>
        <p class="sub">En 2023, CFE generó el ${pct(cfeShare)} de la energía inyectada a la red; los PIE (privados que venden a CFE) el ${pct(GEN_OWNER_2023.total[1] / sum(GEN_OWNER_2023.total) * 100)} y el resto de los privados el ${pct(GEN_OWNER_2023.total[2] / sum(GEN_OWNER_2023.total) * 100)}. CFE reporta para sí 41.1 %, 41.9 % y 42.3 % en 2022, 2023 y 2024. La Ley del Sector Eléctrico de 2025 fija que el Estado mantenga al menos el 54 %.</p>
        ${cite([GEN_OWNER_2023.src, GEN_CFE.partNac.src, { s: 'DOF25', p: '97' }])}
      </div>
      <div class="card c6">
        <span class="badge">Repercusión 2</span>
        <h2>Evolución de la capacidad instalada</h2>
        <div class="chart sm"><canvas id="r2" aria-label="Capacidad instalada 2018-2023"></canvas></div>
        <p class="sub">La capacidad interconectada pasó de ${fmt(CAP_NAC.total[0])} MW (2018) a ${fmt(CAP_NAC.total[5])} MW (2023), +${pct((CAP_NAC.total[5] / CAP_NAC.total[0] - 1) * 100)}. En 2023 los privados (sin PIE) tenían ${fmt(CAP_OWNER_2023.total[2])} MW. No hay en las fuentes una serie anterior a 2018 para comparar con la situación previa a la reforma: «Dato no disponible».</p>
        ${cite([CAP_NAC.src, CAP_OWNER_2023.src])}
      </div>
      <div class="card c6">
        <span class="badge">Repercusión 3</span>
        <h2>Desarrollo de energías limpias</h2>
        <div class="chart sm"><canvas id="r3" aria-label="Energía limpia en capacidad y generación"></canvas></div>
        ${legendHTML([['var(--renovable)', '% de capacidad limpia'], ['var(--coral)', '% de generación limpia']])}
        <p class="sub">La capacidad limpia subió de 32.82 % a 36.46 %, pero la generación limpia osciló entre 21.6 % y 28.6 % según el año. En 2023, el 61.9 % de la capacidad privada era limpia, contra 33.4 % en CFE. La reforma creó obligaciones de energías limpias y los CEL; en 2024, CFE Generación V obtuvo 252,849 ${term('cel', 'CEL')} de la eólica Sureste I.</p>
        ${cite([CAP_NAC.src, N.src, CAP_OWNER_2023.src, { s: 'DOF13', p: '6' }, { s: 'IA24', p: '49' }])}
      </div>
      <div class="card c6">
        <span class="badge">Repercusión 4</span>
        <h2>Nueva organización del mercado eléctrico</h2>
        <div class="op"><h4>Antes de 2013</h4>CFE integrada: generaba (con PIE y permisionarios), transmitía, distribuía y vendía.</div>
        <div class="op"><h4>2014–2024</h4>${term('cenace', 'CENACE')} independiente opera el ${term('mem', 'Mercado Eléctrico Mayorista')} (desde 2016). CFE se divide en empresas productivas subsidiarias (Generación I–VI, Transmisión, Distribución, Suministrador de Servicios Básicos) y filiales. Los grandes usuarios pueden migrar a suministro calificado: en 2024 lo hicieron 336 clientes, con unos 5.01 TWh de ventas.</div>
        <div class="op"><h4>2025</h4>CFE pasa a empresa pública del Estado; la planeación es vinculante y la Comisión Nacional de Energía regula el sector.</div>
        ${cite([{ s: 'IA24', p: '2–3, 25, 122' }, { s: 'QUAD14' }, { s: 'DOF25', p: '97' }])}
      </div>
      <div class="card c12">
        <span class="badge">Repercusión 5</span>
        <h2>Resultados y controversias: tarifas, confiabilidad, inversión y acceso a la red</h2>
        <div class="grid" style="padding:0">
          <div class="c4" style="min-width:0"><h3>Ingreso medio por kWh (suministro básico)</h3><div class="chart sm"><canvas id="r5a" aria-label="Ingreso medio por kWh"></canvas></div><p class="note">Productos ÷ ventas, en pesos corrientes (sin ajustar por inflación). Es un promedio de todas las tarifas, con y sin subsidio. ${cite([DIST.sectores.src, { s: 'CALC' }])}</p></div>
          <div class="c4" style="min-width:0"><h3>Confiabilidad: SAIDI de distribución</h3><div class="chart sm"><canvas id="r5b" aria-label="SAIDI"></canvas></div><p class="note">Minutos por usuario al año. ${cite(DIST.saidi.src)}</p></div>
          <div class="c4" style="min-width:0"><h3>Inversión y acceso a la red</h3><div class="op">El programa de ampliación y modernización de las RGD prevé <b>34,866.91 millones de pesos</b> en 2024–2028. ${cite({ s: 'P24', p: '140–141' })}</div><div class="op">Acceso a la red: el CENACE debe garantizar acceso abierto y no discriminatorio (decreto de 2013). Las fuentes no traen un indicador de solicitudes de interconexión atendidas: «Dato no disponible». ${cite({ s: 'DOF13', p: '6' })}</div></div>
        </div>
        <div class="callout warn"><b>Controversias documentadas:</b> la reforma de 2021 a la LIE fue impugnada en tribunales; la reforma constitucional de 2022 no alcanzó la mayoría calificada (275 a favor, 223 en contra); y la reforma de 2024 cambió el criterio: la empresa pública debe prevalecer y el servicio debe darse «evitando el lucro». ${cite([{ s: 'SCJN21' }, { s: 'BLM22' }, { s: 'DOF24' }])}</div>
      </div>

      <div class="sec-title"><span class="num">R.4</span><h2>Comparación histórica</h2></div>
      <div class="card c12"><div class="tblwrap"><table class="hist">
        <thead><tr><th></th><th scope="col">Antes de 2013</th><th scope="col">Reforma 2013 y leyes 2014</th><th scope="col">Cambios 2024–2025</th></tr></thead>
        <tbody>
          <tr><th scope="row">Marco legal</th><td>Ley del Servicio Público de Energía Eléctrica (LSPEE)</td><td>Arts. 25, 27 y 28 reformados; Ley de la Industria Eléctrica; Ley de la CFE</td><td>Arts. 25, 27 y 28 reformados (oct. 2024); Ley del Sector Eléctrico; Ley de la Empresa Pública CFE; Ley de Planeación y Transición Energética</td></tr>
          <tr><th scope="row">Naturaleza de CFE</th><td>Organismo descentralizado</td><td>Empresa productiva del Estado, con subsidiarias</td><td>Empresa pública del Estado</td></tr>
          <tr><th scope="row">Generación</th><td>CFE y modalidades privadas (PIE, autoabasto, cogeneración)</td><td>Abierta a la competencia en el MEM</td><td>Participación privada sin prevalencia sobre el Estado; meta de al menos 54 % estatal</td></tr>
          <tr><th scope="row">Transmisión y distribución</th><td>Servicio público del Estado</td><td>Exclusivas de la Nación; el Estado puede contratar con particulares</td><td>Exclusivas de la Nación; sin concesiones</td></tr>
          <tr><th scope="row">Control operativo</th><td>CFE</td><td>CENACE independiente; mercado desde 2016</td><td>CENACE; planeación vinculante a cargo de la SENER</td></tr>
          <tr><th scope="row">Objetivo declarado</th><td>Servicio público</td><td>Abrir la industria a particulares y crear obligaciones de energías limpias</td><td>Seguridad y autosuficiencia energética; electricidad al menor precio posible, «evitando el lucro»</td></tr>
        </tbody></table></div>
        <p class="note">La legislación vigente (2025) difiere de la aprobada en 2013–2014: el decreto de 2024 deroga los transitorios de 2013 que se le opongan.</p>
        ${cite([{ s: 'P24', p: '160' }, { s: 'DOF13', p: '1–7' }, { s: 'DOF14', p: '44–46' }, { s: 'DOF24' }, { s: 'DOF25', p: '86, 97' }])}
      </div>
      <div class="card c12">
        <h2>Objetivos declarados, cambios legales y resultados observados</h2>
        <div class="three">
          <div class="op"><h4>🎯 Objetivos declarados</h4>2013: permitir que los particulares participen en la industria eléctrica, con obligaciones de energías limpias y de reducción de emisiones. 2024: seguridad y autosuficiencia energética, prevalencia de la empresa pública y servicio «evitando el lucro». ${cite([{ s: 'DOF13', p: '1, 6' }, { s: 'DOF24' }])}</div>
          <div class="op"><h4>⚖️ Cambios legales</h4>CENACE independiente (2014), MEM (2016), CFE dividida en subsidiarias, CEL; y en 2025, CFE como empresa pública, planeación vinculante y meta estatal de 54 %. ${cite([{ s: 'QUAD14' }, { s: 'IA24', p: '25' }, { s: 'DOF25', p: '97' }])}</div>
          <div class="op"><h4>📊 Resultados observados</h4>Capacidad +${pct((CAP_NAC.total[5] / CAP_NAC.total[0] - 1) * 100)} (2018–2023); capacidad limpia de 32.8 % a 36.5 %; CFE generó alrededor del 42 % en 2022–2024. Estas cifras coinciden en el tiempo con la reforma, pero no demuestran que ella las causó: influyen también la demanda, los precios del gas, el clima y otras políticas. ${cite([CAP_NAC.src, GEN_CFE.partNac.src])}</div>
        </div>
      </div>
      <div class="card c12">
        <h2>Interpretaciones del proceso</h2>
        <p class="sub">Dos lecturas presentes en los propios documentos oficiales. Se citan como posturas, no como conclusiones del Atlas.</p>
        <div class="three" style="grid-template-columns:1fr 1fr">
          <div class="op"><h4>Lectura de la reforma de 2013</h4>Permitir que los particulares participen en las actividades de la industria eléctrica distintas de la planeación, el control, la transmisión y la distribución; crear un operador independiente (CENACE) que garantice el acceso abierto a las redes; y fijar obligaciones de energías limpias. Sus impulsores la aprobaron con mayorías amplias en ambas cámaras. ${cite([{ s: 'DOF13', p: '1, 6' }, { s: 'EXP21' }])}</div>
          <div class="op"><h4>Lectura de la reforma de 2024–2025</h4>El Estado debe prevalecer en el sector eléctrico, el servicio debe prestarse «evitando el lucro» y la planeación debe ser vinculante. La oposición de 2013 tomó la tribuna, y en 2022 una reforma en esta línea no alcanzó la mayoría calificada. ${cite([{ s: 'DOF24' }, { s: 'DOF25', p: '97' }, { s: 'EXP13' }, { s: 'BLM22' }])}</div>
        </div>
      </div>
    </div>`;

    seg(box.querySelector('#r-era'), [{ v: 'all', l: 'Todas' }, { v: 'pre', l: 'Antes de 2013' }, { v: 'r13', l: '2013–2016' }, { v: 'post', l: '2021–2022' }, { v: 'r24', l: '2024–2025' }], era, v => { era = v; const f = TIMELINE.find(t => era === 'all' || t.era === era); if (f) ev = f.id; drawTL(box); });
    seg(box.querySelector('#r-vm'), [{ v: 'pre', l: 'Antes de 2013' }, { v: 'r13', l: '2014–2024' }, { v: 'r24', l: 'Desde 2025' }], vEra, v => { vEra = v; drawVC(box); });
    box.querySelector('#r-tl').addEventListener('click', e => { const b = e.target.closest('.tl-dot'); if (!b) return; ev = b.dataset.id; drawTL(box); });
    drawTL(box); drawVC(box);

    chart('r1', C => ({ type: 'bar', data: { labels: GEN_OWNER_2023.owners, datasets: [barDs({ data: GEN_OWNER_2023.total.map(v => v / sum(GEN_OWNER_2023.total) * 100), backgroundColor: [C.accent, C.coral, C.renovable, C.ink3] })] },
      options: { scales: { x: noGrid(C), y: axis(C, { max: 60, ticks: { color: C.ink2, callback: v => v + ' %' } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${pct(x.raw)} · ${fmt(GEN_OWNER_2023.total[x.dataIndex])} GWh` } } } },
      plugins: [{ id: 'goal', afterDraw: c => { const y = c.scales.y.getPixelForValue(54); const { left, right } = c.chartArea; const g = c.ctx; g.save(); g.strokeStyle = C.ink; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(left, y); g.lineTo(right, y); g.stroke(); g.setLineDash([]); g.fillStyle = C.ink; g.font = '600 11px DM Sans'; g.fillText('Meta legal 2025 para el Estado: 54 %', left + 6, y - 5); g.restore(); } }] }));
    chart('r2', C => ({ type: 'bar', data: { labels: CAP_NAC.years, datasets: [barDs({ data: CAP_NAC.total, backgroundColor: C.accent })] }, options: { scales: { x: noGrid(C), y: axis(C, { beginAtZero: true, ticks: { color: C.ink2, callback: v => fmt(v) } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw)} MW` } } } } }));
    chart('r3', C => ({ type: 'line', data: { labels: CAP_NAC.years, datasets: [{ label: '% capacidad limpia', data: CAP_NAC.cleanPct, borderColor: C.renovable, backgroundColor: C.renovable, borderWidth: 2, pointRadius: 4 }, { label: '% generación limpia', data: N.cleanPct, borderColor: C.coral, backgroundColor: C.coral, borderWidth: 2, pointRadius: 4, pointStyle: 'rectRot' }] }, options: { scales: { x: noGrid(C), y: axis(C, { min: 0, max: 50, ticks: { color: C.ink2, callback: v => v + ' %' } }) }, plugins: { tooltip: { mode: 'index', intersect: false, callbacks: { label: x => ` ${x.dataset.label}: ${pct(x.raw, 2)}` } } } } }));
    chart('r5a', C => ({ type: 'line', data: { labels: DIST.sectores.years, datasets: [{ data: precio, borderColor: C.fosil, backgroundColor: C.fosil, borderWidth: 2, pointRadius: 4 }] }, options: { scales: { x: noGrid(C), y: axis(C, { ticks: { color: C.ink2, callback: v => '$' + fmt(v, 2) } }) }, plugins: { tooltip: { callbacks: { label: x => ` $${fmt(x.raw, 2)} por kWh (nominal)` } } } } }));
    chart('r5b', C => ({ type: 'bar', data: { labels: DIST.saidi.years, datasets: [barDs({ data: DIST.saidi.v, backgroundColor: C.renovable })] }, options: { scales: { x: noGrid(C), y: axis(C, { beginAtZero: true, ticks: { color: C.ink2 } }) }, plugins: { tooltip: { callbacks: { label: x => ` ${fmt(x.raw, 3)} min` } } } } }));
  }
  function drawTL(box) {
    const items = TIMELINE.filter(t => era === 'all' || t.era === era);
    box.querySelector('#r-tl').innerHTML = items.map(t => `<button type="button" class="tl-dot" data-id="${t.id}" data-era="${t.era}" aria-pressed="${t.id === ev}"><div class="ty">${t.y}</div><div class="tt">${t.t}</div></button>`).join('');
    const t = TIMELINE.find(x => x.id === ev) || items[0];
    box.querySelector('#r-tld').innerHTML = `<span class="ty note">${t.y}</span><h3>${t.t}</h3><p>${t.d}</p>${cite(t.src)}`;
  }
  const VC = {
    pre: [['Planeación', 'Estado (SENER y CFE)', 'state'], ['Generación', 'CFE + PIE, autoabasto y cogeneración (LSPEE)', 'open'], ['Transmisión', 'CFE (servicio público)', 'state'], ['Distribución', 'CFE (servicio público)', 'state'], ['Comercialización', 'CFE', 'state']],
    r13: [['Control y planeación', 'CENACE (control y mercado) · SENER (PRODESEN)', 'state'], ['Generación', 'Competencia: CFE (Generación I–VI), PIE y privados', 'open'], ['Transmisión', 'CFE Transmisión · exclusiva de la Nación', 'state'], ['Distribución', 'CFE Distribución · exclusiva de la Nación', 'state'], ['Comercialización', 'Suministro básico (CFE SSB) y calificado (privados y CFE Calificados)', 'open']],
    r24: [['Control y planeación', 'Planeación vinculante (SENER) · CENACE · CNE regula', 'state'], ['Generación', 'CFE con prevalencia (≥ 54 % de la energía); privados sin prevalencia', 'open'], ['Transmisión', 'Exclusiva de la Nación, sin concesiones', 'state'], ['Distribución', 'Exclusiva de la Nación, sin concesiones', 'state'], ['Comercialización', 'Suministro básico (CFE) y suministro calificado por suministradoras con permiso', 'open']]
  };
  const VCsrc = { pre: [{ s: 'P24', p: '160' }, { s: 'DOF13', p: '6' }], r13: [{ s: 'DOF13', p: '1–2, 6' }, { s: 'IA24', p: '2–3' }, { s: 'QUAD14' }], r24: [{ s: 'DOF24' }, { s: 'DOF25', p: '85–86, 89, 97' }] };
  function drawVC(box) {
    box.querySelector('#r-vc').innerHTML = VC[vEra].map(([a, w, c]) => `<div class="vstep ${c}"><h4>${a}</h4><span class="who">${w}</span></div>`).join('') + `<div style="grid-column:1/-1">${cite(VCsrc[vEra])}</div>`;
  }

  return { render };
})();
