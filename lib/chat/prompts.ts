/**
 * AI Prompts for Conversation Orchestration and Content Extraction
 * 
 * Uses OpenRouter for model access - GPT-4o for orchestration, GPT-4o-mini for extraction
 */

import type { ConversationStep, IndustryType, SectionType } from '@/lib/db/types';

// ============================================================================
// SYSTEM PROMPTS FOR CONVERSATION ORCHESTRATION
// ============================================================================

/**
 * Main orchestration prompt that guides the entire conversation flow
 */
export const ORCHESTRATION_SYSTEM_PROMPT = `You are an expert website consultant helping small business owners build their perfect website through friendly conversation.

Your personality:
- Warm, encouraging, and professional
- Ask one question at a time
- Celebrate their answers positively
- Guide them through the process step by step
- Never overwhelm with technical jargon

Your goal is to gather information to build a complete website configuration. You'll guide users through:
1. Understanding their business type and industry
2. Collecting their business profile (name, tagline, brand personality)
3. Building each section of their website with their content

IMPORTANT RULES:
- Ask only 1-2 questions per message
- Wait for the user's response before moving to the next topic
- Be encouraging and acknowledge what they share
- If they seem stuck, provide helpful examples
- Keep responses concise but warm

Current conversation context will be provided. Your job is to guide them to the next piece of information needed.`;

/**
 * Get the orchestration prompt for a specific conversation step
 */
export function getStepPrompt(step: ConversationStep, _industry?: IndustryType): string {
  const prompts: Record<ConversationStep, string> = {
    industry_selection: `The user is just starting. Ask them what type of business they're building a website for. 
    
Explain there are two main types:
1. SERVICE businesses (consultants, agencies, professional services)
2. LOCAL businesses (restaurants, salons, retail shops)

Ask which best describes their business in a friendly way.`,

    business_profile: `Now gather their business profile. You need to collect:
- Business name
- A short, punchy tagline (encourage them!)
- A description of what they do and who they serve
- Their brand personality (2-3 words: professional, friendly, modern, elegant, bold, etc.)
- Contact email

Ask about these naturally, 1-2 at a time. Start with their business name.`,

    hero: `Time to create their hero section - the first thing visitors see!

Guide them to provide:
- A compelling headline (their main value proposition)
- A subheadline (supporting message)
- What their main call-to-action button should say

Help them think about what makes their business special and what action they want visitors to take.`,

    services: `Now let's showcase their services/offerings.

Help them list:
- 3-6 main services or offerings
- A brief description for each (1-2 sentences)
- Optional: key features or benefits

Ask them to describe what they offer and how it helps their clients.`,

    menu: `Let's build their menu section for their local business!

Guide them to provide:
- Menu categories (e.g., Appetizers, Mains, Desserts)
- Items within each category
- Prices and descriptions (optional)

Start by asking what types of items or services they offer.`,

    about: `Time for the About section - their story!

Help them share:
- Their story and how they got started
- What makes them unique
- Years in business, team size, or other credibility builders
- Their mission or values

Encourage authentic storytelling - this is where personality shines!`,

    process: `Let's explain their process to potential clients.

Guide them to describe:
- Their step-by-step process (3-6 steps work best)
- What happens at each stage
- What clients can expect

This helps build trust by showing professionalism.`,

    portfolio: `Time to showcase their work!

Ask about:
- 3-6 notable projects or case studies
- Brief descriptions of each
- The results or outcomes achieved
- Any client testimonials related to the work

Even if they don't have formal case studies, past work examples help.`,

    testimonials: `Let's add social proof with testimonials!

Guide them to provide:
- 2-4 customer testimonials or reviews
- The person's name and role (if available)
- Keep quotes authentic and specific

If they don't have formal testimonials, ask about positive feedback they've received.`,

    location: `Now for their location information!

Collect:
- Full business address
- Business hours (by day)
- Phone number
- Any special instructions (parking, entrance, etc.)

This helps local customers find and visit them.`,

    gallery: `Let's create a visual gallery!

Ask about:
- 4-12 photos they'd want to showcase
- What each photo represents
- Any themes or categories

Even without actual photos now, we can plan the gallery structure and use placeholders.`,

    contact: `Final section - the contact form and info!

Gather:
- What contact methods they prefer (form, phone, email, social)
- Which form fields they need (name, email, phone, message, etc.)
- Any specific questions they want to ask visitors
- Social media links

Make it easy for customers to reach out!`,

    review: `The user has completed all sections. Now summarize what we've built and ask if they'd like to:
1. Review and edit any section
2. Continue to preview their complete website
3. Make any final adjustments

Be celebratory - they've built their website content!`,

    complete: `Congratulations! Their website content is complete. Let them know they can:
1. Preview their full website
2. Switch between design variants
3. Export their site when ready
4. Request launch assistance

Thank them for their time and encourage them to explore their new website!`
  };

  return prompts[step] || prompts.business_profile;
}

