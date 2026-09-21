-- ==============================================================================
-- Care Beauty Solution - Database Seeding Script (seeds.sql)
-- Standard Enterprise D2C initial dataset
-- ==============================================================================

-- Products
INSERT INTO products (id, slug, title, subtitle, category, price, compare_at_price, stock, low_stock_threshold, sku, status, volume, description, hero_actives, marketplace_urls, rating, review_count)
VALUES
(
    'prod-cleanser-1',
    'gentle-clarifying-cream-cleanser',
    'Gentle Clarifying Cream Cleanser',
    'pH 5.5 Barrier-Safe Daily Wash',
    'cleanser',
    699.00,
    799.00,
    142,
    25,
    'CARE-CLN-150ML',
    'ACTIVE',
    '150 ml / 5.07 fl. oz.',
    'A non-stripping micro-emulsion cleanser with Oat Silk Extract, 3 Essential Ceramides, and Green Tea Polyphenols.',
    '["Oat Silk Extract (2%)", "Ceramides NP, AP, EOP", "Green Tea Polyphenols"]'::jsonb,
    '{"amazon": "https://amazon.in/dp/example-cleanser", "nykaa": "https://nykaa.com/care-a-cleanser", "flipkart": "https://flipkart.com/care-a-cleanser"}'::jsonb,
    4.90,
    128
),
(
    'prod-moisturizer-2',
    'barrier-shield-daily-moisturizer',
    'Barrier Shield Daily Moisturizer',
    'Multi-Ceramide 72-Hour Lipid Restorative Emulsion',
    'moisturizer',
    849.00,
    999.00,
    18,
    20,
    'CARE-MST-50ML',
    'ACTIVE',
    '50 ml / 1.69 fl. oz.',
    'Clinically proven to reduce Transepidermal Water Loss (TEWL) by 41% within 2 hours. Enriched with 5 Ceramides and 100% Plant Squalane.',
    '["5-Ceramide Biomimetic Complex", "100% Sugarcane Squalane (5%)", "Multi-Weight Hyaluronic Acid"]'::jsonb,
    '{"amazon": "https://amazon.in/dp/example-moisturizer", "nykaa": "https://nykaa.com/care-a-moisturizer", "flipkart": "https://flipkart.com/care-a-moisturizer"}'::jsonb,
    4.95,
    214
),
(
    'prod-sunscreen-3',
    'invisible-mineral-sunscreen-spf50',
    'Invisible Mineral Sunscreen SPF 50+ PA++++',
    'Zero-Residue Broad Spectrum Physical Filter',
    'sunscreen',
    749.00,
    899.00,
    84,
    20,
    'CARE-SPF-50ML',
    'ACTIVE',
    '50 ml / 1.69 fl. oz.',
    'Custom-milled Micronized Non-Nano Zinc Oxide engineered specifically for melanin-rich Indian skin undertones with zero chalkiness.',
    '["Non-Nano Micronized Zinc Oxide (14.2%)", "Cica / Centella Asiatica", "Niacinamide (2%)"]'::jsonb,
    '{"amazon": "https://amazon.in/dp/example-sunscreen", "nykaa": "https://nykaa.com/care-a-sunscreen", "flipkart": "https://flipkart.com/care-a-sunscreen"}'::jsonb,
    4.88,
    342
)
ON CONFLICT (id) DO NOTHING;

-- Customers
INSERT INTO customers (id, name, email, phone, skin_type, skin_concern, tier, orders_count, total_spent)
VALUES
('cust-1', 'Sandy Verma', 'sandyverma3@gmail.com', '+91 98765 43210', 'Combination', 'Barrier Repair & SPF Protection', 'VIP', 4, 6490.00),
('cust-2', 'Aanya Sharma', 'aanya.sharma@outlook.com', '+91 98112 34567', 'Dry & Sensitive', 'Transepidermal Water Loss', 'GOLD', 2, 3142.00),
('cust-3', 'Rohan Deshmukh', 'rohan.deshmukh@gmail.com', '+91 97654 32109', 'Oily', 'Sun Damage Prevention', 'SILVER', 1, 848.00),
('cust-4', 'Pooja Iyer', 'pooja.iyer@gmail.com', '+91 99201 88321', 'Normal', 'Gentle Cleansing', 'SILVER', 1, 798.00)
ON CONFLICT (id) DO NOTHING;

-- Coupons
INSERT INTO coupons (id, code, discount_percent, min_spend, usage_limit, used_count, is_active)
VALUES
('c-1', 'BARRIER15', 15, 1499.00, 500, 142, TRUE),
('c-2', 'WELCOME10', 10, 699.00, 1000, 389, TRUE),
('c-3', 'VIPFLAT200', NULL, 1999.00, 200, 45, TRUE)
ON CONFLICT (id) DO NOTHING;
