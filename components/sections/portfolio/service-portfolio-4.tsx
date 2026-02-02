'use client';

/**
 * Service Portfolio 4 - Elegant Variant
 * Refined gallery with sophisticated presentation
 * Best for: Luxury brands, high-end services, boutiques
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PortfolioSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 4,
  personality: 'elegant',
  description: 'Refined gallery with sophisticated presentation and muted palette',
  bestFor: ['luxury', 'boutique', 'hospitality', 'fashion', 'jewelry'],
};

export function ServicePortfolio4({ content, className, id }: PortfolioSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32',
        'bg-[#f8f6f3]',
        className
      )}
    >
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-16 h-px bg-[#b8a898] mx-auto mb-8"
          />
          <h2 
            className="text-4xl md:text-5xl font-light text-[#2c2825] tracking-tight"
            style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            {content.sectionTitle}
          </h2>
        </motion.div>

        {/* Masonry-like grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {content.projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={cn(
                'group',
                index % 3 === 0 && 'md:col-span-2'
              )}
            >
              <div className={cn(
                'relative overflow-hidden',
                index % 3 === 0 ? 'aspect-[21/9]' : 'aspect-[4/5]'
              )}>
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[#e8e4df] flex items-center justify-center">
                    <span className="text-6xl text-[#c9c5bf]" style={{ fontFamily: '"Playfair Display", serif' }}>✦</span>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#2c2825]/0 group-hover:bg-[#2c2825]/70 transition-colors duration-500 flex items-center justify-center">
                  <div className="text-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <span 
                      className="text-2xl text-white"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      View
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 
                  className="text-xl text-[#2c2825]"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {project.title}
                </h3>
                {project.category && (
                  <p className="text-sm text-[#8a857f] uppercase tracking-[0.1em] mt-2">
                    {project.category}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicePortfolio4;
