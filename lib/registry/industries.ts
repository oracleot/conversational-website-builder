import type { SectionType } from '@/lib/schemas';

/**
 * Industry Configuration
 * Defines available sections and flow for each industry type
 */

export interface IndustryConfig {
  id: 'service' | 'local';
  name: string;
  description: string;
  sections: {
    required: SectionType[];
    optional: SectionType[];
  };
  conversationFlow: SectionType[];
  examples: string[];
}

export const INDUSTRY_CONFIGS: Record<'service' | 'local', IndustryConfig> = {
  service: {
    id: 'service',
    name: 'Service Business',
    description: 'Professional services and B2B companies',
    sections: {
      required: ['hero', 'services', 'about', 'contact'],
      optional: ['process', 'portfolio', 'testimonials'],
    },
    conversationFlow: [
      'hero',
      'services',
      'about',
      'process',
      'testimonials',
      'portfolio',
      'contact',
    ],
    examples: [
      'Consulting firms',
      'Marketing agencies',
      'Law firms',
      'Design studios',
      'IT services',
      'Accounting firms',
    ],
  },
  local: {
    id: 'local',
    name: 'Local Business',
    description: 'Restaurants, retail, and location-based businesses',
    sections: {
      required: ['hero', 'menu', 'location', 'contact'],
      optional: ['about', 'gallery', 'testimonials'],
    },
    conversationFlow: [
      'hero',
      'menu',
      'about',
      'testimonials',
      'location',
      'gallery',
      'contact',
    ],
    examples: [
      'Restaurants',
      'Cafes',
      'Salons',
      'Retail stores',
      'Gyms',
      'Medical practices',
    ],
  },
};

/**
 * Get industry configuration by ID
 */
export function getIndustryConfig(industryId: 'service' | 'local'): IndustryConfig {
  return INDUSTRY_CONFIGS[industryId];
}

/**
 * Get all available sections for an industry
 */
export function getIndustrySections(industryId: 'service' | 'local'): SectionType[] {
  const config = getIndustryConfig(industryId);
  return [...config.sections.required, ...config.sections.optional];
}

/**
 * Check if a section is valid for an industry
 */
export function isSectionValidForIndustry(
  sectionType: SectionType,
  industryId: 'service' | 'local'
): boolean {
  const sections = getIndustrySections(industryId);
  return sections.includes(sectionType);
}

/**
 * Get conversation flow for an industry
 */
export function getConversationFlow(industryId: 'service' | 'local'): SectionType[] {
  return getIndustryConfig(industryId).conversationFlow;
}
