import { dailyReset } from './services/dailyReset.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDailyReset() {
  try {
    console.log('🧪 Testing Daily Reset Logic...\n');

    // 1. Check current state
    console.log('📊 Current State:');
    const users = await prisma.user.findMany({
      include: {
        tasks: true,
        dailyQuests: true
      }
    });

    console.log(`Found ${users.length} users`);
    
    for (const user of users) {
      console.log(`\n👤 User ${user.userId} (${user.email}):`);
      console.log(`  - Tasks: ${user.tasks.length} (${user.tasks.filter(t => t.isDone).length} completed)`);
      console.log(`  - Daily Quests: ${user.dailyQuests.length}`);
      
      if (user.tasks.length > 0) {
        console.log('  - Sample tasks:');
        user.tasks.slice(0, 3).forEach(task => {
          console.log(`    • ${task.title} (${task.isDone ? '✅' : '❌'}) - Created: ${task.createdAt.toDateString()}`);
        });
      }
    }

    // 2. Run daily reset
    console.log('\n🔄 Running Daily Reset...');
    await dailyReset();

    // 3. Check state after reset
    console.log('\n📊 State After Reset:');
    const usersAfter = await prisma.user.findMany({
      include: {
        tasks: true,
        dailyQuests: true,
        taskHistory: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }
      }
    });

    for (const user of usersAfter) {
      console.log(`\n👤 User ${user.userId} (${user.email}):`);
      console.log(`  - Tasks: ${user.tasks.length} (${user.tasks.filter(t => t.isDone).length} completed)`);
      console.log(`  - Daily Quests: ${user.dailyQuests.length}`);
      console.log(`  - Archived Tasks Today: ${user.taskHistory.length}`);
      
      if (user.tasks.length > 0) {
        console.log('  - Current tasks:');
        user.tasks.forEach(task => {
          console.log(`    • ${task.title} (${task.isDone ? '✅' : '❌'}) - Created: ${task.createdAt.toDateString()}`);
        });
      }
      
      if (user.dailyQuests.length > 0) {
        console.log('  - Daily quests:');
        user.dailyQuests.forEach(quest => {
          console.log(`    • ${quest.title} (${quest.points} points) - Created: ${quest.createdAt.toDateString()}`);
        });
      }
    }

    console.log('\n✅ Daily Reset Test Completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDailyReset();
