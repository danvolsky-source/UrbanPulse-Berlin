# UrbanPulse by SkyMind - TODO

## Rebranding to UrbanPulse
- [x] Copy UrbanPulse logo to client/public/
- [x] Update site title to "UrbanPulse by SkyMind"
- [x] Update homepage with new branding and tagline "Feel the heartbeat of cities"
- [x] Update meta tags and page titles
- [ ] Update README.md with new product name

## Feature: Interactive District Heatmap (Berlin Only)

### State Management
- [x] Create shared state for selected event, year (2020-2024), and filters
- [x] Add map highlight state for affected Berlin districts
- [x] Implement filter state for air quality and greenery toggles

### Geopolitical Events Interactivity
- [x] Make event cards clickable
- [x] Highlight affected Berlin districts when event is clicked
- [x] Show impact percentage on map (e.g., "EU sanctions → East Berlin districts -19%")
- [x] Add visual indicator (border/glow) for selected event

### Chart Interactivity
- [x] Make Property Prices chart clickable by year
- [x] Update map colors based on selected year (2020-2024)
- [x] Make Community Growth chart clickable
- [x] Show community concentration on map when clicked
- [x] Sync all charts with selected year

### Metric Toggles Interactivity
- [x] Connect Air quality toggle to green overlay on clean districts
- [x] Connect Greenery proximity toggle to highlight parks/green areas
- [x] Show EV% as icons on high-adoption districts
- [x] Show/hide layers based on toggle state

### Berlin District Data
- [x] Use real Berlin district names (Mitte, Kreuzberg, Prenzlauer Berg, etc.)
- [x] Map real price data to districts
- [x] Map community growth data to districts
- [x] Map ecology data to districts

### Testing
- [x] Test event click highlights correct districts
- [x] Test chart year selection updates map colors
- [x] Test toggle switches show/hide overlays
- [x] Test all interactions work smoothly
- [ ] Create checkpoint

## Feature: Professional Berlin Grid Heatmap
- [x] Replace childish SVG map with professional grid visualization
- [x] Implement 80x57 fine-grained grid with gradient color palette
- [x] Add d3-scale and d3-scale-chromatic for Turbo color interpolation
- [x] Create berlinGrid API endpoint in server/routers.ts
- [x] Create getBerlinGridData function in server/db.ts
- [x] Build BerlinGridMap component with hover tooltips
- [x] Add beautiful gradient legend with price range
- [x] Implement hover interactivity showing district name and price
- [x] Optimize performance by removing heavy glow filters
- [x] Test hover tooltips display correct district and price data
