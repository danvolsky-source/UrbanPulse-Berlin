-- Migration: Add indexes for grid_cells table
-- Created: 2025-12-30
-- Purpose: Optimize spatial queries for grid cells API

-- Index for city and zoom level (most common filter)
CREATE INDEX IF NOT EXISTS idx_grid_cells_city_zoom 
  ON grid_cells(city, zoomLevel);

-- Index for cell coordinates (spatial queries)
CREATE INDEX IF NOT EXISTS idx_grid_cells_coordinates 
  ON grid_cells(cellX, cellY);

-- Composite index for complete spatial queries
-- This is the most important index for viewport-based queries
CREATE INDEX IF NOT EXISTS idx_grid_cells_spatial 
  ON grid_cells(city, zoomLevel, cellX, cellY);

-- Index for ID lookups (useful for updates)
CREATE INDEX IF NOT EXISTS idx_grid_cells_id 
  ON grid_cells(id);

-- Performance notes:
-- - idx_grid_cells_spatial is the primary index for API queries
-- - Expected query time: <50ms for 10,000 records
-- - Indexes will be used automatically by MySQL query optimizer
-- - Run ANALYZE TABLE grid_cells; after creating indexes
