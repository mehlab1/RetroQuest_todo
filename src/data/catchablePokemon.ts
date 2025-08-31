export interface CatchablePokemon {
  id: number;
  name: string;
  sprite: string;
  type: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  difficulty: number; // 1-10 scale
  description: string;
  catchRequirement: string;
  pointsReward: number;
}

export const catchablePokemon: CatchablePokemon[] = [
  // Common Pokemon (Easy tasks)
  {
    id: 19,
    name: "Rattata",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
    type: "Normal",
    rarity: "common",
    difficulty: 2,
    description: "A small, quick Pokémon that's easy to find.",
    catchRequirement: "Complete 3 tasks in one day",
    pointsReward: 10
  },
  {
    id: 16,
    name: "Pidgey",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png",
    type: "Normal/Flying",
    rarity: "common",
    difficulty: 2,
    description: "A gentle bird Pokémon that's commonly seen.",
    catchRequirement: "Maintain a 2-day streak",
    pointsReward: 15
  },
  {
    id: 10,
    name: "Caterpie",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
    type: "Bug",
    rarity: "common",
    difficulty: 1,
    description: "A small caterpillar that's very common.",
    catchRequirement: "Complete any task",
    pointsReward: 5
  },

  // Uncommon Pokemon (Medium tasks)
  {
    id: 25,
    name: "Pikachu",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    type: "Electric",
    rarity: "uncommon",
    difficulty: 4,
    description: "An electric mouse Pokémon that's quite popular.",
    catchRequirement: "Complete 5 high-priority tasks",
    pointsReward: 50
  },
  {
    id: 54,
    name: "Psyduck",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
    type: "Water",
    rarity: "uncommon",
    difficulty: 3,
    description: "A duck Pokémon that's always confused.",
    catchRequirement: "Complete 10 tasks in a week",
    pointsReward: 30
  },
  {
    id: 23,
    name: "Ekans",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png",
    type: "Poison",
    rarity: "uncommon",
    difficulty: 4,
    description: "A snake Pokémon that's quite sneaky.",
    catchRequirement: "Maintain a 5-day streak",
    pointsReward: 40
  },

  // Rare Pokemon (Hard tasks)
  {
    id: 6,
    name: "Charizard",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    type: "Fire/Flying",
    rarity: "rare",
    difficulty: 8,
    description: "A powerful dragon-like Pokémon that breathes fire.",
    catchRequirement: "Complete 20 difficult tasks",
    pointsReward: 200
  },
  {
    id: 9,
    name: "Blastoise",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
    type: "Water",
    rarity: "rare",
    difficulty: 8,
    description: "A massive turtle Pokémon with powerful water cannons.",
    catchRequirement: "Maintain a 10-day streak",
    pointsReward: 150
  },
  {
    id: 150,
    name: "Mewtwo",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
    type: "Psychic",
    rarity: "rare",
    difficulty: 9,
    description: "A genetically engineered Pokémon with incredible power.",
    catchRequirement: "Complete 50 tasks total",
    pointsReward: 300
  },

  // Legendary Pokemon (Very hard tasks)
  {
    id: 150,
    name: "Mew",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
    type: "Psychic",
    rarity: "legendary",
    difficulty: 10,
    description: "A mythical Pokémon said to contain the DNA of all Pokémon.",
    catchRequirement: "Complete 100 tasks and maintain a 30-day streak",
    pointsReward: 500
  },
  {
    id: 249,
    name: "Lugia",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png",
    type: "Psychic/Flying",
    rarity: "legendary",
    difficulty: 10,
    description: "A legendary Pokémon that rules the seas.",
    catchRequirement: "Complete all daily quests for 7 days straight",
    pointsReward: 400
  },
  {
    id: 384,
    name: "Rayquaza",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png",
    type: "Dragon/Flying",
    rarity: "legendary",
    difficulty: 10,
    description: "A legendary Pokémon that lives in the ozone layer.",
    catchRequirement: "Reach level 50 and complete 200 tasks",
    pointsReward: 600
  }
];

export const getPokemonByRarity = (rarity: string): CatchablePokemon[] => {
  return catchablePokemon.filter(pokemon => pokemon.rarity === rarity);
};

export const getPokemonByDifficulty = (minDifficulty: number, maxDifficulty: number): CatchablePokemon[] => {
  return catchablePokemon.filter(pokemon => 
    pokemon.difficulty >= minDifficulty && pokemon.difficulty <= maxDifficulty
  );
};

export const getRandomPokemon = (): CatchablePokemon => {
  const randomIndex = Math.floor(Math.random() * catchablePokemon.length);
  return catchablePokemon[randomIndex];
};

export const getPokemonById = (id: number): CatchablePokemon | undefined => {
  return catchablePokemon.find(pokemon => pokemon.id === id);
};
