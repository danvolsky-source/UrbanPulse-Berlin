// Загружаем GeoJSON из GitHub
const GEOJSON_URL = 'https://raw.githubusercontent.com/danvolsky-source/GALOR/main/berlin_boundary.geojson';

// Функция для загрузки и преобразования GeoJSON в SVG path
export async function loadBerlinBoundary() {
  try {
    const response = await fetch(GEOJSON_URL);
    const geojson = await response.json();
    return geojson;
  } catch (error) {
    console.error('Failed to load Berlin boundary:', error);
    return null;
  }
}

// Функция для преобразования GeoJSON координат в SVG path
export function convertGeoJSONToPath(
  geojson: any,
  width: number = 700,
  height: number = 500
): string {
  if (!geojson || !geojson.features || !geojson.features[0]) {
    return '';
  }

  const coordinates = geojson.features[0].geometry.coordinates[0];

  // Находим границы для масштабирования
  const lons = coordinates.map((c: number[]) => c[0]);
  const lats = coordinates.map((c: number[]) => c[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  // Масштабируем координаты под размер SVG
  const scaleX = (lon: number) => ((lon - minLon) / (maxLon - minLon)) * width;
  const scaleY = (lat: number) => height - ((lat - minLat) / (maxLat - minLat)) * height;

  // Создаем SVG path
  const pathCommands = coordinates.map((coord: number[], i: number) => {
    const x = scaleX(coord[0]);
    const y = scaleY(coord[1]);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  });

  return pathCommands.join(' ') + ' Z';
}

// Старый статический путь (для обратной совместимости)
export const BERLIN_OUTLINE_PATH = "M 406.64 2.18 L 404.38 5.51 L 403.75 6.73 L 403.37 7.91 L 403.23 9.11 L 403.24 10.31 L 403.41 11.49 L 403.73 12.64 L 404.19 13.74 L 404.79 14.78 L 405.52 15.75 L 406.37 16.63 L 407.32 17.41 L 408.37 18.08 L 409.49 18.62 L 410.67 19.03 L 411.89 19.3 L 413.13 19.43 L 414.37 19.41 L 415.6 19.25 L 416.8 18.95 L 417.95 18.51 L 419.05 17.94 L 420.08 17.25 L 421.03 16.43 L 421.89 15.5 L 422.65 14.47 L 423.3 13.35 L 423.84 12.16 L 424.25 10.91 L 424.53 9.61 L 424.68 8.29 L 424.7 6.95 L 424.58 5.62 L 424.32 4.31 L 423.94 3.03 L 423.43 1.81 L 422.8 0.65 L 422.06 -0.44 L 421.21 -1.46 L 420.26 -2.4 L 419.22 -3.26 L 418.1 -4.02 L 416.91 -4.69 L 415.66 -5.25 L 414.36 -5.71 L 413.02 -6.06 L 411.66 -6.29 L 410.28 -6.42 L 408.89 -6.43 L 407.51 -6.33 L 406.64 2.18 Z";
