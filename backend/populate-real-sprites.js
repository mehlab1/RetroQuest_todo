import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

// Pokemon data with evolution chains
const pokemonData = [
  { id: 1, name: 'Bulbasaur', type: 'Grass', evolutionChain: [1, 2, 3] },
  { id: 4, name: 'Charmander', type: 'Fire', evolutionChain: [4, 5, 6] },
  { id: 7, name: 'Squirtle', type: 'Water', evolutionChain: [7, 8, 9] },
  { id: 10, name: 'Caterpie', type: 'Bug', evolutionChain: [10, 11, 12] },
  { id: 13, name: 'Weedle', type: 'Bug', evolutionChain: [13, 14, 15] },
  { id: 16, name: 'Pidgey', type: 'Normal', evolutionChain: [16, 17, 18] },
  { id: 19, name: 'Rattata', type: 'Normal', evolutionChain: [19, 20] },
  { id: 21, name: 'Spearow', type: 'Normal', evolutionChain: [21, 22] },
  { id: 23, name: 'Ekans', type: 'Poison', evolutionChain: [23, 24] },
  { id: 25, name: 'Pikachu', type: 'Electric', evolutionChain: [172, 25, 26] },
  { id: 27, name: 'Sandshrew', type: 'Ground', evolutionChain: [27, 28] },
  { id: 29, name: 'Nidoran♀', type: 'Poison', evolutionChain: [29, 30, 31] },
  { id: 32, name: 'Nidoran♂', type: 'Poison', evolutionChain: [32, 33, 34] },
  { id: 35, name: 'Clefairy', type: 'Fairy', evolutionChain: [173, 35, 36] },
  { id: 37, name: 'Vulpix', type: 'Fire', evolutionChain: [37, 38] },
  { id: 39, name: 'Jigglypuff', type: 'Normal', evolutionChain: [174, 39, 40] },
  { id: 41, name: 'Zubat', type: 'Poison', evolutionChain: [41, 42, 169] },
  { id: 43, name: 'Oddish', type: 'Grass', evolutionChain: [43, 44, 45, 182, 186] },
  { id: 46, name: 'Paras', type: 'Bug', evolutionChain: [46, 47] },
  { id: 48, name: 'Venonat', type: 'Bug', evolutionChain: [48, 49] },
  { id: 50, name: 'Diglett', type: 'Ground', evolutionChain: [50, 51] },
  { id: 52, name: 'Meowth', type: 'Normal', evolutionChain: [52, 53] },
  { id: 54, name: 'Psyduck', type: 'Water', evolutionChain: [54, 55] },
  { id: 56, name: 'Mankey', type: 'Fighting', evolutionChain: [56, 57] },
  { id: 58, name: 'Growlithe', type: 'Fire', evolutionChain: [58, 59] },
  { id: 60, name: 'Poliwag', type: 'Water', evolutionChain: [60, 61, 62, 186] },
  { id: 63, name: 'Abra', type: 'Psychic', evolutionChain: [63, 64, 65] },
  { id: 66, name: 'Machop', type: 'Fighting', evolutionChain: [66, 67, 68] },
  { id: 69, name: 'Bellsprout', type: 'Grass', evolutionChain: [69, 70, 71] },
  { id: 72, name: 'Tentacool', type: 'Water', evolutionChain: [72, 73] },
  { id: 74, name: 'Geodude', type: 'Rock', evolutionChain: [74, 75, 76] },
  { id: 77, name: 'Ponyta', type: 'Fire', evolutionChain: [77, 78] },
  { id: 79, name: 'Slowpoke', type: 'Water', evolutionChain: [79, 80, 199] },
  { id: 81, name: 'Magnemite', type: 'Electric', evolutionChain: [81, 82, 462] },
  { id: 84, name: 'Doduo', type: 'Normal', evolutionChain: [84, 85] },
  { id: 86, name: 'Seel', type: 'Water', evolutionChain: [86, 87] },
  { id: 88, name: 'Grimer', type: 'Poison', evolutionChain: [88, 89] },
  { id: 90, name: 'Shellder', type: 'Water', evolutionChain: [90, 91] },
  { id: 92, name: 'Gastly', type: 'Ghost', evolutionChain: [92, 93, 94] },
  { id: 95, name: 'Onix', type: 'Rock', evolutionChain: [95, 208] },
  { id: 96, name: 'Drowzee', type: 'Water', evolutionChain: [96, 97] },
  { id: 98, name: 'Krabby', type: 'Water', evolutionChain: [98, 99] },
  { id: 100, name: 'Voltorb', type: 'Electric', evolutionChain: [100, 101] },
  { id: 102, name: 'Exeggcute', type: 'Grass', evolutionChain: [102, 103] },
  { id: 104, name: 'Cubone', type: 'Ground', evolutionChain: [104, 105] },
  { id: 106, name: 'Hitmonlee', type: 'Fighting', evolutionChain: [236, 106, 107, 237] },
  { id: 107, name: 'Hitmonchan', type: 'Fighting', evolutionChain: [236, 106, 107, 237] },
  { id: 108, name: 'Lickitung', type: 'Normal', evolutionChain: [108, 463] },
  { id: 109, name: 'Koffing', type: 'Poison', evolutionChain: [109, 110] },
  { id: 111, name: 'Rhyhorn', type: 'Ground', evolutionChain: [111, 112, 464] },
  { id: 113, name: 'Chansey', type: 'Normal', evolutionChain: [440, 113, 242] },
  { id: 114, name: 'Tangela', type: 'Grass', evolutionChain: [114, 465] },
  { id: 115, name: 'Kangaskhan', type: 'Normal', evolutionChain: [115] },
  { id: 116, name: 'Horsea', type: 'Water', evolutionChain: [116, 117, 230] },
  { id: 118, name: 'Goldeen', type: 'Water', evolutionChain: [118, 119] },
  { id: 120, name: 'Staryu', type: 'Water', evolutionChain: [120, 121] },
  { id: 122, name: 'Mr. Mime', type: 'Psychic', evolutionChain: [439, 122, 866] },
  { id: 123, name: 'Scyther', type: 'Bug', evolutionChain: [123, 212] },
  { id: 124, name: 'Jynx', type: 'Ice', evolutionChain: [238, 124] },
  { id: 125, name: 'Electabuzz', type: 'Electric', evolutionChain: [239, 125, 466] },
  { id: 126, name: 'Magmar', type: 'Fire', evolutionChain: [240, 126, 467] },
  { id: 127, name: 'Pinsir', type: 'Bug', evolutionChain: [127] },
  { id: 128, name: 'Tauros', type: 'Normal', evolutionChain: [128] },
  { id: 129, name: 'Magikarp', type: 'Water', evolutionChain: [129, 130] },
  { id: 131, name: 'Lapras', type: 'Water', evolutionChain: [131] },
  { id: 132, name: 'Ditto', type: 'Normal', evolutionChain: [132] },
  { id: 133, name: 'Eevee', type: 'Normal', evolutionChain: [133, 134, 135, 136, 196, 197, 470, 471, 700] },
  { id: 137, name: 'Porygon', type: 'Normal', evolutionChain: [137, 233, 474] },
  { id: 138, name: 'Omanyte', type: 'Rock', evolutionChain: [138, 139] },
  { id: 140, name: 'Kabuto', type: 'Rock', evolutionChain: [140, 141] },
  { id: 142, name: 'Aerodactyl', type: 'Rock', evolutionChain: [142] },
  { id: 143, name: 'Snorlax', type: 'Normal', evolutionChain: [446, 143] },
  { id: 144, name: 'Articuno', type: 'Ice', evolutionChain: [144] },
  { id: 145, name: 'Zapdos', type: 'Electric', evolutionChain: [145] },
  { id: 146, name: 'Moltres', type: 'Fire', evolutionChain: [146] },
  { id: 147, name: 'Dratini', type: 'Dragon', evolutionChain: [147, 148, 149] },
  { id: 150, name: 'Mewtwo', type: 'Psychic', evolutionChain: [150] },
  { id: 151, name: 'Mew', type: 'Psychic', evolutionChain: [151] }
];

