'use client';

/**
 * Service Portfolio 3 - Bold Variant
 * Full-width projects with dramatic overlays
 * Best for: Creative agencies, marketing, media
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PortfolioSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 3,
  personality: 'bold',
  description: 'Full-width projects with dramatic overlays and strong typography',
  bestFor: ['creative', 'marketing', 'media', 'entertainment', 'sports'],
};

export function ServicePortfolio3({ content, className, id }: PortfolioSectionProps) {
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
          <span className="text-red-500 font-black uppercase tracking-[0.3em] text-sm">Portfolio</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mt-4">
            {content.sectionTitle}
          </h2>
          <div className="mt-4 w-24 h-1 bg-red-500" />
        </motion.div>
      </div>

      {/* Full-width projects */}
      <div className="space-y-1">
        {content.projects.slice(0, 4).map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative h-[50vh] md:h-[60vh] overflow-hidden cursor-pointer"
          >
            {/* Background */}
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/50 to-black" />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300" />
            
            {/* Content */}
            <div className="absolute inset-0 container mx-auto px-6 lg:px-12 flex items-center">
              <div className="max-w-2xl">
                {/* Number */}
                <span className="text-8xl font-black text-white/10 group-hover:text-red-500/30 transition-colors duration-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mt-4 group-hover:text-red-400 transition-colors duration-300">
                  {project.title}
                </h3>
                
                {project.description && (
                  <p className="mt-4 text-white/70 text-lg max-w-md translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {project.description}
                  </p>
                )}

                {project.category && (
                  <span className="inline-block mt-6 px-4 py-2 border border-white/30 text-white/70 uppercase tracking-wider text-xs font-bold">
                    {project.category}
                  </span>
                )}
              </div>

              {/* Arrow */}
              <div className="absolute right-12 top-1/2 -translate-y-1/2 w-16 h-16 bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-8 group-hover:translate-x-0 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ServicePortfolio3;
