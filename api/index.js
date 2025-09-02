import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const app = express();

// Initialize Prisma client with better error handling
let prisma;
try {
  prisma = new PrismaClient();
  console.log('Prisma client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  prisma = null;
}

// Trust proxy for Vercel deployment
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [/^https:\/\/retroquest-.*\.vercel\.app$/]
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Daily reset is now handled by cron job in backend/server.js

// Rate limiting for security
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use X-Forwarded-For header for Vercel, fallback to IP
    return req.headers['x-forwarded-for'] || req.ip || 'unknown';
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: { error: 'Too many registration attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use X-Forwarded-For header for Vercel, fallback to IP
    return req.headers['x-forwarded-for'] || req.ip || 'unknown';
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

// Input validation middleware
const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long');

const validateUsername = body('username')
  .isLength({ min: 3, max: 20 })
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage('Username must be 3-20 characters, letters, numbers, and underscores only');

// Daily reset is now handled by cron job in backend/server.js

// Function to update user points and check quest completion
const updateUserPoints = async (userId, pointsToAdd, reason = 'general') => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: parseInt(userId) },
      include: { gamification: true }
    });
    
    if (!user) return null;
    
    const newPoints = Math.max(0, user.points + pointsToAdd);
    const newLevel = Math.floor(newPoints / 100) + 1;
    const leveledUp = newLevel > user.level;
    
    // Update user points and level
    const updatedUser = await prisma.user.update({
      where: { userId: parseInt(userId) },
      data: {
        points: newPoints,
        level: newLevel
      },
      include: { gamification: true }
    });
    
    // Update or create gamification data
    if (user.gamification) {
      await prisma.gamification.update({
        where: { gamificationId: user.gamification.gamificationId },
        data: {
          points: newPoints,
          level: newLevel,
          lastUpdated: new Date()
        }
      });
    } else {
      await prisma.gamification.create({
        data: {
          userId: parseInt(userId),
          points: newPoints,
          level: newLevel,
          streakCount: 0,
          badges: []
        }
      });
    }
    
    // Check quest completion
    if (reason === 'task_completion') {
      const completedTasksCount = await prisma.task.count({
        where: { 
          userId: parseInt(userId),
          isDone: true
        }
      });
      
      // Check daily quests
      const userQuests = await prisma.dailyQuest.findMany({
        where: { 
          userId: parseInt(userId),
          isCompleted: false
        }
      });
      
      for (const quest of userQuests) {
        if (quest.title.includes('3 tasks') && completedTasksCount >= 3) {
          await prisma.dailyQuest.update({
            where: { questId: quest.questId },
            data: { isCompleted: true }
          });
          
          // Award additional points for quest completion
          await prisma.user.update({
            where: { userId: parseInt(userId) },
            data: { points: { increment: quest.points } }
          });
        }
      }
    } else if (reason === 'pokemon_catch') {
      const caughtPokemonCount = await prisma.userCaughtPokemon.count({
        where: { userId: parseInt(userId) }
      });
      
      // Check Pokemon catch quests
      const userQuests = await prisma.dailyQuest.findMany({
        where: { 
          userId: parseInt(userId),
          isCompleted: false
        }
      });
      
      for (const quest of userQuests) {
        if (quest.title.includes('Catch a Pokemon') && caughtPokemonCount >= 1) {
          await prisma.dailyQuest.update({
            where: { questId: quest.questId },
            data: { isCompleted: true }
          });
          
          // Award additional points for quest completion
          await prisma.user.update({
            where: { userId: parseInt(userId) },
            data: { points: { increment: quest.points } }
          });
        }
      }
    }
    
    return { user: updatedUser, leveledUp };
  } catch (error) {
    console.error('Error updating user points:', error);
    return null;
  }
};

// Pokemon data is now stored in the database via Prisma

