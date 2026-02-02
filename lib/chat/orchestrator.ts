/**
 * ConversationOrchestrator - Manages conversation flow and content extraction
 * 
 * Responsible for:
 * - Managing conversation step progression
 * - Generating contextual AI responses
 * - Extracting structured content from user messages
 * - Validating extracted content with Zod schemas
 */

import { openai, ORCHESTRATION_MODEL, EXTRACTION_MODEL } from '@/lib/ai/client';
import { 
  ORCHESTRATION_SYSTEM_PROMPT, 
  getStepPrompt, 
  getExtractionPrompt,
  BUSINESS_PROFILE_EXTRACTION_PROMPT 
} from './prompts';
import { 
  BusinessProfileSchema,
  HeroContentSchema,
  ServicesContentSchema,
  AboutContentSchema,
  ProcessContentSchema,
  PortfolioContentSchema,
  TestimonialsContentSchema,
  ContactContentSchema,
  MenuContentSchema,
  LocationContentSchema,
  GalleryContentSchema
} from '@/lib/schemas';
import type { 
  ConversationStep, 
  IndustryType, 
  Message, 
  SectionType,
  BusinessProfile
} from '@/lib/db/types';
import type { z } from 'zod';

// ============================================================================
// TYPES
// ============================================================================

export interface ConversationContext {
  id: string;
  currentStep: ConversationStep;
  industry?: IndustryType;
  businessProfile?: BusinessProfile;
  messages: Message[];
}

export interface ExtractionResult<T> {
  success: boolean;
  content?: T;
  confidence?: number;
  error?: string;
  rawInput?: string;
}

export interface StepTransitionResult {
  nextStep: ConversationStep;
  shouldExtract: boolean;
  extractionType?: 'business_profile' | SectionType;
}

// ============================================================================
// STEP FLOW CONFIGURATION
// ============================================================================

const SERVICE_INDUSTRY_STEPS: ConversationStep[] = [
  'industry_selection',
  'business_profile',
  'hero',
  'services',
  'about',
  'process',
  'portfolio',
  'testimonials',
  'contact',
  'review',
  'complete'
];

const LOCAL_INDUSTRY_STEPS: ConversationStep[] = [
  'industry_selection',
  'business_profile',
  'hero',
  'menu',
  'about',
  'location',
  'gallery',
  'testimonials',
  'contact',
  'review',
  'complete'
];

/**
 * Get the step flow for a given industry
 */
export function getStepFlow(industry?: IndustryType): ConversationStep[] {
  if (industry === 'local') return LOCAL_INDUSTRY_STEPS;
  if (industry === 'service') return SERVICE_INDUSTRY_STEPS;
  // Default to service if not yet selected
  return SERVICE_INDUSTRY_STEPS;
}

/**
 * Get the section type for a conversation step
 */
export function getSectionTypeForStep(step: ConversationStep): SectionType | null {
  const sectionSteps: ConversationStep[] = [
    'hero', 'services', 'menu', 'about', 'process', 
    'portfolio', 'testimonials', 'location', 'gallery', 'contact'
  ];
  
  if (sectionSteps.includes(step)) {
    return step as SectionType;
  }
  return null;
}

// ============================================================================
// CONVERSATION ORCHESTRATOR CLASS
// ============================================================================

export class ConversationOrchestrator {
  private context: ConversationContext;

  constructor(context: ConversationContext) {
    this.context = context;
  }

