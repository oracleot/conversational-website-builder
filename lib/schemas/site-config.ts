import { z } from 'zod';
import { BusinessProfileSchema } from './business-profile';
import {
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

/**
 * Section Type Enum
 */
const sectionTypes = [
  'hero',
  'services',
  'menu',
  'about',
  'process',
  'portfolio',
  'testimonials',
  'location',
  'gallery',
  'contact',
] as const;
export const SectionTypeSchema = z.enum(sectionTypes);

export type SectionType = z.infer<typeof SectionTypeSchema>;

/**
 * Theme Configuration Schema
 */
const borderRadiusOptions = ['none', 'sm', 'md', 'lg', 'full'] as const;
export const ThemeConfigSchema = z.object({
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    foreground: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  borderRadius: z.enum(borderRadiusOptions),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

/**
 * Section Configuration Schema
 */
export const SectionConfigSchema = z.object({
  id: z.string(),
  type: SectionTypeSchema,
  selectedVariant: z.number().int().min(1).max(5),
  content: z.union([
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
  ]),
  aiSelected: z.boolean(),
  aiReasoning: z.string().optional(),
});

export type SectionConfig = z.infer<typeof SectionConfigSchema>;

/**
 * Site Configuration Schema
 */
export const SiteConfigSchema = z.object({
  businessProfile: BusinessProfileSchema,
  sections: z.array(SectionConfigSchema),
  theme: ThemeConfigSchema,
  sectionOrder: z.array(SectionTypeSchema),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;

/**
 * Launch Preferences Schema
 */
export const LaunchPreferencesSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  imagePreference: z.enum(['placeholders', 'provide_own', 'need_photography']),
  domainPreference: z.enum(['buy_new', 'use_existing', 'hosted_subdomain']),
  existingDomain: z.string().optional(),
  timeline: z.enum(['asap', 'this_week', 'this_month', 'no_rush']),
  notes: z.string().optional(),
});

export type LaunchPreferences = z.infer<typeof LaunchPreferencesSchema>;
