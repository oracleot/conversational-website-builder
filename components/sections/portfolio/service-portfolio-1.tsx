'use client';

/**
 * Service Portfolio 1 - Professional Variant
 * Clean grid with project cards and filters
 * Best for: Law firms, consulting, enterprise services
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PortfolioSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 1,
  personality: 'professional',
  description: 'Clean grid with project cards, filters, and subtle hover effects',
  bestFor: ['law', 'consulting', 'enterprise', 'finance', 'corporate'],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ServicePortfolio1({ content, className, id }: PortfolioSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32',
        'bg-white',
        className
      )}
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
            Our Work
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            {content.sectionTitle}
          </h2>
          {content.sectionDescription && (
            <p className="mt-4 text-lg text-slate-600">
              {content.sectionDescription}
            </p>
          )}
        </motion.div>

        {/* Portfolio grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {content.projects.map((project, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="group"
            >
              <div className="relative aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden mb-4">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-100">
                    <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-blue-600/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium flex items-center gap-2">
                    View Project
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              {project.description && (
                <p className="mt-2 text-slate-600 text-sm line-clamp-2">
                  {project.description}
                </p>
              )}
              {project.category && (
                <span className="inline-block mt-3 text-xs text-slate-500 uppercase tracking-wider">
                  {project.category}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ServicePortfolio1;
