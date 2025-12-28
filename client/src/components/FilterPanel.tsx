import { Filter, TrendingUp } from "lucide-react";
import { useState } from "react";

interface KPICard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

const kpiData: KPICard[] = [
  { label: "Avg Property Price", value: "€450K", change: "+5.2%", trend: "up" },
  { label: "Population Density", value: "4,200/km²", change: "+2.1%", trend: "up" },
  { label: "Green Space", value: "28%", change: "-1.3%", trend: "down" },
];

export function FilterPanel() {
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Filters & KPI</h3>
      </div>

      {/* Filters Section */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium mb-2 block">District</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 text-xs border rounded-lg bg-background"
          >
            <option value="all">All Districts</option>
            <option value="mitte">Mitte</option>
            <option value="charlottenburg">Charlottenburg</option>
            <option value="kreuzberg">Kreuzberg</option>
            <option value="prenzlauer">Prenzlauer Berg</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium mb-2 block">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-background"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-background"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-xs font-semibold">Key Metrics</h4>
        </div>
        {kpiData.map((kpi) => (
          <div
            key={kpi.label}
            className="p-3 rounded-lg border bg-background hover:shadow-sm transition-shadow"
          >
            <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-lg font-semibold">{kpi.value}</div>
              <div
                className={`text-xs font-medium ${
                  kpi.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {kpi.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
