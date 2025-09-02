import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPokemon() {
  try {
    console.log('🔍 Checking catchable Pokemon in database...\n');
    
    const pokemon = await prisma.catchablePokemon.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        rarity: true,
        difficulty: true,
        catchRequirement: true,
        pointsReward: true
      },
      orderBy: { name: 'asc' }
    });
    
    console.log(`📊 Found ${pokemon.length} catchable Pokemon:\n`);
    
    pokemon.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name}`);
      console.log(`   Type: ${p.type}`);
      console.log(`   Rarity: ${p.rarity}`);
      console.log(`   Difficulty: ${p.difficulty}`);
      console.log(`   Requirement: ${p.catchRequirement}`);
      console.log(`   Points: ${p.pointsReward}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPokemon();
