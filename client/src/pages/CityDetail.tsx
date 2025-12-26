import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, TrendingUp, TrendingDown, Globe, DollarSign, AlertCircle, Home as HomeIcon, Building2, Car, Leaf } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";
import { DistrictHeatmap } from "@/components/DistrictHeatmap";
import { BerlinGridMap } from "@/components/BerlinGridMap";

export default function CityDetail() {
  const { city } = useParams();
  const cityName = city ? decodeURIComponent(city) : "";
  
  const { data: cityData, isLoading: cityLoading } = trpc.cities.list.useQuery();
  const { data: districtsData, isLoading: districtsLoading } = trpc.districts.list.useQuery({});
  const { data: demographicsData } = trpc.demographics.citySummary.useQuery(
    { city: cityName, year: 2024 },
    { enabled: !!cityName }
  );
  const { data: ecologyData } = trpc.ecology.getAll.useQuery();
  const { data: vehiclesData } = trpc.vehicles.getAll.useQuery();
  const currentCityId = cityData?.find((c: any) => c.name === cityName)?.id;
  const { data: communityGrowthData } = trpc.communityGrowth.getByCity.useQuery(
    { cityId: currentCityId || 1 },
    { enabled: !!currentCityId }
  );
  const { data: migrationEventsData } = trpc.migrationEvents.getByCity.useQuery(
    { cityId: currentCityId || 1 },
    { enabled: !!currentCityId }
  );

  // Interactive state management
  const [activeChart, setActiveChart] = useState<"prices" | "quality" | "community">("prices");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);
  const [highlightedDistricts, setHighlightedDistricts] = useState<number[]>([]);
  const [areaFilter, setAreaFilter] = useState([0, 200]);
  const [airQualityFilter, setAirQualityFilter] = useState(false);
  const [greeneryFilter, setGreeneryFilter] = useState(false);

  const currentCity = cityData?.find((c: any) => c.name === cityName);
  const cityEcology = ecologyData?.filter((e: any) => e.cityId === currentCity?.id && e.year === 2024)[0];
  const cityVehicles = vehiclesData?.filter((v: any) => v.cityId === currentCity?.id && v.year === 2024)[0];
  const cityDistricts = districtsData?.filter((d: any) => d.cityId === currentCity?.id) || [];

  // Mock geopolitical events
  const geopoliticalEvents = migrationEventsData && migrationEventsData.length > 0 ? migrationEventsData.slice(0, 4).map((event: any) => ({
    icon: <Globe className="w-5 h-5" />,
    title: event.title || event.description,
    description: event.description || "",
    impact: event.impactScore ? `${event.impactScore}%` : "",
    trend: event.impactScore && event.impactScore > 50 ? "up" : "down",
  })) : [
    {
      icon: <Globe className="w-5 h-5" />,
      title: "EU imposes new sanctions on Russia",
      description: "",
      impact: "19%",
      trend: "down",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "USD/EUR exchange rate moved down by 5",
      description: "",
      impact: "10%",
      trend: "down",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Reports on increasing capital migration to Germany",
      description: "",
      impact: "24%",
      trend: "up",
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: "Reduced investment in the euro",
      description: "",
      impact: "",
      trend: "neutral",
    },
  ];

  // Mock property data
  const propertyData = {
    location: cityName,
    district: cityDistricts[0]?.name || "Gesundbrunnen",
    price: "€ 4,230",
    area: "23 m²",
    floors: "4",
  };

  // Property prices chart data
  const priceChartData = [
    { month: "Aug 2023", line1: 4500, line2: 5200, line3: 5800 },
    { month: "Oct 2023", line1: 4600, line2: 5100, line3: 5700 },
    { month: "Dec 2023", line1: 4700, line2: 5300, line3: 5900 },
    { month: "Feb 2024", line1: 4550, line2: 5250, line3: 5750 },
    { month: "Apr 2024", line1: 4800, line2: 5400, line3: 6000 },
    { month: "Jun 2024", line1: 4900, line2: 5500, line3: 6100 },
    { month: "Aug 2025", line1: 5000, line2: 5600, line3: 6200 },
  ];

  // Quality index chart data
  const qualityChartData = [
    { month: "Aug 2023", quality: 75 },
    { month: "Oct 2023", quality: 78 },
    { month: "Dec 2023", quality: 76 },
    { month: "Feb 2024", quality: 80 },
    { month: "Apr 2024", quality: 82 },
    { month: "Jun 2024", quality: 81 },
    { month: "Aug 2025", quality: 85 },
  ];

  // Community growth chart data
  const communityChartData = communityGrowthData?.reduce((acc: any, item: any) => {
    const existing = acc.find((x: any) => x.year === item.year);
    if (existing) {
      existing[item.communityType] = item.percentage;
    } else {
      acc.push({
        year: item.year.toString(),
        [item.communityType]: item.percentage,
      });
    }
    return acc;
  }, []) || [];

  // Income price donut chart
  const incomeData = [
    { name: "Air quality", value: 32, color: "#3b82f6" },
    { name: "Ecology", value: 13, color: "#22c55e" },
    { name: "Geopolitic", value: 10, color: "#f59e0b" },
    { name: "Transport", value: 8, color: "#8b5cf6" },
    { name: "Other", value: 37, color: "#64748b" },
  ];

  // District markers are now handled by LeafletMap component

  if (cityLoading || districtsLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-12 gap-4">
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
              Community Impact Analysis
            </button>
          </Link>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="flex gap-4 p-4 h-[calc(100vh-100px)] overflow-hidden">
        {/* Left Panel - Geopolitical Events */}
        <div className="w-1/4 space-y-4 overflow-y-auto flex-shrink-0">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <h2 className="text-lg font-bold text-slate-100 mb-4">Geopolitical Events</h2>
              <div className="space-y-3">
                {geopoliticalEvents.map((event, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedEventIndex === index 
                        ? 'bg-amber-900/50 border-2 border-amber-500 shadow-lg shadow-amber-500/20' 
                        : 'bg-slate-800/50 hover:bg-slate-800 border-2 border-transparent'
                    }`}
                    onClick={() => {
                      if (selectedEventIndex === index) {
                        setSelectedEventIndex(null);
                        setHighlightedDistricts([]);
                      } else {
                        setSelectedEventIndex(index);
                        // Define which districts are affected by each event
                        const affectedDistricts: Record<number, number[]> = {
                          0: [1, 2, 10, 15], // EU sanctions → Mitte, Prenzlauer Berg, Lichtenberg, Marzahn
                          1: [5, 6, 14], // USD/EUR → Charlottenburg, Wilmersdorf, Steglitz
                          2: [1, 2, 3, 4], // Capital migration → Central districts
                          3: [9, 10, 15], // Investment reduction → Neukölln, Lichtenberg, Marzahn
                        };
                        setHighlightedDistricts(affectedDistricts[index] || []);
                      }
                    }}
                  >
                    <div className="text-blue-400 mt-1">{event.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-200 leading-tight">
                        {event.title.split(".")[0]}
                        {event.title.includes("Russia") && (
                          <span className="text-yellow-400 ml-1">Russia</span>
                        )}
                      </p>
                      {event.impact && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="destructive" className="text-xs">
                            {event.trend === "up" ? "▲" : "▼"} {event.impact}
                          </Badge>
                          {event.trend === "down" && event.title.includes("USD/EUR") && (
                            <Badge variant="destructive" className="text-xs">▼ 10%</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Property Data */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="text-sm font-semibold text-slate-100">{propertyData.location}</p>
                <p className="text-xs text-slate-300">{propertyData.district}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Price</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-100">{propertyData.price}</p>
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <TrendingDown className="w-4 h-4 text-red-400" />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400">Area</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-100">{propertyData.area}</p>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400">Floors</p>
                <p className="text-sm font-semibold text-slate-100">{propertyData.floors}</p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Icons */}
          <div className="flex justify-around items-center p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <button className="text-slate-400 hover:text-blue-400 transition-colors">
              <HomeIcon className="w-6 h-6" />
            </button>
            <button className="text-slate-400 hover:text-blue-400 transition-colors">
              <Building2 className="w-6 h-6" />
            </button>
            <button className="text-blue-400">
              <Globe className="w-6 h-6" />
            </button>
            <button className="text-slate-400 hover:text-blue-400 transition-colors">
              <Car className="w-6 h-6" />
            </button>
            <button className="text-slate-400 hover:text-blue-400 transition-colors">
              <Leaf className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Center Panel - Map and Charts */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          {/* Map */}
          <Card className="bg-slate-900/50 border-slate-800 flex-1" style={{ minHeight: "500px" }}>
            <CardContent className="p-0 h-full relative" style={{ minHeight: "500px" }}>
              {cityName === "Berlin" ? (
                <BerlinGridMap year={selectedYear} month={1} />
              ) : (
                <DistrictHeatmap
                  className="w-full h-full"
                  districts={cityDistricts?.map((d: any, idx: number) => ({
                    id: d.id,
                    name: d.name,
                    priceLevel: ((idx % 7) + 1),
                  }))}
                  cityName={cityName}
                  selectedYear={selectedYear}
                  selectedEvent={selectedEventIndex}
                  highlightedDistricts={highlightedDistricts}
                  showAirQuality={airQualityFilter}
                  showGreenery={greeneryFilter}
                />
              )}
              {/* Price Legend */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 p-3 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-300 mb-2">Prices</p>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-3 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-600 rounded"></div>
                  <div className="flex justify-between w-full text-[10px] text-slate-400 ml-1">
                    <span>3</span>
                    <span>6</span>
                    <span>4</span>
                    <span>5</span>
                    <span>5</span>
                    <span>7</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              {/* Year Selector */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-400">Select Year:</p>
                <div className="flex gap-2">
                  {[2020, 2021, 2022, 2023, 2024].map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        selectedYear === year
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Tabs */}
              <div className="flex gap-2 mb-4 border-b border-slate-700">
                <button
                  onClick={() => setActiveChart("prices")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeChart === "prices"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  Property / Prices in {cityName}
                </button>
                <button
                  onClick={() => setActiveChart("quality")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeChart === "quality"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  Quality Index
                </button>
                <button
                  onClick={() => setActiveChart("community")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeChart === "community"
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  Community Growth
                </button>
              </div>

              {/* Chart Content */}
              <div className="h-[200px]">
                {activeChart === "prices" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[4000, 6500]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
                        labelStyle={{ color: "#e2e8f0" }}
                      />
                      <Line type="monotone" dataKey="line1" stroke="#06b6d4" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="line2" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="line3" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {activeChart === "quality" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={qualityChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[70, 90]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
                        labelStyle={{ color: "#e2e8f0" }}
                      />
                      <Line type="monotone" dataKey="quality" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {activeChart === "community" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={communityChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}
                        labelStyle={{ color: "#e2e8f0" }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="Muslim" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="Hindu" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="Buddhist" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="Sikh" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="Jewish" stroke="#ec4899" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Filters and Metrics */}
        <div className="w-1/4 space-y-4 overflow-y-auto flex-shrink-0">
          {/* Geopolitics */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-slate-100 mb-4">GEOPOLITICS</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">Air quality</span>
                  </div>
                  <Switch checked={airQualityFilter} onCheckedChange={setAirQualityFilter} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">Greenery proximity</span>
                  </div>
                  <Switch checked={greeneryFilter} onCheckedChange={setGreeneryFilter} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transport */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-slate-100 mb-4">TRANSPORT</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">Gasoline / EV</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-100">
                    {cityVehicles ? Math.round((cityVehicles.electricVehicles / cityVehicles.totalVehicles) * 100) : 30}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">Transport index</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-100">10%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Properties Income Price */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-slate-100 mb-2">Properties Inco price</h3>
              <div className="flex items-center justify-center h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {incomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{cityName}</span>
                  <span className="text-slate-100">€ 4,250</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Arow 4</span>
                  <span className="text-slate-100">75 m²</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Floors</span>
                  <span className="text-slate-100">4</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Metrics */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400">Air quality</p>
                  <p className="text-lg font-bold text-slate-100">
                    {cityEcology ? Math.round((cityEcology.aqi / 500) * 100) : 32}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Geopolitic</p>
                  <p className="text-lg font-bold text-slate-100">10%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Ecology</p>
                  <p className="text-lg font-bold text-slate-100">
                    {cityEcology ? cityEcology.ecoRating : 13}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Transport</p>
                  <p className="text-lg font-bold text-slate-100">8%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Card */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-0">
              <div className="aspect-video bg-slate-800 rounded-t-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold text-slate-100">{cityName}</h4>
                <p className="text-xs text-slate-400">{propertyData.district}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Air</span>
                    <span className="text-slate-100">4,420</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Floors</span>
                    <span className="text-slate-100">4</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
