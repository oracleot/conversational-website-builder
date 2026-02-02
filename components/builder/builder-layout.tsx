'use client';

/**
 * BuilderLayout - Split-screen layout for builder page
 * Left: Chat interface, Right: Live preview
 * Responsive: Full-width chat on mobile, split on desktop
 */

import { useState, useEffect, useMemo } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ProgressIndicator } from '@/components/chat/progress-indicator';
import { SitePreview, type SiteContent } from '@/components/sections/preview';
import { PERSONALITY_VARIANT_MAP } from '@/components/sections';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useConversationStore } from '@/lib/stores/conversation-store';
import { useSiteStore } from '@/lib/stores/site-store';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message, ConversationStep, IndustryType, BusinessProfile, SectionType } from '@/lib/db/types';

// Mock data for testing preview (enable with ?mockPreview=true in URL)
const MOCK_HERO_CONTENT = {
  headline: "Transform Your Business with Expert Solutions",
  subheadline: "We help companies grow through strategic consulting and innovative technology solutions that drive real results.",
  cta: {
    primary: "Get Started",
    primaryAction: "#contact",
    secondary: "Learn More",
    secondaryAction: "#about",
  },
  backgroundStyle: 'gradient' as const,
};

const MOCK_SERVICES_CONTENT = {
  sectionTitle: "Our Services",
  sectionSubtitle: "What We Offer",
  sectionDescription: "Comprehensive solutions tailored to your needs",
  services: [
    { id: "1", title: "Strategy Consulting", description: "Data-driven strategies to grow your business and outpace competitors." },
    { id: "2", title: "Digital Transformation", description: "Modernize your operations with cutting-edge technology solutions." },
    { id: "3", title: "Brand Development", description: "Create a powerful brand identity that resonates with your audience." },
  ],
};

const MOCK_ABOUT_CONTENT = {
  sectionTitle: "About Us",
  headline: "Building Success Together",
  story: "Founded in 2020, we've helped over 500 businesses transform their operations. Our team of experts brings decades of combined experience to every project.",
  mission: "To empower businesses with the tools and strategies they need to thrive in a digital world.",
  stats: [
    { value: "500+", label: "Clients Served" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "10+", label: "Years Experience" },
  ],
};

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
  about: 2,
  process: 3,
  testimonials: 4,
  portfolio: 5,
  contact: 6,
};

