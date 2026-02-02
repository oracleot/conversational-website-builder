'use client';

/**
 * Shared Contact 2 - Modern Variant
 * Dark theme with glassmorphism form
 * Best for: Tech startups, SaaS, digital agencies
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { ContactSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 2,
  personality: 'modern',
  description: 'Dark theme with glassmorphism form and gradient accents',
  bestFor: ['tech', 'saas', 'startup', 'digital', 'innovation'],
};

export function SharedContact2({ content, className, id }: ContactSectionProps) {
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
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-600 rounded-full blur-[200px] opacity-15" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500 rounded-full blur-[200px] opacity-15" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 text-sm rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {content.heading}
          </h2>
          {content.subheading && (
            <p className="text-lg text-white/60">
              {content.subheading}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {content.email && (
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">Email</p>
                    <a href={`mailto:${content.email}`} className="text-white hover:text-cyan-400 transition-colors">
                      {content.email}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {content.phone && (
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">Phone</p>
                    <a href={`tel:${content.phone}`} className="text-white hover:text-cyan-400 transition-colors">
                      {content.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {content.address && (
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">Location</p>
                    <p className="text-white">{content.address}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <form className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                    <Input 
                      placeholder="Your name" 
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                    <Input 
                      type="email" 
                      placeholder="you@example.com" 
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Subject</label>
                  <Input 
                    placeholder="How can we help?" 
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
                  <Textarea 
                    placeholder="Your message..." 
                    rows={5}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500" 
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0"
                >
                  {content.cta || 'Send Message'}
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SharedContact2;
