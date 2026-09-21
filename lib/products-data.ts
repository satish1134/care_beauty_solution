export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface DetailedIngredient {
  name: string;
  percentage?: string;
  role: string;
  ewgRating: number;
  cellularFunction: string;
}

export interface ProductReview {
  id: string;
  author: string;
  verified: boolean;
  rating: number;
  date: string;
  title: string;
  comment: string;
  skinType: string;
  ageGroup: string;
  helpfulCount: number;
}

export interface ProductProtocol {
  timeOfDay: 'AM' | 'PM' | 'AM & PM';
  stepNumber: number;
  frequency: string;
  textureDescription: string;
  dermatologistTip: string;
  doNotMixWith?: string;
  pairsBestWith: string;
}

export interface ProductGalleryItem {
  id: string;
  label: string;
  type: 'bottle' | 'texture' | 'application' | 'routine' | 'lifestyle' | 'clinical';
  caption: string;
  url?: string;
  alt?: string;
  focalPoint?: { x: number; y: number };
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: 'cleanser' | 'moisturizer' | 'sunscreen' | 'bundle';
  price: number;
  compareAtPrice?: number;
  stock?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  volume: string;
  shortDescription: string;
  description: string;
  bestFor?: string[];
  keyBenefits?: string[];
  heroIngredients?: string[];
  primaryImage?: string;
  images?: ProductGalleryItem[];
  heroActives: { name: string; percentage?: string; purpose: string }[];
  clinicalResults: { metric: string; description: string }[];
  texture: string;
  finish: string;
  skinTypes: string[];
  concerns: string[];
  directions: string[];
  ingredients: string;
  marketplaceUrls: {
    amazon?: string;
    nykaa?: string;
    flipkart?: string;
  };
  accentColor: string;
  imageBg: string;
  gallery?: ProductGalleryItem[];
  detailedInci?: DetailedIngredient[];
  protocol?: ProductProtocol;
  reviews?: ProductReview[];
}

