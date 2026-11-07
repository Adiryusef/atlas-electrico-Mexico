/* =========================================================================
   Atlas Eléctrico de México · Datos documentados
   Cada cifra lleva su fuente: s = clave de SOURCES, p = página impresa del documento.
   "cálculo" = operación aritmética hecha por la app a partir de cifras documentadas.
   ========================================================================= */

const SOURCES = {
  IA22:  { short: 'CFE · Informe Anual 2022', inst: 'CFE', doc: 'Informe Anual 2022', year: 2023, note: 'Publicado el 27 de abril de 2023' },
  IA24:  { short: 'CFE · Informe Anual 2024', inst: 'CFE', doc: 'Informe Anual 2024', year: 2025, note: 'Versión del 7 de julio de 2025' },
  P23:   { short: 'SENER · PRODESEN 2023-2037', inst: 'SENER', doc: 'PRODESEN 2023-2037, cap. 4', year: 2023 },
  P24:   { short: 'SENER · PRODESEN 2024-2038', inst: 'SENER', doc: 'PRODESEN 2024-2038', year: 2024 },
  SPA:   { short: 'CFE · Guía SPA00-63 (2016)', inst: 'CFE', doc: 'Guía SPA00-63: factor de emisión de CO₂e del SEN', year: 2016 },
  IPCC:  { short: 'IPCC AR5 (2014)', inst: 'IPCC', doc: 'AR5 WGIII, Anexo III, Tabla A.III.2', year: 2014, url: 'https://www.ipcc.ch/report/ar5/wg3/' },
  DOF13: { short: 'DOF 20/12/2013', inst: 'DOF', doc: 'Decreto de reforma constitucional en materia de energía (20/12/2013)', year: 2013, note: 'Impresión de dof.gob.mx, 7 págs.' },
  DOF14: { short: 'DOF 11/08/2014', inst: 'DOF', doc: 'Edición vespertina del 11/08/2014: Ley de la Industria Eléctrica y Ley de la CFE', year: 2014 },
  DOF24: { short: 'DOF 31/10/2024', inst: 'DOF', doc: 'Decreto de reforma constitucional en materia de áreas y empresas estratégicas (31/10/2024)', year: 2024, url: 'https://gaceta.diputados.gob.mx/PDF/66/2024/oct/DOF31OCT2024-VariosCPEUMAreasEmpresasEstrategicas.pdf' },
  DOF25: { short: 'DOF 18/03/2025', inst: 'DOF', doc: 'Edición vespertina del 18/03/2025: Ley del Sector Eléctrico, Ley de la Empresa Pública CFE, Ley de Planeación y Transición Energética', year: 2025 },
  CRE17: { short: 'CRE · A/058/2017', inst: 'CRE', doc: 'Acuerdo A/058/2017, Anexo B (tablas 16 a 32: municipios por división)', year: 2017 },
  GPPD:  { short: 'WRI GPPD v1.3.0', inst: 'WRI', doc: 'Global Power Plant Database v1.3.0 (datos NACEI / CFE-CENACE 2016)', year: 2021, url: 'https://github.com/wri/global-power-plant-database' },
  GEO:   { short: 'INEGI/CONABIO 2022', inst: 'CONABIO / INEGI', doc: 'Límites municipales 2022 (GeoJSON de PhantomInsights/mexico-geojson)', year: 2022, url: 'https://github.com/PhantomInsights/mexico-geojson' },
  EXP13: { short: 'Expansión (2013)', inst: 'Expansión', doc: '“10 claves de la reforma energética” (12/12/2013)', year: 2013, url: 'https://expansion.mx/economia/2013/12/12/10-claves-de-la-reforma-energetica' },
  EXP21: { short: 'Expansión (2021)', inst: 'Expansión Política', doc: '“Reforma eléctrica de 2013 y 2021: diferencias y similitudes legislativas” (18/10/2021)', year: 2021, url: 'https://politica.expansion.mx/voces/2021/10/18/reforma-electrica-de-2013-y-2021-diferencias-y-similitudes-legislativas' },
  BLM22: { short: 'Bloomberg Línea (2022)', inst: 'Bloomberg Línea', doc: '“Congreso mexicano desecha reforma eléctrica” (18/04/2022)', year: 2022, url: 'https://www.bloomberglinea.com/2022/04/18/congreso-mexicano-desecha-reforma-electrica-de-amlo-por-mayoria/' },
  QUAD14:{ short: 'Quadratín (2014)', inst: 'Quadratín', doc: '“Nacen centros de Control Energético y del Gas Natural” (28/08/2014)', year: 2014, url: 'https://mexico.quadratin.com.mx/Nacen-centros-de-Control-Energetico-y-del-Gas-Natural/' },
  SCJN21:{ short: 'SCJN · Síntesis DOF 09/03/2021', inst: 'SCJN', doc: 'Síntesis del DOF, edición vespertina del 09/03/2021', year: 2021, url: 'https://www.supremacorte.gob.mx/sites/default/files/sintesis_dof_gocdmx/documento/2021-03/DOF%2009032021%20S%C3%8DNTESIS%20VESPERTINA.pdf' },
  SEM26: { short: 'SEMARNAT · Aviso RENE 2026', inst: 'SEMARNAT', doc: 'Aviso a los establecimientos sujetos a reporte en el RENE: factor de emisión del SEN 2024 (29/05/2026)', year: 2026 },
  CEN26: { short: 'CENACE · Generación liquidada sep. 2026', inst: 'CENACE', doc: 'Estadística de la energía generada liquidada (MWh), intermitente y firme, por tipo de tecnología, SEN, septiembre de 2026, liquidación original L0', year: 2026, note: 'Archivo del Sistema de Información del Mercado (área pública), creado el 14/oct/2026; 13 págs.' },
  PAM25: { short: 'CFE Distribución · PAMRGD 2025-2039', inst: 'CFE Distribución', doc: 'Programa de Ampliación y Modernización de las Redes Generales de Distribución que no correspondan al MEM 2025-2039', year: 2025, note: 'Febrero de 2025; datos al cierre de 2024' },
  CALC:  { short: 'Cálculo propio', inst: 'Atlas', doc: 'Cálculo propio a partir de las cifras citadas', year: 2026 }
};

/* CFE Distribución · datos por división (16 divisiones), cierre de 2024 con comparación 2023.
   Fuente: PAMRGD 2025-2039. Infraestructura: Tabla III.1 (pp. 8-9); confiabilidad: Tabla V.1 (p. 21); balance de energía:
   Tabla V.3 (pp. 27-28); pérdidas: Tabla V.5 (p. 30). Unidades: ssMVA y redMVA en MVA; kmMT = km de líneas de media tensión;
   servMiles = miles de servicios; ventasGWh; saidi y caidi en minutos, saifi en interrupciones por usuario;
   ing, ent, per = TWh (energía ingresada, entregada y pérdida total); pt, pnt = porcentaje de pérdidas técnicas y no técnicas. */
