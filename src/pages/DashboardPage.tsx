import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tasksApi, questsApi } from '../services/api';
import { Zap, Target, Trophy, Heart } from 'lucide-react';

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
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: number, isDone: boolean) => {
    try {
      await tasksApi.updateTask(taskId, { isDone: !isDone });
      await loadDashboardData();
      await refreshUser();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const getCurrentSprite = () => {
    if (!user?.pokemonPet) return '🎮';
    
    const level = user.level;
    if (level >= 15) return user.pokemonPet.spriteStage3;
    if (level >= 8) return user.pokemonPet.spriteStage2;
    return user.pokemonPet.spriteStage1;
  };

  const getHPPercentage = () => {
    const pointsInLevel = user?.points ? user.points % 100 : 0;
    return pointsInLevel;
  };

  const completedToday = todayTasks.filter(task => task.isDone).length;
  const totalToday = todayTasks.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 animate-pulse">🎮</div>
          <p className="font-pixel text-xs text-gameboy-light">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trainer Card */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gameboy-light border-4 border-gameboy-lightest rounded-lg flex items-center justify-center text-2xl animate-float">
            {getCurrentSprite()}
          </div>
          <div className="flex-1">
            <h2 className="font-pixel text-sm text-gameboy-lightest mb-1">
              {user?.username}
            </h2>
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-pixel text-xs text-gameboy-light">Lv.{user?.level}</span>
              <div className="flex-1 h-3 bg-gameboy-medium border-2 border-gameboy-border rounded overflow-hidden">
                <div 
                  className="h-full bg-gameboy-light transition-all duration-500"
                  style={{ width: `${getHPPercentage()}%` }}
                />
              </div>
              <span className="font-pixel text-xs text-gameboy-light">{getHPPercentage()}/100</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Zap size={12} className="text-gameboy-lightest" />
                <span className="font-pixel text-xs text-gameboy-lightest">{user?.points}pts</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart size={12} className="text-red-400" />
                <span className="font-pixel text-xs text-gameboy-lightest">
                  {user?.gamification?.streakCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pet Info */}
        <div className="bg-gameboy-medium border-2 border-gameboy-border rounded p-3">
          <p className="font-pixel text-xs text-gameboy-light mb-1">Companion:</p>
          <p className="font-pixel text-xs text-gameboy-lightest">
            {user?.pokemonPet?.name || 'No companion yet'}
          </p>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-pixel text-sm text-gameboy-lightest">Today's Progress</h3>
          <div className="flex items-center space-x-1">
            <Target size={14} className="text-gameboy-light" />
            <span className="font-pixel text-xs text-gameboy-light">
              {completedToday}/{totalToday}
            </span>
          </div>
        </div>

        {totalToday > 0 ? (
          <div className="space-y-2">
            {todayTasks.slice(0, 3).map((task) => (
              <div
                key={task.taskId}
                className="flex items-center space-x-3 p-2 bg-gameboy-medium border-2 border-gameboy-border rounded hover:border-gameboy-light transition-colors cursor-pointer"
                onClick={() => toggleTask(task.taskId, task.isDone)}
              >
                <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors ${
                  task.isDone 
                    ? 'bg-gameboy-light border-gameboy-lightest text-gameboy-dark' 
                    : 'border-gameboy-border bg-gameboy-dark'
                }`}>
                  {task.isDone && '✓'}
                </div>
                <span className={`font-pixel text-xs flex-1 ${
                  task.isDone ? 'line-through text-gameboy-light' : 'text-gameboy-lightest'
                }`}>
                  {task.title}
                </span>
              </div>
            ))}
            {totalToday > 3 && (
              <p className="font-pixel text-xs text-gameboy-light text-center mt-2">
                +{totalToday - 3} more tasks...
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 opacity-50">🎯</div>
            <p className="font-pixel text-xs text-gameboy-light">No tasks for today</p>
          </div>
        )}
      </div>

      {/* Daily Quests */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
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
  <div className="bg-gameboy-dark border-2 border-gameboy-border rounded-lg p-4 text-center hover:border-gameboy-light transition-colors">
    <div className="w-8 h-8 mx-auto mb-2 text-gameboy-light">
      {icon}
    </div>
    <p className="font-pixel text-xs text-gameboy-light mb-1">{label}</p>
    <p className="font-pixel text-sm text-gameboy-lightest">{value}</p>
  </div>
);

export default DashboardPage;