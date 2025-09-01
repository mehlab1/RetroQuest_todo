import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Pokemon evolution chains data
const evolutionChains = {
  // Bulbasaur line
  1: { name: 'Bulbasaur', evolvesTo: 2, evolutionLevel: 16 },
  2: { name: 'Ivysaur', evolvesTo: 3, evolutionLevel: 32 },
  3: { name: 'Venusaur', evolvesTo: null, evolutionLevel: null },
  
  // Charmander line
  4: { name: 'Charmander', evolvesTo: 5, evolutionLevel: 16 },
  5: { name: 'Charmeleon', evolvesTo: 6, evolutionLevel: 36 },
  6: { name: 'Charizard', evolvesTo: null, evolutionLevel: null },
  
  // Squirtle line
  7: { name: 'Squirtle', evolvesTo: 8, evolutionLevel: 16 },
  8: { name: 'Wartortle', evolvesTo: 9, evolutionLevel: 36 },
  9: { name: 'Blastoise', evolvesTo: null, evolutionLevel: null },
  
  // Pikachu line
  25: { name: 'Pikachu', evolvesTo: 26, evolutionLevel: 20 },
  26: { name: 'Raichu', evolvesTo: null, evolutionLevel: null },
  
  // Eevee lines
  133: { name: 'Eevee', evolvesTo: 134, evolutionLevel: 20 }, // Vaporeon
  134: { name: 'Vaporeon', evolvesTo: null, evolutionLevel: null },
  135: { name: 'Jolteon', evolvesTo: null, evolutionLevel: null },
  136: { name: 'Flareon', evolvesTo: null, evolutionLevel: null },
  
  // Dratini line
  147: { name: 'Dratini', evolvesTo: 148, evolutionLevel: 30 },
  148: { name: 'Dragonair', evolvesTo: 149, evolutionLevel: 55 },
  149: { name: 'Dragonite', evolvesTo: null, evolutionLevel: null },
  
  // Chikorita line
  152: { name: 'Chikorita', evolvesTo: 153, evolutionLevel: 16 },
  153: { name: 'Bayleef', evolvesTo: 154, evolutionLevel: 32 },
  154: { name: 'Meganium', evolvesTo: null, evolutionLevel: null },
  
  // Cyndaquil line
  155: { name: 'Cyndaquil', evolvesTo: 156, evolutionLevel: 14 },
  156: { name: 'Quilava', evolvesTo: 157, evolutionLevel: 36 },
  157: { name: 'Typhlosion', evolvesTo: null, evolutionLevel: null },
  
  // Totodile line
  158: { name: 'Totodile', evolvesTo: 159, evolutionLevel: 18 },
  159: { name: 'Croconaw', evolvesTo: 160, evolutionLevel: 30 },
  160: { name: 'Feraligatr', evolvesTo: null, evolutionLevel: null },
  
  // Treecko line
  252: { name: 'Treecko', evolvesTo: 253, evolutionLevel: 16 },
  253: { name: 'Grovyle', evolvesTo: 254, evolutionLevel: 36 },
  254: { name: 'Sceptile', evolvesTo: null, evolutionLevel: null },
  
  // Torchic line
  255: { name: 'Torchic', evolvesTo: 256, evolutionLevel: 16 },
  256: { name: 'Combusken', evolvesTo: 257, evolutionLevel: 36 },
  257: { name: 'Blaziken', evolvesTo: null, evolutionLevel: null },
  
  // Mudkip line
  258: { name: 'Mudkip', evolvesTo: 259, evolutionLevel: 16 },
  259: { name: 'Marshtomp', evolvesTo: 260, evolutionLevel: 36 },
  260: { name: 'Swampert', evolvesTo: null, evolutionLevel: null },
  
  // Ralts line
  280: { name: 'Ralts', evolvesTo: 281, evolutionLevel: 20 },
  281: { name: 'Kirlia', evolvesTo: 282, evolutionLevel: 30 },
  282: { name: 'Gardevoir', evolvesTo: null, evolutionLevel: null },
  
  // Bagon line
  371: { name: 'Bagon', evolvesTo: 372, evolutionLevel: 30 },
  372: { name: 'Shelgon', evolvesTo: 373, evolutionLevel: 50 },
  373: { name: 'Salamence', evolvesTo: null, evolutionLevel: null },
  
  // Beldum line
  374: { name: 'Beldum', evolvesTo: 375, evolutionLevel: 20 },
  375: { name: 'Metang', evolvesTo: 376, evolutionLevel: 45 },
  376: { name: 'Metagross', evolvesTo: null, evolutionLevel: null },
  
  // Gible line
  443: { name: 'Gible', evolvesTo: 444, evolutionLevel: 24 },
  444: { name: 'Gabite', evolvesTo: 445, evolutionLevel: 48 },
  445: { name: 'Garchomp', evolvesTo: null, evolutionLevel: null },
  
  // Riolu line
  447: { name: 'Riolu', evolvesTo: 448, evolutionLevel: 20 },
  448: { name: 'Lucario', evolvesTo: null, evolutionLevel: null },
  
  // Snivy line
  495: { name: 'Snivy', evolvesTo: 496, evolutionLevel: 17 },
  496: { name: 'Servine', evolvesTo: 497, evolutionLevel: 36 },
  497: { name: 'Serperior', evolvesTo: null, evolutionLevel: null },
  
  // Tepig line
  498: { name: 'Tepig', evolvesTo: 499, evolutionLevel: 17 },
  499: { name: 'Pignite', evolvesTo: 500, evolutionLevel: 36 },
  500: { name: 'Emboar', evolvesTo: null, evolutionLevel: null },
  
  // Oshawott line
  501: { name: 'Oshawott', evolvesTo: 502, evolutionLevel: 17 },
  502: { name: 'Dewott', evolvesTo: 503, evolutionLevel: 36 },
  503: { name: 'Samurott', evolvesTo: null, evolutionLevel: null },
  
  // Axew line
  610: { name: 'Axew', evolvesTo: 611, evolutionLevel: 38 },
  611: { name: 'Fraxure', evolvesTo: 612, evolutionLevel: 48 },
  612: { name: 'Haxorus', evolvesTo: null, evolutionLevel: null },
  
  // Deino line
  633: { name: 'Deino', evolvesTo: 634, evolutionLevel: 50 },
  634: { name: 'Zweilous', evolvesTo: 635, evolutionLevel: 64 },
  635: { name: 'Hydreigon', evolvesTo: null, evolutionLevel: null },
  
  // Larvesta line
  636: { name: 'Larvesta', evolvesTo: 637, evolutionLevel: 59 },
  637: { name: 'Volcarona', evolvesTo: null, evolutionLevel: null },
  
  // Chespin line
  650: { name: 'Chespin', evolvesTo: 651, evolutionLevel: 16 },
  651: { name: 'Quilladin', evolvesTo: 652, evolutionLevel: 36 },
  652: { name: 'Chesnaught', evolvesTo: null, evolutionLevel: null },
  
  // Fennekin line
  653: { name: 'Fennekin', evolvesTo: 654, evolutionLevel: 16 },
  654: { name: 'Braixen', evolvesTo: 655, evolutionLevel: 36 },
  655: { name: 'Delphox', evolvesTo: null, evolutionLevel: null },
  
  // Froakie line
  656: { name: 'Froakie', evolvesTo: 657, evolutionLevel: 16 },
  657: { name: 'Frogadier', evolvesTo: 658, evolutionLevel: 36 },
  658: { name: 'Greninja', evolvesTo: null, evolutionLevel: null },
  
  // Fletchling line
  661: { name: 'Fletchling', evolvesTo: 662, evolutionLevel: 17 },
  662: { name: 'Fletchinder', evolvesTo: 663, evolutionLevel: 35 },
  663: { name: 'Talonflame', evolvesTo: null, evolutionLevel: null },
  
  // Litleo line
  667: { name: 'Litleo', evolvesTo: 668, evolutionLevel: 35 },
  668: { name: 'Pyroar', evolvesTo: null, evolutionLevel: null },
  
  // Flabébé line
  669: { name: 'Flabébé', evolvesTo: 670, evolutionLevel: 19 },
  670: { name: 'Floette', evolvesTo: 671, evolutionLevel: 20 },
  671: { name: 'Florges', evolvesTo: null, evolutionLevel: null },
  
  // Skiddo line
  672: { name: 'Skiddo', evolvesTo: 673, evolutionLevel: 32 },
  673: { name: 'Gogoat', evolvesTo: null, evolutionLevel: null },
  
  // Pancham line
  674: { name: 'Pancham', evolvesTo: 675, evolutionLevel: 32 },
  675: { name: 'Pangoro', evolvesTo: null, evolutionLevel: null },
  
  // Espurr line
  677: { name: 'Espurr', evolvesTo: 678, evolutionLevel: 25 },
  678: { name: 'Meowstic', evolvesTo: null, evolutionLevel: null },
  
  // Honedge line
  679: { name: 'Honedge', evolvesTo: 680, evolutionLevel: 35 },
  680: { name: 'Doublade', evolvesTo: 681, evolutionLevel: 50 },
  681: { name: 'Aegislash', evolvesTo: null, evolutionLevel: null },
  
  // Spritzee line
  682: { name: 'Spritzee', evolvesTo: 683, evolutionLevel: 20 },
  683: { name: 'Aromatisse', evolvesTo: null, evolutionLevel: null },
  
  // Swirlix line
  684: { name: 'Swirlix', evolvesTo: 685, evolutionLevel: 20 },
  685: { name: 'Slurpuff', evolvesTo: null, evolutionLevel: null },
  
  // Inkay line
  686: { name: 'Inkay', evolvesTo: 687, evolutionLevel: 30 },
  687: { name: 'Malamar', evolvesTo: null, evolutionLevel: null },
  
  // Binacle line
  688: { name: 'Binacle', evolvesTo: 689, evolutionLevel: 39 },
  689: { name: 'Barbaracle', evolvesTo: null, evolutionLevel: null },
  
  // Skrelp line
  690: { name: 'Skrelp', evolvesTo: 691, evolutionLevel: 48 },
  691: { name: 'Dragalge', evolvesTo: null, evolutionLevel: null },
  
  // Clauncher line
  692: { name: 'Clauncher', evolvesTo: 693, evolutionLevel: 37 },
  693: { name: 'Clawitzer', evolvesTo: null, evolutionLevel: null },
  
  // Helioptile line
  694: { name: 'Helioptile', evolvesTo: 695, evolutionLevel: 20 },
  695: { name: 'Heliolisk', evolvesTo: null, evolutionLevel: null },
  
  // Tyrunt line
  696: { name: 'Tyrunt', evolvesTo: 697, evolutionLevel: 39 },
  697: { name: 'Tyrantrum', evolvesTo: null, evolutionLevel: null },
  
  // Amaura line
  698: { name: 'Amaura', evolvesTo: 699, evolutionLevel: 39 },
  699: { name: 'Aurorus', evolvesTo: null, evolutionLevel: null },
  
  // Hawlucha
  701: { name: 'Hawlucha', evolvesTo: null, evolutionLevel: null },
  
  // Dedenne
  702: { name: 'Dedenne', evolvesTo: null, evolutionLevel: null },
  
  // Carbink
  703: { name: 'Carbink', evolvesTo: null, evolutionLevel: null },
  
  // Goomy line
  704: { name: 'Goomy', evolvesTo: 705, evolutionLevel: 40 },
  705: { name: 'Sliggoo', evolvesTo: 706, evolutionLevel: 50 },
  706: { name: 'Goodra', evolvesTo: null, evolutionLevel: null },
  
  // Klefki
  707: { name: 'Klefki', evolvesTo: null, evolutionLevel: null },
  
  // Phantump line
  708: { name: 'Phantump', evolvesTo: 709, evolutionLevel: 20 },
  709: { name: 'Trevenant', evolvesTo: null, evolutionLevel: null },
  
  // Pumpkaboo line
  710: { name: 'Pumpkaboo', evolvesTo: 711, evolutionLevel: 20 },
  711: { name: 'Gourgeist', evolvesTo: null, evolutionLevel: null },
  
  // Bergmite line
  712: { name: 'Bergmite', evolvesTo: 713, evolutionLevel: 37 },
  713: { name: 'Avalugg', evolvesTo: null, evolutionLevel: null },
  
  // Noibat line
  714: { name: 'Noibat', evolvesTo: 715, evolutionLevel: 48 },
  715: { name: 'Noivern', evolvesTo: null, evolutionLevel: null },
  
  // Xerneas
  716: { name: 'Xerneas', evolvesTo: null, evolutionLevel: null },
  
  // Yveltal
  717: { name: 'Yveltal', evolvesTo: null, evolutionLevel: null },
  
  // Zygarde
  718: { name: 'Zygarde', evolvesTo: null, evolutionLevel: null },
  
  // Diancie
  719: { name: 'Diancie', evolvesTo: null, evolutionLevel: null },
  
  // Hoopa
  720: { name: 'Hoopa', evolvesTo: null, evolutionLevel: null },
  
  // Volcanion
  721: { name: 'Volcanion', evolvesTo: null, evolutionLevel: null }
};

