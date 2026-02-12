import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Conversation } from '@/types';
import { formatDistanceToNow } from '@/lib/date-utils';

interface RecentConversationsProps {
  conversations: Conversation[];
}

export function RecentConversations({ conversations }: RecentConversationsProps) {
  if (conversations.length === 0) {
    return (
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💬 Recent Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-300 font-medium mb-2">
              No conversations yet
            </p>
            <p className="text-gray-400 text-sm">
              Start your first conversation to see your history!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-enhanced">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💬 Recent Conversations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/conversation/${conversation.id}`}
              className="block p-4 bg-gradient-to-r from-slate-800/60 to-slate-800/40 hover:from-slate-700/70 hover:to-slate-700/50 border border-slate-700/50 hover:border-slate-600 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-white text-base">
                    {conversation.topic?.emoji} {conversation.topic?.title}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    {formatDistanceToNow(conversation.startedAt)} ago
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-400">
                    +{conversation.xpEarned} XP
                  </p>
                  {conversation.score && (
                    <p className="text-xs text-gray-300 mt-1 font-semibold">
                      Score: {conversation.score}/100
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
