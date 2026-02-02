'use client';

/**
 * Shared About 1 - Professional Variant
 * Clean split layout with structured content
 * Best for: Law firms, consulting, enterprise services
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AboutSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 1,
  personality: 'professional',
  description: 'Clean split layout with structured content and subtle gradients',
  bestFor: ['law', 'consulting', 'enterprise', 'finance', 'corporate'],
};

export function SharedAbout1({ content, className, id }: AboutSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32',
        'bg-white',
        className
      )}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-6">
              About Us
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              {content.title}
            </h2>
            
            <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
              {content.story.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Values */}
            {content.values && content.values.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-4">
                {content.values.slice(0, 4).map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{value}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Stats */}
            {content.stats && content.stats.length > 0 && (
              <div className="mt-10 flex gap-12">
                {content.stats.slice(0, 3).map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Image/visual side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
              {content.founderImage ? (
                <img 
                  src={content.founderImage} 
                  alt={content.founderName || 'Founder'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-slate-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    {content.founderName && (
                      <p className="font-medium text-slate-600">{content.founderName}</p>
                    )}
                    {content.founderRole && (
                      <p className="text-sm text-slate-400">{content.founderRole}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-blue-200 rounded-lg -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SharedAbout1;
