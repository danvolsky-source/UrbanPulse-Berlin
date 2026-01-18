import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, Activity, Database, Home as HomeIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Analytics() {
  const analyticsCards = [
    {
      title: "Data Sources",
      icon: Database,
      color: "text-blue-500",
      items: [
        "Government statistical offices",
        "Real estate market data",
        "Infrastructure databases",
        "Demographic surveys",
      ],
    },
    {
      title: "Analysis Methods",
      icon: Activity,
      color: "text-green-500",
      items: [
        "Geospatial analysis with Mapbox",
        "Time-series trend analysis",
        "District-level comparisons",
        "Infrastructure impact assessment",
      ],
    },
    {
      title: "Visualization Tools",
      icon: BarChart3,
      color: "text-purple-500",
      items: [
        "Interactive heat maps",
        "Historical trend charts",
        "Color-coded price ranges",
        "Real-time data overlays",
      ],
    },
    {
      title: "Key Metrics",
      icon: PieChart,
      color: "text-orange-500",
      items: [
        "Property prices per m²",
        "Population density",
        "Foreign resident %",
        "Infrastructure count",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics</h1>
              <p className="text-muted-foreground">
                Comprehensive data analysis and visualization platform
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <HomeIcon className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8">{/* Empty for spacing */}</div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {analyticsCards.map((card, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {card.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-green-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Capabilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Platform Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Interactive Map Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      District Visualization
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      GeoJSON-based district boundaries with color-coded zones
                      representing property prices, demographics, and other
                      metrics.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Interactive Layers
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Switch between different data layers including property
                      prices, population density, and infrastructure locations.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Infrastructure Mapping
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Visual markers for mosques, churches, synagogues, cultural
                      centers, and ethnic stores with filtering capabilities.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Detailed Popups
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Hover over districts to view instant statistics including
                      population, area, and average prices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Data Analysis Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Historical Trends
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Chart.js-powered line graphs showing market trends over
                      time with multiple data series support.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Color Scales
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      D3.js color scales for heat map visualization with
                      intuitive red-yellow-green gradients.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Time Series Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Year-by-year slider to explore how districts evolved with
                      dynamic data updates.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      District Comparison
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Compare multiple districts side-by-side with detailed
                      metrics and demographic breakdowns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Frontend</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• React.js 19 with TypeScript</li>
                  <li>• TailwindCSS for styling</li>
                  <li>• Wouter for routing</li>
                  <li>• shadcn/ui components</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Visualization</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Mapbox GL JS for maps</li>
                  <li>• react-map-gl integration</li>
                  <li>• Chart.js for graphs</li>
                  <li>• D3.js for color scales</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Backend</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Node.js + Express</li>
                  <li>• tRPC for type-safe API</li>
                  <li>• Drizzle ORM</li>
                  <li>• MySQL database</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
