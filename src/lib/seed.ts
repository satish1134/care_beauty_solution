import { queryDb } from './db';
import { initializeDatabaseSchema } from './schema';

/**
 * Seeds initial Care & Beauty categories and products into Neon PostgreSQL.
 */
export async function seedDatabase() {
  console.log('[SEED] Ensuring database schema exists...');
  await initializeDatabaseSchema();

  console.log('[SEED] Seeding initial Categories...');
  
  const categorySql = `
    INSERT INTO categories (id, name, slug, description, image_url)
    VALUES 
      ('cat_1', 'Skincare Serums', 'skincare-serums', 'Nourishing facial serums and oils for radiant glow.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'),
      ('cat_2', 'Haircare Essentials', 'haircare-essentials', 'Organic shampoos, scalp cleansers, and hair masks.', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800'),
      ('cat_3', 'Body Care & Lotion', 'body-care-lotion', 'Hydrating body lotions and herbal scrubs.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800')
    ON CONFLICT (id) DO NOTHING;
  `;

  await queryDb(categorySql);

  console.log('[SEED] Seeding initial Beauty Products...');

  const productSql = `
    INSERT INTO products (id, category_id, title, slug, description, price, compare_price, stock_quantity, image_url, images, is_active)
    VALUES
      (
        'prod_1',
        'cat_1',
        'Hyaluronic Acid 2% + B5 Hydration Serum',
        'hyaluronic-acid-b5-hydration-serum',
        'Multi-depth hydration serum with ultra-pure hyaluronic acid for plumper, softer skin.',
        699.00,
        899.00,
        50,
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
        '["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800"]',
        TRUE
      ),
      (
        'prod_2',
        'cat_1',
        'Vitamin C 15% Glow Radiance Serum',
        'vitamin-c-glow-radiance-serum',
        'Potent antioxidant serum to brighten skin tone, reduce dark spots, and boost collagen production.',
        849.00,
        1099.00,
        35,
        'https://images.unsplash.com/photo-1608248597263-000799965d13?w=800',
        '["https://images.unsplash.com/photo-1608248597263-000799965d13?w=800"]',
        TRUE
      ),
      (
        'prod_3',
        'cat_2',
        'Nourishing Argan Oil Hair Mask',
        'nourishing-argan-oil-hair-mask',
        'Deep conditioning treatment infused with cold-pressed Moroccan argan oil for silky smooth tresses.',
        599.00,
        749.00,
        40,
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800',
        '["https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800"]',
        TRUE
      )
    ON CONFLICT (id) DO NOTHING;
  `;

  await queryDb(productSql);

  console.log('✅ [SEED] Database seeded successfully!');
  return { success: true, message: 'Database schema applied & sample products seeded successfully' };
}
