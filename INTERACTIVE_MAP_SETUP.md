# Interactive Map Platform - Project Setup Guide

This document describes the interactive map-based analytical platform setup for GALOR, inspired by the Berlin Real Estate Insights design.

## Overview

The platform provides an interactive map visualization system with:
- Multi-layer map views with GeoJSON district boundaries
- Color-coded price ranges and demographics
- Historical market trend analysis with Chart.js
- Comprehensive analytics dashboard

## Technology Stack

### Frontend
- **React.js 19** with TypeScript
- **TailwindCSS 4** for styling
- **Wouter** for client-side routing
- **shadcn/ui** for UI components

### Visualization Libraries
- **Mapbox GL JS** (`mapbox-gl@3.17.0`) - Interactive maps
- **react-map-gl** (`@7.1.7`) - React wrapper for Mapbox
- **Chart.js** (`chart.js` + `react-chartjs-2`) - Market trends graphs
- **D3.js** (`d3-scale`, `d3-scale-chromatic`) - Color scales for heat maps

### Backend
- **Node.js + Express**
- **tRPC** - Type-safe API
- **Drizzle ORM** - Database management
- **MySQL/TiDB** - Database

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Legend.tsx              # Reusable color-coded legend
│   │   ├── MarketTrendsChart.tsx   # Chart.js line graph component
│   │   ├── Map.tsx                 # Base map component
│   │   ├── MapboxBerlinMap.tsx     # Mapbox integration
│   │   └── ui/                     # shadcn/ui components
│   ├── pages/
│   │   ├── Overview.tsx            # Platform overview page
│   │   ├── MapView.tsx             # Interactive map view
│   │   ├── Trends.tsx              # Market trends page
│   │   └── Analytics.tsx           # Analytics dashboard
│   └── App.tsx                     # Main app with routing
└── public/
    ├── berlin_districts.geojson    # District boundaries
    └── berlin_zones_example.geojson # Example data with prices
```

## Setup Instructions

### 1. Install Dependencies

The following packages have been added:
```bash
npm install chart.js react-chartjs-2 --legacy-peer-deps
```

All other required dependencies are already installed:
- `mapbox-gl@3.17.0`
- `react-map-gl@7.1.7`
- `d3-scale@4.0.2`
- `d3-scale-chromatic@3.1.0`
- `tailwindcss@4.1.14`

### 2. Environment Configuration

Create a `.env` file with:
```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-jwt-secret
```

Get a free Mapbox token from [mapbox.com](https://account.mapbox.com/access-tokens/).

### 3. Build and Run

```bash
# Type check
npm run check

# Build for production
npm run build

# Start development server
npm run dev
```

The application runs at: `http://localhost:3000`

## Pages and Features

### 1. Overview Page (`/overview`)
- Platform statistics (cities, districts, data points)
- Quick navigation cards to Map, Trends, and Analytics
- Feature highlights and technology stack overview

**Screenshot:** ![Overview](https://github.com/user-attachments/assets/d85d84d7-f405-4fd4-b2bd-e91b6b3bf037)

### 2. Map View (`/map`)
- Interactive Mapbox GL map with Berlin districts
- Layer controls:
  - Districts only
  - Property prices heat map
  - Population density
- Infrastructure markers (mosques, churches, synagogues, cultural centers, stores)
- Year slider (2020-2024) for time-based analysis
- Click districts for detailed information panel
- Color-coded legend with gradient visualization

**Features:**
- GeoJSON-based district boundaries
- D3.js color scales (red=expensive, yellow=mid-range, green=affordable)
- Interactive popups with price per m², population, area
- Filter infrastructure by type

### 3. Trends Page (`/trends`)
- Market trend indicators (price growth, rental yield, vacancy rate)
- Multiple Chart.js line graphs:
  - Real estate price trends (5-year view)
  - Population demographics
  - Urban development metrics
- Key insights section with detailed analysis

**Screenshot:** ![Trends](https://github.com/user-attachments/assets/fb36d878-a3c8-426b-89b3-8576f2f024b7)

**Dummy Data:**
- Historical property prices (2020-2024)
- Rental prices per m²
- Population growth and foreign residents %
- Construction projects and infrastructure investments

### 4. Analytics Page (`/analytics`)
- Comprehensive platform capabilities overview
- Data sources and analysis methods
- Visualization tools documentation
- Technology stack details
- Interactive map features explanation

**Screenshot:** ![Analytics](https://github.com/user-attachments/assets/e724c60a-85f7-47d7-8b1f-d47c5a82da14)

## Components

### Legend Component
```typescript
import Legend from "@/components/Legend";

<Legend
  title="Price Range"
  gradient={{
    colors: ["#10b981", "#fbbf24", "#ef4444"],
    labels: ["€3,200", "€4,800", "€6,800"]
  }}
/>
```

Features:
- Discrete items or continuous gradient modes
- Flexible styling with TailwindCSS
- Reusable across different visualizations

### Market Trends Chart
```typescript
import MarketTrendsChart from "@/components/MarketTrendsChart";

<MarketTrendsChart
  title="Real Estate Price Trends"
  data={marketData}
  height={300}
/>
```

Features:
- Chart.js powered line graphs
- Multiple data series support
- Responsive design
- Dark theme optimized
- Interactive tooltips

## GeoJSON Data

### Example Zone Data Structure
```json
{
  "type": "Feature",
  "properties": {
    "name": "Mitte",
    "nameEn": "Mitte",
    "pricePerSqm": 6800,
    "priceCategory": "expensive",
    "population": 385748,
    "description": "Central district with high demand"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[...]]
  }
}
```

Price categories:
- **Affordable**: €3,200-€3,800/m² (green)
- **Mid-range**: €4,500-€5,200/m² (yellow)
- **Expensive**: €5,900-€6,800/m² (red)

## Navigation

Routes configured in `App.tsx`:
- `/` - Home
- `/overview` - Platform Overview
- `/map` - Interactive Map View
- `/trends` - Market Trends
- `/analytics` - Analytics Dashboard
- `/settings` - Settings

## State Management

Using React Context API:
- `ThemeContext` - Theme management (dark/light)
- `CityContext` - City selection state
- Component-level state with `useState` for UI interactions

## Styling

TailwindCSS with:
- Custom color palette in `index.css`
- Dark theme as default
- shadcn/ui component library
- Responsive design (mobile, tablet, desktop)
- CSS animations with `tailwindcss-animate`

## Development Best Practices

1. **Type Safety**: Full TypeScript support with strict mode
2. **Component Reusability**: Shared components for Legend, Charts, Maps
3. **Performance**: 
   - Code splitting with dynamic imports
   - Lazy loading for heavy components
   - Optimized Mapbox rendering
4. **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
5. **Error Handling**: Error boundaries, fallback UI

## Testing

```bash
# Run type checks
npm run check

# Build to verify no errors
npm run build
```

## Future Enhancements

Potential additions:
- [ ] Real-time data integration via tRPC
- [ ] Advanced filtering and search
- [ ] PDF report generation
- [ ] User preferences persistence
- [ ] Multi-city comparison views
- [ ] 3D building visualization
- [ ] Heatmap animations over time

## License

MIT License - See LICENSE file

## Acknowledgments

- Maps powered by [Mapbox](https://mapbox.com)
- Charts by [Chart.js](https://chartjs.org)
- UI components by [shadcn/ui](https://ui.shadcn.com)
- Color scales by [D3.js](https://d3js.org)
