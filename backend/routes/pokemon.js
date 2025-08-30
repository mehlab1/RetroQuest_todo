import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all Pokémon pets
router.get('/', async (req, res) => {
  try {
    const pokemonPets = await prisma.pokemonPet.findMany({
      orderBy: { petId: 'asc' }
    });

    res.json(pokemonPets);
  } catch (error) {
    console.error('Get Pokémon error:', error);
    res.status(500).json({ error: 'Failed to fetch Pokémon pets' });
  }
});

// Get Pokémon by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const pokemonPet = await prisma.pokemonPet.findUnique({
      where: { petId: parseInt(id) }
    });

    if (!pokemonPet) {
      return res.status(404).json({ error: 'Pokémon pet not found' });
    }

    res.json(pokemonPet);
  } catch (error) {
    console.error('Get Pokémon by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch Pokémon pet' });
  }
});

export default router;