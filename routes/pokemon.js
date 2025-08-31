import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

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

// Get user's caught Pokemon
router.get('/caught/my', authenticateToken, async (req, res) => {
  try {
    const caughtPokemon = await prisma.userCaughtPokemon.findMany({
      where: { userId: req.user.userId },
      orderBy: { caughtAt: 'desc' }
    });

    res.json({ success: true, data: caughtPokemon });
  } catch (error) {
    console.error('Get caught Pokemon error:', error);
    res.status(500).json({ error: 'Failed to fetch caught Pokemon' });
  }
});

// Catch a Pokemon
router.post('/catch', authenticateToken, async (req, res) => {
  try {
    const { pokemonId, pokemonName, pokemonSprite, pokemonType, rarity, difficulty, description, pointsReward } = req.body;
    const userId = req.user.userId;

    // Check if Pokemon is already caught
    const existingCatch = await prisma.userCaughtPokemon.findUnique({
      where: { 
        userId_pokemonId: { 
          userId: userId, 
          pokemonId: pokemonId 
        } 
      }
    });

    if (existingCatch) {
      return res.status(400).json({ error: 'Pokemon already caught' });
    }

    // Create caught Pokemon record
    const caughtPokemon = await prisma.userCaughtPokemon.create({
      data: {
        userId,
        pokemonId,
        pokemonName,
        pokemonSprite,
        pokemonType,
        rarity,
        difficulty,
        description,
        pointsReward
      }
    });

    // Update user points
    await prisma.user.update({
      where: { userId },
      data: { 
        points: { increment: pointsReward }
      }
    });

    res.json({ 
      success: true, 
      message: `Successfully caught ${pokemonName}!`,
      data: caughtPokemon 
    });
  } catch (error) {
    console.error('Catch Pokemon error:', error);
    res.status(500).json({ error: 'Failed to catch Pokemon' });
  }
});

// Release a Pokemon (optional feature)
router.delete('/release/:pokemonId', authenticateToken, async (req, res) => {
  try {
    const { pokemonId } = req.params;
    const userId = req.user.userId;

    const deletedPokemon = await prisma.userCaughtPokemon.deleteMany({
      where: { 
        userId: userId,
        pokemonId: parseInt(pokemonId)
      }
    });

    if (deletedPokemon.count === 0) {
      return res.status(404).json({ error: 'Pokemon not found in your collection' });
    }

    res.json({ success: true, message: 'Pokemon released successfully' });
  } catch (error) {
    console.error('Release Pokemon error:', error);
    res.status(500).json({ error: 'Failed to release Pokemon' });
  }
});

export default router;