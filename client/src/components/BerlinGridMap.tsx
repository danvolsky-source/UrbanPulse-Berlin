import React, { useMemo, useState } from "react";
import { trpc } from "../lib/trpc";
import { scaleSequential } from "d3-scale";
import { interpolateTurbo } from "d3-scale-chromatic";
import { BERLIN_OUTLINE_PATH } from "../lib/berlinOutline";

type BerlinGridMapProps = {
  year: number;
  month: number;
};

export const BerlinGridMap: React.FC<BerlinGridMapProps> = ({ year, month }) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number; value: number; district: string } | null>(null);
  
  const { data, isLoading } = trpc.berlinGrid.useQuery({
    year,
    month,
    cellsPerRow: 80,
  });

  // TEMPORARILY: hard-coded bbox for Berlin in SVG coordinates
  const width = 700;
  const height = 500;

  const gridCells = useMemo(() => {
    if (!data || !data.districts.length) return null;

    const prices = data.districts
      .map((d) => d.avgPrice)
      .filter((v): v is number => v != null);

    // If no prices, use mock data for visualization
    if (!prices.length) {
      const mockPrices = [3500, 4200, 5100, 4800, 3900, 5500, 4600, 4100, 3800, 5200, 4400, 3700];
      prices.push(...mockPrices);
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const colorScale = scaleSequential(interpolateTurbo).domain([min, max]);

    const cells: {
      x: number;
      y: number;
      w: number;
      h: number;
      value: number;
      districtName: string;
    }[] = [];

    const cols = data.cellsPerRow;
    const rows = Math.round((height / width) * cols);
    const cellW = width / cols;
    const cellH = height / rows;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // On this step we don't use real district geometry yet,
        // just paint the grid with price range.
        const district =
          data.districts[(i + j * cols) % data.districts.length];
        const price = district.avgPrice ?? prices[(i + j) % prices.length];
        if (!price) continue;

        cells.push({
          x: i * cellW,
          y: j * cellH,
          w: cellW,
          h: cellH,
          value: price,
          districtName: district.name,
        });
      }
    }

    return { cells, colorScale, min, max };
  }, [data]);

  if (isLoading || !gridCells) {
    return <div className="text-slate-400 text-sm">Loading Berlin map…</div>;
  }

  const { cells, colorScale, min, max } = gridCells;

  return (
    <div className="relative bg-slate-950 rounded-2xl p-4">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="rounded-xl overflow-hidden"
      >
        <defs>
          {/* Berlin city outline as clipPath */}
          <clipPath id="berlin-clip">
            <path d={BERLIN_OUTLINE_PATH} />
          </clipPath>
        </defs>

        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#020617"
        />

        {/* Grid cells clipped to Berlin shape */}
        <g clipPath="url(#berlin-clip)">
          {cells.map((c, idx) => (
            <rect
              key={idx}
              x={c.x}
              y={c.y}
              width={c.w + 0.5}
              height={c.h + 0.5}
              fill={colorScale(c.value) as string}
              opacity={hoveredCell && Math.abs(hoveredCell.x - c.x) < 5 && Math.abs(hoveredCell.y - c.y) < 5 ? 1 : 0.85}
              style={{ transition: 'opacity 0.1s' }}
              onMouseEnter={() => setHoveredCell({ x: c.x, y: c.y, value: c.value, district: c.districtName })}
              onMouseLeave={() => setHoveredCell(null)}
            />
          ))}
        </g>

        {/* Berlin outline stroke */}
        <path
          d={BERLIN_OUTLINE_PATH}
          fill="none"
          stroke="#475569"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>

      {/* Hover Tooltip */}
      {hoveredCell && (
        <div 
          className="absolute bg-slate-900/95 border border-slate-700 rounded-lg px-3 py-2 pointer-events-none"
          style={{
            left: hoveredCell.x + 100,
            top: hoveredCell.y + 50,
          }}
        >
          <div className="text-xs font-semibold text-slate-200">{hoveredCell.district}</div>
          <div className="text-sm text-cyan-400">€{hoveredCell.value.toLocaleString()}/m²</div>
        </div>
      )}

      {/* Beautiful Legend with Gradient */}
      <div className="absolute right-4 top-4 bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg border border-slate-700">
        <div className="text-xs font-semibold text-slate-200 mb-2">Property Prices / m²</div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] text-slate-400">€{min.toLocaleString()}</div>
          <div 
            className="w-24 h-3 rounded"
            style={{
              background: `linear-gradient(to right, ${colorScale(min)}, ${colorScale((min + max) / 2)}, ${colorScale(max)})`
            }}
          />
          <div className="text-[10px] text-slate-400">€{max.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};
