'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface StepNameProps {
  onNext: (name: string) => void;
  initialValue?: string;
}

export function StepName({ onNext, initialValue = '' }: StepNameProps) {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    setError('');
    onNext(name.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
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
      {/* Emoji/Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="text-8xl mb-4"
      >
        👋
      </motion.div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">
          Welcome to Fluentify!
        </h1>
        <p className="text-gray-400 text-lg">
          Let's get started by knowing your name
        </p>
      </div>

      {/* Input */}
      <div className="w-full max-w-md space-y-2">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            className={`w-full bg-slate-800 border ${
              error ? 'border-red-500' : 'border-slate-700'
            } rounded-xl px-12 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-200`}
            autoFocus
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm px-2"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!name.trim()}
        size="lg"
        className="w-full max-w-md"
      >
        Continue
      </Button>
    </motion.div>
  );
}