// Enhanced Register with security
app.post('/api/auth/register', 
  registerLimiter,
  [validateEmail, validatePassword, validateUsername],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ 
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, username, password, pokemon } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: { email: email.toLowerCase() }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      // Check if username is taken
      const existingUsername = await prisma.user.findFirst({
        where: { username: username.toLowerCase() }
      });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username is already taken' });
      }

      // Hash password with higher salt rounds
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Validate Pokemon selection
      if (!pokemon || !pokemon.petId || !pokemon.name) {
        return res.status(400).json({ 
          error: 'Invalid Pokemon selection',
          message: 'Please select a valid Pokemon companion'
        });
      }

      // Find the selected Pokemon from our database using petId
      const selectedPet = await prisma.pokemonPet.findUnique({
        where: { 
          petId: pokemon.petId
        }
      });
      
      if (!selectedPet) {
        return res.status(400).json({ 
          error: 'Invalid Pokemon selection',
          message: `The selected Pokemon ${pokemon.name} is not available`
        });
      }

      // Create user with sanitized data
      const newUser = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          username: username.toLowerCase().trim(),
          password: hashedPassword,
          pokemonPetId: selectedPet.petId,
          points: 0,
          level: 1,
          gamification: {
            create: {
              points: 0,
              level: 1,
              streakCount: 0,
              badges: []
            }
          }
        },
        include: {
          pokemonPet: true,
          gamification: true
        }
      });

      // Generate JWT with shorter expiration for security
      const token = jwt.sign(
        { 
          userId: newUser.userId, 
          email: newUser.email,
          username: newUser.username
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      // Log successful registration (without sensitive data)
      console.log(`New user registered: ${newUser.username} (${newUser.email})`);

      res.status(201).json({
        message: 'Account created successfully',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ 
        error: 'Registration failed',
        message: 'Unable to create account. Please try again.'
      });
    }
  }
);

