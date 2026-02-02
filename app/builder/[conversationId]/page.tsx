/**
 * Builder Page - Main page for the website builder experience
 * Route: /builder/[conversationId]
 */

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/db/client';
import { getConversation } from '@/lib/db/queries';
import { BuilderLayout } from '@/components/builder/builder-layout';
import type { Message } from '@/lib/db/types';

interface BuilderPageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { conversationId } = await params;
  
  // Get conversation from database
  const supabase = await createServerClient(cookies());
  const conversation = await getConversation(supabase, conversationId);

  if (!conversation) {
    notFound();
  }

  return (
    <BuilderLayout
      conversationId={conversationId}
      initialData={{
        currentStep: conversation.currentStep,
        industry: conversation.industry ?? undefined,
        businessProfile: conversation.businessProfile ?? undefined,
        messages: (conversation.messages || []) as Message[],
      }}
    />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BuilderPageProps) {
  const { conversationId } = await params;
  
  return {
    title: 'Website Builder | Build Your Website',
    description: 'Create your professional website through a guided conversation',
    openGraph: {
      title: 'Website Builder',
      description: 'Create your professional website through a guided conversation',
    },
    robots: {
      index: false, // Don't index builder pages
    },
  };
}
