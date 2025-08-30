import React, { createContext, useContext, useState, useCallback } from 'react';
import AchievementToast from '../components/AchievementToast';

interface Achievement {
  id: string;
  message: string;
  type: 'badge' | 'level' | 'streak';
}

interface AchievementContextType {
  showAchievement: (message: string, type: 'badge' | 'level' | 'streak') => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const useAchievement = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievement must be used within an AchievementProvider');
  }
  return context;
};

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const showAchievement = useCallback((message: string, type: 'badge' | 'level' | 'streak') => {
    const id = Date.now().toString();
    const newAchievement: Achievement = { id, message, type };
    
    setAchievements(prev => [...prev, newAchievement]);
  }, []);

  const removeAchievement = useCallback((id: string) => {
    setAchievements(prev => prev.filter(achievement => achievement.id !== id));
  }, []);

  return (
    <AchievementContext.Provider value={{ showAchievement }}>
      {children}
      {achievements.map(achievement => (
        <AchievementToast
          key={achievement.id}
          message={achievement.message}
          type={achievement.type}
          onClose={() => removeAchievement(achievement.id)}
        />
      ))}
    </AchievementContext.Provider>
  );
};
