-- Seed Cities Data for GALOR 15-City Integration
-- Execute this after running migration 0002_expand_cities_table.sql
-- Data Period: 2015-2024

-- Clear existing test data (if any)
DELETE FROM cities WHERE id < 1000;

-- Insert 15 cities with complete metadata
INSERT INTO cities (
  name, 
  country, 
  countryCode, 
  population, 
  latitude, 
  longitude, 
  timezone, 
  dataStartYear, 
  dataEndYear
) VALUES
-- Germany (2 cities)
('Berlin', 'Germany', 'DE', 3700000, '52.5200', '13.4050', 'Europe/Berlin', 2015, 2024),
('Munich', 'Germany', 'DE', 1500000, '48.1351', '11.5820', 'Europe/Berlin', 2015, 2024),

-- United States (4 cities)  
('New York', 'United States', 'US', 8300000, '40.7128', '-74.0060', 'America/New_York', 2015, 2024),
('Los Angeles', 'United States', 'US', 4000000, '34.0522', '-118.2437', 'America/Los_Angeles', 2015, 2024),
('Chicago', 'United States', 'US', 2700000, '41.8781', '-87.6298', 'America/Chicago', 2015, 2024),
('Washington D.C.', 'United States', 'US', 700000, '38.9072', '-77.0369', 'America/New_York', 2015, 2024),

-- France (1 city)
('Paris', 'France', 'FR', 2200000, '48.8566', '2.3522', 'Europe/Paris', 2015, 2024),

-- United Kingdom (1 city)
('London', 'United Kingdom', 'GB', 9000000, '51.5074', '-0.1278', 'Europe/London', 2015, 2024),

-- Canada (1 city)
('Toronto', 'Canada', 'CA', 2900000, '43.6532', '-79.3832', 'America/Toronto', 2015, 2024),

-- Austria (1 city)
('Vienna', 'Austria', 'AT', 1900000, '48.2082', '16.3738', 'Europe/Vienna', 2015, 2024),

-- Italy (1 city)
('Rome', 'Italy', 'IT', 2900000, '41.9028', '12.4964', 'Europe/Rome', 2015, 2024),

-- Netherlands (1 city)
('Amsterdam', 'Netherlands', 'NL', 900000, '52.3676', '4.9041', 'Europe/Amsterdam', 2015, 2024),

-- Belgium (1 city)
('Brussels', 'Belgium', 'BE', 1200000, '50.8503', '4.3517', 'Europe/Brussels', 2015, 2024),

-- Spain (1 city)
('Madrid', 'Spain', 'ES', 3300000, '40.4168', '-3.7038', 'Europe/Madrid', 2015, 2024),

-- Poland (1 city)
('Warsaw', 'Poland', 'PL', 1800000, '52.2297', '21.0122', 'Europe/Warsaw', 2015, 2024);

-- Verify insertion
SELECT 
  COUNT(*) as total_cities,
  COUNT(DISTINCT countryCode) as countries,
  MIN(dataStartYear) as data_start,
  MAX(dataEndYear) as data_end
FROM cities;

-- Display all cities grouped by country
SELECT 
  countryCode,
  country,
  COUNT(*) as city_count,
  GROUP_CONCAT(name ORDER BY population DESC) as cities
FROM cities
GROUP BY countryCode, country
ORDER BY country;

-- Success message
SELECT 'Successfully seeded 15 cities with complete 2015-2024 metadata' as status;
