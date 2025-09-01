import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Additional Pokemon data to reach target numbers
const additionalPokemon = {
  // Popular Pokemon from different generations
  6: { name: 'Charizard', type: 'Fire', description: 'It spits fire that is hot enough to melt boulders. It may cause forest fires by blowing flames.' },
  9: { name: 'Blastoise', type: 'Water', description: 'It crushes its foe under its heavy body to cause fainting. In a pinch, it will withdraw inside its shell.' },
  26: { name: 'Raichu', type: 'Electric', description: 'Its long tail serves as a ground to protect itself from its own high-voltage power.' },
  59: { name: 'Arcanine', type: 'Fire', description: 'A Pokémon that has been admired since the past for its beauty. It runs agilely as if on wings.' },
  65: { name: 'Alakazam', type: 'Psychic', description: 'Its brain can outperform a supercomputer. Its intelligence quotient is said to be 5,000.' },
  89: { name: 'Muk', type: 'Poison', description: 'Thickly covered with a filthy, vile sludge. It is so toxic, even its footprints contain poison.' },
  94: { name: 'Gengar', type: 'Ghost', description: 'On the night of a full moon, if shadows move on their own and laugh, it must be Gengar\'s doing.' },
  103: { name: 'Exeggutor', type: 'Grass', description: 'Legend has it that on rare occasions, one of its heads will drop off and continue on as an Exeggcute.' },
  130: { name: 'Gyarados', type: 'Water', description: 'Rarely seen in the wild. Huge and vicious, it is capable of destroying entire cities in a rage.' },
  131: { name: 'Lapras', type: 'Water', description: 'A Pokémon that has been overhunted almost to extinction. It can ferry people across the water.' },
  134: { name: 'Vaporeon', type: 'Water', description: 'Lives close to water. Its long tail is ridged with a fin which is often mistaken for a mermaid\'s.' },
  135: { name: 'Jolteon', type: 'Electric', description: 'It accumulates negative ions in the atmosphere to blast out 10,000-volt lightning bolts.' },
  136: { name: 'Flareon', type: 'Fire', description: 'When storing thermal energy in its body, its temperature could soar to over 1,600 degrees.' },
  149: { name: 'Dragonite', type: 'Dragon', description: 'It is said to make its home somewhere in the sea. It guides crews of shipwrecks to shore.' },
  150: { name: 'Mewtwo', type: 'Psychic', description: 'Its DNA is almost the same as Mew\'s. However, its size and disposition are vastly different.' },
  151: { name: 'Mew', type: 'Psychic', description: 'So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide.' },
  154: { name: 'Meganium', type: 'Grass', description: 'The aroma that rises from its petals contains a substance that calms aggressive feelings.' },
  157: { name: 'Typhlosion', type: 'Fire', description: 'If its rage peaks, it becomes so hot that anything that touches it will instantly go up in flames.' },
  160: { name: 'Feraligatr', type: 'Water', description: 'When it bites with its massive and powerful jaws, it shakes its head and savagely tears its victim up.' },
  169: { name: 'Crobat', type: 'Poison', description: 'Having four wings enables it to fly faster and more quietly. It turns active when the night comes.' },
  181: { name: 'Ampharos', type: 'Electric', description: 'The tip of its tail shines brightly and can be seen from far away. It acts as a beacon for lost people.' },
  196: { name: 'Espeon', type: 'Psychic', description: 'It uses the fine hair that covers its body to sense air currents and predict its enemy\'s actions.' },
  197: { name: 'Umbreon', type: 'Dark', description: 'When agitated, this Pokémon protects itself by spraying poisonous sweat from its pores.' },
  212: { name: 'Scizor', type: 'Bug', description: 'It swings its eye-patterned pincers up to scare its foes. This makes it look like it has three heads.' },
  229: { name: 'Houndoom', type: 'Dark', description: 'If you are burned by the flames it shoots from its mouth, the pain will never go away.' },
  230: { name: 'Kingdra', type: 'Water', description: 'It is said to live at the bottom of the ocean. It will create giant whirlpools when it swims.' },
  248: { name: 'Tyranitar', type: 'Rock', description: 'Its body can\'t be harmed by any sort of attack, so it is very eager to make challenges against enemies.' },
  249: { name: 'Lugia', type: 'Psychic', description: 'It is said to be the guardian of the seas. It is rumored to have been seen on the night of a storm.' },
  250: { name: 'Ho-Oh', type: 'Fire', description: 'Legends claim this Pokémon flies the world\'s skies continuously on its magnificent seven-colored wings.' },
  254: { name: 'Sceptile', type: 'Grass', description: 'The leaves that grow on its arms can slice down thick trees. It is without peer in jungle combat.' },
  257: { name: 'Blaziken', type: 'Fire', description: 'In battle, it blows out intense flames from its wrists and attacks foes courageously.' },
  260: { name: 'Swampert', type: 'Water', description: 'It can swim while towing a large ship. It bashes down foes with a swing of its thick arms.' },
  282: { name: 'Gardevoir', type: 'Psychic', description: 'To protect its Trainer, it will expend all its psychic power to create a small black hole.' },
  289: { name: 'Slaking', type: 'Normal', description: 'It is the world\'s most slothful Pokémon. However, it can exert horrifying power by releasing pent-up energy.' },
  306: { name: 'Aggron', type: 'Steel', description: 'While seeking iron for food, it digs tunnels by breaking through bedrock with its steel horns.' },
  350: { name: 'Milotic', type: 'Water', description: 'It is said to be the most beautiful of all the Pokémon. It has the ability to calm the emotions of people.' },
  373: { name: 'Salamence', type: 'Dragon', description: 'After many long years, its cellular structure underwent a sudden mutation to grow wings.' },
  376: { name: 'Metagross', type: 'Steel', description: 'Metagross has four brains in total. Combined, the four brains can breeze through difficult calculations faster than a supercomputer.' },
  380: { name: 'Latias', type: 'Dragon', description: 'Latias is highly sensitive to the emotions of people. If it senses any hostility, this Pokémon ruffles the feathers all over its body and cries shrilly to intimidate the foe.' },
  381: { name: 'Latios', type: 'Dragon', description: 'Latios has the ability to make its foe see an image of what Latios has seen or imagines in its head. This Pokémon is intelligent and understands human speech.' },
  384: { name: 'Rayquaza', type: 'Dragon', description: 'Rayquaza is said to have lived for hundreds of millions of years. Legends remain of how it put to rest the clash between Kyogre and Groudon.' },
  445: { name: 'Garchomp', type: 'Dragon', description: 'When it folds up its body and extends its wings, it looks like a jet plane. It flies at sonic speed.' },
  448: { name: 'Lucario', type: 'Fighting', description: 'It has the ability to sense the emotions of people. It hides away if it senses hostility.' },
  460: { name: 'Abomasnow', type: 'Grass', description: 'It whips up blizzards in mountains that are always buried in snow. It is the abominable snowman.' },
  467: { name: 'Magmortar', type: 'Fire', description: 'It blasts fireballs of over 3,600 degrees F from the ends of its arms. It lives in volcanic craters.' },
  468: { name: 'Togekiss', type: 'Fairy', description: 'It shares many blessings with people who respect one another\'s rights and avoid needless strife.' },
  477: { name: 'Dusknoir', type: 'Ghost', description: 'The antenna on its head captures radio waves from the world of spirits that command it to take people there.' },
  483: { name: 'Dialga', type: 'Steel', description: 'A Pokémon spoken of in legend. It is said that time began moving when Dialga was born.' },
  484: { name: 'Palkia', type: 'Water', description: 'A Pokémon spoken of in legend. It is said that space became more stable with Palkia\'s birth.' },
  487: { name: 'Giratina', type: 'Ghost', description: 'It was banished for its violence. It silently gazed upon the old world from the Distortion World.' },
  493: { name: 'Arceus', type: 'Normal', description: 'It is described in mythology as the Pokémon that shaped the universe with its 1,000 arms.' },
  497: { name: 'Serperior', type: 'Grass', description: 'It can stop its opponents\' movements with just a glare. It takes in solar energy and boosts it internally.' },
  500: { name: 'Emboar', type: 'Fire', description: 'It can throw a fire punch by setting its fists on fire with its fiery chin. It cares deeply about its friends.' },
  503: { name: 'Samurott', type: 'Water', description: 'One swing of the sword incorporated in its armor can fell an opponent. It shields itself with its shell.' },
  612: { name: 'Haxorus', type: 'Dragon', description: 'They are kind but can be relentless when defending territory. They challenge foes with tusks that can cut steel.' },
  635: { name: 'Hydreigon', type: 'Dark', description: 'The heads on its arms do not have brains. They use all three heads to consume and destroy everything.' },
  637: { name: 'Volcarona', type: 'Bug', description: 'When volcanic ash darkened the atmosphere, it is said that Volcarona\'s fire provided a replacement for the sun.' },
  643: { name: 'Reshiram', type: 'Dragon', description: 'This Pokémon appears in legends. It sends those who see it to a world of truth.' },
  644: { name: 'Zekrom', type: 'Dragon', description: 'This Pokémon appears in legends. It sends those who see it to a world of ideals.' },
  646: { name: 'Kyurem', type: 'Dragon', description: 'It generates a powerful, freezing energy inside itself, but its body became frozen when the energy leaked out.' },
  652: { name: 'Chesnaught', type: 'Grass', description: 'Its Tackle is destructive enough to flip a 50-ton tank. It shields its allies from danger with its own body.' },
  655: { name: 'Delphox', type: 'Fire', description: 'It gazes into the flame at the tip of its branch to achieve a focused state, which allows it to see into the future.' },
  658: { name: 'Greninja', type: 'Water', description: 'It creates throwing stars out of compressed water. When it spins them and throws them at high speed, these stars can split metal in two.' },
  663: { name: 'Talonflame', type: 'Fire', description: 'In the fever of an exciting battle, it showers embers from the gaps between its feathers and takes to the air.' },
  668: { name: 'Pyroar', type: 'Fire', description: 'The male with the largest mane of fire is the leader of the pride.' },
  671: { name: 'Florges', type: 'Fairy', description: 'It claims exquisite flower gardens as its territory. It obtains power from basking in the energy emitted by flowering plants.' },
  673: { name: 'Gogoat', type: 'Grass', description: 'It can tell how its Trainer is feeling by subtle shifts in the grip on its horns.' },
  675: { name: 'Pangoro', type: 'Fighting', description: 'It charges ahead and bashes its opponents like a berserker, uncaring about any hits it might take.' },
  678: { name: 'Meowstic', type: 'Psychic', description: 'The defensive instinct of the males is strong. It\'s when they\'re protecting themselves or their partners that they unleash their full power.' },
  681: { name: 'Aegislash', type: 'Steel', description: 'Generations of kings were attended by these Pokémon, which used their spectral power to manipulate and control people and Pokémon.' },
  683: { name: 'Aromatisse', type: 'Fairy', description: 'It devises various scents, pleasant and unpleasant, and emits scents that its enemies dislike in order to gain an edge in battle.' },
  685: { name: 'Slurpuff', type: 'Fairy', description: 'It can distinguish the faintest of scents. It puts its sensitive sense of smell to use by helping pastry chefs in their work.' },
  687: { name: 'Malamar', type: 'Dark', description: 'It lures its prey close with hypnotic motions, then wraps its tentacles around it before finishing it off.' },
  689: { name: 'Barbaracle', type: 'Rock', description: 'When they evolve, two Binacle multiply into seven. They fight with the power of seven Binacle.' },
  691: { name: 'Dragalge', type: 'Poison', description: 'Their poison is strong enough to eat through the hull of a tanker, and they spit it indiscriminately at anything that enters their territory.' },
  693: { name: 'Clawitzer', type: 'Water', description: 'It takes aim at its prey\'s weak point and fires a concentrated blast of water. It has enough power to punch a hole through thick steel.' },
  695: { name: 'Heliolisk', type: 'Electric', description: 'They make their home in deserts. They can generate their energy from basking in the sun instead of eating food.' },
  697: { name: 'Tyrantrum', type: 'Rock', description: 'Thanks to its gargantuan jaws, which could shred thick metal plates as if they were paper, it was invincible in the ancient world it once inhabited.' },
  699: { name: 'Aurorus', type: 'Rock', description: 'The diamond-shaped crystals on its body expel air as cold as -240 degrees Fahrenheit, surrounding its enemies and encasing them in ice.' },
  706: { name: 'Goodra', type: 'Dragon', description: 'This very friendly Dragon-type Pokémon will hug its beloved Trainer, leaving that Trainer covered in sticky slime.' },
  709: { name: 'Trevenant', type: 'Ghost', description: 'It can control trees at will. It will trap people who harm the forest, so they can never leave.' },
  711: { name: 'Gourgeist', type: 'Ghost', description: 'It enwraps its prey in its hairlike arms. It sings joyfully as it observes the suffering of its prey.' },
  713: { name: 'Avalugg', type: 'Ice', description: 'The way several Bergmite huddle on its back makes it look like an aircraft carrier made of ice.' },
  715: { name: 'Noivern', type: 'Flying', description: 'They live in pitch-black caves. Their enormous ears can emit ultrasonic waves of 200,000 hertz.' }
};

