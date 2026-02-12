'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="text-center space-y-3">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-12 h-12 text-blue-400" />
          </div>
          <p className="text-lg font-semibold text-white">Start the conversation!</p>
          <p className="text-sm text-gray-400 max-w-md">
            Click the microphone below to record your first message. The AI will respond and help you practice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 overflow-y-auto max-h-[600px]">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex gap-4',
            message.role === 'USER' ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
              message.role === 'USER'
                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                : 'bg-gradient-to-br from-purple-500 to-pink-600'
            )}
          >
            {message.role === 'USER' ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={cn(
              'flex-1 max-w-[75%]',
              message.role === 'USER' ? 'text-right' : 'text-left'
            )}
          >
            <div
              className={cn(
                'inline-block rounded-xl px-6 py-4 shadow-lg',
                message.role === 'USER'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  : 'bg-slate-800 border border-slate-700 text-gray-200'
              )}
            >
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {/* Timestamp */}
            <p className="text-xs text-gray-500 mt-2 px-2">
              {new Date(message.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}

      {/* Loading indicator for AI response */}
      {isLoading && (
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-4">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
