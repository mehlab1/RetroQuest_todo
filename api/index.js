import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://retroquest-ea98bc3c3-mehlabs-projects-0a6c62f2.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Rate limiting for security
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: { error: 'Too many registration attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation middleware
const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

const validatePassword = body('password')
  .isLength({ min: 8 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character');

const validateUsername = body('username')
  .isLength({ min: 3, max: 20 })
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage('Username must be 3-20 characters, letters, numbers, and underscores only');

// In-memory storage for demo (in production, use a real database)
let users = [];
let tasks = [];
let caughtPokemon = [];

// Pokemon data
const pokemonPets = [
  {
    petId: 1,
    name: 'Charmander',
    spriteStage1: '🦎',
    spriteStage2: '🐲',
    spriteStage3: '🔥',
    levelRequired: 1
  },
  {
    petId: 2,
    name: 'Bulbasaur',
    spriteStage1: '🌱',
    spriteStage2: '🌿',
    spriteStage3: '🌳',
    levelRequired: 1
  },
  {
    petId: 3,
    name: 'Squirtle',
    spriteStage1: '🐢',
    spriteStage2: '🌊',
    spriteStage3: '💧',
    levelRequired: 1
  },
  {
    petId: 4,
    name: 'Pikachu',
    spriteStage1: '⚡',
    spriteStage2: '🔋',
    spriteStage3: '⚡',
    levelRequired: 5
  }
];

// Enhanced Register with security
app.post('/auth/register', 
  registerLimiter,
  [validateEmail, validatePassword, validateUsername],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, username, password } = req.body;

      // Check if user exists
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      // Check if username is taken
      const existingUsername = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (existingUsername) {
        return res.status(400).json({ error: 'Username is already taken' });
      }

      // Hash password with higher salt rounds
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Get random starter Pokémon
      const randomPet = pokemonPets[Math.floor(Math.random() * pokemonPets.length)];

      // Create user with sanitized data
      const newUser = {
        userId: users.length + 1,
        email: email.toLowerCase().trim(),
        username: username.toLowerCase().trim(),
        password: hashedPassword,
        pokemonPetId: randomPet?.petId,
        points: 0,
        level: 1,
        pokemonPet: randomPet,
        gamification: {
          points: 0,
          level: 1,
          streakCount: 0,
          badges: [],
          lastLoginDate: new Date().toISOString()
        },
        createdAt: new Date().toISOString()
      };

      users.push(newUser);

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
app.post('/auth/login', 
  loginLimiter,
  [validateEmail],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
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
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

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
      user.gamification.lastLoginDate = new Date().toISOString();

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
app.get('/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.find(u => u.userId === decoded.userId);
    
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
app.get('/tasks', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userTasks = tasks.filter(task => task.userId === decoded.userId);
    res.json(userTasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/tasks', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { title, description, category } = req.body;

    const newTask = {
      id: tasks.length + 1,
      userId: decoded.userId,
      title,
      description,
      category,
      isDone: false,
      priority: 'Medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Pokemon API
app.get('/pokemon/caught/my', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userPokemon = caughtPokemon.filter(p => p.userId === decoded.userId);
    res.json({ data: userPokemon });
  } catch (error) {
    console.error('Get caught Pokemon error:', error);
    res.status(500).json({ error: 'Failed to fetch caught Pokemon' });
  }
});

app.post('/pokemon/catch', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const pokemonData = req.body;

    const newCaughtPokemon = {
      id: caughtPokemon.length + 1,
      userId: decoded.userId,
      ...pokemonData,
      caughtAt: new Date().toISOString()
    };

    caughtPokemon.push(newCaughtPokemon);

    // Update user points
    const user = users.find(u => u.userId === decoded.userId);
    if (user) {
      user.points += pokemonData.pointsReward || 0;
      user.gamification.points += pokemonData.pointsReward || 0;
    }

    res.json({ 
      success: true, 
      data: newCaughtPokemon,
      message: `Successfully caught ${pokemonData.pokemonName}!`
    });
  } catch (error) {
    console.error('Catch Pokemon error:', error);
    res.status(500).json({ error: 'Failed to catch Pokemon' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'RetroQuest API is running!' });
});

// Export for Vercel
export default app;