// Rarity distribution for additional Pokemon
const rarityDistribution = {
  common: 0.3,      // 30% chance
  uncommon: 0.35,   // 35% chance
  rare: 0.25,       // 25% chance
  legendary: 0.08,  // 8% chance
  mythical: 0.02    // 2% chance
};

function getRandomRarity() {
  const rand = Math.random();
  if (rand < rarityDistribution.common) return 'common';
  if (rand < rarityDistribution.common + rarityDistribution.uncommon) return 'uncommon';
  if (rand < rarityDistribution.common + rarityDistribution.uncommon + rarityDistribution.rare) return 'rare';
  if (rand < rarityDistribution.common + rarityDistribution.uncommon + rarityDistribution.rare + rarityDistribution.legendary) return 'legendary';
  return 'mythical';
}

function getDifficultyByRarity(rarity) {
  switch (rarity) {
    case 'common': return Math.floor(Math.random() * 3) + 1; // 1-3
    case 'uncommon': return Math.floor(Math.random() * 3) + 2; // 2-4
    case 'rare': return Math.floor(Math.random() * 3) + 4; // 4-6
    case 'legendary': return Math.floor(Math.random() * 3) + 7; // 7-9
    case 'mythical': return 10;
    default: return 1;
  }
}

function getPointsRewardByRarity(rarity) {
  switch (rarity) {
    case 'common': return Math.floor(Math.random() * 10) + 5; // 5-14
    case 'uncommon': return Math.floor(Math.random() * 15) + 15; // 15-29
    case 'rare': return Math.floor(Math.random() * 20) + 30; // 30-49
    case 'legendary': return Math.floor(Math.random() * 30) + 50; // 50-79
    case 'mythical': return Math.floor(Math.random() * 50) + 80; // 80-129
    default: return 10;
  }
}

