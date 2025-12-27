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

## Feature: Berlin City Outline
- [x] Find Berlin city boundary GeoJSON or SVG
- [x] Convert to SVG path coordinates
- [x] Add clipPath to BerlinGridMap component
- [x] Clip gradient grid to Berlin city shape
- [x] Test outline renders correctly

## Homepage Design & Psychology Audit
- [x] Check logo size and background (reduced to 60px, transparent with mix-blend-mode)
- [x] Review color psychology and emotional triggers (added trust signals, urgency, social proof)
- [x] Verify call-to-action buttons are prominent and compelling (added 2 CTAs)
- [x] Check visual hierarchy and user flow
- [x] Ensure mobile responsiveness

## All Cities Data Verification
- [ ] Verify all 15 cities exist in database
- [ ] Check each city has complete data (demographics, prices, ecology, etc.)
- [ ] Test city pages load correctly for all cities
- [ ] Verify maps/charts work for non-Berlin cities
- [ ] Ensure consistent data quality across cities

## Extend Historical Data to 10 Years (2015-2024)
- [x] Update homepage stats text from "2020-2024" to "2015-2024"
- [x] Add ecology data for years 2015-2019 (all 15 cities)
- [x] Add vehicles data for years 2015-2019 (all 15 cities)
- [x] Add property prices for years 2015-2019 (districts with data)
- [x] Add unemployment data for years 2015-2019 (all 15 cities)
- [x] Add social benefits data for years 2015-2019 (all 15 cities)
- [x] Add tax burden data for years 2015-2019 (all 15 cities)
- [x] Add community growth data for years 2015-2019 (all 15 cities)
- [x] Update charts to show 10-year timeline
- [x] Test all graphs display correctly with extended data

## User System & Authentication
- [x] Add Google OAuth provider alongside Manus OAuth
- [x] Create login page with provider selection
- [x] Update user schema to store OAuth provider info
- [x] Add user avatar field to schema

## User Profile & Settings
- [x] Create user profile page (/profile)
- [x] Create settings page (/settings) with tabs:
  - [x] Profile settings (name, email, avatar display)
  - [x] Notification preferences (email, government alerts, price alerts)
  - [ ] Saved cities management (UI ready, backend pending)
  - [x] Community preference selection
- [ ] Add avatar upload functionality with S3 storage (placeholder ready)

## Notifications System
- [ ] Create notifications table in schema
- [ ] Add notification preferences table
- [ ] Implement notification types:
  - [ ] Government decisions alerts
  - [ ] Property price changes (threshold-based)
  - [ ] New migration events
  - [ ] Weekly/monthly email digest
- [ ] Create notifications API endpoints
- [ ] Build notifications UI component
- [ ] Add notification bell icon in header

## Saved Cities & Personalization
- [x] Create savedCities table in schema
- [x] Add "Save City" button on city pages
- [ ] Implement save city backend (tRPC mutation)
- [ ] Create user dashboard showing saved cities
- [x] Add browsingHistory table to schema
- [ ] Implement personalized recommendations based on saved cities

## City Comparison Tool
- [ ] Create comparison page (/compare)
- [ ] Add city selector (multi-select, max 3 cities)
- [ ] Build side-by-side comparison table:
  - [ ] Unemployment rates
  - [ ] Tax burden
  - [ ] Property prices
  - [ ] Community growth
  - [ ] Air quality
- [ ] Add export to PDF/Excel functionality

## Additional Features
- [ ] Add "Compare" button on city pages
- [ ] Create user dashboard (/dashboard) as landing page after login
- [ ] Add quick actions: "Add to favorites", "Set alert", "Compare"
- [ ] Implement search functionality for cities

## Variant 1: Safety & Legalization (Critical Priority)

### Phase 1: Rewrite Dangerous UI Texts
- [x] Homepage: Remove "YOUR taxes", "WHO benefits" language
- [x] Replace "Immigration → Property Prices" with "Demographic change indicators vs housing market dynamics"
- [x] Remove emotional accusatory questions
- [x] Change "government decisions" to "policy changes"
- [x] Rewrite CTA buttons to neutral academic tone
- [x] Add "Research & Educational Purpose" badge
- [x] Add disclaimer footer with correlation ≠ causation warning

### Phase 2: Methodology Page
- [x] Create /methodology page
- [x] Add "Correlation ≠ Causation" disclaimer
- [x] List alternative hypotheses (zoning policy, interest rates, construction delays, investor activity)
- [x] Document data sources and limitations
- [x] Add "Educational & Research Purpose" statement
- [x] Include confidence intervals explanation
- [x] Add data limitations section
- [x] Add appropriate vs inappropriate uses
- [x] Add contact email for research inquiries

### Phase 3: Architectural Separation
- [x] Create toggle "Show Interpretations" (off by default)
- [x] Separate data layer from interpretation layer
- [x] Make narrative blocks optional
- [x] Add ability to disable insights per user preference
- [x] Ensure neutral engine can work standalone
- [x] Create InterpretationToggle component with localStorage persistence
- [x] Create useShowInterpretations hook for components
- [x] Rewrite GovernmentImpact page with clear data/interpretation separation

### Phase 4: Legal Protection
- [x] Create Terms of Service page
- [x] Create Privacy Policy (GDPR compliant)
- [x] Add disclaimer in footer
- [x] Add "Research Tool" badge/label
- [x] Include "Not Financial/Legal Advice" warning
- [x] Add footer links to Terms, Privacy, Methodology on homepage
- [x] Add routes for /terms and /privacy pages

### Phase 5: Content Audit
- [ ] Review all city pages for politically charged language
- [ ] Replace "blame" framing with "distributional effects analysis"
- [ ] Ensure all charts have proper context
- [ ] Add uncertainty ranges to predictions
- [ ] Remove any "who benefits" implications

### Bug Fixes
- [x] Fix logo visibility on dark background (white logo background not visible on dark theme)
