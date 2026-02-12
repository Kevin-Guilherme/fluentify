'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StepLevelProps {
  onNext: (level: string) => void;
  onBack: () => void;
  initialValue?: string;
}

const levels = [
  {
    id: 'beginner',
    emoji: '🌱',
    title: 'BEGINNER',
    description: 'Just starting out',
  },
  {
    id: 'intermediate',
    emoji: '🚀',
    title: 'INTERMEDIATE',
    description: 'Can have basic conversations',
  },
  {
    id: 'advanced',
    emoji: '💪',
    title: 'ADVANCED',
    description: 'Fluent in most situations',
  },
  {
    id: 'fluent',
    emoji: '⭐',
    title: 'FLUENT',
    description: 'Native or near-native',
  },
];

export function StepLevel({ onNext, onBack, initialValue }: StepLevelProps) {
  const [selectedLevel, setSelectedLevel] = useState(initialValue || '');

  const handleContinue = () => {
    if (selectedLevel) {
      onNext(selectedLevel);
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
        <h1 className="text-4xl font-bold text-white">
          What's your English level?
        </h1>
        <p className="text-gray-400 text-lg">
          We'll personalize your experience
        </p>
      </div>

      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {levels.map((level, index) => (
          <motion.button
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedLevel(level.id)}
            className={`bg-slate-800 border-2 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 ${
              selectedLevel === level.id
                ? 'border-blue-500 bg-gradient-to-br from-blue-900/20 to-purple-900/20'
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="space-y-2">
              <div className="text-5xl mb-3">{level.emoji}</div>
              <h3 className="font-semibold text-white text-lg">
                {level.title}
              </h3>
              <p className="text-sm text-gray-400">{level.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full max-w-2xl">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedLevel}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
