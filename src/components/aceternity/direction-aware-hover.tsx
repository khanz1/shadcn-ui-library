"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

export const DirectionAwareHover = ({
  imageUrl,
  children,
  childrenClassName,
  imageClassName,
  className,
}: {
  imageUrl: string;
  children: React.ReactNode | string;
  childrenClassName?: string;
  imageClassName?: string;
  className?: string;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [direction, setDirection] = React.useState<
    "top" | "bottom" | "left" | "right" | string
  >("left");

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!ref.current) return;

    const currentDirection = getDirection(event, ref.current);
    console.log("direction", currentDirection);
    switch (currentDirection) {
      case 0:
        setDirection("top");

        break;
      case 1:
        setDirection("right");

        break;
      case 2:
        setDirection("bottom");

        break;
      case 3:
        setDirection("left");

        break;
      default:
        setDirection("left");

        break;
    }
  };

  const getDirection = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    obj: HTMLElement
  ) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;

    return d;
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      ref={ref}
      className={cn(
        "md:h-96 w-60  bg-transparent rounded-lg overflow-hidden group/card relative",
        className
      )}
    >
      <motion.div
        className={cn(
          "group-hover/card:block hidden absolute inset-0 w-full h-full bg-black/40 z-10 transition duration-500",
          childrenClassName
        )}
        initial="initial"
        whileHover={direction}
        exit="exit"
      >
        <motion.div className="h-full w-full flex justify-center items-center">
          {children}
        </motion.div>
      </motion.div>

      <motion.img
        alt="image"
        className={cn("h-96 w-full object-cover scale-[1.15]", imageClassName)}
        width="1000"
        height="1000"
        src={imageUrl}
      />
    </motion.div>
  );
};

const variants = {
  initial: {
    x: 0,
  },

  exit: {
    x: 0,
    y: 0,
  },
  top: {
    y: 20,
  },
  bottom: {
    y: -20,
  },
  left: {
    x: 20,
  },
  right: {
    x: -20,
  },
};

const textVariants = {
  initial: {
    y: 0,
    x: 0,
    opacity: 0,
  },
  exit: {
    y: 0,
    x: 0,
    opacity: 0,
  },
  top: {
    y: -20,
    opacity: 1,
  },
  bottom: {
    y: 2,
    opacity: 1,
  },
  left: {
    x: -2,
    opacity: 1,
  },
  right: {
    x: 20,
    opacity: 1,
  },
};
