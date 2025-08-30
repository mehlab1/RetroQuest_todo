import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.taskHistory.deleteMany();
  await prisma.task.deleteMany();
  await prisma.dailyQuest.deleteMany();
  await prisma.gamification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pokemonPet.deleteMany();

  // Seed Pokémon pets
  const pokemonPets = await prisma.pokemonPet.createMany({
    data: [
      {
        name: 'Charmander',
        spriteStage1: '🦎',
        spriteStage2: '🐲',
        spriteStage3: '🔥',
        levelRequired: 1
      },
      {
        name: 'Bulbasaur',
        spriteStage1: '🌱',
        spriteStage2: '🌿',
        spriteStage3: '🌳',
        levelRequired: 1
      },
      {
        name: 'Squirtle',
        spriteStage1: '🐢',
        spriteStage2: '🌊',
        spriteStage3: '💧',
        levelRequired: 1
      },
      {
        name: 'Pikachu',
        spriteStage1: '⚡',
        spriteStage2: '🔋',
        spriteStage3: '⚡',
        levelRequired: 5
      }
    ]
  });

  // Get created pets for user assignment
  const createdPets = await prisma.pokemonPet.findMany();

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const ashUser = await prisma.user.create({
    data: {
      email: 'ash@pokemon.com',
      username: 'Ash',
      password: hashedPassword,
      points: 150,
      level: 2,
      pokemonPetId: createdPets[0].petId, // Charmander
      gamification: {
        create: {
          points: 150,
          level: 2,
          streakCount: 3,
          badges: ['Rookie Trainer']
        }
      }
    }
  });

  const mistyUser = await prisma.user.create({
    data: {
      email: 'misty@pokemon.com',
      username: 'Misty',
      password: hashedPassword,
      points: 250,
      level: 3,
      pokemonPetId: createdPets[2].petId, // Squirtle
      gamification: {
        create: {
          points: 250,
          level: 3,
          streakCount: 5,
          badges: ['Rookie Trainer', 'Water Expert']
        }
      }
    }
  });

  // Create sample tasks
  const tasks = [
    { title: 'Catch 5 Pokémon', category: 'Training', userId: ashUser.userId },
    { title: 'Practice battle moves', category: 'Training', userId: ashUser.userId },
    { title: 'Visit Pokémon Center', category: 'Health', userId: ashUser.userId },
    { title: 'Train water-type moves', category: 'Training', userId: mistyUser.userId },
    { title: 'Clean the Gym', category: 'Chores', userId: mistyUser.userId },
    { title: 'Study Pokémon types', category: 'Learning', userId: mistyUser.userId }
  ];

  for (const taskData of tasks) {
    await prisma.task.create({
      data: taskData
    });
  }

  // Create daily quests
  await prisma.dailyQuest.createMany({
    data: [
      { userId: ashUser.userId, title: 'Complete 3 tasks', points: 25 },
      { userId: ashUser.userId, title: 'Focus for 25 minutes', points: 30 },
      { userId: mistyUser.userId, title: 'Exercise for 15 minutes', points: 20 },
      { userId: mistyUser.userId, title: 'Read for 10 minutes', points: 15 }
    ]
  });

  // Create some task history for charts
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  await prisma.taskHistory.createMany({
    data: [
      { userId: ashUser.userId, taskId: 1, date: yesterday, isDone: true, completedAt: yesterday },
      { userId: ashUser.userId, taskId: 2, date: yesterday, isDone: false },
      { userId: mistyUser.userId, taskId: 4, date: yesterday, isDone: true, completedAt: yesterday },
      { userId: mistyUser.userId, taskId: 5, date: weekAgo, isDone: true, completedAt: weekAgo }
    ]
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Demo users created:');
  console.log('   - ash@pokemon.com (password: password123)');
  console.log('   - misty@pokemon.com (password: password123)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });