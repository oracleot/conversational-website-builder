/**
 * POST /api/conversation - Create a new conversation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db/client';
import { createConversation } from '@/lib/db/queries';
import { cookies } from 'next/headers';
import type { IndustryType } from '@/lib/db/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    
    // Get current user (optional - allows anonymous)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Parse request body
    let industry: IndustryType | undefined;
    try {
      const body = await request.json();
      industry = body.industry;
    } catch {
      // Empty body is fine
    }

    // Create conversation
    const conversation = await createConversation(supabase, {
      userId: user?.id,
      industry,
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
