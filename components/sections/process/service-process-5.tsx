'use client';

/**
 * Service Process 5 - Friendly Variant
 * Playful steps with warm colors and icons
 * Best for: Healthcare, education, community services
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProcessSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 5,
  personality: 'friendly',
  description: 'Playful steps with warm colors, icons, and inviting design',
  bestFor: ['healthcare', 'education', 'nonprofit', 'community', 'therapy'],
};

const STEP_EMOJIS = ['📋', '💬', '🎯', '🚀', '🎉', '✨'];

export function ServiceProcess5({ content, className, id }: ProcessSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative overflow-hidden',
        'bg-gradient-to-b from-white to-orange-50/50',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-rose-200 rounded-full blur-[120px] opacity-30" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-orange-200 rounded-full blur-[120px] opacity-30" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="text-4xl mb-4 block">🛤️</span>
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

        {/* Steps in a fun layout */}
        <div className="max-w-4xl mx-auto space-y-6">
          {content.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'flex items-start gap-6',
                index % 2 === 1 && 'md:flex-row-reverse'
              )}
            >
              {/* Step card */}
              <div className="flex-1 bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  {/* Emoji icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{STEP_EMOJIS[index % STEP_EMOJIS.length]}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">
                        Step {index + 1}
                      </span>
                      {step.duration && (
                        <span className="text-sm text-gray-400">
                          {step.duration}
                        </span>
                      )}
                    </div>
                    <h3 
                      className="text-xl font-bold text-gray-800 mb-2"
                      style={{ fontFamily: '"Nunito", sans-serif' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connection arrow */}
              {index < content.steps.length - 1 && (
                <div className="hidden md:flex flex-col items-center justify-center w-16">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">Ready to get started? 🎉</p>
          <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-full shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            Start Your Journey
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default ServiceProcess5;
