'use client';

/**
 * Shared Testimonials 1 - Professional Variant
 * Clean grid of testimonial cards with ratings
 * Best for: Law firms, consulting, enterprise services
 */

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { TestimonialsSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 1,
  personality: 'professional',
  description: 'Clean grid of testimonial cards with star ratings and professional styling',
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

function StarRating({ rating }: { rating?: number }) {
  const stars = rating ?? 5;
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={cn('w-5 h-5', i < stars ? 'text-yellow-400' : 'text-slate-200')}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function SharedTestimonials1({ content, className, id }: TestimonialsSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32',
        'bg-gradient-to-b from-white to-slate-50',
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
            Testimonials
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

        {/* Testimonials grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {content.testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full bg-white border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  {/* Rating */}
                  <StarRating rating={testimonial.rating} />

                  {/* Quote */}
                  <blockquote className="mt-6 text-slate-700 text-lg leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>

                  {/* Author */}
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                      {testimonial.image || testimonial.avatar ? (
                        <img
                          src={testimonial.image || testimonial.avatar}
                          alt={testimonial.name || testimonial.author}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-slate-500">
                          {(testimonial.name || testimonial.author).charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name || testimonial.author}</p>
                      {(testimonial.role || testimonial.company) && (
                        <p className="text-sm text-slate-500">
                          {testimonial.role}
                          {testimonial.role && testimonial.company && ', '}
                          {testimonial.company}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default SharedTestimonials1;
