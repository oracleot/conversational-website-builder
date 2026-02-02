'use client';

/**
 * Shared Testimonials 2 - Modern Variant
 * Glassmorphism cards with gradient quotes
 * Best for: Tech startups, SaaS, digital agencies
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TestimonialsSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 2,
  personality: 'modern',
  description: 'Glassmorphism cards with gradient accents and modern typography',
  bestFor: ['tech', 'saas', 'startup', 'digital', 'innovation'],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export function SharedTestimonials2({ content, className, id }: TestimonialsSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative overflow-hidden',
        'bg-[#0a0a0f]',
        className
      )}
    >
      {/* Background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[200px] opacity-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[200px] opacity-10" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 text-sm rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            What our clients say
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            {content.sectionTitle}
          </h2>
          {content.sectionDescription && (
            <p className="mt-4 text-lg text-white/60">
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
              className="group relative"
            >
              {/* Gradient border on hover */}
              <div className="absolute -inset-px bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-sm" />
              
              <div className="relative h-full p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                {/* Quote icon */}
                <div className="mb-6">
                  <svg className="w-8 h-8 text-violet-500/50" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                  </svg>
                </div>

                {/* Quote */}
                <blockquote className="text-white/80 text-lg leading-relaxed mb-8">
                  {testimonial.quote}
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {(testimonial.name || testimonial.author).charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name || testimonial.author}</p>
                    {(testimonial.role || testimonial.company) && (
                      <p className="text-sm text-white/50">
                        {testimonial.role}
                        {testimonial.role && testimonial.company && ' · '}
                        {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rating */}
                {testimonial.rating && (
                  <div className="absolute top-6 right-6 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default SharedTestimonials2;
