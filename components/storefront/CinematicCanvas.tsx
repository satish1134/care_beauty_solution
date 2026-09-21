'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CinematicCanvasProps {
  isPlaying?: boolean;
}

interface GoldGlint {
  x: number;
  y: number;
  size: number;
  maxSize: number;
  alpha: number;
  growth: number;
  speedY: number;
  speedX: number;
}

export default function CinematicCanvas({ isPlaying = true }: CinematicCanvasProps) {
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

    mouseRef.current.x = width * 0.7;
    mouseRef.current.y = height * 0.4;
    mouseRef.current.targetX = width * 0.7;
    mouseRef.current.targetY = height * 0.4;

    // Champagne gold micro-particles & light motes
    const glints: GoldGlint[] = [];
    const count = Math.min(Math.floor(width / 35), 45);

    for (let i = 0; i < count; i++) {
      glints.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.6,
        maxSize: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.5 + 0.1,
        growth: (Math.random() - 0.5) * 0.015,
        speedY: -Math.random() * 0.25 - 0.08,
        speedX: (Math.random() - 0.5) * 0.15
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

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

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.012;

      // Mouse smoothing
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // 1. Cinematic volumetric light beam from top right
      const beamGrad = ctx.createRadialGradient(
        width * 0.75 + Math.sin(time * 0.5) * 40,
        height * 0.2 + Math.cos(time * 0.4) * 30,
        20,
        width * 0.75,
        height * 0.3,
        Math.max(width * 0.6, 450)
      );
      beamGrad.addColorStop(0, 'rgba(229, 184, 92, 0.14)'); // champagne gold soft rim
      beamGrad.addColorStop(0.35, 'rgba(21, 67, 44, 0.22)'); // deep emerald tone
      beamGrad.addColorStop(1, 'rgba(8, 36, 23, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Interactive cursor glow
      const cursorGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        Math.max(width * 0.35, 280)
      );
      cursorGrad.addColorStop(0, 'rgba(243, 202, 116, 0.08)');
      cursorGrad.addColorStop(1, 'rgba(8, 36, 23, 0)');
      ctx.fillStyle = cursorGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Floating gold particles (cellular lipid aura)
      if (isPlaying) {
        for (const g of glints) {
          g.y += g.speedY;
          g.x += g.speedX;
          g.alpha += g.growth;

          if (g.alpha > 0.65 || g.alpha < 0.1) {
            g.growth = -g.growth;
          }

          if (g.y < -10) {
            g.y = height + 10;
            g.x = Math.random() * width;
          }
          if (g.x < -10) g.x = width + 10;
          if (g.x > width + 10) g.x = -10;

          ctx.save();
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229, 184, 92, ${g.alpha})`;
          ctx.shadowColor = 'rgba(229, 184, 92, 0.5)';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    };
  }, [prefersReducedMotion, isPlaying]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
