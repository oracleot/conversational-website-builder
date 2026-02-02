// Export all schemas and types
export * from './business-profile';
export * from './section-content';
export * from './site-config';

// Re-export commonly used types
export type { BusinessProfile } from './business-profile';
export type {
  HeroContent,
  ServicesContent,
  MenuContent,
  AboutContent,
  ProcessContent,
  PortfolioContent,
  TestimonialsContent,
  LocationContent,
  GalleryContent,
  ContactContent,
  SectionContent,
} from './section-content';
export type {
  SectionType,
  ThemeConfig,
  SectionConfig,
  SiteConfig,
  LaunchPreferences,
} from './site-config';

// Re-export schemas for validation
export {
  BusinessProfileSchema,
} from './business-profile';
export {
  HeroContentSchema,
  ServicesContentSchema,
  MenuContentSchema,
  AboutContentSchema,
  ProcessContentSchema,
  PortfolioContentSchema,
  TestimonialsContentSchema,
  LocationContentSchema,
  GalleryContentSchema,
  ContactContentSchema,
} from './section-content';
export {
  SectionTypeSchema,
  ThemeConfigSchema,
  SectionConfigSchema,
  SiteConfigSchema,
  LaunchPreferencesSchema,
} from './site-config';
