import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DistrictDetail() {
  const [, params] = useRoute("/district/:id");
  const districtId = params?.id ? parseInt(params.id) : null;
  
  const { data: district, isLoading: districtLoading } = trpc.districts.getById.useQuery(
    { id: districtId! },
    { enabled: !!districtId }
  );
  
  const { data: demographics, isLoading: demographicsLoading } = trpc.demographics.byDistrict.useQuery(
    { districtId: districtId! },
    { enabled: !!districtId }
  );
  
  const { data: infrastructure, isLoading: infrastructureLoading } = trpc.infrastructure.byDistrict.useQuery(
    { districtId: districtId! },
    { enabled: !!districtId }
  );
  
  const { data: propertyPrices, isLoading: pricesLoading } = trpc.propertyPrices.byDistrict.useQuery(
    { districtId: districtId! },
    { enabled: !!districtId }
  );
  
  if (!districtId) {
    return <div className="container py-12">Invalid district ID</div>;
  }
  
  // Group demographics by community
  const communityData = demographics?.reduce((acc, demo) => {
    if (!acc[demo.community]) {
      acc[demo.community] = [];
    }
    acc[demo.community].push({
      year: demo.year,
      population: demo.population,
      percentage: demo.percentageOfDistrict / 10, // Convert back to decimal
    });
    return acc;
  }, {} as Record<string, Array<{ year: number; population: number; percentage: number }>>);
  
  // Prepare chart data for demographics
  const demographicsChartData = demographics
    ?.sort((a, b) => a.year - b.year)
    .reduce((acc, demo) => {
      const existing = acc.find(item => item.year === demo.year);
      if (existing) {
        existing[demo.community] = demo.population;
      } else {
        acc.push({
          year: demo.year,
          [demo.community]: demo.population,
        });
      }
      return acc;
    }, [] as Array<Record<string, number>>);
  
  // Prepare chart data for property prices
  const pricesChartData = propertyPrices
    ?.sort((a, b) => a.year - b.year || a.month - b.month)
    .map(price => ({
      date: `${price.year}-${String(price.month).padStart(2, "0")}`,
      price: price.averagePricePerSqm,
    }));
  
  // Group infrastructure by type
  const infrastructureByType = infrastructure?.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, typeof infrastructure>);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {districtLoading ? <Skeleton className="h-8 w-48" /> : district?.nameEn}
              </h1>
              <p className="text-muted-foreground mt-1">District Profile & Analysis</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-12">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {districtLoading ? (
              <>
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Population</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{district?.population.toLocaleString()}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Area</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{district?.area} km²</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Foreign Residents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{district?.foreignerPercentage}%</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Dominant Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{district?.dominantCommunity}</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </section>
        
        {/* Demographics Trends */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Demographic Trends</h2>
          <Card>
            <CardContent className="pt-6">
              {demographicsLoading ? (
                <Skeleton className="h-80" />
              ) : demographicsChartData && demographicsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={demographicsChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="year" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    {Object.keys(communityData || {}).map((community, index) => {
                      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
                      return (
                        <Line
                          key={community}
                          type="monotone"
                          dataKey={community}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12">No demographic data available</p>
              )}
            </CardContent>
          </Card>
        </section>
        
        {/* Property Prices */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Property Price Trends</h2>
          <Card>
            <CardContent className="pt-6">
              {pricesLoading ? (
                <Skeleton className="h-80" />
              ) : pricesChartData && pricesChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={pricesChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`€${value}/m²`, "Price"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12">No property price data available</p>
              )}
            </CardContent>
          </Card>
        </section>
        
        {/* Infrastructure */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Community Infrastructure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {infrastructureLoading ? (
              <>
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </>
            ) : infrastructureByType && Object.keys(infrastructureByType).length > 0 ? (
              Object.entries(infrastructureByType).map(([type, items]) => (
                <Card key={type}>
                  <CardHeader>
                    <CardTitle className="capitalize">{type.replace("_", " ")}s</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="border-b border-border pb-3 last:border-0">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.community}</p>
                          {item.address && (
                            <p className="text-xs text-muted-foreground mt-1">{item.address}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-2">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No infrastructure data available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
