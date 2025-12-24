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
- [x] Create first checkpoint
- [x] Create final checkpoint with multi-city support

## Multi-City Expansion
- [x] Add demographic data for Munich (München)
- [x] Add demographic data for Hamburg
- [x] Add demographic data for Cologne (Köln)
- [x] Update backend API to support city selection
- [x] Create city selector component
- [x] Update homepage to show selected city data
- [x] Create maps for Munich, Hamburg, Cologne
- [x] Add city-specific district boundaries
- [x] Test all cities thoroughly

## GitHub Documentation
- [x] Write comprehensive README.md
- [x] Add installation instructions
- [x] Document database setup
- [x] Add API documentation
- [ ] Include screenshots (optional)
- [ ] Add license file (optional)
- [ ] Create .gitignore for sensitive files (optional)

## Bug Fixes
- [x] Fix missing key props in list rendering (React warning)
- [x] Fix NaN% display in community composition table
- [x] Fix communityComposition API endpoint input validation
- [x] Remove duplicate data processing in communityComposition endpoint
