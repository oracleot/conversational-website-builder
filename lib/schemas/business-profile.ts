import { z } from 'zod';

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
  colors: z
    .object({
      primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    })
    .optional(),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email(),
    address: z.string().optional(),
  }),
});

export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;
