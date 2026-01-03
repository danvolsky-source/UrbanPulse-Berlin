import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox Access Token - will be set via environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface MapboxBerlinMapProps {
  className?: string;
}

export const MapboxBerlinMap: React.FC<MapboxBerlinMapProps> = ({ className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [13.405, 52.52], // Berlin coordinates
      zoom: 10,
      pitch: 0,
      bearing: 0,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;
      setMapLoaded(true);

      // Add Berlin boundary source with performance optimizations
      map.current.addSource('berlin-boundary', {
        type: 'geojson',
        // Best Practice: Load GeoJSON directly from URL (reduces memory overhead)
        data: 'https://raw.githubusercontent.com/danvolsky-source/GALOR/main/berlin_boundary.geojson',
        // Performance optimization: limit zoom levels
        maxzoom: 14,
        // Reduce tile size for better performance
        buffer: 128,
      });

      // Best Practice: Separate fill and line layers for polygon styling
      // Fill layer for the area
      map.current.addLayer({
        id: 'berlin-fill',
        type: 'fill',
        source: 'berlin-boundary',
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#627BC1', // Hover color
            '#88A3E2'  // Default color
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.7,  // Hover opacity
            0.4   // Default opacity
          ],
        },
      });

      // Line layer for the boundary outline
      map.current.addLayer({
        id: 'berlin-outline',
        type: 'line',
        source: 'berlin-boundary',
        paint: {
          'line-color': '#1e3a8a',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 2,   // At zoom 8, width is 2px
            14, 4   // At zoom 14, width is 4px
          ],
        },
      });

      // Best Practice: Add interactivity (hover effects)
      map.current.on('mousemove', 'berlin-fill', (e) => {
        if (!map.current) return;
        
        // Change cursor to pointer
        map.current.getCanvas().style.cursor = 'pointer';

        if (e.features && e.features.length > 0) {
          // Remove previous hover state
          if (hoveredDistrictId !== null) {
            map.current.setFeatureState(
              { source: 'berlin-boundary', id: hoveredDistrictId },
              { hover: false }
            );
          }

          const feature = e.features[0];
          const newHoveredId = feature.id as string;
          
          // Set new hover state
          map.current.setFeatureState(
            { source: 'berlin-boundary', id: newHoveredId },
            { hover: true }
          );

          setHoveredDistrictId(newHoveredId);
        }
      });

      map.current.on('mouseleave', 'berlin-fill', () => {
        if (!map.current) return;
        
        // Reset cursor
        map.current.getCanvas().style.cursor = '';

        // Remove hover state
        if (hoveredDistrictId !== null) {
          map.current.setFeatureState(
            { source: 'berlin-boundary', id: hoveredDistrictId },
            { hover: false }
          );
          setHoveredDistrictId(null);
        }
      });

      // Best Practice: Add click interactivity
      map.current.on('click', 'berlin-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        
        const feature = e.features[0];
        const properties = feature.properties;
        
        // Create popup with district information
        new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: true,
        })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="padding: 8px; font-family: system-ui, sans-serif;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
                ${properties?.name || 'Berlin'}
              </h3>
              <p style="margin: 0; font-size: 14px; color: #666;">
                ${properties?.description || 'City boundary'}
              </p>
            </div>
          `)
          .addTo(map.current!);
      });
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update hover state when hoveredDistrictId changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // This effect handles hover state updates
  }, [hoveredDistrictId, mapLoaded]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
        Berlin Data Visualization
      </div>
    </div>
  );
};

export default MapboxBerlinMap;
