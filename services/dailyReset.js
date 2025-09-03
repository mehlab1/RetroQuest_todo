import { PrismaClient } from '../backend/node_modules/@prisma/client/index.js';

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const user of users) {
      console.log(`Processing daily reset for user ${user.userId}...`);

      // Only archive tasks from previous days (not today's tasks)
      const tasksToArchive = user.tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate < today;
      });

      console.log(`Archiving ${tasksToArchive.length} tasks from previous days for user ${user.userId}`);

      // Use a transaction to ensure data consistency
      await prisma.$transaction(async (tx) => {
        // Archive tasks from previous days to history
        for (const task of tasksToArchive) {
          console.log(`Creating history entry for task: ${task.title}`);
          try {
            const historyEntry = await tx.taskHistory.create({
              data: {
                userId: user.userId,
                taskId: task.taskId,
                title: task.title,
                description: task.description,
                category: task.category,
                priority: task.priority,
                date: new Date(task.createdAt),
                isDone: task.isDone,
                completedAt: task.isDone ? task.updatedAt : null
              }
            });
            console.log(`✅ Created history entry: ${historyEntry.historyId}`);
          } catch (error) {
            console.error(`❌ Failed to create history entry for task ${task.taskId}:`, error);
            throw error; // Rollback transaction on error
          }
        }

        // Delete only the archived tasks (keep today's tasks)
        if (tasksToArchive.length > 0) {
          try {
            const deletedTasks = await tx.task.deleteMany({
              where: { 
                userId: user.userId,
                taskId: {
                  in: tasksToArchive.map(task => task.taskId)
                }
              }
            });
            console.log(`Deleted ${deletedTasks.count} tasks for user ${user.userId}`);
          } catch (error) {
            console.error(`❌ Failed to delete tasks for user ${user.userId}:`, error);
            throw error; // Rollback transaction on error
          }
        }
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