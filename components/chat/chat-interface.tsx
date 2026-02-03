'use client';

/**
 * ChatInterface - Main chat UI component for section-focused building
 * Dark theme matching the landing page aesthetic
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { cn } from '@/lib/utils';
import type { Message, ConversationStep, IndustryType } from '@/lib/db/types';
import type { OnboardingData } from '@/components/builder/onboarding-form';

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages?: Message[];
  currentStep: ConversationStep;
  industry?: IndustryType;
  onStepChange?: (step: ConversationStep) => void;
  onExtraction?: (type: string, content: unknown) => void;
  className?: string;
  businessInfo?: OnboardingData | null;
  currentSectionTitle?: string;
}

// Section-focused welcome message
const getSectionWelcomeMessage = (
  sectionTitle: string | undefined,
  businessName: string | undefined
): Message => {
  const name = businessName || 'your business';
  const section = sectionTitle || 'Hero Section';
  
  const sectionPrompts: Record<string, string> = {
    'Hero Section': `Let's create an impactful hero section for ${name}! 🎯

I'll need a few things from you:
• **Headline** - Your main value proposition (what makes you special?)
• **Subheadline** - A supporting message that expands on the headline
• **Call-to-action** - What should visitors do? (e.g., "Get Started", "Book a Call")

What's the main message you want visitors to see first?`,
    
    'Services': `Now let's showcase what ${name} offers! 💼

Tell me about your services:
• What are the main services or offerings?
• What benefits do clients get from each?
• Any pricing or packages you want to highlight?

You can list them out or describe them in your own words.`,
    
    'Menu': `Time to show off the menu! 🍽️

Share your menu items with me:
• Popular dishes or items
• Prices (if you want to show them)
• Special categories or sections

Just describe what you offer and I'll organize it beautifully.`,
    
    'About': `Let's tell the story of ${name}! 👋

I'd love to hear:
• How did ${name} get started?
• What's your mission or vision?
• What makes you different from competitors?
• Any impressive stats (years in business, clients served, etc.)?`,
    
    'Process': `Let's show how you work with clients! 📋

Walk me through your typical process:
• What are the main steps?
• How long does each step take?
• What can clients expect at each stage?`,
    
    'Testimonials': `Social proof time! ⭐

Share some testimonials:
• What have clients said about working with ${name}?
• Any specific results or outcomes you can quote?
• Who are the clients (names, companies, or just titles)?`,
    
    'Portfolio': `Let's showcase your best work! 🎨

Tell me about your favorite projects:
• What was the project?
• Who was the client?
• What were the results?`,
    
    'Gallery': `Time for some visuals! 🖼️

Describe the photos you'd like to showcase:
• Photos of your space
• Action shots of your work
• Team photos
• Before/after images`,
    
    'Location': `Let's help people find you! 📍

Share your location details:
• Address
• Business hours
• Parking info
• Any landmarks to help people find you?`,
    
    'Contact': `Last but not least - let's make it easy to reach you! 📧

I already have your email from earlier. Let me know:
• Preferred contact method?
• Any call-to-action message? (e.g., "Get a free quote")
• Social media links to include?`,
  };

  const content = sectionPrompts[section] || 
    `Let's work on your ${section.toLowerCase()}. Tell me what you'd like to include!`;

  return {
    id: `welcome-${section.replace(/\s+/g, '-').toLowerCase()}`,
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
    metadata: { step: section.replace(/\s+/g, '_').toLowerCase() as ConversationStep },
  };
};

export function ChatInterface({
  conversationId,
  initialMessages = [],
  currentStep,
  industry,
  onStepChange,
  onExtraction,
  className,
  businessInfo,
  currentSectionTitle,
}: ChatInterfaceProps) {
  // Use useMemo for initial messages to prevent recreation on each render
  const initialMessagesComputed = useMemo(() => {
    if (initialMessages.length === 0) {
      return [getSectionWelcomeMessage(currentSectionTitle, businessInfo?.businessName)];
    }
    return initialMessages;
  }, []); // Only compute once on mount
  
  const [messages, setMessages] = useState<Message[]>(initialMessagesComputed);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Use ref for lastSectionTitle to prevent re-render loops
  const lastSectionTitleRef = useRef<string | undefined>(currentSectionTitle);
  
  // Detect section changes and add welcome message for new section
  useEffect(() => {
    if (currentSectionTitle && currentSectionTitle !== lastSectionTitleRef.current) {
      lastSectionTitleRef.current = currentSectionTitle;
      // Add welcome message for the new section (use requestAnimationFrame to batch updates)
      requestAnimationFrame(() => {
        const welcomeMessage = getSectionWelcomeMessage(currentSectionTitle, businessInfo?.businessName);
        setMessages(prev => [...prev, welcomeMessage]);
      });
    }
  }, [currentSectionTitle, businessInfo?.businessName]);

  const handleExtraction = useCallback(async (extractionType: string) => {
    try {
      const response = await fetch(`/api/conversation/${conversationId}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionType: extractionType }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.content) {
          onExtraction?.(extractionType, data.content);
        }
      }
    } catch (error) {
      console.error('Extraction error:', error);
    }
  }, [conversationId, onExtraction]);

  const sendMessage = useCallback(async (content: string) => {
    if (isLoading) return;

    // Add user message optimistically
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      metadata: { step: currentStep },
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream');
      }

      let fullResponse = '';
      let stepUpdate: { nextStep?: ConversationStep; shouldExtract?: boolean; extractionType?: string } | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.content) {
                fullResponse += parsed.content;
                setStreamingMessage(fullResponse);
              }
              
              if (parsed.type === 'step_update') {
                stepUpdate = parsed;
              }
              
              if (parsed.error) {
                console.error('Stream error:', parsed.error);
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      // Add complete assistant message
      if (fullResponse) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date().toISOString(),
          metadata: { step: currentStep },
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }

      // Handle step transition
      if (stepUpdate?.nextStep && stepUpdate.nextStep !== currentStep) {
        onStepChange?.(stepUpdate.nextStep);
        
        // Handle extraction if needed
        if (stepUpdate.shouldExtract && stepUpdate.extractionType) {
          await handleExtraction(stepUpdate.extractionType);
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      
    } finally {
      setIsLoading(false);
      setStreamingMessage('');
    }
  }, [conversationId, currentStep, isLoading, onStepChange, handleExtraction]);

  return (
    <div className={cn('flex flex-col h-full bg-[#0a0a0f]', className)}>
      {/* Section Header */}
      {currentSectionTitle && (
        <div className="shrink-0 px-4 py-3 border-b border-white/5 bg-[#0a0a0f]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Working on: {currentSectionTitle}</h2>
              <p className="text-xs text-zinc-500">Answer the questions to complete this section</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <MessageList
        messages={messages}
        streamingMessage={streamingMessage}
        isTyping={isLoading && !streamingMessage}
        className="flex-1"
        darkMode
      />

      {/* Input */}
      <div className="shrink-0 px-4 py-4 border-t border-white/5 bg-[#0a0a0f]">
        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          placeholder={getPlaceholder(currentStep)}
          darkMode
        />
      </div>
    </div>
  );
}

function getPlaceholder(step: ConversationStep): string {
  const placeholders: Partial<Record<ConversationStep, string>> = {
    industry_selection: 'Describe your business type...',
    business_profile: 'Tell me about your business...',
    hero: 'What should visitors see first?',
    services: 'What services do you offer?',
    menu: 'Describe your menu items...',
    about: 'Share your story...',
    process: 'How do you work with clients?',
    portfolio: 'Tell me about your past work...',
    testimonials: 'Share customer feedback...',
    location: 'Where are you located?',
    gallery: 'What photos would you showcase?',
    contact: 'How should visitors reach you?',
    review: 'Any changes or ready to continue?',
  };

  return placeholders[step] || 'Type your message...';
}
