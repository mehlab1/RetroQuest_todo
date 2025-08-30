import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get task history with stats
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const history = await prisma.taskHistory.findMany({
      where: {
        userId: req.user.userId,
        date: {
          gte: daysAgo
        }
      },
      include: {
        task: {
          select: {
            title: true,
            category: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    // Group by date for charts
    const dailyStats = {};
    history.forEach(entry => {
      const dateKey = entry.date.toISOString().split('T')[0];
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = {
          date: dateKey,
          completed: 0,
          total: 0
        };
      }
      dailyStats[dateKey].total++;
      if (entry.isDone) {
        dailyStats[dateKey].completed++;
      }
    });

    const chartData = Object.values(dailyStats).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    res.json({
      history,
      chartData,
      totalTasks: history.length,
      completedTasks: history.filter(h => h.isDone).length
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch task history' });
  }
});

// Get weekly stats
router.get('/weekly', authenticateToken, async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const history = await prisma.taskHistory.findMany({
      where: {
        userId: req.user.userId,
        date: {
          gte: weekAgo
        }
      }
    });

    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateKey = date.toISOString().split('T')[0];
      
      const dayHistory = history.filter(h => 
        h.date.toISOString().split('T')[0] === dateKey
      );

      return {
        date: dateKey,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: dayHistory.filter(h => h.isDone).length,
        total: dayHistory.length
      };
    });

    res.json(weeklyData);
  } catch (error) {
    console.error('Get weekly history error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly history' });
  }
});

export default router;