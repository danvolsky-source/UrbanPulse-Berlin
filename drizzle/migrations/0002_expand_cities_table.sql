-- Migration: Expand cities table for 15-city integration
-- Date: 2025-01-XX
-- Description: Add geographic coordinates, timezone, and temporal metadata

ALTER TABLE `cities` 
  ADD COLUMN `countryCode` VARCHAR(2) NULL COMMENT 'ISO 3166-1 alpha-2 country code',
  ADD COLUMN `latitude` VARCHAR(20) NULL COMMENT 'Geographic latitude coordinate',
  ADD COLUMN `longitude` VARCHAR(20) NULL COMMENT 'Geographic longitude coordinate',
  ADD COLUMN `timezone` VARCHAR(50) NULL COMMENT 'IANA timezone identifier',
  ADD COLUMN `dataStartYear` INT NULL DEFAULT 2015 COMMENT 'Historical data start year',
  ADD COLUMN `dataEndYear` INT NULL DEFAULT 2024 COMMENT 'Historical data end year',
  ADD COLUMN `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp';

-- Add indexes for common query patterns
CREATE INDEX `idx_cities_country_code` ON `cities`(`countryCode`);
CREATE INDEX `idx_cities_timezone` ON `cities`(`timezone`);

-- Comments for tracking
-- This migration prepares the cities table for:
-- 1. 15 cities across 6 countries (DE, US, FR, GB, CA, AT, IT, NL, BE, ES, PL)
-- 2. Geographic filtering and map visualization (lat/lng)
-- 3. Timezone-aware data processing
-- 4. 2015-2024 historical data period tracking
