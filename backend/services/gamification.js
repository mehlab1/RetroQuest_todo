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
    if (leveledUp && newLevel === 5 && !badges.includes('Rookie Trainer')) {
      badges.push('Rookie Trainer');
    }
    if (leveledUp && newLevel === 10 && !badges.includes('Expert Trainer')) {
      badges.push('Expert Trainer');
    }
    if (currentPoints >= 1000 && !badges.includes('Point Master')) {
      badges.push('Point Master');
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
      // Award bonus points for completing all daily tasks
      return await updateUserPoints(userId, 50, 'daily_completion_bonus');
    }

    return null;
  } catch (error) {
    console.error('Check daily completion error:', error);
    throw error;
  }
};