// Enhanced Login with security
app.post('/api/auth/login', 
  loginLimiter,
  [validateEmail],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Login validation errors:', errors.array());
        return res.status(400).json({ 
          error: 'Invalid email format',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      // Find user by email (case-insensitive)
      const user = await prisma.user.findFirst({
        where: { email: email.toLowerCase().trim() },
        include: {
          pokemonPet: true,
          gamification: true
        }
      });

      if (!user || !user.password) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Update last login timestamp
      if (user.gamification) {
        await prisma.gamification.update({
          where: { gamificationId: user.gamification.gamificationId },
          data: { lastUpdated: new Date() }
        });
      }

      // Generate JWT with shorter expiration for security
      const token = jwt.sign(
        { 
          userId: user.userId, 
          email: user.email,
          username: user.username
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Log successful login (without sensitive data)
      console.log(`User logged in: ${user.username} (${user.email})`);

      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Login failed',
        message: 'Unable to authenticate. Please try again.'
      });
    }
  }
);

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      include: {
        pokemonPet: true,
        gamification: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Tasks API
app.get('/api/tasks', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userTasks = await prisma.task.findMany({
      where: { userId: decoded.userId }
    });
    res.json(userTasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { title, description, category } = req.body;

    const newTask = await prisma.task.create({
      data: {
        userId: decoded.userId,
        title,
        description,
        category,
        isDone: false,
        priority: 'Medium'
      }
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task (full editing and completion toggle)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { id } = req.params;
    const { title, description, category, priority, isDone } = req.body;

    const task = await prisma.task.findFirst({
      where: { 
        taskId: parseInt(id),
        userId: decoded.userId 
      }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const wasDone = task.isDone;
    
    // Prepare update data
    const updateData = {
      updatedAt: new Date()
    };

    // Handle different types of updates
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (isDone !== undefined) updateData.isDone = isDone;
    
    const updatedTask = await prisma.task.update({
      where: { taskId: parseInt(id) },
      data: updateData
    });

    // Handle points and quest tracking only for completion changes
    if (isDone !== undefined && isDone !== wasDone) {
      if (isDone && !wasDone) {
        // Task completed - award points
        const result = await updateUserPoints(decoded.userId, 10, 'task_completion');
        if (result && result.leveledUp) {
          console.log(`User ${decoded.userId} leveled up to level ${result.user.level}!`);
        }
      } else if (!isDone && wasDone) {
        // Task uncompleted - remove points
        await updateUserPoints(decoded.userId, -10, 'task_incompletion');
      }
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Get today's tasks
app.get('/api/tasks/today', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const userTasks = await prisma.task.findMany({
      where: {
        userId: decoded.userId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });
    
    res.json(userTasks);
  } catch (error) {
    console.error('Get today tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch today tasks' });
  }
});

// Task History API
app.get('/api/tasks/history', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { days = 7 } = req.query;
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));
    
    const taskHistory = await prisma.taskHistory.findMany({
      where: {
        userId: decoded.userId,
        date: {
          gte: daysAgo
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    res.json(taskHistory);
  } catch (error) {
    console.error('Get task history error:', error);
    res.status(500).json({ error: 'Failed to fetch task history' });
  }
});

// Quests API
app.get('/api/quests/daily', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Daily reset is handled by cron job
    
    // Get user's daily quests
    const userQuests = await prisma.dailyQuest.findMany({
      where: { userId: decoded.userId }
    });
    
    // Get user's current progress
    const completedTasksCount = await prisma.task.count({
      where: { 
        userId: decoded.userId,
        isDone: true
      }
    });
    
    const caughtPokemonCount = await prisma.userCaughtPokemon.count({
      where: { userId: decoded.userId }
    });
    
    // Update quest progress
    const questsWithProgress = userQuests.map(quest => {
      let progress = 0;
      if (quest.title.includes('3 tasks')) {
        progress = Math.min(completedTasksCount, 3);
      } else if (quest.title.includes('Catch a Pokemon')) {
        progress = Math.min(caughtPokemonCount, 1);
      } else if (quest.title.includes('Login streak')) {
        progress = 1; // Always show some progress for login
      }
      
      return {
        ...quest,
        progress,
        isCompleted: quest.isCompleted || progress >= 1
      };
    });
    
    res.json(questsWithProgress);
  } catch (error) {
    console.error('Get daily quests error:', error);
    res.status(500).json({ error: 'Failed to fetch daily quests' });
  }
});

// Pokemon API
app.get('/api/pokemon', async (req, res) => {
  try {
    const pokemonPets = await prisma.pokemonPet.findMany({
      orderBy: { petId: 'asc' }
    });
    res.json({
      value: pokemonPets,
      Count: pokemonPets.length
    });
  } catch (error) {
    console.error('Get Pokemon pets error:', error);
    res.status(500).json({ error: 'Failed to fetch Pokemon pets' });
  }
});

app.get('/api/pokemon/available', async (req, res) => {
  try {
    const availablePokemon = await prisma.pokemonPet.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ data: availablePokemon });
  } catch (error) {
    console.error('Get available Pokemon error:', error);
    res.status(500).json({ error: 'Failed to fetch available Pokemon' });
  }
});

app.get('/api/pokemon/catchable', async (req, res) => {
  try {
    const catchablePokemon = await prisma.catchablePokemon.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ data: catchablePokemon });
  } catch (error) {
    console.error('Get catchable Pokemon error:', error);
    res.status(500).json({ error: 'Failed to fetch catchable Pokemon' });
  }
});

app.get('/api/pokemon/caught/my', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userPokemon = await prisma.userCaughtPokemon.findMany({
      where: { userId: decoded.userId },
      include: {
        catchablePokemon: true
      }
    });
    res.json({ data: userPokemon });
  } catch (error) {
    console.error('Get caught Pokemon error:', error);
    res.status(500).json({ error: 'Failed to fetch caught Pokemon' });
  }
});

app.post('/api/pokemon/catch', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { catchablePokemonId } = req.body;

    // Get the catchable Pokemon data
    const catchablePokemon = await prisma.catchablePokemon.findUnique({
      where: { id: catchablePokemonId }
    });

    if (!catchablePokemon) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    const newCaughtPokemon = await prisma.userCaughtPokemon.create({
      data: {
        userId: decoded.userId,
        catchablePokemonId: catchablePokemonId,
        caughtAt: new Date()
      },
      include: {
        catchablePokemon: true
      }
    });

    // Award points for catching Pokemon and check quest completion
    const result = await updateUserPoints(decoded.userId, catchablePokemon.pointsReward, 'pokemon_catch');
    
    let levelUpMessage = '';
    if (result && result.leveledUp) {
      levelUpMessage = ` Level up! You're now level ${result.user.level}!`;
      console.log(`User ${decoded.userId} leveled up to level ${result.user.level}!`);
    }

    res.json({ 
      success: true, 
      data: newCaughtPokemon,
      message: `Successfully caught ${catchablePokemon.name}!${levelUpMessage}`,
      pointsEarned: catchablePokemon.pointsReward,
      leveledUp: result ? result.leveledUp : false
    });
  } catch (error) {
    console.error('Catch Pokemon error:', error);
    res.status(500).json({ error: 'Failed to catch Pokemon' });
  }
});

