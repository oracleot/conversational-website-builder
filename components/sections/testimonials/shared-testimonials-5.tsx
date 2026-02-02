'use client';

/**
 * Shared Testimonials 5 - Friendly Variant
 * Warm cards with avatars and emojis
 * Best for: Healthcare, education, community services
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TestimonialsSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 5,
  personality: 'friendly',
  description: 'Warm cards with avatars, emojis, and inviting design',
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

export function SharedTestimonials5({ content, className, id }: TestimonialsSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative overflow-hidden',
        'bg-gradient-to-br from-orange-50 via-white to-rose-50',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200 rounded-full blur-[120px] opacity-30" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 rounded-full blur-[120px] opacity-30" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="text-5xl mb-4 block">💬</span>
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

        {/* Testimonials */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {content.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100"
            >
              {/* Rating with emoji stars */}
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-xl">⭐</span>
                  ))}
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/20">
                  {(testimonial.name || testimonial.author).charAt(0)}
                </div>
                <div>
                  <p 
                    className="font-bold text-gray-800"
                    style={{ fontFamily: '"Nunito", sans-serif' }}
                  >
                    {testimonial.name || testimonial.author}
                  </p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && ' at '}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Verified badge */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-400">
                <span className="text-green-500">✓</span>
                Verified Customer
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default SharedTestimonials5;
