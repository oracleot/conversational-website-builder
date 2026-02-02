'use client';

/**
 * Service Process 4 - Elegant Variant
 * Refined timeline with sophisticated typography
 * Best for: Luxury brands, high-end services, boutiques
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProcessSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 4,
  personality: 'elegant',
  description: 'Refined timeline with sophisticated typography and muted tones',
  bestFor: ['luxury', 'boutique', 'hospitality', 'fashion', 'jewelry'],
};

export function ServiceProcess4({ content, className, id }: ProcessSectionProps) {
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
          {content.sectionDescription && (
            <p 
              className="mt-6 text-lg text-[#6b6560] max-w-xl mx-auto"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {content.sectionDescription}
            </p>
          )}
        </motion.div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto">
          {content.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative flex gap-12"
            >
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-16 h-16 border border-[#c9c5bf] flex items-center justify-center text-[#2c2825] text-xl"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
                {index < content.steps.length - 1 && (
                  <div className="w-px flex-1 bg-[#e0dcd5] my-4 min-h-[60px]" />
                )}
              </div>

              {/* Content */}
              <div className={cn(
                'flex-1 pb-8',
                index === content.steps.length - 1 && 'pb-0'
              )}>
                <h3 
                  className="text-2xl text-[#2c2825] font-light mb-3"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {step.title}
                </h3>
                <p 
                  className="text-[#6b6560] leading-relaxed"
                  style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem' }}
                >
                  {step.description}
                </p>
                {step.duration && (
                  <p className="mt-4 text-sm text-[#8a857f] uppercase tracking-[0.1em]">
                    Duration: {step.duration}
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

export default ServiceProcess4;
