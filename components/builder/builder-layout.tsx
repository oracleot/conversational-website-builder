'use client';

/**
 * BuilderLayout - Main layout for the website builder experience
 * Flow: Onboarding -> Section Selection -> Section-by-section chat
 * Dark theme matching landing page aesthetic
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { SitePreview, type SiteContent } from '@/components/sections/preview';
import { PERSONALITY_VARIANT_MAP } from '@/components/sections';
import { OnboardingForm, type OnboardingData } from './onboarding-form';
import { SectionSuggestions } from './section-suggestions';
import { FullscreenPreview } from './fullscreen-preview';
import { SectionProgressTracker, CompactSectionProgress } from './section-progress-tracker';
import { RecentConversations } from './recent-conversations';
import { cn } from '@/lib/utils';
import { useConversationStore } from '@/lib/stores/conversation-store';
import { useSiteStore } from '@/lib/stores/site-store';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message, ConversationStep, IndustryType, BusinessProfile, SectionType } from '@/lib/db/types';

// Builder flow phases
type BuilderPhase = 'onboarding' | 'section_selection' | 'building' | 'complete';

interface BuilderLayoutProps {
  conversationId: string;
  initialData: {
    currentStep: ConversationStep;
    industry?: IndustryType;
    businessProfile?: BusinessProfile;
    messages?: Message[];
  };
}

// Map conversation step types to section order
const SECTION_ORDER: Record<string, number> = {
  hero: 0,
  services: 1,
  menu: 1,
  about: 2,
  process: 3,
  testimonials: 4,
  portfolio: 5,
  gallery: 5,
  location: 6,
  contact: 7,
};

export function BuilderLayout({ conversationId, initialData }: BuilderLayoutProps) {
  // Determine initial phase based on existing data
  const getInitialPhase = (): BuilderPhase => {
    if (initialData.businessProfile && initialData.industry) {
      // Has business profile, check if there are messages (building in progress)
      if (initialData.messages && initialData.messages.length > 0) {
        return 'building';
      }
      return 'section_selection';
    }
    return 'onboarding';
  };

  const [phase, setPhase] = useState<BuilderPhase>(getInitialPhase);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [selectedSections, setSelectedSections] = useState<SectionType[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<SectionType[]>([]);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);

  const { 
    initializeConversation,
    currentStep,
    industry,
    setCurrentStep,
    setExtractedContent,
    extractedContent,
  } = useConversationStore();

  const {
    initializeSite,
    addSection,
    sections,
  } = useSiteStore();

  // Initialize stores
  useEffect(() => {
    initializeConversation({
      id: conversationId,
      currentStep: initialData.currentStep,
      industry: initialData.industry,
      businessProfile: initialData.businessProfile,
      messages: initialData.messages,
    });
    
    initializeSite({
      id: `site-${conversationId}`,
      conversationId,
      name: initialData.businessProfile?.name ?? 'Untitled Site',
      sections: [],
    });
  }, [conversationId, initialData, initializeConversation, initializeSite]);

  // Current section being worked on
  const currentSection = selectedSections[currentSectionIndex] || null;

  // Get variant based on brand personality
  const getVariantForPersonality = useCallback((): 1 | 2 | 3 | 4 | 5 => {
    const extractedProfile = extractedContent.business_profile as BusinessProfile | undefined;
    const businessProfile = extractedProfile || initialData.businessProfile || 
      (onboardingData ? {
        name: onboardingData.businessName,
        brandPersonality: onboardingData.brandPersonality,
      } : null);
    
    if (!businessProfile?.brandPersonality?.length) return 1;
    
    const personality = businessProfile.brandPersonality[0].toLowerCase();
    return (PERSONALITY_VARIANT_MAP[personality] || 1) as 1 | 2 | 3 | 4 | 5;
  }, [extractedContent.business_profile, initialData.businessProfile, onboardingData]);

  // Sync extracted content to site sections
  useEffect(() => {
    const variant = getVariantForPersonality();
    Object.entries(extractedContent).forEach(([type, content]) => {
      if (type === 'business_profile') return;
      if (content && SECTION_ORDER[type] !== undefined) {
        addSection({
          id: `section-${type}`,
          type: type as SectionType,
          order: SECTION_ORDER[type],
          variant,
          content,
          isVisible: true,
        });
        
        // Mark as completed if not already
        if (!completedSections.includes(type as SectionType)) {
          setCompletedSections(prev => [...prev, type as SectionType]);
        }
      }
    });
  }, [extractedContent, addSection, getVariantForPersonality, completedSections]);

  // Persist site draft to backend
  useEffect(() => {
    if (sections.length === 0) return;
    
    const rawProfile = extractedContent.business_profile || initialData.businessProfile || 
      (onboardingData ? {
        name: onboardingData.businessName,
        industry: onboardingData.industry,
        tagline: onboardingData.tagline,
        description: onboardingData.description,
        brandPersonality: onboardingData.brandPersonality,
        contact: {
          email: onboardingData.email,
          phone: onboardingData.phone,
          address: onboardingData.address,
        },
      } : {});
    
    const businessProfile = {
      ...rawProfile as Record<string, unknown>,
      businessName: (rawProfile as Record<string, unknown>).businessName || 
                    (rawProfile as Record<string, unknown>).name || 
                    'Untitled Business',
      industry: (rawProfile as Record<string, unknown>).industry || 'service',
    };
    
    const siteConfig = {
      personality: 'professional',
      colorScheme: 'default',
      sections: sections.map(s => ({
        id: s.id,
        type: s.type,
        order: s.order,
        variant: s.variant,
        isVisible: s.isVisible,
      })),
    };
    
    const content: Record<string, unknown> = {};
    sections.forEach(s => {
      if (s.content) {
        content[s.type] = s.content;
      }
    });

    fetch('/api/site/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: conversationId,
        businessProfile,
        content,
        siteConfig,
      }),
    }).catch(err => console.error('Failed to save site draft:', err));
  }, [sections, extractedContent, conversationId, initialData.businessProfile, onboardingData]);

  // Handle onboarding completion
  const handleOnboardingComplete = async (data: OnboardingData) => {
    setIsOnboardingLoading(true);
    setOnboardingData(data);
    
    // Save business profile to conversation
    try {
      await fetch(`/api/conversation/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: data.industry,
          businessProfile: {
            name: data.businessName,
            industry: data.industry,
            businessType: data.industry === 'service' ? 'service business' : 'local business',
            tagline: data.tagline,
            description: data.description,
            brandPersonality: data.brandPersonality,
            contact: {
              email: data.email,
              phone: data.phone || null,
              address: data.address || null,
            },
          },
          currentStep: 'hero',
        }),
      });
      
      setPhase('section_selection');
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    } finally {
      setIsOnboardingLoading(false);
    }
  };

  // Handle section selection confirmation
  const handleSectionsConfirmed = (sections: SectionType[]) => {
    setSelectedSections(sections);
    setCurrentSectionIndex(0);
    setPhase('building');
  };

  // Handle step change from chat
  const handleStepChange = (step: ConversationStep) => {
    setCurrentStep(step);
    
    // Check if current section is complete by seeing if we have extracted content
    if (currentSection && extractedContent[currentSection]) {
      if (!completedSections.includes(currentSection)) {
        setCompletedSections(prev => [...prev, currentSection]);
      }
      
      // Move to next section
      if (currentSectionIndex < selectedSections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
      } else if (completedSections.length + 1 >= selectedSections.length) {
        setPhase('complete');
      }
    }
  };

  // Handle extraction
  const handleExtraction = (type: string, content: unknown) => {
    setExtractedContent(type, content);
  };

  // Build site content from sections
  const siteContent = useMemo((): SiteContent => {
    const content: SiteContent = {};
    sections.forEach(section => {
      if (section.content) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (content as any)[section.type] = section.content;
      }
    });
    return content;
  }, [sections]);

  const hasPreviewContent = sections.length > 0 || Object.keys(extractedContent).length > 0;
  const businessName = onboardingData?.businessName || initialData.businessProfile?.name || 'Your Business';

  // Render appropriate phase
  return (
    <>
      <AnimatePresence mode="wait">
        {phase === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OnboardingForm
              onComplete={handleOnboardingComplete}
              isLoading={isOnboardingLoading}
            />
          </motion.div>
        )}

        {phase === 'section_selection' && (
          <motion.div
            key="section-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SectionSuggestions
              industry={onboardingData?.industry || initialData.industry || 'service'}
              businessName={businessName}
              onConfirm={handleSectionsConfirmed}
              onBack={() => setPhase('onboarding')}
            />
          </motion.div>
        )}

        {(phase === 'building' || phase === 'complete') && (
          <motion.div
            key="building"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col bg-[#06060a]"
          >
            {/* Header */}
            <header className="shrink-0 border-b border-white/5 bg-[#06060a]/90 backdrop-blur-md">
              <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                {/* Logo & Progress */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="hidden sm:block text-lg font-semibold tracking-tight text-white">
                      {businessName}
                    </span>
                  </div>

                  <div className="hidden md:block">
                    <CompactSectionProgress
                      sections={selectedSections}
                      currentSection={currentSection}
                      completedSections={completedSections}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <RecentConversations currentConversationId={conversationId} />
                  
                  {hasPreviewContent && (
                    <button
                      onClick={() => setShowFullPreview(true)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white',
                        'border border-white/10 hover:border-white/20'
                      )}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="hidden sm:inline">Preview Site</span>
                    </button>
                  )}

                  {phase === 'complete' && (
                    <button
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white',
                        'hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.4)]'
                      )}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Ready to Launch
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile progress */}
              <div className="md:hidden px-4 pb-3">
                <CompactSectionProgress
                  sections={selectedSections}
                  currentSection={currentSection}
                  completedSections={completedSections}
                />
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
              {/* Sidebar Progress - Desktop */}
              <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-white/5 bg-[#0a0a0f]">
                <div className="flex-1 overflow-y-auto p-4">
                  <SectionProgressTracker
                    sections={selectedSections}
                    currentSection={currentSection}
                    completedSections={completedSections}
                  />
                </div>

                {/* Mini Preview */}
                {hasPreviewContent && (
                  <div className="p-4 border-t border-white/5">
                    <button
                      onClick={() => setShowFullPreview(true)}
                      className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-zinc-900 border border-white/10 hover:border-violet-500/50 transition-all group relative"
                    >
                      <div className="absolute inset-0 scale-[0.25] origin-top-left pointer-events-none">
                        <div className="w-[400%] h-[400%] bg-white">
                          <SitePreview
                            content={siteContent}
                            personality="professional"
                            className="min-h-full"
                            isEditable={false}
                            siteId={conversationId}
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">View Fullscreen</span>
                      </div>
                    </button>
                  </div>
                )}
              </aside>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col min-w-0">
                <ChatInterface
                  conversationId={conversationId}
                  initialMessages={initialData.messages}
                  currentStep={currentSection as ConversationStep || 'hero'}
                  industry={onboardingData?.industry || industry || 'service'}
                  onStepChange={handleStepChange}
                  onExtraction={handleExtraction}
                  className="h-full"
                  businessInfo={onboardingData}
                  currentSectionTitle={currentSection ? getSectionTitle(currentSection) : undefined}
                />
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Preview Modal */}
      <FullscreenPreview
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
        content={siteContent}
        siteId={conversationId}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />

      {/* Decorative Elements */}
      {(phase === 'building' || phase === 'complete') && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -left-40 -top-40 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-transparent blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-tl from-cyan-500/10 via-blue-600/5 to-transparent blur-[120px]" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        </div>
      )}
    </>
  );
}

// Helper function for section titles
function getSectionTitle(section: SectionType): string {
  const titles: Record<SectionType, string> = {
    hero: 'Hero Section',
    services: 'Services',
    menu: 'Menu',
    about: 'About',
    process: 'Process',
    portfolio: 'Portfolio',
    testimonials: 'Testimonials',
    location: 'Location',
    gallery: 'Gallery',
    contact: 'Contact',
  };
  return titles[section] || section;
}
