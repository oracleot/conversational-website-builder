'use client';

/**
 * Service Hero 1 - Professional Variant
 * Clean, corporate aesthetic with structured layout
 * Best for: Law firms, consulting, enterprise services
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { HeroSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 1,
  personality: 'professional',
  description: 'Clean, corporate aesthetic with structured layout and subtle gradients',
  bestFor: ['law', 'consulting', 'enterprise', 'finance', 'corporate'],
};

export function ServiceHero1({ content, className, id }: HeroSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative min-h-[90vh] flex items-center',
        'bg-gradient-to-br from-slate-50 via-white to-blue-50',
        className
      )}
    >
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm font-medium tracking-wide">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Professional Services
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
          >
            {content.headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 max-w-2xl mb-10 leading-relaxed"
          >
            {content.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-base font-semibold bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg shadow-slate-900/10 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5"
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
                className="h-14 px-8 text-base font-semibold border-2 border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <a href={content.cta.secondaryAction}>
                  {content.cta.secondary}
                </a>
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 bg-gradient-to-l from-blue-100/50 to-transparent rounded-l-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </section>
  );
}

export default ServiceHero1;
