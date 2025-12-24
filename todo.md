# Berlin Real Estate Analytics - TODO

## Database & Backend
- [x] Create database schema for districts, demographics, community_infrastructure, city_summary
- [x] Add geospatial support for district boundaries
- [x] Seed initial Berlin demographic data (12 districts)
- [x] Implement tRPC endpoints for demographic data
- [x] Add geospatial queries for infrastructure locations
- [x] Create API for city summary statistics

## Homepage & Dashboard
- [x] Design and implement demographic dashboard
- [x] Display religious infrastructure counts (mosques, churches, synagogues)
- [x] Show year-over-year changes for infrastructure
- [x] Create community composition table with top 5 communities
- [x] Add sparkline graphs for 5-year progression
- [x] Implement visual indicators (arrows, color coding)

## Interactive Map
- [x] Integrate Mapbox for Berlin map display
- [x] Add district boundary overlays
- [x] Implement color-coding by dominant community
- [x] Create infrastructure layer with markers
- [x] Add interactive markers for mosques, synagogues, churches, ethnic stores
- [x] Implement district selection and highlighting

## District Profile Pages
- [x] Create district detail page layout
- [x] Display demographic breakdown by community
- [x] Show infrastructure locations on map
- [x] Add property price trends visualization
- [x] Implement correlation analysis between demographics and prices

## Advanced Visualizations
- [x] Implement property price correlation charts
- [x] Add time-series visualization for demographic changes
- [ ] Create heatmap for community density (optional future enhancement)
- [ ] Add filters for specific ethnic/religious groups (optional future enhancement)

## Testing & Polish
- [x] Write vitest tests for all tRPC procedures
- [x] Test map interactions and data loading
- [x] Verify geospatial queries performance
- [x] All tests passing (9/9)
- [ ] Create first checkpoint
