import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { dailyReset } from './services/dailyReset.js';

const prisma = new PrismaClient();

async function testCompleteSystem() {
  try {
    console.log('🧪 Testing Complete System...\n');

    // 1. Get existing Pokemon pets
    console.log('📝 Getting existing Pokemon pets...');
    const pokemonPets = await getExistingPokemonPets();
    console.log(`✅ Found ${pokemonPets.length} existing Pokemon pets\n`);

    // 2. Get existing catchable Pokemon
    console.log('📝 Getting existing catchable Pokemon...');
    const catchablePokemon = await getExistingCatchablePokemon();
    console.log(`✅ Found ${catchablePokemon.length} existing catchable Pokemon\n`);

    // 3. Create test users
    console.log('📝 Creating test users...');
    const testUsers = await createTestUsers(pokemonPets[0]);
    console.log(`✅ Created ${testUsers.length} test users\n`);

    // 4. Create tasks for users
    console.log('📝 Creating test tasks...');
    await createTestTasks(testUsers);
    console.log('✅ Created test tasks for all users\n');

    // 5. Test Pokemon catching
    console.log('📝 Testing Pokemon catching...');
    await testPokemonCatching(testUsers[0], catchablePokemon);
    console.log('✅ Pokemon catching test completed\n');

    // 6. Test companion switching
    console.log('📝 Testing companion switching...');
    await testCompanionSwitching(testUsers[0], catchablePokemon);
    console.log('✅ Companion switching test completed\n');

    // 7. Test daily reset
    console.log('📝 Testing daily reset...');
    await testDailyReset();
    console.log('✅ Daily reset test completed\n');

    // 8. Show final state
    console.log('📊 Final System State:');
    await showFinalState();

    console.log('\n✅ Complete System Test Finished!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function getExistingPokemonPets() {
  const pokemonPets = await prisma.pokemonPet.findMany({
    take: 3 // Get first 3 Pokemon pets
  });
  
  if (pokemonPets.length === 0) {
    console.log('⚠️  No Pokemon pets found in database. Creating basic ones...');
    // Create basic Pokemon pets if none exist
    const basicPets = [
      {
        name: 'Pikachu',
        spriteStage1: '⚡',
        spriteStage2: '⚡⚡',
        spriteStage3: '⚡⚡⚡',
        description: 'A cute electric mouse Pokemon',
        evolution_levels: { stage2: 16, stage3: 32 },
        type: 'Electric'
      },
      {
        name: 'Charmander',
        spriteStage1: '🔥',
        spriteStage2: '🔥🔥',
        spriteStage3: '🔥🔥🔥',
        description: 'A fire lizard Pokemon',
        evolution_levels: { stage2: 16, stage3: 32 },
        type: 'Fire'
      }
    ];

    const createdPets = [];
    for (const pet of basicPets) {
      const created = await prisma.pokemonPet.create({
        data: pet
      });
      createdPets.push(created);
    }
    return createdPets;
  }

  return pokemonPets;
}

async function getExistingCatchablePokemon() {
  const catchablePokemon = await prisma.catchable_pokemon.findMany({
    take: 3 // Get first 3 catchable Pokemon
  });

  if (catchablePokemon.length === 0) {
    console.log('⚠️  No catchable Pokemon found in database. Creating basic ones...');
    // Create basic catchable Pokemon if none exist
    const basicPokemon = [
      {
        pokemon_id: 1,
        name: 'Bulbasaur',
        sprite: '🌱',
        type: 'Grass',
        rarity: 'common',
        difficulty: 1,
        description: 'A grass type starter Pokemon',
        catch_requirement: 'Complete 1 task',
        points_reward: 10
      },
      {
        pokemon_id: 2,
        name: 'Charmander',
        sprite: '🔥',
        type: 'Fire',
        rarity: 'common',
        difficulty: 1,
        description: 'A fire type starter Pokemon',
        catch_requirement: 'Complete 1 task',
        points_reward: 10
      }
    ];

    const createdPokemon = [];
    for (const pokemon of basicPokemon) {
      const created = await prisma.catchable_pokemon.create({
        data: pokemon
      });
      createdPokemon.push(created);
    }
    return createdPokemon;
  }

  return catchablePokemon;
}

async function createTestUsers(starterPokemon) {
  const usersData = [
    {
      email: 'test1@example.com',
      username: 'testuser1',
      password: 'password123',
      pokemonPetId: starterPokemon.petId
    },
    {
      email: 'test2@example.com',
      username: 'testuser2',
      password: 'password123',
      pokemonPetId: starterPokemon.petId
    }
  ];

  const createdUsers = [];
  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        username: userData.username,
        password: hashedPassword,
        pokemonPetId: userData.pokemonPetId
      },
      create: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        pokemonPetId: userData.pokemonPetId,
        gamification: {
          create: {
            points: 0,
            level: 1,
            streakCount: 0,
            badges: []
          }
        }
      },
      include: {
        pokemonPet: true,
        gamification: true
      }
    });
    createdUsers.push(user);
  }

  return createdUsers;
}

