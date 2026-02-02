'use client';

/**
 * Shared About 5 - Friendly Variant
 * Warm, approachable with soft colors and organic shapes
 * Best for: Healthcare, education, community services
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AboutSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 5,
  personality: 'friendly',
  description: 'Warm, approachable design with soft colors and organic shapes',
  bestFor: ['healthcare', 'education', 'nonprofit', 'community', 'therapy'],
};

export function SharedAbout5({ content, className, id }: AboutSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative overflow-hidden',
        'bg-gradient-to-br from-amber-50 to-rose-50',
        className
      )}
    >
      {/* Background shapes */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-orange-200 rounded-full blur-[100px] opacity-40" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-rose-200 rounded-full blur-[100px] opacity-40" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-5xl mb-4 block">🙋‍♀️</span>
          <h2 
            className="text-3xl md:text-4xl font-bold text-gray-800"
            style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}
          >
            {content.title}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl shadow-gray-200/50"
          >
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              {content.story.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {content.mission && (
              <div className="mt-8 p-6 bg-gradient-to-r from-orange-100 to-rose-100 rounded-2xl">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">💫</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Our Mission</h4>
                    <p className="text-gray-700">{content.mission}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Founder + Values */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Founder */}
            {content.founderName && (
              <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                  {content.founderName.charAt(0)}
                </div>
                <div>
                  <h3 
                    className="text-xl font-bold text-gray-800"
                    style={{ fontFamily: '"Nunito", sans-serif' }}
                  >
                    {content.founderName}
                  </h3>
                  {content.founderRole && (
                    <p className="text-gray-500">{content.founderRole}</p>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            {content.stats && content.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {content.stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 text-center"
                  >
                    <div 
                      className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500"
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Values */}
            {content.values && content.values.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50">
                <h3 
                  className="font-bold text-gray-800 mb-4 flex items-center gap-2"
                  style={{ fontFamily: '"Nunito", sans-serif' }}
                >
                  <span>💝</span> Our Values
                </h3>
                <div className="flex flex-wrap gap-2">
                  {content.values.map((value, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-orange-100 to-rose-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SharedAbout5;
