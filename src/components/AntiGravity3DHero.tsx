import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Zap, Sparkles, Compass, Eye, RotateCcw, Droplets, Activity, Layers, Flame } from 'lucide-react';
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
  const [activeTheme, setActiveTheme] = useState<'ACID_LIME' | 'CYBER_CYAN' | 'HYPER_PINK' | 'SOLAR_GOLD'>('ACID_LIME');
  const [isRotating, setIsRotating] = useState(true);
  const [gravityMode, setGravityMode] = useState<'ZERO_G' | 'WARP' | 'PULSE'>('ZERO_G');

  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mainBottleGroup: THREE.Group;
    dropletsGroup: THREE.Group;
    quantumRings: THREE.Group;
    particles: THREE.Points;
    lights: {
      ambient: THREE.AmbientLight;
      pointLime: THREE.PointLight;
      pointCyan: THREE.PointLight;
      pointPink: THREE.PointLight;
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

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    container.replaceChildren(renderer.domElement);

    // 3. Cyber Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(5, 8, 5);
    scene.add(directionalLight);

    const pointLime = new THREE.PointLight(0xccff00, 4.5, 25);
    pointLime.position.set(-4, 3, 4);
    scene.add(pointLime);

    const pointCyan = new THREE.PointLight(0x00f0ff, 4.0, 25);
    pointCyan.position.set(4, -3, 3);
    scene.add(pointCyan);

    const pointPink = new THREE.PointLight(0xff007f, 3.5, 20);
    pointPink.position.set(0, 5, -3);
    scene.add(pointPink);

    // 4. Main 3D Cosmetic Bottle Group
    const mainBottleGroup = new THREE.Group();
    scene.add(mainBottleGroup);

    // Frosted Glass Bottle Body
    const bodyGeometry = new THREE.CylinderGeometry(1.05, 1.05, 3.2, 48);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111625,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      ior: 1.55,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const bottleBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    mainBottleGroup.add(bottleBody);

    // Liquid Core with Neon Fluorescence
    const liquidGeo = new THREE.CylinderGeometry(0.96, 0.96, 2.8, 36);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xccff00,
      emissive: 0x224400,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.6,
      roughness: 0.2,
      transmission: 0.4,
    });
    const liquidCore = new THREE.Mesh(liquidGeo, liquidMat);
    liquidCore.position.y = -0.15;
    mainBottleGroup.add(liquidCore);

    // Cyber Chrome Pump Dispenser
    const pumpBaseGeo = new THREE.CylinderGeometry(1.08, 1.08, 0.45, 48);
    const pumpBaseMat = new THREE.MeshStandardMaterial({
      color: 0xd4d8e0,
      metalness: 0.95,
      roughness: 0.15,
    });
    const pumpBase = new THREE.Mesh(pumpBaseGeo, pumpBaseMat);
    pumpBase.position.y = 1.82;
    mainBottleGroup.add(pumpBase);

    // Spout
    const spoutGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.75, 32);
    const spoutMat = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      metalness: 0.8,
      roughness: 0.2,
    });
    const spout = new THREE.Mesh(spoutGeo, spoutMat);
    spout.position.y = 2.3;
    mainBottleGroup.add(spout);

    // Horizontal Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.9, 24);
    const nozzle = new THREE.Mesh(nozzleGeo, spoutMat);
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.set(0.45, 2.55, 0);
    mainBottleGroup.add(nozzle);

    // Holographic Label Band
    const labelGeo = new THREE.CylinderGeometry(1.06, 1.06, 1.6, 48, 1, true, -Math.PI / 2, Math.PI);
    const labelMat = new THREE.MeshStandardMaterial({
      color: 0x090c15,
      metalness: 0.3,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = -0.1;
    mainBottleGroup.add(labelMesh);

    // 5. Orbiting Quantum Hologram Rings
    const quantumRings = new THREE.Group();
    scene.add(quantumRings);

    const ring1Geo = new THREE.TorusGeometry(2.2, 0.03, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xccff00 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    quantumRings.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.6, 0.025, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 4;
    quantumRings.add(ring2);

    // 6. Floating Molecular Droplets
    const dropletsGroup = new THREE.Group();
    scene.add(dropletsGroup);

    const dropletGeo = new THREE.SphereGeometry(0.15, 24, 24);
    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      emissive: 0x003344,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
      roughness: 0.05,
      transmission: 0.8,
      ior: 1.4,
    });

    for (let i = 0; i < 14; i++) {
      const drop = new THREE.Mesh(dropletGeo, dropletMat);
      const angle = (i / 14) * Math.PI * 2;
      const radius = 2.0 + Math.sin(i * 3) * 0.8;
      drop.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 3.5,
        Math.sin(angle) * radius
      );
      drop.scale.setScalar(0.4 + Math.random() * 0.7);
      dropletsGroup.add(drop);
    }

    // 7. Particle Vortex Field
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xccff00,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Save refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      mainBottleGroup,
      dropletsGroup,
      quantumRings,
      particles,
      lights: { ambient: ambientLight, pointLime, pointCyan, pointPink, directional: directionalLight },
      clock: new THREE.Clock(),
      targetRotation: { x: 0.2, y: 0.3 },
      currentRotation: { x: 0.2, y: 0.3 },
    };

    // Animation Loop
    const animate = () => {
      if (!sceneRef.current) return;
      const { mainBottleGroup, dropletsGroup, quantumRings, particles, clock, targetRotation, currentRotation } = sceneRef.current;
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

      if (isRotating) {
        mainBottleGroup.rotation.y = elapsedTime * 0.4 + currentRotation.y;
        mainBottleGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.08 + currentRotation.x;
      } else {
        mainBottleGroup.rotation.y = currentRotation.y;
        mainBottleGroup.rotation.x = currentRotation.x;
      }

      // Anti-Gravity Hover Physics
      mainBottleGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.22;

      // Rings Rotation
      quantumRings.rotation.x = elapsedTime * 0.3;
      quantumRings.rotation.y = elapsedTime * 0.5;
      quantumRings.position.y = Math.sin(elapsedTime * 1.8) * 0.22;

      // Orbiting droplets
      dropletsGroup.rotation.y = -elapsedTime * 0.35;
      dropletsGroup.children.forEach((drop, idx) => {
        drop.position.y += Math.sin(elapsedTime * 2 + idx) * 0.005;
      });

      // Particle float
      particles.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
      sceneRef.current.animId = requestAnimationFrame(animate);
    };

    animate();

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
      if (sceneRef.current?.animId) cancelAnimationFrame(sceneRef.current.animId);
      renderer.dispose();
    };
  }, [isRotating]);

  const applyLightingTheme = (theme: 'ACID_LIME' | 'CYBER_CYAN' | 'HYPER_PINK' | 'SOLAR_GOLD') => {
    setActiveTheme(theme);
    if (!sceneRef.current) return;
    const { lights } = sceneRef.current;

    if (theme === 'ACID_LIME') {
      lights.pointLime.color.setHex(0xccff00);
      lights.pointCyan.color.setHex(0x00f0ff);
      lights.pointPink.color.setHex(0x224400);
    } else if (theme === 'CYBER_CYAN') {
      lights.pointLime.color.setHex(0x00f0ff);
      lights.pointCyan.color.setHex(0x38bdf8);
      lights.pointPink.color.setHex(0x0284c7);
    } else if (theme === 'HYPER_PINK') {
      lights.pointLime.color.setHex(0xff007f);
      lights.pointCyan.color.setHex(0xd946ef);
      lights.pointPink.color.setHex(0x831843);
    } else if (theme === 'SOLAR_GOLD') {
      lights.pointLime.color.setHex(0xffe600);
      lights.pointCyan.color.setHex(0xf59e0b);
      lights.pointPink.color.setHex(0xd97706);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    sceneRef.current.targetRotation.x = y * 0.4;
    sceneRef.current.targetRotation.y = x * 0.8;
  };

  const handleResetOrientation = () => {
    if (!sceneRef.current) return;
    sceneRef.current.targetRotation.x = 0.2;
    sceneRef.current.targetRotation.y = 0.3;
  };

  return (
    <div
      className="relative w-full h-[460px] lg:h-[520px] flex items-center justify-center select-none bg-cyber-grid"
      onMouseMove={handleMouseMove}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Floating Anti-Gravity Cyber HUD Badges */}
      <div className="absolute top-3 left-4 flex flex-col gap-2 z-20 pointer-events-auto">
        <div className="sticker-tag bg-[#CCFF00] text-black text-[11px] px-3.5 py-1 rotate-[-2deg]">
          <Zap className="w-3.5 h-3.5 fill-black" />
          <span>CYBER-GLOW 3D SIMULATOR</span>
        </div>

        <div className="bg-[#090C16]/90 backdrop-blur-md border border-white/20 shadow-xl px-3 py-1 rounded-xl text-[10px] font-mono text-[#00F0FF] flex items-center gap-2">
          <Droplets className="w-3 h-3 text-[#00F0FF]" />
          <span>REAL-TIME RAYTRACING • 60 FPS</span>
        </div>
      </div>

      {/* Controls Bar (Bottom) */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl glass-cyber-glow border border-white/15 shadow-2xl">
        {/* Lighting Theme Switchers */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
            Shader Light:
          </span>
          <button
            onClick={() => applyLightingTheme('ACID_LIME')}
            className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase transition flex items-center gap-1 cursor-pointer ${
              activeTheme === 'ACID_LIME'
                ? 'bg-[#CCFF00] text-black shadow-neon-lime'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#CCFF00]" /> Lime
          </button>
          <button
            onClick={() => applyLightingTheme('CYBER_CYAN')}
            className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase transition flex items-center gap-1 cursor-pointer ${
              activeTheme === 'CYBER_CYAN'
                ? 'bg-[#00F0FF] text-black shadow-neon-cyan'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#00F0FF]" /> Cyan
          </button>
          <button
            onClick={() => applyLightingTheme('HYPER_PINK')}
            className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase transition flex items-center gap-1 cursor-pointer ${
              activeTheme === 'HYPER_PINK'
                ? 'bg-[#FF007F] text-white shadow-neon-pink'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF007F]" /> Pink
          </button>
          <button
            onClick={() => applyLightingTheme('SOLAR_GOLD')}
            className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase transition flex items-center gap-1 cursor-pointer ${
              activeTheme === 'SOLAR_GOLD'
                ? 'bg-[#FFE600] text-black shadow-neon-gold'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FFE600]" /> Gold
          </button>
        </div>

        {/* Physics Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              isRotating
                ? 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/50 shadow-neon-lime'
                : 'bg-white/5 text-slate-300 border-white/10'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Auto-Orbit' : 'Paused'}</span>
          </button>

          <button
            onClick={handleResetOrientation}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition cursor-pointer"
            title="Reset Perspective"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
