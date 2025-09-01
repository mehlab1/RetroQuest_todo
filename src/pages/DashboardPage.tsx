import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAchievement } from '../contexts/AchievementContext';
import { tasksApi, questsApi } from '../services/api';
import { Zap, Target, Trophy, Heart } from 'lucide-react';
import SwipeableTaskList from '../components/SwipeableTaskList';
import soundEffects from '../utils/soundEffects';

interface Task {
  taskId: number;
  title: string;
  isDone: boolean;
}

interface Quest {
  questId: number;
  title: string;
  points: number;
}

const DashboardPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showAchievement } = useAchievement();
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tasksResponse, questsResponse] = await Promise.all([
        tasksApi.getTodayTasks(),
        questsApi.getDailyQuests()
      ]);
      
      setTodayTasks(tasksResponse.data);
      setDailyQuests(questsResponse.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      soundEffects.playError();
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: number, isDone: boolean) => {
    try {
      await tasksApi.updateTask(taskId, { isDone: !isDone });
      await loadDashboardData();
      const updatedUser = await refreshUser();
      
      // Play appropriate sound based on task state
      if (isDone) {
        soundEffects.playMenuSelect(); // Unchecking
      } else {
        soundEffects.playTaskComplete(); // Completing
      }
      
      // Show achievement notifications
      if (updatedUser?.gamification) {
        const { level, badges, streakCount } = updatedUser.gamification;
        
        // Check for new badges
        if (badges.length > 0) {
          const latestBadge = badges[badges.length - 1];
          showAchievement(`Unlocked: ${latestBadge}`, 'badge');
          soundEffects.playBadgeUnlock();
        }
        
        // Check for level up
        if (level > 1) {
          showAchievement(`Level Up! You're now level ${level}`, 'level');
          soundEffects.playLevelUp();
        }
        
        // Check for streak milestones
        if (streakCount >= 7) {
          showAchievement(`🔥 ${streakCount} Day Streak!`, 'streak');
          soundEffects.playStreakMilestone();
        }
      }
    } catch (error) {
      console.error('Failed to toggle task:', error);
      soundEffects.playError();
    }
  };

  const getCurrentSprite = () => {
    if (!user?.pokemonPet) return '🕹️';
    
    const { level } = user;
    const evolutionLevels = user.pokemonPet.evolutionLevels || { stage2: 16, stage3: 32 };
    
    if (level >= evolutionLevels.stage3) {
      return user.pokemonPet.spriteStage3;
    } else if (level >= evolutionLevels.stage2) {
      return user.pokemonPet.spriteStage2;
    } else {
      return user.pokemonPet.spriteStage1;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gameboy-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-pulse">🕹️</div>
          <p className="font-pixel text-sm text-gameboy-lightest">Loading RetroQuest...</p>
        </div>
      </div>
    );
  }

  const totalToday = todayTasks.length;
  const completedToday = todayTasks.filter(task => task.isDone).length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  return (
    <div className="min-h-screen bg-gameboy-dark p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">
            <img
              src={getCurrentSprite()}
              alt={user?.pokemonPet?.name || 'Pokemon'}
              className="w-16 h-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '🕹️'; // Fallback emoji
              }}
            />
          </div>
          <div>
            <h1 className="font-pixel text-lg text-gameboy-lightest">Welcome back, {user?.username || 'Trainer'}!</h1>
            <p className="font-pixel text-xs text-gameboy-light">
              Level {user?.level || 1} • {user?.points || 0} points
              {user?.pokemonPet && (
                <span className="ml-2">• {user.pokemonPet.name}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Heart size={16} className="text-red-400" />
          <span className="font-pixel text-sm text-gameboy-lightest">{user?.gamification?.streakCount || 0}</span>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-gameboy-medium border-2 border-gameboy-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Target size={14} className="text-green-400" />
          <h3 className="font-pixel text-sm text-gameboy-lightest">Today's Progress</h3>
        </div>

        {/* Retro Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-pixel text-xs text-gameboy-lightest">
              {completedToday}/{totalToday} completed
            </span>
            <span className="font-pixel text-xs text-gameboy-light">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          
          {/* Retro Progress Bar Container */}
          <div className="relative w-full h-6 bg-gameboy-dark border-2 border-gameboy-border rounded-none overflow-hidden">
            {/* Progress Fill */}
            <div 
              className="h-full bg-green-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
            
            {/* Retro Progress Bar Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full" style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 4px,
                  rgba(255, 255, 255, 0.1) 4px,
                  rgba(255, 255, 255, 0.1) 8px
                )`
              }} />
            </div>
            
            {/* Progress Bar Border Overlay */}
            <div className="absolute inset-0 border-2 border-gameboy-lightest opacity-30 pointer-events-none" />
          </div>
        </div>

        {/* Swipeable Task List */}
        <SwipeableTaskList 
          tasks={todayTasks}
          onToggleTask={toggleTask}
          maxVisible={3}
        />
      </div>

      {/* Daily Quests */}
      <div className="bg-gameboy-medium border-2 border-gameboy-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy size={14} className="text-yellow-400" />
          <h3 className="font-pixel text-sm text-gameboy-lightest">Daily Quests</h3>
        </div>

        {dailyQuests.length > 0 ? (
          <div className="space-y-2">
            {dailyQuests.map((quest) => (
              <div key={quest.questId} className="p-3 bg-gameboy-medium border-2 border-gameboy-border rounded">
                <div className="flex justify-between items-center">
                  <span className="font-pixel text-xs text-gameboy-lightest">{quest.title}</span>
                  <span className="font-pixel text-xs text-yellow-400">+{quest.points}pts</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 opacity-50">🏆</div>
            <p className="font-pixel text-xs text-gameboy-light">No quests today</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<Zap size={16} />} label="Total Points" value={user?.points || 0} />
        <StatCard icon={<Trophy size={16} />} label="Current Level" value={user?.level || 1} />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <div className="bg-gameboy-medium border-2 border-gameboy-border rounded-lg p-4">
    <div className="flex items-center space-x-2 mb-2">
      {icon}
      <span className="font-pixel text-xs text-gameboy-lightest">{label}</span>
    </div>
    <span className="font-pixel text-lg text-gameboy-lightest">{value}</span>
  </div>
);

export default DashboardPage;