// Pokemon types and descriptions
const pokemonData = {
  1: { type: 'Grass', description: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.' },
  4: { type: 'Fire', description: 'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.' },
  7: { type: 'Water', description: 'After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.' },
  25: { type: 'Electric', description: 'When several of these Pokémon gather, their electricity can cause lightning storms.' },
  133: { type: 'Normal', description: 'Its genetic code is irregular. It may mutate if it is exposed to radiation from element stones.' },
  147: { type: 'Dragon', description: 'Long considered a mythical Pokémon until recently when a small colony was found living underwater.' },
  152: { type: 'Grass', description: 'A sweet aroma gently wafts from the leaf on its head. It is docile and loves to sunbathe.' },
  155: { type: 'Fire', description: 'It is timid, and always curls itself up in a ball. If attacked, it flares up its back for protection.' },
  158: { type: 'Water', description: 'This rough critter chomps at any moving object it sees. Turning your back on it is not recommended.' },
  252: { type: 'Grass', description: 'Treecko has large eyes with dark pupils. It has thin limbs and a long tail.' },
  255: { type: 'Fire', description: 'Torchic has a flame sac inside its belly that is filled with some kind of fire energy.' },
  258: { type: 'Water', description: 'The fin on Mudkip\'s head acts as highly sensitive radar. Using this fin makes it capable of sensing things it cannot see.' },
  280: { type: 'Psychic', description: 'Ralts senses the emotions of people using the horns on its head. This Pokémon rarely appears before people.' },
  371: { type: 'Dragon', description: 'Bagon has a dream of one day soaring in the sky. In doomed efforts to fly, this Pokémon hurls itself off cliffs.' },
  374: { type: 'Steel', description: 'Beldum keeps itself floating by generating a magnetic force that repels earth\'s natural magnetic field.' },
  443: { type: 'Dragon', description: 'It lives in caves and is active at night. It uses its sharp claws to dig for food.' },
  447: { type: 'Fighting', description: 'Riolu has the power to see the emotions of others. It does not open its heart to just anyone.' },
  495: { type: 'Grass', description: 'Snivy has a calm and collected personality. It is very intelligent and docile.' },
  498: { type: 'Fire', description: 'Tepig is a Fire type Pokémon introduced in Generation V. It evolves into Pignite starting at level 17.' },
  501: { type: 'Water', description: 'Oshawott is a Water type Pokémon introduced in Generation V. It evolves into Dewott starting at level 17.' },
  610: { type: 'Dragon', description: 'They use their tusks to crush berries. They are very strong despite their small size.' },
  633: { type: 'Dark', description: 'It tends to bite everything, and it is not a picky eater. Approaching it carelessly is dangerous.' },
  636: { type: 'Bug', description: 'This Pokémon was believed to have been born from the sun. When it evolves, its entire body is engulfed in flames.' },
  650: { type: 'Grass', description: 'The quills on its head are usually soft. When it flexes them, the points become so hard and sharp that they can pierce rock.' },
  653: { type: 'Fire', description: 'Eating a twig fills it with energy, and its roomy ears give vent to air hotter than 390 degrees Fahrenheit.' },
  656: { type: 'Water', description: 'It secretes flexible bubbles from its chest and back. The bubbles reduce the damage it would otherwise take when attacked.' },
  661: { type: 'Normal', description: 'These friendly Pokémon send signals to one another with beautiful chirps and tail-feather movements.' },
  667: { type: 'Fire', description: 'The stronger the opponent it faces, the more heat surges from its mane and the more power flows through its body.' },
  669: { type: 'Fairy', description: 'It draws out and controls the hidden power of flowers. The flower Flabébé holds is most likely part of its body.' },
  672: { type: 'Grass', description: 'Thought to be one of the first Pokémon to live in harmony with humans, it has a placid disposition.' },
  674: { type: 'Fighting', description: 'It does its best to be taken seriously by its enemies, but its glare is not sufficiently intimidating.' },
  677: { type: 'Psychic', description: 'The organ that emits its intense psychic power is sheltered by its ears to keep power from leaking out.' },
  679: { type: 'Steel', description: 'Apparently this Pokémon is born when a departed spirit inhabits a sword. It attaches itself to people and drinks their life force.' },
  682: { type: 'Fairy', description: 'It emits a sweet fragrance that calms the mind. Spritzee won\'t move until its Trainer gives it an order.' },
  684: { type: 'Fairy', description: 'It can distinguish the faintest of scents. It puts its sensitive sense of smell to use by helping pastry chefs in their work.' },
  686: { type: 'Dark', description: 'It lures its prey close with hypnotic motions, then wraps its tentacles around it before finishing it off.' },
  688: { type: 'Rock', description: 'Two Binacle live together on one rock. When they fight, one of them will move to a different rock.' },
  690: { type: 'Poison', description: 'It drifts in shallow water where people swim. It stealthily shoots its poisonous spikes at prey.' },
  692: { type: 'Water', description: 'It takes aim at its prey\'s weak point and fires a concentrated blast of water. It has enough power to punch a hole through thick steel.' },
  694: { type: 'Electric', description: 'They make their home in deserts. They can generate their energy from basking in the sun instead of eating food.' },
  696: { type: 'Rock', description: 'This Pokémon was restored from a fossil. If something happens that it doesn\'t like, it throws a tantrum and runs wild.' },
  698: { type: 'Rock', description: 'This ancient Pokémon was restored from part of its body that had been frozen in ice for over 100 million years.' },
  701: { type: 'Fighting', description: 'It always strikes a pose before going for its signature attack. Sometimes opponents take advantage of that time to counterattack.' },
  702: { type: 'Electric', description: 'It uses its tail to absorb electricity from utility poles, then fires the electricity from its whiskers.' },
  703: { type: 'Rock', description: 'Born from temperatures and pressures deep underground, it fires beams from the stone in its head.' },
  704: { type: 'Dragon', description: 'The weakest Dragon-type Pokémon, it lives in damp, shady places, so its body doesn\'t dry out.' },
  707: { type: 'Steel', description: 'These key collectors threaten any attackers by fiercely jingling their keys at them.' },
  708: { type: 'Ghost', description: 'According to old tales, these Pokémon are stumps possessed by the spirits of children who died while lost in forests.' },
  710: { type: 'Ghost', description: 'The pumpkin body is inhabited by a spirit trapped in this world. As the sun sets, it becomes restless and active.' },
  712: { type: 'Ice', description: 'It blocks opponents\' attacks with the ice that shields its body. It uses cold air to repair any cracks that form in the ice.' },
  714: { type: 'Flying', description: 'They live in pitch-black caves. Their enormous ears can emit ultrasonic waves of 200,000 hertz.' },
  716: { type: 'Fairy', description: 'Legends say it can share eternal life. It slept for a thousand years in the form of a tree before its revival.' },
  717: { type: 'Dark', description: 'When this legendary Pokémon\'s wings and tail feathers spread wide and glow red, it absorbs the life force of living creatures.' },
  718: { type: 'Dragon', description: 'This is Zygarde\'s form when about half of its pieces have been assembled. It plays the role of monitoring the ecosystem.' },
  719: { type: 'Rock', description: 'A sudden transformation of Carbink, its pink, glimmering body is said to be the loveliest sight in the whole world.' },
  720: { type: 'Psychic', description: 'This troublemaker sends anything and everything to faraway places using its loop, which can warp space.' },
  721: { type: 'Fire', description: 'It expels its internal steam from the arms on its back. It has enough power to blow away a mountain.' }
};

// Rarity distribution
const rarityDistribution = {
  common: 0.4,      // 40% chance
  uncommon: 0.3,    // 30% chance
  rare: 0.2,        // 20% chance
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

async function populatePokemonDatabase() {
  try {
    console.log('🚀 Starting Pokemon database population...\n');

    // Clear existing data
    console.log('🧹 Clearing existing Pokemon data...');
    await prisma.pokemonGif.deleteMany();
    await prisma.userCaughtPokemon.deleteMany();
    await prisma.catchable_pokemon.deleteMany();
    await prisma.pokemonPet.deleteMany();
    console.log('✅ Existing data cleared\n');

    const pokemonIds = Object.keys(evolutionChains).map(Number).sort((a, b) => a - b);
    let petCount = 0;
    let catchableCount = 0;
    let gifCount = 0;

    console.log(`📝 Processing ${pokemonIds.length} Pokemon...\n`);

    for (const pokemonId of pokemonIds) {
      const pokemon = evolutionChains[pokemonId];
      const data = pokemonData[pokemonId];
      
      if (!pokemon || !data) {
        console.log(`⚠️  Skipping Pokemon ID ${pokemonId} - missing data`);
        continue;
      }

      console.log(`🔄 Processing ${pokemon.name} (ID: ${pokemonId})...`);

      // Fetch sprites from PokeAPI sprites repository
      const spriteUrls = {
        // Pixelated sprites for different stages
        stage1: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${pokemonId}.png`,
        stage2: pokemon.evolvesTo ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${pokemon.evolvesTo}.png` : null,
        stage3: pokemon.evolvesTo && evolutionChains[pokemon.evolvesTo]?.evolvesTo ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${evolutionChains[pokemon.evolvesTo].evolvesTo}.png` : null,
        // GIF for animated version
        gif: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`
      };

      // Fetch sprites
      const [stage1Sprite, stage2Sprite, stage3Sprite, gifData] = await Promise.all([
        fetchSpriteAsBase64(spriteUrls.stage1),
        spriteUrls.stage2 ? fetchSpriteAsBase64(spriteUrls.stage2) : null,
        spriteUrls.stage3 ? fetchSpriteAsBase64(spriteUrls.stage3) : null,
        fetchSpriteAsBase64(spriteUrls.gif)
      ]);

      if (!stage1Sprite) {
        console.log(`❌ Failed to fetch sprite for ${pokemon.name}, skipping...`);
        continue;
      }

      // Create PokemonPet (for companion system)
      const rarity = getRandomRarity();
      const evolutionLevels = {
        stage2: pokemon.evolutionLevel || 16,
        stage3: pokemon.evolvesTo && evolutionChains[pokemon.evolvesTo]?.evolutionLevel ? evolutionChains[pokemon.evolvesTo].evolutionLevel : 32
      };

      await prisma.pokemonPet.create({
        data: {
          name: pokemon.name,
          spriteStage1: stage1Sprite,
          spriteStage2: stage2Sprite || stage1Sprite,
          spriteStage3: stage3Sprite || stage2Sprite || stage1Sprite,
          description: data.description,
          evolution_levels: evolutionLevels,
          type: data.type
        }
      });
      petCount++;

      // Create catchable Pokemon
      const difficulty = getDifficultyByRarity(rarity);
      const pointsReward = getPointsRewardByRarity(rarity);

      await prisma.catchable_pokemon.create({
        data: {
          pokemon_id: pokemonId,
          name: pokemon.name,
          sprite: stage1Sprite,
          type: data.type,
          rarity: rarity,
          difficulty: difficulty,
          description: data.description,
          catch_requirement: `Complete ${difficulty} tasks`,
          points_reward: pointsReward
        }
      });
      catchableCount++;

      // Create GIF entry if available
      if (gifData) {
        await prisma.pokemonGif.create({
          data: {
            pokemonId: pokemonId,
            name: pokemon.name,
            gifData: gifData
          }
        });
        gifCount++;
      }

      console.log(`✅ ${pokemon.name} processed successfully`);
      
      // Add small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🎉 Pokemon database population completed!');
    console.log(`📊 Summary:`);
    console.log(`  - Pokemon Pets: ${petCount}`);
    console.log(`  - Catchable Pokemon: ${catchableCount}`);
    console.log(`  - Pokemon GIFs: ${gifCount}`);
    console.log(`  - Total Pokemon processed: ${pokemonIds.length}`);

  } catch (error) {
    console.error('❌ Error populating Pokemon database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populatePokemonDatabase();
