import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, X, Layers, TrendingUp, Users, Building, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { scaleSequential } from "d3-scale";
import { interpolateRdYlGn } from "d3-scale-chromatic";

// Mapbox public token from environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

// Create color scale for property prices (inverted: green=low, red=high)
const createPriceColorScale = (minPrice: number, maxPrice: number) => {
  return scaleSequential(interpolateRdYlGn)
    .domain([maxPrice, minPrice]); // Inverted so green is low, red is high
};

// Create color scale for population density
const createDensityColorScale = (minDensity: number, maxDensity: number) => {
  return scaleSequential(interpolateRdYlGn)
    .domain([maxDensity, minDensity]);
};

// Community colors
const communityColors: Record<string, string> = {
  Turkish: "#3b82f6", // blue
  Polish: "#10b981", // green
  Syrian: "#f59e0b", // amber
  Russian: "#8b5cf6", // purple
  Vietnamese: "#ec4899", // pink
  Italian: "#06b6d4", // cyan
  Arabic: "#ef4444", // red
  Ukrainian: "#84cc16", // lime
};

// Infrastructure type icons and colors
const infrastructureConfig = {
  mosque: { emoji: "🕌", color: "#3b82f6" },
  church: { emoji: "⛪", color: "#10b981" },
  synagogue: { emoji: "🕍", color: "#f59e0b" },
  cultural_center: { emoji: "🏛️", color: "#8b5cf6" },
  ethnic_store: { emoji: "🏪", color: "#ec4899" },
};

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const geojsonCache = useRef<any>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [activeLayer, setActiveLayer] = useState<"none" | "prices" | "demographics">("none");
  const [filters, setFilters] = useState({
    mosques: true,
    churches: true,
    synagogues: true,
    culturalCenters: true,
    ethnicStores: true,
  });
  
  const { data: districtMapData } = trpc.heatMap.districtData.useQuery({ city: "Berlin" });
  const { data: infrastructure } = trpc.infrastructure.all.useQuery();
  const { data: propertyPricesData } = trpc.heatMap.propertyPricesByYear.useQuery({ 
    city: "Berlin", 
    year: selectedYear 
  });
  const { data: demographicsData } = trpc.heatMap.demographicsByYear.useQuery({ 
    city: "Berlin", 
    year: selectedYear 
  });
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [13.405, 52.52], // Berlin center
      zoom: 10,
    });
    
    map.current.on("load", async () => {
      if (!map.current) return;
      
      try {
        // Load district boundaries GeoJSON
        const response = await fetch("/berlin_districts.geojson");
        const geojson = await response.json();
        
        // Add district boundaries source
        map.current.addSource("districts", {
          type: "geojson",
          data: geojson,
        });
        
        // Add district fill layer (base layer)
        map.current.addLayer({
          id: "districts-fill",
          type: "fill",
          source: "districts",
          paint: {
            "fill-color": "#374151",
            "fill-opacity": 0.3,
          },
        });
        
        // Add district outline layer
        map.current.addLayer({
          id: "districts-outline",
          type: "line",
          source: "districts",
          paint: {
            "line-color": "#ffffff",
            "line-width": 2,
          },
        });
        
        // Add hover effect
        map.current.on("mousemove", "districts-fill", (e) => {
          if (!map.current) return;
          map.current.getCanvas().style.cursor = "pointer";
          
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const districtName = feature.properties?.nameEn || feature.properties?.name;
            
            // Find district data
            const district = districtMapData?.find(d => d.nameEn === districtName);
            
            if (district) {
              const popup = new mapboxgl.Popup({ closeButton: false, offset: 15 })
                .setLngLat(e.lngLat)
                .setHTML(`
                  <div style="padding: 8px;">
                    <h3 style="font-weight: bold; margin-bottom: 4px;">${district.nameEn}</h3>
                    <p style="font-size: 12px;">Population: ${district.population.toLocaleString()}</p>
                    ${district.averagePricePerSqm ? `<p style="font-size: 12px;">Avg Price: €${district.averagePricePerSqm}/m²</p>` : ''}
                  </div>
                `)
                .addTo(map.current);
              
              map.current.once("mouseleave", "districts-fill", () => {
                popup.remove();
              });
            }
          }
        });
        
        map.current.on("mouseleave", "districts-fill", () => {
          if (!map.current) return;
          map.current.getCanvas().style.cursor = "";
        });
        
        // Add click handler for districts
        map.current.on("click", "districts-fill", (e) => {
          if (!e.features || e.features.length === 0) return;
          const districtName = e.features[0].properties?.nameEn || e.features[0].properties?.name;
          const district = districtMapData?.find(d => d.nameEn === districtName);
          if (district) {
            setSelectedDistrictId(district.id);
          }
        });
      } catch (error) {
        console.error("Error loading district boundaries:", error);
      }
    });
    
    return () => {
      map.current?.remove();
    };
  }, []);
  
  // Update layer visualization based on active layer
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    
    const updateLayer = async () => {
      if (!map.current) return;
      
      try {
        // Load GeoJSON only once and cache it
        if (!geojsonCache.current) {
          const response = await fetch("/berlin_districts.geojson");
          geojsonCache.current = await response.json();
        }
        
        const geojson = geojsonCache.current;
        
        if (activeLayer === "prices" && propertyPricesData) {
          // Create price map
          const priceMap: Record<string, number> = {};
          propertyPricesData.forEach(p => {
            if (p.averagePricePerSqm) {
              priceMap[p.districtName] = p.averagePricePerSqm;
            }
          });
          
          const prices = Object.values(priceMap);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const colorScale = createPriceColorScale(minPrice, maxPrice);
          
          // Build expression for fill-color
          const colorExpression: any = ["match", ["get", "nameEn"]];
          
          geojson.features.forEach((feature: any) => {
            const districtName = feature.properties.nameEn;
            const price = priceMap[districtName];
            if (price) {
              colorExpression.push(districtName, colorScale(price));
            }
          });
          
          colorExpression.push("#374151"); // default color
          
          map.current.setPaintProperty("districts-fill", "fill-color", colorExpression);
          map.current.setPaintProperty("districts-fill", "fill-opacity", 0.7);
          
        } else if (activeLayer === "demographics" && demographicsData) {
          // Create density map
          const densityMap: Record<string, number> = {};
          demographicsData.forEach(d => {
            if (d.populationDensity) {
              densityMap[d.districtName] = d.populationDensity;
            }
          });
          
          const densities = Object.values(densityMap);
          const minDensity = Math.min(...densities);
          const maxDensity = Math.max(...densities);
          const colorScale = createDensityColorScale(minDensity, maxDensity);
          
          // Build expression for fill-color
          const colorExpression: any = ["match", ["get", "nameEn"]];
          
          geojson.features.forEach((feature: any) => {
            const districtName = feature.properties.nameEn;
            const density = densityMap[districtName];
            if (density) {
              colorExpression.push(districtName, colorScale(density));
            }
          });
          
          colorExpression.push("#374151"); // default color
          
          map.current.setPaintProperty("districts-fill", "fill-color", colorExpression);
          map.current.setPaintProperty("districts-fill", "fill-opacity", 0.7);
          
        } else {
          // Reset to default
          map.current.setPaintProperty("districts-fill", "fill-color", "#374151");
          map.current.setPaintProperty("districts-fill", "fill-opacity", 0.3);
        }
      } catch (error) {
        console.error("Error updating layer:", error);
      }
    };
    
    updateLayer();
  }, [activeLayer, propertyPricesData, demographicsData, districtMapData]);
  
  // Add infrastructure markers
  useEffect(() => {
    if (!map.current || !infrastructure) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Wait for map to load
    if (!map.current.isStyleLoaded()) {
      map.current.on("load", addMarkers);
    } else {
      addMarkers();
    }
    
    function addMarkers() {
      if (!map.current || !infrastructure) return;
      
      infrastructure.forEach((item) => {
        // Apply filters
        if (item.type === 'mosque' && !filters.mosques) return;
        if (item.type === 'church' && !filters.churches) return;
        if (item.type === 'synagogue' && !filters.synagogues) return;
        if (item.type === 'cultural_center' && !filters.culturalCenters) return;
        if (item.type === 'ethnic_store' && !filters.ethnicStores) return;
        if (!item.latitude || !item.longitude) return;
        
        const lat = parseFloat(item.latitude);
        const lng = parseFloat(item.longitude);
        
        if (isNaN(lat) || isNaN(lng)) return;
        
        const config = infrastructureConfig[item.type];
        
        // Create marker element
        const el = document.createElement("div");
        el.className = "infrastructure-marker";
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.fontSize = "24px";
        el.style.cursor = "pointer";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.textContent = config?.emoji || "📍";
        
        // Add popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px; min-width: 150px;">
            <div style="font-size: 24px; text-align: center; margin-bottom: 4px;">${config?.emoji || "📍"}</div>
            <h3 style="font-weight: bold; margin-bottom: 4px;">${item.name}</h3>
            <p style="font-size: 12px; color: #9ca3af;">${item.type.replace("_", " ")}</p>
            <p style="font-size: 12px; margin-top: 4px;">${item.community}</p>
            ${item.address ? `<p style="font-size: 11px; margin-top: 4px; color: #6b7280;">${item.address}</p>` : ''}
          </div>
        `);
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map.current!);
        
        markers.current.push(marker);
      });
    }
  }, [infrastructure, filters]);
  
  const selectedDistrict = districtMapData?.find(d => d.id === selectedDistrictId);
  
  // Get price range for legend
  const priceRange = propertyPricesData ? {
    min: Math.min(...propertyPricesData.filter(p => p.averagePricePerSqm).map(p => p.averagePricePerSqm!)),
    max: Math.max(...propertyPricesData.filter(p => p.averagePricePerSqm).map(p => p.averagePricePerSqm!)),
  } : null;
  
  // Get density range for legend
  const densityRange = demographicsData ? {
    min: Math.min(...demographicsData.map(d => d.populationDensity)),
    max: Math.max(...demographicsData.map(d => d.populationDensity)),
  } : null;
  
  return (
    <div className="relative w-full h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Berlin Interactive Heat Map</h1>
              <p className="text-sm text-muted-foreground">
                Explore districts, property prices, demographics & infrastructure
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Layer Controls */}
      <Card className="absolute top-24 left-6 z-10 bg-card/95 backdrop-blur-sm w-72">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="w-4 h-4" />
            Map Layers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="layer-none"
                name="layer"
                checked={activeLayer === "none"}
                onChange={() => setActiveLayer("none")}
                className="w-4 h-4"
              />
              <Label htmlFor="layer-none" className="cursor-pointer">Districts Only</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="layer-prices"
                name="layer"
                checked={activeLayer === "prices"}
                onChange={() => setActiveLayer("prices")}
                className="w-4 h-4"
              />
              <Label htmlFor="layer-prices" className="cursor-pointer flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Property Prices Heat Map
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="layer-demographics"
                name="layer"
                checked={activeLayer === "demographics"}
                onChange={() => setActiveLayer("demographics")}
                className="w-4 h-4"
              />
              <Label htmlFor="layer-demographics" className="cursor-pointer flex items-center gap-2">
                <Users className="w-4 h-4" />
                Population Density
              </Label>
            </div>
          </div>
          
          <div className="pt-3 border-t border-border">
            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
              <Building className="w-4 h-4" />
              Infrastructure Filters
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="mosques"
                  checked={filters.mosques}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, mosques: checked as boolean }))}
                />
                <span className="text-xl">🕌</span>
                <Label htmlFor="mosques" className="text-sm cursor-pointer">Mosques</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="churches"
                  checked={filters.churches}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, churches: checked as boolean }))}
                />
                <span className="text-xl">⛪</span>
                <Label htmlFor="churches" className="text-sm cursor-pointer">Churches</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="synagogues"
                  checked={filters.synagogues}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, synagogues: checked as boolean }))}
                />
                <span className="text-xl">🕍</span>
                <Label htmlFor="synagogues" className="text-sm cursor-pointer">Synagogues</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="culturalCenters"
                  checked={filters.culturalCenters}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, culturalCenters: checked as boolean }))}
                />
                <span className="text-xl">🏛️</span>
                <Label htmlFor="culturalCenters" className="text-sm cursor-pointer">Cultural Centers</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="ethnicStores"
                  checked={filters.ethnicStores}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, ethnicStores: checked as boolean }))}
                />
                <span className="text-xl">🏪</span>
                <Label htmlFor="ethnicStores" className="text-sm cursor-pointer">Ethnic Stores</Label>
              </div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-border">
            <Label className="text-sm font-semibold mb-2 block">Year: {selectedYear}</Label>
            <Slider
              value={[selectedYear]}
              onValueChange={(value) => setSelectedYear(value[0])}
              min={2020}
              max={2024}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>2020</span>
              <span>2024</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Legend */}
      {activeLayer !== "none" && (
        <Card className="absolute bottom-6 left-6 z-10 bg-card/95 backdrop-blur-sm w-72">
          <CardContent className="pt-4">
            {activeLayer === "prices" && priceRange && (
              <>
                <h3 className="font-semibold mb-3 text-sm">Property Prices per m²</h3>
                <div className="space-y-2">
                  <div className="h-8 rounded" style={{
                    background: `linear-gradient(to right, ${createPriceColorScale(priceRange.min, priceRange.max)(priceRange.min)}, ${createPriceColorScale(priceRange.min, priceRange.max)((priceRange.min + priceRange.max) / 2)}, ${createPriceColorScale(priceRange.min, priceRange.max)(priceRange.max)})`
                  }} />
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">€{priceRange.min.toLocaleString()}</span>
                    <span className="text-yellow-600">€{Math.round((priceRange.min + priceRange.max) / 2).toLocaleString()}</span>
                    <span className="text-red-600">€{priceRange.max.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </>
            )}
            
            {activeLayer === "demographics" && densityRange && (
              <>
                <h3 className="font-semibold mb-3 text-sm">Population Density (per km²)</h3>
                <div className="space-y-2">
                  <div className="h-8 rounded" style={{
                    background: `linear-gradient(to right, ${createDensityColorScale(densityRange.min, densityRange.max)(densityRange.min)}, ${createDensityColorScale(densityRange.min, densityRange.max)((densityRange.min + densityRange.max) / 2)}, ${createDensityColorScale(densityRange.min, densityRange.max)(densityRange.max)})`
                  }} />
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">{densityRange.min.toLocaleString()}</span>
                    <span className="text-yellow-600">{Math.round((densityRange.min + densityRange.max) / 2).toLocaleString()}</span>
                    <span className="text-red-600">{densityRange.max.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* District Info Panel */}
      {selectedDistrict && (
        <Card className="absolute top-24 right-6 z-10 w-80 max-h-[calc(100vh-8rem)] overflow-y-auto bg-card/95 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedDistrict.nameEn}</h3>
                <p className="text-sm text-muted-foreground">District Information</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDistrictId(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Population</p>
                <p className="text-lg font-semibold">{selectedDistrict.population.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="text-lg font-semibold">{selectedDistrict.area} km²</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Population Density</p>
                <p className="text-lg font-semibold">
                  {Math.round(selectedDistrict.population / selectedDistrict.area).toLocaleString()} per km²
                </p>
              </div>
              {selectedDistrict.averagePricePerSqm && (
                <div>
                  <p className="text-sm text-muted-foreground">Average Property Price</p>
                  <p className="text-lg font-semibold">€{selectedDistrict.averagePricePerSqm.toLocaleString()}/m²</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Foreign Residents</p>
                <p className="text-lg font-semibold">{selectedDistrict.foreignerPercentage}%</p>
              </div>
              
              {selectedDistrict.topCommunities && selectedDistrict.topCommunities.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Top Communities</p>
                  <div className="space-y-2">
                    {selectedDistrict.topCommunities.map((community, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: communityColors[community.community] || "#6b7280" }}
                          />
                          <span className="text-sm">{community.community}</span>
                        </div>
                        <span className="text-sm font-medium">{community.population.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {infrastructure && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Infrastructure Count</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries({
                      mosque: infrastructure.filter(i => i.districtId === selectedDistrict.id && i.type === 'mosque').length,
                      church: infrastructure.filter(i => i.districtId === selectedDistrict.id && i.type === 'church').length,
                      synagogue: infrastructure.filter(i => i.districtId === selectedDistrict.id && i.type === 'synagogue').length,
                      cultural_center: infrastructure.filter(i => i.districtId === selectedDistrict.id && i.type === 'cultural_center').length,
                    }).map(([type, count]) => (
                      <div key={type} className="flex items-center gap-1 text-sm">
                        <span>{infrastructureConfig[type as keyof typeof infrastructureConfig]?.emoji}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link href={`/district/${selectedDistrict.id}`}>
              <Button className="w-full mt-4">
                <MapPin className="w-4 h-4 mr-2" />
                View Full Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
