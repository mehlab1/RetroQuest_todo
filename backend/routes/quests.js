import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get daily quests for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const quests = await prisma.dailyQuest.findMany({
      where: {
        userId: req.user.userId,
        createdAt: {
          gte: today
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(quests);
  } catch (error) {
    console.error('Get quests error:', error);
    res.status(500).json({ error: 'Failed to fetch daily quests' });
  }
});

// Create daily quest
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, points = 25 } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const quest = await prisma.dailyQuest.create({
      data: {
        userId: req.user.userId,
        title,
        points
      }
    });

    res.status(201).json(quest);
  } catch (error) {
    console.error('Create quest error:', error);
    res.status(500).json({ error: 'Failed to create daily quest' });
  }
});

export default router;