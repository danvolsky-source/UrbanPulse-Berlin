import { useEffect, useRef } from "react";
import L from "leaflet";
import { cn } from "@/lib/utils";

interface District {
  id: number;
  name: string;
  lat?: number;
  lng?: number;
}

interface LeafletMapProps {
  className?: string;
  center: [number, number];
  zoom?: number;
  districts?: District[];
}

export function LeafletMap({
  className,
  center,
  zoom = 11,
  districts = [],
}: LeafletMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Initialize map
    const map = L.map(mapContainer.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, zoom]);

  // Add district markers
  useEffect(() => {
    if (!mapInstance.current || !districts || districts.length === 0) return;

    const colors = [
      "#0ea5e9",
      "#22c55e",
      "#84cc16",
      "#eab308",
      "#f97316",
      "#ef4444",
      "#dc2626",
    ];

    districts.forEach((district, index) => {
      if (!mapInstance.current) return;

      // Generate random coordinates around center if not provided
      const lat = district.lat || center[0] + (Math.random() - 0.5) * 0.2;
      const lng = district.lng || center[1] + (Math.random() - 0.5) * 0.3;

      // Color based on price level (mock)
      const priceLevel = index % 7;
      const color = colors[priceLevel];

      // Create circle marker
      const circle = L.circleMarker([lat, lng], {
        radius: 12,
        fillColor: color,
        fillOpacity: 0.8,
        color: "#1e293b",
        weight: 2,
      }).addTo(mapInstance.current);

      // Add tooltip
      circle.bindTooltip(district.name, {
        permanent: false,
        direction: "top",
        className: "district-tooltip",
      });

      // Add popup with more info
      circle.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${district.name}</h3>
          <p class="text-xs text-gray-600 mt-1">Price Level: ${priceLevel + 1}/7</p>
        </div>
      `);
    });
  }, [districts, center]);

  return (
    <div
      ref={mapContainer}
      className={cn("w-full h-full rounded-lg", className)}
      style={{ minHeight: "400px" }}
    />
  );
}
