import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS } from './initialData';

export function seedData() {
  console.log('🌱 Seeding Care Beauty Solution Storefront Database...');
  console.log(`✅ Loaded ${INITIAL_CATEGORIES.length} Categories:`);
  INITIAL_CATEGORIES.forEach(c => console.log(`   - [${c.id}] ${c.name} (${c.slug})`));

  console.log(`\n✅ Loaded ${INITIAL_PRODUCTS.length} Core CARe Products with Clinical Data:`);
  INITIAL_PRODUCTS.forEach(p => {
    console.log(`\n📦 Product: ${p.name} (ID: ${p.id}, Slug: ${p.slug})`);
    console.log(`   Tagline: ${p.tagline}`);
    console.log(`   Category: ${p.categoryName}`);
    console.log(`   Features: ${p.features?.join(', ')}`);
    console.log(`   Key Ingredients: ${p.keyIngredients.join(', ')}`);
    console.log(`   Variants (${p.variants.length}):`);
    p.variants.forEach(v => {
      console.log(`     • ${v.name} (SKU: ${v.sku}) - ₹${v.price} (Compare: ₹${v.compareAtPrice}) | Stock: ${v.stock}`);
    });
  });

  return {
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    coupons: INITIAL_COUPONS,
  };
}

// Execute if run directly from CLI
if (import.meta.url.endsWith('seed.ts') || process.argv[1]?.includes('seed')) {
  seedData();
  console.log('\n🎉 Care Beauty Solution Seed Script Executed Successfully!');
}
