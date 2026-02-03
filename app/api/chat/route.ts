/**
 * POST /api/chat - Stream a chat response
 * 
 * Sends a user message and streams an AI response using OpenRouter
 */

import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/db/client';
import { getConversation, addMessage } from '@/lib/db/queries';
import { cookies } from 'next/headers';
import { createOrchestrator } from '@/lib/chat/orchestrator';
import type { Message } from '@/lib/db/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    
    // Parse request
    const body = await request.json();
    const { conversationId, message, isEditingMode, existingSectionContent, selectedSections } = body as {
      conversationId: string;
      message: string;
      isEditingMode?: boolean;
      existingSectionContent?: unknown;
      selectedSections?: string[];
    };

    if (!conversationId || !message) {
      return new Response(
        JSON.stringify({ code: 'BAD_REQUEST', message: 'conversationId and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (message.length > 5000) {
      return new Response(
        JSON.stringify({ code: 'BAD_REQUEST', message: 'Message too long (max 5000 characters)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get conversation
    const conversation = await getConversation(supabase, conversationId);
    
    if (!conversation) {
      return new Response(
        JSON.stringify({ code: 'NOT_FOUND', message: 'Conversation not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add user message to conversation
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      metadata: { step: conversation.currentStep }
    };

    await addMessage(supabase, conversationId, userMessage);

    // Create orchestrator with updated context
    const orchestrator = createOrchestrator({
      id: conversation.id,
      currentStep: conversation.currentStep,
      industry: conversation.industry ?? undefined,
      businessProfile: conversation.businessProfile ?? undefined,
      messages: [...((conversation.messages || []) as Message[]), userMessage],
      selectedSections: selectedSections as any // Pass user-selected sections to orchestrator
    });

    // Create streaming response
    const encoder = new TextEncoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Add editing mode context to the system prompt if applicable
          let editingContext = '';
          if (isEditingMode && existingSectionContent) {
            editingContext = `\n\nIMPORTANT: The user is EDITING an existing section. Current content:\n${JSON.stringify(existingSectionContent, null, 2)}\n\nHelp them refine or update this content. Ask what they'd like to change specifically.`;
          }
          
          // Stream response chunks
          for await (const chunk of orchestrator.streamResponse(editingContext)) {
            fullResponse += chunk;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
          }

          // Save assistant message after streaming completes
          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date().toISOString(),
            metadata: { step: conversation.currentStep }
          };

          await addMessage(supabase, conversationId, assistantMessage);

          // Determine if we should advance to next step
          // Pass AI response to detect "move on" signals immediately
          const transition = await orchestrator.determineNextStep(message, fullResponse);
          
          if (transition.nextStep !== conversation.currentStep) {
            // Update conversation step
            const { updateConversation } = await import('@/lib/db/queries');
            await updateConversation(supabase, conversationId, {
              currentStep: transition.nextStep,
              industry: orchestrator['context'].industry
            });

            // Send step update event
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ 
                type: 'step_update', 
                nextStep: transition.nextStep,
                shouldExtract: transition.shouldExtract,
                extractionType: transition.extractionType
              })}\n\n`
            ));
          }

          // Send done event
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({ error: 'Stream error' })}\n\n`
          ));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat:', error);
    return new Response(
      JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Chat failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