const DIV24 = {
  src: { infra: { s: 'PAM25', p: '8–9', t: 'Tabla III.1' }, conf: { s: 'PAM25', p: '21', t: 'Tabla V.1' }, bal: { s: 'PAM25', p: '27–28', t: 'Tabla V.3' }, per: { s: 'PAM25', p: '30', t: 'Tabla V.5' } },
  divs: {
    'Baja California': { ssMVA: 5541, circMT: 747, kmMT: 21731, redMVA: 5191, servMiles: 2081, ventasGWh: 19137, saidi23: 19.77, saidi24: 19.38, saifi23: 0.53, saifi24: 0.53, caidi23: 37.12, caidi24: 36.94, ing23: 16.715, ing24: 17.535, ent23: 15.624, ent24: 16.373, per23: 1.091, per24: 1.162, pt23: 3.82, pt24: 3.72, pnt23: 3.02, pnt24: 3.22 },
    'Noroeste': { ssMVA: 7002, circMT: 1132, kmMT: 42862, redMVA: 6731, servMiles: 2309, ventasGWh: 24155, saidi23: 16.27, saidi24: 15.57, saifi23: 0.39, saifi24: 0.38, caidi23: 41.73, caidi24: 41.25, ing23: 21.462, ing24: 21.913, ent23: 19.28, ent24: 19.78, per23: 2.183, per24: 2.133, pt23: 4.3, pt24: 4.25, pnt23: 6.19, pnt24: 5.8 },
    'Norte': { ssMVA: 7115, circMT: 986, kmMT: 41284, redMVA: 2694, servMiles: 2442, ventasGWh: 25190, saidi23: 16.23, saidi24: 16.11, saifi23: 0.38, saifi24: 0.38, caidi23: 42.3, caidi24: 42.17, ing23: 24.147, ing24: 24.841, ent23: 20.248, ent24: 20.993, per23: 3.899, per24: 3.848, pt23: 3.97, pt24: 3.88, pnt23: 12.49, pnt24: 11.93 },
    'Golfo Norte': { ssMVA: 10628, circMT: 1594, kmMT: 47997, redMVA: 6709, servMiles: 3787, ventasGWh: 45656, saidi23: 17.44, saidi24: 17.18, saifi23: 0.35, saifi24: 0.35, caidi23: 49.76, caidi24: 49.29, ing23: 36.833, ing24: 38.01, ent23: 30.956, ent24: 31.607, per23: 5.877, per24: 6.403, pt23: 3.25, pt24: 3.15, pnt23: 12.99, pnt24: 13.97 },
    'Centro Occidente': { ssMVA: 2376, circMT: 760, kmMT: 33379, redMVA: 2448, servMiles: 2637, ventasGWh: 11468, saidi23: 15.05, saidi24: 13.54, saifi23: 0.3, saifi24: 0.27, caidi23: 50.77, caidi24: 50.2, ing23: 8.09, ing24: 8.082, ent23: 7.445, ent24: 7.469, per23: 0.645, per24: 0.613, pt23: 5.37, pt24: 5.36, pnt23: 2.94, pnt24: 2.57 },
    'Centro Sur': { ssMVA: 3487, circMT: 582, kmMT: 39442, redMVA: 2939, servMiles: 3259, ventasGWh: 9711, saidi23: 16.64, saidi24: 16.3, saifi23: 0.43, saifi24: 0.42, caidi23: 38.84, caidi24: 38.84, ing23: 9.217, ing24: 9.331, ent23: 8.28, ent24: 8.424, per23: 0.937, per24: 0.907, pt23: 6.43, pt24: 6.33, pnt23: 4.08, pnt24: 3.72 },
    'Oriente': { ssMVA: 4094, circMT: 703, kmMT: 45877, redMVA: 2902, servMiles: 3344, ventasGWh: 15025, saidi23: 14.92, saidi24: 16.85, saifi23: 0.21, saifi24: 0.23, caidi23: 70.08, caidi24: 71.97, ing23: 12.361, ing24: 12.993, ent23: 9.9, ent24: 10.367, per23: 2.46, per24: 2.626, pt23: 6.36, pt24: 6.18, pnt23: 13.83, pnt24: 14.33 },
    'Sureste': { ssMVA: 4287, circMT: 820, kmMT: 66654, redMVA: 3952, servMiles: 4145, ventasGWh: 11673, saidi23: 36.33, saidi24: 30.68, saifi23: 0.63, saifi24: 0.55, caidi23: 57.48, caidi24: 55.76, ing23: 14.564, ing24: 15.246, ent23: 12.342, ent24: 13.049, per23: 2.222, per24: 2.197, pt23: 7.99, pt24: 8.16, pnt23: 7.6, pnt24: 6.59 },
    'Valle de México Norte': { ssMVA: 4650, circMT: 513, kmMT: 10540, redMVA: 3408, servMiles: 3141, ventasGWh: 12980, saidi23: 18.17, saidi24: 16.2, saifi23: 0.49, saifi24: 0.5, caidi23: 37.01, caidi24: 32.23, ing23: 14.955, ing24: 15.281, ent23: 12.563, ent24: 12.811, per23: 2.392, per24: 2.47, pt23: 3.84, pt24: 3.82, pnt23: 12.36, pnt24: 12.55 },
    'Valle de México Centro': { ssMVA: 3817, circMT: 439, kmMT: 5809, redMVA: 3580, servMiles: 2244, ventasGWh: 8922, saidi23: 12.32, saidi24: 11.97, saifi23: 0.39, saifi24: 0.37, caidi23: 31.47, caidi24: 32.26, ing23: 10.944, ing24: 11.161, ent23: 9.256, ent24: 9.45, per23: 1.688, per24: 1.712, pt23: 3.8, pt24: 3.74, pnt23: 11.82, pnt24: 11.79 },
    'Valle de México Sur': { ssMVA: 4655, circMT: 469, kmMT: 11859, redMVA: 3791, servMiles: 2949, ventasGWh: 11803, saidi23: 14.18, saidi24: 11.11, saifi23: 0.41, saifi24: 0.34, caidi23: 34.34, caidi24: 32.47, ing23: 14.502, ing24: 14.694, ent23: 12.602, ent24: 12.983, per23: 1.9, per24: 1.711, pt23: 4.28, pt24: 4.24, pnt23: 9.03, pnt24: 7.62 },
    'Bajío': { ssMVA: 6901, circMT: 1185, kmMT: 69403, redMVA: 4855, servMiles: 5013, ventasGWh: 33960, saidi23: 16.63, saidi24: 16.02, saifi23: 0.32, saifi24: 0.31, caidi23: 52.4, caidi24: 51.29, ing23: 26.504, ing24: 26.586, ent23: 23.448, ent24: 23.39, per23: 3.056, per24: 3.196, pt23: 4.98, pt24: 4.81, pnt23: 6.98, pnt24: 7.63 },
    'Golfo Centro': { ssMVA: 3134, circMT: 588, kmMT: 31779, redMVA: 2840, servMiles: 2194, ventasGWh: 14752, saidi23: 23.4, saidi24: 22.42, saifi23: 0.39, saifi24: 0.38, caidi23: 59.57, caidi24: 59.03, ing23: 9.705, ing24: 9.933, ent23: 8.778, ent24: 8.931, per23: 0.927, per24: 1.002, pt23: 5.19, pt24: 5.09, pnt23: 4.7, pnt24: 5.34 },
    'Centro Oriente': { ssMVA: 3919, circMT: 573, kmMT: 28361, redMVA: 2744, servMiles: 3641, ventasGWh: 16322, saidi23: 9.74, saidi24: 8.67, saifi23: 0.25, saifi24: 0.24, caidi23: 38.59, caidi24: 36.19, ing23: 13.31, ing24: 13.51, ent23: 11.876, ent24: 12.077, per23: 1.434, per24: 1.433, pt23: 4.79, pt24: 4.76, pnt23: 6.27, pnt24: 6.12 },
    'Peninsular': { ssMVA: 4574, circMT: 690, kmMT: 22080, redMVA: 2616, servMiles: 2266, ventasGWh: 14765, saidi23: 14.32, saidi24: 14.3, saifi23: 0.39, saifi24: 0.41, caidi23: 36.41, caidi24: 35.09, ing23: 14.94, ing24: 15.673, ent23: 13.651, ent24: 14.196, per23: 1.289, per24: 1.477, pt23: 3.94, pt24: 3.79, pnt23: 5.02, pnt24: 5.96 },
    'Jalisco': { ssMVA: 5104, circMT: 779, kmMT: 36278, redMVA: 3512, servMiles: 3649, ventasGWh: 18219, saidi23: 17.89, saidi24: 17.3, saifi23: 0.41, saifi24: 0.4, caidi23: 43.59, caidi24: 43.28, ing23: 17.47, ing24: 17.894, ent23: 15.523, ent24: 15.92, per23: 1.947, per24: 1.974, pt23: 4.64, pt24: 4.75, pnt23: 6.76, pnt24: 6.54 }
  },
  nac: { ssMVA: 81285, circMT: 12560, kmMT: 555336, redMVA: 60912, servMiles: 49101, ventasGWh: 293736, saidi23: 17.79, saidi24: 16.71, saifi23: 0.39, saifi24: 0.38, caidi23: 45.55, caidi24: 44.51, ing23: 263.551, ing24: 270.485, ent23: 229.604, ent24: 235.623, per23: 33.947, per24: 34.863, pt23: 4.62, pt24: 4.55, pnt23: 8.57, pnt24: 8.64 }
};

