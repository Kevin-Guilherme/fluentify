'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Feedback } from '@/types';
import { Button } from '@/components/ui/button';
import { X, Trophy, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: Feedback;
  xpEarned: number;
  score: number;
}

export function FeedbackModal({
  isOpen,
  onClose,
  feedback,
  xpEarned,
  score,
}: FeedbackModalProps) {
  const router = useRouter();
  const [showErrors, setShowErrors] = useState(false);

  if (!isOpen) return null;

  const scores = [
    { label: 'Grammar', value: feedback.grammarScore, color: 'text-blue-400' },
    { label: 'Vocabulary', value: feedback.vocabularyScore, color: 'text-purple-400' },
    { label: 'Fluency', value: feedback.fluencyScore, color: 'text-green-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Conversation Complete!</h2>
              <p className="text-sm text-gray-400">Great job practicing!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Overall Score and XP */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-500/50 rounded-xl p-6">
              <p className="text-sm text-blue-300 mb-2">Overall Score</p>
              <p className="text-4xl font-bold text-white">{score}/100</p>
              <p className="text-xs text-blue-400 mt-1">
                {score >= 90 ? 'Excellent!' : score >= 70 ? 'Good job!' : 'Keep practicing!'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-500/50 rounded-xl p-6">
              <p className="text-sm text-purple-300 mb-2">XP Earned</p>
              <p className="text-4xl font-bold text-white">+{xpEarned}</p>
              <p className="text-xs text-purple-400 mt-1">
                <Trophy className="w-3 h-3 inline mr-1" />
                Added to your total
              </p>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Detailed Scores</h3>
            <div className="space-y-4">
              {scores.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <span className={cn('text-sm font-semibold', item.color)}>
                      {item.value}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className={cn(
                        'h-3 rounded-full bg-gradient-to-r transition-all duration-500',
                        item.label === 'Grammar' && 'from-blue-500 to-blue-600',
                        item.label === 'Vocabulary' && 'from-purple-500 to-purple-600',
                        item.label === 'Fluency' && 'from-green-500 to-green-600'
                      )}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-green-300">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {feedback.suggestions && feedback.suggestions.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-yellow-300">Suggestions</h3>
              </div>
              <ul className="space-y-2">
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Grammar Errors (Accordion) */}
          {feedback.grammarErrors && feedback.grammarErrors.length > 0 && (
            <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowErrors(!showErrors)}
                className="w-full p-6 flex items-center justify-between hover:bg-red-900/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-red-300">
                    Grammar Errors ({feedback.grammarErrors.length})
                  </h3>
                </div>
                {showErrors ? (
                  <ChevronUp className="w-5 h-5 text-red-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-red-400" />
                )}
              </button>

              {showErrors && (
                <div className="px-6 pb-6 space-y-4">
                  {feedback.grammarErrors.map((error, index) => (
                    <div
                      key={index}
                      className="bg-slate-900/50 rounded-lg p-4 border border-red-500/20"
                    >
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Incorrect:</p>
                          <p className="text-sm text-red-400 line-through">{error.text}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Correction:</p>
                          <p className="text-sm text-green-400 font-semibold">
                            {error.correction}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Explanation:</p>
                          <p className="text-sm text-gray-300">{error.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push('/dashboard')}
            className="flex-1"
          >
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
