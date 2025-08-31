import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';
import '../config/passport.js';

const router = express.Router();
const prisma = new PrismaClient();

// Rate limiting for registration attempts
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 registration attempts per windowMs
  message: {
    error: 'Too many registration attempts. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.connection.remoteAddress
});

// Input validation middleware
const validateRegistrationInput = (req, res, next) => {
  const { email, username, password } = req.body;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format',
      message: 'Please provide a valid email address'
    });
  }

  // Username validation
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!username || !usernameRegex.test(username)) {
    return res.status(400).json({
      error: 'Invalid username format',
      message: 'Username must be 3-20 characters, letters, numbers, and underscores only'
    });
  }

  // Password validation
  if (!password || password.length < 8) {
    return res.status(400).json({
      error: 'Password too short',
      message: 'Password must be at least 8 characters long'
    });
  }

  // Check for common weak passwords
  const weakPasswords = ['password', '123456', '12345678', 'qwerty', 'abc123', 'password123'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return res.status(400).json({
      error: 'Weak password',
      message: 'Please choose a stronger password'
    });
  }

  // Check password complexity
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return res.status(400).json({
      error: 'Password complexity requirements not met',
      message: 'Password must contain uppercase, lowercase, number, and special character'
    });
  }

  next();
};

// Check for existing user
const checkExistingUser = async (req, res, next) => {
  try {
    const { email, username } = req.body;

    // Check for existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingEmail) {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'An account with this email already exists'
      });
    }

    // Check for existing username
    const existingUsername = await prisma.user.findFirst({
      where: { username: username.toLowerCase() }
    });

    if (existingUsername) {
      return res.status(409).json({
        error: 'Username already exists',
        message: 'This username is already taken'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking existing user:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Unable to verify account availability'
    });
  }
};

// Registration route with enhanced security
router.post('/register', 
  registrationLimiter,
  validateRegistrationInput,
  checkExistingUser,
  async (req, res) => {
    try {
      const { email, username, password, pokemon } = req.body;

      // Additional server-side validation
      if (!pokemon || !pokemon.id || !pokemon.name) {
        return res.status(400).json({
          error: 'Invalid Pokemon selection',
          message: 'Please select a valid Pokemon companion'
        });
      }

      // Hash password with higher salt rounds for better security
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Find or create Pokemon pet
      let pokemonPet = await prisma.pokemonPet.findFirst({
        where: { petId: pokemon.id }
      });

      if (!pokemonPet) {
        pokemonPet = await prisma.pokemonPet.create({
          data: {
            petId: pokemon.id,
            name: pokemon.name,
            spriteStage1: pokemon.spriteStage1,
            spriteStage2: pokemon.spriteStage2,
            spriteStage3: pokemon.spriteStage3,
            levelRequired: pokemon.evolutionLevels.stage2
          }
        });
      }

      // Create user with sanitized data
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          username: username.toLowerCase().trim(),
          password: hashedPassword,
          pokemonPetId: pokemonPet.petId,
          level: 1,
          points: 0,
          gamification: {
            totalTasksCompleted: 0,
            streakDays: 0,
            achievements: [],
            lastLoginDate: new Date().toISOString()
          }
        },
        include: {
          pokemonPet: true
        }
      });

      // Generate JWT token with shorter expiration for security
      const token = jwt.sign(
        { 
          userId: user.userId,
          email: user.email,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Reduced from default to 7 days
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Set secure cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Log successful registration (without sensitive data)
      console.log(`New user registered: ${user.username} (${user.email})`);

      res.status(201).json({
        message: 'Account created successfully',
        user: userWithoutPassword,
        token
      });

    } catch (error) {
      console.error('Registration error:', error);
      
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

// Enhanced login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Please provide both email and password'
      });
    }

    // Find user by email (case-insensitive)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        pokemonPet: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Update last login
    await prisma.user.update({
      where: { userId: user.userId },
      data: {
        gamification: {
          ...user.gamification,
          lastLoginDate: new Date().toISOString()
        }
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.userId,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Set secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

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

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      include: {
        pokemonPet: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });

  } catch (error) {
    console.error('Profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Authentication failed'
      });
    }
    res.status(500).json({
      error: 'Profile fetch failed',
      message: 'Unable to fetch profile'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { pokemonPet } = req.body;

    if (pokemonPet) {
      // Update Pokemon companion
      const updatedUser = await prisma.user.update({
        where: { userId: decoded.userId },
        data: {
          pokemonPetId: pokemonPet.petId
        },
        include: {
          pokemonPet: true
        }
      });

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ 
        message: 'Profile updated successfully',
        user: userWithoutPassword 
      });
    } else {
      res.status(400).json({
        error: 'Invalid update data',
        message: 'No valid update data provided'
      });
    }

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'Unable to update profile'
    });
  }
});

export default router;