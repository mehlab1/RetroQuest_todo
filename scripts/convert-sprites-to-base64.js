import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Function to convert image to base64
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64String = imageBuffer.toString('base64');
    const mimeType = path.extname(imagePath).toLowerCase() === '.png' ? 'image/png' : 'image/gif';
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error(`Error converting ${imagePath}:`, error.message);
    return null;
  }
}

// Pokemon data with sprite paths
const pokemonPets = [
  {
    name: "Bulbasaur",
    spriteStage1: "sprites/sprites/pokemon/1.png",
    spriteStage2: "sprites/sprites/pokemon/2.png",
    spriteStage3: "sprites/sprites/pokemon/3.png",
    type: "Grass/Poison",
    description: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
    evolutionLevels: { stage2: 16, stage3: 32 }
  },
  {
    name: "Charmander",
    spriteStage1: "sprites/sprites/pokemon/4.png",
    spriteStage2: "sprites/sprites/pokemon/5.png",
    spriteStage3: "sprites/sprites/pokemon/6.png",
    type: "Fire",
    description: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    name: "Squirtle",
    spriteStage1: "sprites/sprites/pokemon/7.png",
    spriteStage2: "sprites/sprites/pokemon/8.png",
    spriteStage3: "sprites/sprites/pokemon/9.png",
    type: "Water",
    description: "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    name: "Pikachu",
    spriteStage1: "sprites/sprites/pokemon/172.png",
    spriteStage2: "sprites/sprites/pokemon/25.png",
    spriteStage3: "sprites/sprites/pokemon/26.png",
    type: "Electric",
    description: "When several of these Pokémon gather, their electricity can cause lightning storms.",
    evolutionLevels: { stage2: 10, stage3: 30 }
  },
  {
    name: "Eevee",
    spriteStage1: "sprites/sprites/pokemon/133.png",
    spriteStage2: "sprites/sprites/pokemon/134.png",
    spriteStage3: "sprites/sprites/pokemon/135.png",
    type: "Normal",
    description: "Its genetic code is irregular. It may mutate if it is exposed to radiation from element stones.",
    evolutionLevels: { stage2: 20, stage3: 40 }
  },
  {
    name: "Chikorita",
    spriteStage1: "sprites/sprites/pokemon/152.png",
    spriteStage2: "sprites/sprites/pokemon/153.png",
    spriteStage3: "sprites/sprites/pokemon/154.png",
    type: "Grass",
    description: "A sweet aroma gently wafts from the leaf on its head. It is docile and loves to soak up the sun's rays.",
    evolutionLevels: { stage2: 16, stage3: 32 }
  },
  {
    name: "Cyndaquil",
    spriteStage1: "sprites/sprites/pokemon/155.png",
    spriteStage2: "sprites/sprites/pokemon/156.png",
    spriteStage3: "sprites/sprites/pokemon/157.png",
    type: "Fire",
    description: "It is timid, and always curls itself up in a ball. If attacked, it flares up its back for protection.",
    evolutionLevels: { stage2: 14, stage3: 36 }
  },
  {
    name: "Totodile",
    spriteStage1: "sprites/sprites/pokemon/158.png",
    spriteStage2: "sprites/sprites/pokemon/159.png",
    spriteStage3: "sprites/sprites/pokemon/160.png",
    type: "Water",
    description: "Its well-developed jaws are powerful and capable of crushing anything. Even its trainer must be careful.",
    evolutionLevels: { stage2: 18, stage3: 30 }
  },
  {
    name: "Treecko",
    spriteStage1: "sprites/sprites/pokemon/252.png",
    spriteStage2: "sprites/sprites/pokemon/253.png",
    spriteStage3: "sprites/sprites/pokemon/254.png",
    type: "Grass",
    description: "Treecko has small hooks on the bottom of its feet that enable it to scale vertical walls.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    name: "Torchic",
    spriteStage1: "sprites/sprites/pokemon/255.png",
    spriteStage2: "sprites/sprites/pokemon/256.png",
    spriteStage3: "sprites/sprites/pokemon/257.png",
    type: "Fire",
    description: "Torchic sticks with its Trainer, following behind with unsteady steps. This Pokémon breathes fire of over 1,800 degrees F.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    name: "Mudkip",
    spriteStage1: "sprites/sprites/pokemon/258.png",
    spriteStage2: "sprites/sprites/pokemon/259.png",
    spriteStage3: "sprites/sprites/pokemon/260.png",
    type: "Water",
    description: "The fin on Mudkip's head acts as highly sensitive radar. Using this fin to sense movements of water and air.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  }
];

// Catchable Pokemon data
const catchablePokemon = [
  {
    pokemonId: 19,
    name: "Rattata",
    sprite: "sprites/sprites/pokemon/19.png",
    type: "Normal",
    rarity: "common",
    difficulty: 1,
    description: "A small, quick Pokémon that's easy to find.",
    catchRequirement: "Complete 1 task",
    pointsReward: 5
  },
  {
    pokemonId: 16,
    name: "Pidgey",
    sprite: "sprites/sprites/pokemon/16.png",
    type: "Normal/Flying",
    rarity: "common",
    difficulty: 1,
    description: "A gentle bird Pokémon that's commonly seen.",
    catchRequirement: "Complete 2 tasks",
    pointsReward: 8
  },
  {
    pokemonId: 10,
    name: "Caterpie",
    sprite: "sprites/sprites/pokemon/10.png",
    type: "Bug",
    rarity: "common",
    difficulty: 1,
    description: "A small caterpillar that's very common.",
    catchRequirement: "Complete any task",
    pointsReward: 3
  },
  {
    pokemonId: 13,
    name: "Weedle",
    sprite: "sprites/sprites/pokemon/13.png",
    type: "Bug/Poison",
    rarity: "common",
    difficulty: 1,
    description: "A small bug Pokémon with a poisonous stinger.",
    catchRequirement: "Complete 1 task",
    pointsReward: 4
  },
  {
    pokemonId: 21,
    name: "Spearow",
    sprite: "sprites/sprites/pokemon/21.png",
    type: "Normal/Flying",
    rarity: "common",
    difficulty: 2,
    description: "A small bird Pokémon that's easily startled.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 29,
    name: "Nidoran♀",
    sprite: "sprites/sprites/pokemon/29.png",
    type: "Poison",
    rarity: "common",
    difficulty: 2,
    description: "A female Nidoran with a gentle nature.",
    catchRequirement: "Complete 2 tasks in one day",
    pointsReward: 7
  },
  {
    pokemonId: 32,
    name: "Nidoran♂",
    sprite: "sprites/sprites/pokemon/32.png",
    type: "Poison",
    rarity: "common",
    difficulty: 2,
    description: "A male Nidoran with a more aggressive nature.",
    catchRequirement: "Complete 2 tasks in one day",
    pointsReward: 7
  },
  {
    pokemonId: 37,
    name: "Vulpix",
    sprite: "sprites/sprites/pokemon/37.png",
    type: "Fire",
    rarity: "common",
    difficulty: 3,
    description: "A fox Pokémon with six beautiful tails.",
    catchRequirement: "Complete 4 tasks",
    pointsReward: 10
  },
  {
    pokemonId: 41,
    name: "Zubat",
    sprite: "sprites/sprites/pokemon/41.png",
    type: "Poison/Flying",
    rarity: "common",
    difficulty: 2,
    description: "Forms colonies in perpetually dark places.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 43,
    name: "Oddish",
    sprite: "sprites/sprites/pokemon/43.png",
    type: "Grass/Poison",
    rarity: "common",
    difficulty: 2,
    description: "During the day, it keeps its face buried in the ground.",
    catchRequirement: "Complete 2 tasks",
    pointsReward: 5
  },
  {
    pokemonId: 129,
    name: "Magikarp",
    sprite: "sprites/sprites/pokemon/129.png",
    type: "Water",
    rarity: "common",
    difficulty: 1,
    description: "In the distant past, it was somewhat stronger than the horribly weak descendants that exist today.",
    catchRequirement: "Complete 1 task",
    pointsReward: 2
  },
  {
    pokemonId: 63,
    name: "Abra",
    sprite: "sprites/sprites/pokemon/63.png",
    type: "Psychic",
    rarity: "uncommon",
    difficulty: 4,
    description: "Using its ability to read minds, it will identify impending danger and teleport to safety.",
    catchRequirement: "Complete 5 tasks",
    pointsReward: 15
  },
  {
    pokemonId: 77,
    name: "Ponyta",
    sprite: "sprites/sprites/pokemon/77.png",
    type: "Fire",
    rarity: "uncommon",
    difficulty: 4,
    description: "Its hooves are 10 times harder than diamonds. It can trample anything completely flat in little time.",
    catchRequirement: "Complete 5 tasks",
    pointsReward: 12
  },
  {
    pokemonId: 81,
    name: "Magnemite",
    sprite: "sprites/sprites/pokemon/81.png",
    type: "Electric/Steel",
    rarity: "uncommon",
    difficulty: 4,
    description: "Uses anti-gravity to stay suspended. Appears without warning and uses Thunder Wave.",
    catchRequirement: "Complete 5 tasks",
    pointsReward: 13
  },
  {
    pokemonId: 113,
    name: "Chansey",
    sprite: "sprites/sprites/pokemon/113.png",
    type: "Normal",
    rarity: "rare",
    difficulty: 6,
    description: "A rare and elusive Pokémon that is said to bring happiness to those who manage to get it.",
    catchRequirement: "Complete 8 tasks",
    pointsReward: 25
  },
  {
    pokemonId: 115,
    name: "Kangaskhan",
    sprite: "sprites/sprites/pokemon/115.png",
    type: "Normal",
    rarity: "rare",
    difficulty: 6,
    description: "The infant rarely ventures out of its mother's protective pouch until it is 3 years old.",
    catchRequirement: "Complete 8 tasks",
    pointsReward: 20
  },
  {
    pokemonId: 131,
    name: "Lapras",
    sprite: "sprites/sprites/pokemon/131.png",
    type: "Water/Ice",
    rarity: "rare",
    difficulty: 8,
    description: "A Pokémon that has been overhunted almost to extinction. It can ferry people across the water.",
    catchRequirement: "Complete 12 tasks",
    pointsReward: 35
  },
  {
    pokemonId: 144,
    name: "Articuno",
    sprite: "sprites/sprites/pokemon/144.png",
    type: "Ice/Flying",
    rarity: "legendary",
    difficulty: 10,
    description: "A legendary bird Pokémon that is said to appear to doomed people who are lost in icy mountains.",
    catchRequirement: "Complete 20 tasks",
    pointsReward: 100
  },
  {
    pokemonId: 145,
    name: "Zapdos",
    sprite: "sprites/sprites/pokemon/145.png",
    type: "Electric/Flying",
    rarity: "legendary",
    difficulty: 10,
    description: "A legendary bird Pokémon that is said to appear from clouds while dropping enormous lightning bolts.",
    catchRequirement: "Complete 20 tasks",
    pointsReward: 100
  },
  {
    pokemonId: 146,
    name: "Moltres",
    sprite: "sprites/sprites/pokemon/146.png",
    type: "Fire/Flying",
    rarity: "legendary",
    difficulty: 10,
    description: "Known as the legendary bird of fire. Every flap of its wings creates a dazzling flash of flames.",
    catchRequirement: "Complete 20 tasks",
    pointsReward: 100
  },
  {
    pokemonId: 150,
    name: "Mewtwo",
    sprite: "sprites/sprites/pokemon/150.png",
    type: "Psychic",
    rarity: "legendary",
    difficulty: 10,
    description: "Its DNA is almost the same as Mew's. However, its size and disposition are vastly different.",
    catchRequirement: "Complete 25 tasks",
    pointsReward: 150
  },
  {
    pokemonId: 151,
    name: "Mew",
    sprite: "sprites/sprites/pokemon/151.png",
    type: "Psychic",
    rarity: "mythical",
    difficulty: 10,
    description: "So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide.",
    catchRequirement: "Complete 30 tasks",
    pointsReward: 200
  }
];

async function main() {
  console.log('🔄 Converting Pokemon sprites to base64...');

  // Convert Pokemon Pets
  console.log('🎮 Converting Pokemon Pets...');
  for (const pokemon of pokemonPets) {
    const spriteStage1Base64 = imageToBase64(pokemon.spriteStage1);
    const spriteStage2Base64 = imageToBase64(pokemon.spriteStage2);
    const spriteStage3Base64 = imageToBase64(pokemon.spriteStage3);

    if (spriteStage1Base64 && spriteStage2Base64 && spriteStage3Base64) {
      await prisma.pokemonPet.upsert({
        where: { name: pokemon.name },
        update: {
          spriteStage1: spriteStage1Base64,
          spriteStage2: spriteStage2Base64,
          spriteStage3: spriteStage3Base64,
          type: pokemon.type,
          description: pokemon.description,
          evolutionLevels: pokemon.evolutionLevels
        },
        create: {
          name: pokemon.name,
          spriteStage1: spriteStage1Base64,
          spriteStage2: spriteStage2Base64,
          spriteStage3: spriteStage3Base64,
          type: pokemon.type,
          description: pokemon.description,
          evolutionLevels: pokemon.evolutionLevels
        }
      });
      console.log(`✅ Updated ${pokemon.name}`);
    } else {
      console.log(`❌ Failed to convert sprites for ${pokemon.name}`);
    }
  }

  // Convert Catchable Pokemon
  console.log('🎯 Converting Catchable Pokemon...');
  for (const pokemon of catchablePokemon) {
    const spriteBase64 = imageToBase64(pokemon.sprite);

    if (spriteBase64) {
      await prisma.catchablePokemon.upsert({
        where: { pokemonId: pokemon.pokemonId },
        update: {
          name: pokemon.name,
          sprite: spriteBase64,
          type: pokemon.type,
          rarity: pokemon.rarity,
          difficulty: pokemon.difficulty,
          description: pokemon.description,
          catchRequirement: pokemon.catchRequirement,
          pointsReward: pokemon.pointsReward
        },
        create: {
          pokemonId: pokemon.pokemonId,
          name: pokemon.name,
          sprite: spriteBase64,
          type: pokemon.type,
          rarity: pokemon.rarity,
          difficulty: pokemon.difficulty,
          description: pokemon.description,
          catchRequirement: pokemon.catchRequirement,
          pointsReward: pokemon.pointsReward
        }
      });
      console.log(`✅ Updated ${pokemon.name}`);
    } else {
      console.log(`❌ Failed to convert sprite for ${pokemon.name}`);
    }
  }

  console.log('🎉 All Pokemon sprites converted to base64!');
}

main()
  .catch((e) => {
    console.error('❌ Error during conversion:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
