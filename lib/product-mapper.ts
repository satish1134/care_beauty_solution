import { Product, ProductGalleryItem, CORE_PRODUCTS } from '@/lib/products-data';
import { AdminProduct } from '@/lib/admin-store';

export function mergeStorefrontProducts(adminProducts: AdminProduct[]): Product[] {
  if (!adminProducts || adminProducts.length === 0) return CORE_PRODUCTS;

  // Filter for active/published products
  const activeAdminProducts = adminProducts.filter(
    (p) => p.status === 'PUBLISHED' || p.status === 'ACTIVE' || !p.status
  );

  // Sort by homepageOrder if available
  const sortedAdminProducts = [...activeAdminProducts].sort((a, b) => {
    const orderA = a.homepageOrder ?? a.homepagePosition ?? 99;
    const orderB = b.homepageOrder ?? b.homepagePosition ?? 99;
    return orderA - orderB;
  });

  return sortedAdminProducts.map((adminP) => {
    const base =
      CORE_PRODUCTS.find((cp) => cp.id === adminP.id || cp.category === adminP.category) ||
      CORE_PRODUCTS[0];

    const primaryImg =
      adminP.images?.find((i) => i.isPrimary)?.url ||
      adminP.images?.[0]?.url ||
      base.primaryImage;

    const galleryItems: ProductGalleryItem[] =
      adminP.images && adminP.images.length > 0
        ? adminP.images.map((img) => ({
            id: img.id,
            label: img.label || img.type || 'Product View',
            type: (img.type as ProductGalleryItem['type']) || 'bottle',
            caption: img.alt || '',
            url: img.url,
            alt: img.alt,
            focalPoint: img.focalPoint,
            isPrimary: img.isPrimary
          }))
        : base.images || [];

    const heroActives =
      adminP.heroIngredients && adminP.heroIngredients.length > 0
        ? adminP.heroIngredients.map((ing) => {
            const existing = base.heroActives?.find(
              (a) => a.name.toLowerCase() === ing.toLowerCase()
            );
            return (
              existing || {
                name: ing,
                percentage: 'Core',
                purpose: 'Barrier restoration'
              }
            );
          })
        : base.heroActives;

    return {
      ...base,
      id: adminP.id,
      name: adminP.cardTitle || adminP.title || base.name,
      subtitle: adminP.subtitle || base.subtitle,
      description: adminP.cardDescription || adminP.description || base.description,
      shortDescription: adminP.cardDescription || adminP.description || base.shortDescription,
      price: adminP.price || base.price,
      compareAtPrice: adminP.compareAtPrice || base.compareAtPrice,
      volume: adminP.volume || base.volume,
      stock: adminP.stock ?? base.stock,
      category: (adminP.category as Product['category']) || base.category,
      primaryImage: primaryImg,
      images: galleryItems,
      gallery: galleryItems,
      heroActives,
      bestFor:
        adminP.bestFor && adminP.bestFor.length > 0 ? adminP.bestFor : base.bestFor,
      keyBenefits:
        adminP.keyBenefits && adminP.keyBenefits.length > 0
          ? adminP.keyBenefits
          : base.keyBenefits,
      heroIngredients:
        adminP.heroIngredients && adminP.heroIngredients.length > 0
          ? adminP.heroIngredients
          : base.heroIngredients
    };
  });
}
