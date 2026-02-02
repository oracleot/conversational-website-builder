'use client';

/**
 * Service Hero 3 - Bold Variant
 * High-impact, striking with strong typography and contrast
 * Best for: Creative agencies, marketing, media
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { HeroSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 3,
  personality: 'bold',
  description: 'High-impact design with strong typography, dramatic colors, and striking contrast',
  bestFor: ['creative', 'marketing', 'media', 'entertainment', 'sports'],
};

export function ServiceHero3({ content, className, id }: HeroSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative min-h-screen flex items-center overflow-hidden',
        'bg-black',
        className
      )}
    >
      {/* Bold diagonal stripe */}
      <div className="absolute inset-0">
        <div className="absolute -inset-x-20 top-1/4 h-96 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 -skew-y-12 opacity-90" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl">
          {/* Animated headline */}
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white leading-[0.85] tracking-tighter mb-8 uppercase"
            style={{ fontFamily: '"Impact", "Haettenschweiler", sans-serif' }}
          >
            {content.headline.split(' ').map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="inline-block mr-4"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheadline with accent border */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative pl-6 border-l-4 border-white mb-12 max-w-xl"
          >
            <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed">
              {content.subheadline}
            </p>
          </motion.div>

          {/* CTAs */}
          {content.cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                asChild
                size="lg"
                className="h-16 px-10 text-lg font-black uppercase tracking-wider bg-white text-black hover:bg-orange-500 hover:text-white rounded-none transition-all duration-300 hover:scale-105"
              >
                <a href={content.cta.primaryAction}>
                  {content.cta.primary}
                </a>
              </Button>
              
              {content.cta.secondary && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-16 px-10 text-lg font-black uppercase tracking-wider border-2 border-white text-white hover:bg-white hover:text-black rounded-none transition-all duration-300 hover:scale-105"
                >
                  <a href={content.cta.secondaryAction}>
                    {content.cta.secondary}
                  </a>
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 right-8 w-24 h-24 border-t-4 border-r-4 border-white/20" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b-4 border-l-4 border-white/20" />
    </section>
  );
}

export default ServiceHero3;
