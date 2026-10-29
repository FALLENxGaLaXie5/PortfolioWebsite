import type { Transition, Variants } from "motion/react";

export type Direction = "left" | "right" | "up" | "down" | "";
export type TransitionType = Transition["type"] | "";

/** Shared easing: quick start, soft landing. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Small offsets keep reveals subtle and never push content off-screen. */
const OFFSET = 24;

export const textVariant = (delay?: number): Variants => ({
  hidden: { y: OFFSET / 2, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_OUT, delay },
  },
});

export const fadeIn = (
  direction: Direction,
  type: TransitionType,
  delay: number,
  duration: number,
): Variants => ({
  hidden: {
    x: direction === "left" ? OFFSET : direction === "right" ? -OFFSET : 0,
    y: direction === "up" ? OFFSET : direction === "down" ? -OFFSET : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type || undefined,
      delay,
      duration,
      ease: EASE_OUT,
    },
  },
});

export const staggerContainer = (
  staggerChildren?: number,
  delayChildren?: number,
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren: delayChildren ?? 0,
    },
  },
});

