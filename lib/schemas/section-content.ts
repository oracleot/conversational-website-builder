import { z } from 'zod';

// Helper to transform null to undefined for optional fields
const nullToUndefined = <T>(schema: z.ZodType<T>) =>
  z.preprocess((val) => (val === null ? undefined : val), schema.optional());

/**
 * Hero Section Content Schema
 */
export const HeroContentSchema = z.object({
  headline: z.string().min(1).max(100),
  subheadline: z.string().min(1).max(200),
  cta: z.object({
    primary: z.string().min(1),
    primaryAction: z.string().min(1),
    secondary: nullToUndefined(z.string()),
    secondaryAction: nullToUndefined(z.string()),
  }).optional(),
  backgroundStyle: z.enum(['image', 'gradient', 'solid']),
  backgroundImage: nullToUndefined(z.string()),
});

export type HeroContent = z.infer<typeof HeroContentSchema>;

/**
 * Services/Offerings Content Schema (Service Industry)
 */
export const ServicesContentSchema = z.object({
  sectionTitle: z.string().min(1),
  sectionSubtitle: nullToUndefined(z.string()),
  sectionDescription: nullToUndefined(z.string()),
  services: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(50),
        description: z.string().min(1).max(200),
        icon: nullToUndefined(z.string()),
        features: nullToUndefined(z.array(z.string())),
      })
    )
    .min(1)
    .max(12),
});

export type ServicesContent = z.infer<typeof ServicesContentSchema>;

/**
 * Menu Content Schema (Local Industry)
 */
export const MenuContentSchema = z.object({
  sectionTitle: z.string().min(1),
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      items: z.array(
        z.object({
          id: z.string(),
          name: z.string().min(1),
          description: z.string().optional(),
          price: z.string().optional(),
          tags: z.array(z.string()).optional(),
        })
      ),
    })
  ),
});

export type MenuContent = z.infer<typeof MenuContentSchema>;

/**
 * About Content Schema
 */
export const AboutContentSchema = z.object({
  sectionTitle: z.string().min(1),
  title: z.string().optional(),
  headline: z.string().min(1),
  story: z.string().min(1).max(1000),
  mission: z.string().optional(),
  highlights: z
    .array(
      z.object({
        title: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  values: z
    .array(z.string())
    .optional(),
  stats: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  image: z.string().optional(),
  founderName: z.string().optional(),
  founderRole: z.string().optional(),
  founderImage: z.string().optional(),
});

export type AboutContent = z.infer<typeof AboutContentSchema>;

/**
 * Process Content Schema (Service Industry)
 */
export const ProcessContentSchema = z.object({
  sectionTitle: z.string().min(1),
  sectionSubtitle: z.string().optional(),
  sectionDescription: z.string().optional(),
  steps: z
    .array(
      z.object({
        id: z.string(),
        number: z.number().int().positive(),
        title: z.string().min(1),
        description: z.string().min(1),
        duration: z.string().optional(),
      })
    )
    .min(3)
    .max(6),
});

export type ProcessContent = z.infer<typeof ProcessContentSchema>;

/**
 * Portfolio Content Schema (Service Industry)
 */
export const PortfolioContentSchema = z.object({
  sectionTitle: z.string().min(1),
  sectionDescription: z.string().optional(),
  projects: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().min(1),
        category: z.string().optional(),
        image: z.string().optional(),
        link: z.string().optional(),
        results: z.array(z.string()).optional(),
      })
    )
    .min(1)
    .max(12),
});

export type PortfolioContent = z.infer<typeof PortfolioContentSchema>;

/**
 * Testimonials Content Schema
 */
export const TestimonialsContentSchema = z.object({
  sectionTitle: z.string().min(1),
  sectionDescription: z.string().optional(),
  testimonials: z
    .array(
      z.object({
        id: z.string(),
        quote: z.string().min(1).max(500),
        author: z.string().min(1),
        name: z.string().optional(), // Alternative to author
        role: z.string().optional(),
        company: z.string().optional(),
        avatar: z.string().optional(),
        image: z.string().optional(), // Alternative to avatar
        rating: z.number().int().min(1).max(5).optional(),
      })
    )
    .min(1)
    .max(10),
});

export type TestimonialsContent = z.infer<typeof TestimonialsContentSchema>;

/**
 * Location Content Schema (Local Industry)
 */
export const LocationContentSchema = z.object({
  sectionTitle: z.string().min(1),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().optional(),
  }),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  hours: z.array(
    z.object({
      days: z.string(),
      hours: z.string(),
    })
  ),
  mapEmbed: z.string().optional(),
});

export type LocationContent = z.infer<typeof LocationContentSchema>;

/**
 * Gallery Content Schema (Local Industry)
 */
export const GalleryContentSchema = z.object({
  sectionTitle: z.string().min(1),
  sectionSubtitle: z.string().optional(),
  images: z
    .array(
      z.object({
        id: z.string(),
        url: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
    )
    .min(3)
    .max(20),
});

export type GalleryContent = z.infer<typeof GalleryContentSchema>;

/**
 * Contact Content Schema
 */
export const ContactContentSchema = z.object({
  sectionTitle: z.string().min(1),
  heading: nullToUndefined(z.string()),
  subheading: nullToUndefined(z.string()),
  headline: nullToUndefined(z.string()),
  subtext: nullToUndefined(z.string()),
  showForm: z.boolean(),
  formFields: z
    .array(z.enum(['name', 'email', 'phone', 'message', 'subject']))
    .optional(),
  // Direct access fields for simpler components
  email: nullToUndefined(z.string()),
  phone: nullToUndefined(z.string()),
  address: nullToUndefined(z.string()),
  hours: nullToUndefined(z.string()),
  cta: nullToUndefined(z.string()),
  // Nested contact info (alternative structure)
  contactInfo: z
    .object({
      email: nullToUndefined(z.string().email()),
      phone: nullToUndefined(z.string()),
      address: nullToUndefined(z.string()),
    })
    .optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string(),
      })
    )
    .optional(),
});

export type ContactContent = z.infer<typeof ContactContentSchema>;

/**
 * Union type for all section content types
 */
export type SectionContent =
  | HeroContent
  | ServicesContent
  | MenuContent
  | AboutContent
  | ProcessContent
  | PortfolioContent
  | TestimonialsContent
  | LocationContent
  | GalleryContent
  | ContactContent;
