/**
 * Base Section Props - All section components follow this pattern
 * per constitution component-first architecture requirements
 */

import type { HeroContent, ServicesContent, AboutContent, ProcessContent, PortfolioContent, TestimonialsContent, ContactContent } from '@/lib/schemas';

// Re-export content types for convenience
export type { HeroContent, ServicesContent, AboutContent, ProcessContent, PortfolioContent, TestimonialsContent, ContactContent } from '@/lib/schemas';

/**
 * Base props that all section components receive
 */
export interface BaseSectionProps<T> {
  /** Section content data */
  content: T;
  /** Additional CSS classes */
  className?: string;
  /** Section ID for navigation */
  id?: string;
}

// Typed section props for each section type
export type HeroSectionProps = BaseSectionProps<HeroContent>;
export type ServicesSectionProps = BaseSectionProps<ServicesContent>;
export type AboutSectionProps = BaseSectionProps<AboutContent>;
export type ProcessSectionProps = BaseSectionProps<ProcessContent>;
export type PortfolioSectionProps = BaseSectionProps<PortfolioContent>;
export type TestimonialsSectionProps = BaseSectionProps<TestimonialsContent>;
export type ContactSectionProps = BaseSectionProps<ContactContent>;

/**
 * Variant metadata for AI selection
 */
export interface VariantMetadata {
  variant: number;
  personality: string;
  description: string;
  bestFor: string[];
}
