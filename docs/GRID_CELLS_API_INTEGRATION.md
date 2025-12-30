GRID_CELLS_API_INTEGRATION.md  # Grid Cells API Integration Guide

## Overview
This document provides comprehensive instructions for completing the integration of the Grid Cells API with the DistrictHeatmap visualization component.

## ✅ Completed Work

### 1. Backend Infrastructure (COMPLETED)
- **Database Schema**: `gridCells` table in `drizzle/schema.ts`
  - Columns: city, zoomLevel, cellX, cellY, metrics (JSON)
  - Support for multi-zoom level grid data

- **Seed Script**: `scripts/seed-grid-cells.ts`
  - Generates test data for Berlin at multiple zoom levels
  - Creates mosaic-style grid cells with randomized metrics

- **tRPC API Endpoint**: `server/routers.ts` (lines 428-443)
  - Route: `gridCells.getGrid`
  - Parameters: city, zoomLevel, bounds
  - Supports efficient querying with bounding box filters

- **Database Query Function**: `server/db.ts` (lines 892-913)
  - Function: `getGridCells(city, zoomLevel, bounds)`
  - Includes safety limit of 10,000 records
  - Optimized for spatial queries

- **Frontend Preparation**: `client/src/components/DistrictHeatmap.tsx`
  - tRPC import added (line 3)
  - Ready for API integration

## 📋 Remaining Integration Steps

### Step 1: Add tRPC Hook to DistrictHeatmap Component

**Location**: `client/src/components/DistrictHeatmap.tsx`

**Add inside the component function** (after line ~155, after useState declarations):

```typescript
// Fetch grid cells data from API
const { data: gridCellsData } = trpc.gridCells.getGrid.useQuery({
  city: cityName,
  zoomLevel: 12, // Adjust based on your zoom requirements
  bounds: {} // Add bounds if implementing viewport-based loading
}, {
  enabled: !!cityName, // Only fetch when city is available
});
```

### Step 2: Update renderMosaicRects Function

**Replace the current client-side generation** with API data:

```typescript
function renderMosaicRectsFromAPI(gridCells: any[], baseHex: string) {
  if (!gridCells || gridCells.length === 0) {
    // Fallback to client-side generation if no data
    return renderMosaicRects(bounds, baseHex, seed);
  }
  
  return gridCells.map((cell: any) => {
    // Use metrics from API to determine shading
    const metricValue = cell.metrics?.populationDensity || 0.5;
    const shadeAmt = (metricValue - 0.5) * 0.9;
    const opacity = clamp01(0.35 + metricValue * 0.55);
    
    return (
      <rect
        key={`${cell.cellX}-${cell.cellY}`}
        x={cell.cellX * GRID_CELL + GRID_GAP}
        y={cell.cellY * GRID_CELL + GRID_GAP}
        width={GRID_CELL - GRID_GAP * 2}
        height={GRID_CELL - GRID_GAP * 2}
        fill={shade(baseHex, shadeAmt)}
        opacity={opacity}
      />
    );
  });
}
```

### Step 3: Run the Seed Script

**Command**:
```bash
cd /path/to/GALOR
npm run tsx scripts/seed-grid-cells.ts
```

Or if using pnpm:
```bash
pnpm tsx scripts/seed-grid-cells.ts
```

**This will**:
- Generate ~10,000 grid cells for Berlin
- Create data at zoom levels 10, 11, and 12
- Populate with realistic mock metrics

### Step 4: Add Database Indexes

**Create migration file**: `drizzle/migrations/add_grid_cells_indexes.sql`

```sql
-- Add indexes for efficient spatial queries
CREATE INDEX idx_grid_cells_city_zoom ON grid_cells(city, zoomLevel);
CREATE INDEX idx_grid_cells_coordinates ON grid_cells(cellX, cellY);
CREATE INDEX idx_grid_cells_spatial ON grid_cells(city, zoomLevel, cellX, cellY);
```

**Run migration**:
```bash
npm run drizzle-kit push
```

### Step 5: Add TypeScript Types

**Create**: `shared/types/gridCells.ts`

```typescript
export interface GridCell {
  id: number;
  city: string;
  zoomLevel: number;
  cellX: number;
  cellY: number;
  metrics: {
    populationDensity?: number;
    propertyPrice?: number;
    airQuality?: number;
    greenery?: number;
  };
}

export interface GridCellsQueryInput {
  city: string;
  zoomLevel: number;
  bounds?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
}
```

### Step 6: Optimize Rendering for Large Datasets

**Add viewport-based filtering**:

```typescript
const getViewportBounds = (svgElement: SVGElement) => {
  const bbox = svgElement.getBBox();
  return {
    minX: Math.floor(bbox.x / GRID_CELL),
    maxX: Math.ceil((bbox.x + bbox.width) / GRID_CELL),
    minY: Math.floor(bbox.y / GRID_CELL),
    maxY: Math.ceil((bbox.y + bbox.height) / GRID_CELL),
  };
};

// Use in query:
const { data: gridCellsData } = trpc.gridCells.getGrid.useQuery({
  city: cityName,
  zoomLevel: currentZoom,
  bounds: viewportBounds,
});
```

## 🚀 Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to** the city dashboard with Berlin selected

3. **Verify** that the heatmap loads with grid cells from the API

4. **Check browser console** for any errors

5. **Test different zoom levels** (if implemented)

## 📊 Performance Considerations

- **Safety Limit**: Current limit is 10,000 cells per query
- **Viewport Filtering**: Implement bounds-based queries for better performance
- **Caching**: tRPC automatically caches queries
- **Memoization**: Consider using React.memo for expensive renders

## 🔄 Migration from Mock Data

**Current state**: Component uses client-side generated mock data
**Target state**: Component uses real data from database via API
**Transition**: Can maintain mock data as fallback during development

## 📝 Next Steps After Integration

1. Replace mock metrics with real statistical data
2. Import actual GeoJSON data for accurate cell positioning
3. Add zoom level controls to UI
4. Implement data refresh mechanisms
5. Add error handling and loading states
6. Create admin interface for data management

## 🐛 Troubleshooting

**Issue**: "gridCells table doesn't exist"
**Solution**: Run `npm run drizzle-kit push` to sync schema

**Issue**: "No data returned from API"
**Solution**: Run the seed script first to populate test data

**Issue**: "Performance is slow"
**Solution**: Add database indexes and implement viewport-based queries

**Issue**: "tRPC import not found"
**Solution**: Check that `@/lib/trpc` path is configured in tsconfig.json

## 📚 Related Files

- **Schema**: `drizzle/schema.ts` (gridCells table)
- **Seed Script**: `scripts/seed-grid-cells.ts`
- **API Router**: `server/routers.ts` (gridCells router)
- **DB Queries**: `server/db.ts` (getGridCells function)
- **Frontend**: `client/src/components/DistrictHeatmap.tsx`

## ✨ API Usage Example

```typescript
// In any React component
import { trpc } from '@/lib/trpc';

function MyComponent() {
  const { data, isLoading, error } = trpc.gridCells.getGrid.useQuery({
    city: 'Berlin',
    zoomLevel: 12,
    bounds: {
      minX: 0,
      maxX: 100,
      minY: 0,
      maxY: 100,
    },
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>Found {data?.length} grid cells</div>;
}
```

---

**Last Updated**: December 30, 2025
**Status**: Backend Complete ✅ | Frontend Integration Pending 🚧
**Contact**: For questions, check the GitHub issues or discussions.
