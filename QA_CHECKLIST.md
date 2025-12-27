# UrbanPulse QA Checklist for Staging Environment

**Version:** 1.0  
**Date:** December 27, 2025  
**Platform:** UrbanPulse by Sky-Mind  
**Environment:** Staging (pre-production validation)

---

## Executive Summary

This comprehensive Quality Assurance checklist covers functional testing, cross-browser compatibility, mobile responsiveness, performance validation, legal compliance verification, and security checks for the UrbanPulse platform before production deployment. All test cases should be executed in the staging environment with production-equivalent data and configuration.

**Testing Scope:**
- 15 cities with full data coverage (2015-2024)
- 32 backend API endpoints with automated tests
- 12 primary user flows across 8 major pages
- 4 browser targets (Chrome, Firefox, Safari, Edge)
- 3 device categories (desktop, tablet, mobile)
- GDPR compliance and legal protection validation

---

## 1. Functional Testing

### 1.1 Homepage (`/`)

**Test Case 1.1.1: Hero Section Display**
- [ ] Logo displays correctly with cyan glow effect on dark background
- [ ] Hero title reads "Compare 15 Cities (2015–2024)"
- [ ] Subtitle displays "See demographic & housing trends"
- [ ] "Research & Educational Tool" badge visible with BarChart3 icon
- [ ] Two CTA buttons present: "Explore Cities →" and "View Methodology"
- [ ] Stats grid shows correct values: 15 cities, 5 communities, 2015-2024 timeframe

**Test Case 1.1.2: Interactive Europe Map**
- [ ] Map renders with all 15 city markers visible
- [ ] User's country cities pulse with brighter cyan color (larger circles)
- [ ] Other cities pulse with blue color (smaller circles)
- [ ] Hover tooltips display city name, country, population, and "Click to explore"
- [ ] Click on any marker navigates to correct city detail page
- [ ] Legend explains "Your Country" vs "Other Cities" marker types

**Test Case 1.1.3: City Data Explorer Banner**
- [ ] Banner displays with gradient background (cyan/teal/blue)
- [ ] Title reads "City Data Explorer" (not "Urban Development Observatory")
- [ ] Description mentions correlations, not causation
- [ ] "Learn More →" link navigates to `/methodology`
- [ ] Hover effect increases border opacity

**Test Case 1.1.4: Features Grid**
- [ ] Four feature cards display: Interactive Maps, Demographic Analysis, Market Indicators, Development Patterns
- [ ] Icons render correctly (MapPin, Users, TrendingUp, BarChart3)
- [ ] "Development Patterns" card has cyan border accent
- [ ] All text is neutral and academic (no political language)

**Test Case 1.1.5: Disclaimer Footer**
- [ ] Disclaimer text includes "Correlation does not imply causation"
- [ ] Five footer links present: Terms, Privacy, Methodology, References, About
- [ ] All links navigate to correct pages
- [ ] Text emphasizes "Research & Educational Tool"

### 1.2 City Detail Page (`/city/:cityName`)

**Test Case 1.2.1: Page Load and Data Fetching**
- [ ] Test all 15 cities load without errors (Berlin, Munich, Hamburg, Cologne, Paris, Vienna, Rome, Amsterdam, Brussels, London, Washington D.C., New York, Toronto, Los Angeles, Chicago)
- [ ] City name displays correctly in header
- [ ] Loading skeletons appear during data fetch
- [ ] No console errors or failed API requests

**Test Case 1.2.2: Berlin Grid Heatmap**
- [ ] Grid renders with 80×57 cells using Turbo gradient palette
- [ ] Berlin city outline clips grid to accurate city boundary
- [ ] Hover tooltips show district name and property price (€/m²)
- [ ] Gradient legend displays price range (€3,500-€5,500/m²)
- [ ] Colors transition smoothly from blue (cheap) to red (expensive)

**Test Case 1.2.3: Three-Panel Layout**
- [ ] **Left Panel:** Geopolitical events timeline with dates and descriptions
- [ ] **Center Panel:** Map + three chart tabs (Property Prices, Quality Index, Community Growth)
- [ ] **Right Panel:** Geopolitics metrics, transport stats, income/price donut, property card
- [ ] All panels scroll independently without layout breaking

