import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user gamification stats
router.get('/', authenticateToken, async (req, res) => {
  try {
    let gamification = await prisma.gamification.findUnique({
      where: { userId: req.user.userId }
    });

    if (!gamification) {
      // Create gamification record if it doesn't exist
      gamification = await prisma.gamification.create({
        data: {
          userId: req.user.userId,
          points: 0,
          level: 1,
          streakCount: 0,
          badges: []
        }
      });
    }

    res.json(gamification);
  } catch (error) {
    console.error('Get gamification error:', error);
    res.status(500).json({ error: 'Failed to fetch gamification stats' });
  }
});

// Add badge
router.post('/badge', authenticateToken, async (req, res) => {
  try {
    const { badge } = req.body;

    if (!badge) {
      return res.status(400).json({ error: 'Badge name is required' });
    }

    const gamification = await prisma.gamification.findUnique({
      where: { userId: req.user.userId }
    });

    if (!gamification) {
      return res.status(404).json({ error: 'Gamification record not found' });
    }

    const updatedBadges = [...gamification.badges, badge];

    const updatedGamification = await prisma.gamification.update({
      where: { userId: req.user.userId },
      data: {
        badges: updatedBadges,
        lastUpdated: new Date()
      }
    });

    res.json(updatedGamification);
  } catch (error) {
    console.error('Add badge error:', error);
    res.status(500).json({ error: 'Failed to add badge' });
  }
});

export default router;