async function createTestTasks(users) {
  const taskTitles = [
    'Study for exam',
    'Exercise for 30 minutes',
    'Read a book',
    'Clean the house',
    'Call a friend'
  ];

  for (const user of users) {
    for (let i = 0; i < 3; i++) {
      const isDone = Math.random() > 0.5; // Random completion status
      await prisma.task.create({
        data: {
          userId: user.userId,
          title: taskTitles[i],
          description: `Test task ${i + 1}`,
          category: 'Personal',
          priority: 'Medium',
          isDone: isDone
        }
      });
    }
  }
}

async function testPokemonCatching(user, catchablePokemon) {
  console.log(`  Catching Pokemon for user ${user.username}...`);
  
  // Catch first Pokemon
  const pokemonToCatch = catchablePokemon[0];
  
  // Check if already caught
  const existingCatch = await prisma.userCaughtPokemon.findFirst({
    where: {
      userId: user.userId,
      catchable_pokemon_id: pokemonToCatch.id
    }
  });

  if (!existingCatch) {
    await prisma.userCaughtPokemon.create({
      data: {
        userId: user.userId,
        catchable_pokemon_id: pokemonToCatch.id,
        caughtAt: new Date()
      }
    });
    console.log(`  ✅ Caught ${pokemonToCatch.name}`);
  } else {
    console.log(`  ℹ️  ${pokemonToCatch.name} already caught by ${user.username}`);
  }
}

async function testCompanionSwitching(user, catchablePokemon) {
  console.log(`  Testing companion switching for user ${user.username}...`);
  
  // First, catch a Pokemon if not already caught
  const pokemonToSwitch = catchablePokemon[1];
  const existingCatch = await prisma.userCaughtPokemon.findFirst({
    where: {
      userId: user.userId,
      catchable_pokemon_id: pokemonToSwitch.id
    }
  });

  if (!existingCatch) {
    await prisma.userCaughtPokemon.create({
      data: {
        userId: user.userId,
        catchable_pokemon_id: pokemonToSwitch.id,
        caughtAt: new Date()
      }
    });
  }

  // Find existing PokemonPet for the caught Pokemon
  let pokemonPet = await prisma.pokemonPet.findFirst({
    where: { name: pokemonToSwitch.name }
  });

  if (!pokemonPet) {
    console.log(`  ⚠️  No PokemonPet found for ${pokemonToSwitch.name}, creating one...`);
    // Create PokemonPet if it doesn't exist
    pokemonPet = await prisma.pokemonPet.create({
      data: {
        name: pokemonToSwitch.name,
        spriteStage1: pokemonToSwitch.sprite,
        spriteStage2: pokemonToSwitch.sprite,
        spriteStage3: pokemonToSwitch.sprite,
        description: pokemonToSwitch.description,
        evolution_levels: { stage2: 16, stage3: 32 },
        type: pokemonToSwitch.type
      }
    });
  }

  // Switch companion
  await prisma.user.update({
    where: { userId: user.userId },
    data: { pokemonPetId: pokemonPet.petId }
  });

  console.log(`  ✅ Switched companion to ${pokemonToSwitch.name}`);
}

async function testDailyReset() {
  console.log('  Running daily reset...');
  await dailyReset();
  console.log('  ✅ Daily reset completed');
}

async function showFinalState() {
  const users = await prisma.user.findMany({
    include: {
      pokemonPet: true,
      tasks: true,
      dailyQuests: true,
      caughtPokemon: {
        include: {
          catchable_pokemon: true
        }
      },
      gamification: true
    }
  });

  for (const user of users) {
    console.log(`\n👤 User: ${user.username} (${user.email})`);
    console.log(`  - Companion: ${user.pokemonPet?.name || 'None'}`);
    console.log(`  - Tasks: ${user.tasks.length} (${user.tasks.filter(t => t.isDone).length} completed)`);
    console.log(`  - Daily Quests: ${user.dailyQuests.length}`);
    console.log(`  - Caught Pokemon: ${user.caughtPokemon.length}`);
    console.log(`  - Points: ${user.gamification?.points || 0}`);
    console.log(`  - Level: ${user.gamification?.level || 1}`);
    
    if (user.caughtPokemon.length > 0) {
      console.log('  - Caught Pokemon:');
      user.caughtPokemon.forEach(caught => {
        console.log(`    • ${caught.catchable_pokemon.name}`);
      });
    }
  }
}

testCompleteSystem();