**Test Case 1.2.4: Chart Tabs Functionality**
- [ ] Property Prices tab shows line chart with 2015-2024 data
- [ ] Quality Index tab displays composite quality metrics
- [ ] Community Growth tab shows multi-line chart for 5 communities
- [ ] Data Quality Indicators (🟢🟡🔴) display on all charts
- [ ] Hover tooltips on charts show exact values and years

**Test Case 1.2.5: Data Source Citations**
- [ ] All data points have inline citations [1][2][3]
- [ ] Citation hover tooltips show source preview
- [ ] Citations link to `/references` page with full bibliography

### 1.3 Methodology Page (`/methodology`)

**Test Case 1.3.1: Content Structure**
- [ ] "Correlation ≠ Causation" disclaimer prominently displayed at top
- [ ] Six alternative hypotheses documented (zoning, interest rates, construction, investors, growth, infrastructure)
- [ ] Data sources table lists Eurostat, national agencies, OECD, OpenStreetMap
- [ ] Data limitations section covers reporting delays, granularity, definitions, missing data, biases
- [ ] Statistical methods explain Pearson's r interpretation
- [ ] Educational purpose statement with appropriate/inappropriate uses
- [ ] Contact email: research@sky-mind.com

**Test Case 1.3.2: Regional Proxies Disclaimer**
- [ ] Disclaimer states "Where city-level data unavailable, regional (NUTS 2/3) or national indicators used as proxies"
- [ ] NUTS mapping reference mentioned with link to appendix
- [ ] Community categories disclaimer present
- [ ] GDP proxy disclaimer included

### 1.4 Government Impact Page (`/government`)

**Test Case 1.4.1: Interpretation Toggle**
- [ ] Toggle switch visible in top-right corner
- [ ] Default state: OFF (interpretations hidden)
- [ ] Toggle state persists in localStorage across page reloads
- [ ] When OFF: only neutral data layer visible (charts, metrics, timeline)
- [ ] When ON: AI insights and statistical correlations appear with "Subjective" label

**Test Case 1.4.2: Country Filter**
- [ ] Four country tabs: Germany, France, UK, USA
- [ ] Switching countries updates all data (unemployment, benefits, taxes)
- [ ] Currency symbols change correctly (€, £, $)
- [ ] Charts re-render with country-specific data

**Test Case 1.4.3: Economic Indicators**
- [ ] Unemployment rate displays realistic values (4-8%)
- [ ] Social benefits show millions in local currency
- [ ] Tax burden displays percentage (40-50%)
- [ ] All values have proper units and formatting

**Test Case 1.4.4: Government Decisions Timeline**
- [ ] 10 decisions display with dates, titles, descriptions
- [ ] "Promise vs Reality" comparison shown for each decision
- [ ] Impact scores visible (-3 to +2 range)
- [ ] All text in English (no German/French/other languages)
- [ ] Data source citations present on each decision card

### 1.5 References Page (`/references`)

**Test Case 1.5.1: Bibliography Structure**
- [ ] References grouped by source type (Eurostat, National Agencies, OECD, etc.)
- [ ] Each reference has: number, title, organization, URL
- [ ] All URLs are clickable and open in new tab
- [ ] Minimum 20 references listed
- [ ] References match inline citations from other pages

### 1.6 About Page (`/about`)

**Test Case 1.6.1: Research Team Section**
- [ ] Principal Investigator: Sky-Mind Research Team
- [ ] Multidisciplinary expertise mentioned
- [ ] Contact: research@sky-mind.com

**Test Case 1.6.2: Disclosures**
- [ ] Funding sources: self-funded, no external sponsors
- [ ] Conflicts of interest: none declared
- [ ] **Peer review status:** "Not peer-reviewed" with orange warning badge
- [ ] Legal & ethical framework section present

### 1.7 Terms of Service (`/terms`)

