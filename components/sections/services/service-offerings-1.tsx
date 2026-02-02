'use client';

/**
 * Service Offerings 1 - Professional Variant
 * Clean grid layout with structured cards
 * Best for: Law firms, consulting, enterprise services
 */

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ServicesSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 1,
  personality: 'professional',
  description: 'Clean grid layout with structured cards and subtle hover effects',
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

export function ServiceOfferings1({ content, className, id }: ServicesSectionProps) {
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
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {content.sectionTitle}
          </h2>
          {content.sectionDescription && (
            <p className="text-lg text-slate-600">
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {content.services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full bg-white border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  {/* Icon placeholder */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                  {service.features && (
                    <ul className="mt-4 space-y-2">
                      {service.features.slice(0, 3).map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ServiceOfferings1;