/* Factor de emisión del Sistema Eléctrico Nacional 2024 (el de 2025 sigue en elaboración por SENER). */
/* Inversiones de las RGD 2025-2029 (MDP). PAMRGD 2025-2039, Tabla VI.1 (p. 37). Total = 4,319 + 8,869 + 8,611 + 8,434 + 7,829. */
const PAM_INV = { src: { s: 'PAM25', p: '37', t: 'Tabla VI.1' }, years: [2025, 2026, 2027, 2028, 2029], anual: [4319, 8869, 8611, 8434, 7829], total: 38062, amp: 24828, mod: 5308, rei: 6085, gd: 1841 };
const FE_SEN = { v: 0.444, u: 'tCO₂e/MWh', year: 2024, src: { s: 'SEM26', p: '1' } };

/* Generación liquidada por CENACE, septiembre de 2026 (archivo data/gen-sep2026.json: 30 días × 24 h × 11 tecnologías). */
const GEN_SEP26 = { src: { s: 'CEN26', p: '1–13' }, file: 'data/gen-sep2026.json' };

/* Clasificación del recurso primario por tecnología (fósil / nuclear / renovable) */
const FAMILY = {
  'Ciclo combinado': 'fosil', 'Térmica convencional': 'fosil', 'Vapor convencional': 'fosil',
  'Turbogás': 'fosil', 'Combustión interna': 'fosil', 'Carboeléctrica': 'fosil', 'Diésel': 'fosil',
  'Turbojet': 'fosil', 'Cogeneración eficiente': 'fosil',
  'Nucleoeléctrica': 'nuclear',
  'Hidroeléctrica': 'renovable', 'Geotermoeléctrica': 'renovable', 'Eoloeléctrica': 'renovable',
  'Fotovoltaica': 'renovable', 'Bioenergía': 'renovable', 'Híbrido FV-Batería': 'renovable'
};
const FAMILY_LABEL = { fosil: 'Fósil', nuclear: 'Nuclear', renovable: 'Renovable' };

/* ---------- Generación nacional neta inyectada a la red (GWh) ----------
   PRODESEN 2024-2038, Anexo 1, Cuadro A1.11, p. 201 */
const GEN_NAC = {
  src: { s: 'P24', p: '201', t: 'Cuadro A1.11' },
  years: [2018, 2019, 2020, 2021, 2022, 2023],
  tech: {
    'Hidroeléctrica':        [32234, 23602, 26817, 34717, 35561, 20609],
    'Geotermoeléctrica':     [5065, 5061, 4575, 4243, 4412, 4161],
    'Eoloeléctrica':         [12435, 16727, 19703, 21075, 20314, 20700],
    'Fotovoltaica':          [2176, 8394, 13528, 17069, 16278, 18147],
    'Bioenergía':            [600, 669, 600, 582, 617, 499],
    'Híbrido FV-Batería':    [0, 0, 0, 0, 12, 63],
    'Nucleoeléctrica':       [13200, 10881, 10864, 11606, 10539, 12043],
    'Cogeneración eficiente':[2310, 3259, 4188, 3349, 1376, 4136],
    'Ciclo combinado':       [163877, 175506, 185638, 186715, 198355, 205598],
    'Térmica convencional':  [39345, 38020, 22405, 22196, 20001, 30358],
    'Turbogás':              [9508, 10904, 8664, 11150, 10471, 12336],
    'Combustión interna':    [2589, 3187, 2841, 2121, 1834, 3621],
    'Carboeléctrica':        [27347, 21611, 12525, 8704, 14194, 14230]
  },
  total: [310685, 317820, 312348, 323526, 333963, 346504],
  cleanPct: [21.89, 21.58, 25.70, 28.63, 26.68, 23.19],
  note: 'La legislación cuenta la cogeneración eficiente como energía limpia aunque usa combustible fósil; por eso el % “limpio” oficial difiere del % no fósil.'
};

/* Generación 2023 por propietario (GWh). PRODESEN 2024-2038, Cuadro A1.12, p. 202 */
const GEN_OWNER_2023 = {
  src: { s: 'P24', p: '202', t: 'Cuadro A1.12' },
  owners: ['CFE', 'PIE', 'Privados', 'Pemex'],
  total: [145216, 102861, 95977, 2450],
  clean: [35862, 1832, 41454, 1211]
};

/* PRODESEN 2023-2037 (metodología distinta) para 2022 */
const GEN_NAC_2022_P23 = { total: 340713, cleanPct: 31.2, fossilPct: 68.8, src: { s: 'P23', p: '59', t: 'Figura 4.9' },
  note: 'Incluye generación distribuida y “otros limpios” según el Acuerdo A/018/2023 de la CRE; por eso no coincide con el Cuadro A1.11 del PRODESEN 2024-2038.' };
const GEN_NAC_2023_TOTAL_GD = { total: 351695, gd: 5191, cleanPct: 24.32, fossilPct: 75.68, src: { s: 'P24', p: '201' } };

/* ---------- Generación bruta de CFE por tecnología (GWh). IA 2024, p. 26 ---------- */
const GEN_CFE = {
  src: { s: 'IA24', p: '26', t: 'Generación Bruta Anual por Tecnología' },
  years: [2023, 2024],
  tech: {
    'Ciclo combinado': [58234, 61490], 'Diésel': [2657, 2851], 'Turbogás': [8168, 8379],
    'Vapor convencional': [29336, 28135], 'Turbojet': [124, 209], 'Carboeléctrica': [15307, 14012],
    'Geotermoeléctrica': [4321, 3692], 'Nucleoeléctrica': [12386, 12307], 'Hidroeléctrica': [19568, 22354],
    'Eoloeléctrica': [86, 75], 'Fotovoltaica': [274, 555]
  },
  total: [150462, 154059],
  total2022: { v: 139831, s: 'IA22', p: '36', note: 'Generación 2022 de CFE; el informe 2022 no trae tabla consolidada por tecnología.' },
  neta: { years: [2022, 2023, 2024], v: [137133.0, 145172.1, 148775.4], src: { s: 'IA24', p: '28' } },
  partNac: { years: [2022, 2023, 2024], v: [41.1, 41.9, 42.3], src: { s: 'IA24', p: '28' } },
  limpiaNeta: { years: [2022, 2023, 2024], v: [36.0, 24.7, 25.9], src: { s: 'IA24', p: '28' } },
  co2: { v: 0.6, u: 'tCO₂/MWh', src: { s: 'IA24', p: '28' } },
  factorPlanta: { years: [2022, 2023, 2024], v: [36.6, 38.5, 38.5], src: { s: 'IA24', p: '28' } },
  eficTermica: { years: [2022, 2023, 2024], v: [34.6, 34.4, 34.5], src: { s: 'IA24', p: '28' } },
  limpia2024: { v: 38982.9, pct: 25.3, src: { s: 'IA24', p: '27' } },
  combustibles2024: { src: { s: 'IA24', p: '26' }, u: 'TJ',
    v: { 'Gas natural': [770020, 782478], 'Combustóleo': [162313, 132950], 'Uranio': [130118, 130343], 'Carbón': [107582, 128665], 'Vapor geotérmico': [97659, 85253], 'Diésel': [40068, 39956] } }
};

