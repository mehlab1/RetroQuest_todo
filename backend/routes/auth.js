import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

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

// Enhanced Register with security
router.post('/register', 
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

      const { email, username, password, pokemon } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
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

      // Create or find the selected Pokemon pet
      let pokemonPet;
      if (pokemon) {
        // Check if Pokemon pet already exists
        pokemonPet = await prisma.pokemonPet.findFirst({
          where: { name: pokemon.name }
        });

        if (!pokemonPet) {
          // Create new Pokemon pet
          pokemonPet = await prisma.pokemonPet.create({
            data: {
              name: pokemon.name,
              spriteStage1: pokemon.spriteStage1,
              spriteStage2: pokemon.spriteStage2,
              spriteStage3: pokemon.spriteStage3,
              type: pokemon.type,
              description: pokemon.description,
              evolutionLevels: pokemon.evolutionLevels
            }
          });
        }
      } else {
        // Fallback to random Pokemon if none selected
        const pokemonPets = await prisma.pokemonPet.findMany();
        pokemonPet = pokemonPets[Math.floor(Math.random() * pokemonPets.length)];
      }

      // Create user with sanitized data
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          username: username.toLowerCase().trim(),
          password: hashedPassword,
          pokemonPetId: pokemonPet?.petId,
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
          userId: user.userId, 
          email: user.email,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Reduced from 24h to 7 days
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Log successful registration (without sensitive data)
      console.log(`New user registered: ${user.username} (${user.email})`);

      res.status(201).json({
        message: 'Account created successfully',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Register error:', error);
      
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'Duplicate entry',
          message: 'An account with this email or username already exists'
        });
      }

      res.status(500).json({ 
        error: 'Registration failed',
        message: 'Unable to create account. Please try again.'
      });
    }
  }
);

// Enhanced Login with security
router.post('/login', 
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
      const user = await prisma.user.findUnique({
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

    // Update last updated timestamp in gamification
    await prisma.user.update({
      where: { userId: user.userId },
      data: {
        gamification: {
          update: {
            lastUpdated: new Date()
          }
        }
      }
    });

    // Generate JWT with shorter expiration for security
    const token = jwt.sign(
      { 
        userId: user.userId, 
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Reduced from 24h to 7 days
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
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }), 
  async (req, res) => {
    try {
      const user = req.user;
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userWithoutPassword))}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }
);

export default router;