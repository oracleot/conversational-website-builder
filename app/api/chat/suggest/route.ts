/**
 * POST /api/chat/suggest - Generate a structured suggestion for a section
 */

import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/db/client';
import { getConversation } from '@/lib/db/queries';
import { cookies } from 'next/headers';
import { openai, EXTRACTION_MODEL } from '@/lib/ai/client';
import { getSuggestionJsonPrompt } from '@/lib/chat/prompts';
import {
  HeroContentSchema,
  ServicesContentSchema,
  AboutContentSchema,
  ProcessContentSchema,
  PortfolioContentSchema,
  TestimonialsContentSchema,
  ContactContentSchema,
} from '@/lib/schemas';
import type { SectionType } from '@/lib/db/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    const body = await request.json();
    const { conversationId, sectionType } = body as {
      conversationId: string;
      sectionType: SectionType;
    };

    if (!conversationId || !sectionType) {
      return new Response(
        JSON.stringify({ code: 'BAD_REQUEST', message: 'conversationId and sectionType are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const conversation = await getConversation(supabase, conversationId);
    if (!conversation) {
      return new Response(
        JSON.stringify({ code: 'NOT_FOUND', message: 'Conversation not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const businessProfile = conversation.businessProfile ?? null;
    const industry = conversation.industry ?? 'service';

    const response = await openai.chat.completions.create({
      model: EXTRACTION_MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: getSuggestionJsonPrompt(sectionType) },
        {
          role: 'user',
          content: `Business profile: ${JSON.stringify(businessProfile)}\nIndustry: ${industry}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 1200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return new Response(
        JSON.stringify({ code: 'INTERNAL_ERROR', message: 'No content returned from AI' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const parsed = JSON.parse(content);

    const schemaMap: Record<SectionType, { safeParse: (data: unknown) => { success: boolean; error?: { issues: { message: string }[] } } }> = {
      hero: HeroContentSchema,
      services: ServicesContentSchema,
      about: AboutContentSchema,
      process: ProcessContentSchema,
      portfolio: PortfolioContentSchema,
      testimonials: TestimonialsContentSchema,
      contact: ContactContentSchema,
    };

    const schema = schemaMap[sectionType];
    const result = schema.safeParse(parsed);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          code: 'INVALID_SUGGESTION',
          message: result.error?.issues.map((issue) => issue.message).join(', ') || 'Suggestion validation failed',
        }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, sectionType, content: parsed }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Suggestion error:', error);
    return new Response(
      JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Suggestion generation failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
