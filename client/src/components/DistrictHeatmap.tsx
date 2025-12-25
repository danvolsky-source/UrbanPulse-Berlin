import { useState } from "react";
import { cn } from "@/lib/utils";

interface District {
  id: number;
  name: string;
  priceLevel?: number; // 1-7 scale
}

interface DistrictHeatmapProps {
  className?: string;
  districts?: District[];
  cityName?: string;
}

// Simplified Berlin district shapes (mock data - would be real GeoJSON in production)
const berlinDistricts = [
  // Center districts (high prices - red/orange)
  { id: 1, name: "Mitte", path: "M 400,300 L 450,280 L 480,320 L 460,360 L 420,350 Z", priceLevel: 7 },
  { id: 2, name: "Prenzlauer Berg", path: "M 450,280 L 520,260 L 540,300 L 500,330 L 480,320 Z", priceLevel: 6 },
  { id: 3, name: "Friedrichshain", path: "M 480,320 L 500,330 L 520,380 L 480,400 L 460,360 Z", priceLevel: 6 },
  { id: 4, name: "Kreuzberg", path: "M 420,350 L 460,360 L 480,400 L 440,420 L 400,400 Z", priceLevel: 6 },
  
  // Mid-ring districts (medium prices - yellow/green)
  { id: 5, name: "Charlottenburg", path: "M 280,300 L 350,280 L 400,300 L 380,360 L 300,350 Z", priceLevel: 5 },
  { id: 6, name: "Wilmersdorf", path: "M 300,350 L 380,360 L 400,400 L 340,420 L 280,400 Z", priceLevel: 5 },
  { id: 7, name: "Schöneberg", path: "M 340,420 L 400,400 L 440,420 L 420,480 L 360,480 Z", priceLevel: 4 },
  { id: 8, name: "Tempelhof", path: "M 360,480 L 420,480 L 440,540 L 380,560 L 340,540 Z", priceLevel: 4 },
  { id: 9, name: "Neukölln", path: "M 440,420 L 480,400 L 520,450 L 500,520 L 440,540 Z", priceLevel: 3 },
  { id: 10, name: "Lichtenberg", path: "M 520,380 L 580,360 L 620,400 L 600,460 L 540,450 L 520,450 Z", priceLevel: 3 },
  
  // Outer districts (lower prices - blue/cyan)
  { id: 11, name: "Pankow", path: "M 520,260 L 600,220 L 640,260 L 620,320 L 560,300 L 540,300 Z", priceLevel: 2 },
  { id: 12, name: "Reinickendorf", path: "M 350,180 L 450,160 L 520,200 L 520,260 L 450,280 L 380,240 Z", priceLevel: 2 },
  { id: 13, name: "Spandau", path: "M 180,240 L 260,220 L 320,260 L 300,320 L 220,320 L 180,280 Z", priceLevel: 1 },
  { id: 14, name: "Steglitz", path: "M 280,400 L 340,420 L 340,540 L 280,560 L 220,520 L 240,450 Z", priceLevel: 2 },
  { id: 15, name: "Marzahn", path: "M 620,320 L 700,300 L 740,360 L 720,420 L 660,440 L 620,400 Z", priceLevel: 1 },
  { id: 16, name: "Treptow", path: "M 500,520 L 540,540 L 560,600 L 500,620 L 440,600 L 440,540 Z", priceLevel: 2 },
];

export function DistrictHeatmap({
  className,
  districts,
  cityName = "Berlin",
}: DistrictHeatmapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  // Use provided districts or default Berlin shapes
  const displayDistricts = districts && districts.length > 0 
    ? berlinDistricts.map((shape, idx) => ({
        ...shape,
        name: districts[idx]?.name || shape.name,
        priceLevel: districts[idx]?.priceLevel || shape.priceLevel,
      }))
    : berlinDistricts;

  // Color scale from blue (cheap) to red (expensive)
  const getColor = (level: number = 3) => {
    const colors = [
      "#0ea5e9", // 1 - cyan (cheapest)
      "#22c55e", // 2 - green
      "#84cc16", // 3 - lime
      "#eab308", // 4 - yellow
      "#f97316", // 5 - orange
      "#ef4444", // 6 - red
      "#dc2626", // 7 - dark red (most expensive)
    ];
    return colors[level - 1] || colors[2];
  };

  return (
    <div className={cn("relative w-full h-full bg-slate-950 rounded-lg overflow-hidden", className)}>
      <svg
        viewBox="0 0 800 700"
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      >
        {/* District polygons */}
        {displayDistricts.map((district) => (
          <g key={district.id}>
            <path
              d={district.path}
              fill={getColor(district.priceLevel)}
              fillOpacity={hoveredDistrict === district.id ? 0.9 : 0.7}
              stroke="#1e293b"
              strokeWidth="2"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredDistrict(district.id)}
              onMouseLeave={() => setHoveredDistrict(null)}
              onClick={() => setSelectedDistrict(district.id === selectedDistrict ? null : district.id)}
            />
            
            {/* District labels */}
            <text
              x={getDistrictCenter(district.path).x}
              y={getDistrictCenter(district.path).y}
              textAnchor="middle"
              className="text-[10px] font-semibold fill-white pointer-events-none"
              style={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                fontSize: hoveredDistrict === district.id ? "12px" : "10px",
              }}
            >
              {district.name}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredDistrict && (
        <div className="absolute top-4 left-4 bg-slate-900/95 p-3 rounded-lg border border-slate-700 pointer-events-none">
          <p className="text-sm font-bold text-white">
            {displayDistricts.find(d => d.id === hoveredDistrict)?.name}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Price Level: {displayDistricts.find(d => d.id === hoveredDistrict)?.priceLevel}/7
          </p>
        </div>
      )}

      {/* Selected district info */}
      {selectedDistrict && (
        <div className="absolute bottom-4 left-4 bg-slate-900/95 p-4 rounded-lg border border-slate-700 max-w-xs">
          <p className="text-sm font-bold text-white mb-2">
            {displayDistricts.find(d => d.id === selectedDistrict)?.name}
          </p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>Avg Price: €{(displayDistricts.find(d => d.id === selectedDistrict)?.priceLevel || 3) * 1000}/m²</p>
            <p>Price Level: {displayDistricts.find(d => d.id === selectedDistrict)?.priceLevel}/7</p>
          </div>
          <button
            onClick={() => setSelectedDistrict(null)}
            className="mt-2 text-xs text-cyan-400 hover:text-cyan-300"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// Helper to calculate approximate center of polygon
function getDistrictCenter(path: string): { x: number; y: number } {
  const coords = path.match(/[\d.]+/g)?.map(Number) || [];
  const xCoords = coords.filter((_, i) => i % 2 === 0);
  const yCoords = coords.filter((_, i) => i % 2 === 1);
  
  return {
    x: xCoords.reduce((a, b) => a + b, 0) / xCoords.length,
    y: yCoords.reduce((a, b) => a + b, 0) / yCoords.length,
  };
}
