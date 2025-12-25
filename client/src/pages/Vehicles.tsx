import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Zap, Fuel, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Vehicles() {
  const { data: cities, isLoading: citiesLoading } = trpc.cities.list.useQuery();
  const { data: vehiclesData, isLoading: vehiclesLoading } = trpc.vehicles.getAll.useQuery();

  if (citiesLoading || vehiclesLoading) {
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
  const latestData = (vehiclesData || [])
    .filter((v: any) => v.year === 2024)
    .map((v: any) => ({
      ...v,
      cityName: cityMap.get(v.cityId) || "Unknown",
      evPercentage: v.totalVehicles > 0 ? ((v.electricVehicles / v.totalVehicles) * 100).toFixed(1) : "0",
    }));

  // Calculate totals
  const totalVehicles = latestData.reduce((sum: number, v: any) => sum + v.totalVehicles, 0);
  const totalElectric = latestData.reduce((sum: number, v: any) => sum + v.electricVehicles, 0);
  const totalGasoline = latestData.reduce((sum: number, v: any) => sum + v.gasolineVehicles, 0);
  const totalChargingStations = latestData.reduce((sum: number, v: any) => sum + v.chargingStations, 0);
  const evPercentage = totalVehicles > 0 ? ((totalElectric / totalVehicles) * 100).toFixed(1) : "0";

  // Prepare trend data (2020-2024 total across all cities)
  const years = [2020, 2021, 2022, 2023, 2024];
  const trendData = years.map(year => {
    const yearData = (vehiclesData || []).filter((v: any) => v.year === year);
    const yearTotal = yearData.reduce((sum: number, v: any) => sum + v.totalVehicles, 0);
    const yearElectric = yearData.reduce((sum: number, v: any) => sum + v.electricVehicles, 0);
    const yearGasoline = yearData.reduce((sum: number, v: any) => sum + v.gasolineVehicles, 0);
    const yearCharging = yearData.reduce((sum: number, v: any) => sum + v.chargingStations, 0);
    
    return {
      year,
      electric: Math.round(yearElectric / 1000), // in thousands
      gasoline: Math.round(yearGasoline / 1000), // in thousands
      chargingStations: yearCharging,
      evPercentage: yearTotal > 0 ? ((yearElectric / yearTotal) * 100).toFixed(1) : 0,
    };
  });

  // City comparison data (2024) - top 10 by EV percentage
  const cityComparisonData = latestData
    .sort((a: any, b: any) => parseFloat(b.evPercentage) - parseFloat(a.evPercentage))
    .slice(0, 10);

  // Pie chart data for overall split
  const pieData = [
    { name: "Electric", value: totalElectric, color: "#22c55e" },
    { name: "Gasoline/Diesel", value: totalGasoline, color: "#64748b" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="container py-12">
        <div className="flex items-center gap-3 mb-2">
          <Car className="w-10 h-10 text-blue-400" />
          <h1 className="text-4xl font-bold text-slate-100">Vehicle Analytics</h1>
        </div>
        <p className="text-lg text-slate-400 mb-8">
          Electric vs gasoline vehicles, charging infrastructure, and adoption trends
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Car className="w-4 h-4" />
                Total Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100">
                {(totalVehicles / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-slate-500 mt-1">across 15 cities</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Electric Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {(totalElectric / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-slate-500 mt-1">{evPercentage}% of total</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Fuel className="w-4 h-4" />
                Gasoline/Diesel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-400">
                {(totalGasoline / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-slate-500 mt-1">{(100 - parseFloat(evPercentage)).toFixed(1)}% of total</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Charging Stations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100">{totalChargingStations.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">public charging points</p>
            </CardContent>
          </Card>
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Vehicle Type Trend (2020-2024)</CardTitle>
              <CardDescription>Electric vs gasoline/diesel vehicles (in thousands)</CardDescription>
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
                  <Line type="monotone" dataKey="electric" stroke="#22c55e" strokeWidth={2} name="Electric (K)" />
                  <Line type="monotone" dataKey="gasoline" stroke="#64748b" strokeWidth={2} name="Gasoline (K)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">EV Adoption Rate (2020-2024)</CardTitle>
              <CardDescription>Percentage of electric vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="evPercentage" stroke="#3b82f6" strokeWidth={2} name="EV %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Overall Split & City Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Vehicle Type Distribution (2024)</CardTitle>
              <CardDescription>Total vehicles across all cities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${((entry.value / totalVehicles) * 100).toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Top 10 Cities by EV Adoption (2024)</CardTitle>
              <CardDescription>Percentage of electric vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cityComparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" unit="%" />
                  <YAxis dataKey="cityName" type="category" stroke="#94a3b8" width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Bar dataKey="evPercentage" fill="#22c55e" name="EV %" type="number" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charging Infrastructure */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Charging Infrastructure Growth (2020-2024)</CardTitle>
            <CardDescription>Number of public charging stations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="chargingStations" fill="#3b82f6" name="Charging Stations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
