import { useState } from "react";
import { Clock } from "lucide-react";

interface TimelineEvent {
  year: number;
  month: number;
  label: string;
  description?: string;
}

const timelineData: TimelineEvent[] = [
  { year: 2025, month: 1, label: "Jan 2025", description: "Latest data" },
  { year: 2024, month: 12, label: "Dec 2024" },
  { year: 2024, month: 11, label: "Nov 2024" },
  { year: 2024, month: 10, label: "Oct 2024" },
  { year: 2024, month: 9, label: "Sep 2024" },
  { year: 2024, month: 8, label: "Aug 2024" },
];

export function Timeline() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimelineEvent>(timelineData[0]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Time Period</h3>
      </div>
      
      <div className="space-y-2">
        {timelineData.map((event) => (
          <button
            key={`${event.year}-${event.month}`}
            onClick={() => setSelectedPeriod(event)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              selectedPeriod.year === event.year && selectedPeriod.month === event.month
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <div className="text-xs font-medium">{event.label}</div>
            {event.description && (
              <div className="text-xs opacity-80 mt-0.5">{event.description}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
