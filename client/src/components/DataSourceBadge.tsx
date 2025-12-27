import { Database } from "lucide-react";

export type DataSourceType = "official" | "national" | "market" | "model";

interface DataSourceBadgeProps {
  type: DataSourceType;
  source?: string;
  className?: string;
}

const SOURCE_CONFIG = {
  official: {
    label: "Official Statistical Data",
    color: "bg-green-500/10 border-green-500/30 text-green-400",
    description: "Eurostat, OECD, World Bank"
  },
  national: {
    label: "National Statistical Office",
    color: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    description: "Destatis, INSEE, ONS, US Census Bureau"
  },
  market: {
    label: "Market-Based Estimate",
    color: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    description: "Commercial real estate data providers"
  },
  model: {
    label: "Statistical Interpolation",
    color: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    description: "Model-based estimation for missing data"
  }
};

export function DataSourceBadge({ type, source, className = "" }: DataSourceBadgeProps) {
  const config = SOURCE_CONFIG[type];
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-full text-xs ${config.color} ${className}`}>
      <Database className="w-3 h-3" />
      <span className="font-medium">{config.label}</span>
      {source && <span className="opacity-75">• {source}</span>}
    </div>
  );
}

export function DataSourceNote({ type, source }: { type: DataSourceType; source?: string }) {
  const config = SOURCE_CONFIG[type];
  
  return (
    <div className={`flex items-start gap-2 p-3 border rounded-lg text-xs ${config.color}`}>
      <Database className="w-4 h-4 mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold mb-1">{config.label}</p>
        <p className="opacity-75">{source || config.description}</p>
      </div>
    </div>
  );
}
