'use client';

/**
 * Shared About 2 - Modern Variant
 * Tech-forward with glassmorphism and gradients
 * Best for: Tech startups, SaaS, digital agencies
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AboutSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 2,
  personality: 'modern',
  description: 'Tech-forward design with glassmorphism and gradient accents',
  bestFor: ['tech', 'saas', 'startup', 'digital', 'innovation'],
};

export function SharedAbout2({ content, className, id }: AboutSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative overflow-hidden',
        'bg-[#0a0a0f]',
        className
      )}
    >
      {/* Background effects */}
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-violet-600 rounded-full blur-[200px] opacity-10" />
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-500 rounded-full blur-[200px] opacity-10" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 text-sm rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            Our Story
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {content.title}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Story content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="space-y-4 text-white/70 text-lg leading-relaxed">
                {content.story.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Mission statement */}
              {content.mission && (
                <div className="mt-8 p-6 bg-gradient-to-r from-violet-600/10 to-cyan-500/10 border border-white/5 rounded-xl">
                  <h3 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-2">Our Mission</h3>
                  <p className="text-white/90 text-lg">{content.mission}</p>
                </div>
              )}

              {/* Gradient accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-t-2xl" />
            </div>
          </motion.div>

          {/* Stats and values sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Founder card */}
            {content.founderName && (
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                    {content.founderName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{content.founderName}</p>
                    {content.founderRole && (
                      <p className="text-white/50 text-sm">{content.founderRole}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            {content.stats && content.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {content.stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-center"
                  >
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/50 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Values */}
            {content.values && content.values.length > 0 && (
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Core Values</h3>
                <div className="space-y-3">
                  {content.values.map((value, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
                      <span className="text-white/80">{value}</span>
                    </div>
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

export default SharedAbout2;
