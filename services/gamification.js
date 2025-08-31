import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateUserPoints = async (userId, pointsToAdd, reason = 'general') => {
  try {
    // Get current user and gamification data
    const user = await prisma.user.findUnique({
      where: { userId },
      include: { gamification: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentPoints = user.points + pointsToAdd;
    const newLevel = Math.floor(currentPoints / 100) + 1;
    const leveledUp = newLevel > user.level;

    // Update user points and level
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: {
        points: Math.max(0, currentPoints), // Don't allow negative points
        level: newLevel
      }
    });

    // Update gamification record
    let gamification = user.gamification;
    if (!gamification) {
      gamification = await prisma.gamification.create({
        data: {
          userId,
          points: Math.max(0, currentPoints),
          level: newLevel,
          streakCount: 0,
          badges: []
        }
      });
    } else {
      gamification = await prisma.gamification.update({
        where: { userId },
        data: {
          points: Math.max(0, currentPoints),
          level: newLevel,
          lastUpdated: new Date()
        }
      });
    }

    // Award badges for milestones
    const badges = [...gamification.badges];
    
    // Level-based badges
    if (leveledUp && newLevel === 5 && !badges.includes('Rookie Trainer')) {
      badges.push('Rookie Trainer');
    }
    if (leveledUp && newLevel === 10 && !badges.includes('Expert Trainer')) {
      badges.push('Expert Trainer');
    }
    if (leveledUp && newLevel === 20 && !badges.includes('Master Trainer')) {
      badges.push('Master Trainer');
    }
    
    // Point-based badges
    if (currentPoints >= 1000 && !badges.includes('Point Master')) {
      badges.push('Point Master');
    }
    if (currentPoints >= 5000 && !badges.includes('Point Legend')) {
      badges.push('Point Legend');
    }
    
    // Streak-based badges
    if (gamification.streakCount >= 7 && !badges.includes('Pikachu\'s 7-Day Streak')) {
      badges.push('Pikachu\'s 7-Day Streak');
    }
    if (gamification.streakCount >= 30 && !badges.includes('Perfect Month')) {
      badges.push('Perfect Month');
    }
    
    // Task completion badges
    if (reason === 'task_completion') {
      // Count total completed tasks
      const completedTasks = await prisma.taskHistory.count({
        where: { userId, isDone: true }
      });
      
      if (completedTasks >= 100 && !badges.includes('Task Master')) {
        badges.push('Task Master');
      }
      if (completedTasks >= 500 && !badges.includes('Task Legend')) {
        badges.push('Task Legend');
      }
    }

    // Update badges if new ones were earned
    if (badges.length > gamification.badges.length) {
      await prisma.gamification.update({
        where: { userId },
        data: { badges }
      });
    }

    return {
      user: updatedUser,
      gamification: { ...gamification, badges },
      leveledUp,
      newBadges: badges.slice(gamification.badges.length)
    };
  } catch (error) {
    console.error('Update points error:', error);
    throw error;
  }
};

export const checkDailyCompletion = async (userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = await prisma.task.findMany({
      where: {
        userId,
        createdAt: {
          gte: today
        }
      }
    });

    const completedTasks = todayTasks.filter(task => task.isDone);
    const allCompleted = todayTasks.length > 0 && completedTasks.length === todayTasks.length;

    if (allCompleted) {
      // Update streak
      await updateStreak(userId, true);
      // Award bonus points for completing all daily tasks
      return await updateUserPoints(userId, 50, 'daily_completion_bonus');
    } else {
      // Reset streak if not all tasks completed
      await updateStreak(userId, false);
    }

    return null;
  } catch (error) {
    console.error('Check daily completion error:', error);
    throw error;
  }
};

export const updateStreak = async (userId, completedToday) => {
  try {
    const gamification = await prisma.gamification.findUnique({
      where: { userId }
    });

    if (!gamification) return;

    let newStreakCount = gamification.streakCount;

    if (completedToday) {
      newStreakCount += 1;
    } else {
      newStreakCount = 0; // Reset streak
    }

    await prisma.gamification.update({
      where: { userId },
      data: {
        streakCount: newStreakCount,
        lastUpdated: new Date()
      }
    });

    return newStreakCount;
  } catch (error) {
    console.error('Update streak error:', error);
    throw error;
  }
};