// ============================================================================
// EXTRACTION PROMPTS FOR STRUCTURED CONTENT
// ============================================================================

/**
 * Generate an extraction prompt for a specific section type
 */
export function getExtractionPrompt(sectionType: SectionType): string {
  const extractionPrompts: Record<string, string> = {
    hero: `Extract hero section content from the user's message.

Return a JSON object with this exact structure:
{
  "headline": "Main headline text (max 100 chars)",
  "subheadline": "Supporting subheadline (max 200 chars)",
  "cta": {
    "primary": "Primary button text (e.g., 'Get Started', 'Book Now')",
    "primaryAction": "#contact",
    "secondary": "Optional secondary button text or null",
    "secondaryAction": "#learn-more or null"
  },
  "backgroundStyle": "gradient"
}

Rules:
- Extract the most compelling headline from their description
- If they don't specify a CTA, infer a relevant one based on their business
- backgroundStyle is always "gradient" for now
- Make content punchy and action-oriented`,

    services: `Extract services/offerings content from the user's message.

Return a JSON object with this exact structure:
{
  "sectionTitle": "Our Services",
  "sectionSubtitle": "Optional subtitle or null",
  "services": [
    {
      "id": "service-1",
      "title": "Service name (max 50 chars)",
      "description": "Brief description (max 200 chars)",
      "features": ["feature1", "feature2"] or null
    }
  ]
}

Rules:
- Extract 1-12 services from their description
- Generate unique IDs like "service-1", "service-2"
- Keep titles concise and benefit-focused
- If they mention features/benefits, include them`,

    menu: `Extract menu content from the user's message for a local business.

Return a JSON object with this exact structure:
{
  "sectionTitle": "Our Menu",
  "categories": [
    {
      "id": "cat-1",
      "name": "Category Name",
      "items": [
        {
          "id": "item-1",
          "name": "Item name",
          "description": "Brief description or null",
          "price": "$12.99 or null",
          "tags": ["vegetarian", "spicy"] or null
        }
      ]
    }
  ]
}

Rules:
- Organize items into logical categories
- Include prices if mentioned
- Add dietary tags if mentioned (vegetarian, vegan, gluten-free, spicy, etc.)`,

    about: `Extract about section content from the user's message.

Return a JSON object with this exact structure:
{
  "sectionTitle": "About Us",
  "headline": "Short compelling headline about the business",
  "story": "Their story in 2-4 paragraphs (max 1000 chars)",
  "highlights": [
    {"title": "Years in Business", "value": "15+"},
    {"title": "Clients Served", "value": "500+"}
  ] or null
}

Rules:
- Extract the authentic story from their description
- Identify any credibility builders (years, clients, awards) for highlights
- Keep the story conversational but professional`,

    process: `Extract process section content from the user's message.

Return a JSON object with this exact structure:
{
  "sectionTitle": "How We Work",
  "sectionSubtitle": "Optional subtitle or null",
  "steps": [
    {
      "id": "step-1",
      "number": 1,
      "title": "Step name (short)",
      "description": "What happens in this step"
    }
  ]
}

Rules:
- Extract 3-6 clear process steps
- Number them sequentially
- Keep descriptions actionable and clear`,

    portfolio: `Extract portfolio/case study content from the user's message.

Return a JSON object with this exact structure:
{
  "sectionTitle": "Our Work",
  "projects": [
    {
      "id": "project-1",
      "title": "Project or client name",
      "description": "Brief description of the work",
      "category": "Category or null",
      "link": "null"
    }
  ]
}

Rules:
- Extract 1-12 projects/case studies
- Include results if mentioned
- Categories help with filtering`,

    testimonials: `Extract testimonials content from the user's message.

Return a JSON object with this exact structure:
{
  "sectionTitle": "What Our Clients Say",
  "testimonials": [
    {
      "id": "testimonial-1",
      "quote": "The testimonial text (max 500 chars)",
      "author": "Client Name",
      "role": "Their role or null",
      "company": "Company name or null",
      "rating": 5 or null
    }
  ]
}

Rules:
- Extract authentic quotes from their description
- If they paraphrase feedback, turn it into a quote
- Include 1-10 testimonials`,

    location: `Extract location content from the user's message.

Return a JSON object with this exact structure:
{
  "sectionTitle": "Visit Us",
  "address": {
    "street": "123 Main St",
    "city": "City Name",
    "state": "ST",
    "zip": "12345",
    "country": "USA or null"
  },
  "phone": "Phone number or null",
  "email": "Email or null",
  "hours": [
    {"days": "Monday - Friday", "hours": "9:00 AM - 5:00 PM"},
    {"days": "Saturday", "hours": "10:00 AM - 2:00 PM"},
    {"days": "Sunday", "hours": "Closed"}
  ]
}

Rules:
- Parse address into components
- Format hours consistently
- Group similar days together`,

    gallery: `Extract gallery content from the user's message.

Return a JSON object with this exact structure:
{
  "sectionTitle": "Gallery",
  "sectionSubtitle": "Optional subtitle or null",
  "images": [
    {
      "id": "image-1",
      "url": "placeholder",
      "alt": "Description of what the image shows",
      "caption": "Optional caption or null"
    }
  ]
}

Rules:
- Extract 3-20 image descriptions
- Use descriptive alt text
- Group by theme if mentioned`,

    contact: `Extract contact section content from the user's message.

Return a JSON object with this exact structure:
{
  "sectionTitle": "Get In Touch",
  "headline": "Short headline or null",
  "subtext": "Encouraging message about reaching out or null",
  "showForm": true,
  "formFields": ["name", "email", "phone", "message"],
  "contactInfo": {
    "email": "email@example.com or null",
    "phone": "Phone or null",
    "address": "Address or null"
  },
  "socialLinks": [
    {"platform": "facebook", "url": "URL"}
  ] or null
}

Rules:
- Default to showing a form unless they say otherwise
- Include fields they specifically mention
- Add social links if mentioned`
  };

  return extractionPrompts[sectionType] || extractionPrompts.hero;
}

