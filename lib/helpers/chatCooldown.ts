import { useState } from 'react';

const COOLDOWN_PERIODS_SECONDS = [5, 30, 120, 300, 600];

export const useChatCooldown = () => {
  const [cooldownEndTime, setCooldownEndTime] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);

  const startCooldown = () => {
    const cooldownDuration = COOLDOWN_PERIODS_SECONDS[Math.min(errorCount, COOLDOWN_PERIODS_SECONDS.length - 1)];
    setCooldownEndTime(Date.now() + cooldownDuration * 1000);
  };

  const resetCooldown = () => {
    setCooldownEndTime(0);
    setErrorCount(0);
  };

  const incrementErrorCount = () => {
    setErrorCount((prev) => prev + 1);
  };

  const isCooldownActive = () => {
    return Date.now() < cooldownEndTime;
  };

  const getRemainingCooldown = () => {
    return Math.ceil((cooldownEndTime - Date.now()) / 1000);
  };

  const getCooldownMessage = () => {
    if (!isCooldownActive()) return '';
    const remainingTime = getRemainingCooldown();
    return `You are on cooldown. Try again in ${formatCooldownTime(remainingTime)}.`;
  };

  return {
    startCooldown,
    resetCooldown,
    incrementErrorCount,
    isCooldownActive,
    getRemainingCooldown,
    getCooldownMessage,
  };
};

export const formatCooldownTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  // Be less precise for longer durations for simplicity
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};