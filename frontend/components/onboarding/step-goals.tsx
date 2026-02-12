'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StepGoalsProps {
  onNext: (goal: string) => void;
  onBack: () => void;
  initialValue?: string;
  isSubmitting?: boolean;
}

const goals = [
  {
    id: 'travel',
    emoji: '✈️',
    title: 'Travel',
    description: 'Communicate while traveling',
  },
  {
    id: 'work',
    emoji: '💼',
    title: 'Work',
    description: 'Professional communication',
  },
  {
    id: 'study',
    emoji: '📚',
    title: 'Study',
    description: 'Academic purposes',
  },
  {
    id: 'general',
    emoji: '🌍',
    title: 'General',
    description: 'General fluency',
  },
];

export function StepGoals({
  onNext,
  onBack,
  initialValue,
  isSubmitting = false,
}: StepGoalsProps) {
  const [selectedGoal, setSelectedGoal] = useState(initialValue || '');

  const handleContinue = () => {
    if (selectedGoal) {
      onNext(selectedGoal);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[500px] space-y-8 px-4"
    >
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">What's your goal?</h1>
        <p className="text-gray-400 text-lg">
          Help us tailor your learning experience
        </p>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {goals.map((goal, index) => (
          <motion.button
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedGoal(goal.id)}
            disabled={isSubmitting}
            className={`bg-slate-800 border-2 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedGoal === goal.id
                ? 'border-blue-500 bg-gradient-to-br from-blue-900/20 to-purple-900/20'
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="space-y-2">
              <div className="text-5xl mb-3">{goal.emoji}</div>
              <h3 className="font-semibold text-white text-lg">{goal.title}</h3>
              <p className="text-sm text-gray-400">{goal.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full max-w-2xl">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedGoal || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Setting up...
            </>
          ) : (
            'Get Started'
          )}
        </Button>
      </div>
    </motion.div>
  );
}
