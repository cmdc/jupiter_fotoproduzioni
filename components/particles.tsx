"use client";
import React, { useRef, useEffect } from "react";
import MousePosition from "@/lib/mouse-position";
import { useTheme } from "next-themes";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 120, // Increased for better film grain density
  staticity = 60, // Slightly higher for more realistic grain movement
  ease = 25, // Smoother mouse follow
  refresh = false,
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = MousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  const { theme, resolvedTheme } = useTheme();
  const color_dark = "rgba(223, 230, 233, ";
  const color_light = "rgba(120, 130, 140, "; // Colore più chiaro per tema light

  // Film grain noise parameters - enhanced visibility
  const grainIntensity = useRef(1.2);
  const grainSize = useRef(2.5);
  const frameCount = useRef(0);
  const skipFrames = useRef(10); // Skip ancora più frames per flickering più lento

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, []);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  useEffect(() => {
    let color = resolvedTheme === "dark" ? color_dark : color_light;
    // Update grain particles color based on theme
    circles.current.forEach((grain: GrainParticle) => {
      grain.color_t = color;
    });
  }, [theme, resolvedTheme]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type GrainParticle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
    color_t: string;
    brightness: number;
    flickerRate: number;
    age: number;
    maxAge: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const grainParams = (): GrainParticle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const size = Math.random() * grainSize.current + 0.5;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.8 + 0.2).toFixed(2));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.05 + Math.random() * 2;
    let color_t = resolvedTheme === "dark" ? color_dark : color_light;
    const brightness = Math.random() * 0.8 + 0.2;
    const flickerRate = Math.random() * 0.0001 + 0.00005; // Flickering minimo quasi impercettibile
    const age = 0;
    const maxAge = Math.random() * 800 + 300;
    return {
      x,
      y,
      translateX,
      translateY,
      size,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
      color_t,
      brightness,
      flickerRate,
      age,
      maxAge,
    };
  };

  const drawGrain = (grain: GrainParticle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha, brightness } = grain;

      // Film grain effect: irregular shapes instead of perfect circles
      context.current.save();
      context.current.translate(translateX, translateY);

      // Create irregular grain-like shapes
      const grainX = x + (Math.random() - 0.5) * 0.5;
      const grainY = y + (Math.random() - 0.5) * 0.5;

      // Film grain irregular shapes
      const finalAlpha = Math.max(
        0.1,
        alpha * brightness * grainIntensity.current
      );
      const shapeType = Math.random();

      if (shapeType < 0.4) {
        // Square grain particles
        const grainSize = size * (1.0 + Math.random() * 0.5);
        context.current.fillStyle = `${grain.color_t}${finalAlpha})`;
        context.current.fillRect(
          grainX - grainSize / 2,
          grainY - grainSize / 2,
          grainSize,
          grainSize
        );
      } else if (shapeType < 0.7) {
        // Rectangular grain particles
        const width = size * (0.6 + Math.random() * 1.0);
        const height = size * (0.3 + Math.random() * 0.8);
        context.current.fillStyle = `${grain.color_t}${finalAlpha})`;
        context.current.fillRect(
          grainX - width / 2,
          grainY - height / 2,
          width,
          height
        );
      } else if (shapeType < 0.9) {
        // Small irregular circles
        context.current.beginPath();
        context.current.arc(
          grainX,
          grainY,
          size * (0.8 + Math.random() * 0.6),
          0,
          2 * Math.PI
        );
        context.current.fillStyle = `${grain.color_t}${finalAlpha})`;
        context.current.fill();
      } else {
        // Tiny noise dots - slightly larger
        context.current.fillStyle = `${grain.color_t}${finalAlpha})`;
        context.current.fillRect(grainX - 0.6, grainY - 0.6, 1.4, 1.4);
      }

      context.current.restore();

      if (!update) {
        circles.current.push(grain);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    circles.current.length = 0; // Svuota completamente l'array
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const grain = grainParams();
      drawGrain(grain);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    frameCount.current++;

    // Performance optimization: skip some frames for grain updates
    const shouldUpdateGrain = frameCount.current % skipFrames.current === 0;

    // Mantieni il numero di particelle costante
    if (circles.current.length > quantity) {
      circles.current = circles.current.slice(0, quantity);
    }

    clearContext();
    circles.current.forEach((grain: GrainParticle, i: number) => {
      // Grain aging and flickering (only on certain frames)
      if (shouldUpdateGrain) {
        grain.age++;

        // Film grain flickering effect
        grain.brightness += (Math.random() - 0.5) * grain.flickerRate;
        grain.brightness = Math.max(0.1, Math.min(1, grain.brightness));
      }

      // Handle the alpha value with edge fading
      const edge = [
        grain.x + grain.translateX - grain.size,
        canvasSize.current.w - grain.x - grain.translateX - grain.size,
        grain.y + grain.translateY - grain.size,
        canvasSize.current.h - grain.y - grain.translateY - grain.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      );

      if (remapClosestEdge > 1) {
        grain.alpha += 0.015;
        if (grain.alpha > grain.targetAlpha) {
          grain.alpha = grain.targetAlpha;
        }
      } else {
        grain.alpha = grain.targetAlpha * remapClosestEdge;
      }

      // Film grain movement (slower, more organic)
      grain.x += grain.dx * 0.5 + vx;
      grain.y += grain.dy * 0.5 + vy;

      // Mouse follow effect (more subtle for film grain)
      const mouseInfluence = 0.7; // Reduce mouse influence for more realistic grain
      grain.translateX +=
        ((mouse.current.x / (staticity / grain.magnetism)) * mouseInfluence -
          grain.translateX) /
        (ease * 1.5);
      grain.translateY +=
        ((mouse.current.y / (staticity / grain.magnetism)) * mouseInfluence -
          grain.translateY) /
        (ease * 1.5);

      // Grain lifecycle: regenerate when old or out of bounds
      const isOutOfBounds =
        grain.x < -grain.size ||
        grain.x > canvasSize.current.w + grain.size ||
        grain.y < -grain.size ||
        grain.y > canvasSize.current.h + grain.size;

      const isExpired = grain.age > grain.maxAge;

      if (isOutOfBounds || isExpired) {
        // Replace with new grain - reset position and properties
        const newGrain = grainParams();
        circles.current[i] = newGrain;
        drawGrain(newGrain);
      } else {
        drawGrain(
          {
            ...grain,
            x: grain.x,
            y: grain.y,
            translateX: grain.translateX,
            translateY: grain.translateY,
            alpha: grain.alpha,
            brightness: grain.brightness,
            age: grain.age,
          },
          true
        );
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};
