import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox Access Token - will be set via environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface MapboxBerlinMapProps {
  className?: string;
}

export const MapboxBerlinMap: React.FC<MapboxBerlinMapProps> = ({ className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark theme
      center: [13.404954, 52.520008], // Berlin coordinates
      zoom: 10,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);

      // Load Berlin boundary GeoJSON from GitHub
      map.current!.addSource('berlin-boundary', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/danvolsky-source/GALOR/main/berlin_boundary.geojson'
      });

      // Add fill layer
      map.current!.addLayer({
        id: 'berlin-fill',
        type: 'fill',
        source: 'berlin-boundary',
        paint: {
          'fill-color': '#007cbf',
          'fill-opacity': 0.3
        }
      });

      // Add outline layer
      map.current!.addLayer({
        id: 'berlin-outline',
        type: 'line',
        source: 'berlin-boundary',
        paint: {
          'line-color': '#00d4ff',
          'line-width': 3,
          'line-opacity': 0.8
        }
      });

      // Add hover effect
      map.current!.on('mouseenter', 'berlin-fill', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });

      map.current!.on('mouseleave', 'berlin-fill', () => {
        map.current!.getCanvas().style.cursor = '';
      });

      // Add click popup
      map.current!.on('click', 'berlin-fill', (e) => {
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML('<h3 class="font-bold text-lg">Berlin</h3><p class="text-sm">City Boundary</p>')
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-[500px] rounded-2xl overflow-hidden"
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950 rounded-2xl">
          <div className="text-slate-400 text-sm">Loading map…</div>
        </div>
      )}
    </div>
  );
};
