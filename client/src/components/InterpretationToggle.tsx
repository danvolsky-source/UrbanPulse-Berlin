import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

/**
 * InterpretationToggle - Global toggle for showing/hiding interpretative content
 * 
 * Architectural separation: Data layer (neutral) vs Interpretation layer (subjective)
 * Default: OFF (show only neutral data)
 * When enabled: Shows AI insights, critical questions, and interpretative conclusions
 */

const STORAGE_KEY = "urbanpulse_show_interpretations";

export function InterpretationToggle() {
  const [showInterpretations, setShowInterpretations] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "true") {
      setShowInterpretations(true);
    }
  }, []);

  // Save preference to localStorage when changed
  const handleToggle = (checked: boolean) => {
    setShowInterpretations(checked);
    localStorage.setItem(STORAGE_KEY, checked.toString());
    // Dispatch custom event so other components can react
    window.dispatchEvent(new CustomEvent("interpretationToggle", { detail: { enabled: checked } }));
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg">
      <AlertTriangle className="w-5 h-5 text-cyan-400 shrink-0" />
      <div className="flex-1">
        <Label htmlFor="interpretation-toggle" className="text-sm text-slate-300 cursor-pointer">
          Show Interpretations
        </Label>
        <p className="text-xs text-slate-500 mt-0.5">
          Enable subjective analysis and AI-generated insights
        </p>
      </div>
      <Switch
        id="interpretation-toggle"
        checked={showInterpretations}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}

/**
 * Hook to check if interpretations should be shown
 * Use this in components that have interpretative content
 */
export function useShowInterpretations() {
  const [showInterpretations, setShowInterpretations] = useState(false);

  useEffect(() => {
    // Initial load from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    setShowInterpretations(saved === "true");

    // Listen for toggle changes
    const handleToggle = (e: CustomEvent) => {
      setShowInterpretations(e.detail.enabled);
    };

    window.addEventListener("interpretationToggle", handleToggle as EventListener);
    return () => {
      window.removeEventListener("interpretationToggle", handleToggle as EventListener);
    };
  }, []);

  return showInterpretations;
}
