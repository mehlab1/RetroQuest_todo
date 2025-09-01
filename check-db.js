import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database content...\n');
    
    // Check catchable Pokemon
    const catchableCount = await prisma.catchablePokemon.count();
    console.log(`📊 Catchable Pokemon count: ${catchableCount}`);
    
    if (catchableCount > 0) {
      const samplePokemon = await prisma.catchablePokemon.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          type: true,
          rarity: true,
          difficulty: true
        }
      });
      
      console.log('\n🎯 Sample Pokemon:');
      samplePokemon.forEach(p => {
        console.log(`  - ${p.name} (${p.type}) - ${p.rarity} - Difficulty: ${p.difficulty}`);
      });
    }
    
    // Check Pokemon Pets
    const petCount = await prisma.pokemonPet.count();
    console.log(`\n🐾 Pokemon Pets count: ${petCount}`);
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
