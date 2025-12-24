import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CITIES = ["Berlin", "Munich", "Hamburg", "Cologne"];
const currentYear = 2024;

export default function CityComparison() {
  // Fetch data for all cities
  const berlinSummary = trpc.demographics.citySummary.useQuery({ city: "Berlin", year: currentYear });
  const munichSummary = trpc.demographics.citySummary.useQuery({ city: "Munich", year: currentYear });
  const hamburgSummary = trpc.demographics.citySummary.useQuery({ city: "Hamburg", year: currentYear });
  const cologneSummary = trpc.demographics.citySummary.useQuery({ city: "Cologne", year: currentYear });

  const berlinCommunity = trpc.demographics.communityComposition.useQuery({ city: "Berlin" });
  const munichCommunity = trpc.demographics.communityComposition.useQuery({ city: "Munich" });
  const hamburgCommunity = trpc.demographics.communityComposition.useQuery({ city: "Hamburg" });
  const cologneCommunity = trpc.demographics.communityComposition.useQuery({ city: "Cologne" });

  const isLoading =
    berlinSummary.isLoading ||
    munichSummary.isLoading ||
    hamburgSummary.isLoading ||
    cologneSummary.isLoading;

  const summaries = [
    { city: "Berlin", data: berlinSummary.data, community: berlinCommunity.data },
    { city: "Munich", data: munichSummary.data, community: munichCommunity.data },
    { city: "Hamburg", data: hamburgSummary.data, community: hamburgCommunity.data },
    { city: "Cologne", data: cologneSummary.data, community: cologneCommunity.data },
  ];

  // Prepare data for infrastructure comparison chart
  const infrastructureData = summaries.map((s) => ({
    city: s.city,
    Mosques: s.data?.current?.mosquesCount || 0,
    Churches: s.data?.current?.churchesCount || 0,
    Synagogues: s.data?.current?.synagoguesCount || 0,
  }));

  // Prepare data for population comparison
  const populationData = summaries.map((s) => ({
    city: s.city,
    "Total Population": (s.data?.current?.totalPopulation || 0) / 1000000, // Convert to millions
    "Foreign Population": (s.data?.current?.foreignerPopulation || 0) / 1000000,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">City Comparison</h1>
              <p className="text-muted-foreground mt-1">
                Compare demographic data across major German cities
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Population Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Population Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={populationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="city" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: "Population (millions)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="Total Population" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Foreign Population" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Religious Infrastructure Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Religious Infrastructure Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={infrastructureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="city" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="Mosques" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Churches" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Synagogues" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* City-by-City Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Metric</th>
                    {summaries.map((s) => (
                      <th key={s.city} className="text-left py-3 px-4 font-semibold">
                        {s.city}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 text-muted-foreground">Total Population</td>
                    {summaries.map((s) => (
                      <td key={s.city} className="py-3 px-4 font-medium">
                        {(s.data?.current?.totalPopulation || 0).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 text-muted-foreground">Foreign Population</td>
                    {summaries.map((s) => (
                      <td key={s.city} className="py-3 px-4 font-medium">
                        {(s.data?.current?.foreignerPopulation || 0).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 text-muted-foreground">Mosques</td>
                    {summaries.map((s) => (
                      <td key={s.city} className="py-3 px-4 font-medium">
                        {s.data?.current?.mosquesCount || 0}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 text-muted-foreground">Churches</td>
                    {summaries.map((s) => (
                      <td key={s.city} className="py-3 px-4 font-medium">
                        {s.data?.current?.churchesCount || 0}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4 text-muted-foreground">Synagogues</td>
                    {summaries.map((s) => (
                      <td key={s.city} className="py-3 px-4 font-medium">
                        {s.data?.current?.synagoguesCount || 0}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-muted-foreground">Top Community</td>
                    {summaries.map((s) => (
                      <td key={s.city} className="py-3 px-4 font-medium">
                        {s.community?.[0]?.name || "N/A"} ({(s.community?.[0]?.latestPercentage || 0).toFixed(1)}%)
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Communities by City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {summaries.map((s) => (
            <Card key={s.city}>
              <CardHeader>
                <CardTitle>{s.city} - Top Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {s.community?.slice(0, 5).map((c, idx) => {
                    const firstYear = c.progression[0]?.population || 0;
                    const lastYear = c.progression[c.progression.length - 1]?.population || 0;
                    const trend = firstYear > 0 ? ((lastYear - firstYear) / firstYear) * 100 : 0;
                    
                    return (
                      <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-sm text-muted-foreground">{c.latestPercentage.toFixed(2)}% of population</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {trend > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
                            {trend > 0 ? "+" : ""}{trend.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