// Function to fetch sprite as Base64
async function fetchSpriteAsBase64(pokemonId, type = 'front') {
  try {
    // Use the correct PokeAPI sprite URLs
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    const response = await fetch(spriteUrl);
    
    if (!response.ok) {
      console.log(`⚠️  Failed to fetch sprite for Pokemon ${pokemonId}`);
      return null;
    }
    
    const buffer = await response.buffer();
    return buffer.toString('base64');
  } catch (error) {
    console.log(`❌ Error fetching sprite for Pokemon ${pokemonId}:`, error.message);
    return null;
  }
}

// Function to fetch animated GIF
async function fetchGifAsBase64(pokemonId) {
  try {
    const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;
    const response = await fetch(gifUrl);
    
    if (!response.ok) {
      console.log(`⚠️  Failed to fetch GIF for Pokemon ${pokemonId}`);
      return null;
    }
    
    const buffer = await response.buffer();
    return buffer.toString('base64');
  } catch (error) {
    console.log(`❌ Error fetching GIF for Pokemon ${pokemonId}:`, error.message);
    return null;
  }
}

// Function to populate Pokemon pets
async function populatePokemonPets() {
  console.log('🐾 Populating Pokemon pets...');
  
  for (const pokemon of pokemonData) {
    try {
      // Fetch sprites for all evolution stages
      const stage1Sprite = await fetchSpriteAsBase64(pokemon.evolutionChain[0]);
      const stage2Sprite = pokemon.evolutionChain[1] ? await fetchSpriteAsBase64(pokemon.evolutionChain[1]) : null;
      const stage3Sprite = pokemon.evolutionChain[2] ? await fetchSpriteAsBase64(pokemon.evolutionChain[2]) : null;
      
      if (!stage1Sprite) {
        console.log(`⚠️  Skipping ${pokemon.name} - no sprite available`);
        continue;
      }
      
      // Create or update Pokemon pet
      await prisma.pokemonPet.upsert({
        where: { petId: pokemon.id },
        update: {
          name: pokemon.name,
          spriteStage1: stage1Sprite,
          spriteStage2: stage2Sprite || stage1Sprite,
          spriteStage3: stage3Sprite || stage2Sprite || stage1Sprite,
          type: pokemon.type,
          description: `A ${pokemon.type.toLowerCase()} type Pokemon.`,
          evolutionLevels: {
            stage2: pokemon.evolutionChain[1] ? 16 : null,
            stage3: pokemon.evolutionChain[2] ? 32 : null
          }
        },
        create: {
          petId: pokemon.id,
          name: pokemon.name,
          spriteStage1: stage1Sprite,
          spriteStage2: stage2Sprite || stage1Sprite,
          spriteStage3: stage3Sprite || stage2Sprite || stage1Sprite,
          type: pokemon.type,
          description: `A ${pokemon.type.toLowerCase()} type Pokemon.`,
          evolutionLevels: {
            stage2: pokemon.evolutionChain[1] ? 16 : null,
            stage3: pokemon.evolutionChain[2] ? 32 : null
          }
        }
      });
      
      console.log(`✅ Added/Updated ${pokemon.name} (ID: ${pokemon.id})`);
      
      // Add to catchable Pokemon
      await prisma.catchable_pokemon.upsert({
        where: { id: pokemon.id },
        update: {
          name: pokemon.name,
          sprite: stage1Sprite,
          type: pokemon.type,
          rarity: Math.random() < 0.1 ? 'legendary' : Math.random() < 0.3 ? 'rare' : 'common'
        },
        create: {
          id: pokemon.id,
          name: pokemon.name,
          sprite: stage1Sprite,
          type: pokemon.type,
          rarity: Math.random() < 0.1 ? 'legendary' : Math.random() < 0.3 ? 'rare' : 'common'
        }
      });
      
      // Add GIF if available
      const gifData = await fetchGifAsBase64(pokemon.id);
      if (gifData) {
        await prisma.pokemonGif.upsert({
          where: { pokemonId: pokemon.id },
          update: {
            name: pokemon.name,
            gifData: gifData
          },
          create: {
            pokemonId: pokemon.id,
            name: pokemon.name,
            gifData: gifData
          }
        });
        console.log(`🎬 Added GIF for ${pokemon.name}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${pokemon.name}:`, error.message);
    }
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting Pokemon sprite population...');
    
    // Clear existing data
    console.log('🧹 Clearing existing Pokemon data...');
    await prisma.pokemonGif.deleteMany();
    await prisma.catchable_pokemon.deleteMany();
    await prisma.pokemonPet.deleteMany();
    
    // Populate with real sprites
    await populatePokemonPets();
    
    // Verify results
    const petCount = await prisma.pokemonPet.count();
    const catchableCount = await prisma.catchable_pokemon.count();
    const gifCount = await prisma.pokemonGif.count();
    
    console.log('\n📊 Population Results:');
    console.log(`   Pokemon Pets: ${petCount}`);
    console.log(`   Catchable Pokemon: ${catchableCount}`);
    console.log(`   Pokemon GIFs: ${gifCount}`);
    
    console.log('\n✅ Pokemon sprite population completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during population:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
