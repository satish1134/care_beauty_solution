import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  Check,
  ShieldCheck,
  Droplets,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Eye,
  Camera,
  Maximize2,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';

/* =========================================================================
   3 FLAGSHIP PRODUCTS CONFIGURATION (LUXURY MINIMAL DESIGN SYSTEM)
   ========================================================================= */

export interface FlagshipGalleryItem {
  id: string;
  url: string;
  label: string;
  tag: string;
}

export interface FlagshipProductStage {
  id: string;
  slug: string;
  stageNum: '01' | '02' | '03';
  stageIndex: number;
  navLabel: string;
  categoryTag: string;
  name: string;
  subName: string;
  headline: string;
  tagline: string;
  price: number;
  mrp: number;
  discountPct: string;
  canvasBgColor: string; // Dynamic Canvas Color (#FAFAFA, #F5EBE6, #EAF3F0)
  themeAccentHex: number;
  themeAccentCss: string;
  ctaText: string;
  gallery: FlagshipGalleryItem[];
  fluidType: 'serum-ribbon' | 'cream-wave' | 'gel-bubbles';
  specs: {
    label: string;
    value: string;
    sub: string;
  }[];
}

const STAGES: FlagshipProductStage[] = [
  {
    id: 'prod-refreshing-skin-cleanser',
    slug: 'refreshing-skin-cleanser',
    stageNum: '01',
    stageIndex: 0,
    navLabel: '01 CLEANSER',
    categoryTag: 'STAGE 01 // PURIFY & PREP',
    name: 'REFRESHING SKIN CLEANSER',
    subName: 'SOAP-FREE BARRIER GEL • 120 ML',
    headline: '15-Second Meltdown. Zero Tightness.',
    tagline: 'Hydra-Surfactant amino acid matrix with Niacinamide & Panthenol that purges atmospheric pollutants without disrupting your natural acid mantle.',
    price: 499,
    mrp: 699,
    discountPct: '28% OFF',
    canvasBgColor: '#FAFAFA', // Crisp Organic Off-White
    themeAccentHex: 0xc86d51, // Earthy Terracotta
    themeAccentCss: '#C86D51',
    ctaText: 'ADD TO CART — ₹499',
    gallery: [
      {
        id: 'cl-1',
        url: '/images/care-cleanser-1-hero-marble.svg',
        label: 'Studio Front',
        tag: 'Hero Bottle',
      },
      {
        id: 'cl-2',
        url: '/images/care-cleanser-2-studio-isolated.svg',
        label: 'Studio Cutout',
        tag: 'Packaging',
      },
      {
        id: 'cl-3',
        url: '/images/care-cleanser-3-lifestyle-vanity.svg',
        label: 'Vanity Setup',
        tag: 'Lifestyle',
      },
      {
        id: 'cl-4',
        url: '/images/care-cleanser-texture.svg',
        label: 'Gel Swatch',
        tag: 'Texture',
      },
      {
        id: 'cl-5',
        url: '/images/care-cleanser-5-pump-closeup.svg',
        label: 'Pump Detail',
        tag: 'Packaging',
      },
      {
        id: 'cl-6',
        url: '/images/care-cleanser-6-label-detail.svg',
        label: 'Formula Macro',
        tag: 'Ingredients',
      },
      {
        id: 'cl-7',
        url: '/images/care-cleanser-8-quarter-left.svg',
        label: 'Quarter View',
        tag: 'Product Angle',
      },
    ],
    fluidType: 'serum-ribbon',
    specs: [
      { label: 'FORMULATION', value: 'pH 5.5 Exact', sub: 'Soap-Free Mantle' },
      { label: 'ACTIVE BASE', value: 'Niacinamide', sub: '+ Panthenol B5' },
      { label: 'BARRIER SCORE', value: '+94% Lock', sub: 'Zero Tightness' },
    ],
  },
  {
    id: 'prod-hydrating-moisturizer',
    slug: 'hydrating-moisturizer',
    stageNum: '02',
    stageIndex: 1,
    navLabel: '02 MOISTURIZER',
    categoryTag: 'STAGE 02 // RESTORE & SEAL',
    name: 'HYDRATING MOISTURIZER',
    subName: '72H VELVET MOISTURE CUSHION • 50 ML',
    headline: 'Triple Ceramide AP/NP/EOP. 72-Hour Shield.',
    tagline: 'Whipped cashmere cream infused with multi-molecular Ceramides for instant lipid restoration and a luminous cloud-matte skin finish.',
    price: 599,
    mrp: 799,
    discountPct: '25% OFF',
    canvasBgColor: '#F5EBE6', // Soft Muted Pastel Clay
    themeAccentHex: 0xb85d43, // Deep Terracotta / Pastel Clay Accent
    themeAccentCss: '#B85D43',
    ctaText: 'ADD TO CART — ₹599',
    gallery: [
      {
        id: 'mo-1',
        url: '/images/care-hydrating-moisturizer.svg',
        label: 'Ceramide Tube',
        tag: 'Hero Packaging',
      },
      {
        id: 'mo-2',
        url: '/images/care-hydrating-moisturizer.svg',
        label: 'Studio Detail',
        tag: 'Texture',
      },
      {
        id: 'mo-3',
        url: '/images/care-hydrating-moisturizer.svg',
        label: 'Brand Closeup',
        tag: 'Lifestyle',
      },
    ],
    fluidType: 'cream-wave',
    specs: [
      { label: 'LIPID MATRIX', value: '3x Ceramides', sub: 'AP / NP / EOP' },
      { label: 'HYDRATION', value: '72 Hours', sub: 'Time-Release' },
      { label: 'FINISH', value: 'Velvet Matte', sub: 'Zero Shine' },
    ],
  },
  {
    id: 'prod-ray-barrier-sunscreen',
    slug: 'ray-barrier-sunscreen',
    stageNum: '03',
    stageIndex: 2,
    navLabel: '03 SUNSCREEN',
    categoryTag: 'STAGE 03 // DEFEND & REFLECT',
    name: 'RAY BARRIER SUNSCREEN',
    subName: 'ZERO-CAST WATER BURST SPF 50+ • 50 ML',
    headline: 'PA++++ Broad Spectrum. 100% Invisible.',
    tagline: 'Ultra-fluid water burst sunscreen engineered specifically for diverse Indian skin tones. Melts with zero white cast and zero stickiness.',
    price: 649,
    mrp: 849,
    discountPct: '24% OFF',
    canvasBgColor: '#EAF3F0', // Light Mint / Aqua Tone
    themeAccentHex: 0x4f8b78, // Muted Botanical Mint Accent
    themeAccentCss: '#4F8B78',
    ctaText: 'ADD TO CART — ₹649',
    gallery: [
      {
        id: 'sun-1',
        url: '/images/care-ray-barrier-sunscreen.svg',
        label: 'SPF Pump Bottle',
        tag: 'Hero Protection',
      },
      {
        id: 'sun-2',
        url: '/images/care-ray-barrier-sunscreen.svg',
        label: 'Water-Gel Burst',
        tag: 'Texture',
      },
      {
        id: 'sun-3',
        url: '/images/care-ray-barrier-sunscreen.svg',
        label: 'Outdoor Ready',
        tag: 'Lifestyle',
      },
    ],
    fluidType: 'gel-bubbles',
    specs: [
      { label: 'PROTECTION', value: 'SPF 50+ PA++++', sub: 'UV-A / UV-B Shield' },
      { label: 'TEXTURE', value: 'Water Burst', sub: '100% Invisible Cast' },
      { label: 'RESISTANCE', value: '80 Mins', sub: 'Sweat Proof' },
    ],
  },
];

