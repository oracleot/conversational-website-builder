'use client';

/**
 * Shared About 3 - Bold Variant
 * High impact with strong editorial layout
 * Best for: Creative agencies, marketing, media
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AboutSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 3,
  personality: 'bold',
  description: 'High impact editorial layout with strong typography and dramatic contrast',
  bestFor: ['creative', 'marketing', 'media', 'entertainment', 'sports'],
};

export function SharedAbout3({ content, className, id }: AboutSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative',
        'bg-black',
        className
      )}
    >
      {/* Accent stripe */}
      <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500" />

      <div className="container mx-auto px-6 lg:px-12">
        {/* Big title */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="text-red-500 font-black uppercase tracking-[0.3em] text-sm">About</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight mt-4 leading-[0.9]">
            {content.title}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative pl-8 border-l-2 border-white/20"
          >
            <div className="space-y-6 text-white/70 text-xl leading-relaxed">
              {content.story.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {content.mission && (
              <blockquote className="mt-10 text-2xl md:text-3xl font-bold text-white italic">
                &quot;{content.mission}&quot;
              </blockquote>
            )}
          </motion.div>

          {/* Founder + Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Founder */}
            {content.founderName && (
              <div className="mb-12">
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 mb-6 flex items-center justify-center">
                  <span className="text-5xl font-black text-white">{content.founderName.charAt(0)}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{content.founderName}</h3>
                {content.founderRole && (
                  <p className="text-white/50 uppercase tracking-wider text-sm mt-1">{content.founderRole}</p>
                )}
              </div>
            )}

            {/* Stats */}
            {content.stats && content.stats.length > 0 && (
              <div className="space-y-6">
                {content.stats.map((stat, index) => (
                  <div key={index} className="flex items-baseline gap-4 py-4 border-b border-white/10">
                    <span className="text-5xl md:text-6xl font-black text-white">{stat.value}</span>
                    <span className="text-white/50 uppercase tracking-wider text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Values */}
            {content.values && content.values.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-3">
                {content.values.map((value, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 border border-white/20 text-white uppercase tracking-wider text-xs font-bold hover:bg-red-500 hover:border-red-500 transition-colors duration-300 cursor-default"
                  >
                    {value}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SharedAbout3;
