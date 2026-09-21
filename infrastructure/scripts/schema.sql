-- ==============================================================================
-- Care Beauty Solution - PostgreSQL Schema Definition (v1.0.0)
-- Matches Enterprise D2C Architecture Specification
-- Database: care_beauty_db
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    category VARCHAR(64) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    stock INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 20,
    sku VARCHAR(64) UNIQUE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    volume VARCHAR(64),
    description TEXT,
    hero_actives JSONB DEFAULT '[]'::jsonb,
    marketplace_urls JSONB DEFAULT '{}'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 4.90,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    skin_type VARCHAR(64),
    skin_concern VARCHAR(128),
    tier VARCHAR(32) DEFAULT 'SILVER',
    orders_count INTEGER DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(32) NOT NULL,
    payment_provider VARCHAR(32) NOT NULL DEFAULT 'RAZORPAY',
    payment_id VARCHAR(128),
    shipping_address JSONB NOT NULL,
    tracking_id VARCHAR(64),
    courier_partner VARCHAR(64),
    dispatch_date TIMESTAMPTZ,
    delivery_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    discount_percent INTEGER,
    discount_fixed NUMERIC(10, 2),
    min_spend NUMERIC(10, 2) DEFAULT 0.00,
    usage_limit INTEGER DEFAULT 100,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    "user" VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL,
    action VARCHAR(64) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL
);

-- 6. PRODUCT IMAGES TABLE (Supports 10+ images per product, drag-to-reorder, primary flag, focal points)
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    alt_text VARCHAR(255) NOT NULL DEFAULT '',
    caption VARCHAR(255),
    type VARCHAR(32) DEFAULT 'bottle', -- 'bottle', 'texture', 'application', 'routine', 'lifestyle', 'clinical'
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    focal_point_x NUMERIC(5, 2) DEFAULT 50.0,
    focal_point_y NUMERIC(5, 2) DEFAULT 50.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HERO CAMPAIGNS TABLE (Versioning, Draft/Published/Archived, Desktop/Mobile 16:9 & 9:16 responsive media)
CREATE TABLE IF NOT EXISTS hero_campaigns (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'PUBLISHED', 'ARCHIVED'
    eyebrow VARCHAR(255) NOT NULL DEFAULT 'THE CARe BARRIER RITUAL',
    headline TEXT NOT NULL,
    description TEXT NOT NULL,
    primary_cta_text VARCHAR(128) NOT NULL DEFAULT 'SHOP THE 3-STEP RITUAL →',
    primary_cta_url VARCHAR(255) NOT NULL DEFAULT '/#routine-builder',
    secondary_cta_text VARCHAR(128) NOT NULL DEFAULT 'EXPLORE THE SCIENCE',
    secondary_cta_url VARCHAR(255) NOT NULL DEFAULT '/science',
    desktop_media_url TEXT,
    desktop_media_type VARCHAR(32) DEFAULT 'video', -- 'video', 'image'
    mobile_media_url TEXT,
    mobile_media_type VARCHAR(32) DEFAULT 'video', -- 'video', 'image'
    poster_url TEXT,
    focal_point_x NUMERIC(5, 2) DEFAULT 50.0,
    focal_point_y NUMERIC(5, 2) DEFAULT 50.0,
    proof_points JSONB DEFAULT '["5 CERAMIDES", "72H HYDRATION", "SPF 50+", "ZERO WHITE CAST"]'::jsonb,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CENTRAL MEDIA LIBRARY ASSETS TABLE (Reuse media, metadata tracking, object-storage references)
CREATE TABLE IF NOT EXISTS media_assets (
    id VARCHAR(64) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    mime_type VARCHAR(64) NOT NULL,
    width INTEGER,
    height INTEGER,
    file_size INTEGER, -- bytes
    alt_text VARCHAR(255) DEFAULT '',
    category VARCHAR(64) DEFAULT 'product', -- 'product', 'hero', 'campaign', 'brand'
    focal_point_x NUMERIC(5, 2) DEFAULT 50.0,
    focal_point_y NUMERIC(5, 2) DEFAULT 50.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. HOMEPAGE SECTIONS TABLE
CREATE TABLE IF NOT EXISTS homepage_sections (
    id VARCHAR(64) PRIMARY KEY,
    section_key VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(128) NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    settings JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort ON product_images(product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_hero_campaigns_status ON hero_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_media_assets_category ON media_assets(category);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
