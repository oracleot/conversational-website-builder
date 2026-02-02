'use client';

/**
 * Service Portfolio 5 - Friendly Variant
 * Warm, approachable project cards
 * Best for: Healthcare, education, community services
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PortfolioSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 5,
  personality: 'friendly',
  description: 'Warm, approachable project cards with rounded corners and playful styling',
  bestFor: ['healthcare', 'education', 'nonprofit', 'community', 'therapy'],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 100, damping: 15 } 
  },
};

const PROJECT_EMOJIS = ['🎯', '🌟', '💡', '🚀', '✨', '🎨'];

export function ServicePortfolio5({ content, className, id }: PortfolioSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative overflow-hidden',
        'bg-gradient-to-b from-white to-orange-50/50',
        className
      )}
    >
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-rose-200 rounded-full blur-[120px] opacity-30" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-200 rounded-full blur-[120px] opacity-30" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="text-5xl mb-4 block">🏆</span>
          <h2 
            className="text-3xl md:text-4xl font-bold text-gray-800"
            style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}
          >
            {content.sectionTitle}
          </h2>
          {content.sectionDescription && (
            <p className="mt-4 text-lg text-gray-600">
              {content.sectionDescription}
            </p>
          )}
        </motion.div>

        {/* Projects grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {content.projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center">
                    <span className="text-5xl">{PROJECT_EMOJIS[index % PROJECT_EMOJIS.length]}</span>
                  </div>
                )}
                
                {project.category && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-full shadow-sm">
                    {project.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 
                  className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors"
                  style={{ fontFamily: '"Nunito", sans-serif' }}
                >
                  {project.title}
                </h3>
                {project.description && (
                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                    {project.description}
                  </p>
                )}
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-500 text-sm font-medium">
                    View details
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  {project.results && (
                    <span className="text-xs text-gray-400">{project.results}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ServicePortfolio5;
