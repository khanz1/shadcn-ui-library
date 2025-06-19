"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

interface ShootingStarsProps {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
}

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4);
  const offset = Math.random() * window.innerWidth;

  switch (side) {
    case 0:
      return { x: offset, y: 0, angle: 45 };
    case 1:
      return { x: window.innerWidth, y: offset, angle: 135 };
    case 2:
      return { x: offset, y: window.innerHeight, angle: 225 };
    case 3:
      return { x: 0, y: offset, angle: 315 };
    default:
      return { x: 0, y: 0, angle: 45 };
  }
};

interface StarProps {
  id: number;
  x: number;
  y: number;
  angle: number;
  prevAngle: number;
  speed: number;
  prevSpeed: number;
  size: number;
  prevSize: number;
  opacity: number;
  prevOpacity: number;
  hue: number;
  color: string;
  prevX: number;
  prevY: number;
}

const useShootingStars = () => {
  const [star, setStar] = useState<StarProps | null>(null);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const createStar = (): StarProps => {
      const canvas = document.querySelector("canvas");
      if (!canvas) return {} as StarProps;

      const { width, height } = canvas.getBoundingClientRect();
      const angleRAD = (Math.random() * 6.2831853071795865) | 0;
      const angle = (angleRAD * 180) / Math.PI;
      const speed = Math.random() * 6 + 3;
      const size = Math.random() * 3 + 1;
      const opacity = Math.random();
      const hue = Math.random() * 360;
      const starColor = `hsl(${hue}, 100%, 50%)`;

      return {
        id: Date.now(),
        x: Math.random() * width,
        y: Math.random() * height,
        angle,
        prevAngle: angle,
        speed,
        prevSpeed: speed,
        size,
        prevSize: size,
        opacity,
        prevOpacity: opacity,
        hue,
        color: starColor,
        prevX: 0,
        prevY: 0,
      };
    };

    const updateStar = (star: StarProps): StarProps => {
      const canvas = document.querySelector("canvas");
      if (!canvas) return star;

      const { width, height } = canvas.getBoundingClientRect();
      const newX = star.x + Math.cos((star.angle * Math.PI) / 180) * star.speed;
      const newY = star.y + Math.sin((star.angle * Math.PI) / 180) * star.speed;

      return {
        ...star,
        prevX: star.x,
        prevY: star.y,
        x: newX > width ? 0 : newX < 0 ? width : newX,
        y: newY > height ? 0 : newY < 0 ? height : newY,
      };
    };

    const tick = () => {
      if (Math.random() > 0.8) {
        setStar(createStar());
        setTrail([]);
      } else if (star) {
        const updatedStar = updateStar(star);
        setStar(updatedStar);
        setTrail((prevTrail) =>
          [...prevTrail, { x: updatedStar.prevX, y: updatedStar.prevY }].slice(
            -20
          )
        );
      }
    };

    intervalRef.current = setInterval(tick, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [star]);

  return { star, trail };
};

export const ShootingStars = ({
  className,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  minSpeed = 10,
  maxSpeed = 30,
  starWidth = 10,
  starHeight = 1,
  ...props
}: {
  className?: string;
  starColor?: string;
  trailColor?: string;
  minSpeed?: number;
  maxSpeed?: number;
  starWidth?: number;
  starHeight?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { star, trail } = useShootingStars();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail
      if (trail.length > 1) {
        ctx.strokeStyle = trailColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.stroke();
      }

      // Draw star
      if (star) {
        ctx.fillStyle = starColor;
        ctx.fillRect(star.x, star.y, starWidth, starHeight);
      }
    };

    const animationId = requestAnimationFrame(function animate() {
      drawFrame();
      requestAnimationFrame(animate);
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [star, trail, starColor, trailColor, starWidth, starHeight]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full", className)}
      {...props}
    />
  );
};

export const StarsBackground = ({
  className,
  ...props
}: {
  className?: string;
}) => {
  return (
    <div className={cn("absolute inset-0", className)} {...props}>
      <ShootingStars />
    </div>
  );
};
