'use client';

/**
 * Service Hero 2 - Modern Variant
 * Cutting-edge, tech-forward with dynamic gradients
 * Best for: Tech startups, SaaS, digital agencies
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { HeroSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 2,
  personality: 'modern',
  description: 'Cutting-edge tech aesthetic with dynamic gradients and glassmorphism',
  bestFor: ['tech', 'saas', 'startup', 'digital', 'innovation'],
};

export function ServiceHero2({ content, className, id }: HeroSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative min-h-screen flex items-center overflow-hidden',
        'bg-[#0a0a0f]',
        className
      )}
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-[128px] opacity-30"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-[128px] opacity-20"
        />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex mb-8"
          >
            <span className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/90 bg-white/5 backdrop-blur-xl border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Now Available
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/20 to-cyan-500/20 blur-xl" />
            </span>
          </motion.div>

          {/* Headline with gradient text */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">
              {content.headline}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {content.subheadline}
          </motion.p>

          {/* CTAs */}
          {content.cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 border-0"
              >
                <a href={content.cta.primaryAction}>
                  {content.cta.primary}
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </Button>
              
              {content.cta.secondary && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-semibold bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <a href={content.cta.secondaryAction}>
                    {content.cta.secondary}
                  </a>
                </Button>
              )}
            </motion.div>
          )}

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-16 text-sm text-white/40"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No setup required
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Enterprise-grade
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              24/7 Support
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ServiceHero2;