**Test Case 1.7.1: Legal Sections**
- [ ] 9 sections present: Educational Purpose, Data Limitations, Prohibited Uses, Limitation of Liability, Governing Law, etc.
- [ ] Governing law: Germany
- [ ] Prohibited uses clearly listed
- [ ] Liability limitations stated
- [ ] Contact: privacy@sky-mind.com

### 1.8 Privacy Policy (`/privacy`)

**Test Case 1.8.1: GDPR Compliance**
- [ ] Data Controller: SkyMind, privacy@sky-mind.com
- [ ] Legal basis: Contract Performance (Art. 6(1)(b)), Legitimate Interests (Art. 6(1)(f)), Consent (Art. 6(1)(a))
- [ ] Seven GDPR rights explained: access, rectification, erasure, restriction, portability, objection, complaint
- [ ] Data retention: account data until deletion, logs 90 days, IP anonymized after 7 days
- [ ] International transfers: EU/Singapore with SCCs
- [ ] Children's privacy: 16+ only
- [ ] Cookie policy section present

### 1.9 Cookie Consent Banner

**Test Case 1.9.1: Banner Display**
- [ ] Banner appears on first visit (bottom of screen)
- [ ] Text explains cookie usage for analytics and functionality
- [ ] Two buttons: "Accept" and "Reject"
- [ ] Banner dismisses after user choice
- [ ] Choice persists in localStorage (no re-prompt on refresh)

**Test Case 1.9.2: Cookie Behavior**
- [ ] Accept: sets `cookieConsent=accepted` in localStorage
- [ ] Reject: sets `cookieConsent=rejected` in localStorage
- [ ] Analytics scripts only load if accepted
- [ ] Essential cookies (auth) work regardless of choice

---

## 2. Cross-Browser Compatibility

### 2.1 Desktop Browsers

**Test Case 2.1.1: Google Chrome (latest)**
- [ ] All pages render correctly
- [ ] Charts display without visual glitches
- [ ] Interactive maps work (hover, click)
- [ ] No console errors

**Test Case 2.1.2: Mozilla Firefox (latest)**
- [ ] All pages render correctly
- [ ] Charts display without visual glitches
- [ ] Interactive maps work (hover, click)
- [ ] No console errors

**Test Case 2.1.3: Safari (macOS, latest)**
- [ ] All pages render correctly
- [ ] Charts display without visual glitches
- [ ] Interactive maps work (hover, click)
- [ ] No console errors
- [ ] Gradient backgrounds render correctly (Safari-specific CSS issues)

**Test Case 2.1.4: Microsoft Edge (latest)**
- [ ] All pages render correctly
- [ ] Charts display without visual glitches
- [ ] Interactive maps work (hover, click)
- [ ] No console errors

### 2.2 Mobile Browsers

**Test Case 2.2.1: Chrome Mobile (Android)**
- [ ] Homepage responsive layout works
- [ ] Interactive map markers have sufficient touch targets (min 44×44px)
- [ ] Charts scale to screen width
- [ ] Text readable without horizontal scrolling

**Test Case 2.2.2: Safari Mobile (iOS)**
- [ ] Homepage responsive layout works
- [ ] Interactive map markers have sufficient touch targets (min 44×44px)
- [ ] Charts scale to screen width
- [ ] Text readable without horizontal scrolling
- [ ] No viewport zoom issues

---

## 3. Mobile Responsiveness

### 3.1 Viewport Breakpoints

**Test Case 3.1.1: Desktop (≥1280px)**
- [ ] Three-panel layout displays side-by-side on city pages
- [ ] Homepage stats grid shows 3 columns
- [ ] Features grid shows 4 columns
- [ ] No horizontal scrolling

**Test Case 3.1.2: Tablet (768px - 1279px)**
- [ ] Three-panel layout stacks vertically on city pages
- [ ] Homepage stats grid shows 3 columns
- [ ] Features grid shows 2 columns
- [ ] Charts scale appropriately

**Test Case 3.1.3: Mobile (< 768px)**
- [ ] All panels stack vertically
- [ ] Homepage stats grid shows 1 column
- [ ] Features grid shows 1 column
- [ ] Interactive map remains usable (no tiny markers)
- [ ] Text size remains readable (min 14px body text)

