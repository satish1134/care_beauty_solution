import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Compass, Eye, Maximize2, RotateCcw, Zap, Flame, Shield, Droplets } from 'lucide-react';
import { Product } from '../types';

interface AntiGravity3DHeroProps {
  activeProductId?: string;
  onExploreProduct?: (productId: string) => void;
}

export const AntiGravity3DHero: React.FC<AntiGravity3DHeroProps> = ({
  activeProductId = 'prod-refreshing-skin-cleanser',
  onExploreProduct,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<'BIOTECH' | 'CYAN' | 'SOLAR' | 'ARCTIC'>('BIOTECH');
  const [isRotating, setIsRotating] = useState(true);
  const [gravityMode, setGravityMode] = useState<'ZERO_G' | 'PULSE' | 'ORBIT'>('ZERO_G');
  const [fpsReady, setFpsReady] = useState(false);

  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mainBottleGroup: THREE.Group;
    dropletsGroup: THREE.Group;
    particles: THREE.Points;
    lights: {
      ambient: THREE.AmbientLight;
      pointGold: THREE.PointLight;
      pointTeal: THREE.PointLight;
      directional: THREE.DirectionalLight;
    };
    clock: THREE.Clock;
    targetRotation: { x: number; y: number };
    currentRotation: { x: number; y: number };
    animId?: number;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // 2. WebGL Renderer with High Precision & Alpha
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // 3. Dynamic Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    directionalLight.position.set(5, 8, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointGold = new THREE.PointLight(0xf59e0b, 3.5, 20);
    pointGold.position.set(-4, 3, 4);
    scene.add(pointGold);

    const pointTeal = new THREE.PointLight(0x06b6d4, 2.5, 20);
    pointTeal.position.set(4, -3, 3);
    scene.add(pointTeal);

    // 4. Create Luxury 3D Cosmetic Bottle Group
    const mainBottleGroup = new THREE.Group();
    scene.add(mainBottleGroup);

    // Bottle Body (Cylinder with Frosted Glass look)
    const bodyGeometry = new THREE.CylinderGeometry(1.05, 1.05, 3.2, 48);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfbfbf9,
      transparent: true,
      opacity: 0.88,
      roughness: 0.15,
      metalness: 0.05,
      transmission: 0.6,
      ior: 1.5,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    });
    const bottleBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bottleBody.position.y = 0;
    bottleBody.castShadow = true;
    mainBottleGroup.add(bottleBody);

    // Inner Serum Fluid
    const fluidGeometry = new THREE.CylinderGeometry(0.96, 0.96, 2.9, 32);
    const fluidMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.7,
    });
    const bottleFluid = new THREE.Mesh(fluidGeometry, fluidMaterial);
    bottleFluid.position.y = -0.1;
    mainBottleGroup.add(bottleFluid);

    // Bottle Shoulder & Neck
    const shoulderGeometry = new THREE.ConeGeometry(1.05, 0.5, 48);
    const shoulderMaterial = new THREE.MeshStandardMaterial({
      color: 0xfefefe,
      metalness: 0.1,
      roughness: 0.2,
    });
    const shoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
    shoulder.position.y = 1.85;
    mainBottleGroup.add(shoulder);

    const neckGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.6, 32);
    const neckMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5e7eb,
      metalness: 0.8,
      roughness: 0.2,
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 2.15;
    mainBottleGroup.add(neck);

    // Luxury Gold Pump Dispenser
    const pumpCapGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.45, 32);
    const goldCapMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.15,
    });
    const pumpCap = new THREE.Mesh(pumpCapGeometry, goldCapMaterial);
    pumpCap.position.y = 2.45;
    mainBottleGroup.add(pumpCap);

    // Pump Nozzle
    const nozzleGeometry = new THREE.BoxGeometry(0.25, 0.2, 0.7);
    const nozzle = new THREE.Mesh(nozzleGeometry, goldCapMaterial);
    nozzle.position.set(0, 2.65, 0.25);
    mainBottleGroup.add(nozzle);

    // Luxury Brand Label on Bottle Front
    const labelGeometry = new THREE.CylinderGeometry(1.06, 1.06, 1.8, 32, 1, true, -Math.PI / 3, (Math.PI * 2) / 3);
    const labelMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.y = 0.05;
    mainBottleGroup.add(label);

    // 5. Anti-Gravity Floating Serum Droplets
    const dropletsGroup = new THREE.Group();
    scene.add(dropletsGroup);

    const dropletGeom = new THREE.SphereGeometry(0.12, 24, 24);
    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.8,
      ior: 1.4,
      clearcoat: 1.0,
    });

    const droplets: { mesh: THREE.Mesh; speed: number; phase: number; radius: number; angle: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const mesh = new THREE.Mesh(dropletGeom, dropletMat);
      const scale = 0.5 + Math.random() * 1.2;
      mesh.scale.set(scale, scale * 1.3, scale);
      
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 2.2 + Math.random() * 1.8;
      const y = (Math.random() - 0.5) * 4;
      mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);

      dropletsGroup.add(mesh);
      droplets.push({
        mesh,
        speed: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        radius,
        angle,
      });
    }

    // 6. Floating Luminous Stardust & Herbal Mist Particles
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;

      // Golden and soft emerald hues
      if (Math.random() > 0.4) {
        particleColors[i] = 0.98; // R
        particleColors[i + 1] = 0.75; // G
        particleColors[i + 2] = 0.2; // B
      } else {
        particleColors[i] = 0.2;
        particleColors[i + 1] = 0.85;
        particleColors[i + 2] = 0.75;
      }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Initial positioning
    mainBottleGroup.position.set(0, -0.2, 0);
    mainBottleGroup.rotation.set(0.2, 0.4, -0.15);

    const clock = new THREE.Clock();
    const targetRotation = { x: 0.2, y: 0.4 };
    const currentRotation = { x: 0.2, y: 0.4 };

    sceneRef.current = {
      scene,
      camera,
      renderer,
      mainBottleGroup,
      dropletsGroup,
      particles,
      lights: {
        ambient: ambientLight,
        pointGold,
        pointTeal,
        directional: directionalLight,
      },
      clock,
      targetRotation,
      currentRotation,
    };

    setFpsReady(true);

    // 7. Render Loop with Smooth Anti-Gravity Floating Physics
    const animate = () => {
      const state = sceneRef.current;
      if (!state) return;

      const elapsedTime = state.clock.getElapsedTime();

      // Smooth mouse tilt lerp
      state.currentRotation.x += (state.targetRotation.x - state.currentRotation.x) * 0.06;
      state.currentRotation.y += (state.targetRotation.y - state.currentRotation.y) * 0.06;

      // Base rotation + anti-gravity floating bob
      const floatY = Math.sin(elapsedTime * 1.5) * 0.25;
      const wobbleZ = Math.cos(elapsedTime * 1.1) * 0.08;

      state.mainBottleGroup.position.y = -0.2 + floatY;
      state.mainBottleGroup.rotation.z = -0.12 + wobbleZ;

      if (isRotating) {
        state.mainBottleGroup.rotation.y += 0.008;
      } else {
        state.mainBottleGroup.rotation.y = state.currentRotation.y;
      }
      state.mainBottleGroup.rotation.x = state.currentRotation.x + Math.sin(elapsedTime * 0.8) * 0.05;

      // Animate floating droplets
      droplets.forEach((d, idx) => {
        d.angle += 0.006 * d.speed;
        d.mesh.position.x = Math.cos(d.angle) * d.radius;
        d.mesh.position.z = Math.sin(d.angle) * d.radius;
        d.mesh.position.y += Math.sin(elapsedTime * 2 + d.phase) * 0.015;
        d.mesh.rotation.x += 0.02;
        d.mesh.rotation.y += 0.03;
      });

      // Animate particles swirl
      state.particles.rotation.y = elapsedTime * 0.03;
      state.particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      state.renderer.render(state.scene, state.camera);
      state.animId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !sceneRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current?.animId) {
        cancelAnimationFrame(sceneRef.current.animId);
      }
      renderer.dispose();
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      dropletGeom.dispose();
      dropletMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [isRotating]);

  // Mouse move handler for interactive parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    sceneRef.current.targetRotation.y = x * 1.5;
    sceneRef.current.targetRotation.x = y * 1.2 + 0.2;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!mountRef.current || !sceneRef.current || e.touches.length === 0) return;
    const rect = mountRef.current.getBoundingClientRect();
    const x = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
    const y = (e.touches[0].clientY - rect.top) / rect.height - 0.5;

    sceneRef.current.targetRotation.y = x * 1.2;
    sceneRef.current.targetRotation.x = y * 1.0 + 0.2;
  };

  // Change lighting themes
  const applyLightingTheme = (theme: 'BIOTECH' | 'CYAN' | 'SOLAR' | 'ARCTIC') => {
    setActiveTheme(theme);
    if (!sceneRef.current) return;
    const { lights } = sceneRef.current;

    switch (theme) {
      case 'BIOTECH':
        lights.pointGold.color.setHex(0x10b981);
        lights.pointGold.intensity = 4.2;
        lights.pointTeal.color.setHex(0x06b6d4);
        lights.pointTeal.intensity = 3.0;
        break;
      case 'CYAN':
        lights.pointGold.color.setHex(0x06b6d4);
        lights.pointGold.intensity = 4.0;
        lights.pointTeal.color.setHex(0x2563eb);
        lights.pointTeal.intensity = 3.5;
        break;
      case 'SOLAR':
        lights.pointGold.color.setHex(0xf59e0b);
        lights.pointGold.intensity = 4.5;
        lights.pointTeal.color.setHex(0x10b981);
        lights.pointTeal.intensity = 2.0;
        break;
      case 'ARCTIC':
        lights.pointGold.color.setHex(0x38bdf8);
        lights.pointGold.intensity = 4.5;
        lights.pointTeal.color.setHex(0x0284c7);
        lights.pointTeal.intensity = 3.5;
        break;
    }
  };

  const handleResetOrientation = () => {
    if (!sceneRef.current) return;
    sceneRef.current.targetRotation.x = 0.2;
    sceneRef.current.targetRotation.y = 0.4;
  };

  return (
    <div
      className="relative w-full h-[480px] lg:h-[540px] flex items-center justify-center select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Floating Anti-Gravity Spatial HUD Badges */}
      <div className="absolute top-3 left-4 flex flex-col gap-2 z-20 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-300/60 shadow-xl px-3.5 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-950 transition hover:scale-105">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Anti-Gravity 3D Engine</span>
        </div>

        <div className="bg-slate-950/85 backdrop-blur-xl border border-white/20 shadow-xl px-3 py-1 rounded-xl text-[10px] font-mono text-emerald-300 flex items-center gap-2">
          <Droplets className="w-3 h-3 text-cyan-400" />
          <span>Real-Time Ray Optics • 60 FPS</span>
        </div>
      </div>

      {/* Anti-Gravity Controls Bar (Bottom) */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/85 backdrop-blur-xl border border-emerald-100 shadow-2xl">
        {/* Lighting Theme Switchers */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline mr-1">
            Studio Light:
          </span>
          <button
            onClick={() => applyLightingTheme('BIOTECH')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeTheme === 'BIOTECH'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Biotech Emerald & Mint Luminescence"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Emerald
          </button>
          <button
            onClick={() => applyLightingTheme('CYAN')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeTheme === 'CYAN'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Electric Cyan & Cobalt Radiance"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Cyan
          </button>
          <button
            onClick={() => applyLightingTheme('SOLAR')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeTheme === 'SOLAR'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Solar Gold & Warm Amber"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Solar
          </button>
          <button
            onClick={() => applyLightingTheme('ARCTIC')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeTheme === 'ARCTIC'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Arctic Glacier Frost"
          >
            <span className="w-2 h-2 rounded-full bg-sky-300" /> Arctic
          </button>
        </div>

        {/* Physics Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              isRotating
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Toggle Continuous 3D Orbit"
          >
            <Compass className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Auto-Orbit' : 'Paused'}</span>
          </button>

          <button
            onClick={handleResetOrientation}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            title="Reset Perspective"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
