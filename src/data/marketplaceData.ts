import {
  MarketplaceProduct,
  CouponCode,
  SavedAddress,
  OrderRecord,
} from '../types/marketplace';
import product1Img from '../assets/product-1.jpeg';
import product2Img from '../assets/product-2.jpeg';
import product3Img from '../assets/product-3.jpeg';
import heroImg from '../assets/hero.png';
import headerLogoImg from '../assets/header-logo.png';
import fullLogoImg from '../assets/full-logo.png';

export const MOCK_COUPONS: CouponCode[] = [
  {
    code: 'CARE15',
    description: 'Flat 15% OFF on your order + Free Express Delivery',
    discountType: 'PERCENT',
    discountValue: 15,
    minOrder: 399,
  },
  {
    code: 'GLOW50',
    description: 'Instant ₹50 Discount on orders above ₹499',
    discountType: 'FIXED',
    discountValue: 50,
    minOrder: 499,
  },
  {
    code: 'FREESHIP',
    description: 'Free Express Shipping on any order',
    discountType: 'FIXED',
    discountValue: 49,
    minOrder: 299,
  },
];

export const MOCK_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Primary Address',
    phone: '9876543210',
    pincode: '560038',
    flatHouse: 'Flat 402, Royal Palms Residency',
    areaColony: '12th Main Indiranagar',
    landmark: 'Near Metro Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'HOME',
    isDefault: true,
  },
];

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  // ==========================================
  // 1. RAY BARRIER SUNSCREEN (SPF 50+ PA++++)
  // ==========================================
  {
    id: 'cbs-sunscreen-01',
    slug: 'ray-barrier-sunscreen-spf50',
    name: 'Ray Barrier Sunscreen SPF 50+ PA++++',
    brand: 'Care Beauty Solution',
    category: 'Sunscreen',
    subCategory: 'Broad Spectrum UV Defense',
    price: 499,
    mrp: 699,
    discount: 28,
    rating: 4.9,
    reviewCount: 3420,
    images: [
      product1Img,
      heroImg,
      headerLogoImg,
      fullLogoImg,
    ],
    variants: [
      { id: 'sun_50ml', name: '50 ml', sku: 'CBS-SUN-50', price: 499, mrp: 699, stock: 250 },
      { id: 'sun_100ml', name: '100 ml (Value Pack)', sku: 'CBS-SUN-100', price: 849, mrp: 1299, stock: 120 },
    ],
    description:
      'High protection. Comfortable everyday wear. A lightweight broad-spectrum sunscreen developed with modern UV filters to help protect skin against UVA and UVB rays. Designed for Indian heat and humidity with a comfortable finish that wears well throughout the day.',
    keyBenefits: [
      'Broad-spectrum SPF 50+',
      'PA++++ Protection',
      'No visible white cast* (*Subject to proper application and skin tone.)',
      'Lightweight texture',
      'Barrier-supportive formula',
      'Daily wear comfort',
    ],
    ingredients:
      'Modern Hybrid UV Filters (Tinosorb S, Uvinul A Plus), Ceramide NP, Niacinamide, Panthenol (Pro-Vitamin B5), Ectoin, Centella Asiatica Extract, Multi-Molecular Hyaluronic Acid, Purified Aqua, Glycerin, Allantoin, Tocopherol (Vitamin E), Propanediol, Caprylyl Glycol.',
    howToUse:
      'Apply two generous finger lengths evenly across clean face, neck, and ears as the final step of your morning skincare routine, 15 minutes before sun exposure. Reapply every 2 to 3 hours during prolonged sun exposure.',
    inStock: true,
    stockCount: 370,
    tags: [
      'SPF 50+ PA++++',
      'High Protection',
      'No Visible White Cast',
      'Modern UV Filters',
      'Indian Heat & Humidity Ready',
    ],
    skinConcerns: ['Sun Damage & Tanning', 'Barrier Repair', 'Dark Spots & Pigmentation'],
    skinTypes: ['All Skin Types', 'Dry', 'Combination', 'Sensitive', 'Oily'],
    formulation: 'Sunscreen Fluid',
    isFlashSale: true,
    flashSaleEndsAt: '2026-12-31',
    isBestseller: true,
    isTrending: true,
    isDealOfTheDay: true,
    frequentlyBoughtTogetherIds: ['cbs-cleanser-01', 'cbs-moisturizer-01'],
    reviews: [
      {
        id: 'rev_sun_1',
        userName: 'Rhea Sengupta',
        userCity: 'Bengaluru',
        rating: 5,
        title: 'Truly zero white cast on warm Indian skin tone!',
        comment:
          'Finally a sunscreen that does not make me look ghostly or feel greasy in humid weather. It absorbs in seconds, layers beautifully under makeup, and does not sting my eyes at all.',
        date: '2026-07-12',
        isVerified: true,
        helpfulCount: 142,
      },
      {
        id: 'rev_sun_2',
        userName: 'Dr. Kabir Varma',
        userCity: 'Delhi',
        rating: 5,
        title: 'Outstanding modern UV filter profile',
        comment:
          'As a dermatologist, I love that this formula pairs photostable modern filters with barrier champions like Ceramide NP, Ectoin, and Centella. High PA++++ photostability.',
        date: '2026-06-28',
        isVerified: true,
        helpfulCount: 98,
      },
    ],
  },

  // ==========================================
  // 2. HYDRATING MOISTURIZER
  // ==========================================
  {
    id: 'cbs-moisturizer-01',
    slug: 'hydrating-moisturizer',
    name: 'Hydrating Moisturizer',
    brand: 'Care Beauty Solution',
    category: 'Moisturizer',
    subCategory: 'Barrier Replenishment',
    price: 449,
    mrp: 599,
    discount: 25,
    rating: 4.9,
    reviewCount: 2840,
    images: [
      product2Img,
      '/images/care-cleanser-texture.svg',
      heroImg,
      headerLogoImg,
    ],
    variants: [
      { id: 'moist_50ml', name: '50 ml', sku: 'CBS-MST-50', price: 449, mrp: 599, stock: 310 },
      { id: 'moist_100ml', name: '100 ml (Value Pack)', sku: 'CBS-MST-100', price: 749, mrp: 1099, stock: 160 },
    ],
    description:
      'Lightweight hydration. Long-lasting comfort. A daily moisturiser formulated to replenish moisture while supporting the skin’s natural barrier. The lightweight texture absorbs quickly without leaving a greasy finish, making it suitable for everyday use in all seasons.',
    keyBenefits: [
      'Deep hydration',
      'Strengthens the skin barrier',
      'Lightweight, non-greasy finish',
      'Layers comfortably under sunscreen',
      'Daily barrier support',
    ],
    ingredients:
      'Ceramide Complex (Ceramide NP, Ceramide AP, Ceramide EOP), Niacinamide (Vitamin B3), Panthenol (Pro-Vitamin B5), Sodium PCA, Allantoin, Phytosphingosine, Cholesterol, Squalane, Hyaluronic Acid, Purified Water, Caprylic/Capric Triglyceride, Carbomer, Phenoxyethanol.',
    howToUse:
      'Gently smooth a coin-sized amount over face and neck after cleansing. Use morning and evening. In the morning, follow with Ray Barrier Sunscreen SPF 50+.',
    inStock: true,
    stockCount: 470,
    tags: [
      'Lightweight Hydration',
      'Strengthens Barrier',
      'Non-Greasy Finish',
      'Layers Under Sunscreen',
      'All Seasons',
    ],
    skinConcerns: ['Barrier Repair', 'Dryness & Dehydration', 'Sensitive & Redness'],
    skinTypes: ['All Skin Types', 'Dry', 'Combination', 'Sensitive', 'Oily'],
    formulation: 'Barrier Cream',
    isFlashSale: false,
    isBestseller: true,
    isTrending: true,
    isDealOfTheDay: true,
    frequentlyBoughtTogetherIds: ['cbs-cleanser-01', 'cbs-sunscreen-01'],
    reviews: [
      {
        id: 'rev_mst_1',
        userName: 'Pooja Nair',
        userCity: 'Kochi',
        rating: 5,
        title: 'Deeply hydrating without heavy stickiness',
        comment:
          'Sinks right in! My dry patches cleared up in just three days. Layers completely weightlessly under the Ray Barrier sunscreen.',
        date: '2026-07-04',
        isVerified: true,
        helpfulCount: 88,
      },
    ],
  },

  // ==========================================
  // 3. REFRESHING SKIN CLEANSER
  // ==========================================
  {
    id: 'cbs-cleanser-01',
    slug: 'refreshing-skin-cleanser',
    name: 'Refreshing Skin Cleanser',
    brand: 'Care Beauty Solution',
    category: 'Cleanser',
    subCategory: 'Gentle Barrier Cleansing',
    price: 399,
    mrp: 549,
    discount: 27,
    rating: 4.9,
    reviewCount: 1980,
    images: [
      product3Img,
      heroImg,
      '/images/care-cleanser-1-hero-marble.svg',
      '/images/care-cleanser-2-studio-isolated.svg',
      '/images/care-cleanser-3-lifestyle-vanity.svg',
      '/images/care-cleanser-texture.svg',
    ],
    variants: [
      { id: 'clean_100ml', name: '100 ml', sku: 'CBS-CLN-100', price: 399, mrp: 549, stock: 350 },
      { id: 'clean_200ml', name: '200 ml (Value Pack)', sku: 'CBS-CLN-200', price: 699, mrp: 999, stock: 180 },
    ],
    description:
      'Clean without stripping. A gentle daily cleanser that effectively removes dirt, excess oil and sunscreen while respecting the skin barrier. Powered by mild amino acid-based cleansing agents together with ceramides, panthenol and niacinamide to leave skin feeling clean, comfortable and hydrated.',
    keyBenefits: [
      'Cleanses without dryness',
      'Supports the skin barrier',
      'Helps maintain hydration',
      'Leaves skin soft and comfortable',
      'Suitable for daily use',
    ],
    ingredients:
      'Mild Amino Acid Surfactants (Sodium Cocoyl Glycinate, Sodium Lauroyl Oat Amino Acids), Ceramide Complex (Ceramide NP, AP, EOP), Niacinamide, Panthenol (Pro-Vitamin B5), Aloe Barbadensis (Aloe Vera) Leaf Juice, Glycerin, Allantoin, Disodium EDTA, Ethylhexylglycerin.',
    howToUse:
      'Dispense a pump into wet palms and lather gently. Massage onto damp face in circular motions for 45-60 seconds. Rinse thoroughly with lukewarm water and pat dry with a clean towel.',
    inStock: true,
    stockCount: 530,
    tags: [
      'Clean Without Stripping',
      'Amino Acid Surfactants',
      'Removes Sunscreen & Dirt',
      'Barrier Respectful',
      'Daily Gentle Cleanser',
    ],
    skinConcerns: ['Barrier Repair', 'Dryness & Dehydration', 'Oil & Pore Control', 'Sensitive & Redness'],
    skinTypes: ['All Skin Types', 'Dry', 'Combination', 'Sensitive', 'Oily'],
    formulation: 'Cleanser / Wash',
    isFlashSale: false,
    isBestseller: true,
    isTrending: true,
    isDealOfTheDay: false,
    frequentlyBoughtTogetherIds: ['cbs-moisturizer-01', 'cbs-sunscreen-01'],
    reviews: [
      {
        id: 'rev_cln_1',
        userName: 'Aakash Verma',
        userCity: 'Hyderabad',
        rating: 5,
        title: 'Zero tight or squeaky feeling after washing',
        comment:
          'Most cleansers leave my skin feeling tight and parched. This leaves it soft, completely calm, and ready for moisturizer. Easily washes off sunscreen too.',
        date: '2026-06-19',
        isVerified: true,
        helpfulCount: 74,
      },
    ],
  },
];

