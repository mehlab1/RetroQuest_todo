import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/api/auth/google/callback` : "http://localhost:3001/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { googleId: profile.id },
        include: {
          pokemonPet: true,
          gamification: true
        }
      });

      if (user) {
        // User exists, return them
        return done(null, user);
      }

      // User doesn't exist, create new user
      // Get random starter Pokémon
      const pokemonPets = await prisma.pokemonPet.findMany();
      const randomPet = pokemonPets[Math.floor(Math.random() * pokemonPets.length)];

      user = await prisma.user.create({
        data: {
          email: profile.emails[0].value,
          username: profile.displayName || profile.emails[0].value.split('@')[0],
          googleId: profile.id,
          pokemonPetId: randomPet?.petId,
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

      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }
));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.userId);
});

// Deserialize user from session
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        pokemonPet: true,
        gamification: true
      }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
