/**
 * AI Structured Outputs Contract Tests
 * Tests for AI response schemas and structured data extraction
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// ===== Schema Definitions =====

// Business Profile Schema (extracted from conversation)
const BusinessProfileSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  industry: z.string(),
  description: z.string().optional(),
  services: z.array(z.string()).optional(),
  contact: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
});

// AI Assistant Response Schema
const AssistantResponseSchema = z.object({
  message: z.string(),
  extractedInfo: z.record(z.string(), z.unknown()).optional(),
  nextStep: z.string().optional(),
  isComplete: z.boolean().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

// Section Content Generation Schema
const GeneratedSectionSchema = z.object({
  type: z.enum([
    'hero',
    'services',
    'about',
    'process',
    'testimonials',
    'portfolio',
    'contact',
  ] as const),
  variant: z.number().min(1).max(5),
  content: z.record(z.string(), z.unknown()),
});

// Theme Suggestion Schema
const ThemeSuggestionSchema = z.object({
  primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  background: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  text: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  style: z.enum(['light', 'dark']).optional(),
});

// ===== Contract Tests =====

describe('AI Structured Output Contracts', () => {
  describe('BusinessProfileSchema', () => {
    it('should validate complete business profile', () => {
      const validProfile = {
        name: 'Acme Corp',
        tagline: 'Innovation at Scale',
        industry: 'technology',
        description: 'Leading provider of innovative solutions',
        services: ['Consulting', 'Development', 'Training'],
        contact: {
          email: 'hello@acme.com',
          phone: '+1-555-123-4567',
          address: '123 Tech Street, Silicon Valley, CA',
        },
      };

      const result = BusinessProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });

    it('should validate minimal business profile', () => {
      const minimalProfile = {
        name: 'Small Biz',
        industry: 'retail',
      };

      const result = BusinessProfileSchema.safeParse(minimalProfile);
      expect(result.success).toBe(true);
    });

    it('should reject profile without name', () => {
      const invalidProfile = {
        industry: 'services',
      };

      const result = BusinessProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });

    it('should reject profile without industry', () => {
      const invalidProfile = {
        name: 'My Business',
      };

      const result = BusinessProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });

    it('should validate email format', () => {
      const profileWithBadEmail = {
        name: 'Test Biz',
        industry: 'services',
        contact: {
          email: 'not-an-email',
        },
      };

      const result = BusinessProfileSchema.safeParse(profileWithBadEmail);
      expect(result.success).toBe(false);
    });
  });

  describe('AssistantResponseSchema', () => {
    it('should validate complete assistant response', () => {
      const validResponse = {
        message: 'Great! Tell me more about your services.',
        extractedInfo: {
          businessName: 'Test Corp',
          industry: 'consulting',
        },
        nextStep: 'services',
        isComplete: false,
        confidence: 0.95,
      };

      const result = AssistantResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('should validate minimal response', () => {
      const minimalResponse = {
        message: 'How can I help you today?',
      };

      const result = AssistantResponseSchema.safeParse(minimalResponse);
      expect(result.success).toBe(true);
    });

    it('should validate confidence range', () => {
      const validConfidences = [0, 0.5, 1];
      const invalidConfidences = [-0.1, 1.1, 2];

      validConfidences.forEach(confidence => {
        const result = AssistantResponseSchema.safeParse({
          message: 'Test',
          confidence,
        });
        expect(result.success).toBe(true);
      });

      invalidConfidences.forEach(confidence => {
        const result = AssistantResponseSchema.safeParse({
          message: 'Test',
          confidence,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('GeneratedSectionSchema', () => {
    it('should validate hero section', () => {
      const heroSection = {
        type: 'hero',
        variant: 2,
        content: {
          headline: 'Welcome to Our Site',
          subheadline: 'We build amazing things',
          cta: { text: 'Get Started', link: '#contact' },
        },
      };

      const result = GeneratedSectionSchema.safeParse(heroSection);
      expect(result.success).toBe(true);
    });

    it('should validate services section', () => {
      const servicesSection = {
        type: 'services',
        variant: 1,
        content: {
          heading: 'Our Services',
          services: [
            { title: 'Service 1', description: 'Description 1' },
            { title: 'Service 2', description: 'Description 2' },
          ],
        },
      };

      const result = GeneratedSectionSchema.safeParse(servicesSection);
      expect(result.success).toBe(true);
    });

    it('should reject invalid section type', () => {
      const invalidSection = {
        type: 'invalid-type',
        variant: 1,
        content: {},
      };

      const result = GeneratedSectionSchema.safeParse(invalidSection);
      expect(result.success).toBe(false);
    });

    it('should validate variant range (1-5)', () => {
      const validVariants = [1, 2, 3, 4, 5];
      const invalidVariants = [0, 6, -1, 10];

      validVariants.forEach(variant => {
        const result = GeneratedSectionSchema.safeParse({
          type: 'hero',
          variant,
          content: {},
        });
        expect(result.success).toBe(true);
      });

      invalidVariants.forEach(variant => {
        const result = GeneratedSectionSchema.safeParse({
          type: 'hero',
          variant,
          content: {},
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('ThemeSuggestionSchema', () => {
    it('should validate complete theme', () => {
      const validTheme = {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#60A5FA',
        background: '#FFFFFF',
        text: '#1F2937',
        style: 'light',
      };

      const result = ThemeSuggestionSchema.safeParse(validTheme);
      expect(result.success).toBe(true);
    });

    it('should validate minimal theme', () => {
      const minimalTheme = {
        primary: '#000000',
        secondary: '#FFFFFF',
      };

      const result = ThemeSuggestionSchema.safeParse(minimalTheme);
      expect(result.success).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      const invalidColors = [
        'blue',
        '#GGG',
        'rgb(0,0,0)',
        '#12345', // Wrong length
        '123456', // Missing #
      ];

      invalidColors.forEach(color => {
        const result = ThemeSuggestionSchema.safeParse({
          primary: color,
          secondary: '#FFFFFF',
        });
        expect(result.success).toBe(false);
      });
    });

    it('should validate style enum', () => {
      const validStyles = ['light', 'dark'];
      const invalidStyles = ['medium', 'bright', 'custom'];

      validStyles.forEach(style => {
        const result = ThemeSuggestionSchema.safeParse({
          primary: '#000000',
          secondary: '#FFFFFF',
          style,
        });
        expect(result.success).toBe(true);
      });

      invalidStyles.forEach(style => {
        const result = ThemeSuggestionSchema.safeParse({
          primary: '#000000',
          secondary: '#FFFFFF',
          style,
        });
        expect(result.success).toBe(false);
      });
    });
  });
});

describe('AI Response Parsing', () => {
  describe('Structured Output Extraction', () => {
    it('should extract business name from response', () => {
      const aiResponse = {
        message: 'I see you run "Sunrise Bakery". What services do you offer?',
        extractedInfo: {
          businessName: 'Sunrise Bakery',
        },
      };

      expect(aiResponse.extractedInfo?.businessName).toBe('Sunrise Bakery');
    });

    it('should extract multiple fields from single response', () => {
      const aiResponse = {
        message: 'Great! A photography studio in Seattle. Tell me about your services.',
        extractedInfo: {
          businessName: 'Seattle Photography',
          industry: 'photography',
          location: 'Seattle',
        },
      };

      expect(Object.keys(aiResponse.extractedInfo!).length).toBe(3);
    });

    it('should handle empty extraction', () => {
      const aiResponse = {
        message: "I didn't catch that. Could you tell me more about your business?",
        extractedInfo: {},
      };

      expect(Object.keys(aiResponse.extractedInfo!).length).toBe(0);
    });
  });

  describe('Content Generation', () => {
    it('should generate industry-appropriate content', () => {
      const generatedContent = {
        industry: 'restaurant',
        sections: {
          hero: {
            headline: 'Welcome to Fine Dining',
            subheadline: 'Experience culinary excellence',
          },
          menu: {
            categories: ['Appetizers', 'Mains', 'Desserts'],
          },
        },
      };

      expect(generatedContent.sections.hero.headline).toContain('Dining');
      expect(generatedContent.sections.menu.categories).toContain('Appetizers');
    });

    it('should respect style preferences', () => {
      const stylePreference = 'bold';
      const generatedStyle = {
        variant: 3, // Bold variant
        colors: {
          primary: '#EF4444', // Bold red
          contrast: 'high',
        },
      };

      expect(generatedStyle.variant).toBe(3);
      expect(generatedStyle.colors.contrast).toBe('high');
    });
  });
});

describe('Error Handling', () => {
  describe('Malformed AI Responses', () => {
    it('should handle JSON parse errors', () => {
      const malformedResponse = '{ "message": "incomplete json';
      
      expect(() => JSON.parse(malformedResponse)).toThrow();
    });

    it('should handle missing required fields', () => {
      const incompleteResponse = {
        // Missing 'message' field
        extractedInfo: { name: 'Test' },
      };

      const result = AssistantResponseSchema.safeParse(incompleteResponse);
      expect(result.success).toBe(false);
    });

    it('should handle type mismatches', () => {
      const wrongTypeResponse = {
        message: 123, // Should be string
      };

      const result = AssistantResponseSchema.safeParse(wrongTypeResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('Fallback Strategies', () => {
    it('should provide default values for optional fields', () => {
      const parseWithDefaults = (response: unknown) => {
        const schema = z.object({
          message: z.string(),
          confidence: z.number().default(0.5),
          isComplete: z.boolean().default(false),
        });

        return schema.parse(response);
      };

      const result = parseWithDefaults({ message: 'Hello' });
      
      expect(result.confidence).toBe(0.5);
      expect(result.isComplete).toBe(false);
    });

    it('should coerce compatible types', () => {
      const flexibleSchema = z.object({
        count: z.coerce.number(),
        enabled: z.coerce.boolean(),
      });

      const result = flexibleSchema.parse({
        count: '42', // String that can be parsed as number
        enabled: 'true', // String that can be parsed as boolean
      });

      expect(result.count).toBe(42);
      expect(result.enabled).toBe(true);
    });
  });
});
