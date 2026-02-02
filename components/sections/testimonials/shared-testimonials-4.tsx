'use client';

/**
 * Shared Testimonials 4 - Elegant Variant
 * Refined layout with sophisticated typography
 * Best for: Luxury brands, high-end services, boutiques
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TestimonialsSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 4,
  personality: 'elegant',
  description: 'Refined layout with sophisticated typography and muted palette',
  bestFor: ['luxury', 'boutique', 'hospitality', 'fashion', 'jewelry'],
};

export function SharedTestimonials4({ content, className, id }: TestimonialsSectionProps) {
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

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-12">
          {content.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Decorative quote */}
              <span 
                className="absolute -top-6 -left-4 text-8xl text-[#e0dcd5] leading-none"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                &ldquo;
              </span>

              <div className="relative pt-8 pl-8">
                <blockquote 
                  className="text-xl md:text-2xl text-[#2c2825] leading-relaxed italic"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {testimonial.quote}
                </blockquote>

                {/* Author */}
                <div className="mt-8 pt-6 border-t border-[#e0dcd5]">
                  <p 
                    className="text-lg text-[#2c2825]"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    {testimonial.name}
                  </p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-[#8a857f] uppercase tracking-[0.1em] mt-1">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && ' — '}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SharedTestimonials4;