// Sprite Serving API Endpoints
app.get('/api/pokemon/sprite/pet/:id/:stage', async (req, res) => {
  try {
    if (!prisma) {
      console.error('Prisma client not available for sprite request');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const { id, stage } = req.params;
    
    const pokemonPet = await prisma.pokemonPet.findUnique({
      where: { petId: parseInt(id) }
    });

    if (!pokemonPet) {
      return res.status(404).json({ error: 'Pokemon pet not found' });
    }

    let spriteData;
    switch (stage) {
      case '1':
        spriteData = pokemonPet.spriteStage1;
        break;
      case '2':
        spriteData = pokemonPet.spriteStage2;
        break;
      case '3':
        spriteData = pokemonPet.spriteStage3;
        break;
      default:
        spriteData = pokemonPet.spriteStage1;
    }

    if (!spriteData) {
      return res.status(404).json({ error: 'Sprite data not found' });
    }

    // Convert Base64 to buffer and serve as image
    const buffer = Buffer.from(spriteData, 'base64');
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(buffer);
  } catch (error) {
    console.error('Sprite serving error:', error);
    res.status(500).json({ error: 'Failed to serve sprite' });
  }
});

app.get('/api/pokemon/sprite/catchable/:id', async (req, res) => {
  try {
    if (!prisma) {
      console.error('Prisma client not available for catchable sprite request');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const { id } = req.params;
    
    const catchablePokemon = await prisma.catchablePokemon.findUnique({
      where: { id: parseInt(id) }
    });

    if (!catchablePokemon) {
      return res.status(404).json({ error: 'Catchable Pokemon not found' });
    }

    if (!catchablePokemon.sprite) {
      return res.status(404).json({ error: 'Sprite data not found' });
    }

    // Convert Base64 to buffer and serve as image
    const buffer = Buffer.from(catchablePokemon.sprite, 'base64');
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(buffer);
  } catch (error) {
    console.error('Sprite serving error:', error);
    res.status(500).json({ error: 'Failed to serve sprite' });
  }
});

app.get('/api/pokemon/gif/:id', async (req, res) => {
  try {
    if (!prisma) {
      console.error('Prisma client not available for GIF request');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const { id } = req.params;
    
    const pokemonGif = await prisma.pokemonGif.findUnique({
      where: { pokemonId: parseInt(id) }
    });

    if (!pokemonGif) {
      return res.status(404).json({ error: 'Pokemon GIF not found' });
    }

    if (!pokemonGif.gifData) {
      return res.status(404).json({ error: 'GIF data not found' });
    }

    // Convert Base64 to buffer and serve as GIF
    const buffer = Buffer.from(pokemonGif.gifData, 'base64');
    res.set('Content-Type', 'image/gif');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(buffer);
  } catch (error) {
    console.error('GIF serving error:', error);
    res.status(500).json({ error: 'Failed to serve GIF' });
  }
});

// Gamification API
app.get('/api/gamification', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      include: { gamification: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalTasksCompleted = await prisma.task.count({
      where: { 
        userId: decoded.userId,
        isDone: true
      }
    });

    const pokemonCaught = await prisma.userCaughtPokemon.count({
      where: { userId: decoded.userId }
    });

    const stats = {
      points: user.gamification?.points || 0,
      level: user.gamification?.level || 1,
      streakCount: user.gamification?.streakCount || 0,
      badges: user.gamification?.badges || [],
      totalTasksCompleted,
      pokemonCaught
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get gamification stats error:', error);
    res.status(500).json({ error: 'Failed to fetch gamification stats' });
  }
});

// History API
app.get('/api/history', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const days = parseInt(req.query.days) || 7;
    
    // Daily reset is handled by cron job
    
    const userTasks = await prisma.task.findMany({
      where: { userId: decoded.userId }
    });
    
    const userPokemon = await prisma.userCaughtPokemon.findMany({
      where: { userId: decoded.userId }
    });
    
    const userTaskHistory = await prisma.taskHistory.findMany({
      where: { userId: decoded.userId }
    });
    
    // Generate chart data for the specified number of days
    const chartData = [];
    const completedTasks = userTasks.filter(task => task.isDone);
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Get tasks from both current tasks and history
      const dayTasks = userTasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= startOfDay && taskDate <= endOfDay;
      });
      
      const dayHistory = userTaskHistory.filter(h => {
        const historyDate = new Date(h.date);
        return historyDate >= startOfDay && historyDate <= endOfDay;
      });
      
      const dayCompleted = dayTasks.filter(task => task.isDone).length + 
                          dayHistory.filter(h => h.isDone).length;
      const dayTotal = dayTasks.length + dayHistory.length;
      
      chartData.push({
        date: date.toISOString().split('T')[0],
        completed: dayCompleted,
        total: dayTotal
      });
    }
    
    const history = {
      tasks: userTasks.slice(-days * 5), // Last 5 tasks per day
      pokemon: userPokemon.slice(-days * 3), // Last 3 Pokemon per day
      totalTasks: userTasks.length + userTaskHistory.length,
      completedTasks: completedTasks.length + userTaskHistory.filter(h => h.isDone).length,
      totalPokemon: userPokemon.length,
      chartData: chartData
    };
    
    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.get('/api/history/weekly', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const userTasks = await prisma.task.findMany({
      where: { userId: decoded.userId }
    });
    
    const userPokemon = await prisma.userCaughtPokemon.findMany({
      where: { userId: decoded.userId }
    });
    
    // Generate weekly data for the last 7 days
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const dayTasks = userTasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= startOfDay && taskDate <= endOfDay;
      });
      
      const dayCompleted = dayTasks.filter(task => task.isDone);
      
      weeklyData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: dayCompleted.length,
        total: dayTasks.length
      });
    }
    
    const weeklyStats = {
      tasksCompleted: userTasks.filter(t => t.isDone).length,
      pokemonCaught: userPokemon.length,
      totalPoints: userTasks.reduce((sum, t) => sum + (t.isDone ? 10 : 0), 0),
      averageTasksPerDay: Math.round(userTasks.length / 7),
      weeklyData: weeklyData
    };
    
    res.json(weeklyStats);
  } catch (error) {
    console.error('Get weekly stats error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly stats' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RetroQuest API is running!' });
});

