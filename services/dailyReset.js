import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dailyReset = async () => {
  try {
    console.log('Starting daily reset...');

    // Get all users with their tasks
    const users = await prisma.user.findMany({
      include: {
        tasks: true
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const user of users) {
      // Archive completed tasks to history
      for (const task of user.tasks) {
        await prisma.taskHistory.create({
          data: {
            userId: user.userId,
            taskId: task.taskId,
            date: today,
            isDone: task.isDone,
            completedAt: task.isDone ? new Date() : null
          }
        });
      }

      // Reset all tasks to undone
      await prisma.task.updateMany({
        where: { userId: user.userId },
        data: {
          isDone: false,
          updatedAt: new Date()
        }
      });

      // Generate new daily quests
      const questTitles = [
        'Complete 3 tasks',
        'Focus for 25 minutes',
        'Exercise for 15 minutes',
        'Read for 10 minutes',
        'Organize workspace'
      ];

      const randomQuest = questTitles[Math.floor(Math.random() * questTitles.length)];

      await prisma.dailyQuest.create({
        data: {
          userId: user.userId,
          title: randomQuest,
          points: 25
        }
      });
    }

    console.log(`Daily reset completed for ${users.length} users`);
  } catch (error) {
    console.error('Daily reset error:', error);
    throw error;
  }
};