/* ---------- Capacidad instalada nacional (MW). PRODESEN 2024-2038, Cuadro A1.7, p. 186 ---------- */
const CAP_NAC = {
  src: { s: 'P24', p: '186', t: 'Cuadro A1.7' },
  years: [2018, 2019, 2020, 2021, 2022, 2023],
  tech: {
    'Hidroeléctrica': [12612, 12612, 12612, 12614, 12613, 12612],
    'Geotermoeléctrica': [899, 899, 951, 976, 976, 976],
    'Eoloeléctrica': [4866, 6050, 6504, 6977, 6921, 7055],
    'Fotovoltaica': [1878, 3646, 5149, 5955, 6515, 7437],
    'Bioenergía': [375, 375, 378, 378, 408, 407],
    'Híbrido FV-Batería': [0, 0, 0, 0, 20, 32],
    'Nucleoeléctrica': [1608, 1608, 1608, 1608, 1608, 1608],
    'Cogeneración eficiente': [1709, 1710, 2305, 2305, 2308, 2322],
    'Ciclo combinado': [27393, 30402, 31948, 33640, 34413, 35178],
    'Térmica convencional': [12315, 11831, 11809, 11793, 11343, 11300],
    'Turbogás': [2960, 2960, 3545, 3744, 3815, 3888],
    'Combustión interna': [880, 891, 850, 701, 728, 729],
    'Carboeléctrica': [5463, 5463, 5463, 5463, 5463, 5463]
  },
  total: [72958, 78447, 83121, 86153, 87130, 89008],
  cleanPct: [32.82, 34.29, 35.5, 35.76, 36, 36.46]
};
/* Capacidad 2023 por propietario (MW). Cuadro A1.8, p. 187 */
const CAP_OWNER_2023 = { src: { s: 'P24', p: '187', t: 'Cuadro A1.8' }, owners: ['CFE', 'PIE', 'Privados', 'Pemex'], total: [44680, 16664, 26744, 921], clean: [14916, 613, 16553, 367] };
/* Capacidad efectiva CFE + PIE (MW). IA 2024, p. 21 */
const CAP_CFE = { src: { s: 'IA24', p: '21' }, cfe: [44846.2, 45116.7], pie: [16603.4, 16603.4], total: [61449.6, 61720.1], years: [2023, 2024] };

/* ---------- Centrales (mapa) ----------
   Coordenadas: WRI GPPD v1.3.0 (fuente NACEI, CFE-CENACE) o punto interior municipal INEGI/CONABIO (marcado como aprox.).
   Nombre, entidad, municipio y tecnología: PRODESEN 2024-2038, Cuadro A1.9 (pp. 195-198) cuando aplica. */
