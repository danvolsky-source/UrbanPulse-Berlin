import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend as ChartLegend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ChartLegend,
  Filler
);

export interface MarketTrendsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}

export interface MarketTrendsChartProps {
  title?: string;
  data?: MarketTrendsData;
  height?: number;
}

// Dummy data for market trends (example Berlin real estate prices)
const defaultMarketData: MarketTrendsData = {
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
        4200, 4250, 4300, 4400, 4500, 4600, 4750, 4850, 5000, 5100, 5200, 5300,
        5400, 5500, 5550, 5600, 5650, 5700, 5750, 5800,
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

/**
 * Market Trends Chart Component
 * Displays historical market trends using Chart.js line graph
 */
export default function MarketTrendsChart({
  title = "Market Trends",
  data = defaultMarketData,
  height = 200,
}: MarketTrendsChartProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgb(156, 163, 175)",
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "rgb(243, 244, 246)",
        bodyColor: "rgb(209, 213, 219)",
        borderColor: "rgb(55, 65, 81)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(55, 65, 81, 0.3)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(55, 65, 81, 0.3)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          font: {
            size: 10,
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  return (
    <Card className="bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <Line data={data} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}