export const CORE_PRODUCTS: Product[] = [
  {
    id: 'prod-cleanser-01',
    slug: 'refreshing-skin-cleanser',
    name: 'REFRESHING SKIN CLEANSER',
    subtitle: 'Clean without stripping.',
    category: 'cleanser',
    price: 699,
    compareAtPrice: 799,
    rating: 4.9,
    reviewCount: 142,
    badge: 'Soap-Free & pH 5.5',
    volume: '120 ml',
    primaryImage: '/images/products/cleanser-bottle.svg',
    shortDescription:
      'A gentle daily cleanser that effectively removes dirt, excess oil and sunscreen while respecting the skin barrier.',
    description:
      'A gentle daily cleanser that effectively removes dirt, excess oil and sunscreen while respecting the skin barrier. Powered by mild amino acid-based cleansing agents together with ceramides, panthenol and niacinamide to leave skin feeling clean, comfortable and hydrated.',
    bestFor: ['Normal Skin', 'Dry Skin', 'Combination Skin', 'Sensitive Skin'],
    keyBenefits: [
      'Cleanses without dryness',
      'Supports the skin barrier',
      'Helps maintain hydration',
      'Leaves skin soft and comfortable',
      'Suitable for daily use'
    ],
    heroIngredients: ['Ceramides', 'Niacinamide', 'Panthenol', 'Aloe Vera'],
    heroActives: [
      { name: 'Ceramides (NP, AP, EOP)', percentage: '3.0%', purpose: 'Protects the skin barrier lipid envelope' },
      { name: 'Niacinamide (Vitamin B3)', percentage: '2.0%', purpose: 'Soothes inflammation and balances moisture' },
      { name: 'Panthenol (Pro-Vitamin B5)', percentage: '1.5%', purpose: 'Deep hydration and barrier soothing' },
      { name: 'Aloe Vera Extract', percentage: '2.0%', purpose: 'Hydrates and calms skin during cleansing' }
    ],
    clinicalResults: [
      { metric: '98%', description: 'Felt clean without dryness or tight skin after wash' },
      { metric: '95%', description: 'Effortlessly removes daily dirt, excess oil, and sunscreen' },
      { metric: '100%', description: 'Supports natural skin barrier integrity over continuous daily use' }
    ],
    texture: 'Rich, cashmere-creamy emulsion that blossoms into a delicate botanical milk',
    finish: 'Supple, bouncy, calm, and residue-free',
    skinTypes: ['Normal Skin', 'Dry Skin', 'Combination Skin', 'Sensitive Skin'],
    concerns: ['Damaged Barrier & Stinging', 'Daily Pollution & Sunscreen Removal', 'Sensitized & Redness'],
    directions: [
      'Dispense 1-2 pumps onto damp palms.',
      'Massage gently into face using slow, mindful circular strokes for 60 seconds.',
      'Rinse away with lukewarm water and press dry with a clean towel.'
    ],
    ingredients:
      'Aqua, Sodium Cocoyl Glycinate, Cocamidopropyl Betaine, Glycerin, Ceramide NP, Ceramide AP, Ceramide EOP, Niacinamide, Panthenol, Aloe Barbadensis Leaf Extract, Sodium PCA, Phytosphingosine, Cholesterol, Carbomer, Phenoxyethanol, Ethylhexylglycerin.',
    marketplaceUrls: {
      amazon: 'https://www.amazon.in/dp/B0CAREACLEAN',
      nykaa: 'https://www.nykaa.com/care-a-gentle-cleanser',
      flipkart: 'https://www.flipkart.com/care-a-cream-cleanser'
    },
    accentColor: '#10b981',
    imageBg: 'from-emerald-950 via-[#062412] to-slate-950',
    gallery: [
      { id: 'c-1', label: 'Primary Vessel', type: 'bottle', caption: '120 ml Ergonomic White Pump Bottle with Gold Mandala Crest', url: '/images/products/cleanser-bottle.svg', isPrimary: true },
      { id: 'c-2', label: 'Micro-Texture', type: 'texture', caption: 'Micro-emulsion velvet foam that lifts dirt without moisture depletion', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80' },
      { id: 'c-3', label: 'Application', type: 'application', caption: 'Morning & evening foundational step in the Sacred Barrier Regimen', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80' },
      { id: 'c-4', label: 'Step 01 Ritual', type: 'routine', caption: 'Soap-free, pH 5.5 balanced amino acid lather tested safe for daily use', url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80' }
    ],
    detailedInci: [
      { name: 'Sodium Cocoyl Glycinate', percentage: '12.0%', role: 'Bio-Surfactant', ewgRating: 1, cellularFunction: 'Ultra-mild coconut and glycine derived surfactant with zero lipid stripping' },
      { name: '11 Amino Acid Complex', percentage: '4.5%', role: 'NMF Replenisher', ewgRating: 1, cellularFunction: 'Mirrors stratum corneum natural amino profile to retain intercellular water' },
      { name: 'Fermented Green Tea (EGCG)', percentage: '2.0%', role: 'Antioxidant', ewgRating: 1, cellularFunction: 'Bio-fermented polyphenols that calm NF-kB inflammatory cascades' },
      { name: 'Colloidal Oat Flour', percentage: '1.5%', role: 'Colloidal Soother', ewgRating: 1, cellularFunction: 'Beta-glucan rich active forming breathable moisture shield' },
      { name: 'Allantoin', percentage: '0.5%', role: 'Epithelial Protectant', ewgRating: 1, cellularFunction: 'Promotes micro-desquamation without irritation' }
    ],
    protocol: {
      timeOfDay: 'AM & PM',
      stepNumber: 1,
      frequency: 'Daily (Twice Daily)',
      textureDescription: 'Rich silk cream turning into milky emulsion with zero squeaky dryness',
      dermatologistTip: 'Cleanse for full 60 seconds with lukewarm water to allow amino acids to bind to stratum corneum.',
      pairsBestWith: '5-Ceramide Velvet Cloud Cream'
    },
    reviews: [
      {
        id: 'rev-c-1',
        author: 'Dr. Ananya Iyer',
        verified: true,
        rating: 5,
        date: '3 days ago',
        title: 'Finally a cleanser that preserves the acid mantle',
        comment: 'As a dermatologist treating sensitized skin in Delhi pollution, this is my top recommendation. Leaves skin calm with zero tight sensation.',
        skinType: 'Sensitive / Rosacea-Prone',
        ageGroup: '30-38',
        helpfulCount: 38
      },
      {
        id: 'rev-c-2',
        author: 'Rohan Mehta',
        verified: true,
        rating: 5,
        date: '1 week ago',
        title: 'Melted away my waterproof sunscreen easily',
        comment: 'I use mineral sunscreen daily and most mild cleansers fail to remove it. This cleans deeply in one step without needing a harsh double wash.',
        skinType: 'Combination',
        ageGroup: '25-30',
        helpfulCount: 22
      }
    ]
  },
  {
    id: 'prod-moisturizer-02',
    slug: 'hydrating-moisturizer',
    name: 'HYDRATING MOISTURIZER',
    subtitle: 'Lightweight hydration. Long-lasting comfort.',
    category: 'moisturizer',
    price: 849,
    compareAtPrice: 999,
    rating: 4.95,
    reviewCount: 218,
    badge: 'Ceramides + Niacinamide',
    volume: '50 g',
    primaryImage: '/images/products/moisturizer-tube.svg',
    shortDescription:
      'A daily moisturiser formulated to replenish moisture while supporting the skin’s natural barrier.',
    description:
      'A daily moisturiser formulated to replenish moisture while supporting the skin’s natural barrier. The lightweight texture absorbs quickly without leaving a greasy finish, making it suitable for everyday use in all seasons.',
    bestFor: ['Normal Skin', 'Dry Skin', 'Combination Skin', 'Sensitive Skin'],
    keyBenefits: [
      'Deep hydration',
      'Strengthens the skin barrier',
      'Lightweight, non-greasy finish',
      'Layers comfortably under sunscreen',
      'Daily barrier support'
    ],
    heroIngredients: ['Ceramides', 'Niacinamide', 'Panthenol', 'Sodium PCA', 'Allantoin'],
    heroActives: [
      { name: 'Ceramides (NP, AP, EOP)', percentage: '3.0%', purpose: 'Mirrors natural stratum corneum to lock in moisture' },
      { name: 'Niacinamide', percentage: '2.5%', purpose: 'Strengthens barrier and balances moisture levels' },
      { name: 'Panthenol', percentage: '1.5%', purpose: 'Sustains hydration throughout all seasons' },
      { name: 'Sodium PCA & Allantoin', percentage: '2.0%', purpose: 'Deep hydration and barrier soothing' }
    ],
    clinicalResults: [
      { metric: '98%', description: 'Lightweight texture absorbs quickly with zero greasy finish' },
      { metric: '94%', description: 'Replenishes moisture and sustains all-day barrier comfort' },
      { metric: '92%', description: 'Layers comfortably under daily sunscreen' }
    ],
    texture: 'Lightweight lotion-cream that absorbs quickly without grease',
    finish: 'Cashmere-soft, natural dewy finish with zero oily residue',
    skinTypes: ['Normal Skin', 'Dry Skin', 'Combination Skin', 'Sensitive Skin'],
    concerns: ['Barrier Depletion', 'Daily Hydration', 'Moisture Retention in All Seasons'],
    directions: [
      'Dispense a hazelnut-sized amount from the tube.',
      'Gently press into face, neck, and chest in mindful upward glides.',
      'Use morning and evening following cleansing to seal in optimal hydration.'
    ],
    ingredients:
      'Aqua, Caprylic/Capric Triglyceride, Glycerin, Propanediol, Ceramide NP, Ceramide AP, Ceramide EOP, Niacinamide, Panthenol, Sodium PCA, Allantoin, Phytosphingosine, Cholesterol, Cetearyl Alcohol, Glyceryl Stearate, Sodium Hyaluronate, Tocopheryl Acetate, Phenoxyethanol, Ethylhexylglycerin.',
    marketplaceUrls: {
      amazon: 'https://www.amazon.in/dp/B0CAREAMOIST',
      nykaa: 'https://www.nykaa.com/care-a-barrier-shield-moisturizer',
      flipkart: 'https://www.flipkart.com/care-a-daily-moisturizer'
    },
    accentColor: '#d4af37',
    imageBg: 'from-amber-950 via-[#1f1604] to-slate-950',
    gallery: [
      { id: 'm-1', label: 'Primary Tube', type: 'bottle', caption: '50 g White Squeeze Tube with Precision Gold Collar Ring', url: '/images/products/moisturizer-tube.svg', isPrimary: true },
      { id: 'm-2', label: 'Cloud Swatch', type: 'texture', caption: 'Biomimetic gel-cream emulsion melting instantly on skin contact', url: 'https://images.unsplash.com/photo-1608248597359-007a8286a1f1?auto=format&fit=crop&w=1000&q=80' },
      { id: 'm-3', label: 'Skin Melt', type: 'application', caption: 'Absorbs quickly without greasy finish, layers comfortably under sunscreen', url: 'https://images.unsplash.com/photo-1512290900672-1f55b93b4e60?auto=format&fit=crop&w=1000&q=80' },
      { id: 'm-4', label: 'Step 02 Ritual', type: 'routine', caption: 'Core cellular sealing step for morning and nocturnal barrier repair', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80' }
    ],
    detailedInci: [
      { name: 'Biomimetic 5-Ceramide Matrix', percentage: '3.0%', role: 'Lipid Scaffold', ewgRating: 1, cellularFunction: 'Provides exact 3:1:1 physiological ratio (Ceramide NP, NS, AP, EOP, AS)' },
      { name: 'Olive Squalane (Phytosqualane)', percentage: '5.0%', role: 'Biomimetic Sebum', ewgRating: 1, cellularFunction: 'Prevents transepidermal moisture loss without blocking sebaceous pores' },
      { name: 'Madecassoside (95% Pure Centella)', percentage: '1.2%', role: 'Cytokine Inhibitor', ewgRating: 1, cellularFunction: 'Accelerates collagen synthesis and calms heat-induced erythema' },
      { name: 'Multi-Weight Sodium Hyaluronate', percentage: '2.0%', role: 'Dual Hygroscopic', ewgRating: 1, cellularFunction: 'High MW seals surface while oligo-HA hydrates deep basal layers' },
      { name: 'Niacinamide (Vitamin B3)', percentage: '2.0%', role: 'Lipid Stimulator', ewgRating: 1, cellularFunction: 'Boosts endogenous ceramide synthesis and evens texture' }
    ],
    protocol: {
      timeOfDay: 'AM & PM',
      stepNumber: 2,
      frequency: 'Daily (Morning & Night)',
      textureDescription: 'Cashmere cloud cream that melts instantly into water-light hydration veil',
      dermatologistTip: 'Apply on slightly damp skin immediately after cleansing to trap maximum moisture.',
      pairsBestWith: 'Amino Silk Cloud Cleanser & Invisible Silk Mineral Veil SPF 50+'
    },
    reviews: [
      {
        id: 'rev-m-1',
        author: 'Pooja Kashyap',
        verified: true,
        rating: 5,
        date: '5 days ago',
        title: 'Saved my peeling barrier from retinol burn',
        comment: 'I overdid prescription retinoids and my skin was burning with regular water. Two applications of this cream completely soothed the stinging.',
        skinType: 'Dry & Compromised',
        ageGroup: '28-34',
        helpfulCount: 54
      },
      {
        id: 'rev-m-2',
        author: 'Kunal Singhania',
        verified: true,
        rating: 5,
        date: '2 weeks ago',
        title: 'Non-greasy in high humidity',
        comment: 'Living in Mumbai, most moisturizers feel like an oil slick by noon. This one hydrates deeply while keeping skin matte and breathable.',
        skinType: 'Oily / Combination',
        ageGroup: '30-40',
        helpfulCount: 31
      }
    ]
  },
  {
    id: 'prod-sunscreen-03',
    slug: 'ray-barrier-sunscreen-spf50',
    name: 'RAY BARRIER SUNSCREEN',
    subtitle: 'SPF 50+ PA++++ • High protection. Comfortable everyday wear.',
    category: 'sunscreen',
    price: 749,
    compareAtPrice: 899,
    rating: 4.88,
    reviewCount: 174,
    badge: 'SPF 50+ PA++++ Zero Cast',
    volume: '100 ml',
    primaryImage: '/images/products/sunscreen-bottle.svg',
    shortDescription:
      'A lightweight broad-spectrum sunscreen developed with modern UV filters to help protect skin against UVA and UVB rays.',
    description:
      'A lightweight broad-spectrum sunscreen developed with modern UV filters to help protect skin against UVA and UVB rays. Designed for Indian heat and humidity with a comfortable finish that wears well throughout the day.',
    bestFor: ['Normal Skin', 'Dry Skin', 'Combination Skin', 'Sensitive Skin', 'Melanin-Rich (Fitzpatrick IV-VI)'],
    keyBenefits: [
      'Broad-spectrum SPF 50+',
      'PA++++ Protection',
      'No visible white cast* (*Subject to proper application and skin tone.)',
      'Lightweight texture',
      'Barrier-supportive formula',
      'Daily wear comfort'
    ],
    heroIngredients: ['Modern UV Filters', 'Ceramide NP', 'Niacinamide', 'Panthenol', 'Ectoin', 'Centella Asiatica', 'Hyaluronic Acid'],
    heroActives: [
      { name: 'Modern UV Filters', percentage: '16.5%', purpose: 'Broad-spectrum UVA & UVB photoprotection' },
      { name: 'Ceramide NP', percentage: '2.0%', purpose: 'Barrier-supportive lipid defense' },
      { name: 'Niacinamide & Panthenol', percentage: '2.5%', purpose: 'Hydrating, barrier comfort and tone care' },
      { name: 'Ectoin, Centella & Hyaluronic Acid', percentage: '2.0%', purpose: 'Soothes heat stress and retains moisture' }
    ],
    clinicalResults: [
      { metric: 'SPF 50+', description: 'Certified broad-spectrum UVA/UVB defense (PA++++)' },
      { metric: '100%', description: 'No visible white cast* (*Subject to proper application and skin tone)' },
      { metric: '96%', description: 'Lightweight texture with comfortable daily wear in heat and humidity' }
    ],
    texture: 'Water-light fluid that vanishes into a velvety, breathable solar veil',
    finish: 'Silky, natural invisible semi-matte finish that breathes naturally',
    skinTypes: ['Normal Skin', 'Dry Skin', 'Combination Skin', 'Sensitive Skin', 'Melanin-Rich (Fitzpatrick IV-VI)'],
    concerns: ['Broad-Spectrum UVA/UVB Protection', 'White Cast Prevention', 'Heat & Humidity Wear'],
    directions: [
      'Shake bottle gently before each morning ritual.',
      'Smooth two full finger-lengths generously across face, neck, and ears as the final step.',
      'Reapply every 2-3 hours during direct tropical sun exposure.'
    ],
    ingredients:
      'Aqua, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Ethylhexyl Triazone, Methylene Bis-Benzotriazolyl Tetramethylbutylphenol, Ceramide NP, Niacinamide, Panthenol, Ectoin, Centella Asiatica Extract, Sodium Hyaluronate, Propanediol, Silica, Phenoxyethanol, Ethylhexylglycerin.',
    marketplaceUrls: {
      amazon: 'https://www.amazon.in/dp/B0CAREASUN',
      nykaa: 'https://www.nykaa.com/care-a-mineral-sunscreen-spf50',
      flipkart: 'https://www.flipkart.com/care-a-spf50-sunscreen'
    },
    accentColor: '#38bdf8',
    imageBg: 'from-sky-950 via-[#071f2c] to-slate-950',
    gallery: [
      { id: 's-1', label: 'Primary Vessel', type: 'bottle', caption: '100 ml Tall White Pump Bottle with Crystal-Clear Cap & Botanical Seal', url: '/images/products/sunscreen-bottle.svg', isPrimary: true },
      { id: 's-2', label: 'Water-Light Fluid', type: 'texture', caption: 'Ultra-thin fluid sunscreen melting completely invisible on skin', url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80' },
      { id: 's-3', label: 'Zero-Cast Blend', type: 'application', caption: 'Tested transparent blend on deep Indian skin tones (Fitzpatrick IV-VI)', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=80' },
      { id: 's-4', label: 'Step 03 Ritual', type: 'routine', caption: 'Final essential morning armor against UVA/UVB and indoor blue light', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80' }
    ],
    detailedInci: [
      { name: 'Micronized Non-Nano Zinc Oxide', percentage: '18.5%', role: 'Physical UV Shield', ewgRating: 1, cellularFunction: 'Diffuses solar radiation without skin penetration or radical formation' },
      { name: 'Extremolyte Ectoin', percentage: '1.0%', role: 'HEV Blue Light Guard', ewgRating: 1, cellularFunction: 'Halophile amino acid forming protective water shell around membrane proteins' },
      { name: 'Ferulic Acid & Resveratrol', percentage: '0.8%', role: 'Photostabilizer', ewgRating: 1, cellularFunction: 'Neutralizes secondary free radicals produced by ambient infrared light' },
      { name: 'Alpha-Bisabolol', percentage: '0.5%', role: 'Solar Soother', ewgRating: 1, cellularFunction: 'Chamomile-derived active suppressing UV-induced erythema' }
    ],
    protocol: {
      timeOfDay: 'AM',
      stepNumber: 3,
      frequency: 'Daily (Morning Ritual)',
      textureDescription: 'Featherlight shake-well milk that vanishes completely into a velvet-soft primer veil',
      dermatologistTip: 'Apply two full finger-lengths across face and ears 15 minutes before sun exposure.',
      pairsBestWith: '5-Ceramide Velvet Cloud Cream'
    },
    reviews: [
      {
        id: 'rev-s-1',
        author: 'Tanvi Deshmukh',
        verified: true,
        rating: 5,
        date: '4 days ago',
        title: 'Zero ghost cast on Dusky Indian skin!',
        comment: 'Every mineral sunscreen I tried looked like purple chalk on my NC42 skin tone. This disappeared in 10 seconds with zero white cast.',
        skinType: 'Melanin-Rich / Oily',
        ageGroup: '24-32',
        helpfulCount: 67
      },
      {
        id: 'rev-s-2',
        author: 'Arjun Nambiar',
        verified: true,
        rating: 5,
        date: '1 week ago',
        title: 'No eye burning during morning runs',
        comment: 'Chemical sunscreens always stung my eyes when sweating. This mineral formula stays completely in place even during outdoor workouts.',
        skinType: 'Normal / Athletic',
        ageGroup: '30-38',
        helpfulCount: 29
      }
    ]
  }
];

export const CORE_TRIO_BUNDLE = {
  id: 'bundle-core-trio',
  slug: 'the-core-trio-regimen',
  name: 'The 3-Step Barrier Renaissance Ritual',
  subtitle: 'Reset. Replenish. Shield. The Complete Sacred Protocol',
  price: 1999,
  compareAtPrice: 2347,
  savingsPercent: 15,
  badge: 'Complete Sacred Ritual (Save ₹348)',
  items: CORE_PRODUCTS.map((p) => p.name)
};
