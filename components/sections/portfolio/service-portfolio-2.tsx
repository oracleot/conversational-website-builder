'use client';

/**
 * Service Portfolio 2 - Modern Variant
 * Dark theme with glassmorphism overlays
 * Best for: Tech startups, SaaS, digital agencies
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PortfolioSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 2,
  personality: 'modern',
  description: 'Dark theme with glassmorphism overlays and gradient accents',
  bestFor: ['tech', 'saas', 'startup', 'digital', 'innovation'],
};

export function ServicePortfolio2({ content, className, id }: PortfolioSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative overflow-hidden',
        'bg-[#0a0a0f]',
        className
      )}
    >
      {/* Background */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-violet-600 rounded-full blur-[200px] opacity-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-[200px] opacity-10" />

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
            Featured Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            {content.sectionTitle}
          </h2>
        </motion.div>

        {/* Bento grid layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          {content.projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'group relative rounded-2xl overflow-hidden',
                index === 0 && 'lg:col-span-2 lg:row-span-2',
              )}
            >
              {/* Background */}
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-cyan-500/20" />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                {project.category && (
                  <span className="inline-flex self-start px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/10 text-white/80 text-xs rounded-full mb-3">
                    {project.category}
                  </span>
                )}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-white/60 text-sm line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* View button on hover */}
                <div className="mt-4 flex items-center gap-2 text-cyan-400 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-sm font-medium">View Project</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default ServicePortfolio2;
