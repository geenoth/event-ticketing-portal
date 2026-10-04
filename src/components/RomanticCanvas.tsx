import React, { useEffect, useRef } from 'react';

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  baseOpacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  hue: number;
  swaySpeed: number;
  swayPhase: number;
}

interface RomanticCanvasProps {
  isCelebrating: boolean;
}

export const RomanticCanvas: React.FC<RomanticCanvasProps> = ({ isCelebrating }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: HeartParticle[] = [];
    const count = isCelebrating ? 55 : 30;

    // All shapes are floating glowing romantic hearts as requested
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 10, // Heart size between 10 and 22
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -(Math.random() * 0.45 + 0.25), // gentle upward float
        rotation: (Math.random() - 0.5) * 0.3,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        opacity: Math.random() * 0.3 + 0.15,
        baseOpacity: Math.random() * 0.25 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.015 + 0.008,
        swayPhase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.4 ? Math.random() * 18 + 342 : Math.random() * 12 + 355, // Rose & pink hues
      });
    }

    const drawHeartShape = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number,
      hue: number,
      rotation: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      const scale = size / 16;
      c.scale(scale, scale);

      c.beginPath();
      // Draw smooth romantic heart path
      c.moveTo(0, 3);
      c.bezierCurveTo(-6, -7, -13, -7, -13, 1);
      c.bezierCurveTo(-13, 8, -4, 13, 0, 17);
      c.bezierCurveTo(4, 13, 13, 8, 13, 1);
      c.bezierCurveTo(13, -7, 6, -7, 0, 3);
      c.closePath();

      c.fillStyle = `hsla(${hue}, 88%, 68%, ${opacity})`;
      c.shadowColor = `hsla(${hue}, 92%, 65%, ${opacity * 0.6})`;
      c.shadowBlur = 8;
      c.fill();

      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.swayPhase += p.swaySpeed;
        p.pulsePhase += p.pulseSpeed;
        p.rotation += p.rotSpeed;

        p.x += p.speedX + Math.sin(p.swayPhase) * 0.4;
        p.y += p.speedY;
        p.opacity = p.baseOpacity + Math.sin(p.pulsePhase) * 0.08;

        // Wrap around seamlessly
        if (p.y < -30) {
          p.y = height + 25;
          p.x = Math.random() * width;
        }
        if (p.x > width + 30) p.x = -20;
        if (p.x < -30) p.x = width + 20;

        drawHeartShape(ctx, p.x, p.y, p.size, Math.max(0.05, p.opacity), p.hue, p.rotation);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isCelebrating]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
