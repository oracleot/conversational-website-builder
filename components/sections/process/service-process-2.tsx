'use client';

/**
 * Service Process 2 - Modern Variant
 * Horizontal timeline with glassmorphism cards
 * Best for: Tech startups, SaaS, digital agencies
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProcessSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 2,
  personality: 'modern',
  description: 'Horizontal timeline with glassmorphism cards and gradient accents',
  bestFor: ['tech', 'saas', 'startup', 'digital', 'innovation'],
};

export function ServiceProcess2({ content, className, id }: ProcessSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative overflow-hidden',
        'bg-[#0a0a0f]',
        className
      )}
    >
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[200px] opacity-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[200px] opacity-10" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 text-sm rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            Our Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            {content.sectionTitle}
          </h2>
          {content.sectionDescription && (
            <p className="mt-4 text-lg text-white/60">
              {content.sectionDescription}
            </p>
          )}
        </motion.div>

        {/* Process steps - horizontal on desktop */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Connection line */}
              {index < content.steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-cyan-500/50 to-transparent z-0" />
              )}

              <div className="relative h-full p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                {/* Step number */}
                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {step.description}
                </p>

                {step.duration && (
                  <div className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-400/80">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {step.duration}
                  </div>
                )}

                {/* Arrow indicator */}
                <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:text-cyan-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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

export default ServiceProcess2;
