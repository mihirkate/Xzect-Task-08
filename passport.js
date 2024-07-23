const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
require('dotenv').config();
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'https://mihirkate-xzect-task-08.onrender.com/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            // Handle user data
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    // Code to serialize user data
    done(null, user);
});

passport.deserializeUser((id, done) => {
    // Code to deserialize user data
    done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://mihirkate-xzect-task-08.onrender.com/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        done(null, profile)
    }
));
