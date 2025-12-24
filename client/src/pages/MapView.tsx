import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Mapbox public token (you should replace this with your own token)
mapboxgl.accessToken = "pk.eyJ1IjoibWFudXNhaS1kZW1vIiwiYSI6ImNtNTNzYnZvZjA0cGMya3M3N2RxNGl1OGQifQ.6Uw8vZxQzXqQzQqQzQqQzQ";

// Berlin districts GeoJSON (simplified boundaries)
const berlinDistrictsGeoJSON = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { id: 1, name: "Mitte", dominantCommunity: "Turkish" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[13.35, 52.53], [13.42, 52.53], [13.42, 52.50], [13.35, 52.50], [13.35, 52.53]]],
      },
    },
    {
      type: "Feature" as const,
      properties: { id: 2, name: "Friedrichshain-Kreuzberg", dominantCommunity: "Turkish" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[13.42, 52.52], [13.48, 52.52], [13.48, 52.48], [13.42, 52.48], [13.42, 52.52]]],
      },
    },
    {
      type: "Feature" as const,
      properties: { id: 3, name: "Pankow", dominantCommunity: "Polish" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[13.35, 52.58], [13.45, 52.58], [13.45, 52.53], [13.35, 52.53], [13.35, 52.58]]],
      },
    },
    {
      type: "Feature" as const,
      properties: { id: 4, name: "Charlottenburg-Wilmersdorf", dominantCommunity: "Polish" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[13.25, 52.53], [13.35, 52.53], [13.35, 52.48], [13.25, 52.48], [13.25, 52.53]]],
      },
    },
    {
      type: "Feature" as const,
      properties: { id: 8, name: "Neukölln", dominantCommunity: "Turkish" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[[13.42, 52.48], [13.50, 52.48], [13.50, 52.43], [13.42, 52.43], [13.42, 52.48]]],
      },
    },
  ],
};

// Community colors
const communityColors: Record<string, string> = {
  Turkish: "#3b82f6", // blue
  Polish: "#10b981", // green
  Syrian: "#f59e0b", // amber
  Russian: "#8b5cf6", // purple
  Vietnamese: "#ec4899", // pink
  Italian: "#06b6d4", // cyan
};

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [filters, setFilters] = useState({
    mosques: true,
    churches: true,
    synagogues: true,
    culturalCenters: true,
  });
  
  const { data: districts } = trpc.districts.list.useQuery({ city: "Berlin" });
  const { data: infrastructure } = trpc.infrastructure.all.useQuery();
  
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [13.405, 52.52], // Berlin center
      zoom: 10,
    });
    
    map.current.on("load", () => {
      if (!map.current) return;
      
      // Add district boundaries source
      map.current.addSource("districts", {
        type: "geojson",
        data: berlinDistrictsGeoJSON as any,
      });
      
      // Add district fill layer with color based on dominant community
      map.current.addLayer({
        id: "districts-fill",
        type: "fill",
        source: "districts",
        paint: {
          "fill-color": [
            "match",
            ["get", "dominantCommunity"],
            "Turkish", communityColors.Turkish,
            "Polish", communityColors.Polish,
            "Syrian", communityColors.Syrian,
            "Russian", communityColors.Russian,
            "Vietnamese", communityColors.Vietnamese,
            "Italian", communityColors.Italian,
            "#6b7280", // default gray
          ],
          "fill-opacity": 0.5,
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
      });
      
      map.current.on("mouseleave", "districts-fill", () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "";
      });
      
      // Add click handler for districts
      map.current.on("click", "districts-fill", (e) => {
        if (!e.features || e.features.length === 0) return;
        const districtId = e.features[0].properties?.id;
        if (districtId) {
          setSelectedDistrict(districtId);
        }
      });
    });
    
    return () => {
      map.current?.remove();
    };
  }, []);
  
  // Add infrastructure markers
  useEffect(() => {
    if (!map.current || !infrastructure) return;
    
    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.infrastructure-marker');
    existingMarkers.forEach(marker => marker.remove());
    
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
        if (!item.latitude || !item.longitude) return;
        
        const lat = parseFloat(item.latitude);
        const lng = parseFloat(item.longitude);
        
        if (isNaN(lat) || isNaN(lng)) return;
        
        // Create marker element
        const el = document.createElement("div");
        el.className = "infrastructure-marker";
        el.style.width = "24px";
        el.style.height = "24px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.cursor = "pointer";
        
        // Set color based on type
        const colors: Record<string, string> = {
          mosque: "#3b82f6",
          church: "#10b981",
          synagogue: "#f59e0b",
          cultural_center: "#8b5cf6",
          ethnic_store: "#ec4899",
        };
        
        el.style.backgroundColor = colors[item.type] || "#6b7280";
        
        // Add popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${item.name}</h3>
            <p style="font-size: 12px; color: #9ca3af;">${item.type.replace("_", " ")}</p>
            <p style="font-size: 12px; margin-top: 4px;">${item.address || ""}</p>
          </div>
        `);
        
        new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    }
  }, [infrastructure, filters]);
  
  const selectedDistrictData = districts?.find(d => d.id === selectedDistrict);
  
  return (
    <div className="relative w-full h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Berlin Districts Map</h1>
              <p className="text-sm text-muted-foreground">
                Color-coded by dominant community
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
      
      {/* Legend */}
      <Card className="absolute bottom-6 left-6 z-10 bg-card/95 backdrop-blur-sm">
        <CardContent className="pt-4">
          <h3 className="font-semibold mb-3 text-sm">Dominant Communities</h3>
          <div className="space-y-2">
            {Object.entries(communityColors).map(([community, color]) => (
              <div key={community} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm">{community}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="font-semibold mb-3 text-sm">Infrastructure Filters</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="mosques"
                  checked={filters.mosques}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, mosques: checked as boolean }))}
                />
                <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: "#3b82f6" }} />
                <Label htmlFor="mosques" className="text-sm cursor-pointer">Mosques</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="churches"
                  checked={filters.churches}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, churches: checked as boolean }))}
                />
                <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: "#10b981" }} />
                <Label htmlFor="churches" className="text-sm cursor-pointer">Churches</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="synagogues"
                  checked={filters.synagogues}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, synagogues: checked as boolean }))}
                />
                <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: "#f59e0b" }} />
                <Label htmlFor="synagogues" className="text-sm cursor-pointer">Synagogues</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="culturalCenters"
                  checked={filters.culturalCenters}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, culturalCenters: checked as boolean }))}
                />
                <div className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: "#8b5cf6" }} />
                <Label htmlFor="culturalCenters" className="text-sm cursor-pointer">Cultural Centers</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* District Info Panel */}
      {selectedDistrictData && (
        <Card className="absolute top-24 right-6 z-10 w-80 bg-card/95 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedDistrictData.nameEn}</h3>
                <p className="text-sm text-muted-foreground">District Information</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDistrict(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Population</p>
                <p className="text-lg font-semibold">{selectedDistrictData.population.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="text-lg font-semibold">{selectedDistrictData.area} km²</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Foreign Residents</p>
                <p className="text-lg font-semibold">{selectedDistrictData.foreignerPercentage}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dominant Community</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: communityColors[selectedDistrictData.dominantCommunity || ""] || "#6b7280" }}
                  />
                  <p className="text-lg font-semibold">{selectedDistrictData.dominantCommunity}</p>
                </div>
              </div>
            </div>
            
            <Link href={`/district/${selectedDistrictData.id}`}>
              <Button className="w-full mt-4">
                View Full Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
