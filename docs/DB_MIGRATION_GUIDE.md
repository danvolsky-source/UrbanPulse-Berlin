# Database Migration Guide

## Cities Table Schema Update

### Overview
This migration expands the `cities` table with geographic and temporal metadata to support 15-city integration as documented in CITIES_DATA_INTEGRATION.md.

### New Fields Added
- `countryCode`: varchar(2) - ISO 3166-1 alpha-2 country code
- `latitude`: varchar(20) - Geographic latitude coordinate
- `longitude`: varchar(20) - Geographic longitude coordinate  
- `timezone`: varchar(50) - IANA timezone identifier
- `dataStartYear`: int - Start of historical data period (2015)
- `dataEndYear`: int - End of historical data period (2024)
- `updatedAt`: timestamp - Last update tracking

## Migration Steps

### Step 1: Update Schema ✅ COMPLETED
File: `drizzle/schema.ts`
- Added 7 new fields to cities table definition
- Commit: "Expand cities table schema with new fields for multi-city support"

### Step 2: Generate Migration✅ COMPLETED

File: `drizzle/migrations/0002_expand_cities_table.sql`
- Created SQL migration with ALTER TABLE statements
- Added 7 columns: countryCode, latitude, longitude, timezone, dataStartYear, dataEndYear, updatedAt
- Included indexes on countryCode and timezone
- Commit: "Create 0002_expand_cities_table.sql"
```bash
npm run db:push
# Or separately:
drizzle-kit generate
```

This will:
- Analyze schema changes in `drizzle/schema.ts`
- Generate SQL migration files in `drizzle/migrations/`
- Create ALTER TABLE statements for cities table

### Step 3: Apply Migration (CURRENT)```bash
drizzle-kit migrate
```
Executes generated SQL against MySQL database to:
- Add new columns to cities table
- Preserve existing data (id, name, country, population)
- Set new fields as nullable initially

### Step 4: Populate Data
Execute SQL INSERT statements from CITIES_DATA_INTEGRATION.md:
- 15 cities with complete metadata
- Real coordinates from OpenStreetMap
- IANA timezones
- 2015-2024 data period

## Cities List (Final)
1. Berlin (DE) - 52.5200, 13.4050
2. Munich (DE) - 48.1351, 11.5820
3. New York (US) - 40.7128, -74.0060
4. Los Angeles (US) - 34.0522, -118.2437
5. Paris (FR) - 48.8566, 2.3522
6. London (GB) - 51.5074, -0.1278
7. Toronto (CA) - 43.6532, -79.3832
8. Vienna (AT) - 48.2082, 16.3738
9. Rome (IT) - 41.9028, 12.4964
10. Amsterdam (NL) - 52.3676, 4.9041
11. Brussels (BE) - 50.8503, 4.3517
12. Madrid (ES) - 40.4168, -3.7038
13. Barcelona (ES) - 41.3851, 2.1734
14. Milan (IT) - 45.4642, 9.1900
15. Warsaw (PL) - 52.2297, 21.0122

## Database Configuration
- Connection: MySQL via DATABASE_URL environment variable
- Schema location: `./drizzle/schema.ts`
- Migrations output: `./drizzle/migrations`
- Dialect: mysql

## Rollback Plan
If migration fails:
```sql
ALTER TABLE cities 
DROP COLUMN countryCode,
DROP COLUMN latitude,
DROP COLUMN longitude,
DROP COLUMN timezone,
DROP COLUMN dataStartYear,
DROP COLUMN dataEndYear,
DROP COLUMN updatedAt;
```

## Next Steps After Migration
1. Verify column creation with `DESCRIBE cities;`
2. Run data population SQL from CITIES_DATA_INTEGRATION.md
3. Update application queries to use new fields
4. Test city selection and filtering features
