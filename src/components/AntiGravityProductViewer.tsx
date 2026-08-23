import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, ZoomIn, ZoomOut, Layers, Eye, ShieldCheck, Droplet, Sun, Sparkle } from 'lucide-react';
import { Product } from '../types';

interface AntiGravityProductViewerProps {
  product: Product;
  onClose?: () => void;
}

export const AntiGravityProductViewer: React.FC<AntiGravityProductViewerProps> = ({
  product,
  onClose,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [exploded, setExploded] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [activeIngredient, setActiveIngredient] = useState<string>(product.keyIngredients[0] || 'Niacinamide');

  const sceneState = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    bottleMesh: THREE.Mesh;
    pumpMesh: THREE.Mesh;
    nozzleMesh: THREE.Mesh;
    liquidMesh: THREE.Mesh;
    orbs: THREE.Mesh[];
    clock: THREE.Clock;
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    animId?: number;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    container.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 3.0);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xf59e0b, 2.5, 15);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x06b6d4, 2.0, 15);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Product Colors based on category
    const isSunscreen = product.categoryName?.toLowerCase().includes('sun') || product.name.includes('SPF');
    const isMoisturizer = product.categoryName?.toLowerCase().includes('moistur') || product.name.includes('Ceramide');

    const liquidColor = isSunscreen ? 0xfef08a : (isMoisturizer ? 0xecfdf5 : 0xfef3c7);
    const bottleColor = 0xffffff;

    // 1. Bottle Body
    const bottleGeom = new THREE.CylinderGeometry(0.9, 0.9, 2.6, 40);
    const bottleMat = new THREE.MeshPhysicalMaterial({
      color: bottleColor,
      transparent: true,
      opacity: 0.85,
      roughness: 0.12,
      metalness: 0.05,
      transmission: 0.7,
      ior: 1.52,
      clearcoat: 1.0,
      wireframe,
    });
    const bottleMesh = new THREE.Mesh(bottleGeom, bottleMat);
    scene.add(bottleMesh);

    // 2. Liquid Core
    const liquidGeom = new THREE.CylinderGeometry(0.82, 0.82, 2.3, 32);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: liquidColor,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });
    const liquidMesh = new THREE.Mesh(liquidGeom, liquidMat);
    liquidMesh.position.y = -0.1;
    scene.add(liquidMesh);

    // 3. Pump Base
    const pumpGeom = new THREE.CylinderGeometry(0.42, 0.42, 0.5, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.2,
      wireframe,
    });
    const pumpMesh = new THREE.Mesh(pumpGeom, goldMat);
    pumpMesh.position.y = 1.6;
    scene.add(pumpMesh);

    // 4. Pump Nozzle
    const nozzleGeom = new THREE.BoxGeometry(0.24, 0.2, 0.65);
    const nozzleMesh = new THREE.Mesh(nozzleGeom, goldMat);
    nozzleMesh.position.set(0, 1.85, 0.2);
    scene.add(nozzleMesh);

    // 5. Floating Active Ingredient Micro-Spheres
    const orbs: THREE.Mesh[] = [];
    const orbGeom = new THREE.SphereGeometry(0.14, 20, 20);
    const orbMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      transmission: 0.6,
    });

    for (let i = 0; i < 8; i++) {
      const orb = new THREE.Mesh(orbGeom, orbMat);
      const angle = (i / 8) * Math.PI * 2;
      orb.position.set(Math.cos(angle) * 1.8, Math.sin(angle * 2) * 0.8, Math.sin(angle) * 1.8);
      scene.add(orb);
      orbs.push(orb);
    }

    const clock = new THREE.Clock();

    sceneState.current = {
      scene,
      camera,
      renderer,
      bottleMesh,
      pumpMesh,
      nozzleMesh,
      liquidMesh,
      orbs,
      clock,
      isDragging: false,
      previousMousePosition: { x: 0, y: 0 },
    };

    const animate = () => {
      const st = sceneState.current;
      if (!st) return;

      const t = st.clock.getElapsedTime();

      // Floating gentle hover
      const floatY = Math.sin(t * 1.8) * 0.12;
      st.bottleMesh.position.y = floatY;
      st.liquidMesh.position.y = -0.1 + floatY;

      if (exploded) {
        st.pumpMesh.position.y = 2.4 + floatY;
        st.nozzleMesh.position.y = 2.8 + floatY;
      } else {
        st.pumpMesh.position.y = 1.6 + floatY;
        st.nozzleMesh.position.y = 1.85 + floatY;
      }

      // Gentle auto-rotation
      st.bottleMesh.rotation.y += 0.005;
      st.liquidMesh.rotation.y += 0.005;
      st.pumpMesh.rotation.y += 0.005;
      st.nozzleMesh.rotation.y += 0.005;

      // Swirling ingredient orbs
      st.orbs.forEach((orb, i) => {
        const angle = (i / 8) * Math.PI * 2 + t * 0.5;
        const radius = exploded ? 2.5 : 1.7;
        orb.position.x = Math.cos(angle) * radius;
        orb.position.z = Math.sin(angle) * radius;
        orb.position.y = Math.sin(t * 2 + i) * 0.7;
      });

      st.renderer.render(st.scene, st.camera);
      st.animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container || !sceneState.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      sceneState.current.camera.aspect = w / h;
      sceneState.current.camera.updateProjectionMatrix();
      sceneState.current.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneState.current?.animId) {
        cancelAnimationFrame(sceneState.current.animId);
      }
      renderer.dispose();
      bottleGeom.dispose();
      bottleMat.dispose();
      liquidGeom.dispose();
      liquidMat.dispose();
      pumpGeom.dispose();
      nozzleGeom.dispose();
      goldMat.dispose();
      orbGeom.dispose();
      orbMat.dispose();
    };
  }, [exploded, wireframe, product]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sceneState.current) return;
    sceneState.current.isDragging = true;
    sceneState.current.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sceneState.current || !sceneState.current.isDragging) return;
    const deltaX = e.clientX - sceneState.current.previousMousePosition.x;
    const deltaY = e.clientY - sceneState.current.previousMousePosition.y;

    const rotationSpeed = 0.008;
    sceneState.current.bottleMesh.rotation.y += deltaX * rotationSpeed;
    sceneState.current.liquidMesh.rotation.y += deltaX * rotationSpeed;
    sceneState.current.pumpMesh.rotation.y += deltaX * rotationSpeed;
    sceneState.current.nozzleMesh.rotation.y += deltaX * rotationSpeed;

    sceneState.current.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    if (sceneState.current) {
      sceneState.current.isDragging = false;
    }
  };

  return (
    <div className="flex flex-col bg-slate-950 text-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Top Interactive Bar */}
      <div className="p-4 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
            Anti-Gravity 3D Inspection Mode
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExploded(!exploded)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              exploded
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Explode packaging layers to view internal dispenser and formula"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{exploded ? 'Exploded Layer View' : 'Explode Architecture'}</span>
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
              wireframe
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Inspect 3D wireframe mesh topology"
          >
            Mesh Wireframe
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-[380px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 cursor-grab active:cursor-grabbing relative flex items-center justify-center select-none"
      >
        <div className="absolute top-3 right-3 text-[11px] bg-slate-950/80 backdrop-blur px-3 py-1 rounded-xl text-emerald-300 font-mono border border-slate-800">
          Click & Drag to Rotate 360°
        </div>
      </div>

      {/* Ingredient Spectrum & Claims Footer */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Formula Core:</span>
          <div className="flex flex-wrap gap-1.5">
            {product.keyIngredients.map(ing => (
              <span
                key={ing}
                className="text-xs bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-lg font-medium flex items-center gap-1"
              >
                <Droplet className="w-3 h-3 text-emerald-400" />
                {ing}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Medical Grade Acrylic
          </span>
        </div>
      </div>
    </div>
  );
};