### 3.2 Touch Interactions

**Test Case 3.2.1: Map Markers**
- [ ] City markers on Europe map have min 44×44px touch target
- [ ] Tap on marker navigates to city page (no double-tap required)
- [ ] Hover tooltips replaced with tap-to-show on mobile

**Test Case 3.2.2: Charts**
- [ ] Chart tooltips appear on tap (not just hover)
- [ ] Pinch-to-zoom disabled on charts (prevents accidental zoom)
- [ ] Swipe gestures work for chart tabs

---

## 4. Performance Validation

### 4.1 Page Load Times

**Test Case 4.1.1: Homepage**
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3.5s
- [ ] Total page size < 2MB

**Test Case 4.1.2: City Detail Page**
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s (including Berlin grid heatmap)
- [ ] TTI < 4s
- [ ] Total page size < 3MB

### 4.2 API Response Times

**Test Case 4.2.1: Backend Endpoints**
- [ ] `/api/trpc/cities.list` < 200ms
- [ ] `/api/trpc/demographics.getByCityAndYear` < 300ms
- [ ] `/api/trpc/propertyPrices.getByCity` < 300ms
- [ ] `/api/trpc/berlinGrid` < 500ms (complex query)
- [ ] All endpoints return within 1s under normal load

### 4.3 Database Query Optimization

**Test Case 4.3.1: Test Suite Performance**
- [ ] All 32 tests pass within 30 seconds total
- [ ] No individual test exceeds 15s timeout
- [ ] Database queries use proper indexes (no full table scans)

---

## 5. Legal Compliance Verification

### 5.1 Language Neutrality Audit

**Test Case 5.1.1: Homepage**
- [ ] No "YOUR taxes" language
- [ ] No "WHO benefits" questions
- [ ] No "government decisions reshaped your neighborhood" framing
- [ ] All text uses neutral academic tone
- [ ] Focus on "correlations" not "causation"

**Test Case 5.1.2: Government Impact Page**
- [ ] No accusatory language toward governments
- [ ] No emotional manipulation tactics
- [ ] Data presented objectively with interpretations optional
- [ ] Alternative hypotheses mentioned

**Test Case 5.1.3: All Pages**
- [ ] No politically charged language detected
- [ ] No "blame" framing toward any group
- [ ] All community references use neutral analytical terms
- [ ] No financial/legal advice claims

### 5.2 GDPR Compliance

**Test Case 5.2.1: Cookie Consent**
- [ ] Banner appears before any non-essential cookies set
- [ ] User can reject cookies and still use site
- [ ] Consent choice persists across sessions
- [ ] Privacy Policy linked from banner

**Test Case 5.2.2: Data Processing**
- [ ] No individual-level data collected
- [ ] All metrics aggregated at district/city level
- [ ] User accounts optional (guest access available)
- [ ] Data retention periods documented in Privacy Policy

**Test Case 5.2.3: User Rights**
- [ ] Privacy Policy explains all 7 GDPR rights
- [ ] Contact email provided for data requests (privacy@sky-mind.com)
- [ ] Data portability mechanism documented
- [ ] Right to erasure process explained

### 5.3 Disclaimer Compliance

**Test Case 5.3.1: Correlation ≠ Causation**
- [ ] Disclaimer on homepage footer
- [ ] Disclaimer on Methodology page (prominent)
- [ ] Disclaimer in About page
- [ ] Mentioned in press release

**Test Case 5.3.2: Data Limitations**
- [ ] Regional proxies disclaimer on Methodology page
- [ ] NUTS mapping reference provided
- [ ] Community categories disclaimer present
- [ ] GDP proxy disclaimer included
- [ ] Data quality indicators on all charts

**Test Case 5.3.3: Not Peer-Reviewed**
- [ ] Orange warning badge on About page
- [ ] Text states "This platform has not undergone formal peer review"
- [ ] Recommendation to verify findings with original sources

---

## 6. Security Checks

### 6.1 Authentication & Authorization

