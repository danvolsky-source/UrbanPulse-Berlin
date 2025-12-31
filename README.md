# GALOR

**GALOR by SkyMind** is an analytical platform that reveals how government decisions translate into real, measurable urban outcomes.

GALOR connects policy, data, and geography — exposing structural cause-and-effect relationships within cities.

## Core Capabilities

### Multi-City Intelligence

- Analyze and compare urban dynamics across major global cities.
- Instantly switch cities through a unified analytical interface.

### Government Impact Analysis

Understand how decisions shape cities through:

- Policy timelines with year-over-year change indicators
- Urban metrics: housing prices, employment, demographics
- Multi-year trend analysis highlighting long-term effects

### Interactive Spatial Intelligence

Explore cities through high-resolution, interactive maps:

- District-level heatmaps based on price and impact metrics
- Infrastructure and development markers
- Click-through district views with detailed statistics
- Live data overlays tied to policy context

### District Intelligence Profiles

Deep analysis at the district level:

- Demographic composition
- Property price evolution
- Infrastructure and development activity
- Correlation between policy decisions and observed outcomes

### Advanced Data Visualization

- Long-term trend charts
- Property price evolution graphs
- Compact sparkline indicators
- Interactive tooltips and contextual legends

## Technology Stack

### Backend

- Node.js + Express
- tRPC (end-to-end type safety)
- Drizzle ORM
- MySQL / TiDB
- Vitest

### Frontend

- React 19 + TypeScript
- Tailwind CSS 4
- Mapbox GL
- Recharts
- shadcn/ui
- Wouter

## Installation

### Requirements

- Node.js ≥ 22
- MySQL 8+ or TiDB-compatible database
- pnpm

### Setup

```bash
git clone https://github.com/danvolsky-source/GALOR.git
cd GALOR
pnpm install
```

### Create .env:

```bash
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-jwt-secret
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

### Initialize database:

```bash
pnpm db:push
```

### Start development server:

```bash
pnpm dev
```

### Application runs at:

[http://localhost:3000](http://localhost:3000)

## 🔬 Grid Cells API

### High-Resolution Urban Heatmaps

The Grid Cells API enables fine-grained spatial analysis using a mosaic-based grid system.

### Capabilities

- Multi-zoom support (levels 10–12)
- Viewport-based spatial queries
- Metrics per cell: population density, property prices, air quality, greenery
- 10,000+ grid cells per city

### Quick Start

Generate test data:

```bash
npm run tsx scripts/seed-grid-cells.ts
```

Query grid cells:

```typescript
const { data } = trpc.gridCells.getGrid.useQuery({
  city: 'Berlin',
  zoomLevel: 12,
  bounds: { minX: 0, maxX: 100, minY: 0, maxY: 100 }
});
```

Full integration guide: `docs/GRID_CELLS_API_INTEGRATION.md`

### Grid Cells Status

✅ **Backend complete**
- tRPC endpoint: `gridCells.getGrid`
- Optimized spatial queries
- Seed scripts for realistic mock data

🚧 **Frontend integration**
- See documentation for rendering and performance strategies

## License

MIT — see LICENSE file.

## Acknowledgments

- Built with [Manus](https://manus.im)
- Maps powered by [Mapbox](https://mapbox.com)
- UI components by [shadcn/ui](https://ui.shadcn.com)
- Charts by [Recharts](https://recharts.org)

---

**GALOR by SkyMind**  
*Wave of light — revealing how cities truly work.*
