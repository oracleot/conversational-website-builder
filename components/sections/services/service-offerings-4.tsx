'use client';

/**
 * Service Offerings 4 - Elegant Variant
 * Refined layout with sophisticated typography
 * Best for: Luxury brands, high-end services, boutiques
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ServicesSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 4,
  personality: 'elegant',
  description: 'Refined, luxury aesthetic with sophisticated typography and muted tones',
  bestFor: ['luxury', 'boutique', 'hospitality', 'fashion', 'jewelry'],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

export function ServiceOfferings4({ content, className, id }: ServicesSectionProps) {
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
        {/* Section header */}
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
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-px bg-[#b8a898] mx-auto mb-8"
          />
          <h2 
            className="text-4xl md:text-5xl font-light text-[#2c2825] mb-6 tracking-tight"
            style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            {content.sectionTitle}
          </h2>
          {content.sectionDescription && (
            <p 
              className="text-lg text-[#6b6560] max-w-xl mx-auto"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
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
          className="grid md:grid-cols-2 gap-px bg-[#e0dcd5]"
        >
          {content.services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-[#f8f6f3] p-12 hover:bg-[#f2efeb] transition-colors duration-500"
            >
              {/* Service number */}
              <span 
                className="text-5xl text-[#d4cfc8] font-light mb-6 block"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                0{index + 1}
              </span>

              {/* Content */}
              <h3 
                className="text-2xl text-[#2c2825] font-light mb-4 tracking-tight"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                {service.title}
              </h3>
              <p 
                className="text-[#6b6560] leading-relaxed mb-6"
                style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem' }}
              >
                {service.description}
              </p>

              {/* Features as subtle list */}
              {service.features && (
                <ul className="space-y-2">
                  {service.features.slice(0, 3).map((feature, fIndex) => (
                    <li 
                      key={fIndex}
                      className="text-sm text-[#8a857f] uppercase tracking-[0.1em] flex items-center gap-3"
                    >
                      <span className="w-4 h-px bg-[#b8a898]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {/* Decorative line */}
              <motion.div
                className="mt-8 w-0 group-hover:w-12 h-px bg-[#b8a898] transition-all duration-500"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ServiceOfferings4;
