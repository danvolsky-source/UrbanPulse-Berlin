import { useState, useEffect } from "react";
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
  selectedYear?: number;
  selectedEvent?: number | null;
  highlightedDistricts?: number[];
  showAirQuality?: boolean;
  showGreenery?: boolean;
  onDistrictClick?: (districtId: number) => void;
}

// Simplified Berlin district shapes (mock data - would be real GeoJSON in production)
const berlinDistricts = [
  // Center districts (high prices - red/orange)
  { id: 1, name: "Mitte", path: "M 400,300 L 450,280 L 480,320 L 460,360 L 420,350 Z", priceLevel: 7, airQuality: 85, greenery: 60 },
  { id: 2, name: "Prenzlauer Berg", path: "M 450,280 L 520,260 L 540,300 L 500,330 L 480,320 Z", priceLevel: 6, airQuality: 90, greenery: 75 },
  { id: 3, name: "Friedrichshain", path: "M 480,320 L 500,330 L 520,380 L 480,400 L 460,360 Z", priceLevel: 6, airQuality: 80, greenery: 65 },
  { id: 4, name: "Kreuzberg", path: "M 420,350 L 460,360 L 480,400 L 440,420 L 400,400 Z", priceLevel: 6, airQuality: 75, greenery: 55 },
  
  // Mid-ring districts (medium prices - yellow/green)
  { id: 5, name: "Charlottenburg", path: "M 280,300 L 350,280 L 400,300 L 380,360 L 300,350 Z", priceLevel: 5, airQuality: 88, greenery: 80 },
  { id: 6, name: "Wilmersdorf", path: "M 300,350 L 380,360 L 400,400 L 340,420 L 280,400 Z", priceLevel: 5, airQuality: 92, greenery: 85 },
  { id: 7, name: "Schöneberg", path: "M 340,420 L 400,400 L 440,420 L 420,480 L 360,480 Z", priceLevel: 4, airQuality: 82, greenery: 70 },
  { id: 8, name: "Tempelhof", path: "M 360,480 L 420,480 L 440,540 L 380,560 L 340,540 Z", priceLevel: 4, airQuality: 95, greenery: 90 },
  { id: 9, name: "Neukölln", path: "M 440,420 L 480,400 L 520,450 L 500,520 L 440,540 Z", priceLevel: 3, airQuality: 70, greenery: 50 },
  { id: 10, name: "Lichtenberg", path: "M 520,380 L 580,360 L 620,400 L 600,460 L 540,450 L 520,450 Z", priceLevel: 3, airQuality: 78, greenery: 60 },
  
  // Outer districts (lower prices - blue/cyan)
  { id: 11, name: "Pankow", path: "M 520,260 L 600,220 L 640,260 L 620,320 L 560,300 L 540,300 Z", priceLevel: 2, airQuality: 93, greenery: 88 },
  { id: 12, name: "Reinickendorf", path: "M 350,180 L 450,160 L 520,200 L 520,260 L 450,280 L 380,240 Z", priceLevel: 2, airQuality: 91, greenery: 82 },
  { id: 13, name: "Spandau", path: "M 180,240 L 260,220 L 320,260 L 300,320 L 220,320 L 180,280 Z", priceLevel: 1, airQuality: 94, greenery: 95 },
  { id: 14, name: "Steglitz", path: "M 280,400 L 340,420 L 340,540 L 280,560 L 220,520 L 240,450 Z", priceLevel: 2, airQuality: 89, greenery: 78 },
  { id: 15, name: "Marzahn", path: "M 620,320 L 700,300 L 740,360 L 720,420 L 660,440 L 620,400 Z", priceLevel: 1, airQuality: 85, greenery: 72 },
  { id: 16, name: "Treptow", path: "M 500,520 L 540,540 L 560,600 L 500,620 L 440,600 L 440,540 Z", priceLevel: 2, airQuality: 87, greenery: 80 },
];

