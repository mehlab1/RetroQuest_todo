import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function pngToBase64(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64String = imageBuffer.toString('base64');
    return `data:image/png;base64,${base64String}`;
  } catch (error) {
    console.error(`Error converting ${filePath} to base64:`, error.message);
    return null;
  }
}

const pokemonPets = [
  {
    name: "Bulbasaur",
    spriteStage1: "../sprites/sprites/pokemon/1.png", // Bulbasaur
    spriteStage2: "../sprites/sprites/pokemon/2.png", // Ivysaur
    spriteStage3: "../sprites/sprites/pokemon/3.png", // Venusaur
    type: "Grass/Poison",
    description: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
    evolutionLevels: { stage2: 16, stage3: 32 }
  },
  {
    name: "Charmander",
    spriteStage1: "../sprites/sprites/pokemon/4.png", // Charmander
    spriteStage2: "../sprites/sprites/pokemon/5.png", // Charmeleon
    spriteStage3: "../sprites/sprites/pokemon/6.png", // Charizard
    type: "Fire",
    description: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    name: "Squirtle",
    spriteStage1: "../sprites/sprites/pokemon/7.png", // Squirtle
    spriteStage2: "../sprites/sprites/pokemon/8.png", // Wartortle
    spriteStage3: "../sprites/sprites/pokemon/9.png", // Blastoise
    type: "Water",
    description: "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  }
];

const catchablePokemon = [
  { pokemonId: 1, name: "Bulbasaur", sprite: "../sprites/sprites/pokemon/1.png", type: "Grass/Poison", rarity: "common", difficulty: 1, description: "A strange seed was planted on its back at birth.", catchRequirement: "Complete 1 task", pointsReward: 5 },
  { pokemonId: 4, name: "Charmander", sprite: "../sprites/sprites/pokemon/4.png", type: "Fire", rarity: "common", difficulty: 1, description: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.", catchRequirement: "Complete 1 task", pointsReward: 5 },
  { pokemonId: 7, name: "Squirtle", sprite: "../sprites/sprites/pokemon/7.png", type: "Water", rarity: "common", difficulty: 1, description: "After birth, its back swells and hardens into a shell.", catchRequirement: "Complete 1 task", pointsReward: 5 },
  { pokemonId: 25, name: "Pikachu", sprite: "../sprites/sprites/pokemon/25.png", type: "Electric", rarity: "uncommon", difficulty: 3, description: "When several of these Pokémon gather, their electricity can cause lightning storms.", catchRequirement: "Complete 3 tasks", pointsReward: 15 },
  { pokemonId: 133, name: "Eevee", sprite: "../sprites/sprites/pokemon/133.png", type: "Normal", rarity: "uncommon", difficulty: 4, description: "Its genetic code is irregular. It may mutate if it is exposed to radiation from element stones.", catchRequirement: "Complete 5 tasks", pointsReward: 20 },
  { pokemonId: 6, name: "Charizard", sprite: "../sprites/sprites/pokemon/6.png", type: "Fire/Flying", rarity: "rare", difficulty: 7, description: "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.", catchRequirement: "Complete 10 tasks", pointsReward: 35 },
  { pokemonId: 9, name: "Blastoise", sprite: "../sprites/sprites/pokemon/9.png", type: "Water", rarity: "rare", difficulty: 7, description: "A brutal Pokémon with pressurized water jets on its shell. They are used for high speed tackles.", catchRequirement: "Complete 10 tasks", pointsReward: 35 },
  { pokemonId: 3, name: "Venusaur", sprite: "../sprites/sprites/pokemon/3.png", type: "Grass/Poison", rarity: "rare", difficulty: 7, description: "The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.", catchRequirement: "Complete 10 tasks", pointsReward: 35 },
  { pokemonId: 150, name: "Mewtwo", sprite: "../sprites/sprites/pokemon/150.png", type: "Psychic", rarity: "legendary", difficulty: 10, description: "Its DNA is almost the same as Mew's. However, its size and disposition are vastly different.", catchRequirement: "Complete 25 tasks", pointsReward: 100 },
  { pokemonId: 151, name: "Mew", sprite: "../sprites/sprites/pokemon/151.png", type: "Psychic", rarity: "mythical", difficulty: 10, description: "So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide.", catchRequirement: "Complete 30 tasks", pointsReward: 150 }
];

async function populatePokemonDatabase() {
  try {
    console.log('Starting Pokemon database population...');

    // Clear existing data
    console.log('Clearing existing Pokemon data...');
    await prisma.userCaughtPokemon.deleteMany();
    await prisma.catchablePokemon.deleteMany();
    await prisma.pokemonPet.deleteMany();

    console.log('Creating Pokemon pets...');
    for (const pokemon of pokemonPets) {
      const spriteStage1 = pngToBase64(pokemon.spriteStage1);
      const spriteStage2 = pngToBase64(pokemon.spriteStage2);
      const spriteStage3 = pngToBase64(pokemon.spriteStage3);

      if (spriteStage1 && spriteStage2 && spriteStage3) {
        await prisma.pokemonPet.create({
          data: {
            name: pokemon.name,
            spriteStage1,
            spriteStage2,
            spriteStage3,
            type: pokemon.type,
            description: pokemon.description,
            evolutionLevels: pokemon.evolutionLevels
          }
        });
        console.log(`✅ Created Pokemon pet: ${pokemon.name}`);
      } else {
        console.log(`❌ Failed to create Pokemon pet: ${pokemon.name} - sprite conversion failed`);
      }
    }

    console.log('Creating catchable Pokemon...');
    for (const pokemon of catchablePokemon) {
      const sprite = pngToBase64(pokemon.sprite);
      
      if (sprite) {
        await prisma.catchablePokemon.create({
          data: {
            pokemonId: pokemon.pokemonId,
            name: pokemon.name,
            sprite,
            type: pokemon.type,
            rarity: pokemon.rarity,
            difficulty: pokemon.difficulty,
            description: pokemon.description,
            catchRequirement: pokemon.catchRequirement,
            pointsReward: pokemon.pointsReward
          }
        });
        console.log(`✅ Created catchable Pokemon: ${pokemon.name}`);
      } else {
        console.log(`❌ Failed to create catchable Pokemon: ${pokemon.name} - sprite conversion failed`);
      }
    }

    console.log('🎉 Pokemon database population completed successfully!');
    
    // Verify the data
    const petCount = await prisma.pokemonPet.count();
    const catchableCount = await prisma.catchablePokemon.count();
    
    console.log(`📊 Database now contains:`);
    console.log(`   - ${petCount} Pokemon pets`);
    console.log(`   - ${catchableCount} catchable Pokemon`);

  } catch (error) {
    console.error('❌ Error populating Pokemon database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populatePokemonDatabase().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
