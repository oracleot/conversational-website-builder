/**
 * Animation Utilities - Shared animation variants and helpers
 */

import { type Variants, type Transition } from 'framer-motion';

// Standard easing curves
export const EASINGS = {
  easeOut: [0.16, 1, 0.3, 1],
  easeIn: [0.4, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: { type: 'spring', stiffness: 300, damping: 30 },
} as const;

// Standard durations
export const DURATIONS = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 0.8,
} as const;

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut }
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut }
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut }
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut }
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut }
  },
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut }
  },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { ...EASINGS.spring }
  },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Stagger item
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOut }
  },
};

// Card hover animations
export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeOut }
  },
};

export const cardHoverSubtle: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.01,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeOut }
  },
};

// Button animations
export const buttonTap = {
  scale: 0.98,
  transition: { duration: DURATIONS.fast }
};

export const buttonHover = {
  scale: 1.02,
  transition: { duration: DURATIONS.fast }
};

// Slide animations
export const slideInFromLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: DURATIONS.slow, ease: EASINGS.easeOut }
  },
  exit: { x: '-100%', opacity: 0 }
};

export const slideInFromRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: DURATIONS.slow, ease: EASINGS.easeOut }
  },
  exit: { x: '100%', opacity: 0 }
};

export const slideInFromTop: Variants = {
  hidden: { y: '-100%', opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: DURATIONS.slow, ease: EASINGS.easeOut }
  },
  exit: { y: '-100%', opacity: 0 }
};

export const slideInFromBottom: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: DURATIONS.slow, ease: EASINGS.easeOut }
  },
  exit: { y: '100%', opacity: 0 }
};

// Viewport animation settings
export const viewportOnce = {
  once: true,
  margin: '-100px',
};

export const viewportRepeat = {
  once: false,
  margin: '-100px',
  amount: 0.3,
};

// Create stagger delay for index
export function staggerDelay(index: number, baseDelay = 0.1): number {
  return index * baseDelay;
}

// Create custom transition
export function createTransition(
  duration = DURATIONS.normal,
  ease = EASINGS.easeOut,
  delay = 0
): Transition {
  return { duration, ease, delay };
}

// Personality-based animation intensity
export const PERSONALITY_ANIMATION_INTENSITY = {
  professional: {
    duration: DURATIONS.normal,
    stagger: 0.1,
    scale: 1.01,
    y: 10,
  },
  modern: {
    duration: DURATIONS.fast,
    stagger: 0.08,
    scale: 1.02,
    y: 15,
  },
  bold: {
    duration: DURATIONS.slow,
    stagger: 0.12,
    scale: 1.03,
    y: 25,
  },
  elegant: {
    duration: DURATIONS.slow,
    stagger: 0.15,
    scale: 1.01,
    y: 15,
  },
  friendly: {
    duration: DURATIONS.normal,
    stagger: 0.1,
    scale: 1.02,
    y: 20,
  },
} as const;

export type PersonalityType = keyof typeof PERSONALITY_ANIMATION_INTENSITY;
