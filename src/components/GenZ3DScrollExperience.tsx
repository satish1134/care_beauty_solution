import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import {
  Droplets,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  ShoppingBag,
  RotateCcw,
  Sliders,
  Flame,
  Layers,
  Check,
  ArrowRight,
  Eye,
  ShieldCheck,
  Compass,
  Maximize2,
  Activity,
  ChevronDown,
  MousePointer,
  Sparkle,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';

/* =========================================================================
   TYPES & FORMULATION CONFIGURATIONS (CYBER-GLOW ACID BEAUTY)
   ========================================================================= */

export interface FormulaConfig {
  id: string;
  slug: string;
  number: string;
  phaseLabel: string;
  name: string;
  tagline: string;
  accentColor: string;
  accentHex: number;
  secondaryHex: number;
  textColor: string;
  bgColor: string;
  shadowColor: string;
  buttonClass: string;
  sensoryTags: Array<{ tag: string; color: string; desc: string }>;
  stats: {
    viscosity: string;
    absorptionTime: string;
    barrierBoost: string;
    finish: string;
    ph: string;
  };
  glassColor: number;
  liquidColor: number;
  dropletColor: number;
  price: number;
  mrp: number;
}

const FORMULAS: FormulaConfig[] = [
  {
    id: 'prod-refreshing-skin-cleanser',
    slug: 'refreshing-skin-cleanser',
    number: '01',
    phaseLabel: 'PURIFY // DECONGEST',
    name: 'SOAP-FREE BARRIER GEL',
    tagline: 'Hydra-Surfactant Matrix that purges impurities without disrupting stratum corneum',
    accentColor: '#CCFF00',
    accentHex: 0xccff00,
    secondaryHex: 0x00f0ff,
    textColor: 'text-[#CCFF00]',
    bgColor: 'bg-[#CCFF00]',
    shadowColor: 'shadow-neon-lime',
    buttonClass: 'clay-button-lime',
    sensoryTags: [
      { tag: '#15sMeltdown', color: '#CCFF00', desc: 'Gel liquifies to cooling water upon skin warmth' },
      { tag: '#ZeroTightness', color: '#00F0FF', desc: 'No squeaky dryness or barrier stripping' },
      { tag: '#IceCooling', color: '#CCFF00', desc: 'Reduces surface skin temp by -2.4°C on contact' },
      { tag: '#pH5.5Balanced', color: '#FF51FA', desc: 'Locks natural acid mantle against acne bacteria' },
    ],
    stats: {
      viscosity: '380 cP (Crystal Gel)',
      absorptionTime: '15 Seconds',
      barrierBoost: '+94% Hydration Lock',
      finish: 'Satin Clean (Zero Residue)',
      ph: '5.5 Exact Match',
    },
    glassColor: 0x111625,
    liquidColor: 0xccff00,
    dropletColor: 0xd4ff33,
    price: 499,
    mrp: 699,
  },
  {
    id: 'prod-hydrating-moisturizer',
    slug: 'hydrating-moisturizer',
    number: '02',
    phaseLabel: 'RESTORE // INFUSE',
    name: '72H VELVET MOISTURE CUSHION',
    tagline: 'Triple Ceramide AP/NP/EOP lipid suspension with micro-hyaluronic moisture reservoir',
    accentColor: '#00D4FF',
    accentHex: 0x00d4ff,
    secondaryHex: 0xccff00,
    textColor: 'text-[#00D4FF]',
    bgColor: 'bg-[#00D4FF]',
    shadowColor: 'shadow-neon-cyan',
    buttonClass: 'clay-button-cyan',
    sensoryTags: [
      { tag: '#VelvetMatte', color: '#00D4FF', desc: 'Micro-powder finish with 0% greasy shine' },
      { tag: '#72HLock', color: '#CCFF00', desc: 'Sustained lipid hydration for 3 straight days' },
      { tag: '#GlassSkinGlow', color: '#00D4FF', desc: 'Natural luminous light reflection' },
      { tag: '#ZeroGrease', color: '#FF51FA', desc: 'Breathable shield suited for humid weather' },
    ],
    stats: {
      viscosity: '1250 cP (Whipped Cream)',
      absorptionTime: '20 Seconds',
      barrierBoost: '+99.2% Lipid Matrix',
      finish: 'Cloud Cashmere Matte',
      ph: '5.6 Bio-Match',
    },
    glassColor: 0x0c1e28,
    liquidColor: 0x00d4ff,
    dropletColor: 0x4de2ff,
    price: 599,
    mrp: 799,
  },
  {
    id: 'prod-ray-barrier-sunscreen',
    slug: 'ray-barrier-sunscreen',
    number: '03',
    phaseLabel: 'SHIELD // REFLECT',
    name: 'ZERO-CAST WATER BURST SPF 50+',
    tagline: 'PA++++ Photostable broad spectrum shield engineered specifically for rich Indian skin tones',
    accentColor: '#FF51FA',
    accentHex: 0xff51fa,
    secondaryHex: 0xccff00,
    textColor: 'text-[#FF51FA]',
    bgColor: 'bg-[#FF51FA]',
    shadowColor: 'shadow-neon-pink',
    buttonClass: 'clay-button-pink',
    sensoryTags: [
      { tag: '#ZeroWhiteCast', color: '#FF51FA', desc: '100% invisible on Fitzpatrick skin tones III-VI' },
      { tag: '#WaterBurst', color: '#00D4FF', desc: 'Micro-capsules burst into hydrating dew' },
      { tag: '#SweatResistant', color: '#CCFF00', desc: '80-minute gym & humidity resilience' },
      { tag: '#BlueLightGuard', color: '#FF51FA', desc: 'HEV screen radiation defense' },
    ],
    stats: {
      viscosity: '240 cP (Ultralight Fluid)',
      absorptionTime: '8 Seconds',
      barrierBoost: 'SPF 50+ / PA++++',
      finish: 'Invisible Velvet Dry-Touch',
      ph: '6.0 Neutral Shield',
    },
    glassColor: 0x220c24,
    liquidColor: 0xff51fa,
    dropletColor: 0xff7dfc,
    price: 649,
    mrp: 849,
  },
];

/* =========================================================================
   SYNTHESIZED ASMR AUDIO ENGINE (WEB AUDIO API)
   ========================================================================= */

class AsmrSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialized on first user gesture
  }

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

  public playDropletSplat(accent: number = 0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Primary liquid squish sine osc
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      
      const startFreq = 380 + accent * 80;
      const endFreq = 90;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.18);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playSensoryTagBurst() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      [520, 780, 1040, 1560].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.035);
        gain.gain.setValueAtTime(0.12, now + idx * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.035);
        osc.stop(now + idx * 0.035 + 0.28);
      });
    } catch {
      // safe fallback
    }
  }

  public playModeChange() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // safe fallback
    }
  }
}

