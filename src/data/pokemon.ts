export interface Pokemon {
  id: number;
  name: string;
  spriteStage1: string;
  spriteStage2: string;
  spriteStage3: string;
  type: string;
  description: string;
  evolutionLevels: {
    stage2: number;
    stage3: number;
  };
}

export const pokemonList: Pokemon[] = [
  {
    id: 1,
    name: "Bulbasaur",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    type: "Grass/Poison",
    description: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
    evolutionLevels: { stage2: 16, stage3: 32 }
  },
  {
    id: 4,
    name: "Charmander",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    type: "Fire",
    description: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    id: 7,
    name: "Squirtle",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
    type: "Water",
    description: "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    id: 25,
    name: "Pikachu",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/172.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png",
    type: "Electric",
    description: "When several of these Pokémon gather, their electricity can cause lightning storms.",
    evolutionLevels: { stage2: 10, stage3: 30 }
  },
  {
    id: 133,
    name: "Eevee",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png",
    type: "Normal",
    description: "Its genetic code is irregular. It may mutate if it is exposed to radiation from element stones.",
    evolutionLevels: { stage2: 20, stage3: 40 }
  },
  {
    id: 152,
    name: "Chikorita",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/152.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/153.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/154.png",
    type: "Grass",
    description: "A sweet aroma gently wafts from the leaf on its head. It is docile and loves to soak up the sun's rays.",
    evolutionLevels: { stage2: 16, stage3: 32 }
  },
  {
    id: 155,
    name: "Cyndaquil",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/155.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/156.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/157.png",
    type: "Fire",
    description: "It is timid, and always curls itself up in a ball. If attacked, it flares up its back for protection.",
    evolutionLevels: { stage2: 14, stage3: 36 }
  },
  {
    id: 158,
    name: "Totodile",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/158.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/159.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/160.png",
    type: "Water",
    description: "Its well-developed jaws are powerful and capable of crushing anything. Even its trainer must be careful.",
    evolutionLevels: { stage2: 18, stage3: 30 }
  },
  {
    id: 252,
    name: "Treecko",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/252.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/253.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/254.png",
    type: "Grass",
    description: "Treecko has small hooks on the bottom of its feet that enable it to scale vertical walls.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    id: 255,
    name: "Torchic",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/255.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/256.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/257.png",
    type: "Fire",
    description: "Torchic sticks with its Trainer, following behind with unsteady steps. This Pokémon breathes fire of over 1,800 degrees F.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    id: 258,
    name: "Mudkip",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/258.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/259.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png",
    type: "Water",
    description: "The fin on Mudkip's head acts as highly sensitive radar. Using this fin to sense movements of water and air.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    id: 387,
    name: "Turtwig",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/387.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/388.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/389.png",
    type: "Grass",
    description: "Made from soil, the shell on its back gets harder when it drinks water. It lives along lakes.",
    evolutionLevels: { stage2: 18, stage3: 32 }
  },
  {
    id: 390,
    name: "Chimchar",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/390.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/391.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/392.png",
    type: "Fire",
    description: "It agilely scales sheer cliffs to live atop craggy mountains. Its fire is put out when it sleeps.",
    evolutionLevels: { stage2: 14, stage3: 36 }
  },
  {
    id: 393,
    name: "Piplup",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/394.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/395.png",
    type: "Water",
    description: "A poor walker, it often falls down. However, its strong pride makes it puff up its chest without a care.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    id: 495,
    name: "Snivy",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/495.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/496.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/497.png",
    type: "Grass",
    description: "Being exposed to sunlight makes its movements swifter. It uses vines more adeptly than its hands.",
    evolutionLevels: { stage2: 17, stage3: 36 }
  },
  {
    id: 498,
    name: "Tepig",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/498.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/499.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/500.png",
    type: "Fire",
    description: "It can deftly dodge its foe's attacks while shooting fireballs from its nose. It roasts berries before it eats them.",
    evolutionLevels: { stage2: 17, stage3: 36 }
  },
  {
    id: 501,
    name: "Oshawott",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/501.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/502.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/503.png",
    type: "Water",
    description: "The scalchop on its stomach isn't just used for battle—it can be used to break open hard berries as well.",
    evolutionLevels: { stage2: 17, stage3: 36 }
  },
  {
    id: 650,
    name: "Chespin",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/650.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/651.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/652.png",
    type: "Grass",
    description: "The quills on its head are usually soft. When it flexes them, the points become so hard and sharp that they can pierce rock.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    id: 653,
    name: "Fennekin",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/653.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/654.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/655.png",
    type: "Fire",
    description: "Eating a twig fills it with energy, and its roomy ears give vent to air hotter than 390 degrees Fahrenheit.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    id: 656,
    name: "Froakie",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/656.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/657.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png",
    type: "Water",
    description: "It secretes flexible bubbles from its chest and back. The bubbles reduce the damage it would otherwise take when attacked.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    id: 722,
    name: "Rowlet",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/722.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/723.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/724.png",
    type: "Grass/Flying",
    description: "This wary Pokémon uses photosynthesis to store up energy during the day, while becoming active at night.",
    evolutionLevels: { stage2: 17, stage3: 34 }
  },
  {
    id: 725,
    name: "Litten",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/725.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/726.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/727.png",
    type: "Fire",
    description: "While grooming itself, it builds up fur inside its stomach. It sets the fur alight and breathes fiery attacks.",
    evolutionLevels: { stage2: 17, stage3: 34 }
  },
  {
    id: 728,
    name: "Popplio",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/728.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/729.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/730.png",
    type: "Water",
    description: "This Pokémon snorts body fluids from its nose, blowing balloons to take on enemies. A firm believer in the power of friendship.",
    evolutionLevels: { stage2: 17, stage3: 34 }
  },
  {
    id: 810,
    name: "Grookey",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/810.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/811.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/812.png",
    type: "Grass",
    description: "When it uses its special stick to strike up a beat, the sound waves produced carry revitalizing energy to the plants and flowers in the area.",
    evolutionLevels: { stage2: 16, stage3: 35 }
  },
  {
    id: 813,
    name: "Scorbunny",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/813.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/814.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/815.png",
    type: "Fire",
    description: "A warm-up of running around gets fire energy coursing through this Pokémon's body. Once that happens, it's ready to fight at full power.",
    evolutionLevels: { stage2: 16, stage3: 35 }
  },
  {
    id: 816,
    name: "Sobble",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/816.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/817.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/818.png",
    type: "Water",
    description: "When scared, this Pokémon cries. Its tears pack the chemical punch of 100 onions, and attackers won't be able to resist weeping.",
    evolutionLevels: { stage2: 16, stage3: 35 }
  },
  {
    id: 906,
    name: "Sprigatito",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/906.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/907.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/908.png",
    type: "Grass",
    description: "The sweet scent its body gives off mesmerizes those around it. The scent grows stronger when this Pokémon is in the sun.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    id: 909,
    name: "Fuecoco",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/909.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/910.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/911.png",
    type: "Fire",
    description: "This Pokémon is a bit slow to get moving, but once it does, nothing can stop it. When it's excited, it sneezes out flames.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  },
  {
    id: 912,
    name: "Quaxly",
    spriteStage1: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/912.png",
    spriteStage2: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/913.png",
    spriteStage3: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/914.png",
    type: "Water",
    description: "This Pokémon has a strong sense of personal space and doesn't like to be touched. It has a fluffy down that covers its body.",
    evolutionLevels: { stage2: 16, stage3: 36 }
  }
];

export const getPokemonById = (id: number): Pokemon | undefined => {
  return pokemonList.find(pokemon => pokemon.id === id);
};

export const getRandomPokemon = (): Pokemon => {
  const randomIndex = Math.floor(Math.random() * pokemonList.length);
  return pokemonList[randomIndex];
};

export const getPokemonByType = (type: string): Pokemon[] => {
  return pokemonList.filter(pokemon => pokemon.type.includes(type));
};
