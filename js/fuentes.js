/* Fuentes, limitaciones e inconsistencias */
window.FUENTES = (() => {
  const { fmt } = UI;
  function render(root) {
    root.innerHTML = `
    <div class="mod-head">
      <span class="kicker">Transparencia</span>
      <h1 id="h-fuentes">Fuentes, supuestos y limitaciones</h1>
      <p>Cada cifra del Atlas lleva una etiqueta <span class="src" data-tip="Pasa el cursor o toca una etiqueta como esta para ver el documento completo y la página.">Institución año, p. X</span> con el documento y la página impresa. Las «páginas» de las impresiones web del DOF corresponden a la hoja impresa.</p>
    </div>
    <div class="grid">
      <div class="card c7">
        <h2>Documentos utilizados</h2>
        <div class="srclist">${Object.entries(SOURCES).map(([k, s]) => `<div class="si"><code>${k}</code><div><b>${s.inst}</b> · ${s.doc} (${s.year})${s.note ? `<br><span class="note">${s.note}</span>` : ''}${s.url ? `<br><a href="${s.url}" target="_blank" rel="noopener">${s.url}</a>` : ''}</div></div>`).join('')}</div>
      </div>
      <div class="card c5">
        <h2>Inconsistencias detectadas en las fuentes</h2>
        <ul class="issues">
          <li><b>Generación limpia de CFE (IA 2024, p. 27):</b> el texto dice que 38,983 GWh son «más del 25 % de la generación eléctrica del país»; el 25.3 % es respecto a la generación de CFE (154,059 GWh).</li>
          <li><b>Kilómetros de transmisión 2023:</b> CENACE/PRODESEN reporta 110,846 km; CFE Transmisión, 110,558 km (IA 2024, p. 76).</li>
          <li><b>Generación nacional 2022:</b> el PRODESEN 2023-2037 (p. 59) da 340,713 GWh y 31.2 % limpia; el PRODESEN 2024-2038 (p. 201) da 333,963 GWh y 26.68 %. Usan metodologías distintas (generación distribuida y «otros limpios»).</li>
          <li><b>Redondeo de la Figura 4.9 (PRODESEN 2023-2037):</b> las tecnologías suman 69.0 % fósil y 31.1 % limpio, frente a 68.8 % y 31.2 % en el texto.</li>
          <li><b>Usuarios industriales (IA 2024, pp. 119–120):</b> «Mediana industria: 873 usuarios» y «Gran industria: 452,910» parecen intercambiados; se usa el total industrial.</li>
          <li><b>Kilómetros de distribución:</b> el IA 2024 reporta 901 mil km de RGD (p. 95); el PRODESEN suma 894,206 km de MT y BT en 2023 (p. 157).</li>
          <li><b>Energía limpia de CFE:</b> 36.0 % en 2022 frente a 24.7 % en 2023 (IA 2024, p. 28); los documentos no explican la caída.</li>
          <li><b>SAIDI por división, diciembre de 2023 (CFE Distribución, Anexo V):</b> las columnas del mes de diciembre parecen desalineadas; se usa el Anexo IV (SAIDI sin eventos externos), cuyo valor nacional coincide con el IA 2024.</li>
        </ul>
      </div>
      <div class="card c6">
        <h2>Datos no disponibles</h2>
        <ul class="issues">
          <li>Generación nacional por tecnología de 2024 (los documentos llegan a 2023).</li>
          <li>Generación de CFE por tecnología de 2022 (el Informe Anual 2022 no la consolida).</li>
          <li>Trayectorias geográficas de las líneas de transmisión (no se dibujan).</li>
          <li>Usuarios, kilómetros y pérdidas por división de distribución.</li>
          <li>Emisiones directas por kWh de cada tecnología (solo factores por combustible y el promedio de CFE) y CO₂ del vapor geotérmico.</li>
          <li>Capacidad instalada anterior a 2018 para comparar con la situación previa a la reforma.</li>
        </ul>
      </div>
      <div class="card c6">
        <h2>Supuestos y métodos</h2>
        <ul class="issues">
          <li><b>Clasificación por recurso:</b> fósil = ciclo combinado, térmica convencional, turbogás, combustión interna, carboeléctrica y cogeneración eficiente; nuclear = nucleoeléctrica; renovable = hidro, geotermia, eólica, FV, bioenergía e híbrido FV-batería.</li>
          <li><b>Factor de planta:</b> GWh ÷ (MW × 8.76), con la capacidad al cierre del año.</li>
          <li><b>Hogares abastecidos:</b> generación ÷ consumo medio doméstico de bajo consumo 2024 (${fmt(77811e6 / 43667549)} kWh por usuario).</li>
          <li><b>Mapas:</b> límites INEGI/CONABIO 2022 simplificados; coordenadas de centrales de WRI GPPD (NACEI); sedes de control y centrales sin coordenadas, en el punto interior de su municipio.</li>
          <li><b>Divisiones:</b> cada entidad se asigna a su división principal según la CRE (A/058/2017, Anexo B); las entidades compartidas se marcan.</li>
          <li><b>Simuladores:</b> modelo trifásico balanceado con solo pérdidas resistivas; transformador ideal.</li>
        </ul>
      </div>
    </div>`;
  }
  return { render };
})();