export const MOCK_ORDERS: OrderRecord[] = [
  {
    id: 'ord-109283',
    orderNumber: 'CBS-2026-88192',
    createdAt: '2026-08-20T14:32:00Z',
    items: [
      {
        productId: 'cbs-sunscreen-01',
        productName: 'Ray Barrier Sunscreen SPF 50+ PA++++',
        brand: 'Care Beauty Solution',
        variantName: '50 ml',
        image: '/images/care-ray-barrier-sunscreen.svg',
        price: 499,
        quantity: 1,
      },
      {
        productId: 'cbs-moisturizer-01',
        productName: 'Hydrating Moisturizer',
        brand: 'Care Beauty Solution',
        variantName: '50 ml',
        image: '/images/care-hydrating-moisturizer.svg',
        price: 449,
        quantity: 1,
      },
    ],
    shippingAddress: MOCK_SAVED_ADDRESSES[0],
    paymentMethod: 'UPI',
    subtotal: 948,
    discount: 142,
    couponCode: 'CARE15',
    deliveryCharge: 0,
    total: 806,
    status: 'SHIPPED',
    trackingNumber: 'DELHIVERY-982183921',
    courierPartner: 'Delhivery Express',
    estimatedDelivery: 'Tomorrow, by 8:00 PM',
    trackingHistory: [
      {
        status: 'PLACED',
        label: 'Order Placed & Payment Confirmed',
        date: '20 Aug 2026, 02:32 PM',
        completed: true,
        current: false,
      },
      {
        status: 'PACKED',
        label: 'Formulated & Dispatched from CBS Fulfillment Hub',
        date: '21 Aug 2026, 09:15 AM',
        completed: true,
        current: false,
      },
      {
        status: 'SHIPPED',
        label: 'In Transit to Indiranagar Delivery Center',
        date: '22 Aug 2026, 06:40 PM',
        completed: true,
        current: true,
      },
      {
        status: 'OUT_FOR_DELIVERY',
        label: 'Out for Delivery',
        date: 'Pending',
        completed: false,
        current: false,
      },
      {
        status: 'DELIVERED',
        label: 'Delivered',
        date: 'Pending',
        completed: false,
        current: false,
      },
    ],
  },
];