const PLANTS = [
  { n: 'Nucleoeléctrica Laguna Verde', e: 'Veracruz', m: 'Alto Lucero de Gutiérrez Barrios', t: 'Nucleoeléctrica', mw: 1608, mwSrc: { s: 'IA24', p: '21' }, lat: 19.7208, lon: -96.4064, geo: 'GPPD', own: 'CFE', gen: { y: 2024, v: 11980, k: 'neta', src: { s: 'IA24', p: '63' } }, a19: 9 },
  { n: 'C.T. Pdte. Plutarco Elías Calles (Petacalco)', e: 'Guerrero', m: 'La Unión de Isidoro Montes de Oca', t: 'Carboeléctrica', mw: 2778, mwSrc: { s: 'P24', p: '188', t: 'Cuadro A1.8.1: única carboeléctrica de CFE en Guerrero' }, lat: 17.9837, lon: -102.1154, geo: 'GPPD', own: 'CFE', a19: 1 },
  { n: 'C.T. Carbón II', e: 'Coahuila', m: 'Nava', t: 'Carboeléctrica', mw: 1400, mwSrc: { s: 'GPPD', p: 'MEX0001768 (dato 2016)' }, lat: 28.4682, lon: -100.7003, geo: 'GPPD', own: 'CFE', a19: 48 },
  { n: 'C.T. José López Portillo (Río Escondido)', e: 'Coahuila', m: 'Nava', t: 'Carboeléctrica', mw: 1200, mwSrc: { s: 'GPPD', p: 'MEX0001771 (dato 2016)' }, lat: 28.4844, lon: -100.6897, geo: 'GPPD', own: 'CFE', a19: 49 },
  { n: 'C.H. Manuel Moreno Torres (Chicoasén)', e: 'Chiapas', m: 'Chicoasén', t: 'Hidroeléctrica', mw: 2400, mwSrc: { s: 'GPPD', p: 'MEX0001853 (dato 2016)' }, lat: 16.9428, lon: -93.1012, geo: 'GPPD', own: 'CFE', gen: { y: 2024, v: 3337.8, k: 'neta', src: { s: 'IA24', p: '60' } }, a19: 7 },
  { n: 'C.H. Malpaso', e: 'Chiapas', m: 'Tecpatán', t: 'Hidroeléctrica', mw: 1080, mwSrc: { s: 'IA24', p: '24' }, lat: 17.1806, lon: -93.5973, geo: 'GPPD', own: 'CFE', gen: { y: 2024, v: 2182.5, k: 'neta', src: { s: 'IA24', p: '60' } }, a19: 10 },
  { n: 'C.H. Belisario Domínguez (Angostura)', e: 'Chiapas', m: 'Venustiano Carranza', t: 'Hidroeléctrica', mw: 900, mwSrc: { s: 'IA24', p: '24' }, lat: 16.4018, lon: -92.7784, geo: 'GPPD', own: 'CFE', gen: { y: 2024, v: 1315.1, k: 'neta', src: { s: 'IA24', p: '60' } }, a19: 12 },
  { n: 'C.H. Infiernillo', e: 'Michoacán', m: 'Arteaga', t: 'Hidroeléctrica', mw: 1200, mwSrc: { s: 'IA24', p: '24' }, lat: 18.2711, lon: -101.8939, geo: 'GPPD', own: 'CFE', gen: { y: 2024, v: 2902.7, k: 'neta', src: { s: 'IA24', p: '32' } }, a19: 4 },
  { n: 'C.H. Aguamilpa Solidaridad', e: 'Nayarit', m: 'El Nayar', t: 'Hidroeléctrica', mw: 960, mwSrc: { s: 'GPPD', p: 'MEX0001856 (dato 2016)' }, lat: 21.8395, lon: -104.8038, geo: 'GPPD', own: 'CFE', gen: { y: 2024, v: 1191.2, k: 'neta', src: { s: 'IA24', p: '37' } }, a19: 23 },
  { n: 'C.H. Alfredo Elías Ayub (La Yesca)', e: 'Jalisco', m: 'Hostotipaquillo', t: 'Hidroeléctrica', mw: 750, mwSrc: { s: 'GPPD', p: 'MEX0001859 (dato 2016)' }, lat: 21.1979, lon: -104.1047, geo: 'GPPD', own: 'CFE', gen: { y: 2024, v: 811.5, k: 'neta', src: { s: 'IA24', p: '37' } }, a19: 25 },
  { n: 'C.T. Pdte. Adolfo López Mateos (Tuxpan)', e: 'Veracruz', m: 'Tuxpan', t: 'Vapor convencional', mw: 2100, mwSrc: { s: 'GPPD', p: 'MEX0001766 (dato 2016)' }, lat: 21.0151, lon: -97.3334, geo: 'GPPD', own: 'CFE', a19: 8 },
  { n: 'C.T. Francisco Pérez Ríos (Tula)', e: 'Hidalgo', m: 'Tula de Allende', t: 'Vapor convencional', mw: 1605.6, mwSrc: { s: 'GPPD', p: 'MEX0001767 (dato 2016)' }, lat: 20.0545, lon: -99.2764, geo: 'GPPD', own: 'CFE', a19: 2 },
  { n: 'C.C.C. Manzanillo (Gral. Manuel Álvarez Moreno)', e: 'Colima', m: 'Manzanillo', t: 'Ciclo combinado', mw: 1454, mwSrc: { s: 'P24', p: '188', t: 'Cuadro A1.8.1: ciclo combinado de CFE en Colima' }, lat: 19.0278, lon: -104.3192, geo: 'GPPD', own: 'CFE', a19: 20 },
  { n: 'Altamira V', e: 'Tamaulipas', m: 'Altamira', t: 'Ciclo combinado', mw: 1121, mwSrc: { s: 'IA24', p: '51' }, lat: 22.4997, lon: -97.9053, geo: 'GPPD', own: 'PIE', a19: 51 },
  { n: 'Altamira III y IV', e: 'Tamaulipas', m: 'Altamira', t: 'Ciclo combinado', mw: 1036, mwSrc: { s: 'IA24', p: '51' }, lat: 22.4939, lon: -97.9014, geo: 'GPPD', own: 'PIE', a19: 52 },
  { n: 'Tuxpan III y IV', e: 'Veracruz', m: 'Tuxpan', t: 'Ciclo combinado', mw: 983, mwSrc: { s: 'IA24', p: '51' }, lat: 20.8386, lon: -97.2536, geo: 'GPPD', own: 'PIE', a19: 11 },
  { n: 'Iberdrola Energía Tamazunchale', e: 'San Luis Potosí', m: 'Tamazunchale', t: 'Ciclo combinado', mw: 1135, mwSrc: { s: 'P24', p: '189', t: 'Cuadro A1.8.2: PIE en San Luis Potosí' }, lat: 21.3113, lon: -98.7565, geo: 'GPPD', own: 'PIE', a19: 50 },
  { n: 'Valladolid III', e: 'Yucatán', m: 'Valladolid', t: 'Ciclo combinado', mw: 525, mwSrc: { s: 'IA24', p: '51' }, lat: 20.6931, lon: -88.2675, geo: 'GPPD', own: 'PIE', a19: 70 },
  { n: 'AES Mérida III', e: 'Yucatán', m: 'Mérida', t: 'Ciclo combinado', mw: 484, mwSrc: { s: 'IA24', p: '51' }, lat: 20.9336, lon: -89.6992, geo: 'GPPD', own: 'PIE', a19: 71 },
  { n: 'C.G. Cerro Prieto', e: 'Baja California', m: 'Mexicali', t: 'Geotermoeléctrica', mw: 570, mwSrc: { s: 'P24', p: '188', t: 'Cuadro A1.8.1: geotermia de CFE en Baja California' }, lat: 32.3916, lon: -115.2252, geo: 'GPPD', own: 'CFE', gen: { y: 2024, v: 1801.3, k: 'neta', src: { s: 'IA24', p: '41' } }, a19: 65 },
  { n: 'C.G. Los Azufres', e: 'Michoacán', m: null, t: 'Geotermoeléctrica', mw: 275, mwSrc: { s: 'P24', p: '188', t: 'Cuadro A1.8.1: geotermia de CFE en Michoacán' }, lat: 19.7910, lon: -100.6669, geo: 'GPPD', own: 'CFE', gen: { y: 2024, v: 1393.2, k: 'neta', src: { s: 'IA24', p: '37' } } },
  { n: 'C.E. La Venta', e: 'Oaxaca', m: null, t: 'Eoloeléctrica', mw: 84, mwSrc: { s: 'P24', p: '188', t: 'Cuadro A1.8.1: eólica de CFE en Oaxaca' }, lat: 16.5803, lon: -94.8237, geo: 'GPPD', own: 'CFE', gen: { y: 2024, v: 73.8, k: 'neta', src: { s: 'IA24', p: '60' } } },
  { n: 'Eólica Eurus', e: 'Oaxaca', m: null, t: 'Eoloeléctrica', mw: 250.5, mwSrc: { s: 'GPPD', p: 'MEX0001866 (dato 2016)' }, lat: 16.4853, lon: -94.9484, geo: 'GPPD', own: 'Privado' },
  { n: 'Fotovoltaica Villanueva (I, III y IV)', e: 'Coahuila', m: null, t: 'Fotovoltaica', mw: 654, mwSrc: { s: 'GPPD', p: 'WKS0067953 + WKS0067954 + WKS0071833' }, lat: 25.586, lon: -103.056, geo: 'GPPD', own: 'Privado' },
  { n: 'C.FV. Puerto Peñasco (Secuencias I y II)', e: 'Sonora', m: 'Puerto Peñasco', t: 'Fotovoltaica', mw: 420, mwSrc: { s: 'P24', p: '160', t: '120 MW (Sec. I); +300 MW (Sec. II) según IA 2024, p. 22' }, lat: 31.5411, lon: -113.3463, geo: 'MUN', own: 'CFE', gen: { y: 2024, v: 406.6, k: 'neta', src: { s: 'IA24', p: '41' } } }
];

