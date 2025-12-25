import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, DollarSign, Home, Layers, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";
import { MapView } from "@/components/Map";

// Geopolitical events data
const geopoliticalEvents = [
  {
    id: 1,
    title: "EU imposes new sanctions on",
    highlight: "Russia",
    impacts: [
      { label: "19%", trend: "down" },
      { label: "10%", trend: "down" }
    ]
  },
  {
    id: 2,
    title: "USD/EUR exchange rate moved down by",
    highlight: "5",
    impacts: [
      { label: "20%", trend: "down" },
      { label: "10%", trend: "down" }
    ]
  },
  {
    id: 3,
    title: "USD/EUR exchange nowes up up",
    highlight: "1.8%",
    impacts: [
      { label: "20%", trend: "down" },
      { label: "10%", trend: "down" }
    ]
  },
  {
    id: 4,
    title: "Reports on increasing capital migration to",
    highlight: "Germany",
    impacts: [
      { label: "24%", trend: "down" },
      { label: "10%", trend: "down" }
    ]
  },
  {
    id: 5,
    title: "Reduced investment in the euro",
    highlight: "",
    impacts: []
  }
];

export default function CityDetail() {
  const { city } = useParams();
  const cityName = city ? decodeURIComponent(city) : "";
  
  const { data: cityData, isLoading: cityLoading } = trpc.cities.list.useQuery();
  const { data: districtsData, isLoading: districtsLoading } = trpc.districts.list.useQuery({ city: cityName });
  const { data: pricesData } = trpc.propertyPrices.byDistrict.useQuery({ districtId: 1 });
  const { data: ecologyData } = trpc.ecology.getAll.useQuery();
  const { data: vehiclesData } = trpc.vehicles.getAll.useQuery();

  const [mapReady, setMapReady] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatmapLayer, setHeatmapLayer] = useState<google.maps.visualization.HeatmapLayer | null>(null);

  const currentCity = cityData?.find((c: any) => c.name === cityName);
  const cityEcology = ecologyData?.filter((e: any) => e.cityId === currentCity?.id && e.year === 2024)[0];
  const cityVehicles = vehiclesData?.filter((v: any) => v.cityId === currentCity?.id && v.year === 2024)[0];

  // Property price trend data (mock for now)
  const propertyPriceTrend = [
    { month: "Aug 2023", apartment: 4500, house: 5200, land: 3800 },
    { month: "Nov 2023", apartment: 4600, house: 5300, land: 3900 },
    { month: "Feb 2024", apartment: 4700, house: 5400, land: 4000 },
    { month: "May 2024", apartment: 4800, house: 5500, land: 4100 },
    { month: "Aug 2024", apartment: 4900, house: 5600, land: 4200 },
    { month: "Nov 2024", apartment: 5000, house: 5700, land: 4300 },
    { month: "Feb 2025", apartment: 5100, house: 5800, land: 4400 },
    { month: "May 2025", apartment: 5200, house: 5900, land: 4500 },
    { month: "Aug 2025", apartment: 5300, house: 6000, land: 4600 },
  ];

  // Quality and Transport indices (mock)
  const qualityIndex = [
    { month: "Aug 2023", value: 72 },
    { month: "Nov 2023", value: 74 },
    { month: "Feb 2024", value: 73 },
    { month: "May 2024", value: 75 },
    { month: "Aug 2024", value: 76 },
    { month: "Nov 2024", value: 77 },
    { month: "Feb 2025", value: 78 },
    { month: "May 2025", value: 79 },
    { month: "Aug 2025", value: 80 },
  ];

  const transportIndex = [
    { month: "Aug 2023", value: 65 },
    { month: "Nov 2023", value: 66 },
    { month: "Feb 2024", value: 67 },
    { month: "May 2024", value: 68 },
    { month: "Aug 2024", value: 69 },
    { month: "Nov 2024", value: 70 },
    { month: "Feb 2025", value: 71 },
    { month: "May 2025", value: 72 },
    { month: "Aug 2025", value: 73 },
  ];

  // Properties income price (mock donut chart data)
  const incomeData = [
    { name: "Air quality", value: 32, color: "#3b82f6" },
    { name: "Geopolitic", value: 10, color: "#f59e0b" },
    { name: "Ecology", value: 13, color: "#22c55e" },
    { name: "Transport", value: 8, color: "#8b5cf6" },
    { name: "Other", value: 37, color: "#64748b" },
  ];

  // Initialize heatmap when map is ready
  useEffect(() => {
    if (!mapReady || !map || !districtsData || districtsData.length === 0) return;

    // Clear existing heatmap
    if (heatmapLayer) {
      heatmapLayer.setMap(null);
    }

    // Create heatmap data points from districts
    const heatmapData = districtsData.map((district: any) => {
      // Use district coordinates (you'll need to add these to your data)
      // For now, using approximate Berlin coordinates with random offsets
      const lat = 52.52 + (Math.random() - 0.5) * 0.2;
      const lng = 13.405 + (Math.random() - 0.5) * 0.3;
      
      return {
        location: new google.maps.LatLng(lat, lng),
        weight: district.population / 10000 // Weight based on population
      };
    });

    const newHeatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
      radius: 30,
      opacity: 0.6,
      gradient: [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]
    });

    setHeatmapLayer(newHeatmap);
  }, [mapReady, map, districtsData]);

  if (cityLoading || districtsLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-12 gap-6">
          <Skeleton className="col-span-3 h-[800px]" />
          <Skeleton className="col-span-6 h-[800px]" />
          <Skeleton className="col-span-3 h-[800px]" />
        </div>
      </div>
    );
  }

  if (!currentCity) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-4">City not found</h1>
          <Link href="/">
            <button className="text-blue-400 hover:text-blue-300">Return to home</button>
          </Link>
        </div>
      </div>
    );
  }

  const evPercentage = cityVehicles 
    ? ((cityVehicles.electricVehicles / cityVehicles.totalVehicles) * 100).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">{cityName}</h1>
              <p className="text-sm text-slate-400">{currentCity.country} • Population: {currentCity.population.toLocaleString()}</p>
            </div>
          </div>
          <Link href={`/city/${cityName}/impact`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all">
              <Users className="w-4 h-4" />
              Community Impact Analysis
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Left Column - Geopolitical Events */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Geopolitical Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {geopoliticalEvents.map((event) => (
                <div key={event.id} className="border-l-2 border-slate-700 pl-3 py-2">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                      {event.title}{" "}
                      {event.highlight && (
                        <span className="text-yellow-400 font-semibold">{event.highlight}</span>
                      )}
                    </p>
                  </div>
                  {event.impacts.length > 0 && (
                    <div className="flex items-center gap-2 ml-6">
                      {event.impacts.map((impact, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className={`${
                            impact.trend === "down" 
                              ? "border-red-500/50 text-red-400" 
                              : "border-green-500/50 text-green-400"
                          }`}
                        >
                          {impact.trend === "down" ? <TrendingDown className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
                          {impact.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Location Summary */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Location</span>
                <span className="text-sm font-medium text-slate-100">{cityName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Avg Price</span>
                <span className="text-sm font-medium text-slate-100 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  4,230
                  <TrendingDown className="w-3 h-3 text-red-400" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Area</span>
                <span className="text-sm font-medium text-slate-100 flex items-center gap-1">
                  23 m²
                  <TrendingUp className="w-3 h-3 text-green-400" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Floors</span>
                <span className="text-sm font-medium text-slate-100">4</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Map */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
            <div className="h-[600px] relative">
              <MapView
                onMapReady={(mapInstance: google.maps.Map) => {
                  setMap(mapInstance);
                  setMapReady(true);
                  
                  // Center map on city
                  const cityCoords = {
                    "Berlin": { lat: 52.52, lng: 13.405 },
                    "Munich": { lat: 48.1351, lng: 11.5820 },
                    "Hamburg": { lat: 53.5511, lng: 9.9937 },
                    "Cologne": { lat: 50.9375, lng: 6.9603 },
                    "Paris": { lat: 48.8566, lng: 2.3522 },
                    "Vienna": { lat: 48.2082, lng: 16.3738 },
                    "Rome": { lat: 41.9028, lng: 12.4964 },
                    "Amsterdam": { lat: 52.3676, lng: 4.9041 },
                    "Brussels": { lat: 50.8503, lng: 4.3517 },
                    "London": { lat: 51.5074, lng: -0.1278 },
                    "Washington D.C.": { lat: 38.9072, lng: -77.0369 },
                    "New York": { lat: 40.7128, lng: -74.0060 },
                    "Toronto": { lat: 43.6532, lng: -79.3832 },
                    "Los Angeles": { lat: 34.0522, lng: -118.2437 },
                    "Chicago": { lat: 41.8781, lng: -87.6298 },
                  };

                  const coords = cityCoords[cityName as keyof typeof cityCoords] || { lat: 52.52, lng: 13.405 };
                  mapInstance.setCenter(coords);
                  mapInstance.setZoom(11);
                }}
              />
              
              {/* Price Legend */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
                <div className="text-xs font-semibold text-slate-300 mb-2">Prices</div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-3 rounded" style={{
                    background: 'linear-gradient(to right, #0ea5e9, #22c55e, #eab308, #f97316, #ef4444)'
                  }}></div>
                  <div className="flex justify-between w-full text-xs text-slate-400">
                    <span>3</span>
                    <span>5</span>
                    <span>7</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6">
            {/* Property Prices Chart */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Property Prices in {cityName}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={propertyPriceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="apartment" stroke="#3b82f6" strokeWidth={2} name="Apartment" />
                    <Line type="monotone" dataKey="house" stroke="#22c55e" strokeWidth={2} name="House" />
                    <Line type="monotone" dataKey="land" stroke="#f59e0b" strokeWidth={2} name="Land" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quality & Transport Indices */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-base">Quality Index</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={qualityIndex}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 10 }} hide />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-base">Transport Index</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={transportIndex}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 10 }} hide />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Column - Metrics */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Properties Income Price */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100 text-base">Properties Income price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={incomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {incomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 w-full mt-4">
                  {incomeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs text-slate-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Cards */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Air quality</span>
                <span className="text-lg font-bold text-blue-400">
                  {cityEcology ? `${100 - Math.round(cityEcology.aqi / 5)}%` : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Ecology</span>
                <span className="text-lg font-bold text-green-400">
                  {cityEcology ? `${cityEcology.ecoRating}%` : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Geopolitic</span>
                <span className="text-lg font-bold text-yellow-400">10%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Transport</span>
                <span className="text-lg font-bold text-purple-400">8%</span>
              </div>
            </CardContent>
          </Card>

          {/* Transport Details */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100 text-base">Transport</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Gasoline / EV</span>
                <span className="text-sm font-medium text-slate-100">{evPercentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Transport index</span>
                <span className="text-sm font-medium text-slate-100">10%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
