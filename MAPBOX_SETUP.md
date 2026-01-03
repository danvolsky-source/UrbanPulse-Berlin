# Mapbox Integration Setup Guide

## Overview
This guide explains how to set up and use the Mapbox integration in the GALOR project for visualizing Berlin geospatial data.

## Prerequisites
- Mapbox account (free tier available at https://mapbox.com)
- Node.js and npm installed
- Access to this repository

## Installation Steps

### 1. Install Dependencies
The required packages are already added to `package.json`:
```bash
npm install
```

This will install:
- `mapbox-gl` - Mapbox GL JS library
- `react-map-gl` - React wrapper for Mapbox GL JS
- `@types/mapbox-gl` - TypeScript types

### 2. Get Your Mapbox Access Token
1. Go to https://console.mapbox.com/
2. Sign in or create a free account
3. Navigate to "Tokens" section
4. Copy your default public token (starts with `pk.`)

### 3. Configure Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Mapbox token:
   ```
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_actual_token_here
   ```

**Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## Usage

### Basic Map Component
The `MapboxBerlinMap` component is located at `client/src/components/MapboxBerlinMap.tsx`.

```tsx
import MapboxBerlinMap from '@/components/MapboxBerlinMap';

function MyPage() {
  return (
    <div>
      <h1>Berlin Map</h1>
      <MapboxBerlinMap />
    </div>
  );
}
```

### Features
- Interactive map centered on Berlin
- Berlin boundary overlay from GeoJSON data
- Zoom and pan controls
- Responsive design

### Customization
You can customize the map by modifying `MapboxBerlinMap.tsx`:

- **Map Style**: Change `mapStyle` prop (streets, satellite, dark, light, etc.)
- **Initial View**: Modify `initialViewState` object
- **Boundary Style**: Adjust `fillColor`, `fillOpacity`, `lineColor`, `lineWidth`

## Data Source
The Berlin boundary data is loaded from:
```
https://raw.githubusercontent.com/danvolsky-source/GALOR/main/berlin_boundary.geojson
```

## Troubleshooting

### Map not loading
- Verify your Mapbox token is correctly set in `.env.local`
- Check browser console for errors
- Ensure the token starts with `pk.` (public token)

### Boundary not showing
- Check that the GeoJSON file is accessible
- Verify the data structure matches expected format
- Look for console errors related to data loading

### Performance issues
- Use production build for better performance: `npm run build`
- Consider simplifying the GeoJSON if it's too detailed

## Deployment

### Vercel
When deploying to Vercel:
1. Add environment variable in Vercel dashboard:
   - Key: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - Value: Your Mapbox token
2. Redeploy the application

### Other Platforms
Ensure the environment variable `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is set in your deployment platform.

## Resources
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [react-map-gl Documentation](https://visgl.github.io/react-map-gl/)
- [Mapbox Studio](https://studio.mapbox.com/) - Create custom map styles

## Support
For issues specific to GALOR integration, please open an issue in this repository.
