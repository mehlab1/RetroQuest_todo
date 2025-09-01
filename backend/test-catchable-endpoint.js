import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCatchableEndpoint() {
  try {
    console.log('🔍 Testing catchable Pokemon endpoint logic...\n');

    // Test 1: Check if catchable Pokemon exist
    console.log('📊 Test 1: Check catchable Pokemon count');
    const catchableCount = await prisma.catchable_pokemon.count();
    console.log(`   Total catchable Pokemon: ${catchableCount}`);

    // Test 2: Get first few catchable Pokemon
    console.log('\n📊 Test 2: Get first 3 catchable Pokemon');
    const catchablePokemon = await prisma.catchable_pokemon.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        sprite: true,
        type: true
      }
    });

    catchablePokemon.forEach((pokemon, index) => {
      console.log(`   ${index + 1}. ${pokemon.name} (ID: ${pokemon.id})`);
      console.log(`      Type: ${pokemon.type}`);
      console.log(`      Has sprite: ${!!pokemon.sprite}`);
      console.log(`      Sprite length: ${pokemon.sprite ? pokemon.sprite.length : 0}`);
    });

    // Test 3: Try to find specific Pokemon by ID
    console.log('\n📊 Test 3: Try to find Pokemon with ID 3');
    const pokemon3 = await prisma.catchable_pokemon.findUnique({
      where: { id: 3 },
      select: {
        id: true,
        name: true,
        sprite: true
      }
    });

    if (pokemon3) {
      console.log(`   ✅ Found Pokemon: ${pokemon3.name} (ID: ${pokemon3.id})`);
      console.log(`   Has sprite: ${!!pokemon3.sprite}`);
      console.log(`   Sprite length: ${pokemon3.sprite ? pokemon3.sprite.length : 0}`);
      
      // Test 4: Try to create buffer from sprite
      if (pokemon3.sprite) {
        try {
          const buffer = Buffer.from(pokemon3.sprite, 'base64');
          console.log(`   ✅ Buffer created successfully (${buffer.length} bytes)`);
          console.log(`   PNG signature: ${buffer.slice(0, 8).toString('hex') === '89504e470d0a1a0a'}`);
        } catch (error) {
          console.log(`   ❌ Failed to create buffer: ${error.message}`);
        }
      }
    } else {
      console.log('   ❌ Pokemon with ID 3 not found');
    }

    // Test 5: Check table structure
    console.log('\n📊 Test 5: Check table structure');
    try {
      const samplePokemon = await prisma.catchable_pokemon.findFirst({
        select: {
          id: true,
          name: true,
          sprite: true,
          type: true,
          rarity: true
        }
      });
      
      if (samplePokemon) {
        console.log('   ✅ Table structure looks correct');
        console.log(`   Sample fields: ${Object.keys(samplePokemon).join(', ')}`);
      }
    } catch (error) {
      console.log(`   ❌ Table access error: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error testing catchable endpoint:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCatchableEndpoint();
