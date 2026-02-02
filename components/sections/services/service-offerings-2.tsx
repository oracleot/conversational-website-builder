'use client';

/**
 * Service Offerings 2 - Modern Variant
 * Glassmorphism cards with gradient borders
 * Best for: Tech startups, SaaS, digital agencies
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ServicesSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 2,
  personality: 'modern',
  description: 'Glassmorphism cards with gradient borders and dynamic hover effects',
  bestFor: ['tech', 'saas', 'startup', 'digital', 'innovation'],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export function ServiceOfferings2({ content, className, id }: ServicesSectionProps) {
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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[160px] opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[160px] opacity-15" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 text-sm rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            What we offer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {content.sectionTitle}
          </h2>
          {content.sectionDescription && (
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              {content.sectionDescription}
            </p>
          )}
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {content.services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Gradient border effect */}
              <div className="absolute -inset-px bg-gradient-to-r from-violet-600 via-cyan-500 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="absolute -inset-px bg-gradient-to-r from-violet-600 via-cyan-500 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              
              <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 group-hover:bg-white/10 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                {service.features && (
                  <ul className="space-y-2">
                    {service.features.slice(0, 3).map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm text-white/50">
                        <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Arrow indicator */}
                <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-cyan-400 group-hover:bg-white/10 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ServiceOfferings2;
