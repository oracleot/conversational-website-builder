'use client';

/**
 * Shared Testimonials 3 - Bold Variant
 * Large quote blocks with dramatic typography
 * Best for: Creative agencies, marketing, media
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TestimonialsSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 3,
  personality: 'bold',
  description: 'Large quote blocks with dramatic typography and high contrast',
  bestFor: ['creative', 'marketing', 'media', 'entertainment', 'sports'],
};

export function SharedTestimonials3({ content, className, id }: TestimonialsSectionProps) {
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
          <span className="text-red-500 font-black uppercase tracking-[0.3em] text-sm">Testimonials</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mt-4">
            {content.sectionTitle}
          </h2>
          <div className="mt-4 w-24 h-1 bg-red-500" />
        </motion.div>

        {/* Large testimonial blocks */}
        <div className="space-y-0">
          {content.testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group border-t border-white/10 py-16 hover:bg-white/5 transition-colors duration-300"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Large quote mark */}
                <div className="lg:col-span-2">
                  <span className="text-9xl font-black text-white/5 group-hover:text-red-500/30 transition-colors duration-300 leading-none">
                    &quot;
                  </span>
                </div>

                {/* Quote */}
                <div className="lg:col-span-7">
                  <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                    {testimonial.quote}
                  </blockquote>
                </div>

                {/* Author */}
                <div className="lg:col-span-3 lg:text-right">
                  <p className="text-xl font-bold text-white">{testimonial.name}</p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-white/50 uppercase tracking-wider text-sm mt-2">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && <br />}
                      {testimonial.company}
                    </p>
                  )}
                  {testimonial.rating && (
                    <div className="flex lg:justify-end gap-1 mt-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
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

export default SharedTestimonials3;
