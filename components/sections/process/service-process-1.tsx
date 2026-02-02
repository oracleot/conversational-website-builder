'use client';

/**
 * Service Process 1 - Professional Variant
 * Clean numbered steps with connecting lines
 * Best for: Law firms, consulting, enterprise services
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProcessSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 1,
  personality: 'professional',
  description: 'Clean numbered steps with connecting lines and subtle animations',
  bestFor: ['law', 'consulting', 'enterprise', 'finance', 'corporate'],
};

export function ServiceProcess1({ content, className, id }: ProcessSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32',
        'bg-slate-50',
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
          className="max-w-2xl mx-auto text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
            How We Work
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

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {content.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative flex gap-8"
            >
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/20">
                  {index + 1}
                </div>
                {index < content.steps.length - 1 && (
                  <div className="w-px flex-1 bg-gradient-to-b from-blue-600 to-slate-200 my-4" />
                )}
              </div>

              {/* Content */}
              <div className={cn(
                'flex-1 pb-12',
                index === content.steps.length - 1 && 'pb-0'
              )}>
                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                  {step.duration && (
                    <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {step.duration}
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

export default ServiceProcess1;
