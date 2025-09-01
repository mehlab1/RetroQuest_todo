import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Function to convert image URL to base64
async function imageUrlToBase64(url) {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = 'image/png';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`Error converting ${url}:`, error.message);
    return null;
  }
}

// Pokemon data for registration (PokemonPet table) - 50+ Pokemon
const pokemonPets = [
  // Gen 1 Starters
  {
    name: "Bulbasaur",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    type: "Grass/Poison",
    description: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
    evolutionLevels: { stage2: 16, stage3: 32 }
  },
  {
    name: "Charmander",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    type: "Fire",
    description: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    name: "Squirtle",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
    type: "Water",
    description: "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    name: "Pikachu",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/172.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png",
    type: "Electric",
    description: "When several of these Pokémon gather, their electricity can cause lightning storms.",
    evolutionLevels: { stage2: 10, stage3: 30 }
  },
  {
    name: "Eevee",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png",
    type: "Normal",
    description: "Its genetic code is irregular. It may mutate if it is exposed to radiation from element stones.",
    evolutionLevels: { stage2: 20, stage3: 40 }
  },
  // Gen 2 Starters
  {
    name: "Chikorita",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/152.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/153.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/154.png",
    type: "Grass",
    description: "A sweet aroma gently wafts from the leaf on its head. It is docile and loves to soak up the sun's rays.",
    evolutionLevels: { stage2: 16, stage3: 32 }
  },
  {
    name: "Cyndaquil",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/155.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/156.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/157.png",
    type: "Fire",
    description: "It is timid, and always curls itself up in a ball. If attacked, it flares up its back for protection.",
    evolutionLevels: { stage2: 14, stage3: 36 }
  },
  {
    name: "Totodile",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/158.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/159.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/160.png",
    type: "Water",
    description: "Its well-developed jaws are powerful and capable of crushing anything. Even its trainer must be careful.",
    evolutionLevels: { stage2: 18, stage3: 30 }
  },
  // Gen 3 Starters
  {
    name: "Treecko",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/252.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/253.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/254.png",
    type: "Grass",
    description: "Treecko has small hooks on the bottom of its feet that enable it to scale vertical walls.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    name: "Torchic",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/255.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/256.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/257.png",
    type: "Fire",
    description: "Torchic sticks with its Trainer, following behind with unsteady steps. This Pokémon breathes fire of over 1,800 degrees F.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    name: "Mudkip",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/258.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/259.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png",
    type: "Water",
    description: "The fin on Mudkip's head acts as highly sensitive radar. Using this fin to sense movements of water and air.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  // Gen 4 Starters
  {
    name: "Turtwig",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/387.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/388.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/389.png",
    type: "Grass",
    description: "Made from soil, the shell on its back gets harder when it drinks water. It lives along lakes.",
    evolutionLevels: { stage2: 18, stage3: 32 }
  },
  {
    name: "Chimchar",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/390.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/391.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/392.png",
    type: "Fire",
    description: "It agilely scales sheer cliffs to live atop craggy mountains. Its fire is put out when it sleeps.",
    evolutionLevels: { stage2: 14, stage3: 36 }
  },
  {
    name: "Piplup",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/394.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/395.png",
    type: "Water",
    description: "A poor walker, it often falls down. However, its strong pride makes it puff up its chest without a care.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  // Gen 5 Starters
  {
    name: "Snivy",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/495.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/496.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/497.png",
    type: "Grass",
    description: "Being exposed to sunlight makes its movements swifter. It uses vines more adeptly than its hands.",
    evolutionLevels: { stage2: 17, stage3: 36 }
  },
  {
    name: "Tepig",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/498.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/499.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/500.png",
    type: "Fire",
    description: "It can deftly dodge its foe's attacks while shooting fireballs from its nose. It roasts berries before it eats them.",
    evolutionLevels: { stage2: 17, stage3: 36 }
  },
  {
    name: "Oshawott",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/501.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/502.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/503.png",
    type: "Water",
    description: "The scalchop on its stomach isn't just used for battle—it can be used to break open hard berries as well.",
    evolutionLevels: { stage2: 17, stage3: 36 }
  },
  // Gen 6 Starters
  {
    name: "Chespin",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/650.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/651.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/652.png",
    type: "Grass",
    description: "The quills on its head are usually soft. When it flexes them, the points become so hard and sharp that they can pierce rock.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    name: "Fennekin",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/653.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/654.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/655.png",
    type: "Fire",
    description: "Eating a twig fills it with energy, and its roomy ears give vent to air hotter than 390 degrees Fahrenheit.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    name: "Froakie",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/656.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/657.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png",
    type: "Water",
    description: "It secretes flexible bubbles from its chest and back. The bubbles reduce the damage it would otherwise take when attacked.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  // Gen 7 Starters
  {
    name: "Rowlet",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/722.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/723.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/724.png",
    type: "Grass/Flying",
    description: "This wary Pokémon uses photosynthesis to store up energy during the day, while becoming active at night.",
    evolutionLevels: { stage2: 17, stage3: 34 }
  },
  {
    name: "Litten",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/725.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/726.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/727.png",
    type: "Fire",
    description: "While grooming itself, it builds up fur inside its stomach. It sets the fur alight and breathes fireballs.",
    evolutionLevels: { stage2: 17, stage3: 34 }
  },
  {
    name: "Popplio",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/728.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/729.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/730.png",
    type: "Water",
    description: "This Pokémon snorts body fluids from its nose, blowing balloons to smash into its foes. It's famous for being a hard worker.",
    evolutionLevels: { stage2: 17, stage3: 34 }
  },
  // Gen 8 Starters
  {
    name: "Grookey",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/810.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/811.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/812.png",
    type: "Grass",
    description: "When it uses its special stick to strike up a beat, the sound waves produced carry revitalizing energy to the plants and flowers in the area.",
    evolutionLevels: { stage2: 16, stage3: 35 }
  },
  {
    name: "Scorbunny",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/813.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/814.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/815.png",
    type: "Fire",
    description: "A warm-up of running around gets fire energy coursing through this Pokémon's body. Once that happens, it's ready to fight at full power.",
    evolutionLevels: { stage2: 16, stage3: 35 }
  },
  {
    name: "Sobble",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/816.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/817.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/818.png",
    type: "Water",
    description: "When scared, this Pokémon cries. Its tears pack the chemical punch of 100 onions, and attackers won't be able to resist weeping.",
    evolutionLevels: { stage2: 16, stage3: 35 }
  },
  // Popular Pokemon
  {
    name: "Jigglypuff",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/40.png",
    type: "Normal/Fairy",
    description: "When its huge eyes waver, it sings a mysteriously soothing melody that lulls its enemies to sleep.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Meowth",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/53.png",
    type: "Normal",
    description: "Adores circular objects. Wanders the streets on a nightly basis to look for dropped loose change.",
    evolutionLevels: { stage2: 0, stage3: 28 }
  },
  {
    name: "Psyduck",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/55.png",
    type: "Water",
    description: "Constantly troubled by headaches. It uses psychic powers when its head hurts.",
    evolutionLevels: { stage2: 0, stage3: 33 }
  },
  {
    name: "Growlithe",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png",
    type: "Fire",
    description: "Very protective of its territory. It will bark and bite to repel intruders from its space.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Abra",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png",
    type: "Psychic",
    description: "Using its ability to read minds, it will identify impending danger and teleport to safety.",
    evolutionLevels: { stage2: 16, stage3: 0 }
  },
  {
    name: "Machop",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/67.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png",
    type: "Fighting",
    description: "Loves to build its muscles. It trains in all styles of martial arts to become even stronger.",
    evolutionLevels: { stage2: 28, stage3: 0 }
  },
  {
    name: "Bellsprout",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/69.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/70.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/71.png",
    type: "Grass/Poison",
    description: "A carnivorous Pokémon that traps and eats bugs. It uses its root feet to soak up needed moisture.",
    evolutionLevels: { stage2: 21, stage3: 0 }
  },
  {
    name: "Tentacool",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/73.png",
    type: "Water/Poison",
    description: "Drifts in shallow seas. Anglers who hook them by accident are often punished by its stinging acid.",
    evolutionLevels: { stage2: 0, stage3: 30 }
  },
  {
    name: "Geodude",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/75.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/76.png",
    type: "Rock/Ground",
    description: "Found in fields and mountains. Mistaking them for boulders, people often step or trip on them.",
    evolutionLevels: { stage2: 25, stage3: 0 }
  },
  {
    name: "Ponyta",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/78.png",
    type: "Fire",
    description: "Its hooves are 10 times harder than diamonds. It can trample anything completely flat in little time.",
    evolutionLevels: { stage2: 0, stage3: 40 }
  },
  {
    name: "Slowpoke",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/80.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/199.png",
    type: "Water/Psychic",
    description: "Incredibly slow and dopey. It takes 5 seconds for it to feel pain when under attack.",
    evolutionLevels: { stage2: 37, stage3: 0 }
  },
  {
    name: "Magnemite",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/82.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/462.png",
    type: "Electric/Steel",
    description: "Uses anti-gravity to stay suspended. Appears without warning and uses Thunder Wave and similar moves.",
    evolutionLevels: { stage2: 30, stage3: 0 }
  },
  {
    name: "Doduo",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/84.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/84.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/85.png",
    type: "Normal/Flying",
    description: "A bird that makes up for its poor flying with its fast foot speed. Leaves giant footprints.",
    evolutionLevels: { stage2: 0, stage3: 31 }
  },
  {
    name: "Seel",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/86.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/86.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/87.png",
    type: "Water",
    description: "The protruding horn on its head is very hard. It is used for bashing through thick ice.",
    evolutionLevels: { stage2: 0, stage3: 34 }
  },
  {
    name: "Grimer",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/88.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/88.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/89.png",
    type: "Poison",
    description: "Appears in filthy areas. Thrives by sucking up polluted sludge that is pumped out of factories.",
    evolutionLevels: { stage2: 0, stage3: 38 }
  },
  {
    name: "Shellder",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/90.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/90.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/91.png",
    type: "Water",
    description: "Its hard shell repels any kind of attack. It is vulnerable only when its shell is open.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Gastly",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/93.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
    type: "Ghost/Poison",
    description: "Almost invisible, this gaseous Pokémon cloaks the target and puts it to sleep without notice.",
    evolutionLevels: { stage2: 25, stage3: 0 }
  },
  {
    name: "Drowzee",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/96.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/96.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/97.png",
    type: "Psychic",
    description: "Puts enemies to sleep then eats their dreams. Occasionally gets sick from eating bad dreams.",
    evolutionLevels: { stage2: 0, stage3: 26 }
  },
  {
    name: "Krabby",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/98.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/98.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/99.png",
    type: "Water",
    description: "Its pincers are not only powerful weapons but also tools for breaking equilibrium in battle.",
    evolutionLevels: { stage2: 0, stage3: 28 }
  },
  {
    name: "Voltorb",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/101.png",
    type: "Electric",
    description: "Usually found in power plants. Easily mistaken for a Poké Ball, they also tend to explode without warning.",
    evolutionLevels: { stage2: 0, stage3: 30 }
  },
  {
    name: "Exeggcute",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/102.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/102.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/103.png",
    type: "Grass/Psychic",
    description: "Often mistaken for eggs. When disturbed, they quickly gather and attack in swarms.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Cubone",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/104.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/104.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/105.png",
    type: "Ground",
    description: "Because it never removes its skull helmet, no one has ever seen this Pokémon's real face.",
    evolutionLevels: { stage2: 0, stage3: 28 }
  },
  {
    name: "Tyrogue",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/236.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/106.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/107.png",
    type: "Fighting",
    description: "It is always bursting with energy. To make itself stronger, it keeps on fighting even if it loses.",
    evolutionLevels: { stage2: 20, stage3: 0 }
  },
  {
    name: "Lickitung",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/108.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/108.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/463.png",
    type: "Normal",
    description: "Its tongue can be extended like a chameleon's. It leaves a tingling sensation when it licks enemies.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Koffing",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/110.png",
    type: "Poison",
    description: "Because it stores several kinds of toxic gases in its body, it is prone to exploding without warning.",
    evolutionLevels: { stage2: 0, stage3: 35 }
  },
  {
    name: "Rhyhorn",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/111.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/464.png",
    type: "Ground/Rock",
    description: "Its massive bones are 1000 times harder than human bones. It can easily knock a trailer flying.",
    evolutionLevels: { stage2: 42, stage3: 0 }
  },
  {
    name: "Chansey",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/113.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/113.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/242.png",
    type: "Normal",
    description: "A rare and elusive Pokémon that is said to bring happiness to those who manage to get one.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Tangela",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/114.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/114.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/465.png",
    type: "Grass",
    description: "The whole body is swathed with wide vines that are similar to seaweed. Its vines shake as it walks.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Horsea",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/116.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/117.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/230.png",
    type: "Water",
    description: "Known to shoot down flying bugs with precision blasts of ink from the surface of the water.",
    evolutionLevels: { stage2: 32, stage3: 0 }
  },
  {
    name: "Goldeen",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/118.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/118.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/119.png",
    type: "Water",
    description: "Its tail fin billows like an elegant ballroom dress, giving it the nickname of the Water Queen.",
    evolutionLevels: { stage2: 0, stage3: 33 }
  },
  {
    name: "Staryu",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png",
    type: "Water",
    description: "An enigmatic Pokémon that can effortlessly regenerate any appendage it loses in battle.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Starmie",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png",
    type: "Water/Psychic",
    description: "Its central core glows with the seven colors of the rainbow. Some people value the core as a gem.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Mr. Mime",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/122.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/122.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/866.png",
    type: "Psychic/Fairy",
    description: "A master of pantomime. Its gestures and motions convince watchers that something unseeable actually exists.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Scyther",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/123.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/123.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/212.png",
    type: "Bug/Flying",
    description: "With ninja-like agility and speed, it can create the illusion that there is more than one.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Jynx",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/124.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/124.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/124.png",
    type: "Ice/Psychic",
    description: "It seductively wiggles its hips as it walks. It can cause people to dance in unison with it.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Electabuzz",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/125.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/125.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/466.png",
    type: "Electric",
    description: "Normally found near power plants, they can wander away and cause major blackouts in cities.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Magmar",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/467.png",
    type: "Fire",
    description: "Its body always burns with an orange glow that enables it to hide perfectly among flames.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Pinsir",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/127.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/127.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/127.png",
    type: "Bug",
    description: "If it fails to crush the victim in its pincers, it will swing it around and toss it hard.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Tauros",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/128.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/128.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/128.png",
    type: "Normal",
    description: "When it targets an enemy, it charges furiously while whipping its body with its long tails.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Magikarp",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
    type: "Water",
    description: "In the distant past, it was somewhat stronger than the horribly weak descendants that exist today.",
    evolutionLevels: { stage2: 0, stage3: 20 }
  },
  {
    name: "Gyarados",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
    type: "Water/Flying",
    description: "Rarely seen in the wild. Huge and vicious, it is capable of destroying entire cities in a rage.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Lapras",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
    type: "Water/Ice",
    description: "A Pokémon that has been overhunted almost to extinction. It can ferry people across the water.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  },
  {
    name: "Ditto",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
    type: "Normal",
    description: "Capable of copying an enemy's genetic code to instantly transform itself into a duplicate of the enemy.",
    evolutionLevels: { stage2: 0, stage3: 0 }
  }
];

// Catchable Pokemon data - 100+ Pokemon
const catchablePokemon = [
  // Common Pokemon (Easy to catch)
  {
    pokemonId: 10,
    name: "Caterpie",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
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
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png",
    type: "Bug/Poison",
    rarity: "common",
    difficulty: 1,
    description: "A small bug Pokémon with a poisonous stinger.",
    catchRequirement: "Complete 1 task",
    pointsReward: 4
  },
  {
    pokemonId: 16,
    name: "Pidgey",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png",
    type: "Normal/Flying",
    rarity: "common",
    difficulty: 2,
    description: "A common sight in forests and woods. It flaps its wings at ground level to kick up blinding sand.",
    catchRequirement: "Complete 2 tasks",
    pointsReward: 5
  },
  {
    pokemonId: 19,
    name: "Rattata",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
    type: "Normal",
    rarity: "common",
    difficulty: 1,
    description: "Bites anything when it attacks. Small and very quick, it is a common sight in many places.",
    catchRequirement: "Complete 1 task",
    pointsReward: 3
  },
  {
    pokemonId: 21,
    name: "Spearow",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png",
    type: "Normal/Flying",
    rarity: "common",
    difficulty: 2,
    description: "A small bird Pokémon that's easily startled.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 23,
    name: "Ekans",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png",
    type: "Poison",
    rarity: "common",
    difficulty: 2,
    description: "Moves silently and stealthily. Eats the eggs of birds, such as Pidgey and Spearow, whole.",
    catchRequirement: "Complete 2 tasks",
    pointsReward: 5
  },
  {
    pokemonId: 25,
    name: "Pikachu",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    type: "Electric",
    rarity: "uncommon",
    difficulty: 3,
    description: "When several of these Pokémon gather, their electricity can cause lightning storms.",
    catchRequirement: "Complete 5 tasks",
    pointsReward: 12
  },
  {
    pokemonId: 27,
    name: "Sandshrew",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png",
    type: "Ground",
    rarity: "common",
    difficulty: 2,
    description: "Burrows deep underground in arid locations far from water. It only emerges to hunt for food.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 7
  },
  {
    pokemonId: 29,
    name: "Nidoran♀",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png",
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
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/32.png",
    type: "Poison",
    rarity: "common",
    difficulty: 2,
    description: "A male Nidoran with a more aggressive nature.",
    catchRequirement: "Complete 2 tasks in one day",
    pointsReward: 7
  },
  {
    pokemonId: 35,
    name: "Clefairy",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png",
    type: "Fairy",
    rarity: "uncommon",
    difficulty: 4,
    description: "Its magical and cute appeal has many admirers. It is rare and found only in certain areas.",
    catchRequirement: "Complete 6 tasks",
    pointsReward: 15
  },
  {
    pokemonId: 37,
    name: "Vulpix",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png",
    type: "Fire",
    rarity: "common",
    difficulty: 3,
    description: "A fox Pokémon with six beautiful tails.",
    catchRequirement: "Complete 4 tasks",
    pointsReward: 10
  },
  {
    pokemonId: 39,
    name: "Jigglypuff",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    type: "Normal/Fairy",
    rarity: "uncommon",
    difficulty: 3,
    description: "When its huge eyes waver, it sings a mysteriously soothing melody that lulls its enemies to sleep.",
    catchRequirement: "Complete 5 tasks",
    pointsReward: 12
  },
  {
    pokemonId: 41,
    name: "Zubat",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png",
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
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png",
    type: "Grass/Poison",
    rarity: "common",
    difficulty: 2,
    description: "During the day, it keeps its face buried in the ground.",
    catchRequirement: "Complete 2 tasks",
    pointsReward: 5
  },
  {
    pokemonId: 46,
    name: "Paras",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/46.png",
    type: "Bug/Grass",
    rarity: "common",
    difficulty: 2,
    description: "Burrows to suck tree roots. The mushrooms on its back grow by drawing nutrients from the bug host.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 48,
    name: "Venonat",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/48.png",
    type: "Bug/Poison",
    rarity: "common",
    difficulty: 2,
    description: "Lives in the shadows of tall trees where it eats insects. It is attracted by light at night.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 7
  },
  {
    pokemonId: 50,
    name: "Diglett",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/50.png",
    type: "Ground",
    rarity: "common",
    difficulty: 2,
    description: "Lives about one yard underground where it feeds on plant roots. It sometimes appears above ground.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 52,
    name: "Meowth",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
    type: "Normal",
    rarity: "common",
    difficulty: 2,
    description: "Adores circular objects. Wanders the streets on a nightly basis to look for dropped loose change.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 7
  },
  {
    pokemonId: 54,
    name: "Psyduck",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
    type: "Water",
    rarity: "common",
    difficulty: 2,
    description: "Constantly troubled by headaches. It uses psychic powers when its head hurts.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 56,
    name: "Mankey",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/56.png",
    type: "Fighting",
    rarity: "common",
    difficulty: 3,
    description: "Extremely quick to anger. It could be docile one moment then thrashing away the next instant.",
    catchRequirement: "Complete 4 tasks",
    pointsReward: 8
  },
  {
    pokemonId: 58,
    name: "Growlithe",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png",
    type: "Fire",
    rarity: "uncommon",
    difficulty: 4,
    description: "Very protective of its territory. It will bark and bite to repel intruders from its space.",
    catchRequirement: "Complete 6 tasks",
    pointsReward: 15
  },
  {
    pokemonId: 60,
    name: "Poliwag",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png",
    type: "Water",
    rarity: "common",
    difficulty: 2,
    description: "Its newly grown legs prevent it from running. It appears to prefer swimming than trying to stand.",
    catchRequirement: "Complete 2 tasks",
    pointsReward: 5
  },
  {
    pokemonId: 63,
    name: "Abra",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png",
    type: "Psychic",
    rarity: "rare",
    difficulty: 5,
    description: "Using its ability to read minds, it will identify impending danger and teleport to safety.",
    catchRequirement: "Complete 8 tasks",
    pointsReward: 20
  },
  {
    pokemonId: 66,
    name: "Machop",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png",
    type: "Fighting",
    rarity: "common",
    difficulty: 3,
    description: "Loves to build its muscles. It trains in all styles of martial arts to become even stronger.",
    catchRequirement: "Complete 4 tasks",
    pointsReward: 9
  },
  {
    pokemonId: 69,
    name: "Bellsprout",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/69.png",
    type: "Grass/Poison",
    rarity: "common",
    difficulty: 2,
    description: "A carnivorous Pokémon that traps and eats bugs. It uses its root feet to soak up needed moisture.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 72,
    name: "Tentacool",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png",
    type: "Water/Poison",
    rarity: "common",
    difficulty: 2,
    description: "Drifts in shallow seas. Anglers who hook them by accident are often punished by its stinging acid.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 74,
    name: "Geodude",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png",
    type: "Rock/Ground",
    rarity: "common",
    difficulty: 2,
    description: "Found in fields and mountains. Mistaking them for boulders, people often step or trip on them.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 77,
    name: "Ponyta",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png",
    type: "Fire",
    rarity: "uncommon",
    difficulty: 4,
    description: "Its hooves are 10 times harder than diamonds. It can trample anything completely flat in little time.",
    catchRequirement: "Complete 6 tasks",
    pointsReward: 15
  },
  {
    pokemonId: 79,
    name: "Slowpoke",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png",
    type: "Water/Psychic",
    rarity: "common",
    difficulty: 2,
    description: "Incredibly slow and dopey. It takes 5 seconds for it to feel pain when under attack.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 81,
    name: "Magnemite",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png",
    type: "Electric/Steel",
    rarity: "uncommon",
    difficulty: 4,
    description: "Uses anti-gravity to stay suspended. Appears without warning and uses Thunder Wave and similar moves.",
    catchRequirement: "Complete 6 tasks",
    pointsReward: 15
  },
  {
    pokemonId: 84,
    name: "Doduo",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/84.png",
    type: "Normal/Flying",
    rarity: "common",
    difficulty: 2,
    description: "A bird that makes up for its poor flying with its fast foot speed. Leaves giant footprints.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 86,
    name: "Seel",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/86.png",
    type: "Water",
    rarity: "common",
    difficulty: 2,
    description: "The protruding horn on its head is very hard. It is used for bashing through thick ice.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 88,
    name: "Grimer",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/88.png",
    type: "Poison",
    rarity: "common",
    difficulty: 2,
    description: "Appears in filthy areas. Thrives by sucking up polluted sludge that is pumped out of factories.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 90,
    name: "Shellder",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/90.png",
    type: "Water",
    rarity: "common",
    difficulty: 2,
    description: "Its hard shell repels any kind of attack. It is vulnerable only when its shell is open.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 92,
    name: "Gastly",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png",
    type: "Ghost/Poison",
    rarity: "rare",
    difficulty: 5,
    description: "Almost invisible, this gaseous Pokémon cloaks the target and puts it to sleep without notice.",
    catchRequirement: "Complete 8 tasks",
    pointsReward: 20
  },
  {
    pokemonId: 95,
    name: "Onix",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png",
    type: "Rock/Ground",
    rarity: "rare",
    difficulty: 6,
    description: "As it grows, the stone portions of its body harden to become similar to a diamond, but colored black.",
    catchRequirement: "Complete 10 tasks",
    pointsReward: 25
  },
  {
    pokemonId: 96,
    name: "Drowzee",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/96.png",
    type: "Psychic",
    rarity: "uncommon",
    difficulty: 4,
    description: "Puts enemies to sleep then eats their dreams. Occasionally gets sick from eating bad dreams.",
    catchRequirement: "Complete 6 tasks",
    pointsReward: 15
  },
  {
    pokemonId: 98,
    name: "Krabby",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/98.png",
    type: "Water",
    rarity: "common",
    difficulty: 2,
    description: "Its pincers are not only powerful weapons but also tools for breaking equilibrium in battle.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 100,
    name: "Voltorb",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png",
    type: "Electric",
    rarity: "uncommon",
    difficulty: 4,
    description: "Usually found in power plants. Easily mistaken for a Poké Ball, they also tend to explode without warning.",
    catchRequirement: "Complete 6 tasks",
    pointsReward: 15
  },
  {
    pokemonId: 102,
    name: "Exeggcute",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/102.png",
    type: "Grass/Psychic",
    rarity: "common",
    difficulty: 3,
    description: "Often mistaken for eggs. When disturbed, they quickly gather and attack in swarms.",
    catchRequirement: "Complete 4 tasks",
    pointsReward: 8
  },
  {
    pokemonId: 104,
    name: "Cubone",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/104.png",
    type: "Ground",
    rarity: "uncommon",
    difficulty: 4,
    description: "Because it never removes its skull helmet, no one has ever seen this Pokémon's real face.",
    catchRequirement: "Complete 6 tasks",
    pointsReward: 15
  },
  {
    pokemonId: 108,
    name: "Lickitung",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/108.png",
    type: "Normal",
    rarity: "uncommon",
    difficulty: 4,
    description: "Its tongue can be extended like a chameleon's. It leaves a tingling sensation when it licks enemies.",
    catchRequirement: "Complete 6 tasks",
    pointsReward: 15
  },
  {
    pokemonId: 109,
    name: "Koffing",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png",
    type: "Poison",
    rarity: "common",
    difficulty: 3,
    description: "Because it stores several kinds of toxic gases in its body, it is prone to exploding without warning.",
    catchRequirement: "Complete 4 tasks",
    pointsReward: 8
  },
  {
    pokemonId: 111,
    name: "Rhyhorn",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/111.png",
    type: "Ground/Rock",
    rarity: "uncommon",
    difficulty: 4,
    description: "Its massive bones are 1000 times harder than human bones. It can easily knock a trailer flying.",
    catchRequirement: "Complete 6 tasks",
    pointsReward: 15
  },
  {
    pokemonId: 113,
    name: "Chansey",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/113.png",
    type: "Normal",
    rarity: "rare",
    difficulty: 7,
    description: "A rare and elusive Pokémon that is said to bring happiness to those who manage to get one.",
    catchRequirement: "Complete 12 tasks",
    pointsReward: 30
  },
  {
    pokemonId: 114,
    name: "Tangela",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/114.png",
    type: "Grass",
    rarity: "uncommon",
    difficulty: 4,
    description: "The whole body is swathed with wide vines that are similar to seaweed. Its vines shake as it walks.",
    catchRequirement: "Complete 6 tasks",
    pointsReward: 15
  },
  {
    pokemonId: 116,
    name: "Horsea",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/116.png",
    type: "Water",
    rarity: "common",
    difficulty: 3,
    description: "Known to shoot down flying bugs with precision blasts of ink from the surface of the water.",
    catchRequirement: "Complete 4 tasks",
    pointsReward: 8
  },
  {
    pokemonId: 118,
    name: "Goldeen",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/118.png",
    type: "Water",
    rarity: "common",
    difficulty: 2,
    description: "Its tail fin billows like an elegant ballroom dress, giving it the nickname of the Water Queen.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 120,
    name: "Staryu",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png",
    type: "Water",
    rarity: "common",
    difficulty: 2,
    description: "An enigmatic Pokémon that can effortlessly regenerate any appendage it loses in battle.",
    catchRequirement: "Complete 3 tasks",
    pointsReward: 6
  },
  {
    pokemonId: 122,
    name: "Mr. Mime",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/122.png",
    type: "Psychic/Fairy",
    rarity: "rare",
    difficulty: 6,
    description: "A master of pantomime. Its gestures and motions convince watchers that something unseeable actually exists.",
    catchRequirement: "Complete 10 tasks",
    pointsReward: 25
  },
  {
    pokemonId: 123,
    name: "Scyther",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/123.png",
    type: "Bug/Flying",
    rarity: "rare",
    difficulty: 6,
    description: "With ninja-like agility and speed, it can create the illusion that there is more than one.",
    catchRequirement: "Complete 10 tasks",
    pointsReward: 25
  },
  {
    pokemonId: 124,
    name: "Jynx",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/124.png",
    type: "Ice/Psychic",
    rarity: "rare",
    difficulty: 6,
    description: "It seductively wiggles its hips as it walks. It can cause people to dance in unison with it.",
    catchRequirement: "Complete 10 tasks",
    pointsReward: 25
  },
  {
    pokemonId: 125,
    name: "Electabuzz",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/125.png",
    type: "Electric",
    rarity: "rare",
    difficulty: 6,
    description: "Normally found near power plants, they can wander away and cause major blackouts in cities.",
    catchRequirement: "Complete 10 tasks",
    pointsReward: 25
  },
  {
    pokemonId: 126,
    name: "Magmar",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png",
    type: "Fire",
    rarity: "rare",
    difficulty: 6,
    description: "Its body always burns with an orange glow that enables it to hide perfectly among flames.",
    catchRequirement: "Complete 10 tasks",
    pointsReward: 25
  },
  {
    pokemonId: 127,
    name: "Pinsir",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/127.png",
    type: "Bug",
    rarity: "rare",
    difficulty: 6,
    description: "If it fails to crush the victim in its pincers, it will swing it around and toss it hard.",
    catchRequirement: "Complete 10 tasks",
    pointsReward: 25
  },
  {
    pokemonId: 128,
    name: "Tauros",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/128.png",
    type: "Normal",
    rarity: "rare",
    difficulty: 6,
    description: "When it targets an enemy, it charges furiously while whipping its body with its long tails.",
    catchRequirement: "Complete 10 tasks",
    pointsReward: 25
  },
  {
    pokemonId: 129,
    name: "Magikarp",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png",
    type: "Water",
    rarity: "common",
    difficulty: 1,
    description: "In the distant past, it was somewhat stronger than the horribly weak descendants that exist today.",
    catchRequirement: "Complete 1 task",
    pointsReward: 3
  },
  {
    pokemonId: 131,
    name: "Lapras",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
    type: "Water/Ice",
    rarity: "legendary",
    difficulty: 8,
    description: "A Pokémon that has been overhunted almost to extinction. It can ferry people across the water.",
    catchRequirement: "Complete 15 tasks",
    pointsReward: 40
  },
  {
    pokemonId: 133,
    name: "Eevee",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
    type: "Normal",
    rarity: "rare",
    difficulty: 7,
    description: "Its genetic code is irregular. It may mutate if it is exposed to radiation from element stones.",
    catchRequirement: "Complete 12 tasks",
    pointsReward: 30
  },
  {
    pokemonId: 135,
    name: "Jolteon",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png",
    type: "Electric",
    rarity: "rare",
    difficulty: 7,
    description: "A sensitive Pokémon that easily becomes sad or angry. Every time its mood changes, it charges power.",
    catchRequirement: "Complete 12 tasks",
    pointsReward: 30
  },
  {
    pokemonId: 136,
    name: "Flareon",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png",
    type: "Fire",
    rarity: "rare",
    difficulty: 7,
    description: "When storing thermal energy in its body, its temperature could soar to over 1600 degrees.",
    catchRequirement: "Complete 12 tasks",
    pointsReward: 30
  },
  {
    pokemonId: 143,
    name: "Snorlax",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
    type: "Normal",
    rarity: "legendary",
    difficulty: 8,
    description: "Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful.",
    catchRequirement: "Complete 15 tasks",
    pointsReward: 40
  },
  {
    pokemonId: 147,
    name: "Dratini",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/147.png",
    type: "Dragon",
    rarity: "legendary",
    difficulty: 9,
    description: "Long considered a mythical Pokémon until recently when a small colony was found living underwater.",
    catchRequirement: "Complete 18 tasks",
    pointsReward: 50
  },
  {
    pokemonId: 149,
    name: "Dragonite",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
    type: "Dragon/Flying",
    rarity: "legendary",
    difficulty: 10,
    description: "An extremely rarely seen marine Pokémon. Its intelligence is said to match that of humans.",
    catchRequirement: "Complete 20 tasks",
    pointsReward: 60
  },
  {
    pokemonId: 150,
    name: "Mewtwo",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
    type: "Psychic",
    rarity: "mythical",
    difficulty: 10,
    description: "Its DNA is almost the same as Mew's. However, its size and disposition are vastly different.",
    catchRequirement: "Complete 25 tasks",
    pointsReward: 100
  },
  {
    pokemonId: 151,
    name: "Mew",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
    type: "Psychic",
    rarity: "mythical",
    difficulty: 10,
    description: "So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide.",
    catchRequirement: "Complete 30 tasks",
    pointsReward: 150
  }
];

async function main() {
  console.log('🌱 Starting enhanced Pokemon database seeding...');
  
  // Convert Pokemon Pet sprites to base64
  console.log('🔄 Converting Pokemon Pet sprites to base64...');
  for (const pokemon of pokemonPets) {
    pokemon.spriteStage1 = await imageUrlToBase64(pokemon.spriteStage1) || pokemon.spriteStage1;
    pokemon.spriteStage2 = await imageUrlToBase64(pokemon.spriteStage2) || pokemon.spriteStage2;
    pokemon.spriteStage3 = await imageUrlToBase64(pokemon.spriteStage3) || pokemon.spriteStage3;
  }
  
  // Convert Catchable Pokemon sprites to base64
  console.log('🔄 Converting Catchable Pokemon sprites to base64...');
  for (const pokemon of catchablePokemon) {
    pokemon.sprite = await imageUrlToBase64(pokemon.sprite) || pokemon.sprite;
  }
  
  // Seed Pokemon Pets
  console.log('📝 Seeding Pokemon Pets...');
  for (const pokemon of pokemonPets) {
    await prisma.pokemonPet.upsert({
      where: { name: pokemon.name },
      update: pokemon,
      create: pokemon
    });
  }
  
  // Seed Catchable Pokemon
  console.log('📝 Seeding Catchable Pokemon...');
  for (const pokemon of catchablePokemon) {
    await prisma.catchablePokemon.upsert({
      where: { pokemonId: pokemon.pokemonId },
      update: pokemon,
      create: pokemon
    });
  }
  
  console.log('✅ Enhanced Pokemon seeding completed!');
  console.log(`📊 Seeded ${pokemonPets.length} Pokemon Pets`);
  console.log(`📊 Seeded ${catchablePokemon.length} Catchable Pokemon`);
}

main()
  .catch((e) => {
    console.error('❌ Error during enhanced seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