/* ---------- Transmisión ---------- */
const TX = {
  /* Ampliación planeada de la RNT, PRODESEN 2024-2038, cap. 5 (pp. 111–112 impresas). Solo cifras textuales del documento. */
  ampl: { src: { s: 'P24', p: '111–112', t: 'Figs. 5.2–5.3' }, totalKmc: 5719, rgdMT: 50.1, kv: { '400 kV': 2908.1, '230 kV': 1205.3, '161 a 69 kV': 1558.3 }, year: { 2025: 2802.1, 2026: 685, 2030: 1553.4 }, estados: ['Sinaloa', 'Coahuila', 'Chihuahua', 'Hidalgo', 'Estado de México', 'Guanajuato'] },
  kmByKv: { src: { s: 'P24', p: '156', t: 'Cuadro A1.1' }, years: [2021, 2022, 2023],
    kv: { '400 kV': [26098, 26125, 26135], '230 kV': [29723, 29743, 29743], '161 kV': [521, 521, 531], '138 kV': [1620, 1620, 1620], '115 kV': [48496, 48584, 48725], '85 kV': [1756, 1757, 1757], '69 kV': [2335, 2335, 2335] },
    total: [110549, 110685, 110846] },
  transf: { src: { s: 'P24', p: '157', t: 'Cuadro A1.2' }, years: [2021, 2022, 2023], rnt: [114807, 116082, 113688], rgd: [76331, 77056, 79812], total: [191138, 193138, 193500], u: 'MVA' },
  cfeTx: { src: { s: 'IA24', p: '76' }, years: [2022, 2023, 2024], km: [110449, 110558, 111138], subest: [2279, 2302, 2317], mva: [165541, 164992, 168981] },
  consumo: { src: { s: 'P24', p: '38', t: 'Cuadro 3.1' }, years: [2021, 2022, 2023],
    sys: { 'SIN': [304034, 314317, 326027], 'SIBC': [15541, 16233, 15999], 'SIBCS': [2826, 2964, 3257], 'SIMUL': [150, 148, 157] }, sen: [322552, 333662, 345439],
    inc: { 'SIN': [3.4, 3.4, 3.7], 'SIBC': [5.8, 4.5, -1.4], 'SIBCS': [8.4, 4.9, 9.9], 'SIMUL': [1.9, -1.4, 5.7] } },
  perdidasSEN2023: { v: 12.2, prev: 12.3, src: { s: 'P24', p: '40' } },
  perdidasProy: { v2024: 10.8, v2038: 7.9, src: { s: 'P24', p: '68' } },
  impExp: { src: { s: 'IA24', p: '90' }, years: [2022, 2023, 2024], imp: [5166, 1975, 2167], exp: [2104, 2795, 2562] },
  centros: [ // Centros de Control Regional (PRODESEN 2024-2038, Anexo 1, p. 155). Coordenadas: punto interior del municipio (INEGI/CONABIO 2022).
    { n: 'Centro Nacional (CENACE) y GCR Central', c: 'Ciudad de México', lat: 19.4284, lon: -99.1485, sys: 'SIN' },
    { n: 'Centro Nacional Alterno y GCR Oriental', c: 'Puebla', lat: 18.9613, lon: -98.2009, sys: 'SIN' },
    { n: 'GCR Occidental', c: 'Guadalajara', lat: 20.6735, lon: -103.3514, sys: 'SIN' },
    { n: 'GCR Peninsular', c: 'Mérida', lat: 20.9909, lon: -89.6421, sys: 'SIN' },
    { n: 'GCR Noroeste', c: 'Hermosillo', lat: 28.9721, lon: -111.3884, sys: 'SIN' },
    { n: 'GCR Norte', c: 'Gómez Palacio', lat: 25.7189, lon: -103.4934, sys: 'SIN' },
    { n: 'GCR Noreste', c: 'Monterrey', lat: 25.5724, lon: -100.2678, sys: 'SIN' },
    { n: 'GCR Baja California', c: 'Mexicali', lat: 32.1761, lon: -115.4411, sys: 'SIBC' },
    { n: 'Centro de Control Baja California Sur', c: 'La Paz', lat: 24.55, lon: -111.1015, sys: 'SIBCS' },
    { n: 'Centro de Control Mulegé (sede: Santa Rosalía)', c: 'Mulegé (municipio)', lat: 27.3967, lon: -113.502, sys: 'SIMUL' }
  ]
};

const SYSTEMS = {
  SIN:   { name: 'Sistema Interconectado Nacional', short: 'SIN', desc: 'Siete Gerencias de Control Regional (Central, Oriental, Occidental, Noroeste, Norte, Noreste y Peninsular) que comparten recursos y reservas.', link: 'Enlaces con Texas (EE. UU.): 115 kV con carga aislada, transformador de frecuencia variable de 100 MW (Laredo) y dos back-to-back de 150 MW (Reynosa).', src: { s: 'P24', p: '155, 158' } },
  SIBC:  { name: 'Sistema Interconectado Baja California', short: 'SIBC', desc: 'No está conectado al SIN. Opera interconectado con la red del oeste de EE. UU. (WECC).', link: 'Dos líneas de 230 kV en corriente alterna hacia el WECC.', src: { s: 'P24', p: '155, 158' } },
  SIBCS: { name: 'Sistema Interconectado Baja California Sur', short: 'SIBCS', desc: 'Eléctricamente aislado del SIN, del SIBC y de Mulegé.', link: 'Sin enlaces con otros sistemas.', src: { s: 'P24', p: '155' } },
  SIMUL: { name: 'Sistema Interconectado Mulegé', short: 'SIMUL', desc: 'Sistema pequeño y aislado; tiene su propio centro de control en Santa Rosalía.', link: 'Sin enlaces con otros sistemas.', src: { s: 'P24', p: '155' } }
};

/* ---------- Distribución ---------- */
const DIST = {
  usuarios: { v: 49.1, u: 'millones', src: { s: 'IA24', p: '95' } },
  clientesSSB: { years: [2019, 2020, 2021, 2022, 2023, 2024], v: [44515362, 45626211, 46652629, 47426123, 48202050, 49016942], src: { s: 'IA24', p: '121' } },
  kmRGD: { v: 901000, u: 'km', src: { s: 'IA24', p: '95' } },
  rgd: { src: { s: 'P24', p: '157', t: 'Cuadro A1.3' }, years: [2021, 2022, 2023], mt: [542129, 548411, 551465], bt: [335920, 340759, 342741], mva: [57994, 59123, 60010], transf: [1583932, 1617936, 1640728], circuitos: [12114, 12239, 12358] },
  divisiones: 16, zonas: 150,
  perdidas: { src: { s: 'IA24', p: '96' }, years: [2022, 2023, 2024], total: [11.05, 10.86, 10.69], mtbt: [13.22, 12.88, 12.88] },
  perdidasRGD2023: { gwh: 33947, pct: 13.2, tec: 4.62, notec: 8.57, src: { s: 'P24', p: '143' } },
  saidi: { years: [2022, 2023, 2024], v: [19.248, 17.788, 16.708], saifi: [0.411, 0.391, 0.375], src: { s: 'IA24', p: '96' } },
  electrificacion: { v2023: 99.43, v2024: 99.64, src: { s: 'IA24', p: '96' } },
  /* Ventas y usuarios por sector tarifario. IA 2024, pp. 120-121 */
  sectores: { src: { s: 'IA24', p: '120-121' }, years: [2019, 2020, 2021, 2022, 2023, 2024],
    ventas: { 'Doméstico bajo consumo': [62181, 67012, 68287, 69833, 74540, 77811], 'Doméstico alto consumo': [2490, 1965, 1175, 757, 604, 487], 'Comercial': [15233, 13745, 14110, 15008, 15776, 16224], 'Servicios': [4160, 3961, 3865, 3910, 3698, 3665], 'Agrícola': [12455, 14009, 13509, 14159, 15722, 15191], 'Industrial': [122378, 105770, 105136, 110407, 112474, 111821] },
    usuarios: { 'Doméstico bajo consumo': [39079094, 40332025, 41381248, 42142989, 42885085, 43667549], 'Doméstico alto consumo': [470280, 278312, 167859, 112319, 80255, 61550], 'Comercial': [4253338, 4294233, 4369519, 4425915, 4488167, 4532876], 'Servicios': [174933, 176300, 178602, 180109, 174229, 169583], 'Agrícola': [132238, 133605, 134666, 134491, 133226, 131601], 'Industrial': [405479, 411657, 420735, 430300, 441088, 453783] },
    productosMDP: [414400, 373083, 384001, 424856, 472557, 496910] },
  /* Participación por Gerencia de Control Regional, 2023 (PRODESEN 2024-2038, Figura 3.2, p. 40) */
  gcr2023: { src: { s: 'P24', p: '40', t: 'Figura 3.2' }, consumoFinal: 298599, usuariosM: 48.2,
    v: { CEN: [16.6, 21.2], ORI: [15.6, 25.4], OCC: [22.4, 24.2], NOR: [8.0, 4.7], NTE: [8.7, 5.0], NES: [17.8, 10.8], PEN: [4.8, 4.6], SIBC: [5.0, 3.4], SIBCS: [1.0, 0.7], SIMUL: [0.05, 0.1] } },
  consumoMedio: { v: 7166, u: 'kWh/usuario', src: { s: 'P24', p: '41' } }
};

