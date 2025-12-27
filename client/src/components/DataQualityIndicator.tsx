import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

export type DataQuality = "high" | "medium" | "low";

interface DataQualityIndicatorProps {
  quality: DataQuality;
  className?: string;
  showLabel?: boolean;
}

const qualityConfig = {
  high: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: "High Confidence",
    description: "Official city-level data from government statistical offices",
    emoji: "🟢"
  },
  medium: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    label: "Contextual Estimate",
    description: "Regional proxy data (NUTS 2/3) used for contextual comparison",
    emoji: "🟡"
  },
  low: {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "Exploratory Model",
    description: "Model-based estimate or statistical interpolation",
    emoji: "🔴"
  }
};

export default function DataQualityIndicator({ 
  quality, 
  className = "", 
  showLabel = false 
}: DataQualityIndicatorProps) {
  const config = qualityConfig[quality];
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${className} cursor-help`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
          {showLabel && (
            <span className={`text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">{config.emoji} {config.label}</p>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// Helper component for chart titles with quality indicator
interface ChartTitleWithQualityProps {
  title: string;
  quality: DataQuality;
  subtitle?: string;
}

export function ChartTitleWithQuality({ title, quality, subtitle }: ChartTitleWithQualityProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <DataQualityIndicator quality={quality} />
    </div>
  );
}
