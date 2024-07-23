const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const router = express.Router();
require('dotenv').config();
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID, // Ensure you have environment variables set up
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        function (accessToken, refreshToken, profile, cb) {
            // Code to process user data (e.g., save user profile to the database)
            return cb(null, profile); // This example just returns the profile as-is
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user); // Serialize user information
});

passport.deserializeUser((obj, done) => {
    done(null, obj); // Deserialize user information
});

router.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Authentication successful
        res.redirect('/');
    }
);
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});


router.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });
module.exports = router;
