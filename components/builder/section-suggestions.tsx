'use client';

/**
 * SectionSuggestions - Displays recommended sections after onboarding
 * Features: Checkbox selection, section descriptions, reordering
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { IndustryType, SectionType } from '@/lib/db/types';

interface SectionSuggestionsProps {
  industry: IndustryType;
  businessName: string;
  onConfirm: (sections: SectionType[]) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

interface SectionInfo {
  id: SectionType;
  title: string;
  description: string;
  icon: string;
  required: boolean;
}

const SERVICE_SECTIONS: SectionInfo[] = [
  { id: 'hero', title: 'Hero Section', description: 'Eye-catching headline and call-to-action', icon: '🎯', required: true },
  { id: 'services', title: 'Services', description: 'Showcase what you offer', icon: '💼', required: true },
  { id: 'about', title: 'About', description: 'Tell your story and build trust', icon: '👋', required: true },
  { id: 'process', title: 'Process', description: 'How you work with clients', icon: '📋', required: false },
  { id: 'testimonials', title: 'Testimonials', description: 'Social proof from happy clients', icon: '⭐', required: false },
  { id: 'portfolio', title: 'Portfolio', description: 'Showcase your best work', icon: '🎨', required: false },
  { id: 'contact', title: 'Contact', description: 'How visitors can reach you', icon: '📧', required: true },
];

const LOCAL_SECTIONS: SectionInfo[] = [
  { id: 'hero', title: 'Hero Section', description: 'Eye-catching headline and call-to-action', icon: '🎯', required: true },
  { id: 'menu', title: 'Menu / Services', description: 'What you offer and pricing', icon: '🍽️', required: true },
  { id: 'about', title: 'About', description: 'Your story and what makes you special', icon: '👋', required: true },
  { id: 'gallery', title: 'Gallery', description: 'Photos of your space and work', icon: '🖼️', required: false },
  { id: 'testimonials', title: 'Testimonials', description: 'Reviews from happy customers', icon: '⭐', required: false },
  { id: 'location', title: 'Location & Hours', description: 'Where to find you and when', icon: '📍', required: true },
  { id: 'contact', title: 'Contact', description: 'Get in touch', icon: '📧', required: true },
];

export function SectionSuggestions({
  industry,
  businessName,
  onConfirm,
  onBack,
  isLoading = false,
}: SectionSuggestionsProps) {
  const availableSections = industry === 'local' ? LOCAL_SECTIONS : SERVICE_SECTIONS;
  
  // Initialize with all required sections selected
  const [selectedSections, setSelectedSections] = useState<SectionType[]>(
    availableSections.filter(s => s.required).map(s => s.id)
  );

  const toggleSection = (sectionId: SectionType, required: boolean) => {
    if (required) return; // Can't toggle required sections
    
    setSelectedSections((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter((id) => id !== sectionId);
      }
      return [...prev, sectionId];
    });
  };

  // Maintain order based on original sections array
  const orderedSelectedSections = useMemo(() => {
    return availableSections
      .filter(s => selectedSections.includes(s.id))
      .map(s => s.id);
  }, [selectedSections, availableSections]);

  const handleConfirm = () => {
    onConfirm(orderedSelectedSections);
  };

  return (
    <div className="min-h-screen bg-[#06060a] flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-6 py-6 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">Buildware</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 sm:px-12 lg:px-20 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-10">
              <h1 className="font-serif text-4xl font-normal leading-tight text-white sm:text-5xl">
                Perfect sections for{' '}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  {businessName}
                </span>
              </h1>
              <p className="mt-4 text-lg text-zinc-400">
                We&apos;ve recommended the best sections for your {industry === 'local' ? 'local' : 'service'} business. 
                Toggle optional ones on or off.
              </p>
            </div>

            {/* Section List */}
            <div className="space-y-3">
              <AnimatePresence>
                {availableSections.map((section, index) => {
                  const isSelected = selectedSections.includes(section.id);
                  
                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => toggleSection(section.id, section.required)}
                      disabled={section.required}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200',
                        'group',
                        isSelected
                          ? 'border-violet-500/30 bg-violet-500/10'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]',
                        section.required && 'cursor-default'
                      )}
                    >
                      {/* Checkbox */}
                      <div
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200',
                          isSelected
                            ? 'border-violet-500 bg-violet-500'
                            : 'border-zinc-600 bg-transparent group-hover:border-zinc-500'
                        )}
                      >
                        {isSelected && (
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      {/* Icon */}
                      <span className="text-2xl shrink-0">{section.icon}</span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            'font-medium transition-colors',
                            isSelected ? 'text-white' : 'text-zinc-400'
                          )}>
                            {section.title}
                          </h3>
                          {section.required && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 uppercase tracking-wide">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500 truncate">{section.description}</p>
                      </div>

                      {/* Order number */}
                      {isSelected && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-zinc-400">
                          {orderedSelectedSections.indexOf(section.id) + 1}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-4 rounded-xl border border-white/10 bg-white/[0.02]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {selectedSections.length} sections selected
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    We&apos;ll work through each section one at a time
                  </p>
                </div>
                <div className="flex gap-2">
                  {orderedSelectedSections.slice(0, 5).map((id) => {
                    const section = availableSections.find(s => s.id === id);
                    return (
                      <span key={id} className="text-lg" title={section?.title}>
                        {section?.icon}
                      </span>
                    );
                  })}
                  {orderedSelectedSections.length > 5 && (
                    <span className="text-xs text-zinc-500 flex items-center">
                      +{orderedSelectedSections.length - 5}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}

              <button
                onClick={handleConfirm}
                disabled={isLoading || selectedSections.length === 0}
                className={cn(
                  'group relative flex items-center gap-2 overflow-hidden rounded-xl px-8 py-3 ml-auto',
                  'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium',
                  'hover:shadow-[0_0_40px_-5px_rgba(167,139,250,0.5)]',
                  'transition-all duration-300',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Preparing...
                    </span>
                  ) : (
                    "Let's Build"
                  )}
                </span>
                {!isLoading && (
                  <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-transparent blur-[120px]" />
        <div className="absolute -bottom-60 -right-40 h-[700px] w-[700px] animate-pulse rounded-full bg-gradient-to-tl from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px]" style={{ animationDelay: '1s', animationDuration: '4s' }} />
      </div>

      {/* Grain texture */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}