const asmrAudio = new AsmrSynth();

/* =========================================================================
   REACT PROPS
   ========================================================================= */

interface GenZ3DScrollExperienceProps {
  products?: Product[];
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
}

export const GenZ3DScrollExperience: React.FC<GenZ3DScrollExperienceProps> = ({
  products = [],
  onAddToCart,
  onBuyNow,
  onSelectProduct,
}) => {
  // Container & Scroll Refs
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // Active State
  const [selectedFormulaIndex, setSelectedFormulaIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isInteractiveSquishing, setIsInteractiveSquishing] = useState<boolean>(false);
  const [squishMultiplier, setSquishMultiplier] = useState<number>(1.0);
  const [activeSensoryTag, setActiveSensoryTag] = useState<string | null>(null);
  const [isBagAdded, setIsBagAdded] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentFormula = FORMULAS[selectedFormulaIndex];

  // Matched App Product Object
  const matchedProduct = useMemo(() => {
    return products.find(p => p.id === currentFormula.id || p.slug === currentFormula.slug) || ({
      id: currentFormula.id,
      slug: currentFormula.slug,
      name: currentFormula.name,
      tagline: currentFormula.tagline,
      categoryName: 'Dermatological Barrier Care',
      categoryId: 'cat-barrier',
      skinConcerns: ['Barrier Repair', 'Sensitive Skin'],
      skinTypes: ['All Skin Types', 'Sensitive'],
      keyIngredients: ['3x Ceramides', 'Niacinamide'],
      fullIngredients: 'Aqua, Glycerin, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Carbomer, Phenoxyethanol.',
      howToUse: 'Apply gently in circular motions on damp face. Rinse with lukewarm water.',
      clinicalClaims: ['94% Barrier Hydration Lock', 'pH 5.5 Mantle Match'],
      faqs: [],
      price: currentFormula.price,
      variants: [
        {
          id: `${currentFormula.id}-v1`,
          size: '100ml Standard',
          price: currentFormula.price,
          mrp: currentFormula.mrp,
          stock: 45,
        },
      ],
      description: currentFormula.tagline,
      images: ['/images/care-cleanser-1-hero-marble.svg'],
      rating: 4.9,
      reviewCount: 428,
    } as unknown as Product);
  }, [products, currentFormula]);

  /* =========================================================================
     THREE.JS 3D SCENE ORCHESTRATION ENGINE (BOTTLE + FLUID SPLAT + MACRO MESH)
     ========================================================================= */

  const threeEngineRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    bottleGroup: THREE.Group;
    dropletGroup: THREE.Group;
    macroMeshGroup: THREE.Group;
    particlesMesh: THREE.Points;
    dropletMesh: THREE.Mesh;
    dropletGeometry: THREE.SphereGeometry;
    dropletBasePositions: Float32Array;
    splatRippleRing: THREE.Mesh;
    materials: {
      bottleBody: THREE.MeshPhysicalMaterial;
      liquidCore: THREE.MeshPhysicalMaterial;
      dropperCap: THREE.MeshStandardMaterial;
      dropperPipette: THREE.MeshPhysicalMaterial;
      droplet: THREE.MeshPhysicalMaterial;
      macroTexture: THREE.MeshPhysicalMaterial;
      particles: THREE.PointsMaterial;
      ripple: THREE.MeshBasicMaterial;
    };
    lights: {
      ambient: THREE.AmbientLight;
      pointLime: THREE.PointLight;
      pointCyan: THREE.PointLight;
      pointPink: THREE.PointLight;
      directional: THREE.DirectionalLight;
    };
    clock: THREE.Clock;
    animFrameId?: number;
    currentProgressLerped: number;
    targetProgress: number;
  } | null>(null);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.replaceChildren(renderer.domElement);

    // 3. Neon Cyber Lighting Rig
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 2.2);
    directional.position.set(5, 8, 6);
    scene.add(directional);

    const pointLime = new THREE.PointLight(currentFormula.accentHex, 5.0, 25);
    pointLime.position.set(-4, 3, 4);
    scene.add(pointLime);

    const pointCyan = new THREE.PointLight(currentFormula.secondaryHex, 4.2, 25);
    pointCyan.position.set(4, -2, 3);
    scene.add(pointCyan);

    const pointPink = new THREE.PointLight(0xff007f, 3.0, 20);
    pointPink.position.set(0, 5, -3);
    scene.add(pointPink);

    // 4. MAIN BOTTLE GROUP (Phase 1: Zero-G 360° Inspection)
    const bottleGroup = new THREE.Group();
    scene.add(bottleGroup);

    // Frosted Glass Bottle Body Cylinder
    const bottleBodyGeo = new THREE.CylinderGeometry(0.9, 0.95, 2.9, 64, 16);
    const bottleBodyMat = new THREE.MeshPhysicalMaterial({
      color: currentFormula.glassColor,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.8,
      ior: 1.52,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const bottleBodyMesh = new THREE.Mesh(bottleBodyGeo, bottleBodyMat);
    bottleGroup.add(bottleBodyMesh);

    // Glowing Liquid Column Inside Bottle
    const liquidCoreGeo = new THREE.CylinderGeometry(0.78, 0.82, 2.5, 48);
    const liquidCoreMat = new THREE.MeshPhysicalMaterial({
      color: currentFormula.liquidColor,
      emissive: currentFormula.liquidColor,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.65,
    });
    const liquidCoreMesh = new THREE.Mesh(liquidCoreGeo, liquidCoreMat);
    liquidCoreMesh.position.y = -0.15;
    bottleGroup.add(liquidCoreMesh);

    // Bottle Gold / Chrome Collar
    const collarGeo = new THREE.CylinderGeometry(0.55, 0.7, 0.45, 48);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15,
    });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.position.y = 1.65;
    bottleGroup.add(collarMesh);

    // Glass Dropper Pipette Stem
    const pipetteGeo = new THREE.CylinderGeometry(0.12, 0.06, 2.1, 32);
    const pipetteMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      transmission: 0.95,
      ior: 1.5,
      roughness: 0.05,
    });
    const pipetteMesh = new THREE.Mesh(pipetteGeo, pipetteMat);
    pipetteMesh.position.y = 1.2;
    bottleGroup.add(pipetteMesh);

    // Rubber Bulb Cap on Top
    const bulbGeo = new THREE.SphereGeometry(0.48, 32, 32);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      roughness: 0.6,
      metalness: 0.2,
    });
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    bulbMesh.position.y = 2.1;
    bulbMesh.scale.set(0.9, 1.2, 0.9);
    bottleGroup.add(bulbMesh);

    // 5. VOLUMETRIC DROPLET GROUP (Phase 2: Droplet Squeeze & Splat)
    const dropletGroup = new THREE.Group();
    scene.add(dropletGroup);

    // Deformable High-Poly Sphere Geometry for fluid simulation
    const dropletGeometry = new THREE.SphereGeometry(0.85, 64, 64);
    const dropletBasePositions = new Float32Array(dropletGeometry.attributes.position.array);

    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: currentFormula.dropletColor,
      emissive: currentFormula.accentHex,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.92,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.75,
      ior: 1.48,
      clearcoat: 1.0,
    });
    const dropletMesh = new THREE.Mesh(dropletGeometry, dropletMat);
    dropletGroup.add(dropletMesh);

    // Fluid Impact Ripple Ring
    const rippleGeo = new THREE.RingGeometry(0.8, 1.8, 48);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: currentFormula.accentHex,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    });
    const splatRippleRing = new THREE.Mesh(rippleGeo, rippleMat);
    splatRippleRing.rotation.x = -Math.PI / 2;
    splatRippleRing.position.y = -1.2;
    dropletGroup.add(splatRippleRing);

    // 6. MACRO TEXTURE MESH GROUP (Phase 3: Micro Cellular Texture Matrix)
    const macroMeshGroup = new THREE.Group();
    scene.add(macroMeshGroup);

    const macroTorusGeo = new THREE.TorusKnotGeometry(1.4, 0.38, 128, 32, 2, 3);
    const macroTextureMat = new THREE.MeshPhysicalMaterial({
      color: currentFormula.accentHex,
      emissive: currentFormula.secondaryHex,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.4,
      transmission: 0.5,
      ior: 1.6,
      wireframe: false,
    });
    const macroMesh = new THREE.Mesh(macroTorusGeo, macroTextureMat);
    macroMeshGroup.add(macroMesh);
    macroMeshGroup.position.set(0, 0, -2);
    macroMeshGroup.scale.set(0.001, 0.001, 0.001); // starts invisible until phase 3

    // 7. AMBIENT PARTICLES (Floating Bio-Active Ions)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: currentFormula.accentHex,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
    });
    const particlesMesh = new THREE.Points(particleGeo, particlesMat);
    scene.add(particlesMesh);

    // Store engine reference
    threeEngineRef.current = {
      scene,
      camera,
      renderer,
      bottleGroup,
      dropletGroup,
      macroMeshGroup,
      particlesMesh,
      dropletMesh,
      dropletGeometry,
      dropletBasePositions,
      splatRippleRing,
      materials: {
        bottleBody: bottleBodyMat,
        liquidCore: liquidCoreMat,
        dropperCap: collarMat,
        dropperPipette: pipetteMat,
        droplet: dropletMat,
        macroTexture: macroTextureMat,
        particles: particlesMat,
        ripple: rippleMat,
      },
      lights: {
        ambient,
        pointLime,
        pointCyan,
        pointPink,
        directional,
      },
      clock: new THREE.Clock(),
      currentProgressLerped: 0,
      targetProgress: 0,
    };

    // Resize Handler
    const handleResize = () => {
      if (!container || !threeEngineRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Continuous Animation Loop (Scroll Timeline + Vertex Morphing Shaders)
    const animate = () => {
      const engine = threeEngineRef.current;
      if (!engine) return;

      const time = engine.clock.getElapsedTime();

      // Smooth Lerp of Scroll Progress
      engine.currentProgressLerped += (engine.targetProgress - engine.currentProgressLerped) * 0.08;
      const progress = engine.currentProgressLerped; // 0.0 -> 1.0

      // Ambient particle floating drift
      engine.particlesMesh.rotation.y = time * 0.05;
      engine.particlesMesh.rotation.x = time * 0.02;

      // Mouse Parallax Influence
      const targetMouseX = mousePos.x * 0.5;
      const targetMouseY = mousePos.y * 0.3;

      // =========================================================================
      // SCROLL TIMELINE PHASES 1, 2, 3 ORCHESTRATION
      // =========================================================================

      if (progress < 0.33) {
        // -----------------------------------------------------------------------
        // PHASE 1: ZERO-G 360° BOTTLE ROTATION (Progress 0.00 -> 0.33)
        // -----------------------------------------------------------------------
        const p1 = progress / 0.33; // 0 -> 1

        // Bottle is prominent, centered, and dynamically floating
        engine.bottleGroup.visible = true;
        engine.bottleGroup.scale.set(1.1, 1.1, 1.1);
        engine.bottleGroup.position.set(targetMouseX * 0.4, Math.sin(time * 1.8) * 0.15 - p1 * 0.5, 0);
        engine.bottleGroup.rotation.y = time * 0.8 + p1 * Math.PI * 2;
        engine.bottleGroup.rotation.x = Math.sin(time * 1.2) * 0.1 + targetMouseY * 0.3;
        engine.bottleGroup.rotation.z = Math.cos(time * 1.5) * 0.08;

        // Droplet starts small near dropper tip
        engine.dropletGroup.visible = true;
        engine.dropletGroup.position.set(0, 1.2 - p1 * 2.2, 0);
        const dropScale = Math.min(1.0, p1 * 1.2);
        engine.dropletGroup.scale.set(dropScale * 0.4, dropScale * 0.6, dropScale * 0.4);
        engine.splatRippleRing.material.opacity = 0.0;

        // Macro mesh hidden
        engine.macroMeshGroup.visible = false;
        engine.macroMeshGroup.scale.set(0.001, 0.001, 0.001);

        // Camera position
        engine.camera.position.set(0, 0, 7.5 - p1 * 0.5);
      } else if (progress >= 0.33 && progress < 0.66) {
        // -----------------------------------------------------------------------
        // PHASE 2: VOLUMETRIC SQUEEZE & FLUID SPLAT (Progress 0.33 -> 0.66)
        // -----------------------------------------------------------------------
        const p2 = (progress - 0.33) / 0.33; // 0 -> 1

        // Bottle slides to top-left and tilts
        engine.bottleGroup.visible = true;
        engine.bottleGroup.position.set(-2.2 - p2 * 1.0, 1.6 + p2 * 0.5, -1 - p2 * 0.5);
        engine.bottleGroup.rotation.set(0.4, 0.6, -0.7 - p2 * 0.2);
        const bottleScale = Math.max(0.4, 1.0 - p2 * 0.5);
        engine.bottleGroup.scale.set(bottleScale, bottleScale, bottleScale);

        // Droplet morphs, squishes, and splats dynamically
        engine.dropletGroup.visible = true;
        engine.dropletGroup.position.set(targetMouseX * 0.3, -0.2 - p2 * 0.6, 0.5);

        // Deform droplet geometry vertices using procedural fluid turbulence
        const positions = engine.dropletGeometry.attributes.position;
        const base = engine.dropletBasePositions;
        const splatFactor = p2 * 2.2; // intense flattening
        const squishAmp = isInteractiveSquishing ? 0.35 * squishMultiplier : 0.12;

        for (let i = 0; i < positions.count; i++) {
          const u = i * 3;
          const bx = base[u];
          const by = base[u + 1];
          const bz = base[u + 2];

          // Fluid noise wobble
          const wave = Math.sin(bx * 4.0 + time * 3.5) * Math.cos(bz * 4.0 + time * 3.5) * squishAmp;
          const flattenY = 1.0 - splatFactor * 0.45;
          const spreadXZ = 1.0 + splatFactor * 0.65;

          positions.setXYZ(i, bx * spreadXZ * (1 + wave), by * flattenY * (1 + wave * 0.8), bz * spreadXZ * (1 + wave));
        }
        positions.needsUpdate = true;
        engine.dropletGeometry.computeVertexNormals();

        // Ripple pulse
        engine.splatRippleRing.material.opacity = Math.sin(time * 4) * 0.4 + 0.3;
        engine.splatRippleRing.scale.set(1 + p2 * 1.5, 1 + p2 * 1.5, 1);

        // Macro mesh begins subtle scaling
        engine.macroMeshGroup.visible = false;
        engine.camera.position.set(0, 0, 7.0 - p2 * 1.5);
      } else {
        // -----------------------------------------------------------------------
        // PHASE 3: DEEP MACRO ZOOM & SENSORY CHIP ORBIT (Progress 0.66 -> 1.00)
        // -----------------------------------------------------------------------
        const p3 = (progress - 0.66) / 0.34; // 0 -> 1

        // Bottle hidden
        engine.bottleGroup.visible = false;

        // Droplet dissolves into micro cellular texture
        engine.dropletGroup.visible = true;
        const dropScale = Math.max(0.1, 1.0 - p3 * 0.8);
        engine.dropletGroup.scale.set(dropScale, dropScale, dropScale);

        // Macro Texture Mesh blooms into full screen
        engine.macroMeshGroup.visible = true;
        const macroScale = 0.6 + p3 * 0.7;
        engine.macroMeshGroup.scale.set(macroScale, macroScale, macroScale);
        engine.macroMeshGroup.rotation.x = time * 0.3 + targetMouseY * 0.5;
        engine.macroMeshGroup.rotation.y = time * 0.4 + targetMouseX * 0.5;
        engine.macroMeshGroup.rotation.z = Math.sin(time * 0.5) * 0.2;

        // Close macro camera dive
        engine.camera.position.set(0, 0, 5.5 - p3 * 1.8);
      }

      // Render Scene
      engine.renderer.render(engine.scene, engine.camera);
      engine.animFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeEngineRef.current?.animFrameId) {
        cancelAnimationFrame(threeEngineRef.current.animFrameId);
      }
      renderer.dispose();
    };
  }, [mousePos, isInteractiveSquishing, squishMultiplier, currentFormula]);

  // Update formula materials & colors in Three.js in real time
  useEffect(() => {
    const engine = threeEngineRef.current;
    if (!engine) return;

    engine.materials.bottleBody.color.setHex(currentFormula.glassColor);
    engine.materials.liquidCore.color.setHex(currentFormula.liquidColor);
    engine.materials.liquidCore.emissive.setHex(currentFormula.liquidColor);
    engine.materials.droplet.color.setHex(currentFormula.dropletColor);
    engine.materials.droplet.emissive.setHex(currentFormula.accentHex);
    engine.materials.macroTexture.color.setHex(currentFormula.accentHex);
    engine.materials.macroTexture.emissive.setHex(currentFormula.secondaryHex);
    engine.materials.particles.color.setHex(currentFormula.accentHex);
    engine.materials.ripple.color.setHex(currentFormula.accentHex);

    engine.lights.pointLime.color.setHex(currentFormula.accentHex);
    engine.lights.pointCyan.color.setHex(currentFormula.secondaryHex);
  }, [currentFormula]);

  // Track Native Window / Container Scroll
  const handleScroll = useCallback(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const totalHeight = track.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;

    // Calculate normalized progress 0 -> 1
    const currentScrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScrolled / totalHeight));

    setScrollProgress(progress);

    if (threeEngineRef.current) {
      threeEngineRef.current.targetProgress = progress;
    }

    // Determine active phase
    if (progress < 0.33) {
      setActivePhase(1);
    } else if (progress < 0.66) {
      setActivePhase(2);
    } else {
      setActivePhase(3);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Mouse Move Parallax Tracker
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const normX = (clientX / window.innerWidth - 0.5) * 2;
    const normY = (clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x: normX, y: normY });
  };

  // Jump directly to specific phase
  const jumpToPhase = (phaseNum: 1 | 2 | 3) => {
    const track = scrollTrackRef.current;
    if (!track) return;

    const totalHeight = track.scrollHeight - window.innerHeight;
    const targetProg = phaseNum === 1 ? 0.05 : phaseNum === 2 ? 0.48 : 0.88;
    const targetScrollY = track.offsetTop + targetProg * totalHeight;

    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    asmrAudio.playModeChange();
  };

  // Formula Switcher Handler
  const handleSelectFormula = (index: number) => {
    setSelectedFormulaIndex(index);
    asmrAudio.playModeChange();
  };

  // Droplet Squish Interaction Trigger
  const triggerInteractiveSquish = () => {
    setIsInteractiveSquishing(true);
    setSquishMultiplier(prev => (prev === 1.0 ? 2.5 : 1.0));
    asmrAudio.playDropletSplat(selectedFormulaIndex);
    setTimeout(() => setIsInteractiveSquishing(false), 350);
  };

  // Add to Bag Action
  const handleAddCurrentToCart = () => {
    if (onAddToCart && matchedProduct) {
      const variant = matchedProduct.variants[0];
      onAddToCart(matchedProduct, variant, 1);
      setIsBagAdded(true);
      asmrAudio.playSensoryTagBurst();
      setTimeout(() => setIsBagAdded(false), 2000);
    }
  };

  const handleInstantBuyNow = () => {
    if (onBuyNow && matchedProduct) {
      const variant = matchedProduct.variants[0];
      onBuyNow(matchedProduct, variant, 1);
      asmrAudio.playSensoryTagBurst();
    }
  };

  return (
    <div
      ref={scrollTrackRef}
      onMouseMove={handleMouseMove}
      className="relative bg-[#080808] text-white min-h-[380vh] select-none font-sans overflow-clip"
    >
      {/* =========================================================================
          AMBIENT LIQUID GLOW NEON BLOBS
          ========================================================================= */}
      <div
        className="fixed top-20 left-10 w-[450px] h-[450px] rounded-full blur-[160px] opacity-25 pointer-events-none transition-colors duration-700 animate-blob-1"
        style={{ backgroundColor: currentFormula.accentColor }}
      />
      <div
        className="fixed bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-[180px] opacity-20 pointer-events-none transition-colors duration-700 animate-blob-2"
        style={{ backgroundColor: activePhase === 3 ? '#FF51FA' : '#00D4FF' }}
      />

      {/* =========================================================================
          STICKY PINNED 3D WEBGL VIEWPORT (Simulates R3F / Three.js Canvas)
          ========================================================================= */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-4 sm:p-8 z-20 pointer-events-none">
        
        {/* 3D WebGL Canvas Layer */}
        <div
          ref={canvasMountRef}
          className="absolute inset-0 z-0 pointer-events-auto cursor-grab active:cursor-grabbing"
          onClick={activePhase === 2 ? triggerInteractiveSquish : undefined}
          title="Click to interact with 3D fluid mesh"
        />

        {/* -----------------------------------------------------------------------
            TOP HUD BAR: Phase Indicators, Formula Switchers, ASMR Audio Toggle
            ----------------------------------------------------------------------- */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
          
          {/* Phase Breadcrumbs / Jumpers */}
          <div className="flex items-center gap-1.5 p-1 bg-[#121624]/90 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl">
            {[
              { num: 1 as const, label: '01. ZERO-G FLOAT', color: '#CCFF00' },
              { num: 2 as const, label: '02. VOLUMETRIC SQUISH', color: '#00D4FF' },
              { num: 3 as const, label: '03. SENSORY CLIMAX', color: '#FF51FA' },
            ].map(phase => (
              <button
                key={phase.num}
                onClick={() => jumpToPhase(phase.num)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-orbitron font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  activePhase === phase.num
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: phase.color }}
                />
                <span>{phase.label}</span>
              </button>
            ))}
          </div>

          {/* Active Formula Selector Tabs */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-[#121624]/90 backdrop-blur-xl rounded-2xl border border-white/15">
            {FORMULAS.map((f, idx) => (
              <button
                key={f.id}
                onClick={() => handleSelectFormula(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-syne font-black uppercase tracking-wider transition-all cursor-pointer ${
                  selectedFormulaIndex === idx
                    ? `${f.bgColor} text-black ${f.shadowColor} scale-105`
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {f.number} // {f.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* ASMR Sound Toggle & Live Scroll Tracker */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextMuted = !isAudioMuted;
                setIsAudioMuted(nextMuted);
                asmrAudio.setMuted(nextMuted);
                if (!nextMuted) asmrAudio.playModeChange();
              }}
              className="p-2.5 bg-[#121624]/90 hover:bg-[#1a2035] backdrop-blur-xl rounded-2xl border border-white/15 text-slate-200 hover:text-[#CCFF00] transition-colors cursor-pointer shadow-lg"
              title={isAudioMuted ? 'Unmute ASMR Sound FX' : 'Mute ASMR Sound FX'}
              aria-label="Toggle ASMR Audio"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#CCFF00]" />}
            </button>

            {/* Scroll Progress Meter */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#121624]/90 backdrop-blur-xl rounded-2xl border border-white/15 text-[11px] font-mono font-bold text-slate-300">
              <Compass className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>{Math.round(scrollProgress * 100)}% SCROLL</span>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            CENTER-LEFT / CENTER-RIGHT DYNAMIC OVERLAYS BASED ON SCROLL PHASE
            ----------------------------------------------------------------------- */}
        <div className="relative z-30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto pointer-events-none">
          
          {/* Left Column: Massive 80px+ Syne Typography & Phase Narratives */}
          <div className="lg:col-span-6 space-y-4 pointer-events-auto">
            
            {/* Phase 1 Narrative */}
            {activePhase === 1 && (
              <div className="space-y-3 animate-fadeIn">
                <span className="sticker-tag bg-[#CCFF00] text-black text-xs px-3.5 py-1 -rotate-2">
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>PHASE 01 // 360° ZERO-G EXTRACTION</span>
                </span>

                <h1
                  id="hero-3d-scroll-title"
                  className="font-syne text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tighter uppercase leading-[0.98] text-white"
                >
                  CLINICAL <span className="text-gradient-acid">ACTIVE</span> LAB
                </h1>

                <p className="text-sm sm:text-base font-syne font-bold text-slate-300 max-w-lg leading-relaxed">
                  {currentFormula.tagline}
                </p>

                {/* Live Diagnostic Specs Bento Widget */}
                <div className="grid grid-cols-3 gap-2 pt-2 max-w-md">
                  <div className="p-3 rounded-2xl bg-[#121624]/80 backdrop-blur-md border border-white/10">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">VISCOSITY</span>
                    <p className="text-xs font-mono font-bold text-[#CCFF00] mt-0.5">{currentFormula.stats.viscosity}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#121624]/80 backdrop-blur-md border border-white/10">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">ABSORPTION</span>
                    <p className="text-xs font-mono font-bold text-[#00D4FF] mt-0.5">{currentFormula.stats.absorptionTime}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#121624]/80 backdrop-blur-md border border-white/10">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">BARRIER LOCK</span>
                    <p className="text-xs font-mono font-bold text-[#FF51FA] mt-0.5">{currentFormula.stats.barrierBoost}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-2">
                  <MousePointer className="w-3.5 h-3.5 text-[#CCFF00] animate-bounce" />
                  <span>Scroll down to trigger Phase 02 Volumetric Fluid Squish</span>
                </div>
              </div>
            )}

            {/* Phase 2 Narrative */}
            {activePhase === 2 && (
              <div className="space-y-3 animate-fadeIn">
                <span className="sticker-tag bg-[#00D4FF] text-black text-xs px-3.5 py-1 rotate-1">
                  <Droplets className="w-3.5 h-3.5 fill-black" />
                  <span>PHASE 02 // VOLUMETRIC SQUISH &amp; SPLAT</span>
                </span>

                <h1 className="font-syne text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tighter uppercase leading-[0.98] text-white">
                  ACTIVE <span className="text-gradient-cyber-glow">FLUID</span> MORPH
                </h1>

                <p className="text-sm sm:text-base font-syne font-bold text-slate-300 max-w-lg leading-relaxed">
                  Click or drag directly on the 3D droplet canvas to test real-time fluid viscosity and elastic memory response.
                </p>

                {/* Tactile Squeeze Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={triggerInteractiveSquish}
                    className="px-4 py-2 rounded-2xl bg-[#00D4FF] text-black font-syne font-black text-xs uppercase tracking-wider shadow-neon-cyan active:scale-95 transition cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Splat Droplet (Sound ASMR)</span>
                  </button>

                  <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                    Contact Angle: 32° (Immediate Wetting)
                  </span>
                </div>
              </div>
            )}

            {/* Phase 3 Narrative */}
            {activePhase === 3 && (
              <div className="space-y-3 animate-fadeIn">
                <span className="sticker-tag bg-[#FF51FA] text-white text-xs px-3.5 py-1 -rotate-1">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>PHASE 03 // SENSORY CLIMAX &amp; MATRIX ZOOM</span>
                </span>

                <h1 className="font-syne text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tighter uppercase leading-[0.98] text-white">
                  NEURAL <span className="text-gradient-kinetic-pink">SENSORY</span> BURST
                </h1>

                <p className="text-sm sm:text-base font-syne font-bold text-slate-300 max-w-lg leading-relaxed">
                  Deep macro view into the triple-ceramide molecular mesh. Tap any sensory tag to discover dermatological clinical outcomes.
                </p>

                {/* Direct Purchase Actions Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={handleAddCurrentToCart}
                    className={`px-5 py-3 rounded-2xl font-syne font-black text-xs uppercase tracking-wider transition-all transform active:scale-95 cursor-pointer flex items-center gap-2 shadow-2xl ${
                      isBagAdded ? 'bg-emerald-400 text-black' : `${currentFormula.bgColor} text-black ${currentFormula.shadowColor}`
                    }`}
                  >
                    {isBagAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    <span>{isBagAdded ? 'Added to Bag!' : `Add to Bag • ₹${currentFormula.price}`}</span>
                  </button>

                  <button
                    onClick={handleInstantBuyNow}
                    className="px-5 py-3 rounded-2xl bg-[#141828] hover:bg-[#1a2035] text-white border border-white/20 font-syne font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2"
                  >
                    <span>Instant Express Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#CCFF00]" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Floating 3D Sensory Tags Explosion Orbit (Phase 3) */}
          <div className="lg:col-span-6 flex flex-col items-end pointer-events-auto">
            {activePhase === 3 ? (
              <div className="w-full max-w-md space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-orbitron text-slate-400">
                  <span className="text-[#FF51FA] font-bold">ORBITING SENSORY ATTRIBUTES</span>
                  <span>TAP FOR PROOF</span>
                </div>

                {/* 4 Orbiting Exploding Sensory Chips */}
                <div className="space-y-2">
                  {currentFormula.sensoryTags.map((item, idx) => (
                    <div
                      key={item.tag}
                      onClick={() => {
                        setActiveSensoryTag(activeSensoryTag === item.tag ? null : item.tag);
                        asmrAudio.playSensoryTagBurst();
                      }}
                      className={`p-3.5 rounded-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer transform hover:-translate-x-1 ${
                        activeSensoryTag === item.tag
                          ? 'bg-[#181d30] border-[#FF51FA] shadow-neon-pink scale-102'
                          : 'bg-[#121624]/80 border-white/10 hover:border-white/30'
                      }`}
                      style={{
                        animationDelay: `${idx * 120}ms`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="font-syne font-black text-sm tracking-wide"
                          style={{ color: item.color }}
                        >
                          {item.tag}
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <p className="text-xs font-mono text-slate-300 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Phase 1 & 2 Asymmetric Bento HUD Cards */
              <div className="hidden lg:block w-full max-w-sm space-y-3">
                <div className="clay-card p-4 space-y-2 border border-white/15">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>BIO-LAB CALIBRATION</span>
                    <span className="text-emerald-400 font-bold">ACTIVE LOCK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-syne font-black text-white">
                      ₹{currentFormula.price}
                    </span>
                    <span className="text-xs font-mono line-through text-slate-500">
                      ₹{currentFormula.mrp}
                    </span>
                    <span className="text-[10px] font-black bg-[#CCFF00] text-black px-2 py-0.5 rounded-md">
                      SAVE 28%
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 leading-snug">
                    Dermatologist formulated for Indian climate: high heat, pollution &amp; humidity resistance.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            BOTTOM FLOATING NAVIGATOR BAR
            ----------------------------------------------------------------------- */}
        <div className="relative z-30 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono pointer-events-auto">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>0% Artificial Fragrance</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span>Dermatologically Certified</span>
            </span>
          </div>

          <button
            onClick={() => {
              if (onSelectProduct && matchedProduct) {
                onSelectProduct(matchedProduct);
              }
            }}
            className="text-white hover:text-[#CCFF00] font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>View Full Formulation Chemistry</span>
            <Eye className="w-3.5 h-3.5 text-[#CCFF00]" />
          </button>
        </div>
      </div>

      {/* Invisible spacer elements that determine overall scroll height */}
      <div className="h-screen" />
      <div className="h-screen" />
      <div className="h-screen" />
    </div>
  );
};
