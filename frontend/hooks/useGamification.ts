'use client';

import { useState, useCallback } from 'react';

export interface GamificationState {
  showLevelUpModal: boolean;
  showXpAnimation: boolean;
  oldLevel: string;
  newLevel: string;
  xpGained: number;
  triggerKey: number;
}

/**
 * Hook for managing gamification state (Level Up, XP animations, etc.)
 * Usage:
 *
 * const { state, handleLevelUp, handleXpGain, closeLevelUpModal, resetXpAnimation } = useGamification();
 *
 * // When user completes a conversation and gains XP
 * handleXpGain(50);
 *
 * // When user levels up
 * handleLevelUp('Beginner', 'Intermediate', 100);
 */
export function useGamification() {
  const [state, setState] = useState<GamificationState>({
    showLevelUpModal: false,
    showXpAnimation: false,
    oldLevel: '',
    newLevel: '',
    xpGained: 0,
    triggerKey: 0,
  });

  /**
   * Show Level Up modal
   */
  const handleLevelUp = useCallback((oldLevel: string, newLevel: string, xpGained: number) => {
    setState((prev) => ({
      ...prev,
      showLevelUpModal: true,
      oldLevel,
      newLevel,
      xpGained,
    }));
  }, []);

  /**
   * Close Level Up modal
   */
  const closeLevelUpModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showLevelUpModal: false,
    }));
  }, []);

  /**
   * Trigger XP gain animation
   */
  const handleXpGain = useCallback((amount: number) => {
    setState((prev) => ({
      ...prev,
      showXpAnimation: true,
      xpGained: amount,
      triggerKey: prev.triggerKey + 1,
    }));
  }, []);

  /**
   * Reset XP animation state
   */
  const resetXpAnimation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showXpAnimation: false,
    }));
  }, []);

  return {
    state,
    handleLevelUp,
    handleXpGain,
    closeLevelUpModal,
    resetXpAnimation,
  };
}

/**
 * Calculate next level XP requirement
 */
export function getNextLevelXp(level: string): number {
  const XP_PER_LEVEL: Record<string, number> = {
    BEGINNER: 1000,
    INTERMEDIATE: 2500,
    ADVANCED: 5000,
  };

  const levelUpper = level.toUpperCase();
  return XP_PER_LEVEL[levelUpper] || 1000;
}

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): string {
  if (xp >= 5000) return 'Advanced';
  if (xp >= 2500) return 'Intermediate';
  return 'Beginner';
}

/**
 * Check if user leveled up
 */
export function checkLevelUp(oldXp: number, newXp: number): {
  leveledUp: boolean;
  oldLevel: string;
  newLevel: string;
} {
  const oldLevel = calculateLevel(oldXp);
  const newLevel = calculateLevel(newXp);

  return {
    leveledUp: oldLevel !== newLevel,
    oldLevel,
    newLevel,
  };
}

/**
 * Calculate XP for conversation based on score
 */
export function calculateConversationXp(score: number, messageCount: number): number {
  const baseXp = 20;
  const scoreBonus = Math.floor(score * 0.5); // 0-50 XP from score (max 100)
  const messageBonus = Math.min(messageCount * 5, 30); // 5 XP per message, max 30

  return baseXp + scoreBonus + messageBonus;
}
