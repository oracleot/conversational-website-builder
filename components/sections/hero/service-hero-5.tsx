'use client';

/**
 * Service Hero 5 - Friendly Variant
 * Warm, approachable with soft colors and rounded shapes
 * Best for: Healthcare, education, community services
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { HeroSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 5,
  personality: 'friendly',
  description: 'Warm and approachable with soft colors, rounded shapes, and inviting design',
  bestFor: ['healthcare', 'education', 'nonprofit', 'community', 'therapy'],
};

export function ServiceHero5({ content, className, id }: HeroSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative min-h-[90vh] flex items-center overflow-hidden',
        'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50',
        className
      )}
    >
      {/* Organic blob shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/4 w-[900px] h-[900px] bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/3 -left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-rose-200/30 to-pink-200/30 rounded-[60%_40%_30%_70%/60%_30%_70%_40%]"
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Friendly wave emoji intro */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-block mb-6"
          >
            <span className="text-6xl">👋</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6"
            style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}
          >
            {content.headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {content.subheadline}
          </motion.p>

          {/* CTAs with playful styling */}
          {content.cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-full shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1"
              >
                <a href={content.cta.primaryAction} className="flex items-center gap-2">
                  {content.cta.primary}
                  <span className="text-lg">✨</span>
                </a>
              </Button>
              
              {content.cta.secondary && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-semibold border-2 border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600 rounded-full transition-all duration-300 hover:-translate-y-1"
                >
                  <a href={content.cta.secondaryAction}>
                    {content.cta.secondary}
                  </a>
                </Button>
              )}
            </motion.div>
          )}

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
                <span>⭐</span>
              </div>
              <span>5-star rated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
                <span>💚</span>
              </div>
              <span>Trusted by 10k+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
                <span>🤝</span>
              </div>
              <span>Free consultation</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ServiceHero5;