/* División de distribución dominante por entidad (aprox.). Base: CRE A/058/2017, Anexo B.
   'shared' marca entidades repartidas entre divisiones. */
const STATE_DIV = {
  '01': { d: 'Bajío' }, '02': { d: 'Baja California' }, '03': { d: 'Baja California', note: 'En tarifas, BCS es división tarifaria propia; en distribución pertenece a la División Baja California.' },
  '04': { d: 'Peninsular', shared: ['Sureste'] }, '05': { d: 'Golfo Norte', shared: ['Norte', 'Bajío'] }, '06': { d: 'Centro Occidente' },
  '07': { d: 'Sureste' }, '08': { d: 'Norte' }, '09': { d: 'Valle de México Centro', shared: ['Valle de México Sur', 'Valle de México Norte'] },
  '10': { d: 'Norte', shared: ['Noroeste', 'Bajío'] }, '11': { d: 'Bajío', shared: ['Centro Occidente', 'Golfo Centro'] }, '12': { d: 'Centro Sur', shared: ['Centro Oriente', 'Sureste'] },
  '13': { d: 'Centro Oriente', shared: ['Golfo Centro', 'Bajío', 'Oriente'] }, '14': { d: 'Jalisco', shared: ['Bajío', 'Centro Occidente'] }, '15': { d: 'Centro Sur', shared: ['Valle de México Norte', 'Valle de México Sur', 'Valle de México Centro'] },
  '16': { d: 'Centro Occidente', shared: ['Bajío', 'Centro Sur', 'Jalisco'] }, '17': { d: 'Centro Sur' }, '18': { d: 'Jalisco' }, '19': { d: 'Golfo Norte', shared: ['Golfo Centro'] },
  '20': { d: 'Sureste', shared: ['Oriente', 'Centro Oriente'] }, '21': { d: 'Centro Oriente', shared: ['Oriente', 'Golfo Centro', 'Centro Sur'] }, '22': { d: 'Bajío', shared: ['Golfo Centro'] },
  '23': { d: 'Peninsular' }, '24': { d: 'Golfo Centro', shared: ['Bajío'] }, '25': { d: 'Noroeste', shared: ['Jalisco'] }, '26': { d: 'Noroeste', shared: ['Baja California'] },
  '27': { d: 'Sureste', shared: ['Oriente'] }, '28': { d: 'Golfo Centro', shared: ['Golfo Norte'] }, '29': { d: 'Centro Oriente' }, '30': { d: 'Oriente', shared: ['Golfo Centro', 'Centro Oriente', 'Sureste'] },
  '31': { d: 'Peninsular' }, '32': { d: 'Bajío', shared: ['Golfo Centro', 'Jalisco'] }
};

/* ---------- Emisiones ----------
   Ciclo de vida (mediana, gCO₂e/kWh): IPCC AR5 WGIII, Anexo III, Tabla A.III.2, p. 1335.
   Factores de combustión (directos, por energía del combustible): CFE SPA00-63, Tabla 2 (IPCC 2006), p. 4. */
const EMIS_LCA = { src: { s: 'IPCC', p: '1335' }, u: 'gCO₂e/kWh (mediana, ciclo de vida)',
  v: { 'Carbón (pulverizado)': 820, 'Gas natural (ciclo combinado)': 490, 'Biomasa (dedicada)': 230, 'Solar FV (gran escala)': 48, 'Geotermia': 38, 'Hidroeléctrica': 24, 'Nuclear': 12, 'Eólica (terrestre)': 11 } };
const EMIS_FUEL = { src: { s: 'SPA', p: '4', t: 'Tabla 2, factores IPCC 2006' }, u: 'kg CO₂/GJ de combustible (emisión directa de combustión)',
  v: { 'Gas natural': 56.1, 'Diésel': 74.1, 'Combustóleo': 77.4, 'Carbón': 94.6 } };

/* ---------- Reforma energética ---------- */
const TIMELINE = [
  { id: 'pre', y: 'Antes de 2013', era: 'pre', t: 'Servicio público de electricidad a cargo del Estado', d: 'La infraestructura se construyó al amparo de la Ley del Servicio Público de Energía Eléctrica (LSPEE). Los particulares participaban solo en modalidades como Productor Independiente (PIE), autoabastecimiento, cogeneración, pequeña producción, importación y exportación.', src: [{ s: 'P24', p: '160' }] },
  { id: 'ini', y: 'Jul–ago 2013', era: 'r13', t: 'Iniciativas en el Senado', d: 'El PAN presentó su propia iniciativa. El presidente Enrique Peña Nieto presentó la suya ante el Senado el 14 de agosto de 2013.', src: [{ s: 'EXP21' }] },
  { id: 'sen', y: '9–11 dic 2013', era: 'r13', t: 'Dictamen y aprobación en el Senado', d: 'Las comisiones dictaminaron el 9 de diciembre; el pleno aprobó con más del 77 % de los votos. La minuta pasó a la Cámara de Diputados.', src: [{ s: 'EXP21' }] },
  { id: 'dip', y: '11–12 dic 2013', era: 'r13', t: 'Aprobación en la Cámara de Diputados', d: 'Votaron a favor PRI, PAN, PVEM y Nueva Alianza; diputados del PRD y de la izquierda tomaron la tribuna en protesta. La aprobación rondó el 90 % de los presentes. Las crónicas fechan la votación entre el 11 y el 12 de diciembre porque la sesión se prolongó.', src: [{ s: 'EXP13' }, { s: 'EXP21' }] },
  { id: 'loc', y: 'Dic 2013', era: 'r13', t: 'Congresos estatales y declaratoria', d: 'Los congresos locales aprobaron la reforma en pocos días. La Comisión Permanente firmó el decreto el 18 de diciembre de 2013.', src: [{ s: 'EXP21' }, { s: 'DOF13', p: '7' }] },
  { id: 'dof', y: '20 dic 2013', era: 'r13', t: 'Publicación de la reforma constitucional', d: 'Se reforman los artículos 25, 27 y 28. La planeación y el control del SEN y el servicio público de transmisión y distribución quedan como exclusivos de la Nación; los particulares pueden participar en las demás actividades de la industria eléctrica. CFE debe convertirse en empresa productiva del Estado y se ordena crear el CENACE.', src: [{ s: 'DOF13', p: '1–2, 6' }] },
  { id: 'lie', y: '11 ago 2014', era: 'r13', t: 'Leyes secundarias', d: 'Se expiden la Ley de la Industria Eléctrica (LIE), que define el Mercado Eléctrico Mayorista y las Energías Limpias, y la Ley de la Comisión Federal de Electricidad.', src: [{ s: 'DOF14', p: '44–46' }] },
  { id: 'cen', y: '28 ago 2014', era: 'r13', t: 'Nace el CENACE como organismo independiente', d: 'Se publica el decreto que crea el Centro Nacional de Control de Energía: control operativo del SEN, operación del mercado eléctrico mayorista y acceso abierto a las redes.', src: [{ s: 'QUAD14' }, { s: 'DOF13', p: '6' }] },
  { id: 'mem', y: '2016', era: 'r13', t: 'Arranca el Mercado Eléctrico', d: 'Con la entrada del mercado eléctrico se da prioridad al despacho económico de las centrales según la disponibilidad ofertada.', src: [{ s: 'IA24', p: '25' }] },
  { id: 'r21', y: '9 mar 2021', era: 'post', t: 'Reforma a la Ley de la Industria Eléctrica', d: 'Se reforman los artículos 3, 4, 12, 26, 35, 53, 101, 108 y 126 de la LIE; la reforma fue impugnada en tribunales.', src: [{ s: 'SCJN21' }] },
  { id: 'r22', y: '17 abr 2022', era: 'post', t: 'Se rechaza la reforma constitucional eléctrica', d: 'En la Cámara de Diputados obtuvo 275 votos a favor y 223 en contra, sin alcanzar la mayoría calificada de dos tercios.', src: [{ s: 'BLM22' }] },
  { id: 'r24', y: '31 oct 2024', era: 'r24', t: 'Reforma constitucional en áreas y empresas estratégicas', d: 'La transmisión, la distribución y la planeación y control del SEN siguen siendo exclusivas de la Nación. La participación privada “en ningún caso tendrá prevalencia sobre la empresa pública del Estado”, y el servicio debe darse “evitando el lucro”.', src: [{ s: 'DOF24' }] },
  { id: 'r25', y: '18 mar 2025', era: 'r24', t: 'Nuevas leyes secundarias', d: 'Se expiden la Ley del Sector Eléctrico, la Ley de la Empresa Pública del Estado CFE y la Ley de Planeación y Transición Energética. La LSE establece que el Estado debe mantener al menos el 54 % de la energía inyectada a la red.', src: [{ s: 'DOF25', p: '97 (LSE, art. 12, fr. VI)' }] }
];

