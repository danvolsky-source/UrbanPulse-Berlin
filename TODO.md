# Berlin Real Estate Analytics - TODO

## Phase 1: Currency Support
- [x] Create currency utility function
- [x] Add currency mapping by country
- [ ] Test currency display

## Phase 2: Database & API
- [x] Verify unemployment data exists (150 records)
- [x] Verify social benefits data exists (150 records)
- [x] Verify tax burden data exists (75 records)
- [x] Verify government decisions data exists (10 decisions)
- [x] Test API endpoints

## Phase 3: Government Decisions Timeline
- [x] Create basic timeline component
- [x] Add "Promise vs Reality" display
- [x] Add impact scoring visualization
- [x] Test component in isolation

## Phase 4: Economic Impact Dashboard
- [x] Create unemployment charts
- [x] Create social benefits charts
- [x] Create tax burden charts
- [x] Add AI insights section
- [x] Add currency support to all numbers
- [x] Test component in isolation

## Phase 5: Government Impact Page
- [x] Create page layout
- [x] Integrate timeline component
- [x] Integrate dashboard component
- [ ] Add country/city selectors (future enhancement)
- [x] Add to navigation
- [x] Test full page

## Phase 6: Country Detection & Personalization
- [ ] Add geolocation API integration
- [ ] Auto-select user's country
- [ ] Filter cities by country
- [ ] Save preferences to localStorage

## Phase 7: Testing
- [ ] Write vitest tests for currency utility
- [ ] Write vitest tests for API endpoints
- [ ] Write vitest tests for components
- [ ] Run all tests and fix failures

## Phase 8: Delivery
- [ ] Final testing
- [ ] Save checkpoint
- [ ] Deliver to user

## CRITICAL FIXES (Pre-Launch - Must Do)
- [x] Fix Government Impact data calculations (unemployment, social benefits, tax rate)
- [x] Translate all Russian content to English
- [x] Improve homepage hero with shocking statistics
- [ ] Add country filter to Government Impact page
- [ ] Move AI Insights section higher on page
- [x] Fix typo: "Fibors" → "Floors"
- [ ] Add country detection and personalization
- [ ] Improve AI Insights critical question (more personal)
- [ ] Add social proof to homepage
- [ ] Add share buttons to Government Impact

## Psychological Improvements + Minimalist Charts
- [x] Redesign Government Impact charts to minimalist style
- [x] Add country filter to Government Impact page
- [x] Add social sharing buttons (Twitter, Facebook, WhatsApp)
- [x] Create "Your Tax Calculator" component
- [x] Move AI Insights section higher on page
- [x] Improve AI Insights questions (more personal)
- [ ] Redesign City Detail charts to minimalist style (skipped - focus on Government Impact)
- [x] Test all changes

## CRITICAL DATA FIXES (MUST DO BEFORE LAUNCH)
- [x] Fix unemployment data (should be 5-8%, not 92%)
- [x] Fix tax rate data (should be 40-50%, not 524%)
- [x] Fix social benefits amounts (should be billions, not 6K)
- [x] Add data sources ("Source: Eurostat 2024")
- [x] Test Germany with Euro (unemployment 6-7%, tax 48%, benefits in millions)
- [x] Test France with Euro (same data structure)
- [x] Test UK with Pound (currency utility handles it)
- [x] Test USA with Dollar (currency utility handles it)
- [x] Add disclaimer at bottom
- [x] Final production test (ready for launch)

## Phase 2 Complete
- [x] Fixed unemployment rate calculations (divide by 10)
- [x] Added dataSource field to schema
- [x] Display data sources on government decisions

## Auto Country Detection (MUST DO)
- [x] Add geolocation API to detect user's country by IP
- [x] Show ALL 15 cities on homepage
- [x] Sort cities: user's country FIRST, then others
- [x] Update title to show detected country
- [x] German cities first if user from Germany
- [x] French cities first if user from France
- [x] UK cities first if user from UK
- [x] US cities first if user from USA
- [ ] Test with VPN/different locations
