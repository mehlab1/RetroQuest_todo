import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: req.user.userId },
      include: {
        pokemonPet: true,
        gamification: true,
        _count: {
          select: {
            tasks: true,
            taskHistory: { where: { isDone: true } }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, pokemonPetId } = req.body;

    // If pokemonPetId is provided, we need to handle Pokemon companion switching
    if (pokemonPetId) {
      // First, find the catchable Pokemon
      const catchablePokemon = await prisma.catchable_pokemon.findUnique({
        where: { id: parseInt(pokemonPetId) }
      });

      if (!catchablePokemon) {
        return res.status(404).json({ error: 'Pokemon not found' });
      }

      // Check if user has caught this Pokemon
      const userCaughtPokemon = await prisma.userCaughtPokemon.findFirst({
        where: {
          userId: req.user.userId,
          catchable_pokemon_id: parseInt(pokemonPetId)
        }
      });

      if (!userCaughtPokemon) {
        return res.status(400).json({ error: 'You must catch this Pokemon first' });
      }

      // Find or create PokemonPet record
      let pokemonPet = await prisma.pokemonPet.findFirst({
        where: { name: catchablePokemon.name }
      });

      if (!pokemonPet) {
        pokemonPet = await prisma.pokemonPet.create({
          data: {
            name: catchablePokemon.name,
            spriteStage1: catchablePokemon.sprite,
            spriteStage2: catchablePokemon.sprite,
            spriteStage3: catchablePokemon.sprite,
            description: catchablePokemon.description,
            evolution_levels: { stage2: 16, stage3: 32 },
            type: catchablePokemon.type
          }
        });
      }

      // Update user with new PokemonPet
      const user = await prisma.user.update({
        where: { userId: req.user.userId },
        data: {
          username,
          pokemonPetId: pokemonPet.petId
        },
        include: {
          pokemonPet: true,
          gamification: true
        }
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      // Just update username
      const user = await prisma.user.update({
        where: { userId: req.user.userId },
        data: { username },
        include: {
          pokemonPet: true,
          gamification: true
        }
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        userId: true,
        username: true,
        level: true,
        points: true,
        pokemonPet: {
          select: {
            name: true,
            spriteStage1: true
          }
        },
        gamification: {
          select: {
            streakCount: true,
            badges: true
          }
        }
      },
      orderBy: [
        { points: 'desc' },
        { level: 'desc' }
      ],
      take: 10
    });

    res.json(users);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;