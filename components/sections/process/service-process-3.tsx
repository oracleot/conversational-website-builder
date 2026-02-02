'use client';

/**
 * Service Process 3 - Bold Variant
 * Large numbered steps with dramatic typography
 * Best for: Creative agencies, marketing, media
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProcessSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 3,
  personality: 'bold',
  description: 'Large numbered steps with dramatic typography and high contrast',
  bestFor: ['creative', 'marketing', 'media', 'entertainment', 'sports'],
};

export function ServiceProcess3({ content, className, id }: ProcessSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32',
        'bg-black',
        className
      )}
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="text-red-500 font-black uppercase tracking-[0.3em] text-sm">Process</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mt-4">
            {content.sectionTitle}
          </h2>
          <div className="mt-4 w-24 h-1 bg-red-500" />
        </motion.div>

        {/* Steps */}
        <div className="space-y-0">
          {content.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative border-t border-white/10 py-12 hover:bg-white/5 transition-colors duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* Large number */}
                <div className="lg:w-1/4">
                  <span className="text-8xl md:text-9xl font-black text-white/5 group-hover:text-red-500/20 transition-colors duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="lg:w-3/4 flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-red-400 transition-colors duration-300 uppercase tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-white/60 text-lg max-w-xl leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {step.duration && (
                    <div className="px-4 py-2 border border-white/20 text-white/50 uppercase tracking-wider text-xs font-bold flex-shrink-0">
                      {step.duration}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow on hover */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-red-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceProcess3;
