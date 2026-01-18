import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarketTrendsChart from "@/components/MarketTrendsChart";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function Trends() {
  // Additional dummy data for different trend visualizations
  const berlinTrends = {
    labels: [
      "Jan '20",
      "Apr '20",
      "Jul '20",
      "Oct '20",
      "Jan '21",
      "Apr '21",
      "Jul '21",
      "Oct '21",
      "Jan '22",
      "Apr '22",
      "Jul '22",
      "Oct '22",
      "Jan '23",
      "Apr '23",
      "Jul '23",
      "Oct '23",
      "Jan '24",
      "Apr '24",
      "Jul '24",
      "Oct '24",
    ],
    datasets: [
      {
        label: "Average Price per m²",
        data: [
          4200, 4250, 4300, 4400, 4500, 4600, 4750, 4850, 5000, 5100, 5200,
          5300, 5400, 5500, 5550, 5600, 5650, 5700, 5750, 5800,
        ],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
      },
      {
        label: "Rental Price per m²",
        data: [
          12, 12.2, 12.5, 12.8, 13, 13.3, 13.6, 14, 14.3, 14.6, 15, 15.3, 15.6,
          16, 16.2, 16.5, 16.8, 17, 17.2, 17.5,
        ],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
      },
    ],
  };

  const populationTrends = {
    labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Total Population (millions)",
        data: [3.67, 3.68, 3.69, 3.71, 3.73, 3.75],
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
      },
      {
        label: "Foreign Residents (%)",
        data: [18.5, 19.2, 19.8, 20.5, 21.2, 22.0],
        borderColor: "rgb(236, 72, 153)",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
      },
    ],
  };

  const developmentTrends = {
    labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "New Construction Projects",
        data: [450, 380, 320, 410, 520, 580],
        borderColor: "rgb(245, 158, 11)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
      },
      {
        label: "Infrastructure Investments (€M)",
        data: [850, 920, 780, 1100, 1250, 1400],
        borderColor: "rgb(6, 182, 212)",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
      },
    ],
  };

  const trendIndicators = [
    {
      title: "Property Price Growth",
      value: "+38%",
      period: "2020-2024",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Rental Yield",
      value: "3.6%",
      period: "Current Average",
      trend: "stable",
      icon: Activity,
      color: "text-blue-500",
    },
    {
      title: "Vacancy Rate",
      value: "-2.1%",
      period: "Year over Year",
      trend: "down",
      icon: TrendingDown,
      color: "text-red-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Market Trends</h1>
          <p className="text-muted-foreground">
            Historical trends and market analysis for Berlin real estate
          </p>
        </div>

        {/* Trend Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {trendIndicators.map((indicator, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {indicator.title}
                  </CardTitle>
                  <indicator.icon className={`w-5 h-5 ${indicator.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{indicator.value}</div>
                <p className="text-xs text-muted-foreground">
                  {indicator.period}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <MarketTrendsChart
            title="Real Estate Price Trends - Berlin"
            data={berlinTrends}
            height={300}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketTrendsChart
              title="Population Demographics"
              data={populationTrends}
              height={250}
            />

            <MarketTrendsChart
              title="Urban Development"
              data={developmentTrends}
              height={250}
            />
          </div>
        </div>

        {/* Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Strong Price Growth
                </h3>
                <p className="text-sm text-muted-foreground">
                  Berlin real estate prices have shown consistent growth over
                  the past 5 years, with average prices increasing by 38%.
                  Central districts continue to lead growth trends.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Increasing Diversity
                </h3>
                <p className="text-sm text-muted-foreground">
                  Foreign resident population has grown from 18.5% to 22%,
                  reflecting Berlin's status as an international hub.
                  Infrastructure development is keeping pace with demographic
                  changes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  Development Boom
                </h3>
                <p className="text-sm text-muted-foreground">
                  Construction activity recovered from pandemic lows, with 580
                  new projects in 2024. Infrastructure investments reached €1.4
                  billion, focusing on sustainable urban development.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
