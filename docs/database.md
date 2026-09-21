# Database Architecture, Management & Migrations

## 1. Database Configuration
- **Engine**: PostgreSQL 16 LTS
- **Isolation**: Docker private network `care-backend`, bound strictly to internal IP, not published to host ports.
- **Data Persistence**: Dedicated named Docker volume `care_postgres_data` with host backup snapshots.
- **Repository Pattern**: Dual-Driver Database Layer (`lib/db.ts`) with PostgreSQL schema mapping and JSON storage fallback (`data/care_beauty_db.json`).
- **Connection Pooling**: Managed with application-level pool with max 20 connections per container.
- **Query Optimization**: `pg_stat_statements` enabled for slow query analysis (>250ms).

## 2. Schema Specification & Migration
- Canonical SQL DDL: `infrastructure/scripts/schema.sql`
- Standard Seed Feed: `infrastructure/scripts/seeds.sql`
- Tables Provisioned:
  - `products`: Formulations, SKUs, inventory levels, prices, actives, and marketplace URLs.
  - `orders`: D2C orders with items, dispatch tracking, courier partner, and customer linkage.
  - `customers`: Customer CRM profiles, lifetime value (LTV), skin types, skin concerns, and loyalty tiers.
  - `coupons`: Promotional codes, percentage/fixed discounts, minimum spend thresholds, and usage limits.
  - `audit_logs`: Enterprise compliance logging for every mutation (stock changes, status updates, coupon creates).

## 3. Dynamic Dummy Data Feed API
- Storefront Products Feed: `GET /api/products`
- Coupon Validation Engine: `POST /api/coupons/validate`
- Admin Master Query: `GET /api/admin?resource={dashboard|products|orders|coupons|customers|audit-logs}`
- Admin Mutation & Reseed: `POST /api/admin` with actions:
  - `UPDATE_ORDER_STATUS`: Updates courier tracking & triggers automated audit log.
  - `ADJUST_STOCK`: Atomic inventory level changes.
  - `UPDATE_PRODUCT`: Formulation metadata and marketplace URL updates.
  - `CREATE_COUPON` & `TOGGLE_COUPON`: Campaign activation.
  - `PLACE_ORDER`: Direct D2C storefront checkout order creation and stock decrement.
  - `RESEED_DATABASE`: Automated master dummy data reset for sandbox, staging, and demo environments.

## 4. Migration Guidelines
1. **Never Run Raw Destructive Migrations in Production**:
   - Forbids `DROP TABLE`, `DROP COLUMN`, or `ALTER COLUMN ... TYPE` without backward compatibility.
2. **Expand-Contract Lifecycle**:
   - Step 1: Add new column as nullable.
   - Step 2: Deploy code writing to both old and new columns.
   - Step 3: Backfill historical rows.
   - Step 4: Deploy code reading exclusively from new column.
   - Step 5: Deprecate and drop old column in subsequent sprint release.
3. **Migration Verification**:
   - Automated CI testing runs migrations against a fresh PostgreSQL instance and validates that down-migrations (rollbacks) execute cleanly without errors.