// Debug endpoint for sprite testing
app.get('/api/debug/sprite-test', async (req, res) => {
  try {
    if (!prisma) {
      return res.status(500).json({ error: 'Prisma client not initialized' });
    }
    
    const samplePet = await prisma.pokemonPet.findFirst();
    const sampleCatchable = await prisma.catchablePokemon.findFirst();
    const sampleGif = await prisma.pokemonGif.findFirst();
    
    res.json({
      prismaInitialized: !!prisma,
      petExists: !!samplePet,
      catchableExists: !!sampleCatchable,
      gifExists: !!sampleGif,
      petDataLength: samplePet ? samplePet.spriteStage1.length : 0,
      catchableDataLength: sampleCatchable ? sampleCatchable.sprite.length : 0,
      gifDataLength: sampleGif ? sampleGif.gifData.length : 0,
      petName: samplePet?.name,
      catchableName: sampleCatchable?.name,
      gifName: sampleGif?.name
    });
  } catch (error) {
    console.error('Debug sprite test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test sprite endpoint with a simple image
app.get('/api/test-sprite', async (req, res) => {
  try {
    if (!prisma) {
      return res.status(500).json({ error: 'Prisma client not initialized' });
    }
    
    const samplePet = await prisma.pokemonPet.findFirst();
    if (!samplePet) {
      return res.status(404).json({ error: 'No Pokemon found in database' });
    }
    
    // Convert Base64 to buffer and serve as image
    const buffer = Buffer.from(samplePet.spriteStage1, 'base64');
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(buffer);
  } catch (error) {
    console.error('Test sprite error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple test endpoint without Prisma
app.get('/api/test-basic', (req, res) => {
  res.json({ 
    message: 'Basic API is working',
    timestamp: new Date().toISOString(),
    prismaAvailable: !!prisma
  });
});

// Test image endpoint - serves a simple 1x1 pixel PNG
app.get('/api/test-image', (req, res) => {
  try {
    // Create a simple 1x1 pixel PNG image
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x00, 0x01, // width: 1
      0x00, 0x00, 0x00, 0x01, // height: 1
      0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, etc.
      0x90, 0x77, 0x53, 0xDE, // CRC
      0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
      0x49, 0x44, 0x41, 0x54, // IDAT
      0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(pngData);
  } catch (error) {
    console.error('Test image error:', error);
    res.status(500).json({ error: 'Failed to serve test image' });
  }
});

// Sprite Serving API Endpoints
app.get('/api/pokemon/sprite/pet/:id/:stage', async (req, res) => {
  try {
    if (!prisma) {
      console.error('Prisma client not available for sprite request');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const { id, stage } = req.params;
    
    const pokemonPet = await prisma.pokemonPet.findUnique({
      where: { petId: parseInt(id) }
    });

    if (!pokemonPet) {
      return res.status(404).json({ error: 'Pokemon pet not found' });
    }

    let spriteData;
    switch (stage) {
      case '1':
        spriteData = pokemonPet.spriteStage1;
        break;
      case '2':
        spriteData = pokemonPet.spriteStage2;
        break;
      case '3':
        spriteData = pokemonPet.spriteStage3;
        break;
      default:
        spriteData = pokemonPet.spriteStage1;
    }

    if (!spriteData) {
      return res.status(404).json({ error: 'Sprite data not found' });
    }

    // Convert Base64 to buffer and serve as image
    const buffer = Buffer.from(spriteData, 'base64');
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(buffer);
  } catch (error) {
    console.error('Sprite serving error:', error);
    res.status(500).json({ error: 'Failed to serve sprite' });
  }
});

app.get('/api/pokemon/sprite/catchable/:id', async (req, res) => {
  try {
    if (!prisma) {
      console.error('Prisma client not available for catchable sprite request');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const { id } = req.params;
    
    const catchablePokemon = await prisma.catchablePokemon.findUnique({
      where: { id: parseInt(id) }
    });

    if (!catchablePokemon) {
      return res.status(404).json({ error: 'Catchable Pokemon not found' });
    }

    if (!catchablePokemon.sprite) {
      return res.status(404).json({ error: 'Sprite data not found' });
    }

    // Convert Base64 to buffer and serve as image
    const buffer = Buffer.from(catchablePokemon.sprite, 'base64');
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(buffer);
  } catch (error) {
    console.error('Sprite serving error:', error);
    res.status(500).json({ error: 'Failed to serve sprite' });
  }
});

app.get('/api/pokemon/gif/:id', async (req, res) => {
  try {
    if (!prisma) {
      console.error('Prisma client not available for GIF request');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const { id } = req.params;
    
    const pokemonGif = await prisma.pokemonGif.findUnique({
      where: { pokemonId: parseInt(id) }
    });

    if (!pokemonGif) {
      return res.status(404).json({ error: 'Pokemon GIF not found' });
    }

    if (!pokemonGif.gifData) {
      return res.status(404).json({ error: 'GIF data not found' });
    }

    // Convert Base64 to buffer and serve as GIF
    const buffer = Buffer.from(pokemonGif.gifData, 'base64');
    res.set('Content-Type', 'image/gif');
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(buffer);
  } catch (error) {
    console.error('GIF serving error:', error);
    res.status(500).json({ error: 'Failed to serve GIF' });
  }
});

// Catch-all route for 404s
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    message: `The route ${req.originalUrl} does not exist`,
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/login', 
      'GET /api/auth/me',
      'GET /api/tasks',
      'POST /api/tasks',
      'GET /api/tasks/today',
      'GET /api/quests/daily',
      'GET /api/gamification',
      'GET /api/history',
      'GET /api/history/weekly',
      'GET /api/pokemon/caught/my',
      'POST /api/pokemon/catch',
      'GET /api/health'
    ]
  });
});

// Export for Vercel
export default app;
