/**
 * POST /api/conversation/[id]/extract - Extract structured content from user message
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db/client';
import { getConversation } from '@/lib/db/queries';
import { cookies } from 'next/headers';
import { createOrchestrator } from '@/lib/chat/orchestrator';
import type { SectionType, Message } from '@/lib/db/types';

interface RouteParams {
  params: Promise<{ conversationId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { conversationId } = await params;
    const supabase = await createServerClient(cookies());
    
    // Parse request
    const body = await request.json();
    const { sectionType, userMessage } = body as {
      sectionType: SectionType;
      userMessage: string;
    };

    if (!sectionType) {
      return NextResponse.json(
        { code: 'BAD_REQUEST', message: 'sectionType is required' },
        { status: 400 }
      );
    }

    // Get conversation context
    const conversation = await getConversation(supabase, conversationId);
    
    if (!conversation) {
      return NextResponse.json(
        { code: 'NOT_FOUND', message: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Create orchestrator with context
    const orchestrator = createOrchestrator({
      id: conversation.id,
      currentStep: conversation.currentStep,
      industry: conversation.industry ?? undefined,
      businessProfile: conversation.businessProfile ?? undefined,
      messages: (conversation.messages || []) as Message[]
    });

    // If userMessage provided, use it as additional context
    const messages = userMessage 
      ? [...(conversation.messages || []) as Message[], { 
          id: crypto.randomUUID(),
          role: 'user' as const,
          content: userMessage,
          timestamp: new Date().toISOString()
        }]
      : (conversation.messages || []) as Message[];

    // Extract content
    const result = await orchestrator.extractSectionContent(sectionType, messages);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Extraction failed',
          rawInput: result.rawInput,
          suggestedFields: result.content
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      content: result.content,
      confidence: result.confidence
    });

  } catch (error) {
    console.error('Error extracting content:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Failed to extract content' },
      { status: 500 }
    );
  }
}
