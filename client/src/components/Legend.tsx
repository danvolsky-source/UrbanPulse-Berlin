import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface LegendItem {
  label: string;
  color: string;
  value?: string;
}

export interface LegendProps {
  title: string;
  items: LegendItem[];
  gradient?: {
    colors: string[];
    labels: string[];
  };
}

/**
 * Reusable Legend Component for displaying color-coded ranges
 * Can display discrete items or a continuous gradient
 */
export default function Legend({ title, items, gradient }: LegendProps) {
  return (
    <Card className="bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {gradient ? (
          <div className="space-y-2">
            <div
              className="h-8 rounded"
              style={{
                background: `linear-gradient(to right, ${gradient.colors.join(", ")})`,
              }}
            />
            <div className="flex justify-between text-xs">
              {gradient.labels.map((label, idx) => (
                <span key={idx} className="text-muted-foreground">
                  {label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.value && (
                  <span className="text-sm font-medium">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
