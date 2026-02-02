'use client';

/**
 * Site Preview - Full website preview component
 * Renders all sections with proper ordering and transitions
 */

import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComponentLoader, preloadSectionComponent } from './component-loader';
import { SectionWrapper } from './section-wrapper';
import { PERSONALITY_VARIANT_MAP, type SectionType, type VariantNumber } from '../index';
import { useSiteStore } from '@/lib/stores/site-store';
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
  isEditable?: boolean;
  siteId?: string | null;
  onVariantChange?: (sectionType: SectionType, variant: number) => void;
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
  isEditable = false,
  siteId = null,
  onVariantChange,
}: SitePreviewProps) {
  // Determine variant based on personality
  const defaultVariant = (PERSONALITY_VARIANT_MAP[personality] || 1) as VariantNumber;

  // Subscribe directly to store sections for reactive variant updates
  const storeSections = useSiteStore((s) => s.sections);

  // Build variant map from store sections (takes priority over variantOverrides)
  const storeVariantMap = useMemo(() => {
    const map: Partial<Record<SectionType, VariantNumber>> = {};
    storeSections.forEach((section) => {
      // Only include sections that match our known SectionTypes
      const sType = section.type as SectionType;
      if (DEFAULT_SECTION_ORDER.includes(sType)) {
        map[sType] = section.variant as VariantNumber;
      }
    });
    return map;
  }, [storeSections]);

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
        const variant = storeVariantMap[section] || variantOverrides[section] || defaultVariant;
        await preloadSectionComponent(section, variant);
      }
    };
    preloadSections();
  }, [sectionsWithContent, storeVariantMap, variantOverrides, defaultVariant]);

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
      {sectionsWithContent.map((sectionType, index) => {
        const sectionContent = content[sectionType];
        if (!sectionContent) return null;

        // Use store variant first, then variantOverrides, then default
        const variant = storeVariantMap[sectionType] || variantOverrides[sectionType] || defaultVariant;
        const sectionId = `section-${sectionType}`;

        return (
          <SectionWrapper
            key={sectionType}
            id={sectionId}
            sectionType={sectionType}
            siteId={siteId}
            currentVariant={variant}
            isEditable={isEditable}
            isActive={activeSectionId === sectionType}
            animationVariant="slide-up"
            delay={index * 0.1}
            onVariantChange={(newVariant) => onVariantChange?.(sectionType, newVariant)}
          >
            <ComponentLoader
              sectionType={sectionType}
              variant={variant}
              content={sectionContent as never}
            />
          </SectionWrapper>
        );
      })}
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
