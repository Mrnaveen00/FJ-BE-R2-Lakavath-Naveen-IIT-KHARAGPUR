// ==========================================
// PASSPORT CONFIGURATION
// OAuth and authentication strategies
// ==========================================

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

// ==========================================
// GOOGLE OAUTH STRATEGY
// ==========================================
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('🔐 Google OAuth callback received');
          console.log('Profile:', profile);
          
          // Extract user data from Google profile
          const googleId = profile.id;
          const email = profile.emails[0]?.value;
          const fullName = profile.displayName;
          const profilePicture = profile.photos[0]?.value;
          
          if (!email) {
            return done(new Error('No email found in Google profile'), null);
          }
          
          // Check if user already exists with this Google ID
          let userResult = await db.query(
            'SELECT * FROM users WHERE google_id = $1',
            [googleId]
          );
          
          let user;
          
          if (userResult.rows.length > 0) {
            // User exists with Google ID - update last login
            user = userResult.rows[0];
            console.log('✅ Existing Google user found:', user.email);
            
            await db.query(
              'UPDATE users SET last_login = NOW() WHERE id = $1',
              [user.id]
            );
          } else {
            // Check if user exists with this email (regular signup)
            userResult = await db.query(
              'SELECT * FROM users WHERE email = $1',
              [email]
            );
            
            if (userResult.rows.length > 0) {
              // Link existing account with Google
              user = userResult.rows[0];
              console.log('🔗 Linking existing account with Google:', user.email);
              
              await db.query(
                'UPDATE users SET google_id = $1, profile_picture = $2, last_login = NOW() WHERE id = $3',
                [googleId, profilePicture, user.id]
              );
              
              user.google_id = googleId;
            } else {
              // Create new user with Google account
              console.log('✨ Creating new user with Google:', email);
              
              const insertResult = await db.query(
                `INSERT INTO users 
                 (id, full_name, email, google_id, profile_picture, is_active, last_login, created_at, updated_at)
                 VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW(), NOW(), NOW())
                 RETURNING *`,
                [fullName, email, googleId, profilePicture]
              );
              
              user = insertResult.rows[0];
              console.log('✅ New user created successfully');
            }
          }
          
          return done(null, user);
        } catch (error) {
          console.error('❌ Error in Google OAuth:', error);
          return done(error, null);
        }
      }
    )
  );
  
  console.log('✅ Google OAuth strategy configured');
} else {
  console.log('⚠️  Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)');
}

// ==========================================
// SERIALIZE/DESERIALIZE USER
// ==========================================

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      delete user.password; // Don't expose password
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