/* =========================================================================
   ASMR SOUND SYNTHESIZER
   ========================================================================= */

class StageAsmrSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public playStageTransition(stageIdx: number) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const baseFreq = stageIdx === 0 ? 320 : stageIdx === 1 ? 420 : 520;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // safe fallback
    }
  }

  public playAddToCartChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.12, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.32);
      });
    } catch {
      // safe fallback
    }
  }
}

const asmrSynth = new StageAsmrSynth();

/* =========================================================================
   COMPONENT PROPS
   ========================================================================= */

interface Flagship3DProductShowcaseProps {
  products?: Product[];
  activeStageIndexProp?: number;
  onStageChange?: (index: number) => void;
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
  onOpenCart?: () => void;
  cartCount?: number;
}

export const Flagship3DProductShowcase: React.FC<Flagship3DProductShowcaseProps> = ({
  products = [],
  activeStageIndexProp = 0,
  onStageChange,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onOpenCart,
  cartCount = 0,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const [activeStageIndex, setActiveStageIndex] = useState<number>(activeStageIndexProp);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [addedStageIndex, setAddedStageIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync prop changes into local state
  useEffect(() => {
    if (typeof activeStageIndexProp === 'number' && activeStageIndexProp !== activeStageIndex) {
      setActiveStageIndex(activeStageIndexProp);
    }
  }, [activeStageIndexProp]);

  const currentStage = STAGES[activeStageIndex] || STAGES[0];
  const activeImage = currentStage.gallery[activeImageIndex] || currentStage.gallery[0];

  // Reset active image on stage change
  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeStageIndex]);

  // Matched Product
  const matchedProduct = useMemo(() => {
    return (
      products.find(p => p.id === currentStage.id || p.slug === currentStage.slug) ||
      ({
        id: currentStage.id,
        slug: currentStage.slug,
        name: currentStage.name,
        tagline: currentStage.tagline,
        categoryName: 'Dermatological Barrier Care',
        categoryId: 'cat-barrier',
        skinConcerns: ['Barrier Repair', 'Sensitive Skin'],
        skinTypes: ['All Skin Types', 'Sensitive'],
        keyIngredients: ['3x Ceramides', 'Niacinamide'],
        fullIngredients: 'Aqua, Glycerin, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol.',
        howToUse: 'Apply onto clean face and neck daily.',
        clinicalClaims: [currentStage.headline],
        features: ['Dermatologist Formulated', 'Soap Free', 'Fragrance Free'],
        price: currentStage.price,
        variants: [
          {
            id: `${currentStage.id}-v1`,
            size: 'Standard Package',
            price: currentStage.price,
            mrp: currentStage.mrp,
            stock: 50,
          },
        ],
        description: currentStage.tagline,
        images: currentStage.gallery.map(g => ({
          id: g.id,
          url: g.url,
          altText: g.label,
          isPrimary: false,
        })),
        rating: 4.9,
        reviewCount: 380,
      } as unknown as Product)
    );
  }, [products, currentStage]);

  /* =========================================================================
     REFINED AMBIENT THREE.JS AURA (DELICATE, NON-OBSTRUCTIVE)
     ========================================================================= */

  const threeEngineRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ambientFluidGroup: THREE.Group;
    fluidRings: THREE.Mesh[];
    lights: {
      ambient: THREE.AmbientLight;
      accent: THREE.PointLight;
    };
    clock: THREE.Clock;
    animFrameId?: number;
  } | null>(null);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.replaceChildren(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambient);

    const accent = new THREE.PointLight(currentStage.themeAccentHex, 2.5, 30);
    accent.position.set(4, 3, 5);
    scene.add(accent);

    // Delicate, ambient glass fluid orbits placed subtly around the perimeter
    const ambientFluidGroup = new THREE.Group();
    scene.add(ambientFluidGroup);

    const fluidMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xc86d51,
      emissiveIntensity: 0.12,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.33,
      clearcoat: 1.0,
    });

    const fluidRings: THREE.Mesh[] = [];
    const ringGeometries = [
      new THREE.TorusGeometry(3.6, 0.06, 16, 100),
      new THREE.TorusGeometry(4.8, 0.04, 16, 100),
      new THREE.TorusGeometry(2.8, 0.05, 16, 100),
    ];

    ringGeometries.forEach((geo, idx) => {
      const ring = new THREE.Mesh(geo, fluidMat);
      ring.rotation.x = Math.PI / 3 + idx * 0.4;
      ring.rotation.y = idx * 0.5;
      ambientFluidGroup.add(ring);
      fluidRings.push(ring);
    });

    const clock = new THREE.Clock();

    threeEngineRef.current = {
      scene,
      camera,
      renderer,
      ambientFluidGroup,
      fluidRings,
      lights: { ambient, accent },
      clock,
    };

    const animate = () => {
      const t = clock.getElapsedTime();
      const eng = threeEngineRef.current;
      if (eng) {
        eng.ambientFluidGroup.rotation.y = t * 0.08 + mousePos.x * 0.05;
        eng.ambientFluidGroup.rotation.x = t * 0.04 + mousePos.y * 0.05;

        eng.fluidRings.forEach((r, i) => {
          r.rotation.z = t * (0.05 + i * 0.02);
        });

        eng.renderer.render(eng.scene, eng.camera);
      }
      threeEngineRef.current!.animFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container || !threeEngineRef.current) return;
      const nw = container.clientWidth || window.innerWidth;
      const nh = container.clientHeight || window.innerHeight;
      threeEngineRef.current.camera.aspect = nw / nh;
      threeEngineRef.current.camera.updateProjectionMatrix();
      threeEngineRef.current.renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeEngineRef.current?.animFrameId) {
        cancelAnimationFrame(threeEngineRef.current.animFrameId);
      }
      renderer.dispose();
    };
  }, []);

  // Update dynamic accent on stage change
  useEffect(() => {
    const engine = threeEngineRef.current;
    if (!engine) return;
    engine.lights.accent.color.setHex(currentStage.themeAccentHex);
  }, [currentStage]);

  // Scroll Tracking & Stage Snapping
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const totalHeight = container.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalHeight));

    const stageIdx = Math.min(2, Math.floor(progress * 2 + 0.5));
    if (stageIdx !== activeStageIndex) {
      setActiveStageIndex(stageIdx);
      if (onStageChange) onStageChange(stageIdx);
      asmrSynth.playStageTransition(stageIdx);
    }
  }, [activeStageIndex, onStageChange]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Mouse Parallax Track
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const normX = (clientX / window.innerWidth - 0.5) * 2;
    const normY = (clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x: normX, y: normY });
  };

  // Direct Product Stage Switcher
  const switchProductStage = (stageIdx: number) => {
    setActiveStageIndex(stageIdx);
    if (onStageChange) {
      onStageChange(stageIdx);
    }
    asmrSynth.playStageTransition(stageIdx);
  };

  const handleNextStage = () => {
    const nextIdx = (activeStageIndex + 1) % STAGES.length;
    switchProductStage(nextIdx);
  };

  const handlePrevStage = () => {
    const prevIdx = (activeStageIndex - 1 + STAGES.length) % STAGES.length;
    switchProductStage(prevIdx);
  };

  // Add to Cart
  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onAddToCart && matchedProduct) {
      const variant = matchedProduct.variants[0];
      onAddToCart(matchedProduct, variant, 1);
      setAddedStageIndex(activeStageIndex);
      asmrSynth.playAddToCartChime();
      setTimeout(() => setAddedStageIndex(null), 2000);
    }
  };

  // Buy Now
  const handleBuyNow = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onBuyNow && matchedProduct) {
      const variant = matchedProduct.variants[0];
      onBuyNow(matchedProduct, variant, 1);
      asmrSynth.playAddToCartChime();
    }
  };

  // Listen to Navbar clicks
  useEffect(() => {
    const handleExternalStageSelect = (e: CustomEvent<{ index: number }>) => {
      if (typeof e.detail?.index === 'number') {
        switchProductStage(e.detail.index);
      }
    };
    window.addEventListener('care_select_stage' as any, handleExternalStageSelect as EventListener);
    return () => {
      window.removeEventListener('care_select_stage' as any, handleExternalStageSelect as EventListener);
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-80px)] lg:min-h-[850px] w-full flex items-center justify-center overflow-hidden font-sans select-none transition-colors duration-700 ease-out py-8 sm:py-12"
      style={{ backgroundColor: currentStage.canvasBgColor }}
    >
      {/* Subtle Ambient 3D Fluid Aura */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
        aria-hidden="true"
      />

      {/* Ambient Gradient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-colors duration-700"
        style={{
          backgroundColor: `${currentStage.themeAccentCss}30`,
        }}
      />

      {/* =======================================================================
          MAIN STOREFRONT CONTAINER
          ======================================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-between min-h-[720px] lg:min-h-[760px] h-full pt-8 sm:pt-10 pb-6 sm:pb-8 pointer-events-none">
          
          {/* Top Bar: In-Showcase Stage Switcher & Audio Control */}
          <div className="flex items-center justify-between pointer-events-auto gap-3">
            
            {/* Quick Product Stage Switcher Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-full bg-white/70 backdrop-blur-md border border-black/5 shadow-xs">
              {STAGES.map((stg) => {
                const isCurrent = stg.stageIndex === activeStageIndex;
                return (
                  <button
                    key={stg.id}
                    onClick={() => switchProductStage(stg.stageIndex)}
                    className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0D261B] text-white shadow-xs'
                        : 'text-[#0D261B]/60 hover:text-[#0D261B] hover:bg-black/5'
                    }`}
                  >
                    {stg.navLabel}
                  </button>
                );
              })}
            </div>

            {/* Right: Stage Navigation Chevrons + Audio Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/70 backdrop-blur-md p-1 rounded-full border border-black/5 shadow-xs">
                <button
                  onClick={handlePrevStage}
                  className="p-1.5 hover:bg-black/5 rounded-full text-[#0D261B] transition cursor-pointer"
                  title="Previous Product"
                  aria-label="Previous Product"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold px-1 text-[#0D261B]/80">
                  {activeStageIndex + 1}/3
                </span>
                <button
                  onClick={handleNextStage}
                  className="p-1.5 hover:bg-black/5 rounded-full text-[#0D261B] transition cursor-pointer"
                  title="Next Product"
                  aria-label="Next Product"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  const nextMuted = !isAudioMuted;
                  setIsAudioMuted(nextMuted);
                  asmrSynth.setMuted(nextMuted);
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/70 hover:bg-white text-[#0D261B] backdrop-blur-md rounded-full border border-black/5 transition shadow-xs cursor-pointer text-xs font-mono"
                title={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
                aria-label="Toggle Sound"
              >
                {isAudioMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[11px] text-rose-500 font-medium">MUTED</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#0D261B]" />
                    <span className="text-[11px] text-[#0D261B]/70 font-medium">AUDIO ON</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* =====================================================================
              BRAND-FIRST MINIMAL ROUTINE STRIP
              ===================================================================== */}
          <div className="mb-6 pointer-events-auto">
            <div className="rounded-[30px] border border-[#0D261B]/5 bg-[#f8f5f1] shadow-[0_10px_28px_rgba(13,38,27,0.04)] p-4 sm:p-5">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                  <img
                    src="/images/care-header-no-tagline.svg"
                    alt="CARe Brand Emblem"
                    className="w-24 sm:w-32 xl:w-40 h-auto object-contain shrink-0"
                  />
                  <div className="min-w-0 border-l border-[#0D261B]/10 pl-4 sm:pl-5">
                    <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.28em] text-[#0D261B]/55">
                      Signature routine
                    </p>
                    <h2 className="font-syne text-xl sm:text-2xl xl:text-[2.4rem] font-black uppercase tracking-[-0.06em] text-[#0D261B] leading-[0.95] mt-1">
                      Cleanse • Hydrate • Defend
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center xl:justify-end gap-2.5 sm:gap-3">
                  {[
                    { index: 0, name: 'Cleanser', image: '/images/care-cleanser-1-hero-marble.svg' },
                    { index: 1, name: 'Moisturizer', image: '/images/care-hydrating-moisturizer.svg' },
                    { index: 2, name: 'Sunscreen', image: '/images/care-ray-barrier-sunscreen.svg' },
                  ].map((tile) => (
                    <button
                      key={tile.index}
                      type="button"
                      onClick={() => switchProductStage(tile.index)}
                      className="group flex items-center gap-2.5 rounded-2xl border border-[#0D261B]/8 bg-white px-2.5 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0D261B]/15 hover:shadow-[0_12px_24px_rgba(13,38,27,0.05)] cursor-pointer"
                    >
                      <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#f7f5f1] border border-[#0D261B]/5 overflow-hidden">
                        <img
                          src={tile.image}
                          alt={tile.name}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                      <div className="text-left leading-none">
                        <div className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.18em] text-[#0D261B]/55">
                          0{tile.index + 1}
                        </div>
                        <div className="mt-1 text-[10px] sm:text-[11px] font-syne font-bold uppercase tracking-[0.12em] text-[#0D261B]">
                          {tile.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              EDITORIAL 2-COLUMN LUXURY SHOWCASE
              ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto pointer-events-none">
            
            {/* LEFT COLUMN: Editorial Typography & Clinical Details */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5 pointer-events-auto">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#C86D51] uppercase">
                  <span>CBS FORMULATION // {currentStage.stageNum}</span>
                </div>
                <h1
                  id={`product-title-${currentStage.stageNum}`}
                  className="font-syne text-2xl sm:text-4xl xl:text-5xl font-black text-[#0D261B] tracking-tight leading-[1.05] uppercase"
                >
                  {currentStage.name}
                </h1>
                <p className="font-syne font-bold text-xs sm:text-sm text-[#0D261B]/60 tracking-wider uppercase">
                  {currentStage.subName}
                </p>
              </div>

              {/* Tagline / Benefit Statement */}
              <p className="text-xs sm:text-sm md:text-base text-[#0D261B]/80 font-normal leading-relaxed">
                {currentStage.tagline}
              </p>

              {/* Clinical Specs */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
                {currentStage.specs.map((sp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3.5 rounded-xl bg-white/80 backdrop-blur-md border border-black/5 shadow-xs"
                  >
                    <span className="text-[9px] font-mono text-[#0D261B]/50 uppercase tracking-wider block">
                      {sp.label}
                    </span>
                    <p className="text-xs font-mono font-bold text-[#0D261B] mt-0.5 whitespace-nowrap">
                      {sp.value}
                    </p>
                    <span className="text-[9px] font-sans text-[#0D261B]/60 truncate block mt-0.5">
                      {sp.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dermatologist Proof Card */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/70 backdrop-blur-md border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-medium text-[#0D261B]/90">
                    {currentStage.headline}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (onSelectProduct && matchedProduct) {
                      onSelectProduct(matchedProduct);
                    }
                  }}
                  className="text-[11px] font-mono font-bold text-[#C86D51] hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                >
                  <span>DETAILS</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Studio Photography Showcase with Multi-Angle Thumbnail Switcher */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center pointer-events-auto">
              
              {/* Main Image Stage Box */}
              <div
                className="relative w-full max-w-[500px] aspect-4/3 sm:aspect-square bg-[#f9f5f1] rounded-[28px] p-6 sm:p-8 flex items-center justify-center border border-[#0D261B]/5 shadow-[0_10px_30px_rgba(13,38,27,0.04)] group transition-all duration-300 hover:shadow-[0_14px_36px_rgba(13,38,27,0.06)]"
                onClick={() => {
                  if (onSelectProduct && matchedProduct) {
                    onSelectProduct(matchedProduct);
                  }
                }}
              >
                {/* Active Photo Tag */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-black/5 backdrop-blur-md rounded-full text-[10px] font-mono font-bold text-[#0D261B]/80 uppercase">
                  <Camera className="w-3 h-3 text-[#C86D51]" />
                  <span>{activeImage.tag}</span>
                </div>

                {/* View Details Hint Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectProduct && matchedProduct) {
                      onSelectProduct(matchedProduct);
                    }
                  }}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-[#0D261B] rounded-full border border-black/5 shadow-xs transition cursor-pointer"
                  title="Expand Full Details"
                  aria-label="Expand Full Details"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#0D261B]/70" />
                </button>

                {/* Product Photo */}
                <img
                  key={`${currentStage.id}-${activeImage.url}`}
                  src={activeImage.url}
                  alt={`${currentStage.name} - ${activeImage.label}`}
                  className="max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_15px_30px_rgba(13,38,27,0.12)] transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Soft Ground Contact Shadow */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-6 bg-[#0D261B]/10 rounded-full blur-lg pointer-events-none" />
              </div>

              {/* Multi-Photo Thumbnail Bar */}
              <div className="w-full max-w-[500px] flex items-center gap-2 sm:gap-2.5 mt-3 sm:mt-4 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
                {currentStage.gallery.map((item, idx) => {
                  const isSelected = idx === activeImageIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white p-1.5 transition-all duration-200 cursor-pointer border ${
                        isSelected
                          ? 'border-[#C86D51] ring-2 ring-[#C86D51]/30 shadow-sm scale-105'
                          : 'border-black/10 hover:border-black/30 opacity-70 hover:opacity-100'
                      }`}
                      title={item.label}
                      aria-label={`View shot ${idx + 1}: ${item.label}`}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =======================================================================
              BOTTOM FLOATING ACTION BAR (CLEAN, MINIMAL, TERRACOTTA)
              ======================================================================= */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-black/5 pointer-events-auto">
            
            {/* Price block */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-syne font-black text-[#0D261B]">
                ₹{currentStage.price}
              </span>
              <span className="text-xs font-mono line-through text-[#0D261B]/40">
                ₹{currentStage.mrp}
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#0D261B]/8 text-[#0D261B] px-2.5 py-0.5 rounded-full">
                {currentStage.discountPct}
              </span>
              <span className="text-[11px] font-mono text-[#0D261B]/50 ml-1 hidden md:inline">
                FREE SHIPPING ACROSS INDIA
              </span>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id={`add-to-cart-stage-${currentStage.stageNum}`}
                onClick={handleAddToCart}
                className={`flex-1 sm:flex-initial px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-syne font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(200,109,81,0.22)] ${
                  addedStageIndex === activeStageIndex
                    ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                    : 'bg-[#C86D51] hover:bg-[#B55B3F] text-white'
                }`}
              >
                {addedStageIndex === activeStageIndex ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{currentStage.ctaText}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white hover:bg-[#0D261B] hover:text-white text-[#0D261B] border border-black/10 font-syne font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <span>Instant Buy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};