// Price variations by year (2020-2024)
const priceByYear: Record<number, Record<number, number>> = {
  2020: { 1: 5, 2: 4, 3: 4, 4: 5, 5: 4, 6: 4, 7: 3, 8: 3, 9: 2, 10: 2, 11: 2, 12: 2, 13: 1, 14: 2, 15: 1, 16: 2 },
  2021: { 1: 6, 2: 5, 3: 5, 4: 5, 5: 4, 6: 5, 7: 3, 8: 3, 9: 2, 10: 3, 11: 2, 12: 2, 13: 1, 14: 2, 15: 1, 16: 2 },
  2022: { 1: 6, 2: 6, 3: 6, 4: 6, 5: 5, 6: 5, 7: 4, 8: 4, 9: 3, 10: 3, 11: 2, 12: 2, 13: 1, 14: 2, 15: 1, 16: 2 },
  2023: { 1: 7, 2: 6, 3: 6, 4: 6, 5: 5, 6: 5, 7: 4, 8: 4, 9: 3, 10: 3, 11: 2, 12: 2, 13: 1, 14: 2, 15: 1, 16: 2 },
  2024: { 1: 7, 2: 6, 3: 6, 4: 6, 5: 5, 6: 5, 7: 4, 8: 4, 9: 3, 10: 3, 11: 2, 12: 2, 13: 1, 14: 2, 15: 1, 16: 2 },
};

