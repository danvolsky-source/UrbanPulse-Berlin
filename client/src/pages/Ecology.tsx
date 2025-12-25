import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, Wind, Trees, TrendingDown, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Ecology() {
  const { data: cities, isLoading: citiesLoading } = trpc.cities.list.useQuery();
  const { data: ecologyData, isLoading: ecologyLoading } = trpc.ecology.getAll.useQuery();

  if (citiesLoading || ecologyLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-12 w-96 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Create city map for lookups
  const cityMap = new Map((cities || []).map((c: any) => [c.id, c.name]));

  // Get latest data (2024) for each city
  const latestData = (ecologyData || [])
    .filter((e: any) => e.year === 2024)
    .map((e: any) => ({
      ...e,
      cityName: cityMap.get(e.cityId) || "Unknown",
    }));

  // Calculate averages
  const avgAQI = latestData.length > 0 
    ? Math.round(latestData.reduce((sum: number, e: any) => sum + e.aqi, 0) / latestData.length)
    : 0;
  
  const avgCO2 = latestData.length > 0
    ? Math.round(latestData.reduce((sum: number, e: any) => sum + e.co2Emissions, 0) / latestData.length)
    : 0;
  
  const avgGreenSpace = latestData.length > 0
    ? Math.round(latestData.reduce((sum: number, e: any) => sum + e.greenSpaceArea, 0) / latestData.length)
    : 0;
  
  const avgEcoRating = latestData.length > 0
    ? Math.round(latestData.reduce((sum: number, e: any) => sum + e.ecoRating, 0) / latestData.length)
    : 0;

  // Prepare trend data (2020-2024 average across all cities)
  const years = [2020, 2021, 2022, 2023, 2024];
  const trendData = years.map(year => {
    const yearData = (ecologyData || []).filter((e: any) => e.year === year);
    return {
      year,
      aqi: yearData.length > 0 ? Math.round(yearData.reduce((sum: number, e: any) => sum + e.aqi, 0) / yearData.length) : 0,
      co2: yearData.length > 0 ? Math.round(yearData.reduce((sum: number, e: any) => sum + e.co2Emissions, 0) / yearData.length) : 0,
      greenSpace: yearData.length > 0 ? Math.round(yearData.reduce((sum: number, e: any) => sum + e.greenSpaceArea, 0) / yearData.length) : 0,
      ecoRating: yearData.length > 0 ? Math.round(yearData.reduce((sum: number, e: any) => sum + e.ecoRating, 0) / yearData.length) : 0,
    };
  });

  // City comparison data (2024)
  const cityComparisonData = latestData
    .sort((a: any, b: any) => b.ecoRating - a.ecoRating)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="container py-12">
        <div className="flex items-center gap-3 mb-2">
          <Leaf className="w-10 h-10 text-green-400" />
          <h1 className="text-4xl font-bold text-slate-100">Environmental Analytics</h1>
        </div>
        <p className="text-lg text-slate-400 mb-8">
          Track air quality, emissions, and green spaces across 15 major cities
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Wind className="w-4 h-4" />
                Average AQI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100">{avgAQI}</div>
              <p className="text-xs text-slate-500 mt-1">
                {avgAQI < 50 ? "Good" : avgAQI < 100 ? "Moderate" : "Unhealthy"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                CO₂ Emissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100">{avgCO2}</div>
              <p className="text-xs text-slate-500 mt-1">tons per capita</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Trees className="w-4 h-4" />
                Green Spaces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100">{avgGreenSpace}</div>
              <p className="text-xs text-slate-500 mt-1">km² average</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Eco Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100">{avgEcoRating}/100</div>
              <p className="text-xs text-slate-500 mt-1">sustainability score</p>
            </CardContent>
          </Card>
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Air Quality Trend (2020-2024)</CardTitle>
              <CardDescription>Lower AQI indicates better air quality</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="aqi" stroke="#22c55e" strokeWidth={2} name="AQI" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">CO₂ Emissions Trend (2020-2024)</CardTitle>
              <CardDescription>Tons per capita - declining is better</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="co2" stroke="#ef4444" strokeWidth={2} name="CO₂ Emissions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* City Comparison */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Top 10 Cities by Eco Rating (2024)</CardTitle>
            <CardDescription>Sustainability scores based on air quality, emissions, and green spaces</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={cityComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="cityName" type="category" stroke="#94a3b8" width={120} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="ecoRating" fill="#22c55e" name="Eco Rating" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
