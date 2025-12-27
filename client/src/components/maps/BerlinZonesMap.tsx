import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import berlinZones from "@/data/berlin_zones.geojson";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;

export const BerlinZonesMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#030712"
            }
          }
        ]
      },
      center: [13.405, 52.52],
      zoom: 10
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("berlin-zones", {
        type: "geojson",
        data: berlinZones as any
      });

      map.addLayer({
        id: "berlin-zones-fill",
        type: "fill",
        source: "berlin-zones",
        paint: {
          "fill-color": [
            "match",
            ["get", "code"],
            "Z1",
            "#f97316",
            "Z2",
            "#3b82f6",
            "Z3",
            "#22c55e",
            "#6b7280"
          ],
          "fill-opacity": 0.7
        }
      });

      map.addLayer({
        id: "berlin-zones-outline",
        type: "line",
        source: "berlin-zones",
        paint: {
          "line-color": "#e5e7eb",
          "line-width": 1.5
        }
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainerRef} className="h-full w-full rounded-xl" />;
};
