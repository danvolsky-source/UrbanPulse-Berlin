import { useLocation } from "wouter";

// City coordinates on the map (percentage positions)
const cityCoordinates: Record<string, { x: number; y: number; country: string }> = {
  // Germany
  "Berlin": { x: 52, y: 38, country: "Germany" },
  "Munich": { x: 48, y: 48, country: "Germany" },
  "Hamburg": { x: 47, y: 32, country: "Germany" },
  "Frankfurt": { x: 45, y: 42, country: "Germany" },
  "Cologne": { x: 43, y: 40, country: "Germany" },
  
  // France
  "Paris": { x: 35, y: 48, country: "France" },
  "Lyon": { x: 38, y: 54, country: "France" },
  "Marseille": { x: 38, y: 60, country: "France" },
  "Toulouse": { x: 32, y: 60, country: "France" },
  "Nice": { x: 42, y: 62, country: "France" },
  
  // UK
  "London": { x: 28, y: 40, country: "United Kingdom" },
  "Manchester": { x: 26, y: 34, country: "United Kingdom" },
  "Birmingham": { x: 27, y: 38, country: "United Kingdom" },
  
  // USA (not on Europe map, show in corner)
  "New York": { x: 10, y: 10, country: "United States" },
  "Los Angeles": { x: 10, y: 15, country: "United States" },
};

interface InteractiveEuropeMapProps {
  cities: any[];
  userCountry: string | null;
}

export default function InteractiveEuropeMap({ cities, userCountry }: InteractiveEuropeMapProps) {
  const [, setLocation] = useLocation();

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
      {/* Map Background */}
      <img 
        src="/europe-map.jpg" 
        alt="Europe Map" 
        className="w-full h-auto rounded-lg shadow-2xl"
      />
      
      {/* City Markers */}
      {cities.map((city) => {
        const coords = cityCoordinates[city.name];
        if (!coords) return null;
        
        const isUserCity = isUserCountryCity(city.name);
        
        return (
          <div
            key={city.id}
            className="absolute group cursor-pointer"
            style={{
              left: `${coords.x}%`,
              top: `${coords.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => handleCityClick(city.name)}
          >
            {/* Pulsing Circle */}
            <div className="relative">
              {/* Outer pulse ring */}
              <div 
                className={`absolute inset-0 rounded-full animate-ping ${
                  isUserCity 
                    ? 'bg-cyan-400 opacity-75' 
                    : 'bg-blue-400 opacity-50'
                }`}
                style={{
                  width: isUserCity ? '32px' : '24px',
                  height: isUserCity ? '32px' : '24px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              
              {/* Inner solid circle */}
              <div 
                className={`relative rounded-full ${
                  isUserCity 
                    ? 'bg-cyan-500 w-6 h-6' 
                    : 'bg-blue-500 w-4 h-4'
                } shadow-lg hover:scale-125 transition-transform`}
              />
            </div>
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-slate-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                <div className="font-bold text-cyan-400">{city.name}</div>
                <div className="text-xs text-slate-300">{city.country}</div>
                <div className="text-xs text-slate-400">
                  {city.population.toLocaleString()} people
                </div>
                <div className="text-xs text-cyan-400 mt-1">Click to explore →</div>
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900/95" />
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm p-4 rounded-lg shadow-xl">
        <div className="text-white text-sm font-semibold mb-2">Legend</div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-cyan-500 animate-ping opacity-75" />
          <span className="text-slate-300 text-xs">Your Country</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-ping opacity-50" />
          <span className="text-slate-300 text-xs">Other Cities</span>
        </div>
      </div>
    </div>
  );
}
