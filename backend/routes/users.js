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

    const user = await prisma.user.update({
      where: { userId: req.user.userId },
      data: {
        username,
        pokemonPetId: pokemonPetId ? parseInt(pokemonPetId) : undefined
      },
      include: {
        pokemonPet: true,
        gamification: true
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
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