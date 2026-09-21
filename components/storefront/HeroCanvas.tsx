'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  targetAlpha: number;
  color: string;
}

interface SerumDroplet {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  wobble: number;
  wobbleSpeed: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    mouseRef.current = {
      x: width * 0.5,
      y: height * 0.35,
      targetX: width * 0.5,
      targetY: height * 0.35
    };

    // Soft botanical & dew particles in warm cream palette
    const particleCount = Math.min(Math.floor((width * height) / 22000), 40);
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const isAmber = Math.random() > 0.5;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 1.0,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.35 - 0.1,
        alpha: Math.random() * 0.35 + 0.1,
        targetAlpha: Math.random() * 0.35 + 0.1,
        color: isAmber ? '180, 140, 80' : '50, 110, 80' // subtle ochre & sage
      });
    }

    // Translucent glass serum droplets
    const droplets: SerumDroplet[] = [
      { x: width * 0.2, y: height * 0.4, size: 26, vx: 0.08, vy: -0.06, wobble: 0, wobbleSpeed: 0.015 },
      { x: width * 0.78, y: height * 0.3, size: 34, vx: -0.07, vy: -0.05, wobble: 1.8, wobbleSpeed: 0.012 },
      { x: width * 0.5, y: height * 0.75, size: 22, vx: 0.06, vy: -0.09, wobble: 3.4, wobbleSpeed: 0.02 }
    ];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        mouseRef.current.targetX = e.touches[0].clientX - rect.left;
        mouseRef.current.targetY = e.touches[0].clientY - rect.top;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          width = newWidth;
          height = newHeight;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);
        }
      }
    });
    resizeObserver.observe(container);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse spring interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // 1. Warm radial light sheen following cursor
      const radialGradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        20,
        mouse.x,
        mouse.y,
        Math.max(width * 0.5, 380)
      );
      radialGradient.addColorStop(0, 'rgba(235, 215, 175, 0.45)'); // Warm glowing cream/champagne
      radialGradient.addColorStop(0.5, 'rgba(245, 240, 230, 0.2)');
      radialGradient.addColorStop(1, 'rgba(251, 249, 245, 0)');
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Translucent glass serum droplets
      for (const droplet of droplets) {
        droplet.x += droplet.vx;
        droplet.y += droplet.vy;
        droplet.wobble += droplet.wobbleSpeed;

        if (droplet.y < -droplet.size * 2) droplet.y = height + droplet.size;
        if (droplet.x < -droplet.size * 2) droplet.x = width + droplet.size;
        if (droplet.x > width + droplet.size * 2) droplet.x = -droplet.size;

        const dx = droplet.x - mouse.x;
        const dy = droplet.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repel = Math.max(0, (240 - dist) / 240) * 0.7;
        if (dist > 0 && dist < 240) {
          droplet.x += (dx / dist) * repel;
          droplet.y += (dy / dist) * repel;
        }

        const currentSize = droplet.size + Math.sin(droplet.wobble) * 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(droplet.x, droplet.y, currentSize, 0, Math.PI * 2);

        // Glass gradient (light rim, subtle refraction)
        const dropGrad = ctx.createRadialGradient(
          droplet.x - currentSize * 0.35,
          droplet.y - currentSize * 0.35,
          currentSize * 0.1,
          droplet.x,
          droplet.y,
          currentSize
        );
        dropGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        dropGrad.addColorStop(0.5, 'rgba(235, 226, 210, 0.25)');
        dropGrad.addColorStop(1, 'rgba(200, 185, 160, 0.15)');
        ctx.fillStyle = dropGrad;
        ctx.fill();

        // Delicate glass rim
        ctx.strokeStyle = 'rgba(215, 200, 175, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Specular highlight dot
        ctx.beginPath();
        ctx.arc(
          droplet.x - currentSize * 0.35,
          droplet.y - currentSize * 0.35,
          currentSize * 0.18,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
        ctx.restore();
      }

      // 3. Floating micro-botanical particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += (p.targetAlpha - p.alpha) * 0.04;

        if (Math.random() < 0.01) {
          p.targetAlpha = Math.random() * 0.4 + 0.1;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      resizeObserver.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-90" />
      {/* Editorial top and bottom soft vignetting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FBF9F5]/40 via-transparent to-[#FBF9F5] pointer-events-none" />
    </div>
  );
}