  /**
   * Generate the next AI response based on current conversation state
   */
  async generateResponse(): Promise<string> {
    const stepPrompt = getStepPrompt(this.context.currentStep, this.context.industry);
    
    const systemPrompt = `${ORCHESTRATION_SYSTEM_PROMPT}

Current Step: ${this.context.currentStep}
${this.context.industry ? `Industry: ${this.context.industry}` : ''}
${this.context.businessProfile ? `Business: ${this.context.businessProfile.name}` : ''}

Step-specific guidance:
${stepPrompt}`;

    const messages = this.context.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: ORCHESTRATION_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0]?.message?.content || 'I apologize, I encountered an issue. Could you please repeat that?';
  }

  /**
   * Stream a response for real-time display
   */
  async *streamResponse(): AsyncGenerator<string> {
    const stepPrompt = getStepPrompt(this.context.currentStep, this.context.industry);
    
    const systemPrompt = `${ORCHESTRATION_SYSTEM_PROMPT}

Current Step: ${this.context.currentStep}
${this.context.industry ? `Industry: ${this.context.industry}` : ''}
${this.context.businessProfile ? `Business: ${this.context.businessProfile.name}` : ''}

Step-specific guidance:
${stepPrompt}`;

    const messages = this.context.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

    const stream = await openai.chat.completions.create({
      model: ORCHESTRATION_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  /**
   * Determine the next step based on user response
   */
  async determineNextStep(userMessage: string): Promise<StepTransitionResult> {
    const currentStep = this.context.currentStep;
    const stepFlow = getStepFlow(this.context.industry);
    const currentIndex = stepFlow.indexOf(currentStep);
    
    // Handle industry selection separately
    if (currentStep === 'industry_selection') {
      const industry = this.detectIndustry(userMessage);
      if (industry) {
        return {
          nextStep: 'business_profile',
          shouldExtract: false
        };
      }
      // Stay on industry selection if not detected
      return { nextStep: 'industry_selection', shouldExtract: false };
    }

    // Handle business profile - check if complete
    if (currentStep === 'business_profile') {
      const hasEnoughInfo = await this.checkBusinessProfileComplete(userMessage);
      if (hasEnoughInfo) {
        return {
          nextStep: 'hero',
          shouldExtract: true,
          extractionType: 'business_profile'
        };
      }
      return { nextStep: 'business_profile', shouldExtract: false };
    }

    // For section steps, determine if ready to move on
    const sectionType = getSectionTypeForStep(currentStep);
    if (sectionType) {
      const isComplete = await this.checkSectionComplete(userMessage, sectionType);
      if (isComplete && currentIndex < stepFlow.length - 1) {
        return {
          nextStep: stepFlow[currentIndex + 1],
          shouldExtract: true,
          extractionType: sectionType
        };
      }
      return { nextStep: currentStep, shouldExtract: false };
    }

    // Review and complete steps
    if (currentStep === 'review') {
      if (userMessage.toLowerCase().includes('done') || 
          userMessage.toLowerCase().includes('complete') ||
          userMessage.toLowerCase().includes('preview')) {
        return { nextStep: 'complete', shouldExtract: false };
      }
      return { nextStep: 'review', shouldExtract: false };
    }

    return { nextStep: currentStep, shouldExtract: false };
  }

  /**
   * Detect industry type from user message
   */
  private detectIndustry(message: string): IndustryType | null {
    const lowerMessage = message.toLowerCase();
    
    const serviceKeywords = [
      'service', 'consulting', 'consultant', 'agency', 'professional',
      'law', 'accounting', 'marketing', 'design', 'developer', 'coaching',
      'therapy', 'healthcare', 'b2b', 'saas', 'software'
    ];
    
    const localKeywords = [
      'local', 'restaurant', 'cafe', 'salon', 'barbershop', 'retail',
      'store', 'shop', 'gym', 'fitness', 'spa', 'bakery', 'pizzeria',
      'bar', 'pub', 'boutique', 'florist'
    ];

    const hasServiceKeyword = serviceKeywords.some(kw => lowerMessage.includes(kw));
    const hasLocalKeyword = localKeywords.some(kw => lowerMessage.includes(kw));

    if (hasLocalKeyword && !hasServiceKeyword) return 'local';
    if (hasServiceKeyword && !hasLocalKeyword) return 'service';
    if (lowerMessage.includes('1') || lowerMessage.includes('first')) return 'service';
    if (lowerMessage.includes('2') || lowerMessage.includes('second')) return 'local';

    return null;
  }

  /**
   * Check if business profile information is complete enough to proceed
   */
  private async checkBusinessProfileComplete(_userMessage: string): Promise<boolean> {
    // Check if we have accumulated enough messages about the business
    const profileMessages = this.context.messages.filter(m => 
      m.metadata?.step === 'business_profile'
    );
    
    // Need at least 2-3 exchanges to gather profile info
    if (profileMessages.length < 4) return false;

    // Use AI to determine if we have enough info
    const response = await openai.chat.completions.create({
      model: EXTRACTION_MODEL,
      messages: [
        {
          role: 'system',
          content: `Analyze this conversation and determine if we have enough business information to proceed. 
We need: business name, tagline/value proposition, description, brand personality, and contact email.
Respond with just "true" if we have all required info, or "false" if we need more.`
        },
        {
          role: 'user',
          content: JSON.stringify(this.context.messages.slice(-8))
        }
      ],
      temperature: 0,
      max_tokens: 10
    });

    return response.choices[0]?.message?.content?.toLowerCase().includes('true') || false;
  }

  /**
   * Check if section content is complete enough to proceed
   */
  private async checkSectionComplete(userMessage: string, sectionType: SectionType): Promise<boolean> {
    const response = await openai.chat.completions.create({
      model: EXTRACTION_MODEL,
      messages: [
        {
          role: 'system',
          content: `Analyze this message and determine if the user has provided enough content for the "${sectionType}" section of their website.
They may have provided partial info across multiple messages. Check if core required fields are present.
Respond with just "true" if ready to proceed, or "false" if we need more information.`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0,
      max_tokens: 10
    });

    return response.choices[0]?.message?.content?.toLowerCase().includes('true') || false;
  }

  /**
   * Extract structured content from user messages for a section
   */
  async extractSectionContent<T>(
    sectionType: SectionType | 'business_profile',
    recentMessages?: Message[]
  ): Promise<ExtractionResult<T>> {
    const messagesToUse = recentMessages || this.context.messages.slice(-10);
    const conversationText = messagesToUse
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const extractionPrompt = sectionType === 'business_profile'
      ? BUSINESS_PROFILE_EXTRACTION_PROMPT
      : getExtractionPrompt(sectionType as SectionType);

    try {
      const response = await openai.chat.completions.create({
        model: EXTRACTION_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: extractionPrompt },
          { role: 'user', content: conversationText }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return { 
          success: false, 
          error: 'No content returned from AI',
          rawInput: conversationText 
        };
      }

      const parsed = JSON.parse(content);
      
      // Validate with appropriate schema
      const validated = this.validateContent(sectionType, parsed);
      
      if (!validated.success) {
        return {
          success: false,
          error: validated.error,
          rawInput: conversationText,
          content: parsed as T // Return raw parsed for partial use
        };
      }

      return {
        success: true,
        content: validated.data as T,
        confidence: 0.85 // Could be calculated based on completeness
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Extraction failed',
        rawInput: conversationText
      };
    }
  }

  /**
   * Validate extracted content against Zod schemas
   */
  private validateContent(
    sectionType: SectionType | 'business_profile', 
    data: unknown
  ): { success: boolean; data?: unknown; error?: string } {
    const schemas: Record<string, z.ZodSchema> = {
      business_profile: BusinessProfileSchema,
      hero: HeroContentSchema,
      services: ServicesContentSchema,
      menu: MenuContentSchema,
      about: AboutContentSchema,
      process: ProcessContentSchema,
      portfolio: PortfolioContentSchema,
      testimonials: TestimonialsContentSchema,
      location: LocationContentSchema,
      gallery: GalleryContentSchema,
      contact: ContactContentSchema
    };

    const schema = schemas[sectionType];
    if (!schema) {
      return { success: true, data }; // No schema, pass through
    }

    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }

    return { 
      success: false, 
      error: result.error.issues.map(i => i.message).join(', '),
      data // Return original data for partial use
    };
  }

  /**
   * Get progress percentage through conversation
   */
  getProgress(): { current: number; total: number; percentage: number } {
    const stepFlow = getStepFlow(this.context.industry);
    const currentIndex = stepFlow.indexOf(this.context.currentStep);
    const total = stepFlow.length - 1; // Exclude 'complete' step
    const current = Math.max(0, currentIndex);
    
    return {
      current,
      total,
      percentage: Math.round((current / total) * 100)
    };
  }

  /**
   * Get list of completed sections
   */
  getCompletedSections(): SectionType[] {
    const stepFlow = getStepFlow(this.context.industry);
    const currentIndex = stepFlow.indexOf(this.context.currentStep);
    
    return stepFlow
      .slice(0, currentIndex)
      .filter(step => getSectionTypeForStep(step) !== null)
      .map(step => step as SectionType);
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function createOrchestrator(context: ConversationContext): ConversationOrchestrator {
  return new ConversationOrchestrator(context);
}
