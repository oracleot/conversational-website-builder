'use client';

/**
 * Service Hero 4 - Elegant Variant
 * Luxury, refined aesthetic with sophisticated typography
 * Best for: Luxury brands, high-end services, boutiques
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { HeroSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 4,
  personality: 'elegant',
  description: 'Sophisticated luxury aesthetic with refined typography and muted tones',
  bestFor: ['luxury', 'boutique', 'hospitality', 'fashion', 'jewelry'],
};

export function ServiceHero4({ content, className, id }: HeroSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative min-h-screen flex items-center',
        'bg-[#f8f6f3]',
        className
      )}
    >
      {/* Subtle texture */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9c5bf' fill-opacity='0.15'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            {/* Elegant divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-px bg-[#b8a898] mb-10 origin-left"
            />

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-[#2c2825] leading-[1.2] tracking-tight mb-8"
              style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
            >
              {content.headline}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-[#6b6560] max-w-md mb-12 leading-relaxed tracking-wide"
              style={{ fontFamily: '"Cormorant Garamond", "Times New Roman", serif' }}
            >
              {content.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-sm font-medium uppercase tracking-[0.2em] bg-[#2c2825] hover:bg-[#1a1816] text-white rounded-none transition-all duration-500 hover:tracking-[0.25em]"
              >
                <a href={content.cta.primaryAction}>
                  {content.cta.primary}
                </a>
              </Button>
              
              {content.cta.secondary && (
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="h-14 px-6 text-sm font-medium uppercase tracking-[0.2em] text-[#6b6560] hover:text-[#2c2825] rounded-none transition-all duration-500 underline underline-offset-8 decoration-1 hover:decoration-2"
                >
                  <a href={content.cta.secondaryAction}>
                    {content.cta.secondary}
                  </a>
                </Button>
              )}
            </motion.div>
          </div>

          {/* Decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-[#e8e4df] to-[#d4cfc8] rounded-sm overflow-hidden">
              <div className="absolute inset-8 border border-[#c9c5bf]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="text-8xl text-[#b8a898] opacity-30"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  ✦
                </span>
              </div>
            </div>
            {/* Floating accent */}
            <div className="absolute -top-8 -right-8 w-24 h-24 border border-[#c9c5bf]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ServiceHero4;
