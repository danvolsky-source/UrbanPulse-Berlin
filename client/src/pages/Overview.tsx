import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp, BarChart3, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Overview() {
  const stats = [
    {
      title: "Total Cities",
      value: "15",
      icon: MapPin,
      description: "Cities across Europe and North America",
      color: "text-blue-500",
    },
    {
      title: "Districts Analyzed",
      value: "250+",
      icon: BarChart3,
      description: "Detailed district-level data",
      color: "text-green-500",
    },
    {
      title: "Data Points",
      value: "10K+",
      icon: TrendingUp,
      description: "Property prices, demographics, infrastructure",
      color: "text-purple-500",
    },
    {
      title: "Population Coverage",
      value: "50M+",
      icon: Users,
      description: "People in analyzed urban areas",
      color: "text-orange-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
          <p className="text-muted-foreground">
            Interactive map-based analytical platform for urban insights
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Interactive Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Explore cities with interactive maps showing district zones,
                property prices, and demographics.
              </p>
              <Link href="/map">
                <Button className="w-full">View Map</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Analyze historical market trends and property price evolution
                over time.
              </p>
              <Link href="/trends">
                <Button className="w-full" variant="outline">
                  View Trends
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Deep dive into analytics with comprehensive data visualization
                and insights.
              </p>
              <Link href="/analytics">
                <Button className="w-full" variant="outline">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Map Visualization</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Mapbox GL JS integration</li>
                  <li>• GeoJSON district boundaries</li>
                  <li>• Color-coded price ranges</li>
                  <li>• Interactive popups and tooltips</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Analysis</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Historical market trends</li>
                  <li>• Population demographics</li>
                  <li>• Infrastructure mapping</li>
                  <li>• District comparisons</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
