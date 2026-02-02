'use client';

/**
 * Shared Contact 5 - Friendly Variant
 * Warm, approachable with soft colors
 * Best for: Healthcare, education, community services
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { ContactSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 5,
  personality: 'friendly',
  description: 'Warm, approachable with soft colors and inviting design',
  bestFor: ['healthcare', 'education', 'nonprofit', 'community', 'therapy'],
};

export function SharedContact5({ content, className, id }: ContactSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32 relative overflow-hidden',
        'bg-gradient-to-br from-orange-50 via-white to-rose-50',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-rose-200 rounded-full blur-[120px] opacity-30" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-200 rounded-full blur-[120px] opacity-30" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="text-5xl mb-4 block">💌</span>
          <h2 
            className="text-3xl md:text-4xl font-bold text-gray-800"
            style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}
          >
            {content.heading}
          </h2>
          {content.subheading && (
            <p className="mt-4 text-lg text-gray-600">
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
              <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email us at</p>
                  <a 
                    href={`mailto:${content.email}`} 
                    className="font-semibold text-gray-800 hover:text-orange-600 transition-colors"
                  >
                    {content.email}
                  </a>
                </div>
              </div>
            )}

            {content.phone && (
              <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Call us at</p>
                  <a 
                    href={`tel:${content.phone}`} 
                    className="font-semibold text-gray-800 hover:text-orange-600 transition-colors"
                  >
                    {content.phone}
                  </a>
                </div>
              </div>
            )}

            {content.address && (
              <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Visit us at</p>
                  <p className="font-semibold text-gray-800">{content.address}</p>
                </div>
              </div>
            )}

            {content.hours && (
              <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🕐</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Open</p>
                  <p className="font-semibold text-gray-800">{content.hours}</p>
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
            <form className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 
                className="text-2xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: '"Nunito", sans-serif' }}
              >
                Send us a message 📝
              </h3>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <Input 
                      placeholder="Jane Smith" 
                      className="h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input 
                      type="email"
                      placeholder="jane@example.com" 
                      className="h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How can we help?</label>
                  <Textarea 
                    placeholder="Tell us what's on your mind..." 
                    rows={5}
                    className="rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400 resize-none" 
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold rounded-full shadow-lg shadow-orange-500/25"
                >
                  {content.cta || 'Send Message'} ✨
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SharedContact5;
