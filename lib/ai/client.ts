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
