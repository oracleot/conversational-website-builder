'use client';

/**
 * Section Wrapper - Animated container for section transitions
 */

import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  id: string;
  className?: string;
  animationVariant?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'none';
  delay?: number;
  isActive?: boolean;
}

// Animation variants for section transitions
const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } }
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
};

const variantMap: Record<string, Variants> = {
  'fade': fadeVariants,
  'slide-up': slideUpVariants,
  'slide-down': slideDownVariants,
  'scale': scaleVariants,
};

export function SectionWrapper({
  children,
  id,
  className,
  animationVariant = 'slide-up',
  delay = 0,
  isActive = true,
}: SectionWrapperProps) {
  // No animation
  if (animationVariant === 'none') {
    return (
      <div id={id} className={cn('relative', className)}>
        {children}
      </div>
    );
  }

  const variants = variantMap[animationVariant] || fadeVariants;

  return (
    <motion.div
      id={id}
      className={cn('relative', className)}
      initial="hidden"
      animate={isActive ? 'visible' : 'hidden'}
      exit="exit"
      variants={variants}
      transition={{ delay }}
    >
      {/* Optional highlight indicator for active section */}
      {isActive && (
        <motion.div
          className="absolute -left-1 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
        />
      )}
      {children}
    </motion.div>
  );
}

export default SectionWrapper;
