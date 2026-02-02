'use client';

/**
 * Section Wrapper - Animated container for section transitions
 * With variant selection UI overlay on hover
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import type { SectionType } from '@/lib/db/types';
import { VariantCarousel, useVariantOptions, useVariantSwitch } from './variant-carousel';
import { Button } from '@/components/ui/button';

interface SectionWrapperProps {
  children: ReactNode;
  id: string;
  sectionType?: SectionType;
  siteId?: string | null;
  currentVariant?: number;
  aiReasoning?: string;
  className?: string;
  animationVariant?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'none';
  delay?: number;
  isActive?: boolean;
  isEditable?: boolean;
  onVariantChange?: (variant: number) => void;
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
  sectionType,
  siteId,
  currentVariant = 1,
  aiReasoning,
  className,
  animationVariant = 'slide-up',
  delay = 0,
  isActive = true,
  isEditable = false,
  onVariantChange,
}: SectionWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);

  // Fetch variant options when carousel is shown
  const { variants, reasoning, isLoading: variantsLoading } = useVariantOptions(
    showCarousel && siteId ? siteId : null,
    sectionType || 'hero'
  );

  // Variant switch API
  const { switchVariant, isLoading: switchLoading } = useVariantSwitch(siteId || null);

  // Handle variant selection
  const handleVariantSelect = useCallback(
    async (variant: number) => {
      if (sectionType && siteId) {
        await switchVariant(id, sectionType, variant);
      }
      onVariantChange?.(variant);
    },
    [id, sectionType, siteId, switchVariant, onVariantChange]
  );

  // No animation variant
  if (animationVariant === 'none') {
    return (
      <div
        id={id}
        className={cn('relative', className)}
        onMouseEnter={() => isEditable && setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!showCarousel) setShowCarousel(false);
        }}
      >
        {isEditable && (
          <SectionOverlay
            isHovered={isHovered}
            showCarousel={showCarousel}
            sectionType={sectionType}
            currentVariant={currentVariant}
            aiReasoning={aiReasoning || reasoning}
            variants={variants}
            isLoading={variantsLoading || switchLoading}
            onShowCarousel={() => setShowCarousel(true)}
            onCloseCarousel={() => setShowCarousel(false)}
            onVariantSelect={handleVariantSelect}
          />
        )}
        {children}
      </div>
    );
  }

  const variants_anim = variantMap[animationVariant] || fadeVariants;

  return (
    <motion.div
      id={id}
      className={cn('relative', className)}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants_anim}
      transition={{ delay }}
      onMouseEnter={() => isEditable && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!showCarousel) setShowCarousel(false);
      }}
    >
      {/* Editable overlay */}
      {isEditable && (
        <SectionOverlay
          isHovered={isHovered}
          showCarousel={showCarousel}
          sectionType={sectionType}
          currentVariant={currentVariant}
          aiReasoning={aiReasoning || reasoning}
          variants={variants}
          isLoading={variantsLoading || switchLoading}
          onShowCarousel={() => setShowCarousel(true)}
          onCloseCarousel={() => setShowCarousel(false)}
          onVariantSelect={handleVariantSelect}
        />
      )}

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

/**
 * Section overlay with variant selector trigger and AI reasoning badge
 */
interface SectionOverlayProps {
  isHovered: boolean;
  showCarousel: boolean;
  sectionType?: SectionType;
  currentVariant: number;
  aiReasoning?: string;
  variants: Array<{
    variant: number;
    matchScore: number;
    description: string;
    traits: string[];
    bestFor: string[];
    isRecommended: boolean;
    isCurrent: boolean;
  }>;
  isLoading: boolean;
  onShowCarousel: () => void;
  onCloseCarousel: () => void;
  onVariantSelect: (variant: number) => void;
}

function SectionOverlay({
  isHovered,
  showCarousel,
  sectionType,
  currentVariant,
  aiReasoning,
  variants,
  isLoading,
  onShowCarousel,
  onCloseCarousel,
  onVariantSelect,
}: SectionOverlayProps) {
  const currentVariantInfo = variants.find(v => v.variant === currentVariant);

  return (
    <>
      {/* Hover overlay with controls */}
      <AnimatePresence>
        {(isHovered || showCarousel) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            {/* Top-right controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-auto">
              {/* AI Reasoning Badge */}
              {aiReasoning && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  {/* AI Icon */}
                  <span className="text-blue-600 dark:text-blue-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-200 max-w-[180px] truncate">
                    {currentVariantInfo?.description || `Variant ${currentVariant}`}
                  </span>
                </motion.div>
              )}

              {/* See Other Options Button */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onShowCarousel}
                  className="h-8 px-3 text-xs font-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1.5"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  See other options
                </Button>
              </motion.div>
            </div>

            {/* Hover border indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 border-2 border-blue-500/30 rounded-lg pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variant Carousel Popover */}
      <AnimatePresence>
        {showCarousel && sectionType && (
          <div className="absolute top-4 right-4 z-50">
            <VariantCarousel
              sectionId={sectionType}
              sectionType={sectionType}
              currentVariant={currentVariant}
              variants={variants}
              reasoning={aiReasoning}
              onVariantSelect={onVariantSelect}
              onClose={onCloseCarousel}
              isLoading={isLoading}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SectionWrapper;
