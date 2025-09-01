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

  // Demo users removed for security - only Google OAuth registration allowed

  // Sample tasks and quests will be created by actual users
  console.log('📝 Sample data will be created by users during registration');

  // Create some task history for charts
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Task history removed - will be created by actual users

  console.log('✅ Database seeded successfully!');
  console.log('🔐 Security: Demo accounts removed - Google OAuth only');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });