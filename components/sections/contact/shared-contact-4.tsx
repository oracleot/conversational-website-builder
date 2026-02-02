'use client';

/**
 * Shared Contact 4 - Elegant Variant
 * Refined layout with sophisticated styling
 * Best for: Luxury brands, high-end services, boutiques
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { ContactSectionProps, VariantMetadata } from '../types';

export const metadata: VariantMetadata = {
  variant: 4,
  personality: 'elegant',
  description: 'Refined layout with sophisticated styling and muted tones',
  bestFor: ['luxury', 'boutique', 'hospitality', 'fashion', 'jewelry'],
};

export function SharedContact4({ content, className, id }: ContactSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 lg:py-32',
        'bg-[#f8f6f3]',
        className
      )}
    >
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-16 h-px bg-[#b8a898] mx-auto mb-8"
          />
          <h2 
            className="text-4xl md:text-5xl font-light text-[#2c2825] tracking-tight"
            style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            {content.heading}
          </h2>
          {content.subheading && (
            <p 
              className="mt-6 text-lg text-[#6b6560] max-w-xl mx-auto"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {content.subheading}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 space-y-12"
          >
            {content.email && (
              <div>
                <p className="text-sm text-[#8a857f] uppercase tracking-[0.2em] mb-2">Email</p>
                <a 
                  href={`mailto:${content.email}`} 
                  className="text-lg text-[#2c2825] hover:text-[#6b6560] transition-colors"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {content.email}
                </a>
              </div>
            )}

            {content.phone && (
              <div>
                <p className="text-sm text-[#8a857f] uppercase tracking-[0.2em] mb-2">Telephone</p>
                <a 
                  href={`tel:${content.phone}`} 
                  className="text-lg text-[#2c2825] hover:text-[#6b6560] transition-colors"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {content.phone}
                </a>
              </div>
            )}

            {content.address && (
              <div>
                <p className="text-sm text-[#8a857f] uppercase tracking-[0.2em] mb-2">Address</p>
                <p 
                  className="text-lg text-[#2c2825]"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {content.address}
                </p>
              </div>
            )}

            {content.hours && (
              <div>
                <p className="text-sm text-[#8a857f] uppercase tracking-[0.2em] mb-2">Hours</p>
                <p 
                  className="text-lg text-[#2c2825]"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {content.hours}
                </p>
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm text-[#8a857f] uppercase tracking-[0.2em] mb-3">Name</label>
                  <Input 
                    placeholder="Your name" 
                    className="h-14 bg-white border-[#e0dcd5] rounded-none text-[#2c2825] focus:border-[#b8a898] focus:ring-0" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8a857f] uppercase tracking-[0.2em] mb-3">Email</label>
                  <Input 
                    type="email"
                    placeholder="Your email" 
                    className="h-14 bg-white border-[#e0dcd5] rounded-none text-[#2c2825] focus:border-[#b8a898] focus:ring-0" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#8a857f] uppercase tracking-[0.2em] mb-3">Subject</label>
                <Input 
                  placeholder="How may we assist you?" 
                  className="h-14 bg-white border-[#e0dcd5] rounded-none text-[#2c2825] focus:border-[#b8a898] focus:ring-0" 
                />
              </div>
              <div>
                <label className="block text-sm text-[#8a857f] uppercase tracking-[0.2em] mb-3">Message</label>
                <Textarea 
                  placeholder="Your message" 
                  rows={6}
                  className="bg-white border-[#e0dcd5] rounded-none text-[#2c2825] focus:border-[#b8a898] focus:ring-0 resize-none" 
                />
              </div>
              <Button 
                type="submit"
                className="h-14 px-12 bg-[#2c2825] hover:bg-[#1a1816] text-white text-sm uppercase tracking-[0.2em] rounded-none"
              >
                {content.cta || 'Send Enquiry'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SharedContact4;
