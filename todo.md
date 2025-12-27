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

### Data Integration
- [ ] Create Eurostat API client
- [ ] Implement demographics data fetcher (urb_cpopcb)
- [ ] Implement unemployment data fetcher (lfst_r_lfu3rt)
- [ ] Create data import script for database population
- [ ] Extend unemployment data from 2020-2024 to 2015-2024
- [ ] Extend socialBenefits data from 2020-2024 to 2015-2024
- [ ] Extend taxBurden data from 2020-2024 to 2015-2024
- [ ] Update Methodology page to remove "data from 2020" limitation
- [ ] Validate imported data for all 15 cities

### Legal Compliance Fixes (from letter)
- [x] Add disclaimer: "Where city-level data is unavailable, regional (NUTS 2/3) or national indicators are used as contextual proxies"
- [x] Rename `unemploymentRate` → `regionalUnemploymentContext` in UI/API
- [x] Add label: "Regional labour market indicator (NUTS 2), used for contextual comparison"
- [x] Add disclaimer: "Community categories are analytical groupings derived from multiple secondary sources, not official Eurostat classifications"
- [x] Add disclaimer: "GDP per capita is used as an economic proxy and does not represent individual income distribution"
- [x] Add data source labels to every chart/graph (Official statistical data / National statistical offices / Market-based estimates)
- [x] Create NUTS mapping reference appendix with "City-to-region mapping follows Eurostat NUTS 2021 classification"
- [x] Replace "synthetic data" → "statistical interpolation" or "model-based estimation" everywhere
- [ ] Review 3 potentially dangerous screens identified in letter

### Citation System Implementation
- [x] Create citations reference database with Eurostat/Destatis URLs
- [x] Build Citation component with tooltip hover
- [x] Add citations to unemployment data points
- [x] Add citations to social benefits data points
- [x] Add citations to tax burden data points
- [x] Add citations to policy decisions
- [x] Create /references page with full bibliography
- [x] Add citation hover tooltips with source preview
- [x] Add References link to homepage footer

### Final Language Neutralization (from letter review)
- [x] Replace "Urban Demographic Change" headline with "Explore Urban Development Patterns" or "Analyze City Growth Trends"
- [x] Remove "Urban Policy Impact Observatory" - replaced with "Urban Development Observatory"
- [x] Remove "Policy Correlations" card - replaced with "Development Patterns"
- [x] Remove "policy decisions" from all user-facing UI (kept only in Methodology)
- [x] Ensure homepage focuses on "urban development / city context / distributional effects" not "policy"

### Data Expansion to 2015-2024
- [x] Update seed script: unemployment table 2015-2024 (currently 2020-2024)
- [x] Update seed script: socialBenefits table 2015-2024 (currently 2020-2024)
- [x] Update seed script: taxBurden table 2015-2024 (currently 2020-2024)
- [x] Run seed script to populate database with expanded data
- [x] Verify all tables have consistent 10-year coverage (2015-2024 confirmed)

### Project Renaming: Berlin Real Estate Analytics → UrbanPulse
- [ ] Update VITE_APP_TITLE environment variable (requires manual update in Settings → Secrets UI)
- [x] Update package.json name to "urbanpulse"
- [x] Update Districts.tsx page title and footer
- [x] Update README.md, CHANGELOG.md, CONTRIBUTING.md
- [x] Keep Sky-Mind as company owner (info@sky-mind.com)

### About Page Creation
- [x] Create /about page with research team section
- [x] Add funding sources disclosure
- [x] Add conflicts of interest statement
- [x] Add peer review status disclosure
- [x] Add contact information for academic inquiries
- [x] Add route to App.tsx
- [x] Add navigation links in footer

### Expert Review - Top-10 Critical Fixes
- [x] Fix "tinyint is not defined" console error
- [x] Add Error Boundaries to prevent app crashes (already implemented in App.tsx)
- [x] Implement GDPR cookie consent banner
- [x] Add data quality indicators (🟢🟡🔴) to all charts
- [x] Simplify homepage hero section (reduce text, add clear CTAs)
- [x] Add Principal Investigator info to About page
- [x] Add "Not peer-reviewed" disclosure to About page
- [ ] Create Data Quality Index system
- [ ] Add export watermark to charts
- [ ] Create /changelog page for data updates

### Final Language Neutralization - Observatory Section
- [ ] Replace "Urban Development Observatory" with neutral alternative (doesn't imply monitoring/surveillance)

## Final Pre-Launch Tasks
- [x] Apply chosen section title: "City Data Explorer" (replace "Urban Development Observatory")
- [x] Create neutral press release for public launch
- [x] Create comprehensive QA checklist for staging environment
- [x] Final checkpoint before production deployment

## Public URL Access Issue
- [ ] Diagnose why public URL shows Manus login instead of UrbanPulse homepage
- [ ] Check deployment status in Manus UI
- [ ] Verify correct public endpoint URL
- [ ] Test site accessibility without authentication

## Country Detection Logic Fix
- [x] Update Home.tsx to check if user's country has cities in database
- [x] Show "Explore Cities Worldwide" if country not represented
- [x] Show "Explore Cities in [Country]" only if cities exist for that country
- [x] Test with Israel IP (should show "Worldwide" not "Israel")

## Critical Homepage Improvements
- [x] Fix logo placement - remove white background, make transparent, professional sizing
- [x] Delay cookie banner to 3 seconds after page load
- [x] Improve value proposition subtitle: "Access 10 years of verified demographic and housing data from 15 global cities — free for researchers, policymakers, and citizens"
- [x] Add visual proof in hero section (map preview or featured insight)
- [x] Test all changes on desktop and mobile

## Press Kit Screenshots
- [x] Screenshot 1: Berlin district heatmap (grid visualization)
- [x] Screenshot 2: Demographic breakdown chart
- [x] Screenshot 3: Property price trends visualization
- [x] Screenshot 4: Interactive Europe map with city markers
- [x] Organize all screenshots in press-kit folder
- [x] Create press kit index document

## Missing Features Restoration
- [x] Add crime data back to city detail pages
- [x] Integrate video functionality
- [x] Add real-time online data feeds (LIVE DATA indicator in header)
- [x] Fix logo visibility on dark background
- [x] Test all restored features

## PDF Requirements Alignment (Keep Dark Theme + Current 15 Cities)
- [x] Add "Request Demo" CTA button to homepage hero
- [x] Add "Learn More" CTA button to homepage hero
- [x] Add platform statistics showcase (15 cities, 4.5K+ data points, 15K code lines, 32 tests)
- [x] Add "Explore Live Dashboard" button
- [x] Fix video player placement - move to dedicated section (not in middle of charts)
- [x] Make crime data dynamic with year selector instead of static mock
