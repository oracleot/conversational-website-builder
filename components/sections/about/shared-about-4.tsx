'use client';

/**
 * Shared About 4 - Elegant Variant
 * Refined luxury aesthetic with sophisticated typography
 * Best for: Luxury brands, high-end services, boutiques
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AboutSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 4,
  personality: 'elegant',
  description: 'Refined luxury aesthetic with sophisticated typography and muted palette',
  bestFor: ['luxury', 'boutique', 'hospitality', 'fashion', 'jewelry'],
};

export function SharedAbout4({ content, className, id }: AboutSectionProps) {
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
            className="text-4xl md:text-5xl lg:text-6xl font-light text-[#2c2825] tracking-tight"
            style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            {content.title}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Main story */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div 
              className="space-y-6 text-[#6b6560] text-lg leading-[1.9]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {content.story.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {content.mission && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-12 pl-8 border-l border-[#c9c5bf]"
              >
                <p 
                  className="text-2xl text-[#2c2825] italic"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {content.mission}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar with founder and values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            {/* Founder card */}
            {content.founderName && (
              <div className="mb-12">
                <div className="aspect-[3/4] bg-[#e8e4df] mb-6 relative">
                  {content.founderImage ? (
                    <img 
                      src={content.founderImage} 
                      alt={content.founderName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-4 border border-[#c9c5bf]" />
                  )}
                </div>
                <h3 
                  className="text-2xl text-[#2c2825]"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {content.founderName}
                </h3>
                {content.founderRole && (
                  <p className="text-sm text-[#8a857f] uppercase tracking-[0.2em] mt-2">
                    {content.founderRole}
                  </p>
                )}
              </div>
            )}

            {/* Values */}
            {content.values && content.values.length > 0 && (
              <div className="border-t border-[#e0dcd5] pt-8">
                <h3 className="text-sm text-[#8a857f] uppercase tracking-[0.2em] mb-6">Our Values</h3>
                <ul className="space-y-4">
                  {content.values.map((value, index) => (
                    <li 
                      key={index}
                      className="flex items-center gap-4 text-[#6b6560]"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      <span className="w-8 h-px bg-[#c9c5bf]" />
                      <span className="text-lg">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stats */}
            {content.stats && content.stats.length > 0 && (
              <div className="mt-12 grid grid-cols-2 gap-8">
                {content.stats.map((stat, index) => (
                  <div key={index}>
                    <div 
                      className="text-4xl text-[#2c2825] font-light"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-[#8a857f] uppercase tracking-[0.1em] mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SharedAbout4;
