import { z } from 'zod';

// Helper to transform null to undefined for optional fields
const nullToUndefined = <T>(schema: z.ZodType<T>) =>
  z.preprocess((val) => (val === null ? undefined : val), schema.optional());

/**
 * Business Profile Schema
 * Core business information extracted during conversation
 */
export const BusinessProfileSchema = z.object({
  name: z.string().min(1).max(100),
  industry: z.enum(['service', 'local']),
  businessType: z.string().min(1),
  tagline: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  brandPersonality: z.array(z.string()).min(1),
  colors: nullToUndefined(
    z.object({
      primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    })
  ),
  contact: z.object({
    phone: nullToUndefined(z.string()),
    email: z.string().email(),
    address: nullToUndefined(z.string()),
  }),
});

export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;