**Test Case 6.1.1: OAuth Flow**
- [ ] Google OAuth redirects correctly
- [ ] Manus OAuth redirects correctly
- [ ] Session cookies set with HttpOnly and Secure flags
- [ ] No sensitive data in localStorage (only preferences)

**Test Case 6.1.2: Protected Routes**
- [ ] `/profile` requires authentication
- [ ] `/settings` requires authentication
- [ ] Unauthenticated users redirected to login
- [ ] No API endpoints expose user data without auth

### 6.2 Input Validation

**Test Case 6.2.1: API Endpoints**
- [ ] City name parameter validated (no SQL injection)
- [ ] Year parameter validated (2015-2024 range)
- [ ] User input sanitized before database queries
- [ ] Error messages don't expose internal details

### 6.3 HTTPS & Headers

**Test Case 6.3.1: SSL Certificate**
- [ ] Site accessible via HTTPS
- [ ] Valid SSL certificate (not self-signed)
- [ ] HTTP requests redirect to HTTPS

**Test Case 6.3.2: Security Headers**
- [ ] `X-Content-Type-Options: nosniff` present
- [ ] `X-Frame-Options: DENY` or `SAMEORIGIN` present
- [ ] `Content-Security-Policy` configured (if applicable)

---

## 7. Data Integrity Validation

### 7.1 Database Seeding

**Test Case 7.1.1: All Cities Present**
- [ ] 15 cities exist in `cities` table
- [ ] Each city has correct country, population, district count

**Test Case 7.1.2: Complete Data Coverage**
- [ ] Demographics: 2015-2024 data for all 15 cities (150 records)
- [ ] Property prices: 2015-2024 data for districts (varies by city)
- [ ] Unemployment: 2015-2024 data for all 15 cities (150 records)
- [ ] Social benefits: 2015-2024 data for all 15 cities (150 records)
- [ ] Tax burden: 2015-2024 data for all 15 cities (150 records)
- [ ] Ecology: 2015-2024 data for all 15 cities (150 records)
- [ ] Vehicles: 2015-2024 data for all 15 cities (150 records)
- [ ] Community growth: 2015-2024 data for all 15 cities (375 records)

**Test Case 7.1.3: Data Realism**
- [ ] Unemployment rates: 4-8% (realistic range)
- [ ] Social benefits: millions in local currency (not billions)
- [ ] Tax burden: 40-50% (realistic for European countries)
- [ ] Property prices: €3,000-€6,000/m² for Berlin (realistic)
- [ ] No negative values where inappropriate
- [ ] No NaN or undefined values in charts

### 7.2 Data Quality Indicators

**Test Case 7.2.1: Badge Display**
- [ ] 🟢 Green: Official statistical data (Eurostat, national agencies)
- [ ] 🟡 Yellow: Market-based estimates (property prices)
- [ ] 🔴 Red: Model-based estimation (interpolated data)
- [ ] Hover tooltips explain each quality level

---

## 8. User Flow Testing

### 8.1 First-Time Visitor Journey

**Test Case 8.1.1: Homepage → City Detail**
1. [ ] User lands on homepage
2. [ ] Sees interactive Europe map with pulsing markers
3. [ ] Hovers over Berlin marker, sees tooltip
4. [ ] Clicks Berlin marker
5. [ ] Navigates to `/city/Berlin`
6. [ ] Sees Berlin grid heatmap and charts
7. [ ] No errors or broken links

**Test Case 8.1.2: Homepage → Methodology**
1. [ ] User clicks "View Methodology" button
2. [ ] Navigates to `/methodology`
3. [ ] Reads "Correlation ≠ Causation" disclaimer
4. [ ] Sees alternative hypotheses
5. [ ] Clicks "References" link in footer
6. [ ] Navigates to `/references` with full bibliography

### 8.2 Researcher Journey

**Test Case 8.2.1: Data Exploration**
1. [ ] Researcher visits `/city/Berlin`
2. [ ] Examines property price chart with data quality indicator (🟡)
3. [ ] Hovers over data point, sees inline citation [1]
4. [ ] Clicks citation, navigates to `/references`
5. [ ] Finds Eurostat dataset URL
6. [ ] Opens URL in new tab to verify original data

