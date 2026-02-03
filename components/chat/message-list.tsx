'use client';

/**
 * MessageList - Displays conversation messages with role-based styling
 * Features: Auto-scroll, streaming support, typing indicator, dark mode
 */

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/db/types';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageListProps {
  messages: Message[];
  streamingMessage?: string;
  isTyping?: boolean;
  className?: string;
  darkMode?: boolean;
}

export function MessageList({
  messages,
  streamingMessage,
  isTyping = false,
  className,
  darkMode = false,
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
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} darkMode={darkMode} />
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
}

function MessageBubble({ message, isStreaming = false, darkMode = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

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
