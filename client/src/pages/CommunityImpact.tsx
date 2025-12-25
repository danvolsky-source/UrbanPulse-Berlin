import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Users, Building2, Leaf, Car, AlertTriangle } from "lucide-react";
import { LineChart, Line, ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function CommunityImpact() {
  const { city } = useParams();
  const cityName = city ? decodeURIComponent(city) : "";
  
  const { data: cityData, isLoading: cityLoading } = trpc.cities.list.useQuery();
  const { data: communityGrowthData } = trpc.communityGrowth.getByCity.useQuery(
    { cityId: cityData?.find((c: any) => c.name === cityName)?.id || 1 },
    { enabled: !!cityData }
  );
  const { data: migrationEventsData } = trpc.migrationEvents.getByCity.useQuery(
    { cityId: cityData?.find((c: any) => c.name === cityName)?.id || 1 },
    { enabled: !!cityData }
  );
  const { data: correlationData } = trpc.correlations.getCommunityImpact.useQuery(
    { cityId: cityData?.find((c: any) => c.name === cityName)?.id || 1 },
    { enabled: !!cityData }
  );
  const { data: rentalPricesData } = trpc.rentalPrices.getByCity.useQuery(
    { cityId: cityData?.find((c: any) => c.name === cityName)?.id || 1 },
    { enabled: !!cityData }
  );

  const currentCity = cityData?.find((c: any) => c.name === cityName);

  if (cityLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
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

  // Process community growth data for visualization
  const communityGrowthByYear = communityGrowthData?.reduce((acc: any, item: any) => {
    const existing = acc.find((x: any) => x.year === item.year);
    if (existing) {
      existing[item.communityType] = item.percentage;
    } else {
      acc.push({
        year: item.year,
        [item.communityType]: item.percentage,
      });
    }
    return acc;
  }, []) || [];

  // Mock data for correlation scatter plots
  const propertyPriceCorrelation = [
    { communityGrowth: 5, priceIncrease: 8 },
    { communityGrowth: 10, priceIncrease: 15 },
    { communityGrowth: 15, priceIncrease: 22 },
    { communityGrowth: 20, priceIncrease: 28 },
    { communityGrowth: 25, priceIncrease: 35 },
    { communityGrowth: 30, priceIncrease: 42 },
  ];

  const rentalPriceCorrelation = [
    { communityGrowth: 5, rentIncrease: 6 },
    { communityGrowth: 10, rentIncrease: 12 },
    { communityGrowth: 15, rentIncrease: 18 },
    { communityGrowth: 20, rentIncrease: 24 },
    { communityGrowth: 25, rentIncrease: 30 },
    { communityGrowth: 30, rentIncrease: 36 },
  ];

  // Rental prices by apartment type over time
  const rentalPricesByType = rentalPricesData?.reduce((acc: any, item: any) => {
    const existing = acc.find((x: any) => x.year === item.year);
    if (existing) {
      existing[item.apartmentType] = item.monthlyRent;
    } else {
      acc.push({
        year: item.year,
        [item.apartmentType]: item.monthlyRent,
      });
    }
    return acc;
  }, []) || [];

  // Correlation radar chart data
  const radarData = [
    { metric: "Property Prices", correlation: correlationData?.correlations?.propertyPrices || 0.78 },
    { metric: "Infrastructure", correlation: correlationData?.correlations?.infrastructure || 0.85 },
    { metric: "Ecology", correlation: correlationData?.correlations?.ecology || 0.42 },
    { metric: "EV Adoption", correlation: correlationData?.correlations?.evAdoption || 0.65 },
    { metric: "Quality of Life", correlation: correlationData?.correlations?.qualityOfLife || 0.55 },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/city/${cityName}`}>
              <button className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to {cityName}
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Community Impact Analysis</h1>
              <p className="text-sm text-slate-400">How immigrant communities shape {cityName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Insights */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Key Insights
            </CardTitle>
            <CardDescription className="text-slate-300">
              Statistical correlations between community growth and city metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {correlationData?.insights?.map((insight: string, idx: number) => (
                <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-slate-300">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Correlation Overview Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">Correlation Strength Overview</CardTitle>
              <CardDescription className="text-slate-400">
                How strongly community growth correlates with each metric (0-1 scale)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 1]} stroke="#94a3b8" />
                  <Radar name="Correlation" dataKey="correlation" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Community Growth Over Time */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Community Growth (2020-2024)
              </CardTitle>
              <CardDescription className="text-slate-400">
                Percentage of population by community type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={communityGrowthByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Muslim" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Hindu" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="Buddhist" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="Sikh" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Jewish" stroke="#ec4899" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Property & Rental Price Correlations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-400" />
                Community Growth → Property Prices
              </CardTitle>
              <CardDescription className="text-slate-400">
                Correlation: {(correlationData?.correlations?.propertyPrices || 0.78).toFixed(2)} (Strong Positive)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="communityGrowth" 
                    name="Community Growth" 
                    unit="%" 
                    stroke="#94a3b8"
                    label={{ value: 'Community Growth (%)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="priceIncrease" 
                    name="Price Increase" 
                    unit="%" 
                    stroke="#94a3b8"
                    label={{ value: 'Price Increase (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  />
                  <Scatter data={propertyPriceCorrelation} fill="#22c55e" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Community Growth → Rental Prices
              </CardTitle>
              <CardDescription className="text-slate-400">
                Correlation: 0.72 (Strong Positive)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="communityGrowth" 
                    name="Community Growth" 
                    unit="%" 
                    stroke="#94a3b8"
                    label={{ value: 'Community Growth (%)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="rentIncrease" 
                    name="Rent Increase" 
                    unit="%" 
                    stroke="#94a3b8"
                    label={{ value: 'Rent Increase (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  />
                  <Scatter data={rentalPriceCorrelation} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Rental Prices by Apartment Type */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Rental Prices by Apartment Type (2020-2024)</CardTitle>
            <CardDescription className="text-slate-400">
              Monthly rent trends across different property types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={rentalPricesByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} label={{ value: 'Monthly Rent (€)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Line type="monotone" dataKey="1-bedroom" stroke="#3b82f6" strokeWidth={2} name="1-Bedroom" />
                <Line type="monotone" dataKey="2-bedroom" stroke="#22c55e" strokeWidth={2} name="2-Bedroom" />
                <Line type="monotone" dataKey="3-bedroom" stroke="#f59e0b" strokeWidth={2} name="3-Bedroom" />
                <Line type="monotone" dataKey="house" stroke="#8b5cf6" strokeWidth={2} name="House" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Migration Events Timeline */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Migration Events Timeline
            </CardTitle>
            <CardDescription className="text-slate-400">
              Key events that shaped community demographics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {migrationEventsData?.map((event: any) => (
                <div key={event.id} className="flex gap-4 border-l-2 border-blue-500 pl-4 py-2">
                  <div className="flex-shrink-0 w-24">
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {event.year}-{String(event.month).padStart(2, '0')}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-100 mb-1">{event.title}</h4>
                    <p className="text-sm text-slate-400 mb-2">{event.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                        {event.eventType.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                        Impact: {event.impactScore}/100
                      </Badge>
                      {event.affectedCommunity && (
                        <Badge variant="outline" className="border-green-500/50 text-green-400">
                          {event.affectedCommunity}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