export function DistrictHeatmap({
  className,
  districts,
  cityName = "Berlin",
  selectedYear = 2024,
  selectedEvent = null,
  highlightedDistricts = [],
  showAirQuality = false,
  showGreenery = false,
  onDistrictClick,
}: DistrictHeatmapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  
  console.log('DistrictHeatmap rendering:', { 
    districts: districts?.length, 
    cityName, 
    selectedYear,
    selectedEvent,
    highlightedDistricts,
    showAirQuality,
    showGreenery
  });

  // Use provided districts or default Berlin shapes
  const displayDistricts = berlinDistricts.map((shape) => {
    const yearPrices = priceByYear[selectedYear] || priceByYear[2024];
    return {
      ...shape,
      priceLevel: yearPrices[shape.id] || shape.priceLevel,
    };
  });

  // Color scale from blue (cheap) to red (expensive)
  const getPriceColor = (level: number = 3) => {
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

  // Get air quality color (green = good, red = bad)
  const getAirQualityColor = (quality: number) => {
    if (quality >= 90) return "#22c55e"; // Excellent - green
    if (quality >= 80) return "#84cc16"; // Good - lime
    if (quality >= 70) return "#eab308"; // Moderate - yellow
    return "#ef4444"; // Poor - red
  };

  // Get greenery color (more green = more parks)
  const getGreeneryColor = (greenery: number) => {
    if (greenery >= 85) return "#10b981"; // Very high - emerald
    if (greenery >= 70) return "#22c55e"; // High - green
    if (greenery >= 55) return "#84cc16"; // Medium - lime
    return "#eab308"; // Low - yellow
  };

  const getDistrictColor = (district: typeof berlinDistricts[0]) => {
    if (showAirQuality) return getAirQualityColor(district.airQuality);
    if (showGreenery) return getGreeneryColor(district.greenery);
    return getPriceColor(district.priceLevel);
  };

  const handleDistrictClick = (districtId: number) => {
    setSelectedDistrict(districtId === selectedDistrict ? null : districtId);
    if (onDistrictClick) {
      onDistrictClick(districtId);
    }
  };

  return (
    <div className={cn("relative w-full h-full bg-slate-950 rounded-lg overflow-hidden", className)}>
      <svg
        viewBox="0 0 800 700"
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      >
        {/* District polygons */}
        {displayDistricts.map((district) => {
          const isHighlighted = highlightedDistricts.includes(district.id);
          const isHovered = hoveredDistrict === district.id;
          const isSelected = selectedDistrict === district.id;
          
          return (
            <g key={district.id}>
              <path
                d={district.path}
                fill={getDistrictColor(district)}
                fillOpacity={isHighlighted ? 1 : isHovered ? 0.9 : 0.7}
                stroke={isHighlighted ? "#fbbf24" : isSelected ? "#3b82f6" : "#1e293b"}
                strokeWidth={isHighlighted ? "4" : isSelected ? "3" : "2"}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredDistrict(district.id)}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => handleDistrictClick(district.id)}
                style={{
                  filter: isHighlighted ? "drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))" : "none",
                }}
              />
              
              {/* District labels */}
              <text
                x={getDistrictCenter(district.path).x}
                y={getDistrictCenter(district.path).y}
                textAnchor="middle"
                className="text-[10px] font-semibold fill-white pointer-events-none"
                style={{
                  textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                  fontSize: isHovered || isHighlighted ? "12px" : "10px",
                  fontWeight: isHighlighted ? "bold" : "normal",
                }}
              >
                {district.name}
              </text>

              {/* Event impact indicator */}
              {isHighlighted && selectedEvent !== null && (
                <circle
                  cx={getDistrictCenter(district.path).x}
                  cy={getDistrictCenter(district.path).y - 20}
                  r="8"
                  fill="#fbbf24"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredDistrict && (
        <div className="absolute top-4 left-4 bg-slate-900/95 p-3 rounded-lg border border-slate-700 pointer-events-none z-10">
          <p className="text-sm font-bold text-white">
            {displayDistricts.find(d => d.id === hoveredDistrict)?.name}
          </p>
          <div className="text-xs text-slate-400 mt-1 space-y-1">
            {!showAirQuality && !showGreenery && (
              <>
                <p>Price Level: {displayDistricts.find(d => d.id === hoveredDistrict)?.priceLevel}/7</p>
                <p>Year: {selectedYear}</p>
              </>
            )}
            {showAirQuality && (
              <p>Air Quality: {berlinDistricts.find(d => d.id === hoveredDistrict)?.airQuality}/100</p>
            )}
            {showGreenery && (
              <p>Greenery: {berlinDistricts.find(d => d.id === hoveredDistrict)?.greenery}%</p>
            )}
          </div>
        </div>
      )}

      {/* Selected district info */}
      {selectedDistrict && (
        <div className="absolute bottom-4 left-4 bg-slate-900/95 p-4 rounded-lg border border-slate-700 max-w-xs z-10">
          <p className="text-sm font-bold text-white mb-2">
            {displayDistricts.find(d => d.id === selectedDistrict)?.name}
          </p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>Avg Price: €{(displayDistricts.find(d => d.id === selectedDistrict)?.priceLevel || 3) * 1000}/m²</p>
            <p>Price Level: {displayDistricts.find(d => d.id === selectedDistrict)?.priceLevel}/7</p>
            <p>Air Quality: {berlinDistricts.find(d => d.id === selectedDistrict)?.airQuality}/100</p>
            <p>Greenery: {berlinDistricts.find(d => d.id === selectedDistrict)?.greenery}%</p>
            <p className="text-cyan-400 mt-2">Year: {selectedYear}</p>
          </div>
          <button
            onClick={() => setSelectedDistrict(null)}
            className="mt-2 text-xs text-cyan-400 hover:text-cyan-300"
          >
            Close
          </button>
        </div>
      )}

      {/* Event impact overlay */}
      {selectedEvent !== null && highlightedDistricts.length > 0 && (
        <div className="absolute top-4 right-4 bg-amber-900/95 p-3 rounded-lg border border-amber-600 z-10">
          <p className="text-sm font-bold text-amber-100">Event Impact</p>
          <p className="text-xs text-amber-200 mt-1">
            {highlightedDistricts.length} districts affected
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-900/95 p-3 rounded-lg border border-slate-700 z-10">
        <p className="text-xs text-slate-300 mb-2 font-semibold">
          {showAirQuality ? "Air Quality" : showGreenery ? "Greenery" : "Prices"}
        </p>
        <div className="flex items-center gap-1">
          <div className="w-24 h-3 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-600 rounded"></div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>{showAirQuality ? "Poor" : showGreenery ? "Low" : "Low"}</span>
          <span>{showAirQuality ? "Excellent" : showGreenery ? "High" : "High"}</span>
        </div>
      </div>
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