/**
 * Business profile extraction prompt
 */
export const BUSINESS_PROFILE_EXTRACTION_PROMPT = `Extract business profile information from the conversation.

Return a JSON object with this exact structure:
{
  "name": "Business Name",
  "industry": "service" or "local",
  "businessType": "Specific type (e.g., 'consulting', 'restaurant', 'law firm')",
  "tagline": "Short, catchy tagline (max 200 chars)",
  "description": "Full business description (max 2000 chars)",
  "brandPersonality": ["personality1", "personality2"],
  "colors": null,
  "contact": {
    "phone": "Phone or null",
    "email": "email@example.com",
    "address": "Address or null"
  }
}

Rules:
- Extract as much as available from the conversation
- For missing optional fields, use null
- brandPersonality should be 1-5 descriptive words
- Infer industry from business type if not explicitly stated`;

/**
 * Get the JSON schema for structured output extraction
 */
export function getSectionSchema(sectionType: SectionType): object {
  // Return JSON schemas that match our Zod schemas for AI structured output
  const schemas: Record<string, object> = {
    hero: {
      type: 'object',
      properties: {
        headline: { type: 'string', maxLength: 100 },
        subheadline: { type: 'string', maxLength: 200 },
        cta: {
          type: 'object',
          properties: {
            primary: { type: 'string' },
            primaryAction: { type: 'string' },
            secondary: { type: ['string', 'null'] },
            secondaryAction: { type: ['string', 'null'] }
          },
          required: ['primary', 'primaryAction']
        },
        backgroundStyle: { 
          type: 'string', 
          enum: ['image', 'gradient', 'solid'] 
        }
      },
      required: ['headline', 'subheadline', 'cta', 'backgroundStyle']
    },
    // Other schemas follow similar patterns
  };

  return schemas[sectionType] || schemas.hero;
}

