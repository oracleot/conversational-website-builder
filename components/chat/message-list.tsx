'use client';

/**
 * MessageList - Displays conversation messages with role-based styling
 * Features: Auto-scroll, streaming support, typing indicator, dark mode
 */

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/db/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface MessageListProps {
  messages: Message[];
  streamingMessage?: string;
  isTyping?: boolean;
  className?: string;
  darkMode?: boolean;
  onUseSuggestion?: (messageId: string, suggestion: NonNullable<Message['metadata']>['suggestion']) => void;
}

export function MessageList({
  messages,
  streamingMessage,
  isTyping = false,
  className,
  darkMode = false,
  onUseSuggestion,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        'flex-1 overflow-y-auto px-4 py-6 space-y-4',
        className
      )}
    >
      <AnimatePresence mode="sync">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            darkMode={darkMode}
            onUseSuggestion={onUseSuggestion}
          />
        ))}
        
        {/* Streaming message */}
        {streamingMessage && (
          <MessageBubble
            key="streaming"
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingMessage,
              timestamp: new Date().toISOString(),
            }}
            isStreaming
            darkMode={darkMode}
          />
        )}

        {/* Typing indicator */}
        {isTyping && !streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4"
          >
            <TypingIndicator darkMode={darkMode} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  darkMode?: boolean;
  onUseSuggestion?: (messageId: string, suggestion: NonNullable<Message['metadata']>['suggestion']) => void;
}

function MessageBubble({
  message,
  isStreaming = false,
  darkMode = false,
  onUseSuggestion,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const suggestion = message.metadata?.suggestion;
  const canUseSuggestion = Boolean(suggestion && !suggestion.applied && onUseSuggestion);

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          'text-center text-sm py-2',
          darkMode ? 'text-zinc-500' : 'text-gray-500'
        )}
      >
        {message.content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
            : darkMode
            ? 'bg-white/5 border border-white/10 text-zinc-100'
            : 'bg-gray-100 text-black',
          isStreaming && 'min-h-[60px]'
        )}
      >
        {/* Avatar for assistant */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className={cn(
              'text-xs font-medium',
              darkMode ? 'text-zinc-400' : 'text-gray-500'
            )}>Buildware AI</span>
          </div>
        )}

        {/* Message content */}
        <div className={cn(
          'text-sm leading-relaxed whitespace-pre-wrap break-words',
          isUser ? 'text-white' : darkMode ? 'text-zinc-100' : 'text-black'
        )}>
          {formatMessageContent(message.content)}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse rounded-sm" />
          )}
        </div>

        {suggestion && (
          <div className={cn(
            'mt-3 rounded-lg border px-3 py-2 text-xs',
            darkMode ? 'border-white/10 bg-white/5 text-zinc-200' : 'border-gray-200 bg-gray-50 text-gray-700'
          )}>
            <div className="mb-2 font-medium">Suggested content</div>
            <div className="whitespace-pre-wrap break-words">
              {formatSuggestionPreview(suggestion.sectionType, suggestion.content)}
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={!canUseSuggestion}
                onClick={() => suggestion && onUseSuggestion?.(message.id, suggestion)}
              >
                {suggestion.applied ? 'Applied' : 'Use this'}
              </Button>
            </div>
          </div>
        )}

        {/* Timestamp - suppressHydrationWarning to avoid SSR mismatch with locale formatting */}
        <div 
          className={cn(
            'text-xs mt-2',
            isUser ? 'text-violet-200' : darkMode ? 'text-zinc-500' : 'text-gray-400'
          )}
          suppressHydrationWarning
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator({ darkMode = false }: { darkMode?: boolean }) {
  return (
    <div className={cn(
      'flex gap-1 px-4 py-3 rounded-2xl w-fit',
      darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-100'
    )}>
      <span className={cn(
        'w-2 h-2 rounded-full animate-bounce',
        darkMode ? 'bg-zinc-500' : 'bg-gray-400'
      )} style={{ animationDelay: '0ms' }} />
      <span className={cn(
        'w-2 h-2 rounded-full animate-bounce',
        darkMode ? 'bg-zinc-500' : 'bg-gray-400'
      )} style={{ animationDelay: '150ms' }} />
      <span className={cn(
        'w-2 h-2 rounded-full animate-bounce',
        darkMode ? 'bg-zinc-500' : 'bg-gray-400'
      )} style={{ animationDelay: '300ms' }} />
    </div>
  );
}

function formatTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    // Use 24-hour format to avoid SSR hydration mismatches with locale
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
}

// Simple markdown-like formatting for bold text
function formatMessageContent(content: string): React.ReactNode {
  // Split by bold markers (**text**)
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function formatSuggestionPreview(sectionType: string, content: unknown): string {
  if (!content || typeof content !== 'object') return 'No suggestion content available.';

  try {
    const data = content as Record<string, any>;
    switch (sectionType) {
      case 'hero':
        return `Headline: ${data.headline || 'Not set'}\nSubheadline: ${data.subheadline || 'Not set'}\nCTA: ${data.cta?.primary || 'Not set'}`;
      case 'services':
        return (data.services || [])
          .map((service: any, index: number) => `${index + 1}. ${service.title || 'Service'} - ${service.description || 'No description'}`)
          .join('\n') || 'No services provided.';
      case 'about':
        return `Headline: ${data.headline || 'Not set'}\nStory: ${(data.story || '').slice(0, 160)}${data.story?.length > 160 ? '...' : ''}`;
      case 'process':
        return (data.steps || [])
          .map((step: any) => `${step.number || ''} ${step.title || 'Step'} - ${step.description || ''}`.trim())
          .join('\n') || 'No process steps provided.';
      case 'portfolio':
        return (data.projects || [])
          .map((project: any, index: number) => `${index + 1}. ${project.title || 'Project'} - ${project.description || ''}`.trim())
          .join('\n') || 'No portfolio items provided.';
      case 'testimonials':
        return (data.testimonials || [])
          .map((testimonial: any, index: number) => `${index + 1}. "${testimonial.quote || 'Testimonial'}" — ${testimonial.author || testimonial.name || 'Client'}`)
          .join('\n') || 'No testimonials provided.';
      case 'contact':
        return `Contact methods: ${[data.contactInfo?.email, data.contactInfo?.phone, data.email, data.phone].filter(Boolean).join(', ') || 'Not set'}\nForm fields: ${(data.formFields || []).join(', ') || 'Not set'}`;
      default:
        return JSON.stringify(content, null, 2);
    }
  } catch {
    return 'Unable to format suggestion content.';
  }
}
