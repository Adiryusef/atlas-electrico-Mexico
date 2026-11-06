# Atlas Eléctrico de México: de los recursos energéticos al consumidor

Aplicación web interactiva para **TE1020 · Análisis de Circuitos Eléctricos** (Tec de Monterrey), con la identidad visual de **Quanta Solar**.

Recorre el sistema eléctrico mexicano en cinco módulos, con mapas, gráficas, simuladores y fuentes oficiales citadas con su página.

| Módulo | Contenido |
|---|---|
| 0 · Recursos energéticos | Cadena recurso → combustible → conversión → tecnología → electricidad; fósil, nuclear o renovable; renovable frente a limpia; clasificador de 20 tarjetas; 6 diagramas de conversión; matriz energética 2018–2024 (nacional y CFE); comparador de recursos; 6 indicadores de conciencia energética; 5 preguntas de reflexión |
| 1 · Generación | Mapa de 25 centrales reales en 15 entidades con 8 tecnologías; filtros por año, ámbito y tecnología; generación anual, participación, variación interanual, fósil frente a limpia, ciclo combinado frente a vapor convencional, capacidad instalada |
| 2 · Transmisión | Mapa del SIN, SIBC, SIBCS y SIMUL con sus centros de control; esquema de enlaces; km por nivel de tensión; transformación (MVA); consumo por sistema; distancias entre regiones; **simulador** I = P/(√3·V·cos φ), P<sub>pérdidas</sub> = 3·I²·R |
| 3 · Distribución | Mapa de divisiones (SAIDI 2023 por división); usuarios, km de RGD, pérdidas y continuidad; consumo residencial frente a industrial; **simulador de transformador ideal** |
| 4 · ¿Sabías que? | 20 hallazgos (5 por tema) con cifra, gráfica y fuente; apartado de la **reforma energética de 2013**: línea de tiempo, cambios estructurales, 5 repercusiones, comparación histórica e interpretaciones |

## Fuentes principales

- CFE, *Informe Anual 2022* e *Informe Anual 2024*; CFE Distribución, *Informe Público Anual 2023*; CFE, *Guía SPA00-63*.
- SENER, *PRODESEN 2023-2037* (cap. 4) y *PRODESEN 2024-2038* (caps. 1–6, anexos 1 y 2).
- DOF: reforma constitucional del 20/12/2013, leyes secundarias del 11/08/2014, reforma constitucional del 31/10/2024 y leyes del 18/03/2025.
- IPCC AR5 WGIII, Anexo III (emisiones de ciclo de vida); CRE, Acuerdo A/058/2017 (municipios por división).
- Geografía: límites municipales CONABIO/INEGI 2022 ([PhantomInsights/mexico-geojson](https://github.com/PhantomInsights/mexico-geojson)); coordenadas de centrales: [WRI Global Power Plant Database](https://github.com/wri/global-power-plant-database).

La pestaña **Fuentes** de la app enumera todos los documentos, las inconsistencias encontradas, los datos no disponibles y los supuestos de cálculo.

## Estructura

```
index.html          página única
css/styles.css      estilos (tokens de Quanta Solar, modo claro y oscuro)
js/data.js          todas las cifras, cada una con documento y página
js/ui.js            citas, tooltips, gráficas y mapas
js/m0.js … m4.js    módulos
js/fuentes.js       fuentes y limitaciones
data/*.json         límites estatales y sistemas eléctricos (GeoJSON simplificado)
vendor/             Chart.js 4.4.1, Leaflet 1.9.4 y fuentes Sora y DM Sans (licencias incluidas)
```

No requiere compilación ni conexión a CDN: todo se sirve desde el repositorio.

## Ver en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar en GitHub Pages

Settings → Pages → *Build and deployment* → *Deploy from a branch* → rama `main`, carpeta `/ (root)` → Save.
