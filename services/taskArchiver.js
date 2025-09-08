/**
 * Task Archiving Service
 * Comprehensive service to archive old tasks to task_history table
 * 
 * This service handles:
 * - Finding tasks older than today
 * - Creating task_history entries with all task details
 * - Deleting archived tasks from tasks table
 * - Transaction support for data consistency
 * - Error handling and rollback mechanism
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Archives all tasks older than today to the task_history table
 * @returns {Promise<Object>} Archive result with statistics
 */
export const archiveOldTasks = async () => {
  console.log('🔄 Starting task archiving process...');
  
  try {
    // Get current date (start of today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log(`📅 Archiving tasks older than: ${today.toISOString()}`);
    
    // 1. Find all tasks older than today
    const tasksToArchive = await prisma.task.findMany({
      where: {
        createdAt: {
          lt: today
        }
      },
      include: {
        user: {
          select: {
            userId: true,
            email: true
          }
        }
      }
    });
    
    console.log(`📊 Found ${tasksToArchive.length} tasks to archive`);
    
    if (tasksToArchive.length === 0) {
      console.log('✅ No tasks to archive');
      return {
        success: true,
        archivedCount: 0,
        deletedCount: 0,
        message: 'No tasks to archive'
      };
    }
    
    // 2. Process tasks in smaller batches with individual transactions
    const archivedTasks = [];
    let successCount = 0;
    const batchSize = 5; // Smaller batch size for better reliability
    
    for (let i = 0; i < tasksToArchive.length; i += batchSize) {
      const batch = tasksToArchive.slice(i, i + batchSize);
      
      try {
        // Use transaction for each batch
        const batchResult = await prisma.$transaction(async (tx) => {
          const batchArchivedTasks = [];
          
          for (const task of batch) {
            console.log(`📝 Archiving task: "${task.title}" (ID: ${task.taskId}) for user ${task.user.email}`);
            
            // Create history entry with all task details
            const historyEntry = await tx.taskHistory.create({
              data: {
                userId: task.userId,
                taskId: task.taskId,
                title: task.title,
                description: task.description,
                category: task.category,
                priority: task.priority,
                date: new Date(task.createdAt), // Use task's creation date, not archiving date
                isDone: task.isDone,
                completedAt: task.isDone ? task.updatedAt : null
              }
            });
            
            batchArchivedTasks.push({
              originalTaskId: task.taskId,
              historyId: historyEntry.historyId,
              title: task.title,
              userId: task.userId
            });
            
            console.log(`✅ Successfully archived task ${task.taskId} → history entry ${historyEntry.historyId}`);
          }
          
          // Delete this batch of tasks
          const deletedTasks = await tx.task.deleteMany({
            where: {
              taskId: {
                in: batchArchivedTasks.map(t => t.originalTaskId)
              }
            }
          });
          
          return {
            archivedTasks: batchArchivedTasks,
            deletedCount: deletedTasks.count
          };
        });
        
        archivedTasks.push(...batchResult.archivedTasks);
        successCount += batchResult.archivedTasks.length;
        
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} completed: archived ${batchResult.archivedTasks.length} tasks`);
        
      } catch (error) {
        console.error(`❌ Failed to archive batch starting at index ${i}:`, error);
        throw new Error(`Failed to archive batch: ${error.message}`);
      }
      
      // Small delay between batches
      if (i + batchSize < tasksToArchive.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    const result = {
      success: true,
      archivedCount: successCount,
      deletedCount: successCount, // Same as archived count since we delete immediately
      archivedTasks: archivedTasks,
      message: `Successfully archived ${successCount} tasks and deleted ${successCount} from tasks table`
    };
    
    console.log('🎉 Task archiving completed successfully!');
    console.log(`📊 Archive Summary: ${result.message}`);
    
    return result;
    
  } catch (error) {
    console.error('💥 Task archiving failed:', error);
    throw new Error(`Task archiving failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Archives tasks for a specific user (for testing purposes)
 * @param {number} userId - User ID to archive tasks for
 * @returns {Promise<Object>} Archive result with statistics
 */
export const archiveUserTasks = async (userId) => {
  console.log(`🔄 Starting task archiving for user ${userId}...`);
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = await prisma.$transaction(async (tx) => {
      // Find tasks for specific user older than today
      const tasksToArchive = await tx.task.findMany({
        where: {
          userId: userId,
          createdAt: {
            lt: today
          }
        }
      });
      
      console.log(`📊 Found ${tasksToArchive.length} tasks to archive for user ${userId}`);
      
      if (tasksToArchive.length === 0) {
        return {
          success: true,
          archivedCount: 0,
          deletedCount: 0,
          message: `No tasks to archive for user ${userId}`
        };
      }
      
      // Create history entries
      const archivedTasks = [];
      for (const task of tasksToArchive) {
        const historyEntry = await tx.taskHistory.create({
          data: {
            userId: task.userId,
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
        
        archivedTasks.push({
          originalTaskId: task.taskId,
          historyId: historyEntry.historyId,
          title: task.title
        });
      }
      
      // Delete archived tasks
      const deletedTasks = await tx.task.deleteMany({
        where: {
          taskId: {
            in: archivedTasks.map(t => t.originalTaskId)
          }
        }
      });
      
      return {
        success: true,
        archivedCount: archivedTasks.length,
        deletedCount: deletedTasks.count,
        archivedTasks: archivedTasks,
        message: `Successfully archived ${archivedTasks.length} tasks for user ${userId}`
      };
    });
    
    console.log(`✅ User task archiving completed for user ${userId}`);
    return result;
    
  } catch (error) {
    console.error(`❌ User task archiving failed for user ${userId}:`, error);
    throw new Error(`User task archiving failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Gets archiving statistics
 * @returns {Promise<Object>} Statistics about tasks and history
 */
export const getArchivingStats = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [
      totalTasks,
      tasksOlderThanToday,
      totalHistoryEntries,
      todayTasks
    ] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({
        where: {
          createdAt: {
            lt: today
          }
        }
      }),
      prisma.taskHistory.count(),
      prisma.task.count({
        where: {
          createdAt: {
            gte: today
          }
        }
      })
    ]);
    
    return {
      totalTasks,
      tasksOlderThanToday,
      totalHistoryEntries,
      todayTasks,
      readyToArchive: tasksOlderThanToday
    };
    
  } catch (error) {
    console.error('❌ Failed to get archiving stats:', error);
    throw new Error(`Failed to get archiving stats: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Validates that archiving process is safe to run
 * @returns {Promise<Object>} Validation result
 */
export const validateArchivingProcess = async () => {
  try {
    const stats = await getArchivingStats();
    
    // Check if there are tasks ready to archive
    if (stats.tasksOlderThanToday === 0) {
      return {
        isValid: true,
        message: 'No tasks ready for archiving',
        stats: stats
      };
    }
    
    // Check if task_history table has space
    // (This is a basic check - in production you might want more sophisticated validation)
    const historyCount = await prisma.taskHistory.count();
    
    return {
      isValid: true,
      message: `${stats.tasksOlderThanToday} tasks ready for archiving`,
      stats: stats,
      warnings: historyCount > 10000 ? ['Large number of history entries'] : []
    };
    
  } catch (error) {
    console.error('❌ Archiving validation failed:', error);
    return {
      isValid: false,
      message: `Validation failed: ${error.message}`,
      error: error
    };
  } finally {
    await prisma.$disconnect();
  }
};

// Export all functions
export default {
  archiveOldTasks,
  archiveUserTasks,
  getArchivingStats,
  validateArchivingProcess
};