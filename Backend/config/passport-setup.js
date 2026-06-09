const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/user');




const GOOGLE_CLIENT_ID = "143788219503-ru3g5r48bje37ea16sqca33ihq64hoi3.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const escapeEmailRegex = (email) =>
  email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/v2/user/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const googleEmail = profile.emails[0].value;

        // Check if user already exists
        let user = await User.findOne({
          email: new RegExp(`^${escapeEmailRegex(googleEmail)}$`, "i"),
        });

        if (user) {
          // If user exists, return the user
          return done(null, user);
        }

        // If user doesn't exist, create a new user
        user = await User.create({
          name: profile.displayName,
          email: googleEmail.toLowerCase(),
          avatar: {
            public_id: 'google-avatar',
            url: profile.photos[0].value,
          },
          // Set a random password since Google OAuth doesn't provide password
          password: Math.random().toString(36).slice(-8),
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;