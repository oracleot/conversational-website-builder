'use client';

/**
 * Variant Carousel - Browse and switch between section design variants
 * 
 * Displays all available variants with match scores and allows instant switching.
 * Shows AI reasoning for the recommended variant.
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSiteStore } from '@/lib/stores/site-store';
import type { SectionType } from '@/lib/db/types';

interface VariantOption {
  variant: number;
  matchScore: number;
  description: string;
  traits: string[];
  bestFor: string[];
  isRecommended: boolean;
  isCurrent: boolean;
}

interface VariantCarouselProps {
  sectionId: string;
  sectionType: SectionType;
  currentVariant: number;
  variants: VariantOption[];
  reasoning?: string;
  onVariantSelect: (variant: number) => void;
  onClose: () => void;
  isLoading?: boolean;
  className?: string;
}

export function VariantCarousel({
  sectionId,
  sectionType,
  currentVariant,
  variants,
  reasoning,
  onVariantSelect,
  onClose,
  isLoading = false,
  className,
}: VariantCarouselProps) {
  const [selectedVariant, setSelectedVariant] = useState(currentVariant);
  const [isAnimating, setIsAnimating] = useState(false);
  const updateSectionVariant = useSiteStore((s) => s.updateSectionVariant);

  useEffect(() => {
    setSelectedVariant(currentVariant);
  }, [currentVariant]);

  // Handle variant selection with animation
  const handleSelect = useCallback(
    async (variant: number) => {
      if (variant === selectedVariant || isAnimating) return;

      setIsAnimating(true);
      setSelectedVariant(variant);

      // Update local store immediately for instant preview
      updateSectionVariant(sectionId, variant);

      // Notify parent
      onVariantSelect(variant);

      // Allow animation to complete
      setTimeout(() => setIsAnimating(false), 300);
    },
    [selectedVariant, isAnimating, sectionId, updateSectionVariant, onVariantSelect]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = variants.findIndex(v => v.variant === selectedVariant);
        if (currentIndex > 0) {
          handleSelect(variants[currentIndex - 1].variant);
        }
      } else if (e.key === 'ArrowRight') {
        const currentIndex = variants.findIndex(v => v.variant === selectedVariant);
        if (currentIndex < variants.length - 1) {
          handleSelect(variants[currentIndex + 1].variant);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [variants, selectedVariant, handleSelect, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700',
        'p-4 min-w-[340px] max-w-[500px]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
            {sectionType} Variants
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose a design style for this section
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
          aria-label="Close variant selector"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Button>
      </div>

      {/* AI Reasoning */}
      {reasoning && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-0.5">
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
            <p className="text-xs text-blue-700 dark:text-blue-300">{reasoning}</p>
          </div>
        </div>
      )}

      {/* Variant Options */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {variants.map((variant) => (
            <VariantOptionCard
              key={variant.variant}
              variant={variant}
              isSelected={selectedVariant === variant.variant}
              onSelect={() => handleSelect(variant.variant)}
              isLoading={isLoading && selectedVariant === variant.variant}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Use ← → arrow keys to browse • Press Esc to close
        </p>
      </div>
    </motion.div>
  );
}

interface VariantOptionCardProps {
  variant: VariantOption;
  isSelected: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}

function VariantOptionCard({
  variant,
  isSelected,
  onSelect,
  isLoading,
}: VariantOptionCardProps) {
  return (
    <motion.button
      layout
      onClick={onSelect}
      disabled={isLoading}
      className={cn(
        'w-full p-3 rounded-lg border-2 text-left transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
        isLoading && 'opacity-70 cursor-wait'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Variant title with badges */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Variant {variant.variant}
            </span>
            {variant.isRecommended && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded">
                AI Pick
              </span>
            )}
            {isSelected && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 rounded">
                Selected
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
            {variant.description}
          </p>

          {/* Traits */}
          <div className="flex flex-wrap gap-1">
            {variant.traits.slice(0, 3).map((trait) => (
              <span
                key={trait}
                className="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Match Score */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
              variant.matchScore >= 70
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                : variant.matchScore >= 40
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            )}
          >
            {variant.matchScore}%
          </div>
          <span className="text-[10px] text-gray-500 mt-1">match</span>
        </div>
      </div>
    </motion.button>
  );
}

/**
 * Hook to fetch variant options from the API
 */
export function useVariantOptions(siteId: string | null, sectionType: SectionType) {
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const [reasoning, setReasoning] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariants = useCallback(async () => {
    if (!siteId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/site/${siteId}/variant?sectionType=${sectionType}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch variants');
      }

      const data = await response.json();
      setVariants(data.variants || []);

      // Get reasoning from recommendations endpoint
      const recResponse = await fetch(`/api/site/${siteId}/variant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionType }),
      });

      if (recResponse.ok) {
        const recData = await recResponse.json();
        setReasoning(recData.recommendation?.reasoning);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load variants');
    } finally {
      setIsLoading(false);
    }
  }, [siteId, sectionType]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  return { variants, reasoning, isLoading, error, refetch: fetchVariants };
}

/**
 * Hook to switch variants via API
 */
export function useVariantSwitch(siteId: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchVariant = useCallback(
    async (sectionId: string, sectionType: string, newVariant: number) => {
      if (!siteId) return null;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/site/${siteId}/variant`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sectionId,
            sectionType,
            newVariant,
            isOverride: true,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to switch variant');
        }

        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to switch variant');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [siteId]
  );

  return { switchVariant, isLoading, error };
}

export default VariantCarousel;
