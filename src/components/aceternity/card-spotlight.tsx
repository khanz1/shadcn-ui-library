"use client";

import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "#262626",
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const { currentTarget, clientX, clientY } = event;
      const rect = currentTarget.getBoundingClientRect();

      const { left, top } = rect;
      const x = clientX - left;
      const y = clientY - top;

      setMousePosition({ x, y });
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className={cn(
        "relative rounded-md border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute z-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-xl transition duration-300 group-hover:opacity-90"
          style={{
            background: `radial-gradient(${radius}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${color}, transparent 40%)`,
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        />
      )}
      {children}
    </div>
  );
};