async function fetchSpriteAsBase64(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    return buffer.toString('base64');
  } catch (error) {
    console.error(`Failed to fetch sprite from ${url}:`, error.message);
    return null;
  }
}

async function addMorePokemon() {
  try {
    console.log('🚀 Adding more Pokemon to reach target numbers...\n');

    const pokemonIds = Object.keys(additionalPokemon).map(Number).sort((a, b) => a - b);
    let petCount = 0;
    let catchableCount = 0;
    let gifCount = 0;

    console.log(`📝 Processing ${pokemonIds.length} additional Pokemon...\n`);

    for (const pokemonId of pokemonIds) {
      const pokemon = additionalPokemon[pokemonId];
      
      if (!pokemon) {
        console.log(`⚠️  Skipping Pokemon ID ${pokemonId} - missing data`);
        continue;
      }

      console.log(`🔄 Processing ${pokemon.name} (ID: ${pokemonId})...`);

      // Check if Pokemon already exists
      const existingPet = await prisma.pokemonPet.findFirst({
        where: { name: pokemon.name }
      });

      const existingCatchable = await prisma.catchable_pokemon.findFirst({
        where: { pokemon_id: pokemonId }
      });

      if (existingPet && existingCatchable) {
        console.log(`⚠️  ${pokemon.name} already exists, skipping...`);
        continue;
      }

      // Fetch sprites from PokeAPI sprites repository
      const spriteUrls = {
        // Pixelated sprites for different stages
        stage1: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${pokemonId}.png`,
        // GIF for animated version
        gif: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`
      };

      // Fetch sprites
      const [stage1Sprite, gifData] = await Promise.all([
        fetchSpriteAsBase64(spriteUrls.stage1),
        fetchSpriteAsBase64(spriteUrls.gif)
      ]);

      if (!stage1Sprite) {
        console.log(`❌ Failed to fetch sprite for ${pokemon.name}, skipping...`);
        continue;
      }

      // Create PokemonPet if it doesn't exist
      if (!existingPet) {
        const evolutionLevels = {
          stage2: 16,
          stage3: 32
        };

        await prisma.pokemonPet.create({
          data: {
            name: pokemon.name,
            spriteStage1: stage1Sprite,
            spriteStage2: stage1Sprite,
            spriteStage3: stage1Sprite,
            description: pokemon.description,
            evolution_levels: evolutionLevels,
            type: pokemon.type
          }
        });
        petCount++;
      }

      // Create catchable Pokemon if it doesn't exist
      if (!existingCatchable) {
        const rarity = getRandomRarity();
        const difficulty = getDifficultyByRarity(rarity);
        const pointsReward = getPointsRewardByRarity(rarity);

        await prisma.catchable_pokemon.create({
          data: {
            pokemon_id: pokemonId,
            name: pokemon.name,
            sprite: stage1Sprite,
            type: pokemon.type,
            rarity: rarity,
            difficulty: difficulty,
            description: pokemon.description,
            catch_requirement: `Complete ${difficulty} tasks`,
            points_reward: pointsReward
          }
        });
        catchableCount++;
      }

      // Create GIF entry if available and doesn't exist
      if (gifData) {
        const existingGif = await prisma.pokemonGif.findFirst({
          where: { pokemonId: pokemonId }
        });

        if (!existingGif) {
          await prisma.pokemonGif.create({
            data: {
              pokemonId: pokemonId,
              name: pokemon.name,
              gifData: gifData
            }
          });
          gifCount++;
        }
      }

      console.log(`✅ ${pokemon.name} processed successfully`);
      
      // Add small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🎉 Additional Pokemon added successfully!');
    console.log(`📊 Summary:`);
    console.log(`  - New Pokemon Pets: ${petCount}`);
    console.log(`  - New Catchable Pokemon: ${catchableCount}`);
    console.log(`  - New Pokemon GIFs: ${gifCount}`);

    // Get final counts
    const totalPets = await prisma.pokemonPet.count();
    const totalCatchable = await prisma.catchable_pokemon.count();
    const totalGifs = await prisma.pokemonGif.count();

    console.log(`\n📈 Final Database Counts:`);
    console.log(`  - Total Pokemon Pets: ${totalPets}`);
    console.log(`  - Total Catchable Pokemon: ${totalCatchable}`);
    console.log(`  - Total Pokemon GIFs: ${totalGifs}`);

  } catch (error) {
    console.error('❌ Error adding more Pokemon:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMorePokemon();