**Test Case 8.2.2: Methodology Review**
1. [ ] Researcher visits `/methodology`
2. [ ] Reads data limitations section
3. [ ] Notes NUTS 2 regional proxy disclaimer
4. [ ] Checks data sources table
5. [ ] Verifies statistical methods explanation
6. [ ] Contacts research@sky-mind.com for collaboration

### 8.3 Policy Analyst Journey

**Test Case 8.3.1: Government Impact Analysis**
1. [ ] Analyst visits `/government`
2. [ ] Sees interpretation toggle (default OFF)
3. [ ] Reviews neutral economic indicators
4. [ ] Switches country filter to UK
5. [ ] Sees data update with £ currency
6. [ ] Turns interpretation toggle ON
7. [ ] Reads AI insights with "Subjective" label
8. [ ] Understands distinction between data and interpretation

---

## 9. Accessibility Testing

### 9.1 Keyboard Navigation

**Test Case 9.1.1: Tab Order**
- [ ] Tab key navigates through all interactive elements in logical order
- [ ] Focus indicators visible on all focusable elements
- [ ] No keyboard traps (can tab out of all components)

**Test Case 9.1.2: Enter/Space Activation**
- [ ] Buttons activate with Enter and Space keys
- [ ] Links activate with Enter key
- [ ] Chart tabs switch with arrow keys

### 9.2 Screen Reader Compatibility

**Test Case 9.2.1: ARIA Labels**
- [ ] All images have alt text or aria-label
- [ ] Charts have aria-label describing content
- [ ] Interactive map markers have aria-label with city name
- [ ] Form inputs have associated labels

**Test Case 9.2.2: Semantic HTML**
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Lists use `<ul>` or `<ol>` tags
- [ ] Tables use `<table>`, `<thead>`, `<tbody>` structure
- [ ] Navigation uses `<nav>` landmark

### 9.3 Color Contrast

**Test Case 9.3.1: WCAG AA Compliance**
- [ ] Body text has min 4.5:1 contrast ratio
- [ ] Heading text has min 4.5:1 contrast ratio
- [ ] Button text has min 4.5:1 contrast ratio
- [ ] Link text distinguishable from body text (not just by color)

---

## 10. Error Handling

### 10.1 Network Errors

**Test Case 10.1.1: API Failure**
- [ ] Simulate API timeout (disconnect network)
- [ ] Error message displays: "Failed to load data. Please try again."
- [ ] No app crash (Error Boundary catches errors)
- [ ] Retry button appears

**Test Case 10.1.2: 404 Not Found**
- [ ] Navigate to `/city/NonexistentCity`
- [ ] 404 error page displays
- [ ] Link back to homepage provided

### 10.2 Browser Console

**Test Case 10.2.1: No Critical Errors**
- [ ] No "tinyint is not defined" error
- [ ] No React hydration errors
- [ ] No unhandled promise rejections
- [ ] Warnings acceptable (e.g., third-party library warnings)

---

## 11. Final Pre-Deployment Checklist

### 11.1 Environment Variables

**Test Case 11.1.1: Staging Configuration**
- [ ] `VITE_APP_TITLE` set to "UrbanPulse by SkyMind" (requires manual update in Settings → Secrets UI)
- [ ] `VITE_APP_LOGO` points to `/urbanpulse-logo.png`
- [ ] `DATABASE_URL` points to staging database
- [ ] `VITE_MAPBOX_ACCESS_TOKEN` configured
- [ ] All OAuth credentials configured

### 11.2 Build Verification

**Test Case 11.2.1: Production Build**
- [ ] Run `pnpm build` completes without errors
- [ ] TypeScript compilation: 0 errors
- [ ] Bundle size < 500KB (gzipped)
- [ ] Source maps generated for debugging

**Test Case 11.2.2: Test Suite**
- [ ] Run `pnpm test` passes all 32 tests
- [ ] No flaky tests (run 3 times, all pass)
- [ ] Test coverage > 70% (if measured)

