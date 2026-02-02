'use client';

/**
 * Service Offerings 3 - Bold Variant
 * High contrast with striking layouts
 * Best for: Creative agencies, marketing, media
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ServicesSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 3,
  personality: 'bold',
  description: 'High contrast design with striking layouts and dramatic typography',
  bestFor: ['creative', 'marketing', 'media', 'entertainment', 'sports'],
};

export function ServiceOfferings3({ content, className, id }: ServicesSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative',
        'bg-black',
        className
      )}
    >
      {/* Red diagonal accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-600/20 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="inline-block text-red-500 font-black uppercase tracking-[0.3em] text-sm mb-4">
            Services
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight">
            {content.sectionTitle}
          </h2>
          <div className="mt-4 w-24 h-1 bg-red-500" />
        </motion.div>

        {/* Services list */}
        <div className="space-y-0 border-t border-white/10">
          {content.services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group py-10 border-b border-white/10 hover:bg-white/5 transition-colors duration-300"
            >
              <div className="flex items-start gap-8">
                {/* Number */}
                <span className="text-6xl md:text-8xl font-black text-white/10 group-hover:text-red-500/50 transition-colors duration-300">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Content */}
                <div className="flex-1 pt-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
                    {service.description}
                  </p>
                  
                  {service.features && (
                    <div className="flex flex-wrap gap-3 mt-6">
                      {service.features.map((feature, fIndex) => (
                        <span
                          key={fIndex}
                          className="px-4 py-2 bg-white/5 text-white/70 text-sm font-medium border border-white/10"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="hidden lg:flex items-center pt-4">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:bg-red-500 group-hover:border-red-500 transition-all duration-300">
                    <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceOfferings3;
