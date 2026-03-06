import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speedY: number;
  speedX: number;
  hue: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface AnimatedStarsBgProps {
  starCount?: number;
  className?: string;
}

export function AnimatedStarsBg({
  starCount = 80,
  className = "",
}: AnimatedStarsBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars();
    };

    const initStars = () => {
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        speedY: -(Math.random() * 0.18 + 0.04),
        speedX: (Math.random() - 0.5) * 0.08,
        // hue 120-220 = green to blue spectrum
        hue: Math.random() * 100 + 120,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        star.y += star.speedY;
        star.x += star.speedX;

        // Wrap around
        if (star.y < -4) star.y = canvas.height + 4;
        if (star.x < -4) star.x = canvas.width + 4;
        if (star.x > canvas.width + 4) star.x = -4;

        const twinkle =
          star.opacity +
          Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset) *
            0.25;
        const clampedOpacity = Math.max(0.05, Math.min(1, twinkle));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 90%, 75%, ${clampedOpacity})`;
        ctx.shadowColor = `hsla(${star.hue}, 100%, 80%, 0.8)`;
        ctx.shadowBlur = star.r * 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