### 11.3 Documentation

**Test Case 11.3.1: Files Present**
- [ ] README.md up-to-date
- [ ] CHANGELOG.md includes latest version
- [ ] PRESS_RELEASE.md finalized
- [ ] QA_CHECKLIST.md (this file) completed
- [ ] EXPERT_REVIEW_2025-12-27.md available

### 11.4 Final Manual Review

**Test Case 11.4.1: Content Audit**
- [ ] No "Urban Development Observatory" text (replaced with "City Data Explorer")
- [ ] No "Berlin Real Estate Analytics" branding (replaced with "UrbanPulse")
- [ ] All footer links work (Terms, Privacy, Methodology, References, About)
- [ ] Contact emails correct: info@sky-mind.com, research@sky-mind.com, privacy@sky-mind.com

**Test Case 11.4.2: Visual Polish**
- [ ] Logo displays correctly on all pages
- [ ] No broken images (check all 15 city posters)
- [ ] Consistent color scheme (cyan/teal/slate)
- [ ] No layout shifts during page load

---

## 12. Sign-Off

### 12.1 QA Team Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| **QA Lead** | _______________ | __________ | ☐ Approved ☐ Rejected |
| **Frontend Developer** | _______________ | __________ | ☐ Approved ☐ Rejected |
| **Backend Developer** | _______________ | __________ | ☐ Approved ☐ Rejected |
| **Legal Reviewer** | _______________ | __________ | ☐ Approved ☐ Rejected |
| **Product Owner** | _______________ | __________ | ☐ Approved ☐ Rejected |

### 12.2 Critical Issues Log

| Issue ID | Description | Severity | Status | Assigned To |
|----------|-------------|----------|--------|-------------|
| ___ | _______________ | High/Medium/Low | Open/Resolved | _______________ |

### 12.3 Deployment Approval

**Staging Environment:** ☐ Passed ☐ Failed  
**Production Readiness:** ☐ Approved ☐ Conditional ☐ Rejected

**Approver Signature:** _______________  
**Date:** _______________

---

## Appendix A: Test Data Samples

### Sample City Names for Testing
- Berlin, Munich, Hamburg, Cologne (Germany)
- Paris (France)
- Vienna (Austria)
- Rome (Italy)
- Amsterdam (Netherlands)
- Brussels (Belgium)
- London (United Kingdom)
- Washington D.C., New York, Los Angeles, Chicago (United States)
- Toronto (Canada)

### Sample API Endpoints
```
GET /api/trpc/cities.list
GET /api/trpc/demographics.getByCityAndYear?city=Berlin&year=2024
GET /api/trpc/propertyPrices.getByCity?city=Berlin
GET /api/trpc/berlinGrid
GET /api/trpc/unemployment.getByCity?city=Berlin
GET /api/trpc/communityGrowth.getByCity?city=Berlin
```

### Expected Response Times (Staging)
- Simple queries: < 200ms
- Complex queries: < 500ms
- Berlin grid heatmap: < 800ms
- Page load (FCP): < 1.5s

---

## Appendix B: Browser Versions for Testing

| Browser | Version | OS |
|---------|---------|-----|
| Chrome | 120+ | Windows 11, macOS 14, Ubuntu 22.04 |
| Firefox | 121+ | Windows 11, macOS 14, Ubuntu 22.04 |
| Safari | 17+ | macOS 14, iOS 17 |
| Edge | 120+ | Windows 11 |

---

## Appendix C: Mobile Devices for Testing

| Device | OS | Screen Size |
|--------|-----|-------------|
| iPhone 14 Pro | iOS 17 | 6.1" (1179×2556) |
| Samsung Galaxy S23 | Android 14 | 6.1" (1080×2340) |
| iPad Pro 11" | iOS 17 | 11" (1668×2388) |
| Google Pixel 8 | Android 14 | 6.2" (1080×2400) |

---

**END OF QA CHECKLIST**

*This checklist should be completed before production deployment. All critical issues must be resolved before sign-off. For questions or clarifications, contact: info@sky-mind.com*
