/**
 * GET, PATCH, DELETE /api/conversation/[conversationId]
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db/client';
import { getConversation, updateConversation, deleteConversation } from '@/lib/db/queries';
import { cookies } from 'next/headers';
import type { ConversationStep, IndustryType, BusinessProfile } from '@/lib/db/types';

interface RouteParams {
  params: Promise<{ conversationId: string }>;
}

/**
 * GET /api/conversation/[id] - Get conversation details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { conversationId } = await params;
    const supabase = await createServerClient(cookies());
    
    const conversation = await getConversation(supabase, conversationId);
    
    if (!conversation) {
      return NextResponse.json(
        { code: 'NOT_FOUND', message: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error getting conversation:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Failed to get conversation' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/conversation/[id] - Update conversation state
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { conversationId } = await params;
    const supabase = await createServerClient(cookies());
    
    const body = await request.json();
    
    // Validate update fields
    const updates: {
      industry?: IndustryType;
      currentStep?: ConversationStep;
      businessProfile?: BusinessProfile;
    } = {};

    if (body.industry && ['service', 'local'].includes(body.industry)) {
      updates.industry = body.industry;
    }
    
    if (body.currentStep) {
      updates.currentStep = body.currentStep;
    }
    
    if (body.businessProfile) {
      updates.businessProfile = body.businessProfile;
    }

    const conversation = await updateConversation(supabase, conversationId, updates);
    
    if (!conversation) {
      return NextResponse.json(
        { code: 'NOT_FOUND', message: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/conversation/[id] - Delete conversation
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { conversationId } = await params;
    const supabase = await createServerClient(cookies());
    
    await deleteConversation(supabase, conversationId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
