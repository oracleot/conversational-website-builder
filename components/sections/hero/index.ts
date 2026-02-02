/**
 * Hero Section Components - Barrel export
 */

export { ServiceHero1, metadata as serviceHero1Metadata } from './service-hero-1';
export { ServiceHero2, metadata as serviceHero2Metadata } from './service-hero-2';
export { ServiceHero3, metadata as serviceHero3Metadata } from './service-hero-3';
export { ServiceHero4, metadata as serviceHero4Metadata } from './service-hero-4';
export { ServiceHero5, metadata as serviceHero5Metadata } from './service-hero-5';

// Component map for dynamic loading
export const SERVICE_HERO_COMPONENTS = {
  1: 'service-hero-1',
  2: 'service-hero-2',
  3: 'service-hero-3',
  4: 'service-hero-4',
  5: 'service-hero-5',
} as const;
