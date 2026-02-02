import OpenAI from 'openai';

/**
 * OpenRouter-compatible AI client wrapper
 * Provides access to GPT-4o, Claude 3.5 Sonnet, and other models
 */

// Orchestration model (higher quality for conversation management)
export const ORCHESTRATION_MODEL = 'openai/gpt-4o';

// Extraction model (cost-effective for structured output)
export const EXTRACTION_MODEL = 'openai/gpt-4o-mini';

// Variant selection model (pattern matching)
export const VARIANT_SELECTION_MODEL = 'openai/gpt-4o-mini';

/**
 * OpenRouter client configured for model-agnostic access
 * Can switch between OpenAI, Anthropic, Google, and other providers
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Conversational Website Builder',
  },
});

/**
 * Extract structured content from user message using AI
 * @param systemPrompt - The extraction prompt for the specific section type
 * @param userMessage - The user's natural language response
 * @returns Parsed JSON object
 */
export async function extractStructuredContent<T>(
  systemPrompt: string,
  userMessage: string
): Promise<T> {
  const response = await openai.chat.completions.create({
    model: EXTRACTION_MODEL,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3, // Lower temperature for consistent extraction
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content returned from AI');
  }

  return JSON.parse(content) as T;
}

/**
 * Stream a chat response for conversational interactions
 * @param messages - The conversation history
 * @param systemPrompt - Optional system prompt override
 * @returns Async generator for streaming response
 */
export async function streamChatResponse(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  systemPrompt?: string
) {
  const allMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages;

  return await openai.chat.completions.create({
    model: ORCHESTRATION_MODEL,
    messages: allMessages,
    stream: true,
    temperature: 0.7, // Higher temperature for natural conversation
  });
}

/**
 * Business profile for site content generation
 */
export interface BusinessProfile {
  businessName: string;
  industry: string;
  services: string[];
  targetAudience: string;
  uniqueValue: string;
  tone?: string;
  personality?: string;
}

/**
 * Generate full site content from business profile using AI
 */
export async function generateSiteContent(
  profile: BusinessProfile,
  conversationContext?: string
): Promise<{
  success: boolean;
  content?: Record<string, unknown>;
  colorScheme?: string;
  sections?: string[];
  error?: string;
}> {
  const systemPrompt = `You are a professional website content generator. Create compelling, industry-appropriate content for a business website.

Business Profile:
- Name: ${profile.businessName}
- Industry: ${profile.industry}
- Services: ${profile.services.join(', ')}
- Target Audience: ${profile.targetAudience}
- Unique Value: ${profile.uniqueValue}
- Tone: ${profile.tone || 'professional'}

Generate content for each website section in JSON format:
{
  "hero": {
    "headline": "Main attention-grabbing headline",
    "subheadline": "Supporting text",
    "ctaPrimary": { "text": "CTA text", "href": "#contact" },
    "ctaSecondary": { "text": "Secondary CTA", "href": "#services" }
  },
  "services": {
    "title": "Section title",
    "subtitle": "Brief description",
    "items": [
      { "title": "Service name", "description": "Service description", "icon": "icon-name" }
    ]
  },
  "about": {
    "title": "About section title",
    "description": "Company story and mission",
    "highlights": ["Key point 1", "Key point 2", "Key point 3"],
    "image": { "src": "/placeholder-about.jpg", "alt": "About image" }
  },
  "process": {
    "title": "How we work",
    "subtitle": "Our process",
    "steps": [
      { "number": 1, "title": "Step title", "description": "Step description" }
    ]
  },
  "testimonials": {
    "title": "What our clients say",
    "items": [
      { "quote": "Testimonial text", "author": "Name", "role": "Job Title", "company": "Company" }
    ]
  },
  "portfolio": {
    "title": "Our Work",
    "subtitle": "Recent projects",
    "items": [
      { "title": "Project name", "category": "Category", "image": { "src": "/placeholder-1.jpg", "alt": "Project" }, "href": "#" }
    ]
  },
  "contact": {
    "title": "Get in Touch",
    "subtitle": "We would love to hear from you",
    "email": "contact@example.com",
    "phone": "(555) 123-4567",
    "address": "123 Business St, City, ST 12345",
    "hours": "Mon-Fri: 9am-5pm"
  },
  "colorScheme": "default",
  "sections": ["hero", "services", "about", "testimonials", "contact"]
}

Create realistic, industry-specific content. Use placeholder images with descriptive alt text.`;

  try {
    const response = await openai.chat.completions.create({
      model: EXTRACTION_MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: conversationContext 
            ? `Additional context from conversation:\n${conversationContext}\n\nGenerate the website content now.`
            : 'Generate the website content now.'
        },
      ],
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { success: false, error: 'No content returned from AI' };
    }

    const parsed = JSON.parse(content);
    const { colorScheme, sections, ...siteContent } = parsed;

    return {
      success: true,
      content: siteContent,
      colorScheme: colorScheme || 'default',
      sections: sections || ['hero', 'services', 'about', 'testimonials', 'contact'],
    };
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate content',
    };
  }
}
