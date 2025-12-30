# GALOR by SkyMind

[![CI](https://github.com/danvolsky-source/GALOR/workflows/CI/badge.svg)](https://github.com/danvolsky-source/GALOR/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org/)

**GALOR by SkyMind** — Analytical platform revealing structural connections between government decisions and measurable urban outcomes.

## Features

### Multi-City Analytics
Track urban development trends across major global cities. Switch between cities seamlessly using the integrated city selector.

### Government Impact Dashboard
View real-time impact analysis including:
- **Policy Timeline**: Major government decisions with year-over-year change indicators
- **Urban Metrics**: Housing prices, employment, demographics with population percentages
- **5-Year Progression Charts**: Visualizations showing trends over time

### Interactive Heat Maps
Explore city districts through interactive maps featuring:
- District boundaries color-coded by price/impact metrics
- Infrastructure markers for key urban developments
- Click-to-view district profiles with detailed statistics
- Real-time data overlays

### District Profiles
Deep-dive into individual districts with:
- Population demographics and composition
- Property price trends over time
- Infrastructure and development listings
- Correlation analysis between policies and outcomes

### Data Visualization
- Line charts for demographic trends
- Property price evolution graphs  
- Sparkline indicators for quick trend analysis
- Interactive tooltips and legends

## Technology Stack

### Backend
- Node.js with Express
- tRPC for end-to-end type-safe APIs
- Drizzle ORM
- MySQL/TiDB
- Vitest for testing

### Frontend  
- React 19 with TypeScript
- Tailwind CSS 4
- Mapbox GL for interactive maps
- Recharts for data visualization
- shadcn/ui component library
- Wouter for routing

## Installation

### Prerequisites
- Node.js 22.x or higher
- MySQL 8.0+ or TiDB compatible database
- pnpm package manager

### Setup

1. Clone the repository
```bash
git clone https://github.com/danvolsky-source/GALOR.git
cd GALOR
```

2. Install dependencies
```bash
pnpm install
```

3. Configure environment
Create a `.env` file:
```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-jwt-secret
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

4. Initialize database
```bash
pnpm db:push
```

5. Start development server
```bash
pnpm dev
```

The application will be available at http://localhost:3000

## License
MIT License - see LICENSE file

## Acknowledgments
- Built with [Manus](https://manus.im/)
- Maps by [Mapbox](https://www.mapbox.com/)
- UI by [shadcn/ui](https://ui.shadcn.com/)
- Charts by [Recharts](https://recharts.org/)

---

**GALOR by SkyMind** - Wave of light, revealing urban truth.