// ============================================================================
// VARIANT SELECTION PROMPTS
// ============================================================================

/**
 * System prompt for AI-powered variant selection
 * Used when more sophisticated selection logic is needed beyond simple trait matching
 */
export const VARIANT_SELECTION_SYSTEM_PROMPT = `You are a design expert that helps match website section variants to brand personalities.

Each section type has 5 design variants with distinct personalities:
1. Professional - Clean, corporate design with strong credibility signals. Best for: consulting, legal, b2b services
2. Modern - Minimalist design with whitespace and sleek aesthetics. Best for: tech, startups, digital agencies
3. Bold - Eye-catching creative design with strong visual impact. Best for: creative agencies, entertainment, fashion
4. Elegant - High-end design with refined typography and premium feel. Best for: luxury brands, boutiques
5. Friendly - Warm, inviting design that feels personal and accessible. Best for: local businesses, community

Your job is to analyze a business profile and recommend the best variant for each section, explaining your reasoning.`;

/**
 * Generate a prompt to select the best variant for a section based on business profile
 */
export function getVariantSelectionPrompt(
  sectionType: SectionType,
  businessProfile: {
    name: string;
    industry: 'service' | 'local';
    businessType?: string;
    brandPersonality?: string[];
    description?: string;
  }
): string {
  const traits = businessProfile.brandPersonality?.join(', ') || 'not specified';
  
  return `Analyze this business and select the best design variant (1-5) for their ${sectionType} section.

Business Profile:
- Name: ${businessProfile.name}
- Industry: ${businessProfile.industry}
- Type: ${businessProfile.businessType || 'General business'}
- Brand Personality: ${traits}
- Description: ${businessProfile.description || 'Not provided'}

Variant Options:
1. Professional - Corporate, trustworthy, formal
2. Modern - Minimal, clean, tech-forward, contemporary  
3. Bold - Creative, artistic, vibrant, expressive
4. Elegant - Luxury, sophisticated, premium, refined
5. Friendly - Approachable, casual, warm, welcoming

Return a JSON object with this exact structure:
{
  "selectedVariant": <number 1-5>,
  "confidence": <number 0-100>,
  "reasoning": "<one sentence explaining why this variant matches their brand>",
  "alternatives": [
    {"variant": <number>, "reason": "<why this could also work>"}
  ]
}

Consider:
- Match variant personality to stated brand traits
- Consider industry standards (e.g., legal firms typically prefer professional)
- Think about their target audience based on business description
- Provide 1-2 good alternatives`;
}

/**
 * Generate a prompt to select variants for multiple sections at once
 */
export function getBatchVariantSelectionPrompt(
  sections: SectionType[],
  businessProfile: {
    name: string;
    industry: 'service' | 'local';
    businessType?: string;
    brandPersonality?: string[];
    description?: string;
  }
): string {
  const traits = businessProfile.brandPersonality?.join(', ') || 'not specified';
  
  return `Analyze this business and select the best design variant (1-5) for each section to create a cohesive website.

Business Profile:
- Name: ${businessProfile.name}
- Industry: ${businessProfile.industry}
- Type: ${businessProfile.businessType || 'General business'}
- Brand Personality: ${traits}
- Description: ${businessProfile.description || 'Not provided'}

Sections to design: ${sections.join(', ')}

Variant Options:
1. Professional - Corporate, trustworthy, formal
2. Modern - Minimal, clean, tech-forward
3. Bold - Creative, artistic, vibrant
4. Elegant - Luxury, sophisticated, premium
5. Friendly - Approachable, casual, warm

Return a JSON object with this exact structure:
{
  "selections": [
    {
      "section": "<section name>",
      "variant": <number 1-5>,
      "reasoning": "<brief explanation>"
    }
  ],
  "overallConsistency": "<how these choices work together>",
  "dominantStyle": "<which variant style dominates and why>"
}

Important:
- Maintain visual consistency across sections (typically use same variant or complementary ones)
- Match the dominant variant to their strongest brand trait
- Consider the flow from hero through to contact`;
}
