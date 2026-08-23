import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import {
  Droplets,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Eye,
  ShoppingBag,
  RotateCcw,
  Sliders,
  Flame,
  Layers,
  Check,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface AsmrTextureLabProps {
  products?: Product[];
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
}

export const AsmrTextureLab: React.FC<AsmrTextureLabProps> = ({
  products = [],
  onAddToCart,
  onSelectProduct,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedFormulaIndex, setSelectedFormulaIndex] = useState<number>(0);
  const [isAsmrMuted, setIsAsmrMuted] = useState<boolean>(false);
  const [viscosityMode, setViscosityMode] = useState<'GEL_WATER' | 'VELVET_CREAM' | 'SILK_SERUM'>('GEL_WATER');
  const [isSquishing, setIsSquishing] = useState<boolean>(false);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  // 4 Sensorial Formulations (Stripped of academic textbook jargon, purely sensory ASMR)
  const formulas = [
    {
      id: 'prod-refreshing-skin-cleanser',
      slug: 'refreshing-skin-cleanser',
      number: '01',
      title: 'SOAP-FREE BARRIER GEL',
      subTitle: 'Pure Crystal Water Gel Matrix',
      accentColor: '#CCFF00',
      accentHex: 0xccff00,
      textColor: 'text-[#CCFF00]',
      bgColor: 'bg-[#CCFF00]',
      shadowColor: 'shadow-neon-lime',
      buttonClass: 'clay-button-lime',
      sensoryTags: ['#15sMeltdown', '#ZeroTightness', '#IceCooling', '#pH5.5Balanced'],
      sensoryFeel: 'Transforms from ultra-slick crystal gel to featherlight water upon contact. Purges sebum with zero squeak.',
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.85,
      ior: 1.45,
      color: 0xccff00,
      emissive: 0x224400,
      viscosity: 'GEL_WATER' as const,
      price: 499,
    },
    {
      id: 'prod-hydrating-moisturizer',
      slug: 'hydrating-moisturizer',
      number: '02',
      title: '72H MOISTURE LOCK VELVET',
      subTitle: 'Whipped Lipid Moisture Cushion',
      accentColor: '#00D4FF',
      accentHex: 0x00d4ff,
      textColor: 'text-[#00D4FF]',
      bgColor: 'bg-[#00D4FF]',
      shadowColor: 'shadow-neon-cyan',
      buttonClass: 'clay-button-cyan',
      sensoryTags: ['#VelvetMatte', '#ZeroGrease', '#GlassSkinGlow', '#72HLock'],
      sensoryFeel: 'Rich cashmere cream texture that instantly melts into a non-greasy dewy cushion with zero tackiness.',
      roughness: 0.25,
      metalness: 0.05,
      transmission: 0.35,
      ior: 1.35,
      color: 0x00d4ff,
      emissive: 0x003344,
      viscosity: 'VELVET_CREAM' as const,
      price: 599,
    },
    {
      id: 'prod-ray-barrier-sunscreen',
      slug: 'ray-barrier-sunscreen',
      number: '03',
      title: 'ZERO-CAST WATER BURST SPF 50+',
      subTitle: 'Invisible Fluid Shield',
      accentColor: '#FF51FA',
      accentHex: 0xff51fa,
      textColor: 'text-[#FF51FA]',
      bgColor: 'bg-[#FF51FA]',
      shadowColor: 'shadow-neon-pink',
      buttonClass: 'clay-button-pink',
      sensoryTags: ['#ZeroWhiteCast', '#WaterBurst', '#SweatResistant', '#MatteFinish'],
      sensoryFeel: 'Micro-encapsulated fluid explodes into cooling water droplets upon spreading. Zero ghost white cast.',
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.75,
      ior: 1.4,
      color: 0xff51fa,
      emissive: 0x440044,
      viscosity: 'GEL_WATER' as const,
      price: 649,
    },
    {
      id: 'prod-refreshing-skin-cleanser',
      slug: 'refreshing-skin-cleanser',
      number: '04',
      title: 'LIQUID GLOW NIACINAMIDE DROP',
      subTitle: 'High-Gloss Active Nectar',
      accentColor: '#FFE600',
      accentHex: 0xffe600,
      textColor: 'text-[#FFE600]',
      bgColor: 'bg-[#FFE600]',
      shadowColor: 'shadow-neon-gold',
      buttonClass: 'clay-button-lime',
      sensoryTags: ['#HighGlossDew', '#InstantClarity', '#PoreVanish', '#SilkySlip'],
      sensoryFeel: 'Silken nectar serum with ultra-high slip. Absorbs in under 10 seconds leaving an ethereal glass finish.',
      roughness: 0.08,
      metalness: 0.2,
      transmission: 0.9,
      ior: 1.5,
      color: 0xffe600,
      emissive: 0x333300,
      viscosity: 'SILK_SERUM' as const,
      price: 499,
    },
  ];

  const currentFormula = formulas[selectedFormulaIndex];
  const activeProductObj = products.find(p => p.id === currentFormula.id || p.slug === currentFormula.slug) || products[0];

  // 3D Three.js Liquid Serum / Cream Blob Engine
  const engineRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    blobMesh: THREE.Mesh;
    baseGeometry: THREE.IcosahedronGeometry;
    material: THREE.MeshPhysicalMaterial;
    pointLight1: THREE.PointLight;
    pointLight2: THREE.PointLight;
    mouse: THREE.Vector2;
    targetDistortion: number;
    currentDistortion: number;
    clock: THREE.Clock;
    animId?: number;
  } | null>(null);

  // Initialize WebGL ASMR 3D Liquid Canvas
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    // 2. WebGL Renderer with High-Performance Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;

    container.replaceChildren(renderer.domElement);

    // 3. Studio Ambient & Specular Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3.0);
    dirLight.position.set(4, 6, 4);
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight(currentFormula.accentHex, 5.0, 15);
    pointLight1.position.set(-3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00d4ff, 3.5, 15);
    pointLight2.position.set(3, -3, 2);
    scene.add(pointLight2);

    // 4. Volumetric Organic Blob Geometry
    const baseGeometry = new THREE.IcosahedronGeometry(1.4, 48);
    const material = new THREE.MeshPhysicalMaterial({
      color: currentFormula.color,
      emissive: currentFormula.emissive,
      emissiveIntensity: 0.6,
      roughness: currentFormula.roughness,
      metalness: currentFormula.metalness,
      transmission: currentFormula.transmission,
      ior: currentFormula.ior,
      thickness: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      specularIntensity: 1.0,
      transparent: true,
      opacity: 0.92,
    });

    const blobMesh = new THREE.Mesh(baseGeometry.clone(), material);
    scene.add(blobMesh);

    // 5. Floating Molecular Orbiting Droplets
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    const smallDropGeo = new THREE.SphereGeometry(0.12, 16, 16);
    for (let i = 0; i < 8; i++) {
      const drop = new THREE.Mesh(smallDropGeo, material);
      const angle = (i / 8) * Math.PI * 2;
      drop.position.set(
        Math.cos(angle) * 2.2,
        Math.sin(angle * 2) * 0.6,
        Math.sin(angle) * 2.2
      );
      drop.scale.setScalar(0.5 + Math.random() * 0.6);
      orbGroup.add(drop);
    }

    const posAttr = baseGeometry.attributes.position;
    const originalPositions = new Float32Array(posAttr.array);

    engineRef.current = {
      scene,
      camera,
      renderer,
      blobMesh,
      baseGeometry,
      material,
      pointLight1,
      pointLight2,
      mouse: new THREE.Vector2(0, 0),
      targetDistortion: 0,
      currentDistortion: 0,
      clock: new THREE.Clock(),
    };

    // Animation Loop with Real-time Simplex-like Wave Deformations
    const animate = () => {
      if (!engineRef.current) return;
      const { blobMesh, clock, mouse, pointLight1, pointLight2 } = engineRef.current;
      const time = clock.getElapsedTime();

      // Smooth mouse distortion dampening
      engineRef.current.currentDistortion += (engineRef.current.targetDistortion - engineRef.current.currentDistortion) * 0.08;
      const distortion = engineRef.current.currentDistortion;

      const currentPos = blobMesh.geometry.attributes.position;
      const count = currentPos.count;

      for (let i = 0; i < count; i++) {
        const uX = originalPositions[i * 3];
        const uY = originalPositions[i * 3 + 1];
        const uZ = originalPositions[i * 3 + 2];

        // Complex multi-harmonic ASMR wave ripple
        const wave1 = Math.sin(uX * 2.5 + time * 2.2) * 0.12;
        const wave2 = Math.cos(uY * 3.0 + time * 1.8) * 0.12;
        const wave3 = Math.sin(uZ * 2.0 + time * 2.5) * 0.1;
        const mouseWave = Math.sin((uX * mouse.x + uY * mouse.y) * 4.0 + time * 4.0) * (0.2 + distortion * 0.4);

        const displacement = 1.0 + wave1 + wave2 + wave3 + mouseWave;

        currentPos.setXYZ(i, uX * displacement, uY * displacement, uZ * displacement);
      }

      currentPos.needsUpdate = true;
      blobMesh.geometry.computeVertexNormals();

      // Rotation & Gentle Floating
      blobMesh.rotation.y = time * 0.35 + mouse.x * 0.5;
      blobMesh.rotation.x = time * 0.2 + mouse.y * 0.5;
      blobMesh.position.y = Math.sin(time * 1.8) * 0.12;

      // Orbiting Droplets
      orbGroup.rotation.y = -time * 0.4;
      orbGroup.rotation.z = Math.sin(time * 0.8) * 0.2;

      // Lights Dynamic Pulse
      pointLight1.position.x = Math.sin(time * 1.5) * 3;
      pointLight1.position.y = Math.cos(time * 1.5) * 3;

      renderer.render(scene, camera);
      engineRef.current.animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container || !engineRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      engineRef.current.camera.aspect = w / h;
      engineRef.current.camera.updateProjectionMatrix();
      engineRef.current.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (engineRef.current?.animId) cancelAnimationFrame(engineRef.current.animId);
      renderer.dispose();
    };
  }, []);

  // Update 3D Material whenever formula selection changes
  useEffect(() => {
    if (!engineRef.current) return;
    const { material, pointLight1 } = engineRef.current;

    material.color.setHex(currentFormula.color);
    material.emissive.setHex(currentFormula.emissive);
    material.roughness = currentFormula.roughness;
    material.metalness = currentFormula.metalness;
    material.transmission = currentFormula.transmission;
    material.ior = currentFormula.ior;
    material.needsUpdate = true;

    pointLight1.color.setHex(currentFormula.accentHex);
    setViscosityMode(currentFormula.viscosity);
  }, [selectedFormulaIndex]);

  // Handle Mouse Hover / Move over 3D Stage for Wave Distortion
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!engineRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    engineRef.current.mouse.x = x;
    engineRef.current.mouse.y = y;
    engineRef.current.targetDistortion = 0.5;
  };

  const handleMouseLeave = () => {
    if (!engineRef.current) return;
    engineRef.current.mouse.set(0, 0);
    engineRef.current.targetDistortion = 0;
  };

  // ASMR Squish Trigger Interaction
  const handleSquish = () => {
    setIsSquishing(true);
    if (engineRef.current) {
      engineRef.current.targetDistortion = 1.4;
    }
    setTimeout(() => {
      setIsSquishing(false);
      if (engineRef.current) {
        engineRef.current.targetDistortion = 0.2;
      }
    }, 600);
  };

  const handleDropInBag = () => {
    if (activeProductObj && onAddToCart) {
      const variant = activeProductObj.variants[0];
      onAddToCart(activeProductObj, variant, 1);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1400);
    }
  };

  return (
    <section
      aria-label="Interactive ASMR Texture Lab"
      className="relative overflow-hidden bg-[#080808] text-slate-100 py-12 sm:py-16 border-b border-white/10"
    >
      {/* Background Neon Ambient Lighting */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Gen Z Sensory Title */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="sticker-tag bg-[#CCFF00] text-black text-xs px-3.5 py-1 -rotate-2">
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span>ASMR SENSORY LAB</span>
              </span>
              <span className="text-xs font-orbitron text-[#00D4FF] bg-white/5 border border-white/10 px-3 py-1 rounded-full hidden sm:inline-block">
                60 FPS REAL-TIME FLUID PHYSICS
              </span>
            </div>

            <h2 className="font-syne text-3xl sm:text-5xl font-extrabold text-white mt-3 uppercase tracking-tight">
              FEEL THE <span className="text-gradient-acid">TEXTURE WAVE</span>
            </h2>
            <p className="text-xs sm:text-sm font-syne font-bold text-slate-300 mt-1">
              Zero heavy textbooks. Touch, squish, and inspect active micro-matrices in real-time.
            </p>
          </div>

          {/* ASMR Sound Mode Pill */}
          <div className="flex items-center gap-3 bg-[#141724] px-4 py-2 rounded-2xl border border-white/15">
            <button
              onClick={() => setIsAsmrMuted(!isAsmrMuted)}
              className="flex items-center gap-2 text-xs font-orbitron font-bold text-white hover:text-[#CCFF00] transition cursor-pointer"
            >
              {isAsmrMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#CCFF00]" />}
              <span>ASMR AUDIO: {isAsmrMuted ? 'MUTED' : 'ACTIVE'}</span>
            </button>

            {/* Sound Wave Bars */}
            {!isAsmrMuted && (
              <div className="flex items-end gap-1 h-4">
                <span className="sound-bar" style={{ animationDelay: '0.1s' }} />
                <span className="sound-bar" style={{ animationDelay: '0.3s' }} />
                <span className="sound-bar" style={{ animationDelay: '0.2s' }} />
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            2-COLUMN ASMR LAB: LEFT SENSORY SELECTOR + RIGHT 3D VOLUMETRIC LIQUID BLOB
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT COLUMN (5 Cols): Minimal, Bold Formulation List that switches to Vibrant Neons */}
          <div className="lg:col-span-5 space-y-3.5">
            <p className="text-[11px] font-orbitron font-extrabold text-slate-400 uppercase tracking-wider">
              Select Galenic Formulation:
            </p>

            {formulas.map((formula, idx) => {
              const isSelected = selectedFormulaIndex === idx;
              return (
                <div
                  key={formula.title}
                  onClick={() => setSelectedFormulaIndex(idx)}
                  onMouseEnter={() => setSelectedFormulaIndex(idx)}
                  className={`p-4 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? `clay-card border-[${formula.accentColor}] ring-2 ring-[${formula.accentColor}]/50 shadow-lg scale-[1.02]`
                      : 'bg-[#10131E]/80 border-white/10 hover:border-white/30 hover:bg-[#151928]'
                  }`}
                >
                  {/* Neon Glow Side Indicator */}
                  {isSelected && (
                    <div
                      style={{ backgroundColor: formula.accentColor }}
                      className="absolute left-0 inset-y-0 w-1.5"
                    />
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-orbitron font-black uppercase ${isSelected ? formula.textColor : 'text-slate-500'}`}>
                        {formula.number} // FORMULA SPEC
                      </span>
                      <h3 className={`text-base sm:text-lg font-syne font-black uppercase tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {formula.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {formula.subTitle}
                      </p>
                    </div>

                    <span className={`sticker-tag ${formula.bgColor} text-black text-[10px] px-2.5 py-0.5 -rotate-2 shrink-0`}>
                      ₹{formula.price}
                    </span>
                  </div>

                  {/* Sensorial Description & Pill Tags (Revealed on active) */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <p className="text-xs text-slate-200 font-sans leading-relaxed">
                        {formula.sensoryFeel}
                      </p>

                      {/* Glowing Pill-Shaped Sensory Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {formula.sensoryTags.map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] font-orbitron font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN (7 Cols): Large Interactive Three.js 3D Volumetric Fluid Blob Stage */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            <div className="w-full glass-cyber-glow rounded-3xl p-6 relative overflow-hidden border border-white/20 shadow-2xl">
              
              {/* Top Cyber Accent Lines */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#CCFF00] via-[#00D4FF] to-[#FF51FA]" />

              {/* HUD Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${currentFormula.bgColor} animate-ping`} />
                  <span className="text-xs font-orbitron font-bold text-white uppercase tracking-wider">
                    {currentFormula.title}
                  </span>
                </div>

                <span className="text-[10px] font-orbitron font-bold text-[#00D4FF] bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                  VISCOSITY: {viscosityMode}
                </span>
              </div>

              {/* 3D WebGL Fluid Canvas */}
              <div
                ref={mountRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleSquish}
                className="w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-[#181D2F] via-[#0B0E17] to-[#05060A] border border-white/10 flex items-center justify-center relative cursor-grab active:cursor-grabbing overflow-hidden group/stage"
              >
                {/* Floating Wave Prompt Indicator */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[10px] font-orbitron text-[#CCFF00] flex items-center gap-1.5 pointer-events-none">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>HOVER TO DISTORT • CLICK TO SQUISH</span>
                </div>

                {/* Squish Animation Badge */}
                {isSquishing && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <span className="sticker-tag bg-[#CCFF00] text-black text-sm px-6 py-2 rotate-[-4deg] animate-bounce shadow-neon-lime">
                      🫧 ASMR SQUISH ACTIVATED!
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Interactive ASMR Controls Bar */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                
                {/* Viscosity Presets */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-orbitron font-bold text-slate-400 uppercase hidden sm:inline">
                    Texture:
                  </span>
                  <button
                    onClick={() => setViscosityMode('GEL_WATER')}
                    className={`px-3 py-1 rounded-xl text-xs font-orbitron font-bold transition cursor-pointer ${
                      viscosityMode === 'GEL_WATER'
                        ? 'bg-[#CCFF00] text-black shadow-neon-lime'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    #GelWater
                  </button>
                  <button
                    onClick={() => setViscosityMode('VELVET_CREAM')}
                    className={`px-3 py-1 rounded-xl text-xs font-orbitron font-bold transition cursor-pointer ${
                      viscosityMode === 'VELVET_CREAM'
                        ? 'bg-[#00D4FF] text-black shadow-neon-cyan'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    #VelvetCream
                  </button>
                  <button
                    onClick={() => setViscosityMode('SILK_SERUM')}
                    className={`px-3 py-1 rounded-xl text-xs font-orbitron font-bold transition cursor-pointer ${
                      viscosityMode === 'SILK_SERUM'
                        ? 'bg-[#FF51FA] text-white shadow-neon-pink'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    #SilkLiquid
                  </button>
                </div>

                {/* Instant Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSquish}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-syne font-black text-xs border border-white/20 transition-transform active:scale-95 cursor-pointer"
                  >
                    ⚡ Squish
                  </button>

                  <button
                    onClick={handleDropInBag}
                    className={`px-5 py-2 rounded-xl ${currentFormula.buttonClass} text-black font-syne font-black text-xs uppercase tracking-wider ${currentFormula.shadowColor} transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>DROPPED!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 fill-black" />
                        <span>+ BAG (₹{currentFormula.price})</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
