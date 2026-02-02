'use client';

/**
 * Service Offerings 5 - Friendly Variant
 * Warm colors with rounded cards and playful icons
 * Best for: Healthcare, education, community services
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ServicesSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 5,
  personality: 'friendly',
  description: 'Warm, approachable design with rounded cards and playful styling',
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

const FRIENDLY_ICONS = ['💡', '🎯', '✨', '🚀', '💪', '🌟'];

export function ServiceOfferings5({ content, className, id }: ServicesSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative overflow-hidden',
        'bg-gradient-to-b from-white via-orange-50/30 to-white',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full blur-[100px] opacity-30" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-rose-200 rounded-full blur-[100px] opacity-30" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="text-4xl mb-4 block">🛠️</span>
          <h2 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}
          >
            {content.sectionTitle}
          </h2>
          {content.sectionDescription && (
            <p className="text-lg text-gray-600">
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {content.services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-orange-500/10 transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">{FRIENDLY_ICONS[index % FRIENDLY_ICONS.length]}</span>
              </div>

              {/* Content */}
              <h3 
                className="text-xl font-bold text-gray-800 mb-3"
                style={{ fontFamily: '"Nunito", sans-serif' }}
              >
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Features with checkmarks */}
              {service.features && (
                <ul className="space-y-2">
                  {service.features.slice(0, 3).map((feature, fIndex) => (
                    <li 
                      key={fIndex}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">✓</span>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {/* Learn more link */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <a 
                  href="#"
                  className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
                >
                  Learn more
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ServiceOfferings5;
