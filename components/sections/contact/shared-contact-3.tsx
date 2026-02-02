'use client';

/**
 * Shared Contact 3 - Bold Variant
 * High contrast with dramatic layout
 * Best for: Creative agencies, marketing, media
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { ContactSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 3,
  personality: 'bold',
  description: 'High contrast with dramatic layout and strong typography',
  bestFor: ['creative', 'marketing', 'media', 'entertainment', 'sports'],
};

export function SharedContact3({ content, className, id }: ContactSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative',
        'bg-black',
        className
      )}
    >
      {/* Red accent */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-500" />

      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-red-500 font-black uppercase tracking-[0.3em] text-sm">Contact</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mt-4">
            {content.heading}
          </h2>
          <div className="mt-4 w-24 h-1 bg-red-500" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {content.subheading && (
              <p className="text-2xl text-white/70 max-w-md leading-relaxed">
                {content.subheading}
              </p>
            )}

            <div className="space-y-6">
              {content.email && (
                <div className="group flex items-center gap-4 py-6 border-b border-white/10 hover:border-red-500 transition-colors">
                  <span className="text-white/50 uppercase tracking-wider text-sm w-24">Email</span>
                  <a href={`mailto:${content.email}`} className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {content.email}
                  </a>
                </div>
              )}

              {content.phone && (
                <div className="group flex items-center gap-4 py-6 border-b border-white/10 hover:border-red-500 transition-colors">
                  <span className="text-white/50 uppercase tracking-wider text-sm w-24">Phone</span>
                  <a href={`tel:${content.phone}`} className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {content.phone}
                  </a>
                </div>
              )}

              {content.address && (
                <div className="group flex items-center gap-4 py-6 border-b border-white/10 hover:border-red-500 transition-colors">
                  <span className="text-white/50 uppercase tracking-wider text-sm w-24">Office</span>
                  <p className="text-2xl font-bold text-white">{content.address}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form className="space-y-6">
              <div>
                <Input 
                  placeholder="YOUR NAME" 
                  className="h-16 bg-transparent border-0 border-b-2 border-white/20 rounded-none text-white text-lg font-bold uppercase tracking-wider placeholder:text-white/30 focus:border-red-500 focus:ring-0" 
                />
              </div>
              <div>
                <Input 
                  type="email"
                  placeholder="YOUR EMAIL" 
                  className="h-16 bg-transparent border-0 border-b-2 border-white/20 rounded-none text-white text-lg font-bold uppercase tracking-wider placeholder:text-white/30 focus:border-red-500 focus:ring-0" 
                />
              </div>
              <div>
                <Textarea 
                  placeholder="YOUR MESSAGE" 
                  rows={4}
                  className="bg-transparent border-0 border-b-2 border-white/20 rounded-none text-white text-lg font-bold uppercase tracking-wider placeholder:text-white/30 focus:border-red-500 focus:ring-0 resize-none" 
                />
              </div>
              <Button 
                type="submit"
                className="h-16 px-12 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-wider rounded-none mt-8"
              >
                {content.cta || 'Send Message'}
                <svg className="w-5 h-5 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SharedContact3;
