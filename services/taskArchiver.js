const { PrismaClient } = require('@prisma/client');
const cron = require('node-cron');

const prisma = new PrismaClient();

// Function to archive tasks and reset for the next day
async function archiveAndResetTasks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Get all tasks that need to be archived
    const tasks = await prisma.task.findMany();

    // Create task history entries for each task
    await prisma.$transaction(async (tx) => {
      // Create history entries
      for (const task of tasks) {
        await tx.taskHistory.create({
          data: {
            userId: task.userId,
            taskId: task.taskId,
            title: task.title,
            description: task.description,
            category: task.category,
            priority: task.priority,
            date: today,
            isDone: task.isDone,
            completedAt: task.isDone ? new Date() : null,
          },
        });
      }

      // Reset all tasks to not done
      await tx.task.updateMany({
        data: {
          isDone: false,
          updatedAt: new Date(),
        },
      });
    });

    console.log('Successfully archived and reset tasks');
  } catch (error) {
    console.error('Error in archiving and resetting tasks:', error);
  }
}

// Schedule the task to run at midnight every day
cron.schedule('0 0 * * *', archiveAndResetTasks);

module.exports = {
  archiveAndResetTasks,
};
