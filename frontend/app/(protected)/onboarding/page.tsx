'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { StepName } from '@/components/onboarding/step-name';
import { StepLevel } from '@/components/onboarding/step-level';
import { StepGoals } from '@/components/onboarding/step-goals';
import { ProgressBar } from '@/components/onboarding/progress-bar';
import { api } from '@/lib/api/client';

interface OnboardingData {
  name: string;
  level: string;
  goal: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    level: '',
    goal: '',
  });

  const totalSteps = 3;

  // Handle step navigation
  const handleNext = (stepData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...stepData }));
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Submit onboarding data
  const handleFinish = async (goal: string) => {
    setIsSubmitting(true);
    try {
      const finalData = { ...data, goal };

      // Update user profile via PATCH /users/me
      await api.patch('/users/me', {
        name: finalData.name,
        level: finalData.level.toUpperCase(), // Convert to UPPERCASE for enum
        goal: finalData.goal,
        onboardingCompleted: true,
      });

      // Invalidate user-profile cache to force refetch with updated data
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setIsSubmitting(false);
      // TODO: Show error toast
    }
  };

  // Skip onboarding
  const handleSkip = async () => {
    try {
      await api.patch('/users/me', {
        onboardingCompleted: true,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to skip onboarding:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header with Progress */}
          <div className="bg-slate-800/50 border-b border-slate-800 px-8 py-6">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          {/* Steps Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <StepName
                  key="step-1"
                  onNext={(name) => handleNext({ name })}
                  initialValue={data.name}
                />
              )}

              {currentStep === 2 && (
                <StepLevel
                  key="step-2"
                  onNext={(level) => handleNext({ level })}
                  onBack={handleBack}
                  initialValue={data.level}
                />
              )}

              {currentStep === 3 && (
                <StepGoals
                  key="step-3"
                  onNext={handleFinish}
                  onBack={handleBack}
                  initialValue={data.goal}
                  isSubmitting={isSubmitting}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer with Skip */}
          <div className="bg-slate-800/30 border-t border-slate-800 px-8 py-4 text-center">
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              className="text-gray-400 text-sm hover:text-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip for now
            </button>
          </div>
        </motion.div>

        {/* Brand Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-sm">
            Powered by{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
              Fluentify AI
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