export function BuilderLayout({ conversationId, initialData }: BuilderLayoutProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mockContent, setMockContent] = useState<SiteContent | null>(null);

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
    previewMode,
    setPreviewMode,
    scrollToSection,
    clearScrollTarget,
  } = useSiteStore();

  // Check for mock preview mode on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mockPreview') === 'true') {
        setMockContent({
          hero: MOCK_HERO_CONTENT,
          services: MOCK_SERVICES_CONTENT,
          about: MOCK_ABOUT_CONTENT,
        });
      }
    }
  }, []);

  // Initialize conversation state
  useEffect(() => {
    initializeConversation({
      id: conversationId,
      currentStep: initialData.currentStep,
      industry: initialData.industry,
      businessProfile: initialData.businessProfile,
      messages: initialData.messages,
    });
    
    // Initialize site state - use name property from BusinessProfile
    // Also reset sections when starting a new conversation
    initializeSite({
      id: `site-${conversationId}`,
      conversationId,
      name: initialData.businessProfile?.name ?? 'Untitled Site',
      sections: [], // Clear sections for new conversation
    });
  }, [conversationId, initialData, initializeConversation, initializeSite]);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get variant based on brand personality
  const getVariantForPersonality = (): 1 | 2 | 3 | 4 | 5 => {
    // Check extracted business profile first, then initialData
    const extractedProfile = extractedContent.business_profile as BusinessProfile | undefined;
    const businessProfile = extractedProfile || initialData.businessProfile;
    if (!businessProfile?.brandPersonality?.length) return 1;
    
    // Map first brand personality trait to variant
    const personality = businessProfile.brandPersonality[0].toLowerCase();
    return (PERSONALITY_VARIANT_MAP[personality] || 1) as 1 | 2 | 3 | 4 | 5;
  };

  // Sync extracted content to site sections
  useEffect(() => {
    const variant = getVariantForPersonality();
    Object.entries(extractedContent).forEach(([type, content]) => {
      // Skip business_profile - it's not a visual section
      if (type === 'business_profile') return;
      if (content && SECTION_ORDER[type] !== undefined) {
        addSection({
          id: `section-${type}`,
          type: type as SectionType,
          order: SECTION_ORDER[type],
          variant, // Use personality-based variant
          content,
          isVisible: true,
        });
      }
    });
  }, [extractedContent, addSection]);

  const handleStepChange = (step: ConversationStep) => {
    setCurrentStep(step);
  };

  const handleExtraction = (type: string, content: unknown) => {
    setExtractedContent(type, content);
  };

  const hasPreviewContent = mockContent !== null || sections.length > 0 || Object.keys(extractedContent).length > 0;

  // Use mockContent if available (for testing), otherwise build from sections
  const siteContent = useMemo((): SiteContent => {
    if (mockContent) {
      return mockContent;
    }
    
    const content: SiteContent = {};
    sections.forEach(section => {
      if (section.content) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (content as any)[section.type] = section.content;
      }
    });
    return content;
  }, [sections, mockContent]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="shrink-0 h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Website Builder
          </h1>
          <div className="hidden md:block">
            <ProgressIndicator
              currentStep={currentStep}
              industry={industry ?? undefined}
              className="max-w-2xl"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview device toggle - desktop only */}
          {!isMobile && hasPreviewContent && (
            <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
                className="h-7 px-2"
                title="Desktop view"
              >
                💻
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
                className="h-7 px-2"
                title="Tablet view"
              >
                📱
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
                className="h-7 px-2"
                title="Mobile view"
              >
                📲
              </Button>
            </div>
          )}

          {/* Mobile preview toggle */}
          {isMobile && hasPreviewContent && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden"
            >
              {showPreview ? 'Show Chat' : 'Preview'}
            </Button>
          )}

          {/* Action buttons (shown when ready) */}
          {currentStep === 'complete' && (
            <>
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-green-600 to-emerald-600"
              >
                Ready to Launch
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Mobile progress indicator */}
      <div className="md:hidden shrink-0 px-4 py-2 bg-white border-b border-gray-100">
        <ProgressIndicator
          currentStep={currentStep}
          industry={industry ?? undefined}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Chat panel */}
        {(!isMobile || !showPreview) && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={cn(
              'flex flex-col bg-white',
              isMobile ? 'w-full' : 'w-1/2 border-r border-gray-200'
            )}
          >
            <ChatInterface
              conversationId={conversationId}
              initialMessages={initialData.messages}
              currentStep={currentStep}
              industry={industry ?? undefined}
              onStepChange={handleStepChange}
              onExtraction={handleExtraction}
              className="h-full"
            />
          </motion.div>
        )}

        {/* Preview panel */}
        {(!isMobile || showPreview) && (
          <motion.div
            key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                'flex flex-col bg-gray-100',
                isMobile ? 'w-full' : 'w-1/2'
              )}
            >
              <PreviewPanel 
                content={siteContent}
                previewMode={previewMode}
                scrollToSection={scrollToSection}
                onScrollComplete={clearScrollTarget}
              />
            </motion.div>
          )}
      </main>
    </div>
  );
}

/**
 * Preview panel showing live website preview
 */
interface PreviewPanelProps {
  content: SiteContent;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  scrollToSection: string | null;
  onScrollComplete: () => void;
}

function PreviewPanel({ content, previewMode, scrollToSection, onScrollComplete }: PreviewPanelProps) {
  const hasContent = Object.keys(content).length > 0;

  // Get preview container width based on mode
  const previewWidth = useMemo(() => {
    switch (previewMode) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'max-w-full';
    }
  }, [previewMode]);

  // Handle scroll completion when section comes into view
  useEffect(() => {
    if (scrollToSection) {
      const timer = setTimeout(() => {
        onScrollComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [scrollToSection, onScrollComplete]);

  if (!hasContent) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🌐</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your website will appear here
          </h3>
          <p className="text-gray-500 text-sm">
            As you chat and share information about your business, 
            we&apos;ll build your website preview in real-time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className={cn(
        'mx-auto bg-white rounded-lg shadow-lg min-h-full transition-all duration-300',
        previewWidth
      )}>
        <SitePreview
          content={content}
          personality="professional"
          activeSectionId={scrollToSection ?? undefined}
          className="min-h-full"
        />
      </div>
    </div>
  );
}
