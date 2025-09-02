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

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    for (const user of users) {
      console.log(`Processing daily reset for user ${user.userId}...`);

      // Archive ALL tasks to history (not just completed ones)
      for (const task of user.tasks) {
        await prisma.taskHistory.create({
          data: {
            userId: user.userId,
            taskId: task.taskId,
            title: task.title,
            description: task.description,
            category: task.category,
            priority: task.priority,
            date: yesterday,
            isDone: task.isDone,
            completedAt: task.isDone ? task.updatedAt : null
          }
        });
      }

      // Delete all current tasks (they're now archived)
      await prisma.task.deleteMany({
        where: { userId: user.userId }
      });

      // Clear old daily quests
      await prisma.dailyQuest.deleteMany({
        where: { userId: user.userId }
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

      console.log(`Daily reset completed for user ${user.userId}`);
    }

    console.log(`Daily reset completed for ${users.length} users`);
  } catch (error) {
    console.error('Daily reset error:', error);
    throw error;
  }
};