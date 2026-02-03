/**
 * Main Section Components - Barrel export
 * Exports all section components for dynamic loading
 */

// Hero sections
export * from './hero';
export * from './services';
export * from './about';
export * from './process';
export * from './testimonials';
export * from './portfolio';
export * from './contact';

// Types
export * from './types';

// Component registry for dynamic loading
export const SECTION_COMPONENTS = {
  hero: {
    1: () => import('./hero/service-hero-1'),
    2: () => import('./hero/service-hero-2'),
    3: () => import('./hero/service-hero-3'),
    4: () => import('./hero/service-hero-4'),
    5: () => import('./hero/service-hero-5'),
  },
  services: {
    1: () => import('./services/service-offerings-1'),
    2: () => import('./services/service-offerings-2'),
    3: () => import('./services/service-offerings-3'),
    4: () => import('./services/service-offerings-4'),
    5: () => import('./services/service-offerings-5'),
  },
  about: {
    1: () => import('./about/shared-about-1'),
    2: () => import('./about/shared-about-2'),
    3: () => import('./about/shared-about-3'),
    4: () => import('./about/shared-about-4'),
    5: () => import('./about/shared-about-5'),
  },
  process: {
    1: () => import('./process/service-process-1'),
    2: () => import('./process/service-process-2'),
    3: () => import('./process/service-process-3'),
    4: () => import('./process/service-process-4'),
    5: () => import('./process/service-process-5'),
  },
  testimonials: {
    1: () => import('./testimonials/shared-testimonials-1'),
    2: () => import('./testimonials/shared-testimonials-2'),
    3: () => import('./testimonials/shared-testimonials-3'),
    4: () => import('./testimonials/shared-testimonials-4'),
    5: () => import('./testimonials/shared-testimonials-5'),
  },
  portfolio: {
    1: () => import('./portfolio/service-portfolio-1'),
    2: () => import('./portfolio/service-portfolio-2'),
    3: () => import('./portfolio/service-portfolio-3'),
    4: () => import('./portfolio/service-portfolio-4'),
    5: () => import('./portfolio/service-portfolio-5'),
  },
  contact: {
    1: () => import('./contact/shared-contact-1'),
    2: () => import('./contact/shared-contact-2'),
    3: () => import('./contact/shared-contact-3'),
    4: () => import('./contact/shared-contact-4'),
    5: () => import('./contact/shared-contact-5'),
  },
} as const;

// Personality to variant mapping for default selection
export const PERSONALITY_VARIANT_MAP: Record<string, number> = {
  professional: 1,
  modern: 2,
  bold: 3,
  elegant: 4,
  friendly: 5,
} as const;

// Available section types (those with component implementations)
export const AVAILABLE_SECTION_TYPES = Object.keys(SECTION_COMPONENTS);

// Section type names
export type SectionType = keyof typeof SECTION_COMPONENTS;
export type VariantNumber = 1 | 2 | 3 | 4 | 5;
