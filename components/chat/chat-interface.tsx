'use client';

/**
 * ChatInterface - Main chat UI component
 * Combines MessageList, ChatInput, and ProgressIndicator
 * Handles streaming responses and state management
 */

import { useState, useCallback } from 'react';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { CompactProgressIndicator } from './progress-indicator';
import { cn } from '@/lib/utils';
import type { Message, ConversationStep, IndustryType } from '@/lib/db/types';

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages?: Message[];
  currentStep: ConversationStep;
  industry?: IndustryType;
  onStepChange?: (step: ConversationStep) => void;
  onExtraction?: (type: string, content: unknown) => void;
  className?: string;
}

export function ChatInterface({
  conversationId,
  initialMessages = [],
  currentStep,
  industry,
  onStepChange,
  onExtraction,
  className,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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
              // Streaming complete
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
  }, [conversationId, currentStep, isLoading, onStepChange]);

  const handleExtraction = async (extractionType: string) => {
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
  };

  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>
      {/* Progress indicator */}
      <div className="shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <CompactProgressIndicator
          currentStep={currentStep}
          industry={industry}
        />
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        streamingMessage={streamingMessage}
        isTyping={isLoading && !streamingMessage}
        className="flex-1"
      />

      {/* Input */}
      <div className="shrink-0 px-4 py-4 border-t border-gray-100 bg-white">
        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          placeholder={getPlaceholder(currentStep)}
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
