'use client';

/**
 * Site Preview - Full website preview component
 * Renders all sections with proper ordering and transitions
 */

import { useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ComponentLoader, preloadSectionComponent } from './component-loader';
import { SectionWrapper } from './section-wrapper';
import { PERSONALITY_VARIANT_MAP, type SectionType, type VariantNumber } from '../index';
import type {
  HeroContent,
  ServicesContent,
  AboutContent,
  ProcessContent,
  TestimonialsContent,
  PortfolioContent,
  ContactContent,
} from '../types';

// Section order for rendering
const DEFAULT_SECTION_ORDER: SectionType[] = [
  'hero',
  'services',
  'about',
  'process',
  'testimonials',
  'portfolio',
  'contact',
];

// Combined section content type
export interface SiteContent {
  hero?: HeroContent;
  services?: ServicesContent;
  about?: AboutContent;
  process?: ProcessContent;
  testimonials?: TestimonialsContent;
  portfolio?: PortfolioContent;
  contact?: ContactContent;
}

interface SitePreviewProps {
  content: SiteContent;
  personality?: string;
  activeSectionId?: string;
  sectionOrder?: SectionType[];
  variantOverrides?: Partial<Record<SectionType, VariantNumber>>;
  className?: string;
  onSectionView?: (sectionId: SectionType) => void;
}

/**
 * Full website preview with all sections
 */
export function SitePreview({
  content,
  personality = 'professional',
  activeSectionId,
  sectionOrder = DEFAULT_SECTION_ORDER,
  variantOverrides = {},
  className,
  onSectionView,
}: SitePreviewProps) {
  // Determine variant based on personality
  const defaultVariant = (PERSONALITY_VARIANT_MAP[personality] || 1) as VariantNumber;

  // Get the list of sections that have content
  const sectionsWithContent = useMemo(() => {
    return sectionOrder.filter((section) => {
      const sectionContent = content[section];
      return sectionContent !== undefined && sectionContent !== null;
    });
  }, [content, sectionOrder]);

  // Preload next sections for smoother experience
  useEffect(() => {
    const preloadSections = async () => {
      for (const section of sectionsWithContent) {
        const variant = variantOverrides[section] || defaultVariant;
        await preloadSectionComponent(section, variant);
      }
    };
    preloadSections();
  }, [sectionsWithContent, variantOverrides, defaultVariant]);

  // Scroll to active section
  useEffect(() => {
    if (activeSectionId) {
      const element = document.getElementById(activeSectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeSectionId]);

  if (sectionsWithContent.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-muted/20">
        <div className="text-center space-y-4">
          <div className="text-6xl">🏗️</div>
          <h3 className="text-xl font-semibold text-gray-700">Preview will appear here</h3>
          <p className="text-gray-500">Answer the questions to see your website come to life</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {sectionsWithContent.map((sectionType, index) => {
          const sectionContent = content[sectionType];
          if (!sectionContent) return null;

          const variant = variantOverrides[sectionType] || defaultVariant;
          const isActive = activeSectionId === sectionType;

          return (
            <SectionWrapper
              key={sectionType}
              id={sectionType}
              animationVariant="slide-up"
              delay={index * 0.1}
              isActive={isActive}
            >
              <ComponentLoader
                sectionType={sectionType}
                variant={variant}
                // Cast is safe because we filtered for sections with content
                content={sectionContent as never}
              />
            </SectionWrapper>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/**
 * Single section preview for editing/development
 */
interface SingleSectionPreviewProps {
  sectionType: SectionType;
  variant: VariantNumber;
  content: unknown;
  className?: string;
}

export function SingleSectionPreview({
  sectionType,
  variant,
  content,
  className,
}: SingleSectionPreviewProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ComponentLoader
        sectionType={sectionType}
        variant={variant}
        content={content as never}
      />
    </motion.div>
  );
}

export default SitePreview;
