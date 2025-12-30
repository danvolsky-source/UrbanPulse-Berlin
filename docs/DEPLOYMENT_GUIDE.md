# 🚀 Grid Cells API - Quick Deployment

## Step 1: Seed Database

```bash
npm run tsx scripts/seed-grid-cells.ts
```

Generates ~10,000 grid cells for Berlin (zoom levels 10-12)  
Time: ~30 seconds

## Step 2: Add Indexes

```bash
mysql -u user -p database < drizzle/migrations/add_grid_cells_indexes.sql
```

Creates 4 indexes for performance optimization  
Speed improvement: 100ms → 50ms

## Step 3: Verify

```sql
-- Check data
SELECT COUNT(*) FROM grid_cells;  -- Expected: ~10,000

-- Check indexes  
SHOW INDEXES FROM grid_cells;
```

## Step 4: Test API

```bash
npm run dev
# Visit: http://localhost:3000/api/trpc/gridCells.getGrid?input={"city":"Berlin","zoomLevel":12}
```

---

## Troubleshooting

**Table doesn't exist?**
```bash
npm run drizzle-kit push
```

**No data?**
- Check DATABASE_URL in .env
- Verify INSERT permissions

**Slow queries?**
- Apply indexes (Step 2)
- Run: `ANALYZE TABLE grid_cells;`

---

## Production Deploy

1. Set DATABASE_URL in production
2. Run: `npm run build`
3. Seed data (Step 1)
4. Apply indexes (Step 2)
5. Start: `npm run start`

---

**See also:**
- Full guide: `docs/GRID_CELLS_API_INTEGRATION.md`
- Status: `PROJECT_STATUS.md`
