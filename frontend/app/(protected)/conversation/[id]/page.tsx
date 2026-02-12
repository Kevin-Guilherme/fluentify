'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { conversationsApi } from '@/lib/api';
import { Header } from '@/components/layout/header';
import { MessageList } from '@/components/conversation/message-list';
import { AudioRecorder } from '@/components/conversation/audio-recorder';
import { FeedbackModal } from '@/components/conversation/feedback-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Message } from '@/types';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const conversationId = params.id as string;

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Fetch conversation data
  const {
    data: conversation,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => conversationsApi.getById(conversationId),
    refetchInterval: (query) => {
      // Auto-refetch if waiting for AI response
      const lastMessage = query.state.data?.messages?.[query.state.data.messages.length - 1];
      return lastMessage?.role === 'USER' ? 2000 : false;
    },
  });

  // Complete conversation mutation
  const completeMutation = useMutation({
    mutationFn: () => conversationsApi.complete(conversationId),
    onSuccess: (data) => {
      queryClient.setQueryData(['conversation', conversationId], data);
      setShowFeedbackModal(true);
    },
    onError: (error) => {
      console.error('Error completing conversation:', error);
      alert('Failed to complete conversation. Please try again.');
    },
  });

  // Handle audio recording completion
  const handleRecordingComplete = useCallback(
    async (audioBlob: Blob) => {
      if (!conversationId) return;

      setIsSendingMessage(true);

      try {
        await conversationsApi.sendMessage(conversationId, audioBlob);
        // Refetch conversation to get updated messages
        await queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      } finally {
        setIsSendingMessage(false);
      }
    },
    [conversationId, queryClient]
  );

  // Handle complete conversation
  const handleCompleteConversation = () => {
    if (window.confirm('Are you sure you want to complete this conversation?')) {
      completeMutation.mutate();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-8 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <p className="text-red-400 mb-4">Failed to load conversation</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // No conversation found
  if (!conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <p className="text-gray-400 mb-4">Conversation not found</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const messages = conversation.messages || [];
  const topic = conversation.topic;
  const isCompleted = !!conversation.completedAt;
  const lastMessage = messages[messages.length - 1];
  const isWaitingForAI = isSendingMessage || (lastMessage?.role === 'USER');

  // Get feedback from the last user message (if completed)
  const lastUserMessage = messages
    .slice()
    .reverse()
    .find((m): m is Message & { feedback: NonNullable<Message['feedback']> } =>
      m.role === 'USER' && m.feedback !== null
    );

  return (
    <div>
      <Header
        title={topic?.title || 'Conversation'}
        subtitle={topic?.description || 'Practice your English speaking skills'}
      >
        {!isCompleted && messages.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCompleteConversation}
            disabled={completeMutation.isPending}
            className="gap-2"
          >
            {completeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Complete Conversation
              </>
            )}
          </Button>
        )}
      </Header>

      <div className="p-8 max-w-5xl mx-auto">
        <div className="space-y-6">
          {/* Topic Info Card */}
          {topic && messages.length === 0 && (
            <Card className="p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  {topic.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-300 mb-2">
                    Conversation Context
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">{topic.description}</p>
                  {topic.exampleQuestions && topic.exampleQuestions.length > 0 && (
                    <div>
                      <p className="text-xs text-purple-400 mb-2">Example questions:</p>
                      <ul className="space-y-1">
                        {topic.exampleQuestions.slice(0, 3).map((question, index) => (
                          <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-purple-400">•</span>
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Messages */}
          <Card className="min-h-[400px]">
            <MessageList messages={messages} isLoading={isWaitingForAI} />
          </Card>

          {/* Audio Recorder */}
          {!isCompleted && (
            <Card className="border-slate-700">
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                disabled={isWaitingForAI}
              />
              {isWaitingForAI && (
                <div className="px-6 pb-6">
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 text-center">
                    <p className="text-sm text-blue-400">
                      {isSendingMessage
                        ? 'Transcribing your message...'
                        : 'AI is thinking...'}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Completed State */}
          {isCompleted && (
            <Card className="p-8 text-center bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Conversation Completed!
              </h3>
              <p className="text-gray-400 mb-6">
                Great job! You earned {conversation.xpEarned} XP
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="secondary"
                  onClick={() => router.push('/topics')}
                >
                  Start New Conversation
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                  View Dashboard
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {lastUserMessage?.feedback && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          feedback={lastUserMessage.feedback}
          xpEarned={conversation.xpEarned}
          score={conversation.score || lastUserMessage.feedback.overallScore}
        />
      )}
    </div>
  );
}
