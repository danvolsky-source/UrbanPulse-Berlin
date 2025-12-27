import { ExternalLink } from "lucide-react";
import { getCitation, type Citation as CitationType } from "@shared/citations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CitationProps {
  id: string;
  number?: number;
  inline?: boolean;
}

/**
 * Inline citation component with hover tooltip
 * Usage: <Citation id="eurostat_lfst_r_lfu3rt" number={1} />
 */
export function Citation({ id, number, inline = true }: CitationProps) {
  const citation = getCitation(id);

  if (!citation) {
    console.warn(`Citation not found: ${id}`);
    return null;
  }

  if (inline) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors cursor-help"
              onClick={(e) => e.stopPropagation()}
            >
              <sup className="text-xs font-semibold">
                [{number || id.split("_").pop()}]
              </sup>
            </a>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-sm bg-slate-800 border-slate-700 p-4">
            <CitationTooltipContent citation={citation} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Block citation for references page
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-cyan-500/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {number && (
              <span className="text-cyan-400 font-bold text-sm">[{number}]</span>
            )}
            <span className="text-slate-400 text-xs">{citation.organization}</span>
          </div>
          <h4 className="text-white font-semibold mb-1">{citation.fullName}</h4>
          {citation.datasetCode && (
            <p className="text-slate-500 text-sm mb-2">
              Dataset: <code className="bg-slate-800 px-2 py-0.5 rounded">{citation.datasetCode}</code>
            </p>
          )}
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 transition-colors"
          >
            <span className="truncate">{citation.url}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
          <p className="text-slate-500 text-xs mt-2">Accessed: {citation.accessDate}</p>
        </div>
        <CitationTypeBadge type={citation.type} />
      </div>
    </div>
  );
}

function CitationTooltipContent({ citation }: { citation: CitationType }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-slate-400 mb-1">{citation.organization}</p>
          <p className="text-sm font-semibold text-white">{citation.shortName}</p>
        </div>
        <CitationTypeBadge type={citation.type} size="sm" />
      </div>
      
      {citation.datasetCode && (
        <p className="text-xs text-slate-400">
          Dataset: <code className="bg-slate-700 px-1.5 py-0.5 rounded text-cyan-400">{citation.datasetCode}</code>
        </p>
      )}
      
      <p className="text-xs text-slate-300 leading-relaxed">{citation.fullName}</p>
      
      <div className="pt-2 border-t border-slate-700">
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          Click to view source
        </p>
      </div>
    </div>
  );
}

function CitationTypeBadge({ type, size = "md" }: { type: CitationType["type"]; size?: "sm" | "md" }) {
  const config = {
    official: {
      label: "Official",
      color: "bg-green-500/10 border-green-500/30 text-green-400"
    },
    national: {
      label: "National",
      color: "bg-blue-500/10 border-blue-500/30 text-blue-400"
    },
    government: {
      label: "Gov",
      color: "bg-purple-500/10 border-purple-500/30 text-purple-400"
    },
    market: {
      label: "Market",
      color: "bg-orange-500/10 border-orange-500/30 text-orange-400"
    }
  };

  const { label, color } = config[type];
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <span className={`inline-flex items-center border rounded-full font-medium shrink-0 ${color} ${sizeClass}`}>
      {label}
    </span>
  );
}

/**
 * Multiple citations in sequence
 * Usage: <Citations ids={["eurostat_lfst_r_lfu3rt", "destatis_property_prices"]} start={1} />
 */
export function Citations({ ids, start = 1 }: { ids: string[]; start?: number }) {
  return (
    <>
      {ids.map((id, index) => (
        <Citation key={id} id={id} number={start + index} inline />
      ))}
    </>
  );
}
