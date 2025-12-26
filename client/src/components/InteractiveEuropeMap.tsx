import { useLocation } from "wouter";
import { useState } from "react";

// City coordinates on the SVG map (percentage positions)
const cityCoordinates: Record<string, { x: number; y: number; country: string; population: number; immigrationGrowth: number }> = {
  // Germany
  "Berlin": { x: 52, y: 35, country: "Germany", population: 3850000, immigrationGrowth: 52 },
  "Munich": { x: 48, y: 48, country: "Germany", population: 1560000, immigrationGrowth: 48 },
  "Hamburg": { x: 47, y: 28, country: "Germany", population: 1900000, immigrationGrowth: 45 },
  "Frankfurt": { x: 44, y: 42, country: "Germany", population: 760000, immigrationGrowth: 50 },
  "Cologne": { x: 40, y: 40, country: "Germany", population: 1090000, immigrationGrowth: 47 },
  
  // France
  "Paris": { x: 28, y: 45, country: "France", population: 2160000, immigrationGrowth: 55 },
  "Lyon": { x: 32, y: 52, country: "France", population: 520000, immigrationGrowth: 49 },
  "Marseille": { x: 33, y: 60, country: "France", population: 870000, immigrationGrowth: 58 },
  "Toulouse": { x: 22, y: 58, country: "France", population: 480000, immigrationGrowth: 51 },
  "Nice": { x: 38, y: 62, country: "France", population: 340000, immigrationGrowth: 53 },
  
  // UK
  "London": { x: 18, y: 38, country: "United Kingdom", population: 9000000, immigrationGrowth: 62 },
  "Manchester": { x: 15, y: 32, country: "United Kingdom", population: 550000, immigrationGrowth: 54 },
  "Birmingham": { x: 16, y: 36, country: "United Kingdom", population: 1140000, immigrationGrowth: 56 },
  
  // USA (off-map, shown as markers on the side)
  "New York": { x: 5, y: 40, country: "United States", population: 8340000, immigrationGrowth: 48 },
  "Los Angeles": { x: 5, y: 50, country: "United States", population: 3970000, immigrationGrowth: 45 },
};

interface InteractiveEuropeMapProps {
  cities: any[];
  userCountry: string | null;
}

export default function InteractiveEuropeMap({ cities, userCountry }: InteractiveEuropeMapProps) {
  const [, setLocation] = useLocation();
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const handleCityClick = (cityName: string) => {
    setLocation(`/city/${cityName}`);
  };

  const isUserCountryCity = (cityName: string) => {
    const coords = cityCoordinates[cityName];
    if (!coords || !userCountry) return false;
    
    return (
      (userCountry === 'Germany' && coords.country === 'Germany') ||
      (userCountry === 'France' && coords.country === 'France') ||
      ((userCountry === 'United Kingdom' || userCountry === 'UK') && coords.country === 'United Kingdom') ||
      ((userCountry === 'United States' || userCountry === 'USA') && coords.country === 'United States')
    );
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Custom SVG Map */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-auto rounded-lg shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ocean/Background */}
        <rect width="800" height="600" fill="#e0f2fe" />
        
        {/* UK */}
        <path
          d="M 100 200 L 140 190 L 150 220 L 160 240 L 140 260 L 120 250 L 100 230 Z"
          fill="#dbeafe"
          stroke="#3b82f6"
          strokeWidth="2"
          className="hover:fill-blue-100 transition-colors"
        />
        
        {/* France */}
        <path
          d="M 150 260 L 180 250 L 220 280 L 240 320 L 260 360 L 240 380 L 200 370 L 170 340 L 160 300 Z"
          fill="#fef3c7"
          stroke="#f59e0b"
          strokeWidth="2"
          className="hover:fill-yellow-100 transition-colors"
        />
        
        {/* Germany */}
        <path
          d="M 300 180 L 360 170 L 400 200 L 420 240 L 410 280 L 380 290 L 340 280 L 320 250 L 310 210 Z"
          fill="#fee2e2"
          stroke="#ef4444"
          strokeWidth="2"
          className="hover:fill-red-100 transition-colors"
        />
        
        {/* Spain */}
        <path
          d="M 80 380 L 140 370 L 180 400 L 200 440 L 180 480 L 140 470 L 100 450 L 80 420 Z"
          fill="#fef9c3"
          stroke="#eab308"
          strokeWidth="2"
          className="hover:fill-yellow-50 transition-colors"
        />
        
        {/* Italy */}
        <path
          d="M 280 320 L 300 340 L 310 380 L 320 420 L 310 460 L 290 480 L 280 450 L 270 410 L 275 370 Z"
          fill="#dcfce7"
          stroke="#22c55e"
          strokeWidth="2"
          className="hover:fill-green-100 transition-colors"
        />
        
        {/* Poland */}
        <path
          d="M 420 160 L 480 150 L 500 180 L 490 220 L 460 230 L 430 210 Z"
          fill="#f3e8ff"
          stroke="#a855f7"
          strokeWidth="2"
          className="hover:fill-purple-100 transition-colors"
        />
        
        {/* Scandinavia (simplified) */}
        <path
          d="M 280 60 L 340 50 L 380 80 L 400 120 L 380 150 L 340 140 L 300 120 L 280 90 Z"
          fill="#e0e7ff"
          stroke="#6366f1"
          strokeWidth="2"
          className="hover:fill-indigo-100 transition-colors"
        />
        
        {/* City Markers */}
        {cities.map((city) => {
          const coords = cityCoordinates[city.name];
          if (!coords) return null;
          
          const isUserCity = isUserCountryCity(city.name);
          const x = (coords.x / 100) * 800;
          const y = (coords.y / 100) * 600;
          
          return (
            <g 
              key={city.id}
              onClick={() => handleCityClick(city.name)}
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulsing circle animation */}
              <circle
                cx={x}
                cy={y}
                r={isUserCity ? "16" : "12"}
                fill={isUserCity ? "#06b6d4" : "#3b82f6"}
                opacity="0.3"
                className="animate-ping pointer-events-none"
              />
              
              {/* Main marker */}
              <circle
                cx={x}
                cy={y}
                r={isUserCity ? "10" : "8"}
                fill={isUserCity ? "#06b6d4" : "#3b82f6"}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-all"
              />
            </g>
          );
        })}
      </svg>
      
      {/* Tooltip */}
      {hoveredCity && cityCoordinates[hoveredCity] && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-10">
          <div className="space-y-1">
            <h3 className="font-bold text-lg">{hoveredCity}</h3>
            <p className="text-sm text-gray-600">{cityCoordinates[hoveredCity].country}</p>
            <p className="text-sm">
              Population: <span className="font-semibold">{(cityCoordinates[hoveredCity].population / 1000000).toFixed(1)}M</span>
            </p>
            <p className="text-sm">
              Immigration Growth: <span className="font-semibold text-red-600">+{cityCoordinates[hoveredCity].immigrationGrowth}%</span>
            </p>
            <p className="text-xs text-cyan-600 mt-2">Click to explore →</p>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500 animate-ping opacity-75"></div>
            <span>Your Country</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping opacity-50"></div>
            <span>Other Cities</span>
          </div>
        </div>
      </div>
    </div>
  );
}