/* ---------- Glosario (tooltips) ---------- */
const GLOSSARY = {
  'recurso-primario': ['Recurso energético primario', 'Energía tal como se encuentra en la naturaleza antes de transformarse: gas natural, carbón, uranio, radiación solar, viento, agua, calor geotérmico o biomasa.'],
  'combustible': ['Fuente o combustible', 'Forma en que el recurso entra a la central: gas natural, combustóleo, diésel, carbón, uranio enriquecido o biogás. Las fuentes renovables como el viento o el sol no se “queman”.'],
  'conversion': ['Proceso de conversión', 'Cadena física que transforma la energía: química → térmica → mecánica → eléctrica, o radiante → eléctrica (efecto fotovoltaico).'],
  'tecnologia': ['Tecnología de generación', 'Tipo de central que hace la conversión: ciclo combinado, vapor convencional, turbogás, combustión interna, carboeléctrica, nucleoeléctrica, hidroeléctrica, eólica, fotovoltaica, geotérmica o bioenergía.'],
  'rankine': ['Ciclo Rankine', 'Ciclo termodinámico de vapor: una bomba eleva la presión del agua, la caldera la convierte en vapor, el vapor mueve una turbina y un condensador lo regresa a líquido. Es la base del vapor convencional, las carboeléctricas, la geotermia y la nucleoeléctrica.'],
  'brayton': ['Ciclo Brayton', 'Ciclo de turbina de gas: el aire se comprime, se quema con combustible y los gases calientes se expanden en una turbina. Es la base del turbogás.'],
  'ciclo-combinado': ['Ciclo combinado', 'Une una turbina de gas (Brayton) con una de vapor (Rankine): el calor de los gases de escape genera vapor para una segunda turbina, lo que aprovecha mejor el combustible.'],
  'vapor-convencional': ['Vapor convencional (termoeléctrica)', 'Central que quema combustóleo o gas natural en una caldera para producir vapor y mover una turbina (ciclo Rankine). Su diseño admite distintos combustibles.'],
  'turbogas': ['Turbogás', 'Turbina de gas en ciclo simple (Brayton). Arranca rápido y suele cubrir picos de demanda.'],
  'combustion-interna': ['Combustión interna', 'Motores de pistón que queman diésel, combustóleo o gas. Son comunes en sistemas aislados como Baja California Sur.'],
  'carboelectrica': ['Carboeléctrica', 'Central de vapor (Rankine) cuya caldera quema carbón mineral.'],
  'nucleoelectrica': ['Nucleoeléctrica', 'La fisión del uranio libera calor en el reactor; ese calor produce vapor que mueve una turbina (Rankine).'],
  'fision': ['Fisión nuclear', 'División de un núcleo pesado (como el U-235) al absorber un neutrón; libera energía térmica y más neutrones que sostienen una reacción en cadena controlada.'],
  'fotovoltaico': ['Efecto fotovoltaico', 'Los fotones liberan electrones en una celda semiconductora y producen corriente directa; un inversor la convierte en alterna.'],
  'geotermica': ['Geotermoeléctrica', 'Aprovecha vapor o agua caliente del subsuelo para mover una turbina.'],
  'renovable': ['Energía renovable', 'Su fuente se regenera de forma natural a escala humana: viento, sol, agua, calor de la Tierra y bioenergía.'],
  'limpia': ['Energía limpia', 'Categoría legal: fuentes cuyas emisiones o residuos no rebasan umbrales reglamentarios. Incluye las renovables, la nuclear y la cogeneración eficiente (LIE 2014, art. 3, fr. XXII; LSE 2025, art. 3, fr. XXI).'],
  'cogeneracion': ['Cogeneración eficiente', 'Produce electricidad y calor útil con el mismo combustible. Si cumple criterios de eficiencia de la CRE, la ley la considera energía limpia aunque use combustible fósil.'],
  'factor-planta': ['Factor de planta', 'Energía que realmente se generó en un año dividida entre la que se habría generado operando todo el año a capacidad máxima.'],
  'capacidad': ['Capacidad instalada (MW)', 'Potencia máxima que pueden entregar las centrales. Se mide en megawatts (MW).'],
  'generacion': ['Generación (GWh)', 'Energía producida en un periodo. 1 GWh = 1,000 MWh = 1,000,000 kWh.'],
  'sin': ['SIN', 'Sistema Interconectado Nacional: integra siete regiones de control que comparten recursos.'],
  'rnt': ['Red Nacional de Transmisión', 'Redes de 69 kV o más que llevan la energía a grandes distancias, hacia las redes de distribución y los grandes usuarios.'],
  'rgd': ['Redes Generales de Distribución', 'Media tensión (más de 1 kV y menos de 69 kV) y baja tensión (1 kV o menos) que llegan a los usuarios.'],
  'saidi': ['SAIDI', 'Duración promedio de las interrupciones por usuario en un año, en minutos.'],
  'saifi': ['SAIFI', 'Número promedio de interrupciones por usuario en un año.'],
  'perdidas-tecnicas': ['Pérdidas técnicas', 'Energía que se disipa como calor (efecto Joule, I²R) en conductores y transformadores.'],
  'perdidas-no-tecnicas': ['Pérdidas no técnicas', 'Energía consumida que el medidor no registra: usos ilícitos, fallas de medición o errores administrativos.'],
  'factor-potencia': ['Factor de potencia (cos φ)', 'Relación entre la potencia activa (W) y la aparente (VA). Con cos φ = 1 toda la corriente transporta potencia útil.'],
  'mem': ['Mercado Eléctrico Mayorista', 'Mercado operado por el CENACE donde se compran y venden energía, potencia y otros productos.'],
  'cenace': ['CENACE', 'Centro Nacional de Control de Energía: controla la operación del SEN y opera el mercado eléctrico.'],
  'pie': ['Productor Independiente de Energía (PIE)', 'Empresa privada que construye una central y vende toda su energía a CFE con un contrato de largo plazo.'],
  'cel': ['Certificado de Energía Limpia (CEL)', 'Título que acredita la producción de un MWh con energía limpia; sirve para cumplir obligaciones de energías limpias.'],
  'ciclo-vida': ['Emisiones de ciclo de vida', 'Suman las emisiones de fabricación, construcción, combustible, operación y desmantelamiento, expresadas por kWh generado.'],
  'directas': ['Emisiones directas', 'Las que salen de la chimenea durante la operación, al quemar combustible.']
};
